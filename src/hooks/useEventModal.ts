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
  Disc3,
  Headphones,
  LucideIcon
} from 'lucide-react';

export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export type ImpactChipType = 'positive' | 'negative' | 'neutral' | 'energy' | 'money' | 'hype' | 'fans' | 'reputation' | 'streams' | 'listeners';

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
  hasRisk: boolean;
  riskWarning?: string;
  riskSeverity?: 'warning' | 'danger';
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

export interface ImportanceLevelMeta {
  level: number;
  label: string;
  badgeText: string;
  categoryTier: 'minor' | 'major' | 'critical';
  badgeClass: string;
  glowClass: string;
  dotColor: string;
  isPulse: boolean;
}

export interface AffectedSystemChip {
  id: string;
  name: string;
  icon: LucideIcon;
  badgeClass: string;
  iconColor: string;
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
  importanceLevel: number;
  importanceMeta: ImportanceLevelMeta;
  affectedSystems: AffectedSystemChip[];
  isCrisis: boolean;
  isBloqueoCreativo: boolean;
  temporality: ContextualTemporality;
  handleSelectChoice: (choiceIndex: number) => void;
}

export const SYSTEM_DEFINITIONS: Record<string, { icon: LucideIcon; badgeClass: string; iconColor: string; name: string }> = {
  'Fondos': {
    icon: DollarSign,
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    name: 'Fondos'
  },
  'funds': {
    icon: DollarSign,
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    name: 'Fondos'
  },
  'Energía': {
    icon: Zap,
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    iconColor: 'text-amber-400',
    name: 'Energía'
  },
  'energy': {
    icon: Zap,
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    iconColor: 'text-amber-400',
    name: 'Energía'
  },
  'Hype': {
    icon: Flame,
    badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    iconColor: 'text-orange-400',
    name: 'Hype'
  },
  'hype': {
    icon: Flame,
    badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    iconColor: 'text-orange-400',
    name: 'Hype'
  },
  'Fans': {
    icon: Users,
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    name: 'Fans'
  },
  'fans': {
    icon: Users,
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    name: 'Fans'
  },
  'Reputación': {
    icon: Sparkles,
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    iconColor: 'text-purple-400',
    name: 'Reputación'
  },
  'reputation': {
    icon: Sparkles,
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    iconColor: 'text-purple-400',
    name: 'Reputación'
  },
  'Credibilidad': {
    icon: Award,
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    iconColor: 'text-indigo-400',
    name: 'Credibilidad'
  },
  'credibility': {
    icon: Award,
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    iconColor: 'text-indigo-400',
    name: 'Credibilidad'
  },
  'Contratos': {
    icon: Building2,
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    iconColor: 'text-blue-400',
    name: 'Contratos'
  },
  'contracts': {
    icon: Building2,
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    iconColor: 'text-blue-400',
    name: 'Contratos'
  },
  'relationships': {
    icon: Handshake,
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    iconColor: 'text-blue-400',
    name: 'Vínculos'
  },
  'Vínculos': {
    icon: Handshake,
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    iconColor: 'text-blue-400',
    name: 'Vínculos'
  },
  'Giras': {
    icon: Volume2,
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    iconColor: 'text-rose-400',
    name: 'Giras'
  },
  'tours': {
    icon: Volume2,
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    iconColor: 'text-rose-400',
    name: 'Giras'
  },
  'Charts': {
    icon: BarChart3,
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    iconColor: 'text-teal-400',
    name: 'Charts'
  },
  'charts': {
    icon: BarChart3,
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    iconColor: 'text-teal-400',
    name: 'Charts'
  },
  'Carrera': {
    icon: TrendingUp,
    badgeClass: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
    iconColor: 'text-fuchsia-400',
    name: 'Carrera'
  },
  'career': {
    icon: TrendingUp,
    badgeClass: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
    iconColor: 'text-fuchsia-400',
    name: 'Carrera'
  }
};

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
  if (/^[+-]\s*(\$?[0-9,.]+|[0-9]+%|[A-Za-zÁ-ÿ])/i.test(trimmed)) return true;
  // Has currency like "-$600" or "$150 Fondos"
  if (/\$[0-9,.]+/.test(trimmed) && /fondos|pagar|costo|adelanto/i.test(trimmed)) return true;
  // Common stat keywords with numbers or indicators
  if (/^[+-]?\s*(?:Hype|Energía|Popularidad|Fans|Reputación|Credibilidad|Oyentes|Streams|Reproducciones|Calidad|Habilidad|Relación|Meme viral)/i.test(trimmed)) return true;
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

      if (part.includes('+') || lower.includes('aumenta') || lower.includes('éxito') || lower.includes('gana') || lower.includes('auge') || lower.includes('inmediato')) {
        type = 'positive';
      }
      if (part.includes('-') || lower.includes('reduce') || lower.includes('pierde') || lower.includes('caída') || lower.includes('riesgo')) {
        type = 'negative';
      }

      if (part.includes('$') || lower.includes('fondos') || lower.includes('costas') || lower.includes('adelanto')) {
        type = 'money';
        icon = DollarSign;
      } else if (lower.includes('energía') || lower.includes('fatiga')) {
        type = 'energy';
        icon = Zap;
      } else if (lower.includes('stream') || lower.includes('reproduccion') || lower.includes('reproducción')) {
        type = 'streams';
        icon = Disc3;
      } else if (lower.includes('oyente')) {
        type = 'listeners';
        icon = Headphones;
      } else if (lower.includes('hype') || lower.includes('viral')) {
        type = 'hype';
        icon = Flame;
      } else if (lower.includes('fan')) {
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
 * Detects risk warnings for an event choice (legal demand, loss of masters, breach of contract, tour cancellation, health damage, etc.)
 */
function detectRiskWarning(choice: EventChoice, playerFunds: number): { hasRisk: boolean; riskWarning?: string; riskSeverity?: 'warning' | 'danger' } {
  if (choice.riskWarning) {
    return {
      hasRisk: true,
      riskWarning: choice.riskWarning,
      riskSeverity: /cr[íi]tico|demanda|m[áa]ster|salud|quiebra/i.test(choice.riskWarning) ? 'danger' : 'warning'
    };
  }

  const text = `${choice.text} ${choice.consequencesDescription || ''}`.toLowerCase();

  // 1. Demanda / Litigio legal
  if (/demanda|abogado|juicio|litigio|tribunal|penalizaci[óo]n legal|indemnizaci[óo]n|carta documento|intimaci[óo]n/i.test(text)) {
    return {
      hasRisk: true,
      riskWarning: 'Riesgo Legal: Posible demanda o litigio judicial',
      riskSeverity: 'danger'
    };
  }

  // 2. Pérdida de másters / Propiedad intelectual
  if (/p[ée]rdida de m[áa]sters?|perder m[áa]sters?|ceder m[áa]sters?|derechos de autor|propiedad intelectual|perder derechos/i.test(text)) {
    return {
      hasRisk: true,
      riskWarning: 'Riesgo Crítico: Pérdida definitiva de másters y derechos',
      riskSeverity: 'danger'
    };
  }

  // 3. Ruptura de contrato / Penalidad contractual
  if (/ruptura de contrato|rescisi[óo]n|cancelar contrato|penalidad contractual|incumplimiento contractual|perder contrato|multa discogr[áa]fica/i.test(text)) {
    return {
      hasRisk: true,
      riskWarning: 'Riesgo Contractual: Ruptura o penalidad de contrato',
      riskSeverity: 'danger'
    };
  }

  // 4. Daño a la salud / Burnout / Colapso
  if (/da[ñn]o a la salud|hospitalizaci[óo]n|burnout|fatiga extrema|colapso|adicci[óo]n|desgaste mental|crisis nerviosa|sobredosis|lesi[óo]n vocal/i.test(text)) {
    return {
      hasRisk: true,
      riskWarning: 'Riesgo de Salud: Fatiga extrema o colapso físico',
      riskSeverity: 'danger'
    };
  }

  // 5. Cancelación de gira / Shows
  if (/cancelaci[óo]n de gira|suspensi[óo]n de show|cancelar concierto|cancelar gira|suspender fechas|clausura de show/i.test(text)) {
    return {
      hasRisk: true,
      riskWarning: 'Riesgo de Gira: Cancelación o suspensión de fechas',
      riskSeverity: 'warning'
    };
  }

  // 6. Boicot / Funa / Escándalo masivo
  if (/cancelaci[óo]n masiva|funa|destrucci[óo]n de imagen|esc[áa]ndalo p[úu]blico|boicot|veto en radios/i.test(text)) {
    return {
      hasRisk: true,
      riskWarning: 'Riesgo de Imagen: Boicot o controversia pública',
      riskSeverity: 'warning'
    };
  }

  // 7. Severo impacto financiero (costo mayor al 50% de fondos o quiebra)
  if (choice.costFunds && choice.costFunds > Math.max(1000, playerFunds * 0.5)) {
    return {
      hasRisk: true,
      riskWarning: 'Alto Riesgo Financiero: Drenaje severo de fondos',
      riskSeverity: 'warning'
    };
  }

  return { hasRisk: false };
}

/**
 * Calculates numeric importance level (1 to 5)
 */
function calculateImportanceLevel(
  event: EventDefinition,
  isCrisis: boolean,
  isBloqueoCreativo: boolean,
  description: string
): number {
  if (typeof event.importanceLevel === 'number' && event.importanceLevel >= 1 && event.importanceLevel <= 5) {
    return Math.round(event.importanceLevel);
  }

  if (isCrisis || isBloqueoCreativo) {
    return 5;
  }

  if (event.category === 'crisis' || event.category === 'scandal' || event.rarity === 'crisis') {
    return 5;
  }

  if (event.rarity === 'legendary') {
    return 5;
  }

  const text = `${event.title} ${description}`.toLowerCase();
  if (/quiebra|demanda millonaria|hospitalizaci[óo]n|esc[áa]ndalo nacional|juicio|allanamiento|urgencia cr[íi]tica/i.test(text)) {
    return 5;
  }

  if (event.category === 'awards' || /grammy|premio|estadio|disco de diamante|platino global/i.test(text)) {
    return 4;
  }

  if (event.rarity === 'rare' || event.category === 'industry' || event.category === 'shows') {
    return 3;
  }

  if (event.rarity === 'uncommon') {
    return 2;
  }

  return 1;
}

/**
 * Generates visual metadata for importance level (1 to 5)
 */
function getImportanceMeta(
  level: number,
  isCrisis: boolean,
  isBloqueoCreativo: boolean,
  rarity: string
): ImportanceLevelMeta {
  switch (level) {
    case 5: {
      const isCriticalCrisis = isCrisis || isBloqueoCreativo || rarity === 'crisis';
      const label = isCriticalCrisis ? 'Crisis Crítica' : 'Hito Histórico';
      const badgeText = isCriticalCrisis ? 'NIVEL 5 • CRISIS CRÍTICA' : 'NIVEL 5 • HITO HISTÓRICO';
      return {
        level: 5,
        label,
        badgeText,
        categoryTier: 'critical',
        badgeClass: 'bg-rose-600/25 text-rose-200 border-rose-500/60 shadow-[0_0_18px_rgba(225,29,72,0.45)]',
        glowClass: 'from-rose-600/35 via-rose-900/10 to-transparent',
        dotColor: 'bg-rose-500',
        isPulse: true
      };
    }
    case 4:
      return {
        level: 4,
        label: 'Suceso Mayor',
        badgeText: 'NIVEL 4 • SUCESO MAYOR',
        categoryTier: 'major',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/45 shadow-[0_0_14px_rgba(245,158,11,0.25)]',
        glowClass: 'from-amber-500/25 via-transparent to-transparent',
        dotColor: 'bg-amber-400',
        isPulse: false
      };
    case 3:
      return {
        level: 3,
        label: 'Impacto de Industria',
        badgeText: 'NIVEL 3 • IMPACTO DE INDUSTRIA',
        categoryTier: 'major',
        badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
        glowClass: 'from-purple-500/20 via-transparent to-transparent',
        dotColor: 'bg-purple-400',
        isPulse: false
      };
    case 2:
      return {
        level: 2,
        label: 'Incidente Local',
        badgeText: 'NIVEL 2 • INCIDENTE LOCAL',
        categoryTier: 'minor',
        badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
        glowClass: 'from-sky-500/15 via-transparent to-transparent',
        dotColor: 'bg-sky-400',
        isPulse: false
      };
    case 1:
    default:
      return {
        level: 1,
        label: 'Incidente Menor',
        badgeText: 'NIVEL 1 • INCIDENTE MENOR',
        categoryTier: 'minor',
        badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
        glowClass: 'from-slate-500/10 via-transparent to-transparent',
        dotColor: 'bg-slate-400',
        isPulse: false
      };
  }
}

/**
 * Detects affected game systems (Fondos, Energía, Hype, Fans, Reputación, Credibilidad, Contratos, Giras, Charts, Carrera)
 */
function detectAffectedSystems(
  event: EventDefinition,
  description: string,
  rawChoices: EventChoice[]
): string[] {
  if (Array.isArray(event.affectedSystems) && event.affectedSystems.length > 0) {
    return event.affectedSystems.filter(sys => SYSTEM_DEFINITIONS[sys]);
  }

  const detected = new Set<string>();
  const combinedText = `${event.title} ${event.category} ${description} ${rawChoices.map(c => `${c.text} ${c.consequencesDescription || ''}`).join(' ')}`.toLowerCase();

  // Direct choice costs
  for (const choice of rawChoices) {
    if (typeof choice.costFunds === 'number' && choice.costFunds > 0) detected.add('Fondos');
    if (typeof choice.costEnergy === 'number' && choice.costEnergy > 0) detected.add('Energía');
  }

  // Keywords detection
  if (/fondos|dinero|d[óo]lares|\$|adelanto|pago|costo|invertir|presupuesto|compra|venta|multa|regal[íi]as|cobro/i.test(combinedText)) {
    detected.add('Fondos');
  }
  if (/energ[íi]a|cansancio|fatiga|descanso|estr[ée]s|agotamiento|salud|burnout|colapso/i.test(combinedText)) {
    detected.add('Energía');
  }
  if (/hype|viral|tendencia|redes|pol[ée]mica|impacto|rumor|funa|noticia/i.test(combinedText)) {
    detected.add('Hype');
  }
  if (/fan|oyente|seguidor|p[úu]blico|comunidad|fan[áa]tico|fidelidad/i.test(combinedText)) {
    detected.add('Fans');
  }
  if (/reputaci[óo]n|imagen|respeto|escena|prestigio|nombre|esc[áa]ndalo|prensa/i.test(combinedText)) {
    detected.add('Reputación');
  }
  if (/credibilidad|art[íi]stica|calidad|letrista|autenticidad|composici[óo]n|grabaci[óo]n|estudio/i.test(combinedText)) {
    detected.add('Credibilidad');
  }
  if (/contrato|discogr[áa]fica|sello|m[áa]ster|cl[áa]usula|fichaje|distribuci[óo]n|editorial|abogado|manager/i.test(combinedText) || event.category === 'industry') {
    detected.add('Contratos');
  }
  if (/gira|show|concierto|escenario|festival|recital|estadio|club|tickets|entradas|en vivo/i.test(combinedText) || event.category === 'shows') {
    detected.add('Giras');
  }
  if (/chart|top|ranking|n[°º]\s*1|puesto|billboard|spotify|hit|streaming/i.test(combinedText)) {
    detected.add('Charts');
  }
  if (/carrera|etapa|legado|hito|consagraci[óo]n|proyecci[óo]n|futuro|era/i.test(combinedText) || event.category === 'career') {
    detected.add('Carrera');
  }

  // Fallback defaults based on category
  if (detected.size === 0) {
    switch (event.category) {
      case 'career':
        detected.add('Carrera');
        detected.add('Reputación');
        break;
      case 'music':
        detected.add('Credibilidad');
        detected.add('Hype');
        break;
      case 'industry':
        detected.add('Contratos');
        detected.add('Fondos');
        break;
      case 'shows':
        detected.add('Giras');
        detected.add('Energía');
        break;
      case 'relationships':
      case 'media':
        detected.add('Hype');
        detected.add('Reputación');
        break;
      case 'awards':
        detected.add('Reputación');
        detected.add('Charts');
        break;
      case 'crisis':
      case 'scandal':
      case 'rivalry':
        detected.add('Reputación');
        detected.add('Hype');
        break;
      default:
        detected.add('Carrera');
    }
  }

  return Array.from(detected);
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
    if (Array.isArray(event.choices)) return event.choices;
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

  // Calculate Importance Level (1-5) and Metadata
  const importanceLevel = useMemo(() => {
    return calculateImportanceLevel(event, isCrisis, isBloqueoCreativo, description);
  }, [event, isCrisis, isBloqueoCreativo, description]);

  const importanceMeta = useMemo(() => {
    return getImportanceMeta(importanceLevel, isCrisis, isBloqueoCreativo, event.rarity);
  }, [importanceLevel, isCrisis, isBloqueoCreativo, event.rarity]);

  // Calculate Affected Systems Chips
  const affectedSystems: AffectedSystemChip[] = useMemo(() => {
    const rawSystems = detectAffectedSystems(event, description, rawChoices);
    const seenNames = new Set<string>();
    const result: AffectedSystemChip[] = [];

    for (const sysName of rawSystems) {
      const def = SYSTEM_DEFINITIONS[sysName];
      if (!def) continue;
      const displayName = def.name || sysName;
      if (seenNames.has(displayName)) continue;
      seenNames.add(displayName);

      result.push({
        id: `sys-${displayName.toLowerCase()}`,
        name: displayName,
        icon: def.icon,
        badgeClass: def.badgeClass,
        iconColor: def.iconColor
      });
    }

    return result;
  }, [event, description, rawChoices]);

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
      badge: `Año ${year} • ${monthName} • Mes ${month}/12`,
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

      const playerFunds = player?.stats?.funds ?? 0;
      const playerEnergy = player?.stats?.energy ?? 100;

      const isAffordable = playerFunds >= costFunds;
      const hasEnoughEnergy = playerEnergy >= costEnergy;

      let hasRequiredStat = true;
      const unmetReasons: string[] = [];

      if (!isAffordable && costFunds > 0) {
        unmetReasons.push(`Fondos insuficientes: Requiere ${formatMoney(costFunds)} • Disponibles: ${formatMoney(playerFunds)}`);
      }

      if (!hasEnoughEnergy && costEnergy > 0) {
        unmetReasons.push(`Energía insuficiente: Requiere ${costEnergy}% • Disponibles: ${playerEnergy}%`);
      }

      if (choice.requiresStat) {
        const statKey = choice.requiresStat.stat;
        const statVal = (player?.stats as any)?.[statKey] ?? (player?.personality as any)?.[statKey] ?? 0;
        if (statVal < choice.requiresStat.min) {
          hasRequiredStat = false;
          unmetReasons.push(`Requiere ${String(statKey)} ≥ ${choice.requiresStat.min} • Nivel actual: ${statVal}`);
        }
      }

      const isEligible = isAffordable && hasEnoughEnergy && hasRequiredStat;
      const { chips, cleanedNarrative } = parseConsequences(choice.consequencesDescription || '');
      const { hasRisk, riskWarning, riskSeverity } = detectRiskWarning(choice, player.stats.funds);

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
        unmetReasons,
        hasRisk,
        riskWarning,
        riskSeverity
      };
    });
  }, [rawChoices, player?.stats?.funds, player?.stats?.energy, player?.stats, player?.personality]);

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
    importanceLevel,
    importanceMeta,
    affectedSystems,
    isCrisis,
    isBloqueoCreativo,
    temporality,
    handleSelectChoice
  };
}
