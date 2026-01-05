import axios from 'axios';

class UpstoxAPI {
  constructor() {
    this.apiKey = '';
    this.apiSecret = '';
    this.accessToken = '';
    this.baseUrl = 'https://api.upstox.com/v2';
  }

  setCredentials(apiKey, apiSecret, accessToken) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.accessToken = accessToken;
  }

  async login(credentials) {
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    
    // Upstox uses OAuth 2.0
    // You need to implement the OAuth flow
    throw new Error('OAuth flow required for Upstox. Please visit Upstox documentation.');
  }

  async getMarketData(symbol, exchange) {
    try {
      const response = await axios.get(`${this.baseUrl}/market-quote/quotes`, {
        params: {
          symbol: `${exchange}:${symbol}`
        },
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Market data error:', error);
      throw error;
    }
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/json'
    };
  }
}

export default UpstoxAPI;
