import React, { useState, useEffect } from 'react';
import { Play, Disc3, UserPlus } from 'lucide-react';
import { GameSaveState, Artist } from '../types';
import { TimeSystem } from '../systems/TimeSystem';

interface StartScreenProps {
  onNewCareer: () => void;
  onContinue: () => void;
  onLoadDemo?: () => void;
  onImportSave?: (json: string) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onNewCareer,
  onContinue
}) => {
  const [savedGame, setSavedGame] = useState<{
    player: Artist;
    year: number;
    month: number;
    careerYear: number;
  } | null>(null);

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

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F6] flex flex-col justify-between relative overflow-hidden isolate selection:bg-[#FF4F00] selection:text-white font-sans">
      {/* Subtle Analog Grain Overlay */}
      <div className="absolute inset-0 analog-grain pointer-events-none opacity-30 z-0" />

      {/* Top Bar / Brand */}
      <header className="max-w-5xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10 border-b border-[#242429]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[4px] bg-[#111114] border border-[#242429] text-[#FF4F00] flex items-center justify-center">
            <Disc3 className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-[#F4F4F6] block leading-tight">
              EL ARTISTA
            </span>
            <span className="text-xs text-[#8E8E99] font-medium tracking-normal">
              Simulador de Carrera Musical
            </span>
          </div>
        </div>
      </header>

      {/* Main Hero & Menu */}
      <main className="max-w-2xl w-full mx-auto px-6 py-12 flex flex-col items-center text-center my-auto space-y-8 z-10">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F4F4F6] leading-[1.05]">
            Construí tu Legado{' '}
            <span className="text-[#FF4F00]">
              Musical
            </span>
          </h1>
          <p className="text-[#8E8E99] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Desde tus primeras grabaciones en el underground hasta liderar los charts y marcar una era en la industria. Creá tu artista, moldeá tu sonido y desafiá a la escena.
          </p>
        </div>

        {/* Grouped Action Buttons */}
        <div className="w-full max-w-sm space-y-3 pt-2">
          {/* NUEVA CARRERA (Primary Action) */}
          <button
            id="btn-start-new-career"
            onClick={onNewCareer}
            className="w-full py-3.5 px-6 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white font-sans font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors active:translate-y-[1px] cursor-pointer shadow-sm border border-[#FF6F2E]/30"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Iniciar Nueva Carrera</span>
          </button>

          {/* CONTINUAR PARTIDA (Save Slot Card) */}
          {savedGame && (
            <button
              id="btn-continue-career"
              onClick={onContinue}
              className="w-full p-3.5 rounded-[4px] bg-[#111114] hover:bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-[#00E599] fill-current" />
                  <span className="font-semibold text-[#F4F4F6] text-xs font-sans">
                    Continuar Partida
                  </span>
                </div>
                <span className="text-2xs text-[#8E8E99] font-sans">
                  {TimeSystem.getMonthName(savedGame.month || 1)} <span className="font-mono tabular-nums">{savedGame.year || 2026}</span> • Año <span className="font-mono tabular-nums">{savedGame.careerYear || 1}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#8E8E99] pl-5.5">
                <span className="font-medium text-[#F4F4F6] font-sans truncate max-w-[180px]">
                  {savedGame.player.name || 'Artista'}
                </span>
                <span className="font-mono font-bold text-[#00E599] tabular-nums">
                  ${(savedGame.player.stats?.funds ?? 0).toLocaleString('es-AR')}
                </span>
              </div>
            </button>
          )}
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="max-w-5xl w-full mx-auto px-6 py-6 border-t border-[#242429] text-xs text-[#8E8E99] flex items-center justify-between z-10 font-sans">
        <div className="flex items-center gap-4 text-xs text-[#52525B]">
          <span>Charts Oficiales</span>
          <span>•</span>
          <span>Simulación Viva</span>
          <span>•</span>
          <span>Premios Anuales</span>
        </div>
        <div className="text-xs text-[#52525B]">
          El Artista
        </div>
      </footer>
    </div>
  );
};
