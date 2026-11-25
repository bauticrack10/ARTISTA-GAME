import React from 'react';
import {
  BarChart3,
  Radio,
  Network,
  Plane,
  Building2,
  ShoppingBag,
  TrendingUp,
  Trophy
} from 'lucide-react';
import { playSound } from '../../utils/audioSystem';

export type SectionHub = 'escena' | 'carrera' | 'legado';

export interface SectionSubNavProps {
  hub: SectionHub;
  activeTab: string;
  onNavigate?: (tab: string) => void;
  pendingCollabCount?: number;
  pendingFestivalsCount?: number;
  awardsCount?: number;
  className?: string;
}

interface SubNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const SectionSubNav: React.FC<SectionSubNavProps> = ({
  hub,
  activeTab,
  onNavigate,
  pendingCollabCount = 0,
  pendingFestivalsCount = 0,
  awardsCount = 0,
  className = ''
}) => {
  const itemsByHub: Record<SectionHub, SubNavItem[]> = {
    escena: [
      { id: 'charts', label: 'Charts', icon: BarChart3 },
      { id: 'streaming', label: 'Streaming & Promo', icon: Radio },
      {
        id: 'relations',
        label: 'Colegas & Feudos',
        icon: Network,
        badge: pendingCollabCount > 0 ? pendingCollabCount : undefined
      }
    ],
    carrera: [
      {
        id: 'tours',
        label: 'Giras & Festivales',
        icon: Plane,
        badge: pendingFestivalsCount > 0 ? pendingFestivalsCount : undefined
      },
      { id: 'industry', label: 'Sellos & Mánagers', icon: Building2 },
      { id: 'lifestyle', label: 'Estudio & Tienda', icon: ShoppingBag }
    ],
    legado: [
      { id: 'career', label: 'Eras & Trayectoria', icon: TrendingUp },
      {
        id: 'awards',
        label: 'Premios & Discos',
        icon: Trophy,
        badge: awardsCount > 0 ? awardsCount : undefined
      }
    ]
  };

  const items = itemsByHub[hub] || [];
  const canNavigate = typeof onNavigate === 'function';

  return (
    <nav
      aria-label={`Subnavegación de ${hub}`}
      className={`bg-[#111114] border border-[#242429] rounded-[8px] p-1.5 flex items-center gap-1.5 overflow-x-auto scroll-fade-x ${className}`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isDisabled = !canNavigate && !isActive;

        return (
          <button
            key={item.id}
            type="button"
            disabled={isDisabled}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              if (!canNavigate || isActive) return;
              playSound('click');
              onNavigate(item.id);
            }}
            title={isDisabled ? 'Usa la barra superior para cambiar de sección' : item.label}
            className={`tap shrink-0 px-3.5 py-2 rounded-[6px] text-xs font-sans transition-all flex items-center gap-2 whitespace-nowrap ${
              isActive
                ? 'bg-[#FF4F00] text-white font-bold'
                : isDisabled
                ? 'bg-[#18181C]/60 text-[#52525B] border border-transparent cursor-not-allowed opacity-60'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#18181C] border border-transparent cursor-pointer font-semibold'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-[#8E8E99]'}`} strokeWidth={1.75} />
            <span>{item.label}</span>
            {typeof item.badge === 'number' && item.badge > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-extrabold leading-none tabular-nums ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#FF4F00]/15 text-[#FF4F00] border border-[#FF4F00]/45'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
