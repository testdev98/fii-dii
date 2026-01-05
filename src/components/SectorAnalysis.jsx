import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import InfoTooltip from './InfoTooltip';

const SectorAnalysis = ({ brokerApi }) => {
  const [sectorData, setSectorData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Major Indian market sectors with their representative stocks
  const sectors = [
    { name: 'Banking', stocks: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK', 'KOTAKBANK'], color: '#3b82f6' },
    { name: 'IT', stocks: ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM'], color: '#10b981' },
    { name: 'Auto', stocks: ['TATAMOTORS', 'M&M', 'MARUTI', 'BAJAJ-AUTO', 'HEROMOTOCO'], color: '#f59e0b' },
    { name: 'Pharma', stocks: ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB', 'BIOCON'], color: '#8b5cf6' },
    { name: 'Energy', stocks: ['RELIANCE', 'ONGC', 'BPCL', 'IOC', 'NTPC'], color: '#ef4444' },
    { name: 'FMCG', stocks: ['ITC', 'HINDUNILVR', 'NESTLEIND', 'BRITANNIA', 'DABUR'], color: '#ec4899' },
    { name: 'Metals', stocks: ['TATASTEEL', 'HINDALCO', 'JSWSTEEL', 'VEDL', 'COALINDIA'], color: '#6366f1' },
    { name: 'Telecom', stocks: ['BHARTIARTL', 'IDEA', 'TATACOMM'], color: '#14b8a6' },
    { name: 'Infra', stocks: ['LT', 'ADANIENT', 'ADANIPORTS', 'GRASIM'], color: '#f97316' },
    { name: 'Realty', stocks: ['DLF', 'GODREJPROP', 'OBEROIRLTY', 'PRESTIGE'], color: '#a855f7' }
  ];

  useEffect(() => {
    loadSectorData();
  }, []);

  const loadSectorData = async () => {
    setLoading(true);
    
    // Simulate sector performance data
    // In real implementation, you would fetch actual data from broker API
    const mockSectorData = sectors.map(sector => {
      const change = (Math.random() * 6 - 3).toFixed(2); // Random change between -3% to +3%
      const volume = Math.floor(Math.random() * 50000000) + 10000000;
      const strength = Math.abs(parseFloat(change)) > 1.5 ? 'Strong' : Math.abs(parseFloat(change)) > 0.5 ? 'Moderate' : 'Weak';
      
      return {
        name: sector.name,
        change: parseFloat(change),
        volume: volume,
        strength: strength,
        color: sector.color,
        trend: parseFloat(change) > 0 ? 'Bullish' : 'Bearish',
        stocks: sector.stocks
      };
    });

    // Sort by change (best performers first)
    mockSectorData.sort((a, b) => b.change - a.change);
    
    setSectorData(mockSectorData);
    setLoading(false);
  };

  const topPerformers = sectorData.filter(s => s.change > 0).slice(0, 5);
  const bottomPerformers = sectorData.filter(s => s.change < 0).slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center">
          📊 Sector Performance Analysis
          <InfoTooltip
            title="Sector Performance Analysis"
            content="This dashboard tracks the performance of major Indian market sectors (Banking, IT, Auto, Pharma, etc.) to identify which industries are leading or lagging the market. Sector rotation is a key indicator of market trends and institutional money flow."
            tradingLogic="Use sector analysis to identify where smart money is flowing. When a sector outperforms consistently, it signals institutional accumulation. Trade stocks within strong sectors for higher probability setups. Avoid weak sectors even if individual stocks look good - sector headwinds can drag them down."
          />
        </h2>
        <p className="text-sm text-slate-400">
          Track which sectors are performing well and identify market trends across different industries
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center">
            Bullish Sectors
            <InfoTooltip
              title="Bullish Sectors Count"
              content="Shows how many sectors are currently in positive territory (green). A higher number indicates broad market strength."
              tradingLogic="When 7+ sectors are bullish, it's a strong bull market - go aggressive with long positions. When only 2-3 sectors are bullish, market is weak - be selective and defensive."
            />
          </div>
          <div className="text-2xl font-bold text-green-400">
            {sectorData.filter(s => s.change > 0).length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Moving Up</div>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center">
            Bearish Sectors
            <InfoTooltip
              title="Bearish Sectors Count"
              content="Shows how many sectors are currently in negative territory (red). A higher number indicates broad market weakness."
              tradingLogic="When 7+ sectors are bearish, it's a strong bear market - avoid new longs, consider shorts. When only 2-3 sectors are bearish, market is strong - weakness is isolated and can be ignored."
            />
          </div>
          <div className="text-2xl font-bold text-red-400">
            {sectorData.filter(s => s.change < 0).length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Moving Down</div>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center">
            Best Performer
            <InfoTooltip
              title="Best Performing Sector"
              content="The sector with the highest positive percentage change today. This sector is attracting the most buying interest."
              tradingLogic="The best performing sector often leads the market. Look for stocks within this sector for long trades. If this sector starts weakening, it's an early warning sign for the overall market."
            />
          </div>
          <div className="text-lg font-bold text-blue-400">
            {sectorData[0]?.name || '-'}
          </div>
          <div className="text-xs text-green-400 mt-1">
            {sectorData[0] ? `+${sectorData[0].change}%` : '-'}
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center">
            Worst Performer
            <InfoTooltip
              title="Worst Performing Sector"
              content="The sector with the most negative percentage change today. This sector is facing the most selling pressure."
              tradingLogic="Avoid taking new positions in the worst performing sector - even good stocks in bad sectors struggle. If this sector starts recovering strongly, it can signal a market bottom or reversal."
            />
          </div>
          <div className="text-lg font-bold text-blue-400">
            {sectorData[sectorData.length - 1]?.name || '-'}
          </div>
          <div className="text-xs text-red-400 mt-1">
            {sectorData[sectorData.length - 1] ? `${sectorData[sectorData.length - 1].change}%` : '-'}
          </div>
        </div>
      </div>

      {/* Sector Performance Chart */}
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          All Sectors Performance (%)
          <InfoTooltip
            title="All Sectors Performance Chart"
            content="Horizontal bar chart showing percentage change for all 10 major sectors. Green bars = positive performance, Red bars = negative performance. Longer bars indicate stronger moves."
            tradingLogic="Use this chart to quickly identify sector rotation. If defensive sectors (FMCG, Pharma) are leading, market is cautious. If cyclical sectors (Auto, Metals, Banking) are leading, market is bullish. Trade accordingly."
          />
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sectorData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
              formatter={(value) => [`${value}%`, 'Change']}
            />
            <Bar dataKey="change" radius={[0, 8, 8, 0]}>
              {sectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top and Bottom Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Top Performing Sectors
            <InfoTooltip
              title="Top 5 Performing Sectors"
              content="Ranked list of the 5 best performing sectors with their momentum strength (Strong/Moderate/Weak) and key stocks. These sectors are attracting institutional buying."
              tradingLogic="Focus your long trades on stocks within these top 5 sectors. Strong momentum sectors tend to continue their outperformance for days or weeks. Scan for breakout setups in these sector stocks."
            />
          </h3>
          <div className="space-y-3">
            {topPerformers.map((sector, index) => (
              <div key={index} className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">{sector.name}</div>
                      <div className="text-xs text-slate-400">{sector.strength} Momentum</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400 flex items-center gap-1">
                      <ArrowUp className="w-5 h-5" />
                      +{sector.change}%
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  <strong>Key Stocks:</strong> {sector.stocks.slice(0, 3).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Performers */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-red-400" />
            Bottom Performing Sectors
            <InfoTooltip
              title="Bottom 5 Performing Sectors"
              content="Ranked list of the 5 worst performing sectors with their decline strength and key stocks. These sectors are facing institutional selling or lack of interest."
              tradingLogic="Avoid new long positions in these sectors - even good stocks struggle in weak sectors. Consider these for short trades if you're experienced. Wait for sector recovery before going long."
            />
          </h3>
          <div className="space-y-3">
            {bottomPerformers.map((sector, index) => (
              <div key={index} className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">{sector.name}</div>
                      <div className="text-xs text-slate-400">{sector.strength} Decline</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-400 flex items-center gap-1">
                      <ArrowDown className="w-5 h-5" />
                      {sector.change}%
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  <strong>Key Stocks:</strong> {sector.stocks.slice(0, 3).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Sector Table */}
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
          📋 Detailed Sector Analysis
          <InfoTooltip
            title="Detailed Sector Table"
            content="Complete table showing all sectors ranked by performance with trend direction, momentum strength, key stocks, and trading action. This gives you a comprehensive view of the entire market landscape."
            tradingLogic="Use this table to make sector-based trading decisions. BUY = Strong sectors for long trades. AVOID = Weak sectors, stay away. WATCH = Neutral sectors, wait for clear direction. Always check sector trend before taking any trade."
          />
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700 border-b border-slate-600">
                <th className="text-left p-3 font-semibold text-slate-200">Rank</th>
                <th className="text-left p-3 font-semibold text-slate-200">Sector</th>
                <th className="text-center p-3 font-semibold text-slate-200">Change %</th>
                <th className="text-center p-3 font-semibold text-slate-200">Trend</th>
                <th className="text-center p-3 font-semibold text-slate-200">Strength</th>
                <th className="text-left p-3 font-semibold text-slate-200">Key Stocks</th>
                <th className="text-center p-3 font-semibold text-slate-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {sectorData.map((sector, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="p-3 font-semibold text-slate-200">{index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                      <span className="font-semibold text-slate-200">{sector.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`font-bold ${sector.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sector.change >= 0 ? '+' : ''}{sector.change}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      sector.trend === 'Bullish' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                    }`}>
                      {sector.trend}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      sector.strength === 'Strong' ? 'bg-blue-900/50 text-blue-300' :
                      sector.strength === 'Moderate' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {sector.strength}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-slate-400">
                    {sector.stocks.slice(0, 3).join(', ')}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded font-semibold text-xs ${
                      sector.change > 1 ? 'bg-green-600 text-white' :
                      sector.change < -1 ? 'bg-red-600 text-white' :
                      'bg-slate-600 text-slate-200'
                    }`}>
                      {sector.change > 1 ? 'BUY' : sector.change < -1 ? 'AVOID' : 'WATCH'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trading Insights */}
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
          💡 Sector Trading Insights
          <InfoTooltip
            title="Sector Trading Insights"
            content="Actionable trading recommendations based on current sector performance. Shows which sectors to focus on for long trades and which to avoid."
            tradingLogic="Follow the smart money - trade with strong sectors, avoid weak ones. Sector trends persist for days/weeks, giving you an edge. This is how professional traders filter their stock picks."
          />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-900/20 rounded-lg p-4 border border-green-600/50">
            <h4 className="font-semibold text-green-400 mb-2">✅ Sectors to Watch (Bullish)</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              {topPerformers.slice(0, 3).map((sector, index) => (
                <li key={index}>• <strong className="text-green-300">{sector.name}</strong> - Strong upward momentum, consider long positions</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-red-900/20 rounded-lg p-4 border border-red-600/50">
            <h4 className="font-semibold text-red-400 mb-2">⚠️ Sectors to Avoid (Bearish)</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              {bottomPerformers.slice(0, 3).map((sector, index) => (
                <li key={index}>• <strong className="text-red-300">{sector.name}</strong> - Weak performance, avoid new positions</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600/50 rounded-lg">
          <p className="text-sm text-slate-300">
            <strong className="text-blue-300">Note:</strong> Sector rotation is a key market indicator. When certain sectors outperform, 
            it often signals broader market trends. Use this analysis to identify which sectors are attracting 
            institutional money and align your trades accordingly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectorAnalysis;
