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
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F6] flex flex-col justify-between relative overflow-hidden isolate selection:bg-[#FF4F00] selection:text-white">
      {/* Subtle Analog Grain Overlay */}
      <div className="absolute inset-0 analog-grain pointer-events-none opacity-40 z-0" />

      {/* Top Bar / Brand */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10 border-b border-[#242429]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#FF4F00] flex items-center justify-center">
            <Disc3 className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-[#F4F4F6] block leading-tight">
              EL ARTISTA
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#52525B]">
              Music Career Simulator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#8E8E99] bg-[#111114] border border-[#242429] px-2.5 py-1 rounded-[4px] tabular-nums">
            v2.0 • 2026
          </span>
        </div>
      </header>

      {/* Main Hero & Menu */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col items-center text-center my-auto space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
          <span>Simulador Profundo de la Industria Musical & Estudio</span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F4F4F6] leading-[1.05]">
            Construí tu Legado{' '}
            <span className="text-[#FF4F00]">
              Musical
            </span>
          </h1>
          <p className="text-[#8E8E99] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Desde tus primeras grabaciones caseras en el underground hasta encabezar los charts globales y recibir premios de leyenda. Creá tu artista, moldeá tu sonido y desafiá a la industria.
          </p>
        </div>

        {/* Genre tags (informative, not interactive) */}
        <ul className="flex items-center justify-center gap-2 flex-wrap max-w-2xl" aria-label="Géneros disponibles">
          {[
            { label: 'Trap Latino', icon: Flame, color: 'text-[#FF4F00]' },
            { label: 'Reggaetón & Urbano', icon: TreePalm, color: 'text-[#F59E0B]' },
            { label: 'Pop Moderno', icon: Sparkles, color: 'text-[#F4F4F6]' },
            { label: 'R&B & Neo-Soul', icon: Mic, color: 'text-[#8E8E99]' },
            { label: 'Rock Alternativo', icon: Guitar, color: 'text-[#00E599]' },
            { label: 'Drill & Grime', icon: Zap, color: 'text-[#EF4444]' }
          ].map(({ label, icon: Icon, color }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-[4px] bg-[#111114] text-[#8E8E99] border border-[#242429]"
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        {/* Grouped Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          {/* NUEVA CARRERA (Dominant Primary CTA) */}
          <button
            id="btn-start-new-career"
            onClick={onNewCareer}
            className="w-full py-3.5 px-6 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white font-mono font-bold text-sm flex items-center justify-center gap-2.5 transition-all active:translate-y-[1px] cursor-pointer border border-[#FF4F00]"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Iniciar Nueva Carrera</span>
          </button>

          {/* CONTINUAR PARTIDA (Save Slot Card) */}
          {savedGame ? (
            <button
              id="btn-continue-career"
              onClick={onContinue}
              className="w-full p-4 rounded-[6px] bg-[#111114] hover:bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#00E599] flex items-center justify-center group-hover:border-[#00E599] transition-colors">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span className="font-bold text-[#F4F4F6] text-xs font-mono">
                    Continuar Partida Guardada
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-[#00E599] bg-[#00E599]/10 border border-[#00E599]/30 px-2 py-0.5 rounded-[2px] tabular-nums">
                  {TimeSystem.getMonthName(savedGame.month || 1)} {savedGame.year || 2026} • Año {savedGame.careerYear || 1}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#8E8E99] pl-9 font-mono tabular-nums">
                <span className="font-medium text-[#F4F4F6]">
                  {savedGame.player.name || 'Artista'} • {savedGame.player.country || 'Argentina'}
                </span>
                <span className="font-mono font-bold text-[#00E599] tabular-nums">
                  ${(savedGame.player.stats?.funds ?? 0).toLocaleString('es-AR')}
                </span>
              </div>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 px-4 rounded-[4px] bg-[#111114]/60 border border-[#242429] text-[#52525B] text-xs font-mono flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 opacity-40" />
              <span>Continuar • Sin partida guardada</span>
            </button>
          )}

          {/* Utility Ghost Actions (Horizontally aligned) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs py-2 rounded-[4px] border border-[#242429] bg-[#111114] hover:bg-[#18181C] hover:border-[#3F3F46] text-[#8E8E99] hover:text-[#F4F4F6] font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#8E8E99]" />
              <span>Cargar JSON</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="text-xs py-2 rounded-[4px] border border-[#242429] bg-[#111114] hover:bg-[#18181C] hover:border-[#3F3F46] text-[#8E8E99] hover:text-[#F4F4F6] font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
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

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-4 text-left">
          <div className="bg-[#111114] p-4 rounded-[6px] border border-[#242429] hover:border-[#3F3F46] transition-all group">
            <div className="w-8 h-8 rounded-[4px] bg-[#18181C] border border-[#242429] flex items-center justify-center mb-2.5">
              <Disc3 className="w-4 h-4 text-[#FF4F00]" />
            </div>
            <h4 className="text-xs font-bold text-[#F4F4F6]">Estudio & Hits</h4>
            <p className="text-xs text-[#8E8E99] mt-1 leading-relaxed">Producción de singles, álbumes conceptuales y feats.</p>
          </div>

          <div className="bg-[#111114] p-4 rounded-[6px] border border-[#242429] hover:border-[#3F3F46] transition-all group">
            <div className="w-8 h-8 rounded-[4px] bg-[#18181C] border border-[#242429] flex items-center justify-center mb-2.5">
              <TrendingUp className="w-4 h-4 text-[#00E599]" />
            </div>
            <h4 className="text-xs font-bold text-[#F4F4F6]">Charts Globales</h4>
            <p className="text-xs text-[#8E8E99] mt-1 leading-relaxed">Rankings regionales en tiempo real y rotación radial.</p>
          </div>

          <div className="bg-[#111114] p-4 rounded-[6px] border border-[#242429] hover:border-[#3F3F46] transition-all group">
            <div className="w-8 h-8 rounded-[4px] bg-[#18181C] border border-[#242429] flex items-center justify-center mb-2.5">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <h4 className="text-xs font-bold text-[#F4F4F6]">Giras Mundiales</h4>
            <p className="text-xs text-[#8E8E99] mt-1 leading-relaxed">Desde clubes underground hasta estadios masivos.</p>
          </div>

          <div className="bg-[#111114] p-4 rounded-[6px] border border-[#242429] hover:border-[#3F3F46] transition-all group">
            <div className="w-8 h-8 rounded-[4px] bg-[#18181C] border border-[#242429] flex items-center justify-center mb-2.5">
              <Award className="w-4 h-4 text-[#F4F4F6]" />
            </div>
            <h4 className="text-xs font-bold text-[#F4F4F6]">Galas & Eras</h4>
            <p className="text-xs text-[#8E8E99] mt-1 leading-relaxed">Grammys, transiciones de era y legado histórico.</p>
          </div>
        </div>
      </main>

      {/* Footer Features Info */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-4 border-t border-[#242429] text-xs text-[#8E8E99] font-mono flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#00E599]" />
            <span>Charts Oficiales Top 50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#FF4F00]" />
            <span>Mundo Autónomo de NPCs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Galas & Premios Anuales</span>
          </div>
        </div>

        <div>
          <span className="font-mono text-xs text-[#52525B]">Versión 2.0 • Studio Analog Master</span>
        </div>
      </footer>
    </div>
  );
};


