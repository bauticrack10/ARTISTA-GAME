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
      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            Evolución de Carrera, Eras & Cronología
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Revisá la historia viva de tu trayectoria: eras estéticas, hitos de streaming, premios y la construcción de tu legado cultural.
          </p>
        </div>

        <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 text-center font-mono">
          <span className="text-[10px] text-zinc-400 block uppercase">Puntaje de Legado</span>
          <span className="text-xl font-black text-amber-400">{player.legacyScore}/100</span>
        </div>
      </div>

      {/* Legacy & Hall of Fame Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 block">Etapa Actual</span>
            <span className="text-sm font-black text-white">{player.careerStage}</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 block">Hits Top 10</span>
            <span className="text-sm font-black text-white">{totalHits} Canciones</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 block">#1 en Charts</span>
            <span className="text-sm font-black text-white">{totalNo1s} Himnos</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 block">Premios Ganados</span>
            <span className="text-sm font-black text-white">{player.awardsWon.length} Galardones</span>
          </div>
        </div>
      </div>

      {/* Eras Timeline */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <History className="w-4 h-4 text-amber-400" />
          Línea Temporal de Eras Artísticas ({player.eras.length})
        </h2>

        <div className="relative pl-6 border-l-2 border-zinc-800 space-y-8 my-4">
          {player.eras.map((era, index) => {
            const isCurrent = index === player.eras.length - 1;
            return (
              <div key={era.id} className="relative space-y-2 group">
                {/* Dot marker */}
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  isCurrent
                    ? 'bg-rose-500 border-rose-300 ring-4 ring-rose-500/20 animate-pulse'
                    : 'bg-zinc-900 border-zinc-700'
                }`} />

                <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">{era.name}</h3>
                      <span className="text-[10px] uppercase font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                        {era.stage}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-zinc-400">
                      {era.startYear} — {era.endYear ? era.endYear : 'Presente'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {era.highlightSummary}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-1">
                    <span>Enfoque Sonoro: <strong className="text-zinc-400">{world.genres[era.genreFocus]?.name || era.genreFocus}</strong></span>
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
