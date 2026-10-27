import React from 'react';
import { Song, Genre, WorldState } from '../types';
import { useSpotlight } from '../hooks/useSpotlight';
import {
  Music2,
  Disc3,
  Flame,
  TrendingUp,
  ArrowRight,
  Mic2,
  ArrowUpRight,
  Video
} from 'lucide-react';
import { getGenreTheme } from '../utils/themeColors';
import { formatCompactNumber, formatReleaseDate } from '../utils/formatters';

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

  const genreDict: Record<string, Genre> = genres || world?.genres || {};
  const { onMouseMove: handleSpotlightMove, onMouseLeave: handleSpotlightLeave } = useSpotlight<HTMLDivElement>();

  return (
    <div
      onMouseMove={handleSpotlightMove}
      onMouseLeave={handleSpotlightLeave}
      className={`liquid-glass-card spotlight-border animate-stagger-in stagger-3 p-5 sm:p-6 relative space-y-4 text-[#F4F4F6] ${className}`}
    >
      <div className="flex items-center justify-between pb-1 relative z-10">
        <div className="flex items-center gap-2">
          <Music2 className="w-4 h-4 text-[#FF4F00]" />
          <h2 className="text-sm font-bold text-[#F4F4F6]">
            Temas Más Escuchados
          </h2>
        </div>

        {totalCount > 0 && (
          <button
            onClick={() => onNavigate?.('catalog')}
            className="liquid-glass-pill px-2.5 py-1 text-xs text-[#8E8E99] hover:text-[#FF4F00] cursor-pointer flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Ver Catálogo Completo ({totalCount})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="liquid-glass-subcard p-6 text-center flex flex-col items-center justify-center space-y-3 relative z-10">
          <div className="w-12 h-12 rounded-full liquid-glass-pill flex items-center justify-center">
            <Disc3 className="w-5 h-5 text-[#FF4F00]" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-[#F4F4F6]">
              Todavía no publicaste canciones
            </h3>
            <p className="text-xs text-[#8E8E99] leading-relaxed">
              Grabá tu primer single en el estudio para empezar a sumar oyentes, regalías de streaming y habilitar conciertos.
            </p>
          </div>
          <button
            id="btn-record-first-single"
            onClick={() => {
              if (onNavigate) {
                onNavigate('studio');
              } else if (onRecordFirstSingle) {
                onRecordFirstSingle();
              }
            }}
            className="inline-flex items-center gap-2 bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold px-4 py-2 rounded-[6px] shadow-md transition-all cursor-pointer"
          >
            <Mic2 className="w-3.5 h-3.5 text-white" />
            <span>Grabar mi primer single</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 exclusion-group">
          {displaySongs.map((song, i) => {
            const genreName = genreDict[song.genreId]?.name || song.genreId;
            const genreTheme = getGenreTheme(song.genreId);
            const peakGlobal = song.peakPosition?.Global;
            const releaseDateStr = formatReleaseDate(song.releaseMonth, song.releaseYear, 'short');

            return (
              <div
                key={song.id}
                className="liquid-glass-subcard p-3.5 flex flex-col justify-between gap-2.5 group hover:border-white/28 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="liquid-glass-pill w-6 h-6 rounded-[6px] text-xs font-sans font-bold text-[#F4F4F6] flex items-center justify-center shrink-0 tabular-nums">
                      #{i + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#F4F4F6] truncate" title={song.title}>
                        {song.title}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-[4px] border ${genreTheme.badgeBg} ${genreTheme.badgeText} ${genreTheme.badgeBorder}`}>
                          {genreName}
                        </span>
                        <span className="text-xs text-[#8E8E99] font-sans">
                          {releaseDateStr} • Calidad <strong className="text-[#00E599]">{song.quality}%</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {song.musicVideo && (
                      <span className="text-[10px] font-bold bg-[#18181C] text-cyan-400 border border-cyan-800/60 px-1.5 py-0.5 rounded-[4px] flex items-center gap-1">
                        <Video className="w-2.5 h-2.5" />
                        MV
                      </span>
                    )}
                    {song.wentViral && (
                      <span className="text-[10px] font-bold bg-[#FF4F00]/20 text-[#FF4F00] border border-[#FF4F00]/40 px-1.5 py-0.5 rounded-[4px] flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 fill-current" />
                        Viral
                      </span>
                    )}
                    {peakGlobal && (
                      <span className="text-[10px] font-bold bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/30 px-1.5 py-0.5 rounded-[4px] font-sans tabular-nums">
                        #{peakGlobal}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 text-xs font-sans tabular-nums">
                  <span className="text-[#8E8E99]">
                    Mes: <strong className="text-[#00E599]">{song.streamsLastMonth.toLocaleString('es-AR')}</strong>
                  </span>
                  <span className="text-[#8E8E99]">
                    Total: <strong className="text-[#F4F4F6]">{formatCompactNumber(song.streamsTotal)}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveCatalogCard;
