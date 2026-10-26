import React from 'react';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  error?: string;
  suffix?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Input Reactivo de Cristal Esmerilado (GlassInput)
 * - Cápsula de cristal esmerilado: bg-white/[0.05] backdrop-blur-md border border-white/10 text-white
 * - En focus o hover: iluminan su borde suavemente (border-white/30 y bg-white/[0.12])
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
          <label className="block text-xs font-medium text-[#8E8E99] font-sans">
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
            className={`w-full bg-white/[0.05] backdrop-blur-md border ${
              error
                ? 'border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'border-white/10 hover:border-white/30 hover:bg-white/[0.08] focus:border-white/30 focus:bg-white/[0.12] focus:shadow-[0_0_20px_rgba(0,229,153,0.25)]'
            } text-white placeholder-white/40 rounded-[10px] px-3.5 py-2.5 text-sm transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
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
