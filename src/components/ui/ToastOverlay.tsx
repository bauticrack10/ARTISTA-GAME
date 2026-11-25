import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { toastBus, ToastItem } from '../../utils/toastBus';

const VARIANT_STYLES: Record<
  ToastItem['variant'],
  { border: string; iconBg: string; iconColor: string; Icon: typeof Info }
> = {
  success: {
    border: 'border-[#10B981]/45',
    iconBg: 'bg-[#10B981]/15',
    iconColor: 'text-[#34D399]',
    Icon: CheckCircle2,
  },
  info: {
    border: 'border-[#FF4F00]/45',
    iconBg: 'bg-[#FF4F00]/15',
    iconColor: 'text-[#FF4F00]',
    Icon: Info,
  },
  warning: {
    border: 'border-[#F59E0B]/45',
    iconBg: 'bg-[#F59E0B]/15',
    iconColor: 'text-[#FBBF24]',
    Icon: AlertTriangle,
  },
  error: {
    border: 'border-[#EF4444]/50',
    iconBg: 'bg-[#EF4444]/15',
    iconColor: 'text-[#F87171]',
    Icon: AlertOctagon,
  },
};

export const ToastOverlay: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toastBus.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notificaciones del sistema"
      className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
    >
      {toasts.map((toast) => {
        const style = VARIANT_STYLES[toast.variant];
        const IconComp = style.Icon;

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto lg-toast rounded-[8px] border ${style.border} p-3.5 shadow-2xl flex items-start gap-3 text-[#F4F0EA] animate-stagger-in`}
          >
            <div className={`w-8 h-8 rounded-[6px] ${style.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
              <IconComp className={`w-4 h-4 ${style.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#F4F0EA] mb-0.5">
                  {toast.title}
                </p>
              )}
              <p className="text-xs sm:text-sm text-[#D4D4DC] leading-snug break-words">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toastBus.dismiss(toast.id)}
              className="p-1 rounded-[4px] text-[#A0A0AB] hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
