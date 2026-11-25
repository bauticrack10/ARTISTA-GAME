import React from 'react';

/**
 * LiquidGlassFilters
 *
 * Contenedor SVG limpio sin deformación de texto ni filtros de desplazamiento.
 * Mantiene el export para compatibilidad estructural con App.tsx.
 */
export const LiquidGlassFilters: React.FC = () => {
  return (
    <svg
      width="0"
      height="0"
      className="fixed pointer-events-none -z-50 opacity-0 overflow-hidden"
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    />
  );
};
