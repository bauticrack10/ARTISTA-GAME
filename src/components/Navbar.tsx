import React from 'react';
import { Artist, WorldState } from '../types';
import { TimeSystem } from '../systems/TimeSystem';
import {
  Flame,
  Zap,
  DollarSign,
  Users,
  TrendingUp,
  Sparkles,
  Play,
  FlaskConical,
  Save,
  Award,
  Disc3,
  BarChart3,
  Compass,
  Building2,
  Newspaper,
  Network,
  Home,
  UserPlus
} from 'lucide-react';

interface NavbarProps {
  player: Artist;
  world: WorldState;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onAdvanceMonth: () => void;
  onOpenSimLab: () => void;
  onOpenNewArtist: () => void;
  onReturnToTitle: () => void;
  onExportSave: () => void;
  onImportSave: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  player,
  world,
  currentTab,
  onTabChange,
  onAdvanceMonth,
  onOpenSimLab,
  onOpenNewArtist,
  onReturnToTitle,
  onExportSave,
  onImportSave
}) => {
  const monthName = TimeSystem.getMonthName(world.currentMonth);
  const yearsActive = TimeSystem.calculateCareerLengthYears(player.careerStartYear, world.currentYear);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100 shadow-xl">
      {/* Top Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900">
        {/* Brand & Date */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToTitle}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
            title="Volver al Menú Principal"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Disc3 className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div className="text-left">
              <span className="font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 text-base leading-none block">
                EL ARTISTA
              </span>
              <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase">
                Menú Principal
              </span>
            </div>
          </button>

          <div className="h-6 w-px bg-zinc-800" />

          {/* Time indicator */}
          <div className="flex items-center gap-2 bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-sm text-zinc-200">
              {monthName} {world.currentYear}
            </span>
            <span className="text-xs text-rose-400 font-mono font-bold">
              (Año {yearsActive + 1})
            </span>
          </div>
        </div>

        {/* Player Stats Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Energy */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800" title="Energía del Artista">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">Energía:</span>
            <span className="font-bold text-amber-300">{player.stats.energy}%</span>
          </div>

          {/* Hype */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800" title="Hype Actual en la Escena">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-zinc-400">Hype:</span>
            <span className="font-bold text-rose-300">{player.stats.hype}</span>
          </div>

          {/* Popularity */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800" title="Popularidad General (0-100)">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-zinc-400">Pop:</span>
            <span className="font-bold text-indigo-300">{player.stats.popularity}</span>
          </div>

          {/* Fans */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800" title="Comunidad de Fanáticos">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-bold text-teal-300">{player.stats.fansCount.toLocaleString()}</span>
          </div>

          {/* Funds */}
          <div className="flex items-center gap-1.5 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/60" title="Fondos Disponibles">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-emerald-300 font-mono">${player.stats.funds.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions (Advance, Test, Save, Return) */}
        <div className="flex items-center gap-2">
          <button
            id="btn-advance-month"
            onClick={onAdvanceMonth}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Avanzar Mes</span>
          </button>

          <button
            id="btn-nav-new-career"
            onClick={onOpenNewArtist}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Iniciar Nueva Carrera"
          >
            <UserPlus className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Nueva Carrera</span>
          </button>

          <button
            id="btn-open-sim-lab"
            onClick={onOpenSimLab}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Simulador de 10-100 Años y Tests"
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Sim Lab</span>
          </button>

          <button
            id="btn-export-save"
            onClick={onExportSave}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs transition-colors cursor-pointer"
            title="Exportar Partida (JSON)"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none text-xs font-medium">
        {[
          { id: 'dashboard', label: 'Inicio', icon: Compass },
          { id: 'studio', label: 'Estudio & Música', icon: Disc3 },
          { id: 'charts', label: 'Charts & Rankings', icon: BarChart3 },
          { id: 'tours', label: 'Giras & Shows', icon: Sparkles },
          { id: 'industry', label: 'Sellos & Industria', icon: Building2 },
          { id: 'relations', label: 'Artistas & Rivalidades', icon: Network },
          { id: 'career', label: 'Eras & Carrera', icon: TrendingUp },
          { id: 'news', label: 'Prensa & Noticias', icon: Newspaper },
          { id: 'awards', label: 'Premios & Gala', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
