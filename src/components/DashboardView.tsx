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
  Radio,
  Music2,
  ArrowUpRight,
  ShieldCheck,
  Heart,
  Calendar,
  AlertCircle,
  Coffee,
  ShoppingBag
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
  const isTourReady = player.stats.energy >= 85;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-[16px] bg-[#f7f4ed] border border-[#eceae4] p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Identifiers */}
          <div className="flex items-center gap-5">
            <div
              className={`w-20 h-20 md:w-22 md:h-22 rounded-[12px] bg-gradient-to-tr ${player.avatarColor || 'from-amber-500 to-rose-600'} flex items-center justify-center text-[#fcfbf8] font-semibold text-3xl border border-[#eceae4]`}
              style={{
                boxShadow:
                  'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
              }}
            >
              {player.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.9px] text-[#1c1c1c]">
                  {player.name}
                </h1>
                {player.isProdigy && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1c1c1c] text-[#fcfbf8] flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Promesa / Prodigio x3
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eceae4] text-[#1c1c1c] border border-[#eceae4]">
                  {player.careerStage}
                </span>
                {currentLabel && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-normal bg-[#f7f4ed] text-[#5f5f5d] border border-[#eceae4]">
                    {currentLabel.name}
                  </span>
                )}
              </div>

              <p className="text-sm text-[#5f5f5d] font-normal">
                {player.realName ? `${player.realName} • ` : ''}{player.city}, {player.country} • {mainGenre}
              </p>

              <div className="flex items-center gap-3 text-xs text-[#5f5f5d] pt-1 flex-wrap">
                <span>Inició en {player.careerStartYear}</span>
                <span>•</span>
                <span>{playerSongs.length} Canciones</span>
                <span>•</span>
                <span>{playerAlbums.length} Álbumes</span>
                <span>•</span>
                <span>Legado: <strong className="text-[#1c1c1c] font-semibold">{player.legacyScore}/100</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Primary Metric Box */}
          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-4 flex gap-6 items-center w-full md:w-auto justify-around">
            <div className="text-center">
              <span className="text-xs text-[#5f5f5d] block font-normal">Oyentes Mensuales</span>
              <span className="text-lg md:text-xl font-semibold text-[#1c1c1c] tracking-tight">
                {player.stats.monthlyListeners.toLocaleString()}
              </span>
            </div>
            <div className="h-8 w-px bg-[#eceae4]" />
            <div className="text-center">
              <span className="text-xs text-[#5f5f5d] block font-normal">Streams Totales</span>
              <span className="text-lg md:text-xl font-semibold text-[#1c1c1c] tracking-tight">
                {(player.stats.totalStreams / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        {/* Current Era Sub-Banner */}
        {currentEra && (
          <div className="mt-6 pt-5 border-t border-[#eceae4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#f7f4ed] p-3.5 rounded-[12px] border border-[#eceae4]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[6px] bg-[#eceae4] text-[#1c1c1c]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c] block">
                  Era Actual: {currentEra.name}
                </span>
                <p className="text-xs text-[#5f5f5d]">
                  {currentEra.highlightSummary}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('career')}
              className="text-xs text-[#1c1c1c] hover:underline flex items-center gap-1 font-normal transition-colors whitespace-nowrap cursor-pointer"
            >
              Ver Cronología Completa <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[#5f5f5d] text-xs font-normal">
            <span>Popularidad</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#1c1c1c]" />
          </div>
          <p className="text-xl font-semibold text-[#1c1c1c]">{player.stats.popularity}<span className="text-xs text-[#5f5f5d] font-normal">/100</span></p>
          <div className="w-full bg-[#eceae4] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1c1c1c] h-full rounded-full" style={{ width: `${player.stats.popularity}%` }} />
          </div>
        </div>

        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[#5f5f5d] text-xs font-normal">
            <span>Reputación</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#1c1c1c]" />
          </div>
          <p className="text-xl font-semibold text-[#1c1c1c]">{player.stats.reputation}<span className="text-xs text-[#5f5f5d] font-normal">/100</span></p>
          <div className="w-full bg-[#eceae4] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1c1c1c] h-full rounded-full" style={{ width: `${player.stats.reputation}%` }} />
          </div>
        </div>

        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[#5f5f5d] text-xs font-normal">
            <span>Credibilidad</span>
            <Award className="w-3.5 h-3.5 text-[#1c1c1c]" />
          </div>
          <p className="text-xl font-semibold text-[#1c1c1c]">{player.stats.artisticCredibility}<span className="text-xs text-[#5f5f5d] font-normal">/100</span></p>
          <div className="w-full bg-[#eceae4] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1c1c1c] h-full rounded-full" style={{ width: `${player.stats.artisticCredibility}%` }} />
          </div>
        </div>

        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[#5f5f5d] text-xs font-normal">
            <span>Fidelidad Fans</span>
            <Heart className="w-3.5 h-3.5 text-[#1c1c1c]" />
          </div>
          <p className="text-xl font-semibold text-[#1c1c1c]">{player.stats.fanbaseLoyalty}<span className="text-xs text-[#5f5f5d] font-normal">/100</span></p>
          <div className="w-full bg-[#eceae4] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1c1c1c] h-full rounded-full" style={{ width: `${player.stats.fanbaseLoyalty}%` }} />
          </div>
        </div>

        {/* Energy Card with Tour Requirement Note */}
        <div className={`rounded-[12px] p-3.5 space-y-1 border transition-colors ${
          isTourReady
            ? 'bg-[#f7f4ed] border-[#eceae4]'
            : 'bg-rose-50/70 border-rose-200'
        }`}>
          <div className="flex items-center justify-between text-[#5f5f5d] text-xs font-normal">
            <span>Energía</span>
            <Zap className={`w-3.5 h-3.5 ${isTourReady ? 'text-[#1c1c1c]' : 'text-rose-600'}`} />
          </div>
          <div className="flex items-baseline justify-between">
            <p className={`text-xl font-semibold ${isTourReady ? 'text-[#1c1c1c]' : 'text-rose-700'}`}>
              {player.stats.energy}<span className="text-xs text-[#5f5f5d] font-normal">/100</span>
            </p>
            <span className={`text-[10px] font-semibold ${isTourReady ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isTourReady ? 'Giras: OK (≥85%)' : 'Giras: Bloq. (<85%)'}
            </span>
          </div>
          <div className="w-full bg-[#eceae4] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isTourReady ? 'bg-[#1c1c1c]' : 'bg-rose-600'}`}
              style={{ width: `${player.stats.energy}%` }}
            />
          </div>
        </div>

        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[#5f5f5d] text-xs font-normal">
            <span>Hype Escénico</span>
            <Flame className="w-3.5 h-3.5 text-[#1c1c1c]" />
          </div>
          <p className="text-xl font-semibold text-[#1c1c1c]">{player.stats.hype}<span className="text-xs text-[#5f5f5d] font-normal">/100</span></p>
          <div className="w-full bg-[#eceae4] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1c1c1c] h-full rounded-full" style={{ width: `${player.stats.hype}%` }} />
          </div>
        </div>
      </div>

      {/* Action Command Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Studio Card */}
        <div
          onClick={() => onNavigate('studio')}
          className="group bg-[#f7f4ed] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] p-5 rounded-[12px] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#eceae4] text-[#1c1c1c] rounded-[6px]">
              <Disc3 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#5f5f5d] group-hover:text-[#1c1c1c] transition-colors" />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-semibold text-[#1c1c1c]">
              Estudio de Grabación
            </h3>
            <p className="text-xs text-[#5f5f5d] mt-1 font-normal">
              Componer singles, contratar beatmakers, grabar colaboraciones y lanzar álbumes completos.
            </p>
          </div>
        </div>

        {/* Lifestyle Shop Card */}
        <div
          onClick={() => onNavigate('lifestyle')}
          className="group bg-[#f7f4ed] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] p-5 rounded-[12px] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#eceae4] text-[#1c1c1c] rounded-[6px]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#5f5f5d] group-hover:text-[#1c1c1c] transition-colors" />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-semibold text-[#1c1c1c]">
              Tienda & Estilo de Vida
            </h3>
            <p className="text-xs text-[#5f5f5d] mt-1 font-normal">
              Comprar micrófonos Neumann, consolas SSL, mansiones, autos de gira y coaching vocal.
            </p>
          </div>
        </div>

        {/* Tour Card */}
        <div
          onClick={() => onNavigate('tours')}
          className={`group bg-[#f7f4ed] border p-5 rounded-[12px] transition-all cursor-pointer flex flex-col justify-between ${
            isTourReady
              ? 'border-[#eceae4] hover:border-[rgba(28,28,28,0.4)]'
              : 'border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#eceae4] text-[#1c1c1c] rounded-[6px]">
              <Sparkles className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${
                isTourReady
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {isTourReady ? 'Habilitado (≥85%)' : 'Bloqueado (<85%)'}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-semibold text-[#1c1c1c]">
              Giras & Conciertos
            </h3>
            <p className="text-xs text-[#5f5f5d] mt-1 font-normal">
              {isTourReady
                ? 'Organizar fechas en vivo, vender tickets y generar grandes ganancias millonarias.'
                : 'Se requiere un mínimo de 85% de Energía para iniciar giras. ¡Tomá un descanso antes!'}
            </p>
          </div>
        </div>

        {/* Dedicated Vacation Card (Consumes 6M, +50 Energy) */}
        <div
          className="group bg-[#f7f4ed] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] p-5 rounded-[12px] transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#eceae4] text-[#1c1c1c] rounded-[6px]">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c] bg-[#eceae4] px-2 py-0.5 rounded-[4px] border border-[#eceae4]">
              +50 Energía • 6 Meses
            </span>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <h3 className="text-base font-semibold text-[#1c1c1c]">
                Descanso / Vacaciones
              </h3>
              <p className="text-xs text-[#5f5f5d] mt-1 font-normal">
                Consume 6 meses del ciclo para desconectar de la industria, recargar +50 de energía y percibir regalías.
              </p>
            </div>

            <button
              id="btn-take-vacation"
              onClick={onRest}
              className="w-full flex items-center justify-center gap-2 bg-[#1c1c1c] hover:opacity-90 active:opacity-80 text-[#fcfbf8] font-semibold text-xs py-2 px-3 rounded-[6px] transition-all cursor-pointer"
              style={{
                boxShadow:
                  'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
              }}
              title="Tomar 6 meses de vacaciones y recuperar +50% de energía"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>Tomar Vacaciones (+50 Energía)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Songs vs Breaking News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Catalog Top Songs */}
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-[#1c1c1c]" />
              <h2 className="text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider">
                Catálogo Activo Destacado
              </h2>
            </div>
            <button
              onClick={() => onNavigate('studio')}
              className="text-xs text-[#5f5f5d] hover:text-[#1c1c1c] font-normal cursor-pointer hover:underline"
            >
              Ver Todas ({playerSongs.length})
            </button>
          </div>

          {topSongs.length === 0 ? (
            <div className="text-center py-8 text-[#5f5f5d] text-xs border border-dashed border-[#eceae4] rounded-[8px]">
              Aún no lanzaste ninguna canción. ¡Entrá al Estudio para grabar tu primer tema!
            </div>
          ) : (
            <div className="space-y-2">
              {topSongs.map((song, i) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-3 rounded-[8px] bg-[#f7f4ed] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#5f5f5d] w-4 text-center">
                      #{i + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-[#1c1c1c] flex items-center gap-1.5">
                        {song.title}
                        {song.wentViral && (
                          <span className="text-[9px] bg-[#eceae4] text-[#1c1c1c] px-1.5 py-0.5 rounded-[4px] font-semibold">
                            Viral
                          </span>
                        )}
                        {song.isClassic && (
                          <span className="text-[9px] bg-[#eceae4] text-[#1c1c1c] px-1.5 py-0.5 rounded-[4px] font-semibold">
                            Clásico
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-[#5f5f5d]">
                        {world.genres[song.genreId]?.name || song.genreId} • Calidad: {song.quality}%
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#1c1c1c] block">
                      {song.streamsLastMonth.toLocaleString()} streams/mes
                    </span>
                    <span className="text-[10px] text-[#5f5f5d]">
                      Total: {(song.streamsTotal / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Press & Media Feed */}
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#1c1c1c]" />
              <h2 className="text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider">
                Actualidad & Prensa Musical
              </h2>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-xs text-[#5f5f5d] hover:text-[#1c1c1c] font-normal cursor-pointer hover:underline"
            >
              Ver Periódico
            </button>
          </div>

          <div className="space-y-2.5">
            {latestNews.map((news) => (
              <div
                key={news.id}
                className="p-3 rounded-[8px] bg-[#f7f4ed] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#1c1c1c] line-clamp-1">
                    {news.headline}
                  </span>
                  <span className="text-[10px] text-[#5f5f5d] whitespace-nowrap">
                    {news.year}
                  </span>
                </div>
                <p className="text-[#5f5f5d] text-[11px] line-clamp-2">
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
