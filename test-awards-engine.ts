import { AwardEngine, NOMINEES_PER_CATEGORY } from './src/systems/AwardEngine';
import { GameEngine } from './src/core/GameEngine';
import { WorldState, Artist, Song, Album } from './src/types';
import { INITIAL_ARTISTS } from './src/data/initialArtists';
import { INITIAL_GENRES } from './src/data/genres';
import { INITIAL_LABELS } from './src/data/labels';
import { INITIAL_PRODUCERS, INITIAL_MANAGERS } from './src/data/producersAndManagers';

interface TestStats {
  passed: number;
  failed: number;
  total: number;
  errors: string[];
}

const stats: TestStats = {
  passed: 0,
  failed: 0,
  total: 0,
  errors: []
};

function assert(condition: boolean, message: string) {
  stats.total++;
  if (condition) {
    stats.passed++;
    console.log(`  \x1b[32m✔\x1b[0m ${message}`);
  } else {
    stats.failed++;
    const errMsg = `FAIL: ${message}`;
    stats.errors.push(errMsg);
    console.error(`  \x1b[31m✘\x1b[0m ${errMsg}`);
  }
}

function createBaseWorld(): WorldState {
  return {
    currentYear: 2026,
    currentMonth: 12,
    activeTrendIds: [],
    genres: JSON.parse(JSON.stringify(INITIAL_GENRES)),
    trends: {},
    artists: JSON.parse(JSON.stringify(INITIAL_ARTISTS)),
    songs: {},
    albums: {},
    labels: JSON.parse(JSON.stringify(INITIAL_LABELS)),
    producers: JSON.parse(JSON.stringify(INITIAL_PRODUCERS)),
    managers: JSON.parse(JSON.stringify(INITIAL_MANAGERS)),
    tours: [],
    charts: {
      Global: { region: 'Global', year: 2026, month: 12, entries: [] },
      Argentina: { region: 'Argentina', year: 2026, month: 12, entries: [] },
      LatinAmerica: { region: 'LatinAmerica', year: 2026, month: 12, entries: [] },
      USA: { region: 'USA', year: 2026, month: 12, entries: [] },
      Europe: { region: 'Europe', year: 2026, month: 12, entries: [] },
      Spain: { region: 'Spain', year: 2026, month: 12, entries: [] },
      Mexico: { region: 'Mexico', year: 2026, month: 12, entries: [] }
    },
    historicalRecords: [],
    awardsHistory: [],
    news: [],
    recentEventIdsHistory: [],
    activeBeefs: {},
    financialLedger: []
  };
}

function runAllTests() {
  console.log('\n===============================================================');
  console.log('🧪 SUITE DE PRUEBAS EXHAUSTIVA: MOTOR DE PREMIOS (AWARDS ENGINE)');
  console.log('===============================================================\n');

  // -------------------------------------------------------------
  // CASO A: Jugador con 0 lanzamientos -> 0 nominaciones en todas las categorías
  // -------------------------------------------------------------
  console.log('🔹 CASO A: Jugador con 0 lanzamientos (Canciones/Álbumes)');
  {
    const world = createBaseWorld();
    const playerId = 'player_case_a';
    world.artists[playerId] = {
      id: playerId,
      name: 'Novato Sin Temas',
      isPlayer: true,
      country: 'Argentina',
      city: 'Buenos Aires',
      birthYear: 2004,
      careerStartYear: 2026,
      mainGenreId: 'trap_latino',
      subGenreIds: [],
      personality: {
        creativity: 80, ambition: 80, discipline: 80, charisma: 80, skill: 80,
        commercialAppeal: 80, originality: 80, riskTolerance: 80, sociability: 80, independence: 80
      },
      stats: {
        popularity: 50, reputation: 50, artisticCredibility: 50, energy: 100,
        monthlyListeners: 50000, totalStreams: 100000, funds: 5000, fansCount: 10000,
        fanbaseLoyalty: 70, hype: 60
      },
      careerStage: 'Underground',
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [],
      awardsWon: [],
      legacyScore: 10,
      isRetired: false,
      historicalNotes: [],
      generationIndex: 1,
      influences: []
    };

    // Asegurar 0 canciones y 0 álbumes del jugador
    const result = AwardEngine.conductAnnualAwards(world, 2026);

    assert(result.ceremony.playerNominationsCount === 0, 'playerNominationsCount debe ser exactamente 0');
    assert(result.ceremony.playerWinsCount === 0, 'playerWinsCount debe ser exactamente 0');
    assert(!result.playerWonAny, 'playerWonAny debe ser false');

    for (const category of result.ceremony.categories) {
      assert(!category.playerNominated, `Categoría "${category.name}": playerNominated debe ser false`);
      assert(!category.playerWon, `Categoría "${category.name}": playerWon debe ser false`);
      const playerNominee = category.nominees?.find(n => n.isPlayer || n.artistId === playerId);
      assert(!playerNominee, `Categoría "${category.name}": no debe contener al jugador en nominees`);
      assert(!category.nomineeArtistIds.includes(playerId), `Categoría "${category.name}": nomineeArtistIds no debe incluir al jugador`);
    }
  }

  // -------------------------------------------------------------
  // CASO B: Jugador novato con 1 single y streams < 1.000 -> Excluido de Mejor Nuevo Artista
  // -------------------------------------------------------------
  console.log('\n🔹 CASO B: Jugador novato con 1 single y streams < 1.000');
  {
    const world = createBaseWorld();
    const playerId = 'player_case_b';
    world.artists[playerId] = {
      id: playerId,
      name: 'Novato Low Streams',
      isPlayer: true,
      country: 'Argentina',
      city: 'Buenos Aires',
      birthYear: 2005,
      careerStartYear: 2026,
      mainGenreId: 'trap_latino',
      subGenreIds: [],
      personality: {
        creativity: 70, ambition: 70, discipline: 70, charisma: 70, skill: 70,
        commercialAppeal: 70, originality: 70, riskTolerance: 70, sociability: 70, independence: 70
      },
      stats: {
        popularity: 15, reputation: 10, artisticCredibility: 15, energy: 100,
        monthlyListeners: 200, totalStreams: 500, // < 1000 streams!
        funds: 1000, fansCount: 100, fanbaseLoyalty: 50, hype: 20
      },
      careerStage: 'Underground',
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [],
      awardsWon: [],
      legacyScore: 5,
      isRetired: false,
      historicalNotes: [],
      generationIndex: 1,
      influences: []
    };

    // Publicar 1 single para el jugador con 500 streams
    world.songs['song_player_b_1'] = {
      id: 'song_player_b_1',
      title: 'Mi Primer Intento',
      artistId: playerId,
      featuredArtistIds: [],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 2,
      quality: 60,
      commercialAppeal: 50,
      originality: 60,
      hypeAtRelease: 20,
      streamsTotal: 500,
      streamsLastMonth: 100,
      monthlyStreamsHistory: [500],
      peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: 'steady',
      isSingle: true,
      receptionRating: 3,
      isClassic: false,
      wentViral: false
    };

    const result = AwardEngine.conductAnnualAwards(world, 2026);
    const newArtistCategory = result.ceremony.categories.find(c => c.id.includes('best_new_artist'));

    assert(Boolean(newArtistCategory), 'La categoría Mejor Nuevo Artista debe existir');
    if (newArtistCategory) {
      const isPlayerNominated = newArtistCategory.nominees?.some(n => n.isPlayer || n.artistId === playerId);
      assert(!isPlayerNominated, 'Jugador con < 1.000 streams NO debe estar nominado en Mejor Nuevo Artista');
      assert(!newArtistCategory.nomineeArtistIds.includes(playerId), 'nomineeArtistIds de Mejor Nuevo Artista NO debe incluir al jugador');
    }
  }

  // -------------------------------------------------------------
  // CASO C: Jugador novato con 1 single, 25.000 streams y 20 de reputación -> Elegible para Mejor Nuevo Artista
  // -------------------------------------------------------------
  console.log('\n🔹 CASO C: Jugador novato con 1 single, 25.000 streams y 20 de reputación');
  {
    const world = createBaseWorld();
    const playerId = 'player_case_c';
    world.artists[playerId] = {
      id: playerId,
      name: 'Promesa Revelación',
      isPlayer: true,
      country: 'Argentina',
      city: 'Rosario',
      birthYear: 2004,
      careerStartYear: 2026,
      mainGenreId: 'trap_latino',
      subGenreIds: [],
      personality: {
        creativity: 90, ambition: 90, discipline: 85, charisma: 90, skill: 92,
        commercialAppeal: 88, originality: 90, riskTolerance: 80, sociability: 85, independence: 75
      },
      stats: {
        popularity: 35, reputation: 20, artisticCredibility: 35, energy: 100,
        monthlyListeners: 15000, totalStreams: 25000, // 25.000 streams y 20 rep!
        funds: 5000, fansCount: 8000, fanbaseLoyalty: 80, hype: 60
      },
      careerStage: 'Emerging',
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [],
      awardsWon: [],
      legacyScore: 15,
      isRetired: false,
      historicalNotes: [],
      generationIndex: 1,
      influences: []
    };

    world.songs['song_player_c_1'] = {
      id: 'song_player_c_1',
      title: 'El Gran Despegue',
      artistId: playerId,
      featuredArtistIds: [],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 3,
      quality: 88,
      commercialAppeal: 85,
      originality: 85,
      hypeAtRelease: 60,
      streamsTotal: 25000,
      streamsLastMonth: 12000,
      monthlyStreamsHistory: [13000, 12000],
      peakPosition: { Global: 35, Argentina: 12, USA: null, LatinAmerica: 25, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 2, Argentina: 6, USA: 0, LatinAmerica: 4, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: 'steady',
      isSingle: true,
      receptionRating: 4,
      isClassic: false,
      wentViral: false
    };

    const result = AwardEngine.conductAnnualAwards(world, 2026);
    const newArtistCategory = result.ceremony.categories.find(c => c.id.includes('best_new_artist'));

    assert(Boolean(newArtistCategory), 'La categoría Mejor Nuevo Artista debe existir');
    if (newArtistCategory) {
      assert(newArtistCategory.nominees?.length === NOMINEES_PER_CATEGORY, `Mejor Nuevo Artista debe tener ${NOMINEES_PER_CATEGORY} nominados`);
      const isPlayerNominated = newArtistCategory.nominees?.some(n => n.isPlayer || n.artistId === playerId);
      assert(isPlayerNominated, 'Jugador con 25k streams y 20 de reputación DEBE estar nominado en Mejor Nuevo Artista');
    }
  }

  // -------------------------------------------------------------
  // CASO D: Todas las 5 categorías tienen EXACTAMENTE 4 nominados
  // -------------------------------------------------------------
  console.log('\n🔹 CASO D: Todas las 5 categorías tienen EXACTAMENTE 4 nominados');
  {
    // Test 1: Mundo base por defecto
    const world1 = createBaseWorld();
    const result1 = AwardEngine.conductAnnualAwards(world1, 2026);
    assert(result1.ceremony.categories.length === 5, 'Debe haber exactamente 5 categorías en la ceremonia');
    for (const cat of result1.ceremony.categories) {
      assert(cat.nominees?.length === 4, `[Mundo Base] Categoría "${cat.name}" tiene ${cat.nominees?.length} nominados (esperado: 4)`);
      assert(cat.nomineeArtistIds.length === 4, `[Mundo Base] Categoría "${cat.name}" tiene ${cat.nomineeArtistIds.length} artistIds (esperado: 4)`);
    }

    // Test 2: Mundo con catálogo masivo de NPC
    const world2 = createBaseWorld();
    let songCount = 0;
    for (const artist of Object.values(world2.artists)) {
      for (let s = 1; s <= 3; s++) {
        songCount++;
        const sId = `song_massive_${artist.id}_${s}`;
        world2.songs[sId] = {
          id: sId,
          title: `Hit Track ${songCount}`,
          artistId: artist.id,
          featuredArtistIds: [],
          genreId: artist.mainGenreId,
          subGenreIds: [],
          releaseYear: 2026,
          releaseMonth: s * 3,
          quality: 75 + (s * 5),
          commercialAppeal: 75,
          originality: 75,
          hypeAtRelease: 70,
          streamsTotal: 1000000 * s,
          streamsLastMonth: 200000,
          monthlyStreamsHistory: [],
          peakPosition: { Global: 10, Argentina: 5, USA: null, LatinAmerica: 8, Europe: null, Spain: null, Mexico: null },
          weeksOnChart: { Global: 5, Argentina: 6, USA: 0, LatinAmerica: 5, Europe: 0, Spain: 0, Mexico: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: false
        };
      }
    }
    const result2 = AwardEngine.conductAnnualAwards(world2, 2026);
    for (const cat of result2.ceremony.categories) {
      assert(cat.nominees?.length === 4, `[Mundo Masivo] Categoría "${cat.name}" tiene ${cat.nominees?.length} nominados (esperado: 4)`);
    }
  }

  // -------------------------------------------------------------
  // CASO E: Canción del Año y Álbum del Año tienen máximo 1 nominación por artista (Anti-monopolio)
  // -------------------------------------------------------------
  console.log('\n🔹 CASO E: Canción del Año y Álbum del Año - Máximo 1 nominación por artista');
  {
    const world = createBaseWorld();
    // Creamos 10 canciones y 5 álbumes excelentes para el mismo artista (Duki)
    const dukiId = 'artist_duki';
    for (let i = 1; i <= 10; i++) {
      const sId = `song_duki_superhit_${i}`;
      world.songs[sId] = {
        id: sId,
        title: `Mega Hit Duki ${i}`,
        artistId: dukiId,
        featuredArtistIds: [],
        genreId: 'trap_latino',
        subGenreIds: [],
        releaseYear: 2026,
        releaseMonth: 1,
        quality: 99,
        commercialAppeal: 99,
        originality: 99,
        hypeAtRelease: 99,
        streamsTotal: 500000000 + i * 1000000,
        streamsLastMonth: 80000000,
        monthlyStreamsHistory: [],
        peakPosition: { Global: 1, Argentina: 1, USA: null, LatinAmerica: 1, Europe: null, Spain: null, Mexico: null },
        weeksOnChart: { Global: 20, Argentina: 20, USA: 0, LatinAmerica: 20, Europe: 0, Spain: 0, Mexico: 0 },
        longevityCurve: 'instant_classic',
        isSingle: true,
        receptionRating: 5,
        isClassic: true,
        wentViral: true
      };
    }

    for (let j = 1; j <= 5; j++) {
      const albId = `album_duki_super_${j}`;
      world.albums[albId] = {
        id: albId,
        title: `Mega Album Duki ${j}`,
        artistId: dukiId,
        type: 'album',
        songIds: [],
        genreId: 'trap_latino',
        subGenreIds: [],
        releaseYear: 2026,
        releaseMonth: 2,
        totalStreams: 1000000000,
        firstWeekSales: 150000,
        criticalScore: 98,
        commercialScore: 99,
        peakChartPosition: { Global: 1, Argentina: 1, USA: null, LatinAmerica: 1, Europe: null, Spain: null, Mexico: null },
        awards: [],
        coverGradient: 'from-purple-900 to-black'
      };
    }

    const result = AwardEngine.conductAnnualAwards(world, 2026);

    const songOfYear = result.ceremony.categories.find(c => c.id.includes('song_of_year'));
    const albumOfYear = result.ceremony.categories.find(c => c.id.includes('album_of_year'));

    assert(Boolean(songOfYear), 'Canción del Año debe existir');
    if (songOfYear) {
      assert(songOfYear.nominees?.length === 4, 'Canción del Año debe tener 4 nominados');
      const dukiNominations = songOfYear.nominees?.filter(n => n.artistId === dukiId) || [];
      assert(dukiNominations.length <= 1, `Canción del Año: Duki tiene ${dukiNominations.length} nominaciones (máximo permitido: 1)`);

      // Verificar que todos los artistas sean únicos en la categoría
      const artistIds = songOfYear.nominees?.map(n => n.artistId) || [];
      const uniqueArtistIds = new Set(artistIds);
      assert(uniqueArtistIds.size === artistIds.length, 'Canción del Año: Cero monopolio (cada nominado pertenece a un artista diferente)');
    }

    assert(Boolean(albumOfYear), 'Álbum del Año debe existir');
    if (albumOfYear) {
      assert(albumOfYear.nominees?.length === 4, 'Álbum del Año debe tener 4 nominados');
      const dukiAlbumNoms = albumOfYear.nominees?.filter(n => n.artistId === dukiId) || [];
      assert(dukiAlbumNoms.length <= 1, `Álbum del Año: Duki tiene ${dukiAlbumNoms.length} nominaciones (máximo permitido: 1)`);

      const albumArtistIds = albumOfYear.nominees?.map(n => n.artistId) || [];
      const uniqueAlbumArtistIds = new Set(albumArtistIds);
      assert(uniqueAlbumArtistIds.size === albumArtistIds.length, 'Álbum del Año: Cero monopolio (cada nominado pertenece a un artista diferente)');
    }
  }

  // -------------------------------------------------------------
  // CASO F: Mejor Producción tiene máximo 2 nominaciones por artista / productor
  // -------------------------------------------------------------
  console.log('\n🔹 CASO F: Mejor Producción - Máximo 2 nominaciones por artista o productor');
  {
    const world = createBaseWorld();
    const prodId = 'prod_bizarrap_master';
    world.producers[prodId] = {
      id: prodId,
      name: 'Bizarrap Productions',
      tagline: 'Sonido de élite mundial',
      signatureStyle: 'Electro Trap Vanguard',
      genreSpecialties: ['trap_latino', 'musica_electronica'],
      reputation: 99,
      costPerTrack: 25000,
      qualityBoost: 25,
      country: 'Argentina'
    };

    // Crear 8 canciones producidas por el mismo productor y mismo artista con calidad 100
    for (let i = 1; i <= 8; i++) {
      const sId = `song_prod_test_${i}`;
      world.songs[sId] = {
        id: sId,
        title: `Producción Maestra Vol ${i}`,
        artistId: 'artist_bizarrap',
        producerId: prodId,
        featuredArtistIds: [],
        genreId: 'musica_electronica',
        subGenreIds: [],
        releaseYear: 2026,
        releaseMonth: 1,
        quality: 100,
        commercialAppeal: 95,
        originality: 98,
        hypeAtRelease: 95,
        streamsTotal: 100000000,
        streamsLastMonth: 10000000,
        monthlyStreamsHistory: [],
        peakPosition: { Global: 1, Argentina: 1, USA: null, LatinAmerica: 1, Europe: null, Spain: null, Mexico: null },
        weeksOnChart: { Global: 10, Argentina: 10, USA: 0, LatinAmerica: 10, Europe: 0, Spain: 0, Mexico: 0 },
        longevityCurve: 'instant_classic',
        isSingle: true,
        receptionRating: 5,
        isClassic: true,
        wentViral: true
      };
    }

    const result = AwardEngine.conductAnnualAwards(world, 2026);
    const prodCategory = result.ceremony.categories.find(c => c.id.includes('best_production'));

    assert(Boolean(prodCategory), 'Mejor Producción debe existir');
    if (prodCategory) {
      assert(prodCategory.nominees?.length === 4, 'Mejor Producción debe tener exactamente 4 nominados');

      // Conteo por artista
      const artistCounts = new Map<string, number>();
      const prodCounts = new Map<string, number>();

      for (const nom of prodCategory.nominees || []) {
        artistCounts.set(nom.artistId, (artistCounts.get(nom.artistId) || 0) + 1);
        if (nom.producerId) {
          prodCounts.set(nom.producerId, (prodCounts.get(nom.producerId) || 0) + 1);
        }
      }

      for (const [artId, count] of artistCounts.entries()) {
        assert(count <= 2, `Mejor Producción: Artista ${artId} tiene ${count} nominaciones (máximo permitido: 2)`);
      }

      for (const [pId, count] of prodCounts.entries()) {
        assert(count <= 2, `Mejor Producción: Productor ${pId} tiene ${count} nominaciones (máximo permitido: 2)`);
      }
    }
  }

  // -------------------------------------------------------------
  // CASO G: Desduplicación de títulos: Dos canciones con el mismo nombre no pueden figurar nominadas a la vez
  // -------------------------------------------------------------
  console.log('\n🔹 CASO G: Desduplicación estricta de títulos');
  {
    const world = createBaseWorld();
    // Creamos dos canciones con títulos idénticos/equivalentes por distintos artistas
    world.songs['song_dup_1'] = {
      id: 'song_dup_1',
      title: 'Fuego Eterno',
      artistId: 'artist_duki',
      featuredArtistIds: [],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 98,
      commercialAppeal: 98,
      originality: 95,
      hypeAtRelease: 95,
      streamsTotal: 200000000,
      streamsLastMonth: 20000000,
      monthlyStreamsHistory: [],
      peakPosition: { Global: 1, Argentina: 1, USA: null, LatinAmerica: 1, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 15, Argentina: 15, USA: 0, LatinAmerica: 15, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: 'instant_classic',
      isSingle: true,
      receptionRating: 5,
      isClassic: true,
      wentViral: true
    };

    world.songs['song_dup_2'] = {
      id: 'song_dup_2',
      title: 'Fuego Eterno!', // Mismo título normalizado ('fuegoeterno')
      artistId: 'artist_khea',
      featuredArtistIds: [],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 2,
      quality: 97,
      commercialAppeal: 97,
      originality: 94,
      hypeAtRelease: 94,
      streamsTotal: 190000000,
      streamsLastMonth: 19000000,
      monthlyStreamsHistory: [],
      peakPosition: { Global: 2, Argentina: 2, USA: null, LatinAmerica: 2, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 14, Argentina: 14, USA: 0, LatinAmerica: 14, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: 'instant_classic',
      isSingle: true,
      receptionRating: 5,
      isClassic: true,
      wentViral: true
    };

    // Test de normalización
    const norm1 = AwardEngine.normalizeTitle('Fuego Eterno');
    const norm2 = AwardEngine.normalizeTitle('  ¡fuego eterno!  ');
    const norm3 = AwardEngine.normalizeTitle('Fuégo Étérno');
    assert(norm1 === 'fuegoeterno', `normalizeTitle('Fuego Eterno') debe ser 'fuegoeterno' (obtenido: '${norm1}')`);
    assert(norm1 === norm2, `normalizeTitle debe ignorar signos y espacios ('${norm1}' === '${norm2}')`);
    assert(norm1 === norm3, `normalizeTitle debe ignorar tildes ('${norm1}' === '${norm3}')`);

    const result = AwardEngine.conductAnnualAwards(world, 2026);
    const songOfYear = result.ceremony.categories.find(c => c.id.includes('song_of_year'));

    assert(Boolean(songOfYear), 'Canción del Año debe existir');
    if (songOfYear) {
      assert(songOfYear.nominees?.length === 4, 'Canción del Año debe tener exactamente 4 nominados');
      const nominatedTitles = songOfYear.nominees?.map(n => AwardEngine.normalizeTitle(n.itemTitle || '')) || [];
      const uniqueTitles = new Set(nominatedTitles);
      assert(uniqueTitles.size === nominatedTitles.length, 'No debe haber dos canciones con el mismo título en Canción del Año');
      const fuegoEternoCount = nominatedTitles.filter(t => t === 'fuegoeterno').length;
      assert(fuegoEternoCount <= 1, `El título 'Fuego Eterno' aparece ${fuegoEternoCount} vez/veces (máximo: 1)`);
    }
  }

  // -------------------------------------------------------------
  // CASO EXTRA / INTEGRACIÓN: GameEngine Integración Completa
  // -------------------------------------------------------------
  console.log('\n🔹 CASO INTEGRACIÓN: GameEngine Avance Anual & Gala de Premios');
  {
    const engine = new GameEngine({
      name: 'Artista Campeón',
      careerStartYear: 2026,
      stats: {
        popularity: 90,
        reputation: 85,
        artisticCredibility: 90,
        energy: 100,
        monthlyListeners: 5000000,
        totalStreams: 80000000,
        funds: 500000,
        fansCount: 3000000,
        fanbaseLoyalty: 85,
        hype: 90
      }
    });

    // El jugador lanza un single exitoso
    const single = engine.releaseSong({
      title: 'Hit Mundial del Jugador',
      genreId: 'trap_latino',
      subGenreIds: [],
      featuredArtistIds: [],
      budgetProduction: 5000,
      budgetMarketing: 10000
    });

    assert(Boolean(single.id), 'El jugador debe poder publicar un single exitoso');

    // Avanzamos hasta diciembre (mes 12) para que se celebre la gala anual
    engine.advanceCycle(12);

    const gala = engine.getActiveGalaCeremony();
    assert(Boolean(gala), 'La gala activa debe haberse disparado en diciembre');
    if (gala) {
      assert(gala.categories.length === 5, 'La gala del GameEngine debe contener 5 categorías');
      for (const cat of gala.categories) {
        assert(cat.nominees?.length === 4, `GameEngine: Categoría "${cat.name}" tiene 4 nominados`);
      }
    }
  }

  console.log('\n===============================================================');
  console.log(`📊 RESUMEN DE RESULTADOS:`);
  console.log(`   Total de pruebas ejecutadas: ${stats.total}`);
  console.log(`   \x1b[32mSuperadas con éxito: ${stats.passed}\x1b[0m`);
  console.log(`   \x1b[31mFallidas: ${stats.failed}\x1b[0m`);
  if (stats.failed === 0) {
    console.log(`\n🎉 \x1b[32m100% DE ÉXITO: Todos los criterios de auditoría QA han sido superados.\x1b[0m`);
  } else {
    console.log(`\n❌ \x1b[31mSe encontraron ${stats.failed} fallos en las pruebas.\x1b[0m`);
  }
  console.log('===============================================================\n');

  return stats.failed === 0;
}

const success = runAllTests();
if (!success) {
  process.exit(1);
}
