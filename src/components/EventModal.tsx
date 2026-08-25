import React, { useState } from 'react';
import { EventDefinition, EventChoice, WorldState, Artist } from '../types';
import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  Zap,
  DollarSign,
  Flame,
  Star,
  Users,
  Swords,
  Handshake,
  Music,
  Radio,
  FileText,
  Award,
  TrendingUp,
  Volume2
} from 'lucide-react';

interface EventModalProps {
  event: EventDefinition;
  world: WorldState;
  player: Artist;
  onSelectChoice: (index: number) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  world,
  player,
  onSelectChoice
}) => {
  const context = {
    player,
    world,
    currentYear: world.currentYear,
    currentMonth: world.currentMonth,
    label: player.labelId ? world.labels[player.labelId] : undefined
  };

  const choices: EventChoice[] = typeof event.choices === 'function' ? event.choices(context) : [];
  const eventDescription = typeof event.getDescription === 'function'
    ? event.getDescription(context)
    : (event as any).description || 'Un acontecimiento inesperado sacude tu rutina artística.';

  // Determine category theme & visual icon
  const getCategoryMeta = (category: string) => {
    switch (category) {
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
  };

  const getRarityMeta = (rarity?: string) => {
    switch (rarity) {
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
  };

  const categoryMeta = getCategoryMeta(event.category || 'career');
  const rarityMeta = getRarityMeta(event.rarity);
  const CategoryIcon = categoryMeta.icon;

  // Helper to parse tags from consequencesDescription for visual chips
  const parseImpactChips = (desc: string) => {
    if (!desc) return [];
    const parts = desc.split(',').map(s => s.trim()).filter(Boolean);
    return parts.map((part, i) => {
      let type: 'positive' | 'negative' | 'neutral' | 'energy' | 'money' | 'hype' = 'neutral';
      let icon = Sparkles;

      if (part.includes('+') || part.toLowerCase().includes('aumenta') || part.toLowerCase().includes('éxito')) {
        type = 'positive';
      }
      if (part.includes('-') || part.toLowerCase().includes('reduce') || part.toLowerCase().includes('pierde')) {
        type = 'negative';
      }
      if (part.includes('$') || part.toLowerCase().includes('fondos')) {
        type = 'money';
        icon = DollarSign;
      } else if (part.toLowerCase().includes('energía') || part.toLowerCase().includes('fatiga')) {
        type = 'energy';
        icon = Zap;
      } else if (part.toLowerCase().includes('hype') || part.toLowerCase().includes('viral')) {
        type = 'hype';
        icon = Flame;
      } else if (part.toLowerCase().includes('fan')) {
        icon = Users;
      } else if (part.toLowerCase().includes('reputación') || part.toLowerCase().includes('credibilidad')) {
        icon = Star;
      }

      return { text: part, type, icon, key: i };
    });
  };

  const handleChoiceClick = (idx: number, isEligible: boolean) => {
    if (!isEligible) return;
    onSelectChoice(idx);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div
        className="bg-[#181817]/95 border border-white/15 max-w-2xl w-full rounded-[18px] p-6 sm:p-8 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-[#fcfbf8] relative overflow-hidden my-auto"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br ${categoryMeta.glow} rounded-full blur-3xl pointer-events-none opacity-60`}
        />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none opacity-40" />

        {/* Top Header: Category, Rarity, and Character Context */}
        <div className="space-y-4 relative z-10 border-b border-white/10 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border flex items-center gap-1.5 ${categoryMeta.badgeColor}`}
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                {categoryMeta.label}
              </span>

              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${rarityMeta.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${rarityMeta.dotColor} animate-pulse`} />
                {rarityMeta.label}
              </span>
            </div>

            {/* Artist Mini Status Pill */}
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-white/80">
              <span className="flex items-center gap-1 text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
                ${player.stats.funds.toLocaleString()}
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Zap className="w-3.5 h-3.5" />
                {player.stats.energy}%
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-orange-400">
                <Flame className="w-3.5 h-3.5" />
                {player.stats.hype}
              </span>
            </div>
          </div>

          {/* Event Title & Artist Banner */}
          <div className="flex items-start gap-4 pt-1">
            <div className="relative shrink-0">
              {player.avatarUrl ? (
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-14 h-14 rounded-[12px] object-cover border-2 border-white/20 shadow-md"
                />
              ) : (
                <div
                  className={`w-14 h-14 rounded-[12px] bg-gradient-to-tr ${
                    player.avatarColor || 'from-amber-500 to-rose-600'
                  } flex items-center justify-center text-white text-xl font-bold border-2 border-white/20 shadow-md`}
                >
                  {player.name.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#181817] border border-white/20 text-amber-300">
                <CategoryIcon className="w-3 h-3" />
              </div>
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-[11px] text-white/60 uppercase font-mono tracking-wider block">
                {player.name} • {world.currentYear} (Mes {world.currentMonth})
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.8px] text-[#fcfbf8] leading-tight">
                {event.title}
              </h2>
            </div>
          </div>

          {/* Narrative Story Description */}
          <div className="bg-black/30 border border-white/10 rounded-[12px] p-4 text-sm text-[#d8d6ce] leading-relaxed relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-purple-400 to-teal-400" />
            <p className="pl-2 font-normal">
              {eventDescription}
            </p>
          </div>
        </div>

        {/* Choices Section */}
        <div className="space-y-3.5 relative z-10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              Selecciona tu respuesta o postura:
            </label>
            <span className="text-[11px] font-mono text-white/40">
              {choices.length} opciones disponibles
            </span>
          </div>

          <div className="space-y-3">
            {choices.map((choice, idx) => {
              let isEligible = true;
              const unmetReasons: string[] = [];

              if (choice.costFunds && player.stats.funds < choice.costFunds) {
                isEligible = false;
                unmetReasons.push(`Requiere $${choice.costFunds.toLocaleString()} (tienes $${player.stats.funds.toLocaleString()})`);
              }
              if (choice.costEnergy && player.stats.energy < choice.costEnergy) {
                isEligible = false;
                unmetReasons.push(`Requiere ${choice.costEnergy}% energía (tienes ${player.stats.energy}%)`);
              }
              if (choice.requiresStat) {
                const statKey = choice.requiresStat.stat;
                const statVal = (player.stats as any)[statKey] ?? (player.personality as any)[statKey] ?? 0;
                if (statVal < choice.requiresStat.min) {
                  isEligible = false;
                  unmetReasons.push(`Requiere ${String(statKey)} ≥ ${choice.requiresStat.min} (tienes ${statVal})`);
                }
              }

              const impactChips = parseImpactChips(choice.consequencesDescription);

              return (
                <button
                  key={choice.id || idx}
                  disabled={!isEligible}
                  onClick={() => handleChoiceClick(idx, isEligible)}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-[12px] border transition-all cursor-pointer flex items-start justify-between gap-4 group relative overflow-hidden ${
                    isEligible
                      ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/15 hover:border-amber-400/60 active:scale-[0.99] shadow-sm hover:shadow-[0_4px_20px_rgba(251,191,36,0.12)]'
                      : 'bg-white/[0.02] border-white/5 opacity-45 cursor-not-allowed'
                  }`}
                  style={
                    isEligible
                      ? {
                          boxShadow:
                            'rgba(255, 255, 255, 0.05) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.3) 0px 2px 4px 0px'
                        }
                      : {}
                  }
                >
                  {/* Left Indicator Accent on Hover */}
                  {isEligible && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}

                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Choice Action Text */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white/40 group-hover:text-amber-400 transition-colors">
                        [0{idx + 1}]
                      </span>
                      <h4 className="text-sm sm:text-base font-semibold text-[#fcfbf8] group-hover:text-amber-200 transition-colors leading-snug">
                        {choice.text}
                      </h4>
                    </div>

                    {/* Narrative Consequence */}
                    {choice.consequencesDescription && (
                      <p className="text-xs text-white/70 leading-relaxed font-normal">
                        {choice.consequencesDescription}
                      </p>
                    )}

                    {/* Impact Preview Chips */}
                    {impactChips.length > 0 && isEligible && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {impactChips.map(chip => {
                          const ChipIcon = chip.icon;
                          const chipClass =
                            chip.type === 'money'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : chip.type === 'energy'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : chip.type === 'hype'
                              ? 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                              : chip.type === 'positive'
                              ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                              : chip.type === 'negative'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-white/10 text-white/80 border-white/15';

                          return (
                            <span
                              key={chip.key}
                              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[4px] border flex items-center gap-1 ${chipClass}`}
                            >
                              <ChipIcon className="w-2.5 h-2.5 shrink-0" />
                              <span>{chip.text}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Ineligibility Warning */}
                    {!isEligible && (
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium pt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{unmetReasons.join(' • ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Action Button Icon */}
                  {isEligible && (
                    <div
                      className="p-2.5 rounded-[8px] bg-white/10 text-white group-hover:bg-amber-400 group-hover:text-black shrink-0 transition-all shadow-xs mt-0.5"
                      style={{
                        boxShadow:
                          'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
