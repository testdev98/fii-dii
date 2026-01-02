// Quick Test Script for Market Analysis Logic
// Run with: node test-scenarios.js

// Import the analysis function (simplified for testing)
const analyzeMarketScenario = (priceChange, oiChange, fiiNet, diiNet) => {
  const priceUp = priceChange > 0;
  const priceDown = priceChange < 0;
  const oiUp = oiChange > 0;
  const oiDown = oiChange < 0;
  const fiiBuying = fiiNet > 0;
  const fiiSelling = fiiNet < 0;
  const diiBuying = diiNet > 0;
  const diiSelling = diiNet < 0;

  // Test all 16 scenarios
  if (priceUp && oiUp && fiiBuying && diiBuying) return 'SUPER BULLISH';
  if (priceUp && oiUp && fiiBuying && diiSelling) return 'STRONG BULLISH (FII Led)';
  if (priceUp && oiUp && fiiSelling && diiBuying) return 'DIVERGENCE / CAUTION';
  if (priceUp && oiUp && fiiSelling && diiSelling) return 'RETAIL TRAP';
  if (priceUp && oiDown && fiiBuying && diiBuying) return 'SHORT COVERING (Both)';
  if (priceUp && oiDown && fiiBuying && diiSelling) return 'MIXED SHORT COVERING';
  if (priceUp && oiDown && fiiSelling && diiBuying) return 'WEAK RALLY';
  if (priceUp && oiDown && fiiSelling && diiSelling) return 'DEAD CAT BOUNCE';
  if (priceDown && oiUp && fiiSelling && diiSelling) return 'SUPER BEARISH';
  if (priceDown && oiUp && fiiSelling && diiBuying) return 'DII SUPPORT / ABSORPTION';
  if (priceDown && oiUp && fiiBuying && diiSelling) return 'STRONG BEARISH (DII Led)';
  if (priceDown && oiUp && fiiBuying && diiBuying) return 'CONTRARIAN TRAP';
  if (priceDown && oiDown && fiiSelling && diiSelling) return 'WEAK FALL / PANIC';
  if (priceDown && oiDown && fiiSelling && diiBuying) return 'MIXED UNWINDING';
  if (priceDown && oiDown && fiiBuying && diiSelling) return 'LONG UNWINDING (DII)';
  if (priceDown && oiDown && fiiBuying && diiBuying) return 'STRONG REVERSAL SETUP';
  
  return 'NEUTRAL';
};

// Test cases for all 16 scenarios
const testCases = [
  { name: 'Scenario 1', price: 2.0, oi: 10, fii: 1500, dii: 800, expected: 'SUPER BULLISH' },
  { name: 'Scenario 2', price: 1.5, oi: 8, fii: 1200, dii: -300, expected: 'STRONG BULLISH (FII Led)' },
  { name: 'Scenario 3', price: 1.0, oi: 6, fii: -800, dii: 1000, expected: 'DIVERGENCE / CAUTION' },
  { name: 'Scenario 4', price: 1.2, oi: 7, fii: -1000, dii: -600, expected: 'RETAIL TRAP' },
  { name: 'Scenario 5', price: 1.0, oi: -5, fii: 500, dii: 300, expected: 'SHORT COVERING (Both)' },
  { name: 'Scenario 6', price: 0.8, oi: -4, fii: 400, dii: -200, expected: 'MIXED SHORT COVERING' },
  { name: 'Scenario 7', price: 0.6, oi: -3, fii: -300, dii: 400, expected: 'WEAK RALLY' },
  { name: 'Scenario 8', price: 0.5, oi: -6, fii: -600, dii: -400, expected: 'DEAD CAT BOUNCE' },
  { name: 'Scenario 9', price: -2.0, oi: 10, fii: -1500, dii: -800, expected: 'SUPER BEARISH' },
  { name: 'Scenario 10', price: -1.5, oi: 8, fii: -1200, dii: 900, expected: 'DII SUPPORT / ABSORPTION' },
  { name: 'Scenario 11', price: -1.2, oi: 6, fii: 300, dii: -1000, expected: 'STRONG BEARISH (DII Led)' },
  { name: 'Scenario 12', price: -1.0, oi: 7, fii: 800, dii: 600, expected: 'CONTRARIAN TRAP' },
  { name: 'Scenario 13', price: -1.5, oi: -8, fii: -700, dii: -500, expected: 'WEAK FALL / PANIC' },
  { name: 'Scenario 14', price: -0.8, oi: -5, fii: -400, dii: 300, expected: 'MIXED UNWINDING' },
  { name: 'Scenario 15', price: -0.6, oi: -4, fii: 300, dii: -500, expected: 'LONG UNWINDING (DII)' },
  { name: 'Scenario 16', price: -0.5, oi: -6, fii: 800, dii: 600, expected: 'STRONG REVERSAL SETUP' }
];

// Run tests
console.log('🧪 Testing Market Analysis Logic\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = analyzeMarketScenario(test.price, test.oi, test.fii, test.dii);
  const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
  
  if (result === test.expected) {
    passed++;
  } else {
    failed++;
  }
  
  console.log(`\n${test.name}: ${status}`);
  console.log(`  Input: Price ${test.price > 0 ? '+' : ''}${test.price}%, OI ${test.oi > 0 ? '+' : ''}${test.oi}%, FII ${test.fii > 0 ? '+' : ''}${test.fii}, DII ${test.dii > 0 ? '+' : ''}${test.dii}`);
  console.log(`  Expected: ${test.expected}`);
  console.log(`  Got: ${result}`);
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Test Results:`);
console.log(`   ✅ Passed: ${passed}/${testCases.length}`);
console.log(`   ❌ Failed: ${failed}/${testCases.length}`);
console.log(`   📈 Success Rate: ${(passed / testCases.length * 100).toFixed(2)}%`);

if (failed === 0) {
  console.log('\n🎉 ALL TESTS PASSED! Market analysis logic is working correctly.\n');
} else {
  console.log('\n⚠️  Some tests failed. Please review the logic.\n');
}
