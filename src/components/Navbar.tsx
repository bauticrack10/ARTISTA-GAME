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
  ChevronRight
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
}

type HubId = 'dashboard' | 'music' | 'world' | 'career';

export const Navbar: React.FC<NavbarProps> = ({
  player,
  world,
  currentTab,
  onTabChange,
  onAdvanceCycle,
  onReturnToTitle,
  onOpenPhone
}) => {
  const [cycleMonths, setCycleMonths] = useState<1 | 3 | 6 | 12>(1);
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
  const playerName = player?.name || 'Artista';

  const getEnergyBadge = () => {
    if (playerEnergy >= 75) {
      return {
        bg: 'bg-white/[0.03] border-white/10 text-slate-200',
        bar: 'bg-emerald-400'
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
      className="sticky top-0 z-40 bg-[#0B0C10]/95 backdrop-blur-xl border-b border-[#1E2230] text-fg select-none"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* =========================================================================
          FILA 1: Top Bar (Logo + Simulación de Tiempo + Recursos Pacificados)
         ========================================================================= */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 border-b border-[#181B26]">
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary via-[#A855F7] to-accent text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.35)]">
              <Disc3 className="w-4.5 h-4.5 text-white animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white text-xs leading-none flex items-center gap-1.5">
                EL ARTISTA
                <span className="hidden sm:inline text-3xs font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-soft border border-primary/30">
                  PRO
                </span>
              </span>
              <span className="hidden sm:block text-3xs text-slate-400 tracking-wider uppercase leading-tight mt-0.5">
                Career Simulator
              </span>
            </div>
          </button>
        </div>

        {/* Centro: Indicador de Tiempo y Botonera de Simulación */}
        <div className="order-last md:order-none w-full md:w-auto flex items-center gap-2 md:shrink-0 justify-center">
          {/* Fecha en el Juego */}
          <div
            className="flex items-center gap-2 bg-[#14161F] px-3 py-1.5 rounded-lg border border-[#252A3A] text-xs shadow-xs whitespace-nowrap"
            title={`Fecha actual: ${monthName} ${currentYear} • ${semesterShort}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ring-2 ring-emerald-400/20" />
            <span className="font-bold text-slate-100">
              {monthName} {currentYear}
            </span>
            <span className="text-slate-400 text-3xs font-medium hidden sm:inline">
              • {semesterShort}
            </span>
          </div>

          {/* Selector de Velocidad (1M / 3M / 6M / 1Y) */}
          <div className="flex items-center bg-[#14161F] p-0.5 rounded-lg text-xs font-semibold border border-[#252A3A]">
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
                className={`min-h-8 px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs font-semibold ${
                  cycleMonths === opt.val
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                title={opt.title}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Botón de Acción Principal (Avanzar) */}
          <button
            id="btn-advance-cycle"
            onClick={() => {
              playSound('click');
              onAdvanceCycle(cycleMonths);
            }}
            className="tap group relative flex items-center gap-2 bg-gradient-to-r from-primary-strong via-primary to-accent hover:from-[#6D28D9] hover:via-primary-strong hover:to-[#DB2777] text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer active:scale-98 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] border border-white/20 whitespace-nowrap"
            title={`Avanzar ciclo de ${cycleMonths === 1 ? '1 mes' : cycleMonths === 3 ? '3 meses' : cycleMonths === 6 ? '6 meses' : '1 año'}`}
          >
            <Play className="w-3.5 h-3.5 fill-white text-white group-hover:scale-110 transition-transform shrink-0" />
            <span>Avanzar ({cycleMonths === 1 ? '+1M' : cycleMonths === 3 ? '+3M' : cycleMonths === 6 ? '+6M' : '+1Y'})</span>
          </button>
        </div>

        {/* Derecha: Recursos Pacificados (Obsidian Elegante) + Teléfono + Perfil */}
        <div className="flex items-center gap-2 text-xs shrink-0 ml-auto md:ml-0">
          {/* Dinero / Fondos */}
          <div
            className="flex items-center gap-1.5 bg-[#14161F] border border-[#252A3A] px-2.5 py-1 rounded-lg text-xs shadow-xs text-slate-200"
            title={`Fondos: ${formatMoney(playerFunds)}`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold font-mono text-emerald-400">{formatMoney(playerFunds)}</span>
          </div>

          {/* Fans */}
          <div
            className="flex items-center gap-1.5 bg-[#14161F] border border-[#252A3A] px-2.5 py-1 rounded-lg text-xs shadow-xs text-slate-200"
            title={`Fans activos: ${playerFans.toLocaleString('es-AR')}`}
          >
            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-bold font-mono text-primary-soft">{formatFans(playerFans)}</span>
          </div>

          {/* Energía con micro-barra */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs shadow-xs ${energyStyle.bg}`}
            title={`Energía: ${playerEnergy}%`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold font-mono">{playerEnergy}%</span>
            <div className="w-6 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0 hidden sm:block">
              <div
                className={`h-full rounded-full transition-all duration-300 ${energyStyle.bar}`}
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
            className="tap relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14161F] hover:bg-[#1C1F2B] border border-[#252A3A] hover:border-primary/50 text-xs transition-colors cursor-pointer shrink-0 shadow-xs text-primary-soft group"
            title="Abrir Smartphone (DMs, TrendX y Banco)"
          >
            <Smartphone className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden md:inline font-semibold text-slate-200">Teléfono</span>
            {(world?.unreadPhoneCount ?? 0) > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-white text-3xs font-bold flex items-center justify-center animate-pulse shadow-sm">
                {world.unreadPhoneCount}
              </span>
            )}
          </button>

          {/* Control de Audio / SFX */}
          <div className="flex items-center gap-1 bg-[#14161F] border border-[#252A3A] p-1 rounded-lg">
            <button
              id="btn-toggle-audio-sfx"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              className={`p-1 rounded-md transition-all cursor-pointer ${
                soundEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Efectos de Sonido'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <div className="hidden lg:block px-1">
              <AudioEqualizer isPlaying={soundEnabled} />
            </div>
          </div>

          {/* Perfil del Artista */}
          <button
            onClick={() => handleTabClick('dashboard')}
            className="tap hidden sm:flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg bg-[#14161F] hover:bg-[#1C1F2B] border border-[#252A3A] text-xs transition-colors cursor-pointer shrink-0"
            title={`Perfil de ${playerName} • Ir al Inicio`}
          >
            <ArtistAvatar
              name={playerName}
              avatarColor={player?.avatarColor}
              avatarIcon={player?.avatarIcon}
              size="xs"
              rounded="rounded-sm"
            />
            <span className="font-semibold text-slate-200 max-w-[85px] truncate">
              {playerName}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          FILA 2: Los 3 Grandes Hubs Principales + Inicio (Minimalista & Amplio)
         ========================================================================= */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* 4 Grandes Botones de Hub */}
        <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x">
          {/* 1. INICIO */}
          <button
            id="nav-tab-dashboard"
            onClick={() => handleTabClick('dashboard')}
            className={`tap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              currentTab === 'dashboard'
                ? 'bg-primary/20 border border-primary/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <Compass className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-primary-soft' : 'text-slate-400'}`} />
            <span>Inicio</span>
          </button>

          {/* 2. HUB: MÚSICA & ESTUDIO */}
          <button
            id="nav-tab-studio"
            onClick={() => handleTabClick('studio')}
            className={`tap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'music'
                ? 'bg-primary/20 border border-primary/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <Disc3 className={`w-4 h-4 ${activeHub === 'music' ? 'text-primary-soft' : 'text-slate-400'}`} />
            <span>Música & Estudio</span>
          </button>

          {/* 3. HUB: EL MUNDO & REDES */}
          <button
            id="nav-hub-world"
            onClick={() => handleTabClick('streaming')}
            className={`tap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'world'
                ? 'bg-primary/20 border border-primary/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeHub === 'world' ? 'text-primary-soft' : 'text-slate-400'}`} />
            <span>El Mundo & Redes</span>
          </button>

          {/* 4. HUB: CARRERA & ESCENA */}
          <button
            id="nav-hub-career"
            onClick={() => handleTabClick('tours')}
            className={`tap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeHub === 'career'
                ? 'bg-primary/20 border border-primary/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeHub === 'career' ? 'text-primary-soft' : 'text-slate-400'}`} />
            <span>Carrera & Escena</span>
          </button>
        </div>

        {/* Sub-Navegación Contextual (Píldoras Limpias del Hub Activo) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x pt-1 md:pt-0 border-t md:border-t-0 border-[#1A1D29]">
          {/* Sub-pills de MÚSICA */}
          {activeHub === 'music' && (
            <>
              <button
                onClick={() => handleTabClick('studio_single')}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Music2 className="w-3 h-3 text-primary-soft" />
                <span>Grabar Single</span>
              </button>
              <button
                onClick={() => handleTabClick('studio_album')}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Layers className="w-3 h-3 text-accent" />
                <span>Grabar Álbum / EP</span>
              </button>
              <button
                onClick={() => handleTabClick('catalog')}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Disc3 className="w-3 h-3 text-cyan-400" />
                <span>Mi Catálogo</span>
              </button>
            </>
          )}

          {/* Sub-pills de EL MUNDO */}
          {activeHub === 'world' && (
            <>
              <button
                id="nav-tab-streaming"
                onClick={() => handleTabClick('streaming')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'streaming'
                    ? 'bg-primary/20 text-white border border-primary/50'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Radio className="w-3 h-3 text-primary-soft" />
                <span>Streaming & Redes</span>
              </button>
              <button
                id="nav-tab-charts"
                onClick={() => handleTabClick('charts')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'charts'
                    ? 'bg-primary/20 text-white border border-primary/50'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <BarChart3 className="w-3 h-3 text-blue-400" />
                <span>Charts & Rankings</span>
              </button>
              <button
                id="nav-tab-relations"
                onClick={() => handleTabClick('relations')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'relations'
                    ? 'bg-primary/20 text-white border border-primary/50'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Network className="w-3 h-3 text-cyan-400" />
                <span>Artistas & Feuds</span>
              </button>
            </>
          )}

          {/* Sub-pills de CARRERA */}
          {activeHub === 'career' && (
            <>
              <button
                id="nav-tab-tours"
                onClick={() => handleTabClick('tours')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'tours'
                    ? 'bg-primary/20 text-white border border-primary/50'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Giras & Festivales</span>
              </button>
              <button
                id="nav-tab-awards"
                onClick={() => handleTabClick('awards')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'awards'
                    ? 'bg-primary/20 text-white border border-primary/50'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Award className="w-3 h-3 text-yellow-400" />
                <span>Premios & Gala</span>
              </button>
              <button
                id="nav-tab-industry"
                onClick={() => handleTabClick('industry')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'industry'
                    ? 'bg-primary/20 text-white border border-primary/50'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Building2 className="w-3 h-3 text-indigo-400" />
                <span>Sellos & Mánagers</span>
              </button>
              <button
                id="nav-tab-lifestyle"
                onClick={() => handleTabClick('lifestyle')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'lifestyle'
                    ? 'bg-primary/20 text-white border border-primary/50'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <ShoppingBag className="w-3 h-3 text-pink-400" />
                <span>Tienda & Lujo</span>
              </button>
              <button
                id="nav-tab-career"
                onClick={() => handleTabClick('career')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'career'
                    ? 'bg-primary/20 text-white border border-primary/50'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span>Eras</span>
              </button>
            </>
          )}

          {/* Sub-pill de INICIO */}
          {activeHub === 'dashboard' && (
            <span className="text-3xs text-slate-400 flex items-center gap-1 px-2 py-0.5">
              <span>Panel Principal</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="text-white font-medium">Estado y Decisiones</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
