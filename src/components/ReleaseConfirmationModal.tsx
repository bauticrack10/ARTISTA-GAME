import React, { useEffect } from 'react';
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
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReleaseConfirmationData } from '../types';
import { formatMoney, formatReleaseDate } from '../utils/formatters';
import { TimeSystem } from '../systems/TimeSystem';
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
  // Trigger celebration confetti on modal appearance
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#10B981', '#06B6D4', '#F59E0B', '#F8FAFC']
      });
    } catch (e) {
      // ignore in environments without canvas
    }
  }, []);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div
        className="bg-surface border border-line max-w-2xl sm:max-w-3xl w-full rounded-panel flex flex-col overflow-hidden text-fg shadow-2xl relative my-auto max-h-[92vh]"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-primary/20 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-line bg-surface/90 backdrop-blur-md flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-canvas border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-2xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-sm inline-block">
                Lanzamiento Exitoso • Publicación Oficial
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-fg">
                Confirmación de Lanzamiento
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
          {/* Main Success Announcement Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-surface to-primary/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-fg">
                ¡Tu contenido fue publicado y añadido al catálogo oficial!
              </h3>
              <p className="text-xs text-fg-muted">
                Las plataformas de streaming, radios y charts globales ya están indexando y reproduciendo tu nueva obra.
              </p>
            </div>
          </div>

          {/* Project Presentation Hero Box (Cover + Metadata) */}
          <div className="bg-canvas border border-line rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 shadow-inner">
            {/* Thematic Cover Art Box */}
            <div className="relative group shrink-0 mx-auto sm:mx-0">
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-xl bg-gradient-to-br ${coverGrad} border-2 border-line shadow-2xl flex flex-col justify-between p-3.5 text-white relative overflow-hidden`}
              >
                {/* Vinyl Ring Reflection Overlay */}
                <div className="absolute inset-0 bg-radial from-transparent via-white/[0.06] to-black/40 pointer-events-none" />
                <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full border-4 border-white/10 opacity-30 pointer-events-none" />
                <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border-4 border-white/10 opacity-30 pointer-events-none" />

                {/* Top Badge on Cover */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-2xs font-bold uppercase tracking-wider bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-sm border border-white/20">
                    {data.type}
                  </span>
                  <Disc3 className="w-4 h-4 text-white/70" />
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

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border border-white/20">
                <Music2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Project Details & Badges */}
            <div className="space-y-3 flex-1 min-w-0">
              {/* Type Badge & Release Date */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${typeConfig.className}`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                  <span>{typeConfig.label}</span>
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface border border-line text-[#CBD5E1] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Lanzamiento: <strong className="text-fg">{formatReleaseDate(data.releaseMonth, data.releaseYear, 'long')}</strong></span>
                </span>
              </div>

              {/* Big Title */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-fg break-words">
                  {data.title}
                </h3>
                <p className="text-xs text-fg-muted mt-0.5 flex items-center gap-2">
                  <span>{data.songCount} {data.songCount === 1 ? 'Canción' : 'Canciones en catálogo'}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Masterizado en 24-bit 96kHz</span>
                </p>
              </div>

              {/* Genres & Collaborators Badges */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {/* Main Genre */}
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/20 border border-primary/40 text-primary-soft">
                  {data.genreName}
                </span>

                {/* Subgenre */}
                {data.subGenreName && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface border border-line text-[#CBD5E1]">
                    {data.subGenreName}
                  </span>
                )}

                {/* Hired Producer / Production Credit */}
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>{data.producerName ? `Prod: ${data.producerName}` : 'Producción: Propia • Home Studio'}</span>
                </span>

                {/* Featured Artists */}
                {data.featuredArtistNames && data.featuredArtistNames.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-950/60 border border-pink-500/40 text-pink-300">
                    ft. {data.featuredArtistNames.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Content: Tracklist & Music Video Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tracks Summary */}
            <div className="bg-canvas border border-line rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
                  <Music2 className="w-3.5 h-3.5 text-primary" />
                  Contenido Musical ({data.songCount} {data.songCount === 1 ? 'Pista' : 'Pistas'})
                </span>
                <span className="text-2xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Listo para Streaming
                </span>
              </div>

              {data.trackTitles && data.trackTitles.length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {data.trackTitles.map((track, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-md bg-surface border border-line text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs text-primary font-bold w-4">
                          {idx + 1}.
                        </span>
                        <span className="font-medium text-fg truncate">
                          {track}
                        </span>
                      </div>
                      <span className="text-2xs font-mono text-fg-muted shrink-0 ml-2">
                        Audio HQ
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-md bg-surface border border-line text-xs text-[#CBD5E1]">
                  Pista principal: <strong>{data.title}</strong>
                </div>
              )}
            </div>

            {/* Official Music Video or Visual Status */}
            <div className="bg-canvas border border-line rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
                  <Clapperboard className="w-3.5 h-3.5 text-info" />
                  Acompañamiento Audiovisual
                </span>
                {data.musicVideo ? (
                  <span className="text-2xs font-bold uppercase text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
                    Estreno Oficial
                  </span>
                ) : (
                  <span className="text-2xs text-fg-muted font-mono">Solo Audio</span>
                )}
              </div>

              {data.musicVideo ? (
                <div className="space-y-2 text-xs">
                  <div className="bg-surface p-3 rounded-lg border border-info/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-fg-muted">Concepto:</span>
                      <strong className="text-[#38BDF8]">{data.musicVideo.concept}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-fg-muted">Dirección:</span>
                      <strong className="text-primary-soft">{data.musicVideo.directorTier}</strong>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-line">
                      <span className="text-fg-muted">Costo de Rodaje:</span>
                      <strong className="font-mono text-emerald-400">
                        {formatMoney(data.musicVideo.budget)}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-surface border border-line text-xs text-fg-muted italic my-auto">
                  Lanzamiento publicado en formato exclusivo de audio digital. Puedes producir videoclips en futuros singles.
                </div>
              )}
            </div>
          </div>

          {/* Financial & Budget Spent Summary */}
          <div className="bg-canvas border border-line rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-fg">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Balance Financiero & Presupuesto Invertido</span>
              </div>
              <div className="text-right">
                <span className="text-2xs uppercase text-fg-muted block">Inversión Total</span>
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-400">
                  {formatMoney(data.totalBudget)}
                </span>
              </div>
            </div>

            {/* Budget Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="bg-surface p-2.5 rounded-lg border border-line">
                <span className="text-2xs text-fg-muted uppercase block">Producción</span>
                <span className="font-bold text-warning">
                  {formatMoney(data.budgetBreakdown?.production ?? 0)}
                </span>
              </div>

              <div className="bg-surface p-2.5 rounded-lg border border-line">
                <span className="text-2xs text-fg-muted uppercase block">Marketing</span>
                <span className="font-bold text-emerald-400">
                  {formatMoney(data.budgetBreakdown?.marketing ?? 0)}
                </span>
              </div>

              <div className="bg-surface p-2.5 rounded-lg border border-line">
                <span className="text-2xs text-fg-muted uppercase block">Productor</span>
                <span className="font-bold text-cyan-400">
                  {formatMoney(data.budgetBreakdown?.producerFee ?? 0)}
                </span>
              </div>

              <div className="bg-surface p-2.5 rounded-lg border border-line">
                <span className="text-2xs text-fg-muted uppercase block">Videoclip</span>
                <span className="font-bold text-primary-soft">
                  {formatMoney(data.budgetBreakdown?.videoCost ?? (data.musicVideo?.budget ?? 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-line bg-surface/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <span className="text-xs text-fg-muted text-center sm:text-left">
            El catálogo se actualizó. Puedes consultar reproducciones y ventas en cualquier momento.
          </span>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white px-6 py-2.5 rounded-md text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continuar al Catálogo</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
