import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const PriceOIVolumeCard = ({ data }) => {
  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`; // Crores
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`; // Lakhs
    if (num >= 1000) return `${(num / 1000).toFixed(2)} K`; // Thousands
    return num.toFixed(0);
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 md:p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity className="w-6 h-6 text-blue-400" />
        Price + OI + Volume Analysis
      </h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border-l-4 border-blue-400">
          <div className="text-xs text-gray-300 mb-1 flex items-center justify-between">
            <span>Current Price</span>
            <span className="text-[10px] bg-blue-700 px-2 py-0.5 rounded">LIVE</span>
          </div>
          <div className="text-2xl font-bold text-blue-300">
            {formatPrice(data.currentPrice)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`text-sm flex items-center gap-1 ${data.priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.priceChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {data.priceChange > 0 ? '+' : ''}{data.priceChange.toFixed(2)}%
            </div>
            <span className="text-xs text-gray-400">vs Close</span>
          </div>
          {data.priceChangeFromOpen !== undefined && (
            <div className={`text-xs mt-1 ${data.priceChangeFromOpen > 0 ? 'text-green-300' : 'text-red-300'}`}>
              {data.priceChangeFromOpen > 0 ? '+' : ''}{data.priceChangeFromOpen.toFixed(2)}% vs Open
            </div>
          )}
        </div>
        
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border-l-4 border-green-400">
          <div className="text-xs text-gray-300 mb-1">OI Change</div>
          <div className={`text-2xl font-bold ${data.oiChange > 0 ? 'text-green-300' : 'text-red-300'}`}>
            {data.oiChange > 0 ? '+' : ''}{data.oiChange.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-300 mt-1">
            {data.oiChange > 0 ? 'Positions Building' : 'Positions Closing'}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border-l-4 border-purple-400">
          <div className="text-xs text-gray-300 mb-1">Volume</div>
          <div className="text-2xl font-bold text-purple-300">
            {formatNumber(data.volume)}
          </div>
          <div className="text-sm text-gray-300 mt-1">
            Avg: {formatNumber(data.avgVolume)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-4 border-l-4 border-yellow-400">
          <div className="text-xs text-gray-300 mb-1">Volume Ratio</div>
          <div className="text-2xl font-bold text-yellow-300">
            {(data.volume / data.avgVolume).toFixed(2)}x
          </div>
          <div className="text-sm text-gray-300 mt-1">
            {data.volume > data.avgVolume ? 'Above Average' : 'Below Average'}
          </div>
        </div>
      </div>

      {/* Combined Price & OI Chart */}
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <div className="text-sm font-semibold mb-3 flex items-center justify-between">
          <span>📈 Price & OI Movement (Last 5 Days)</span>
          <span className="text-xs text-gray-400">Dual Axis Chart</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={data.historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af" 
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#3b82f6" 
              fontSize={12}
              tick={{ fill: '#3b82f6' }}
              tickFormatter={(value) => formatPrice(value)}
              label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft', fill: '#3b82f6' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#10b981" 
              fontSize={12}
              tick={{ fill: '#10b981' }}
              tickFormatter={(value) => formatNumber(value)}
              label={{ value: 'Open Interest', angle: 90, position: 'insideRight', fill: '#10b981' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
              formatter={(value, name) => {
                if (name === 'Price') return [formatPrice(value), name];
                if (name === 'Open Interest') return [formatNumber(value), name];
                return [value, name];
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="oi" 
              fill="#10b981" 
              stroke="#10b981" 
              fillOpacity={0.2}
              name="Open Interest"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ fill: '#3b82f6', r: 5 }}
              name="Price"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <div className="text-sm font-semibold mb-3 flex items-center justify-between">
          <span>📊 Volume Trend (Last 5 Days)</span>
          <span className="text-xs text-gray-400">Higher volume = Stronger move</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af" 
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
              tickFormatter={(value) => formatNumber(value)}
              label={{ value: 'Volume', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
              formatter={(value) => [formatNumber(value), 'Volume']}
            />
            <Bar 
              dataKey="volume" 
              fill="#a855f7" 
              radius={[8, 8, 0, 0]}
              name="Volume"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Professional Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`rounded-lg p-4 border-2 ${
          data.priceChange > 0 && data.oiChange > 0 ? 'bg-green-500 bg-opacity-10 border-green-500' :
          data.priceChange > 0 && data.oiChange < 0 ? 'bg-yellow-500 bg-opacity-10 border-yellow-500' :
          data.priceChange < 0 && data.oiChange > 0 ? 'bg-red-500 bg-opacity-10 border-red-500' :
          'bg-orange-500 bg-opacity-10 border-orange-500'
        }`}>
          <div className="text-xs font-semibold text-gray-300 mb-2">📊 Market Phase</div>
          <div className="text-lg font-bold mb-2">
            {data.priceChange > 0 && data.oiChange > 0 && <span className="text-green-400">🚀 Long Buildup</span>}
            {data.priceChange > 0 && data.oiChange < 0 && <span className="text-yellow-400">⚠️ Short Covering</span>}
            {data.priceChange < 0 && data.oiChange > 0 && <span className="text-red-400">📉 Short Buildup</span>}
            {data.priceChange < 0 && data.oiChange < 0 && <span className="text-orange-400">📊 Long Unwinding</span>}
          </div>
          <div className="text-sm text-gray-300">
            {data.priceChange > 0 && data.oiChange > 0 && "Fresh long positions being created. Strong bullish trend."}
            {data.priceChange > 0 && data.oiChange < 0 && "Short covering rally. Weak bullish, be cautious."}
            {data.priceChange < 0 && data.oiChange > 0 && "Fresh short positions. Strong bearish trend."}
            {data.priceChange < 0 && data.oiChange < 0 && "Long unwinding. Weak bearish, bounce possible."}
          </div>
        </div>

        <div className="bg-blue-500 bg-opacity-10 border-2 border-blue-500 rounded-lg p-4">
          <div className="text-xs font-semibold text-blue-300 mb-2">💡 Trading Insight</div>
          <div className="text-sm text-gray-300 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Volume:</strong> {data.volume > data.avgVolume ? 'Above average - Strong participation' : 'Below average - Weak participation'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Trend Strength:</strong> {Math.abs(data.priceChange) > 1 ? 'Strong move' : 'Moderate move'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Action:</strong> {
                data.priceChange > 0 && data.oiChange > 0 ? 'Consider buying on dips' :
                data.priceChange > 0 && data.oiChange < 0 ? 'Wait for confirmation' :
                data.priceChange < 0 && data.oiChange > 0 ? 'Consider selling on rallies' :
                'Watch for reversal signals'
              }</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceOIVolumeCard;
