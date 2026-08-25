import React, { useState } from 'react';
import { WorldState, MusicRegion, Artist, ChartEntry } from '../types';
import { BarChart3, Trophy, Flame, TrendingUp, TrendingDown, Minus, Sparkles, Disc3 } from 'lucide-react';

interface ChartsViewProps {
  world: WorldState;
  player: Artist;
}

export const ChartsView: React.FC<ChartsViewProps> = ({ world, player }) => {
  const [selectedRegion, setSelectedRegion] = useState<MusicRegion>('Global');

  const currentChart = world.charts?.[selectedRegion] || {
    region: selectedRegion,
    year: world.currentYear,
    month: world.currentMonth,
    entries: []
  };

  const regions: Array<{ id: MusicRegion; label: string }> = [
    { id: 'Global', label: '🌍 Global Top 50' },
    { id: 'Argentina', label: '🇦🇷 Argentina' },
    { id: 'LatinAmerica', label: '🌎 Latinoamérica' },
    { id: 'USA', label: '🇺🇸 Estados Unidos' },
    { id: 'Spain', label: '🇪🇸 España' },
    { id: 'Mexico', label: '🇲🇽 México' },
    { id: 'Europe', label: '🇪🇺 Europa' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Charts Oficiales de Streaming & Ventas
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Rankings oficiales actualizados mensualmente en base al consumo real de streaming y rotación radial.
          </p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-1 overflow-x-auto bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 max-w-full text-xs">
          {regions.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedRegion === r.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart List Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">Pos</span>
            <span>Canción & Artista</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-12">
            <span className="hidden sm:inline">Streams Semanales</span>
            <span>Peak</span>
            <span>Semanas</span>
          </div>
        </div>

        {currentChart.entries.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs">
            Aún no hay suficientes datos de streaming computados para este ranking regional. Avanzá el mes para procesar los charts.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {currentChart.entries.map((entry) => {
              const isPlayerSong = entry.artistId === player.id;
              let movement = <Minus className="w-3.5 h-3.5 text-zinc-500" />;

              if (entry.lastRank === null) {
                movement = <span className="text-[10px] font-black text-purple-400 uppercase">NEW</span>;
              } else if (entry.lastRank > entry.rank) {
                movement = (
                  <span className="flex items-center text-[11px] font-bold text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    +{entry.lastRank - entry.rank}
                  </span>
                );
              } else if (entry.lastRank < entry.rank) {
                movement = (
                  <span className="flex items-center text-[11px] font-bold text-rose-400">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                    -{entry.rank - entry.lastRank}
                  </span>
                );
              }

              return (
                <div
                  key={entry.songId}
                  className={`p-3.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                    isPlayerSong
                      ? 'bg-rose-950/20 hover:bg-rose-950/30 border-l-4 border-l-rose-500'
                      : 'hover:bg-zinc-800/40'
                  }`}
                >
                  {/* Position & Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 flex flex-col items-center justify-center font-mono">
                      <span className={`text-base font-black ${
                        entry.rank === 1 ? 'text-amber-400' : entry.rank === 2 ? 'text-zinc-300' : entry.rank === 3 ? 'text-amber-600' : 'text-zinc-400'
                      }`}>
                        #{entry.rank}
                      </span>
                      <div className="mt-0.5">{movement}</div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm line-clamp-1 flex items-center gap-2">
                        {entry.title}
                        {isPlayerSong && (
                          <span className="text-[9px] bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded shadow">
                            TU TEMA
                          </span>
                        )}
                      </h4>
                      <p className="text-zinc-400 text-xs line-clamp-1">
                        {entry.artistName}
                      </p>
                    </div>
                  </div>

                  {/* Right metrics */}
                  <div className="flex items-center gap-6 sm:gap-12 font-mono text-xs text-right whitespace-nowrap">
                    <span className="hidden sm:inline font-bold text-zinc-300">
                      {entry.streamsThisWeek.toLocaleString()}
                    </span>
                    <span className="font-bold text-indigo-400 w-8 text-center">
                      #{entry.peakRank}
                    </span>
                    <span className="text-zinc-400 w-8 text-center">
                      {entry.weeksOnChart}
                    </span>
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
