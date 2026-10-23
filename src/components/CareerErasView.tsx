import React, { useState } from 'react';
import { Artist, WorldState, CareerEra, Song, Album, Tour } from '../types';
import {
  TrendingUp,
  Sparkles,
  Award,
  Calendar,
  History,
  Trophy,
  Crown,
  Star,
  Disc3,
  Flame,
  ArrowRight,
  DollarSign,
  Users,
  MapPin,
  Building2,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Newspaper,
  Video
} from 'lucide-react';
import { TimeSystem } from '../systems/TimeSystem';
import {
  getGenreTheme,
  getGenreBadgeClass,
  RELEASE_BADGES,
  ARTISTIC_COVER_GRADIENTS
} from '../utils/themeColors';
import { formatMoney, cleanQuotes, cleanParentheses, formatCityCountry, formatReleaseDate } from '../utils/formatters';
import { LegacyCardModal } from './LegacyCardModal';

interface CareerErasViewProps {
  player: Artist;
  world: WorldState;
  onOpenMilestone?: (data?: any) => void;
  onRetireArtist?: () => void;
}

export const CareerErasView: React.FC<CareerErasViewProps> = ({ player, world, onOpenMilestone, onRetireArtist }) => {
  const [legacyModalOpen, setLegacyModalOpen] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'releases' | 'tours' | 'awards' | 'eras'>('all');
  const [discographySort, setDiscographySort] = useState<'date' | 'streams' | 'score'>('streams');

  const playerId = player?.id || 'player';
  const yearsActive = TimeSystem.calculateCareerLengthYears(player?.careerStartYear || 2026, world?.currentYear || 2026);
  const playerSongs = (Object.values(world?.songs || {}) as Song[]).filter(s => s.artistId === playerId);
  const playerAlbums = (Object.values(world?.albums || {}) as Album[]).filter(a => a.artistId === playerId);
  const playerTours = (world?.tours || []).filter(t => t.artistId === playerId);

  // Overall Statistics
  const totalNo1s = playerSongs.filter(s => s.peakPosition?.Global === 1 || s.peakPosition?.Argentina === 1).length;
  const totalHits = playerSongs.filter(s => (s.peakPosition?.Global ?? 99) <= 10).length;
  const totalTourGross = playerTours.reduce((sum, t) => sum + (t.grossRevenue || 0), 0);
  const totalTourProfit = playerTours.reduce((sum, t) => sum + (t.netArtistProfit || 0), 0);
  const totalTicketsSold = playerTours.reduce((sum, t) => sum + (t.totalTicketsSold || 0), 0);

  // 1. MEJOR DISCO (Album with highest accumulated streams + sales score)
  const bestAlbum: Album | null = playerAlbums.length > 0
    ? [...playerAlbums].sort((a, b) => {
        const scoreA = (a.totalStreams || 0) + (a.firstWeekSales || 0) * 15;
        const scoreB = (b.totalStreams || 0) + (b.firstWeekSales || 0) * 15;
        return scoreB - scoreA;
      })[0]
    : null;

  // 2. MEJOR GIRA (Tour with highest gross revenue)
  const bestTour: Tour | null = playerTours.length > 0
    ? [...playerTours].sort((a, b) => b.grossRevenue - a.grossRevenue)[0]
    : null;

  // 3. SORTED DISCOGRAPHY
  const sortedAlbums = [...playerAlbums].sort((a, b) => {
    if (discographySort === 'date') {
      return (b.releaseYear * 12 + b.releaseMonth) - (a.releaseYear * 12 + a.releaseMonth);
    }
    if (discographySort === 'score') {
      return b.criticalScore - a.criticalScore;
    }
    return b.totalStreams - a.totalStreams;
  });

  // 4. CHRONOLOGICAL TIMELINE OF TRAJECTORY
  interface TrajectoryItem {
    id: string;
    year: number;
    month: number;
    type: 'era' | 'album' | 'single' | 'tour' | 'award' | 'contract';
    title: string;
    description: string;
    metrics?: string;
    badge?: string;
    badgeClass?: string;
    icon: React.ElementType;
    iconBgClass: string;
  }

  const timelineItems: TrajectoryItem[] = [];

  // Career Debut
  timelineItems.push({
    id: `traj_debut`,
    year: player.careerStartYear,
    month: 1,
    type: 'era',
    title: `Debut Artístico en la Escena`,
    description: `Comienzo formal de la trayectoria artística en ${formatCityCountry(player.city, player.country)}. Enfoque sonoro inicial: ${world.genres[player.mainGenreId]?.name || player.mainGenreId}.`,
    badge: 'Inicio de Carrera',
    badgeClass: 'bg-orange-900/40 text-orange-300 border-orange-500/40',
    icon: Sparkles,
    iconBgClass: 'bg-orange-950/60 text-orange-400 border-orange-500/40'
  });

  // Eras
  player.eras.forEach((era, idx) => {
    if (idx > 0) {
      timelineItems.push({
        id: `traj_era_${era.id}`,
        year: era.startYear,
        month: era.startMonth,
        type: 'era',
        title: `Transición a Era: "${era.name}"`,
        description: `${era.highlightSummary} • Etapa ${era.stage} • Sonido: ${world.genres[era.genreFocus]?.name || era.genreFocus}`,
        badge: `Era ${era.stage}`,
        badgeClass: 'bg-teal-900/40 text-teal-300 border-teal-500/40',
        icon: TrendingUp,
        iconBgClass: 'bg-teal-950/60 text-teal-400 border-teal-500/40'
      });
    }
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
      title: `Lanzamiento de Álbum: "${album.title}"`,
      description: `Álbum producido en ${albumMonth} ${album.releaseYear} • ${prodName} con ${album.songIds.length} canciones • ${album.type.toUpperCase()}. Calificación crítica: ${album.criticalScore}/100.`,
      metrics: `${((album.totalStreams || 0) / 1000000).toFixed(1)}M streams • ${(album.firstWeekSales || 0).toLocaleString('es-AR')} ventas debut`,
      badge: album.id === bestAlbum?.id ? 'Mejor Disco' : 'Disco Oficial',
      badgeClass: album.id === bestAlbum?.id ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 font-bold' : 'bg-indigo-900/40 text-indigo-300 border-indigo-500/40',
      icon: Disc3,
      iconBgClass: 'bg-indigo-950/60 text-indigo-400 border-indigo-500/40'
    });
  });

  // Singles (Top singles or all singles)
  playerSongs.filter(s => s.isSingle).forEach(single => {
    const isHit = (single.peakPosition?.Global ?? 99) <= 10;
    const hasVideo = Boolean(single.musicVideo);
    const mv = single.musicVideo;
    const singleMonth = TimeSystem.getMonthName(single.releaseMonth || 1);
    const prodName = single.producerId && world?.producers?.[single.producerId]
      ? world.producers[single.producerId].name
      : 'Producción Propia';

    timelineItems.push({
      id: `traj_sng_${single.id}`,
      year: single.releaseYear,
      month: single.releaseMonth,
      type: 'single',
      title: `Single: "${single.title}"${hasVideo ? ' • Videoclip Oficial' : ''}`,
      description: `Sencillo producido en ${singleMonth} ${single.releaseYear} • ${prodName}. Calidad ${single.quality}/100. ${single.isClassic ? 'Consagrado como clásico.' : ''}${hasVideo && mv ? ` Incluye rodaje de videoclip oficial con concepto "${mv.concept}" • Dir. ${mv.directorTier} • ${((mv.views || 0) / 1000).toFixed(0)}k vistas.` : ''}`,
      metrics: `${((single.streamsTotal || 0) / 1000000).toFixed(1)}M streams${hasVideo && mv ? ` • ${((mv.views || 0) / 1000000).toFixed(1)}M vistas en video` : ''} • Pico #${single.peakPosition?.Global || '-'} Mundial`,
      badge: hasVideo ? 'Videoclip Oficial' : isHit ? 'Hit Top 10' : 'Single',
      badgeClass: hasVideo ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 font-bold' : isHit ? 'bg-purple-900/50 text-purple-300 border-purple-500/40 font-bold' : 'bg-purple-950/50 text-purple-300 border-purple-500/40',
      icon: hasVideo ? Video : Disc3,
      iconBgClass: hasVideo ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40' : 'bg-purple-950/60 text-purple-400 border-purple-500/40'
    });
  });

  // Tours
  playerTours.forEach(tour => {
    timelineItems.push({
      id: `traj_tour_${tour.id}`,
      year: tour.year,
      month: tour.month,
      type: 'tour',
      title: `Gira: "${cleanQuotes(tour.name)}" • ${tour.tier.toUpperCase()}`,
      description: `Tour de ${tour.stops.length} fechas por ${tour.stops.map(s => s.city).slice(0, 3).join(', ')}...`,
      metrics: `${formatMoney(tour.grossRevenue || 0)} recaudación • ${(tour.totalTicketsSold || 0).toLocaleString('es-AR')} tickets vendidos`,
      badge: tour.id === bestTour?.id ? 'Mejor Gira' : 'Tour',
      badgeClass: tour.id === bestTour?.id ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 font-bold' : 'bg-orange-900/40 text-orange-300 border-orange-500/40',
      icon: Sparkles,
      iconBgClass: 'bg-orange-950/60 text-orange-400 border-orange-500/40'
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
      description: `Galardón otorgado por la academia musical en reconocimiento a la excelencia artística y comercial.`,
      metrics: `+5 Puntos de Legado Oficial`,
      badge: 'Estatuilla',
      badgeClass: 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40 font-bold',
      icon: Trophy,
      iconBgClass: 'bg-yellow-950/60 text-yellow-400 border-yellow-500/40'
    });
  });

  // Contract if signed
  if (player.activeContract && player.labelId) {
    const label = world.labels[player.labelId];
    timelineItems.push({
      id: `traj_contract`,
      year: player.activeContract.signedYear,
      month: 1,
      type: 'contract',
      title: `Firma de Contrato con ${label?.name || 'Sello Discográfico'}`,
      description: `Acuerdo discográfico por ${player.activeContract.albumsRequired} álbumes • ${player.activeContract.royaltyPercentage}% de regalías • Adelanto de ${formatMoney(player.activeContract.signingBonus)}.`,
      badge: 'Contrato',
      badgeClass: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40',
      icon: Building2,
      iconBgClass: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
    });
  }

  // Sort Chronologically descending
  timelineItems.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });

  const filteredTimeline = timelineItems.filter(item => {
    if (timelineFilter === 'releases') return item.type === 'album' || item.type === 'single';
    if (timelineFilter === 'tours') return item.type === 'tour';
    if (timelineFilter === 'awards') return item.type === 'award';
    if (timelineFilter === 'eras') return item.type === 'era' || item.type === 'contract';
    return true;
  });

  return (
    <div className="space-y-8 pb-16 text-[#F4F4F6]">
      {/* 1. HEADER SECTION */}
      <div className="bg-[#111114] p-6 sm:p-8 rounded-[6px] border border-[#242429] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider bg-[#18181C] text-[#FF4F00] border border-[#FF4F00]/30 px-2.5 py-0.5 rounded-[4px] font-sans">
              Trayectoria & Legado
            </span>
            <span className="text-xs text-[#8E8E99] font-sans tabular-nums">
              {yearsActive + 1} Años de Actividad • {player.careerStage}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F4F6] tracking-tight mt-1.5 flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-[#FF4F00]" />
            Carrera, Discografía & Hitos de {player.name}
          </h1>
          <p className="text-xs text-[#8E8E99] mt-1 max-w-2xl leading-relaxed">
            Revisa la cronología completa de tu trayectoria: el desempeño de tu discografía, la mejor gira de tu vida, las estatuillas ganadas y la evolución estética entre tus distintas Eras.
          </p>
        </div>

        {/* Action Controls & Legacy Score Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
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
              className="flex items-center justify-center gap-2 bg-[#F4F4F6] hover:bg-white text-[#09090B] font-bold text-xs px-4 py-2.5 rounded-[4px] active:translate-y-[1px] transition-all cursor-pointer shadow-none"
            >
              <Newspaper className="w-4 h-4 text-[#FF4F00]" />
              <span>Generar Portada de Revista</span>
            </button>
          )}

          <button
            id="btn-open-legacy-card"
            onClick={() => setLegacyModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#FF4F00] hover:bg-[#E04500] text-white font-bold text-xs px-4 py-2.5 rounded-[4px] active:translate-y-[1px] transition-all cursor-pointer shadow-none font-sans"
          >
            <Disc3 className="w-4 h-4 text-white" />
            <span>Ficha Oficial EPK</span>
          </button>

          {/* Legacy Score Box */}
          <div className="bg-[#09090B] px-5 py-3 rounded-[6px] border border-[#242429] text-center font-sans tabular-nums shrink-0 shadow-sm">
            <span className="text-2xs text-[#F59E0B] block uppercase tracking-wider font-bold">
              Puntaje de Legado
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#F59E0B]">
              {player.legacyScore}
              <span className="text-sm font-normal text-[#8E8E99]">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-[#111114] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
          <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold font-sans">
            Total Streams
          </span>
          <p className="text-base sm:text-lg font-bold text-[#F4F4F6] font-sans tabular-nums">
            {(player.stats.totalStreams / 1000000).toFixed(1)}M
          </p>
        </div>

        <div className="bg-[#111114] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
          <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold font-sans">
            Hits Top 10
          </span>
          <p className="text-base sm:text-lg font-bold text-[#FF4F00] font-sans tabular-nums">
            {totalHits} <span className="text-xs font-normal text-[#8E8E99]">temas</span>
          </p>
        </div>

        <div className="bg-[#111114] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
          <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold font-sans">
            Hits #1 Charts
          </span>
          <p className="text-base sm:text-lg font-bold text-[#00E599] font-sans tabular-nums">
            {totalNo1s} <span className="text-xs font-normal text-[#8E8E99]">himnos</span>
          </p>
        </div>

        <div className="bg-[#111114] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
          <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold font-sans">
            Álbumes Lanzados
          </span>
          <p className="text-base sm:text-lg font-bold text-[#F4F4F6] font-sans tabular-nums">
            {playerAlbums.length} <span className="text-xs font-normal text-[#8E8E99]">LPs</span>
          </p>
        </div>

        <div className="bg-[#111114] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
          <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold font-sans">
            Premios Ganados
          </span>
          <p className="text-base sm:text-lg font-bold text-[#F59E0B] font-sans tabular-nums">
            {player.awardsWon.length} <span className="text-xs font-normal text-[#8E8E99]">trofeos</span>
          </p>
        </div>

        <div className="bg-[#111114] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
          <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-bold font-sans">
            Giras Realizadas
          </span>
          <p className="text-base sm:text-lg font-bold text-[#00E599] font-sans tabular-nums">
            {playerTours.length} <span className="text-xs font-normal text-[#8E8E99]">tours</span>
          </p>
        </div>
      </div>

      {/* 3. HERO SHOWCASE: MEJOR DISCO & MEJOR GIRA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. MEJOR DISCO */}
        <div className="bg-surface border border-line rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#242429] pb-3">
            <div className="flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-[#FF4F00]" />
              <h2 className="text-base font-bold text-[#F4F4F6]">
                Mejor Disco Histórico • Obra Cumbre
              </h2>
            </div>
            <span className="text-2xs uppercase font-bold bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/40 px-2.5 py-0.5 rounded-[4px] font-sans">
              Récord de Ventas & Streams
            </span>
          </div>

          {bestAlbum ? (
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-5 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Cover */}
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-[4px] border border-[#242429] bg-gradient-to-br ${bestAlbum.coverGradient || ARTISTIC_COVER_GRADIENTS[0]} shrink-0 flex flex-col justify-end p-2.5 text-white shadow-sm`}
                >
                  <Disc3 className="w-5 h-5 opacity-90" />
                  <span className="text-2xs font-extrabold uppercase truncate mt-auto drop-shadow-sm font-sans">
                    {bestAlbum.type}
                  </span>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-[#8E8E99] tabular-nums">
                      Lanzado en {formatReleaseDate(bestAlbum.releaseMonth, bestAlbum.releaseYear, 'long')}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-[4px] bg-[#18181C] text-[#00E599] border border-[#00E599]/30 font-sans tabular-nums">
                      Crítica: {bestAlbum.criticalScore}/100
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F4F4F6] tracking-tight">
                    {bestAlbum.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className={`text-2xs font-bold px-2 py-0.5 rounded-[4px] ${getGenreBadgeClass(bestAlbum.genreId)} font-sans`}>
                      {world.genres[bestAlbum.genreId]?.name || bestAlbum.genreId}
                    </span>
                    <span className="text-xs text-[#8E8E99] font-sans tabular-nums">
                      {bestAlbum.songIds.length} canciones
                    </span>
                  </div>

                  {bestAlbum.criticalReviewText && (
                    <p className="text-xs text-[#8E8E99] italic bg-[#111114] p-2.5 rounded-[4px] border border-[#242429]">
                      "{bestAlbum.criticalReviewText}"
                    </p>
                  )}
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#242429] text-center font-sans tabular-nums">
                <div className="bg-[#18181C] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block font-semibold font-sans">Streams Totales</span>
                  <span className="text-xs sm:text-sm font-bold text-[#F4F4F6]">
                    {(bestAlbum.totalStreams / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="bg-[#18181C] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block font-semibold font-sans">Ventas Debut</span>
                  <span className="text-xs sm:text-sm font-bold text-[#FF4F00]">
                    {(bestAlbum.firstWeekSales || 0).toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="bg-[#18181C] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block font-semibold font-sans">Score Comercial</span>
                  <span className="text-xs sm:text-sm font-bold text-[#00E599]">
                    {bestAlbum.commercialScore}/100
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-[4px] bg-[#111114] text-[#8E8E99] mx-auto flex items-center justify-center border border-[#242429]">
                <Disc3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#F4F4F6]">Aún no has publicado un álbum</h3>
              <p className="text-xs text-[#8E8E99] max-w-sm mx-auto">
                Dirígete al Estudio para componer y producir tu primer LP o EP conceptual y consagrar tu sonido.
              </p>
            </div>
          )}
        </div>

        {/* B. MEJOR GIRA */}
        <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#242429] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF4F00]" />
              <h2 className="text-base font-bold text-[#F4F4F6]">
                Mejor Gira Histórica • Mayor Recaudación
              </h2>
            </div>
            <span className="text-2xs uppercase font-bold bg-[#18181C] text-[#00E599] border border-[#00E599]/40 px-2.5 py-0.5 rounded-[4px] font-sans">
              Récord de Asistencia & Taquilla
            </span>
          </div>

          {bestTour ? (
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-5 space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-[#8E8E99] tabular-nums">
                    Año {bestTour.year} • Mes {bestTour.month}
                  </span>
                  <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-[4px] bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/40 font-sans">
                    Nivel: {bestTour.tier}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#F4F4F6] tracking-tight">
                  {bestTour.name}
                </h3>

                <p className="text-xs text-[#8E8E99] flex items-center gap-1.5 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#EF4444]" />
                  {bestTour.stops.length} ciudades visitadas: {bestTour.stops.slice(0, 4).map(s => s.city).join(', ')}...
                </p>
              </div>

              {/* Tour Numbers */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#242429] text-center font-sans tabular-nums">
                <div className="bg-[#18181C] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block font-semibold font-sans">Recaudación Bruta</span>
                  <span className="text-xs sm:text-sm font-bold text-[#00E599]">
                    ${(bestTour.grossRevenue || 0).toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="bg-[#18181C] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block font-semibold font-sans">Beneficio Neto</span>
                  <span className="text-xs sm:text-sm font-bold text-[#00E599]">
                    ${(bestTour.netArtistProfit || 0).toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="bg-[#18181C] p-2 rounded-[4px] border border-[#242429]">
                  <span className="text-2xs text-[#8E8E99] uppercase block font-semibold font-sans">Asistencia</span>
                  <span className="text-xs sm:text-sm font-bold text-[#F4F4F6]">
                    {(bestTour.totalTicketsSold || 0).toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="bg-[#111114] p-2.5 rounded-[4px] border border-[#242429] flex items-center justify-between text-xs text-[#8E8E99] font-sans tabular-nums">
                <span>Tasa de Ocupación: <strong className="text-[#00E599]">{Math.round((bestTour.totalTicketsSold / Math.max(1, bestTour.totalCapacity)) * 100)}%</strong></span>
                <span>Hype Generado: <strong className="text-[#FF4F00]">+{bestTour.hypeGenerated}</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-[4px] bg-[#111114] text-[#8E8E99] mx-auto flex items-center justify-center border border-[#242429]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#F4F4F6]">Aún no has salido de gira</h3>
              <p className="text-xs text-[#8E8E99] max-w-sm mx-auto">
                Cuando acumules 85% de energía, organizá tu primer tour en la sección de Giras & Shows para llenar clubes, teatros y estadios.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. CHRONOLOGICAL ERAS TIMELINE */}
      <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#242429] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
              <History className="w-5 h-5 text-[#FF4F00]" />
              Evolución de Eras Musicales ({player.eras.length})
            </h2>
            <p className="text-xs text-[#8E8E99] mt-0.5">
              Transiciones estéticas, cambios sonoros y madurez cultural del artista
            </p>
          </div>
          <span className="text-xs font-sans tabular-nums text-[#8E8E99] bg-[#09090B] px-2.5 py-1 rounded-[4px] border border-[#242429]">
            Etapa Actual: <strong className="text-[#FF4F00]">{player.careerStage}</strong>
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#242429] space-y-6 my-2">
          {player.eras.map((era, index) => {
            const isCurrent = index === player.eras.length - 1;
            const eraAlbums = playerAlbums.filter(a => a.releaseYear >= era.startYear && (!era.endYear || a.releaseYear <= era.endYear));
            const eraSingles = playerSongs.filter(s => s.isSingle && s.releaseYear >= era.startYear && (!era.endYear || s.releaseYear <= era.endYear));
            const eraGenreTheme = getGenreTheme(era.genreFocus);

            return (
              <div key={era.id} className="relative space-y-2 group">
                {/* Marker dot */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-2 w-4 h-4 rounded-full border-2 transition-all ${
                    isCurrent
                      ? 'bg-[#FF4F00] border-[#FF4F00]'
                      : 'bg-[#18181C] border-[#242429]'
                  }`}
                />

                <div className="bg-[#09090B] p-5 sm:p-6 rounded-[6px] border border-[#242429] space-y-3 shadow-sm hover:border-[#3F3F46] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#242429] pb-2.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-[#F4F4F6]">
                        {era.name}
                      </h3>
                      <span className="text-2xs uppercase font-bold bg-[#18181C] text-[#8E8E99] border border-[#242429] px-2 py-0.5 rounded-[4px] font-sans">
                        {era.stage}
                      </span>
                      {isCurrent && (
                        <span className="text-2xs font-bold font-sans bg-[#FF4F00] text-white px-2 py-0.5 rounded-[4px]">
                          Era Vigente
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-sans text-[#8E8E99] tabular-nums">
                      {TimeSystem.getMonthName(era.startMonth)} {era.startYear} — {era.endYear ? `${TimeSystem.getMonthName(era.endMonth || 12)} ${era.endYear}` : 'Presente'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#8E8E99] leading-relaxed">
                    {era.highlightSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#8E8E99] pt-1">
                    <div className="flex items-center gap-1.5">
                      <span>Enfoque Sonoro:</span>
                      <span className={`text-2xs font-bold font-sans px-2 py-0.5 rounded-[4px] border border-[#242429] bg-[#18181C] text-[#F4F4F6]`}>
                        {world.genres[era.genreFocus]?.name || era.genreFocus}
                      </span>
                    </div>
                    <span>•</span>
                    <span className="font-sans tabular-nums">
                      Lanzamientos en esta Era: <strong className="text-[#F4F4F6] font-semibold">{eraAlbums.length} álbumes, {eraSingles.length} singles{eraSingles.filter(s => s.musicVideo).length > 0 ? ` • ${eraSingles.filter(s => s.musicVideo).length} videoclips` : ''}</strong>
                    </span>
                  </div>

                  {/* Albums released during this era */}
                  {eraAlbums.length > 0 && (
                    <div className="pt-2 border-t border-[#242429] flex items-center gap-2 overflow-x-auto scroll-fade-x">
                      <span className="text-2xs uppercase text-[#8E8E99] font-sans font-semibold shrink-0">
                        Discos Clave:
                      </span>
                      {eraAlbums.map(alb => (
                        <span
                          key={alb.id}
                          className="bg-[#18181C] text-[#F4F4F6] text-xs px-2.5 py-1 rounded-[4px] border border-[#242429] whitespace-nowrap font-sans tabular-nums"
                        >
                         {alb.title} • {alb.criticalScore} pts
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Era Quick Actions */}
                  {onOpenMilestone && (
                    <div className="pt-2 border-t border-[#242429] flex items-center justify-between">
                      <span className="text-xs text-[#8E8E99]">
                        Registrado en los archivos de la crítica y la prensa musical.
                      </span>
                      <button
                        onClick={() =>
                          onOpenMilestone({
                            type: 'era_transition',
                            title: `Portada: ${era.name}`,
                            eraName: era.name,
                            stage: era.stage,
                            milestoneLabel: `ERA ${era.stage.toUpperCase()}`,
                            year: era.startYear,
                            quote: era.highlightSummary
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4F4F6] hover:text-[#FF4F00] transition-colors cursor-pointer"
                      >
                        <Newspaper className="w-3.5 h-3.5 text-[#FF4F00]" />
                        <span>Ver Portada de Revista de esta Era</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. FULL DISCOGRAPHY SECTION */}
      <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242429] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-[#FF4F00]" />
              Catálogo Discográfico Completo ({playerAlbums.length} Proyectos)
            </h2>
            <p className="text-xs text-[#8E8E99] mt-0.5">
              Todos los álbumes, EPs y mixtapes lanzados a lo largo de tu carrera
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#09090B] p-1 rounded-[4px] border border-[#242429] text-xs">
            <span className="text-2xs text-[#8E8E99] uppercase px-2 font-sans">Ordenar:</span>
            <button
              onClick={() => setDiscographySort('streams')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors cursor-pointer font-sans ${
                discographySort === 'streams' ? 'bg-[#F4F4F6] text-[#09090B] font-bold' : 'text-[#8E8E99] hover:text-[#F4F4F6]'
              }`}
            >
              Streams
            </button>
            <button
              onClick={() => setDiscographySort('score')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors cursor-pointer font-sans ${
                discographySort === 'score' ? 'bg-[#F4F4F6] text-[#09090B] font-bold' : 'text-[#8E8E99] hover:text-[#F4F4F6]'
              }`}
            >
              Crítica
            </button>
            <button
              onClick={() => setDiscographySort('date')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors cursor-pointer font-sans ${
                discographySort === 'date' ? 'bg-[#F4F4F6] text-[#09090B] font-bold' : 'text-[#8E8E99] hover:text-[#F4F4F6]'
              }`}
            >
              Fecha
            </button>
          </div>
        </div>

        {sortedAlbums.length === 0 ? (
          <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-8 text-center space-y-2">
            <Disc3 className="w-8 h-8 text-[#8E8E99] mx-auto" />
            <h3 className="text-sm font-semibold text-[#F4F4F6]">Sin Discografía Aún</h3>
            <p className="text-xs text-[#8E8E99]">
              Lanza tu primer álbum o EP en la pestaña de Estudio para comenzar a construir tu catálogo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAlbums.map((album, aIdx) => {
              const isBest = album.id === bestAlbum?.id;
              const albumGenre = getGenreTheme(album.genreId);
              const coverGrad = album.coverGradient || ARTISTIC_COVER_GRADIENTS[aIdx % ARTISTIC_COVER_GRADIENTS.length];
              return (
                <div
                  key={album.id}
                  className={`bg-[#09090B] p-5 rounded-[6px] border transition-all space-y-3 flex flex-col justify-between shadow-sm ${
                    isBest ? 'border-[#FF4F00]/50' : 'border-[#242429] hover:border-[#3F3F46]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-16 h-16 rounded-[4px] bg-gradient-to-br ${coverGrad} shrink-0 border border-[#242429] shadow-sm flex items-end p-1.5 text-white text-2xs font-bold uppercase font-sans`}
                      >
                        {album.type}
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-2xs font-sans text-[#8E8E99] tabular-nums">
                            {TimeSystem.getMonthName(album.releaseMonth || 1)} {album.releaseYear}
                          </span>
                          {isBest && (
                            <span className="bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/40 text-2xs font-bold px-1.5 py-0.5 rounded-[4px] font-sans">
                              Mejor Disco
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-[#F4F4F6] truncate">
                          {album.title}
                        </h3>

                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className={`text-2xs font-bold font-sans px-1.5 py-0.5 rounded-[4px] border border-[#242429] bg-[#18181C] text-[#F4F4F6]`}>
                            {world.genres[album.genreId]?.name || album.genreId}
                          </span>
                          <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">
                            {album.songIds.length} tracks
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center font-sans text-xs tabular-nums">
                      <div className="bg-[#18181C] p-1.5 rounded-[4px] border border-[#242429]">
                        <span className="text-2xs text-[#8E8E99] uppercase block font-semibold font-sans">Streams</span>
                        <span className="font-bold text-[#F4F4F6]">{(album.totalStreams / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="bg-[#18181C] p-1.5 rounded-[4px] border border-[#242429]">
                        <span className="text-2xs text-[#8E8E99] uppercase block font-semibold font-sans">Ventas</span>
                        <span className="font-bold text-[#FF4F00]">{(album.firstWeekSales || 0).toLocaleString('es-AR')}</span>
                      </div>
                      <div className="bg-[#18181C] p-1.5 rounded-[4px] border border-[#242429]">
                        <span className="text-2xs text-[#8E8E99] uppercase block font-semibold font-sans">Crítica</span>
                        <span className="font-bold text-[#00E599]">{album.criticalScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {album.criticalReviewText && (
                    <p className="text-xs text-[#8E8E99] italic line-clamp-2 border-t border-[#242429] pt-2">
                      "{album.criticalReviewText}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. CHRONOLOGICAL TRAJECTORY LOG (TIMELINE DIARY) */}
      <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242429] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF4F00]" />
              Registro Histórico Cronológico de Carrera ({timelineItems.length} Hitos)
            </h2>
            <p className="text-xs text-[#8E8E99] mt-0.5">
              Diario cronológico detallado de cada lanzamiento, premio, gira y acontecimiento
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x pb-1 text-xs">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'releases', label: 'Discografía' },
              { id: 'tours', label: 'Giras' },
              { id: 'awards', label: 'Premios' },
              { id: 'eras', label: 'Eras & Contratos' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTimelineFilter(f.id as any)}
                className={`px-3 py-1 rounded-[4px] transition-colors cursor-pointer border whitespace-nowrap font-sans ${
                  timelineFilter === f.id
                    ? 'bg-[#F4F4F6] text-[#09090B] font-bold border-[#F4F4F6]'
                    : 'bg-[#09090B] text-[#8E8E99] border-[#242429] hover:text-[#F4F4F6] hover:bg-[#18181C]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredTimeline.length === 0 ? (
          <div className="text-center py-8 text-[#8E8E99] text-xs font-sans">
            No se encontraron eventos para el filtro seleccionado.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTimeline.map((item) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-[#09090B] p-4 rounded-[6px] border border-[#242429] flex items-start justify-between gap-4 hover:border-[#3F3F46] transition-all shadow-sm"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-[4px] border border-[#242429] bg-[#18181C] text-[#F4F4F6] shrink-0 mt-0.5">
                      <ItemIcon className="w-4 h-4 text-[#FF4F00]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#F4F4F6]">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className={`text-2xs font-bold font-sans uppercase px-2 py-0.5 rounded-[4px] border border-[#242429] bg-[#18181C] text-[#8E8E99]`}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#8E8E99] leading-relaxed">
                        {item.description}
                      </p>

                      {item.metrics && (
                        <p className="text-xs font-sans tabular-nums text-[#00E599] font-semibold pt-0.5">
                          {item.metrics}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-sans tabular-nums text-xs text-[#8E8E99]">
                    <span className="block font-bold text-[#F4F4F6]">{item.year}</span>
                    <span className="text-2xs text-[#8E8E99]">Mes {item.month}</span>
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
        />
      )}
    </div>
  );
};
