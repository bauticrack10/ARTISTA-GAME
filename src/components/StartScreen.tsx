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
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1c1c] flex flex-col justify-between relative overflow-hidden">
      {/* Soft atmospheric gradient wash behind hero (barely visible) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-orange-200/20 via-rose-200/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Bar / Brand */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-[#1c1c1c] text-[#fcfbf8] flex items-center justify-center shadow-sm">
            <Disc3 className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-base font-semibold tracking-[-0.5px] text-[#1c1c1c] block leading-tight">
              EL ARTISTA
            </span>
            <span className="text-[11px] text-[#5f5f5d] tracking-normal uppercase">
              Music Career Simulator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#5f5f5d] bg-[#fcfbf8] border border-[#eceae4] px-2.5 py-1 rounded-[6px]">
            v2.0 • 2026
          </span>
        </div>
      </header>

      {/* Main Hero & Menu */}
      <main className="max-w-5xl w-full mx-auto px-6 py-12 flex flex-col items-center text-center my-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fcfbf8] border border-amber-300 text-amber-950 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-current" />
          <span>Simulador Integral de Carrera Musical & Simulación de Industria</span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-1.5px] text-[#1c1c1c] leading-tight">
            Construí tu Legado Musical
          </h1>
          <p className="text-[#5f5f5d] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Desde tus primeras grabaciones caseras en el underground hasta encabezar los charts globales y recibir premios de leyenda. Creá tu artista, moldeá tu sonido y conquistá la industria.
          </p>
        </div>

        {/* Vibrant Genre Pills Preview */}
        <div className="flex items-center justify-center gap-2 flex-wrap max-w-2xl">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
            🔥 Trap Latino
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs">
            🌴 Reggaetón & Urbano
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-pink-100 text-pink-900 border border-pink-300 shadow-2xs">
            ✨ Pop Moderno
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-2xs">
            🎙️ R&B & Neo-Soul
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
            🎸 Rock Alternativo
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs">
            ⚡ Drill & Grime
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          {/* NUEVA CARRERA (Primary) */}
          <button
            id="btn-start-new-career"
            onClick={onNewCareer}
            className="w-full btn-primary-dark !py-3.5 !text-sm !font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-transform"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>Iniciar Nueva Carrera</span>
          </button>

          {/* CONTINUAR (If save exists) */}
          {savedGame ? (
            <button
              id="btn-continue-career"
              onClick={onContinue}
              className="w-full p-4 rounded-[12px] bg-[#fcfbf8] hover:bg-[#f7f4ed] border-2 border-emerald-300/90 text-left transition-all cursor-pointer group shadow-xs hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                  <span className="font-bold text-[#1c1c1c] text-xs">Continuar Partida Guardada</span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {TimeSystem.getMonthName(savedGame.month)} {savedGame.year} • Año {savedGame.careerYear}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#5f5f5d] pl-8">
                <span className="font-medium text-[#1c1c1c]">{savedGame.player.name} ({savedGame.player.country})</span>
                <span className="font-mono font-bold text-emerald-800">${savedGame.player.stats.funds.toLocaleString()}</span>
              </div>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 px-4 rounded-[8px] bg-[#f7f4ed] border border-[#eceae4] text-[#5f5f5d] opacity-60 text-xs flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 opacity-40" />
              <span>Continuar (Sin partida guardada)</span>
            </button>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost-outline text-xs !py-2.5 rounded-[8px] border border-[#eceae4] hover:bg-[#eceae4]"
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cargar JSON</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="btn-cream-surface text-xs !py-2.5 rounded-[8px] border border-[#eceae4] hover:bg-[#eceae4]"
              title="Cargar partida de prueba con Bhavi en Año 10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
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
          <div className="bg-[#fcfbf8] p-3 rounded-[12px] border border-purple-200/80 shadow-2xs">
            <Disc3 className="w-4 h-4 text-purple-600 mb-1.5" />
            <h4 className="text-xs font-bold text-purple-950">Estudio & Hits</h4>
            <p className="text-[11px] text-[#5f5f5d] mt-0.5">Producción de singles, álbumes conceptuales y feats.</p>
          </div>
          <div className="bg-[#fcfbf8] p-3 rounded-[12px] border border-blue-200/80 shadow-2xs">
            <TrendingUp className="w-4 h-4 text-blue-600 mb-1.5" />
            <h4 className="text-xs font-bold text-blue-950">Charts Globales</h4>
            <p className="text-[11px] text-[#5f5f5d] mt-0.5">Rankings regionales en tiempo real y rotación radial.</p>
          </div>
          <div className="bg-[#fcfbf8] p-3 rounded-[12px] border border-emerald-200/80 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600 mb-1.5" />
            <h4 className="text-xs font-bold text-emerald-950">Giras Mundiales</h4>
            <p className="text-[11px] text-[#5f5f5d] mt-0.5">Desde clubes underground hasta estadios masivos.</p>
          </div>
          <div className="bg-[#fcfbf8] p-3 rounded-[12px] border border-amber-200/80 shadow-2xs">
            <Award className="w-4 h-4 text-amber-600 mb-1.5" />
            <h4 className="text-xs font-bold text-amber-950">Galas & Eras</h4>
            <p className="text-[11px] text-[#5f5f5d] mt-0.5">Grammys, transiciones de era y legado histórico.</p>
          </div>
        </div>
      </main>

      {/* Footer Features Info */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-4 border-t border-[#eceae4] text-xs text-[#5f5f5d] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Charts Oficiales Top 50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mundo Autónomo de NPCs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Galas & Premios Anuales</span>
          </div>
        </div>

        <div>
          <span className="font-mono text-[11px]">Versión 2.0 • Simulación en Tiempo Real</span>
        </div>
      </footer>
    </div>
  );
};

