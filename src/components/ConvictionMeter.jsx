import React from 'react';
import { Activity } from 'lucide-react';

const ConvictionMeter = ({ conviction }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5" />
        <h3 className="text-xl font-bold">Market Conviction</h3>
      </div>

      <div className="relative">
        <div className="w-full h-8 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 rounded-full"
            style={{ 
              width: `${conviction.score}%`,
              backgroundColor: conviction.color
            }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>LOW</span>
          <span>MEDIUM</span>
          <span>HIGH</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold" style={{ color: conviction.color }}>
            {conviction.score}%
          </div>
          <div className="text-sm text-gray-400">Conviction Score</div>
        </div>
        
        <div className={`px-4 py-2 rounded-lg font-semibold ${
          conviction.level === 'HIGH' ? 'bg-green-500 bg-opacity-20 text-green-300' :
          conviction.level === 'MEDIUM' ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' :
          'bg-red-500 bg-opacity-20 text-red-300'
        }`}>
          {conviction.level}
        </div>
      </div>

      <div className="mt-4 bg-slate-700 rounded-lg p-3">
        <div className="text-xs text-gray-400 mb-2">Factors</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>✓ Price Movement</div>
          <div>✓ OI Change</div>
          <div>✓ Volume Confirmation</div>
          <div>✓ Alignment</div>
        </div>
      </div>
    </div>
  );
};

export default ConvictionMeter;
