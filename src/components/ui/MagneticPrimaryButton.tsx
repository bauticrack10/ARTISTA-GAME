import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playSound } from '../../utils/audioSystem';

export interface MagneticPrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  soundEffect?: string | false;
  magneticPull?: number;
  fullWidth?: boolean;
}

/**
 * Botón de Acción Primaria Magnético (MagneticPrimaryButton)
 * - Efecto magnético sutil con mouse tracking (física de resorte/transform translate leve que atrae el botón hacia el cursor al pasar cerca, volviendo elásticamente al centro onMouseLeave).
 * - Acabado luminoso de alto contraste: gradiente sutil esmeralda a cian (from-[#00E599] to-[#00D2FF] con texto oscuro de alto contraste), y resplandor exterior suave shadow-[0_0_25px_rgba(16,185,129,0.35)].
 * - Efecto 'shimmer': un haz de luz diagonal sutil que cruza el botón cada pocos segundos en estado de reposo (animación CSS @keyframes btn-shimmer).
 * - Respuesta táctil elástica: hover:scale-[1.02] active:scale-[0.98] con transición suave.
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

    const dynamicTransform = prefersReducedMotion.current
      ? undefined
      : {
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${
            isPressed ? 0.98 : isHovered ? 1.02 : 1
          })`,
          transition: isHovered
            ? 'transform 0.1s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.2s ease, filter 0.2s ease'
            : 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease, filter 0.2s ease'
        };

    return (
      <button
        ref={setRefs}
        type={type}
        disabled={disabled}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ ...dynamicTransform, ...style }}
        className={`game-btn-primary ${fullWidth ? 'w-full' : ''} ${className}`}
        {...rest}
      >
        {icon && iconPosition === 'left' && (
          <span className="shrink-0 flex items-center justify-center">{icon}</span>
        )}
        {label && <span>{label}</span>}
        {children && (typeof children === 'string' ? <span>{children}</span> : children)}
        {icon && iconPosition === 'right' && (
          <span className="shrink-0 flex items-center justify-center">{icon}</span>
        )}
      </button>
    );
  }
);

MagneticPrimaryButton.displayName = 'MagneticPrimaryButton';
