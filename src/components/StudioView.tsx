import React, { useState } from 'react';
import { Artist, WorldState, Song, Album, ReleaseType, LongevityCurve, Producer } from '../types';
import { getArtistDerivedStyles, SUBGENRE_DETAILS } from '../data/genres';
import { GameEngine } from '../core/GameEngine';
import {
  Disc3,
  Sparkles,
  Mic,
  Sliders,
  DollarSign,
  Layers,
  CheckCircle2,
  Music2,
  Flame,
  Award,
  Lock,
  Unlock,
  AlertCircle,
  Plus,
  Trash2,
  TrendingUp,
  Info,
  Calendar,
  Radio,
  FileMusic,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  getGenreTheme,
  getGenreBadgeClass,
  RELEASE_BADGES,
  ARTISTIC_COVER_GRADIENTS
} from '../utils/themeColors';

interface StudioViewProps {
  player: Artist;
  world: WorldState;
  onReleaseSong: (params: {
    title: string;
    genreId: string;
    subGenreIds: string[];
    featuredArtistIds: string[];
    producerId?: string;
    budgetProduction: number;
    budgetMarketing: number;
    longevityCurve: LongevityCurve;
  }) => void;
  onReleaseAlbum: (params: {
    title: string;
    type: Album['type'];
    genreId: string;
    subGenreIds: string[];
    newTrackTitles?: string[];
    songTitles?: string[];
    includedSingleIds?: string[];
    budgetProduction: number;
    budgetMarketing: number;
    producerId?: string;
  }) => void;
}

const TITLE_SUGGESTIONS = [
  'Crónicas del Asfalto',
  'Frecuencias de Medianoche',
  'Génesis & Apocalipsis',
  'Diamantes en la Penumbra',
  'El Último Trago de Verano',
  'Sinfonía Callejera',
  'Corazón en Llamas',
  'Memorias de un Viajero',
  'Ecos de la Ciudad',
  'Oro & Cenizas',
  'La Noche Eterna',
  'Revolución Sonora',
  'El Precio de la Gloria',
  'Vértigo y Luces'
];

export const StudioView: React.FC<StudioViewProps> = ({
  player,
  world,
  onReleaseSong,
  onReleaseAlbum
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'album' | 'catalog'>('single');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'singles' | 'albums'>('all');

  const currentEra = player.eras && player.eras.length > 0 ? player.eras[player.eras.length - 1] : undefined;
  const styleDerivation = getArtistDerivedStyles(player, currentEra, world.genres);
  const primaryGenreTheme = getGenreTheme(styleDerivation.primaryGenreId);

  // Singles released this year
  const MAX_SINGLES = GameEngine.MAX_SINGLES_PER_YEAR;
  const playerSongs = (Object.values(world.songs) as Song[]).filter(s => s.artistId === player.id);
  const singlesThisYear = playerSongs.filter(s => s.releaseYear === world.currentYear && s.isSingle).length;
  const isSinglesLimitReached = singlesThisYear >= MAX_SINGLES;

  // Single State
  const [singleTitle, setSingleTitle] = useState('');
  const [selectedSubgenreId, setSelectedSubgenreId] = useState<string>(
    styleDerivation.availableStyles[0]?.id || ''
  );
  const [singleProducer, setSingleProducer] = useState<string>('');
  const [singleProdBudget, setSingleProdBudget] = useState(2000);
  const [singleMktBudget, setSingleMktBudget] = useState(2500);
  const [singleLongevity, setSingleLongevity] = useState<LongevityCurve>('steady');

  // Album State
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumType, setAlbumType] = useState<Album['type']>('album');
  const [selectedAlbumSubgenreId, setSelectedAlbumSubgenreId] = useState<string>(
    styleDerivation.availableStyles[0]?.id || ''
  );
  const [albumProducer, setAlbumProducer] = useState<string>('');
  const [albumProdBudget, setAlbumProdBudget] = useState(12000);
  const [albumMktBudget, setAlbumMktBudget] = useState(10000);

  // Standalone singles available for album inclusion
  const availablePreviousSingles = playerSongs.filter(s => s.isSingle && !s.albumId);
  const [includedSingleIds, setIncludedSingleIds] = useState<string[]>([]);

  // New Tracks for the album
  const [newTrackTitles, setNewTrackTitles] = useState<string[]>([
    'Intro (Declaración)',
    'Fuego en las Calles',
    'Noches de Gloria',
    'Diamantes y Cicatrices',
    'Bajo las Luces del Neón',
    'Outro (El Legado)'
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const playerAlbums = (Object.values(world.albums) as Album[]).filter(a => a.artistId === player.id);

  // Minimum tracks validation by format
  const getMinTracksForType = (type: Album['type']): number => {
    switch (type) {
      case 'ep': return 4;
      case 'mixtape': return 6;
      case 'album': return 6;
      case 'deluxe': return 10;
      case 'collab_album': return 6;
      default: return 6;
    }
  };

  const totalAlbumTracksCount = includedSingleIds.length + newTrackTitles.filter(t => t.trim().length > 0).length;
  const minTracksRequired = getMinTracksForType(albumType);

  // Quick title suggestion
  const generateRandomTitle = (isAlbum: boolean) => {
    const random = TITLE_SUGGESTIONS[Math.floor(Math.random() * TITLE_SUGGESTIONS.length)];
    if (isAlbum) {
      setAlbumTitle(random);
    } else {
      setSingleTitle(random);
    }
  };

  const toggleSingleInclusion = (id: string) => {
    if (includedSingleIds.includes(id)) {
      setIncludedSingleIds(includedSingleIds.filter(s => s !== id));
    } else {
      setIncludedSingleIds([...includedSingleIds, id]);
    }
  };

  // Handlers
  const handleCreateSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleTitle.trim()) return;

    if (isSinglesLimitReached) {
      alert(`Has alcanzado el límite anual de lanzamientos (${MAX_SINGLES} singles en ${world.currentYear}). Avanza al próximo año o graba un Álbum Completo.`);
      return;
    }

    const prodFee = singleProducer ? (world.producers[singleProducer]?.costPerTrack || 0) : 0;
    const totalCost = singleProdBudget + singleMktBudget + prodFee;

    if (totalCost > player.stats.funds) {
      alert(`Fondos insuficientes. Necesitas $${totalCost.toLocaleString()} y tienes $${player.stats.funds.toLocaleString()}`);
      return;
    }
    if (player.stats.energy < 15) {
      alert('Tu artista está demasiado agotado para grabar (energía menor a 15%). ¡Toma un respiro antes!');
      return;
    }

    onReleaseSong({
      title: singleTitle,
      genreId: styleDerivation.primaryGenreId,
      subGenreIds: selectedSubgenreId ? [selectedSubgenreId] : [],
      featuredArtistIds: [],
      producerId: singleProducer || undefined,
      budgetProduction: singleProdBudget,
      budgetMarketing: singleMktBudget,
      longevityCurve: singleLongevity
    });

    setNotification(`¡El single "${singleTitle}" ha sido lanzado al mercado mundial!`);
    setSingleTitle('');
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;

    if (totalAlbumTracksCount < minTracksRequired) {
      alert(`Un proyecto en formato ${albumType.toUpperCase()} requiere al menos ${minTracksRequired} canciones. Tienes ${totalAlbumTracksCount}.`);
      return;
    }

    const prodFee = albumProducer ? (world.producers[albumProducer]?.costPerTrack || 0) * Math.min(newTrackTitles.length, 6) : 0;
    const totalCost = albumProdBudget + albumMktBudget + prodFee;

    if (totalCost > player.stats.funds) {
      alert(`Fondos insuficientes. Necesitas $${totalCost.toLocaleString()} y tienes $${player.stats.funds.toLocaleString()}`);
      return;
    }
    if (player.stats.energy < 35) {
      alert('Tu artista está exhausto. Producir y masterizar un proyecto completo requiere al menos 35% de energía.');
      return;
    }

    onReleaseAlbum({
      title: albumTitle,
      type: albumType,
      genreId: styleDerivation.primaryGenreId,
      subGenreIds: selectedAlbumSubgenreId ? [selectedAlbumSubgenreId] : [],
      newTrackTitles: newTrackTitles.filter(t => t.trim().length > 0),
      includedSingleIds,
      budgetProduction: albumProdBudget,
      budgetMarketing: albumMktBudget,
      producerId: albumProducer || undefined
    });

    setNotification(`¡El proyecto "${albumTitle}" ha sido publicado en todas las plataformas con gran repercusión crítica!`);
    setAlbumTitle('');
    setIncludedSingleIds([]);
    setTimeout(() => setNotification(null), 6000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (score >= 70) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-rose-100 text-rose-900 border-rose-300';
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-[#1c1c1c]">
      {/* --- HEADER: WARM BASE WITH VIBRANT MUSIC ELEMENTS --- */}
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
              Estudio Creativo & Producción
            </span>
            <span className="text-xs text-[#5f5f5d]">
              Año {world.currentYear} • Mes {world.currentMonth}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1c1c1c]">
            Estudio de Grabación & Composición
          </h1>
          <p className="text-sm text-[#5f5f5d] leading-relaxed">
            Graba sencillos promocionales, compone álbumes conceptuales que definan tu Era y configura tus presupuestos de producción y marketing.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#eceae4]/60 rounded-[8px] border border-[#eceae4] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3.5 py-2 rounded-[6px] transition-all cursor-pointer ${
              activeTab === 'single'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-sm'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c] bg-transparent'
            }`}
          >
            Lanzar Single
          </button>
          <button
            onClick={() => setActiveTab('album')}
            className={`px-3.5 py-2 rounded-[6px] transition-all cursor-pointer ${
              activeTab === 'album'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-sm'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c] bg-transparent'
            }`}
          >
            Grabar Álbum / EP
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-2 rounded-[6px] transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-sm'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c] bg-transparent'
            }`}
          >
            Catálogo ({playerSongs.length})
          </button>
        </div>
      </div>

      {/* --- NOTIFICATION TOAST --- */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* --- SONIC IDENTITY & CURRENT ERA BAR --- */}
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#eceae4] pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-tr ${primaryGenreTheme.gradient} text-[#fcfbf8] flex items-center justify-center font-bold text-sm shadow-sm`}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f5f5d] block">
                Era Artística Activa
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-[#1c1c1c]">
                {currentEra ? currentEra.name : 'Los Primeros Pasos'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${primaryGenreTheme.badgeBg} ${primaryGenreTheme.badgeText} border ${primaryGenreTheme.badgeBorder}`}>
              Género Anclado: {styleDerivation.primaryGenreName}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[#eceae4] bg-[#fcfbf8] text-[#5f5f5d]">
              {player.careerStage}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#5f5f5d] leading-relaxed">
          <Info className="w-3.5 h-3.5 inline mr-1 text-purple-600" />
          Tu dirección sonora está gobernada por tu Era actual y los atributos de tu artista. Los sub-estilos se desbloquean a medida que desarrollas tu Creatividad, Habilidad, Originalidad y Tolerancia al Riesgo.
        </p>
      </div>

      {/* --- TAB 1: SINGLE CREATION --- */}
      {activeTab === 'single' && (
        <form onSubmit={handleCreateSingle} className="bg-[#f7f4ed] border border-[#eceae4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#eceae4] pb-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c] flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-600" />
                Componer Nuevo Single
              </h2>
              <p className="text-xs text-[#5f5f5d] mt-1">
                Lanza un sencillo promocional para impactar en playlists y radios.
              </p>
            </div>

            {/* Annual Singles Limit Badge */}
            <div className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              isSinglesLimitReached
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-purple-50/50 border-purple-200 text-purple-900'
            }`}>
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Singles en {world.currentYear}:</span>
              <strong className="font-mono">{singlesThisYear} / {MAX_SINGLES}</strong>
              {isSinglesLimitReached && <span className="text-[10px] text-rose-600 font-bold uppercase">(Tope alcanzado)</span>}
            </div>
          </div>

          {isSinglesLimitReached && (
            <div className="bg-amber-50 border border-amber-300 text-amber-950 p-4 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-sm text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                Límite anual de singles alcanzado ({MAX_SINGLES}/{MAX_SINGLES})
              </div>
              <p className="text-amber-900 leading-relaxed">
                Para mantener el realismo de la industria y no saturar a tus oyentes, el cupo de sencillos se reinicia cada nuevo año. Puedes avanzar de año con el botón superior, o grabar un <strong>Álbum / EP Completo</strong> en la pestaña contigua.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Title & Sonic Sub-style */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c]">
                    Título de la Canción *
                  </label>
                  <button
                    type="button"
                    onClick={() => generateRandomTitle(false)}
                    className="text-xs text-purple-700 hover:text-purple-900 underline font-semibold cursor-pointer"
                  >
                    Sugerir Título
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ej: Medianoche en Tokio, Barrio Fino..."
                  value={singleTitle}
                  onChange={e => setSingleTitle(e.target.value)}
                  className="w-full bg-[#fcfbf8] border border-[#eceae4] focus:border-purple-500 rounded-[6px] px-4 py-2.5 text-sm text-[#1c1c1c] placeholder-[#5f5f5d] focus:outline-none transition-colors"
                />
              </div>

              {/* Sub-style Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c] mb-2">
                  Dirección Sónica de la Era ({styleDerivation.primaryGenreName})
                </label>
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {styleDerivation.availableStyles.map(style => {
                    const isSelected = selectedSubgenreId === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => {
                          if (style.isUnlocked) setSelectedSubgenreId(style.id);
                        }}
                        className={`p-3.5 rounded-xl border transition-all ${
                          !style.isUnlocked
                            ? 'opacity-50 bg-[#eceae4]/20 border-[#eceae4] cursor-not-allowed'
                            : isSelected
                            ? `bg-gradient-to-r ${primaryGenreTheme.gradient} text-[#fcfbf8] ${primaryGenreTheme.borderClass} shadow-md cursor-pointer`
                            : `bg-[#fcfbf8] hover:bg-purple-50/50 border-[#eceae4] text-[#1c1c1c] cursor-pointer`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-[#fcfbf8]' : 'text-[#1c1c1c]'}`}>
                            {style.name}
                          </span>
                          {style.isUnlocked ? (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              Desbloqueado
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> {style.lockReason}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] mt-1 leading-snug ${isSelected ? 'text-[#fcfbf8]/85' : 'text-[#5f5f5d]'}`}>
                          {style.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Producer */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c] mb-2">
                  Productor Musical / Beatmaker
                </label>
                <select
                  value={singleProducer}
                  onChange={e => setSingleProducer(e.target.value)}
                  className="w-full bg-[#fcfbf8] border border-[#eceae4] focus:border-purple-500 rounded-[6px] px-3.5 py-2.5 text-xs text-[#1c1c1c] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">Autoproducción en Home Studio ($0)</option>
                  {(Object.values(world.producers) as Producer[]).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (+{p.qualityBoost}% Calidad) — ${p.costPerTrack.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column: Longevity, Budgets & Launch Preview */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c] mb-2">
                  Comportamiento & Curva de Streaming
                </label>
                <select
                  value={singleLongevity}
                  onChange={e => setSingleLongevity(e.target.value as LongevityCurve)}
                  className="w-full bg-[#fcfbf8] border border-[#eceae4] focus:border-purple-500 rounded-[6px] px-3.5 py-2.5 text-xs text-[#1c1c1c] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="steady">Estable (Crecimiento y caída predecible mes a mes)</option>
                  <option value="explosive_drop">Debut Explosivo (Gran impacto inicial, caída rápida)</option>
                  <option value="slow_burn">Slow Burn (Crece lentamente durante 6-12 meses)</option>
                  <option value="sleeper_viral">Potencial Viral Durmiente (Puede explotar años después)</option>
                  <option value="instant_classic">Clásico Instantáneo (Mínima pérdida de streams con los años)</option>
                </select>
              </div>

              {/* Budgets Sliders */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#fcfbf8] p-4 rounded-xl border border-amber-200/80 space-y-1">
                  <span className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Producción & Mezcla
                  </span>
                  <div className="text-sm font-bold font-mono text-amber-800 mb-2">
                    ${singleProdBudget.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="25000"
                    step="500"
                    value={singleProdBudget}
                    onChange={e => setSingleProdBudget(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>

                <div className="bg-[#fcfbf8] p-4 rounded-xl border border-emerald-200/80 space-y-1">
                  <span className="block text-[11px] font-semibold text-emerald-900 mb-1">
                    Marketing & Campaña
                  </span>
                  <div className="text-sm font-bold font-mono text-emerald-800 mb-2">
                    ${singleMktBudget.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="25000"
                    step="500"
                    value={singleMktBudget}
                    onChange={e => setSingleMktBudget(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Cost & Summary Card */}
              <div className="bg-gradient-to-br from-[#fcfbf8] to-purple-50/30 p-4 rounded-xl border border-[#eceae4] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#5f5f5d]">
                  <span>Costo Total del Sencillo:</span>
                  <span className="font-bold font-mono text-purple-900 text-sm">
                    ${(singleProdBudget + singleMktBudget + (singleProducer ? (world.producers[singleProducer]?.costPerTrack || 0) : 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#5f5f5d]">
                  <span>Consumo de Energía:</span>
                  <span className="font-semibold text-rose-700">-15% Energía</span>
                </div>
                <div className="flex items-center justify-between text-[#5f5f5d]">
                  <span>Fondos Disponibles:</span>
                  <span className="font-bold font-mono text-emerald-800">
                    ${player.stats.funds.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#eceae4]">
            <button
              type="submit"
              disabled={isSinglesLimitReached}
              className={`px-5 py-2.5 rounded-[6px] text-sm font-semibold transition-all flex items-center gap-2 ${
                isSinglesLimitReached
                  ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-60'
                  : 'bg-[#1c1c1c] text-[#fcfbf8] shadow-sm hover:opacity-90 active:opacity-80 cursor-pointer'
              }`}
              style={{
                boxShadow:
                  'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
              }}
            >
              <Disc3 className="w-4 h-4 text-purple-400" />
              <span>Grabar & Publicar Single</span>
            </button>
          </div>
        </form>
      )}

      {/* --- TAB 2: ALBUM & EP CREATION STUDIO --- */}
      {activeTab === 'album' && (
        <form onSubmit={handleCreateAlbum} className="bg-[#f7f4ed] border border-[#eceae4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-[#eceae4] pb-4">
            <h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c] flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Estudio de Composición de Álbumes & Proyectos
            </h2>
            <p className="text-xs text-[#5f5f5d] mt-1">
              Crea una obra conceptual completa, incluye sencillos previos de tu Era y desafía las críticas de prensa especializada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Concept, Format & Previous Singles */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c]">
                    Título del Álbum / Proyecto *
                  </label>
                  <button
                    type="button"
                    onClick={() => generateRandomTitle(true)}
                    className="text-xs text-indigo-700 hover:text-indigo-900 underline font-semibold cursor-pointer"
                  >
                    Sugerir Título Conceptual
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ej: Crónicas de una Noche, Génesis..."
                  value={albumTitle}
                  onChange={e => setAlbumTitle(e.target.value)}
                  className="w-full bg-[#fcfbf8] border border-[#eceae4] focus:border-indigo-500 rounded-[6px] px-4 py-2.5 text-sm text-[#1c1c1c] placeholder-[#5f5f5d] focus:outline-none transition-colors"
                />
              </div>

              {/* Format & Producer */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c] mb-2">
                    Formato de Lanzamiento
                  </label>
                  <select
                    value={albumType}
                    onChange={e => setAlbumType(e.target.value as Album['type'])}
                    className="w-full bg-[#fcfbf8] border border-[#eceae4] focus:border-indigo-500 rounded-[6px] px-3.5 py-2.5 text-xs text-[#1c1c1c] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="album">Álbum de Estudio (LP - min 6 temas)</option>
                    <option value="ep">EP (Extended Play - min 4 temas)</option>
                    <option value="mixtape">Mixtape Callejera (min 6 temas)</option>
                    <option value="deluxe">Edición Deluxe (min 10 temas)</option>
                    <option value="collab_album">Álbum Colaborativo (min 6 temas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c] mb-2">
                    Productor Ejecutivo
                  </label>
                  <select
                    value={albumProducer}
                    onChange={e => setAlbumProducer(e.target.value)}
                    className="w-full bg-[#fcfbf8] border border-[#eceae4] focus:border-indigo-500 rounded-[6px] px-3.5 py-2.5 text-xs text-[#1c1c1c] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Autoproducido ($0)</option>
                    {(Object.values(world.producers) as Producer[]).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (+{p.qualityBoost}% Calidad)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sub-style Selection for Album */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c] mb-2">
                  Sonoridad Conceptual de la Era ({styleDerivation.primaryGenreName})
                </label>
                <select
                  value={selectedAlbumSubgenreId}
                  onChange={e => setSelectedAlbumSubgenreId(e.target.value)}
                  className="w-full bg-[#fcfbf8] border border-[#eceae4] focus:border-indigo-500 rounded-[6px] px-3.5 py-2.5 text-xs text-[#1c1c1c] focus:outline-none transition-colors cursor-pointer"
                >
                  {styleDerivation.availableStyles
                    .filter(s => s.isUnlocked)
                    .map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.aestheticTone}
                      </option>
                    ))}
                </select>
              </div>

              {/* Previous Singles Inclusion Section */}
              <div className="bg-[#fcfbf8] p-4 rounded-xl border border-[#eceae4] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c]">
                    Incluir Singles Previos ({includedSingleIds.length} Seleccionados)
                  </label>
                  <span className="text-[11px] text-[#5f5f5d]">
                    Aportan streams y ventas iniciales
                  </span>
                </div>

                {availablePreviousSingles.length === 0 ? (
                  <p className="text-xs text-[#5f5f5d] italic">
                    No tienes sencillos independientes disponibles para agregar a este disco.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {availablePreviousSingles.map(single => {
                      const isChecked = includedSingleIds.includes(single.id);
                      return (
                        <div
                          key={single.id}
                          onClick={() => toggleSingleInclusion(single.id)}
                          className={`p-2.5 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-[#fcfbf8] border-purple-700 shadow-xs'
                              : 'bg-[#f7f4ed] hover:bg-purple-50/50 border-[#eceae4] text-[#1c1c1c]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-[#fcfbf8]" />
                            ) : (
                              <Square className="w-4 h-4 text-[#5f5f5d]" />
                            )}
                            <span className="font-semibold">{single.title}</span>
                          </div>
                          <span className={`text-[11px] font-mono ${isChecked ? 'text-[#fcfbf8]/85' : 'text-[#5f5f5d]'}`}>
                            {(single.streamsTotal / 1000).toFixed(0)}k streams
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Tracklist Builder & Budgets */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1c1c]">
                    Tracklist Inédito ({totalAlbumTracksCount} / min {minTracksRequired} canciones)
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewTrackTitles([...newTrackTitles, `Pista ${newTrackTitles.length + 1}`])}
                    className="text-xs font-semibold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Pista
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {/* Display Included Singles First */}
                  {includedSingleIds.map((sId, i) => {
                    const single = playerSongs.find(s => s.id === sId);
                    return (
                      <div key={sId} className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-[6px] border border-purple-200 text-xs">
                        <span className="font-mono text-xs text-purple-700 w-6 font-bold">{i + 1}.</span>
                        <span className="font-semibold text-purple-950 flex-1">{single?.title || sId}</span>
                        <span className="text-[10px] uppercase font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                          Single Previo
                        </span>
                      </div>
                    );
                  })}

                  {/* Display New Editable Tracks */}
                  {newTrackTitles.map((track, i) => {
                    const trackNumber = includedSingleIds.length + i + 1;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#5f5f5d] w-6 text-right">{trackNumber}.</span>
                        <input
                          type="text"
                          value={track}
                          onChange={e => {
                            const copy = [...newTrackTitles];
                            copy[i] = e.target.value;
                            setNewTrackTitles(copy);
                          }}
                          className="flex-1 bg-[#fcfbf8] border border-[#eceae4] focus:border-indigo-500 rounded-[6px] px-3 py-1.5 text-xs text-[#1c1c1c] focus:outline-none"
                        />
                        {newTrackTitles.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setNewTrackTitles(newTrackTitles.filter((_, idx) => idx !== i))}
                            className="p-1.5 text-[#5f5f5d] hover:text-rose-600 cursor-pointer"
                            title="Eliminar Pista"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budgets */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#fcfbf8] p-4 rounded-xl border border-amber-200 space-y-1">
                  <span className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Producción & Mastering
                  </span>
                  <div className="text-sm font-bold font-mono text-amber-800 mb-2">
                    ${albumProdBudget.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="60000"
                    step="1000"
                    value={albumProdBudget}
                    onChange={e => setAlbumProdBudget(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>

                <div className="bg-[#fcfbf8] p-4 rounded-xl border border-fuchsia-200 space-y-1">
                  <span className="block text-[11px] font-semibold text-fuchsia-900 mb-1">
                    Campaña Global de Lanzamiento
                  </span>
                  <div className="text-sm font-bold font-mono text-fuchsia-800 mb-2">
                    ${albumMktBudget.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="60000"
                    step="1000"
                    value={albumMktBudget}
                    onChange={e => setAlbumMktBudget(Number(e.target.value))}
                    className="w-full accent-fuchsia-600"
                  />
                </div>
              </div>

              {/* Impact Forecast Box */}
              <div className="bg-gradient-to-br from-[#fcfbf8] to-indigo-50/30 p-4 rounded-xl border border-[#eceae4] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#5f5f5d]">
                  <span>Costo Total del Proyecto:</span>
                  <span className="font-bold font-mono text-indigo-900 text-sm">
                    ${(albumProdBudget + albumMktBudget + (albumProducer ? (world.producers[albumProducer]?.costPerTrack || 0) * 2 : 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#5f5f5d]">
                  <span>Consumo de Energía:</span>
                  <span className="font-semibold text-rose-700">-35% Energía</span>
                </div>
                <div className="flex items-center justify-between text-[#5f5f5d]">
                  <span>Estimación Crítica:</span>
                  <span className="font-semibold text-purple-700">Metacritic / Pitchfork Review</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#eceae4]">
            <button
              type="submit"
              disabled={totalAlbumTracksCount < minTracksRequired}
              className={`px-6 py-2.5 rounded-[6px] text-sm font-semibold transition-all flex items-center gap-2 ${
                totalAlbumTracksCount < minTracksRequired
                  ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-60'
                  : 'bg-[#1c1c1c] text-[#fcfbf8] shadow-sm hover:opacity-90 active:opacity-80 cursor-pointer'
              }`}
              style={{
                boxShadow:
                  'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
              }}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Publicar Proyecto Completo</span>
            </button>
          </div>
        </form>
      )}

      {/* --- TAB 3: DISCOGRAPHY & CATALOG VIEWER --- */}
      {activeTab === 'catalog' && (
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#eceae4] pb-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c] flex items-center gap-2">
                <Music2 className="w-5 h-5 text-purple-600" />
                Discografía & Catálogo Oficial
              </h2>
              <p className="text-xs text-[#5f5f5d] mt-1">
                Registro histórico de todas tus obras, ventas y valoraciones críticas.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#eceae4]/60 rounded-[8px] border border-[#eceae4] text-xs font-semibold">
              <button
                onClick={() => setCatalogFilter('all')}
                className={`px-3 py-1.5 rounded-[6px] transition-all cursor-pointer ${
                  catalogFilter === 'all'
                    ? 'bg-[#1c1c1c] text-[#fcfbf8]'
                    : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
                }`}
              >
                Todos ({playerSongs.length + playerAlbums.length})
              </button>
              <button
                onClick={() => setCatalogFilter('albums')}
                className={`px-3 py-1.5 rounded-[6px] transition-all cursor-pointer ${
                  catalogFilter === 'albums'
                    ? 'bg-[#1c1c1c] text-[#fcfbf8]'
                    : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
                }`}
              >
                Álbumes ({playerAlbums.length})
              </button>
              <button
                onClick={() => setCatalogFilter('singles')}
                className={`px-3 py-1.5 rounded-[6px] transition-all cursor-pointer ${
                  catalogFilter === 'singles'
                    ? 'bg-[#1c1c1c] text-[#fcfbf8]'
                    : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
                }`}
              >
                Singles ({playerSongs.length})
              </button>
            </div>
          </div>

          {/* ALBUMS SECTION */}
          {(catalogFilter === 'all' || catalogFilter === 'albums') && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5f5f5d] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Álbumes & Proyectos de Larga Duración
              </h3>

              {playerAlbums.length === 0 ? (
                <p className="text-xs text-[#5f5f5d] italic py-2">
                  No has publicado ningún álbum hasta el momento.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playerAlbums.map((album, aIdx) => {
                    const albumTheme = getGenreTheme(album.genreId);
                    const coverGrad = album.coverGradient || ARTISTIC_COVER_GRADIENTS[aIdx % ARTISTIC_COVER_GRADIENTS.length];
                    return (
                      <div
                        key={album.id}
                        className="bg-[#fcfbf8] border border-[#eceae4] rounded-xl p-5 space-y-4 shadow-sm hover:border-[#1c1c1c]/30 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-20 h-20 rounded-[10px] bg-gradient-to-br ${coverGrad} shrink-0 border-2 border-white shadow-md flex items-end p-2 text-white text-[9px] font-bold uppercase`}
                          >
                            {album.type}
                          </div>

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase ${albumTheme.badgeBg} ${albumTheme.badgeText}`}>
                                {world.genres[album.genreId]?.name || album.genreId}
                              </span>
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#1c1c1c] text-[#fcfbf8] uppercase">
                                {album.type}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-[#1c1c1c] tracking-tight truncate pt-0.5">
                              {album.title}
                            </h4>
                            <p className="text-xs text-[#5f5f5d]">
                              Lanzado en {album.releaseYear} • {album.songIds.length} Pistas
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] uppercase font-semibold text-[#5f5f5d] block">
                              1ª Semana
                            </span>
                            <span className="font-mono font-bold text-sm text-purple-900">
                              {album.firstWeekSales.toLocaleString()} u.
                            </span>
                          </div>
                        </div>

                        {/* Metacritic Review Box */}
                        <div className="bg-[#f7f4ed] border border-[#eceae4] p-3 rounded-lg space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#1c1c1c] flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-amber-600" />
                              Puntaje Crítico:
                            </span>
                            <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${getScoreColor(album.criticalScore)}`}>
                              {album.criticalScore}/100
                            </span>
                          </div>
                          {album.criticalReviewText && (
                            <p className="text-[11px] text-[#5f5f5d] italic leading-relaxed pt-1">
                              "{album.criticalReviewText}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SINGLES SECTION */}
          {(catalogFilter === 'all' || catalogFilter === 'singles') && (
            <div className="space-y-4 pt-4 border-t border-[#eceae4]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5f5f5d] flex items-center gap-1.5">
                <Disc3 className="w-4 h-4 text-purple-600" />
                Sencillos & Pistas Individuales
              </h3>

              {playerSongs.length === 0 ? (
                <p className="text-xs text-[#5f5f5d] italic py-2">
                  No tienes canciones grabadas aún.
                </p>
              ) : (
                <div className="space-y-3">
                  {playerSongs.map(song => {
                    const subgenre = song.subGenreIds && song.subGenreIds.length > 0 ? SUBGENRE_DETAILS[song.subGenreIds[0]] : undefined;
                    const songGenreTheme = getGenreTheme(song.genreId);
                    const isHit = (song.peakPosition?.Global ?? 99) <= 10;

                    return (
                      <div
                        key={song.id}
                        className="bg-[#fcfbf8] border border-[#eceae4] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:border-[#1c1c1c]/30 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-[#1c1c1c]">
                              {song.title}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${songGenreTheme.badgeBg} ${songGenreTheme.badgeText}`}>
                              {world.genres[song.genreId]?.name || song.genreId}
                            </span>
                            {subgenre && (
                              <span className="text-[10px] font-medium bg-[#eceae4] text-[#1c1c1c] px-2 py-0.5 rounded-full">
                                {subgenre.name}
                              </span>
                            )}
                            {song.wentViral && (
                              <span className={RELEASE_BADGES.viral}>
                                Viral Hit
                              </span>
                            )}
                            {isHit && (
                              <span className={RELEASE_BADGES.hitTop10}>
                                Hit Top 10
                              </span>
                            )}
                            {song.isClassic && (
                              <span className={RELEASE_BADGES.classic}>
                                Clásico
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#5f5f5d]">
                            Lanzado: {song.releaseYear} • Calidad: <strong className="text-emerald-700">{song.quality}%</strong> • Comercial: <strong className="text-purple-700">{song.commercialAppeal}%</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-6 text-xs font-mono">
                          <div>
                            <span className="text-[#5f5f5d] block text-[10px] uppercase">Peak Global</span>
                            <span className={`font-bold text-sm ${song.peakPosition.Global === 1 ? 'text-amber-600 font-extrabold' : song.peakPosition.Global && song.peakPosition.Global <= 10 ? 'text-purple-700' : 'text-[#1c1c1c]'}`}>
                              {song.peakPosition.Global ? `#${song.peakPosition.Global}` : '—'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#5f5f5d] block text-[10px] uppercase">Streams / Mes</span>
                            <span className="font-bold text-sm text-purple-800">
                              {song.streamsLastMonth.toLocaleString()}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#5f5f5d] block text-[10px] uppercase">Total Acumulado</span>
                            <span className="font-bold text-sm text-indigo-800">
                              {(song.streamsTotal / 1000000).toFixed(2)}M
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
