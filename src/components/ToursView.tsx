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
    dilemmaChoiceId?: string;
    invitationId?: string;
  }) => LiveShowResult;
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
      desc: 'Recorrido por capitales de América, Europa y Asia. Logística de clase mundial y estatus de superestrella internacional.',
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
      <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#8B5CF6]" />
            Giras & Festivales en Vivo
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Conquista escenarios mundiales, encabeza festivales masivos y conecta con multitudes cara a cara.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0B0C10] rounded-xl border border-[#2A2E3D] text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setSubTab('festivals');
            }}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'festivals'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'tours'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Giras Mundiales & Salas ({playerTours.length})</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* --- SUBTAB 1: FESTIVAL CIRCUIT --- */}
      {subTab === 'festivals' && (
        <div className="space-y-6">
          {/* Pending Invitations Section */}
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
              <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Ofertas & Invitaciones Oficiales a Festivales ({pendingInvitations.length})
              </h2>
              <span className="text-xs text-[#94A3B8] font-mono">
                Temporada {world.currentYear}
              </span>
            </div>

            {pendingInvitations.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#0B0C10] border border-[#2A2E3D] text-center space-y-2">
                <Flame className="w-8 h-8 text-[#94A3B8] mx-auto opacity-40" />
                <p className="text-xs text-[#94A3B8]">
                  No tienes invitaciones de festivales pendientes en este momento.
                </p>
                <p className="text-[11px] text-[#64748B]">
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
                      className="rounded-2xl border border-[#2A2E3D] hover:border-[#8B5CF6]/60 bg-[#0B0C10] overflow-hidden flex flex-col justify-between shadow-md transition-all group"
                    >
                      <div className={`p-4 bg-gradient-to-r ${fest.bannerGradient} text-white`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/40 border border-white/20">
                            {fest.country} • Mes {fest.month}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                            {inv.slotTitle}
                          </span>
                        </div>
                        <h3 className="text-lg font-black tracking-tight mt-2 drop-shadow-xs">
                          {inv.festivalName}
                        </h3>
                        <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {inv.location}
                        </p>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="p-2 rounded-lg bg-[#16181F] border border-[#2A2E3D]">
                            <span className="text-[10px] text-[#94A3B8] block uppercase">Caché Ofrecido</span>
                            <span className="text-sm font-bold text-emerald-400">
                              {formatMoney(inv.payout)}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#16181F] border border-[#2A2E3D]">
                            <span className="text-[10px] text-[#94A3B8] block uppercase">Audiencia Esperada</span>
                            <span className="text-sm font-bold text-[#C084FC]">
                              {inv.audienceExpected.toLocaleString('es-AR')} personas
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenLiveFestivalShow(fest, inv.slot, inv)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
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
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
              <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8B5CF6]" />
                Los 7 Festivales Globales Más Icónicos
              </h2>
              <span className="text-xs text-[#94A3B8]">
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
                    className="p-5 rounded-2xl bg-[#0B0C10] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 flex flex-col justify-between space-y-4 shadow-sm transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16181F] border border-[#2A2E3D] text-[#CBD5E1]">
                          {fest.country} • Mes {fest.month}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          Prestigio {fest.prestige}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#F8FAFC]">
                        {fest.name}
                      </h3>
                      <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                        {fest.description}
                      </p>
                      <div className="text-[11px] text-[#CBD5E1] font-mono">
                        Capacidad: <strong className="text-white">{fest.capacity.toLocaleString('es-AR')}</strong> espectadores/día
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#2A2E3D] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block uppercase">Slot Elegible</span>
                        <span className={`text-xs font-bold ${eligibleSlot ? 'text-emerald-400' : 'text-[#64748B]'}`}>
                          {eligibleSlot ? FestivalEngine.getSlotTitle(eligibleSlot).split('•')[0].trim() : 'Popularidad Insuficiente'}
                        </span>
                      </div>

                      {eligibleSlot && (
                        <button
                          type="button"
                          onClick={() => handleOpenLiveFestivalShow(fest, eligibleSlot)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/50 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Tocar</span>
                          <ArrowRight className="w-3 h-3" />
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
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-4 shadow-md">
              <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2 border-b border-[#2A2E3D] pb-3">
                <Trophy className="w-4 h-4 text-amber-400" />
                Historial de Conciertos en Festivales • {festivalHistory.length} shows
              </h2>

              <div className="space-y-3">
                {festivalHistory.map((show, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0B0C10] border border-[#2A2E3D] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#F8FAFC]">
                          {show.headline}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#C084FC]">
                          {show.slotTitle}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1 italic">
                        "{show.reviews[0]?.quote || show.subheadline}" — {show.reviews[0]?.outlet || 'Prensa'}
                      </p>
                      <span className="text-[11px] text-[#64748B] font-mono block mt-1">
                        Audiencia: {show.attendance.toLocaleString('es-AR')} personas • Calificación: {show.performanceScore}%
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-[#94A3B8] block">Ganancia Neta</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
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
          <div className="bg-surface border border-line rounded-xl p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-fg flex items-center gap-2 border-b border-line pb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              Requisitos de Producción & Convocatoria
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-lg border flex items-start gap-3 transition-colors ${
                  tourGates.hasCatalog ? 'bg-canvas border-line' : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <Disc3
                  className={`w-5 h-5 mt-0.5 shrink-0 ${tourGates.hasCatalog ? 'text-emerald-400' : 'text-rose-400'}`}
                />
                <div>
                  <div className="text-xs font-semibold text-fg">Repertorio Mínimo</div>
                  <div className="text-2xs text-fg-muted mt-0.5">
                    {tourGates.hasCatalog ? (
                      <span className="text-emerald-400 font-medium">
                        Listo: {tourGates.catalogCount} temas en catálogo
                      </span>
                    ) : (
                      <span className="text-rose-400 font-medium">
                        Insuficiente: Requiere al menos {MIN_TOUR_SONGS} temas o 1 EP
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border flex items-start gap-3 transition-colors ${
                  tourGates.hasAudience ? 'bg-canvas border-line' : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <Headphones
                  className={`w-5 h-5 mt-0.5 shrink-0 ${tourGates.hasAudience ? 'text-emerald-400' : 'text-rose-400'}`}
                />
                <div>
                  <div className="text-xs font-semibold text-fg">Base de Oyentes</div>
                  <div className="text-2xs text-fg-muted mt-0.5">
                    {tourGates.hasAudience ? (
                      <span className="text-emerald-400 font-medium">
                        Suficiente: {formatListeners(player.stats.monthlyListeners)}
                      </span>
                    ) : (
                      <span className="text-rose-400 font-medium">
                        Insuficiente: Requiere ≥{MIN_TOUR_LISTENERS.toLocaleString()} oyentes
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border flex items-start gap-3 transition-colors ${
                  tourGates.hasEnergy ? 'bg-canvas border-line' : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <Zap
                  className={`w-5 h-5 mt-0.5 shrink-0 ${tourGates.hasEnergy ? 'text-emerald-400' : 'text-rose-400'}`}
                />
                <div>
                  <div className="text-xs font-semibold text-fg">Condición Física & Energía</div>
                  <div className="text-2xs text-fg-muted mt-0.5">
                    {tourGates.hasEnergy ? (
                      <span className="text-emerald-400 font-medium">
                        Óptima: {player.stats.energy}% de energía
                      </span>
                    ) : (
                      <span className="text-rose-400 font-medium">
                        Agotado: Requiere ≥{MIN_TOUR_ENERGY}% para salir a la ruta
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Booking Form */}
          <form onSubmit={handleStartTour} className="bg-surface border border-line rounded-xl p-6 space-y-6 shadow-sm">
            <h2 className="text-base font-semibold text-fg flex items-center gap-2 border-b border-line pb-3">
              <Ticket className="w-4 h-4 text-primary" />
              Planificar Nueva Gira
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-fg block mb-1">Nombre Oficial del Tour</label>
                <input
                  type="text"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder={`Ej: ${player.name} — El Retorno Tour ${world?.currentYear || 2026}`}
                  className="w-full bg-canvas border border-line rounded-md px-3.5 py-2 text-xs text-fg focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-fg block mb-2">Escala de los Recintos (Tier)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(tierDetails) as TourTier[]).map((tierKey) => {
                    const info = tierDetails[tierKey];
                    const isAvailable = availableTiers.includes(tierKey);
                    const isSelected = selectedTier === tierKey;

                    return (
                      <div
                        key={tierKey}
                        onClick={() => isAvailable && setSelectedTier(tierKey)}
                        className={`p-4 rounded-lg border text-left transition-all relative ${
                          !isAvailable
                            ? 'opacity-40 bg-canvas/40 border-line cursor-not-allowed'
                            : isSelected
                            ? `border-primary ${TIER_BG_ACCENT[tierKey]} shadow-sm cursor-pointer`
                            : 'bg-canvas border-line hover:border-primary/50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold text-fg truncate">{info.title}</h3>
                          <span className={`text-2xs font-semibold uppercase px-2 py-0.5 rounded-sm border ${TIER_BADGE_COLORS[tierKey]}`}>
                            {tierKey}
                          </span>
                        </div>
                        <p className="text-2xs text-fg-muted mt-2 font-normal line-clamp-2">{info.desc}</p>
                        <div className="mt-3 pt-2 border-t border-line/50 flex items-center justify-between text-2xs font-mono">
                          <span className="text-emerald-400 font-medium">{info.estRevenue}</span>
                          <span className="text-rose-400">{info.fatigue}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-line flex items-center justify-between">
              <div className="text-xs text-fg-muted">
                {isTourAllowed ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Requisitos aprobados para salir de gira
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> {tourGates.tooltipText}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isTourAllowed}
                title={tourGates.tooltipText}
                className={`font-semibold text-xs px-5 py-2.5 rounded-md transition-all flex items-center gap-2 ${
                  isTourAllowed
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-98 cursor-pointer'
                    : 'bg-line text-fg-muted cursor-not-allowed opacity-60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isTourAllowed ? 'Iniciar Gira & Vender Entradas' : 'Requisitos Insuficientes para Gira'}</span>
              </button>
            </div>
          </form>

          {/* History of Tours */}
          <div className="bg-surface border border-line rounded-xl p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-fg flex items-center gap-2 border-b border-line pb-3">
              <MapPin className="w-4 h-4 text-info" />
              Historial de Giras Realizadas • {playerTours.length}
            </h2>

            {playerTours.length === 0 ? (
              <div className="text-center py-8 text-fg-muted text-xs">No has realizado ninguna gira todavía.</div>
            ) : (
              <div className="space-y-3">
                {playerTours.map((t) => {
                  const ticketBadge = getTicketBadge(t.totalTicketsSold, t.totalCapacity);
                  return (
                    <div
                      key={t.id}
                      className={`bg-canvas p-4 rounded-lg border border-line flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${TIER_BORDER_COLORS[t.tier]} hover:border-primary/50 hover:bg-surface transition-all`}
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
                          {t.name}
                          <span className={`text-2xs px-2 py-0.5 rounded-sm font-semibold uppercase border ${TIER_BADGE_COLORS[t.tier]}`}>
                            {t.tier}
                          </span>
                          <span className={`text-2xs px-2 py-0.5 rounded-sm font-semibold ${ticketBadge.cls}`}>
                            {ticketBadge.label}
                          </span>
                        </h3>
                        <p className="text-xs text-fg-muted mt-1 font-normal">
                          Año {t.year} • {t.stops?.length || 0} Ciudades • {(t.totalTicketsSold || 0).toLocaleString('es-AR')} de {(t.totalCapacity || 0).toLocaleString('es-AR')} Tickets Vendidos
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-fg-muted block font-normal">Ganancia Neta</span>
                        <span className="text-sm font-semibold text-emerald-400 font-mono">
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
