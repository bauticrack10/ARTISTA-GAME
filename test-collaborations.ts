import { GameEngine } from './src/core/GameEngine';
import {
  WorldState,
  Artist,
  Song,
  Album,
  ReleaseConfirmationData,
  RegionalChart,
  ChartEntry
} from './src/types';
import { INITIAL_ARTISTS } from './src/data/initialArtists';
import { INITIAL_GENRES, SUBGENRE_DETAILS } from './src/data/genres';
import { INITIAL_LABELS } from './src/data/labels';
import { INITIAL_PRODUCERS, INITIAL_MANAGERS } from './src/data/producersAndManagers';
import { RelationshipEngine } from './src/systems/RelationshipEngine';
import { ChartEngine } from './src/systems/ChartEngine';
import { IndustryEngine } from './src/systems/IndustryEngine';

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

function createPlayerArtist(overrides: any = {}): any {
  return {
    id: overrides.id || 'artist_player_qa',
    name: overrides.name || 'Artista Protagonista QA',
    realName: 'MC Auditor',
    isPlayer: true,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2005,
    careerStartYear: 2026,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || ['sub_trap_underground'],
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
      independence: 75,
      ...(overrides.personality || {})
    },
    stats: {
      popularity: 40,
      reputation: 50,
      artisticCredibility: 60,
      energy: 100,
      monthlyListeners: 35000,
      totalStreams: 90000,
      funds: 60000,
      fansCount: 20000,
      fanbaseLoyalty: 75,
      hype: 50,
      ...(overrides.stats || {})
    },
    careerStage: overrides.careerStage || 'Emerging',
    labelId: overrides.labelId !== undefined ? overrides.labelId : null,
    managerId: overrides.managerId !== undefined ? overrides.managerId : null,
    relationships: overrides.relationships || {},
    eras: overrides.eras || [],
    awardsWon: overrides.awardsWon || [],
    legacyScore: 15,
    isRetired: false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    lifestyleUpgrades: [],
    financialLedger: [],
    ...overrides
  };
}

function createTestCollaborator(overrides: any = {}): any {
  return {
    id: overrides.id || 'artist_collab_partner',
    name: overrides.name || 'Duki Clone Collab',
    realName: 'Mauro Collab',
    isPlayer: false,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2002,
    careerStartYear: 2024,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || ['sub_trap_underground'],
    personality: {
      creativity: 88,
      ambition: 85,
      discipline: 75,
      charisma: 90,
      skill: 86,
      commercialAppeal: 85,
      originality: 82,
      riskTolerance: 75,
      sociability: 85,
      independence: 70,
      ...(overrides.personality || {})
    },
    stats: {
      popularity: 55,
      reputation: 60,
      artisticCredibility: 70,
      energy: 100,
      monthlyListeners: 150000,
      totalStreams: 500000,
      funds: 120000,
      fansCount: 90000,
      fanbaseLoyalty: 80,
      hype: 65,
      ...(overrides.stats || {})
    },
    careerStage: overrides.careerStage || 'Established',
    labelId: null,
    managerId: null,
    activeContract: null,
    relationships: overrides.relationships || {},
    eras: [],
    awardsWon: [],
    legacyScore: 30,
    isRetired: false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    lifestyleUpgrades: [],
    financialLedger: [],
    ...overrides
  };
}

export function runCollaborationTests(): boolean {
  console.log('\n===============================================================');
  console.log('🧪 SUITE DE PRUEBAS QA & AUDITORÍA: SISTEMA DE COLABORACIONES');
  console.log('===============================================================\n');

  // =============================================================
  // CASO 1: ACEPTACIÓN EXITOSA DE COLABORACIÓN (SINGLE CON FEAT)
  // =============================================================
  console.log('🔹 CASO 1: Aceptación Exitosa de Colaboración (Single con Feat)');
  {
    const initialPlayerFunds = 40000;
    const initialPlayerEnergy = 100;
    const initialPlayerFans = 20000;
    const initialPlayerPop = 40;
    const initialPlayerHype = 45;

    const partner = createTestCollaborator({
      id: 'artist_partner_c1',
      name: 'Neo Pistola QA',
      mainGenreId: 'trap_latino',
      stats: {
        popularity: 50,
        reputation: 60,
        artisticCredibility: 65,
        energy: 100,
        monthlyListeners: 120000,
        totalStreams: 400000,
        funds: 80000,
        fansCount: 70000,
        fanbaseLoyalty: 75,
        hype: 60
      }
    });

    const engine = new GameEngine(createPlayerArtist({
      stats: {
        funds: initialPlayerFunds,
        energy: initialPlayerEnergy,
        fansCount: initialPlayerFans,
        popularity: initialPlayerPop,
        hype: initialPlayerHype,
        reputation: 50,
        artisticCredibility: 60,
        monthlyListeners: 30000,
        totalStreams: 80000
      }
    }));

    // Inyectar colaborador en el mundo
    engine.getWorld().artists[partner.id] = partner;

    // Establecer afinidad positiva previa
    RelationshipEngine.modifyRelationship(
      engine.getPlayer(),
      partner,
      30,
      40,
      'friend',
      'Buena onda forjada en festivales y sesiones previas.'
    );

    const initialSongsCount = Object.keys(engine.getWorld().songs).length;
    const initialLedgerCount = engine.getPlayer().financialLedger?.length || 0;
    const initialWorldLedgerCount = engine.getWorld().financialLedger?.length || 0;
    const initialNewsCount = engine.getWorld().news.length;
    const initialSocialCount = engine.getWorld().socialFeed?.length || 0;

    const prodBudget = 4000;
    const mktBudget = 3000;
    const totalExpectedCost = prodBudget + mktBudget; // 7,000

    const collabResult = engine.proposeAndExecuteCollab({
      targetArtistId: partner.id,
      type: 'single_feat',
      title: 'Tumbando Fronteras',
      creditOrder: 'player_feat_target',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      budgetProduction: prodBudget,
      budgetMarketing: mktBudget,
      longevityCurve: 'explosive_drop'
    });

    // 1.1 Verificación de aceptación y contrato de retorno
    assert(collabResult.success === true, 'La propuesta de colaboración fue aceptada exitosamente');
    assert(collabResult.song !== undefined, 'Se generó y retornó el objeto Song');
    assert(collabResult.confirmationData !== undefined, 'Se generó y retornó el objeto ReleaseConfirmationData');

    const song = collabResult.song!;
    const worldSongs = engine.getWorld().songs;

    // 1.2 Verificación de catálogo y propiedades de la canción
    assert(Object.keys(worldSongs).length === initialSongsCount + 1, 'Se agregó exactamente 1 canción en world.songs');
    assert(worldSongs[song.id] !== undefined, 'La canción se indexó correctamente con su ID');
    assert(song.title === 'Tumbando Fronteras', 'El título de la canción es exacto');
    assert(song.artistId === engine.getPlayer().id, 'El artistId corresponde al jugador (artista principal)');
    assert(Array.isArray(song.featuredArtistIds), 'featuredArtistIds es un arreglo');
    assert(song.featuredArtistIds.length === 1 && song.featuredArtistIds[0] === partner.id, `featuredArtistIds contiene exactamente al colaborador: [${song.featuredArtistIds.join(', ')}]`);
    assert(song.isSingle === true, 'isSingle es true para single_feat');
    assert(song.genreId === 'trap_latino', 'El género principal de la canción es correcto');
    assert(song.subGenreIds.includes('sub_trap_underground'), 'El subgénero está registrado');
    assert(song.quality >= 20 && song.quality <= 100, `Calidad sonora calculada en rango válido: ${song.quality}/100`);
    assert(song.commercialAppeal >= 20 && song.commercialAppeal <= 100, `Appeal comercial calculado en rango válido: ${song.commercialAppeal}/100`);
    assert(song.originality >= 20 && song.originality <= 100, `Originalidad calculada en rango válido: ${song.originality}/100`);
    assert(song.longevityCurve === 'explosive_drop', 'La curva de longevidad seleccionada fue respetada');

    // 1.3 Verificación económica y de energía (Atomicidad estricta)
    const playerAfter = engine.getPlayer();
    assert(playerAfter.stats.funds === initialPlayerFunds - totalExpectedCost, `Fondos descontados exactamente una vez: Esperado $${initialPlayerFunds - totalExpectedCost}, Actual $${playerAfter.stats.funds}`);
    assert(playerAfter.stats.energy === initialPlayerEnergy - 15, `Energía reducida exactamente en 15 pts: Esperado ${initialPlayerEnergy - 15}, Actual ${playerAfter.stats.energy}`);
    assert(playerAfter.lastReleaseYear === engine.getWorld().currentYear, 'lastReleaseYear actualizado');
    assert(playerAfter.lastReleaseMonth === engine.getWorld().currentMonth, 'lastReleaseMonth actualizado');

    // 1.4 Verificación de Ledger financiero
    const playerLedger = playerAfter.financialLedger || [];
    const worldLedger = engine.getWorld().financialLedger || [];
    assert(playerLedger.length === initialLedgerCount + 2, 'Se registraron exactamente 2 transacciones en el ledger del jugador (producción y marketing)');
    assert(worldLedger.length === initialWorldLedgerCount + 2, 'Se registraron exactamente 2 transacciones en el ledger global');

    const prodTx = playerLedger.find(t => t.description.includes('Producción de colaboración "Tumbando Fronteras"'));
    const mktTx = playerLedger.find(t => t.description.includes('Marketing & difusión de colaboración "Tumbando Fronteras"'));
    assert(Boolean(prodTx && prodTx.amount === prodBudget && prodTx.type === 'expense' && prodTx.category === 'production'), 'Transacción de producción de collab registrada con monto exacto');
    assert(Boolean(mktTx && mktTx.amount === mktBudget && mktTx.type === 'expense' && mktTx.category === 'marketing'), 'Transacción de marketing de collab registrada con monto exacto');

    // 1.5 Verificación de bonos de química musical y cross-fanbase
    assert(playerAfter.stats.fansCount > initialPlayerFans, `El jugador ganó fans por cross-fanbase: ${initialPlayerFans} -> ${playerAfter.stats.fansCount}`);
    assert(playerAfter.stats.popularity >= initialPlayerPop, `La popularidad del jugador creció o se consolidó: ${playerAfter.stats.popularity}`);
    assert(playerAfter.stats.hype > initialPlayerHype, `El hype del jugador aumentó tras el lanzamiento: ${playerAfter.stats.hype}`);
    assert(partner.stats.fansCount > 70000, `El colaborador también recibió beneficio de exposición/fans: ${partner.stats.fansCount}`);

    // 1.6 Verificación de evolución de relaciones mutuas (+afinidad, +respeto, pastCollabsCount)
    const relPlayerToPartner = playerAfter.relationships[partner.id];
    const relPartnerToPlayer = partner.relationships[playerAfter.id];
    assert(relPlayerToPartner !== undefined && relPartnerToPlayer !== undefined, 'Ambos artistas poseen el registro de relación mutua');
    assert(relPlayerToPartner.pastCollabsCount === 1, `pastCollabsCount incrementó a 1 en el jugador: ${relPlayerToPartner.pastCollabsCount}`);
    assert(relPartnerToPlayer.pastCollabsCount === 1, `pastCollabsCount incrementó a 1 en el colaborador: ${relPartnerToPlayer.pastCollabsCount}`);
    assert(relPlayerToPartner.affinity > 30, `Afinidad incrementó en al menos 15 pts (Actual: ${relPlayerToPartner.affinity})`);
    assert(relPlayerToPartner.respect > 40, `Respeto incrementó en al menos 15 pts (Actual: ${relPlayerToPartner.respect})`);
    const lastNoteA = relPlayerToPartner.history[relPlayerToPartner.history.length - 1];
    assert(Boolean(lastNoteA && lastNoteA.includes('Tumbando Fronteras') && lastNoteA.includes('Química')), `Nota histórica registrada en relación: "${lastNoteA}"`);

    // 1.7 Verificación de Noticias y Social Feed
    const latestNews = engine.getWorld().news[0];
    assert(engine.getWorld().news.length > initialNewsCount, 'Se añadió una noticia al feed de noticias');
    assert(Boolean(latestNews && latestNews.category === 'release' && latestNews.headline.includes('Tumbando Fronteras') && latestNews.relatedArtistIds.includes(partner.id)), 'Noticia oficial generada con categoría release y ambos artistas vinculados');
    const latestSocial = engine.getWorld().socialFeed || [];
    assert(latestSocial.length > initialSocialCount, 'Se generaron posts en el feed social de reacciones');

    // 1.8 Verificación de consistencia en ReleaseConfirmationData
    const conf = collabResult.confirmationData!;
    assert(conf.type === 'single_feat', 'confirmationData.type es single_feat');
    assert(conf.title === 'Tumbando Fronteras', 'confirmationData.title coincide');
    assert(conf.featuredArtistNames?.includes(partner.name) === true, `confirmationData.featuredArtistNames incluye "${partner.name}"`);
    assert(conf.totalBudget === totalExpectedCost, `confirmationData.totalBudget ($${conf.totalBudget}) coincide con el total esperado ($${totalExpectedCost})`);
    assert(conf.budgetBreakdown?.production === prodBudget && conf.budgetBreakdown?.marketing === mktBudget, 'budgetBreakdown contiene desglose correcto');

    // 1.9 Verificación del helper wrapper releaseCollaboration
    const wrapperTitle = 'Sesión Estelar Ft';
    const wrapperData = engine.releaseCollaboration({
      collaboratorId: partner.id,
      format: 'single_feat',
      title: wrapperTitle,
      creditFormat: 'player_feat_target',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      budgetProduction: 2000,
      budgetMarketing: 1000,
      longevityCurve: 'steady'
    });
    assert(Boolean(wrapperData && wrapperData.title === wrapperTitle), 'engine.releaseCollaboration ejecuta con éxito y retorna ReleaseConfirmationData');
  }

  // =============================================================
  // CASO 2: LANZAMIENTO DE ÁLBUM / EP COLABORATIVO (DÚO / CO-HEADLINERS)
  // =============================================================
  console.log('\n🔹 CASO 2: Lanzamiento de Álbum / EP Colaborativo (Dúo / Co-headliners)');
  {
    const initialFunds = 80000;
    const initialEnergy = 100;

    const partner = createTestCollaborator({
      id: 'artist_partner_album',
      name: 'Bizarrap Twin QA',
      mainGenreId: 'trap_latino',
      personality: { creativity: 95, skill: 92, originality: 90, sociability: 85, commercialAppeal: 88, ambition: 90, discipline: 85, charisma: 80, riskTolerance: 70, independence: 80 },
      stats: { popularity: 70, reputation: 80, artisticCredibility: 85, energy: 100, monthlyListeners: 300000, totalStreams: 1000000, funds: 200000, fansCount: 200000, fanbaseLoyalty: 85, hype: 75 }
    });

    const engine = new GameEngine(createPlayerArtist({
      stats: {
        funds: initialFunds,
        energy: initialEnergy,
        popularity: 55,
        reputation: 60,
        artisticCredibility: 70,
        monthlyListeners: 80000,
        totalStreams: 250000,
        fansCount: 50000,
        hype: 60
      }
    }));

    engine.getWorld().artists[partner.id] = partner;

    // Subcaso 2A: Lanzamiento de Álbum Colaborativo Completo (6 pistas)
    console.log('  --- Subcaso 2A: Álbum Colaborativo (LP de 6 canciones) ---');
    const albProdBudget = 20000;
    const albMktBudget = 10000;
    const totalExpectedAlbCost = albProdBudget + albMktBudget; // 30,000

    const albumsBefore = Object.keys(engine.getWorld().albums).length;
    const songsBefore = Object.keys(engine.getWorld().songs).length;

    const customTracks = [
      'Génesis Bipolar',
      'Códigos de Acero',
      'Diamantes en la Oscuridad',
      'Frecuencias Sagradas',
      'Trascendencia Urbana',
      'Outro: El Pacto'
    ];

    const albumResult = engine.proposeAndExecuteCollab({
      targetArtistId: partner.id,
      type: 'collab_album',
      title: 'OASIS CÓSMICO',
      creditOrder: 'player_and_target',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      newTrackTitles: customTracks,
      budgetProduction: albProdBudget,
      budgetMarketing: albMktBudget,
      longevityCurve: 'instant_classic'
    });

    assert(albumResult.success === true, 'El álbum colaborativo fue aceptado y publicado');
    assert(albumResult.album !== undefined, 'Se creó y devolvió la entidad Album');

    const createdAlbum = albumResult.album!;
    const worldAlbums = engine.getWorld().albums;
    const worldSongs = engine.getWorld().songs;

    // 2.1 Verificación del Álbum Colaborativo
    assert(Object.keys(worldAlbums).length === albumsBefore + 1, 'Se agregó exactamente 1 álbum a world.albums');
    assert(worldAlbums[createdAlbum.id] !== undefined, 'El álbum está indexado por su ID');
    assert(createdAlbum.title === 'OASIS CÓSMICO', 'Título del álbum coincide');
    assert(createdAlbum.artistId === engine.getPlayer().id, 'artistId es el jugador');
    assert(createdAlbum.collaboratorArtistId === partner.id, `collaboratorArtistId es exactamente el colaborador: ${createdAlbum.collaboratorArtistId}`);
    assert(createdAlbum.type === 'collab_album', 'Tipo de álbum es collab_album');
    assert(createdAlbum.songIds.length === 6, `Contiene exactamente 6 pistas: ${createdAlbum.songIds.length}`);
    assert(createdAlbum.firstWeekSales > 0, `Calculó ventas primera semana: ${createdAlbum.firstWeekSales.toLocaleString()} unidades`);
    assert(createdAlbum.criticalScore >= 20 && createdAlbum.criticalScore <= 100, `Calificación crítica Metacritic: ${createdAlbum.criticalScore}/100`);
    assert(Boolean(createdAlbum.criticalReviewText && createdAlbum.criticalReviewText.length > 10), `Reseña de la crítica generada: "${createdAlbum.criticalReviewText}"`);
    assert(Boolean(createdAlbum.coverGradient), `Cover gradient asignado: ${createdAlbum.coverGradient}`);

    // 2.2 Verificación de todas las pistas creadas en world.songs
    assert(Object.keys(worldSongs).length === songsBefore + 6, 'Se agregaron exactamente las 6 canciones a world.songs');
    for (let i = 0; i < customTracks.length; i++) {
      const trackTitle = customTracks[i];
      const songInWorld = Object.values(worldSongs).find(s => s.albumId === createdAlbum.id && s.title === trackTitle);
      assert(songInWorld !== undefined, `Canción "${trackTitle}" encontrada en catálogo`);
      if (songInWorld) {
        assert(songInWorld.artistId === engine.getPlayer().id, `Pista "${trackTitle}" tiene artistId del jugador`);
        assert(songInWorld.featuredArtistIds.includes(partner.id), `Pista "${trackTitle}" tiene a ${partner.name} en featuredArtistIds`);
        assert(songInWorld.albumId === createdAlbum.id, `Pista "${trackTitle}" está vinculada a albumId`);
        assert(songInWorld.isSingle === (i === 0), `Pista "${trackTitle}" isSingle=${i === 0}`);
      }
    }

    // 2.3 Verificación económica y energía para álbum colaborativo
    const playerAfterAlbum = engine.getPlayer();
    assert(playerAfterAlbum.stats.funds === initialFunds - totalExpectedAlbCost, `Fondos descontados una sola vez ($${totalExpectedAlbCost}): Quedan $${playerAfterAlbum.stats.funds}`);
    assert(playerAfterAlbum.stats.energy === initialEnergy - 35, `Energía reducida en 35 pts para álbum: Quedan ${playerAfterAlbum.stats.energy}%`);

    // 2.4 Verificación de noticias y social feed para álbum
    const albNews = engine.getWorld().news[0];
    assert(Boolean(albNews && albNews.category === 'release' && albNews.headline.includes('OASIS CÓSMICO')), 'Se generó noticia estelar de álbum colaborativo');
    assert(albNews.relatedArtistIds.includes(partner.id), 'La noticia vincula al colaborador');

    // Subcaso 2B: Lanzamiento de EP Colaborativo (4 pistas) vía wrapper
    console.log('\n  --- Subcaso 2B: EP Colaborativo (4 canciones) ---');
    playerAfterAlbum.stats.energy = 100; // Restaurar energía para prueba de EP
    const fundsBeforeEP = playerAfterAlbum.stats.funds;
    const epProdBudget = 8000;
    const epMktBudget = 4000;
    const epCustomTracks = ['Track EP 1', 'Track EP 2', 'Track EP 3', 'Track EP 4'];

    const epConfirmation = engine.releaseCollaboration({
      collaboratorId: partner.id,
      format: 'ep_collab',
      title: 'Doble Amenaza EP',
      creditFormat: 'player_x_target',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      customTrackTitles: epCustomTracks,
      budgetProduction: epProdBudget,
      budgetMarketing: epMktBudget,
      longevityCurve: 'steady'
    });

    assert(Boolean(epConfirmation && epConfirmation.title === 'Doble Amenaza EP'), 'EP Colaborativo lanzado exitosamente vía wrapper');
    assert(epConfirmation.songCount === 4, `epConfirmation.songCount es exactamente 4: ${epConfirmation.songCount}`);
    assert(playerAfterAlbum.stats.funds === fundsBeforeEP - (epProdBudget + epMktBudget), 'Fondos descontados una sola vez para EP');
    assert(playerAfterAlbum.stats.energy === 100 - 35, 'Energía reducida en 35 pts para EP');
  }

  // =============================================================
  // CASO 3: RECHAZO DE COLABORACIÓN (FEUDO, AFINIDAD NEGATIVA, BRECHA POPULARIDAD)
  // =============================================================
  console.log('\n🔹 CASO 3: Rechazo de Colaboración & Integridad del Estado');
  {
    // Subcaso 3A: Rechazo por Feudo Abierto (relationType: 'feud')
    console.log('  --- Subcaso 3A: Rechazo tajante por Feudo Abierto ---');
    {
      const initialFunds = 50000;
      const initialEnergy = 100;
      const engine = new GameEngine(createPlayerArtist({
        stats: { funds: initialFunds, energy: initialEnergy, popularity: 40 }
      }));

      const rival = createTestCollaborator({
        id: 'artist_rival_beef',
        name: 'Dante Rival Beef',
        mainGenreId: 'trap_latino',
        stats: { popularity: 45, energy: 100, funds: 50000 }
      });
      engine.getWorld().artists[rival.id] = rival;

      // Establecer feudo
      RelationshipEngine.modifyRelationship(
        engine.getPlayer(),
        rival,
        -50,
        20,
        'feud',
        'Guerra de indirectas y tiraderas en redes.'
      );

      const songsBefore = Object.keys(engine.getWorld().songs).length;
      const albumsBefore = Object.keys(engine.getWorld().albums).length;
      const ledgerBefore = engine.getPlayer().financialLedger?.length || 0;
      const relHistoryBefore = engine.getPlayer().relationships[rival.id].history.length;

      const result = engine.proposeAndExecuteCollab({
        targetArtistId: rival.id,
        type: 'single_feat',
        title: 'Paz Imposible',
        creditOrder: 'player_feat_target',
        genreId: 'trap_latino',
        subGenreIds: [],
        budgetProduction: 10000,
        budgetMarketing: 10000
      });

      assert(result.success === false, 'La propuesta fue rechazada debido al feudo abierto');
      assert(Boolean(result.reason && result.reason.includes('feudo abierto')), `El motivo menciona el feudo: "${result.reason}"`);
      assert(engine.getPlayer().stats.funds === initialFunds, 'Fondos del jugador intactos ($50,000)');
      assert(engine.getPlayer().stats.energy === initialEnergy, 'Energía del jugador intacta (100%)');
      assert(Object.keys(engine.getWorld().songs).length === songsBefore, 'No se creó ninguna canción huérfana');
      assert(Object.keys(engine.getWorld().albums).length === albumsBefore, 'No se creó ningún álbum huérfano');
      assert((engine.getPlayer().financialLedger?.length || 0) === ledgerBefore, 'No se generaron transacciones espurias en el ledger');
      assert(engine.getPlayer().relationships[rival.id].history.length === relHistoryBefore + 1, 'Se registró el motivo del rechazo en el historial de la relación');
    }

    // Subcaso 3B: Rechazo por Afinidad Fuertemente Negativa (< -20)
    console.log('\n  --- Subcaso 3B: Rechazo por Antipatía / Afinidad Negativa ---');
    {
      const initialFunds = 50000;
      const engine = new GameEngine(createPlayerArtist({
        stats: { funds: initialFunds, energy: 100, popularity: 40 }
      }));

      const enemy = createTestCollaborator({
        id: 'artist_antipatico',
        name: 'Hater Sonoro',
        mainGenreId: 'trap_latino'
      });
      engine.getWorld().artists[enemy.id] = enemy;

      RelationshipEngine.modifyRelationship(
        engine.getPlayer(),
        enemy,
        -40,
        10,
        'rival',
        'Desencuentros en eventos del género.'
      );

      const result = engine.proposeAndExecuteCollab({
        targetArtistId: enemy.id,
        type: 'single_feat',
        title: 'Junte Tóxico',
        creditOrder: 'player_feat_target',
        genreId: 'trap_latino',
        subGenreIds: [],
        budgetProduction: 5000,
        budgetMarketing: 5000
      });

      assert(result.success === false, 'La propuesta fue rechazada por antipatía/afinidad negativa');
      assert(Boolean(result.reason && (result.reason.includes('antipatía') || result.reason.includes('afinidad'))), `Motivo indica antipatía/afinidad: "${result.reason}"`);
      assert(engine.getPlayer().stats.funds === initialFunds, 'Fondos del jugador permanecen intactos');
    }

    // Subcaso 3C: Rechazo por Brecha Extrema de Popularidad sin Presupuesto Suficiente
    console.log('\n  --- Subcaso 3C: Rechazo por Brecha de Popularidad (Megastar vs Principiante sin $) ---');
    {
      const initialFunds = 1000;
      const engine = new GameEngine(createPlayerArtist({
        stats: { funds: initialFunds, energy: 100, popularity: 5 } // Jugador casi desconocido
      }));

      const superstar = createTestCollaborator({
        id: 'artist_megastar_badbunny',
        name: 'Benito Megastar',
        mainGenreId: 'trap_latino',
        personality: { sociability: 40 },
        stats: { popularity: 95, fansCount: 1000000 } // Superestrella mundial
      });
      engine.getWorld().artists[superstar.id] = superstar;

      const result = engine.proposeAndExecuteCollab({
        targetArtistId: superstar.id,
        type: 'single_feat',
        title: 'Sueño Imposible',
        creditOrder: 'player_feat_target',
        genreId: 'trap_latino',
        subGenreIds: [],
        budgetProduction: 200, // Presupuesto insignificante
        budgetMarketing: 200
      });

      assert(result.success === false, 'Superestrella rechaza al novato debido a la abismal brecha de popularidad sin presupuesto');
      assert(Boolean(result.reason && (result.reason.includes('brecha de exposición') || result.reason.includes('presupuesto') || result.reason.includes('agenda'))), `Motivo realista de rechazo: "${result.reason}"`);
      assert(engine.getPlayer().stats.funds === initialFunds, 'Fondos del jugador permanecen intactos');
      assert(engine.getPlayer().stats.energy === 100, 'Energía del jugador permanece intacta');
    }
  }

  // =============================================================
  // CASO 4: FORMATO DE CRÉDITOS EN CHARTS (ChartEngine.ts)
  // =============================================================
  console.log('\n🔹 CASO 4: Formato de Créditos en Charts (ChartEngine.ts)');
  {
    const engine = new GameEngine(createPlayerArtist({
      id: 'artist_main_chart',
      name: 'Trueno QA',
      country: 'Argentina',
      stats: { popularity: 80 }
    }));

    const guest1 = createTestCollaborator({
      id: 'artist_guest_1',
      name: 'Bizarrap Producer',
      country: 'Argentina'
    });

    const guest2 = createTestCollaborator({
      id: 'artist_guest_2',
      name: 'Nicki Nicole QA',
      country: 'Argentina'
    });

    const world = engine.getWorld();
    world.artists[guest1.id] = guest1;
    world.artists[guest2.id] = guest2;

    // Canción A: Solista sin feat
    const soloSong: Song = {
      id: 'song_solo_chart',
      title: 'Solo en la Cumbre',
      artistId: 'artist_main_chart',
      featuredArtistIds: [],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 90,
      commercialAppeal: 90,
      originality: 85,
      hypeAtRelease: 80,
      streamsTotal: 500000,
      streamsLastMonth: 100000,
      monthlyStreamsHistory: [],
      peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: 'steady',
      isSingle: true,
      receptionRating: 5,
      isClassic: false,
      wentViral: false
    };

    // Canción B: Single con 1 Feat
    const singleFeatSong: Song = {
      id: 'song_feat_chart',
      title: 'Mamichula 2026',
      artistId: 'artist_main_chart',
      featuredArtistIds: [guest1.id],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 95,
      commercialAppeal: 95,
      originality: 90,
      hypeAtRelease: 90,
      streamsTotal: 1200000,
      streamsLastMonth: 250000, // Mayor streaming -> Posible #1
      monthlyStreamsHistory: [],
      peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: 'steady',
      isSingle: true,
      receptionRating: 5,
      isClassic: false,
      wentViral: true
    };

    // Canción C: Single con Múltiples Feats (2 colaboradores)
    const multiFeatSong: Song = {
      id: 'song_multi_chart',
      title: 'Cypher Épico',
      artistId: 'artist_main_chart',
      featuredArtistIds: [guest1.id, guest2.id],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 92,
      commercialAppeal: 92,
      originality: 88,
      hypeAtRelease: 85,
      streamsTotal: 800000,
      streamsLastMonth: 180000,
      monthlyStreamsHistory: [],
      peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: 'steady',
      isSingle: true,
      receptionRating: 5,
      isClassic: false,
      wentViral: false
    };

    world.songs[soloSong.id] = soloSong;
    world.songs[singleFeatSong.id] = singleFeatSong;
    world.songs[multiFeatSong.id] = multiFeatSong;

    const chartResults = ChartEngine.calculateRegionalCharts(world, world.songs, world.artists);
    const argChart = chartResults.updatedCharts.Argentina;

    assert(argChart !== undefined && argChart.entries.length >= 3, 'El ranking de Argentina generó entradas correctamente');

    const soloEntry = argChart.entries.find(e => e.songId === soloSong.id);
    const singleFeatEntry = argChart.entries.find(e => e.songId === singleFeatSong.id);
    const multiFeatEntry = argChart.entries.find(e => e.songId === multiFeatSong.id);

    // 4.1 Formato de artista solista
    assert(soloEntry !== undefined, 'Entrada de canción solista presente en el chart');
    assert(soloEntry?.artistName === 'Trueno QA', `Crédito solista formateado sin "ft.": "${soloEntry?.artistName}"`);
    assert(soloEntry?.featuredArtistIds?.length === 0, 'featuredArtistIds de solista está vacío');

    // 4.2 Formato de single con 1 feat: "Artista Principal (ft. Artista Invitado)"
    assert(singleFeatEntry !== undefined, 'Entrada de single con 1 feat presente en el chart');
    assert(singleFeatEntry?.artistName === 'Trueno QA (ft. Bizarrap Producer)', `Crédito con 1 feat formateado correctamente como "${singleFeatEntry?.artistName}"`);
    assert(singleFeatEntry?.featuredArtistIds?.[0] === guest1.id, 'featuredArtistIds contiene el ID de Bizarrap');

    // 4.3 Formato de single con múltiples feats: "Artista Principal (ft. Invitado 1, Invitado 2)"
    assert(multiFeatEntry !== undefined, 'Entrada de cypher con 2 feats presente en el chart');
    assert(multiFeatEntry?.artistName === 'Trueno QA (ft. Bizarrap Producer, Nicki Nicole QA)', `Crédito con 2 feats formateado correctamente como "${multiFeatEntry?.artistName}"`);
    assert(multiFeatEntry?.featuredArtistIds?.length === 2, 'featuredArtistIds contiene ambos colaboradores');

    // 4.4 Noticia de #1 en charts refleja el formato de crédito con Feat
    if (singleFeatEntry && singleFeatEntry.rank === 1) {
      const milestoneNews = chartResults.chartMilestoneNews.find(n => n.headline.includes('Mamichula 2026'));
      assert(milestoneNews !== undefined, 'Se generó noticia de #1 para el hit con feat');
      assert(Boolean(milestoneNews && milestoneNews.headline.includes('Trueno QA (ft. Bizarrap Producer)')), `Titular de #1 incluye créditos con feat: "${milestoneNews?.headline}"`);
    }
  }

  // =============================================================
  // CASO 5: VALIDACIÓN DEFENSIVA DE PARÁMETROS INVÁLIDOS
  // =============================================================
  console.log('\n🔹 CASO 5: Validación Defensiva de Parámetros Inválidos');
  {
    const initialFunds = 50000;
    const initialEnergy = 100;
    const engine = new GameEngine(createPlayerArtist({
      stats: { funds: initialFunds, energy: initialEnergy }
    }));

    const validPartner = createTestCollaborator({ id: 'partner_valid_c5' });
    engine.getWorld().artists[validPartner.id] = validPartner;

    const songsCountInitial = Object.keys(engine.getWorld().songs).length;
    const albumsCountInitial = Object.keys(engine.getWorld().albums).length;

    // 5.1 Colaborar consigo mismo
    const selfCollab = engine.proposeAndExecuteCollab({
      targetArtistId: engine.getPlayer().id,
      type: 'single_feat',
      title: 'Auto Feat',
      creditOrder: 'player_feat_target',
      genreId: 'trap_latino',
      subGenreIds: [],
      budgetProduction: 2000,
      budgetMarketing: 2000
    });
    assert(selfCollab.success === false, 'Colaboración consigo mismo es bloqueada');
    assert(Boolean(selfCollab.reason && selfCollab.reason.includes('contigo mismo')), `Razón de bloqueo: "${selfCollab.reason}"`);

    // 5.2 Colaborar con artista inexistente
    const nonExistentCollab = engine.proposeAndExecuteCollab({
      targetArtistId: 'artist_inexistente_9999',
      type: 'single_feat',
      title: 'Fantasma',
      creditOrder: 'player_feat_target',
      genreId: 'trap_latino',
      subGenreIds: [],
      budgetProduction: 2000,
      budgetMarketing: 2000
    });
    assert(nonExistentCollab.success === false, 'Colaboración con artista inexistente es bloqueada');
    assert(Boolean(nonExistentCollab.reason && nonExistentCollab.reason.includes('no existe')), `Razón de bloqueo: "${nonExistentCollab.reason}"`);

    // 5.3 Fondos insuficientes
    const poorEngine = new GameEngine(createPlayerArtist({
      stats: { funds: 500, energy: 100 } // Solo $500
    }));
    poorEngine.getWorld().artists[validPartner.id] = validPartner;

    const brokeCollab = poorEngine.proposeAndExecuteCollab({
      targetArtistId: validPartner.id,
      type: 'single_feat',
      title: 'Sin Fondos',
      creditOrder: 'player_feat_target',
      genreId: 'trap_latino',
      subGenreIds: [],
      budgetProduction: 2000, // Cuesta $3,000 > $500
      budgetMarketing: 1000
    });
    assert(brokeCollab.success === false, 'Colaboración con fondos insuficientes es bloqueada');
    assert(poorEngine.getPlayer().stats.funds === 500, 'Fondos insuficientes no sufren deducción');
    assert(poorEngine.getPlayer().stats.energy === 100, 'Energía no sufre deducción tras intento fallido');

    // 5.4 Título vacío o con solo espacios
    const emptyTitleCollab = engine.proposeAndExecuteCollab({
      targetArtistId: validPartner.id,
      type: 'single_feat',
      title: '   ',
      creditOrder: 'player_feat_target',
      genreId: 'trap_latino',
      subGenreIds: [],
      budgetProduction: 1000,
      budgetMarketing: 1000
    });
    assert(emptyTitleCollab.success === false, 'Título vacío es bloqueado');

    // 5.5 Álbum colaborativo con tracks insuficientes (< 6 para LP)
    const shortAlbumCollab = engine.proposeAndExecuteCollab({
      targetArtistId: validPartner.id,
      type: 'collab_album',
      title: 'LP Corto Prohibido',
      creditOrder: 'player_and_target',
      genreId: 'trap_latino',
      subGenreIds: [],
      newTrackTitles: ['Solo 1', 'Solo 2'], // 2 < 6
      budgetProduction: 5000,
      budgetMarketing: 5000
    });
    assert(shortAlbumCollab.success === false, 'Álbum colaborativo con pistas insuficientes es bloqueado');
    assert(Boolean(shortAlbumCollab.reason && shortAlbumCollab.reason.includes('requiere al menos 6')), `Razón de pistas insuficientes: "${shortAlbumCollab.reason}"`);

    // 5.6 Energía insuficiente (< 15 para single, < 35 para álbum)
    engine.getPlayer().stats.energy = 10;
    const lowEnergyCollab = engine.proposeAndExecuteCollab({
      targetArtistId: validPartner.id,
      type: 'single_feat',
      title: 'Agotado',
      creditOrder: 'player_feat_target',
      genreId: 'trap_latino',
      subGenreIds: [],
      budgetProduction: 1000,
      budgetMarketing: 1000
    });
    assert(lowEnergyCollab.success === false, 'Colaboración con energía insuficiente (<15%) es bloqueada');
    assert(engine.getPlayer().stats.energy === 10, 'Energía permanece en 10%');

    // 5.7 Productor bloqueado por requisitos de reputación / popularidad
    engine.getPlayer().stats.energy = 100;
    const eliteProd = Object.values(engine.getWorld().producers).find(p => (p.requirements?.minReputation || 0) >= 50 || (p.requirements?.minPopularity || 0) >= 50);
    if (eliteProd) {
      engine.getPlayer().stats.reputation = 5;
      engine.getPlayer().stats.popularity = 5;
      const lockedProdCollab = engine.proposeAndExecuteCollab({
        targetArtistId: validPartner.id,
        type: 'single_feat',
        title: 'Feat con Beatmaker Élite Inalcanzable',
        creditOrder: 'player_feat_target',
        genreId: 'trap_latino',
        subGenreIds: [],
        producerId: eliteProd.id,
        budgetProduction: 1000,
        budgetMarketing: 1000
      });
      assert(lockedProdCollab.success === false, `Colaboración con productor de élite (${eliteProd.name}) sin cumplir requisitos fue bloqueada`);
    }

    // 5.8 releaseCollaboration lanza excepción cuando la propuesta falla
    let wrapperThrewError = false;
    try {
      engine.releaseCollaboration({
        collaboratorId: engine.getPlayer().id, // Inválido: colaborar consigo mismo
        format: 'single_feat',
        title: 'Prueba Wrapper Excepción',
        creditFormat: 'player_feat_target',
        genreId: 'trap_latino',
        subGenreIds: [],
        budgetProduction: 1000,
        budgetMarketing: 1000,
        longevityCurve: 'steady'
      });
    } catch (e: any) {
      wrapperThrewError = true;
    }
    assert(wrapperThrewError, 'engine.releaseCollaboration lanza excepción correctamente ante parámetros inválidos');

    // 5.9 Verificar que no hubo mutación de estado accidental tras los intentos inválidos
    assert(Object.keys(engine.getWorld().songs).length === songsCountInitial, 'El catálogo de canciones quedó 100% limpio sin registros corruptos');
    assert(Object.keys(engine.getWorld().albums).length === albumsCountInitial, 'El catálogo de álbumes quedó 100% limpio sin registros corruptos');
  }

  // =============================================================
  // RESUMEN FINAL DE AUDITORÍA
  // =============================================================
  console.log('\n===============================================================');
  console.log('📊 RESUMEN DE AUDITORÍA QA DE COLABORACIONES:');
  console.log(`   Total de aserciones ejecutadas: ${stats.total}`);
  console.log(`   \x1b[32mSuperadas con éxito: ${stats.passed}\x1b[0m`);
  console.log(`   \x1b[31mFallidas: ${stats.failed}\x1b[0m`);
  if (stats.failed === 0) {
    console.log('\n🎉 \x1b[32m100% DE ÉXITO: Todos los casos de colaboración y criterios de auditoría han sido superados.\x1b[0m');
  } else {
    console.log(`\n❌ \x1b[31mSe encontraron ${stats.failed} fallos en las pruebas.\x1b[0m`);
    stats.errors.forEach(e => console.error(`  - ${e}`));
  }
  console.log('===============================================================\n');

  return stats.failed === 0;
}

const isMainModule = process.argv[1]?.includes('test-collaborations');
if (isMainModule) {
  const success = runCollaborationTests();
  if (!success) {
    process.exit(1);
  }
}
