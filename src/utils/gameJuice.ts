import type React from 'react';
import confetti from 'canvas-confetti';

export type HudTarget = 'money' | 'energy' | 'fans' | 'points';

export interface FloatingItem {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'money' | 'energy' | 'fans' | 'skill' | 'negative' | 'neutral' | 'points';
  targetHud?: HudTarget;
}

type HudImpactListener = (target: HudTarget) => void;
type FloatingItemsListener = (items: FloatingItem[]) => void;

class GameJuiceManager {
  private hudListeners: Set<HudImpactListener> = new Set();
  private floatingListeners: Set<FloatingItemsListener> = new Set();
  private activeFloatingItems: FloatingItem[] = [];
  private classTimers: WeakMap<HTMLElement, ReturnType<typeof setTimeout>> = new WeakMap();
  private hudTimers: Map<HudTarget, ReturnType<typeof setTimeout>> = new Map();

  private resolveElement(elementOrId?: HTMLElement | string | null): HTMLElement | null {
    if (typeof document === 'undefined' || !elementOrId) return null;
    if (typeof elementOrId !== 'string') return elementOrId;
    const byId = document.getElementById(elementOrId);
    if (byId) return byId;
    if (elementOrId.startsWith('#') || elementOrId.startsWith('.')) {
      try {
        return document.querySelector(elementOrId);
      } catch {
        return null;
      }
    }
    return null;
  }

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
    if (typeof window === 'undefined') return;
    let originX = 0.5;
    let originY = 0.5;

    if (originTarget) {
      if ('clientX' in originTarget && 'clientY' in originTarget) {
        originX = originTarget.clientX / Math.max(1, window.innerWidth);
        originY = originTarget.clientY / Math.max(1, window.innerHeight);
      } else if ('getBoundingClientRect' in originTarget) {
        const rect = (originTarget as HTMLElement).getBoundingClientRect();
        originX = (rect.left + rect.width / 2) / Math.max(1, window.innerWidth);
        originY = (rect.top + rect.height / 2) / Math.max(1, window.innerHeight);
      } else if ('x' in originTarget && 'y' in originTarget) {
        originX = originTarget.x > 1 ? originTarget.x / Math.max(1, window.innerWidth) : originTarget.x;
        originY = originTarget.y > 1 ? originTarget.y / Math.max(1, window.innerHeight) : originTarget.y;
      }
    }

    try {
      confetti({
        particleCount: 24,
        spread: 52,
        origin: { x: Math.max(0.05, Math.min(0.95, originX)), y: Math.max(0.05, Math.min(0.95, originY)) },
        colors: ['#FF4F00', '#10B981', '#F59E0B', '#38BDF8', '#F4F0EA'],
        startVelocity: 22,
        ticks: 85,
        gravity: 1.15,
        scalar: 0.85,
        shapes: ['circle', 'square'],
        disableForReducedMotion: true
      });
    } catch {
      // ignore canvas errors in headless environments
    }
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
    if (typeof window === 'undefined') return;
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

    if (params.targetHud) {
      const targetHud = params.targetHud;
      const prevTimer = this.hudTimers.get(targetHud);
      if (prevTimer) clearTimeout(prevTimer);
      this.hudTimers.set(
        targetHud,
        setTimeout(() => {
          this.hudTimers.delete(targetHud);
          this.triggerHudPop(targetHud);
        }, 450)
      );
    }

    setTimeout(() => {
      this.activeFloatingItems = this.activeFloatingItems.filter((f) => f.id !== item.id);
      this.notifyFloating();
    }, 1000);
  }

  public triggerSuccess(
    elementOrId?: HTMLElement | string | null,
    options?: {
      pointsText?: string;
      targetHud?: HudTarget;
    }
  ): void {
    const el = this.resolveElement(elementOrId);

    if (el) {
      const prevTimer = this.classTimers.get(el);
      if (prevTimer) clearTimeout(prevTimer);
      el.classList.remove('card-success-pulse');
      void el.offsetWidth;
      el.classList.add('card-success-pulse');
      this.classTimers.set(
        el,
        setTimeout(() => {
          el.classList.remove('card-success-pulse');
          this.classTimers.delete(el);
        }, 1200)
      );
    }

    this.triggerConfetti(el);

    const pointsText = options?.pointsText || '+Puntos';
    const targetHud = options?.targetHud || 'points';

    this.triggerFloatingNumber({
      text: pointsText,
      origin: el,
      type: 'points',
      targetHud
    });
  }

  public triggerError(elementOrId?: HTMLElement | string | null): void {
    const el = this.resolveElement(elementOrId);
    if (!el) return;

    const prevTimer = this.classTimers.get(el);
    if (prevTimer) clearTimeout(prevTimer);
    el.classList.remove('card-error-shake');
    el.classList.remove('kit-shake');
    void el.offsetWidth;
    el.classList.add('card-error-shake');

    this.classTimers.set(
      el,
      setTimeout(() => {
        el.classList.remove('card-error-shake');
        this.classTimers.delete(el);
      }, 450)
    );
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
