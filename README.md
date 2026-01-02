# FII/DII Trading Dashboard

A professional trading dashboard built with React and Angel One API that provides comprehensive market analysis based on FII/DII data, Price, OI (Open Interest), and Volume.

## 🎯 Features

### **ALL 16 Market Scenarios Covered**

This dashboard analyzes every possible combination of market conditions:

#### 🟢 **Price Rising Scenarios (8)**
1. **SUPER BULLISH** - Both FII & DII buying with OI rising
2. **STRONG BULLISH (FII Led)** - FII buying, DII selling, OI rising
3. **DIVERGENCE** - FII selling, DII buying, OI rising (Caution!)
4. **RETAIL TRAP** - Both selling, OI rising (Danger!)
5. **SHORT COVERING (Both)** - Both buying, OI falling
6. **MIXED SHORT COVERING** - FII buying, DII selling, OI falling
7. **WEAK RALLY** - FII selling, DII buying, OI falling
8. **DEAD CAT BOUNCE** - Both selling, OI falling

#### 🔴 **Price Falling Scenarios (8)**
9. **SUPER BEARISH** - Both FII & DII selling with OI rising
10. **DII SUPPORT** - FII selling, DII buying, OI rising
11. **STRONG BEARISH (DII Led)** - FII buying, DII selling, OI rising
12. **CONTRARIAN TRAP** - Both buying, OI rising (Watch for reversal)
13. **WEAK FALL / PANIC** - Both selling, OI falling
14. **MIXED UNWINDING** - FII selling, DII buying, OI falling
15. **LONG UNWINDING (DII)** - FII buying, DII selling, OI falling
16. **STRONG REVERSAL SETUP** - Both buying, OI falling (Buy opportunity!)

### Core Analysis Components

1. **Market Scenario Detection**
   - Automatically identifies all 16 scenarios
   - Color-coded signals
   - Clear action recommendations (BUY/SELL/WAIT/AVOID/WATCH)
   - Next-day expectations

2. **FII/DII Net Position**
   - Real-time FII and DII buying/selling data
   - Net position tracking
   - Trend identification

3. **Market Control Indicator**
   - Shows who's in control (FII/DII/Mixed)
   - Control strength analysis
   - Role identification (Trend Creator/Stabilizer)

4. **Price + OI + Volume Analysis**
   - Historical price trends
   - OI buildup/reduction tracking
   - Volume confirmation
   - Professional insights

5. **Strike-wise OI Analysis**
   - Max Call OI (Resistance levels)
   - Max Put OI (Support levels)
   - Expected trading range
   - Visual OI distribution

6. **Market Conviction Meter**
   - Conviction score (0-100)
   - Strength level (HIGH/MEDIUM/LOW)
   - Multi-factor analysis

7. **🧪 Scenario Tester**
   - Test all 16 scenarios interactively
   - Adjust Price, OI, FII, DII inputs
   - 16 preset scenarios
   - Real-time scenario detection

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Trading account with any supported broker (optional for demo)

### Supported Brokers

✅ **Angel One** - Fully supported
✅ **Zerodha** - OAuth required
✅ **Upstox** - OAuth required
✅ **Fyers** - OAuth required
✅ **IIFL Securities** - Supported
✅ **Alice Blue** - Supported
✅ **Kotak Securities** - Token required
✅ **ICICI Direct** - Token required
🎮 **Demo Mode** - No credentials required

### Installation

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

4. Open your browser and navigate to `http://localhost:3000`

### Using the Dashboard

**Demo Mode (No API Required):**
- Select "Demo Mode" from broker list
- Click "Continue with Demo"
- Explore with sample data
- Perfect for learning!

**Live Mode (Connect Your Broker):**
1. Select your broker from the list
2. Enter your API credentials
3. Click "Connect & Login"
4. Start analyzing real market data

See `BROKER_SETUP_GUIDE.md` for detailed broker setup instructions.

## 📱 Mobile Responsive

The dashboard is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: Angel One API
- **HTTP Client**: Axios

## 📊 Understanding the Dashboard

### The 4 Layers of Analysis

**Layer 1: FII/DII Data**
- FII = Trend Creator
- DII = Trend Stabilizer
- Retail = Trend Follower

**Layer 2: Combined Analysis**
- Price → What is happening
- Volume → How strongly
- OI → New positions or closing
- FII/DII → WHO is doing it

**Layer 3: Scenario Breakdown**
- 16 complete scenarios
- Each with interpretation and next-day expectations
- Color-coded for quick identification
- Action recommendations

**Layer 4: Strike OI**
- Identifies key support and resistance
- Shows expected trading range
- Helps in position sizing

### Professional Workflow

1. Check price trend (Up/Down/Sideways)
2. Check OI change (Up or Down)
3. Check FII/DII data (Buying or Selling)
4. Mark Max Call OI & Max Put OI
5. Ask: "Is big money creating new positions or exiting?"

### Memory Rule

- **Price** tells direction
- **OI** tells strength
- **FII** tells conviction
- **Strike OI** tells limits

## 🧪 Scenario Tester

The built-in Scenario Tester allows you to:
- Test all 16 market scenarios
- Adjust inputs manually
- Use preset scenarios
- See real-time scenario detection
- Understand each scenario deeply

**How to Use:**
1. Click the 🧪 icon or "Scenario Tester" tab
2. Either adjust inputs manually or click preset buttons
3. See the detected scenario instantly
4. Learn the interpretation and action

## 📚 Documentation

- **SCENARIOS_GUIDE.md** - Complete guide to all 16 scenarios
- **README.md** - This file
- Inline code comments

## ⚠️ Important Notes

- This dashboard uses mock data for demonstration by default
- To use real data, configure Angel One API credentials
- Always verify data from multiple sources
- Trading involves risk - do your own research
- This is for educational purposes only

## 🔧 Configuration

### Using Real API Data

To switch from mock data to real Angel One API:

1. Open `src/App.jsx`
2. In the `handleLogin` function, uncomment:
```javascript
await angelOneApi.login(credentials.clientId, credentials.password, credentials.totp);
```

3. Replace `loadMockData()` calls with actual API calls to fetch:
   - Market quotes
   - Option chain data
   - Historical data
   - FII/DII data

## 🎯 Key Features Highlight

✅ All 16 market scenarios covered
✅ Real-time scenario detection
✅ Clear action recommendations
✅ Interactive scenario tester
✅ Mobile responsive design
✅ Professional dark theme
✅ Beautiful charts and visualizations
✅ Educational workflow guide
✅ Strike-wise OI analysis
✅ Market conviction meter

## 📝 License

This project is for educational purposes only.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Disclaimer**: This dashboard is for educational and informational purposes only. It should not be considered as financial advice. Always consult with a qualified financial advisor before making investment decisions.

## 🎓 Learning Resources

The dashboard includes:
- Complete scenario explanations
- Professional workflow guide
- Memory rules for quick reference
- Interactive testing environment
- Real-world examples

Perfect for:
- Beginner traders learning market dynamics
- Intermediate traders refining their strategy
- Professional traders validating their analysis
- Anyone interested in understanding FII/DII impact

---

**Built with ❤️ for traders who want to understand market dynamics deeply**
