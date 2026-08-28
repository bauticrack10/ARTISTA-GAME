import React, { useState } from 'react';
import { WorldState, MusicRegion, Artist, ChartEntry } from '../types';
import { BarChart3, Trophy, Flame, TrendingUp, TrendingDown, Minus, Sparkles, Disc3, Crown } from 'lucide-react';
import { RELEASE_BADGES } from '../utils/themeColors';
import { MUSIC_REGION_CONFIG, formatMusicRegion, formatMusicRegionLabel } from '../utils/formatters';

interface ChartsViewProps {
  world: WorldState;
  player: Artist;
}

export const ChartsView: React.FC<ChartsViewProps> = ({ world, player }) => {
  const [selectedRegion, setSelectedRegion] = useState<MusicRegion>('Global');

  const currentYear = world?.currentYear || 2026;
  const currentMonth = world?.currentMonth || 1;
  const currentChart = world?.charts?.[selectedRegion] || {
    region: selectedRegion,
    year: currentYear,
    month: currentMonth,
    entries: []
  };

  const regions: Array<{ id: MusicRegion; label: string }> = [
    { id: 'Global', label: formatMusicRegionLabel('Global') },
    { id: 'Argentina', label: formatMusicRegionLabel('Argentina') },
    { id: 'LatinAmerica', label: formatMusicRegionLabel('LatinAmerica') },
    { id: 'USA', label: formatMusicRegionLabel('USA') },
    { id: 'Spain', label: formatMusicRegionLabel('Spain') },
    { id: 'Mexico', label: formatMusicRegionLabel('Mexico') },
    { id: 'Europe', label: formatMusicRegionLabel('Europe') }
  ];

  return (
    <div className="space-y-6 pb-12 text-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#16181F] p-6 rounded-[16px] border border-[#2A2E3D] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-950/60 text-cyan-400 border border-cyan-500/40 px-2.5 py-0.5 rounded-[4px]">
              Rankings Oficiales
            </span>
            <span className="text-xs text-[#94A3B8]">
              Año {currentYear} • Mes {currentMonth}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-[#F8FAFC] tracking-[-0.9px] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#06B6D4]" />
            Charts Oficiales de Streaming & Ventas
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Rankings oficiales actualizados mensualmente en base al consumo real de streaming y rotación radial.
          </p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-1 overflow-x-auto bg-[#0B0C10] p-1.5 rounded-[8px] border border-[#2A2E3D] max-w-full text-xs shadow-xs">
          {regions.map(r => {
            const isActive = selectedRegion === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1.5 rounded-[6px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#16181F]'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart List Table */}
      <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[14px] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#2A2E3D] flex items-center justify-between text-xs text-[#94A3B8] font-bold uppercase tracking-wider bg-[#16181F]">
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
          <div className="p-12 text-center text-[#94A3B8] text-xs">
            Aún no hay suficientes datos de streaming computados para este ranking regional. Avanzá el mes para procesar los charts.
          </div>
        ) : (
          <div className="divide-y divide-[#2A2E3D]">
            {currentChart.entries.map((entry, idx) => {
              const isPlayerSong = entry.artistId === player?.id;
              let movement = <Minus className="w-3.5 h-3.5 text-[#94A3B8]" />;

              if (entry.lastRank === null) {
                movement = (
                  <span className="text-[10px] font-bold text-purple-300 uppercase bg-purple-950/60 border border-purple-500/40 px-1.5 py-0.5 rounded-[4px]">
                    NEW
                  </span>
                );
              } else if (entry.lastRank > entry.rank) {
                movement = (
                  <span className="flex items-center text-[11px] font-bold text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5 text-emerald-400" />
                    +{entry.lastRank - entry.rank}
                  </span>
                );
              } else if (entry.lastRank < entry.rank) {
                movement = (
                  <span className="flex items-center text-[11px] font-semibold text-rose-400">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5 text-rose-400" />
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
                  className={`p-3.5 flex items-center justify-between gap-3 text-xs transition-colors hover:bg-[#1C1F28] ${
                    isPlayerSong
                      ? 'bg-[#8B5CF6]/15 border-l-4 border-l-[#8B5CF6]'
                      : isNo1
                      ? 'bg-amber-500/10'
                      : idx % 2 === 0
                      ? 'bg-[#16181F]'
                      : 'bg-[#0B0C10]'
                  }`}
                >
                  {/* Position & Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 flex flex-col items-center justify-center font-mono">
                      <div className="flex items-center gap-1">
                        {isNo1 && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        <span className={`text-base font-bold ${
                          isNo1
                            ? 'text-amber-400 font-extrabold text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                            : isTop3
                            ? 'text-[#8B5CF6]'
                            : isTop10
                            ? 'text-[#06B6D4]'
                            : 'text-[#94A3B8]'
                        }`}>
                          #{entry.rank}
                        </span>
                      </div>
                      <div className="mt-0.5">{movement}</div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#F8FAFC] text-sm line-clamp-1 flex items-center gap-2">
                        {entry.title}
                        {isPlayerSong && (
                          <span className="text-[9px] bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold px-2 py-0.5 rounded-[4px] shadow-[0_0_8px_rgba(139,92,246,0.4)]">
                            TU TEMA
                          </span>
                        )}
                        {isNo1 && (
                          <span className="text-[9px] bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold px-1.5 py-0.5 rounded-[4px]">
                            #1 HIT
                          </span>
                        )}
                      </h4>
                      <p className="text-[#94A3B8] text-xs line-clamp-1">
                        {entry.artistName}
                      </p>
                    </div>
                  </div>

                  {/* Right metrics */}
                  <div className="flex items-center gap-6 sm:gap-12 font-mono text-xs text-right whitespace-nowrap">
                    <span className="hidden sm:inline font-bold text-[#8B5CF6]">
                      {entry.streamsThisWeek.toLocaleString()}
                    </span>
                    <span className={`font-bold w-8 text-center ${entry.peakRank === 1 ? 'text-amber-400 font-extrabold' : 'text-[#F8FAFC]'}`}>
                      #{entry.peakRank}
                    </span>
                    <span className="text-[#94A3B8] w-8 text-center">
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
