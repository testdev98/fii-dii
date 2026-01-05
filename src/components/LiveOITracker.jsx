import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, Clock, TrendingUp, TrendingDown, Play, Pause, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from 'recharts';
import { getSymbolToken } from '../utils/symbolTokens';
import InfoTooltip from './InfoTooltip';

const LiveOITracker = ({ brokerApi, symbol = 'NIFTY' }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [oiData, setOiData] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(60); // seconds
  const [selectedTimeframe, setSelectedTimeframe] = useState('1min'); // 1min, 5min, 15min

  // Check if market is open (9:15 AM to 3:30 PM IST)
  const isMarketOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    // Check if it's a weekday (Monday = 1, Friday = 5)
    const day = now.getDay();
    const isWeekday = day >= 1 && day <= 5;
    
    return isWeekday && currentTime >= marketOpen && currentTime <= marketClose;
  };

  // Fetch live OI data
  const fetchLiveData = async () => {
    try {
      const symbolInfo = getSymbolToken(symbol);
      let currentPrice = symbolInfo.basePrice;
      let volume = 0;
      
      // Get real market data from broker if available
      if (brokerApi && !brokerApi.isDemo) {
        try {
          const response = await brokerApi.getMarketData(symbol, symbolInfo.exchange, symbolInfo.token, symbolInfo.basePrice);
          if (response?.data) {
            currentPrice = response.data.ltp || currentPrice;
            volume = response.data.volume || 0;
          }
        } catch (error) {
          console.error('Error fetching market data for OI tracker:', error);
        }
      }
      
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      // Try to get real option chain data
      let callOI = 0;
      let putOI = 0;
      let totalOI = 0;
      let oiChange = 0;
      let hasRealData = false;
      
      if (brokerApi && brokerApi.getOptionChain && !brokerApi.isDemo) {
        try {
          const optionChainResponse = await brokerApi.getOptionChain(symbol);
          if (optionChainResponse?.data && optionChainResponse.data.length > 0) {
            // Calculate total Call and Put OI from option chain
            const optionData = optionChainResponse.data;
            callOI = optionData.reduce((sum, opt) => sum + (opt.optionType === 'CE' ? (opt.openInterest || 0) : 0), 0);
            putOI = optionData.reduce((sum, opt) => sum + (opt.optionType === 'PE' ? (opt.openInterest || 0) : 0), 0);
            totalOI = callOI + putOI;
            
            // Calculate OI change if we have previous data
            if (oiData.length > 0) {
              const prevOI = oiData[oiData.length - 1].oi;
              oiChange = ((totalOI - prevOI) / prevOI * 100).toFixed(2);
            }
            
            hasRealData = true;
          }
        } catch (error) {
          console.error('Error fetching option chain for OI tracker:', error);
        }
      }
      
      // Only add data point if we have real OI data
      if (hasRealData && totalOI > 0) {
        const newData = {
          time: time,
          timestamp: now.getTime(),
          oi: totalOI,
          oiChange: parseFloat(oiChange),
          volume: volume,
          atp: currentPrice,
          ltp: currentPrice,
          callOI: callOI,
          putOI: putOI,
          pcr: callOI > 0 ? (putOI / callOI).toFixed(2) : 0
        };
        
        setCurrentData(newData);
        setOiData(prev => [...prev, newData].slice(-100));
      } else {
        console.warn('⚠️ No real OI data available for Live OI Tracker');
        // Don't add fake data - just skip this update
      }
      setLastUpdate(now);
    } catch (error) {
      console.error('Error fetching live OI data:', error);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    let intervalId;
    
    if (isTracking && isMarketOpen()) {
      // Fetch immediately
      fetchLiveData();
      
      // Then set interval
      intervalId = setInterval(() => {
        fetchLiveData();
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTracking, refreshInterval, brokerApi, symbol]);

  // Reset data when symbol changes
  useEffect(() => {
    setOiData([]);
    setCurrentData(null);
    setIsTracking(false);
  }, [symbol]);

  // Start/Stop tracking
  const toggleTracking = () => {
    if (!isTracking) {
      fetchLiveData(); // Fetch immediately when starting
    }
    setIsTracking(!isTracking);
  };

  // Export data to CSV
  const exportToCSV = () => {
    if (oiData.length === 0) return;
    
    const headers = ['Time', 'OI', 'OI Change %', 'Volume', 'ATP', 'LTP', 'Call OI', 'Put OI', 'PCR'];
    const csvContent = [
      headers.join(','),
      ...oiData.map(row => [
        row.time,
        row.oi,
        row.oiChange,
        row.volume,
        row.atp.toFixed(2),
        row.ltp.toFixed(2),
        row.callOI,
        row.putOI,
        row.pcr
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OI_Tracker_${symbol}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const getStatistics = () => {
    if (oiData.length === 0) return null;
    
    const oiValues = oiData.map(d => d.oi);
    const volumeValues = oiData.map(d => d.volume);
    const atpValues = oiData.map(d => d.atp);
    
    return {
      oiMax: Math.max(...oiValues),
      oiMin: Math.min(...oiValues),
      oiAvg: oiValues.reduce((a, b) => a + b, 0) / oiValues.length,
      volumeTotal: volumeValues.reduce((a, b) => a + b, 0),
      atpMax: Math.max(...atpValues),
      atpMin: Math.min(...atpValues),
      atpAvg: atpValues.reduce((a, b) => a + b, 0) / atpValues.length
    };
  };

  const stats = getStatistics();
  const marketStatus = isMarketOpen();

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center">
              📊 Live OI Tracker - {symbol}
              <InfoTooltip
                title="Live OI Tracker"
                content="Real-time tracking of Open Interest, Volume, and Price during market hours. Updates automatically at your chosen interval to show live market activity."
                tradingLogic="Use this to monitor intraday OI changes. Rising OI with price = Strong trend continuation. Falling OI = Position unwinding. Track Call/Put OI to identify intraday support/resistance levels."
              />
            </h2>
            <p className="text-sm text-gray-300">
              Real-time Open Interest, Volume & ATP tracking during market hours
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              marketStatus ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {marketStatus ? '🟢 Market Open' : '🔴 Market Closed'}
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Start/Stop Button */}
          <button
            onClick={toggleTracking}
            disabled={!marketStatus}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              isTracking 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            } disabled:bg-gray-600 disabled:cursor-not-allowed`}
          >
            {isTracking ? (
              <>
                <Pause className="w-5 h-5" />
                Stop Tracking
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Tracking
              </>
            )}
          </button>

          {/* Refresh Interval */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Refresh Interval</label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>

          {/* Manual Refresh */}
          <button
            onClick={fetchLiveData}
            disabled={!marketStatus}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Now
          </button>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            disabled={oiData.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {lastUpdate && (
          <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdate.toLocaleTimeString()}
            {isTracking && <span className="text-green-400">(Auto-refreshing every {refreshInterval}s)</span>}
          </div>
        )}
      </div>

      {/* Current Values */}
      {currentData && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="text-xs text-gray-400 mb-1">Current OI</div>
            <div className="text-2xl font-bold text-blue-400">
              {(currentData.oi / 100000).toFixed(2)}L
            </div>
            <div className={`text-xs mt-1 ${parseFloat(currentData.oiChange) > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(currentData.oiChange) > 0 ? '+' : ''}{currentData.oiChange}%
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-green-500">
            <div className="text-xs text-gray-400 mb-1">Volume</div>
            <div className="text-2xl font-bold text-green-400">
              {(currentData.volume / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-gray-400 mt-1">Contracts</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-purple-500">
            <div className="text-xs text-gray-400 mb-1">ATP</div>
            <div className="text-2xl font-bold text-purple-400">
              ₹{currentData.atp.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Avg Traded Price</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-yellow-500">
            <div className="text-xs text-gray-400 mb-1">LTP</div>
            <div className="text-2xl font-bold text-yellow-400">
              ₹{currentData.ltp.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Last Traded Price</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-red-500">
            <div className="text-xs text-gray-400 mb-1">Call OI</div>
            <div className="text-2xl font-bold text-red-400">
              {(currentData.callOI / 100000).toFixed(2)}L
            </div>
            <div className="text-xs text-gray-400 mt-1">Resistance</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-green-500">
            <div className="text-xs text-gray-400 mb-1">Put OI</div>
            <div className="text-2xl font-bold text-green-400">
              {(currentData.putOI / 100000).toFixed(2)}L
            </div>
            <div className="text-xs text-gray-400 mt-1">Support</div>
          </div>
        </div>
      )}

      {/* Charts */}
      {oiData.length > 0 && (
        <>
          {/* OI Chart */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              Open Interest Movement
              <InfoTooltip
                title="Live OI Movement Chart"
                content="Shows how Open Interest is changing throughout the trading session. Each data point represents OI at that specific time."
                tradingLogic="Steadily rising OI = Positions building up (trend strengthening). Falling OI = Positions closing (trend weakening). Sudden spikes = Big players entering. Use with price to confirm intraday direction."
              />
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={oiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  yAxisId="left" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                  tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`}
                  label={{ value: 'Open Interest (Lakhs)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  formatter={(value, name) => {
                    if (name === 'Open Interest') {
                      return [`${(value / 100000).toFixed(2)}L`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="oi" 
                  fill="#3b82f6" 
                  stroke="#3b82f6" 
                  fillOpacity={0.2} 
                  name="Open Interest" 
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="oi" 
                  stroke="#60a5fa" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', r: 4 }} 
                  name="OI Trend" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Chart */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Volume Movement
              <InfoTooltip
                title="Live Volume Chart"
                content="Real-time trading volume showing market participation at different times during the session."
                tradingLogic="High volume periods = Active trading, strong moves. Low volume = Weak participation, avoid trading. Volume spikes with price moves = Genuine breakouts. Use to time your entries/exits."
              />
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={oiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  label={{ value: 'Volume (Million)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  formatter={(value) => [`${(value / 1000000).toFixed(2)}M`, 'Volume']}
                />
                <Bar dataKey="volume" fill="#10b981" radius={[8, 8, 0, 0]} name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ATP Chart */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-purple-400" />
              Price Movement (ATP vs LTP)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={oiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tickFormatter={(value) => `₹${value.toFixed(0)}`}
                  label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  formatter={(value) => `₹${value.toFixed(2)}`}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="atp" 
                  stroke="#a855f7" 
                  strokeWidth={3} 
                  dot={{ fill: '#a855f7', r: 4 }} 
                  name="ATP (Avg Traded Price)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="ltp" 
                  stroke="#fbbf24" 
                  strokeWidth={3} 
                  dot={{ fill: '#fbbf24', r: 4 }} 
                  name="LTP (Last Traded Price)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Call vs Put OI Chart */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">📞 Call vs Put OI (Support & Resistance)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={oiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                  tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`}
                  label={{ value: 'OI (Lakhs)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  formatter={(value, name) => [`${(value / 100000).toFixed(2)}L`, name]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area 
                  type="monotone" 
                  dataKey="callOI" 
                  fill="#ef4444" 
                  stroke="#ef4444" 
                  fillOpacity={0.2} 
                  name="Call OI (Resistance)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="putOI" 
                  fill="#10b981" 
                  stroke="#10b981" 
                  fillOpacity={0.2} 
                  name="Put OI (Support)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="callOI" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ fill: '#ef4444', r: 4 }} 
                  name="Call OI" 
                />
                <Line 
                  type="monotone" 
                  dataKey="putOI" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', r: 4 }} 
                  name="Put OI" 
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-slate-700 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-red-400 font-semibold">🔴 Call OI High = Resistance</span>
                  <p className="text-gray-400 text-xs mt-1">Price may face selling pressure</p>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">🟢 Put OI High = Support</span>
                  <p className="text-gray-400 text-xs mt-1">Price may find buying support</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Statistics */}
      {stats && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">📊 Session Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">OI Max</div>
              <div className="text-lg font-bold text-green-400">
                {(stats.oiMax / 100000).toFixed(2)}L
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">OI Min</div>
              <div className="text-lg font-bold text-red-400">
                {(stats.oiMin / 100000).toFixed(2)}L
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">OI Avg</div>
              <div className="text-lg font-bold text-blue-400">
                {(stats.oiAvg / 100000).toFixed(2)}L
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Total Volume</div>
              <div className="text-lg font-bold text-green-400">
                {(stats.volumeTotal / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">ATP High</div>
              <div className="text-lg font-bold text-purple-400">
                ₹{stats.atpMax.toFixed(2)}
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">ATP Low</div>
              <div className="text-lg font-bold text-purple-400">
                ₹{stats.atpMin.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {oiData.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">📋 Live Data Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700">
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-right">OI</th>
                  <th className="p-3 text-right">OI Change %</th>
                  <th className="p-3 text-right">Volume</th>
                  <th className="p-3 text-right">ATP</th>
                  <th className="p-3 text-right">LTP</th>
                  <th className="p-3 text-right">Call OI</th>
                  <th className="p-3 text-right">Put OI</th>
                  <th className="p-3 text-right">PCR</th>
                </tr>
              </thead>
              <tbody>
                {oiData.slice().reverse().slice(0, 20).map((row, index) => (
                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-700">
                    <td className="p-3">{row.time}</td>
                    <td className="p-3 text-right font-mono">{(row.oi / 100000).toFixed(2)}L</td>
                    <td className={`p-3 text-right font-mono ${parseFloat(row.oiChange) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(row.oiChange) > 0 ? '+' : ''}{row.oiChange}%
                    </td>
                    <td className="p-3 text-right font-mono">{(row.volume / 1000000).toFixed(2)}M</td>
                    <td className="p-3 text-right font-mono">₹{row.atp.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono">₹{row.ltp.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono text-red-400">{(row.callOI / 100000).toFixed(2)}L</td>
                    <td className="p-3 text-right font-mono text-green-400">{(row.putOI / 100000).toFixed(2)}L</td>
                    <td className="p-3 text-right font-mono text-blue-400">{row.pcr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {oiData.length > 20 && (
              <div className="text-center text-sm text-gray-400 mt-4">
                Showing last 20 entries of {oiData.length} total
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {oiData.length === 0 && (
        <div className="bg-slate-800 rounded-lg p-12 text-center">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Data Yet</h3>
          <p className="text-gray-500 mb-4">
            {marketStatus 
              ? 'Click "Start Tracking" to begin monitoring live OI data' 
              : 'Market is closed. Tracking will start when market opens.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveOITracker;
