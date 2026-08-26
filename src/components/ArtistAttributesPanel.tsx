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
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export interface ArtistAttributesPanelProps {
  player: Artist;
  className?: string;
  defaultTab?: 'main' | 'personality';
  isTourReady?: boolean;
}

export const ArtistAttributesPanel: React.FC<ArtistAttributesPanelProps> = ({
  player,
  className = '',
  defaultTab = 'main',
  isTourReady: propTourReady
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'personality'>(defaultTab);

  const isTourReady = propTourReady !== undefined ? propTourReady : player.stats.energy >= 85;

  // 1. Grid de Atributos Clave (2 filas x 3 columnas = 6 métricas principales)
  const keyMetrics = [
    {
      id: 'popularity',
      label: 'Popularidad',
      value: player.stats.popularity,
      gradient: 'from-amber-400 to-yellow-500',
      bgTrack: 'bg-amber-100/70',
      textAccent: 'text-amber-900',
      icon: TrendingUp,
      iconColor: 'text-amber-600',
      description: 'Alcance masivo, oyentes globales y demanda de conciertos.'
    },
    {
      id: 'reputation',
      label: 'Reputación Crítica',
      value: player.stats.reputation,
      gradient: 'from-cyan-400 to-blue-500',
      bgTrack: 'bg-cyan-100/70',
      textAccent: 'text-cyan-900',
      icon: ShieldCheck,
      iconColor: 'text-cyan-600',
      description: 'Respeto de la industria, prensa especializada y galas.'
    },
    {
      id: 'artisticCredibility',
      label: 'Credibilidad Artística',
      value: player.stats.artisticCredibility,
      gradient: 'from-purple-500 to-indigo-500',
      bgTrack: 'bg-purple-100/70',
      textAccent: 'text-purple-900',
      icon: Award,
      iconColor: 'text-purple-600',
      description: 'Autenticidad sonora, estatus de culto y valor de catálogo.'
    },
    {
      id: 'fanbaseLoyalty',
      label: 'Fidelidad de Fans',
      value: player.stats.fanbaseLoyalty,
      gradient: 'from-pink-500 to-rose-600',
      bgTrack: 'bg-pink-100/70',
      textAccent: 'text-rose-900',
      icon: Heart,
      iconColor: 'text-rose-600',
      description: 'Comunidad devota, tickets asegurados y apoyo incondicional.'
    },
    {
      id: 'hype',
      label: 'Hype Escénico',
      value: player.stats.hype,
      gradient: 'from-orange-500 to-amber-600',
      bgTrack: 'bg-orange-100/70',
      textAccent: 'text-orange-900',
      icon: Flame,
      iconColor: 'text-orange-600',
      description: 'Fervor viral del momento; decae mensualmente sin lanzamientos.'
    },
    {
      id: 'energy',
      label: 'Energía Vital',
      value: player.stats.energy,
      gradient: 'from-emerald-400 to-teal-500',
      bgTrack: isTourReady ? 'bg-emerald-100/70' : 'bg-rose-100/70',
      textAccent: isTourReady ? 'text-emerald-900' : 'text-rose-900',
      icon: Zap,
      iconColor: isTourReady ? 'text-emerald-600' : 'text-rose-600',
      description: 'Condición física y mental para grabaciones y giras.'
    }
  ];

  // 2. Personalidad & Skills (8 atributos con barras gruesas temáticas)
  const personalitySkills = [
    {
      id: 'creativity',
      label: 'Creatividad & Vanguardia',
      val: player.personality.creativity,
      gradient: 'from-purple-500 to-indigo-600',
      bgTrack: 'bg-purple-100',
      icon: Sparkles,
      iconColor: 'text-purple-600',
      description: 'Innovación conceptual, experimentación sonora y trascendencia artística.'
    },
    {
      id: 'skill',
      label: 'Habilidad Musical / Skill',
      val: player.personality.skill,
      gradient: 'from-blue-500 to-cyan-400',
      bgTrack: 'bg-blue-100',
      icon: Music2,
      iconColor: 'text-blue-600',
      description: 'Técnica vocal, virtuosismo instrumental, métrica y pulido en estudio.'
    },
    {
      id: 'charisma',
      label: 'Carisma & Presencia',
      val: player.personality.charisma,
      gradient: 'from-amber-400 to-orange-500',
      bgTrack: 'bg-amber-100',
      icon: Crown,
      iconColor: 'text-amber-600',
      description: 'Magnetismo mediático, impacto en directos, viralidad y conexión de masas.'
    },
    {
      id: 'commercialAppeal',
      label: 'Atractivo Comercial',
      val: player.personality.commercialAppeal,
      gradient: 'from-emerald-400 to-teal-500',
      bgTrack: 'bg-emerald-100',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      description: 'Potencial de hits mundiales, rotación en playlists masivas y radio.'
    },
    {
      id: 'originality',
      label: 'Originalidad & Identidad',
      val: player.personality.originality,
      gradient: 'from-pink-500 to-rose-500',
      bgTrack: 'bg-pink-100',
      icon: Target,
      iconColor: 'text-pink-600',
      description: 'Sello sonoro inconfundible, distinción estilística y aclamación crítica.'
    },
    {
      id: 'discipline',
      label: 'Disciplina de Trabajo',
      val: player.personality.discipline,
      gradient: 'from-indigo-500 to-blue-600',
      bgTrack: 'bg-indigo-100',
      icon: ShieldCheck,
      iconColor: 'text-indigo-600',
      description: 'Rigor profesional, menor fatiga en estudio y cumplimiento de fechas.'
    },
    {
      id: 'ambition',
      label: 'Ambición de Éxito',
      val: player.personality.ambition,
      gradient: 'from-orange-500 to-red-500',
      bgTrack: 'bg-orange-100',
      icon: Flame,
      iconColor: 'text-orange-600',
      description: 'Impulso por dominar las listas globales y escalar el tamaño de giras.'
    },
    {
      id: 'riskTolerance',
      label: 'Tolerancia al Riesgo',
      val: player.personality.riskTolerance,
      gradient: 'from-teal-400 to-emerald-500',
      bgTrack: 'bg-teal-100',
      icon: Zap,
      iconColor: 'text-teal-600',
      description: 'Facilidad para transicionar de género y probar fórmulas audaces.'
    }
  ];

  return (
    <div
      className={`bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-6 space-y-5 shadow-lg text-[#F8FAFC] ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Encabezado con Título y Selector de Pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2E3D] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[6px] bg-[#0B0C10] border border-[#2A2E3D] text-white">
              <Sliders className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <h2 className="text-base font-bold text-[#F8FAFC] tracking-[-0.4px]">
              Perfil & Atributos del Artista
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Métricas de rendimiento en vivo y habilidades intrínsecas con lectura visual rápida.
          </p>
        </div>

        {/* 1. Pestañas internas: Alternancia limpia */}
        <div className="flex items-center gap-1 bg-[#0B0C10] p-1 rounded-[8px] border border-[#2A2E3D] shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`px-3.5 py-1.5 text-xs rounded-[6px] font-bold transition-all cursor-pointer ${
              activeTab === 'main'
                ? 'bg-[#8B5CF6] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Métricas Clave
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personality')}
            className={`px-3.5 py-1.5 text-xs rounded-[6px] font-bold transition-all cursor-pointer ${
              activeTab === 'personality'
                ? 'bg-[#8B5CF6] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Personalidad & Skills
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: MÉTRICAS CLAVE (Grid 2 filas x 3 columnas) */}
      {activeTab === 'main' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon;
            const isEnergy = metric.id === 'energy';

            return (
              <div
                key={metric.id}
                className={`bg-[#0B0C10] rounded-[12px] p-4 space-y-2.5 transition-all duration-200 ease-out shadow-xs border hover:scale-[1.02] hover:shadow-md ${
                  isEnergy && !isTourReady
                    ? 'border-rose-500/40 bg-rose-500/10'
                    : 'border-[#2A2E3D] hover:border-[#8B5CF6]/50'
                }`}
              >
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold text-[#F8FAFC]`}>
                    {metric.label}
                  </span>
                  <div className="p-1 rounded-[6px] bg-[#16181F] border border-[#2A2E3D]">
                    <Icon className={`w-3.5 h-3.5 ${metric.iconColor}`} />
                  </div>
                </div>

                {/* Valor numérico & Badges de Estado */}
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold text-[#F8FAFC] tracking-tight font-mono tabular-nums">
                    {metric.value}
                    <span className="text-xs text-[#94A3B8] font-normal font-sans">/100</span>
                  </p>

                  {/* 3. Claridad en Requisitos y Badges para Energía Vital */}
                  {isEnergy && (
                    <span
                      title={
                        isTourReady
                          ? 'Cumple con el requisito mínimo (≥85%) para iniciar una gira.'
                          : 'Requiere ≥85% para armar giras. Tomá vacaciones o descansá para recuperar energía.'
                      }
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-[4px] flex items-center gap-1 border transition-colors ${
                        isTourReady
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {isTourReady ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Apto Giras (≥85%)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>Fatiga (&lt;85%)</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* 2. Barra de progreso temática con degradado específico */}
                <div className="w-full bg-[#16181F] border border-[#2A2E3D] h-3.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`bg-gradient-to-r ${metric.gradient} h-full rounded-full transition-all duration-500 shadow-sm`}
                    style={{ width: `${Math.min(100, Math.max(0, metric.value))}%` }}
                  />
                </div>

                {/* Descripción de impacto visual rápido */}
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* PESTAÑA 2: PERSONALIDAD & SKILLS (8 atributos con barras gruesas temáticas) */}
      {activeTab === 'personality' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {personalitySkills.map((trait) => {
            const Icon = trait.icon;

            return (
              <div
                key={trait.id}
                className="bg-[#0B0C10] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 rounded-[12px] p-4 space-y-2.5 transition-all duration-200 ease-out shadow-xs hover:scale-[1.02] hover:shadow-md"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-[6px] bg-[#16181F] border border-[#2A2E3D]">
                      <Icon className={`w-3.5 h-3.5 ${trait.iconColor}`} />
                    </div>
                    <span className="font-bold text-[#F8FAFC]">{trait.label}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[#F8FAFC] font-bold text-xs bg-[#16181F] border border-[#2A2E3D] px-2 py-0.5 rounded-[4px]">
                    {trait.val}<span className="text-[10px] text-[#94A3B8] font-normal font-sans">/100</span>
                  </span>
                </div>

                {/* Barra gruesa temática (h-3.5) */}
                <div className="w-full bg-[#16181F] border border-[#2A2E3D] h-3.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`bg-gradient-to-r ${trait.gradient} h-full rounded-full transition-all duration-500 shadow-sm`}
                    style={{ width: `${Math.min(100, Math.max(0, trait.val))}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  {trait.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Pie del Panel con Micro-leyenda de balance */}
      <div className="pt-3 border-t border-[#2A2E3D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>
            {activeTab === 'main'
              ? 'Las métricas se actualizan dinámicamente con tus lanzamientos, eventos y giras.'
              : 'Las habilidades influyen en la calidad de grabación, química con productores y rendimiento en shows.'}
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#C084FC]">
          {player.name} • {player.careerStage}
        </span>
      </div>
    </div>
  );
};

export default ArtistAttributesPanel;
