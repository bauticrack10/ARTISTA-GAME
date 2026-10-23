import React, { useState } from 'react';
import { Artist, WorldState } from '../types';
import { DecisionEngine, DecisionActionType, DecisionExecutionResult } from '../systems/DecisionEngine';
import {
  Disc3,
  ShoppingBag,
  Sparkles,
  Coffee,
  Zap,
  Mic2,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Users,
  Music2,
  X
} from 'lucide-react';
import { playSound } from '../utils/audioSystem';
import { useTourRequirements } from '../hooks/useTourRequirements';

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

  const handleRunDecision = (actionKey: DecisionActionType) => {
    if (actionKey === 'reflective_rest') {
      onRest();
      setFeedbackMessage({
        title: 'Descanso Reflexivo Completado',
        text: 'Recuperaste +50% de energía física, +2 Disciplina y +1 Creatividad.',
        success: true
      });
      return;
    }

    if (actionKey === 'home_rest') {
      if (onExecuteDecision) {
        const res = onExecuteDecision('home_rest');
        if (res && res.success) {
          playSound('click');
          setFeedbackMessage({
            title: res.title,
            text: res.narrativeText,
            success: true
          });
        }
      }
      return;
    }

    if (onExecuteDecision) {
      const res = onExecuteDecision(actionKey);
      if (res && res.success) {
        playSound('level_up');
        setFeedbackMessage({
          title: res.title,
          text: `${res.narrativeText} ${res.gainsSummary}`,
          success: true
        });
      } else if (res && !res.success) {
        playSound('click');
        setFeedbackMessage({
          title: res.title,
          text: res.narrativeText || res.error || 'No se pudo realizar la acción.',
          success: false
        });
      }
    }
  };

  return (
    <div className={`bg-[#111114] border border-[#242429] rounded-[6px] p-5 space-y-4 ${className}`}>
      {/* Header + Accesos Directos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242429] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF4F00]" />
          <h3 className="text-sm font-bold text-[#F4F4F6]">
            Acciones del Mes & Entrenamiento
          </h3>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onNavigate('studio');
            }}
            className="px-2.5 py-1 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#242429] text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5 cursor-pointer transition-colors"
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
            className="px-2.5 py-1 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#242429] text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5 cursor-pointer transition-colors"
            title={tourGates.tooltipText}
          >
            <Ticket className={`w-3.5 h-3.5 ${isTourReady ? 'text-[#00E599]' : 'text-[#8E8E99]'}`} />
            <span>Giras {isTourReady ? '(Lista)' : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onNavigate('lifestyle');
            }}
            className="px-2.5 py-1 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#242429] text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tienda</span>
          </button>
        </div>
      </div>

      {/* Aviso de resultado */}
      {feedbackMessage && (
        <div
          className={`p-3 rounded-[4px] border flex items-start justify-between gap-3 text-xs ${
            feedbackMessage.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-start gap-2">
            {feedbackMessage.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-[#F4F4F6]">{feedbackMessage.title}</p>
              <p className="text-xs mt-0.5 text-[#8E8E99]">{feedbackMessage.text}</p>
            </div>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="p-1 text-[#8E8E99] hover:text-white rounded-[3px] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Acciones Directas (Sin pestañas duplicadas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. DESCANSO & ENERGÍA */}
        <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-4 flex flex-col justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F4F4F6] flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-[#10B981]" />
                Descanso
              </span>
              <span className="text-[10px] font-sans font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded-[2px] border border-[#10B981]/30 tabular-nums">
                {hasFundsForRest ? '+50% Energía' : '+25% Gratis'}
              </span>
            </div>
            <p className="text-xs text-[#8E8E99] leading-snug">
              Recupera energía vital para grabar o salir de gira.
            </p>
          </div>

          <div className="space-y-1.5">
            {hasFundsForRest ? (
              <>
                <button
                  id="btn-take-vacation"
                  onClick={() => {
                    if (!isEnergyFull) {
                      playSound('click');
                      handleRunDecision('reflective_rest');
                    }
                  }}
                  disabled={isEnergyFull}
                  className={`w-full flex items-center justify-center gap-1.5 font-bold text-xs py-2 px-2.5 rounded-[4px] transition-all ${
                    !isEnergyFull
                      ? 'bg-[#18181C] hover:bg-[#242429] text-[#10B981] border border-emerald-800/60 cursor-pointer'
                      : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isEnergyFull ? 'Energía al 100%' : 'Retiro ($400 • +50%)'}</span>
                </button>
                {!isEnergyFull && (
                  <button
                    id="btn-home-rest"
                    onClick={() => {
                      playSound('click');
                      handleRunDecision('home_rest');
                    }}
                    className="w-full text-center text-[11px] text-[#8E8E99] hover:text-[#F4F4F6] cursor-pointer py-0.5"
                  >
                    Casa ($0 • +25% Energía)
                  </button>
                )}
              </>
            ) : (
              <button
                id="btn-home-rest"
                onClick={() => {
                  if (!isEnergyFull) {
                    playSound('click');
                    handleRunDecision('home_rest');
                  }
                }}
                disabled={isEnergyFull}
                className={`w-full flex items-center justify-center gap-1.5 font-bold text-xs py-2 px-2.5 rounded-[4px] transition-all ${
                  !isEnergyFull
                    ? 'bg-[#18181C] hover:bg-[#242429] text-[#F59E0B] border border-amber-800/60 cursor-pointer'
                    : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{isEnergyFull ? 'Energía al 100%' : 'Descansar ($0 • +25%)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. CLASES VOCALES */}
        {(() => {
          const cfg = decisionsConfig.vocal_training;
          const canExecute = currentFunds >= cfg.costFunds && currentEnergy >= cfg.costEnergy;
          return (
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F4F4F6] flex items-center gap-1.5">
                    <Mic2 className="w-3.5 h-3.5 text-[#FF4F00]" />
                     Técnica Vocal
                  </span>
                  <span className="text-[10px] font-sans font-bold text-[#8E8E99] tabular-nums">
                    ${cfg.costFunds} • -{cfg.costEnergy}% En.
                  </span>
                </div>
                <p className="text-xs text-[#8E8E99] leading-snug">
                  Mejora Skill vocal, Carisma y desempeño en vivo.
                </p>
              </div>

              <button
                onClick={() => handleRunDecision('vocal_training')}
                disabled={!canExecute}
                className={`w-full flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-2.5 rounded-[4px] transition-all ${
                  canExecute
                    ? 'bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#2E2E36] cursor-pointer'
                    : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
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
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F4F4F6] flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5 text-cyan-400" />
                    Composición
                  </span>
                  <span className="text-[10px] font-sans font-bold text-[#8E8E99] tabular-nums">
                    ${cfg.costFunds} • -{cfg.costEnergy}% En.
                  </span>
                </div>
                <p className="text-xs text-[#8E8E99] leading-snug">
                  Sube Creatividad, Originalidad y calidad de demos.
                </p>
              </div>

              <button
                onClick={() => handleRunDecision('studio_practice')}
                disabled={!canExecute}
                className={`w-full flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-2.5 rounded-[4px] transition-all ${
                  canExecute
                    ? 'bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#2E2E36] cursor-pointer'
                    : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
                }`}
              >
                <Music2 className="w-3.5 h-3.5 text-cyan-400" />
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
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F4F4F6] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Networking
                  </span>
                  <span className="text-[10px] font-sans font-bold text-[#8E8E99] tabular-nums">
                    ${cfg.costFunds} • -{cfg.costEnergy}% En.
                  </span>
                </div>
                <p className="text-xs text-[#8E8E99] leading-snug">
                  Aumenta Sociabilidad, Atractivo Comercial y Hype.
                </p>
              </div>

              <button
                onClick={() => handleRunDecision('industry_networking')}
                disabled={!canExecute}
                className={`w-full flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-2.5 rounded-[4px] transition-all ${
                  canExecute
                    ? 'bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#2E2E36] cursor-pointer'
                    : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Hacer Networking</span>
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default DecisionHub;
