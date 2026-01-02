# Broker Setup Guide

## 🔌 Supported Brokers

The dashboard supports multiple Indian brokers. Choose your broker and follow the setup instructions.

---

## 📊 Broker List

### 1. **Angel One (Angel Broking)** 📊
- **Status**: ✅ Fully Supported
- **Required Credentials**:
  - API Key
  - Client ID
  - Password
  - TOTP (from authenticator app)

### 2. **Zerodha (Kite Connect)** 🔷
- **Status**: ⚠️ OAuth Required
- **Required Credentials**:
  - API Key
  - API Secret
  - Request Token (from OAuth flow)

### 3. **Upstox** 🟣
- **Status**: ⚠️ OAuth Required
- **Required Credentials**:
  - API Key
  - API Secret
  - Redirect URI

### 4. **Fyers** 🟠
- **Status**: ⚠️ OAuth Required
- **Required Credentials**:
  - App ID
  - Secret ID
  - Redirect URI

### 5. **IIFL Securities** 🔶
- **Status**: ✅ Supported
- **Required Credentials**:
  - App Key
  - Secret Key
  - User ID
  - Password

### 6. **Alice Blue** 🔵
- **Status**: ✅ Supported
- **Required Credentials**:
  - User ID
  - API Key
  - Password

### 7. **Kotak Securities** 🔴
- **Status**: ⚠️ Token Required
- **Required Credentials**:
  - Consumer Key
  - Consumer Secret
  - Access Token

### 8. **ICICI Direct** 🟤
- **Status**: ⚠️ Token Required
- **Required Credentials**:
  - API Key
  - Session Token

### 9. **Demo Mode** 🎮
- **Status**: ✅ Always Available
- **Required Credentials**: None
- **Features**: Full dashboard with mock data

---

## 🚀 Quick Start

### Option 1: Demo Mode (Recommended for Learning)
1. Open the dashboard
2. Select "Demo Mode (No API Required)"
3. Click "Continue with Demo"
4. Start exploring!

### Option 2: Connect Your Broker
1. Open the dashboard
2. Select your broker from the list
3. Enter your API credentials
4. Click "Connect & Login"

---

## 📝 Detailed Setup Instructions

### Angel One Setup

#### Step 1: Get API Credentials
1. Log in to [Angel One](https://smartapi.angelbroking.com/)
2. Go to **API** section
3. Click **Create New App**
4. Note down your **API Key**

#### Step 2: Get Client ID
- Your Client ID is your trading account number

#### Step 3: Setup TOTP
1. Download Google Authenticator or similar app
2. Scan QR code from Angel One
3. Use the 6-digit code as TOTP

#### Step 4: Connect
1. Select "Angel One" in dashboard
2. Enter:
   - API Key
   - Client ID
   - Password
   - Current TOTP code
3. Click "Connect & Login"

---

### Zerodha Setup

#### Step 1: Get API Credentials
1. Visit [Kite Connect](https://kite.trade/)
2. Create an app
3. Note down **API Key** and **API Secret**

#### Step 2: OAuth Flow
1. Zerodha requires OAuth 2.0 authentication
2. You'll need to implement redirect URI handling
3. Get request token from OAuth callback

#### Step 3: Connect
1. Select "Zerodha" in dashboard
2. Enter API Key and API Secret
3. Complete OAuth flow
4. Enter Request Token

**Note**: Zerodha requires additional OAuth implementation. See [Kite Connect Docs](https://kite.trade/docs/connect/v3/)

---

### Upstox Setup

#### Step 1: Get API Credentials
1. Visit [Upstox Developer Portal](https://upstox.com/developer/api-documentation)
2. Create an app
3. Note down **API Key** and **API Secret**

#### Step 2: Setup Redirect URI
1. Configure redirect URI in Upstox app settings
2. Use: `http://localhost:3000/callback` for local development

#### Step 3: OAuth Flow
- Upstox uses OAuth 2.0
- Implement redirect handling

**Note**: Requires OAuth implementation. See [Upstox API Docs](https://upstox.com/developer/api-documentation)

---

### IIFL Securities Setup

#### Step 1: Get API Credentials
1. Contact IIFL Securities support
2. Request API access
3. Get **App Key** and **Secret Key**

#### Step 2: Connect
1. Select "IIFL Securities" in dashboard
2. Enter:
   - App Key
   - Secret Key
   - User ID
   - Password
3. Click "Connect & Login"

---

### Alice Blue Setup

#### Step 1: Get API Credentials
1. Visit [Alice Blue API Portal](https://v2api.aliceblueonline.com/)
2. Register for API access
3. Get **API Key**

#### Step 2: Connect
1. Select "Alice Blue" in dashboard
2. Enter:
   - User ID
   - API Key
   - Password
3. Click "Connect & Login"

---

## 🔒 Security Best Practices

### 1. **Never Share Credentials**
- Keep your API keys private
- Don't commit credentials to Git
- Use environment variables in production

### 2. **Use Strong Passwords**
- Enable 2FA on your broker account
- Use unique passwords
- Change passwords regularly

### 3. **Monitor API Usage**
- Check API logs regularly
- Set up rate limit alerts
- Monitor for unusual activity

### 4. **Secure Storage**
- Credentials are stored locally in browser
- Clear browser data when using public computers
- Use encrypted storage in production

---

## ⚠️ Common Issues

### Issue 1: "Login Failed"
**Solutions:**
- Verify all credentials are correct
- Check if API key is active
- Ensure TOTP is current (for Angel One)
- Check broker API status

### Issue 2: "OAuth Required"
**Solutions:**
- Some brokers require OAuth flow
- Implement redirect URI handling
- See broker-specific documentation

### Issue 3: "Rate Limit Exceeded"
**Solutions:**
- Wait before retrying
- Reduce refresh frequency
- Check broker rate limits

### Issue 4: "Invalid Token"
**Solutions:**
- Regenerate access token
- Check token expiry
- Re-authenticate

---

## 📚 API Documentation Links

- **Angel One**: https://smartapi.angelbroking.com/docs
- **Zerodha**: https://kite.trade/docs/connect/v3/
- **Upstox**: https://upstox.com/developer/api-documentation
- **Fyers**: https://myapi.fyers.in/docsv2
- **IIFL**: https://www.iiflsecurities.com/api-documentation
- **Alice Blue**: https://v2api.aliceblueonline.com/
- **Kotak**: https://ctradeapi.kotaksecurities.com/
- **ICICI Direct**: https://api.icicidirect.com/apiuser/home

---

## 🎯 Recommended Workflow

### For Beginners
1. Start with **Demo Mode**
2. Learn all 16 scenarios
3. Practice with Scenario Tester
4. Then connect real broker

### For Experienced Traders
1. Connect your broker directly
2. Use Live Dashboard for analysis
3. Combine with your trading strategy
4. Monitor FII/DII data daily

---

## 💡 Tips

### Tip 1: Start with Demo
- No risk, full features
- Perfect for learning
- Test all scenarios

### Tip 2: Check API Limits
- Most brokers have rate limits
- Plan your refresh frequency
- Avoid excessive API calls

### Tip 3: Backup Credentials
- Save credentials securely
- Use password manager
- Keep backup of API keys

### Tip 4: Test Connection
- Test with small data first
- Verify all features work
- Check data accuracy

---

## 🆘 Getting Help

### Broker Support
- Contact your broker's API support team
- Check broker documentation
- Join broker developer communities

### Dashboard Support
- Check `README.md` for general help
- See `QUICK_START.md` for tutorials
- Review `SCENARIOS_GUIDE.md` for analysis help

---

## 🔄 Adding New Brokers

Want to add support for your broker?

1. Create API service in `src/services/yourBrokerApi.js`
2. Add broker config in `src/config/brokers.js`
3. Update `src/services/brokerFactory.js`
4. Test thoroughly
5. Submit pull request

---

## ✅ Verification Checklist

Before going live:

- [ ] API credentials verified
- [ ] Test connection successful
- [ ] Data fetching works
- [ ] All features accessible
- [ ] No console errors
- [ ] Rate limits understood
- [ ] Security measures in place

---

## 📞 Support Contacts

### Angel One API Support
- Email: smartapisupport@angelbroking.com
- Phone: 1800-209-9191

### Zerodha API Support
- Email: kiteconnect@zerodha.com
- Forum: https://kite.trade/forum

### Upstox API Support
- Email: api@upstox.com
- Support: https://upstox.com/developer

---

**Remember**: Always test with demo mode first before connecting real broker accounts!

**Happy Trading! 📈**
