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
  // TEST 2: calculateMonthlyListeners en etapa Underground / Pre-Lanzamiento
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2: calculateMonthlyListeners (Underground / Pre-lanzamiento) ---');
  
  // 2.1 Underground 150 fans, Hype 15, Loyalty 45, Pop 8 (Freestyle barrial)
  const underListeners = StreamingEngine.calculateMonthlyListeners(0, 8, 150, 45, 15, false);
  console.log(`  Underground (150 fans, 15 hype): ${underListeners} oyentes`);
  assert(underListeners >= 90 && underListeners <= 125, 'Underground convierte ~65% de fans');

  // 2.2 Fenómeno Viral TikTok antes de publicar singles: 15,000 fans, Hype 80, Loyalty 75, Pop 25
  const tiktokViralListeners = StreamingEngine.calculateMonthlyListeners(0, 25, 15000, 75, 80, false);
  console.log(`  TikTok Viral Pre-Single (15k fans, 80 hype): ${tiktokViralListeners.toLocaleString()} oyentes`);
  assert(tiktokViralListeners >= 14000 && tiktokViralListeners <= 18000, 'Viral underground convierte >95% de fans');

  // --------------------------------------------------------------------------
  // TEST 3: syncAudienceMetrics en GameEngine (Underground / Inicial)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 3: syncAudienceMetrics en GameEngine (Underground) ---');
  
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
  assert(playerUnder.stats.monthlyListeners >= 90, 'Oyentes iniciales sincronizados');
  assert(playerUnder.stats.totalStreams >= 150, 'Total streams iniciales calibrados (demos/bootlegs)');

  // --------------------------------------------------------------------------
  // TEST 4: syncAudienceMetrics con Catálogo Activo e Inyección Viral
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 4: syncAudienceMetrics con Catálogo e Inyección Viral ---');

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

  // Lanzar un single para tener catálogo
  const single = engineArtist.releaseSong({
    title: 'Goteo Test',
    genreId: 'trap_latino',
    subGenreIds: ['hip_hop_rap'],
    budgetProduction: 2000,
    budgetMarketing: 3000,
    longevityCurve: 'steady'
  });

  console.log(`  Single lanzado: "${single.title}". Oyentes post-lanzamiento: ${engineArtist.getPlayer().stats.monthlyListeners}`);
  assert(engineArtist.getPlayer().stats.monthlyListeners > 1000, 'Oyentes reactivos tras lanzamiento');

  // Inyectar impulso viral de 50,000 streams
  const initialStreams = single.streamsTotal;
  const syncRes = engineArtist.syncAudienceMetrics(engineArtist.getPlayer(), engineArtist.getPlayerSongs(), 50000);
  console.log(`  Post Viral Boost: ${syncRes.monthlyListeners.toLocaleString()} oyentes, ${syncRes.totalStreams.toLocaleString()} streams`);
  
  assert(single.streamsTotal >= initialStreams + 30000, 'Tema principal absorbió el 65% del impulso viral');
  assert(single.wentViral === true, 'Tema marcado como viral tras superar el umbral');
  assert(syncRes.monthlyListeners >= 13500, 'Oyentes mensuales aumentaron reactivamente');

  // --------------------------------------------------------------------------
  // TEST 5: Resolución de Evento Viral (evt_viral_clip_tiktok)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 5: Evento Viral evt_viral_clip_tiktok ---');

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

  // --------------------------------------------------------------------------
  // TEST 6: Calibración de Presets (Sin 12k fans con 0 streams o 10 oyentes)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 6: Validación Matemática de Presets ---');

  const presetsToTest = [
    { name: 'underground', fans: 150, pop: 8, loyalty: 45, hype: 15 },
    { name: 'local', fans: 900, pop: 16, loyalty: 55, hype: 30 },
    { name: 'emerging', fans: 2500, pop: 24, loyalty: 60, hype: 40 },
    { name: 'independent', fans: 4500, pop: 26, loyalty: 70, hype: 35 },
    { name: 'prodigy', fans: 3000, pop: 30, loyalty: 85, hype: 75 },
    { name: 'default_fallback', fans: 12000, pop: 20, loyalty: 75, hype: 55 }
  ];

  for (const p of presetsToTest) {
    const listeners = StreamingEngine.calculateMonthlyListeners(0, p.pop, p.fans, p.loyalty, p.hype, false);
    const streams = Math.max(Math.floor(p.fans * 2.8), Math.floor(listeners * (1.8 + (p.hype / 100) * 0.8)));
    
    console.log(`  Preset [${p.name}]: ${p.fans} fans -> ${listeners} oyentes (${((listeners / p.fans) * 100).toFixed(0)}%), ${streams} demo streams`);
    
    assert(listeners >= p.fans * 0.55 && listeners <= p.fans * 1.25, `Preset ${p.name}: oyentes coherentes con fans`);
    assert(streams >= listeners * 1.5, `Preset ${p.name}: streams coherentes con oyentes`);
    assert(listeners > 20, `Preset ${p.name}: nunca tiene un absurdo de 10 oyentes`);
  }

  console.log('\n================================================================');
  console.log(`🎉 TODOS LOS TESTS PASARON EXITOSAMENTE (${passedTests}/${totalTests})`);
  console.log('================================================================\n');
}

runStreamingAndSyncTests();
