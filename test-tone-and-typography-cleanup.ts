import fs from 'fs';
import { sanitizeString, cleanParentheses } from './src/utils/formatters';

function runToneAndTypographyTests() {
  console.log('================================================================');
  console.log('🧪 TEST: UNIFICACIÓN DE TONO Y SANITIZACIÓN TIPOGRÁFICA');
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

  // --- TEST 1: Sanitización de Catálogo y Paréntesis ---
  console.log('--- TEST 1: Sanitización de Espacios en Paréntesis ---');
  const res1 = sanitizeString("Catálogo (2 )");
  const res1Clean = cleanParentheses("Catálogo (2 )");
  console.log('  Catálogo (2 ) ->', res1);
  assert(res1 === "Catálogo (2)", 'sanitizeString transforma "Catálogo (2 )" en "Catálogo (2)"');
  assert(res1Clean === "Catálogo (2)", 'cleanParentheses transforma "Catálogo (2 )" en "Catálogo (2)"');

  // --- TEST 2: Sanitización de Dirección Sónica ---
  console.log('\n--- TEST 2: Dirección Sónica con Espacios Internos ---');
  const res2 = sanitizeString("DIRECCIÓN SÓNICA DE LA ERA ( TRAP LATINO )");
  const res2Clean = cleanParentheses("DIRECCIÓN SÓNICA DE LA ERA ( TRAP LATINO )");
  console.log('  DIRECCIÓN SÓNICA DE LA ERA ( TRAP LATINO ) ->', res2);
  assert(res2 === "DIRECCIÓN SÓNICA DE LA ERA (TRAP LATINO)", 'sanitizeString transforma "DIRECCIÓN SÓNICA DE LA ERA ( TRAP LATINO )" en "DIRECCIÓN SÓNICA DE LA ERA (TRAP LATINO)"');
  assert(res2Clean === "DIRECCIÓN SÓNICA DE LA ERA (TRAP LATINO)", 'cleanParentheses transforma "( TRAP LATINO )" en "(TRAP LATINO)"');

  // --- TEST 3: Sanitización de Fracciones y Ratios ( 80 /100) ---
  console.log('\n--- TEST 3: Normalización de Ratios y Fracciones ---');
  const res3 = sanitizeString("( 80 /100)");
  const res3Clean = cleanParentheses("( 80 /100)");
  console.log('  ( 80 /100) ->', res3);
  assert(res3 === "(80/100)", 'sanitizeString transforma "( 80 /100)" en "(80/100)"');
  assert(res3Clean === "(80/100)", 'cleanParentheses transforma "( 80 /100)" en "(80/100)"');

  const res4 = sanitizeString("( 80 / 100 )");
  const res4Clean = cleanParentheses("( 80 / 100 )");
  console.log('  ( 80 / 100 ) ->', res4);
  assert(res4 === "(80/100)", 'sanitizeString transforma "( 80 / 100 )" en "(80/100)"');
  assert(res4Clean === "(80/100)", 'cleanParentheses transforma "( 80 / 100 )" en "(80/100)"');

  // --- TEST 4: Verificación de Texto en StudioView (Visual Lab) ---
  console.log('\n--- TEST 4: Tono Unificado en Visual Lab (StudioView.tsx) ---');
  const studioViewContent = fs.readFileSync('./src/components/StudioView.tsx', 'utf8');
  assert(studioViewContent.includes('Rueda una pieza audiovisual cinematográfica'), 'StudioView contiene "Rueda una pieza audiovisual cinematográfica"');
  assert(!studioViewContent.includes('Rodá una pieza audiovisual cinematográfica'), 'StudioView NO contiene "Rodá una pieza audiovisual cinematográfica"');

  // --- TEST 5: Verificación de Tono en ActiveCatalogCard y CareerErasView ---
  console.log('\n--- TEST 5: Tono Unificado en ActiveCatalogCard y CareerErasView ---');
  const activeCatalogContent = fs.readFileSync('./src/components/ActiveCatalogCard.tsx', 'utf8');
  assert(activeCatalogContent.includes('Entra al estudio de grabación, define tu dirección sonora y publica tu primer single'), 'ActiveCatalogCard usa tuteo neutro ("Entra", "define", "publica")');

  const careerErasContent = fs.readFileSync('./src/components/CareerErasView.tsx', 'utf8');
  assert(careerErasContent.includes('Revisa la cronología completa'), 'CareerErasView usa "Revisa"');
  assert(careerErasContent.includes('Lanza tu primer álbum o EP'), 'CareerErasView usa "Lanza"');

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS CASOS DE PRUEBA PASARON (${passed}/${total})`);
  console.log('================================================================\n');
}

runToneAndTypographyTests();
