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
      Mexico: { region: 'Mexico', year: 2026, month: 12, entries: [] },
      UK: { region: 'UK', year: 2026, month: 12, entries: [] },
      Brazil: { region: 'Brazil', year: 2026, month: 12, entries: [] },
      Asia: { region: 'Asia', year: 2026, month: 12, entries: [] },
      Africa: { region: 'Africa', year: 2026, month: 12, entries: [] }
    },
    records: [],
    awardsHistory: [],
    news: [],
    socialFeed: [],
    ecosystemContacts: {},
    globalHistoryTimeline: [],
    activeNarrativeChains: {},
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
  // CASO A: Jugador con 0 lanzamientos -> 0 nominaciones en todas las 8 categorías
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
        monthlyListeners: 200, totalStreams: 500,
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
      peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
      weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
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
        monthlyListeners: 15000, totalStreams: 25000,
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
      peakPosition: { Global: 35, Argentina: 12, USA: null, LatinAmerica: 25, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
      weeksOnChart: { Global: 2, Argentina: 6, USA: 0, LatinAmerica: 4, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
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
  // CASO D: Todas las 8 categorías tienen EXACTAMENTE 4 nominados
  // -------------------------------------------------------------
  console.log('\n🔹 CASO D: Todas las 8 categorías tienen EXACTAMENTE 4 nominados');
  {
    const world1 = createBaseWorld();
    const result1 = AwardEngine.conductAnnualAwards(world1, 2026);
    assert(result1.ceremony.categories.length === 8, `Debe haber exactamente 8 categorías en la ceremonia (obtenido: ${result1.ceremony.categories.length})`);
    for (const cat of result1.ceremony.categories) {
      assert(cat.nominees?.length === 4, `[Mundo Base] Categoría "${cat.name}" tiene ${cat.nominees?.length} nominados (esperado: 4)`);
      assert(cat.nomineeArtistIds.length === 4, `[Mundo Base] Categoría "${cat.name}" tiene ${cat.nomineeArtistIds.length} artistIds (esperado: 4)`);
    }

    // Mundo masivo con múltiples lanzamientos
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
          featuredArtistIds: s === 2 ? ['artist_bizarrap'] : [],
          genreId: artist.mainGenreId,
          subGenreIds: artist.subGenreIds || [],
          releaseYear: 2026,
          releaseMonth: s * 3,
          quality: 75 + (s * 5),
          commercialAppeal: 75,
          originality: 75,
          hypeAtRelease: 70,
          streamsTotal: 1000000 * s,
          streamsLastMonth: 200000,
          monthlyStreamsHistory: [],
          peakPosition: { Global: 10, Argentina: 5, USA: null, LatinAmerica: 8, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
          weeksOnChart: { Global: 5, Argentina: 6, USA: 0, LatinAmerica: 5, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: false,
          musicVideo: s === 1 ? { views: 5000000, budget: 10000, director: 'Director' } : undefined
        };
      }
    }
    const result2 = AwardEngine.conductAnnualAwards(world2, 2026);
    assert(result2.ceremony.categories.length === 8, 'Mundo masivo debe tener 8 categorías');
    for (const cat of result2.ceremony.categories) {
      assert(cat.nominees?.length === 4, `[Mundo Masivo] Categoría "${cat.name}" tiene ${cat.nominees?.length} nominados (esperado: 4)`);
    }
  }

  // -------------------------------------------------------------
  // CASO E: Anti-Monopolio Estricto (Máximo 1 nominación por artista por categoría)
  // -------------------------------------------------------------
  console.log('\n🔹 CASO E: Anti-Monopolio Estricto - Máximo 1 nominación por artista');
  {
    const world = createBaseWorld();
    const dukiId = 'artist_duki';

    // Creamos 10 canciones y 5 álbumes excelentes para Duki
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
        peakPosition: { Global: 1, Argentina: 1, USA: null, LatinAmerica: 1, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
        weeksOnChart: { Global: 20, Argentina: 20, USA: 0, LatinAmerica: 20, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
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
        peakChartPosition: { Global: 1, Argentina: 1, USA: null, LatinAmerica: 1, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
        awards: [],
        coverGradient: 'from-purple-900 to-black'
      };
    }

    const result = AwardEngine.conductAnnualAwards(world, 2026);

    for (const cat of result.ceremony.categories) {
      if (cat.id.includes('production')) continue; // Producción permite hasta 2 para productores
      const dukiNoms = cat.nominees?.filter(n => n.artistId === dukiId) || [];
      assert(dukiNoms.length <= 1, `Categoría "${cat.name}": Duki tiene ${dukiNoms.length} nominaciones (máximo permitido: 1)`);

      const artistIds = cat.nominees?.map(n => n.artistId) || [];
      const uniqueArtistIds = new Set(artistIds);
      assert(uniqueArtistIds.size === artistIds.length, `Categoría "${cat.name}": Cero monopolio (cada nominado pertenece a un artista diferente)`);
    }
  }

  // -------------------------------------------------------------
  // CASO F: Exclusión TAXATIVA de consagrados en Mejor Artista Nuevo
  // -------------------------------------------------------------
  console.log('\n🔹 CASO F: Exclusión taxativa de Duki, Nicki Nicole, Bizarrap en Mejor Artista Nuevo');
  {
    const world = createBaseWorld();
    const result = AwardEngine.conductAnnualAwards(world, 2026);
    const newArtistCat = result.ceremony.categories.find(c => c.id.includes('best_new_artist'));

    assert(Boolean(newArtistCat), 'La categoría Mejor Artista Nuevo debe existir');
    if (newArtistCat) {
      const nominatedIds = newArtistCat.nomineeArtistIds;
      assert(!nominatedIds.includes('artist_duki'), 'Duki NUNCA debe estar nominado a Mejor Artista Nuevo');
      assert(!nominatedIds.includes('artist_nicki_nicole'), 'Nicki Nicole NUNCA debe estar nominada a Mejor Artista Nuevo');
      assert(!nominatedIds.includes('artist_bizarrap'), 'Bizarrap NUNCA debe estar nominado a Mejor Artista Nuevo');
      assert(!nominatedIds.includes('artist_bad_bunny'), 'Bad Bunny NUNCA debe estar nominado a Mejor Artista Nuevo');

      // Verificar que ningún nominado sea Superstar, Mainstream, Established, Veteran o Legend
      for (const nom of newArtistCat.nominees || []) {
        const art = world.artists[nom.artistId];
        if (art) {
          const isEstablished = ['Established', 'Mainstream', 'Superstar', 'Veteran', 'Legend', 'Retired'].includes(art.careerStage);
          assert(!isEstablished, `Nominado "${art.name}" tiene careerStage="${art.careerStage}" (no permitido en Nuevo Artista)`);
          const careerLength = 2026 - art.careerStartYear;
          assert(careerLength <= 3, `Nominado "${art.name}" tiene ${careerLength} años de carrera (máximo: 3)`);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // CASO G: Mejor Artista Nuevo solo se gana UNA VEZ en la vida
  // -------------------------------------------------------------
  console.log('\n🔹 CASO G: Mejor Artista Nuevo solo se puede ganar una vez en la carrera');
  {
    const world = createBaseWorld();
    // Creamos un artista emergente excelente que YA ganó Mejor Artista Nuevo
    const pastWinnerId = 'artist_past_winner';
    world.artists[pastWinnerId] = {
      id: pastWinnerId,
      name: 'Ganador Pasado',
      isPlayer: false,
      country: 'Argentina',
      city: 'Córdoba',
      birthYear: 2004,
      careerStartYear: 2025,
      mainGenreId: 'trap_latino',
      subGenreIds: [],
      personality: { creativity: 95, ambition: 95, discipline: 90, charisma: 95, skill: 95, commercialAppeal: 95, originality: 95, riskTolerance: 80, sociability: 80, independence: 80 },
      stats: { popularity: 45, reputation: 35, artisticCredibility: 45, energy: 100, monthlyListeners: 80000, totalStreams: 150000, funds: 8000, fansCount: 20000, fanbaseLoyalty: 80, hype: 80 },
      careerStage: 'Breakout',
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [],
      awardsWon: ['Mejor Artista Nuevo (2025)'],
      hasWonBestNewArtist: true, // ¡Ya ganó!
      legacyScore: 20,
      isRetired: false,
      historicalNotes: [],
      generationIndex: 1,
      influences: []
    };

    world.songs['song_past_winner_hit'] = {
      id: 'song_past_winner_hit',
      title: 'Hit del Año Siguiente',
      artistId: pastWinnerId,
      featuredArtistIds: [],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 95,
      commercialAppeal: 95,
      originality: 95,
      hypeAtRelease: 80,
      streamsTotal: 1000000,
      streamsLastMonth: 200000,
      monthlyStreamsHistory: [],
      peakPosition: { Global: 10, Argentina: 2, USA: null, LatinAmerica: 5, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
      weeksOnChart: { Global: 8, Argentina: 10, USA: 0, LatinAmerica: 8, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
      longevityCurve: 'steady',
      isSingle: true,
      receptionRating: 5,
      isClassic: false,
      wentViral: true
    };

    const result = AwardEngine.conductAnnualAwards(world, 2026);
    const newArtistCat = result.ceremony.categories.find(c => c.id.includes('best_new_artist'));

    assert(Boolean(newArtistCat), 'La categoría Mejor Nuevo Artista debe existir');
    if (newArtistCat) {
      assert(!newArtistCat.nomineeArtistIds.includes(pastWinnerId), 'Artista que ya ganó Mejor Artista Nuevo NO debe ser nominado de nuevo');
      assert(newArtistCat.winnerArtistId !== pastWinnerId, 'Artista que ya ganó Mejor Artista Nuevo NO puede volver a ganar');
    }
  }

  // -------------------------------------------------------------
  // CASO H: Desduplicación estricta de títulos y normalización
  // -------------------------------------------------------------
  console.log('\n🔹 CASO H: Desduplicación estricta de títulos');
  {
    const norm1 = AwardEngine.normalizeTitle('Fuego Eterno');
    const norm2 = AwardEngine.normalizeTitle('  ¡fuego eterno!  ');
    const norm3 = AwardEngine.normalizeTitle('Fuégo Étérno');
    assert(norm1 === 'fuegoeterno', `normalizeTitle('Fuego Eterno') debe ser 'fuegoeterno'`);
    assert(norm1 === norm2, `normalizeTitle debe ignorar signos y espacios`);
    assert(norm1 === norm3, `normalizeTitle debe ignorar tildes`);
  }

  // -------------------------------------------------------------
  // CASO I: Atributos Enriquecidos de la Ceremonia (Odds, Quotes, Reasons, WinType)
  // -------------------------------------------------------------
  console.log('\n🔹 CASO I: Atributos Enriquecidos (Odds, Críticos, Razones, WinType)');
  {
    const world = createBaseWorld();
    const result = AwardEngine.conductAnnualAwards(world, 2026);

    for (const cat of result.ceremony.categories) {
      assert(Boolean(cat.field), `Categoría "${cat.name}" tiene campo asignado: ${cat.field}`);
      assert(Boolean(cat.winType), `Categoría "${cat.name}" tiene winType: ${cat.winType}`);
      assert(Boolean(cat.winTypeLabel), `Categoría "${cat.name}" tiene winTypeLabel: ${cat.winTypeLabel}`);
      assert(Boolean(cat.winnerReason), `Categoría "${cat.name}" tiene winnerReason no vacío`);

      for (const nom of cat.nominees || []) {
        assert(Boolean(nom.odds), `Nominado "${nom.artistName}" tiene odds asignadas`);
        assert(typeof nom.expectationPct === 'number', `Nominado "${nom.artistName}" tiene expectationPct numérico`);
        assert(Boolean(nom.criticQuote?.text), `Nominado "${nom.artistName}" tiene cita de prensa musical`);
        assert(Boolean(nom.criticQuote?.media), `Nominado "${nom.artistName}" tiene medio de prensa asociado`);
      }
    }
  }

  // -------------------------------------------------------------
  // CASO J: Integración GameEngine Avance Anual & Gala
  // -------------------------------------------------------------
  console.log('\n🔹 CASO J: GameEngine Avance Anual & Gala de Premios');
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

    const single = engine.releaseSong({
      title: 'Hit Mundial del Jugador',
      genreId: 'trap_latino',
      subGenreIds: [],
      featuredArtistIds: [],
      budgetProduction: 5000,
      budgetMarketing: 10000
    });

    assert(Boolean(single.id), 'El jugador debe poder publicar un single exitoso');

    // Avanzamos hasta diciembre (mes 12)
    engine.advanceCycle(12);

    const gala = engine.getActiveGalaCeremony();
    assert(Boolean(gala), 'La gala activa debe haberse disparado en diciembre');
    if (gala) {
      assert(gala.categories.length === 8, `La gala del GameEngine debe contener 8 categorías (obtenido: ${gala.categories.length})`);
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
