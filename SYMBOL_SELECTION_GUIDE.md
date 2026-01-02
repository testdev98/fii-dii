# 📊 Symbol Selection Guide

## Overview
The dashboard now supports tracking **ANY symbol** - not just NIFTY 50! You can track indices, stocks, and any instrument available on your broker.

## How to Use

### 1. Symbol Selector Location
The symbol selector is located in the **top-right header** of the dashboard, next to the refresh button.

### 2. Available Symbols

#### Pre-configured Indices:
- **NIFTY 50** - Main index
- **BANK NIFTY** - Banking sector index
- **FIN NIFTY** - Financial services index
- **MIDCAP NIFTY** - Mid-cap index

#### Pre-configured Popular Stocks:
- RELIANCE
- TCS
- HDFC BANK
- INFOSYS
- ICICI BANK
- SBI
- BHARTI AIRTEL
- ITC
- KOTAK BANK
- L&T
- AXIS BANK
- WIPRO
- TATA MOTORS
- TATA STEEL
- ADANI ENTERPRISES

### 3. How Symbol Selection Works

#### Step 1: Select Symbol
Click the dropdown in the header and choose your desired symbol.

#### Step 2: Automatic Data Refresh
Once you select a symbol:
- Dashboard automatically fetches new data for that symbol
- All charts and analysis update instantly
- Live OI Tracker resets and starts tracking the new symbol
- Historical data loads for the selected symbol

#### Step 3: Track Multiple Symbols
You can switch between symbols anytime:
- Select a new symbol from the dropdown
- Data automatically refreshes
- Previous tracking data is cleared
- New tracking session begins

## Features by Tab

### 📊 Dashboard Tab
- Shows market scenario for selected symbol
- FII/DII data (if available for the symbol)
- Price + OI + Volume analysis
- Strike-wise OI (for derivatives)
- Conviction meter

### 💰 FII/DII Tab
- Detailed institutional activity
- Historical trends
- Trading strategies
- **Note:** FII/DII data is primarily available for indices

### 📈 OI Analysis Tab
- Open Interest breakdown
- 4 market phases analysis
- Call vs Put OI
- PCR analysis
- **Note:** OI data is available for derivatives (indices and F&O stocks)

### 🔴 Live OI Tab
- **Real-time tracking for selected symbol**
- Auto-refresh with configurable intervals
- Multiple charts (OI, Volume, ATP, Call/Put OI)
- Live data table
- Export to CSV
- Session statistics

## Symbol-Specific Behavior

### For Indices (NIFTY, BANKNIFTY, etc.)
✅ Full feature support:
- Market scenarios
- FII/DII data
- OI analysis
- Live OI tracking
- Strike-wise OI
- Option chain data

### For F&O Stocks (Stocks with Futures & Options)
✅ Most features available:
- Market scenarios
- OI analysis
- Live OI tracking
- Strike-wise OI
- Limited FII/DII data (index-level only)

### For Cash-Only Stocks
⚠️ Limited features:
- Price analysis
- Volume analysis
- No OI data (no derivatives)
- No strike-wise OI
- FII/DII data at index level only

## Live OI Tracker with Different Symbols

### Behavior:
1. **Symbol Change:** When you change symbol, Live OI Tracker:
   - Clears previous data
   - Stops tracking automatically
   - Resets all charts
   - Waits for you to start tracking again

2. **Start Tracking:** Click "Start Tracking" to begin monitoring the new symbol

3. **Data Collection:** 
   - Collects data at your selected interval (30s, 1min, 2min, 5min)
   - Stores up to 100 data points
   - Shows last 20 entries in the table

4. **Export:** Export data includes the symbol name in the filename

## Tips for Best Results

### 1. Choose the Right Symbol
- **For intraday trading:** Use NIFTY or BANKNIFTY (high liquidity)
- **For stock-specific trades:** Use F&O stocks
- **For long-term analysis:** Any symbol works

### 2. Refresh Intervals
- **Scalping (1-5 min):** Use 30s or 1min refresh
- **Intraday (15-60 min):** Use 2min or 5min refresh
- **Swing trading:** Manual refresh is sufficient

### 3. Market Hours
- Live tracking only works during market hours (9:15 AM - 3:30 PM IST)
- Demo mode works 24/7 for testing

### 4. Data Accuracy
- **Demo Mode:** Uses mock data for all symbols
- **Real Broker:** Uses actual market data from your broker API

## Adding Custom Symbols

If you want to add more symbols to the dropdown, you can:

1. Open `src/App.jsx`
2. Find the symbol selector section (around line 210)
3. Add your symbols to the appropriate optgroup:

```jsx
<optgroup label="Your Category">
  <option value="SYMBOL_CODE">SYMBOL NAME</option>
</optgroup>
```

### Example: Adding More Stocks
```jsx
<optgroup label="Tech Stocks">
  <option value="TECHM">TECH MAHINDRA</option>
  <option value="HCLTECH">HCL TECH</option>
  <option value="LTIM">LTI MINDTREE</option>
</optgroup>
```

## Symbol Codes Reference

### Common Index Codes:
- `NIFTY` - Nifty 50
- `BANKNIFTY` - Bank Nifty
- `FINNIFTY` - Fin Nifty
- `MIDCPNIFTY` - Midcap Nifty

### Stock Codes:
Use NSE symbol codes (usually company name in caps without spaces)
- Example: `TATAMOTORS`, `HDFCBANK`, `RELIANCE`

## Troubleshooting

### Issue: No data showing after symbol change
**Solution:** 
- Check if market is open
- Click "Refresh Now" button
- Verify broker connection
- Try demo mode first

### Issue: OI data not available
**Solution:**
- Ensure the symbol has derivatives (F&O)
- Check if it's a cash-only stock
- Verify broker API supports OI data for that symbol

### Issue: Live OI Tracker not updating
**Solution:**
- Check market hours (9:15 AM - 3:30 PM IST)
- Verify tracking is started (green "Stop Tracking" button)
- Check refresh interval setting
- Ensure broker API is connected

## Best Practices

1. **Start with Demo Mode:** Test symbol selection with demo mode first
2. **Verify Symbol Code:** Ensure you're using correct NSE symbol codes
3. **Check Liquidity:** Use liquid symbols for better data accuracy
4. **Monitor During Market Hours:** For real-time tracking
5. **Export Data:** Regularly export data for offline analysis

## API Considerations

### Broker API Limits:
- Most brokers have rate limits (e.g., 3 requests/second)
- Adjust refresh interval accordingly
- Use longer intervals for multiple symbols

### Data Availability:
- Not all brokers provide all data types
- Some brokers may charge for real-time data
- Check your broker's API documentation

## Future Enhancements

Planned features:
- [ ] Multi-symbol comparison
- [ ] Custom symbol input field
- [ ] Symbol search functionality
- [ ] Favorite symbols list
- [ ] Symbol-specific alerts
- [ ] Cross-symbol correlation analysis

---

**Last Updated:** January 2, 2026
**Feature Status:** ✅ FULLY IMPLEMENTED
**Supported Symbols:** Unlimited (any NSE symbol)
