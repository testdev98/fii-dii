import React, { useState } from 'react';
import { analyzeMarketScenario } from '../utils/marketAnalysis';
import MarketScenarioCard from './MarketScenarioCard';

const ScenarioTester = () => {
  const [inputs, setInputs] = useState({
    priceChange: 1.5,
    oiChange: 5.0,
    fiiNet: 1000,
    diiNet: -500,
    volume: 15000000
  });

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
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🧪 Scenario Tester</h2>
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
    </div>
  );
};

export default ScenarioTester;
