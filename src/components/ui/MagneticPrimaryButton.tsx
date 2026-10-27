import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playSound } from '../../utils/audioSystem';

export interface MagneticPrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  soundEffect?: string | false;
  magneticPull?: number;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
}

/**
 * Botón de Acción Principal 'Liquid Glass Lens' (MagneticPrimaryButton)
 * - Geometría de cápsula: border-radius 9999px.
 * - Iluminación interna multicapa: resplandor especular blanco superior, sombra cáustica interna en la base y halo difuso exterior.
 * - Física óptica reactiva: dispersión cromática (cyan y magenta en bordes) y elevación en hover; compresión elástica a scale(0.97) e inversión de bisel en active.
 * - Efecto magnético sutil con mouse tracking (física de atracción hacia el cursor).
 * - Refracción óptica con fallback progresivo y optimización a 60fps.
 * - Accesibilidad: respeta estrictamente @media (prefers-reduced-motion).
 */
export const MagneticPrimaryButton = React.forwardRef<HTMLButtonElement, MagneticPrimaryButtonProps>(
  (
    {
      label,
      icon,
      iconPosition = 'left',
      soundEffect = 'click',
      magneticPull = 10,
      fullWidth = false,
      variant = 'primary',
      children,
      className = '',
      onClick,
      disabled,
      style,
      type = 'button',
      ...rest
    },
    forwardedRef
  ) => {
    const innerRef = useRef<HTMLButtonElement | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const prefersReducedMotion = useRef(false);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion.current = mql.matches;
        const handler = (e: MediaQueryListEvent) => {
          prefersReducedMotion.current = e.matches;
          if (e.matches) setOffset({ x: 0, y: 0 });
        };
        mql.addEventListener?.('change', handler);
        return () => mql.removeEventListener?.('change', handler);
      }
    }, []);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || prefersReducedMotion.current) return;
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const pullX = (deltaX / (rect.width / 2)) * magneticPull;
      const pullY = (deltaY / (rect.height / 2)) * magneticPull;
      setOffset({ x: Math.max(-magneticPull, Math.min(magneticPull, pullX)), y: Math.max(-magneticPull, Math.min(magneticPull, pullY)) });
    };

    const handleMouseEnter = () => {
      if (disabled) return;
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsPressed(false);
      setOffset({ x: 0, y: 0 });
    };

    const handleMouseDown = () => {
      if (disabled) return;
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleTouchStart = () => {
      if (disabled) return;
      setIsPressed(true);
    };

    const handleTouchEnd = () => {
      setIsPressed(false);
    };

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

    // Física de compresión elástica activa y elevación óptica en hover
    const dynamicTransform = prefersReducedMotion.current
      ? undefined
      : {
          transform: isPressed
            ? `translate3d(${offset.x}px, ${offset.y + 1}px, 0) scale(0.97)`
            : isHovered
            ? `translate3d(${offset.x}px, ${offset.y - 2}px, 0) scale(1.02)`
            : 'translate3d(0, 0, 0) scale(1)',
          transition: isHovered
            ? 'transform 0.12s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.2s ease, filter 0.2s ease'
            : 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease, filter 0.2s ease'
        };

    const variantClass = variant === 'secondary'
      ? 'liquid-btn-secondary'
      : 'liquid-btn-primary game-btn-primary';

    return (
      <button
        ref={setRefs}
        type={type}
        disabled={disabled}
        data-hovered={isHovered ? 'true' : undefined}
        data-pressed={isPressed ? 'true' : undefined}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ ...dynamicTransform, ...style }}
        className={`liquid-btn ${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...rest}
      >
        {icon && iconPosition === 'left' && (
          <span className="shrink-0 flex items-center justify-center relative z-10">{icon}</span>
        )}
        {label && <span className="relative z-10">{label}</span>}
        {children && (typeof children === 'string' ? <span className="relative z-10">{children}</span> : <div className="relative z-10 contents">{children}</div>)}
        {icon && iconPosition === 'right' && (
          <span className="shrink-0 flex items-center justify-center relative z-10">{icon}</span>
        )}
      </button>
    );
  }
);

MagneticPrimaryButton.displayName = 'MagneticPrimaryButton';
