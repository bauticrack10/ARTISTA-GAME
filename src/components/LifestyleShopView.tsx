import React, { useState, useMemo } from 'react';
import { Artist, WorldState, LifestyleCategory, LifestyleItem } from '../types';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';
import {
  ShoppingBag,
  Mic,
  Radio,
  Sliders,
  Disc3,
  Home,
  Building2,
  Crown,
  Sparkles,
  Truck,
  ShieldCheck,
  Flame,
  Zap,
  GraduationCap,
  Award,
  Users,
  Heart,
  CheckCircle2,
  DollarSign,
  Info,
  TrendingUp,
  Receipt,
  Headphones,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { LIFESTYLE_THEMES } from '../utils/themeColors';
import { formatMoney } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';
import { FinancialLedger } from './FinancialLedger';

interface LifestyleShopViewProps {
  player: Artist;
  world: WorldState;
  onBuyItem: (itemId: string) => { success: boolean; message: string };
}

const CATEGORY_TABS: Array<{ id: 'all' | LifestyleCategory; label: string; iconColor?: string }> = [
  { id: 'all', label: 'Todas las Mejoras' },
  { id: 'home_studio', label: 'Home Studio & Básico', iconColor: 'text-amber-400' },
  { id: 'studio', label: 'Estudio & Micrófonos', iconColor: 'text-cyan-400' },
  { id: 'real_estate', label: 'Viviendas & Inmuebles', iconColor: 'text-emerald-400' },
  { id: 'vehicles', label: 'Vehículos & Movilidad', iconColor: 'text-rose-400' },
  { id: 'coaching', label: 'Coaching & Salud', iconColor: 'text-purple-400' }
];

export const LifestyleShopView: React.FC<LifestyleShopViewProps> = ({
  player,
  world,
  onBuyItem
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | LifestyleCategory>('all');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);
  const [showCostBreakdown, setShowCostBreakdown] = useState<boolean>(false);

  const ownedUpgrades = player.lifestyleUpgrades || [];

  // Filter items (treating 'starter' and 'home_studio' interchangeably for backward compatibility)
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return LIFESTYLE_ITEMS;
    if (activeCategory === 'home_studio' || activeCategory === ('starter' as any)) {
      return LIFESTYLE_ITEMS.filter(
        item => item.category === 'home_studio' || (item.category as string) === 'starter'
      );
    }
    return LIFESTYLE_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  // Compute active buffs
  const activeBuffs = useMemo(() => {
    const itemMap = new Map(LIFESTYLE_ITEMS.map(i => [i.id, i]));
    const result = {
      qualityBonus: 0,
      passiveEnergy: 0,
      tourFatigueReduction: 0,
      monthlyUpkeep: 0,
      hypeDecayReduction: 0,
      skillBonus: 0,
      charismaBonus: 0,
      reputationBonus: 0
    };

    for (const id of ownedUpgrades) {
      const item = itemMap.get(id);
      if (item) {
        result.monthlyUpkeep += item.monthlyUpkeep;
        if (item.effects.qualityBonus) result.qualityBonus += item.effects.qualityBonus;
        if (item.effects.passiveEnergyPerMonth) result.passiveEnergy += item.effects.passiveEnergyPerMonth;
        if (item.effects.tourFatigueReduction) result.tourFatigueReduction += item.effects.tourFatigueReduction;
        if (item.effects.hypeDecayReduction) result.hypeDecayReduction += item.effects.hypeDecayReduction;
        if (item.effects.skillBonus) result.skillBonus += item.effects.skillBonus;
        if (item.effects.charismaBonus) result.charismaBonus += item.effects.charismaBonus;
        if (item.effects.reputationBonus) result.reputationBonus += item.effects.reputationBonus;
      }
    }
    return result;
  }, [ownedUpgrades]);

  // Semi-annual operational costs calculations
  const operationalCosts = useMemo(() => {
    let monthlyBaseLiving = 35;
    const pop = player?.stats?.popularity || 0;
    if (pop > 85) monthlyBaseLiving = 28000;
    else if (pop > 70) monthlyBaseLiving = 12000;
    else if (pop > 50) monthlyBaseLiving = 3800;
    else if (pop > 30) monthlyBaseLiving = 1200;
    else if (pop > 15) monthlyBaseLiving = 400;
    else if (pop > 8) monthlyBaseLiving = 120;

    const monthlyUpkeep = activeBuffs.monthlyUpkeep;

    let monthlyManagerCommission = 0;
    if (player?.managerId && world?.managers && world.managers[player.managerId]) {
      const manager = world.managers[player.managerId];
      const estimatedGross = (player?.stats?.monthlyListeners || 0) * 0.0035 + (player?.stats?.fansCount || 0) * 0.02;
      monthlyManagerCommission = Math.floor(estimatedGross * (manager.commissionFeePct / 100));
    }

    const monthlyTotalBurn = monthlyBaseLiving + monthlyUpkeep + monthlyManagerCommission;
    const semiAnnualTotal = monthlyTotalBurn * 6;
    const semiAnnualLiving = monthlyBaseLiving * 6;
    const semiAnnualUpkeep = monthlyUpkeep * 6;
    const semiAnnualManager = monthlyManagerCommission * 6;

    const funds = player?.stats?.funds || 0;
    const runwayMonths = monthlyTotalBurn > 0 ? funds / monthlyTotalBurn : 99;

    let solvencyLevel: 'thriving' | 'stable' | 'warning' | 'critical' = 'thriving';
    let solvencyBadge = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
    let solvencyLabel = 'Solvencia Óptima';
    let solvencyMessage = 'Tus fondos actuales cubren cómodamente más de 12 meses de costos operativos fijos.';

    if (runwayMonths >= 12) {
      solvencyLevel = 'thriving';
      solvencyBadge = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      solvencyLabel = 'Solvencia Óptima (>12 meses)';
      solvencyMessage = 'Tus fondos actuales cubren cómodamente más de un año de costos operativos fijos.';
    } else if (runwayMonths >= 6) {
      solvencyLevel = 'stable';
      solvencyBadge = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40';
      solvencyLabel = 'Solvencia Estable (6-12 meses)';
      solvencyMessage = 'Cuentas con suficiente colchón para sostener el próximo semestre completo sin urgencias.';
    } else if (runwayMonths >= 3) {
      solvencyLevel = 'warning';
      solvencyBadge = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      solvencyLabel = 'Atención Requerida (3-6 meses)';
      solvencyMessage = 'Tus fondos cubren menos de un semestre de costos fijos. Considera lanzar música o salir de gira.';
    } else {
      solvencyLevel = 'critical';
      solvencyBadge = 'bg-rose-950/60 text-rose-300 border-rose-500/40';
      solvencyLabel = 'Riesgo de Insolvencia (<3 meses)';
      solvencyMessage = '¡Alerta de caja! Los costos operativos amenazan con agotar tus fondos en menos de un trimestre.';
    }

    return {
      monthlyBaseLiving,
      monthlyUpkeep,
      monthlyManagerCommission,
      monthlyTotalBurn,
      semiAnnualTotal,
      semiAnnualLiving,
      semiAnnualUpkeep,
      semiAnnualManager,
      runwayMonths,
      solvencyLevel,
      solvencyBadge,
      solvencyLabel,
      solvencyMessage
    };
  }, [player?.stats?.popularity, player?.stats?.funds, player?.stats?.monthlyListeners, player?.stats?.fansCount, player?.managerId, world?.managers, activeBuffs.monthlyUpkeep]);

  const handlePurchase = (item: LifestyleItem) => {
    const res = onBuyItem(item.id);
    if (res.success) {
      playSound('money');
    } else {
      playSound('click');
    }
    setFeedback({ text: res.message, isError: !res.success });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const getItemIcon = (iconName: string, category: LifestyleCategory) => {
    switch (iconName) {
      case 'Mic': return <Mic className="w-5 h-5 text-[#06B6D4]" />;
      case 'Radio': return <Radio className="w-5 h-5 text-[#06B6D4]" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-[#06B6D4]" />;
      case 'Disc3': return <Disc3 className="w-5 h-5 text-[#06B6D4]" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-amber-400" />;
      case 'Home': return <Home className="w-5 h-5 text-emerald-400" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-emerald-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-emerald-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Truck': return <Truck className="w-5 h-5 text-rose-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-rose-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-rose-400" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#C084FC]" />;
      case 'Award': return <Award className="w-5 h-5 text-[#C084FC]" />;
      case 'Users': return <Users className="w-5 h-5 text-[#C084FC]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#C084FC]" />;
      default: return <ShoppingBag className="w-5 h-5 text-[#8B5CF6]" />;
    }
  };

  const getCategoryLabel = (cat: LifestyleCategory) => {
    switch (cat) {
      case 'home_studio':
      case 'starter' as any:
        return 'Home Studio & Básico';
      case 'studio': return 'Estudio & Micrófonos';
      case 'real_estate': return 'Inmueble / Vivienda';
      case 'vehicles': return 'Vehículo / Gira';
      case 'coaching': return 'Coaching & Salud';
      default: return 'Mejora de Carrera';
    }
  };

  const getCategoryColorClasses = (cat: LifestyleCategory) => {
    switch (cat) {
      case 'home_studio':
      case 'starter' as any:
        return {
          accentText: 'text-amber-400',
          buffBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        };
      case 'studio':
        return {
          accentText: 'text-[#06B6D4]',
          buffBadge: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30'
        };
      case 'real_estate':
        return {
          accentText: 'text-emerald-400',
          buffBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        };
      case 'vehicles':
        return {
          accentText: 'text-rose-400',
          buffBadge: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        };
      case 'coaching':
        return {
          accentText: 'text-[#C084FC]',
          buffBadge: 'bg-purple-500/10 text-[#C084FC] border-purple-500/30'
        };
    }
  };

  return (
    <div className="space-y-8 pb-24 sm:pb-28 lg:pb-32 font-sans text-[#F8FAFC] bg-[#16181F] min-h-screen p-4 sm:p-6 lg:p-8 rounded-2xl border border-[#2A2E3D]">
      {/* Header Banner - Studio After Dark Theme with vibrant accents */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#2A2E3D] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 tracking-tight">
              Inversión & Bienestar
            </span>
            {player.isProdigy && (
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 shadow-sm">
                <Crown className="w-3 h-3 text-amber-400 fill-current" />
                Prodigio x3
              </span>
            )}
          </div>
          <h1
            className="text-3xl sm:text-4xl font-semibold tracking-[-0.9px] text-[#F8FAFC] flex items-center gap-2.5"
            style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
          >
            <ShoppingBag className="w-7 h-7 text-[#06B6D4]" />
            Tienda & Estilo de Vida
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1.5 max-w-2xl font-normal leading-relaxed">
            Invertí los fondos generados por tus lanzamientos y giras en mejoras tangibles con beneficios pasivos permanentes: calidad de estudio casero o profesional, recuperación de energía, mitigación de fatiga y prestigio.
          </p>
        </div>

        {/* Balance & Financial History Triggers */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Balance Card: FONDOS DISPONIBLES */}
          <div className="bg-[#0B0C10] border border-emerald-500/40 rounded-xl p-4 flex items-center flex-row gap-3.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <div className="p-3 bg-emerald-950/60 rounded-full text-emerald-400 border border-emerald-500/40 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] text-[#94A3B8] block font-semibold uppercase tracking-wider">
                Fondos Disponibles
              </span>
              <span className="text-2xl font-bold text-emerald-400 font-mono tracking-tight whitespace-nowrap inline-flex items-center">
                {formatMoney(player.stats.funds)}
              </span>
            </div>
          </div>

          {/* Financial Ledger Modal Button */}
          <button
            onClick={() => {
              playSound('click');
              setIsLedgerOpen(true);
            }}
            className="bg-[#0B0C10] hover:bg-[#1C1F28] border border-[#8B5CF6]/40 hover:border-[#8B5CF6] rounded-xl p-4 flex items-center gap-3 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.15)] group"
          >
            <div className="p-3 bg-[#8B5CF6]/15 rounded-full text-[#C084FC] border border-[#8B5CF6]/30 group-hover:scale-105 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#C084FC] font-bold uppercase tracking-wider">
                  Historial Financiero
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#8B5CF6]/20 text-white">
                  {player.financialLedger?.length || 0}
                </span>
              </div>
              <span className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-1">
                Ver Libro Contable
                <ChevronRight className="w-3.5 h-3.5 text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-md border text-sm font-semibold flex items-center gap-2.5 transition-all shadow-md ${
            feedback.isError
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
          }`}
        >
          {feedback.isError ? (
            <Info className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TARJETA DE COSTOS OPERATIVOS SEMESTRALES (6-MONTH OPERATING COSTS) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-[#0B0C10] to-[#13151D] border border-[#8B5CF6]/30 rounded-xl p-5 space-y-4 shadow-[0_0_20px_rgba(139,92,246,0.12)]">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2E3D] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
                  Costos Operativos Semestrales Proyectados (6 Meses)
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${operationalCosts.solvencyBadge}`}>
                  {operationalCosts.solvencyLabel}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {operationalCosts.solvencyMessage}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound('click');
                setShowCostBreakdown(!showCostBreakdown);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] text-xs font-semibold text-[#C084FC] hover:border-[#8B5CF6]/50 transition-all cursor-pointer"
            >
              {showCostBreakdown ? 'Ocultar Desglose' : 'Ver Desglose Detallado'}
            </button>

            <button
              onClick={() => {
                playSound('click');
                setIsLedgerOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/40 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5 text-[#C084FC]" />
              Auditoría
            </button>
          </div>
        </div>

        {/* Metric Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Total Semi-Annual Cost */}
          <div className="p-3.5 bg-[#16181F] border border-[#8B5CF6]/30 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-[11px] font-semibold">Costo Total (6 Meses)</span>
              <span className="text-[10px] font-mono text-[#C084FC]">Burn Rate</span>
            </div>
            <div className="text-lg font-bold text-rose-400 font-mono">
              {formatMoney(operationalCosts.semiAnnualTotal)}
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono block">
              {formatMoney(operationalCosts.monthlyTotalBurn)} / mes promedio
            </span>
          </div>

          {/* Living Cost Semi-Annual */}
          <div className="p-3.5 bg-[#16181F] border border-[#2A2E3D] rounded-lg space-y-1">
            <span className="text-[#94A3B8] block text-[11px] font-semibold">Costo de Vida Base</span>
            <div className="text-lg font-bold text-[#F8FAFC] font-mono">
              {formatMoney(operationalCosts.semiAnnualLiving)}
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono block">
              {`${formatMoney(operationalCosts.monthlyBaseLiving)}/mes (Vivienda & Crew)`}
            </span>
          </div>

          {/* Upkeep Semi-Annual */}
          <div className="p-3.5 bg-[#16181F] border border-[#2A2E3D] rounded-lg space-y-1">
            <span className="text-[#94A3B8] block text-[11px] font-semibold">Mantenimiento Equipos</span>
            <div className="text-lg font-bold text-[#F8FAFC] font-mono">
              {formatMoney(operationalCosts.semiAnnualUpkeep)}
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono block">
              {`${formatMoney(operationalCosts.monthlyUpkeep)}/mes (${ownedUpgrades.length} activos)`}
            </span>
          </div>

          {/* Runway Coverage */}
          <div className="p-3.5 bg-[#16181F] border border-emerald-500/30 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-[11px] font-semibold">Cobertura / Runway</span>
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {operationalCosts.runwayMonths >= 99 ? '∞ Meses' : `${operationalCosts.runwayMonths.toFixed(1)} meses`}
            </div>
            <span className="text-[10px] text-emerald-500/80 font-mono block">
              {`Con saldo actual de ${formatMoney(player.stats.funds)}`}
            </span>
          </div>
        </div>

        {/* Expandable Detailed Breakdown */}
        {showCostBreakdown && (
          <div className="p-4 bg-[#0B0C10] border border-[#2A2E3D] rounded-lg space-y-3 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-2">
              <span className="font-bold text-[#F8FAFC] uppercase tracking-wider text-[11px]">
                Desglose Fijo Mensual vs. Proyección Semestral
              </span>
              <span className="text-[11px] text-[#94A3B8] font-mono">
                Popularidad del Artista: {player.stats.popularity}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#16181F] border border-[#2A2E3D] space-y-1">
                <div className="text-[#94A3B8] font-semibold text-[11px]">1. Gastos de Vida & Equipo Personal</div>
                <div className="font-mono text-[#F8FAFC]">
                  Mensual: <strong className="text-rose-300">{formatMoney(operationalCosts.monthlyBaseLiving)}</strong>
                </div>
                <div className="font-mono text-[#94A3B8] text-[11px]">
                  Semestral: {formatMoney(operationalCosts.semiAnnualLiving)}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#16181F] border border-[#2A2E3D] space-y-1">
                <div className="text-[#94A3B8] font-semibold text-[11px]">2. Mantenimiento de Mejoras & Bienes</div>
                <div className="font-mono text-[#F8FAFC]">
                  Mensual: <strong className="text-rose-300">{formatMoney(operationalCosts.monthlyUpkeep)}</strong>
                </div>
                <div className="font-mono text-[#94A3B8] text-[11px]">
                  Semestral: {formatMoney(operationalCosts.semiAnnualUpkeep)}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#16181F] border border-[#2A2E3D] space-y-1">
                <div className="text-[#94A3B8] font-semibold text-[11px]">3. Comisión Estimada de Manager</div>
                <div className="font-mono text-[#F8FAFC]">
                  Mensual: <strong className="text-rose-300">{formatMoney(operationalCosts.monthlyManagerCommission)}</strong>
                </div>
                <div className="font-mono text-[#94A3B8] text-[11px]">
                  Semestral: {formatMoney(operationalCosts.semiAnnualManager)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Buffs Summary Bar with Rich Palette */}
      <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-xl p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
            Resumen de Buffs Pasivos Activos ({ownedUpgrades.length} Adquiridos)
          </h2>
          <span className="text-xs text-[#94A3B8] font-mono">
            Mantenimiento Total: <strong className="text-rose-400 font-bold">${activeBuffs.monthlyUpkeep.toLocaleString()}/mes</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-lg space-y-1">
            <span className="text-[#06B6D4] block text-[11px] font-semibold">Bono de Calidad</span>
            <span className="text-base font-bold text-[#06B6D4] font-mono">
              {`+${activeBuffs.qualityBonus} Calidad`}
            </span>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg space-y-1">
            <span className="text-emerald-300 block text-[11px] font-semibold">Energía Pasiva</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {`+${activeBuffs.passiveEnergy}/mes`}
            </span>
          </div>

          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg space-y-1">
            <span className="text-rose-300 block text-[11px] font-semibold">Mitigación de Gira</span>
            <span className="text-base font-bold text-rose-400 font-mono">
              {Math.round(activeBuffs.tourFatigueReduction * 100) > 0
                ? `-${Math.round(activeBuffs.tourFatigueReduction * 100)}% Fatiga`
                : '0% Fatiga'}
            </span>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-1">
            <span className="text-amber-300 block text-[11px] font-semibold">Estabilidad de Hype</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {`+${Math.round(activeBuffs.hypeDecayReduction * 100)}% Retención`}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map(tab => {
          const isActive = activeCategory === tab.id;
          const activeClasses: Record<string, string> = {
            all: 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)] border-transparent',
            home_studio: 'bg-amber-500/25 border border-amber-400 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]',
            studio: 'bg-[#06B6D4]/25 border border-[#06B6D4] text-[#06B6D4] font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]',
            real_estate: 'bg-emerald-500/25 border border-emerald-400 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]',
            vehicles: 'bg-rose-500/25 border border-rose-400 text-rose-300 font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]',
            coaching: 'bg-purple-500/25 border border-purple-400 text-[#C084FC] font-bold shadow-[0_0_12px_rgba(139,92,246,0.3)]'
          };
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveCategory(tab.id);
              }}
              className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? activeClasses[tab.id] || activeClasses.all
                  : 'bg-[#0B0C10] text-[#94A3B8] border-[#2A2E3D] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid with Categorized Themes & Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-16">
        {filteredItems.map(item => {
          const isOwned = ownedUpgrades.includes(item.id);
          const canAfford = player.stats.funds >= item.price;
          const colorClasses = getCategoryColorClasses(item.category);

          const categoryBorderLeft: Record<string, string> = {
            home_studio: 'border-l-4 border-l-amber-400',
            starter: 'border-l-4 border-l-amber-400',
            studio: 'border-l-4 border-l-[#06B6D4]',
            real_estate: 'border-l-4 border-l-emerald-400',
            vehicles: 'border-l-4 border-l-rose-500',
            coaching: 'border-l-4 border-l-[#8B5CF6]'
          };

          return (
            <div
              key={item.id}
              className={`bg-[#0B0C10] border rounded-xl p-5 flex flex-col justify-between transition-all shadow-md hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] ${categoryBorderLeft[item.category] || ''} ${
                isOwned
                  ? 'border-emerald-500/50 ring-1 ring-emerald-500/40'
                  : 'border-[#2A2E3D] hover:border-[#8B5CF6]/50'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top: Icon, Title & Category */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg shrink-0 bg-[#16181F] border border-[#2A2E3D]">
                      {getItemIcon(item.iconName, item.category)}
                    </div>
                    <div>
                      <h3
                        className="text-base font-semibold text-[#F8FAFC] tracking-normal leading-snug"
                        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
                      >
                        {item.name}
                      </h3>
                      <span className={`text-[11px] font-semibold block mt-0.5 ${colorClasses.accentText}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>

                  {isOwned && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      En Posesión
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[#94A3B8] font-normal leading-relaxed">
                  {item.description}
                </p>

                {/* Passive Buff Pill */}
                <div className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${colorClasses.buffBadge}`}>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.buffDescription}</span>
                </div>
              </div>

              {/* Card Footer: Cost & Action Button */}
              <div className="mt-5 pt-4 border-t border-[#2A2E3D] flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold text-[#F8FAFC] font-mono tracking-tight whitespace-nowrap">
                    {formatMoney(item.price)}
                  </div>
                  <span className="text-[11px] text-[#94A3B8] font-mono block truncate">
                    {item.monthlyUpkeep > 0 ? `+${formatMoney(item.monthlyUpkeep)}/mes` : 'Sin costo mensual'}
                  </span>
                </div>

                <div className="shrink-0">
                  {isOwned ? (
                    <button
                      disabled
                      className="h-10 min-h-[40px] px-4 rounded-[6px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 text-xs font-bold cursor-not-allowed flex items-center justify-center whitespace-nowrap shrink-0"
                    >
                      Adquirido ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`h-10 min-h-[40px] px-4 text-xs font-bold rounded-[6px] transition-all flex items-center justify-center whitespace-nowrap shrink-0 ${
                        canAfford
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:opacity-95 active:opacity-85 cursor-pointer'
                          : 'bg-[#16181F] text-[#64748B] border border-[#2A2E3D] cursor-not-allowed opacity-60'
                      }`}
                    >
                      {canAfford ? 'Comprar Mejora' : 'Fondos Insuficientes'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Ledger Modal */}
      <FinancialLedger
        player={player}
        world={world}
        isModal={true}
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
      />
    </div>
  );
};
