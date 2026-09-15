import React, { useState } from 'react';
import { Artist, Producer } from '../types';
import { playSound } from '../utils/audioSystem';
import { formatMoney, formatCompactNumber } from '../utils/formatters';
import {
  Mic2,
  Sliders,
  Sparkles,
  Clock,
  DollarSign,
  Zap,
  TrendingUp,
  Volume2,
  Check,
  X,
  Radio,
  ArrowRight,
  Headphones
} from 'lucide-react';

export interface SpontaneousCollabOffer {
  id: string;
  senderType: 'singer' | 'producer';
  senderArtist?: Artist;
  senderProducer?: Producer;
  trackTitle: string;
  genreName: string;
  pitchQuote: string;
  royaltySplitPlayer: number; // e.g. 50 (%)
  upfrontFeeOrAdvance: number; // e.g. +$2000 (advance to player) or $0
  energyCost: number; // e.g. 10
  expiresInMonths: number;
  projectedExposure: string;
  qualityBoostPercent?: number;
}

export interface CollabOfferNotificationProps {
  offer: SpontaneousCollabOffer;
  onAccept: (offer: SpontaneousCollabOffer) => void;
  onDecline: (offerId: string) => void;
  onListenDemo?: (offer: SpontaneousCollabOffer) => void;
  isFloatingToast?: boolean;
  className?: string;
}

export const CollabOfferNotification: React.FC<CollabOfferNotificationProps> = ({
  offer,
  onAccept,
  onDecline,
  onListenDemo,
  isFloatingToast = false,
  className = ''
}) => {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const isProducer = offer.senderType === 'producer';
  const senderName = isProducer
    ? offer.senderProducer?.name || 'Productor de Élite'
    : offer.senderArtist?.name || 'Artista Colega';

  const senderInitial = senderName.charAt(0);

  const handleToggleDemo = () => {
    playSound('click');
    setIsPlayingDemo(!isPlayingDemo);
    if (!isPlayingDemo) {
      playSound('chart_no1'); // Plays short melodic cue
    }
    if (onListenDemo) {
      onListenDemo(offer);
    }
  };

  const handleAccept = () => {
    playSound('money');
    setTimeout(() => playSound('release'), 200);
    onAccept(offer);
  };

  const handleDecline = () => {
    playSound('click');
    onDecline(offer.id);
  };

  return (
    <div
      className={`${
        isFloatingToast
          ? 'fixed bottom-5 right-5 z-50 max-w-md w-full animate-bounce-in shadow-2xl'
          : 'w-full'
      } ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div
        className={`bg-surface border rounded-xl p-5 relative overflow-hidden backdrop-blur-xl transition-all duration-200 ${
          isProducer
            ? 'border-info/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:border-info/70'
            : 'border-primary/40 shadow-[0_0_25px_rgba(139,92,246,0.15)] hover:border-primary/70'
        }`}
      >
        {/* Left Decorative Accent Strip */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
            isProducer
              ? 'bg-gradient-to-b from-info to-teal-400'
              : 'bg-gradient-to-b from-[#8B5CF6] to-[#EC4899]'
          }`}
        />

        {/* Ambient Glow */}
        <div
          className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-20 ${
            isProducer ? 'bg-info' : 'bg-primary'
          }`}
        />

        {/* Header: Archetype Tag & Urgency Countdown Pill */}
        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-1.5">
            {isProducer ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-info/15 border border-info/40 text-[#67E8F9] shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <Sliders className="w-3 h-3 text-info" />
                Propuesta de Productor • Beatmaker
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-primary/15 border border-primary/40 text-primary-soft shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                <Mic2 className="w-3 h-3 text-primary" />
                Invitación de Feat • Cantante
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-amber-950/50 border border-amber-500/40 text-amber-300">
            <Clock className="w-2.5 h-2.5 text-amber-400" />
            Expira en {offer.expiresInMonths} {offer.expiresInMonths === 1 ? 'mes' : 'meses'}
          </span>
        </div>

        {/* Sender Profile Row */}
        <div className="flex items-start gap-3 relative z-10 mb-3">
          <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center font-extrabold text-base text-white shrink-0 border ${
              isProducer
                ? 'bg-gradient-to-br from-info to-cyan-950 border-info/40 shadow-sm'
                : 'bg-gradient-to-br from-primary to-pink-950 border-primary/40 shadow-sm'
            }`}
          >
            {senderInitial}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-fg truncate">
                {senderName}
              </h3>
              <span className="text-2xs uppercase font-bold text-fg-muted px-1.5 py-0.2 rounded bg-canvas border border-line">
                {offer.genreName}
              </span>
            </div>

            <p className="text-xs text-fg-muted">
              Track propuesto: <strong className="text-fg">"{offer.trackTitle}"</strong>
            </p>
          </div>
        </div>

        {/* Quote / Pitch Message */}
        <div className="bg-canvas border border-line rounded-lg p-3 mb-3 text-xs italic text-[#CBD5E1] relative z-10 leading-relaxed">
          "{offer.pitchQuote}"
        </div>

        {/* Financial & Impact Badges Matrix */}
        <div className="grid grid-cols-3 gap-2 mb-4 relative z-10 text-xs font-mono">
          <div className="bg-canvas border border-line p-2 rounded-md space-y-0.5">
            <span className="text-2xs uppercase font-bold text-fg-muted block">Regalías</span>
            <span className="text-emerald-400 font-bold">{offer.royaltySplitPlayer}% Split</span>
          </div>

          <div className="bg-canvas border border-line p-2 rounded-md space-y-0.5">
            <span className="text-2xs uppercase font-bold text-fg-muted block">
              {isProducer ? 'Boost Calidad' : 'Anticipo'}
            </span>
            <span className="text-primary-soft font-bold">
              {isProducer ? `+${offer.qualityBoostPercent || 15}% Prod.` : offer.upfrontFeeOrAdvance > 0 ? `+${formatMoney(offer.upfrontFeeOrAdvance)}` : 'Sin Costo'}
            </span>
          </div>

          <div className="bg-canvas border border-line p-2 rounded-md space-y-0.5">
            <span className="text-2xs uppercase font-bold text-fg-muted block">Impacto</span>
            <span className="text-[#67E8F9] font-bold">{offer.projectedExposure}</span>
          </div>
        </div>

        {/* Interactive Action Buttons (design.md: 6px standard, 9999px pills) */}
        <div className="flex items-center gap-2 relative z-10">
          {/* Demo audio pill button (9999px) */}
          <button
            type="button"
            onClick={handleToggleDemo}
            className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              isPlayingDemo
                ? 'bg-primary/25 text-[#E879F9] border-primary'
                : 'bg-canvas text-[#CBD5E1] border-line hover:border-slate-500'
            }`}
            title="Escuchar maqueta de audio de muestra"
          >
            {isPlayingDemo ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#E879F9] animate-pulse" />
                <span className="text-xs">Sonando</span>
              </>
            ) : (
              <>
                <Headphones className="w-3.5 h-3.5 text-fg-muted" />
                <span className="text-xs">Maqueta</span>
              </>
            )}
          </button>

          {/* Decline Ghost Button (6px) */}
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 py-2 px-3 rounded-md text-xs font-semibold bg-canvas hover:bg-white/[0.04] text-fg-muted hover:text-fg border border-line hover:border-slate-500 transition-all cursor-pointer text-center"
          >
            Declinar
          </button>

          {/* Accept Primary Inset Button (6px) */}
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 py-2 px-3.5 rounded-md text-xs font-bold bg-success hover:bg-[#059669] text-canvas shadow-[0_0_15px_rgba(16,185,129,0.35)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Check className="w-3.5 h-3.5 text-canvas" />
            <span>Aceptar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
