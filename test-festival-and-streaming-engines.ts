import { FestivalEngine, GLOBAL_FESTIVALS, LIVE_SHOW_DILEMMAS, STAGE_PRODUCTION_COSTS } from './src/systems/FestivalEngine';
import { StreamingEngine, EDITORIAL_PLAYLISTS } from './src/systems/StreamingEngine';
import { Artist, Song, WorldState, GlobalFestival, FestivalSlot } from './src/types';

function runFestivalAndStreamingEngineTests() {
  console.log('========================================================================');
  console.log('🎪 TEST SUITE: FESTIVAL ENGINE & ENRICHED STREAMING ENGINE (PILARES 2 Y 3)');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, title: string, details?: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      if (details) console.log(`     └─ ${details}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title}`);
      if (details) console.error(`     └─ ${details}`);
      throw new Error(`Test failed: ${title}`);
    }
  }

  // Helper Artist Generator
  function createTestArtist(overrides: Partial<Artist> = {}): Artist {
    return {
      id: 'artist_test_1',
      name: 'Neo Trapper',
      realName: 'Facundo Castro',
      isPlayer: true,
      country: 'Argentina',
      city: 'Buenos Aires',
      birthYear: 2002,
      careerStartYear: 2022,
      mainGenreId: 'trap_latino',
      subGenreIds: ['urban', 'hip_hop'],
      personality: {
        creativity: 85,
        ambition: 80,
        discipline: 75,
        charisma: 88,
        skill: 82,
        commercialAppeal: 84,
        originality: 78,
        riskTolerance: 70,
        sociability: 75,
        independence: 80
      },
      stats: {
        popularity: 50,
        reputation: 60,
        artisticCredibility: 70,
        energy: 90,
        monthlyListeners: 1500000,
        totalStreams: 12000000,
        funds: 250000,
        fansCount: 45000,
        fanbaseLoyalty: 80,
        hype: 65
      },
      careerStage: 'Established',
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [],
      awardsWon: [],
      legacyScore: 40,
      isRetired: false,
      historicalNotes: [],
      generationIndex: 1,
      influences: [],
      ...overrides
    };
  }

  // Helper Song Generator
  function createTestSong(id: string, title: string, artistId: string, overrides: Partial<Song> = {}): Song {
    return {
      id,
      title,
      artistId,
      featuredArtistIds: [],
      genreId: 'trap_latino',
      subGenreIds: ['urban'],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 85,
      commercialAppeal: 88,
      originality: 80,
      hypeAtRelease: 70,
      streamsTotal: 2500000,
      streamsLastMonth: 450000,
      monthlyStreamsHistory: [450000],
      peakPosition: { Global: 12, Argentina: 1, USA: null, LatinAmerica: 4, Europe: null, Spain: 8, Mexico: 5, UK: null, Brazil: null, Asia: null, Africa: null },
      weeksOnChart: { Global: 6, Argentina: 10, USA: 0, LatinAmerica: 8, Europe: 0, Spain: 6, Mexico: 7, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
      longevityCurve: 'steady',
      isSingle: true,
      receptionRating: 4.8,
      isClassic: false,
      wentViral: false,
      ...overrides
    };
  }

  // ==========================================================================
  // PARTE 1: FESTIVAL ENGINE
  // ==========================================================================
  console.log('------------------------------------------------------------------------');
  console.log('📋 SECCIÓN 1: Festivales Globales Icónicos y Catálogo Base');
  console.log('------------------------------------------------------------------------');

  assert(GLOBAL_FESTIVALS.length >= 7, 'Existe el catálogo de los 7 festivales globales icónicos');

  const coachella = GLOBAL_FESTIVALS.find(f => f.id === 'coachella');
  const lollaAr = GLOBAL_FESTIVALS.find(f => f.id === 'lollapalooza_ar');
  const primavera = GLOBAL_FESTIVALS.find(f => f.id === 'primavera_sound');
  const glastonbury = GLOBAL_FESTIVALS.find(f => f.id === 'glastonbury');
  const tomorrowland = GLOBAL_FESTIVALS.find(f => f.id === 'tomorrowland');
  const cosquin = GLOBAL_FESTIVALS.find(f => f.id === 'cosquin_rock');
  const rollingLoud = GLOBAL_FESTIVALS.find(f => f.id === 'rolling_loud');

  assert(Boolean(coachella && coachella.capacity === 125000 && coachella.month === 4), 'Coachella configurado con mes 4 y capacidad 125.000');
  assert(Boolean(lollaAr && lollaAr.capacity === 100000 && lollaAr.month === 3), 'Lollapalooza Argentina configurado con mes 3 y capacidad 100.000');
  assert(Boolean(primavera && primavera.capacity === 85000 && primavera.month === 6), 'Primavera Sound configurado con mes 6 y capacidad 85.000');
  assert(Boolean(glastonbury && glastonbury.capacity === 210000 && glastonbury.month === 6), 'Glastonbury configurado con mes 6 y capacidad 210.000');
  assert(Boolean(tomorrowland && tomorrowland.capacity === 200000 && tomorrowland.month === 7), 'Tomorrowland configurado con mes 7 y capacidad 200.000');
  assert(Boolean(cosquin && cosquin.capacity === 55000 && cosquin.month === 2), 'Cosquín Rock configurado con mes 2 y capacidad 55.000');
  assert(Boolean(rollingLoud && rollingLoud.capacity === 75000 && rollingLoud.month === 7), 'Rolling Loud configurado con mes 7 y capacidad 75.000');

  console.log('\n------------------------------------------------------------------------');
  console.log('📋 SECCIÓN 2: Lógica de Elegibilidad y Asignación de Slots');
  console.log('------------------------------------------------------------------------');

  // Underground / Low Pop (< 20)
  const undergroundArtist = createTestArtist({ stats: { ...createTestArtist().stats, popularity: 15 }, careerStage: 'Underground' });
  assert(FestivalEngine.getEligibleSlot(undergroundArtist) === null, 'Artista Underground con popularidad 15 no califica a festival masivo');

  // Opening Act (Pop >= 20, Emerging+)
  const emergingArtist = createTestArtist({ stats: { ...createTestArtist().stats, popularity: 25 }, careerStage: 'Emerging' });
  assert(FestivalEngine.getEligibleSlot(emergingArtist) === 'opening_act', 'Artista Emerging con popularidad 25 asignado a Opening Act');

  // Sunset Slot (Pop >= 45, Established+)
  const establishedArtist = createTestArtist({ stats: { ...createTestArtist().stats, popularity: 55 }, careerStage: 'Established' });
  assert(FestivalEngine.getEligibleSlot(establishedArtist) === 'sunset_slot', 'Artista Established con popularidad 55 asignado a Sunset Slot');

  // Sub-Headliner (Pop >= 70, Mainstream+)
  const mainstreamArtist = createTestArtist({ stats: { ...createTestArtist().stats, popularity: 76 }, careerStage: 'Mainstream' });
  assert(FestivalEngine.getEligibleSlot(mainstreamArtist) === 'sub_headliner', 'Artista Mainstream con popularidad 76 asignado a Sub-Headliner');

  // Headliner (Pop >= 85, Superstar+)
  const superstarArtist = createTestArtist({ stats: { ...createTestArtist().stats, popularity: 90 }, careerStage: 'Superstar' });
  assert(FestivalEngine.getEligibleSlot(superstarArtist) === 'headliner', 'Artista Superstar con popularidad 90 asignado a Headliner');

  console.log('\n------------------------------------------------------------------------');
  console.log('📋 SECCIÓN 3: Generación de Invitaciones Estacionales');
  console.log('------------------------------------------------------------------------');

  // Lollapalooza Argentina ocurre en mes 3. En mes 2 (1 mes antes), debe emitir invitación estacional
  const invitationsMonth2 = FestivalEngine.generateSeasonalInvitations(establishedArtist, 2026, 2);
  const lollaInv = invitationsMonth2.find(i => i.festivalId === 'lollapalooza_ar');
  assert(Boolean(lollaInv), 'Lollapalooza genera invitación estacional en el mes 2 (previo al mes 3)', `Invitación generada: ${lollaInv?.slotTitle}`);
  assert(Boolean(lollaInv && lollaInv.payout > 50000), 'El caché ofrecido es proporcional al estatus del artista', `Caché: $${lollaInv?.payout}`);

  console.log('\n------------------------------------------------------------------------');
  console.log('📋 SECCIÓN 4: Cálculo de Costos de Producción de Escenario');
  console.log('------------------------------------------------------------------------');

  // Basic Setup: 0 + 0 + 0 = 0
  const basicCost = FestivalEngine.calculateProductionCost({ visuals: 'basic', pyro: 'none', crew: 'solo_dj' });
  assert(basicCost === 0, 'Configuración básica tiene costo $0');

  // Mid Setup: 3d_screens ($15k) + sparks_fog ($8k) + live_band ($12k) = $35,000
  const midCost = FestivalEngine.calculateProductionCost({ visuals: '3d_screens', pyro: 'sparks_fog', crew: 'live_band' });
  assert(midCost === 35000, 'Configuración intermedia suma exactamente $35.000 ($15k + $8k + $12k)');

  // Elite Setup: monumental_mapping ($45k) + flamethrowers_lasers ($25k) + elite_dancers_choir ($30k) = $100,000
  const eliteCost = FestivalEngine.calculateProductionCost({
    visuals: 'monumental_mapping',
    pyro: 'flamethrowers_lasers',
    crew: 'elite_dancers_choir'
  });
  assert(eliteCost === 100000, 'Configuración monumental suma exactamente $100.000 ($45k + $25k + $30k)');

  console.log('\n------------------------------------------------------------------------');
  console.log('📋 SECCIÓN 5: Dilemas Interactivos y Resolución de Live Show');
  console.log('------------------------------------------------------------------------');

  assert(LIVE_SHOW_DILEMMAS.length >= 5, 'Existen al menos 5 dilemas interactivos estructurados');
  const dilemmaIds = LIVE_SHOW_DILEMMAS.map(d => d.id);
  assert(dilemmaIds.includes('sound_failure'), 'Dilema de falla de sonido implementado');
  assert(dilemmaIds.includes('torrential_storm'), 'Dilema de tormenta y lluvia implementado');
  assert(dilemmaIds.includes('moshpit_barricade'), 'Dilema de pogo y vallas desbordadas implementado');
  assert(dilemmaIds.includes('rival_vip_appearance'), 'Dilema de rival en VIP implementado');
  assert(dilemmaIds.includes('unrehearsed_anthem_request'), 'Dilema de tema no ensayado aclamado por el público implementado');

  const testSong1 = createTestSong('song_hit_1', 'Baires Drifting', superstarArtist.id);
  const testSong2 = createTestSong('song_hit_2', 'Corte Elegante', superstarArtist.id);
  const mockWorld: WorldState = {
    currentYear: 2026,
    currentMonth: 3,
    activeTrendIds: [],
    genres: {},
    trends: {},
    artists: { [superstarArtist.id]: superstarArtist },
    songs: { [testSong1.id]: testSong1, [testSong2.id]: testSong2 },
    albums: {},
    labels: {},
    producers: {},
    managers: {},
    tours: [],
    charts: {} as any,
    awardsHistory: [],
    news: [],
    socialFeed: [],
    ecosystemContacts: {},
    activeBeefs: {},
    records: [],
    globalHistoryTimeline: [],
    recentEventIdsHistory: [],
    activeNarrativeChains: {}
  };

  const showResult = FestivalEngine.resolveLiveShow({
    artist: superstarArtist,
    festival: lollaAr!,
    slot: 'headliner',
    setlistSongIds: [testSong1.id, testSong2.id],
    production: {
      visuals: 'monumental_mapping',
      pyro: 'flamethrowers_lasers',
      crew: 'elite_dancers_choir'
    },
    dilemmaChoice: {
      dilemmaId: 'sound_failure',
      choiceId: 'acapella_crowd'
    },
    world: mockWorld
  });

  assert(showResult.performanceScore >= 75, 'Performance score sobresaliente con alta producción y elección correcta');
  assert(showResult.attendance >= 90000, 'Asistencia masiva como headliner de Lollapalooza (>90k)');
  assert(showResult.netProfit > 0, `Ganancia neta calculada correctamente ($${showResult.netProfit.toLocaleString()})`);
  assert(showResult.pressReviews.length >= 2, 'Prensa especializada generó reseñas creíbles');
  assert(showResult.pressReviews.some(r => r.outlet === 'Rolling Stone'), 'Rolling Stone reseñó el show');
  assert(Boolean(showResult.dilemmaEncountered), 'Dilema registrado y reflejado en el reporte de prensa');

  // ==========================================================================
  // PARTE 2: ENRICHED STREAMING ENGINE
  // ==========================================================================
  console.log('\n------------------------------------------------------------------------');
  console.log('📋 SECCIÓN 6: Catálogo Base de Playlists Editoriales');
  console.log('------------------------------------------------------------------------');

  assert(EDITORIAL_PLAYLISTS.length >= 8, 'Existen las 8 playlists editoriales solicitadas');
  const playlistNames = EDITORIAL_PLAYLISTS.map(p => p.name);
  assert(playlistNames.includes("Today's Top Hits"), "Today's Top Hits presente (multi x1.8)");
  assert(playlistNames.includes("Viva Latino"), "Viva Latino presente (multi x1.6)");
  assert(playlistNames.includes("Éxitos Argentina"), "Éxitos Argentina presente (multi x1.4)");
  assert(playlistNames.includes("Rap Caviar"), "Rap Caviar presente (multi x1.5)");
  assert(playlistNames.includes("Baila Reggaeton"), "Baila Reggaeton presente (multi x1.5)");
  assert(playlistNames.includes("Mansión Trap"), "Mansión Trap presente (multi x1.35)");
  assert(playlistNames.includes("Indie Chill"), "Indie Chill presente (multi x1.25)");
  assert(playlistNames.includes("Descubrimiento Semanal"), "Descubrimiento Semanal presente (multi x1.2)");

  console.log('\n------------------------------------------------------------------------');
  console.log('📋 SECCIÓN 7: Rotación y Asignación de Canciones a Playlists');
  console.log('------------------------------------------------------------------------');

  const worldWithPlaylists = { ...mockWorld };
  const updatedPlaylists = StreamingEngine.updatePlaylists(worldWithPlaylists);
  assert(Boolean(worldWithPlaylists.playlists), 'world.playlists inicializado y persistido');
  
  // Como testSong1 es trap_latino argentino y de alta calidad, debe ingresar en Mansión Trap o Éxitos Argentina
  const mansionTrap = updatedPlaylists['mansion_trap'];
  assert(Boolean(mansionTrap && mansionTrap.trackIds.includes(testSong1.id)), 'Canción de trap califica e ingresa en Mansión Trap');

  // Multiplier test
  const playlistMulti = StreamingEngine.getSongPlaylistMultiplier(testSong1.id, worldWithPlaylists);
  assert(playlistMulti >= 1.35, `Multiplicador de playlist aplicado correctamente (x${playlistMulti})`);

  console.log('\n------------------------------------------------------------------------');
  console.log('📋 SECCIÓN 8: Generador Dinámico de Comentarios de YouTube');
  console.log('------------------------------------------------------------------------');

  testSong1.musicVideo = {
    concept: 'Cine 4K Cinematográfico',
    directorTier: 'Director de Élite Mundial',
    budget: 45000,
    views: 1200000
  };

  const comments = StreamingEngine.generateVideoComments(testSong1, superstarArtist, mockWorld);
  assert(comments.length >= 8, 'Genera lista rica de comentarios (>8 comentarios)');
  assert(comments.some(c => c.isPinned), 'Incluye comentario fijado del artista');
  assert(comments.some(c => c.sentiment === 'meme'), 'Incluye comentarios con humor y memes');
  assert(comments.some(c => c.content.includes('lpm') || c.content.includes('barras') || c.content.includes('bancando')), 'Incluye comentarios en lunfardo / jerga argentina');
  assert(comments.some(c => c.content.includes('Director de Élite Mundial') || c.content.includes('Cine 4K')), 'Menciona la dirección de arte del videoclip');

  console.log('\n------------------------------------------------------------------------');
  console.log('📋 SECCIÓN 9: Simulación de Campaña de Snippets en TikTok');
  console.log('------------------------------------------------------------------------');

  const snippetResult = StreamingEngine.simulateSnippetCampaign({
    song: testSong1,
    artist: superstarArtist,
    budget: 8000,
    concept: 'Audio Meme Acelerado (Sped Up)'
  });

  assert(snippetResult.success, 'Campaña de snippets ejecutada con éxito');
  assert(snippetResult.tiktokViews >= 1000000, `Generó más de 1M de vistas en TikTok (${snippetResult.tiktokViews.toLocaleString()})`);
  assert(snippetResult.ugcCreations >= 100, `Generó creaciones de usuarios UGC (${snippetResult.ugcCreations.toLocaleString()} videos)`);
  assert(snippetResult.streamsBoostGenerated > 0, `Generó conversión directa a plataformas de streaming (+${snippetResult.streamsBoostGenerated.toLocaleString()} streams)`);
  assert(snippetResult.monthlyListenersGained > 0, `Ganó nuevos oyentes mensuales (+${snippetResult.monthlyListenersGained.toLocaleString()})`);
  assert(snippetResult.isViralTrend, `Catalogado como trend viral (${snippetResult.viralTier})`);

  console.log('\n========================================================================');
  console.log(`🎉 TODAS LAS VERIFICACIONES COMPLETADAS CON ÉXITO (${passed}/${total})`);
  console.log('========================================================================');
}

runFestivalAndStreamingEngineTests();
