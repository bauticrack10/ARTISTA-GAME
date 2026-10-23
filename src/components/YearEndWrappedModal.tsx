import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  Globe2,
  Disc3,
  Flame,
  ArrowRight,
  ArrowLeft,
  X,
  Share2,
  Check,
  TrendingUp,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { YearEndWrappedData } from '../types';
import { playSound } from '../utils/audioSystem';
import { formatMoney } from '../utils/formatters';

interface YearEndWrappedModalProps {
  data: YearEndWrappedData;
  isOpen: boolean;
  onDismiss: () => void;
}

export const YearEndWrappedModal: React.FC<YearEndWrappedModalProps> = ({
  data,
  isOpen,
  onDismiss
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      playSound('award');
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FF4F00', '#FF2A4B', '#10B981', '#D4AF37', '#F59E0B']
        });
      } catch (e) {
        // ignore in non-canvas
      }
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const totalSlides = 5;

  const handleNext = () => {
    playSound('click');
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onDismiss();
    }
  };

  const handlePrev = () => {
    playSound('click');
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    playSound('level_up');
    navigator.clipboard?.writeText(
      `Balance anual ${data.year} en El Artista (${data.artistName}):\n• ${data.totalStreamsYear.toLocaleString('es-AR')} streams acumulados\n• Corte principal: "${data.topSongTitle}"\n• Plaza fuerte: ${data.topCountryFlag} ${data.topCountry}\n"${data.quoteShareable}"`
    );
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      {/* Wrapped Story Container */}
      <div
        className="w-full max-w-[460px] h-[720px] max-h-[92vh] bg-[#111114] border border-[#242429] rounded-[6px] shadow-2xl flex flex-col overflow-hidden relative text-[#F4F4F6] select-none"
      >
        {/* Top Story Progress Bars */}
        <div className="p-4 flex items-center gap-1.5 z-20 border-b border-[#242429]">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 rounded-[1px] bg-[#242429] overflow-hidden"
            >
              <div
                className={`h-full bg-[#FF4F00] transition-all duration-300 ${
                  idx <= currentSlide ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          ))}
          <button
            onClick={() => {
              playSound('click');
              onDismiss();
            }}
            className="w-6 h-6 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#242429] flex items-center justify-center text-[#8E8E99] hover:text-[#F4F4F6] text-xs ml-2 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Story Slide Content */}
        <div className="flex-1 px-6 py-2 flex flex-col justify-between z-10 overflow-y-auto">
          {/* SLIDE 0: INTRO & TOTAL STREAMS */}
          {currentSlide === 0 && (
            <div className="space-y-6 my-auto text-center animate-fade-in">
              <span className="text-2xs font-sans uppercase tracking-wider text-[#FF4F00] bg-[#FF4F00]/10 border border-[#FF4F00]/30 px-3 py-1 rounded-[4px] inline-block">
                RESUMEN DE TEMPORADA • {data.year}
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F4F6] leading-tight">
                El mundo escuchó a <br />
                <span className="text-[#FF4F00]">
                  {data.artistName}
                </span>
              </h2>

              <div className="p-6 rounded-[4px] bg-[#09090B] border border-[#242429] space-y-2">
                <span className="text-xs uppercase text-[#8E8E99] font-sans tracking-wider block">
                  Reproducciones Totales en el Año
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold font-sans tabular-nums text-[#00E599] tracking-tight block">
                  {data.totalStreamsYear.toLocaleString('es-AR')}
                </span>
                <p className="text-2xs text-[#8E8E99]">
                  Reproducciones contabilizadas en plataformas digitales y distribuidoras durante los últimos doce meses.
                </p>
              </div>

              <div className="flex items-center justify-around text-xs bg-[#18181C] border border-[#242429] p-3 rounded-[4px]">
                <div>
                  <span className="text-2xs text-[#8E8E99] block uppercase font-sans">Fans Nuevos</span>
                  <strong className="text-[#F4F4F6] font-sans tabular-nums">
                    +{data.fansGainedYear.toLocaleString('es-AR')}
                  </strong>
                </div>
                <div className="w-px h-6 bg-[#242429]" />
                <div>
                  <span className="text-2xs text-[#8E8E99] block uppercase font-sans">Recaudación</span>
                  <strong className="text-[#00E599] font-sans tabular-nums">
                    {formatMoney(data.fundsEarnedYear)}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: TOP SONG */}
          {currentSlide === 1 && (
            <div className="space-y-6 my-auto text-center animate-fade-in">
              <span className="text-2xs font-sans uppercase tracking-wider text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3 py-1 rounded-[4px] inline-block">
                TU MAYOR HIT DEL AÑO
              </span>

              <div className="w-36 h-36 mx-auto rounded-[4px] bg-[#09090B] border border-[#242429] p-4 flex flex-col justify-between relative">
                <Disc3 className="w-8 h-8 text-[#FF4F00] animate-spin-slow" />
                <span className="text-xs font-bold text-[#F4F4F6] tracking-tight line-clamp-2">
                  {data.topSongTitle}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#F4F4F6]">"{data.topSongTitle}"</h3>
                <p className="text-xs text-[#8E8E99] font-sans tabular-nums">
                  {data.topSongStreams.toLocaleString('es-AR')} reproducciones
                </p>
              </div>

              {typeof data.peakGlobalChartPosition === 'number' && (
                <div className="bg-[#18181C] border border-[#242429] p-3 rounded-[4px] text-xs space-y-0.5">
                  <span className="text-2xs uppercase text-[#8E8E99] block font-sans">Peak en Charts Globales</span>
                  <span className="text-lg font-bold text-[#F59E0B] font-sans tabular-nums">
                    #{data.peakGlobalChartPosition}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* SLIDE 2: TOP COUNTRY */}
          {currentSlide === 2 && (
            <div className="space-y-6 my-auto text-center animate-fade-in">
              <span className="text-2xs font-sans uppercase tracking-wider text-[#8E8E99] bg-[#18181C] border border-[#242429] px-3 py-1 rounded-[4px] inline-block">
                TU CUARTEL GENERAL
              </span>

              <div className="w-20 h-20 mx-auto rounded-[4px] bg-[#09090B] border border-[#242429] flex items-center justify-center text-3xl">
                {data.topCountryFlag}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#F4F4F6]">
                  {data.topCountry}
                </h3>
                <p className="text-xs text-[#8E8E99] max-w-[280px] mx-auto">
                  La plaza con mayor volumen de escuchas activas, rotación en listas editoriales y demanda de tickets.
                </p>
              </div>

              <div className="bg-[#18181C] border border-[#242429] p-3 rounded-[4px] text-xs flex items-center justify-around font-sans">
                <div className="flex items-center gap-1.5 text-[#F4F4F6]">
                  <Globe2 className="w-4 h-4 text-[#FF4F00] shrink-0" />
                  <span className="font-semibold">Impacto Global</span>
                </div>
                <span className="text-[#8E8E99]">Género: <strong className="text-[#F4F4F6]">{data.dominantGenre}</strong></span>
              </div>
            </div>
          )}

          {/* SLIDE 3: AWARDS & HONORS */}
          {currentSlide === 3 && (
            <div className="space-y-5 my-auto text-center animate-fade-in">
              <span className="text-2xs font-sans uppercase tracking-wider text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3 py-1 rounded-[4px] inline-block">
                PREMIOS Y RECONOCIMIENTOS
              </span>

              <div className="w-16 h-16 mx-auto rounded-[4px] bg-[#F59E0B] text-[#09090B] flex items-center justify-center">
                <Trophy className="w-8 h-8 text-[#09090B]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#F4F4F6]">
                  {data.awardsWonYear && data.awardsWonYear.length > 0
                    ? `¡${data.awardsWonYear.length} Galardón${data.awardsWonYear.length > 1 ? 'es' : ''} Ganados!`
                    : 'Construyendo el Legado'}
                </h3>
                <p className="text-xs text-[#8E8E99]">
                  {data.awardsWonYear && data.awardsWonYear.length > 0
                    ? 'Los jurados de la industria y la prensa especializada respaldaron el peso de tu catálogo este año.'
                    : 'Doce meses de trabajo de estudio, armado de catálogo y rodaje sin estatuillas por ahora.'}
                </p>
              </div>

              {data.awardsWonYear && data.awardsWonYear.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {data.awardsWonYear.map((award, i) => (
                    <div
                      key={i}
                      className="bg-[#18181C] border border-[#242429] rounded-[4px] p-2 text-xs text-[#F59E0B] font-semibold flex items-center gap-2 justify-center font-sans"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                      <span>{award}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SLIDE 4: INDUSTRY VERDICT & SHARE */}
          {currentSlide === 4 && (
            <div className="space-y-5 my-auto text-center animate-fade-in">
              <span className="text-2xs font-sans uppercase tracking-wider text-[#8E8E99] bg-[#18181C] border border-[#242429] px-3 py-1 rounded-[4px] inline-block">
                EL VEREDICTO DE LA INDUSTRIA
              </span>

              <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-5 space-y-3">
                <p className="text-sm font-semibold text-[#F4F4F6] italic leading-relaxed">
                  "{data.industryVerdict}"
                </p>
                <div className="pt-2 border-t border-[#242429] text-2xs text-[#8E8E99] font-sans">
                  BILLBOARD • ROLLING STONE • SPOTIFY MUSIC
                </div>
              </div>

              <div className="p-3 bg-[#18181C] border border-[#242429] rounded-[4px] text-xs space-y-1 text-[#8E8E99]">
                <span className="font-bold text-[#8E8E99] block text-2xs uppercase font-sans">Para compartir:</span>
                <p className="font-sans text-xs text-[#F4F4F6]">
                  "{data.quoteShareable}"
                </p>
              </div>

              <button
                onClick={handleShare}
                className="w-full bg-[#18181C] hover:bg-[#242429] border border-[#242429] text-[#F4F4F6] py-2.5 rounded-[4px] text-xs font-sans font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-[#00E599]" />
                    <span className="text-[#00E599]">¡Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Compartir Resumen</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="p-4 border-t border-[#242429] bg-[#111114] flex items-center justify-between gap-3 z-20">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-sans font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              currentSlide === 0
                ? 'opacity-30 pointer-events-none text-[#52525B]'
                : 'text-[#8E8E99] hover:text-[#F4F4F6] bg-[#18181C] border border-[#242429]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Atrás</span>
          </button>

          <span className="text-2xs font-sans tabular-nums text-[#8E8E99]">
            {currentSlide + 1} / {totalSlides}
          </span>

          <button
            onClick={handleNext}
            className="bg-[#FF4F00] hover:bg-[#E04500] text-white px-5 py-1.5 rounded-[4px] text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-[1px]"
          >
            <span>{currentSlide === totalSlides - 1 ? 'Finalizar' : 'Siguiente'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
