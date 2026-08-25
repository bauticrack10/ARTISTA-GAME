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
  UserPlus,
  ShoppingBag,
  Crown
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
    <header className="sticky top-0 z-40 bg-[#f7f4ed]/95 backdrop-blur-md border-b border-[#eceae4] text-[#1c1c1c]">
      {/* Top Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#eceae4]/70">
        {/* Brand & Date */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToTitle}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
            title="Volver al Menú Principal"
          >
            <div
              className="w-8 h-8 rounded-[6px] bg-[#1c1c1c] text-[#fcfbf8] flex items-center justify-center"
              style={{
                boxShadow:
                  'rgba(0,0,0,0) 0px 0px 0px 0px, rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
              }}
            >
              <Disc3 className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="text-left">
              <span
                className="font-semibold tracking-[-0.4px] text-[#1c1c1c] text-sm leading-none block"
                style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
              >
                EL ARTISTA
              </span>
              <span className="text-[10px] text-[#5f5f5d] tracking-normal uppercase">
                Menú Principal
              </span>
            </div>
          </button>

          <div className="h-5 w-px bg-[#eceae4]" />

          {/* Time indicator */}
          <div className="flex items-center gap-2 bg-[#fcfbf8] px-3 py-1 rounded-[6px] border border-[#eceae4] text-xs shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#1c1c1c]" />
            <span className="font-semibold text-[#1c1c1c]">
              {monthName} {world.currentYear}
            </span>
            <span className="text-[#5f5f5d] font-mono">
              (Año {yearsActive + 1})
            </span>
          </div>
        </div>

        {/* Player Stats Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Prodigy Badge if active */}
          {player.isProdigy && (
            <div
              className="flex items-center gap-1.5 bg-[#1c1c1c] text-[#fcfbf8] px-2.5 py-1 rounded-[6px] font-semibold text-xs shadow-sm"
              title="Rasgo: Promesa / Prodigio (1 en 100.000) • x3 Progreso permanente"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Prodigio x3</span>
            </div>
          )}

          {/* Energy */}
          <div className="flex items-center gap-1.5 bg-[#fcfbf8] px-2.5 py-1 rounded-[6px] border border-[#eceae4] shadow-sm" title="Energía del Artista">
            <Zap className="w-3.5 h-3.5 text-[#1c1c1c]" />
            <span className="text-[#5f5f5d]">Energía:</span>
            <span className="font-semibold text-[#1c1c1c] font-mono">{player.stats.energy}%</span>
          </div>

          {/* Hype */}
          <div className="flex items-center gap-1.5 bg-[#fcfbf8] px-2.5 py-1 rounded-[6px] border border-[#eceae4] shadow-sm" title="Hype Actual en la Escena">
            <Flame className="w-3.5 h-3.5 text-[#1c1c1c]" />
            <span className="text-[#5f5f5d]">Hype:</span>
            <span className="font-semibold text-[#1c1c1c] font-mono">{player.stats.hype}</span>
          </div>

          {/* Popularity */}
          <div className="flex items-center gap-1.5 bg-[#fcfbf8] px-2.5 py-1 rounded-[6px] border border-[#eceae4] shadow-sm" title="Popularidad General (0-100)">
            <TrendingUp className="w-3.5 h-3.5 text-[#1c1c1c]" />
            <span className="text-[#5f5f5d]">Pop:</span>
            <span className="font-semibold text-[#1c1c1c] font-mono">{player.stats.popularity}</span>
          </div>

          {/* Fans */}
          <div className="flex items-center gap-1.5 bg-[#fcfbf8] px-2.5 py-1 rounded-[6px] border border-[#eceae4] shadow-sm" title="Comunidad de Fanáticos">
            <Users className="w-3.5 h-3.5 text-[#1c1c1c]" />
            <span className="font-semibold text-[#1c1c1c] font-mono">{player.stats.fansCount.toLocaleString()}</span>
          </div>

          {/* Funds */}
          <div className="flex items-center gap-1.5 bg-[#fcfbf8] px-2.5 py-1 rounded-[6px] border border-[#eceae4] shadow-sm" title="Fondos Disponibles">
            <DollarSign className="w-3.5 h-3.5 text-[#1c1c1c]" />
            <span className="font-semibold text-[#1c1c1c] font-mono">${player.stats.funds.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions (Advance, Test, Save, Return) */}
        <div className="flex items-center gap-2">
          <button
            id="btn-advance-month"
            onClick={onAdvanceMonth}
            className="flex items-center gap-2 bg-[#1c1c1c] text-[#fcfbf8] px-3.5 py-1.5 rounded-[6px] text-xs font-semibold cursor-pointer hover:opacity-80 active:opacity-75 transition-opacity"
            style={{
              boxShadow:
                'rgba(0,0,0,0) 0px 0px 0px 0px, rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
            }}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Avanzar Mes</span>
          </button>

          <button
            id="btn-nav-new-career"
            onClick={onOpenNewArtist}
            className="flex items-center gap-1.5 bg-[#fcfbf8] border border-[#eceae4] text-[#1c1c1c] px-3 py-1.5 rounded-[6px] text-xs shadow-sm hover:bg-[#eceae4] cursor-pointer transition-colors"
            title="Iniciar Nueva Carrera"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva Carrera</span>
          </button>

          <button
            id="btn-open-sim-lab"
            onClick={onOpenSimLab}
            className="flex items-center gap-1.5 bg-[#fcfbf8] border border-[#eceae4] text-[#1c1c1c] px-3 py-1.5 rounded-[6px] text-xs shadow-sm hover:bg-[#eceae4] cursor-pointer transition-colors"
            title="Simulador de 10-100 Años y Tests"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sim Lab</span>
          </button>

          <button
            id="btn-export-save"
            onClick={onExportSave}
            className="p-1.5 bg-[#fcfbf8] hover:bg-[#eceae4] border border-[#eceae4] text-[#1c1c1c] rounded-[6px] text-xs transition-colors cursor-pointer shadow-sm"
            title="Exportar Partida (JSON)"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none text-xs font-normal">
        {[
          { id: 'dashboard', label: 'Inicio', icon: Compass },
          { id: 'studio', label: 'Estudio & Música', icon: Disc3 },
          { id: 'lifestyle', label: 'Tienda & Estilo de Vida', icon: ShoppingBag },
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1c1c1c] text-[#fcfbf8] font-semibold'
                  : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#eceae4]'
              }`}
              style={
                isActive
                  ? {
                      boxShadow:
                        'rgba(0,0,0,0) 0px 0px 0px 0px, rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                    }
                  : {}
              }
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#fcfbf8]' : 'text-[#5f5f5d]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
