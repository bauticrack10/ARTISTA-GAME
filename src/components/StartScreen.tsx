import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, FolderOpen, Disc3, ShieldCheck, UserPlus, Clock, Award, Users, DollarSign, TrendingUp } from 'lucide-react';
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
          <button
            onClick={onOpenSimLab}
            className="btn-ghost-outline text-xs !py-1.5 !px-3"
            title="Abrir Laboratorio de Pruebas & Simulación"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sim Lab & Tests</span>
          </button>
        </div>
      </header>

      {/* Main Hero & Menu */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12 flex flex-col items-center text-center my-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(28,28,28,0.04)] border border-[#eceae4] text-[#5f5f5d] text-xs font-normal mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#1c1c1c]" />
          <span>Simulador Profundo de la Industria Musical</span>
        </div>

        <h1 className="display-hero mb-4 text-[#1c1c1c]">
          Construí tu Legado Musical
        </h1>

        <p className="text-[#5f5f5d] text-base max-w-xl mx-auto mb-10 leading-[1.5]">
          Desde tus primeras grabaciones caseras en el underground hasta encabezar los charts globales y recibir premios de leyenda. Creá tu artista, moldeá tu sonido y desafiá a la industria.
        </p>

        {/* Primary Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          {/* NUEVA CARRERA (Primary) */}
          <button
            id="btn-start-new-career"
            onClick={onNewCareer}
            className="w-full btn-primary-dark !py-3.5 !text-sm !font-semibold"
          >
            <UserPlus className="w-4 h-4" />
            <span>Iniciar Nueva Carrera</span>
          </button>

          {/* CONTINUAR (If save exists) */}
          {savedGame ? (
            <button
              id="btn-continue-career"
              onClick={onContinue}
              className="w-full p-3.5 rounded-[12px] bg-[#fcfbf8] hover:bg-[#f7f4ed] border border-[#eceae4] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-[#1c1c1c] fill-current" />
                  <span className="font-semibold text-[#1c1c1c] text-xs">Continuar Partida</span>
                </div>
                <span className="text-[11px] font-mono text-[#5f5f5d] bg-[#f7f4ed] border border-[#eceae4] px-2 py-0.5 rounded-full">
                  {TimeSystem.getMonthName(savedGame.month)} {savedGame.year} • Año {savedGame.careerYear}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#5f5f5d]">
                <span className="font-medium text-[#1c1c1c]">{savedGame.player.name} ({savedGame.player.country})</span>
                <span className="font-mono font-semibold text-[#1c1c1c]">${savedGame.player.stats.funds.toLocaleString()}</span>
              </div>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 px-4 rounded-[6px] bg-[#f7f4ed] border border-[#eceae4] text-[#5f5f5d] opacity-60 text-xs flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 opacity-40" />
              <span>Continuar (Sin partida guardada)</span>
            </button>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost-outline text-xs !py-2.5"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Cargar JSON</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="btn-cream-surface text-xs !py-2.5"
              title="Cargar partida de prueba con Bhavi en Año 10"
            >
              <Sparkles className="w-3.5 h-3.5" />
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
      <footer className="max-w-5xl w-full mx-auto px-6 py-6 border-t border-[#eceae4] text-xs text-[#5f5f5d] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#5f5f5d]" />
            <span>Charts Regionales & Globales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#5f5f5d]" />
            <span>Mundo Autónomo de NPCs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#5f5f5d]" />
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

