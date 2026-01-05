import axios from 'axios';

/**
 * NSE API Service for fetching official market data
 * - FII/DII data from NSE Bhavcopy
 * - Option Chain data
 * - Sector indices
 */

const NSE_BASE_URL = 'https://www.nseindia.com/api';

class NSEAPI {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    };
  }

  /**
   * Fetch FII/DII data from NSE
   * Note: This data is published after market hours (T-1 data)
   */
  async getFIIDIIData() {
    try {
      // NSE publishes FII/DII data in their archives
      // This is T-1 (previous trading day) data
      const response = await axios.get(`${NSE_BASE_URL}/fiidiiTrading`, {
        headers: this.headers,
        timeout: 10000
      });

      if (response.data) {
        return {
          success: true,
          data: {
            fii: {
              buy: parseFloat(response.data.fii?.buy || 0),
              sell: parseFloat(response.data.fii?.sell || 0),
              net: parseFloat(response.data.fii?.net || 0)
            },
            dii: {
              buy: parseFloat(response.data.dii?.buy || 0),
              sell: parseFloat(response.data.dii?.sell || 0),
              net: parseFloat(response.data.dii?.net || 0)
            },
            date: response.data.date || new Date().toISOString().split('T')[0],
            dataType: 'T-1' // Previous trading day
          }
        };
      }

      throw new Error('No FII/DII data available from NSE');
    } catch (error) {
      console.error('❌ NSE FII/DII fetch error:', error.message);
      
      // Return null instead of mock data - let the app handle the error
      return {
        success: false,
        error: 'FII/DII data unavailable. NSE publishes this data after market hours.',
        message: 'FII/DII data is published by NSE after market hours (6-7 PM IST) for the previous trading day.'
      };
    }
  }

  /**
   * Fetch option chain data from NSE
   */
  async getOptionChain(symbol) {
    try {
      const symbolMap = {
        'NIFTY': 'NIFTY',
        'BANKNIFTY': 'BANKNIFTY',
        'FINNIFTY': 'FINNIFTY',
        'MIDCPNIFTY': 'MIDCPNIFTY'
      };

      const nseSymbol = symbolMap[symbol] || symbol;
      
      const response = await axios.get(`${NSE_BASE_URL}/option-chain-indices?symbol=${nseSymbol}`, {
        headers: this.headers,
        timeout: 15000
      });

      if (response.data && response.data.records) {
        return {
          success: true,
          data: response.data.records.data,
          underlyingValue: response.data.records.underlyingValue,
          timestamp: response.data.records.timestamp
        };
      }

      throw new Error('No option chain data available');
    } catch (error) {
      console.error('❌ NSE Option Chain fetch error:', error.message);
      return {
        success: false,
        error: 'Option chain data unavailable from NSE'
      };
    }
  }

  /**
   * Fetch sector indices data from NSE
   */
  async getSectorIndices() {
    try {
      const response = await axios.get(`${NSE_BASE_URL}/allIndices`, {
        headers: this.headers,
        timeout: 10000
      });

      if (response.data && response.data.data) {
        // Filter for sector indices
        const sectorIndices = response.data.data.filter(index => 
          index.index && (
            index.index.includes('NIFTY') && 
            !index.index.includes('JUNIOR') &&
            index.index !== 'NIFTY 50' &&
            index.index !== 'NIFTY NEXT 50'
          )
        );

        return {
          success: true,
          data: sectorIndices.map(sector => ({
            name: sector.index,
            value: parseFloat(sector.last),
            change: parseFloat(sector.percentChange),
            previousClose: parseFloat(sector.previousClose),
            open: parseFloat(sector.open),
            high: parseFloat(sector.dayHigh),
            low: parseFloat(sector.dayLow),
            yearHigh: parseFloat(sector.yearHigh),
            yearLow: parseFloat(sector.yearLow)
          }))
        };
      }

      throw new Error('No sector data available');
    } catch (error) {
      console.error('❌ NSE Sector Indices fetch error:', error.message);
      return {
        success: false,
        error: 'Sector data unavailable from NSE'
      };
    }
  }

  /**
   * Fetch market status from NSE
   */
  async getMarketStatus() {
    try {
      const response = await axios.get(`${NSE_BASE_URL}/marketStatus`, {
        headers: this.headers,
        timeout: 5000
      });

      if (response.data) {
        return {
          success: true,
          data: response.data
        };
      }

      throw new Error('Market status unavailable');
    } catch (error) {
      console.error('❌ NSE Market Status fetch error:', error.message);
      return {
        success: false,
        error: 'Market status unavailable'
      };
    }
  }
}

export default new NSEAPI();
