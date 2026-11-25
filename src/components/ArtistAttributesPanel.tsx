import React, { useState } from 'react';
import { Artist } from '../types';
import {
  Sliders,
  TrendingUp,
  ShieldCheck,
  Award,
  Flame,
  Zap,
  Palette,
  Music2,
  Crown,
  DollarSign,
  Target,
  Users,
  Compass,
  ChevronDown,
  ChevronUp
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
      badge: 'bg-[#111114] text-[#8E8E99] border-[#242429]',
      rangeLabel: '1 - 30',
      nextTier: 'En Desarrollo',
      pointsToNext: 31 - value
    };
  }
  if (value <= 50) {
    return {
      name: 'En Desarrollo',
      badge: 'bg-[#111114] text-[#F4F4F6] border-[#3F3F46]',
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
      badge: 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30',
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
  defaultTab
}) => {
  const [isTechnicalOpen, setIsTechnicalOpen] = useState<boolean>(defaultTab === 'personality');

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

  // 4 métricas clave de impacto con micro-subtítulo práctico de 1 línea
  const keyMetrics = [
    {
      id: 'popularity',
      label: 'Popularidad',
      subtitle: 'Define tu alcance base y techo de oyentes',
      value: stats.popularity ?? 0,
      barColor: 'bg-[#38BDF8]',
      icon: TrendingUp,
      iconColor: 'text-[#38BDF8]'
    },
    {
      id: 'hype',
      label: 'Hype',
      subtitle: 'Impulsa debuts, virales y entradas a charts',
      value: stats.hype ?? 0,
      barColor: 'bg-[#FF4F00]',
      icon: Flame,
      iconColor: 'text-[#FF4F00]'
    },
    {
      id: 'reputation',
      label: 'Reputación',
      subtitle: 'Atrae mejores sellos, premios y contratos',
      value: stats.reputation ?? 0,
      barColor: 'bg-[#34D399]',
      icon: ShieldCheck,
      iconColor: 'text-[#34D399]'
    },
    {
      id: 'artisticCredibility',
      label: 'Credibilidad',
      subtitle: 'Eleva reseñas de prensa y respeto de culto',
      value: stats.artisticCredibility ?? 0,
      barColor: 'bg-[#F59E0B]',
      icon: Award,
      iconColor: 'text-[#F59E0B]'
    }
  ];

  const personalitySkills = [
    { id: 'creativity', label: 'Creatividad', val: personality.creativity ?? 26, icon: Palette },
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
    <section
      className={`surface-1 bg-[#111114] border border-[#242429] rounded-[6px] animate-stagger-in stagger-3 p-5 sm:p-6 relative space-y-4 text-[#F4F4F6] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#FF4F00]" />
          <h2 className="text-sm font-bold text-[#F4F4F6] tracking-tight">
            Métricas de Impacto & Atributos
          </h2>
        </div>

        <span className="text-2xs font-sans text-[#8E8E99] tabular-nums">
          Fidelidad de fans: <strong className="text-[#F4F4F6]">{stats.fanbaseLoyalty ?? 50}%</strong>
        </span>
      </div>

      {/* 4 Métricas Clave de Impacto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className="surface-2 bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] rounded-[4px] p-3.5 space-y-2 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-xs font-bold text-[#F4F4F6] truncate">
                  {metric.label}
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${metric.iconColor}`} />
              </div>

              <div className="text-xl font-bold text-[#F4F4F6] font-sans tabular-nums">
                {metric.value}
                <span className="text-2xs text-[#8E8E99] font-normal">/100</span>
              </div>

              <div className="w-full h-1.5 bg-[#09090B] rounded-[2px] overflow-hidden border border-[#242429]">
                <div
                  className={`h-full transition-all duration-300 ${metric.barColor}`}
                  style={{ width: `${Math.min(100, Math.max(0, metric.value))}%` }}
                />
              </div>

              <p className="text-2xs text-[#8E8E99] leading-snug line-clamp-1">
                {metric.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Acordeón cerrado por defecto: Atributos Técnicos y Escénicos (10) */}
      <div className="border-t border-[#242429] pt-3">
        <button
          type="button"
          onClick={() => setIsTechnicalOpen((prev) => !prev)}
          aria-expanded={isTechnicalOpen}
          className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[4px] surface-2 bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] text-xs font-bold text-[#F4F4F6] cursor-pointer transition-colors"
        >
          <span>Atributos Técnicos y Escénicos (10)</span>
          {isTechnicalOpen ? (
            <ChevronUp className="w-4 h-4 text-[#8E8E99]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#8E8E99]" />
          )}
        </button>

        {isTechnicalOpen && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {personalitySkills.map((skill) => {
              const Icon = skill.icon;
              const tier = getSkillTier(skill.val);
              return (
                <div
                  key={skill.id}
                  className="surface-2 bg-[#18181C] border border-[#242429] rounded-[4px] p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Icon className="w-3.5 h-3.5 text-[#8E8E99] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-[#F4F4F6] truncate">{skill.label}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] border font-sans ${tier.badge}`}>
                            {tier.name}
                          </span>
                          <span className="text-xs font-bold text-[#F4F4F6] font-sans tabular-nums">
                            {skill.val}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[#09090B] rounded-[2px] overflow-hidden border border-[#242429]">
                        <div
                          className="h-full bg-[#FF4F00] transition-all duration-300"
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
    </section>
  );
};

export default ArtistAttributesPanel;
