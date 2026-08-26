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

  return (
    <div
      className={`space-y-3 ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Symmetrical 4-Card Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        
        {/* ========================================================================= */}
        {/* TARJETA 1: ESTUDIO & ÁLBUMES */}
        {/* ========================================================================= */}
        <div className="group relative bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] hover:border-[#8B5CF6]/60 border-l-4 border-l-[#8B5CF6] rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header Icon + Category Badge */}
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-[#8B5CF6]/15 text-[#C084FC] rounded-[8px] border border-[#8B5CF6]/30 shadow-xs flex items-center justify-center">
                <Disc3 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C084FC] bg-[#8B5CF6]/15 px-2.5 py-0.5 rounded-[9999px] border border-[#8B5CF6]/30">
                Producción Musical
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px] group-hover:text-white transition-colors">
                Estudio & Álbumes
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 font-normal leading-relaxed">
                Componer singles, estructurar álbumes y colaborar con productores de élite.
              </p>
            </div>

            {/* Energy / Cost Summary Block */}
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] p-2.5 space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#F59E0B]" />
                  Costo de Energía:
                </span>
                <span className="font-semibold text-[#F8FAFC]">-15 por single</span>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-[#2A2E3D] pt-1">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#8B5CF6]" />
                  Cupo Anual:
                </span>
                <span className="font-semibold text-[#F8FAFC] text-[10px]" title="El cupo se reinicia automáticamente en el 1er Semestre de cada año">
                  {world ? `${singlesThisYear}/5 singles (Reinicia en Semestre 1 de cada año)` : 'Hasta 5 singles/año'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => {
              playSound('click');
              onNavigate('studio');
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#16181F] hover:bg-[#8B5CF6] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#8B5CF6] font-semibold text-xs py-2.5 px-3 rounded-[8px] transition-all cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            title="Entrar al Estudio de Grabación"
          >
            <Mic2 className="w-3.5 h-3.5 text-[#C084FC] group-hover:text-white" />
            <span>Entrar a Grabar</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TARJETA 2: TIENDA & LUJO */}
        {/* ========================================================================= */}
        <div className="group relative bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] hover:border-[#06B6D4]/60 border-l-4 border-l-[#06B6D4] rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header Icon + Category Badge */}
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-[#06B6D4]/15 text-[#06B6D4] rounded-[8px] border border-[#06B6D4]/30 shadow-xs flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#06B6D4] bg-[#06B6D4]/15 px-2.5 py-0.5 rounded-[9999px] border border-[#06B6D4]/30">
                Buffs Pasivos
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px] group-hover:text-white transition-colors">
                Tienda & Lujo
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 font-normal leading-relaxed">
                Micrófonos Neumann, consolas SSL, mansiones y autos para buffs permanentes.
              </p>
            </div>

            {/* Passive Buffs Indicator Block */}
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] p-2.5 space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#06B6D4]" />
                  Mejoras Compradas:
                </span>
                <span className="font-semibold text-[#F8FAFC]">
                  {ownedUpgradesCount} de {totalLifestyleItemsCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-[#2A2E3D] pt-1">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#06B6D4]" />
                  Efectos Activos:
                </span>
                <span className="font-semibold text-[#06B6D4] truncate max-w-[130px]" title={lifestyleBuffsSummary}>
                  {lifestyleBuffsSummary}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => {
              playSound('click');
              onNavigate('lifestyle');
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#16181F] hover:bg-[#06B6D4] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#06B6D4] font-semibold text-xs py-2.5 px-3 rounded-[8px] transition-all cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            title="Ver Catálogo de Mejoras y Bienes de Lujo"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#06B6D4] group-hover:text-white" />
            <span>Explorar Tienda</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TARJETA 3: GIRAS & SHOWS (Con Compuertas de Gira & Tooltip Explicativo) */}
        {/* ========================================================================= */}
        <div
          className={`group relative rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md flex flex-col justify-between h-full space-y-4 border ${
            isTourReady
              ? 'bg-[#16181F] hover:bg-[#1C1F28] border-[#2A2E3D] hover:border-[#F59E0B]/60 border-l-4 border-l-[#F59E0B] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              : 'bg-[#16181F]/70 border-[#2A2E3D] border-l-4 border-l-rose-500/80'
          }`}
        >
          <div className="space-y-3">
            {/* Header Icon + Integrated State Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`p-2.5 rounded-[8px] border shadow-xs flex items-center justify-center ${
                  isTourReady
                    ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                <Ticket className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[9999px] border ${
                  isTourReady
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
                title={tourGates.tooltipText}
              >
                {isTourReady ? 'Compuertas Listas (3/3)' : 'Bloqueado (Requisitos)'}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px] group-hover:text-white transition-colors flex items-center justify-between">
                <span>Giras & Shows</span>
                <span
                  className="cursor-help text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  title={tourGates.tooltipText}
                >
                  <Info className="w-3.5 h-3.5" />
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 font-normal leading-relaxed">
                {isTourReady
                  ? 'Organizar fechas, llenar estadios y recaudar ingresos millonarios de taquilla.'
                  : 'Requiere catálogo (≥2 singles o 1 EP), audiencia (≥1.000 oyentes) y energía (≥85%).'}
              </p>
            </div>

            {/* Integrated Live Status Block (Checklist de las 3 Compuertas) */}
            <div
              className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] p-2.5 space-y-1.5 transition-colors"
              title={tourGates.tooltipText}
            >
              {/* Gate 1: Catálogo */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  {tourGates.hasCatalog ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                  )}
                  Catálogo (≥2S / 1EP):
                </span>
                <span className={`font-semibold ${tourGates.hasCatalog ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tourGates.songsCount}S • {tourGates.albumsCount}EP
                </span>
              </div>

              {/* Gate 2: Oyentes */}
              <div className="flex items-center justify-between text-[11px] border-t border-[#2A2E3D] pt-1">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  {tourGates.hasAudience ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                  )}
                  Oyentes (≥1.000):
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
                : 'bg-[#16181F]/40 text-[#64748B] border border-[#2A2E3D]/40 cursor-not-allowed opacity-60'
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
        <div className="group relative bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] hover:border-[#10B981]/60 border-l-4 border-l-[#10B981] rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header Icon + Dedicated Highlight Badge */}
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-[8px] border border-emerald-500/30 shadow-xs flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-[9999px] border border-emerald-500/30 shadow-xs">
                +50 Energía • Sin Salto de Turno
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
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  Costo de Retiro:
                </span>
                <span className="font-semibold text-emerald-400">$400 • Acción Inmediata</span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            id="btn-take-vacation"
            onClick={onRest}
            className="w-full flex items-center justify-center gap-2 bg-[#16181F] hover:bg-[#10B981] text-[#F8FAFC] hover:text-black border border-[#2A2E3D] hover:border-[#10B981] font-bold text-xs py-2.5 px-3 rounded-[8px] transition-all cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            title="Tomar retiro de descanso y recuperar +50 de energía vital por $400 en el semestre actual"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black fill-current" />
            <span>Tomar Retiro de Descanso</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

      </div>
    </div>
  );
};
