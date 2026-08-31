import {
  Mic,
  Crown,
  Flame,
  Disc3,
  Sparkles,
  Zap,
  Music2,
  Radio,
  Headphones,
  Star,
  Trophy,
  User,
  Activity,
  Waves,
  LucideIcon
} from 'lucide-react';

export interface AvatarPaletteOption {
  id: string;
  label: string;
  val: string;
  description: string;
}

export interface AvatarSymbolOption {
  id: string;
  label: string;
  icon: LucideIcon;
  iconName: string;
}

export interface VectorAvatarPreset {
  id: string;
  name: string;
  category: 'urban' | 'pop' | 'electronic' | 'rock' | 'artistic' | 'legend';
  color: string;
  icon: string;
  description: string;
}

export const AVATAR_PALETTES: AvatarPaletteOption[] = [
  {
    id: 'synth_violet',
    label: 'Violeta Synth',
    val: 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]',
    description: 'Atmósfera principal de estudio y neón nocturno'
  },
  {
    id: 'cyber_magenta',
    label: 'Magenta Neón & Cyber',
    val: 'from-[#8B5CF6] via-[#9333EA] to-[#C026D3]',
    description: 'Energía vibrante y estética visual de vanguardia'
  },
  {
    id: 'electric_cyan',
    label: 'Cian & Azul Eléctrico',
    val: 'from-[#06B6D4] via-[#0284C7] to-[#4F46E5]',
    description: 'Sonido futurista, síntesis digital y charts mundiales'
  },
  {
    id: 'emerald_studio',
    label: 'Esmeralda & Jade Studio',
    val: 'from-[#10B981] via-[#0D9488] to-[#06B6D4]',
    description: 'Monitores de estudio, balance y precisión técnica'
  },
  {
    id: 'gold_master',
    label: 'Oro & Ámbar Master',
    val: 'from-[#F59E0B] via-[#D97706] to-[#B45309]',
    description: 'Prestigio, galas, hits platino y certificaciones'
  },
  {
    id: 'sunset_urban',
    label: 'Atardecer Urbano',
    val: 'from-[#F97316] via-[#E11D48] to-[#9333EA]',
    description: 'Fuego callejero, flow caribeño y calidez rítmica'
  },
  {
    id: 'midnight_obsidian',
    label: 'Obsidiana & Índigo Profundo',
    val: 'from-[#6366F1] via-[#4338CA] to-[#1E1B4B]',
    description: 'Elegancia nocturna, sesiones de medianoche y misterio'
  },
  {
    id: 'graphite_slate',
    label: 'Grafito & Platino Dark',
    val: 'from-[#64748B] via-[#475569] to-[#1E293B]',
    description: 'Estilo sobrio, minimalista e industrial'
  }
];

export const AVATAR_SYMBOLS: AvatarSymbolOption[] = [
  { id: 'mic', label: 'Micrófono Pro', icon: Mic, iconName: 'Mic' },
  { id: 'crown', label: 'Corona Real', icon: Crown, iconName: 'Crown' },
  { id: 'flame', label: 'Fuego / Hype', icon: Flame, iconName: 'Flame' },
  { id: 'disc', label: 'Vinilo / Master', icon: Disc3, iconName: 'Disc3' },
  { id: 'sparkles', label: 'Destello / Estrella', icon: Sparkles, iconName: 'Sparkles' },
  { id: 'zap', label: 'Rayo Eléctrico', icon: Zap, iconName: 'Zap' },
  { id: 'music', label: 'Nota Musical', icon: Music2, iconName: 'Music2' },
  { id: 'radio', label: 'Onda / Radio', icon: Radio, iconName: 'Radio' },
  { id: 'headphones', label: 'Auriculares Estudio', icon: Headphones, iconName: 'Headphones' },
  { id: 'star', label: 'Estrella de Éxito', icon: Star, iconName: 'Star' },
  { id: 'trophy', label: 'Trofeo / Galardón', icon: Trophy, iconName: 'Trophy' },
  { id: 'waves', label: 'Frecuencia Sonora', icon: Waves, iconName: 'Waves' },
  { id: 'activity', label: 'Pulso Rítmico', icon: Activity, iconName: 'Activity' },
  { id: 'user', label: 'Silueta Artista', icon: User, iconName: 'User' }
];

export const VECTOR_PRESETS: VectorAvatarPreset[] = [
  {
    id: 'trap_king',
    name: 'Trap King',
    category: 'urban',
    color: 'from-[#8B5CF6] via-[#9333EA] to-[#C026D3]',
    icon: 'crown',
    description: 'Realeza del género urbano, actitud imponente y barras directas.'
  },
  {
    id: 'flow_street',
    name: 'Hype Master',
    category: 'urban',
    color: 'from-[#F97316] via-[#E11D48] to-[#9333EA]',
    icon: 'flame',
    description: 'Viralidad instantánea, carisma escénico y sonido explosivo.'
  },
  {
    id: 'studio_master',
    name: 'Master Producer',
    category: 'electronic',
    color: 'from-[#10B981] via-[#0D9488] to-[#06B6D4]',
    icon: 'headphones',
    description: 'Dominio de sintetizadores, mezcla precisa y alquimia de beats.'
  },
  {
    id: 'pop_icon',
    name: 'Pop Icon',
    category: 'pop',
    color: 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]',
    icon: 'sparkles',
    description: 'Estribillos globales, carisma mediático y presencia en charts.'
  },
  {
    id: 'synth_electro',
    name: 'Club & Cyber Nights',
    category: 'electronic',
    color: 'from-[#06B6D4] via-[#0284C7] to-[#4F46E5]',
    icon: 'zap',
    description: 'Sonido vanguardista de festival y rotación en playlists de club.'
  },
  {
    id: 'rock_legend',
    name: 'Alt Rocker',
    category: 'rock',
    color: 'from-[#64748B] via-[#475569] to-[#1E293B]',
    icon: 'disc',
    description: 'Guitarras potentes, energía cruda y autenticidad sin filtros.'
  },
  {
    id: 'lyrical_pro',
    name: 'Poeta del Micrófono',
    category: 'artistic',
    color: 'from-[#6366F1] via-[#4338CA] to-[#1E1B4B]',
    icon: 'mic',
    description: 'Complejidad poética, métrica afilada y credibilidad artística.'
  },
  {
    id: 'gold_legacy',
    name: 'Leyenda Platino',
    category: 'legend',
    color: 'from-[#F59E0B] via-[#D97706] to-[#B45309]',
    icon: 'star',
    description: 'Multi-galardonado, clásicos generacionales y estatus histórico.'
  }
];
