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
          className: 'bg-[#18181C] border border-[#242429] text-[#F4F4F6] rounded-[4px] font-mono',
          icon: Disc3
        };
      case 'ep':
        return {
          label: 'EP • Extended Play',
          className: 'bg-[#18181C] border border-cyan-800/60 text-cyan-300 rounded-[4px] font-mono',
          icon: Layers
        };
      case 'mixtape':
        return {
          label: 'Mixtape Callejera',
          className: 'bg-[#18181C] border border-amber-800/60 text-amber-300 rounded-[4px] font-mono',
          icon: Music2
        };
      case 'album':
        return {
          label: 'Álbum de Estudio • LP',
          className: 'bg-[#18181C] border border-[#FF4F00]/60 text-[#FF4F00] rounded-[4px] font-mono',
          icon: Layers
        };
      case 'deluxe':
        return {
          label: 'Edición Deluxe',
          className: 'bg-[#18181C] border border-amber-600/60 text-amber-300 rounded-[4px] font-mono',
          icon: Crown
        };
      case 'collab_album':
        return {
          label: 'Álbum Colaborativo',
          className: 'bg-[#18181C] border border-emerald-800/60 text-emerald-300 rounded-[4px] font-mono',
          icon: Layers
        };
      default:
        return {
          label: type.toUpperCase(),
          className: 'bg-[#18181C] border border-[#242429] text-[#F4F4F6] rounded-[4px] font-mono',
          icon: Disc3
        };
    }
  };

  const typeConfig = getTypeBadge(data.type);
  const TypeIcon = typeConfig.icon;
  const coverGrad = data.coverGradient || 'from-stone-900 via-zinc-900 to-black';

  // 1. COUNTDOWN SCREEN (EL RITUAL DE MEDIANOCHE)
  if (countdownPhase === 'countdown') {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
        <div className="max-w-md w-full text-center space-y-8 relative">
          <div className="w-40 h-40 mx-auto relative flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-[#FF4F00] bg-[#09090B] flex items-center justify-center p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-[#111114] flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono text-[#FF4F00] tabular-nums tracking-tighter">
                  {secondsLeft > 0 ? `0${secondsLeft}` : '00:00'}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E8E99] mt-1">
                  {secondsLeft > 0 ? 'CONTEO REGRESIVO' : '¡EN LA CALLE!'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-2xs font-mono uppercase tracking-widest text-[#8E8E99] bg-[#111114] border border-[#242429] px-3 py-1 rounded-[4px] inline-block">
              ESTRENO MUNDIAL EN STREAMING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F4F6] tracking-tight">
              "{data.title}"
            </h2>
            <p className="text-xs text-[#8E8E99]">
              Subiendo a Spotify, Apple Music, YouTube y TikTok...
            </p>
          </div>

          <button
            onClick={handleSkipCountdown}
            className="text-2xs font-semibold text-[#8E8E99] hover:text-white uppercase tracking-wider underline cursor-pointer transition-colors"
          >
            Saltar Conteo ➔
          </button>
        </div>
      </div>
    );
  }

  // 2. REVEALED RELEASE DASHBOARD
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div
        className="bg-[#111114] border border-[#242429] max-w-2xl sm:max-w-3xl w-full rounded-[6px] flex flex-col overflow-hidden text-[#F4F4F6] shadow-2xl relative my-auto max-h-[92vh]"
      >
        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#242429] bg-[#111114] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[4px] bg-[#09090B] border border-emerald-500/40 text-[#00E599] shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#00E599]" />
            </div>
            <div>
              <span className="text-2xs uppercase font-bold tracking-wider text-[#00E599] bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-[4px] inline-block font-mono">
                Lanzamiento Exitoso • En Vivo a las 00:00
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#F4F4F6]">
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
          <div className="bg-[#18181C] border border-[#242429] rounded-[6px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-[4px] bg-[#09090B] border border-[#242429] flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-[#FF4F00]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#FF4F00] font-mono tracking-wider block">
                  Primeras 24 Horas • Streaming Surge
                </span>
                <h3 className="text-sm font-bold text-[#F4F4F6]">
                  ¡El algoritmo comenzó a recomendar tu tema a nivel global!
                </h3>
              </div>
            </div>

            <div className="bg-[#09090B] border border-[#242429] px-4 py-2 rounded-[4px] text-center sm:text-right shrink-0">
              <span className="text-[10px] uppercase text-[#8E8E99] font-mono block">Reproducciones Iniciales</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#00E599] tabular-nums tracking-tight">
                +{streamTicker.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {/* Project Presentation Hero Box (Cover + Metadata) */}
          <div className="bg-[#09090B] border border-[#242429] rounded-[6px] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            {/* Thematic Cover Art Box */}
            <div className="relative group shrink-0 mx-auto sm:mx-0">
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-[4px] bg-gradient-to-br ${coverGrad} border border-white/10 flex flex-col justify-between p-3.5 text-white relative overflow-hidden analog-grain`}
              >
                <div className="absolute inset-0 bg-radial from-transparent via-white/[0.04] to-black/50 pointer-events-none" />

                {/* Top Badge on Cover */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded-[4px] border border-white/20 font-mono">
                    {data.type}
                  </span>
                  <Disc3 className="w-4 h-4 text-[#FF4F00] animate-spin-slow" />
                </div>

                {/* Bottom Title on Cover */}
                <div className="relative z-10 space-y-0.5">
                  <span className="text-[10px] font-mono text-white/80 block uppercase tracking-wider">
                    {data.releaseYear}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                    {data.title}
                  </h4>
                </div>
              </div>

              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-[4px] bg-[#FF4F00] text-white flex items-center justify-center shadow-md border border-white/20">
                <Music2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Project Details & Badges */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-[4px] text-xs font-bold border flex items-center gap-1.5 ${typeConfig.className}`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                  <span>{typeConfig.label}</span>
                </span>
                <span className="px-2.5 py-1 rounded-[4px] text-xs font-semibold bg-[#18181C] border border-[#242429] text-[#CBD5E1] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF4F00]" />
                  <span>Estreno: <strong className="text-[#F4F4F6] font-mono">{formatReleaseDate(data.releaseMonth, data.releaseYear, 'long')}</strong></span>
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F4F6] break-words">
                  {data.title}
                </h3>
                <p className="text-xs text-[#8E8E99] mt-0.5 flex items-center gap-2">
                  <span className="font-mono">{data.songCount} {data.songCount === 1 ? 'Pista' : 'Pistas en catálogo'}</span>
                  <span>•</span>
                  <span className="text-[#00E599] font-mono font-semibold">Masterizado en 24-bit 96kHz</span>
                </p>
              </div>

              {/* Genres & Collaborators */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="px-2.5 py-1 rounded-[4px] text-xs font-bold bg-[#FF4F00]/20 border border-[#FF4F00]/40 text-[#FF4F00] font-mono">
                  {data.genreName}
                </span>

                {data.subGenreName && (
                  <span className="px-2.5 py-1 rounded-[4px] text-xs font-medium bg-[#18181C] border border-[#242429] text-[#8E8E99] font-mono">
                    {data.subGenreName}
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-[4px] text-xs font-semibold bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 flex items-center gap-1 font-mono">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>{data.producerName ? `Prod: ${data.producerName}` : 'Producción Propia'}</span>
                </span>

                {data.featuredArtistNames && data.featuredArtistNames.length > 0 && (
                  <span className="px-2.5 py-1 rounded-[4px] text-xs font-semibold bg-[#18181C] border border-pink-800/60 text-pink-300 font-mono">
                    ft. {data.featuredArtistNames.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cascading Fan Reactions */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E8E99] font-mono flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
              Primeras Reacciones del Público en Redes
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-[#09090B] border border-[#242429] p-2.5 rounded-[4px] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#8E8E99]">
                  <span className="font-bold text-[#F4F4F6]">@mateo_urbano</span>
                  <span className="font-mono">hace 10m</span>
                </div>
                <p className="text-xs text-[#D4D4D8]">
                  "Uff hermano el beat del estribillo me voló la cabeza, temazo total 🔥"
                </p>
              </div>

              <div className="bg-[#09090B] border border-[#242429] p-2.5 rounded-[4px] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#8E8E99]">
                  <span className="font-bold text-[#F4F4F6]">@sofia_music</span>
                  <span className="font-mono">hace 18m</span>
                </div>
                <p className="text-xs text-[#D4D4D8]">
                  "Directo a mi playlist de favoritos, no la voy a parar de escuchar ✨"
                </p>
              </div>

              <div className="bg-[#09090B] border border-[#242429] p-2.5 rounded-[4px] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#8E8E99]">
                  <span className="font-bold text-[#F4F4F6]">@trap_flow_arg</span>
                  <span className="font-mono">hace 25m</span>
                </div>
                <p className="text-xs text-[#D4D4D8]">
                  "Se fue mundial hermano, esto entra directo a los charts 📈"
                </p>
              </div>
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="bg-[#09090B] border border-[#242429] rounded-[6px] p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-[#242429] pb-2">
              <span className="text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#00E599]" />
                Inversión Total en el Proyecto
              </span>
              <span className="text-sm font-bold font-mono text-[#00E599] tabular-nums">
                {formatMoney(data.totalBudget)}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-2xs font-mono tabular-nums">
              <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                <span className="text-[10px] text-[#8E8E99] block uppercase">Producción</span>
                <span className="font-bold text-[#F59E0B]">{formatMoney(data.budgetBreakdown?.production ?? 0)}</span>
              </div>
              <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                <span className="text-[10px] text-[#8E8E99] block uppercase">Marketing</span>
                <span className="font-bold text-[#00E599]">{formatMoney(data.budgetBreakdown?.marketing ?? 0)}</span>
              </div>
              <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                <span className="text-[10px] text-[#8E8E99] block uppercase">Productor</span>
                <span className="font-bold text-cyan-400">{formatMoney(data.budgetBreakdown?.producerFee ?? 0)}</span>
              </div>
              <div className="bg-[#111114] p-2 rounded-[4px] border border-[#242429]">
                <span className="text-[10px] text-[#8E8E99] block uppercase">Videoclip</span>
                <span className="font-bold text-[#F4F4F6]">{formatMoney(data.budgetBreakdown?.videoCost ?? (data.musicVideo?.budget ?? 0))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#242429] bg-[#111114] flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <span className="text-xs text-[#8E8E99] text-center sm:text-left">
            ¡Tu lanzamiento ya está en la calle y compitiendo en el mercado!
          </span>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto bg-[#FF4F00] hover:bg-[#E04500] text-white px-6 py-2.5 rounded-[4px] text-xs font-bold active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Ir al Catálogo & Estadísticas</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
