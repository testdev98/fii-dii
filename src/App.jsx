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
import SectorAnalysis from './components/SectorAnalysis';
import InfoTooltip from './components/InfoTooltip';
import BrokerFactory from './services/brokerFactory';
import NSEAPI from './services/nseApi';
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
        
        // Fetch real FII/DII data from NSE
        console.log('📊 Fetching FII/DII data from NSE...');
        const fiiDiiResponse = await NSEAPI.getFIIDIIData();
        
        let fiiDiiData = {
          fiiNet: 0,
          diiNet: 0,
          fiiBuy: 0,
          fiiSell: 0,
          diiBuy: 0,
          diiSell: 0,
          fiiDiiDate: 'Data Unavailable',
          fiiDiiAvailable: false
        };
        
        if (fiiDiiResponse.success && fiiDiiResponse.data) {
          console.log('✅ Real FII/DII data received from NSE');
          fiiDiiData = {
            fiiNet: fiiDiiResponse.data.fii.net,
            diiNet: fiiDiiResponse.data.dii.net,
            fiiBuy: fiiDiiResponse.data.fii.buy,
            fiiSell: fiiDiiResponse.data.fii.sell,
            diiBuy: fiiDiiResponse.data.dii.buy,
            diiSell: fiiDiiResponse.data.dii.sell,
            fiiDiiDate: fiiDiiResponse.data.date,
            fiiDiiAvailable: true
          };
        } else {
          console.warn('⚠️ FII/DII data not available from NSE');
          console.warn('   Reason:', fiiDiiResponse.error || 'Unknown');
        }
        
        // Fetch real historical data from broker
        console.log('📊 Fetching historical data from broker...');
        const historicalResponse = await api.getHistoricalData(
          symbolInfo.token,
          symbolInfo.exchange,
          'ONE_DAY',
          this.getDateString(-7),
          this.getDateString(0)
        );
        
        let historicalData = [];
        if (historicalResponse?.success && historicalResponse.data) {
          console.log('✅ Real historical data received');
          // Process historical data from broker
          historicalData = historicalResponse.data.map((candle, index) => ({
            date: candle[0] || `Day ${index + 1}`, // timestamp
            price: parseFloat(candle[4]) || currentPrice, // close price
            oi: parseInt(candle[5]) || 0, // open interest (if available)
            volume: parseInt(candle[6]) || 0, // volume
            fii: 0, // FII data not available in candle data
            dii: 0  // DII data not available in candle data
          }));
        } else {
          console.warn('⚠️ Historical data not available from broker');
          // Don't create fake historical data - leave it empty
          historicalData = [];
        }
        
        const processedData = {
          // Real FII/DII data from NSE (T-1 data)
          ...fiiDiiData,
          // Real-time price data from broker
          currentPrice: currentPrice,
          previousClose: previousClose,
          openPrice: openPrice,
          priceChange: priceChangeFromClose,
          priceChangeFromOpen: priceChangeFromOpen,
          oiChange: response.data.oiChange || 0, // OI change from broker if available
          volume: response.data.volume || 0,
          avgVolume: 0, // Calculate from historical data if available
          historicalData: historicalData
        };
        
        // Calculate average volume from historical data
        if (historicalData.length > 0) {
          const totalVolume = historicalData.reduce((sum, day) => sum + day.volume, 0);
          processedData.avgVolume = Math.floor(totalVolume / historicalData.length);
        }
        
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
        
        // Fallback: Show warning that option chain data is not available
        if (strikes.length === 0) {
          console.warn('⚠️ Option chain data not available from broker');
          console.warn('💡 Strike OI data cannot be displayed without real option chain');
          
          // Don't calculate fake OI - leave strikes empty
          // The UI will handle showing appropriate message
          strikes = [];
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
    console.log(`📊 Changing symbol from ${selectedSymbol} to ${newSymbol}`);
    setSelectedSymbol(newSymbol);
    // Data will be loaded by useEffect when selectedSymbol changes
  };

  // Helper method for date string formatting
  const getDateString = (daysOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0] + ' 09:00';
  };

  // Auto-reload data when symbol changes (but not on initial mount)
  useEffect(() => {
    // Skip if not logged in or no broker API
    if (!brokerApi || !isLoggedIn) {
      return;
    }

    // Skip on initial mount (when selectedSymbol is still 'NIFTY' and no data loaded yet)
    if (!lastUpdate && selectedSymbol === 'NIFTY') {
      return;
    }

    console.log(`🔄 Symbol changed to ${selectedSymbol}, reloading data...`);
    loadBrokerData(brokerApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymbol]); // Only trigger when selectedSymbol changes

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      
      {!isLoggedIn ? (
        // Login Required Screen
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-slate-700 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-10 h-10 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                FII/DII Trading Dashboard
              </h1>
              <p className="text-slate-400 mb-8">Login with your broker to access real-time market data</p>
            </div>
            <button
              onClick={() => setShowLogin(true)}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Login to Continue
            </button>
          </div>
        </div>
      ) : (
        <>
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Top Row - Logo and Actions */}
          <div className="flex items-center justify-between gap-2">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-2 bg-slate-700 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-100 truncate">
                  FII/DII Trading Dashboard
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {selectedBroker ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Connected to {selectedBroker.name}
                    </span>
                  ) : (
                    'Professional Market Analysis'
                  )}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Scenario Tester - Hidden on mobile */}
              <button
                onClick={() => setActiveTab(activeTab === 'dashboard' ? 'tester' : 'dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                title="Toggle Scenario Tester"
              >
                <TestTube className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Tester</span>
              </button>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedSymbol}
                onChange={(e) => handleSymbolChange(e.target.value)}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <optgroup label="Indices" className="bg-slate-800 text-slate-100">
                  <option value="NIFTY" className="bg-slate-800 text-slate-100">NIFTY 50</option>
                  <option value="BANKNIFTY" className="bg-slate-800 text-slate-100">BANK NIFTY</option>
                  <option value="FINNIFTY" className="bg-slate-800 text-slate-100">FIN NIFTY</option>
                  <option value="MIDCPNIFTY" className="bg-slate-800 text-slate-100">MIDCAP NIFTY</option>
                </optgroup>
                <optgroup label="Popular Stocks" className="bg-slate-800 text-slate-100">
                  <option value="RELIANCE" className="bg-slate-800 text-slate-100">RELIANCE</option>
                  <option value="TCS" className="bg-slate-800 text-slate-100">TCS</option>
                  <option value="HDFCBANK" className="bg-slate-800 text-slate-100">HDFC BANK</option>
                  <option value="INFY" className="bg-slate-800 text-slate-100">INFOSYS</option>
                  <option value="ICICIBANK" className="bg-slate-800 text-slate-100">ICICI BANK</option>
                  <option value="SBIN" className="bg-slate-800 text-slate-100">SBI</option>
                  <option value="BHARTIARTL" className="bg-slate-800 text-slate-100">BHARTI AIRTEL</option>
                  <option value="ITC" className="bg-slate-800 text-slate-100">ITC</option>
                  <option value="KOTAKBANK" className="bg-slate-800 text-slate-100">KOTAK BANK</option>
                  <option value="LT" className="bg-slate-800 text-slate-100">L&T</option>
                  <option value="AXISBANK" className="bg-slate-800 text-slate-100">AXIS BANK</option>
                  <option value="WIPRO" className="bg-slate-800 text-slate-100">WIPRO</option>
                  <option value="TATAMOTORS" className="bg-slate-800 text-slate-100">TATA MOTORS</option>
                  <option value="TATASTEEL" className="bg-slate-800 text-slate-100">TATA STEEL</option>
                  <option value="ADANIENT" className="bg-slate-800 text-slate-100">ADANI ENTERPRISES</option>
                </optgroup>
              </select>
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                </div>
              )}
            </div>
            
            {/* Status Info */}
            {lastUpdate && (
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 sm:gap-4">
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
          <div className="flex gap-2 bg-slate-800 border border-slate-600 p-2 rounded-lg overflow-x-auto scrollbar-hide shadow-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">📊 </span>Dashboard
            </button>
            <button
              onClick={() => setActiveTab('fii-dii')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'fii-dii' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">💰 </span>FII/DII
            </button>
            <button
              onClick={() => setActiveTab('oi')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'oi' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">📈 </span>OI
            </button>
            <button
              onClick={() => setActiveTab('live-oi')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'live-oi' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">🔴 </span>Live
            </button>
            <button
              onClick={() => setActiveTab('sectors')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'sectors' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">🏭 </span>Sectors
            </button>
            <button
              onClick={() => setActiveTab('tester')}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'tester' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <span className="hidden sm:inline">🧪 </span>Test
            </button>
          </div>

          {activeTab === 'tester' ? (
            <ScenarioTester />
          ) : activeTab === 'sectors' ? (
            <SectorAnalysis brokerApi={brokerApi} />
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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4 flex items-center">
                📊 Current Market Scenario
                <InfoTooltip
                  title="Current Market Scenario"
                  content="Real-time detection of market condition based on today's Price, OI, FII/DII activity, and Volume. The system identifies which of 16 scenarios is currently active."
                  tradingLogic="This is your trading compass. It tells you exactly what's happening and what action to take. Follow the recommended action (BUY/SELL/WAIT/AVOID) for best results. Update this daily before trading."
                />
              </h2>
              <MarketScenarioCard scenario={scenario} />
            </section>
          )}

          {/* FII/DII Data */}
          <section>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center">
                💰 FII/DII Net Position
                <InfoTooltip
                  title="FII/DII Net Position"
                  content="Shows net buying/selling by Foreign Institutional Investors (FII) and Domestic Institutional Investors (DII). Positive = Net Buying, Negative = Net Selling. This data is published by NSE after market hours for the previous trading day."
                  tradingLogic="FII are smart money - follow their direction. When FII buy heavily, market goes up. When FII sell, market falls. DII usually support when FII sell. Check this daily to know institutional sentiment before trading."
                />
              </h2>
              <div className="text-xs text-yellow-400 bg-yellow-900 bg-opacity-30 px-3 py-1 rounded">
                ⓘ Previous Day Data
              </div>
            </div>
            <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-300">
                <strong>Note:</strong> FII/DII data is published by NSE after market hours (6-7 PM) for the previous trading day. This data does not change during market hours.
              </p>
            </div>
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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4 flex items-center">
                👑 Who's in Control?
                <InfoTooltip
                  title="Market Control Analysis"
                  content="Identifies which institutional group (FII or DII) is dominating the market. The controller's actions drive market direction and create trends."
                  tradingLogic="Trade with the controller, not against them. If FII controls, follow FII direction. If DII controls, market is stabilizing. Mixed control = wait for clarity. This is key to understanding market power dynamics."
                />
              </h2>
              <MarketControlCard control={control} />
            </section>
          )}

          {/* Price + OI + Volume */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4 flex items-center">
              📈 Price + OI + Volume Analysis
              <InfoTooltip
                title="Price + OI + Volume Analysis"
                content="Combined analysis of three critical factors: Price movement, Open Interest changes, and Trading Volume. Together they reveal market phase (Long Buildup, Short Covering, etc.)."
                tradingLogic="This section identifies the current market phase. Long Buildup = Strong bullish, go long. Short Buildup = Strong bearish, go short. Short Covering/Long Unwinding = Weak moves, avoid. Always check volume confirmation."
              />
            </h2>
            <PriceOIVolumeCard data={marketData} />
            </section>

          {/* Strike OI */}
          {strikeData.length > 0 && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4 flex items-center">
                🎯 Strike-wise OI (Support & Resistance)
                <InfoTooltip
                  title="Strike-wise Open Interest"
                  content="Shows Open Interest distribution across different strike prices. High Call OI = Resistance level. High Put OI = Support level. These are key price levels where market tends to reverse."
                  tradingLogic="Max Call OI = Strong resistance, price struggles to go above. Max Put OI = Strong support, price bounces from here. Trade between these levels. Break above Call OI = Very bullish. Break below Put OI = Very bearish."
                />
              </h2>
              <StrikeOICard strikeData={strikeData} currentPrice={marketData.currentPrice} />
            </section>
          )}

          {/* Conviction Meter */}
          {conviction && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4 flex items-center">
                🔥 Market Conviction
                <InfoTooltip
                  title="Market Conviction Meter"
                  content="Measures overall market strength and conviction based on Price change magnitude, OI change, and Volume. Score ranges from 0-100. Higher score = Stronger conviction."
                  tradingLogic="High conviction (70+) = Strong trend, trade aggressively. Medium conviction (40-70) = Moderate trend, trade cautiously. Low conviction (<40) = Weak trend, avoid or use tight stops. Always check conviction before position sizing."
                />
              </h2>
              <ConvictionMeter conviction={conviction} />
            </section>
          )}

          {/* Professional Workflow */}
          <section className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4 flex items-center">
              🧠 Professional Workflow
              <InfoTooltip
                title="Professional Trading Workflow"
                content="Step-by-step process used by professional traders to analyze market conditions. Follow these 5 steps in order every day before taking any trade."
                tradingLogic="This is your daily checklist. Step 1: Check price trend. Step 2: Check OI (strength). Step 3: Check FII/DII (conviction). Step 4: Mark support/resistance. Step 5: Confirm if creating or exiting. Complete all 5 steps before trading."
              />
            </h2>
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
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-yellow-400 flex items-center">
              💡 One-Line Memory Rule
              <InfoTooltip
                title="One-Line Memory Rule"
                content="Simple 4-line formula to remember the entire trading system. Each line represents one key factor and what it tells you about the market."
                tradingLogic="Memorize this: Price = Direction (up/down), OI = Strength (strong/weak), FII = Conviction (high/low), Strike OI = Limits (support/resistance). These 4 factors together give you complete market picture. Use this every day."
              />
            </h2>
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
