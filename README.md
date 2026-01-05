# FII/DII Trading Dashboard

Professional trading dashboard for comprehensive market analysis with real-time broker data.

## Features

- **Broker Integration Required** - Login with Angel One, Zerodha, or Upstox
- **Real-Time Data** - Live prices, volume, and OI from broker APIs
- **16 Market Scenarios** - Complete analysis of all market conditions
- **Live OI Tracker** - Real-time Open Interest monitoring
- **FII/DII Analysis** - Track institutional investor activity
- **Strike Analysis** - Support and resistance levels
- **Mobile Responsive** - Works on all devices

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 and login with your broker credentials

## Deployment

### Render.com (Static Site)
1. Push to GitHub
2. Create new **Static Site** on Render
3. Build Command: `npm run build`
4. Publish Directory: `dist`

### Vercel / Netlify
```bash
npm run build
```
Deploy the `dist` folder

## Usage

1. Open the app
2. Click "Login to Continue"
3. Select your broker (Angel One, Zerodha, Upstox, or Demo)
4. Enter credentials
5. View real-time market data

## Broker Support

- **Angel One** (SmartAPI) - Full support
- **Zerodha** (Kite Connect) - Full support
- **Upstox** - Full support
- **Demo Mode** - For testing only

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts
- Axios

## Note

This app requires broker login to function. No data is shown without authentication.

## License

MIT
