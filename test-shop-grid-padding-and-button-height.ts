import fs from 'fs';

function runShopGridAndButtonsTests() {
  console.log('================================================================');
  console.log('🧪 TEST: PADDING DE GRILLA Y ALTURA DE BOTONES EN TIENDA');
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

  const lifestyleCode = fs.readFileSync('./src/components/LifestyleShopView.tsx', 'utf8');

  // --- TEST 1: Padding inferior del contenedor principal ---
  console.log('--- TEST 1: Padding del Contenedor Principal ---');
  assert(lifestyleCode.includes('pb-24') || lifestyleCode.includes('pb-28') || lifestyleCode.includes('pb-32'), 'Contenedor principal incluye padding inferior extendido (pb-24/pb-28/pb-32)');

  // --- TEST 2: Padding inferior de la grilla de productos ---
  console.log('\n--- TEST 2: Padding de la Grilla de Productos ---');
  assert(lifestyleCode.includes('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-16'), 'Grilla de productos tiene pb-16 para holgura de scroll y evitar recortes');

  // --- TEST 3: Altura fija y shrink-0 en botones de acción ---
  console.log('\n--- TEST 3: Botones de Acción en Card Footer ---');
  assert(lifestyleCode.includes('h-10 min-h-[40px]'), 'Botones de acción tienen altura fija h-10 y min-h-[40px]');
  assert(lifestyleCode.includes('whitespace-nowrap shrink-0'), 'Botones tienen whitespace-nowrap y shrink-0 para evitar deformación o aplastamiento');
  assert(lifestyleCode.includes('Comprar Mejora'), 'Botón renderiza "Comprar Mejora"');
  assert(lifestyleCode.includes('Fondos Insuficientes'), 'Botón renderiza "Fondos Insuficientes"');
  assert(lifestyleCode.includes('Adquirido ✓'), 'Botón renderiza "Adquirido ✓"');

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS CASOS DE PRUEBA PASARON (${passed}/${total})`);
  console.log('================================================================\n');
}

runShopGridAndButtonsTests();
