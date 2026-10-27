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
 * Opción Interactiva 'Liquid Glass Lens' (GlassOptionButton)
 * - Ficha tipo lente (.liquid-option): bisel especular superior, sombra cáustica en la base y halo exterior difuso.
 * - Iluminación reactiva al cursor (Spotlight Glass Borders con variables --mouse-x y --mouse-y).
 * - Estados ópticos: hover con elevación (-1.5px) y dispersión cromática; active con compresión física elástica a scale(0.98).
 * - Selección: brillo esmeralda reforzado con halo difuso y bisel reflectante de alta fidelidad.
 * - Accesibilidad y rendimiento optimizado para 60fps con desenfoque nativo para elementos interactivos.
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
        className={`liquid-option glass-option spotlight-border w-full text-left p-4 rounded-[4px] text-white select-none transition-all duration-200 cursor-pointer relative overflow-hidden group ${
          selected ? 'selected' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
        {...rest}
      >
        {/* Bisel especular diagonal superior (sheen óptico curvo) */}
        <div
          className="absolute inset-x-0 top-0 h-[45%] pointer-events-none mix-blend-screen opacity-70 group-hover:opacity-100 transition-opacity"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 60%, transparent 100%)',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit'
          }}
          aria-hidden="true"
        />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {icon && (
              <div
                className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                  selected
                    ? 'bg-[#00E599]/20 text-[#00E599]'
                    : 'bg-white/[0.08] text-[#00E599] group-hover:bg-[#00E599]/15'
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
                    selected ? 'text-[#00E599]/90' : 'text-[#8E8E99] group-hover:text-[#A1A1AA]'
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
