import React, { useState, useMemo } from 'react';
import { activateOnKey } from '../utils/a11y';
import { WorldState, Artist, AwardCeremony, OfficialCertification } from '../types';
import { CertificationEngine } from '../systems/CertificationEngine';
import {
  Award,
  Trophy,
  Music2,
  Star,
  Crown,
  Play,
  ChevronDown,
  ChevronUp,
  Disc3,
  Sliders,
  Calendar,
  Medal
} from 'lucide-react';

interface AwardsViewProps {
  world: WorldState;
  player: Artist;
  onOpenGala?: (ceremony: AwardCeremony) => void;
  onNavigate?: (tab: string) => void;
}

export const AwardsView: React.FC<AwardsViewProps> = ({ world, player, onOpenGala, onNavigate }) => {
  const ceremonies = world?.awardsHistory || [];
  const [expandedYear, setExpandedYear] = useState<number | null>(
    ceremonies.length > 0 ? ceremonies[0].year : null
  );
  const [filterOnlyPlayerWins, setFilterOnlyPlayerWins] = useState<boolean>(false);

  const filteredCeremonies = filterOnlyPlayerWins
    ? ceremonies.filter(c => c.categories.some(cat => cat.winnerArtistId === player?.id))
    : ceremonies;

  const getCategoryIcon = (name: string) => {
    if (name.includes('Álbum')) return Trophy;
    if (name.includes('Grabación')) return Disc3;
    if (name.includes('Canción')) return Music2;
    if (name.includes('Nuevo') || name.includes('Revelación')) return Star;
    if (name.includes('Colaboración')) return Crown;
    if (name.includes('Video') || name.includes('Visual')) return Play;
    if (name.includes('Producción') || name.includes('Urbana')) return Sliders;
    return Award;
  };

  const hallOfFame = useMemo(() => {
    const artistMap = new Map<string, { name: string; wins: number; country: string; careerStage: string; isPlayer: boolean }>();

    for (const art of Object.values(world?.artists || {}) as Artist[]) {
      if (art.awardsWon && art.awardsWon.length > 0) {
        artistMap.set(art.id, {
          name: art.name,
          wins: art.awardsWon.length,
          country: art.country,
          careerStage: art.careerStage,
          isPlayer: art.isPlayer
        });
      }
    }

    return Array.from(artistMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 5);
  }, [world?.artists, ceremonies]);

  const playerCerts = useMemo(() => {
    const list: OfficialCertification[] = [...(player.officialCertifications || [])];
    const seen = new Set(list.map(c => c.id));

    Object.values(world.songs || {}).forEach(s => {
      if (s.artistId === player.id && s.certifications) {
        s.certifications.forEach(c => {
          if (!seen.has(c.id)) {
            seen.add(c.id);
            list.push(c);
          }
        });
      }
    });

    Object.values(world.albums || {}).forEach(a => {
      if (a.artistId === player.id && a.certifications) {
        a.certifications.forEach(c => {
          if (!seen.has(c.id)) {
            seen.add(c.id);
            list.push(c);
          }
        });
      }
    });

    return list.sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month));
  }, [player, world]);

  return (
    <div className="space-y-5 pb-12 font-sans text-[#F4F0EA]">
      {/* Compact Header */}
      <div className="liquid-glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs uppercase font-bold tracking-wider liquid-glass-pill text-[#F59E0B] border border-[#F59E0B]/40 px-2 py-0.5 rounded-[4px]">
              Academia Musical
            </span>
            <span className="text-xs text-[#8E8E99]">Galas Anuales • Diciembre</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-[#F4F0EA] tracking-tight mt-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#F59E0B]" strokeWidth={1.75} />
            Premios & Vitrina Oficial
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 tabular-nums">
          <div className="liquid-glass-pill px-3.5 py-2 text-center">
            <span className="text-2xs text-[#F59E0B] block uppercase tracking-wider font-bold">Estatuillas</span>
            <span className="text-xl font-bold text-[#F59E0B]">{player.awardsWon.length}</span>
          </div>
          <div className="liquid-glass-pill px-3.5 py-2 text-center">
            <span className="text-2xs text-[#8E8E99] block uppercase tracking-wider font-bold">Discos Oro/Plat.</span>
            <span className="text-xl font-bold text-[#F4F0EA]">{playerCerts.length}</span>
          </div>
          <div className="liquid-glass-pill px-3.5 py-2 text-center">
            <span className="text-2xs text-[#8E8E99] block uppercase tracking-wider font-bold">Legado</span>
            <span className="text-xl font-bold text-[#F4F0EA]">{player.legacyScore}/100</span>
          </div>
        </div>
      </div>

      {/* Compact Top Showcase: Player Trophies + Certifications + Hall of Fame */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Vitrina de Trofeos de la Academia */}
        <div className="liquid-glass-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#26262B] pb-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F4F0EA] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.75} />
              <span>Trofeos de {player.name} ({player.awardsWon.length})</span>
            </h2>
            {player.awardsWon.length === 0 && onNavigate && (
              <button
                onClick={() => onNavigate('studio')}
                className="text-2xs font-bold text-[#FF2A4B] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Disc3 className="w-3 h-3" strokeWidth={1.75} />
                Ir al Estudio
              </button>
            )}
          </div>

          {player.awardsWon.length === 0 ? (
            <div className="px-3.5 py-3 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] text-xs text-[#8E8E99] flex items-center justify-between gap-2">
              <span>Sin estatuillas aún. Las galas premian cada mes 12.</span>
              <span className="text-2xs uppercase font-bold text-[#52525B] shrink-0">+6 Legado c/u</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {player.awardsWon.map((awardName, idx) => {
                const CategoryIcon = getCategoryIcon(awardName);
                const structured = player.awardsRecord?.find(r => awardName.includes(r.categoryName));

                return (
                  <div
                    key={idx}
                    className="bg-[#0B0B0C] p-3 rounded-[4px] border border-[#26262B] flex items-start gap-2.5 hover:border-[#3F3F46] transition-all"
                  >
                    <div className="p-2 bg-[#1C1C21] text-[#F59E0B] border border-[#F59E0B]/30 rounded-[4px] shrink-0">
                      <CategoryIcon className="w-3.5 h-3.5 text-[#F59E0B]" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-xs text-[#F4F0EA] truncate">{awardName}</h3>
                      <p className="text-2xs text-[#8E8E99] truncate">
                        {structured?.itemTitle ? `"${structured.itemTitle}"` : 'Academia Musical'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Certificaciones Oficiales (Oro / Platino / Diamante) */}
        <div className="liquid-glass-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#26262B] pb-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F4F0EA] flex items-center gap-2">
              <Medal className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.75} />
              <span>Certificaciones Oficiales ({playerCerts.length})</span>
            </h2>
            <span className="text-2xs text-[#8E8E99] tabular-nums">
              Oro 500k • Platino 1M • Diamante 10M
            </span>
          </div>

          {playerCerts.length === 0 ? (
            <div className="px-3.5 py-3 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] text-xs text-[#8E8E99]">
              Tus sencillos y álbumes reciben placas automáticamente al superar 500k, 1M y 10M de reproducciones.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {playerCerts.map((cert) => {
                const styling = CertificationEngine.getCertificationStyling(cert.tier, cert.multiplier);
                return (
                  <div
                    key={cert.id}
                    className={`p-3 rounded-[4px] border border-[#26262B] bg-[#0B0B0C] flex items-center justify-between gap-2.5 ${styling.frameClass}`}
                  >
                    <div className="min-w-0">
                      <span className={`text-3xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] border ${styling.badgeClass}`}>
                        {styling.displayName}
                      </span>
                      <h3 className="text-xs font-bold text-[#F4F0EA] truncate mt-1">
                        {cert.targetTitle}
                      </h3>
                      <p className="text-2xs text-[#10B981] tabular-nums">
                        {cert.unitsAchieved.toLocaleString('es-AR')} u. • {cert.year}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-[4px] border border-[#26262B] bg-[#1C1C21] flex items-center justify-center shrink-0">
                      <Disc3 className="w-4 h-4" style={{ color: styling.iconColor }} strokeWidth={1.75} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Compact Hall of Fame Bar */}
      {hallOfFame.length > 0 && (
        <div className="liquid-glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F4F0EA] flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.75} />
              Pabellón de la Fama (Top 5 Histórico)
            </h2>
            <span className="text-2xs text-[#8E8E99]">Más galardonados del ecosistema</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {hallOfFame.map((artist, idx) => (
              <div
                key={artist.id}
                className={`px-3 py-2.5 rounded-[4px] border flex items-center justify-between gap-2 text-xs ${
                  artist.isPlayer
                    ? 'bg-[#1C1C21] border-[#FF2A4B]/60'
                    : 'bg-[#0B0B0C] border-[#26262B]'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="tabular-nums text-2xs text-[#F59E0B] font-bold">#{idx + 1}</span>
                    <span className="font-bold text-[#F4F0EA] truncate" title={artist.name}>{artist.name}</span>
                  </div>
                  <span className="text-2xs text-[#8E8E99] truncate block">{artist.country}</span>
                </div>

                <span className="text-[#F59E0B] font-bold tabular-nums flex items-center gap-1 shrink-0">
                  <Trophy className="w-3 h-3 text-[#F59E0B]" strokeWidth={1.75} />
                  {artist.wins}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History of Past Ceremonies (Intact) */}
      <div className="liquid-glass-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26262B] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#F4F0EA] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FF2A4B]" strokeWidth={1.75} />
              <span>Historial de Galas Anuales</span>
              <span className="text-xs px-2 py-0.5 rounded-[4px] bg-[#1C1C21] text-[#FF2A4B] tabular-nums font-semibold border border-[#26262B]">
                {ceremonies.length}
              </span>
            </h2>
            <p className="text-xs text-[#8E8E99] mt-0.5">
              Registro histórico oficial de nominaciones y ganadores en cada edición
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOnlyPlayerWins(!filterOnlyPlayerWins)}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer border ${
                filterOnlyPlayerWins
                  ? 'bg-[#FF2A4B] text-[#F4F0EA] font-bold border-[#FF2A4B]'
                  : 'bg-[#0B0B0C] text-[#8E8E99] border-[#26262B] hover:text-[#F4F0EA]'
              }`}
            >
              {filterOnlyPlayerWins ? '✓ Solo Mis Victorias' : 'Filtrar Mis Victorias'}
            </button>
          </div>
        </div>

        {ceremonies.length === 0 ? (
          <div className="bg-[#0B0B0C] border border-[#26262B] rounded-[4px] p-6 text-center space-y-1.5">
            <Calendar className="w-5 h-5 text-[#8E8E99] mx-auto" strokeWidth={1.75} />
            <h3 className="text-sm font-semibold text-[#F4F0EA]">Sin Galas Realizadas Aún</h3>
            <p className="text-xs text-[#8E8E99] max-w-md mx-auto">
              La primera ceremonia anual se celebra automáticamente al finalizar el mes 12.
            </p>
          </div>
        ) : filteredCeremonies.length === 0 ? (
          <div className="text-center py-6 text-[#8E8E99] text-xs">
            No se encontraron ceremonias que coincidan con el filtro seleccionado.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCeremonies.map((ceremony) => {
              const isExpanded = expandedYear === ceremony.year;
              const playerWinsInCeremony = ceremony.categories.filter(c => c.winnerArtistId === player.id).length;
              const playerNomsInCeremony = ceremony.categories.filter(c => c.nomineeArtistIds?.includes(player.id) || c.nominees?.some(n => n.artistId === player.id) || false).length;

              return (
                <div
                  key={ceremony.year}
                  className="bg-[#0B0B0C] rounded-[6px] border border-[#26262B] overflow-hidden transition-all"
                >
                  {/* Ceremony Header Row */}
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={activateOnKey}
                    onClick={() => setExpandedYear(isExpanded ? null : ceremony.year)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#1C1C21] transition-colors border-b border-[#26262B]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#1C1C21] rounded-[4px] border border-[#26262B] text-[#F59E0B] shrink-0 font-bold text-xs tabular-nums">
                        {ceremony.year}
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-[#F4F0EA] flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.75} />
                          {ceremony.name}
                        </h3>
                        <p className="text-xs text-[#8E8E99] mt-0.5 tabular-nums">
                          {ceremony.categories.length} Categorías Premiadas
                          {playerWinsInCeremony > 0 && (
                            <span className="text-[#10B981] font-bold ml-2">
                              • {playerWinsInCeremony} Premio{playerWinsInCeremony > 1 ? 's' : ''} Ganado{playerWinsInCeremony > 1 ? 's' : ''}
                            </span>
                          )}
                          {playerWinsInCeremony === 0 && playerNomsInCeremony > 0 && (
                            <span className="text-[#8E8E99] font-semibold ml-2">
                              • {playerNomsInCeremony} Nominación{playerNomsInCeremony > 1 ? 'es' : ''}
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
                          className="flex items-center gap-1.5 bg-[#FF2A4B] hover:bg-[#E02040] text-[#F4F0EA] font-bold px-3.5 py-1.5 rounded-[4px] text-xs transition-all cursor-pointer active:translate-y-[1px]"
                        >
                          <Play className="w-3 h-3 fill-current" strokeWidth={1.75} />
                          <span>Revivir Gala Interactiva</span>
                        </button>
                      )}

                      <div className="p-1 rounded-[4px] hover:bg-[#1C1C21] text-[#8E8E99]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" strokeWidth={1.75} /> : <ChevronDown className="w-4 h-4" strokeWidth={1.75} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Categories Breakdown */}
                  {isExpanded && (
                    <div className="p-4 bg-[#141417] space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ceremony.categories.map((cat, catIdx) => {
                          const isPlayerWinner = cat.winnerArtistId === player.id;
                          const isPlayerNominated = cat.nomineeArtistIds?.includes(player.id) || cat.nominees?.some(n => n.artistId === player.id) || false;
                          const CatIcon = getCategoryIcon(cat.name);

                          return (
                            <div
                              key={cat.id || catIdx}
                              className={`p-3.5 rounded-[4px] border text-xs space-y-2 transition-all ${
                                isPlayerWinner
                                  ? 'bg-[#1C1C21] border-[#10B981]/50'
                                  : 'bg-[#0B0B0C] border-[#26262B]'
                              }`}
                            >
                              <div className="flex items-center justify-between border-b border-[#26262B] pb-2">
                                <div className="flex items-center gap-1.5">
                                  <CatIcon className={`w-3.5 h-3.5 ${isPlayerWinner ? 'text-[#10B981]' : 'text-[#FF2A4B]'}`} strokeWidth={1.75} />
                                  <span className="font-bold text-xs text-[#F4F0EA]">
                                    {cat.name}
                                  </span>
                                </div>

                                {isPlayerWinner ? (
                                  <span className="font-bold text-[#10B981] bg-[#1C1C21] border border-[#10B981]/30 px-2 py-0.5 rounded-[4px] text-2xs">
                                    ¡Tu Victoria!
                                  </span>
                                ) : isPlayerNominated ? (
                                  <span className="font-bold text-[#8E8E99] bg-[#1C1C21] border border-[#26262B] px-2 py-0.5 rounded-[4px] text-2xs">
                                    Nominado
                                  </span>
                                ) : null}
                              </div>

                              {/* Winner Showcase */}
                              <div className="space-y-0.5">
                                <span className="text-2xs font-bold uppercase text-[#8E8E99] tracking-wider block">
                                  Ganador Oficial
                                </span>
                                <p className="font-bold text-xs text-[#F4F0EA] flex items-center gap-1.5">
                                  <Trophy className="inline w-3.5 h-3.5 mr-1 align-[-2px] text-[#F59E0B]" strokeWidth={1.75} aria-hidden="true" />
                                  {cat.winnerArtistName || world.artists[cat.winnerArtistId]?.name || 'Artista'}
                                  {cat.winnerItemTitle && (
                                    <span className="font-normal text-[#8E8E99]">
                                      — "{cat.winnerItemTitle}"
                                    </span>
                                  )}
                                </p>
                                {cat.winTypeLabel && (
                                  <span className="text-2xs text-[#F59E0B] bg-[#1C1C21] px-1.5 py-0.5 rounded-[4px] border border-[#F59E0B]/30 inline-block mt-0.5">
                                    {cat.winTypeLabel}
                                  </span>
                                )}
                                {cat.winnerReason && (
                                  <p className="text-xs text-[#8E8E99] italic mt-1">
                                    {cat.winnerReason}
                                  </p>
                                )}
                              </div>

                              {/* Nominees Grid */}
                              {cat.nominees && cat.nominees.length > 0 && (
                                <div className="pt-2 border-t border-[#26262B] space-y-1.5">
                                  <span className="text-2xs uppercase text-[#8E8E99] font-bold tracking-wider block tabular-nums">
                                    Nominados • {cat.nominees.length}
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {cat.nominees.map((nom, nIdx) => {
                                      const isNomPlayer = nom.artistId === player.id || nom.isPlayer;
                                      const isNomWinner = nom.artistId === cat.winnerArtistId;
                                      return (
                                        <div
                                          key={nIdx}
                                          className={`p-2 rounded-[4px] border text-xs flex items-center justify-between gap-1.5 transition-all ${
                                            isNomWinner
                                              ? 'bg-[#1C1C21] border-[#F59E0B]/40 font-semibold text-[#F59E0B]'
                                              : isNomPlayer
                                              ? 'bg-[#1C1C21] border-[#FF2A4B]/40 font-semibold text-[#FF2A4B]'
                                              : 'bg-[#0B0B0C] border-[#26262B] text-[#8E8E99]'
                                          }`}
                                        >
                                          <div className="min-w-0 flex-1 truncate">
                                            <span className="tabular-nums text-2xs mr-1 text-[#FF2A4B]">#{nIdx + 1}</span>
                                            <span className="text-[#F4F0EA]">
                                              {nom.itemTitle ? `"${nom.itemTitle}"` : nom.artistName}
                                            </span>
                                            {nom.itemTitle && (
                                              <span className="text-[#8E8E99] text-2xs ml-1 truncate">
                                                — {nom.artistName}
                                              </span>
                                            )}
                                          </div>
                                          {isNomPlayer && (
                                            <span className="text-2xs bg-[#FF2A4B] text-[#F4F0EA] px-1.5 py-0.5 rounded-[4px] font-bold shrink-0">
                                              Tú
                                            </span>
                                          )}
                                          {isNomWinner && (
                                            <span className="text-2xs bg-[#1C1C21] text-[#F59E0B] border border-[#F59E0B]/40 px-1.5 py-0.5 rounded-[4px] font-bold shrink-0">
                                              <Trophy className="inline w-3 h-3 mr-1 align-[-2px] text-[#F59E0B]" strokeWidth={1.75} aria-hidden="true" />
                                              Ganador
                                            </span>
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
