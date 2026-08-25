import React, { useState } from 'react';
import { AwardCeremony, AwardCategory, Artist } from '../types';
import {
  Trophy,
  Crown,
  Sparkles,
  Disc3,
  Sliders,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  PartyPopper,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AwardsGalaModalProps {
  ceremony: AwardCeremony;
  player: Artist;
  onClose: () => void;
}

export const AwardsGalaModal: React.FC<AwardsGalaModalProps> = ({ ceremony, player, onClose }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
  const [revealedCategories, setRevealedCategories] = useState<Record<number, boolean>>({});

  const categories = ceremony.categories || [];
  const currentCategory: AwardCategory | undefined = categories[currentCategoryIndex];

  const handleRevealWinner = (index: number) => {
    setRevealedCategories(prev => ({ ...prev, [index]: true }));
    const cat = categories[index];
    if (cat && cat.winnerArtistId === player.id) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#06b6d4', '#f97316', '#ffd700']
        });
      } catch (e) {}
    }
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    }
  };

  const handlePrevCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  const isCurrentRevealed = !!revealedCategories[currentCategoryIndex];
  const allRevealed = categories.every((_, idx) => !!revealedCategories[idx]);

  const playerTotalNominations = categories.filter(c =>
    c.nomineeArtistIds.includes(player.id) || c.nominees?.some(n => n.artistId === player.id)
  ).length;

  const playerTotalWins = categories.filter(c => c.winnerArtistId === player.id).length;

  const getCategoryIcon = (name: string) => {
    if (name.includes('Artista')) return Crown;
    if (name.includes('Canción')) return Disc3;
    if (name.includes('Álbum')) return Trophy;
    if (name.includes('Nuevo') || name.includes('Revelación')) return Sparkles;
    if (name.includes('Producción')) return Sliders;
    return Award;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#f7f4ed] border border-[#eceae4] rounded-[16px] max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#1c1c1c] shadow-2xl"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#eceae4] bg-[#f7f4ed] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[8px] bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-sm"
              style={{
                boxShadow:
                  'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
              }}
            >
              <Trophy className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.2 rounded-[4px] inline-block mb-1">
                Gala Anual de la Música • Diciembre {ceremony.year}
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.9px] text-[#1c1c1c]">
                {ceremony.name || `Premios Pulso & Vanguardia ${ceremony.year}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#fcfbf8] px-3 py-1 rounded-[6px] border border-[#eceae4] text-xs font-mono">
              <span className="text-[#5f5f5d]">Nominaciones: </span>
              <strong className="text-purple-700 font-bold">{playerTotalNominations}</strong>
              <span className="mx-1 text-[#eceae4]">|</span>
              <span className="text-[#5f5f5d]">Victorias: </span>
              <strong className="text-amber-700 font-bold">{playerTotalWins}</strong>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[6px] hover:bg-[#eceae4] text-[#5f5f5d] hover:text-[#1c1c1c] transition-colors cursor-pointer"
              title="Cerrar Gala"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Category Presenter */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Category Tabs Indicator */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 border-b border-[#eceae4]">
            {categories.map((cat, idx) => {
              const isRevealed = !!revealedCategories[idx];
              const isCurrent = currentCategoryIndex === idx;
              const playerWin = cat.winnerArtistId === player.id;
              const Icon = getCategoryIcon(cat.name);

              return (
                <button
                  key={cat.id || idx}
                  onClick={() => setCurrentCategoryIndex(idx)}
                  className={`px-3 py-2 rounded-[6px] text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1c1c1c] text-[#fcfbf8] font-bold shadow-sm'
                      : 'bg-[#fcfbf8] text-[#5f5f5d] hover:bg-[#eceae4] border border-[#eceae4]'
                  }`}
                  style={
                    isCurrent
                      ? {
                          boxShadow:
                            'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                        }
                      : {}
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  {isRevealed && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        playerWin ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Category Card */}
          {currentCategory && (
            <div className="bg-[#fcfbf8] border border-amber-200/80 rounded-[12px] p-6 space-y-5 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#5f5f5d] block">
                    Categoría {currentCategoryIndex + 1} de {categories.length}
                  </span>
                  <h3 className="text-2xl font-semibold tracking-[-0.9px] text-[#1c1c1c] mt-0.5">
                    {currentCategory.name}
                  </h3>
                  {currentCategory.description && (
                    <p className="text-xs text-[#5f5f5d] mt-1">
                      {currentCategory.description}
                    </p>
                  )}
                </div>

                {!isCurrentRevealed ? (
                  <button
                    onClick={() => handleRevealWinner(currentCategoryIndex)}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 border border-amber-300 px-4 py-2 rounded-[6px] text-xs font-bold hover:opacity-90 active:opacity-80 transition-all cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-amber-900 animate-pulse" />
                    <span>Revelar Ganador</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-[6px] border border-emerald-300 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ganador Revelado</span>
                  </div>
                )}
              </div>

              {/* Nominees List */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5f5f5d] block">
                  Artistas y Obras Nominadas
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(currentCategory.nominees || []).map((nominee, nIdx) => {
                    const isWinner = isCurrentRevealed && nominee.artistId === currentCategory.winnerArtistId;
                    const isPlayerNominee = nominee.artistId === player.id;

                    return (
                      <div
                        key={nominee.artistId + nIdx}
                        className={`p-3 rounded-[8px] border transition-all ${
                          isWinner
                            ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400'
                            : isPlayerNominee
                            ? 'bg-purple-50/40 border-purple-300'
                            : 'bg-[#f7f4ed] border-[#eceae4]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-700 w-4 font-mono">
                              #{nIdx + 1}
                            </span>
                            <div>
                              <h4 className="text-xs font-semibold text-[#1c1c1c] flex items-center gap-1.5">
                                {nominee.itemTitle ? `"${nominee.itemTitle}" — ` : ''}
                                {nominee.artistName}
                                {isPlayerNominee && (
                                  <span className="text-[9px] bg-purple-200 text-purple-900 font-bold px-1.5 py-0.2 rounded-[4px]">
                                    TÚ
                                  </span>
                                )}
                              </h4>
                              {nominee.highlightText && (
                                <p className="text-[10px] text-[#5f5f5d] mt-0.5">
                                  {nominee.highlightText}
                                </p>
                              )}
                            </div>
                          </div>

                          {isWinner && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold border border-amber-400">
                              <Trophy className="w-3 h-3 text-amber-900" />
                              <span>GANADOR</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Winner Announcement Card if revealed */}
              {isCurrentRevealed && (
                <div
                  className={`p-5 rounded-[12px] border mt-4 animate-fade-in ${
                    currentCategory.winnerArtistId === player.id
                      ? 'bg-amber-50/90 border-amber-300 text-amber-950 ring-2 ring-amber-400'
                      : 'bg-[#f7f4ed] border-[#eceae4] text-[#1c1c1c]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-[8px] flex items-center justify-center shrink-0 ${
                        currentCategory.winnerArtistId === player.id
                          ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-amber-950 shadow-md'
                          : 'bg-[#1c1c1c] text-[#fcfbf8]'
                      }`}
                      style={{
                        boxShadow:
                          'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                      }}
                    >
                      <Trophy className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[4px] bg-amber-100 text-amber-900 border border-amber-300">
                          Estatuilla Oficial de la Academia
                        </span>
                        {currentCategory.winnerArtistId === player.id && (
                          <span className="text-xs font-bold text-amber-900 bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                            <PartyPopper className="w-3.5 h-3.5" />
                            ¡FELICIDADES! HAS GANADO ESTA CATEGORÍA
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-semibold tracking-tight">
                        {currentCategory.winnerItemTitle ? `"${currentCategory.winnerItemTitle}" — ` : ''}
                        {currentCategory.winnerArtistName}
                      </h4>

                      {currentCategory.winnerReason && (
                        <p className="text-xs opacity-85 leading-relaxed italic">
                          {currentCategory.winnerReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="p-5 border-t border-[#eceae4] bg-[#f7f4ed] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevCategory}
              disabled={currentCategoryIndex === 0}
              className="px-3.5 py-1.5 rounded-[6px] text-xs font-semibold bg-[#fcfbf8] text-[#1c1c1c] border border-[#eceae4] hover:bg-[#eceae4] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Anterior
            </button>
            <button
              onClick={handleNextCategory}
              disabled={currentCategoryIndex >= categories.length - 1}
              className="px-3.5 py-1.5 rounded-[6px] text-xs font-semibold bg-[#fcfbf8] text-[#1c1c1c] border border-[#eceae4] hover:bg-[#eceae4] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Siguiente
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!allRevealed && (
              <button
                onClick={() => {
                  const allRev: Record<number, boolean> = {};
                  categories.forEach((_, idx) => {
                    allRev[idx] = true;
                  });
                  setRevealedCategories(allRev);
                }}
                className="text-xs text-[#5f5f5d] hover:text-[#1c1c1c] underline cursor-pointer font-semibold"
              >
                Revelar Todas las Categorías
              </button>
            )}

            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-[#1c1c1c] text-[#fcfbf8] px-5 py-2 rounded-[6px] text-xs font-semibold hover:opacity-90 active:opacity-80 transition-all cursor-pointer"
              style={{
                boxShadow:
                  'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
              }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Concluir Gala y Guardar Trofeos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
