import React, { useState } from 'react';
import { AwardCeremony, AwardCategory, Artist, WorldState } from '../types';
import { playSound } from '../utils/audioSystem';
import {
  Trophy,
  Award,
  Crown,
  Sparkles,
  Disc3,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Star,
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GalaModalProps {
  ceremony: AwardCeremony;
  world: WorldState;
  player: Artist;
  onClose: () => void;
}

export const GalaModal: React.FC<GalaModalProps> = ({
  ceremony,
  world,
  player,
  onClose
}) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
  const [revealedCategories, setRevealedCategories] = useState<Record<number, boolean>>({});
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const categories = ceremony.categories || [];
  const currentCategory: AwardCategory | undefined = categories[currentCategoryIndex];
  const isCurrentRevealed = !!revealedCategories[currentCategoryIndex];

  // Trigger celebration effects with vibrant multicolors if player won
  const handleRevealWinner = () => {
    setRevealedCategories(prev => ({ ...prev, [currentCategoryIndex]: true }));
    playSound('award');

    if (currentCategory?.playerWon) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#06b6d4', '#f97316', '#ffd700']
        });
      } catch (e) {
        // Fallback gracefully if canvas-confetti is not supported
      }
    }
  };

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    } else {
      setShowSummary(true);
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#06b6d4', '#f97316', '#ffd700']
        });
      } catch (e) {}
    }
  };

  const handlePrev = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  const getCategoryIcon = (name: string) => {
    if (name.includes('Artista')) return Crown;
    if (name.includes('Canción')) return Disc3;
    if (name.includes('Álbum')) return Trophy;
    if (name.includes('Nuevo') || name.includes('Revelación')) return Sparkles;
    if (name.includes('Producción')) return Sliders;
    return Award;
  };

  const CategoryIcon = currentCategory ? getCategoryIcon(currentCategory.name) : Award;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-[#16181F] border border-[#2A2E3D] max-w-2xl w-full rounded-[16px] p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden my-auto animate-fade-in text-[#F8FAFC]"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none text-amber-500">
          <Trophy className="w-64 h-64" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2A2E3D] pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 border border-amber-300 shadow-xs">
                Ceremonia Anual {ceremony.year}
              </span>
              <span className="text-xs text-[#94A3B8]">Premios de la Academia Musical</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-[-0.8px] text-[#F8FAFC] mt-1 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              {ceremony.name}
            </h1>
            {ceremony.theme && (
              <p className="text-xs text-[#94A3B8] mt-0.5 italic">
                "{ceremony.theme}"
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] hover:bg-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            title="Cerrar Gala"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Stepper Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 relative z-10 scrollbar-none">
          {categories.map((cat, idx) => {
            const isSelected = !showSummary && currentCategoryIndex === idx;
            const isRevealed = !!revealedCategories[idx];
            const StepIcon = getCategoryIcon(cat.name);
            return (
              <button
                key={cat.id || idx}
                onClick={() => {
                  setShowSummary(false);
                  setCurrentCategoryIndex(idx);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                    : isRevealed
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-[#0B0C10] border border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <StepIcon className="w-3 h-3" />
                <span>{cat.name}</span>
                {cat.playerWon && isRevealed && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="¡Ganaste este premio!" />
                )}
              </button>
            );
          })}

          <button
            onClick={() => setShowSummary(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs transition-all cursor-pointer whitespace-nowrap ${
              showSummary
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold border border-amber-400 shadow-sm'
                : 'bg-[#0B0C10] border border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Resumen Final</span>
          </button>
        </div>

        {/* MAIN BODY: SUMMARY VIEW */}
        {showSummary ? (
          <div className="space-y-6 relative z-10">
            {/* Player Highlights Banner */}
            <div className="bg-gradient-to-br from-[#16181F] to-[#1C1F2B] border border-amber-500/30 rounded-[12px] p-5 text-center space-y-3 shadow-md">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950 mx-auto flex items-center justify-center shadow-md">
                <Trophy className="w-7 h-7 text-stone-950" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#F8FAFC]">
                  Balance de la Gala para {player.name}
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Año {ceremony.year} • Premios Anuales de la Música
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono">
                <div className="bg-[#0B0C10] p-3 rounded-[8px] border border-purple-500/30">
                  <span className="text-[10px] uppercase text-purple-400 font-bold block">Nominaciones</span>
                  <span className="text-lg font-bold text-purple-300">
                    {ceremony.playerNominationsCount || 0}
                  </span>
                </div>
                <div className="bg-[#0B0C10] p-3 rounded-[8px] border border-amber-500/30">
                  <span className="text-[10px] uppercase text-amber-400 font-bold block">Premios Ganados</span>
                  <span className="text-lg font-bold text-amber-300">
                    {ceremony.playerWinsCount || 0}
                  </span>
                </div>
                <div className="bg-[#0B0C10] p-3 rounded-[8px] border border-emerald-500/30 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-emerald-400 font-bold block">Puntaje de Legado</span>
                  <span className="text-lg font-bold text-emerald-300">
                    {player.legacyScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* List of All Winners */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-[#94A3B8] tracking-wider">
                Ganadores Oficiales de la Edición {ceremony.year}
              </h3>
              <div className="space-y-2">
                {categories.map((cat, idx) => {
                  const isPlayerWinner = cat.winnerArtistId === player.id;
                  const itemTitle = cat.winnerItemTitle ? `"${cat.winnerItemTitle}"` : '';
                  return (
                    <div
                      key={cat.id || idx}
                      className={`p-3.5 rounded-[10px] border flex items-center justify-between gap-3 text-xs ${
                        isPlayerWinner
                          ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-400 shadow-sm'
                          : 'bg-[#0B0C10] border border-[#2A2E3D]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase text-[#94A3B8] block tracking-wide">
                          {cat.name}
                        </span>
                        <p className="font-bold text-sm text-[#F8FAFC] flex items-center gap-1.5">
                          🏆 {cat.winnerArtistName}
                          {itemTitle && <span className="font-normal text-[#94A3B8]">— {itemTitle}</span>}
                        </p>
                        {cat.winnerReason && (
                          <p className="text-[11px] text-[#94A3B8] italic">
                            {cat.winnerReason}
                          </p>
                        )}
                      </div>

                      {isPlayerWinner && (
                        <div className="shrink-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 border border-amber-400 px-2.5 py-1 rounded-[6px] font-bold text-[10px] shadow-xs">
                          ¡Tu Victoria! 🏆
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end">
              <button
                id="btn-close-gala-summary"
                onClick={onClose}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white px-6 py-2.5 rounded-[6px] text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Guardar en Vitrina & Continuar</span>
              </button>
            </div>
          </div>
        ) : currentCategory ? (
          /* MAIN BODY: SINGLE CATEGORY PRESENTATION */
          <div className="space-y-5 relative z-10">
            {/* Category Header Card */}
            <div className="bg-[#0B0C10] border border-amber-500/30 rounded-[12px] p-5 flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-amber-500/20 rounded-[8px] border border-amber-500/40 text-amber-300 shrink-0">
                <CategoryIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Categoría {currentCategoryIndex + 1} de {categories.length}
                  </span>
                  {currentCategory.playerNominated && (
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                      ¡Estás Nominado!
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-[#F8FAFC] tracking-[-0.6px]">
                  {currentCategory.name}
                </h2>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {currentCategory.description}
                </p>
              </div>
            </div>

            {/* Nominees List */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                Nominados Oficiales ({currentCategory.nominees?.length || 0})
              </label>

              <div className="grid grid-cols-1 gap-2">
                {currentCategory.nominees?.map((nominee, nIdx) => {
                  const isPlayer = nominee.isPlayer;
                  const isWinner = isCurrentRevealed && nominee.artistId === currentCategory.winnerArtistId;

                  return (
                    <div
                      key={nominee.artistId + (nominee.itemId || '') + nIdx}
                      className={`p-3.5 rounded-[10px] border transition-all flex items-center justify-between gap-3 text-xs ${
                        isWinner
                          ? 'bg-amber-500/15 border-amber-500/40 ring-2 ring-amber-400 shadow-xs'
                          : isPlayer
                          ? 'bg-purple-500/15 border-purple-500/40'
                          : 'bg-[#0B0C10] border border-[#2A2E3D]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-[6px] flex items-center justify-center font-mono font-bold text-xs border ${
                            isWinner
                              ? 'bg-gradient-to-tr from-amber-500 to-yellow-500 text-stone-950 border-amber-400'
                              : isPlayer
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-[#16181F] text-[#94A3B8] border border-[#2A2E3D]'
                          }`}
                        >
                          {isWinner ? '🏆' : `${nIdx + 1}`}
                        </div>

                        <div>
                          <p className="font-bold text-sm text-[#F8FAFC] flex items-center gap-1.5">
                            {nominee.artistName}
                            {nominee.itemTitle && (
                              <span className="font-normal text-[#94A3B8]">
                                — "{nominee.itemTitle}"
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            {nominee.highlightText || (nominee.producerName ? `Producción: ${nominee.producerName}` : 'Desempeño destacado')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPlayer && (
                          <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 rounded-[4px]">
                            Tu Candidatura
                          </span>
                        )}
                        {isWinner && (
                          <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-extrabold text-[10px] px-2.5 py-1 rounded-[4px] border border-amber-300 flex items-center gap-1 shadow-xs animate-pulse">
                            ¡GANADOR! 🏆
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reveal / Celebration Box */}
            {!isCurrentRevealed ? (
              <div className="bg-gradient-to-br from-[#0B0C10] to-amber-950/20 border border-amber-500/30 rounded-[12px] p-6 text-center space-y-3 shadow-xs">
                <div className="p-3 bg-amber-500/20 text-amber-300 rounded-full w-12 h-12 mx-auto flex items-center justify-center border border-amber-500/40 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F8FAFC]">
                    Sobre Sellado de la Academia
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    El jurado y las estadísticas del año han determinado al vencedor de esta categoría.
                  </p>
                </div>
                <button
                  id="btn-reveal-award-winner"
                  onClick={handleRevealWinner}
                  className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-bold border border-amber-300 px-6 py-2.5 rounded-[6px] text-xs cursor-pointer hover:opacity-90 active:opacity-75 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Abrir Sobre & Revelar Ganador</span>
                </button>
              </div>
            ) : (
              /* Winner Revealed Announcement Card */
              <div
                className={`border rounded-[12px] p-5 space-y-3 animate-fade-in ${
                  currentCategory.playerWon
                    ? 'bg-amber-500/15 border-amber-500/40 ring-2 ring-amber-400 shadow-md'
                    : 'bg-[#0B0C10] border border-[#2A2E3D]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                      Ganador del Galardón
                    </span>
                  </div>
                  {currentCategory.playerWon ? (
                    <span className="bg-amber-400 text-stone-950 font-extrabold px-2.5 py-0.5 rounded-[4px] text-[10px] border border-amber-500 shadow-xs">
                      ¡VICTORIA PARA TI! 🎉
                    </span>
                  ) : (
                    <span className="text-xs text-[#94A3B8] font-mono">
                      Oficial
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                    {currentCategory.winnerArtistName}
                    {currentCategory.winnerItemTitle && (
                      <span className="font-normal text-[#94A3B8]">
                        — "{currentCategory.winnerItemTitle}"
                      </span>
                    )}
                  </h3>
                  {currentCategory.winnerReason && (
                    <p className="text-xs text-[#94A3B8] leading-relaxed italic">
                      "{currentCategory.winnerReason}"
                    </p>
                  )}
                </div>

                {/* Player celebration bonus pill */}
                {currentCategory.playerWon && (
                  <div className="bg-[#16181F] border border-amber-500/30 rounded-[8px] p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Recompensas obtenidas:
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="bg-amber-500/20 px-2 py-0.5 rounded-[4px] border border-amber-500/40 font-bold text-amber-300">
                        +5 Legado
                      </span>
                      <span className="bg-purple-500/20 px-2 py-0.5 rounded-[4px] border border-purple-500/40 font-bold text-purple-300">
                        +Hype & Reputación
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stepper Navigation Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2A2E3D]">
              <button
                id="btn-gala-prev"
                onClick={handlePrev}
                disabled={currentCategoryIndex === 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#2A2E3D] text-xs transition-colors cursor-pointer ${
                  currentCategoryIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-[#64748B]'
                    : 'bg-[#0B0C10] text-[#F8FAFC] hover:bg-[#2A2E3D]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                id="btn-gala-next"
                onClick={handleNext}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white px-4 py-1.5 rounded-[6px] text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.35)]"
              >
                <span>{currentCategoryIndex < categories.length - 1 ? 'Siguiente Categoría' : 'Ver Resumen Final'}</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
