import React from 'react';

export interface ArtistaLogoProps {
  compact?: boolean;
  showWordmark?: boolean;
  showBadge?: boolean;
  subtitle?: string;
  className?: string;
}

/**
 * ArtistaLogo — Estilo "Vinilo Master Analógico"
 *
 * 1. Contenedor Squircle de Estudio:
 *    - 44x44px en normal, 36x36px en compacto
 *    - Superficie mate #111114 con borde #242429 y acento Signal Orange (#FF4F00)
 * 2. Isotipo SVG del Vinilo (3 Capas):
 *    - Plato oscuro de vinilo con surcos concéntricos
 *    - Arcos especulares cálidos en rotación continua
 *    - Núcleo central con sello Signal Orange
 * 3. Tipografía Editorial:
 *    - "ARTISTA" en Syne (--font-display)
 *    - Píldora "GAME" en Plus Jakarta Sans tabular
 */
export const ArtistaLogo: React.FC<ArtistaLogoProps> = ({
  compact = false,
  showWordmark = true,
  showBadge = true,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none group/logo ${className}`}>
      {/* 1. Contenedor Squircle */}
      <div
        className={`relative flex items-center justify-center shrink-0 overflow-hidden transition-all duration-300 ${
          compact
            ? 'w-9 h-9 artista-logo-squircle-compact'
            : 'w-11 h-11 artista-logo-squircle'
        } bg-[#111114] border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_-4px_rgba(255,79,0,0.22)] group-hover/logo:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_10px_24px_-2px_rgba(255,79,0,0.34)] group-hover/logo:border-[#FF4F00]/45`}
      >
        {/* Reflejo cálido interno sutil */}
        <div className="absolute -inset-1 bg-[#FF4F00]/12 pointer-events-none rounded-full" />

        {/* Reflejo diagonal sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent pointer-events-none" />

        {/* 2. Isotipo SVG del Vinilo */}
        <svg
          viewBox="0 0 100 100"
          className={`relative z-10 transition-transform duration-300 group-hover/logo:scale-105 ${
            compact ? 'w-6 h-6' : 'w-7 h-7'
          }`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="viniloPlatterStroke" x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#F4F0EA" stopOpacity="0.92" />
              <stop offset="48%" stopColor="#FF6B2B" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FF4F00" stopOpacity="0.95" />
            </linearGradient>

            <radialGradient id="viniloPlatterFill" cx="42%" cy="42%" r="58%">
              <stop offset="0%" stopColor="#2A1812" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#141418" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#09090B" stopOpacity="1" />
            </radialGradient>

            <linearGradient id="viniloGrooveSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FF4F00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.85" />
            </linearGradient>

            <radialGradient id="viniloCoreBg" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#FF5E14" />
              <stop offset="75%" stopColor="#D93F00" />
              <stop offset="100%" stopColor="#7C2D12" />
            </radialGradient>

            <linearGradient id="viniloCoreStroke" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
              <stop offset="50%" stopColor="#FDBA74" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF4F00" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* CAPA 1: PLATO DE VINILO */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="url(#viniloPlatterFill)"
            stroke="url(#viniloPlatterStroke)"
            strokeWidth="2.5"
          />

          {/* Micro-surcos concéntricos de audio */}
          <circle cx="50" cy="50" r="33" fill="none" stroke="#F4F0EA" strokeWidth="0.75" strokeOpacity="0.16" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="#F4F0EA" strokeWidth="0.75" strokeOpacity="0.12" />

          {/* CAPA 2: SURCOS DE LUZ */}
          <g className="origin-center animate-[spin_14s_linear_infinite] group-hover/logo:animate-[spin_4s_linear_infinite] transition-all">
            <path
              d="M 28.8 28.8 A 30 30 0 0 1 71.2 28.8"
              fill="none"
              stroke="url(#viniloGrooveSheen)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 71.2 71.2 A 30 30 0 0 1 28.8 71.2"
              fill="none"
              stroke="url(#viniloGrooveSheen)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 34.5 34.5 A 22 22 0 0 1 65.5 34.5"
              fill="none"
              stroke="url(#viniloGrooveSheen)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
            <path
              d="M 65.5 65.5 A 22 22 0 0 1 34.5 65.5"
              fill="none"
              stroke="url(#viniloGrooveSheen)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* CAPA 3: NÚCLEO CENTRAL */}
          <circle
            cx="50"
            cy="50"
            r="14"
            fill="url(#viniloCoreBg)"
            stroke="url(#viniloCoreStroke)"
            strokeWidth="2"
          />

          {/* Orificio central del eje */}
          <circle
            cx="50"
            cy="50"
            r="4.5"
            fill="#09090B"
            stroke="#F4F0EA"
            strokeWidth="1"
            strokeOpacity="0.55"
          />

          {/* Punto de reflejo especular blanco */}
          <circle
            cx="44.5"
            cy="44.5"
            r="1.5"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
        </svg>
      </div>

      {/* 3. Tipografía Editorial Acompañante */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`font-display font-extrabold tracking-tight text-[#F4F0EA] leading-none ${
                compact ? 'text-sm' : 'text-base sm:text-lg'
              }`}
            >
              ARTISTA
            </span>
            {showBadge && (
              <span className="text-[10px] font-sans font-bold tracking-wider tabular-nums bg-[#FF4F00]/15 text-[#FF6B2B] border border-[#FF4F00]/30 rounded-full px-1.5 py-0.5 leading-none artista-logo-badge">
                GAME
              </span>
            )}
          </div>
          {subtitle && (
            <span className="text-[11px] text-[#A1A1AA] font-sans font-medium tracking-wider uppercase mt-1 leading-tight">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
