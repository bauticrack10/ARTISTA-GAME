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
  Palette,
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
  Wallet,
  ChevronRight,
  Music2,
  Target
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';
import { FinancialLedger } from './FinancialLedger';

interface LifestyleShopViewProps {
  player: Artist;
  world: WorldState;
  onBuyItem: (itemId: string) => { success: boolean; message: string };
}

const CATEGORY_TABS: Array<{ id: 'all' | LifestyleCategory; label: string }> = [
  { id: 'all', label: 'Todas las Mejoras' },
  { id: 'home_studio', label: 'Home Studio & Básico' },
  { id: 'studio', label: 'Estudio & Micrófonos' },
  { id: 'real_estate', label: 'Viviendas & Inmuebles' },
  { id: 'vehicles', label: 'Vehículos & Movilidad' },
  { id: 'coaching', label: 'Coaching & Salud' }
];

export const LifestyleShopView: React.FC<LifestyleShopViewProps> = ({
  player,
  world,
  onBuyItem
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | LifestyleCategory>('all');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);

  const ownedUpgrades = player.lifestyleUpgrades || [];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return LIFESTYLE_ITEMS;
    if (activeCategory === 'home_studio' || activeCategory === ('starter' as any)) {
      return LIFESTYLE_ITEMS.filter(
        item => item.category === 'home_studio' || (item.category as string) === 'starter'
      );
    }
    return LIFESTYLE_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const activeBuffs = useMemo(() => {
    const itemMap = new Map(LIFESTYLE_ITEMS.map(i => [i.id, i]));
    const result = {
      qualityBonus: 0,
      passiveEnergy: 0,
      tourFatigueReduction: 0,
      monthlyUpkeep: 0,
      hypeDecayReduction: 0,
      skillBonus: 0,
      creativityBonus: 0,
      charismaBonus: 0,
      disciplineBonus: 0,
      reputationBonus: 0,
      commercialAppealBonus: 0,
      originalityBonus: 0
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
        if (item.effects.creativityBonus) result.creativityBonus += item.effects.creativityBonus;
        if (item.effects.charismaBonus) result.charismaBonus += item.effects.charismaBonus;
        if (item.effects.disciplineBonus) result.disciplineBonus += item.effects.disciplineBonus;
        if (item.effects.reputationBonus) result.reputationBonus += item.effects.reputationBonus;
        if (item.effects.commercialAppealBonus) result.commercialAppealBonus += item.effects.commercialAppealBonus;
        if (item.effects.originalityBonus) result.originalityBonus += item.effects.originalityBonus;
      }
    }
    return result;
  }, [ownedUpgrades]);

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
    const funds = Math.max(0, player?.stats?.funds || 0);
    const runwayMonths = monthlyTotalBurn > 0 ? Math.max(0, funds / monthlyTotalBurn) : 99;

    let solvencyBadge = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
    let solvencyLabel = 'Solvencia Óptima (>12m)';

    if (runwayMonths >= 12) {
      solvencyBadge = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
      solvencyLabel = 'Solvencia Óptima (>12m)';
    } else if (runwayMonths >= 6) {
      solvencyBadge = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
      solvencyLabel = 'Solvencia Estable (6-12m)';
    } else if (runwayMonths >= 3) {
      solvencyBadge = 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30';
      solvencyLabel = 'Atención (3-6m)';
    } else {
      solvencyBadge = 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30';
      solvencyLabel = 'Riesgo (<3m)';
    }

    return {
      monthlyBaseLiving,
      monthlyUpkeep,
      monthlyManagerCommission,
      monthlyTotalBurn,
      semiAnnualTotal,
      runwayMonths,
      solvencyBadge,
      solvencyLabel
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

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mic': return <Mic className="w-5 h-5 text-[#F4F0EA]" strokeWidth={1.75} />;
      case 'Radio': return <Radio className="w-5 h-5 text-[#F4F0EA]" strokeWidth={1.75} />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-[#F4F0EA]" strokeWidth={1.75} />;
      case 'Disc3': return <Disc3 className="w-5 h-5 text-[#F4F0EA]" strokeWidth={1.75} />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.75} />;
      case 'Home': return <Home className="w-5 h-5 text-[#10B981]" strokeWidth={1.75} />;
      case 'Building2': return <Building2 className="w-5 h-5 text-[#10B981]" strokeWidth={1.75} />;
      case 'Crown': return <Crown className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.75} />;
      case 'Truck': return <Truck className="w-5 h-5 text-[#FF2A4B]" strokeWidth={1.75} />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-[#FF2A4B]" strokeWidth={1.75} />;
      case 'Flame': return <Flame className="w-5 h-5 text-[#FF2A4B]" strokeWidth={1.75} />;
      case 'Zap': return <Zap className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.75} />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.75} />;
      case 'Award': return <Award className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.75} />;
      case 'Users': return <Users className="w-5 h-5 text-[#F4F0EA]" strokeWidth={1.75} />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#FF2A4B]" strokeWidth={1.75} />;
      default: return <ShoppingBag className="w-5 h-5 text-[#FF2A4B]" strokeWidth={1.75} />;
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
          accentText: 'text-[#F59E0B]',
          buffBadge: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
        };
      case 'studio':
        return {
          accentText: 'text-[#F4F0EA]',
          buffBadge: 'bg-[#1C1C21] text-[#F4F0EA] border-[#3F3F46]'
        };
      case 'real_estate':
        return {
          accentText: 'text-[#10B981]',
          buffBadge: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
        };
      case 'vehicles':
        return {
          accentText: 'text-[#FF2A4B]',
          buffBadge: 'bg-[#FF2A4B]/10 text-[#FF2A4B] border-[#FF2A4B]/30'
        };
      case 'coaching':
        return {
          accentText: 'text-[#F59E0B]',
          buffBadge: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
        };
    }
  };

  return (
    <div className="space-y-5 pb-20 font-sans text-[#F4F0EA] min-h-screen">
      {/* Header + Unified Compact Financial & Buffs Strip */}
      <div className="liquid-glass-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-[4px] text-2xs font-bold liquid-glass-pill text-[#8E8E99] tracking-wider uppercase">
                Equipamiento & Activos
              </span>
              {player.isProdigy && (
                <span className="px-2 py-0.5 rounded-[4px] text-2xs font-bold liquid-glass-pill text-[#F59E0B] border border-[#F59E0B]/40 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#F59E0B]" strokeWidth={1.75} />
                  Prodigio x3
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-[#F4F0EA] flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-[#FF4F00]" strokeWidth={1.75} />
              Tienda & Estilo de Vida
            </h1>
          </div>

          {/* Available Funds & Financial Ledger Trigger */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="liquid-glass-subcard px-4 py-2.5 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-[#10B981]" strokeWidth={1.75} />
              <div>
                <span className="text-2xs text-[#8E8E99] block font-bold uppercase tracking-wider">
                  Fondos Disponibles
                </span>
                <span className="text-lg font-bold text-[#10B981] tabular-nums">
                  {formatMoney(player.stats.funds)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setIsLedgerOpen(true);
              }}
              className="bg-[#1C1C21] hover:bg-[#26262B] border border-[#26262B] hover:border-[#3F3F46] rounded-[4px] px-4 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-[#FF2A4B]" strokeWidth={1.75} />
              <div className="text-left">
                <span className="text-2xs text-[#8E8E99] block uppercase font-bold tracking-wider">
                  Libro Contable ({player.financialLedger?.length || 0})
                </span>
                <span className="text-xs font-bold text-[#F4F0EA] flex items-center gap-1">
                  Ver Finanzas <ChevronRight className="w-3.5 h-3.5 text-[#FF2A4B]" strokeWidth={1.75} />
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Compact Unified Bar: Operating Costs + Solvency + Active Buffs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          {/* Costs & Solvency */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] tabular-nums">
              <Wallet className="w-3.5 h-3.5 text-[#EF4444]" strokeWidth={1.75} />
              <span className="text-[#8E8E99]">Gasto Fijo:</span>
              <strong className="text-[#EF4444]">{formatMoney(operationalCosts.monthlyTotalBurn)}/mes</strong>
              <span className="text-[#52525B]">•</span>
              <span className="text-[#8E8E99]">{formatMoney(operationalCosts.semiAnnualTotal)}/semestre</span>
            </div>

            <span className={`px-2.5 py-1.5 rounded-[4px] font-bold border tabular-nums ${operationalCosts.solvencyBadge}`}>
              {operationalCosts.solvencyLabel} • {operationalCosts.runwayMonths >= 99 ? '∞' : `${operationalCosts.runwayMonths.toFixed(1)}m`}
            </span>
          </div>

          {/* Active Buffs Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xs uppercase font-bold tracking-wider text-[#52525B] flex items-center gap-1 mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF2A4B]" strokeWidth={1.75} />
              Buffs ({ownedUpgrades.length}):
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] text-[#10B981] font-bold tabular-nums">
              +{activeBuffs.qualityBonus} Calidad
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] text-[#10B981] font-bold tabular-nums">
              +{activeBuffs.passiveEnergy} Energía/mes
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] text-[#F59E0B] font-bold tabular-nums">
              -{Math.round(activeBuffs.tourFatigueReduction * 100)}% Fatiga
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] text-[#F4F0EA] font-bold tabular-nums">
              +{Math.round(activeBuffs.hypeDecayReduction * 100)}% Hype
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-[4px] border text-xs font-semibold flex items-center gap-2.5 transition-all ${
            feedback.isError
              ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
              : 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]'
          }`}
        >
          {feedback.isError ? (
            <Info className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scroll-fade-x pb-1 text-xs">
        {CATEGORY_TABS.map(tab => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveCategory(tab.id);
              }}
              className={`px-4 py-2 rounded-[6px] text-xs transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#FF4F00] text-[#F4F0EA] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                  : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
        {filteredItems.map(item => {
          const isOwned = ownedUpgrades.includes(item.id);
          const canAfford = player.stats.funds >= item.price;
          const colorClasses = getCategoryColorClasses(item.category);
          const multiplier = player?.isProdigy ? 3 : 1;

          const effectBadges: Array<{ label: string; icon: React.ReactNode }> = [];
          if (item.effects.skillBonus) {
            effectBadges.push({
              label: `+${item.effects.skillBonus * multiplier} Skill`,
              icon: <Music2 className="w-3 h-3 text-[#F4F0EA] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.creativityBonus) {
            effectBadges.push({
              label: `+${item.effects.creativityBonus * multiplier} Creatividad`,
              icon: <Palette className="w-3 h-3 text-[#F59E0B] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.charismaBonus) {
            effectBadges.push({
              label: `+${item.effects.charismaBonus * multiplier} Carisma`,
              icon: <Crown className="w-3 h-3 text-[#F59E0B] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.disciplineBonus) {
            effectBadges.push({
              label: `+${item.effects.disciplineBonus * multiplier} Disciplina`,
              icon: <ShieldCheck className="w-3 h-3 text-[#10B981] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.commercialAppealBonus) {
            effectBadges.push({
              label: `+${item.effects.commercialAppealBonus * multiplier} Comercial`,
              icon: <DollarSign className="w-3 h-3 text-[#10B981] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.originalityBonus) {
            effectBadges.push({
              label: `+${item.effects.originalityBonus * multiplier} Originalidad`,
              icon: <Target className="w-3 h-3 text-[#FF2A4B] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.reputationBonus) {
            effectBadges.push({
              label: `+${item.effects.reputationBonus * multiplier} Reputación`,
              icon: <Award className="w-3 h-3 text-[#F59E0B] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.qualityBonus) {
            effectBadges.push({
              label: `+${item.effects.qualityBonus} Calidad`,
              icon: <Disc3 className="w-3 h-3 text-[#10B981] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.passiveEnergyPerMonth) {
            effectBadges.push({
              label: `+${item.effects.passiveEnergyPerMonth} Energía/mes`,
              icon: <Zap className="w-3 h-3 text-[#10B981] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.tourFatigueReduction) {
            effectBadges.push({
              label: `-${Math.round(item.effects.tourFatigueReduction * 100)}% Fatiga`,
              icon: <Truck className="w-3 h-3 text-[#FF2A4B] shrink-0" strokeWidth={1.75} />
            });
          }
          if (item.effects.hypeDecayReduction) {
            effectBadges.push({
              label: `+${Math.round(item.effects.hypeDecayReduction * 100)}% Hype`,
              icon: <Flame className="w-3 h-3 text-[#F59E0B] shrink-0" strokeWidth={1.75} />
            });
          }

          return (
            <div
              key={item.id}
              className={`rounded-[12px] p-4 flex flex-col justify-between transition-all ${
                isOwned
                  ? 'liquid-glass-subcard border-[#10B981]/60'
                  : 'liquid-glass-subcard hover:border-white/28'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-[4px] shrink-0 bg-[#0B0B0C] border border-[#26262B]">
                      {getItemIcon(item.iconName)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F4F0EA] tracking-tight leading-snug">
                        {item.name}
                      </h3>
                      <span className={`text-2xs font-semibold block mt-0.5 ${colorClasses.accentText}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>

                  {isOwned && (
                    <span className="px-2 py-0.5 rounded-[4px] text-2xs font-bold bg-[#0B0B0C] text-[#10B981] border border-[#10B981]/40 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" strokeWidth={1.75} />
                      Activo
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#8E8E99] leading-relaxed">
                  {item.description}
                </p>

                <div className={`p-2 rounded-[4px] border text-xs font-semibold flex items-center gap-2 ${colorClasses.buffBadge}`}>
                  <Zap className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                  <span>{item.buffDescription}</span>
                </div>

                {effectBadges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {effectBadges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-[4px] text-2xs font-bold border border-[#26262B] bg-[#0B0B0C] text-[#F4F0EA] flex items-center gap-1 tabular-nums"
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#26262B] flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-base font-bold text-[#F4F0EA] tabular-nums tracking-tight whitespace-nowrap">
                    {formatMoney(item.price)}
                  </div>
                  <span className="text-2xs text-[#8E8E99] tabular-nums block truncate">
                    {item.monthlyUpkeep > 0 ? `+${formatMoney(item.monthlyUpkeep)}/mes` : 'Sin costo mensual'}
                  </span>
                </div>

                <div className="shrink-0">
                  {isOwned ? (
                    <button
                      disabled
                      className="h-9 px-3.5 rounded-[4px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/40 text-xs font-bold cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                    >
                      Adquirido ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`h-9 px-3.5 text-xs font-bold rounded-[4px] transition-all flex items-center justify-center whitespace-nowrap ${
                        canAfford
                          ? 'bg-[#FF2A4B] hover:bg-[#E02040] text-[#F4F0EA] active:translate-y-[1px] cursor-pointer'
                          : 'bg-[#1C1C21] text-[#52525B] border border-[#26262B] cursor-not-allowed opacity-60'
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
