import { useCallback, useRef } from 'react';

export interface UseSpotlightReturn<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T | null>;
  onMouseMove: (e: React.MouseEvent<T>) => void;
  onMouseLeave: (e: React.MouseEvent<T>) => void;
  handleMouseMove: (e: React.MouseEvent<T>) => void;
  handleMouseLeave: (e: React.MouseEvent<T>) => void;
}

/**
 * useSpotlight
 * 
 * Hook para iluminación reactiva al cursor (Spotlight Glass Borders).
 * Registra variables CSS `--mouse-x` y `--mouse-y` relativas a la caja en `onMouseMove`
 * y controla `--spotlight-opacity` (1 en movimiento, 0 al salir).
 */
export function useSpotlight<T extends HTMLElement = HTMLElement>(): UseSpotlightReturn<T> {
  const elementRef = useRef<T | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const el = elementRef.current || (e.currentTarget as T);
    if (!el || typeof el.getBoundingClientRect !== 'function') return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--mouse-x', `${Math.round(x)}px`);
    el.style.setProperty('--mouse-y', `${Math.round(y)}px`);
    el.style.setProperty('--spotlight-opacity', '1');
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<T>) => {
    const el = elementRef.current || (e.currentTarget as T);
    if (!el) return;

    el.style.setProperty('--spotlight-opacity', '0');
  }, []);

  return {
    ref: elementRef,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    handleMouseMove,
    handleMouseLeave
  };
}

export default useSpotlight;
