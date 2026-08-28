import { StreamingEngine } from './src/systems/StreamingEngine';
import { GameEngine } from './src/core/GameEngine';
import { Song, Artist } from './src/types';

function runAutomatedVerificationTests() {
  console.log('========================================================================');
  console.log('🚀 SUITE DE VERIFICACIÓN AUTOMATIZADA: MOTOR DE STREAMING Y DINÁMICA');
  console.log('========================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testTitle: string, details?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testTitle}`);
      if (details) console.log(`     └─ ${details}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testTitle}`);
      if (details) console.error(`     └─ DETALLE DE FALLO: ${details}`);
      throw new Error(`Test fallido: ${testTitle} -> ${details || ''}`);
    }
  }

  // ==========================================================================
  // PRUEBA 1: Impulso de catálogo al crecer de 10k a 2M oyentes
  // ==========================================================================
  console.log('------------------------------------------------------------------------');
  console.log('📋 PRUEBA 1: Crecimiento de streams de temas viejos underground (10k -> 2M)');
  console.log('------------------------------------------------------------------------');

  const undergroundArtist: Artist = {
    id: 'artist_underground_1',
    name: 'El Pibe de la Plaza',
    realName: 'Lautaro Gómez',
    isPlayer: false,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2004,
    careerStartYear: 2024,
    mainGenreId: 'trap_latino',
    subGenreIds: ['hip_hop_rap'],
    personality: {
      creativity: 80,
      ambition: 85,
      discipline: 75,
      charisma: 78,
      skill: 82,
      commercialAppeal: 70,
      originality: 84,
      riskTolerance: 70,
      sociability: 65,
      independence: 80
    },
    stats: {
      popularity: 12,
      reputation: 30,
      artisticCredibility: 65,
      energy: 90,
      monthlyListeners: 10000,
      totalStreams: 45000,
      funds: 1200,
      fansCount: 3000,
      fanbaseLoyalty: 75,
      hype: 25
    },
    careerStage: 'Underground',
    labelId: null,
    managerId: null,
    relationships: {},
    eras: [],
    awardsWon: [],
    legacyScore: 8,
    isRetired: false,
    historicalNotes: [],
    generationIndex: 1,
    influences: []
  };

  // Canción underground lanzada en Enero 2024
  const oldUndergroundSong: Song = {
    id: 'song_underground_debut',
    title: 'Rimas de Garaje (Demo)',
    artistId: undergroundArtist.id,
    featuredArtistIds: [],
    genreId: 'trap_latino',
    subGenreIds: ['hip_hop_rap'],
    releaseYear: 2024,
    releaseMonth: 1,
    quality: 72,
    commercialAppeal: 65,
    originality: 80,
    hypeAtRelease: 25,
    streamsTotal: 35000,
    streamsLastMonth: 45,
    monthlyStreamsHistory: [],
    peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
    weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
    longevityCurve: 'steady',
    isSingle: true,
    receptionRating: 3,
    isClassic: false,
    wentViral: false
  };

  // Simulación en Julio 2025 (18 meses después, cuando sigue en 10k oyentes)
  const streamResultUnderground = StreamingEngine.calculateSongMonthlyStreams(
    oldUndergroundSong,
    undergroundArtist,
    2025,
    7,
    [],
    { id: 'trap_latino', name: 'Trap Latino', currentPopularity: 70 } as any
  );

  console.log(`  • Streams mensuales de "${oldUndergroundSong.title}" en etapa underground (10k oyentes): ${streamResultUnderground.streams.toLocaleString()} streams/mes`);
  assert(
    streamResultUnderground.streams >= 15 && streamResultUnderground.streams <= 2500,
    'Streams underground en nivel base razonable',
    `Obtenido: ${streamResultUnderground.streams}`
  );

  // AHORA: El artista explota, firma con discográfica, mete hits y alcanza 2.000.000 de oyentes en 2026
  const mainstreamArtist: Artist = {
    ...undergroundArtist,
    careerStage: 'Mainstream',
    stats: {
      ...undergroundArtist.stats,
      popularity: 68,
      fansCount: 420000,
      monthlyListeners: 2000000,
      totalStreams: 85000000,
      fanbaseLoyalty: 82,
      hype: 75
    }
  };

  // Calculamos los streams mensuales de la MISMA canción vieja underground en Julio 2026 (30 meses de antigüedad)
  const streamResultMainstream = StreamingEngine.calculateSongMonthlyStreams(
    oldUndergroundSong,
    mainstreamArtist,
    2026,
    7,
    [],
    { id: 'trap_latino', name: 'Trap Latino', currentPopularity: 70 } as any
  );

  console.log(`  • Streams mensuales de la MISMA canción cuando el artista tiene 2M de oyentes: ${streamResultMainstream.streams.toLocaleString()} streams/mes`);
  
  assert(
    streamResultMainstream.streams > 10000,
    'El tema underground sube exponencialmente de streams con el crecimiento a 2M oyentes (efecto catálogo)',
    `Streams pasaron de ${streamResultUnderground.streams} a ${streamResultMainstream.streams.toLocaleString()} streams/mes (>10k)`
  );

  assert(
    streamResultMainstream.streams > streamResultUnderground.streams * 10,
    'El impulso de catálogo supera sustancialmente los streams underground (>10x)',
    `Multiplicador de catálogo obtenido: ${(streamResultMainstream.streams / streamResultUnderground.streams).toFixed(1)}x`
  );

  assert(
    streamResultMainstream.streams !== 0 && streamResultMainstream.streams !== 5,
    'El catálogo nunca colapsa a 0 o 5 reproducciones',
    `Streams registrados: ${streamResultMainstream.streams}`
  );

  // ==========================================================================
  // PRUEBA 2: Canciones secundarias se mantienen por debajo del mayor hit/single
  // ==========================================================================
  console.log('\n------------------------------------------------------------------------');
  console.log('📋 PRUEBA 2: Canciones secundarias vs Mayor Hit / Single Insignia');
  console.log('------------------------------------------------------------------------');

  // Single insignia (Lead Single con videoclip y gran promoción)
  const leadSingleHit: Song = {
    id: 'song_lead_hit',
    title: 'BZRP / Hit Global Insignia',
    artistId: mainstreamArtist.id,
    featuredArtistIds: [],
    genreId: 'trap_latino',
    subGenreIds: ['hip_hop_rap'],
    releaseYear: 2026,
    releaseMonth: 1,
    quality: 92,
    commercialAppeal: 95,
    originality: 88,
    hypeAtRelease: 85,
    streamsTotal: 15000000,
    streamsLastMonth: 3800000,
    monthlyStreamsHistory: [3800000],
    peakPosition: { Global: 1, Argentina: 1, USA: 5, LatinAmerica: 1, Europe: 8, Spain: 1, Mexico: 1 },
    weeksOnChart: { Global: 8, Argentina: 8, USA: 6, LatinAmerica: 8, Europe: 5, Spain: 8, Mexico: 8 },
    longevityCurve: 'instant_classic',
    isSingle: true,
    receptionRating: 5,
    isClassic: true,
    wentViral: true
  };

  // Canción secundaria 1: Deep cut / Track de álbum (isSingle: false)
  const secondaryAlbumTrack: Song = {
    id: 'song_album_deep_cut',
    title: 'Interludio Nocturno (Album Track)',
    artistId: mainstreamArtist.id,
    featuredArtistIds: [],
    genreId: 'trap_latino',
    subGenreIds: ['hip_hop_rap'],
    releaseYear: 2026,
    releaseMonth: 1,
    quality: 80,
    commercialAppeal: 68,
    originality: 85,
    hypeAtRelease: 85,
    streamsTotal: 2500000,
    streamsLastMonth: 750000,
    monthlyStreamsHistory: [750000],
    peakPosition: { Global: null, Argentina: 28, USA: null, LatinAmerica: 35, Europe: null, Spain: 40, Mexico: 30 },
    weeksOnChart: { Global: 0, Argentina: 2, USA: 0, LatinAmerica: 1, Europe: 0, Spain: 1, Mexico: 1 },
    longevityCurve: 'steady',
    isSingle: false,
    albumId: 'album_mainstream_1',
    receptionRating: 3,
    isClassic: false,
    wentViral: false
  };

  // Canción secundaria 2: B-Side o tema experimental (isSingle: false)
  const bSideTrack: Song = {
    id: 'song_bside_track',
    title: 'Outro 4AM (B-Side Experimental)',
    artistId: mainstreamArtist.id,
    featuredArtistIds: [],
    genreId: 'trap_latino',
    subGenreIds: ['hip_hop_rap'],
    releaseYear: 2026,
    releaseMonth: 1,
    quality: 85,
    commercialAppeal: 55,
    originality: 92,
    hypeAtRelease: 85,
    streamsTotal: 1200000,
    streamsLastMonth: 400000,
    monthlyStreamsHistory: [400000],
    peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
    weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
    longevityCurve: 'slow_burn',
    isSingle: false,
    albumId: 'album_mainstream_1',
    receptionRating: 4,
    isClassic: false,
    wentViral: false
  };

  // Evaluar reproducciones en diferentes meses (Mes 1, Mes 3, Mes 6, Mes 12)
  const monthsToCheck = [1, 3, 6, 12];
  for (const m of monthsToCheck) {
    const hitRes = StreamingEngine.calculateSongMonthlyStreams(
      leadSingleHit,
      mainstreamArtist,
      2026,
      1 + m,
      [],
      { id: 'trap_latino', name: 'Trap Latino', currentPopularity: 70 } as any
    );
    const deepCutRes = StreamingEngine.calculateSongMonthlyStreams(
      secondaryAlbumTrack,
      mainstreamArtist,
      2026,
      1 + m,
      [],
      { id: 'trap_latino', name: 'Trap Latino', currentPopularity: 70 } as any
    );
    const bSideRes = StreamingEngine.calculateSongMonthlyStreams(
      bSideTrack,
      mainstreamArtist,
      2026,
      1 + m,
      [],
      { id: 'trap_latino', name: 'Trap Latino', currentPopularity: 70 } as any
    );

    console.log(`  • Mes +${m}: Hit Insignia = ${hitRes.streams.toLocaleString()} | Deep Cut = ${deepCutRes.streams.toLocaleString()} | B-Side = ${bSideRes.streams.toLocaleString()}`);

    assert(
      hitRes.streams > deepCutRes.streams,
      `Hit insignia supera a Deep Cut en mes +${m}`,
      `${hitRes.streams.toLocaleString()} > ${deepCutRes.streams.toLocaleString()}`
    );

    assert(
      hitRes.streams > bSideRes.streams,
      `Hit insignia supera a B-Side en mes +${m}`,
      `${hitRes.streams.toLocaleString()} > ${bSideRes.streams.toLocaleString()}`
    );

    assert(
      deepCutRes.streams <= hitRes.streams * 0.70,
      `Deep Cut se mantiene claramente por debajo (<70%) del mayor hit en mes +${m}`,
      `Ratio: ${((deepCutRes.streams / hitRes.streams) * 100).toFixed(1)}%`
    );

    assert(
      bSideRes.streams <= hitRes.streams * 0.70,
      `B-Side se mantiene claramente por debajo (<70%) del mayor hit en mes +${m}`,
      `Ratio: ${((bSideRes.streams / hitRes.streams) * 100).toFixed(1)}%`
    );
  }

  // ==========================================================================
  // PRUEBA 3: Temas con picos astronómicos (25M) decaen suavemente a clásico
  // ==========================================================================
  console.log('\n------------------------------------------------------------------------');
  console.log('📋 PRUEBA 3: Decaimiento suave de pico astronómico (25M) hacia clásico');
  console.log('------------------------------------------------------------------------');

  const megaSmashSong: Song = {
    id: 'song_megasmash_25m',
    title: 'Despacito / Bzrp Session #99 (Global Megahit)',
    artistId: mainstreamArtist.id,
    featuredArtistIds: [],
    genreId: 'trap_latino',
    subGenreIds: ['hip_hop_rap'],
    releaseYear: 2026,
    releaseMonth: 1,
    quality: 95,
    commercialAppeal: 98,
    originality: 90,
    hypeAtRelease: 95,
    streamsTotal: 25000000,
    streamsLastMonth: 25000000, // Pico astronómico de 25M
    monthlyStreamsHistory: [25000000],
    peakPosition: { Global: 1, Argentina: 1, USA: 1, LatinAmerica: 1, Europe: 1, Spain: 1, Mexico: 1 },
    weeksOnChart: { Global: 12, Argentina: 12, USA: 10, LatinAmerica: 12, Europe: 10, Spain: 12, Mexico: 12 },
    longevityCurve: 'instant_classic',
    isSingle: true,
    receptionRating: 5,
    isClassic: true,
    wentViral: true
  };

  let currentMonthly = 25000000;
  megaSmashSong.streamsLastMonth = currentMonthly;

  const trajectory: number[] = [currentMonthly];

  // Simular 12 meses de decaimiento paso a paso
  for (let month = 2; month <= 12; month++) {
    const res = StreamingEngine.calculateSongMonthlyStreams(
      megaSmashSong,
      mainstreamArtist,
      2026,
      month,
      [],
      { id: 'trap_latino', name: 'Trap Latino', currentPopularity: 70 } as any
    );

    const prevMonthStreams = megaSmashSong.streamsLastMonth!;
    const newStreams = res.streams;
    const dropPercentage = ((prevMonthStreams - newStreams) / prevMonthStreams) * 100;

    console.log(`  • Mes ${month}: ${newStreams.toLocaleString()} streams (Variación mes a mes: -${dropPercentage.toFixed(1)}%)`);

    // Validaciones de decaimiento suave y continuo:
    assert(
      dropPercentage <= 25,
      `Mes ${month}: La caída mensual no es abrupta (<= 25% por mes)`,
      `Caída fue de ${dropPercentage.toFixed(1)}% (Previo: ${prevMonthStreams.toLocaleString()} -> Actual: ${newStreams.toLocaleString()})`
    );

    assert(
      dropPercentage >= 0,
      `Mes ${month}: El tema decae de forma monótona y controlada post-pico`,
      `Variación: -${dropPercentage.toFixed(1)}%`
    );

    assert(
      newStreams >= 1000000,
      `Mes ${month}: Retiene piso multimillonario durante su primer año`,
      `Streams: ${newStreams.toLocaleString()}`
    );

    megaSmashSong.streamsLastMonth = newStreams;
    megaSmashSong.streamsTotal += newStreams;
    trajectory.push(newStreams);
    currentMonthly = newStreams;
  }

  // Simular la evolución mes a mes hasta el mes 24 (Año 2)
  let year2Streams = currentMonthly;
  for (let m = 13; m <= 24; m++) {
    const yr = 2026 + Math.floor(m / 12);
    const mo = (m % 12) + 1;
    megaSmashSong.streamsLastMonth = year2Streams;
    const res = StreamingEngine.calculateSongMonthlyStreams(
      megaSmashSong,
      mainstreamArtist,
      yr,
      mo,
      [],
      { id: 'trap_latino', name: 'Trap Latino', currentPopularity: 70 } as any
    );
    year2Streams = res.streams;
  }

  console.log(`  • Año 2 (Mes 24 - Evergreen Clásico): ${year2Streams.toLocaleString()} streams/mes`);

  assert(
    year2Streams >= 400000 && year2Streams <= 6000000,
    'El tema se estabiliza suavemente en un nivel de clásico evergreen de catálogo',
    `Streams a 2 años: ${year2Streams.toLocaleString()} streams/mes`
  );

  // ==========================================================================
  // PRUEBA 4: Simulación completa con GameEngine y Avance de Ciclos
  // ==========================================================================
  console.log('\n------------------------------------------------------------------------');
  console.log('📋 PRUEBA 4: Simulación integral con GameEngine y ciclo de vida');
  console.log('------------------------------------------------------------------------');

  const engine = new GameEngine({
    name: 'Artista Prueba Integración',
    stats: {
      popularity: 20,
      reputation: 40,
      artisticCredibility: 60,
      energy: 100,
      funds: 5000,
      fansCount: 5000,
      fanbaseLoyalty: 80,
      hype: 50
    } as any
  });

  // Lanzar single debut
  const debutSingle = engine.releaseSong({
    title: 'Debut en la Plaza',
    genreId: 'trap_latino',
    subGenreIds: ['hip_hop_rap'],
    featuredArtistIds: [],
    budgetProduction: 1000,
    budgetMarketing: 1500,
    longevityCurve: 'steady'
  });

  console.log(`  • Single debut lanzado: "${debutSingle.title}"`);
  const initialDebutStreams = debutSingle.streamsTotal;

  // Avanzar 1 año (2 ciclos de 6 meses)
  engine.advanceCycle(6);
  engine.advanceCycle(6);

  console.log(`  • Tras 1 año: Player Pop = ${engine.getPlayer().stats.popularity}, Fans = ${engine.getPlayer().stats.fansCount.toLocaleString()}, Oyentes = ${engine.getPlayer().stats.monthlyListeners.toLocaleString()}`);
  console.log(`  • Single Debut streams acumulados: ${debutSingle.streamsTotal.toLocaleString()}`);

  assert(
    debutSingle.streamsTotal > initialDebutStreams,
    'Single debut acumuló streams correctamente a lo largo de los ciclos',
    `Total: ${debutSingle.streamsTotal.toLocaleString()}`
  );

  assert(
    engine.getPlayer().stats.monthlyListeners > 0,
    'Métricas de audiencia sincronizadas en el GameEngine',
    `Oyentes: ${engine.getPlayer().stats.monthlyListeners.toLocaleString()}`
  );

  console.log('\n========================================================================');
  console.log(`🎉 TODAS LAS VERIFICACIONES PASARON CON ÉXITO (${passedTests}/${totalTests})`);
  console.log('========================================================================\n');
}

runAutomatedVerificationTests();
