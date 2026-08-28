import fs from 'fs';

function runFundsPillTests() {
  console.log('================================================================');
  console.log('🧪 TEST: CONTENEDOR VISUAL DE FONDOS DISPONIBLES');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(cond: boolean, msg: string) {
    total++;
    if (cond) {
      console.log(`  ✅ [PASS] ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${msg}`);
      throw new Error(`Test failed: ${msg}`);
    }
  }

  // --- TEST 1: Navbar.tsx Funds Pill Container ---
  console.log('--- TEST 1: Píldora de Fondos en Navbar.tsx ---');
  const navbar = fs.readFileSync('./src/components/Navbar.tsx', 'utf8');
  assert(navbar.includes('flex items-center flex-row gap-1'), 'Navbar usa flex items-center flex-row gap-1');
  assert(navbar.includes('font-bold text-emerald-400 font-mono whitespace-nowrap'), 'Navbar usa font-bold font-mono whitespace-nowrap para $ y cifra');
  assert(navbar.includes('{formatMoney(player.stats.funds)}'), 'Navbar formatea con formatMoney(player.stats.funds) de forma atómica');

  // --- TEST 2: LifestyleShopView.tsx Balance Card ---
  console.log('\n--- TEST 2: Tarjeta de Fondos en LifestyleShopView.tsx ---');
  const lifestyle = fs.readFileSync('./src/components/LifestyleShopView.tsx', 'utf8');
  assert(lifestyle.includes('flex items-center flex-row gap-3.5'), 'LifestyleShopView usa flex items-center flex-row con gap consistente');
  assert(lifestyle.includes('text-2xl font-bold text-emerald-400 font-mono tracking-tight whitespace-nowrap inline-flex items-center'), 'LifestyleShopView usa font-mono font-bold whitespace-nowrap');
  assert(lifestyle.includes('{formatMoney(player.stats.funds)}'), 'LifestyleShopView renderiza formatMoney(player.stats.funds)');

  // --- TEST 3: FinancialLedgerModal.tsx ---
  console.log('\n--- TEST 3: Saldo Disponible en FinancialLedgerModal.tsx ---');
  const ledger = fs.readFileSync('./src/components/FinancialLedgerModal.tsx', 'utf8');
  assert(ledger.includes('font-bold text-[#F8FAFC] font-mono tracking-tight mt-0.5 block whitespace-nowrap'), 'FinancialLedgerModal usa font-mono font-bold whitespace-nowrap');

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS CASOS DE PRUEBA PASARON (${passed}/${total})`);
  console.log('================================================================\n');
}

runFundsPillTests();
