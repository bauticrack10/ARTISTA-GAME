import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { playSound } from '../../utils/audioSystem';

export interface KitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  bandVariant?: 'default' | 'emerald' | 'rec' | 'amber' | 'cyan';
  maxWidth?: string;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

/**
 * Modales de Juego Táctiles
 * - Bordes redondeados gruesos, banda saturada para el título (.kit-header-band), sombras profundas (.kit-modal)
 * - Botón de cerrar .kit-close anclado absoluto en esquina superior derecha
 * - Contenedor .kit-modal-header con reservas laterales simétricas de 72px a izquierda y derecha (px-[72px]) para centrado óptico sin colisionar con el botón de cierre
 */
export const KitModal: React.FC<KitModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  bandVariant = 'default',
  maxWidth = 'max-w-xl',
  children,
  className = '',
  hideCloseButton = false
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        playSound('click');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bandVariantClass =
    bandVariant === 'emerald'
      ? 'kit-header-band-emerald text-[#032115]'
      : bandVariant === 'rec'
      ? 'kit-header-band-rec text-white'
      : bandVariant === 'amber'
      ? 'kit-header-band-amber text-[#451A03]'
      : bandVariant === 'cyan'
      ? 'kit-header-band-cyan text-[#082F49]'
      : 'kit-header-band text-[#F4F0EA]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      onClick={() => {
        playSound('click');
        onClose();
      }}
    >
      <div
        className={`kit-modal w-full ${maxWidth} text-[#F4F0EA] my-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideCloseButton && (
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="kit-close"
            aria-label="Cerrar modal"
            title="Cerrar modal"
          >
            <X className="w-5 h-5 text-[#F4F0EA]" />
          </button>
        )}

        {/* Contenedor .kit-modal-header con reservas laterales simétricas de 72px a izquierda y derecha (px-[72px]) para centrado óptico sin colisionar con el botón de cierre */}
        <div className="kit-modal-header px-[72px]">
          {title && (
            <div className={`kit-header-band ${bandVariantClass}`}>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2">
                  {icon && <span className="shrink-0">{icon}</span>}
                  <h2 className="kit-text-header text-lg sm:text-xl tracking-wide uppercase">
                    {title}
                  </h2>
                </div>
                {subtitle && (
                  <span className="text-2xs font-sans font-bold tracking-wider uppercase opacity-90 mt-0.5">
                    {subtitle}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cuerpo del Modal */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};
