import React, { useEffect } from 'react';
import { Artist, ReleaseConfirmationData } from '../types';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audioSystem';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Radio,
  Flame,
  Music2,
  DollarSign,
  Zap,
  Disc3,
  X
} from 'lucide-react';
import { formatMoney, formatCompactNumber } from '../utils/formatters';

export interface CollabResponseModalProps {
  isOpen: boolean;
  type: 'accepted' | 'rejected';
  artist: Artist;
  player: Artist;
  formatTitle?: string;
  songTitle?: string;
  creditPreview?: string;
  totalCost?: number;
  soundSynergy?: number;
  rejectionReason?: string;
  rejectionAdvice?: string;
  onProceed: () => void;
  onAdjustProposal?: () => void;
  onClose: () => void;
}

export const CollabResponseModal: React.FC<CollabResponseModalProps> = ({
  isOpen,
  type,
  artist,
  player,
  formatTitle = 'Single con Feat',
  songTitle = 'Fuego Cruzado',
  creditPreview = '',
  totalCost = 0,
  soundSynergy = 75,
  rejectionReason = 'Su oficina de management escuchó la maqueta, pero tienen el calendario de lanzamientos cerrado este trimestre.',
  rejectionAdvice = 'Subí tu rotación mensual o mejorá el porcentaje de puntos sobre el máster antes de volver a ofertar.',
  onProceed,
  onAdjustProposal,
  onClose
}) => {
  // Trigger effects on modal display
  useEffect(() => {
    if (!isOpen) return;

    if (type === 'accepted') {
      // 1. Audio: Release fanfare + triumph
      playSound('release');
      setTimeout(() => playSound('award'), 300);

      // 2. Confetti Particle Burst
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#10B981', '#FF4F00', '#FF2A4B', '#D4AF37', '#F59E0B', '#F4F4F6']
        });
      } catch (e) {
        // Fallback for non-canvas environments
      }
    } else {
      // Muted analog tape stop click
      playSound('click');
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
    >
      <div
        className={`bg-[#111114] border max-w-xl w-full rounded-[6px] flex flex-col overflow-hidden text-[#F4F4F6] relative my-auto ${
          type === 'accepted'
            ? 'border-[#00E599]/40'
            : 'border-[#EF4444]/40'
        }`}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-[#F4F4F6] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================================= */}
        {/* STATE A: ACEPTACIÓN TRIUNFAL (Triumphant Acceptance) */}
        {/* ========================================================================= */}
        {type === 'accepted' && (
          <div className="p-6 sm:p-8 space-y-6 relative z-10 text-center">
            {/* Triumphal Pill Header */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-sans font-bold uppercase tracking-wider bg-[#00E599]/10 border border-[#00E599]/30 text-[#00E599]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E599]" />
                Acuerdo Cerrado • Split Sheet Firmado
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F4F6]">
                {artist.name} firmó la colaboración
              </h2>
              <p className="text-xs text-[#8E8E99]">
                Se cerraron los puntos de regalía y las tomas vocales ya entraron a mezcla y masterización.
              </p>
            </div>

            {/* Duo Showdown Card (Player + Collaborator) */}
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-5 relative overflow-hidden">
              <div className="flex items-center justify-around gap-4 relative z-10">
                {/* Left: Player */}
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#F4F4F6] font-bold text-xl flex items-center justify-center mx-auto">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F4F4F6] truncate max-w-[110px]">{player.name}</div>
                    <div className="text-2xs uppercase tracking-wider text-[#8E8E99]">Lead Artist</div>
                  </div>
                </div>

                {/* Center: Audio Wave & Equalizer Energy */}
                <div className="flex flex-col items-center gap-1.5 px-2">
                  <div className="flex items-center gap-1 h-6">
                    <span className="w-1 bg-[#00E599] h-3 rounded-[1px] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 bg-[#FF4F00] h-6 rounded-[1px] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 bg-[#F59E0B] h-4 rounded-[1px] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 bg-[#00E599] h-5 rounded-[1px] animate-bounce" style={{ animationDelay: '200ms' }} />
                  </div>
                  <span className="text-2xs font-sans tabular-nums font-bold uppercase tracking-wider text-[#00E599] bg-[#00E599]/10 px-2 py-0.5 rounded-[4px] border border-[#00E599]/30">
                    {soundSynergy}% Sinergia
                  </span>
                </div>

                {/* Right: Collaborator */}
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-[4px] bg-[#18181C] border border-[#00E599]/40 text-[#00E599] font-bold text-xl flex items-center justify-center mx-auto">
                    {artist.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F4F4F6] truncate max-w-[110px]">{artist.name}</div>
                    <div className="text-2xs uppercase tracking-wider text-[#00E599]">Featured Guest</div>
                  </div>
                </div>
              </div>

              {/* Official Credit Plaque */}
              <div className="mt-4 pt-3.5 border-t border-[#242429] flex flex-col items-center gap-1">
                <span className="text-2xs uppercase font-bold text-[#52525B] tracking-wider">Crédito Oficial del Lanzamiento</span>
                <span className="text-sm font-bold text-[#F4F4F6] font-sans">
                  "{creditPreview || `${player.name} & ${artist.name}`}"
                </span>
                <span className="text-xs text-[#8E8E99]">
                  Track: <strong className="text-[#F4F4F6] font-semibold">{songTitle}</strong> ({formatTitle})
                </span>
              </div>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-3 gap-2.5 text-left">
              <div className="bg-[#09090B] border border-[#242429] p-2.5 rounded-[4px] space-y-0.5">
                <div className="flex items-center gap-1 text-2xs text-[#8E8E99] uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-[#FF4F00]" /> Hype
                </div>
                <div className="text-xs font-bold text-[#FF4F00] font-sans tabular-nums">+18% Exp.</div>
              </div>

              <div className="bg-[#09090B] border border-[#242429] p-2.5 rounded-[4px] space-y-0.5">
                <div className="flex items-center gap-1 text-2xs text-[#8E8E99] uppercase tracking-wider">
                  <Radio className="w-3 h-3 text-[#F4F4F6]" /> Cruce Fans
                </div>
                <div className="text-xs font-bold text-[#F4F4F6] font-sans tabular-nums">
                  +{formatCompactNumber(Math.floor(artist.stats.monthlyListeners * 0.12))}
                </div>
              </div>

              <div className="bg-[#09090B] border border-[#242429] p-2.5 rounded-[4px] space-y-0.5">
                <div className="flex items-center gap-1 text-2xs text-[#8E8E99] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#00E599]" /> Alianza
                </div>
                <div className="text-xs font-bold text-[#00E599] font-sans tabular-nums">+25 Afinidad</div>
              </div>
            </div>

            {/* Triumphant CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onProceed();
                }}
                className="w-full py-3 px-6 rounded-[4px] text-xs font-bold font-sans bg-[#FF4F00] hover:bg-[#E04500] text-white active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continuar a la Sala de Grabación & Mezcla</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE B: RECHAZO RESPETUOSO (Respectful Decline) */}
        {/* ========================================================================= */}
        {type === 'rejected' && (
          <div className="p-6 sm:p-8 space-y-6 relative z-10 text-left">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-sans font-bold uppercase tracking-wider bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]">
                <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                Propuesta Declinada Amablemente
              </span>
              <span className="text-xs text-[#8E8E99] font-sans">
                {artist.name}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#F4F4F6]">
                El equipo de {artist.name} declinó la sesión
              </h2>
              <p className="text-xs text-[#8E8E99]">
                Los cruces entre sellos dependen de ventanas de lanzamiento, caché y tracción en listas; un no de su oficina hoy no quema el puente ni afecta tu reputación.
              </p>
            </div>

            {/* Respectful Manager Quote Box */}
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-4 space-y-2 relative">
              <span className="text-2xs uppercase font-bold text-[#52525B] tracking-wider block">
                Declaración de la Representación Artística:
              </span>
              <blockquote className="text-xs text-[#D4D4D8] italic border-l-2 border-[#EF4444]/40 pl-3 leading-relaxed">
                "{rejectionReason}"
              </blockquote>
            </div>

            {/* Strategic Advice Card */}
            <div className="bg-[#18181C] border border-[#F59E0B]/30 rounded-[4px] p-4 flex items-start gap-3">
              <div className="p-2 rounded-[4px] bg-[#F59E0B]/10 text-[#F59E0B] shrink-0 mt-0.5">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#F59E0B] block">Consejo Estratégico de tu Manager:</span>
                <p className="text-[#D4D4D8] leading-relaxed text-xs">
                  {rejectionAdvice}
                </p>
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {onAdjustProposal && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    onAdjustProposal();
                  }}
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-[4px] text-xs font-sans font-semibold bg-[#18181C] hover:bg-[#242429] text-[#F4F4F6] border border-[#242429] transition-all cursor-pointer text-center"
                >
                  Modificar Términos de la Oferta
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onClose();
                }}
                className={`w-full ${onAdjustProposal ? 'sm:w-1/2' : ''} py-2.5 px-4 rounded-[4px] text-xs font-sans font-bold bg-[#F4F4F6] text-[#09090B] hover:bg-[#E4E4E7] transition-all cursor-pointer text-center`}
              >
                Entendido, guardar idea en bocetos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
