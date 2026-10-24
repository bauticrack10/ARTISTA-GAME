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
  Music2,
  Layers,
  Settings
} from 'lucide-react';
import {
  formatMoney,
  formatFans
} from '../utils/formatters';

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

  const hasActiveGala = Boolean(world?.activeGalaCeremony);
  const hasActiveBeef = Object.keys(world?.activeBeefs || {}).length > 0;
  const hasStudioAction = playerEnergy >= 85 && singlesThisYear === 0;

  const getEnergyBadge = () => {
    if (playerEnergy >= 75) {
      return {
        bg: 'bg-[#141417] border-[#26262B] text-[#F4F0EA]',
        bar: 'bg-[#10B981]'
      };
    } else if (playerEnergy >= 35) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        bar: 'bg-amber-400'
      };
    }
    return {
      bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
      bar: 'bg-rose-500'
    };
  };

  const energyStyle = getEnergyBadge();

  return (
    <header className="sticky top-0 z-40 liquid-glass-header text-[#F4F0EA] select-none">
      {/* FILA 1: Marca, Control de Tiempo y Recursos Esenciales */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 border-b border-white/10">
        {/* Izquierda: Logo + Fecha Actual */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onReturnToTitle();
            }}
            className="tap flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-left"
            title="Volver al Menú Principal"
          >
            <div className="w-7 h-7 rounded-[4px] bg-[#FF4F00] text-white flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <Disc3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-extrabold tracking-tight text-[#F4F0EA] text-xs leading-none">
              EL ARTISTA
            </span>
          </button>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <div
            className="flex items-center gap-2 liquid-glass-pill px-3 py-1 text-xs whitespace-nowrap font-sans tabular-nums"
            title={`Fecha actual: ${monthName} ${currentYear}`}
          >
            <span className="w-2 h-2 rounded-[2px] bg-[#10B981] shrink-0" />
            <span className="font-bold text-[#F4F0EA]">
              {monthName} {currentYear}
            </span>
          </div>
        </div>

        {/* Centro: Avance de Tiempo Directo */}
        <div className="order-last lg:order-none w-full lg:w-auto flex items-center gap-2 shrink-0 justify-center">
          <div className="flex items-center liquid-glass-pill p-0.5 text-xs font-semibold">
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
                className={`min-h-7 px-2.5 py-0.5 rounded-[4px] font-sans transition-all cursor-pointer text-xs ${
                  cycleMonths === opt.val
                    ? 'bg-[#FF4F00] text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                    : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-white/5'
                }`}
                title={opt.title}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            id="btn-advance-cycle"
            onClick={() => {
              playSound('click');
              onAdvanceCycle(cycleMonths);
            }}
            className="tap flex items-center gap-2 bg-[#FF4F00] hover:bg-[#E04500] text-white px-3.5 py-1.5 rounded-[6px] font-sans text-xs font-semibold cursor-pointer active:translate-y-[1px] transition-all border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(255,79,0,0.35)] whitespace-nowrap"
            title="Procesar el período seleccionado"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white shrink-0" />
            <span>Avanzar ({cycleMonths === 1 ? '+1M' : cycleMonths === 3 ? '+3M' : cycleMonths === 6 ? '+6M' : '+1Y'})</span>
          </button>
        </div>

        {/* Derecha: 3 Recursos Esenciales (Fondos, Fans, Energía) + Teléfono + Utilidades */}
        <div className="flex items-center gap-2 text-xs shrink-0 ml-auto lg:ml-0 flex-wrap sm:flex-nowrap">
          <div
            className="flex items-center gap-1.5 liquid-glass-pill px-3 py-1"
            title={`Fondos Disponibles: ${formatMoney(playerFunds)}`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span className="font-bold text-[#10B981] font-sans tabular-nums whitespace-nowrap">{formatMoney(playerFunds)}</span>
          </div>

          <div
            className="flex items-center gap-1.5 liquid-glass-pill px-3 py-1"
            title={`Fans: ${playerFans.toLocaleString('es-AR')} • Oyentes Mensuales: ${(player?.stats?.monthlyListeners || 0).toLocaleString('es-AR')}`}
          >
            <Users className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
            <span className="font-bold font-sans tabular-nums text-[#F4F0EA]">{formatFans(playerFans)}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 text-xs liquid-glass-pill ${energyStyle.bg}`}
            title={`Energía Vital: ${playerEnergy}%`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold font-sans tabular-nums">{playerEnergy}%</span>
            <div className="w-5 h-1.5 bg-white/10 rounded-[2px] overflow-hidden shrink-0 hidden sm:block">
              <div
                className={`h-full rounded-[2px] transition-all duration-300 ${energyStyle.bar}`}
                style={{ width: `${Math.min(100, Math.max(0, playerEnergy))}%` }}
              />
            </div>
          </div>

          <button
            id="btn-open-artist-phone"
            onClick={() => {
              playSound('click');
              onOpenPhone?.();
            }}
            className="tap relative flex items-center gap-1.5 px-3 py-1 rounded-[6px] liquid-glass-pill hover:border-white/30 text-xs transition-colors cursor-pointer shrink-0 text-[#F4F0EA]"
            title="Abrir Smartphone (DMs, TrendX y Banco)"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#8E8E99] shrink-0" />
            <span className="hidden xl:inline font-sans text-xs text-[#8E8E99]">Teléfono</span>
            {(world?.unreadPhoneCount ?? 0) > 0 && (
              <span className="w-4 h-4 rounded-[2px] bg-[#FF4F00] text-white text-3xs font-sans font-bold flex items-center justify-center">
                {world.unreadPhoneCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-1 liquid-glass-pill p-0.5">
            <button
              id="btn-toggle-audio-sfx"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              className={`p-1 rounded-[3px] transition-all cursor-pointer ${
                soundEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-[#52525B] hover:text-[#8E8E99]'
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
              className="p-1 rounded-[3px] text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-white/10 transition-colors cursor-pointer"
              title="Ajustes y Guardado"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FILA 2: Navegación Principal Simplificada */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x">
          <button
            id="nav-tab-dashboard"
            onClick={() => handleTabClick('dashboard')}
            className={`tap px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              currentTab === 'dashboard'
                ? 'liquid-glass-pill text-[#F4F0EA] border-[#FF4F00]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-white/5 border border-transparent'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${currentTab === 'dashboard' ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
            <span>Inicio</span>
          </button>

          <button
            id="nav-tab-studio"
            onClick={() => handleTabClick('studio')}
            className={`tap px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeHub === 'music'
                ? 'liquid-glass-pill text-[#F4F0EA] border-[#FF4F00]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-white/5 border border-transparent'
            }`}
          >
            <Disc3 className={`w-3.5 h-3.5 ${activeHub === 'music' ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
            <span>Estudio & Música</span>
            {hasStudioAction && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" title="Listo para grabar" />
            )}
          </button>

          <button
            id="nav-hub-world"
            onClick={() => handleTabClick('streaming')}
            className={`tap px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeHub === 'world'
                ? 'liquid-glass-pill text-[#F4F0EA] border-[#FF4F00]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-white/5 border border-transparent'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${activeHub === 'world' ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
            <span>Escena & Charts</span>
            {hasActiveBeef && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00] shrink-0" title="Feudo activo" />
            )}
          </button>

          <button
            id="nav-hub-career"
            onClick={() => handleTabClick('tours')}
            className={`tap px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeHub === 'career'
                ? 'liquid-glass-pill text-[#F4F0EA] border-[#FF4F00]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-white/5 border border-transparent'
            }`}
          >
            <Briefcase className={`w-3.5 h-3.5 ${activeHub === 'career' ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
            <span>Carrera & Negocios</span>
            {(isTourReady || hasActiveGala) && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
            )}
          </button>
        </div>

        {/* Sub-pestañas solo cuando hay opciones secundarias (sin texto redundante en Inicio) */}
        {activeHub !== 'dashboard' && (
          <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x">
            {activeHub === 'music' && (
              <>
                <button
                  onClick={() => handleTabClick('studio_single')}
                  className="px-2.5 py-1 rounded-[6px] text-xs font-medium liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Music2 className="w-3 h-3 text-[#FF4F00]" />
                  <span>Single</span>
                </button>
                <button
                  onClick={() => handleTabClick('studio_album')}
                  className="px-2.5 py-1 rounded-[6px] text-xs font-medium liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Layers className="w-3 h-3 text-[#FF4F00]" />
                  <span>Álbum / EP</span>
                </button>
                <button
                  onClick={() => handleTabClick('catalog')}
                  className="px-2.5 py-1 rounded-[6px] text-xs font-medium liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Disc3 className="w-3 h-3 text-[#10B981]" />
                  <span>Catálogo ({playerSongs.length})</span>
                </button>
              </>
            )}

            {activeHub === 'world' && (
              <>
                <button
                  id="nav-tab-streaming"
                  onClick={() => handleTabClick('streaming')}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'streaming'
                      ? 'liquid-glass-pill text-[#F4F0EA] border-white/30'
                      : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA]'
                  }`}
                >
                  <Radio className="w-3 h-3 text-[#FF4F00]" />
                  <span>Streaming</span>
                </button>
                <button
                  id="nav-tab-charts"
                  onClick={() => handleTabClick('charts')}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'charts'
                      ? 'liquid-glass-pill text-[#F4F0EA] border-white/30'
                      : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA]'
                  }`}
                >
                  <BarChart3 className="w-3 h-3 text-[#10B981]" />
                  <span>Charts</span>
                </button>
                <button
                  id="nav-tab-relations"
                  onClick={() => handleTabClick('relations')}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'relations'
                      ? 'liquid-glass-pill text-[#F4F0EA] border-white/30'
                      : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA]'
                  }`}
                >
                  <Network className="w-3 h-3 text-[#8E8E99]" />
                  <span>Artistas & Feudos</span>
                </button>
              </>
            )}

            {activeHub === 'career' && (
              <>
                <button
                  id="nav-tab-tours"
                  onClick={() => handleTabClick('tours')}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'tours'
                      ? 'liquid-glass-pill text-[#F4F0EA] border-white/30'
                      : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA]'
                  }`}
                >
                  <Plane className="w-3 h-3 text-[#10B981]" />
                  <span>Giras</span>
                </button>
                <button
                  id="nav-tab-industry"
                  onClick={() => handleTabClick('industry')}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'industry'
                      ? 'liquid-glass-pill text-[#F4F0EA] border-white/30'
                      : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA]'
                  }`}
                >
                  <Building2 className="w-3 h-3 text-[#8E8E99]" />
                  <span>Sellos & Mánagers</span>
                </button>
                <button
                  id="nav-tab-lifestyle"
                  onClick={() => handleTabClick('lifestyle')}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'lifestyle'
                      ? 'liquid-glass-pill text-[#F4F0EA] border-white/30'
                      : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA]'
                  }`}
                >
                  <ShoppingBag className="w-3 h-3 text-[#FF4F00]" />
                  <span>Tienda</span>
                </button>
                <button
                  id="nav-tab-awards"
                  onClick={() => handleTabClick('awards')}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'awards'
                      ? 'liquid-glass-pill text-[#F4F0EA] border-white/30'
                      : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA]'
                  }`}
                >
                  <Award className="w-3 h-3 text-[#F59E0B]" />
                  <span>Premios</span>
                </button>
                <button
                  id="nav-tab-career"
                  onClick={() => handleTabClick('career')}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'career'
                      ? 'liquid-glass-pill text-[#F4F0EA] border-white/30'
                      : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F0EA]'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 text-[#F59E0B]" />
                  <span>Eras</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

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
