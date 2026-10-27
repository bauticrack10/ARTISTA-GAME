import React, { useState, useEffect } from 'react';
import { Artist, WorldState, Song } from '../types';
import { TimeSystem } from '../systems/TimeSystem';
import { audioSystem, playSound } from '../utils/audioSystem';
import { SettingsModal } from './SettingsModal';
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
  Briefcase,
  Plane,
  TrendingUp,
  Volume2,
  VolumeX,
  Radio,
  Smartphone,
  Settings
} from 'lucide-react';
import {
  formatMoney,
  formatFans
} from '../utils/formatters';
import { gameJuice, HudTarget } from '../utils/gameJuice';
import { MagneticPrimaryButton } from './ui';

interface NavbarProps {
  player: Artist;
  world: WorldState;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onAdvanceCycle: (months: 1 | 3 | 6 | 12) => void;
  onReturnToTitle: () => void;
  onOpenPhone?: () => void;
  onExportSave?: () => void;
  onImportSave?: (jsonContent: string) => void;
  onResetCareer?: () => void;
}

type HubId = 'dashboard' | 'music' | 'world' | 'career';

export const Navbar: React.FC<NavbarProps> = ({
  player,
  world,
  currentTab,
  onTabChange,
  onAdvanceCycle,
  onReturnToTitle,
  onOpenPhone,
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
    if (currentTab === 'studio') return 'music';
    if (currentTab === 'streaming' || currentTab === 'charts' || currentTab === 'relations') return 'world';
    return 'career';
  };

  const activeHub = getActiveHub();

  const currentMonth = world?.currentMonth || 1;
  const currentYear = world?.currentYear || 2026;
  const monthName = TimeSystem.getMonthName(currentMonth);

  const playerEnergy = player?.stats?.energy ?? 100;
  const playerFunds = player?.stats?.funds ?? 0;
  const playerFans = player?.stats?.fansCount ?? 0;
  const playerName = player?.name || 'Artista';

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
    return playerSongs.length >= 2 && (player?.stats?.monthlyListeners || 0) >= 1000 && playerEnergy >= 85;
  }, [playerSongs.length, player?.stats?.monthlyListeners, playerEnergy]);

  const pendingCollabCount = React.useMemo(() => {
    if (!Array.isArray(world?.pendingCollabOffers)) return 0;
    return world.pendingCollabOffers.filter((o) => o && (!o.status || o.status === 'pending')).length;
  }, [world?.pendingCollabOffers]);

  const hasActiveGala = Boolean(world?.activeGalaCeremony);
  const hasActiveBeef = Object.keys(world?.activeBeefs || {}).length > 0;
  const hasStudioAction = playerEnergy >= 85 && singlesThisYear === 0;

  const getEnergyBadge = () => {
    if (playerEnergy >= 75) {
      return {
        bg: 'border-emerald-500/30 text-emerald-300',
        bar: 'bg-gradient-to-r from-emerald-500 to-[#00E599]'
      };
    } else if (playerEnergy >= 35) {
      return {
        bg: 'border-amber-500/30 text-amber-300',
        bar: 'bg-gradient-to-r from-amber-500 to-amber-300'
      };
    }
    return {
      bg: 'border-rose-500/40 text-rose-300',
      bar: 'bg-gradient-to-r from-rose-600 to-rose-400'
    };
  };

  const energyStyle = getEnergyBadge();

  return (
    <header className="sticky top-0 z-40 liquid-glass-header text-[#F4F0EA] select-none border-b border-white/10 shadow-lg">
      {/* FILA 1: HUD de Videojuego - Marca, Control de Turno Primario y Recursos */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
        {/* Izquierda: Logo + Indicador de Ciclo Actual */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onReturnToTitle();
            }}
            className="tap flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-left group"
            title="Volver al Menú Principal"
          >
            <div className="w-8 h-8 rounded-[4px] bg-gradient-to-b from-[#FF5F1A] to-[#FF3B00] text-white flex items-center justify-center shrink-0 shadow-[0_2px_0_#992500] group-hover:scale-105 transition-transform">
              <Disc3 className="w-4 h-4 text-white animate-spin-slow" />
            </div>
            <span className="kit-text-header font-display text-sm tracking-tight">
              EL ARTISTA
            </span>
          </button>

          <div className="h-5 w-px bg-white/15 hidden sm:block" />

          <div
            className="flex items-center gap-2 liquid-hud rounded-[4px] px-3.5 py-1.5 text-xs whitespace-nowrap font-mono tabular-nums"
            title={`Fecha actual: ${monthName} ${currentYear}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] shrink-0 shadow-[0_0_8px_rgba(0,229,153,0.8)]" />
            <span className="font-extrabold text-[#F4F0EA]">
              {monthName} {currentYear}
            </span>
          </div>
        </div>

        {/* Centro: Selector de Período y Botón de Acción Primaria de Videojuego */}
        <div className="order-last lg:order-none w-full lg:w-auto flex items-center gap-2.5 shrink-0 justify-center">
          <div className="flex items-center border border-white/15 bg-[#0C101B]/85 rounded-[4px] p-0.5 text-xs font-mono exclusion-group gap-0.5">
            {([
              { val: 1, label: '1M', title: 'Avanzar 1 Mes' },
              { val: 3, label: '3M', title: 'Avanzar 3 Meses' },
              { val: 6, label: '6M', title: 'Avanzar 6 Meses' },
              { val: 12, label: '1Y', title: 'Avanzar 1 Año' },
            ] as const).map((opt) => (
              <button
                key={opt.val}
                onClick={() => {
                  playSound('click');
                  setCycleMonths(opt.val);
                }}
                aria-pressed={cycleMonths === opt.val}
                className={`px-2.5 py-1 rounded-[3px] font-mono text-xs font-bold transition-all cursor-pointer ${
                  cycleMonths === opt.val
                    ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/50 shadow-[0_0_12px_rgba(0,229,153,0.25)]'
                    : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                title={opt.title}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* BOTÓN PRIMARIO DE ACCIÓN MAGNÉTICO (Avanzar Turno / Semestre) */}
          <MagneticPrimaryButton
            id="btn-advance-cycle"
            onClick={(e) => {
              playSound('click');
              gameJuice.triggerConfetti(e.currentTarget);
              gameJuice.triggerFloatingNumber({
                text: cycleMonths === 1 ? '+1 Mes' : cycleMonths === 3 ? '+3 Meses' : cycleMonths === 6 ? '+6 Meses' : '+1 Año',
                origin: e.currentTarget,
                type: 'neutral'
              });
              onAdvanceCycle(cycleMonths);
            }}
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold tracking-tight uppercase whitespace-nowrap shrink-0"
            title="Procesar el ciclo seleccionado y simular el mundo"
            icon={<Play className="w-4 h-4 fill-[#032115] text-[#032115] shrink-0" />}
            label={`Avanzar (${cycleMonths === 1 ? '+1M' : cycleMonths === 3 ? '+3M' : cycleMonths === 6 ? '+6M' : '+1Y'})`}
          />
        </div>

        {/* Derecha: HUD de Recursos (Fondos, Fans, Medidor HP de Energía) + Utilidades */}
        <div className="flex items-center gap-2 text-xs shrink-0 ml-auto lg:ml-0 flex-wrap sm:flex-nowrap">
          <div
            id="hud-money"
            className={`flex items-center gap-1.5 liquid-hud rounded-[4px] px-3.5 py-1.5 border border-emerald-500/25 bg-[#00E599]/10 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
              poppingHud.money ? 'scale-110 sm:scale-120 ring-2 ring-[#00E599] shadow-[0_0_18px_#00E599] z-20' : ''
            }`}
            title={`Fondos Disponibles: ${formatMoney(playerFunds)}`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#00E599] shrink-0" />
            <span className={`font-extrabold text-[#00E599] font-mono tabular-nums whitespace-nowrap transition-transform duration-300 ${poppingHud.money ? 'animate-hud-pop text-[#00FFAC]' : ''}`}>
              {formatMoney(playerFunds)}
            </span>
          </div>

          <div
            id="hud-fans"
            className={`flex items-center gap-1.5 liquid-hud rounded-[4px] px-3.5 py-1.5 border border-orange-500/25 bg-[#FF4F00]/10 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
              poppingHud.fans ? 'scale-110 sm:scale-120 ring-2 ring-[#FF4F00] shadow-[0_0_18px_#FF4F00] z-20' : ''
            }`}
            title={`Fans: ${playerFans.toLocaleString('es-AR')} • Oyentes Mensuales: ${(player?.stats?.monthlyListeners || 0).toLocaleString('es-AR')}`}
          >
            <Users className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
            <span className={`font-extrabold font-mono tabular-nums text-[#F4F0EA] transition-transform duration-300 ${poppingHud.fans ? 'animate-hud-pop text-[#FF4F00]' : ''}`}>
              {formatFans(playerFans)}
            </span>
          </div>

          {/* Marcador de Puntos / Legacy Score */}
          <div
            id="hud-points"
            className={`flex items-center gap-1.5 liquid-hud rounded-[4px] px-3.5 py-1.5 border border-cyan-500/25 bg-[#00D2FF]/10 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
              poppingHud.points ? 'scale-110 sm:scale-120 ring-2 ring-[#00D2FF] shadow-[0_0_18px_#00D2FF] z-20' : ''
            }`}
            title={`Puntos de Carrera (Legacy Score): ${(player?.legacyScore ?? 0).toLocaleString('es-AR')}`}
          >
            <Award className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
            <span className={`font-extrabold text-[#00D2FF] font-mono tabular-nums whitespace-nowrap transition-transform duration-300 ${poppingHud.points ? 'animate-hud-pop text-cyan-200' : ''}`}>
              {(player?.legacyScore ?? 0).toLocaleString('es-AR')} <span className="text-[10px] sm:text-xs text-[#00D2FF]/85 font-sans">PTS</span>
            </span>
          </div>

          {/* Medidor HP de Energía Cilíndrico con Brillo Especular */}
          <div
            id="hud-energy"
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs liquid-hud rounded-[4px] ${energyStyle.bg} bg-black/40 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
              poppingHud.energy ? 'scale-125 ring-2 ring-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.8)] z-20' : ''
            }`}
            title={`Energía Vital: ${playerEnergy}%`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-extrabold font-mono tabular-nums">{playerEnergy}%</span>
            <div className="w-12 h-3.5 bg-[#0A0A0F] rounded-[3px] border border-white/20 overflow-hidden shrink-0 hidden sm:block relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)]">
              <div
                className={`h-full rounded-[3px] transition-all duration-300 relative overflow-hidden shadow-[inset_0_-2px_0_rgba(0,0,0,0.4)] ${energyStyle.bar}`}
                style={{ width: `${Math.min(100, Math.max(0, playerEnergy))}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            id="btn-open-artist-phone"
            onClick={() => {
              playSound('click');
              onOpenPhone?.();
            }}
            className="w-8 h-8 rounded-[4px] flex items-center justify-center relative border border-white/15 bg-[#0C101B]/85 hover:bg-white/15 hover:border-white/25 transition-all cursor-pointer text-[#F4F0EA] group shrink-0"
            title="Abrir Smartphone (DMs, TrendX y Banco)"
          >
            <Smartphone className="w-4 h-4 text-[#DCE2EE] group-hover:text-white transition-colors" />
            {(world?.unreadPhoneCount ?? 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-[3px] bg-[#FF4F00] text-white text-3xs font-sans font-black flex items-center justify-center shadow-sm">
                {world.unreadPhoneCount}
              </span>
            )}
          </button>

          <div className="border border-white/15 bg-[#0C101B]/85 rounded-[4px] p-0.5 flex items-center gap-0.5">
            <button
              id="btn-toggle-audio-sfx"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              className={`w-7 h-7 rounded-[3px] flex items-center justify-center transition-colors cursor-pointer ${
                soundEnabled ? 'text-[#00E599]' : 'text-[#CBD5E1] hover:text-white'
              }`}
              title={soundEnabled ? 'Silenciar Audio' : 'Activar Audio'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              id="btn-open-settings"
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

      {/* FILA 2: Navegación Principal Centrada */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-2 border-t border-white/10 flex items-center justify-center">
        <nav aria-label="Navegación principal" className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto scroll-fade-x max-w-full">
          <button
            id="nav-tab-dashboard"
            onClick={() => handleTabClick('dashboard')}
            className={`tap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              currentTab === 'dashboard'
                ? 'bg-[#FF4F00]/20 text-white border border-[#FF4F00]/65 shadow-[0_0_16px_rgba(255,79,0,0.22),inset_0_1px_0_rgba(255,255,255,0.3)]'
                : 'text-[#E2E8F0] hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Compass className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-[#FF4F00]' : 'text-[#CBD5E1]'}`} />
            <span>Inicio</span>
          </button>

          <button
            id="nav-tab-studio"
            onClick={() => handleTabClick('studio')}
            className={`tap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'music'
                ? 'bg-[#FF4F00]/20 text-white border border-[#FF4F00]/65 shadow-[0_0_16px_rgba(255,79,0,0.22),inset_0_1px_0_rgba(255,255,255,0.3)]'
                : 'text-[#E2E8F0] hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Disc3 className={`w-4 h-4 ${activeHub === 'music' ? 'text-[#FF4F00]' : 'text-[#CBD5E1]'}`} />
            <span>Estudio & Música</span>
            {hasStudioAction && (
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" title="Listo para grabar" />
            )}
          </button>

          <button
            id="nav-hub-world"
            onClick={() => handleTabClick('streaming')}
            className={`tap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'world'
                ? 'bg-[#FF4F00]/20 text-white border border-[#FF4F00]/65 shadow-[0_0_16px_rgba(255,79,0,0.22),inset_0_1px_0_rgba(255,255,255,0.3)]'
                : 'text-[#E2E8F0] hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeHub === 'world' ? 'text-[#FF4F00]' : 'text-[#CBD5E1]'}`} />
            <span>Escena & Charts</span>
            {pendingCollabCount > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-[3px] bg-[#00E599] text-[#032115] text-[10px] font-extrabold leading-none tabular-nums"
                title={`${pendingCollabCount} oferta(s) de colaboración pendiente(s)`}
              >
                {pendingCollabCount}
              </span>
            )}
            {hasActiveBeef && (
              <span className="w-2 h-2 rounded-full bg-[#FF4F00] shrink-0" title="Feudo activo" />
            )}
          </button>

          <button
            id="nav-hub-career"
            onClick={() => handleTabClick('tours')}
            className={`tap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'career'
                ? 'bg-[#FF4F00]/20 text-white border border-[#FF4F00]/65 shadow-[0_0_16px_rgba(255,79,0,0.22),inset_0_1px_0_rgba(255,255,255,0.3)]'
                : 'text-[#E2E8F0] hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Briefcase className={`w-4 h-4 ${activeHub === 'career' ? 'text-[#FF4F00]' : 'text-[#CBD5E1]'}`} />
            <span>Carrera & Negocios</span>
            {(isTourReady || hasActiveGala) && (
              <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
            )}
          </button>
        </nav>
      </div>

      {/* FILA 3: Subcategorías Centradas para Escena & Charts y Carrera & Negocios */}
      {(activeHub === 'world' || activeHub === 'career') && (
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-2 border-t border-white/10 bg-[#070A12]/65 flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 overflow-x-auto scroll-fade-x max-w-full">
            {activeHub === 'world' && (
              <>
                <button
                  id="nav-tab-streaming"
                  onClick={() => handleTabClick('streaming')}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    currentTab === 'streaming'
                      ? 'bg-[#161E31]/95 text-white border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]'
                      : 'bg-[#0C101B]/80 text-[#E2E8F0] border border-white/15 hover:bg-[#161E31]/85 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Radio className="w-4 h-4 text-[#FF4F00] shrink-0" />
                  <span>Streaming</span>
                </button>

                <button
                  id="nav-tab-charts"
                  onClick={() => handleTabClick('charts')}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    currentTab === 'charts'
                      ? 'bg-[#161E31]/95 text-white border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]'
                      : 'bg-[#0C101B]/80 text-[#E2E8F0] border border-white/15 hover:bg-[#161E31]/85 hover:text-white hover:border-white/30'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Charts</span>
                </button>

                <button
                  id="nav-tab-relations"
                  onClick={() => handleTabClick('relations')}
                  className={`px-4 sm:px-4.5 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    currentTab === 'relations'
                      ? 'bg-gradient-to-r from-[#FF4F00]/28 to-[#00E599]/20 text-white border border-[#FF4F00]/75 shadow-[0_0_18px_rgba(255,79,0,0.30),inset_0_1px_0_rgba(255,255,255,0.40)]'
                      : 'bg-gradient-to-r from-[#0E1726]/90 to-[#111E2E]/90 text-white border border-[#00E599]/45 hover:border-[#00E599]/80 hover:from-[#132235] hover:to-[#16293B] shadow-[0_0_12px_rgba(0,229,153,0.14),inset_0_1px_0_rgba(255,255,255,0.22)]'
                  }`}
                >
                  <Network className="w-4 h-4 text-[#00E599] shrink-0" />
                  <span>Artistas & Feudos</span>
                  {pendingCollabCount > 0 ? (
                    <span
                      className="px-1.5 py-0.5 rounded-[3px] bg-[#00E599] text-[#032115] text-[10px] sm:text-[11px] font-extrabold leading-none tabular-nums shadow-[0_0_8px_rgba(0,229,153,0.45)]"
                      title={`${pendingCollabCount} oferta(s) de colaboración pendiente(s)`}
                    >
                      {pendingCollabCount} FT.
                    </span>
                  ) : (
                    <span
                      className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-extrabold uppercase tracking-wider leading-none ${
                        currentTab === 'relations'
                          ? 'bg-[#FF4F00] text-white'
                          : 'bg-[#00E599]/18 text-[#00E599] border border-[#00E599]/35'
                      }`}
                    >
                      Collabs
                    </span>
                  )}
                  {hasActiveBeef && (
                    <span className="w-2 h-2 rounded-full bg-[#FF4F00] shrink-0" title="Feudo activo" />
                  )}
                </button>
              </>
            )}

            {activeHub === 'career' && (
              <>
                <button
                  id="nav-tab-tours"
                  onClick={() => handleTabClick('tours')}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    currentTab === 'tours'
                      ? 'bg-[#161E31]/95 text-white border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]'
                      : 'bg-[#0C101B]/80 text-[#E2E8F0] border border-white/15 hover:bg-[#161E31]/85 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Plane className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Giras</span>
                </button>

                <button
                  id="nav-tab-industry"
                  onClick={() => handleTabClick('industry')}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    currentTab === 'industry'
                      ? 'bg-[#161E31]/95 text-white border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]'
                      : 'bg-[#0C101B]/80 text-[#E2E8F0] border border-white/15 hover:bg-[#161E31]/85 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span>Sellos & Mánagers</span>
                </button>

                <button
                  id="nav-tab-lifestyle"
                  onClick={() => handleTabClick('lifestyle')}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    currentTab === 'lifestyle'
                      ? 'bg-[#161E31]/95 text-white border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]'
                      : 'bg-[#0C101B]/80 text-[#E2E8F0] border border-white/15 hover:bg-[#161E31]/85 hover:text-white hover:border-white/30'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#FF4F00] shrink-0" />
                  <span>Tienda</span>
                </button>

                <button
                  id="nav-tab-awards"
                  onClick={() => handleTabClick('awards')}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    currentTab === 'awards'
                      ? 'bg-[#161E31]/95 text-white border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]'
                      : 'bg-[#0C101B]/80 text-[#E2E8F0] border border-white/15 hover:bg-[#161E31]/85 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>Premios</span>
                </button>

                <button
                  id="nav-tab-career"
                  onClick={() => handleTabClick('career')}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    currentTab === 'career'
                      ? 'bg-[#161E31]/95 text-white border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]'
                      : 'bg-[#0C101B]/80 text-[#E2E8F0] border border-white/15 hover:bg-[#161E31]/85 hover:text-white hover:border-white/30'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>Eras</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          artistName={playerName}
          currentYear={currentYear}
          currentMonth={currentMonth}
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
