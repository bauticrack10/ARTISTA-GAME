import React, { useState } from 'react';
import { Artist } from '../types';
import {
  Sliders,
  TrendingUp,
  ShieldCheck,
  Award,
  Heart,
  Flame,
  Zap,
  Sparkles,
  Music2,
  Crown,
  DollarSign,
  Target,
  Users,
  Compass
} from 'lucide-react';

export interface ArtistAttributesPanelProps {
  player: Artist;
  className?: string;
  defaultTab?: 'main' | 'personality';
  isTourReady?: boolean;
}

export interface SkillTierInfo {
  name: string;
  badge: string;
  rangeLabel: string;
  nextTier: string | null;
  pointsToNext: number;
}

export function getSkillTier(val: number): SkillTierInfo {
  const value = Math.max(0, Math.min(100, Math.round(val)));
  if (value <= 30) {
    return {
      name: 'Principiante',
      badge: 'bg-[#18181C] text-[#8E8E99] border-[#242429]',
      rangeLabel: '1 - 30',
      nextTier: 'En Desarrollo',
      pointsToNext: 31 - value
    };
  }
  if (value <= 50) {
    return {
      name: 'En Desarrollo',
      badge: 'bg-[#18181C] text-[#F4F4F6] border-[#3F3F46]',
      rangeLabel: '31 - 50',
      nextTier: 'Competente',
      pointsToNext: 51 - value
    };
  }
  if (value <= 70) {
    return {
      name: 'Competente',
      badge: 'bg-[#FF4F00]/15 text-[#FF4F00] border-[#FF4F00]/30',
      rangeLabel: '51 - 70',
      nextTier: 'Avanzado',
      pointsToNext: 71 - value
    };
  }
  if (value <= 85) {
    return {
      name: 'Avanzado',
      badge: 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30',
      rangeLabel: '71 - 85',
      nextTier: 'Maestro / Élite',
      pointsToNext: 86 - value
    };
  }
  return {
    name: 'Maestro / Élite',
    badge: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40 font-bold',
    rangeLabel: '86 - 100',
    nextTier: null,
    pointsToNext: 0
  };
}

export const ArtistAttributesPanel: React.FC<ArtistAttributesPanelProps> = ({
  player,
  className = '',
  defaultTab = 'main'
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'personality'>(defaultTab);

  const stats = player?.stats || {
    popularity: 0,
    reputation: 0,
    artisticCredibility: 0,
    fanbaseLoyalty: 50,
    hype: 0,
    energy: 100
  };

  const personality = player?.personality || {
    creativity: 26,
    skill: 26,
    charisma: 24,
    commercialAppeal: 22,
    originality: 25,
    discipline: 24,
    ambition: 24,
    riskTolerance: 24,
    sociability: 22,
    independence: 24
  };

  const keyMetrics = [
    {
      id: 'popularity',
      label: 'Popularidad',
      value: stats.popularity ?? 0,
      barColor: 'bg-[#FF4F00]',
      icon: TrendingUp,
      iconColor: 'text-[#FF4F00]'
    },
    {
      id: 'reputation',
      label: 'Reputación Crítica',
      value: stats.reputation ?? 0,
      barColor: 'bg-[#00E599]',
      icon: ShieldCheck,
      iconColor: 'text-[#00E599]'
    },
    {
      id: 'artisticCredibility',
      label: 'Credibilidad',
      value: stats.artisticCredibility ?? 0,
      barColor: 'bg-[#F4F4F6]',
      icon: Award,
      iconColor: 'text-[#F4F4F6]'
    },
    {
      id: 'fanbaseLoyalty',
      label: 'Fidelidad de Fans',
      value: stats.fanbaseLoyalty ?? 50,
      barColor: 'bg-[#FF4F00]',
      icon: Heart,
      iconColor: 'text-[#FF4F00]'
    },
    {
      id: 'hype',
      label: 'Hype Escénico',
      value: stats.hype ?? 0,
      barColor: 'bg-[#F59E0B]',
      icon: Flame,
      iconColor: 'text-[#F59E0B]'
    },
    {
      id: 'energy',
      label: 'Energía Vital',
      value: stats.energy ?? 100,
      barColor: (stats.energy ?? 100) >= 85 ? 'bg-[#00E599]' : (stats.energy ?? 100) >= 40 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]',
      icon: Zap,
      iconColor: (stats.energy ?? 100) >= 85 ? 'text-[#00E599]' : (stats.energy ?? 100) >= 40 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
    }
  ];

  const personalitySkills = [
    { id: 'creativity', label: 'Creatividad', val: personality.creativity ?? 26, icon: Sparkles },
    { id: 'skill', label: 'Técnica & Skill', val: personality.skill ?? 26, icon: Music2 },
    { id: 'charisma', label: 'Carisma Escénico', val: personality.charisma ?? 24, icon: Crown },
    { id: 'commercialAppeal', label: 'Atractivo Comercial', val: personality.commercialAppeal ?? 22, icon: DollarSign },
    { id: 'originality', label: 'Originalidad', val: personality.originality ?? 25, icon: Target },
    { id: 'discipline', label: 'Disciplina', val: personality.discipline ?? 24, icon: ShieldCheck },
    { id: 'ambition', label: 'Ambición', val: personality.ambition ?? 24, icon: Flame },
    { id: 'riskTolerance', label: 'Tolerancia al Riesgo', val: personality.riskTolerance ?? 24, icon: Zap },
    { id: 'sociability', label: 'Networking', val: personality.sociability ?? 22, icon: Users },
    { id: 'independence', label: 'Visión Indie', val: personality.independence ?? 24, icon: Compass }
  ];

  return (
    <div className={`bg-[#111114] border border-[#242429] rounded-[6px] p-5 space-y-4 text-[#F4F4F6] ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-[#242429] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#FF4F00]" />
          <h2 className="text-sm font-bold text-[#F4F4F6] tracking-tight">
            Estadísticas & Habilidades
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-[#09090B] p-0.5 rounded-[4px] border border-[#242429]">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`px-3 py-1 text-xs font-sans rounded-[3px] font-bold transition-all cursor-pointer ${
              activeTab === 'main'
                ? 'bg-[#18181C] text-[#F4F4F6] border border-[#3F3F46]'
                : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            Métricas (6)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personality')}
            className={`px-3 py-1 text-xs font-sans rounded-[3px] font-bold transition-all cursor-pointer ${
              activeTab === 'personality'
                ? 'bg-[#18181C] text-[#F4F4F6] border border-[#3F3F46]'
                : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            Habilidades (10)
          </button>
        </div>
      </div>

      {activeTab === 'main' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className="bg-[#09090B] rounded-[4px] p-3 space-y-2 border border-[#242429]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-[#8E8E99] truncate">
                    {metric.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${metric.iconColor}`} />
                </div>

                <div className="text-lg font-bold text-[#F4F4F6] font-sans tabular-nums">
                  {metric.value}
                  <span className="text-2xs text-[#52525B] font-normal">/100</span>
                </div>

                <div className="w-full h-1.5 bg-[#18181C] rounded-[2px] overflow-hidden">
                  <div
                    className={`h-full rounded-[2px] transition-all duration-300 ${metric.barColor}`}
                    style={{ width: `${Math.min(100, Math.max(0, metric.value))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'personality' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {personalitySkills.map((skill) => {
            const Icon = skill.icon;
            const tier = getSkillTier(skill.val);
            return (
              <div
                key={skill.id}
                className="bg-[#09090B] border border-[#242429] rounded-[4px] p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Icon className="w-3.5 h-3.5 text-[#8E8E99] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#F4F4F6] truncate">{skill.label}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] border font-sans ${tier.badge}`}>
                          {tier.name}
                        </span>
                        <span className="text-xs font-bold text-[#F4F4F6] font-sans tabular-nums">
                          {skill.val}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-[#18181C] rounded-[2px] overflow-hidden">
                      <div
                        className="h-full bg-[#FF4F00] rounded-[2px] transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, skill.val))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ArtistAttributesPanel;
