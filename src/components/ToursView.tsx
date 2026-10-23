import React, { useState } from 'react';
import {
  Artist,
  WorldState,
  TourTier,
  GlobalFestival,
  FestivalSlot,
  FestivalInvitation,
  StageProductionConfig,
  LiveShowResult
} from '../types';
import {
  Sparkles,
  MapPin,
  Ticket,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Disc3,
  Headphones,
  Info,
  Calendar,
  Flame,
  Star,
  Users,
  Mic2,
  Tv,
  ArrowRight
} from 'lucide-react';
import { TourEngine, MIN_TOUR_ENERGY, MIN_TOUR_LISTENERS, MIN_TOUR_SONGS } from '../systems/TourEngine';
import { GLOBAL_FESTIVALS, FestivalEngine } from '../systems/FestivalEngine';
import { playSound } from '../utils/audioSystem';
import { useTourRequirements } from '../hooks/useTourRequirements';
import { formatListeners, formatMoney } from '../utils/formatters';
import { LiveShowModal } from './LiveShowModal';

interface ToursViewProps {
  player: Artist;
  world: WorldState;
  onBookTour: (tier: TourTier, name: string) => void;
  onExecuteLiveShow?: (params: {
    festivalId: string;
    slot: FestivalSlot;
    setlistSongIds: string[];
    production: StageProductionConfig;
    dilemmaId?: string;
    dilemmaChoiceId?: string;
    invitationId?: string;
  }) => LiveShowResult;
}

// Color mapping for venue tiers — matches the accent palette from design.md
const TIER_BORDER_COLORS: Record<TourTier, string> = {
  club: 'border-l-emerald-500',
  theater: 'border-l-cyan-500',
  arena: 'border-l-blue-500',
  festival_circuit: 'border-l-orange-500',
  stadium: 'border-l-amber-500',
  world_tour: 'border-l-rose-500'
};

const TIER_BG_ACCENT: Record<TourTier, string> = {
  club: 'bg-emerald-950/20 border-emerald-500/30',
  theater: 'bg-cyan-950/20 border-cyan-500/30',
  arena: 'bg-blue-950/20 border-blue-500/30',
  festival_circuit: 'bg-orange-950/20 border-orange-500/30',
  stadium: 'bg-amber-950/20 border-amber-500/30',
  world_tour: 'bg-rose-950/20 border-rose-500/30'
};

const TIER_BADGE_COLORS: Record<TourTier, string> = {
  club: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
  theater: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40',
  arena: 'bg-blue-950/60 text-blue-400 border-blue-500/40',
  festival_circuit: 'bg-orange-950/60 text-orange-300 border-orange-500/40',
  stadium: 'bg-amber-950/60 text-amber-400 border-amber-500/40',
  world_tour: 'bg-rose-950/60 text-rose-400 border-rose-500/40'
};

const getTicketBadge = (sold: number, capacity: number) => {
  const ratio = capacity > 0 ? sold / capacity : 0;
  if (ratio >= 0.95) {
    return {
      label: 'SOLD OUT',
      cls: 'bg-[#00E599]/10 text-[#00E599] border border-[#00E599]/30 font-mono font-bold'
    };
  }
  if (ratio >= 0.60) {
    return {
      label: `${Math.round(ratio * 100)}% vendido`,
      cls: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-mono font-bold'
    };
  }
  return {
    label: `${Math.round(ratio * 100)}% vendido`,
    cls: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 font-mono font-bold'
  };
};

export const ToursView: React.FC<ToursViewProps> = ({
  player,
  world,
  onBookTour,
  onExecuteLiveShow
}) => {
  const [subTab, setSubTab] = useState<'tours' | 'festivals'>('festivals');
  const [tourName, setTourName] = useState('');
  const [selectedTier, setSelectedTier] = useState<TourTier>('club');
  const [notification, setNotification] = useState<string | null>(null);

  // Live Show Modal state
  const [activeFestivalShow, setActiveFestivalShow] = useState<{
    festival: GlobalFestival;
    slot: FestivalSlot;
    invitation?: FestivalInvitation;
  } | null>(null);

  const tourGates = useTourRequirements(player, world);
  const isTourAllowed = tourGates.canTour;
  const availableTiers = TourEngine.getAvailableTiersForArtist(player);
  const playerTours = world?.tours ? world.tours.filter((t) => t.artistId === player?.id) : [];

  // Festival Invitations
  const pendingInvitations = (world.festivalInvitations || []).filter(
    (inv) => inv.status === 'pending'
  );
  const festivalHistory = player.livePerformanceHistory || world.festivalHistory || [];

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
      desc: 'Escenarios principales en festivales masivos ante multitudes de más de 40.000 personas.',
      estRevenue: '$600,000 - $2,000,000',
      fatigue: '-35% Energía'
    },
    stadium: {
      title: 'Gira Monumental de Estadios',
      minPop: 75,
      desc: 'River Plate, Santiago Bernabéu y arenas abiertas de 40.000 a 80.000 espectadores con pirotecnia y pantallas gigantes.',
      estRevenue: '$1,500,000 - $4,500,000',
      fatigue: '-40% Energía'
    },
    world_tour: {
      title: 'Gira Mundial Intercontinental',
      minPop: 85,
      desc: 'Tramos en Norteamérica, Europa, Latinoamérica y Japón con flete aéreo de escenario propio; la recaudación por noche es altísima, pero el desgaste físico no perdona.',
      estRevenue: '$5,000,000 - $15,000,000',
      fatigue: '-50% Energía'
    }
  };

  const handleStartTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTourAllowed) return;

    const finalName = tourName.trim() || `Gira ${player.name} ${world?.currentYear || 2026}`;
    onBookTour(selectedTier, finalName);
    playSound('chart_no1');
    setNotification(`¡La gira "${finalName}" fue programada con éxito!`);
    setTourName('');
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenLiveFestivalShow = (fest: GlobalFestival, slot: FestivalSlot, inv?: FestivalInvitation) => {
    playSound('click');
    setActiveFestivalShow({
      festival: fest,
      slot,
      invitation: inv
    });
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* View Header with Sub-tabs Switcher */}
      <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F4F6] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#FF4F00]" />
            Giras & Festivales en Vivo
          </h1>
          <p className="text-xs text-[#8E8E99] mt-1">
            Cerrá contratos de boletería y caché en festivales; la taquilla en vivo deja el margen neto más alto de toda tu carrera si cuidás la garganta.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-[#09090B] rounded-[4px] border border-[#242429] text-xs font-mono font-semibold shrink-0">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setSubTab('festivals');
            }}
            className={`px-4 py-2 rounded-[4px] transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'festivals'
                ? 'bg-[#FF4F00] text-white font-bold'
                : 'text-[#8E8E99] hover:text-[#F4F4F6] hover:bg-[#18181C]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Circuito de Festivales ({pendingInvitations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              setSubTab('tours');
            }}
            className={`px-4 py-2 rounded-[4px] transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'tours'
                ? 'bg-[#FF4F00] text-white font-bold'
                : 'text-[#8E8E99] hover:text-[#F4F4F6] hover:bg-[#18181C]'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Giras Mundiales & Salas ({playerTours.length})</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-[4px] bg-[#00E599]/10 border border-[#00E599]/40 text-[#00E599] text-xs font-mono font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#00E599] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* --- SUBTAB 1: FESTIVAL CIRCUIT --- */}
      {subTab === 'festivals' && (
        <div className="space-y-6">
          {/* Pending Invitations Section */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#242429] pb-3">
              <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF4F00]" />
                Ofertas & Invitaciones Oficiales a Festivales ({pendingInvitations.length})
              </h2>
              <span className="text-xs text-[#8E8E99] font-mono">
                Temporada {world.currentYear}
              </span>
            </div>

            {pendingInvitations.length === 0 ? (
              <div className="p-8 rounded-[4px] bg-[#09090B] border border-[#242429] text-center space-y-2">
                <Flame className="w-8 h-8 text-[#52525B] mx-auto opacity-40" />
                <p className="text-xs text-[#8E8E99]">
                  No tienes invitaciones de festivales pendientes en este momento.
                </p>
                <p className="text-[11px] text-[#52525B]">
                  Las organizaciones envían ofertas a medida que aumenta tu popularidad y se aproximan los meses del festival (Febrero a Julio).
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingInvitations.map((inv) => {
                  const fest = GLOBAL_FESTIVALS.find((f) => f.id === inv.festivalId);
                  if (!fest) return null;

                  return (
                    <div
                      key={inv.id}
                      className="rounded-[6px] border border-[#242429] hover:border-[#3F3F46] bg-[#09090B] overflow-hidden flex flex-col justify-between shadow-xs transition-all group"
                    >
                      <div className="p-4 bg-[#18181C] border-b border-[#242429] text-[#F4F4F6]">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99]">
                            {fest.country} • Mes {fest.month}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-[#FF4F00]/10 text-[#FF4F00] border border-[#FF4F00]/30">
                            {inv.slotTitle}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight mt-2 text-[#F4F4F6]">
                          {inv.festivalName}
                        </h3>
                        <p className="text-xs text-[#8E8E99] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#FF4F00]" /> {inv.location}
                        </p>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="p-2.5 rounded-[4px] bg-[#111114] border border-[#242429]">
                            <span className="text-[10px] text-[#52525B] block uppercase font-semibold">Caché Ofrecido</span>
                            <span className="text-sm font-bold text-[#00E599] tabular-nums">
                              {formatMoney(inv.payout)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-[4px] bg-[#111114] border border-[#242429]">
                            <span className="text-[10px] text-[#52525B] block uppercase font-semibold">Audiencia Esperada</span>
                            <span className="text-sm font-bold text-[#F4F4F6] tabular-nums">
                              {(inv.audienceExpected || 0).toLocaleString('es-AR')} personas
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenLiveFestivalShow(fest, inv.slot, inv)}
                          className="w-full py-2.5 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-y-[1px]"
                        >
                          <Mic2 className="w-4 h-4" />
                          <span>Diseñar Show & Actuar en Vivo</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Global Festivals Catalog */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#242429] pb-3">
              <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF4F00]" />
                Los 7 Festivales Globales Más Icónicos
              </h2>
              <span className="text-xs text-[#8E8E99] font-mono">
                Calendario Oficial de Conciertos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GLOBAL_FESTIVALS.map((fest) => {
                const eligibleSlot = FestivalEngine.getEligibleSlot(player, fest);
                const isSeasonActive = Math.abs(fest.month - world.currentMonth) <= 1;

                return (
                  <div
                    key={fest.id}
                    className="p-5 rounded-[6px] bg-[#09090B] border border-[#242429] hover:border-[#3F3F46] flex flex-col justify-between space-y-4 shadow-xs transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#8E8E99]">
                          {fest.country} • Mes {fest.month}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#F59E0B] flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#F59E0B]" />
                          Prestigio {fest.prestige}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#F4F4F6]">
                        {fest.name}
                      </h3>
                      <p className="text-[11px] text-[#8E8E99] leading-relaxed">
                        {fest.description}
                      </p>
                      <div className="text-[11px] text-[#D4D4D8] font-mono">
                        Capacidad: <strong className="text-[#F4F4F6] tabular-nums">{fest.capacity.toLocaleString('es-AR')}</strong> espectadores/día
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#242429] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#52525B] block uppercase font-mono">Slot Elegible</span>
                        <span className={`text-xs font-bold font-mono ${eligibleSlot ? 'text-[#00E599]' : 'text-[#52525B]'}`}>
                          {eligibleSlot ? FestivalEngine.getSlotTitle(eligibleSlot).split('•')[0].trim() : 'Popularidad Insuficiente'}
                        </span>
                      </div>

                      {eligibleSlot && (
                        <button
                          type="button"
                          onClick={() => handleOpenLiveFestivalShow(fest, eligibleSlot)}
                          className="px-3.5 py-1.5 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#242429] text-[#F4F4F6] text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1 active:translate-y-[1px]"
                        >
                          <span>Tocar</span>
                          <ArrowRight className="w-3 h-3 text-[#FF4F00]" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* History of Festival Shows */}
          {festivalHistory.length > 0 && (
            <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2 border-b border-[#242429] pb-3">
                <Trophy className="w-4 h-4 text-[#F59E0B]" />
                Historial de Conciertos en Festivales • {festivalHistory.length} shows
              </h2>

              <div className="space-y-3">
                {festivalHistory.map((show, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[4px] bg-[#09090B] border border-[#242429] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#F4F4F6]">
                          {show.headline || show.newsHeadline || show.festivalName}
                        </h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#8E8E99]">
                          {show.slotTitle || show.slot}
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8E99] mt-1 italic">
                        "{show.reviews?.[0]?.quote || show.reviews?.[0]?.snippet || show.pressQuote || show.subheadline || 'Concierto inolvidable.'}" — {show.reviews?.[0]?.outlet || 'Prensa'}
                      </p>
                      <span className="text-[11px] text-[#52525B] font-mono block mt-1 tabular-nums">
                        Audiencia: {(show.attendance || 0).toLocaleString('es-AR')} personas • Calificación: {show.performanceScore ?? show.crowdRating ?? 75}%
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-[#8E8E99] block font-mono">Ganancia Neta</span>
                      <span className="text-sm font-bold text-[#00E599] font-mono tabular-nums">
                        +{formatMoney(show.netProfit)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SUBTAB 2: TRADITIONAL TOURS --- */}
      {subTab === 'tours' && (
        <div className="space-y-6">
          {/* Active Requirements Bar */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2 border-b border-[#242429] pb-3">
              <Sparkles className="w-4 h-4 text-[#FF4F00]" />
              Requisitos de Producción & Convocatoria
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-[4px] border flex items-start gap-3 transition-colors ${
                  tourGates.hasCatalog ? 'bg-[#09090B] border-[#242429]' : 'bg-[#EF4444]/10 border-[#EF4444]/30'
                }`}
              >
                <Disc3
                  className={`w-5 h-5 mt-0.5 shrink-0 ${tourGates.hasCatalog ? 'text-[#00E599]' : 'text-[#EF4444]'}`}
                />
                <div>
                  <div className="text-xs font-bold text-[#F4F4F6]">Repertorio Mínimo</div>
                  <div className="text-[10px] text-[#8E8E99] mt-0.5 font-mono">
                    {tourGates.hasCatalog ? (
                      <span className="text-[#00E599] font-semibold tabular-nums">
                        Listo: {tourGates.catalogCount} temas en catálogo
                      </span>
                    ) : (
                      <span className="text-[#EF4444] font-semibold tabular-nums">
                        Insuficiente: Requiere al menos {MIN_TOUR_SONGS} temas o 1 EP
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-[4px] border flex items-start gap-3 transition-colors ${
                  tourGates.hasAudience ? 'bg-[#09090B] border-[#242429]' : 'bg-[#EF4444]/10 border-[#EF4444]/30'
                }`}
              >
                <Headphones
                  className={`w-5 h-5 mt-0.5 shrink-0 ${tourGates.hasAudience ? 'text-[#00E599]' : 'text-[#EF4444]'}`}
                />
                <div>
                  <div className="text-xs font-bold text-[#F4F4F6]">Base de Oyentes</div>
                  <div className="text-[10px] text-[#8E8E99] mt-0.5 font-mono">
                    {tourGates.hasAudience ? (
                      <span className="text-[#00E599] font-semibold tabular-nums">
                        Suficiente: {formatListeners(player.stats.monthlyListeners)}
                      </span>
                    ) : (
                      <span className="text-[#EF4444] font-semibold tabular-nums">
                        Insuficiente: Requiere ≥{MIN_TOUR_LISTENERS.toLocaleString()} oyentes
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-[4px] border flex items-start gap-3 transition-colors ${
                  tourGates.hasEnergy ? 'bg-[#09090B] border-[#242429]' : 'bg-[#EF4444]/10 border-[#EF4444]/30'
                }`}
              >
                <Zap
                  className={`w-5 h-5 mt-0.5 shrink-0 ${tourGates.hasEnergy ? 'text-[#00E599]' : 'text-[#EF4444]'}`}
                />
                <div>
                  <div className="text-xs font-bold text-[#F4F4F6]">Condición Física & Energía</div>
                  <div className="text-[10px] text-[#8E8E99] mt-0.5 font-mono">
                    {tourGates.hasEnergy ? (
                      <span className="text-[#00E599] font-semibold tabular-nums">
                        Óptima: {player.stats.energy}% de energía
                      </span>
                    ) : (
                      <span className="text-[#EF4444] font-semibold tabular-nums">
                        Agotado: Requiere ≥{MIN_TOUR_ENERGY}% para salir a la ruta
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Booking Form */}
          <form onSubmit={handleStartTour} className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-6 shadow-xs">
            <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2 border-b border-[#242429] pb-3">
              <Ticket className="w-4 h-4 text-[#FF4F00]" />
              Planificar Nueva Gira
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#D4D4D8] block mb-1">Nombre Oficial del Tour</label>
                <input
                  type="text"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder={`Ej: ${player.name} — El Retorno Tour ${world?.currentYear || 2026}`}
                  className="w-full bg-[#09090B] border border-[#242429] rounded-[4px] px-3.5 py-2 text-xs text-[#F4F4F6] focus:border-[#3F3F46] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#D4D4D8] block mb-2">Escala de los Recintos (Tier)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(tierDetails) as TourTier[]).map((tierKey) => {
                    const info = tierDetails[tierKey];
                    const isAvailable = availableTiers.includes(tierKey);
                    const isSelected = selectedTier === tierKey;

                    return (
                      <div
                        key={tierKey}
                        onClick={() => isAvailable && setSelectedTier(tierKey)}
                        className={`p-4 rounded-[4px] border text-left transition-all relative ${
                          !isAvailable
                            ? 'opacity-40 bg-[#09090B] border-[#242429] cursor-not-allowed'
                            : isSelected
                            ? `border-[#FF4F00] bg-[#FF4F00]/10 shadow-xs cursor-pointer`
                            : 'bg-[#09090B] border-[#242429] hover:border-[#3F3F46] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-bold text-[#F4F4F6] truncate">{info.title}</h3>
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[4px] border ${TIER_BADGE_COLORS[tierKey]}`}>
                            {tierKey}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8E8E99] mt-2 leading-relaxed line-clamp-2">{info.desc}</p>
                        <div className="mt-3 pt-2 border-t border-[#242429] flex items-center justify-between text-xs font-mono">
                          <span className="text-[#00E599] font-bold tabular-nums">{info.estRevenue}</span>
                          <span className="text-[#EF4444] tabular-nums">{info.fatigue}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#242429] flex items-center justify-between">
              <div className="text-xs text-[#8E8E99] font-mono">
                {isTourAllowed ? (
                  <span className="text-[#00E599] flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Requisitos aprobados para salir de gira
                  </span>
                ) : (
                  <span className="text-[#EF4444] flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" /> {tourGates.tooltipText}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isTourAllowed}
                title={tourGates.tooltipText}
                className={`font-mono text-xs px-5 py-2.5 rounded-[4px] transition-all flex items-center gap-2 ${
                  isTourAllowed
                    ? 'bg-[#FF4F00] hover:bg-[#E04500] text-white font-bold cursor-pointer active:translate-y-[1px]'
                    : 'bg-[#18181C] text-[#52525B] border border-[#242429] cursor-not-allowed opacity-60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isTourAllowed ? 'Iniciar Gira & Vender Entradas' : 'Requisitos Insuficientes para Gira'}</span>
              </button>
            </div>
          </form>

          {/* History of Tours */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2 border-b border-[#242429] pb-3">
              <MapPin className="w-4 h-4 text-[#FF4F00]" />
              Historial de Giras Realizadas • {playerTours.length}
            </h2>

            {playerTours.length === 0 ? (
              <div className="text-center py-8 text-[#8E8E99] font-mono text-xs">No has realizado ninguna gira todavía.</div>
            ) : (
              <div className="space-y-3">
                {playerTours.map((t) => {
                  const ticketBadge = getTicketBadge(t.totalTicketsSold, t.totalCapacity);
                  return (
                    <div
                      key={t.id}
                      className={`bg-[#09090B] p-4 rounded-[4px] border border-[#242429] flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${TIER_BORDER_COLORS[t.tier]} hover:border-[#3F3F46] hover:bg-[#18181C] transition-all`}
                    >
                      <div>
                        <h3 className="text-sm font-bold text-[#F4F4F6] flex items-center gap-2">
                          {t.name}
                          <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-mono font-bold uppercase border ${TIER_BADGE_COLORS[t.tier]}`}>
                            {t.tier}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-mono font-bold ${ticketBadge.cls}`}>
                            {ticketBadge.label}
                          </span>
                        </h3>
                        <p className="text-xs text-[#8E8E99] mt-1 font-mono tabular-nums">
                          Año {t.year} • {t.stops?.length || 0} Ciudades • {(t.totalTicketsSold || 0).toLocaleString('es-AR')} de {(t.totalCapacity || 0).toLocaleString('es-AR')} Tickets Vendidos
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#8E8E99] block font-mono">Ganancia Neta</span>
                        <span className="text-sm font-bold text-[#00E599] font-mono tabular-nums">
                          +{formatMoney(t.netArtistProfit || 0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Show Modal */}
      {activeFestivalShow && onExecuteLiveShow && (
        <LiveShowModal
          festival={activeFestivalShow.festival}
          slot={activeFestivalShow.slot}
          invitation={activeFestivalShow.invitation}
          player={player}
          world={world}
          onClose={() => setActiveFestivalShow(null)}
          onExecuteShow={onExecuteLiveShow}
        />
      )}
    </div>
  );
};
