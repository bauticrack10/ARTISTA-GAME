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
        className="bg-surface border border-line rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden text-fg shadow-2xl"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Modal Header: Contextual Temporality & Performance Summary */}
        <div className="p-5 sm:p-6 border-b border-line bg-surface flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-sm">
              <Trophy className="w-5 h-5 text-amber-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-2xs uppercase font-bold tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-sm inline-flex items-center gap-1 shadow-xs">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  {temporality.yearEndBadge}
                </span>
                <span className="text-xs text-fg-muted hidden sm:inline">
                  {temporality.eligibilityPeriod}
                </span>
              </div>
              <h2
                id="awards-gala-title"
                className="text-lg sm:text-xl font-semibold tracking-[-0.8px] text-fg truncate"
              >
                {ceremony.name || `Premios Anuales de la Música ${ceremony.year}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Player Nominations / Wins Pill */}
            <div className="bg-canvas px-3 py-1.5 rounded-md border border-line text-xs font-mono hidden sm:flex items-center gap-2">
              <span className="text-fg-muted">Nominaciones:</span>
              <strong className="text-purple-400 font-bold">{playerTotalNominations}</strong>
              <span className="text-line">|</span>
              <span className="text-fg-muted">Estatuillas:</span>
              <strong className="text-amber-400 font-bold">{playerTotalWins}</strong>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-line text-fg-muted hover:text-fg transition-colors cursor-pointer"
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
          <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x pb-2 border-b border-line">
            {categories.map((cat, idx) => {
              const isRevealed = !!revealedCategories[idx];
              const isCurrent = !showSummary && currentCategoryIndex === idx;
              const isPlayerWinner = cat.winnerArtistId === player.id || cat.playerWon;
              const Icon = getCategoryIcon(cat.name);

              return (
                <button
                  key={cat.id || `tab-${idx}`}
                  onClick={() => handleSelectCategory(idx)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                      : isRevealed
                      ? 'bg-canvas text-fg border border-amber-500/30 hover:bg-surface'
                      : 'bg-canvas text-fg-muted hover:text-fg hover:bg-surface border border-line'
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
              className={`px-3 py-1.5 rounded-md text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                showSummary
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold border border-amber-400 shadow-sm'
                  : 'bg-canvas border border-line text-fg-muted hover:text-fg'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resumen Final</span>
            </button>
          </div>

          {/* VIEW 1: SUMMARY OF THE GALA */}
          {showSummary ? (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-br from-[#16181F] to-[#1C1F2B] border border-amber-500/30 rounded-xl p-5 sm:p-6 text-center space-y-3 shadow-md">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950 mx-auto flex items-center justify-center shadow-md">
                  <Trophy className="w-7 h-7 text-stone-950" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-fg">
                    Cuadro de Honor Oficial • {player.name}
                  </h3>
                  <p className="text-xs text-fg-muted mt-0.5">
                    {temporality.yearEndBadge} • {temporality.eligibilityPeriod}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono max-w-lg mx-auto">
                  <div className="bg-canvas p-3 rounded-lg border border-purple-500/30">
                    <span className="text-2xs uppercase text-purple-400 font-bold block">Nominaciones</span>
                    <span className="text-xl font-bold text-purple-300">
                      {playerTotalNominations}
                    </span>
                  </div>
                  <div className="bg-canvas p-3 rounded-lg border border-amber-500/30">
                    <span className="text-2xs uppercase text-amber-400 font-bold block">Estatuillas</span>
                    <span className="text-xl font-bold text-amber-300">
                      {playerTotalWins}
                    </span>
                  </div>
                  <div className="bg-canvas p-3 rounded-lg border border-emerald-500/30 col-span-2 sm:col-span-1">
                    <span className="text-2xs uppercase text-emerald-400 font-bold block">Puntaje Legado</span>
                    <span className="text-xl font-bold text-emerald-300">
                      {player.legacyScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* List of All Winners in this Ceremony */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase text-fg-muted tracking-wider">
                  Ganadores Oficiales de la Edición {ceremony.year}
                </h4>
                <div className="space-y-2">
                  {categories.map((cat, idx) => {
                    const isPlayerWinner = cat.winnerArtistId === player.id || cat.playerWon;
                    const itemTitle = cat.winnerItemTitle ? `"${cat.winnerItemTitle}"` : '';

                    return (
                      <div
                        key={cat.id || `summary-cat-${idx}`}
                        className={`p-3.5 rounded-control border flex items-center justify-between gap-3 text-xs ${
                          isPlayerWinner
                            ? 'bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-400 shadow-sm'
                            : 'bg-canvas border-line'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xs font-bold uppercase text-fg-muted block tracking-wide">
                              {cat.name}
                            </span>
                            {cat.winTypeLabel && (
                              <span className="text-2xs font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded-sm border border-amber-500/20">
                                {cat.winTypeLabel}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-sm text-fg flex items-center gap-1.5 truncate">
                            <span className="inline-flex items-center gap-1"><Trophy className="w-3.5 h-3.5" aria-hidden="true" />{cat.winnerArtistName}</span>
                            {itemTitle && <span className="font-normal text-fg-muted truncate">— {itemTitle}</span>}
                          </p>
                          {cat.winnerReason && (
                            <p className="text-xs text-fg-muted italic truncate">
                              "{cat.winnerReason}"
                            </p>
                          )}
                        </div>

                        {isPlayerWinner && (
                          <div className="shrink-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 border border-amber-400 px-2.5 py-1 rounded-md font-extrabold text-2xs shadow-xs">
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
              <div className="bg-canvas border border-amber-500/30 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap border-b border-line pb-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xs uppercase font-bold tracking-wider text-fg-muted">
                        Categoría {currentCategoryIndex + 1} de {categories.length}
                      </span>
                      <span className={`text-2xs font-bold border px-2 py-0.5 rounded-sm shadow-xs ${fieldBadge.color}`}>
                        {fieldBadge.label}
                      </span>
                      <span className="text-2xs text-fg-muted font-mono">
                        Período: {currentCategory.eligibilityPeriod || temporality.eligibilityPeriod}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.9px] text-fg flex items-center gap-2">
                      <CategoryIcon className="w-5 h-5 text-amber-400 shrink-0" />
                      <span className="truncate">{currentCategory.name}</span>
                    </h3>

                    {currentCategory.description && (
                      <p className="text-xs text-fg-muted leading-relaxed">
                        {currentCategory.description}
                      </p>
                    )}
                  </div>

                  {/* Player Status Pill */}
                  <div className="shrink-0">
                    {currentCategory.playerNominated || currentCategory.playerNominationStatus?.isNominated ? (
                      <div className="bg-purple-500/20 border border-purple-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-purple-200">¡Estás Nominado!</span>
                      </div>
                    ) : (
                      <div className="bg-surface border border-line px-3 py-1.5 rounded-lg text-xs text-fg-muted">
                        <span>No Nominado</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transparency Info Box about Player Status */}
                {currentCategory.playerNominationStatus?.reason && (
                  <div className="bg-surface border border-line rounded-lg p-3 text-xs flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <strong className="text-fg font-semibold">Dictamen del Comité: </strong>
                      <span className="text-fg-muted">{currentCategory.playerNominationStatus.reason}</span>
                    </div>
                  </div>
                )}

                {/* Stepper Progress Bar */}
                <div className="flex items-center justify-between gap-1 text-xs font-mono border-t border-line pt-3">
                  <div className={`flex items-center gap-1.5 ${categoryPhase === 'presentation' ? 'text-amber-300 font-bold' : 'text-fg-muted'}`}>
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-2xs">1</span>
                    <span className="hidden xs:inline">Contexto</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-line" />
                  <div className={`flex items-center gap-1.5 ${categoryPhase === 'nominees' ? 'text-amber-300 font-bold' : 'text-fg-muted'}`}>
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-2xs">2</span>
                    <span className="hidden xs:inline">Nominados</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-line" />
                  <div className={`flex items-center gap-1.5 ${categoryPhase === 'deliberation' ? 'text-amber-300 font-bold' : 'text-fg-muted'}`}>
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-2xs">3</span>
                    <span className="hidden xs:inline">Tensión</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-line" />
                  <div className={`flex items-center gap-1.5 ${categoryPhase === 'envelope' || isCurrentRevealed ? 'text-amber-300 font-bold' : 'text-fg-muted'}`}>
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-2xs">4</span>
                    <span className="hidden xs:inline">El Sobre & Ganador</span>
                  </div>
                </div>
              </div>

              {/* PHASE 1: CATEGORY CONTEXT & ENTRY */}
              {categoryPhase === 'presentation' && !isCurrentRevealed && (
                <div className="bg-surface border border-line rounded-xl p-6 text-center space-y-4 animate-fade-in shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950 mx-auto flex items-center justify-center shadow-md">
                    <CategoryIcon className="w-8 h-8 text-stone-950" />
                  </div>

                  <div className="max-w-md mx-auto space-y-1.5">
                    <h4 className="text-base sm:text-lg font-semibold text-fg">
                      Apertura de la Categoría
                    </h4>
                    <p className="text-xs text-fg-muted leading-relaxed">
                      El comité de la academia ha evaluado todo el material lanzado durante el año según
                      criterios de calidad artística, originalidad, repercusión en charts y excelencia técnica.
                    </p>
                  </div>

                  <button
                    onClick={handleAdvancePhase}
                    className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 border border-amber-300 px-6 py-2.5 rounded-md text-xs font-extrabold hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <span>Presentar a los 4 Nominados Oficiales</span>
                    <ChevronRight className="w-4 h-4 text-stone-950" />
                  </button>
                </div>
              )}

              {/* PHASE 2: NOMINEES SHOWCASE & CRITIC REVIEWS */}
              {(categoryPhase === 'nominees' || categoryPhase === 'deliberation' || isCurrentRevealed) && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
                      <span>Artistas y Obras Nominadas</span>
                      <span className="text-2xs font-mono px-1.5 py-0.5 rounded-sm bg-surface border border-line text-fg">
                        {currentCategory.nominees?.length || 0}
                      </span>
                    </span>
                    {isCurrentRevealed && (
                      <span className="text-2xs text-amber-400 font-medium italic">
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
                          className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                            isWinner
                              ? 'bg-amber-500/15 border-amber-500/50 ring-2 ring-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                              : isPlayerNominee
                              ? 'bg-purple-500/15 border-purple-500/40 shadow-xs'
                              : 'bg-surface border-line hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <span
                                className={`w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                                  isWinner
                                    ? 'bg-gradient-to-tr from-amber-500 to-yellow-500 text-stone-950 border-amber-400 shadow-xs'
                                    : isPlayerNominee
                                    ? 'bg-purple-500/25 text-purple-300 border-purple-500/40'
                                    : 'bg-canvas text-fg-muted border-line'
                                }`}
                              >
                                {isWinner ? <Trophy className="w-4 h-4" aria-label="Ganador" /> : `#${nIdx + 1}`}
                              </span>

                              <div className="min-w-0 flex-1">
                                {nominee.itemTitle ? (
                                  <>
                                    <h4 className="text-xs font-bold text-fg truncate" title={nominee.itemTitle}>
                                      "{nominee.itemTitle}"
                                    </h4>
                                    <p className="text-xs text-fg-muted truncate mt-0.5" title={nominee.artistName}>
                                      {nominee.artistName}
                                    </p>
                                  </>
                                ) : (
                                  <h4 className="text-xs font-bold text-fg truncate" title={nominee.artistName}>
                                    {nominee.artistName}
                                  </h4>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isPlayerNominee && (
                                <span className="text-2xs font-bold bg-purple-500/25 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded-sm shadow-xs">
                                  TÚ
                                </span>
                              )}
                              {isWinner && (
                                <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 px-2 py-0.5 rounded-sm text-2xs font-extrabold border border-amber-400 shadow-xs animate-pulse">
                                  <Trophy className="w-3 h-3 text-amber-950" />
                                  <span>GANADOR</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Nomination Reason */}
                          {nominee.nominationReason && (
                            <p className="text-xs text-fg-muted italic leading-tight">
                              {nominee.nominationReason}
                            </p>
                          )}

                          {/* Stats and Critic Quote */}
                          <div className="pt-2 border-t border-white/[0.06] space-y-2">
                            <div className="flex items-center justify-between text-2xs text-fg-muted font-mono">
                              <span>{nominee.highlightText}</span>
                              {nominee.odds && (
                                <span className="text-amber-400 font-bold uppercase">
                                  {nominee.odds === 'favorite' ? 'Favorito' : nominee.odds === 'contender' ? 'Contendiente' : 'Batacazo'}
                                </span>
                              )}
                            </div>

                            {/* Critic Snippet */}
                            {nominee.criticQuote && (
                              <div className="bg-canvas p-2 rounded-md border border-line text-2xs text-fg-muted flex items-start gap-1.5">
                                <Quote className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                                <p className="italic line-clamp-2">
                                  <strong className="text-fg not-italic">{nominee.criticQuote.media}: </strong>
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
                        className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white px-5 py-2 rounded-md text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5"
                      >
                        <span>Analizar Tensión & Probabilidades del Jurado</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* PHASE 3: DELIBERATION & TENSION METER */}
              {categoryPhase === 'deliberation' && !isCurrentRevealed && (
                <div className="bg-canvas border border-purple-500/30 rounded-xl p-5 sm:p-6 space-y-4 animate-fade-in shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                      <h4 className="text-sm font-semibold text-fg">
                        Barómetro de Tensión de la Academia
                      </h4>
                    </div>
                    <span className="text-2xs font-mono text-fg-muted">
                      Consenso Estimado
                    </span>
                  </div>

                  {/* Odds and Probability Bars */}
                  <div className="space-y-3">
                    {(currentCategory.nominees || []).map((nom, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-fg truncate">
                            {nom.itemTitle ? `"${nom.itemTitle}" (${nom.artistName})` : nom.artistName}
                          </span>
                          <span className="font-mono text-amber-300 font-bold">
                            {nom.expectationPct || 25}%
                          </span>
                        </div>
                        <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-line">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              idx === 0
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                : idx === 1
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-400'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
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
                    <div className="bg-surface p-3 rounded-lg border border-line text-xs text-fg-muted italic">
                      <strong className="not-italic text-fg">Apuntes de Deliberación: </strong>
                      "{currentCategory.deliberationNotes}"
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <button
                      onClick={handleAdvancePhase}
                      className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-bold border border-amber-300 px-6 py-2.5 rounded-md text-xs shadow-md hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-950 animate-pulse" />
                      <span>Pasar al Sobre Dorado</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PHASE 4: THE GOLDEN ENVELOPE */}
              {categoryPhase === 'envelope' && !isCurrentRevealed && (
                <div className="bg-gradient-to-br from-[#1C1F2B] via-[#16181F] to-[#0B0C10] border border-amber-500/50 rounded-card p-8 text-center space-y-5 animate-fade-in shadow-xl">
                  <div className="w-20 h-16 rounded-control bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 mx-auto flex items-center justify-center shadow-lg border-2 border-amber-300 transform hover:scale-105 transition-transform">
                    <Trophy className="w-8 h-8 text-stone-950" />
                  </div>

                  <div className="max-w-md mx-auto space-y-1">
                    <span className="text-2xs uppercase font-bold tracking-widest text-amber-400 block font-mono">
                      Sello de Cera Oficial de la Academia
                    </span>
                    <h4 className="text-xl font-bold text-fg tracking-tight">
                      El Sobre Dorado está listo
                    </h4>
                    <p className="text-xs text-fg-muted leading-relaxed">
                      El jurado ha emitido su veredicto definitivo para <strong className="text-fg">{currentCategory.name}</strong>.
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenEnvelope()}
                    className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 border border-amber-300 px-8 py-3 rounded-lg text-sm font-black tracking-wide hover:opacity-95 active:scale-[0.97] transition-all cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.4)] inline-flex items-center gap-2.5 animate-pulse"
                  >
                    <Sparkles className="w-5 h-5 text-amber-950" />
                    <span>ABRIR SOBRE Y REVELAR GANADOR</span>
                  </button>
                </div>
              )}

              {/* PHASE 5: WINNER REVEALED CARD */}
              {isCurrentRevealed && (
                <div
                  className={`p-5 sm:p-6 rounded-card border mt-4 animate-fade-in shadow-lg ${
                    currentCategory.winnerArtistId === player.id || currentCategory.playerWon
                      ? 'bg-gradient-to-br from-amber-500/25 via-amber-500/15 to-yellow-500/10 border-amber-500/60 text-amber-200 ring-2 ring-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                      : 'bg-surface border-amber-500/40 text-fg'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                    <div
                      className={`w-14 h-14 rounded-control flex items-center justify-center shrink-0 shadow-md ${
                        currentCategory.winnerArtistId === player.id || currentCategory.playerWon
                          ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950'
                          : 'bg-canvas border border-amber-500/40 text-amber-400'
                      }`}
                    >
                      <Trophy className="w-7 h-7" />
                    </div>

                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Estatuilla Oficial de la Academia
                        </span>
                        {currentCategory.winTypeLabel && (
                          <span className="text-2xs font-bold text-amber-300 bg-amber-500/20 border border-amber-400/50 px-2 py-0.5 rounded-sm">
                            {currentCategory.winTypeLabel}
                          </span>
                        )}
                        {(currentCategory.winnerArtistId === player.id || currentCategory.playerWon) && (
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/30 border border-amber-400 px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-xs animate-pulse">
                            <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                            ¡HAS GANADO ESTA CATEGORÍA!
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold tracking-tight text-fg">
                        {currentCategory.winnerItemTitle ? `"${currentCategory.winnerItemTitle}" — ` : ''}
                        {currentCategory.winnerArtistName}
                      </h4>

                      {currentCategory.winnerReason && (
                        <p className="text-xs text-fg-muted leading-relaxed italic">
                          "{currentCategory.winnerReason}"
                        </p>
                      )}

                      {(currentCategory.winnerArtistId === player.id || currentCategory.playerWon) && (
                        <div className="pt-2 flex items-center gap-2 flex-wrap font-mono text-xs">
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-sm font-bold">
                            +6 Pts de Legado
                          </span>
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-sm font-bold">
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
        <div className="p-4 sm:p-5 border-t border-line bg-surface flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevCategory}
              disabled={!showSummary && currentCategoryIndex === 0}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-canvas text-fg border border-line hover:bg-line disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              onClick={handleNextCategory}
              disabled={showSummary}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-canvas text-fg border border-line hover:bg-line disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
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
                className="text-xs text-fg-muted hover:text-fg underline cursor-pointer font-medium"
              >
                Saltar a resultados finales
              </button>
            )}

            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold px-5 py-2 rounded-md text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
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
