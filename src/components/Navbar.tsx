import React, { useState } from 'react';
import { Artist, WorldState } from '../types';
import { TimeSystem } from '../systems/TimeSystem';
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
  Crown
} from 'lucide-react';

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
  const monthName = TimeSystem.getMonthName(world.currentMonth);
  const semesterShort = world.currentMonth <= 6 ? '1er Semestre' : '2do Semestre';

  const getEnergyBadge = () => {
    if (player.stats.energy >= 85) {
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
        icon: 'text-emerald-600',
        bar: 'bg-emerald-500'
      };
    } else if (player.stats.energy >= 40) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-950',
        icon: 'text-amber-600',
        bar: 'bg-amber-500'
      };
    }
    return {
      bg: 'bg-rose-50 border-rose-200 text-rose-950',
      icon: 'text-rose-600',
      bar: 'bg-rose-500'
    };
  };

  const energyStyle = getEnergyBadge();

  return (
    <header
      className="sticky top-0 z-40 bg-[#f7f4ed]/95 backdrop-blur-md border-b border-[#eceae4] text-[#1c1c1c]"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Fila 1: Logo + Selector de Tiempo + Botonera de Avance (CTA Principal) + Píldoras de Recursos Vitales */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4 border-b border-[#eceae4] overflow-x-auto scrollbar-none">
        
        {/* Izquierda: Logo ("EL ARTISTA") con enlace al Menú Principal */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onReturnToTitle}
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer text-left group"
            title="Volver al Menú Principal"
          >
            <div
              className="w-8 h-8 rounded-[8px] bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 text-[#fcfbf8] flex items-center justify-center shrink-0 shadow-xs"
              style={{
                boxShadow:
                  'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
              }}
            >
              <Disc3 className="w-4.5 h-4.5 text-white animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold tracking-[-0.3px] text-[#1c1c1c] text-xs leading-none flex items-center gap-1.5">
                EL ARTISTA
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  PRO
                </span>
              </span>
              <span className="text-[9px] text-[#5f5f5d] tracking-wider uppercase leading-tight mt-0.5">
                Simulador Musical
              </span>
            </div>
          </button>
        </div>

        {/* Centro: Indicador de Tiempo actual (`Enero 2026 • 1er Semestre`) + Botonera de avance integrada */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Selector de Tiempo Condensado */}
          <div
            className="flex items-center gap-2 bg-[#fcfbf8] px-3 py-1.5 rounded-[8px] border border-[#eceae4] text-xs shadow-2xs whitespace-nowrap"
            title={`Fecha actual: ${monthName} ${world.currentYear} (${semesterShort})`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ring-2 ring-emerald-200" />
            <span className="font-semibold text-[#1c1c1c]">
              {monthName} {world.currentYear}
            </span>
            <span className="text-[#5f5f5d] font-medium hidden sm:inline">
              • {semesterShort}
            </span>
          </div>

          {/* Botonera de Simulación / Avance Integrada como CTA Principal */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle 6M / 1Y */}
            <div className="flex items-center bg-[#eceae4] p-0.5 rounded-[6px] text-xs font-semibold">
              <button
                onClick={() => setCycleMonths(6)}
                className={`px-2.5 py-1 rounded-[4px] transition-all cursor-pointer text-xs ${
                  cycleMonths === 6
                    ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-2xs'
                    : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
                }`}
                title="Simular 6 Meses (1 Semestre)"
              >
                6M
              </button>
              <button
                onClick={() => setCycleMonths(12)}
                className={`px-2.5 py-1 rounded-[4px] transition-all cursor-pointer text-xs ${
                  cycleMonths === 12
                    ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-2xs'
                    : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
                }`}
                title="Simular 1 Año Completo"
              >
                1Y
              </button>
            </div>

            {/* Botón de Acción Principal (Avanzar Ciclo) */}
            <button
              id="btn-advance-cycle"
              onClick={() => onAdvanceCycle(cycleMonths)}
              className="group relative flex items-center gap-2 bg-[#1c1c1c] hover:bg-neutral-900 text-[#fcfbf8] px-4 py-1.5 rounded-[8px] text-xs font-semibold cursor-pointer active:scale-[0.98] transition-all shadow-sm shrink-0 border border-neutral-800"
              style={{
                boxShadow:
                  'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.08) 0px 1px 3px 0px'
              }}
              title={`Avanzar ciclo de ${cycleMonths === 6 ? '6 meses' : '1 año'} y simular lanzamientos, charts y eventos`}
            >
              <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="tracking-tight">
                Avanzar Ciclo (+{cycleMonths === 6 ? '6M' : '1Y'})
              </span>
            </button>
          </div>
        </div>

        {/* Derecha: Píldoras compactas de recursos indispensables (Oyentes, Energía, Fondos, Fans, Avatar) */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          {/* Oyentes Mensuales Pill */}
          <div
            className="hidden xl:flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-300/80 px-2.5 py-1 rounded-[8px] text-xs shadow-2xs text-emerald-950"
            title={`Oyentes Mensuales en Plataformas: ${player.stats.monthlyListeners.toLocaleString()}`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-[11px] font-semibold text-emerald-900 font-mono">
              {player.stats.monthlyListeners >= 1_000_000
                ? `${(player.stats.monthlyListeners / 1_000_000).toFixed(1)}M`
                : player.stats.monthlyListeners >= 1_000
                ? `${(player.stats.monthlyListeners / 1_000).toFixed(0)}K`
                : player.stats.monthlyListeners}{' '}
              <span className="text-emerald-700 font-sans text-[10px]">oyentes</span>
            </span>
          </div>

          {/* Energía Vital con micro-barra */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] border text-xs shadow-2xs ${energyStyle.bg}`}
            title={`Energía Vital: ${player.stats.energy}% ${
              player.stats.energy < 85 ? '(Giras Bloqueadas <85%)' : '(Giras Habilitadas)'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 shrink-0 ${energyStyle.icon}`} />
            <span className="font-semibold font-mono">{player.stats.energy}%</span>
            <div className="w-5 sm:w-6 h-1.5 bg-black/10 rounded-full overflow-hidden shrink-0 hidden sm:block">
              <div
                className={`h-full rounded-full transition-all duration-300 ${energyStyle.bar}`}
                style={{ width: `${Math.min(100, Math.max(0, player.stats.energy))}%` }}
              />
            </div>
          </div>

          {/* Dinero / Fondos */}
          <div
            className="flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-200/80 px-2.5 py-1 rounded-[8px] text-xs shadow-2xs text-emerald-950"
            title={`Fondos Monetarios Disponibles: $${player.stats.funds.toLocaleString()}`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-semibold text-emerald-950 font-mono">
              ${player.stats.funds.toLocaleString()}
            </span>
          </div>

          {/* Seguidores / Fans */}
          <div
            className="flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-200/80 px-2.5 py-1 rounded-[8px] text-xs shadow-2xs text-indigo-950"
            title={`Comunidad de Fans Activos: ${player.stats.fansCount.toLocaleString()}`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
            <span className="font-semibold text-indigo-950 font-mono">
              {player.stats.fansCount >= 1_000_000
                ? `${(player.stats.fansCount / 1_000_000).toFixed(1)}M`
                : player.stats.fansCount.toLocaleString()}
            </span>
          </div>

          {/* Badge Prodigio (opcional si aplica) */}
          {player.isProdigy && (
            <div
              className="hidden 2xl:flex items-center gap-1 bg-amber-100 text-amber-950 border border-amber-300 px-2 py-1 rounded-[8px] text-[11px] font-bold shadow-2xs"
              title="Rasgo: Promesa / Prodigio • x3 Ganancia permanente"
            >
              <Crown className="w-3 h-3 text-amber-800 fill-current shrink-0" />
              <span>x3 PRODIGIO</span>
            </div>
          )}

          {/* Perfil Rápido del Jugador */}
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2 pl-1 pr-2 sm:pr-2.5 py-1 rounded-[8px] bg-[#fcfbf8] hover:bg-[#eceae4] border border-[#eceae4] text-xs transition-colors cursor-pointer shrink-0 shadow-2xs"
            title={`Perfil de ${player.name} • Ir a Inicio`}
          >
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={player.name}
                className="w-5 h-5 rounded-[4px] object-cover border border-[#eceae4] shrink-0"
              />
            ) : (
              <div
                className={`w-5 h-5 rounded-[4px] bg-gradient-to-tr ${
                  player.avatarColor || 'from-amber-500 to-rose-600'
                } text-[#fcfbf8] font-bold text-[10px] flex items-center justify-center shrink-0`}
              >
                {player.name.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-[#1c1c1c] max-w-[80px] sm:max-w-[110px] truncate">
              {player.name}
            </span>
          </button>
        </div>
      </div>

      {/* Fila 2: Menú de Navegación Horizontal con Scroll Suave */}
      <nav className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none text-xs font-normal scroll-smooth">
        {[
          { id: 'dashboard', label: 'Inicio', icon: Compass, color: 'text-amber-600' },
          { id: 'studio', label: 'Estudio & Música', icon: Disc3, color: 'text-purple-600' },
          { id: 'lifestyle', label: 'Tienda & Estilo de Vida', icon: ShoppingBag, color: 'text-pink-600' },
          { id: 'charts', label: 'Charts & Rankings', icon: BarChart3, color: 'text-blue-600' },
          { id: 'tours', label: 'Giras & Shows', icon: Sparkles, color: 'text-emerald-600' },
          { id: 'industry', label: 'Sellos & Managers', icon: Building2, color: 'text-indigo-600' },
          { id: 'relations', label: 'Artistas & Rivalidades', icon: Network, color: 'text-cyan-600' },
          { id: 'career', label: 'Eras & Trayectoria', icon: TrendingUp, color: 'text-orange-600' },
          { id: 'awards', label: 'Premios & Gala', icon: Award, color: 'text-yellow-600' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1c1c1c] text-[#fcfbf8] font-semibold shadow-sm ring-1 ring-black/10'
                  : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#eceae4]'
              }`}
              style={
                isActive
                  ? {
                      boxShadow:
                        'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                    }
                  : {}
              }
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#fcfbf8]' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
