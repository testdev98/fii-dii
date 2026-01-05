// Broker Configuration
// Add more brokers as needed

export const BROKERS = {
  ANGEL_ONE: {
    id: 'angel_one',
    name: 'Angel One (Angel Broking)',
    logo: '📊',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'Enter your API Key' },
      { name: 'clientId', label: 'Client ID', type: 'text', required: true, placeholder: 'Enter your Client ID' },
      { name: 'password', label: 'MPIN (4-digit)', type: 'password', required: true, placeholder: 'Enter your 4-digit MPIN (not password)' },
      { name: 'totp', label: 'TOTP Code', type: 'text', required: true, placeholder: 'Enter 6-digit code from authenticator app' }
    ],
    apiUrl: 'https://apiconnect.angelbroking.com',
    documentation: 'https://smartapi.angelbroking.com/docs'
  },
  
  ZERODHA: {
    id: 'zerodha',
    name: 'Zerodha (Kite Connect)',
    logo: '🔷',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'Enter your API Key' },
      { name: 'apiSecret', label: 'API Secret', type: 'password', required: true, placeholder: 'Enter your API Secret' },
      { name: 'requestToken', label: 'Request Token', type: 'text', required: false, placeholder: 'Optional: Request Token' }
    ],
    apiUrl: 'https://api.kite.trade',
    documentation: 'https://kite.trade/docs/connect/v3/'
  },
  
  UPSTOX: {
    id: 'upstox',
    name: 'Upstox',
    logo: '🟣',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'Enter your API Key' },
      { name: 'apiSecret', label: 'API Secret', type: 'password', required: true, placeholder: 'Enter your API Secret' },
      { name: 'redirectUri', label: 'Redirect URI', type: 'text', required: true, placeholder: 'Enter Redirect URI' }
    ],
    apiUrl: 'https://api.upstox.com/v2',
    documentation: 'https://upstox.com/developer/api-documentation'
  },
  
  FYERS: {
    id: 'fyers',
    name: 'Fyers',
    logo: '🟠',
    fields: [
      { name: 'appId', label: 'App ID', type: 'text', required: true, placeholder: 'Enter your App ID' },
      { name: 'secretId', label: 'Secret ID', type: 'password', required: true, placeholder: 'Enter your Secret ID' },
      { name: 'redirectUri', label: 'Redirect URI', type: 'text', required: true, placeholder: 'Enter Redirect URI' }
    ],
    apiUrl: 'https://api.fyers.in/api/v2',
    documentation: 'https://myapi.fyers.in/docsv2'
  },
  
  IIFL: {
    id: 'iifl',
    name: 'IIFL Securities',
    logo: '🔶',
    fields: [
      { name: 'appKey', label: 'App Key', type: 'text', required: true, placeholder: 'Enter your App Key' },
      { name: 'secretKey', label: 'Secret Key', type: 'password', required: true, placeholder: 'Enter your Secret Key' },
      { name: 'userId', label: 'User ID', type: 'text', required: true, placeholder: 'Enter your User ID' },
      { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'Enter your Password' }
    ],
    apiUrl: 'https://ttblaze.iifl.com/apimarketdata',
    documentation: 'https://www.iiflsecurities.com/api-documentation'
  },
  
  ALICE_BLUE: {
    id: 'alice_blue',
    name: 'Alice Blue',
    logo: '🔵',
    fields: [
      { name: 'userId', label: 'User ID', type: 'text', required: true, placeholder: 'Enter your User ID' },
      { name: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'Enter your API Key' },
      { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'Enter your Password' }
    ],
    apiUrl: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService',
    documentation: 'https://v2api.aliceblueonline.com/'
  },
  
  KOTAK: {
    id: 'kotak',
    name: 'Kotak Securities',
    logo: '🔴',
    fields: [
      { name: 'consumerKey', label: 'Consumer Key', type: 'text', required: true, placeholder: 'Enter Consumer Key' },
      { name: 'consumerSecret', label: 'Consumer Secret', type: 'password', required: true, placeholder: 'Enter Consumer Secret' },
      { name: 'accessToken', label: 'Access Token', type: 'text', required: true, placeholder: 'Enter Access Token' }
    ],
    apiUrl: 'https://tradeapi.kotaksecurities.com/apim',
    documentation: 'https://ctradeapi.kotaksecurities.com/'
  },
  
  ICICI_DIRECT: {
    id: 'icici_direct',
    name: 'ICICI Direct',
    logo: '🟤',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'Enter your API Key' },
      { name: 'sessionToken', label: 'Session Token', type: 'text', required: true, placeholder: 'Enter Session Token' }
    ],
    apiUrl: 'https://api.icicidirect.com',
    documentation: 'https://api.icicidirect.com/apiuser/home'
  },
  
  DHAN: {
    id: 'dhan',
    name: 'Dhan',
    logo: '🟢',
    fields: [
      { name: 'clientId', label: 'Client ID', type: 'text', required: true, placeholder: 'Enter your Dhan Client ID' },
      { name: 'accessToken', label: 'Access Token', type: 'password', required: true, placeholder: 'Enter your Access Token from Dhan Web' }
    ],
    apiUrl: 'https://api.dhan.co',
    documentation: 'https://dhanhq.co/docs/v2/'
  }
};

export const getBrokerById = (brokerId) => {
  return BROKERS[brokerId.toUpperCase()];
};

export const getAllBrokers = () => {
  return Object.values(BROKERS);
};
