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
    <div className="space-y-6 pb-12 text-fg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-line shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs uppercase font-bold tracking-wider bg-cyan-950/60 text-cyan-400 border border-cyan-500/40 px-2.5 py-0.5 rounded-sm">
              Rankings Oficiales
            </span>
            <span className="text-xs text-fg-muted">
              Año {currentYear} • Mes {currentMonth}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-fg tracking-[-0.9px] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-info" />
            Charts Oficiales de Streaming & Ventas
          </h1>
          <p className="text-xs text-fg-muted mt-1">
            Rankings oficiales actualizados mensualmente en base al consumo real de streaming y rotación radial.
          </p>
        </div>

        {/* Region Selector */}
        <div role="tablist" aria-label="Región del ranking" className="flex items-center gap-1 overflow-x-auto scroll-fade-x bg-canvas p-1.5 rounded-lg border border-line max-w-full sm:max-w-[60%] text-xs shadow-xs">
          {regions.map(r => {
            const isActive = selectedRegion === r.id;
            return (
              <button
                key={r.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedRegion(r.id)}
                className={`tap shrink-0 px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                    : 'text-fg-muted hover:text-fg hover:bg-surface'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart List Table */}
      <div role="table" aria-label={`Ranking ${formatMusicRegionLabel(selectedRegion)}`} className="bg-surface border border-line rounded-card overflow-hidden shadow-sm">
        <div role="row" className={`${CHART_GRID} px-4 py-3 border-b border-line text-2xs text-fg-muted font-bold uppercase tracking-wider bg-surface`}>
          <span role="columnheader" className="text-center">Pos.</span>
          <span role="columnheader">Canción & Artista</span>
          <span role="columnheader" className="hidden sm:block text-right">Streams / sem.</span>
          <span role="columnheader" className="text-center">Peak</span>
          <span role="columnheader" className="text-center">Semanas</span>
        </div>

        {currentChart.entries.length === 0 ? (
          <div className="p-10 flex flex-col items-center gap-4 text-center">
            <BarChart3 className="w-8 h-8 text-fg-subtle" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-fg">Todavía no hay ranking para esta región</p>
              <p className="text-xs text-fg-muted max-w-md">
                Los charts se calculan al avanzar el tiempo con el streaming acumulado de cada lanzamiento.
              </p>
            </div>
            {onAdvanceCycle && (
              <button
                onClick={onAdvanceCycle}
                className="tap inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-strong text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
                Avanzar ciclo (+6M)
              </button>
            )}
          </div>
        ) : (
          <div role="rowgroup" className="divide-y divide-line">
            {currentChart.entries.map((entry, idx) => {
              const isPlayerSong = entry.artistId === player?.id;
              let movement = <Minus className="w-3.5 h-3.5 text-fg-muted" />;

              if (entry.lastRank === null) {
                movement = (
                  <span className="text-2xs font-bold text-purple-300 uppercase bg-purple-950/60 border border-purple-500/40 px-1.5 py-0.5 rounded-sm">
                    NEW
                  </span>
                );
              } else if (entry.lastRank > entry.rank) {
                movement = (
                  <span className="flex items-center text-xs font-bold text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5 text-emerald-400" />
                    +{entry.lastRank - entry.rank}
                  </span>
                );
              } else if (entry.lastRank < entry.rank) {
                movement = (
                  <span className="flex items-center text-xs font-semibold text-rose-400">
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
                  role="row"
                  className={`${CHART_GRID} px-4 py-3 text-xs transition-colors hover:bg-surface-raised ${
                    isPlayerSong
                      ? 'bg-primary/15 border-l-4 border-l-primary'
                      : isNo1
                      ? 'bg-amber-500/10'
                      : idx % 2 === 0
                      ? 'bg-surface'
                      : 'bg-canvas'
                  }`}
                >
                    {/* Position */}
                    <div role="cell" className="flex flex-col items-center justify-center font-mono">
                      <div className="flex items-center gap-1">
                        {isNo1 && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        <span className={`text-base font-bold ${
                          isNo1
                            ? 'text-amber-400 font-extrabold text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                            : isTop3
                            ? 'text-primary'
                            : isTop10
                            ? 'text-info'
                            : 'text-fg-muted'
                        }`}>
                          #{entry.rank}
                        </span>
                      </div>
                      <div className="mt-0.5">{movement}</div>
                    </div>

                    {/* Song & artist */}
                    <div role="cell" className="min-w-0">
                      <h4 className="font-semibold text-fg text-sm line-clamp-1 flex items-center gap-2">
                        {entry.title}
                        {isPlayerSong && (
                          <span className="shrink-0 text-2xs bg-gradient-to-r from-primary to-accent text-white font-bold px-2 py-0.5 rounded-sm shadow-[0_0_8px_rgba(139,92,246,0.4)]">
                            TU TEMA
                          </span>
                        )}
                        {isNo1 && (
                          <span className="text-2xs bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold px-1.5 py-0.5 rounded-sm">
                            #1 HIT
                          </span>
                        )}
                      </h4>
                      <p className="text-fg-muted text-xs line-clamp-1">
                        {entry.artistName}
                      </p>
                    </div>

                    {/* Metrics */}
                    <span role="cell" className="hidden sm:block font-mono font-bold text-primary-soft text-right tabular-nums">
                      {entry.streamsThisWeek.toLocaleString('es-AR')}
                    </span>
                    <span role="cell" className={`font-mono font-bold text-center tabular-nums ${entry.peakRank === 1 ? 'text-amber-400 font-extrabold' : 'text-fg'}`}>
                      #{entry.peakRank}
                    </span>
                    <span role="cell" className="font-mono text-fg-muted text-center tabular-nums">
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
