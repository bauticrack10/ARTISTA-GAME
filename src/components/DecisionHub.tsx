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
        <div className="group relative bg-[#f7f4ed] hover:bg-[#fcfbf8] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header Icon + Category Badge */}
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-purple-100 text-purple-900 rounded-[8px] border border-purple-200 shadow-xs flex items-center justify-center">
                <Disc3 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-900 bg-purple-100/90 px-2.5 py-0.5 rounded-[9999px] border border-purple-200">
                Producción Musical
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#1c1c1c] tracking-[-0.3px] group-hover:text-black transition-colors">
                Estudio & Álbumes
              </h3>
              <p className="text-xs text-[#5f5f5d] mt-1 font-normal leading-relaxed">
                Componer singles, estructurar álbumes y colaborar con productores de élite.
              </p>
            </div>

            {/* Energy / Cost Summary Block */}
            <div className="bg-[#fcfbf8] group-hover:bg-[#f7f4ed] border border-[#eceae4] rounded-[8px] p-2.5 space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#5f5f5d] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600" />
                  Costo de Energía:
                </span>
                <span className="font-semibold text-[#1c1c1c]">-15 por single</span>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-[#eceae4]/60 pt-1">
                <span className="text-[#5f5f5d] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-600" />
                  Cupo Anual:
                </span>
                <span className="font-semibold text-[#1c1c1c]">
                  {world ? `${singlesThisYear}/5 singles este año` : 'Hasta 5 singles/año'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => onNavigate('studio')}
            className="w-full flex items-center justify-center gap-2 bg-[#1c1c1c] hover:opacity-90 active:scale-[0.98] text-[#fcfbf8] font-semibold text-xs py-2.5 px-3 rounded-[6px] transition-all cursor-pointer shadow-xs"
            style={buttonInsetShadow}
            title="Entrar al Estudio de Grabación"
          >
            <Mic2 className="w-3.5 h-3.5" />
            <span>Entrar a Grabar</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TARJETA 2: TIENDA & LUJO */}
        {/* ========================================================================= */}
        <div className="group relative bg-[#f7f4ed] hover:bg-[#fcfbf8] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header Icon + Category Badge */}
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-cyan-100 text-cyan-900 rounded-[8px] border border-cyan-200 shadow-xs flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-900 bg-cyan-100/90 px-2.5 py-0.5 rounded-[9999px] border border-cyan-200">
                Buffs Pasivos
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#1c1c1c] tracking-[-0.3px] group-hover:text-black transition-colors">
                Tienda & Lujo
              </h3>
              <p className="text-xs text-[#5f5f5d] mt-1 font-normal leading-relaxed">
                Micrófonos Neumann, consolas SSL, mansiones y autos para buffs permanentes.
              </p>
            </div>

            {/* Passive Buffs Indicator Block */}
            <div className="bg-[#fcfbf8] group-hover:bg-[#f7f4ed] border border-[#eceae4] rounded-[8px] p-2.5 space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#5f5f5d] flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-cyan-600" />
                  Mejoras Compradas:
                </span>
                <span className="font-semibold text-[#1c1c1c]">
                  {ownedUpgradesCount} de {totalLifestyleItemsCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-[#eceae4]/60 pt-1">
                <span className="text-[#5f5f5d] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-600" />
                  Efectos Activos:
                </span>
                <span className="font-semibold text-[#1c1c1c] truncate max-w-[130px]" title={lifestyleBuffsSummary}>
                  {lifestyleBuffsSummary}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => onNavigate('lifestyle')}
            className="w-full flex items-center justify-center gap-2 bg-[#1c1c1c] hover:opacity-90 active:scale-[0.98] text-[#fcfbf8] font-semibold text-xs py-2.5 px-3 rounded-[6px] transition-all cursor-pointer shadow-xs"
            style={buttonInsetShadow}
            title="Ver Catálogo de Mejoras y Bienes de Lujo"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
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
              ? 'bg-[#f7f4ed] hover:bg-[#fcfbf8] border-[#eceae4] hover:border-[rgba(28,28,28,0.4)]'
              : 'bg-rose-50/70 hover:bg-rose-50/90 border-rose-200'
          }`}
        >
          <div className="space-y-3">
            {/* Header Icon + Integrated State Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`p-2.5 rounded-[8px] border shadow-xs flex items-center justify-center ${
                  isTourReady
                    ? 'bg-amber-100 text-amber-900 border-amber-200'
                    : 'bg-rose-100 text-rose-900 border-rose-200'
                }`}
              >
                <Ticket className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-[9999px] border ${
                  isTourReady
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border-rose-300'
                }`}
              >
                {isTourReady ? 'Disponible (≥85% Energía)' : 'Bloqueado por baja energía (<85%)'}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#1c1c1c] tracking-[-0.3px] group-hover:text-black transition-colors">
                Giras & Shows
              </h3>
              <p className="text-xs text-[#5f5f5d] mt-1 font-normal leading-relaxed">
                {isTourReady
                  ? 'Organizar fechas, llenar estadios y recaudar ingresos millonarios de taquilla.'
                  : 'Requiere al menos 85% de energía vital para soportar el desgaste físico. ¡Tomá descanso!'}
              </p>
            </div>

            {/* Integrated Live Status Block */}
            <div
              className={`border rounded-[8px] p-2.5 space-y-1.5 transition-colors ${
                isTourReady
                  ? 'bg-[#fcfbf8] group-hover:bg-[#f7f4ed] border-[#eceae4]'
                  : 'bg-rose-100/50 border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#5f5f5d] flex items-center gap-1">
                  <Zap className={`w-3 h-3 ${isTourReady ? 'text-emerald-600' : 'text-rose-600'}`} />
                  Energía del Artista:
                </span>
                <span className={`font-bold ${isTourReady ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {player.stats.energy}/100 {isTourReady ? '(Apto)' : '(Baja)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-[#eceae4]/60 pt-1">
                <span className="text-[#5f5f5d] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Requisito Gira:
                </span>
                <span className="font-semibold text-[#1c1c1c]">Mínimo ≥85% Vitalidad</span>
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
            className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-3 rounded-[6px] transition-all cursor-pointer ${
              isTourReady
                ? 'bg-[#1c1c1c] text-[#fcfbf8] hover:opacity-90 active:scale-[0.98] shadow-xs'
                : 'bg-[#eceae4] text-[#5f5f5d] cursor-not-allowed opacity-75'
            }`}
            style={isTourReady ? buttonInsetShadow : {}}
            title={isTourReady ? 'Armar y calendarizar gira musical' : 'Energía insuficiente para salir de gira (requiere ≥85%)'}
          >
            <Ticket className="w-3.5 h-3.5" />
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
        <div className="group relative bg-[#f7f4ed] hover:bg-[#fcfbf8] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] rounded-[14px] p-5 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header Icon + Dedicated Highlight Badge */}
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-[8px] border border-emerald-200 shadow-xs flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-[9999px] border border-emerald-300 shadow-2xs">
                +50 Energía • Consume 6 Meses
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-[#1c1c1c] tracking-[-0.3px] group-hover:text-black transition-colors">
                Descanso
              </h3>
              <p className="text-xs text-[#5f5f5d] mt-1 font-normal leading-relaxed">
                Vacaciones de 6 meses para desconectar de la prensa, recuperar vitalidad y percibir regalías.
              </p>
            </div>

            {/* Recharge Breakdown Block */}
            <div className="bg-[#fcfbf8] group-hover:bg-[#f7f4ed] border border-[#eceae4] rounded-[8px] p-2.5 space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#5f5f5d] flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-600" />
                  Recarga Inmediata:
                </span>
                <span className="font-bold text-emerald-800">+50 Vitalidad (Tope 100)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-[#eceae4]/60 pt-1">
                <span className="text-[#5f5f5d] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  Tiempo Empleado:
                </span>
                <span className="font-semibold text-[#1c1c1c]">Semestre Sabático (6M)</span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            id="btn-take-vacation"
            onClick={onRest}
            className="w-full flex items-center justify-center gap-2 bg-[#1c1c1c] hover:opacity-90 active:scale-[0.98] text-[#fcfbf8] font-semibold text-xs py-2.5 px-3 rounded-[6px] transition-all cursor-pointer shadow-xs"
            style={buttonInsetShadow}
            title="Tomar 6 meses de descanso y recuperar +50 de energía vital"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-current" />
            <span>Tomar Vacaciones</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

      </div>
    </div>
  );
};
