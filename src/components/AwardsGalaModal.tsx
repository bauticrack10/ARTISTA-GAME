import React from 'react';
import { AwardCeremony, Artist } from '../types';
import {
  Trophy,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  PartyPopper,
  Calendar,
  X,
  Star
} from 'lucide-react';
import { useAwardsGala } from '../hooks/useAwardsGala';

export interface AwardsGalaModalProps {
  ceremony: AwardCeremony;
  player: Artist;
  onClose: () => void;
}

export const AwardsGalaModal: React.FC<AwardsGalaModalProps> = ({
  ceremony,
  player,
  onClose
}) => {
  const {
    categories,
    currentCategoryIndex,
    currentCategory,
    revealedCategories,
    isCurrentRevealed,
    allRevealed,
    showSummary,
    playerTotalNominations,
    playerTotalWins,
    temporality,
    getCategoryIcon,
    handleRevealWinner,
    handleRevealAll,
    handleNextCategory,
    handlePrevCategory,
    handleSelectCategory,
    setShowSummary
  } = useAwardsGala({
    ceremony,
    player
  });

  const CategoryIcon = currentCategory ? getCategoryIcon(currentCategory.name) : Trophy;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="awards-gala-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div
        className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#F8FAFC] shadow-2xl"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Modal Header: Contextual Temporality & Performance Summary */}
        <div className="p-5 sm:p-6 border-b border-[#2A2E3D] bg-[#16181F] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-[8px] bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-sm">
              <Trophy className="w-5 h-5 text-amber-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1 shadow-xs">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  {temporality.yearEndBadge}
                </span>
                <span className="text-[11px] text-[#94A3B8] hidden sm:inline">
                  {temporality.galaSubtitle}
                </span>
              </div>
              <h2
                id="awards-gala-title"
                className="text-lg sm:text-xl font-semibold tracking-[-0.8px] text-[#F8FAFC] truncate"
              >
                {ceremony.name || `Premios Pulso & Vanguardia ${ceremony.year}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Player Nominations / Wins Pill */}
            <div className="bg-[#0B0C10] px-3 py-1 rounded-[6px] border border-[#2A2E3D] text-xs font-mono hidden xs:flex items-center gap-1.5">
              <span className="text-[#94A3B8]">Nominaciones:</span>
              <strong className="text-purple-400 font-bold">{playerTotalNominations}</strong>
              <span className="text-[#2A2E3D]">|</span>
              <span className="text-[#94A3B8]">Victorias:</span>
              <strong className="text-amber-400 font-bold">{playerTotalWins}</strong>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[6px] hover:bg-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              title="Cerrar Gala"
              aria-label="Cerrar Gala"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Category Presenter or Final Summary */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Category Tabs Indicator */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#2A2E3D] scrollbar-none">
            {categories.map((cat, idx) => {
              const isRevealed = !!revealedCategories[idx];
              const isCurrent = !showSummary && currentCategoryIndex === idx;
              const isPlayerWinner = cat.winnerArtistId === player.id || cat.playerWon;
              const Icon = getCategoryIcon(cat.name);

              return (
                <button
                  key={cat.id || `tab-${idx}`}
                  onClick={() => handleSelectCategory(idx)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                      : isRevealed
                      ? 'bg-[#0B0C10] text-[#F8FAFC] border border-amber-500/30 hover:bg-[#16181F]'
                      : 'bg-[#0B0C10] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#16181F] border border-[#2A2E3D]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  {isRevealed && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPlayerWinner ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                      }`}
                      title={isPlayerWinner ? '¡Victoria obtenida!' : 'Ganador revelado'}
                    />
                  )}
                </button>
              );
            })}

            <button
              onClick={() => setShowSummary(true)}
              className={`px-3 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                showSummary
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold border border-amber-400 shadow-sm'
                  : 'bg-[#0B0C10] border border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resumen Final</span>
            </button>
          </div>

          {/* VIEW 1: SUMMARY OF THE GALA */}
          {showSummary ? (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-br from-[#16181F] to-[#1C1F2B] border border-amber-500/30 rounded-[12px] p-5 sm:p-6 text-center space-y-3 shadow-md">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950 mx-auto flex items-center justify-center shadow-md">
                  <Trophy className="w-7 h-7 text-stone-950" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#F8FAFC]">
                    Balance de la Gala para {player.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {temporality.yearEndBadge} • Premios Oficiales de la Industria
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono max-w-lg mx-auto">
                  <div className="bg-[#0B0C10] p-3 rounded-[8px] border border-purple-500/30">
                    <span className="text-[10px] uppercase text-purple-400 font-bold block">Nominaciones</span>
                    <span className="text-xl font-bold text-purple-300">
                      {playerTotalNominations}
                    </span>
                  </div>
                  <div className="bg-[#0B0C10] p-3 rounded-[8px] border border-amber-500/30">
                    <span className="text-[10px] uppercase text-amber-400 font-bold block">Estatuillas</span>
                    <span className="text-xl font-bold text-amber-300">
                      {playerTotalWins}
                    </span>
                  </div>
                  <div className="bg-[#0B0C10] p-3 rounded-[8px] border border-emerald-500/30 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase text-emerald-400 font-bold block">Puntaje Legado</span>
                    <span className="text-xl font-bold text-emerald-300">
                      {player.legacyScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* List of All Winners in this Ceremony */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase text-[#94A3B8] tracking-wider">
                  Cuadro de Honor Oficial • Edición {ceremony.year}
                </h4>
                <div className="space-y-2">
                  {categories.map((cat, idx) => {
                    const isPlayerWinner = cat.winnerArtistId === player.id || cat.playerWon;
                    const itemTitle = cat.winnerItemTitle ? `"${cat.winnerItemTitle}"` : '';

                    return (
                      <div
                        key={cat.id || `summary-cat-${idx}`}
                        className={`p-3.5 rounded-[10px] border flex items-center justify-between gap-3 text-xs ${
                          isPlayerWinner
                            ? 'bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-400 shadow-sm'
                            : 'bg-[#0B0C10] border-[#2A2E3D]'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase text-[#94A3B8] block tracking-wide">
                            {cat.name}
                          </span>
                          <p className="font-bold text-sm text-[#F8FAFC] flex items-center gap-1.5 truncate">
                            <span>🏆 {cat.winnerArtistName}</span>
                            {itemTitle && <span className="font-normal text-[#94A3B8] truncate">— {itemTitle}</span>}
                          </p>
                          {cat.winnerReason && (
                            <p className="text-[11px] text-[#94A3B8] italic truncate">
                              {cat.winnerReason}
                            </p>
                          )}
                        </div>

                        {isPlayerWinner && (
                          <div className="shrink-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 border border-amber-400 px-2.5 py-1 rounded-[6px] font-extrabold text-[10px] shadow-xs">
                            ¡TU VICTORIA! 🏆
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : currentCategory ? (
            /* VIEW 2: SINGLE CATEGORY PRESENTATION CARD */
            <div className="bg-[#0B0C10] border border-amber-500/30 rounded-[12px] p-5 sm:p-6 space-y-5 shadow-sm">
              {/* Category Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
                      Categoría {currentCategoryIndex + 1} de {categories.length}
                    </span>
                    {(currentCategory.playerNominated || currentCategory.nomineeArtistIds.includes(player.id)) && (
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ¡Estás Nominado!
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.9px] text-[#F8FAFC] flex items-center gap-2">
                    <CategoryIcon className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="truncate">{currentCategory.name}</span>
                  </h3>
                  {currentCategory.description && (
                    <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                      {currentCategory.description}
                    </p>
                  )}
                </div>

                {!isCurrentRevealed ? (
                  <button
                    onClick={() => handleRevealWinner(currentCategoryIndex)}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 border border-amber-300 px-4 py-2 rounded-[6px] text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-amber-950 animate-pulse" />
                    <span>Revelar Ganador</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-[6px] border border-emerald-500/40 font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ganador Revelado</span>
                  </div>
                )}
              </div>

              {/* Nominees Grid (4 items: 2x2 on sm/desktop, 1x4 on mobile) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                    <span>Artistas y Obras Nominadas</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] bg-[#16181F] border border-[#2A2E3D] text-[#F8FAFC]">
                      {currentCategory.nominees?.length || currentCategory.nomineeArtistIds.length}
                    </span>
                  </span>
                  {isCurrentRevealed && (
                    <span className="text-[10px] text-amber-400 font-medium italic">
                      ★ Ganador oficial destacado
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentCategory.nominees || []).map((nominee, nIdx) => {
                    const isWinner = isCurrentRevealed && nominee.artistId === currentCategory.winnerArtistId;
                    const isPlayerNominee = nominee.artistId === player.id || nominee.isPlayer;

                    return (
                      <div
                        key={nominee.artistId + (nominee.itemId || '') + nIdx}
                        className={`p-3.5 rounded-[10px] border transition-all flex flex-col justify-between gap-2.5 ${
                          isWinner
                            ? 'bg-amber-500/15 border-amber-500/50 ring-2 ring-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                            : isPlayerNominee
                            ? 'bg-purple-500/15 border-purple-500/40 shadow-xs'
                            : 'bg-[#16181F] border-[#2A2E3D] hover:border-[#2A2E3D]/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <span
                              className={`w-6 h-6 rounded-[6px] flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                                isWinner
                                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-500 text-stone-950 border-amber-400 shadow-xs'
                                  : isPlayerNominee
                                  ? 'bg-purple-500/25 text-purple-300 border-purple-500/40'
                                  : 'bg-[#0B0C10] text-[#94A3B8] border-[#2A2E3D]'
                              }`}
                            >
                              {isWinner ? '🏆' : `#${nIdx + 1}`}
                            </span>

                            <div className="min-w-0 flex-1">
                              {nominee.itemTitle ? (
                                <>
                                  <h4 className="text-xs font-bold text-[#F8FAFC] truncate" title={nominee.itemTitle}>
                                    "{nominee.itemTitle}"
                                  </h4>
                                  <p className="text-[11px] text-[#94A3B8] truncate mt-0.5" title={nominee.artistName}>
                                    {nominee.artistName}
                                  </p>
                                </>
                              ) : (
                                <h4 className="text-xs font-bold text-[#F8FAFC] truncate" title={nominee.artistName}>
                                  {nominee.artistName}
                                </h4>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isPlayerNominee && (
                              <span className="text-[9px] font-bold bg-purple-500/25 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded-[4px] shadow-xs">
                                TÚ
                              </span>
                            )}
                            {isWinner && (
                              <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold border border-amber-400 shadow-xs animate-pulse">
                                <Trophy className="w-3 h-3 text-amber-950" />
                                <span>GANADOR</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Footer: Highlight stats / metadata */}
                        {(nominee.highlightText || nominee.producerName) && (
                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#94A3B8]">
                            <span className="truncate" title={nominee.highlightText || `Prod: ${nominee.producerName}`}>
                              {nominee.highlightText || (nominee.producerName ? `Producción: ${nominee.producerName}` : '')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Winner Announcement Card if revealed */}
              {isCurrentRevealed && (
                <div
                  className={`p-4 sm:p-5 rounded-[12px] border mt-4 animate-fade-in ${
                    currentCategory.winnerArtistId === player.id || currentCategory.playerWon
                      ? 'bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-yellow-500/10 border-amber-500/50 text-amber-200 ring-2 ring-amber-400 shadow-lg'
                      : 'bg-[#16181F] border-[#2A2E3D] text-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-[8px] flex items-center justify-center shrink-0 ${
                        currentCategory.winnerArtistId === player.id || currentCategory.playerWon
                          ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950 shadow-md'
                          : 'bg-[#0B0C10] border border-[#2A2E3D] text-amber-400'
                      }`}
                    >
                      <Trophy className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[4px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Estatuilla Oficial de la Academia
                        </span>
                        {(currentCategory.winnerArtistId === player.id || currentCategory.playerWon) && (
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/25 border border-amber-400/50 px-2 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs">
                            <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                            ¡FELICIDADES! HAS GANADO ESTA CATEGORÍA
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-semibold tracking-tight text-[#F8FAFC] truncate">
                        {currentCategory.winnerItemTitle ? `"${currentCategory.winnerItemTitle}" — ` : ''}
                        {currentCategory.winnerArtistName}
                      </h4>

                      {currentCategory.winnerReason && (
                        <p className="text-xs text-[#94A3B8] leading-relaxed italic">
                          "{currentCategory.winnerReason}"
                        </p>
                      )}

                      {(currentCategory.winnerArtistId === player.id || currentCategory.playerWon) && (
                        <div className="pt-2 flex items-center gap-2 flex-wrap font-mono text-[11px]">
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-[4px] font-bold">
                            +5 Pts de Legado
                          </span>
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-[4px] font-bold">
                            +Hype & Reputación
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="p-4 sm:p-5 border-t border-[#2A2E3D] bg-[#16181F] flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevCategory}
              disabled={!showSummary && currentCategoryIndex === 0}
              className="px-3.5 py-1.5 rounded-[6px] text-xs font-semibold bg-[#0B0C10] text-[#F8FAFC] border border-[#2A2E3D] hover:bg-[#2A2E3D] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              onClick={handleNextCategory}
              disabled={showSummary}
              className="px-3.5 py-1.5 rounded-[6px] text-xs font-semibold bg-[#0B0C10] text-[#F8FAFC] border border-[#2A2E3D] hover:bg-[#2A2E3D] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{currentCategoryIndex < categories.length - 1 ? 'Siguiente' : 'Ver Resumen'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!allRevealed && !showSummary && (
              <button
                onClick={handleRevealAll}
                className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] underline cursor-pointer font-semibold"
              >
                Revelar Todas las Categorías
              </button>
            )}

            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold px-5 py-2 rounded-[6px] text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Concluir Gala y Guardar Trofeos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
