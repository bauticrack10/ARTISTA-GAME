/**
 * Utilidad global para reiniciar el desplazamiento (scroll) al tope de la ventana o contenedor.
 * Garantiza compatibilidad cruzada entre window, documentElement y document.body,
 * con protección en entornos SSR/Node y sin interferir con el modo suave.
 */
export function scrollToTop(smooth: boolean = false): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let rafId: number | null = null;
  const behavior: ScrollBehavior = smooth ? 'smooth' : 'instant';

  const performScroll = () => {
    if (typeof window === 'undefined') return;
    try {
      window.scrollTo({ top: 0, left: 0, behavior });
    } catch {
      window.scrollTo(0, 0);
    }

    if (!smooth && typeof document !== 'undefined') {
      if (document.documentElement && document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body && document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
    }
  };

  performScroll();

  if (!smooth && typeof window.requestAnimationFrame === 'function') {
    rafId = window.requestAnimationFrame(() => {
      performScroll();
    });
  }

  return () => {
    if (rafId !== null && typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(rafId);
    }
  };
}
