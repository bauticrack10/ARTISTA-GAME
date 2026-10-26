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
    <div className="min-h-screen bg-[#0B0B0C] text-[#F4F0EA] flex flex-col justify-between relative overflow-hidden isolate selection:bg-[#FF2A4B] selection:text-white font-sans">
      {/* Subtle Analog Grain Overlay */}
      <div className="absolute inset-0 analog-grain pointer-events-none opacity-30 z-0" />

      {/* Top Bar / Brand */}
      <header className="w-full px-6 sm:px-10 lg:px-16 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-[#14141F] border border-white/20 text-[#00E599] flex items-center justify-center shadow-lg">
            <Disc3 className="w-6 h-6 animate-spin-slow text-[#00E599]" />
          </div>
          <div>
            <span className="kit-text-header text-lg sm:text-xl block leading-tight">
              EL ARTISTA
            </span>
            <span className="text-xs text-[#8E8E99] font-sans font-semibold tracking-wider uppercase">
              Simulador de Carrera Musical
            </span>
          </div>
        </div>
      </header>

      {/* Main Hero & Menu */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center text-center my-auto space-y-8 z-10">
        <div className="space-y-4">
          <h1 className="kit-text-header text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight">
            Construí tu Legado{' '}
            <span className="text-[#00E599] text-shadow-[0_4px_24px_rgba(0,229,153,0.6)]">
              Musical
            </span>
          </h1>
          <p className="text-[#A1A1AA] font-sans text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Arrancás grabando maquetas con lo justo y negociando cada punto de regalía. Vos decidís si retenés tus másters de forma independiente o firmás con una multinacional para financiar giras de estadio y pelear el #1 global.
          </p>
        </div>

        {/* Grouped Action Buttons */}
        <div className="w-full max-w-md space-y-4 pt-2">
          {/* NUEVA CARRERA (Primary Action - Large Vibrant Emerald Green Game CTA) */}
          <button
            id="btn-start-new-career"
            onClick={onNewCareer}
            className="game-btn-primary w-full py-4 px-8 text-base tracking-wider"
          >
            <UserPlus className="w-5 h-5 text-[#032115] stroke-[2.5]" />
            <span>Iniciar Nueva Carrera</span>
          </button>

          {/* CONTINUAR PARTIDA (Save Slot Card) */}
          {savedGame && (
            <button
              id="btn-continue-career"
              onClick={onContinue}
              className="w-full p-4 rounded-[10px] bg-[#141522]/90 hover:bg-[#1C1E30] border border-white/15 hover:border-[#00E599]/50 text-left transition-all cursor-pointer group shadow-lg shadow-black/40"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#00E599] fill-current" />
                  <span className="font-bold text-[#F4F0EA] text-sm font-sans tracking-wide">
                    Continuar Partida
                  </span>
                </div>
                <span className="text-xs text-[#8E8E99] font-sans">
                  {TimeSystem.getMonthName(savedGame.month || 1)} <span className="font-sans tabular-nums font-semibold">{savedGame.year || 2026}</span> • Año <span className="font-sans tabular-nums font-semibold">{savedGame.careerYear || 1}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#8E8E99] pl-6">
                <span className="font-semibold text-[#F4F0EA] font-sans truncate max-w-[180px]">
                  {savedGame.player.name || 'Artista'}
                </span>
                <span className="font-sans font-bold text-[#00E599] tabular-nums text-sm">
                  ${(savedGame.player.stats?.funds ?? 0).toLocaleString('es-AR')}
                </span>
              </div>
            </button>
          )}
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full px-6 sm:px-10 lg:px-16 py-6 text-xs text-[#8E8E99] flex items-center justify-between z-10 font-sans">
        <div className="flex items-center gap-4 text-xs text-[#52525B]">
          <span>40 mercados musicales activos</span>
          <span>•</span>
          <span>Regalías, contratos y catálogo propio</span>
        </div>
        <div className="text-xs text-[#52525B]">
          El Artista
        </div>
      </footer>
    </div>
  );
};
