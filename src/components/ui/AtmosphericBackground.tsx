import React from 'react';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#090A0F]"
    >
      {/* Orbe 1: Azul Eléctrico / Cian - Superior Izquierda */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[650px] h-[650px] rounded-full bg-[#0070F3]/25 blur-[120px] animate-float-1 will-change-transform"
      />

      {/* Orbe 2: Índigo Profundo / Ultra - Centro Derecha */}
      <div
        className="absolute top-[30%] -right-[10%] w-[700px] h-[700px] rounded-full bg-[#4F46E5]/20 blur-[130px] animate-float-2 will-change-transform"
      />

      {/* Orbe 3: Esmeralda Dopamina - Inferior Central / Izquierda */}
      <div
        className="absolute -bottom-[15%] left-[20%] w-[750px] h-[750px] rounded-full bg-[#00E599]/20 blur-[140px] animate-float-3 will-change-transform"
      />

      {/* Textura de Grano Analógico para eliminar banding de degradados y dar tacto físico */}
      <div className="absolute inset-0 analog-grain opacity-20 pointer-events-none" />
    </div>
  );
};
