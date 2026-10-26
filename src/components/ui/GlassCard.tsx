import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';

export interface GlassCardHandle {
  triggerSuccess: () => void;
  triggerError: () => void;
}

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'idle' | 'success' | 'error';
  variant?: 'level-1' | 'level-2' | 'level-3';
}

/**
 * Contenedor Reactivo de Cristal (GlassCard)
 * - Tarjeta central con soporte reactivo para 'card-success-pulse' y 'card-error-shake'
 * - Pulso esmeralda/dorado en aciertos
 * - Vibración horizontal corta y destello rojo translúcido en errores
 * - Accesibilidad: respeta estrictamente prefers-reduced-motion
 */
export const GlassCard = forwardRef<GlassCardHandle, GlassCardProps>(
  (
    {
      status: statusProp = 'idle',
      variant = 'level-2',
      children,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    const [reactiveClass, setReactiveClass] = useState<string>('');
    const cardRef = useRef<HTMLDivElement | null>(null);

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
        ? 'glass-level-1'
        : variant === 'level-3'
        ? 'glass-level-3'
        : 'glass-level-2';

    return (
      <div
        id={id}
        ref={cardRef}
        className={`relative rounded-[14px] border border-white/10 bg-[#0E0F17]/80 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ${variantStyles} ${reactiveClass} ${className}`}
        {...rest}
      >
        {/* Sutil haz especular en el borde superior */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
