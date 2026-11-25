import React, { useState, useEffect, useRef } from 'react';
import { Play, Disc3, UserPlus, Upload } from 'lucide-react';
import { GameSaveState, Artist } from '../types';
import { TimeSystem } from '../systems/TimeSystem';
import { ArtistaLogo } from './ArtistaLogo';
import { playSound } from '../utils/audioSystem';
import { showToast } from '../utils/toastBus';

interface StartScreenProps {
  onNewCareer: () => void;
  onContinue: () => void;
  onLoadDemo?: () => void;
  onImportSave?: (json: string) => void;
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        if (content && onImportSave) {
          onImportSave(content);
        }
      } catch {
        showToast('No se pudo leer el archivo JSON de guardado.', 'error');
      }
    };
    reader.onerror = () => {
      showToast('Error al abrir el archivo seleccionado.', 'error');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-transparent text-[#F4F0EA] flex flex-col justify-between relative overflow-hidden isolate selection:bg-[#FF4F00]/30 selection:text-white font-sans">
      {/* Top Bar / Brand */}
      <header className="w-full px-6 sm:px-10 lg:px-16 py-6 flex items-center justify-between z-10">
        <ArtistaLogo subtitle="Simulador de Carrera Musical" />
      </header>

      {/* Main Hero & Menu */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center text-center my-auto space-y-8 z-10">
        <div className="space-y-4">
          <h1 className="kit-text-header font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight">
            Construí tu Legado{' '}
            <span className="text-[#FF4F00]">
              Musical
            </span>
          </h1>
          <p className="text-[#A1A1AA] font-sans text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Arrancás grabando maquetas con lo justo y negociando cada punto de regalía. Vos decidís si retenés tus másters de forma independiente o firmás con una multinacional para financiar giras de estadio y pelear el #1 global.
          </p>
        </div>

        {/* Grouped Action Buttons */}
        <div className="w-full max-w-md space-y-3.5 pt-2">
          {/* NUEVA CARRERA (Primary CTA - Signal Orange #FF4F00) */}
          <button
            id="btn-start-new-career"
            type="button"
            onClick={() => {
              playSound('click');
              onNewCareer();
            }}
            className="w-full py-4 px-8 rounded-[6px] bg-[#FF4F00] hover:bg-[#E04500] active:translate-y-[1px] text-white font-display font-extrabold text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer border border-[#FF7833]/50"
          >
            <UserPlus className="w-5 h-5 stroke-[2.25]" />
            <span>Iniciar Nueva Carrera</span>
          </button>

          {/* CONTINUAR PARTIDA (Save Slot Card) */}
          {savedGame && (
            <button
              id="btn-continue-career"
              type="button"
              onClick={onContinue}
              className="w-full p-4 rounded-[6px] surface-1 bg-[#111114] border border-[#242429] hover:border-[#FF4F00]/60 text-left transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#FF4F00] fill-current" />
                  <span className="font-bold text-[#F4F0EA] text-sm font-sans tracking-wide">
                    Continuar Partida
                  </span>
                </div>
                <span className="text-xs text-[#8E8E99] font-sans tabular-nums">
                  {TimeSystem.getMonthName(savedGame.month || 1)}{' '}
                  <span className="font-semibold">{savedGame.year || 2026}</span> • Año{' '}
                  <span className="font-semibold">{savedGame.careerYear || 1}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#8E8E99] pl-6">
                <span className="font-semibold text-[#F4F4F6] font-sans truncate max-w-[180px]">
                  {savedGame.player.name || 'Artista'}
                </span>
                <span className="font-sans font-bold text-[#34D399] tabular-nums text-sm">
                  ${(savedGame.player.stats?.funds ?? 0).toLocaleString('es-AR')}
                </span>
              </div>
            </button>
          )}

          {/* ACCIONES SECUNDARIAS: DEMO + IMPORTAR JSON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {onLoadDemo && (
              <button
                id="btn-load-demo"
                type="button"
                onClick={() => {
                  playSound('click');
                  onLoadDemo();
                }}
                className="w-full py-3 px-4 rounded-[6px] surface-2 bg-[#18181C] hover:bg-[#1F1F24] border border-[#242429] hover:border-[#3F3F46] text-[#F4F0EA] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Disc3 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Carrera Demo</span>
              </button>
            )}

            {onImportSave && (
              <>
                <button
                  id="btn-import-save"
                  type="button"
                  onClick={() => {
                    playSound('click');
                    fileInputRef.current?.click();
                  }}
                  className={`w-full py-3 px-4 rounded-[6px] surface-2 bg-[#18181C] hover:bg-[#1F1F24] border border-[#242429] hover:border-[#3F3F46] text-[#F4F0EA] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !onLoadDemo ? 'sm:col-span-2' : ''
                  }`}
                >
                  <Upload className="w-4 h-4 text-[#34D399] shrink-0" />
                  <span>Importar JSON</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full px-6 sm:px-10 lg:px-16 py-6 text-xs text-[#8E8E99] flex flex-col sm:flex-row items-center justify-between gap-2 z-10 font-sans text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs text-[#52525B]">
          <span>40 mercados musicales activos</span>
          <span className="hidden sm:inline">•</span>
          <span>Regalías, contratos y catálogo propio</span>
        </div>
        <div className="text-xs text-[#52525B]">
          El Artista
        </div>
      </footer>
    </div>
  );
};
