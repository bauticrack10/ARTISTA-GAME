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
    >
      <div
        className={`bg-[#111114] border rounded-[6px] p-5 relative overflow-hidden transition-all duration-200 ${
          isProducer
            ? 'border-[#00E599]/40 hover:border-[#00E599]/70'
            : 'border-[#FF4F00]/40 hover:border-[#FF4F00]/70'
        }`}
      >
        {/* Left Decorative Accent Strip */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${
            isProducer
              ? 'bg-[#00E599]'
              : 'bg-[#FF4F00]'
          }`}
        />

        {/* Header: Archetype Tag & Urgency Countdown Pill */}
        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-1.5">
            {isProducer ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-2xs font-mono font-bold uppercase tracking-wider bg-[#18181C] border border-[#242429] text-[#00E599]">
                <Sliders className="w-3 h-3 text-[#00E599]" />
                Propuesta de Productor • Beatmaker
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-2xs font-mono font-bold uppercase tracking-wider bg-[#18181C] border border-[#242429] text-[#FF4F00]">
                <Mic2 className="w-3 h-3 text-[#FF4F00]" />
                Invitación de Feat • Cantante
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-2xs font-mono font-bold bg-[#18181C] border border-[#F59E0B]/30 text-[#F59E0B]">
            <Clock className="w-2.5 h-2.5 text-[#F59E0B]" />
            Expira en {offer.expiresInMonths} {offer.expiresInMonths === 1 ? 'mes' : 'meses'}
          </span>
        </div>

        {/* Sender Profile Row */}
        <div className="flex items-start gap-3 relative z-10 mb-3">
          <div
            className={`w-10 h-10 rounded-[4px] flex items-center justify-center font-bold text-base text-[#F4F4F6] shrink-0 border ${
              isProducer
                ? 'bg-[#18181C] border-[#00E599]/40 text-[#00E599]'
                : 'bg-[#18181C] border-[#FF4F00]/40 text-[#FF4F00]'
            }`}
          >
            {senderInitial}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F4F4F6] truncate">
                {senderName}
              </h3>
              <span className="text-2xs uppercase font-bold text-[#8E8E99] px-1.5 py-0.5 rounded-[2px] bg-[#18181C] border border-[#242429] font-mono">
                {offer.genreName}
              </span>
            </div>

            <p className="text-xs text-[#8E8E99]">
              Track propuesto: <strong className="text-[#F4F4F6]">"{offer.trackTitle}"</strong>
            </p>
          </div>
        </div>

        {/* Quote / Pitch Message */}
        <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-3 mb-3 text-xs italic text-[#D4D4D8] relative z-10 leading-relaxed">
          "{offer.pitchQuote}"
        </div>

        {/* Financial & Impact Badges Matrix */}
        <div className="grid grid-cols-3 gap-2 mb-4 relative z-10 text-xs font-mono tabular-nums">
          <div className="bg-[#09090B] border border-[#242429] p-2 rounded-[4px] space-y-0.5">
            <span className="text-2xs uppercase font-bold text-[#52525B] tracking-wider block">Regalías</span>
            <span className="text-[#00E599] font-bold">{offer.royaltySplitPlayer}% Split</span>
          </div>

          <div className="bg-[#09090B] border border-[#242429] p-2 rounded-[4px] space-y-0.5">
            <span className="text-2xs uppercase font-bold text-[#52525B] tracking-wider block">
              {isProducer ? 'Boost Calidad' : 'Anticipo'}
            </span>
            <span className="text-[#F4F4F6] font-bold">
              {isProducer ? `+${offer.qualityBoostPercent || 15}% Prod.` : offer.upfrontFeeOrAdvance > 0 ? `+${formatMoney(offer.upfrontFeeOrAdvance)}` : 'Sin Costo'}
            </span>
          </div>

          <div className="bg-[#09090B] border border-[#242429] p-2 rounded-[4px] space-y-0.5">
            <span className="text-2xs uppercase font-bold text-[#52525B] tracking-wider block">Impacto</span>
            <span className="text-[#F4F4F6] font-bold">{offer.projectedExposure}</span>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex items-center gap-2 relative z-10">
          {/* Demo audio button */}
          <button
            type="button"
            onClick={handleToggleDemo}
            className={`px-3 py-2 rounded-[4px] text-xs font-mono font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              isPlayingDemo
                ? 'bg-[#FF4F00]/15 text-[#FF4F00] border-[#FF4F00]'
                : 'bg-[#18181C] text-[#8E8E99] border-[#242429] hover:text-[#F4F4F6] hover:border-[#3F3F46]'
            }`}
            title="Escuchar maqueta de audio de muestra"
          >
            {isPlayingDemo ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#FF4F00] animate-pulse" />
                <span className="text-xs">Sonando</span>
              </>
            ) : (
              <>
                <Headphones className="w-3.5 h-3.5 text-[#8E8E99]" />
                <span className="text-xs">Maqueta</span>
              </>
            )}
          </button>

          {/* Decline Ghost Button */}
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 py-2 px-3 rounded-[4px] text-xs font-mono font-semibold bg-[#18181C] hover:bg-[#242429] text-[#8E8E99] hover:text-[#F4F4F6] border border-[#242429] transition-all cursor-pointer text-center"
          >
            Declinar
          </button>

          {/* Accept Primary Button */}
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 py-2 px-3.5 rounded-[4px] text-xs font-mono font-bold bg-[#FF4F00] hover:bg-[#E04500] text-white active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Check className="w-3.5 h-3.5 text-white" />
            <span>Aceptar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
