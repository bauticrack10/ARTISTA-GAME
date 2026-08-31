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
  AlertTriangle,
  Users,
  Compass,
  ShoppingBag
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
      badge: 'bg-zinc-800/90 text-zinc-300 border-zinc-700/80',
      rangeLabel: '1 - 30',
      nextTier: 'En Desarrollo',
      pointsToNext: 31 - value
    };
  }
  if (value <= 50) {
    return {
      name: 'En Desarrollo',
      badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
      rangeLabel: '31 - 50',
      nextTier: 'Competente',
      pointsToNext: 51 - value
    };
  }
  if (value <= 70) {
    return {
      name: 'Competente',
      badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
      rangeLabel: '51 - 70',
      nextTier: 'Avanzado',
      pointsToNext: 71 - value
    };
  }
  if (value <= 85) {
    return {
      name: 'Avanzado',
      badge: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
      rangeLabel: '71 - 85',
      nextTier: 'Maestro / Élite',
      pointsToNext: 86 - value
    };
  }
  return {
    name: 'Maestro / Élite',
    badge: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-400/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
    rangeLabel: '86 - 100',
    nextTier: null,
    pointsToNext: 0
  };
}

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

  const isTourReady = propTourReady !== undefined ? propTourReady : (stats.energy || 0) >= 85;

  // 1. Grid de Atributos Clave (2 filas x 3 columnas = 6 métricas principales)
  const keyMetrics = [
    {
      id: 'popularity',
      label: 'Popularidad',
      value: stats.popularity ?? 0,
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
      value: stats.reputation ?? 0,
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
      value: stats.artisticCredibility ?? 0,
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
      value: stats.fanbaseLoyalty ?? 50,
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
      value: stats.hype ?? 0,
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
      value: stats.energy ?? 100,
      gradient: (stats.energy ?? 100) >= 85 ? 'from-emerald-400 to-teal-500' : (stats.energy ?? 100) >= 40 ? 'from-amber-400 to-orange-500' : 'from-rose-500 to-red-600',
      bgTrack: (stats.energy ?? 100) >= 85 ? 'bg-emerald-100/70' : (stats.energy ?? 100) >= 40 ? 'bg-amber-100/70' : 'bg-rose-100/70',
      textAccent: (stats.energy ?? 100) >= 85 ? 'text-emerald-900' : (stats.energy ?? 100) >= 40 ? 'text-amber-900' : 'text-rose-900',
      icon: Zap,
      iconColor: (stats.energy ?? 100) >= 85 ? 'text-emerald-400' : (stats.energy ?? 100) >= 40 ? 'text-amber-400' : 'text-rose-400',
      description: 'Condición física y mental para grabaciones en estudio y giras en vivo.'
    }
  ];

  // 2. Personalidad & Skills (10 atributos con barras gruesas temáticas y rangos de progresión)
  const personalitySkills = [
    {
      id: 'creativity',
      label: 'Creatividad & Vanguardia',
      val: personality.creativity ?? 26,
      gradient: 'from-purple-500 to-indigo-600',
      bgTrack: 'bg-purple-100',
      icon: Sparkles,
      iconColor: 'text-purple-400',
      description: 'Innovación conceptual, experimentación sonora y trascendencia artística en canciones.'
    },
    {
      id: 'skill',
      label: 'Habilidad Musical / Skill',
      val: personality.skill ?? 26,
      gradient: 'from-blue-500 to-cyan-400',
      bgTrack: 'bg-blue-100',
      icon: Music2,
      iconColor: 'text-cyan-400',
      description: 'Técnica vocal, virtuosismo instrumental, métrica lírica y pulido en estudio.'
    },
    {
      id: 'charisma',
      label: 'Carisma & Presencia',
      val: personality.charisma ?? 24,
      gradient: 'from-amber-400 to-orange-500',
      bgTrack: 'bg-amber-100',
      icon: Crown,
      iconColor: 'text-amber-400',
      description: 'Magnetismo mediático, impacto en directos, viralidad y conexión de masas.'
    },
    {
      id: 'commercialAppeal',
      label: 'Atractivo Comercial',
      val: personality.commercialAppeal ?? 22,
      gradient: 'from-emerald-400 to-teal-500',
      bgTrack: 'bg-emerald-100',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      description: 'Potencial de hits mundiales, rotación en playlists masivas y radio.'
    },
    {
      id: 'originality',
      label: 'Originalidad & Identidad',
      val: personality.originality ?? 25,
      gradient: 'from-pink-500 to-rose-500',
      bgTrack: 'bg-pink-100',
      icon: Target,
      iconColor: 'text-rose-400',
      description: 'Sello sonoro inconfundible, distinción estilística y aclamación crítica.'
    },
    {
      id: 'discipline',
      label: 'Disciplina de Trabajo',
      val: personality.discipline ?? 24,
      gradient: 'from-indigo-500 to-blue-600',
      bgTrack: 'bg-indigo-100',
      icon: ShieldCheck,
      iconColor: 'text-indigo-400',
      description: 'Rigor profesional, menor fatiga en estudio y cumplimiento de fechas de lanzamiento.'
    },
    {
      id: 'ambition',
      label: 'Ambición de Éxito',
      val: personality.ambition ?? 24,
      gradient: 'from-orange-500 to-red-500',
      bgTrack: 'bg-orange-100',
      icon: Flame,
      iconColor: 'text-orange-400',
      description: 'Impulso por dominar las listas globales y escalar el tamaño de giras y recintos.'
    },
    {
      id: 'riskTolerance',
      label: 'Tolerancia al Riesgo',
      val: personality.riskTolerance ?? 24,
      gradient: 'from-teal-400 to-emerald-500',
      bgTrack: 'bg-teal-100',
      icon: Zap,
      iconColor: 'text-teal-400',
      description: 'Facilidad para transicionar de género musical y probar fórmulas conceptuales audaces.'
    },
    {
      id: 'sociability',
      label: 'Sociabilidad & Networking',
      val: personality.sociability ?? 22,
      gradient: 'from-cyan-500 to-blue-500',
      bgTrack: 'bg-cyan-100',
      icon: Users,
      iconColor: 'text-cyan-400',
      description: 'Afinidad con colegas de la industria, facilidad para colaboraciones y featurings estelares.'
    },
    {
      id: 'independence',
      label: 'Autonomía & Visión Indie',
      val: personality.independence ?? 24,
      gradient: 'from-violet-500 to-purple-600',
      bgTrack: 'bg-violet-100',
      icon: Compass,
      iconColor: 'text-violet-400',
      description: 'Control creativo, capacidad de autogestión y resistencia a imposiciones discográficas.'
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
            const energyVal = Number(stats.energy ?? 100);
            const isEnergyOptimal = energyVal >= 85;
            const isEnergyMildFatigue = energyVal >= 40 && energyVal < 85;
            const isEnergyHighFatigue = energyVal < 40;

            return (
              <div
                key={metric.id}
                className={`bg-[#0B0C10] rounded-[12px] p-4 space-y-2.5 transition-all duration-200 ease-out shadow-xs border hover:scale-[1.02] hover:shadow-md ${
                  isEnergy && isEnergyHighFatigue
                    ? 'border-rose-500/40 bg-rose-500/10'
                    : isEnergy && isEnergyMildFatigue
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-[#2A2E3D] hover:border-[#8B5CF6]/50'
                }`}
              >
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F8FAFC]">
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
                    <span className="text-xs text-[#94A3B8] font-normal font-sans"> / 100</span>
                  </p>

                  {/* Claridad en Requisitos y Badges para Energía Vital */}
                  {isEnergy && (
                    <span
                      title={
                        isEnergyOptimal
                          ? 'Energía óptima (≥85%). Apto para iniciar giras de conciertos y sesiones intensivas en estudio.'
                          : isEnergyMildFatigue
                          ? 'Fatiga leve (<85%). Puedes grabar temas pero requieres ≥85% para armar giras. Descansá para recuperar.'
                          : 'Fatiga alta (<40%). Riesgo de bajo rendimiento y fatiga en conciertos. Tomá un retiro de descanso.'
                      }
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-[4px] flex items-center gap-1 border transition-colors ${
                        isEnergyOptimal
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : isEnergyMildFatigue
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {isEnergyOptimal ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Apto Giras</span>
                        </>
                      ) : isEnergyMildFatigue ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>Fatiga Leve</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>Fatiga Alta</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Barra de progreso temática con degradado específico */}
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

      {/* PESTAÑA 2: PERSONALIDAD & SKILLS (10 atributos con niveles, progreso y guía de entrenamiento) */}
      {activeTab === 'personality' && (
        <div className="space-y-5">
          {/* Tarjeta Guía de Progresión y Entrenamiento */}
          <div className="bg-gradient-to-br from-[#0B0C10] to-[#13151D] border border-[#8B5CF6]/30 rounded-[12px] p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2E3D] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-[6px] bg-[#8B5CF6]/20 text-[#C084FC]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                    ¿Cómo progresar y entrenar tus Habilidades?
                  </h3>
                  <p className="text-[11px] text-[#94A3B8]">
                    Tus atributos definen la calidad final de tus temas, el carisma escénico y tu éxito comercial.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/40">
                  Escala 1 - 100
                </span>
                {player?.isProdigy && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 text-yellow-300 border border-yellow-400/50 flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3 text-amber-400" />
                    Prodigio x3
                  </span>
                )}
              </div>
            </div>

            {/* 4 Canales de Entrenamiento & Progresión */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] space-y-1 hover:border-[#8B5CF6]/40 transition-colors">
                <div className="flex items-center gap-1.5 text-[#C084FC] font-bold text-[11px]">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C084FC] shrink-0" />
                  <span>1. Tienda & Masterclasses</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Masterclasses, libros de teoría, coach vocal y equipamiento aumentan tus habilidades de forma <strong>permanente</strong>.
                </p>
              </div>

              <div className="p-3 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] space-y-1 hover:border-[#06B6D4]/40 transition-colors">
                <div className="flex items-center gap-1.5 text-[#06B6D4] font-bold text-[11px]">
                  <Music2 className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
                  <span>2. Grabaciones & Hits</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Componer singles, EPs, álbumes y colaboraciones ejercita tu técnica, creatividad compositiva y originalidad.
                </p>
              </div>

              <div className="p-3 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] space-y-1 hover:border-amber-400/40 transition-colors">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>3. Decisiones & Prensa</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Tus respuestas en dilemas narrativos, entrevistas y contratos discográficos forjan tu disciplina y tolerancia al riesgo.
                </p>
              </div>

              <div className="p-3 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] space-y-1 hover:border-emerald-400/40 transition-colors">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>4. Bienestar & Enfoque</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Mantener la energía vital óptima (≥85%) previene bloqueos creativos y maximiza la inspiración en sesiones de estudio.
                </p>
              </div>
            </div>

            {/* Leyenda de Rangos de Nivel */}
            <div className="pt-2 border-t border-[#2A2E3D] flex items-center justify-between flex-wrap gap-2 text-[10px] text-[#94A3B8]">
              <span className="font-semibold text-[#F8FAFC]">Rangos Oficiales de Nivel:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-[4px] bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 font-medium">
                  Principiante (1-30)
                </span>
                <span className="px-2 py-0.5 rounded-[4px] bg-amber-950/60 text-amber-300 border border-amber-500/40 font-medium">
                  En Desarrollo (31-50)
                </span>
                <span className="px-2 py-0.5 rounded-[4px] bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-medium">
                  Competente (51-70)
                </span>
                <span className="px-2 py-0.5 rounded-[4px] bg-purple-950/60 text-purple-300 border border-purple-500/40 font-medium">
                  Avanzado (71-85)
                </span>
                <span className="px-2 py-0.5 rounded-[4px] bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border border-yellow-400/50 font-bold">
                  Maestro / Élite (86-100)
                </span>
              </div>
            </div>
          </div>

          {/* Grid de 10 Atributos de Personalidad & Habilidades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personalitySkills.map((trait) => {
              const Icon = trait.icon;
              const tierInfo = getSkillTier(trait.val);

              return (
                <div
                  key={trait.id}
                  className="bg-[#0B0C10] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 rounded-[12px] p-4 space-y-3 transition-all duration-200 ease-out shadow-xs hover:scale-[1.01] hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header de Atributo: Icono, Nombre, Badge de Nivel y Valor */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-[6px] bg-[#16181F] border border-[#2A2E3D] shrink-0">
                          <Icon className={`w-4 h-4 ${trait.iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#F8FAFC] text-sm leading-tight">
                              {trait.label}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] border ${tierInfo.badge}`}>
                              {tierInfo.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono tabular-nums text-[#F8FAFC] font-bold text-xs bg-[#16181F] border border-[#2A2E3D] px-2.5 py-1 rounded-[6px] shrink-0">
                        {trait.val}<span className="text-[10px] text-[#94A3B8] font-normal font-sans"> / 100</span>
                      </span>
                    </div>

                    {/* Barra de progreso temática */}
                    <div className="space-y-1">
                      <div className="w-full bg-[#16181F] border border-[#2A2E3D] h-3.5 rounded-full overflow-hidden p-0.5 relative">
                        <div
                          className={`bg-gradient-to-r ${trait.gradient} h-full rounded-full transition-all duration-500 shadow-sm`}
                          style={{ width: `${Math.min(100, Math.max(0, trait.val))}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-[#64748B] font-mono px-0.5">
                        <span>1</span>
                        <span>30</span>
                        <span>50</span>
                        <span>70</span>
                        <span>85</span>
                        <span>100</span>
                      </div>
                    </div>

                    {/* Descripción de impacto visual */}
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                      {trait.description}
                    </p>
                  </div>

                  {/* Indicador de Próximo Nivel / Rango */}
                  <div className="pt-2 border-t border-[#1C1F2A] flex items-center justify-between text-[10px]">
                    {tierInfo.nextTier ? (
                      <span className="text-[#A78BFA] flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3 h-3 text-[#A78BFA]" />
                        Próximo Rango: <strong>{tierInfo.nextTier}</strong> (+{tierInfo.pointsToNext} pts)
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1 font-bold">
                        <Crown className="w-3 h-3 text-amber-400" />
                        Nivel Máximo de Maestría Alcanzado
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-[#64748B]">
                      Nivel {tierInfo.rangeLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pie del Panel con Micro-leyenda de balance */}
      <div className="pt-3 border-t border-[#2A2E3D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>
            {activeTab === 'main'
              ? 'Las métricas se actualizan dinámicamente con tus lanzamientos, eventos y giras.'
              : 'Las habilidades se mejoran mediante práctica continua, lanzamientos, decisiones de carrera y compras en la tienda.'}
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#C084FC]">
          {player?.name || 'Artista'} • {player?.careerStage || 'Underground'}
        </span>
      </div>
    </div>
  );
};

export default ArtistAttributesPanel;

