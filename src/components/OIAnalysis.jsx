import React from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Target, BarChart2, PieChart } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Area } from 'recharts';

const OIAnalysis = ({ oiData, priceData }) => {
  // Calculate OI metrics
  const oiChange = oiData.current - oiData.previous;
  const oiChangePercent = (oiChange / oiData.previous) * 100;
  const priceChange = priceData.current - priceData.previous;
  const priceChangePercent = (priceChange / priceData.previous) * 100;

  // Determine market phase
  const getMarketPhase = () => {
    if (priceChangePercent > 0 && oiChangePercent > 0) {
      return { phase: 'Long Buildup', color: '#10b981', icon: '🚀', strength: 'Strong Bullish' };
    } else if (priceChangePercent > 0 && oiChangePercent < 0) {
      return { phase: 'Short Covering', color: '#fbbf24', icon: '⚠️', strength: 'Weak Bullish' };
    } else if (priceChangePercent < 0 && oiChangePercent > 0) {
      return { phase: 'Short Buildup', color: '#ef4444', icon: '📉', strength: 'Strong Bearish' };
    } else if (priceChangePercent < 0 && oiChangePercent < 0) {
      return { phase: 'Long Unwinding', color: '#f97316', icon: '📊', strength: 'Weak Bearish' };
    }
    return { phase: 'Neutral', color: '#6b7280', icon: '➡️', strength: 'Sideways' };
  };

  const marketPhase = getMarketPhase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">📊 Open Interest (OI) Deep Analysis</h2>
        <p className="text-sm text-gray-300">
          Complete OI analysis to understand market positioning and future direction
        </p>
      </div>

      {/* Current Market Phase */}
      <div className="bg-slate-800 rounded-lg p-6 border-l-4" style={{ borderColor: marketPhase.color }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold" style={{ color: marketPhase.color }}>
              {marketPhase.icon} {marketPhase.phase}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{marketPhase.strength}</p>
          </div>
          <Activity className="w-12 h-12" style={{ color: marketPhase.color }} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Price Change</div>
            <div className={`text-xl font-bold ${priceChangePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">OI Change</div>
            <div className={`text-xl font-bold ${oiChangePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {oiChangePercent > 0 ? '+' : ''}{oiChangePercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Current OI</div>
            <div className="text-xl font-bold text-blue-400">
              {(oiData.current / 100000).toFixed(2)}L
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Current Price</div>
            <div className="text-xl font-bold text-purple-400">
              ₹{priceData.current.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* OI Interpretation Guide */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-yellow-400" />
          What is Open Interest (OI)?
        </h3>

        <div className="space-y-4">
          <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">📚 Definition</h4>
            <p className="text-sm">
              Open Interest is the total number of outstanding derivative contracts (futures/options) that have not been settled. 
              It represents the total number of open positions in the market.
            </p>
          </div>

          <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-2">💡 Why OI Matters</h4>
            <ul className="text-sm space-y-1">
              <li>• Shows market participation and liquidity</li>
              <li>• Indicates strength of price movements</li>
              <li>• Helps identify trend continuation or reversal</li>
              <li>• Reveals whether positions are being created or closed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4 Market Phases Detailed */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎯 4 Market Phases Based on Price + OI</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Long Buildup */}
          <div className="bg-green-500 bg-opacity-10 border-2 border-green-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h4 className="font-bold text-green-300 text-lg">1. Long Buildup 🚀</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-700 rounded p-2">
                <strong>Condition:</strong> Price ↑ + OI ↑
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Meaning:</strong> Fresh long positions being created
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Interpretation:</strong> Bulls are aggressive, trend is strong
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Action:</strong> <span className="text-green-400 font-bold">BUY</span> - Go long, trend will continue
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Next Move:</strong> Expect further upside, supports will hold
              </div>
            </div>
          </div>

          {/* Short Covering */}
          <div className="bg-yellow-500 bg-opacity-10 border-2 border-yellow-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h4 className="font-bold text-yellow-300 text-lg">2. Short Covering ⚠️</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-700 rounded p-2">
                <strong>Condition:</strong> Price ↑ + OI ↓
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Meaning:</strong> Short positions being closed/covered
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Interpretation:</strong> Rally due to shorts covering, not fresh buying
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Action:</strong> <span className="text-yellow-400 font-bold">WAIT</span> - Don't chase, rally is weak
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Next Move:</strong> Likely consolidation or reversal
              </div>
            </div>
          </div>

          {/* Short Buildup */}
          <div className="bg-red-500 bg-opacity-10 border-2 border-red-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <h4 className="font-bold text-red-300 text-lg">3. Short Buildup 📉</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-700 rounded p-2">
                <strong>Condition:</strong> Price ↓ + OI ↑
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Meaning:</strong> Fresh short positions being created
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Interpretation:</strong> Bears are aggressive, downtrend is strong
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Action:</strong> <span className="text-red-400 font-bold">SELL</span> - Go short or exit longs
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Next Move:</strong> Expect further downside, resistances will hold
              </div>
            </div>
          </div>

          {/* Long Unwinding */}
          <div className="bg-orange-500 bg-opacity-10 border-2 border-orange-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-6 h-6 text-orange-400" />
              <h4 className="font-bold text-orange-300 text-lg">4. Long Unwinding 📊</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-700 rounded p-2">
                <strong>Condition:</strong> Price ↓ + OI ↓
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Meaning:</strong> Long positions being closed/exited
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Interpretation:</strong> Profit booking or panic, not aggressive shorting
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Action:</strong> <span className="text-orange-400 font-bold">WATCH</span> - Wait for stabilization
              </div>
              <div className="bg-slate-700 rounded p-2">
                <strong>Next Move:</strong> Possible bounce at support levels
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price vs OI Chart */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📈 Price vs OI Movement (Last 10 Days)</h3>

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={oiData.historicalData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="oi" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.3} name="Open Interest" />
            <Line yAxisId="right" type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} name="Price" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-slate-700 rounded p-2 text-center">
            <div className="text-xs text-gray-400">Avg OI</div>
            <div className="font-bold text-purple-400">{(oiData.average / 100000).toFixed(2)}L</div>
          </div>
          <div className="bg-slate-700 rounded p-2 text-center">
            <div className="text-xs text-gray-400">Peak OI</div>
            <div className="font-bold text-green-400">{(oiData.peak / 100000).toFixed(2)}L</div>
          </div>
          <div className="bg-slate-700 rounded p-2 text-center">
            <div className="text-xs text-gray-400">Low OI</div>
            <div className="font-bold text-red-400">{(oiData.low / 100000).toFixed(2)}L</div>
          </div>
          <div className="bg-slate-700 rounded p-2 text-center">
            <div className="text-xs text-gray-400">Volatility</div>
            <div className="font-bold text-yellow-400">
              {oiData.volatility > 10 ? 'High' : oiData.volatility > 5 ? 'Medium' : 'Low'}
            </div>
          </div>
        </div>
      </div>

      {/* Call vs Put OI */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📞 Call vs Put OI Distribution</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={oiData.strikeData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="strike" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                />
                <Bar dataKey="callOI" fill="#ef4444" name="Call OI" />
                <Bar dataKey="putOI" fill="#10b981" name="Put OI" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">📞 Call OI (Resistance)</h4>
              <div className="text-2xl font-bold text-red-400 mb-2">
                {oiData.maxCallStrike || 'N/A'}
              </div>
              <div className="text-sm">
                <div>Total Call OI: {((oiData.totalCallOI || 0) / 100000).toFixed(2)}L</div>
                <div className="mt-2 text-xs text-gray-400">
                  High Call OI acts as resistance. Price may struggle to cross this level.
                </div>
              </div>
            </div>

            <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-4">
              <h4 className="font-semibold text-green-300 mb-2">📱 Put OI (Support)</h4>
              <div className="text-2xl font-bold text-green-400 mb-2">
                {oiData.maxPutStrike || 'N/A'}
              </div>
              <div className="text-sm">
                <div>Total Put OI: {((oiData.totalPutOI || 0) / 100000).toFixed(2)}L</div>
                <div className="mt-2 text-xs text-gray-400">
                  High Put OI acts as support. Price may find buying interest here.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PCR Ratio */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <PieChart className="w-6 h-6 text-blue-400" />
          Put-Call Ratio (PCR) Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">PCR (OI Based)</div>
            <div className="text-3xl font-bold text-blue-400">
              {oiData.pcr?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Put OI / Call OI
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Market Sentiment</div>
            <div className={`text-2xl font-bold ${
              oiData.pcr > 1.2 ? 'text-green-400' : 
              oiData.pcr < 0.8 ? 'text-red-400' : 
              'text-yellow-400'
            }`}>
              {oiData.pcr > 1.2 ? 'Bullish' : oiData.pcr < 0.8 ? 'Bearish' : 'Neutral'}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Based on PCR value
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Interpretation</div>
            <div className="text-sm mt-2">
              {oiData.pcr > 1.2 ? 'High PCR indicates oversold, expect bounce' : 
               oiData.pcr < 0.8 ? 'Low PCR indicates overbought, expect correction' : 
               'Neutral PCR, no clear direction'}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
          <h4 className="font-semibold text-blue-300 mb-2">📊 PCR Guidelines</h4>
          <ul className="text-sm space-y-1">
            <li>• <strong>PCR &gt; 1.2:</strong> Bullish - More puts than calls, market oversold</li>
            <li>• <strong>PCR 0.8 - 1.2:</strong> Neutral - Balanced market</li>
            <li>• <strong>PCR &lt; 0.8:</strong> Bearish - More calls than puts, market overbought</li>
            <li>• <strong>Extreme PCR (&gt;1.5 or &lt;0.6):</strong> Strong reversal signal</li>
          </ul>
        </div>
      </div>

      {/* OI Trading Strategies */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎯 OI-Based Trading Strategies</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-3">✅ When to Buy (Long)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">1.</span>
                <span><strong>Long Buildup:</strong> Price ↑ + OI ↑ - Strong uptrend</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">2.</span>
                <span><strong>High PCR (&gt;1.2):</strong> Market oversold, bounce expected</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">3.</span>
                <span><strong>At Max Put OI:</strong> Strong support level</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">4.</span>
                <span><strong>OI Declining in Downtrend:</strong> Long unwinding ending</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-300 mb-3">❌ When to Sell (Short)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400">1.</span>
                <span><strong>Short Buildup:</strong> Price ↓ + OI ↑ - Strong downtrend</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">2.</span>
                <span><strong>Low PCR (&lt;0.8):</strong> Market overbought, correction due</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">3.</span>
                <span><strong>At Max Call OI:</strong> Strong resistance level</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">4.</span>
                <span><strong>OI Declining in Uptrend:</strong> Short covering ending</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-300 mb-2">⚠️ Important Rules</h4>
          <ul className="text-sm space-y-1">
            <li>• Always combine OI with Price movement - Both must align</li>
            <li>• OI increase = New positions, OI decrease = Positions closing</li>
            <li>• High OI at a strike = Strong support/resistance</li>
            <li>• Sudden OI spike = Big players taking positions</li>
            <li>• Use OI with FII/DII data for best results</li>
          </ul>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📋 Quick OI Reference Table</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700">
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">OI</th>
                <th className="p-3 text-left">Phase</th>
                <th className="p-3 text-left">Meaning</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700">
                <td className="p-3 text-green-400">↑ Rising</td>
                <td className="p-3 text-green-400">↑ Rising</td>
                <td className="p-3 font-semibold">Long Buildup</td>
                <td className="p-3">Fresh longs created</td>
                <td className="p-3 text-green-400 font-bold">BUY</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="p-3 text-green-400">↑ Rising</td>
                <td className="p-3 text-red-400">↓ Falling</td>
                <td className="p-3 font-semibold">Short Covering</td>
                <td className="p-3">Shorts being covered</td>
                <td className="p-3 text-yellow-400 font-bold">WAIT</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="p-3 text-red-400">↓ Falling</td>
                <td className="p-3 text-green-400">↑ Rising</td>
                <td className="p-3 font-semibold">Short Buildup</td>
                <td className="p-3">Fresh shorts created</td>
                <td className="p-3 text-red-400 font-bold">SELL</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="p-3 text-red-400">↓ Falling</td>
                <td className="p-3 text-red-400">↓ Falling</td>
                <td className="p-3 font-semibold">Long Unwinding</td>
                <td className="p-3">Longs being closed</td>
                <td className="p-3 text-orange-400 font-bold">WATCH</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OIAnalysis;
