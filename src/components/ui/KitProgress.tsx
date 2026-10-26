import React from 'react';

export type KitProgressVariant =
  | 'emerald'
  | 'rec'
  | 'amber'
  | 'cyan'
  | 'orange'
  | 'slate';

export interface KitProgressProps {
  value: number;
  max?: number;
  min?: number;
  variant?: KitProgressVariant;
  compact?: boolean;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  showValue?: boolean;
  valueFormatter?: (value: number, max: number, percentage: number) => React.ReactNode;
  className?: string;
  barClassName?: string;
  id?: string;
  'aria-label'?: string;
}

/**
 * Barras de Progreso y Temporizadores Cilíndricos de Videojuego
 * - Grosor fijo de 40px (y variante compacta de 30px) con flex-shrink: 0 en el carril (.kit-progress)
 * - Brillo especular superior: blanco al 20% de opacidad en la mitad superior del relleno (.kit-progress-fill::before)
 * - Bisel oscuro inferior para dar volumen cilíndrico (.kit-progress-fill::after y box-shadow)
 */
export const KitProgress: React.FC<KitProgressProps> = ({
  value,
  max = 100,
  min = 0,
  variant = 'emerald',
  compact = false,
  label,
  icon,
  showValue = true,
  valueFormatter,
  className = '',
  barClassName = '',
  id,
  'aria-label': ariaLabel
}) => {
  const range = Math.max(1, max - min);
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = Math.min(100, Math.max(0, ((clampedValue - min) / range) * 100));

  const variantClass = `kit-progress-fill-${variant}`;

  return (
    <div
      id={id}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={ariaLabel || (typeof label === 'string' ? label : 'Progreso')}
      className={`kit-progress ${compact ? 'kit-progress-compact' : ''} ${className}`}
    >
      <div
        className={`kit-progress-fill ${variantClass} ${barClassName}`}
        style={{ width: `${percentage}%` }}
      />
      {(label || showValue || icon) && (
        <div className="kit-progress-label">
          <span className="flex items-center gap-1.5 font-bold tracking-wide truncate">
            {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
            {label && <span className="truncate">{label}</span>}
          </span>
          {showValue && (
            <span className="font-sans font-bold tabular-nums shrink-0 ml-2">
              {valueFormatter
                ? valueFormatter(clampedValue, max, percentage)
                : `${Math.round(percentage)}%`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
