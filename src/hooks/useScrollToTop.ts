import { useEffect, type DependencyList } from 'react';
import { scrollToTop } from '../utils/scrollUtils';

/**
 * Hook reutilizable para asegurar que la vista suba a la parte superior
 * al montarse o al cambiar cualquiera de las dependencias indicadas.
 */
export function useScrollToTop(deps: DependencyList = [], smooth: boolean = false): void {
  useEffect(() => {
    return scrollToTop(smooth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
