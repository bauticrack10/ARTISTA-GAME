import {
  Artist,
  WorldState,
  PersonalityTraits,
  ArtistStats,
  NewsItem,
  SocialPost
} from '../types';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';
import { formatMoney } from '../utils/formatters';

export type DecisionActionType =
  | 'vocal_training'
  | 'studio_practice'
  | 'reflective_rest'
  | 'industry_networking';

export interface DecisionActionConfig {
  id: DecisionActionType;
  title: string;
  subtitle: string;
  description: string;
  category: 'training' | 'wellness' | 'industry' | 'creation';
  costFunds: number;
  costEnergy: number; // positive = energy spent, negative = energy recovered
  iconName: string;
  colorAccent: string;
  badgeLabel: string;
  statDeltas: Partial<PersonalityTraits>;
  artistStatDeltas?: Partial<ArtistStats>;
}

export interface DecisionExecutionResult {
  success: boolean;
  actionId: DecisionActionType;
  title: string;
  narrativeText: string;
  gainsSummary: string;
  personalityChanges: Partial<PersonalityTraits>;
  statChanges?: Partial<ArtistStats>;
  fundsSpent: number;
  energyChange: number;
  newsItem?: NewsItem;
  socialPost?: SocialPost;
  error?: string;
}

export interface SemesterActivityData {
  songsRecorded: number;
  toursConducted: number;
  successfulReleases: number;
  collabsConducted: number;
}

export interface OrganicProgressionResult {
  traitsDelta: Partial<PersonalityTraits>;
  summaryNotes: string[];
  newsGenerated?: NewsItem;
  hasCappedTraits: boolean;
}

export class DecisionEngine {
  public static readonly SOFT_CAP_THRESHOLD = 90;

  /**
   * Retorna las configuraciones de acciones interactivas para el DecisionHub.
   */
  public static getAvailableDecisions(): Record<DecisionActionType, DecisionActionConfig> {
    return {
      vocal_training: {
        id: 'vocal_training',
        title: 'Clases Vocales & Técnica',
        subtitle: 'Entrenamiento de respiración, afinación y presencia',
        description: 'Sesión intensiva con preparador vocal para expandir tu rango, proyección escénica y control de vibrato.',
        category: 'training',
        costFunds: 350,
        costEnergy: 15,
        iconName: 'Mic2',
        colorAccent: '#8B5CF6',
        badgeLabel: '+2 Skill • +1 Carisma',
        statDeltas: {
          skill: 2,
          charisma: 1
        }
      },
      studio_practice: {
        id: 'studio_practice',
        title: 'Composición & Práctica en Estudio',
        subtitle: 'Laboratorio sonoro y búsqueda de nuevos samples',
        description: 'Encierro creativo de fin de semana explorando estructuras armónicas, métricas avanzadas y melodías.',
        category: 'creation',
        costFunds: 200,
        costEnergy: 20,
        iconName: 'Disc3',
        colorAccent: '#EC4899',
        badgeLabel: '+2 Creatividad • +1 Skill',
        statDeltas: {
          creativity: 2,
          skill: 1
        }
      },
      reflective_rest: {
        id: 'reflective_rest',
        title: 'Descanso Reflexivo & Bienestar',
        subtitle: 'Desconexión física y meditación artística',
        description: 'Retiro de relajación y spa para despejar la mente, recargar vitalidad y fortalecer el enfoque mental.',
        category: 'wellness',
        costFunds: 400,
        costEnergy: -50, // Recupera 50 de energía
        iconName: 'Coffee',
        colorAccent: '#10B981',
        badgeLabel: '+50 Energía • +2 Disciplina • +1 Creatividad',
        statDeltas: {
          discipline: 2,
          creativity: 1
        },
        artistStatDeltas: {
          energy: 50
        }
      },
      industry_networking: {
        id: 'industry_networking',
        title: 'Networking & Encuentro en la Escena',
        subtitle: 'Reunión en eventos y estudios con colegas y productores',
        description: 'Participar en showcases y eventos clave de la industria musical para afianzar contactos y expandir tu red.',
        category: 'industry',
        costFunds: 300,
        costEnergy: 12,
        iconName: 'Users',
        colorAccent: '#06B6D4',
        badgeLabel: '+2 Sociabilidad • +1 Carisma • +8 Hype',
        statDeltas: {
          sociability: 2,
          charisma: 1
        },
        artistStatDeltas: {
          hype: 8
        }
      }
    };
  }

  /**
   * Comprueba si el jugador posee coaching o entrenamiento élite para superar el soft cap de 90.
   */
  public static hasEliteCoaching(player: Artist): boolean {
    if (!player.lifestyleUpgrades || player.lifestyleUpgrades.length === 0) return false;
    const itemMap = new Map(LIFESTYLE_ITEMS.map(i => [i.id, i]));
    return player.lifestyleUpgrades.some(id => {
      const item = itemMap.get(id);
      return item && item.category === 'coaching';
    });
  }

  /**
   * Ejecuta una decisión puntual del DecisionHub, validando costos y aplicando mejoras permanentes.
   */
  public static executeDecision(
    actionType: DecisionActionType,
    player: Artist,
    world: WorldState
  ): DecisionExecutionResult {
    const config = this.getAvailableDecisions()[actionType];
    if (!config) {
      return {
        success: false,
        actionId: actionType,
        title: 'Acción Desconocida',
        narrativeText: 'La acción solicitada no existe.',
        gainsSummary: '',
        personalityChanges: {},
        fundsSpent: 0,
        energyChange: 0,
        error: 'Acción no válida.'
      };
    }

    // 1. Validaciones de recursos
    if (config.costFunds > 0 && player.stats.funds < config.costFunds) {
      return {
        success: false,
        actionId: actionType,
        title: config.title,
        narrativeText: `Fondos insuficientes. Se requieren ${formatMoney(config.costFunds)} y posees ${formatMoney(player.stats.funds)}.`,
        gainsSummary: '',
        personalityChanges: {},
        fundsSpent: 0,
        energyChange: 0,
        error: 'Fondos insuficientes.'
      };
    }

    if (config.costEnergy > 0 && player.stats.energy < config.costEnergy) {
      return {
        success: false,
        actionId: actionType,
        title: config.title,
        narrativeText: `Energía insuficiente. Necesitas al menos ${config.costEnergy}% de vitalidad (actual: ${player.stats.energy}%).`,
        gainsSummary: '',
        personalityChanges: {},
        fundsSpent: 0,
        energyChange: 0,
        error: 'Energía insuficiente.'
      };
    }

    // 2. Deducir costos
    const fundsToDeduct = Math.min(player.stats.funds, config.costFunds);
    if (fundsToDeduct > 0) {
      player.stats.funds -= fundsToDeduct;
    }

    // 3. Aplicar energía (gasto o recuperación)
    let netEnergyDelta = 0;
    if (config.costEnergy < 0) {
      // Recuperación (e.g. -50 significa +50 de energía)
      const recoverAmount = Math.abs(config.costEnergy);
      const prevEnergy = player.stats.energy;
      player.stats.energy = Math.min(100, player.stats.energy + recoverAmount);
      netEnergyDelta = player.stats.energy - prevEnergy;
    } else if (config.costEnergy > 0) {
      player.stats.energy = Math.max(0, player.stats.energy - config.costEnergy);
      netEnergyDelta = -config.costEnergy;
    }

    // 4. Aplicar cambios a ArtistStats adicionales (como hype)
    if (config.artistStatDeltas) {
      if (config.artistStatDeltas.hype) {
        player.stats.hype = Math.min(100, Math.max(0, player.stats.hype + config.artistStatDeltas.hype));
      }
    }

    // 5. Aplicar mejoras permanentes de habilidades a personality
    const multiplier = player.isProdigy ? (player.prodigyMultiplier || 3) : 1;
    const eliteCoaching = this.hasEliteCoaching(player);
    const appliedPersonalityDeltas: Partial<PersonalityTraits> = {};
    const gainsList: string[] = [];

    for (const [traitKey, rawDelta] of Object.entries(config.statDeltas)) {
      const key = traitKey as keyof PersonalityTraits;
      if (typeof rawDelta === 'number') {
        const effectiveDelta = rawDelta * multiplier;
        const currentVal = player.personality[key] || 0;
        const cap = eliteCoaching ? 100 : this.SOFT_CAP_THRESHOLD;

        let finalVal = currentVal;
        if (currentVal < cap) {
          finalVal = Math.min(cap, currentVal + effectiveDelta);
        } else if (eliteCoaching) {
          finalVal = Math.min(100, currentVal + effectiveDelta);
        }

        const realIncrease = finalVal - currentVal;
        if (realIncrease > 0) {
          player.personality[key] = finalVal;
          appliedPersonalityDeltas[key] = realIncrease;
          gainsList.push(`+${realIncrease} en ${this.getTraitLabel(key)}`);
        }
      }
    }

    // 6. Resumen y narrativa
    let narrative = '';
    switch (actionType) {
      case 'vocal_training':
        narrative = `Completaste una sesión intensiva de colocación vocal y técnica diafragmática. Tu afinación y seguridad en el micrófono subieron de nivel.`;
        break;
      case 'studio_practice':
        narrative = `Pasaste horas experimentando con progresiones de acordes, arreglos y texturas sonoras. Tu creatividad compositiva se encuentra al máximo.`;
        break;
      case 'reflective_rest':
        narrative = `Te tomaste un tiempo de desconexión reflexiva y relajación integral. Recuperaste vitalidad (+${netEnergyDelta}% Energía) y renovaste tu enfoque disciplinario.`;
        break;
      case 'industry_networking':
        narrative = `Asististe a un encuentro de la escena con productores, curadores y colegas. Afianzaste alianzas estratégicas y encendiste el hype de tus futuros lanzamientos.`;
        break;
    }

    const gainsSummary = gainsList.length > 0
      ? `Mejoras obtenidas: ${gainsList.join(', ')}.`
      : 'Tus habilidades ya están al límite de este nivel de entrenamiento.';

    // 7. Noticia
    const newsItem: NewsItem = {
      id: `news_dec_${Date.now()}`,
      headline: `Desarrollo Artístico: ${player.name} apuesta por "${config.title}"`,
      body: `${player.name} dedicó recursos a su perfeccionamiento y preparación integral (${config.subtitle}).`,
      year: world.currentYear,
      month: world.currentMonth,
      category: 'culture',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 2
    };

    return {
      success: true,
      actionId: actionType,
      title: config.title,
      narrativeText: narrative,
      gainsSummary,
      personalityChanges: appliedPersonalityDeltas,
      statChanges: { energy: player.stats.energy, hype: player.stats.hype },
      fundsSpent: fundsToDeduct,
      energyChange: netEnergyDelta,
      newsItem
    };
  }

  /**
   * Evalúa y aplica el desarrollo orgánico por práctica y experiencia al final de cada ciclo/semestre.
   */
  public static evaluateOrganicProgression(
    player: Artist,
    activity: SemesterActivityData,
    world: WorldState
  ): OrganicProgressionResult {
    const multiplier = player.isProdigy ? (player.prodigyMultiplier || 3) : 1;
    const eliteCoaching = this.hasEliteCoaching(player);
    const itemMap = new Map(LIFESTYLE_ITEMS.map(i => [i.id, i]));
    const notes: string[] = [];
    const traitsDelta: Partial<PersonalityTraits> = {};
    let hasCappedTraits = false;

    const applySkillDelta = (trait: keyof PersonalityTraits, baseDelta: number, reason: string) => {
      if (baseDelta <= 0) return;
      const effectiveDelta = Math.round(baseDelta * multiplier);
      const currentVal = player.personality[trait] || 0;
      const cap = eliteCoaching ? 100 : this.SOFT_CAP_THRESHOLD;

      if (currentVal >= this.SOFT_CAP_THRESHOLD && !eliteCoaching) {
        hasCappedTraits = true;
        return;
      }

      const newVal = Math.min(cap, currentVal + effectiveDelta);
      const actualGain = newVal - currentVal;
      if (actualGain > 0) {
        player.personality[trait] = newVal;
        traitsDelta[trait] = (traitsDelta[trait] || 0) + actualGain;
        notes.push(`+${actualGain} en ${this.getTraitLabel(trait)} (${reason})`);
      }
    };

    // 1. Práctica por canciones compuestas / grabadas en el semestre (+1 a +2 en creativity y skill)
    if (activity.songsRecorded > 0) {
      const songSkillPoints = Math.min(5, Math.max(1, Math.round(activity.songsRecorded * 1.5)));
      const songCreativityPoints = Math.min(5, Math.max(1, Math.round(activity.songsRecorded * 1.5)));
      applySkillDelta('skill', songSkillPoints, `${activity.songsRecorded} tema(s) grabado(s)`);
      applySkillDelta('creativity', songCreativityPoints, `composición activa en estudio`);
    }

    // 2. Giras y shows en vivo realizados (+1 a +2 en charisma y discipline)
    if (activity.toursConducted > 0) {
      const tourCharismaPoints = Math.min(4, Math.max(1, Math.round(activity.toursConducted * 1.5)));
      const tourDisciplinePoints = Math.min(4, Math.max(1, Math.round(activity.toursConducted * 1.5)));
      applySkillDelta('charisma', tourCharismaPoints, `${activity.toursConducted} gira(s)/show(s)`);
      applySkillDelta('discipline', tourDisciplinePoints, `resistencia en directo`);
    }

    // 3. Lanzamientos o campañas exitosas (+1 en commercialAppeal y ambition)
    if (activity.successfulReleases > 0) {
      const appealPoints = Math.min(3, Math.max(1, Math.round(activity.successfulReleases * 1.0)));
      const ambitionPoints = Math.min(3, Math.max(1, Math.round(activity.successfulReleases * 1.0)));
      applySkillDelta('commercialAppeal', appealPoints, `${activity.successfulReleases} lanzamiento(s) exitoso(s)`);
      applySkillDelta('ambition', ambitionPoints, `expansión de audiencia`);
    }

    // 4. Colaboraciones realizadas (+1 en sociability)
    if (activity.collabsConducted > 0) {
      const socPoints = Math.min(3, Math.max(1, Math.round(activity.collabsConducted * 1.0)));
      applySkillDelta('sociability', socPoints, `${activity.collabsConducted} colaboración(es)`);
    }

    // 5. Ganancia pasiva semestral por mejoras de coaching / entrenamiento
    if (player.lifestyleUpgrades && player.lifestyleUpgrades.length > 0) {
      for (const itemId of player.lifestyleUpgrades) {
        const item = itemMap.get(itemId);
        if (item) {
          if (item.id === 'coach_theory_songwriting') {
            applySkillDelta('creativity', 1, 'Masterclass de Composición');
          } else if (item.id === 'coach_vocal_elite') {
            applySkillDelta('skill', 1, 'Coach Vocal de Élite');
            applySkillDelta('charisma', 1, 'Presencia Vocal Élite');
          } else if (item.id === 'coach_media_styling') {
            applySkillDelta('charisma', 1, 'Media Training');
            applySkillDelta('commercialAppeal', 1, 'Asesoría de Imagen');
          } else if (item.id === 'coach_wellness_nutrition') {
            applySkillDelta('discipline', 1, 'Preparación Física & Nutrición');
          }
        }
      }
    }

    // 6. Generar noticia si hubo progreso relevante
    let newsGenerated: NewsItem | undefined;
    if (notes.length > 0) {
      newsGenerated = {
        id: `news_progression_${world.currentYear}_${world.currentMonth}`,
        headline: `Evolución Artística: ${player.name} perfecciona sus habilidades`,
        body: `A lo largo del semestre, la intensa práctica en estudio, los directos y el entrenamiento rindieron frutos: ${notes.slice(0, 4).join(', ')}.`,
        year: world.currentYear,
        month: world.currentMonth,
        category: 'culture',
        relatedArtistIds: [player.id],
        sentiment: 'positive',
        importance: 3
      };
    }

    return {
      traitsDelta,
      summaryNotes: notes,
      newsGenerated,
      hasCappedTraits
    };
  }

  /**
   * Retorna una etiqueta amigable en español para cada rasgo de personalidad.
   */
  public static getTraitLabel(trait: keyof PersonalityTraits): string {
    const labels: Record<keyof PersonalityTraits, string> = {
      creativity: 'Creatividad',
      ambition: 'Ambición',
      discipline: 'Disciplina',
      charisma: 'Carisma',
      skill: 'Habilidad Técnica',
      commercialAppeal: 'Atractivo Comercial',
      originality: 'Originalidad',
      riskTolerance: 'Tolerancia al Riesgo',
      sociability: 'Sociabilidad',
      independence: 'Independencia'
    };
    return labels[trait] || trait;
  }
}
