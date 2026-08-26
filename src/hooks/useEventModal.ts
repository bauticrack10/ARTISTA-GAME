import { useMemo, useCallback } from 'react';
import { EventDefinition, EventChoice, WorldState, Artist, EventContext } from '../types';
import { formatMoney, sanitizeString } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';
import {
  TrendingUp,
  Music,
  FileText,
  Handshake,
  Swords,
  Radio,
  Volume2,
  Award,
  Sparkles,
  DollarSign,
  Zap,
  Flame,
  Users,
  Star,
  LucideIcon
} from 'lucide-react';

export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export type ImpactChipType = 'positive' | 'negative' | 'neutral' | 'energy' | 'money' | 'hype' | 'fans' | 'reputation';

export interface ParsedImpactChip {
  key: string;
  text: string;
  type: ImpactChipType;
  icon: LucideIcon;
}

export interface ValidatedEventChoice {
  raw: EventChoice;
  id: string;
  index: number;
  cleanText: string;
  cleanedNarrative: string;
  chips: ParsedImpactChip[];
  costFunds: number;
  costEnergy: number;
  isAffordable: boolean;
  hasEnoughEnergy: boolean;
  isEligible: boolean;
  unmetReasons: string[];
}

export interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  badgeColor: string;
  glow: string;
}

export interface RarityMeta {
  label: string;
  badgeClass: string;
  dotColor: string;
}

export interface ContextualTemporality {
  label: string;
  badge: string;
  isYearEnd: boolean;
  monthName: string;
}

export interface UseEventModalProps {
  event: EventDefinition;
  world: WorldState;
  player: Artist;
  onSelectChoice: (index: number) => void;
}

export interface UseEventModalResult {
  context: EventContext;
  description: string;
  choices: ValidatedEventChoice[];
  categoryMeta: CategoryMeta;
  rarityMeta: RarityMeta;
  isCrisis: boolean;
  isBloqueoCreativo: boolean;
  temporality: ContextualTemporality;
  handleSelectChoice: (choiceIndex: number) => void;
}

/**
 * Extracts numeric funds cost from choice properties or narrative text if not explicitly set
 */
function extractCostFunds(choice: EventChoice): number {
  if (typeof choice.costFunds === 'number' && choice.costFunds > 0) {
    return choice.costFunds;
  }
  const combined = `${choice.consequencesDescription || ''} ${choice.text || ''}`;
  // Look for patterns like "-$600", "-$25,000", "Pagarle $150", "Requiere $500", "costo de $1000"
  const match = combined.match(/(?:-\s*\$|pagar(?:le)?\s*\$|requiere\s*\$|costo\s*(?:de)?\s*\$|\$\s*)([0-9,.]+)/i);
  if (match) {
    const rawNum = match[1].replace(/,/g, '');
    const val = parseFloat(rawNum);
    if (!isNaN(val) && val > 0) {
      if (combined.includes('-$') || /pagar|costo|requiere|invertir|acuerdo/i.test(combined)) {
        return val;
      }
    }
  }
  return 0;
}

/**
 * Extracts numeric energy cost from choice properties or narrative text
 */
function extractCostEnergy(choice: EventChoice): number {
  if (typeof choice.costEnergy === 'number' && choice.costEnergy > 0) {
    return choice.costEnergy;
  }
  const combined = `${choice.consequencesDescription || ''} ${choice.text || ''}`;
  const match = combined.match(/(?:-\s*([0-9]+)\s*%?\s*energ[íi]a|requiere\s*([0-9]+)\s*%\s*energ[íi]a)/i);
  if (match) {
    const val = parseInt(match[1] || match[2], 10);
    if (!isNaN(val) && val > 0) return val;
  }
  return 0;
}

/**
 * Checks whether a clause is purely a stat modifier token
 */
function isStatToken(clause: string): boolean {
  const trimmed = clause.trim();
  if (!trimmed) return false;
  // Has explicit sign like "+4 Credibilidad", "-$600 Fondos", "-25 Energía", "+14 Hype", "+80 Fans", "+100% Derechos"
  if (/^[+-]\s*(\$?[0-9,.]+|[0-9]+%)/.test(trimmed)) return true;
  // Has currency like "-$600" or "$150 Fondos"
  if (/\$[0-9,.]+/.test(trimmed) && /fondos|pagar|costo|adelanto/i.test(trimmed)) return true;
  // Common stat keywords with numbers or indicators
  if (/^[+-]?\s*(?:Hype|Energía|Popularidad|Fans|Reputación|Credibilidad|Oyentes|Calidad|Habilidad|Relación)/i.test(trimmed)) return true;
  if (/^\(\s*[+-]?[0-9]+\s*\)$/.test(trimmed)) return true;
  return false;
}

/**
 * Parses consequence description into structured chips and cleaned narrative text
 * to prevent duplicate numbers between the paragraph and chips.
 */
function parseConsequences(desc: string): { chips: ParsedImpactChip[]; cleanedNarrative: string } {
  if (!desc) return { chips: [], cleanedNarrative: '' };

  const rawParts = desc.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  const chips: ParsedImpactChip[] = [];
  const narrativeClauses: string[] = [];

  rawParts.forEach((part, index) => {
    if (isStatToken(part)) {
      let type: ImpactChipType = 'neutral';
      let icon: LucideIcon = Sparkles;
      const lower = part.toLowerCase();

      if (part.includes('+') || lower.includes('aumenta') || lower.includes('éxito') || lower.includes('gana')) {
        type = 'positive';
      }
      if (part.includes('-') || lower.includes('reduce') || lower.includes('pierde') || lower.includes('caída')) {
        type = 'negative';
      }

      if (part.includes('$') || lower.includes('fondos') || lower.includes('costas')) {
        type = 'money';
        icon = DollarSign;
      } else if (lower.includes('energía') || lower.includes('fatiga')) {
        type = 'energy';
        icon = Zap;
      } else if (lower.includes('hype') || lower.includes('viral')) {
        type = 'hype';
        icon = Flame;
      } else if (lower.includes('fan') || lower.includes('oyente')) {
        type = 'fans';
        icon = Users;
      } else if (lower.includes('reputación') || lower.includes('credibilidad') || lower.includes('legado')) {
        type = 'reputation';
        icon = Star;
      }

      chips.push({
        key: `chip-${index}-${part.slice(0, 8)}`,
        text: sanitizeString(part),
        type,
        icon
      });
    } else {
      // Qualitative narrative text (e.g. "Lanza un single espontáneo de rescate", "Mantiene la canción en plataformas")
      narrativeClauses.push(part);
    }
  });

  // Clean narrative sentences, ensuring no orphan modifiers remain
  const cleanedNarrative = sanitizeString(narrativeClauses.join('. '));

  return { chips, cleanedNarrative };
}

/**
 * Custom Hook for EventModal state, validation, badges, temporality and audio feedback
 */
export function useEventModal({
  event,
  world,
  player,
  onSelectChoice
}: UseEventModalProps): UseEventModalResult {
  const context: EventContext = useMemo(() => ({
    player,
    world,
    currentYear: world.currentYear,
    currentMonth: world.currentMonth,
    label: player.labelId ? world.labels[player.labelId] : undefined
  }), [player, world]);

  const rawChoices: EventChoice[] = useMemo(() => {
    return typeof event.choices === 'function' ? event.choices(context) : [];
  }, [event, context]);

  const description: string = useMemo(() => {
    return typeof event.getDescription === 'function'
      ? event.getDescription(context)
      : (event as any).description || 'Un acontecimiento sacude tu rutina artística.';
  }, [event, context]);

  // Determine badges: CRISIS / BLOQUEO CREATIVO
  const isBloqueoCreativo = useMemo(() => {
    if (event.id === 'evt_creative_drought_mandatory') return true;
    const titleAndDesc = `${event.title} ${description}`.toLowerCase();
    return /sequ[íi]a|bloqueo|año en silencio|sin lanzamientos|falta de inspiraci[óo]n/.test(titleAndDesc);
  }, [event.id, event.title, description]);

  const isCrisis = useMemo(() => {
    if (isBloqueoCreativo) return true;
    if (event.category === 'scandal' || event.category === ('crisis' as any)) return true;
    const combined = `${event.title} ${(event as any).category || ''}`.toLowerCase();
    return /crisis|alerta|urgencia|demanda|intimaci[óo]n|quiebra|esc[áa]ndalo/.test(combined) || (event as any).isCrisis === true;
  }, [isBloqueoCreativo, event]);

  // Contextual Temporality Calculation
  const temporality: ContextualTemporality = useMemo(() => {
    const month = world.currentMonth;
    const year = world.currentYear;
    const monthName = MONTH_NAMES_ES[month - 1] || `Mes ${month}`;

    const isAnnualOrDrought =
      event.id === 'evt_creative_drought_mandatory' ||
      event.category === 'awards' ||
      month === 12 ||
      /sequ[íi]a|cierre|anual|balance/i.test(event.title);

    if (isAnnualOrDrought && (month === 12 || event.id === 'evt_creative_drought_mandatory')) {
      const yearToDisplay = event.eventYear ?? (month === 1 && event.id === 'evt_creative_drought_mandatory' ? year - 1 : year);
      return {
        label: `Fin del Año ${yearToDisplay}`,
        badge: `Fin del Año ${yearToDisplay} • Cierre de Temporada`,
        isYearEnd: true,
        monthName: 'Diciembre'
      };
    }

    return {
      label: `Año ${year} • ${monthName}`,
      badge: `Año ${year} • Mes ${month}/12 (${monthName})`,
      isYearEnd: false,
      monthName
    };
  }, [world.currentMonth, world.currentYear, event.id, event.category, event.title, event.eventYear]);

  // Category visual metadata
  const categoryMeta: CategoryMeta = useMemo(() => {
    switch (event.category) {
      case 'crisis':
        return {
          label: 'Crisis & Sequía',
          icon: Swords,
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          glow: 'from-rose-500/20 via-transparent to-transparent'
        };
      case 'career':
        return {
          label: 'Decisión de Carrera',
          icon: TrendingUp,
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          glow: 'from-teal-500/20 via-transparent to-transparent'
        };
      case 'music':
        return {
          label: 'Creación & Estudio',
          icon: Music,
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          glow: 'from-purple-500/20 via-transparent to-transparent'
        };
      case 'industry':
        return {
          label: 'Industria & Contratos',
          icon: FileText,
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          glow: 'from-amber-500/20 via-transparent to-transparent'
        };
      case 'relationships':
        return {
          label: 'Vínculos & Alianzas',
          icon: Handshake,
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          glow: 'from-blue-500/20 via-transparent to-transparent'
        };
      case 'rivalry':
      case 'scandal':
        return {
          label: 'Conflicto & Polémica',
          icon: Swords,
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          glow: 'from-rose-500/20 via-transparent to-transparent'
        };
      case 'media':
        return {
          label: 'Medios & Redes',
          icon: Radio,
          badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
          glow: 'from-pink-500/20 via-transparent to-transparent'
        };
      case 'shows':
        return {
          label: 'En Vivo & Escenarios',
          icon: Volume2,
          badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          glow: 'from-orange-500/20 via-transparent to-transparent'
        };
      case 'awards':
        return {
          label: 'Premios & Reconocimiento',
          icon: Award,
          badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          glow: 'from-yellow-500/20 via-transparent to-transparent'
        };
      default:
        return {
          label: 'Dilema Personal',
          icon: Sparkles,
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          glow: 'from-indigo-500/20 via-transparent to-transparent'
        };
    }
  }, [event.category]);

  // Rarity visual metadata
  const rarityMeta: RarityMeta = useMemo(() => {
    switch (event.rarity) {
      case 'crisis':
        return {
          label: 'Momento Crítico',
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
          dotColor: 'bg-rose-500'
        };
      case 'legendary':
        return {
          label: 'Hito Legendario',
          badgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]',
          dotColor: 'bg-amber-400'
        };
      case 'rare':
        return {
          label: 'Evento Raro',
          badgeClass: 'bg-purple-400/20 text-purple-300 border-purple-400/50 shadow-[0_0_10px_rgba(192,132,252,0.25)]',
          dotColor: 'bg-purple-400'
        };
      case 'uncommon':
        return {
          label: 'Poco Común',
          badgeClass: 'bg-blue-400/20 text-blue-300 border-blue-400/40',
          dotColor: 'bg-blue-400'
        };
      default:
        return {
          label: 'Ocasión Escénica',
          badgeClass: 'bg-white/10 text-white/80 border-white/20',
          dotColor: 'bg-stone-400'
        };
    }
  }, [event.rarity]);

  // Process & strictly validate all choices
  const choices: ValidatedEventChoice[] = useMemo(() => {
    return rawChoices.map((choice, index) => {
      const costFunds = extractCostFunds(choice);
      const costEnergy = extractCostEnergy(choice);

      const isAffordable = player.stats.funds >= costFunds;
      const hasEnoughEnergy = player.stats.energy >= costEnergy;

      let hasRequiredStat = true;
      const unmetReasons: string[] = [];

      if (!isAffordable && costFunds > 0) {
        unmetReasons.push(`Fondos insuficientes: Requiere ${formatMoney(costFunds)} (tienes ${formatMoney(player.stats.funds)})`);
      }

      if (!hasEnoughEnergy && costEnergy > 0) {
        unmetReasons.push(`Energía insuficiente: Requiere ${costEnergy}% (tienes ${player.stats.energy}%)`);
      }

      if (choice.requiresStat) {
        const statKey = choice.requiresStat.stat;
        const statVal = (player.stats as any)[statKey] ?? (player.personality as any)[statKey] ?? 0;
        if (statVal < choice.requiresStat.min) {
          hasRequiredStat = false;
          unmetReasons.push(`Requiere ${String(statKey)} ≥ ${choice.requiresStat.min} (tienes ${statVal})`);
        }
      }

      const isEligible = isAffordable && hasEnoughEnergy && hasRequiredStat;
      const { chips, cleanedNarrative } = parseConsequences(choice.consequencesDescription || '');

      return {
        raw: choice,
        id: choice.id || `choice-${index}`,
        index,
        cleanText: sanitizeString(choice.text),
        cleanedNarrative,
        chips,
        costFunds,
        costEnergy,
        isAffordable,
        hasEnoughEnergy,
        isEligible,
        unmetReasons
      };
    });
  }, [rawChoices, player.stats.funds, player.stats.energy, player.stats, player.personality]);

  const handleSelectChoice = useCallback((choiceIndex: number) => {
    const choice = choices[choiceIndex];
    if (!choice || !choice.isEligible) {
      playSound('click');
      return;
    }

    if (choice.costFunds > 0) {
      playSound('money');
    } else {
      playSound('click');
    }

    onSelectChoice(choiceIndex);
  }, [choices, onSelectChoice]);

  return {
    context,
    description,
    choices,
    categoryMeta,
    rarityMeta,
    isCrisis,
    isBloqueoCreativo,
    temporality,
    handleSelectChoice
  };
}
