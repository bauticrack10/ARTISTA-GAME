import { GameEngine } from './src/core/GameEngine';
import { RelationshipEngine } from './src/systems/RelationshipEngine';
import { EventEngine } from './src/systems/EventEngine';
import { CORE_EVENT_TEMPLATES } from './src/data/eventTemplates';
import { Artist, EventContext } from './src/types';

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

function createPlayerArtist(overrides: Partial<Artist> = {}): Artist {
  return {
    id: overrides.id || 'artist_player_qa',
    name: overrides.name || 'MC Novato',
    realName: 'Artista Principiante',
    isPlayer: true,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2007,
    careerStartYear: 2026,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || ['sub_trap_underground'],
    personality: {
      creativity: 80,
      ambition: 80,
      discipline: 80,
      charisma: 75,
      skill: 75,
      commercialAppeal: 70,
      originality: 80,
      riskTolerance: 75,
      sociability: 75,
      independence: 75,
      ...(overrides.personality || {})
    },
    stats: {
      popularity: 15,
      reputation: 25,
      artisticCredibility: 45,
      energy: 100,
      monthlyListeners: 8000,
      totalStreams: 25000,
      funds: 15000,
      fansCount: 3500,
      fanbaseLoyalty: 60,
      hype: 40,
      ...(overrides.stats || {})
    },
    careerStage: overrides.careerStage || 'Underground',
    labelId: null,
    managerId: null,
    relationships: overrides.relationships || {},
    eras: [],
    awardsWon: [],
    legacyScore: 5,
    isRetired: false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    lifestyleUpgrades: [],
    financialLedger: [],
    ...overrides
  } as Artist;
}

function createSuperstarArtist(overrides: Partial<Artist> = {}): Artist {
  return {
    id: overrides.id || 'artist_superstar_qa',
    name: overrides.name || 'Duki Supreme',
    realName: 'Mauro Superestrella',
    isPlayer: false,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 1996,
    careerStartYear: 2017,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || ['sub_trap_underground'],
    personality: {
      creativity: 90,
      ambition: 92,
      discipline: 85,
      charisma: 95,
      skill: 90,
      commercialAppeal: 95,
      originality: 88,
      riskTolerance: 80,
      sociability: 70,
      independence: 75,
      ...(overrides.personality || {})
    },
    stats: {
      popularity: 92,
      reputation: 90,
      artisticCredibility: 88,
      energy: 100,
      monthlyListeners: 7500000,
      totalStreams: 250000000,
      funds: 2500000,
      fansCount: 3000000,
      fanbaseLoyalty: 90,
      hype: 92,
      ...(overrides.stats || {})
    },
    careerStage: 'Superstar',
    labelId: null,
    managerId: null,
    relationships: overrides.relationships || {},
    eras: [],
    awardsWon: [],
    legacyScore: 85,
    isRetired: false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    ...overrides
  } as unknown as Artist;
}

function createPeerArtist(overrides: Partial<Artist> = {}): Artist {
  return {
    id: overrides.id || 'artist_peer_qa',
    name: overrides.name || 'Colega Under',
    realName: 'Artista Par',
    isPlayer: false,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2005,
    careerStartYear: 2025,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || ['sub_trap_underground'],
    personality: {
      creativity: 82,
      ambition: 80,
      discipline: 78,
      charisma: 80,
      skill: 80,
      commercialAppeal: 75,
      originality: 82,
      riskTolerance: 75,
      sociability: 85,
      independence: 70,
      ...(overrides.personality || {})
    },
    stats: {
      popularity: 18,
      reputation: 30,
      artisticCredibility: 50,
      energy: 100,
      monthlyListeners: 12000,
      totalStreams: 35000,
      funds: 10000,
      fansCount: 4500,
      fanbaseLoyalty: 65,
      hype: 42,
      ...(overrides.stats || {})
    },
    careerStage: 'Underground',
    labelId: null,
    managerId: null,
    relationships: overrides.relationships || {},
    eras: [],
    awardsWon: [],
    legacyScore: 8,
    isRetired: false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    ...overrides
  } as unknown as Artist;
}

export function runQACollaborationAndOffersSuite(): boolean {
  console.log('\n===============================================================');
  console.log('🧪 SUITE DE AUDITORÍA QA: COLABORACIONES & OFERTAS ENTRANTES');
  console.log('===============================================================\n');

  // =============================================================
  // CASO 1: NOVATO VS SUPERESTRELLA SIN RELACIÓN PREVIA
  // =============================================================
  console.log('🔹 CASO 1: Un artista novato no puede colaborar con superestrellas sin relación previa');
  {
    const novice = createPlayerArtist();
    const superstar = createSuperstarArtist();

    // 1.1 Sin relación previa (objeto vacío de relaciones)
    assert(!novice.relationships[superstar.id], 'El artista novato no tiene historial ni vínculo previo con la superestrella');

    // 1.2 Evaluación de viabilidad mediante RelationshipEngine
    const feasibilityWithoutRel = RelationshipEngine.calculateCollabFeasibility(
      novice,
      superstar,
      'single_feat',
      1000 // Bajo presupuesto de novato
    );

    assert(feasibilityWithoutRel.willAccept === false, 'Superestrella rechaza la propuesta del novato sin relación previa');
    assert(feasibilityWithoutRel.acceptanceProbability < 50, `Probabilidad de aceptación es muy baja (${feasibilityWithoutRel.acceptanceProbability}% < 50%)`);
    assert(
      feasibilityWithoutRel.reason.includes('brecha') ||
      feasibilityWithoutRel.reason.includes('exposición') ||
      feasibilityWithoutRel.reason.includes('presupuesto'),
      `El motivo cita la brecha de exposición o presupuesto: "${feasibilityWithoutRel.reason}"`
    );

    // 1.3 Intento con GameEngine.proposeAndExecuteCollab
    const engine = new GameEngine(novice);
    engine.getWorld().artists[superstar.id] = superstar;

    const result = engine.proposeAndExecuteCollab({
      targetArtistId: superstar.id,
      type: 'single_feat',
      title: 'Sueño Inalcanzable',
      creditOrder: 'player_feat_target',
      genreId: novice.mainGenreId,
      subGenreIds: novice.subGenreIds,
      budgetProduction: 1000,
      budgetMarketing: 500
    });

    assert(result.success === false, 'GameEngine rechaza ejecutar la colaboración con la superestrella');
    assert(Boolean(result.reason), `Retorna motivo explícito al jugador: "${result.reason}"`);
  }

  // =============================================================
  // CASO 2: ARTISTA DE IGUAL NIVEL O CON ALTA AFINIDAD
  // =============================================================
  console.log('\n🔹 CASO 2: Un artista de igual nivel o con alta afinidad puede aceptar la colaboración');
  {
    // Subcaso 2.1: Artista de igual nivel (Peer / Underground)
    const novice = createPlayerArtist();
    const peer = createPeerArtist();

    const peerFeasibility = RelationshipEngine.calculateCollabFeasibility(
      novice,
      peer,
      'single_feat',
      1500
    );

    assert(peerFeasibility.willAccept === true, 'Artista de igual nivel (peer) acepta la colaboración');
    assert(peerFeasibility.acceptanceProbability >= 50, `Probabilidad de aceptación entre pares es alta: ${peerFeasibility.acceptanceProbability}%`);
    assert(peerFeasibility.chemistryScore >= 5 && peerFeasibility.chemistryScore <= 25, `Química musical en rango saludable [5, 25]: ${peerFeasibility.chemistryScore}`);
    assert(peerFeasibility.crossFanbasePotential > 0, `Potencial de cruce de fanáticos positivo: ${peerFeasibility.crossFanbasePotential}`);

    // Subcaso 2.2: Artista con alta afinidad previa (+70) y alto respeto (+80)
    const popularArtist = createSuperstarArtist({
      id: 'artist_mentor_star',
      name: 'Mentor Consagrado',
      stats: { popularity: 75, reputation: 80, funds: 500000, energy: 100, monthlyListeners: 2000000, totalStreams: 50000000, fansCount: 800000, fanbaseLoyalty: 85, hype: 70 } as any
    });

    novice.relationships[popularArtist.id] = {
      targetArtistId: popularArtist.id,
      relationType: 'friend',
      affinity: 75,
      respect: 85,
      pastCollabsCount: 1,
      history: []
    };

    const mentorFeasibility = RelationshipEngine.calculateCollabFeasibility(
      novice,
      popularArtist,
      'single_feat',
      6000
    );

    assert(mentorFeasibility.willAccept === true, 'Artista consagrado acepta gracias a la alta afinidad (+75) y respeto (+85)');
    assert(mentorFeasibility.acceptanceProbability >= 50, `Probabilidad de aceptación con afinidad alta >= 50%: ${mentorFeasibility.acceptanceProbability}%`);
    assert(
      mentorFeasibility.reason.includes('afinidad') || mentorFeasibility.reason.includes('respeto') || mentorFeasibility.reason.includes('propuesta'),
      `Motivo de aceptación refleja la afinidad o propuesta: "${mentorFeasibility.reason}"`
    );

    // Subcaso 2.3: Ejecución completa en GameEngine
    const engine = new GameEngine(novice);
    engine.getWorld().artists[peer.id] = peer;
    engine.getPlayer().stats.funds = 20000;
    engine.getPlayer().stats.energy = 100;

    const initialFunds = engine.getPlayer().stats.funds;
    const initialEnergy = engine.getPlayer().stats.energy;

    const acceptedCollab = engine.proposeAndExecuteCollab({
      targetArtistId: peer.id,
      type: 'single_feat',
      title: 'Pacto Under',
      creditOrder: 'player_feat_target',
      genreId: novice.mainGenreId,
      subGenreIds: novice.subGenreIds,
      budgetProduction: 2000,
      budgetMarketing: 1000
    });

    assert(acceptedCollab.success === true, 'Colaboración aceptada se ejecuta exitosamente');
    assert(acceptedCollab.song !== undefined, 'Se crea la canción colaborativa');
    assert(acceptedCollab.song?.featuredArtistIds.includes(peer.id), 'featuredArtistIds contiene el ID del colega');
    assert(engine.getPlayer().stats.funds === initialFunds - 3000, 'Fondos debitados con exactitud al aceptarse');
    assert(engine.getPlayer().stats.energy === initialEnergy - 15, 'Energía debitada (-15%) tras grabación');
    assert(engine.getPlayer().relationships[peer.id].pastCollabsCount === 1, 'pastCollabsCount incrementado');
  }

  // =============================================================
  // CASO 3: RECHAZO REGISTRA MOTIVO, REDUCE AFINIDAD LEVEMENTE Y NO DESCUENTA FONDOS
  // =============================================================
  console.log('\n🔹 CASO 3: Rechazo registra el motivo y reduce afinidad levemente sin descontar fondos');
  {
    const player = createPlayerArtist({
      stats: { funds: 25000, energy: 90, popularity: 20 } as any
    });
    const difficultArtist = createPeerArtist({
      id: 'artist_difficult',
      name: 'Artista Orgulloso',
      personality: { sociability: 20, ambition: 90 } as any,
      stats: { popularity: 45 } as any
    });

    const engine = new GameEngine(player);
    engine.getWorld().artists[difficultArtist.id] = difficultArtist;

    // Establecer afinidad inicial neutra (10)
    RelationshipEngine.modifyRelationship(
      engine.getPlayer(),
      difficultArtist,
      10,
      50,
      'neutral',
      'Primer contacto inicial.'
    );

    const initialAffinity = engine.getPlayer().relationships[difficultArtist.id].affinity;
    const initialFunds = engine.getPlayer().stats.funds;
    const initialEnergy = engine.getPlayer().stats.energy;
    const initialSongsCount = Object.keys(engine.getWorld().songs).length;
    const initialHistoryLen = engine.getPlayer().relationships[difficultArtist.id].history.length;

    // Proponer colaboración con presupuesto insuficiente para forzar rechazo
    const rejectResult = engine.proposeAndExecuteCollab({
      targetArtistId: difficultArtist.id,
      type: 'single_feat',
      title: 'Propuesta Inadecuada',
      creditOrder: 'player_feat_target',
      genreId: player.mainGenreId,
      subGenreIds: player.subGenreIds,
      budgetProduction: 200,
      budgetMarketing: 100
    });

    // 3.1 Verificación de rechazo
    assert(rejectResult.success === false, 'La propuesta fue rechazada');
    assert(Boolean(rejectResult.reason && rejectResult.reason.length > 0), `El motivo de rechazo está registrado: "${rejectResult.reason}"`);

    // 3.2 Fondos y Energía 100% intactos
    assert(engine.getPlayer().stats.funds === initialFunds, `Fondos permanecen intactos ($${engine.getPlayer().stats.funds} === $${initialFunds})`);
    assert(engine.getPlayer().stats.energy === initialEnergy, `Energía permanece intacta (${engine.getPlayer().stats.energy}% === ${initialEnergy}%)`);

    // 3.3 Catálogo intacto (cero canciones creadas)
    assert(Object.keys(engine.getWorld().songs).length === initialSongsCount, 'No se generaron canciones huérfanas en el catálogo');

    // 3.4 Reducción leve de afinidad (-4 puntos en GameEngine)
    const newAffinity = engine.getPlayer().relationships[difficultArtist.id].affinity;
    assert(newAffinity === initialAffinity - 4, `Afinidad reducida levemente (-4 pts): ${initialAffinity} -> ${newAffinity}`);

    // 3.5 Registro en el histórico de la relación
    const updatedHistory = engine.getPlayer().relationships[difficultArtist.id].history;
    assert(updatedHistory.length === initialHistoryLen + 1, 'Se añadió una nueva entrada en el historial de relación');
    const lastEntry = updatedHistory[updatedHistory.length - 1];
    assert(lastEntry.includes('rechazada') && lastEntry.includes(rejectResult.reason!), 'El historial contiene el motivo exacto del rechazo');
  }

  // =============================================================
  // CASO 4: OFERTAS ALEATORIAS ENTRANTES DE CANTANTES Y PRODUCTORES EN advanceCycle
  // =============================================================
  console.log('\n🔹 CASO 4: Ofertas aleatorias entrantes de cantantes y productores en advanceCycle');
  {
    const player = createPlayerArtist({
      stats: { popularity: 25, artisticCredibility: 55, funds: 10000, energy: 90, monthlyListeners: 15000 } as any,
      careerStage: 'Underground'
    });

    const engine = new GameEngine(player);
    const world = engine.getWorld();

    // 4.1 Verificación de plantillas de ofertas entrantes en el catálogo
    const beatmakerEvent = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_finding_a_beatmaker');
    assert(beatmakerEvent !== undefined, 'Plantilla "evt_finding_a_beatmaker" (oferta entrante de productor/beatmaker) existe en CORE_EVENT_TEMPLATES');

    const loyaltyDilemmaEvent = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_beatmaker_loyalty_dilemma');
    assert(loyaltyDilemmaEvent !== undefined, 'Plantilla "evt_beatmaker_loyalty_dilemma" (oferta de productor comercial hitmaker) existe en CORE_EVENT_TEMPLATES');

    const iconCollabEvent = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_unexpected_icon_collab');
    assert(iconCollabEvent !== undefined, 'Plantilla "evt_unexpected_icon_collab" (oferta entrante de colaboración de cantante legendario) existe en CORE_EVENT_TEMPLATES');

    // 4.2 Verificación de condiciones de elegibilidad
    const ctxUnderground: EventContext = {
      player,
      world,
      currentYear: world.currentYear,
      currentMonth: world.currentMonth
    };

    assert(beatmakerEvent!.condition(ctxUnderground) === true, 'Oferta de beatmaker es elegible para artista novato con popularidad <= 30');

    // Simular condiciones para icono
    const breakoutPlayer = createPlayerArtist({
      stats: { popularity: 50, artisticCredibility: 65, funds: 80000, energy: 90 } as any,
      careerStage: 'Breakout'
    });
    const ctxBreakout: EventContext = {
      player: breakoutPlayer,
      world,
      currentYear: world.currentYear,
      currentMonth: world.currentMonth
    };
    assert(iconCollabEvent!.condition(ctxBreakout) === true, 'Oferta de colaboración con ícono es elegible para artista en Breakout con credibilidad >= 50');

    // 4.3 Verificación de opciones (choices) de las ofertas
    const beatmakerChoices = beatmakerEvent!.choices(ctxUnderground);
    assert(beatmakerChoices.length >= 2, `La oferta de beatmaker ofrece opciones variadas (${beatmakerChoices.length} opciones)`);
    const collabChoice = beatmakerChoices.find(c => c.id === 'c_collab_beatmaker');
    assert(collabChoice !== undefined, 'Opción de colaborar con el beatmaker ("c_collab_beatmaker") disponible');

    const collabOutcome = collabChoice!.apply(ctxUnderground);
    assert(collabOutcome.hypeChange !== undefined && collabOutcome.hypeChange > 0, 'Aceptar oferta de beatmaker aporta Hype');
    assert(collabOutcome.fansChange !== undefined && collabOutcome.fansChange > 0, 'Aceptar oferta de beatmaker aporta nuevos fans');

    // 4.4 Verificación de generación de dilema de sesión de beatmaker en EventEngine procedural
    const proceduralSession = EventEngine.synthesizeProceduralEvent({
      player,
      world,
      currentYear: world.currentYear,
      currentMonth: world.currentMonth
    });
    assert(proceduralSession !== null && proceduralSession.id.length > 0, 'EventEngine genera eventos procedurales válidos si no hay plantillas prioritarias');
    assert(proceduralSession.choices(ctxUnderground).length >= 2, 'Evento procedural presenta elecciones de decisión');

    // 4.5 Ejecución de advanceCycle para verificar despacho y encolamiento
    const initialYear = world.currentYear;
    const initialMonth = world.currentMonth;

    // Forzar evento prioritario en la cola para verificar que advanceCycle no crashea y lo encola correctamente
    world.activeNarrativeChains = {
      test_collab_chain: {
        currentStep: 1,
        nextTriggerYearMonth: { year: initialYear, month: initialMonth },
        nextEventId: 'evt_finding_a_beatmaker'
      }
    };

    engine.advanceCycle(6);

    assert(world.currentMonth === 7 || world.currentYear > initialYear, 'advanceCycle avanzó el tiempo 6 meses');
    assert(engine.getCurrentEvent() !== null, 'El ciclo procesa y expone el evento entrante para interacción del jugador');
  }

  // =============================================================
  // RESUMEN Y RESULTADOS
  // =============================================================
  console.log('\n===============================================================');
  console.log('📊 RESUMEN DE EJECUCIÓN QA & AUDITORÍA:');
  console.log(`   Total de aserciones: ${stats.total}`);
  console.log(`   \x1b[32mSuperadas: ${stats.passed}\x1b[0m`);
  console.log(`   \x1b[31mFallidas: ${stats.failed}\x1b[0m`);
  if (stats.failed === 0) {
    console.log('\n🎉 \x1b[32m100% EXITOSO: Todos los casos de prueba de colaboraciones y ofertas entrantes pasaron satisfactoriamente.\x1b[0m');
  } else {
    console.log(`\n❌ \x1b[31mSe detectaron ${stats.failed} fallas en la auditoría.\x1b[0m`);
    stats.errors.forEach(e => console.error(`  - ${e}`));
  }
  console.log('===============================================================\n');

  return stats.failed === 0;
}

// Ejecutar automáticamente si es llamado por CLI
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('test-collab-and-offers-qa')) {
  const ok = runQACollaborationAndOffersSuite();
  if (!ok) process.exit(1);
}
