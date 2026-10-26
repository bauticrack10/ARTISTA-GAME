import React, { useState, useEffect } from 'react';
import { Sparkles, Disc3, ArrowRight, X } from 'lucide-react';
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
      className={`relative z-30 liquid-glass-card border border-[#FF4F00]/40 p-3 sm:p-4 shadow-[0_10px_30px_rgba(255,79,0,0.18)] transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-gradient-to-b from-[#FF5F1A] to-[#FF3B00] text-white flex items-center justify-center shrink-0 shadow-[0_2px_0_#992500] mt-0.5 animate-bounce">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF4F00] font-game">
                Primer Paso Recomendado
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#FF4F00]/20 text-[#FF4F00] border border-[#FF4F00]/30 animate-pulse">
                Acción Activa
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-white leading-tight font-sans">
              ¡Graba tu primer single o realiza una acción del mes!
            </h4>

            <p className="text-xs text-[#8E8E99] leading-snug">
              Ingresa al Estudio para componer tu tema debut o utiliza las acciones del mes abajo para entrenar voz y ganar vitalidad.
            </p>

            <div className="pt-1.5 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAction}
                className="kit-btn kit-btn-orange py-1.5 px-3 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Disc3 className="w-3.5 h-3.5 shrink-0" />
                <span>Grabar en Estudio</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="px-2.5 py-1 text-xs text-[#8E8E99] hover:text-white transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-[4px] hover:bg-white/10 text-[#8E8E99] hover:text-white transition-colors cursor-pointer shrink-0"
          title="Descartar recomendación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default QuickOnboardingTooltip;
