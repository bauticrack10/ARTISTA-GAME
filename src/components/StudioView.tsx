import React, { useState, useEffect, useMemo, useRef } from 'react';
import { activateOnKey } from '../utils/a11y';
import {
  Artist,
  WorldState,
  Song,
  Album,
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
  Mic,
  Sliders,
  Layers,
  CheckCircle2,
  Music2,
  Award,
  Lock,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
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
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TimeSystem } from '../systems/TimeSystem';
import {
  RELEASE_BADGES,
  ARTISTIC_COVER_GRADIENTS
} from '../utils/themeColors';
import { playSound } from '../utils/audioSystem';
import {
  cleanCountTag,
  formatReleaseDate,
  formatProducerCredit
} from '../utils/formatters';

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
    borderHover: 'hover:border-[#3F3F46]'
  },
  {
    id: 'VHS Retro Synthwave',
    name: 'VHS Retro Synthwave',
    tag: 'Textura Analógica 80s',
    description: 'Luces de neón, escaneo analógico en cinta VHS, destellos de cromo y atmósfera de club nocturno retro.',
    icon: Tv,
    gradient: 'from-amber-500/20 to-rose-600/20',
    borderHover: 'hover:border-[#3F3F46]'
  },
  {
    id: 'Animación 3D Futurista',
    name: 'Animación 3D Futurista',
    tag: 'CGI Unreal Engine',
    description: 'Avatares 3D hiperrealistas, efectos visuales de partículas, escenografía distópica y estética de videojuego AAA.',
    icon: Box,
    gradient: 'from-cyan-500/20 to-emerald-600/20',
    borderHover: 'hover:border-[#3F3F46]'
  },
  {
    id: 'Urbano Callejero DIY',
    name: 'Urbano Callejero DIY',
    tag: 'Guerrilla & Fisheye',
    description: 'Grabación en formato guerrilla urbana con lente Fisheye, tomas nocturnas con flash crudo y dinamismo callejero underground.',
    icon: Camera,
    gradient: 'from-amber-500/20 to-orange-600/20',
    borderHover: 'hover:border-[#3F3F46]'
  },
  {
    id: 'Psicodélico & Arte Conceptual',
    name: 'Psicodélico & Arte Conceptual',
    tag: 'Vanguardia & Surrealismo',
    description: 'Simbolismos oníricos, vestuarios de alta costura conceptual, distorsiones visuales hipnóticas y dirección artística de galería.',
    icon: Eye,
    gradient: 'from-emerald-500/20 to-teal-600/20',
    borderHover: 'hover:border-[#3F3F46]'
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

const DEFAULT_ALBUM_TRACKS = [
  'Intro',
  'Fuego en las Calles',
  'Noches de Gloria',
  'Diamantes y Cicatrices',
  'Bajo las Luces del Neón',
  'Outro'
];

interface StudioDraftState {
  activeTab: 'single' | 'album' | 'catalog';
  singleTitle: string;
  selectedSubgenreId: string;
  singleProducer: string;
  singleProdBudget: number;
  singleMktBudget: number;
  hasMusicVideo: boolean;
  selectedVideoConcept: MusicVideoConcept;
  selectedDirectorTier: MusicVideoDirectorTier;
  albumTitle: string;
  albumType: Album['type'];
  selectedAlbumSubgenreId: string;
  albumProducer: string;
  albumProdBudget: number;
  albumMktBudget: number;
  includedSingleIds: string[];
  newTrackTitles: string[];
}

const studioDraftMemory: Record<string, StudioDraftState> = {};

const getStudioDraftKey = (playerId: string) => `el_artista_studio_draft_${playerId}`;

const loadStudioDraft = (playerId: string, defaultSubgenreId: string): StudioDraftState => {
  if (studioDraftMemory[playerId]) {
    return studioDraftMemory[playerId];
  }
  try {
    const raw = localStorage.getItem(getStudioDraftKey(playerId));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StudioDraftState>;
      const loaded: StudioDraftState = {
        activeTab: parsed.activeTab || 'single',
        singleTitle: parsed.singleTitle ?? '',
        selectedSubgenreId: parsed.selectedSubgenreId || defaultSubgenreId,
        singleProducer: parsed.singleProducer ?? '',
        singleProdBudget: typeof parsed.singleProdBudget === 'number' ? parsed.singleProdBudget : 0,
        singleMktBudget: typeof parsed.singleMktBudget === 'number' ? parsed.singleMktBudget : 0,
        hasMusicVideo: Boolean(parsed.hasMusicVideo),
        selectedVideoConcept: parsed.selectedVideoConcept || 'Cine 4K Cinematográfico',
        selectedDirectorTier: parsed.selectedDirectorTier || 'Estudio Indie',
        albumTitle: parsed.albumTitle ?? '',
        albumType: parsed.albumType && parsed.albumType !== 'collab_album' ? parsed.albumType : 'album',
        selectedAlbumSubgenreId: parsed.selectedAlbumSubgenreId || defaultSubgenreId,
        albumProducer: parsed.albumProducer ?? '',
        albumProdBudget: typeof parsed.albumProdBudget === 'number' ? parsed.albumProdBudget : 12000,
        albumMktBudget: typeof parsed.albumMktBudget === 'number' ? parsed.albumMktBudget : 10000,
        includedSingleIds: Array.isArray(parsed.includedSingleIds) ? parsed.includedSingleIds : [],
        newTrackTitles: Array.isArray(parsed.newTrackTitles) && parsed.newTrackTitles.length > 0
          ? parsed.newTrackTitles
          : [...DEFAULT_ALBUM_TRACKS]
      };
      studioDraftMemory[playerId] = loaded;
      return loaded;
    }
  } catch {
    // Ignore storage read errors
  }
  const fresh: StudioDraftState = {
    activeTab: 'single',
    singleTitle: '',
    selectedSubgenreId: defaultSubgenreId,
    singleProducer: '',
    singleProdBudget: 0,
    singleMktBudget: 0,
    hasMusicVideo: false,
    selectedVideoConcept: 'Cine 4K Cinematográfico',
    selectedDirectorTier: 'Estudio Indie',
    albumTitle: '',
    albumType: 'album',
    selectedAlbumSubgenreId: defaultSubgenreId,
    albumProducer: '',
    albumProdBudget: 12000,
    albumMktBudget: 10000,
    includedSingleIds: [],
    newTrackTitles: [...DEFAULT_ALBUM_TRACKS]
  };
  studioDraftMemory[playerId] = fresh;
  return fresh;
};

const saveStudioDraft = (playerId: string, draft: StudioDraftState) => {
  studioDraftMemory[playerId] = draft;
  try {
    localStorage.setItem(getStudioDraftKey(playerId), JSON.stringify(draft));
  } catch {
    // Ignore storage write errors
  }
};

export const StudioView: React.FC<StudioViewProps> = ({
  player,
  world,
  initialTab,
  onTabChange,
  onReleaseSong,
  onReleaseAlbum
}) => {
  const currentEra = player?.eras && player.eras.length > 0 ? player.eras[player.eras.length - 1] : undefined;
  const styleDerivation = getArtistDerivedStyles(player, currentEra, world?.genres || {});
  const defaultSubgenreId = styleDerivation.availableStyles[0]?.id || '';

  const initialDraft = useMemo(
    () => loadStudioDraft(player.id, defaultSubgenreId),
    [player.id, defaultSubgenreId]
  );

  const [activeTab, setActiveTab] = useState<'single' | 'album' | 'catalog'>(
    initialTab || initialDraft.activeTab || 'single'
  );
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'singles' | 'albums'>('all');

  const prevInitialTabRef = useRef(initialTab);
  useEffect(() => {
    if (initialTab && initialTab !== prevInitialTabRef.current) {
      setActiveTab(initialTab);
      prevInitialTabRef.current = initialTab;
    }
  }, [initialTab]);

  // Singles released this year
  const MAX_SINGLES = GameEngine.MAX_SINGLES_PER_YEAR;
  const playerSongs = (Object.values(world?.songs || {}) as Song[]).filter(s => s.artistId === player?.id);
  const singlesThisYear = playerSongs.filter(s => s.releaseYear === world?.currentYear && s.isSingle).length;
  const isSinglesLimitReached = singlesThisYear >= MAX_SINGLES;

  const avgQuality = useMemo(() => {
    if (playerSongs.length === 0) return 0;
    const sum = playerSongs.reduce((acc, s) => acc + (s.quality || 0), 0);
    return Math.round(sum / playerSongs.length);
  }, [playerSongs]);

  // Release confirmation and duplicate click prevention state
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [confirmedRelease, setConfirmedRelease] = useState<ReleaseConfirmationData | null>(null);
  const [expandedAlbumIds, setExpandedAlbumIds] = useState<Record<string, boolean>>({});

  const toggleAlbumExpanded = (albumId: string) => {
    setExpandedAlbumIds(prev => ({
      ...prev,
      [albumId]: !prev[albumId]
    }));
  };

  // Single State (initialized from persistent draft)
  const [singleTitle, setSingleTitle] = useState<string>(initialDraft.singleTitle);
  const [selectedSubgenreId, setSelectedSubgenreId] = useState<string>(
    initialDraft.selectedSubgenreId || defaultSubgenreId
  );
  const [singleProducer, setSingleProducer] = useState<string>(initialDraft.singleProducer);
  const [singleProdBudget, setSingleProdBudget] = useState<number>(initialDraft.singleProdBudget);
  const [singleMktBudget, setSingleMktBudget] = useState<number>(initialDraft.singleMktBudget);

  // Music Video Production State (initialized from persistent draft)
  const [hasMusicVideo, setHasMusicVideo] = useState<boolean>(initialDraft.hasMusicVideo);
  const [selectedVideoConcept, setSelectedVideoConcept] = useState<MusicVideoConcept>(initialDraft.selectedVideoConcept);
  const [selectedDirectorTier, setSelectedDirectorTier] = useState<MusicVideoDirectorTier>(initialDraft.selectedDirectorTier);

  const currentDirectorTier = DIRECTOR_TIERS.find(t => t.id === selectedDirectorTier) || DIRECTOR_TIERS[1];
  const videoCost = hasMusicVideo ? currentDirectorTier.cost : 0;
  const singleProdFee = singleProducer && world?.producers ? (world.producers[singleProducer]?.costPerTrack || 0) : 0;
  const totalSingleCost = singleProdBudget + singleMktBudget + singleProdFee + videoCost;
  const isFundsInsufficient = totalSingleCost > player.stats.funds;

  // Album State (initialized from persistent draft)
  const [albumTitle, setAlbumTitle] = useState<string>(initialDraft.albumTitle);
  const [albumType, setAlbumType] = useState<Album['type']>(
    initialDraft.albumType === 'collab_album' ? 'album' : initialDraft.albumType
  );
  const [selectedAlbumSubgenreId, setSelectedAlbumSubgenreId] = useState<string>(
    initialDraft.selectedAlbumSubgenreId || defaultSubgenreId
  );
  const [albumProducer, setAlbumProducer] = useState<string>(initialDraft.albumProducer);
  const [albumProdBudget, setAlbumProdBudget] = useState<number>(initialDraft.albumProdBudget);
  const [albumMktBudget, setAlbumMktBudget] = useState<number>(initialDraft.albumMktBudget);

  // Standalone singles available for album inclusion
  const availablePreviousSingles = playerSongs.filter(s => s.isSingle && !s.albumId);
  const [includedSingleIds, setIncludedSingleIds] = useState<string[]>(
    initialDraft.includedSingleIds.filter(id => availablePreviousSingles.some(s => s.id === id))
  );

  // New Tracks for the album
  const [newTrackTitles, setNewTrackTitles] = useState<string[]>(initialDraft.newTrackTitles);

  // Sync all Studio draft fields to persistent store whenever any field changes
  useEffect(() => {
    saveStudioDraft(player.id, {
      activeTab,
      singleTitle,
      selectedSubgenreId,
      singleProducer,
      singleProdBudget,
      singleMktBudget,
      hasMusicVideo,
      selectedVideoConcept,
      selectedDirectorTier,
      albumTitle,
      albumType,
      selectedAlbumSubgenreId,
      albumProducer,
      albumProdBudget,
      albumMktBudget,
      includedSingleIds,
      newTrackTitles
    });
  }, [
    player.id,
    activeTab,
    singleTitle,
    selectedSubgenreId,
    singleProducer,
    singleProdBudget,
    singleMktBudget,
    hasMusicVideo,
    selectedVideoConcept,
    selectedDirectorTier,
    albumTitle,
    albumType,
    selectedAlbumSubgenreId,
    albumProducer,
    albumProdBudget,
    albumMktBudget,
    includedSingleIds,
    newTrackTitles
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

  const resetSingleDraft = () => {
    setSingleTitle('');
    setHasMusicVideo(false);
    setSingleProdBudget(0);
    setSingleMktBudget(0);
    setSingleProducer('');
  };

  const resetAlbumDraft = () => {
    setAlbumTitle('');
    setIncludedSingleIds([]);
    setAlbumProducer('');
    setAlbumProdBudget(12000);
    setAlbumMktBudget(10000);
    setNewTrackTitles([...DEFAULT_ALBUM_TRACKS]);
  };

  // Close confirmation modal & navigate to catalog
  const handleCloseConfirmation = () => {
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
      const genreName = world.genres[styleDerivation.primaryGenreId]?.name || styleDerivation.primaryGenreId;

      onReleaseSong({
        title: finalTitle,
        genreId: styleDerivation.primaryGenreId,
        subGenreIds: selectedSubgenreId ? [selectedSubgenreId] : [],
        featuredArtistIds: [],
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
        featuredArtistNames: undefined,
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

      resetSingleDraft();
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
        featuredArtistNames: undefined,
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

      resetAlbumDraft();
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
    <div className="space-y-6 pb-16 font-sans text-[#F4F0EA]">
      {/* --- ENCABEZADO DEL ESTUDIO: COMPACTO Y UNIFICADO --- */}
      <div className="liquid-glass-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-[4px] text-2xs font-sans font-bold uppercase tracking-wider liquid-glass-pill text-[#FF4F00] border border-[#FF4F00]/30">
                Estudio & Máster
              </span>
              <span className="text-xs text-[#8E8E99] font-sans tabular-nums">
                Año {world.currentYear} • Mes {world.currentMonth}
              </span>
              <span className="text-xs text-[#52525B]">•</span>
              <span className="text-xs font-semibold text-[#F4F0EA]">
                Era: {currentEra ? currentEra.name : 'Los Primeros Pasos'} ({styleDerivation.primaryGenreName})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-[#F4F0EA]">
              Estudio de Grabación & Composición
            </h1>
          </div>

          {/* Selector de Pestañas con estilo consola */}
          <div className="flex items-center gap-1.5 p-1 liquid-glass-pill text-xs sm:text-sm font-semibold shrink-0 self-start md:self-auto">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('single');
                onTabChange?.('single');
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'single'
                  ? 'bg-[#FF4F00] text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                  : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 bg-transparent'
              }`}
            >
              <Music2 className="w-4 h-4 shrink-0" />
              <span>Grabar Single</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('album');
                onTabChange?.('album');
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'album'
                  ? 'bg-[#FF4F00] text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                  : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 bg-transparent'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Grabar Álbum / EP</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('catalog');
                onTabChange?.('catalog');
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'catalog'
                  ? 'bg-[#FF4F00] text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                  : 'text-[#DCE2EE] hover:text-white hover:bg-white/10 bg-transparent'
              }`}
            >
              <Disc3 className="w-4 h-4 shrink-0" />
              <span>Mi Catálogo ({playerSongs.length})</span>
            </button>
          </div>
        </div>

        {/* Fila única compacta de indicadores de sesión */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap pt-2 text-xs font-sans tabular-nums">
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Catálogo:</span>
            <strong className="text-[#F4F0EA]">{playerSongs.length} temas</strong>
            <span className="text-[#8E8E99]">({playerAlbums.length} LP/EP)</span>
          </div>
          <span className="text-white/35 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Calidad Media:</span>
            <strong className="text-[#10B981]">{avgQuality}%</strong>
          </div>
          <span className="text-white/35 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Cupo Anual Singles:</span>
            <strong className={isSinglesLimitReached ? 'text-[#EF4444]' : 'text-[#F4F0EA]'}>
              {singlesThisYear}/{MAX_SINGLES}
            </strong>
          </div>
          <span className="text-white/35 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Energía en Sesión:</span>
            <strong className={player.stats.energy >= 35 ? 'text-[#10B981]' : player.stats.energy >= 15 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}>
              {player.stats.energy}%
            </strong>
          </div>
        </div>
      </div>

      {/* --- NOTIFICATION TOAST --- */}
      {notification && (
        <div className="bg-[#0B0B0C] border border-[#10B981]/40 text-[#10B981] p-4 rounded-[4px] flex items-center gap-3 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* --- TAB 1: SINGLE CREATION --- */}
      {activeTab === 'single' && (
        <form onSubmit={handleCreateSingle} className="liquid-glass-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
            <div>
              <h2 className="kit-text-header font-display text-lg tracking-tight text-[#F4F0EA] flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#00E599]" />
                Componer Nuevo Single
              </h2>
              <p className="text-xs text-[#8E8E99] mt-0.5">
                Grabá un corte adelanto para medir rotación en listas editoriales y pauta radial antes de cerrar un LP.
              </p>
            </div>
          </div>

          {isSinglesLimitReached && (
            <div className="bg-[#0B0B0C] border border-[#F59E0B]/40 text-[#F59E0B] p-4 rounded-[4px] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                Límite anual de singles alcanzado • {MAX_SINGLES}/{MAX_SINGLES}
              </div>
              <p className="text-[#8E8E99] leading-relaxed">
                El cupo de sencillos se reinicia cada año. Avanza de mes/año o graba un <strong className="text-[#F4F0EA]">Álbum / EP Completo</strong> en la pestaña contigua.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Title & Sonic Sub-style */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA]">
                    Título de la Canción *
                  </label>
                  <button
                    type="button"
                    onClick={() => generateRandomTitle(false)}
                    className="text-xs text-[#FF2A4B] hover:underline font-semibold cursor-pointer transition-colors"
                  >
                    Sugerir Título
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ej: Medianoche en Tokio, Barrio Fino..."
                  value={singleTitle}
                  onChange={e => setSingleTitle(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 text-sm text-[#F4F0EA] placeholder:text-[#8E8E99] transition-all"
                />
              </div>

              {/* Sub-style Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA] mb-2">
                  Dirección Sónica de la Era • {styleDerivation.primaryGenreName?.trim() || ''}
                </label>
                <div className="space-y-2 exclusion-group">
                  {styleDerivation.availableStyles.map(style => {
                    const isSelected = selectedSubgenreId === style.id;
                    return (
                      <div
                        key={style.id}
                        role="button"
                        aria-pressed={isSelected}
                        aria-disabled={!style.isUnlocked}
                        tabIndex={style.isUnlocked ? 0 : -1}
                        onKeyDown={activateOnKey}
                        onClick={() => {
                          if (style.isUnlocked) setSelectedSubgenreId(style.id);
                        }}
                        className={`p-3 rounded-[4px] border transition-all ${
                          !style.isUnlocked
                            ? 'opacity-60 bg-[#0B0B0C] border-[#26262B] cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#1C1C21] text-[#F4F0EA] border-[#FF2A4B] cursor-pointer'
                            : 'bg-[#0B0B0C] hover:bg-[#1C1C21] border-[#26262B] hover:border-[#3F3F46] text-[#F4F0EA] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-[#FF2A4B]' : 'text-[#F4F0EA]'}`}>
                            {style.name}
                          </span>
                          {style.isUnlocked ? (
                            <span className={`text-2xs font-sans font-bold px-2 py-0.5 rounded-[4px] ${
                              isSelected ? 'bg-[#FF2A4B]/20 text-[#FF2A4B] border border-[#FF2A4B]/40' : 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]'
                            }`}>
                              Disponible
                            </span>
                          ) : (
                            <span className="text-2xs font-sans font-semibold px-2 py-0.5 rounded-[4px] bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] flex items-center gap-1">
                              <Lock className="w-3 h-3" /> {style.lockReason}
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-1 leading-snug text-[#8E8E99]">
                          {style.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Producer & Budgets */}
            <div className="space-y-5">
              {/* Producer */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA] mb-2">
                  Productor Musical / Beatmaker
                </label>
                <select
                  value={singleProducer}
                  onChange={e => setSingleProducer(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26262B] focus:border-[#3F3F46] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F4F0EA] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">Autoproducción en Home Studio • $0</option>
                  {(Object.values(world.producers) as Producer[]).map(p => {
                    const lockInfo = getProducerLockStatus(p, player);
                    return (
                      <option key={p.id} value={p.id} disabled={!lockInfo.isUnlocked} className="bg-[#0B0B0C] text-[#F4F0EA]">
                        {lockInfo.isUnlocked ? '' : '[Bloqueado] '}{p.name} • +{p.qualityBoost}% Calidad • ${p.costPerTrack.toLocaleString()} {!lockInfo.isUnlocked ? `[Bloqueado: ${lockInfo.lockReason}]` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Budgets Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-[#0B0B0C] p-4 rounded-[4px] border border-[#26262B] space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-semibold text-[#F59E0B]">
                      Producción & Mezcla
                    </span>
                    <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">
                      Máx: $25.000
                    </span>
                  </div>
                  <div className="text-xs font-bold font-sans tabular-nums text-[#F59E0B]">
                    {singleProdBudget === 0 ? '$0 • Home Studio' : `$${singleProdBudget.toLocaleString('es-AR')}`}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="range"
                      min="0"
                      max="25000"
                      step="250"
                      value={singleProdBudget}
                      onChange={e => setSingleProdBudget(Number(e.target.value))}
                      className="w-full h-2 bg-[#1C1C21] rounded-[2px] appearance-none cursor-pointer border border-[#26262B] accent-[#F59E0B] focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-2xs text-[#8E8E99] font-sans tabular-nums">
                      <span>$0</span>
                      <span>$12.500</span>
                      <span>$25.000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B0B0C] p-4 rounded-[4px] border border-[#26262B] space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-semibold text-[#10B981]">
                      Marketing & Campaña
                    </span>
                    <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">
                      Máx: $25.000
                    </span>
                  </div>
                  <div className="text-xs font-bold font-sans tabular-nums text-[#10B981]">
                    {singleMktBudget === 0 ? '$0 • Difusión Orgánica' : `$${singleMktBudget.toLocaleString('es-AR')}`}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="range"
                      min="0"
                      max="25000"
                      step="250"
                      value={singleMktBudget}
                      onChange={e => setSingleMktBudget(Number(e.target.value))}
                      className="w-full h-2 bg-[#1C1C21] rounded-[2px] appearance-none cursor-pointer border border-[#26262B] accent-[#10B981] focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-2xs text-[#8E8E99] font-sans tabular-nums">
                      <span>$0</span>
                      <span>$12.500</span>
                      <span>$25.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- MUSIC VIDEO PRODUCTION SECTION (RODAJE DE VIDEOCLIPS) --- */}
          <div className="bg-[#0B0B0C] border border-[#26262B] rounded-[6px] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-[4px] border ${
                  hasMusicVideo
                    ? 'bg-[#FF2A4B]/15 text-[#FF2A4B] border-[#FF2A4B]/40'
                    : 'bg-[#141417] text-[#8E8E99] border-[#26262B]'
                }`}>
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F4F0EA]">
                    Videoclip Oficial (Opcional)
                  </h3>
                  <p className="text-xs text-[#8E8E99]">
                    Sumá un corte audiovisual para impulsar rotación inicial, reproducciones y alcance viral.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHasMusicVideo(!hasMusicVideo)}
                className={`px-3.5 py-2 rounded-[4px] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  hasMusicVideo
                    ? 'bg-[#FF2A4B] text-white'
                    : 'bg-[#141417] hover:bg-[#1C1C21] text-[#F4F0EA] border border-[#26262B]'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{hasMusicVideo ? '✓ Videoclip Activado' : '+ Rodar Videoclip Oficial'}</span>
              </button>
            </div>

            {hasMusicVideo && (
              <div className="space-y-5 pt-3 border-t border-[#26262B]">
                {/* 1. CONCEPT & AESTHETICS */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA]">
                      1. Concepto & Estética Visual
                    </label>
                    <span className="text-xs text-[#8E8E99]">
                      Seleccionado: <strong className="text-[#F4F0EA]">{selectedVideoConcept}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 exclusion-group">
                    {VIDEO_CONCEPTS.map(concept => {
                      const isSelected = selectedVideoConcept === concept.id;
                      const ConceptIcon = concept.icon;
                      return (
                        <div
                          key={concept.id}
                          role="button"
                          tabIndex={0}
                          onKeyDown={activateOnKey}
                          onClick={() => setSelectedVideoConcept(concept.id)}
                          className={`p-3 rounded-[4px] border transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-[#1C1C21] border-[#FF2A4B]'
                              : 'bg-[#141417] border-[#26262B] hover:border-[#3F3F46]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <ConceptIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FF2A4B]' : 'text-[#8E8E99]'}`} />
                              <span className="text-2xs font-sans text-[#8E8E99] truncate">{concept.tag}</span>
                            </div>
                            <span className="text-xs font-bold text-[#F4F0EA] block">{concept.name}</span>
                          </div>
                          <p className="text-2xs text-[#8E8E99] leading-snug">
                            {concept.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. DIRECTOR TIER & PRODUCTION BUDGET */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA]">
                      2. Nivel de Dirección & Presupuesto Audiovisual
                    </label>
                    <span className="text-xs text-[#8E8E99] font-sans tabular-nums">
                      Tarifa: <strong className="text-[#10B981]">${currentDirectorTier.cost.toLocaleString()}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 exclusion-group">
                    {DIRECTOR_TIERS.map(tier => {
                      const isSelected = selectedDirectorTier === tier.id;
                      const TierIcon = tier.icon;
                      return (
                        <div
                          key={tier.id}
                          role="button"
                          tabIndex={0}
                          onKeyDown={activateOnKey}
                          onClick={() => setSelectedDirectorTier(tier.id)}
                          className={`p-3.5 rounded-[4px] border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-[#1C1C21] border-[#FF2A4B]'
                              : 'bg-[#141417] border-[#26262B] hover:border-[#3F3F46]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <TierIcon className={`w-4 h-4 ${isSelected ? 'text-[#FF2A4B]' : 'text-[#8E8E99]'}`} />
                                <h4 className="text-xs font-bold text-[#F4F0EA]">{tier.name}</h4>
                              </div>
                              <span className="text-xs font-bold font-sans tabular-nums text-[#10B981] bg-[#0B0B0C] px-2 py-0.5 rounded-[4px] border border-[#26262B]">
                                ${tier.cost.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-2xs text-[#8E8E99] font-semibold block">{tier.tag} • {tier.estimatedViews}</span>
                            <p className="text-xs text-[#8E8E99] leading-snug pt-0.5">
                              {tier.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#26262B] text-2xs font-sans tabular-nums text-[#8E8E99]">
                            <span>Hype: <strong className="text-[#F4F0EA]">+{tier.hypeBoost}</strong></span>
                            <span>Stream: <strong className="text-[#10B981]">+{tier.velocityBoost}%</strong></span>
                            <span>Viral: <strong className="text-[#FF2A4B]">+{tier.viralBoost}%</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- BARRA ÚNICA DE RESUMEN DE COSTOS + LANZAMIENTO DE SINGLE --- */}
          <div className="p-4 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap text-xs font-sans tabular-nums">
                <span className="text-[#8E8E99]">
                  Costo Total: <strong className={`text-sm ${isFundsInsufficient ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>${totalSingleCost.toLocaleString('es-AR')}</strong>
                </span>
                <span className="text-white/35">•</span>
                <span className="text-[#8E8E99]">
                  Fondos: <strong className={isFundsInsufficient ? 'text-[#EF4444]' : 'text-[#10B981]'}>${player.stats.funds.toLocaleString('es-AR')}</strong>
                </span>
                <span className="text-white/35">•</span>
                <span className="text-[#8E8E99]">
                  Sesión: <strong className="text-[#FF2A4B]">-15% Energía</strong>
                </span>
                {singleProducer && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#141417] border border-[#26262B] text-[#8E8E99]">
                    Productor: +${singleProdFee.toLocaleString()}
                  </span>
                )}
                {hasMusicVideo && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#141417] border border-[#26262B] text-[#8E8E99]">
                    Videoclip: +${videoCost.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="text-xs">
                {isFundsInsufficient ? (
                  <span className="text-[#EF4444] flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Fondos insuficientes (faltan ${(totalSingleCost - player.stats.funds).toLocaleString('es-AR')}).
                  </span>
                ) : isSinglesLimitReached ? (
                  <span className="text-[#EF4444] flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5" /> Límite anual de singles alcanzado ({MAX_SINGLES}/{MAX_SINGLES}).
                  </span>
                ) : player.stats.energy < 15 ? (
                  <span className="text-[#F59E0B] flex items-center gap-1.5 font-medium">
                    <Zap className="w-3.5 h-3.5" /> Artista agotado (requiere al menos 15% energía).
                  </span>
                ) : (
                  <span className="text-[#10B981] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Listo para grabación y distribución.
                  </span>
                )}
              </div>
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
              className="kit-btn kit-btn-emerald py-3 px-8 text-sm shrink-0"
            >
              <span className="kit-btn-content">
                <Disc3 className={`w-4 h-4 ${isFundsInsufficient ? 'text-white/40' : 'text-white'} ${isPublishing ? 'animate-spin' : ''}`} />
                <span className="kit-btn-label">
                  {isPublishing
                    ? 'Publicando y Masterizando...'
                    : isFundsInsufficient
                    ? `Fondos Insuficientes ($${player.stats.funds.toLocaleString('es-AR')} / $${totalSingleCost.toLocaleString('es-AR')})`
                    : hasMusicVideo
                    ? 'Grabar Single & Estrenar Videoclip'
                    : 'Grabar & Publicar Single'}
                </span>
              </span>
            </button>
          </div>
        </form>
      )}

      {/* --- TAB 2: ALBUM & EP CREATION STUDIO --- */}
      {activeTab === 'album' && (
        <form onSubmit={handleCreateAlbum} className="liquid-glass-card p-6 space-y-6">
          <div className="pb-2">
            <h2 className="kit-text-header font-display text-lg tracking-tight text-[#F4F0EA] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00E599]" />
              Estudio de Composición de Álbumes & Proyectos
            </h2>
            <p className="text-xs text-[#8E8E99] mt-0.5">
              Reuní cortes adelanto y pistas inéditas en un LP o EP, cerrá el mastering con un productor ejecutivo y someté el disco a la prensa especializada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Concept, Format & Previous Singles */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA]">
                    Título del Álbum / Proyecto *
                  </label>
                  <button
                    type="button"
                    onClick={() => generateRandomTitle(true)}
                    className="text-xs text-[#FF2A4B] hover:underline font-semibold cursor-pointer transition-colors"
                  >
                    Sugerir Título Conceptual
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ej: Crónicas de una Noche, Génesis..."
                  value={albumTitle}
                  onChange={e => setAlbumTitle(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 text-sm text-[#F4F0EA] placeholder:text-[#8E8E99] transition-all"
                />
              </div>

              {/* Format & Producer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA] mb-2">
                    Formato de Lanzamiento
                  </label>
                  <select
                    value={albumType}
                    onChange={e => setAlbumType(e.target.value as Album['type'])}
                    className="w-full bg-[#0B0B0C] border border-[#26262B] focus:border-[#3F3F46] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F4F0EA] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="album">Álbum de Estudio LP • Mín. 6 temas</option>
                    <option value="ep">EP Extended Play • Mín. 4 temas</option>
                    <option value="mixtape">Mixtape Callejera • Mín. 6 temas</option>
                    <option value="deluxe">Edición Deluxe • Mín. 10 temas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA] mb-2">
                    Productor Ejecutivo
                  </label>
                  <select
                    value={albumProducer}
                    onChange={e => setAlbumProducer(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26262B] focus:border-[#3F3F46] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F4F0EA] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Autoproducido • $0</option>
                    {(Object.values(world.producers) as Producer[]).map(p => {
                      const lockInfo = getProducerLockStatus(p, player);
                      return (
                        <option key={p.id} value={p.id} disabled={!lockInfo.isUnlocked} className="bg-[#0B0B0C] text-[#F4F0EA]">
                          {lockInfo.isUnlocked ? '' : '[Bloqueado] '}{p.name} • +{p.qualityBoost}% Calidad • ${p.costPerTrack.toLocaleString()}/tema {!lockInfo.isUnlocked ? `[Bloqueado: ${lockInfo.lockReason}]` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Sub-style Selection for Album */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA] mb-2">
                  Sonoridad Conceptual de la Era • {styleDerivation.primaryGenreName}
                </label>
                <select
                  value={selectedAlbumSubgenreId}
                  onChange={e => setSelectedAlbumSubgenreId(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26262B] focus:border-[#3F3F46] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F4F0EA] focus:outline-none transition-colors cursor-pointer"
                >
                  {styleDerivation.availableStyles
                    .filter(s => s.isUnlocked)
                    .map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} • {s.aestheticTone}
                      </option>
                    ))}
                </select>
              </div>

              {/* Previous Singles Inclusion Section */}
              <div className="bg-[#0B0B0C] p-4 rounded-[4px] border border-[#26262B] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA]">
                    Incluir Singles Previos • {cleanCountTag(includedSingleIds.length, availablePreviousSingles.length, 'seleccionados')}
                  </label>
                  <span className="text-2xs text-[#8E8E99]">
                    Aportan streams iniciales
                  </span>
                </div>

                {availablePreviousSingles.length === 0 ? (
                  <p className="text-xs text-[#8E8E99] italic">
                    No tienes sencillos independientes disponibles para agregar a este disco.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {availablePreviousSingles.map(single => {
                      const isChecked = includedSingleIds.includes(single.id);
                      const singleReleaseDate = formatReleaseDate(single.releaseMonth, single.releaseYear, 'short');
                      const prodName = formatProducerCredit(single.producerId, world.producers, { short: true });
                      return (
                        <div
                          key={single.id}
                          role="button"
                          tabIndex={0}
                          onKeyDown={activateOnKey}
                          onClick={() => toggleSingleInclusion(single.id)}
                          className={`p-2.5 rounded-[4px] border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#1C1C21] text-[#F4F0EA] border-[#FF2A4B]'
                              : 'bg-[#141417] hover:bg-[#1C1C21] border-[#26262B] text-[#F4F0EA]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-[#FF2A4B] shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-[#8E8E99] shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span className="font-semibold truncate block">{single.title}</span>
                              <span className="text-2xs text-[#8E8E99]">
                                {singleReleaseDate} • {prodName}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-sans tabular-nums text-[#10B981] shrink-0">
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA] tabular-nums">
                    Tracklist Inédito • {totalAlbumTracksCount}/{minTracksRequired} canciones mínimas
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewTrackTitles([...newTrackTitles, `Pista ${newTrackTitles.length + 1}`])}
                    className="text-xs font-semibold text-[#FF2A4B] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Pista
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {/* Display Included Singles First */}
                  {includedSingleIds.map((sId, i) => {
                    const single = playerSongs.find(s => s.id === sId);
                    const singleMonth = TimeSystem.getMonthName(single?.releaseMonth || 1);
                    return (
                      <div key={sId} className="flex items-center justify-between bg-[#1C1C21] px-3 py-2 rounded-[4px] border border-[#FF2A4B]/40 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-sans tabular-nums text-xs text-[#FF2A4B] w-6 font-bold">{i + 1}.</span>
                          <span className="font-semibold text-[#F4F0EA] truncate">{single?.title || sId}</span>
                          <span className="text-2xs text-[#8E8E99] font-sans shrink-0">
                            ({singleMonth} {single?.releaseYear})
                          </span>
                        </div>
                        <span className="text-2xs uppercase font-bold bg-[#FF2A4B]/20 text-[#FF2A4B] px-2 py-0.5 rounded-[4px] border border-[#FF2A4B]/30 shrink-0">
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
                        <span className="font-sans tabular-nums text-xs text-[#8E8E99] w-6 text-right">{trackNumber}.</span>
                        <input
                          type="text"
                          value={track}
                          onChange={e => {
                            const copy = [...newTrackTitles];
                            copy[i] = e.target.value;
                            setNewTrackTitles(copy);
                          }}
                          className="flex-1 bg-[#0B0B0C] border border-[#26262B] focus:border-[#3F3F46] rounded-[4px] px-3 py-1.5 text-xs text-[#F4F0EA] focus:outline-none"
                        />
                        {newTrackTitles.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setNewTrackTitles(newTrackTitles.filter((_, idx) => idx !== i))}
                            className="p-1.5 text-[#8E8E99] hover:text-[#EF4444] cursor-pointer transition-colors"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-[#0B0B0C] p-4 rounded-[4px] border border-[#26262B] space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-semibold text-[#F59E0B]">
                      Producción & Mastering
                    </span>
                    <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">
                      Máx: $60.000
                    </span>
                  </div>
                  <div className="text-sm font-bold font-sans tabular-nums text-[#F59E0B]">
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
                      className="w-full h-2 bg-[#1C1C21] rounded-[2px] appearance-none cursor-pointer border border-[#26262B] accent-[#F59E0B] focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-2xs text-[#8E8E99] font-sans tabular-nums">
                      <span>$3.000</span>
                      <span>$30.000</span>
                      <span>$60.000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B0B0C] p-4 rounded-[4px] border border-[#26262B] space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-semibold text-[#10B981]">
                      Campaña de Lanzamiento
                    </span>
                    <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">
                      Máx: $60.000
                    </span>
                  </div>
                  <div className="text-sm font-bold font-sans tabular-nums text-[#10B981]">
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
                      className="w-full h-2 bg-[#1C1C21] rounded-[2px] appearance-none cursor-pointer border border-[#26262B] accent-[#10B981] focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-2xs text-[#8E8E99] font-sans tabular-nums">
                      <span>$2.000</span>
                      <span>$30.000</span>
                      <span>$60.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- BARRA ÚNICA DE RESUMEN DE COSTOS + LANZAMIENTO DE ÁLBUM --- */}
          <div className="p-4 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap text-xs font-sans tabular-nums">
                <span className="text-[#8E8E99]">
                  Costo Total: <strong className={`text-sm ${isAlbumFundsInsufficient ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>${totalAlbumCost.toLocaleString('es-AR')}</strong>
                </span>
                <span className="text-white/35">•</span>
                <span className="text-[#8E8E99]">
                  Fondos: <strong className={isAlbumFundsInsufficient ? 'text-[#EF4444]' : 'text-[#10B981]'}>${player.stats.funds.toLocaleString('es-AR')}</strong>
                </span>
                <span className="text-white/35">•</span>
                <span className="text-[#8E8E99]">
                  Sesión: <strong className="text-[#FF2A4B]">-35% Energía</strong>
                </span>
                <span className="text-white/35">•</span>
                <span className="text-[#8E8E99]">
                  Pistas: <strong className={isAlbumTracksInsufficient ? 'text-[#EF4444]' : 'text-[#F4F0EA]'}>{totalAlbumTracksCount}/{minTracksRequired}</strong>
                </span>
                {albumProducer && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#141417] border border-[#26262B] text-[#8E8E99]">
                    Productor: +${albumProdFee.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="text-xs">
                {isAlbumFundsInsufficient ? (
                  <span className="text-[#EF4444] flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Fondos insuficientes (faltan ${(totalAlbumCost - player.stats.funds).toLocaleString('es-AR')}).
                  </span>
                ) : isAlbumTracksInsufficient ? (
                  <span className="text-[#EF4444] flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5" /> Faltan canciones: {totalAlbumTracksCount}/{minTracksRequired} mínimas requeridas.
                  </span>
                ) : isAlbumEnergyInsufficient ? (
                  <span className="text-[#F59E0B] flex items-center gap-1.5 font-medium">
                    <Zap className="w-3.5 h-3.5" /> Artista exhausto (requiere al menos 35% de energía).
                  </span>
                ) : (
                  <span className="text-[#10B981] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Proyecto listo para producción y publicación.
                  </span>
                )}
              </div>
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
                  : player.stats.energy < 35
                  ? 'Energía insuficiente (mín. 35%)'
                  : 'Publicar proyecto completo'
              }
              className="kit-btn kit-btn-emerald py-3 px-8 text-sm shrink-0"
            >
              <span className="kit-btn-content">
                <Layers className={`w-4 h-4 ${isAlbumDisabled ? 'text-white/40' : 'text-white'} ${isPublishing ? 'animate-spin' : ''}`} />
                <span className="kit-btn-label">
                  {isPublishing
                    ? 'Publicando y Masterizando...'
                    : isAlbumFundsInsufficient
                    ? `Fondos Insuficientes ($${player.stats.funds.toLocaleString('es-AR')} / $${totalAlbumCost.toLocaleString('es-AR')})`
                    : 'Publicar Proyecto Completo'}
                </span>
              </span>
            </button>
          </div>
        </form>
      )}

      {/* --- TAB 3: DISCOGRAPHY & CATALOG VIEWER --- */}
      {activeTab === 'catalog' && (
        <div className="liquid-glass-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="kit-text-header font-display text-xl tracking-tight text-[#F4F0EA] flex items-center gap-2">
                <Music2 className="w-5 h-5 text-[#00E599]" />
                Discografía & Catálogo Oficial
              </h2>
              <p className="text-xs text-[#8E8E99] mt-1">
                Registro técnico de másters publicados, créditos de consola, unidades de primera semana y reseñas de prensa.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 liquid-glass-pill text-xs font-semibold">
              <button
                onClick={() => setCatalogFilter('all')}
                className={`px-3 py-1.5 rounded-[4px] transition-all cursor-pointer ${
                  catalogFilter === 'all'
                    ? 'bg-[#FF2A4B] text-white font-bold'
                    : 'text-[#DCE2EE] hover:text-white hover:bg-white/10'
                }`}
              >
                Todos ({playerSongs.length + playerAlbums.length})
              </button>
              <button
                onClick={() => setCatalogFilter('albums')}
                className={`px-3 py-1.5 rounded-[4px] transition-all cursor-pointer ${
                  catalogFilter === 'albums'
                    ? 'bg-[#FF2A4B] text-white font-bold'
                    : 'text-[#DCE2EE] hover:text-white hover:bg-white/10'
                }`}
              >
                Álbumes ({playerAlbums.length})
              </button>
              <button
                onClick={() => setCatalogFilter('singles')}
                className={`px-3 py-1.5 rounded-[4px] transition-all cursor-pointer ${
                  catalogFilter === 'singles'
                    ? 'bg-[#FF2A4B] text-white font-bold'
                    : 'text-[#DCE2EE] hover:text-white hover:bg-white/10'
                }`}
              >
                Singles ({playerSongs.length})
              </button>
            </div>
          </div>

          {/* ALBUMS SECTION */}
          {(catalogFilter === 'all' || catalogFilter === 'albums') && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E99] font-sans flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#FF2A4B]" />
                Álbumes & Proyectos de Larga Duración
              </h3>

              {playerAlbums.length === 0 ? (
                <p className="text-xs text-[#8E8E99] italic py-2">
                  No has publicado ningún álbum hasta el momento.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playerAlbums.map((album, aIdx) => {
                    const coverGrad = album.coverGradient || ARTISTIC_COVER_GRADIENTS[aIdx % ARTISTIC_COVER_GRADIENTS.length];
                    const albumReleaseDateStr = formatReleaseDate(album.releaseMonth, album.releaseYear, 'long');
                    const albumReleaseDateFull = formatReleaseDate(album.releaseMonth, album.releaseYear, 'full');
                    const albumProducerName = formatProducerCredit(album.producerId, world.producers, { short: false });
                    const isExpanded = Boolean(expandedAlbumIds[album.id]);

                    return (
                      <div
                        key={album.id}
                        className="bg-[#1C1C21] border border-[#26262B] rounded-[6px] p-5 space-y-4 hover:border-[#3F3F46] transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-20 h-20 rounded-[4px] bg-gradient-to-br ${coverGrad} shrink-0 border border-white/10 flex items-end p-2 text-white text-2xs font-bold uppercase font-sans`}
                          >
                            {album.type}
                          </div>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-[4px] text-2xs font-sans font-bold uppercase bg-[#FF2A4B]/20 border border-[#FF2A4B]/40 text-[#FF2A4B]">
                                {world.genres[album.genreId]?.name || album.genreId}
                              </span>
                              <span className="px-2 py-0.5 rounded-[4px] text-2xs font-semibold bg-[#0B0B0C] border border-[#26262B] text-[#F4F0EA] uppercase">
                                {album.type}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-[#F4F0EA] tracking-tight truncate pt-0.5">
                              {album.title}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap text-xs text-[#8E8E99]">
                              <span className="inline-flex items-center gap-1" title={albumReleaseDateFull}>
                                <Calendar className="w-3.5 h-3.5 text-[#FF2A4B] shrink-0" />
                                <span><strong className="text-[#F4F0EA] font-semibold">{albumReleaseDateStr}</strong></span>
                              </span>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <Sliders className="w-3.5 h-3.5 text-[#8E8E99] shrink-0" />
                                <span>{albumProducerName}</span>
                              </span>
                              <span>•</span>
                              <span className="tabular-nums">{album.songIds.length} Pistas</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-2xs uppercase font-semibold text-[#8E8E99] block">
                              1ª Semana
                            </span>
                            <span className="font-sans tabular-nums font-bold text-sm text-[#10B981]">
                              {album.firstWeekSales.toLocaleString()} u.
                            </span>
                          </div>
                        </div>

                        {/* Metacritic Review Box */}
                        <div className="bg-[#0B0B0C] border border-[#26262B] p-3 rounded-[4px] space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#F4F0EA] flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                              Puntaje Crítico:
                            </span>
                            <span className={`font-sans tabular-nums font-bold text-xs px-2 py-0.5 rounded-[4px] border ${getScoreColor(album.criticalScore)}`}>
                              {album.criticalScore}/100
                            </span>
                          </div>
                          {album.criticalReviewText && (
                            <p className="text-xs text-[#8E8E99] italic leading-relaxed pt-1">
                              "{album.criticalReviewText}"
                            </p>
                          )}
                        </div>

                        {/* Expandable Tracklist Toggle */}
                        {album.songIds && album.songIds.length > 0 && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => toggleAlbumExpanded(album.id)}
                              className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] hover:border-[#3F3F46] text-xs text-[#8E8E99] hover:text-[#F4F0EA] transition-colors cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5 font-medium">
                                <Music2 className="w-3.5 h-3.5 text-[#FF2A4B]" />
                                Tracklist oficial • {album.songIds.length} pistas
                              </span>
                              {isExpanded ? (
                                <span className="flex items-center gap-1 text-xs">
                                  Ocultar <ChevronUp className="w-3.5 h-3.5" />
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs">
                                  Ver pistas <ChevronDown className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {album.songIds.map((sId, trackIdx) => {
                                  const trk = world.songs[sId];
                                  if (!trk) return null;
                                  const trkReleaseMonth = trk.releaseMonth || album.releaseMonth || 1;
                                  const trkReleaseYear = trk.releaseYear || album.releaseYear;
                                  const trkDateStr = formatReleaseDate(trkReleaseMonth, trkReleaseYear, 'short');
                                  const trkProducer = formatProducerCredit(trk.producerId || album.producerId, world.producers, { short: true });

                                  return (
                                    <div
                                      key={sId}
                                      className="flex items-center justify-between p-2 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] text-xs"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="font-sans tabular-nums text-2xs text-[#8E8E99] w-4">{trackIdx + 1}.</span>
                                        <span className="font-semibold text-[#F4F0EA] truncate max-w-[150px] sm:max-w-[200px]" title={trk.title}>
                                          {trk.title}
                                        </span>
                                        {trk.isSingle && (
                                          <span className="text-2xs uppercase font-bold bg-[#FF2A4B]/20 text-[#FF2A4B] px-1.5 py-0.2 rounded-[4px] border border-[#FF2A4B]/30">
                                            Single
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-[#8E8E99] font-sans tabular-nums shrink-0">
                                        <span>{trkDateStr}</span>
                                        <span>{trkProducer}</span>
                                        <span className="text-[#10B981] font-semibold">
                                          Q: {trk.quality}%
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SINGLES SECTION */}
          {(catalogFilter === 'all' || catalogFilter === 'singles') && (
            <div className="space-y-4 pt-4 border-t border-[#26262B]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E99] flex items-center gap-1.5">
                <Disc3 className="w-4 h-4 text-[#FF2A4B]" />
                Sencillos & Pistas Individuales
              </h3>

              {playerSongs.length === 0 ? (
                <p className="text-xs text-[#8E8E99] italic py-2">
                  No tienes canciones grabadas aún.
                </p>
              ) : (
                <div className="space-y-3">
                  {playerSongs.map(song => {
                    const subgenre = song.subGenreIds && song.subGenreIds.length > 0 ? SUBGENRE_DETAILS[song.subGenreIds[0]] : undefined;
                    const isHit = (song.peakPosition?.Global ?? 99) <= 10;
                    const releaseDateStr = formatReleaseDate(song.releaseMonth, song.releaseYear, 'long');
                    const releaseDateFull = formatReleaseDate(song.releaseMonth, song.releaseYear, 'full');
                    const producerName = formatProducerCredit(song.producerId, world.producers, { short: false });
                    const albumParent = song.albumId ? world.albums?.[song.albumId] : undefined;

                    return (
                      <div
                        key={song.id}
                        className="bg-[#1C1C21] border border-[#26262B] p-4 rounded-[6px] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#3F3F46] transition-all"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-[#F4F0EA]">
                              {song.title}
                            </h4>
                            <span className="text-2xs font-sans font-bold px-2 py-0.5 rounded-[4px] bg-[#FF2A4B]/20 border border-[#FF2A4B]/40 text-[#FF2A4B]">
                              {world.genres[song.genreId]?.name || song.genreId}
                            </span>
                            {subgenre && (
                              <span className="text-2xs font-sans font-medium bg-[#0B0B0C] border border-[#26262B] text-[#8E8E99] px-2 py-0.5 rounded-[4px]">
                                {subgenre.name}
                              </span>
                            )}
                            {albumParent ? (
                              <span className="text-2xs font-sans font-medium bg-[#0B0B0C] border border-[#FF2A4B]/40 text-[#FF2A4B] px-2 py-0.5 rounded-[4px] flex items-center gap-1" title={`Pertenece al álbum "${albumParent.title}"`}>
                                <Layers className="w-2.5 h-2.5 text-[#FF2A4B]" />
                                Álbum: {albumParent.title}
                              </span>
                            ) : song.isSingle ? (
                              <span className="text-2xs font-sans font-medium bg-[#0B0B0C] border border-[#26262B] text-[#F4F0EA] px-2 py-0.5 rounded-[4px]">
                                Single Oficial
                              </span>
                            ) : null}
                            {song.musicVideo && (
                              <span className="text-2xs font-sans font-bold bg-[#0B0B0C] text-[#38BDF8] border border-[#38BDF8]/40 px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                                <Video className="w-2.5 h-2.5 text-[#38BDF8]" />
                                Videoclip
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

                          {/* Release Date and Producer Information */}
                          <div className="flex items-center gap-2 flex-wrap text-xs text-[#8E8E99]">
                            <span className="inline-flex items-center gap-1" title={releaseDateFull}>
                              <Calendar className="w-3.5 h-3.5 text-[#FF2A4B] shrink-0" />
                              <span>Lanzamiento: <strong className="text-[#F4F0EA] font-semibold">{releaseDateStr}</strong></span>
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Sliders className="w-3.5 h-3.5 text-[#8E8E99] shrink-0" />
                              <span>{producerName}</span>
                            </span>
                            <span>•</span>
                            <span className="tabular-nums">
                              Calidad: <strong className="text-[#10B981]">{song.quality}%</strong> • Comercial: <strong className="text-[#F4F0EA]">{song.commercialAppeal}%</strong> • Originalidad: <strong className="text-[#F59E0B]">{song.originality}%</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-xs font-sans tabular-nums shrink-0">
                          <div>
                            <span className="text-[#8E8E99] block text-2xs uppercase">Peak Global</span>
                            <span className={`font-bold text-sm ${song.peakPosition?.Global === 1 ? 'text-[#F59E0B] font-extrabold' : song.peakPosition?.Global && song.peakPosition.Global <= 10 ? 'text-[#FF2A4B]' : 'text-[#F4F0EA]'}`}>
                              {song.peakPosition?.Global ? `#${song.peakPosition.Global}` : '—'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#8E8E99] block text-2xs uppercase">Streams / Mes</span>
                            <span className="font-bold text-sm text-[#10B981]">
                              {song.streamsLastMonth.toLocaleString()}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#8E8E99] block text-2xs uppercase">Total Acumulado</span>
                            <span className="font-bold text-sm text-[#F4F0EA]">
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
