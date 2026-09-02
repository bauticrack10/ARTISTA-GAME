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
  rejectionReason = 'El artista revisó la propuesta pero decidió no participar en este momento.',
  rejectionAdvice = 'Incrementa tu afinidad en redes sociales o eleva el presupuesto de marketing.',
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
          colors: ['#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#F8FAFC']
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div
        className={`bg-[#16181F] border max-w-xl w-full rounded-[18px] flex flex-col overflow-hidden text-[#F8FAFC] shadow-2xl relative my-auto ${
          type === 'accepted'
            ? 'border-[#10B981]/50 shadow-[0_0_40px_rgba(16,185,129,0.25)]'
            : 'border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
        }`}
      >
        {/* Ambient Top Glow Orbs */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-28 blur-3xl pointer-events-none opacity-40 ${
            type === 'accepted'
              ? 'bg-gradient-to-b from-[#10B981] via-[#8B5CF6] to-transparent'
              : 'bg-gradient-to-b from-rose-500 via-amber-600 to-transparent'
          }`}
        />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-[6px] hover:bg-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                ¡Alianza Sellada & Feat Confirmado!
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
                {artist.name} firmó la colaboración
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Las sesiones de grabación fueron aprobadas y el máster ingresa a post-producción.
              </p>
            </div>

            {/* Duo Showdown Card (Player + Collaborator) */}
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-around gap-4 relative z-10">
                {/* Left: Player */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white font-extrabold text-xl flex items-center justify-center mx-auto border-2 border-white/20 shadow-md">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F8FAFC] truncate max-w-[110px]">{player.name}</div>
                    <div className="text-[10px] text-[#94A3B8]">Lead Artist</div>
                  </div>
                </div>

                {/* Center: Audio Wave & Equalizer Energy */}
                <div className="flex flex-col items-center gap-1.5 px-2">
                  <div className="flex items-center gap-1 h-6">
                    <span className="w-1 bg-[#10B981] h-3 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 bg-[#8B5CF6] h-6 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 bg-[#EC4899] h-4 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 bg-[#06B6D4] h-5 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">
                    {soundSynergy}% Sinergia
                  </span>
                </div>

                {/* Right: Collaborator */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#10B981] to-emerald-950 text-white font-extrabold text-xl flex items-center justify-center mx-auto border-2 border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    {artist.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F8FAFC] truncate max-w-[110px]">{artist.name}</div>
                    <div className="text-[10px] text-[#34D399]">Featured Guest</div>
                  </div>
                </div>
              </div>

              {/* Official Credit Plaque */}
              <div className="mt-4 pt-3.5 border-t border-[#2A2E3D] flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Crédito Oficial del Lanzamiento</span>
                <span className="text-sm font-bold text-[#F8FAFC] font-mono">
                  "{creditPreview || `${player.name} & ${artist.name}`}"
                </span>
                <span className="text-[11px] text-[#C084FC]">
                  Track: <strong className="text-[#F8FAFC] font-semibold">{songTitle}</strong> ({formatTitle})
                </span>
              </div>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-3 gap-2.5 text-left">
              <div className="bg-[#0B0C10] border border-[#2A2E3D] p-2.5 rounded-[8px] space-y-0.5">
                <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                  <Flame className="w-3 h-3 text-orange-400" /> Hype Inmediato
                </div>
                <div className="text-xs font-bold text-orange-400 font-mono">+18% Exp.</div>
              </div>

              <div className="bg-[#0B0C10] border border-[#2A2E3D] p-2.5 rounded-[8px] space-y-0.5">
                <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                  <Radio className="w-3 h-3 text-[#06B6D4]" /> Cruce Fans
                </div>
                <div className="text-xs font-bold text-[#06B6D4] font-mono">
                  +{formatCompactNumber(Math.floor(artist.stats.monthlyListeners * 0.12))}
                </div>
              </div>

              <div className="bg-[#0B0C10] border border-[#2A2E3D] p-2.5 rounded-[8px] space-y-0.5">
                <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                  <Sparkles className="w-3 h-3 text-[#10B981]" /> Alianza
                </div>
                <div className="text-xs font-bold text-[#10B981] font-mono">+25 Afinidad</div>
              </div>
            </div>

            {/* Triumphant CTA Button (6px radius / Inset Shadow) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onProceed();
                }}
                className="w-full py-3 px-6 rounded-[6px] text-xs font-bold bg-gradient-to-r from-[#10B981] to-[#8B5CF6] text-[#0B0C10] shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continuar a la Sala de Grabación & Mezcla</span>
                <ArrowRight className="w-4 h-4 text-[#0B0C10]" />
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/50 border border-rose-500/40 text-rose-300">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                Propuesta Declinada Amablemente
              </span>
              <span className="text-[11px] text-[#94A3B8] font-mono">
                {artist.name}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#F8FAFC]">
                El equipo de {artist.name} declinó la sesión
              </h2>
              <p className="text-xs text-[#94A3B8]">
                En la industria de la música, el timing y el perfil artístico son fundamentales. Esta respuesta no perjudica tu prestigio actual.
              </p>
            </div>

            {/* Respectful Manager Quote Box */}
            <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-xl p-4 space-y-2 relative">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">
                Declaración de la Representación Artística:
              </span>
              <blockquote className="text-xs text-[#CBD5E1] italic border-l-2 border-rose-500/40 pl-3 leading-relaxed">
                "{rejectionReason}"
              </blockquote>
            </div>

            {/* Strategic Advice Card (Amber / Warm Guidance) */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-[6px] bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-bold text-amber-300 block">Consejo Estratégico de tu Manager:</span>
                <p className="text-amber-200/80 leading-relaxed text-[11px]">
                  {rejectionAdvice}
                </p>
              </div>
            </div>

            {/* Dual Action Buttons (6px radius) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {onAdjustProposal && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    onAdjustProposal();
                  }}
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-[6px] text-xs font-semibold bg-[#0B0C10] hover:bg-white/[0.04] text-[#CBD5E1] border border-[#2A2E3D] hover:border-slate-500 transition-all cursor-pointer text-center"
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
                className={`w-full ${onAdjustProposal ? 'sm:w-1/2' : ''} py-2.5 px-4 rounded-[6px] text-xs font-bold bg-[#1C1C1C] text-[#FCFBF8] border border-white/10 shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer text-center`}
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
