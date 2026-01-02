import axios from 'axios';

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

  async login(clientId, password, totp) {
    try {
      const response = await axios.post(`${API_BASE_URL}/rest/auth/angelbroking/user/v1/loginByPassword`, {
        clientcode: clientId,
        password: password,
        totp: totp
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-UserType': 'USER',
          'X-SourceID': 'WEB',
          'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
          'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
          'X-MACAddress': 'MAC_ADDRESS',
          'X-PrivateKey': this.apiKey
        }
      });
      
      if (response.data.status) {
        this.accessToken = response.data.data.jwtToken;
        this.feedToken = response.data.data.feedToken;
        this.clientId = clientId;
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getMarketData(symbol, exchange, token) {
    try {
      const response = await axios.post(`${API_BASE_URL}/rest/secure/angelbroking/market/v1/quote/`, {
        mode: 'FULL',
        exchangeTokens: {
          [exchange]: [token]
        }
      }, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Market data error:', error);
      throw error;
    }
  }

  async getOptionChain(symbol, expiryDate) {
    try {
      const response = await axios.get(`${API_BASE_URL}/rest/secure/angelbroking/market/v1/optionChain`, {
        params: {
          symbol: symbol,
          expirydate: expiryDate
        },
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Option chain error:', error);
      throw error;
    }
  }

  async getHistoricalData(symbol, exchange, interval, fromDate, toDate) {
    try {
      const response = await axios.post(`${API_BASE_URL}/rest/secure/angelbroking/historical/v1/getCandleData`, {
        exchange: exchange,
        symboltoken: symbol,
        interval: interval,
        fromdate: fromDate,
        todate: toDate
      }, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Historical data error:', error);
      throw error;
    }
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

export default new AngelOneAPI();
