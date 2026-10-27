import React from 'react';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#090A0F]"
    >
      {/* Orbe 1: Azul Eléctrico / Cian - Superior Izquierda */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[680px] h-[680px] rounded-full bg-[#0070F3]/30 blur-[110px] animate-float-1 will-change-transform"
      />

      {/* Orbe 2: Índigo Profundo / Ultra - Centro Derecha */}
      <div
        className="absolute top-[25%] -right-[10%] w-[720px] h-[720px] rounded-full bg-[#6366F1]/25 blur-[120px] animate-float-2 will-change-transform"
      />

      {/* Orbe 3: Esmeralda Dopamina - Inferior Central / Izquierda */}
      <div
        className="absolute -bottom-[15%] left-[15%] w-[780px] h-[780px] rounded-full bg-[#00E599]/25 blur-[130px] animate-float-3 will-change-transform"
      />

      {/* Orbe 4: Ámbar Dorado Suave - Centro Izquierda para refracción cálida */}
      <div
        className="absolute top-[55%] left-[5%] w-[550px] h-[550px] rounded-full bg-[#F59E0B]/15 blur-[140px] animate-float-1 will-change-transform"
      />

      {/* Textura de Grano Analógico para eliminar banding de degradados y dar tacto físico */}
      <div className="absolute inset-0 analog-grain opacity-20 pointer-events-none" />

      {/* Capa global de ruido SVG ultrafino para eliminar cualquier banding y dar tacto físico analógico */}
      <svg
        className="opacity-[0.025] pointer-events-none mix-blend-overlay fixed inset-0 z-10 w-full h-full"
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
