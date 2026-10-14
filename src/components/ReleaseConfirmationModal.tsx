import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  Disc3,
  Layers,
  Music2,
  Calendar,
  DollarSign,
  Clapperboard,
  Crown,
  ArrowRight,
  Sliders,
  Flame,
  Radio,
  Clock,
  Heart,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReleaseConfirmationData } from '../types';
import { formatMoney, formatReleaseDate } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';

export interface ReleaseConfirmationModalProps {
  data: ReleaseConfirmationData;
  onClose: () => void;
  onNavigateToCatalog?: () => void;
}

export const ReleaseConfirmationModal: React.FC<ReleaseConfirmationModalProps> = ({
  data,
  onClose,
  onNavigateToCatalog
}) => {
  // Midnight Countdown Ritual states
  const [countdownPhase, setCountdownPhase] = useState<'countdown' | 'revealed'>('countdown');
  const [secondsLeft, setSecondsLeft] = useState<number>(3);
  const [streamTicker, setStreamTicker] = useState<number>(0);

  // Target first-day streams based on song's initial burst
  const targetInitialStreams = Math.max(12500, Math.floor(data.totalBudget * 4.5 + Math.random() * 25000));

  // Countdown timer effect
  useEffect(() => {
    if (countdownPhase === 'countdown') {
      if (secondsLeft > 0) {
        playSound('click');
        const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 700);
        return () => clearTimeout(timer);
      } else {
        // Drop reached!
        playSound('chart_no1');
        setCountdownPhase('revealed');
        try {
          confetti({
            particleCount: 110,
            spread: 85,
            origin: { y: 0.55 },
            colors: ['#8B5CF6', '#EC4899', '#10B981', '#06B6D4', '#F59E0B', '#F8FAFC']
          });
        } catch (e) {
          // ignore
        }
      }
    }
  }, [countdownPhase, secondsLeft]);

  // Stream ticker increment effect
  useEffect(() => {
    if (countdownPhase === 'revealed') {
      let current = 0;
      const step = Math.ceil(targetInitialStreams / 20);
      const interval = setInterval(() => {
        current = Math.min(targetInitialStreams, current + step);
        setStreamTicker(current);
        if (current >= targetInitialStreams) {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [countdownPhase, targetInitialStreams]);

  const handleSkipCountdown = () => {
    playSound('chart_no1');
    setCountdownPhase('revealed');
    setStreamTicker(targetInitialStreams);
  };

  const handleClose = () => {
    playSound('click');
    if (onNavigateToCatalog) {
      onNavigateToCatalog();
    } else {
      onClose();
    }
  };

  // Format type label & badge styling
  const getTypeBadge = (type: string) => {
    const t = type.toLowerCase();
    switch (t) {
      case 'single':
        return {
          label: 'Single Oficial',
          className: 'bg-purple-950/70 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]',
          icon: Disc3
        };
      case 'ep':
        return {
          label: 'EP • Extended Play',
          className: 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
          icon: Layers
        };
      case 'mixtape':
        return {
          label: 'Mixtape Callejera',
          className: 'bg-amber-950/70 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
          icon: Music2
        };
      case 'album':
        return {
          label: 'Álbum de Estudio • LP',
          className: 'bg-gradient-to-r from-violet-900/80 to-pink-900/80 border-pink-500/50 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.35)]',
          icon: Layers
        };
      case 'deluxe':
        return {
          label: 'Edición Deluxe',
          className: 'bg-gradient-to-r from-amber-900/80 to-yellow-900/80 border-yellow-500/50 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.35)]',
          icon: Crown
        };
      case 'collab_album':
        return {
          label: 'Álbum Colaborativo',
          className: 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
          icon: Layers
        };
      default:
        return {
          label: type.toUpperCase(),
          className: 'bg-slate-900/80 border-slate-700 text-slate-200',
          icon: Disc3
        };
    }
  };

  const typeConfig = getTypeBadge(data.type);
  const TypeIcon = typeConfig.icon;
  const coverGrad = data.coverGradient || 'from-violet-600 via-fuchsia-600 to-indigo-950';

  // 1. COUNTDOWN SCREEN (EL RITUAL DE MEDIANOCHE)
  if (countdownPhase === 'countdown') {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-fade-in">
        <div className="max-w-md w-full text-center space-y-8 relative">
          <div className="w-40 h-40 mx-auto relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping opacity-30" />
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary via-accent to-pink-500 p-1 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.6)]">
              <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tighter">
                  {secondsLeft > 0 ? `0${secondsLeft}` : '00:00'}
                </span>
                <span className="text-3xs uppercase tracking-widest text-primary-soft mt-1">
                  {secondsLeft > 0 ? 'CONTEO REGRESIVO' : '¡EN LA CALLE!'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-2xs font-mono uppercase tracking-widest text-fg-muted bg-white/5 border border-white/10 px-3 py-1 rounded-full inline-block">
              ESTRENO MUNDIAL EN STREAMING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              "{data.title}"
            </h2>
            <p className="text-xs text-fg-muted">
              Subiendo a Spotify, Apple Music, YouTube y TikTok...
            </p>
          </div>

          <button
            onClick={handleSkipCountdown}
            className="text-2xs font-semibold text-fg-muted hover:text-white uppercase tracking-wider underline cursor-pointer transition-colors"
          >
            Saltar Conteo ➔
          </button>
        </div>
      </div>
    );
  }

  // 2. REVEALED RELEASE DASHBOARD
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div
        className="bg-surface border border-line max-w-2xl sm:max-w-3xl w-full rounded-panel flex flex-col overflow-hidden text-fg shadow-2xl relative my-auto max-h-[92vh]"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-primary/30 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-line bg-surface/90 backdrop-blur-md flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-canvas border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-2xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-sm inline-block">
                Lanzamiento Exitoso • En Vivo a las 00:00
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-fg">
                Publicación Oficial Completada
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-line text-fg-muted hover:text-fg transition-colors cursor-pointer"
            title="Cerrar confirmación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 relative z-10">
          {/* Dopamine Stream Ticker Banner */}
          <div className="bg-gradient-to-r from-purple-950/50 via-surface to-emerald-950/50 border border-primary/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.35)]">
                <Flame className="w-6 h-6 text-primary-soft animate-pulse" />
              </div>
              <div>
                <span className="text-3xs uppercase font-bold text-primary-soft tracking-wider block">
                  Primeras 24 Horas • Streaming Surge
                </span>
                <h3 className="text-sm font-bold text-fg">
                  ¡El algoritmo comenzó a recomendar tu tema a nivel global!
                </h3>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-xl text-center sm:text-right shrink-0">
              <span className="text-3xs uppercase text-fg-muted block">Reproducciones Iniciales</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                +{streamTicker.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {/* Project Presentation Hero Box (Cover + Metadata) */}
          <div className="bg-canvas border border-line rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 shadow-inner">
            {/* Thematic Cover Art Box */}
            <div className="relative group shrink-0 mx-auto sm:mx-0">
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-xl bg-gradient-to-br ${coverGrad} border-2 border-line shadow-2xl flex flex-col justify-between p-3.5 text-white relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-radial from-transparent via-white/[0.06] to-black/40 pointer-events-none" />
                <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full border-4 border-white/10 opacity-30 pointer-events-none" />

                {/* Top Badge on Cover */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-2xs font-bold uppercase tracking-wider bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-sm border border-white/20">
                    {data.type}
                  </span>
                  <Disc3 className="w-4 h-4 text-white/70 animate-spin-slow" />
                </div>

                {/* Bottom Title on Cover */}
                <div className="relative z-10 space-y-0.5">
                  <span className="text-2xs font-mono text-white/80 block uppercase tracking-wider">
                    {data.releaseYear}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                    {data.title}
                  </h4>
                </div>
              </div>

              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border border-white/20">
                <Music2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Project Details & Badges */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${typeConfig.className}`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                  <span>{typeConfig.label}</span>
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface border border-line text-[#CBD5E1] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Estreno: <strong className="text-fg">{formatReleaseDate(data.releaseMonth, data.releaseYear, 'long')}</strong></span>
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-fg break-words">
                  {data.title}
                </h3>
                <p className="text-xs text-fg-muted mt-0.5 flex items-center gap-2">
                  <span>{data.songCount} {data.songCount === 1 ? 'Pista' : 'Pistas en catálogo'}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Masterizado en 24-bit 96kHz</span>
                </p>
              </div>

              {/* Genres & Collaborators */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/20 border border-primary/40 text-primary-soft">
                  {data.genreName}
                </span>

                {data.subGenreName && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface border border-line text-[#CBD5E1]">
                    {data.subGenreName}
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>{data.producerName ? `Prod: ${data.producerName}` : 'Producción Propia'}</span>
                </span>

                {data.featuredArtistNames && data.featuredArtistNames.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-950/60 border border-pink-500/40 text-pink-300">
                    ft. {data.featuredArtistNames.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cascading Fan Reactions (Dopamine Feed) */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
              Primeras Reacciones del Público en Redes
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-canvas border border-line p-2.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-3xs text-fg-muted">
                  <span className="font-bold text-fg">@mateo_urbano</span>
                  <span>hace 10m</span>
                </div>
                <p className="text-2xs text-slate-200">
                  "Uff hermano el beat del estribillo me voló la cabeza, temazo total 🔥"
                </p>
              </div>

              <div className="bg-canvas border border-line p-2.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-3xs text-fg-muted">
                  <span className="font-bold text-fg">@sofia_music</span>
                  <span>hace 18m</span>
                </div>
                <p className="text-2xs text-slate-200">
                  "Directo a mi playlist de favoritos, no la voy a parar de escuchar ✨"
                </p>
              </div>

              <div className="bg-canvas border border-line p-2.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-3xs text-fg-muted">
                  <span className="font-bold text-fg">@trap_flow_arg</span>
                  <span>hace 25m</span>
                </div>
                <p className="text-2xs text-slate-200">
                  "Se fue mundial hermano, esto entra directo a los charts 📈"
                </p>
              </div>
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="bg-canvas border border-line rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-xs font-semibold text-fg flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Inversión Total en el Proyecto
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {formatMoney(data.totalBudget)}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-2xs font-mono">
              <div className="bg-surface p-2 rounded-lg border border-line">
                <span className="text-3xs text-fg-muted block uppercase">Producción</span>
                <span className="font-bold text-warning">{formatMoney(data.budgetBreakdown?.production ?? 0)}</span>
              </div>
              <div className="bg-surface p-2 rounded-lg border border-line">
                <span className="text-3xs text-fg-muted block uppercase">Marketing</span>
                <span className="font-bold text-emerald-400">{formatMoney(data.budgetBreakdown?.marketing ?? 0)}</span>
              </div>
              <div className="bg-surface p-2 rounded-lg border border-line">
                <span className="text-3xs text-fg-muted block uppercase">Productor</span>
                <span className="font-bold text-cyan-400">{formatMoney(data.budgetBreakdown?.producerFee ?? 0)}</span>
              </div>
              <div className="bg-surface p-2 rounded-lg border border-line">
                <span className="text-3xs text-fg-muted block uppercase">Videoclip</span>
                <span className="font-bold text-primary-soft">{formatMoney(data.budgetBreakdown?.videoCost ?? (data.musicVideo?.budget ?? 0))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-line bg-surface/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <span className="text-xs text-fg-muted text-center sm:text-left">
            ¡Tu lanzamiento ya está en la calle y compitiendo en el mercado!
          </span>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Ir al Catálogo & Estadísticas</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
