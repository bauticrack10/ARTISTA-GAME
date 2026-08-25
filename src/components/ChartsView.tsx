import React, { useState } from 'react';
import { WorldState, MusicRegion, Artist, ChartEntry } from '../types';
import { BarChart3, Trophy, Flame, TrendingUp, TrendingDown, Minus, Sparkles, Disc3, Crown } from 'lucide-react';
import { RELEASE_BADGES } from '../utils/themeColors';

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
    <div className="space-y-6 pb-12 text-[#1c1c1c]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#f7f4ed] p-6 rounded-[16px] border border-[#eceae4] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-[4px]">
              Rankings Oficiales
            </span>
            <span className="text-xs text-[#5f5f5d]">
              Año {world.currentYear} • Mes {world.currentMonth}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1c1c1c] tracking-[-0.9px] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Charts Oficiales de Streaming & Ventas
          </h1>
          <p className="text-xs text-[#5f5f5d] mt-1">
            Rankings oficiales actualizados mensualmente en base al consumo real de streaming y rotación radial.
          </p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-1 overflow-x-auto bg-[#fcfbf8] p-1.5 rounded-[8px] border border-[#eceae4] max-w-full text-xs shadow-xs">
          {regions.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`px-3 py-1.5 rounded-[6px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedRegion === r.id
                  ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-sm'
                  : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#eceae4]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart List Table */}
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[14px] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#eceae4] flex items-center justify-between text-xs text-[#5f5f5d] font-bold uppercase tracking-wider bg-[#fcfbf8]">
          <div className="flex items-center gap-4">
            <span className="w-10 text-center">Posición</span>
            <span>Canción & Artista</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-12">
            <span className="hidden sm:inline">Streams Semanales</span>
            <span>Peak</span>
            <span>Semanas</span>
          </div>
        </div>

        {currentChart.entries.length === 0 ? (
          <div className="p-12 text-center text-[#5f5f5d] text-xs">
            Aún no hay suficientes datos de streaming computados para este ranking regional. Avanzá el mes para procesar los charts.
          </div>
        ) : (
          <div className="divide-y divide-[#eceae4]">
            {currentChart.entries.map((entry) => {
              const isPlayerSong = entry.artistId === player.id;
              let movement = <Minus className="w-3.5 h-3.5 text-[#5f5f5d]" />;

              if (entry.lastRank === null) {
                movement = (
                  <span className="text-[10px] font-bold text-purple-800 uppercase bg-purple-100 border border-purple-200 px-1.5 py-0.2 rounded-[4px]">
                    NEW
                  </span>
                );
              } else if (entry.lastRank > entry.rank) {
                movement = (
                  <span className="flex items-center text-[11px] font-bold text-emerald-700">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
                    +{entry.lastRank - entry.rank}
                  </span>
                );
              } else if (entry.lastRank < entry.rank) {
                movement = (
                  <span className="flex items-center text-[11px] font-semibold text-rose-700">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5 text-rose-600" />
                    -{entry.rank - entry.lastRank}
                  </span>
                );
              }

              const isNo1 = entry.rank === 1;
              const isTop3 = entry.rank <= 3;
              const isTop10 = entry.rank <= 10;

              return (
                <div
                  key={entry.songId}
                  className={`p-3.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                    isPlayerSong
                      ? 'bg-purple-50/40 border-l-4 border-l-purple-600'
                      : isNo1
                      ? 'bg-amber-50/30'
                      : 'hover:bg-[#fcfbf8]'
                  }`}
                >
                  {/* Position & Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 flex flex-col items-center justify-center font-mono">
                      <div className="flex items-center gap-1">
                        {isNo1 && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                        <span className={`text-base font-bold ${
                          isNo1
                            ? 'text-amber-700 font-extrabold text-lg'
                            : isTop3
                            ? 'text-indigo-700'
                            : isTop10
                            ? 'text-blue-700'
                            : 'text-[#5f5f5d]'
                        }`}>
                          #{entry.rank}
                        </span>
                      </div>
                      <div className="mt-0.5">{movement}</div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#1c1c1c] text-sm line-clamp-1 flex items-center gap-2">
                        {entry.title}
                        {isPlayerSong && (
                          <span className="text-[9px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-2 py-0.5 rounded-[4px] shadow-xs">
                            TU TEMA
                          </span>
                        )}
                        {isNo1 && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.2 rounded-[4px]">
                            #1 HIT
                          </span>
                        )}
                      </h4>
                      <p className="text-[#5f5f5d] text-xs line-clamp-1">
                        {entry.artistName}
                      </p>
                    </div>
                  </div>

                  {/* Right metrics */}
                  <div className="flex items-center gap-6 sm:gap-12 font-mono text-xs text-right whitespace-nowrap">
                    <span className="hidden sm:inline font-bold text-purple-900">
                      {entry.streamsThisWeek.toLocaleString()}
                    </span>
                    <span className={`font-bold w-8 text-center ${entry.peakRank === 1 ? 'text-amber-700 font-extrabold' : 'text-[#1c1c1c]'}`}>
                      #{entry.peakRank}
                    </span>
                    <span className="text-[#5f5f5d] w-8 text-center">
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
