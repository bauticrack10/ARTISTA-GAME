import React, { useState } from 'react';
import { Artist, WorldState, Song } from '../types';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';
import { DecisionEngine, DecisionActionType, DecisionExecutionResult } from '../systems/DecisionEngine';
import {
  Disc3,
  ShoppingBag,
  Sparkles,
  Coffee,
  Zap,
  ArrowRight,
  Mic2,
  Ticket,
  Sliders,
  BatteryCharging,
  Layers,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Info,
  Users,
  GraduationCap,
  Music2,
  TrendingUp,
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
  const [hubTab, setHubTab] = useState<'pillars' | 'training'>('pillars');
  const [feedbackMessage, setFeedbackMessage] = useState<{ title: string; text: string; success: boolean } | null>(null);

  const tourGates = useTourRequirements(player, world);
  const isTourReady = isTourReadyProp !== undefined ? isTourReadyProp : tourGates.canTour;
  const ownedUpgradesCount = player.lifestyleUpgrades?.length || 0;
  const totalLifestyleItemsCount = LIFESTYLE_ITEMS.length;
  const decisionsConfig = DecisionEngine.getAvailableDecisions();
  const hasEliteCoaching = DecisionEngine.hasEliteCoaching(player);

  // Singles released this year
  const singlesThisYear = React.useMemo(() => {
    if (world && world.songs) {
      const pId = player?.id || 'player';
      const playerSongs = (Object.values(world.songs) as Song[]).filter(
        (s) => s.artistId === pId
      );
      return playerSongs.filter(
        (s) => s.releaseYear === world.currentYear && s.isSingle
      ).length;
    }
    return 0;
  }, [world, player?.id]);

  // Active lifestyle buffs summary
  const lifestyleBuffsSummary = React.useMemo(() => {
    if (!player.lifestyleUpgrades || player.lifestyleUpgrades.length === 0) {
      return 'Sin mejoras activas';
    }
    const itemMap = new Map(LIFESTYLE_ITEMS.map((i) => [i.id, i]));
    let qualityBonus = 0;
    let passiveEnergy = 0;
    let tourFatigueReduction = 0;

    for (const id of player.lifestyleUpgrades) {
      const item = itemMap.get(id);
      if (item) {
        if (item.effects.qualityBonus) qualityBonus += item.effects.qualityBonus;
        if (item.effects.passiveEnergyPerMonth) passiveEnergy += item.effects.passiveEnergyPerMonth;
        if (item.effects.tourFatigueReduction) tourFatigueReduction += item.effects.tourFatigueReduction;
      }
    }

    const buffs: string[] = [];
    if (qualityBonus > 0) buffs.push(`+${qualityBonus} Calidad`);
    if (passiveEnergy > 0) buffs.push(`+${passiveEnergy} En./mes`);
    if (tourFatigueReduction > 0) buffs.push(`-${Math.round(tourFatigueReduction * 100)}% Fatiga`);
    return buffs.length > 0 ? buffs.join(' • ') : `${player.lifestyleUpgrades.length} activas`;
  }, [player.lifestyleUpgrades]);

  // Rest & Wellness conditions
  const REST_COST = 400;
  const currentFunds = player.stats?.funds ?? 0;
  const currentEnergy = player.stats?.energy ?? 100;
  const hasFundsForRest = currentFunds >= REST_COST;
  const isEnergyFull = currentEnergy >= 100;
  const canRest = hasFundsForRest && !isEnergyFull;

  const restTooltip = !hasFundsForRest
    ? `Fondos insuficientes ($${currentFunds.toLocaleString('es-AR')} / $${REST_COST.toLocaleString('es-AR')})`
    : isEnergyFull
    ? 'Energía al máximo (100 / 100)'
    : `Tomar retiro de descanso y recuperar +50 de energía vital por $${REST_COST.toLocaleString('es-AR')} en el semestre actual`;

  const handleRunDecision = (actionKey: DecisionActionType) => {
    if (actionKey === 'reflective_rest') {
      onRest();
      setFeedbackMessage({
        title: 'Descanso Reflexivo Completado',
        text: 'Recuperaste +50% de vitalidad, +2 Disciplina y +1 Creatividad. ¡Tu mente está despejada!',
        success: true
      });
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
    <div className={`space-y-4 ${className}`}>
      {/* Header with Hub Mode Switcher & Soft Cap / Prodigy status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#111114] border border-[#242429] rounded-[6px] p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FF4F00]/15 text-[#FF4F00] rounded-[4px] border border-[#FF4F00]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F4F4F6]">
              Centro de Decisiones & Desarrollo
            </h3>
            <p className="text-xs text-[#8E8E99]">
              {hubTab === 'pillars'
                ? 'Gestiona lanzamientos, estilo de vida, giras mundiales y bienestar.'
                : 'Entrena y potencia habilidades artísticas de forma permanente.'}
            </p>
          </div>
        </div>

        {/* Tab Toggle Switcher */}
        <div className="flex items-center gap-1.5 bg-[#09090B] p-1 rounded-[4px] border border-[#242429] shrink-0">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setHubTab('pillars');
            }}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              hubTab === 'pillars'
                ? 'bg-[#FF4F00] text-white font-bold shadow-none'
                : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pilares de Carrera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              setHubTab('training');
            }}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              hubTab === 'training'
                ? 'bg-[#FF4F00] text-white font-bold shadow-none'
                : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Entrenamiento & Skills</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast / Notification if present */}
      {feedbackMessage && (
        <div className={`p-3.5 rounded-control border flex items-start justify-between gap-3 text-xs animate-fade-in ${
          feedbackMessage.success
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-start gap-2">
            {feedbackMessage.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-fg">{feedbackMessage.title}</p>
              <p className="text-xs mt-0.5 text-fg-muted">{feedbackMessage.text}</p>
            </div>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="p-1 text-fg-muted hover:text-white rounded-sm hover:bg-white/10 cursor-pointer"
            title="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 1: MACRO PILARES DE CARRERA (4 TARJETAS PRINCIPALES) */}
      {/* ========================================================================= */}
      {hubTab === 'pillars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          
          {/* TARJETA 1: LANZAMIENTO / ESTUDIO */}
          <div className="group relative bg-[#111114] hover:bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] border-l-4 border-l-[#FF4F00] rounded-[6px] p-5 transition-all duration-150 flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-[#FF4F00]/15 text-[#FF4F00] rounded-[4px] border border-[#FF4F00]/30 flex items-center justify-center">
                  <Disc3 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4F00] bg-[#FF4F00]/15 px-2 py-0.5 rounded-[4px] border border-[#FF4F00]/30 font-mono">
                  Núcleo Musical
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F4F4F6] tracking-tight group-hover:text-white transition-colors">
                  Estudio & Producción
                </h3>
                <p className="text-xs text-[#8E8E99] mt-1 font-normal leading-relaxed">
                  Componer, producir y masterizar nuevas canciones o estructurar álbumes completos.
                </p>
              </div>

              <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-2.5 flex items-center justify-between text-xs text-[#8E8E99]">
                <span>Lanzamientos este año:</span>
                <span className="font-mono font-bold text-[#F4F4F6] tabular-nums">
                  {singlesThisYear} {singlesThisYear === 1 ? 'Single' : 'Singles'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                onNavigate('studio');
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#2E2E36] font-semibold text-xs py-2.5 px-3 rounded-[4px] transition-all cursor-pointer"
              title="Ir al estudio para grabar nuevas canciones o proyectos"
            >
              <Mic2 className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Crear Lanzamiento</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* TARJETA 2: ESTILO DE VIDA */}
          <div className="group relative bg-[#111114] hover:bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] border-l-4 border-l-[#38BDF8] rounded-[6px] p-5 transition-all duration-150 flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-cyan-950/40 text-cyan-400 rounded-[4px] border border-cyan-800/50 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-[4px] border border-cyan-800/50 font-mono">
                  Mejoras & Confort
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F4F4F6] tracking-tight group-hover:text-white transition-colors">
                  Estilo de Vida
                </h3>
                <p className="text-xs text-[#8E8E99] mt-1 font-normal leading-relaxed">
                  Invertir en hogares, estudios, vehículos e indumentaria para potenciar stats pasivos.
                </p>
              </div>

              <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-2.5 space-y-1 text-xs text-[#8E8E99]">
                <div className="flex items-center justify-between">
                  <span>Items Adquiridos:</span>
                  <span className="font-mono font-bold text-[#F4F4F6] tabular-nums">
                    {ownedUpgradesCount} / {totalLifestyleItemsCount}
                  </span>
                </div>
                {lifestyleBuffsSummary && (
                  <div className="text-[11px] text-[#00E599] font-mono font-semibold truncate pt-0.5 border-t border-[#242429]">
                    {lifestyleBuffsSummary}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                onNavigate('lifestyle');
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#2E2E36] font-semibold text-xs py-2.5 px-3 rounded-[4px] transition-all cursor-pointer"
              title="Explorar el catálogo de mejoras de estilo de vida"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Catálogo de Estilo</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* TARJETA 3: GIRAS & SHOWS */}
          <div className={`group relative bg-[#111114] border border-[#242429] rounded-[6px] p-5 transition-all duration-150 flex flex-col justify-between h-full space-y-4 ${
            isTourReady
              ? 'hover:bg-[#18181C] hover:border-[#3F3F46] border-l-4 border-l-[#F59E0B]'
              : 'border-l-4 border-l-[#EF4444]'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-[4px] border flex items-center justify-center ${
                  isTourReady
                    ? 'bg-amber-950/40 text-[#F59E0B] border-amber-800/50'
                    : 'bg-rose-950/40 text-[#EF4444] border-rose-800/50'
                }`}>
                  <Ticket className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border font-mono ${
                    isTourReady
                      ? 'text-[#F59E0B] bg-amber-950/40 border-amber-800/50'
                      : 'text-[#EF4444] bg-rose-950/40 border-rose-800/50'
                  }`}
                  title={tourGates.tooltipText}
                >
                  {isTourReady
                    ? 'Compuertas Listas (3/3)'
                    : `Bloqueado (${tourGates.requirements.filter((r) => r.met).length}/3)`}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F4F4F6] tracking-tight group-hover:text-white transition-colors">
                  Giras & Conciertos
                </h3>
                <p className="text-xs text-[#8E8E99] mt-1 font-normal leading-relaxed">
                  Armar tours nacionales e internacionales para maximizar recaudación y expandir audiencia.
                </p>
              </div>

              <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E8E99] flex items-center gap-1">
                    {tourGates.hasCatalog ? (
                      <CheckCircle2 className="w-3 h-3 text-[#00E599]" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
                    )}
                    Catálogo (≥2 Temas):
                  </span>
                  <span className={`font-mono font-semibold tabular-nums ${tourGates.hasCatalog ? 'text-[#00E599]' : 'text-[#EF4444]'}`}>
                    {tourGates.songsCount} canciones
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-[#242429] pt-1">
                  <span className="text-[#8E8E99] flex items-center gap-1">
                    {tourGates.hasAudience ? (
                      <CheckCircle2 className="w-3 h-3 text-[#00E599]" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
                    )}
                    Oyentes (≥1k):
                  </span>
                  <span className={`font-mono font-semibold tabular-nums ${tourGates.hasAudience ? 'text-[#00E599]' : 'text-[#EF4444]'}`}>
                    {(player?.stats?.monthlyListeners || 0).toLocaleString('es-AR')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-[#242429] pt-1">
                  <span className="text-[#8E8E99] flex items-center gap-1">
                    {tourGates.hasEnergy ? (
                      <CheckCircle2 className="w-3 h-3 text-[#00E599]" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
                    )}
                    Energía (≥85%):
                  </span>
                  <span className={`font-mono font-semibold tabular-nums ${tourGates.hasEnergy ? 'text-[#00E599]' : 'text-[#EF4444]'}`}>
                    {player?.stats?.energy ?? 100} / 100
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (isTourReady) {
                  playSound('click');
                  onNavigate('tours');
                }
              }}
              disabled={!isTourReady}
              className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-[4px] transition-all ${
                isTourReady
                  ? 'bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#2E2E36] cursor-pointer'
                  : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
              }`}
              title={tourGates.tooltipText}
            >
              <Ticket className={`w-3.5 h-3.5 ${isTourReady ? 'text-[#F59E0B]' : ''}`} />
              <span>{isTourReady ? 'Armar Gira' : 'Gira Bloqueada'}</span>
              <ArrowRight
                className={`w-3.5 h-3.5 ml-auto transition-all ${
                  isTourReady ? 'opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5' : 'opacity-30'
                }`}
              />
            </button>
          </div>

          {/* TARJETA 4: DESCANSO & BIENESTAR */}
          <div className={`group relative bg-[#111114] border border-[#242429] rounded-[6px] p-5 transition-all duration-150 flex flex-col justify-between h-full space-y-4 ${
            hasFundsForRest
              ? 'hover:bg-[#18181C] hover:border-[#3F3F46] border-l-4 border-l-[#00E599]'
              : 'border-l-4 border-l-[#EF4444]'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-[4px] border flex items-center justify-center ${
                  hasFundsForRest
                    ? 'bg-emerald-950/40 text-[#00E599] border-emerald-800/50'
                    : 'bg-rose-950/40 text-[#EF4444] border-rose-800/50'
                }`}>
                  <Coffee className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border font-mono ${
                  hasFundsForRest
                    ? 'text-[#00E599] bg-emerald-950/40 border-emerald-800/50'
                    : 'text-[#EF4444] bg-rose-950/40 border-rose-800/50'
                }`}>
                  {hasFundsForRest
                    ? '+50 Energía • +2 Disc.'
                    : 'Fondos Insuficientes'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F4F4F6] tracking-tight group-hover:text-white transition-colors">
                  Descanso & Bienestar
                </h3>
                <p className="text-xs text-[#8E8E99] mt-1 font-normal leading-relaxed">
                  Retiro reflexivo para recuperar vitalidad inmediata y enfoque disciplinario.
                </p>
              </div>

              <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E8E99] flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-[#00E599]" />
                    Recarga Inmediata:
                  </span>
                  <span className="font-bold font-mono text-[#00E599]">+50 Vitalidad</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-[#242429] pt-1">
                  <span className="text-[#8E8E99] flex items-center gap-1">
                    {hasFundsForRest ? (
                      <DollarSign className="w-3 h-3 text-[#00E599]" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
                    )}
                    Costo de Retiro:
                  </span>
                  <span className={`font-mono font-semibold tabular-nums ${hasFundsForRest ? 'text-[#00E599]' : 'text-[#EF4444]'}`}>
                    {hasFundsForRest
                      ? '$400 • Acción Inmediata'
                      : `Insuficiente ($${currentFunds.toLocaleString('es-AR')} / $${REST_COST.toLocaleString('es-AR')})`}
                  </span>
                </div>
              </div>
            </div>

            <button
              id="btn-take-vacation"
              onClick={() => {
                if (canRest) {
                  playSound('click');
                  handleRunDecision('reflective_rest');
                }
              }}
              disabled={!canRest}
              className={`w-full flex items-center justify-center gap-2 font-bold text-xs py-2.5 px-3 rounded-[4px] transition-all ${
                canRest
                  ? 'bg-[#18181C] hover:bg-[#242429] text-[#00E599] border border-emerald-800/60 cursor-pointer'
                  : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
              }`}
              title={restTooltip}
            >
              <Zap className={`w-3.5 h-3.5 ${canRest ? 'text-[#00E599] fill-current' : 'text-[#52525B]'}`} />
              <span>
                {!hasFundsForRest
                  ? 'Tomar Retiro de Descanso'
                  : isEnergyFull
                  ? 'Energía al Máximo'
                  : 'Tomar Retiro de Descanso'}
              </span>
              <ArrowRight
                className={`w-3.5 h-3.5 ml-auto transition-all ${
                  canRest ? 'opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5' : 'opacity-30'
                }`}
              />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: ENTRENAMIENTO & DESARROLLO DE SKILLS (DECISIONES INTERACTIVAS) */}
      {/* ========================================================================= */}
      {hubTab === 'training' && (
        <div className="space-y-4">
          {/* Soft Cap & Prodigy Banner */}
          <div className="bg-[#09090B] border border-[#242429] rounded-[6px] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-[#8E8E99]">
                {hasEliteCoaching ? (
                  <span className="text-[#00E599] font-semibold">
                   Coaching Élite Activo: Tus habilidades pueden progresar hasta el 100% absoluto.
                  </span>
                ) : (
                  <span>
                    Límite natural (Soft Cap): 90 pts. Para alcanzar el 100% de maestría, adquiere coaches de élite en la tienda de estilo.
                  </span>
                )}
              </span>
            </div>
            {player.isProdigy && (
              <span className="bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 px-2 py-0.5 rounded-[4px] font-mono font-bold text-2xs uppercase tracking-wider shrink-0">
               Prodigio (x3 Ganancia de Skills)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {/* 1. CLASES VOCALES */}
            {(() => {
              const cfg = decisionsConfig.vocal_training;
              const hasFunds = currentFunds >= cfg.costFunds;
              const hasEnergy = currentEnergy >= cfg.costEnergy;
              const canExecute = hasFunds && hasEnergy;

              return (
                <div className="group relative bg-[#111114] hover:bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] border-l-4 border-l-[#FF4F00] rounded-[6px] p-5 transition-all duration-150 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-[#FF4F00]/15 text-[#FF4F00] rounded-[4px] border border-[#FF4F00]/30 flex items-center justify-center">
                        <Mic2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#FF4F00] bg-[#FF4F00]/15 px-2 py-0.5 rounded-[4px] border border-[#FF4F00]/30 font-mono uppercase tracking-wider">
                        {cfg.badgeLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#F4F4F6] tracking-tight">
                        {cfg.title}
                      </h3>
                      <p className="text-xs text-[#8E8E99] mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>

                    <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-2.5 space-y-1 text-xs text-[#8E8E99]">
                      <div className="flex items-center justify-between">
                        <span>Coste en Fondos:</span>
                        <span className={`font-mono font-bold tabular-nums ${hasFunds ? 'text-[#00E599]' : 'text-[#EF4444]'}`}>
                          ${cfg.costFunds}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#242429] pt-1">
                        <span>Gasto de Energía:</span>
                        <span className={`font-mono font-bold tabular-nums ${hasEnergy ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                          -{cfg.costEnergy}% Energía
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunDecision('vocal_training')}
                    disabled={!canExecute}
                    className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-[4px] transition-all ${
                      canExecute
                        ? 'bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#2E2E36] cursor-pointer'
                        : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Mic2 className="w-3.5 h-3.5 text-[#FF4F00]" />
                    <span>Entrenar Voz</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100" />
                  </button>
                </div>
              );
            })()}

            {/* 2. PRÁCTICA & COMPOSICIÓN */}
            {(() => {
              const cfg = decisionsConfig.studio_practice;
              const hasFunds = currentFunds >= cfg.costFunds;
              const hasEnergy = currentEnergy >= cfg.costEnergy;
              const canExecute = hasFunds && hasEnergy;

              return (
                <div className="group relative bg-[#111114] hover:bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] border-l-4 border-l-[#38BDF8] rounded-[6px] p-5 transition-all duration-150 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-cyan-950/40 text-cyan-400 rounded-[4px] border border-cyan-800/50 flex items-center justify-center">
                        <Disc3 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-[4px] border border-cyan-800/50 font-mono uppercase tracking-wider">
                        {cfg.badgeLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#F4F4F6] tracking-tight">
                        {cfg.title}
                      </h3>
                      <p className="text-xs text-[#8E8E99] mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>

                    <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-2.5 space-y-1 text-xs text-[#8E8E99]">
                      <div className="flex items-center justify-between">
                        <span>Coste en Fondos:</span>
                        <span className={`font-mono font-bold tabular-nums ${hasFunds ? 'text-[#00E599]' : 'text-[#EF4444]'}`}>
                          ${cfg.costFunds}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#242429] pt-1">
                        <span>Gasto de Energía:</span>
                        <span className={`font-mono font-bold tabular-nums ${hasEnergy ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                          -{cfg.costEnergy}% Energía
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunDecision('studio_practice')}
                    disabled={!canExecute}
                    className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-[4px] transition-all ${
                      canExecute
                        ? 'bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#2E2E36] cursor-pointer'
                        : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Music2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Practicar en Estudio</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100" />
                  </button>
                </div>
              );
            })()}

            {/* 3. DESCANSO REFLEXIVO */}
            {(() => {
              const cfg = decisionsConfig.reflective_rest;
              const hasFunds = currentFunds >= cfg.costFunds;
              const canExecute = hasFunds && !isEnergyFull;

              return (
                <div className="group relative bg-[#111114] hover:bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] border-l-4 border-l-[#00E599] rounded-[6px] p-5 transition-all duration-150 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-emerald-950/40 text-[#00E599] rounded-[4px] border border-emerald-800/50 flex items-center justify-center">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#00E599] bg-emerald-950/40 px-2 py-0.5 rounded-[4px] border border-emerald-800/50 font-mono uppercase tracking-wider">
                        {cfg.badgeLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#F4F4F6] tracking-tight">
                        {cfg.title}
                      </h3>
                      <p className="text-xs text-[#8E8E99] mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>

                    <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-2.5 space-y-1 text-xs text-[#8E8E99]">
                      <div className="flex items-center justify-between">
                        <span>Coste de Retiro:</span>
                        <span className={`font-mono font-bold tabular-nums ${hasFunds ? 'text-[#00E599]' : 'text-[#EF4444]'}`}>
                          ${cfg.costFunds}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#242429] pt-1">
                        <span>Recarga Vital:</span>
                        <span className="font-mono font-bold tabular-nums text-[#00E599]">
                          +50% Energía
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunDecision('reflective_rest')}
                    disabled={!canExecute}
                    className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-[4px] transition-all ${
                      canExecute
                        ? 'bg-[#18181C] hover:bg-[#242429] text-[#00E599] border border-emerald-800/60 cursor-pointer'
                        : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#00E599]" />
                    <span>{isEnergyFull ? 'Energía al Máximo' : 'Tomar Retiro'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100" />
                  </button>
                </div>
              );
            })()}

            {/* 4. NETWORKING & ESCENA */}
            {(() => {
              const cfg = decisionsConfig.industry_networking;
              const hasFunds = currentFunds >= cfg.costFunds;
              const hasEnergy = currentEnergy >= cfg.costEnergy;
              const canExecute = hasFunds && hasEnergy;

              return (
                <div className="group relative bg-[#111114] hover:bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] border-l-4 border-l-[#F59E0B] rounded-[6px] p-5 transition-all duration-150 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-amber-950/40 text-[#F59E0B] rounded-[4px] border border-amber-800/50 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#F59E0B] bg-amber-950/40 px-2 py-0.5 rounded-[4px] border border-amber-800/50 font-mono uppercase tracking-wider">
                        {cfg.badgeLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#F4F4F6] tracking-tight">
                        {cfg.title}
                      </h3>
                      <p className="text-xs text-[#8E8E99] mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>

                    <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-2.5 space-y-1 text-xs text-[#8E8E99]">
                      <div className="flex items-center justify-between">
                        <span>Coste en Fondos:</span>
                        <span className={`font-mono font-bold tabular-nums ${hasFunds ? 'text-[#00E599]' : 'text-[#EF4444]'}`}>
                          ${cfg.costFunds}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#242429] pt-1">
                        <span>Gasto de Energía:</span>
                        <span className={`font-mono font-bold tabular-nums ${hasEnergy ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                          -{cfg.costEnergy}% Energía
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunDecision('industry_networking')}
                    disabled={!canExecute}
                    className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-[4px] transition-all ${
                      canExecute
                        ? 'bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#2E2E36] cursor-pointer'
                        : 'bg-[#18181C]/40 text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Hacer Networking</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100" />
                  </button>
                </div>
              );
            })()}

          </div>
        </div>
      )}
    </div>
  );
};
