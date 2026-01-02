// Demo API - Returns mock data for testing

class DemoAPI {
  constructor() {
    this.isDemo = true;
  }

  async login(credentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Demo mode activated',
      data: {
        mode: 'demo',
        features: 'all'
      }
    };
  }

  async getMarketData(symbol, exchange) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        symbol: symbol,
        exchange: exchange,
        ltp: 18350 + Math.random() * 100,
        open: 18300,
        high: 18400,
        low: 18250,
        close: 18320,
        volume: 15000000 + Math.random() * 5000000,
        oi: 1400000 + Math.random() * 100000
      }
    };
  }

  async getOptionChain(symbol, expiryDate) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const strikes = [];
    const basePrice = 18350;
    
    for (let i = -5; i <= 5; i++) {
      const strike = basePrice + (i * 50);
      strikes.push({
        strike: strike,
        callOI: Math.floor(Math.random() * 2000000),
        putOI: Math.floor(Math.random() * 2000000),
        callLTP: Math.max(10, 200 - Math.abs(i) * 30),
        putLTP: Math.max(10, 200 - Math.abs(i) * 30)
      });
    }
    
    return {
      success: true,
      data: strikes
    };
  }

  async getFIIDIIData() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
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

  async getHistoricalData(symbol, interval, fromDate, toDate) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const data = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const basePrice = 18100;
    const baseOI = 1200000;
    
    days.forEach((day, index) => {
      data.push({
        date: day,
        price: basePrice + (index * 50) + Math.random() * 50,
        oi: baseOI + (index * 50000) + Math.random() * 50000,
        volume: 12000000 + Math.random() * 5000000
      });
    });
    
    return {
      success: true,
      data: data
    };
  }
}

export default DemoAPI;
