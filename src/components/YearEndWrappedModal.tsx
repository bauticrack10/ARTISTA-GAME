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
          colors: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#38BDF8']
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
      `🎧 Mi resumen musical del ${data.year} en El Artista:\n🔥 ${data.totalStreamsYear.toLocaleString('es-AR')} reproducciones totales\n👑 Hit: "${data.topSongTitle}"\n🌍 País Top: ${data.topCountryFlag} ${data.topCountry}\n"${data.quoteShareable}"`
    );
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      {/* Wrapped Story Container */}
      <div
        className="w-full max-w-[460px] h-[720px] max-h-[92vh] bg-gradient-to-b from-[#13111C] via-[#0E0F14] to-black border-2 border-primary/40 rounded-[36px] shadow-[0_0_80px_rgba(139,92,246,0.4)] flex flex-col overflow-hidden relative text-fg select-none"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Top Story Progress Bars */}
        <div className="p-4 flex items-center gap-1.5 z-20">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden"
            >
              <div
                className={`h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ${
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
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Story Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Story Slide Content */}
        <div className="flex-1 px-6 py-2 flex flex-col justify-between z-10 overflow-y-auto">
          {/* SLIDE 0: INTRO & TOTAL STREAMS */}
          {currentSlide === 0 && (
            <div className="space-y-6 my-auto text-center animate-fade-in">
              <span className="text-3xs font-mono uppercase tracking-widest text-primary-soft bg-primary/20 border border-primary/40 px-3 py-1 rounded-full inline-block">
                RESUMEN DE TEMPORADA • {data.year}
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                El mundo escuchó a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-soft via-accent to-white">
                  {data.artistName}
                </span>
              </h2>

              <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900/60 border border-purple-500/30 shadow-inner space-y-2">
                <span className="text-xs uppercase text-fg-muted tracking-wider block">
                  Reproducciones Totales en el Año
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight block">
                  {data.totalStreamsYear.toLocaleString('es-AR')}
                </span>
                <p className="text-2xs text-fg-muted">
                  Millones de personas sintonizaron tu música en las plataformas globales.
                </p>
              </div>

              <div className="flex items-center justify-around text-xs bg-surface/80 border border-line p-3 rounded-xl">
                <div>
                  <span className="text-3xs text-fg-muted block uppercase">Fans Nuevos</span>
                  <strong className="text-primary-soft font-mono">
                    +{data.fansGainedYear.toLocaleString('es-AR')}
                  </strong>
                </div>
                <div className="w-px h-6 bg-line" />
                <div>
                  <span className="text-3xs text-fg-muted block uppercase">Recaudación</span>
                  <strong className="text-emerald-400 font-mono">
                    {formatMoney(data.fundsEarnedYear)}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: TOP SONG */}
          {currentSlide === 1 && (
            <div className="space-y-6 my-auto text-center animate-fade-in">
              <span className="text-3xs font-mono uppercase tracking-widest text-warning bg-warning/20 border border-warning/40 px-3 py-1 rounded-full inline-block">
                TU MAYOR HIT DEL AÑO
              </span>

              <div className="w-36 h-36 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-900 p-4 flex flex-col justify-between shadow-2xl border-2 border-white/20 relative">
                <Disc3 className="w-8 h-8 text-white/80 animate-spin-slow" />
                <span className="text-xs font-bold text-white tracking-tight line-clamp-2">
                  {data.topSongTitle}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">"{data.topSongTitle}"</h3>
                <p className="text-xs text-primary-soft font-semibold">
                  {data.topSongStreams.toLocaleString('es-AR')} reproducciones
                </p>
              </div>

              {typeof data.peakGlobalChartPosition === 'number' && (
                <div className="bg-surface/80 border border-line p-3 rounded-xl text-xs space-y-0.5">
                  <span className="text-3xs uppercase text-fg-muted block">Peak en Charts Globales</span>
                  <span className="text-lg font-bold text-warning font-mono">
                    #{data.peakGlobalChartPosition}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* SLIDE 2: TOP COUNTRY */}
          {currentSlide === 2 && (
            <div className="space-y-6 my-auto text-center animate-fade-in">
              <span className="text-3xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-full inline-block">
                TU CUARTEL GENERAL
              </span>

              <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                {data.topCountryFlag}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {data.topCountry}
                </h3>
                <p className="text-xs text-fg-muted max-w-[280px] mx-auto">
                  Fue el territorio donde tu música se escuchó con mayor devoción, liderando las playlists urbanas locales.
                </p>
              </div>

              <div className="bg-surface/80 border border-line p-3 rounded-xl text-xs flex items-center justify-around">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <Globe2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Impacto Internacional</span>
                </div>
                <span className="text-fg-muted">Género: <strong className="text-white">{data.dominantGenre}</strong></span>
              </div>
            </div>
          )}

          {/* SLIDE 3: AWARDS & HONORS */}
          {currentSlide === 3 && (
            <div className="space-y-5 my-auto text-center animate-fade-in">
              <span className="text-3xs font-mono uppercase tracking-widest text-yellow-400 bg-yellow-950/60 border border-yellow-500/40 px-3 py-1 rounded-full inline-block">
                PREMIOS Y RECONOCIMIENTOS
              </span>

              <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500/15 border-2 border-yellow-500/40 flex items-center justify-center text-yellow-400 shadow-[0_0_35px_rgba(234,179,8,0.3)]">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  {data.awardsWonYear && data.awardsWonYear.length > 0
                    ? `¡${data.awardsWonYear.length} Galardón${data.awardsWonYear.length > 1 ? 'es' : ''} Ganados!`
                    : 'Construyendo el Legado'}
                </h3>
                <p className="text-xs text-fg-muted">
                  {data.awardsWonYear && data.awardsWonYear.length > 0
                    ? 'La Academia y la crítica especializada premiaron tu excelencia artística este año.'
                    : 'Un año de siembra y consolidación con la mirada puesta en las próximas galas.'}
                </p>
              </div>

              {data.awardsWonYear && data.awardsWonYear.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {data.awardsWonYear.map((award, i) => (
                    <div
                      key={i}
                      className="bg-yellow-950/30 border border-yellow-500/30 rounded-lg p-2 text-xs text-yellow-200 font-semibold flex items-center gap-2 justify-center"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
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
              <span className="text-3xs font-mono uppercase tracking-widest text-pink-400 bg-pink-950/60 border border-pink-500/40 px-3 py-1 rounded-full inline-block">
                EL VEREDICTO DE LA INDUSTRIA
              </span>

              <div className="bg-gradient-to-b from-purple-950/60 to-surface border border-purple-500/40 rounded-2xl p-5 space-y-3 shadow-xl">
                <p className="text-sm font-semibold text-white italic leading-relaxed">
                  "{data.industryVerdict}"
                </p>
                <div className="pt-2 border-t border-line text-3xs text-fg-muted font-mono">
                  BILLBOARD • ROLLING STONE • SPOTIFY MUSIC
                </div>
              </div>

              <div className="p-3 bg-surface/70 border border-line rounded-xl text-xs space-y-1 text-slate-300">
                <span className="font-bold text-fg-muted block text-3xs uppercase">Para compartir:</span>
                <p className="font-mono text-2xs text-primary-soft">
                  "{data.quoteShareable}"
                </p>
              </div>

              <button
                onClick={handleShare}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Copiado al Portapapeles!</span>
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
        <div className="p-4 border-t border-line bg-surface/80 flex items-center justify-between gap-3 z-20">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              currentSlide === 0
                ? 'opacity-30 pointer-events-none text-fg-muted'
                : 'text-fg-muted hover:text-fg bg-surface border border-line'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Atrás</span>
          </button>

          <span className="text-3xs font-mono text-fg-muted">
            {currentSlide + 1} / {totalSlides}
          </span>

          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary-strong hover:to-[#DB2777] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
          >
            <span>{currentSlide === totalSlides - 1 ? 'Finalizar' : 'Siguiente'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
