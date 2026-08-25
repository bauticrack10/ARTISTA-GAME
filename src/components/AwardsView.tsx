import React from 'react';
import { WorldState, Artist } from '../types';
import { Award, Trophy, Star, Sparkles, Crown } from 'lucide-react';

interface AwardsViewProps {
  world: WorldState;
  player: Artist;
}

export const AwardsView: React.FC<AwardsViewProps> = ({ world, player }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#f7f4ed] p-6 rounded-[16px] border border-[#eceae4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1c1c] tracking-[-0.9px] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#1c1c1c]" />
            Galas de Premiación & Reconocimientos
          </h1>
          <p className="text-xs text-[#5f5f5d] mt-1">
            Ceremonias anuales donde la academia de la música premia a los discos, canciones y artistas más influyentes del año.
          </p>
        </div>

        <div className="bg-[#fcfbf8] px-4 py-2 rounded-[6px] border border-[#eceae4] text-center font-mono">
          <span className="text-[10px] text-[#5f5f5d] block uppercase tracking-wider">Estatuillas Ganadas</span>
          <span className="text-xl font-semibold text-[#1c1c1c]">{player.awardsWon.length}</span>
        </div>
      </div>

      {/* Trophy Showcase */}
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#1c1c1c] flex items-center gap-2 border-b border-[#eceae4] pb-3">
          <Crown className="w-4 h-4 text-[#1c1c1c]" />
          Vitrina de Trofeos de {player.name}
        </h2>

        {player.awardsWon.length === 0 ? (
          <div className="text-center py-8 text-[#5f5f5d] text-xs">
            Aún no has ganado estatuillas en las galas anuales. ¡Lanzá discos aclamados por la crítica y hits mundiales para ser nominado en diciembre!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {player.awardsWon.map((awardName, idx) => (
              <div key={idx} className="bg-[#fcfbf8] p-4 rounded-[12px] border border-[#eceae4] flex items-center gap-3">
                <div className="p-2.5 bg-[#f7f4ed] rounded-[6px] border border-[#eceae4] text-[#1c1c1c]">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[#1c1c1c]">{awardName}</h3>
                  <p className="text-[11px] text-[#5f5f5d] mt-0.5">
                    Reconocimiento Oficial
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History of Past Ceremonies */}
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-6">
        <h2 className="text-base font-semibold text-[#1c1c1c] flex items-center gap-2 border-b border-[#eceae4] pb-3">
          <Sparkles className="w-4 h-4 text-[#1c1c1c]" />
          Historial de Ceremonias Anuales ({world.awardsHistory.length})
        </h2>

        {world.awardsHistory.length === 0 ? (
          <div className="text-center py-8 text-[#5f5f5d] text-xs">
            Aún no se ha celebrado ninguna gala anual de fin de año. La primera gala se celebra al concluir diciembre.
          </div>
        ) : (
          <div className="space-y-4">
            {world.awardsHistory.map((ceremony, cIdx) => (
              <div key={`${ceremony.year}_${cIdx}`} className="bg-[#fcfbf8] p-5 rounded-[12px] border border-[#eceae4] space-y-4">
                <div className="flex items-center justify-between border-b border-[#eceae4] pb-2">
                  <h3 className="font-semibold text-sm text-[#1c1c1c] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#1c1c1c]" />
                    {ceremony.name}
                  </h3>
                  <span className="text-xs font-mono text-[#5f5f5d]">
                    Año {ceremony.year}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ceremony.categories.map((cat, catIdx) => {
                    const winnerArtist = world.artists[cat.winnerArtistId];
                    const isPlayer = cat.winnerArtistId === player.id;
                    return (
                      <div
                        key={cat.id || catIdx}
                        className={`p-3 rounded-[6px] border text-xs space-y-1 ${
                          isPlayer
                            ? 'bg-[#f7f4ed] border-[#1c1c1c] text-[#1c1c1c]'
                            : 'bg-[#f7f4ed] border-[#eceae4] text-[#1c1c1c]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-[#5f5f5d] uppercase text-[10px] tracking-wider">{cat.name}</span>
                          {isPlayer && (
                            <span className="font-semibold text-[#1c1c1c] bg-[rgba(28,28,28,0.06)] px-1.5 py-0.5 rounded-[4px] text-[10px]">
                              ¡Ganador!
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-xs text-[#1c1c1c]">
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

