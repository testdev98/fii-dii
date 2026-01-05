# FII/DII Trading Dashboard

A professional real-time market analysis dashboard that integrates with multiple Indian stock brokers to provide comprehensive insights into FII/DII activity, Open Interest (OI) analysis, and market scenarios.

## Features

### 📊 Real-Time Market Data
- Live price tracking for NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY, and popular stocks
- Real-time price updates from broker APIs
- Historical price and volume analysis
- Market scenario detection and analysis

### 💰 FII/DII Analysis
- Foreign Institutional Investors (FII) activity tracking
- Domestic Institutional Investors (DII) activity tracking
- Net buy/sell positions
- Historical FII/DII trends
- Detailed institutional flow analysis

### 📈 Open Interest (OI) Analysis
- Strike-wise OI distribution
- Call and Put OI comparison
- OI change tracking
- Volume analysis
- Price-OI-Volume correlation

### 🔴 Live OI Tracker
- Real-time OI updates
- Strike-wise monitoring
- ATM, ITM, OTM analysis
- Live market sentiment indicators

### 🏭 Sector Analysis
- Sector-wise performance tracking
- Top gainers and losers
- Sector rotation analysis
- Industry-specific insights

### 🧪 Scenario Tester
- Test different market scenarios
- Simulate FII/DII flows
- Analyze potential market reactions
- Strategy backtesting

### 🎯 Market Intelligence
- Conviction meter for trade confidence
- Market control indicators (FII vs DII dominance)
- Automated scenario detection
- Smart alerts and notifications

## Supported Brokers

The dashboard supports integration with the following Indian stock brokers:

- **Angel One** (Angel Broking) - Full support with TOTP authentication
- **Zerodha** (Kite Connect) - API integration
- **Upstox** - OAuth-based authentication
- **Dhan** - Token-based authentication
- **Fyers** - App ID authentication
- **IIFL Securities** - Multi-factor authentication
- **Alice Blue** - User ID authentication
- **Kotak Securities** - Consumer key authentication
- **ICICI Direct** - Session token authentication

## Tech Stack

- **Frontend**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts 2.10
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Authentication**: OTPAuth for TOTP

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- A broker account with API access enabled

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd fii-dii-trading-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### First Time Setup

1. **Launch the Application**
   - Open the dashboard in your browser
   - You'll see the login screen

2. **Select Your Broker**
   - Choose your broker from the supported list
   - Each broker has different authentication requirements

3. **Enter Credentials**
   - Provide the required API credentials
   - For Angel One: API Key, Client ID, MPIN, and TOTP code
   - For Dhan: Client ID and Access Token
   - For others: Check broker-specific requirements

4. **Login**
   - Click "Login" to authenticate
   - Session will be saved for the trading day
   - Tokens typically expire at 3:30 PM IST

### Dashboard Navigation

- **Dashboard Tab**: Overview of all market metrics
- **FII/DII Tab**: Detailed institutional activity analysis
- **OI Tab**: Open Interest analysis and strike distribution
- **Live Tab**: Real-time OI tracking
- **Sectors Tab**: Sector-wise performance analysis
- **Test Tab**: Scenario testing and simulation

### Symbol Selection

Use the dropdown in the header to switch between:
- **Indices**: NIFTY 50, BANK NIFTY, FIN NIFTY, MIDCAP NIFTY
- **Stocks**: RELIANCE, TCS, HDFC BANK, INFOSYS, and more

### Data Refresh

- Click the refresh button to update market data
- Data automatically refreshes when changing symbols
- Session persists until token expiry

## Project Structure

```
fii-dii-trading-dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── BrokerCredentialsForm.jsx
│   │   ├── BrokerSelector.jsx
│   │   ├── ConvictionMeter.jsx
│   │   ├── FIIDIICard.jsx
│   │   ├── FIIDIIDetailedAnalysis.jsx
│   │   ├── LiveOITracker.jsx
│   │   ├── LoginModal.jsx
│   │   ├── MarketControlCard.jsx
│   │   ├── MarketScenarioCard.jsx
│   │   ├── OIAnalysis.jsx
│   │   ├── PriceOIVolumeCard.jsx
│   │   ├── ScenarioGuide.jsx
│   │   ├── ScenarioTester.jsx
│   │   ├── SectorAnalysis.jsx
│   │   └── StrikeOICard.jsx
│   ├── services/            # API integrations
│   │   ├── angelOneApi.js
│   │   ├── brokerFactory.js
│   │   ├── demoApi.js
│   │   ├── dhanApi.js
│   │   ├── growwApi.js
│   │   ├── marketDataApi.js
│   │   ├── upstoxApi.js
│   │   └── zerodhaApi.js
│   ├── config/              # Configuration files
│   │   └── brokers.js
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## API Integration

### Adding a New Broker

1. Create a new API service file in `src/services/`
2. Implement the broker API interface:
   - `login(credentials)` - Authentication
   - `getMarketData(symbol, exchange, token)` - Fetch market data
   - `getOptionChain(symbol, expiry)` - Fetch option chain (optional)
3. Add broker configuration in `src/config/brokers.js`
4. Register in `src/services/brokerFactory.js`

### Broker API Requirements

Each broker API service should implement:
- Session management
- Token refresh handling
- Error handling and retry logic
- Rate limiting compliance
- Data normalization

## Build for Production

```bash
npm run build
```

The optimized production build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEMO_MODE=false
```

### Broker API Credentials

- Never commit API credentials to version control
- Store credentials securely
- Use environment variables for sensitive data
- Enable API access from your broker's developer portal

## Security Considerations

- API credentials are stored in browser localStorage
- Sessions expire at end of trading day (3:30 PM IST)
- Automatic logout on token expiry
- HTTPS recommended for production deployment
- CORS configuration required for broker APIs

## Troubleshooting

### Login Issues
- Verify API credentials are correct
- Check if API access is enabled in broker account
- Ensure TOTP code is current (for Angel One)
- Check browser console for error messages

### Data Not Loading
- Verify broker session is active
- Check network connectivity
- Ensure symbol token mapping is correct
- Review broker API rate limits

### Session Expiry
- Sessions expire at 3:30 PM IST
- Re-login required after expiry
- Check token validity in localStorage

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Disclaimer

This dashboard is for educational and informational purposes only. It is not financial advice. Trading in stocks and derivatives involves risk. Always consult with a qualified financial advisor before making investment decisions.

## Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Note**: This dashboard requires active broker API credentials. Ensure you have the necessary permissions and comply with your broker's API usage terms and conditions.
