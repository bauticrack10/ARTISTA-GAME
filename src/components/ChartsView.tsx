import React, { useState } from 'react';
import { WorldState, MusicRegion, Artist, ChartEntry } from '../types';
import { BarChart3, Trophy, Flame, TrendingUp, TrendingDown, Minus, Sparkles, Disc3, Crown, Play } from 'lucide-react';
import { RELEASE_BADGES } from '../utils/themeColors';
import { MUSIC_REGION_CONFIG, formatMusicRegion, formatMusicRegionLabel } from '../utils/formatters';

interface ChartsViewProps {
  world: WorldState;
  player: Artist;
  onAdvanceCycle?: () => void;
}

// Shared column template so header labels and row cells always line up.
const CHART_GRID = 'grid grid-cols-[3.5rem_minmax(0,1fr)_3rem_3.5rem] sm:grid-cols-[4.5rem_minmax(0,1fr)_9rem_4rem_5rem] items-center gap-3';

export const ChartsView: React.FC<ChartsViewProps> = ({ world, player, onAdvanceCycle }) => {
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
    { id: 'Europe', label: formatMusicRegionLabel('Europe') },
    { id: 'UK', label: formatMusicRegionLabel('UK') },
    { id: 'Brazil', label: formatMusicRegionLabel('Brazil') },
    { id: 'Asia', label: formatMusicRegionLabel('Asia') },
    { id: 'Africa', label: formatMusicRegionLabel('Africa') }
  ];

  return (
    <div className="space-y-6 pb-12 text-[#F4F4F6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111114] p-6 rounded-[6px] border border-[#242429] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-sans font-bold tracking-widest bg-[#18181C] text-[#8E8E99] border border-[#242429] px-2.5 py-0.5 rounded-[4px]">
              Rankings Oficiales
            </span>
            <span className="text-xs font-sans text-[#8E8E99]">
              Año {currentYear} • Mes {currentMonth}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F4F4F6] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#FF4F00]" />
            Charts Oficiales de Streaming & Ventas
          </h1>
          <p className="text-xs text-[#8E8E99] mt-1">
            Rankings oficiales actualizados mensualmente en base al consumo real de streaming y rotación radial.
          </p>
        </div>

        {/* Region Selector */}
        <div role="tablist" aria-label="Región del ranking" className="flex items-center gap-1 overflow-x-auto scroll-fade-x bg-[#09090B] p-1.5 rounded-[4px] border border-[#242429] max-w-full sm:max-w-[60%] text-xs shadow-xs">
          {regions.map(r => {
            const isActive = selectedRegion === r.id;
            return (
              <button
                key={r.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedRegion(r.id)}
                className={`tap shrink-0 px-3 py-1.5 rounded-[4px] font-sans text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF4F00] text-white'
                    : 'text-[#8E8E99] hover:text-[#F4F4F6] hover:bg-[#18181C]'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart List Table */}
      <div role="table" aria-label={`Ranking ${formatMusicRegionLabel(selectedRegion)}`} className="bg-[#111114] border border-[#242429] rounded-[6px] overflow-hidden shadow-xs">
        <div role="row" className={`${CHART_GRID} px-4 py-3 border-b border-[#242429] text-[10px] text-[#52525B] font-sans font-bold uppercase tracking-widest bg-[#111114]`}>
          <span role="columnheader" className="text-center">Pos.</span>
          <span role="columnheader">Canción & Artista</span>
          <span role="columnheader" className="hidden sm:block text-right">Streams / sem.</span>
          <span role="columnheader" className="text-center">Peak</span>
          <span role="columnheader" className="text-center">Semanas</span>
        </div>

        {currentChart.entries.length === 0 ? (
          <div className="p-10 flex flex-col items-center gap-4 text-center">
            <BarChart3 className="w-8 h-8 text-[#52525B]" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#F4F4F6]">Todavía no hay ranking para esta región</p>
              <p className="text-xs text-[#8E8E99] max-w-md">
                Los charts se calculan al avanzar el tiempo con el streaming acumulado de cada lanzamiento.
              </p>
            </div>
            {onAdvanceCycle && (
              <button
                onClick={onAdvanceCycle}
                className="tap inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-sans font-bold cursor-pointer transition-colors active:translate-y-[1px]"
              >
                <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
                Avanzar ciclo (+6M)
              </button>
            )}
          </div>
        ) : (
          <div role="rowgroup" className="divide-y divide-[#1C1C21]">
            {currentChart.entries.map((entry, idx) => {
              const isPlayerSong = entry.artistId === player?.id;
              let movement = <Minus className="w-3.5 h-3.5 text-[#52525B]" />;

              if (entry.lastRank === null) {
                movement = (
                  <span className="text-[10px] font-sans font-bold text-[#FF4F00] uppercase bg-[#FF4F00]/10 border border-[#FF4F00]/30 px-1.5 py-0.5 rounded-[4px]">
                    NEW
                  </span>
                );
              } else if (entry.lastRank > entry.rank) {
                movement = (
                  <span className="flex items-center text-xs font-sans font-bold text-[#00E599] tabular-nums">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5 text-[#00E599]" />
                    +{entry.lastRank - entry.rank}
                  </span>
                );
              } else if (entry.lastRank < entry.rank) {
                movement = (
                  <span className="flex items-center text-xs font-sans font-semibold text-[#EF4444] tabular-nums">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5 text-[#EF4444]" />
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
                  role="row"
                  className={`${CHART_GRID} px-4 py-3 text-xs transition-colors hover:bg-[#18181C] border-b border-[#1C1C21] ${
                    isPlayerSong
                      ? 'bg-[#FF4F00]/10 border-l-4 border-l-[#FF4F00]'
                      : isNo1
                      ? 'bg-[#F59E0B]/5'
                      : idx % 2 === 0
                      ? 'bg-[#111114]'
                      : 'bg-[#0D0D10]'
                  }`}
                >
                    {/* Position */}
                    <div role="cell" className="flex flex-col items-center justify-center font-sans">
                      <div className="flex items-center gap-1">
                        {isNo1 && <Crown className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />}
                        <span className={`text-base font-bold tabular-nums ${
                          isNo1
                            ? 'text-[#F59E0B] font-extrabold text-lg'
                            : isTop3
                            ? 'text-[#FF4F00]'
                            : isTop10
                            ? 'text-[#F4F4F6]'
                            : 'text-[#8E8E99]'
                        }`}>
                          #{entry.rank}
                        </span>
                      </div>
                      <div className="mt-0.5">{movement}</div>
                    </div>

                    {/* Song & artist */}
                    <div role="cell" className="min-w-0">
                      <h4 className="font-semibold text-[#F4F4F6] text-sm line-clamp-1 flex items-center gap-2">
                        {entry.title}
                        {isPlayerSong && (
                          <span className="shrink-0 text-[10px] bg-[#FF4F00] text-white font-sans font-bold px-2 py-0.5 rounded-[4px]">
                            TU TEMA
                          </span>
                        )}
                        {isNo1 && (
                          <span className="text-[10px] bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-sans font-bold px-1.5 py-0.5 rounded-[4px]">
                            #1 HIT
                          </span>
                        )}
                      </h4>
                      <p className="text-[#8E8E99] text-xs line-clamp-1">
                        {entry.artistName}
                      </p>
                    </div>

                    {/* Metrics */}
                    <span role="cell" className="hidden sm:block font-sans font-bold text-[#00E599] text-right tabular-nums">
                      {entry.streamsThisWeek.toLocaleString('es-AR')}
                    </span>
                    <span role="cell" className={`font-sans font-bold text-center tabular-nums ${entry.peakRank === 1 ? 'text-[#F59E0B] font-extrabold' : 'text-[#F4F4F6]'}`}>
                      #{entry.peakRank}
                    </span>
                    <span role="cell" className="font-sans text-[#8E8E99] text-center tabular-nums">
                      {entry.weeksOnChart}
                    </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
