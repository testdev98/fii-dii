import AngelOneAPI from './angelOneApi';
import ZerodhaAPI from './zerodhaApi';
import UpstoxAPI from './upstoxApi';
import DhanAPI from './dhanApi';
import DemoAPI from './demoApi';

class BrokerFactory {
  static createBrokerAPI(brokerId) {
    switch (brokerId) {
      case 'angel_one':
        return new AngelOneAPI();
      case 'zerodha':
        return new ZerodhaAPI();
      case 'upstox':
        return new UpstoxAPI();
      case 'dhan':
        return new DhanAPI();
      case 'demo':
        return new DemoAPI();
      default:
        return new DemoAPI();
    }
  }
}

export default BrokerFactory;
