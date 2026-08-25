import React, { useState } from 'react';
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
  Dice5,
  Dices,
  Star,
  Award
} from 'lucide-react';

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

const RANDOM_ARTIST_NAMES = [
  'Warren Rovers', 'Neo Wolf', 'Luna V', 'Kaelo', 'Zanto', 'Aura Nova', 'Sombra', 'Vibe Kid',
  'Rocco', 'Dante Vox', 'Kira Flame', 'Jaxen', 'Milo Cruz', 'Talia Sun', 'Kidd Rush', 'Nova Silver',
  'Braulio Cash', 'Enzo Flow', 'Zeta Black', 'Ciro Sound', 'Valen Ghost', 'Tomi Trap', 'Jota Beats'
];

const RANDOM_REAL_NAMES = [
  'Warren Alexander', 'Mateo Rossi', 'Lucía Mendoza', 'Ignacio Silva', 'Facundo Morales',
  'Camila Vargas', 'Valentín Castro', 'Sofía Benítez', 'Joaquín Navarro', 'Martina Herrera'
];

const GRADIENTS = [
  { id: 'fire', label: 'Fuego & Rubí', val: 'from-amber-500 via-rose-500 to-rose-600' },
  { id: 'cyber', label: 'Neón Cyberpunk', val: 'from-fuchsia-600 via-purple-600 to-indigo-600' },
  { id: 'emerald', label: 'Esmeralda & Jade', val: 'from-emerald-500 via-teal-600 to-cyan-700' },
  { id: 'gold', label: 'Oro & Bronce', val: 'from-yellow-400 via-amber-500 to-amber-700' },
  { id: 'sunset', label: 'Atardecer Urbano', val: 'from-orange-500 via-rose-500 to-indigo-600' },
  { id: 'ocean', label: 'Océano Profundo', val: 'from-cyan-500 via-blue-600 to-indigo-900' },
  { id: 'midnight', label: 'Púrpura Medianoche', val: 'from-purple-600 via-indigo-900 to-zinc-950' },
  { id: 'mono', label: 'Grafito & Platino', val: 'from-zinc-400 via-zinc-600 to-zinc-900' }
];

export const CharacterCreatorView: React.FC<CharacterCreatorViewProps> = ({
  world,
  onBackToMenu,
  onCreatePlayer
}) => {
  // 1. Identity
  const [name, setName] = useState('Warren Rovers');
  const [realName, setRealName] = useState('Warren Alexander');
  const [age, setAge] = useState(18);
  const [country, setCountry] = useState('Argentina');
  const [city, setCity] = useState('Buenos Aires');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityText, setCustomCityText] = useState('');

  // 2. Music Style
  const [mainGenreId, setMainGenreId] = useState('trap_latino');
  const [secondaryGenres, setSecondaryGenres] = useState<string[]>(['hip_hop_rap']);

  // 3. Prodigy Trait (1 in 100,000 / 0.001%)
  const [isProdigy, setIsProdigy] = useState<boolean>(() => Math.random() < 0.00001);
  const [rollCount, setRollCount] = useState(0);
  const [rollMessage, setRollMessage] = useState<string | null>(null);

  // 4. Personality Archetype
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

  // 5. Initial Level / Starting Point
  const [startingLevel, setStartingLevel] = useState<'underground' | 'emerging' | 'local' | 'independent'>('underground');

  // 6. Visual Palette
  const [avatarColor, setAvatarColor] = useState('from-amber-500 via-rose-500 to-rose-600');

  // Helpers
  const handleRandomizeName = () => {
    const rName = RANDOM_ARTIST_NAMES[Math.floor(Math.random() * RANDOM_ARTIST_NAMES.length)];
    const rReal = RANDOM_REAL_NAMES[Math.floor(Math.random() * RANDOM_REAL_NAMES.length)];
    setName(rName);
    setRealName(rReal);

    // Also roll 1 in 100,000 chance on randomizer
    if (Math.random() < 0.00001) {
      setIsProdigy(true);
      setRollMessage('¡INCREÍBLE! ¡Has desbloqueado el rasgo Promesa / Prodigio (1 en 100.000)!');
    }
  };

  const handleRollProdigyLuck = () => {
    setRollCount(prev => prev + 1);
    const won = Math.random() < 0.00001;
    if (won) {
      setIsProdigy(true);
      setRollMessage('¡MILAGRO! ¡Has obtenido el rasgo Promesa / Prodigio (1 en 100.000)!');
    } else {
      setRollMessage(`Tirada #${rollCount + 1}: Probabilidad 0.001% (1 en 100.000). Sigue intentando o activa el modo de prueba.`);
      setTimeout(() => setRollMessage(null), 3000);
    }
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const cities = COUNTRY_CITIES[newCountry] || ['Ciudad Principal'];
    setCity(cities[0]);
    setIsCustomCity(false);
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
  const computedPersonality = getComputedPersonality();

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1c1c] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header - Strictly design.md */}
        <div className="flex items-center justify-between border-b border-[#eceae4] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMenu}
              className="p-2 rounded-md bg-[#f7f4ed] border border-[rgba(28,28,28,0.4)] text-[#1c1c1c] hover:opacity-80 transition-opacity cursor-pointer"
              title="Volver al Menú Principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1
                className="text-2xl sm:text-3xl font-semibold text-[#1c1c1c] tracking-[-0.9px] flex items-center gap-2"
                style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
              >
                <span>Creación del Artista</span>
                <span className="text-xs bg-[#eceae4] text-[#1c1c1c] px-2.5 py-0.5 rounded-full font-semibold">
                  Año 1 • 2026
                </span>
              </h1>
              <p className="text-xs text-[#5f5f5d] mt-0.5">
                Diseñá tu identidad musical, seleccioná tu punto de partida e iniciá tu viaje en la industria.
              </p>
            </div>
          </div>
        </div>

        {/* Prodigy Rare Trait Banner & Tester */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isProdigy
              ? 'bg-[#1c1c1c] text-[#fcfbf8] border-[#1c1c1c] shadow-md'
              : 'bg-[#f7f4ed] text-[#1c1c1c] border-[#eceae4]'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-full ${
                  isProdigy ? 'bg-amber-400 text-[#1c1c1c]' : 'bg-[#eceae4] text-[#1c1c1c]'
                }`}
              >
                {isProdigy ? <Crown className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Rasgo Ultra-Raro: Promesa / Prodigio
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      isProdigy
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-[#eceae4] text-[#5f5f5d]'
                    }`}
                  >
                    Probabilidad: 1 en 100.000 (0.001%)
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isProdigy ? 'text-[#fcfbf8]/80' : 'text-[#5f5f5d]'}`}>
                  {isProdigy
                    ? '✨ ¡ACTIVADO! Atributos iniciales maximizados (95-100) y Multiplicador permanente x3 en ganancia de experiencia y stats.'
                    : 'Un talento generacional irrepetible con estadísticas iniciales perfectas y progreso triplicado de por vida.'}
                </p>
              </div>
            </div>

            {/* Test buttons for prodigy */}
            <div className="flex items-center gap-2 shrink-0">
              {!isProdigy ? (
                <>
                  <button
                    type="button"
                    onClick={handleRollProdigyLuck}
                    className="px-3 py-1.5 rounded-md text-xs font-normal border border-[rgba(28,28,28,0.4)] text-[#1c1c1c] hover:opacity-80 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span>Probar Suerte</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProdigy(true)}
                    className="px-3 py-1.5 rounded-md text-xs font-normal bg-[#1c1c1c] text-[#fcfbf8] hover:opacity-80 transition-all cursor-pointer flex items-center gap-1.5"
                    style={{
                      boxShadow:
                        'rgba(0,0,0,0) 0px 0px 0px 0px, rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                    }}
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>Activar (Probar Rasgo)</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsProdigy(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-normal bg-[#eceae4] text-[#1c1c1c] hover:opacity-80 transition-all cursor-pointer"
                >
                  Desactivar
                </button>
              )}
            </div>
          </div>

          {rollMessage && (
            <div className="mt-2.5 pt-2.5 border-t border-[#eceae4]/30 text-xs font-mono">
              {rollMessage}
            </div>
          )}
        </div>

        {/* Form and Preview Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration Columns (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Identidad & Origen */}
            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#eceae4] pb-3">
                <div className="flex items-center gap-2 text-[#1c1c1c] font-semibold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-[#1c1c1c]" />
                  <span>1. Identidad & Origen</span>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-[rgba(28,28,28,0.4)] text-[#1c1c1c] text-xs font-normal hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Aleatorio</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider mb-1.5">
                    Nombre Artístico *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej: Warren Rovers"
                    className="w-full bg-[#f7f4ed] border border-[#eceae4] focus:border-[rgba(28,28,28,0.4)] rounded-md px-3.5 py-2 text-sm text-[#1c1c1c] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider mb-1.5">
                    Nombre Real
                  </label>
                  <input
                    type="text"
                    value={realName}
                    onChange={e => setRealName(e.target.value)}
                    placeholder="Ej: Warren Alexander"
                    className="w-full bg-[#f7f4ed] border border-[#eceae4] focus:border-[rgba(28,28,28,0.4)] rounded-md px-3.5 py-2 text-sm text-[#1c1c1c] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Age Slider */}
              <div className="pt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider mb-1.5">
                  <span>Edad Inicial</span>
                  <span className="text-[#1c1c1c] font-mono text-sm font-semibold">{age} Años (Nacido en {2026 - age})</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={35}
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full accent-[#1c1c1c] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5f5f5d] font-mono">
                  <span>16 Años (Joven Promesa)</span>
                  <span>25 Años</span>
                  <span>35 Años (Veterano)</span>
                </div>
              </div>

              {/* Country & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider mb-1.5">
                    País de Origen
                  </label>
                  <select
                    value={country}
                    onChange={e => handleCountryChange(e.target.value)}
                    className="w-full bg-[#f7f4ed] border border-[#eceae4] focus:border-[rgba(28,28,28,0.4)] rounded-md px-3.5 py-2 text-xs text-[#1c1c1c] focus:outline-none cursor-pointer"
                  >
                    {Object.keys(COUNTRY_CITIES).map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider">
                      Ciudad Natal
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCity(!isCustomCity)}
                      className="text-[11px] text-[#1c1c1c] underline cursor-pointer hover:opacity-80"
                    >
                      {isCustomCity ? 'Elegir de lista' : 'Personalizar'}
                    </button>
                  </div>

                  {isCustomCity ? (
                    <input
                      type="text"
                      value={customCityText}
                      onChange={e => setCustomCityText(e.target.value)}
                      placeholder="Nombre de tu ciudad..."
                      className="w-full bg-[#f7f4ed] border border-[#eceae4] focus:border-[rgba(28,28,28,0.4)] rounded-md px-3.5 py-2 text-xs text-[#1c1c1c] focus:outline-none"
                    />
                  ) : (
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#f7f4ed] border border-[#eceae4] focus:border-[rgba(28,28,28,0.4)] rounded-md px-3.5 py-2 text-xs text-[#1c1c1c] focus:outline-none cursor-pointer"
                    >
                      {(COUNTRY_CITIES[country] || []).map(ci => (
                        <option key={ci} value={ci}>
                          {ci}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Estilo Musical & Géneros */}
            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#1c1c1c] font-semibold text-xs uppercase tracking-wider border-b border-[#eceae4] pb-3">
                <Music2 className="w-4 h-4 text-[#1c1c1c]" />
                <span>2. Estilo Musical & Géneros</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider mb-1.5">
                  Género Principal (Identidad Central)
                </label>
                <select
                  value={mainGenreId}
                  onChange={e => {
                    const val = e.target.value;
                    setMainGenreId(val);
                    setSecondaryGenres(secondaryGenres.filter(g => g !== val));
                  }}
                  className="w-full bg-[#f7f4ed] border border-[#eceae4] focus:border-[rgba(28,28,28,0.4)] rounded-md px-3.5 py-2 text-xs text-[#1c1c1c] focus:outline-none cursor-pointer"
                >
                  {(Object.values(world.genres) as Genre[]).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.originCountry}) — {g.lifecycle.toUpperCase()}
                    </option>
                  ))}
                </select>
                {selectedMainGenre && (
                  <p className="text-[11px] text-[#5f5f5d] mt-1.5 italic">
                    "{selectedMainGenre.aestheticTone}"
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1c1c1c] uppercase tracking-wider">
                    Géneros Secundarios / Sub-estilos (Máximo 3)
                  </label>
                  <span className="text-[11px] text-[#5f5f5d] font-mono">
                    {secondaryGenres.length}/3 seleccionados
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
                          className={`px-3 py-1.5 rounded-full border text-xs font-normal transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1c1c1c] text-[#fcfbf8] border-[#1c1c1c] font-semibold'
                              : 'bg-[#f7f4ed] border-[#eceae4] text-[#1c1c1c] hover:border-[rgba(28,28,28,0.4)]'
                          }`}
                        >
                          {g.name}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Section 3: Personalidad & Arquetipo */}
            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#eceae4] pb-3">
                <div className="flex items-center gap-2 text-[#1c1c1c] font-semibold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-[#1c1c1c]" />
                  <span>3. Personalidad & Enfoque Artístico</span>
                </div>
                {isProdigy && (
                  <span className="text-[11px] font-semibold text-[#1c1c1c] bg-[#eceae4] px-2.5 py-0.5 rounded-full">
                    Maximizados por Prodigio (95-100)
                  </span>
                )}
              </div>

              {!isProdigy ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'visionary', title: 'Visionario', desc: '+Originalidad, +Creatividad, +Riesgo' },
                      { id: 'entrepreneur', title: 'Emprendedor', desc: '+Ambición, +Comercial, +Sociable' },
                      { id: 'showman', title: 'Showman', desc: '+Carisma magnético, +Hype, +Comercial' },
                      { id: 'disciplined', title: 'Disciplinado', desc: '+Habilidad técnica, +Constancia' },
                      { id: 'experimental', title: 'Experimental', desc: '+Originalidad extrema, -Comercial' },
                      { id: 'custom', title: 'Personalizado', desc: 'Ajustar cada atributo manualmente' }
                    ].map(a => (
                      <button
                        type="button"
                        key={a.id}
                        onClick={() => setArchetype(a.id as any)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          archetype === a.id
                            ? 'bg-[#eceae4] border-[#1c1c1c] text-[#1c1c1c] font-semibold'
                            : 'bg-[#f7f4ed] border-[#eceae4] text-[#5f5f5d] hover:text-[#1c1c1c] hover:border-[rgba(28,28,28,0.4)]'
                        }`}
                      >
                        <p className="text-xs font-semibold text-[#1c1c1c]">{a.title}</p>
                        <p className="text-[10px] text-[#5f5f5d] mt-1 leading-tight">{a.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Custom Sliders if 'custom' is selected */}
                  {archetype === 'custom' && (
                    <div className="p-4 bg-[#f7f4ed] border border-[#eceae4] rounded-lg space-y-3 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {Object.entries(customTraits).map(([traitKey, val]) => (
                          <div key={traitKey} className="space-y-1">
                            <div className="flex justify-between text-[11px] text-[#1c1c1c] font-medium capitalize">
                              <span>{traitKey.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="font-mono text-[#1c1c1c] font-semibold">{val}</span>
                            </div>
                            <input
                              type="range"
                              min={30}
                              max={99}
                              value={val}
                              onChange={e => setCustomTraits({ ...customTraits, [traitKey]: Number(e.target.value) })}
                              className="w-full accent-[#1c1c1c] cursor-pointer h-1.5 bg-[#eceae4] rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-[#eceae4] border border-[#eceae4] rounded-lg text-xs space-y-2">
                  <p className="font-semibold text-[#1c1c1c] flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    Atributos Legendarios de Nacimiento:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono text-[#1c1c1c]">
                    <span>Creatividad: 98</span>
                    <span>Ambición: 99</span>
                    <span>Disciplina: 96</span>
                    <span>Carisma: 99</span>
                    <span>Habilidad: 99</span>
                    <span>Comercial: 97</span>
                    <span>Originalidad: 98</span>
                    <span>Riesgo: 94</span>
                    <span>Sociabilidad: 94</span>
                    <span>Independencia: 95</span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Punto de Partida / Nivel Inicial */}
            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#1c1c1c] font-semibold text-xs uppercase tracking-wider border-b border-[#eceae4] pb-3">
                <Sliders className="w-4 h-4 text-[#1c1c1c]" />
                <span>4. Punto de Partida (Nivel Inicial)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'underground',
                    title: 'Underground Crudo (⭐ Recomendado)',
                    desc: 'Iniciás desde cero: micrófono casero, $500 de fondos, 150 seguidores locales y 0 streams.',
                    badge: 'Auténtico'
                  },
                  {
                    id: 'local',
                    title: 'Artista de Escena Local',
                    desc: 'Algunas presentaciones en bares, $1,200 de fondos, 900 fans y 2.2k streams acumulados.',
                    badge: 'Barrial'
                  },
                  {
                    id: 'independent',
                    title: 'Independiente con Base',
                    desc: 'Home studio propio, $3,500 de fondos, 4,500 fans activos y 14k streams acumulados.',
                    badge: 'Equipado'
                  },
                  {
                    id: 'emerging',
                    title: 'Promesa Emergente',
                    desc: 'Cierto hype en redes, $2,500 de fondos, 2,500 fans y 8.5k streams acumulados.',
                    badge: 'En Alza'
                  }
                ].map(lvl => (
                  <button
                    type="button"
                    key={lvl.id}
                    onClick={() => setStartingLevel(lvl.id as any)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
                      startingLevel === lvl.id
                        ? 'bg-[#eceae4] border-[#1c1c1c] text-[#1c1c1c]'
                        : 'bg-[#f7f4ed] border-[#eceae4] text-[#5f5f5d] hover:text-[#1c1c1c] hover:border-[rgba(28,28,28,0.4)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#1c1c1c]">{lvl.title}</span>
                      <span className="text-[9px] bg-[#eceae4] px-2 py-0.5 rounded-full font-mono text-[#1c1c1c]">
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5f5f5d] leading-relaxed">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 5: Paleta Visual del Artista */}
            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#1c1c1c] font-semibold text-xs uppercase tracking-wider border-b border-[#eceae4] pb-3">
                <Sparkles className="w-4 h-4 text-[#1c1c1c]" />
                <span>5. Estilo Visual / Avatar</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {GRADIENTS.map(g => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setAvatarColor(g.val)}
                    className={`h-11 rounded-lg bg-gradient-to-tr ${g.val} transition-all cursor-pointer relative flex items-center justify-center border border-[#eceae4] ${
                      avatarColor === g.val ? 'ring-2 ring-[#1c1c1c] scale-105 shadow-sm' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={g.label}
                  >
                    {avatarColor === g.val && (
                      <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Artist Preview & Launch Card */}
          <div className="space-y-6">
            {/* Live Artist Profile Card */}
            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 shadow-sm sticky top-6 space-y-6">
              <div className="text-center space-y-3">
                <div
                  className={`w-20 h-20 mx-auto rounded-xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white text-2xl font-semibold shadow-sm border border-[#eceae4]`}
                >
                  {name.substring(0, 2).toUpperCase() || 'AR'}
                </div>

                <div>
                  <h2
                    className="text-xl font-semibold text-[#1c1c1c] tracking-tight"
                    style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
                  >
                    {name || 'Nuevo Artista'}
                  </h2>
                  <p className="text-xs text-[#5f5f5d]">
                    {realName ? `"${realName}"` : ''} • {age} Años
                  </p>
                  <p className="text-xs text-[#5f5f5d] flex items-center justify-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#1c1c1c]" />
                    <span>{isCustomCity && customCityText ? customCityText : city}, {country}</span>
                  </p>
                </div>

                {isProdigy && (
                  <div className="bg-[#1c1c1c] text-[#fcfbf8] px-3 py-1 rounded-full text-[11px] font-semibold flex items-center justify-center gap-1.5 mx-auto">
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>🌟 Prodigio Musical (x3 Stats)</span>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 bg-[#eceae4] text-[#1c1c1c] rounded-full text-xs font-semibold">
                    {selectedMainGenre?.name || 'Género'}
                  </span>
                  <span className="px-2 py-0.5 bg-[#eceae4] text-[#5f5f5d] rounded-full text-[11px] font-mono">
                    {startingLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Starting Stats Breakdown */}
              <div className="border-t border-[#eceae4] pt-4 space-y-2 text-xs">
                <h3 className="text-xs font-semibold text-[#5f5f5d] uppercase tracking-wider mb-2">
                  Condiciones Iniciales (Año 1)
                </h3>

                <div className="flex justify-between items-center bg-[#f7f4ed] px-3 py-2 rounded-md border border-[#eceae4]">
                  <span className="text-[#5f5f5d] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#1c1c1c]" />
                    Fondos Iniciales
                  </span>
                  <span className="font-semibold text-[#1c1c1c] font-mono">
                    ${computedStats.funds.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#f7f4ed] px-3 py-2 rounded-md border border-[#eceae4]">
                  <span className="text-[#5f5f5d] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#1c1c1c]" />
                    Comunidad de Fans
                  </span>
                  <span className="font-semibold text-[#1c1c1c] font-mono">
                    {computedStats.fansCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#f7f4ed] px-3 py-2 rounded-md border border-[#eceae4]">
                  <span className="text-[#5f5f5d] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#1c1c1c]" />
                    Popularidad
                  </span>
                  <span className="font-semibold text-[#1c1c1c] font-mono">
                    {computedStats.popularity} / 100
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#f7f4ed] px-3 py-2 rounded-md border border-[#eceae4]">
                  <span className="text-[#5f5f5d] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#1c1c1c]" />
                    Hype Inicial
                  </span>
                  <span className="font-semibold text-[#1c1c1c] font-mono">
                    {computedStats.hype}
                  </span>
                </div>
              </div>

              {/* Action Button - Dark with inset shadow */}
              <button
                type="submit"
                id="btn-confirm-create-artist"
                className="w-full py-3.5 px-6 rounded-md bg-[#1c1c1c] text-[#fcfbf8] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-opacity active:opacity-80 cursor-pointer"
                style={{
                  boxShadow:
                    'rgba(0,0,0,0) 0px 0px 0px 0px, rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Comenzar Carrera</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
