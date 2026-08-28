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
import { formatMoney, cleanQuotes, cleanParentheses, formatCityCountry } from '../utils/formatters';

interface CareerErasViewProps {
  player: Artist;
  world: WorldState;
  onOpenMilestone?: (data?: any) => void;
}

export const CareerErasView: React.FC<CareerErasViewProps> = ({ player, world, onOpenMilestone }) => {
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
  const totalTourGross = playerTours.reduce((sum, t) => sum + t.grossRevenue, 0);
  const totalTourProfit = playerTours.reduce((sum, t) => sum + t.netArtistProfit, 0);
  const totalTicketsSold = playerTours.reduce((sum, t) => sum + t.totalTicketsSold, 0);

  // 1. MEJOR DISCO (Album with highest accumulated streams + sales score)
  const bestAlbum: Album | null = playerAlbums.length > 0
    ? [...playerAlbums].sort((a, b) => {
        const scoreA = a.totalStreams + a.firstWeekSales * 15;
        const scoreB = b.totalStreams + b.firstWeekSales * 15;
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
    badgeClass: 'bg-purple-900/40 text-purple-300 border-purple-500/40',
    icon: Sparkles,
    iconBgClass: 'bg-purple-950/60 text-purple-400 border-purple-500/40'
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
        description: `${era.highlightSummary} (Etapa ${era.stage} • Sonido: ${world.genres[era.genreFocus]?.name || era.genreFocus})`,
        badge: `Era ${era.stage}`,
        badgeClass: 'bg-teal-900/40 text-teal-300 border-teal-500/40',
        icon: TrendingUp,
        iconBgClass: 'bg-teal-950/60 text-teal-400 border-teal-500/40'
      });
    }
  });

  // Albums
  playerAlbums.forEach(album => {
    timelineItems.push({
      id: `traj_alb_${album.id}`,
      year: album.releaseYear,
      month: album.releaseMonth,
      type: 'album',
      title: `Lanzamiento de Álbum: "${album.title}"`,
      description: `Álbum de ${album.songIds.length} canciones (${album.type.toUpperCase()}). Calificación crítica: ${album.criticalScore}/100.`,
      metrics: `${(album.totalStreams / 1000000).toFixed(1)}M streams • ${album.firstWeekSales.toLocaleString()} ventas debut`,
      badge: album.id === bestAlbum?.id ? 'Mejor Disco ⭐' : 'Disco Oficial',
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

    timelineItems.push({
      id: `traj_sng_${single.id}`,
      year: single.releaseYear,
      month: single.releaseMonth,
      type: 'single',
      title: `Single: "${single.title}"${hasVideo ? ' 🎬 (Videoclip Oficial)' : ''}`,
      description: `Sencillo de calidad ${single.quality}/100. ${single.isClassic ? 'Consagrado como clásico.' : ''}${hasVideo && mv ? ` Incluye rodaje de videoclip oficial con concepto "${mv.concept}" (Dir. ${mv.directorTier}, ${(mv.views / 1000).toFixed(0)}k vistas).` : ''}`,
      metrics: `${(single.streamsTotal / 1000000).toFixed(1)}M streams${hasVideo && mv ? ` • ${(mv.views / 1000000).toFixed(1)}M vistas en video` : ''} • Pico #${single.peakPosition?.Global || '-'} Mundial`,
      badge: hasVideo ? '🎬 Videoclip Oficial' : isHit ? 'Hit Top 10 🔥' : 'Single',
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
      title: `Gira: "${cleanQuotes(tour.name)}" (${tour.tier.toUpperCase()})`,
      description: `Tour de ${tour.stops.length} fechas por ${tour.stops.map(s => s.city).slice(0, 3).join(', ')}...`,
      metrics: `${formatMoney(tour.grossRevenue)} recaudación • ${tour.totalTicketsSold.toLocaleString()} tickets vendidos`,
      badge: tour.id === bestTour?.id ? 'Mejor Gira ⭐' : 'Tour',
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
      badge: 'Estatuilla 🏆',
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
      description: `Acuerdo discográfico por ${player.activeContract.albumsRequired} álbumes (${player.activeContract.royaltyPercentage}% de regalías, adelanto de ${formatMoney(player.activeContract.signingBonus)}).`,
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
    <div
      className="space-y-8 pb-16 text-[#F8FAFC]"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* 1. HEADER SECTION */}
      <div className="bg-[#16181F] p-6 sm:p-8 rounded-[16px] border border-[#2A2E3D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-950/60 text-teal-300 border border-teal-500/40 px-2.5 py-0.5 rounded-[4px]">
              Trayectoria & Legado
            </span>
            <span className="text-xs text-[#94A3B8]">
              {yearsActive + 1} Años de Actividad • {player.careerStage}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#F8FAFC] tracking-[-1.1px] mt-1.5 flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-teal-400" />
            Carrera, Discografía & Hitos de {player.name}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
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
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] text-xs px-4 py-3 rounded-[6px] hover:opacity-95 active:scale-98 transition-all cursor-pointer"
            >
              <Newspaper className="w-4 h-4 text-amber-300" />
              <span>Generar Portada de Revista</span>
            </button>
          )}

          {/* Legacy Score Box */}
          <div className="bg-[#0B0C10] px-5 py-3 rounded-[12px] border border-amber-500/40 text-center font-mono shrink-0 shadow-sm bg-gradient-to-br from-[#0B0C10] to-amber-950/20">
            <span className="text-[10px] text-amber-400 block uppercase tracking-wider font-bold">
              Puntaje de Legado
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-amber-400">
              {player.legacyScore}
              <span className="text-sm font-normal text-[#94A3B8]">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI CARDS WITH VIBRANT COLORS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-[#16181F] border border-purple-500/30 p-3.5 rounded-[10px] space-y-1 shadow-2xs">
          <span className="text-[10px] text-purple-300 uppercase tracking-wider block font-bold font-mono">
            Total Streams
          </span>
          <p className="text-base sm:text-lg font-bold text-purple-400 font-mono">
            {(player.stats.totalStreams / 1000000).toFixed(1)}M
          </p>
        </div>

        <div className="bg-[#16181F] border border-orange-500/30 p-3.5 rounded-[10px] space-y-1 shadow-2xs">
          <span className="text-[10px] text-orange-300 uppercase tracking-wider block font-bold font-mono">
            Hits Top 10
          </span>
          <p className="text-base sm:text-lg font-bold text-orange-400 font-mono">
            {totalHits} <span className="text-xs font-normal text-[#94A3B8]">temas</span>
          </p>
        </div>

        <div className="bg-[#16181F] border border-amber-500/30 p-3.5 rounded-[10px] space-y-1 shadow-2xs">
          <span className="text-[10px] text-amber-300 uppercase tracking-wider block font-bold font-mono">
            Hits #1 Charts
          </span>
          <p className="text-base sm:text-lg font-bold text-amber-400 font-mono">
            {totalNo1s} <span className="text-xs font-normal text-[#94A3B8]">himnos</span>
          </p>
        </div>

        <div className="bg-[#16181F] border border-blue-500/30 p-3.5 rounded-[10px] space-y-1 shadow-2xs">
          <span className="text-[10px] text-blue-300 uppercase tracking-wider block font-bold font-mono">
            Álbumes Lanzados
          </span>
          <p className="text-base sm:text-lg font-bold text-blue-400 font-mono">
            {playerAlbums.length} <span className="text-xs font-normal text-[#94A3B8]">LPs</span>
          </p>
        </div>

        <div className="bg-[#16181F] border border-yellow-500/30 p-3.5 rounded-[10px] space-y-1 shadow-2xs">
          <span className="text-[10px] text-yellow-300 uppercase tracking-wider block font-bold font-mono">
            Premios Ganados
          </span>
          <p className="text-base sm:text-lg font-bold text-yellow-400 font-mono">
            {player.awardsWon.length} <span className="text-xs font-normal text-[#94A3B8]">trofeos</span>
          </p>
        </div>

        <div className="bg-[#16181F] border border-emerald-500/30 p-3.5 rounded-[10px] space-y-1 shadow-2xs">
          <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-bold font-mono">
            Giras Realizadas
          </span>
          <p className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
            {playerTours.length} <span className="text-xs font-normal text-[#94A3B8]">tours</span>
          </p>
        </div>
      </div>

      {/* 3. HERO SHOWCASE: MEJOR DISCO & MEJOR GIRA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. MEJOR DISCO */}
        <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
            <div className="flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-[#F8FAFC]">
                Mejor Disco Histórico (Obra Cumbre)
              </h2>
            </div>
            <span className="text-[10px] uppercase font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-[4px] shadow-2xs">
              🌟 Récord de Ventas & Streams
            </span>
          </div>

          {bestAlbum ? (
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[12px] p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Cover Gradient */}
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-[12px] border-2 border-white/20 bg-gradient-to-br ${bestAlbum.coverGradient || ARTISTIC_COVER_GRADIENTS[0]} shrink-0 flex flex-col justify-end p-2.5 text-white shadow-md`}
                >
                  <Disc3 className="w-5 h-5 opacity-90" />
                  <span className="text-[10px] font-extrabold uppercase truncate mt-auto drop-shadow-sm">
                    {bestAlbum.type}
                  </span>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#94A3B8]">
                      Lanzado en {bestAlbum.releaseYear} (Mes {bestAlbum.releaseMonth})
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-[4px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                      Crítica: {bestAlbum.criticalScore}/100
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#F8FAFC] tracking-[-0.5px]">
                    {bestAlbum.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getGenreBadgeClass(bestAlbum.genreId)}`}>
                      {world.genres[bestAlbum.genreId]?.name || bestAlbum.genreId}
                    </span>
                    <span className="text-xs text-[#94A3B8] font-mono">
                      {bestAlbum.songIds.length} canciones
                    </span>
                  </div>

                  {bestAlbum.criticalReviewText && (
                    <p className="text-xs text-[#94A3B8] italic bg-[#16181F] p-2.5 rounded-[6px] border border-[#2A2E3D]">
                      "{bestAlbum.criticalReviewText}"
                    </p>
                  )}
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2A2E3D] text-center font-mono">
                <div className="bg-purple-950/40 p-2 rounded-[6px] border border-purple-500/30">
                  <span className="text-[10px] text-purple-300 uppercase block font-semibold">Streams Totales</span>
                  <span className="text-xs sm:text-sm font-bold text-purple-400">
                    {(bestAlbum.totalStreams / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="bg-indigo-950/40 p-2 rounded-[6px] border border-indigo-500/30">
                  <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Ventas Debut</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-400">
                    {bestAlbum.firstWeekSales.toLocaleString()}
                  </span>
                </div>
                <div className="bg-emerald-950/40 p-2 rounded-[6px] border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Score Comercial</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-400">
                    {bestAlbum.commercialScore}/100
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[12px] p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#16181F] text-[#94A3B8] mx-auto flex items-center justify-center border border-[#2A2E3D]">
                <Disc3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Aún no has publicado un álbum</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Dirígete al Estudio para componer y producir tu primer LP o EP conceptual y consagrar tu sonido.
              </p>
            </div>
          )}
        </div>

        {/* B. MEJOR GIRA */}
        <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-[#F8FAFC]">
                Mejor Gira Histórica (Mayor Recaudación)
              </h2>
            </div>
            <span className="text-[10px] uppercase font-bold bg-orange-950/60 text-orange-300 border border-orange-500/40 px-2.5 py-0.5 rounded-[4px] shadow-2xs">
              🔥 Récord de Asistencia & Taquilla
            </span>
          </div>

          {bestTour ? (
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[12px] p-5 space-y-4 shadow-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#94A3B8]">
                    Año {bestTour.year} (Mes {bestTour.month})
                  </span>
                  <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-[4px] bg-amber-950/60 text-amber-300 border border-amber-500/40">
                    Nivel: {bestTour.tier}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[#F8FAFC] tracking-[-0.5px]">
                  {bestTour.name}
                </h3>

                <p className="text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {bestTour.stops.length} ciudades visitadas: {bestTour.stops.slice(0, 4).map(s => s.city).join(', ')}...
                </p>
              </div>

              {/* Tour Numbers */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2A2E3D] text-center font-mono">
                <div className="bg-emerald-950/40 p-2 rounded-[6px] border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Recaudación Bruta</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-400">
                    ${bestTour.grossRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="bg-blue-950/40 p-2 rounded-[6px] border border-blue-500/30">
                  <span className="text-[10px] text-blue-300 uppercase block font-semibold">Beneficio Neto</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-400">
                    ${bestTour.netArtistProfit.toLocaleString()}
                  </span>
                </div>
                <div className="bg-purple-950/40 p-2 rounded-[6px] border border-purple-500/30">
                  <span className="text-[10px] text-purple-300 uppercase block font-semibold">Asistencia</span>
                  <span className="text-xs sm:text-sm font-bold text-purple-400">
                    {bestTour.totalTicketsSold.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-[#16181F] p-2.5 rounded-[6px] border border-[#2A2E3D] flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Tasa de Ocupación: <strong className="text-emerald-400">{Math.round((bestTour.totalTicketsSold / Math.max(1, bestTour.totalCapacity)) * 100)}%</strong></span>
                <span>Hype Generado: <strong className="text-orange-400">+{bestTour.hypeGenerated}</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[12px] p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#16181F] text-[#94A3B8] mx-auto flex items-center justify-center border border-[#2A2E3D]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Aún no has salido de gira</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Cuando acumules 85% de energía, organizá tu primer tour en la sección de Giras & Shows para llenar clubes, teatros y estadios.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. CHRONOLOGICAL ERAS TIMELINE */}
      <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#F8FAFC] flex items-center gap-2">
              <History className="w-5 h-5 text-teal-400" />
              Evolución de Eras Musicales ({player.eras.length})
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Transiciones estéticas, cambios sonoros y madurez cultural del artista
            </p>
          </div>
          <span className="text-xs font-mono text-[#94A3B8] bg-[#0B0C10] px-2.5 py-1 rounded-[6px] border border-[#2A2E3D]">
            Etapa Actual: <strong className="text-[#8B5CF6]">{player.careerStage}</strong>
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-teal-500/40 space-y-6 my-2">
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
                      ? 'bg-teal-400 border-teal-300 ring-4 ring-teal-500/30'
                      : 'bg-[#16181F] border-teal-500/50'
                  }`}
                />

                <div className="bg-[#0B0C10] p-5 sm:p-6 rounded-[12px] border border-[#2A2E3D] space-y-3 shadow-xs hover:border-teal-500/50 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#2A2E3D] pb-2.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-semibold text-[#F8FAFC]">
                        {era.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold bg-teal-950/60 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-[4px]">
                        {era.stage}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-2 py-0.5 rounded-[4px] shadow-[0_0_10px_rgba(20,184,166,0.3)]">
                          Era Vigente
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono text-[#94A3B8]">
                      {era.startYear} ({TimeSystem.getMonthName(era.startMonth)}) — {era.endYear ? `${era.endYear} (${TimeSystem.getMonthName(era.endMonth || 12)})` : 'Presente'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {era.highlightSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8] pt-1">
                    <div className="flex items-center gap-1.5">
                      <span>Enfoque Sonoro:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${eraGenreTheme.badgeBg} ${eraGenreTheme.badgeText}`}>
                        {world.genres[era.genreFocus]?.name || era.genreFocus}
                      </span>
                    </div>
                    <span>•</span>
                    <span>
                      Lanzamientos en esta Era: <strong className="text-[#8B5CF6] font-semibold">{eraAlbums.length} álbumes, {eraSingles.length} singles{eraSingles.filter(s => s.musicVideo).length > 0 ? ` (${eraSingles.filter(s => s.musicVideo).length} videoclips 🎬)` : ''}</strong>
                    </span>
                  </div>

                  {/* Albums released during this era */}
                  {eraAlbums.length > 0 && (
                    <div className="pt-2 border-t border-[#2A2E3D] flex items-center gap-2 overflow-x-auto">
                      <span className="text-[10px] uppercase text-[#94A3B8] font-semibold shrink-0">
                        Discos Clave:
                      </span>
                      {eraAlbums.map(alb => (
                        <span
                          key={alb.id}
                          className="bg-indigo-950/60 text-indigo-300 text-xs px-2.5 py-1 rounded-[6px] border border-indigo-500/40 whitespace-nowrap font-semibold"
                        >
                          📀 {alb.title} ({alb.criticalScore} pts)
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Era Quick Actions */}
                  {onOpenMilestone && (
                    <div className="pt-2 border-t border-[#2A2E3D] flex items-center justify-between">
                      <span className="text-[11px] text-[#94A3B8]">
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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F8FAFC] hover:text-[#8B5CF6] hover:underline cursor-pointer"
                      >
                        <Newspaper className="w-3.5 h-3.5 text-amber-400" />
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
      <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2E3D] pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-indigo-400" />
              Catálogo Discográfico Completo ({playerAlbums.length} Proyectos)
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Todos los álbumes, EPs y mixtapes lanzados a lo largo de tu carrera
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0B0C10] p-1 rounded-[6px] border border-[#2A2E3D] text-xs shadow-2xs">
            <span className="text-[10px] text-[#94A3B8] uppercase px-2 font-mono">Ordenar:</span>
            <button
              onClick={() => setDiscographySort('streams')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors cursor-pointer ${
                discographySort === 'streams' ? 'bg-[#8B5CF6] text-white font-semibold shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Streams
            </button>
            <button
              onClick={() => setDiscographySort('score')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors cursor-pointer ${
                discographySort === 'score' ? 'bg-[#8B5CF6] text-white font-semibold shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Crítica
            </button>
            <button
              onClick={() => setDiscographySort('date')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors cursor-pointer ${
                discographySort === 'date' ? 'bg-[#8B5CF6] text-white font-semibold shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Fecha
            </button>
          </div>
        </div>

        {sortedAlbums.length === 0 ? (
          <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[12px] p-8 text-center space-y-2">
            <Disc3 className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Sin Discografía Aún</h3>
            <p className="text-xs text-[#94A3B8]">
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
                  className={`bg-[#0B0C10] p-5 rounded-[12px] border transition-all space-y-3 flex flex-col justify-between shadow-xs ${
                    isBest ? 'border-amber-500/60 ring-2 ring-amber-500/30' : 'border-[#2A2E3D] hover:border-indigo-500/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-16 h-16 rounded-[8px] bg-gradient-to-br ${coverGrad} shrink-0 border-2 border-white/20 shadow-sm flex items-end p-1.5 text-white text-[9px] font-bold uppercase`}
                      >
                        {album.type}
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#94A3B8]">
                            {album.releaseYear}
                          </span>
                          {isBest && (
                            <span className="bg-amber-950/60 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]">
                              Mejor Disco ⭐
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-semibold text-[#F8FAFC] truncate">
                          {album.title}
                        </h3>

                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${albumGenre.badgeBg} ${albumGenre.badgeText}`}>
                            {world.genres[album.genreId]?.name || album.genreId}
                          </span>
                          <span className="text-[10px] text-[#94A3B8]">
                            {album.songIds.length} tracks
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs">
                      <div className="bg-purple-950/40 p-1.5 rounded-[4px] border border-purple-500/30">
                        <span className="text-[9px] text-purple-300 uppercase block font-semibold">Streams</span>
                        <span className="font-bold text-purple-400">{(album.totalStreams / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="bg-indigo-950/40 p-1.5 rounded-[4px] border border-indigo-500/30">
                        <span className="text-[9px] text-indigo-300 uppercase block font-semibold">Ventas</span>
                        <span className="font-bold text-indigo-400">{album.firstWeekSales.toLocaleString()}</span>
                      </div>
                      <div className="bg-emerald-950/40 p-1.5 rounded-[4px] border border-emerald-500/30">
                        <span className="text-[9px] text-emerald-300 uppercase block font-semibold">Crítica</span>
                        <span className="font-bold text-emerald-400">{album.criticalScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {album.criticalReviewText && (
                    <p className="text-[11px] text-[#94A3B8] italic line-clamp-2 border-t border-[#2A2E3D] pt-2">
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
      <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2E3D] pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Registro Histórico Cronológico de Carrera ({timelineItems.length} Hitos)
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Diario cronológico detallado de cada lanzamiento, premio, gira y acontecimiento
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
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
                className={`px-3 py-1 rounded-[6px] transition-colors cursor-pointer border whitespace-nowrap ${
                  timelineFilter === f.id
                    ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] font-semibold shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'bg-[#0B0C10] text-[#94A3B8] border-[#2A2E3D] hover:text-[#F8FAFC] hover:bg-[#16181F]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredTimeline.length === 0 ? (
          <div className="text-center py-8 text-[#94A3B8] text-xs">
            No se encontraron eventos para el filtro seleccionado.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTimeline.map((item) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-[#0B0C10] p-4 rounded-[12px] border border-[#2A2E3D] flex items-start justify-between gap-4 hover:border-indigo-500/40 transition-all shadow-2xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-[8px] border shrink-0 mt-0.5 ${item.iconBgClass}`}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#F8FAFC]">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded-[4px] border ${item.badgeClass || 'bg-[#16181F] text-[#F8FAFC] border-[#2A2E3D]'}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        {item.description}
                      </p>

                      {item.metrics && (
                        <p className="text-[11px] font-mono text-purple-400 font-semibold pt-0.5">
                          {item.metrics}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-xs text-[#94A3B8]">
                    <span className="block font-bold text-[#F8FAFC]">{item.year}</span>
                    <span className="text-[10px] text-[#94A3B8]">Mes {item.month}</span>
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
