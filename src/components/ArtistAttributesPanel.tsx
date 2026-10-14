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
    badge: 'bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 text-white border-primary/50 shadow-[0_0_10px_rgba(139,92,246,0.25)] font-extrabold',
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
      gradient: 'from-[#7C3AED] to-[#8B5CF6]',
      bgTrack: 'bg-white/[0.05]',
      textAccent: 'text-white',
      icon: TrendingUp,
      iconColor: 'text-primary-soft',
      description: 'Alcance masivo, oyentes globales y demanda de conciertos.'
    },
    {
      id: 'reputation',
      label: 'Reputación Crítica',
      value: stats.reputation ?? 0,
      gradient: 'from-[#7C3AED] to-[#8B5CF6]',
      bgTrack: 'bg-white/[0.05]',
      textAccent: 'text-white',
      icon: ShieldCheck,
      iconColor: 'text-primary-soft',
      description: 'Respeto de la industria, prensa especializada y galas.'
    },
    {
      id: 'artisticCredibility',
      label: 'Credibilidad Artística',
      value: stats.artisticCredibility ?? 0,
      gradient: 'from-[#7C3AED] to-[#8B5CF6]',
      bgTrack: 'bg-white/[0.05]',
      textAccent: 'text-white',
      icon: Award,
      iconColor: 'text-primary-soft',
      description: 'Autenticidad sonora, estatus de culto y valor de catálogo.'
    },
    {
      id: 'fanbaseLoyalty',
      label: 'Fidelidad de Fans',
      value: stats.fanbaseLoyalty ?? 50,
      gradient: 'from-[#7C3AED] to-[#8B5CF6]',
      bgTrack: 'bg-white/[0.05]',
      textAccent: 'text-white',
      icon: Heart,
      iconColor: 'text-primary-soft',
      description: 'Comunidad devota, tickets asegurados y apoyo incondicional.'
    },
    {
      id: 'hype',
      label: 'Hype Escénico',
      value: stats.hype ?? 0,
      gradient: 'from-[#7C3AED] via-[#A855F7] to-[#EC4899]',
      bgTrack: 'bg-white/[0.05]',
      textAccent: 'text-white',
      icon: Flame,
      iconColor: 'text-primary-soft',
      description: 'Fervor viral del momento; decae mensualmente sin lanzamientos.'
    },
    {
      id: 'energy',
      label: 'Energía Vital',
      value: stats.energy ?? 100,
      gradient: (stats.energy ?? 100) >= 85 ? 'from-emerald-500 to-teal-400' : (stats.energy ?? 100) >= 40 ? 'from-amber-500 to-yellow-400' : 'from-rose-500 to-red-500',
      bgTrack: 'bg-white/[0.05]',
      textAccent: 'text-white',
      icon: Zap,
      iconColor: (stats.energy ?? 100) >= 85 ? 'text-emerald-400' : (stats.energy ?? 100) >= 40 ? 'text-amber-400' : 'text-rose-400',
      description: 'Condición física y mental para grabaciones en estudio y giras en vivo.'
    }
  ];

  // 2. Personalidad & Skills (10 atributos con barras limpias Obsidian en Violeta Neón)
  const personalitySkills = [
    {
      id: 'creativity',
      label: 'Creatividad & Vanguardia',
      val: personality.creativity ?? 26,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: Sparkles,
      iconColor: 'text-slate-400',
      description: 'Innovación conceptual, experimentación sonora y trascendencia artística en canciones.'
    },
    {
      id: 'skill',
      label: 'Habilidad Musical / Skill',
      val: personality.skill ?? 26,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: Music2,
      iconColor: 'text-slate-400',
      description: 'Técnica vocal, virtuosismo instrumental, métrica lírica y pulido en estudio.'
    },
    {
      id: 'charisma',
      label: 'Carisma & Presencia',
      val: personality.charisma ?? 24,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: Crown,
      iconColor: 'text-slate-400',
      description: 'Magnetismo mediático, impacto en directos, viralidad y conexión de masas.'
    },
    {
      id: 'commercialAppeal',
      label: 'Atractivo Comercial',
      val: personality.commercialAppeal ?? 22,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: DollarSign,
      iconColor: 'text-slate-400',
      description: 'Potencial de hits mundiales, rotación en playlists masivas y radio.'
    },
    {
      id: 'originality',
      label: 'Originalidad & Identidad',
      val: personality.originality ?? 25,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: Target,
      iconColor: 'text-slate-400',
      description: 'Sello sonoro inconfundible, distinción estilística y aclamación crítica.'
    },
    {
      id: 'discipline',
      label: 'Disciplina de Trabajo',
      val: personality.discipline ?? 24,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: ShieldCheck,
      iconColor: 'text-slate-400',
      description: 'Rigor profesional, menor fatiga en estudio y cumplimiento de fechas de lanzamiento.'
    },
    {
      id: 'ambition',
      label: 'Ambición de Éxito',
      val: personality.ambition ?? 24,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: Flame,
      iconColor: 'text-slate-400',
      description: 'Impulso por dominar las listas globales y escalar el tamaño de giras y recintos.'
    },
    {
      id: 'riskTolerance',
      label: 'Tolerancia al Riesgo',
      val: personality.riskTolerance ?? 24,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: Zap,
      iconColor: 'text-slate-400',
      description: 'Facilidad para transicionar de género musical y probar fórmulas conceptuales audaces.'
    },
    {
      id: 'sociability',
      label: 'Sociabilidad & Networking',
      val: personality.sociability ?? 22,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: Users,
      iconColor: 'text-slate-400',
      description: 'Afinidad con colegas de la industria, facilidad para colaboraciones y featurings estelares.'
    },
    {
      id: 'independence',
      label: 'Autonomía & Visión Indie',
      val: personality.independence ?? 24,
      gradient: 'from-[#7C3AED] to-[#A78BFA]',
      bgTrack: 'bg-white/[0.05]',
      icon: Compass,
      iconColor: 'text-slate-400',
      description: 'Control creativo, capacidad de autogestión y resistencia a imposiciones discográficas.'
    }
  ];

  return (
    <div
      className={`bg-surface border border-line rounded-2xl p-6 space-y-5 shadow-lg text-fg ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Encabezado con Título y Selector de Pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-canvas border border-line text-white">
              <Sliders className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-bold text-fg tracking-[-0.4px]">
              Perfil & Atributos del Artista
            </h2>
          </div>
          <p className="text-xs text-fg-muted mt-0.5">
            Métricas de rendimiento en vivo y habilidades intrínsecas con lectura visual rápida.
          </p>
        </div>

        {/* 1. Pestañas internas: Alternancia limpia */}
        <div className="flex items-center gap-1 bg-canvas p-1 rounded-lg border border-line shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`min-h-8 px-3.5 py-1.5 text-xs rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'main'
                ? 'bg-primary text-white shadow-xs'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Métricas Clave
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personality')}
            className={`min-h-8 px-3.5 py-1.5 text-xs rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'personality'
                ? 'bg-primary text-white shadow-xs'
                : 'text-fg-muted hover:text-fg'
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
                className={`bg-[#12141D] rounded-xl p-4 space-y-2.5 transition-all duration-200 border shadow-xs ${
                  isEnergy && isEnergyHighFatigue
                    ? 'border-rose-500/40 bg-rose-500/10'
                    : isEnergy && isEnergyMildFatigue
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-[#232738] hover:border-primary/40'
                }`}
              >
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">
                    {metric.label}
                  </span>
                  <div className="p-1 rounded-md bg-white/[0.04] border border-white/5">
                    <Icon className={`w-3.5 h-3.5 ${metric.iconColor}`} />
                  </div>
                </div>

                {/* Valor numérico & Badges de Estado */}
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold text-white tracking-tight font-mono tabular-nums">
                    {metric.value}
                    <span className="text-xs text-slate-500 font-normal font-sans"> / 100</span>
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
                      className={`text-2xs font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1 border transition-colors ${
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
                <div className="w-full bg-white/[0.06] border border-white/5 h-2 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`bg-gradient-to-r ${metric.gradient} h-full rounded-full transition-all duration-500 shadow-sm`}
                    role="progressbar"
                    aria-label={metric.label}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(Number(Math.min(100, Math.max(0, metric.value))))}
                    style={{ width: `${Math.min(100, Math.max(0, metric.value))}%` }}
                  />
                </div>

                {/* Descripción de impacto visual rápido */}
                <p className="text-3xs text-slate-400 leading-relaxed">
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
          <div className="bg-gradient-to-br from-[#0B0C10] to-[#13151D] border border-[#8B5CF6]/30 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/20 text-primary-soft">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-fg">
                    ¿Cómo progresar y entrenar tus Habilidades?
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Tus atributos definen la calidad final de tus temas, el carisma escénico y tu éxito comercial.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-2xs font-bold px-2 py-0.5 rounded-sm bg-primary/20 text-primary-soft border border-primary/40">
                  Escala 1 - 100
                </span>
                {player?.isProdigy && (
                  <span className="text-2xs font-bold px-2 py-0.5 rounded-sm bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 text-yellow-300 border border-yellow-400/50 flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3 text-amber-400" />
                    Prodigio x3
                  </span>
                )}
              </div>
            </div>

            {/* 4 Canales de Entrenamiento & Progresión */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface border border-line space-y-1 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-1.5 text-primary-soft font-bold text-xs">
                  <ShoppingBag className="w-3.5 h-3.5 text-primary-soft shrink-0" />
                  <span>1. Tienda & Masterclasses</span>
                </div>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Masterclasses, libros de teoría, coach vocal y equipamiento aumentan tus habilidades de forma <strong>permanente</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface border border-line space-y-1 hover:border-info/40 transition-colors">
                <div className="flex items-center gap-1.5 text-info font-bold text-xs">
                  <Music2 className="w-3.5 h-3.5 text-info shrink-0" />
                  <span>2. Grabaciones & Hits</span>
                </div>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Componer singles, EPs, álbumes y colaboraciones ejercita tu técnica, creatividad compositiva y originalidad.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface border border-line space-y-1 hover:border-amber-400/40 transition-colors">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>3. Decisiones & Prensa</span>
                </div>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Tus respuestas en dilemas narrativos, entrevistas y contratos discográficos forjan tu disciplina y tolerancia al riesgo.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface border border-line space-y-1 hover:border-emerald-400/40 transition-colors">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>4. Bienestar & Enfoque</span>
                </div>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Mantener la energía vital óptima (≥85%) previene bloqueos creativos y maximiza la inspiración en sesiones de estudio.
                </p>
              </div>
            </div>

            {/* Leyenda de Rangos de Nivel */}
            <div className="pt-2 border-t border-line flex items-center justify-between flex-wrap gap-2 text-2xs text-fg-muted">
              <span className="font-semibold text-fg">Rangos Oficiales de Nivel:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-sm bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 font-medium">
                  Principiante (1-30)
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-amber-950/60 text-amber-300 border border-amber-500/40 font-medium">
                  En Desarrollo (31-50)
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-medium">
                  Competente (51-70)
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-purple-950/60 text-purple-300 border border-purple-500/40 font-medium">
                  Avanzado (71-85)
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border border-yellow-400/50 font-bold">
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
                  className="bg-[#12141D] border border-[#232738] hover:border-primary/40 rounded-xl p-4 space-y-3 transition-all duration-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header de Atributo: Icono, Nombre, Badge de Nivel y Valor */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-white/[0.04] border border-white/5 shrink-0">
                          <Icon className={`w-4 h-4 ${trait.iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm leading-tight">
                              {trait.label}
                            </span>
                            <span className={`text-3xs font-bold px-2 py-0.5 rounded-sm border ${tierInfo.badge}`}>
                              {tierInfo.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono tabular-nums text-white font-bold text-xs bg-white/[0.04] border border-white/5 px-2.5 py-1 rounded-md shrink-0">
                        {trait.val}<span className="text-3xs text-slate-500 font-normal font-sans"> / 100</span>
                      </span>
                    </div>

                    {/* Barra de progreso temática */}
                    <div className="space-y-1">
                      <div className="w-full bg-white/[0.06] border border-white/5 h-2 rounded-full overflow-hidden p-0.5 relative">
                        <div
                          className={`bg-gradient-to-r ${trait.gradient} h-full rounded-full transition-all duration-500 shadow-sm`}
                          role="progressbar"
                          aria-label={trait.label}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(Number(Math.min(100, Math.max(0, trait.val))))}
                          style={{ width: `${Math.min(100, Math.max(0, trait.val))}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-3xs text-slate-500 font-mono px-0.5">
                        <span>1</span>
                        <span>30</span>
                        <span>50</span>
                        <span>70</span>
                        <span>85</span>
                        <span>100</span>
                      </div>
                    </div>

                    {/* Descripción de impacto visual */}
                    <p className="text-xs text-fg-muted leading-relaxed">
                      {trait.description}
                    </p>
                  </div>

                  {/* Indicador de Próximo Nivel / Rango */}
                  <div className="pt-2 border-t border-[#1C1F2A] flex items-center justify-between text-2xs">
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
                    <span className="text-2xs font-mono text-fg-subtle">
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
      <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-fg-muted">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-info" />
          <span>
            {activeTab === 'main'
              ? 'Las métricas se actualizan dinámicamente con tus lanzamientos, eventos y giras.'
              : 'Las habilidades se mejoran mediante práctica continua, lanzamientos, decisiones de carrera y compras en la tienda.'}
          </span>
        </div>
        <span className="text-xs font-bold text-primary-soft">
          {player?.name || 'Artista'} • {player?.careerStage || 'Underground'}
        </span>
      </div>
    </div>
  );
};

export default ArtistAttributesPanel;

