import React from 'react';
import { Artist, WorldState, Song, Album } from '../types';
import {
  Sparkles,
  Disc3,
  TrendingUp,
  Award,
  Zap,
  Flame,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Radio,
  Music2,
  ArrowUpRight,
  ShieldCheck,
  Heart
} from 'lucide-react';

interface DashboardViewProps {
  player: Artist;
  world: WorldState;
  onNavigate: (tab: string) => void;
  onRest: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  player,
  world,
  onNavigate,
  onRest
}) => {
  const currentEra = player.eras[player.eras.length - 1];
  const playerSongs = (Object.values(world.songs) as Song[]).filter(s => s.artistId === player.id);
  const playerAlbums = (Object.values(world.albums) as Album[]).filter(a => a.artistId === player.id);

  const topSongs = [...playerSongs]
    .sort((a, b) => b.streamsLastMonth - a.streamsLastMonth)
    .slice(0, 4);

  const latestNews = world.news.slice(0, 5);
  const mainGenre = world.genres[player.mainGenreId]?.name || player.mainGenreId;
  const currentLabel = player.labelId ? world.labels[player.labelId] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 p-6 md:p-8 shadow-2xl">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Identifiers */}
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr ${player.avatarColor || 'from-amber-500 to-rose-600'} flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-rose-500/20 border border-white/20`}>
              {player.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  {player.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {player.careerStage}
                </span>
                {currentLabel && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {currentLabel.name}
                  </span>
                )}
              </div>

              <p className="text-sm text-zinc-400 font-medium">
                {player.realName ? `${player.realName} • ` : ''}{player.city}, {player.country} • {mainGenre}
              </p>

              <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
                <span>Inició en {player.careerStartYear}</span>
                <span>•</span>
                <span>{playerSongs.length} Canciones</span>
                <span>•</span>
                <span>{playerAlbums.length} Álbumes</span>
                <span>•</span>
                <span>Legado: <strong className="text-amber-400 font-mono">{player.legacyScore}/100</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Primary Metric Box */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex gap-6 items-center w-full md:w-auto justify-around">
            <div className="text-center">
              <span className="text-xs text-zinc-400 block font-medium">Oyentes Mensuales</span>
              <span className="text-lg md:text-xl font-black text-white tracking-tight font-mono">
                {player.stats.monthlyListeners.toLocaleString()}
              </span>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center">
              <span className="text-xs text-zinc-400 block font-medium">Streams Totales</span>
              <span className="text-lg md:text-xl font-black text-emerald-400 tracking-tight font-mono">
                {(player.stats.totalStreams / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        {/* Current Era Sub-Banner */}
        {currentEra && (
          <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-900/40 p-3.5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 block">
                  Era Actual: {currentEra.name}
                </span>
                <p className="text-xs text-zinc-300">
                  {currentEra.highlightSummary}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('career')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              Ver Cronología Completa <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Popularidad</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{player.stats.popularity}<span className="text-xs text-zinc-500 font-normal">/100</span></p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${player.stats.popularity}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Reputación</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{player.stats.reputation}<span className="text-xs text-zinc-500 font-normal">/100</span></p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${player.stats.reputation}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Credibilidad</span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{player.stats.artisticCredibility}<span className="text-xs text-zinc-500 font-normal">/100</span></p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${player.stats.artisticCredibility}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Fidelidad Fans</span>
            <Heart className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{player.stats.fanbaseLoyalty}<span className="text-xs text-zinc-500 font-normal">/100</span></p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${player.stats.fanbaseLoyalty}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Energía</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{player.stats.energy}<span className="text-xs text-zinc-500 font-normal">/100</span></p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${player.stats.energy}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Hype Escénico</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{player.stats.hype}<span className="text-xs text-zinc-500 font-normal">/100</span></p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: `${player.stats.hype}%` }} />
          </div>
        </div>
      </div>

      {/* Action Command Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Studio Card */}
        <div
          onClick={() => onNavigate('studio')}
          className="group bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-rose-500/50 p-5 rounded-2xl transition-all cursor-pointer shadow-lg hover:shadow-rose-500/10 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 group-hover:scale-110 transition-transform">
              <Disc3 className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-rose-400 transition-colors" />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
              Estudio de Grabación
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Componer singles, contratar beatmakers, grabar colaboraciones y lanzar álbumes completos.
            </p>
          </div>
        </div>

        {/* Tour Card */}
        <div
          onClick={() => onNavigate('tours')}
          className="group bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all cursor-pointer shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Giras & Conciertos
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Organizar presentaciones desde clubes underground hasta estadios masivos y world tours.
            </p>
          </div>
        </div>

        {/* Recharge Card */}
        <div
          onClick={onRest}
          className="group bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
              +40 Energía
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Descansar & Desconectar
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Tomar un respiro, recargar energía creativa y evitar el agotamiento físico o mental.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Songs vs Breaking News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Catalog Top Songs */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Catálogo Activo Destacado
              </h2>
            </div>
            <button
              onClick={() => onNavigate('studio')}
              className="text-xs text-zinc-400 hover:text-white font-medium cursor-pointer"
            >
              Ver Todas ({playerSongs.length})
            </button>
          </div>

          {topSongs.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">
              Aún no lanzaste ninguna canción. ¡Entrá al Estudio para grabar tu primer tema!
            </div>
          ) : (
            <div className="space-y-2">
              {topSongs.map((song, i) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-500 w-4 text-center">
                      #{i + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {song.title}
                        {song.wentViral && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                            Viral
                          </span>
                        )}
                        {song.isClassic && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                            Clásico
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        {world.genres[song.genreId]?.name || song.genreId} • Calidad: {song.quality}%
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-extrabold text-emerald-400 block">
                      {song.streamsLastMonth.toLocaleString()} streams/mes
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Total: {(song.streamsTotal / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Press & Media Feed */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Actualidad & Prensa Musical
              </h2>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-xs text-zinc-400 hover:text-white font-medium cursor-pointer"
            >
              Ver Periódico
            </button>
          </div>

          <div className="space-y-2.5">
            {latestNews.map((news) => (
              <div
                key={news.id}
                className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-zinc-200 line-clamp-1">
                    {news.headline}
                  </span>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap font-mono">
                    {news.year}
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] line-clamp-2">
                  {news.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
