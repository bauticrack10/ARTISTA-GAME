import React from 'react';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  error?: string;
  suffix?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Input de Estudio (GlassInput)
 * - Superficie mate oscura #111114 con borde #242429 y realce Signal Orange (#FF4F00) en focus
 */
export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      label,
      icon,
      error,
      suffix,
      containerClassName = '',
      className = '',
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`w-full space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="block text-xs font-medium text-[#A1A1AA] font-sans">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center justify-center text-[#8E8E99] pointer-events-none shrink-0">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={`w-full bg-[#111114] border ${
              error
                ? 'border-[#EF4444] shadow-[0_0_0_3px_rgba(239,68,68,0.18)]'
                : 'border-[#242429] hover:border-[#383842] focus:border-[#FF4F00] focus:bg-[#18181C] focus:shadow-[0_0_0_3px_rgba(255,79,0,0.16)]'
            } text-[#F4F0EA] placeholder-[#71717A] rounded-[8px] px-3.5 py-2.5 text-sm transition-all duration-150 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
              icon ? 'pl-10' : ''
            } ${suffix ? 'pr-12' : ''} ${className}`}
            {...rest}
          />
          {suffix && (
            <div className="absolute right-3.5 flex items-center justify-center text-xs text-[#8E8E99] pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-[#EF4444] font-medium font-sans mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
