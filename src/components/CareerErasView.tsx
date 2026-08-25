import React from 'react';
import { Artist, WorldState, CareerEra, Song } from '../types';
import { TrendingUp, Sparkles, Award, Calendar, History, Trophy, Crown, Star } from 'lucide-react';
import { TimeSystem } from '../systems/TimeSystem';

interface CareerErasViewProps {
  player: Artist;
  world: WorldState;
}

export const CareerErasView: React.FC<CareerErasViewProps> = ({ player, world }) => {
  const yearsActive = TimeSystem.calculateCareerLengthYears(player.careerStartYear, world.currentYear);
  const playerSongs = (Object.values(world.songs) as Song[]).filter(s => s.artistId === player.id);
  const totalNo1s = playerSongs.filter(s => (s.peakPosition?.Global === 1 || s.peakPosition?.Argentina === 1)).length;
  const totalHits = playerSongs.filter(s => (s.peakPosition?.Global ?? 99) <= 10).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#f7f4ed] p-6 rounded-[16px] border border-[#eceae4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1c1c] tracking-[-0.9px] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1c1c1c]" />
            Evolución de Carrera, Eras & Cronología
          </h1>
          <p className="text-xs text-[#5f5f5d] mt-1">
            Revisá la historia viva de tu trayectoria: eras estéticas, hitos de streaming, premios y la construcción de tu legado cultural.
          </p>
        </div>

        <div className="bg-[#fcfbf8] px-4 py-2 rounded-[6px] border border-[#eceae4] text-center font-mono">
          <span className="text-[10px] text-[#5f5f5d] block uppercase tracking-wider">Puntaje de Legado</span>
          <span className="text-xl font-semibold text-[#1c1c1c]">{player.legacyScore}/100</span>
        </div>
      </div>

      {/* Legacy & Hall of Fame Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#fcfbf8] border border-[#eceae4] p-4 rounded-[12px] flex items-center gap-3">
          <div className="p-2.5 bg-[#f7f4ed] text-[#1c1c1c] rounded-[6px] border border-[#eceae4]">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#5f5f5d] block">Etapa Actual</span>
            <span className="text-sm font-semibold text-[#1c1c1c]">{player.careerStage}</span>
          </div>
        </div>

        <div className="bg-[#fcfbf8] border border-[#eceae4] p-4 rounded-[12px] flex items-center gap-3">
          <div className="p-2.5 bg-[#f7f4ed] text-[#1c1c1c] rounded-[6px] border border-[#eceae4]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#5f5f5d] block">Hits Top 10</span>
            <span className="text-sm font-semibold text-[#1c1c1c]">{totalHits} Canciones</span>
          </div>
        </div>

        <div className="bg-[#fcfbf8] border border-[#eceae4] p-4 rounded-[12px] flex items-center gap-3">
          <div className="p-2.5 bg-[#f7f4ed] text-[#1c1c1c] rounded-[6px] border border-[#eceae4]">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#5f5f5d] block">#1 en Charts</span>
            <span className="text-sm font-semibold text-[#1c1c1c]">{totalNo1s} Himnos</span>
          </div>
        </div>

        <div className="bg-[#fcfbf8] border border-[#eceae4] p-4 rounded-[12px] flex items-center gap-3">
          <div className="p-2.5 bg-[#f7f4ed] text-[#1c1c1c] rounded-[6px] border border-[#eceae4]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#5f5f5d] block">Premios Ganados</span>
            <span className="text-sm font-semibold text-[#1c1c1c]">{player.awardsWon.length} Galardones</span>
          </div>
        </div>
      </div>

      {/* Eras Timeline */}
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-6">
        <h2 className="text-base font-semibold text-[#1c1c1c] flex items-center gap-2 border-b border-[#eceae4] pb-3">
          <History className="w-4 h-4 text-[#1c1c1c]" />
          Línea Temporal de Eras Artísticas ({player.eras.length})
        </h2>

        <div className="relative pl-6 border-l-2 border-[#eceae4] space-y-6 my-4">
          {player.eras.map((era, index) => {
            const isCurrent = index === player.eras.length - 1;
            return (
              <div key={era.id} className="relative space-y-2 group">
                {/* Dot marker */}
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  isCurrent
                    ? 'bg-[#1c1c1c] border-[#1c1c1c] ring-4 ring-[rgba(28,28,28,0.1)]'
                    : 'bg-[#f7f4ed] border-[#eceae4]'
                }`} />

                <div className="bg-[#fcfbf8] p-5 rounded-[12px] border border-[#eceae4] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#1c1c1c]">{era.name}</h3>
                      <span className="text-[10px] uppercase font-semibold bg-[#f7f4ed] text-[#1c1c1c] border border-[#eceae4] px-2 py-0.5 rounded-[4px]">
                        {era.stage}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-[#5f5f5d]">
                      {era.startYear} — {era.endYear ? era.endYear : 'Presente'}
                    </span>
                  </div>

                  <p className="text-xs text-[#5f5f5d] leading-relaxed">
                    {era.highlightSummary}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#5f5f5d] pt-1">
                    <span>Enfoque Sonoro: <strong className="text-[#1c1c1c] font-medium">{world.genres[era.genreFocus]?.name || era.genreFocus}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

