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
      badge: 'bg-white/[0.04] text-slate-400 border-white/10',
      rangeLabel: '1 - 30',
      nextTier: 'En Desarrollo',
      pointsToNext: 31 - value
    };
  }
  if (value <= 50) {
    return {
      name: 'En Desarrollo',
      badge: 'bg-white/[0.08] text-slate-300 border-white/15',
      rangeLabel: '31 - 50',
      nextTier: 'Competente',
      pointsToNext: 51 - value
    };
  }
  if (value <= 70) {
    return {
      name: 'Competente',
      badge: 'bg-primary/15 text-primary-soft border-primary/30',
      rangeLabel: '51 - 70',
      nextTier: 'Avanzado',
      pointsToNext: 71 - value
    };
  }
  if (value <= 85) {
    return {
      name: 'Avanzado',
      badge: 'bg-primary/25 text-white border-primary/40 font-bold',
      rangeLabel: '71 - 85',
      nextTier: 'Maestro / Élite',
      pointsToNext: 86 - value
    };
  }
  return {
    name: 'Maestro / Élite',
    badge: 'bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/50 font-mono font-bold',
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
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      textAccent: 'text-[#F4F4F6]',
      icon: TrendingUp,
      iconColor: 'text-[#FF4F00]',
      description: 'Alcance masivo, oyentes globales y demanda de conciertos.'
    },
    {
      id: 'reputation',
      label: 'Reputación Crítica',
      value: stats.reputation ?? 0,
      barColor: 'bg-[#00E599]',
      bgTrack: 'bg-[#18181C]',
      textAccent: 'text-[#F4F4F6]',
      icon: ShieldCheck,
      iconColor: 'text-[#00E599]',
      description: 'Respeto de la industria, prensa especializada y galas.'
    },
    {
      id: 'artisticCredibility',
      label: 'Credibilidad Artística',
      value: stats.artisticCredibility ?? 0,
      barColor: 'bg-[#F4F4F6]',
      bgTrack: 'bg-[#18181C]',
      textAccent: 'text-[#F4F4F6]',
      icon: Award,
      iconColor: 'text-[#F4F4F6]',
      description: 'Autenticidad sonora, estatus de culto y valor de catálogo.'
    },
    {
      id: 'fanbaseLoyalty',
      label: 'Fidelidad de Fans',
      value: stats.fanbaseLoyalty ?? 50,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      textAccent: 'text-[#F4F4F6]',
      icon: Heart,
      iconColor: 'text-[#FF4F00]',
      description: 'Comunidad devota, tickets asegurados y apoyo incondicional.'
    },
    {
      id: 'hype',
      label: 'Hype Escénico',
      value: stats.hype ?? 0,
      barColor: 'bg-[#F59E0B]',
      bgTrack: 'bg-[#18181C]',
      textAccent: 'text-[#F4F4F6]',
      icon: Flame,
      iconColor: 'text-[#F59E0B]',
      description: 'Fervor viral del momento; decae mensualmente sin lanzamientos.'
    },
    {
      id: 'energy',
      label: 'Energía Vital',
      value: stats.energy ?? 100,
      barColor: (stats.energy ?? 100) >= 85 ? 'bg-[#00E599]' : (stats.energy ?? 100) >= 40 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]',
      bgTrack: 'bg-[#18181C]',
      textAccent: 'text-[#F4F4F6]',
      icon: Zap,
      iconColor: (stats.energy ?? 100) >= 85 ? 'text-[#00E599]' : (stats.energy ?? 100) >= 40 ? 'text-[#F59E0B]' : 'text-[#EF4444]',
      description: 'Condición física y mental para grabaciones en estudio y giras en vivo.'
    }
  ];

  // 2. Personalidad & Skills (10 atributos con barras limpias de estudio)
  const personalitySkills = [
    {
      id: 'creativity',
      label: 'Creatividad & Vanguardia',
      val: personality.creativity ?? 26,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: Sparkles,
      iconColor: 'text-[#8E8E99]',
      description: 'Innovación conceptual, experimentación sonora y trascendencia artística en canciones.'
    },
    {
      id: 'skill',
      label: 'Habilidad Musical / Skill',
      val: personality.skill ?? 26,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: Music2,
      iconColor: 'text-[#8E8E99]',
      description: 'Técnica vocal, virtuosismo instrumental, métrica lírica y pulido en estudio.'
    },
    {
      id: 'charisma',
      label: 'Carisma & Presencia',
      val: personality.charisma ?? 24,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: Crown,
      iconColor: 'text-[#8E8E99]',
      description: 'Magnetismo mediático, impacto en directos, viralidad y conexión de masas.'
    },
    {
      id: 'commercialAppeal',
      label: 'Atractivo Comercial',
      val: personality.commercialAppeal ?? 22,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: DollarSign,
      iconColor: 'text-[#8E8E99]',
      description: 'Potencial de hits mundiales, rotación en playlists masivas y radio.'
    },
    {
      id: 'originality',
      label: 'Originalidad & Identidad',
      val: personality.originality ?? 25,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: Target,
      iconColor: 'text-[#8E8E99]',
      description: 'Sello sonoro inconfundible, distinción estilística y aclamación crítica.'
    },
    {
      id: 'discipline',
      label: 'Disciplina de Trabajo',
      val: personality.discipline ?? 24,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: ShieldCheck,
      iconColor: 'text-[#8E8E99]',
      description: 'Rigor profesional, menor fatiga en estudio y cumplimiento de fechas de lanzamiento.'
    },
    {
      id: 'ambition',
      label: 'Ambición de Éxito',
      val: personality.ambition ?? 24,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: Flame,
      iconColor: 'text-[#8E8E99]',
      description: 'Impulso por dominar las listas globales y escalar el tamaño de giras y recintos.'
    },
    {
      id: 'riskTolerance',
      label: 'Tolerancia al Riesgo',
      val: personality.riskTolerance ?? 24,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: Zap,
      iconColor: 'text-[#8E8E99]',
      description: 'Facilidad para transicionar de género musical y probar fórmulas conceptuales audaces.'
    },
    {
      id: 'sociability',
      label: 'Sociabilidad & Networking',
      val: personality.sociability ?? 22,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: Users,
      iconColor: 'text-[#8E8E99]',
      description: 'Afinidad con colegas de la industria, facilidad para colaboraciones y featurings estelares.'
    },
    {
      id: 'independence',
      label: 'Autonomía & Visión Indie',
      val: personality.independence ?? 24,
      barColor: 'bg-[#FF4F00]',
      bgTrack: 'bg-[#18181C]',
      icon: Compass,
      iconColor: 'text-[#8E8E99]',
      description: 'Control creativo, capacidad de autogestión y resistencia a imposiciones discográficas.'
    }
  ];

  return (
    <div
      className={`bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-5 text-[#F4F4F6] ${className}`}
    >
      {/* Encabezado con Título y Selector de Pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242429] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[4px] bg-[#09090B] border border-[#242429] text-white">
              <Sliders className="w-4 h-4 text-[#FF4F00]" />
            </div>
            <h2 className="text-base font-bold text-[#F4F4F6] tracking-tight">
              Perfil & Atributos del Artista
            </h2>
          </div>
          <p className="text-xs text-[#8E8E99] mt-0.5">
            Métricas de rendimiento en vivo y habilidades intrínsecas con lectura visual rápida.
          </p>
        </div>

        {/* 1. Pestañas internas: Alternancia limpia */}
        <div className="flex items-center gap-1 bg-[#09090B] p-1 rounded-[4px] border border-[#242429] shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`min-h-8 px-3.5 py-1.5 text-xs font-mono rounded-[3px] font-bold transition-all cursor-pointer ${
              activeTab === 'main'
                ? 'bg-[#18181C] text-[#F4F4F6] border border-[#3F3F46]'
                : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            Métricas Clave
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personality')}
            className={`min-h-8 px-3.5 py-1.5 text-xs font-mono rounded-[3px] font-bold transition-all cursor-pointer ${
              activeTab === 'personality'
                ? 'bg-[#18181C] text-[#F4F4F6] border border-[#3F3F46]'
                : 'text-[#8E8E99] hover:text-[#F4F4F6]'
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
                className={`bg-[#09090B] rounded-[4px] p-4 space-y-2.5 transition-all duration-200 border ${
                  isEnergy && isEnergyHighFatigue
                    ? 'border-[#EF4444]/40 bg-[#EF4444]/5'
                    : isEnergy && isEnergyMildFatigue
                    ? 'border-[#F59E0B]/40 bg-[#F59E0B]/5'
                    : 'border-[#242429] hover:border-[#3F3F46]'
                }`}
              >
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-mono uppercase tracking-wider text-[#F4F4F6]">
                    {metric.label}
                  </span>
                  <div className="p-1 rounded-[3px] bg-[#111114] border border-[#242429]">
                    <Icon className={`w-3.5 h-3.5 ${metric.iconColor}`} />
                  </div>
                </div>

                {/* Valor numérico & Badges de Estado */}
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold text-[#F4F4F6] tracking-tight font-mono tabular-nums">
                    {metric.value}
                    <span className="text-xs text-[#52525B] font-normal font-mono"> / 100</span>
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
                      className={`text-2xs font-mono font-semibold px-2 py-0.5 rounded-[2px] flex items-center gap-1 border transition-colors ${
                        isEnergyOptimal
                          ? 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30'
                          : isEnergyMildFatigue
                          ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                          : 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                      }`}
                    >
                      {isEnergyOptimal ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-[#00E599]" />
                          <span>Apto Giras</span>
                        </>
                      ) : isEnergyMildFatigue ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                          <span>Fatiga Leve</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
                          <span>Fatiga Alta</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Barra de progreso técnica */}
                <div className="w-full bg-[#18181C] border border-[#242429] h-2 rounded-[2px] overflow-hidden p-0.5">
                  <div
                    className={`${metric.barColor} h-full rounded-[1px] transition-all duration-300`}
                    role="progressbar"
                    aria-label={metric.label}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(Number(Math.min(100, Math.max(0, metric.value))))}
                    style={{ width: `${Math.min(100, Math.max(0, metric.value))}%` }}
                  />
                </div>

                {/* Descripción de impacto visual rápido */}
                <p className="text-3xs text-[#8E8E99] leading-relaxed">
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
          <div className="bg-[#09090B] border border-[#242429] rounded-[4px] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242429] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#FF4F00]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F4F4F6]">
                    ¿Cómo progresar y entrenar tus Habilidades?
                  </h3>
                  <p className="text-xs text-[#8E8E99]">
                    Tus atributos definen la calidad final de tus temas, el carisma escénico y tu éxito comercial.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#18181C] text-[#8E8E99] border border-[#242429]">
                  Escala 1 - 100
                </span>
                {player?.isProdigy && (
                  <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/40 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-[#F59E0B]" />
                    Prodigio x3
                  </span>
                )}
              </div>
            </div>

            {/* 4 Canales de Entrenamiento & Progresión */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429] space-y-1 hover:border-[#3F3F46] transition-colors">
                <div className="flex items-center gap-1.5 text-[#FF4F00] font-mono font-bold text-xs">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
                  <span>1. Tienda & Masterclasses</span>
                </div>
                <p className="text-xs text-[#8E8E99] leading-relaxed">
                  Masterclasses, libros de teoría, coach vocal y equipamiento aumentan tus habilidades de forma <strong>permanente</strong>.
                </p>
              </div>

              <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429] space-y-1 hover:border-[#3F3F46] transition-colors">
                <div className="flex items-center gap-1.5 text-[#00E599] font-mono font-bold text-xs">
                  <Music2 className="w-3.5 h-3.5 text-[#00E599] shrink-0" />
                  <span>2. Grabaciones & Hits</span>
                </div>
                <p className="text-xs text-[#8E8E99] leading-relaxed">
                  Componer singles, EPs, álbumes y colaboraciones ejercita tu técnica, creatividad compositiva y originalidad.
                </p>
              </div>

              <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429] space-y-1 hover:border-[#3F3F46] transition-colors">
                <div className="flex items-center gap-1.5 text-[#F59E0B] font-mono font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                  <span>3. Decisiones & Prensa</span>
                </div>
                <p className="text-xs text-[#8E8E99] leading-relaxed">
                  Tus respuestas en dilemas narrativos, entrevistas y contratos discográficos forjan tu disciplina y tolerancia al riesgo.
                </p>
              </div>

              <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429] space-y-1 hover:border-[#3F3F46] transition-colors">
                <div className="flex items-center gap-1.5 text-[#00E599] font-mono font-bold text-xs">
                  <Zap className="w-3.5 h-3.5 text-[#00E599] shrink-0" />
                  <span>4. Bienestar & Enfoque</span>
                </div>
                <p className="text-xs text-[#8E8E99] leading-relaxed">
                  Mantener la energía vital óptima (≥85%) previene bloqueos creativos y maximiza la inspiración en sesiones de estudio.
                </p>
              </div>
            </div>

            {/* Leyenda de Rangos de Nivel */}
            <div className="pt-2 border-t border-[#242429] flex items-center justify-between flex-wrap gap-2 text-2xs text-[#8E8E99]">
              <span className="font-mono font-semibold text-[#F4F4F6]">Rangos Oficiales de Nivel:</span>
              <div className="flex items-center gap-2 flex-wrap font-mono">
                <span className="px-2 py-0.5 rounded-[2px] bg-[#18181C] text-[#8E8E99] border border-[#242429]">
                  Principiante (1-30)
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/30">
                  En Desarrollo (31-50)
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#18181C] text-[#00E599] border border-[#00E599]/30">
                  Competente (51-70)
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#18181C] text-[#FF4F00] border border-[#FF4F00]/30">
                  Avanzado (71-85)
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#18181C] text-[#F59E0B] border border-[#F59E0B]/50 font-bold">
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
                  className="bg-[#09090B] border border-[#242429] hover:border-[#3F3F46] rounded-[4px] p-4 space-y-3 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header de Atributo: Icono, Nombre, Badge de Nivel y Valor */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-[3px] bg-[#111114] border border-[#242429] shrink-0">
                          <Icon className={`w-4 h-4 ${trait.iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#F4F4F6] text-sm leading-tight">
                              {trait.label}
                            </span>
                            <span className={`text-3xs font-mono font-bold px-2 py-0.5 rounded-[2px] border ${tierInfo.badge}`}>
                              {tierInfo.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono tabular-nums text-[#F4F4F6] font-bold text-xs bg-[#111114] border border-[#242429] px-2.5 py-1 rounded-[3px] shrink-0">
                        {trait.val}<span className="text-3xs text-[#52525B] font-mono font-normal"> / 100</span>
                      </span>
                    </div>

                    {/* Barra de progreso técnica */}
                    <div className="space-y-1">
                      <div className="w-full bg-[#18181C] border border-[#242429] h-2 rounded-[2px] overflow-hidden p-0.5 relative">
                        <div
                          className={`${trait.barColor} h-full rounded-[1px] transition-all duration-300`}
                          role="progressbar"
                          aria-label={trait.label}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(Number(Math.min(100, Math.max(0, trait.val))))}
                          style={{ width: `${Math.min(100, Math.max(0, trait.val))}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-3xs text-[#52525B] font-mono px-0.5">
                        <span>1</span>
                        <span>30</span>
                        <span>50</span>
                        <span>70</span>
                        <span>85</span>
                        <span>100</span>
                      </div>
                    </div>

                    {/* Descripción de impacto visual */}
                    <p className="text-xs text-[#8E8E99] leading-relaxed">
                      {trait.description}
                    </p>
                  </div>

                  {/* Indicador de Próximo Nivel / Rango */}
                  <div className="pt-2 border-t border-[#242429] flex items-center justify-between text-2xs font-mono">
                    {tierInfo.nextTier ? (
                      <span className="text-[#8E8E99] flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3 h-3 text-[#FF4F00]" />
                        Próximo: <strong>{tierInfo.nextTier}</strong> (+{tierInfo.pointsToNext} pts)
                      </span>
                    ) : (
                      <span className="text-[#F59E0B] flex items-center gap-1 font-bold">
                        <Crown className="w-3 h-3 text-[#F59E0B]" />
                        Máximo Rango Alcanzado
                      </span>
                    )}
                    <span className="text-2xs font-mono text-[#52525B]">
                      {tierInfo.rangeLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pie del Panel con Micro-leyenda de balance */}
      <div className="pt-3 border-t border-[#242429] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#8E8E99]">
        <div className="flex items-center gap-1.5 font-mono">
          <Info className="w-3.5 h-3.5 text-[#8E8E99]" />
          <span>
            {activeTab === 'main'
              ? 'Las métricas se actualizan dinámicamente con tus lanzamientos, eventos y giras.'
              : 'Las habilidades se mejoran mediante práctica continua, lanzamientos, decisiones de carrera y compras en la tienda.'}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-[#F4F4F6]">
          {player?.name || 'Artista'} • {player?.careerStage || 'Underground'}
        </span>
      </div>
    </div>
  );
};

export default ArtistAttributesPanel;

