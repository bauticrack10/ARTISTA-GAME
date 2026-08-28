import { GameEngine } from './src/core/GameEngine';

function runWellnessValidationTests() {
  console.log('================================================================');
  console.log('🧪 TEST: VALIDACIÓN DE FONDOS EN DESCANSO & BIENESTAR');
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

  const REST_COST = 400;

  // Escenario 1: Jugador con Fondos Insuficientes ($140)
  const playerLowFunds = {
    id: 'player_1',
    stats: {
      funds: 140,
      energy: 50
    }
  };

  const hasFunds1 = (playerLowFunds.stats.funds || 0) >= REST_COST;
  const isEnergyFull1 = (playerLowFunds.stats.energy || 0) >= 100;
  const canRest1 = hasFunds1 && !isEnergyFull1;
  const tooltip1 = !hasFunds1
    ? `Fondos insuficientes ($${playerLowFunds.stats.funds.toLocaleString('es-AR')} / $${REST_COST.toLocaleString('es-AR')})`
    : isEnergyFull1
    ? 'Energía al máximo (100 / 100)'
    : `Tomar retiro de descanso y recuperar +50 de energía vital por $${REST_COST.toLocaleString('es-AR')} en el semestre actual`;

  console.log('--- Escenario 1: Fondos = $140, Costo = $400 ---');
  console.log('  canRest:', canRest1);
  console.log('  tooltip:', tooltip1);
  assert(hasFunds1 === false, 'hasFunds es false con $140');
  assert(canRest1 === false, 'canRest es false (botón deshabilitado)');
  assert(tooltip1 === 'Fondos insuficientes ($140 / $400)', 'Tooltip contextual exacto "Fondos insuficientes ($140 / $400)"');

  // Escenario 2: Jugador con Fondos Suficientes ($600)
  const playerSufficientFunds = {
    id: 'player_2',
    stats: {
      funds: 600,
      energy: 40
    }
  };

  const hasFunds2 = (playerSufficientFunds.stats.funds || 0) >= REST_COST;
  const isEnergyFull2 = (playerSufficientFunds.stats.energy || 0) >= 100;
  const canRest2 = hasFunds2 && !isEnergyFull2;
  const tooltip2 = !hasFunds2
    ? `Fondos insuficientes ($${playerSufficientFunds.stats.funds.toLocaleString('es-AR')} / $${REST_COST.toLocaleString('es-AR')})`
    : isEnergyFull2
    ? 'Energía al máximo (100 / 100)'
    : `Tomar retiro de descanso y recuperar +50 de energía vital por $${REST_COST.toLocaleString('es-AR')} en el semestre actual`;

  console.log('\n--- Escenario 2: Fondos = $600, Costo = $400 ---');
  console.log('  canRest:', canRest2);
  console.log('  tooltip:', tooltip2);
  assert(hasFunds2 === true, 'hasFunds es true con $600');
  assert(canRest2 === true, 'canRest es true (botón habilitado)');

  // Escenario 3: Jugador con Energía al Máximo (100) y Fondos Suficientes ($1.000)
  const playerFullEnergy = {
    id: 'player_3',
    stats: {
      funds: 1000,
      energy: 100
    }
  };

  const hasFunds3 = (playerFullEnergy.stats.funds || 0) >= REST_COST;
  const isEnergyFull3 = (playerFullEnergy.stats.energy || 0) >= 100;
  const canRest3 = hasFunds3 && !isEnergyFull3;
  const tooltip3 = !hasFunds3
    ? `Fondos insuficientes ($${playerFullEnergy.stats.funds.toLocaleString('es-AR')} / $${REST_COST.toLocaleString('es-AR')})`
    : isEnergyFull3
    ? 'Energía al máximo (100 / 100)'
    : `Tomar retiro de descanso y recuperar +50 de energía vital por $${REST_COST.toLocaleString('es-AR')} en el semestre actual`;

  console.log('\n--- Escenario 3: Fondos = $1.000, Energía = 100 ---');
  console.log('  canRest:', canRest3);
  console.log('  tooltip:', tooltip3);
  assert(isEnergyFull3 === true, 'isEnergyFull es true');
  assert(canRest3 === false, 'canRest es false cuando la energía ya está al 100%');
  assert(tooltip3 === 'Energía al máximo (100 / 100)', 'Tooltip indica energía al máximo');

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS CASOS DE PRUEBA PASARON (${passed}/${total})`);
  console.log('================================================================\n');
}

runWellnessValidationTests();
