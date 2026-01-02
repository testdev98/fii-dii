import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PriceOIVolumeCard = ({ data }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 md:p-6">
      <h3 className="text-xl font-bold mb-4">Price + OI + Volume Trend</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Price Change</div>
          <div className={`text-xl font-bold ${data.priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.priceChange > 0 ? '+' : ''}{data.priceChange.toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">OI Change</div>
          <div className={`text-xl font-bold ${data.oiChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.oiChange > 0 ? '+' : ''}{data.oiChange.toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Volume</div>
          <div className="text-xl font-bold text-blue-400">
            {(data.volume / 1000000).toFixed(2)}M
          </div>
        </div>
      </div>

      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <div className="text-sm font-semibold mb-3">Price Trend (Last 5 Days)</div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data.historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
            <YAxis stroke="#9ca3af" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-700 rounded-lg p-4">
        <div className="text-sm font-semibold mb-3">OI Trend (Last 5 Days)</div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data.historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
            <YAxis stroke="#9ca3af" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="oi" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-3">
        <div className="text-xs font-semibold text-blue-300 mb-1">Professional Insight</div>
        <div className="text-sm">
          {data.priceChange > 0 && data.oiChange > 0 && 
            "Price rising with OI buildup - Fresh long positions being created"}
          {data.priceChange > 0 && data.oiChange < 0 && 
            "Price rising but OI falling - Short covering rally, be cautious"}
          {data.priceChange < 0 && data.oiChange > 0 && 
            "Price falling with OI buildup - Fresh short positions, bearish"}
          {data.priceChange < 0 && data.oiChange < 0 && 
            "Price falling with OI falling - Long unwinding, bounce possible"}
        </div>
      </div>
    </div>
  );
};

export default PriceOIVolumeCard;
