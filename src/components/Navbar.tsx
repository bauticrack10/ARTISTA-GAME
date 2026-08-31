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
      className="sticky top-0 z-40 bg-[#0B0C10]/95 backdrop-blur-md border-b border-[#2A2E3D] text-[#F8FAFC]"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Fila 1: Logo + Tiempo actual + Botonera de Avance (CTA Principal) + Métricas Normalizadas */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4 border-b border-[#2A2E3D] overflow-x-auto scrollbar-none">
        
        {/* Izquierda: Logo ("EL ARTISTA") */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onReturnToTitle();
            }}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer text-left group"
            title="Volver al Menú Principal"
          >
            <div
              className="w-8 h-8 rounded-[8px] bg-gradient-to-tr from-[#8B5CF6] via-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
            >
              <Disc3 className="w-4.5 h-4.5 text-white animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-[-0.3px] text-[#F8FAFC] text-xs leading-none flex items-center gap-1.5">
                EL ARTISTA
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/40">
                  PRO
                </span>
              </span>
              <span className="text-[9px] text-[#94A3B8] tracking-wider uppercase leading-tight mt-0.5">
                Simulador Musical
              </span>
            </div>
          </button>
        </div>

        {/* Centro: Indicador de Tiempo actual + Botonera de avance */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Selector de Tiempo Condensado */}
          <div
            className="flex items-center gap-2 bg-[#16181F] px-3 py-1.5 rounded-[8px] border border-[#2A2E3D] text-xs shadow-xs whitespace-nowrap"
            title={`Fecha actual en la industria: ${monthName} ${currentYear} • ${semesterShort}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ring-2 ring-emerald-400/30" />
            <span className="font-bold text-[#F8FAFC]">
              {monthName} {currentYear}
            </span>
            <span className="text-[#94A3B8] font-medium hidden sm:inline">
              • {semesterShort}
            </span>
          </div>

          {/* Botonera de Simulación / Avance Integrada como CTA Principal */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle 6M / 1Y */}
            <div className="flex items-center bg-[#16181F] p-0.5 rounded-[6px] text-xs font-semibold border border-[#2A2E3D]">
              <button
                onClick={() => {
                  playSound('click');
                  setCycleMonths(6);
                }}
                className={`px-2.5 py-1 rounded-[4px] transition-all cursor-pointer text-xs ${
                  cycleMonths === 6
                    ? 'bg-[#8B5CF6] text-white shadow-xs font-bold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
                className={`px-2.5 py-1 rounded-[4px] transition-all cursor-pointer text-xs ${
                  cycleMonths === 12
                    ? 'bg-[#8B5CF6] text-white shadow-xs font-bold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
              className="group relative flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] hover:from-[#6D28D9] hover:via-[#7C3AED] hover:to-[#DB2777] text-white px-4 py-1.5 rounded-[8px] text-xs font-bold cursor-pointer active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(124,58,237,0.35)] shrink-0 border border-white/20"
              title={`Avanzar ciclo de ${cycleMonths === 6 ? '6 meses (1 Semestre)' : '1 año (2 Semestres)'} y simular lanzamientos, charts y eventos`}
            >
              <Play className="w-3.5 h-3.5 fill-white text-white group-hover:scale-110 transition-transform shrink-0" />
              <span className="tracking-tight font-semibold">
                Avanzar Ciclo ({cycleMonths === 6 ? '+6M' : '+1Y'})
              </span>
            </button>
          </div>
        </div>

        {/* Derecha: Píldoras de recursos indispensables (Fondos, Fans, Energía) */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          {/* Dinero / Fondos */}
          <div
            className="flex items-center flex-row gap-1 bg-[#16181F] border border-emerald-500/30 px-2.5 py-1 rounded-[8px] text-xs shadow-xs text-emerald-400"
            title={`Fondos Monetarios Disponibles: ${formatMoney(playerFunds)}`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-400 font-mono whitespace-nowrap">
              {formatMoney(playerFunds)}
            </span>
            <span className="text-[10px] text-emerald-500/80 font-sans hidden lg:inline">
              Fondos
            </span>
          </div>

          {/* Comunidad de Fans (formateado explícitamente como "4.15k Fans" / "150 Fans") */}
          <div
            className="flex items-center gap-1.5 bg-[#16181F] border border-[#8B5CF6]/30 px-2.5 py-1 rounded-[8px] text-xs shadow-xs text-[#C084FC]"
            title={`Comunidad de Fans Activos: ${playerFans.toLocaleString('es-AR')} fans`}
          >
            <Users className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
            <span className="font-bold text-[#C084FC] font-mono">
              {formatFans(playerFans)}
            </span>
          </div>

          {/* Energía Vital con micro-barra */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] border text-xs shadow-xs ${energyStyle.bg}`}
            title={`Energía Vital del Artista: ${playerEnergy}% • ${
              playerEnergy < 85 ? 'Giras Bloqueadas: Requiere ≥85%' : 'Giras Habilitadas'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 shrink-0 ${energyStyle.icon}`} />
            <span className="font-bold font-mono text-[#F8FAFC]">{playerEnergy}%</span>
            <span className="text-[10px] text-[#94A3B8] font-sans hidden sm:inline">Energía</span>
            <div className="w-5 sm:w-6 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0 hidden sm:block">
              <div
                className={`h-full rounded-full transition-all duration-300 ${energyStyle.bar}`}
                style={{ width: `${Math.min(100, Math.max(0, playerEnergy))}%` }}
              />
            </div>
          </div>

          {/* Badge Prodigio */}
          {player?.isProdigy && (
            <div
              className="hidden 2xl:flex items-center gap-1 bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/40 px-2 py-1 rounded-[8px] text-[11px] font-bold shadow-xs"
              title="Rasgo: Promesa / Prodigio • x3 Ganancia permanente en progreso"
            >
              <Crown className="w-3 h-3 text-[#F59E0B] fill-current shrink-0" />
              <span>x3 PRODIGIO</span>
            </div>
          )}

          {/* Control de Audio / SFX Engine */}
          <div className="flex items-center gap-1.5 bg-[#16181F] border border-[#2A2E3D] hover:border-[#8B5CF6]/40 p-1 rounded-[8px] transition-colors">
            <button
              id="btn-toggle-audio-sfx"
              onClick={handleToggleSound}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-[6px] transition-all cursor-pointer text-xs font-semibold ${
                soundEnabled
                  ? 'bg-[#8B5CF6]/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                  : 'bg-[#0B0C10] text-[#64748B] border border-transparent hover:text-[#94A3B8]'
              }`}
              title={soundEnabled ? 'Silenciar Efectos de Sonido (Mute)' : 'Activar Efectos de Sonido (Unmute)'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              )}
              <span className="hidden md:inline text-[11px]">
                {soundEnabled ? 'SFX' : 'MUTE'}
              </span>
            </button>

            {/* Audio Reactive Equalizer Bars */}
            <div className="px-1 py-0.5 flex items-center" title={soundEnabled ? 'Equalizador de audio' : 'Audio Silenciado'}>
              <AudioEqualizer isPlaying={soundEnabled} />
            </div>
          </div>

          {/* Perfil Rápido del Jugador */}
          <button
            onClick={() => handleTabClick('dashboard')}
            className="flex items-center gap-2 pl-1 pr-2 sm:pr-2.5 py-1 rounded-[8px] bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] hover:border-[#8B5CF6]/40 text-xs transition-colors cursor-pointer shrink-0 shadow-xs"
            title={`Perfil de ${playerName} • Ir al Inicio`}
          >
            <ArtistAvatar
              name={playerName}
              avatarColor={player?.avatarColor}
              avatarIcon={player?.avatarIcon}
              size="xs"
              rounded="rounded-[4px]"
            />
            <span className="font-semibold text-[#F8FAFC] max-w-[80px] sm:max-w-[110px] truncate">
              {playerName}
            </span>
          </button>
        </div>
      </div>

      {/* Fila 2: Menú de Navegación Horizontal */}
      <nav className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none text-xs font-normal scroll-smooth">
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#8B5CF6]/25 to-[#EC4899]/25 border border-[#8B5CF6]/60 text-[#F8FAFC] font-bold shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#16181F]/70 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C084FC]' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
