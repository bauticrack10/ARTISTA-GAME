import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Artist, WorldState, Genre, CareerStage } from '../types';
import { AVATAR_PRESETS, AvatarPreset } from '../data/avatarPresets';
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
  Upload,
  Image as ImageIcon,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';
import {
  generateArtistName,
  generateRandomArtistName,
  formatMoney,
  formatFans,
  cleanCountTag,
  cleanQuotes,
  cleanParentheses
} from '../utils/formatters';

interface CharacterCreatorViewProps {
  world: WorldState;
  onBackToMenu: () => void;
  onCreatePlayer: (customArtist: Partial<Artist>) => void;
}

const COUNTRY_CITIES: Record<string, string[]> = {
  Argentina: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mar del Plata', 'Mendoza', 'La Plata', 'Neuquén', 'Salta'],
  España: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Bilbao', 'Granada', 'Zaragoza'],
  México: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Tijuana', 'Puebla', 'Cancún', 'Querétaro'],
  'Puerto Rico': ['San Juan', 'Bayamón', 'Ponce', 'Carolina', 'Caguas', 'Mayagüez', 'Arecibo'],
  Colombia: ['Medellín', 'Bogotá', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'],
  Chile: ['Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar', 'Antofagasta', 'La Serena'],
  'Estados Unidos': ['Miami', 'Los Angeles', 'New York', 'Atlanta', 'Chicago', 'Houston'],
  'Reino Unido': ['Londres', 'Manchester', 'Birmingham', 'Liverpool', 'Bristol'],
  Uruguay: ['Montevideo', 'Punta del Este', 'Salto', 'Maldonado'],
  'República Dominicana': ['Santo Domingo', 'Santiago de los Caballeros', 'La Romana', 'Punta Cana']
};

const PALETTE_OPTIONS = [
  { id: 'synth_violet', label: 'Violeta Primario Synth', val: 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]' },
  { id: 'cyber_magenta', label: 'Violeta & Magenta Neón', val: 'from-[#8B5CF6] via-[#9333EA] to-[#C026D3]' },
  { id: 'electric_cyan', label: 'Cian & Azul Eléctrico', val: 'from-[#06B6D4] via-[#0284C7] to-[#4F46E5]' },
  { id: 'emerald_studio', label: 'Esmeralda & Jade Studio', val: 'from-[#10B981] via-[#0D9488] to-[#06B6D4]' },
  { id: 'gold_master', label: 'Oro & Ámbar Master', val: 'from-[#F59E0B] via-[#D97706] to-[#B45309]' },
  { id: 'sunset_urban', label: 'Atardecer Urbano', val: 'from-[#F97316] via-[#E11D48] to-[#9333EA]' },
  { id: 'midnight_obsidian', label: 'Obsidiana & Índigo', val: 'from-[#6366F1] via-[#4338CA] to-[#1E1B4B]' },
  { id: 'graphite_slate', label: 'Grafito & Platino', val: 'from-[#64748B] via-[#475569] to-[#1E293B]' }
];

const SYMBOL_OPTIONS = [
  { id: 'mic', label: 'Micrófono Pro', icon: Mic },
  { id: 'crown', label: 'Corona Real', icon: Crown },
  { id: 'flame', label: 'Fuego / Hype', icon: Flame },
  { id: 'disc', label: 'Vinilo / Master', icon: Disc3 },
  { id: 'sparkles', label: 'Destello / Estrella', icon: Sparkles },
  { id: 'zap', label: 'Rayo Eléctrico', icon: Zap },
  { id: 'music', label: 'Nota Musical', icon: Music2 },
  { id: 'radio', label: 'Onda / Radio', icon: Radio },
  { id: 'user', label: 'Silueta Artista', icon: User }
];

interface TraitChipProps {
  label: string;
  variant?: 'purple' | 'emerald' | 'amber' | 'cyan' | 'rose' | 'slate';
}

const TraitChip: React.FC<TraitChipProps> = ({ label, variant = 'purple' }) => {
  let styleClasses = 'bg-[#8B5CF6]/20 text-[#C084FC] border-[#8B5CF6]/30';
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide select-none transition-all shadow-xs ${styleClasses}`}>
      {label}
    </span>
  );
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
  const [customTraits, setCustomTraits] = useState({
    creativity: 85,
    ambition: 85,
    discipline: 80,
    charisma: 85,
    skill: 85,
    commercialAppeal: 75,
    originality: 90,
    riskTolerance: 80,
    sociability: 75,
    independence: 80
  });

  // 4. Initial Level / Starting Point
  const [startingLevel, setStartingLevel] = useState<'underground' | 'emerging' | 'local' | 'independent'>('underground');

  // 5. Visual Identity / Avatar State
  const [avatarType, setAvatarType] = useState<'preset' | 'symbol' | 'upload' | 'initials'>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('urban_trap_1');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  );
  const [avatarIcon, setAvatarIcon] = useState<string>('mic');
  const [avatarColor, setAvatarColor] = useState('from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]');
  const [avatarCategoryFilter, setAvatarCategoryFilter] = useState<string>('all');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        setRollMessage('🔧 Modo Dev: Rasgo Prodigio alternado con atajo de desarrollo.');
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

  const processUploadedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Formato no soportado. Por favor selecciona una imagen PNG, JPG, WEBP o SVG.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setUploadError('El archivo es demasiado grande. Selecciona una imagen de hasta 3MB.');
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setAvatarUrl(base64);
        setAvatarType('upload');
        setSelectedPresetId(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
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

  const getComputedPersonality = () => {
    if (isProdigy) {
      return {
        creativity: 98,
        ambition: 99,
        discipline: 96,
        charisma: 99,
        skill: 99,
        commercialAppeal: 97,
        originality: 98,
        riskTolerance: 94,
        sociability: 94,
        independence: 95
      };
    }

    if (archetype === 'visionary') {
      return {
        creativity: 95,
        ambition: 80,
        discipline: 75,
        charisma: 80,
        skill: 85,
        commercialAppeal: 65,
        originality: 95,
        riskTolerance: 90,
        sociability: 70,
        independence: 85
      };
    } else if (archetype === 'entrepreneur') {
      return {
        creativity: 75,
        ambition: 95,
        discipline: 85,
        charisma: 85,
        skill: 80,
        commercialAppeal: 92,
        originality: 75,
        riskTolerance: 80,
        sociability: 90,
        independence: 85
      };
    } else if (archetype === 'showman') {
      return {
        creativity: 80,
        ambition: 90,
        discipline: 75,
        charisma: 98,
        skill: 82,
        commercialAppeal: 92,
        originality: 80,
        riskTolerance: 85,
        sociability: 95,
        independence: 70
      };
    } else if (archetype === 'disciplined') {
      return {
        creativity: 85,
        ambition: 90,
        discipline: 98,
        charisma: 75,
        skill: 95,
        commercialAppeal: 80,
        originality: 85,
        riskTolerance: 65,
        sociability: 70,
        independence: 90
      };
    } else if (archetype === 'experimental') {
      return {
        creativity: 98,
        ambition: 75,
        discipline: 80,
        charisma: 70,
        skill: 90,
        commercialAppeal: 50,
        originality: 98,
        riskTolerance: 95,
        sociability: 60,
        independence: 95
      };
    }
    return customTraits;
  };

  const getStartingStats = () => {
    if (isProdigy) {
      return {
        popularity: 28,
        reputation: 60,
        artisticCredibility: 95,
        energy: 100,
        monthlyListeners: 850,
        totalStreams: 1200,
        funds: 8000,
        fansCount: 2500,
        fanbaseLoyalty: 85,
        hype: 65,
        careerStage: 'Underground' as CareerStage
      };
    }

    if (startingLevel === 'underground') {
      return {
        popularity: 8,
        reputation: 15,
        artisticCredibility: 20,
        energy: 100,
        monthlyListeners: 35,
        totalStreams: 0,
        funds: 500,
        fansCount: 150,
        fanbaseLoyalty: 20,
        hype: 10,
        careerStage: 'Underground' as CareerStage
      };
    } else if (startingLevel === 'emerging') {
      return {
        popularity: 22,
        reputation: 32,
        artisticCredibility: 35,
        energy: 100,
        monthlyListeners: 2400,
        totalStreams: 8500,
        funds: 2500,
        fansCount: 2500,
        fanbaseLoyalty: 30,
        hype: 25,
        careerStage: 'Emerging' as CareerStage
      };
    } else if (startingLevel === 'local') {
      return {
        popularity: 14,
        reputation: 24,
        artisticCredibility: 28,
        energy: 100,
        monthlyListeners: 650,
        totalStreams: 2200,
        funds: 1200,
        fansCount: 900,
        fanbaseLoyalty: 25,
        hype: 15,
        careerStage: 'Underground' as CareerStage
      };
    } else {
      return {
        popularity: 18,
        reputation: 30,
        artisticCredibility: 42,
        energy: 100,
        monthlyListeners: 3800,
        totalStreams: 14000,
        funds: 3500,
        fansCount: 4500,
        fanbaseLoyalty: 40,
        hype: 20,
        careerStage: 'Emerging' as CareerStage
      };
    }
  };

  const isCustomCityValid = customCityText.trim().length >= 3;
  const finalResolvedCity = isCustomCity
    ? (isCustomCityValid ? customCityText.trim() : (COUNTRY_CITIES[country]?.[0] || 'Buenos Aires'))
    : city;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPersonality = getComputedPersonality();
    const startStats = getStartingStats();
    const uniqueId = `artist_${Math.random().toString(36).substring(2, 9)}`;
    const currentYear = 2026;
    const birthYear = currentYear - age;

    const historicalNotes = [
      `Inició su carrera musical en el año ${currentYear} en ${finalResolvedCity}, ${country}.`
    ];
    if (isProdigy) {
      historicalNotes.push('Considerado un prodigio generacional irrepetible (1 en 100.000) con multiplicador x3 permanente.');
    }

    const resolvedAvatarUrl = (avatarType === 'preset' || avatarType === 'upload') && avatarUrl
      ? avatarUrl
      : undefined;

    const newArtist: Partial<Artist> = {
      id: uniqueId,
      name: name.trim() || 'Nuevo Artista',
      realName: realName.trim() || name.trim(),
      isPlayer: true,
      country,
      city: finalResolvedCity,
      birthYear,
      careerStartYear: currentYear,
      mainGenreId,
      subGenreIds: secondaryGenres,
      avatarUrl: resolvedAvatarUrl,
      avatarColor: avatarColor || 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]',
      avatarIcon: avatarIcon || undefined,
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
            ? `Irrumpió en la escena en ${currentYear} en ${finalResolvedCity}, ${country}. Habilidad innata deslumbrante y aura de talento histórico.`
            : `Inició su carrera musical en ${currentYear} en ${finalResolvedCity}, ${country}. Búsqueda del sonido propio y primeras grabaciones autogestionadas.`
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

  const filteredPresets = useMemo(() => {
    if (avatarCategoryFilter === 'all') return AVATAR_PRESETS;
    return AVATAR_PRESETS.filter(p => p.category === avatarCategoryFilter);
  }, [avatarCategoryFilter]);

  const selectedSymbolObj = SYMBOL_OPTIONS.find(s => s.id === avatarIcon) || SYMBOL_OPTIONS[0];
  const SelectedSymbolIcon = selectedSymbolObj.icon;

  // Age category text helper
  const getAgeCategory = (a: number) => {
    if (a <= 20) return { label: 'Joven Promesa', color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30' };
    if (a <= 27) return { label: 'Plena Juventud', color: 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30' };
    return { label: 'Madurez Artística', color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' };
  };
  const ageCat = getAgeCategory(age);

  // Exact math percentage for age slider progress track: (age - 16) / (35 - 16) * 100
  const agePercentage = ((age - 16) / (35 - 16)) * 100;

  return (
    <div
      className="min-h-screen bg-[#0B0C10] text-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-5">
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBackToMenu}
              className="p-2.5 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] text-[#F8FAFC] hover:bg-[#1C1F2B] hover:border-[#7C3AED]/50 transition-all cursor-pointer shadow-xs"
              title="Volver al Menú Principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-[-0.8px] flex items-center gap-2.5">
                <span>Creación del Artista</span>
                <span className="text-xs bg-[#16181F] text-[#C084FC] border border-[#7C3AED]/40 px-2.5 py-0.5 rounded-full font-bold">
                  Año 1 • 2026
                </span>
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Diseñá tu identidad musical, seleccioná tu concepto artístico e iniciá tu viaje en la industria.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form + Live Preview Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Columns (2 cols): Ordered Creation Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ========================================================================= */}
            {/* PASO 1: Identidad & Origen */}
            {/* ========================================================================= */}
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-[#7C3AED]" />
                  <span>1. Identidad & Origen</span>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#2A2E3D] bg-[#0B0C10] text-[#F8FAFC] text-xs font-semibold hover:bg-[#1C1F2B] hover:border-[#7C3AED]/50 transition-all cursor-pointer shadow-xs group"
                  title="Generar nombre contextualizado para el país seleccionado"
                >
                  <Shuffle className="w-3.5 h-3.5 text-[#06B6D4] group-hover:rotate-180 transition-transform duration-300" />
                  <span>Aleatorio ({country})</span>
                </button>
              </div>

              {/* Names Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Nombre Artístico *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej: Duki Nova"
                    className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#7C3AED] rounded-[8px] px-3.5 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#7C3AED] transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Nombre Real
                  </label>
                  <input
                    type="text"
                    value={realName}
                    onChange={e => setRealName(e.target.value)}
                    placeholder="Ej: Mateo Morales"
                    className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#7C3AED] rounded-[8px] px-3.5 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#7C3AED] transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Age Slider with Accurately Positioned Visual Ticks (0%, 47.37%, 100%) */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  <span>Edad Inicial</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ageCat.color}`}>
                      {ageCat.label}
                    </span>
                    <span className="text-[#F8FAFC] font-mono text-sm font-bold bg-[#0B0C10] px-2.5 py-0.5 rounded-[6px] border border-[#2A2E3D]">
                      {age} Años <span className="text-[#94A3B8] text-xs font-sans">(Nacido en {2026 - age})</span>
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
                    className="w-full h-2 rounded-lg border border-[#2A2E3D] accent-[#7C3AED] cursor-pointer"
                  />
                  
                  {/* Positioned Marker Ticks with Exact Mathematical Alignment */}
                  <div className="relative w-full text-[10px] text-[#94A3B8] font-mono select-none mt-1.5 h-4">
                    {/* 16 Años: 0% */}
                    <span
                      onClick={() => setAge(16)}
                      className="absolute left-0 -translate-x-0 text-left cursor-pointer hover:text-emerald-400"
                    >
                      <span className="font-bold text-[#F8FAFC]">16 Años</span>{' '}
                      <span className="text-[#10B981] font-sans font-medium">(Joven Promesa)</span>
                    </span>
                    
                    {/* 25 Años: 47.37% -> (25 - 16) / (35 - 16) * 100% = 47.368% */}
                    <span
                      onClick={() => setAge(25)}
                      className="absolute left-[47.37%] -translate-x-1/2 text-center cursor-pointer hover:text-[#C084FC]"
                    >
                      <span className="font-bold text-[#F8FAFC]">25 Años</span>
                    </span>
                    
                    {/* 35 Años: 100% */}
                    <span
                      onClick={() => setAge(35)}
                      className="absolute right-0 translate-x-0 text-right cursor-pointer hover:text-amber-400"
                    >
                      <span className="font-bold text-[#F8FAFC]">35 Años</span>{' '}
                      <span className="text-[#F59E0B] font-sans font-medium">(Veterano)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Country & Hometown Selector with Friction-free Custom City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    País de Origen
                  </label>
                  <select
                    value={country}
                    onChange={e => handleCountryChange(e.target.value)}
                    className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#7C3AED] rounded-[8px] px-3.5 py-2 text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                  >
                    {Object.keys(COUNTRY_CITIES).map(c => (
                      <option key={c} value={c} className="bg-[#0B0C10] text-[#F8FAFC]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
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
                      className="text-[11px] text-[#06B6D4] hover:text-[#38BDF8] flex items-center gap-1 cursor-pointer font-semibold transition-colors"
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
                          className={`w-full bg-[#0B0C10] border rounded-[8px] px-3.5 py-2 text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors ${
                            customCityText.trim().length > 0 && !isCustomCityValid
                              ? 'border-amber-500/60 focus:border-amber-500'
                              : isCustomCityValid
                              ? 'border-emerald-500/60 focus:border-emerald-500'
                              : 'border-[#06B6D4]/60 focus:border-[#06B6D4]'
                          }`}
                        />
                        {isCustomCityValid && (
                          <span
                            className="p-2 rounded-[6px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0"
                            title="Ciudad válida"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      {customCityText.trim().length > 0 && !isCustomCityValid && (
                        <p className="text-[10px] text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>Ingresa al menos 3 caracteres para tu ciudad personalizada.</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#7C3AED] rounded-[8px] px-3.5 py-2 text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                    >
                      {(COUNTRY_CITIES[country] || []).map(ci => (
                        <option key={ci} value={ci} className="bg-[#0B0C10] text-[#F8FAFC]">
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
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="border-b border-[#2A2E3D] pb-3">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <Disc3 className="w-4 h-4 text-[#7C3AED]" />
                  <span>2. Estilo Musical & Géneros</span>
                </div>
              </div>

              {/* Main Genre Selection Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Género Musical Principal *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.values(world.genres).map((g: Genre) => {
                    const isSelected = mainGenreId === g.id;
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => {
                          setMainGenreId(g.id);
                          setSecondaryGenres(secondaryGenres.filter(sg => sg !== g.id));
                        }}
                        className={`p-3 rounded-[10px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#7C3AED]/20 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.25)] ring-1 ring-[#7C3AED]'
                            : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#7C3AED]/40 hover:bg-[#1C1F2B]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#F8FAFC]">
                            {g.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" />}
                        </div>
                        <span className="text-[10px] text-[#94A3B8] line-clamp-1">
                          {g.aestheticTone || g.originCountry || ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Subgenres (Chips/Badges) */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Influencias & Subgéneros Secundarios
                  </label>
                  <span className="text-[11px] font-mono text-[#C084FC]">
                    {cleanCountTag(secondaryGenres.length, 3, 'seleccionados')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.values(world.genres)
                    .filter((g: Genre) => g.id !== mainGenreId)
                    .map((g: Genre) => {
                      const isSelected = secondaryGenres.includes(g.id);
                      return (
                        <button
                          type="button"
                          key={g.id}
                          onClick={() => toggleSecondaryGenre(g.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#7C3AED]/25 border-[#7C3AED] text-white shadow-xs'
                              : 'bg-[#0B0C10] border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#7C3AED]/40'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {g.name}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PASO 3: Arquetipo & Filosofía Creativa */}
            {/* ========================================================================= */}
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="border-b border-[#2A2E3D] pb-3">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-[#7C3AED]" />
                  <span>3. Arquetipo Artístico & Filosofía</span>
                </div>
              </div>

              {/* Archetypes Grid with Stylized TraitChip components */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'visionary',
                    label: 'El Visionario',
                    desc: 'Prioriza originalidad radical y experimentación. Gran impacto en la crítica.',
                    chips: ['+Originalidad', '+Creatividad', '-Comercial'],
                    variant: 'purple' as const
                  },
                  {
                    id: 'entrepreneur',
                    label: 'El Estratega',
                    desc: 'Negociador nato, enfoque comercial y control de marca. Maximiza ingresos.',
                    chips: ['+Comercial', '+Ambición', '+Sociabilidad'],
                    variant: 'emerald' as const
                  },
                  {
                    id: 'showman',
                    label: 'El Showman',
                    desc: 'Carisma magnético, viralidad en redes y presencia escénica arrolladora.',
                    chips: ['+Carisma', '+Hype', '+Fans'],
                    variant: 'amber' as const
                  },
                  {
                    id: 'disciplined',
                    label: 'El Perfeccionista',
                    desc: 'Técnica vocal excelsa, horas infinitas en estudio y consistencia de calidad.',
                    chips: ['+Habilidad', '+Disciplina', '+Constancia'],
                    variant: 'cyan' as const
                  },
                  {
                    id: 'experimental',
                    label: 'Vanguardia Pura',
                    desc: 'Rompe barreras sonoras sin atarse a tendencias ni algoritmos comerciales.',
                    chips: ['+Credibilidad', '+Riesgo', '+Innovación'],
                    variant: 'purple' as const
                  },
                  {
                    id: 'custom',
                    label: 'Personalizado',
                    desc: 'Ajuste manual y minucioso de cada rasgo psicológico y artístico.',
                    chips: ['Ajuste Libre', 'Custom Stats'],
                    variant: 'slate' as const
                  }
                ].map((item) => {
                  const isSelected = archetype === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setArchetype(item.id as any)}
                      className={`p-3.5 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#7C3AED]/20 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.25)] ring-1 ring-[#7C3AED]'
                          : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#7C3AED]/40 hover:bg-[#1C1F2B]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#F8FAFC]">
                            {item.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" />}
                        </div>
                        <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-2.5">
                          {item.desc}
                        </p>
                      </div>

                      {/* Trait Chips as Stylized Components */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.chips.map((chip, idx) => (
                          <TraitChip key={idx} label={chip} variant={item.variant} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Sliders (Only if Custom archetype) */}
              {archetype === 'custom' && (
                <div className="bg-[#0B0C10] p-4 rounded-[12px] border border-[#2A2E3D] space-y-3 pt-4">
                  <span className="text-xs font-bold text-[#C084FC] block uppercase tracking-wider">
                    Ajuste Fino de Rasgos Personalizados
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {Object.entries(customTraits).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs text-[#94A3B8] capitalize">
                          <span>{key}</span>
                          <span className="font-mono font-bold text-[#F8FAFC]">{val}/100</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={99}
                          value={val}
                          onChange={e =>
                            setCustomTraits({
                              ...customTraits,
                              [key]: Number(e.target.value)
                            })
                          }
                          className="w-full h-1.5 bg-[#16181F] rounded-lg accent-[#7C3AED] cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* PASO 4: Punto de Partida / Background */}
            {/* ========================================================================= */}
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="border-b border-[#2A2E3D] pb-3">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
                  <span>4. Punto de Partida / Background</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'underground',
                    label: 'Desde Cero (Underground)',
                    desc: 'Home studio casero, $500 de ahorro y un puñado de oyentes leales.',
                    badge: '$500 • 35 Oyentes'
                  },
                  {
                    id: 'local',
                    label: 'Escena Local / Batallas',
                    desc: 'Fogueado en competencias de freestyle barriales con $1.200 y 650 oyentes.',
                    badge: '$1.200 • 650 Oyentes'
                  },
                  {
                    id: 'emerging',
                    label: 'Promesa en Ascenso',
                    desc: 'Un par de singles virales en TikTok, $2.500 y 2.400 oyentes mensuales.',
                    badge: '$2.500 • 2.4K Oyentes'
                  },
                  {
                    id: 'independent',
                    label: 'Autogestión Profesional',
                    desc: 'Equipamiento semiprofesional, $3.500 y base sólida de 3.800 oyentes.',
                    badge: '$3.500 • 3.8K Oyentes'
                  }
                ].map((item) => {
                  const isSelected = startingLevel === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setStartingLevel(item.id as any)}
                      className={`p-3.5 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#7C3AED]/20 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.25)] ring-1 ring-[#7C3AED]'
                          : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#7C3AED]/40 hover:bg-[#1C1F2B]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#F8FAFC]">
                            {item.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" />}
                        </div>
                        <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-2">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 w-fit">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PASO 5: Identidad Visual / Avatar Completo */}
            {/* ========================================================================= */}
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-[#7C3AED]" />
                  <span>5. Identidad Visual & Avatar del Artista</span>
                </div>
                
                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1 bg-[#0B0C10] p-1 rounded-[8px] border border-[#2A2E3D]">
                  <button
                    type="button"
                    onClick={() => setAvatarType('preset')}
                    className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      avatarType === 'preset'
                        ? 'bg-[#7C3AED] text-white shadow-xs'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Galería</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvatarType('symbol')}
                    className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      avatarType === 'symbol'
                        ? 'bg-[#7C3AED] text-white shadow-xs'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Ícono / Símbolo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvatarType('upload')}
                    className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      avatarType === 'upload'
                        ? 'bg-[#7C3AED] text-white shadow-xs'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvatarType('initials')}
                    className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      avatarType === 'initials'
                        ? 'bg-[#7C3AED] text-white shadow-xs'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Iniciales</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: Presets Gallery */}
              {avatarType === 'preset' && (
                <div className="space-y-4">
                  {/* Category filters */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-[#94A3B8] font-semibold mr-1">Filtrar:</span>
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'urban', label: 'Urbano / Trap' },
                      { id: 'pop', label: 'Pop & Divas' },
                      { id: 'rock', label: 'Rock & Indie' },
                      { id: 'electronic', label: 'Electrónica & DJ' },
                      { id: 'artistic', label: 'Conceptual' }
                    ].map(cat => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setAvatarCategoryFilter(cat.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                          avatarCategoryFilter === cat.id
                            ? 'bg-[#7C3AED]/20 border-[#7C3AED] text-[#C084FC]'
                            : 'bg-[#0B0C10] border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Presets Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {filteredPresets.map((preset) => {
                      const isSelected = selectedPresetId === preset.id && avatarUrl === preset.url;
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => {
                            setSelectedPresetId(preset.id);
                            setAvatarUrl(preset.url);
                          }}
                          className={`group relative rounded-[12px] overflow-hidden border transition-all cursor-pointer flex flex-col items-center bg-[#0B0C10] ${
                            isSelected
                              ? 'border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.4)] ring-2 ring-[#7C3AED]'
                              : 'border-[#2A2E3D] hover:border-[#7C3AED]/50'
                          }`}
                        >
                          <div className="w-full aspect-square relative overflow-hidden bg-neutral-900">
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#7C3AED]/25 flex items-center justify-center">
                                <span className="p-1 rounded-full bg-[#7C3AED] text-white shadow-md">
                                  <Check className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="p-1.5 text-[10px] font-medium text-[#CBD5E1] line-clamp-1 text-center w-full">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mode 2: Icons & Symbols */}
              {avatarType === 'symbol' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#94A3B8]">
                    Selecciona un símbolo escénico para representar tu marca artística sobre la paleta de color activa:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {SYMBOL_OPTIONS.map((sym) => {
                      const isSelected = avatarIcon === sym.id;
                      const IconComp = sym.icon;
                      return (
                        <button
                          type="button"
                          key={sym.id}
                          onClick={() => setAvatarIcon(sym.id)}
                          className={`p-3.5 rounded-[12px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isSelected
                              ? 'bg-[#7C3AED]/20 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.3)] ring-1 ring-[#7C3AED]'
                              : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#7C3AED]/50 hover:bg-[#1C1F2B]'
                          }`}
                        >
                          <div
                            className={`p-3 rounded-full bg-gradient-to-tr ${avatarColor} text-white shadow-xs`}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-semibold text-[#F8FAFC]">
                            {sym.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mode 3: Custom File Upload */}
              {avatarType === 'upload' && (
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-[14px] p-6 text-center transition-colors cursor-pointer ${
                      isDragging
                        ? 'border-[#7C3AED] bg-[#7C3AED]/10'
                        : 'border-[#2A2E3D] hover:border-[#7C3AED]/60 bg-[#0B0C10]'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />

                    {avatarUrl && avatarType === 'upload' ? (
                      <div className="space-y-3">
                        <div className="w-24 h-24 mx-auto rounded-[14px] overflow-hidden border-2 border-[#7C3AED] shadow-lg bg-neutral-900">
                          <img src={avatarUrl} alt="Avatar personalizado" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Imagen cargada correctamente!</span>
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] text-xs text-[#F8FAFC] hover:border-[#7C3AED] transition-colors cursor-pointer"
                          >
                            Cambiar imagen
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAvatarUrl('');
                              setAvatarType('preset');
                              setSelectedPresetId('urban_trap_1');
                            }}
                            className="px-3 py-1.5 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] text-xs text-rose-400 hover:border-rose-500 transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 bg-[#16181F] text-[#7C3AED] rounded-full w-12 h-12 mx-auto flex items-center justify-center border border-[#2A2E3D]">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#F8FAFC]">
                            Haz clic o arrastra para subir tu foto de artista, logo SVG o render
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            Formatos soportados: SVG, PNG, JPG, WEBP (hasta 3MB)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="mt-2 px-4 py-2 rounded-[8px] bg-[#7C3AED] text-white text-xs font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:bg-[#6D28D9] transition-all cursor-pointer"
                        >
                          Seleccionar Archivo Local
                        </button>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div className="p-3 rounded-[8px] bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 4: Initials only notice */}
              {avatarType === 'initials' && (
                <div className="bg-[#0B0C10] p-4 rounded-[12px] border border-[#2A2E3D] text-center space-y-2">
                  <div
                    className={`w-16 h-16 mx-auto rounded-[12px] bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white text-xl font-black shadow-md`}
                  >
                    {name ? name.substring(0, 2).toUpperCase() : 'AR'}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Tu avatar se generará dinámicamente con las iniciales de tu nombre artístico sobre la paleta cromática seleccionada.
                  </p>
                </div>
              )}

              {/* Palette Selector (Available in all modes as accent background) */}
              <div className="space-y-2 pt-2 border-t border-[#2A2E3D]">
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Paleta de Color de Acento (Atmósfera Visual Primaria)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PALETTE_OPTIONS.map((p) => {
                    const isSelected = avatarColor === p.val;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setAvatarColor(p.val)}
                        className={`p-2 rounded-[10px] border flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C3AED]/20 border-[#7C3AED] shadow-xs ring-1 ring-[#7C3AED]'
                            : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#7C3AED]/40 hover:bg-[#1C1F2B]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-gradient-to-tr ${p.val} shrink-0 border border-white/30 shadow-xs flex items-center justify-center`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-[11px] font-semibold text-[#F8FAFC] truncate">
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RASGO ULTRA-RARO: Promesa / Prodigio (Culminación al Final) */}
            {/* ========================================================================= */}
            <div
              className={`p-5 rounded-[16px] border transition-all ${
                isProdigy
                  ? 'bg-gradient-to-r from-amber-500/15 via-[#16181F] to-purple-500/15 text-[#F8FAFC] border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                  : 'bg-[#16181F] text-[#F8FAFC] border-[#2A2E3D]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-3 rounded-full ${
                      isProdigy
                        ? 'bg-amber-400 text-stone-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                        : 'bg-[#0B0C10] border border-[#2A2E3D] text-[#7C3AED]'
                    }`}
                  >
                    {isProdigy ? <Crown className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                        Bonificación Opcional: Rasgo Promesa / Prodigio
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                          isProdigy
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-[#0B0C10] border border-[#2A2E3D] text-[#94A3B8]'
                        }`}
                      >
                        Probabilidad: 1 en 100.000 (0.001%)
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isProdigy ? 'text-amber-200/90' : 'text-[#94A3B8]'}`}>
                      {isProdigy
                        ? '✨ ¡ACTIVADO! Talento generacional irrepetible con atributos iniciales perfectos (95-100) y multiplicador x3 permanente.'
                        : 'Permite a los jugadores audaces tentar a la suerte antes de comenzar su carrera en busca de un prodigio histórico.'}
                    </p>
                  </div>
                </div>

                {/* Player-only interaction - No debug tools exposed */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isProdigy ? (
                    <button
                      type="button"
                      onClick={handleRollProdigyLuck}
                      className="px-4 py-2 rounded-[8px] text-xs font-bold border border-[#2A2E3D] bg-[#0B0C10] hover:bg-[#1C1F2B] hover:border-[#06B6D4]/60 text-[#F8FAFC] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                    >
                      <Dices className="w-4 h-4 text-[#06B6D4]" />
                      <span>Probar Suerte</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-[8px] border border-amber-400/30">
                      <ShieldCheck className="w-4 h-4" />
                      <span>PRODIGIO ACTIVO</span>
                    </div>
                  )}
                </div>
              </div>

              {rollMessage && (
                <div className="mt-3 pt-3 border-t border-[#2A2E3D] text-xs font-mono text-[#C084FC] animate-fade-in">
                  {rollMessage}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Artist Profile Card & Launch CTA */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-6 shadow-2xl space-y-6">
              
              {/* Avatar Live Display */}
              <div className="text-center space-y-3">
                <div className="relative inline-block mx-auto">
                  <div className="w-24 h-24 mx-auto rounded-[16px] overflow-hidden border-2 border-[#2A2E3D] shadow-xl bg-[#0B0C10] flex items-center justify-center">
                    {(avatarType === 'preset' || avatarType === 'upload') && avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={name || 'Avatar'}
                        className="w-full h-full object-cover"
                      />
                    ) : avatarType === 'symbol' ? (
                      <div
                        className={`w-full h-full bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white shadow-inner`}
                      >
                        <SelectedSymbolIcon className="w-10 h-10 drop-shadow-md" />
                      </div>
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white text-2xl font-black shadow-inner`}
                      >
                        {name ? name.substring(0, 2).toUpperCase() : 'AR'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
                    {name || 'Nuevo Artista'}
                  </h2>
                  <p className="text-xs text-[#94A3B8] font-normal">
                    {realName ? `"${cleanQuotes(realName)}"` : ''} • {age} Años
                  </p>
                  <p className="text-xs text-[#94A3B8] flex items-center justify-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#06B6D4]" />
                    <span>{finalResolvedCity}, {country}</span>
                  </p>
                </div>

                {isProdigy && (
                  <div className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 mx-auto shadow-xs">
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>Prodigio Musical (x3 Stats)</span>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 bg-[#0B0C10] border border-[#2A2E3D] text-[#F8FAFC] rounded-full text-xs font-semibold">
                    {selectedMainGenre?.name || 'Género'}
                  </span>
                  <span className="px-2 py-0.5 bg-[#0B0C10] border border-[#2A2E3D] text-[#94A3B8] rounded-full text-[11px] font-mono">
                    {startingLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Starting Stats Breakdown with Explicit Range Scales */}
              <div className="border-t border-[#2A2E3D] pt-4 space-y-2.5 text-xs">
                <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Condiciones Iniciales (Año 1)
                </h3>

                <div className="flex justify-between items-center bg-[#0B0C10] px-3.5 py-2.5 rounded-[8px] border border-[#2A2E3D]">
                  <span className="text-[#94A3B8] flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
                    Fondos Iniciales
                  </span>
                  <span className="font-bold text-[#10B981] font-mono">
                    {formatMoney(computedStats.funds)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#0B0C10] px-3.5 py-2.5 rounded-[8px] border border-[#2A2E3D]">
                  <span className="text-[#94A3B8] flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#06B6D4]" />
                    Comunidad de Fans
                  </span>
                  <span className="font-bold text-[#06B6D4] font-mono">
                    {formatFans(computedStats.fansCount)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#0B0C10] px-3.5 py-2.5 rounded-[8px] border border-[#2A2E3D]">
                  <span className="text-[#94A3B8] flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[#7C3AED]" />
                    Popularidad
                  </span>
                  <span className="font-bold text-[#C084FC] font-mono">
                    {computedStats.popularity}/100
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#0B0C10] px-3.5 py-2.5 rounded-[8px] border border-[#2A2E3D]">
                  <span className="text-[#94A3B8] flex items-center gap-2">
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
                id="btn-confirm-create-artist"
                className="w-full py-3.5 px-6 rounded-[8px] bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer shadow-[0_0_20px_rgba(124,58,237,0.4)] border border-white/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Comenzar Carrera Musical</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
