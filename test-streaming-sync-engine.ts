import { StreamingEngine } from './src/systems/StreamingEngine';
import { GameEngine } from './src/core/GameEngine';
import { CORE_EVENT_TEMPLATES } from './src/data/eventTemplates';

function runStreamingAndSyncTests() {
  console.log('================================================================');
  console.log('🧪 INICIANDO TEST SUITE: STREAMING ENGINE & AUDIENCE SYNC');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, msg: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${msg}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${msg}`);
      throw new Error(`Test failed: ${msg}`);
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: calculateMonthlyListeners con catálogo activo
  // --------------------------------------------------------------------------
  console.log('--- TEST 1: calculateMonthlyListeners (Catálogo Activo) ---');
  
  // 1.1 Artista Emergente: 50,000 streams mensuales, 5,000 fans, Pop 25, Hype 50, Loyalty 70
  const emergingListeners = StreamingEngine.calculateMonthlyListeners(50000, 25, 5000, 70, 50, true);
  console.log(`  Emerging (50k streams, 5k fans): ${emergingListeners.toLocaleString()} oyentes`);
  assert(emergingListeners >= 12000 && emergingListeners <= 20000, 'Emerging listeners coherentes (~2.5 a 4.0 streams/oyente)');
  const streamRatioEmerging = 50000 / emergingListeners;
  assert(streamRatioEmerging >= 2.5 && streamRatioEmerging <= 4.0, `Streams/oyente en ratio esperado: ${streamRatioEmerging.toFixed(2)}`);

  // 1.2 Artista Consagrado: 50,000,000 streams mensuales, 10,000,000 fans, Pop 90, Hype 80, Loyalty 85
  const superstarListeners = StreamingEngine.calculateMonthlyListeners(50000000, 90, 10000000, 85, 80, true);
  console.log(`  Superstar (50M streams, 10M fans): ${superstarListeners.toLocaleString()} oyentes`);
  assert(superstarListeners >= 11000000 && superstarListeners <= 18000000, 'Superstar listeners coherentes en escala Spotify');
  const streamRatioSuperstar = 50000000 / superstarListeners;
  assert(streamRatioSuperstar >= 2.8 && streamRatioSuperstar <= 4.5, `Superstar ratio esperado: ${streamRatioSuperstar.toFixed(2)}`);

  // --------------------------------------------------------------------------
  // TEST 2: calculateMonthlyListeners sin catálogo lanzado (0 exacto)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2: calculateMonthlyListeners (Sin catálogo / 0 streams = 0 oyentes) ---');
  
  const underListeners = StreamingEngine.calculateMonthlyListeners(0, 8, 150, 45, 15, false);
  console.log(`  Underground sin catálogo: ${underListeners} oyentes`);
  assert(underListeners === 0, 'Underground sin canciones lanzadas da 0 oyentes exactos');

  const tiktokViralListeners = StreamingEngine.calculateMonthlyListeners(0, 25, 15000, 75, 80, false);
  console.log(`  TikTok Viral Pre-Single sin catálogo: ${tiktokViralListeners} oyentes`);
  assert(tiktokViralListeners === 0, 'Viral sin canciones lanzadas da 0 oyentes exactos');

  const zeroStreamsWithCatalog = StreamingEngine.calculateMonthlyListeners(0, 20, 1000, 70, 50, true);
  assert(zeroStreamsWithCatalog === 0, '0 streams con catálogo activo da 0 oyentes');

  // --------------------------------------------------------------------------
  // TEST 3: syncAudienceMetrics en GameEngine (Nuevo Jugador Sin Catálogo)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 3: syncAudienceMetrics en GameEngine (Nuevo Jugador) ---');
  
  const engineUnder = new GameEngine({
    name: 'Papo Underground',
    stats: {
      popularity: 8,
      reputation: 15,
      artisticCredibility: 20,
      energy: 100,
      funds: 500,
      fansCount: 150,
      fanbaseLoyalty: 45,
      hype: 15
    } as any
  });

  const playerUnder = engineUnder.getPlayer();
  console.log(`  Player inicial: ${playerUnder.stats.fansCount} fans, ${playerUnder.stats.monthlyListeners} oyentes, ${playerUnder.stats.totalStreams} streams`);
  assert(playerUnder.stats.monthlyListeners === 0, 'Oyentes iniciales son exactamente 0 al empezar sin temas');
  assert(playerUnder.stats.totalStreams === 0, 'Total streams iniciales son exactamente 0 al empezar sin temas');

  // --------------------------------------------------------------------------
  // TEST 4: advanceCycle sin catálogo (Sin NaN ni errores matemáticos)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 4: advanceCycle para jugador nuevo sin canciones ---');

  // Avanzar 2 semestres (1 año completo) sin haber lanzado canciones
  engineUnder.advanceCycle(6);
  engineUnder.advanceCycle(6);

  const playerAfter1Year = engineUnder.getPlayer();
  console.log(`  Tras 1 año sin temas: Pop ${playerAfter1Year.stats.popularity}, Fans ${playerAfter1Year.stats.fansCount}, Oyentes ${playerAfter1Year.stats.monthlyListeners}, Streams ${playerAfter1Year.stats.totalStreams}, Fondos $${playerAfter1Year.stats.funds}`);

  assert(playerAfter1Year.stats.monthlyListeners === 0, 'Oyentes se mantienen en 0 exacto sin catálogo');
  assert(playerAfter1Year.stats.totalStreams === 0, 'Streams se mantienen en 0 exacto sin catálogo');
  assert(!isNaN(playerAfter1Year.stats.popularity), 'Popularidad no es NaN');
  assert(!isNaN(playerAfter1Year.stats.funds), 'Fondos no son NaN');
  assert(!isNaN(playerAfter1Year.stats.fansCount), 'FansCount no es NaN');
  assert(!isNaN(playerAfter1Year.stats.energy), 'Energy no es NaN');
  assert(!isNaN(playerAfter1Year.stats.hype), 'Hype no es NaN');

  // --------------------------------------------------------------------------
  // TEST 5: syncAudienceMetrics tras lanzar primer Single
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 5: Lanzamiento de Debut y Activación de Métricas ---');

  const engineArtist = new GameEngine({
    name: 'Duki Test',
    stats: {
      popularity: 30,
      reputation: 45,
      artisticCredibility: 70,
      energy: 100,
      funds: 10000,
      fansCount: 8000,
      fanbaseLoyalty: 75,
      hype: 60
    } as any
  });

  assert(engineArtist.getPlayer().stats.monthlyListeners === 0, 'Oyentes iniciales en 0 antes de lanzar');

  // Lanzar un single para tener catálogo
  const single = engineArtist.releaseSong({
    title: 'Goteo Test',
    genreId: 'trap_latino',
    subGenreIds: ['hip_hop_rap'],
    featuredArtistIds: [],
    budgetProduction: 2000,
    budgetMarketing: 3000,
    longevityCurve: 'steady'
  });

  console.log(`  Single lanzado: "${single.title}". Oyentes post-lanzamiento: ${engineArtist.getPlayer().stats.monthlyListeners.toLocaleString()}`);
  assert(engineArtist.getPlayer().stats.monthlyListeners > 1000, 'Oyentes reactivos tras lanzamiento (>1000)');

  // Inyectar impulso viral de 50,000 streams
  const initialStreams = single.streamsTotal;
  const syncRes = engineArtist.syncAudienceMetrics(engineArtist.getPlayer(), engineArtist.getPlayerSongs(), 50000);
  console.log(`  Post Viral Boost: ${syncRes.monthlyListeners.toLocaleString()} oyentes, ${syncRes.totalStreams.toLocaleString()} streams`);
  
  assert(single.streamsTotal >= initialStreams + 30000, 'Tema principal absorbió el 65% del impulso viral');
  assert(single.wentViral === true, 'Tema marcado como viral tras superar el umbral');
  assert(syncRes.monthlyListeners >= 13500, 'Oyentes mensuales aumentaron reactivamente');

  // --------------------------------------------------------------------------
  // TEST 6: Resolución de Evento Viral (evt_viral_clip_tiktok)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 6: Evento Viral evt_viral_clip_tiktok ---');

  const viralEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_viral_clip_tiktok');
  assert(!!viralEvt, 'Template evt_viral_clip_tiktok existe en CORE_EVENT_TEMPLATES');

  if (viralEvt) {
    (engineArtist as any).currentEvent = viralEvt;
    const initialFans = engineArtist.getPlayer().stats.fansCount;
    const initialListeners = engineArtist.getPlayer().stats.monthlyListeners;
    const initialTotalStreams = engineArtist.getPlayer().stats.totalStreams;

    // Ejecutar opción 0: 'c_ride_wave' (+12,000 fans, +25 Hype, +8 Popularidad)
    const outcome = engineArtist.resolveCurrentEventChoice(0);
    assert(outcome !== null, 'Elección resuelta exitosamente');
    
    const postPlayer = engineArtist.getPlayer();
    console.log(`  Post Evento: Fans ${initialFans} -> ${postPlayer.stats.fansCount} (+12k)`);
    console.log(`  Post Evento: Oyentes ${initialListeners} -> ${postPlayer.stats.monthlyListeners}`);
    console.log(`  Post Evento: Streams ${initialTotalStreams} -> ${postPlayer.stats.totalStreams}`);

    assert(postPlayer.stats.fansCount === initialFans + 12000, 'Fans incrementados exactamente');
    assert(postPlayer.stats.totalStreams > initialTotalStreams + 30000, 'Streams virales inyectados al catálogo');
    assert(postPlayer.stats.monthlyListeners > initialListeners, 'Oyentes mensuales recalculados de inmediato');
  }

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS TESTS PASARON EXITOSAMENTE (${passedTests}/${totalTests})`);
  console.log('================================================================\n');
}

runStreamingAndSyncTests();
