import React, { useState, useEffect } from 'react';
import { RefreshCw, LogOut, TrendingUp, TestTube } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'fii-dii', 'oi', 'live-oi', or 'tester'
  const [brokerApi, setBrokerApi] = useState(null);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY'); // Default symbol
  
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

  const handleLogin = async (loginData) => {
    try {
      setLoading(true);
      
      const { broker, credentials } = loginData;
      setSelectedBroker(broker);
      
      // Create broker API instance
      const api = BrokerFactory.createBrokerAPI(broker.id);
      setBrokerApi(api);
      
      // Login to broker (or skip for demo)
      if (!broker.isDemo) {
        await api.login(credentials);
      }
      
      setIsLoggedIn(true);
      setShowLogin(false);
      
      // Load market data
      await loadMarketData(api);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadMarketData = async (api, symbol = selectedSymbol) => {
    try {
      setLoading(true);
      
      // Fetch data from broker API
      const [marketDataRes, fiiDiiRes, historicalRes] = await Promise.all([
        api.getMarketData(symbol, 'NSE').catch(() => null),
        api.getFIIDIIData ? api.getFIIDIIData().catch(() => null) : null,
        api.getHistoricalData ? api.getHistoricalData(symbol, 'day', null, null).catch(() => null) : null
      ]);

      // Process market data
      const mockData = {
        fiiNet: fiiDiiRes?.data?.fii?.net || 1250.50,
        diiNet: fiiDiiRes?.data?.dii?.net || -850.30,
        fiiBuy: fiiDiiRes?.data?.fii?.buy || 12500,
        fiiSell: fiiDiiRes?.data?.fii?.sell || 11250,
        diiBuy: fiiDiiRes?.data?.dii?.buy || 8500,
        diiSell: fiiDiiRes?.data?.dii?.sell || 9350,
        priceChange: 1.25,
        oiChange: 8.5,
        volume: marketDataRes?.data?.volume || 15000000,
        avgVolume: 12000000,
        currentPrice: marketDataRes?.data?.ltp || 18350,
        historicalData: historicalRes?.data || [
          { date: 'Mon', price: 18100, oi: 1200000, fii: 1100, dii: -800 },
          { date: 'Tue', price: 18200, oi: 1250000, fii: 1150, dii: -750 },
          { date: 'Wed', price: 18250, oi: 1300000, fii: 1200, dii: -820 },
          { date: 'Thu', price: 18300, oi: 1350000, fii: 1220, dii: -840 },
          { date: 'Fri', price: 18350, oi: 1400000, fii: 1250, dii: -850 }
        ]
      };

      const mockStrikeData = [
        { strike: 18000, oi: 1500000, type: 'PUT' },
        { strike: 18100, oi: 1200000, type: 'PUT' },
        { strike: 18200, oi: 1800000, type: 'PUT' },
        { strike: 18300, oi: 900000, type: 'PUT' },
        { strike: 18400, oi: 1100000, type: 'CALL' },
        { strike: 18500, oi: 2000000, type: 'CALL' },
        { strike: 18600, oi: 1300000, type: 'CALL' },
        { strike: 18700, oi: 800000, type: 'CALL' }
      ];

      setMarketData(mockData);
      setStrikeData(mockStrikeData);

      // Analyze market
      const marketScenario = analyzeMarketScenario(
        mockData.priceChange,
        mockData.oiChange,
        mockData.fiiNet,
        mockData.diiNet,
        mockData.volume
      );
      setScenario(marketScenario);

      const marketControl = getMarketControl(mockData.fiiNet, mockData.diiNet);
      setControl(marketControl);

      const convictionScore = calculateConviction(
        mockData.priceChange,
        mockData.oiChange,
        mockData.volume,
        mockData.avgVolume
      );
      setConviction(convictionScore);

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(true);
    setBrokerApi(null);
    setSelectedBroker(null);
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
  };

  const handleRefresh = () => {
    if (brokerApi) {
      loadMarketData(brokerApi, selectedSymbol);
    }
  };

  const handleSymbolChange = (newSymbol) => {
    setSelectedSymbol(newSymbol);
    if (brokerApi) {
      loadMarketData(brokerApi, newSymbol);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">FII/DII Trading Dashboard</h1>
                <p className="text-xs text-gray-400">
                  {selectedBroker ? `Connected to ${selectedBroker.name}` : 'Professional Market Analysis'}
                </p>
              </div>
            </div>
            
            {isLoggedIn && (
              <div className="flex items-center gap-2">
                {/* Symbol Selector */}
                <select
                  value={selectedSymbol}
                  onChange={(e) => handleSymbolChange(e.target.value)}
                  className="px-3 py-2 bg-slate-700 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                
                <button
                  onClick={() => setActiveTab(activeTab === 'dashboard' ? 'tester' : 'dashboard')}
                  className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  title="Toggle Scenario Tester"
                >
                  <TestTube className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          {lastUpdate && (
            <div className="text-xs text-gray-400 mt-2 flex items-center gap-4">
              <span>Tracking: <span className="text-blue-400 font-semibold">{selectedSymbol}</span></span>
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {isLoggedIn && (
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 bg-slate-800 p-2 rounded-lg overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('fii-dii')}
              className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'fii-dii' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              💰 FII/DII
            </button>
            <button
              onClick={() => setActiveTab('oi')}
              className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'oi' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              📈 OI Analysis
            </button>
            <button
              onClick={() => setActiveTab('live-oi')}
              className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'live-oi' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              🔴 Live OI
            </button>
            <button
              onClick={() => setActiveTab('tester')}
              className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'tester' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              🧪 Tester
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
                pcr: 1.15,
                maxCallStrike: 18500,
                maxPutStrike: 18000,
                totalCallOI: 5000000,
                totalPutOI: 5750000,
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
              <h2 className="text-2xl font-bold mb-4">📊 Current Market Scenario</h2>
              <MarketScenarioCard scenario={scenario} />
            </section>
          )}

          {/* FII/DII Data */}
          <section>
            <h2 className="text-2xl font-bold mb-4">💰 FII/DII Net Position</h2>
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
              <h2 className="text-2xl font-bold mb-4">👑 Who's in Control?</h2>
              <MarketControlCard control={control} />
            </section>
          )}

          {/* Price + OI + Volume */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📈 Price + OI + Volume Analysis</h2>
            <PriceOIVolumeCard data={marketData} />
            </section>

          {/* Strike OI */}
          {strikeData.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">🎯 Strike-wise OI (Support & Resistance)</h2>
              <StrikeOICard strikeData={strikeData} currentPrice={marketData.currentPrice} />
            </section>
          )}

          {/* Conviction Meter */}
          {conviction && (
            <section>
              <h2 className="text-2xl font-bold mb-4">🔥 Market Conviction</h2>
              <ConvictionMeter conviction={conviction} />
            </section>
          )}

          {/* Professional Workflow */}
          <section className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🧠 Professional Workflow</h2>
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
          <section className="bg-slate-800 rounded-lg p-6 border-2 border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">💡 One-Line Memory Rule</h2>
            <div className="text-lg text-center space-y-2">
              <div><span className="font-bold text-blue-400">Price</span> tells direction</div>
              <div><span className="font-bold text-green-400">OI</span> tells strength</div>
              <div><span className="font-bold text-purple-400">FII</span> tells conviction</div>
              <div><span className="font-bold text-red-400">Strike OI</span> tells limits</div>
            </div>
          </section>
          </>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>Built with React + Angel One API | For Educational Purposes</p>
          <p className="mt-2">⚠️ Trading involves risk. Always do your own research.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
