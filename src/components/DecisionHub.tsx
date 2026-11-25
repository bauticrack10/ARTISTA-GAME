import React, { useState } from 'react';
import { Artist, WorldState } from '../types';
import { DecisionEngine, DecisionActionType, DecisionExecutionResult } from '../systems/DecisionEngine';
import {
  Disc3,
  ShoppingBag,
  Coffee,
  Zap,
  Mic2,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Users,
  Music2,
  Calendar
} from 'lucide-react';
import { playSound } from '../utils/audioSystem';
import { useTourRequirements } from '../hooks/useTourRequirements';
import { gameJuice } from '../utils/gameJuice';

export interface DecisionHubProps {
  player: Artist;
  world?: WorldState;
  isTourReady?: boolean;
  onNavigate: (tab: string) => void;
  onRest: () => void;
  onExecuteDecision?: (action: DecisionActionType) => DecisionExecutionResult | void;
  className?: string;
}

export const DecisionHub: React.FC<DecisionHubProps> = ({
  player,
  world,
  isTourReady: isTourReadyProp,
  onNavigate,
  onRest,
  onExecuteDecision,
  className = ''
}) => {
  const [feedbackMessage, setFeedbackMessage] = useState<{ title: string; text: string; success: boolean } | null>(null);

  const tourGates = useTourRequirements(player, world);
  const isTourReady = isTourReadyProp !== undefined ? isTourReadyProp : tourGates.canTour;
  const decisionsConfig = DecisionEngine.getAvailableDecisions();

  const REST_COST = 400;
  const currentFunds = player.stats?.funds ?? 0;
  const currentEnergy = player.stats?.energy ?? 100;
  const hasFundsForRest = currentFunds >= REST_COST;
  const isEnergyFull = currentEnergy >= 100;

  const sameActionMonth =
    player.lastActionYear === undefined ||
    (player.lastActionYear === world?.currentYear && player.lastActionMonth === world?.currentMonth);
  const actionsUsed = sameActionMonth ? (player.monthlyActionsUsed ?? 0) : 0;
  const maxActions = player.managerId ? 3 : 2;

  const creativeBuffs = player.activeCreativeBuffs;
  const hasAnyBuff = Boolean(
    creativeBuffs &&
      ((creativeBuffs.nextTrackQuality || 0) > 0 ||
        (creativeBuffs.nextShowBonus || 0) > 0 ||
        (creativeBuffs.nextPromoBoost || 0) > 0)
  );

  const handleRunDecision = (actionKey: DecisionActionType, targetEl?: HTMLElement | null) => {
    if (actionKey === 'reflective_rest') {
      if (isEnergyFull || !hasFundsForRest) {
        gameJuice.triggerShake(targetEl || '#btn-take-vacation');
        return;
      }
      onRest();
      gameJuice.triggerFloatingNumber({
        text: '+50% Energía • +1 Mes',
        origin: targetEl || '#btn-take-vacation',
        type: 'energy',
        targetHud: 'energy'
      });
      gameJuice.triggerFloatingNumber({
        text: '-$400',
        origin: targetEl || '#btn-take-vacation',
        type: 'money',
        targetHud: 'money'
      });
      setFeedbackMessage({
        title: 'Descanso Reflexivo Completado (+1 Mes)',
        text: 'Avanzaste 1 mes de recuperación: +50% de energía física, +2 Disciplina y +1 Creatividad.',
        success: true
      });
      return;
    }

    if (actionKey === 'home_rest') {
      if (isEnergyFull) {
        gameJuice.triggerShake(targetEl || '#btn-home-rest');
        return;
      }
      if (onExecuteDecision) {
        const res = onExecuteDecision('home_rest');
        if (res && res.success) {
          playSound('click');
          gameJuice.triggerFloatingNumber({
            text: '+25% Energía • +1 Mes',
            origin: targetEl || '#btn-home-rest',
            type: 'energy',
            targetHud: 'energy'
          });
          setFeedbackMessage({
            title: `${res.title} (+1 Mes)`,
            text: `${res.narrativeText} Avanzaste 1 mes mientras recuperabas energía.`,
            success: true
          });
        } else {
          gameJuice.triggerShake(targetEl || '#btn-home-rest');
          if (res && !res.success) {
            setFeedbackMessage({
              title: res.title,
              text: res.narrativeText || res.error || 'No se pudo completar el descanso.',
              success: false
            });
          }
        }
      }
      return;
    }

    if (onExecuteDecision) {
      const cfg = decisionsConfig[actionKey];
      const canExec = currentFunds >= cfg.costFunds && currentEnergy >= cfg.costEnergy;
      if (!canExec) {
        gameJuice.triggerShake(targetEl);
        return;
      }

      const res = onExecuteDecision(actionKey);
      if (res && res.success) {
        playSound('level_up');

        if (actionKey === 'vocal_training') {
          gameJuice.triggerFloatingNumber({
            text: '+2 Skill • +1 Carisma',
            origin: targetEl,
            type: 'skill'
          });
          gameJuice.triggerFloatingNumber({
            text: `-$${cfg.costFunds}`,
            origin: targetEl,
            type: 'money',
            targetHud: 'money'
          });
          gameJuice.triggerFloatingNumber({
            text: `-${cfg.costEnergy}% En.`,
            origin: targetEl,
            type: 'energy',
            targetHud: 'energy'
          });
        } else if (actionKey === 'studio_practice') {
          gameJuice.triggerFloatingNumber({
            text: '+2 Creatividad • +1 Skill',
            origin: targetEl,
            type: 'skill'
          });
          gameJuice.triggerFloatingNumber({
            text: `-$${cfg.costFunds}`,
            origin: targetEl,
            type: 'money',
            targetHud: 'money'
          });
          gameJuice.triggerFloatingNumber({
            text: `-${cfg.costEnergy}% En.`,
            origin: targetEl,
            type: 'energy',
            targetHud: 'energy'
          });
        } else if (actionKey === 'industry_networking') {
          gameJuice.triggerFloatingNumber({
            text: '+2 Soc. • +8 Hype',
            origin: targetEl,
            type: 'fans',
            targetHud: 'fans'
          });
          gameJuice.triggerFloatingNumber({
            text: `-$${cfg.costFunds}`,
            origin: targetEl,
            type: 'money',
            targetHud: 'money'
          });
          gameJuice.triggerFloatingNumber({
            text: `-${cfg.costEnergy}% En.`,
            origin: targetEl,
            type: 'energy',
            targetHud: 'energy'
          });
        }

        gameJuice.triggerSuccess(targetEl);
        setFeedbackMessage({
          title: res.title,
          text: `${res.narrativeText} ${res.gainsSummary}`,
          success: true
        });
      } else if (res && !res.success) {
        playSound('click');
        gameJuice.triggerError(targetEl);
        setFeedbackMessage({
          title: res.title,
          text: res.narrativeText || res.error || 'No se pudo realizar la acción.',
          success: false
        });
      }
    }
  };

  return (
    <section
      id="decision-hub-card"
      className={`surface-1 bg-[#111114] border rounded-[6px] p-5 sm:p-6 relative space-y-4 text-[#F4F4F6] animate-stagger-in stagger-2 ${
        feedbackMessage
          ? feedbackMessage.success
            ? 'border-[#34D399]/50'
            : 'border-[#EF4444]/50'
          : 'border-[#242429]'
      } ${className}`}
    >
      {/* Header + Agenda del Mes + Accesos Directos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 relative z-10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Zap className="w-4 h-4 text-[#FF4F00]" />
          <h3 className="font-display font-extrabold text-sm uppercase tracking-tight text-[#F4F4F6]">
            Acciones del Mes & Entrenamiento
          </h3>
          <span
            className={`px-2.5 py-0.5 rounded-[4px] border text-xs font-sans font-bold tabular-nums inline-flex items-center gap-1.5 ${
              actionsUsed >= maxActions
                ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40'
                : 'surface-2 bg-[#18181C] text-[#34D399] border-[#242429]'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>
              Agenda del Mes: {actionsUsed} / {maxActions} acciones
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onNavigate('studio');
            }}
            className="surface-2 bg-[#18181C] border border-[#242429] hover:border-[#FF4F00] rounded-[4px] px-2.5 py-1 text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Disc3 className="w-3.5 h-3.5 text-[#FF4F00]" />
            <span>Ir al Estudio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onNavigate('tours');
            }}
            className="surface-2 bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] rounded-[4px] px-2.5 py-1 text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5 cursor-pointer transition-colors"
            title={tourGates.tooltipText}
          >
            <Ticket className={`w-3.5 h-3.5 ${isTourReady ? 'text-[#34D399]' : 'text-[#8E8E99]'}`} />
            <span>Giras {isTourReady ? '(Lista)' : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onNavigate('lifestyle');
            }}
            className="surface-2 bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] rounded-[4px] px-2.5 py-1 text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Tienda</span>
          </button>
        </div>
      </div>

      {/* Sinergias Activas */}
      {hasAnyBuff && (
        <div className="surface-2 bg-[#18181C] border border-[#FF4F00]/35 rounded-[4px] px-3.5 py-2.5 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold uppercase tracking-wider text-2xs text-[#FF4F00]">
            Sinergias Activas:
          </span>
          {(creativeBuffs?.nextTrackQuality || 0) > 0 && (
            <span className="px-2 py-0.5 rounded-[4px] bg-[#34D399]/15 border border-[#34D399]/35 text-[#34D399] font-semibold tabular-nums">
              +{creativeBuffs?.nextTrackQuality} Calidad Próx. Tema
            </span>
          )}
          {(creativeBuffs?.nextShowBonus || 0) > 0 && (
            <span className="px-2 py-0.5 rounded-[4px] bg-[#F59E0B]/15 border border-[#F59E0B]/35 text-[#F59E0B] font-semibold tabular-nums">
              +{creativeBuffs?.nextShowBonus}% Próx. Show
            </span>
          )}
          {(creativeBuffs?.nextPromoBoost || 0) > 0 && (
            <span className="px-2 py-0.5 rounded-[4px] bg-[#38BDF8]/15 border border-[#38BDF8]/35 text-[#38BDF8] font-semibold tabular-nums">
              +{creativeBuffs?.nextPromoBoost}% Próx. Promo
            </span>
          )}
        </div>
      )}

      {/* Aviso de resultado */}
      {feedbackMessage && (
        <div
          className={`surface-2 bg-[#18181C] rounded-[4px] p-3.5 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10 ${
            feedbackMessage.success
              ? 'border-[#34D399]/40 text-[#34D399]'
              : 'border-[#EF4444]/40 text-[#EF4444]'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {feedbackMessage.success ? (
              <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-[#F4F4F6] text-sm">{feedbackMessage.title}</p>
              <p className="text-xs mt-0.5 text-[#8E8E99] leading-relaxed">{feedbackMessage.text}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              id="btn-confirm-decision"
              onClick={() => setFeedbackMessage(null)}
              className="py-1.5 px-4 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* 4 Acciones Directas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {/* 1. DESCANSO & ENERGÍA */}
        <div className="surface-2 bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] rounded-[4px] p-4 flex flex-col justify-between gap-3 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-[#F4F4F6] flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-[#34D399]" />
                Descanso
              </span>
              <span className="text-2xs font-sans font-bold text-[#34D399] px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#34D399]/30 tabular-nums">
                {hasFundsForRest ? '+50% En.' : '+25% Gratis'}
              </span>
            </div>
            <p className="text-xs text-[#8E8E99] leading-snug">
              Recupera energía vital para grabar o salir de gira (consume 1 mes).
            </p>
          </div>

          <div className="space-y-1.5">
            {hasFundsForRest ? (
              <>
                <button
                  type="button"
                  id="btn-take-vacation"
                  onClick={(e) => {
                    if (isEnergyFull) {
                      gameJuice.triggerShake(e.currentTarget);
                      playSound('click');
                    } else {
                      playSound('click');
                      handleRunDecision('reflective_rest', e.currentTarget);
                    }
                  }}
                  className={`w-full flex items-center justify-center gap-1.5 font-bold text-xs py-2 px-2.5 rounded-[4px] border transition-all ${
                    !isEnergyFull
                      ? 'bg-[#111114] text-[#34D399] border-[#34D399]/40 hover:bg-[#34D399]/10 cursor-pointer'
                      : 'bg-[#111114] border-[#242429] text-[#52525B] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isEnergyFull ? 'Energía al 100%' : 'Retiro ($400 • +50% • 1M)'}</span>
                </button>
                {!isEnergyFull && (
                  <button
                    type="button"
                    id="btn-home-rest"
                    onClick={(e) => {
                      playSound('click');
                      handleRunDecision('home_rest', e.currentTarget);
                    }}
                    className="w-full text-center text-xs text-[#8E8E99] hover:text-[#F4F4F6] cursor-pointer py-0.5"
                  >
                    Casa ($0 • +25% En. • 1 Mes)
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                id="btn-home-rest"
                onClick={(e) => {
                  if (isEnergyFull) {
                    gameJuice.triggerShake(e.currentTarget);
                    playSound('click');
                  } else {
                    playSound('click');
                    handleRunDecision('home_rest', e.currentTarget);
                  }
                }}
                className={`w-full flex items-center justify-center gap-1.5 font-bold text-xs py-2 px-2.5 rounded-[4px] border transition-all ${
                  !isEnergyFull
                    ? 'bg-[#111114] text-[#F59E0B] border-[#F59E0B]/40 hover:bg-[#F59E0B]/10 cursor-pointer'
                    : 'bg-[#111114] border-[#242429] text-[#52525B] opacity-50 cursor-not-allowed'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{isEnergyFull ? 'Energía al 100%' : 'Descansar ($0 • +25% • 1M)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. CLASES VOCALES */}
        {(() => {
          const cfg = decisionsConfig.vocal_training;
          const canExecute = currentFunds >= cfg.costFunds && currentEnergy >= cfg.costEnergy;
          return (
            <div className="surface-2 bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] rounded-[4px] p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#F4F4F6] flex items-center gap-1.5">
                    <Mic2 className="w-3.5 h-3.5 text-[#FF4F00]" />
                    Técnica Vocal
                  </span>
                  <span className="text-2xs font-sans font-bold text-[#8E8E99] bg-[#111114] border border-[#242429] rounded-[4px] px-2 py-0.5 tabular-nums">
                    ${cfg.costFunds} • -{cfg.costEnergy}%
                  </span>
                </div>
                <p className="text-xs text-[#34D399] font-semibold">
                  +2 Skill • +1 Carisma
                </p>
                <p className="text-xs text-[#8E8E99] leading-snug">
                  Mejora afinación, presencia y desempeño en vivo.
                </p>
              </div>

              <button
                type="button"
                id="btn-vocal-training"
                onClick={(e) => {
                  if (!canExecute) {
                    gameJuice.triggerShake(e.currentTarget);
                    playSound('click');
                  } else {
                    handleRunDecision('vocal_training', e.currentTarget);
                  }
                }}
                className={`w-full flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-2.5 rounded-[4px] border transition-all ${
                  canExecute
                    ? 'bg-[#111114] border-[#242429] text-[#F4F4F6] hover:border-[#FF4F00] cursor-pointer'
                    : 'bg-[#111114] border-[#242429] text-[#52525B] opacity-50 cursor-not-allowed'
                }`}
              >
                <Mic2 className="w-3.5 h-3.5 text-[#FF4F00]" />
                <span>Entrenar Voz</span>
              </button>
            </div>
          );
        })()}

        {/* 3. PRÁCTICA & COMPOSICIÓN */}
        {(() => {
          const cfg = decisionsConfig.studio_practice;
          const canExecute = currentFunds >= cfg.costFunds && currentEnergy >= cfg.costEnergy;
          return (
            <div className="surface-2 bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] rounded-[4px] p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#F4F4F6] flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                    Composición
                  </span>
                  <span className="text-2xs font-sans font-bold text-[#8E8E99] bg-[#111114] border border-[#242429] rounded-[4px] px-2 py-0.5 tabular-nums">
                    ${cfg.costFunds} • -{cfg.costEnergy}%
                  </span>
                </div>
                <p className="text-xs text-[#38BDF8] font-semibold">
                  +2 Creatividad • +1 Skill
                </p>
                <p className="text-xs text-[#8E8E99] leading-snug">
                  Sube estructura compositiva y calidad de demos.
                </p>
              </div>

              <button
                type="button"
                id="btn-studio-practice"
                onClick={(e) => {
                  if (!canExecute) {
                    gameJuice.triggerShake(e.currentTarget);
                    playSound('click');
                  } else {
                    handleRunDecision('studio_practice', e.currentTarget);
                  }
                }}
                className={`w-full flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-2.5 rounded-[4px] border transition-all ${
                  canExecute
                    ? 'bg-[#111114] border-[#242429] text-[#F4F4F6] hover:border-[#38BDF8] cursor-pointer'
                    : 'bg-[#111114] border-[#242429] text-[#52525B] opacity-50 cursor-not-allowed'
                }`}
              >
                <Music2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Practicar en Estudio</span>
              </button>
            </div>
          );
        })()}

        {/* 4. NETWORKING & ESCENA */}
        {(() => {
          const cfg = decisionsConfig.industry_networking;
          const canExecute = currentFunds >= cfg.costFunds && currentEnergy >= cfg.costEnergy;
          return (
            <div className="surface-2 bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] rounded-[4px] p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#F4F4F6] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Networking
                  </span>
                  <span className="text-2xs font-sans font-bold text-[#8E8E99] bg-[#111114] border border-[#242429] rounded-[4px] px-2 py-0.5 tabular-nums">
                    ${cfg.costFunds} • -{cfg.costEnergy}%
                  </span>
                </div>
                <p className="text-xs text-[#FF4F00] font-semibold">
                  +2 Sociabilidad • +1 Carisma • +8 Hype
                </p>
                <p className="text-xs text-[#8E8E99] leading-snug">
                  Conecta con curadores, prensa y directores A&amp;R.
                </p>
              </div>

              <button
                type="button"
                id="btn-industry-networking"
                onClick={(e) => {
                  if (!canExecute) {
                    gameJuice.triggerShake(e.currentTarget);
                    playSound('click');
                  } else {
                    handleRunDecision('industry_networking', e.currentTarget);
                  }
                }}
                className={`w-full flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-2.5 rounded-[4px] border transition-all ${
                  canExecute
                    ? 'bg-[#111114] border-[#242429] text-[#F4F4F6] hover:border-[#F59E0B] cursor-pointer'
                    : 'bg-[#111114] border-[#242429] text-[#52525B] opacity-50 cursor-not-allowed'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Hacer Networking</span>
              </button>
            </div>
          );
        })()}
      </div>
    </section>
  );
};

export default DecisionHub;
