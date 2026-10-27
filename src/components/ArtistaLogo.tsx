import React from 'react';

export interface ArtistaLogoProps {
  compact?: boolean;
  showWordmark?: boolean;
  showBadge?: boolean;
  subtitle?: string;
  className?: string;
}

/**
 * ArtistaLogo — Estilo "Vinilo Liquid Lens" minimalista
 * 
 * 1. Contenedor Squircle Liquid Glass:
 *    - 44x44px en normal, 36x36px en compacto
 *    - bg-slate-900/40 backdrop-blur-xl border border-white/[0.12]
 *    - Bisel especular superior e iluminación ambiental esmeralda
 *    - Reflejo diagonal sutil y orbe interno difuminado
 * 
 * 2. Isotipo SVG del Vinilo (3 Capas):
 *    - Capa 1 (Plato): Relleno radial esmeralda translúcido y borde blanco especular a verde esmeralda
 *    - Capa 2 (Surcos de Luz): Dos arcos simétricos internos con gradiente suave (#A7F3D0) que rotan continuamente y aceleran en hover
 *    - Capa 3 (Núcleo): Anillo central oscuro con borde luminoso esmeralda/blanco y punto de reflejo especular
 * 
 * 3. Tipografía Sobria:
 *    - "ARTISTA" en Geist/Inter font-semibold tracking-tight text-white
 *    - Píldora minimalista "GAME" en monoespaciada
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
      {/* 1. Contenedor Squircle Liquid Glass */}
      <div
        className={`relative flex items-center justify-center shrink-0 overflow-hidden transition-all duration-300 ${
          compact
            ? 'w-9 h-9 artista-logo-squircle-compact'
            : 'w-11 h-11 artista-logo-squircle'
        } rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.5),0_8px_24px_-4px_rgba(16,185,129,0.25)] group-hover/logo:shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.5),0_12px_28px_-2px_rgba(16,185,129,0.4)] group-hover/logo:border-white/25`}
      >
        {/* Orbe interno difuminado */}
        <div className="absolute -inset-1 bg-emerald-500/20 blur-md pointer-events-none rounded-full" />

        {/* Reflejo diagonal sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.18] to-transparent pointer-events-none rounded-2xl" />

        {/* 2. Isotipo SVG del Vinilo (3 Capas Limpias) */}
        <svg
          viewBox="0 0 100 100"
          className={`relative z-10 transition-transform duration-300 group-hover/logo:scale-105 ${
            compact ? 'w-6 h-6' : 'w-7 h-7'
          }`}
          aria-hidden="true"
        >
          <defs>
            {/* Capa 1: Borde del Plato (Blanco especular a Verde Esmeralda) */}
            <linearGradient id="viniloPlatterStroke" x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#34D399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" />
            </linearGradient>

            {/* Capa 1: Relleno Radial Esmeralda Translúcido del Plato */}
            <radialGradient id="viniloPlatterFill" cx="42%" cy="42%" r="58%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#064E3B" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#021E17" stopOpacity="0.9" />
            </radialGradient>

            {/* Capa 2: Gradiente Suave para los Surcos de Luz (#A7F3D0) */}
            <linearGradient id="viniloGrooveSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#34D399" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.85" />
            </linearGradient>

            {/* Capa 3: Núcleo Central Oscuro */}
            <radialGradient id="viniloCoreBg" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#0B1411" />
              <stop offset="80%" stopColor="#030806" />
              <stop offset="100%" stopColor="#052E22" />
            </radialGradient>

            {/* Capa 3: Borde Luminoso Esmeralda/Blanco del Núcleo */}
            <linearGradient id="viniloCoreStroke" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#34D399" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" />
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
          <circle cx="50" cy="50" r="33" fill="none" stroke="#10B981" strokeWidth="0.75" strokeOpacity="0.25" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="#10B981" strokeWidth="0.75" strokeOpacity="0.2" />

          {/* CAPA 2: SURCOS DE LUZ (Giro continuo de 14s, acelera a 4s en hover) */}
          <g className="origin-center animate-[spin_14s_linear_infinite] group-hover/logo:animate-[spin_4s_linear_infinite] transition-all">
            {/* Arcos simétricos externos */}
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

            {/* Arcos armónicos internos */}
            <path
              d="M 34.5 34.5 A 22 22 0 0 1 65.5 34.5"
              fill="none"
              stroke="url(#viniloGrooveSheen)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />
            <path
              d="M 65.5 65.5 A 22 22 0 0 1 34.5 65.5"
              fill="none"
              stroke="url(#viniloGrooveSheen)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeOpacity="0.75"
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
            fill="#090A0F"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          {/* Punto de reflejo especular blanco en la esquina superior izquierda */}
          <circle
            cx="44.5"
            cy="44.5"
            r="1.5"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
        </svg>
      </div>

      {/* 3. Tipografía Sobria Acompañante */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`font-sans font-semibold tracking-tight text-white leading-none ${
                compact ? 'text-sm' : 'text-base sm:text-lg'
              }`}
            >
              ARTISTA
            </span>
            {showBadge && (
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-400/25 rounded-full px-1.5 py-0.5 leading-none artista-logo-badge font-medium">
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
