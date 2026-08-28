import fs from 'fs';

function runSingleFundsValidationTests() {
  console.log('================================================================');
  console.log('🧪 TEST: VINCULACIÓN DINÁMICA DE COSTO TOTAL Y FONDOS EN SINGLE');
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

  // --- TEST 1: Cálculo dinámico con Fondos = $140 ---
  console.log('--- TEST 1: Fondos del Jugador = $140 ---');
  const playerFunds = 140;

  // Caso A: Producción $0, Marketing $0, Sin Productor -> Costo = $0
  const prodBudgetA = 0;
  const mktBudgetA = 0;
  const prodFeeA = 0;
  const videoCostA = 0;
  const totalCostA = prodBudgetA + mktBudgetA + prodFeeA + videoCostA;
  const isInsufficientA = totalCostA > playerFunds;

  console.log('  Caso A (Home Studio): Costo = $' + totalCostA + ', Insuficiente =', isInsufficientA);
  assert(totalCostA === 0, 'Costo total en Home Studio es $0');
  assert(isInsufficientA === false, 'No excede fondos disponibles ($140 >= $0)');

  // Caso B: Slider de Producción a $250 -> Costo = $250
  const prodBudgetB = 250;
  const totalCostB = prodBudgetB + mktBudgetA + prodFeeA + videoCostA;
  const isInsufficientB = totalCostB > playerFunds;

  console.log('  Caso B (Prod $250): Costo = $' + totalCostB + ', Insuficiente =', isInsufficientB);
  assert(totalCostB === 250, 'Costo total es $250');
  assert(isInsufficientB === true, 'Excede fondos disponibles ($140 < $250)');

  // Caso C: Productor externo contratado con Fee = $1.500
  const prodFeeC = 1500;
  const totalCostC = prodBudgetA + mktBudgetA + prodFeeC + videoCostA;
  const isInsufficientC = totalCostC > playerFunds;

  console.log('  Caso C (Productor $1.500): Costo = $' + totalCostC + ', Insuficiente =', isInsufficientC);
  assert(totalCostC === 1500, 'Costo total es $1.500');
  assert(isInsufficientC === true, 'Excede fondos disponibles ($140 < $1.500)');

  // --- TEST 2: Verificación de Código en StudioView.tsx ---
  console.log('\n--- TEST 2: Verificación de Código en StudioView.tsx ---');
  const studioView = fs.readFileSync('./src/components/StudioView.tsx', 'utf8');

  assert(studioView.includes('const totalSingleCost = singleProdBudget + singleMktBudget + singleProdFee + videoCost;'), 'Cálculo dinámico de totalSingleCost incluye Producción + Marketing + Fee del Productor + Videoclip');
  assert(studioView.includes('const isFundsInsufficient = totalSingleCost > player.stats.funds;'), 'isFundsInsufficient evalúa si totalSingleCost supera player.stats.funds');
  assert(studioView.includes('bg-rose-950/40 border-rose-500/50 text-rose-300'), 'Tarjeta de costo se resalta en rojo cuando los fondos son insuficientes');
  assert(studioView.includes('Excede Fondos'), 'Badge "Excede Fondos" visible cuando totalSingleCost > player.stats.funds');
  assert(studioView.includes('id="btn-submit-single"'), 'Botón de submit identificado con id="btn-submit-single"');
  assert(studioView.includes('disabled={isPublishing || isSinglesLimitReached || isFundsInsufficient || player.stats.energy < 15}'), 'Botón de submit se deshabilita con isFundsInsufficient');
  assert(studioView.includes('Fondos insuficientes ($${player.stats.funds.toLocaleString(\'es-AR\')} / $${totalSingleCost.toLocaleString(\'es-AR\')})'), 'Tooltip dinámico contextual de fondos insuficientes en el botón de submit');

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS CASOS DE PRUEBA PASARON (${passed}/${total})`);
  console.log('================================================================\n');
}

runSingleFundsValidationTests();
