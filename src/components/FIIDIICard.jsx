import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const FIIDIICard = ({ title, value, change, type }) => {
  const isPositive = value > 0;
  const color = isPositive ? '#10b981' : '#ef4444';

  const getTooltipContent = () => {
    if (type === 'FII') {
      return {
        title: 'FII (Foreign Institutional Investors)',
        content: 'Foreign investors who bring global capital to Indian markets. They are trend creators with long-term perspective.',
        tradingLogic: 'FII Buying = Bullish signal, follow their lead. FII Selling = Bearish signal, be cautious. FIIs drive major market trends, so their activity is most important indicator.'
      };
    } else {
      return {
        title: 'DII (Domestic Institutional Investors)',
        content: 'Domestic institutions like mutual funds, insurance companies. They provide stability and absorb volatility.',
        tradingLogic: 'DII Buying = Support/stabilization. DII Selling = Profit booking. DIIs often counter FII moves to stabilize market. Less impactful than FII but important for support levels.'
      };
    }
  };

  const tooltipData = getTooltipContent();

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400 flex items-center">
          {title}
          {type && <InfoTooltip {...tooltipData} />}
        </span>
        {isPositive ? (
          <TrendingUp className="w-4 h-4" style={{ color }} />
        ) : (
          <TrendingDown className="w-4 h-4" style={{ color }} />
        )}
      </div>
      
      <div className="text-2xl font-bold" style={{ color }}>
        ₹{Math.abs(value).toFixed(2)} Cr
      </div>
      
      <div className="text-xs text-gray-400 mt-1">
        {isPositive ? 'Net Buying' : 'Net Selling'}
      </div>
      
      {change && (
        <div className={`text-xs mt-2 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change > 0 ? '+' : ''}{change.toFixed(2)}% from prev day
        </div>
      )}
    </div>
  );
};

export default FIIDIICard;
