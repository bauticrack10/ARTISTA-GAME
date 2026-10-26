import confetti from 'canvas-confetti';

export type HudTarget = 'money' | 'energy' | 'fans';

export interface FloatingItem {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'money' | 'energy' | 'fans' | 'skill' | 'negative' | 'neutral';
  targetHud?: HudTarget;
}

type HudImpactListener = (target: HudTarget) => void;
type FloatingItemsListener = (items: FloatingItem[]) => void;

class GameJuiceManager {
  private hudListeners: Set<HudImpactListener> = new Set();
  private floatingListeners: Set<FloatingItemsListener> = new Set();
  private activeFloatingItems: FloatingItem[] = [];

  /**
   * Suscribirse a impactos en el HUD (Navbar) para activar el pop reactivo
   */
  public subscribeHudImpact(listener: HudImpactListener): () => void {
    this.hudListeners.add(listener);
    return () => {
      this.hudListeners.delete(listener);
    };
  }

  /**
   * Suscribirse a los números flotantes activos
   */
  public subscribeFloating(listener: FloatingItemsListener): () => void {
    this.floatingListeners.add(listener);
    listener([...this.activeFloatingItems]);
    return () => {
      this.floatingListeners.delete(listener);
    };
  }

  /**
   * Dispara el pop visual (scale-125) en el marcador del HUD
   */
  public triggerHudPop(target: HudTarget): void {
    this.hudListeners.forEach((fn) => {
      try {
        fn(target);
      } catch (err) {
        console.error('Error en hud listener:', err);
      }
    });
  }

  /**
   * Dispara una ráfaga ligera de confeti/partículas desde las coordenadas del botón interactuado
   */
  public triggerConfetti(
    originTarget?: HTMLElement | MouseEvent | React.MouseEvent | { x: number; y: number } | null
  ): void {
    let originX = 0.5;
    let originY = 0.5;

    if (originTarget) {
      if ('clientX' in originTarget && 'clientY' in originTarget) {
        originX = originTarget.clientX / window.innerWidth;
        originY = originTarget.clientY / window.innerHeight;
      } else if ('getBoundingClientRect' in originTarget) {
        const rect = (originTarget as HTMLElement).getBoundingClientRect();
        originX = (rect.left + rect.width / 2) / window.innerWidth;
        originY = (rect.top + rect.height / 2) / window.innerHeight;
      } else if ('x' in originTarget && 'y' in originTarget) {
        originX = originTarget.x > 1 ? originTarget.x / window.innerWidth : originTarget.x;
        originY = originTarget.y > 1 ? originTarget.y / window.innerHeight : originTarget.y;
      }
    }

    // Ráfaga ligera, limpia y optimizada (Game Juice sin saturar)
    confetti({
      particleCount: 28,
      spread: 55,
      origin: { x: Math.max(0.05, Math.min(0.95, originX)), y: Math.max(0.05, Math.min(0.95, originY)) },
      colors: ['#00E599', '#FF4F00', '#00D2FF', '#FFFFFF', '#F59E0B'],
      startVelocity: 24,
      ticks: 90,
      gravity: 1.15,
      scalar: 0.85,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true
    });
  }

  /**
   * Dispara un número o texto flotante que aparece en el punto de interacción y viaja hacia el HUD
   */
  public triggerFloatingNumber(params: {
    text: string;
    origin?: HTMLElement | MouseEvent | React.MouseEvent | { x: number; y: number } | null;
    type?: FloatingItem['type'];
    targetHud?: HudTarget;
  }): void {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (params.origin) {
      if ('clientX' in params.origin && 'clientY' in params.origin) {
        x = params.origin.clientX;
        y = params.origin.clientY;
      } else if ('getBoundingClientRect' in params.origin) {
        const rect = (params.origin as HTMLElement).getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top;
      } else if ('x' in params.origin && 'y' in params.origin) {
        x = params.origin.x;
        y = params.origin.y;
      }
    }

    // Leve offset aleatorio para que múltiples números flotantes no se superpongan exactamente
    const offsetSpread = (Math.random() - 0.5) * 36;
    const item: FloatingItem = {
      id: `float_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      text: params.text,
      x: x + offsetSpread,
      y: y - 10,
      type: params.type || 'neutral',
      targetHud: params.targetHud
    };

    this.activeFloatingItems.push(item);
    this.notifyFloating();

    // Cuando el número viaja hacia el HUD (450ms), hacer el pop reactivo en el HUD
    if (params.targetHud) {
      setTimeout(() => {
        this.triggerHudPop(params.targetHud!);
      }, 450);
    }

    // Limpieza automática tras concluir la animación
    setTimeout(() => {
      this.activeFloatingItems = this.activeFloatingItems.filter((f) => f.id !== item.id);
      this.notifyFloating();
    }, 1000);
  }

  /**
   * Pulso verde esmeralda / dorado en el borde de la tarjeta con partículas suaves luminosas
   */
  public triggerSuccess(elementOrId?: HTMLElement | string | null): void {
    let el: HTMLElement | null = null;
    if (typeof elementOrId === 'string') {
      el = document.getElementById(elementOrId) || document.querySelector(elementOrId);
    } else if (elementOrId) {
      el = elementOrId;
    }

    if (el) {
      el.classList.remove('card-success-pulse');
      void el.offsetWidth;
      el.classList.add('card-success-pulse');
      setTimeout(() => {
        el?.classList.remove('card-success-pulse');
      }, 1200);
    }

    this.triggerConfetti(el);
  }

  /**
   * Vibración horizontal corta y elegante (shake) acompañada de destello rojo translúcido
   */
  public triggerError(elementOrId?: HTMLElement | string | null): void {
    let el: HTMLElement | null = null;
    if (typeof elementOrId === 'string') {
      el = document.getElementById(elementOrId) || document.querySelector(elementOrId);
    } else if (elementOrId) {
      el = elementOrId;
    }

    if (!el) return;

    el.classList.remove('card-error-shake');
    el.classList.remove('kit-shake');
    void el.offsetWidth;
    el.classList.add('card-error-shake');

    setTimeout(() => {
      el?.classList.remove('card-error-shake');
    }, 450);
  }

  /**
   * Aplica la animación .kit-shake rápidamente cuando una acción falla o faltan fondos/energía
   */
  public triggerShake(elementOrId?: HTMLElement | string | null): void {
    this.triggerError(elementOrId);
  }

  private notifyFloating(): void {
    const list = [...this.activeFloatingItems];
    this.floatingListeners.forEach((fn) => {
      try {
        fn(list);
      } catch (err) {
        console.error('Error en floating listener:', err);
      }
    });
  }
}

export const gameJuice = new GameJuiceManager();
