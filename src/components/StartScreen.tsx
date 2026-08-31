import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, FolderOpen, Disc3, ShieldCheck, UserPlus, Clock, Award, Users, DollarSign, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0B0C10] text-[#F8FAFC] flex flex-col justify-between relative overflow-hidden selection:bg-[#8B5CF6]/30 selection:text-white">
      {/* Ambient Stage Glow Orbs */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#8B5CF6]/20 via-[#EC4899]/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-100px] w-[500px] h-[400px] bg-[#EC4899]/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-100px] w-[500px] h-[400px] bg-[#06B6D4]/10 blur-[140px] pointer-events-none -z-10" />

      {/* Top Bar / Brand */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <Disc3 className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-base font-bold tracking-[-0.5px] text-[#F8FAFC] block leading-tight">
              EL ARTISTA
            </span>
            <span className="text-[10px] font-semibold text-[#94A3B8] tracking-wider uppercase">
              Music Career Simulator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#94A3B8] bg-[#16181F] border border-[#2A2E3D] px-3 py-1 rounded-[6px] shadow-xs">
            v2.0 • 2026
          </span>
        </div>
      </header>

      {/* Main Hero & Menu */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col items-center text-center my-auto space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16181F]/90 border border-[#8B5CF6]/40 text-[#CBD5E1] text-xs font-medium backdrop-blur-md shadow-[0_0_12px_rgba(139,92,246,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Simulador Profundo de la Industria Musical & Estudio</span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-1.5px] text-[#F8FAFC] leading-tight">
            Construí tu Legado{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#EC4899] bg-clip-text text-transparent">
              Musical
            </span>
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Desde tus primeras grabaciones caseras en el underground hasta encabezar los charts globales y recibir premios de leyenda. Creá tu artista, moldeá tu sonido y desafiá a la industria.
          </p>
        </div>

        {/* Monochromatic Translucent Genre Tags (Light up on hover) */}
        <div className="flex items-center justify-center gap-2 flex-wrap max-w-2xl">
          <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/[0.04] text-[#CBD5E1] border border-white/[0.08] hover:bg-[#8B5CF6]/20 hover:text-[#C084FC] hover:border-[#8B5CF6]/50 transition-all cursor-default">
            🔥 Trap Latino
          </span>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/[0.04] text-[#CBD5E1] border border-white/[0.08] hover:bg-[#F59E0B]/20 hover:text-[#FBBF24] hover:border-[#F59E0B]/50 transition-all cursor-default">
            🌴 Reggaetón & Urbano
          </span>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/[0.04] text-[#CBD5E1] border border-white/[0.08] hover:bg-[#EC4899]/20 hover:text-[#F472B6] hover:border-[#EC4899]/50 transition-all cursor-default">
            ✨ Pop Moderno
          </span>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/[0.04] text-[#CBD5E1] border border-white/[0.08] hover:bg-[#6366F1]/20 hover:text-[#818CF8] hover:border-[#6366F1]/50 transition-all cursor-default">
            🎙️ R&B & Neo-Soul
          </span>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/[0.04] text-[#CBD5E1] border border-white/[0.08] hover:bg-[#10B981]/20 hover:text-[#34D399] hover:border-[#10B981]/50 transition-all cursor-default">
            🎸 Rock Alternativo
          </span>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/[0.04] text-[#CBD5E1] border border-white/[0.08] hover:bg-[#E11D48]/20 hover:text-[#FB7185] hover:border-[#E11D48]/50 transition-all cursor-default">
            ⚡ Drill & Grime
          </span>
        </div>

        {/* Grouped Action Buttons */}
        <div className="w-full max-w-md space-y-3.5">
          {/* NUEVA CARRERA (Dominant Primary CTA) */}
          <button
            id="btn-start-new-career"
            onClick={onNewCareer}
            className="w-full py-4 px-6 rounded-[10px] bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Iniciar Nueva Carrera</span>
          </button>

          {/* CONTINUAR PARTIDA (Save Slot Card) */}
          {savedGame ? (
            <button
              id="btn-continue-career"
              onClick={onContinue}
              className="w-full p-4 rounded-[12px] bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] hover:border-[#10B981]/60 text-left transition-all cursor-pointer group shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center group-hover:bg-[#10B981] group-hover:text-black transition-colors">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span className="font-bold text-[#F8FAFC] text-xs group-hover:text-white">
                    Continuar Partida Guardada
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2.5 py-0.5 rounded-full">
                  {TimeSystem.getMonthName(savedGame.month)} {savedGame.year} • Año {savedGame.careerYear}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#94A3B8] pl-9">
                <span className="font-medium text-[#CBD5E1]">
                  {savedGame.player.name || 'Artista'} • {savedGame.player.country || 'Argentina'}
                </span>
                <span className="font-mono font-bold text-[#10B981]">
                  ${(savedGame.player.stats?.funds ?? 0).toLocaleString('es-AR')}
                </span>
              </div>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3.5 px-4 rounded-[10px] bg-[#16181F]/50 border border-[#2A2E3D]/50 text-[#64748B] opacity-60 text-xs flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 opacity-40" />
              <span>Continuar • Sin partida guardada</span>
            </button>
          )}

          {/* Utility Ghost Actions (Horizontally aligned) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost-dark text-xs !py-2.5 rounded-[8px] border border-[#2A2E3D] bg-[#16181F]/70 hover:bg-[#16181F] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/50 transition-all flex items-center justify-center gap-2"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Cargar JSON</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="btn-ghost-dark text-xs !py-2.5 rounded-[8px] border border-[#2A2E3D] bg-[#16181F]/70 hover:bg-[#16181F] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#F59E0B]/50 transition-all flex items-center justify-center gap-2"
              title="Cargar partida de prueba con Bhavi en Año 10"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
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
          <div className="bg-[#16181F] p-4 rounded-[12px] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all group">
            <div className="w-8 h-8 rounded-[6px] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Disc3 className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <h4 className="text-xs font-bold text-[#F8FAFC]">Estudio & Hits</h4>
            <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">Producción de singles, álbumes conceptuales y feats.</p>
          </div>

          <div className="bg-[#16181F] p-4 rounded-[12px] border border-[#2A2E3D] hover:border-[#06B6D4]/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all group">
            <div className="w-8 h-8 rounded-[6px] bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4 text-[#06B6D4]" />
            </div>
            <h4 className="text-xs font-bold text-[#F8FAFC]">Charts Globales</h4>
            <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">Rankings regionales en tiempo real y rotación radial.</p>
          </div>

          <div className="bg-[#16181F] p-4 rounded-[12px] border border-[#2A2E3D] hover:border-[#10B981]/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all group">
            <div className="w-8 h-8 rounded-[6px] bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-[#10B981]" />
            </div>
            <h4 className="text-xs font-bold text-[#F8FAFC]">Giras Mundiales</h4>
            <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">Desde clubes underground hasta estadios masivos.</p>
          </div>

          <div className="bg-[#16181F] p-4 rounded-[12px] border border-[#2A2E3D] hover:border-[#F59E0B]/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all group">
            <div className="w-8 h-8 rounded-[6px] bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <h4 className="text-xs font-bold text-[#F8FAFC]">Galas & Eras</h4>
            <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">Grammys, transiciones de era y legado histórico.</p>
          </div>
        </div>
      </main>

      {/* Footer Features Info */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-4 border-t border-[#2A2E3D] text-xs text-[#94A3B8] flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Charts Oficiales Top 50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Mundo Autónomo de NPCs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Galas & Premios Anuales</span>
          </div>
        </div>

        <div>
          <span className="font-mono text-[11px]">Versión 2.0 • Studio After Dark</span>
        </div>
      </footer>
    </div>
  );
};


