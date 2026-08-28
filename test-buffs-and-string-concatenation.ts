import { sanitizeString, formatTourFatigueBuff, formatQualityBuff, formatPassiveEnergyBuff } from './src/utils/formatters';
import fs from 'fs';

function runBuffsAndStringsTests() {
  console.log('================================================================');
  console.log('🧪 TEST: FORMATO DE BUFFS Y SANITIZACIÓN DE PLANTILLAS DINÁMICAS');
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

  // --- TEST 1: Sanitización de Espacios en $ y Moneda ---
  console.log('--- TEST 1: Saldo y Moneda ---');
  const res1 = sanitizeString('Con saldo actual de $ 140');
  console.log(`  "Con saldo actual de $ 140" -> "${res1}"`);
  assert(res1 === 'Con saldo actual de $140', 'Elimina espacio entre $ y monto');

  // --- TEST 2: Conteos en Paréntesis ---
  console.log('\n--- TEST 2: Conteos en Paréntesis ---');
  const res2 = sanitizeString('( 0 activos)');
  console.log(`  "( 0 activos)" -> "${res2}"`);
  assert(res2 === '(0 activos)', 'Normaliza "( 0 activos)" a "(0 activos)"');

  const res3 = sanitizeString('( 0 ADQUIRIDOS)');
  console.log(`  "( 0 ADQUIRIDOS)" -> "${res3}"`);
  assert(res3 === '(0 ADQUIRIDOS)', 'Normaliza "( 0 ADQUIRIDOS)" a "(0 ADQUIRIDOS)"');

  // --- TEST 3: Sufijos /mes y Signos + con Números ---
  console.log('\n--- TEST 3: Sufijos y Modificadores ---');
  const res4 = sanitizeString('+ 0 / mes');
  console.log(`  "+ 0 / mes" -> "${res4}"`);
  assert(res4 === '+0/mes', 'Normaliza "+ 0 / mes" a "+0/mes"');

  const res5 = sanitizeString('+ 0 Calidad');
  console.log(`  "+ 0 Calidad" -> "${res5}"`);
  assert(res5 === '+0 Calidad', 'Normaliza "+ 0 Calidad" a "+0 Calidad"');

  // --- TEST 4: Formato de Mitigación de Gira / Fatiga ---
  console.log('\n--- TEST 4: Formato de Buff de Fatiga ---');
  const fatigue0 = formatTourFatigueBuff(0);
  console.log(`  formatTourFatigueBuff(0) -> "${fatigue0}"`);
  assert(fatigue0 === '0% Fatiga', 'Retorna "0% Fatiga" en lugar de "-0% Fatiga"');

  const fatigue15 = formatTourFatigueBuff(0.15);
  console.log(`  formatTourFatigueBuff(0.15) -> "${fatigue15}"`);
  assert(fatigue15 === '-15% Fatiga', 'Retorna "-15% Fatiga" para 15% de reducción');

  // --- TEST 5: Helpers de Calidad y Energía ---
  console.log('\n--- TEST 5: Helpers de Calidad y Energía ---');
  assert(formatQualityBuff(0) === '+0 Calidad', 'formatQualityBuff(0) retorna "+0 Calidad"');
  assert(formatQualityBuff(4) === '+4 Calidad', 'formatQualityBuff(4) retorna "+4 Calidad"');
  assert(formatPassiveEnergyBuff(0) === '+0/mes', 'formatPassiveEnergyBuff(0) retorna "+0/mes"');
  assert(formatPassiveEnergyBuff(5) === '+5/mes', 'formatPassiveEnergyBuff(5) retorna "+5/mes"');

  // --- TEST 6: Verificación en LifestyleShopView.tsx ---
  console.log('\n--- TEST 6: Verificación en LifestyleShopView.tsx ---');
  const lifestyleCode = fs.readFileSync('./src/components/LifestyleShopView.tsx', 'utf8');
  assert(lifestyleCode.includes('{`Con saldo actual de ${formatMoney(player.stats.funds)}`}'), 'LifestyleShopView usa plantilla sin espacio entre $ y monto');
  assert(lifestyleCode.includes('{`${formatMoney(operationalCosts.monthlyUpkeep)}/mes (${ownedUpgrades.length} activos)`}'), 'LifestyleShopView usa /mes sin espacios');
  assert(lifestyleCode.includes('{`+${activeBuffs.qualityBonus} Calidad`}'), 'LifestyleShopView interpola calidad sin espacio');
  assert(lifestyleCode.includes('{`+${activeBuffs.passiveEnergy}/mes`}'), 'LifestyleShopView interpola energía sin espacio');
  assert(lifestyleCode.includes("'0% Fatiga'"), 'LifestyleShopView maneja 0% Fatiga explícitamente');

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS CASOS DE PRUEBA PASARON (${passed}/${total})`);
  console.log('================================================================\n');
}

runBuffsAndStringsTests();
