import React from 'react';
import { Song, Genre, WorldState } from '../types';
import {
  Music2,
  Disc3,
  Flame,
  TrendingUp,
  Award,
  ArrowRight,
  Mic2,
  Sparkles,
  ArrowUpRight,
  Video,
  Calendar,
  Sliders
} from 'lucide-react';
import { getGenreTheme } from '../utils/themeColors';
import { formatCompactNumber, formatReleaseDate, formatProducerCredit } from '../utils/formatters';

export interface ActiveCatalogCardProps {
  songs?: Song[];
  topSongs?: Song[];
  playerSongsCount?: number;
  genres?: Record<string, Genre>;
  world?: WorldState;
  onNavigate?: (tab: string) => void;
  maxDisplayCount?: number;
  className?: string;
  onRecordFirstSingle?: () => void;
}

export const ActiveCatalogCard: React.FC<ActiveCatalogCardProps> = ({
  songs,
  topSongs,
  playerSongsCount,
  genres,
  world,
  onNavigate,
  maxDisplayCount = 4,
  className = '',
  onRecordFirstSingle
}) => {
  // Resolve active songs list reactively
  const activeSongsList = React.useMemo(() => {
    if (songs && songs.length > 0) {
      return [...songs].sort(
        (a, b) => (b.streamsLastMonth || 0) - (a.streamsLastMonth || 0) || (b.streamsTotal || 0) - (a.streamsTotal || 0)
      );
    }
    if (topSongs && topSongs.length > 0) {
      return [...topSongs].sort(
        (a, b) => (b.streamsLastMonth || 0) - (a.streamsLastMonth || 0) || (b.streamsTotal || 0) - (a.streamsTotal || 0)
      );
    }
    if (world?.songs) {
      const allWorldSongs = Object.values(world.songs) as Song[];
      const pId = world.playerArtistId || 'player';
      const playerFiltered = allWorldSongs.filter(s => s.artistId === pId || s.isPlayerSong);
      return playerFiltered.sort(
        (a, b) => (b.streamsLastMonth || 0) - (a.streamsLastMonth || 0) || (b.streamsTotal || 0) - (a.streamsTotal || 0)
      );
    }
    return [];
  }, [songs, topSongs, world?.songs, world?.playerArtistId]);

  const displaySongs = activeSongsList.slice(0, maxDisplayCount);
  const totalCount = playerSongsCount !== undefined
    ? playerSongsCount
    : (songs ? songs.length : activeSongsList.length);

  // Resolve genre and producer dictionaries
  const genreDict: Record<string, Genre> = genres || world?.genres || {};
  const producerDict = world?.producers || {};

  const handleAction = () => {
    if (onRecordFirstSingle) {
      onRecordFirstSingle();
    } else if (onNavigate) {
      onNavigate('studio');
    }
  };

  return (
    <div
      className={`studio-panel p-6 space-y-4 text-fg transition-all duration-200 hover:border-[#3F3F46] ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-line pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-canvas border border-line text-white">
            <Music2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-fg tracking-[-0.3px]">
              Catálogo Activo Más Escuchado
            </h2>
          </div>
        </div>

        {totalCount > 0 && (
          <button
            onClick={() => onNavigate?.('catalog')}
            className="text-xs text-fg-muted hover:text-primary-soft hover:underline cursor-pointer flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Ver Catálogo Completo ({totalCount})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Empty State vs. Songs List */}
      {totalCount === 0 ? (
        <div className="bg-[#09090B] border border-[#242429] rounded-[6px] p-8 md:p-12 text-center flex flex-col items-center justify-center relative overflow-hidden">
          {/* Animated Spinning Vinyl Record */}
          <div className="relative mb-6 group">
            {/* Spinning Vinyl Disc */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#111114] border-2 border-[#242429] flex items-center justify-center shadow-lg relative animate-spin-slow transition-transform duration-300 group-hover:scale-105">
              {/* Concentric Vinyl Grooves */}
              <div className="absolute inset-2 rounded-full border border-white/[0.04] pointer-events-none" />
              <div className="absolute inset-3.5 rounded-full border border-white/[0.06] pointer-events-none" />
              <div className="absolute inset-5 rounded-full border border-white/[0.04] pointer-events-none" />

              {/* Center Record Label */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#18181C] border border-[#3F3F46] flex flex-col items-center justify-center text-[#F4F4F6] relative z-10">
                <Disc3 className="w-4 h-4 text-[#FF4F00]" />
                <span className="text-[9px] font-black tracking-tighter uppercase font-mono mt-[-2px] text-[#8E8E99]">
                  33 RPM
                </span>
                <div className="w-2 h-2 rounded-full bg-[#09090B] border border-[#242429] absolute" />
              </div>
            </div>

            {/* Accent Badge */}
            <div
              className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-[4px] bg-[#FF4F00] text-white flex items-center justify-center shadow-md z-20"
            >
              <Mic2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Motivating Header & Subtitle */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#F4F4F6] tracking-[-0.03em]">
            Todavía no hay másters registrados en tu discografía
          </h3>
          <p className="text-xs sm:text-sm text-[#8E8E99] max-w-lg mt-2.5 leading-relaxed font-normal">
            Sin canciones publicadas no cobrás liquidaciones de streaming ni podés cerrar fechas en vivo. Reservá turno en cabina para grabar tu primer corte; el algoritmo recién empieza a medirte cuando el tema sale a la calle.
          </p>

          {/* Direct CTA Button */}
          <button
            id="btn-record-first-single"
            onClick={() => {
              if (onNavigate) {
                onNavigate('studio');
              } else if (onRecordFirstSingle) {
                onRecordFirstSingle();
              }
            }}
            className="mt-6 inline-flex items-center gap-2 bg-[#FF4F00] text-white hover:bg-[#E04500] active:translate-y-[1px] text-xs sm:text-sm font-bold px-6 py-2.5 rounded-[4px] transition-all cursor-pointer shadow-none"
          >
            <Mic2 className="w-4 h-4 text-white" />
            <span>Grabar mi primer single</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {displaySongs.map((song, i) => {
              const genreName = genreDict[song.genreId]?.name || song.genreId;
              const genreTheme = getGenreTheme(song.genreId);
              const isHitTop10 = Boolean(
                (song.peakPosition?.Global && song.peakPosition.Global <= 10) ||
                Object.values(song.peakPosition || {}).some(pos => pos !== null && Number(pos) <= 10)
              );
              const peakGlobal = song.peakPosition?.Global;
              const releaseDateStr = formatReleaseDate(song.releaseMonth, song.releaseYear, 'short');
              const fullDateStr = formatReleaseDate(song.releaseMonth, song.releaseYear, 'full');
              const producerCredit = formatProducerCredit(song.producerId, producerDict, { short: true });
              const producerFullCredit = formatProducerCredit(song.producerId, producerDict, { short: false });

              return (
                <div
                  key={song.id}
                  className="p-4 rounded-[6px] bg-[#111114] border border-[#242429] hover:border-[#3F3F46] transition-all duration-150 flex flex-col justify-between gap-3 group"
                >
                  {/* Top Row: Rank, Title, Genre Badge & Date */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-xs font-mono font-bold text-[#8E8E99] w-6 h-6 rounded-[4px] bg-[#18181C] border border-[#242429] flex items-center justify-center shrink-0">
                        #{i + 1}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <h4
                          className="text-sm font-bold text-[#F4F4F6] tracking-tight truncate flex items-center gap-1.5"
                          title={song.title}
                        >
                          {song.title}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-2xs font-bold px-2 py-0.5 rounded-[4px] border ${genreTheme.badgeBg} ${genreTheme.badgeText} ${genreTheme.badgeBorder}`}
                          >
                            {genreName}
                          </span>
                          <span
                            className="text-2xs text-[#8E8E99] font-mono flex items-center gap-1"
                            title={fullDateStr}
                          >
                            <Calendar className="w-2.5 h-2.5 text-[#FF4F00] shrink-0" />
                            <span>{releaseDateStr}</span>
                          </span>
                          <span className="text-2xs text-[#8E8E99] font-mono">
                            • Calidad <strong className="text-[#00E599] font-semibold">{song.quality}%</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Row: Producer, Music Video, Viral, Hits */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {/* Producer Credit Pill */}
                    <span
                      className="text-2xs font-medium bg-[#18181C] border border-[#242429] text-[#8E8E99] px-2 py-0.5 rounded-[4px] flex items-center gap-1 truncate max-w-[150px]"
                      title={producerFullCredit}
                    >
                      <Sliders className="w-2.5 h-2.5 text-[#FF4F00] shrink-0" />
                      <span className="truncate">{producerCredit}</span>
                    </span>

                    {song.musicVideo && (
                      <span
                        className="text-2xs font-bold bg-[#18181C] text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-[4px] flex items-center gap-1"
                        title={`Videoclip Oficial: ${song.musicVideo.concept || 'Video'} • Dir: ${song.musicVideo.directorTier || 'Estándar'} • ${(song.musicVideo.views || 0).toLocaleString('es-AR')} vistas`}
                      >
                        <Video className="w-2.5 h-2.5 text-cyan-400" />
                       Videoclip Oficial
                      </span>
                    )}

                    {song.wentViral && (
                      <span className="text-2xs font-bold bg-[#FF4F00]/20 text-[#FF4F00] border border-[#FF4F00]/40 px-2 py-0.5 rounded-[4px] flex items-center gap-1 font-mono">
                        <Flame className="w-2.5 h-2.5 fill-current" />
                        Viral
                      </span>
                    )}

                    {isHitTop10 && (
                      <span className="text-2xs font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 px-2 py-0.5 rounded-[4px] flex items-center gap-1 font-mono">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Hit Top 10
                      </span>
                    )}

                    {song.isClassic && (
                      <span className="text-2xs font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 px-2 py-0.5 rounded-[4px] flex items-center gap-1 font-mono">
                        <Award className="w-2.5 h-2.5 fill-current" />
                        Clásico
                      </span>
                    )}

                    {peakGlobal && (
                      <span className="text-2xs font-bold bg-[#18181C] text-indigo-400 border border-indigo-800/50 px-2 py-0.5 rounded-[4px] font-mono">
                        Peak #{peakGlobal}
                      </span>
                    )}
                  </div>

                  {/* Streams Metric Row: Monthly & Cumulative */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#242429] text-xs">
                    <div>
                      <span className="text-[10px] text-[#52525B] uppercase block font-medium tracking-wider">
                        Mensual
                      </span>
                      <span className="text-xs font-bold text-[#00E599] font-mono tabular-nums">
                        {song.streamsLastMonth.toLocaleString()}{' '}
                        <span className="font-normal text-[10px] text-[#8E8E99]">/mes</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#52525B] uppercase block font-medium tracking-wider">
                        Acumulado Total
                      </span>
                      <span className="text-xs font-bold text-[#F4F4F6] font-mono tabular-nums">
                        {formatCompactNumber(song.streamsTotal)}{' '}
                        <span className="font-normal text-[10px] text-[#8E8E99]">tot.</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#09090B] border border-[#242429] rounded-[4px] text-xs text-[#8E8E99]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4F00] shrink-0" />
              <span>
                Catálogo activo con rotación regular en radios y streaming global.
              </span>
            </div>
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('studio');
                } else if (onRecordFirstSingle) {
                  onRecordFirstSingle();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4F00] hover:text-[#FF7733] hover:underline cursor-pointer whitespace-nowrap"
            >
              <span>Grabar Nueva Canción en Estudio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
