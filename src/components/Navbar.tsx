import React, { useState, useEffect } from 'react';
import { Artist, WorldState, Song } from '../types';
import { TimeSystem } from '../systems/TimeSystem';
import { audioSystem, playSound } from '../utils/audioSystem';
import { SettingsModal } from './SettingsModal';
import {
  Zap,
  DollarSign,
  Play,
  Award,
  Disc3,
  Compass,
  Briefcase,
  Volume2,
  VolumeX,
  Radio,
  Smartphone,
  Settings,
  Headphones
} from 'lucide-react';
import {
  formatMoney,
  formatCompactNumber
} from '../utils/formatters';
import { gameJuice, HudTarget } from '../utils/gameJuice';
import { ArtistaLogo } from './ArtistaLogo';

interface NavbarProps {
  player: Artist;
  world: WorldState;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onAdvanceCycle: (months: 1 | 3 | 6 | 12) => void;
  onReturnToTitle: () => void;
  onOpenPhone?: () => void;
  onOpenFinancialLedger?: () => void;
  onExportSave?: () => void;
  onImportSave?: (jsonContent: string) => void;
  onResetCareer?: () => void;
}

type HubId = 'dashboard' | 'studio' | 'scene' | 'career' | 'legacy';

export const Navbar: React.FC<NavbarProps> = ({
  player,
  world,
  currentTab,
  onTabChange,
  onAdvanceCycle,
  onReturnToTitle,
  onOpenPhone,
  onOpenFinancialLedger,
  onExportSave,
  onImportSave,
  onResetCareer
}) => {
  const [cycleMonths, setCycleMonths] = useState<1 | 3 | 6 | 12>(1);
  const [soundEnabled, setSoundEnabled] = useState(() => audioSystem.isSoundEnabled());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [poppingHud, setPoppingHud] = useState<Partial<Record<HudTarget, boolean>>>({});

  useEffect(() => {
    return gameJuice.subscribeHudImpact((target) => {
      setPoppingHud((prev) => ({ ...prev, [target]: true }));
      setTimeout(() => {
        setPoppingHud((prev) => ({ ...prev, [target]: false }));
      }, 350);
    });
  }, []);

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

  const getActiveHub = (): HubId => {
    if (currentTab === 'dashboard') return 'dashboard';
    if (currentTab === 'studio') return 'studio';
    if (currentTab === 'charts' || currentTab === 'streaming' || currentTab === 'relations') return 'scene';
    if (currentTab === 'career' || currentTab === 'awards') return 'legacy';
    return 'career';
  };

  const activeHub = getActiveHub();

  const currentMonth = world?.currentMonth || 1;
  const currentYear = world?.currentYear || 2026;
  const monthName = TimeSystem.getMonthName(currentMonth);

  const playerEnergy = player?.stats?.energy ?? 100;
  const playerFunds = player?.stats?.funds ?? 0;
  const playerFans = player?.stats?.fansCount ?? 0;
  const playerListeners = player?.stats?.monthlyListeners ?? 0;
  const legacyScore = player?.legacyScore ?? 0;

  const playerSongs = React.useMemo(() => {
    const pId = player?.id || 'player';
    return (Object.values(world?.songs || {}) as Song[]).filter(
      (s) => s.artistId === pId || s.isPlayerSong
    );
  }, [world?.songs, player?.id]);

  const singlesThisYear = React.useMemo(() => {
    return playerSongs.filter((s) => s.releaseYear === currentYear && s.isSingle).length;
  }, [playerSongs, currentYear]);

  const isTourReady = React.useMemo(() => {
    return playerSongs.length >= 2 && playerListeners >= 1000 && playerEnergy >= 85;
  }, [playerSongs.length, playerListeners, playerEnergy]);

  const pendingCollabCount = React.useMemo(() => {
    if (!Array.isArray(world?.pendingCollabOffers)) return 0;
    return world.pendingCollabOffers.filter((o) => o && (!o.status || o.status === 'pending')).length;
  }, [world?.pendingCollabOffers]);

  const hasPendingGala = Boolean(
    (world as any)?.pendingAwardCeremony || world?.activeGalaCeremony
  );
  const hasActiveBeef = Object.keys(world?.activeBeefs || {}).length > 0;
  const hasStudioAction = playerEnergy >= 85 && singlesThisYear === 0;

  const getEnergyBadge = () => {
    if (playerEnergy >= 75) {
      return {
        border: 'border-[#34D399]/35',
        text: 'text-[#34D399]',
        icon: 'text-[#34D399]',
        bar: 'bg-[#34D399]'
      };
    }
    if (playerEnergy >= 35) {
      return {
        border: 'border-[#F59E0B]/40',
        text: 'text-[#F59E0B]',
        icon: 'text-[#F59E0B]',
        bar: 'bg-[#F59E0B]'
      };
    }
    return {
      border: 'border-[#EF4444]/45',
      text: 'text-[#EF4444]',
      icon: 'text-[#EF4444]',
      bar: 'bg-[#EF4444]'
    };
  };

  const energyStyle = getEnergyBadge();
  const cycleShortLabel =
    cycleMonths === 1 ? '+1M' : cycleMonths === 3 ? '+3M' : cycleMonths === 6 ? '+6M' : '+1A';

  return (
    <header className="sticky top-0 z-40 lg-bar bg-[#111114]/88 backdrop-blur-xl text-[#F4F0EA] select-none border-b border-white/10 shadow-lg font-sans">
      {/* FILA 1: HUD Principal */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
        {/* Izquierda: Logo + Fecha */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onReturnToTitle();
            }}
            className="tap flex items-center hover:opacity-95 transition-opacity cursor-pointer text-left group"
            title="Volver al Menú Principal"
          >
            <ArtistaLogo compact />
          </button>

          <div className="h-5 w-px bg-white/15 hidden sm:block" />

          <div
            className="lg-pill flex items-center gap-2 rounded-[4px] px-3 py-1.5 text-xs whitespace-nowrap font-sans tabular-nums border border-white/15 bg-white/5"
            title={`Fecha actual: ${monthName} ${currentYear}`}
          >
            <span className="w-2 h-2 rounded-full bg-[#34D399] shrink-0" />
            <span className="font-bold text-[#F4F0EA]">
              {monthName} {currentYear}
            </span>
          </div>
        </div>

        {/* Centro: Control de Turno (1M/3M/6M/1A + Avanzar Signal Orange) */}
        <div className="order-last lg:order-none w-full lg:w-auto flex items-center gap-2.5 shrink-0 justify-center">
          <div className="lg-pill flex items-center border border-white/15 bg-black/35 rounded-[4px] p-0.5 text-xs font-sans tabular-nums gap-0.5">
            {([
              { val: 1, label: '1M', title: 'Avanzar 1 Mes' },
              { val: 3, label: '3M', title: 'Avanzar 3 Meses' },
              { val: 6, label: '6M', title: 'Avanzar 6 Meses' },
              { val: 12, label: '1A', title: 'Avanzar 1 Año' },
            ] as const).map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => {
                  playSound('click');
                  setCycleMonths(opt.val);
                }}
                aria-pressed={cycleMonths === opt.val}
                className={`px-2.5 py-1 rounded-[3px] font-sans tabular-nums text-xs font-bold transition-all cursor-pointer ${
                  cycleMonths === opt.val
                    ? 'bg-[#FF4F00]/20 text-[#FF4F00] border border-[#FF4F00]/55'
                    : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                title={opt.title}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            id="btn-advance-cycle"
            type="button"
            onClick={(e) => {
              playSound('click');
              gameJuice.triggerFloatingNumber({
                text: cycleMonths === 1 ? '+1 Mes' : cycleMonths === 3 ? '+3 Meses' : cycleMonths === 6 ? '+6 Meses' : '+1 Año',
                origin: e.currentTarget,
                type: 'neutral'
              });
              onAdvanceCycle(cycleMonths);
            }}
            className="px-4 sm:px-5 py-2 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] active:translate-y-[1px] text-white text-xs sm:text-sm font-bold tracking-tight uppercase whitespace-nowrap shrink-0 flex items-center gap-2 border border-[#FF7833]/50 shadow-md transition-all cursor-pointer"
            title="Procesar el ciclo seleccionado y simular el mundo"
          >
            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>Avanzar {cycleShortLabel}</span>
          </button>
        </div>

        {/* Derecha: 3 Indicadores Semánticos + Utilidades */}
        <div className="flex items-center gap-2 text-xs shrink-0 ml-auto lg:ml-0 flex-wrap sm:flex-nowrap">
          {/* 1. Fondos (Clicable -> Libro Contable) */}
          <button
            id="hud-money"
            type="button"
            onClick={() => {
              playSound('click');
              onOpenFinancialLedger?.();
            }}
            className={`lg-pill flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 border border-[#34D399]/30 bg-[#34D399]/10 hover:bg-[#34D399]/18 hover:border-[#34D399]/55 transition-all duration-200 cursor-pointer ${
              poppingHud.money ? 'scale-110 ring-2 ring-[#34D399] z-20' : ''
            }`}
            title={`Fondos Disponibles: ${formatMoney(playerFunds)} (Clic para abrir Libro Contable)`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
            <span className={`font-bold text-[#34D399] font-sans tabular-nums whitespace-nowrap ${poppingHud.money ? 'animate-hud-pop' : ''}`}>
              {formatMoney(playerFunds)}
            </span>
          </button>

          {/* 2. Oyentes/mes (Sky #38BDF8, tooltip con Fans + Puntos Legado) */}
          <div
            id="hud-fans"
            className={`lg-pill flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 border border-[#38BDF8]/30 bg-[#38BDF8]/10 transition-all duration-200 ${
              poppingHud.fans ? 'scale-110 ring-2 ring-[#38BDF8] z-20' : ''
            }`}
            title={`Oyentes/mes: ${playerListeners.toLocaleString('es-AR')} • Fans: ${playerFans.toLocaleString('es-AR')} • Puntos Legado: ${legacyScore.toLocaleString('es-AR')}`}
          >
            <Headphones className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            <span className={`font-bold font-sans tabular-nums text-[#38BDF8] whitespace-nowrap ${poppingHud.fans ? 'animate-hud-pop' : ''}`}>
              {formatCompactNumber(playerListeners)}
            </span>
            <span className="text-[11px] text-[#8E8E99] hidden xl:inline">/mes</span>
          </div>

          {/* 3. Energía % (Semáforo Emerald / Amber / Red) */}
          <div
            id="hud-energy"
            className={`lg-pill flex items-center gap-2 px-3 py-1.5 text-xs rounded-[4px] border ${energyStyle.border} bg-black/35 transition-all duration-200 ${
              poppingHud.energy ? 'scale-110 ring-2 ring-[#F59E0B] z-20' : ''
            }`}
            title={`Energía Vital: ${playerEnergy}%`}
          >
            <Zap className={`w-3.5 h-3.5 shrink-0 ${energyStyle.icon}`} />
            <span className={`font-bold font-sans tabular-nums ${energyStyle.text}`}>{playerEnergy}%</span>
            <div className="w-10 h-2 bg-[#09090B] rounded-[2px] border border-white/15 overflow-hidden shrink-0 hidden sm:block">
              <div
                className={`h-full transition-all duration-300 ${energyStyle.bar}`}
                style={{ width: `${Math.min(100, Math.max(0, playerEnergy))}%` }}
              />
            </div>
          </div>

          {/* Smartphone */}
          <button
            id="btn-open-artist-phone"
            type="button"
            onClick={() => {
              playSound('click');
              onOpenPhone?.();
            }}
            className="lg-pill w-8 h-8 rounded-[4px] flex items-center justify-center relative border border-white/15 bg-black/35 hover:bg-white/10 hover:border-white/25 transition-all cursor-pointer text-[#F4F0EA] group shrink-0"
            title="Abrir Smartphone (DMs, TrendX y Banco)"
          >
            <Smartphone className="w-4 h-4 text-[#DCE2EE] group-hover:text-white transition-colors" />
            {(world?.unreadPhoneCount ?? 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-[3px] bg-[#FF4F00] text-white text-[10px] font-sans font-bold flex items-center justify-center shadow-sm tabular-nums">
                {world.unreadPhoneCount}
              </span>
            )}
          </button>

          {/* Audio + Ajustes */}
          <div className="lg-pill border border-white/15 bg-black/35 rounded-[4px] p-0.5 flex items-center gap-0.5">
            <button
              id="btn-toggle-audio-sfx"
              type="button"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              className={`w-7 h-7 rounded-[3px] flex items-center justify-center transition-colors cursor-pointer ${
                soundEnabled ? 'text-[#34D399]' : 'text-[#8E8E99] hover:text-white'
              }`}
              title={soundEnabled ? 'Silenciar Audio' : 'Activar Audio'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              id="btn-open-settings"
              type="button"
              onClick={() => {
                playSound('click');
                setIsSettingsOpen(true);
              }}
              className="w-7 h-7 rounded-[3px] flex items-center justify-center text-[#DCE2EE] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Ajustes y Guardado"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FILA 2: 5 Hubs Limpios */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-2 border-t border-white/10 flex items-center justify-center">
        <nav aria-label="Navegación principal" className="flex items-center justify-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full">
          {/* 1. Inicio */}
          <button
            id="nav-tab-dashboard"
            type="button"
            onClick={() => handleTabClick('dashboard')}
            className={`tap px-3.5 sm:px-4 py-1.5 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'dashboard'
                ? 'bg-[#FF4F00]/18 text-white border border-[#FF4F00]/70'
                : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Compass className={`w-4 h-4 ${activeHub === 'dashboard' ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
            <span>Inicio</span>
          </button>

          {/* 2. Estudio */}
          <button
            id="nav-tab-studio"
            type="button"
            onClick={() => handleTabClick('studio')}
            className={`tap px-3.5 sm:px-4 py-1.5 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'studio'
                ? 'bg-[#FF4F00]/18 text-white border border-[#FF4F00]/70'
                : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Disc3 className={`w-4 h-4 ${activeHub === 'studio' ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
            <span>Estudio</span>
            {hasStudioAction && (
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" title="Listo para grabar" />
            )}
          </button>

          {/* 3. Escena */}
          <button
            id="nav-hub-world"
            type="button"
            onClick={() => {
              const target =
                currentTab === 'charts' || currentTab === 'streaming' || currentTab === 'relations'
                  ? 'charts'
                  : 'charts';
              handleTabClick(target);
            }}
            className={`tap px-3.5 sm:px-4 py-1.5 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'scene'
                ? 'bg-[#FF4F00]/18 text-white border border-[#FF4F00]/70'
                : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeHub === 'scene' ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
            <span>Escena</span>
            {pendingCollabCount > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-[3px] bg-[#34D399] text-[#09090B] text-[10px] font-bold leading-none tabular-nums"
                title={`${pendingCollabCount} oferta(s) de colaboración pendiente(s)`}
              >
                {pendingCollabCount}
              </span>
            )}
            {hasActiveBeef && (
              <span className="w-2 h-2 rounded-full bg-[#FF4F00] shrink-0" title="Feudo activo" />
            )}
          </button>

          {/* 4. Carrera */}
          <button
            id="nav-hub-career"
            type="button"
            onClick={() => handleTabClick('tours')}
            className={`tap px-3.5 sm:px-4 py-1.5 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'career'
                ? 'bg-[#FF4F00]/18 text-white border border-[#FF4F00]/70'
                : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Briefcase className={`w-4 h-4 ${activeHub === 'career' ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
            <span>Carrera</span>
            {isTourReady && (
              <span className="w-2 h-2 rounded-full bg-[#34D399] shrink-0" title="Listo para girar" />
            )}
          </button>

          {/* 5. Legado */}
          <button
            id="nav-hub-legacy"
            type="button"
            onClick={() => handleTabClick('career')}
            className={`tap px-3.5 sm:px-4 py-1.5 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'legacy'
                ? 'bg-[#FF4F00]/18 text-white border border-[#FF4F00]/70'
                : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Award className={`w-4 h-4 ${activeHub === 'legacy' ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
            <span>Legado</span>
            {hasPendingGala && (
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" title="Gala de premios disponible" />
            )}
          </button>
        </nav>
      </div>

      {isSettingsOpen && (
        <SettingsModal
          player={player}
          world={world}
          onClose={() => setIsSettingsOpen(false)}
          onExportSave={() => onExportSave?.()}
          onImportSave={(json) => onImportSave?.(json)}
          onResetCareer={() => {
            setIsSettingsOpen(false);
            onResetCareer?.();
          }}
        />
      )}
    </header>
  );
};
