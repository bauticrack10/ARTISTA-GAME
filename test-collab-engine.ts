import { GameEngine } from './src/core/GameEngine';
import { RelationshipEngine } from './src/systems/RelationshipEngine';
import { ChartEngine } from './src/systems/ChartEngine';
import { StreamingEngine } from './src/systems/StreamingEngine';
import { Artist, Song } from './src/types';

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

function createPlayerArtist(overrides: Partial<Artist> = {}): Partial<Artist> {
  return {
    id: overrides.id || 'artist_player_collab',
    name: overrides.name || 'El Jugador',
    realName: 'Artista Principal',
    isPlayer: true,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2004,
    careerStartYear: 2026,
    mainGenreId: 'trap_latino',
    subGenreIds: ['sub_trap_underground'],
    personality: {
      creativity: 85,
      ambition: 80,
      discipline: 80,
      charisma: 85,
      skill: 85,
      commercialAppeal: 80,
      originality: 85,
      riskTolerance: 80,
      sociability: 85,
      independence: 75
    },
    stats: {
      popularity: 40,
      reputation: 50,
      artisticCredibility: 60,
      energy: 100,
      monthlyListeners: 80000,
      totalStreams: 250000,
      funds: 50000,
      fansCount: 30000,
      fanbaseLoyalty: 80,
      hype: 60,
      ...overrides.stats
    },
    careerStage: overrides.careerStage || 'Breakout',
    labelId: null,
    managerId: null,
    relationships: {},
    eras: [],
    awardsWon: [],
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

function runTests(): boolean {
  console.log('\n===============================================================');
  console.log('🧪 SUITE DE PRUEBAS: COLABORACIONES MUSICALES REALES (BACKEND & ENGINES)');
  console.log('===============================================================\n');

  // =============================================================
  // TEST SUITE 1: RelationshipEngine.calculateCollabFeasibility
  // =============================================================
  console.log('🔹 1. PRUEBAS DE FEASIBILITY (RelationshipEngine)');
  {
    const requester = createPlayerArtist({
      stats: { popularity: 30, reputation: 40, funds: 20000, energy: 100, monthlyListeners: 50000, totalStreams: 100000, fansCount: 20000, fanbaseLoyalty: 70, hype: 40 }
    }) as Artist;

    const superstar = {
      id: 'artist_superstar',
      name: 'Duki Star',
      isPlayer: false,
      country: 'Argentina',
      city: 'Buenos Aires',
      birthYear: 1996,
      careerStartYear: 2017,
      mainGenreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      personality: { creativity: 85, ambition: 90, discipline: 80, charisma: 90, skill: 85, commercialAppeal: 90, originality: 85, riskTolerance: 80, sociability: 75, independence: 70 },
      stats: { popularity: 90, reputation: 90, artisticCredibility: 85, energy: 100, monthlyListeners: 5000000, totalStreams: 100000000, funds: 1000000, fansCount: 1500000, fanbaseLoyalty: 90, hype: 90 },
      careerStage: 'Superstar',
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [],
      awardsWon: [],
      legacyScore: 80,
      isRetired: false,
      historicalNotes: [],
      generationIndex: 1,
      influences: []
    } as unknown as Artist;

    // 1.1 Rechazo tajante si hay Feudo abierto
    requester.relationships[superstar.id] = {
      targetArtistId: superstar.id,
      relationType: 'feud',
      affinity: -50,
      respect: 30,
      pastCollabsCount: 0,
      history: []
    };
    const feudResult = RelationshipEngine.calculateCollabFeasibility(requester, superstar, 'single_feat', 20000);
    assert(feudResult.willAccept === false, 'Rechaza tajantemente si relationType === feud');
    assert(feudResult.reason.includes('feudo'), `Motivo incluye mención a feudo: "${feudResult.reason}"`);
    assert(feudResult.chemistryScore === 0, 'Química es 0 en caso de feudo');
    assert(feudResult.acceptanceProbability === 0, 'Probabilidad de aceptación es 0');

    // 1.2 Rechazo tajante si afinidad < -20
    requester.relationships[superstar.id] = {
      targetArtistId: superstar.id,
      relationType: 'neutral',
      affinity: -35,
      respect: 50,
      pastCollabsCount: 0,
      history: []
    };
    const antipathyResult = RelationshipEngine.calculateCollabFeasibility(requester, superstar, 'single_feat', 10000);
    assert(antipathyResult.willAccept === false, 'Rechaza tajantemente si afinidad < -20');
    assert(antipathyResult.reason.includes('antipatía') || antipathyResult.reason.includes('afinidad'), `Motivo menciona antipatía: "${antipathyResult.reason}"`);

    // 1.3 Rechazo si la diferencia de popularidad es enorme y el presupuesto es bajo
    requester.relationships[superstar.id] = {
      targetArtistId: superstar.id,
      relationType: 'neutral',
      affinity: 0,
      respect: 50,
      pastCollabsCount: 0,
      history: []
    };
    const lowBudgetResult = RelationshipEngine.calculateCollabFeasibility(requester, superstar, 'single_feat', 500);
    assert(lowBudgetResult.willAccept === false, 'Superstar rechaza a artista emergente con bajo presupuesto ($500)');

    // 1.4 Aceptación con presupuesto contundente ($15,000) o alta afinidad/respeto
    requester.relationships[superstar.id] = {
      targetArtistId: superstar.id,
      relationType: 'friend',
      affinity: 60,
      respect: 80,
      pastCollabsCount: 1,
      history: []
    };
    const acceptedResult = RelationshipEngine.calculateCollabFeasibility(requester, superstar, 'single_feat', 15000);
    assert(acceptedResult.willAccept === true, 'Superstar acepta con alta afinidad (+60), respeto (80) y presupuesto ($15,000)');
    assert(acceptedResult.chemistryScore >= 5 && acceptedResult.chemistryScore <= 25, `ChemistryScore en rango válido (5 a 25): ${acceptedResult.chemistryScore}`);
    assert(acceptedResult.crossFanbasePotential > 1000, `CrossFanbasePotential calculado con éxito: ${acceptedResult.crossFanbasePotential}`);
    assert(acceptedResult.acceptanceProbability >= 50, `AcceptanceProbability >= 50%: ${acceptedResult.acceptanceProbability}%`);
  }

  // =============================================================
  // TEST SUITE 2: GameEngine.proposeAndExecuteCollab
  // =============================================================
  console.log('\n🔹 2. PRUEBAS DE EJECUCIÓN DE COLABORACIÓN (GameEngine)');
  {
    const engine = new GameEngine(createPlayerArtist({
      stats: { funds: 60000, energy: 100, popularity: 40, fansCount: 35000, hype: 50 }
    }));

    const player = engine.getPlayer();
    const targetArtist = Object.values(engine.getWorld().artists).find(a => a.id !== player.id && !a.isRetired)!;

    // 2.1 Validación: Target no existente o uno mismo
    const selfCollab = engine.proposeAndExecuteCollab({
      targetArtistId: player.id,
      type: 'single_feat',
      title: 'Auto-Colaboración',
      creditOrder: 'player_feat_target',
      genreId: player.mainGenreId,
      subGenreIds: player.subGenreIds,
      budgetProduction: 2000,
      budgetMarketing: 1000
    });
    assert(selfCollab.success === false, 'No permite colaborar consigo mismo');

    // 2.2 Validación de Energía insuficiente
    player.stats.energy = 10;
    const lowEnergyCollab = engine.proposeAndExecuteCollab({
      targetArtistId: targetArtist.id,
      type: 'single_feat',
      title: 'Colab Agotada',
      creditOrder: 'player_feat_target',
      genreId: player.mainGenreId,
      subGenreIds: player.subGenreIds,
      budgetProduction: 2000,
      budgetMarketing: 1000
    });
    assert(lowEnergyCollab.success === false, 'Rechaza por energía insuficiente (< 15%)');
    player.stats.energy = 100;

    // 2.3 Validación de Fondos insuficientes
    const lowFundsCollab = engine.proposeAndExecuteCollab({
      targetArtistId: targetArtist.id,
      type: 'single_feat',
      title: 'Colab Impagable',
      creditOrder: 'player_feat_target',
      genreId: player.mainGenreId,
      subGenreIds: player.subGenreIds,
      budgetProduction: 100000,
      budgetMarketing: 50000
    });
    assert(lowFundsCollab.success === false, 'Rechaza por fondos insuficientes');

    // 2.4 Flujo de Rechazo por Feudo: Estado queda intacto
    player.relationships[targetArtist.id] = {
      targetArtistId: targetArtist.id,
      relationType: 'feud',
      affinity: -60,
      respect: 20,
      pastCollabsCount: 0,
      history: []
    };

    const fundsBeforeReject = player.stats.funds;
    const energyBeforeReject = player.stats.energy;
    const songsBeforeReject = Object.keys(engine.getWorld().songs).length;

    const rejectedCollab = engine.proposeAndExecuteCollab({
      targetArtistId: targetArtist.id,
      type: 'single_feat',
      title: 'Colab en Feudo',
      creditOrder: 'player_feat_target',
      genreId: player.mainGenreId,
      subGenreIds: player.subGenreIds,
      budgetProduction: 3000,
      budgetMarketing: 2000
    });

    assert(rejectedCollab.success === false, 'La propuesta en feudo retorna success=false');
    assert(Boolean(rejectedCollab.reason), `Retorna motivo del rechazo: "${rejectedCollab.reason}"`);
    assert(player.stats.funds === fundsBeforeReject, 'Fondos permanecen intactos tras rechazo');
    assert(player.stats.energy === energyBeforeReject, 'Energía permanece intacta tras rechazo');
    assert(Object.keys(engine.getWorld().songs).length === songsBeforeReject, 'No se creó ninguna canción tras rechazo');
    assert(player.relationships[targetArtist.id].history.length > 0, 'Registró nota de rechazo en el historial de relaciones');

    // 2.5 Flujo de Aceptación Exitosa (Single Feat)
    player.relationships[targetArtist.id] = {
      targetArtistId: targetArtist.id,
      relationType: 'friend',
      affinity: 50,
      respect: 70,
      pastCollabsCount: 0,
      history: []
    };

    const initialFunds = player.stats.funds;
    const initialEnergy = player.stats.energy;
    const initialFans = player.stats.fansCount;
    const initialHype = player.stats.hype;
    const prodBudget = 4000;
    const mktBudget = 3000;
    const totalExpected = prodBudget + mktBudget;

    const acceptedCollab = engine.proposeAndExecuteCollab({
      targetArtistId: targetArtist.id,
      type: 'single_feat',
      title: 'Pacto de Sangre',
      creditOrder: 'player_feat_target',
      genreId: player.mainGenreId,
      subGenreIds: player.subGenreIds,
      budgetProduction: prodBudget,
      budgetMarketing: mktBudget
    });

    assert(acceptedCollab.success === true, 'La colaboración fue aceptada exitosamente');
    assert(acceptedCollab.song !== undefined, 'Retornó el objeto Song creado');
    assert(acceptedCollab.song?.featuredArtistIds.includes(targetArtist.id), 'featuredArtistIds contiene el ID del colaborador');
    assert(acceptedCollab.song?.isSingle === true, 'isSingle es true');
    assert(engine.getWorld().songs[acceptedCollab.song!.id] !== undefined, 'La canción está registrada en world.songs');

    // Verificaciones de estado tras aceptación
    assert(player.stats.funds === initialFunds - totalExpected, `Fondos descontados correctamente: $${player.stats.funds}`);
    assert(player.stats.energy === initialEnergy - 15, `Energía reducida en 15%: ${player.stats.energy}%`);
    assert(player.stats.fansCount > initialFans, `Cross-pollination: Ganó fans (${initialFans} -> ${player.stats.fansCount})`);
    assert(player.stats.hype > initialHype, `Hype aumentó tras la colaboración: ${player.stats.hype}`);
    assert(player.relationships[targetArtist.id].affinity === 65, 'Afinidad aumentó en +15 pts (50 -> 65)');
    assert(player.relationships[targetArtist.id].respect === 85, 'Respeto aumentó en +15 pts (70 -> 85)');
    assert(player.relationships[targetArtist.id].pastCollabsCount === 1, 'pastCollabsCount incrementó a 1');
    assert(player.relationships[targetArtist.id].relationType === 'friend' || player.relationships[targetArtist.id].relationType === 'collaborator', 'relationType actualizado');

    // Verificación de noticias y social feed
    const latestNews = engine.getWorld().news[0];
    assert(Boolean(latestNews && latestNews.category === 'release' && latestNews.headline.includes('Pacto de Sangre')), 'Noticia de colaboración publicada en world.news');

    // 2.6 Flujo de Colaboración de Álbum / EP
    const albumProdBudget = 12000;
    const albumMktBudget = 8000;
    const totalAlbumCost = albumProdBudget + albumMktBudget;
    const fundsBeforeAlbum = player.stats.funds;
    const energyBeforeAlbum = player.stats.energy;

    const collabAlbumRes = engine.proposeAndExecuteCollab({
      targetArtistId: targetArtist.id,
      type: 'collab_ep',
      title: 'Frecuencia Compartida',
      creditOrder: 'player_and_target',
      genreId: player.mainGenreId,
      subGenreIds: player.subGenreIds,
      newTrackTitles: ['Intro Conexión', 'Bajo Tierra', 'Química Pura', 'Cierre Magistral'],
      budgetProduction: albumProdBudget,
      budgetMarketing: albumMktBudget
    });

    assert(collabAlbumRes.success === true, 'El EP colaborativo fue creado exitosamente');
    assert(collabAlbumRes.album !== undefined, 'Retornó el objeto Album creado');
    assert(collabAlbumRes.album?.collaboratorArtistId === targetArtist.id, 'collaboratorArtistId está vinculado al target');
    assert(collabAlbumRes.album?.songIds.length === 4, `El álbum contiene las 4 pistas: ${collabAlbumRes.album?.songIds.length}`);
    assert(player.stats.funds === fundsBeforeAlbum - totalAlbumCost, 'Fondos de producción de álbum descontados correctamente');
    assert(player.stats.energy === energyBeforeAlbum - 35, 'Energía reducida en 35% por el álbum');
  }

  // =============================================================
  // TEST SUITE 3: ChartEngine Formatting con Colaboradores
  // =============================================================
  console.log('\n🔹 3. PRUEBAS DE CHARTS (ChartEngine con Feats)');
  {
    const engine = new GameEngine(createPlayerArtist());
    const player = engine.getPlayer();
    const guestArtist = Object.values(engine.getWorld().artists).find(a => a.id !== player.id)!;

    const collabSong: Song = {
      id: 'song_test_chart_collab',
      title: 'Hit del Verano',
      artistId: player.id,
      featuredArtistIds: [guestArtist.id],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 95,
      commercialAppeal: 95,
      originality: 90,
      hypeAtRelease: 90,
      streamsTotal: 100000,
      streamsLastMonth: 50000,
      monthlyStreamsHistory: [50000],
      peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: 'instant_classic',
      isSingle: true,
      receptionRating: 5,
      isClassic: false,
      wentViral: true
    };

    engine.getWorld().songs[collabSong.id] = collabSong;

    const chartRes = ChartEngine.calculateRegionalCharts(engine.getWorld(), engine.getWorld().songs, engine.getWorld().artists);
    const globalChart = chartRes.updatedCharts.Global;
    const entry = globalChart.entries.find(e => e.songId === collabSong.id);

    assert(entry !== undefined, 'La canción en colaboración ingresó al chart');
    assert(entry?.artistName.includes('(ft. ') || entry?.artistName.includes(guestArtist.name), `Nombre de artista formateado en chart: "${entry?.artistName}"`);
    assert(entry?.artistName === `${player.name} (ft. ${guestArtist.name})`, `Formato exacto esperado: "${player.name} (ft. ${guestArtist.name})"`);
  }

  // =============================================================
  // TEST SUITE 4: StreamingEngine Boost por Colaborador
  // =============================================================
  console.log('\n🔹 4. PRUEBAS DE STREAMING ENGINE (Boost por Feat)');
  {
    const player = createPlayerArtist({ stats: { popularity: 20, fanbaseLoyalty: 70, fansCount: 10000, hype: 30 } }) as Artist;
    const guestSuperstar = {
      id: 'artist_guest_superstar',
      name: 'Super Estrella Invitada',
      isPlayer: false,
      stats: { popularity: 85, fansCount: 1000000, fanbaseLoyalty: 85 }
    } as unknown as Artist;

    const allArtists: Record<string, Artist> = {
      [player.id]: player,
      [guestSuperstar.id]: guestSuperstar
    };

    const soloSong: Song = {
      id: 'song_solo',
      title: 'Tema Solo',
      artistId: player.id,
      featuredArtistIds: [],
      genreId: 'trap_latino',
      subGenreIds: [],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 80,
      commercialAppeal: 80,
      originality: 80,
      hypeAtRelease: 30,
      streamsTotal: 0,
      streamsLastMonth: 0,
      monthlyStreamsHistory: [],
      peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: 'steady',
      isSingle: true,
      receptionRating: 4,
      isClassic: false,
      wentViral: false
    };

    const featSong: Song = {
      ...soloSong,
      id: 'song_feat',
      title: 'Tema con Feat',
      featuredArtistIds: [guestSuperstar.id]
    };

    const soloStreams = StreamingEngine.calculateSongMonthlyStreams(soloSong, player, 2026, 1, [], undefined, allArtists);
    const featStreams = StreamingEngine.calculateSongMonthlyStreams(featSong, player, 2026, 1, [], undefined, allArtists);

    assert(featStreams.streams > soloStreams.streams, `Streams con artista colaborador (${featStreams.streams.toLocaleString()}) son significativamente superiores a solo (${soloStreams.streams.toLocaleString()})`);
    assert(featStreams.streams >= soloStreams.streams * 1.5, `El impulso de alcance algorítmico del colaborador supera el 50% de incremento: ratio x${(featStreams.streams / soloStreams.streams).toFixed(2)}`);
  }

  // =============================================================
  // RESUMEN Y RESULTADOS
  // =============================================================
  console.log('\n===============================================================');
  console.log('📊 RESUMEN DE EJECUCIÓN DE PRUEBAS DE COLABORACIONES:');
  console.log(`   Total de aserciones: ${stats.total}`);
  console.log(`   \x1b[32mSuperadas: ${stats.passed}\x1b[0m`);
  console.log(`   \x1b[31mFallidas: ${stats.failed}\x1b[0m`);
  if (stats.failed === 0) {
    console.log('\n🎉 \x1b[32m100% EXITOSO: Toda la lógica de Backend & Data Specialist para Colaboraciones Musicales Reales ha sido verificada y funciona a la perfección.\x1b[0m');
  } else {
    console.log(`\n❌ \x1b[31mSe detectaron ${stats.failed} fallas en la auditoría.\x1b[0m`);
    stats.errors.forEach(e => console.error(`  - ${e}`));
  }
  console.log('===============================================================\n');

  return stats.failed === 0;
}

const isSuccess = runTests();
if (!isSuccess) {
  process.exit(1);
}
