import React, { useState, useEffect } from 'react';
import { Artist, WorldState } from '../types';
import { TimeSystem } from '../systems/TimeSystem';
import { audioSystem, playSound } from '../utils/audioSystem';
import { AudioEqualizer } from './AudioEqualizer';
import { ArtistAvatar } from './ArtistAvatar';
import {
  Zap,
  DollarSign,
  Users,
  Play,
  Award,
  Disc3,
  BarChart3,
  Compass,
  Building2,
  Network,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Crown,
  Volume2,
  VolumeX
} from 'lucide-react';
import {
  formatMoney,
  formatFans,
  cleanParentheses
} from '../utils/formatters';

interface NavbarProps {
  player: Artist;
  world: WorldState;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onAdvanceCycle: (months: 6 | 12) => void;
  onReturnToTitle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  player,
  world,
  currentTab,
  onTabChange,
  onAdvanceCycle,
  onReturnToTitle
}) => {
  const [cycleMonths, setCycleMonths] = useState<6 | 12>(6);
  const [soundEnabled, setSoundEnabled] = useState(() => audioSystem.isSoundEnabled());

  useEffect(() => {
    return audioSystem.subscribeSoundState((enabled) => {
      setSoundEnabled(enabled);
    });
  }, []);

  const handleToggleSound = () => {
    audioSystem.toggleSound();
  };

  const handleTabClick = (tabId: string) => {
    playSound('click');
    onTabChange(tabId);
  };

  // Keep the active tab visible when the strip overflows (narrow screens, deep-linked tabs).
  useEffect(() => {
    document.getElementById(`nav-tab-${currentTab}`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
  }, [currentTab]);

  const currentMonth = world?.currentMonth || 1;
  const currentYear = world?.currentYear || 2026;
  const monthName = TimeSystem.getMonthName(currentMonth);
  const semesterShort = currentMonth <= 6 ? '1er Semestre' : '2do Semestre';

  const playerEnergy = player?.stats?.energy ?? 100;
  const playerFunds = player?.stats?.funds ?? 0;
  const playerFans = player?.stats?.fansCount ?? 0;
  const playerName = player?.name || 'Artista';

  const getEnergyBadge = () => {
    if (playerEnergy >= 85) {
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        icon: 'text-emerald-400',
        bar: 'bg-emerald-400'
      };
    } else if (playerEnergy >= 40) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        icon: 'text-amber-400',
        bar: 'bg-amber-400'
      };
    }
    return {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      icon: 'text-rose-400',
      bar: 'bg-rose-400'
    };
  };

  const energyStyle = getEnergyBadge();

  return (
    <header
      className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-line text-fg"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Fila 1: Logo + Tiempo actual + Botonera de Avance (CTA Principal) + Métricas Normalizadas */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-x-3 gap-y-2 sm:gap-x-4 border-b border-line">
        
        {/* Izquierda: Logo ("EL ARTISTA") */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onReturnToTitle();
            }}
            className="tap flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer text-left group"
            title="Volver al Menú Principal"
          >
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary via-[#A855F7] to-accent text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
            >
              <Disc3 className="w-4.5 h-4.5 text-white animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-[-0.3px] text-fg text-xs leading-none flex items-center gap-1.5">
                EL ARTISTA
                <span className="hidden sm:inline text-2xs font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-soft border border-primary/40">
                  PRO
                </span>
              </span>
              <span className="hidden sm:block text-2xs text-fg-muted tracking-wider uppercase leading-tight mt-0.5">
                Simulador Musical
              </span>
            </div>
          </button>
        </div>

        {/* Centro: Indicador de Tiempo actual + Botonera de avance (fila propia en móvil) */}
        <div className="order-last md:order-none w-full md:w-auto flex items-center gap-2 md:shrink-0">
          {/* Selector de Tiempo Condensado */}
          <div
            className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-line text-xs shadow-xs whitespace-nowrap"
            title={`Fecha actual en la industria: ${monthName} ${currentYear} • ${semesterShort}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ring-2 ring-emerald-400/30" />
            <span className="font-bold text-fg">
              {monthName} {currentYear}
            </span>
            <span className="text-fg-muted font-medium hidden sm:inline">
              • {semesterShort}
            </span>
          </div>

          {/* Botonera de Simulación / Avance Integrada como CTA Principal */}
          <div className="flex flex-1 md:flex-none items-center gap-1.5 min-w-0">
            {/* Toggle 6M / 1Y */}
            <div className="flex items-center bg-surface p-0.5 rounded-md text-xs font-semibold border border-line">
              <button
                onClick={() => {
                  playSound('click');
                  setCycleMonths(6);
                }}
                aria-pressed={cycleMonths === 6}
                className={`min-h-8 px-2.5 py-1 rounded-sm transition-all cursor-pointer text-xs ${
                  cycleMonths === 6
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'text-fg-muted hover:text-fg'
                }`}
                title="Simular 6 Meses (1 Semestre)"
              >
                6M
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setCycleMonths(12);
                }}
                aria-pressed={cycleMonths === 12}
                className={`min-h-8 px-2.5 py-1 rounded-sm transition-all cursor-pointer text-xs ${
                  cycleMonths === 12
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'text-fg-muted hover:text-fg'
                }`}
                title="Simular 1 Año Completo"
              >
                1Y
              </button>
            </div>

            {/* Botón de Acción Principal (Avanzar Ciclo) */}
            <button
              id="btn-advance-cycle"
              onClick={() => {
                playSound('click');
                onAdvanceCycle(cycleMonths);
              }}
              className="tap group relative flex flex-1 md:flex-none justify-center items-center gap-2 bg-gradient-to-r from-primary-strong via-primary to-accent hover:from-[#6D28D9] hover:via-primary-strong hover:to-[#DB2777] text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(124,58,237,0.35)] border border-white/20 whitespace-nowrap"
              title={`Avanzar ciclo de ${cycleMonths === 6 ? '6 meses (1 Semestre)' : '1 año (2 Semestres)'} y simular lanzamientos, charts y eventos`}
            >
              <Play className="w-3.5 h-3.5 fill-white text-white group-hover:scale-110 transition-transform shrink-0" />
              <span className="tracking-tight font-semibold">
                Avanzar<span className="hidden sm:inline"> Ciclo</span> ({cycleMonths === 6 ? '+6M' : '+1Y'})
              </span>
            </button>
          </div>
        </div>

        {/* Derecha: Píldoras de recursos indispensables (Fondos, Fans, Energía) */}
        <div className="flex flex-1 md:flex-none justify-end min-w-0">
        <div className="flex items-center gap-2 text-xs max-w-full overflow-x-auto scroll-fade-x [&>*]:shrink-0">
          {/* Dinero / Fondos */}
          <div
            className="flex items-center flex-row gap-1 bg-surface border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs shadow-xs text-emerald-400"
            title={`Fondos Monetarios Disponibles: ${formatMoney(playerFunds)}`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-400 font-mono whitespace-nowrap">
              {formatMoney(playerFunds)}
            </span>
            <span className="text-2xs text-emerald-500/80 font-sans hidden lg:inline">
              Fondos
            </span>
          </div>

          {/* Comunidad de Fans (formateado explícitamente como "4.15k Fans" / "150 Fans") */}
          <div
            className="flex items-center gap-1.5 bg-surface border border-primary/30 px-2.5 py-1 rounded-lg text-xs shadow-xs text-primary-soft"
            title={`Comunidad de Fans Activos: ${playerFans.toLocaleString('es-AR')} fans`}
          >
            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-bold text-primary-soft font-mono">
              {formatFans(playerFans)}
            </span>
          </div>

          {/* Energía Vital con micro-barra */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs shadow-xs ${energyStyle.bg}`}
            title={`Energía Vital del Artista: ${playerEnergy}% • ${
              playerEnergy < 85 ? 'Giras Bloqueadas: Requiere ≥85%' : 'Giras Habilitadas'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 shrink-0 ${energyStyle.icon}`} />
            <span className="font-bold font-mono text-fg">{playerEnergy}%</span>
            <span className="text-2xs text-fg-muted font-sans hidden sm:inline">Energía</span>
            <div className="w-5 sm:w-6 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0 hidden sm:block">
              <div
                className={`h-full rounded-full transition-all duration-300 ${energyStyle.bar}`}
                role="progressbar"
                aria-label="Energía"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(Number(Math.min(100, Math.max(0, playerEnergy))))}
                style={{ width: `${Math.min(100, Math.max(0, playerEnergy))}%` }}
              />
            </div>
          </div>

          {/* Badge Prodigio */}
          {player?.isProdigy && (
            <div
              className="hidden 2xl:flex items-center gap-1 bg-warning/15 text-[#FBBF24] border border-warning/40 px-2 py-1 rounded-lg text-xs font-bold shadow-xs"
              title="Rasgo: Promesa / Prodigio • x3 Ganancia permanente en progreso"
            >
              <Crown className="w-3 h-3 text-warning fill-current shrink-0" />
              <span>x3 PRODIGIO</span>
            </div>
          )}

          {/* Control de Audio / SFX Engine */}
          <div className="flex items-center gap-1.5 bg-surface border border-line hover:border-primary/40 p-1 rounded-lg transition-colors">
            <button
              id="btn-toggle-audio-sfx"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              aria-label="Efectos de sonido"
              className={`min-h-8 flex items-center gap-1.5 px-2 py-1 rounded-md transition-all cursor-pointer text-xs font-semibold ${
                soundEnabled
                  ? 'bg-primary/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                  : 'bg-canvas text-fg-subtle border border-transparent hover:text-fg-muted'
              }`}
              title={soundEnabled ? 'Silenciar Efectos de Sonido (Mute)' : 'Activar Efectos de Sonido (Unmute)'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-fg-subtle shrink-0" />
              )}
              <span className="hidden md:inline text-xs">
                {soundEnabled ? 'SFX' : 'MUTE'}
              </span>
            </button>

            {/* Audio Reactive Equalizer Bars */}
            <div className="px-1 py-0.5 hidden sm:flex items-center" title={soundEnabled ? 'Equalizador de audio' : 'Audio Silenciado'}>
              <AudioEqualizer isPlaying={soundEnabled} />
            </div>
          </div>

          {/* Perfil Rápido del Jugador */}
          <button
            onClick={() => handleTabClick('dashboard')}
            className="tap hidden sm:flex items-center gap-2 pl-1 pr-2 sm:pr-2.5 py-1 rounded-lg bg-surface hover:bg-surface-raised border border-line hover:border-primary/40 text-xs transition-colors cursor-pointer shrink-0 shadow-xs"
            title={`Perfil de ${playerName} • Ir al Inicio`}
          >
            <ArtistAvatar
              name={playerName}
              avatarColor={player?.avatarColor}
              avatarIcon={player?.avatarIcon}
              size="xs"
              rounded="rounded-sm"
            />
            <span className="font-semibold text-fg max-w-[80px] sm:max-w-[110px] truncate">
              {playerName}
            </span>
          </button>
        </div>
        </div>
      </div>

      {/* Fila 2: Menú de Navegación Horizontal */}
      <nav className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto scroll-fade-x py-2 text-xs font-normal scroll-smooth">
        {[
          { id: 'dashboard', label: 'Inicio', icon: Compass, color: 'text-amber-400' },
          { id: 'studio', label: 'Estudio & Música', icon: Disc3, color: 'text-purple-400' },
          { id: 'lifestyle', label: 'Tienda & Estilo de Vida', icon: ShoppingBag, color: 'text-pink-400' },
          { id: 'charts', label: 'Charts & Rankings', icon: BarChart3, color: 'text-blue-400' },
          { id: 'tours', label: 'Giras & Shows', icon: Sparkles, color: 'text-emerald-400' },
          { id: 'industry', label: 'Sellos & Managers', icon: Building2, color: 'text-indigo-400' },
          { id: 'relations', label: 'Artistas & Rivalidades', icon: Network, color: 'text-cyan-400' },
          { id: 'career', label: 'Eras & Trayectoria', icon: TrendingUp, color: 'text-orange-400' },
          { id: 'awards', label: 'Premios & Gala', icon: Award, color: 'text-yellow-400' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`tap shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-primary/25 to-accent/25 border border-primary/60 text-fg font-bold shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                  : 'text-fg-muted hover:text-fg hover:bg-surface/70 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary-soft' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
