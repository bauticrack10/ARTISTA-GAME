import React, { useState } from 'react';
import { WorldState, Artist, AwardCeremony } from '../types';
import {
  Award,
  Trophy,
  Star,
  Sparkles,
  Crown,
  Play,
  ChevronDown,
  ChevronUp,
  Disc3,
  Sliders,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface AwardsViewProps {
  world: WorldState;
  player: Artist;
  onOpenGala?: (ceremony: AwardCeremony) => void;
}

export const AwardsView: React.FC<AwardsViewProps> = ({ world, player, onOpenGala }) => {
  const [expandedYear, setExpandedYear] = useState<number | null>(
    world.awardsHistory.length > 0 ? world.awardsHistory[0].year : null
  );
  const [filterOnlyPlayerWins, setFilterOnlyPlayerWins] = useState<boolean>(false);

  const ceremonies = world.awardsHistory || [];
  const filteredCeremonies = filterOnlyPlayerWins
    ? ceremonies.filter(c => c.categories.some(cat => cat.winnerArtistId === player.id))
    : ceremonies;

  const getCategoryIcon = (name: string) => {
    if (name.includes('Artista')) return Crown;
    if (name.includes('Canción')) return Disc3;
    if (name.includes('Álbum')) return Trophy;
    if (name.includes('Nuevo') || name.includes('Revelación')) return Sparkles;
    if (name.includes('Producción')) return Sliders;
    return Award;
  };

  return (
    <div
      className="space-y-6 pb-12 text-[#1c1c1c]"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-[#f7f4ed] p-6 rounded-[16px] border border-[#eceae4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-[4px]">
              Academia Musical
            </span>
            <span className="text-xs text-[#5f5f5d]">Premios Anuales & Reconocimientos</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1c1c1c] tracking-[-0.9px] mt-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-600" />
            Galas de Premiación & Vitrina de Trofeos
          </h1>
          <p className="text-xs text-[#5f5f5d] mt-1 max-w-2xl leading-relaxed">
            Cada diciembre la academia de la música evalúa el impacto comercial, trascendencia cultural,
            calidad crítica y sofisticación de producción de la escena en 5 categorías fundamentales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50/70 px-4 py-2.5 rounded-[10px] border border-amber-300 text-center font-mono shadow-xs">
            <span className="text-[10px] text-amber-900 block uppercase tracking-wider font-bold">Estatuillas Ganadas</span>
            <span className="text-2xl font-bold text-amber-700">{player.awardsWon.length}</span>
          </div>
          <div className="bg-purple-50/70 px-4 py-2.5 rounded-[10px] border border-purple-300 text-center font-mono shadow-xs">
            <span className="text-[10px] text-purple-900 block uppercase tracking-wider font-bold">Puntaje Legado</span>
            <span className="text-2xl font-bold text-purple-700">{player.legacyScore}/100</span>
          </div>
        </div>
      </div>

      {/* Trophy Showcase of the Player */}
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[14px] p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eceae4] pb-3">
          <h2 className="text-base font-semibold text-[#1c1c1c] flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-600" />
            Vitrina de Trofeos de {player.name} ({player.awardsWon.length})
          </h2>
          <span className="text-xs text-[#5f5f5d]">
            Reconocimientos oficiales acumulados en la carrera
          </span>
        </div>

        {player.awardsWon.length === 0 ? (
          <div className="bg-[#fcfbf8] border border-[#eceae4] rounded-[12px] p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#1c1c1c]">Vitrina Vacía por Ahora</h3>
            <p className="text-xs text-[#5f5f5d] max-w-md mx-auto leading-relaxed">
              Aún no has ganado estatuillas en las galas anuales. Lanzá discos aclamados por la crítica, hits mundiales y producciones de primer nivel para competir cada diciembre.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {player.awardsWon.map((awardName, idx) => {
              const CategoryIcon = getCategoryIcon(awardName);
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-[#fcfbf8] to-amber-50/40 p-4 rounded-[12px] border border-amber-200/90 flex items-start gap-3 hover:border-amber-400 transition-all group shadow-xs"
                >
                  <div
                    className="p-2.5 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 rounded-[8px] shrink-0 shadow-sm"
                  >
                    <CategoryIcon className="w-4 h-4 text-amber-950 fill-amber-950/20" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-xs text-[#1c1c1c] leading-tight">
                      {awardName}
                    </h3>
                    <p className="text-[11px] text-[#5f5f5d]">
                      Galardón de la Academia Musical
                    </p>
                    <span className="inline-block text-[10px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-[4px] mt-1">
                      +5 Pts de Legado
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History of Past Ceremonies */}
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[14px] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eceae4] pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#1c1c1c] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Historial de Galas Anuales ({ceremonies.length})
            </h2>
            <p className="text-xs text-[#5f5f5d] mt-0.5">
              Registro histórico completo de nominaciones y ganadores en cada edición
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOnlyPlayerWins(!filterOnlyPlayerWins)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer border ${
                filterOnlyPlayerWins
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                  : 'bg-[#fcfbf8] text-[#5f5f5d] border-[#eceae4] hover:text-[#1c1c1c]'
              }`}
            >
              {filterOnlyPlayerWins ? '✓ Solo Mis Victorias' : 'Filtrar Mis Victorias'}
            </button>
          </div>
        </div>

        {ceremonies.length === 0 ? (
          <div className="bg-[#fcfbf8] border border-[#eceae4] rounded-[12px] p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-200 text-purple-600 mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#1c1c1c]">Sin Galas Realizadas Aún</h3>
            <p className="text-xs text-[#5f5f5d] max-w-md mx-auto leading-relaxed">
              La primera gala de premiaciones se celebrará automáticamente al finalizar el mes 12 del año actual. ¡Avanzá el ciclo temporal para vivir el evento!
            </p>
          </div>
        ) : filteredCeremonies.length === 0 ? (
          <div className="text-center py-8 text-[#5f5f5d] text-xs">
            No se encontraron ceremonias que coincidan con el filtro seleccionado.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCeremonies.map((ceremony) => {
              const isExpanded = expandedYear === ceremony.year;
              const playerWinsInCeremony = ceremony.categories.filter(c => c.winnerArtistId === player.id).length;
              const playerNomsInCeremony = ceremony.categories.filter(c => c.nomineeArtistIds.includes(player.id)).length;

              return (
                <div
                  key={ceremony.year}
                  className="bg-[#fcfbf8] rounded-[12px] border border-[#eceae4] overflow-hidden transition-all shadow-xs"
                >
                  {/* Ceremony Header Row */}
                  <div
                    onClick={() => setExpandedYear(isExpanded ? null : ceremony.year)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-amber-50/30 transition-colors border-b border-[#eceae4]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-100 rounded-[6px] border border-amber-300 text-amber-900 shrink-0 font-mono font-bold text-xs">
                        {ceremony.year}
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-[#1c1c1c] flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-600" />
                          {ceremony.name}
                        </h3>
                        <p className="text-xs text-[#5f5f5d] mt-0.5">
                          {ceremony.categories.length} Categorías Premiadas
                          {playerWinsInCeremony > 0 && (
                            <span className="text-amber-800 font-bold ml-2">
                              • 🏆 {playerWinsInCeremony} Premio{playerWinsInCeremony > 1 ? 's' : ''} Ganado{playerWinsInCeremony > 1 ? 's' : ''}
                            </span>
                          )}
                          {playerWinsInCeremony === 0 && playerNomsInCeremony > 0 && (
                            <span className="text-purple-700 font-semibold ml-2">
                              • ⭐ {playerNomsInCeremony} Nominación{playerNomsInCeremony > 1 ? 'es' : ''}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {onOpenGala && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenGala(ceremony);
                          }}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-bold px-3.5 py-1.5 rounded-[6px] text-xs hover:opacity-90 active:opacity-75 transition-all cursor-pointer shadow-sm border border-amber-300"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Revivir Gala Interactiva</span>
                        </button>
                      )}

                      <div className="p-1 rounded-[4px] hover:bg-[#eceae4] text-[#5f5f5d]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Categories Breakdown */}
                  {isExpanded && (
                    <div className="p-5 bg-[#f7f4ed]/50 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {ceremony.categories.map((cat, catIdx) => {
                          const isPlayerWinner = cat.winnerArtistId === player.id;
                          const isPlayerNominated = cat.nomineeArtistIds.includes(player.id);
                          const CatIcon = getCategoryIcon(cat.name);

                          return (
                            <div
                              key={cat.id || catIdx}
                              className={`p-4 rounded-[10px] border text-xs space-y-2.5 transition-all ${
                                isPlayerWinner
                                  ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-300'
                                  : 'bg-[#fcfbf8] border-[#eceae4]'
                              }`}
                            >
                              <div className="flex items-center justify-between border-b border-[#eceae4] pb-2">
                                <div className="flex items-center gap-1.5">
                                  <CatIcon className={`w-3.5 h-3.5 ${isPlayerWinner ? 'text-amber-600' : 'text-purple-600'}`} />
                                  <span className="font-bold text-xs text-[#1c1c1c]">
                                    {cat.name}
                                  </span>
                                </div>

                                {isPlayerWinner ? (
                                  <span className="font-bold text-amber-950 bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-[4px] text-[10px]">
                                    ¡Tu Victoria! 🏆
                                  </span>
                                ) : isPlayerNominated ? (
                                  <span className="font-bold text-purple-900 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-[4px] text-[10px]">
                                    Nominado ⭐
                                  </span>
                                ) : null}
                              </div>

                              {/* Winner Showcase */}
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold uppercase text-[#5f5f5d] tracking-wider block">
                                  Ganador Oficial
                                </span>
                                <p className="font-bold text-xs text-[#1c1c1c] flex items-center gap-1.5">
                                  🏆 {cat.winnerArtistName || world.artists[cat.winnerArtistId]?.name || 'Artista'}
                                  {cat.winnerItemTitle && (
                                    <span className="font-normal text-[#5f5f5d]">
                                      — "{cat.winnerItemTitle}"
                                    </span>
                                  )}
                                </p>
                                {cat.winnerReason && (
                                  <p className="text-[11px] text-[#5f5f5d] italic">
                                    {cat.winnerReason}
                                  </p>
                                )}
                              </div>

                              {/* Nominees List */}
                              {cat.nominees && cat.nominees.length > 0 && (
                                <div className="pt-1.5 border-t border-[#eceae4]/70 space-y-1">
                                  <span className="text-[10px] uppercase text-[#5f5f5d] font-semibold block">
                                    Nominados ({cat.nominees.length})
                                  </span>
                                  <div className="space-y-0.5">
                                    {cat.nominees.map((nom, nIdx) => (
                                      <div
                                        key={nIdx}
                                        className={`flex items-center justify-between text-[11px] py-0.5 ${
                                          nom.artistId === player.id ? 'font-bold text-purple-900' : 'text-[#5f5f5d]'
                                        }`}
                                      >
                                        <span>
                                          • {nom.artistName} {nom.itemTitle ? `("${nom.itemTitle}")` : ''}
                                        </span>
                                        {nom.artistId === player.id && (
                                          <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded-[3px] font-bold">
                                            Tú
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
