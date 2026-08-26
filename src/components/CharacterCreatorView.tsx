import React, { useState, useEffect } from 'react';
import { Artist, WorldState, Genre, CareerStage } from '../types';
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
  ShieldCheck
} from 'lucide-react';
import {
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
  { id: 'synth_purple', label: 'Violeta & Púrpura Synth', val: 'from-[#8B5CF6] via-[#9333EA] to-[#6366F1]' },
  { id: 'cyber_magenta', label: 'Neón Violeta & Magenta', val: 'from-[#8B5CF6] via-[#C026D3] to-[#EC4899]' },
  { id: 'electric_cyan', label: 'Cian & Azul Eléctrico', val: 'from-[#06B6D4] via-[#0284C7] to-[#4F46E5]' },
  { id: 'emerald_studio', label: 'Esmeralda & Jade Studio', val: 'from-[#10B981] via-[#0D9488] to-[#06B6D4]' },
  { id: 'gold_master', label: 'Oro & Ámbar Master', val: 'from-[#F59E0B] via-[#D97706] to-[#B45309]' },
  { id: 'sunset_urban', label: 'Atardecer Urbano', val: 'from-[#F97316] via-[#E11D48] to-[#9333EA]' },
  { id: 'midnight_obsidian', label: 'Obsidiana & Índigo', val: 'from-[#6366F1] via-[#4338CA] to-[#1E1B4B]' },
  { id: 'graphite_slate', label: 'Grafito & Platino', val: 'from-[#64748B] via-[#475569] to-[#1E293B]' }
];

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

  // 3. Personality Archetype
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

  // 5. Visual Identity / Avatar Palette
  const [avatarColor, setAvatarColor] = useState('from-[#8B5CF6] via-[#C026D3] to-[#EC4899]');

  // 6. Prodigy Rare Trait (0.001% chance / 1 in 100,000) - Appears at the culmination
  const [isProdigy, setIsProdigy] = useState<boolean>(() => Math.random() < 0.00001);
  const [rollCount, setRollCount] = useState(0);
  const [rollMessage, setRollMessage] = useState<string | null>(null);

  // Initialize with authentic regional name
  useEffect(() => {
    const generated = generateRandomArtistName('Argentina');
    setName(generated.stageName);
    setRealName(generated.realName);
  }, []);

  const handleRandomizeName = () => {
    const generated = generateRandomArtistName(country);
    setName(generated.stageName);
    setRealName(generated.realName);

    // Minor secret chance to proc prodigy on randomizer
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
    const generated = generateRandomArtistName(newCountry);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCity = isCustomCity && customCityText.trim() ? customCityText.trim() : city;
    const finalPersonality = getComputedPersonality();
    const startStats = getStartingStats();
    const uniqueId = `artist_${Math.random().toString(36).substring(2, 9)}`;
    const currentYear = 2026;
    const birthYear = currentYear - age;

    const historicalNotes = [
      `Inició su carrera musical en el año ${currentYear} en ${finalCity}, ${country}.`
    ];
    if (isProdigy) {
      historicalNotes.push('Considerado un prodigio generacional irrepetible (1 en 100.000) con multiplicador x3 permanente.');
    }

    const newArtist: Partial<Artist> = {
      id: uniqueId,
      name: name.trim() || 'Nuevo Artista',
      realName: realName.trim() || name.trim(),
      isPlayer: true,
      country,
      city: finalCity,
      birthYear,
      careerStartYear: currentYear,
      mainGenreId,
      subGenreIds: secondaryGenres,
      avatarColor,
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
            ? `Irrumpió en la escena en ${currentYear} en ${finalCity}, ${country}. Habilidad innata deslumbrante y aura de talento histórico.`
            : `Inició su carrera musical en ${currentYear} en ${finalCity}, ${country}. Búsqueda del sonido propio y primeras grabaciones autogestionadas.`
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
  const agePercent = ((age - 16) / (35 - 16)) * 100;

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
              className="p-2.5 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] text-[#F8FAFC] hover:bg-[#1C1F2B] hover:border-[#8B5CF6]/50 transition-all cursor-pointer shadow-xs"
              title="Volver al Menú Principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-[-0.8px] flex items-center gap-2.5">
                <span>Creación del Artista</span>
                <span className="text-xs bg-[#16181F] text-[#C084FC] border border-[#8B5CF6]/40 px-2.5 py-0.5 rounded-full font-bold">
                  Año 1 • 2026
                </span>
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Diseñá tu identidad musical, seleccioná tu punto de partida e iniciá tu viaje en la industria.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form + Live Preview Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Columns (2 cols): All Creation Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ========================================================================= */}
            {/* PASO 1: Identidad & Origen */}
            {/* ========================================================================= */}
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-[#8B5CF6]" />
                  <span>1. Identidad & Origen</span>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#2A2E3D] bg-[#0B0C10] text-[#F8FAFC] text-xs font-semibold hover:bg-[#1C1F2B] hover:border-[#8B5CF6]/50 transition-all cursor-pointer shadow-xs group"
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
                    className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[8px] px-3.5 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-colors font-medium"
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
                    className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[8px] px-3.5 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Age Slider with Accurately Positioned Visual Ticks */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  <span>Edad Inicial</span>
                  <span className="text-[#F8FAFC] font-mono text-sm font-bold bg-[#0B0C10] px-2.5 py-0.5 rounded-[6px] border border-[#2A2E3D]">
                    {age} Años <span className="text-[#94A3B8] text-xs font-sans">(Nacido en {2026 - age})</span>
                  </span>
                </div>
                
                <div className="relative pt-1 pb-4">
                  <input
                    type="range"
                    min={16}
                    max={35}
                    step={1}
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full h-2 bg-[#0B0C10] border border-[#2A2E3D] rounded-lg accent-[#8B5CF6] cursor-pointer"
                  />
                  
                  {/* Positioned Marker Ticks */}
                  <div className="relative w-full text-[10px] text-[#94A3B8] font-mono select-none mt-1">
                    <span className="absolute left-0 -translate-x-0">
                      16 Años <span className="text-[#10B981] font-sans font-semibold">(Joven Promesa)</span>
                    </span>
                    <span className="absolute left-[47.37%] -translate-x-1/2 text-center text-[#F8FAFC]">
                      25 Años
                    </span>
                    <span className="absolute right-0 translate-x-0 text-right">
                      35 Años <span className="text-[#F59E0B] font-sans font-semibold">(Veterano)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Country & Unified City Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    País de Origen
                  </label>
                  <select
                    value={country}
                    onChange={e => handleCountryChange(e.target.value)}
                    className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[8px] px-3.5 py-2 text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
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
                      className="text-[11px] text-[#06B6D4] hover:text-[#38BDF8] flex items-center gap-1 cursor-pointer font-semibold"
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
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={customCityText}
                        onChange={e => setCustomCityText(e.target.value)}
                        placeholder="Escribe tu ciudad o barrio..."
                        className="w-full bg-[#0B0C10] border border-[#06B6D4]/60 focus:border-[#06B6D4] rounded-[8px] px-3.5 py-2 text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
                      />
                      {customCityText.trim() && (
                        <span className="p-2 rounded-[6px] bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  ) : (
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[8px] px-3.5 py-2 text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
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
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider border-b border-[#2A2E3D] pb-3">
                <Music2 className="w-4 h-4 text-[#EC4899]" />
                <span>2. Estilo Musical & Géneros</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                  Género Principal (Identidad Central)
                </label>
                <select
                  value={mainGenreId}
                  onChange={e => {
                    const val = e.target.value;
                    setMainGenreId(val);
                    setSecondaryGenres(secondaryGenres.filter(g => g !== val));
                  }}
                  className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[8px] px-3.5 py-2 text-xs text-[#F8FAFC] focus:outline-none cursor-pointer font-medium"
                >
                  {(Object.values(world.genres) as Genre[]).map(g => (
                    <option key={g.id} value={g.id} className="bg-[#0B0C10] text-[#F8FAFC]">
                      {g.name} ({g.originCountry}) — {g.lifecycle.toUpperCase()}
                    </option>
                  ))}
                </select>
                {selectedMainGenre && (
                  <p className="text-[11px] text-[#94A3B8] mt-1.5 italic">
                    "{cleanQuotes(selectedMainGenre.aestheticTone)}"
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Géneros Secundarios / Sub-estilos (Máximo 3)
                  </label>
                  <span className="text-[11px] text-[#C084FC] font-mono font-semibold">
                    {cleanCountTag(secondaryGenres.length, 3, 'seleccionados')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(Object.values(world.genres) as Genre[])
                    .filter(g => g.id !== mainGenreId)
                    .map(g => {
                      const isSelected = secondaryGenres.includes(g.id);
                      return (
                        <button
                          type="button"
                          key={g.id}
                          onClick={() => toggleSecondaryGenre(g.id)}
                          className={`px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold border-transparent shadow-[0_0_12px_rgba(139,92,246,0.35)] scale-102'
                              : 'bg-[#0B0C10] border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/50'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                          <span>{g.name}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PASO 3: Personalidad & Enfoque Artístico */}
            {/* ========================================================================= */}
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-[#10B981]" />
                  <span>3. Personalidad & Enfoque Artístico</span>
                </div>
                {isProdigy && (
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    Maximizados por Prodigio (95-100)
                  </span>
                )}
              </div>

              {!isProdigy ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'visionary',
                        title: 'Visionario',
                        chips: ['+Originalidad', '+Creatividad', '+Riesgo'],
                        desc: 'Innovador que busca definir nuevos sonidos.'
                      },
                      {
                        id: 'entrepreneur',
                        title: 'Emprendedor',
                        chips: ['+Ambición', '+Comercial', '+Sociable'],
                        desc: 'Estratega del negocio y alianzas de la industria.'
                      },
                      {
                        id: 'showman',
                        title: 'Showman',
                        chips: ['+Carisma', '+Hype', '+Comercial'],
                        desc: 'Atracción escénica nata y magnetismo viral.'
                      },
                      {
                        id: 'disciplined',
                        title: 'Disciplinado',
                        chips: ['+Técnica', '+Constancia', '+Enfoque'],
                        desc: 'Obsesión por la maestría y la ética de trabajo.'
                      },
                      {
                        id: 'experimental',
                        title: 'Experimental',
                        chips: ['+Vanguardia', '+Originalidad', '-Comercial'],
                        desc: 'Ruptura radical con las fórmulas preestablecidas.'
                      },
                      {
                        id: 'custom',
                        title: 'Personalizado',
                        chips: ['Ajuste Manual', '10 Atributos'],
                        desc: 'Configurá cada faceta de tu personalidad a medida.'
                      }
                    ].map(a => (
                      <button
                        type="button"
                        key={a.id}
                        onClick={() => setArchetype(a.id as any)}
                        className={`p-3.5 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          archetype === a.id
                            ? 'bg-[#1C1F2B] border-[#8B5CF6] text-[#F8FAFC] font-semibold ring-1 ring-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                            : 'bg-[#0B0C10] border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/50'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-[#F8FAFC]">{a.title}</p>
                          <p className="text-[11px] text-[#94A3B8] mt-1 leading-tight">{a.desc}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-[#2A2E3D]/50">
                          {a.chips.map((chip, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#16181F] text-[#CBD5E1] border border-[#2A2E3D]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Sliders if 'custom' is selected */}
                  {archetype === 'custom' && (
                    <div className="p-4 bg-[#0B0C10] border border-[#2A2E3D] rounded-[12px] space-y-3 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        {Object.entries(customTraits).map(([traitKey, val]) => {
                          const valueColor = val > 75 ? 'text-[#10B981]' : val >= 50 ? 'text-[#38BDF8]' : 'text-amber-400';
                          return (
                            <div key={traitKey} className="space-y-1">
                              <div className="flex justify-between text-[11px] text-[#F8FAFC] font-medium capitalize">
                                <span>{traitKey.replace(/([A-Z])/g, ' $1')}</span>
                                <span className={`font-mono font-bold ${valueColor}`}>{val}/100</span>
                              </div>
                              <input
                                type="range"
                                min={30}
                                max={99}
                                value={val}
                                onChange={e => setCustomTraits({ ...customTraits, [traitKey]: Number(e.target.value) })}
                                className="w-full cursor-pointer h-1.5 bg-[#16181F] rounded-lg accent-[#8B5CF6]"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-[#0B0C10] border border-amber-500/30 rounded-[12px] text-xs space-y-2.5">
                  <p className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    Atributos Legendarios de Nacimiento:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono text-[#F8FAFC]">
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Creatividad: 98/100</span>
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Ambición: 99/100</span>
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Disciplina: 96/100</span>
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Carisma: 99/100</span>
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Habilidad: 99/100</span>
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Comercial: 97/100</span>
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Originalidad: 98/100</span>
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Riesgo: 94/100</span>
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Sociabilidad: 94/100</span>
                    <span className="bg-[#16181F] p-1.5 rounded-[6px] border border-[#2A2E3D]">Independencia: 95/100</span>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* PASO 4: Punto de Partida / Nivel Inicial */}
            {/* ========================================================================= */}
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider border-b border-[#2A2E3D] pb-3">
                <Sliders className="w-4 h-4 text-[#06B6D4]" />
                <span>4. Punto de Partida (Nivel Inicial)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'underground',
                    title: 'Underground Crudo (⭐ Recomendado)',
                    desc: 'Iniciás desde cero: micrófono casero, $500 de fondos, 150 seguidores locales y 0 streams.',
                    badge: 'Auténtico',
                    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  },
                  {
                    id: 'local',
                    title: 'Artista de Escena Local',
                    desc: 'Presentaciones en bares, $1,200 de fondos, 900 fans y 2.2k streams acumulados.',
                    badge: 'Barrial',
                    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                  },
                  {
                    id: 'independent',
                    title: 'Independiente con Base',
                    desc: 'Home studio propio, $3,500 de fondos, 4,500 fans activos y 14k streams acumulados.',
                    badge: 'Equipado',
                    badgeColor: 'bg-purple-500/15 text-[#C084FC] border-[#8B5CF6]/30'
                  },
                  {
                    id: 'emerging',
                    title: 'Promesa Emergente',
                    desc: 'Cierto hype en redes, $2,500 de fondos, 2,500 fans y 8.5k streams acumulados.',
                    badge: 'En Alza',
                    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }
                ].map(lvl => (
                  <button
                    type="button"
                    key={lvl.id}
                    onClick={() => setStartingLevel(lvl.id as any)}
                    className={`p-3.5 rounded-[12px] border text-left transition-all cursor-pointer relative ${
                      startingLevel === lvl.id
                        ? 'bg-[#1C1F2B] border-[#8B5CF6] text-[#F8FAFC] ring-1 ring-[#8B5CF6] shadow-sm'
                        : 'bg-[#0B0C10] border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#F8FAFC]">{lvl.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${lvl.badgeColor}`}>
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PASO 5: Identidad Visual / Paleta de Color */}
            {/* ========================================================================= */}
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 sm:p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                  <span>5. Identidad Visual / Paleta Cromática</span>
                </div>
                <span className="text-[11px] text-[#94A3B8]">
                  Define el aura del artista en la interfaz
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PALETTE_OPTIONS.map(p => {
                  const isSelected = avatarColor === p.val;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setAvatarColor(p.val)}
                      className={`p-3 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-[#1C1F2B] border-[#8B5CF6] ring-1 ring-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                          : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#8B5CF6]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-[8px] bg-gradient-to-tr ${p.val} border border-white/20 flex items-center justify-center shadow-xs`}>
                          {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                        </div>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-[#C084FC] font-bold' : 'text-[#64748B]'}`}>
                          {isSelected ? 'ACTIVO' : ''}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#F8FAFC] truncate">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
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
                        : 'bg-[#0B0C10] border border-[#2A2E3D] text-[#8B5CF6]'
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

                {/* Player-only interaction */}
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
              
              {/* Avatar & Header */}
              <div className="text-center space-y-3">
                <div
                  className={`w-20 h-20 mx-auto rounded-[14px] bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white text-2xl font-black shadow-lg border-2 border-white/20`}
                >
                  {name ? name.substring(0, 2).toUpperCase() : 'AR'}
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
                    <span>{isCustomCity && customCityText ? customCityText : city}, {country}</span>
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
                    <TrendingUp className="w-3.5 h-3.5 text-[#8B5CF6]" />
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
                className="w-full py-3.5 px-6 rounded-[8px] bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-white/20"
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
