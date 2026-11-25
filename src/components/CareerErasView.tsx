import React, { useState } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Artist, WorldState, Song, Album, Tour, Genre } from '../types';
import {
  TrendingUp,
  Ticket,
  Calendar,
  History,
  Trophy,
  Disc3,
  MapPin,
  Building2,
  Newspaper,
  Video,
  Plus,
  X
} from 'lucide-react';
import { TimeSystem } from '../systems/TimeSystem';
import { getGenreBadgeClass } from '../utils/themeColors';
import { formatMoney, cleanQuotes, formatCityCountry, formatReleaseDate } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';
import { showToast } from '../utils/toastBus';
import { LegacyCardModal } from './LegacyCardModal';
import { SectionSubNav } from './ui/SectionSubNav';

interface CareerErasViewProps {
  player: Artist;
  world: WorldState;
  onOpenMilestone?: (data?: any) => void;
  onStartNewEra?: (name: string, genreId: string) => { success: boolean; message?: string } | void;
  onRetireArtist?: () => void;
  onNavigate?: (tab: string) => void;
}

export const CareerErasView: React.FC<CareerErasViewProps> = ({
  player,
  world,
  onOpenMilestone,
  onStartNewEra,
  onRetireArtist,
  onNavigate
}) => {
  const [legacyModalOpen, setLegacyModalOpen] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'eras' | 'releases' | 'tours' | 'awards'>('all');
  const [showNewEraForm, setShowNewEraForm] = useState(false);
  const [newEraName, setNewEraName] = useState('');
  const [newEraGenre, setNewEraGenre] = useState(player?.primaryGenre || Object.keys(world?.genres || {})[0] || 'pop');
  useScrollToTop([timelineFilter]);

  const playerId = player?.id || 'player';
  const yearsActive = Math.max(0, (player?.retirementYear || world?.currentYear || 2026) - (player?.careerStartYear || 2026));
  const playerSongs = (Object.values(world?.songs || {}) as Song[]).filter(s => s.artistId === playerId);
  const playerAlbums = (Object.values(world?.albums || {}) as Album[]).filter(a => a.artistId === playerId);
  const playerTours = (world?.tours || []).filter(t => t.artistId === playerId);

  const handleSubmitNewEra = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newEraName.trim();
    if (!trimmed) {
      showToast('Escribe un nombre para la nueva era.', 'warning');
      return;
    }
    if (!onStartNewEra) {
      showToast('Transición de era registrada en planificación. Lanza música con el nuevo sonido en el Estudio.', 'info');
      setShowNewEraForm(false);
      return;
    }
    const res = onStartNewEra(trimmed, newEraGenre);
    if (res && typeof res === 'object' && res.success === false) {
      showToast(res.message || 'No se pudo iniciar la nueva era.', 'error');
      return;
    }
    playSound('level_up');
    showToast((res && typeof res === 'object' && res.message) || `Nueva era "${trimmed}" iniciada.`, 'success');
    setNewEraName('');
    setShowNewEraForm(false);
  };

  const totalNo1s = playerSongs.filter(s => s.peakPosition?.Global === 1 || s.peakPosition?.Argentina === 1).length;
  const totalHits = playerSongs.filter(s => (s.peakPosition?.Global ?? 99) <= 10).length;

  // 1. MEJOR DISCO
  const bestAlbum: Album | null = playerAlbums.length > 0
    ? [...playerAlbums].sort((a, b) => {
        const scoreA = (a.totalStreams || 0) + (a.firstWeekSales || 0) * 15;
        const scoreB = (b.totalStreams || 0) + (b.firstWeekSales || 0) * 15;
        return scoreB - scoreA;
      })[0]
    : null;

  // 2. MEJOR GIRA
  const bestTour: Tour | null = playerTours.length > 0
    ? [...playerTours].sort((a, b) => b.grossRevenue - a.grossRevenue)[0]
    : null;

  // 3. UNIFIED CHRONOLOGICAL TIMELINE OF ERAS & TRAJECTORY
  interface TrajectoryItem {
    id: string;
    year: number;
    month: number;
    type: 'era' | 'album' | 'single' | 'tour' | 'award' | 'contract';
    title: string;
    description: string;
    metrics?: string;
    badge?: string;
    icon: React.ElementType;
    eraData?: {
      name: string;
      stage: string;
      highlightSummary: string;
      startYear: number;
    };
  }

  const timelineItems: TrajectoryItem[] = [];

  // Career Debut
  timelineItems.push({
    id: 'traj_debut',
    year: player.careerStartYear,
    month: 1,
    type: 'era',
    title: 'Debut Artístico en la Escena',
    description: `Comienzo formal en ${formatCityCountry(player.city, player.country)} • Género base: ${world.genres[player.mainGenreId]?.name || player.mainGenreId}.`,
    badge: 'Inicio de Carrera',
    icon: Disc3
  });

  // Eras
  player.eras.forEach((era, idx) => {
    const isCurrent = idx === player.eras.length - 1;
    timelineItems.push({
      id: `traj_era_${era.id}`,
      year: era.startYear,
      month: era.startMonth,
      type: 'era',
      title: `Era: "${era.name}"`,
      description: `${era.highlightSummary} • Enfoque: ${world.genres[era.genreFocus]?.name || era.genreFocus}`,
      badge: isCurrent ? `Era Vigente (${era.stage})` : `Era ${era.stage}`,
      icon: History,
      eraData: {
        name: era.name,
        stage: era.stage,
        highlightSummary: era.highlightSummary,
        startYear: era.startYear
      }
    });
  });

  // Albums
  playerAlbums.forEach(album => {
    const albumMonth = TimeSystem.getMonthName(album.releaseMonth || 1);
    const prodName = album.producerId && world?.producers?.[album.producerId]
      ? world.producers[album.producerId].name
      : 'Producción Propia';

    timelineItems.push({
      id: `traj_alb_${album.id}`,
      year: album.releaseYear,
      month: album.releaseMonth,
      type: 'album',
      title: `Álbum: "${album.title}" (${album.type.toUpperCase()})`,
      description: `${albumMonth} ${album.releaseYear} • ${prodName} • ${album.songIds.length} temas • Crítica: ${album.criticalScore}/100.`,
      metrics: `${((album.totalStreams || 0) / 1000000).toFixed(1)}M streams • ${(album.firstWeekSales || 0).toLocaleString('es-AR')} ventas debut`,
      badge: album.id === bestAlbum?.id ? 'Mejor Disco' : 'Disco Oficial',
      icon: Disc3
    });
  });

  // Singles
  playerSongs.filter(s => s.isSingle).forEach(single => {
    const isHit = (single.peakPosition?.Global ?? 99) <= 10;
    const hasVideo = Boolean(single.musicVideo);
    const mv = single.musicVideo;
    const singleMonth = TimeSystem.getMonthName(single.releaseMonth || 1);

    timelineItems.push({
      id: `traj_sng_${single.id}`,
      year: single.releaseYear,
      month: single.releaseMonth,
      type: 'single',
      title: `Single: "${single.title}"${hasVideo ? ' + Videoclip' : ''}`,
      description: `${singleMonth} ${single.releaseYear} • Calidad ${single.quality}/100${hasVideo && mv ? ` • Video dir. ${mv.directorTier}` : ''}.`,
      metrics: `${((single.streamsTotal || 0) / 1000000).toFixed(1)}M streams • Pico #${single.peakPosition?.Global || '-'} Global`,
      badge: hasVideo ? 'Videoclip' : isHit ? 'Hit Top 10' : 'Single',
      icon: hasVideo ? Video : Disc3
    });
  });

  // Tours
  playerTours.forEach(tour => {
    const tourStops = Array.isArray(tour?.stops) ? tour.stops : [];
    const tourTier = tour?.tier || 'club';
    timelineItems.push({
      id: `traj_tour_${tour?.id || Math.random()}`,
      year: tour?.year || 2026,
      month: tour?.month || 1,
      type: 'tour',
      title: `Gira: "${cleanQuotes(tour?.name || 'Gira')}" • ${tourTier.toUpperCase()}`,
      description: `${tourStops.length} fechas (${tourStops.map(s => s?.city || 'Ciudad').slice(0, 3).join(', ')}...)`,
      metrics: `${formatMoney(tour?.grossRevenue || 0)} recaudación • ${(tour?.totalTicketsSold || 0).toLocaleString('es-AR')} tickets`,
      badge: tour?.id === bestTour?.id ? 'Mejor Gira' : 'Tour',
      icon: MapPin
    });
  });

  // Awards
  player.awardsWon.forEach((award, idx) => {
    const matchYear = award.match(/\((\d{4})\)/);
    const awardYear = matchYear ? parseInt(matchYear[1], 10) : player.careerStartYear;
    timelineItems.push({
      id: `traj_awd_${idx}`,
      year: awardYear,
      month: 12,
      type: 'award',
      title: `Premio de la Academia: ${award}`,
      description: 'Galardón oficial de la Academia Musical.',
      metrics: '+6 Puntos de Legado',
      badge: 'Estatuilla',
      icon: Trophy
    });
  });

  // Contract
  if (player.activeContract && player.labelId) {
    const label = world.labels[player.labelId];
    timelineItems.push({
      id: 'traj_contract',
      year: player.activeContract.signedYear,
      month: 1,
      type: 'contract',
      title: `Firma con ${label?.name || 'Sello Discográfico'}`,
      description: `${player.activeContract.albumsRequired} álbumes • ${player.activeContract.royaltyPercentage}% regalías • Adelanto ${formatMoney(player.activeContract.signingBonus)}.`,
      badge: 'Contrato',
      icon: Building2
    });
  }

  timelineItems.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });

  const filteredTimeline = timelineItems.filter(item => {
    if (timelineFilter === 'eras') return item.type === 'era' || item.type === 'contract';
    if (timelineFilter === 'releases') return item.type === 'album' || item.type === 'single';
    if (timelineFilter === 'tours') return item.type === 'tour';
    if (timelineFilter === 'awards') return item.type === 'award';
    return true;
  });

  return (
    <div className="space-y-5 pb-16 font-sans text-[#F4F0EA]">
      <SectionSubNav
        hub="legado"
        activeTab="career"
        onNavigate={onNavigate}
        awardsCount={player?.awardsWon?.length || 0}
      />

      {/* 1. COMPACT HEADER + KPIs */}
      <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider bg-[#18181C] border border-[#242429] text-[#FF4F00] px-2 py-0.5 rounded-[4px]">
                Trayectoria & Legado
              </span>
              <span className="text-xs text-[#8E8E99] tabular-nums">
                {yearsActive} {yearsActive === 1 ? 'Año Activo' : 'Años Activos'} • {player.careerStage}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F4F0EA] tracking-tight mt-1 flex items-center gap-2.5">
              <TrendingUp className="w-6 h-6 text-[#FF4F00]" strokeWidth={1.75} />
              Carrera & Eras de {player.name}
            </h1>
          </div>

          {/* Action Controls & Legacy Score */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {!player.isRetired && (
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowNewEraForm(prev => !prev);
                }}
                className="flex items-center justify-center gap-2 bg-[#18181C] hover:bg-[#242429] border border-[#FF4F00]/45 text-[#FF4F00] font-bold text-xs px-3.5 py-2.5 rounded-[4px] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" strokeWidth={1.75} />
                <span>Iniciar Nueva Era</span>
              </button>
            )}

            {onOpenMilestone && (
              <button
                id="btn-generate-cover-eras"
                onClick={() =>
                  onOpenMilestone({
                    type: 'era_transition',
                    title: `Portada Oficial: ${player.eras[player.eras.length - 1]?.name || 'Era Musical'}`,
                    eraName: player.eras[player.eras.length - 1]?.name,
                    stage: player.careerStage,
                    milestoneLabel: `ERA ${player.careerStage.toUpperCase()}`,
                    statValue: `${(player.stats.totalStreams / 1000000).toFixed(1)}M Streams`,
                    year: world.currentYear
                  })
                }
                className="flex items-center justify-center gap-2 bg-[#F4F0EA] hover:bg-white text-[#09090B] font-bold text-xs px-3.5 py-2.5 rounded-[4px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <Newspaper className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
                <span>Generar Portada de Revista</span>
              </button>
            )}

            <button
              id="btn-open-legacy-card"
              onClick={() => setLegacyModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#FF4F00] hover:bg-[#E04500] text-white font-bold text-xs px-3.5 py-2.5 rounded-[4px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <Disc3 className="w-4 h-4 text-white" strokeWidth={1.75} />
              <span>Ficha Oficial EPK</span>
            </button>

            <div className="bg-[#18181C] px-4 py-2 rounded-[4px] border border-[#242429] text-center tabular-nums">
              <span className="text-2xs text-[#F59E0B] block uppercase tracking-wider font-bold">
                Legado
              </span>
              <span className="text-xl font-bold text-[#F59E0B]">
                {player.legacyScore}
                <span className="text-xs font-normal text-[#8E8E99]">/100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Compact New Era Form */}
        {showNewEraForm && (
          <form onSubmit={handleSubmitNewEra} className="bg-[#18181C] border border-[#FF4F00]/45 rounded-[6px] p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={newEraName}
              onChange={(e) => setNewEraName(e.target.value)}
              placeholder="Nombre de la nueva era (ej: Noches de Neón, El Renacimiento)..."
              maxLength={60}
              className="flex-1 bg-[#111114] border border-[#242429] rounded-[4px] px-3 py-2 text-xs text-[#F4F0EA] placeholder-[#52525B] focus:outline-none focus:border-[#FF4F00]"
            />
            <select
              value={newEraGenre}
              onChange={(e) => setNewEraGenre(e.target.value)}
              aria-label="Enfoque sonoro de la nueva era"
              className="bg-[#111114] border border-[#242429] rounded-[4px] px-3 py-2 text-xs text-[#F4F0EA] focus:outline-none focus:border-[#FF4F00]"
            >
              {(Object.values(world?.genres || {}) as Genre[]).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                Abrir Era
              </button>
              <button
                type="button"
                onClick={() => setShowNewEraForm(false)}
                className="p-2 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99] hover:text-[#F4F0EA] cursor-pointer"
                aria-label="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* 6 Compact KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 tabular-nums">
          <div className="bg-[#18181C] border border-[#242429] p-3 rounded-[4px]">
            <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold">Total Streams</span>
            <p className="text-base font-bold text-[#F4F0EA] mt-0.5">{(player.stats.totalStreams / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-[#18181C] border border-[#242429] p-3 rounded-[4px]">
            <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold">Hits Top 10</span>
            <p className="text-base font-bold text-[#FF4F00] mt-0.5">{totalHits} <span className="text-xs font-normal text-[#8E8E99]">temas</span></p>
          </div>
          <div className="bg-[#18181C] border border-[#242429] p-3 rounded-[4px]">
            <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold">Hits #1 Charts</span>
            <p className="text-base font-bold text-[#10B981] mt-0.5">{totalNo1s} <span className="text-xs font-normal text-[#8E8E99]">himnos</span></p>
          </div>
          <div className="bg-[#18181C] border border-[#242429] p-3 rounded-[4px]">
            <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold">Álbumes</span>
            <p className="text-base font-bold text-[#F4F0EA] mt-0.5">{playerAlbums.length} <span className="text-xs font-normal text-[#8E8E99]">LPs</span></p>
          </div>
          <div className="bg-[#18181C] border border-[#242429] p-3 rounded-[4px]">
            <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold">Premios</span>
            <p className="text-base font-bold text-[#F59E0B] mt-0.5">{player.awardsWon.length} <span className="text-xs font-normal text-[#8E8E99]">trofeos</span></p>
          </div>
          <div className="bg-[#18181C] border border-[#242429] p-3 rounded-[4px]">
            <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold">Giras</span>
            <p className="text-base font-bold text-[#10B981] mt-0.5">{playerTours.length} <span className="text-xs font-normal text-[#8E8E99]">tours</span></p>
          </div>
        </div>
      </div>

      {/* 2. HITOS DESTACADOS: MEJOR DISCO & MEJOR GIRA (COMPACT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mejor Disco */}
        <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-[#F4F0EA] uppercase tracking-wider flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
              Mejor Disco Histórico
            </h2>
            <span className="text-2xs uppercase font-bold bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/40 px-2 py-0.5 rounded-[4px]">
              Obra Cumbre
            </span>
          </div>

          {bestAlbum ? (
            <div className="bg-[#18181C] border border-[#242429] rounded-[4px] p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-2xs text-[#8E8E99] tabular-nums block">
                    {formatReleaseDate(bestAlbum.releaseMonth, bestAlbum.releaseYear, 'long')} • {bestAlbum.songIds.length} canciones
                  </span>
                  <h3 className="text-base font-bold text-[#F4F0EA] mt-0.5">{bestAlbum.title}</h3>
                </div>
                <span className={`text-2xs font-bold px-2 py-0.5 rounded-[4px] ${getGenreBadgeClass(bestAlbum.genreId)}`}>
                  {world.genres[bestAlbum.genreId]?.name || bestAlbum.genreId}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#242429] text-center tabular-nums text-xs">
                <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block">Streams</span>
                  <span className="font-bold text-[#F4F0EA]">{(bestAlbum.totalStreams / 1000000).toFixed(1)}M</span>
                </div>
                <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block">Ventas Debut</span>
                  <span className="font-bold text-[#FF4F00]">{(bestAlbum.firstWeekSales || 0).toLocaleString('es-AR')}</span>
                </div>
                <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block">Crítica</span>
                  <span className="font-bold text-[#10B981]">{bestAlbum.criticalScore}/100</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#18181C] border border-[#242429] rounded-[4px] p-4 text-xs text-[#8E8E99]">
              Aún no has publicado un álbum. Grabá tu primer LP o EP en el Estudio.
            </div>
          )}
        </div>

        {/* Mejor Gira */}
        <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-[#F4F0EA] uppercase tracking-wider flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
              Mejor Gira Histórica
            </h2>
            <span className="text-2xs uppercase font-bold bg-[#18181C] text-[#10B981] border border-[#10B981]/40 px-2 py-0.5 rounded-[4px]">
              Récord Taquilla
            </span>
          </div>

          {bestTour ? (
            <div className="bg-[#18181C] border border-[#242429] rounded-[4px] p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-2xs text-[#8E8E99] tabular-nums block">
                    Año {bestTour.year}, Mes {bestTour.month} • {(bestTour.stops || []).length} ciudades
                  </span>
                  <h3 className="text-base font-bold text-[#F4F0EA] mt-0.5">{bestTour.name}</h3>
                </div>
                <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded-[4px] bg-[#111114] text-[#F59E0B] border border-[#F59E0B]/40">
                  {bestTour.tier || 'club'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#242429] text-center tabular-nums text-xs">
                <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block">Recaudación</span>
                  <span className="font-bold text-[#10B981]">{formatMoney(bestTour.grossRevenue || 0)}</span>
                </div>
                <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block">Neto Artista</span>
                  <span className="font-bold text-[#10B981]">{formatMoney(bestTour.netArtistProfit || 0)}</span>
                </div>
                <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block">Tickets</span>
                  <span className="font-bold text-[#F4F0EA]">{(bestTour.totalTicketsSold || 0).toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#18181C] border border-[#242429] rounded-[4px] p-4 text-xs text-[#8E8E99]">
              Aún no has salido de gira. Organizá tu primer tour en la sección de Giras & Festivales.
            </div>
          )}
        </div>
      </div>

      {/* 3. LÍNEA DE TIEMPO UNIFICADA DE ERAS & TRAYECTORIA */}
      <div className="bg-[#111114] border border-[#242429] rounded-[8px] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <h2 className="text-base font-bold text-[#F4F0EA] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF4F00]" strokeWidth={1.75} />
              Línea de Tiempo de Eras & Trayectoria ({filteredTimeline.length})
            </h2>
            <p className="text-xs text-[#8E8E99] mt-0.5">
              Evolución de eras artísticas, lanzamientos clave, giras y premios obtenidos
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x pb-1 text-xs">
            {[
              { id: 'all', label: 'Todo' },
              { id: 'eras', label: `Eras (${player.eras.length})` },
              { id: 'releases', label: 'Lanzamientos' },
              { id: 'tours', label: 'Giras' },
              { id: 'awards', label: 'Premios' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTimelineFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer border whitespace-nowrap ${
                  timelineFilter === f.id
                    ? 'bg-[#FF4F00] text-white font-bold border-[#FF4F00]'
                    : 'bg-[#18181C] text-[#8E8E99] border-[#242429] hover:text-[#F4F0EA] hover:bg-[#242429]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredTimeline.length === 0 ? (
          <div className="text-center py-8 text-[#8E8E99] text-xs">
            No se encontraron hitos para el filtro seleccionado.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTimeline.map((item) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-[#18181C] p-4 rounded-[6px] border border-[#242429] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3F3F46] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-[4px] border border-[#242429] bg-[#111114] text-[#FF4F00] shrink-0 mt-0.5">
                      <ItemIcon className="w-4 h-4" strokeWidth={1.75} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#F4F0EA]">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded-[4px] border border-[#242429] bg-[#111114] text-[#F59E0B]">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#8E8E99] leading-relaxed">
                        {item.description}
                      </p>

                      {item.metrics && (
                        <p className="text-xs tabular-nums text-[#10B981] font-semibold">
                          {item.metrics}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0 tabular-nums text-xs text-[#8E8E99]">
                    <div className="text-right">
                      <span className="font-bold text-[#F4F0EA]">{item.year}</span>
                      <span className="text-2xs text-[#8E8E99] ml-1.5 sm:ml-0 sm:block">Mes {item.month}</span>
                    </div>

                    {item.eraData && onOpenMilestone && (
                      <button
                        onClick={() =>
                          onOpenMilestone({
                            type: 'era_transition',
                            title: `Portada: ${item.eraData!.name}`,
                            eraName: item.eraData!.name,
                            stage: item.eraData!.stage,
                            milestoneLabel: `ERA ${item.eraData!.stage.toUpperCase()}`,
                            year: item.eraData!.startYear,
                            quote: item.eraData!.highlightSummary
                          })
                        }
                        className="inline-flex items-center gap-1 text-2xs font-semibold text-[#F4F0EA] hover:text-[#FF4F00] transition-colors cursor-pointer"
                      >
                        <Newspaper className="w-3 h-3 text-[#FF4F00]" strokeWidth={1.75} />
                        <span>Portada</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Official Career EPK / Vinyl Legacy Card Modal */}
      {legacyModalOpen && (
        <LegacyCardModal
          player={player}
          world={world}
          onClose={() => setLegacyModalOpen(false)}
          onRetire={onRetireArtist}
          onRetireArtist={onRetireArtist}
        />
      )}
    </div>
  );
};
