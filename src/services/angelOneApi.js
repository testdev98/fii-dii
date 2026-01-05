import axios from 'axios';
import * as OTPAuth from 'otpauth';

const API_BASE_URL = 'https://apiconnect.angelbroking.com';

class AngelOneAPI {
  constructor() {
    this.apiKey = '';
    this.accessToken = '';
    this.clientId = '';
    this.feedToken = '';
  }

  setCredentials(apiKey, clientId, accessToken, feedToken) {
    this.apiKey = apiKey;
    this.clientId = clientId;
    this.accessToken = accessToken;
    this.feedToken = feedToken;
  }

  async login(credentials) {
    try {
      const { apiKey, clientId, password, totp } = credentials;
      
      // Set API key first
      this.apiKey = apiKey;
      this.clientId = clientId;
      
      // Determine if totp is a secret key or a 6-digit code
      let totpCode;
      if (totp.length === 6 && /^\d+$/.test(totp)) {
        // It's already a 6-digit code
        totpCode = totp;
      } else {
        // It's a secret key, generate the code
        try {
          const totpGenerator = new OTPAuth.TOTP({
            secret: totp,
          });
          totpCode = totpGenerator.generate();
        } catch (error) {
          throw new Error('Invalid TOTP format. Please enter the 6-digit code from your authenticator app');
        }
      }
      
      const requestBody = {
        clientcode: clientId,
        password: password, // This should be MPIN (4-digit)
        totp: totpCode
      };
      
      const response = await axios.post(`${API_BASE_URL}/rest/auth/angelbroking/user/v1/loginByPassword`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-UserType': 'USER',
          'X-SourceID': 'WEB',
          'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
          'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
          'X-MACAddress': 'MAC_ADDRESS',
          'X-PrivateKey': apiKey
        }
      });
      
      if (response.data && response.data.status) {
        this.accessToken = response.data.data.jwtToken;
        this.feedToken = response.data.data.feedToken;
        return response.data;
      }
      throw new Error(response.data?.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Invalid credentials';
      throw new Error(errorMessage);
    }
  }

  async getMarketData(symbol, exchange, token, basePrice = 24500) {
    try {
      console.log(`🔍 Fetching market data for ${symbol} (Token: ${token}, Exchange: ${exchange})`);
      
      if (!token) {
        throw new Error('Token is required for market data');
      }

      const response = await axios.post(`${API_BASE_URL}/rest/secure/angelbroking/market/v1/quote/`, {
        mode: 'FULL',
        exchangeTokens: {
          [exchange]: [token]
        }
      }, {
        headers: this.getHeaders()
      });
      
      console.log('📡 Angel One API Response:', response.data);
      
      if (response.data && response.data.status && response.data.data) {
        const fetchedData = response.data.data.fetched[0];
        
        if (fetchedData) {
          console.log(`✅ Real price from broker: ₹${fetchedData.ltp}`);
          
          return {
            success: true,
            status: true,
            data: {
              ltp: parseFloat(fetchedData.ltp),
              open: parseFloat(fetchedData.open),
              high: parseFloat(fetchedData.high),
              low: parseFloat(fetchedData.low),
              close: parseFloat(fetchedData.close),
              volume: parseInt(fetchedData.volume || 0),
              pChange: parseFloat(fetchedData.pChange || 0)
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

  async getOptionChain(symbol, expiryDate) {
    try {
      console.log(`📈 Fetching option chain for ${symbol} expiry: ${expiryDate}`);
      
      // Angel One doesn't have a direct option chain API
      // We need to fetch individual option contracts
      // For now, return null and let the app generate strikes based on current price
      console.warn('⚠️ Angel One API does not provide option chain endpoint');
      console.warn('💡 App will calculate strikes based on current price');
      
      return null;
    } catch (error) {
      console.error('Option chain error:', error);
      return null;
    }
  }

  async getHistoricalData(symbol, exchange, interval, fromDate, toDate) {
    try {
      // If symbol token not provided, return mock data
      if (!symbol) {
        return this.getMockHistoricalData();
      }

      const response = await axios.post(`${API_BASE_URL}/rest/secure/angelbroking/historical/v1/getCandleData`, {
        exchange: exchange,
        symboltoken: symbol,
        interval: interval || 'ONE_DAY',
        fromdate: fromDate || this.getDateString(-7),
        todate: toDate || this.getDateString(0)
      }, {
        headers: this.getHeaders()
      });
      
      // Check if response is successful
      if (response.data && response.data.status && response.data.data) {
        return response.data;
      }
      
      // If API returns error, use mock data
      console.warn('Historical data API returned error, using mock data');
      return this.getMockHistoricalData();
    } catch (error) {
      console.error('Historical data error:', error.response?.data || error.message);
      // Return mock data on error
      return this.getMockHistoricalData();
    }
  }

  getDateString(daysOffset) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0] + ' 09:00';
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
    // Angel One doesn't provide FII/DII data directly
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
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
      'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
      'X-MACAddress': 'MAC_ADDRESS',
      'X-PrivateKey': this.apiKey
    };
  }
}

export default AngelOneAPI;
