import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const FIIDIICard = ({ title, value, change, type }) => {
  const isPositive = value > 0;
  const color = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{title}</span>
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
