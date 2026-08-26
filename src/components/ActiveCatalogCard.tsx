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
  ArrowUpRight
} from 'lucide-react';
import { getGenreTheme } from '../utils/themeColors';

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
  // Resolve active songs list
  const activeSongsList = songs
    ? [...songs].sort(
        (a, b) => b.streamsLastMonth - a.streamsLastMonth || b.streamsTotal - a.streamsTotal
      )
    : topSongs
    ? [...topSongs].sort(
        (a, b) => b.streamsLastMonth - a.streamsLastMonth || b.streamsTotal - a.streamsTotal
      )
    : [];

  const displaySongs = activeSongsList.slice(0, maxDisplayCount);
  const totalCount = playerSongsCount !== undefined ? playerSongsCount : (songs ? songs.length : activeSongsList.length);

  // Resolve genre dictionary
  const genreDict: Record<string, Genre> = genres || world?.genres || {};

  const handleAction = () => {
    if (onRecordFirstSingle) {
      onRecordFirstSingle();
    } else if (onNavigate) {
      onNavigate('studio');
    }
  };

  const formatTotalStreams = (streams: number): string => {
    if (streams >= 1_000_000_000) {
      return `${(streams / 1_000_000_000).toFixed(2)}B`;
    }
    if (streams >= 1_000_000) {
      return `${(streams / 1_000_000).toFixed(2)}M`;
    }
    if (streams >= 1_000) {
      return `${(streams / 1_000).toFixed(1)}k`;
    }
    return streams.toLocaleString();
  };

  return (
    <div
      className={`bg-[#f7f4ed] border border-[#eceae4] rounded-[16px] p-6 space-y-4 shadow-sm text-[#1c1c1c] transition-all duration-200 hover:border-[rgba(28,28,28,0.25)] ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-[#eceae4] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-[6px] bg-[#eceae4] text-[#1c1c1c]">
            <Music2 className="w-4 h-4 text-[#1c1c1c]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#1c1c1c] tracking-[-0.3px]">
              Catálogo Activo Más Escuchado
            </h2>
          </div>
        </div>

        {totalCount > 0 && (
          <button
            onClick={handleAction}
            className="text-xs text-[#5f5f5d] hover:text-[#1c1c1c] hover:underline cursor-pointer flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Ver Catálogo Completo ({totalCount})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Empty State vs. Songs List */}
      {totalCount === 0 ? (
        <div className="bg-[#fcfbf8] border border-[#eceae4] rounded-[14px] p-8 md:p-12 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
          {/* Subtle Warm Atmospheric Glow */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Spinning Vinyl Record */}
          <div className="relative mb-6 group">
            {/* Spinning Vinyl Disc */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#111110] border-4 border-[#222220] flex items-center justify-center shadow-xl relative animate-spin-slow transition-transform duration-300 group-hover:scale-105">
              {/* Concentric Vinyl Grooves */}
              <div className="absolute inset-2 rounded-full border border-stone-800/80 pointer-events-none" />
              <div className="absolute inset-3.5 rounded-full border border-stone-700/60 pointer-events-none" />
              <div className="absolute inset-5 rounded-full border border-stone-800/70 pointer-events-none" />
              <div className="absolute inset-6.5 rounded-full border border-stone-700/50 pointer-events-none" />

              {/* Shimmering Vinyl Sheen Reflection */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

              {/* Center Record Label */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-purple-500 border-2 border-stone-900 flex flex-col items-center justify-center text-stone-950 shadow-inner relative z-10">
                <Disc3 className="w-4 h-4 text-stone-950/80" />
                <span className="text-[6px] font-black tracking-tighter uppercase font-mono mt-[-2px]">
                  33 RPM
                </span>
                {/* Spindle Hole */}
                <div className="w-2 h-2 rounded-full bg-[#111110] border border-stone-950 absolute" />
              </div>
            </div>

            {/* Glowing Accent Badge */}
            <div
              className="absolute -top-1.5 -right-1.5 w-8 h-8 rounded-full bg-[#1c1c1c] text-[#fcfbf8] flex items-center justify-center shadow-md z-20"
              style={{
                boxShadow:
                  'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
              }}
            >
              <Mic2 className="w-4 h-4 text-amber-300" />
            </div>

            {/* Outer Subtle Diffused Glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-amber-300/30 via-rose-300/20 to-purple-300/30 rounded-full blur-lg -z-0 opacity-70" />
          </div>

          {/* Motivating Header & Subtitle */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#1c1c1c] tracking-[-0.8px]">
            Tu catálogo está esperando tu primer hit underground
          </h3>
          <p className="text-xs sm:text-sm text-[#5f5f5d] max-w-lg mt-2.5 leading-relaxed font-normal">
            Aún no has lanzado canciones. Entrá al estudio de grabación, definí tu dirección sonora y publicá tu primer single para comenzar a acumular oyentes, reproducciones y regalías en los rankings globales.
          </p>

          {/* Direct CTA Button */}
          <button
            id="btn-record-first-single"
            onClick={handleAction}
            className="mt-6 inline-flex items-center gap-2 bg-[#1c1c1c] text-[#fcfbf8] hover:opacity-90 active:scale-98 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-[6px] transition-all cursor-pointer shadow-sm"
            style={{
              boxShadow:
                'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
            }}
          >
            <Mic2 className="w-4 h-4 text-amber-300" />
            <span>Grabar mi primer single</span>
            <ArrowRight className="w-4 h-4 text-[#fcfbf8]/80" />
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
                Object.values(song.peakPosition || {}).some(pos => pos !== null && pos <= 10)
              );
              const peakGlobal = song.peakPosition?.Global;

              return (
                <div
                  key={song.id}
                  className="p-4 rounded-[12px] bg-[#fcfbf8] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] transition-all duration-200 flex flex-col justify-between gap-3 shadow-xs group"
                >
                  {/* Top Row: Rank, Title, Genre Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-xs font-bold text-[#5f5f5d] w-6 h-6 rounded-[6px] bg-[#eceae4] flex items-center justify-center shrink-0">
                        #{i + 1}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <h4
                          className="text-sm font-bold text-[#1c1c1c] tracking-tight truncate flex items-center gap-1.5"
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
                          <span className="text-[10px] text-[#5f5f5d] font-mono">
                            {song.releaseYear} • Calidad <strong className="text-[#1c1c1c] font-semibold">{song.quality}%</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Row: Viral, Hit Top 10, Clásico, Peak, Certificaciones */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {/* Certificación por Streams */}
                    {song.streamsTotal >= 10_000_000 ? (
                      <span className="text-[10px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-2 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs border border-cyan-300">
                        💎 Diamante
                      </span>
                    ) : song.streamsTotal >= 2_000_000 ? (
                      <span className="text-[10px] font-bold bg-gradient-to-r from-slate-200 via-stone-100 to-slate-300 text-slate-900 px-2 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs border border-slate-300">
                        💿 Platino
                      </span>
                    ) : song.streamsTotal >= 500_000 ? (
                      <span className="text-[10px] font-bold bg-gradient-to-r from-amber-300 to-yellow-500 text-amber-950 px-2 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs border border-amber-400">
                        📀 Disco de Oro
                      </span>
                    ) : null}

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
                      <span className="text-[10px] font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 px-2 py-0.5 rounded-[4px] border border-amber-300 flex items-center gap-1 shadow-xs">
                        <Award className="w-2.5 h-2.5" />
                        Clásico
                      </span>
                    )}

                    {peakGlobal && (
                      <span className="text-[10px] font-semibold bg-[#eceae4] text-[#1c1c1c] px-2 py-0.5 rounded-[4px] font-mono">
                        Peak #{peakGlobal} Global
                      </span>
                    )}
                  </div>

                  {/* Streams Metric Row: Monthly & Cumulative */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#eceae4]/70 text-xs">
                    <div>
                      <span className="text-[10px] text-[#5f5f5d] uppercase block font-medium">
                        Mensual
                      </span>
                      <span className="text-xs font-bold text-[#1c1c1c]">
                        {song.streamsLastMonth.toLocaleString()}{' '}
                        <span className="font-normal text-[10px] text-[#5f5f5d]">/mes</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#5f5f5d] uppercase block font-medium">
                        Acumulado Total
                      </span>
                      <span className="text-xs font-bold text-indigo-950 font-mono">
                        {formatTotalStreams(song.streamsTotal)}{' '}
                        <span className="font-normal text-[10px] text-[#5f5f5d]">tot.</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#fcfbf8] border border-[#eceae4] rounded-[10px] text-xs text-[#5f5f5d]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                Catálogo activo con rotación regular en radios y streaming global.
              </span>
            </div>
            <button
              onClick={handleAction}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1c1c1c] hover:underline cursor-pointer whitespace-nowrap"
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
