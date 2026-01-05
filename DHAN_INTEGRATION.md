# Dhan Broker Integration Guide

## Overview
Dhan broker has been successfully integrated into the Options Trading Analysis application. This document provides details about the integration, setup instructions, and API capabilities.

## What is Dhan?
Dhan is a new-generation financial services platform that empowers traders and investors with powerful APIs for trading automation. DhanHQ APIs provide access to:
- Real-time market data
- Option chain with Greeks
- Order placement and management
- Historical data
- Live market feeds via WebSocket

## Integration Features

### ✅ Implemented Features
1. **Authentication**
   - Simple access token-based authentication
   - Client ID + Access Token login
   - Token validation via profile API
   - Session management with token expiry

2. **Market Data**
   - Real-time LTP (Last Traded Price)
   - OHLC data (Open, High, Low, Close)
   - Market depth with bid/ask
   - Volume and Open Interest
   - Circuit limits

3. **Option Chain**
   - Complete option chain for indices (NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY)
   - Greeks (Delta, Theta, Gamma, Vega)
   - Implied Volatility (IV)
   - Strike-wise OI, Volume, and LTP
   - Expiry list fetching

4. **Supported Instruments**
   - Indices: NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY
   - Stocks: RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK, SBIN, and more

## Setup Instructions

### Step 1: Get Dhan API Credentials

1. **Login to Dhan Web**
   - Go to [web.dhan.co](https://web.dhan.co)
   - Login with your Dhan credentials

2. **Navigate to API Section**
   - Click on your Profile
   - Go to "DhanHQ Trading APIs" section

3. **Get Access Token**
   - Click on "Generate Access Token"
   - Copy your Client ID and Access Token
   - **Note**: Access tokens are valid for 24 hours

### Step 2: Configure in Application

1. **Select Dhan Broker**
   - Open the application
   - Click "Login" button
   - Select "Dhan" from broker list (🟢 icon)

2. **Enter Credentials**
   - **Client ID**: Your Dhan Client ID (e.g., 1000000001)
   - **Access Token**: The access token from Dhan Web
   - Click "Login"

3. **Start Trading Analysis**
   - Once logged in, select your preferred symbol (NIFTY, BANKNIFTY, etc.)
   - View real-time market data and option chain
   - Analyze FII/DII data and market scenarios

## API Endpoints Used

### Authentication
- **Profile API**: `GET /v2/profile`
  - Validates access token
  - Returns user details and token validity

### Market Data
- **Market Quote**: `POST /v2/marketfeed/quote`
  - Real-time quotes with market depth
  - OHLC, volume, OI data
  - Circuit limits

- **LTP**: `POST /v2/marketfeed/ltp`
  - Quick last traded price fetch

- **OHLC**: `POST /v2/marketfeed/ohlc`
  - Open, High, Low, Close data

### Option Chain
- **Option Chain**: `POST /v2/optionchain`
  - Complete option chain with Greeks
  - Strike-wise data for CE and PE
  - Implied Volatility

- **Expiry List**: `POST /v2/optionchain/expirylist`
  - All active expiry dates for underlying

## Security ID Mapping

Dhan uses Security IDs to identify instruments. Here's the mapping:

### Indices (IDX_I segment)
- NIFTY: 13
- BANKNIFTY: 25
- FINNIFTY: 27
- MIDCPNIFTY: 28
- SENSEX: 51
- BANKEX: 52

### Stocks (NSE_EQ segment)
- TCS: 11536
- HDFCBANK: 1333
- INFY: 1594
- ICICIBANK: 4963
- SBIN: 3045
- RELIANCE: 500
- And more...

## Exchange Segments

Dhan uses the following exchange segment format:
- `NSE_EQ`: NSE Equity
- `NSE_FNO`: NSE Futures & Options
- `BSE_EQ`: BSE Equity
- `MCX_COMM`: MCX Commodities
- `IDX_I`: Indices

## Token Management

### Token Validity
- Access tokens are valid for 24 hours
- Tokens expire at the specified time in the profile response
- Application automatically manages session expiry

### Token Refresh
- Dhan provides a refresh token endpoint
- Tokens can be refreshed for another 24 hours
- Endpoint: `POST /v2/refresh-token`

### Best Practices
1. Generate new token daily from Dhan Web
2. Store tokens securely
3. Handle token expiry gracefully
4. Don't share tokens publicly

## API Rate Limits

Dhan API has rate limits to ensure fair usage:
- Market data APIs: High frequency allowed
- Order placement: Subject to exchange limits
- Historical data: Reasonable limits

**Note**: Refer to [Dhan API documentation](https://dhanhq.co/docs/v2/) for current rate limits.

## Error Handling

The integration handles common errors:
- Invalid credentials
- Expired tokens
- Network errors
- Invalid security IDs
- API rate limits

Errors are logged to console and displayed to users with helpful messages.

## Advanced Features (Future Enhancements)

### Planned Features
1. **WebSocket Integration**
   - Real-time live market feed
   - Tick-by-tick data streaming
   - Lower latency updates

2. **Historical Data**
   - Intraday charts
   - Daily/Weekly/Monthly data
   - Rolling option data

3. **Order Placement**
   - Place orders directly from analysis
   - Bracket and cover orders
   - Order modification and cancellation

4. **Portfolio Management**
   - View positions
   - Track P&L
   - Manage holdings

## Troubleshooting

### Common Issues

**Issue**: "Invalid access token or client ID"
- **Solution**: Generate a new access token from Dhan Web
- Ensure Client ID is correct

**Issue**: "No data received from broker API"
- **Solution**: Check if market is open
- Verify security ID is correct
- Check network connection

**Issue**: "Session expired"
- **Solution**: Login again with fresh access token
- Tokens expire after 24 hours

**Issue**: "Security ID not found"
- **Solution**: Verify symbol is supported
- Check security ID mapping in code

## Code Structure

### Files Modified/Created
1. **src/config/brokers.js**
   - Added Dhan broker configuration
   - Defined login fields

2. **src/services/dhanApi.js** (NEW)
   - Complete Dhan API implementation
   - Authentication, market data, option chain

3. **src/services/brokerFactory.js**
   - Added Dhan to broker factory

4. **src/utils/symbolTokens.js**
   - Added Dhan security IDs for all symbols

## API Documentation

For complete API documentation, visit:
- **Official Docs**: https://dhanhq.co/docs/v2/
- **Authentication**: https://dhanhq.co/docs/v2/authentication/
- **Market Data**: https://dhanhq.co/docs/v2/market-quote/
- **Option Chain**: https://dhanhq.co/docs/v2/option-chain/

## Support

For Dhan API support:
- **Community**: https://community.dhan.co
- **Knowledge Base**: https://knowledge.dhan.co
- **Email**: support@dhan.co

## Compliance Notes

### Static IP Requirement
- Static IP whitelisting is mandatory for order placement
- Not required for market data APIs
- Can be configured via Dhan Web or API

### TOTP Setup
- Optional TOTP for API authentication
- Simplifies login flow
- Can be setup from Dhan Web

## Testing

### Test with Demo Mode First
1. Test the application with Demo broker
2. Understand the UI and features
3. Then switch to Dhan with real credentials

### Verify Data
1. Compare prices with Dhan Web
2. Check option chain data accuracy
3. Verify OI and volume numbers

## Conclusion

Dhan broker integration is complete and ready to use. The integration provides:
- ✅ Simple authentication
- ✅ Real-time market data
- ✅ Complete option chain with Greeks
- ✅ Support for major indices and stocks
- ✅ Robust error handling
- ✅ Session management

Start using Dhan broker for powerful options trading analysis!

---

**Last Updated**: January 2026
**Integration Version**: 1.0
**Dhan API Version**: v2
