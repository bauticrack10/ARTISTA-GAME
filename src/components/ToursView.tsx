import React, { useState } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import {
  Artist,
  WorldState,
  TourTier,
  GlobalFestival,
  FestivalSlot,
  FestivalInvitation,
  StageProductionConfig,
  LiveShowResult,
  Song
} from '../types';
import {
  Plane,
  MapPin,
  Ticket,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Disc3,
  Headphones,
  Flame,
  Star,
  Mic2,
  ArrowRight,
  Trophy,
  Lock
} from 'lucide-react';
import { TourEngine, MIN_TOUR_ENERGY, MIN_TOUR_SONGS } from '../systems/TourEngine';
import { GLOBAL_FESTIVALS, FestivalEngine } from '../systems/FestivalEngine';
import { playSound } from '../utils/audioSystem';
import { showToast } from '../utils/toastBus';
import { useTourRequirements } from '../hooks/useTourRequirements';
import { formatListeners, formatMoney } from '../utils/formatters';
import { LiveShowModal } from './LiveShowModal';
import { SectionSubNav } from './ui/SectionSubNav';

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
  onNavigate?: (tab: string) => void;
}

const TIER_BORDER_COLORS: Record<TourTier, string> = {
  club: 'border-l-[#10B981]',
  theater: 'border-l-[#F4F0EA]',
  arena: 'border-l-[#F59E0B]',
  festival_circuit: 'border-l-[#FF4F00]',
  stadium: 'border-l-[#F59E0B]',
  world_tour: 'border-l-[#FF4F00]'
};

const TIER_BADGE_COLORS: Record<TourTier, string> = {
  club: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/35',
  theater: 'bg-[#18181C] text-[#F4F0EA] border-[#242429]',
  arena: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/35',
  festival_circuit: 'bg-[#FF4F00]/15 text-[#FF4F00] border-[#FF4F00]/35',
  stadium: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/45',
  world_tour: 'bg-[#FF4F00]/20 text-[#FF4F00] border-[#FF4F00]/45'
};

const getTicketBadge = (sold: number, capacity: number) => {
  const ratio = capacity > 0 ? sold / capacity : 0;
  if (ratio >= 0.95) {
    return {
      label: 'SOLD OUT',
      cls: 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/35 font-sans font-bold'
    };
  }
  if (ratio >= 0.60) {
    return {
      label: `${Math.round(ratio * 100)}% vendido`,
      cls: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/35 font-sans font-bold'
    };
  }
  return {
    label: `${Math.round(ratio * 100)}% vendido`,
    cls: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/35 font-sans font-bold'
  };
};

export const ToursView: React.FC<ToursViewProps> = ({
  player,
  world,
  onBookTour,
  onExecuteLiveShow,
  onNavigate
}) => {
  const [subTab, setSubTab] = useState<'tours' | 'festivals'>('tours');
  useScrollToTop([subTab]);
  const [tourName, setTourName] = useState('');
  const [selectedTier, setSelectedTier] = useState<TourTier>('club');

  const [activeFestivalShow, setActiveFestivalShow] = useState<{
    festival: GlobalFestival;
    slot: FestivalSlot;
    invitation?: FestivalInvitation;
  } | null>(null);

  const tourGates = useTourRequirements(player, world);
  const isTourAllowed = tourGates.canTour;
  const availableTiers = TourEngine.getAvailableTiersForArtist(player);
  const playerTours = Array.isArray(world?.tours) ? world.tours.filter((t) => t && t.artistId === player?.id) : [];

  const currentYear = world?.currentYear || 2026;
  const currentMonth = world?.currentMonth || 1;
  const playerSongs = (Object.values(world?.songs || {}) as Song[]).filter((s) => s && s.artistId === player?.id);
  const hasCatalogForFestival = playerSongs.length > 0;
  const playedFestivalsThisYear = player?.playedFestivalsByYear?.[currentYear] || [];

  const pendingInvitations = Array.isArray(world?.festivalInvitations)
    ? world.festivalInvitations.filter((inv) => inv && inv.status === 'pending')
    : [];
  const festivalHistory = Array.isArray(player?.livePerformanceHistory)
    ? player.livePerformanceHistory
    : (Array.isArray(world?.festivalHistory) ? world.festivalHistory : []);

  const tierDetails: Record<
    TourTier,
    { title: string; minPop: number; desc: string; estRevenue: string; fatigue: string }
  > = {
    club: {
      title: 'Gira por Clubes Underground',
      minPop: 0,
      desc: 'Fechas en recintos de 500 a 1.000 personas.',
      estRevenue: '$20,000 - $60,000',
      fatigue: '-15% Energía'
    },
    theater: {
      title: 'Circuito de Teatros Históricos',
      minPop: 25,
      desc: 'Salas de 2.000 a 4.000 butacas con acústica dedicada.',
      estRevenue: '$80,000 - $250,000',
      fatigue: '-22% Energía'
    },
    arena: {
      title: 'Gira Nacional de Arenas',
      minPop: 50,
      desc: 'Recintos cerrados de 12.000 a 18.000 personas.',
      estRevenue: '$350,000 - $1,200,000',
      fatigue: '-30% Energía'
    },
    festival_circuit: {
      title: 'Headliner en Festivales',
      minPop: 70,
      desc: 'Escenarios principales ante más de 40.000 personas.',
      estRevenue: '$600,000 - $2,000,000',
      fatigue: '-35% Energía'
    },
    stadium: {
      title: 'Gira Monumental de Estadios',
      minPop: 75,
      desc: 'Estadios abiertos de 40.000 a 80.000 espectadores.',
      estRevenue: '$1,500,000 - $4,500,000',
      fatigue: '-40% Energía'
    },
    world_tour: {
      title: 'Gira Mundial Intercontinental',
      minPop: 85,
      desc: 'Tramos en América, Europa y Asia con producción propia.',
      estRevenue: '$5,000,000 - $15,000,000',
      fatigue: '-50% Energía'
    }
  };

  const handleStartTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTourAllowed) return;

    try {
      const finalName = tourName.trim() || `Gira ${player?.name || 'Artista'} ${world?.currentYear || 2026}`;
      onBookTour(selectedTier, finalName);
      playSound('chart_no1');
      showToast(`La gira "${finalName}" fue programada con éxito.`, 'success');
      setTourName('');
    } catch (err: any) {
      showToast(err.message || 'Error al programar la gira.', 'error');
    }
  };

  const handleOpenLiveFestivalShow = (fest: GlobalFestival, slot: FestivalSlot, inv?: FestivalInvitation) => {
    if (!hasCatalogForFestival) {
      showToast('Debes lanzar al menos 1 canción en el Estudio antes de tocar en un festival.', 'warning');
      return;
    }
    if (playedFestivalsThisYear.includes(fest.id)) {
      showToast(`Ya actuaste en ${fest.name} durante ${currentYear}.`, 'info');
      return;
    }
    playSound('click');
    setActiveFestivalShow({
      festival: fest,
      slot,
      invitation: inv
    });
  };

  return (
    <div className="space-y-5 pb-12 font-sans text-[#F4F0EA]">
      <SectionSubNav
        hub="carrera"
        activeTab="tours"
        onNavigate={onNavigate}
        pendingFestivalsCount={pendingInvitations.length}
      />

      {/* View Header with Sub-tabs Switcher */}
      <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#F4F0EA] flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#FF4F00]" strokeWidth={1.75} />
            Giras & Festivales en Vivo
          </h1>
          <p className="text-xs text-[#8E8E99] mt-0.5">
            Contratos de boletería y caché en festivales internacionales.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-[#18181C] border border-[#242429] rounded-[6px] text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setSubTab('tours');
            }}
            className={`px-4 py-2 rounded-[4px] transition-colors cursor-pointer flex items-center gap-2 ${
              subTab === 'tours'
                ? 'bg-[#FF4F00] text-white font-bold'
                : 'text-[#8E8E99] hover:text-white hover:bg-[#111114]'
            }`}
          >
            <Ticket className="w-4 h-4" strokeWidth={1.75} />
            <span>Giras & Salas ({playerTours.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              setSubTab('festivals');
            }}
            className={`px-4 py-2 rounded-[4px] transition-colors cursor-pointer flex items-center gap-2 ${
              subTab === 'festivals'
                ? 'bg-[#FF4F00] text-white font-bold'
                : 'text-[#8E8E99] hover:text-white hover:bg-[#111114]'
            }`}
          >
            <Flame className="w-4 h-4" strokeWidth={1.75} />
            <span>Circuito de Festivales ({pendingInvitations.length})</span>
          </button>
        </div>
      </div>

      {/* --- SUBTAB 1: UNIFIED FESTIVAL CIRCUIT --- */}
      {subTab === 'festivals' && (
        <div className="space-y-5">
          {/* Unified Festivals Panel: Pending Invitations (if any) + 7 Global Festivals Grid */}
          <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 space-y-5">
            {!hasCatalogForFestival && (
              <div className="p-3.5 rounded-[4px] bg-[#F59E0B]/10 border border-[#F59E0B]/35 text-[#F59E0B] text-xs font-semibold flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  Necesitas al menos 1 canción publicada en tu catálogo para subir al escenario de un festival.
                </span>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('studio')}
                    className="px-3 py-1.5 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Ir al Estudio
                  </button>
                )}
              </div>
            )}

            {/* Highlight Pending Invitations only when present, otherwise compact status strip */}
            {pendingInvitations.length > 0 ? (
              <div className="space-y-3 pb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#F4F0EA] uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
                    Invitaciones Oficiales Pendientes ({pendingInvitations.length})
                  </h2>
                  <span className="text-xs text-[#8E8E99] font-semibold tabular-nums">Temporada {currentYear}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {pendingInvitations.map((inv) => {
                    const fest = GLOBAL_FESTIVALS.find((f) => f.id === inv.festivalId);
                    if (!fest) return null;
                    const alreadyPlayed = playedFestivalsThisYear.includes(fest.id);
                    const isBlocked = !hasCatalogForFestival || alreadyPlayed;

                    return (
                      <div
                        key={inv.id}
                        className="rounded-[6px] border border-[#FF4F00]/45 bg-[#18181C] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#F4F0EA] tabular-nums">
                              {fest.country} • Mes {fest.month}
                            </span>
                            {fest.month === currentMonth && (
                              <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded-[4px] bg-[#FF4F00]/15 border border-[#FF4F00]/45 text-[#FF4F00]">
                                EN TEMPORADA
                              </span>
                            )}
                            <span className="text-2xs font-bold px-2 py-0.5 rounded-[4px] bg-[#FF4F00]/15 text-[#FF4F00] border border-[#FF4F00]/35">
                              {inv.slotTitle}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[#F4F0EA]">{inv.festivalName}</h3>
                          <div className="flex items-center gap-3 text-xs text-[#8E8E99] tabular-nums">
                            <span>Caché: <strong className="text-[#10B981]">{formatMoney(inv.payout)}</strong></span>
                            <span>•</span>
                            <span>{(inv.audienceExpected || 0).toLocaleString('es-AR')} esp.</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isBlocked}
                          onClick={() => handleOpenLiveFestivalShow(fest, inv.slot, inv)}
                          className={`px-4 py-2.5 rounded-[4px] text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${
                            isBlocked
                              ? 'bg-[#111114] border border-[#242429] text-[#52525B] cursor-not-allowed'
                              : 'bg-[#FF4F00] hover:bg-[#E04500] text-white cursor-pointer active:translate-y-[1px]'
                          }`}
                        >
                          {isBlocked ? <Lock className="w-4 h-4" strokeWidth={1.75} /> : <Mic2 className="w-4 h-4" strokeWidth={1.75} />}
                          <span>{alreadyPlayed ? 'Ya tocado este año' : !hasCatalogForFestival ? 'Sin catálogo' : 'Actuar en Vivo'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-[4px] bg-[#18181C] border border-[#242429] text-xs text-[#8E8E99]">
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF4F00] shrink-0" strokeWidth={1.75} />
                  Sin ofertas pendientes en este momento. Podés postular directamente en los festivales habilitados según tu popularidad.
                </span>
                <span className="text-2xs text-[#F4F0EA] uppercase font-bold tabular-nums shrink-0 ml-2">
                  Temporada {currentYear}
                </span>
              </div>
            )}

            {/* Global Festivals Clean Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#F4F0EA] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
                  Cartelera Global de Festivales ({GLOBAL_FESTIVALS.length})
                </h2>
                <span className="text-xs text-[#8E8E99] font-medium">Calendario Oficial</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {GLOBAL_FESTIVALS.map((fest) => {
                  const eligibleSlot = FestivalEngine.getEligibleSlot(player, fest);
                  const isInSeason = fest.month === currentMonth;
                  const alreadyPlayed = playedFestivalsThisYear.includes(fest.id);
                  const isBlocked = alreadyPlayed || !hasCatalogForFestival;

                  return (
                    <div
                      key={fest.id}
                      className={`p-4 rounded-[6px] border flex flex-col justify-between space-y-3 transition-all ${
                        alreadyPlayed
                          ? 'bg-[#18181C]/60 border-[#242429] opacity-70'
                          : isInSeason
                          ? 'bg-[#18181C] border-[#FF4F00]/60'
                          : 'bg-[#18181C] border-[#242429] hover:border-[#3F3F46]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="text-2xs font-bold px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#F4F0EA] tabular-nums">
                            {fest.country} • Mes {fest.month}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {isInSeason && (
                              <span className="text-2xs font-bold px-1.5 py-0.5 rounded-[4px] bg-[#FF4F00]/15 border border-[#FF4F00]/45 text-[#FF4F00]">
                                EN TEMPORADA
                              </span>
                            )}
                            <span className="text-2xs font-bold text-[#F59E0B] flex items-center gap-1 tabular-nums">
                              <Star className="w-3 h-3 fill-[#F59E0B]" strokeWidth={1.75} />
                              {fest.prestige}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-[#F4F0EA]">{fest.name}</h3>
                        <div className="text-xs text-[#8E8E99] tabular-nums">
                          Capacidad: <strong className="text-[#F4F0EA]">{fest.capacity.toLocaleString('es-AR')}</strong>/día
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#242429] flex items-center justify-between gap-2">
                        {alreadyPlayed ? (
                          <span className="w-full text-center px-3 py-1.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99] text-xs font-semibold flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            Ya tocado en {currentYear}
                          </span>
                        ) : !hasCatalogForFestival ? (
                          <span className="w-full text-center px-3 py-1.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#52525B] text-xs font-semibold flex items-center justify-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            Requiere canciones
                          </span>
                        ) : eligibleSlot ? (
                          <>
                            <span className="text-xs font-bold truncate text-[#10B981]">
                              {FestivalEngine.getSlotTitle(eligibleSlot).split('•')[0].trim()}
                            </span>

                            <button
                              type="button"
                              disabled={isBlocked}
                              onClick={() => handleOpenLiveFestivalShow(fest, eligibleSlot)}
                              className="px-3 py-1.5 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0 active:translate-y-[1px]"
                            >
                              <span>Tocar</span>
                              <ArrowRight className="w-3 h-3" strokeWidth={1.75} />
                            </button>
                          </>
                        ) : (
                          <span className="w-full text-center px-3 py-1.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99] text-xs font-semibold truncate">
                            Pop. Insuficiente
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* History of Festival Shows */}
          {festivalHistory.length > 0 && (
            <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#F4F0EA] uppercase tracking-wider flex items-center gap-2 pb-1">
                <Trophy className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.75} />
                Historial de Festivales • <span className="tabular-nums">{festivalHistory.length}</span> shows
              </h2>

              <div className="space-y-2.5">
                {festivalHistory.map((show, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-[4px] bg-[#18181C] border border-[#242429] flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-[#F4F0EA]">
                          {show?.headline || show?.newsHeadline || show?.festivalName || 'Show en Vivo'}
                        </h3>
                        <span className="text-2xs font-bold px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#F4F0EA]">
                          {show?.slotTitle || show?.slot || 'Actuación'}
                        </span>
                      </div>
                      <span className="text-2xs text-[#8E8E99] block mt-1 tabular-nums">
                        Audiencia: {(show?.attendance || 0).toLocaleString('es-AR')} personas • Calificación: {Number.isFinite(show?.performanceScore) ? show.performanceScore : (Number.isFinite(show?.crowdRating) ? show.crowdRating : 75)}%
                      </span>
                    </div>

                    <div className="text-right shrink-0 tabular-nums">
                      <span className="text-2xs text-[#8E8E99] block">Ganancia Neta</span>
                      <span className={`text-sm font-bold ${(show?.netProfit ?? 0) >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {(show?.netProfit ?? 0) >= 0 ? `+${formatMoney(show?.netProfit || 0)}` : `-${formatMoney(Math.abs(show?.netProfit || 0))}`}
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
        <div className="space-y-5">
          {/* Tour Booking Form with Integrated Compact Requirements Strip */}
          <form onSubmit={handleStartTour} className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2">
              <h2 className="text-base font-bold text-[#F4F0EA] flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
                Planificar Nueva Gira
              </h2>

              {/* Compact 3-Indicator Requirements Strip */}
              <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
                <span
                  className={`px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 font-semibold ${
                    tourGates.hasCatalog
                      ? 'bg-[#18181C] border-[#242429] text-[#10B981]'
                      : 'bg-[#EF4444]/15 border-[#EF4444]/35 text-[#EF4444]'
                  }`}
                >
                  <Disc3 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Catálogo ≥{MIN_TOUR_SONGS} ({tourGates.songsCount} singles{tourGates.albumsCount > 0 ? `, ${tourGates.albumsCount} EPs` : ''})
                </span>

                <span
                  className={`px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 font-semibold ${
                    tourGates.hasAudience
                      ? 'bg-[#18181C] border-[#242429] text-[#10B981]'
                      : 'bg-[#EF4444]/15 border-[#EF4444]/35 text-[#EF4444]'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Oyentes ≥1k ({formatListeners(player?.stats?.monthlyListeners || 0)})
                </span>

                <span
                  className={`px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 font-semibold ${
                    tourGates.hasEnergy
                      ? 'bg-[#18181C] border-[#242429] text-[#10B981]'
                      : 'bg-[#EF4444]/15 border-[#EF4444]/35 text-[#EF4444]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Energía ≥{MIN_TOUR_ENERGY}% ({player?.stats?.energy || 0}%)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#F4F0EA] block mb-1.5">Nombre Oficial del Tour</label>
                <input
                  type="text"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder={`Ej: ${player.name} — El Retorno Tour ${world?.currentYear || 2026}`}
                  className="w-full bg-[#18181C] border border-[#242429] rounded-[4px] px-3.5 py-2 text-xs text-[#F4F0EA] focus:border-[#FF4F00] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#F4F0EA] block mb-2">Escala de los Recintos (Tier)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(tierDetails) as TourTier[]).map((tierKey) => {
                    const info = tierDetails[tierKey];
                    const isAvailable = availableTiers.includes(tierKey);
                    const isSelected = selectedTier === tierKey;

                    return (
                      <div
                        key={tierKey}
                        onClick={() => isAvailable && setSelectedTier(tierKey)}
                        className={`p-3.5 rounded-[4px] border text-left transition-all relative ${
                          !isAvailable
                            ? 'opacity-65 bg-[#18181C] border-[#242429] cursor-not-allowed'
                            : isSelected
                            ? 'border-[#FF4F00] bg-[#18181C] cursor-pointer shadow-[0_0_16px_rgba(255,79,0,0.18)]'
                            : 'bg-[#18181C] border-[#242429] hover:border-[#3F3F46] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-bold text-[#F4F0EA] truncate">{info.title}</h3>
                          <span className={`text-2xs font-bold uppercase px-2 py-0.5 rounded-[4px] border ${TIER_BADGE_COLORS[tierKey]}`}>
                            {tierKey}
                          </span>
                        </div>
                        <p className="text-2xs text-[#8E8E99] mt-1.5 leading-relaxed line-clamp-2">{info.desc}</p>
                        <div className="mt-2.5 pt-2 border-t border-[#242429] flex items-center justify-between text-xs tabular-nums">
                          <span className="text-[#10B981] font-bold">{info.estRevenue}</span>
                          <span className="text-[#EF4444] font-medium">{info.fatigue}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#242429] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-[#8E8E99]">
                {isTourAllowed ? (
                  <span className="text-[#10B981] flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} /> Requisitos listos para reservar fechas
                  </span>
                ) : (
                  <span className="text-[#EF4444] flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} /> {tourGates.tooltipText}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isTourAllowed}
                title={tourGates.tooltipText}
                className={`text-xs px-5 py-2.5 rounded-[4px] transition-all flex items-center justify-center gap-2 ${
                  isTourAllowed
                    ? 'bg-[#FF4F00] hover:bg-[#E04500] text-white font-bold cursor-pointer active:translate-y-[1px]'
                    : 'bg-[#18181C] text-[#52525B] border border-[#242429] font-semibold cursor-not-allowed'
                }`}
              >
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                <span>{isTourAllowed ? 'Iniciar Gira & Vender Entradas' : 'Requisitos Insuficientes'}</span>
              </button>
            </div>
          </form>

          {/* History of Tours */}
          <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 space-y-3">
            <h2 className="text-sm font-bold text-[#F4F0EA] uppercase tracking-wider flex items-center gap-2 pb-1">
              <MapPin className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
              Historial de Giras Realizadas • <span className="tabular-nums">{playerTours.length}</span>
            </h2>

            {playerTours.length === 0 ? (
              <div className="text-center py-6 text-[#8E8E99] text-xs">No has realizado ninguna gira todavía.</div>
            ) : (
              <div className="space-y-2.5">
                {playerTours.map((t) => {
                  const ticketBadge = getTicketBadge(t?.totalTicketsSold || 0, t?.totalCapacity || 0);
                  const safeTier = (t?.tier || 'club') as TourTier;
                  const borderCls = TIER_BORDER_COLORS[safeTier] || 'border-l-[#10B981]';
                  const badgeCls = TIER_BADGE_COLORS[safeTier] || 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/35';

                  return (
                    <div
                      key={t?.id || `tour_${Math.random()}`}
                      className={`bg-[#18181C] p-3.5 rounded-[4px] border border-[#242429] flex flex-col md:flex-row md:items-center justify-between gap-3 border-l-4 ${borderCls} hover:border-[#3F3F46] transition-all`}
                    >
                      <div>
                        <h3 className="text-xs font-bold text-[#F4F0EA] flex items-center gap-2 flex-wrap">
                          {t?.name || 'Gira'}
                          <span className={`text-2xs px-2 py-0.5 rounded-[4px] font-bold uppercase border ${badgeCls}`}>
                            {safeTier}
                          </span>
                          <span className={`text-2xs px-2 py-0.5 rounded-[4px] font-bold ${ticketBadge.cls}`}>
                            {ticketBadge.label}
                          </span>
                        </h3>
                        <p className="text-2xs text-[#8E8E99] mt-1 tabular-nums">
                          Año {t?.year || 2026} • {t?.stops?.length || 0} Ciudades • {(t?.totalTicketsSold || 0).toLocaleString('es-AR')} / {(t?.totalCapacity || 0).toLocaleString('es-AR')} Tickets
                        </p>
                      </div>

                      <div className="text-right tabular-nums shrink-0">
                        <span className="text-2xs text-[#8E8E99] block">Ganancia Neta</span>
                        <span className="text-sm font-bold text-[#10B981]">
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
