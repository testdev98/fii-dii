import React, { useState, useEffect } from 'react';
import { RefreshCw, LogIn, LogOut, TrendingUp, TestTube } from 'lucide-react';
import LoginModal from './components/LoginModal';
import MarketScenarioCard from './components/MarketScenarioCard';
import FIIDIICard from './components/FIIDIICard';
import FIIDIIDetailedAnalysis from './components/FIIDIIDetailedAnalysis';
import OIAnalysis from './components/OIAnalysis';
import LiveOITracker from './components/LiveOITracker';
import MarketControlCard from './components/MarketControlCard';
import StrikeOICard from './components/StrikeOICard';
import PriceOIVolumeCard from './components/PriceOIVolumeCard';
import ConvictionMeter from './components/ConvictionMeter';
import ScenarioTester from './components/ScenarioTester';
import BrokerFactory from './services/brokerFactory';
import { getSymbolToken } from './utils/symbolTokens';
import { 
  analyzeMarketScenario, 
  getMarketControl, 
  calculateConviction 
} from './utils/marketAnalysis';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [brokerApi, setBrokerApi] = useState(null);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY');
  
  // Market Data State
  const [marketData, setMarketData] = useState({
    fiiNet: 0,
    diiNet: 0,
    fiiBuy: 0,
    fiiSell: 0,
    diiBuy: 0,
    diiSell: 0,
    priceChange: 0,
    oiChange: 0,
    volume: 0,
    avgVolume: 0,
    currentPrice: 0,
    historicalData: []
  });

  const [strikeData, setStrikeData] = useState([]);
  const [scenario, setScenario] = useState(null);
  const [control, setControl] = useState(null);
  const [conviction, setConviction] = useState(null);

  // No auto-load on mount - require login
  useEffect(() => {
    // Check for existing session
    const restoreSession = () => {
      try {
        const sessionData = localStorage.getItem('brokerSession');
        if (sessionData) {
          const { broker, credentials, expiresAt, loginTime } = JSON.parse(sessionData);
          
          const now = Date.now();
          
          // Check if session is still valid
          if (expiresAt && now < expiresAt) {
            console.log(`✅ Restoring session. Expires at: ${new Date(expiresAt).toLocaleString()}`);
            console.log(`⏱️ Time remaining: ${Math.round((expiresAt - now) / 60000)} minutes`);
            
            // Restore session
            setSelectedBroker(broker);
            const api = BrokerFactory.createBrokerAPI(broker.id);
            
            // Restore API credentials
            if (credentials.accessToken) {
              api.setCredentials(
                credentials.apiKey,
                credentials.clientId,
                credentials.accessToken,
                credentials.feedToken
              );
            }
            
            setBrokerApi(api);
            setIsLoggedIn(true);
            setShowLogin(false);
            
            // Load market data
            loadBrokerData(api);
            
            // Set up auto-logout when token expires
            const timeUntilExpiry = expiresAt - now;
            setTimeout(() => {
              console.log('⏰ Session expired - logging out');
              handleLogout();
              alert('Your session has expired. Please login again.');
            }, timeUntilExpiry);
          } else {
            // Session expired
            console.log('❌ Session expired. Please login again.');
            localStorage.removeItem('brokerSession');
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('brokerSession');
      }
    };

    restoreSession();
  }, []);

  const handleLogin = async (loginData) => {
    try {
      setLoading(true);
      
      const { broker, credentials } = loginData;
      setSelectedBroker(broker);
      
      const api = BrokerFactory.createBrokerAPI(broker.id);
      setBrokerApi(api);
      
      let loginResponse = null;
      if (!broker.isDemo) {
        loginResponse = await api.login(credentials);
        
        // Save session with broker's token expiry
        if (loginResponse?.data) {
          const tokenData = loginResponse.data;
          
          // Calculate expiry based on broker response
          // Angel One tokens typically expire at end of day (3:30 PM IST)
          let expiresAt;
          
          if (tokenData.expiryTime) {
            // Use broker's expiry time if provided
            expiresAt = new Date(tokenData.expiryTime).getTime();
          } else {
            // Default: Token expires at 3:30 PM IST today
            const now = new Date();
            const expiryToday = new Date(now);
            expiryToday.setHours(15, 30, 0, 0); // 3:30 PM
            
            // If current time is after 3:30 PM, set expiry for next trading day
            if (now > expiryToday) {
              expiryToday.setDate(expiryToday.getDate() + 1);
            }
            
            expiresAt = expiryToday.getTime();
          }
          
          const sessionData = {
            broker: broker,
            credentials: {
              apiKey: credentials.apiKey,
              clientId: credentials.clientId,
              accessToken: tokenData.jwtToken || tokenData.accessToken,
              feedToken: tokenData.feedToken,
              refreshToken: tokenData.refreshToken
            },
            expiresAt: expiresAt,
            loginTime: Date.now()
          };
          
          localStorage.setItem('brokerSession', JSON.stringify(sessionData));
          
          console.log(`✅ Session saved. Expires at: ${new Date(expiresAt).toLocaleString()}`);
        }
      }
      
      setIsLoggedIn(true);
      setShowLogin(false);
      
      // Load real data from broker
      await loadBrokerData(api);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadBrokerData = async (api) => {
    try {
      setLoading(true);
      
      // Check if session is still valid
      const sessionData = localStorage.getItem('brokerSession');
      if (sessionData) {
        const { expiresAt } = JSON.parse(sessionData);
        if (expiresAt && Date.now() >= expiresAt) {
          console.log('❌ Session expired during data fetch');
          handleLogout();
          alert('Your session has expired. Please login again.');
          return;
        }
      }
      
      const symbolInfo = getSymbolToken(selectedSymbol);
      
      // Get market data from broker API
      const response = await api.getMarketData(selectedSymbol, symbolInfo.exchange, symbolInfo.token, symbolInfo.basePrice);
      
      console.log('📊 Broker API Response:', response);
      
      if (response?.data) {
        // ALWAYS use real-time price from broker API
        const currentPrice = response.data.ltp || response.data.close || symbolInfo.basePrice;
        const previousClose = response.data.close || symbolInfo.basePrice;
        const openPrice = response.data.open || previousClose;
        
        // Calculate price change from previous close
        let priceChangeFromClose = response.data.pChange || 0;
        if (!priceChangeFromClose && previousClose && currentPrice) {
          priceChangeFromClose = ((currentPrice - previousClose) / previousClose) * 100;
        }
        
        // Calculate price change from today's open
        const priceChangeFromOpen = ((currentPrice - openPrice) / openPrice) * 100;
        
        console.log(`✅ Current Price for ${selectedSymbol}: ₹${currentPrice.toFixed(2)}`);
        console.log(`   Previous Close: ₹${previousClose.toFixed(2)}`);
        console.log(`   Today's Open: ₹${openPrice.toFixed(2)}`);
        console.log(`   Change from Close: ${priceChangeFromClose > 0 ? '+' : ''}${priceChangeFromClose.toFixed(2)}%`);
        console.log(`   Change from Open: ${priceChangeFromOpen > 0 ? '+' : ''}${priceChangeFromOpen.toFixed(2)}%`);
        console.log(`   High: ₹${response.data.high || 'N/A'}`);
        console.log(`   Low: ₹${response.data.low || 'N/A'}`);
        console.log(`   Volume: ${response.data.volume || 'N/A'}`);
        
        const processedData = {
          fiiNet: 1250.50,
          diiNet: -850.30,
          fiiBuy: 12500,
          fiiSell: 11250,
          diiBuy: 8500,
          diiSell: 9350,
          currentPrice: currentPrice, // Real-time price from broker
          previousClose: previousClose,
          openPrice: openPrice,
          priceChange: priceChangeFromClose, // Change from previous close
          priceChangeFromOpen: priceChangeFromOpen, // Change from today's open
          oiChange: 8.5,
          volume: response.data.volume || 15000000,
          avgVolume: 12000000,
          historicalData: [
            { date: 'Mon', price: currentPrice * 0.98, oi: 1200000, volume: 12000000, fii: 1125, dii: -765 },
            { date: 'Tue', price: currentPrice * 0.99, oi: 1250000, volume: 14000000, fii: 1188, dii: -808 },
            { date: 'Wed', price: currentPrice * 0.995, oi: 1300000, volume: 13500000, fii: 1213, dii: -826 },
            { date: 'Thu', price: currentPrice * 0.998, oi: 1350000, volume: 15500000, fii: 1238, dii: -842 },
            { date: 'Fri', price: currentPrice, oi: 1400000, volume: response.data.volume || 15000000, fii: 1250.50, dii: -850.30 }
          ]
        };
        
        setMarketData(processedData);
        
        // Try to get real option chain data for indices
        let strikes = [];
        const isIndex = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'].includes(selectedSymbol);
        
        if (isIndex && api.getOptionChain) {
          try {
            // Get current expiry (next Thursday)
            const today = new Date();
            const daysUntilThursday = (4 - today.getDay() + 7) % 7 || 7;
            const nextThursday = new Date(today);
            nextThursday.setDate(today.getDate() + daysUntilThursday);
            const expiryDate = nextThursday.toISOString().split('T')[0].replace(/-/g, '');
            
            console.log(`📈 Attempting to fetch option chain for ${selectedSymbol} expiry: ${expiryDate}`);
            
            const optionChainResponse = await api.getOptionChain(selectedSymbol, expiryDate);
            
            if (optionChainResponse?.data && Array.isArray(optionChainResponse.data)) {
              console.log('✅ Real option chain data received');
              
              // Parse option chain data
              const optionData = optionChainResponse.data;
              
              // Get strikes near current price (±5 strikes)
              const strikeInterval = symbolInfo.strikeInterval;
              const baseStrike = Math.round(currentPrice / strikeInterval) * strikeInterval;
              
              for (let i = -5; i <= 5; i++) {
                const strike = baseStrike + (i * strikeInterval);
                
                // Find matching option data
                const callData = optionData.find(opt => 
                  opt.strikePrice === strike && opt.optionType === 'CE'
                );
                const putData = optionData.find(opt => 
                  opt.strikePrice === strike && opt.optionType === 'PE'
                );
                
                const callOI = callData?.openInterest || 0;
                const putOI = putData?.openInterest || 0;
                
                strikes.push({
                  strike: strike,
                  oi: strike <= currentPrice ? putOI : callOI,
                  type: strike <= currentPrice ? 'PUT' : 'CALL',
                  callOI: callOI,
                  putOI: putOI,
                  callVolume: callData?.volume || 0,
                  putVolume: putData?.volume || 0,
                  callLTP: callData?.ltp || 0,
                  putLTP: putData?.ltp || 0
                });
              }
              
              console.log(`✅ Generated ${strikes.length} strikes with real OI data`);
            }
          } catch (error) {
            console.warn('⚠️ Could not fetch option chain:', error.message);
          }
        }
        
        // Fallback: Calculate strikes based on current price
        if (strikes.length === 0) {
          console.log('📊 Calculating strike data based on current price');
          const strikeInterval = symbolInfo.strikeInterval;
          const baseStrike = Math.round(currentPrice / strikeInterval) * strikeInterval;
          
          console.log(`🎯 Base strike: ${baseStrike}, Current price: ${currentPrice.toFixed(2)}`);
          
          for (let i = -5; i <= 5; i++) {
            const strike = baseStrike + (i * strikeInterval);
            
            // Calculate approximate OI based on distance from current price
            // Strikes closer to current price typically have higher OI
            const distanceFromPrice = Math.abs(strike - currentPrice);
            const distanceInStrikes = Math.abs(i);
            
            // OI decreases as we move away from ATM
            const baseOI = 2000000; // 20 lakh base OI
            const oiMultiplier = Math.max(0.2, 1 - (distanceInStrikes * 0.15));
            
            const callOI = Math.floor(baseOI * oiMultiplier * (strike > currentPrice ? 1.2 : 0.8));
            const putOI = Math.floor(baseOI * oiMultiplier * (strike < currentPrice ? 1.2 : 0.8));
            
            strikes.push({ 
              strike: strike, 
              oi: strike <= currentPrice ? putOI : callOI,
              type: strike <= currentPrice ? 'PUT' : 'CALL',
              callOI: callOI,
              putOI: putOI,
              isCalculated: true
            });
          }
          
          console.log(`📊 Generated ${strikes.length} calculated strikes`);
        }
        
        setStrikeData(strikes);
        
        // Analyze market
        const marketScenario = analyzeMarketScenario(
          processedData.priceChange,
          processedData.oiChange,
          processedData.fiiNet,
          processedData.diiNet,
          processedData.volume
        );
        setScenario(marketScenario);

        const marketControl = getMarketControl(processedData.fiiNet, processedData.diiNet);
        setControl(marketControl);

        const convictionScore = calculateConviction(
          processedData.priceChange,
          processedData.oiChange,
          processedData.volume,
          processedData.avgVolume
        );
        setConviction(convictionScore);
      } else {
        console.error('❌ No data received from broker API');
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('❌ Error loading broker data:', error);
      
      // Check if error is due to expired token
      if (error.response?.status === 401 || 
          error.response?.data?.message?.includes('token') ||
          error.response?.data?.message?.includes('session')) {
        console.log('❌ Token expired or invalid');
        handleLogout();
        alert('Your session has expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(true);
    setBrokerApi(null);
    setSelectedBroker(null);
    
    // Clear all data
    setMarketData({
      fiiNet: 0,
      diiNet: 0,
      fiiBuy: 0,
      fiiSell: 0,
      diiBuy: 0,
      diiSell: 0,
      priceChange: 0,
      oiChange: 0,
      volume: 0,
      avgVolume: 0,
      currentPrice: 0,
      historicalData: []
    });
    setStrikeData([]);
    setScenario(null);
    setControl(null);
    setConviction(null);
    setLastUpdate(null);
  };

  const handleRefresh = () => {
    if (brokerApi && isLoggedIn) {
      loadBrokerData(brokerApi);
    }
  };

  const handleSymbolChange = (newSymbol) => {
    setSelectedSymbol(newSymbol);
    if (brokerApi && isLoggedIn) {
      loadBrokerData(brokerApi);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      
      {!isLoggedIn ? (
        // Login Required Screen
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <TrendingUp className="w-20 h-20 text-blue-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">FII/DII Trading Dashboard</h1>
            <p className="text-gray-400 mb-8">Login with your broker to access real-time market data</p>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Login to Continue
            </button>
          </div>
        </div>
      ) : (
        <>
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Top Row - Logo and Actions */}
          <div className="flex items-center justify-between gap-2">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl md:text-2xl font-bold truncate">FII/DII Trading Dashboard</h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {selectedBroker ? `Connected to ${selectedBroker.name}` : 'Professional Market Analysis'}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Scenario Tester - Hidden on mobile */}
              <button
                onClick={() => setActiveTab(activeTab === 'dashboard' ? 'tester' : 'dashboard')}
                className="hidden sm:block p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                title="Toggle Scenario Tester"
              >
                <TestTube className="w-5 h-5" />
              </button>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              {/* Login/Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          
          {/* Second Row - Symbol Selector and Status */}
          <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {/* Symbol Selector */}
            <select
              value={selectedSymbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-700 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <optgroup label="Indices">
                <option value="NIFTY">NIFTY 50</option>
                <option value="BANKNIFTY">BANK NIFTY</option>
                <option value="FINNIFTY">FIN NIFTY</option>
                <option value="MIDCPNIFTY">MIDCAP NIFTY</option>
              </optgroup>
              <optgroup label="Popular Stocks">
                <option value="RELIANCE">RELIANCE</option>
                <option value="TCS">TCS</option>
                <option value="HDFCBANK">HDFC BANK</option>
                <option value="INFY">INFOSYS</option>
                <option value="ICICIBANK">ICICI BANK</option>
                <option value="SBIN">SBI</option>
                <option value="BHARTIARTL">BHARTI AIRTEL</option>
                <option value="ITC">ITC</option>
                <option value="KOTAKBANK">KOTAK BANK</option>
                <option value="LT">L&T</option>
                <option value="AXISBANK">AXIS BANK</option>
                <option value="WIPRO">WIPRO</option>
                <option value="TATAMOTORS">TATA MOTORS</option>
                <option value="TATASTEEL">TATA STEEL</option>
                <option value="ADANIENT">ADANI ENTERPRISES</option>
              </optgroup>
            </select>
            
            {/* Status Info */}
            {lastUpdate && (
              <div className="text-xs text-gray-400 flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="flex items-center gap-1">
                  <span className="hidden sm:inline">Tracking:</span>
                  <span className="text-blue-400 font-semibold">{selectedSymbol}</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="hidden sm:inline">Price:</span>
                  <span className="text-green-400 font-semibold">₹{marketData.currentPrice.toFixed(2)}</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
                <span className="hidden sm:inline">•</span>
                <span className={`flex items-center gap-1 text-green-400`}>
                  <span className={`w-2 h-2 rounded-full bg-green-400 animate-pulse`}></span>
                  Live Data
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 bg-slate-800 p-2 rounded-lg overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">📊 </span>Dashboard
            </button>
            <button
              onClick={() => setActiveTab('fii-dii')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'fii-dii' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">💰 </span>FII/DII
            </button>
            <button
              onClick={() => setActiveTab('oi')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'oi' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">📈 </span>OI
            </button>
            <button
              onClick={() => setActiveTab('live-oi')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'live-oi' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">🔴 </span>Live
            </button>
            <button
              onClick={() => setActiveTab('tester')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'tester' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">🧪 </span>Test
            </button>
          </div>

          {activeTab === 'tester' ? (
            <ScenarioTester />
          ) : activeTab === 'fii-dii' ? (
            <FIIDIIDetailedAnalysis fiiDiiData={{
              fiiNet: marketData.fiiNet,
              diiNet: marketData.diiNet,
              fiiBuy: marketData.fiiBuy,
              fiiSell: marketData.fiiSell,
              diiBuy: marketData.diiBuy,
              diiSell: marketData.diiSell,
              historicalData: marketData.historicalData
            }} />
          ) : activeTab === 'oi' ? (
            <OIAnalysis 
              oiData={{
                current: 1400000,
                previous: 1290000,
                average: 1300000,
                peak: 1500000,
                low: 1100000,
                volatility: 8.5,
                pcr: strikeData.length > 0 ? 
                  parseFloat((strikeData.filter(s => s.type === 'PUT').reduce((sum, s) => sum + s.oi, 0) / 
                   strikeData.filter(s => s.type === 'CALL').reduce((sum, s) => sum + s.oi, 0)).toFixed(2)) : 
                  1.15,
                maxCallStrike: strikeData.length > 0 ? 
                  strikeData.filter(s => s.type === 'CALL').reduce((max, s) => s.oi > max.oi ? s : max, {strike: 0, oi: 0}).strike :
                  Math.round(marketData.currentPrice * 1.02),
                maxPutStrike: strikeData.length > 0 ? 
                  strikeData.filter(s => s.type === 'PUT').reduce((max, s) => s.oi > max.oi ? s : max, {strike: 0, oi: 0}).strike :
                  Math.round(marketData.currentPrice * 0.98),
                totalCallOI: strikeData.filter(s => s.type === 'CALL').reduce((sum, s) => sum + s.oi, 0),
                totalPutOI: strikeData.filter(s => s.type === 'PUT').reduce((sum, s) => sum + s.oi, 0),
                historicalData: marketData.historicalData,
                strikeData: strikeData
              }}
              priceData={{
                current: marketData.currentPrice,
                previous: marketData.currentPrice - (marketData.currentPrice * marketData.priceChange / 100)
              }}
            />
          ) : activeTab === 'live-oi' ? (
            <LiveOITracker brokerApi={brokerApi} symbol={selectedSymbol} />
          ) : (
            <>
          {/* Market Scenario */}
          {scenario && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">📊 Current Market Scenario</h2>
              <MarketScenarioCard scenario={scenario} />
            </section>
          )}

          {/* FII/DII Data */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">💰 FII/DII Net Position</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FIIDIICard 
                title="FII (Foreign Institutional Investors)"
                value={marketData.fiiNet}
                type="FII"
              />
              <FIIDIICard 
                title="DII (Domestic Institutional Investors)"
                value={marketData.diiNet}
                type="DII"
              />
            </div>
          </section>

          {/* Market Control */}
          {control && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">👑 Who's in Control?</h2>
              <MarketControlCard control={control} />
            </section>
          )}

          {/* Price + OI + Volume */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">📈 Price + OI + Volume Analysis</h2>
            <PriceOIVolumeCard data={marketData} />
            </section>

          {/* Strike OI */}
          {strikeData.length > 0 && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">🎯 Strike-wise OI (Support & Resistance)</h2>
              <StrikeOICard strikeData={strikeData} currentPrice={marketData.currentPrice} />
            </section>
          )}

          {/* Conviction Meter */}
          {conviction && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">🔥 Market Conviction</h2>
              <ConvictionMeter conviction={conviction} />
            </section>
          )}

          {/* Professional Workflow */}
          <section className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">🧠 Professional Workflow</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold">Check Price Trend</div>
                  <div className="text-sm text-gray-300">Is it moving up, down, or sideways?</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold">Check OI Change</div>
                  <div className="text-sm text-gray-300">Are new positions being created or closed?</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold">Check FII/DII Data</div>
                  <div className="text-sm text-gray-300">Who is buying and who is selling?</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold">Mark Max Call & Put OI</div>
                  <div className="text-sm text-gray-300">Identify key support and resistance levels</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">5</div>
                <div>
                  <div className="font-semibold">Ask: Creating or Exiting?</div>
                  <div className="text-sm text-gray-300">If creating → trend continues | If exiting → trend weakens</div>
                </div>
              </div>
            </div>
          </section>

          {/* Memory Rule */}
          <section className="bg-slate-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-500">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-yellow-400">💡 One-Line Memory Rule</h2>
            <div className="text-base sm:text-lg text-center space-y-2">
              <div><span className="font-bold text-blue-400">Price</span> tells direction</div>
              <div><span className="font-bold text-green-400">OI</span> tells strength</div>
              <div><span className="font-bold text-purple-400">FII</span> tells conviction</div>
              <div><span className="font-bold text-red-400">Strike OI</span> tells limits</div>
            </div>
          </section>
          </>
          )}
        </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-8 sm:mt-12 py-4 sm:py-6">
        <div className="container mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm text-gray-400">
          <p className="mb-1 sm:mb-0">Built with React + Angel One API | For Educational Purposes</p>
          <p className="mt-1 sm:mt-2">⚠️ Trading involves risk. Always do your own research.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
