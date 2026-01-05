import axios from 'axios';

const API_BASE_URL = 'https://api.dhan.co';

class DhanAPI {
  constructor() {
    this.accessToken = '';
    this.clientId = '';
  }

  setCredentials(clientId, accessToken) {
    this.clientId = clientId;
    this.accessToken = accessToken;
  }

  async login(credentials) {
    try {
      const { clientId, accessToken } = credentials;
      
      // Set credentials
      this.clientId = clientId;
      this.accessToken = accessToken;
      
      // Verify token by fetching user profile
      const response = await axios.get(`${API_BASE_URL}/v2/profile`, {
        headers: this.getHeaders()
      });
      
      if (response.data && response.data.dhanClientId) {
        return {
          success: true,
          status: true,
          message: 'Login successful',
          data: {
            clientId: response.data.dhanClientId,
            tokenValidity: response.data.tokenValidity,
            activeSegment: response.data.activeSegment,
            ddpi: response.data.ddpi
          }
        };
      }
      
      throw new Error('Invalid access token or client ID');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Invalid credentials';
      throw new Error(errorMessage);
    }
  }

  async getMarketData(symbol, exchange, tokenOrSecurityId, basePrice = 24500) {
    try {
      console.log(`🔍 Fetching market data for ${symbol} (Token/Security ID: ${tokenOrSecurityId}, Exchange: ${exchange})`);
      
      // Get Dhan-specific security ID from symbol tokens
      const symbolInfo = this.getSymbolInfo(symbol);
      const securityId = symbolInfo.dhanSecurityId || tokenOrSecurityId;
      const exchangeSegment = symbolInfo.dhanExchange || this.mapExchangeSegment(exchange);
      
      if (!securityId) {
        throw new Error('Security ID is required for market data');
      }

      const requestBody = {
        [exchangeSegment]: [parseInt(securityId)]
      };

      const response = await axios.post(
        `${API_BASE_URL}/v2/marketfeed/quote`,
        requestBody,
        {
          headers: this.getHeaders()
        }
      );
      
      console.log('📡 Dhan API Response:', response.data);
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        const exchangeData = response.data.data[exchangeSegment];
        const quoteData = exchangeData[securityId];
        
        if (quoteData) {
          console.log(`✅ Real price from broker: ₹${quoteData.last_price}`);
          
          return {
            success: true,
            status: true,
            data: {
              ltp: parseFloat(quoteData.last_price),
              open: parseFloat(quoteData.ohlc?.open || quoteData.last_price),
              high: parseFloat(quoteData.ohlc?.high || quoteData.last_price),
              low: parseFloat(quoteData.ohlc?.low || quoteData.last_price),
              close: parseFloat(quoteData.ohlc?.close || quoteData.last_price),
              volume: parseInt(quoteData.volume || 0),
              oi: parseInt(quoteData.oi || 0),
              pChange: parseFloat(quoteData.net_change || 0)
            }
          };
        }
      }
      
      throw new Error('No data received from broker API');
    } catch (error) {
      console.error('❌ Market data error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOptionChain(symbol, expiryDate, underlyingSecurityId = 13) {
    try {
      console.log(`📈 Fetching option chain for ${symbol} expiry: ${expiryDate}`);
      
      // Map symbol to underlying security ID and segment
      const { securityId, segment } = this.getUnderlyingInfo(symbol, underlyingSecurityId);
      
      const requestBody = {
        UnderlyingScrip: securityId,
        UnderlyingSeg: segment,
        Expiry: expiryDate
      };

      const response = await axios.post(
        `${API_BASE_URL}/v2/optionchain`,
        requestBody,
        {
          headers: this.getHeaders()
        }
      );
      
      console.log('📊 Option Chain Response:', response.data);
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        const optionChainData = response.data.data;
        const strikes = [];
        
        // Parse option chain data
        Object.keys(optionChainData.oc || {}).forEach(strikePrice => {
          const strike = parseFloat(strikePrice);
          const strikeData = optionChainData.oc[strikePrice];
          
          strikes.push({
            strike: strike,
            ce: {
              ltp: strikeData.ce?.last_price || 0,
              oi: strikeData.ce?.oi || 0,
              volume: strikeData.ce?.volume || 0,
              iv: strikeData.ce?.implied_volatility || 0,
              delta: strikeData.ce?.greeks?.delta || 0,
              theta: strikeData.ce?.greeks?.theta || 0,
              gamma: strikeData.ce?.greeks?.gamma || 0,
              vega: strikeData.ce?.greeks?.vega || 0
            },
            pe: {
              ltp: strikeData.pe?.last_price || 0,
              oi: strikeData.pe?.oi || 0,
              volume: strikeData.pe?.volume || 0,
              iv: strikeData.pe?.implied_volatility || 0,
              delta: strikeData.pe?.greeks?.delta || 0,
              theta: strikeData.pe?.greeks?.theta || 0,
              gamma: strikeData.pe?.greeks?.gamma || 0,
              vega: strikeData.pe?.greeks?.vega || 0
            }
          });
        });
        
        return {
          success: true,
          status: true,
          data: {
            underlyingPrice: optionChainData.last_price,
            strikes: strikes.sort((a, b) => a.strike - b.strike)
          }
        };
      }
      
      console.warn('⚠️ Option chain data not available');
      return null;
    } catch (error) {
      console.error('Option chain error:', error.response?.data || error.message);
      return null;
    }
  }

  async getExpiryList(symbol, underlyingSecurityId = 13) {
    try {
      const { securityId, segment } = this.getUnderlyingInfo(symbol, underlyingSecurityId);
      
      const requestBody = {
        UnderlyingScrip: securityId,
        UnderlyingSeg: segment
      };

      const response = await axios.post(
        `${API_BASE_URL}/v2/optionchain/expirylist`,
        requestBody,
        {
          headers: this.getHeaders()
        }
      );
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return null;
    } catch (error) {
      console.error('Expiry list error:', error);
      return null;
    }
  }

  async getHistoricalData(symbol, exchange, interval, fromDate, toDate) {
    try {
      // Return mock data for now as historical data requires different endpoint
      return this.getMockHistoricalData();
    } catch (error) {
      console.error('Historical data error:', error.response?.data || error.message);
      return this.getMockHistoricalData();
    }
  }

  getMockHistoricalData() {
    return {
      success: true,
      status: true,
      data: [
        { date: 'Mon', price: 18100, oi: 1200000, fii: 1100, dii: -800 },
        { date: 'Tue', price: 18200, oi: 1250000, fii: 1150, dii: -750 },
        { date: 'Wed', price: 18250, oi: 1300000, fii: 1200, dii: -820 },
        { date: 'Thu', price: 18300, oi: 1350000, fii: 1220, dii: -840 },
        { date: 'Fri', price: 18350, oi: 1400000, fii: 1250, dii: -850 }
      ]
    };
  }

  async getFIIDIIData() {
    // Dhan doesn't provide FII/DII data directly
    // Return mock data
    return {
      success: true,
      status: true,
      data: {
        fii: {
          buy: 12500 + Math.random() * 2000,
          sell: 11250 + Math.random() * 2000,
          net: 1250 + Math.random() * 500
        },
        dii: {
          buy: 8500 + Math.random() * 1000,
          sell: 9350 + Math.random() * 1000,
          net: -850 + Math.random() * 300
        },
        date: new Date().toISOString().split('T')[0]
      }
    };
  }

  getHeaders() {
    return {
      'access-token': this.accessToken,
      'client-id': this.clientId,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  mapExchangeSegment(exchange) {
    // Map common exchange names to Dhan format
    const exchangeMap = {
      'NSE': 'NSE_EQ',
      'NSE_EQ': 'NSE_EQ',
      'NSE_FNO': 'NSE_FNO',
      'BSE': 'BSE_EQ',
      'BSE_EQ': 'BSE_EQ',
      'MCX': 'MCX_COMM',
      'IDX_I': 'IDX_I'
    };
    
    return exchangeMap[exchange] || 'NSE_EQ';
  }

  getUnderlyingInfo(symbol, providedSecurityId) {
    // Map common symbols to Dhan security IDs and segments
    const underlyingMap = {
      'NIFTY': { securityId: 13, segment: 'IDX_I' },
      'BANKNIFTY': { securityId: 25, segment: 'IDX_I' },
      'FINNIFTY': { securityId: 27, segment: 'IDX_I' },
      'MIDCPNIFTY': { securityId: 28, segment: 'IDX_I' },
      'SENSEX': { securityId: 51, segment: 'IDX_I' },
      'BANKEX': { securityId: 52, segment: 'IDX_I' }
    };
    
    // If provided security ID, use it with IDX_I segment
    if (providedSecurityId) {
      return { securityId: providedSecurityId, segment: 'IDX_I' };
    }
    
    return underlyingMap[symbol.toUpperCase()] || { securityId: 13, segment: 'IDX_I' };
  }

  getSymbolInfo(symbol) {
    // Import symbol tokens mapping
    const symbolMap = {
      'NIFTY': { dhanSecurityId: 13, dhanExchange: 'IDX_I' },
      'BANKNIFTY': { dhanSecurityId: 25, dhanExchange: 'IDX_I' },
      'FINNIFTY': { dhanSecurityId: 27, dhanExchange: 'IDX_I' },
      'MIDCPNIFTY': { dhanSecurityId: 28, dhanExchange: 'IDX_I' },
      'RELIANCE': { dhanSecurityId: 500, dhanExchange: 'NSE_EQ' },
      'TCS': { dhanSecurityId: 11536, dhanExchange: 'NSE_EQ' },
      'HDFCBANK': { dhanSecurityId: 1333, dhanExchange: 'NSE_EQ' },
      'INFY': { dhanSecurityId: 1594, dhanExchange: 'NSE_EQ' },
      'ICICIBANK': { dhanSecurityId: 4963, dhanExchange: 'NSE_EQ' },
      'SBIN': { dhanSecurityId: 3045, dhanExchange: 'NSE_EQ' },
      'BHARTIARTL': { dhanSecurityId: 10604, dhanExchange: 'NSE_EQ' },
      'ITC': { dhanSecurityId: 1660, dhanExchange: 'NSE_EQ' },
      'KOTAKBANK': { dhanSecurityId: 1922, dhanExchange: 'NSE_EQ' },
      'LT': { dhanSecurityId: 11483, dhanExchange: 'NSE_EQ' },
      'AXISBANK': { dhanSecurityId: 5900, dhanExchange: 'NSE_EQ' },
      'WIPRO': { dhanSecurityId: 3787, dhanExchange: 'NSE_EQ' },
      'TATAMOTORS': { dhanSecurityId: 3456, dhanExchange: 'NSE_EQ' },
      'TATASTEEL': { dhanSecurityId: 3499, dhanExchange: 'NSE_EQ' },
      'ADANIENT': { dhanSecurityId: 25, dhanExchange: 'NSE_EQ' }
    };
    
    return symbolMap[symbol.toUpperCase()] || { dhanSecurityId: 13, dhanExchange: 'IDX_I' };
  }
}

export default DhanAPI;
