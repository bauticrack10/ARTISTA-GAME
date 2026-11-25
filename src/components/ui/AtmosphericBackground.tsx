import React from 'react';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#09090B]"
    >
      {/* Gradiente radial cenital muy sutil en Signal Orange */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 45% at 50% -10%, rgba(255, 79, 0, 0.045) 0%, transparent 70%)'
        }}
      />

      {/* Capa global de ruido SVG ultrafino para tacto físico analógico */}
      <svg
        className="opacity-[0.025] pointer-events-none fixed inset-0 z-10 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="ultra-fine-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ultra-fine-noise)" />
      </svg>
    </div>
  );
};
