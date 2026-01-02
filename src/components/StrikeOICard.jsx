import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StrikeOICard = ({ strikeData, currentPrice }) => {
  const maxCallOI = strikeData.find(d => d.type === 'CALL' && d.oi === Math.max(...strikeData.filter(s => s.type === 'CALL').map(s => s.oi)));
  const maxPutOI = strikeData.find(d => d.type === 'PUT' && d.oi === Math.max(...strikeData.filter(s => s.type === 'PUT').map(s => s.oi)));

  return (
    <div className="bg-slate-800 rounded-lg p-4 md:p-6">
      <h3 className="text-xl font-bold mb-4">Strike-wise OI Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Max Call OI (Resistance)</div>
          <div className="text-2xl font-bold text-red-400">
            {maxCallOI?.strike || 'N/A'}
          </div>
          <div className="text-sm text-gray-300 mt-1">
            OI: {(maxCallOI?.oi / 100000).toFixed(2)}L
          </div>
          {maxCallOI && (
            <div className="text-xs text-gray-400 mt-2">
              {((maxCallOI.strike - currentPrice) / currentPrice * 100).toFixed(2)}% away
            </div>
          )}
        </div>

        <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Max Put OI (Support)</div>
          <div className="text-2xl font-bold text-green-400">
            {maxPutOI?.strike || 'N/A'}
          </div>
          <div className="text-sm text-gray-300 mt-1">
            OI: {(maxPutOI?.oi / 100000).toFixed(2)}L
          </div>
          {maxPutOI && (
            <div className="text-xs text-gray-400 mt-2">
              {((currentPrice - maxPutOI.strike) / currentPrice * 100).toFixed(2)}% away
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-700 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={strikeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="strike" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="oi" radius={[4, 4, 0, 0]}>
              {strikeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.type === 'CALL' ? '#ef4444' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {maxCallOI && maxPutOI && (
        <div className="mt-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
          <div className="text-sm font-semibold text-blue-300 mb-2">Expected Range</div>
          <div className="text-lg">
            Market likely to trade between <span className="font-bold text-green-400">{maxPutOI.strike}</span> - <span className="font-bold text-red-400">{maxCallOI.strike}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrikeOICard;
