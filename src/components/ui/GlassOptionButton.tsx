import React from 'react';
import { playSound } from '../../utils/audioSystem';
import { useSpotlight } from '../../hooks/useSpotlight';

export interface GlassOptionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  label?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  soundEffect?: string | false;
}

/**
 * Opción Interactiva de Estudio (GlassOptionButton)
 * - Superficie elevada #18181C con borde #2A2A32 y spotlight reactivo al cursor
 * - Estado seleccionado con realce Signal Orange (#FF4F00)
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
      onMouseMove: onMouseMoveProp,
      onMouseLeave: onMouseLeaveProp,
      ...rest
    },
    ref
  ) => {
    const { onMouseMove: spotlightMouseMove, onMouseLeave: spotlightMouseLeave } = useSpotlight<HTMLButtonElement>();

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

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      spotlightMouseMove(e);
      onMouseMoveProp?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      spotlightMouseLeave(e);
      onMouseLeaveProp?.(e);
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-selected={selected}
        data-selected={selected ? 'true' : undefined}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`liquid-option glass-option spotlight-border w-full text-left p-4 rounded-[6px] text-[#F4F0EA] select-none transition-all duration-150 cursor-pointer relative overflow-hidden group ${
          selected ? 'selected' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
        {...rest}
      >
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {icon && (
              <div
                className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                  selected
                    ? 'bg-[#FF4F00]/20 text-[#FF4F00]'
                    : 'bg-white/[0.06] text-[#A1A1AA] group-hover:bg-[#FF4F00]/12 group-hover:text-[#FF4F00]'
                }`}
              >
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {label && (
                <div
                  className={`font-bold text-sm tracking-wide truncate transition-colors ${
                    selected ? 'text-white' : 'text-[#F4F0EA] group-hover:text-white'
                  }`}
                >
                  {label}
                </div>
              )}
              {subtitle && (
                <div
                  className={`text-xs font-normal mt-0.5 truncate transition-colors ${
                    selected ? 'text-[#FF6B2B]' : 'text-[#8E8E99] group-hover:text-[#A1A1AA]'
                  }`}
                >
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
