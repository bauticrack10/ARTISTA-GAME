import { EventDefinition, EventContext, EventOutcome, EventChoice, WorldState, Artist } from '../types';
import { CORE_EVENT_TEMPLATES } from '../data/eventTemplates';

export class EventEngine {
  static selectNextEvent(
    context: EventContext,
    recentEventIds: Array<{ eventId: string; year: number; month: number }>
  ): EventDefinition | null {
    const candidates: Array<{ event: EventDefinition; score: number }> = [];

    // Filter and score core handcrafted templates
    for (const evt of CORE_EVENT_TEMPLATES) {
      // Check min/max career stage
      if (evt.minCareerStage && context.player.careerStage !== evt.minCareerStage) continue;
      if (evt.maxCareerStage && context.player.careerStage !== evt.maxCareerStage) continue;

      // Check anti-repetition memory & cooldown
      const lastOccurrence = recentEventIds.find(r => r.eventId === evt.id);
      if (lastOccurrence) {
        const monthsSince = (context.currentYear - lastOccurrence.year) * 12 + (context.currentMonth - lastOccurrence.month);
        if (monthsSince < evt.cooldownMonths) continue; // In cooldown
      }

      // Check custom condition
      try {
        if (!evt.condition(context)) continue;
      } catch (err) {
        continue;
      }

      let score = evt.weight;
      if (evt.rarity === 'common') score *= 1.0;
      else if (evt.rarity === 'uncommon') score *= 0.6;
      else if (evt.rarity === 'rare') score *= 0.3;
      else if (evt.rarity === 'legendary') score *= 0.1;

      candidates.push({ event: evt, score });
    }

    if (candidates.length > 0) {
      // Weighted random selection
      const totalScore = candidates.reduce((acc, c) => acc + c.score, 0);
      let rand = Math.random() * totalScore;
      for (const item of candidates) {
        rand -= item.score;
        if (rand <= 0) return item.event;
      }
      return candidates[0].event;
    }

    // Fallback: Synthesize procedural event dynamically so the game never runs out of events!
    return this.synthesizeProceduralEvent(context);
  }

  static synthesizeProceduralEvent(context: EventContext): EventDefinition {
    const otherArtists = Object.values(context.world.artists).filter(a => a.id !== context.player.id && !a.isRetired);
    const randomPeer = otherArtists[Math.floor(Math.random() * otherArtists.length)] || {
      id: 'artist_generic',
      name: 'Un Colega de la Escena',
      mainGenreId: context.player.mainGenreId
    };

    const isPositive = Math.random() > 0.4;
    const eventUniqueId = `proc_evt_${context.currentYear}_${context.currentMonth}_${Math.floor(Math.random() * 10000)}`;

    if (isPositive) {
      return {
        id: eventUniqueId,
        title: `Repercusión Sonora en la Escena de ${context.player.mainGenreId}`,
        category: 'community',
        rarity: 'common',
        cooldownMonths: 12,
        weight: 10,
        condition: () => true,
        getDescription: () => `Nuevos productores y oyentes de ${context.player.country} están discutiendo tu influencia sonora tras tus recientes movimientos en la escena. ${randomPeer.name} destacó tu identidad en una rueda de prensa.`,
        choices: () => [
          {
            id: 'c_engage_community',
            text: 'Interactuar con la comunidad y lanzar un adelanto de estudio',
            consequencesDescription: '+Hype, +Fans, -5 Energía',
            apply: () => ({
              narrativeText: 'El adelanto encendió las conversaciones en foros y playlists de la comunidad.',
              hypeChange: 14,
              fansChange: 3500,
              energyChange: -5
            })
          },
          {
            id: 'c_focus_recording',
            text: 'Agradecer brevemente y seguir encerrado en el estudio produciendo',
            consequencesDescription: '+Credibilidad artística, +Energía preservada',
            apply: () => ({
              narrativeText: 'Mantuviste el foco estricto en la calidad de tus próximas obras.',
              statChanges: { artisticCredibility: Math.min(100, context.player.stats.artisticCredibility + 3) },
              energyChange: 5
            })
          }
        ]
      };
    } else {
      return {
        id: eventUniqueId,
        title: `Debate sobre Tendencias & Dirección Sonora`,
        category: 'media',
        rarity: 'common',
        cooldownMonths: 12,
        weight: 10,
        condition: () => true,
        getDescription: () => `Un canal de crítica musical publicó un exhaustivo análisis comparando tu trayectoria con la de ${randomPeer.name}, abriendo un debate sobre qué rumbo tomará el género en los próximos años.`,
        choices: () => [
          {
            id: 'c_artistic_statement',
            text: 'Publicar una declaración sobre tu visión artística independiente',
            consequencesDescription: '+Reputación, +Fidelidad de fans',
            apply: () => ({
              narrativeText: 'Tu claridad de conceptos reforzó el respeto tanto de tus seguidores como de tus detractores.',
              reputationChange: 4,
              statChanges: { fanbaseLoyalty: Math.min(100, context.player.stats.fanbaseLoyalty + 5) }
            })
          },
          {
            id: 'c_let_music_talk',
            text: 'No emitir comentarios y dejar que las canciones hablen',
            consequencesDescription: '+Mística personal, Sin desgaste',
            apply: () => ({
              narrativeText: 'El debate se diluyó naturalmente dejando tu prestigio intacto.',
              statChanges: { energy: Math.min(100, context.player.stats.energy + 2) }
            })
          }
        ]
      };
    }
  }
}
