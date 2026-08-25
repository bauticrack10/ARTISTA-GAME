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
      className={`bg-[#f7f4ed] border border-[#eceae4] rounded-[16px] p-6 space-y-5 shadow-sm text-[#1c1c1c] ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Encabezado con Título y Selector de Pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eceae4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[6px] bg-[#eceae4] text-[#1c1c1c]">
              <Sliders className="w-4 h-4 text-[#1c1c1c]" />
            </div>
            <h2 className="text-base font-semibold text-[#1c1c1c] tracking-[-0.4px]">
              Perfil & Atributos del Artista
            </h2>
          </div>
          <p className="text-xs text-[#5f5f5d] mt-0.5">
            Métricas de rendimiento en vivo y habilidades intrínsecas con lectura visual rápida.
          </p>
        </div>

        {/* 1. Pestañas internas: Alternancia limpia */}
        <div className="flex items-center gap-1 bg-[#eceae4] p-1 rounded-[6px] shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`px-3.5 py-1.5 text-xs rounded-[4px] font-semibold transition-all cursor-pointer ${
              activeTab === 'main'
                ? 'bg-[#1c1c1c] text-[#fcfbf8]'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
            }`}
            style={
              activeTab === 'main'
                ? {
                    boxShadow:
                      'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
                  }
                : {}
            }
          >
            Métricas Clave
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personality')}
            className={`px-3.5 py-1.5 text-xs rounded-[4px] font-semibold transition-all cursor-pointer ${
              activeTab === 'personality'
                ? 'bg-[#1c1c1c] text-[#fcfbf8]'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
            }`}
            style={
              activeTab === 'personality'
                ? {
                    boxShadow:
                      'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
                  }
                : {}
            }
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
                className={`bg-[#fcfbf8] rounded-[12px] p-4 space-y-2.5 transition-all duration-200 ease-out shadow-xs border hover:scale-[1.02] hover:shadow-md ${
                  isEnergy && !isTourReady
                    ? 'border-rose-200 bg-rose-50/40'
                    : 'border-[#eceae4] hover:border-[rgba(28,28,28,0.4)]'
                }`}
              >
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${metric.textAccent}`}>
                    {metric.label}
                  </span>
                  <div className="p-1 rounded-[6px] bg-[#eceae4]/60">
                    <Icon className={`w-3.5 h-3.5 ${metric.iconColor}`} />
                  </div>
                </div>

                {/* Valor numérico & Badges de Estado */}
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold text-[#1c1c1c] tracking-tight font-mono tabular-nums">
                    {metric.value}
                    <span className="text-xs text-[#5f5f5d] font-normal font-sans">/100</span>
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
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}
                    >
                      {isTourReady ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Estado: Apto para Giras (Req. ≥85%)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-rose-700" />
                          <span>Bloqueado por fatiga (&lt;85%)</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* 2. Barra de progreso temática con degradado específico */}
                <div className={`w-full ${metric.bgTrack} h-3.5 rounded-full overflow-hidden p-0.5`}>
                  <div
                    className={`bg-gradient-to-r ${metric.gradient} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, metric.value))}%` }}
                  />
                </div>

                {/* Descripción de impacto visual rápido */}
                <p className="text-[11px] text-[#5f5f5d] leading-relaxed">
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
                className="bg-[#fcfbf8] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] rounded-[12px] p-4 space-y-2.5 transition-all duration-200 ease-out shadow-xs hover:scale-[1.02] hover:shadow-md"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-[6px] bg-[#eceae4]/60">
                      <Icon className={`w-3.5 h-3.5 ${trait.iconColor}`} />
                    </div>
                    <span className="font-semibold text-[#1c1c1c]">{trait.label}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[#1c1c1c] font-bold text-xs bg-[#eceae4] px-2 py-0.5 rounded-[4px]">
                    {trait.val}<span className="text-[10px] text-[#5f5f5d] font-normal font-sans">/100</span>
                  </span>
                </div>

                {/* Barra gruesa temática (h-3.5) */}
                <div className={`w-full ${trait.bgTrack} h-3.5 rounded-full overflow-hidden p-0.5`}>
                  <div
                    className={`bg-gradient-to-r ${trait.gradient} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, trait.val))}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#5f5f5d] leading-relaxed">
                  {trait.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Pie del Panel con Micro-leyenda de balance */}
      <div className="pt-3 border-t border-[#eceae4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#5f5f5d]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#5f5f5d]" />
          <span>
            {activeTab === 'main'
              ? 'Las métricas se actualizan dinámicamente con tus lanzamientos, eventos y giras.'
              : 'Las habilidades influyen en la calidad de grabación, química con productores y rendimiento en shows.'}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#1c1c1c]">
          {player.name} • {player.careerStage}
        </span>
      </div>
    </div>
  );
};

export default ArtistAttributesPanel;
