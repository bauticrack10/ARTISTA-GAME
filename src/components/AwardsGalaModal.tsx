import React from 'react';
import { activateOnKey } from '../utils/a11y';
import { AwardCeremony, Artist, AwardNominee } from '../types';
import {
  Trophy,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  PartyPopper,
  Calendar,
  X,
  Star,
  Flame,
  Award,
  ShieldAlert,
  Quote,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useAwardsGala, CeremonyPhase } from '../hooks/useAwardsGala';

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
    categoryPhase,
    revealedCategories,
    isCurrentRevealed,
    allRevealed,
    showSummary,
    selectedNomineeIndex,
    playerTotalNominations,
    playerTotalWins,
    temporality,
    getCategoryIcon,
    setCategoryPhase,
    setSelectedNomineeIndex,
    handleAdvancePhase,
    handleOpenEnvelope,
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

  // Determine field badge label & styling
  const getFieldBadge = (field?: string) => {
    switch (field) {
      case 'general':
        return { label: 'Campo General', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'genre':
        return { label: 'Categoría de Género', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'craft':
        return { label: 'Técnica & Sonido', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      default:
        return { label: 'Especialidad', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
  };

  const fieldBadge = getFieldBadge(currentCategory?.field);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="awards-gala-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className="bg-[#111114] border border-[#242429] rounded-[6px] max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden text-[#F4F4F6] shadow-2xl"
      >
        {/* Modal Header: Contextual Temporality & Performance Summary */}
        <div className="p-5 sm:p-6 border-b border-[#242429] bg-[#111114] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-[4px] bg-[#F59E0B] text-[#09090B] flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-2xs uppercase font-mono font-bold tracking-wider text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#F59E0B]" />
                  {temporality.yearEndBadge}
                </span>
                <span className="text-xs text-[#8E8E99] font-mono hidden sm:inline">
                  {temporality.eligibilityPeriod}
                </span>
              </div>
              <h2
                id="awards-gala-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[#F4F4F6] truncate"
              >
                {ceremony.name || `Premios Anuales de la Música ${ceremony.year}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Player Nominations / Wins Pill */}
            <div className="bg-[#09090B] px-3 py-1.5 rounded-[4px] border border-[#242429] text-xs font-mono hidden sm:flex items-center gap-2">
              <span className="text-[#8E8E99]">Nominaciones:</span>
              <strong className="text-[#F4F4F6] font-bold tabular-nums">{playerTotalNominations}</strong>
              <span className="text-[#242429]">|</span>
              <span className="text-[#8E8E99]">Estatuillas:</span>
              <strong className="text-[#F59E0B] font-bold tabular-nums">{playerTotalWins}</strong>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-[#F4F4F6] transition-colors cursor-pointer"
              title="Cerrar Gala"
              aria-label="Cerrar Gala"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Category Tabs + Interactive Ceremony */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Category Tabs Indicator */}
          <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x pb-2 border-b border-[#242429]">
            {categories.map((cat, idx) => {
              const isRevealed = !!revealedCategories[idx];
              const isCurrent = !showSummary && currentCategoryIndex === idx;
              const isPlayerWinner = cat.winnerArtistId === player.id || cat.playerWon;
              const Icon = getCategoryIcon(cat.name);

              return (
                <button
                  key={cat.id || `tab-${idx}`}
                  onClick={() => handleSelectCategory(idx)}
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-[#FF4F00] text-white font-bold'
                      : isRevealed
                      ? 'bg-[#09090B] text-[#F4F4F6] border border-[#F59E0B]/30 hover:bg-[#18181C]'
                      : 'bg-[#09090B] text-[#8E8E99] hover:text-[#F4F4F6] hover:bg-[#18181C] border border-[#242429]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  {isRevealed && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPlayerWinner ? 'bg-[#F59E0B] animate-pulse' : 'bg-[#00E599]'
                      }`}
                      title={isPlayerWinner ? '¡Victoria obtenida!' : 'Ganador revelado'}
                    />
                  )}
                </button>
              );
            })}

            <button
              onClick={() => setShowSummary(true)}
              className={`px-3 py-1.5 rounded-[4px] text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                showSummary
                  ? 'bg-[#F4F4F6] text-[#09090B] font-bold border border-[#F4F4F6]'
                  : 'bg-[#09090B] border border-[#242429] text-[#8E8E99] hover:text-[#F4F4F6]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resumen Final</span>
            </button>
          </div>

          {/* VIEW 1: SUMMARY OF THE GALA */}
          {showSummary ? (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#09090B] border border-[#242429] rounded-[6px] p-5 sm:p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-[4px] bg-[#F59E0B] text-[#09090B] mx-auto flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#09090B]" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#F4F4F6]">
                    Cuadro de Honor Oficial • {player.name}
                  </h3>
                  <p className="text-xs text-[#8E8E99] font-mono mt-0.5">
                    {temporality.yearEndBadge} • {temporality.eligibilityPeriod}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono max-w-lg mx-auto">
                  <div className="bg-[#18181C] p-3 rounded-[4px] border border-[#242429]">
                    <span className="text-2xs uppercase text-[#8E8E99] font-bold block">Nominaciones</span>
                    <span className="text-xl font-bold tabular-nums text-[#F4F4F6]">
                      {playerTotalNominations}
                    </span>
                  </div>
                  <div className="bg-[#18181C] p-3 rounded-[4px] border border-[#242429]">
                    <span className="text-2xs uppercase text-[#F59E0B] font-bold block">Estatuillas</span>
                    <span className="text-xl font-bold tabular-nums text-[#F59E0B]">
                      {playerTotalWins}
                    </span>
                  </div>
                  <div className="bg-[#18181C] p-3 rounded-[4px] border border-[#242429] col-span-2 sm:col-span-1">
                    <span className="text-2xs uppercase text-[#00E599] font-bold block">Puntaje Legado</span>
                    <span className="text-xl font-bold tabular-nums text-[#00E599]">
                      {player.legacyScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* List of All Winners in this Ceremony */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase text-[#8E8E99] tracking-wider font-mono">
                  Ganadores Oficiales de la Edición {ceremony.year}
                </h4>
                <div className="space-y-2">
                  {categories.map((cat, idx) => {
                    const isPlayerWinner = cat.winnerArtistId === player.id || cat.playerWon;
                    const itemTitle = cat.winnerItemTitle ? `"${cat.winnerItemTitle}"` : '';

                    return (
                      <div
                        key={cat.id || `summary-cat-${idx}`}
                        className={`p-3.5 rounded-[4px] border flex items-center justify-between gap-3 text-xs ${
                          isPlayerWinner
                            ? 'bg-[#18181C] border-[#F59E0B] text-[#F4F4F6]'
                            : 'bg-[#09090B] border-[#242429] text-[#F4F4F6]'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xs font-bold uppercase text-[#8E8E99] block tracking-wide">
                              {cat.name}
                            </span>
                            {cat.winTypeLabel && (
                              <span className="text-2xs font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.2 rounded-[4px] border border-[#F59E0B]/20">
                                {cat.winTypeLabel}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-sm text-[#F4F4F6] flex items-center gap-1.5 truncate">
                            <span className="inline-flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />{cat.winnerArtistName}</span>
                            {itemTitle && <span className="font-normal text-[#8E8E99] truncate">— {itemTitle}</span>}
                          </p>
                          {cat.winnerReason && (
                            <p className="text-xs text-[#8E8E99] italic truncate">
                              "{cat.winnerReason}"
                            </p>
                          )}
                        </div>

                        {isPlayerWinner && (
                          <div className="shrink-0 bg-[#F59E0B] text-[#09090B] px-2.5 py-1 rounded-[4px] font-mono font-bold text-2xs">
                            ¡TU VICTORIA!
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : currentCategory ? (
            /* VIEW 2: PROGRESSIVE CEREMONY PRESENTATION */
            <div className="space-y-5 animate-fade-in">
              {/* Category Header Card with Field and Eligibility Period */}
              <div className="bg-[#09090B] border border-[#242429] rounded-[6px] p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap border-b border-[#242429] pb-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xs uppercase font-mono font-bold tracking-wider text-[#8E8E99]">
                        Categoría {currentCategoryIndex + 1} de {categories.length}
                      </span>
                      <span className="text-2xs font-bold font-mono border border-[#3F3F46] bg-[#18181C] text-[#F4F4F6] px-2 py-0.5 rounded-[4px]">
                        {fieldBadge.label}
                      </span>
                      <span className="text-2xs text-[#8E8E99] font-mono">
                        Período: {currentCategory.eligibilityPeriod || temporality.eligibilityPeriod}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F4F6] flex items-center gap-2">
                      <CategoryIcon className="w-5 h-5 text-[#F59E0B] shrink-0" />
                      <span className="truncate">{currentCategory.name}</span>
                    </h3>

                    {currentCategory.description && (
                      <p className="text-xs text-[#8E8E99] leading-relaxed">
                        {currentCategory.description}
                      </p>
                    )}
                  </div>

                  {/* Player Status Pill */}
                  <div className="shrink-0">
                    {currentCategory.playerNominated || currentCategory.playerNominationStatus?.isNominated ? (
                      <div className="bg-[#18181C] border border-[#F59E0B]/50 px-3 py-1.5 rounded-[4px] flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="text-xs font-bold font-mono text-[#F59E0B]">¡Estás Nominado!</span>
                      </div>
                    ) : (
                      <div className="bg-[#18181C] border border-[#242429] px-3 py-1.5 rounded-[4px] text-xs text-[#8E8E99] font-mono">
                        <span>No Nominado</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transparency Info Box about Player Status */}
                {currentCategory.playerNominationStatus?.reason && (
                  <div className="bg-[#18181C] border border-[#242429] rounded-[4px] p-3 text-xs flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-[#FF4F00] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <strong className="text-[#F4F4F6] font-semibold">Dictamen del Comité: </strong>
                      <span className="text-[#8E8E99]">{currentCategory.playerNominationStatus.reason}</span>
                    </div>
                  </div>
                )}

                {/* Stepper Progress Bar */}
                <div className="flex items-center justify-between gap-1 text-xs font-mono border-t border-[#242429] pt-3">
                  <div className={`flex items-center gap-1.5 ${categoryPhase === 'presentation' ? 'text-[#F59E0B] font-bold' : 'text-[#8E8E99]'}`}>
                    <span className="w-5 h-5 rounded-[4px] border border-current flex items-center justify-center text-2xs tabular-nums">1</span>
                    <span className="hidden xs:inline">Contexto</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#242429]" />
                  <div className={`flex items-center gap-1.5 ${categoryPhase === 'nominees' ? 'text-[#F59E0B] font-bold' : 'text-[#8E8E99]'}`}>
                    <span className="w-5 h-5 rounded-[4px] border border-current flex items-center justify-center text-2xs tabular-nums">2</span>
                    <span className="hidden xs:inline">Nominados</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#242429]" />
                  <div className={`flex items-center gap-1.5 ${categoryPhase === 'deliberation' ? 'text-[#F59E0B] font-bold' : 'text-[#8E8E99]'}`}>
                    <span className="w-5 h-5 rounded-[4px] border border-current flex items-center justify-center text-2xs tabular-nums">3</span>
                    <span className="hidden xs:inline">Tensión</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#242429]" />
                  <div className={`flex items-center gap-1.5 ${categoryPhase === 'envelope' || isCurrentRevealed ? 'text-[#F59E0B] font-bold' : 'text-[#8E8E99]'}`}>
                    <span className="w-5 h-5 rounded-[4px] border border-current flex items-center justify-center text-2xs tabular-nums">4</span>
                    <span className="hidden xs:inline">El Sobre & Ganador</span>
                  </div>
                </div>
              </div>

              {/* PHASE 1: CATEGORY CONTEXT & ENTRY */}
              {categoryPhase === 'presentation' && !isCurrentRevealed && (
                <div className="bg-[#09090B] border border-[#242429] rounded-[6px] p-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-[4px] bg-[#F59E0B] text-[#09090B] mx-auto flex items-center justify-center">
                    <CategoryIcon className="w-7 h-7 text-[#09090B]" />
                  </div>

                  <div className="max-w-md mx-auto space-y-1.5">
                    <h4 className="text-base sm:text-lg font-bold text-[#F4F4F6]">
                      Apertura de la Categoría
                    </h4>
                    <p className="text-xs text-[#8E8E99] leading-relaxed">
                      El comité de la academia ha evaluado todo el material lanzado durante el año según
                      criterios de calidad artística, originalidad, repercusión en charts y excelencia técnica.
                    </p>
                  </div>

                  <button
                    onClick={handleAdvancePhase}
                    className="bg-[#FF4F00] text-white hover:bg-[#E04500] px-6 py-2.5 rounded-[4px] text-xs font-bold font-mono tracking-wide transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Presentar a los 4 Nominados Oficiales</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}

              {/* PHASE 2: NOMINEES SHOWCASE & CRITIC REVIEWS */}
              {(categoryPhase === 'nominees' || categoryPhase === 'deliberation' || isCurrentRevealed) && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8E8E99] font-mono flex items-center gap-1.5">
                      <span>Artistas y Obras Nominadas</span>
                      <span className="text-2xs font-mono tabular-nums px-1.5 py-0.5 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#F4F4F6]">
                        {currentCategory.nominees?.length || 0}
                      </span>
                    </span>
                    {isCurrentRevealed && (
                      <span className="text-2xs text-[#F59E0B] font-mono font-medium">
                        ★ Ganador oficial galardonado
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {(currentCategory.nominees || []).map((nominee, nIdx) => {
                      const isWinner = isCurrentRevealed && nominee.artistId === currentCategory.winnerArtistId;
                      const isPlayerNominee = nominee.artistId === player.id || nominee.isPlayer;
                      const isSelected = selectedNomineeIndex === nIdx;

                      return (
                        <div
                          key={nominee.artistId + (nominee.itemId || '') + nIdx}
                          role="button"
                          tabIndex={0}
                          onKeyDown={activateOnKey}
                          onClick={() => setSelectedNomineeIndex(isSelected ? null : nIdx)}
                          className={`p-4 rounded-[6px] border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                            isWinner
                              ? 'bg-[#18181C] border-[#F59E0B]'
                              : isPlayerNominee
                              ? 'bg-[#18181C] border-[#FF4F00]/50'
                              : 'bg-[#111114] border-[#242429] hover:border-[#3F3F46]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <span
                                className={`w-7 h-7 rounded-[4px] flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                                  isWinner
                                    ? 'bg-[#F59E0B] text-[#09090B] border-[#F59E0B]'
                                    : isPlayerNominee
                                    ? 'bg-[#FF4F00]/20 text-[#FF4F00] border-[#FF4F00]/40'
                                    : 'bg-[#09090B] text-[#8E8E99] border-[#242429]'
                                }`}
                              >
                                {isWinner ? <Trophy className="w-4 h-4 text-[#09090B]" aria-label="Ganador" /> : `#${nIdx + 1}`}
                              </span>

                              <div className="min-w-0 flex-1">
                                {nominee.itemTitle ? (
                                  <>
                                    <h4 className="text-xs font-bold text-[#F4F4F6] truncate" title={nominee.itemTitle}>
                                      "{nominee.itemTitle}"
                                    </h4>
                                    <p className="text-xs text-[#8E8E99] truncate mt-0.5" title={nominee.artistName}>
                                      {nominee.artistName}
                                    </p>
                                  </>
                                ) : (
                                  <h4 className="text-xs font-bold text-[#F4F4F6] truncate" title={nominee.artistName}>
                                    {nominee.artistName}
                                  </h4>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isPlayerNominee && (
                                <span className="text-2xs font-bold font-mono bg-[#FF4F00]/20 text-[#FF4F00] border border-[#FF4F00]/40 px-1.5 py-0.5 rounded-[4px]">
                                  TÚ
                                </span>
                              )}
                              {isWinner && (
                                <span className="flex items-center gap-1 bg-[#F59E0B] text-[#09090B] px-2 py-0.5 rounded-[4px] text-2xs font-mono font-bold border border-[#F59E0B]">
                                  <Trophy className="w-3 h-3 text-[#09090B]" />
                                  <span>GANADOR</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Nomination Reason */}
                          {nominee.nominationReason && (
                            <p className="text-xs text-[#8E8E99] italic leading-tight">
                              {nominee.nominationReason}
                            </p>
                          )}

                          {/* Stats and Critic Quote */}
                          <div className="pt-2 border-t border-[#242429] space-y-2">
                            <div className="flex items-center justify-between text-2xs text-[#8E8E99] font-mono">
                              <span>{nominee.highlightText}</span>
                              {nominee.odds && (
                                <span className="text-[#F59E0B] font-bold uppercase">
                                  {nominee.odds === 'favorite' ? 'Favorito' : nominee.odds === 'contender' ? 'Contendiente' : 'Batacazo'}
                                </span>
                              )}
                            </div>

                            {/* Critic Snippet */}
                            {nominee.criticQuote && (
                              <div className="bg-[#09090B] p-2 rounded-[4px] border border-[#242429] text-2xs text-[#8E8E99] flex items-start gap-1.5">
                                <Quote className="w-3 h-3 text-[#F59E0B] shrink-0 mt-0.5" />
                                <p className="italic line-clamp-2">
                                  <strong className="text-[#F4F4F6] not-italic">{nominee.criticQuote.media}: </strong>
                                  "{nominee.criticQuote.text}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {categoryPhase === 'nominees' && !isCurrentRevealed && (
                    <div className="text-center pt-2">
                      <button
                        onClick={handleAdvancePhase}
                        className="bg-[#FF4F00] text-white hover:bg-[#E04500] px-5 py-2 rounded-[4px] text-xs font-bold font-mono transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Analizar Tensión & Probabilidades del Jurado</span>
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* PHASE 3: DELIBERATION & TENSION METER */}
              {categoryPhase === 'deliberation' && !isCurrentRevealed && (
                <div className="bg-[#09090B] border border-[#242429] rounded-[6px] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#F59E0B]" />
                      <h4 className="text-sm font-bold text-[#F4F4F6]">
                        Barómetro de Tensión de la Academia
                      </h4>
                    </div>
                    <span className="text-2xs font-mono text-[#8E8E99]">
                      Consenso Estimado
                    </span>
                  </div>

                  {/* Odds and Probability Bars */}
                  <div className="space-y-3">
                    {(currentCategory.nominees || []).map((nom, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#F4F4F6] truncate">
                            {nom.itemTitle ? `"${nom.itemTitle}" (${nom.artistName})` : nom.artistName}
                          </span>
                          <span className="font-mono tabular-nums text-[#F59E0B] font-bold">
                            {nom.expectationPct || 25}%
                          </span>
                        </div>
                        <div className="w-full bg-[#18181C] h-2 rounded-[2px] overflow-hidden border border-[#242429]">
                          <div
                            className={`h-full transition-all duration-700 ${
                              idx === 0
                                ? 'bg-[#F59E0B]'
                                : idx === 1
                                ? 'bg-[#00E599]'
                                : 'bg-[#8E8E99]'
                            }`}
                            role="progressbar"
                            aria-label="Expectativa de victoria"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(Number(nom.expectationPct || 25))}
                            style={{ width: `${nom.expectationPct || 25}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentCategory.deliberationNotes && (
                    <div className="bg-[#18181C] p-3 rounded-[4px] border border-[#242429] text-xs text-[#8E8E99] italic">
                      <strong className="not-italic text-[#F4F4F6]">Apuntes de Deliberación: </strong>
                      "{currentCategory.deliberationNotes}"
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <button
                      onClick={handleAdvancePhase}
                      className="bg-[#FF4F00] text-white hover:bg-[#E04500] font-bold px-6 py-2.5 rounded-[4px] text-xs font-mono transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Pasar al Sobre Dorado</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PHASE 4: THE GOLDEN ENVELOPE */}
              {categoryPhase === 'envelope' && !isCurrentRevealed && (
                <div className="bg-[#09090B] border border-[#F59E0B]/40 rounded-[6px] p-8 text-center space-y-5">
                  <div className="w-16 h-14 rounded-[4px] bg-[#F59E0B] text-[#09090B] mx-auto flex items-center justify-center border border-[#F59E0B]">
                    <Trophy className="w-8 h-8 text-[#09090B]" />
                  </div>

                  <div className="max-w-md mx-auto space-y-1">
                    <span className="text-2xs uppercase font-bold tracking-widest text-[#F59E0B] block font-mono">
                      Sello de Cera Oficial de la Academia
                    </span>
                    <h4 className="text-xl font-bold text-[#F4F4F6] tracking-tight">
                      El Sobre Dorado está listo
                    </h4>
                    <p className="text-xs text-[#8E8E99] leading-relaxed">
                      El jurado ha emitido su veredicto definitivo para <strong className="text-[#F4F4F6]">{currentCategory.name}</strong>.
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenEnvelope()}
                    className="bg-[#F59E0B] text-[#09090B] hover:bg-[#d98b06] px-8 py-3 rounded-[4px] text-sm font-black font-mono tracking-wide transition-all cursor-pointer inline-flex items-center gap-2.5"
                  >
                    <Sparkles className="w-5 h-5 text-[#09090B]" />
                    <span>ABRIR SOBRE Y REVELAR GANADOR</span>
                  </button>
                </div>
              )}

              {/* PHASE 5: WINNER REVEALED CARD */}
              {isCurrentRevealed && (
                <div className="p-5 sm:p-6 rounded-[6px] border border-[#F59E0B]/60 mt-4 bg-[#18181C] text-[#F4F4F6]">
                  <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                    <div className="w-12 h-12 rounded-[4px] bg-[#F59E0B] text-[#09090B] flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6 text-[#09090B]" />
                    </div>

                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xs uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-[4px] bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                          Estatuilla Oficial de la Academia
                        </span>
                        {currentCategory.winTypeLabel && (
                          <span className="text-2xs font-mono font-bold text-[#F59E0B] bg-[#F59E0B]/20 border border-[#F59E0B]/40 px-2 py-0.5 rounded-[4px]">
                            {currentCategory.winTypeLabel}
                          </span>
                        )}
                        {(currentCategory.winnerArtistId === player.id || currentCategory.playerWon) && (
                          <span className="text-xs font-bold font-mono text-[#F59E0B] bg-[#F59E0B]/20 border border-[#F59E0B]/40 px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                            <PartyPopper className="w-3.5 h-3.5 text-[#F59E0B]" />
                            ¡HAS GANADO ESTA CATEGORÍA!
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold tracking-tight text-[#F4F4F6]">
                        {currentCategory.winnerItemTitle ? `"${currentCategory.winnerItemTitle}" — ` : ''}
                        {currentCategory.winnerArtistName}
                      </h4>

                      {currentCategory.winnerReason && (
                        <p className="text-xs text-[#8E8E99] leading-relaxed italic">
                          "{currentCategory.winnerReason}"
                        </p>
                      )}

                      {(currentCategory.winnerArtistId === player.id || currentCategory.playerWon) && (
                        <div className="pt-2 flex items-center gap-2 flex-wrap font-mono text-xs">
                          <span className="bg-[#00E599]/10 text-[#00E599] border border-[#00E599]/30 px-2 py-0.5 rounded-[4px] font-bold tabular-nums">
                            +6 Pts de Legado
                          </span>
                          <span className="bg-[#FF4F00]/10 text-[#FF4F00] border border-[#FF4F00]/30 px-2 py-0.5 rounded-[4px] font-bold">
                            +Hype & Reputación de Escena
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
        <div className="p-4 sm:p-5 border-t border-[#242429] bg-[#111114] flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevCategory}
              disabled={!showSummary && currentCategoryIndex === 0}
              className="px-3.5 py-1.5 rounded-[4px] text-xs font-semibold font-mono bg-[#18181C] text-[#F4F4F6] border border-[#242429] hover:bg-[#242429] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              onClick={handleNextCategory}
              disabled={showSummary}
              className="px-3.5 py-1.5 rounded-[4px] text-xs font-semibold font-mono bg-[#18181C] text-[#F4F4F6] border border-[#242429] hover:bg-[#242429] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{currentCategoryIndex < categories.length - 1 ? 'Siguiente Categoría' : 'Ver Resumen'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Secondary Skip Option: Subtle link for accessibility */}
            {!allRevealed && !showSummary && (
              <button
                onClick={handleRevealAll}
                className="text-xs text-[#8E8E99] hover:text-[#F4F4F6] underline cursor-pointer font-medium font-mono"
              >
                Saltar a resultados finales
              </button>
            )}

            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-[#FF4F00] text-white font-bold px-5 py-2 rounded-[4px] text-xs hover:bg-[#E04500] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Concluir Gala & Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
