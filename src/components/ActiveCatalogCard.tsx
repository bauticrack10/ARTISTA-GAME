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
  Video
} from 'lucide-react';
import { getGenreTheme } from '../utils/themeColors';
import { formatCompactNumber } from '../utils/formatters';

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

  // Resolve genre dictionary
  const genreDict: Record<string, Genre> = genres || world?.genres || {};

  const handleAction = () => {
    if (onRecordFirstSingle) {
      onRecordFirstSingle();
    } else if (onNavigate) {
      onNavigate('studio');
    }
  };

  return (
    <div
      className={`bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-6 space-y-4 shadow-lg text-[#F8FAFC] transition-all duration-200 hover:border-[#8B5CF6]/40 ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-[6px] bg-[#0B0C10] border border-[#2A2E3D] text-white">
            <Music2 className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC] tracking-[-0.3px]">
              Catálogo Activo Más Escuchado
            </h2>
          </div>
        </div>

        {totalCount > 0 && (
          <button
            onClick={() => onNavigate?.('catalog')}
            className="text-xs text-[#94A3B8] hover:text-[#C084FC] hover:underline cursor-pointer flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Ver Catálogo Completo ({totalCount})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Empty State vs. Songs List */}
      {totalCount === 0 ? (
        <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-[14px] p-8 md:p-12 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-md">
          {/* Ambient Glows */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Spinning Vinyl Record */}
          <div className="relative mb-6 group">
            {/* Spinning Vinyl Disc */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#111110] border-4 border-[#2A2E3D] flex items-center justify-center shadow-xl relative animate-spin-slow transition-transform duration-300 group-hover:scale-105">
              {/* Concentric Vinyl Grooves */}
              <div className="absolute inset-2 rounded-full border border-stone-800/80 pointer-events-none" />
              <div className="absolute inset-3.5 rounded-full border border-stone-700/60 pointer-events-none" />
              <div className="absolute inset-5 rounded-full border border-stone-800/70 pointer-events-none" />

              {/* Center Record Label */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] border-2 border-stone-900 flex flex-col items-center justify-center text-white shadow-inner relative z-10">
                <Disc3 className="w-4 h-4 text-white/90" />
                <span className="text-[6px] font-black tracking-tighter uppercase font-mono mt-[-2px]">
                  33 RPM
                </span>
                <div className="w-2 h-2 rounded-full bg-[#111110] border border-stone-950 absolute" />
              </div>
            </div>

            {/* Glowing Accent Badge */}
            <div
              className="absolute -top-1.5 -right-1.5 w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-md z-20"
            >
              <Mic2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Motivating Header & Subtitle */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-[-0.8px]">
            Tu catálogo está esperando tu primer hit underground
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mt-2.5 leading-relaxed font-normal">
            Aún no has lanzado canciones. Entrá al estudio de grabación, definí tu dirección sonora y publicá tu primer single para comenzar a acumular oyentes, reproducciones y regalías en los rankings globales.
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
            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white hover:opacity-90 active:scale-98 text-xs sm:text-sm font-bold px-6 py-3 rounded-[8px] transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.4)]"
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

              return (
                <div
                  key={song.id}
                  className="p-4 rounded-[12px] bg-[#0B0C10] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 transition-all duration-200 flex flex-col justify-between gap-3 shadow-xs group"
                >
                  {/* Top Row: Rank, Title, Genre Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-xs font-bold text-[#94A3B8] w-6 h-6 rounded-[6px] bg-[#16181F] border border-[#2A2E3D] flex items-center justify-center shrink-0">
                        #{i + 1}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <h4
                          className="text-sm font-bold text-[#F8FAFC] tracking-tight truncate flex items-center gap-1.5"
                          title={song.title}
                        >
                          {song.title}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] border ${genreTheme.badgeBg} ${genreTheme.badgeText} ${genreTheme.badgeBorder}`}
                          >
                            {genreName}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] font-mono">
                            {song.releaseYear} • Calidad <strong className="text-emerald-400 font-semibold">{song.quality}%</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Row */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {song.musicVideo && (
                      <span
                        className="text-[10px] font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-500/50 px-2 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs"
                        title={`Videoclip Oficial: ${song.musicVideo.concept} • Dir: ${song.musicVideo.directorTier} • ${song.musicVideo.views.toLocaleString()} vistas`}
                      >
                        <Video className="w-2.5 h-2.5 text-cyan-400" />
                        🎬 Videoclip Oficial
                      </span>
                    )}

                    {song.wentViral && (
                      <span className="text-[10px] font-bold bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-2 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs">
                        <Flame className="w-2.5 h-2.5 fill-current" />
                        Viral
                      </span>
                    )}

                    {isHitTop10 && (
                      <span className="text-[10px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Hit Top 10
                      </span>
                    )}

                    {song.isClassic && (
                      <span className="text-[10px] font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 px-2 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs">
                        <Award className="w-2.5 h-2.5 fill-current" />
                        Clásico
                      </span>
                    )}

                    {peakGlobal && (
                      <span className="text-[10px] font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-[4px] shadow-xs">
                        Peak #{peakGlobal}
                      </span>
                    )}
                  </div>

                  {/* Streams Metric Row: Monthly & Cumulative */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#2A2E3D] text-xs">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] uppercase block font-medium">
                        Mensual
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {song.streamsLastMonth.toLocaleString()}{' '}
                        <span className="font-normal text-[10px] text-[#94A3B8]">/mes</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#94A3B8] uppercase block font-medium">
                        Acumulado Total
                      </span>
                      <span className="text-xs font-bold text-[#C084FC] font-mono">
                        {formatCompactNumber(song.streamsTotal)}{' '}
                        <span className="font-normal text-[10px] text-[#94A3B8]">tot.</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#0B0C10] border border-[#2A2E3D] rounded-[10px] text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06B6D4] hover:text-[#38BDF8] hover:underline cursor-pointer whitespace-nowrap"
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
