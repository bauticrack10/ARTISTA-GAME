import React, { useState, useMemo } from 'react';
import { activateOnKey } from '../utils/a11y';
import { WorldState, Artist, AwardCeremony, OfficialCertification } from '../types';
import { CertificationEngine } from '../systems/CertificationEngine';
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
    <div className="space-y-6 pb-12 text-[#F4F4F6]">
      {/* Header */}
      <div className="bg-[#111114] p-6 rounded-[6px] border border-[#242429] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs uppercase font-bold tracking-wider bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/40 px-2.5 py-0.5 rounded-[4px] font-mono">
              Academia Musical
            </span>
            <span className="text-xs text-[#8E8E99] font-mono">Premios Oficiales & Reconocimientos de la Industria</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F4F4F6] tracking-tight mt-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#F59E0B]" />
            Galas de Premiación & Vitrina de Trofeos
          </h1>
          <p className="text-xs text-[#8E8E99] mt-1 max-w-2xl leading-relaxed">
            Cada diciembre el jurado cierra planillas y vota las 8 ternas anuales cruzando cifras de ventas auditadas, recepción de la crítica e ingeniería de mezcla.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#09090B] px-4 py-2.5 rounded-[4px] border border-[#242429] text-center font-mono tabular-nums shadow-sm">
            <span className="text-2xs text-[#F59E0B] block uppercase tracking-wider font-bold">Estatuillas Ganadas</span>
            <span className="text-2xl font-bold text-[#F59E0B]">{player.awardsWon.length}</span>
          </div>
          <div className="bg-[#09090B] px-4 py-2.5 rounded-[4px] border border-[#242429] text-center font-mono tabular-nums shadow-sm">
            <span className="text-2xs text-[#8E8E99] block uppercase tracking-wider font-bold">Puntaje Legado</span>
            <span className="text-2xl font-bold text-[#F4F4F6]">{player.legacyScore}/100</span>
          </div>
        </div>
      </div>

      {/* Vitrina de Certificaciones Oficiales (Discos de Oro, Platino y Diamante) */}
      <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242429] pb-3">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-base font-bold text-[#F4F4F6]">
              Vitrina de Certificaciones Oficiales ({playerCerts.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8E8E99]">
            Umbrales oficiales: Oro (500k) • Platino (1M) • Diamante (10M)
          </span>
        </div>

        {playerCerts.length === 0 ? (
          <div className="p-8 rounded-[4px] bg-[#09090B] border border-[#242429] text-center space-y-2">
            <Disc3 className="w-8 h-8 text-[#52525B] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#F4F4F6]">Aún no posees certificaciones oficiales</p>
            <p className="text-xs text-[#8E8E99] max-w-md mx-auto">
              Tus sencillos y álbumes recibirán placas oficiales de Disco de Oro (500.000 streams), Platino (1.000.000) o Diamante (10.000.000) automáticamente a medida que acumulen reproducciones y ventas globales.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {playerCerts.map((cert) => {
              const styling = CertificationEngine.getCertificationStyling(cert.tier, cert.multiplier);
              return (
                <div
                  key={cert.id}
                  className={`p-4 rounded-[4px] border border-[#242429] bg-[#09090B] flex items-start justify-between gap-3 shadow-xs ${styling.frameClass}`}
                >
                  <div className="space-y-1 min-w-0">
                    <span className={`text-3xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] border ${styling.badgeClass}`}>
                      {styling.displayName}
                    </span>
                    <h3 className="text-sm font-bold text-[#F4F4F6] truncate mt-1">
                      {cert.targetTitle}
                    </h3>
                    <p className="text-2xs text-[#8E8E99] font-mono tabular-nums">
                      {cert.targetType === 'single' ? 'Sencillo Oficial' : 'Álbum / Proyecto'} • Año {cert.year}, M{cert.month}
                    </p>
                    <p className="text-2xs text-[#00E599] font-mono tabular-nums">
                      {(cert.unitsAchieved).toLocaleString('es-AR')} unidades acumuladas
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-full border border-[#242429] bg-[#18181C] flex items-center justify-center shrink-0">
                    <Disc3 className="w-5 h-5" style={{ color: styling.iconColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hall of Fame: All-Time Leaderboard */}
      {hallOfFame.length > 0 && (
        <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#242429] pb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-base font-bold text-[#F4F4F6]">
                Pabellón de la Fama (Hall of Fame)
              </h2>
            </div>
            <span className="text-xs text-[#8E8E99]">
              Artistas más galardonados en la historia del ecosistema
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {hallOfFame.map((artist, idx) => (
              <div
                key={artist.id}
                className={`p-3.5 rounded-[4px] border flex flex-col justify-between gap-2 text-xs transition-all ${
                  artist.isPlayer
                    ? 'bg-[#18181C] border-[#FF4F00]/50 shadow-sm'
                    : 'bg-[#09090B] border-[#242429]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono tabular-nums text-xs text-[#F59E0B] font-bold">
                    #{idx + 1}
                  </span>
                  {artist.isPlayer && (
                    <span className="text-2xs font-bold font-mono bg-[#FF4F00] text-white px-1.5 py-0.5 rounded-[4px]">
                      Tú
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-[#F4F4F6] truncate" title={artist.name}>
                    {artist.name}
                  </h3>
                  <p className="text-2xs text-[#8E8E99] truncate font-mono">
                    {artist.country} • {artist.careerStage}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#242429] flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="text-[#8E8E99]">Estatuillas:</span>
                  <span className="text-[#F59E0B] font-bold flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-[#F59E0B]" />
                    {artist.wins}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trophy Showcase of the Player */}
      <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242429] pb-3">
          <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <span>Vitrina Oficial de Trofeos de {player.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-[4px] bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/30 font-mono tabular-nums font-normal">
              {player.awardsWon.length}
            </span>
          </h2>
          <span className="text-xs text-[#8E8E99]">
            Galardones acumulados mediante mérito, crítica e impacto comercial
          </span>
        </div>

        {player.awardsWon.length === 0 ? (
          <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#F59E0B] mx-auto flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#F4F4F6]">Vitrina vacía por ahora</h3>
            <p className="text-xs text-[#8E8E99] max-w-md mx-auto leading-relaxed">
              Todavía no ganaste estatuillas. Las galas se celebran cada diciembre y premian discos aclamados por la crítica, hits y producciones de primer nivel.
            </p>
            {onNavigate && (
              <button
                onClick={() => onNavigate('studio')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold cursor-pointer transition-all active:translate-y-[1px]"
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
                  className="bg-[#09090B] p-4 rounded-[4px] border border-[#242429] flex items-start gap-3 hover:border-[#3F3F46] transition-all group shadow-sm"
                >
                  <div className="p-2.5 bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/30 rounded-[4px] shrink-0">
                    <CategoryIcon className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h3 className="font-bold text-xs text-[#F4F4F6] leading-tight truncate">
                      {awardName}
                    </h3>
                    <p className="text-xs text-[#8E8E99] truncate">
                      {structured?.itemTitle ? `Por "${structured.itemTitle}"` : 'Galardón de la Academia Musical'}
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-2xs font-mono tabular-nums font-bold text-[#F59E0B] bg-[#18181C] border border-[#F59E0B]/30 px-1.5 py-0.5 rounded-[4px]">
                        +6 Pts Legado
                      </span>
                      {structured?.winType && (
                        <span className="text-2xs font-mono text-[#8E8E99] bg-[#18181C] border border-[#242429] px-1.5 py-0.5 rounded-[4px]">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242429] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4F00]" />
              <span>Historial de Galas Anuales</span>
              <span className="text-xs px-2 py-0.5 rounded-[4px] bg-[#18181C] text-[#FF4F00] font-mono tabular-nums font-semibold border border-[#242429]">
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
              className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer border font-mono ${
                filterOnlyPlayerWins
                  ? 'bg-[#F4F4F6] text-[#09090B] font-bold border-[#F4F4F6]'
                  : 'bg-[#09090B] text-[#8E8E99] border-[#242429] hover:text-[#F4F4F6]'
              }`}
            >
              {filterOnlyPlayerWins ? '✓ Solo Mis Victorias' : 'Filtrar Mis Victorias'}
            </button>
          </div>
        </div>

        {ceremonies.length === 0 ? (
          <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#8E8E99] mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#F4F4F6]">Sin Galas Realizadas Aún</h3>
            <p className="text-xs text-[#8E8E99] max-w-md mx-auto leading-relaxed">
              La primera gala de premiaciones se celebrará automáticamente al finalizar el mes 12 del año actual. ¡Avanzá el ciclo temporal para vivir el evento!
            </p>
          </div>
        ) : filteredCeremonies.length === 0 ? (
          <div className="text-center py-8 text-[#8E8E99] text-xs font-mono">
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
                  className="bg-[#09090B] rounded-[6px] border border-[#242429] overflow-hidden transition-all shadow-sm"
                >
                  {/* Ceremony Header Row */}
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={activateOnKey}
                    onClick={() => setExpandedYear(isExpanded ? null : ceremony.year)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors border-b border-[#242429]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#18181C] rounded-[4px] border border-[#242429] text-[#F59E0B] shrink-0 font-mono font-bold text-xs tabular-nums">
                        {ceremony.year}
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-[#F4F4F6] flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#F59E0B]" />
                          {ceremony.name}
                        </h3>
                        <p className="text-xs text-[#8E8E99] mt-0.5 font-mono tabular-nums">
                          {ceremony.categories.length} Categorías Premiadas
                          {playerWinsInCeremony > 0 && (
                            <span className="text-[#00E599] font-bold ml-2">
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
                          className="flex items-center gap-1.5 bg-[#FF4F00] hover:bg-[#E04500] text-white font-bold px-3.5 py-1.5 rounded-[4px] text-xs transition-all cursor-pointer shadow-none active:translate-y-[1px]"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Revivir Gala Interactiva</span>
                        </button>
                      )}

                      <div className="p-1 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Categories Breakdown */}
                  {isExpanded && (
                    <div className="p-5 bg-[#111114] space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {ceremony.categories.map((cat, catIdx) => {
                          const isPlayerWinner = cat.winnerArtistId === player.id;
                          const isPlayerNominated = cat.nomineeArtistIds?.includes(player.id) || cat.nominees?.some(n => n.artistId === player.id) || false;
                          const CatIcon = getCategoryIcon(cat.name);

                          return (
                            <div
                              key={cat.id || catIdx}
                              className={`p-4 rounded-[4px] border text-xs space-y-2.5 transition-all ${
                                isPlayerWinner
                                  ? 'bg-[#18181C] border-[#00E599]/50 shadow-sm'
                                  : 'bg-[#09090B] border-[#242429]'
                              }`}
                            >
                              <div className="flex items-center justify-between border-b border-[#242429] pb-2">
                                <div className="flex items-center gap-1.5">
                                  <CatIcon className={`w-3.5 h-3.5 ${isPlayerWinner ? 'text-[#00E599]' : 'text-[#FF4F00]'}`} />
                                  <span className="font-bold text-xs text-[#F4F4F6]">
                                    {cat.name}
                                  </span>
                                </div>

                                {isPlayerWinner ? (
                                  <span className="font-bold font-mono text-[#00E599] bg-[#18181C] border border-[#00E599]/30 px-2 py-0.5 rounded-[4px] text-2xs">
                                    ¡Tu Victoria!
                                  </span>
                                ) : isPlayerNominated ? (
                                  <span className="font-bold font-mono text-[#8E8E99] bg-[#18181C] border border-[#242429] px-2 py-0.5 rounded-[4px] text-2xs">
                                    Nominado
                                  </span>
                                ) : null}
                              </div>

                              {/* Winner Showcase */}
                              <div className="space-y-0.5">
                                <span className="text-2xs font-bold font-mono uppercase text-[#8E8E99] tracking-wider block">
                                  Ganador Oficial
                                </span>
                                <p className="font-bold text-xs text-[#F4F4F6] flex items-center gap-1.5">
                                  <Trophy className="inline w-3.5 h-3.5 mr-1 align-[-2px] text-[#F59E0B]" aria-hidden="true" />{cat.winnerArtistName || world.artists[cat.winnerArtistId]?.name || 'Artista'}
                                  {cat.winnerItemTitle && (
                                    <span className="font-normal text-[#8E8E99]">
                                      — "{cat.winnerItemTitle}"
                                    </span>
                                  )}
                                </p>
                                {cat.winTypeLabel && (
                                  <span className="text-2xs font-mono text-[#F59E0B] bg-[#18181C] px-1.5 py-0.5 rounded-[4px] border border-[#F59E0B]/30 inline-block mt-0.5">
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
                                <div className="pt-2 border-t border-[#242429] space-y-1.5">
                                  <span className="text-2xs uppercase text-[#8E8E99] font-mono font-bold tracking-wider block">
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
                                              ? 'bg-[#18181C] border-[#F59E0B]/40 font-semibold text-[#F59E0B]'
                                              : isNomPlayer
                                              ? 'bg-[#18181C] border-[#FF4F00]/40 font-semibold text-[#FF4F00]'
                                              : 'bg-[#09090B] border-[#242429] text-[#8E8E99]'
                                          }`}
                                        >
                                          <div className="min-w-0 flex-1 truncate">
                                            <span className="font-mono tabular-nums text-2xs mr-1 text-[#FF4F00]">#{nIdx + 1}</span>
                                            <span className="text-[#F4F4F6]">
                                              {nom.itemTitle ? `"${nom.itemTitle}"` : nom.artistName}
                                            </span>
                                            {nom.itemTitle && (
                                              <span className="text-[#8E8E99] text-2xs ml-1 truncate">
                                                — {nom.artistName}
                                              </span>
                                            )}
                                          </div>
                                          {isNomPlayer && (
                                            <span className="text-2xs font-mono bg-[#FF4F00] text-white px-1.5 py-0.5 rounded-[4px] font-bold shrink-0">
                                              Tú
                                            </span>
                                          )}
                                          {isNomWinner && (
                                            <span className="text-2xs font-mono bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/40 px-1.5 py-0.5 rounded-[4px] font-bold shrink-0">
                                              <Trophy className="inline w-3.5 h-3.5 mr-1 align-[-2px] text-[#F59E0B]" aria-hidden="true" />Ganador
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
