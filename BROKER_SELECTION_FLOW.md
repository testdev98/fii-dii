# Broker Selection Flow - Visual Guide

## 🎯 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD STARTUP                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LOGIN MODAL APPEARS                            │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Connect Your Broker                                     │  │
│   │  Choose your trading platform to get started            │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   STEP 1: SELECT YOUR BROKER                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BROKER SELECTION GRID                         │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│   │ 📊 Angel One │  │ 🔷 Zerodha   │  │ 🟣 Upstox    │        │
│   │              │  │              │  │              │        │
│   │ [API Docs]   │  │ [API Docs]   │  │ [API Docs]   │        │
│   └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│   │ 🟠 Fyers     │  │ 🔶 IIFL      │  │ 🔵 Alice Blue│        │
│   │              │  │              │  │              │        │
│   │ [API Docs]   │  │ [API Docs]   │  │ [API Docs]   │        │
│   └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│   │ 🔴 Kotak     │  │ 🟤 ICICI     │  │ 🎮 Demo Mode │        │
│   │              │  │              │  │ ✓ No creds   │        │
│   │ [API Docs]   │  │ [API Docs]   │  │ required     │        │
│   └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
│   [Show More Brokers]                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐  ┌───────────────────┐
        │   DEMO MODE       │  │   REAL BROKER     │
        └───────────────────┘  └───────────────────┘
                    │                   │
                    ▼                   ▼
```

---

## 🎮 Demo Mode Flow

```
┌─────────────────────────────────────────────────────────────────┐
│   Connect to Demo Mode                                          │
│   ← Back                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                        🎮                                │  │
│   │                                                          │  │
│   │                    Demo Mode                             │  │
│   │                                                          │  │
│   │   No credentials required! Click continue to explore    │  │
│   │   the dashboard with sample data.                       │  │
│   │                                                          │  │
│   │              [Continue with Demo]                        │  │
│   │                                                          │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   🔒 Secure Connection    Your data is encrypted               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  DASHBOARD      │
                    │  (Mock Data)    │
                    └─────────────────┘
```

---

## 📊 Angel One Flow

```
┌─────────────────────────────────────────────────────────────────┐
│   Connect to Angel One (Angel Broking)                          │
│   ← Back                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ℹ️ How to get credentials?                                    │
│   Visit your broker's API portal to generate API keys.         │
│   [View Angel One API Documentation] 🔗                         │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ API Key *                                                │  │
│   │ [Enter your API Key                              ]      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ Client ID *                                              │  │
│   │ [Enter your Client ID                             ]      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ Password *                                               │  │
│   │ [Enter your Password                              ] 👁️   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ TOTP *                                                   │  │
│   │ [Enter TOTP from authenticator                    ]      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   [Connect & Login]                                             │
│                                                                  │
│   🔒 Security Note: Your credentials are encrypted and stored  │
│   locally in your browser.                                      │
│                                                                  │
│   🔒 Secure Connection    Your data is encrypted               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Connecting...  │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │   SUCCESS    │    │    ERROR     │
            └──────────────┘    └──────────────┘
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │  DASHBOARD   │    │ Show Error   │
            │  (Live Data) │    │ Stay on Form │
            └──────────────┘    └──────────────┘
```

---

## 🔷 Zerodha Flow (OAuth Required)

```
┌─────────────────────────────────────────────────────────────────┐
│   Connect to Zerodha (Kite Connect)                             │
│   ← Back                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ℹ️ How to get credentials?                                    │
│   Zerodha requires OAuth 2.0 authentication flow.              │
│   [View Zerodha API Documentation] 🔗                           │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ API Key *                                                │  │
│   │ [Enter your API Key                              ]      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ API Secret *                                             │  │
│   │ [Enter your API Secret                            ] 👁️   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ Request Token                                            │  │
│   │ [Optional: Request Token                          ]      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ⚠️ Note: You'll need to complete OAuth flow to get          │
│   request token. See documentation for details.                │
│                                                                  │
│   [Connect & Login]                                             │
│                                                                  │
│   🔒 Secure Connection    Your data is encrypted               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  OAuth Flow     │
                    │  (External)     │
                    └─────────────────┘
```

---

## 📱 Mobile View

```
┌─────────────────────┐
│  Connect Broker     │
│  ← Back         ✕   │
├─────────────────────┤
│                     │
│  Select Broker:     │
│                     │
│  ┌─────────────────┐│
│  │ 📊 Angel One    ││
│  │ [API Docs] 🔗   ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ 🔷 Zerodha      ││
│  │ [API Docs] 🔗   ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ 🎮 Demo Mode    ││
│  │ ✓ No creds      ││
│  └─────────────────┘│
│                     │
│  [Show More]        │
│                     │
└─────────────────────┘
```

---

## 🔄 State Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                      STATE DIAGRAM                               │
└─────────────────────────────────────────────────────────────────┘

    [Initial]
        │
        ▼
    [Broker Selection]
        │
        ├─── Select Demo ──────────────────┐
        │                                   │
        ├─── Select Real Broker ────┐      │
        │                            │      │
        ▼                            ▼      ▼
    [Credential Entry]          [Demo Login]
        │                            │
        ├─── Submit ────┐            │
        │                │            │
        ▼                ▼            ▼
    [Connecting]    [Error]      [Success]
        │                │            │
        ├─── Success ────┤            │
        │                │            │
        ▼                ▼            ▼
    [Dashboard]     [Retry]      [Dashboard]
        │                │            │
        ├─── Logout ─────┤            │
        │                │            │
        ▼                ▼            ▼
    [Broker Selection]  [Broker Selection]
```

---

## 🎯 Decision Tree

```
START
  │
  ├─ Do you have broker account?
  │   │
  │   ├─ YES → Which broker?
  │   │   │
  │   │   ├─ Angel One → Enter 4 credentials
  │   │   ├─ Zerodha → OAuth flow required
  │   │   ├─ Upstox → OAuth flow required
  │   │   ├─ IIFL → Enter 4 credentials
  │   │   ├─ Alice Blue → Enter 3 credentials
  │   │   └─ Others → Check requirements
  │   │
  │   └─ NO → Use Demo Mode
  │       │
  │       └─ Click "Continue with Demo"
  │
  └─ Want to learn first?
      │
      └─ YES → Use Demo Mode
          │
          └─ Later connect real broker
```

---

## 💡 User Experience Tips

### For First-Time Users
```
1. Start Here: Demo Mode
   ↓
2. Learn: Use Scenario Tester
   ↓
3. Practice: Test all 16 scenarios
   ↓
4. Ready: Connect real broker
```

### For Experienced Users
```
1. Select: Your broker
   ↓
2. Enter: API credentials
   ↓
3. Connect: Start trading
   ↓
4. Analyze: Use live data
```

---

## 🔒 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY MEASURES                             │
└─────────────────────────────────────────────────────────────────┘

User Enters Credentials
        │
        ▼
    [Validation]
        │
        ├─ Valid Format? ──NO──> Show Error
        │                         │
        YES                       │
        │                         │
        ▼                         │
    [Encryption] <───────────────┘
        │
        ▼
    [Local Storage]
        │
        ▼
    [API Call]
        │
        ├─ HTTPS Only
        ├─ Encrypted Connection
        └─ No Server Storage
        │
        ▼
    [Broker API]
        │
        ├─ Success → Store Token
        └─ Failure → Clear Data
```

---

## 📊 Component Hierarchy

```
App
 │
 ├─ LoginModal
 │   │
 │   ├─ BrokerSelector
 │   │   │
 │   │   ├─ Broker Card (Angel One)
 │   │   ├─ Broker Card (Zerodha)
 │   │   ├─ Broker Card (Upstox)
 │   │   ├─ Broker Card (Fyers)
 │   │   ├─ Broker Card (IIFL)
 │   │   ├─ Broker Card (Alice Blue)
 │   │   ├─ Broker Card (Kotak)
 │   │   ├─ Broker Card (ICICI)
 │   │   └─ Broker Card (Demo)
 │   │
 │   └─ BrokerCredentialsForm
 │       │
 │       ├─ Field (API Key)
 │       ├─ Field (Client ID)
 │       ├─ Field (Password)
 │       ├─ Field (TOTP)
 │       ├─ Submit Button
 │       └─ Error Display
 │
 └─ Dashboard
     │
     ├─ Header (shows connected broker)
     ├─ Market Scenario Card
     ├─ FII/DII Cards
     └─ ... (other components)
```

---

## ✅ Validation Flow

```
User Clicks "Connect & Login"
        │
        ▼
    [Validate All Fields]
        │
        ├─ Empty Field? ──YES──> Show "Required"
        │                         │
        NO                        │
        │                         │
        ▼                         │
    [Format Check] <─────────────┘
        │
        ├─ Invalid Format? ──YES──> Show "Invalid"
        │                            │
        NO                           │
        │                            │
        ▼                            │
    [Submit to API] <───────────────┘
        │
        ├─ Network Error? ──YES──> Show "Connection Failed"
        │                           │
        NO                          │
        │                           │
        ▼                           │
    [API Response] <────────────────┘
        │
        ├─ Auth Failed? ──YES──> Show "Invalid Credentials"
        │                         │
        NO                        │
        │                         │
        ▼                         │
    [SUCCESS] <──────────────────┘
        │
        ▼
    [Load Dashboard]
```

---

**Visual Guide Complete! 🎨**

This flow ensures a smooth, secure, and intuitive broker connection experience.
