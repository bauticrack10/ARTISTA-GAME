import React, { useState } from 'react';
import { Artist, WorldState, TourTier } from '../types';
import { Sparkles, MapPin, Ticket, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { TourEngine, MIN_TOUR_ENERGY } from '../systems/TourEngine';
import { playSound } from '../utils/audioSystem';


interface ToursViewProps {
  player: Artist;
  world: WorldState;
  onBookTour: (tier: TourTier, name: string) => void;
}

// Color mapping for venue tiers — matches the accent palette from design.md
const TIER_BORDER_COLORS: Record<TourTier, string> = {
  club: 'border-l-emerald-500',
  theater: 'border-l-cyan-500',
  arena: 'border-l-blue-500',
  festival_circuit: 'border-l-purple-500',
  stadium: 'border-l-amber-500',
  world_tour: 'border-l-rose-500'
};

const TIER_BG_ACCENT: Record<TourTier, string> = {
  club: 'bg-emerald-950/20 border-emerald-500/30',
  theater: 'bg-cyan-950/20 border-cyan-500/30',
  arena: 'bg-blue-950/20 border-blue-500/30',
  festival_circuit: 'bg-purple-950/20 border-purple-500/30',
  stadium: 'bg-amber-950/20 border-amber-500/30',
  world_tour: 'bg-rose-950/20 border-rose-500/30'
};

const TIER_BADGE_COLORS: Record<TourTier, string> = {
  club: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
  theater: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40',
  arena: 'bg-blue-950/60 text-blue-400 border-blue-500/40',
  festival_circuit: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
  stadium: 'bg-amber-950/60 text-amber-400 border-amber-500/40',
  world_tour: 'bg-rose-950/60 text-rose-400 border-rose-500/40'
};

const getTicketBadge = (sold: number, capacity: number) => {
  const ratio = capacity > 0 ? sold / capacity : 0;
  if (ratio >= 0.95) {
    return {
      label: 'SOLD OUT',
      cls: 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
    };
  }
  if (ratio >= 0.60) {
    return {
      label: `${Math.round(ratio * 100)}% vendido`,
      cls: 'bg-amber-950/70 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
    };
  }
  return {
    label: `${Math.round(ratio * 100)}% vendido`,
    cls: 'bg-rose-950/70 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
  };
};

export const ToursView: React.FC<ToursViewProps> = ({ player, world, onBookTour }) => {
  const [tourName, setTourName] = useState('');
  const [selectedTier, setSelectedTier] = useState<TourTier>('club');
  const [notification, setNotification] = useState<string | null>(null);

  const isEnergySufficient = player.stats.energy >= MIN_TOUR_ENERGY;
  const availableTiers = TourEngine.getAvailableTiersForArtist(player);
  const playerTours = world.tours.filter(t => t.artistId === player.id);

  const tierDetails: Record<TourTier, { title: string; minPop: number; desc: string; estRevenue: string; fatigue: string }> = {
    club: {
      title: 'Gira por Clubes & Boliches Underground',
      minPop: 0,
      desc: 'Fechas íntimas en recintos de 500 a 1.000 personas. Ideal para forjar los primeros seguidores fieles.',
      estRevenue: '$20,000 - $60,000',
      fatigue: '-15% Energía'
    },
    theater: {
      title: 'Circuito de Teatros Históricos',
      minPop: 25,
      desc: 'Salas emblemáticas de 2.000 a 4.000 butacas con sonido de alta fidelidad y público melómano.',
      estRevenue: '$80,000 - $250,000',
      fatigue: '-22% Energía'
    },
    arena: {
      title: 'Gira Nacional de Arenas',
      minPop: 50,
      desc: 'Movistar Arenas, WiZink Center y recintos cerrados de 12.000 a 18.000 personas con gran producción visual.',
      estRevenue: '$350,000 - $1,200,000',
      fatigue: '-30% Energía'
    },
    festival_circuit: {
      title: 'Headliner en Festivales Internacionales',
      minPop: 70,
      desc: 'Lollapalooza, Coachella, Primavera Sound y festivales masivos ante multitudes de 30.000 a 80.000 fans.',
      estRevenue: '$600,000 - $2,000,000',
      fatigue: '-32% Energía'
    },
    stadium: {
      title: 'Estadios Monumentales',
      minPop: 80,
      desc: 'Vélez Sarsfield, River Plate, Santiago Bernabéu, Foro Sol. 45.000 a 80.000 personas por noche.',
      estRevenue: '$1,500,000 - $5,000,000',
      fatigue: '-40% Energía'
    },
    world_tour: {
      title: 'World Stadium Tour (Gira Mundial)',
      minPop: 85,
      desc: 'Dominio transcontinental por América Latina, Estados Unidos y Europa con producción planetaria.',
      estRevenue: '$5,000,000 - $20,000,000',
      fatigue: '-50% Energía'
    }
  };

  const handleStartTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourName.trim()) return;

    if (!isEnergySufficient) {
      alert(`Tu artista tiene ${player.stats.energy}% de energía. Se requiere un mínimo estricto de ${MIN_TOUR_ENERGY}% de energía para salir de gira. ¡Tomá un Descanso / Vacaciones de 6 meses antes!`);
      return;
    }

    onBookTour(selectedTier, tourName);
    playSound('tour');
    setNotification(`¡La gira "${tourName}" ha sido completada con rotundo éxito!`);
    setTourName('');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto space-y-6 pb-12 text-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#16181F] p-6 rounded-[12px] border border-[#2A2E3D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.9px] text-[#F8FAFC] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            Giras, Conciertos & En Vivo
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-normal">
            Llevá tu música al escenario real, vendé entradas, llená recintos y recaudá fondos para tu carrera.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] border text-xs ${
          !isEnergySufficient
            ? 'bg-rose-950/40 border-rose-500/40'
            : player.stats.energy < MIN_TOUR_ENERGY + 15
            ? 'bg-amber-950/40 border-amber-500/40'
            : 'bg-[#0B0C10] border-[#2A2E3D]'
        }`}>
          <Zap className={`w-4 h-4 ${
            !isEnergySufficient ? 'text-rose-400' : player.stats.energy < MIN_TOUR_ENERGY + 15 ? 'text-amber-400' : 'text-emerald-400'
          }`} />
          <span className="text-[#94A3B8]">Energía Actual:</span>
          <span className={`font-semibold ${
            !isEnergySufficient ? 'text-rose-400' : player.stats.energy < MIN_TOUR_ENERGY + 15 ? 'text-amber-400' : 'text-[#F8FAFC]'
          }`}>
            {player.stats.energy}%
          </span>
          <span className="text-[#94A3B8]">/ Mín {MIN_TOUR_ENERGY}%</span>
          {player.stats.energy < MIN_TOUR_ENERGY + 15 && isEnergySufficient && (
            <span className="text-[10px] bg-amber-900/50 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-[4px] font-semibold uppercase ml-1">⚠ Baja</span>
          )}
        </div>
      </div>

      {/* Energy Restriction Alert Banner */}
      {!isEnergySufficient && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-[12px] p-4 flex items-start gap-3 text-xs text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-rose-200">
              Energía insuficiente para salir de gira (Tienes {player.stats.energy}% / Mínimo requerido {MIN_TOUR_ENERGY}%)
            </h3>
            <p className="text-rose-300/90 leading-relaxed font-normal">
              Las giras de conciertos exigen una preparación física y vocal intensa. Con menos de {MIN_TOUR_ENERGY}% de energía, la acción de gira permanece deshabilitada para evitar colapsos.
              Te recomendamos ir al <strong>Inicio</strong> y realizar la acción <strong>Descanso / Vacaciones (6 Meses)</strong> para recuperar +50 de energía.
            </p>
          </div>
        </div>
      )}

      {notification && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-[12px] flex items-center gap-2 text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Tour Booking Form */}
      <form onSubmit={handleStartTour} className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-6 space-y-6 shadow-sm">
        <div className="border-b border-[#2A2E3D] pb-3">
          <h2 className="text-base font-semibold text-[#F8FAFC] flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#8B5CF6]" />
            Organizar Nueva Gira de Conciertos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Nombre de la Gira *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Tour Inmortal 2026, Noches de Fuego Live..."
              value={tourName}
              onChange={e => setTourName(e.target.value)}
              className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Escala & Formato del Recinto
            </label>
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value as TourTier)}
              className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2 text-xs text-[#F8FAFC] focus:outline-none transition-colors"
            >
              {(Object.keys(tierDetails) as TourTier[]).map(t => {
                const isUnlocked = availableTiers.includes(t);
                return (
                  <option key={t} value={t} disabled={!isUnlocked} className="bg-[#0B0C10] text-[#F8FAFC]">
                    {tierDetails[t].title} {isUnlocked ? '' : `(Requiere Pop ${tierDetails[t].minPop}+)`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Selected Tier Info Card */}
        <div className={`p-4 rounded-[8px] border border-[#2A2E3D] space-y-2 border-l-4 ${TIER_BORDER_COLORS[selectedTier]} ${TIER_BG_ACCENT[selectedTier]}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#F8FAFC]">
              {tierDetails[selectedTier].title}
            </h3>
            <span className="text-xs text-[#94A3B8]">
              Ganancia Est: <strong className="text-[#F8FAFC] font-semibold">{tierDetails[selectedTier].estRevenue}</strong>
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-normal">
            {tierDetails[selectedTier].desc}
          </p>
          <div className="flex items-center gap-4 text-xs text-[#94A3B8] pt-1">
            <span>Desgaste: <strong className="text-rose-400 font-semibold">{tierDetails[selectedTier].fatigue}</strong></span>
            <span>•</span>
            <span>Impulso de Hype & Fans Masivo</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2A2E3D]">
          <div className="text-xs text-[#94A3B8]">
            {!isEnergySufficient && (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Giras deshabilitadas hasta recuperar al menos {MIN_TOUR_ENERGY}% de energía.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isEnergySufficient}
            className={`font-semibold text-xs px-5 py-2.5 rounded-[6px] transition-all flex items-center gap-2 ${
              isEnergySufficient
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-98 cursor-pointer'
                : 'bg-[#2A2E3D] text-[#94A3B8] cursor-not-allowed opacity-60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isEnergySufficient
                ? 'Iniciar Gira & Vender Entradas'
                : `Energía Insuficiente (Mín ${MIN_TOUR_ENERGY}%)`}
            </span>
          </button>
        </div>
      </form>

      {/* History of Tours */}
      <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold text-[#F8FAFC] flex items-center gap-2 border-b border-[#2A2E3D] pb-3">
          <MapPin className="w-4 h-4 text-[#06B6D4]" />
          Historial de Giras Realizadas ({playerTours.length})
        </h2>

        {playerTours.length === 0 ? (
          <div className="text-center py-8 text-[#94A3B8] text-xs">
            No has realizado ninguna gira todavía.
          </div>
        ) : (
          <div className="space-y-3">
            {playerTours.map(t => {
              const ticketBadge = getTicketBadge(t.totalTicketsSold, t.totalCapacity);
              return (
              <div key={t.id} className={`bg-[#0B0C10] p-4 rounded-[8px] border border-[#2A2E3D] flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${TIER_BORDER_COLORS[t.tier]} hover:border-[#8B5CF6]/50 hover:bg-[#16181F] transition-all`}>
                <div>
                  <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
                    {t.name}
                    <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-semibold uppercase border ${TIER_BADGE_COLORS[t.tier]}`}>
                      {t.tier}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-semibold ${ticketBadge.cls}`}>
                      {ticketBadge.label}
                    </span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 font-normal">
                    Año {t.year} • {t.stops.length} Ciudades • {t.totalTicketsSold.toLocaleString()} de {t.totalCapacity.toLocaleString()} Tickets Vendidos
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#94A3B8] block font-normal">Ganancia Neta</span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">
                    +${t.netArtistProfit.toLocaleString()}
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
