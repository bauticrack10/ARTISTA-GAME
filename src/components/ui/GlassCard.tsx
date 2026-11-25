import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useSpotlight } from '../../hooks/useSpotlight';

export interface GlassCardHandle {
  triggerSuccess: () => void;
  triggerError: () => void;
}

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'idle' | 'success' | 'error';
  variant?: 'level-1' | 'level-2' | 'level-3';
}

/**
 * Contenedor Reactivo de Estudio (GlassCard)
 * - Superficie mate sólida para level-1 (#18181C) y level-2 (#111114)
 * - Vitrina óptica .lg-hero-glass para level-3
 * - Iluminación reactiva al cursor (Spotlight Borders con --mouse-x y --mouse-y)
 * - Pulso esmeralda/ámbar en aciertos y vibración horizontal en errores
 * - Accesibilidad: respeta prefers-reduced-motion
 */
export const GlassCard = forwardRef<GlassCardHandle, GlassCardProps>(
  (
    {
      status: statusProp = 'idle',
      variant = 'level-2',
      children,
      className = '',
      id,
      onMouseMove: onMouseMoveProp,
      onMouseLeave: onMouseLeaveProp,
      ...rest
    },
    ref
  ) => {
    const [reactiveClass, setReactiveClass] = useState<string>('');
    const cardRef = useRef<HTMLDivElement | null>(null);
    const { onMouseMove: spotlightMouseMove, onMouseLeave: spotlightMouseLeave } = useSpotlight<HTMLDivElement>();

    useImperativeHandle(ref, () => ({
      triggerSuccess: () => {
        setReactiveClass('');
        requestAnimationFrame(() => {
          setReactiveClass('card-success-pulse');
          setTimeout(() => setReactiveClass(''), 1200);
        });
      },
      triggerError: () => {
        setReactiveClass('');
        requestAnimationFrame(() => {
          setReactiveClass('card-error-shake');
          setTimeout(() => setReactiveClass(''), 450);
        });
      }
    }));

    useEffect(() => {
      if (statusProp === 'success') {
        setReactiveClass('card-success-pulse');
        const timer = setTimeout(() => setReactiveClass(''), 1200);
        return () => clearTimeout(timer);
      } else if (statusProp === 'error') {
        setReactiveClass('card-error-shake');
        const timer = setTimeout(() => setReactiveClass(''), 450);
        return () => clearTimeout(timer);
      } else {
        setReactiveClass('');
      }
    }, [statusProp]);

    const variantStyles =
      variant === 'level-1'
        ? 'glass-level-1 bg-[#18181C] border-[#2A2A32]'
        : variant === 'level-3'
        ? 'lg-hero-glass'
        : 'glass-level-2 bg-[#111114] border-[#242429]';

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      spotlightMouseMove(e);
      onMouseMoveProp?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      spotlightMouseLeave(e);
      onMouseLeaveProp?.(e);
    };

    return (
      <div
        id={id}
        ref={(el) => {
          cardRef.current = el;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative rounded-[8px] border shadow-[0_10px_28px_rgba(0,0,0,0.42)] overflow-hidden transition-all duration-200 spotlight-border ${variantStyles} ${reactiveClass} ${className}`}
        {...rest}
      >
        {/* Sutil haz especular en el borde superior */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
