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
    label: 'Naranja Señal & Cinta',
    val: 'from-[#FF4F00] via-[#EA580C] to-[#9A3412]',
    description: 'Saturación cálida de consola analógica y cinta de dos pulgadas'
  },
  {
    id: 'cyber_magenta',
    label: 'Rojo REC & Carmesí',
    val: 'from-[#FF2A4B] via-[#E11D48] to-[#881337]',
    description: 'Luz roja de cabina encendida en plena toma vocal'
  },
  {
    id: 'electric_cyan',
    label: 'Cian Osciloscopio',
    val: 'from-[#06B6D4] via-[#0284C7] to-[#0F172A]',
    description: 'Medidores digitales de espectro y sintetizadores de rack'
  },
  {
    id: 'emerald_studio',
    label: 'Esmeralda VU Meter',
    val: 'from-[#10B981] via-[#0D9488] to-[#06B6D4]',
    description: 'Señal limpia en rango nominal sin saturar el bus maestro'
  },
  {
    id: 'gold_master',
    label: 'Oro Vinilo & Ámbar',
    val: 'from-[#D4AF37] via-[#F59E0B] to-[#B45309]',
    description: 'Placa certificada por ventas físicas y millones de reproducciones'
  },
  {
    id: 'sunset_urban',
    label: 'Válvula & Terracota',
    val: 'from-[#F97316] via-[#E11D48] to-[#7C2D12]',
    description: 'Preamplificadores a válvulas al límite de ganancia en el club'
  },
  {
    id: 'midnight_obsidian',
    label: 'Obsidiana & Chasis Mate',
    val: 'from-[#27272A] via-[#18181C] to-[#09090B]',
    description: 'Acero cepillado de compresores de estudio a medianoche'
  },
  {
    id: 'graphite_slate',
    label: 'Grafito & Pizarra',
    val: 'from-[#64748B] via-[#475569] to-[#1E293B]',
    description: 'Paneles acústicos oscuros y herrajes industriales de sala'
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
    color: 'from-[#FF4F00] via-[#EA580C] to-[#7C2D12]',
    icon: 'crown',
    description: 'Subgraves que patean en el pecho y barras grabadas en una sola toma.'
  },
  {
    id: 'flow_street',
    name: 'Hype Master',
    category: 'urban',
    color: 'from-[#F97316] via-[#E11D48] to-[#881337]',
    icon: 'flame',
    description: 'Dueño del pogo en festivales y de los cortes que suenan en cada auto del barrio.'
  },
  {
    id: 'studio_master',
    name: 'Master Producer',
    category: 'electronic',
    color: 'from-[#10B981] via-[#0D9488] to-[#06B6D4]',
    icon: 'headphones',
    description: 'Oído quirúrgico en la consola para separar cada frecuencia de la mezcla.'
  },
  {
    id: 'pop_icon',
    name: 'Pop Icon',
    category: 'pop',
    color: 'from-[#FF2A4B] via-[#E11D48] to-[#9F1239]',
    icon: 'sparkles',
    description: 'Estribillos radiales diseñados para rotar sin pausa y llenar arenas.'
  },
  {
    id: 'synth_electro',
    name: 'Club & Modular Nights',
    category: 'electronic',
    color: 'from-[#06B6D4] via-[#0284C7] to-[#0F172A]',
    icon: 'zap',
    description: 'Secuenciadores analógicos y bombos a 128 BPM pensados para la pista.'
  },
  {
    id: 'rock_legend',
    name: 'Alt Rocker',
    category: 'rock',
    color: 'from-[#64748B] via-[#475569] to-[#1E293B]',
    icon: 'disc',
    description: 'Amplificadores valvulares al diez y tomas en vivo sin edición digital.'
  },
  {
    id: 'lyrical_pro',
    name: 'Poeta del Micrófono',
    category: 'artistic',
    color: 'from-[#27272A] via-[#18181C] to-[#09090B]',
    icon: 'mic',
    description: 'Pluma afilada sobre bombos secos de sampler; cero relleno comercial.'
  },
  {
    id: 'gold_legacy',
    name: 'Leyenda Platino',
    category: 'legend',
    color: 'from-[#D4AF37] via-[#F59E0B] to-[#B45309]',
    icon: 'star',
    description: 'Catálogo histórico con regalías vitalicias y estadios agotados en preventa.'
  }
];
