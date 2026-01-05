// Angel One Symbol Tokens Mapping
// These are instrument tokens required by Angel One API

export const SYMBOL_TOKENS = {
  // Indices
  'NIFTY': { token: '99926000', exchange: 'NSE' },
  'BANKNIFTY': { token: '99926009', exchange: 'NSE' },
  'FINNIFTY': { token: '99926037', exchange: 'NSE' },
  'MIDCPNIFTY': { token: '99926074', exchange: 'NSE' },
  
  // Popular Stocks
  'RELIANCE': { token: '2885', exchange: 'NSE' },
  'TCS': { token: '11536', exchange: 'NSE' },
  'HDFCBANK': { token: '1333', exchange: 'NSE' },
  'INFY': { token: '1594', exchange: 'NSE' },
  'ICICIBANK': { token: '4963', exchange: 'NSE' },
  'SBIN': { token: '3045', exchange: 'NSE' },
  'BHARTIARTL': { token: '10604', exchange: 'NSE' },
  'ITC': { token: '1660', exchange: 'NSE' },
  'KOTAKBANK': { token: '1922', exchange: 'NSE' },
  'LT': { token: '11483', exchange: 'NSE' },
  'AXISBANK': { token: '5900', exchange: 'NSE' },
  'WIPRO': { token: '3787', exchange: 'NSE' },
  'TATAMOTORS': { token: '3456', exchange: 'NSE' },
  'TATASTEEL': { token: '3499', exchange: 'NSE' },
  'ADANIENT': { token: '25', exchange: 'NSE' }
};

export const getSymbolToken = (symbol) => {
  return SYMBOL_TOKENS[symbol] || { token: '99926000', exchange: 'NSE' }; // Default to NIFTY
};
