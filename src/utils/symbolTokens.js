// Angel One Symbol Tokens Mapping
// These are instrument tokens required by Angel One API
// Base prices are fallback only - app uses real-time prices from broker API

export const SYMBOL_TOKENS = {
  // Indices - Tokens for Angel One API
  'NIFTY': { token: '99926000', exchange: 'NSE', basePrice: 26300, strikeInterval: 50 },
  'BANKNIFTY': { token: '99926009', exchange: 'NSE', basePrice: 54200, strikeInterval: 100 },
  'FINNIFTY': { token: '99926037', exchange: 'NSE', basePrice: 23500, strikeInterval: 50 },
  'MIDCPNIFTY': { token: '99926074', exchange: 'NSE', basePrice: 13000, strikeInterval: 25 },
  
  // Popular Stocks
  'RELIANCE': { token: '2885', exchange: 'NSE', basePrice: 1590, strikeInterval: 50 },
  'TCS': { token: '11536', exchange: 'NSE', basePrice: 4200, strikeInterval: 50 },
  'HDFCBANK': { token: '1333', exchange: 'NSE', basePrice: 1750, strikeInterval: 20 },
  'INFY': { token: '1594', exchange: 'NSE', basePrice: 1900, strikeInterval: 20 },
  'ICICIBANK': { token: '4963', exchange: 'NSE', basePrice: 1350, strikeInterval: 20 },
  'SBIN': { token: '3045', exchange: 'NSE', basePrice: 850, strikeInterval: 10 },
  'BHARTIARTL': { token: '10604', exchange: 'NSE', basePrice: 1650, strikeInterval: 20 },
  'ITC': { token: '1660', exchange: 'NSE', basePrice: 480, strikeInterval: 10 },
  'KOTAKBANK': { token: '1922', exchange: 'NSE', basePrice: 1850, strikeInterval: 20 },
  'LT': { token: '11483', exchange: 'NSE', basePrice: 3700, strikeInterval: 50 },
  'AXISBANK': { token: '5900', exchange: 'NSE', basePrice: 1150, strikeInterval: 20 },
  'WIPRO': { token: '3787', exchange: 'NSE', basePrice: 580, strikeInterval: 10 },
  'TATAMOTORS': { token: '3456', exchange: 'NSE', basePrice: 800, strikeInterval: 10 },
  'TATASTEEL': { token: '3499', exchange: 'NSE', basePrice: 150, strikeInterval: 5 },
  'ADANIENT': { token: '25', exchange: 'NSE', basePrice: 2500, strikeInterval: 50 }
};

export const getSymbolToken = (symbol) => {
  return SYMBOL_TOKENS[symbol] || { token: '99926000', exchange: 'NSE', basePrice: 26300, strikeInterval: 50 };
};
