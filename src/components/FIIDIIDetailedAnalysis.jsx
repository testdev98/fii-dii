import React from 'react';
import { TrendingUp, TrendingDown, Activity, Calendar, DollarSign, BarChart3, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

const FIIDIIDetailedAnalysis = ({ fiiDiiData }) => {
  // Calculate additional metrics
  const netFlow = fiiDiiData.fiiNet + fiiDiiData.diiNet;
  const fiiDominance = Math.abs(fiiDiiData.fiiNet) / (Math.abs(fiiDiiData.fiiNet) + Math.abs(fiiDiiData.diiNet)) * 100;
  const diiDominance = 100 - fiiDominance;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">📊 FII/DII Detailed Analysis</h2>
        <p className="text-sm text-gray-300">
          Comprehensive analysis of Foreign and Domestic Institutional Investor activity
        </p>
      </div>

      {/* Net Flow Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Net Combined Flow</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div className={`text-3xl font-bold ${netFlow > 0 ? 'text-green-400' : 'text-red-400'}`}>
            ₹{Math.abs(netFlow).toFixed(2)} Cr
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {netFlow > 0 ? 'Net Buying' : 'Net Selling'} by Institutions
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">FII Dominance</span>
            <Activity className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400">
            {fiiDominance.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-2">
            FII activity vs total institutional flow
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">DII Dominance</span>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {diiDominance.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-2">
            DII activity vs total institutional flow
          </div>
        </div>
      </div>

      {/* FII Detailed Breakdown */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          FII (Foreign Institutional Investors) - Detailed
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FII Stats */}
          <div className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Total FII Buying</div>
              <div className="text-2xl font-bold text-green-400">
                ₹{fiiDiiData.fiiBuy?.toFixed(2) || '0.00'} Cr
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Total FII Selling</div>
              <div className="text-2xl font-bold text-red-400">
                ₹{fiiDiiData.fiiSell?.toFixed(2) || '0.00'} Cr
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">FII Net Position</div>
              <div className={`text-2xl font-bold ${fiiDiiData.fiiNet > 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{Math.abs(fiiDiiData.fiiNet).toFixed(2)} Cr
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {fiiDiiData.fiiNet > 0 ? '↑ Net Buyers' : '↓ Net Sellers'}
              </div>
            </div>
          </div>

          {/* FII Insights */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-blue-200">🎯 FII Trading Insights</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                <div>
                  <strong>Role:</strong> Trend Creators - FIIs drive market direction
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                <div>
                  <strong>Impact:</strong> High - Their moves create momentum
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                <div>
                  <strong>Strategy:</strong> {fiiDiiData.fiiNet > 0 ? 'Accumulating positions - Bullish signal' : 'Distributing positions - Bearish signal'}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                <div>
                  <strong>Action:</strong> {fiiDiiData.fiiNet > 0 ? 'Follow FII lead - Consider long positions' : 'Caution advised - Consider defensive positions'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DII Detailed Breakdown */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-purple-400" />
          DII (Domestic Institutional Investors) - Detailed
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DII Stats */}
          <div className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Total DII Buying</div>
              <div className="text-2xl font-bold text-green-400">
                ₹{fiiDiiData.diiBuy?.toFixed(2) || '0.00'} Cr
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Total DII Selling</div>
              <div className="text-2xl font-bold text-red-400">
                ₹{fiiDiiData.diiSell?.toFixed(2) || '0.00'} Cr
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">DII Net Position</div>
              <div className={`text-2xl font-bold ${fiiDiiData.diiNet > 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{Math.abs(fiiDiiData.diiNet).toFixed(2)} Cr
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {fiiDiiData.diiNet > 0 ? '↑ Net Buyers' : '↓ Net Sellers'}
              </div>
            </div>
          </div>

          {/* DII Insights */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-purple-200">🛡️ DII Trading Insights</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5"></div>
                <div>
                  <strong>Role:</strong> Trend Stabilizers - DIIs provide support/resistance
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5"></div>
                <div>
                  <strong>Impact:</strong> Medium - They absorb volatility
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5"></div>
                <div>
                  <strong>Strategy:</strong> {fiiDiiData.diiNet > 0 ? 'Supporting market - Buying dips' : 'Booking profits - Taking money off table'}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5"></div>
                <div>
                  <strong>Action:</strong> {fiiDiiData.diiNet > 0 ? 'DIIs providing support - Good for stability' : 'DIIs reducing exposure - Watch for weakness'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-green-400" />
          FII vs DII - Historical Trend (Last 10 Days)
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={fiiDiiData.historicalData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Area type="monotone" dataKey="fii" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="FII Net" />
            <Area type="monotone" dataKey="dii" stackId="2" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} name="DII Net" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* FII vs DII Comparison */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">⚖️ FII vs DII Comparison</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-3">FII Characteristics</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Long-term investors with global perspective</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Sensitive to currency movements (USD/INR)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>React to global events and Fed policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Create major trends in market</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Higher risk appetite</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-500 bg-opacity-10 border border-purple-500 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300 mb-3">DII Characteristics</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Domestic focus with local market knowledge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Less affected by currency fluctuations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>React to domestic policy and economy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Provide stability and absorb volatility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>More conservative approach</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Strategies Based on FII/DII */}
      <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-yellow-400" />
          Trading Strategies Based on FII/DII Activity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-3">✅ Bullish Scenarios</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">1.</span>
                <span><strong>Both Buying:</strong> Strongest signal - Go long aggressively</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">2.</span>
                <span><strong>FII Buying, DII Selling:</strong> Follow FII - Trend is strong</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">3.</span>
                <span><strong>FII Buying &gt; DII Selling:</strong> Net positive - Bullish bias</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-300 mb-3">❌ Bearish Scenarios</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400">1.</span>
                <span><strong>Both Selling:</strong> Strongest bearish - Go short or exit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">2.</span>
                <span><strong>FII Selling, DII Buying:</strong> Caution - FII view matters more</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">3.</span>
                <span><strong>FII Selling &gt; DII Buying:</strong> Net negative - Bearish bias</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-300 mb-2">⚠️ Key Trading Rules</h4>
          <ul className="space-y-1 text-sm">
            <li>• Always follow FII direction - They are trend creators</li>
            <li>• DII buying can provide temporary support but may not sustain without FII</li>
            <li>• When FII and DII diverge, trust FII more for direction</li>
            <li>• Use DII data to identify support/resistance zones</li>
            <li>• Combine with Price + OI for confirmation</li>
          </ul>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📈 Key Metrics Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">FII Strength</div>
            <div className="text-2xl font-bold text-blue-400">
              {Math.abs(fiiDiiData.fiiNet) > 1000 ? 'High' : Math.abs(fiiDiiData.fiiNet) > 500 ? 'Medium' : 'Low'}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">DII Strength</div>
            <div className="text-2xl font-bold text-purple-400">
              {Math.abs(fiiDiiData.diiNet) > 800 ? 'High' : Math.abs(fiiDiiData.diiNet) > 400 ? 'Medium' : 'Low'}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Market Bias</div>
            <div className={`text-2xl font-bold ${netFlow > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netFlow > 0 ? 'Bullish' : 'Bearish'}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Conviction</div>
            <div className="text-2xl font-bold text-yellow-400">
              {Math.abs(netFlow) > 1000 ? 'Strong' : Math.abs(netFlow) > 500 ? 'Medium' : 'Weak'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FIIDIIDetailedAnalysis;
