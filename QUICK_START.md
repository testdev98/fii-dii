# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Dashboard
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to `http://localhost:3000`

---

## 🎯 First Time Using the Dashboard?

### Demo Mode (Recommended for Learning)

1. **Login Screen** - Just click "Login" (uses mock data)
2. **Explore Live Dashboard** - See all components with sample data
3. **Click 🧪 Scenario Tester** - Test all 16 scenarios interactively

### Understanding the Interface

#### 📊 Live Dashboard Tab
- **Market Scenario Card** - Shows current detected scenario
- **FII/DII Cards** - Net buying/selling data
- **Market Control** - Who's driving the market
- **Price + OI + Volume** - Combined analysis with charts
- **Strike OI** - Support and resistance levels
- **Conviction Meter** - Market strength indicator

#### 🧪 Scenario Tester Tab
- **Input Controls** - Adjust Price, OI, FII, DII manually
- **Quick Presets** - 16 buttons for all scenarios
- **Real-time Detection** - See scenario change instantly
- **Learn by Doing** - Understand each scenario deeply

---

## 📚 Learning Path

### Beginner (Day 1)
1. Read the **Memory Rule** at bottom of dashboard
2. Use **Scenario Tester** - Click all 16 presets
3. Understand the difference between:
   - Price ↑ + OI ↑ (Strong)
   - Price ↑ + OI ↓ (Weak)

### Intermediate (Day 2-3)
1. Focus on **dangerous scenarios**:
   - Retail Trap (#4)
   - Dead Cat Bounce (#8)
   - Divergence (#3)
2. Learn **best opportunities**:
   - Super Bullish (#1)
   - Strong Reversal Setup (#16)
3. Read `SCENARIOS_GUIDE.md` for deep understanding

### Advanced (Day 4+)
1. Combine with **Strike OI** analysis
2. Use **Market Control** to identify trend creator
3. Check **Conviction Meter** for strength
4. Apply **Professional Workflow** daily

---

## 🎓 Key Concepts to Master

### 1. OI (Open Interest) is Critical
- **OI Rising** = New positions being created
- **OI Falling** = Positions being closed

### 2. FII vs DII Roles
- **FII** = Trend Creator (follow them)
- **DII** = Trend Stabilizer (support/resistance)

### 3. The 4 Variables
- **Price** → Direction
- **OI** → Strength
- **FII** → Conviction
- **Strike OI** → Limits

### 4. Action Priority
- **BUY**: Scenarios 1, 2, 16
- **SELL**: Scenarios 4, 8, 9, 11
- **WAIT**: Scenarios 5, 6, 10, 13, 14
- **AVOID**: Scenarios 3, 7
- **WATCH**: Scenarios 12, 15

---

## 💡 Pro Tips

### Tip 1: Always Check All 4 Factors
Never trade on just one indicator. Check:
1. Price direction
2. OI change
3. FII/DII data
4. Strike OI levels

### Tip 2: Respect the Dangerous Scenarios
If you see:
- **Retail Trap** - Exit immediately
- **Dead Cat Bounce** - Don't buy
- **Divergence** - Be cautious

### Tip 3: Best Entry Points
Look for:
- **Super Bullish** - Strong entry
- **Strong Reversal Setup** - Bottom fishing
- **DII Support** - Support bounce

### Tip 4: Use Strike OI as Limits
- Max Call OI = Resistance (exit longs here)
- Max Put OI = Support (enter longs here)

---

## 🧪 Practice Exercises

### Exercise 1: Identify the Scenario
Set these values in Scenario Tester:
- Price: +1.5%
- OI: +8%
- FII: +1200 Cr
- DII: -300 Cr

**Question**: What scenario is this?
**Answer**: Strong Bullish (FII Led) - BUY signal

### Exercise 2: Spot the Trap
Set these values:
- Price: +1.2%
- OI: +7%
- FII: -1000 Cr
- DII: -600 Cr

**Question**: What scenario is this?
**Answer**: Retail Trap - SELL signal (Danger!)

### Exercise 3: Find the Reversal
Set these values:
- Price: -0.5%
- OI: -6%
- FII: +800 Cr
- DII: +600 Cr

**Question**: What scenario is this?
**Answer**: Strong Reversal Setup - BUY signal

---

## 📊 Daily Workflow

### Morning (Before Market Opens)
1. Check previous day's FII/DII data
2. Note Max Call OI and Max Put OI
3. Identify expected scenario

### During Market Hours
1. Monitor price and OI changes
2. Watch for scenario shifts
3. Check conviction meter

### Evening (After Market Closes)
1. Review actual scenario that played out
2. Compare with morning expectation
3. Learn from differences

---

## ❓ Common Questions

**Q: Can I use this for intraday trading?**
A: FII/DII data is end-of-day. Use for positional/swing trading.

**Q: Which scenarios are most reliable?**
A: Super Bullish (#1), Super Bearish (#9), Strong Reversal (#16)

**Q: What if FII and DII contradict?**
A: Follow FII (trend creator). DII is stabilizer.

**Q: How accurate is this?**
A: No method is 100%. Always use stop losses and risk management.

**Q: Do I need Angel One API?**
A: No! Demo mode works perfectly for learning.

---

## 🎯 Your First Week Goals

### Day 1-2: Learn the Basics
- [ ] Understand all 16 scenarios
- [ ] Use Scenario Tester for each
- [ ] Memorize the Memory Rule

### Day 3-4: Identify Patterns
- [ ] Spot dangerous scenarios
- [ ] Find best opportunities
- [ ] Understand OI importance

### Day 5-7: Apply Knowledge
- [ ] Follow real market data
- [ ] Predict scenarios
- [ ] Track accuracy

---

## 🚨 Safety Rules

1. **Never trade without stop loss**
2. **Avoid Retail Trap scenarios**
3. **Don't chase Dead Cat Bounces**
4. **Respect Strike OI levels**
5. **Wait for high conviction scenarios**

---

## 📞 Need Help?

- Read `SCENARIOS_GUIDE.md` for detailed explanations
- Use Scenario Tester to experiment
- Check inline tooltips in dashboard
- Review Professional Workflow section

---

**Remember**: This is a learning tool. Practice with demo mode first, understand all scenarios, then apply to real trading with proper risk management.

**Happy Trading! 📈**
