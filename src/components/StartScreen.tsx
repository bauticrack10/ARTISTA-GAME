import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, FolderOpen, Flame, Disc3, ShieldCheck, UserPlus, Clock, Award, Users, DollarSign, TrendingUp, HelpCircle } from 'lucide-react';
import { GameSaveState, Artist } from '../types';
import { TimeSystem } from '../systems/TimeSystem';

interface StartScreenProps {
  onNewCareer: () => void;
  onContinue: () => void;
  onLoadDemo: () => void;
  onImportSave: (json: string) => void;
  onOpenSimLab: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onNewCareer,
  onContinue,
  onLoadDemo,
  onImportSave,
  onOpenSimLab
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
          const p = parsed.world.artists[parsed.playerId];
          if (p) {
            const cYear = (parsed.world.currentYear - (p.careerStartYear || parsed.world.currentYear)) + 1;
            setSavedGame({
              player: p,
              year: parsed.world.currentYear,
              month: parsed.world.currentMonth,
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between relative overflow-hidden selection:bg-rose-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-rose-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-amber-500/5 blur-3xl pointer-events-none -z-10" />

      {/* Top Bar / Brand */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
            <Disc3 className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white block">
              EL ARTISTA
            </span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
              Music Career Simulator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSimLab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-all cursor-pointer"
            title="Abrir Laboratorio de Pruebas & Simulación"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sim Lab & Tests</span>
          </button>
        </div>
      </header>

      {/* Main Hero & Menu */}
      <main className="max-w-4xl w-full mx-auto px-6 py-10 flex flex-col items-center text-center my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-6">
          <Flame className="w-4 h-4 text-rose-400" />
          <span>Simulador Profundo de la Industria Musical</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-4">
          Construí tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">Legado Musical</span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Desde tus primeras grabaciones caseras en el underground hasta encabezar los charts globales y recibir premios de leyenda. Creá tu artista, moldeá tu sonido y desafiá a la industria.
        </p>

        {/* Primary Action Buttons */}
        <div className="w-full max-w-md space-y-3.5">
          {/* NUEVA CARRERA (Primary) */}
          <button
            id="btn-start-new-career"
            onClick={onNewCareer}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-base tracking-wide uppercase shadow-xl shadow-rose-600/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nueva Carrera</span>
          </button>

          {/* CONTINUAR (If save exists) */}
          {savedGame ? (
            <button
              id="btn-continue-career"
              onClick={onContinue}
              className="w-full p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-left transition-all group cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400 fill-current group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white text-sm">Continuar Partida</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                  {TimeSystem.getMonthName(savedGame.month)} {savedGame.year} • Año {savedGame.careerYear}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold text-zinc-200">{savedGame.player.name} ({savedGame.player.country})</span>
                <span className="text-emerald-400 font-mono font-bold">${savedGame.player.stats.funds.toLocaleString()}</span>
              </div>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3.5 px-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-600 font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Play className="w-4 h-4 opacity-40" />
              <span>Continuar (Sin partida guardada)</span>
            </button>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-indigo-400" />
              <span>Cargar JSON</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Cargar partida de prueba con Bhavi en Año 10"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
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
      </main>

      {/* Footer Features Info */}
      <footer className="max-w-5xl w-full mx-auto px-6 py-6 border-t border-zinc-900 text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
            <span>Charts Regionales & Globales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>Mundo Autónomo de NPCs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-zinc-400" />
            <span>Premios Anuales & Eras</span>
          </div>
        </div>

        <div>
          <span>Versión 2.0 • Simulación en Tiempo Real</span>
        </div>
      </footer>
    </div>
  );
};
