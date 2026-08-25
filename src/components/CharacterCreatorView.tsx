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
  Brain
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

  // 5. Visual Palette
  const [avatarColor, setAvatarColor] = useState('from-amber-500 via-rose-500 to-rose-600');

  // Helpers
  const handleRandomizeName = () => {
    const rName = RANDOM_ARTIST_NAMES[Math.floor(Math.random() * RANDOM_ARTIST_NAMES.length)];
    const rReal = RANDOM_REAL_NAMES[Math.floor(Math.random() * RANDOM_REAL_NAMES.length)];
    setName(rName);
    setRealName(rReal);
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
    if (startingLevel === 'underground') {
      return {
        popularity: 8,
        reputation: 15,
        artisticCredibility: 20,
        energy: 100,
        monthlyListeners: 30,
        totalStreams: 0,
        funds: 500,
        fansCount: 150,
        fanbaseLoyalty: 15,
        hype: 10,
        careerStage: 'Underground' as CareerStage
      };
    } else if (startingLevel === 'emerging') {
      return {
        popularity: 22,
        reputation: 32,
        artisticCredibility: 35,
        energy: 100,
        monthlyListeners: 12000,
        totalStreams: 45000,
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
        monthlyListeners: 3500,
        totalStreams: 12000,
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
        monthlyListeners: 15000,
        totalStreams: 60000,
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
          name: 'Inicios en el Underground & Primeras Grabaciones',
          startYear: currentYear,
          startMonth: 1,
          genreFocus: mainGenreId,
          stage: startStats.careerStage,
          highlightSummary: `Inició su carrera musical en ${currentYear} en ${finalCity}, ${country}. Búsqueda del sonido propio y primeras grabaciones autogestionadas.`
        }
      ],
      awardsWon: [],
      legacyScore: 5,
      isRetired: false,
      historicalNotes: [`Inició su carrera musical en el año ${currentYear} en ${finalCity}, ${country}.`],
      generationIndex: 1,
      influences: []
    };

    onCreatePlayer(newArtist);
  };

  const selectedMainGenre = world.genres[mainGenreId];
  const computedStats = getStartingStats();
  const computedPersonality = getComputedPersonality();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMenu}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              title="Volver al Menú Principal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <span>Creación del Artista</span>
                <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                  Año 1 • 2026
                </span>
              </h1>
              <p className="text-xs text-zinc-400">
                Diseñá tu identidad musical, seleccioná tu punto de partida e iniciá tu viaje en la industria.
              </p>
            </div>
          </div>
        </div>

        {/* Form and Preview Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration Columns (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Identidad & Origen */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                  <User className="w-4 h-4 text-rose-400" />
                  <span>1. Identidad & Origen</span>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Aleatorio</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Nombre Artístico *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej: Warren Rovers"
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Nombre Real
                  </label>
                  <input
                    type="text"
                    value={realName}
                    onChange={e => setRealName(e.target.value)}
                    placeholder="Ej: Warren Alexander"
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Age Slider */}
              <div className="pt-1">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  <span>Edad Inicial</span>
                  <span className="text-rose-400 font-mono text-sm">{age} Años (Nacido en {2026 - age})</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={35}
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>16 Años (Joven Promesa)</span>
                  <span>25 Años</span>
                  <span>35 Años (Veterano)</span>
                </div>
              </div>

              {/* Country & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    País de Origen
                  </label>
                  <select
                    value={country}
                    onChange={e => handleCountryChange(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
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
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Ciudad Natal
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCity(!isCustomCity)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
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
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  ) : (
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
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
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider border-b border-zinc-800/80 pb-3">
                <Music2 className="w-4 h-4 text-indigo-400" />
                <span>2. Estilo Musical & Géneros</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Género Principal (Identidad Central)
                </label>
                <select
                  value={mainGenreId}
                  onChange={e => {
                    const val = e.target.value;
                    setMainGenreId(val);
                    setSecondaryGenres(secondaryGenres.filter(g => g !== val));
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  {(Object.values(world.genres) as Genre[]).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.originCountry}) — {g.lifecycle.toUpperCase()}
                    </option>
                  ))}
                </select>
                {selectedMainGenre && (
                  <p className="text-[11px] text-zinc-400 mt-1.5 italic">
                    "{selectedMainGenre.aestheticTone}"
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Géneros Secundarios / Sub-estilos (Máximo 3)
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">
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
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-900/60 border-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
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
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider border-b border-zinc-800/80 pb-3">
                <Brain className="w-4 h-4 text-teal-400" />
                <span>3. Personalidad & Enfoque Artístico</span>
              </div>

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
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      archetype === a.id
                        ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-500/50'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <p className="text-xs font-bold text-zinc-100">{a.title}</p>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-tight">{a.desc}</p>
                  </button>
                ))}
              </div>

              {/* Custom Sliders if 'custom' is selected */}
              {archetype === 'custom' && (
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {Object.entries(customTraits).map(([traitKey, val]) => (
                      <div key={traitKey} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-zinc-300 font-medium capitalize">
                          <span>{traitKey.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-mono text-teal-400 font-bold">{val}</span>
                        </div>
                        <input
                          type="range"
                          min={30}
                          max={99}
                          value={val}
                          onChange={e => setCustomTraits({ ...customTraits, [traitKey]: Number(e.target.value) })}
                          className="w-full accent-teal-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Punto de Partida / Nivel Inicial */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider border-b border-zinc-800/80 pb-3">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>4. Punto de Partida (Nivel Inicial)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'underground',
                    title: 'Underground Crudo (⭐ Recomendado)',
                    desc: 'Iniciás desde cero: micrófono casero, $500 de fondos, 150 oyentes locales y 0 streams.',
                    badge: 'Auténtico'
                  },
                  {
                    id: 'local',
                    title: 'Artista de Escena Local',
                    desc: 'Algunas presentaciones en bares, $1,200 de fondos, 900 fans y 12k streams acumulados.',
                    badge: 'Barrial'
                  },
                  {
                    id: 'independent',
                    title: 'Independiente con Base',
                    desc: 'Home studio propio, $3,500 de fondos, 4,500 fans activos y 60k streams acumulados.',
                    badge: 'Equipado'
                  },
                  {
                    id: 'emerging',
                    title: 'Promesa Emergente',
                    desc: 'Cierto hype en redes, $2,500 de fondos, 2,500 fans y 45k streams acumulados.',
                    badge: 'En Alza'
                  }
                ].map(lvl => (
                  <button
                    type="button"
                    key={lvl.id}
                    onClick={() => setStartingLevel(lvl.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      startingLevel === lvl.id
                        ? 'bg-amber-950/30 border-amber-500 text-white ring-1 ring-amber-500/50'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-100">{lvl.title}</span>
                      <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-amber-400">
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 5: Paleta Visual del Artista */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider border-b border-zinc-800/80 pb-3">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>5. Estilo Visual / Avatar</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {GRADIENTS.map(g => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setAvatarColor(g.val)}
                    className={`h-12 rounded-xl bg-gradient-to-tr ${g.val} transition-all cursor-pointer relative flex items-center justify-center ${
                      avatarColor === g.val ? 'ring-2 ring-white scale-105 shadow-lg' : 'opacity-70 hover:opacity-100'
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
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl sticky top-6 space-y-6">
              <div className="text-center space-y-3">
                <div
                  className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center shadow-xl shadow-rose-500/20 text-3xl font-black text-white`}
                >
                  {name.substring(0, 2).toUpperCase() || 'AR'}
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {name || 'Nuevo Artista'}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {realName ? `"${realName}"` : ''} • {age} Años
                  </p>
                  <p className="text-xs text-zinc-500 flex items-center justify-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{isCustomCity && customCityText ? customCityText : city}, {country}</span>
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-full text-xs font-bold">
                    {selectedMainGenre?.name || 'Género'}
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full text-[11px] font-mono">
                    {startingLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Starting Stats Breakdown */}
              <div className="border-t border-zinc-800 pt-4 space-y-2.5 text-xs">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Condiciones Iniciales (Año 1)
                </h3>

                <div className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Fondos Iniciales
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">
                    ${computedStats.funds.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    Comunidad de Fans
                  </span>
                  <span className="font-bold text-teal-300 font-mono">
                    {computedStats.fansCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                    Popularidad
                  </span>
                  <span className="font-bold text-indigo-300 font-mono">
                    {computedStats.popularity} / 100
                  </span>
                </div>

                <div className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    Hype Inicial
                  </span>
                  <span className="font-bold text-rose-300 font-mono">
                    {computedStats.hype}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                id="btn-confirm-create-artist"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
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
