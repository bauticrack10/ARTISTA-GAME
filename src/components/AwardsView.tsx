import React, { useState, useMemo } from 'react';
import { activateOnKey } from '../utils/a11y';
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
  CheckCircle2,
  TrendingUp,
  Flame,
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
    if (name.includes('Canción')) return Sparkles;
    if (name.includes('Nuevo') || name.includes('Revelación')) return Sparkles;
    if (name.includes('Colaboración')) return Crown;
    if (name.includes('Video') || name.includes('Visual')) return Play;
    if (name.includes('Producción') || name.includes('Urbana')) return Sliders;
    return Award;
  };

  // Compute Real All-Time Hall of Fame from verified ceremonies and artist awards (Zero fake math!)
  const hallOfFame = useMemo(() => {
    const artistMap = new Map<string, { name: string; wins: number; country: string; careerStage: string; isPlayer: boolean }>();

    // Seed from all artists' actual awardsWon
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

  return (
    <div
      className="space-y-6 pb-12 text-fg"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-sm">
              Academia Musical
            </span>
            <span className="text-xs text-fg-muted">Premios Oficiales & Reconocimientos de la Industria</span>
          </div>
          <h1 className="text-2xl font-semibold text-fg tracking-[-0.9px] mt-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Galas de Premiación & Vitrina de Trofeos
          </h1>
          <p className="text-xs text-fg-muted mt-1 max-w-2xl leading-relaxed">
            Cada diciembre la academia de la música evalúa el impacto comercial, trascendencia cultural,
            calidad crítica, composición y sofisticación técnica en las 8 categorías fundamentales inspiradas en los premios más prestigiosos del mundo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-canvas px-4 py-2.5 rounded-control border border-amber-500/30 text-center font-mono shadow-xs">
            <span className="text-2xs text-amber-400 block uppercase tracking-wider font-bold">Estatuillas Ganadas</span>
            <span className="text-2xl font-bold text-amber-300">{player.awardsWon.length}</span>
          </div>
          <div className="bg-canvas px-4 py-2.5 rounded-control border border-purple-500/30 text-center font-mono shadow-xs">
            <span className="text-2xs text-purple-400 block uppercase tracking-wider font-bold">Puntaje Legado</span>
            <span className="text-2xl font-bold text-purple-300">{player.legacyScore}/100</span>
          </div>
        </div>
      </div>

      {/* Hall of Fame: All-Time Leaderboard */}
      {hallOfFame.length > 0 && (
        <div className="bg-surface border border-line rounded-card p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-semibold text-fg">
                Pabellón de la Fama (Hall of Fame)
              </h2>
            </div>
            <span className="text-xs text-fg-muted">
              Artistas más galardonados en la historia del ecosistema
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {hallOfFame.map((artist, idx) => (
              <div
                key={artist.id}
                className={`p-3.5 rounded-control border flex flex-col justify-between gap-2 text-xs transition-all ${
                  artist.isPlayer
                    ? 'bg-purple-500/15 border-purple-500/50 shadow-sm ring-1 ring-purple-400'
                    : 'bg-canvas border-line'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-amber-400 font-bold">
                    #{idx + 1}
                  </span>
                  {artist.isPlayer && (
                    <span className="text-2xs font-bold bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded-sm">
                      Tú
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-fg truncate" title={artist.name}>
                    {artist.name}
                  </h3>
                  <p className="text-2xs text-fg-muted truncate">
                    {artist.country} • {artist.careerStage}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-fg-muted">Estatuillas:</span>
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    {artist.wins}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trophy Showcase of the Player */}
      <div className="bg-surface border border-line rounded-card p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
          <h2 className="text-base font-semibold text-fg flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Vitrina Oficial de Trofeos de {player.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-normal">
              {player.awardsWon.length}
            </span>
          </h2>
          <span className="text-xs text-fg-muted">
            Galardones acumulados mediante mérito, crítica e impacto comercial
          </span>
        </div>

        {player.awardsWon.length === 0 ? (
          <div className="bg-canvas border border-line rounded-xl p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-fg">Vitrina vacía por ahora</h3>
            <p className="text-xs text-fg-muted max-w-md mx-auto leading-relaxed">
              Todavía no ganaste estatuillas. Las galas se celebran cada diciembre y premian discos aclamados por la crítica, hits y producciones de primer nivel.
            </p>
            {onNavigate && (
              <button
                onClick={() => onNavigate('studio')}
                className="tap mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-strong text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                <Disc3 className="w-3.5 h-3.5" aria-hidden="true" />
                Ir al estudio a grabar
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {player.awardsWon.map((awardName, idx) => {
              const CategoryIcon = getCategoryIcon(awardName);
              const structured = player.awardsRecord?.find(r => awardName.includes(r.categoryName));

              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-[#16181F] to-[#1C1F2B] p-4 rounded-xl border border-amber-500/30 flex items-start gap-3 hover:border-amber-400/70 transition-all group shadow-xs"
                >
                  <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950 rounded-lg shrink-0 shadow-sm">
                    <CategoryIcon className="w-4 h-4 text-amber-950 fill-amber-950/20" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h3 className="font-bold text-xs text-fg leading-tight truncate">
                      {awardName}
                    </h3>
                    <p className="text-xs text-fg-muted truncate">
                      {structured?.itemTitle ? `Por "${structured.itemTitle}"` : 'Galardón de la Academia Musical'}
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-2xs font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded-sm">
                        +6 Pts Legado
                      </span>
                      {structured?.winType && (
                        <span className="text-2xs font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded-sm">
                          {structured.winType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History of Past Ceremonies */}
      <div className="bg-surface border border-line rounded-card p-6 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <h2 className="text-base font-semibold text-fg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Historial de Galas Anuales</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary-soft font-mono font-normal">
                {ceremonies.length}
              </span>
            </h2>
            <p className="text-xs text-fg-muted mt-0.5">
              Registro histórico oficial de nominaciones y ganadores en cada edición
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOnlyPlayerWins(!filterOnlyPlayerWins)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
                filterOnlyPlayerWins
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold border-amber-400 shadow-sm'
                  : 'bg-canvas text-fg-muted border border-line hover:text-fg hover:border-primary/40'
              }`}
            >
              {filterOnlyPlayerWins ? '✓ Solo Mis Victorias' : 'Filtrar Mis Victorias'}
            </button>
          </div>
        </div>

        {ceremonies.length === 0 ? (
          <div className="bg-canvas border border-line rounded-xl p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-fg">Sin Galas Realizadas Aún</h3>
            <p className="text-xs text-fg-muted max-w-md mx-auto leading-relaxed">
              La primera gala de premiaciones se celebrará automáticamente al finalizar el mes 12 del año actual. ¡Avanzá el ciclo temporal para vivir el evento!
            </p>
          </div>
        ) : filteredCeremonies.length === 0 ? (
          <div className="text-center py-8 text-fg-muted text-xs">
            No se encontraron ceremonias que coincidan con el filtro seleccionado.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCeremonies.map((ceremony) => {
              const isExpanded = expandedYear === ceremony.year;
              const playerWinsInCeremony = ceremony.categories.filter(c => c.winnerArtistId === player.id).length;
              const playerNomsInCeremony = ceremony.categories.filter(c => c.nomineeArtistIds?.includes(player.id) || c.nominees?.some(n => n.artistId === player.id) || false).length;

              return (
                <div
                  key={ceremony.year}
                  className="bg-canvas rounded-xl border border-line overflow-hidden transition-all shadow-sm"
                >
                  {/* Ceremony Header Row */}
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={activateOnKey}
                    onClick={() => setExpandedYear(isExpanded ? null : ceremony.year)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors border-b border-line"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/20 rounded-md border border-amber-500/30 text-amber-300 shrink-0 font-mono font-bold text-xs">
                        {ceremony.year}
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-400" />
                          {ceremony.name}
                        </h3>
                        <p className="text-xs text-fg-muted mt-0.5">
                          {ceremony.categories.length} Categorías Premiadas
                          {playerWinsInCeremony > 0 && (
                            <span className="text-amber-400 font-bold ml-2">
                              • {playerWinsInCeremony} Premio{playerWinsInCeremony > 1 ? 's' : ''} Ganado{playerWinsInCeremony > 1 ? 's' : ''}
                            </span>
                          )}
                          {playerWinsInCeremony === 0 && playerNomsInCeremony > 0 && (
                            <span className="text-purple-400 font-semibold ml-2">
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
                          className="flex items-center gap-1.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold px-3.5 py-1.5 rounded-md text-xs hover:opacity-90 active:opacity-75 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.35)]"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Revivir Gala Interactiva</span>
                        </button>
                      )}

                      <div className="p-1 rounded-sm hover:bg-line text-fg-muted">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Categories Breakdown */}
                  {isExpanded && (
                    <div className="p-5 bg-surface/70 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {ceremony.categories.map((cat, catIdx) => {
                          const isPlayerWinner = cat.winnerArtistId === player.id;
                          const isPlayerNominated = cat.nomineeArtistIds?.includes(player.id) || cat.nominees?.some(n => n.artistId === player.id) || false;
                          const CatIcon = getCategoryIcon(cat.name);

                          return (
                            <div
                              key={cat.id || catIdx}
                              className={`p-4 rounded-control border text-xs space-y-2.5 transition-all ${
                                isPlayerWinner
                                  ? 'bg-amber-500/10 border-amber-500/40 shadow-sm ring-1 ring-amber-500/40'
                                  : 'bg-canvas border-line'
                              }`}
                            >
                              <div className="flex items-center justify-between border-b border-line pb-2">
                                <div className="flex items-center gap-1.5">
                                  <CatIcon className={`w-3.5 h-3.5 ${isPlayerWinner ? 'text-amber-400' : 'text-primary'}`} />
                                  <span className="font-bold text-xs text-fg">
                                    {cat.name}
                                  </span>
                                </div>

                                {isPlayerWinner ? (
                                  <span className="font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-sm text-2xs">
                                    ¡Tu Victoria!
                                  </span>
                                ) : isPlayerNominated ? (
                                  <span className="font-bold text-purple-300 bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 rounded-sm text-2xs">
                                    Nominado
                                  </span>
                                ) : null}
                              </div>

                              {/* Winner Showcase */}
                              <div className="space-y-0.5">
                                <span className="text-2xs font-bold uppercase text-fg-muted tracking-wider block">
                                  Ganador Oficial
                                </span>
                                <p className="font-bold text-xs text-fg flex items-center gap-1.5">
                                  <Trophy className="inline w-3.5 h-3.5 mr-1 align-[-2px]" aria-hidden="true" />{cat.winnerArtistName || world.artists[cat.winnerArtistId]?.name || 'Artista'}
                                  {cat.winnerItemTitle && (
                                    <span className="font-normal text-fg-muted">
                                      — "{cat.winnerItemTitle}"
                                    </span>
                                  )}
                                </p>
                                {cat.winTypeLabel && (
                                  <span className="text-2xs font-mono text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-sm border border-amber-500/25 inline-block mt-0.5">
                                    {cat.winTypeLabel}
                                  </span>
                                )}
                                {cat.winnerReason && (
                                  <p className="text-xs text-fg-muted italic mt-1">
                                    {cat.winnerReason}
                                  </p>
                                )}
                              </div>

                              {/* Nominees Grid */}
                              {cat.nominees && cat.nominees.length > 0 && (
                                <div className="pt-2 border-t border-line space-y-1.5">
                                  <span className="text-2xs uppercase text-fg-muted font-bold tracking-wider block">
                                    Nominados • {cat.nominees.length}
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {cat.nominees.map((nom, nIdx) => {
                                      const isNomPlayer = nom.artistId === player.id || nom.isPlayer;
                                      const isNomWinner = nom.artistId === cat.winnerArtistId;
                                      return (
                                        <div
                                          key={nIdx}
                                          className={`p-2 rounded-md border text-xs flex items-center justify-between gap-1.5 transition-all ${
                                            isNomWinner
                                              ? 'bg-amber-500/10 border-amber-500/30 font-semibold text-amber-200'
                                              : isNomPlayer
                                              ? 'bg-purple-500/10 border-purple-500/30 font-semibold text-purple-200'
                                              : 'bg-surface border-line/80 text-fg-muted'
                                          }`}
                                        >
                                          <div className="min-w-0 flex-1 truncate">
                                            <span className="font-mono text-2xs mr-1 text-primary">#{nIdx + 1}</span>
                                            <span className="text-fg">
                                              {nom.itemTitle ? `"${nom.itemTitle}"` : nom.artistName}
                                            </span>
                                            {nom.itemTitle && (
                                              <span className="text-fg-muted text-2xs ml-1 truncate">
                                                — {nom.artistName}
                                              </span>
                                            )}
                                          </div>
                                          {isNomPlayer && (
                                            <span className="text-2xs bg-purple-500/25 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded-sm font-bold shrink-0">
                                              Tú
                                            </span>
                                          )}
                                          {isNomWinner && (
                                            <span className="text-2xs bg-amber-500/25 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-sm font-bold shrink-0">
                                              <Trophy className="inline w-3.5 h-3.5 mr-1 align-[-2px]" aria-hidden="true" />Ganador
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
