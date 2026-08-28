import {
  sanitizeString,
  cleanParentheses,
  cleanQuotes,
  cleanCountTag,
  formatCityCountry,
  formatMusicRegion,
  formatMusicRegionLabel,
  formatChartMilestoneHeadline,
  formatChartMilestoneBody,
  MUSIC_REGION_CONFIG
} from './src/utils/formatters';
import { ChartEngine } from './src/systems/ChartEngine';

function runTypographyAndRegionTests() {
  console.log('================================================================');
  console.log('🧪 INICIANDO TEST SUITE: SANITIZACIÓN TIPOGRÁFICA Y REGIONES');
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

  // --------------------------------------------------------------------------
  // TEST 1: Normalización de Regiones a Español Uniforme
  // --------------------------------------------------------------------------
  console.log('--- TEST 1: Normalización de Regiones a Español ---');
  assert(formatMusicRegion('Global') === 'Mundial', 'Global -> Mundial');
  assert(formatMusicRegion('LatinAmerica') === 'Latinoamérica', 'LatinAmerica -> Latinoamérica');
  assert(formatMusicRegion('Spain') === 'España', 'Spain -> España');
  assert(formatMusicRegion('Europe') === 'Europa', 'Europe -> Europa');
  assert(formatMusicRegion('USA') === 'EE. UU.', 'USA -> EE. UU.');
  assert(formatMusicRegion('Argentina') === 'Argentina', 'Argentina -> Argentina');
  assert(formatMusicRegion('Mexico') === 'México', 'Mexico -> México');

  // Labels con emojis/banderas
  assert(formatMusicRegionLabel('Global') === '🌍 Mundial Top 50', 'Label Global -> 🌍 Mundial Top 50');
  assert(formatMusicRegionLabel('LatinAmerica') === '🌎 Latinoamérica', 'Label LatinAmerica -> 🌎 Latinoamérica');
  assert(formatMusicRegionLabel('USA') === '🇺🇸 EE. UU.', 'Label USA -> 🇺🇸 EE. UU.');
  assert(formatMusicRegionLabel('Spain') === '🇪🇸 España', 'Label Spain -> 🇪🇸 España');
  assert(formatMusicRegionLabel('Europe') === '🇪🇺 Europa', 'Label Europe -> 🇪🇺 Europa');

  // --------------------------------------------------------------------------
  // TEST 2: Titulares y Cuerpos de Noticias de Charts en Español
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2: Titulares y Cuerpos de Noticias de Charts ---');
  const hGlobal = formatChartMilestoneHeadline('Global', 'Goteo', 'Duki');
  console.log('  Titular Global:', hGlobal);
  assert(hGlobal.includes('¡#1 a Nivel Mundial!'), 'Titular Global usa "¡#1 a Nivel Mundial!"');

  const hLatam = formatChartMilestoneHeadline('LatinAmerica', 'Luna', 'Feid');
  console.log('  Titular Latam:', hLatam);
  assert(hLatam.includes('¡#1 en Latinoamérica!'), 'Titular LatinAmerica usa "¡#1 en Latinoamérica!"');

  const hUsa = formatChartMilestoneHeadline('USA', 'Starboy', 'The Weeknd');
  console.log('  Titular USA:', hUsa);
  assert(hUsa.includes('¡#1 en EE. UU.!'), 'Titular USA usa "¡#1 en EE. UU.!"');

  const hSpain = formatChartMilestoneHeadline('Spain', 'Columbia', 'Quevedo');
  console.log('  Titular España:', hSpain);
  assert(hSpain.includes('¡#1 en España!'), 'Titular Spain usa "¡#1 en España!"');

  const bLatam = formatChartMilestoneBody('LatinAmerica');
  assert(bLatam.includes('en Latinoamérica'), 'Cuerpo de noticia usa "en Latinoamérica"');

  // --------------------------------------------------------------------------
  // TEST 3: Sanitización de Espacios Tipográficos Erróneos
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 3: Sanitización Tipográfica ---');

  // 1. Espacio antes de coma
  const s1 = sanitizeString("Buenos Aires , Argentina");
  console.log('  Sanitizado [Buenos Aires , Argentina] ->', s1);
  assert(s1 === "Buenos Aires, Argentina", 'Elimina espacio antes de la coma');

  const fc = formatCityCountry("Buenos Aires ", " Argentina");
  assert(fc === "Buenos Aires, Argentina", 'formatCityCountry genera formato limpio');

  // 2. Espacio dentro de paréntesis (+6M )
  const s2 = sanitizeString("(+6M )");
  console.log('  Sanitizado [(+6M )] ->', s2);
  assert(s2 === "(+6M)", 'Elimina espacio en (+6M ) -> (+6M)');

  const s2b = sanitizeString("(+ 6M )");
  assert(s2b === "(+6M)", 'Elimina espacio en (+ 6M ) -> (+6M)');

  // 3. Espacio en conteos: Ver Catálogo Completo (2 )
  const s3 = sanitizeString("Ver Catálogo Completo (2 )");
  console.log('  Sanitizado [Ver Catálogo Completo (2 )] ->', s3);
  assert(s3 === "Ver Catálogo Completo (2)", 'Elimina espacio en (2 )');

  const s3b = cleanParentheses("Ver Catálogo Completo ( 2 )");
  assert(s3b === "Ver Catálogo Completo (2)", 'cleanParentheses limpia espacios internos');

  // 4. Artefactos de comillas y asteriscos
  const s4 = sanitizeString('"Bruno Romero" *"*');
  console.log('  Sanitizado [\"Bruno Romero\" *\"*] ->', s4);
  assert(s4 === '"Bruno Romero"', 'Limpia asterisco-comillas huérfanas al final');

  const s4b = sanitizeString('*"Bruno Romero"*');
  assert(s4b === '"Bruno Romero"', 'Limpia asteriscos huérfanos alrededor');

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS TESTS PASARON EXITOSAMENTE (${passed}/${total})`);
  console.log('================================================================\n');
}

runTypographyAndRegionTests();
