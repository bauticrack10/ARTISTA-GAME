import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, FolderOpen, Disc3, ShieldCheck, UserPlus, Clock, Award, Users, DollarSign, TrendingUp, Flame, TreePalm, Mic, Guitar, Zap } from 'lucide-react';
import { GameSaveState, Artist } from '../types';
import { TimeSystem } from '../systems/TimeSystem';

interface StartScreenProps {
  onNewCareer: () => void;
  onContinue: () => void;
  onLoadDemo: () => void;
  onImportSave: (json: string) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onNewCareer,
  onContinue,
  onLoadDemo,
  onImportSave
}) => {
  const [savedGame, setSavedGame] = useState<{
    player: Artist;
    year: number;
    month: number;
    careerYear: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('el_artista_save');
      if (raw) {
        const parsed: GameSaveState = JSON.parse(raw);
        if (parsed && parsed.world && parsed.playerId) {
          const p = parsed.world.artists?.[parsed.playerId];
          if (p) {
            const startY = p.careerStartYear || parsed.world.currentYear || 2026;
            const cYear = Math.max(1, (parsed.world.currentYear || 2026) - startY + 1);
            setSavedGame({
              player: p,
              year: parsed.world.currentYear || 2026,
              month: parsed.world.currentMonth || 1,
              careerYear: cYear
            });
          }
        }
      }
    } catch (e) {
      console.warn('Could not read saved game from storage', e);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportSave(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="min-h-screen bg-canvas text-fg flex flex-col justify-between relative overflow-hidden isolate selection:bg-primary/30 selection:text-white"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Ambient Stage Glow Orbs */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-primary/20 via-accent/10 to-transparent blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[-100px] w-[500px] h-[400px] bg-accent/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-100px] w-[500px] h-[400px] bg-info/10 blur-[140px] pointer-events-none z-0" />

      {/* Top Bar / Brand */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <Disc3 className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-base font-bold tracking-[-0.5px] text-fg block leading-tight">
              EL ARTISTA
            </span>
            <span className="text-2xs font-semibold text-fg-muted tracking-wider uppercase">
              Music Career Simulator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-fg-muted bg-surface border border-line px-3 py-1 rounded-md shadow-xs">
            v2.0 • 2026
          </span>
        </div>
      </header>

      {/* Main Hero & Menu */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col items-center text-center my-auto space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/90 border border-primary/40 text-[#CBD5E1] text-xs font-medium backdrop-blur-md shadow-[0_0_12px_rgba(139,92,246,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Simulador Profundo de la Industria Musical & Estudio</span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-1.5px] text-fg leading-tight">
            Construí tu Legado{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#EC4899] bg-clip-text text-transparent">
              Musical
            </span>
          </h1>
          <p className="text-fg-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Desde tus primeras grabaciones caseras en el underground hasta encabezar los charts globales y recibir premios de leyenda. Creá tu artista, moldeá tu sonido y desafiá a la industria.
          </p>
        </div>

        {/* Genre tags (informative, not interactive) */}
        <ul className="flex items-center justify-center gap-2 flex-wrap max-w-2xl" aria-label="Géneros disponibles">
          {[
            { label: 'Trap Latino', icon: Flame, color: 'text-primary-soft' },
            { label: 'Reggaetón & Urbano', icon: TreePalm, color: 'text-[#FBBF24]' },
            { label: 'Pop Moderno', icon: Sparkles, color: 'text-[#F472B6]' },
            { label: 'R&B & Neo-Soul', icon: Mic, color: 'text-[#818CF8]' },
            { label: 'Rock Alternativo', icon: Guitar, color: 'text-[#34D399]' },
            { label: 'Drill & Grime', icon: Zap, color: 'text-[#FB7185]' }
          ].map(({ label, icon: Icon, color }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-white/[0.04] text-[#CBD5E1] border border-white/[0.08]"
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        {/* Grouped Action Buttons */}
        <div className="w-full max-w-md space-y-3.5">
          {/* NUEVA CARRERA (Dominant Primary CTA) */}
          <button
            id="btn-start-new-career"
            onClick={onNewCareer}
            className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Iniciar Nueva Carrera</span>
          </button>

          {/* CONTINUAR PARTIDA (Save Slot Card) */}
          {savedGame ? (
            <button
              id="btn-continue-career"
              onClick={onContinue}
              className="w-full p-4 rounded-xl bg-surface hover:bg-[#1C1F28] border border-line hover:border-success/60 text-left transition-all cursor-pointer group shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-success/15 border border-success/40 text-success flex items-center justify-center group-hover:bg-success group-hover:text-black transition-colors">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span className="font-bold text-fg text-xs group-hover:text-white">
                    Continuar Partida Guardada
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-success bg-success/10 border border-success/30 px-2.5 py-0.5 rounded-full">
                  {TimeSystem.getMonthName(savedGame.month || 1)} {savedGame.year || 2026} • Año {savedGame.careerYear || 1}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-fg-muted pl-9">
                <span className="font-medium text-[#CBD5E1]">
                  {savedGame.player.name || 'Artista'} • {savedGame.player.country || 'Argentina'}
                </span>
                <span className="font-mono font-bold text-success">
                  ${(savedGame.player.stats?.funds ?? 0).toLocaleString('es-AR')}
                </span>
              </div>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3.5 px-4 rounded-lg bg-surface/50 border border-line/50 text-fg-subtle opacity-60 text-xs flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 opacity-40" />
              <span>Continuar • Sin partida guardada</span>
            </button>
          )}

          {/* Utility Ghost Actions (Horizontally aligned) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost-dark text-xs !py-2.5 rounded-lg border border-line bg-surface/70 hover:bg-surface text-fg-muted hover:text-fg hover:border-primary/50 transition-all flex items-center justify-center gap-2"
            >
              <FolderOpen className="w-3.5 h-3.5 text-primary" />
              <span>Cargar JSON</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="btn-ghost-dark text-xs !py-2.5 rounded-lg border border-line bg-surface/70 hover:bg-surface text-fg-muted hover:text-fg hover:border-warning/50 transition-all flex items-center justify-center gap-2"
              title="Cargar partida de prueba con Bhavi en Año 10"
            >
              <Sparkles className="w-3.5 h-3.5 text-warning" />
              <span>Modo Demo</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* 4 Feature Highlights Grid with Glassmorphism and Vibrant Neon Accents */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full pt-4 text-left">
          <div className="bg-surface p-4 rounded-xl border border-line hover:border-primary/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all group">
            <div className="w-8 h-8 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Disc3 className="w-4 h-4 text-primary" />
            </div>
            <h4 className="text-xs font-bold text-fg">Estudio & Hits</h4>
            <p className="text-xs text-fg-muted mt-1 leading-relaxed">Producción de singles, álbumes conceptuales y feats.</p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-line hover:border-info/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all group">
            <div className="w-8 h-8 rounded-md bg-info/15 border border-info/30 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4 text-info" />
            </div>
            <h4 className="text-xs font-bold text-fg">Charts Globales</h4>
            <p className="text-xs text-fg-muted mt-1 leading-relaxed">Rankings regionales en tiempo real y rotación radial.</p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-line hover:border-success/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all group">
            <div className="w-8 h-8 rounded-md bg-success/15 border border-success/30 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-success" />
            </div>
            <h4 className="text-xs font-bold text-fg">Giras Mundiales</h4>
            <p className="text-xs text-fg-muted mt-1 leading-relaxed">Desde clubes underground hasta estadios masivos.</p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-line hover:border-warning/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all group">
            <div className="w-8 h-8 rounded-md bg-warning/15 border border-warning/30 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4 text-warning" />
            </div>
            <h4 className="text-xs font-bold text-fg">Galas & Eras</h4>
            <p className="text-xs text-fg-muted mt-1 leading-relaxed">Grammys, transiciones de era y legado histórico.</p>
          </div>
        </div>
      </main>

      {/* Footer Features Info */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-4 border-t border-line text-xs text-fg-muted flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-info" />
            <span>Charts Oficiales Top 50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>Mundo Autónomo de NPCs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-warning" />
            <span>Galas & Premios Anuales</span>
          </div>
        </div>

        <div>
          <span className="font-mono text-xs">Versión 2.0 • Studio After Dark</span>
        </div>
      </footer>
    </div>
  );
};


