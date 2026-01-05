import React, { useState } from 'react';
import { analyzeMarketScenario } from '../utils/marketAnalysis';
import MarketScenarioCard from './MarketScenarioCard';
import InfoTooltip from './InfoTooltip';

const ScenarioTester = () => {
  const [inputs, setInputs] = useState({
    priceChange: 1.5,
    oiChange: 5.0,
    fiiNet: 1000,
    diiNet: -500,
    volume: 15000000
  });

  const [showReference, setShowReference] = useState(false);

  const scenario = analyzeMarketScenario(
    inputs.priceChange,
    inputs.oiChange,
    inputs.fiiNet,
    inputs.diiNet,
    inputs.volume
  );

  const presetScenarios = [
    {
      name: '1. SUPER BULLISH',
      values: { priceChange: 2.0, oiChange: 10, fiiNet: 1500, diiNet: 800, volume: 18000000 }
    },
    {
      name: '2. STRONG BULLISH (FII)',
      values: { priceChange: 1.5, oiChange: 8, fiiNet: 1200, diiNet: -300, volume: 16000000 }
    },
    {
      name: '3. DIVERGENCE',
      values: { priceChange: 1.0, oiChange: 6, fiiNet: -800, diiNet: 1000, volume: 14000000 }
    },
    {
      name: '4. RETAIL TRAP',
      values: { priceChange: 1.2, oiChange: 7, fiiNet: -1000, diiNet: -600, volume: 20000000 }
    },
    {
      name: '5. SHORT COVERING (Both)',
      values: { priceChange: 1.0, oiChange: -5, fiiNet: 500, diiNet: 300, volume: 12000000 }
    },
    {
      name: '6. MIXED SHORT COVERING',
      values: { priceChange: 0.8, oiChange: -4, fiiNet: 400, diiNet: -200, volume: 11000000 }
    },
    {
      name: '7. WEAK RALLY',
      values: { priceChange: 0.6, oiChange: -3, fiiNet: -300, diiNet: 400, volume: 10000000 }
    },
    {
      name: '8. DEAD CAT BOUNCE',
      values: { priceChange: 0.5, oiChange: -6, fiiNet: -600, diiNet: -400, volume: 9000000 }
    },
    {
      name: '9. SUPER BEARISH',
      values: { priceChange: -2.0, oiChange: 10, fiiNet: -1500, diiNet: -800, volume: 22000000 }
    },
    {
      name: '10. DII SUPPORT',
      values: { priceChange: -1.5, oiChange: 8, fiiNet: -1200, diiNet: 900, volume: 17000000 }
    },
    {
      name: '11. STRONG BEARISH (DII)',
      values: { priceChange: -1.2, oiChange: 6, fiiNet: 300, diiNet: -1000, volume: 15000000 }
    },
    {
      name: '12. CONTRARIAN TRAP',
      values: { priceChange: -1.0, oiChange: 7, fiiNet: 800, diiNet: 600, volume: 19000000 }
    },
    {
      name: '13. WEAK FALL / PANIC',
      values: { priceChange: -1.5, oiChange: -8, fiiNet: -700, diiNet: -500, volume: 13000000 }
    },
    {
      name: '14. MIXED UNWINDING',
      values: { priceChange: -0.8, oiChange: -5, fiiNet: -400, diiNet: 300, volume: 11000000 }
    },
    {
      name: '15. LONG UNWINDING (DII)',
      values: { priceChange: -0.6, oiChange: -4, fiiNet: 300, diiNet: -500, volume: 10000000 }
    },
    {
      name: '16. STRONG REVERSAL SETUP',
      values: { priceChange: -0.5, oiChange: -6, fiiNet: 800, diiNet: 600, volume: 14000000 }
    }
  ];

  const loadPreset = (preset) => {
    setInputs(preset.values);
  };

  return (
    <div className="space-y-6">
      {/* Instructions & Guide */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 border border-blue-500/30">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          📚 How to Use Scenario Tester
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-300 mb-2">
              This tool helps you understand how different market conditions create specific trading scenarios. 
              The system analyzes <strong>4 key factors</strong> to detect 16 different market scenarios:
            </p>
          </div>

          {/* Input Explanations */}
          <div className="grid md:grid-cols-2 gap-4 bg-slate-800/50 rounded-lg p-4">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">📊 Input Parameters:</h4>
              <ul className="space-y-2 text-gray-300">
                <li><strong>Price Change (%):</strong> How much NIFTY moved today
                  <br/><span className="text-xs text-gray-400">Positive = Up, Negative = Down</span>
                </li>
                <li><strong>OI Change (%):</strong> Open Interest change in options
                  <br/><span className="text-xs text-gray-400">Positive = New positions, Negative = Unwinding</span>
                </li>
                <li><strong>FII Net (Cr):</strong> Foreign Institutional Investors activity
                  <br/><span className="text-xs text-gray-400">Positive = Buying, Negative = Selling</span>
                </li>
                <li><strong>DII Net (Cr):</strong> Domestic Institutional Investors activity
                  <br/><span className="text-xs text-gray-400">Positive = Buying, Negative = Selling</span>
                </li>
                <li><strong>Volume:</strong> Total trading volume
                  <br/><span className="text-xs text-gray-400">Higher = More participation</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-400 mb-2">🎯 How It Works:</h4>
              <ul className="space-y-2 text-gray-300 text-xs">
                <li>✅ <strong>Price Direction:</strong> Is market going up or down?</li>
                <li>✅ <strong>OI Direction:</strong> Are new positions being created or closed?</li>
                <li>✅ <strong>FII Activity:</strong> Are smart money (FII) buying or selling?</li>
                <li>✅ <strong>DII Activity:</strong> Are domestic institutions buying or selling?</li>
              </ul>
              <div className="mt-3 p-3 bg-slate-900/50 rounded border border-yellow-500/30">
                <p className="text-yellow-400 text-xs font-semibold mb-1">💡 Key Logic:</p>
                <p className="text-gray-300 text-xs">
                  • <strong>Price ↑ + OI ↑ + Both Buying</strong> = Super Bullish<br/>
                  • <strong>Price ↑ + OI ↓</strong> = Short Covering (Weak)<br/>
                  • <strong>Price ↓ + OI ↑ + Both Selling</strong> = Super Bearish<br/>
                  • <strong>Price ↓ + OI ↓</strong> = Long Unwinding (Weak)
                </p>
              </div>
            </div>
          </div>

          {/* Testing Guide */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-400 mb-2">🧪 How to Test:</h4>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-300 mb-2"><strong>Method 1: Use Presets</strong></p>
                <ul className="space-y-1 text-gray-400">
                  <li>• Click any preset button (1-16) below</li>
                  <li>• Each preset represents a specific scenario</li>
                  <li>• See how inputs create different signals</li>
                </ul>
              </div>
              <div>
                <p className="text-gray-300 mb-2"><strong>Method 2: Manual Testing</strong></p>
                <ul className="space-y-1 text-gray-400">
                  <li>• Adjust sliders to change values</li>
                  <li>• Watch scenario change in real-time</li>
                  <li>• Experiment with different combinations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-orange-400 mb-2">📝 Example Scenarios:</h4>
            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="bg-green-900/20 border border-green-500/30 rounded p-2">
                <p className="font-semibold text-green-400 mb-1">🚀 Super Bullish</p>
                <p className="text-gray-300">Price: +2% | OI: +10%<br/>FII: +1500 | DII: +800</p>
                <p className="text-gray-400 mt-1">Both creating fresh longs</p>
              </div>
              <div className="bg-red-900/20 border border-red-500/30 rounded p-2">
                <p className="font-semibold text-red-400 mb-1">📉 Super Bearish</p>
                <p className="text-gray-300">Price: -2% | OI: +10%<br/>FII: -1500 | DII: -800</p>
                <p className="text-gray-400 mt-1">Both creating fresh shorts</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-2">
                <p className="font-semibold text-yellow-400 mb-1">⚠️ Retail Trap</p>
                <p className="text-gray-300">Price: +1.2% | OI: +7%<br/>FII: -1000 | DII: -600</p>
                <p className="text-gray-400 mt-1">Smart money exiting at top</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          🧪 Scenario Tester
          <InfoTooltip
            title="Scenario Tester Tool"
            content="Interactive tool to test all 16 market scenarios by adjusting Price, OI, FII, DII, and Volume inputs. Use presets or manual inputs to see how different market conditions create specific trading signals."
            tradingLogic="This tool helps you understand market logic. Test different combinations to learn when to BUY, SELL, WAIT, or AVOID. Practice here before applying to real market data. Master all 16 scenarios to become a better trader."
          />
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Test all 16 market scenarios by adjusting inputs or selecting presets
        </p>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Price Change (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.priceChange}
              onChange={(e) => setInputs({...inputs, priceChange: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              OI Change (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.oiChange}
              onChange={(e) => setInputs({...inputs, oiChange: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              FII Net (Cr)
            </label>
            <input
              type="number"
              step="100"
              value={inputs.fiiNet}
              onChange={(e) => setInputs({...inputs, fiiNet: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              DII Net (Cr)
            </label>
            <input
              type="number"
              step="100"
              value={inputs.diiNet}
              onChange={(e) => setInputs({...inputs, diiNet: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Volume
            </label>
            <input
              type="number"
              step="1000000"
              value={inputs.volume}
              onChange={(e) => setInputs({...inputs, volume: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Current Inputs Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-700 rounded p-3 text-center">
            <div className="text-xs text-gray-400">Price</div>
            <div className={`text-lg font-bold ${inputs.priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {inputs.priceChange > 0 ? '↑' : '↓'} {Math.abs(inputs.priceChange)}%
            </div>
          </div>
          <div className="bg-slate-700 rounded p-3 text-center">
            <div className="text-xs text-gray-400">OI</div>
            <div className={`text-lg font-bold ${inputs.oiChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {inputs.oiChange > 0 ? '↑' : '↓'} {Math.abs(inputs.oiChange)}%
            </div>
          </div>
          <div className="bg-slate-700 rounded p-3 text-center">
            <div className="text-xs text-gray-400">FII</div>
            <div className={`text-lg font-bold ${inputs.fiiNet > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {inputs.fiiNet > 0 ? 'Buying' : 'Selling'}
            </div>
          </div>
          <div className="bg-slate-700 rounded p-3 text-center">
            <div className="text-xs text-gray-400">DII</div>
            <div className={`text-lg font-bold ${inputs.diiNet > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {inputs.diiNet > 0 ? 'Buying' : 'Selling'}
            </div>
          </div>
        </div>

        {/* Preset Scenarios */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Presets (All 16 Scenarios)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presetScenarios.map((preset, index) => (
              <button
                key={index}
                onClick={() => loadPreset(preset)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div>
        <h3 className="text-xl font-bold mb-4">📊 Detected Scenario</h3>
        <MarketScenarioCard scenario={scenario} />
      </div>

      {/* Quick Reference Table */}
      <div className="bg-slate-800 rounded-lg p-6">
        <button
          onClick={() => setShowReference(!showReference)}
          className="w-full flex items-center justify-between text-lg font-semibold mb-4 hover:text-blue-400 transition-colors"
        >
          <span>📖 Quick Reference: All 16 Scenarios</span>
          <span className="text-2xl">{showReference ? '▼' : '▶'}</span>
        </button>
        
        {showReference && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Scenario</th>
                  <th className="text-center p-2">Price</th>
                  <th className="text-center p-2">OI</th>
                  <th className="text-center p-2">FII</th>
                  <th className="text-center p-2">DII</th>
                  <th className="text-left p-2">Signal</th>
                  <th className="text-center p-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">1</td>
                  <td className="p-2 font-semibold text-green-400">Super Bullish</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-gray-300">Fresh longs by both</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-green-600 rounded">BUY</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">2</td>
                  <td className="p-2 font-semibold text-green-400">Strong Bullish (FII)</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-gray-300">FII creating longs</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-green-600 rounded">BUY</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">3</td>
                  <td className="p-2 font-semibold text-purple-400">Divergence</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-gray-300">FII distributing</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-yellow-600 rounded">AVOID</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">4</td>
                  <td className="p-2 font-semibold text-red-400">Retail Trap</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-gray-300">Both exiting at top</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-red-600 rounded">SELL</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">5</td>
                  <td className="p-2 font-semibold text-yellow-400">Short Covering (Both)</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-gray-300">Covering shorts</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-gray-600 rounded">WAIT</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">6</td>
                  <td className="p-2 font-semibold text-orange-400">Mixed Short Covering</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-gray-300">Mixed signals</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-gray-600 rounded">WAIT</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">7</td>
                  <td className="p-2 font-semibold text-orange-400">Weak Rally</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-gray-300">No conviction</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-yellow-600 rounded">AVOID</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">8</td>
                  <td className="p-2 font-semibold text-red-400">Dead Cat Bounce</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-gray-300">Both exiting longs</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-red-600 rounded">SELL</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">9</td>
                  <td className="p-2 font-semibold text-red-600">Super Bearish</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-gray-300">Fresh shorts by both</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-red-600 rounded">SELL</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">10</td>
                  <td className="p-2 font-semibold text-blue-400">DII Support</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-gray-300">DII absorbing</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-gray-600 rounded">WAIT</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">11</td>
                  <td className="p-2 font-semibold text-red-400">Strong Bearish (DII)</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-gray-300">DII creating shorts</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-red-600 rounded">SELL</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">12</td>
                  <td className="p-2 font-semibold text-purple-400">Contrarian Trap</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-green-400">↑</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-gray-300">Accumulating at lows</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-blue-600 rounded">WATCH</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">13</td>
                  <td className="p-2 font-semibold text-orange-400">Weak Fall / Panic</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-gray-300">Panic unwinding</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-gray-600 rounded">WAIT</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">14</td>
                  <td className="p-2 font-semibold text-orange-400">Mixed Unwinding</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-gray-300">Mixed signals</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-gray-600 rounded">WAIT</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">15</td>
                  <td className="p-2 font-semibold text-yellow-400">Long Unwinding (DII)</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-center text-red-400">Sell</td>
                  <td className="p-2 text-gray-300">DII profit booking</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-blue-600 rounded">WATCH</span></td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-2">16</td>
                  <td className="p-2 font-semibold text-green-400">Strong Reversal Setup</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-red-400">↓</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-center text-green-400">Buy</td>
                  <td className="p-2 text-gray-300">Short squeeze coming</td>
                  <td className="p-2 text-center"><span className="px-2 py-1 bg-green-600 rounded">BUY</span></td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-3 bg-slate-900/50 rounded text-xs text-gray-400">
              <p><strong>Legend:</strong> ↑ = Increase/Positive | ↓ = Decrease/Negative | Buy = Buying Activity | Sell = Selling Activity</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioTester;
