import React, { useState, useEffect } from 'react';
import { Artist, WorldState } from '../../types';
import { CheckCircle2, Circle, ChevronRight, Sparkles, X, ChevronDown, ChevronUp, Disc3, Zap, Users, Ticket } from 'lucide-react';
import { playSound } from '../../utils/audioSystem';

export interface FirstStepsProgressProps {
  player: Artist;
  world: WorldState;
  playerSongsCount: number;
  onNavigate: (tab: string) => void;
  className?: string;
}

interface StepItem {
  id: string;
  label: string;
  hint: string;
  isCompleted: boolean;
  actionTab?: string;
  actionLabel?: string;
  icon: React.ReactNode;
}

export const FirstStepsProgress: React.FC<FirstStepsProgressProps> = ({
  player,
  world,
  playerSongsCount,
  onNavigate,
  className = ''
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('el_artista_first_steps_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('el_artista_first_steps_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleCollapse = () => {
    playSound('click');
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('el_artista_first_steps_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const handleDismiss = () => {
    playSound('click');
    setIsDismissed(true);
    try {
      localStorage.setItem('el_artista_first_steps_dismissed', 'true');
    } catch {}
  };

  // Definición de hitos con Progreso Dotado:
  // Paso 1 ("Crear Artista") viene PRE-COMPLETADO para activar el efecto psicológico de avance garantizado
  const steps: StepItem[] = [
    {
      id: 'step_create',
      label: 'Crear Artista',
      hint: 'Identidad, sonido y país definidos',
      isCompleted: true, // Progreso Dotado: completado por defecto
      icon: <Sparkles className="w-3.5 h-3.5 text-[#00E599]" />
    },
    {
      id: 'step_action',
      label: 'Primera Acción / Descanso',
      hint: 'Entrena técnica vocal, descansa o haz networking',
      isCompleted: (player.stats?.energy ?? 100) < 100 || (world.currentMonth || 1) > 1 || (player.stats?.reputation || 0) > 20,
      actionTab: 'dashboard',
      actionLabel: 'Ver Acciones',
      icon: <Zap className="w-3.5 h-3.5 text-[#FF4F00]" />
    },
    {
      id: 'step_single',
      label: 'Grabar Primer Single',
      hint: 'Compone y masteriza tu tema debut en el estudio',
      isCompleted: playerSongsCount >= 1,
      actionTab: 'studio',
      actionLabel: 'Ir al Estudio',
      icon: <Disc3 className="w-3.5 h-3.5 text-cyan-400" />
    },
    {
      id: 'step_audience',
      label: '1,000 Oyentes Mensuales',
      hint: 'Promociona y distribuye en plataformas',
      isCompleted: (player.stats?.monthlyListeners || 0) >= 1000,
      actionTab: 'streaming',
      actionLabel: 'Streaming',
      icon: <Users className="w-3.5 h-3.5 text-amber-400" />
    },
    {
      id: 'step_tour',
      label: 'Primera Gira o Concierto',
      hint: 'Lleva tu música a los escenarios en vivo',
      isCompleted: (player.stats?.toursCompleted || 0) > 0,
      actionTab: 'tours',
      actionLabel: 'Giras',
      icon: <Ticket className="w-3.5 h-3.5 text-purple-400" />
    }
  ];

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const nextActiveStep = steps.find((s) => !s.isCompleted);

  if (isDismissed) return null;

  return (
    <div
      className={`liquid-glass-card border border-white/12 p-4 sm:p-5 relative transition-all duration-300 ${className}`}
      aria-label="Progreso de Primeros Pasos"
    >
      {/* Cabecera compacta con barra de progreso cilíndrica */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] bg-gradient-to-b from-[#00FFAC] to-[#00B373] text-[#032115] flex items-center justify-center shrink-0 shadow-[0_2px_0_#008053]">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="kit-text-header font-game text-xs sm:text-sm tracking-wide text-white uppercase">
                Primeros Pasos
              </h4>
              <span className="liquid-glass-pill px-2.5 py-0.5 text-xs font-sans font-bold text-[#00E599] border border-[#00E599]/30 tabular-nums">
                {completedCount} de {steps.length} ({progressPercent}%)
              </span>
            </div>
            <p className="text-xs text-[#8E8E99] leading-tight">
              {progressPercent === 100
                ? '¡Completaste todos los primeros pasos de tu carrera!'
                : nextActiveStep
                ? `Siguiente objetivo: ${nextActiveStep.label}`
                : 'Progresando en la industria'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="p-1 rounded-[6px] hover:bg-white/10 text-[#8E8E99] hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? 'Expandir hitos' : 'Minimizar hitos'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-[6px] hover:bg-white/10 text-[#8E8E99] hover:text-rose-400 transition-colors cursor-pointer"
            title="Ocultar Primeros Pasos"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Barra de progreso cilíndrica con brillo especular */}
      <div className="mt-3 relative w-full h-3 sm:h-3.5 bg-[#0A0A0F] rounded-full border border-white/15 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)] flex-shrink-0">
        <div
          className="h-full rounded-full transition-all duration-500 relative overflow-hidden shadow-[inset_0_-2px_0_rgba(0,0,0,0.4)] bg-gradient-to-r from-emerald-500 via-[#00E599] to-[#00FFAC]"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Brillo especular superior continuo */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 pointer-events-none" />
          {/* Efecto Shimmer continuo en la barra */}
          <div className="kit-shimmer absolute inset-0 pointer-events-none" />
        </div>
      </div>

      {/* Lista de pasos (colapsable) */}
      {!isCollapsed && (
        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1 border-t border-white/8">
          {steps.map((step, idx) => {
            const isCurrent = !step.isCompleted && nextActiveStep?.id === step.id;

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-[8px] border transition-all flex flex-col justify-between gap-1.5 ${
                  step.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : isCurrent
                    ? 'bg-[#FF4F00]/10 border-[#FF4F00]/50 text-white shadow-[0_0_12px_rgba(255,79,0,0.2)]'
                    : 'bg-black/20 border-white/8 text-[#8E8E99]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-sans font-extrabold uppercase tracking-wider tabular-nums opacity-60">
                    0{idx + 1}
                  </span>
                  {step.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00E599] shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#FF4F00] animate-ping shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-white/20 shrink-0" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold leading-tight font-sans text-white">
                    {step.label}
                  </p>
                  <p className="text-xs text-[#8E8E99] leading-tight line-clamp-2 mt-0.5">
                    {step.hint}
                  </p>
                </div>

                {isCurrent && step.actionTab && (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      onNavigate(step.actionTab!);
                    }}
                    className="mt-1 w-full kit-btn kit-btn-orange py-1 px-2 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{step.actionLabel || 'Ir ahora'}</span>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FirstStepsProgress;
