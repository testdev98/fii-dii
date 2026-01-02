// Market Analysis Logic - ALL 16 SCENARIOS based on FII/DII + Price + OI + Volume

export const analyzeMarketScenario = (priceChange, oiChange, fiiNet, diiNet, volume) => {
  const priceUp = priceChange > 0;
  const priceDown = priceChange < 0;
  const oiUp = oiChange > 0;
  const oiDown = oiChange < 0;
  const fiiBuying = fiiNet > 0;
  const fiiSelling = fiiNet < 0;
  const diiBuying = diiNet > 0;
  const diiSelling = diiNet < 0;

  const scenarios = {
    // ========== GROUP A: PRICE RISING (↑) ==========
    
    // 1. Price ↑ + OI ↑ + FII Buying + DII Buying
    SUPER_BULLISH: {
      condition: priceUp && oiUp && fiiBuying && diiBuying,
      signal: 'SUPER BULLISH',
      color: '#059669',
      interpretation: 'Both FII and DII creating fresh longs together. Strongest bullish signal. All big money aligned.',
      nextDay: 'Strong gap-up likely. Trend very sustainable. Buy on dips. Supports will hold strongly.',
      strength: 'VERY HIGH',
      icon: '🚀🚀',
      action: 'BUY'
    },
    
    // 2. Price ↑ + OI ↑ + FII Buying + DII Selling
    STRONG_BULLISH_FII: {
      condition: priceUp && oiUp && fiiBuying && diiSelling,
      signal: 'STRONG BULLISH (FII Led)',
      color: '#10b981',
      interpretation: 'FIIs creating fresh longs, DIIs booking profits. FII conviction high. Trend creator active.',
      nextDay: 'Gap-up or buy-on-dips behavior. Supports tend to hold. Follow FII lead.',
      strength: 'HIGH',
      icon: '🚀',
      action: 'BUY'
    },
    
    // 3. Price ↑ + OI ↑ + FII Selling + DII Buying
    DIVERGENCE_CAUTION: {
      condition: priceUp && oiUp && fiiSelling && diiBuying,
      signal: 'DIVERGENCE / CAUTION',
      color: '#8b5cf6',
      interpretation: 'DIIs/Retail buying, FIIs distributing. Weak hands buying. FIIs exiting = lack of conviction.',
      nextDay: 'Be cautious. Rally may not sustain. Watch for reversal. Don\'t chase highs.',
      strength: 'WEAK',
      icon: '⚠️',
      action: 'AVOID'
    },
    
    // 4. Price ↑ + OI ↑ + FII Selling + DII Selling
    RETAIL_TRAP: {
      condition: priceUp && oiUp && fiiSelling && diiSelling,
      signal: 'RETAIL TRAP',
      color: '#dc2626',
      interpretation: 'Both FII and DII selling, Retail buying at top. Classic distribution. Smart money exiting.',
      nextDay: 'HIGH RISK! Avoid longs. Reversal likely. Exit existing positions.',
      strength: 'DANGEROUS',
      icon: '🚨',
      action: 'SELL'
    },
    
    // 5. Price ↑ + OI ↓ + FII Buying + DII Buying
    SHORT_COVERING_BOTH: {
      condition: priceUp && oiDown && fiiBuying && diiBuying,
      signal: 'SHORT COVERING (Both)',
      color: '#fbbf24',
      interpretation: 'Both covering shorts, not creating longs. Rally due to short covering. Temporary move.',
      nextDay: 'Possible sideways or consolidation. Don\'t chase highs. Wait for pullback.',
      strength: 'WEAK',
      icon: '⚠️',
      action: 'WAIT'
    },
    
    // 6. Price ↑ + OI ↓ + FII Buying + DII Selling
    MIXED_SHORT_COVERING: {
      condition: priceUp && oiDown && fiiBuying && diiSelling,
      signal: 'MIXED SHORT COVERING',
      color: '#f59e0b',
      interpretation: 'FII covering shorts, DII exiting longs. Weak rally. Mixed signals.',
      nextDay: 'Consolidation likely. Avoid fresh positions. Range-bound expected.',
      strength: 'WEAK',
      icon: '⚠️',
      action: 'WAIT'
    },
    
    // 7. Price ↑ + OI ↓ + FII Selling + DII Buying
    WEAK_RALLY: {
      condition: priceUp && oiDown && fiiSelling && diiBuying,
      signal: 'WEAK RALLY',
      color: '#fb923c',
      interpretation: 'DII covering shorts, FII exiting longs. Temporary bounce. No conviction.',
      nextDay: 'Range-bound movement. Watch resistance levels. Don\'t buy.',
      strength: 'WEAK',
      icon: '⚠️',
      action: 'AVOID'
    },
    
    // 8. Price ↑ + OI ↓ + FII Selling + DII Selling
    DEAD_CAT_BOUNCE: {
      condition: priceUp && oiDown && fiiSelling && diiSelling,
      signal: 'DEAD CAT BOUNCE',
      color: '#ef4444',
      interpretation: 'Both exiting longs, price rising on low conviction. Profit booking rally. Very weak.',
      nextDay: 'Likely reversal. Don\'t buy. Consider shorting at resistance.',
      strength: 'VERY WEAK',
      icon: '🐱',
      action: 'SELL'
    },
    
    // ========== GROUP B: PRICE FALLING (↓) ==========
    
    // 9. Price ↓ + OI ↑ + FII Selling + DII Selling
    SUPER_BEARISH: {
      condition: priceDown && oiUp && fiiSelling && diiSelling,
      signal: 'SUPER BEARISH',
      color: '#991b1b',
      interpretation: 'Both FII and DII creating fresh shorts. Strongest bearish signal. All big money aligned downside.',
      nextDay: 'Gap-down likely. Sell on rise. Strong downtrend. Avoid longs completely.',
      strength: 'VERY HIGH',
      icon: '📉📉',
      action: 'SELL'
    },
    
    // 10. Price ↓ + OI ↑ + FII Selling + DII Buying
    DII_SUPPORT: {
      condition: priceDown && oiUp && fiiSelling && diiBuying,
      signal: 'DII SUPPORT / ABSORPTION',
      color: '#3b82f6',
      interpretation: 'FIIs shorting, DIIs buying the dip. DIIs trying to stabilize. Battle between FII and DII.',
      nextDay: 'Watch for consolidation or bounce. Support possible. Monitor who wins.',
      strength: 'MEDIUM',
      icon: '🛡️',
      action: 'WAIT'
    },
    
    // 11. Price ↓ + OI ↑ + FII Buying + DII Selling
    STRONG_BEARISH_DII: {
      condition: priceDown && oiUp && fiiBuying && diiSelling,
      signal: 'STRONG BEARISH (DII Led)',
      color: '#ef4444',
      interpretation: 'DIIs creating shorts, FIIs booking profits. DII-led selling. Unusual but bearish.',
      nextDay: 'Sell on rise. Weakness continues. Avoid longs.',
      strength: 'HIGH',
      icon: '📉',
      action: 'SELL'
    },
    
    // 12. Price ↓ + OI ↑ + FII Buying + DII Buying
    CONTRARIAN_TRAP: {
      condition: priceDown && oiUp && fiiBuying && diiBuying,
      signal: 'CONTRARIAN TRAP',
      color: '#a855f7',
      interpretation: 'Both buying but price falling. Retail panic shorting. FII/DII accumulating at lower levels.',
      nextDay: 'Possible sharp reversal. Watch for bounce. Short squeeze possible.',
      strength: 'MEDIUM',
      icon: '⚠️',
      action: 'WATCH'
    },
    
    // 13. Price ↓ + OI ↓ + FII Selling + DII Selling
    WEAK_FALL_PANIC: {
      condition: priceDown && oiDown && fiiSelling && diiSelling,
      signal: 'WEAK FALL / PANIC',
      color: '#f97316',
      interpretation: 'Both exiting longs, panic selling. Long unwinding. Not aggressive shorting.',
      nextDay: 'Bounce possible at support. Watch Put OI. Not aggressive bearishness.',
      strength: 'WEAK',
      icon: '📊',
      action: 'WAIT'
    },
    
    // 14. Price ↓ + OI ↓ + FII Selling + DII Buying
    MIXED_UNWINDING: {
      condition: priceDown && oiDown && fiiSelling && diiBuying,
      signal: 'MIXED UNWINDING',
      color: '#fb923c',
      interpretation: 'FII exiting longs, DII covering shorts. Mixed signals. Temporary weakness.',
      nextDay: 'Consolidation likely. Watch support levels. Range-bound expected.',
      strength: 'WEAK',
      icon: '⚠️',
      action: 'WAIT'
    },
    
    // 15. Price ↓ + OI ↓ + FII Buying + DII Selling
    LONG_UNWINDING_DII: {
      condition: priceDown && oiDown && fiiBuying && diiSelling,
      signal: 'LONG UNWINDING (DII)',
      color: '#f59e0b',
      interpretation: 'DII exiting longs, FII covering shorts. DII profit booking. Temporary dip.',
      nextDay: 'Bounce possible. Not aggressive selling. Watch for reversal.',
      strength: 'WEAK',
      icon: '📊',
      action: 'WATCH'
    },
    
    // 16. Price ↓ + OI ↓ + FII Buying + DII Buying
    STRONG_REVERSAL_SETUP: {
      condition: priceDown && oiDown && fiiBuying && diiBuying,
      signal: 'STRONG REVERSAL SETUP',
      color: '#10b981',
      interpretation: 'Both covering shorts while price falling. Short covering in progress. Reversal imminent.',
      nextDay: 'Strong bounce likely. Shorts getting squeezed. Consider longs at support.',
      strength: 'HIGH',
      icon: '🔄',
      action: 'BUY'
    },
    
    // Sideways/Neutral
    NEUTRAL: {
      condition: Math.abs(priceChange) < 0.5 && Math.abs(oiChange) < 5,
      signal: 'NEUTRAL / CONSOLIDATION',
      color: '#6b7280',
      interpretation: 'Market in consolidation. No clear direction. Low volatility.',
      nextDay: 'Range-bound movement expected. Wait for breakout.',
      strength: 'LOW',
      icon: '➡️',
      action: 'WAIT'
    }
  };

  // Check scenarios in priority order
  for (const [key, scenario] of Object.entries(scenarios)) {
    if (scenario.condition) {
      return scenario;
    }
  }

  return scenarios.NEUTRAL;
};

export const getMarketControl = (fiiNet, diiNet) => {
  const fiiAbs = Math.abs(fiiNet);
  const diiAbs = Math.abs(diiNet);
  
  if (fiiAbs > diiAbs * 1.5) {
    return {
      controller: 'FII',
      strength: 'Strong',
      description: 'FIIs are in control - Trend Creator'
    };
  } else if (diiAbs > fiiAbs * 1.5) {
    return {
      controller: 'DII',
      strength: 'Strong',
      description: 'DIIs are in control - Trend Stabilizer'
    };
  } else {
    return {
      controller: 'Mixed',
      strength: 'Balanced',
      description: 'Both FII and DII active - Watch for direction'
    };
  }
};

export const analyzeStrikeOI = (currentPrice, maxCallOI, maxPutOI, callStrike, putStrike) => {
  const analysis = {
    resistance: null,
    support: null,
    range: null,
    recommendation: ''
  };

  if (callStrike && callStrike > currentPrice) {
    const distance = ((callStrike - currentPrice) / currentPrice * 100).toFixed(2);
    analysis.resistance = {
      level: callStrike,
      distance: distance,
      oi: maxCallOI,
      strength: maxCallOI > 1000000 ? 'Strong' : 'Moderate'
    };
  }

  if (putStrike && putStrike < currentPrice) {
    const distance = ((currentPrice - putStrike) / currentPrice * 100).toFixed(2);
    analysis.support = {
      level: putStrike,
      distance: distance,
      oi: maxPutOI,
      strength: maxPutOI > 1000000 ? 'Strong' : 'Moderate'
    };
  }

  if (analysis.resistance && analysis.support) {
    analysis.range = {
      upper: callStrike,
      lower: putStrike,
      width: callStrike - putStrike
    };
    analysis.recommendation = `Market likely to trade between ${putStrike} - ${callStrike}`;
  }

  return analysis;
};

export const calculateConviction = (priceChange, oiChange, volume, avgVolume) => {
  let score = 0;
  
  // Price movement strength
  if (Math.abs(priceChange) > 1) score += 25;
  else if (Math.abs(priceChange) > 0.5) score += 15;
  
  // OI change strength
  if (Math.abs(oiChange) > 10) score += 25;
  else if (Math.abs(oiChange) > 5) score += 15;
  
  // Volume confirmation
  if (volume > avgVolume * 1.5) score += 25;
  else if (volume > avgVolume) score += 15;
  
  // Alignment bonus
  if ((priceChange > 0 && oiChange > 0) || (priceChange < 0 && oiChange > 0)) {
    score += 25;
  }
  
  return {
    score,
    level: score > 75 ? 'HIGH' : score > 50 ? 'MEDIUM' : 'LOW',
    color: score > 75 ? '#10b981' : score > 50 ? '#fbbf24' : '#ef4444'
  };
};
