import React, { useState } from 'react';
import { Artist, WorldState, TourTier } from '../types';
import { Sparkles, MapPin, Ticket, AlertTriangle, CheckCircle2, Zap, Disc3, Headphones, Info } from 'lucide-react';
import { TourEngine, MIN_TOUR_ENERGY, MIN_TOUR_LISTENERS, MIN_TOUR_SONGS } from '../systems/TourEngine';
import { playSound } from '../utils/audioSystem';
import { useTourRequirements } from '../hooks/useTourRequirements';
import { formatListeners } from '../utils/formatters';

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

  const tourGates = useTourRequirements(player, world);
  const isTourAllowed = tourGates.canTour;
  const availableTiers = TourEngine.getAvailableTiersForArtist(player);
  const playerTours = world?.tours ? world.tours.filter((t) => t.artistId === player?.id) : [];

  const tierDetails: Record<
    TourTier,
    { title: string; minPop: number; desc: string; estRevenue: string; fatigue: string }
  > = {
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

    if (!isTourAllowed) {
      alert(`No cumples con las compuertas de gira:\n• ${tourGates.missingReasons.join('\n• ')}`);
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
      {/* Header & Tour Gating Ribbon */}
      <div className="bg-[#16181F] p-6 rounded-[12px] border border-[#2A2E3D] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.9px] text-[#F8FAFC] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            Giras, Conciertos & En Vivo
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-normal">
            Llevá tu música al escenario real, vendé entradas, llená recintos y recaudá fondos para tu carrera.
          </p>
        </div>

        {/* 3 Tour Gates Quick Status Badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Gate 1: Catálogo */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border text-xs shadow-xs transition-colors ${
              tourGates.hasCatalog
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-400'
            }`}
            title={`Catálogo: ${tourGates.songsCount} singles, ${tourGates.albumsCount} EPs (Requiere ≥2 singles o 1 EP/Álbum)`}
          >
            <Disc3 className="w-3.5 h-3.5 shrink-0" />
            <span>Catálogo: {tourGates.songsCount}S • {tourGates.albumsCount}EP</span>
            {tourGates.hasCatalog ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="text-[10px] uppercase font-bold text-rose-400">(Mín 2S)</span>
            )}
          </div>

          {/* Gate 2: Oyentes */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border text-xs shadow-xs transition-colors ${
              tourGates.hasAudience
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-400'
            }`}
            title={`Oyentes Mensuales: ${player.stats.monthlyListeners.toLocaleString()} (Requiere ≥${MIN_TOUR_LISTENERS.toLocaleString()})`}
          >
            <Headphones className="w-3.5 h-3.5 shrink-0" />
            <span>{formatListeners(player.stats.monthlyListeners)}</span>
            {tourGates.hasAudience ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="text-[10px] uppercase font-bold text-rose-400">(Mín 1K)</span>
            )}
          </div>

          {/* Gate 3: Energía Vital */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border text-xs shadow-xs transition-colors ${
              tourGates.hasEnergy
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-400'
            }`}
            title={`Energía Vital: ${player.stats.energy}% (Requiere ≥${MIN_TOUR_ENERGY}%)`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>{player.stats.energy}% Energía</span>
            {tourGates.hasEnergy ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="text-[10px] uppercase font-bold text-rose-400">(Mín {MIN_TOUR_ENERGY}%)</span>
            )}
          </div>
        </div>
      </div>

      {/* Tour Requirements Restriction Alert Banner (Detailed Tooltip / Explanatory Breakdown) */}
      {!isTourAllowed && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-[12px] p-5 flex items-start gap-3.5 text-xs text-rose-200 shadow-md">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-rose-200 text-sm">
                Compuertas de Gira Bloqueadas ({tourGates.requirements.filter((r) => r.met).length}/3 Requisitos)
              </h3>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                Giras Inhabilitadas
              </span>
            </div>
            <p className="text-rose-300/90 leading-relaxed font-normal">
              Para asegurar el éxito de taquilla y la integridad física del artista, se requiere validar 3 compuertas obligatorias antes de salir de gira:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              {tourGates.requirements.map((req) => (
                <div
                  key={req.id}
                  className={`p-2.5 rounded-[8px] border text-xs ${
                    req.met
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span>{req.label}</span>
                    {req.met ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">✓ CUMPLIDO</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/30">✗ PENDIENTE</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    Actual: <strong className={req.met ? 'text-emerald-400' : 'text-rose-400'}>{req.currentValue}</strong> • Requerido: <strong>{req.requiredValue}</strong>
                  </div>
                  <p className="text-[10px] text-[#94A3B8]/90 mt-1">
                    {req.helpText}
                  </p>
                </div>
              ))}
            </div>
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
        <div className="border-b border-[#2A2E3D] pb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#F8FAFC] flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#8B5CF6]" />
            Organizar Nueva Gira de Conciertos
          </h2>
          <div
            className="cursor-help flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            title={tourGates.tooltipText}
          >
            <Info className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Condiciones de Gira</span>
          </div>
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
              onChange={(e) => setTourName(e.target.value)}
              className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Escala & Formato del Recinto
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as TourTier)}
              className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2 text-xs text-[#F8FAFC] focus:outline-none transition-colors"
            >
              {(Object.keys(tierDetails) as TourTier[]).map((t) => {
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
        <div
          className={`p-4 rounded-[8px] border border-[#2A2E3D] space-y-2 border-l-4 ${TIER_BORDER_COLORS[selectedTier]} ${TIER_BG_ACCENT[selectedTier]}`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#F8FAFC]">{tierDetails[selectedTier].title}</h3>
            <span className="text-xs text-[#94A3B8]">
              Ganancia Est: <strong className="text-[#F8FAFC] font-semibold">{tierDetails[selectedTier].estRevenue}</strong>
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-normal">{tierDetails[selectedTier].desc}</p>
          <div className="flex items-center gap-4 text-xs text-[#94A3B8] pt-1">
            <span>
              Desgaste: <strong className="text-rose-400 font-semibold">{tierDetails[selectedTier].fatigue}</strong>
            </span>
            <span>•</span>
            <span>Impulso de Hype & Fans Masivo</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2A2E3D]">
          <div className="text-xs text-[#94A3B8]">
            {!isTourAllowed && (
              <span
                className="text-rose-400 font-semibold flex items-center gap-1 cursor-help"
                title={tourGates.tooltipText}
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Giras bloqueadas hasta validar catálogo (≥2S/1EP), oyentes (≥1.000) y energía (≥85%).</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isTourAllowed}
            title={tourGates.tooltipText}
            className={`font-semibold text-xs px-5 py-2.5 rounded-[6px] transition-all flex items-center gap-2 ${
              isTourAllowed
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-98 cursor-pointer'
                : 'bg-[#2A2E3D] text-[#94A3B8] cursor-not-allowed opacity-60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTourAllowed ? 'Iniciar Gira & Vender Entradas' : 'Requisitos Insuficientes para Gira'}</span>
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
          <div className="text-center py-8 text-[#94A3B8] text-xs">No has realizado ninguna gira todavía.</div>
        ) : (
          <div className="space-y-3">
            {playerTours.map((t) => {
              const ticketBadge = getTicketBadge(t.totalTicketsSold, t.totalCapacity);
              return (
                <div
                  key={t.id}
                  className={`bg-[#0B0C10] p-4 rounded-[8px] border border-[#2A2E3D] flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${TIER_BORDER_COLORS[t.tier]} hover:border-[#8B5CF6]/50 hover:bg-[#16181F] transition-all`}
                >
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
                      Año {t.year} • {t.stops?.length || 0} Ciudades • {(t.totalTicketsSold || 0).toLocaleString('es-AR')} de {(t.totalCapacity || 0).toLocaleString('es-AR')} Tickets Vendidos
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#94A3B8] block font-normal">Ganancia Neta</span>
                    <span className="text-sm font-semibold text-emerald-400 font-mono">
                      +${(t.netArtistProfit || 0).toLocaleString('es-AR')}
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
