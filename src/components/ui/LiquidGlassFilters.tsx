import React from 'react';

/**
 * LiquidGlassFilters
 * 
 * Inyecta filtros SVG de distorsión y refracción óptica basados en el sistema de diseño
 * Apple Liquid Glass (WWDC25 / iOS 26).
 * - id="liquid-refract": Refracción fluida orgánica suave para tarjetas y superficies amplias.
 * - id="liquid-lens-btn": Distorsión óptica de lente concentrada para botones, píldoras y HUDs.
 */
export const LiquidGlassFilters: React.FC = () => {
  return (
    <svg
      width="0"
      height="0"
      className="fixed pointer-events-none -z-50 opacity-0 overflow-hidden"
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* Refracción óptica fluida para tarjetas y paneles */}
        <filter id="liquid-refract" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.015"
            numOctaves={2}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={8}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>

        {/* Lente óptica de alta curvatura para botones, fichas y controles */}
        <filter id="liquid-lens-btn" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.035"
            numOctaves={2}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={18}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>
      </defs>
    </svg>
  );
};
