import React from 'react';
import { EventDefinition, WorldState, Artist } from '../types';
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Zap,
  Flame,
  Swords,
  Calendar,
  Clock,
  Lock
} from 'lucide-react';
import { useEventModal } from '../hooks/useEventModal';
import { ArtistAvatar } from './ArtistAvatar';

export interface EventModalProps {
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
  const {
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
  } = useEventModal({
    event,
    world,
    player,
    onSelectChoice
  });

  const CategoryIcon = categoryMeta?.icon || Swords;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-dialog-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-5 py-6 sm:py-10 overflow-y-auto animate-fade-in"
    >
      <div
        className={`bg-surface border ${
          importanceLevel === 5 || isCrisis
            ? 'border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.25)]'
            : isBloqueoCreativo
            ? 'border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
            : 'border-line shadow-2xl'
        } max-w-2xl w-full rounded-panel p-5 sm:p-8 space-y-6 text-fg relative overflow-hidden my-auto`}
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br ${
            importanceLevel === 5 || isCrisis ? 'from-rose-500/25 via-transparent to-transparent' : categoryMeta.glow
          } rounded-full blur-3xl pointer-events-none opacity-40`}
        />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-accent/10 rounded-full blur-3xl pointer-events-none opacity-30" />

        {/* Top Header: Category, Rarity, Badges & Contextual Temporality */}
        <div className="space-y-4 relative z-10 border-b border-line pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Badges & Categories */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Contextual Temporality Pill (Fin del Año X) */}
              <span
                className={`text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                  temporality.isYearEnd
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-canvas text-fg-muted border-line'
                }`}
              >
                {temporality.isYearEnd ? (
                  <Clock className="w-3 h-3 text-amber-400" />
                ) : (
                  <Calendar className="w-3 h-3 text-fg-muted" />
                )}
                {temporality.badge}
              </span>

              {/* Importance Level Badge (1-5) */}
              <span
                className={`text-2xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${importanceMeta.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${importanceMeta.dotColor} ${importanceMeta.isPulse ? 'animate-ping' : ''}`} />
                {importanceMeta.badgeText}
              </span>

              {/* BLOQUEO CREATIVO / CRISIS Badges (if distinct from main importance badge) */}
              {isBloqueoCreativo && (
                <span className="text-2xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.3)] animate-pulse flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  BLOQUEO CREATIVO
                </span>
              )}

              {/* Category and Rarity Badges */}
              {!isBloqueoCreativo && (
                <>
                  <span
                    className={`text-2xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border flex items-center gap-1.5 ${categoryMeta.badgeColor}`}
                  >
                    <CategoryIcon className="w-3.5 h-3.5" />
                    {categoryMeta.label}
                  </span>

                  <span
                    className={`text-2xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${rarityMeta.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${rarityMeta.dotColor} animate-pulse`} />
                    {rarityMeta.label}
                  </span>
                </>
              )}
            </div>

            {/* Artist Mini Status Pill */}
            <div className="flex items-center gap-3 bg-canvas px-3 py-1 rounded-full border border-line text-xs font-mono text-fg">
              <span className="flex items-center gap-1 text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
                ${player?.stats?.funds != null ? player.stats.funds.toLocaleString() : '0'}
              </span>
              <span className="text-line">|</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Zap className="w-3.5 h-3.5" />
                {player?.stats?.energy ?? 100}%
              </span>
              <span className="text-line">|</span>
              <span className="flex items-center gap-1 text-orange-400">
                <Flame className="w-3.5 h-3.5" />
                {player?.stats?.hype ?? 0}
              </span>
            </div>
          </div>

          {/* Event Title & Artist Banner */}
          <div className="flex items-start gap-4 pt-1">
            <div className="relative shrink-0">
              <ArtistAvatar
                name={player?.name || 'Artista'}
                avatarColor={player?.avatarColor}
                avatarIcon={player?.avatarIcon}
                size="lg"
                rounded="rounded-xl"
                className="w-14 h-14 border-2 border-line shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-surface border border-line text-amber-300">
                <CategoryIcon className="w-3 h-3" />
              </div>
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-xs text-fg-muted uppercase font-mono tracking-wider block">
                {player?.name || 'Artista'} • {temporality.badge}
              </span>
              <h2 id="event-dialog-title" className="text-xl sm:text-2xl font-bold tracking-[-0.8px] text-fg leading-tight pt-0.5">
                {event?.title || 'Evento'}
              </h2>
            </div>
          </div>

          {/* Narrative Story Description */}
          <div className="bg-canvas border border-line rounded-xl p-4 text-sm text-fg-muted leading-relaxed relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B5CF6] via-[#EC4899] to-[#06B6D4]" />
            <p className="pl-2 font-normal text-fg">
              {description}
            </p>
          </div>

          {/* Affected Systems Bar with Lucide Icons */}
          {affectedSystems.length > 0 && (
            <div className="bg-canvas border border-line rounded-xl p-3 px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-fg-muted shrink-0">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span>Sistemas Afectados:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {affectedSystems.map(sys => {
                  const SysIcon = sys.icon;
                  return (
                    <span
                      key={sys.id}
                      className={`text-2xs font-mono font-semibold px-2.5 py-0.5 rounded-sm border flex items-center gap-1.5 ${sys.badgeClass}`}
                    >
                      <SysIcon className={`w-3 h-3 ${sys.iconColor} shrink-0`} />
                      <span>{sys.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Choices Section */}
        <div className="space-y-3.5 relative z-10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-fg-muted uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-primary" />
              Selecciona tu respuesta o postura:
            </label>
            <span className="text-xs font-mono text-fg-subtle">
              {choices.length} opciones disponibles
            </span>
          </div>

          <div className="space-y-3">
            {choices.map((choice, idx) => {
              const { isEligible, unmetReasons, chips, cleanedNarrative, hasRisk, riskWarning, riskSeverity } = choice;

              // Border and styling depending on eligibility and detected risk
              let cardClass = '';
              let indicatorGradient = 'from-[#8B5CF6] to-[#EC4899]';

              if (!isEligible) {
                cardClass = 'bg-canvas/60 border-rose-500/20 border-l-4 border-l-rose-500/50 opacity-60 cursor-not-allowed';
              } else if (hasRisk) {
                if (riskSeverity === 'danger') {
                  cardClass = 'bg-canvas hover:bg-surface border-rose-500/40 hover:border-rose-400 active:scale-[0.99] cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]';
                  indicatorGradient = 'from-rose-500 to-rose-700';
                } else {
                  cardClass = 'bg-canvas hover:bg-surface border-amber-500/40 hover:border-amber-400 active:scale-[0.99] cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]';
                  indicatorGradient = 'from-amber-400 to-orange-500';
                }
              } else {
                cardClass = 'bg-canvas hover:bg-surface border-line hover:border-primary/70 active:scale-[0.99] cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]';
              }

              return (
                <button
                  key={choice.id || idx}
                  disabled={!isEligible}
                  onClick={() => handleSelectChoice(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-4 group relative overflow-hidden ${cardClass}`}
                >
                  {/* Left Indicator Accent on Hover */}
                  {isEligible && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${indicatorGradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  )}

                  <div className="space-y-2.5 flex-1 min-w-0">
                    {/* Choice Action Text */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-mono font-bold ${
                        !isEligible
                          ? 'text-rose-400/80'
                          : hasRisk
                          ? riskSeverity === 'danger' ? 'text-rose-400 group-hover:text-rose-300' : 'text-amber-400 group-hover:text-amber-300'
                          : 'text-fg-subtle group-hover:text-primary'
                      } transition-colors`}>
                        [0{idx + 1}]
                      </span>
                      <h4 className={`text-sm sm:text-base font-semibold leading-snug ${
                        !isEligible
                          ? 'text-fg-muted'
                          : hasRisk
                          ? 'text-fg'
                          : 'text-fg group-hover:text-primary'
                      } transition-colors`}>
                        {choice.cleanText}
                      </h4>
                    </div>

                    {/* Risk Warning Badge */}
                    {hasRisk && riskWarning && isEligible && (
                      <div className="pt-0.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-2xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                            riskSeverity === 'danger'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          }`}
                        >
                          {riskSeverity === 'danger' ? (
                            <AlertOctagon className="w-3 h-3 text-rose-400 shrink-0 animate-pulse" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                          )}
                          <span>{riskWarning}</span>
                        </span>
                      </div>
                    )}

                    {/* Qualitative Narrative Consequence (Cleaned, without duplicate raw stat numbers) */}
                    {cleanedNarrative && (
                      <p className="text-xs text-fg-muted leading-relaxed font-normal">
                        {cleanedNarrative}
                      </p>
                    )}

                    {/* Impact Preview Chips (Modifiers shown exclusively in badges) */}
                    {chips.length > 0 && isEligible && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {chips.map(chip => {
                          const ChipIcon = chip.icon;
                          const chipClass =
                            chip.type === 'money'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : chip.type === 'listeners'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : chip.type === 'streams'
                              ? 'bg-cyan-500/15 text-info border-info/30'
                              : chip.type === 'energy'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : chip.type === 'hype'
                              ? 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                              : chip.type === 'positive'
                              ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                              : chip.type === 'negative'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : chip.type === 'fans'
                              ? 'bg-primary/15 text-primary-soft border-primary/30'
                              : chip.type === 'reputation'
                              ? 'bg-primary/15 text-primary-soft border-primary/30'
                              : 'bg-white/10 text-fg border-white/15';

                          return (
                            <span
                              key={chip.key}
                              className={`text-2xs font-mono font-semibold px-2 py-0.5 rounded-sm border flex items-center gap-1 ${chipClass}`}
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
                      <div className="space-y-1 pt-1">
                        {unmetReasons.map((reason, rIdx) => (
                          <div key={rIdx} className="inline-flex items-center gap-1.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 px-2.5 py-1 rounded-md text-xs font-mono">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Action Button Icon / Lock */}
                  <div
                    className={`p-2.5 rounded-lg shrink-0 transition-all mt-0.5 ${
                      !isEligible
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : hasRisk
                        ? riskSeverity === 'danger'
                          ? 'bg-rose-500/15 text-rose-300 group-hover:bg-rose-600 group-hover:text-white border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 group-hover:bg-amber-500 group-hover:text-black border border-amber-500/30'
                        : 'bg-white/[0.06] text-[#F8FAFC] group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#EC4899] group-hover:text-white shadow-xs'
                    }`}
                  >
                    {isEligible ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
