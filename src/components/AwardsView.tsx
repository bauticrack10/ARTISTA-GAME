import React from 'react';
import { WorldState, Artist, AwardCeremony } from '../types';
import { Award, Trophy, Star, Sparkles, Crown } from 'lucide-react';

interface AwardsViewProps {
  world: WorldState;
  player: Artist;
}

export const AwardsView: React.FC<AwardsViewProps> = ({ world, player }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Galas de Premiación & Reconocimientos
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Ceremonias anuales donde la academia de la música premia a los discos, canciones y artistas más influyentes del año.
          </p>
        </div>

        <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 text-center font-mono">
          <span className="text-[10px] text-zinc-400 block uppercase">Estatuillas Ganadas</span>
          <span className="text-xl font-black text-amber-400">{player.awardsWon.length}</span>
        </div>
      </div>

      {/* Trophy Showcase */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Crown className="w-4 h-4 text-amber-400" />
          Vitrina de Trofeos de {player.name}
        </h2>

        {player.awardsWon.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs">
            Aún no has ganado estatuillas en las galas anuales. ¡Lanzá discos aclamados por la crítica y hits mundiales para ser nominado en diciembre!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {player.awardsWon.map(award => (
              <div key={award.id} className="bg-zinc-950 p-4 rounded-xl border border-amber-500/30 flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{award.category}</h3>
                  <p className="text-xs text-amber-400 font-mono">
                    {award.ceremonyName} ({award.year})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History of Past Ceremonies */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Sparkles className="w-4 h-4 text-rose-400" />
          Historial de Ceremonias Anuales ({world.awardsHistory.length})
        </h2>

        {world.awardsHistory.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs">
            Aún no se ha celebrado ninguna gala anual de fin de año. La primera gala se celebra al concluir diciembre.
          </div>
        ) : (
          <div className="space-y-6">
            {world.awardsHistory.map(ceremony => (
              <div key={ceremony.id} className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <h3 className="font-black text-base text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    {ceremony.name}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">
                    Año {ceremony.year}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ceremony.awards.map(a => {
                    const winnerArtist = world.artists[a.winnerArtistId];
                    const isPlayer = a.winnerArtistId === player.id;
                    return (
                      <div
                        key={a.id}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          isPlayer
                            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-400 uppercase text-[10px]">{a.category}</span>
                          {isPlayer && <span className="font-bold text-amber-400 uppercase text-[10px]">¡Ganaste vos!</span>}
                        </div>
                        <p className="font-extrabold text-sm text-white">
                          🏆 {winnerArtist?.name || 'Artista Destacado'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
