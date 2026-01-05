import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const MarketScenarioCard = ({ scenario }) => {
  const getIcon = () => {
    if (scenario.signal.includes('BULLISH')) return <TrendingUp className="w-6 h-6" />;
    if (scenario.signal.includes('BEARISH')) return <TrendingDown className="w-6 h-6" />;
    if (scenario.signal.includes('SUPPORT')) return <Shield className="w-6 h-6" />;
    return <AlertTriangle className="w-6 h-6" />;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 md:p-6 border-l-4" style={{ borderColor: scenario.color }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${scenario.color}20` }}>
            <div style={{ color: scenario.color }}>
              {getIcon()}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: scenario.color }}>
              {scenario.icon} {scenario.signal}
              <InfoTooltip
                title="Market Scenario Detection"
                content="This card shows the detected market scenario based on Price movement, OI change, FII/DII activity, and Volume. The system analyzes these 4 factors to identify 16 different market conditions."
                tradingLogic="Each scenario tells you what's happening and what to do. BULLISH scenarios = Go long. BEARISH scenarios = Go short or exit longs. WEAK/TRAP scenarios = Avoid trading. Always follow the recommended action for best results."
              />
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              scenario.strength === 'HIGH' ? 'bg-green-500 bg-opacity-20 text-green-300' :
              scenario.strength === 'MEDIUM' ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' :
              'bg-gray-500 bg-opacity-20 text-gray-300'
            }`}>
              {scenario.strength} STRENGTH
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-700 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">What's Happening</p>
          <p className="text-sm">{scenario.interpretation}</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Next Day Expectation</p>
          <p className="text-sm">{scenario.nextDay}</p>
        </div>

        {scenario.action && (
          <div className={`rounded-lg p-3 border-2 ${
            scenario.action === 'BUY' ? 'bg-green-500 bg-opacity-10 border-green-500' :
            scenario.action === 'SELL' ? 'bg-red-500 bg-opacity-10 border-red-500' :
            scenario.action === 'AVOID' ? 'bg-yellow-500 bg-opacity-10 border-yellow-500' :
            'bg-blue-500 bg-opacity-10 border-blue-500'
          }`}>
            <p className="text-xs text-gray-400 mb-1">Recommended Action</p>
            <p className={`text-lg font-bold ${
              scenario.action === 'BUY' ? 'text-green-400' :
              scenario.action === 'SELL' ? 'text-red-400' :
              scenario.action === 'AVOID' ? 'text-yellow-400' :
              'text-blue-400'
            }`}>
              {scenario.action}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketScenarioCard;
