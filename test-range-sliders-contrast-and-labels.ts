import fs from 'fs';

function runRangeSlidersTests() {
  console.log('================================================================');
  console.log('🧪 TEST: CONTRASTE, TRACK Y ETIQUETAS DE INPUT RANGE SLIDERS');
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

  // --- TEST 1: Verificar index.css para estilos de track y contraste ---
  console.log('--- TEST 1: Estilos de Track y Thumb en index.css ---');
  const indexCss = fs.readFileSync('./src/index.css', 'utf8');
  assert(indexCss.includes('input[type="range"]'), 'index.css contiene reglas para input[type="range"]');
  assert(indexCss.includes('background: #1e293b') || indexCss.includes('bg-slate-800'), 'Track de input range configurado con fondo slate (#1e293b)');
  assert(indexCss.includes('-webkit-slider-runnable-track'), 'Track soporta -webkit-slider-runnable-track');
  assert(indexCss.includes('-moz-range-track'), 'Track soporta -moz-range-track');

  // --- TEST 2: Sliders en StudioView (Singles) ---
  console.log('\n--- TEST 2: Sliders de Singles en StudioView.tsx ---');
  const studioView = fs.readFileSync('./src/components/StudioView.tsx', 'utf8');
  assert(studioView.includes('grid-cols-1 sm:grid-cols-2'), 'Grid responsive evita colapso en resoluciones intermedias');
  assert(studioView.includes('bg-slate-800'), 'Inputs usan bg-slate-800 para contraste visible');
  assert(studioView.includes('border border-[#3E4556]'), 'Inputs tienen borde de contención sutil border-[#3E4556]');
  assert(studioView.includes('$25.000'), 'Marcas de valores máximo ($25.000) presentes en singles');
  assert(studioView.includes('$12.500'), 'Marca intermedia ($12.500) presente en singles');

  // --- TEST 3: Sliders en StudioView (Álbumes) ---
  console.log('\n--- TEST 3: Sliders de Álbumes en StudioView.tsx ---');
  assert(studioView.includes('$60.000'), 'Marcas de valores máximo ($60.000) presentes en álbumes');
  assert(studioView.includes('$3.000') || studioView.includes('$2.000'), 'Marcas mínimas presentes en álbumes');

  // --- TEST 4: Sliders en CollaborationModal ---
  console.log('\n--- TEST 4: Sliders en CollaborationModal.tsx ---');
  const collabModal = fs.readFileSync('./src/components/CollaborationModal.tsx', 'utf8');
  assert(collabModal.includes('grid-cols-1 sm:grid-cols-2'), 'CollaborationModal usa layout responsive en sliders');
  assert(collabModal.includes('bg-slate-800'), 'CollaborationModal usa bg-slate-800 en sliders');
  assert(collabModal.includes('$30.000'), 'Marcas de valores máximo ($30.000) presentes en colaboración');

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS CASOS DE PRUEBA PASARON (${passed}/${total})`);
  console.log('================================================================\n');
}

runRangeSlidersTests();
