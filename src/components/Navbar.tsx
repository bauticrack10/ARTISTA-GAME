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
  VolumeX,
  Radio,
  Smartphone,
  Music2,
  Layers,
  ChevronRight,
  Flame,
  Clock,
  Settings
} from 'lucide-react';
import { Song } from '../types';
import { SettingsModal } from './SettingsModal';
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
  onOpenPhone, onExportSave, onImportSave, onResetCareer
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

  // Determine active Hub based on currentTab
  const getActiveHub = (): HubId => {
    if (currentTab === 'dashboard') return 'dashboard';
    if (currentTab === 'studio') return 'music';
    if (currentTab === 'streaming' || currentTab === 'charts' || currentTab === 'relations') return 'world';
    return 'career'; // tours, industry, awards, lifestyle, career
  };

  const activeHub = getActiveHub();

  const currentMonth = world?.currentMonth || 1;
  const currentYear = world?.currentYear || 2026;
  const monthName = TimeSystem.getMonthName(currentMonth);
  const semesterShort = currentMonth <= 6 ? '1er Semestre' : '2do Semestre';

  const playerEnergy = player?.stats?.energy ?? 100;
  const playerFunds = player?.stats?.funds ?? 0;
  const playerFans = player?.stats?.fansCount ?? 0;
  const playerHype = player?.stats?.hype ?? 0;
  const playerName = player?.name || 'Artista';
  const playerAge = TimeSystem.calculateAge(player?.birthYear || 2008, currentYear);
  const mainGenreName =
    world?.genres && player?.mainGenreId && world.genres[player.mainGenreId]?.name
      ? world.genres[player.mainGenreId].name
      : player?.mainGenreId || 'Música Urbana';

  const playerOvr = Math.round(
    ((player?.stats?.popularity ?? 0) +
      (player?.stats?.reputation ?? 0) +
      (player?.stats?.artisticCredibility ?? 0)) /
      3
  );

  // Contextual Action Indicators for Smart Navigation
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

  const advanceCycleDescription = React.useMemo(() => {
    if (cycleMonths === 1) {
      return 'Avanzar 1 Mes: Se procesarán streams mensuales, regalías de catálogo, decaimiento orgánico de hype y posibles eventos de la escena.';
    }
    if (cycleMonths === 3) {
      return 'Avanzar 3 Meses (Trimestre): Liquidación de 3 meses de streams y regalías, eventos estacionales y balance de energía.';
    }
    if (cycleMonths === 6) {
      return 'Avanzar 6 Meses (Semestre): Liquidación semestral de catálogo, actualización de rankings globales en charts y galas de premios.';
    }
    return 'Avanzar 1 Año: Cierre de temporada anual, ceremonia de premios de la industria musical, envejecimiento del artista y balance total.';
  }, [cycleMonths]);

  const getEnergyBadge = () => {
    if (playerEnergy >= 75) {
      return {
        bg: 'bg-white/[0.03] border-white/10 text-slate-200',
        bar: 'bg-[#10B981]'
      };
    } else if (playerEnergy >= 35) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        bar: 'bg-amber-400'
      };
    }
    return {
      bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300 animate-pulse',
      bar: 'bg-rose-500'
    };
  };

  const energyStyle = getEnergyBadge();

  return (
    <header
      className="sticky top-0 z-40 bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#26262B] text-[#F4F0EA] select-none"
    >
      {/* =========================================================================
          FILA 1: Persistent Artist HUD (Identidad + Simulación de Tiempo + 4 Recursos)
         ========================================================================= */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 border-b border-[#26262B]">
        {/* Izquierda: Logo + Identidad Persistente del Artista (Nombre, Género, OVR, Edad) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onReturnToTitle();
            }}
            className="tap flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-left group"
            title="Volver al Menú Principal"
          >
            <div className="w-7 h-7 rounded-[4px] bg-[#FF2A4B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Disc3 className="w-4 h-4 text-white animate-spin-slow" />
            </div>
            <span className="font-display font-extrabold tracking-tight text-[#F4F0EA] text-xs leading-none">
              EL ARTISTA
            </span>
          </button>

          <div className="h-4 w-px bg-[#26262B] hidden sm:block" />

          {/* Tarjeta de Identidad Persistente del Artista */}
          <div
            onClick={() => handleTabClick('dashboard')}
            className="tap hidden sm:flex items-center gap-2 px-2 py-1 rounded-[4px] bg-[#141417] hover:bg-[#1C1C21] border border-[#26262B] text-xs transition-colors cursor-pointer"
            title={`Perfil de ${playerName} • Click para ir a Inicio`}
          >
            <ArtistAvatar
              name={playerName}
              avatarColor={player?.avatarColor}
              avatarIcon={player?.avatarIcon}
              size="xs"
              rounded="rounded-sm"
            />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-display font-bold text-[#F4F0EA] truncate max-w-[110px]">
                {playerName}
              </span>
              <span className="text-3xs font-sans font-semibold px-1.5 py-0.2 rounded-[2px] bg-[#1C1C21] text-[#8E8E99] border border-[#26262B] truncate max-w-[90px]">
                {mainGenreName}
              </span>
              <span
                className="text-3xs font-sans font-bold px-1.5 py-0.2 rounded-[2px] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                title={`Nivel Global (OVR): ${playerOvr}/100 • Reputación: ${player?.stats?.reputation || 0}/100`}
              >
                OVR {playerOvr}
              </span>
              <span className="text-3xs font-sans text-[#52525B] hidden md:inline">
                {playerAge}a
              </span>
            </div>
          </div>
        </div>

        {/* Centro: Indicador de Tiempo y Botonera de Simulación */}
        <div className="order-last lg:order-none w-full lg:w-auto flex items-center gap-2 shrink-0 justify-center">
          {/* Fecha en el Juego */}
          <div
            className="flex items-center gap-2 bg-[#141417] px-3 py-1.5 rounded-[4px] border border-[#26262B] text-xs shadow-xs whitespace-nowrap font-sans tabular-nums"
            title={`Fecha actual: ${monthName} ${currentYear} • ${semesterShort}`}
          >
            <span className="w-2 h-2 rounded-[2px] bg-[#10B981] shrink-0" />
            <span className="font-bold text-[#F4F0EA]">
              {monthName} {currentYear}
            </span>
            <span className="text-[#8E8E99] text-3xs font-medium hidden sm:inline">
              • {semesterShort}
            </span>
          </div>

          {/* Selector de Velocidad (1M / 3M / 6M / 1Y) */}
          <div className="flex items-center bg-[#141417] p-0.5 rounded-[4px] text-xs font-semibold border border-[#26262B]">
            {([
              { val: 1, label: '1M', title: 'Avanzar 1 Mes (Paso a Paso)' },
              { val: 3, label: '3M', title: 'Avanzar 3 Meses (Trimestre)' },
              { val: 6, label: '6M', title: 'Avanzar 6 Meses (Semestre)' },
              { val: 12, label: '1Y', title: 'Avanzar 1 Año' },
            ] as const).map((opt) => (
              <button
                key={opt.val}
                onClick={() => {
                  playSound('click');
                  setCycleMonths(opt.val);
                }}
                aria-pressed={cycleMonths === opt.val}
                className={`min-h-7 px-2.5 py-0.5 rounded-[3px] font-sans transition-all cursor-pointer text-xs ${
                  cycleMonths === opt.val
                    ? 'bg-[#FF2A4B] text-white font-bold'
                    : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21]'
                }`}
                title={opt.title}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Botón de Acción Principal (Avanzar - REC Red) */}
          <button
            id="btn-advance-cycle"
            onClick={() => {
              playSound('click');
              onAdvanceCycle(cycleMonths);
            }}
            className="tap group relative flex items-center gap-2 bg-[#FF2A4B] hover:bg-[#E11D48] text-white px-3.5 py-1.5 rounded-[4px] font-sans text-xs font-semibold cursor-pointer active:translate-y-[1px] transition-all border border-[#FF4A67]/30 whitespace-nowrap shadow-xs"
            title={advanceCycleDescription}
          >
            <Play className="w-3.5 h-3.5 fill-white text-white group-hover:scale-110 transition-transform shrink-0" />
            <span>Avanzar ({cycleMonths === 1 ? '+1M' : cycleMonths === 3 ? '+3M' : cycleMonths === 6 ? '+6M' : '+1Y'})</span>
          </button>
        </div>

        {/* Derecha: 4 Recursos Clave con Tooltips Explicativos + Teléfono + SFX */}
        <div className="flex items-center gap-2 text-xs shrink-0 ml-auto lg:ml-0 flex-wrap sm:flex-nowrap">
          {/* 1. Dinero / Fondos */}
          <div
            className="flex items-center flex-row gap-1 bg-[#141417] border border-[#26262B] px-2.5 py-1 rounded-[4px] text-xs text-[#F4F0EA] cursor-help"
            title={`Fondos Disponibles: ${formatMoney(playerFunds)}\nGenerados por streaming, shows, giras y adelantos de discográficas. Se utilizan para producciones y comodidades.`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span className="font-bold text-[#10B981] font-sans tabular-nums whitespace-nowrap">{formatMoney(playerFunds)}</span>
          </div>

          {/* 2. Inspiración / Hype Escénico */}
          <div
            className="flex items-center gap-1.5 bg-[#141417] border border-[#26262B] px-2.5 py-1 rounded-[4px] text-xs text-[#F4F0EA] cursor-help"
            title={`Hype Escénico: ${playerHype}/100\nFervor del momento. Acelera el impacto inicial de lanzamientos y reproducciones. Decae naturalmente sin actividad.`}
          >
            <Flame className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
            <span className="font-bold font-sans tabular-nums text-[#F4F0EA]">{playerHype}</span>
            <span className="text-3xs text-[#52525B] font-sans hidden xl:inline">/100</span>
          </div>

          {/* 3. Oyentes / Fans */}
          <div
            className="flex items-center gap-1.5 bg-[#141417] border border-[#26262B] px-2.5 py-1 rounded-[4px] text-xs text-[#F4F0EA] cursor-help"
            title={`Fans Fieles: ${playerFans.toLocaleString('es-AR')} seguidores devotos\nOyentes Mensuales: ${(player?.stats?.monthlyListeners || 0).toLocaleString('es-AR')} oyentes activos en streaming.`}
          >
            <Users className="w-3.5 h-3.5 text-[#FF2A4B] shrink-0" />
            <span className="font-bold font-sans tabular-nums text-[#F4F0EA]">{formatFans(playerFans)}</span>
          </div>

          {/* 4. Energía con Micro-barra */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[#26262B] text-xs cursor-help ${energyStyle.bg}`}
            title={`Energía Vital: ${playerEnergy}% (100% máx)\nRequerimientos: ≥15% para grabar single, ≥35% para álbum completo, ≥85% para giras. Recupera descansando.`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold font-sans tabular-nums">{playerEnergy}%</span>
            <div className="w-6 h-1.5 bg-white/10 rounded-[2px] overflow-hidden shrink-0 hidden sm:block">
              <div
                className={`h-full rounded-[2px] transition-all duration-300 ${energyStyle.bar}`}
                style={{ width: `${Math.min(100, Math.max(0, playerEnergy))}%` }}
              />
            </div>
          </div>

          {/* Smartphone del Artista con Notificación */}
          <button
            id="btn-open-artist-phone"
            onClick={() => {
              playSound('click');
              onOpenPhone?.();
            }}
            className="tap relative flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#141417] hover:bg-[#1C1C21] border border-[#26262B] hover:border-[#3F3F46] text-xs transition-colors cursor-pointer shrink-0 text-[#F4F0EA] group"
            title="Abrir Smartphone (DMs, TrendX y Banco)"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#8E8E99] group-hover:text-[#FF2A4B] transition-colors shrink-0" />
            <span className="hidden md:inline font-sans text-xs text-[#8E8E99]">Teléfono</span>
            {(world?.unreadPhoneCount ?? 0) > 0 && (
              <span className="w-4 h-4 rounded-[2px] bg-[#FF2A4B] text-white text-3xs font-sans font-bold flex items-center justify-center shadow-xs">
                {world.unreadPhoneCount}
              </span>
            )}
          </button>

          {/* Control de Audio / SFX */}
          <div className="flex items-center gap-1 bg-[#141417] border border-[#26262B] p-1 rounded-[4px]">
            <button
              id="btn-toggle-audio-sfx"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              className={`p-1 rounded-[3px] transition-all cursor-pointer ${
                soundEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-[#52525B] hover:text-[#8E8E99]'
              }`}
              title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Efectos de Sonido'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <div className="hidden xl:block px-1">
              <AudioEqualizer isPlaying={soundEnabled} />
            </div>
            <button id="btn-open-settings" onClick={() => { playSound('click'); setIsSettingsOpen(true); }} className="p-1 rounded-[3px] text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21] transition-colors cursor-pointer" title="Ajustes de Carrera, Autoguardado y Respaldo">
              <Settings className="w-3.5 h-3.5" />
            </button>
          <div className="hidden">
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FILA 2: Los 3 Grandes Hubs Principales + Inicio (Minimalista, Amplio & Smart LEDs)
         ========================================================================= */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* 4 Grandes Botones de Hub */}
        <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x">
          {/* 1. INICIO */}
          <button
            id="nav-tab-dashboard"
            onClick={() => handleTabClick('dashboard')}
            className={`tap px-3.5 py-1.5 rounded-[4px] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              currentTab === 'dashboard'
                ? 'bg-[#1C1C21] border border-[#FF2A4B] text-[#F4F0EA]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#141417] border border-transparent'
            }`}
          >
            <Compass className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-[#FF2A4B]' : 'text-[#8E8E99]'}`} />
            <span>Inicio</span>
          </button>

          {/* 2. HUB: MÚSICA & ESTUDIO */}
          <button
            id="nav-tab-studio"
            onClick={() => handleTabClick('studio')}
            className={`tap px-3.5 py-1.5 rounded-[4px] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'music'
                ? 'bg-[#1C1C21] border border-[#FF2A4B] text-[#F4F0EA]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#141417] border border-transparent'
            }`}
          >
            <Disc3 className={`w-4 h-4 ${activeHub === 'music' ? 'text-[#FF2A4B]' : 'text-[#8E8E99]'}`} />
            <span>Música & Estudio</span>
            {hasStudioAction && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse shrink-0 shadow-xs" title="Listo para componer un nuevo single" />
            )}
          </button>

          {/* 3. HUB: EL MUNDO & REDES */}
          <button
            id="nav-hub-world"
            onClick={() => handleTabClick('streaming')}
            className={`tap px-3.5 py-1.5 rounded-[4px] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'world'
                ? 'bg-[#1C1C21] border border-[#FF2A4B] text-[#F4F0EA]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#141417] border border-transparent'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeHub === 'world' ? 'text-[#FF2A4B]' : 'text-[#8E8E99]'}`} />
            <span>El Mundo & Redes</span>
            {hasActiveBeef && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A4B] animate-pulse shrink-0 shadow-xs" title="Tiradera o feudo activo" />
            )}
          </button>

          {/* 4. HUB: CARRERA & ESCENA */}
          <button
            id="nav-hub-career"
            onClick={() => handleTabClick('tours')}
            className={`tap px-3.5 py-1.5 rounded-[4px] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'career'
                ? 'bg-[#1C1C21] border border-[#FF2A4B] text-[#F4F0EA]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#141417] border border-transparent'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeHub === 'career' ? 'text-[#FF2A4B]' : 'text-[#8E8E99]'}`} />
            <span>Carrera & Escena</span>
            {isTourReady ? (
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shrink-0 shadow-xs" title="Requisitos de gira listos (3/3)" />
            ) : hasActiveGala ? (
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse shrink-0 shadow-xs" title="Gala de premios activa" />
            ) : null}
          </button>
        </div>

        {/* Sub-Navegación Contextual (Módulos Hardware Limpios del Hub Activo) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x pt-1 md:pt-0 border-t md:border-t-0 border-[#26262B]">
          {/* Sub-pills de MÚSICA */}
          {activeHub === 'music' && (
            <>
              <button
                onClick={() => handleTabClick('studio_single')}
                className="px-2.5 py-1 rounded-[4px] text-xs font-medium bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B] hover:border-[#3F3F46] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Music2 className="w-3 h-3 text-[#FF2A4B]" />
                <span>Grabar Single</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A4B] shrink-0" title="Modo REC Estudio" />
              </button>
              <button
                onClick={() => handleTabClick('studio_album')}
                className="px-2.5 py-1 rounded-[4px] text-xs font-medium bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B] hover:border-[#3F3F46] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Layers className="w-3 h-3 text-[#FF2A4B]" />
                <span>Grabar Álbum / EP</span>
              </button>
              <button
                onClick={() => handleTabClick('catalog')}
                className="px-2.5 py-1 rounded-[4px] text-xs font-medium bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B] hover:border-[#3F3F46] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Disc3 className="w-3 h-3 text-[#10B981]" />
                <span>Mi Catálogo</span>
                <span className="text-3xs font-sans font-bold px-1.5 py-0.2 rounded-[2px] bg-[#0B0B0C] text-[#8E8E99] border border-[#26262B] tabular-nums">
                  {playerSongs.length}
                </span>
              </button>
            </>
          )}

          {/* Sub-pills de EL MUNDO */}
          {activeHub === 'world' && (
            <>
              <button
                id="nav-tab-streaming"
                onClick={() => handleTabClick('streaming')}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'streaming'
                    ? 'bg-[#1C1C21] text-[#F4F0EA] border border-[#3F3F46]'
                    : 'bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B]'
                }`}
              >
                <Radio className="w-3 h-3 text-[#FF2A4B]" />
                <span>Streaming & Redes</span>
              </button>
              <button
                id="nav-tab-charts"
                onClick={() => handleTabClick('charts')}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'charts'
                    ? 'bg-[#1C1C21] text-[#F4F0EA] border border-[#3F3F46]'
                    : 'bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B]'
                }`}
              >
                <BarChart3 className="w-3 h-3 text-[#10B981]" />
                <span>Charts & Rankings</span>
              </button>
              <button
                id="nav-tab-relations"
                onClick={() => handleTabClick('relations')}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'relations'
                    ? 'bg-[#1C1C21] text-[#F4F0EA] border border-[#3F3F46]'
                    : 'bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B]'
                }`}
              >
                <Network className="w-3 h-3 text-[#8E8E99]" />
                <span>Artistas & Feuds</span>
                {hasActiveBeef && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A4B] animate-pulse shrink-0" title="Feudo activo" />
                )}
              </button>
            </>
          )}

          {/* Sub-pills de CARRERA */}
          {activeHub === 'career' && (
            <>
              <button
                id="nav-tab-tours"
                onClick={() => handleTabClick('tours')}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'tours'
                    ? 'bg-[#1C1C21] text-[#F4F0EA] border border-[#3F3F46]'
                    : 'bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B]'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#10B981]" />
                <span>Giras & Festivales</span>
                {isTourReady && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" title="Requisitos de gira listos" />
                )}
              </button>
              <button
                id="nav-tab-awards"
                onClick={() => handleTabClick('awards')}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'awards'
                    ? 'bg-[#1C1C21] text-[#F4F0EA] border border-[#3F3F46]'
                    : 'bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B]'
                }`}
              >
                <Award className="w-3 h-3 text-[#F59E0B]" />
                <span>Premios & Gala</span>
                {hasActiveGala && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse shrink-0" title="Ceremonia en vivo" />
                )}
              </button>
              <button
                id="nav-tab-industry"
                onClick={() => handleTabClick('industry')}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'industry'
                    ? 'bg-[#1C1C21] text-[#F4F0EA] border border-[#3F3F46]'
                    : 'bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B]'
                }`}
              >
                <Building2 className="w-3 h-3 text-[#8E8E99]" />
                <span>Sellos & Mánagers</span>
              </button>
              <button
                id="nav-tab-lifestyle"
                onClick={() => handleTabClick('lifestyle')}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'lifestyle'
                    ? 'bg-[#1C1C21] text-[#F4F0EA] border border-[#3F3F46]'
                    : 'bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B]'
                }`}
              >
                <ShoppingBag className="w-3 h-3 text-[#FF2A4B]" />
                <span>Tienda & Lujo</span>
              </button>
              <button
                id="nav-tab-career"
                onClick={() => handleTabClick('career')}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'career'
                    ? 'bg-[#1C1C21] text-[#F4F0EA] border border-[#3F3F46]'
                    : 'bg-[#141417] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B]'
                }`}
              >
                <TrendingUp className="w-3 h-3 text-[#F59E0B]" />
                <span>Eras</span>
              </button>
            </>
          )}

          {/* Sub-pill de INICIO */}
          {activeHub === 'dashboard' && (
            <span className="text-3xs text-[#8E8E99] flex items-center gap-1 px-2 py-0.5 font-sans">
              <span>Panel Principal</span>
              <ChevronRight className="w-3 h-3 text-[#52525B]" />
              <span className="text-[#F4F0EA] font-medium">Estado y Decisiones</span>
            </span>
          )}
        </div>
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

