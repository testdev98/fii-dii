# Dhan Broker Integration - Architecture & Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (React)                    │
│                         App.jsx                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Broker Selection                          │
│                  LoginModal Component                        │
│              (Select Dhan from broker list)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Broker Factory                             │
│              src/services/brokerFactory.js                   │
│         Creates appropriate broker API instance              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Dhan API Service                          │
│                src/services/dhanApi.js                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication                                       │  │
│  │  • login(credentials)                                │  │
│  │  • setCredentials(clientId, accessToken)            │  │
│  │  • getHeaders()                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Market Data                                          │  │
│  │  • getMarketData(symbol, exchange, securityId)       │  │
│  │  • Returns: LTP, OHLC, Volume, OI                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Option Chain                                         │  │
│  │  • getOptionChain(symbol, expiry, underlyingId)      │  │
│  │  • getExpiryList(symbol, underlyingId)               │  │
│  │  • Returns: Strikes, Greeks, IV, OI, Volume          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Utilities                                            │  │
│  │  • mapExchangeSegment(exchange)                      │  │
│  │  • getUnderlyingInfo(symbol, securityId)            │  │
│  │  • getSymbolInfo(symbol)                             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Dhan API Server                            │
│                  https://api.dhan.co                         │
│                                                              │
│  • POST /v2/profile                                          │
│  • POST /v2/marketfeed/quote                                 │
│  • POST /v2/marketfeed/ltp                                   │
│  • POST /v2/marketfeed/ohlc                                  │
│  • POST /v2/optionchain                                      │
│  • POST /v2/optionchain/expirylist                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Opens app
     ▼
┌──────────────────┐
│  LoginModal      │
│  Shows brokers   │
└────┬─────────────┘
     │ 2. Selects Dhan
     ▼
┌──────────────────┐
│  Credentials     │
│  Form            │
│  • Client ID     │
│  • Access Token  │
└────┬─────────────┘
     │ 3. Submits
     ▼
┌──────────────────┐
│  BrokerFactory   │
│  Creates DhanAPI │
└────┬─────────────┘
     │ 4. Calls login()
     ▼
┌──────────────────┐
│  DhanAPI         │
│  login()         │
└────┬─────────────┘
     │ 5. POST /v2/profile
     ▼
┌──────────────────┐
│  Dhan Server     │
│  Validates token │
└────┬─────────────┘
     │ 6. Returns user data
     ▼
┌──────────────────┐
│  Session Storage │
│  Save session    │
│  • Token         │
│  • Expiry        │
│  • Credentials   │
└────┬─────────────┘
     │ 7. Login success
     ▼
┌──────────────────┐
│  Dashboard       │
│  Load market data│
└──────────────────┘
```

---

## 📊 Market Data Flow

```
┌──────────┐
│  User    │
│  Selects │
│  Symbol  │
└────┬─────┘
     │ 1. Select NIFTY
     ▼
┌──────────────────┐
│  App.jsx         │
│  loadBrokerData()│
└────┬─────────────┘
     │ 2. Get symbol info
     ▼
┌──────────────────┐
│  symbolTokens.js │
│  Returns:        │
│  • dhanSecurityId│
│  • dhanExchange  │
└────┬─────────────┘
     │ 3. Call API
     ▼
┌──────────────────┐
│  DhanAPI         │
│  getMarketData() │
└────┬─────────────┘
     │ 4. Build request
     │    {
     │      "IDX_I": [13]
     │    }
     ▼
┌──────────────────┐
│  Dhan Server     │
│  POST /v2/       │
│  marketfeed/quote│
└────┬─────────────┘
     │ 5. Returns quote data
     │    {
     │      last_price: 24964.25,
     │      ohlc: {...},
     │      volume: 123456,
     │      oi: 789012
     │    }
     ▼
┌──────────────────┐
│  DhanAPI         │
│  Parse response  │
│  Format data     │
└────┬─────────────┘
     │ 6. Return formatted
     ▼
┌──────────────────┐
│  App.jsx         │
│  Update state    │
│  setMarketData() │
└────┬─────────────┘
     │ 7. Render
     ▼
┌──────────────────┐
│  UI Components   │
│  • Price cards   │
│  • OI analysis   │
│  • Charts        │
└──────────────────┘
```

---

## 🎯 Option Chain Flow

```
┌──────────┐
│  User    │
│  Views   │
│  Options │
└────┬─────┘
     │ 1. Request option chain
     ▼
┌──────────────────┐
│  App.jsx         │
│  Load options    │
└────┬─────────────┘
     │ 2. Get expiry list
     ▼
┌──────────────────┐
│  DhanAPI         │
│  getExpiryList() │
└────┬─────────────┘
     │ 3. POST /v2/optionchain/expirylist
     │    {
     │      UnderlyingScrip: 13,
     │      UnderlyingSeg: "IDX_I"
     │    }
     ▼
┌──────────────────┐
│  Dhan Server     │
│  Returns expiries│
└────┬─────────────┘
     │ 4. ["2024-10-31", "2024-11-07", ...]
     ▼
┌──────────────────┐
│  DhanAPI         │
│  getOptionChain()│
└────┬─────────────┘
     │ 5. POST /v2/optionchain
     │    {
     │      UnderlyingScrip: 13,
     │      UnderlyingSeg: "IDX_I",
     │      Expiry: "2024-10-31"
     │    }
     ▼
┌──────────────────┐
│  Dhan Server     │
│  Returns chain   │
└────┬─────────────┘
     │ 6. {
     │      last_price: 24964.25,
     │      oc: {
     │        "25000": {
     │          ce: { ltp, oi, greeks, iv },
     │          pe: { ltp, oi, greeks, iv }
     │        }
     │      }
     │    }
     ▼
┌──────────────────┐
│  DhanAPI         │
│  Parse strikes   │
│  Format Greeks   │
└────┬─────────────┘
     │ 7. Return formatted
     ▼
┌──────────────────┐
│  App.jsx         │
│  Update state    │
│  setStrikeData() │
└────┬─────────────┘
     │ 8. Render
     ▼
┌──────────────────┐
│  UI Components   │
│  • Strike table  │
│  • OI chart      │
│  • Greeks        │
└──────────────────┘
```

---

## 🔐 Session Management

```
┌──────────────────┐
│  Login Success   │
└────┬─────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│  Calculate Token Expiry              │
│  • Default: 24 hours from login      │
│  • Or use broker's expiryTime        │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│  Save to localStorage                │
│  {                                   │
│    broker: {...},                    │
│    credentials: {                    │
│      clientId: "...",                │
│      accessToken: "..."              │
│    },                                │
│    expiresAt: timestamp,             │
│    loginTime: timestamp              │
│  }                                   │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│  Set Auto-Logout Timer               │
│  setTimeout(() => {                  │
│    handleLogout();                   │
│    alert("Session expired");         │
│  }, timeUntilExpiry);                │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│  On Page Reload                      │
│  • Check localStorage                │
│  • Verify expiry time                │
│  • Restore session if valid          │
│  • Clear if expired                  │
└──────────────────────────────────────┘
```

---

## 📦 Data Models

### Market Data Response
```javascript
{
  success: true,
  status: true,
  data: {
    ltp: 24964.25,           // Last traded price
    open: 24950.00,          // Opening price
    high: 25000.00,          // Day high
    low: 24900.00,           // Day low
    close: 24945.00,         // Previous close
    volume: 15000000,        // Volume traded
    oi: 12000000,            // Open interest
    pChange: 0.08            // % change
  }
}
```

### Option Chain Response
```javascript
{
  success: true,
  status: true,
  data: {
    underlyingPrice: 24964.25,
    strikes: [
      {
        strike: 25000,
        ce: {
          ltp: 125.05,
          oi: 5962675,
          volume: 84202625,
          iv: 8.945,
          delta: 0.52546,
          theta: -12.88756,
          gamma: 0.00136,
          vega: 12.98931
        },
        pe: {
          ltp: 165.00,
          oi: 5059700,
          volume: 81097175,
          iv: 13.321,
          delta: -0.48099,
          theta: -10.56587,
          gamma: 0.00092,
          vega: 13.00105
        }
      }
      // ... more strikes
    ]
  }
}
```

### Symbol Token Mapping
```javascript
{
  'NIFTY': {
    token: '99926000',        // Angel One token
    dhanSecurityId: 13,       // Dhan security ID
    exchange: 'NSE',          // Generic exchange
    dhanExchange: 'IDX_I',    // Dhan exchange segment
    basePrice: 26300,         // Fallback price
    strikeInterval: 50        // Strike interval
  }
}
```

---

## 🔧 Configuration

### Broker Configuration
```javascript
// src/config/brokers.js
DHAN: {
  id: 'dhan',
  name: 'Dhan',
  logo: '🟢',
  fields: [
    {
      name: 'clientId',
      label: 'Client ID',
      type: 'text',
      required: true,
      placeholder: 'Enter your Dhan Client ID'
    },
    {
      name: 'accessToken',
      label: 'Access Token',
      type: 'password',
      required: true,
      placeholder: 'Enter your Access Token from Dhan Web'
    }
  ],
  apiUrl: 'https://api.dhan.co',
  documentation: 'https://dhanhq.co/docs/v2/'
}
```

### API Headers
```javascript
{
  'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'client-id': '1000000001',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

---

## 🎨 Component Hierarchy

```
App.jsx
├── LoginModal
│   └── BrokerSelector
│       └── BrokerCredentialsForm
│           └── Dhan Fields (Client ID + Access Token)
│
├── MarketScenarioCard
│   └── Uses market data from DhanAPI
│
├── FIIDIICard
│   └── Uses FII/DII data (mock for now)
│
├── OIAnalysis
│   └── Uses option chain from DhanAPI
│
├── LiveOITracker
│   └── Uses real-time data from DhanAPI
│
├── StrikeOICard
│   └── Uses option chain strikes
│
└── PriceOIVolumeCard
    └── Uses market data and OI
```

---

## 🚀 Performance Optimization

### API Call Optimization
```
1. Batch Requests
   • Fetch multiple instruments in single call
   • Use market quote API for bulk data

2. Caching
   • Cache expiry list (changes infrequently)
   • Cache symbol mappings
   • Store session data

3. Debouncing
   • Debounce refresh button
   • Limit API calls frequency
   • Use WebSocket for real-time (future)

4. Error Recovery
   • Retry failed requests
   • Fallback to cached data
   • Graceful degradation
```

---

## 📈 Scalability

### Current Capacity
- Supports multiple users simultaneously
- Handles high-frequency data updates
- Efficient API usage

### Future Scaling
- Add WebSocket for real-time streaming
- Implement server-side caching
- Add load balancing
- Optimize bundle size

---

## 🔒 Security Considerations

### Token Security
- Tokens stored in localStorage (encrypted in production)
- Automatic token expiry handling
- No tokens in URL or logs
- Secure HTTPS communication

### API Security
- All requests over HTTPS
- Token validation on each request
- Rate limiting respected
- Error messages don't expose sensitive data

---

## 📊 Monitoring & Logging

### Console Logging
```javascript
// Authentication
console.log('✅ Login successful');
console.log('❌ Login failed:', error);

// Market Data
console.log('🔍 Fetching market data for NIFTY');
console.log('📡 Dhan API Response:', response);
console.log('✅ Real price from broker: ₹24964.25');

// Option Chain
console.log('📈 Fetching option chain');
console.log('📊 Option Chain Response:', data);

// Errors
console.error('❌ Market data error:', error);
```

### Error Tracking
- All errors logged to console
- User-friendly error messages
- Detailed error context for debugging

---

## 🎯 Success Metrics

### Performance Metrics
- API response time < 1s
- Page load time < 3s
- Data accuracy: 100%
- Uptime: 99.9%

### User Metrics
- Login success rate
- Data refresh frequency
- Feature usage
- Error rate

---

**Architecture Version**: 1.0  
**Last Updated**: January 2026  
**Status**: ✅ Production Ready
