import React, { useState, useEffect } from 'react';
import { Disc3, ArrowRight, X } from 'lucide-react';
import { playSound } from '../../utils/audioSystem';

export interface QuickOnboardingTooltipProps {
  playerSongsCount: number;
  onNavigate: (tab: string) => void;
  className?: string;
}

export const QuickOnboardingTooltip: React.FC<QuickOnboardingTooltipProps> = ({
  playerSongsCount,
  onNavigate,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    try {
      return localStorage.getItem('el_artista_onboarding_tooltip_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  // Si el jugador ya grabó al menos una canción, se descarta automáticamente
  useEffect(() => {
    if (playerSongsCount > 0 && isVisible) {
      setIsVisible(false);
      try {
        localStorage.setItem('el_artista_onboarding_tooltip_dismissed', 'true');
      } catch {}
    }
  }, [playerSongsCount, isVisible]);

  const handleDismiss = () => {
    playSound('click');
    setIsVisible(false);
    try {
      localStorage.setItem('el_artista_onboarding_tooltip_dismissed', 'true');
    } catch {}
  };

  const handleAction = () => {
    playSound('click');
    handleDismiss();
    onNavigate('studio');
  };

  if (!isVisible || playerSongsCount > 0) return null;

  return (
    <aside
      aria-label="Recomendación inicial"
      className={`surface-1 bg-[#111114] border border-[#FF4F00]/45 rounded-[6px] p-3.5 sm:p-4 transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#FF4F00] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Disc3 className="w-4 h-4" />
          </div>

          <div className="space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#FF4F00] font-sans block">
              Sugerencia de Debut
            </span>

            <h4 className="text-sm font-bold text-[#F4F4F6] leading-tight font-sans">
              Grabá tu primer single para empezar a sumar oyentes
            </h4>

            <p className="text-xs text-[#8E8E99] leading-snug">
              Entrá al Estudio para lanzar tu tema debut o entrená abajo en Acciones del Mes antes de publicar.
            </p>

            <div className="pt-1.5 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAction}
                className="rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white py-1.5 px-3 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Disc3 className="w-3.5 h-3.5 shrink-0" />
                <span>Grabar en Estudio</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="px-2.5 py-1.5 rounded-[4px] surface-2 bg-[#18181C] border border-[#242429] text-xs text-[#8E8E99] hover:text-white transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-white transition-colors cursor-pointer shrink-0"
          title="Descartar recomendación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default QuickOnboardingTooltip;
