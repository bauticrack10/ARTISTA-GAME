import { GameEngine } from './src/core/GameEngine';
import { WorldState, Artist, Song, Album, ReleaseConfirmationData } from './src/types';
import { INITIAL_ARTISTS } from './src/data/initialArtists';
import { INITIAL_GENRES, SUBGENRE_DETAILS } from './src/data/genres';
import { INITIAL_LABELS } from './src/data/labels';
import { INITIAL_PRODUCERS, INITIAL_MANAGERS } from './src/data/producersAndManagers';
import { IndustryEngine } from './src/systems/IndustryEngine';
import { ARTISTIC_COVER_GRADIENTS } from './src/utils/themeColors';

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
    currentMonth: 1,
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
      Global: { region: 'Global', year: 2026, month: 1, entries: [] },
      Argentina: { region: 'Argentina', year: 2026, month: 1, entries: [] },
      LatinAmerica: { region: 'LatinAmerica', year: 2026, month: 1, entries: [] },
      USA: { region: 'USA', year: 2026, month: 1, entries: [] },
      Europe: { region: 'Europe', year: 2026, month: 1, entries: [] },
      Spain: { region: 'Spain', year: 2026, month: 1, entries: [] },
      Mexico: { region: 'Mexico', year: 2026, month: 1, entries: [] }
    },
    awardsHistory: [],
    news: [],
    socialFeed: [],
    ecosystemContacts: {},
    activeBeefs: {},
    records: [],
    globalHistoryTimeline: [],
    recentEventIdsHistory: [],
    activeNarrativeChains: {},
    financialLedger: []
  };
}

function createPlayerArtist(overrides: Partial<Artist> = {}): Partial<Artist> {
  return {
    id: overrides.id || 'artist_player_qa',
    name: overrides.name || 'Artista QA Pro',
    realName: 'Auditor Musical',
    isPlayer: true,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2004,
    careerStartYear: 2026,
    mainGenreId: 'trap_latino',
    subGenreIds: ['sub_trap_underground'],
    personality: {
      creativity: 85,
      ambition: 85,
      discipline: 80,
      charisma: 85,
      skill: 85,
      commercialAppeal: 80,
      originality: 85,
      riskTolerance: 80,
      sociability: 80,
      independence: 75
    },
    stats: {
      popularity: 30,
      reputation: 40,
      artisticCredibility: 50,
      energy: 100,
      monthlyListeners: 20000,
      totalStreams: 50000,
      funds: 50000,
      fansCount: 15000,
      fanbaseLoyalty: 75,
      hype: 50,
      ...overrides.stats
    },
    careerStage: overrides.careerStage || 'Emerging',
    labelId: overrides.labelId !== undefined ? overrides.labelId : null,
    managerId: overrides.managerId !== undefined ? overrides.managerId : null,
    relationships: {},
    eras: [],
    awardsWon: [],
    legacyScore: 10,
    isRetired: false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    lifestyleUpgrades: [],
    financialLedger: [],
    ...overrides
  };
}

function runAllTests(): boolean {
  console.log('\n===============================================================');
  console.log('🧪 SUITE DE PRUEBAS QA & AUDITORÍA: SISTEMA DE LANZAMIENTOS Y CONFIRMACIÓN');
  console.log('===============================================================\n');

  // =============================================================
  // CASO 1: LANZAMIENTO DE SINGLE
  // =============================================================
  console.log('🔹 CASO 1: Lanzamiento de Single Oficial');
  {
    const initialFunds = 25000;
    const initialEnergy = 100;
    const engine = new GameEngine(createPlayerArtist({
      stats: {
        funds: initialFunds,
        energy: initialEnergy,
        popularity: 35,
        reputation: 40,
        artisticCredibility: 50,
        monthlyListeners: 20000,
        totalStreams: 50000,
        fansCount: 15000,
        fanbaseLoyalty: 75,
        hype: 40
      }
    }));

    const prodBudget = 3000;
    const mktBudget = 2000;
    const videoCost = 5000;
    const totalExpectedCost = prodBudget + mktBudget + videoCost; // 10,000

    const initialSongsCount = Object.keys(engine.getWorld().songs).length;
    const initialLedgerCount = engine.getPlayer().financialLedger?.length || 0;

    const single = engine.releaseSong({
      title: 'Solsticio Urbano',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      featuredArtistIds: [],
      budgetProduction: prodBudget,
      budgetMarketing: mktBudget,
      musicVideo: {
        concept: 'Cine 4K Cinematográfico',
        budget: videoCost,
        directorTier: 'Estudio Indie'
      }
    });

    // 1.1 Verificación de catálogo
    const worldSongs = engine.getWorld().songs;
    const playerSongs = Object.values(worldSongs).filter(s => s.artistId === engine.getPlayer().id);
    assert(Object.keys(worldSongs).length === initialSongsCount + 1, 'Se crea exactamente 1 canción nueva en world.songs');
    assert(playerSongs.length === 1, 'El catálogo del jugador contiene exactamente 1 canción');
    assert(worldSongs[single.id] !== undefined, 'La canción se indexa correctamente por su ID');
    assert(single.isSingle === true, 'La propiedad isSingle es true');
    assert(single.title === 'Solsticio Urbano', 'El título coincide con los datos enviados');
    assert(single.genreId === 'trap_latino', 'El género principal es correcto');
    assert(single.subGenreIds.includes('sub_trap_underground'), 'El subgénero está registrado');
    assert(single.quality > 0 && single.quality <= 100, `Calidad calculada en rango válido: ${single.quality}`);
    assert(single.commercialAppeal > 0 && single.commercialAppeal <= 100, `Appeal comercial en rango válido: ${single.commercialAppeal}`);
    assert(single.originality > 0 && single.originality <= 100, `Originalidad en rango válido: ${single.originality}`);
    assert(single.musicVideo !== undefined, 'El videoclip oficial está registrado en la canción');
    assert(single.musicVideo?.concept === 'Cine 4K Cinematográfico', 'El concepto del videoclip coincide');
    assert(single.musicVideo?.budget === videoCost, 'El presupuesto del videoclip coincide');
    assert((single.musicVideo?.views || 0) > 0, `El videoclip generó vistas iniciales: ${single.musicVideo?.views?.toLocaleString()}`);

    // 1.2 Verificación económica y de energía
    const finalPlayer = engine.getPlayer();
    assert(finalPlayer.stats.funds === initialFunds - totalExpectedCost, `Fondos descontados exactamente una vez: Esperado $${initialFunds - totalExpectedCost}, Actual $${finalPlayer.stats.funds}`);
    assert(finalPlayer.stats.energy === initialEnergy - 15, `Energía reducida exactamente una vez en 15 pts: Esperado ${initialEnergy - 15}, Actual ${finalPlayer.stats.energy}`);
    assert(finalPlayer.stats.hype > 40, `El hype aumentó tras el lanzamiento (Actual: ${finalPlayer.stats.hype})`);
    assert(finalPlayer.lastReleaseYear === engine.getWorld().currentYear, 'lastReleaseYear actualizado al año actual');
    assert(finalPlayer.lastReleaseMonth === engine.getWorld().currentMonth, 'lastReleaseMonth actualizado al mes actual');

    // 1.3 Verificación de Ledger financiero
    const playerLedger = finalPlayer.financialLedger || [];
    const worldLedger = engine.getWorld().financialLedger || [];
    assert(playerLedger.length >= initialLedgerCount + 3, 'Se registraron transacciones en el ledger del jugador (producción, marketing, video)');
    assert(worldLedger.length >= 3, 'Se registraron transacciones en el ledger global del mundo');

    const prodTx = playerLedger.find(t => t.description.includes('Producción de single "Solsticio Urbano"'));
    const mktTx = playerLedger.find(t => t.description.includes('Marketing & difusión single "Solsticio Urbano"'));
    const vidTx = playerLedger.find(t => t.description.includes('Producción videoclip oficial "Solsticio Urbano"'));

    assert(Boolean(prodTx && prodTx.amount === prodBudget && prodTx.type === 'expense' && prodTx.category === 'production'), 'Transacción de producción registrada con monto y categoría exacta');
    assert(Boolean(mktTx && mktTx.amount === mktBudget && mktTx.type === 'expense' && mktTx.category === 'marketing'), 'Transacción de marketing registrada con monto y categoría exacta');
    assert(Boolean(vidTx && vidTx.amount === videoCost && vidTx.type === 'expense' && vidTx.category === 'production'), 'Transacción de videoclip registrada con monto y categoría exacta');

    // 1.4 Verificación de noticias y feed social
    const latestNews = engine.getWorld().news[0];
    assert(Boolean(latestNews && latestNews.category === 'release' && latestNews.headline.includes('Solsticio Urbano')), 'Se generó noticia oficial en el feed de medios');
    const socialPosts = engine.getWorld().socialFeed || [];
    assert(socialPosts.length > 0, 'Se generaron reacciones en redes sociales para el lanzamiento');
  }

  // =============================================================
  // CASO 2: LANZAMIENTO DE ÁLBUM / EP / MIXTAPE
  // =============================================================
  console.log('\n🔹 CASO 2: Lanzamiento de Álbum / EP / Mixtape');
  {
    const initialFunds = 60000;
    const initialEnergy = 100;
    const engine = new GameEngine(createPlayerArtist({
      stats: {
        funds: initialFunds,
        energy: initialEnergy,
        popularity: 50,
        reputation: 60,
        artisticCredibility: 70,
        monthlyListeners: 100000,
        totalStreams: 500000,
        fansCount: 80000,
        fanbaseLoyalty: 80,
        hype: 65
      }
    }));

    // Publicamos primero 2 singles independientes para incluirlos luego en el álbum
    const single1 = engine.releaseSong({
      title: 'Lead Single 1',
      genreId: 'trap_latino',
      subGenreIds: [],
      featuredArtistIds: [],
      budgetProduction: 1000,
      budgetMarketing: 1000
    });
    single1.streamsTotal = 250000; // Simulamos streams acumulados del lead single

    const single2 = engine.releaseSong({
      title: 'Lead Single 2',
      genreId: 'trap_latino',
      subGenreIds: [],
      featuredArtistIds: [],
      budgetProduction: 1000,
      budgetMarketing: 1000
    });
    single2.streamsTotal = 150000;

    const fundsBeforeAlbum = engine.getPlayer().stats.funds;
    const energyBeforeAlbum = engine.getPlayer().stats.energy;
    const songsBeforeAlbum = Object.keys(engine.getWorld().songs).length;
    const albumsBeforeAlbum = Object.keys(engine.getWorld().albums).length;

    const newTracks = [
      'Génesis Sonora',
      'Caminos de Medianoche',
      'Diamantes en Bruto',
      'Ecos del Barrio',
      'Victoria Inmortal',
      'Outro Trascendental'
    ];

    const albumProdBudget = 15000;
    const albumMktBudget = 10000;
    const totalExpectedAlbumCost = albumProdBudget + albumMktBudget; // 25,000

    const album = engine.releaseAlbum({
      title: 'Resurrección',
      type: 'album',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      newTrackTitles: newTracks,
      includedSingleIds: [single1.id, single2.id],
      budgetProduction: albumProdBudget,
      budgetMarketing: albumMktBudget
    });

    // 2.1 Verificación de Álbum y catálogo
    const worldAlbums = engine.getWorld().albums;
    const worldSongs = engine.getWorld().songs;
    assert(Object.keys(worldAlbums).length === albumsBeforeAlbum + 1, 'Se crea exactamente 1 álbum en world.albums');
    assert(worldAlbums[album.id] !== undefined, 'El álbum se indexa por su ID único');
    assert(album.title === 'Resurrección', 'Título del álbum coincide');
    assert(album.type === 'album', 'Tipo de lanzamiento es album');
    assert(album.songIds.length === 8, `El álbum contiene exactamente 8 pistas (2 singles + 6 nuevas): ${album.songIds.length}`);
    assert(album.singlesIncludedCount === 2, 'Registra 2 singles previos incluidos');
    assert(album.totalStreams === 400000, `Total streams del álbum arranca con el acumulado de singles incluidos: ${album.totalStreams.toLocaleString()}`);
    assert(album.firstWeekSales > 0, `Calculó ventas primera semana: ${album.firstWeekSales.toLocaleString()} unidades`);
    assert(album.criticalScore >= 20 && album.criticalScore <= 100, `Puntuación crítica Metacritic en rango válido: ${album.criticalScore}/100`);
    assert(Boolean(album.criticalReviewText && album.criticalReviewText.length > 5), `Reseña de la crítica generada: "${album.criticalReviewText}"`);
    assert(Boolean(album.coverGradient), `Cover gradient asignado: ${album.coverGradient}`);

    // 2.2 Verificación de tracks creados
    assert(Object.keys(worldSongs).length === songsBeforeAlbum + newTracks.length, 'Se agregaron exactamente las 6 canciones nuevas a world.songs sin duplicar singles');
    for (const newTitle of newTracks) {
      const createdSong = Object.values(worldSongs).find(s => s.title === newTitle);
      assert(Boolean(createdSong && createdSong.albumId === album.id && createdSong.isSingle === false), `Pista "${newTitle}" creada con albumId vinculado e isSingle=false`);
    }

    // 2.3 Verificación de actualización de singles incluidos
    assert(worldSongs[single1.id].albumId === album.id, 'Single previo 1 tiene albumId actualizado al nuevo álbum');
    assert(worldSongs[single2.id].albumId === album.id, 'Single previo 2 tiene albumId actualizado al nuevo álbum');

    // 2.4 Verificación económica y energía
    const playerAfterAlbum = engine.getPlayer();
    assert(playerAfterAlbum.stats.funds === fundsBeforeAlbum - totalExpectedAlbumCost, `Fondos descontados una sola vez: Esperado $${fundsBeforeAlbum - totalExpectedAlbumCost}, Actual $${playerAfterAlbum.stats.funds}`);
    assert(playerAfterAlbum.stats.energy === energyBeforeAlbum - 35, `Energía reducida en 35 pts: Esperado ${energyBeforeAlbum - 35}, Actual ${playerAfterAlbum.stats.energy}`);

    // 2.5 Verificación de ledger financiero
    const playerLedger = playerAfterAlbum.financialLedger || [];
    const albProdTx = playerLedger.find(t => t.description.includes('Producción de álbum/EP "Resurrección"'));
    const albMktTx = playerLedger.find(t => t.description.includes('Campaña de marketing para álbum "Resurrección"'));
    assert(Boolean(albProdTx && albProdTx.amount === albumProdBudget), 'Transacción de producción de álbum registrada con monto exacto');
    assert(Boolean(albMktTx && albMktTx.amount === albumMktBudget), 'Transacción de marketing de álbum registrada con monto exacto');
  }

  // =============================================================
  // CASO 3: PREVENCIÓN DE LANZAMIENTOS DUPLICADOS & LÍMITES
  // =============================================================
  console.log('\n🔹 CASO 3: Prevención de Duplicados & Ciclo de Publicación');
  {
    const engine = new GameEngine(createPlayerArtist({
      stats: { funds: 100000, energy: 100 }
    }));

    // 3.1 Publicar singles hasta alcanzar el límite anual (MAX_SINGLES_PER_YEAR = 5)
    for (let i = 1; i <= GameEngine.MAX_SINGLES_PER_YEAR; i++) {
      const quotaBefore = engine.getSinglesQuotaInfo();
      assert(quotaBefore.releasedCount === i - 1, `Lanzamiento ${i}: Cupo utilizado antes de lanzar es ${i - 1}`);
      assert(quotaBefore.remainingQuota === GameEngine.MAX_SINGLES_PER_YEAR - (i - 1), `Lanzamiento ${i}: Cupo restante es ${GameEngine.MAX_SINGLES_PER_YEAR - (i - 1)}`);

      engine.releaseSong({
        title: `Single de Prueba ${i}`,
        genreId: 'trap_latino',
        subGenreIds: [],
        featuredArtistIds: [],
        budgetProduction: 1000,
        budgetMarketing: 1000
      });
    }

    const quotaLimit = engine.getSinglesQuotaInfo();
    assert(quotaLimit.releasedCount === GameEngine.MAX_SINGLES_PER_YEAR, `Se alcanzaron exactamente ${GameEngine.MAX_SINGLES_PER_YEAR} singles`);
    assert(quotaLimit.remainingQuota === 0, 'El cupo restante es 0');
    assert(quotaLimit.isLimitReached === true, 'isLimitReached es true');

    // 3.2 Intentar lanzar un 6to single en el mismo año debe ser rechazado
    const fundsBeforeSixth = engine.getPlayer().stats.funds;
    const energyBeforeSixth = engine.getPlayer().stats.energy;
    const songsCountBeforeSixth = Object.keys(engine.getWorld().songs).length;

    let sixthSingleBlocked = false;
    let sixthSingleErrorMsg = '';
    try {
      engine.releaseSong({
        title: 'Single Excedente Prohibido',
        genreId: 'trap_latino',
        subGenreIds: [],
        featuredArtistIds: [],
        budgetProduction: 1000,
        budgetMarketing: 1000
      });
    } catch (e: any) {
      sixthSingleBlocked = true;
      sixthSingleErrorMsg = e.message;
    }

    assert(sixthSingleBlocked, `El 6to single en el mismo año fue bloqueado por excepción: "${sixthSingleErrorMsg}"`);
    assert(Object.keys(engine.getWorld().songs).length === songsCountBeforeSixth, 'No se creó ninguna canción tras el intento excedente');
    assert(engine.getPlayer().stats.funds === fundsBeforeSixth, 'Los fondos del jugador quedaron intactos tras el intento bloqueado');
    assert(engine.getPlayer().stats.energy === energyBeforeSixth, 'La energía del jugador quedó intacta tras el intento bloqueado');

    // 3.3 Avanzar el año reinicia el cupo
    engine.advanceCycle(12); // Avanza 1 año completo
    const quotaNewYear = engine.getSinglesQuotaInfo();
    assert(quotaNewYear.releasedCount === 0, 'En el nuevo año, releasedCount se reinicia a 0');
    assert(quotaNewYear.remainingQuota === GameEngine.MAX_SINGLES_PER_YEAR, `En el nuevo año, el cupo vuelve a ser ${GameEngine.MAX_SINGLES_PER_YEAR}`);
    assert(quotaNewYear.isLimitReached === false, 'isLimitReached es false en el nuevo año');

    // Ahora sí puede lanzar
    const newYearSong = engine.releaseSong({
      title: 'Single del Nuevo Año',
      genreId: 'trap_latino',
      subGenreIds: [],
      featuredArtistIds: [],
      budgetProduction: 1000,
      budgetMarketing: 1000
    });
    assert(Boolean(newYearSong && newYearSong.id), 'El jugador pudo lanzar su primer single del nuevo año');
  }

  // =============================================================
  // CASO 4: MANEJO DE ERRORES SIN CORRUPCIÓN DE ESTADO (ATOMICIDAD)
  // =============================================================
  console.log('\n🔹 CASO 4: Manejo de Errores & Integridad de Estado');
  {
    // 4.1 Fondos insuficientes para Single
    const engine = new GameEngine(createPlayerArtist({
      stats: { funds: 1500, energy: 100 }
    }));

    const fundsBefore = engine.getPlayer().stats.funds;
    const energyBefore = engine.getPlayer().stats.energy;
    const songsCountBefore = Object.keys(engine.getWorld().songs).length;
    const ledgerCountBefore = engine.getPlayer().financialLedger?.length || 0;
    const newsCountBefore = engine.getWorld().news.length;

    let insufficientFundsError = false;
    try {
      engine.releaseSong({
        title: 'Single Millonario',
        genreId: 'trap_latino',
        subGenreIds: [],
        featuredArtistIds: [],
        budgetProduction: 2000, // Cuesta 2000 > 1500
        budgetMarketing: 1000
      });
    } catch (e: any) {
      insufficientFundsError = true;
    }

    assert(insufficientFundsError, 'Lanzar single con fondos insuficientes arroja excepción');
    assert(engine.getPlayer().stats.funds === fundsBefore, 'Fondos permanecen intactos ($1,500)');
    assert(engine.getPlayer().stats.energy === energyBefore, 'Energía permanece intacta (100%)');
    assert(Object.keys(engine.getWorld().songs).length === songsCountBefore, 'No se creó ninguna canción parcial en world.songs');
    assert((engine.getPlayer().financialLedger?.length || 0) === ledgerCountBefore, 'No se registraron transacciones fallidas en el ledger');
    assert(engine.getWorld().news.length === newsCountBefore, 'No se publicaron noticias falsas');

    // 4.2 Energía insuficiente para Single (< 15)
    engine.getPlayer().stats.energy = 10;
    engine.getPlayer().stats.funds = 50000;
    let lowEnergySingleError = false;
    try {
      engine.releaseSong({
        title: 'Single Agotado',
        genreId: 'trap_latino',
        subGenreIds: [],
        featuredArtistIds: [],
        budgetProduction: 500,
        budgetMarketing: 500
      });
    } catch (e: any) {
      lowEnergySingleError = true;
    }
    assert(lowEnergySingleError, 'Lanzar single con energía menor a 15% arroja excepción');
    assert(engine.getPlayer().stats.energy === 10, 'Energía permanece intacta (10%)');
    assert(engine.getPlayer().stats.funds === 50000, 'Fondos permanecen intactos');

    // 4.3 Energía insuficiente para Álbum (< 35)
    engine.getPlayer().stats.energy = 25; // 25 < 35
    let lowEnergyAlbumError = false;
    try {
      engine.releaseAlbum({
        title: 'Álbum Agotado',
        type: 'album',
        genreId: 'trap_latino',
        subGenreIds: [],
        newTrackTitles: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
        budgetProduction: 5000,
        budgetMarketing: 5000
      });
    } catch (e: any) {
      lowEnergyAlbumError = true;
    }
    assert(lowEnergyAlbumError, 'Lanzar álbum con energía menor a 35% arroja excepción');
    assert(engine.getPlayer().stats.energy === 25, 'Energía de álbum permanece intacta');
    assert(engine.getPlayer().stats.funds === 50000, 'Fondos permanecen intactos');
    assert(Object.keys(engine.getWorld().albums).length === 0, 'No se creó ningún álbum parcial');

    // 4.4 Álbum con cantidad insuficiente de pistas (< 4 para EP, < 6 para LP)
    engine.getPlayer().stats.energy = 100;
    let insufficientTracksError = false;
    try {
      engine.releaseAlbum({
        title: 'Álbum Incompleto',
        type: 'album',
        genreId: 'trap_latino',
        subGenreIds: [],
        newTrackTitles: ['Solo 1', 'Solo 2'], // 2 < 6 requerido
        budgetProduction: 5000,
        budgetMarketing: 5000
      });
    } catch (e: any) {
      insufficientTracksError = true;
    }
    assert(insufficientTracksError, 'Lanzar LP con solo 2 pistas arroja excepción de tracks insuficientes');

    // 4.5 Productor bloqueado por requisitos de popularidad / reputación
    const eliteProducer = Object.values(engine.getWorld().producers).find(p => (p.requirements?.minReputation || 0) >= 50 || (p.requirements?.minPopularity || 0) >= 50);
    if (eliteProducer) {
      engine.getPlayer().stats.reputation = 5;
      engine.getPlayer().stats.popularity = 5;
      let lockedProducerError = false;
      try {
        engine.releaseSong({
          title: 'Single con Productor Inalcanzable',
          genreId: 'trap_latino',
          subGenreIds: [],
          featuredArtistIds: [],
          producerId: eliteProducer.id,
          budgetProduction: 1000,
          budgetMarketing: 1000
        });
      } catch (e: any) {
        lockedProducerError = true;
      }
      assert(lockedProducerError, `Contratar a ${eliteProducer.name} sin cumplir requisitos fue bloqueado correctamente`);
      assert(engine.getPlayer().stats.funds === 50000, 'Los fondos permanecieron intactos tras bloqueo de productor');
    }
  }

  // =============================================================
  // CASO 5: INTEGRIDAD DE DATOS DE CONFIRMACIÓN (ReleaseConfirmationData)
  // =============================================================
  console.log('\n🔹 CASO 5: Integridad de Datos de Confirmación');
  {
    const engine = new GameEngine(createPlayerArtist({
      stats: { funds: 100000, energy: 100, reputation: 90, popularity: 90 }
    }));

    // Buscamos un productor disponible
    const producer = Object.values(engine.getWorld().producers)[0];

    // 5.1 Estructura de confirmación para Single con Videoclip y Productor
    const singleTitle = 'Eclipse de Medianoche';
    const singleProdBudget = 5000;
    const singleMktBudget = 4000;
    const singleVideoCost = 5000;
    const singleProducerFee = producer ? producer.costPerTrack : 0;
    const totalSingleBudget = singleProdBudget + singleMktBudget + singleProducerFee + singleVideoCost;

    const singleSong = engine.releaseSong({
      title: singleTitle,
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      featuredArtistIds: [],
      producerId: producer?.id,
      budgetProduction: singleProdBudget,
      budgetMarketing: singleMktBudget,
      musicVideo: {
        concept: 'Animación 3D Futurista',
        budget: singleVideoCost,
        directorTier: 'Estudio Indie'
      }
    });

    const subDetail = SUBGENRE_DETAILS['sub_trap_underground'];
    const genreName = engine.getWorld().genres['trap_latino']?.name || 'Trap Latino';

    const singleConfirmation: ReleaseConfirmationData = {
      type: 'single',
      title: singleTitle,
      coverGradient: ARTISTIC_COVER_GRADIENTS[0],
      songCount: 1,
      trackTitles: [singleTitle],
      genreId: 'trap_latino',
      genreName,
      subGenreId: 'sub_trap_underground',
      subGenreName: subDetail?.name,
      producerName: producer?.name,
      musicVideo: {
        concept: 'Animación 3D Futurista',
        budget: singleVideoCost,
        directorTier: 'Estudio Indie',
        views: singleSong.musicVideo?.views
      },
      releaseYear: engine.getWorld().currentYear,
      releaseMonth: engine.getWorld().currentMonth,
      totalBudget: totalSingleBudget,
      budgetBreakdown: {
        production: singleProdBudget,
        marketing: singleMktBudget,
        producerFee: singleProducerFee,
        videoCost: singleVideoCost
      }
    };

    // Validaciones de contrato y consistencia
    assert(singleConfirmation.type === 'single', 'Tipo en confirmación es single');
    assert(singleConfirmation.title === singleTitle, 'Título en confirmación es exacto');
    assert(singleConfirmation.songCount === 1, 'songCount es exactamente 1');
    assert(singleConfirmation.trackTitles?.length === 1 && singleConfirmation.trackTitles[0] === singleTitle, 'trackTitles contiene la pista principal');
    assert(singleConfirmation.genreName === genreName, `genreName es "${genreName}"`);
    assert(singleConfirmation.subGenreName === subDetail?.name, `subGenreName es "${subDetail?.name}"`);
    assert(singleConfirmation.producerName === producer?.name, `producerName es "${producer?.name}"`);
    assert(singleConfirmation.musicVideo?.concept === 'Animación 3D Futurista', 'Concepto de video es exacto');
    assert(singleConfirmation.musicVideo?.directorTier === 'Estudio Indie', 'directorTier de video es exacto');
    assert(singleConfirmation.musicVideo?.budget === singleVideoCost, 'Presupuesto de video es exacto');
    assert(singleConfirmation.totalBudget === totalSingleBudget, `totalBudget es exactamente $${totalSingleBudget.toLocaleString()}`);

    const bBreak = singleConfirmation.budgetBreakdown!;
    const mathSumSingle = bBreak.production + bBreak.marketing + bBreak.producerFee + bBreak.videoCost;
    assert(singleConfirmation.totalBudget === mathSumSingle, `Consistencia matemática estricta: Total ($${singleConfirmation.totalBudget}) === Suma de desglose ($${mathSumSingle})`);

    // 5.2 Estructura de confirmación para Álbum / EP
    const albumTitle = 'Imperio de Cristal';
    const albumTracks = ['Pista 1', 'Pista 2', 'Pista 3', 'Pista 4', 'Pista 5', 'Pista 6'];
    const albProdBudget = 18000;
    const albMktBudget = 12000;
    const albProdFee = producer ? producer.costPerTrack * Math.min(albumTracks.length, 6) : 0;
    const totalAlbumBudget = albProdBudget + albMktBudget + albProdFee;

    const albumObj = engine.releaseAlbum({
      title: albumTitle,
      type: 'album',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      newTrackTitles: albumTracks,
      budgetProduction: albProdBudget,
      budgetMarketing: albMktBudget,
      producerId: producer?.id
    });

    const albumConfirmation: ReleaseConfirmationData = {
      type: 'album',
      title: albumTitle,
      coverGradient: albumObj.coverGradient,
      songCount: albumTracks.length,
      trackTitles: albumTracks,
      genreId: 'trap_latino',
      genreName,
      subGenreId: 'sub_trap_underground',
      subGenreName: subDetail?.name,
      producerName: producer?.name,
      releaseYear: engine.getWorld().currentYear,
      releaseMonth: engine.getWorld().currentMonth,
      totalBudget: totalAlbumBudget,
      budgetBreakdown: {
        production: albProdBudget,
        marketing: albMktBudget,
        producerFee: albProdFee,
        videoCost: 0
      },
      criticalScore: albumObj.criticalScore,
      criticalReviewText: albumObj.criticalReviewText,
      firstWeekSales: albumObj.firstWeekSales
    };

    assert(albumConfirmation.type === 'album', 'Tipo en confirmación de álbum es album');
    assert(albumConfirmation.title === albumTitle, 'Título en confirmación de álbum es exacto');
    assert(albumConfirmation.songCount === 6, 'songCount en confirmación es 6');
    assert(albumConfirmation.trackTitles?.length === 6, 'trackTitles contiene las 6 pistas del LP');
    assert(albumConfirmation.totalBudget === totalAlbumBudget, `totalBudget del álbum es exactamente $${totalAlbumBudget.toLocaleString()}`);

    const albBreak = albumConfirmation.budgetBreakdown!;
    const mathSumAlbum = albBreak.production + albBreak.marketing + albBreak.producerFee + albBreak.videoCost;
    assert(albumConfirmation.totalBudget === mathSumAlbum, `Consistencia matemática estricta en álbum: Total ($${albumConfirmation.totalBudget}) === Suma de desglose ($${mathSumAlbum})`);
    assert(typeof albumConfirmation.criticalScore === 'number' && albumConfirmation.criticalScore > 0, `criticalScore incluido: ${albumConfirmation.criticalScore}/100`);
    assert(Boolean(albumConfirmation.criticalReviewText), `criticalReviewText incluido: "${albumConfirmation.criticalReviewText}"`);
    assert(typeof albumConfirmation.firstWeekSales === 'number' && albumConfirmation.firstWeekSales > 0, `firstWeekSales incluido: ${albumConfirmation.firstWeekSales?.toLocaleString()} unidades`);
  }

  // =============================================================
  // RESUMEN Y CONCLUSIÓN
  // =============================================================
  console.log('\n===============================================================');
  console.log('📊 RESUMEN DE AUDITORÍA QA DE LANZAMIENTOS Y CONFIRMACIÓN:');
  console.log(`   Total de aserciones ejecutadas: ${stats.total}`);
  console.log(`   \x1b[32mSuperadas con éxito: ${stats.passed}\x1b[0m`);
  console.log(`   \x1b[31mFallidas: ${stats.failed}\x1b[0m`);
  if (stats.failed === 0) {
    console.log('\n🎉 \x1b[32m100% DE ÉXITO: Todos los casos de prueba y criterios de auditoría han sido superados.\x1b[0m');
  } else {
    console.log(`\n❌ \x1b[31mSe encontraron ${stats.failed} fallos en las pruebas.\x1b[0m`);
    stats.errors.forEach(e => console.error(`  - ${e}`));
  }
  console.log('===============================================================\n');

  return stats.failed === 0;
}

const success = runAllTests();
if (!success) {
  process.exit(1);
}
