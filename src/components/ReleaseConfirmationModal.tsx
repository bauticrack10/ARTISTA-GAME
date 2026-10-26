import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  X,
  Disc3,
  Layers,
  Music2,
  Crown,
  ArrowRight
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
  const [streamTicker, setStreamTicker] = useState<number>(0);

  // Target first-day streams based on song's initial burst
  const targetInitialStreams = Math.max(12500, Math.floor(data.totalBudget * 4.5 + Math.random() * 25000));

  // Confetti and initial celebration on mount
  useEffect(() => {
    playSound('chart_no1');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4F00', '#00E599', '#F4F4F6', '#8E8E99']
      });
    } catch {
      // ignore
    }
  }, []);

  // Stream ticker increment effect
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(targetInitialStreams / 20);
    const interval = setInterval(() => {
      current = Math.min(targetInitialStreams, current + step);
      setStreamTicker(current);
      if (current >= targetInitialStreams) {
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [targetInitialStreams]);

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
          icon: Disc3
        };
      case 'ep':
        return {
          label: 'EP • Extended Play',
          icon: Layers
        };
      case 'mixtape':
        return {
          label: 'Mixtape',
          icon: Music2
        };
      case 'album':
        return {
          label: 'Álbum de Estudio',
          icon: Layers
        };
      case 'deluxe':
        return {
          label: 'Edición Deluxe',
          icon: Crown
        };
      case 'collab_album':
        return {
          label: 'Álbum Colaborativo',
          icon: Layers
        };
      default:
        return {
          label: type.toUpperCase(),
          icon: Disc3
        };
    }
  };

  const typeConfig = getTypeBadge(data.type);
  const TypeIcon = typeConfig.icon;
  const coverGrad = data.coverGradient || 'from-stone-900 via-zinc-900 to-black';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-[#111114] border border-[#242429] max-w-lg w-full rounded-[6px] flex flex-col overflow-hidden text-[#F4F4F6] shadow-2xl relative my-auto">
        {/* Modal Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-[#242429] bg-[#111114] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[4px] bg-[#09090B] border border-emerald-500/40 text-[#00E599] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#00E599]" />
            </div>
            <h2 className="text-sm font-bold text-[#F4F4F6] tracking-tight">
              Lanzamiento Publicado
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-[#F4F4F6] transition-colors cursor-pointer"
            title="Cerrar confirmación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Main Release Card (Cover + Metadata) */}
          <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Thematic Cover Art Box */}
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-[4px] bg-gradient-to-br ${coverGrad} border border-white/10 flex flex-col justify-between p-2.5 text-white shrink-0 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-black/70 px-1.5 py-0.5 rounded-[2px] border border-white/20">
                  {data.type}
                </span>
                <Disc3 className="w-3.5 h-3.5 text-[#FF4F00] animate-spin-slow" />
              </div>
              <div className="z-10">
                <span className="text-[10px] font-sans text-white/70 block tabular-nums">
                  {data.releaseYear}
                </span>
                <h4 className="text-xs font-bold text-white leading-tight line-clamp-2">
                  {data.title}
                </h4>
              </div>
            </div>

            {/* Project Details */}
            <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-[3px] text-xs font-semibold bg-[#18181C] border border-[#242429] text-[#F4F4F6] inline-flex items-center gap-1.5">
                  <TypeIcon className="w-3 h-3 text-[#FF4F00]" />
                  <span>{typeConfig.label}</span>
                </span>
                <span className="text-xs text-[#8E8E99]">
                  {formatReleaseDate(data.releaseMonth, data.releaseYear, 'long')}
                </span>
              </div>

              <div>
                <h3 className="kit-text-header font-game text-xl sm:text-2xl tracking-wide truncate">
                  {data.title}
                </h3>
                <p className="text-xs text-[#8E8E99] mt-0.5">
                  <span className="font-sans tabular-nums">{data.songCount}</span> {data.songCount === 1 ? 'Pista' : 'Pistas'} • Master Oficial
                </p>
              </div>

              {/* Tags / Credits */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap text-xs text-[#8E8E99] pt-0.5">
                <span className="text-[#FF4F00] font-semibold">{data.genreName}</span>
                {data.subGenreName && (
                  <>
                    <span>•</span>
                    <span>{data.subGenreName}</span>
                  </>
                )}
                {data.producerName ? (
                  <>
                    <span>•</span>
                    <span className="text-cyan-400">Prod: {data.producerName}</span>
                  </>
                ) : (
                  <>
                    <span>•</span>
                    <span>Producción Propia</span>
                  </>
                )}
                {data.featuredArtistNames && data.featuredArtistNames.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-pink-400">ft. {data.featuredArtistNames.join(', ')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Key Metrics Strip (Clean & Direct) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-3 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-sans font-medium text-[#8E8E99] tracking-wider block">
                Reproducciones Iniciales
              </span>
              <span className="text-lg sm:text-xl font-bold font-sans text-[#00E599] tabular-nums mt-0.5">
                +{streamTicker.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-3 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-sans font-medium text-[#8E8E99] tracking-wider block">
                Inversión Total
              </span>
              <span className="text-lg sm:text-xl font-bold font-sans text-[#F4F4F6] tabular-nums mt-0.5">
                {formatMoney(data.totalBudget)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#242429] bg-[#111114] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#242429] bg-[#18181C] hover:bg-[#242429] text-xs font-sans font-medium text-[#8E8E99] hover:text-[#F4F4F6] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          <button
            onClick={handleClose}
            className="bg-[#00E599] hover:bg-[#00FFAC] text-[#032115] px-6 py-2.5 rounded-xl text-xs sm:text-sm font-game font-black uppercase tracking-wider shadow-[0_3px_0_#009E65] active:translate-y-0.5 active:shadow-[0_1px_0_#009E65] border border-emerald-300/40 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Ir al Catálogo</span>
            <ArrowRight className="w-4 h-4 text-[#032115]" />
          </button>
        </div>
      </div>
    </div>
  );
};
