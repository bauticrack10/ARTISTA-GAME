import { GameEngine } from './src/core/GameEngine';
import {
  WorldState,
  Artist,
  Song,
  Album,
  ArtistRelationship,
  SocialActionResult,
  InteractionResult
} from './src/types';
import { RelationshipEngine } from './src/systems/RelationshipEngine';
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

function createPlayerArtist(overrides: Partial<Artist> = {}): Partial<Artist> {
  return {
    id: overrides.id || 'artist_player_qa',
    name: overrides.name || 'MC Protagonista QA',
    realName: 'Auditor QA',
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
      popularity: 45,
      reputation: 50,
      artisticCredibility: 60,
      energy: 100,
      monthlyListeners: 40000,
      totalStreams: 100000,
      funds: 50000,
      fansCount: 25000,
      fanbaseLoyalty: 75,
      hype: 50,
      ...(overrides.stats || {})
    },
    careerStage: overrides.careerStage || 'Emerging',
    labelId: null,
    managerId: null,
    relationships: overrides.relationships || {},
    eras: [],
    awardsWon: [],
    legacyScore: 20,
    isRetired: false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    lifestyleUpgrades: [],
    financialLedger: [],
    ...overrides
  };
}

function createTargetArtist(overrides: Partial<Artist> = {}): Artist {
  return {
    id: overrides.id || `artist_target_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: overrides.name || 'Colega de la Escena',
    realName: 'Nombre Real Colega',
    isPlayer: false,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2003,
    careerStartYear: 2024,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || ['sub_trap_underground'],
    personality: {
      creativity: 80,
      ambition: 80,
      discipline: 75,
      charisma: 85,
      skill: 80,
      commercialAppeal: 80,
      originality: 78,
      riskTolerance: 70,
      sociability: 80,
      independence: 70,
      ...(overrides.personality || {})
    },
    stats: {
      popularity: 50,
      reputation: 55,
      artisticCredibility: 60,
      energy: 100,
      monthlyListeners: 100000,
      totalStreams: 300000,
      funds: 60000,
      fansCount: 60000,
      fanbaseLoyalty: 75,
      hype: 55,
      ...(overrides.stats || {})
    },
    careerStage: overrides.careerStage || 'Established',
    labelId: null,
    managerId: null,
    activeContract: null,
    relationships: overrides.relationships || {},
    eras: [],
    awardsWon: [],
    legacyScore: 25,
    isRetired: overrides.isRetired || false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    lifestyleUpgrades: [],
    financialLedger: [],
    ...overrides
  };
}

export function runSocialActionsTests(): boolean {
  console.log('\n========================================================================');
  console.log('🧪 SUITE DE PRUEBAS QA & AUDITORÍA: ACCIONES SOCIALES, COOLDOWNS & BEEFS');
  console.log('========================================================================\n');

  // ====================================================================
  // CASO 1: COOLDOWN DE ELOGIO (SHOUTOUT)
  // ====================================================================
  console.log('🔹 CASO 1: Cooldown de Elogio (Shoutout) & Desbloqueo Temporal');
  {
    const engine = new GameEngine(createPlayerArtist({
      stats: { hype: 40, popularity: 40, artisticCredibility: 60 }
    }));

    const target1 = createTargetArtist({ id: 'artist_target_shoutout_1', name: 'Milo J QA' });
    const target2 = createTargetArtist({ id: 'artist_target_shoutout_2', name: 'Bhavi QA' });

    engine.getWorld().artists[target1.id] = target1;
    engine.getWorld().artists[target2.id] = target2;

    const initialNewsCount = engine.getWorld().news.length;
    const initialSocialCount = engine.getWorld().socialFeed?.length || 0;

    // 1.1 Primer elogio en Año 2026, Mes 1
    const check1 = RelationshipEngine.canSendShoutout(engine.getPlayer(), target1, 2026, 1);
    assert(check1.canSend === true && check1.canPerform === true, '1.1 canSendShoutout permite el 1er elogio');
    assert(check1.cooldownRemainingMonths === 0, '1.1 Cooldown restante inicial es 0 meses');

    const result1 = engine.interactWithArtist(target1.id, 'shoutout') as SocialActionResult;
    assert(result1.success === true, '1.1 interactWithArtist ejecuta con éxito el 1er elogio');
    assert(result1.outcomeType === 'shoutout_success', '1.1 outcomeType es shoutout_success');
    assert(result1.affinityDelta === 12, `1.1 Afinidad incrementó +12 pts (Actual: ${result1.affinityDelta})`);
    assert(result1.respectDelta === 10, `1.1 Respeto incrementó +10 pts (Actual: ${result1.respectDelta})`);
    assert(result1.hypeChange === 8, `1.1 Hype ganado es +8 pts`);
    assert(engine.getPlayer().stats.hype === 48, `1.1 Hype total del jugador actualizado a 48 (40 + 8)`);

    const relA1 = engine.getPlayer().relationships[target1.id];
    assert(relA1 !== undefined, '1.1 Relación creada en el jugador');
    assert(relA1.lastShoutoutYear === 2026 && relA1.lastShoutoutMonth === 1, '1.1 Timestamp de último elogio registrado en Año 2026, Mes 1');
    assert(relA1.shoutoutCount === 1, '1.1 shoutoutCount incrementado a 1');

    assert(engine.getWorld().news.length > initialNewsCount, '1.1 Se generó noticia pública del elogio');
    assert(Boolean(result1.newsItem && result1.newsItem.headline.includes('elogia públicamente')), '1.1 Titular de noticia de elogio generado');
    assert((engine.getWorld().socialFeed?.length || 0) > initialSocialCount, '1.1 Se generaron reacciones en redes sociales');

    // 1.2 Intento de 2do elogio al MISMO artista antes de 3 meses -> BLOQUEADO
    // En Mes 1 (0 meses transcurridos):
    const checkBlockedM1 = RelationshipEngine.canSendShoutout(engine.getPlayer(), target1, 2026, 1);
    assert(checkBlockedM1.canSend === false && checkBlockedM1.canPerform === false, '1.2 Elogio al mismo artista en Mes 1 es bloqueado');
    assert(checkBlockedM1.cooldownRemainingMonths === 3, `1.2 Cooldown restante es 3 meses`);
    assert(checkBlockedM1.nextAvailableDate === 'Año 2026 • Mes 4', `1.2 Próxima fecha disponible es Año 2026 • Mes 4: "${checkBlockedM1.nextAvailableDate}"`);

    // Comprobar que interactWithArtist arroja error si se intenta forzar
    let threwError = false;
    try {
      engine.interactWithArtist(target1.id, 'shoutout');
    } catch (e: any) {
      threwError = true;
      assert(Boolean(e.message && e.message.includes('Debes esperar')), `1.2 Error defensivo capturado: "${e.message}"`);
    }
    assert(threwError === true, '1.2 interactWithArtist arroja excepción ante intento en cooldown');

    // En Mes 2 (1 mes transcurrido):
    const checkBlockedM2 = RelationshipEngine.canSendShoutout(engine.getPlayer(), target1, 2026, 2);
    assert(checkBlockedM2.canSend === false, '1.2 Elogio en Mes 2 permanece bloqueado');
    assert(checkBlockedM2.cooldownRemainingMonths === 2, '1.2 Cooldown restante en Mes 2 es 2 meses');

    // En Mes 3 (2 meses transcurridos):
    const checkBlockedM3 = RelationshipEngine.canSendShoutout(engine.getPlayer(), target1, 2026, 3);
    assert(checkBlockedM3.canSend === false, '1.2 Elogio en Mes 3 permanece bloqueado');
    assert(checkBlockedM3.cooldownRemainingMonths === 1, '1.2 Cooldown restante en Mes 3 es 1 mes');

    // 1.3 Validar que un artista DIFERENTE NO está bloqueado (cooldown es per-target)
    const checkTarget2InM2 = RelationshipEngine.canSendShoutout(engine.getPlayer(), target2, 2026, 2);
    assert(checkTarget2InM2.canSend === true, '1.3 Elogio a un 2do artista diferente en Mes 2 está habilitado (cooldown es por objetivo)');

    // 1.4 Al avanzar 3 meses (hasta Mes 4), el elogio a target1 vuelve a estar habilitado
    const checkUnblockedM4 = RelationshipEngine.canSendShoutout(engine.getPlayer(), target1, 2026, 4);
    assert(checkUnblockedM4.canSend === true && checkUnblockedM4.canPerform === true, '1.4 En Mes 4 (3 meses cumplidos) el elogio vuelve a estar habilitado');
    assert(checkUnblockedM4.cooldownRemainingMonths === 0, '1.4 Cooldown restante en Mes 4 es 0 meses');

    // 1.5 Ejecución de 2do elogio exitoso tras cooldown
    const result2 = RelationshipEngine.processShoutout(engine.getPlayer(), target1, 2026, 4, engine.getWorld());
    assert(result2.success === true, '1.5 2do elogio ejecutado con éxito en Mes 4');
    assert(relA1.shoutoutCount === 2, '1.5 shoutoutCount actualizado a 2');
    assert(relA1.lastShoutoutMonth === 4, '1.5 lastShoutoutMonth actualizado a 4');
  }

  // ====================================================================
  // CASO 2: RENDIMIENTOS DECRECIENTES & ELOGIO A RIVALES/FEUDOS
  // ====================================================================
  console.log('\n🔹 CASO 2: Rendimientos Decrecientes de Elogio & Mofa Pública a Rivales');
  {
    const engine = new GameEngine(createPlayerArtist({
      stats: { hype: 30, artisticCredibility: 70 },
      personality: { discipline: 80 }
    }));

    const friendTarget = createTargetArtist({ id: 'artist_friend_diminishing', name: 'Nicki Amiga QA' });
    const rivalTarget = createTargetArtist({ id: 'artist_rival_mock', name: 'Dante Rival QA' });

    engine.getWorld().artists[friendTarget.id] = friendTarget;
    engine.getWorld().artists[rivalTarget.id] = rivalTarget;

    // Subcaso 2A: Curva de Rendimientos Decrecientes (1er, 2do, 3er, 4to elogio)
    console.log('  --- Subcaso 2A: Curva de Rendimientos Decrecientes (+12, +6, +2, +2) ---');

    // 1er Elogio: +12 afinidad, +10 respeto, +8 hype
    const res1 = RelationshipEngine.processShoutout(engine.getPlayer(), friendTarget, 2026, 1, engine.getWorld());
    assert(res1.affinityDelta === 12, `2.1 1er Elogio da +12 afinidad (Actual: +${res1.affinityDelta})`);
    assert(res1.respectDelta === 10, `2.1 1er Elogio da +10 respeto (Actual: +${res1.respectDelta})`);
    assert(res1.hypeChange === 8, `2.1 1er Elogio da +8 hype (Actual: +${res1.hypeChange})`);

    // 2do Elogio (Mes 4 tras cooldown): +6 afinidad, +5 respeto, +4 hype
    const res2 = RelationshipEngine.processShoutout(engine.getPlayer(), friendTarget, 2026, 4, engine.getWorld());
    assert(res2.affinityDelta === 6, `2.2 2do Elogio da +6 afinidad (Actual: +${res2.affinityDelta})`);
    assert(res2.respectDelta === 5, `2.2 2do Elogio da +5 respeto (Actual: +${res2.respectDelta})`);
    assert(res2.hypeChange === 4, `2.2 2do Elogio da +4 hype (Actual: +${res2.hypeChange})`);

    // 3er Elogio (Mes 7 tras cooldown): +2 afinidad, +1 respeto, +1 hype
    const res3 = RelationshipEngine.processShoutout(engine.getPlayer(), friendTarget, 2026, 7, engine.getWorld());
    assert(res3.affinityDelta === 2, `2.3 3er Elogio da +2 afinidad (Actual: +${res3.affinityDelta})`);
    assert(res3.respectDelta === 1, `2.3 3er Elogio da +1 respeto (Actual: +${res3.respectDelta})`);
    assert(res3.hypeChange === 1, `2.3 3er Elogio da +1 hype (Actual: +${res3.hypeChange})`);

    // 4to Elogio (Mes 10 tras cooldown): +2 afinidad, +1 respeto, +1 hype (se mantiene en +2)
    const res4 = RelationshipEngine.processShoutout(engine.getPlayer(), friendTarget, 2026, 10, engine.getWorld());
    assert(res4.affinityDelta === 2, `2.4 4to Elogio da +2 afinidad (piso de rendimientos) (Actual: +${res4.affinityDelta})`);
    assert(res4.respectDelta === 1, `2.4 4to Elogio da +1 respeto (Actual: +${res4.respectDelta})`);
    assert(res4.hypeChange === 1, `2.4 4to Elogio da +1 hype (Actual: +${res4.hypeChange})`);

    // Subcaso 2B: Elogio a un Rival / Feudo -> Mofa Pública en Redes (-4 Credibilidad, -5 Disciplina)
    console.log('\n  --- Subcaso 2B: Elogio a Rival/Feudo -> Mofa por Adulación (-4 Cred, -5 Disc) ---');

    // Configurar a rivalTarget como 'rival'
    RelationshipEngine.modifyRelationship(
      engine.getPlayer(),
      rivalTarget,
      -30,
      40,
      'rival',
      'Rivalidad establecida en festivales'
    );

    const initialCredibility = engine.getPlayer().stats.artisticCredibility; // 70
    const initialDiscipline = engine.getPlayer().personality.discipline; // 80

    const resMock = RelationshipEngine.processShoutout(engine.getPlayer(), rivalTarget, 2026, 1, engine.getWorld());

    assert(resMock.success === true, '2.5 Elogio a rival se procesa');
    assert(resMock.outcomeType === 'shoutout_mocked', `2.5 outcomeType es shoutout_mocked: "${resMock.outcomeType}"`);
    assert(resMock.credibilityChange === -4, `2.5 Penalización de credibilidad: -4 pts (Actual: ${resMock.credibilityChange})`);
    assert(resMock.disciplineChange === -5, `2.5 Penalización de disciplina: -5 pts (Actual: ${resMock.disciplineChange})`);
    assert(engine.getPlayer().stats.artisticCredibility === initialCredibility - 4, `2.5 Credibilidad artística reducida a ${initialCredibility - 4} (Esperado ${initialCredibility - 4})`);
    assert(engine.getPlayer().personality.discipline === initialDiscipline - 5, `2.5 Disciplina reducida a ${initialDiscipline - 5} (Esperado ${initialDiscipline - 5})`);
    assert(Boolean(resMock.newsItem && resMock.newsItem.category === 'scandal'), '2.5 Noticia generada como categoría "scandal"');
    assert(Boolean(resMock.newsItem && resMock.newsItem.sentiment === 'shocking'), '2.5 Sentimiento de noticia es "shocking"');
    assert(Boolean(resMock.outcomeDescription.includes('adulación') || resMock.outcomeDescription.includes('rival')), '2.5 Descripción detalla mofa por adulación');
  }

  // ====================================================================
  // CASO 3: COOLDOWN DE TIRADERA (DISS) - ESPECÍFICO (6M) Y GLOBAL (4M)
  // ====================================================================
  console.log('\n🔹 CASO 3: Cooldown de Tiradera (Diss) - Específico (6 Meses) & Global (4 Meses)');
  {
    const engine = new GameEngine(createPlayerArtist({
      personality: { skill: 85, originality: 80 },
      stats: { artisticCredibility: 70, energy: 100, hype: 30 }
    }));

    const rivalA = createTargetArtist({ id: 'artist_rival_cooldown_a', name: 'Rival A QA' });
    const rivalB = createTargetArtist({ id: 'artist_rival_cooldown_b', name: 'Rival B QA' });

    engine.getWorld().artists[rivalA.id] = rivalA;
    engine.getWorld().artists[rivalB.id] = rivalB;

    // 3.1 Primera tiradera hacia Rival A en Año 2026, Mes 1
    const checkDiss1 = RelationshipEngine.canSendDiss(engine.getPlayer(), rivalA, 2026, 1);
    assert(checkDiss1.canSend === true && checkDiss1.canPerform === true, '3.1 canSendDiss permite la 1era tiradera');

    const dissResult1 = engine.interactWithArtist(rivalA.id, 'diss') as SocialActionResult;
    assert(dissResult1.success === true, '3.1 Tiradera contra Rival A ejecutada exitosamente');
    assert(engine.getPlayer().stats.energy === 100 - 15, '3.1 Descontó 15 pts de energía al jugador (100 -> 85)');

    const relA = engine.getPlayer().relationships[rivalA.id];
    assert(relA.lastDissYear === 2026 && relA.lastDissMonth === 1, '3.1 lastDissYear y lastDissMonth registrados en 2026-1');
    assert(relA.activeRivalry === true, '3.1 activeRivalry activada en true');

    // 3.2 Intento de tiradera en Mes 2 (1 mes transcurrido)
    // A) Hacia Rival A (bloqueado por cooldown específico 6m y global 4m)
    const checkRivalAMes2 = RelationshipEngine.canSendDiss(engine.getPlayer(), rivalA, 2026, 2);
    assert(checkRivalAMes2.canSend === false, '3.2 Tiradera a Rival A en Mes 2 está bloqueada');
    assert(checkRivalAMes2.cooldownRemainingMonths === 3, '3.2 Cooldown global restante hacia Rival A es 3 meses');

    // B) Hacia Rival B (artista nuevo, pero bloqueado por COOLDOWN GLOBAL DE 4 MESES)
    const checkRivalBMes2 = RelationshipEngine.canSendDiss(engine.getPlayer(), rivalB, 2026, 2);
    assert(checkRivalBMes2.canSend === false, '3.2 Tiradera a Rival B en Mes 2 está BLOQUEADA por Cooldown Global (mín. 4 meses en la escena)');
    assert(checkRivalBMes2.cooldownRemainingMonths === 3, '3.2 Cooldown global restante para Rival B es 3 meses (4 - 1)');
    assert(Boolean(checkRivalBMes2.reason && checkRivalBMes2.reason.includes('Cooldown global')), `3.2 Motivo menciona Cooldown Global: "${checkRivalBMes2.reason}"`);

    // Intentar forzar interactWithArtist en Mes 2 arroja excepción
    let dissBlockedThrow = false;
    try {
      engine.interactWithArtist(rivalB.id, 'diss');
    } catch (e: any) {
      dissBlockedThrow = true;
      assert(Boolean(e.message && e.message.includes('Cooldown global')), `3.2 Excepción defensiva de cooldown global: "${e.message}"`);
    }
    assert(dissBlockedThrow === true, '3.2 interactWithArtist bloquea tiradera en cooldown global');

    // 3.3 En Mes 4 (3 meses transcurridos): Cooldown global aún activo (falta 1 mes)
    const checkGlobalM4 = RelationshipEngine.canSendDiss(engine.getPlayer(), rivalB, 2026, 4);
    assert(checkGlobalM4.canSend === false, '3.3 En Mes 4 el Cooldown Global sigue activo');
    assert(checkGlobalM4.cooldownRemainingMonths === 1, '3.3 Cooldown global restante en Mes 4 es 1 mes');

    // 3.4 En Mes 5 (4 meses cumplidos desde última tiradera global):
    // A) Tiradera hacia Rival B: HABILITADA (Cooldown global superado)
    const checkRivalBMes5 = RelationshipEngine.canSendDiss(engine.getPlayer(), rivalB, 2026, 5);
    assert(checkRivalBMes5.canSend === true && checkRivalBMes5.canPerform === true, '3.4 En Mes 5 (4 meses transcurridos), tiradera a Rival B está HABILITADA');

    // B) Tiradera hacia Rival A: BLOQUEADA (Cooldown específico de 6 meses: 4 < 6, faltan 2 meses)
    // Para probarlo de forma aislada (sin diss en Rival B), evaluamos Rival A en Mes 5:
    const checkRivalAMes5 = RelationshipEngine.canSendDiss(engine.getPlayer(), rivalA, 2026, 5);
    assert(checkRivalAMes5.canSend === false, '3.4 En Mes 5, tiradera a Rival A permanece BLOQUEADA por Cooldown Específico de 6 meses');
    assert(checkRivalAMes5.cooldownRemainingMonths === 2, '3.4 Cooldown específico restante para Rival A es 2 meses (6 - 4)');
    assert(Boolean(checkRivalAMes5.reason && checkRivalAMes5.reason.includes(rivalA.name)), `3.4 Motivo menciona que ya le tiró a ${rivalA.name}: "${checkRivalAMes5.reason}"`);

    // 3.5 En Mes 7 (6 meses transcurridos desde tiradera a Rival A):
    // Tiradera a Rival A vuelve a estar HABILITADA
    const checkRivalAMes7 = RelationshipEngine.canSendDiss(engine.getPlayer(), rivalA, 2026, 7);
    assert(checkRivalAMes7.canSend === true && checkRivalAMes7.canPerform === true, '3.5 En Mes 7 (6 meses transcurridos), tiradera a Rival A vuelve a estar HABILITADA');
  }

  // ====================================================================
  // CASO 4: EVALUACIÓN LÍRICA DE TIRADERA (VICTORIA, TIRO POR LA CULATA, EMPATE)
  // ====================================================================
  console.log('\n🔹 CASO 4: Evaluación Lírica de Tiradera (Victoria Lírica, Tiro por la Culata, Cruce Parejo)');
  {
    // Subcaso 4A: Victoria Lírica Demoledora (Jugador con Alto Skill vs Rival Débil)
    console.log('  --- Subcaso 4A: Victoria Lírica (+40 Hype, +15 Respeto, +5 Credibilidad, -50 Afinidad, Feudo) ---');
    {
      const initialHype = 30;
      const initialCred = 80;
      const engine = new GameEngine(createPlayerArtist({
        personality: { skill: 95, originality: 90 }, // Score = 95*0.4 + 90*0.35 + 85*0.25 = 38 + 31.5 + 21.25 = 90.75
        stats: { artisticCredibility: initialCred, hype: initialHype, energy: 100 }
      }));

      const weakRival = createTargetArtist({
        id: 'artist_weak_rival',
        name: 'Novato Pretencioso QA',
        personality: { skill: 40, originality: 40 }, // Score = 40*0.4 + 40*0.35 + 30*0.25 = 16 + 14 + 7.5 = 37.5
        stats: { artisticCredibility: 30 }
      });
      engine.getWorld().artists[weakRival.id] = weakRival;

      const resultVic = RelationshipEngine.processDiss(engine.getPlayer(), weakRival, 2026, 1, engine.getWorld());

      assert(resultVic.success === true, '4.1 Tiradera procesada');
      assert(resultVic.outcomeType === 'lyrical_victory', `4.1 outcomeType es lyrical_victory (Lírica: ${resultVic.lyricalScorePlayer} vs ${resultVic.lyricalScoreTarget})`);
      assert(resultVic.hypeChange === 40, `4.1 Ganancia de Hype es +40 pts (Actual: ${resultVic.hypeChange})`);
      assert(resultVic.respectDelta === 15, `4.1 Ganancia de Respeto es +15 pts (Actual: ${resultVic.respectDelta})`);
      assert(resultVic.credibilityChange === 5, `4.1 Ganancia de Credibilidad es +5 pts (Actual: ${resultVic.credibilityChange})`);
      assert(resultVic.affinityDelta === -50, `4.1 Caída de Afinidad es -50 pts (Actual: ${resultVic.affinityDelta})`);
      assert(resultVic.newRelationType === 'feud', '4.1 newRelationType transiciona a "feud"');

      // Verificación de estado del jugador y relaciones
      const playerAfter = engine.getPlayer();
      assert(playerAfter.stats.hype === initialHype + 40, `4.1 Hype del jugador subió a ${initialHype + 40}`);
      assert(playerAfter.stats.artisticCredibility === initialCred + 5, `4.1 Credibilidad artística subió a ${initialCred + 5}`);
      assert(playerAfter.relationships[weakRival.id].relationType === 'feud', '4.1 Relación del jugador es "feud"');
      assert(playerAfter.relationships[weakRival.id].activeRivalry === true, '4.1 activeRivalry es true');
      assert(weakRival.relationships[playerAfter.id].relationType === 'feud', '4.1 Relación del rival es "feud"');

      // Verificación de Feudo Activo en world.activeBeefs
      const beef = engine.getWorld().activeBeefs[`beef_${weakRival.id}`];
      assert(beef !== undefined, '4.1 Feudo registrado en world.activeBeefs');
      assert(beef.stage === 'diss_tracks', `4.1 Etapa del feudo es "diss_tracks": "${beef.stage}"`);
      assert(beef.playerWon === true, '4.1 playerWon es true (victoria del jugador)');
      assert(beef.hypeMultiplier === 1.6, `4.1 Multiplicador de hype es 1.6`);

      // Verificación de Noticias de Primera Plana
      const dissNews = engine.getWorld().news[0];
      assert(dissNews !== undefined && dissNews.category === 'rivalry', '4.1 Noticia generada con categoría "rivalry"');
      assert(dissNews.importance === 5, '4.1 Noticia clasificada con máxima importancia (5/5)');
      assert(Boolean(dissNews.headline.includes('Guerra Lírica') || dissNews.headline.includes('destrona')), `4.1 Titular épico generado: "${dissNews.headline}"`);
    }

    // Subcaso 4B: Tiro por la Culata (Jugador con Bajo Skill vs Leyenda / Lírico Experto)
    console.log('\n  --- Subcaso 4B: Tiro por la Culata (-15 Reputación, -10 Credibilidad, +15 Hype meme, Rival) ---');
    {
      const initialRep = 60;
      const initialCred = 50;
      const initialHype = 20;

      const engine = new GameEngine(createPlayerArtist({
        personality: { skill: 25, originality: 25 }, // Score = 25*0.4 + 25*0.35 + 30*0.25 = 10 + 8.75 + 7.5 = 26.25
        stats: { artisticCredibility: 30, reputation: initialRep, hype: initialHype, energy: 100 }
      }));

      const lyricalBeast = createTargetArtist({
        id: 'artist_lyrical_beast',
        name: 'Aczino Master QA',
        personality: { skill: 95, originality: 90 }, // Score = 95*0.4 + 90*0.35 + 85*0.25 = 90.75
        stats: { artisticCredibility: 85 }
      });
      engine.getWorld().artists[lyricalBeast.id] = lyricalBeast;

      const resultBackfire = RelationshipEngine.processDiss(engine.getPlayer(), lyricalBeast, 2026, 1, engine.getWorld());

      assert(resultBackfire.success === true, '4.2 Tiradera fallida procesada');
      assert(resultBackfire.outcomeType === 'backfire', `4.2 outcomeType es backfire (Lírica: ${resultBackfire.lyricalScorePlayer} vs ${resultBackfire.lyricalScoreTarget})`);
      assert(resultBackfire.reputationChange === -15, `4.2 Penalización de Reputación: -15 pts (Actual: ${resultBackfire.reputationChange})`);
      assert(resultBackfire.credibilityChange === -10, `4.2 Penalización de Credibilidad: -10 pts (Actual: ${resultBackfire.credibilityChange})`);
      assert(resultBackfire.hypeChange === 15, `4.2 Hype generado por memes/burlas: +15 pts`);
      assert(resultBackfire.affinityDelta === -40, `4.2 Afinidad penalizada en -40 pts`);
      assert(resultBackfire.newRelationType === 'rival', '4.2 newRelationType es "rival"');

      const playerAfterBackfire = engine.getPlayer();
      assert(playerAfterBackfire.stats.reputation === initialRep - 15, `4.2 Reputación reducida a ${initialRep - 15} (Esperado ${initialRep - 15})`);
      assert(playerAfterBackfire.stats.artisticCredibility === 30 - 10, `4.2 Credibilidad artística reducida a 20 (Esperado 20)`);
      assert(playerAfterBackfire.relationships[lyricalBeast.id].activeRivalry === true, '4.2 activeRivalry es true tras el fracaso');

      const beefBackfire = engine.getWorld().activeBeefs[`beef_${lyricalBeast.id}`];
      assert(beefBackfire !== undefined && beefBackfire.playerWon === false, '4.2 playerWon registrado como false en el feudo');
    }

    // Subcaso 4C: Cruce Callejero / Empate Parejo
    console.log('\n  --- Subcaso 4C: Cruce Callejero / Empate (+28 Hype, +5 Respeto, -35 Afinidad) ---');
    {
      const engine = new GameEngine(createPlayerArtist({
        personality: { skill: 75, originality: 75 },
        stats: { artisticCredibility: 70, hype: 30, energy: 100 }
      }));

      const evenRival = createTargetArtist({
        id: 'artist_even_rival',
        name: 'Trueno Gemelo QA',
        personality: { skill: 75, originality: 75 },
        stats: { artisticCredibility: 70 }
      });
      engine.getWorld().artists[evenRival.id] = evenRival;

      const resultTie = RelationshipEngine.processDiss(engine.getPlayer(), evenRival, 2026, 1, engine.getWorld());

      assert(resultTie.success === true, '4.3 Cruce parejo procesado');
      assert(resultTie.outcomeType === 'street_tie', `4.3 outcomeType es street_tie (Lírica: ${resultTie.lyricalScorePlayer} vs ${resultTie.lyricalScoreTarget})`);
      assert(resultTie.hypeChange === 28, `4.3 Ganancia de Hype equilibrada: +28 pts`);
      assert(resultTie.respectDelta === 5, `4.3 Respeto ganado por paridad de barras: +5 pts`);
      assert(resultTie.affinityDelta === -35, `4.3 Afinidad reducida: -35 pts`);
      assert(resultTie.newRelationType === 'rival', '4.3 newRelationType es "rival"');
    }
  }

  // ====================================================================
  // CASO 5: EVOLUCIÓN Y ESTADOS DE RELACIÓN (TRANSICIONES & ACTIVE RIVALRY)
  // ====================================================================
  console.log('\n🔹 CASO 5: Evolución Orgánica de Estados de Relación & Modal Narrativo');
  {
    const engine = new GameEngine(createPlayerArtist());
    const target = createTargetArtist({ id: 'artist_evo_target', name: 'Wos Hermano QA' });
    engine.getWorld().artists[target.id] = target;

    // 5.1 Estado Inicial Neutral
    const relInitial = RelationshipEngine.getOrCreateRelationship(engine.getPlayer(), target.id);
    assert(relInitial.relationType === 'neutral', '5.1 Estado inicial es neutral');
    assert(relInitial.activeRivalry === false, '5.1 activeRivalry es false inicialmente');

    // 5.2 Transición a 'respect' (Afinidad >= 20 y Respeto >= 60)
    RelationshipEngine.modifyRelationship(engine.getPlayer(), target, 25, 65, undefined, 'Reconocimiento mutuo en festival');
    const shoutoutForRespect = RelationshipEngine.processShoutout(engine.getPlayer(), target, 2026, 1, engine.getWorld());
    assert(shoutoutForRespect.newRelationType === 'respect', `5.2 Transición a "respect" cumplida (Afinidad: ${engine.getPlayer().relationships[target.id].affinity}, Respeto: ${engine.getPlayer().relationships[target.id].respect})`);
    assert(engine.getPlayer().relationships[target.id].relationType === 'respect', '5.2 relationType en jugador es "respect"');
    assert(target.relationships[engine.getPlayer().id].relationType === 'respect', '5.2 relationType en objetivo es "respect"');
    assert(engine.getPlayer().relationships[target.id].activeRivalry === false, '5.2 activeRivalry es false en estado respect');

    // 5.3 Transición a 'friend' (Afinidad >= 50 y Respeto >= 50)
    RelationshipEngine.modifyRelationship(engine.getPlayer(), target, 30, 0, undefined, 'Noches de estudio compartidas');
    const shoutoutForFriend = RelationshipEngine.processShoutout(engine.getPlayer(), target, 2026, 4, engine.getWorld());
    assert(shoutoutForFriend.newRelationType === 'friend', `5.3 Transición a "friend" cumplida (Afinidad: ${engine.getPlayer().relationships[target.id].affinity})`);
    assert(engine.getPlayer().relationships[target.id].relationType === 'friend', '5.3 relationType en jugador es "friend"');
    assert(target.relationships[engine.getPlayer().id].relationType === 'friend', '5.3 relationType en objetivo es "friend"');

    // 5.4 Transición de 'friend' a 'rival' / 'feud' mediante Diss Track
    const enemyTarget = createTargetArtist({ id: 'artist_enemy_transition', name: 'Khea Rival QA' });
    engine.getWorld().artists[enemyTarget.id] = enemyTarget;

    const dissAction = RelationshipEngine.processDiss(engine.getPlayer(), enemyTarget, 2026, 1, engine.getWorld());
    assert(dissAction.newRelationType === 'feud' || dissAction.newRelationType === 'rival', `5.4 Transición a rival/feudo: ${dissAction.newRelationType}`);
    assert(engine.getPlayer().relationships[enemyTarget.id].activeRivalry === true, '5.4 activeRivalry activada en true');
    assert(enemyTarget.relationships[engine.getPlayer().id].activeRivalry === true, '5.4 activeRivalry activada en el objetivo');

    // 5.5 Verificación de formato InteractionResult para Modal Narrativo
    const interactionShoutout = RelationshipEngine.executeShoutout(engine.getPlayer(), target, 2026, 7, engine.getWorld());
    assert(interactionShoutout.title !== undefined && interactionShoutout.title.length > 0, `5.5 interactionShoutout.title definido: "${interactionShoutout.title}"`);
    assert(interactionShoutout.badge.variant === 'purple' || interactionShoutout.badge.variant === 'success', `5.5 Badge variant para elogio: "${interactionShoutout.badge.variant}"`);
    assert(interactionShoutout.statDeltas.affinity !== undefined, '5.5 statDeltas.affinity presente');
    assert(interactionShoutout.actionType === 'shoutout', '5.5 actionType es shoutout');
  }

  // ====================================================================
  // CASO 6: BLOQUEO DE COLABORACIONES EN FEUDO / RIVALIDAD
  // ====================================================================
  console.log('\n🔹 CASO 6: Bloqueo Automático de Colaboraciones en Feudo & Rivalidad Activa');
  {
    const initialFunds = 60000;
    const initialEnergy = 100;
    const engine = new GameEngine(createPlayerArtist({
      stats: { funds: initialFunds, energy: initialEnergy, popularity: 50 }
    }));

    const rivalArtist = createTargetArtist({
      id: 'artist_rival_blocked_collab',
      name: 'Enemigo Jurado QA',
      stats: { popularity: 55 }
    });
    engine.getWorld().artists[rivalArtist.id] = rivalArtist;

    // Subcaso 6A: Bloqueo por relationType === 'feud'
    console.log('  --- Subcaso 6A: Bloqueo por relationType === "feud" ---');
    RelationshipEngine.modifyRelationship(
      engine.getPlayer(),
      rivalArtist,
      -60,
      30,
      'feud',
      'Conflicto público abierto'
    );
    engine.getPlayer().relationships[rivalArtist.id].activeRivalry = true;

    const songsCountBefore = Object.keys(engine.getWorld().songs).length;
    const albumsCountBefore = Object.keys(engine.getWorld().albums).length;
    const ledgerCountBefore = engine.getPlayer().financialLedger?.length || 0;

    const feasFeud = RelationshipEngine.calculateCollabFeasibility(engine.getPlayer(), rivalArtist);
    assert(feasFeud.willAccept === false, '6.1 Feasibility retorna willAccept === false para artista en feudo');
    assert(feasFeud.acceptanceProbability === 0, '6.1 Probabilidad de aceptación es 0%');
    assert(Boolean(feasFeud.reason && (feasFeud.reason.includes('conflicto') || feasFeud.reason.includes('rivalidad'))), `6.1 Motivo realista de rechazo: "${feasFeud.reason}"`);

    const collabResultFeud = engine.proposeAndExecuteCollab({
      targetArtistId: rivalArtist.id,
      type: 'single_feat',
      title: 'Paz Imposible Feat',
      creditOrder: 'player_feat_target',
      genreId: 'trap_latino',
      subGenreIds: [],
      budgetProduction: 5000,
      budgetMarketing: 5000
    });

    assert(collabResultFeud.success === false, '6.1 proposeAndExecuteCollab rechaza la propuesta');
    assert(Boolean(collabResultFeud.reason && (collabResultFeud.reason.includes('conflicto') || collabResultFeud.reason.includes('rivalidad'))), `6.1 Razón de rechazo devuelta: "${collabResultFeud.reason}"`);
    assert(engine.getPlayer().stats.funds === initialFunds, `6.1 Fondos del jugador intactos ($${initialFunds})`);
    assert(engine.getPlayer().stats.energy === initialEnergy, `6.1 Energía del jugador intacta (${initialEnergy}%)`);
    assert(Object.keys(engine.getWorld().songs).length === songsCountBefore, '6.1 No se creó ninguna canción en world.songs');
    assert(Object.keys(engine.getWorld().albums).length === albumsCountBefore, '6.1 No se creó ningún álbum en world.albums');
    assert((engine.getPlayer().financialLedger?.length || 0) === ledgerCountBefore, '6.1 No se registraron transacciones en el ledger');

    // Subcaso 6B: Bloqueo por activeRivalry === true (incluso con afinidad neutra)
    console.log('\n  --- Subcaso 6B: Bloqueo por activeRivalry === true ---');
    const rivalActiveOnly = createTargetArtist({
      id: 'artist_rival_active_only',
      name: 'Rival Activo QA',
      stats: { popularity: 50 }
    });
    engine.getWorld().artists[rivalActiveOnly.id] = rivalActiveOnly;

    RelationshipEngine.modifyRelationship(engine.getPlayer(), rivalActiveOnly, 0, 50, 'neutral', 'Rivalidad deportiva');
    engine.getPlayer().relationships[rivalActiveOnly.id].activeRivalry = true; // Activa flag de rivalidad

    const feasActiveRivalry = RelationshipEngine.calculateCollabFeasibility(engine.getPlayer(), rivalActiveOnly);
    assert(feasActiveRivalry.willAccept === false, '6.2 Feasibility rechaza propuesta cuando activeRivalry === true');
    assert(feasActiveRivalry.acceptanceProbability === 0, '6.2 Probabilidad es 0%');

    const collabResultActive = engine.proposeAndExecuteCollab({
      targetArtistId: rivalActiveOnly.id,
      type: 'collab_album',
      title: 'Álbum con Rival Activo',
      creditOrder: 'player_and_target',
      genreId: 'trap_latino',
      subGenreIds: [],
      newTrackTitles: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      budgetProduction: 20000,
      budgetMarketing: 10000
    });

    assert(collabResultActive.success === false, '6.2 Álbum colaborativo con rival activo es rechazado');
    assert(engine.getPlayer().stats.funds === initialFunds, '6.2 Fondos protegidos ante intento de álbum colaborativo');
    assert(engine.getPlayer().stats.energy === initialEnergy, '6.2 Energía protegida ante intento de álbum colaborativo');
    assert(Object.keys(engine.getWorld().albums).length === albumsCountBefore, '6.2 Cero álbumes creados');

    // Subcaso 6C: Wrapper releaseCollaboration arroja error ante intento con rival
    let wrapperThrew = false;
    try {
      engine.releaseCollaboration({
        collaboratorId: rivalArtist.id,
        format: 'single_feat',
        title: 'Error Wrapper Collab',
        creditFormat: 'player_feat_target',
        genreId: 'trap_latino',
        subGenreIds: [],
        budgetProduction: 2000,
        budgetMarketing: 1000,
        longevityCurve: 'steady'
      });
    } catch (e: any) {
      wrapperThrew = true;
      assert(Boolean(e.message && (e.message.includes('conflicto') || e.message.includes('rivalidad'))), `6.3 releaseCollaboration arroja excepción con motivo de rivalidad: "${e.message}"`);
    }
    assert(wrapperThrew === true, '6.3 engine.releaseCollaboration arroja error ante artista rival');
  }

  // ====================================================================
  // CASO 7: VALIDACIÓN DEFENSIVA DE PARÁMETROS INVÁLIDOS & LÍMITES
  // ====================================================================
  console.log('\n🔹 CASO 7: Validación Defensiva de Parámetros Inválidos & Límites');
  {
    const engine = new GameEngine(createPlayerArtist({
      stats: { energy: 10, funds: 10000 } // Energía baja (<15%)
    }));

    const validTarget = createTargetArtist({ id: 'artist_valid_c7' });
    const retiredTarget = createTargetArtist({ id: 'artist_retired_c7', isRetired: true });
    engine.getWorld().artists[validTarget.id] = validTarget;
    engine.getWorld().artists[retiredTarget.id] = retiredTarget;

    // 7.1 Auto-elogio y auto-tiradera bloqueados
    const selfShoutout = RelationshipEngine.canSendShoutout(engine.getPlayer(), engine.getPlayer(), 2026, 1);
    assert(selfShoutout.canSend === false, '7.1 Auto-elogio bloqueado');
    assert(Boolean(selfShoutout.reason && selfShoutout.reason.includes('a ti mismo')), `7.1 Razón auto-elogio: "${selfShoutout.reason}"`);

    const selfDiss = RelationshipEngine.canSendDiss(engine.getPlayer(), engine.getPlayer(), 2026, 1);
    assert(selfDiss.canSend === false, '7.1 Auto-tiradera bloqueada');
    assert(Boolean(selfDiss.reason && selfDiss.reason.includes('a ti mismo')), `7.1 Razón auto-tiradera: "${selfDiss.reason}"`);

    // 7.2 Interacción con artista retirado bloqueada
    const retiredShoutout = RelationshipEngine.canSendShoutout(engine.getPlayer(), retiredTarget, 2026, 1);
    assert(retiredShoutout.canSend === false, '7.2 Elogio a artista retirado bloqueado');
    assert(Boolean(retiredShoutout.reason && retiredShoutout.reason.includes('retirado')), `7.2 Razón artista retirado: "${retiredShoutout.reason}"`);

    const retiredDiss = RelationshipEngine.canSendDiss(engine.getPlayer(), retiredTarget, 2026, 1);
    assert(retiredDiss.canSend === false, '7.2 Tiradera a artista retirado bloqueada');

    // 7.3 Interacción con artista inexistente vía GameEngine
    let nonExistentThrew = false;
    try {
      engine.interactWithArtist('artist_fantasma_999', 'shoutout');
    } catch (e: any) {
      nonExistentThrew = true;
      assert(Boolean(e.message && e.message.includes('no existe')), `7.3 Error capturado con artista inexistente: "${e.message}"`);
    }
    assert(nonExistentThrew === true, '7.3 interactWithArtist arroja error con artista inexistente');

    // 7.4 Límites numéricos: Afinidad (-100 a +100) y Respeto (0 a 100)
    RelationshipEngine.modifyRelationship(engine.getPlayer(), validTarget, 999, 999);
    const relClampedHigh = engine.getPlayer().relationships[validTarget.id];
    assert(relClampedHigh.affinity === 100, `7.4 Afinidad clampeada a max 100: ${relClampedHigh.affinity}`);
    assert(relClampedHigh.respect === 100, `7.4 Respeto clampeado a max 100: ${relClampedHigh.respect}`);

    RelationshipEngine.modifyRelationship(engine.getPlayer(), validTarget, -999, -999);
    const relClampedLow = engine.getPlayer().relationships[validTarget.id];
    assert(relClampedLow.affinity === -100, `7.4 Afinidad clampeada a min -100: ${relClampedLow.affinity}`);
    assert(relClampedLow.respect === 0, `7.4 Respeto clampeado a min 0: ${relClampedLow.respect}`);
  }

  console.log('\n========================================================================');
  console.log('📊 RESUMEN DE AUDITORÍA QA DE ACCIONES SOCIALES, COOLDOWNS & BEEFS:');
  console.log(`   Total de comprobaciones ejecutadas: ${stats.total}`);
  console.log(`   \x1b[32mSuperadas con éxito: ${stats.passed}\x1b[0m`);
  console.log(`   \x1b[31mFallidas: ${stats.failed}\x1b[0m`);
  if (stats.failed === 0) {
    console.log(`\n🎉 \x1b[32m100% DE ÉXITO: Todos los casos de acciones sociales, cooldowns y rivalidades validados con precisión militar.\x1b[0m`);
  } else {
    console.log(`\n❌ \x1b[31mSe detectaron ${stats.failed} fallos en la suite de pruebas.\x1b[0m`);
  }
  console.log('========================================================================\n');

  return stats.failed === 0;
}

const success = runSocialActionsTests();
if (!success) {
  process.exit(1);
}
