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
import { MagneticPrimaryButton } from './ui';

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
        className={`kit-modal max-w-2xl w-full p-5 sm:p-8 space-y-6 text-[#F4F4F6] relative overflow-hidden my-auto ${
          importanceLevel === 5 || isCrisis
            ? 'border-2 border-[#EF4444]'
            : isBloqueoCreativo
            ? 'border-2 border-[#F59E0B]'
            : 'border-2 border-[#242429]'
        }`}
      >
        {/* Top Header: Category, Rarity, Badges & Contextual Temporality */}
        <div className="space-y-4 relative z-10 border-b border-[#242429] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Badges & Categories */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Contextual Temporality Pill (Fin del Año X) */}
              <span
                className={`text-2xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 ${
                  temporality.isYearEnd
                    ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                    : 'bg-[#09090B] text-[#8E8E99] border-[#242429]'
                }`}
              >
                {temporality.isYearEnd ? (
                  <Clock className="w-3 h-3 text-[#F59E0B]" />
                ) : (
                  <Calendar className="w-3 h-3 text-[#8E8E99]" />
                )}
                {temporality.badge}
              </span>

              {/* Importance Level Badge (1-5) */}
              <span
                className={`text-2xs font-sans font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 ${importanceMeta.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${importanceMeta.dotColor} ${importanceMeta.isPulse ? 'animate-ping' : ''}`} />
                {importanceMeta.badgeText}
              </span>

              {/* BLOQUEO CREATIVO / CRISIS Badges (if distinct from main importance badge) */}
              {isBloqueoCreativo && (
                <span className="text-2xs font-sans font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-[4px] border border-[#F59E0B]/60 bg-[#F59E0B]/20 text-[#F59E0B] animate-pulse flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                  BLOQUEO CREATIVO
                </span>
              )}

              {/* Category and Rarity Badges */}
              {!isBloqueoCreativo && (
                <>
                  <span
                    className={`text-2xs font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-[4px] border flex items-center gap-1.5 ${categoryMeta.badgeColor}`}
                  >
                    <CategoryIcon className="w-3.5 h-3.5" />
                    {categoryMeta.label}
                  </span>

                  <span
                    className={`text-2xs font-sans font-semibold uppercase tracking-wider px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 ${rarityMeta.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${rarityMeta.dotColor} animate-pulse`} />
                    {rarityMeta.label}
                  </span>
                </>
              )}
            </div>

            {/* Artist Mini Status Pill */}
            <div className="flex items-center gap-3 bg-[#09090B] px-3 py-1 rounded-[4px] border border-[#242429] text-xs font-mono tabular-nums text-[#F4F4F6]">
              <span className="flex items-center gap-1 text-[#00E599]">
                <DollarSign className="w-3.5 h-3.5" />
                <span className="font-bold">${player?.stats?.funds != null ? player.stats.funds.toLocaleString() : '0'}</span>
              </span>
              <span className="text-[#242429]">|</span>
              <span className="flex items-center gap-1 text-[#F59E0B]">
                <Zap className="w-3.5 h-3.5" />
                <span className="font-bold">{player?.stats?.energy ?? 100}%</span>
              </span>
              <span className="text-[#242429]">|</span>
              <span className="flex items-center gap-1 text-[#FF4F00]">
                <Flame className="w-3.5 h-3.5" />
                <span className="font-bold">{player?.stats?.hype ?? 0}</span>
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
                rounded="rounded-[4px]"
                className="w-14 h-14 border border-[#242429]"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-[4px] bg-[#111114] border border-[#242429] text-[#F59E0B]">
                <CategoryIcon className="w-3 h-3" />
              </div>
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-xs text-[#8E8E99] uppercase font-sans tracking-wider block">
                {player?.name || 'Artista'} • {temporality.badge}
              </span>
              <h2 id="event-dialog-title" className="kit-text-header font-display text-xl sm:text-2xl tracking-tight leading-tight pt-0.5">
                {event?.title || 'Evento'}
              </h2>
            </div>
          </div>

          {/* Narrative Story Description */}
          <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-4 text-sm text-[#8E8E99] leading-relaxed relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF4F00]" />
            <p className="pl-2 font-normal text-[#F4F4F6]">
              {description}
            </p>
          </div>

          {/* Affected Systems Bar with Lucide Icons */}
          {affectedSystems.length > 0 && (
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-3 px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#8E8E99] shrink-0">
                <Zap className="w-3.5 h-3.5 text-[#FF4F00]" />
                <span>Sistemas Afectados:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {affectedSystems.map(sys => {
                  const SysIcon = sys.icon;
                  return (
                    <span
                      key={sys.id}
                      className={`text-2xs font-sans font-semibold px-2.5 py-0.5 rounded-[4px] border flex items-center gap-1.5 ${sys.badgeClass}`}
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
            <label className="text-xs font-bold text-[#8E8E99] uppercase tracking-wider font-sans flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-[#FF4F00]" />
              Selecciona tu respuesta o postura:
            </label>
            <span className="text-xs font-sans tabular-nums text-[#8E8E99]">
              {choices.length} opciones disponibles
            </span>
          </div>

          <div className="space-y-3">
            {choices.map((choice, idx) => {
              const { isEligible, unmetReasons, chips, cleanedNarrative, hasRisk, riskWarning, riskSeverity } = choice;

              // Border and styling depending on eligibility and detected risk
              let cardClass = '';
              let indicatorColor = 'bg-[#FF4F00]';

              if (!isEligible) {
                cardClass = 'bg-[#09090B]/60 border-[#EF4444]/20 border-l-4 border-l-[#EF4444]/50 opacity-60 cursor-not-allowed';
              } else if (hasRisk) {
                if (riskSeverity === 'danger') {
                  cardClass = 'bg-[#09090B] hover:bg-[#18181C] border-[#EF4444]/40 hover:border-[#EF4444] cursor-pointer';
                  indicatorColor = 'bg-[#EF4444]';
                } else {
                  cardClass = 'bg-[#09090B] hover:bg-[#18181C] border-[#F59E0B]/40 hover:border-[#F59E0B] cursor-pointer';
                  indicatorColor = 'bg-[#F59E0B]';
                }
              } else {
                cardClass = 'bg-[#09090B] hover:bg-[#18181C] border-[#242429] hover:border-[#3F3F46] cursor-pointer';
              }

              if (choices.length === 1 && isEligible) {
                return (
                  <div key={choice.id || idx} className="space-y-3">
                    <div className="p-4 rounded-[10px] bg-white/[0.04] backdrop-blur-md border border-white/10 text-white space-y-2">
                      <h4 className="text-sm sm:text-base font-semibold leading-snug text-[#F4F4F6]">
                        {choice.cleanText}
                      </h4>
                      {cleanedNarrative && (
                        <p className="text-xs text-[#8E8E99] leading-relaxed font-normal">
                          {cleanedNarrative}
                        </p>
                      )}
                    </div>
                    <MagneticPrimaryButton
                      id={`event-choice-option-${idx}`}
                      onClick={() => handleSelectChoice(idx)}
                      fullWidth
                      className="py-3 px-6 text-sm tracking-wide"
                      icon={<ArrowRight className="w-4 h-4 text-[#032115]" />}
                      iconPosition="right"
                      label="Confirmar"
                    />
                  </div>
                );
              }

              return (
                <button
                  key={choice.id || idx}
                  id={`event-choice-option-${idx}`}
                  disabled={!isEligible}
                  onClick={() => handleSelectChoice(idx)}
                  className={`w-full text-left p-4 rounded-[10px] border transition-all flex items-start justify-between gap-4 group relative overflow-hidden backdrop-blur-md ${cardClass}`}
                >
                  {/* Left Indicator Accent on Hover */}
                  {isEligible && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${indicatorColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  )}

                  <div className="space-y-2.5 flex-1 min-w-0">
                    {/* Choice Action Text */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-sans font-bold ${
                        !isEligible
                          ? 'text-[#EF4444]/80'
                          : hasRisk
                          ? riskSeverity === 'danger' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                          : 'text-[#8E8E99] group-hover:text-[#FF4F00]'
                      } transition-colors`}>
                        [0{idx + 1}]
                      </span>
                      <h4 className={`text-sm sm:text-base font-semibold leading-snug ${
                        !isEligible
                          ? 'text-[#8E8E99]'
                          : hasRisk
                          ? 'text-[#F4F4F6]'
                          : 'text-[#F4F4F6] group-hover:text-white'
                      } transition-colors`}>
                        {choice.cleanText}
                      </h4>
                    </div>

                    {/* Risk Warning & Explicit Probabilities Badge */}
                    {hasRisk && riskWarning && isEligible && (
                      <div className="pt-0.5 flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-2xs font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${
                            riskSeverity === 'danger'
                              ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40'
                              : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40'
                          }`}
                        >
                          {riskSeverity === 'danger' ? (
                            <AlertOctagon className="w-3 h-3 text-[#EF4444] shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-[#F59E0B] shrink-0" />
                          )}
                          <span>{riskWarning}</span>
                        </span>

                        {choice.successProbability !== undefined && choice.riskProbability !== undefined && (
                          <span className="text-2xs font-sans font-bold px-2 py-0.5 rounded-[4px] border bg-[#18181C] text-[#F4F0EA] border-[#26262B] tabular-nums">
                            <strong className="text-[#10B981]">{choice.successProbability}% Éxito</strong> / <strong className="text-[#EF4444]">{choice.riskProbability}% Riesgo</strong>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Qualitative Narrative Consequence (Cleaned, without duplicate raw stat numbers) */}
                    {cleanedNarrative && (
                      <p className="text-xs text-[#8E8E99] leading-relaxed font-normal">
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
                              ? 'bg-[#00E599]/10 text-[#00E599] border-[#00E599]/30'
                              : chip.type === 'listeners'
                              ? 'bg-[#00E599]/10 text-[#00E599] border-[#00E599]/30'
                              : chip.type === 'streams'
                              ? 'bg-[#18181C] text-[#F4F4F6] border-[#242429]'
                              : chip.type === 'energy'
                              ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                              : chip.type === 'hype'
                              ? 'bg-[#FF4F00]/10 text-[#FF4F00] border-[#FF4F00]/30'
                              : chip.type === 'positive'
                              ? 'bg-[#00E599]/10 text-[#00E599] border-[#00E599]/30'
                              : chip.type === 'negative'
                              ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                              : chip.type === 'fans'
                              ? 'bg-[#18181C] text-[#F4F4F6] border-[#3F3F46]'
                              : chip.type === 'reputation'
                              ? 'bg-[#18181C] text-[#F4F4F6] border-[#3F3F46]'
                              : 'bg-[#18181C] text-[#F4F4F6] border-[#242429]';

                          return (
                            <span
                              key={chip.key}
                              className={`text-2xs font-sans font-semibold px-2 py-0.5 rounded-[2px] border flex items-center gap-1 ${chipClass}`}
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
                          <div key={rIdx} className="inline-flex items-center gap-1.5 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] px-2.5 py-1 rounded-[4px] text-xs font-sans">
                            <AlertCircle className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Action Button Icon / Lock */}
                  <div
                    className={`p-2.5 rounded-[4px] shrink-0 transition-all mt-0.5 ${
                      !isEligible
                        ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                        : hasRisk
                        ? riskSeverity === 'danger'
                          ? 'bg-[#EF4444]/15 text-[#EF4444] group-hover:bg-[#EF4444] group-hover:text-white border border-[#EF4444]/30'
                          : 'bg-[#F59E0B]/15 text-[#F59E0B] group-hover:bg-[#F59E0B] group-hover:text-black border border-[#F59E0B]/30'
                        : 'bg-[#18181C] text-[#F4F4F6] border border-[#242429] group-hover:bg-[#FF4F00] group-hover:text-white group-hover:border-[#FF4F00]'
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
