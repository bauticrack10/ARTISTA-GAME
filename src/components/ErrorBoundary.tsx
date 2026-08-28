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
  constructor(props: ErrorBoundaryProps) {
    super(props);
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
        <div
          className="min-h-screen bg-[#0B0C10] text-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
          style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
        >
          {/* Ambient Backdrop */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-rose-500/10 blur-[140px]" />
            <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[350px] bg-[#8B5CF6]/10 blur-[140px]" />
          </div>

          <div className="bg-[#16181F] border border-rose-500/30 rounded-[16px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl shadow-rose-950/30">
            {/* Header Icon & Title */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/15 text-rose-400 rounded-[12px] border border-rose-500/30 shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full inline-block">
                  Diagnóstico de Fallo en Render
                </span>
                <h2 className="text-xl font-bold text-[#F8FAFC] tracking-[-0.4px]">
                  {this.props.fallbackTitle || 'Se detectó un error en la simulación'}
                </h2>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  El motor del juego capturó una excepción para evitar que la pantalla se congele en negro.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="bg-[#0B0C10] border border-rose-500/25 rounded-[10px] p-4 text-xs font-mono text-rose-300 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase text-[10px] tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>Mensaje de Excepción</span>
              </div>
              <p className="break-all whitespace-pre-wrap leading-relaxed">{errorMessage}</p>
            </div>

            {/* Collapsible Technical Details */}
            <div className="border border-[#2A2E3D] rounded-[10px] bg-[#0B0C10] overflow-hidden">
              <button
                type="button"
                onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer transition-colors"
              >
                <span>Detalles técnicos y traza de componentes</span>
                {this.state.showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {this.state.showDetails && (
                <div className="p-4 border-t border-[#2A2E3D] space-y-3 text-[11px] font-mono max-h-60 overflow-y-auto">
                  {errorStack && (
                    <div className="space-y-1">
                      <span className="text-[#8B5CF6] font-bold text-[10px] uppercase">Stack Trace:</span>
                      <pre className="text-[#94A3B8] whitespace-pre-wrap break-all bg-[#16181F] p-2.5 rounded-[6px] border border-[#2A2E3D]">
                        {errorStack}
                      </pre>
                    </div>
                  )}
                  {componentStack && (
                    <div className="space-y-1">
                      <span className="text-[#06B6D4] font-bold text-[10px] uppercase">Component Stack:</span>
                      <pre className="text-[#94A3B8] whitespace-pre-wrap break-all bg-[#16181F] p-2.5 rounded-[6px] border border-[#2A2E3D]">
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
                className="w-full sm:flex-1 py-2.5 px-4 rounded-[8px] bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer shadow-[0_0_15px_rgba(124,58,237,0.35)] border border-white/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar Render</span>
              </button>

              <button
                type="button"
                onClick={this.handleHardReset}
                className="w-full sm:w-auto py-2.5 px-4 rounded-[8px] bg-[#16181F] hover:bg-[#1C1F2B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#8B5CF6]/40 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
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
