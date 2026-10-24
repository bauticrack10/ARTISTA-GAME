import React, { useState, useEffect, useMemo } from 'react';
import { activateOnKey } from '../utils/a11y';
import { Artist, WorldState, Genre, CareerStage, PersonalityTraits } from '../types';
import {
  AVATAR_PALETTES,
  AVATAR_SYMBOLS,
  VECTOR_PRESETS,
  AvatarPaletteOption,
  AvatarSymbolOption,
  VectorAvatarPreset
} from '../data/avatarPresets';
import { ArtistAvatar } from './ArtistAvatar';
import { StreamingEngine } from '../systems/StreamingEngine';
import {
  Sparkles,
  User,
  MapPin,
  Disc3,
  Sliders,
  ArrowLeft,
  Flame,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Shuffle,
  Music2,
  CheckCircle2,
  Brain,
  Crown,
  Dices,
  Star,
  Check,
  RotateCcw,
  ShieldCheck,
  Palette,
  Mic,
  Radio,
  Headphones,
  Trophy,
  Waves,
  Activity,
  Layers,
  AlertCircle,
  Plus,
  Minus,
  Info,
  Target,
  Wrench,
  Award
} from 'lucide-react';
import {
  generateArtistName,
  generateRandomArtistName,
  formatMoney,
  formatFans,
  cleanCountTag,
  cleanQuotes,
  cleanParentheses,
  formatCityCountry,
  sanitizeString
} from '../utils/formatters';

interface CharacterCreatorViewProps {
  world: WorldState;
  onBackToMenu: () => void;
  onCreatePlayer: (customArtist: Partial<Artist>) => void;
}

export const COUNTRY_CITIES: Record<string, string[]> = {
  Argentina: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mar del Plata', 'Mendoza', 'La Plata', 'Neuquén', 'Salta'],
  México: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Tijuana', 'Puebla', 'Cancún', 'Querétaro', 'Culiacán'],
  España: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Bilbao', 'Granada', 'Zaragoza', 'Las Palmas'],
  'Puerto Rico': ['San Juan', 'Bayamón', 'Ponce', 'Carolina', 'Caguas', 'Mayagüez', 'Arecibo'],
  Colombia: ['Medellín', 'Bogotá', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'],
  Chile: ['Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar', 'Antofagasta', 'La Serena'],
  Uruguay: ['Montevideo', 'Punta del Este', 'Salto', 'Maldonado'],
  Brasil: ['São Paulo', 'Rio de Janeiro', 'Salvador', 'Belo Horizonte', 'Curitiba', 'Recife', 'Fortaleza'],
  'Estados Unidos': ['Miami', 'Los Angeles', 'New York', 'Atlanta', 'Chicago', 'Houston', 'Nashville', 'Austin'],
  'Canadá': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
  'Reino Unido': ['Londres', 'Manchester', 'Birmingham', 'Liverpool', 'Glasgow', 'Bristol'],
  Francia: ['París', 'Marsella', 'Lyon', 'Toulouse', 'Niza'],
  Alemania: ['Berlín', 'Múnich', 'Hamburgo', 'Colonia', 'Frankfurt'],
  Italia: ['Roma', 'Milán', 'Nápoles', 'Florencia', 'Turín'],
  Portugal: ['Lisboa', 'Oporto', 'Braga'],
  'Países Bajos': ['Ámsterdam', 'Róterdam', 'Utrecht'],
  'Bélgica': ['Bruselas', 'Amberes', 'Gante'],
  Suecia: ['Estocolmo', 'Gotemburgo', 'Malmö'],
  Noruega: ['Oslo', 'Bergen', 'Trondheim'],
  Irlanda: ['Dublín', 'Cork', 'Galway'],
  Australia: ['Sídney', 'Melbourne', 'Brisbane', 'Perth'],
  'Nueva Zelanda': ['Auckland', 'Wellington', 'Christchurch'],
  Nigeria: ['Lagos', 'Abuya', 'Port Harcourt', 'Ibadan'],
  'Sudáfrica': ['Johannesburgo', 'Ciudad del Cabo', 'Durban'],
  Ghana: ['Acra', 'Kumasi'],
  Marruecos: ['Casablanca', 'Rabat', 'Marrakech'],
  Egipto: ['El Cairo', 'Alejandría'],
  India: ['Bombay', 'Delhi', 'Bangalore', 'Punyab'],
  'Corea del Sur': ['Seúl', 'Busán', 'Incheon', 'Daegu'],
  'Japón': ['Tokio', 'Osaka', 'Kioto', 'Nagoya', 'Fukuoka'],
  Filipinas: ['Manila', 'Cebú', 'Dávao'],
  Indonesia: ['Yakarta', 'Bali', 'Bandung'],
  'Turquía': ['Estambul', 'Ankara', 'Esmirna'],
  Polonia: ['Varsovia', 'Cracovia', 'Breslavia'],
  'República Dominicana': ['Santo Domingo', 'Santiago de los Caballeros', 'La Romana', 'Punta Cana'],
  Jamaica: ['Kingston', 'Montego Bay']
};

export const COUNTRY_GENRE_DEFAULTS: Record<string, { main: string; secondaries: string[]; flag: string; code: string }> = {
  Argentina: { flag: '🇦🇷', code: 'AR', main: 'trap_latino', secondaries: ['rock_alternativo', 'cumbia_tropical', 'hip_hop_rap'] },
  México: { flag: '🇲🇽', code: 'MX', main: 'corridos_urbanos', secondaries: ['reggaeton', 'pop_moderno', 'cumbia_tropical'] },
  España: { flag: '🇪🇸', code: 'ES', main: 'trap_latino', secondaries: ['pop_moderno', 'drill', 'hip_hop_rap'] },
  'Puerto Rico': { flag: '🇵🇷', code: 'PR', main: 'reggaeton', secondaries: ['trap_latino', 'pop_moderno', 'hip_hop_rap'] },
  Colombia: { flag: '🇨🇴', code: 'CO', main: 'reggaeton', secondaries: ['pop_moderno', 'cumbia_tropical', 'trap_latino'] },
  Chile: { flag: '🇨🇱', code: 'CL', main: 'trap_latino', secondaries: ['reggaeton', 'pop_moderno', 'hip_hop_rap'] },
  Uruguay: { flag: '🇺🇾', code: 'UY', main: 'trap_latino', secondaries: ['cumbia_tropical', 'rock_alternativo', 'hip_hop_rap'] },
  Brasil: { flag: '🇧🇷', code: 'BR', main: 'funk_brasilero', secondaries: ['trap_latino', 'jazz_bossa', 'pop_moderno'] },
  'Estados Unidos': { flag: '🇺🇸', code: 'US', main: 'hip_hop_rap', secondaries: ['pop_moderno', 'r_and_b_soul', 'country_folk'] },
  'Canadá': { flag: '🇨🇦', code: 'CA', main: 'pop_moderno', secondaries: ['r_and_b_soul', 'hip_hop_rap', 'rock_alternativo'] },
  'Reino Unido': { flag: '🇬🇧', code: 'GB', main: 'drill', secondaries: ['pop_moderno', 'rock_alternativo', 'musica_electronica'] },
  Francia: { flag: '🇫🇷', code: 'FR', main: 'hip_hop_rap', secondaries: ['musica_electronica', 'pop_moderno', 'drill'] },
  Alemania: { flag: '🇩🇪', code: 'DE', main: 'musica_electronica', secondaries: ['metal_punk', 'hip_hop_rap', 'pop_moderno'] },
  Italia: { flag: '🇮🇹', code: 'IT', main: 'pop_moderno', secondaries: ['trap_latino', 'drill', 'hip_hop_rap'] },
  Portugal: { flag: '🇵🇹', code: 'PT', main: 'pop_moderno', secondaries: ['hip_hop_rap', 'musica_electronica', 'afrobeat_dancehall'] },
  'Países Bajos': { flag: '🇳🇱', code: 'NL', main: 'musica_electronica', secondaries: ['pop_moderno', 'hip_hop_rap', 'drill'] },
  'Bélgica': { flag: '🇧🇪', code: 'BE', main: 'musica_electronica', secondaries: ['pop_moderno', 'hip_hop_rap'] },
  Suecia: { flag: '🇸🇪', code: 'SE', main: 'pop_moderno', secondaries: ['musica_electronica', 'metal_punk'] },
  Noruega: { flag: '🇳🇴', code: 'NO', main: 'musica_electronica', secondaries: ['metal_punk', 'pop_moderno'] },
  Irlanda: { flag: '🇮🇪', code: 'IE', main: 'rock_alternativo', secondaries: ['country_folk', 'pop_moderno'] },
  Australia: { flag: '🇦🇺', code: 'AU', main: 'rock_alternativo', secondaries: ['pop_moderno', 'musica_electronica', 'hip_hop_rap'] },
  'Nueva Zelanda': { flag: '🇳🇿', code: 'NZ', main: 'pop_moderno', secondaries: ['rock_alternativo', 'r_and_b_soul'] },
  Nigeria: { flag: '🇳🇬', code: 'NG', main: 'afrobeat_dancehall', secondaries: ['hip_hop_rap', 'pop_moderno'] },
  'Sudáfrica': { flag: '🇿🇦', code: 'ZA', main: 'afrobeat_dancehall', secondaries: ['musica_electronica', 'hip_hop_rap'] },
  Ghana: { flag: '🇬🇭', code: 'GH', main: 'afrobeat_dancehall', secondaries: ['hip_hop_rap', 'pop_moderno'] },
  Marruecos: { flag: '🇲🇦', code: 'MA', main: 'hip_hop_rap', secondaries: ['drill', 'pop_moderno'] },
  Egipto: { flag: '🇪🇬', code: 'EG', main: 'hip_hop_rap', secondaries: ['pop_moderno', 'musica_electronica'] },
  India: { flag: '🇮🇳', code: 'IN', main: 'pop_moderno', secondaries: ['hip_hop_rap', 'musica_electronica'] },
  'Corea del Sur': { flag: '🇰🇷', code: 'KR', main: 'kpop_jpop', secondaries: ['pop_moderno', 'r_and_b_soul', 'hip_hop_rap'] },
  'Japón': { flag: '🇯🇵', code: 'JP', main: 'kpop_jpop', secondaries: ['rock_alternativo', 'pop_moderno', 'musica_electronica'] },
  Filipinas: { flag: '🇵🇭', code: 'PH', main: 'pop_moderno', secondaries: ['r_and_b_soul', 'hip_hop_rap'] },
  Indonesia: { flag: '🇮🇩', code: 'ID', main: 'pop_moderno', secondaries: ['rock_alternativo', 'musica_electronica'] },
  'Turquía': { flag: '🇹🇷', code: 'TR', main: 'pop_moderno', secondaries: ['hip_hop_rap', 'musica_electronica'] },
  Polonia: { flag: '🇵🇱', code: 'PL', main: 'hip_hop_rap', secondaries: ['drill', 'musica_electronica'] },
  'República Dominicana': { flag: '🇩🇴', code: 'DO', main: 'reggaeton', secondaries: ['trap_latino', 'cumbia_tropical', 'pop_moderno'] },
  Jamaica: { flag: '🇯🇲', code: 'JM', main: 'afrobeat_dancehall', secondaries: ['hip_hop_rap', 'r_and_b_soul'] }
};

interface TraitChipProps {
  label: string;
  variant?: 'purple' | 'emerald' | 'amber' | 'cyan' | 'rose' | 'slate';
}

const TraitChip: React.FC<TraitChipProps> = ({ label, variant = 'purple' }) => {
  let styleClasses = 'bg-[#FF2A4B]/15 text-[#FF2A4B] border-[#FF2A4B]/30';
  if (label.startsWith('-') || variant === 'rose') {
    styleClasses = 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
  } else if (variant === 'emerald' || label.includes('Comercial') || label.includes('Ambición') || label.includes('Sociabilidad')) {
    styleClasses = 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';
  } else if (variant === 'amber' || label.includes('Carisma') || label.includes('Hype') || label.includes('Fans')) {
    styleClasses = 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30';
  } else if (variant === 'cyan' || label.includes('Habilidad') || label.includes('Disciplina') || label.includes('Constancia') || label.includes('Credibilidad')) {
    styleClasses = 'bg-[#1C1C21] text-[#F4F0EA] border-[#3F3F46]';
  } else if (variant === 'slate') {
    styleClasses = 'bg-[#1C1C21] text-[#8E8E99] border-[#26262B]';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-2xs font-sans tabular-nums font-bold border tracking-wide select-none ${styleClasses}`}>
      {label}
    </span>
  );
};

// =========================================================================
// REGLAS Y CONFIGURACIÓN DE ARQUETIPOS (RANGO UNDERGROUND REALISTA: 18 - 35)
// =========================================================================

export const ARCHETYPE_PRESETS: Record<string, {
  id: 'visionary' | 'entrepreneur' | 'showman' | 'disciplined' | 'experimental';
  name: string;
  subtitle: string;
  desc: string;
  chips: string[];
  variant: 'purple' | 'emerald' | 'amber' | 'cyan' | 'slate';
  traits: PersonalityTraits;
}> = {
  visionary: {
    id: 'visionary',
    name: 'El Visionario',
    subtitle: 'Vanguardia Creativa & Concepto Crudo',
    desc: 'Prioriza originalidad radical y experimentación sonora. Gran impacto en crítica underground y nichos de culto.',
    chips: ['+Originalidad (35)', '+Creatividad (34)', '-Comercial (18)'],
    variant: 'purple',
    traits: {
      creativity: 34,
      originality: 35,
      riskTolerance: 32,
      skill: 26,
      independence: 30,
      ambition: 24,
      charisma: 24,
      discipline: 22,
      sociability: 20,
      commercialAppeal: 18
    }
  },
  entrepreneur: {
    id: 'entrepreneur',
    name: 'El Estratega',
    subtitle: 'Visión Comercial & Autogestión',
    desc: 'Negociador nato, visión comercial y networking barrial. Maximiza ingresos, monetización y contratos desde el inicio.',
    chips: ['+Ambición (35)', '+Comercial (34)', '+Sociabilidad (32)'],
    variant: 'emerald',
    traits: {
      ambition: 35,
      commercialAppeal: 34,
      sociability: 32,
      independence: 30,
      discipline: 28,
      charisma: 26,
      riskTolerance: 24,
      skill: 22,
      creativity: 20,
      originality: 18
    }
  },
  showman: {
    id: 'showman',
    name: 'El Showman',
    subtitle: 'Magnetismo Escénico & Viralidad',
    desc: 'Carisma innato en tarimas barriales, soltura ante cámaras y conexión espontánea y magnética con el público.',
    chips: ['+Carisma (35)', '+Sociabilidad (33)', '+Comercial (32)'],
    variant: 'amber',
    traits: {
      charisma: 35,
      sociability: 33,
      commercialAppeal: 32,
      ambition: 30,
      riskTolerance: 28,
      skill: 24,
      creativity: 22,
      originality: 22,
      discipline: 20,
      independence: 18
    }
  },
  disciplined: {
    id: 'disciplined',
    name: 'El Perfeccionista',
    subtitle: 'Rigor Técnico & Disciplina de Estudio',
    desc: 'Horas de práctica en home studio, pulido métrico vocal y rigor constante para una ejecución pulida.',
    chips: ['+Disciplina (35)', '+Habilidad (34)', '+Independencia (30)'],
    variant: 'cyan',
    traits: {
      discipline: 35,
      skill: 34,
      independence: 30,
      ambition: 28,
      creativity: 25,
      originality: 24,
      commercialAppeal: 22,
      charisma: 20,
      sociability: 19,
      riskTolerance: 18
    }
  },
  experimental: {
    id: 'experimental',
    name: 'Vanguardia Pura',
    subtitle: 'Ruptura Sonora & Autonomía',
    desc: 'Rompe barreras acústicas sin atarse a fórmulas ni algoritmos comerciales. Búsqueda de una identidad irrepetible.',
    chips: ['+Originalidad (35)', '+Creatividad (34)', '+Riesgo (33)'],
    variant: 'purple',
    traits: {
      originality: 35,
      creativity: 34,
      independence: 34,
      riskTolerance: 33,
      skill: 26,
      discipline: 22,
      ambition: 20,
      charisma: 19,
      sociability: 18,
      commercialAppeal: 16
    }
  }
};

// =========================================================================
// SISTEMA POINT-BUY PARA MODO PERSONALIZADO (BASE 18, MÁX 38, BOLSA 45 PTS)
// =========================================================================

export const CUSTOM_BASE_STAT = 18;
export const CUSTOM_MAX_STAT = 38;
export const CUSTOM_POINTS_POOL = 45;

export const INITIAL_CUSTOM_TRAITS: PersonalityTraits = {
  creativity: 24,
  ambition: 22,
  discipline: 23,
  charisma: 23,
  skill: 24,
  commercialAppeal: 21,
  originality: 23,
  riskTolerance: 22,
  sociability: 21,
  independence: 22
};

export interface TraitMeta {
  key: keyof PersonalityTraits;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  gradient: string;
  bgTrack: string;
  desc: string;
}

export const TRAIT_METADATA_LIST: TraitMeta[] = [
  {
    key: 'creativity',
    label: 'Creatividad & Vanguardia',
    shortLabel: 'Creatividad',
    icon: Sparkles,
    iconColor: 'text-[#FF4F00]',
    gradient: 'from-[#FF4F00] to-[#D97706]',
    bgTrack: 'bg-[#18181C]',
    desc: 'Composición de estructuras, arreglos en cabina y búsqueda de texturas fuera de fórmula.'
  },
  {
    key: 'skill',
    label: 'Habilidad / Técnica Musical',
    shortLabel: 'Skill / Técnica',
    icon: Music2,
    iconColor: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-600',
    bgTrack: 'bg-cyan-950/40',
    desc: 'Afinación en primera toma, precisión rítmica, manejo de consola y limpieza de mezcla.'
  },
  {
    key: 'charisma',
    label: 'Carisma & Presencia',
    shortLabel: 'Carisma',
    icon: Crown,
    iconColor: 'text-amber-400',
    gradient: 'from-amber-400 to-orange-500',
    bgTrack: 'bg-amber-950/40',
    desc: 'Dominio de escenario en vivo, trato con cámaras y retención de público en cada fecha.'
  },
  {
    key: 'commercialAppeal',
    label: 'Atractivo Comercial',
    shortLabel: 'Comercial',
    icon: DollarSign,
    iconColor: 'text-emerald-400',
    gradient: 'from-emerald-400 to-teal-500',
    bgTrack: 'bg-emerald-950/40',
    desc: 'Olfato para estribillos de rotación radial, cortes de difusión y entrada en listas editoriales.'
  },
  {
    key: 'originality',
    label: 'Originalidad Sonora',
    shortLabel: 'Originalidad',
    icon: Target,
    iconColor: 'text-[#FF2A4B]',
    gradient: 'from-[#FF2A4B] to-[#9F1239]',
    bgTrack: 'bg-[#18181C]',
    desc: 'Timbre propio y firma de producción que pesan en las reseñas de prensa especializada.'
  },
  {
    key: 'discipline',
    label: 'Disciplina de Estudio',
    shortLabel: 'Disciplina',
    icon: ShieldCheck,
    iconColor: 'text-[#10B981]',
    gradient: 'from-[#10B981] to-[#047857]',
    bgTrack: 'bg-[#18181C]',
    desc: 'Constancia en sesiones largas de grabación, entrega de másters a término y menor desgaste de gira.'
  },
  {
    key: 'ambition',
    label: 'Ambición & Empuje',
    shortLabel: 'Ambición',
    icon: Flame,
    iconColor: 'text-orange-400',
    gradient: 'from-orange-500 to-red-500',
    bgTrack: 'bg-orange-950/40',
    desc: 'Presión en la mesa de negociación por mejores anticipos, cachés y plazas de mayor aforo.'
  },
  {
    key: 'riskTolerance',
    label: 'Tolerancia al Riesgo',
    shortLabel: 'Riesgo',
    icon: Zap,
    iconColor: 'text-yellow-400',
    gradient: 'from-yellow-400 to-amber-500',
    bgTrack: 'bg-yellow-950/40',
    desc: 'Disposición a cambiar de sonido entre discos y financiar producciones caras sin respaldo.'
  },
  {
    key: 'sociability',
    label: 'Sociabilidad & Conexiones',
    shortLabel: 'Sociabilidad',
    icon: Users,
    iconColor: 'text-teal-400',
    gradient: 'from-teal-400 to-emerald-500',
    bgTrack: 'bg-teal-950/40',
    desc: 'Trato directo con productores, A&R y colegas para cerrar colaboraciones y repartir puntos.'
  },
  {
    key: 'independence',
    label: 'Autogestión / Independencia',
    shortLabel: 'Autogestión',
    icon: Headphones,
    iconColor: 'text-[#F59E0B]',
    gradient: 'from-[#F59E0B] to-[#D97706]',
    bgTrack: 'bg-[#18181C]',
    desc: 'Capacidad para autoproducir maquetas, retener la propiedad de los másters y operar sin sello.'
  }
];

export const getTraitDevelopmentTier = (val: number) => {
  if (val <= 20) return { label: 'Novato Base', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
  if (val <= 28) return { label: 'En Desarrollo', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
  if (val <= 38) return { label: 'Destacado Inicial', color: 'text-[#FF4F00] bg-[#FF4F00]/20 border-[#FF4F00]/40' };
  if (val <= 60) return { label: 'Profesional', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
  if (val <= 85) return { label: 'Élite de Escena', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
  return { label: 'Maestría Legendaria', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
};

export const CharacterCreatorView: React.FC<CharacterCreatorViewProps> = ({
  world,
  onBackToMenu,
  onCreatePlayer
}) => {
  // 1. Identity & Origin
  const [country, setCountry] = useState('Argentina');
  const [name, setName] = useState('');
  const [realName, setRealName] = useState('');
  const [age, setAge] = useState(19);
  const [city, setCity] = useState('Buenos Aires');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityText, setCustomCityText] = useState('');

  // 2. Music Style
  const [mainGenreId, setMainGenreId] = useState('trap_latino');
  const [secondaryGenres, setSecondaryGenres] = useState<string[]>(['hip_hop_rap']);

  // 3. Personality Archetype & Concept
  const [archetype, setArchetype] = useState<'visionary' | 'entrepreneur' | 'showman' | 'disciplined' | 'experimental' | 'custom'>('visionary');
  const [customTraits, setCustomTraits] = useState<PersonalityTraits>(INITIAL_CUSTOM_TRAITS);

  // 4. Initial Level / Starting Point
  const [startingLevel, setStartingLevel] = useState<'underground' | 'emerging' | 'local' | 'independent'>('underground');

  // 5. Visual Identity / Vector Avatar State
  const [avatarType, setAvatarType] = useState<'symbol' | 'initials'>('symbol');
  const [avatarIcon, setAvatarIcon] = useState<string>('mic');
  const [avatarColor, setAvatarColor] = useState<string>('from-[#FF4F00] to-[#D97706]');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // 6. Prodigy Rare Trait (0.001% chance / 1 in 100,000)
  const [isProdigy, setIsProdigy] = useState<boolean>(() => Math.random() < 0.00001);
  const [rollCount, setRollCount] = useState(0);
  const [rollMessage, setRollMessage] = useState<string | null>(null);

  // Developer testing keyboard shortcut (Shift+Alt+P in dev mode only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && (e.key === 'p' || e.key === 'P')) {
        setIsProdigy(prev => !prev);
        setRollMessage('Modo Dev: Rasgo Prodigio alternado con atajo de desarrollo.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRandomizeName = () => {
    const effectiveCity = isCustomCity && customCityText.trim().length >= 3 ? customCityText.trim() : city;
    const generated = generateArtistName(country, effectiveCity);
    setName(generated.stageName);
    setRealName(generated.realName);

    // Minor secret chance to proc prodigy on randomizer (1 in 100,000)
    if (Math.random() < 0.00001) {
      setIsProdigy(true);
      setRollMessage('Oído absoluto detectado: activaste el rasgo Promesa / Prodigio (probabilidad 1 en 100.000).');
    }
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const cities = COUNTRY_CITIES[newCountry] || ['Ciudad Principal'];
    setCity(cities[0]);
    setIsCustomCity(false);
    setCustomCityText('');

    // Adjust recommended / default genres for the selected country
    const genreRec = COUNTRY_GENRE_DEFAULTS[newCountry];
    if (genreRec) {
      if (genreRec.main && world.genres[genreRec.main]) {
        setMainGenreId(genreRec.main);
      }
      if (genreRec.secondaries && genreRec.secondaries.length > 0) {
        const validSubs = genreRec.secondaries
          .filter(id => id !== genreRec.main && world.genres[id])
          .slice(0, 3);
        setSecondaryGenres(validSubs);
      }
    }
  };

  const toggleSecondaryGenre = (genreId: string) => {
    if (genreId === mainGenreId) return;
    if (secondaryGenres.includes(genreId)) {
      setSecondaryGenres(secondaryGenres.filter(g => g !== genreId));
    } else {
      if (secondaryGenres.length < 3) {
        setSecondaryGenres([...secondaryGenres, genreId]);
      }
    }
  };

  const handleApplyPreset = (preset: VectorAvatarPreset) => {
    setSelectedPresetId(preset.id);
    setAvatarColor(preset.color);
    setAvatarIcon(preset.icon);
    setAvatarType('symbol');
  };

  const handleRollProdigyLuck = () => {
    setRollCount(prev => prev + 1);
    const won = Math.random() < 0.00001;
    if (won) {
      setIsProdigy(true);
      setRollMessage('Caso 1 en 100.000: obtuviste el rasgo Promesa / Prodigio antes de entrar a cabina.');
    } else {
      setRollMessage(`Tirada #${rollCount + 1} (probabilidad 0.001%): sin bono de prodigio; vas a forjar tu oído a fuerza de horas de estudio.`);
      setTimeout(() => setRollMessage(null), 3500);
    }
  };

  // =========================================================================
  // CÁLCULO DINÁMICO DE HABILIDADES Y PUNTOS EN MODO PERSONALIZADO
  // =========================================================================

  const getComputedPersonality = (): PersonalityTraits => {
    if (isProdigy) {
      return {
        creativity: 68,
        ambition: 65,
        discipline: 62,
        charisma: 68,
        skill: 70,
        commercialAppeal: 64,
        originality: 70,
        riskTolerance: 60,
        sociability: 60,
        independence: 65
      };
    }

    if (archetype === 'custom') {
      return customTraits;
    }

    const preset = ARCHETYPE_PRESETS[archetype];
    return preset ? preset.traits : INITIAL_CUSTOM_TRAITS;
  };

  const computedPersonality = useMemo(() => getComputedPersonality(), [archetype, customTraits, isProdigy]);

  const averageSkillRating = useMemo(() => {
    const vals = Object.values(computedPersonality) as number[];
    const sum = vals.reduce((a: number, b: number) => a + b, 0);
    return (sum / vals.length).toFixed(1);
  }, [computedPersonality]);

  const topTwoTraits = useMemo(() => {
    const entries = Object.entries(computedPersonality) as [keyof PersonalityTraits, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 2).map(([key, val]) => {
      const meta = TRAIT_METADATA_LIST.find(t => t.key === key);
      return {
        key,
        name: meta?.shortLabel || key,
        val
      };
    });
  }, [computedPersonality]);

  // Point Buy Helpers
  const spentCustomPoints = useMemo(() => {
    const vals = Object.values(customTraits) as number[];
    return vals.reduce(
      (sum: number, val: number) => sum + Math.max(0, val - CUSTOM_BASE_STAT),
      0
    );
  }, [customTraits]);

  const remainingCustomPoints = CUSTOM_POINTS_POOL - spentCustomPoints;

  const handleCustomTraitChange = (key: keyof PersonalityTraits, targetVal: number) => {
    const currentVal = customTraits[key];
    const spentExcludingCurrent = spentCustomPoints - Math.max(0, currentVal - CUSTOM_BASE_STAT);
    const maxAllowedForThis = Math.min(
      CUSTOM_MAX_STAT,
      CUSTOM_BASE_STAT + (CUSTOM_POINTS_POOL - spentExcludingCurrent)
    );
    const clampedVal = Math.max(CUSTOM_BASE_STAT, Math.min(maxAllowedForThis, targetVal));

    setCustomTraits(prev => ({
      ...prev,
      [key]: clampedVal
    }));
  };

  const handleStepTrait = (key: keyof PersonalityTraits, delta: number) => {
    const currentVal = customTraits[key];
    handleCustomTraitChange(key, currentVal + delta);
  };

  const handleApplyCustomPreset = (presetType: 'balanced' | 'reset' | 'producer' | 'showman') => {
    if (presetType === 'balanced') {
      setCustomTraits({
        creativity: 23,
        skill: 23,
        charisma: 23,
        discipline: 23,
        originality: 23,
        ambition: 22,
        commercialAppeal: 22,
        riskTolerance: 22,
        sociability: 22,
        independence: 22
      });
    } else if (presetType === 'reset') {
      setCustomTraits({
        creativity: 18,
        ambition: 18,
        discipline: 18,
        charisma: 18,
        skill: 18,
        commercialAppeal: 18,
        originality: 18,
        riskTolerance: 18,
        sociability: 18,
        independence: 18
      });
    } else if (presetType === 'producer') {
      setCustomTraits({
        skill: 32,
        creativity: 28,
        discipline: 26,
        originality: 24,
        independence: 25,
        ambition: 18,
        charisma: 18,
        commercialAppeal: 18,
        riskTolerance: 18,
        sociability: 18
      });
    } else if (presetType === 'showman') {
      setCustomTraits({
        charisma: 32,
        commercialAppeal: 28,
        sociability: 27,
        ambition: 24,
        skill: 24,
        creativity: 18,
        discipline: 18,
        originality: 18,
        riskTolerance: 18,
        independence: 18
      });
    }
  };

  const getStartingStats = () => {
    let baseStats: {
      popularity: number;
      reputation: number;
      artisticCredibility: number;
      energy: number;
      funds: number;
      fansCount: number;
      fanbaseLoyalty: number;
      hype: number;
      careerStage: CareerStage;
    };

    if (isProdigy) {
      baseStats = {
        popularity: 30,
        reputation: 60,
        artisticCredibility: 95,
        energy: 100,
        funds: 8000,
        fansCount: 3000,
        fanbaseLoyalty: 85,
        hype: 75,
        careerStage: 'Underground' as CareerStage
      };
    } else if (startingLevel === 'underground') {
      baseStats = {
        popularity: 8,
        reputation: 15,
        artisticCredibility: 20,
        energy: 100,
        funds: 500,
        fansCount: 150,
        fanbaseLoyalty: 45,
        hype: 15,
        careerStage: 'Underground' as CareerStage
      };
    } else if (startingLevel === 'emerging') {
      baseStats = {
        popularity: 24,
        reputation: 32,
        artisticCredibility: 35,
        energy: 100,
        funds: 2500,
        fansCount: 2500,
        fanbaseLoyalty: 60,
        hype: 40,
        careerStage: 'Emerging' as CareerStage
      };
    } else if (startingLevel === 'local') {
      baseStats = {
        popularity: 16,
        reputation: 24,
        artisticCredibility: 28,
        energy: 100,
        funds: 1200,
        fansCount: 900,
        fanbaseLoyalty: 55,
        hype: 30,
        careerStage: 'Underground' as CareerStage
      };
    } else {
      baseStats = {
        popularity: 26,
        reputation: 30,
        artisticCredibility: 42,
        energy: 100,
        funds: 3500,
        fansCount: 4500,
        fanbaseLoyalty: 70,
        hype: 35,
        careerStage: 'Emerging' as CareerStage
      };
    }

    const monthlyListeners = StreamingEngine.calculateMonthlyListeners(
      0,
      baseStats.popularity,
      baseStats.fansCount,
      baseStats.fanbaseLoyalty,
      baseStats.hype,
      false
    );
    const totalStreams = Math.max(
      Math.floor(baseStats.fansCount * 2.8),
      Math.floor(monthlyListeners * (1.8 + (baseStats.hype / 100) * 0.8))
    );

    return {
      ...baseStats,
      monthlyListeners,
      totalStreams
    };
  };

  const isCustomCityValid = customCityText.trim().length >= 3;
  const finalResolvedCity = isCustomCity
    ? (isCustomCityValid ? customCityText.trim() : (COUNTRY_CITIES[country]?.[0] || 'Buenos Aires'))
    : city.trim();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const finalPersonality = getComputedPersonality();
    const startStats = getStartingStats();
    const uniqueId = `artist_${Math.random().toString(36).substring(2, 9)}`;
    const currentYear = 2026;
    const birthYear = currentYear - age;
    const locationString = formatCityCountry(finalResolvedCity, country);
    const effectiveStageName = name.trim() || generateArtistName(country, finalResolvedCity).stageName;
    const effectiveRealName = cleanQuotes(realName.trim()) || effectiveStageName;

    const historicalNotes = [
      `Inició su carrera musical en el año ${currentYear} en ${locationString}.`
    ];
    if (isProdigy) {
      historicalNotes.push('Considerado un prodigio generacional irrepetible (1 en 100.000) con multiplicador x3 permanente.');
    }

    const newArtist: Partial<Artist> = {
      id: uniqueId,
      name: effectiveStageName,
      realName: effectiveRealName,
      isPlayer: true,
      country,
      city: finalResolvedCity,
      birthYear,
      careerStartYear: currentYear,
      mainGenreId,
      subGenreIds: secondaryGenres,
      avatarUrl: undefined,
      avatarColor: avatarColor || 'from-[#FF4F00] to-[#D97706]',
      avatarIcon: avatarType === 'symbol' ? (avatarIcon || 'mic') : undefined,
      personality: finalPersonality,
      stats: {
        popularity: startStats.popularity,
        reputation: startStats.reputation,
        artisticCredibility: startStats.artisticCredibility,
        energy: startStats.energy,
        monthlyListeners: startStats.monthlyListeners,
        totalStreams: startStats.totalStreams,
        funds: startStats.funds,
        fansCount: startStats.fansCount,
        fanbaseLoyalty: startStats.fanbaseLoyalty,
        hype: startStats.hype
      },
      careerStage: startStats.careerStage,
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [
        {
          id: `era_${uniqueId}_debut`,
          name: isProdigy ? 'Aparición del Prodigio Generacional' : 'Inicios en el Underground & Primeras Grabaciones',
          startYear: currentYear,
          startMonth: 1,
          genreFocus: mainGenreId,
          stage: startStats.careerStage,
          highlightSummary: isProdigy
            ? `Debutó en ${currentYear} desde ${locationString} con oído absoluto y dominio precoz de consola.`
            : `Empezó a grabar en ${currentYear} en ${locationString}, armando sus primeras maquetas y reteniendo sus propios másters.`
        }
      ],
      awardsWon: [],
      legacyScore: isProdigy ? 25 : 5,
      isRetired: false,
      historicalNotes,
      generationIndex: 1,
      influences: [],
      lifestyleUpgrades: [],
      isProdigy,
      prodigyMultiplier: isProdigy ? 3.0 : 1.0
    };

    onCreatePlayer(newArtist);
  };

  const selectedMainGenre = world.genres[mainGenreId];
  const computedStats = getStartingStats();

  // Age category text helper
  const getAgeCategory = (a: number) => {
    if (a <= 20) return { label: 'Joven Promesa', color: 'text-success bg-success/10 border-success/30' };
    if (a <= 27) return { label: 'Plena Juventud', color: 'text-info bg-info/10 border-info/30' };
    return { label: 'Madurez Artística', color: 'text-warning bg-warning/10 border-warning/30' };
  };
  const ageCat = getAgeCategory(age);

  // Exact math percentage for age slider progress track: (age - 16) / (35 - 16) * 100
  const agePercentage = ((age - 16) / (35 - 16)) * 100;

  return (
    <div
      className="min-h-screen bg-[#0B0C10] text-[#F4F4F6] p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#FF4F00]/30 selection:text-white relative overflow-x-hidden"
    >
      {/* Ambient Studio Lighting Mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-white/[0.015] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-white/[0.01] blur-3xl" />
        <div className="absolute inset-0 analog-grain opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <button
              onClick={onBackToMenu}
              className="shrink-0 p-2.5 rounded-[10px] liquid-glass-pill text-[#F4F4F6] hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer"
              title="Volver al Menú Principal"
              aria-label="Volver al Menú Principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F4F6] tracking-tight flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span>Creación del Artista</span>
                <span className="whitespace-nowrap text-xs liquid-glass-pill text-[#FF4F00] border border-[#FF4F00]/30 px-3 py-0.5 rounded-[8px] font-sans font-bold">
                  Año 1 • 2026
                </span>
              </h1>
              <p className="text-xs text-[#8E8E99] mt-0.5 font-sans">
                Definí tu plaza de origen, sonido de cabecera, horas de estudio iniciales y presupuesto de arranque.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-quick-start-top"
              onClick={() => handleSubmit()}
              className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#FF4F00] hover:bg-[#E04500] text-white font-sans font-bold text-xs shadow-lg shadow-[#FF4F00]/25 active:translate-y-[1px] transition-all cursor-pointer"
              title="Comenzar Carrera Directamente"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Comenzar Carrera</span>
            </button>
          </div>
        </div>

        {/* Main Form + Live Preview Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Columns (2 cols): Ordered Creation Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ========================================================================= */}
            {/* PASO 1: Identidad & Origen */}
            {/* ========================================================================= */}
            <div className="liquid-glass-card p-5 sm:p-6 space-y-5 rounded-[18px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-[#F4F4F6] font-sans font-bold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-[#FF4F00]" />
                  <span>1. Identidad & Origen</span>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] liquid-glass-pill text-[#F4F4F6] text-xs font-sans font-semibold hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer group"
                  title="Generar nombre contextualizado para el país seleccionado"
                >
                  <Shuffle className="w-3.5 h-3.5 text-[#FF4F00] group-hover:rotate-180 transition-transform duration-300" />
                  <span>Aleatorio</span>
                </button>
              </div>

              {/* Names Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#8E8E99] uppercase tracking-wider mb-1.5">
                    Nombre Artístico
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full liquid-glass-subcard rounded-[10px] px-3.5 py-2.5 text-sm text-[#F4F4F6] border border-white/15 focus:border-[#FF4F00]/60 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-[#8E8E99] uppercase tracking-wider mb-1.5">
                    Nombre Real
                  </label>
                  <input
                    type="text"
                    value={realName}
                    onChange={e => setRealName(e.target.value)}
                    className="w-full liquid-glass-subcard rounded-[10px] px-3.5 py-2.5 text-sm text-[#F4F4F6] border border-white/15 focus:border-[#FF4F00]/60 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Age Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-sans font-semibold text-[#8E8E99] uppercase tracking-wider">
                  <span>Edad Inicial</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xs font-sans font-bold px-2.5 py-0.5 rounded-[8px] liquid-glass-pill border ${ageCat.color}`}>
                      {ageCat.label}
                    </span>
                    <span className="text-[#F4F4F6] font-sans text-sm font-bold tabular-nums liquid-glass-pill px-3 py-0.5 rounded-[8px]">
                      {age} Años <span className="text-[#8E8E99] text-xs font-normal">• Nacido en {2026 - age}</span>
                    </span>
                  </div>
                </div>
                
                <div className="relative pt-1 pb-6">
                  <input
                    type="range"
                    min={16}
                    max={35}
                    step={1}
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #FF4F00 0%, #FF4F00 ${agePercentage}%, rgba(255,255,255,0.1) ${agePercentage}%, rgba(255,255,255,0.1) 100%)`
                    }}
                    className="w-full h-2 rounded-[4px] border border-white/15 accent-[#FF4F00] cursor-pointer"
                  />
                  
                  <div className="relative w-full text-2xs text-fg-muted font-sans select-none mt-1.5 h-4">
                    <span
                      role="button"
                      tabIndex={0}
                      onKeyDown={activateOnKey}
                      onClick={() => setAge(16)}
                      className="absolute left-0 text-left cursor-pointer hover:text-emerald-400"
                    >
                      <span className="font-bold text-fg">16 Años</span>{' '}
                      <span className="hidden sm:inline text-success font-sans font-medium">• Joven Promesa</span>
                    </span>
                    
                    <span
                      role="button"
                      tabIndex={0}
                      onKeyDown={activateOnKey}
                      onClick={() => setAge(25)}
                      className="absolute left-[47.37%] -translate-x-1/2 text-center cursor-pointer hover:text-primary-soft"
                    >
                      <span className="font-bold text-fg">25 Años</span>
                    </span>
                    
                    <span
                      role="button"
                      tabIndex={0}
                      onKeyDown={activateOnKey}
                      onClick={() => setAge(35)}
                      className="absolute right-0 text-right cursor-pointer hover:text-amber-400"
                    >
                      <span className="font-bold text-fg">35 Años</span>{' '}
                      <span className="hidden sm:inline text-warning font-sans font-medium">• Veterano</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Country & Hometown Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#8E8E99] uppercase tracking-wider mb-1.5">
                    País de Origen
                  </label>
                  <select
                    value={country}
                    onChange={e => handleCountryChange(e.target.value)}
                    className="w-full liquid-glass-subcard rounded-[10px] px-3.5 py-2.5 text-xs text-[#F4F4F6] border border-white/15 focus:border-[#FF4F00]/60 outline-none cursor-pointer font-medium transition-all"
                  >
                    {Object.keys(COUNTRY_CITIES).map(c => {
                      const meta = COUNTRY_GENRE_DEFAULTS[c];
                      const flag = meta?.flag || '🌍';
                      return (
                        <option key={c} value={c} className="bg-[#111114] text-[#F4F4F6]">
                          {flag} {c}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-sans font-semibold text-[#8E8E99] uppercase tracking-wider">
                      Ciudad Natal
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCity(!isCustomCity);
                        if (!isCustomCity) {
                          setCustomCityText('');
                        }
                      }}
                      className="text-xs text-[#38BDF8] hover:text-[#7DD3FC] flex items-center gap-1 cursor-pointer font-semibold transition-colors"
                    >
                      {isCustomCity ? (
                        <>
                          <RotateCcw className="w-3 h-3" />
                          <span>Elegir de lista</span>
                        </>
                      ) : (
                        <span>+ Personalizar</span>
                      )}
                    </button>
                  </div>

                  {isCustomCity ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          autoFocus
                          value={customCityText}
                          onChange={e => setCustomCityText(e.target.value)}
                          placeholder="Escribe tu ciudad o barrio (mín. 3 letras)..."
                          className={`w-full liquid-glass-subcard rounded-[10px] px-3.5 py-2.5 text-xs text-[#F4F4F6] placeholder:text-[#52525B] outline-none transition-colors border ${
                            customCityText.trim().length > 0 && !isCustomCityValid
                              ? 'border-amber-500/60 focus:border-amber-500'
                              : isCustomCityValid
                              ? 'border-emerald-500/60 focus:border-emerald-500'
                              : 'border-white/15 focus:border-[#FF4F00]/60'
                          }`}
                        />
                        {isCustomCityValid && (
                          <span
                            className="p-2 rounded-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0"
                            title="Ciudad válida"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      {customCityText.trim().length > 0 && !isCustomCityValid && (
                        <p className="text-2xs text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>Ingresa al menos 3 caracteres para tu ciudad personalizada.</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full liquid-glass-subcard rounded-[10px] px-3.5 py-2.5 text-xs text-[#F4F4F6] border border-white/15 focus:border-[#FF4F00]/60 outline-none cursor-pointer font-medium transition-all"
                    >
                      {(COUNTRY_CITIES[country] || []).map(ci => (
                        <option key={ci} value={ci} className="bg-[#111114] text-[#F4F4F6]">
                          {ci}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PASO 2: Estilo Musical & Géneros */}
            {/* ========================================================================= */}
            <div className="liquid-glass-card p-5 sm:p-6 space-y-5 rounded-[18px]">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#F4F4F6] font-sans font-bold text-xs uppercase tracking-wider">
                  <Disc3 className="w-4 h-4 text-[#FF4F00]" />
                  <span>2. Estilo Musical & Géneros</span>
                </div>
                {COUNTRY_GENRE_DEFAULTS[country] && (
                  <span className="text-2xs text-[#FF4F00] liquid-glass-pill border border-[#FF4F00]/30 px-2.5 py-0.5 rounded-[8px] font-sans font-bold">
                    Escena {COUNTRY_GENRE_DEFAULTS[country].flag} {country}
                  </span>
                )}
              </div>

              {/* Main Genre Selection Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-sans font-semibold text-[#8E8E99] uppercase tracking-wider">
                  Género Musical Principal *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.values(world.genres).map((g: Genre) => {
                    const isSelected = mainGenreId === g.id;
                    const isRecommended = COUNTRY_GENRE_DEFAULTS[country]?.main === g.id;
                    const isCountrySecondary = COUNTRY_GENRE_DEFAULTS[country]?.secondaries.includes(g.id);

                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => {
                          setMainGenreId(g.id);
                          setSecondaryGenres(secondaryGenres.filter(sg => sg !== g.id));
                        }}
                        className={`p-3.5 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                          isSelected
                            ? 'liquid-glass-subcard border-[#FF4F00] shadow-[0_0_18px_rgba(255,79,0,0.25)] text-white'
                            : isRecommended
                            ? 'liquid-glass-subcard border-[#FF4F00]/30 hover:border-[#FF4F00]'
                            : 'liquid-glass-subcard border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#F4F4F6]">
                              {g.name}
                            </span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />}
                          </div>
                          <span className="text-2xs text-[#8E8E99] line-clamp-1">
                            {g.aestheticTone || g.originCountry || ''}
                          </span>
                        </div>

                        {isRecommended && (
                          <span className="text-2xs font-sans font-bold text-[#FF4F00] bg-[#FF4F00]/15 px-2 py-0.5 rounded-[6px] border border-[#FF4F00]/35 w-fit mt-2">
                           Sugerido para {country}
                          </span>
                        )}
                        {!isRecommended && isCountrySecondary && (
                          <span className="text-2xs font-sans font-semibold text-[#8E8E99] liquid-glass-pill px-2 py-0.5 rounded-[6px] w-fit mt-2">
                            Popular en {country}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Subgenres (Chips/Badges) */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-sans font-semibold text-[#8E8E99] uppercase tracking-wider">
                    Influencias & Subgéneros Secundarios
                  </label>
                  <span className="text-xs font-sans text-[#FF4F00] font-bold">
                    {cleanCountTag(secondaryGenres.length, 3, 'seleccionados')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.values(world.genres)
                    .filter((g: Genre) => g.id !== mainGenreId)
                    .map((g: Genre) => {
                      const isSelected = secondaryGenres.includes(g.id);
                      const isRecommendedSub = COUNTRY_GENRE_DEFAULTS[country]?.secondaries.includes(g.id);

                      return (
                        <button
                          type="button"
                          key={g.id}
                          onClick={() => toggleSecondaryGenre(g.id)}
                          className={`px-3 py-1.5 rounded-[8px] text-xs font-sans font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                            isSelected
                              ? 'liquid-glass-pill border-[#FF4F00] text-white bg-[#FF4F00]/20 shadow-[0_0_12px_rgba(255,79,0,0.2)]'
                              : isRecommendedSub
                              ? 'liquid-glass-pill border-[#FF4F00]/35 text-[#FF4F00] hover:text-[#F4F4F6] hover:border-[#FF4F00]'
                              : 'liquid-glass-pill border-white/10 text-[#8E8E99] hover:text-[#F4F4F6] hover:border-white/25'
                          }`}
                        >
                          <span>{isSelected ? '✓ ' : '+ '}</span>
                          <span>{g.name}</span>
                          {isRecommendedSub && !isSelected && (
                            <span className="text-2xs text-[#FF4F00] font-sans">★</span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PASO 3: Arquetipo & Filosofía Creativa (Rango Underground: 18 - 35) */}
            {/* ========================================================================= */}
            <div className="liquid-glass-card p-5 sm:p-6 space-y-5 rounded-[18px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[#F4F4F6] font-sans font-bold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-[#FF4F00]" />
                  <span>3. Arquetipo Artístico & Habilidades Iniciales</span>
                </div>
                <span className="text-2xs font-sans tabular-nums text-[#8E8E99] liquid-glass-pill px-3 py-1 rounded-[8px]">
                  Base Amateur: 18–35 pts • Promedio: <strong className="text-[#F4F4F6] font-sans">{averageSkillRating}/100</strong>
                </span>
              </div>

              {/* Archetypes Grid with Stylized TraitChip components */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'visionary',
                    label: 'El Visionario',
                    desc: 'Prioriza originalidad radical y experimentación sonora. Gran impacto en crítica underground.',
                    chips: ['+Originalidad (35)', '+Creatividad (34)', '-Comercial (18)'],
                    variant: 'purple' as const
                  },
                  {
                    id: 'entrepreneur',
                    label: 'El Estratega',
                    desc: 'Negociador nato, enfoque comercial y networking barrial. Maximiza ingresos desde el inicio.',
                    chips: ['+Ambición (35)', '+Comercial (34)', '+Sociabilidad (32)'],
                    variant: 'emerald' as const
                  },
                  {
                    id: 'showman',
                    label: 'El Showman',
                    desc: 'Carisma magnético en tarimas barriales, soltura en redes y presencia escénica.',
                    chips: ['+Carisma (35)', '+Sociabilidad (33)', '+Comercial (32)'],
                    variant: 'amber' as const
                  },
                  {
                    id: 'disciplined',
                    label: 'El Perfeccionista',
                    desc: 'Horas infinitas de práctica en home studio, pulido métrico vocal y consistencia metódica.',
                    chips: ['+Disciplina (35)', '+Habilidad (34)', '+Independencia (30)'],
                    variant: 'cyan' as const
                  },
                  {
                    id: 'experimental',
                    label: 'Vanguardia Pura',
                    desc: 'Rompe barreras sonoras sin atarse a tendencias ni algoritmos comerciales.',
                    chips: ['+Originalidad (35)', '+Creatividad (34)', '+Riesgo (33)'],
                    variant: 'purple' as const
                  },
                  {
                    id: 'custom',
                    label: 'Personalizado',
                    desc: 'Distribución manual punto por punto (Base 18, máx 38, 45 pts libres).',
                    chips: ['Point-Buy (45 pts)', 'Ajuste Manual'],
                    variant: 'slate' as const
                  }
                ].map((item) => {
                  const isSelected = archetype === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setArchetype(item.id as any)}
                      className={`p-4 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'liquid-glass-subcard border-[#FF4F00] shadow-[0_0_18px_rgba(255,79,0,0.25)] text-white'
                          : 'liquid-glass-subcard border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-[#F4F4F6]">
                            {item.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />}
                        </div>
                        <p className="text-xs text-[#8E8E99] leading-relaxed mb-3">
                          {item.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.chips.map((chip, idx) => (
                          <TraitChip key={idx} label={chip} variant={item.variant} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mostrar los 10 controles punto por punto ÚNICAMENTE en modo Personalizado */}
              {archetype === 'custom' && (
                <div className="liquid-glass-subcard p-4 rounded-[12px] border border-white/15 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Sliders className="w-4 h-4 text-[#FF4F00]" />
                      <span className="text-xs font-bold text-[#F4F4F6] uppercase tracking-wider font-sans">
                        Reparto Manual de Habilidades
                      </span>
                      <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">
                        (Base {CUSTOM_BASE_STAT} • Máx {CUSTOM_MAX_STAT})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-[8px] border text-xs font-bold font-sans tabular-nums ${
                          remainingCustomPoints === 0
                            ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                            : remainingCustomPoints > 0
                            ? 'liquid-glass-pill text-[#FF4F00] border-[#FF4F00]/50'
                            : 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40'
                        }`}
                      >
                        Libres: {remainingCustomPoints}/{CUSTOM_POINTS_POOL} pts
                      </span>
                      <button
                        type="button"
                        onClick={() => handleApplyCustomPreset('balanced')}
                        className="px-2.5 py-1 rounded-[6px] text-2xs font-semibold liquid-glass-pill text-[#F4F4F6] hover:bg-white/10 cursor-pointer"
                      >
                        Equilibrar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCustomPreset('reset')}
                        className="px-2.5 py-1 rounded-[6px] text-2xs font-semibold liquid-glass-pill text-[#EF4444] hover:bg-red-500/10 cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reiniciar</span>
                      </button>
                    </div>
                  </div>

                  {/* 10 Interactive Custom Trait Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TRAIT_METADATA_LIST.map((meta) => {
                      const val = customTraits[meta.key];
                      const IconComp = meta.icon;
                      const canIncrement = remainingCustomPoints > 0 && val < CUSTOM_MAX_STAT;
                      const canDecrement = val > CUSTOM_BASE_STAT;

                      return (
                        <div
                          key={meta.key}
                          className="liquid-glass-pill p-2.5 rounded-[10px] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <IconComp className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
                            <span className="text-xs font-semibold text-[#F4F4F6] truncate" title={meta.desc}>
                              {meta.shortLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStepTrait(meta.key, -1)}
                              disabled={!canDecrement}
                              className={`p-1 rounded-[6px] border transition-colors cursor-pointer ${
                                canDecrement
                                  ? 'liquid-glass-pill text-[#F4F4F6] hover:border-[#EF4444]'
                                  : 'opacity-40 text-[#52525B] cursor-not-allowed'
                              }`}
                              title="Disminuir -1 punto"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <input
                              type="range"
                              min={CUSTOM_BASE_STAT}
                              max={CUSTOM_MAX_STAT}
                              step={1}
                              value={val}
                              onChange={e => handleCustomTraitChange(meta.key, Number(e.target.value))}
                              className="w-20 sm:w-24 h-1.5 rounded-[4px] border border-white/15 accent-[#FF4F00] cursor-pointer"
                            />

                            <button
                              type="button"
                              onClick={() => handleStepTrait(meta.key, 1)}
                              disabled={!canIncrement}
                              className={`p-1 rounded-[6px] border transition-colors cursor-pointer ${
                                canIncrement
                                  ? 'liquid-glass-pill text-[#F4F4F6] hover:border-[#FF4F00]'
                                  : 'opacity-40 text-[#52525B] cursor-not-allowed'
                              }`}
                              title="Aumentar +1 punto"
                            >
                              <Plus className="w-3 h-3" />
                            </button>

                            <span className="font-sans font-bold text-xs tabular-nums text-[#F4F4F6] w-7 text-right">
                              {val}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* PASO 4: Punto de Partida / Background */}
            {/* ========================================================================= */}
            <div className="liquid-glass-card p-5 sm:p-6 space-y-5 rounded-[18px]">
              <div className="border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-[#F4F4F6] font-sans font-bold text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-[#FF4F00]" />
                  <span>4. Punto de Partida / Background</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'underground',
                    label: 'Desde Cero',
                    desc: 'Home studio casero, $500 de ahorro y maquetas underground.',
                    badge: '$500 • 100 Oyentes • 150 Fans'
                  },
                  {
                    id: 'local',
                    label: 'Escena Local / Batallas',
                    desc: 'Fogueado en competencias de freestyle barriales con $1.200 y base local.',
                    badge: '$1.200 • 720 Oyentes • 900 Fans'
                  },
                  {
                    id: 'emerging',
                    label: 'Promesa en Ascenso',
                    desc: 'Un par de singles virales en redes, $2.500 y creciente alcance.',
                    badge: '$2.500 • 2.1K Oyentes • 2.5K Fans'
                  },
                  {
                    id: 'independent',
                    label: 'Autogestión Profesional',
                    desc: 'Equipamiento semiprofesional, $3.500 y base sólida de seguidores.',
                    badge: '$3.500 • 3.9K Oyentes • 4.5K Fans'
                  }
                ].map((item) => {
                  const isSelected = startingLevel === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setStartingLevel(item.id as any)}
                      className={`p-4 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'liquid-glass-subcard border-[#FF4F00] shadow-[0_0_18px_rgba(255,79,0,0.25)] text-white'
                          : 'liquid-glass-subcard border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-[#F4F4F6]">
                            {item.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />}
                        </div>
                        <p className="text-xs text-[#8E8E99] leading-relaxed mb-3">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-2xs font-sans tabular-nums text-[#10B981] font-bold bg-[#10B981]/15 px-2.5 py-0.5 rounded-[6px] border border-[#10B981]/30 w-fit">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PASO 5: Identidad Visual & Avatar (Bloque Compacto) */}
            {/* ========================================================================= */}
            <div className="liquid-glass-card p-5 sm:p-6 space-y-5 rounded-[18px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[#F4F4F6] font-sans text-xs uppercase tracking-wider font-bold">
                  <Palette className="w-4 h-4 text-[#FF4F00]" />
                  <span>5. Identidad Visual & Avatar</span>
                </div>

                <div className="flex items-center gap-1 liquid-glass-pill p-1 rounded-[8px]">
                  <button
                    type="button"
                    onClick={() => setAvatarType('symbol')}
                    className={`px-3 py-1 rounded-[6px] font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      avatarType === 'symbol'
                        ? 'bg-[#FF4F00] text-white shadow-sm'
                        : 'text-[#8E8E99] hover:text-[#F4F4F6]'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Símbolo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvatarType('initials')}
                    className={`px-3 py-1 rounded-[6px] font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      avatarType === 'initials'
                        ? 'bg-[#FF4F00] text-white shadow-sm'
                        : 'text-[#8E8E99] hover:text-[#F4F4F6]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Iniciales</span>
                  </button>
                </div>
              </div>

              {/* Presets rápidos en una sola fila de chips */}
              <div className="space-y-1.5">
                <span className="block text-2xs font-sans font-bold text-[#8E8E99] uppercase tracking-wider">
                  Presets Rápidos
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {VECTOR_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id && avatarColor === preset.color && avatarIcon === preset.icon;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset)}
                        className={`px-2.5 py-1.5 rounded-[8px] border text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'liquid-glass-pill border-[#FF4F00] text-white bg-[#FF4F00]/20 shadow-[0_0_12px_rgba(255,79,0,0.2)]'
                            : 'liquid-glass-pill border-white/10 text-[#8E8E99] hover:text-[#F4F4F6]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-[4px] bg-gradient-to-tr ${preset.color} shrink-0 border border-white/20`} />
                        <span>{preset.name.split('(')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector compacto de Símbolo y Paleta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                {avatarType === 'symbol' ? (
                  <div className="space-y-1.5">
                    <span className="block text-2xs font-sans font-bold text-[#8E8E99] uppercase tracking-wider">
                      Ícono Escénico
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {AVATAR_SYMBOLS.map((sym: AvatarSymbolOption) => {
                        const isSelected = avatarIcon === sym.id;
                        const IconComp = sym.icon;
                        return (
                          <button
                            type="button"
                            key={sym.id}
                            onClick={() => {
                              setAvatarIcon(sym.id);
                              setSelectedPresetId(null);
                            }}
                            title={sym.label}
                            className={`px-2.5 py-1.5 rounded-[8px] border text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'liquid-glass-pill border-[#FF4F00] text-[#FF4F00] bg-[#FF4F00]/15'
                                : 'liquid-glass-pill border-white/10 text-[#8E8E99] hover:text-[#F4F4F6]'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                            <span>{sym.label.split('/')[0].trim()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <span className="block text-2xs font-sans font-bold text-[#8E8E99] uppercase tracking-wider">
                      Modo Iniciales
                    </span>
                    <p className="text-xs text-[#8E8E99] leading-relaxed">
                      Usa las iniciales de tu nombre artístico sobre el acabado cromático seleccionado.
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="block text-2xs font-sans font-bold text-[#8E8E99] uppercase tracking-wider">
                    Color de Fondo
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVATAR_PALETTES.map((p: AvatarPaletteOption) => {
                      const isSelected = avatarColor === p.val;
                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => {
                            setAvatarColor(p.val);
                            setSelectedPresetId(null);
                          }}
                          title={p.description}
                          className={`px-2.5 py-1.5 rounded-[8px] border text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'liquid-glass-pill border-[#FF4F00] text-white bg-[#FF4F00]/15'
                              : 'liquid-glass-pill border-white/10 text-[#8E8E99] hover:text-[#F4F4F6]'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-[4px] bg-gradient-to-tr ${p.val} shrink-0 border border-white/20`} />
                          <span>{p.label.split('(')[0].trim()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RASGO ULTRA-RARO: Promesa / Prodigio */}
            {/* ========================================================================= */}
            <div
              className={`p-5 rounded-[18px] border transition-all ${
                isProdigy
                  ? 'liquid-glass-card border-[#F59E0B] shadow-[0_0_24px_rgba(245,158,11,0.25)]'
                  : 'liquid-glass-card border-white/15'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-[10px] ${
                      isProdigy
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                        : 'liquid-glass-pill text-[#8E8E99]'
                    }`}
                  >
                    {isProdigy ? <Crown className="w-4 h-4 text-[#F59E0B]" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F4F4F6]">
                        Rasgo Opcional: Promesa / Prodigio
                      </span>
                      <span className="text-2xs px-2.5 py-0.5 rounded-[6px] font-sans tabular-nums font-bold liquid-glass-pill text-[#8E8E99]">
                        1 en 100.000
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isProdigy ? 'text-[#F59E0B] font-semibold' : 'text-[#8E8E99]'}`}>
                      {isProdigy
                        ? '¡ACTIVADO! Atributos de élite y multiplicador x3 permanente.'
                        : 'Tienta a la suerte antes de debutar para buscar el bono de oído absoluto.'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {!isProdigy ? (
                    <button
                      type="button"
                      onClick={handleRollProdigyLuck}
                      className="px-4 py-2 rounded-[8px] text-xs font-sans font-bold liquid-glass-pill hover:bg-white/10 text-[#F4F4F6] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Dices className="w-3.5 h-3.5 text-[#FF4F00]" />
                      <span>Probar Suerte</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#F59E0B] bg-[#F59E0B]/15 px-3.5 py-1.5 rounded-[8px] border border-[#F59E0B]/30 shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                      <span>PRODIGIO ACTIVO</span>
                    </div>
                  )}
                </div>
              </div>

              {rollMessage && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs font-sans text-[#F4F4F6]">
                  {rollMessage}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Credencial Compacta en Vivo & CTA */}
          <div className="lg:sticky lg:top-6">
            <div className="liquid-glass-card rounded-[18px] p-5 sm:p-6 space-y-5 shadow-2xl relative">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-2xs font-sans font-bold uppercase tracking-wider text-[#FF4F00] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
                  Credencial de Estudio
                </span>
                <span className="text-3xs font-sans font-bold tracking-widest uppercase text-[#8E8E99] liquid-glass-pill px-2 py-0.5 rounded-[6px]">
                  PASS #001
                </span>
              </div>

              {/* Avatar + Datos Principales */}
              <div className="flex items-start gap-4">
                <div className="p-1.5 rounded-[14px] bg-[#09090B]/60 border border-white/20 shadow-lg shrink-0 flex items-center justify-center">
                  <ArtistAvatar
                    name={name.trim() || 'Artista'}
                    avatarColor={avatarColor}
                    avatarIcon={avatarType === 'symbol' ? avatarIcon : undefined}
                    size="lg"
                    rounded="rounded-[12px]"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#F4F4F6] tracking-tight leading-snug break-words">
                    {name.trim() || 'Tu Nombre Artístico'}
                  </h2>
                  <p className="text-xs text-[#8E8E99] font-sans">
                    {realName.trim() ? `"${cleanQuotes(realName)}" • ` : ''}{age} Años
                  </p>
                  <p className="text-xs text-[#8E8E99] font-sans flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF4F00] shrink-0" />
                    <span className="truncate">{formatCityCountry(finalResolvedCity, country)}</span>
                  </p>
                </div>
              </div>

              {isProdigy && (
                <div className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/35 px-3 py-2 rounded-[10px] text-xs font-sans font-bold flex items-center justify-center gap-2 shadow-md">
                  <Crown className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>Prodigio Musical • Multiplicador x3</span>
                </div>
              )}

              {/* Etiquetas de Estilo y Arquetipo */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                <span className="px-2.5 py-1 liquid-glass-pill text-[#F4F4F6] rounded-[8px] text-xs font-sans font-semibold">
                  {selectedMainGenre?.name || 'Género'}
                </span>
                <span className="px-2.5 py-1 liquid-glass-pill text-[#8E8E99] rounded-[8px] text-xs font-sans">
                  {archetype === 'custom' ? 'Personalizado' : ARCHETYPE_PRESETS[archetype]?.name}
                </span>
                <span className="px-2.5 py-1 liquid-glass-pill text-[#10B981] rounded-[8px] text-xs font-sans tabular-nums font-semibold">
                  Hab. {averageSkillRating}/100
                </span>
              </div>

              {/* Grilla 2x2 de Condiciones Iniciales */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10 font-sans tabular-nums">
                <div className="liquid-glass-subcard p-3 rounded-[12px]">
                  <span className="text-2xs text-[#8E8E99] uppercase font-bold tracking-wider block">Fondos</span>
                  <span className="text-sm font-bold text-[#10B981] mt-0.5 block">
                    {formatMoney(computedStats.funds)}
                  </span>
                </div>
                <div className="liquid-glass-subcard p-3 rounded-[12px]">
                  <span className="text-2xs text-[#8E8E99] uppercase font-bold tracking-wider block">Comunidad</span>
                  <span className="text-sm font-bold text-[#F4F4F6] mt-0.5 block">
                    {formatFans(computedStats.fansCount)}
                  </span>
                </div>
                <div className="liquid-glass-subcard p-3 rounded-[12px]">
                  <span className="text-2xs text-[#8E8E99] uppercase font-bold tracking-wider block">Popularidad</span>
                  <span className="text-sm font-bold text-[#F4F4F6] mt-0.5 block">
                    {computedStats.popularity}/100
                  </span>
                </div>
                <div className="liquid-glass-subcard p-3 rounded-[12px]">
                  <span className="text-2xs text-[#8E8E99] uppercase font-bold tracking-wider block">Hype Inicial</span>
                  <span className="text-sm font-bold text-[#FF4F00] mt-0.5 block">
                    {computedStats.hype}/100
                  </span>
                </div>
              </div>

              {/* Resumen de Habilidades Principales del Artista */}
              <div className="liquid-glass-subcard p-3.5 rounded-[12px] space-y-2 border-t border-white/10">
                <span className="text-3xs font-bold uppercase tracking-wider text-[#8E8E99] block">
                  Perfil de Talentos
                </span>
                <div className="space-y-1.5 text-xs font-sans">
                  {topTwoTraits.map(trait => (
                    <div key={trait.key} className="flex items-center justify-between text-2xs">
                      <span className="text-[#8E8E99] font-medium">{trait.name}</span>
                      <span className="text-[#F4F4F6] font-bold tabular-nums">{trait.value} pts</span>
                    </div>
                  ))}
                  <div className="w-full h-1.5 bg-white/10 rounded-[2px] overflow-hidden mt-1">
                    <div
                      className="h-full bg-[#FF4F00] rounded-[2px] transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, Number(averageSkillRating)))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button - Primary CTA */}
              <button
                type="submit"
                id="btn-launch-career-bottom"
                className="w-full py-3.5 px-5 rounded-[12px] bg-[#FF4F00] hover:bg-[#E04500] text-white font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#FF4F00]/30 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Comenzar Carrera de Artista</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
