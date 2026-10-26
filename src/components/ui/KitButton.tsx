import React from 'react';
import { playSound } from '../../utils/audioSystem';

export type KitButtonVariant =
  | 'primary'
  | 'emerald'
  | 'danger'
  | 'red'
  | 'warning'
  | 'amber'
  | 'info'
  | 'cyan'
  | 'orange'
  | 'secondary'
  | 'slate';

export type KitButtonSize = 'sm' | 'md' | 'lg';

export interface KitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: KitButtonVariant;
  size?: KitButtonSize;
  fullWidth?: boolean;
  soundEffect?: string | false;
}

/**
 * Botón Táctil de Videojuego con Física de Relieve 3D
 * - Sombra sólida inferior de 5px (box-shadow: 0 5px 0 <color>)
 * - Desplazamiento translateY(5px) y reducción de sombra vertical a cero al presionarse (:active)
 * - Desplazamiento óptico de línea base de 5px al contenido del botón (.kit-btn-content: icono + texto juntos)
 * - Texto blanco con contorno oscuro complementario al color del botón (nunca negro puro)
 * - Etiquetas de texto claras (.kit-btn-label) junto a los iconos
 */
export const KitButton = React.forwardRef<HTMLButtonElement, KitButtonProps>(
  (
    {
      label,
      icon,
      iconPosition = 'left',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
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

    const variantClass = `kit-btn-${variant}`;
    const sizeClasses =
      size === 'sm'
        ? 'text-xs py-1.5 px-3 min-h-[36px]'
        : size === 'lg'
        ? 'text-base py-3.5 px-7 min-h-[52px]'
        : 'text-sm py-2.5 px-5 min-h-[44px]';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={handleClick}
        className={`kit-btn ${variantClass} ${sizeClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...rest}
      >
        <span className="kit-btn-content">
          {icon && iconPosition === 'left' && (
            <span className="shrink-0 flex items-center justify-center">{icon}</span>
          )}
          {label && <span className="kit-btn-label">{label}</span>}
          {children && (
            typeof children === 'string' ? (
              <span className="kit-btn-label">{children}</span>
            ) : (
              children
            )
          )}
          {icon && iconPosition === 'right' && (
            <span className="shrink-0 flex items-center justify-center">{icon}</span>
          )}
        </span>
      </button>
    );
  }
);

KitButton.displayName = 'KitButton';
