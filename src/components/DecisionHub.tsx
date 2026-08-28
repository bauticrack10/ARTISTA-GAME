import React from 'react';
import { Artist, WorldState, Song } from '../types';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';
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
  Info
} from 'lucide-react';
import { playSound } from '../utils/audioSystem';
import { useTourRequirements } from '../hooks/useTourRequirements';

export interface DecisionHubProps {
  player: Artist;
  world?: WorldState;
  isTourReady?: boolean;
  onNavigate: (tab: string) => void;
  onRest: () => void;
  className?: string;
}

export const DecisionHub: React.FC<DecisionHubProps> = ({
  player,
  world,
  isTourReady: isTourReadyProp,
  onNavigate,
  onRest,
  className = ''
}) => {
  const tourGates = useTourRequirements(player, world);
  const isTourReady = isTourReadyProp !== undefined ? isTourReadyProp : tourGates.canTour;
  const ownedUpgradesCount = player.lifestyleUpgrades?.length || 0;
  const totalLifestyleItemsCount = LIFESTYLE_ITEMS.length;

  // Singles released this year
  const singlesThisYear = React.useMemo(() => {
    if (world && world.songs) {
      const playerSongs = (Object.values(world.songs) as Song[]).filter(
        (s) => s.artistId === player.id
      );
      return playerSongs.filter(
        (s) => s.releaseYear === world.currentYear && s.isSingle
      ).length;
    }
    return 0;
  }, [world, player.id]);

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
  const hasFundsForRest = currentFunds >= REST_COST;
  const isEnergyFull = (player.stats?.energy ?? 0) >= 100;
  const canRest = hasFundsForRest && !isEnergyFull;

  const restTooltip = !hasFundsForRest
    ? `Fondos insuficientes ($${currentFunds.toLocaleString('es-AR')} / $${REST_COST.toLocaleString('es-AR')})`
    : isEnergyFull
    ? 'Energía al máximo (100 / 100)'
    : `Tomar retiro de descanso y recuperar +50 de energía vital por $${REST_COST.toLocaleString('es-AR')} en el semestre actual`;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Grid: 4 Interactive Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        
        {/* ========================================================================= */}
        {/* TARJETA 1: LANZAMIENTO / ESTUDIO */}
        {/* ========================================================================= */}
        <div className="group relative bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] hover:border-[#8B5CF6]/60 border-l-4 border-l-[#8B5CF6] rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header Icon + Dedicated Highlight Badge */}
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-[#8B5CF6]/15 text-[#8B5CF6] rounded-[8px] border border-[#8B5CF6]/30 shadow-xs flex items-center justify-center">
                <Disc3 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C084FC] bg-[#8B5CF6]/15 px-2.5 py-0.5 rounded-[9999px] border border-[#8B5CF6]/30 shadow-xs">
                Núcleo Musical
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px] group-hover:text-white transition-colors">
                Estudio & Producción
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 font-normal leading-relaxed">
                Componer, producir y masterizar nuevas canciones o estructurar álbumes completos.
              </p>
            </div>

            {/* Quick Status Pill / Stats */}
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] p-2.5 flex items-center justify-between text-[11px] text-[#94A3B8] transition-colors">
              <span>Lanzamientos este año:</span>
              <span className="font-mono font-bold text-[#F8FAFC]">
                {singlesThisYear} {singlesThisYear === 1 ? 'Single' : 'Singles'}
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => {
              playSound('click');
              onNavigate('studio');
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#16181F] hover:bg-[#8B5CF6] text-[#F8FAFC] hover:text-white border border-[#2A2E3D] hover:border-[#8B5CF6] font-semibold text-xs py-2.5 px-3 rounded-[8px] transition-all cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            title="Ir al estudio para grabar nuevas canciones o proyectos"
          >
            <Mic2 className="w-3.5 h-3.5 text-[#8B5CF6] group-hover:text-white" />
            <span>Crear Lanzamiento</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TARJETA 2: ESTILO DE VIDA & EQUIPAMIENTO */}
        {/* ========================================================================= */}
        <div className="group relative bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] hover:border-[#EC4899]/60 border-l-4 border-l-[#EC4899] rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header Icon + Dedicated Highlight Badge */}
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-[#EC4899]/15 text-[#EC4899] rounded-[8px] border border-[#EC4899]/30 shadow-xs flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F472B6] bg-[#EC4899]/15 px-2.5 py-0.5 rounded-[9999px] border border-[#EC4899]/30 shadow-xs">
                Mejoras & Confort
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px] group-hover:text-white transition-colors">
                Estilo de Vida
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 font-normal leading-relaxed">
                Invertir en hogares, estudios, vehículos e indumentaria para potenciar stats pasivos.
              </p>
            </div>

            {/* Quick Status Pill / Stats */}
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] p-2.5 space-y-1 text-[11px] text-[#94A3B8] transition-colors">
              <div className="flex items-center justify-between">
                <span>Items Adquiridos:</span>
                <span className="font-mono font-bold text-[#F8FAFC]">
                  {ownedUpgradesCount} / {totalLifestyleItemsCount}
                </span>
              </div>
              {lifestyleBuffsSummary && (
                <div className="text-[10px] text-emerald-400 font-semibold truncate pt-0.5 border-t border-[#2A2E3D]">
                  {lifestyleBuffsSummary}
                </div>
              )}
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => {
              playSound('click');
              onNavigate('lifestyle');
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#16181F] hover:bg-[#EC4899] text-[#F8FAFC] hover:text-white border border-[#2A2E3D] hover:border-[#EC4899] font-semibold text-xs py-2.5 px-3 rounded-[8px] transition-all cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
            title="Explorar el catálogo de mejoras de estilo de vida"
          >
            <Sliders className="w-3.5 h-3.5 text-[#EC4899] group-hover:text-white" />
            <span>Ver Catálogo de Estilo</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TARJETA 3: GIRAS & SHOWS (CON COMPUERTAS DE PROGRESIÓN) */}
        {/* ========================================================================= */}
        <div className={`group relative bg-[#16181F] border border-[#2A2E3D] rounded-[14px] p-5 transition-all duration-300 ease-out flex flex-col justify-between h-full space-y-4 ${
          isTourReady
            ? 'hover:bg-[#1C1F28] hover:border-[#F59E0B]/60 border-l-4 border-l-[#F59E0B] transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
            : 'border-l-4 border-l-rose-500/80'
        }`}>
          <div className="space-y-3">
            {/* Header Icon + Dynamic Status Badge */}
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-[8px] border shadow-xs flex items-center justify-center ${
                isTourReady
                  ? 'bg-amber-500/15 text-[#F59E0B] border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                <Ticket className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[9999px] border shadow-xs ${
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

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px] group-hover:text-white transition-colors">
                Giras & Conciertos
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 font-normal leading-relaxed">
                Armar tours nacionales e internacionales para maximizar recaudación y expandir audiencia.
              </p>
            </div>

            {/* Explicit Gates List Block */}
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] p-2.5 space-y-1.5 transition-colors">
              {/* Gate 1: Catálogo */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8] flex items-center gap-1">
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

              {/* Gate 2: Audiencia */}
              <div className="flex items-center justify-between text-[11px] border-t border-[#2A2E3D] pt-1">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  {tourGates.hasAudience ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                  )}
                  Oyentes (≥1k):
                </span>
                <span className={`font-semibold ${tourGates.hasAudience ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {player.stats.monthlyListeners.toLocaleString()}
                </span>
              </div>

              {/* Gate 3: Energía */}
              <div className="flex items-center justify-between text-[11px] border-t border-[#2A2E3D] pt-1">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  {tourGates.hasEnergy ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                  )}
                  Energía (≥85%):
                </span>
                <span className={`font-semibold ${tourGates.hasEnergy ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {player.stats.energy} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => {
              if (isTourReady) {
                playSound('click');
                onNavigate('tours');
              }
            }}
            disabled={!isTourReady}
            className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-[8px] transition-all ${
              isTourReady
                ? 'bg-[#16181F] hover:bg-[#F59E0B] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#F59E0B] shadow-xs group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer'
                : 'bg-[#16181F]/40 text-[#64748B] border border-[#2A2E3D]/40 cursor-not-allowed opacity-50'
            }`}
            title={tourGates.tooltipText}
          >
            <Ticket className={`w-3.5 h-3.5 ${isTourReady ? 'text-[#F59E0B] group-hover:text-white' : ''}`} />
            <span>{isTourReady ? 'Armar Gira' : 'Gira Bloqueada'}</span>
            <ArrowRight
              className={`w-3.5 h-3.5 ml-auto transition-all ${
                isTourReady ? 'opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5' : 'opacity-30'
              }`}
            />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TARJETA 4: DESCANSO & BIENESTAR */}
        {/* ========================================================================= */}
        <div className={`group relative bg-[#16181F] border border-[#2A2E3D] rounded-[14px] p-5 transition-all duration-300 ease-out flex flex-col justify-between h-full space-y-4 ${
          hasFundsForRest
            ? 'hover:bg-[#1C1F28] hover:border-[#10B981]/60 border-l-4 border-l-[#10B981] transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            : 'border-l-4 border-l-rose-500/80'
        }`}>
          <div className="space-y-3">
            {/* Header Icon + Dedicated Highlight Badge */}
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-[8px] border shadow-xs flex items-center justify-center ${
                hasFundsForRest
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                <Coffee className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[9999px] border shadow-xs ${
                hasFundsForRest
                  ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                  : 'text-rose-400 bg-rose-500/15 border-rose-500/30'
              }`}>
                {hasFundsForRest
                  ? '+50 Energía • Sin Salto de Turno'
                  : `Fondos Insuficientes ($${currentFunds.toLocaleString('es-AR')} / $${REST_COST.toLocaleString('es-AR')})`}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px] group-hover:text-white transition-colors">
                Descanso & Bienestar
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 font-normal leading-relaxed">
                Retiro de relax para recuperar vitalidad inmediata (+50) sin consumir turnos del calendario.
              </p>
            </div>

            {/* Recharge Breakdown Block */}
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] p-2.5 space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-400" />
                  Recarga Inmediata:
                </span>
                <span className="font-bold text-emerald-400">+50 Vitalidad (Tope 100)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-[#2A2E3D] pt-1">
                <span className="text-[#94A3B8] flex items-center gap-1">
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

          {/* Action CTA Button */}
          <button
            id="btn-take-vacation"
            onClick={() => {
              if (canRest) {
                playSound('click');
                onRest();
              }
            }}
            disabled={!canRest}
            className={`w-full flex items-center justify-center gap-2 font-bold text-xs py-2.5 px-3 rounded-[8px] transition-all ${
              canRest
                ? 'bg-[#16181F] hover:bg-[#10B981] text-[#F8FAFC] hover:text-black border border-[#2A2E3D] hover:border-[#10B981] cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-[#16181F]/40 text-[#64748B] border border-[#2A2E3D]/40 cursor-not-allowed opacity-50'
            }`}
            title={restTooltip}
          >
            <Zap className={`w-3.5 h-3.5 ${canRest ? 'text-emerald-400 group-hover:text-black fill-current' : 'text-[#64748B]'}`} />
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
    </div>
  );
};
