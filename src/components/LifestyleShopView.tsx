import React, { useState } from 'react';
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
  TrendingUp
} from 'lucide-react';
import { LIFESTYLE_THEMES } from '../utils/themeColors';

interface LifestyleShopViewProps {
  player: Artist;
  world: WorldState;
  onBuyItem: (itemId: string) => { success: boolean; message: string };
}

const CATEGORY_TABS: Array<{ id: 'all' | LifestyleCategory; label: string; iconColor?: string }> = [
  { id: 'all', label: 'Todas las Mejoras' },
  { id: 'studio', label: 'Estudio & Micrófonos', iconColor: 'text-cyan-600' },
  { id: 'real_estate', label: 'Viviendas & Inmuebles', iconColor: 'text-emerald-600' },
  { id: 'vehicles', label: 'Vehículos & Movilidad', iconColor: 'text-rose-600' },
  { id: 'coaching', label: 'Coaching & Salud', iconColor: 'text-purple-600' }
];

export const LifestyleShopView: React.FC<LifestyleShopViewProps> = ({
  player,
  world,
  onBuyItem
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | LifestyleCategory>('all');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const ownedUpgrades = player.lifestyleUpgrades || [];

  // Filter items
  const filteredItems = activeCategory === 'all'
    ? LIFESTYLE_ITEMS
    : LIFESTYLE_ITEMS.filter(item => item.category === activeCategory);

  // Compute active buffs
  const activeBuffs = React.useMemo(() => {
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

  const handlePurchase = (item: LifestyleItem) => {
    const res = onBuyItem(item.id);
    setFeedback({ text: res.message, isError: !res.success });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const getItemIcon = (iconName: string, category: LifestyleCategory) => {
    switch (iconName) {
      case 'Mic': return <Mic className="w-5 h-5 text-cyan-700" />;
      case 'Radio': return <Radio className="w-5 h-5 text-cyan-700" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-cyan-700" />;
      case 'Disc3': return <Disc3 className="w-5 h-5 text-cyan-700" />;
      case 'Home': return <Home className="w-5 h-5 text-emerald-700" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-emerald-700" />;
      case 'Crown': return <Crown className="w-5 h-5 text-emerald-700" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-700" />;
      case 'Truck': return <Truck className="w-5 h-5 text-rose-700" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-rose-700" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-700" />;
      case 'Zap': return <Zap className="w-5 h-5 text-rose-700" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-purple-700" />;
      case 'Award': return <Award className="w-5 h-5 text-purple-700" />;
      case 'Users': return <Users className="w-5 h-5 text-purple-700" />;
      case 'Heart': return <Heart className="w-5 h-5 text-purple-700" />;
      default: return <ShoppingBag className="w-5 h-5 text-indigo-700" />;
    }
  };

  const getCategoryTheme = (cat: LifestyleCategory) => {
    return LIFESTYLE_THEMES[cat] || LIFESTYLE_THEMES.studio;
  };

  const getCategoryLabel = (cat: LifestyleCategory) => {
    switch (cat) {
      case 'studio': return 'Estudio & Micrófonos';
      case 'real_estate': return 'Inmueble / Vivienda';
      case 'vehicles': return 'Vehículo / Gira';
      case 'coaching': return 'Coaching & Salud';
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-[#1c1c1c] bg-[#f7f4ed] min-h-screen p-4 sm:p-6 lg:p-8 rounded-2xl border border-[#eceae4]">
      {/* Header Banner - Strict design.md warmth with vibrant accents */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#eceae4] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200 tracking-tight">
              Inversión & Bienestar
            </span>
            {player.isProdigy && (
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 border border-amber-300 flex items-center gap-1 shadow-sm">
                <Crown className="w-3 h-3 text-amber-900 fill-current" />
                Prodigio x3
              </span>
            )}
          </div>
          <h1
            className="text-3xl sm:text-4xl font-semibold tracking-[-0.9px] text-[#1c1c1c] flex items-center gap-2.5"
            style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
          >
            <ShoppingBag className="w-7 h-7 text-cyan-600" />
            Tienda & Estilo de Vida
          </h1>
          <p className="text-sm text-[#5f5f5d] mt-1.5 max-w-2xl font-normal leading-relaxed">
            Invertí los fondos generados por tus lanzamientos y giras en mejoras tangibles con beneficios pasivos permanentes: calidad de estudio, recuperación de energía, mitigación de fatiga y prestigio.
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-[#fcfbf8] border border-emerald-200/80 rounded-xl p-4 sm:p-5 flex items-center gap-5 shrink-0 shadow-sm">
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-700 border border-emerald-200">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#5f5f5d] block font-normal uppercase tracking-wider text-[10px]">
              Fondos Disponibles
            </span>
            <span className="text-2xl font-bold text-emerald-800 font-mono tracking-tight">
              ${player.stats.funds.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-md border text-sm font-semibold flex items-center gap-2.5 transition-all shadow-sm ${
            feedback.isError
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          {feedback.isError ? (
            <Info className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Active Buffs Summary Bar with Rich Palette */}
      <div className="bg-[#fcfbf8] border border-[#eceae4] rounded-xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eceae4] pb-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1c1c1c] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            Resumen de Buffs Pasivos Activos ({ownedUpgrades.length} Adquiridos)
          </h2>
          <span className="text-xs text-[#5f5f5d] font-mono">
            Mantenimiento Total: <strong className="text-rose-700 font-bold">${activeBuffs.monthlyUpkeep.toLocaleString()}/mes</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 bg-cyan-50/50 border border-cyan-200 rounded-lg space-y-1">
            <span className="text-cyan-900 block text-[11px] font-semibold">Bono de Calidad</span>
            <span className="text-base font-bold text-cyan-800 font-mono">
              +{activeBuffs.qualityBonus} Calidad
            </span>
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-1">
            <span className="text-emerald-900 block text-[11px] font-semibold">Energía Pasiva</span>
            <span className="text-base font-bold text-emerald-800 font-mono">
              +{activeBuffs.passiveEnergy} / mes
            </span>
          </div>

          <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg space-y-1">
            <span className="text-rose-900 block text-[11px] font-semibold">Mitigación de Gira</span>
            <span className="text-base font-bold text-rose-800 font-mono">
              -{Math.round(activeBuffs.tourFatigueReduction * 100)}% Fatiga
            </span>
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg space-y-1">
            <span className="text-amber-900 block text-[11px] font-semibold">Estabilidad de Hype</span>
            <span className="text-base font-bold text-amber-800 font-mono">
              +{Math.round(activeBuffs.hypeDecayReduction * 100)}% Retención
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map(tab => {
          const isActive = activeCategory === tab.id;
          const activeClasses: Record<string, string> = {
            all: 'bg-[#1c1c1c] text-[#fcfbf8] font-semibold shadow-sm',
            studio: 'bg-cyan-100 border-cyan-300 text-cyan-900 font-semibold shadow-sm',
            real_estate: 'bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold shadow-sm',
            vehicles: 'bg-rose-100 border-rose-300 text-rose-900 font-semibold shadow-sm',
            coaching: 'bg-purple-100 border-purple-300 text-purple-900 font-semibold shadow-sm'
          };
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? activeClasses[tab.id] || activeClasses.all
                  : 'bg-[#fcfbf8] text-[#1c1c1c] border-[#eceae4] hover:border-[#1c1c1c]/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid with Categorized Themes & Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map(item => {
          const isOwned = ownedUpgrades.includes(item.id);
          const canAfford = player.stats.funds >= item.price;
          const theme = getCategoryTheme(item.category);

          const categoryBorderLeft: Record<string, string> = {
            studio: 'border-l-4 border-l-cyan-400',
            real_estate: 'border-l-4 border-l-emerald-400',
            vehicles: 'border-l-4 border-l-rose-400',
            coaching: 'border-l-4 border-l-purple-400'
          };

          return (
            <div
              key={item.id}
              className={`bg-[#fcfbf8] border rounded-xl p-5 flex flex-col justify-between transition-all shadow-xs hover:scale-[1.02] hover:shadow-md ${categoryBorderLeft[item.category] || ''} ${
                isOwned
                  ? 'border-emerald-300 ring-1 ring-emerald-300/40'
                  : theme.cardBorder
              }`}
            >
              <div className="space-y-3">
                {/* Card Top: Icon, Title & Category */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg shrink-0 ${theme.iconBg}`}>
                      {getItemIcon(item.iconName, item.category)}
                    </div>
                    <div>
                      <h3
                        className="text-base font-semibold text-[#1c1c1c] tracking-normal leading-snug"
                        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
                      >
                        {item.name}
                      </h3>
                      <span className={`text-[11px] font-semibold block mt-0.5 ${theme.accentText}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>

                  {isOwned && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      En Posesión
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[#5f5f5d] font-normal leading-relaxed">
                  {item.description}
                </p>

                {/* Passive Buff Pill */}
                <div className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${theme.badge}`}>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.buffDescription}</span>
                </div>
              </div>

              {/* Card Footer: Cost & Action Button */}
              <div className="mt-5 pt-4 border-t border-[#eceae4] flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-bold text-[#1c1c1c] font-mono tracking-tight">
                    ${item.price.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#5f5f5d] font-mono block">
                    {item.monthlyUpkeep > 0 ? `+$${item.monthlyUpkeep}/mes mantenimiento` : 'Sin mantenimiento mensual'}
                  </span>
                </div>

                {isOwned ? (
                  <button
                    disabled
                    className="px-4 py-2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold cursor-not-allowed"
                  >
                    Adquirido ✓
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford}
                    className={`px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      canAfford
                        ? 'btn-primary-dark active:opacity-80'
                        : 'bg-[#eceae4] text-[#5f5f5d] border border-[#eceae4] cursor-not-allowed'
                    }`}
                    style={
                      canAfford
                        ? {
                            backgroundColor: '#1c1c1c',
                            color: '#fcfbf8',
                            borderRadius: '6px',
                            boxShadow:
                              'rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                          }
                        : {}
                    }
                  >
                    {canAfford ? 'Comprar Mejora' : 'Fondos Insuficientes'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
