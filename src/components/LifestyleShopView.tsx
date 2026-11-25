import React, { useState, useMemo } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Artist, WorldState, LifestyleCategory, LifestyleItem, Song } from '../types';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';
import { EconomyEngine } from '../systems/EconomyEngine';
import { SectionSubNav } from './ui/SectionSubNav';
import { showToast } from '../utils/toastBus';
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
  Target,
  ArrowUpRight
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';
import { FinancialLedger } from './FinancialLedger';

interface LifestyleShopViewProps {
  player: Artist;
  world: WorldState;
  onBuyItem: (itemId: string) => { success: boolean; message: string };
  onNavigate?: (tab: string) => void;
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
  onBuyItem,
  onNavigate
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | LifestyleCategory>('all');
  useScrollToTop([activeCategory]);
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

  const studioProgression = useMemo(() => {
    const q = activeBuffs.qualityBonus;
    const hasAcousticSuite = ownedUpgrades.includes('studio_acoustic_suite');
    const hasSslConsole = ownedUpgrades.includes('studio_console_ssl');
    const hasNeumann = ownedUpgrades.includes('studio_neumann_u87');
    const hasSm7b = ownedUpgrades.includes('studio_mic_shure_sm7b');

    let currentTier = 1;
    let tierLabel = 'Home Studio Inicial';
    let qualityCeiling = 75;

    if (hasAcousticSuite || q >= 50) {
      currentTier = 5;
      tierLabel = 'Estudio Privado Maestro';
      qualityCeiling = 100;
    } else if (hasSslConsole || q >= 30) {
      currentTier = 4;
      tierLabel = 'Sala de Mezcla SSL';
      qualityCeiling = 95;
    } else if (hasNeumann || q >= 15) {
      currentTier = 3;
      tierLabel = 'Cabina Vocal Pro';
      qualityCeiling = 88;
    } else if (hasSm7b || q >= 6) {
      currentTier = 2;
      tierLabel = 'Home Studio Avanzado';
      qualityCeiling = 82;
    }

    const studioPriorityIds = [
      'starter_audio_interface',
      'starter_studio_monitors',
      'studio_mic_shure_sm7b',
      'studio_neumann_u87',
      'studio_console_ssl',
      'studio_acoustic_suite'
    ];
    const nextRecommended = studioPriorityIds
      .map(id => LIFESTYLE_ITEMS.find(i => i.id === id))
      .find((item): item is LifestyleItem => Boolean(item && !ownedUpgrades.includes(item.id)))
      || LIFESTYLE_ITEMS.find(i => (i.category === 'home_studio' || i.category === 'studio') && !ownedUpgrades.includes(i.id))
      || null;

    const tiers = [
      { tier: 1, name: 'Dormitorio', ceiling: 75 },
      { tier: 2, name: 'Home Studio', ceiling: 82 },
      { tier: 3, name: 'Cabina Pro', ceiling: 88 },
      { tier: 4, name: 'Consola SSL', ceiling: 95 },
      { tier: 5, name: 'Estudio Maestro', ceiling: 100 }
    ];

    return { currentTier, tierLabel, qualityCeiling, nextRecommended, tiers };
  }, [activeBuffs.qualityBonus, ownedUpgrades]);

  const operationalCosts = useMemo(() => {
    const playerSongs = (Object.values(world?.songs || {}) as Song[]).filter(s => s && s.artistId === player?.id);
    const totalMonthlyStreams = playerSongs.reduce((acc, s) => acc + (s.streamsLastMonth || 0), 0);
    const label = player?.labelId && world?.labels ? world.labels[player.labelId] : undefined;
    const manager = player?.managerId && world?.managers ? world.managers[player.managerId] : undefined;

    const estimate = EconomyEngine.getOperatingCostsEstimate(player, totalMonthlyStreams, label, manager);
    const monthlyTotalBurn = estimate.totalExpensesMonthly + estimate.monthly.managerCommission;
    const semiAnnualTotal = monthlyTotalBurn * 6;
    const runwayMonths = estimate.monthsOfRunway;

    let solvencyBadge = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
    let solvencyLabel = 'Solvencia Óptima (>12m)';

    if (!estimate.isDeficit || runwayMonths >= 12) {
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
      monthlyBaseLiving: estimate.livingCostMonthly,
      monthlyUpkeep: estimate.upkeepMonthly,
      monthlyManagerCommission: estimate.monthly.managerCommission,
      monthlyTotalBurn,
      semiAnnualTotal,
      runwayMonths,
      solvencyBadge,
      solvencyLabel
    };
  }, [player, world]);

  const handlePurchase = (item: LifestyleItem) => {
    const res = onBuyItem(item.id);
    if (res.success) {
      playSound('money');
      showToast(res.message, 'success');
    } else {
      playSound('click');
      showToast(res.message, 'warning');
    }
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
      case 'Truck': return <Truck className="w-5 h-5 text-[#FF4F00]" strokeWidth={1.75} />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-[#FF4F00]" strokeWidth={1.75} />;
      case 'Flame': return <Flame className="w-5 h-5 text-[#FF4F00]" strokeWidth={1.75} />;
      case 'Zap': return <Zap className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.75} />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.75} />;
      case 'Award': return <Award className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.75} />;
      case 'Users': return <Users className="w-5 h-5 text-[#F4F0EA]" strokeWidth={1.75} />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#FF4F00]" strokeWidth={1.75} />;
      default: return <ShoppingBag className="w-5 h-5 text-[#FF4F00]" strokeWidth={1.75} />;
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
          buffBadge: 'bg-[#111114] text-[#F4F0EA] border-[#242429]'
        };
      case 'real_estate':
        return {
          accentText: 'text-[#10B981]',
          buffBadge: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
        };
      case 'vehicles':
        return {
          accentText: 'text-[#FF4F00]',
          buffBadge: 'bg-[#FF4F00]/10 text-[#FF4F00] border-[#FF4F00]/30'
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
      <SectionSubNav
        hub="carrera"
        activeTab="lifestyle"
        onNavigate={onNavigate}
      />

      {/* Línea de Mejora del Estudio (Tier 1 -> Tier 5) */}
      <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-2xs uppercase font-bold tracking-wider text-[#FF4F00] block">
              Progresión de Hardware
            </span>
            <h2 className="text-base sm:text-lg font-display font-bold text-[#F4F0EA] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
              Línea de Mejora del Estudio (Tier 1 → Tier 5)
            </h2>
          </div>

          <div className="flex items-center gap-2.5 tabular-nums">
            <span className="px-2.5 py-1 rounded-[4px] bg-[#18181C] border border-[#FF4F00]/45 text-xs font-bold text-[#FF4F00]">
              Tier {studioProgression.currentTier}: {studioProgression.tierLabel}
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#18181C] border border-[#242429] text-xs font-bold text-[#10B981]">
              Techo Calidad: {studioProgression.qualityCeiling}/100
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {studioProgression.tiers.map((t) => {
            const isReached = studioProgression.currentTier >= t.tier;
            const isCurrent = studioProgression.currentTier === t.tier;
            return (
              <div
                key={t.tier}
                className={`p-2.5 rounded-[4px] border text-xs tabular-nums ${
                  isCurrent
                    ? 'bg-[#FF4F00]/15 border-[#FF4F00] text-[#F4F0EA]'
                    : isReached
                    ? 'bg-[#18181C] border-[#10B981]/45 text-[#10B981]'
                    : 'bg-[#18181C] border-[#242429] text-[#52525B]'
                }`}
              >
                <span className="text-2xs font-bold uppercase block">Tier {t.tier}</span>
                <span className="font-semibold text-[#F4F0EA] truncate block">{t.name}</span>
                <span className="text-2xs opacity-85 block">Max {t.ceiling}</span>
              </div>
            );
          })}
        </div>

        {studioProgression.nextRecommended && (
          <div className="bg-[#18181C] border border-[#242429] rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs">
              <span className="text-[#8E8E99]">Siguiente mejora recomendada: </span>
              <strong className="text-[#F4F0EA]">{studioProgression.nextRecommended.name}</strong>
              <span className="text-[#10B981] font-semibold ml-2">({studioProgression.nextRecommended.buffDescription})</span>
            </div>
            <button
              type="button"
              onClick={() => handlePurchase(studioProgression.nextRecommended!)}
              disabled={player.stats.funds < studioProgression.nextRecommended.price}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-bold shrink-0 inline-flex items-center gap-1.5 tabular-nums ${
                player.stats.funds >= studioProgression.nextRecommended.price
                  ? 'bg-[#FF4F00] hover:bg-[#E04500] text-white cursor-pointer'
                  : 'bg-[#111114] border border-[#242429] text-[#52525B] cursor-not-allowed'
              }`}
            >
              <span>Adquirir • {formatMoney(studioProgression.nextRecommended.price)}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Header + Unified Compact Financial & Buffs Strip */}
      <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-[4px] text-2xs font-bold bg-[#18181C] border border-[#242429] text-[#8E8E99] tracking-wider uppercase">
                Equipamiento & Activos
              </span>
              {player.isProdigy && (
                <span className="px-2 py-0.5 rounded-[4px] text-2xs font-bold bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/40 flex items-center gap-1">
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
            <div className="bg-[#18181C] border border-[#242429] rounded-[6px] px-4 py-2.5 flex items-center gap-3">
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
              className="bg-[#18181C] hover:bg-[#242429] border border-[#242429] hover:border-[#3F3F46] rounded-[4px] px-4 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
              <div className="text-left">
                <span className="text-2xs text-[#8E8E99] block uppercase font-bold tracking-wider">
                  Libro Contable ({player.financialLedger?.length || 0})
                </span>
                <span className="text-xs font-bold text-[#F4F0EA] flex items-center gap-1">
                  Ver Finanzas <ChevronRight className="w-3.5 h-3.5 text-[#FF4F00]" strokeWidth={1.75} />
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Compact Unified Bar: Operating Costs + Solvency + Active Buffs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          {/* Costs & Solvency */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#18181C] border border-[#242429] tabular-nums">
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
            <span className="text-2xs uppercase font-bold tracking-wider text-[#8E8E99] flex items-center gap-1 mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF4F00]" strokeWidth={1.75} />
              Buffs ({ownedUpgrades.length}):
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#10B981] font-bold tabular-nums">
              +{activeBuffs.qualityBonus} Calidad
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#10B981] font-bold tabular-nums">
              +{activeBuffs.passiveEnergy} Energía/mes
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#F59E0B] font-bold tabular-nums">
              -{Math.round(activeBuffs.tourFatigueReduction * 100)}% Fatiga
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#F4F0EA] font-bold tabular-nums">
              +{Math.round(activeBuffs.hypeDecayReduction * 100)}% Hype
            </span>
          </div>
        </div>
      </div>

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
                  ? 'bg-[#FF4F00] text-white font-bold'
                  : 'bg-[#111114] border border-[#242429] text-[#8E8E99] hover:text-[#F4F0EA]'
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
              icon: <Target className="w-3 h-3 text-[#FF4F00] shrink-0" strokeWidth={1.75} />
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
              icon: <Truck className="w-3 h-3 text-[#FF4F00] shrink-0" strokeWidth={1.75} />
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
              className={`rounded-[8px] p-4 flex flex-col justify-between transition-all bg-[#111114] border ${
                isOwned
                  ? 'border-[#10B981]/60'
                  : 'border-[#242429] hover:border-[#3F3F46]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-[4px] shrink-0 bg-[#18181C] border border-[#242429]">
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
                    <span className="px-2 py-0.5 rounded-[4px] text-2xs font-bold bg-[#18181C] text-[#10B981] border border-[#10B981]/40 flex items-center gap-1 shrink-0">
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
                        className="px-2 py-0.5 rounded-[4px] text-2xs font-bold border border-[#242429] bg-[#18181C] text-[#F4F0EA] flex items-center gap-1 tabular-nums"
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#242429] flex items-center justify-between gap-3">
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
                      className="h-9 px-3.5 rounded-[4px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/40 text-xs font-bold cursor-not-allowed flex items-center justify-center whitespace-nowrap gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Adquirido</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`h-9 px-3.5 text-xs font-bold rounded-[4px] transition-all flex items-center justify-center whitespace-nowrap ${
                        canAfford
                          ? 'bg-[#FF4F00] hover:bg-[#E04500] text-white active:translate-y-[1px] cursor-pointer'
                          : 'bg-[#18181C] text-[#52525B] border border-[#242429] cursor-not-allowed opacity-60'
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
