import React from 'react';
import { playSound } from '../../utils/audioSystem';

export interface GlassOptionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  label?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  soundEffect?: string | false;
}

/**
 * Opción de Cristal Esmerilado (GlassOptionButton)
 * - Cápsula de cristal esmerilado: bg-white/[0.05] backdrop-blur-md border border-white/10 text-white
 * - En focus o hover: iluminan su borde suavemente (border-white/30 y bg-white/[0.12])
 */
export const GlassOptionButton = React.forwardRef<HTMLButtonElement, GlassOptionButtonProps>(
  (
    {
      selected = false,
      label,
      subtitle,
      icon,
      badge,
      soundEffect = 'click',
      children,
      className = '',
      onClick,
      disabled,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (soundEffect) {
        try {
          playSound(soundEffect as any);
        } catch {
          // ignore audio failure
        }
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={handleClick}
        className={`w-full text-left rounded-[10px] p-3.5 transition-all duration-200 cursor-pointer border bg-white/[0.05] backdrop-blur-md text-white select-none ${
          selected
            ? 'border-[#00E599]/60 bg-white/[0.12] shadow-[0_0_20px_rgba(0,229,153,0.30)] ring-1 ring-[#00E599]/40'
            : 'border-white/10 hover:border-white/30 hover:bg-white/[0.12] hover:shadow-[0_0_18px_rgba(0,229,153,0.18)] active:scale-[0.98]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...rest}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && <div className="shrink-0 text-[#00E599]">{icon}</div>}
            <div className="min-w-0">
              {label && (
                <div className="font-bold text-sm text-[#F4F0EA] tracking-wide truncate">
                  {label}
                </div>
              )}
              {subtitle && (
                <div className="text-xs text-[#8E8E99] font-normal mt-0.5 truncate">
                  {subtitle}
                </div>
              )}
              {children}
            </div>
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
      </button>
    );
  }
);

GlassOptionButton.displayName = 'GlassOptionButton';
