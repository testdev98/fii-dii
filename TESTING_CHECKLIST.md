# Testing Checklist

## ✅ Complete Testing Guide

Use this checklist to verify all 16 scenarios work correctly.

---

## 🧪 Scenario Tester Verification

### Setup
1. [ ] Run `npm install`
2. [ ] Run `npm run dev`
3. [ ] Open `http://localhost:3000`
4. [ ] Click through login (demo mode)
5. [ ] Click 🧪 icon or "Scenario Tester" tab

---

## 📊 Test Each Scenario

### Group A: Price Rising (↑)

#### Scenario 1: SUPER BULLISH
- [ ] Click "1. SUPER BULLISH" preset
- [ ] Verify inputs: Price +2.0%, OI +10%, FII +1500, DII +800
- [ ] Check signal shows: "SUPER BULLISH 🚀🚀"
- [ ] Verify color: Green (#059669)
- [ ] Check action: "BUY"
- [ ] Verify strength: "VERY HIGH"

#### Scenario 2: STRONG BULLISH (FII Led)
- [ ] Click "2. STRONG BULLISH (FII)" preset
- [ ] Verify inputs: Price +1.5%, OI +8%, FII +1200, DII -300
- [ ] Check signal shows: "STRONG BULLISH (FII Led) 🚀"
- [ ] Verify color: Green (#10b981)
- [ ] Check action: "BUY"
- [ ] Verify strength: "HIGH"

#### Scenario 3: DIVERGENCE
- [ ] Click "3. DIVERGENCE" preset
- [ ] Verify inputs: Price +1.0%, OI +6%, FII -800, DII +1000
- [ ] Check signal shows: "DIVERGENCE / CAUTION ⚠️"
- [ ] Verify color: Purple (#8b5cf6)
- [ ] Check action: "AVOID"
- [ ] Verify strength: "WEAK"

#### Scenario 4: RETAIL TRAP
- [ ] Click "4. RETAIL TRAP" preset
- [ ] Verify inputs: Price +1.2%, OI +7%, FII -1000, DII -600
- [ ] Check signal shows: "RETAIL TRAP 🚨"
- [ ] Verify color: Red (#dc2626)
- [ ] Check action: "SELL"
- [ ] Verify strength: "DANGEROUS"

#### Scenario 5: SHORT COVERING (Both)
- [ ] Click "5. SHORT COVERING (Both)" preset
- [ ] Verify inputs: Price +1.0%, OI -5%, FII +500, DII +300
- [ ] Check signal shows: "SHORT COVERING (Both) ⚠️"
- [ ] Verify color: Yellow (#fbbf24)
- [ ] Check action: "WAIT"
- [ ] Verify strength: "WEAK"

#### Scenario 6: MIXED SHORT COVERING
- [ ] Click "6. MIXED SHORT COVERING" preset
- [ ] Verify inputs: Price +0.8%, OI -4%, FII +400, DII -200
- [ ] Check signal shows: "MIXED SHORT COVERING ⚠️"
- [ ] Verify color: Orange (#f59e0b)
- [ ] Check action: "WAIT"
- [ ] Verify strength: "WEAK"

#### Scenario 7: WEAK RALLY
- [ ] Click "7. WEAK RALLY" preset
- [ ] Verify inputs: Price +0.6%, OI -3%, FII -300, DII +400
- [ ] Check signal shows: "WEAK RALLY ⚠️"
- [ ] Verify color: Orange (#fb923c)
- [ ] Check action: "AVOID"
- [ ] Verify strength: "WEAK"

#### Scenario 8: DEAD CAT BOUNCE
- [ ] Click "8. DEAD CAT BOUNCE" preset
- [ ] Verify inputs: Price +0.5%, OI -6%, FII -600, DII -400
- [ ] Check signal shows: "DEAD CAT BOUNCE 🐱"
- [ ] Verify color: Red (#ef4444)
- [ ] Check action: "SELL"
- [ ] Verify strength: "VERY WEAK"

---

### Group B: Price Falling (↓)

#### Scenario 9: SUPER BEARISH
- [ ] Click "9. SUPER BEARISH" preset
- [ ] Verify inputs: Price -2.0%, OI +10%, FII -1500, DII -800
- [ ] Check signal shows: "SUPER BEARISH 📉📉"
- [ ] Verify color: Dark Red (#991b1b)
- [ ] Check action: "SELL"
- [ ] Verify strength: "VERY HIGH"

#### Scenario 10: DII SUPPORT
- [ ] Click "10. DII SUPPORT" preset
- [ ] Verify inputs: Price -1.5%, OI +8%, FII -1200, DII +900
- [ ] Check signal shows: "DII SUPPORT / ABSORPTION 🛡️"
- [ ] Verify color: Blue (#3b82f6)
- [ ] Check action: "WAIT"
- [ ] Verify strength: "MEDIUM"

#### Scenario 11: STRONG BEARISH (DII Led)
- [ ] Click "11. STRONG BEARISH (DII)" preset
- [ ] Verify inputs: Price -1.2%, OI +6%, FII +300, DII -1000
- [ ] Check signal shows: "STRONG BEARISH (DII Led) 📉"
- [ ] Verify color: Red (#ef4444)
- [ ] Check action: "SELL"
- [ ] Verify strength: "HIGH"

#### Scenario 12: CONTRARIAN TRAP
- [ ] Click "12. CONTRARIAN TRAP" preset
- [ ] Verify inputs: Price -1.0%, OI +7%, FII +800, DII +600
- [ ] Check signal shows: "CONTRARIAN TRAP ⚠️"
- [ ] Verify color: Purple (#a855f7)
- [ ] Check action: "WATCH"
- [ ] Verify strength: "MEDIUM"

#### Scenario 13: WEAK FALL / PANIC
- [ ] Click "13. WEAK FALL / PANIC" preset
- [ ] Verify inputs: Price -1.5%, OI -8%, FII -700, DII -500
- [ ] Check signal shows: "WEAK FALL / PANIC 📊"
- [ ] Verify color: Orange (#f97316)
- [ ] Check action: "WAIT"
- [ ] Verify strength: "WEAK"

#### Scenario 14: MIXED UNWINDING
- [ ] Click "14. MIXED UNWINDING" preset
- [ ] Verify inputs: Price -0.8%, OI -5%, FII -400, DII +300
- [ ] Check signal shows: "MIXED UNWINDING ⚠️"
- [ ] Verify color: Orange (#fb923c)
- [ ] Check action: "WAIT"
- [ ] Verify strength: "WEAK"

#### Scenario 15: LONG UNWINDING (DII)
- [ ] Click "15. LONG UNWINDING (DII)" preset
- [ ] Verify inputs: Price -0.6%, OI -4%, FII +300, DII -500
- [ ] Check signal shows: "LONG UNWINDING (DII) 📊"
- [ ] Verify color: Orange (#f59e0b)
- [ ] Check action: "WATCH"
- [ ] Verify strength: "WEAK"

#### Scenario 16: STRONG REVERSAL SETUP
- [ ] Click "16. STRONG REVERSAL SETUP" preset
- [ ] Verify inputs: Price -0.5%, OI -6%, FII +800, DII +600
- [ ] Check signal shows: "STRONG REVERSAL SETUP 🔄"
- [ ] Verify color: Green (#10b981)
- [ ] Check action: "BUY"
- [ ] Verify strength: "HIGH"

---

## 🎨 UI/UX Testing

### Dashboard Tab
- [ ] All cards render correctly
- [ ] FII/DII cards show proper colors
- [ ] Market Control card displays correctly
- [ ] Charts render without errors
- [ ] Strike OI visualization works
- [ ] Conviction meter displays
- [ ] Professional workflow section visible
- [ ] Memory rule section visible

### Scenario Tester Tab
- [ ] Input controls work
- [ ] Manual input changes trigger updates
- [ ] All 16 preset buttons work
- [ ] Current inputs summary updates
- [ ] Scenario card updates in real-time
- [ ] Action recommendation displays

### Navigation
- [ ] Tab switching works smoothly
- [ ] Login modal appears on first load
- [ ] Logout button works
- [ ] Refresh button works
- [ ] 🧪 toggle button works

---

## 📱 Responsive Testing

### Desktop (1920px+)
- [ ] All cards display in grid
- [ ] Charts are readable
- [ ] No horizontal scroll
- [ ] Proper spacing

### Laptop (1024px - 1919px)
- [ ] Layout adjusts properly
- [ ] Cards stack appropriately
- [ ] Charts remain readable
- [ ] Navigation works

### Tablet (768px - 1023px)
- [ ] Single column layout
- [ ] Touch targets adequate
- [ ] Charts scale properly
- [ ] All content accessible

### Mobile (320px - 767px)
- [ ] Fully responsive
- [ ] No content cut off
- [ ] Buttons easily tappable
- [ ] Charts readable
- [ ] Scrolling smooth

---

## 🔧 Functionality Testing

### Manual Input Testing
- [ ] Price change accepts positive values
- [ ] Price change accepts negative values
- [ ] OI change accepts positive values
- [ ] OI change accepts negative values
- [ ] FII net accepts positive values
- [ ] FII net accepts negative values
- [ ] DII net accepts positive values
- [ ] DII net accepts negative values
- [ ] Volume input works

### Edge Cases
- [ ] Price = 0, OI = 0 → Shows NEUTRAL
- [ ] Very large FII values work
- [ ] Very large DII values work
- [ ] Negative volume handled
- [ ] Decimal values work

---

## 🎯 Action Recommendation Testing

### BUY Actions
- [ ] Scenario 1 shows BUY
- [ ] Scenario 2 shows BUY
- [ ] Scenario 16 shows BUY
- [ ] BUY displayed in green

### SELL Actions
- [ ] Scenario 4 shows SELL
- [ ] Scenario 8 shows SELL
- [ ] Scenario 9 shows SELL
- [ ] Scenario 11 shows SELL
- [ ] SELL displayed in red

### WAIT Actions
- [ ] Scenario 5 shows WAIT
- [ ] Scenario 6 shows WAIT
- [ ] Scenario 10 shows WAIT
- [ ] Scenario 13 shows WAIT
- [ ] Scenario 14 shows WAIT
- [ ] WAIT displayed in blue

### AVOID Actions
- [ ] Scenario 3 shows AVOID
- [ ] Scenario 7 shows AVOID
- [ ] AVOID displayed in yellow

### WATCH Actions
- [ ] Scenario 12 shows WATCH
- [ ] Scenario 15 shows WATCH
- [ ] WATCH displayed in blue

---

## 📊 Data Validation

### Live Dashboard
- [ ] Mock data loads correctly
- [ ] FII net displays with proper sign
- [ ] DII net displays with proper sign
- [ ] Price change shows percentage
- [ ] OI change shows percentage
- [ ] Volume displays in millions
- [ ] Historical data charts render
- [ ] Strike OI data displays

### Calculations
- [ ] Market control logic correct
- [ ] Conviction score calculates
- [ ] Scenario detection accurate
- [ ] Strike OI analysis works

---

## 🚨 Error Handling

- [ ] Invalid inputs handled gracefully
- [ ] Missing data doesn't crash app
- [ ] API errors (if enabled) caught
- [ ] Console shows no errors
- [ ] No React warnings

---

## 🎨 Visual Testing

### Colors
- [ ] Green for bullish scenarios
- [ ] Red for bearish scenarios
- [ ] Yellow for caution
- [ ] Blue for support/wait
- [ ] Purple for mixed signals
- [ ] Proper contrast ratios

### Typography
- [ ] All text readable
- [ ] Font sizes appropriate
- [ ] Hierarchy clear
- [ ] No text overflow

### Spacing
- [ ] Consistent padding
- [ ] Proper margins
- [ ] Cards well-spaced
- [ ] No cramped sections

---

## 📚 Documentation Testing

- [ ] README.md complete
- [ ] SCENARIOS_GUIDE.md accurate
- [ ] QUICK_START.md helpful
- [ ] SCENARIOS_VISUAL.md clear
- [ ] All links work
- [ ] Code examples correct

---

## 🔄 Integration Testing

### Scenario Detection Flow
1. [ ] Input changes → Scenario updates
2. [ ] Preset click → All inputs update
3. [ ] Inputs update → Scenario card updates
4. [ ] Action recommendation appears
5. [ ] Colors change appropriately

### Dashboard Flow
1. [ ] Login → Dashboard loads
2. [ ] Refresh → Data updates
3. [ ] Tab switch → Content changes
4. [ ] Logout → Returns to login

---

## ✅ Final Checklist

### Code Quality
- [ ] No console errors
- [ ] No React warnings
- [ ] Clean code structure
- [ ] Proper component organization
- [ ] Comments where needed

### Performance
- [ ] Fast initial load
- [ ] Smooth interactions
- [ ] No lag on input changes
- [ ] Charts render quickly
- [ ] Tab switching instant

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Touch targets adequate
- [ ] Screen reader friendly

### Browser Compatibility
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works
- [ ] Mobile browsers work

---

## 🎯 Success Criteria

✅ All 16 scenarios detect correctly
✅ All action recommendations accurate
✅ UI responsive on all devices
✅ No errors in console
✅ Smooth user experience
✅ Documentation complete
✅ Code clean and maintainable

---

## 📝 Testing Notes

**Date Tested:** _____________

**Tested By:** _____________

**Browser:** _____________

**Device:** _____________

**Issues Found:** 
_____________________________________________
_____________________________________________
_____________________________________________

**Status:** [ ] PASS  [ ] FAIL

---

## 🐛 Bug Report Template

If you find issues, document them:

**Bug #:** ___
**Scenario:** ___
**Expected:** ___
**Actual:** ___
**Steps to Reproduce:**
1. ___
2. ___
3. ___

**Screenshot:** (if applicable)

---

**Testing Complete! ✅**
