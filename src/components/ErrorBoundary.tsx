import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;
  public setState!: (state: any, callback?: () => void) => void;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[El Artista ErrorBoundary] Render crash captured:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleHardReset = () => {
    try {
      localStorage.removeItem('el_artista_save');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'Error desconocido durante la ejecución de la simulación.';
      const errorStack = this.state.error?.stack || '';
      const componentStack = this.state.errorInfo?.componentStack || '';

      return (
        <div className="min-h-screen bg-[#09090B] text-[#F4F4F6] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
          {/* Subtle Grain Texture */}
          <div className="absolute inset-0 analog-grain pointer-events-none opacity-40 -z-10" />

          <div className="bg-[#111114] border border-[#EF4444]/40 rounded-[6px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header Icon & Title */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-[#18181C] text-[#EF4444] rounded-[4px] border border-[#EF4444]/30 shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-2 py-0.5 rounded-[2px] inline-block">
                  Diagnóstico de Fallo en Render
                </span>
                <h2 className="text-xl font-extrabold text-[#F4F4F6] tracking-tight">
                  {this.props.fallbackTitle || 'Se detectó un error en la simulación'}
                </h2>
                <p className="text-xs text-[#8E8E99] leading-relaxed">
                  El motor del juego capturó una excepción para evitar que la pantalla se congele en negro.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="bg-[#09090B] border border-[#EF4444]/30 rounded-[4px] p-4 text-xs font-sans text-[#EF4444] space-y-2">
              <div className="flex items-center gap-1.5 text-[#EF4444] font-bold uppercase text-[10px] tracking-wider font-sans">
                <Terminal className="w-3.5 h-3.5" />
                <span>Mensaje de Excepción</span>
              </div>
              <p className="break-all whitespace-pre-wrap leading-relaxed">{errorMessage}</p>
            </div>

            {/* Collapsible Technical Details */}
            <div className="border border-[#242429] rounded-[4px] bg-[#09090B] overflow-hidden">
              <button
                type="button"
                onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-sans text-[#8E8E99] hover:text-[#F4F4F6] cursor-pointer transition-colors"
              >
                <span>Detalles técnicos y traza de componentes</span>
                {this.state.showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {this.state.showDetails && (
                <div className="p-4 border-t border-[#242429] space-y-3 text-xs font-sans max-h-60 overflow-y-auto">
                  {errorStack && (
                    <div className="space-y-1">
                      <span className="text-[#FF4F00] font-bold text-[10px] uppercase">Stack Trace:</span>
                      <pre className="text-[#8E8E99] whitespace-pre-wrap break-all bg-[#111114] p-2.5 rounded-[2px] border border-[#242429]">
                        {errorStack}
                      </pre>
                    </div>
                  )}
                  {componentStack && (
                    <div className="space-y-1">
                      <span className="text-[#00E599] font-bold text-[10px] uppercase">Component Stack:</span>
                      <pre className="text-[#8E8E99] whitespace-pre-wrap break-all bg-[#111114] p-2.5 rounded-[2px] border border-[#242429]">
                        {componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:translate-y-[1px] cursor-pointer border border-[#FF4F00]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar Render</span>
              </button>

              <button
                type="button"
                onClick={this.handleHardReset}
                className="w-full sm:w-auto py-2.5 px-4 rounded-[4px] bg-[#18181C] hover:bg-[#242429] text-[#8E8E99] hover:text-[#F4F4F6] border border-[#242429] hover:border-[#3F3F46] font-sans font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                title="Borrar guardado local y recargar juego desde cero"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reiniciar Menú</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
