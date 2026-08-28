import React, { useState, useEffect, useMemo } from 'react';
import {
  Artist,
  WorldState,
  Song,
  Album,
  ReleaseType,
  LongevityCurve,
  Producer,
  MusicVideoConcept,
  MusicVideoDirectorTier,
  CareerStage,
  ReleaseConfirmationData
} from '../types';
import { ReleaseConfirmationModal } from './ReleaseConfirmationModal';
import { getArtistDerivedStyles, SUBGENRE_DETAILS } from '../data/genres';
import { GameEngine } from '../core/GameEngine';
import { IndustryEngine } from '../systems/IndustryEngine';
import {
  Disc3,
  Sparkles,
  Users,
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
  Square,
  Video,
  Clapperboard,
  Film,
  Tv,
  Box,
  Camera,
  Eye,
  Crown,
  Zap,
  Play
} from 'lucide-react';
import {
  getGenreTheme,
  getGenreBadgeClass,
  RELEASE_BADGES,
  ARTISTIC_COVER_GRADIENTS
} from '../utils/themeColors';
import { playSound } from '../utils/audioSystem';
import { formatMoney, cleanCountTag, cleanQuotes, formatCompactNumber } from '../utils/formatters';

export interface VideoConceptOption {
  id: MusicVideoConcept;
  name: string;
  tag: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  borderHover: string;
}

export const VIDEO_CONCEPTS: VideoConceptOption[] = [
  {
    id: 'Cine 4K Cinematográfico',
    name: 'Cine 4K Cinematográfico',
    tag: '4K Anamórfico',
    description: 'Planos secuencia cinematográficos, iluminación con lentes anamórficas de 35mm, narrativa dramática y etalonaje de película de autor.',
    icon: Clapperboard,
    gradient: 'from-cyan-500/20 to-blue-600/20',
    borderHover: 'hover:border-cyan-400/50'
  },
  {
    id: 'VHS Retro Synthwave',
    name: 'VHS Retro Synthwave',
    tag: 'Textura Analógica 80s',
    description: 'Luces de neón magenta y cian, escaneo analógico en cinta VHS, destellos de cromo y atmósfera de club nocturno retro.',
    icon: Tv,
    gradient: 'from-pink-500/20 to-purple-600/20',
    borderHover: 'hover:border-pink-400/50'
  },
  {
    id: 'Animación 3D Futurista',
    name: 'Animación 3D Futurista',
    tag: 'CGI Unreal Engine',
    description: 'Avatares 3D hiperrealistas, efectos visuales de partículas, escenografía cyberpunk distópica y estética de videojuego AAA.',
    icon: Box,
    gradient: 'from-violet-500/20 to-fuchsia-600/20',
    borderHover: 'hover:border-violet-400/50'
  },
  {
    id: 'Urbano Callejero DIY',
    name: 'Urbano Callejero DIY',
    tag: 'Guerrilla & Fisheye',
    description: 'Grabación en formato guerrilla urbana con lente Fisheye, tomas nocturnas con flash crudo y dinamismo skate/trap underground.',
    icon: Camera,
    gradient: 'from-amber-500/20 to-orange-600/20',
    borderHover: 'hover:border-amber-400/50'
  },
  {
    id: 'Psicodélico & Arte Conceptual',
    name: 'Psicodélico & Arte Conceptual',
    tag: 'Vanguardia & Surrealismo',
    description: 'Simbolismos oníricos, vestuarios de alta costura conceptual, distorsiones visuales hipnóticas y dirección artística de galería moderna.',
    icon: Eye,
    gradient: 'from-emerald-500/20 to-teal-600/20',
    borderHover: 'hover:border-emerald-400/50'
  }
];

export interface DirectorTierOption {
  id: MusicVideoDirectorTier;
  name: string;
  tag: string;
  cost: number;
  description: string;
  hypeBoost: number;
  velocityBoost: number;
  viralBoost: number;
  estimatedViews: string;
  icon: React.ElementType;
}

export const DIRECTOR_TIERS: DirectorTierOption[] = [
  {
    id: 'Director Emergente',
    name: 'Director Emergente',
    tag: 'Indie / Guerrilla',
    cost: 1500,
    description: 'Joven realizador audiovisual con visión transgresora, equipo ligero y creatividad fresca.',
    hypeBoost: 10,
    velocityBoost: 15,
    viralBoost: 5,
    estimatedViews: '10k – 50k vistas',
    icon: Video
  },
  {
    id: 'Estudio Indie',
    name: 'Estudio Indie',
    tag: 'Productora Consolidada',
    cost: 5000,
    description: 'Productora audiovisual establecida con set de iluminación profesional, escenografía y casting.',
    hypeBoost: 25,
    velocityBoost: 35,
    viralBoost: 15,
    estimatedViews: '50k – 300k vistas',
    icon: Film
  },
  {
    id: 'Director de Élite Mundial',
    name: 'Director de Élite Mundial',
    tag: 'Nivel MTV VMAs / Hollywood',
    cost: 20000,
    description: 'Director galardonado internacionalmente con cámaras RED/ARRI, efectos especiales y distribución global masiva.',
    hypeBoost: 50,
    velocityBoost: 70,
    viralBoost: 35,
    estimatedViews: '500k – 5M+ vistas',
    icon: Crown
  }
];

export const CAREER_STAGE_RANK: Record<CareerStage, number> = {
  'Underground': 0,
  'Emerging': 1,
  'Declining': 1,
  'Breakout': 2,
  'Comeback': 2,
  'Established': 3,
  'Veteran': 3,
  'Mainstream': 4,
  'Superstar': 5,
  'Legend': 6,
  'Retired': 0
};

export interface ProducerLockInfo {
  isUnlocked: boolean;
  lockReason?: string;
  minPopularity: number;
  minCareerStage: CareerStage;
}

export const getProducerLockStatus = (
  producer: Producer,
  player: Artist
): ProducerLockInfo => {
  const check = IndustryEngine.canWorkWithProducer(player, producer);
  const minPop = producer.requirements?.minPopularity ?? 0;
  const minStage: CareerStage = minPop >= 70 ? 'Established' : minPop >= 35 ? 'Breakout' : 'Underground';

  return {
    isUnlocked: check.canWork,
    lockReason: check.missingReasons.join(' • '),
    minPopularity: minPop,
    minCareerStage: minStage
  };
};

interface StudioViewProps {
  player: Artist;
  world: WorldState;
  initialTab?: 'single' | 'album' | 'catalog';
  onTabChange?: (tab: 'single' | 'album' | 'catalog') => void;
  onOpenCollabModal?: (artistId?: string) => void;
  onReleaseSong: (params: {
    title: string;
    genreId: string;
    subGenreIds: string[];
    featuredArtistIds: string[];
    producerId?: string;
    budgetProduction: number;
    budgetMarketing: number;
    longevityCurve?: LongevityCurve;
    musicVideo?: {
      concept: string;
      budget: number;
      directorTier: string;
    };
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
  initialTab,
  onTabChange,
  onOpenCollabModal,
  onReleaseSong,
  onReleaseAlbum
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'album' | 'catalog'>(initialTab || 'single');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'singles' | 'albums'>('all');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const currentEra = player?.eras && player.eras.length > 0 ? player.eras[player.eras.length - 1] : undefined;
  const styleDerivation = getArtistDerivedStyles(player, currentEra, world?.genres || {});
  const primaryGenreTheme = getGenreTheme(styleDerivation.primaryGenreId);

  // Available scene artists for features
  const sceneArtists = useMemo(() => {
    return (Object.values(world?.artists || {}) as Artist[]).filter(
      a => a.id !== player?.id && !a.isRetired
    );
  }, [world?.artists, player?.id]);

  // Singles released this year
  const MAX_SINGLES = GameEngine.MAX_SINGLES_PER_YEAR;
  const playerSongs = (Object.values(world?.songs || {}) as Song[]).filter(s => s.artistId === player?.id);
  const singlesThisYear = playerSongs.filter(s => s.releaseYear === world?.currentYear && s.isSingle).length;
  const isSinglesLimitReached = singlesThisYear >= MAX_SINGLES;

  // Release confirmation and duplicate click prevention state
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [confirmedRelease, setConfirmedRelease] = useState<ReleaseConfirmationData | null>(null);

  // Single State
  const [singleTitle, setSingleTitle] = useState('');
  const [singleFeaturedArtist, setSingleFeaturedArtist] = useState<string>('');
  const [selectedSubgenreId, setSelectedSubgenreId] = useState<string>(
    styleDerivation.availableStyles[0]?.id || ''
  );
  const [singleProducer, setSingleProducer] = useState<string>('');
  const [singleProdBudget, setSingleProdBudget] = useState(0);
  const [singleMktBudget, setSingleMktBudget] = useState(0);

  // Music Video Production State
  const [hasMusicVideo, setHasMusicVideo] = useState(false);
  const [selectedVideoConcept, setSelectedVideoConcept] = useState<MusicVideoConcept>('Cine 4K Cinematográfico');
  const [selectedDirectorTier, setSelectedDirectorTier] = useState<MusicVideoDirectorTier>('Estudio Indie');

  const currentDirectorTier = DIRECTOR_TIERS.find(t => t.id === selectedDirectorTier) || DIRECTOR_TIERS[1];
  const videoCost = hasMusicVideo ? currentDirectorTier.cost : 0;
  const singleProdFee = singleProducer && world?.producers ? (world.producers[singleProducer]?.costPerTrack || 0) : 0;
  const totalSingleCost = singleProdBudget + singleMktBudget + singleProdFee + videoCost;
  const isFundsInsufficient = totalSingleCost > (player?.stats?.funds || 0);

  // Album State
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumFeaturedArtist, setAlbumFeaturedArtist] = useState<string>('');
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

  const albumProdFee = albumProducer ? (world.producers[albumProducer]?.costPerTrack || 0) * Math.min(newTrackTitles.filter(t => t.trim().length > 0).length, 6) : 0;
  const totalAlbumCost = albumProdBudget + albumMktBudget + albumProdFee;
  const isAlbumFundsInsufficient = totalAlbumCost > player.stats.funds;
  const isAlbumTracksInsufficient = totalAlbumTracksCount < minTracksRequired;
  const isAlbumEnergyInsufficient = player.stats.energy < 35;
  const isAlbumDisabled = isAlbumTracksInsufficient || isAlbumFundsInsufficient || isAlbumEnergyInsufficient;

  // Quick title suggestion
  const generateRandomTitle = (isAlbum: boolean): string => {
    const random = TITLE_SUGGESTIONS[Math.floor(Math.random() * TITLE_SUGGESTIONS.length)];
    if (isAlbum) {
      setAlbumTitle(random);
    } else {
      setSingleTitle(random);
    }
    return random;
  };

  const toggleSingleInclusion = (id: string) => {
    if (includedSingleIds.includes(id)) {
      setIncludedSingleIds(includedSingleIds.filter(s => s !== id));
    } else {
      setIncludedSingleIds([...includedSingleIds, id]);
    }
  };

  // Close confirmation modal & clear form only now
  const handleCloseConfirmation = () => {
    if (confirmedRelease) {
      if (confirmedRelease.type === 'single') {
        setSingleTitle('');
        setSingleFeaturedArtist('');
        setHasMusicVideo(false);
        setSingleProdBudget(0);
        setSingleMktBudget(0);
        setSingleProducer('');
      } else {
        setAlbumTitle('');
        setAlbumFeaturedArtist('');
        setIncludedSingleIds([]);
        setAlbumProducer('');
        setNewTrackTitles([
          'Intro (Declaración)',
          'Fuego en las Calles',
          'Noches de Gloria',
          'Diamantes y Cicatrices',
          'Bajo las Luces del Neón',
          'Outro (El Legado)'
        ]);
      }
    }
    setConfirmedRelease(null);
    setActiveTab('catalog');
    onTabChange?.('catalog');
  };

  // Handlers
  const handleCreateSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublishing) return;
    let finalTitle = singleTitle.trim();
    if (!finalTitle) {
      finalTitle = generateRandomTitle(false);
    }

    if (isSinglesLimitReached) {
      alert(`Has alcanzado el límite anual de lanzamientos (${MAX_SINGLES} singles en ${world.currentYear}). Avanza al próximo año o graba un Álbum Completo.`);
      return;
    }

    if (totalSingleCost > player.stats.funds) {
      alert(`Fondos insuficientes. Necesitas $${totalSingleCost.toLocaleString()} y tienes $${player.stats.funds.toLocaleString()}`);
      return;
    }
    if (player.stats.energy < 15) {
      alert('Tu artista está demasiado agotado para grabar (energía menor a 15%). ¡Toma un respiro antes!');
      return;
    }

    if (singleProducer) {
      const prodObj = world.producers[singleProducer];
      if (prodObj) {
        const check = getProducerLockStatus(prodObj, player);
        if (!check.isUnlocked) {
          alert(`No cumples los requisitos para contratar a ${prodObj.name}: ${check.lockReason}`);
          return;
        }
      }
    }

    try {
      setIsPublishing(true);

      const prodObj = singleProducer ? world.producers[singleProducer] : undefined;
      const subObj = selectedSubgenreId ? SUBGENRE_DETAILS[selectedSubgenreId] : undefined;
      const featObj = singleFeaturedArtist ? world.artists[singleFeaturedArtist] : undefined;
      const genreName = world.genres[styleDerivation.primaryGenreId]?.name || styleDerivation.primaryGenreId;

      onReleaseSong({
        title: finalTitle,
        genreId: styleDerivation.primaryGenreId,
        subGenreIds: selectedSubgenreId ? [selectedSubgenreId] : [],
        featuredArtistIds: singleFeaturedArtist ? [singleFeaturedArtist] : [],
        producerId: singleProducer || undefined,
        budgetProduction: singleProdBudget,
        budgetMarketing: singleMktBudget,
        musicVideo: hasMusicVideo ? {
          concept: selectedVideoConcept,
          budget: videoCost,
          directorTier: selectedDirectorTier
        } : undefined
      });

      const releaseData: ReleaseConfirmationData = {
        type: 'single',
        title: finalTitle,
        coverGradient: ARTISTIC_COVER_GRADIENTS[Math.floor(Math.random() * ARTISTIC_COVER_GRADIENTS.length)],
        songCount: 1,
        trackTitles: [finalTitle],
        genreId: styleDerivation.primaryGenreId,
        genreName,
        subGenreId: selectedSubgenreId || undefined,
        subGenreName: subObj?.name || undefined,
        featuredArtistNames: featObj ? [featObj.name] : undefined,
        producerName: prodObj?.name || undefined,
        musicVideo: hasMusicVideo ? {
          concept: selectedVideoConcept,
          budget: videoCost,
          directorTier: selectedDirectorTier
        } : undefined,
        releaseYear: world.currentYear,
        releaseMonth: world.currentMonth,
        totalBudget: totalSingleCost,
        budgetBreakdown: {
          production: singleProdBudget,
          marketing: singleMktBudget,
          producerFee: singleProdFee,
          videoCost: videoCost
        }
      };

      playSound('release');
      setConfirmedRelease(releaseData);
      setNotification(
        hasMusicVideo
          ? `¡El single "${finalTitle}" y su Videoclip Oficial (${selectedVideoConcept}) han sido estrenados mundialmente!`
          : `¡El single "${finalTitle}" ha sido lanzado al mercado mundial!`
      );
      setTimeout(() => setNotification(null), 5000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error al procesar el lanzamiento del single.';
      alert(`Error en el lanzamiento: ${errMsg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublishing) return;
    let finalTitle = albumTitle.trim();
    if (!finalTitle) {
      finalTitle = generateRandomTitle(true);
    }

    if (totalAlbumTracksCount < minTracksRequired) {
      alert(`Un proyecto en formato ${albumType.toUpperCase()} requiere al menos ${minTracksRequired} canciones. Tienes ${totalAlbumTracksCount}.`);
      return;
    }

    if (albumProducer) {
      const prodObj = world.producers[albumProducer];
      if (prodObj) {
        const check = getProducerLockStatus(prodObj, player);
        if (!check.isUnlocked) {
          alert(`No cumples los requisitos para contratar a ${prodObj.name}: ${check.lockReason}`);
          return;
        }
      }
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

    try {
      setIsPublishing(true);

      const prodObj = albumProducer ? world.producers[albumProducer] : undefined;
      const subObj = selectedAlbumSubgenreId ? SUBGENRE_DETAILS[selectedAlbumSubgenreId] : undefined;
      const genreName = world.genres[styleDerivation.primaryGenreId]?.name || styleDerivation.primaryGenreId;

      const validNewTracks = newTrackTitles.filter(t => t.trim().length > 0);
      const includedSingles = includedSingleIds.map(id => playerSongs.find(s => s.id === id)?.title || id);
      const allTrackTitles = [...includedSingles, ...validNewTracks];

      onReleaseAlbum({
        title: finalTitle,
        type: albumType,
        genreId: styleDerivation.primaryGenreId,
        subGenreIds: selectedAlbumSubgenreId ? [selectedAlbumSubgenreId] : [],
        newTrackTitles: validNewTracks,
        includedSingleIds,
        budgetProduction: albumProdBudget,
        budgetMarketing: albumMktBudget,
        producerId: albumProducer || undefined
      });

      const featObj = albumFeaturedArtist ? world.artists[albumFeaturedArtist] : undefined;

      const releaseData: ReleaseConfirmationData = {
        type: albumType,
        title: finalTitle,
        coverGradient: ARTISTIC_COVER_GRADIENTS[Math.floor(Math.random() * ARTISTIC_COVER_GRADIENTS.length)],
        songCount: allTrackTitles.length,
        trackTitles: allTrackTitles,
        genreId: styleDerivation.primaryGenreId,
        genreName,
        subGenreId: selectedAlbumSubgenreId || undefined,
        subGenreName: subObj?.name || undefined,
        featuredArtistNames: featObj ? [featObj.name] : undefined,
        producerName: prodObj?.name || undefined,
        releaseYear: world.currentYear,
        releaseMonth: world.currentMonth,
        totalBudget: totalCost,
        budgetBreakdown: {
          production: albumProdBudget,
          marketing: albumMktBudget,
          producerFee: prodFee,
          videoCost: 0
        }
      };

      playSound('release');
      setConfirmedRelease(releaseData);
      setNotification(`¡El proyecto "${finalTitle}" ha sido publicado en todas las plataformas con gran repercusión crítica!`);
      setTimeout(() => setNotification(null), 6000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error al procesar el lanzamiento del álbum.';
      alert(`Error en el lanzamiento: ${errMsg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40';
    if (score >= 70) return 'bg-amber-950/60 text-amber-400 border-amber-500/40';
    return 'bg-rose-950/60 text-rose-400 border-rose-500/40';
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-[#F8FAFC]">
      {/* --- HEADER: STUDIO AFTER DARK HERO CARD --- */}
      <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/40">
              Estudio Creativo & Producción
            </span>
            <span className="text-xs text-[#94A3B8]">
              Año {world.currentYear} • Mes {world.currentMonth}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#F8FAFC]">
            Estudio de Grabación & Composición
          </h1>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Graba sencillos promocionales, compone álbumes conceptuales que definan tu Era y configura tus presupuestos de producción y marketing.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0B0C10] rounded-[8px] border border-[#2A2E3D] text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('single');
              onTabChange?.('single');
            }}
            className={`px-3.5 py-2 rounded-[6px] transition-all cursor-pointer ${
              activeTab === 'single'
                ? 'bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-transparent'
            }`}
          >
            Lanzar Single
          </button>
          <button
            onClick={() => {
              setActiveTab('album');
              onTabChange?.('album');
            }}
            className={`px-3.5 py-2 rounded-[6px] transition-all cursor-pointer ${
              activeTab === 'album'
                ? 'bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-transparent'
            }`}
          >
            Grabar Álbum / EP
          </button>
          <button
            onClick={() => {
              setActiveTab('catalog');
              onTabChange?.('catalog');
            }}
            className={`px-3.5 py-2 rounded-[6px] transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-transparent'
            }`}
          >
            Catálogo ({playerSongs.length})
          </button>
        </div>
      </div>

      {/* --- NOTIFICATION TOAST --- */}
      {notification && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* --- SONIC IDENTITY & CURRENT ERA BAR --- */}
      <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2A2E3D] pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-tr ${primaryGenreTheme.gradient} text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.4)]`}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
                Era Artística Activa
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-[#F8FAFC]">
                {currentEra ? currentEra.name : 'Los Primeros Pasos'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C084FC]">
              Género Anclado: {styleDerivation.primaryGenreName}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[#2A2E3D] bg-[#0B0C10] text-[#94A3B8]">
              {player.careerStage}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          <Info className="w-3.5 h-3.5 inline mr-1 text-[#8B5CF6]" />
          Tu dirección sonora está gobernada por tu Era actual y los atributos de tu artista. Los sub-estilos se desbloquean a medida que desarrollas tu Creatividad, Habilidad, Originalidad y Tolerancia al Riesgo.
        </p>
      </div>

      {/* --- TAB 1: SINGLE CREATION --- */}
      {activeTab === 'single' && (
        <form onSubmit={handleCreateSingle} className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2A2E3D] pb-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#F8FAFC] flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#8B5CF6]" />
                Componer Nuevo Single
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Lanza un sencillo promocional para impactar en playlists y radios.
              </p>
            </div>

            {/* Annual Singles Limit Badge */}
            <div className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              isSinglesLimitReached
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                : 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#C084FC]'
            }`}>
              <Calendar className={`w-4 h-4 ${isSinglesLimitReached ? 'text-rose-400' : 'text-[#8B5CF6]'}`} />
              <span>Cupo Anual de Singles:</span>
              <strong className="font-mono">{singlesThisYear} / {MAX_SINGLES}</strong>
              <span className="text-[10px] text-[#94A3B8] font-normal hidden sm:inline">(Reinicia en Semestre 1 de cada año)</span>
              {isSinglesLimitReached && <span className="text-[10px] text-rose-400 font-bold uppercase">(Tope alcanzado)</span>}
            </div>
          </div>

          {isSinglesLimitReached && (
            <div className="bg-amber-950/50 border border-amber-500/40 text-amber-200 p-4 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-sm text-amber-400">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Límite anual de singles alcanzado ({MAX_SINGLES}/{MAX_SINGLES})
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                Para mantener el realismo de la industria y no saturar a tus oyentes, el cupo de sencillos se reinicia cada nuevo año. Puedes avanzar de año con el botón superior, o grabar un <strong>Álbum / EP Completo</strong> en la pestaña contigua.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Title & Sonic Sub-style */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
                    Título de la Canción *
                  </label>
                  <button
                    type="button"
                    onClick={() => generateRandomTitle(false)}
                    className="text-xs text-[#C084FC] hover:text-[#E879F9] underline font-semibold cursor-pointer transition-colors"
                  >
                    Sugerir Título
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ej: Medianoche en Tokio, Barrio Fino..."
                  value={singleTitle}
                  onChange={e => setSingleTitle(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                />
              </div>

              {/* Sub-style Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-2">
                  Dirección Sónica de la Era ({styleDerivation.primaryGenreName?.trim() || ''})
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
                            ? 'opacity-40 bg-[#0B0C10]/60 border-[#2A2E3D] cursor-not-allowed'
                            : isSelected
                            ? `bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.35)] cursor-pointer`
                            : `bg-[#0B0C10] hover:bg-white/[0.04] border-[#2A2E3D] hover:border-[#8B5CF6]/40 text-[#F8FAFC] cursor-pointer`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#F8FAFC]'}`}>
                            {style.name}
                          </span>
                          {style.isUnlocked ? (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
                            }`}>
                              Desbloqueado
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> {style.lockReason}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] mt-1 leading-snug ${isSelected ? 'text-white/90' : 'text-[#94A3B8]'}`}>
                          {style.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Featured Artist Selector & Collab Hub Shortcut */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Artista Invitado (Feat)
                  </label>
                  {onOpenCollabModal && (
                    <button
                      type="button"
                      onClick={() => onOpenCollabModal(singleFeaturedArtist || undefined)}
                      className="text-[11px] text-[#C084FC] hover:text-[#E879F9] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Abrir el panel interactivo completo de colaboraciones"
                    >
                      <Sparkles className="w-3 h-3" />
                      Estudio de Colaboración Avanzada
                    </button>
                  )}
                </div>
                <select
                  value={singleFeaturedArtist}
                  onChange={e => setSingleFeaturedArtist(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">Sin artista invitado (Solista)</option>
                  {sceneArtists.map(artist => {
                    const rel = player.relationships[artist.id];
                    const affinityText = rel?.affinity !== undefined ? (rel.affinity > 0 ? `+${rel.affinity}` : `${rel.affinity}`) : '0';
                    return (
                      <option key={artist.id} value={artist.id} className="bg-[#0B0C10] text-[#F8FAFC]">
                        ft. {artist.name} ({world.genres[artist.mainGenreId]?.name || artist.mainGenreId} • {formatCompactNumber(artist.stats.monthlyListeners)} • Afinidad: {affinityText})
                      </option>
                    );
                  })}
                </select>
                {singleFeaturedArtist && world.artists[singleFeaturedArtist] && (
                  <div className="mt-2 p-2.5 rounded-lg bg-[#0B0C10] border border-[#8B5CF6]/30 flex items-center justify-between text-[11px]">
                    <span className="text-[#94A3B8]">
                      Afinidad con <strong className="text-[#F8FAFC]">{world.artists[singleFeaturedArtist].name}</strong>:
                    </span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {(player.relationships[singleFeaturedArtist]?.affinity || 0) > 0 ? `+${player.relationships[singleFeaturedArtist]?.affinity}` : player.relationships[singleFeaturedArtist]?.affinity || 0} Afinidad • {player.relationships[singleFeaturedArtist]?.respect || 50}% Respeto
                    </span>
                  </div>
                )}
              </div>

              {/* Producer */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-2">
                  Productor Musical / Beatmaker
                </label>
                <select
                  value={singleProducer}
                  onChange={e => setSingleProducer(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">Autoproducción en Home Studio ($0)</option>
                  {(Object.values(world.producers) as Producer[]).map(p => {
                    const lockInfo = getProducerLockStatus(p, player);
                    return (
                      <option key={p.id} value={p.id} disabled={!lockInfo.isUnlocked} className="bg-[#0B0C10] text-[#F8FAFC]">
                        {lockInfo.isUnlocked ? '' : '🔒 '}{p.name} (+{p.qualityBoost}% Calidad) — ${p.costPerTrack.toLocaleString()} {!lockInfo.isUnlocked ? `[Bloqueado: ${lockInfo.lockReason}]` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Right Column: Budgets, Organic Performance & Launch Preview */}
            <div className="space-y-5">
              {/* Proyección Orgánica */}
              <div className="bg-[#0B0C10] p-4 rounded-xl border border-[#2A2E3D] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                    Proyección de Rendimiento & Streaming
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/30 px-2 py-0.5 rounded-full">
                    Motor Orgánico
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-snug">
                  La curva de éxito, viralidad y longevidad en listas se calculará automáticamente según tu calidad de producción, inversión promocional, originalidad y creatividad artística ({player.personality.creativity}/100).
                </p>
              </div>

              {/* Budgets Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full min-w-0">
                <div className="bg-[#0B0C10] p-4 rounded-xl border border-[#2A2E3D] space-y-2 w-full min-w-0 flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="block text-[11px] font-semibold text-[#F59E0B]">
                      Producción & Mezcla
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      Máx: $25.000
                    </span>
                  </div>
                  <div className="text-xs font-bold font-mono text-[#F59E0B]">
                    {singleProdBudget === 0 ? '$0 (Home Studio)' : `$${singleProdBudget.toLocaleString('es-AR')}`}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="range"
                      min="0"
                      max="25000"
                      step="250"
                      value={singleProdBudget}
                      onChange={e => setSingleProdBudget(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer border border-[#3E4556] accent-[#F59E0B] focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-mono px-0.5">
                      <span>$0</span>
                      <span>$12.500</span>
                      <span>$25.000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B0C10] p-4 rounded-xl border border-[#2A2E3D] space-y-2 w-full min-w-0 flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="block text-[11px] font-semibold text-emerald-400">
                      Marketing & Campaña
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      Máx: $25.000
                    </span>
                  </div>
                  <div className="text-xs font-bold font-mono text-emerald-400">
                    {singleMktBudget === 0 ? '$0 (Difusión Orgánica)' : `$${singleMktBudget.toLocaleString('es-AR')}`}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="range"
                      min="0"
                      max="25000"
                      step="250"
                      value={singleMktBudget}
                      onChange={e => setSingleMktBudget(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer border border-[#3E4556] accent-emerald-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-mono px-0.5">
                      <span>$0</span>
                      <span>$12.500</span>
                      <span>$25.000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost & Summary Card */}
              <div className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${
                isFundsInsufficient
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                  : 'bg-[#0B0C10] border-[#2A2E3D]'
              }`}>
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>Producción & Marketing:</span>
                  <span className="font-mono text-[#F8FAFC]">
                    {singleProdBudget === 0 && singleMktBudget === 0
                      ? '$0 (Home Studio / Difusión Orgánica)'
                      : `$${(singleProdBudget + singleMktBudget).toLocaleString()}`}
                  </span>
                </div>
                {singleProducer && (
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Productor ({world.producers[singleProducer]?.name}):</span>
                    <span className="font-mono text-[#F8FAFC]">
                      +${singleProdFee.toLocaleString()}
                    </span>
                  </div>
                )}
                {hasMusicVideo && (
                  <div className="flex items-center justify-between text-[#38BDF8]">
                    <span>Videoclip ({selectedDirectorTier}):</span>
                    <span className="font-bold font-mono">
                      +${videoCost.toLocaleString()}
                    </span>
                  </div>
                )}
                {/* Costo Total Resaltado */}
                <div className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  isFundsInsufficient
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    : 'bg-[#16181F] border-[#2A2E3D] text-[#F8FAFC]'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isFundsInsufficient ? 'text-rose-300 font-bold' : 'text-[#F8FAFC]'}`}>
                      Costo Total del Sencillo:
                    </span>
                    {isFundsInsufficient && (
                      <span className="text-[10px] uppercase font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full">
                        Excede Fondos
                      </span>
                    )}
                  </div>
                  <span className={`font-bold font-mono text-sm ${isFundsInsufficient ? 'text-rose-400 font-extrabold text-base' : 'text-[#C084FC]'}`}>
                    ${totalSingleCost.toLocaleString('es-AR')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>Consumo de Energía:</span>
                  <span className="font-semibold text-rose-400">-15% Energía</span>
                </div>
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>Fondos Disponibles:</span>
                  <span className={`font-bold font-mono ${!isFundsInsufficient ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                    ${player.stats.funds.toLocaleString('es-AR')}
                  </span>
                </div>

                {isFundsInsufficient && (
                  <div className="pt-2 border-t border-rose-500/30 flex items-start gap-2 text-rose-300 text-[11px] leading-snug">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-rose-400">Fondos Insuficientes: Te faltan ${(totalSingleCost - player.stats.funds).toLocaleString('es-AR')}</strong>
                      Ajusta los sliders de producción/marketing a $0 (Home Studio) o prescinde del videoclip/productor externo.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- MUSIC VIDEO PRODUCTION SECTION (RODAJE DE VIDEOCLIPS) --- */}
          <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-2xl p-5 sm:p-6 space-y-5 transition-all shadow-inner">
            {/* Header with Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2A2E3D] pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border transition-all ${
                  hasMusicVideo
                    ? 'bg-gradient-to-tr from-[#06B6D4]/30 to-[#8B5CF6]/30 text-[#38BDF8] border-[#06B6D4]/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-[#16181F] text-[#94A3B8] border-[#2A2E3D]'
                }`}>
                  <Clapperboard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-[#F8FAFC]">
                      Producción de Videoclip Oficial
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C084FC]">
                      Visual Lab
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Rueda una pieza audiovisual cinematográfica para disparar el Hype de tu Era, multiplicar el impacto Viral y acelerar el debut en streaming.
                  </p>
                </div>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setHasMusicVideo(!hasMusicVideo)}
                className={`px-4 py-2 rounded-[6px] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  hasMusicVideo
                    ? 'bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-[#16181F] hover:bg-white/[0.06] text-[#CBD5E1] border border-[#2A2E3D]'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>{hasMusicVideo ? '✓ Videoclip Activado' : '+ Rodar Videoclip Oficial'}</span>
              </button>
            </div>

            {hasMusicVideo ? (
              <div className="space-y-6 pt-1">
                {/* 1. CONCEPT & AESTHETICS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                      1. Concepto & Estética Visual
                    </label>
                    <span className="text-[11px] text-[#94A3B8]">
                      Seleccionado: <strong className="text-[#38BDF8]">{selectedVideoConcept}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {VIDEO_CONCEPTS.map(concept => {
                      const isSelected = selectedVideoConcept === concept.id;
                      const ConceptIcon = concept.icon;
                      return (
                        <div
                          key={concept.id}
                          onClick={() => setSelectedVideoConcept(concept.id)}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-br from-[#16181F] to-[#06B6D4]/15 border-[#06B6D4] shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-[#06B6D4]'
                              : `bg-[#16181F] border-[#2A2E3D] ${concept.borderHover} hover:bg-white/[0.02]`
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-[6px] ${isSelected ? 'bg-[#06B6D4]/20 text-[#38BDF8]' : 'bg-[#0B0C10] text-[#94A3B8]'}`}>
                                <ConceptIcon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-semibold text-[#F8FAFC]">{concept.name}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] border ${
                              isSelected ? 'bg-[#06B6D4]/20 border-[#06B6D4]/40 text-[#38BDF8]' : 'bg-[#0B0C10] border-[#2A2E3D] text-[#94A3B8]'
                            }`}>
                              {concept.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8] leading-snug">
                            {concept.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. DIRECTOR TIER & PRODUCTION BUDGET */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      2. Nivel de Dirección & Presupuesto Audiovisual
                    </label>
                    <span className="text-[11px] text-[#94A3B8]">
                      Tarifa: <strong className="text-emerald-400 font-mono">${currentDirectorTier.cost.toLocaleString()}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {DIRECTOR_TIERS.map(tier => {
                      const isSelected = selectedDirectorTier === tier.id;
                      const TierIcon = tier.icon;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedDirectorTier(tier.id)}
                          className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-br from-[#16181F] to-[#8B5CF6]/20 border-[#8B5CF6] shadow-[0_0_18px_rgba(139,92,246,0.3)] ring-1 ring-[#8B5CF6]'
                              : 'bg-[#16181F] border-[#2A2E3D] hover:border-[#8B5CF6]/40 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-[6px] ${isSelected ? 'bg-[#8B5CF6]/25 text-[#C084FC]' : 'bg-[#0B0C10] text-[#94A3B8]'}`}>
                                  <TierIcon className="w-4 h-4" />
                                </div>
                                <h4 className="text-xs font-bold text-[#F8FAFC]">{tier.name}</h4>
                              </div>
                              <span className="text-xs font-extrabold font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-[4px] border border-emerald-500/40">
                                ${tier.cost.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#94A3B8] font-semibold block">{tier.tag}</span>
                            <p className="text-[11px] text-[#94A3B8] leading-snug pt-1">
                              {tier.description}
                            </p>
                          </div>

                          <div className="space-y-1 pt-2 border-t border-[#2A2E3D] text-[10px] font-mono">
                            <div className="flex items-center justify-between text-[#94A3B8]">
                              <span>Hype Inmediato:</span>
                              <strong className="text-[#C084FC]">+{tier.hypeBoost}</strong>
                            </div>
                            <div className="flex items-center justify-between text-[#94A3B8]">
                              <span>Velocidad Streaming:</span>
                              <strong className="text-emerald-400">+{tier.velocityBoost}%</strong>
                            </div>
                            <div className="flex items-center justify-between text-[#94A3B8]">
                              <span>Probabilidad Viral:</span>
                              <strong className="text-pink-400">+{tier.viralBoost}%</strong>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. LIVE IMPACT PREVIEW PANEL */}
                <div className="bg-[#16181F] border border-[#06B6D4]/30 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8]">
                      <Zap className="w-4 h-4 text-[#06B6D4]" />
                      <span>Previsualización de Impacto del Videoclip</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      Estética: <strong className="text-[#F8FAFC]">{selectedVideoConcept}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
                    <div className="bg-[#0B0C10] p-2 rounded-lg border border-[#8B5CF6]/30">
                      <span className="text-[9px] text-[#C084FC] uppercase block font-bold">Hype Adicional</span>
                      <span className="text-xs sm:text-sm font-bold text-[#F8FAFC]">+{currentDirectorTier.hypeBoost} Hype</span>
                    </div>
                    <div className="bg-[#0B0C10] p-2 rounded-lg border border-emerald-500/30">
                      <span className="text-[9px] text-emerald-300 uppercase block font-bold">Velocidad Streaming</span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-400">+{currentDirectorTier.velocityBoost}% Inicio</span>
                    </div>
                    <div className="bg-[#0B0C10] p-2 rounded-lg border border-pink-500/30">
                      <span className="text-[9px] text-pink-300 uppercase block font-bold">Chance Viral</span>
                      <span className="text-xs sm:text-sm font-bold text-pink-400">+{currentDirectorTier.viralBoost}% Viral</span>
                    </div>
                    <div className="bg-[#0B0C10] p-2 rounded-lg border border-cyan-500/30">
                      <span className="text-[9px] text-cyan-300 uppercase block font-bold">Alcance Visual</span>
                      <span className="text-xs sm:text-sm font-bold text-[#38BDF8]">{currentDirectorTier.estimatedViews}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#16181F] rounded-xl border border-[#2A2E3D] flex items-center justify-between text-xs text-[#94A3B8]">
                <span className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Lanzamiento estándar en solo audio. No se descontarán costes de rodaje ni se generará contenido visual oficial.
                </span>
                <span className="font-mono text-[#94A3B8] font-semibold">$0 Adicional</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2A2E3D]">
            <div className="text-xs text-[#94A3B8]">
              {isFundsInsufficient ? (
                <span className="text-rose-400 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Fondos insuficientes para este presupuesto.
                </span>
              ) : isSinglesLimitReached ? (
                <span className="text-rose-400 flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5" /> Límite anual de singles alcanzado ({MAX_SINGLES}/{MAX_SINGLES}).
                </span>
              ) : player.stats.energy < 15 ? (
                <span className="text-amber-400 flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5" /> Artista agotado (requiere al menos 15% energía).
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Listo para grabación y lanzamiento.
                </span>
              )}
            </div>

            <button
              id="btn-submit-single"
              type="submit"
              disabled={isPublishing || isSinglesLimitReached || isFundsInsufficient || player.stats.energy < 15}
              title={
                isFundsInsufficient
                  ? `Fondos insuficientes ($${player.stats.funds.toLocaleString('es-AR')} / $${totalSingleCost.toLocaleString('es-AR')})`
                  : isSinglesLimitReached
                  ? `Cupo anual de singles alcanzado (${singlesThisYear}/${MAX_SINGLES})`
                  : player.stats.energy < 15
                  ? `Energía insuficiente (${player.stats.energy}% / 15% requerida)`
                  : 'Grabar y publicar sencillo'
              }
              className={`px-5 py-2.5 rounded-[6px] text-sm transition-all flex items-center gap-2 ${
                isPublishing || isSinglesLimitReached || isFundsInsufficient || player.stats.energy < 15
                  ? 'bg-[#16181F]/40 text-[#64748B] border border-[#2A2E3D]/40 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:opacity-90 cursor-pointer'
              }`}
            >
              <Disc3 className={`w-4 h-4 ${isFundsInsufficient ? 'text-[#64748B]' : 'text-white'} ${isPublishing ? 'animate-spin' : ''}`} />
              <span>
                {isPublishing
                  ? 'Publicando y Masterizando...'
                  : isFundsInsufficient
                  ? `Fondos Insuficientes ($${player.stats.funds.toLocaleString('es-AR')} / $${totalSingleCost.toLocaleString('es-AR')})`
                  : hasMusicVideo
                  ? 'Grabar Single & Estrenar Videoclip'
                  : 'Grabar & Publicar Single'}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* --- TAB 2: ALBUM & EP CREATION STUDIO --- */}
      {activeTab === 'album' && (
        <form onSubmit={handleCreateAlbum} className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
          <div className="border-b border-[#2A2E3D] pb-4">
            <h2 className="text-xl font-semibold tracking-tight text-[#F8FAFC] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8B5CF6]" />
              Estudio de Composición de Álbumes & Proyectos
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Crea una obra conceptual completa, incluye sencillos previos de tu Era y desafía las críticas de prensa especializada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Concept, Format & Previous Singles */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
                    Título del Álbum / Proyecto *
                  </label>
                  <button
                    type="button"
                    onClick={() => generateRandomTitle(true)}
                    className="text-xs text-[#C084FC] hover:text-[#E879F9] underline font-semibold cursor-pointer transition-colors"
                  >
                    Sugerir Título Conceptual
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ej: Crónicas de una Noche, Génesis..."
                  value={albumTitle}
                  onChange={e => setAlbumTitle(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                />
              </div>

              {/* Format & Producer */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-2">
                    Formato de Lanzamiento
                  </label>
                  <select
                    value={albumType}
                    onChange={e => setAlbumType(e.target.value as Album['type'])}
                    className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="album">Álbum de Estudio (LP - min 6 temas)</option>
                    <option value="ep">EP (Extended Play - min 4 temas)</option>
                    <option value="mixtape">Mixtape Callejera (min 6 temas)</option>
                    <option value="deluxe">Edición Deluxe (min 10 temas)</option>
                    <option value="collab_album">Álbum Colaborativo (min 6 temas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-2">
                    Productor Ejecutivo
                  </label>
                  <select
                    value={albumProducer}
                    onChange={e => setAlbumProducer(e.target.value)}
                    className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Autoproducido ($0)</option>
                    {(Object.values(world.producers) as Producer[]).map(p => {
                      const lockInfo = getProducerLockStatus(p, player);
                      return (
                        <option key={p.id} value={p.id} disabled={!lockInfo.isUnlocked} className="bg-[#0B0C10] text-[#F8FAFC]">
                          {lockInfo.isUnlocked ? '' : '🔒 '}{p.name} (+{p.qualityBoost}% Calidad) — ${p.costPerTrack.toLocaleString()}/track {!lockInfo.isUnlocked ? `[Bloqueado: ${lockInfo.lockReason}]` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Featured Artist Selector & Collab Hub Shortcut for Album */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Artista Invitado Principal (Feat)
                  </label>
                  {onOpenCollabModal && (
                    <button
                      type="button"
                      onClick={() => onOpenCollabModal(albumFeaturedArtist || undefined)}
                      className="text-[11px] text-[#C084FC] hover:text-[#E879F9] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Abrir el panel para crear un Álbum Colaborativo completo"
                    >
                      <Sparkles className="w-3 h-3" />
                      Álbum Colaborativo ("Oasis")
                    </button>
                  )}
                </div>
                <select
                  value={albumFeaturedArtist}
                  onChange={e => setAlbumFeaturedArtist(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">Proyecto Solista (Sin Feat Principal)</option>
                  {sceneArtists.map(artist => {
                    const rel = player.relationships[artist.id];
                    const affinityText = rel?.affinity !== undefined ? (rel.affinity > 0 ? `+${rel.affinity}` : `${rel.affinity}`) : '0';
                    return (
                      <option key={artist.id} value={artist.id} className="bg-[#0B0C10] text-[#F8FAFC]">
                        ft. {artist.name} ({world.genres[artist.mainGenreId]?.name || artist.mainGenreId} • {formatCompactNumber(artist.stats.monthlyListeners)} • Afinidad: {affinityText})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Sub-style Selection for Album */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-2">
                  Sonoridad Conceptual de la Era ({styleDerivation.primaryGenreName})
                </label>
                <select
                  value={selectedAlbumSubgenreId}
                  onChange={e => setSelectedAlbumSubgenreId(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors cursor-pointer"
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
              <div className="bg-[#0B0C10] p-4 rounded-xl border border-[#2A2E3D] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
                    Incluir Singles Previos ({cleanCountTag(includedSingleIds.length, availablePreviousSingles.length, 'seleccionados')})
                  </label>
                  <span className="text-[11px] text-[#94A3B8]">
                    Aportan streams y ventas iniciales
                  </span>
                </div>

                {availablePreviousSingles.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic">
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
                              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white border-[#8B5CF6] shadow-xs'
                              : 'bg-[#16181F] hover:bg-white/[0.04] border-[#2A2E3D] hover:border-[#8B5CF6]/40 text-[#F8FAFC]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-white" />
                            ) : (
                              <Square className="w-4 h-4 text-[#94A3B8]" />
                            )}
                            <span className="font-semibold">{single.title}</span>
                          </div>
                          <span className={`text-[11px] font-mono ${isChecked ? 'text-white/90' : 'text-emerald-400'}`}>
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
                    Tracklist Inédito ({totalAlbumTracksCount}/{minTracksRequired} canciones mínimas)
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewTrackTitles([...newTrackTitles, `Pista ${newTrackTitles.length + 1}`])}
                    className="text-xs font-semibold text-[#C084FC] hover:text-[#E879F9] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Pista
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {/* Display Included Singles First */}
                  {includedSingleIds.map((sId, i) => {
                    const single = playerSongs.find(s => s.id === sId);
                    return (
                      <div key={sId} className="flex items-center gap-2 bg-[#8B5CF6]/20 px-3 py-2 rounded-[6px] border border-[#8B5CF6]/40 text-xs">
                        <span className="font-mono text-xs text-[#C084FC] w-6 font-bold">{i + 1}.</span>
                        <span className="font-semibold text-[#F8FAFC] flex-1">{single?.title || sId}</span>
                        <span className="text-[10px] uppercase font-bold bg-[#8B5CF6]/30 text-[#E9D5FF] px-2 py-0.5 rounded-full border border-[#8B5CF6]/40">
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
                        <span className="font-mono text-xs text-[#94A3B8] w-6 text-right">{trackNumber}.</span>
                        <input
                          type="text"
                          value={track}
                          onChange={e => {
                            const copy = [...newTrackTitles];
                            copy[i] = e.target.value;
                            setNewTrackTitles(copy);
                          }}
                          className="flex-1 bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none"
                        />
                        {newTrackTitles.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setNewTrackTitles(newTrackTitles.filter((_, idx) => idx !== i))}
                            className="p-1.5 text-[#94A3B8] hover:text-rose-400 cursor-pointer transition-colors"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full min-w-0">
                <div className="bg-[#0B0C10] p-4 rounded-xl border border-[#2A2E3D] space-y-2 w-full min-w-0 flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="block text-[11px] font-semibold text-[#F59E0B]">
                      Producción & Mastering
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      Máx: $60.000
                    </span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#F59E0B]">
                    ${albumProdBudget.toLocaleString('es-AR')}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="range"
                      min="3000"
                      max="60000"
                      step="1000"
                      value={albumProdBudget}
                      onChange={e => setAlbumProdBudget(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer border border-[#3E4556] accent-[#F59E0B] focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-mono px-0.5">
                      <span>$3.000</span>
                      <span>$30.000</span>
                      <span>$60.000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B0C10] p-4 rounded-xl border border-[#2A2E3D] space-y-2 w-full min-w-0 flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="block text-[11px] font-semibold text-emerald-400">
                      Campaña Global de Lanzamiento
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      Máx: $60.000
                    </span>
                  </div>
                  <div className="text-sm font-bold font-mono text-emerald-400">
                    ${albumMktBudget.toLocaleString('es-AR')}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="range"
                      min="2000"
                      max="60000"
                      step="1000"
                      value={albumMktBudget}
                      onChange={e => setAlbumMktBudget(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer border border-[#3E4556] accent-emerald-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-mono px-0.5">
                      <span>$2.000</span>
                      <span>$30.000</span>
                      <span>$60.000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Forecast Box */}
              <div className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${
                isAlbumFundsInsufficient
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                  : 'bg-[#0B0C10] border-[#2A2E3D]'
              }`}>
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>Producción & Campaña:</span>
                  <span className="font-mono text-[#F8FAFC]">
                    ${(albumProdBudget + albumMktBudget).toLocaleString()}
                  </span>
                </div>
                {albumProducer && (
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Productor ({world.producers[albumProducer]?.name}):</span>
                    <span className="font-mono text-[#F8FAFC]">
                      +${albumProdFee.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#94A3B8] pt-1 border-t border-[#2A2E3D]">
                  <span className="font-semibold text-[#F8FAFC]">Costo Total del Proyecto:</span>
                  <span className={`font-bold font-mono text-sm ${isAlbumFundsInsufficient ? 'text-rose-400' : 'text-[#C084FC]'}`}>
                    ${totalAlbumCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>Consumo de Energía:</span>
                  <span className="font-semibold text-rose-400">-35% Energía</span>
                </div>
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>Fondos Disponibles:</span>
                  <span className={`font-bold font-mono ${!isAlbumFundsInsufficient ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${player.stats.funds.toLocaleString()}
                  </span>
                </div>
                {isAlbumFundsInsufficient && (
                  <div className="pt-2 border-t border-rose-500/30 flex items-start gap-2 text-rose-300 text-[11px] leading-snug">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-rose-400">Fondos Insuficientes: Te faltan ${(totalAlbumCost - player.stats.funds).toLocaleString()}</strong>
                      Ajusta los presupuestos de producción o marketing para continuar.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2A2E3D]">
            <div className="text-xs text-[#94A3B8]">
              {isAlbumFundsInsufficient ? (
                <span className="text-rose-400 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Fondos insuficientes para costear el proyecto.
                </span>
              ) : isAlbumTracksInsufficient ? (
                <span className="text-rose-400 flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5" /> Faltan canciones: {totalAlbumTracksCount}/{minTracksRequired} mínimas requeridas.
                </span>
              ) : isAlbumEnergyInsufficient ? (
                <span className="text-amber-400 flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5" /> Artista exhausto (requiere al menos 35% de energía).
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Proyecto listo para producción y publicación.
                </span>
              )}
            </div>

            <button
              id="btn-submit-album"
              type="submit"
              disabled={isPublishing || isAlbumDisabled}
              title={
                isAlbumFundsInsufficient
                  ? `Fondos insuficientes ($${player.stats.funds.toLocaleString('es-AR')} / $${totalAlbumCost.toLocaleString('es-AR')})`
                  : isAlbumTracksInsufficient
                  ? `Requiere al menos ${minTracksRequired} pistas`
                  : player.stats.energy < 30
                  ? 'Energía insuficiente (mín. 30%)'
                  : 'Publicar proyecto completo'
              }
              className={`px-6 py-2.5 rounded-[6px] text-sm transition-all flex items-center gap-2 ${
                isPublishing || isAlbumDisabled
                  ? 'bg-[#16181F]/40 text-[#64748B] border border-[#2A2E3D]/40 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:opacity-90 cursor-pointer'
              }`}
            >
              <Layers className={`w-4 h-4 ${isAlbumDisabled ? 'text-[#64748B]' : 'text-white'} ${isPublishing ? 'animate-spin' : ''}`} />
              <span>
                {isPublishing
                  ? 'Publicando y Masterizando...'
                  : isAlbumFundsInsufficient
                  ? `Fondos Insuficientes ($${player.stats.funds.toLocaleString('es-AR')} / $${totalAlbumCost.toLocaleString('es-AR')})`
                  : 'Publicar Proyecto Completo'}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* --- TAB 3: DISCOGRAPHY & CATALOG VIEWER --- */}
      {activeTab === 'catalog' && (
        <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2A2E3D] pb-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#F8FAFC] flex items-center gap-2">
                <Music2 className="w-5 h-5 text-[#8B5CF6]" />
                Discografía & Catálogo Oficial
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Registro histórico de todas tus obras, ventas y valoraciones críticas.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#0B0C10] rounded-[8px] border border-[#2A2E3D] text-xs font-semibold">
              <button
                onClick={() => setCatalogFilter('all')}
                className={`px-3 py-1.5 rounded-[6px] transition-all cursor-pointer ${
                  catalogFilter === 'all'
                    ? 'bg-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04]'
                }`}
              >
                Todos ({playerSongs.length + playerAlbums.length})
              </button>
              <button
                onClick={() => setCatalogFilter('albums')}
                className={`px-3 py-1.5 rounded-[6px] transition-all cursor-pointer ${
                  catalogFilter === 'albums'
                    ? 'bg-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04]'
                }`}
              >
                Álbumes ({playerAlbums.length})
              </button>
              <button
                onClick={() => setCatalogFilter('singles')}
                className={`px-3 py-1.5 rounded-[6px] transition-all cursor-pointer ${
                  catalogFilter === 'singles'
                    ? 'bg-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04]'
                }`}
              >
                Singles ({playerSongs.length})
              </button>
            </div>
          </div>

          {/* ALBUMS SECTION */}
          {(catalogFilter === 'all' || catalogFilter === 'albums') && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                Álbumes & Proyectos de Larga Duración
              </h3>

              {playerAlbums.length === 0 ? (
                <p className="text-xs text-[#94A3B8] italic py-2">
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
                        className="bg-[#0B0C10] border border-[#2A2E3D] rounded-xl p-5 space-y-4 shadow-sm hover:border-[#8B5CF6]/50 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-20 h-20 rounded-[10px] bg-gradient-to-br ${coverGrad} shrink-0 border-2 border-[#2A2E3D] shadow-md flex items-end p-2 text-white text-[9px] font-bold uppercase`}
                          >
                            {album.type}
                          </div>

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C084FC]">
                                {world.genres[album.genreId]?.name || album.genreId}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#16181F] border border-[#2A2E3D] text-[#F8FAFC] uppercase">
                                {album.type}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-[#F8FAFC] tracking-tight truncate pt-0.5">
                              {album.title}
                            </h4>
                            <p className="text-xs text-[#94A3B8]">
                              Lanzado en {album.releaseYear} • {album.songIds.length} Pistas
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">
                              1ª Semana
                            </span>
                            <span className="font-mono font-bold text-sm text-emerald-400">
                              {album.firstWeekSales.toLocaleString()} u.
                            </span>
                          </div>
                        </div>

                        {/* Metacritic Review Box */}
                        <div className="bg-[#16181F] border border-[#2A2E3D] p-3 rounded-lg space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                              Puntaje Crítico:
                            </span>
                            <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${getScoreColor(album.criticalScore)}`}>
                              {album.criticalScore}/100
                            </span>
                          </div>
                          {album.criticalReviewText && (
                            <p className="text-[11px] text-[#94A3B8] italic leading-relaxed pt-1">
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
            <div className="space-y-4 pt-4 border-t border-[#2A2E3D]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Disc3 className="w-4 h-4 text-[#8B5CF6]" />
                Sencillos & Pistas Individuales
              </h3>

              {playerSongs.length === 0 ? (
                <p className="text-xs text-[#94A3B8] italic py-2">
                  No tienes canciones grabadas aún.
                </p>
              ) : (
                <div className="space-y-3">
                  {playerSongs.map(song => {
                    const subgenre = song.subGenreIds && song.subGenreIds.length > 0 ? SUBGENRE_DETAILS[song.subGenreIds[0]] : undefined;
                    const isHit = (song.peakPosition?.Global ?? 99) <= 10;

                    return (
                      <div
                        key={song.id}
                        className="bg-[#0B0C10] border border-[#2A2E3D] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:border-[#8B5CF6]/50 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-[#F8FAFC]">
                              {song.title}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C084FC]">
                              {world.genres[song.genreId]?.name || song.genreId}
                            </span>
                            {subgenre && (
                              <span className="text-[10px] font-medium bg-[#16181F] border border-[#2A2E3D] text-[#CBD5E1] px-2 py-0.5 rounded-full">
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

                          <p className="text-xs text-[#94A3B8]">
                            Lanzado: {song.releaseYear} • Calidad: <strong className="text-emerald-400">{song.quality}%</strong> • Comercial: <strong className="text-[#C084FC]">{song.commercialAppeal}%</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-6 text-xs font-mono">
                          <div>
                            <span className="text-[#94A3B8] block text-[10px] uppercase">Peak Global</span>
                            <span className={`font-bold text-sm ${song.peakPosition?.Global === 1 ? 'text-[#F59E0B] font-extrabold' : song.peakPosition?.Global && song.peakPosition.Global <= 10 ? 'text-[#C084FC]' : 'text-[#F8FAFC]'}`}>
                              {song.peakPosition?.Global ? `#${song.peakPosition.Global}` : '—'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#94A3B8] block text-[10px] uppercase">Streams / Mes</span>
                            <span className="font-bold text-sm text-emerald-400">
                              {song.streamsLastMonth.toLocaleString()}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#94A3B8] block text-[10px] uppercase">Total Acumulado</span>
                            <span className="font-bold text-sm text-[#C084FC]">
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

      {/* --- RELEASE CONFIRMATION MODAL --- */}
      {confirmedRelease && (
        <ReleaseConfirmationModal
          data={confirmedRelease}
          onClose={handleCloseConfirmation}
          onNavigateToCatalog={handleCloseConfirmation}
        />
      )}
    </div>
  );
};

