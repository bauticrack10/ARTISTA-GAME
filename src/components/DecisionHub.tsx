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
  Clock
} from 'lucide-react';

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
  const isTourReady = isTourReadyProp !== undefined ? isTourReadyProp : player.stats.energy >= 85;
  const ownedUpgradesCount = player.lifestyleUpgrades?.length || 0;
  const totalLifestyleItemsCount = LIFESTYLE_ITEMS.length;

  // Singles released this year
  const singlesThisYear = React.useMemo(() => {
    if (world && world.songs) {
      const playerSongs = (Object.values(world.songs) as Song[]).filter(
        s => s.artistId === player.id
      );
      return playerSongs.filter(
        s => s.releaseYear === world.currentYear && s.isSingle
      ).length;
    }
    return 0;
  }, [world, player.id]);

  // Active lifestyle buffs summary
  const lifestyleBuffsSummary = React.useMemo(() => {
    if (!player.lifestyleUpgrades || player.lifestyleUpgrades.length === 0) {
      return 'Sin mejoras activas';
    }
    const itemMap = new Map(LIFESTYLE_ITEMS.map(i => [i.id, i]));
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

  const buttonInsetShadow = {
    boxShadow:
      'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
  };

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
                <span className="font-semibold text-[#F8FAFC]">
                  {world ? `${singlesThisYear}/5 singles este año` : 'Hasta 5 singles/año'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => onNavigate('studio')}
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
            onClick={() => onNavigate('lifestyle')}
            className="w-full flex items-center justify-center gap-2 bg-[#16181F] hover:bg-[#06B6D4] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#06B6D4] font-semibold text-xs py-2.5 px-3 rounded-[8px] transition-all cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            title="Ver Catálogo de Mejoras y Bienes de Lujo"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#06B6D4] group-hover:text-white" />
            <span>Explorar Tienda</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TARJETA 3: GIRAS & SHOWS */}
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
              >
                {isTourReady ? 'Disponible (≥85% Energía)' : 'Bloqueado (<85% Energía)'}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px] group-hover:text-white transition-colors">
                Giras & Shows
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 font-normal leading-relaxed">
                {isTourReady
                  ? 'Organizar fechas, llenar estadios y recaudar ingresos millonarios de taquilla.'
                  : 'Requiere al menos 85% de energía vital para soportar el desgaste físico. ¡Tomá descanso!'}
              </p>
            </div>

            {/* Integrated Live Status Block */}
            <div
              className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] p-2.5 space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <Zap className={`w-3 h-3 ${isTourReady ? 'text-emerald-400' : 'text-rose-400'}`} />
                  Energía del Artista:
                </span>
                <span className={`font-bold ${isTourReady ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {player.stats.energy}/100 {isTourReady ? '(Apto)' : '(Baja)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-[#2A2E3D] pt-1">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                  Requisito Gira:
                </span>
                <span className="font-semibold text-[#F8FAFC]">Mínimo ≥85% Vitalidad</span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => {
              if (isTourReady) {
                onNavigate('tours');
              }
            }}
            disabled={!isTourReady}
            className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-[8px] transition-all cursor-pointer ${
              isTourReady
                ? 'bg-[#16181F] hover:bg-[#F59E0B] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#F59E0B] shadow-xs group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-[#16181F]/40 text-[#64748B] border border-[#2A2E3D]/40 cursor-not-allowed opacity-60'
            }`}
            title={isTourReady ? 'Armar y calendarizar gira musical' : 'Energía insuficiente para salir de gira (requiere ≥85%)'}
          >
            <Ticket className={`w-3.5 h-3.5 ${isTourReady ? 'text-[#F59E0B] group-hover:text-white' : ''}`} />
            <span>Armar Gira</span>
            <ArrowRight
              className={`w-3.5 h-3.5 ml-auto transition-all ${
                isTourReady ? 'opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5' : 'opacity-30'
              }`}
            />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TARJETA 4: DESCANSO */}
        {/* ========================================================================= */}
        <div className="group relative bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] hover:border-[#10B981]/60 border-l-4 border-l-[#10B981] rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header Icon + Dedicated Highlight Badge */}
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-[8px] border border-emerald-500/30 shadow-xs flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-[9999px] border border-emerald-500/30 shadow-xs">
                +50 Energía • 6 Meses
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px] group-hover:text-white transition-colors">
                Descanso
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 font-normal leading-relaxed">
                Vacaciones de 6 meses para desconectar de la prensa, recuperar vitalidad y percibir regalías.
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
                  <Clock className="w-3 h-3 text-emerald-400" />
                  Tiempo Empleado:
                </span>
                <span className="font-semibold text-[#F8FAFC]">Semestre Sabático (6M)</span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            id="btn-take-vacation"
            onClick={onRest}
            className="w-full flex items-center justify-center gap-2 bg-[#16181F] hover:bg-[#10B981] text-[#F8FAFC] hover:text-black border border-[#2A2E3D] hover:border-[#10B981] font-bold text-xs py-2.5 px-3 rounded-[8px] transition-all cursor-pointer shadow-xs group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            title="Tomar 6 meses de descanso y recuperar +50 de energía vital"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black fill-current" />
            <span>Tomar Vacaciones</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

      </div>
    </div>
  );
};
