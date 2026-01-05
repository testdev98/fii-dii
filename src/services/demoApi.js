// Demo API - Not used (all brokers require real credentials)

class DemoAPI {
  constructor() {
    this.isDemo = true;
  }

  setCredentials() {
    // Not used
  }

  async login(credentials) {
    throw new Error('Demo mode is not available. Please login with a real broker.');
  }

  async getMarketData(symbol, exchange) {
    throw new Error('Demo mode is not available. Please login with a real broker.');
  }

  async getOptionChain(symbol, expiryDate) {
    throw new Error('Demo mode is not available. Please login with a real broker.');
  }

  async getFIIDIIData() {
    throw new Error('Demo mode is not available. Please login with a real broker.');
  }

  async getHistoricalData(symbol, interval, fromDate, toDate) {
    throw new Error('Demo mode is not available. Please login with a real broker.');
  }
}

export default DemoAPI;
