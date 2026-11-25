import React, { useState } from 'react';
import { Artist, WorldState, CareerGoal } from '../../types';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Flag,
  X,
  ChevronDown,
  ChevronUp,
  Disc3,
  Zap,
  Users,
  Ticket,
  Award,
  Target
} from 'lucide-react';
import { playSound } from '../../utils/audioSystem';

export interface FirstStepsProgressProps {
  player: Artist;
  world: WorldState;
  playerSongsCount: number;
  onNavigate: (tab: string) => void;
  careerGoals?: CareerGoal[];
  onClaimGoal?: (goalId: string) => void;
  className?: string;
}

interface StepItem {
  id: string;
  label: string;
  hint: string;
  isCompleted: boolean;
  actionTab?: string;
  actionLabel?: string;
  scrollToHub?: boolean;
  icon: React.ReactNode;
}

export const FirstStepsProgress: React.FC<FirstStepsProgressProps> = ({
  player,
  world,
  playerSongsCount,
  onNavigate,
  careerGoals = [],
  onClaimGoal,
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

  const hasToured =
    (world?.tours || []).some((t) => t.artistId === player.id) ||
    (player.livePerformanceHistory?.length || 0) > 0;

  const hasTrainedOrPromoted =
    (player.stats?.energy ?? 100) < 100 ||
    (world?.currentMonth || 1) > 1 ||
    (player.stats?.reputation || 0) > 20 ||
    (player.monthlyActionsUsed || 0) > 0;

  // Orden lógico: 1. Artista creado -> 2. Grabar primer Single -> 3. Entrenar o Promocionar -> 4. Alcanzar 1,000 oyentes -> 5. Primera Gira
  const steps: StepItem[] = [
    {
      id: 'step_create',
      label: 'Artista creado',
      hint: 'Identidad, sonido y país definidos',
      isCompleted: true,
      icon: <Flag className="w-3.5 h-3.5 text-[#34D399]" />
    },
    {
      id: 'step_single',
      label: 'Grabar primer Single',
      hint: 'Compone y masteriza tu tema debut en el estudio',
      isCompleted: playerSongsCount >= 1,
      actionTab: 'studio',
      actionLabel: 'Ir al Estudio',
      icon: <Disc3 className="w-3.5 h-3.5 text-[#38BDF8]" />
    },
    {
      id: 'step_action',
      label: 'Entrenar o Promocionar',
      hint: 'Usa tus acciones del mes para subir skill o hype',
      isCompleted: hasTrainedOrPromoted,
      scrollToHub: true,
      actionLabel: 'Ver Acciones',
      icon: <Zap className="w-3.5 h-3.5 text-[#FF4F00]" />
    },
    {
      id: 'step_audience',
      label: 'Alcanzar 1,000 oyentes',
      hint: 'Promociona y entra en playlists editoriales',
      isCompleted: (player.stats?.monthlyListeners || 0) >= 1000,
      actionTab: 'streaming',
      actionLabel: 'Streaming',
      icon: <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
    },
    {
      id: 'step_tour',
      label: 'Primera Gira',
      hint: 'Lleva tu música a los escenarios en vivo',
      isCompleted: hasToured,
      actionTab: 'tours',
      actionLabel: 'Giras',
      icon: <Ticket className="w-3.5 h-3.5 text-[#FF4F00]" />
    }
  ];

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const nextActiveStep = steps.find((s) => !s.isCompleted);

  const activeGoals = (careerGoals || []).slice(0, 3);

  // Cuando los primeros pasos se completan o descartan, mostrar los 3 Objetivos Activos de Carrera
  if (isDismissed || progressPercent === 100) {
    if (activeGoals.length === 0) return null;

    return (
      <section
        className={`surface-1 bg-[#111114] border border-[#242429] rounded-[6px] p-4 sm:p-5 space-y-3.5 ${className}`}
        aria-label="Objetivos Activos de Carrera"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-[#FF4F00]/15 border border-[#FF4F00]/35 text-[#FF4F00] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-tight text-[#F4F4F6]">
                Objetivos Activos de Carrera
              </h4>
              <p className="text-xs text-[#8E8E99]">
                Metas de tu etapa actual con recompensas directas
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-[4px] surface-2 bg-[#18181C] border border-[#242429] text-xs font-sans font-bold text-[#34D399] tabular-nums">
            {activeGoals.filter((g) => g.completed).length}/{activeGoals.length} listos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeGoals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.progress / Math.max(1, goal.target)) * 100));
            return (
              <div
                key={goal.id}
                className={`surface-2 bg-[#18181C] rounded-[4px] border p-3.5 flex flex-col justify-between gap-2.5 ${
                  goal.completed && !goal.claimed
                    ? 'border-[#34D399]/55'
                    : 'border-[#242429]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#F4F4F6] leading-tight">
                      {goal.title}
                    </span>
                    <Award className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                  </div>
                  <p className="text-xs text-[#8E8E99] leading-snug">{goal.description}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-2xs font-sans tabular-nums text-[#8E8E99]">
                    <span>
                      {goal.progress.toLocaleString('es-AR')} / {goal.target.toLocaleString('es-AR')} {goal.unit}
                    </span>
                    <span className="font-bold text-[#F4F4F6]">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#09090B] rounded-[2px] overflow-hidden border border-[#242429]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        goal.completed ? 'bg-[#34D399]' : 'bg-[#FF4F00]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-2xs font-semibold text-[#F59E0B] truncate">
                    {goal.rewardLabel}
                  </span>

                  {goal.completed && !goal.claimed && onClaimGoal ? (
                    <button
                      type="button"
                      onClick={() => {
                        playSound('level_up');
                        onClaimGoal(goal.id);
                      }}
                      className="px-3 py-1 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shrink-0 transition-colors"
                    >
                      Reclamar
                    </button>
                  ) : goal.claimed ? (
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#34D399]/15 border border-[#34D399]/35 text-[#34D399] text-2xs font-bold shrink-0">
                      Reclamado
                    </span>
                  ) : goal.ctaTab ? (
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        onNavigate(goal.ctaTab!);
                      }}
                      className="px-2.5 py-1 rounded-[4px] bg-[#111114] border border-[#242429] hover:border-[#FF4F00] text-[#F4F4F6] text-2xs font-bold cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <span>Ir</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div
      className={`surface-1 bg-[#111114] border border-[#242429] rounded-[6px] p-4 sm:p-5 relative transition-all duration-300 ${className}`}
      aria-label="Progreso de Primeros Pasos"
    >
      {/* Cabecera compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-[#34D399]/15 border border-[#34D399]/35 text-[#34D399] flex items-center justify-center shrink-0">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-xs sm:text-sm font-extrabold tracking-tight text-white uppercase">
                Primeros Pasos
              </h4>
              <span className="px-2.5 py-0.5 rounded-[4px] surface-2 bg-[#18181C] text-xs font-sans font-bold text-[#34D399] border border-[#34D399]/30 tabular-nums">
                {completedCount} de {steps.length} ({progressPercent}%)
              </span>
            </div>
            <p className="text-xs text-[#8E8E99] leading-tight">
              {nextActiveStep
                ? `Siguiente objetivo: ${nextActiveStep.label}`
                : 'Progresando en la industria'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="p-1.5 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? 'Expandir hitos' : 'Minimizar hitos'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-[#EF4444] transition-colors cursor-pointer"
            title="Ocultar Primeros Pasos"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-3 relative w-full h-2.5 bg-[#09090B] rounded-[4px] border border-[#242429] overflow-hidden">
        <div
          className="h-full transition-all duration-500 bg-[#34D399]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Lista de pasos (colapsable) */}
      {!isCollapsed && (
        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-3 border-t border-[#242429]">
          {steps.map((step) => {
            const isCurrent = !step.isCompleted && nextActiveStep?.id === step.id;

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-[4px] border transition-all flex flex-col justify-between gap-2 ${
                  step.isCompleted
                    ? 'bg-[#18181C] border-[#34D399]/35 text-[#F4F4F6]'
                    : isCurrent
                    ? 'bg-[#18181C] border-[#FF4F00]/65 text-white'
                    : 'bg-[#18181C]/60 border-[#242429] text-[#8E8E99]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  {step.icon}
                  {step.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#FF4F00] shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
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

                {isCurrent && (step.actionTab || step.scrollToHub) && (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      if (step.scrollToHub) {
                        document.getElementById('decision-hub-card')?.scrollIntoView({ behavior: 'smooth' });
                      } else if (step.actionTab) {
                        onNavigate(step.actionTab);
                      }
                    }}
                    className="mt-1 w-full rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white py-1.5 px-2 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors"
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
