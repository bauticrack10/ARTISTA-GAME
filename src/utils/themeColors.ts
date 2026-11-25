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
    badgeBg: 'bg-orange-950/70',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-700/60',
    gradient: 'from-orange-600 to-amber-700',
    accentHex: '#FF4F00',
    textClass: 'text-orange-400',
    bgSoft: 'bg-orange-950/30',
    borderClass: 'border-orange-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(255,79,0,0.28)]'
  },
  reggaeton: {
    id: 'reggaeton',
    name: 'Reggaetón & Urbano',
    badgeBg: 'bg-amber-950/70',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-700/60',
    gradient: 'from-amber-500 to-orange-600',
    accentHex: '#F59E0B',
    textClass: 'text-amber-400',
    bgSoft: 'bg-amber-950/30',
    borderClass: 'border-amber-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.28)]'
  },
  hip_hop_rap: {
    id: 'hip_hop_rap',
    name: 'Hip Hop & Rap',
    badgeBg: 'bg-yellow-950/70',
    badgeText: 'text-yellow-300',
    badgeBorder: 'border-yellow-700/60',
    gradient: 'from-amber-600 to-yellow-600',
    accentHex: '#D97706',
    textClass: 'text-amber-400',
    bgSoft: 'bg-yellow-950/30',
    borderClass: 'border-amber-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(217,119,6,0.28)]'
  },
  pop_moderno: {
    id: 'pop_moderno',
    name: 'Pop Moderno & Alt-Pop',
    badgeBg: 'bg-red-950/70',
    badgeText: 'text-red-300',
    badgeBorder: 'border-red-700/60',
    gradient: 'from-red-600 to-orange-600',
    accentHex: '#FF2A4B',
    textClass: 'text-red-400',
    bgSoft: 'bg-red-950/30',
    borderClass: 'border-red-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(255,42,75,0.28)]'
  },
  r_and_b_soul: {
    id: 'r_and_b_soul',
    name: 'R&B & Neo-Soul',
    badgeBg: 'bg-amber-950/70',
    badgeText: 'text-amber-200',
    badgeBorder: 'border-amber-700/60',
    gradient: 'from-amber-600 to-stone-700',
    accentHex: '#D4AF37',
    textClass: 'text-amber-300',
    bgSoft: 'bg-amber-950/30',
    borderClass: 'border-amber-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(212,175,55,0.28)]'
  },
  rock_alternativo: {
    id: 'rock_alternativo',
    name: 'Rock Alternativo & Indie',
    badgeBg: 'bg-emerald-950/70',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-700/60',
    gradient: 'from-emerald-600 to-teal-700',
    accentHex: '#10B981',
    textClass: 'text-emerald-400',
    bgSoft: 'bg-emerald-950/30',
    borderClass: 'border-emerald-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.28)]'
  },
  musica_electronica: {
    id: 'musica_electronica',
    name: 'Electrónica & House',
    badgeBg: 'bg-sky-950/70',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-700/60',
    gradient: 'from-sky-500 to-cyan-700',
    accentHex: '#38BDF8',
    textClass: 'text-sky-400',
    bgSoft: 'bg-sky-950/30',
    borderClass: 'border-sky-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(56,189,248,0.28)]'
  },
  drill: {
    id: 'drill',
    name: 'Drill & Grime',
    badgeBg: 'bg-red-950/75',
    badgeText: 'text-red-300',
    badgeBorder: 'border-red-800/60',
    gradient: 'from-red-700 to-zinc-800',
    accentHex: '#EF4444',
    textClass: 'text-red-400',
    bgSoft: 'bg-red-950/30',
    borderClass: 'border-red-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(239,68,68,0.28)]'
  },
  afrobeat_dancehall: {
    id: 'afrobeat_dancehall',
    name: 'Afrobeats & Dancehall',
    badgeBg: 'bg-orange-950/70',
    badgeText: 'text-orange-200',
    badgeBorder: 'border-orange-700/60',
    gradient: 'from-orange-500 to-amber-600',
    accentHex: '#EA580C',
    textClass: 'text-orange-400',
    bgSoft: 'bg-orange-950/30',
    borderClass: 'border-orange-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(234,88,12,0.28)]'
  },
  corridos_urbanos: {
    id: 'corridos_urbanos',
    name: 'Corridos Tumbados & Regional',
    badgeBg: 'bg-amber-950/75',
    badgeText: 'text-amber-200',
    badgeBorder: 'border-amber-700/60',
    gradient: 'from-red-800 via-orange-700 to-amber-600',
    accentHex: '#B45309',
    textClass: 'text-amber-400',
    bgSoft: 'bg-orange-950/30',
    borderClass: 'border-amber-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(180,83,9,0.28)]'
  },
  kpop_jpop: {
    id: 'kpop_jpop',
    name: 'K-Pop & J-Pop',
    badgeBg: 'bg-sky-950/70',
    badgeText: 'text-sky-200',
    badgeBorder: 'border-sky-600/50',
    gradient: 'from-sky-400 to-teal-600',
    accentHex: '#38BDF8',
    textClass: 'text-sky-300',
    bgSoft: 'bg-sky-950/30',
    borderClass: 'border-sky-700/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(56,189,248,0.28)]'
  },
  cumbia_tropical: {
    id: 'cumbia_tropical',
    name: 'Cumbia & Música Tropical',
    badgeBg: 'bg-emerald-950/70',
    badgeText: 'text-emerald-200',
    badgeBorder: 'border-emerald-600/50',
    gradient: 'from-emerald-500 to-lime-600',
    accentHex: '#10B981',
    textClass: 'text-emerald-400',
    bgSoft: 'bg-emerald-950/30',
    borderClass: 'border-emerald-700/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.28)]'
  },
  metal_punk: {
    id: 'metal_punk',
    name: 'Metal & Punk Rock',
    badgeBg: 'bg-zinc-900',
    badgeText: 'text-red-300',
    badgeBorder: 'border-red-800/60',
    gradient: 'from-zinc-700 via-red-800 to-zinc-950',
    accentHex: '#DC2626',
    textClass: 'text-red-400',
    bgSoft: 'bg-zinc-900/80',
    borderClass: 'border-zinc-700',
    cyberGlow: 'shadow-[0_0_20px_rgba(220,38,38,0.28)]'
  },
  country_folk: {
    id: 'country_folk',
    name: 'Country & Folk / Americana',
    badgeBg: 'bg-stone-900',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-800/50',
    gradient: 'from-amber-700 to-stone-800',
    accentHex: '#D97706',
    textClass: 'text-amber-400',
    bgSoft: 'bg-stone-900/70',
    borderClass: 'border-stone-700',
    cyberGlow: 'shadow-[0_0_20px_rgba(217,119,6,0.25)]'
  },
  jazz_bossa: {
    id: 'jazz_bossa',
    name: 'Jazz & Bossa Nova / MPB',
    badgeBg: 'bg-teal-950/70',
    badgeText: 'text-teal-200',
    badgeBorder: 'border-teal-700/60',
    gradient: 'from-teal-600 to-slate-800',
    accentHex: '#14B8A6',
    textClass: 'text-teal-400',
    bgSoft: 'bg-teal-950/30',
    borderClass: 'border-teal-800/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(20,184,166,0.25)]'
  },
  funk_brasilero: {
    id: 'funk_brasilero',
    name: 'Funk Brasileño & Baile Funk',
    badgeBg: 'bg-orange-950/75',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-orange-600/60',
    gradient: 'from-orange-500 via-amber-500 to-red-600',
    accentHex: '#FF4F00',
    textClass: 'text-orange-400',
    bgSoft: 'bg-orange-950/30',
    borderClass: 'border-orange-700/40',
    cyberGlow: 'shadow-[0_0_20px_rgba(255,79,0,0.3)]'
  }
};

const DEFAULT_GENRE_THEME: GenreTheme = {
  id: 'default',
  name: 'Música Urbana',
  badgeBg: 'bg-orange-950/70',
  badgeText: 'text-orange-300',
  badgeBorder: 'border-orange-700/60',
  gradient: 'from-orange-600 to-amber-600',
  accentHex: '#FF4F00',
  textClass: 'text-orange-400',
  bgSoft: 'bg-orange-950/30',
  borderClass: 'border-orange-800/40',
  cyberGlow: 'shadow-[0_0_20px_rgba(255,79,0,0.28)]'
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
/* 2. CHROMATIC ATTRIBUTE VISUAL CONFIGURATION */
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
    bgTrack: 'bg-amber-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    textAccent: 'text-amber-400',
    iconColor: 'text-amber-400',
    borderHoverClass: 'hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    hexFrom: '#F59E0B',
    hexTo: '#EAB308',
    description: 'Define cuántos tickets vendés al abrir boletería y qué tan arriba negociás tu caché en festivales.'
  },
  reputation: {
    id: 'reputation',
    label: 'Reputación Crítica',
    gradient: 'from-sky-400 to-cyan-500',
    barGradientClass: 'bg-gradient-to-r from-sky-400 to-cyan-500',
    bgTrack: 'bg-sky-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.35)]',
    textAccent: 'text-sky-400',
    iconColor: 'text-sky-400',
    borderHoverClass: 'hover:border-sky-400/60 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]',
    hexFrom: '#38BDF8',
    hexTo: '#0EA5E9',
    description: 'Determina si la prensa especializada reseña tus discos y qué productores de primera línea aceptan atenderte el teléfono.'
  },
  artisticCredibility: {
    id: 'artisticCredibility',
    label: 'Credibilidad Artística',
    gradient: 'from-amber-500 to-orange-600',
    barGradientClass: 'bg-gradient-to-r from-amber-500 to-orange-600',
    bgTrack: 'bg-amber-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(212,175,55,0.35)]',
    textAccent: 'text-amber-400',
    iconColor: 'text-amber-400',
    borderHoverClass: 'hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]',
    hexFrom: '#D4AF37',
    hexTo: '#D97706',
    description: 'Mide cuánto respetan tu obra tus propios colegas. Sube al arriesgar en el estudio; cae en picada si vendés tu sonido por un jingle.'
  },
  fanbaseLoyalty: {
    id: 'fanbaseLoyalty',
    label: 'Fidelidad de Fans',
    gradient: 'from-red-500 to-orange-600',
    barGradientClass: 'bg-gradient-to-r from-red-500 to-orange-600',
    bgTrack: 'bg-red-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(255,42,75,0.35)]',
    textAccent: 'text-red-400',
    iconColor: 'text-red-400',
    borderHoverClass: 'hover:border-red-400/60 hover:shadow-[0_0_20px_rgba(255,42,75,0.2)]',
    hexFrom: '#FF2A4B',
    hexTo: '#DC2626',
    description: 'El núcleo duro que agota tus preventas en diez minutos y defiende tus discos incluso cuando la crítica te da la espalda.'
  },
  hype: {
    id: 'hype',
    label: 'Hype Escénico',
    gradient: 'from-orange-500 to-amber-600',
    barGradientClass: 'bg-gradient-to-r from-orange-500 to-amber-600',
    bgTrack: 'bg-orange-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(255,79,0,0.35)]',
    textAccent: 'text-orange-400',
    iconColor: 'text-orange-400',
    borderHoverClass: 'hover:border-orange-400/60 hover:shadow-[0_0_20px_rgba(255,79,0,0.2)]',
    hexFrom: '#FF4F00',
    hexTo: '#D97706',
    description: 'La conversación caliente alrededor de tu nombre esta semana. Si pasás meses sin sacar música ni pisar un escenario, se enfría rápido.'
  },
  energy: {
    id: 'energy',
    label: 'Energía Vital',
    gradient: 'from-emerald-400 to-teal-500',
    barGradientClass: 'bg-gradient-to-r from-emerald-400 to-teal-500',
    bgTrack: 'bg-emerald-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    textAccent: 'text-emerald-400',
    iconColor: 'text-emerald-400',
    borderHoverClass: 'hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    hexFrom: '#10B981',
    hexTo: '#14B8A6',
    description: 'Cuántas horas de estudio y vuelos de gira aguantás antes de quedarte sin voz o cancelar fechas por agotamiento.'
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
        textColor: 'text-emerald-400',
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-950/60',
        cardBg: 'bg-emerald-950/20',
        borderColor: 'border-emerald-800/50',
        borderHover: 'hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
        glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]'
      };
    } else if (val >= 40) {
      return {
        barGradient: 'bg-gradient-to-r from-amber-400 to-orange-500',
        gradient: 'from-amber-400 to-orange-500',
        textColor: 'text-amber-400',
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-950/60',
        cardBg: 'bg-amber-950/20',
        borderColor: 'border-amber-800/50',
        borderHover: 'hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
        glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]'
      };
    } else {
      return {
        barGradient: 'bg-gradient-to-r from-red-500 to-red-600',
        gradient: 'from-red-500 to-red-600',
        textColor: 'text-red-400',
        iconColor: 'text-red-400',
        iconBg: 'bg-red-950/60',
        cardBg: 'bg-red-950/30',
        borderColor: 'border-red-800/50',
        borderHover: 'hover:border-red-400/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]',
        glowClass: 'shadow-[0_0_15px_rgba(239,68,68,0.35)]'
      };
    }
  },
  popularity: {
    barGradient: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    gradient: 'from-amber-400 to-yellow-500',
    textColor: 'text-amber-400',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-950/60',
    cardBg: 'bg-amber-950/20',
    borderColor: 'border-amber-800/50',
    borderHover: 'hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]'
  },
  reputation: {
    barGradient: 'bg-gradient-to-r from-sky-400 to-cyan-500',
    gradient: 'from-sky-400 to-cyan-500',
    textColor: 'text-sky-400',
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-950/60',
    cardBg: 'bg-sky-950/20',
    borderColor: 'border-sky-800/50',
    borderHover: 'hover:border-sky-400/60 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]',
    glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.35)]'
  },
  artisticCredibility: {
    barGradient: 'bg-gradient-to-r from-amber-500 to-orange-600',
    gradient: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-400',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-950/60',
    cardBg: 'bg-amber-950/20',
    borderColor: 'border-amber-800/50',
    borderHover: 'hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]',
    glowClass: 'shadow-[0_0_15px_rgba(212,175,55,0.35)]'
  },
  hype: {
    barGradient: 'bg-gradient-to-r from-orange-500 to-amber-600',
    gradient: 'from-orange-500 to-amber-600',
    textColor: 'text-orange-400',
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-950/60',
    cardBg: 'bg-orange-950/20',
    borderColor: 'border-orange-800/50',
    borderHover: 'hover:border-orange-400/60 hover:shadow-[0_0_20px_rgba(255,79,0,0.2)]',
    glowClass: 'shadow-[0_0_15px_rgba(255,79,0,0.35)]'
  },
  fanbaseLoyalty: {
    barGradient: 'bg-gradient-to-r from-red-500 to-orange-600',
    gradient: 'from-red-500 to-orange-600',
    textColor: 'text-red-400',
    iconColor: 'text-red-400',
    iconBg: 'bg-red-950/60',
    cardBg: 'bg-red-950/20',
    borderColor: 'border-red-800/50',
    borderHover: 'hover:border-red-400/60 hover:shadow-[0_0_20px_rgba(255,42,75,0.2)]',
    glowClass: 'shadow-[0_0_15px_rgba(255,42,75,0.35)]'
  },
  funds: {
    barGradient: 'bg-gradient-to-r from-emerald-500 to-green-600',
    gradient: 'from-emerald-500 to-green-600',
    textColor: 'text-emerald-400',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-950/60',
    cardBg: 'bg-emerald-950/20',
    borderColor: 'border-emerald-800/50',
    borderHover: 'hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]'
  },
  fansCount: {
    barGradient: 'bg-gradient-to-r from-sky-500 to-teal-600',
    gradient: 'from-sky-500 to-teal-600',
    textColor: 'text-sky-400',
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-950/60',
    cardBg: 'bg-sky-950/20',
    borderColor: 'border-sky-800/50',
    borderHover: 'hover:border-sky-400/60 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]',
    glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.35)]'
  }
};

/* ========================================================================= */
/* 3. LIFESTYLE & STUDIO THEMES */
/* ========================================================================= */

export const LIFESTYLE_THEMES = {
  starter: {
    cardBorder: 'border-amber-800/60 hover:border-amber-400/80',
    iconBg: 'bg-amber-950/70 text-amber-300 border border-amber-800/60',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    accentText: 'text-amber-400',
    lightBg: 'bg-amber-950/20',
    glow: 'rgba(245, 158, 11, 0.25)'
  },
  home_studio: {
    cardBorder: 'border-amber-800/60 hover:border-amber-400/80',
    iconBg: 'bg-amber-950/70 text-amber-300 border border-amber-800/60',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    accentText: 'text-amber-400',
    lightBg: 'bg-amber-950/20',
    glow: 'rgba(245, 158, 11, 0.25)'
  },
  studio: {
    cardBorder: 'border-sky-800/60 hover:border-sky-400/80',
    iconBg: 'bg-sky-950/70 text-sky-300 border border-sky-800/60',
    badge: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
    accentText: 'text-sky-400',
    lightBg: 'bg-sky-950/20',
    glow: 'rgba(56, 189, 248, 0.25)'
  },
  real_estate: {
    cardBorder: 'border-emerald-800/60 hover:border-emerald-400/80',
    iconBg: 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60',
    badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    accentText: 'text-emerald-400',
    lightBg: 'bg-emerald-950/20',
    glow: 'rgba(16, 185, 129, 0.25)'
  },
  vehicles: {
    cardBorder: 'border-red-800/60 hover:border-red-400/80',
    iconBg: 'bg-red-950/70 text-red-300 border border-red-800/60',
    badge: 'bg-red-950/70 text-red-300 border-red-800/60',
    accentText: 'text-red-400',
    lightBg: 'bg-red-950/20',
    glow: 'rgba(239, 68, 68, 0.25)'
  },
  coaching: {
    cardBorder: 'border-orange-800/60 hover:border-orange-400/80',
    iconBg: 'bg-orange-950/70 text-orange-300 border border-orange-800/60',
    badge: 'bg-orange-950/70 text-orange-300 border-orange-800/60',
    accentText: 'text-orange-400',
    lightBg: 'bg-orange-950/20',
    glow: 'rgba(255, 79, 0, 0.25)'
  }
};

/* ========================================================================= */
/* 4. RELEASE BADGES & COVERS */
/* ========================================================================= */

export const RELEASE_BADGES = {
  viral: 'bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold px-2 py-0.5 rounded-[4px] shadow-[0_0_12px_rgba(255,79,0,0.3)]',
  viralSoft: 'bg-red-950/60 text-red-300 border border-red-800/60 font-semibold px-2 py-0.5 rounded-[4px]',
  hitTop10: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-2 py-0.5 rounded-[4px] shadow-[0_0_12px_rgba(255,79,0,0.3)]',
  hitTop10Soft: 'bg-orange-950/60 text-orange-300 border border-orange-800/60 font-semibold px-2 py-0.5 rounded-[4px]',
  classic: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-[#09090B] font-bold px-2 py-0.5 rounded-[4px] shadow-[0_0_12px_rgba(245,158,11,0.3)]',
  classicSoft: 'bg-amber-950/60 text-amber-300 border border-amber-800/60 font-bold px-2 py-0.5 rounded-[4px]',
  no1: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 text-[#09090B] font-bold px-2 py-0.5 rounded-[4px] shadow-[0_0_14px_rgba(245,158,11,0.4)]',
  single: 'bg-amber-950/60 text-amber-300 border border-amber-800/50 font-medium px-2 py-0.5 rounded-[4px]',
  album: 'bg-sky-950/60 text-sky-300 border border-sky-800/50 font-medium px-2 py-0.5 rounded-[4px]'
};

export const ARTISTIC_COVER_GRADIENTS = [
  'from-orange-600 via-amber-600 to-stone-900',
  'from-amber-500 via-orange-700 to-zinc-900',
  'from-sky-600 via-teal-700 to-slate-900',
  'from-emerald-600 via-teal-700 to-zinc-900',
  'from-red-600 via-orange-700 to-stone-900',
  'from-orange-500 via-amber-600 to-red-800',
  'from-stone-600 via-zinc-700 to-slate-900',
  'from-teal-500 via-emerald-700 to-slate-900',
  'from-red-700 via-amber-800 to-zinc-950',
  'from-yellow-500 via-orange-600 to-red-700'
];

/* ========================================================================= */
/* 5. ANALOG MASTER STUDIO DESIGN TOKENS & UTILITIES */
/* ========================================================================= */

export const CYBER_STUDIO_THEME = {
  palette: {
    bgDeep: '#09090B',
    bgSurface: '#111114',
    glassSlate: '#18181C',
    glassDeep: '#111114',
    borderSubtle: '#242429',
    borderHover: '#383842'
  },
  aurora: {
    cyan: 'radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.08) 0%, transparent 45%)',
    purple: 'radial-gradient(circle at 85% 20%, rgba(255, 79, 0, 0.08) 0%, transparent 50%)',
    magenta: 'radial-gradient(circle at 50% 85%, rgba(245, 158, 11, 0.06) 0%, transparent 45%)'
  },
  classes: {
    card: 'bg-[#111114] border border-[#242429] shadow-xl',
    cardHover: 'hover:border-[#383842] hover:shadow-[0_10px_28px_rgba(255,79,0,0.12)] transition-all duration-200 ease-out',
    panel: 'bg-[#111114] border border-[#242429] shadow-2xl',
    input: 'bg-[#09090B] border border-[#242429] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00]/40 text-[#F4F0EA] placeholder-zinc-500',
    badge: 'bg-[#18181C] border border-[#242429] text-zinc-200 text-xs font-semibold px-2.5 py-0.5 rounded-[4px]',
    glowCyan: 'shadow-[0_0_20px_rgba(56,189,248,0.2)]',
    glowPurple: 'shadow-[0_0_20px_rgba(255,79,0,0.2)]',
    glowMagenta: 'shadow-[0_0_20px_rgba(255,42,75,0.2)]',
    glowAmber: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    glowEmerald: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    glowRose: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]'
  },
  microInteractions: {
    hoverScale: 'hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 ease-out',
    fontTabular: 'font-sans tabular-nums tracking-tight',
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
      return CYBER_STUDIO_THEME.classes.glowAmber;
  }
}

export function formatTabularNumber(num: number): string {
  return num.toLocaleString();
}

export function formatTabularCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}
