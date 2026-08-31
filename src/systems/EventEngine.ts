import { EventDefinition, EventContext, EventOutcome, EventChoice, WorldState, Artist, RecordLabel, LabelContract } from '../types';
import { CORE_EVENT_TEMPLATES } from '../data/eventTemplates';
import { IndustryEngine } from './IndustryEngine';
import { RelationshipEngine } from './RelationshipEngine';
import { formatMoney } from '../utils/formatters';

export class EventEngine {
  static selectNextEvent(
    context: EventContext,
    recentEventIds: Array<{ eventId: string; year: number; month: number }>
  ): EventDefinition | null {
    // Si el artista no tiene sello y tiene >= 100k oyentes, probabilidad de evento de guerra de ofertas discográficas
    if (context.player.stats.monthlyListeners >= IndustryEngine.MIN_MONTHLY_LISTENERS_FOR_MAJOR_SCOUTS && !context.player.labelId) {
      const lastLabelEvent = recentEventIds.find(r => r.eventId.startsWith('evt_label_bidding_war_') || r.eventId === 'evt_major_label_bidding_war');
      const monthsSince = lastLabelEvent ? (context.currentYear - lastLabelEvent.year) * 12 + (context.currentMonth - lastLabelEvent.month) : 99;
      if (monthsSince >= 12 && Math.random() < 0.4) {
        return this.synthesizeLabelBiddingWarEvent(context);
      }
    }

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
      else if (evt.rarity === 'crisis') score *= 0.5;

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

    const dilemmaTypes = ['clandestine_night', 'viral_debate', 'barrio_session', 'rival_chatter'];
    const chosenDilemma = dilemmaTypes[Math.floor(Math.random() * dilemmaTypes.length)];
    const eventUniqueId = `proc_evt_${context.currentYear}_${context.currentMonth}_${Math.floor(Math.random() * 10000)}`;

    if (chosenDilemma === 'clandestine_night') {
      return {
        id: eventUniqueId,
        title: `Noche de Excesos en el Circuito Nocturno de ${context.player.city}`,
        category: 'personal',
        rarity: 'common',
        cooldownMonths: 12,
        weight: 12,
        condition: () => true,
        getDescription: () => `Tras una intensa semana de grabación, te invitan a un reservado exclusivo donde empresarios de la noche y colegas de ${context.player.city} están festejando hasta el amanecer.`,
        choices: () => [
          {
            id: 'c_proc_party_hard',
            text: 'Sumarte a la fiesta y vivir la noche a fondo',
            consequencesDescription: '+18 Hype, +Contactos nocturnos, -18 Energía, -3 Disciplina',
            apply: () => ({
              narrativeText: 'La fiesta se extendió hasta altas horas. Ganaste presencia en historias y notoriedad, pero tu cuerpo sintió el desgaste.',
              hypeChange: 18,
              energyChange: -18,
              personalityChanges: { discipline: Math.max(0, context.player.personality.discipline - 3) },
              newsGenerated: {
                headline: `${context.player.name} visto festejando en las noches de ${context.player.city}`,
                body: `Imágenes del artista circulan en redes tras una noche agitada en locales exclusivos.`,
                sentiment: 'shocking',
                category: 'culture'
              }
            })
          },
          {
            id: 'c_proc_rest_focus',
            text: 'Declinar y dormir temprano para cuidar tu voz y energía',
            consequencesDescription: '+8 Energía recuperada, +4 Disciplina, Cero desgaste',
            apply: () => ({
              narrativeText: 'Priorizaste tu descanso y salud vocal. Al día siguiente estabas listo para rendir al 100% en el micrófono.',
              energyChange: 8,
              personalityChanges: { discipline: Math.min(100, context.player.personality.discipline + 4) }
            })
          }
        ]
      };
    } else if (chosenDilemma === 'barrio_session') {
      return {
        id: eventUniqueId,
        title: `Sesión de Madrugada en el Home Studio de ${context.player.city}`,
        category: 'music',
        rarity: 'common',
        cooldownMonths: 12,
        weight: 12,
        condition: () => true,
        getDescription: () => `Un productor emergente de tu barrio te envía un paquete de instrumentales crudas de 808s pidiéndote una colaboración espontánea grabada en una sola toma.`,
        choices: () => [
          {
            id: 'c_proc_record_raw',
            text: 'Tirar barras crudas y subir la maqueta a plataformas',
            consequencesDescription: '+Credibilidad callejera (+4), +14 Hype, +2 Originalidad, +1 Skill, -8 Energía',
            apply: () => ({
              narrativeText: 'La maqueta capturó la esencia callejera de tus inicios y fue celebrada por tu comunidad núcleo.',
              statChanges: { artisticCredibility: Math.min(100, context.player.stats.artisticCredibility + 4) },
              personalityChanges: {
                originality: Math.min(100, context.player.personality.originality + 2),
                skill: Math.min(100, context.player.personality.skill + 1)
              },
              hypeChange: 14,
              energyChange: -8,
              fansChange: 1800
            })
          },
          {
            id: 'c_proc_polish_craft',
            text: 'Guardar la idea para perfeccionarla en tu próximo álbum de estudio',
            consequencesDescription: '+2 Skill, +2 Disciplina, +3 Credibilidad artística',
            apply: () => ({
              narrativeText: 'Archivaste la idea para pulirla con mejores arreglos en tu próximo proyecto discográfico.',
              personalityChanges: {
                skill: Math.min(100, context.player.personality.skill + 2),
                discipline: Math.min(100, context.player.personality.discipline + 2)
              },
              statChanges: { artisticCredibility: Math.min(100, context.player.stats.artisticCredibility + 3) }
            })
          }
        ]
      };
    } else if (chosenDilemma === 'rival_chatter') {
      return {
        id: eventUniqueId,
        title: `Debate en Foros: Comparación con ${randomPeer.name}`,
        category: 'media',
        rarity: 'common',
        cooldownMonths: 12,
        weight: 12,
        condition: () => true,
        getDescription: () => `En Twitter y foros de música urbana se abrió una encuesta masiva comparando tus recientes números con los de ${randomPeer.name}, encendiendo el debate sobre quién domina el sonido actual.`,
        choices: () => [
          {
            id: 'c_proc_engage_social_flame',
            text: 'Publicar una declaración contundente sobre tu visión sonora independiente',
            consequencesDescription: '+15 Hype, +Reputación (+4), +2 Carisma, +2 Ambición, +Fidelidad de fans (+5)',
            apply: () => ({
              narrativeText: 'Tus palabras marcaron una clara diferencia de visión y fueron ampliamente respaldadas por tus seguidores.',
              hypeChange: 15,
              reputationChange: 4,
              personalityChanges: {
                charisma: Math.min(100, context.player.personality.charisma + 2),
                ambition: Math.min(100, context.player.personality.ambition + 2)
              },
              statChanges: { fanbaseLoyalty: Math.min(100, context.player.stats.fanbaseLoyalty + 5) }
            })
          },
          {
            id: 'c_proc_ignore_social_flame',
            text: 'No emitir comentarios y dejar que las canciones hablen por sí solas',
            consequencesDescription: '+Mística personal, +3 Disciplina, +2 Energía',
            apply: () => ({
              narrativeText: 'El debate se diluyó dejando tu imagen intacta y tu aura de misterio reforzada.',
              personalityChanges: { discipline: Math.min(100, context.player.personality.discipline + 3) },
              statChanges: { energy: Math.min(100, context.player.stats.energy + 2) }
            })
          }
        ]
      };
    } else {
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
            consequencesDescription: '+14 Hype, +3,500 Fans, +2 Sociabilidad, +1 Carisma, -5 Energía',
            apply: () => ({
              narrativeText: 'El adelanto encendió las conversaciones en foros y playlists de la comunidad.',
              hypeChange: 14,
              fansChange: 3500,
              personalityChanges: {
                sociability: Math.min(100, context.player.personality.sociability + 2),
                charisma: Math.min(100, context.player.personality.charisma + 1)
              },
              energyChange: -5
            })
          },
          {
            id: 'c_focus_recording',
            text: 'Agradecer brevemente y seguir encerrado en el estudio produciendo',
            consequencesDescription: '+Credibilidad artística (+3), +2 Disciplina, +1 Creatividad, +5 Energía',
            apply: () => ({
              narrativeText: 'Mantuviste el foco estricto en la calidad de tus próximas obras.',
              personalityChanges: {
                discipline: Math.min(100, context.player.personality.discipline + 2),
                creativity: Math.min(100, context.player.personality.creativity + 1)
              },
              statChanges: { artisticCredibility: Math.min(100, context.player.stats.artisticCredibility + 3) },
              energyChange: 5
            })
          }
        ]
      };
    }
  }

  static synthesizeLabelBiddingWarEvent(context: EventContext): EventDefinition {
    const biddingOffers = IndustryEngine.generateCompetitiveBiddingWar(context.player, context.world);
    const eventId = `evt_label_bidding_war_${context.currentYear}_${context.currentMonth}_${Math.floor(Math.random() * 1000)}`;

    return {
      id: eventId,
      title: '¡Guerra de Fichajes en los Despachos! Nuevas Ofertas de Sellos',
      category: 'industry',
      rarity: 'rare',
      cooldownMonths: 18,
      weight: 25,
      condition: () => true,
      getDescription: () => {
        const labelsList = biddingOffers.map(o => o.label.name).join(' vs ');
        return `Tus métricas de streaming (${context.player.stats.monthlyListeners.toLocaleString()} oyentes mensuales) han desatado una intensa puja entre directivos de sellos discográficos (${labelsList}). Han presentado propuestas contractuales formales para tu firma.`;
      },
      choices: () => {
        const choices: EventChoice[] = biddingOffers.map(({ label, contract }) => ({
          id: `c_sign_${label.id}`,
          text: `Firmar con ${label.name}: ${formatMoney(contract.signingBonus)} adelanto, ${contract.royaltyPercentage}% regalías, ${contract.albumsRequired} álbum(es)`,
          consequencesDescription: `+${formatMoney(contract.signingBonus)} Anticipo, ${contract.royaltyPercentage}% Regalías, +3 Ambición, +2 Atractivo Comercial`,
          apply: () => ({
            narrativeText: `Has sellado tu acuerdo oficial con ${label.name}. La discográfica activa de inmediato tu presupuesto promocional.`,
            fundsChange: contract.signingBonus,
            popularityChange: label.type === 'major' ? 10 : 6,
            hypeChange: 20,
            personalityChanges: {
              ambition: Math.min(100, context.player.personality.ambition + 3),
              commercialAppeal: Math.min(100, context.player.personality.commercialAppeal + 2)
            },
            newContract: contract,
            newsGenerated: {
              headline: `¡Fichaje Confirmado! ${context.player.name} firma con ${label.name}`,
              body: `El acuerdo incluye un adelanto de ${formatMoney(contract.signingBonus)} y un compromiso de ${contract.albumsRequired} álbumes de estudio.`,
              sentiment: 'positive',
              category: 'industry'
            }
          })
        }));

        choices.push({
          id: 'c_stay_indie_proc',
          text: 'Rechazar las propuestas y mantener la independencia total (100% regalías)',
          consequencesDescription: '+6 Credibilidad artística, +6 Fidelidad de fans, +5 Independencia, +2 Originalidad',
          apply: () => ({
            narrativeText: 'Decidiste no comprometer tu autonomía y continuar como artista 100% independiente.',
            statChanges: {
              artisticCredibility: Math.min(100, context.player.stats.artisticCredibility + 6),
              fanbaseLoyalty: Math.min(100, context.player.stats.fanbaseLoyalty + 6)
            },
            personalityChanges: {
              independence: Math.min(100, context.player.personality.independence + 5),
              originality: Math.min(100, context.player.personality.originality + 2)
            },
            reputationChange: 5,
            hypeChange: 10,
            newsGenerated: {
              headline: `${context.player.name} prioriza su independencia ante el asedio de los sellos`,
              body: `El artista continúa operando de forma autogestionada sin ataduras corporativas.`,
              sentiment: 'neutral',
              category: 'industry'
            }
          })
        });

        return choices;
      }
    };
  }
}
