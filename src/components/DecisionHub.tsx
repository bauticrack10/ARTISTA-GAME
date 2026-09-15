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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface border border-line rounded-card p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/15 text-primary rounded-lg border border-primary/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-fg">
              Centro de Decisiones & Desarrollo
            </h3>
            <p className="text-xs text-fg-muted">
              {hubTab === 'pillars'
                ? 'Gestiona lanzamientos, estilo de vida, giras mundiales y bienestar.'
                : 'Entrena y potencia habilidades artísticas de forma permanente.'}
            </p>
          </div>
        </div>

        {/* Tab Toggle Switcher */}
        <div className="flex items-center gap-1.5 bg-canvas p-1 rounded-lg border border-line shrink-0">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setHubTab('pillars');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              hubTab === 'pillars'
                ? 'bg-primary text-white shadow-xs'
                : 'text-fg-muted hover:text-fg'
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
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              hubTab === 'training'
                ? 'bg-accent text-white shadow-xs'
                : 'text-fg-muted hover:text-fg'
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
          <div className="group relative bg-surface hover:bg-[#1C1F28] border border-line hover:border-primary/60 border-l-4 border-l-primary rounded-card p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-primary/15 text-primary rounded-lg border border-primary/30 shadow-xs flex items-center justify-center">
                  <Disc3 className="w-5 h-5" />
                </div>
                <span className="text-2xs font-bold uppercase tracking-wider text-primary-soft bg-primary/15 px-2.5 py-0.5 rounded-full border border-primary/30 shadow-xs">
                  Núcleo Musical
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-fg tracking-[-0.3px] group-hover:text-white transition-colors">
                  Estudio & Producción
                </h3>
                <p className="text-xs text-fg-muted mt-1 font-normal leading-relaxed">
                  Componer, producir y masterizar nuevas canciones o estructurar álbumes completos.
                </p>
              </div>

              <div className="bg-canvas border border-line rounded-lg p-2.5 flex items-center justify-between text-xs text-fg-muted transition-colors">
                <span>Lanzamientos este año:</span>
                <span className="font-mono font-bold text-fg">
                  {singlesThisYear} {singlesThisYear === 1 ? 'Single' : 'Singles'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                onNavigate('studio');
              }}
              className="w-full flex items-center justify-center gap-2 bg-surface hover:bg-primary text-fg hover:text-white border border-line hover:border-primary font-semibold text-xs py-2.5 px-3 rounded-lg transition-all cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              title="Ir al estudio para grabar nuevas canciones o proyectos"
            >
              <Mic2 className="w-3.5 h-3.5 text-primary group-hover:text-white" />
              <span>Crear Lanzamiento</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* TARJETA 2: ESTILO DE VIDA */}
          <div className="group relative bg-surface hover:bg-[#1C1F28] border border-line hover:border-accent/60 border-l-4 border-l-accent rounded-card p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-accent/15 text-accent rounded-lg border border-accent/30 shadow-xs flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-2xs font-bold uppercase tracking-wider text-[#F472B6] bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/30 shadow-xs">
                  Mejoras & Confort
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-fg tracking-[-0.3px] group-hover:text-white transition-colors">
                  Estilo de Vida
                </h3>
                <p className="text-xs text-fg-muted mt-1 font-normal leading-relaxed">
                  Invertir en hogares, estudios, vehículos e indumentaria para potenciar stats pasivos.
                </p>
              </div>

              <div className="bg-canvas border border-line rounded-lg p-2.5 space-y-1 text-xs text-fg-muted transition-colors">
                <div className="flex items-center justify-between">
                  <span>Items Adquiridos:</span>
                  <span className="font-mono font-bold text-fg">
                    {ownedUpgradesCount} / {totalLifestyleItemsCount}
                  </span>
                </div>
                {lifestyleBuffsSummary && (
                  <div className="text-2xs text-emerald-400 font-semibold truncate pt-0.5 border-t border-line">
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
              className="w-full flex items-center justify-center gap-2 bg-surface hover:bg-accent text-fg hover:text-white border border-line hover:border-accent font-semibold text-xs py-2.5 px-3 rounded-lg transition-all cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              title="Explorar el catálogo de mejoras de estilo de vida"
            >
              <Sliders className="w-3.5 h-3.5 text-accent group-hover:text-white" />
              <span>Ver Catálogo de Estilo</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* TARJETA 3: GIRAS & SHOWS */}
          <div className={`group relative bg-surface border border-line rounded-card p-5 transition-all duration-300 ease-out flex flex-col justify-between h-full space-y-4 ${
            isTourReady
              ? 'hover:bg-[#1C1F28] hover:border-warning/60 border-l-4 border-l-warning transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              : 'border-l-4 border-l-rose-500/80'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg border shadow-xs flex items-center justify-center ${
                  isTourReady
                    ? 'bg-amber-500/15 text-warning border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}>
                  <Ticket className="w-5 h-5" />
                </div>
                <span
                  className={`text-2xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${
                    isTourReady
                      ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                      : 'text-rose-400 bg-rose-500/15 border-rose-500/30'
                  }`}
                  title={tourGates.tooltipText}
                >
                  {isTourReady
                    ? 'Compuertas Listas (3/3)'
                    : `Bloqueado (${tourGates.requirements.filter((r) => r.met).length}/3)`}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-fg tracking-[-0.3px] group-hover:text-white transition-colors">
                  Giras & Conciertos
                </h3>
                <p className="text-xs text-fg-muted mt-1 font-normal leading-relaxed">
                  Armar tours nacionales e internacionales para maximizar recaudación y expandir audiencia.
                </p>
              </div>

              <div className="bg-canvas border border-line rounded-lg p-2.5 space-y-1.5 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-muted flex items-center gap-1">
                    {tourGates.hasCatalog ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                    )}
                    Catálogo (≥2 Temas):
                  </span>
                  <span className={`font-semibold ${tourGates.hasCatalog ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tourGates.songsCount} canciones
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-line pt-1">
                  <span className="text-fg-muted flex items-center gap-1">
                    {tourGates.hasAudience ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                    )}
                    Oyentes (≥1k):
                  </span>
                  <span className={`font-semibold ${tourGates.hasAudience ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {(player?.stats?.monthlyListeners || 0).toLocaleString('es-AR')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-line pt-1">
                  <span className="text-fg-muted flex items-center gap-1">
                    {tourGates.hasEnergy ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                    )}
                    Energía (≥85%):
                  </span>
                  <span className={`font-semibold ${tourGates.hasEnergy ? 'text-emerald-400' : 'text-rose-400'}`}>
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
              className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-lg transition-all ${
                isTourReady
                  ? 'bg-surface hover:bg-warning text-fg border border-line hover:border-warning shadow-xs group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer'
                  : 'bg-surface/40 text-fg-subtle border border-line/40 cursor-not-allowed opacity-50'
              }`}
              title={tourGates.tooltipText}
            >
              <Ticket className={`w-3.5 h-3.5 ${isTourReady ? 'text-warning group-hover:text-white' : ''}`} />
              <span>{isTourReady ? 'Armar Gira' : 'Gira Bloqueada'}</span>
              <ArrowRight
                className={`w-3.5 h-3.5 ml-auto transition-all ${
                  isTourReady ? 'opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5' : 'opacity-30'
                }`}
              />
            </button>
          </div>

          {/* TARJETA 4: DESCANSO & BIENESTAR */}
          <div className={`group relative bg-surface border border-line rounded-card p-5 transition-all duration-300 ease-out flex flex-col justify-between h-full space-y-4 ${
            hasFundsForRest
              ? 'hover:bg-[#1C1F28] hover:border-success/60 border-l-4 border-l-success transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'border-l-4 border-l-rose-500/80'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg border shadow-xs flex items-center justify-center ${
                  hasFundsForRest
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}>
                  <Coffee className="w-5 h-5" />
                </div>
                <span className={`text-2xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${
                  hasFundsForRest
                    ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                    : 'text-rose-400 bg-rose-500/15 border-rose-500/30'
                }`}>
                  {hasFundsForRest
                    ? '+50 Energía • +2 Disc.'
                    : 'Fondos Insuficientes'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-fg tracking-[-0.3px] group-hover:text-white transition-colors">
                  Descanso & Bienestar
                </h3>
                <p className="text-xs text-fg-muted mt-1 font-normal leading-relaxed">
                  Retiro reflexivo para recuperar vitalidad inmediata y enfoque disciplinario.
                </p>
              </div>

              <div className="bg-canvas border border-line rounded-lg p-2.5 space-y-1.5 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-muted flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-emerald-400" />
                    Recarga Inmediata:
                  </span>
                  <span className="font-bold text-emerald-400">+50 Vitalidad</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-line pt-1">
                  <span className="text-fg-muted flex items-center gap-1">
                    {hasFundsForRest ? (
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                    )}
                    Costo de Retiro:
                  </span>
                  <span className={`font-semibold ${hasFundsForRest ? 'text-emerald-400' : 'text-rose-400'}`}>
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
              className={`w-full flex items-center justify-center gap-2 font-bold text-xs py-2.5 px-3 rounded-lg transition-all ${
                canRest
                  ? 'bg-surface hover:bg-success text-fg hover:text-black border border-line hover:border-success cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-surface/40 text-fg-subtle border border-line/40 cursor-not-allowed opacity-50'
              }`}
              title={restTooltip}
            >
              <Zap className={`w-3.5 h-3.5 ${canRest ? 'text-emerald-400 group-hover:text-black fill-current' : 'text-fg-subtle'}`} />
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
          <div className="bg-canvas border border-line rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-info shrink-0" />
              <span className="text-fg-muted">
                {hasEliteCoaching ? (
                  <span className="text-emerald-400 font-semibold">
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
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold text-2xs uppercase tracking-wider shrink-0">
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
                <div className="group relative bg-surface hover:bg-[#1C1F28] border border-line hover:border-primary/60 border-l-4 border-l-primary rounded-card p-5 transition-all duration-300 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-primary/15 text-primary rounded-lg border border-primary/30 shadow-xs flex items-center justify-center">
                        <Mic2 className="w-5 h-5" />
                      </div>
                      <span className="text-2xs font-bold text-primary-soft bg-primary/15 px-2.5 py-0.5 rounded-full border border-primary/30">
                        {cfg.badgeLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-fg tracking-[-0.3px]">
                        {cfg.title}
                      </h3>
                      <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>

                    <div className="bg-canvas border border-line rounded-lg p-2.5 space-y-1 text-xs text-fg-muted">
                      <div className="flex items-center justify-between">
                        <span>Coste en Fondos:</span>
                        <span className={`font-mono font-bold ${hasFunds ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${cfg.costFunds}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-line pt-1">
                        <span>Gasto de Energía:</span>
                        <span className={`font-mono font-bold ${hasEnergy ? 'text-amber-400' : 'text-rose-400'}`}>
                          -{cfg.costEnergy}% Energía
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunDecision('vocal_training')}
                    disabled={!canExecute}
                    className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-lg transition-all ${
                      canExecute
                        ? 'bg-surface hover:bg-primary text-fg hover:text-white border border-line hover:border-primary cursor-pointer shadow-xs'
                        : 'bg-surface/40 text-fg-subtle border border-line/40 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Mic2 className="w-3.5 h-3.5 text-primary group-hover:text-white" />
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
                <div className="group relative bg-surface hover:bg-[#1C1F28] border border-line hover:border-accent/60 border-l-4 border-l-accent rounded-card p-5 transition-all duration-300 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-accent/15 text-accent rounded-lg border border-accent/30 shadow-xs flex items-center justify-center">
                        <Disc3 className="w-5 h-5" />
                      </div>
                      <span className="text-2xs font-bold text-[#F472B6] bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/30">
                        {cfg.badgeLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-fg tracking-[-0.3px]">
                        {cfg.title}
                      </h3>
                      <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>

                    <div className="bg-canvas border border-line rounded-lg p-2.5 space-y-1 text-xs text-fg-muted">
                      <div className="flex items-center justify-between">
                        <span>Coste en Fondos:</span>
                        <span className={`font-mono font-bold ${hasFunds ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${cfg.costFunds}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-line pt-1">
                        <span>Gasto de Energía:</span>
                        <span className={`font-mono font-bold ${hasEnergy ? 'text-amber-400' : 'text-rose-400'}`}>
                          -{cfg.costEnergy}% Energía
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunDecision('studio_practice')}
                    disabled={!canExecute}
                    className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-lg transition-all ${
                      canExecute
                        ? 'bg-surface hover:bg-accent text-fg hover:text-white border border-line hover:border-accent cursor-pointer shadow-xs'
                        : 'bg-surface/40 text-fg-subtle border border-line/40 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Music2 className="w-3.5 h-3.5 text-accent group-hover:text-white" />
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
                <div className="group relative bg-surface hover:bg-[#1C1F28] border border-line hover:border-success/60 border-l-4 border-l-success rounded-card p-5 transition-all duration-300 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-lg border border-emerald-500/30 shadow-xs flex items-center justify-center">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <span className="text-2xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        {cfg.badgeLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-fg tracking-[-0.3px]">
                        {cfg.title}
                      </h3>
                      <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>

                    <div className="bg-canvas border border-line rounded-lg p-2.5 space-y-1 text-xs text-fg-muted">
                      <div className="flex items-center justify-between">
                        <span>Coste de Retiro:</span>
                        <span className={`font-mono font-bold ${hasFunds ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${cfg.costFunds}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-line pt-1">
                        <span>Recarga Vital:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          +50% Energía
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunDecision('reflective_rest')}
                    disabled={!canExecute}
                    className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-lg transition-all ${
                      canExecute
                        ? 'bg-surface hover:bg-success text-fg hover:text-black border border-line hover:border-success cursor-pointer shadow-xs'
                        : 'bg-surface/40 text-fg-subtle border border-line/40 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black" />
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
                <div className="group relative bg-surface hover:bg-[#1C1F28] border border-line hover:border-info/60 border-l-4 border-l-info rounded-card p-5 transition-all duration-300 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-info/15 text-info rounded-lg border border-info/30 shadow-xs flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-2xs font-bold text-[#22D3EE] bg-info/15 px-2.5 py-0.5 rounded-full border border-info/30">
                        {cfg.badgeLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-fg tracking-[-0.3px]">
                        {cfg.title}
                      </h3>
                      <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>

                    <div className="bg-canvas border border-line rounded-lg p-2.5 space-y-1 text-xs text-fg-muted">
                      <div className="flex items-center justify-between">
                        <span>Coste en Fondos:</span>
                        <span className={`font-mono font-bold ${hasFunds ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${cfg.costFunds}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-line pt-1">
                        <span>Gasto de Energía:</span>
                        <span className={`font-mono font-bold ${hasEnergy ? 'text-cyan-400' : 'text-rose-400'}`}>
                          -{cfg.costEnergy}% Energía
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunDecision('industry_networking')}
                    disabled={!canExecute}
                    className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-lg transition-all ${
                      canExecute
                        ? 'bg-surface hover:bg-info text-fg hover:text-black border border-line hover:border-info cursor-pointer shadow-xs'
                        : 'bg-surface/40 text-fg-subtle border border-line/40 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-info group-hover:text-black" />
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
