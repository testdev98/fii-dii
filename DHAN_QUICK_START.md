# Dhan Broker - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Get Your Credentials (2 minutes)

1. Login to **[web.dhan.co](https://web.dhan.co)**
2. Go to **Profile → DhanHQ Trading APIs**
3. Click **"Generate Access Token"**
4. Copy:
   - **Client ID** (e.g., 1000000001)
   - **Access Token** (long string starting with "eyJ...")

### Step 2: Login to Application (30 seconds)

1. Open the Options Trading Analysis app
2. Click **"Login"** button
3. Select **"Dhan"** (🟢 green icon)
4. Paste your credentials:
   - Client ID
   - Access Token
5. Click **"Login"**

### Step 3: Start Analyzing (Instant)

✅ You're in! Now you can:
- View real-time NIFTY/BANKNIFTY prices
- Analyze option chain with Greeks
- Track Open Interest changes
- Monitor FII/DII activity
- Test market scenarios

---

## 📊 What You Get

### Real-Time Data
- Live prices (LTP)
- OHLC (Open, High, Low, Close)
- Volume & Open Interest
- Market depth

### Option Chain
- All strikes for current expiry
- Call & Put data
- Greeks: Delta, Theta, Gamma, Vega
- Implied Volatility (IV)
- OI & Volume per strike

### Supported Instruments
- **Indices**: NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY
- **Stocks**: RELIANCE, TCS, HDFCBANK, INFY, and more

---

## ⚠️ Important Notes

### Token Validity
- Access tokens are valid for **24 hours**
- Generate new token daily from Dhan Web
- App will notify when token expires

### Market Hours
- Data available during market hours (9:15 AM - 3:30 PM IST)
- Pre-market and post-market data may be limited

### API Limits
- Dhan has reasonable rate limits
- Normal usage won't hit limits
- Don't spam refresh button

---

## 🔧 Troubleshooting

### "Invalid access token"
→ Generate fresh token from Dhan Web

### "Session expired"
→ Login again (tokens expire after 24 hours)

### "No data received"
→ Check if market is open
→ Verify internet connection

### Wrong prices showing
→ Click refresh button
→ Check symbol selection

---

## 💡 Pro Tips

1. **Generate Token Daily**: Set a reminder to generate new token each morning
2. **Bookmark Dhan Web**: Quick access to generate tokens
3. **Test with NIFTY First**: Verify data before analyzing other symbols
4. **Compare with Dhan App**: Cross-verify important data points
5. **Use During Market Hours**: Best data quality during trading hours

---

## 📚 Need More Help?

- **Full Documentation**: See `DHAN_INTEGRATION.md`
- **Dhan API Docs**: https://dhanhq.co/docs/v2/
- **Dhan Community**: https://community.dhan.co
- **Dhan Support**: support@dhan.co

---

## 🎯 Quick Reference

### Where to Get Token?
`web.dhan.co → Profile → DhanHQ Trading APIs → Generate Access Token`

### Token Format
- **Client ID**: Numbers (e.g., 1000000001)
- **Access Token**: Long string starting with "eyJ..."

### Token Validity
**24 hours** from generation time

### Cost
- **Trading APIs**: FREE for all Dhan users
- **Data APIs**: Additional charges (check Dhan pricing)

---

**Happy Trading! 📈**
