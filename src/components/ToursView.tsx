import React, { useState } from 'react';
import { Artist, WorldState, TourTier, Tour } from '../types';
import { Sparkles, MapPin, Ticket, DollarSign, Zap, Flame, Users, CheckCircle2 } from 'lucide-react';
import { TourEngine } from '../systems/TourEngine';

interface ToursViewProps {
  player: Artist;
  world: WorldState;
  onBookTour: (tier: TourTier, name: string) => void;
}

export const ToursView: React.FC<ToursViewProps> = ({ player, world, onBookTour }) => {
  const [tourName, setTourName] = useState('');
  const [selectedTier, setSelectedTier] = useState<TourTier>('club');
  const [notification, setNotification] = useState<string | null>(null);

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

    if (player.stats.energy < 25) {
      alert('Tu artista está demasiado exhausto para salir de gira. ¡Descansá primero!');
      return;
    }

    onBookTour(selectedTier, tourName);
    setNotification(`¡La gira "${tourName}" ha sido completada con rotundo éxito!`);
    setTourName('');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Giras, Conciertos & En Vivo
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Llevá tu música al escenario real, vendé entradas, llená estadios y recaudá fondos millonarios.
          </p>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Tour Booking Form */}
      <form onSubmit={handleStartTour} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="border-b border-zinc-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-400" />
            Organizar Nueva Gira de Conciertos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Nombre de la Gira *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Tour Inmortal 2026, Noches de Fuego Live..."
              value={tourName}
              onChange={e => setTourName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Escala & Formato del Recinto
            </label>
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value as TourTier)}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
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
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-amber-400">
              {tierDetails[selectedTier].title}
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              Ganancia Est: <strong className="text-emerald-400">{tierDetails[selectedTier].estRevenue}</strong>
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            {tierDetails[selectedTier].desc}
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
            <span>Desgaste: <strong className="text-rose-400">{tierDetails[selectedTier].fatigue}</strong></span>
            <span>•</span>
            <span>Impulso de Hype & Fans Masivo</span>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg shadow-amber-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Iniciar Gira & Vender Entradas</span>
          </button>
        </div>
      </form>

      {/* History of Tours */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <MapPin className="w-4 h-4 text-rose-400" />
          Historial de Giras Realizadas ({playerTours.length})
        </h2>

        {playerTours.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs">
            No has realizado ninguna gira todavía.
          </div>
        ) : (
          <div className="space-y-3">
            {playerTours.map(t => (
              <div key={t.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {t.name}
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold uppercase">
                      {t.tier}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Año {t.year} • {t.stops.length} Ciudades • {t.totalTicketsSold.toLocaleString()} de {t.totalCapacity.toLocaleString()} Tickets Vendidos
                  </p>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs text-zinc-400 block">Ganancia Neta</span>
                  <span className="text-base font-black text-emerald-400">
                    +${t.netArtistProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
