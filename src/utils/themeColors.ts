export interface GenreTheme {
  id: string;
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  gradient: string;
  accentHex: string;
  textClass: string;
  bgSoft: string;
  borderClass: string;
  cyberGlow?: string;
}

export const GENRE_THEMES: Record<string, GenreTheme> = {
  trap_latino: {
    id: 'trap_latino',
    name: 'Trap Latino',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/70',
    badgeText: 'text-purple-800 dark:text-purple-300',
    badgeBorder: 'border-purple-300 dark:border-purple-800/60',
    gradient: 'from-violet-600 to-purple-800',
    accentHex: '#8b5cf6',
    textClass: 'text-purple-700 dark:text-purple-400',
    bgSoft: 'bg-purple-50/70 dark:bg-purple-950/30',
    borderClass: 'border-purple-200 dark:border-purple-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(139,92,246,0.35)]'
  },
  reggaeton: {
    id: 'reggaeton',
    name: 'Reggaetón & Urbano',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/70',
    badgeText: 'text-amber-900 dark:text-amber-300',
    badgeBorder: 'border-amber-300 dark:border-amber-800/60',
    gradient: 'from-amber-500 to-orange-600',
    accentHex: '#f59e0b',
    textClass: 'text-amber-800 dark:text-amber-400',
    bgSoft: 'bg-amber-50/70 dark:bg-amber-950/30',
    borderClass: 'border-amber-200 dark:border-amber-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]'
  },
  pop_moderno: {
    id: 'pop_moderno',
    name: 'Pop Moderno & Alt-Pop',
    badgeBg: 'bg-pink-100 dark:bg-pink-950/70',
    badgeText: 'text-pink-900 dark:text-pink-300',
    badgeBorder: 'border-pink-300 dark:border-pink-800/60',
    gradient: 'from-pink-500 to-rose-500',
    accentHex: '#ec4899',
    textClass: 'text-pink-700 dark:text-pink-400',
    bgSoft: 'bg-pink-50/70 dark:bg-pink-950/30',
    borderClass: 'border-pink-200 dark:border-pink-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]'
  },
  r_and_b_soul: {
    id: 'r_and_b_soul',
    name: 'R&B & Neo-Soul',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/70',
    badgeText: 'text-indigo-900 dark:text-indigo-300',
    badgeBorder: 'border-indigo-300 dark:border-indigo-800/60',
    gradient: 'from-indigo-600 to-blue-600',
    accentHex: '#6366f1',
    textClass: 'text-indigo-700 dark:text-indigo-400',
    bgSoft: 'bg-indigo-50/70 dark:bg-indigo-950/30',
    borderClass: 'border-indigo-200 dark:border-indigo-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(99,102,241,0.35)]'
  },
  drill: {
    id: 'drill',
    name: 'Drill & Grime',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/70',
    badgeText: 'text-rose-900 dark:text-rose-300',
    badgeBorder: 'border-rose-300 dark:border-rose-800/60',
    gradient: 'from-red-600 to-rose-700',
    accentHex: '#e11d48',
    textClass: 'text-rose-700 dark:text-rose-400',
    bgSoft: 'bg-rose-50/70 dark:bg-rose-950/30',
    borderClass: 'border-rose-200 dark:border-rose-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(225,29,72,0.35)]'
  },
  rock_alternativo: {
    id: 'rock_alternativo',
    name: 'Rock Alternativo & Indie',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70',
    badgeText: 'text-emerald-900 dark:text-emerald-300',
    badgeBorder: 'border-emerald-300 dark:border-emerald-800/60',
    gradient: 'from-emerald-600 to-teal-600',
    accentHex: '#10b981',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    bgSoft: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    borderClass: 'border-emerald-200 dark:border-emerald-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]'
  },
  hip_hop_rap: {
    id: 'hip_hop_rap',
    name: 'Hip Hop & Rap',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-950/70',
    badgeText: 'text-yellow-900 dark:text-yellow-300',
    badgeBorder: 'border-yellow-300 dark:border-yellow-800/60',
    gradient: 'from-amber-600 to-yellow-600',
    accentHex: '#d97706',
    textClass: 'text-amber-800 dark:text-amber-400',
    bgSoft: 'bg-yellow-50/70 dark:bg-yellow-950/30',
    borderClass: 'border-amber-200 dark:border-amber-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(217,119,6,0.35)]'
  },
  musica_electronica: {
    id: 'musica_electronica',
    name: 'Electrónica & House',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950/70',
    badgeText: 'text-cyan-900 dark:text-cyan-300',
    badgeBorder: 'border-cyan-300 dark:border-cyan-800/60',
    gradient: 'from-cyan-500 to-blue-600',
    accentHex: '#06b6d4',
    textClass: 'text-cyan-700 dark:text-cyan-400',
    bgSoft: 'bg-cyan-50/70 dark:bg-cyan-950/30',
    borderClass: 'border-cyan-200 dark:border-cyan-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.35)]'
  },
  afrobeat_dancehall: {
    id: 'afrobeat_dancehall',
    name: 'Afrobeats & Dancehall',
    badgeBg: 'bg-orange-100 dark:bg-orange-950/70',
    badgeText: 'text-orange-900 dark:text-orange-300',
    badgeBorder: 'border-orange-300 dark:border-orange-800/60',
    gradient: 'from-orange-500 to-amber-500',
    accentHex: '#f97316',
    textClass: 'text-orange-800 dark:text-orange-400',
    bgSoft: 'bg-orange-50/70 dark:bg-orange-950/30',
    borderClass: 'border-orange-200 dark:border-orange-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(249,115,22,0.35)]'
  },
  corridos_urbanos: {
    id: 'corridos_urbanos',
    name: 'Corridos Tumbados & Regional',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/70',
    badgeText: 'text-amber-950 dark:text-amber-200',
    badgeBorder: 'border-amber-400 dark:border-amber-800/60',
    gradient: 'from-red-700 via-orange-600 to-amber-600',
    accentHex: '#b45309',
    textClass: 'text-amber-900 dark:text-amber-400',
    bgSoft: 'bg-orange-50/70 dark:bg-orange-950/30',
    borderClass: 'border-amber-300 dark:border-amber-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(180,83,9,0.35)]'
  }
};

const DEFAULT_GENRE_THEME: GenreTheme = {
  id: 'default',
  name: 'Música Urbana',
  badgeBg: 'bg-purple-100 dark:bg-purple-950/70',
  badgeText: 'text-purple-800 dark:text-purple-300',
  badgeBorder: 'border-purple-300 dark:border-purple-800/60',
  gradient: 'from-purple-600 to-indigo-600',
  accentHex: '#8b5cf6',
  textClass: 'text-purple-700 dark:text-purple-400',
  bgSoft: 'bg-purple-50/70 dark:bg-purple-950/30',
  borderClass: 'border-purple-200 dark:border-purple-800/40',
  cyberGlow: 'shadow-[0_0_20px_rgba(139,92,246,0.35)]'
};

export function getGenreTheme(genreId?: string): GenreTheme {
  if (!genreId) return DEFAULT_GENRE_THEME;
  return GENRE_THEMES[genreId] || DEFAULT_GENRE_THEME;
}

export function getGenreBadgeClass(genreId?: string): string {
  const theme = getGenreTheme(genreId);
  return `${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`;
}

/* ========================================================================= */
/* 2. CHROMATIC ATTRIBUTE VISUAL CONFIGURATION (Exact Spec) */
/* ========================================================================= */

export interface AttributeVisualConfig {
  id: string;
  label: string;
  gradient: string;
  barGradientClass: string;
  bgTrack: string;
  glowClass: string;
  textAccent: string;
  iconColor: string;
  borderHoverClass: string;
  hexFrom: string;
  hexTo: string;
  description: string;
}

export const ATTRIBUTE_VISUAL_CONFIG: Record<string, AttributeVisualConfig> = {
  popularity: {
    id: 'popularity',
    label: 'Popularidad',
    gradient: 'from-amber-400 to-yellow-500',
    barGradientClass: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    bgTrack: 'bg-amber-100/70 dark:bg-amber-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    textAccent: 'text-amber-900 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderHoverClass: 'hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    hexFrom: '#fbbf24',
    hexTo: '#eab308',
    description: 'Alcance masivo, oyentes globales y demanda de conciertos.'
  },
  reputation: {
    id: 'reputation',
    label: 'Reputación Crítica',
    gradient: 'from-cyan-400 to-blue-500',
    barGradientClass: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    bgTrack: 'bg-cyan-100/70 dark:bg-cyan-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    textAccent: 'text-cyan-900 dark:text-cyan-400',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    borderHoverClass: 'hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    hexFrom: '#22d3ee',
    hexTo: '#3b82f6',
    description: 'Respeto de la industria, prensa especializada y galas de premios.'
  },
  artisticCredibility: {
    id: 'artisticCredibility',
    label: 'Credibilidad Artística',
    gradient: 'from-purple-500 to-indigo-500',
    barGradientClass: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    bgTrack: 'bg-purple-100/70 dark:bg-purple-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    textAccent: 'text-purple-900 dark:text-purple-400',
    iconColor: 'text-purple-600 dark:text-purple-400',
    borderHoverClass: 'hover:border-purple-400/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    hexFrom: '#a855f7',
    hexTo: '#6366f1',
    description: 'Autenticidad sonora, estatus de culto y valor trascendente de catálogo.'
  },
  fanbaseLoyalty: {
    id: 'fanbaseLoyalty',
    label: 'Fidelidad de Fans',
    gradient: 'from-pink-500 to-rose-600',
    barGradientClass: 'bg-gradient-to-r from-pink-500 to-rose-600',
    bgTrack: 'bg-pink-100/70 dark:bg-pink-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(236,72,153,0.4)]',
    textAccent: 'text-rose-900 dark:text-pink-400',
    iconColor: 'text-rose-600 dark:text-pink-400',
    borderHoverClass: 'hover:border-pink-400/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]',
    hexFrom: '#ec4899',
    hexTo: '#e11d48',
    description: 'Comunidad devota, tickets asegurados y apoyo incondicional.'
  },
  hype: {
    id: 'hype',
    label: 'Hype Escénico',
    gradient: 'from-orange-500 to-amber-600',
    barGradientClass: 'bg-gradient-to-r from-orange-500 to-amber-600',
    bgTrack: 'bg-orange-100/70 dark:bg-orange-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]',
    textAccent: 'text-orange-900 dark:text-orange-400',
    iconColor: 'text-orange-600 dark:text-orange-400',
    borderHoverClass: 'hover:border-orange-400/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]',
    hexFrom: '#f97316',
    hexTo: '#d97706',
    description: 'Fervor viral del momento; decae mensualmente sin lanzamientos.'
  },
  energy: {
    id: 'energy',
    label: 'Energía Vital',
    gradient: 'from-emerald-400 to-teal-500',
    barGradientClass: 'bg-gradient-to-r from-emerald-400 to-teal-500',
    bgTrack: 'bg-emerald-100/70 dark:bg-emerald-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
    textAccent: 'text-emerald-900 dark:text-emerald-400',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderHoverClass: 'hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    hexFrom: '#34d399',
    hexTo: '#14b8a6',
    description: 'Condición física y mental para grabaciones y exigentes giras.'
  }
};

export function getAttributeConfig(attributeId: string): AttributeVisualConfig {
  return ATTRIBUTE_VISUAL_CONFIG[attributeId] || ATTRIBUTE_VISUAL_CONFIG.popularity;
}

export interface StatTheme {
  barGradient: string;
  gradient?: string;
  textColor: string;
  iconColor: string;
  iconBg: string;
  cardBg: string;
  borderColor: string;
  borderHover?: string;
  glowClass?: string;
}

export const STAT_THEMES = {
  energy: (val: number): StatTheme => {
    if (val >= 85) {
      return {
        barGradient: 'bg-gradient-to-r from-emerald-400 to-teal-500',
        gradient: 'from-emerald-400 to-teal-500',
        textColor: 'text-emerald-800 dark:text-emerald-400',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-100 dark:bg-emerald-950/60',
        cardBg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
        borderColor: 'border-emerald-200 dark:border-emerald-800/50',
        borderHover: 'hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]',
        glowClass: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]'
      };
    } else if (val >= 40) {
      return {
        barGradient: 'bg-gradient-to-r from-amber-400 to-orange-500',
        gradient: 'from-amber-400 to-orange-500',
        textColor: 'text-amber-800 dark:text-amber-400',
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-950/60',
        cardBg: 'bg-amber-50/40 dark:bg-amber-950/20',
        borderColor: 'border-amber-200 dark:border-amber-800/50',
        borderHover: 'hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]',
        glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]'
      };
    } else {
      return {
        barGradient: 'bg-gradient-to-r from-rose-500 to-red-600',
        gradient: 'from-rose-500 to-red-600',
        textColor: 'text-rose-800 dark:text-rose-400',
        iconColor: 'text-rose-600 dark:text-rose-400',
        iconBg: 'bg-rose-100 dark:bg-rose-950/60',
        cardBg: 'bg-rose-50/60 dark:bg-rose-950/30',
        borderColor: 'border-rose-200 dark:border-rose-800/50',
        borderHover: 'hover:border-rose-400/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.25)]',
        glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]'
      };
    }
  },
  popularity: {
    barGradient: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    gradient: 'from-amber-400 to-yellow-500',
    textColor: 'text-amber-800 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60',
    cardBg: 'bg-amber-50/30 dark:bg-amber-950/20',
    borderColor: 'border-amber-200 dark:border-amber-800/50',
    borderHover: 'hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    glowClass: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]'
  },
  reputation: {
    barGradient: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    gradient: 'from-cyan-400 to-blue-500',
    textColor: 'text-blue-800 dark:text-cyan-400',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-100 dark:bg-cyan-950/60',
    cardBg: 'bg-cyan-50/30 dark:bg-cyan-950/20',
    borderColor: 'border-cyan-200 dark:border-cyan-800/50',
    borderHover: 'hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    glowClass: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]'
  },
  artisticCredibility: {
    barGradient: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    gradient: 'from-purple-500 to-indigo-500',
    textColor: 'text-purple-800 dark:text-purple-400',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-950/60',
    cardBg: 'bg-purple-50/30 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800/50',
    borderHover: 'hover:border-purple-400/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]'
  },
  hype: {
    barGradient: 'bg-gradient-to-r from-orange-500 to-amber-600',
    gradient: 'from-orange-500 to-amber-600',
    textColor: 'text-orange-800 dark:text-orange-400',
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-950/60',
    cardBg: 'bg-orange-50/30 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800/50',
    borderHover: 'hover:border-orange-400/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]',
    glowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]'
  },
  fanbaseLoyalty: {
    barGradient: 'bg-gradient-to-r from-pink-500 to-rose-600',
    gradient: 'from-pink-500 to-rose-600',
    textColor: 'text-pink-800 dark:text-pink-400',
    iconColor: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-100 dark:bg-pink-950/60',
    cardBg: 'bg-pink-50/30 dark:bg-pink-950/20',
    borderColor: 'border-pink-200 dark:border-pink-800/50',
    borderHover: 'hover:border-pink-400/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]',
    glowClass: 'shadow-[0_0_15px_rgba(236,72,153,0.4)]'
  },
  funds: {
    barGradient: 'bg-gradient-to-r from-emerald-500 to-green-600',
    gradient: 'from-emerald-500 to-green-600',
    textColor: 'text-emerald-800 dark:text-emerald-400',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    cardBg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800/50',
    borderHover: 'hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]'
  },
  fansCount: {
    barGradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    gradient: 'from-indigo-500 to-purple-600',
    textColor: 'text-indigo-800 dark:text-indigo-400',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-100 dark:bg-indigo-950/60',
    cardBg: 'bg-indigo-50/30 dark:bg-indigo-950/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800/50',
    borderHover: 'hover:border-indigo-400/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]',
    glowClass: 'shadow-[0_0_15px_rgba(99,102,241,0.4)]'
  }
};

/* ========================================================================= */
/* 3. LIFESTYLE & STUDIO THEMES */
/* ========================================================================= */

export const LIFESTYLE_THEMES = {
  studio: {
    cardBorder: 'border-cyan-200 dark:border-cyan-800/60 hover:border-cyan-400 dark:hover:border-cyan-400/80',
    iconBg: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60',
    badge: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
    accentText: 'text-cyan-700 dark:text-cyan-400',
    lightBg: 'bg-cyan-50/40 dark:bg-cyan-950/20',
    glow: 'rgba(6, 182, 212, 0.25)'
  },
  real_estate: {
    cardBorder: 'border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400 dark:hover:border-emerald-400/80',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
    badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    accentText: 'text-emerald-700 dark:text-emerald-400',
    lightBg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
    glow: 'rgba(16, 185, 129, 0.25)'
  },
  vehicles: {
    cardBorder: 'border-rose-200 dark:border-rose-800/60 hover:border-rose-400 dark:hover:border-rose-400/80',
    iconBg: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
    badge: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    accentText: 'text-rose-700 dark:text-rose-400',
    lightBg: 'bg-rose-50/40 dark:bg-rose-950/20',
    glow: 'rgba(244, 63, 94, 0.25)'
  },
  coaching: {
    cardBorder: 'border-purple-200 dark:border-purple-800/60 hover:border-purple-400 dark:hover:border-purple-400/80',
    iconBg: 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60',
    badge: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    accentText: 'text-purple-700 dark:text-purple-400',
    lightBg: 'bg-purple-50/40 dark:bg-purple-950/20',
    glow: 'rgba(139, 92, 246, 0.25)'
  }
};

/* ========================================================================= */
/* 4. RELEASE BADGES & COVERS */
/* ========================================================================= */

export const RELEASE_BADGES = {
  viral: 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold shadow-sm px-2 py-0.5 rounded-[4px] shadow-[0_0_12px_rgba(217,70,239,0.35)]',
  viralSoft: 'bg-fuchsia-100 dark:bg-fuchsia-950/60 text-fuchsia-800 dark:text-fuchsia-300 border border-fuchsia-300 dark:border-fuchsia-800/60 font-semibold px-2 py-0.5 rounded-[4px]',
  hitTop10: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-sm px-2 py-0.5 rounded-[4px] shadow-[0_0_12px_rgba(249,115,22,0.35)]',
  hitTop10Soft: 'bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-300 dark:border-orange-800/60 font-semibold px-2 py-0.5 rounded-[4px]',
  classic: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-bold shadow-sm px-2 py-0.5 rounded-[4px] shadow-[0_0_12px_rgba(245,158,11,0.35)]',
  classicSoft: 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 font-bold px-2 py-0.5 rounded-[4px]',
  no1: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-500 text-white font-bold shadow-sm px-2 py-0.5 rounded-[4px] shadow-[0_0_15px_rgba(251,191,36,0.45)]',
  single: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-medium px-2 py-0.5 rounded-[4px]',
  album: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 font-medium px-2 py-0.5 rounded-[4px]'
};

export const ARTISTIC_COVER_GRADIENTS = [
  'from-violet-600 via-fuchsia-600 to-indigo-900',
  'from-amber-500 via-rose-600 to-purple-900',
  'from-cyan-500 via-blue-600 to-indigo-900',
  'from-emerald-500 via-teal-600 to-cyan-900',
  'from-rose-500 via-pink-600 to-purple-900',
  'from-orange-500 via-amber-600 to-red-800',
  'from-purple-600 via-indigo-700 to-slate-900',
  'from-teal-400 via-emerald-600 to-slate-900',
  'from-fuchsia-600 via-purple-700 to-pink-900',
  'from-yellow-500 via-orange-600 to-red-700'
];

/* ========================================================================= */
/* 5. CYBER-MUSIC STUDIO DESIGN TOKENS & UTILITIES */
/* ========================================================================= */

export const CYBER_STUDIO_THEME = {
  palette: {
    bgDeep: '#0b0d13',
    bgSurface: '#0f1117',
    glassSlate: 'rgba(15, 23, 42, 0.6)',
    glassDeep: 'rgba(11, 13, 19, 0.75)',
    borderSubtle: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.3)'
  },
  aurora: {
    cyan: 'radial-gradient(circle at 15% 15%, rgba(6, 182, 212, 0.15) 0%, transparent 45%)',
    purple: 'radial-gradient(circle at 85% 20%, rgba(147, 51, 234, 0.16) 0%, transparent 50%)',
    magenta: 'radial-gradient(circle at 50% 85%, rgba(236, 72, 153, 0.12) 0%, transparent 45%)'
  },
  classes: {
    card: 'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl',
    cardHover: 'hover:border-white/25 hover:shadow-[0_0_25px_rgba(147,51,234,0.25)] hover:scale-[1.02] transition-all duration-300 ease-out',
    panel: 'bg-slate-950/75 backdrop-blur-2xl border border-white/10 shadow-2xl',
    input: 'bg-slate-900/70 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white placeholder-slate-400',
    badge: 'bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-semibold px-2.5 py-0.5 rounded-[9999px]',
    glowCyan: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    glowPurple: 'shadow-[0_0_25px_rgba(147,51,234,0.25)]',
    glowMagenta: 'shadow-[0_0_25px_rgba(236,72,153,0.25)]',
    glowAmber: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    glowEmerald: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    glowRose: 'shadow-[0_0_25px_rgba(244,63,94,0.25)]'
  },
  microInteractions: {
    hoverScale: 'hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 ease-out',
    fontTabular: 'font-mono tabular-nums tracking-tight',
    smoothTransition: 'transition-all duration-250 cubic-bezier(0.16, 1, 0.3, 1)'
  }
};

export function getCyberGlowClass(color: 'cyan' | 'purple' | 'magenta' | 'amber' | 'emerald' | 'rose'): string {
  switch (color) {
    case 'cyan':
      return CYBER_STUDIO_THEME.classes.glowCyan;
    case 'purple':
      return CYBER_STUDIO_THEME.classes.glowPurple;
    case 'magenta':
      return CYBER_STUDIO_THEME.classes.glowMagenta;
    case 'amber':
      return CYBER_STUDIO_THEME.classes.glowAmber;
    case 'emerald':
      return CYBER_STUDIO_THEME.classes.glowEmerald;
    case 'rose':
      return CYBER_STUDIO_THEME.classes.glowRose;
    default:
      return CYBER_STUDIO_THEME.classes.glowPurple;
  }
}

export function formatTabularNumber(num: number): string {
  return num.toLocaleString();
}

export function formatTabularCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

