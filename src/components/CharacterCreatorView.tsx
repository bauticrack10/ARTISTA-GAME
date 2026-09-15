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
  let styleClasses = 'bg-primary/20 text-primary-soft border-primary/30';
  if (label.startsWith('-') || variant === 'rose') {
    styleClasses = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  } else if (variant === 'emerald' || label.includes('Comercial') || label.includes('Ambición') || label.includes('Sociabilidad')) {
    styleClasses = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (variant === 'amber' || label.includes('Carisma') || label.includes('Hype') || label.includes('Fans')) {
    styleClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  } else if (variant === 'cyan' || label.includes('Habilidad') || label.includes('Disciplina') || label.includes('Constancia') || label.includes('Credibilidad')) {
    styleClasses = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  } else if (variant === 'slate') {
    styleClasses = 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-bold border tracking-wide select-none transition-all shadow-xs ${styleClasses}`}>
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
    iconColor: 'text-purple-400',
    gradient: 'from-purple-500 to-indigo-600',
    bgTrack: 'bg-purple-950/40',
    desc: 'Capacidad compositiva, experimentación sonora y profundidad conceptual.'
  },
  {
    key: 'skill',
    label: 'Habilidad / Técnica Musical',
    shortLabel: 'Skill / Técnica',
    icon: Music2,
    iconColor: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-600',
    bgTrack: 'bg-cyan-950/40',
    desc: 'Técnica vocal, métrica rítmica, ejecución de instrumentos y pulido en estudio.'
  },
  {
    key: 'charisma',
    label: 'Carisma & Presencia',
    shortLabel: 'Carisma',
    icon: Crown,
    iconColor: 'text-amber-400',
    gradient: 'from-amber-400 to-orange-500',
    bgTrack: 'bg-amber-950/40',
    desc: 'Magnetismo en tarima, soltura en redes y fidelización orgánica de fans.'
  },
  {
    key: 'commercialAppeal',
    label: 'Atractivo Comercial',
    shortLabel: 'Comercial',
    icon: DollarSign,
    iconColor: 'text-emerald-400',
    gradient: 'from-emerald-400 to-teal-500',
    bgTrack: 'bg-emerald-950/40',
    desc: 'Facilidad para crear ganchos pegadizos y sonar en playlists masivas.'
  },
  {
    key: 'originality',
    label: 'Originalidad Sonora',
    shortLabel: 'Originalidad',
    icon: Target,
    iconColor: 'text-pink-400',
    gradient: 'from-pink-500 to-rose-500',
    bgTrack: 'bg-pink-950/40',
    desc: 'Sello sonoro inconfundible, distinción estilística y respeto de la crítica underground.'
  },
  {
    key: 'discipline',
    label: 'Disciplina de Estudio',
    shortLabel: 'Disciplina',
    icon: ShieldCheck,
    iconColor: 'text-blue-400',
    gradient: 'from-blue-500 to-indigo-600',
    bgTrack: 'bg-blue-950/40',
    desc: 'Rigor en horas de grabación, cumplimiento de plazos y resistencia a la fatiga.'
  },
  {
    key: 'ambition',
    label: 'Ambición & Empuje',
    shortLabel: 'Ambición',
    icon: Flame,
    iconColor: 'text-orange-400',
    gradient: 'from-orange-500 to-red-500',
    bgTrack: 'bg-orange-950/40',
    desc: 'Impulso por trascender, superación de límites y búsqueda de escenarios mayores.'
  },
  {
    key: 'riskTolerance',
    label: 'Tolerancia al Riesgo',
    shortLabel: 'Riesgo',
    icon: Zap,
    iconColor: 'text-yellow-400',
    gradient: 'from-yellow-400 to-amber-500',
    bgTrack: 'bg-yellow-950/40',
    desc: 'Audacia para probar nuevas fórmulas sonoras y fusionar géneros.'
  },
  {
    key: 'sociability',
    label: 'Sociabilidad & Conexiones',
    shortLabel: 'Sociabilidad',
    icon: Users,
    iconColor: 'text-teal-400',
    gradient: 'from-teal-400 to-emerald-500',
    bgTrack: 'bg-teal-950/40',
    desc: 'Química en el estudio con productores y facilidad para pactar feats.'
  },
  {
    key: 'independence',
    label: 'Autogestión / Independencia',
    shortLabel: 'Autogestión',
    icon: Headphones,
    iconColor: 'text-indigo-400',
    gradient: 'from-indigo-400 to-violet-500',
    bgTrack: 'bg-indigo-950/40',
    desc: 'Capacidad de autoproducción y autonomía en decisiones artísticas.'
  }
];

export const getTraitDevelopmentTier = (val: number) => {
  if (val <= 20) return { label: 'Novato Base', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
  if (val <= 28) return { label: 'En Desarrollo', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
  if (val <= 38) return { label: 'Destacado Inicial', color: 'text-purple-300 bg-purple-500/20 border-purple-500/40' };
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
  const [name, setName] = useState('Duki Nova');
  const [realName, setRealName] = useState('Mateo Morales');
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
  const [avatarColor, setAvatarColor] = useState<string>('from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // 6. Prodigy Rare Trait (0.001% chance / 1 in 100,000)
  const [isProdigy, setIsProdigy] = useState<boolean>(() => Math.random() < 0.00001);
  const [rollCount, setRollCount] = useState(0);
  const [rollMessage, setRollMessage] = useState<string | null>(null);

  // Initialize with authentic regional name
  useEffect(() => {
    const generated = generateArtistName('Argentina');
    setName(generated.stageName);
    setRealName(generated.realName);
  }, []);

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
      setRollMessage('¡INCREÍBLE! ¡Has desbloqueado el rasgo Promesa / Prodigio (1 en 100.000)!');
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

    // Generate new regional name matching selected country
    const generated = generateArtistName(newCountry, cities[0]);
    setName(generated.stageName);
    setRealName(generated.realName);
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
      setRollMessage('¡MILAGRO GENERACIONAL! ¡Has obtenido el rasgo Promesa / Prodigio (1 en 100.000)!');
    } else {
      setRollMessage(`Intento #${rollCount + 1}: Probabilidad 0.001% (1 en 100.000). ¡Tu carrera inicia con talento auténtico!`);
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
      avatarColor: avatarColor || 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]',
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
            ? `Irrumpió en la escena en ${currentYear} en ${locationString}. Habilidad innata deslumbrante y aura de talento histórico.`
            : `Inició su carrera musical en ${currentYear} en ${locationString}. Búsqueda del sonido propio y primeras grabaciones autogestionadas.`
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
      className="min-h-screen bg-canvas text-fg p-4 sm:p-6 lg:p-8 font-sans selection:bg-primary/30 selection:text-white"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <button
              onClick={onBackToMenu}
              className="shrink-0 p-2.5 rounded-lg bg-surface border border-line text-fg hover:bg-surface-raised hover:border-primary-strong/50 transition-all cursor-pointer shadow-xs"
              title="Volver al Menú Principal"
              aria-label="Volver al Menú Principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-fg tracking-[-0.8px] flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span>Creación del Artista</span>
                <span className="whitespace-nowrap text-xs bg-surface text-primary-soft border border-primary-strong/40 px-2.5 py-0.5 rounded-full font-bold">
                  Año 1 • 2026
                </span>
              </h1>
              <p className="text-xs text-fg-muted mt-0.5">
                Diseñá tu identidad visual, seleccioná tu concepto artístico e iniciá tu viaje en la industria musical.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-quick-start-top"
              onClick={() => handleSubmit()}
              className="w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-strong to-primary text-white font-bold text-xs shadow-[0_0_15px_rgba(124,58,237,0.35)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer border border-white/20"
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
            <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2 text-fg font-bold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-primary-strong" />
                  <span>1. Identidad & Origen</span>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-canvas text-fg text-xs font-semibold hover:bg-surface-raised hover:border-primary-strong/50 transition-all cursor-pointer shadow-xs group"
                  title="Generar nombre contextualizado para el país seleccionado"
                >
                  <Shuffle className="w-3.5 h-3.5 text-info group-hover:rotate-180 transition-transform duration-300" />
                  <span>Aleatorio</span>
                </button>
              </div>

              {/* Names Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">
                    Nombre Artístico *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej: Duki Nova"
                    className="w-full bg-canvas border border-line focus:border-primary-strong rounded-lg px-3.5 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-primary-strong transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">
                    Nombre Real
                  </label>
                  <input
                    type="text"
                    value={realName}
                    onChange={e => setRealName(e.target.value)}
                    placeholder="Ej: Mateo Morales"
                    className="w-full bg-canvas border border-line focus:border-primary-strong rounded-lg px-3.5 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-primary-strong transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Age Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-fg-muted uppercase tracking-wider">
                  <span>Edad Inicial</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${ageCat.color}`}>
                      {ageCat.label}
                    </span>
                    <span className="text-fg font-mono text-sm font-bold bg-canvas px-2.5 py-0.5 rounded-md border border-line">
                      {age} Años <span className="text-fg-muted text-xs font-sans font-normal">• Nacido en {2026 - age}</span>
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
                      background: `linear-gradient(to right, #7C3AED 0%, #8B5CF6 ${agePercentage}%, #0B0C10 ${agePercentage}%, #0B0C10 100%)`
                    }}
                    className="w-full h-2 rounded-lg border border-line accent-primary-strong cursor-pointer"
                  />
                  
                  <div className="relative w-full text-2xs text-fg-muted font-mono select-none mt-1.5 h-4">
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
                  <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">
                    País de Origen
                  </label>
                  <select
                    value={country}
                    onChange={e => handleCountryChange(e.target.value)}
                    className="w-full bg-canvas border border-line focus:border-primary-strong rounded-lg px-3.5 py-2 text-xs text-fg focus:outline-none cursor-pointer font-medium"
                  >
                    {Object.keys(COUNTRY_CITIES).map(c => {
                      const meta = COUNTRY_GENRE_DEFAULTS[c];
                      const flag = meta?.flag || '🌍';
                      return (
                        <option key={c} value={c} className="bg-canvas text-fg">
                          {flag} {c}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider">
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
                      className="text-xs text-info hover:text-[#38BDF8] flex items-center gap-1 cursor-pointer font-semibold transition-colors"
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
                          className={`w-full bg-canvas border rounded-lg px-3.5 py-2 text-xs text-fg placeholder:text-fg-subtle focus:outline-none transition-colors ${
                            customCityText.trim().length > 0 && !isCustomCityValid
                              ? 'border-amber-500/60 focus:border-amber-500'
                              : isCustomCityValid
                              ? 'border-emerald-500/60 focus:border-emerald-500'
                              : 'border-info/60 focus:border-info'
                          }`}
                        />
                        {isCustomCityValid && (
                          <span
                            className="p-2 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0"
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
                      className="w-full bg-canvas border border-line focus:border-primary-strong rounded-lg px-3.5 py-2 text-xs text-fg focus:outline-none cursor-pointer"
                    >
                      {(COUNTRY_CITIES[country] || []).map(ci => (
                        <option key={ci} value={ci} className="bg-canvas text-fg">
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
            <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="border-b border-line pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-fg font-bold text-xs uppercase tracking-wider">
                  <Disc3 className="w-4 h-4 text-primary-strong" />
                  <span>2. Estilo Musical & Géneros</span>
                </div>
                {COUNTRY_GENRE_DEFAULTS[country] && (
                  <span className="text-2xs text-primary-soft bg-primary/15 border border-primary/30 px-2.5 py-0.5 rounded-full font-bold">
                    Escena {COUNTRY_GENRE_DEFAULTS[country].flag} {country}
                  </span>
                )}
              </div>

              {/* Main Genre Selection Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider">
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
                        className={`p-3 rounded-control border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                          isSelected
                            ? 'bg-primary-strong/20 border-primary-strong shadow-[0_0_15px_rgba(124,58,237,0.25)] ring-1 ring-primary-strong'
                            : isRecommended
                            ? 'bg-canvas border-primary/50 hover:border-primary-strong hover:bg-surface-raised'
                            : 'bg-canvas border-line hover:border-primary-strong/40 hover:bg-surface-raised'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-fg">
                              {g.name}
                            </span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary-soft shrink-0" />}
                          </div>
                          <span className="text-2xs text-fg-muted line-clamp-1">
                            {g.aestheticTone || g.originCountry || ''}
                          </span>
                        </div>

                        {isRecommended && (
                          <span className="text-2xs font-bold text-primary-soft bg-primary/20 px-1.5 py-0.5 rounded-sm border border-primary/40 w-fit mt-1.5">
                           Sugerido para {country}
                          </span>
                        )}
                        {!isRecommended && isCountrySecondary && (
                          <span className="text-2xs font-semibold text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded-sm border border-cyan-500/30 w-fit mt-1.5">
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
                  <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider">
                    Influencias & Subgéneros Secundarios
                  </label>
                  <span className="text-xs font-mono text-primary-soft">
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
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-primary-strong/25 border-primary-strong text-white shadow-xs'
                              : isRecommendedSub
                              ? 'bg-canvas border-primary/40 text-primary-soft hover:text-fg hover:border-primary-strong'
                              : 'bg-canvas border-line text-fg-muted hover:text-fg hover:border-primary-strong/40'
                          }`}
                        >
                          <span>{isSelected ? '✓ ' : '+ '}</span>
                          <span>{g.name}</span>
                          {isRecommendedSub && !isSelected && (
                            <span className="text-2xs text-primary-soft font-mono">★</span>
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
            <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2 text-fg font-bold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-primary-strong" />
                  <span>3. Arquetipo Artístico & Habilidades Iniciales</span>
                </div>
                <span className="text-2xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Nivel Amateur • 18 - 35 / 100
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
                    desc: 'Distribución manual con sistema Point-Buy (Base 18, máx 38, 45 pts libres).',
                    chips: ['Point-Buy (45 pts)', 'Ajuste Libre'],
                    variant: 'slate' as const
                  }
                ].map((item) => {
                  const isSelected = archetype === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setArchetype(item.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-primary-strong/20 border-primary-strong shadow-[0_0_15px_rgba(124,58,237,0.25)] ring-1 ring-primary-strong'
                          : 'bg-canvas border-line hover:border-primary-strong/40 hover:bg-surface-raised'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-fg">
                            {item.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary-soft" />}
                        </div>
                        <p className="text-xs text-fg-muted leading-relaxed mb-2.5">
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

              {/* Informative Realistic Skill Curve Banner */}
              <div className="bg-canvas p-3.5 rounded-xl border border-line flex items-start gap-3 text-xs text-fg-muted">
                <div className="p-2 rounded-lg bg-surface border border-line text-primary-soft shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-fg block">
                    Curva de Progresión Realista (Nivel Amateur: 18 - 35 / 100)
                  </span>
                  <p className="leading-relaxed">
                    Tu artista inicia en la escena underground. Las habilidades se desarrollarán y madurarán con el tiempo según los temas que grabes, el equipamiento de estudio que adquieras en la tienda de estilo de vida, el coaching vocal y las decisiones de carrera.
                  </p>
                </div>
              </div>

              {/* Archetype Skill Breakdown or Custom Point Buy System */}
              {archetype !== 'custom' ? (
                <div className="bg-canvas p-4 rounded-xl border border-line space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                    <div>
                      <span className="text-xs font-bold text-primary-soft block uppercase tracking-wider">
                        Desglose de Habilidades Iniciales: {ARCHETYPE_PRESETS[archetype]?.name}
                      </span>
                      <p className="text-xs text-fg-muted">
                        {ARCHETYPE_PRESETS[archetype]?.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-fg-muted">
                        Promedio Inicial:
                      </span>
                      <span className="text-xs font-mono font-bold text-fg bg-surface px-2.5 py-0.5 rounded-md border border-line">
                        {averageSkillRating} / 100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TRAIT_METADATA_LIST.map((meta) => {
                      const val = computedPersonality[meta.key];
                      const tier = getTraitDevelopmentTier(val);
                      const IconComp = meta.icon;

                      return (
                        <div
                          key={meta.key}
                          className="bg-surface p-3 rounded-control border border-line space-y-2 hover:border-primary-strong/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded-md bg-canvas border border-line">
                                <IconComp className={`w-3.5 h-3.5 ${meta.iconColor}`} />
                              </div>
                              <span className="text-xs font-bold text-fg">
                                {meta.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${tier.color}`}>
                                {tier.label}
                              </span>
                              <span className="font-mono font-bold text-xs text-fg">
                                {val}/100
                              </span>
                            </div>
                          </div>

                          <div className="w-full bg-canvas h-2 rounded-full overflow-hidden border border-line">
                            <div
                              className={`h-full bg-gradient-to-r ${meta.gradient} rounded-full transition-all duration-300`}
                              role="progressbar"
                              aria-label={meta.label}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={Math.round(Number(Math.min(100, Math.max(0, val))))}
                              style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                            />
                          </div>

                          <p className="text-2xs text-fg-muted leading-tight">
                            {meta.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Point Buy Mode Controller */
                <div className="bg-canvas p-4 sm:p-5 rounded-card border border-primary-strong/40 space-y-4 shadow-xl">
                  {/* Point Buy Header & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-primary-soft" />
                        <span className="text-xs font-bold text-primary-soft uppercase tracking-wider">
                          Modo Personalizado • Sistema Point-Buy
                        </span>
                      </div>
                      <p className="text-xs text-fg-muted mt-0.5">
                        Base: {CUSTOM_BASE_STAT} pts por stat • Máximo inicial: {CUSTOM_MAX_STAT} pts • Bolsa de {CUSTOM_POINTS_POOL} pts libres.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono flex items-center gap-1.5 shadow-xs ${
                          remainingCustomPoints === 0
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : remainingCustomPoints > 0
                            ? 'bg-primary-strong/20 text-primary-soft border-primary-strong/50'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>
                          Puntos Disponibles: {remainingCustomPoints} / {CUSTOM_POINTS_POOL}
                        </span>
                      </div>

                      <span className="text-xs font-mono font-bold text-fg bg-surface px-2.5 py-1.5 rounded-lg border border-line">
                        Promedio: {averageSkillRating}/100
                      </span>
                    </div>
                  </div>

                  {/* Point Budget Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-2xs font-mono text-fg-muted">
                      <span>Puntos Asignados: {spentCustomPoints} pts</span>
                      <span>Restantes: {remainingCustomPoints} pts</span>
                    </div>
                    <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-line">
                      <div
                        className="h-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] transition-all duration-300"
                        role="progressbar"
                        aria-label="Puntos asignados"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(Number(Math.min(100, (spentCustomPoints / CUSTOM_POINTS_POOL) * 100)))}
                        style={{ width: `${Math.min(100, (spentCustomPoints / CUSTOM_POINTS_POOL) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Point Buy Quick Presets Bar */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-xs font-semibold text-fg-muted">
                      Plantillas Rápidas:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyCustomPreset('balanced')}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface hover:bg-surface-raised border border-line hover:border-primary-strong/50 text-fg transition-colors cursor-pointer"
                    >
                      Equilibrado (22-23 pts)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCustomPreset('producer')}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface hover:bg-surface-raised border border-line hover:border-cyan-500/50 text-fg transition-colors cursor-pointer"
                    >
                      Foco Producción & Técnica
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCustomPreset('showman')}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface hover:bg-surface-raised border border-line hover:border-amber-500/50 text-fg transition-colors cursor-pointer"
                    >
                      Foco Carisma & Escenario
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCustomPreset('reset')}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface hover:bg-rose-950/30 border border-line hover:border-rose-500/50 text-rose-300 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Base (18 pts)</span>
                    </button>
                  </div>

                  {/* 10 Interactive Custom Trait Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {TRAIT_METADATA_LIST.map((meta) => {
                      const val = customTraits[meta.key];
                      const tier = getTraitDevelopmentTier(val);
                      const IconComp = meta.icon;
                      const canIncrement = remainingCustomPoints > 0 && val < CUSTOM_MAX_STAT;
                      const canDecrement = val > CUSTOM_BASE_STAT;

                      return (
                        <div
                          key={meta.key}
                          className="bg-surface p-3.5 rounded-xl border border-line space-y-2.5 hover:border-primary-strong/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded-md bg-canvas border border-line">
                                <IconComp className={`w-3.5 h-3.5 ${meta.iconColor}`} />
                              </div>
                              <span className="text-xs font-bold text-fg">
                                {meta.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${tier.color}`}>
                                {tier.label}
                              </span>
                              <span className="font-mono font-bold text-xs text-fg bg-canvas px-2 py-0.5 rounded-sm border border-line">
                                {val}/100
                              </span>
                            </div>
                          </div>

                          {/* Stepper + Slider Row */}
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleStepTrait(meta.key, -1)}
                              disabled={!canDecrement}
                              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                                canDecrement
                                  ? 'bg-canvas border-line text-fg hover:bg-surface-raised hover:border-rose-500/60'
                                  : 'bg-canvas/40 border-line/40 text-fg-subtle cursor-not-allowed opacity-50'
                              }`}
                              title="Disminuir -1 punto"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <input
                              type="range"
                              min={CUSTOM_BASE_STAT}
                              max={CUSTOM_MAX_STAT}
                              step={1}
                              value={val}
                              onChange={e => handleCustomTraitChange(meta.key, Number(e.target.value))}
                              className="w-full h-2 rounded-lg bg-canvas border border-line accent-primary-strong cursor-pointer"
                            />

                            <button
                              type="button"
                              onClick={() => handleStepTrait(meta.key, 1)}
                              disabled={!canIncrement}
                              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                                canIncrement
                                  ? 'bg-canvas border-line text-fg hover:bg-surface-raised hover:border-primary-strong'
                                  : 'bg-canvas/40 border-line/40 text-fg-subtle cursor-not-allowed opacity-50'
                              }`}
                              title={
                                remainingCustomPoints <= 0
                                  ? 'No te quedan puntos en la bolsa disponible'
                                  : val >= CUSTOM_MAX_STAT
                                  ? 'Máximo nivel permitido para novato (38 pts)'
                                  : 'Aumentar +1 punto'
                              }
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-2xs text-fg-muted leading-tight">
                            {meta.desc}
                          </p>
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
            <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="border-b border-line pb-3">
                <div className="flex items-center gap-2 text-fg font-bold text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-primary-strong" />
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
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-primary-strong/20 border-primary-strong shadow-[0_0_15px_rgba(124,58,237,0.25)] ring-1 ring-primary-strong'
                          : 'bg-canvas border-line hover:border-primary-strong/40 hover:bg-surface-raised'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-fg">
                            {item.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary-soft" />}
                        </div>
                        <p className="text-xs text-fg-muted leading-relaxed mb-2">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-2xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 w-fit">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PASO 5: Identidad Visual & Avatar Vectorial del Artista */}
            {/* ========================================================================= */}
            <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-line pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-fg font-bold text-xs uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-primary-strong" />
                  <span>5. Identidad Visual & Avatar del Artista</span>
                </div>
                
                {/* Clean Mode Selector Tabs: Vector Symbol vs Initials */}
                <div className="flex items-center gap-1 bg-canvas p-1 rounded-lg border border-line">
                  <button
                    type="button"
                    onClick={() => setAvatarType('symbol')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      avatarType === 'symbol'
                        ? 'bg-primary-strong text-white shadow-xs'
                        : 'text-fg-muted hover:text-fg'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Símbolo / Ícono Escénico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvatarType('initials')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      avatarType === 'initials'
                        ? 'bg-primary-strong text-white shadow-xs'
                        : 'text-fg-muted hover:text-fg'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Iniciales Tipográficas</span>
                  </button>
                </div>
              </div>

              {/* Curated Vector Presets Quick Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider">
                    Presets de Identidad Vectorial
                  </label>
                  <span className="text-xs text-fg-muted">Gradientes & Íconos Curados</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {VECTOR_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id && avatarColor === preset.color && avatarIcon === preset.icon;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-primary-strong/20 border-primary-strong shadow-[0_0_12px_rgba(124,58,237,0.3)] ring-1 ring-primary-strong'
                            : 'bg-canvas border-line hover:border-primary-strong/40 hover:bg-surface-raised'
                        }`}
                      >
                        <ArtistAvatar
                          name={preset.name}
                          avatarColor={preset.color}
                          avatarIcon={preset.icon}
                          size="sm"
                          rounded="rounded-lg"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-fg block truncate">
                            {preset.name.split('(')[0].trim()}
                          </span>
                          <span className="text-2xs text-fg-muted block truncate uppercase">
                            {preset.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vector Symbols Selector (When in Symbol mode) */}
              {avatarType === 'symbol' && (
                <div className="space-y-2.5 pt-2 border-t border-line">
                  <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider">
                    Símbolo Escénico / Ícono de Marca
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-7 gap-2.5">
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
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-primary-strong/25 border-primary-strong shadow-[0_0_15px_rgba(124,58,237,0.35)] ring-1 ring-primary-strong'
                              : 'bg-canvas border-line hover:border-primary-strong/50 hover:bg-surface-raised'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-full bg-gradient-to-tr ${avatarColor} text-white shadow-xs`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="text-2xs font-semibold text-fg truncate w-full text-center">
                            {sym.label.split('/')[0].trim()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Initials Mode Notice */}
              {avatarType === 'initials' && (
                <div className="bg-canvas p-4 rounded-xl border border-line text-center space-y-2 pt-2 border-t border-line">
                  <ArtistAvatar
                    name={name}
                    avatarColor={avatarColor}
                    size="lg"
                    rounded="rounded-card"
                    className="mx-auto shadow-lg"
                  />
                  <p className="text-xs text-fg-muted">
                    Tu avatar se generará dinámicamente con las iniciales limpias de tu nombre artístico sobre la paleta cromática activa.
                  </p>
                </div>
              )}

              {/* Studio After Dark Gradient Palette Selector */}
              <div className="space-y-2.5 pt-2 border-t border-line">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider">
                    Paleta de Color de Fondo
                  </label>
                  <span className="text-xs text-fg-muted">Gradientes Obsidian & Neón</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                        className={`p-2.5 rounded-control border flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary-strong/20 border-primary-strong shadow-xs ring-1 ring-primary-strong'
                            : 'bg-canvas border-line hover:border-primary-strong/40 hover:bg-surface-raised'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-md bg-gradient-to-tr ${p.val} shrink-0 border border-white/30 shadow-xs flex items-center justify-center`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="min-w-0 text-left">
                          <span className="text-xs font-semibold text-fg block truncate">
                            {p.label.split('(')[0].trim()}
                          </span>
                          <span className="text-2xs text-fg-muted block truncate">
                            {p.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RASGO ULTRA-RARO: Promesa / Prodigio */}
            {/* ========================================================================= */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                isProdigy
                  ? 'bg-gradient-to-r from-amber-500/15 via-surface to-purple-500/15 text-fg border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                  : 'bg-surface text-fg border-line'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-3 rounded-full ${
                      isProdigy
                        ? 'bg-amber-400 text-stone-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                        : 'bg-canvas border border-line text-primary-strong'
                    }`}
                  >
                    {isProdigy ? <Crown className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-fg">
                        Bonificación Opcional: Rasgo Promesa / Prodigio
                      </span>
                      <span
                        className={`text-2xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                          isProdigy
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-canvas border border-line text-fg-muted'
                        }`}
                      >
                        Probabilidad: 1 en 100.000
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isProdigy ? 'text-amber-200/90' : 'text-fg-muted'}`}>
                      {isProdigy
                        ? '¡ACTIVADO! Talento generacional irrepetible con atributos iniciales perfectos (95-100) y multiplicador x3 permanente.'
                        : 'Permite a los jugadores audaces tentar a la suerte antes de comenzar su carrera en busca de un prodigio histórico.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isProdigy ? (
                    <button
                      type="button"
                      onClick={handleRollProdigyLuck}
                      className="px-4 py-2 rounded-lg text-xs font-bold border border-line bg-canvas hover:bg-surface-raised hover:border-info/60 text-fg transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                    >
                      <Dices className="w-4 h-4 text-info" />
                      <span>Probar Suerte</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/30">
                      <ShieldCheck className="w-4 h-4" />
                      <span>PRODIGIO ACTIVO</span>
                    </div>
                  )}
                </div>
              </div>

              {rollMessage && (
                <div className="mt-3 pt-3 border-t border-line text-xs font-mono text-primary-soft animate-fade-in">
                  {rollMessage}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Artist Profile Card & Launch CTA */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="bg-surface border border-line rounded-2xl p-6 shadow-2xl space-y-6">
              
              {/* Avatar Live Display */}
              <div className="text-center space-y-3">
                <div className="relative inline-block mx-auto">
                  <div className="p-1 rounded-panel bg-canvas border-2 border-line shadow-xl">
                    <ArtistAvatar
                      name={name}
                      avatarColor={avatarColor}
                      avatarIcon={avatarType === 'symbol' ? avatarIcon : undefined}
                      size="xl"
                      rounded="rounded-card"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-fg tracking-tight">
                    {name || 'Nuevo Artista'}
                  </h2>
                  <p className="text-xs text-fg-muted font-normal">
                    {realName ? `"${cleanQuotes(realName)}"` : ''} • {age} Años
                  </p>
                  <p className="text-xs text-fg-muted flex items-center justify-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-info" />
                    <span>{formatCityCountry(finalResolvedCity, country)}</span>
                  </p>
                </div>

                {isProdigy && (
                  <div className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 mx-auto shadow-xs">
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>Prodigio Musical • Crecimiento x3</span>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 bg-canvas border border-line text-fg rounded-full text-xs font-semibold">
                    {selectedMainGenre?.name || 'Género'}
                  </span>
                  <span className="px-2 py-0.5 bg-canvas border border-line text-fg-muted rounded-full text-xs font-mono">
                    {startingLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Skills Profile Section in Preview Card */}
              <div className="border-t border-line pt-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-fg-muted uppercase tracking-wider">
                    Habilidades Iniciales
                  </h3>
                  <span className="text-2xs font-mono text-primary-soft font-bold">
                    {averageSkillRating}/100 Promedio
                  </span>
                </div>

                <div className="bg-canvas p-3 rounded-control border border-line space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-fg-muted">Especialidad Destacada:</span>
                    <div className="flex items-center gap-1.5">
                      {topTwoTraits.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-sm bg-surface text-primary-soft border border-primary-strong/30 font-mono font-bold text-2xs"
                        >
                          {t.name}: {t.val}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-line">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-primary to-accent rounded-full"
                      role="progressbar"
                      aria-label="Promedio de habilidades"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(Number(Math.min(100, Math.max(0, Number(averageSkillRating)))))}
                      style={{ width: `${Math.min(100, Math.max(0, Number(averageSkillRating)))}%` }}
                    />
                  </div>

                  <p className="text-2xs text-fg-subtle leading-tight">
                   Margen de desarrollo: +~75 pts mediante grabaciones, tienda de estudio y eventos.
                  </p>
                </div>
              </div>

              {/* Starting Stats Breakdown */}
              <div className="border-t border-line pt-4 space-y-2.5 text-xs">
                <h3 className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-2">
                  Condiciones Iniciales
                </h3>

                <div className="flex justify-between items-center bg-canvas px-3.5 py-2.5 rounded-lg border border-line">
                  <span className="text-fg-muted flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-success" />
                    Fondos Iniciales
                  </span>
                  <span className="font-bold text-success font-mono">
                    {formatMoney(computedStats.funds)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-canvas px-3.5 py-2.5 rounded-lg border border-line">
                  <span className="text-fg-muted flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-info" />
                    Comunidad de Fans
                  </span>
                  <span className="font-bold text-info font-mono">
                    {formatFans(computedStats.fansCount)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-canvas px-3.5 py-2.5 rounded-lg border border-line">
                  <span className="text-fg-muted flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-primary-strong" />
                    Popularidad
                  </span>
                  <span className="font-bold text-primary-soft font-mono">
                    {computedStats.popularity}/100
                  </span>
                </div>

                <div className="flex justify-between items-center bg-canvas px-3.5 py-2.5 rounded-lg border border-line">
                  <span className="text-fg-muted flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    Hype Inicial
                  </span>
                  <span className="font-bold text-orange-400 font-mono">
                    {computedStats.hype}/100
                  </span>
                </div>
              </div>

              {/* Action Button - Primary Inset CTA */}
              <button
                type="submit"
                id="btn-launch-career-bottom"
                className="w-full py-4 px-6 rounded-control bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] hover:from-[#6D28D9] hover:to-[#DB2777] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98] transition-all cursor-pointer border border-white/20"
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
