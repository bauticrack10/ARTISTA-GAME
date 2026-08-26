import React, { useState } from 'react';
import { Artist, WorldState, TourTier } from '../types';
import { Sparkles, MapPin, Ticket, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { TourEngine, MIN_TOUR_ENERGY } from '../systems/TourEngine';

interface ToursViewProps {
  player: Artist;
  world: WorldState;
  onBookTour: (tier: TourTier, name: string) => void;
}

// Color mapping for venue tiers — matches the accent palette from design.md
const TIER_BORDER_COLORS: Record<TourTier, string> = {
  club: 'border-l-emerald-400',
  theater: 'border-l-blue-400',
  arena: 'border-l-blue-400',
  festival_circuit: 'border-l-purple-400',
  stadium: 'border-l-amber-400',
  world_tour: 'border-l-amber-400'
};

const TIER_BG_ACCENT: Record<TourTier, string> = {
  club: 'bg-emerald-50',
  theater: 'bg-blue-50',
  arena: 'bg-blue-50',
  festival_circuit: 'bg-purple-50',
  stadium: 'bg-amber-50',
  world_tour: 'bg-amber-50'
};

const TIER_BADGE_COLORS: Record<TourTier, string> = {
  club: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  theater: 'bg-blue-100 text-blue-800 border-blue-200',
  arena: 'bg-blue-100 text-blue-800 border-blue-200',
  festival_circuit: 'bg-purple-100 text-purple-800 border-purple-200',
  stadium: 'bg-amber-100 text-amber-800 border-amber-200',
  world_tour: 'bg-amber-100 text-amber-800 border-amber-200'
};

const getTicketBadge = (sold: number, capacity: number) => {
  const ratio = capacity > 0 ? sold / capacity : 0;
  if (ratio >= 0.95) return { label: 'SOLD OUT', cls: 'bg-emerald-100 text-emerald-800 border border-emerald-200' };
  if (ratio >= 0.60) return { label: `${Math.round(ratio * 100)}% vendido`, cls: 'bg-amber-100 text-amber-800 border border-amber-200' };
  return { label: `${Math.round(ratio * 100)}% vendido`, cls: 'bg-rose-100 text-rose-800 border border-rose-200' };
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
    setNotification(`¡La gira "${tourName}" ha sido completada con rotundo éxito!`);
    setTourName('');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#f7f4ed] p-6 rounded-[12px] border border-[#eceae4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.9px] text-[#1c1c1c] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1c1c1c]" />
            Giras, Conciertos & En Vivo
          </h1>
          <p className="text-xs text-[#5f5f5d] mt-1 font-normal">
            Llevá tu música al escenario real, vendé entradas, llená recintos y recaudá fondos para tu carrera.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] border text-xs ${
          !isEnergySufficient
            ? 'bg-rose-50 border-rose-200'
            : player.stats.energy < MIN_TOUR_ENERGY + 15
            ? 'bg-amber-50 border-amber-200'
            : 'bg-[#f7f4ed] border-[#eceae4]'
        }`}>
          <Zap className={`w-4 h-4 ${
            !isEnergySufficient ? 'text-rose-700' : player.stats.energy < MIN_TOUR_ENERGY + 15 ? 'text-amber-600' : 'text-emerald-700'
          }`} />
          <span className="text-[#5f5f5d]">Energía Actual:</span>
          <span className={`font-semibold ${
            !isEnergySufficient ? 'text-rose-700' : player.stats.energy < MIN_TOUR_ENERGY + 15 ? 'text-amber-700' : 'text-[#1c1c1c]'
          }`}>
            {player.stats.energy}%
          </span>
          <span className="text-[#5f5f5d]">/ Mín {MIN_TOUR_ENERGY}%</span>
          {player.stats.energy < MIN_TOUR_ENERGY + 15 && isEnergySufficient && (
            <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-[4px] font-semibold uppercase ml-1">⚠ Baja</span>
          )}
        </div>
      </div>

      {/* Energy Restriction Alert Banner */}
      {!isEnergySufficient && (
        <div className="bg-rose-50 border border-rose-200 rounded-[12px] p-4 flex items-start gap-3 text-xs text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-rose-900">
              Energía insuficiente para salir de gira (Tienes {player.stats.energy}% / Mínimo requerido {MIN_TOUR_ENERGY}%)
            </h3>
            <p className="text-rose-800 leading-relaxed font-normal">
              Las giras de conciertos exigen una preparación física y vocal intensa. Con menos de {MIN_TOUR_ENERGY}% de energía, la acción de gira permanece deshabilitada para evitar colapsos.
              Te recomendamos ir al <strong>Inicio</strong> y realizar la acción <strong>Descanso / Vacaciones (6 Meses)</strong> para recuperar +50 de energía.
            </p>
          </div>
        </div>
      )}

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-[12px] flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          {notification}
        </div>
      )}

      {/* Tour Booking Form */}
      <form onSubmit={handleStartTour} className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-6">
        <div className="border-b border-[#eceae4] pb-3">
          <h2 className="text-base font-semibold text-[#1c1c1c] flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#1c1c1c]" />
            Organizar Nueva Gira de Conciertos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider mb-1.5">
              Nombre de la Gira *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Tour Inmortal 2026, Noches de Fuego Live..."
              value={tourName}
              onChange={e => setTourName(e.target.value)}
              className="w-full bg-[#f7f4ed] border border-[#eceae4] focus:border-[rgba(28,28,28,0.4)] rounded-[6px] px-3.5 py-2 text-xs text-[#1c1c1c] placeholder:text-[#5f5f5d] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider mb-1.5">
              Escala & Formato del Recinto
            </label>
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value as TourTier)}
              className="w-full bg-[#f7f4ed] border border-[#eceae4] focus:border-[rgba(28,28,28,0.4)] rounded-[6px] px-3.5 py-2 text-xs text-[#1c1c1c] focus:outline-none transition-colors"
            >
              {(Object.keys(tierDetails) as TourTier[]).map(t => {
                const isUnlocked = availableTiers.includes(t);
                return (
                  <option key={t} value={t} disabled={!isUnlocked}>
                    {tierDetails[t].title} {isUnlocked ? '' : `(Requiere Pop ${tierDetails[t].minPop}+)`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Selected Tier Info Card */}
        <div className={`p-4 rounded-[8px] border border-[#eceae4] space-y-2 border-l-4 ${TIER_BORDER_COLORS[selectedTier]} ${TIER_BG_ACCENT[selectedTier]}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#1c1c1c]">
              {tierDetails[selectedTier].title}
            </h3>
            <span className="text-xs text-[#5f5f5d]">
              Ganancia Est: <strong className="text-[#1c1c1c] font-semibold">{tierDetails[selectedTier].estRevenue}</strong>
            </span>
          </div>
          <p className="text-xs text-[#5f5f5d] font-normal">
            {tierDetails[selectedTier].desc}
          </p>
          <div className="flex items-center gap-4 text-xs text-[#5f5f5d] pt-1">
            <span>Desgaste: <strong className="text-rose-700 font-semibold">{tierDetails[selectedTier].fatigue}</strong></span>
            <span>•</span>
            <span>Impulso de Hype & Fans Masivo</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#eceae4]">
          <div className="text-xs text-[#5f5f5d]">
            {!isEnergySufficient && (
              <span className="text-rose-700 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Giras deshabilitadas hasta recuperar al menos {MIN_TOUR_ENERGY}% de energía.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isEnergySufficient}
            className={`font-semibold text-xs px-5 py-2.5 rounded-[6px] transition-all flex items-center gap-2 ${
              isEnergySufficient
                ? 'bg-[#1c1c1c] text-[#fcfbf8] hover:opacity-90 active:opacity-80 cursor-pointer'
                : 'bg-[#eceae4] text-[#5f5f5d] cursor-not-allowed opacity-70'
            }`}
            style={
              isEnergySufficient
                ? {
                    boxShadow:
                      'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
                  }
                : {}
            }
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
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#1c1c1c] flex items-center gap-2 border-b border-[#eceae4] pb-3">
          <MapPin className="w-4 h-4 text-[#1c1c1c]" />
          Historial de Giras Realizadas ({playerTours.length})
        </h2>

        {playerTours.length === 0 ? (
          <div className="text-center py-8 text-[#5f5f5d] text-xs">
            No has realizado ninguna gira todavía.
          </div>
        ) : (
          <div className="space-y-3">
            {playerTours.map(t => {
              const ticketBadge = getTicketBadge(t.totalTicketsSold, t.totalCapacity);
              return (
              <div key={t.id} className={`p-4 rounded-[8px] border border-[#eceae4] flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${TIER_BORDER_COLORS[t.tier]} hover:scale-[1.02] hover:shadow-md transition-all`}>
                <div>
                  <h3 className="text-sm font-semibold text-[#1c1c1c] flex items-center gap-2">
                    {t.name}
                    <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-semibold uppercase border ${TIER_BADGE_COLORS[t.tier]}`}>
                      {t.tier}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-semibold ${ticketBadge.cls}`}>
                      {ticketBadge.label}
                    </span>
                  </h3>
                  <p className="text-xs text-[#5f5f5d] mt-1 font-normal">
                    Año {t.year} • {t.stops.length} Ciudades • {t.totalTicketsSold.toLocaleString()} de {t.totalCapacity.toLocaleString()} Tickets Vendidos
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#5f5f5d] block font-normal">Ganancia Neta</span>
                  <span className="text-sm font-semibold text-emerald-700">
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
