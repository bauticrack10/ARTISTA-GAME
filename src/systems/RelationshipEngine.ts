import {
  Artist,
  ArtistRelationship,
  EcosystemNPC,
  BeefState,
  WorldState,
  SocialPost,
  NewsItem,
  CollabProjectType,
  CreditOrderType,
  CollabFeasibilityResult,
  SocialActionResult,
  ActionCooldownResult,
  InteractionResult,
  CareerStage,
  CollabPact
} from '../types';
import { SocialFeedEngine } from './SocialFeedEngine';

export const CAREER_STAGE_TIERS: Record<CareerStage, number> = {
  Underground: 0,
  Emerging: 1,
  Breakout: 2,
  Established: 3,
  Mainstream: 4,
  Superstar: 5,
  Legend: 6,
  Veteran: 4,
  Comeback: 3,
  Declining: 2,
  Retired: 0
};

export class RelationshipEngine {
  public static readonly SHOUTOUT_COOLDOWN_MONTHS = 3;
  public static readonly DISS_COOLDOWN_MONTHS = 6;
  public static readonly GLOBAL_DISS_COOLDOWN_MONTHS = 4;

  /**
   * Inicializa los personajes recurrentes del ecosistema si aún no existen
   */
  static getInitialEcosystemContacts(): Record<string, EcosystemNPC> {
    return {
      npc_beatmaker_barrio: {
        id: 'npc_beatmaker_barrio',
        name: 'Nico Albarracín',
        nickname: 'Nico "808"',
        type: 'beatmaker_barrio',
        roleTitle: 'El Amigo Beatmaker del Barrio',
        avatarGradient: 'from-amber-600 to-stone-800',
        bio: 'Tu amigo de la infancia del barrio. Te prestaba la PC en el monoblock y te armaba las primeras maquetas en FL Studio. Leal a muerte pero sensible a que lo dejen de lado por productores famosos.',
        affinity: 60,
        respect: 75,
        tensionLevel: 0,
        loyalty: 90,
        isEncountered: true,
        history: ['Grabaron sus primeras canciones juntos en el home studio del barrio.']
      },
      npc_manager_chanta: {
        id: 'npc_manager_chanta',
        name: 'Tony Rossi',
        nickname: 'El "Gordo" Tony',
        type: 'manager_chanta',
        roleTitle: 'El Manager Chanta / Ventajero',
        avatarGradient: 'from-yellow-600 via-stone-800 to-zinc-950',
        bio: 'Empresario de la vieja escuela de la noche y boliches. Promete shows con llenos totales y contactos turbios con marcas, pero sus contratos tienen letra chica leonina y adelantos en efectivo de dudosa procedencia.',
        affinity: 10,
        respect: 35,
        tensionLevel: 25,
        loyalty: 20,
        isEncountered: false,
        history: ['Conocido en el circuito nocturno por negociar fechas y adelantos en mano.']
      },
      npc_critico_hater: {
        id: 'npc_critico_hater',
        name: 'Claudio Varela',
        nickname: 'El "Aguafiestas"',
        type: 'critico_hater',
        roleTitle: 'El Crítico Hater / Podcaster Resentido',
        avatarGradient: 'from-zinc-800 to-slate-950',
        bio: 'Periodista snob con un podcast de culto y canal de YouTube. Detesta todo lo que se vuelve masivo en TikTok y disfruta despedazar la música urbana a menos que se le demuestre una técnica lírica irreprochable.',
        affinity: -20,
        respect: 50,
        tensionLevel: 40,
        loyalty: 0,
        isEncountered: true,
        history: ['Publicó críticas mordaces comparando la escena actual con décadas pasadas.']
      },
      npc_rival_escena: {
        id: 'npc_rival_escena',
        name: 'Dante Zero',
        nickname: 'Young Dante',
        type: 'rival_escena',
        roleTitle: 'El Rival Directo de la Escena',
        avatarGradient: 'from-rose-700 via-red-900 to-black',
        bio: 'Trapper arrogante y talentoso de tu misma generación. Compite directamente por los mismos charts, festivales y oyentes. Obsesionado con demostrar que tiene mejores números y no duda en tirar indirectas en redes.',
        affinity: -35,
        respect: 65,
        tensionLevel: 55,
        loyalty: 0,
        isEncountered: true,
        history: ['Rivalidad generacional nacida en las primeras fechas del circuito underground.']
      }
    };
  }

  static getOrCreateRelationship(artist: Artist, targetArtistId: string): ArtistRelationship {
    if (!artist.relationships[targetArtistId]) {
      artist.relationships[targetArtistId] = {
        targetArtistId,
        relationType: 'neutral',
        affinity: 0,
        respect: 50,
        pastCollabsCount: 0,
        history: [],
        shoutoutCount: 0,
        dissCount: 0,
        activeRivalry: false,
        recentInteractionsCount: 0
      };
    }
    return artist.relationships[targetArtistId];
  }

  /**
   * Valida si el jugador puede enviar un elogio (shoutout) al artista objetivo
   */
  static canSendShoutout(
    player: Artist,
    target: Artist,
    currentYear: number,
    currentMonth: number
  ): {
    canPerform: boolean;
    canSend: boolean;
    cooldownRemainingMonths: number;
    nextAvailableDate: string;
    availableYear: number;
    availableMonth: number;
    reason?: string;
    probableConsequence: string;
  } {
    if (!target || player.id === target.id) {
      return {
        canPerform: false,
        canSend: false,
        cooldownRemainingMonths: 0,
        availableYear: currentYear,
        availableMonth: currentMonth,
        nextAvailableDate: `Año ${currentYear} • Mes ${currentMonth}`,
        reason: 'No puedes enviarte un elogio a ti mismo.',
        probableConsequence: ''
      };
    }

    if (target.isRetired) {
      return {
        canPerform: false,
        canSend: false,
        cooldownRemainingMonths: 0,
        availableYear: currentYear,
        availableMonth: currentMonth,
        nextAvailableDate: `Año ${currentYear} • Mes ${currentMonth}`,
        reason: 'El artista está retirado de la escena musical.',
        probableConsequence: ''
      };
    }

    const rel = player.relationships[target.id];
    if (rel?.lastShoutoutYear !== undefined && rel?.lastShoutoutMonth !== undefined) {
      const monthsElapsed = (currentYear - rel.lastShoutoutYear) * 12 + (currentMonth - rel.lastShoutoutMonth);
      if (monthsElapsed < this.SHOUTOUT_COOLDOWN_MONTHS) {
        const cooldownRemainingMonths = this.SHOUTOUT_COOLDOWN_MONTHS - monthsElapsed;
        const totalTargetMonths = rel.lastShoutoutYear * 12 + (rel.lastShoutoutMonth - 1) + this.SHOUTOUT_COOLDOWN_MONTHS;
        const nextAvailYear = Math.floor(totalTargetMonths / 12);
        const nextAvailMonth = (totalTargetMonths % 12) + 1;
        const nextAvailableDate = `Año ${nextAvailYear} • Mes ${nextAvailMonth}`;
        return {
          canPerform: false,
          canSend: false,
          cooldownRemainingMonths,
          availableYear: nextAvailYear,
          availableMonth: nextAvailMonth,
          nextAvailableDate,
          reason: `Debes esperar ${cooldownRemainingMonths} mes(es) para volver a elogiar a ${target.name} (disponible en ${nextAvailableDate}).`,
          probableConsequence: `Disponible en ${nextAvailableDate}`
        };
      }
    }

    return {
      canPerform: true,
      canSend: true,
      cooldownRemainingMonths: 0,
      availableYear: currentYear,
      availableMonth: currentMonth,
      nextAvailableDate: `Año ${currentYear} • Mes ${currentMonth}`,
      probableConsequence: 'Elogio público • Consecuencia: +Afinidad, +Respeto y +Hype en la escena musical.'
    };
  }

  /**
   * Valida si el jugador puede lanzar una tiradera (diss) al artista objetivo
   */
  static canSendDiss(
    player: Artist,
    target: Artist,
    currentYear: number,
    currentMonth: number
  ): {
    canPerform: boolean;
    canSend: boolean;
    cooldownRemainingMonths: number;
    nextAvailableDate: string;
    availableYear: number;
    availableMonth: number;
    reason?: string;
    probableConsequence: string;
  } {
    if (!target || player.id === target.id) {
      return {
        canPerform: false,
        canSend: false,
        cooldownRemainingMonths: 0,
        availableYear: currentYear,
        availableMonth: currentMonth,
        nextAvailableDate: `Año ${currentYear} • Mes ${currentMonth}`,
        reason: 'No puedes lanzarte una tiradera a ti mismo.',
        probableConsequence: ''
      };
    }

    if (target.isRetired) {
      return {
        canPerform: false,
        canSend: false,
        cooldownRemainingMonths: 0,
        availableYear: currentYear,
        availableMonth: currentMonth,
        nextAvailableDate: `Año ${currentYear} • Mes ${currentMonth}`,
        reason: 'El artista está retirado de la escena musical.',
        probableConsequence: ''
      };
    }

    // 1. Cooldown global para el jugador (mínimo 4 meses entre cualquier diss en la escena)
    let latestDissTotalMonths = -1;
    let latestDissYear = 0;
    let latestDissMonth = 0;

    for (const rel of Object.values(player.relationships || {})) {
      if (rel.lastDissYear !== undefined && rel.lastDissMonth !== undefined) {
        const totalM = rel.lastDissYear * 12 + (rel.lastDissMonth - 1);
        if (totalM > latestDissTotalMonths) {
          latestDissTotalMonths = totalM;
          latestDissYear = rel.lastDissYear;
          latestDissMonth = rel.lastDissMonth;
        }
      }
    }

    if (latestDissTotalMonths >= 0) {
      const currentTotalMonths = currentYear * 12 + (currentMonth - 1);
      const monthsSinceGlobal = currentTotalMonths - latestDissTotalMonths;
      if (monthsSinceGlobal < this.GLOBAL_DISS_COOLDOWN_MONTHS) {
        const cooldownRemainingMonths = this.GLOBAL_DISS_COOLDOWN_MONTHS - monthsSinceGlobal;
        const totalAvailMonths = latestDissTotalMonths + this.GLOBAL_DISS_COOLDOWN_MONTHS;
        const nextAvailYear = Math.floor(totalAvailMonths / 12);
        const nextAvailMonth = (totalAvailMonths % 12) + 1;
        const nextAvailableDate = `Año ${nextAvailYear} • Mes ${nextAvailMonth}`;
        return {
          canPerform: false,
          canSend: false,
          cooldownRemainingMonths,
          availableYear: nextAvailYear,
          availableMonth: nextAvailMonth,
          nextAvailableDate,
          reason: `Cooldown global de tiraderas activo: debes esperar ${cooldownRemainingMonths} mes(es) para lanzar otro diss en la escena (disponible en ${nextAvailableDate}).`,
          probableConsequence: `Disponible en ${nextAvailableDate}`
        };
      }
    }

    // 2. Cooldown específico por artista objetivo (mínimo 6 meses)
    const rel = player.relationships[target.id];
    if (rel?.lastDissYear !== undefined && rel?.lastDissMonth !== undefined) {
      const monthsSinceTarget = (currentYear - rel.lastDissYear) * 12 + (currentMonth - rel.lastDissMonth);
      if (monthsSinceTarget < this.DISS_COOLDOWN_MONTHS) {
        const cooldownRemainingMonths = this.DISS_COOLDOWN_MONTHS - monthsSinceTarget;
        const totalAvailMonths = rel.lastDissYear * 12 + (rel.lastDissMonth - 1) + this.DISS_COOLDOWN_MONTHS;
        const nextAvailYear = Math.floor(totalAvailMonths / 12);
        const nextAvailMonth = (totalAvailMonths % 12) + 1;
        const nextAvailableDate = `Año ${nextAvailYear} • Mes ${nextAvailMonth}`;
        return {
          canPerform: false,
          canSend: false,
          cooldownRemainingMonths,
          availableYear: nextAvailYear,
          availableMonth: nextAvailMonth,
          nextAvailableDate,
          reason: `Ya le tiraste un diss a ${target.name} recientemente. Debes esperar ${cooldownRemainingMonths} mes(es) para volver a tirarle (disponible en ${nextAvailableDate}).`,
          probableConsequence: `Disponible en ${nextAvailableDate}`
        };
      }
    }

    return {
      canPerform: true,
      canSend: true,
      cooldownRemainingMonths: 0,
      availableYear: currentYear,
      availableMonth: currentMonth,
      nextAvailableDate: `Año ${currentYear} • Mes ${currentMonth}`,
      probableConsequence: 'Tiradera / Diss Track • Consecuencia: +Hype masivo, desata Feudo Activo con barras líricas.'
    };
  }

  /**
   * Procesa un elogio público (shoutout) con rendimientos decrecientes y evolución de relación
   */
  static processShoutout(
    player: Artist,
    target: Artist,
    currentYear: number,
    currentMonth: number,
    world: WorldState
  ): SocialActionResult {
    const check = this.canSendShoutout(player, target, currentYear, currentMonth);
    if (!check.canSend) {
      throw new Error(check.reason || 'No puedes enviar un elogio debido al cooldown.');
    }

    const relA = this.getOrCreateRelationship(player, target.id);
    const relB = this.getOrCreateRelationship(target, player.id);

    // Rendimientos decrecientes: 1er elogio (+12 af, +10 resp, +8 hype), 2do elogio (+6 af, +5 resp, +4 hype), 3er+ (+2 af, +1 resp, +1 hype)
    const currentCount = relA.shoutoutCount || 0;
    let affinityDelta = 2;
    let respectDelta = 1;
    let hypeGain = 1;

    if (currentCount === 0) {
      affinityDelta = 12;
      respectDelta = 10;
      hypeGain = 8;
    } else if (currentCount === 1) {
      affinityDelta = 6;
      respectDelta = 5;
      hypeGain = 4;
    } else {
      affinityDelta = 2;
      respectDelta = 1;
      hypeGain = 1;
    }

    // Si target es 'rival' o 'feud': mofa en redes por adulación (-4 credibilidad, -5 disciplina)
    const isTargetHostile = relA.relationType === 'rival' || relA.relationType === 'feud';
    let credibilityChange = 0;
    let disciplineChange = 0;

    if (isTargetHostile) {
      credibilityChange = -4;
      disciplineChange = -5;
      player.stats.artisticCredibility = Math.max(0, player.stats.artisticCredibility - 4);
      player.personality.discipline = Math.max(0, player.personality.discipline - 5);
    }

    // Modificar afinidad, respeto y hype
    relA.affinity = Math.max(-100, Math.min(100, relA.affinity + affinityDelta));
    relA.respect = Math.max(0, Math.min(100, relA.respect + respectDelta));
    relB.affinity = Math.max(-100, Math.min(100, relB.affinity + affinityDelta));
    relB.respect = Math.max(0, Math.min(100, relB.respect + respectDelta));
    player.stats.hype = Math.min(100, player.stats.hype + hypeGain);

    // Evolución de relación: si afinidad >= 20 y respeto >= 60 -> 'respect'; si afinidad >= 50 y respeto >= 50 -> 'friend'
    let newRelType: ArtistRelationship['relationType'] = relA.relationType;
    if (relA.affinity >= 50 && relA.respect >= 50) {
      newRelType = 'friend';
      relA.activeRivalry = false;
      relB.activeRivalry = false;
    } else if (relA.affinity >= 20 && relA.respect >= 60) {
      newRelType = 'respect';
      relA.activeRivalry = false;
      relB.activeRivalry = false;
    }
    relA.relationType = newRelType;
    relB.relationType = newRelType;

    // Actualizar timestamps y contadores de interacción
    const nextCount = currentCount + 1;
    relA.lastShoutoutYear = currentYear;
    relA.lastShoutoutMonth = currentMonth;
    relA.shoutoutCount = nextCount;
    relA.recentInteractionsCount = (relA.recentInteractionsCount || 0) + 1;

    relB.lastShoutoutYear = currentYear;
    relB.lastShoutoutMonth = currentMonth;
    relB.shoutoutCount = nextCount;
    relB.recentInteractionsCount = (relB.recentInteractionsCount || 0) + 1;

    const historyNote = isTargetHostile
      ? `Elogio público inesperado a su rival ${target.name} (Elogio #${nextCount}) en Año ${currentYear} - Mes ${currentMonth}. Desató burlas por adulación (-4 Credibilidad, -5 Disciplina).`
      : `Elogio público y reconocimiento a ${target.name} (Elogio #${nextCount}) en Año ${currentYear} - Mes ${currentMonth}. Afinidad +${affinityDelta}, Respeto +${respectDelta}, Hype +${hypeGain}.`;

    relA.history.push(historyNote);
    relB.history.push(historyNote);

    // Generar noticia en world.news
    const headline = isTargetHostile
      ? `Polémica en la escena: ${player.name} elogia públicamente a su rival ${target.name}`
      : `Respeto y camaradería: ${player.name} elogia públicamente a ${target.name}`;

    const body = isTargetHostile
      ? `En un giro inesperado que generó desconcierto y burlas en redes, ${player.name} dedicó halagos a su rival ${target.name}. La escena urbana debate si se trata de adulación o pérdida de postura (-4 Credibilidad, -5 Disciplina).`
      : `${player.name} destacó la calidad artística y el impacto de ${target.name} en declaraciones públicas. El gesto fortalece los lazos en la industria (+${affinityDelta} Afinidad, +${respectDelta} Respeto, +${hypeGain} Hype).`;

    const newsItem: NewsItem = {
      id: `news_shoutout_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      headline,
      body,
      year: currentYear,
      month: currentMonth,
      category: isTargetHostile ? 'scandal' : 'culture',
      relatedArtistIds: [player.id, target.id],
      sentiment: isTargetHostile ? 'shocking' : 'positive',
      importance: isTargetHostile ? 3 : 2
    };
    if (!world.news) world.news = [];
    world.news.unshift(newsItem);

    // Generar reacciones en redes sociales
    const socialPosts = SocialFeedEngine.generateShoutoutPosts(world, player, target, isTargetHostile, nextCount);
    if (!world.socialFeed) world.socialFeed = [];
    world.socialFeed.unshift(...socialPosts);

    const outcomeDescription = isTargetHostile
      ? `Elogiaste a ${target.name}. Al ser tu rival/enemigo, la escena se mofó en redes por adulación (-4 Credibilidad, -5 Disciplina, +${affinityDelta} Afinidad, +${respectDelta} Respeto).`
      : `Elogiaste públicamente a ${target.name} (Elogio #${nextCount}: +${affinityDelta} Afinidad, +${respectDelta} Respeto, +${hypeGain} Hype).`;

    return {
      success: true,
      actionType: 'shoutout',
      targetArtistId: target.id,
      targetArtistName: target.name,
      outcomeType: isTargetHostile ? 'shoutout_mocked' : 'shoutout_success',
      outcomeDescription,
      statChanges: {
        hype: player.stats.hype,
        artisticCredibility: player.stats.artisticCredibility
      },
      personalityChanges: {
        discipline: player.personality.discipline
      },
      hypeChange: hypeGain,
      credibilityChange,
      disciplineChange,
      affinityDelta,
      respectDelta,
      newRelationType: newRelType,
      newsItem,
      socialPosts
    };
  }

  /**
   * Procesa el lanzamiento de una tiradera (diss track) con evaluación lírica y consecuencias estratégicas
   */
  static processDiss(
    player: Artist,
    target: Artist,
    currentYear: number,
    currentMonth: number,
    world: WorldState
  ): SocialActionResult {
    const check = this.canSendDiss(player, target, currentYear, currentMonth);
    if (!check.canSend) {
      throw new Error(check.reason || 'No puedes lanzar una tiradera debido al cooldown.');
    }

    // Consumo de energía
    player.stats.energy = Math.max(5, player.stats.energy - 15);

    // Evaluación lírica del jugador vs target (skill * 0.4 + originality * 0.35 + credibility * 0.25 vs target)
    const lyricalScorePlayer = Number((player.personality.skill * 0.40 + player.personality.originality * 0.35 + player.stats.artisticCredibility * 0.25).toFixed(1));
    const lyricalScoreTarget = Number((target.personality.skill * 0.40 + target.personality.originality * 0.35 + target.stats.artisticCredibility * 0.25).toFixed(1));
    const diff = lyricalScorePlayer - lyricalScoreTarget;

    let outcomeType: 'lyrical_victory' | 'street_tie' | 'backfire' = 'street_tie';
    let hypeChange = 28;
    let respectDelta = 5;
    let credibilityChange = 0;
    let reputationChange = 0;
    let affinityDelta = -35;
    let newRelationType: ArtistRelationship['relationType'] = 'rival';
    let outcomeDescription = '';

    if (diff >= 4) {
      // Victoria Lírica (+40 Hype, +15 Respeto, +5 Credibilidad, -50 Afinidad, nuevo estado 'feud' o 'rival')
      outcomeType = 'lyrical_victory';
      hypeChange = 40;
      respectDelta = 15;
      credibilityChange = 5;
      affinityDelta = -50;
      newRelationType = 'feud';
      player.stats.hype = Math.min(100, player.stats.hype + 40);
      player.stats.artisticCredibility = Math.min(100, player.stats.artisticCredibility + 5);
      outcomeDescription = `¡Victoria Lírica demoledora! Tus barras y métricas superaron con creces a ${target.name} (${lyricalScorePlayer} vs ${lyricalScoreTarget}). La escena te corona ganador indiscutido (+40 Hype, +15 Respeto, +5 Credibilidad, -50 Afinidad).`;
    } else if (diff > -4) {
      // Cruce Callejero / Empate (+28 Hype, +5 Respeto, -35 Afinidad, nuevo estado 'rival')
      outcomeType = 'street_tie';
      hypeChange = 28;
      respectDelta = 5;
      affinityDelta = -35;
      newRelationType = 'rival';
      player.stats.hype = Math.min(100, player.stats.hype + 28);
      outcomeDescription = `Cruce Callejero parejo e intenso. Tu tiradera y la respuesta de ${target.name} chocaron con fuerzas similares (${lyricalScorePlayer} vs ${lyricalScoreTarget}), encendiendo el debate en la escena (+28 Hype, +5 Respeto, -35 Afinidad).`;
    } else {
      // Tiro por la Culata (-15 Reputación, -10 Credibilidad, +15 Hype meme, -40 Afinidad)
      outcomeType = 'backfire';
      hypeChange = 15;
      respectDelta = 0;
      reputationChange = -15;
      credibilityChange = -10;
      affinityDelta = -40;
      newRelationType = 'rival';
      player.stats.reputation = Math.max(0, player.stats.reputation - 15);
      player.stats.artisticCredibility = Math.max(0, player.stats.artisticCredibility - 10);
      player.stats.hype = Math.min(100, player.stats.hype + 15);
      outcomeDescription = `¡Tiro por la culata! Tu tiradera no alcanzó el nivel técnico y la credibilidad de ${target.name} (${lyricalScorePlayer} vs ${lyricalScoreTarget}). Las redes se llenaron de burlas y memes (-15 Reputación, -10 Credibilidad, +15 Hype meme, -40 Afinidad).`;
    }

    const relA = this.getOrCreateRelationship(player, target.id);
    const relB = this.getOrCreateRelationship(target, player.id);

    relA.affinity = Math.max(-100, Math.min(100, relA.affinity + affinityDelta));
    relA.respect = Math.max(0, Math.min(100, relA.respect + respectDelta));
    relA.relationType = newRelationType;
    relA.activeRivalry = true;

    relB.affinity = Math.max(-100, Math.min(100, relB.affinity + affinityDelta));
    relB.respect = Math.max(0, Math.min(100, relB.respect + respectDelta));
    relB.relationType = newRelationType;
    relB.activeRivalry = true;

    relA.lastDissYear = currentYear;
    relA.lastDissMonth = currentMonth;
    relA.dissCount = (relA.dissCount || 0) + 1;
    relA.recentInteractionsCount = (relA.recentInteractionsCount || 0) + 1;

    relB.lastDissYear = currentYear;
    relB.lastDissMonth = currentMonth;
    relB.dissCount = (relB.dissCount || 0) + 1;
    relB.recentInteractionsCount = (relB.recentInteractionsCount || 0) + 1;

    relA.history.push(`Lanzó tiradera contra ${target.name} [${outcomeType}] (Lírica: ${lyricalScorePlayer} vs ${lyricalScoreTarget}) en Año ${currentYear} - Mes ${currentMonth}.`);
    relB.history.push(`Recibió tiradera de ${player.name} [${outcomeType}] (Lírica: ${lyricalScorePlayer} vs ${lyricalScoreTarget}) en Año ${currentYear} - Mes ${currentMonth}.`);

    // Iniciar o recrudecer feudo en world.activeBeefs
    if (!world.activeBeefs) world.activeBeefs = {};
    const beefId = `beef_${target.id}`;
    const existingBeef = world.activeBeefs[beefId];

    let nextStage: BeefState['stage'] = 'diss_tracks';
    if (existingBeef) {
      if (existingBeef.stage === 'tension' || existingBeef.stage === 'social_beef') {
        nextStage = 'diss_tracks';
      } else if (existingBeef.stage === 'diss_tracks') {
        nextStage = 'all_out_war';
      } else {
        nextStage = existingBeef.stage;
      }
    }

    const dissTrackTitle = `Tiradera de ${player.name} vs ${target.name} (${currentYear})`;
    const dissTracksExchanged = existingBeef?.dissTracksExchanged ? [...existingBeef.dissTracksExchanged, dissTrackTitle] : [dissTrackTitle];

    const updatedBeef: BeefState = {
      id: beefId,
      targetId: target.id,
      targetName: target.name,
      stage: nextStage,
      hypeMultiplier: outcomeType === 'lyrical_victory' ? 1.6 : outcomeType === 'street_tie' ? 1.4 : 1.2,
      hypeGenerated: (existingBeef?.hypeGenerated || 0) + hypeChange,
      tensionLevel: Math.min(100, (existingBeef?.tensionLevel || 50) + 30),
      dissTracksExchanged,
      turnsActive: (existingBeef?.turnsActive || 0) + 1,
      lastActionDescription: outcomeDescription,
      playerWon: outcomeType === 'lyrical_victory' ? true : outcomeType === 'backfire' ? false : undefined
    };
    world.activeBeefs[beefId] = updatedBeef;

    // Generar breaking news en world.news
    const headline = outcomeType === 'lyrical_victory'
      ? `¡Guerra Lírica! ${player.name} destrona a ${target.name} con un diss track demoledor`
      : outcomeType === 'street_tie'
      ? `¡Choque de Titanes! ${player.name} y ${target.name} protagonizan un fuego cruzado de barras`
      : `¡Controversia & Memes! El diss track de ${player.name} contra ${target.name} se vuelve viral por las razones equivocadas`;

    const newsItem: NewsItem = {
      id: `news_diss_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      headline,
      body: outcomeDescription,
      year: currentYear,
      month: currentMonth,
      category: 'rivalry',
      relatedArtistIds: [player.id, target.id],
      sentiment: outcomeType === 'backfire' ? 'negative' : 'shocking',
      importance: 5
    };
    if (!world.news) world.news = [];
    world.news.unshift(newsItem);

    // Generar reacciones en redes sociales
    const socialPosts = SocialFeedEngine.generateDissLyricalPosts(world, player, target, outcomeType, lyricalScorePlayer, lyricalScoreTarget);
    if (!world.socialFeed) world.socialFeed = [];
    world.socialFeed.unshift(...socialPosts);

    return {
      success: true,
      actionType: 'diss',
      targetArtistId: target.id,
      targetArtistName: target.name,
      outcomeType,
      outcomeDescription,
      statChanges: {
        hype: player.stats.hype,
        artisticCredibility: player.stats.artisticCredibility,
        reputation: player.stats.reputation,
        energy: player.stats.energy
      },
      hypeChange,
      credibilityChange,
      reputationChange,
      energyChange: -15,
      affinityDelta,
      respectDelta,
      newRelationType,
      beefState: updatedBeef,
      newsItem,
      socialPosts,
      lyricalScorePlayer,
      lyricalScoreTarget
    };
  }

  /**
   * Transforma un SocialActionResult en un InteractionResult completo para el Modal Narrativo
   */
  static toInteractionResult(res: SocialActionResult): InteractionResult {
    let title = 'Interacción Completada';
    let badgeLabel = 'Escena Urbana';
    let badgeVariant: InteractionResult['badge']['variant'] = 'info';

    if (res.actionType === 'shoutout') {
      if (res.outcomeType === 'shoutout_mocked') {
        title = 'Tiro por la Culata';
        badgeLabel = 'Adulación Cuestionada';
        badgeVariant = 'warning';
      } else if ((res.affinityDelta || 0) >= 10) {
        title = '¡Elogio Aceptado & Viral!';
        badgeLabel = 'Conexión en la Escena';
        badgeVariant = 'purple';
      } else {
        title = 'Gesto de Respeto Agradecido';
        badgeLabel = 'Respeto Mutuo';
        badgeVariant = 'success';
      }
    } else if (res.actionType === 'diss') {
      if (res.outcomeType === 'lyrical_victory') {
        title = '¡Victoria Lírica!';
        badgeLabel = 'Dominio de Barras';
        badgeVariant = 'danger';
      } else if (res.outcomeType === 'backfire') {
        title = 'Tiro por la Culata';
        badgeLabel = 'Polémica Dividida';
        badgeVariant = 'warning';
      } else {
        title = '¡Guerra de Tiraderas Abierta!';
        badgeLabel = 'Feudo Activo';
        badgeVariant = 'danger';
      }
    }

    return {
      title,
      badge: {
        label: badgeLabel,
        variant: badgeVariant
      },
      narrativeText: res.outcomeDescription,
      pressHeadline: res.newsItem?.headline || `Repercusión en la escena: ${res.targetArtistName}`,
      pressBody: res.newsItem?.body || res.outcomeDescription,
      statDeltas: {
        hype: res.hypeChange,
        affinity: res.affinityDelta,
        respect: res.respectDelta,
        credibility: res.credibilityChange,
        discipline: res.disciplineChange,
        reputation: res.reputationChange,
        energy: res.energyChange
      },
      newRelationType: res.newRelationType,
      targetArtistName: res.targetArtistName,
      actionType: res.actionType === 'diss' ? 'diss' : 'shoutout'
    };
  }

  /**
   * Ejecuta un elogio y retorna el InteractionResult estructurado
   */
  static executeShoutout(
    player: Artist,
    target: Artist,
    currentYear: number,
    currentMonth: number,
    world: WorldState
  ): InteractionResult {
    const actionRes = this.processShoutout(player, target, currentYear, currentMonth, world);
    return this.toInteractionResult(actionRes);
  }

  /**
   * Ejecuta una tiradera y retorna el InteractionResult estructurado
   */
  static executeDiss(
    player: Artist,
    target: Artist,
    currentYear: number,
    currentMonth: number,
    world: WorldState
  ): InteractionResult {
    const actionRes = this.processDiss(player, target, currentYear, currentMonth, world);
    return this.toInteractionResult(actionRes);
  }

  static modifyRelationship(
    sourceArtist: Artist,
    targetArtist: Artist,
    affinityDelta: number,
    respectDelta: number,
    newRelationType?: ArtistRelationship['relationType'],
    historyNote?: string
  ): void {
    const relA = this.getOrCreateRelationship(sourceArtist, targetArtist.id);
    const relB = this.getOrCreateRelationship(targetArtist, sourceArtist.id);

    relA.affinity = Math.max(-100, Math.min(100, relA.affinity + affinityDelta));
    relA.respect = Math.max(0, Math.min(100, relA.respect + respectDelta));
    if (newRelationType) relA.relationType = newRelationType;
    if (historyNote) relA.history.push(historyNote);

    relB.affinity = Math.max(-100, Math.min(100, relB.affinity + affinityDelta));
    relB.respect = Math.max(0, Math.min(100, relB.respect + respectDelta));
    if (newRelationType) relB.relationType = newRelationType;
    if (historyNote) relB.history.push(historyNote);
  }

  /**
   * Modifica atributos del NPC del ecosistema
   */
  static modifyEcosystemNPC(
    world: WorldState,
    npcId: string,
    deltas: {
      affinity?: number;
      respect?: number;
      tension?: number;
      loyalty?: number;
      historyNote?: string;
    }
  ): EcosystemNPC | null {
    if (!world.ecosystemContacts) {
      world.ecosystemContacts = this.getInitialEcosystemContacts();
    }
    const npc = world.ecosystemContacts[npcId];
    if (!npc) return null;

    if (deltas.affinity !== undefined) npc.affinity = Math.max(-100, Math.min(100, npc.affinity + deltas.affinity));
    if (deltas.respect !== undefined) npc.respect = Math.max(0, Math.min(100, npc.respect + deltas.respect));
    if (deltas.tension !== undefined) npc.tensionLevel = Math.max(0, Math.min(100, npc.tensionLevel + deltas.tension));
    if (deltas.loyalty !== undefined) npc.loyalty = Math.max(0, Math.min(100, npc.loyalty + deltas.loyalty));
    if (deltas.historyNote) npc.history.push(deltas.historyNote);

    return npc;
  }

  /**
   * Procesa la respuesta del jugador ante una provocación o beef
   */
  static processBeefInteraction(
    player: Artist,
    targetName: string,
    targetId: string,
    action: 'respond_social' | 'drop_diss' | 'ignore',
    world: WorldState
  ): {
    outcomeText: string;
    hypeChange: number;
    disciplineChange: number;
    credibilityChange: number;
    energyChange: number;
    newBeefStage?: BeefState['stage'];
    socialPosts: SocialPost[];
  } {
    if (!world.activeBeefs) world.activeBeefs = {};

    let hypeChange = 0;
    let disciplineChange = 0;
    let credibilityChange = 0;
    let energyChange = 0;
    let outcomeText = '';
    let newBeefStage: BeefState['stage'] = 'tension';

    if (action === 'respond_social') {
      hypeChange = 22;
      disciplineChange = -3;
      credibilityChange = -1;
      newBeefStage = 'social_beef';
      outcomeText = `Respondiste públicamente a ${targetName} en redes con capturas y declaraciones afiladas. El hype se disparó (+22 Hype), pero la escena debate si caíste en una provocación barata.`;
    } else if (action === 'drop_diss') {
      hypeChange = 42;
      energyChange = -15;
      credibilityChange = 4;
      disciplineChange = 2;
      newBeefStage = 'diss_tracks';
      outcomeText = `Te encerraste en el estudio y grabaste una tiradera demoledora contra ${targetName}. El tema se convirtió en tendencia absoluta (#1 en redes) y desató una guerra abierta de barras (+42 Hype, -15 Energía).`;
    } else if (action === 'ignore') {
      hypeChange = -5;
      disciplineChange = 5;
      credibilityChange = 5;
      newBeefStage = 'settled';
      outcomeText = `Decidiste no darle entidad ni tribuna a ${targetName}. Mantuviste la disciplina (+5 Disciplina, +5 Credibilidad) y dejaste que las provocaciones murieran solas sin alimentarlas.`;
    }

    // Actualizar o crear Beef State
    const beefId = `beef_${targetId}`;
    world.activeBeefs[beefId] = {
      id: beefId,
      targetId,
      targetName,
      stage: newBeefStage,
      hypeMultiplier: action === 'drop_diss' ? 1.5 : action === 'respond_social' ? 1.2 : 1.0,
      turnsActive: (world.activeBeefs[beefId]?.turnsActive || 0) + 1,
      lastActionDescription: outcomeText,
      playerWon: action === 'drop_diss' ? true : undefined
    };

    // Generar reacciones en redes
    const socialPosts = SocialFeedEngine.generateBeefPosts(world, player, targetName, action);
    if (!world.socialFeed) world.socialFeed = [];
    world.socialFeed.unshift(...socialPosts);

    return {
      outcomeText,
      hypeChange,
      disciplineChange,
      credibilityChange,
      energyChange,
      newBeefStage,
      socialPosts
    };
  }

  static calculateCollabFeasibility(
    requester: Artist,
    target: Artist,
    projectType: CollabProjectType = 'single_feat',
    budgetProduction: number = 0,
    creditOrder: CreditOrderType | string = 'player_feat_target'
  ): CollabFeasibilityResult {
    const rel = requester.relationships[target.id] || {
      targetArtistId: target.id,
      relationType: 'neutral',
      affinity: 0,
      respect: 50,
      pastCollabsCount: 0,
      history: []
    };

    // 1. Rechazo tajante si hay feudo abierto, rivalidad activa o afinidad fuertemente negativa (< -20)
    if (rel.relationType === 'feud' || rel.relationType === 'rival' || rel.activeRivalry) {
      return {
        willAccept: false,
        reason: `${target.name} está en conflicto / rivalidad activa con vos y rechazó la propuesta de colaboración tajantemente.`,
        chemistryScore: 0,
        crossFanbasePotential: 0,
        acceptanceProbability: 0,
        successBoost: 0
      };
    }

    if (rel.affinity < -20) {
      return {
        willAccept: false,
        reason: `${target.name} siente una marcada antipatía hacia vos (afinidad: ${rel.affinity}) y rechazó la propuesta de plano.`,
        chemistryScore: 0,
        crossFanbasePotential: 0,
        acceptanceProbability: 0,
        successBoost: 0
      };
    }

    // 2. Afinidad mutua (-100 a 100) y Respeto profesional (0 a 100)
    // Afinidad normalizada (0 a 100)
    const affinityNormalized = Math.max(0, Math.min(100, (rel.affinity + 100) / 2));
    const affinityScore = (affinityNormalized - 50) * 0.50; // -25 a +25
    const respectScore = ((rel.respect || 50) - 50) * 0.35;  // -17.5 a +17.5

    // 3. Diferencia de popularidad y brecha de etapa de carrera (Career Stage Gap)
    const popDiff = target.stats.popularity - requester.stats.popularity;
    const requesterTier = CAREER_STAGE_TIERS[requester.careerStage] ?? 0;
    const targetTier = CAREER_STAGE_TIERS[target.careerStage] ?? 0;
    const stageGap = targetTier - requesterTier;

    // Regla de Oro: Si la brecha de carrera es abismal (>= 3 niveles, ej: Underground/Emerging pidiéndole a Superstar/Legend como Bad Bunny, Duki o Rosalía)
    // Sin amistad previa consolidada (afinidad >= 50 o feats previos), el management descarta de plano la propuesta.
    if (stageGap >= 3 && (rel.affinity < 50 && (rel.pastCollabsCount || 0) === 0 && rel.relationType !== 'friend' && rel.relationType !== 'collaborator')) {
      const reason = `El equipo de management de ${target.name} declinó la solicitud: consideran que la brecha de exposición con un artista en etapa ${requester.careerStage} es demasiado amplia sin validación previa en los charts o una relación personal consolidada.`;
      return {
        willAccept: false,
        reason,
        chemistryScore: 5,
        crossFanbasePotential: 100,
        acceptanceProbability: 2,
        successBoost: 0
      };
    }

    let popScore = 0;
    if (popDiff > 0) {
      // El colaborador es más popular: exige más mérito/respeto/presupuesto proporcional
      popScore = -Math.min(65, popDiff * 1.1 + (stageGap > 0 ? stageGap * 8 : 0));
    } else {
      // El solicitante es más popular: el target se entusiasma
      popScore = Math.min(25, Math.abs(popDiff) * 0.6);
    }

    // 4. Compatibilidad de géneros (mismo género o subgénero afín)
    let genreScore = 0;
    let isGenreCompatible = false;
    if (requester.mainGenreId === target.mainGenreId) {
      genreScore = 20;
      isGenreCompatible = true;
    } else {
      const requesterSub = requester.subGenreIds || [];
      const targetSub = target.subGenreIds || [];
      const hasSubOverlap = requesterSub.some(sg => targetSub.includes(sg)) ||
        targetSub.includes(requester.mainGenreId) ||
        requesterSub.includes(target.mainGenreId);

      if (hasSubOverlap) {
        genreScore = 15;
        isGenreCompatible = true;
      } else {
        // Familias urbanas afines
        const urbanGenres = ['trap_latino', 'reggaeton', 'rap_urbano', 'r_and_b', 'drill', 'neoperreo', 'pluggnb', 'trap_argentino', 'mambo_urbano'];
        const bothUrban = urbanGenres.includes(requester.mainGenreId) && urbanGenres.includes(target.mainGenreId);
        if (bothUrban) {
          genreScore = 10;
          isGenreCompatible = true;
        } else {
          genreScore = -10;
        }
      }
    }

    // 5. Presupuesto de producción ofrecido
    let budgetScore = 0;
    const isAlbumProject = projectType === 'collab_ep' || projectType === 'collab_album' || projectType === 'collab_mixtape';
    if (!isAlbumProject) {
      if (budgetProduction >= 10000) budgetScore = 25;
      else if (budgetProduction >= 5000) budgetScore = 18;
      else if (budgetProduction >= 2500) budgetScore = 12;
      else if (budgetProduction >= 1000) budgetScore = 6;
      else if (popDiff > 0) budgetScore = -18;
      else budgetScore = -5;
    } else {
      if (budgetProduction >= 30000) budgetScore = 30;
      else if (budgetProduction >= 15000) budgetScore = 20;
      else if (budgetProduction >= 8000) budgetScore = 12;
      else if (budgetProduction >= 4000) budgetScore = 5;
      else budgetScore = -8;
    }

    // 6. Orden de créditos (Credit Order)
    let creditScore = 0;
    if (creditOrder === 'target_feat_player') {
      creditScore = 8; // El colaborador tiene crédito principal
    } else if (creditOrder === 'player_and_target' || creditOrder === 'player_x_target') {
      creditScore = 5; // Crédito compartido / co-lead
    } else {
      creditScore = 0; // player_feat_target
    }

    // 7. Rasgos de personalidad y colaboraciones previas
    const sociabilityScore = (target.personality.sociability || 50) * 0.15;
    const pastCollabsScore = Math.min(20, (rel.pastCollabsCount || 0) * 6);

    // 8. Cálculo de Probabilidad de Aceptación
    const baseScore = 48 + affinityScore + respectScore + popScore + genreScore + budgetScore + creditScore + sociabilityScore + pastCollabsScore;
    const acceptanceProbability = Math.max(5, Math.min(99, Math.round(baseScore)));
    const willAccept = acceptanceProbability >= 50;

    // 9. Cálculo de Química Musical (Chemistry Score de 5 a 25)
    const creativityAvg = ((requester.personality.creativity || 70) + (target.personality.creativity || 70)) / 2;
    const skillAvg = ((requester.personality.skill || 70) + (target.personality.skill || 70)) / 2;
    const origAvg = ((requester.personality.originality || 70) + (target.personality.originality || 70)) / 2;
    const affinityBonus = Math.max(0, rel.affinity / 25);
    const rawChemistry = (creativityAvg * 0.08) + (skillAvg * 0.08) + (origAvg * 0.05) + (isGenreCompatible ? 3 : 1) + affinityBonus;
    const chemistryScore = Math.max(5, Math.min(25, Math.round(rawChemistry)));

    // 10. Cálculo de Potencial de Cruce de Fanbase (Cross Fanbase Potential)
    const targetPop = target.stats.popularity || 10;
    const targetFans = target.stats.fansCount || 500;
    const crossFanbasePotential = Math.max(
      150,
      Math.floor((targetPop * 160 + targetFans * 0.06) * (chemistryScore / 18))
    );

    // 11. Redacción de motivo realista
    let reason = '';
    if (willAccept) {
      if (budgetScore >= 18) {
        reason = `${target.name} aceptó la colaboración entusiasmado por la contundente propuesta de producción y presupuesto ($${budgetProduction.toLocaleString()}).`;
      } else if (rel.affinity > 35 || rel.respect > 70) {
        reason = `${target.name} aceptó inmediatamente debido a la sólida afinidad y respeto profesional que los une.`;
      } else if (popDiff < -15) {
        reason = `${target.name} aceptó encantado la oportunidad de compartir barras y estudio con vos.`;
      } else {
        reason = `${target.name} aceptó la colaboración motivado por la propuesta sonora y la química artística.`;
      }
    } else {
      if ((popDiff >= 20 || budgetScore < 0) && budgetScore < 15) {
        reason = `${target.name} consideró que la brecha de exposición actual es muy amplia y el presupuesto ofrecido ($${budgetProduction.toLocaleString()}) no justifica el junte en este momento.`;
      } else if (genreScore < 0) {
        reason = `${target.name} evaluó que sus estilos y visiones sonoras no son compatibles para este proyecto.`;
      } else if (rel.affinity < 0 || (rel.respect || 50) < 40) {
        reason = `${target.name} no siente suficiente conexión ni afinidad artística con la propuesta en este momento.`;
      } else {
        reason = `${target.name} consideró que sus agendas o direcciones estéticas no coinciden en este momento.`;
      }
    }

    return {
      willAccept,
      reason,
      chemistryScore,
      crossFanbasePotential,
      acceptanceProbability,
      successBoost: chemistryScore
    };
  }

  /**
   * Determina si un artista está habilitado para ser seleccionado directamente
   * como colaborador en el estudio (StudioView / Álbum).
   */
  static isArtistEligibleForCollab(
    player: Artist,
    target: Artist,
    activePacts?: CollabPact[]
  ): { isEligible: boolean; reason?: string } {
    if (player.id === target.id) return { isEligible: false, reason: 'No puedes colaborar contigo mismo.' };
    const rel = player.relationships?.[target.id];
    if (rel?.relationType === 'feud' || rel?.activeRivalry) {
      return { isEligible: false, reason: 'Feudo activo en la escena musical.' };
    }
    if (rel?.relationType === 'collaborator' || ((rel?.pastCollabsCount ?? 0) > 0 && (rel?.affinity ?? 0) >= 10)) {
      return { isEligible: true };
    }
    if ((rel?.affinity ?? 0) >= 25) {
      return { isEligible: true };
    }
    if (activePacts && activePacts.some(p => p.targetArtistId === target.id && p.status === 'active')) {
      return { isEligible: true };
    }
    return {
      isEligible: false,
      reason: `Requiere acordar colaboración previamente con ${target.name} (afinidad actual: ${rel?.affinity ?? 0}/25).`
    };
  }

  static triggerBeef(
    player: Artist,
    target: Artist,
    currentYear: number,
    currentMonth: number
  ): BeefState {
    const beefId = `beef_${target.id}`;
    return {
      id: beefId,
      targetId: target.id,
      targetName: target.name,
      stage: 'tension',
      hypeMultiplier: 1.2,
      hypeGenerated: 25,
      tensionLevel: 45,
      dissTracksExchanged: [],
      turnsActive: 1,
      lastActionDescription: `${player.name} inició un cruce público contra ${target.name} en ${currentYear}.`
    };
  }
}
