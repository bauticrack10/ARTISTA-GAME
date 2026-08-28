import { GameEngine } from './src/core/GameEngine';
import { ChartEngine } from './src/systems/ChartEngine';
import { TimeSystem } from './src/systems/TimeSystem';
import { CORE_EVENT_TEMPLATES } from './src/data/eventTemplates';
import { generateUniqueSongTitle } from './src/data/proceduralNames';

function runValidationTests() {
  console.log('================================================================');
  console.log('🧪 INICIANDO TEST SUITE: PRENSA & NOTICIAS + CHARTS UNICITY');
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
  // TEST 1: TimeSystem Helpers de Temporalidad
  // --------------------------------------------------------------------------
  console.log('--- TEST 1: TimeSystem Helpers ---');
  assert(TimeSystem.getMonthName(7) === 'Julio', 'M 7 es Julio');
  assert(TimeSystem.getSemesterName(7).includes('2do Semestre'), 'M 7 es 2do Semestre');
  assert(TimeSystem.getTimingPhrase(7, 2026).includes('2do Semestre') || TimeSystem.getTimingPhrase(7, 2026).includes('mitad'), 'M 7 refleja mitad de año / 2do semestre');
  assert(!TimeSystem.getTimingPhrase(7, 2026).includes('finalizar el año'), 'M 7 NO dice finalizar el año');
  assert(TimeSystem.getTimingPhrase(12, 2026).includes('finalizar el año'), 'M 12 dice finalizar el año');

  // --------------------------------------------------------------------------
  // TEST 2: Evento Sequía Creativa y Textos Dinámicos
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2: Sequía Creativa & Temporalidad de Noticias ---');
  const droughtTemplate = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_creative_drought_mandatory');
  assert(!!droughtTemplate, 'Template evt_creative_drought_mandatory existe');

  if (droughtTemplate) {
    // Condition debe ser false para que selectNextEvent nunca lo elija al azar en ningún mes
    const condM7 = droughtTemplate.condition({ currentMonth: 7, currentYear: 2026, player: { stats: {} } } as any);
    assert(condM7 === false, 'evt_creative_drought_mandatory NO se dispara en selección aleatoria (Mes 7)');

    const condM12 = droughtTemplate.condition({ currentMonth: 12, currentYear: 2026, player: { stats: {} } } as any);
    assert(condM12 === false, 'evt_creative_drought_mandatory se activa exclusivamente vía getCreativeDroughtEvent');

    // Textos dinámicos en Mes 7 si se evalúa
    const descM7 = droughtTemplate.getDescription({ currentMonth: 7, currentYear: 2026, player: { name: 'Papo MC', stats: {}, city: 'Buenos Aires' } } as any);
    assert(!descM7.includes('Ha finalizado el año 2026'), 'Descripción en Mes 7 no afirma que finalizó el año');

    const choicesM7 = droughtTemplate.choices({ currentMonth: 7, currentYear: 2026, player: { name: 'Papo MC', stats: {}, personality: {} }, world: { songs: {} } } as any);
    const outcomeMasteredM7 = choicesM7[1].apply();
    assert(outcomeMasteredM7.newsGenerated !== undefined, 'Noticia generada en choice');
    if (outcomeMasteredM7.newsGenerated) {
      assert(!outcomeMasteredM7.newsGenerated.body.includes('Justo antes de finalizar el año'), 'Noticia en Mes 7 NO dice "Justo antes de finalizar el año"');
      assert(outcomeMasteredM7.newsGenerated.body.includes('Julio') || outcomeMasteredM7.newsGenerated.body.includes('2do Semestre') || outcomeMasteredM7.newsGenerated.body.includes('mitad'), 'Noticia en Mes 7 refleja temporada actual');
    }
  }

  // --------------------------------------------------------------------------
  // TEST 3: Generación de Títulos Únicos (Anti-colisión "Luna")
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 3: Generación de Títulos Únicos ---');
  const existingSongsMap: Record<string, any> = {
    song_1: { id: 'song_1', title: 'Luna' }
  };

  const dukiTitle = generateUniqueSongTitle({
    existingTitles: existingSongsMap,
    artistName: 'Duki',
    genreId: 'trap_latino',
    seedIndex: 1
  });

  const billieTitle = generateUniqueSongTitle({
    existingTitles: { ...existingSongsMap, song_2: { id: 'song_2', title: dukiTitle } },
    artistName: 'Billie Eilish',
    genreId: 'pop_moderno',
    seedIndex: 2
  });

  console.log(`  Duki song: "${dukiTitle}"`);
  console.log(`  Billie Eilish song: "${billieTitle}"`);
  assert(dukiTitle !== 'Luna', 'Duki no recibe "Luna" si ya existe en catálogo');
  assert(billieTitle !== dukiTitle, 'Billie Eilish y Duki generan títulos diferentes y únicos');
  assert(billieTitle !== 'Luna', 'Billie Eilish no colisiona con "Luna" existente');

  // --------------------------------------------------------------------------
  // TEST 4: Simulación de Motor y Validación de Charts
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 4: Integridad de Charts en Simulación de 12 Meses ---');
  const engine = new GameEngine();

  // Simular 2 semestres (1 año completo: 12 meses)
  engine.advanceCycle(6); // S1 -> M 7
  console.log(`  Estado tras 1er semestre: Año ${engine.getWorld().currentYear} • Mes ${engine.getWorld().currentMonth}`);
  assert(engine.getWorld().currentMonth === 7, 'Mes actual es 7 tras avanzar 6 meses');

  // Validar charts tras semestre 1
  const chartValS1 = ChartEngine.validateAllWorldCharts(engine.getWorld());
  assert(chartValS1.isValid, 'Todos los charts regionales en Mes 7 son 100% válidos (sin duplicados)');

  // Verificar que en cada región el puesto #1 es único y las posiciones son 1..N sin huecos
  for (const region of ChartEngine.REGIONS) {
    const chart = engine.getWorld().charts[region];
    assert(chart !== undefined, `Chart de ${region} existe`);
    if (chart && chart.entries.length > 0) {
      assert(chart.entries[0].rank === 1, `Rank 1 en ${region} existe y es el primero`);
      const no1Entries = chart.entries.filter(e => e.rank === 1);
      assert(no1Entries.length === 1, `Exactamente UNA canción en #1 en ${region} ("${no1Entries[0].title}" por ${no1Entries[0].artistName})`);

      // Verificar que todos los ranks 1..N son únicos
      const ranks = chart.entries.map(e => e.rank);
      const uniqueRanks = new Set(ranks);
      assert(ranks.length === uniqueRanks.size, `No hay posiciones duplicadas en ${region} (${ranks.length} entradas)`);
    }
  }

  // Avanzar segundo semestre
  engine.advanceCycle(6); // S2 -> Año siguiente, M 1
  console.log(`  Estado tras 2do semestre: Año ${engine.getWorld().currentYear} • Mes ${engine.getWorld().currentMonth}`);
  
  const chartValS2 = ChartEngine.validateAllWorldCharts(engine.getWorld());
  assert(chartValS2.isValid, 'Todos los charts regionales tras 1 año son válidos');

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS TESTS PASARON EXITOSAMENTE (${passed}/${total})`);
  console.log('================================================================\n');
}

runValidationTests();
