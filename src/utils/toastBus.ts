export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  durationMs: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastBus {
  private listeners: Set<ToastListener> = new Set();
  private toasts: ToastItem[] = [];
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  public subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public show(params: {
    message: string;
    title?: string;
    variant?: ToastVariant;
    durationMs?: number;
  }): string {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const durationMs = params.durationMs ?? (params.variant === 'error' ? 5200 : 3800);
    const item: ToastItem = {
      id,
      title: params.title,
      message: params.message,
      variant: params.variant ?? 'info',
      durationMs,
    };

    this.toasts = [item, ...this.toasts].slice(0, 3);
    this.notify();

    if (typeof window !== 'undefined' && durationMs > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
      this.timers.set(id, timer);
    }

    return id;
  }

  public dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    const prevLen = this.toasts.length;
    this.toasts = this.toasts.filter((t) => t.id !== id);
    if (this.toasts.length !== prevLen) {
      this.notify();
    }
  }

  private notify(): void {
    const snapshot = [...this.toasts];
    this.listeners.forEach((fn) => {
      try {
        fn(snapshot);
      } catch {
        // ignore listener failure
      }
    });
  }
}

export const toastBus = new ToastBus();

export function showToast(
  messageOrParams:
    | string
    | {
        message: string;
        title?: string;
        variant?: ToastVariant;
        durationMs?: number;
      },
  variant: ToastVariant = 'info',
  title?: string
): string {
  if (typeof messageOrParams === 'string') {
    return toastBus.show({ message: messageOrParams, variant, title });
  }
  return toastBus.show(messageOrParams);
}
