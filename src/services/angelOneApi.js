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
      if (!symbol) {
        throw new Error('Symbol token is required for historical data');
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
        return {
          success: true,
          data: response.data.data
        };
      }
      
      throw new Error('No historical data received from API');
    } catch (error) {
      console.error('❌ Historical data error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.message || 'Failed to fetch historical data'
      };
    }
  }

  getDateString(daysOffset) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0] + ' 09:00';
  }

  async getFIIDIIData() {
    // Angel One doesn't provide FII/DII data directly
    // Use NSE API instead
    console.warn('⚠️ Angel One does not provide FII/DII data. Use NSE API instead.');
    return {
      success: false,
      error: 'FII/DII data not available from Angel One API. Please use NSE data source.'
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
