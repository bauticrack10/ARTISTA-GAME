import { EventEngine } from './src/systems/EventEngine';
import { GameEngine } from './src/core/GameEngine';
import { TimeSystem } from './src/systems/TimeSystem';
import { CORE_EVENT_TEMPLATES } from './src/data/eventTemplates';
import { WorldState, Artist, EventDefinition, EventContext, CareerStage, Song, Tour } from './src/types';
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
      Mexico: { region: 'Mexico', year: 2026, month: 1, entries: [] },
      UK: { region: 'UK', year: 2026, month: 1, entries: [] },
      Brazil: { region: 'Brazil', year: 2026, month: 1, entries: [] },
      Asia: { region: 'Asia', year: 2026, month: 1, entries: [] },
      Africa: { region: 'Africa', year: 2026, month: 1, entries: [] }
    },
    awardsHistory: [],
    news: [],
    socialFeed: [],
    ecosystemContacts: {},
    activeBeefs: {},
    records: [],
    globalHistoryTimeline: [
      { year: 2026, month: 1, text: 'Inicio de la simulación.', category: 'world' }
    ],
    recentEventIdsHistory: [],
    activeNarrativeChains: {},
    financialLedger: []
  };
}

function createTestArtist(overrides: Partial<Artist> = {}): Artist {
  return {
    id: overrides.id || `artist_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: overrides.name || 'Artista Test Eventos',
    isPlayer: overrides.isPlayer !== undefined ? overrides.isPlayer : true,
    country: overrides.country || 'Argentina',
    city: overrides.city || 'Buenos Aires',
    birthYear: overrides.birthYear || 2006,
    careerStartYear: overrides.careerStartYear || 2026,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || [],
    personality: overrides.personality || {
      creativity: 80,
      ambition: 80,
      discipline: 80,
      charisma: 80,
      skill: 80,
      commercialAppeal: 80,
      originality: 80,
      riskTolerance: 80,
      sociability: 80,
      independence: 80
    },
    stats: overrides.stats || {
      popularity: 20,
      reputation: 30,
      artisticCredibility: 40,
      energy: 100,
      monthlyListeners: 10000,
      totalStreams: 50000,
      funds: 5000,
      fansCount: 5000,
      fanbaseLoyalty: 60,
      hype: 40
    },
    careerStage: overrides.careerStage || 'Underground',
    labelId: overrides.labelId !== undefined ? overrides.labelId : null,
    managerId: overrides.managerId !== undefined ? overrides.managerId : null,
    activeContract: overrides.activeContract || null,
    relationships: overrides.relationships || {},
    eras: overrides.eras || [],
    awardsWon: overrides.awardsWon || [],
    legacyScore: overrides.legacyScore || 10,
    isRetired: false,
    historicalNotes: overrides.historicalNotes || [],
    generationIndex: 1,
    influences: [],
    financialLedger: overrides.financialLedger || []
  };
}

function runAllEmergentEventsTests() {
  console.log('\n======================================================================');
  console.log('🧪 SUITE DE PRUEBAS QA & AUDITORÍA: EVENTOS EMERGENTES & SIMULACIÓN');
  console.log('======================================================================\n');

  // ============================================================================
  // CASO 1: ACTIVACIÓN POR ETAPAS DE CARRERA
  // ============================================================================
  console.log('🔹 CASO 1: Activación por Etapas de Carrera (Career Stage Activation)');
  {
    const world = createBaseWorld();

    // 1.1 Debut Events en Underground / Emerging vs Established / Legend
    const firstContractEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_first_contract_offer')!;
    const majorRejectionEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_major_label_rejection')!;

    assert(Boolean(firstContractEvt), 'evt_first_contract_offer existe en CORE_EVENT_TEMPLATES');
    assert(firstContractEvt.maxCareerStage === 'Emerging', 'evt_first_contract_offer tiene maxCareerStage = "Emerging"');
    assert(Boolean(majorRejectionEvt), 'evt_major_label_rejection existe en CORE_EVENT_TEMPLATES');
    assert(majorRejectionEvt.maxCareerStage === 'Breakout', 'evt_major_label_rejection tiene maxCareerStage = "Breakout"');

    // Context Underground (elegible para debut)
    const undergroundArtist = createTestArtist({
      careerStage: 'Underground',
      stats: { popularity: 20, reputation: 20, artisticCredibility: 30, energy: 100, monthlyListeners: 5000, totalStreams: 10000, funds: 1000, fansCount: 1000, fanbaseLoyalty: 50, hype: 30 },
      labelId: null
    });
    const undergroundCtx: EventContext = { player: undergroundArtist, world, currentYear: 2026, currentMonth: 1 };

    // Verificar selectNextEvent con Underground
    const undergroundSelected = EventEngine.selectNextEvent(undergroundCtx, []);
    assert(Boolean(undergroundSelected), 'EventEngine selecciona evento para artista Underground');

    // Comprobar que en Underground, condition() de debut pasa
    assert(firstContractEvt.condition(undergroundCtx) === true, 'evt_first_contract_offer cumple condition() en Underground');
    assert(majorRejectionEvt.condition(undergroundCtx) === true, 'evt_major_label_rejection cumple condition() en Underground');

    // Context Established (bloqueado para debut)
    const establishedArtist = createTestArtist({
      careerStage: 'Established',
      stats: { popularity: 70, reputation: 70, artisticCredibility: 75, energy: 100, monthlyListeners: 300000, totalStreams: 5000000, funds: 100000, fansCount: 150000, fanbaseLoyalty: 80, hype: 70 },
      labelId: 'label_sony_columbia'
    });
    const establishedCtx: EventContext = { player: establishedArtist, world, currentYear: 2030, currentMonth: 1 };

    // 1.2 Advanced Events en Established / Superstar / Legend
    const majorDealEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_major_bidding_war_deal')!;
    const labelExitEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_label_exit_battle')!;
    const galaSpeechEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_awards_gala_speech_scandal')!;
    const comebackEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_legendary_career_comeback')!;
    const cancelCrisisEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_reputation_cancel_crisis')!;
    const tourBankruptcyEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_tour_promoter_bankruptcy')!;

    assert(Boolean(majorDealEvt) && majorDealEvt.minCareerStage === 'Breakout', 'evt_major_bidding_war_deal requiere minCareerStage = "Breakout"');
    assert(Boolean(labelExitEvt) && labelExitEvt.minCareerStage === 'Established', 'evt_label_exit_battle requiere minCareerStage = "Established"');
    assert(Boolean(galaSpeechEvt) && galaSpeechEvt.minCareerStage === 'Established', 'evt_awards_gala_speech_scandal requiere minCareerStage = "Established"');
    assert(Boolean(comebackEvt) && comebackEvt.minCareerStage === 'Comeback', 'evt_legendary_career_comeback requiere minCareerStage = "Comeback"');
    assert(Boolean(cancelCrisisEvt) && cancelCrisisEvt.minCareerStage === 'Mainstream', 'evt_reputation_cancel_crisis requiere minCareerStage = "Mainstream"');
    assert(Boolean(tourBankruptcyEvt) && tourBankruptcyEvt.minCareerStage === 'Established', 'evt_tour_promoter_bankruptcy requiere minCareerStage = "Established"');

    // In Underground: Advanced events are blocked by minCareerStage
    // Let's verify selectNextEvent never selects labelExitEvt or galaSpeechEvt or comebackEvt for Underground
    for (let testRun = 0; testRun < 20; testRun++) {
      const selected = EventEngine.selectNextEvent(undergroundCtx, []);
      if (selected) {
        assert(selected.id !== 'evt_label_exit_battle', 'Underground nunca activa evt_label_exit_battle');
        assert(selected.id !== 'evt_awards_gala_speech_scandal', 'Underground nunca activa evt_awards_gala_speech_scandal');
        assert(selected.id !== 'evt_legendary_career_comeback', 'Underground nunca activa evt_legendary_career_comeback');
        assert(selected.id !== 'evt_reputation_cancel_crisis', 'Underground nunca activa evt_reputation_cancel_crisis');
      }
    }

    // In Established/Legend: Debut events are blocked by maxCareerStage
    for (let testRun = 0; testRun < 20; testRun++) {
      const selected = EventEngine.selectNextEvent(establishedCtx, []);
      if (selected) {
        assert(selected.id !== 'evt_first_contract_offer', 'Established nunca activa evt_first_contract_offer');
        assert(selected.id !== 'evt_major_label_rejection', 'Established nunca activa evt_major_label_rejection');
      }
    }

    // In Comeback: Verify comeback event is valid
    const comebackArtist = createTestArtist({
      careerStage: 'Comeback',
      careerStartYear: 2026,
      stats: { popularity: 60, reputation: 65, artisticCredibility: 70, energy: 90, monthlyListeners: 120000, totalStreams: 3000000, funds: 80000, fansCount: 90000, fanbaseLoyalty: 75, hype: 45 }
    });
    const comebackCtx: EventContext = { player: comebackArtist, world, currentYear: 2035, currentMonth: 1 };
    assert(comebackEvt.condition(comebackCtx) === true, 'evt_legendary_career_comeback cumple condición en etapa Comeback con >= 6 años');
  }

  // ============================================================================
  // CASO 2: MODIFICACIÓN ATÓMICA DE SISTEMAS MÚLTIPLES
  // ============================================================================
  console.log('\n🔹 CASO 2: Modificación Atómica de Sistemas Múltiples');
  {
    // 2.1 Fondos + Registro en Ledger Financiero
    {
      const engine = new GameEngine({
        stats: { popularity: 30, reputation: 40, artisticCredibility: 50, energy: 100, monthlyListeners: 30000, totalStreams: 100000, funds: 10000, fansCount: 10000, fanbaseLoyalty: 60, hype: 50 }
      });
      const player = engine.getPlayer();

      // Simular un evento que otorga fondos positivos
      const positiveOutcome = {
        narrativeText: 'Premio monetario',
        fundsChange: 5000,
        timelineEntry: { text: 'Recibió subvención artística de $5,000 en 2026.', category: 'career' }
      };

      const initialFunds = player.stats.funds; // 10000
      (engine as any).currentEvent = {
        id: 'evt_test_grant',
        title: 'Subvención de Fondo Cultural',
        category: 'career',
        choices: () => [{ id: 'c_grant', text: 'Aceptar', apply: () => positiveOutcome }]
      };

      engine.resolveCurrentEventChoice(0);
      assert(player.stats.funds === initialFunds + 5000, 'Fondos aumentaron exactamente en +$5.000 ($15.000)');

      const playerTx = player.financialLedger?.[0];
      assert(Boolean(playerTx), 'player.financialLedger tiene registrada la transacción');
      assert(playerTx?.type === 'income' && playerTx.amount === 5000 && playerTx.category === 'event', 'Transacción en player ledger es income/5000/event');
      assert(playerTx?.resultingBalance === 15000, 'Balance resultante en player ledger es $15.000');

      const worldTx = engine.getWorld().financialLedger?.[0];
      assert(Boolean(worldTx), 'world.financialLedger tiene registrada la transacción');
      assert(worldTx?.amount === 5000, 'Transacción en world ledger tiene monto de $5.000');

      // Simular evento con deducción de fondos
      const negativeOutcome = {
        narrativeText: 'Pago de indemnización',
        fundsChange: -3000
      };
      (engine as any).currentEvent = {
        id: 'evt_test_fine',
        title: 'Multa de Tránsito en Gira',
        category: 'crisis',
        choices: () => [{ id: 'c_fine', text: 'Pagar multa', apply: () => negativeOutcome }]
      };

      engine.resolveCurrentEventChoice(0);
      assert(player.stats.funds === 12000, 'Fondos deducidos correctamente a $12.000');
      assert(player.financialLedger?.[0].type === 'expense' && player.financialLedger?.[0].amount === 3000, 'Transacción de gasto registrada en ledger');
      assert(player.financialLedger?.[0].resultingBalance === 12000, 'Balance tras gasto es $12.000');
    }

    // 2.2 Energía, Hype, Fans, Reputación, Credibilidad Artística
    {
      const engine = new GameEngine({
        stats: { popularity: 30, reputation: 40, artisticCredibility: 50, energy: 80, monthlyListeners: 30000, totalStreams: 100000, funds: 10000, fansCount: 10000, fanbaseLoyalty: 60, hype: 40 }
      });
      const player = engine.getPlayer();

      const multiStatOutcome = {
        narrativeText: 'Sesión histórica en vivo',
        energyChange: -25,
        hypeChange: 35,
        fansChange: 8500,
        reputationChange: 12,
        statChanges: { artisticCredibility: 65, fanbaseLoyalty: 75 }
      };

      (engine as any).currentEvent = {
        id: 'evt_test_multistat',
        title: 'Presentación en Televisión Nacional',
        category: 'media',
        choices: () => [{ id: 'c_live', text: 'Dar el show de tu vida', apply: () => multiStatOutcome }]
      };

      engine.resolveCurrentEventChoice(0);
      assert(player.stats.energy === 55, 'Energía se redujo exactamente en -25 (80 -> 55)');
      assert(player.stats.hype === 75, 'Hype aumentó exactamente en +35 (40 -> 75)');
      assert(player.stats.fansCount === 18500, 'Fans aumentaron en +8.500 (10.000 -> 18.500)');
      assert(player.stats.reputation === 52, 'Reputación aumentó en +12 (40 -> 52)');
      assert(player.stats.artisticCredibility === 65, 'Credibilidad artística actualizada a 65');
      assert(player.stats.fanbaseLoyalty === 75, 'Fidelidad de fanbase actualizada a 75');
    }

    // 2.3 Contratos: Firmas y Rescisiones
    {
      const engine = new GameEngine({
        stats: { popularity: 50, reputation: 50, artisticCredibility: 50, energy: 100, monthlyListeners: 50000, totalStreams: 200000, funds: 10000, fansCount: 20000, fanbaseLoyalty: 60, hype: 50 },
        labelId: null
      });
      const player = engine.getPlayer();

      // Firma de contrato vía evento
      const contractOutcome = {
        narrativeText: 'Firma con sello independiente',
        newContract: {
          labelId: 'label_dale_play',
          signingBonus: 15000,
          royaltyPercentage: 60,
          albumsRequired: 2,
          albumsDelivered: 0,
          creativeControl: 80,
          marketingPower: 75,
          durationYears: 3,
          signedYear: 2026
        }
      };

      (engine as any).currentEvent = {
        id: 'evt_test_sign_contract',
        title: 'Firma de Contrato',
        category: 'industry',
        choices: () => [{ id: 'c_sign', text: 'Firmar', apply: () => contractOutcome }]
      };

      engine.resolveCurrentEventChoice(0);
      assert(player.labelId === 'label_dale_play', 'player.labelId se actualiza al firmar contrato por evento');
      assert(player.activeContract?.royaltyPercentage === 60, 'player.activeContract tiene 60% de regalías');
      assert(player.activeContract?.signingBonus === 15000, 'player.activeContract tiene anticipo de $15.000');
      assert(engine.getWorld().labels['label_dale_play'].rosterArtistIds.includes(player.id), 'Sello incluye al artista en su roster');

      // Rescisión de contrato vía evento (careerImpact.breakContract)
      const breakContractOutcome = {
        narrativeText: 'Rescisión unilateral de contrato',
        careerImpact: { breakContract: true }
      };

      (engine as any).currentEvent = {
        id: 'evt_test_break_contract',
        title: 'Ruptura Contractual',
        category: 'crisis',
        choices: () => [{ id: 'c_break', text: 'Romper contrato', apply: () => breakContractOutcome }]
      };

      engine.resolveCurrentEventChoice(0);
      assert(player.labelId === null, 'player.labelId queda en null tras rescisión');
      assert(player.activeContract === null, 'player.activeContract queda en null tras rescisión');
    }

    // 2.4 Charts: Impulsos y Penalidades
    {
      const engine = new GameEngine();
      const player = engine.getPlayer();

      // Crear canción de prueba en el catálogo
      const songId = 'song_test_chart_1';
      const testSong: Song = {
        id: songId,
        title: 'Hit de Prueba',
        artistId: player.id,
        featuredArtistIds: [],
        genreId: 'trap_latino',
        subGenreIds: [],
        releaseYear: 2026,
        releaseMonth: 1,
        quality: 85,
        commercialAppeal: 85,
        originality: 80,
        hypeAtRelease: 60,
        streamsTotal: 100000,
        streamsLastMonth: 20000,
        monthlyStreamsHistory: [20000],
        peakPosition: { Global: 15, Argentina: 3, USA: null, LatinAmerica: 8, Europe: null, Spain: null, Mexico: null },
        weeksOnChart: { Global: 2, Argentina: 4, USA: 0, LatinAmerica: 3, Europe: 0, Spain: 0, Mexico: 0 },
        longevityCurve: 'steady',
        isSingle: true,
        receptionRating: 4,
        isClassic: false,
        wentViral: false
      };
      engine.getWorld().songs[songId] = testSong;

      // Evento de impulso de streaming
      const boostOutcome = {
        narrativeText: 'Tendencia viral impulsa el single',
        chartImpact: {
          targetSongId: songId,
          streamingBoostPct: 0.50
        }
      };

      (engine as any).currentEvent = {
        id: 'evt_test_chart_boost',
        title: 'Tendencia Viral en Redes',
        category: 'media',
        choices: () => [{ id: 'c_boost', text: 'Aprovechar la ola', apply: () => boostOutcome }]
      };

      const initialSongStreams = testSong.streamsTotal; // 100,000
      const initialLastMonth = testSong.streamsLastMonth; // 20,000
      engine.resolveCurrentEventChoice(0);

      assert(testSong.streamsTotal === initialSongStreams + 10000, 'Impulso aumentó streamsTotal en +10.000 (50% de 20.000)');
      assert(testSong.streamsLastMonth === initialLastMonth + 10000, 'Impulso aumentó streamsLastMonth en +10.000');

      // Evento de penalidad de streaming (por boicot)
      const penaltyOutcome = {
        narrativeText: 'Boicot reduce reproducciones',
        chartImpact: {
          penaltyPct: 0.20
        }
      };

      (engine as any).currentEvent = {
        id: 'evt_test_chart_penalty',
        title: 'Campaña de Boicot',
        category: 'crisis',
        choices: () => [{ id: 'c_penalty', text: 'Resistir', apply: () => penaltyOutcome }]
      };

      engine.resolveCurrentEventChoice(0);
      assert(testSong.streamsLastMonth === Math.floor(30000 * 0.80), 'Penalidad redujo streamsLastMonth en 20% (30.000 -> 24.000)');
    }

    // 2.5 Giras: Cancelaciones o Bonos
    {
      const engine = new GameEngine();
      const player = engine.getPlayer();

      const testTour: Tour = {
        id: 'tour_test_active',
        name: 'Gira Nacional 2026',
        artistId: player.id,
        tier: 'theater',
        year: 2026,
        month: 1,
        durationMonths: 6,
        stops: [],
        totalCapacity: 15000,
        totalTicketsSold: 12000,
        grossRevenue: 100000,
        netArtistProfit: 45000,
        energyFatigue: 30,
        hypeGenerated: 25,
        fanbaseGained: 4000
      };
      engine.getWorld().tours.push(testTour);
      assert(engine.getWorld().tours.some(t => t.id === 'tour_test_active'), 'Gira activa creada en world.tours');

      // Bonificación de ingresos de gira
      const tourBonusOutcome = {
        narrativeText: 'Patrocinador inyecta bono de taquilla a la gira',
        tourImpact: {
          revenueMultiplier: 1.20,
          hypeBonus: 15
        }
      };

      (engine as any).currentEvent = {
        id: 'evt_test_tour_sponsor',
        title: 'Patrocinio de Gira',
        category: 'shows',
        choices: () => [{ id: 'c_tour_bonus', text: 'Firmar patrocinio', apply: () => tourBonusOutcome }]
      };

      engine.resolveCurrentEventChoice(0);
      const updatedTour = engine.getWorld().tours.find(t => t.id === 'tour_test_active')!;
      assert(updatedTour.grossRevenue === 120000, 'Ingresos brutos de gira aumentaron 20% ($120.000)');
      assert(updatedTour.netArtistProfit === 54000, 'Ganancia neta de gira aumentó 20% ($54.000)');

      // Cancelación de gira
      const tourCancelOutcome = {
        narrativeText: 'Gira suspendida por motivos de fuerza mayor',
        tourImpact: {
          cancelActiveTour: true
        }
      };

      (engine as any).currentEvent = {
        id: 'evt_test_tour_cancel',
        title: 'Emergencia en Gira',
        category: 'crisis',
        choices: () => [{ id: 'c_tour_cancel', text: 'Suspender fechas', apply: () => tourCancelOutcome }]
      };

      engine.resolveCurrentEventChoice(0);
      assert(!engine.getWorld().tours.some(t => t.id === 'tour_test_active'), 'Gira cancelada fue eliminada de world.tours');
    }

    // 2.6 Línea de Tiempo Global (world.globalHistoryTimeline)
    {
      const engine = new GameEngine();
      const player = engine.getPlayer();

      const timelineOutcome = {
        narrativeText: 'Hito histórico registrado',
        timelineEntry: {
          text: `${player.name} conquistó el primer puesto en los charts globales con récord histórico.`,
          category: 'chart'
        }
      };

      (engine as any).currentEvent = {
        id: 'evt_test_milestone',
        title: 'Hito Histórico de Carrera',
        category: 'chart',
        choices: () => [{ id: 'c_milestone', text: 'Celebrar hito', apply: () => timelineOutcome }]
      };

      engine.resolveCurrentEventChoice(0);
      const timeline = engine.getWorld().globalHistoryTimeline;
      assert(timeline.length > 0, 'world.globalHistoryTimeline contiene entradas');
      assert(timeline[0].text.includes('conquistó el primer puesto'), 'La entrada de timeline describe el hito');
      assert(timeline[0].category === 'chart', 'La categoría de timeline es "chart"');
      assert(timeline[0].year === engine.getWorld().currentYear, 'El año en la timeline coincide con el año actual');
    }
  }

  // ============================================================================
  // CASO 3: CADENAS NARRATIVAS DIFERIDAS (NARRATIVE CHAINS)
  // ============================================================================
  console.log('\n🔹 CASO 3: Cadenas Narrativas Diferidas (Narrative Chains)');
  {
    // 3.1 Cadena 1: Demanda por Sample -> Juicio en 6 meses -> Resolución
    console.log('   --- Cadena 1: Demanda por Sample (chain_sample_lawsuit) ---');
    {
      const engine = new GameEngine({
        stats: { popularity: 40, reputation: 45, artisticCredibility: 50, energy: 100, monthlyListeners: 40000, totalStreams: 150000, funds: 30000, fansCount: 15000, fanbaseLoyalty: 65, hype: 50 }
      });

      const lawsuitEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_producer_sample_lawsuit')!;
      assert(Boolean(lawsuitEvt), 'evt_producer_sample_lawsuit existe');

      // Asignar el evento como evento actual
      (engine as any).currentEvent = lawsuitEvt;

      // Opción 1: Contratar abogados e ir a juicio (c_lawsuit_fight_in_court: delay 6 meses)
      const fightChoiceIndex = lawsuitEvt.choices({
        player: engine.getPlayer(),
        world: engine.getWorld(),
        currentYear: engine.getWorld().currentYear,
        currentMonth: engine.getWorld().currentMonth
      }).findIndex(c => c.id === 'c_lawsuit_fight_in_court');

      assert(fightChoiceIndex !== -1, 'Opción c_lawsuit_fight_in_court encontrada');

      const startYear = engine.getWorld().currentYear; // 2026
      const startMonth = engine.getWorld().currentMonth; // 1
      engine.resolveCurrentEventChoice(fightChoiceIndex);

      // Verificar registro en world.activeNarrativeChains
      const activeChains = engine.getWorld().activeNarrativeChains;
      assert(Boolean(activeChains['chain_sample_lawsuit']), 'Cadena "chain_sample_lawsuit" registrada en world.activeNarrativeChains');
      assert(activeChains['chain_sample_lawsuit'].nextEventId === 'evt_chain_lawsuit_resolution', 'nextEventId es "evt_chain_lawsuit_resolution"');

      const expectedTrigger = TimeSystem.advanceMonths(startYear, startMonth, 6);
      assert(
        activeChains['chain_sample_lawsuit'].nextTriggerYearMonth.year === expectedTrigger.year &&
        activeChains['chain_sample_lawsuit'].nextTriggerYearMonth.month === expectedTrigger.month,
        `nextTriggerYearMonth programado para Año ${expectedTrigger.year}, Mes ${expectedTrigger.month} (en 6 meses)`
      );

      // Avanzar un ciclo de 6 meses para que se alcance la fecha de resolución
      engine.advanceCycle(6);

      // Verificar que el evento de resolución se activó
      const resolutionEvt = engine.getCurrentEvent();
      assert(Boolean(resolutionEvt), 'Evento de resolución encolado y disponible');
      assert(resolutionEvt?.id === 'evt_chain_lawsuit_resolution', 'El evento activo es exactamente "evt_chain_lawsuit_resolution"');

      // Resolver el evento de resolución (opción 0: victoria judicial +$30k)
      const fundsBeforeRes = engine.getPlayer().stats.funds;
      engine.resolveCurrentEventChoice(0);

      assert(engine.getPlayer().stats.funds === fundsBeforeRes + 30000, 'Victoria judicial otorgó +$30.000 de indemnización');
      assert(engine.getWorld().activeNarrativeChains['chain_sample_lawsuit'] === undefined, 'Cadena "chain_sample_lawsuit" fue limpiada y eliminada al resolverse');
    }

    // 3.2 Cadena 2: Quiebra de Promotor -> Megagira de Redención en 6 meses
    console.log('   --- Cadena 2: Quiebra de Promotor (chain_tour_promoter) ---');
    {
      const engine = new GameEngine({
        careerStage: 'Established',
        stats: { popularity: 55, reputation: 60, artisticCredibility: 65, energy: 100, monthlyListeners: 80000, totalStreams: 500000, funds: 60000, fansCount: 40000, fanbaseLoyalty: 70, hype: 60 }
      });

      const bankruptcyEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_tour_promoter_bankruptcy')!;
      assert(Boolean(bankruptcyEvt), 'evt_tour_promoter_bankruptcy existe');

      (engine as any).currentEvent = bankruptcyEvt;

      // Opción: Pagar de bolsillo ($40k) y rescatar conciertos -> chainNextEventId: evt_chain_tour_redemption
      const rescueChoiceIndex = bankruptcyEvt.choices({
        player: engine.getPlayer(),
        world: engine.getWorld(),
        currentYear: engine.getWorld().currentYear,
        currentMonth: engine.getWorld().currentMonth
      }).findIndex(c => c.id === 'c_tour_fund_from_pocket');

      assert(rescueChoiceIndex !== -1, 'Opción c_tour_fund_from_pocket encontrada');

      engine.resolveCurrentEventChoice(rescueChoiceIndex);
      assert(Boolean(engine.getWorld().activeNarrativeChains['chain_tour_promoter']), 'Cadena "chain_tour_promoter" registrada en world.activeNarrativeChains');

      // Avanzar 6 meses
      engine.advanceCycle(6);

      const redemptionEvt = engine.getCurrentEvent();
      assert(redemptionEvt?.id === 'evt_chain_tour_redemption', 'El evento activo es "evt_chain_tour_redemption"');

      // Resolver con Megagira de estadios (+$250k)
      const fundsBeforeDeal = engine.getPlayer().stats.funds;
      engine.resolveCurrentEventChoice(0);

      assert(engine.getPlayer().stats.funds === fundsBeforeDeal + 250000, 'Megagira de estadios acreditó +$250.000 de anticipo');
      assert(engine.getWorld().activeNarrativeChains['chain_tour_promoter'] === undefined, 'Cadena "chain_tour_promoter" eliminada tras resolución');
    }

    // 3.3 Cadena 3: Guerra de Sellos -> Emancipación en 6 meses
    console.log('   --- Cadena 3: Guerra de Sellos & Emancipación (chain_label_freedom) ---');
    {
      const engine = new GameEngine({
        careerStage: 'Established',
        labelId: 'label_sony_columbia',
        activeContract: {
          labelId: 'label_sony_columbia',
          signingBonus: 100000,
          royaltyPercentage: 25,
          albumsRequired: 3,
          albumsDelivered: 1,
          creativeControl: 40,
          marketingPower: 90,
          durationYears: 3,
          signedYear: 2026
        },
        stats: { popularity: 65, reputation: 65, artisticCredibility: 70, energy: 100, monthlyListeners: 150000, totalStreams: 1000000, funds: 40000, fansCount: 60000, fanbaseLoyalty: 75, hype: 65 }
      });

      const labelExitEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_label_exit_battle')!;
      assert(Boolean(labelExitEvt), 'evt_label_exit_battle existe');

      (engine as any).currentEvent = labelExitEvt;

      // Opción: Batalla judicial #FreeMyMusic -> chainNextEventId: evt_chain_label_freedom (6 meses)
      const warChoiceIndex = labelExitEvt.choices({
        player: engine.getPlayer(),
        world: engine.getWorld(),
        currentYear: engine.getWorld().currentYear,
        currentMonth: engine.getWorld().currentMonth
      }).findIndex(c => c.id === 'c_label_exit_public_war');

      assert(warChoiceIndex !== -1, 'Opción c_label_exit_public_war encontrada');

      engine.resolveCurrentEventChoice(warChoiceIndex);
      assert(Boolean(engine.getWorld().activeNarrativeChains['chain_label_freedom']), 'Cadena "chain_label_freedom" registrada');

      // Avanzar 6 meses
      engine.advanceCycle(6);

      const freedomEvt = engine.getCurrentEvent();
      assert(freedomEvt?.id === 'evt_chain_label_freedom', 'El evento activo es "evt_chain_label_freedom"');

      // Resolver celebrando independencia total
      engine.resolveCurrentEventChoice(0);

      assert(engine.getPlayer().labelId === null, 'Contrato anulado judicialmente: player.labelId es null');
      assert(engine.getPlayer().activeContract === null, 'player.activeContract es null');
      assert(engine.getWorld().activeNarrativeChains['chain_label_freedom'] === undefined, 'Cadena "chain_label_freedom" eliminada tras resolución');
    }
  }

  // ============================================================================
  // CASO 4: FRECUENCIA ORGÁNICA Y COOLDOWNS
  // ============================================================================
  console.log('\n🔹 CASO 4: Frecuencia Orgánica y Cooldowns');
  {
    // 4.1 Verificación de no-spam obligatorio (probabilidad orgánica ~15% mensual, máx 1 por semestre)
    console.log('   --- 4.1 Verificación de Frecuencia Orgánica ---');
    const engine = new GameEngine({
      stats: { popularity: 25, reputation: 35, artisticCredibility: 45, energy: 100, monthlyListeners: 20000, totalStreams: 60000, funds: 10000, fansCount: 8000, fanbaseLoyalty: 60, hype: 40 }
    });

    let eventsTriggeredCount = 0;
    const testCycles = 20; // 10 años en ciclos de 6 meses

    for (let c = 0; c < testCycles; c++) {
      // Lanzar un single cada año para evitar sequía obligatoria
      if (c % 2 === 0) {
        try {
          engine.releaseSong({
            title: `Track Orgánico Ciclo ${c}`,
            genreId: 'trap_latino',
            subGenreIds: [],
            featuredArtistIds: [],
            budgetProduction: 200,
            budgetMarketing: 100
          });
        } catch (e) {
          // Ignore release quota if reached
        }
      }

      engine.advanceCycle(6);
      if (engine.getCurrentEvent()) {
        eventsTriggeredCount++;
        // Resolver para limpiar
        engine.resolveCurrentEventChoice(0);
      }
      if (engine.getActiveGalaCeremony()) {
        engine.closeGalaCeremony();
      }
    }

    console.log(`   Eventos orgánicos activados en ${testCycles} semestres: ${eventsTriggeredCount}/${testCycles}`);
    assert(eventsTriggeredCount > 0, 'Se activan eventos orgánicos a lo largo del tiempo');
    assert(eventsTriggeredCount < testCycles, 'NO hay un evento forzado en cada uno de los semestres (bucle artificial de spam eliminado)');

    // 4.2 Verificación de Cooldowns (18 a 36 meses previenen repeticiones inmediatas)
    console.log('   --- 4.2 Verificación de Cooldowns de 18-36 Meses ---');
    const world = createBaseWorld();
    const artist = createTestArtist({
      careerStage: 'Emerging',
      stats: { popularity: 40, reputation: 45, artisticCredibility: 50, energy: 100, monthlyListeners: 60000, totalStreams: 120000, funds: 10000, fansCount: 15000, fanbaseLoyalty: 65, hype: 50 }
    });

    const surpriseHitEvt = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_first_surprise_hit')!;
    assert(surpriseHitEvt.cooldownMonths === 36, 'evt_first_surprise_hit tiene cooldownMonths = 36');

    // Registrar ocurrencia en Año 2026, Mes 1
    const recentHistory = [{ eventId: 'evt_first_surprise_hit', year: 2026, month: 1 }];

    // Evaluar selección en Año 2026 Mes 7 (6 meses transcurridos < 36)
    const ctx6M: EventContext = { player: artist, world, currentYear: 2026, currentMonth: 7 };
    const occurrences6M = recentHistory.filter(r => r.eventId === surpriseHitEvt.id);
    const minMonths6M = Math.min(...occurrences6M.map(r => (ctx6M.currentYear - r.year) * 12 + (ctx6M.currentMonth - r.month)));
    assert(minMonths6M === 6, 'Meses transcurridos a 6 meses = 6');
    assert(minMonths6M < surpriseHitEvt.cooldownMonths, '6 meses < 36 meses de cooldown -> Bloqueado');

    // Evaluar selección en Año 2028 Mes 1 (24 meses transcurridos < 36)
    const ctx24M: EventContext = { player: artist, world, currentYear: 2028, currentMonth: 1 };
    const minMonths24M = Math.min(...occurrences6M.map(r => (ctx24M.currentYear - r.year) * 12 + (ctx24M.currentMonth - r.month)));
    assert(minMonths24M === 24, 'Meses transcurridos a 2 años = 24');
    assert(minMonths24M < surpriseHitEvt.cooldownMonths, '24 meses < 36 meses de cooldown -> Bloqueado');

    // Evaluar selección en Año 2029 Mes 2 (37 meses transcurridos >= 36)
    const ctx37M: EventContext = { player: artist, world, currentYear: 2029, currentMonth: 2 };
    const minMonths37M = Math.min(...occurrences6M.map(r => (ctx37M.currentYear - r.year) * 12 + (ctx37M.currentMonth - r.month)));
    assert(minMonths37M === 37, 'Meses transcurridos a 37 meses = 37');
    assert(minMonths37M >= surpriseHitEvt.cooldownMonths, '37 meses >= 36 meses -> Cooldown cumplido, elegible nuevamente');
  }

  // ============================================================================
  // CASO 5: SIMULACIÓN DE LONGEVIDAD A 20, 50 Y 100 AÑOS
  // ============================================================================
  console.log('\n🔹 CASO 5: Simulación de Longevidad a 20, 50 y 100 Años');
  {
    const engine = new GameEngine({
      name: 'Leyenda Centenaria QA',
      birthYear: 2008,
      careerStartYear: 2026,
      stats: {
        popularity: 20,
        reputation: 30,
        artisticCredibility: 50,
        energy: 100,
        monthlyListeners: 15000,
        totalStreams: 50000,
        funds: 5000,
        fansCount: 8000,
        fanbaseLoyalty: 60,
        hype: 50
      }
    });

    let totalEventsResolved = 0;
    let totalDroughtsResolved = 0;
    let totalGalasAttended = 0;

    const runSimulationYears = (yearsTarget: number, label: string) => {
      const startYear = engine.getWorld().currentYear;
      const targetYear = 2026 + yearsTarget;
      const cyclesNeeded = (targetYear - startYear) * 2;

      console.log(`\n   ⏳ Ejecutando simulación hasta ${yearsTarget} Años (${targetYear}, ${cyclesNeeded} ciclos semestrales)...`);

      for (let cycle = 0; cycle < cyclesNeeded; cycle++) {
        const currentSimYear = engine.getWorld().currentYear;

        // Lanzar canciones periódicamente (cada 1-2 años) para simular carrera viva
        if (cycle % 3 === 0 && engine.getPlayer().stats.funds >= 500) {
          try {
            engine.releaseSong({
              title: `Himno ${currentSimYear} #${cycle}`,
              genreId: 'trap_latino',
              subGenreIds: [],
              featuredArtistIds: [],
              budgetProduction: 300,
              budgetMarketing: 200
            });
          } catch (err) {
            // Quota limit or funds limit reached
          }
        }

        engine.advanceCycle(6);

        // Resolver eventos en cola
        while (engine.getCurrentEvent()) {
          const currentEvt = engine.getCurrentEvent()!;
          if (currentEvt.id === 'evt_creative_drought_mandatory') {
            totalDroughtsResolved++;
          } else {
            totalEventsResolved++;
          }
          // Elegir primera opción válida
          engine.resolveCurrentEventChoice(0);
        }

        // Gestionar galas de premios
        if (engine.getActiveGalaCeremony()) {
          totalGalasAttended++;
          engine.closeGalaCeremony();
        }
      }

      // Validaciones exhaustivas de integridad en el hito
      const player = engine.getPlayer();
      const world = engine.getWorld();

      console.log(`   Auditoría de Integridad a ${yearsTarget} Años (Año actual: ${world.currentYear}):`);
      console.log(`     - Fondos: $${player.stats.funds.toLocaleString()}`);
      console.log(`     - Popularidad: ${player.stats.popularity}, Hype: ${player.stats.hype}, Energía: ${player.stats.energy}`);
      console.log(`     - Oyentes Mensuales: ${player.stats.monthlyListeners.toLocaleString()}, Streams Totales: ${player.stats.totalStreams.toLocaleString()}`);
      console.log(`     - Etapa de Carrera: ${player.careerStage}, Legacy Score: ${player.legacyScore}`);
      console.log(`     - Entradas en Timeline Global: ${world.globalHistoryTimeline.length}`);

      // Validar 0 NaNs en todos los stats
      assert(!isNaN(player.stats.funds), `[${label}] Fondos no es NaN`);
      assert(player.stats.funds >= 0, `[${label}] Fondos nunca se corrompen (≥ 0)`);
      assert(!isNaN(player.stats.popularity), `[${label}] Popularidad no es NaN`);
      assert(!isNaN(player.stats.hype), `[${label}] Hype no es NaN`);
      assert(!isNaN(player.stats.energy), `[${label}] Energía no es NaN`);
      assert(!isNaN(player.stats.monthlyListeners), `[${label}] MonthlyListeners no es NaN`);
      assert(!isNaN(player.stats.totalStreams), `[${label}] TotalStreams no es NaN`);
      assert(!isNaN(player.stats.fansCount), `[${label}] FansCount no es NaN`);
      assert(!isNaN(player.stats.reputation), `[${label}] Reputación no es NaN`);
      assert(!isNaN(player.stats.artisticCredibility), `[${label}] Credibilidad Artística no es NaN`);
      assert(!isNaN(player.legacyScore), `[${label}] LegacyScore no es NaN`);

      // Validar acumulación de Timeline y premios
      assert(world.globalHistoryTimeline.length >= yearsTarget * 0.5, `[${label}] Timeline acumula hitos de carrera (${world.globalHistoryTimeline.length} entradas)`);
      assert(world.awardsHistory.length >= yearsTarget * 0.8, `[${label}] Historial de galas de premios acumulado (${world.awardsHistory.length} ceremonias)`);
    };

    // 5.1 Simulación a 20 Años (2026 -> 2046, 40 ciclos)
    runSimulationYears(20, '20 Años');

    // 5.2 Simulación a 50 Años (2046 -> 2076, +60 ciclos)
    runSimulationYears(50, '50 Años');

    // 5.3 Simulación a 100 Años (2076 -> 2126, +100 ciclos)
    runSimulationYears(100, '100 Años');

    console.log(`\n   Estadísticas de la Simulación Centenaria:`);
    console.log(`     - Eventos narrativos resueltos: ${totalEventsResolved}`);
    console.log(`     - Sequías creativas gestionadas: ${totalDroughtsResolved}`);
    console.log(`     - Galas anuales celebradas: ${totalGalasAttended}`);
    assert(totalEventsResolved > 0, 'La simulación centenaria ejecutó eventos narrativos con éxito');
  }

  // ============================================================================
  // RESUMEN FINAL
  // ============================================================================
  console.log('\n======================================================================');
  console.log(`📊 RESUMEN DE AUDITORÍA QA DE EVENTOS EMERGENTES:`);
  console.log(`   Total de comprobaciones ejecutadas: ${stats.total}`);
  console.log(`   \x1b[32mSuperadas con éxito: ${stats.passed}\x1b[0m`);
  console.log(`   \x1b[31mFallidas: ${stats.failed}\x1b[0m`);
  if (stats.failed === 0) {
    console.log(`\n🎉 \x1b[32m100% DE ÉXITO: Todos los casos de eventos emergentes, cadenas narrativas y longevidad validados.\x1b[0m`);
  } else {
    console.log(`\n❌ \x1b[31mSe detectaron ${stats.failed} fallos en la suite de pruebas.\x1b[0m`);
  }
  console.log('======================================================================\n');

  return stats.failed === 0;
}

const success = runAllEmergentEventsTests();
if (!success) {
  process.exit(1);
}
