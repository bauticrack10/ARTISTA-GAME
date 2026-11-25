import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
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
import { FeatArtistSelector } from './FeatArtistSelector';
import { getArtistDerivedStyles, SUBGENRE_DETAILS } from '../data/genres';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';
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
  ChevronUp,
  Users,
  Radio,
  Handshake,
  Check
} from 'lucide-react';
import { TimeSystem } from '../systems/TimeSystem';
import {
  RELEASE_BADGES,
  ARTISTIC_COVER_GRADIENTS
} from '../utils/themeColors';
import { playSound } from '../utils/audioSystem';
import { showToast } from '../utils/toastBus';
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
    description:
      'Planos secuencia cinematográficos, iluminación con lentes anamórficas de 35mm, narrativa dramática y etalonaje de película de autor.',
    icon: Clapperboard,
    gradient: 'from-cyan-500/20 to-blue-600/20',
    borderHover: 'hover:border-[#3F3F46]'
  },
  {
    id: 'VHS Retro Synthwave',
    name: 'VHS Retro Synthwave',
    tag: 'Textura Analógica 80s',
    description:
      'Luces de neón, escaneo analógico en cinta VHS, destellos de cromo y atmósfera de club nocturno retro.',
    icon: Tv,
    gradient: 'from-amber-500/20 to-rose-600/20',
    borderHover: 'hover:border-[#3F3F46]'
  },
  {
    id: 'Animación 3D Futurista',
    name: 'Animación 3D Futurista',
    tag: 'CGI Unreal Engine',
    description:
      'Avatares 3D hiperrealistas, efectos visuales de partículas, escenografía distópica y estética de videojuego AAA.',
    icon: Box,
    gradient: 'from-cyan-500/20 to-emerald-600/20',
    borderHover: 'hover:border-[#3F3F46]'
  },
  {
    id: 'Urbano Callejero DIY',
    name: 'Urbano Callejero DIY',
    tag: 'Guerrilla & Fisheye',
    description:
      'Grabación en formato guerrilla urbana con lente Fisheye, tomas nocturnas con flash crudo y dinamismo callejero underground.',
    icon: Camera,
    gradient: 'from-amber-500/20 to-orange-600/20',
    borderHover: 'hover:border-[#3F3F46]'
  },
  {
    id: 'Psicodélico & Arte Conceptual',
    name: 'Psicodélico & Arte Conceptual',
    tag: 'Vanguardia & Surrealismo',
    description:
      'Simbolismos oníricos, vestuarios de alta costura conceptual, distorsiones visuales hipnóticas y dirección artística de galería.',
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
    description:
      'Director galardonado internacionalmente con cámaras RED/ARRI, efectos especiales y distribución global masiva.',
    hypeBoost: 50,
    velocityBoost: 70,
    viralBoost: 35,
    estimatedViews: '500k – 5M+ vistas',
    icon: Crown
  }
];

export const CAREER_STAGE_RANK: Record<CareerStage, number> = {
  Underground: 0,
  Emerging: 1,
  Declining: 1,
  Breakout: 2,
  Comeback: 2,
  Established: 3,
  Veteran: 3,
  Mainstream: 4,
  Superstar: 5,
  Legend: 6,
  Retired: 0
};

export interface ProducerLockInfo {
  isUnlocked: boolean;
  lockReason?: string;
  minPopularity: number;
  minCareerStage: CareerStage;
}

export const getProducerLockStatus = (producer: Producer, player: Artist): ProducerLockInfo => {
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
  onNavigate?: (tab: string) => void;
  onOpenCollabModal?: (artistId?: string) => void;
  studioTierInfo?: { tier: number; maxTier?: number; label?: string; qualityBonus?: number };
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
  }) => Song | void;
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
  }) => Album | void;
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

const ALBUM_BUDGET_PRESETS = [
  { id: 'indie', label: 'Indie', prod: 4000, mktg: 2000 },
  { id: 'nacional', label: 'Nacional', prod: 12000, mktg: 10000 },
  { id: 'global', label: 'Global', prod: 28000, mktg: 25000 },
  { id: 'blockbuster', label: 'Blockbuster', prod: 50000, mktg: 50000 }
] as const;

interface StudioDraftState {
  activeTab: 'single' | 'album' | 'catalog';
  singleTitle: string;
  selectedSubgenreId: string;
  featuredArtistId: string;
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
        featuredArtistId: parsed.featuredArtistId ?? '',
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
        albumProdBudget: typeof parsed.albumProdBudget === 'number' ? parsed.albumProdBudget : 4000,
        albumMktBudget: typeof parsed.albumMktBudget === 'number' ? parsed.albumMktBudget : 2000,
        includedSingleIds: Array.isArray(parsed.includedSingleIds) ? parsed.includedSingleIds : [],
        newTrackTitles:
          Array.isArray(parsed.newTrackTitles) && parsed.newTrackTitles.length > 0
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
    featuredArtistId: '',
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
    albumProdBudget: 4000,
    albumMktBudget: 2000,
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
  onNavigate,
  onOpenCollabModal,
  studioTierInfo,
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
  useScrollToTop([activeTab, catalogFilter]);

  const prevInitialTabRef = useRef(initialTab);
  useEffect(() => {
    if (initialTab && initialTab !== prevInitialTabRef.current) {
      setActiveTab(initialTab);
      prevInitialTabRef.current = initialTab;
    }
  }, [initialTab]);

  // Singles released this year & this month
  const MAX_SINGLES = GameEngine.MAX_SINGLES_PER_YEAR;
  const playerSongs = (Object.values(world?.songs || {}) as Song[]).filter((s) => s.artistId === player?.id);
  const playerSingles = playerSongs.filter((s) => s.isSingle);
  const singlesThisYear = playerSingles.filter((s) => s.releaseYear === world?.currentYear).length;
  const singlesThisMonth = playerSingles.filter(
    (s) => s.releaseYear === world?.currentYear && s.releaseMonth === world?.currentMonth
  ).length;
  const isSinglesLimitReached = singlesThisYear >= MAX_SINGLES;
  const isMonthlySingleLimitReached = singlesThisMonth >= 1;

  // Studio Tier, Label Marketing & Active Synergy
  const computedStudioStats = useMemo(() => {
    const owned = new Set(player.lifestyleUpgrades || []);
    const studioItems = LIFESTYLE_ITEMS.filter(
      (item) => (item.category === 'home_studio' || item.category === 'studio') && owned.has(item.id)
    );
    const qualityFromStudio = studioItems.reduce((acc, item) => acc + (item.effects.qualityBonus || 0), 0);
    const derivedTier =
      studioTierInfo?.tier ??
      (studioItems.length >= 9 || qualityFromStudio >= 22
        ? 5
        : studioItems.length >= 6 || qualityFromStudio >= 14
        ? 4
        : studioItems.length >= 3 || qualityFromStudio >= 7
        ? 3
        : studioItems.length >= 1
        ? 2
        : 1);
    const tierNames = [
      'Home Studio Básico',
      'Home Studio Equipado',
      'Cabina Indie',
      'Estudio Profesional',
      'Estudio Master AAA'
    ];
    return {
      tier: derivedTier,
      maxTier: studioTierInfo?.maxTier ?? 5,
      label: studioTierInfo?.label || tierNames[Math.min(4, Math.max(0, derivedTier - 1))],
      studioQualityBonus: studioTierInfo?.qualityBonus ?? qualityFromStudio
    };
  }, [player.lifestyleUpgrades, studioTierInfo]);

  const labelMarketingContribution = player.activeContract?.marketingBudgetPerRelease ?? 0;
  const activeSynergyQuality =
    (player.activeCreativeBuffs?.nextTrackQuality ?? 0) + computedStudioStats.studioQualityBonus;

  // Active collaboration pacts
  const activeCollabPacts = useMemo(() => {
    return (world?.activeCollabPacts || []).filter((p) => p && p.status === 'active');
  }, [world?.activeCollabPacts]);

  // Scene artists eligible/available for feat selection
  const sceneArtists = useMemo(() => {
    return (Object.values(world?.artists || {}) as Artist[])
      .filter((a) => a.id !== player.id && !a.isRetired)
      .sort((a, b) => {
        const affA = player.relationships?.[a.id]?.affinity ?? 0;
        const affB = player.relationships?.[b.id]?.affinity ?? 0;
        if (affB !== affA) return affB - affA;
        return (b.stats?.popularity ?? 0) - (a.stats?.popularity ?? 0);
      });
  }, [world?.artists, player.id, player.relationships]);

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
    setExpandedAlbumIds((prev) => ({
      ...prev,
      [albumId]: !prev[albumId]
    }));
  };

  // Single State
  const [singleTitle, setSingleTitle] = useState<string>(initialDraft.singleTitle);
  const [selectedSubgenreId, setSelectedSubgenreId] = useState<string>(
    initialDraft.selectedSubgenreId || defaultSubgenreId
  );
  const [featuredArtistId, setFeaturedArtistId] = useState<string>(initialDraft.featuredArtistId || '');
  const [singleProducer, setSingleProducer] = useState<string>(initialDraft.singleProducer);
  const [singleProdBudget, setSingleProdBudget] = useState<number>(initialDraft.singleProdBudget);
  const [singleMktBudget, setSingleMktBudget] = useState<number>(initialDraft.singleMktBudget);

  // Music Video Production State
  const [hasMusicVideo, setHasMusicVideo] = useState<boolean>(initialDraft.hasMusicVideo);
  const [selectedVideoConcept, setSelectedVideoConcept] = useState<MusicVideoConcept>(
    initialDraft.selectedVideoConcept
  );
  const [selectedDirectorTier, setSelectedDirectorTier] = useState<MusicVideoDirectorTier>(
    initialDraft.selectedDirectorTier
  );

  const currentDirectorTier = DIRECTOR_TIERS.find((t) => t.id === selectedDirectorTier) || DIRECTOR_TIERS[1];
  const videoCost = hasMusicVideo ? currentDirectorTier.cost : 0;
  const singleProdFee =
    singleProducer && world?.producers ? world.producers[singleProducer]?.costPerTrack || 0 : 0;
  const totalSingleCost = singleProdBudget + singleMktBudget + singleProdFee + videoCost;
  const isFundsInsufficient = totalSingleCost > player.stats.funds;

  // Album State
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
  const availablePreviousSingles = playerSongs.filter((s) => s.isSingle && !s.albumId);
  const [includedSingleIds, setIncludedSingleIds] = useState<string[]>(
    initialDraft.includedSingleIds.filter((id) => availablePreviousSingles.some((s) => s.id === id))
  );

  // New Tracks for the album
  const [newTrackTitles, setNewTrackTitles] = useState<string[]>(initialDraft.newTrackTitles);

  // Sync all Studio draft fields to persistent store
  useEffect(() => {
    saveStudioDraft(player.id, {
      activeTab,
      singleTitle,
      selectedSubgenreId,
      featuredArtistId,
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
    featuredArtistId,
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

  const playerAlbums = (Object.values(world.albums) as Album[]).filter((a) => a.artistId === player.id);

  const getMinTracksForType = (type: Album['type']): number => {
    switch (type) {
      case 'ep':
        return 4;
      case 'mixtape':
        return 6;
      case 'album':
        return 6;
      case 'deluxe':
        return 10;
      case 'collab_album':
        return 6;
      default:
        return 6;
    }
  };

  const validNewTracksCount = newTrackTitles.filter((t) => t.trim().length > 0).length;
  const totalAlbumTracksCount = includedSingleIds.length + validNewTracksCount;
  const minTracksRequired = getMinTracksForType(albumType);

  const albumProdFee = albumProducer
    ? (world.producers[albumProducer]?.costPerTrack || 0) * Math.min(validNewTracksCount, 6)
    : 0;
  const totalAlbumCost = albumProdBudget + albumMktBudget + albumProdFee;
  const isAlbumFundsInsufficient = totalAlbumCost > player.stats.funds;
  const isAlbumTracksInsufficient = totalAlbumTracksCount < minTracksRequired;
  const isAlbumEnergyInsufficient = player.stats.energy < 35;
  const isAlbumDisabled = isAlbumTracksInsufficient || isAlbumFundsInsufficient || isAlbumEnergyInsufficient;

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
      setIncludedSingleIds(includedSingleIds.filter((s) => s !== id));
    } else {
      setIncludedSingleIds([...includedSingleIds, id]);
    }
  };

  const resetSingleDraft = () => {
    setSingleTitle('');
    setFeaturedArtistId('');
    setHasMusicVideo(false);
    setSingleProdBudget(0);
    setSingleMktBudget(0);
    setSingleProducer('');
  };

  const resetAlbumDraft = () => {
    setAlbumTitle('');
    setIncludedSingleIds([]);
    setAlbumProducer('');
    setAlbumProdBudget(4000);
    setAlbumMktBudget(2000);
    setNewTrackTitles([...DEFAULT_ALBUM_TRACKS]);
  };

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
      showToast(
        `Has alcanzado el límite anual de lanzamientos (${MAX_SINGLES} singles en ${world.currentYear}). Avanza al próximo año o graba un Álbum Completo.`,
        'warning'
      );
      return;
    }

    if (isMonthlySingleLimitReached) {
      showToast(
        'Ya lanzaste un single este mes. Avanza +1M en la barra superior para publicar otro sencillo.',
        'warning'
      );
      return;
    }

    if (totalSingleCost > player.stats.funds) {
      showToast(
        `Fondos insuficientes. Necesitas $${totalSingleCost.toLocaleString('es-AR')} y tienes $${player.stats.funds.toLocaleString('es-AR')}.`,
        'error'
      );
      return;
    }

    if (player.stats.energy < 15) {
      showToast(
        'Tu artista está demasiado agotado para grabar (energía menor a 15%). ¡Toma un descanso primero!',
        'warning'
      );
      return;
    }

    if (singleProducer) {
      const prodObj = world.producers[singleProducer];
      if (prodObj) {
        const check = getProducerLockStatus(prodObj, player);
        if (!check.isUnlocked) {
          showToast(
            `No cumples los requisitos para contratar a ${prodObj.name}: ${check.lockReason}`,
            'warning'
          );
          return;
        }
      }
    }

    try {
      setIsPublishing(true);

      const prodObj = singleProducer ? world.producers[singleProducer] : undefined;
      const subObj = selectedSubgenreId ? SUBGENRE_DETAILS[selectedSubgenreId] : undefined;
      const genreName = world.genres[styleDerivation.primaryGenreId]?.name || styleDerivation.primaryGenreId;
      const featArtist = featuredArtistId ? world.artists[featuredArtistId] : undefined;

      const createdSong = onReleaseSong({
        title: finalTitle,
        genreId: styleDerivation.primaryGenreId,
        subGenreIds: selectedSubgenreId ? [selectedSubgenreId] : [],
        featuredArtistIds: featuredArtistId ? [featuredArtistId] : [],
        producerId: singleProducer || undefined,
        budgetProduction: singleProdBudget,
        budgetMarketing: singleMktBudget,
        musicVideo: hasMusicVideo
          ? {
              concept: selectedVideoConcept,
              budget: videoCost,
              directorTier: selectedDirectorTier
            }
          : undefined
      }) as Song | undefined;

      const songQuality = createdSong?.quality ?? Math.min(99, 55 + activeSynergyQuality);
      const songCritScore = Math.min(98, Math.max(40, Math.round(songQuality * 0.85 + (createdSong?.originality ?? 50) * 0.15)));
      const estimatedFirstWeek = Math.max(
        400,
        Math.round(
          (player.stats.monthlyListeners || 200) * 0.35 +
            (singleMktBudget + labelMarketingContribution) * 0.25 +
            songQuality * 18
        )
      );

      const impactBreakdown: ReleaseConfirmationData['impactBreakdown'] = [
        {
          label: 'Estudio',
          value: `Tier ${computedStudioStats.tier}/${computedStudioStats.maxTier}`,
          tone: 'neutral'
        },
        {
          label: 'Calidad Final',
          value: `${songQuality}%`,
          tone: songQuality >= 80 ? 'gold' : 'positive'
        }
      ];
      if (labelMarketingContribution > 0) {
        impactBreakdown.push({
          label: 'Mktg del Sello',
          value: `+$${labelMarketingContribution.toLocaleString('es-AR')}`,
          tone: 'positive'
        });
      }
      if (activeSynergyQuality > 0) {
        impactBreakdown.push({
          label: 'Sinergia Activa',
          value: `+${activeSynergyQuality} Calidad`,
          tone: 'positive'
        });
      }

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
        featuredArtistNames: featArtist ? [featArtist.name] : undefined,
        producerName: prodObj?.name || undefined,
        musicVideo: hasMusicVideo
          ? {
              concept: selectedVideoConcept,
              budget: videoCost,
              directorTier: selectedDirectorTier
            }
          : undefined,
        releaseYear: world.currentYear,
        releaseMonth: world.currentMonth,
        totalBudget: totalSingleCost,
        budgetBreakdown: {
          production: singleProdBudget,
          marketing: singleMktBudget,
          producerFee: singleProdFee,
          videoCost: videoCost
        },
        criticalScore: songCritScore,
        criticalReviewText:
          songCritScore >= 82
            ? 'Producción nítida y gancho inmediato con alto potencial de rotación.'
            : songCritScore >= 65
            ? 'Corte sólido que suma consistencia al catálogo de la era actual.'
            : 'Maqueta cruda de circuito independiente con margen para pulir en mezcla.',
        firstWeekSales: estimatedFirstWeek,
        impactBreakdown
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
      showToast(`Error en el lanzamiento: ${errMsg}`, 'error');
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
      showToast(
        `Un proyecto en formato ${albumType.toUpperCase()} requiere al menos ${minTracksRequired} canciones. Tienes ${totalAlbumTracksCount}.`,
        'warning'
      );
      return;
    }

    if (albumProducer) {
      const prodObj = world.producers[albumProducer];
      if (prodObj) {
        const check = getProducerLockStatus(prodObj, player);
        if (!check.isUnlocked) {
          showToast(
            `No cumples los requisitos para contratar a ${prodObj.name}: ${check.lockReason}`,
            'warning'
          );
          return;
        }
      }
    }

    const validNewTracks = newTrackTitles.filter((t) => t.trim().length > 0);
    const prodFee = albumProducer
      ? (world.producers[albumProducer]?.costPerTrack || 0) * Math.min(validNewTracks.length, 6)
      : 0;
    const totalCost = albumProdBudget + albumMktBudget + prodFee;

    if (totalCost > player.stats.funds) {
      showToast(
        `Fondos insuficientes. Necesitas $${totalCost.toLocaleString('es-AR')} y tienes $${player.stats.funds.toLocaleString('es-AR')}.`,
        'error'
      );
      return;
    }
    if (player.stats.energy < 35) {
      showToast(
        'Tu artista está exhausto. Producir y masterizar un proyecto completo requiere al menos 35% de energía.',
        'warning'
      );
      return;
    }

    try {
      setIsPublishing(true);

      const prodObj = albumProducer ? world.producers[albumProducer] : undefined;
      const subObj = selectedAlbumSubgenreId ? SUBGENRE_DETAILS[selectedAlbumSubgenreId] : undefined;
      const genreName = world.genres[styleDerivation.primaryGenreId]?.name || styleDerivation.primaryGenreId;

      const includedSingles = includedSingleIds.map((id) => playerSongs.find((s) => s.id === id)?.title || id);
      const allTrackTitles = [...includedSingles, ...validNewTracks];

      const createdAlbum = onReleaseAlbum({
        title: finalTitle,
        type: albumType,
        genreId: styleDerivation.primaryGenreId,
        subGenreIds: selectedAlbumSubgenreId ? [selectedAlbumSubgenreId] : [],
        newTrackTitles: validNewTracks,
        includedSingleIds,
        budgetProduction: albumProdBudget,
        budgetMarketing: albumMktBudget,
        producerId: albumProducer || undefined
      }) as Album | undefined;

      const impactBreakdown: ReleaseConfirmationData['impactBreakdown'] = [
        {
          label: 'Estudio',
          value: `Tier ${computedStudioStats.tier}/${computedStudioStats.maxTier}`,
          tone: 'neutral'
        },
        {
          label: 'Repertorio',
          value: `${allTrackTitles.length} Pistas`,
          tone: 'positive'
        }
      ];
      if (labelMarketingContribution > 0) {
        impactBreakdown.push({
          label: 'Mktg del Sello',
          value: `+$${labelMarketingContribution.toLocaleString('es-AR')}`,
          tone: 'positive'
        });
      }
      if (activeSynergyQuality > 0) {
        impactBreakdown.push({
          label: 'Sinergia Activa',
          value: `+${activeSynergyQuality} Calidad`,
          tone: 'positive'
        });
      }

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
        },
        criticalScore: createdAlbum?.criticalScore,
        criticalReviewText: createdAlbum?.criticalReviewText,
        firstWeekSales: createdAlbum?.firstWeekSales,
        impactBreakdown
      };

      resetAlbumDraft();
      playSound('release');
      setConfirmedRelease(releaseData);
      setNotification(
        `¡El proyecto "${finalTitle}" ha sido publicado en todas las plataformas con gran repercusión crítica!`
      );
      setTimeout(() => setNotification(null), 6000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error al procesar el lanzamiento del álbum.';
      showToast(`Error en el lanzamiento: ${errMsg}`, 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/40';
    if (score >= 70) return 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40';
    return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40';
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-[#F4F0EA]">
      {/* --- ENCABEZADO DEL ESTUDIO --- */}
      <div className="surface-1 bg-[#111114] border border-[#242429] rounded-[6px] p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-[4px] text-2xs font-sans font-bold uppercase tracking-wider surface-2 bg-[#18181C] text-[#FF4F00] border border-[#FF4F00]/35">
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

          {/* Selector de Pestañas */}
          <div className="flex items-center gap-1.5 p-1 surface-2 bg-[#18181C] border border-[#242429] rounded-[4px] text-xs sm:text-sm font-semibold shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('single');
                onTabChange?.('single');
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'single'
                  ? 'bg-[#FF4F00] text-white font-bold'
                  : 'text-[#DCE2EE] hover:text-white hover:bg-white/5 bg-transparent'
              }`}
            >
              <Music2 className="w-4 h-4 shrink-0" />
              <span>Grabar Single</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('album');
                onTabChange?.('album');
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'album'
                  ? 'bg-[#FF4F00] text-white font-bold'
                  : 'text-[#DCE2EE] hover:text-white hover:bg-white/5 bg-transparent'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Grabar Álbum / EP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('catalog');
                onTabChange?.('catalog');
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[4px] transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'catalog'
                  ? 'bg-[#FF4F00] text-white font-bold'
                  : 'text-[#DCE2EE] hover:text-white hover:bg-white/5 bg-transparent'
              }`}
            >
              <Disc3 className="w-4 h-4 shrink-0" />
              <span>Mi Catálogo ({playerSingles.length + playerAlbums.length})</span>
            </button>
          </div>
        </div>

        {/* Fila única compacta de indicadores de sesión + Tier / Sello / Sinergia */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap pt-2 border-t border-[#242429] text-xs font-sans tabular-nums">
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Estudio:</span>
            <strong className="text-[#FF4F00]">
              Tier {computedStudioStats.tier}/{computedStudioStats.maxTier}
            </strong>
            <span className="text-[#8E8E99] hidden sm:inline">({computedStudioStats.label})</span>
          </div>
          <span className="text-[#3F3F46] hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Mktg del Sello:</span>
            <strong className="text-[#34D399]">+${labelMarketingContribution.toLocaleString('es-AR')}</strong>
          </div>
          <span className="text-[#3F3F46] hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Sinergia Activa:</span>
            <strong className="text-[#38BDF8]">+{activeSynergyQuality} Calidad</strong>
          </div>
          <span className="text-[#3F3F46] hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Calidad Media:</span>
            <strong className="text-[#34D399]">{avgQuality}%</strong>
          </div>
          <span className="text-[#3F3F46] hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Cupo Anual Singles:</span>
            <strong className={isSinglesLimitReached ? 'text-[#EF4444]' : 'text-[#F4F0EA]'}>
              {singlesThisYear}/{MAX_SINGLES}
            </strong>
          </div>
          <span className="text-[#3F3F46] hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8E99]">Energía:</span>
            <strong
              className={
                player.stats.energy >= 35
                  ? 'text-[#34D399]'
                  : player.stats.energy >= 15
                  ? 'text-[#F59E0B]'
                  : 'text-[#EF4444]'
              }
            >
              {player.stats.energy}%
            </strong>
          </div>
        </div>
      </div>

      {/* --- NOTIFICATION BANNER --- */}
      {notification && (
        <div className="surface-2 bg-[#18181C] border border-[#34D399]/40 text-[#34D399] p-4 rounded-[4px] flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* --- TAB 1: SINGLE CREATION --- */}
      {activeTab === 'single' && (
        <form onSubmit={handleCreateSingle} className="surface-1 bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
            <div>
              <h2 className="font-display font-extrabold text-lg tracking-tight text-[#F4F0EA] flex items-center gap-2 uppercase">
                <Mic className="w-5 h-5 text-[#34D399]" />
                Componer Nuevo Single
              </h2>
              <p className="text-xs text-[#8E8E99] mt-0.5">
                Grabá un corte adelanto para medir rotación en listas editoriales y pauta radial antes de cerrar un LP.
              </p>
            </div>

            {onOpenCollabModal && (
              <button
                type="button"
                onClick={() => onOpenCollabModal(featuredArtistId || undefined)}
                className="px-3.5 py-2 rounded-[4px] surface-2 bg-[#18181C] border border-[#FF4F00]/45 hover:border-[#FF4F00] text-[#F4F0EA] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Handshake className="w-4 h-4 text-[#FF4F00]" />
                <span>Negociar Colaboración / Proyecto Conjunto</span>
              </button>
            )}
          </div>

          {/* Banner de Pactos Activos */}
          {activeCollabPacts.length > 0 && (
            <div className="surface-2 bg-[#18181C] border border-[#34D399]/40 rounded-[4px] p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#34D399] uppercase tracking-wider">
                <Handshake className="w-4 h-4" />
                <span>Pactos de Estudio Activos ({activeCollabPacts.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeCollabPacts.map((pact) => {
                  const targetArtist = pact.targetArtistId ? world.artists[pact.targetArtistId] : undefined;
                  const targetProducer = pact.targetProducerId ? world.producers[pact.targetProducerId] : undefined;
                  return (
                    <div
                      key={pact.id}
                      className="px-3 py-1.5 rounded-[4px] bg-[#111114] border border-[#242429] text-xs flex items-center gap-2"
                    >
                      {targetArtist && (
                        <span className="text-[#F4F0EA] font-semibold">
                          Feat acordado con <strong className="text-[#34D399]">{targetArtist.name}</strong>
                        </span>
                      )}
                      {targetProducer && (
                        <span className="text-[#F4F0EA] font-semibold">
                          Productor <strong className="text-[#38BDF8]">{targetProducer.name}</strong>
                          {pact.producerDiscountPct ? ` (-${pact.producerDiscountPct}% tarifa)` : ''}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Aviso de límite anual o mensual */}
          {isSinglesLimitReached && (
            <div className="surface-2 bg-[#18181C] border border-[#F59E0B]/40 text-[#F59E0B] p-4 rounded-[4px] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                Límite anual de singles alcanzado • {MAX_SINGLES}/{MAX_SINGLES}
              </div>
              <p className="text-[#8E8E99] leading-relaxed">
                El cupo de sencillos se reinicia cada año. Avanza de mes/año o graba un{' '}
                <strong className="text-[#F4F0EA]">Álbum / EP Completo</strong> en la pestaña contigua.
              </p>
            </div>
          )}

          {!isSinglesLimitReached && isMonthlySingleLimitReached && (
            <div className="surface-2 bg-[#18181C] border border-[#EF4444]/45 text-[#EF4444] p-4 rounded-[4px] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Lock className="w-4 h-4" />
                Single mensual ya publicado ({TimeSystem.getMonthName(world.currentMonth)} {world.currentYear})
              </div>
              <p className="text-[#8E8E99] leading-relaxed">
                Solo podés estrenar 1 single por mes para no saturar tu rotación. Avanzá <strong className="text-[#F4F0EA]">+1M</strong> en la barra superior para habilitar el próximo lanzamiento.
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
                    className="text-xs text-[#FF4F00] hover:underline font-semibold cursor-pointer transition-colors"
                  >
                    Sugerir Título
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ej: Medianoche en Tokio, Barrio Fino..."
                  value={singleTitle}
                  onChange={(e) => setSingleTitle(e.target.value)}
                  className="w-full surface-2 bg-[#18181C] border border-[#242429] focus:border-[#FF4F00] rounded-[4px] px-3.5 py-2.5 text-sm text-[#F4F0EA] placeholder:text-[#52525B] focus:outline-none transition-all"
                />
              </div>

              {/* Sub-style Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA] mb-2">
                  Dirección Sónica de la Era • {styleDerivation.primaryGenreName?.trim() || ''}
                </label>
                <div className="space-y-2">
                  {styleDerivation.availableStyles.map((style) => {
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
                            ? 'opacity-60 surface-2 bg-[#18181C] border-[#242429] cursor-not-allowed'
                            : isSelected
                            ? 'surface-2 bg-[#18181C] text-[#F4F0EA] border-[#FF4F00] cursor-pointer'
                            : 'surface-2 bg-[#18181C] border-[#242429] hover:border-[#3F3F46] text-[#F4F0EA] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-[#FF4F00]' : 'text-[#F4F0EA]'}`}>
                            {style.name}
                          </span>
                          {style.isUnlocked ? (
                            <span
                              className={`text-2xs font-sans font-bold px-2 py-0.5 rounded-[4px] ${
                                isSelected
                                  ? 'bg-[#FF4F00]/20 text-[#FF4F00] border border-[#FF4F00]/40'
                                  : 'bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399]'
                              }`}
                            >
                              Disponible
                            </span>
                          ) : (
                            <span className="text-2xs font-sans font-semibold px-2 py-0.5 rounded-[4px] bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] flex items-center gap-1">
                              <Lock className="w-3 h-3" /> {style.lockReason}
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-1 leading-snug text-[#8E8E99]">{style.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Feat Artist, Producer & Budgets */}
            <div className="space-y-5">
              {/* Invitar Artista (Feat) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA]">
                    Invitar Artista (Feat Opcional)
                  </label>
                  {featuredArtistId && (
                    <button
                      type="button"
                      onClick={() => setFeaturedArtistId('')}
                      className="text-xs text-[#8E8E99] hover:text-[#EF4444] cursor-pointer"
                    >
                      Quitar invitado
                    </button>
                  )}
                </div>
                <FeatArtistSelector
                  selectedArtistId={featuredArtistId}
                  onChange={setFeaturedArtistId}
                  sceneArtists={sceneArtists}
                  player={player}
                  world={world}
                  onOpenAdvancedCollab={onOpenCollabModal}
                />
              </div>

              {/* Producer */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA] mb-2">
                  Productor Musical / Beatmaker
                </label>
                <select
                  value={singleProducer}
                  onChange={(e) => setSingleProducer(e.target.value)}
                  className="w-full surface-2 bg-[#18181C] border border-[#242429] focus:border-[#FF4F00] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F4F0EA] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">Autoproducción en Home Studio • $0</option>
                  {(Object.values(world.producers) as Producer[]).map((p) => {
                    const lockInfo = getProducerLockStatus(p, player);
                    return (
                      <option key={p.id} value={p.id} disabled={!lockInfo.isUnlocked} className="bg-[#111114] text-[#F4F0EA]">
                        {lockInfo.isUnlocked ? '' : '[Bloqueado] '}
                        {p.name} • +{p.qualityBoost}% Calidad • ${p.costPerTrack.toLocaleString('es-AR')}{' '}
                        {!lockInfo.isUnlocked ? `[Bloqueado: ${lockInfo.lockReason}]` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Budgets Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="surface-2 bg-[#18181C] p-4 rounded-[4px] border border-[#242429] space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-semibold text-[#F59E0B]">Producción & Mezcla</span>
                    <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">Máx: $25.000</span>
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
                      onChange={(e) => setSingleProdBudget(Number(e.target.value))}
                      className="w-full h-2 bg-[#111114] rounded-[2px] appearance-none cursor-pointer border border-[#242429] accent-[#F59E0B] focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-2xs text-[#8E8E99] font-sans tabular-nums">
                      <span>$0</span>
                      <span>$12.500</span>
                      <span>$25.000</span>
                    </div>
                  </div>
                </div>

                <div className="surface-2 bg-[#18181C] p-4 rounded-[4px] border border-[#242429] space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-semibold text-[#34D399]">Marketing & Campaña</span>
                    <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">Máx: $25.000</span>
                  </div>
                  <div className="text-xs font-bold font-sans tabular-nums text-[#34D399]">
                    {singleMktBudget === 0 ? '$0 • Difusión Orgánica' : `$${singleMktBudget.toLocaleString('es-AR')}`}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="range"
                      min="0"
                      max="25000"
                      step="250"
                      value={singleMktBudget}
                      onChange={(e) => setSingleMktBudget(Number(e.target.value))}
                      className="w-full h-2 bg-[#111114] rounded-[2px] appearance-none cursor-pointer border border-[#242429] accent-[#34D399] focus:outline-none"
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

          {/* --- MUSIC VIDEO PRODUCTION SECTION --- */}
          <div className="surface-2 bg-[#18181C] border border-[#242429] rounded-[6px] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-[4px] border ${
                    hasMusicVideo
                      ? 'bg-[#FF4F00]/15 text-[#FF4F00] border-[#FF4F00]/40'
                      : 'bg-[#111114] text-[#8E8E99] border-[#242429]'
                  }`}
                >
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F4F0EA]">Videoclip Oficial (Opcional)</h3>
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
                    ? 'bg-[#FF4F00] text-white'
                    : 'bg-[#111114] hover:bg-[#1F1F24] text-[#F4F0EA] border border-[#242429]'
                }`}
              >
                {hasMusicVideo ? <Check className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                <span>{hasMusicVideo ? 'Videoclip Activado' : '+ Rodar Videoclip Oficial'}</span>
              </button>
            </div>

            {hasMusicVideo && (
              <div className="space-y-5 pt-3 border-t border-[#242429]">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    {VIDEO_CONCEPTS.map((concept) => {
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
                              ? 'bg-[#111114] border-[#FF4F00]'
                              : 'bg-[#111114] border-[#242429] hover:border-[#3F3F46]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <ConceptIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
                              <span className="text-2xs font-sans text-[#8E8E99] truncate">{concept.tag}</span>
                            </div>
                            <span className="text-xs font-bold text-[#F4F0EA] block">{concept.name}</span>
                          </div>
                          <p className="text-2xs text-[#8E8E99] leading-snug">{concept.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. DIRECTOR TIER */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA]">
                      2. Nivel de Dirección & Presupuesto Audiovisual
                    </label>
                    <span className="text-xs text-[#8E8E99] font-sans tabular-nums">
                      Tarifa: <strong className="text-[#34D399]">${currentDirectorTier.cost.toLocaleString('es-AR')}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {DIRECTOR_TIERS.map((tier) => {
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
                              ? 'bg-[#111114] border-[#FF4F00]'
                              : 'bg-[#111114] border-[#242429] hover:border-[#3F3F46]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <TierIcon className={`w-4 h-4 ${isSelected ? 'text-[#FF4F00]' : 'text-[#8E8E99]'}`} />
                                <h4 className="text-xs font-bold text-[#F4F0EA]">{tier.name}</h4>
                              </div>
                              <span className="text-xs font-bold font-sans tabular-nums text-[#34D399] bg-[#18181C] px-2 py-0.5 rounded-[4px] border border-[#242429]">
                                ${tier.cost.toLocaleString('es-AR')}
                              </span>
                            </div>
                            <span className="text-2xs text-[#8E8E99] font-semibold block">
                              {tier.tag} • {tier.estimatedViews}
                            </span>
                            <p className="text-xs text-[#8E8E99] leading-snug pt-0.5">{tier.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#242429] text-2xs font-sans tabular-nums text-[#8E8E99]">
                            <span>
                              Hype: <strong className="text-[#F4F0EA]">+{tier.hypeBoost}</strong>
                            </span>
                            <span>
                              Stream: <strong className="text-[#38BDF8]">+{tier.velocityBoost}%</strong>
                            </span>
                            <span>
                              Viral: <strong className="text-[#FF4F00]">+{tier.viralBoost}%</strong>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- BARRA DE RESUMEN DE COSTOS + LANZAMIENTO DE SINGLE --- */}
          <div
            className={`p-4 rounded-[4px] border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
              isFundsInsufficient
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                : 'surface-2 bg-[#18181C] border-[#242429]'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap text-xs font-sans tabular-nums">
                <span className="text-[#8E8E99]">
                  Costo Total:{' '}
                  <strong className={`text-sm ${isFundsInsufficient ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                    ${totalSingleCost.toLocaleString('es-AR')}
                  </strong>
                </span>
                {isFundsInsufficient && (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#EF4444]/20 border border-[#EF4444]/45 text-[#EF4444] text-2xs font-bold uppercase">
                    Excede Fondos
                  </span>
                )}
                <span className="text-[#3F3F46]">•</span>
                <span className="text-[#8E8E99]">
                  Fondos:{' '}
                  <strong className={isFundsInsufficient ? 'text-[#EF4444]' : 'text-[#34D399]'}>
                    ${player.stats.funds.toLocaleString('es-AR')}
                  </strong>
                </span>
                <span className="text-[#3F3F46]">•</span>
                <span className="text-[#8E8E99]">
                  Sesión: <strong className="text-[#FF4F00]">-15% Energía</strong>
                </span>
                <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#FF4F00] font-semibold">
                  Estudio Tier {computedStudioStats.tier}/{computedStudioStats.maxTier}
                </span>
                {labelMarketingContribution > 0 && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#34D399]/35 text-[#34D399] font-semibold">
                    Sello: +${labelMarketingContribution.toLocaleString('es-AR')} Mktg
                  </span>
                )}
                {activeSynergyQuality > 0 && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#38BDF8]/35 text-[#38BDF8] font-semibold">
                    Sinergia: +{activeSynergyQuality} Calidad
                  </span>
                )}
                {singleProducer && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99]">
                    Productor: +${singleProdFee.toLocaleString('es-AR')}
                  </span>
                )}
                {hasMusicVideo && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99]">
                    Videoclip: +${videoCost.toLocaleString('es-AR')}
                  </span>
                )}
              </div>

              <div className="text-xs">
                {isFundsInsufficient ? (
                  <span className="text-[#EF4444] flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Fondos insuficientes (faltan $
                    {(totalSingleCost - player.stats.funds).toLocaleString('es-AR')}).
                  </span>
                ) : isSinglesLimitReached ? (
                  <span className="text-[#EF4444] flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5" /> Límite anual de singles alcanzado ({MAX_SINGLES}/{MAX_SINGLES}).
                  </span>
                ) : isMonthlySingleLimitReached ? (
                  <span className="text-[#EF4444] flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5" /> Ya lanzaste un single este mes. Avanza +1M para publicar otro.
                  </span>
                ) : player.stats.energy < 15 ? (
                  <span className="text-[#F59E0B] flex items-center gap-1.5 font-medium">
                    <Zap className="w-3.5 h-3.5" /> Artista agotado (requiere al menos 15% energía).
                  </span>
                ) : (
                  <span className="text-[#34D399] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Listo para grabación y distribución.
                  </span>
                )}
              </div>
            </div>

            <button
              id="btn-submit-single"
              type="submit"
              disabled={isPublishing || isSinglesLimitReached || isMonthlySingleLimitReached || isFundsInsufficient || player.stats.energy < 15}
              title={
                isFundsInsufficient
                  ? `Fondos insuficientes ($${player.stats.funds.toLocaleString('es-AR')} / $${totalSingleCost.toLocaleString('es-AR')})`
                  : isSinglesLimitReached
                  ? `Cupo anual de singles alcanzado (${singlesThisYear}/${MAX_SINGLES})`
                  : isMonthlySingleLimitReached
                  ? 'Ya lanzaste un single este mes. Avanza el ciclo +1M'
                  : player.stats.energy < 15
                  ? `Energía insuficiente (${player.stats.energy}% / 15% requerida)`
                  : 'Grabar y publicar sencillo'
              }
              className={`py-3 px-7 rounded-[4px] text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all shrink-0 ${
                isPublishing || isSinglesLimitReached || isMonthlySingleLimitReached || isFundsInsufficient || player.stats.energy < 15
                  ? 'bg-[#242429] text-[#8E8E99] cursor-not-allowed'
                  : 'bg-[#FF4F00] hover:bg-[#E04500] text-white cursor-pointer shadow-md'
              }`}
            >
              <Disc3 className={`w-4 h-4 ${isPublishing ? 'animate-spin' : ''}`} />
              <span>
                {isPublishing
                  ? 'Publicando y Masterizando...'
                  : isFundsInsufficient
                  ? `Fondos Insuficientes ($${player.stats.funds.toLocaleString('es-AR')} / $${totalSingleCost.toLocaleString('es-AR')})`
                  : isMonthlySingleLimitReached
                  ? 'Bloqueado (Avanzar Mes)'
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
        <form onSubmit={handleCreateAlbum} className="surface-1 bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-6">
          <div className="pb-2">
            <h2 className="font-display font-extrabold text-lg tracking-tight text-[#F4F0EA] flex items-center gap-2 uppercase">
              <Layers className="w-5 h-5 text-[#34D399]" />
              Estudio de Composición de Álbumes & Proyectos
            </h2>
            <p className="text-xs text-[#8E8E99] mt-0.5">
              Reuní cortes adelanto y pistas inéditas en un LP o EP, cerrá el mastering con un productor ejecutivo y someté el disco a la prensa especializada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA]">
                    Título del Álbum / Proyecto *
                  </label>
                  <button
                    type="button"
                    onClick={() => generateRandomTitle(true)}
                    className="text-xs text-[#FF4F00] hover:underline font-semibold cursor-pointer transition-colors"
                  >
                    Sugerir Título Conceptual
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ej: Crónicas de una Noche, Génesis..."
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full surface-2 bg-[#18181C] border border-[#242429] focus:border-[#FF4F00] rounded-[4px] px-3.5 py-2.5 text-sm text-[#F4F0EA] placeholder:text-[#52525B] focus:outline-none transition-all"
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
                    onChange={(e) => setAlbumType(e.target.value as Album['type'])}
                    className="w-full surface-2 bg-[#18181C] border border-[#242429] focus:border-[#FF4F00] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F4F0EA] focus:outline-none transition-colors cursor-pointer"
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
                    onChange={(e) => setAlbumProducer(e.target.value)}
                    className="w-full surface-2 bg-[#18181C] border border-[#242429] focus:border-[#FF4F00] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F4F0EA] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Autoproducido • $0</option>
                    {(Object.values(world.producers) as Producer[]).map((p) => {
                      const lockInfo = getProducerLockStatus(p, player);
                      return (
                        <option key={p.id} value={p.id} disabled={!lockInfo.isUnlocked} className="bg-[#111114] text-[#F4F0EA]">
                          {lockInfo.isUnlocked ? '' : '[Bloqueado] '}
                          {p.name} • +{p.qualityBoost}% Calidad • ${p.costPerTrack.toLocaleString('es-AR')}/tema{' '}
                          {!lockInfo.isUnlocked ? `[Bloqueado: ${lockInfo.lockReason}]` : ''}
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
                  onChange={(e) => setSelectedAlbumSubgenreId(e.target.value)}
                  className="w-full surface-2 bg-[#18181C] border border-[#242429] focus:border-[#FF4F00] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F4F0EA] focus:outline-none transition-colors cursor-pointer"
                >
                  {styleDerivation.availableStyles
                    .filter((s) => s.isUnlocked)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} • {s.aestheticTone}
                      </option>
                    ))}
                </select>
              </div>

              {/* Previous Singles Inclusion */}
              <div className="surface-2 bg-[#18181C] p-4 rounded-[4px] border border-[#242429] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#F4F0EA]">
                    Incluir Singles Previos • {cleanCountTag(includedSingleIds.length, availablePreviousSingles.length, 'seleccionados')}
                  </label>
                  <span className="text-2xs text-[#8E8E99]">Aportan streams iniciales</span>
                </div>

                {availablePreviousSingles.length === 0 ? (
                  <p className="text-xs text-[#8E8E99] italic">
                    No tienes sencillos independientes disponibles para agregar a este disco.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {availablePreviousSingles.map((single) => {
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
                              ? 'bg-[#111114] text-[#F4F0EA] border-[#FF4F00]'
                              : 'bg-[#111114] hover:border-[#3F3F46] border-[#242429] text-[#F4F0EA]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-[#FF4F00] shrink-0" />
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
                          <span className="text-xs font-sans tabular-nums text-[#38BDF8] shrink-0">
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
                    className="text-xs font-semibold text-[#FF4F00] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Pista
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {includedSingleIds.map((sId, i) => {
                    const single = playerSongs.find((s) => s.id === sId);
                    const singleMonth = TimeSystem.getMonthName(single?.releaseMonth || 1);
                    return (
                      <div
                        key={sId}
                        className="flex items-center justify-between surface-2 bg-[#18181C] px-3 py-2 rounded-[4px] border border-[#FF4F00]/40 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-sans tabular-nums text-xs text-[#FF4F00] w-6 font-bold">{i + 1}.</span>
                          <span className="font-semibold text-[#F4F0EA] truncate">{single?.title || sId}</span>
                          <span className="text-2xs text-[#8E8E99] font-sans shrink-0">
                            ({singleMonth} {single?.releaseYear})
                          </span>
                        </div>
                        <span className="text-2xs uppercase font-bold bg-[#FF4F00]/20 text-[#FF4F00] px-2 py-0.5 rounded-[4px] border border-[#FF4F00]/30 shrink-0">
                          Single Previo
                        </span>
                      </div>
                    );
                  })}

                  {newTrackTitles.map((track, i) => {
                    const trackNumber = includedSingleIds.length + i + 1;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="font-sans tabular-nums text-xs text-[#8E8E99] w-6 text-right">{trackNumber}.</span>
                        <input
                          type="text"
                          value={track}
                          onChange={(e) => {
                            const copy = [...newTrackTitles];
                            copy[i] = e.target.value;
                            setNewTrackTitles(copy);
                          }}
                          className="flex-1 surface-2 bg-[#18181C] border border-[#242429] focus:border-[#FF4F00] rounded-[4px] px-3 py-1.5 text-xs text-[#F4F0EA] focus:outline-none"
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

              {/* Presets Rápidos de Presupuesto de Álbum */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#8E8E99]">
                  Presets de Presupuesto (Prod / Mktg)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALBUM_BUDGET_PRESETS.map((preset) => {
                    const isPresetActive = albumProdBudget === preset.prod && albumMktBudget === preset.mktg;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setAlbumProdBudget(preset.prod);
                          setAlbumMktBudget(preset.mktg);
                        }}
                        className={`p-2 rounded-[4px] border text-left transition-all cursor-pointer ${
                          isPresetActive
                            ? 'bg-[#FF4F00]/15 border-[#FF4F00] text-white'
                            : 'surface-2 bg-[#18181C] border-[#242429] hover:border-[#3F3F46] text-[#F4F0EA]'
                        }`}
                      >
                        <span className="text-xs font-bold block">{preset.label}</span>
                        <span className="text-2xs text-[#8E8E99] tabular-nums block">
                          ${(preset.prod / 1000).toFixed(0)}k / ${(preset.mktg / 1000).toFixed(0)}k
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budgets Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="surface-2 bg-[#18181C] p-4 rounded-[4px] border border-[#242429] space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-semibold text-[#F59E0B]">Producción & Mastering</span>
                    <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">Máx: $60.000</span>
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
                      onChange={(e) => setAlbumProdBudget(Number(e.target.value))}
                      className="w-full h-2 bg-[#111114] rounded-[2px] appearance-none cursor-pointer border border-[#242429] accent-[#F59E0B] focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-2xs text-[#8E8E99] font-sans tabular-nums">
                      <span>$3.000</span>
                      <span>$30.000</span>
                      <span>$60.000</span>
                    </div>
                  </div>
                </div>

                <div className="surface-2 bg-[#18181C] p-4 rounded-[4px] border border-[#242429] space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-semibold text-[#34D399]">Campaña de Lanzamiento</span>
                    <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">Máx: $60.000</span>
                  </div>
                  <div className="text-sm font-bold font-sans tabular-nums text-[#34D399]">
                    ${albumMktBudget.toLocaleString('es-AR')}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="range"
                      min="2000"
                      max="60000"
                      step="1000"
                      value={albumMktBudget}
                      onChange={(e) => setAlbumMktBudget(Number(e.target.value))}
                      className="w-full h-2 bg-[#111114] rounded-[2px] appearance-none cursor-pointer border border-[#242429] accent-[#34D399] focus:outline-none"
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

          {/* --- BARRA DE RESUMEN DE COSTOS + LANZAMIENTO DE ÁLBUM --- */}
          <div className="p-4 rounded-[4px] surface-2 bg-[#18181C] border border-[#242429] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap text-xs font-sans tabular-nums">
                <span className="text-[#8E8E99]">
                  Costo Total:{' '}
                  <strong className={`text-sm ${isAlbumFundsInsufficient ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                    ${totalAlbumCost.toLocaleString('es-AR')}
                  </strong>
                </span>
                <span className="text-[#3F3F46]">•</span>
                <span className="text-[#8E8E99]">
                  Fondos:{' '}
                  <strong className={isAlbumFundsInsufficient ? 'text-[#EF4444]' : 'text-[#34D399]'}>
                    ${player.stats.funds.toLocaleString('es-AR')}
                  </strong>
                </span>
                <span className="text-[#3F3F46]">•</span>
                <span className="text-[#8E8E99]">
                  Sesión: <strong className="text-[#FF4F00]">-35% Energía</strong>
                </span>
                <span className="text-[#3F3F46]">•</span>
                <span className="text-[#8E8E99]">
                  Pistas:{' '}
                  <strong className={isAlbumTracksInsufficient ? 'text-[#EF4444]' : 'text-[#F4F0EA]'}>
                    {totalAlbumTracksCount}/{minTracksRequired}
                  </strong>
                </span>
                <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#FF4F00] font-semibold">
                  Estudio Tier {computedStudioStats.tier}/{computedStudioStats.maxTier}
                </span>
                {labelMarketingContribution > 0 && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#34D399]/35 text-[#34D399] font-semibold">
                    Sello: +${labelMarketingContribution.toLocaleString('es-AR')} Mktg
                  </span>
                )}
                {activeSynergyQuality > 0 && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#38BDF8]/35 text-[#38BDF8] font-semibold">
                    Sinergia: +{activeSynergyQuality} Calidad
                  </span>
                )}
                {albumProducer && (
                  <span className="text-2xs px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99]">
                    Productor: +${albumProdFee.toLocaleString('es-AR')}
                  </span>
                )}
              </div>

              <div className="text-xs">
                {isAlbumFundsInsufficient ? (
                  <span className="text-[#EF4444] flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Fondos insuficientes (faltan $
                    {(totalAlbumCost - player.stats.funds).toLocaleString('es-AR')}).
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
                  <span className="text-[#34D399] flex items-center gap-1.5">
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
              className={`py-3 px-7 rounded-[4px] text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all shrink-0 ${
                isPublishing || isAlbumDisabled
                  ? 'bg-[#242429] text-[#8E8E99] cursor-not-allowed'
                  : 'bg-[#FF4F00] hover:bg-[#E04500] text-white cursor-pointer shadow-md'
              }`}
            >
              <Layers className={`w-4 h-4 ${isPublishing ? 'animate-spin' : ''}`} />
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
        <div className="surface-1 bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="font-display font-extrabold text-xl tracking-tight text-[#F4F0EA] flex items-center gap-2 uppercase">
                <Music2 className="w-5 h-5 text-[#34D399]" />
                Discografía & Catálogo Oficial
              </h2>
              <p className="text-xs text-[#8E8E99] mt-1">
                Registro técnico de másters publicados, créditos de consola, unidades de primera semana y reseñas de prensa.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 surface-2 bg-[#18181C] border border-[#242429] rounded-[4px] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCatalogFilter('all')}
                className={`px-3 py-1.5 rounded-[4px] transition-all cursor-pointer ${
                  catalogFilter === 'all' ? 'bg-[#FF4F00] text-white font-bold' : 'text-[#DCE2EE] hover:text-white hover:bg-white/5'
                }`}
              >
                Todos ({playerSingles.length + playerAlbums.length})
              </button>
              <button
                type="button"
                onClick={() => setCatalogFilter('albums')}
                className={`px-3 py-1.5 rounded-[4px] transition-all cursor-pointer ${
                  catalogFilter === 'albums' ? 'bg-[#FF4F00] text-white font-bold' : 'text-[#DCE2EE] hover:text-white hover:bg-white/5'
                }`}
              >
                Álbumes ({playerAlbums.length})
              </button>
              <button
                type="button"
                onClick={() => setCatalogFilter('singles')}
                className={`px-3 py-1.5 rounded-[4px] transition-all cursor-pointer ${
                  catalogFilter === 'singles' ? 'bg-[#FF4F00] text-white font-bold' : 'text-[#DCE2EE] hover:text-white hover:bg-white/5'
                }`}
              >
                Singles ({playerSingles.length})
              </button>
            </div>
          </div>

          {/* ALBUMS SECTION */}
          {(catalogFilter === 'all' || catalogFilter === 'albums') && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E99] font-sans flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#FF4F00]" />
                Álbumes & Proyectos de Larga Duración
              </h3>

              {playerAlbums.length === 0 ? (
                <p className="text-xs text-[#8E8E99] italic py-2">
                  No has publicado ningún álbum hasta el momento.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playerAlbums.map((album, aIdx) => {
                    const coverGrad =
                      album.coverGradient || ARTISTIC_COVER_GRADIENTS[aIdx % ARTISTIC_COVER_GRADIENTS.length];
                    const albumReleaseDateStr = formatReleaseDate(album.releaseMonth, album.releaseYear, 'long');
                    const albumReleaseDateFull = formatReleaseDate(album.releaseMonth, album.releaseYear, 'full');
                    const albumProducerName = formatProducerCredit(album.producerId, world.producers, { short: false });
                    const isExpanded = Boolean(expandedAlbumIds[album.id]);

                    return (
                      <div
                        key={album.id}
                        className="surface-2 bg-[#18181C] border border-[#242429] rounded-[4px] p-5 space-y-4 hover:border-[#3F3F46] transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-20 h-20 rounded-[4px] bg-gradient-to-br ${coverGrad} shrink-0 border border-white/10 flex items-end p-2 text-white text-2xs font-bold uppercase font-sans`}
                          >
                            {album.type}
                          </div>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-[4px] text-2xs font-sans font-bold uppercase bg-[#FF4F00]/20 border border-[#FF4F00]/40 text-[#FF4F00]">
                                {world.genres[album.genreId]?.name || album.genreId}
                              </span>
                              <span className="px-2 py-0.5 rounded-[4px] text-2xs font-semibold bg-[#111114] border border-[#242429] text-[#F4F0EA] uppercase">
                                {album.type}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-[#F4F0EA] tracking-tight truncate pt-0.5">
                              {album.title}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap text-xs text-[#8E8E99]">
                              <span className="inline-flex items-center gap-1" title={albumReleaseDateFull}>
                                <Calendar className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
                                <span>
                                  <strong className="text-[#F4F0EA] font-semibold">{albumReleaseDateStr}</strong>
                                </span>
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
                            <span className="text-2xs uppercase font-semibold text-[#8E8E99] block">1ª Semana</span>
                            <span className="font-sans tabular-nums font-bold text-sm text-[#34D399]">
                              {album.firstWeekSales.toLocaleString('es-AR')} u.
                            </span>
                          </div>
                        </div>

                        {/* Metacritic Review Box */}
                        <div className="bg-[#111114] border border-[#242429] p-3 rounded-[4px] space-y-1 text-xs">
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
                              className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-[4px] bg-[#111114] border border-[#242429] hover:border-[#3F3F46] text-xs text-[#8E8E99] hover:text-[#F4F0EA] transition-colors cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5 font-medium">
                                <Music2 className="w-3.5 h-3.5 text-[#FF4F00]" />
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
                                  const trkProducer = formatProducerCredit(trk.producerId || album.producerId, world.producers, {
                                    short: true
                                  });

                                  return (
                                    <div
                                      key={sId}
                                      className="flex items-center justify-between p-2 rounded-[4px] bg-[#111114] border border-[#242429] text-xs"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="font-sans tabular-nums text-2xs text-[#8E8E99] w-4">{trackIdx + 1}.</span>
                                        <span
                                          className="font-semibold text-[#F4F0EA] truncate max-w-[150px] sm:max-w-[200px]"
                                          title={trk.title}
                                        >
                                          {trk.title}
                                        </span>
                                        {trk.isSingle && (
                                          <span className="text-2xs uppercase font-bold bg-[#FF4F00]/20 text-[#FF4F00] px-1.5 py-0.5 rounded-[4px] border border-[#FF4F00]/30">
                                            Single
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-[#8E8E99] font-sans tabular-nums shrink-0">
                                        <span>{trkDateStr}</span>
                                        <span>{trkProducer}</span>
                                        <span className="text-[#34D399] font-semibold">Q: {trk.quality}%</span>
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
            <div className="space-y-4 pt-4 border-t border-[#242429]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E99] flex items-center gap-1.5">
                <Disc3 className="w-4 h-4 text-[#FF4F00]" />
                Sencillos & Cortes Individuales ({playerSingles.length})
              </h3>

              {playerSingles.length === 0 ? (
                <p className="text-xs text-[#8E8E99] italic py-2">
                  No tienes sencillos publicados aún.
                </p>
              ) : (
                <div className="space-y-3">
                  {playerSingles.map((song) => {
                    const subgenre =
                      song.subGenreIds && song.subGenreIds.length > 0
                        ? SUBGENRE_DETAILS[song.subGenreIds[0]]
                        : undefined;
                    const isHit = (song.peakPosition?.Global ?? 99) <= 10;
                    const releaseDateStr = formatReleaseDate(song.releaseMonth, song.releaseYear, 'long');
                    const releaseDateFull = formatReleaseDate(song.releaseMonth, song.releaseYear, 'full');
                    const producerName = formatProducerCredit(song.producerId, world.producers, { short: false });
                    const albumParent = song.albumId ? world.albums?.[song.albumId] : undefined;

                    return (
                      <div
                        key={song.id}
                        className="surface-2 bg-[#18181C] border border-[#242429] p-4 rounded-[4px] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#3F3F46] transition-all"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-[#F4F0EA]">{song.title}</h4>
                            <span className="text-2xs font-sans font-bold px-2 py-0.5 rounded-[4px] bg-[#FF4F00]/20 border border-[#FF4F00]/40 text-[#FF4F00]">
                              {world.genres[song.genreId]?.name || song.genreId}
                            </span>
                            {subgenre && (
                              <span className="text-2xs font-sans font-medium bg-[#111114] border border-[#242429] text-[#8E8E99] px-2 py-0.5 rounded-[4px]">
                                {subgenre.name}
                              </span>
                            )}
                            {albumParent ? (
                              <span
                                className="text-2xs font-sans font-medium bg-[#111114] border border-[#FF4F00]/40 text-[#FF4F00] px-2 py-0.5 rounded-[4px] flex items-center gap-1"
                                title={`Pertenece al álbum "${albumParent.title}"`}
                              >
                                <Layers className="w-2.5 h-2.5 text-[#FF4F00]" />
                                Álbum: {albumParent.title}
                              </span>
                            ) : (
                              <span className="text-2xs font-sans font-medium bg-[#111114] border border-[#242429] text-[#F4F0EA] px-2 py-0.5 rounded-[4px]">
                                Single Oficial
                              </span>
                            )}
                            {song.featuredArtistIds && song.featuredArtistIds.length > 0 && (
                              <span className="text-2xs font-sans font-bold bg-[#111114] text-[#34D399] border border-[#34D399]/35 px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                                <Users className="w-2.5 h-2.5" />
                                ft. {song.featuredArtistIds.map((id) => world.artists[id]?.name || id).join(', ')}
                              </span>
                            )}
                            {song.musicVideo && (
                              <span className="text-2xs font-sans font-bold bg-[#111114] text-[#38BDF8] border border-[#38BDF8]/40 px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                                <Video className="w-2.5 h-2.5 text-[#38BDF8]" />
                                Videoclip
                              </span>
                            )}
                            {song.wentViral && <span className={RELEASE_BADGES.viral}>Viral Hit</span>}
                            {isHit && <span className={RELEASE_BADGES.hitTop10}>Hit Top 10</span>}
                            {song.isClassic && <span className={RELEASE_BADGES.classic}>Clásico</span>}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap text-xs text-[#8E8E99]">
                            <span className="inline-flex items-center gap-1" title={releaseDateFull}>
                              <Calendar className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
                              <span>
                                Lanzamiento: <strong className="text-[#F4F0EA] font-semibold">{releaseDateStr}</strong>
                              </span>
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Sliders className="w-3.5 h-3.5 text-[#8E8E99] shrink-0" />
                              <span>{producerName}</span>
                            </span>
                            <span>•</span>
                            <span className="tabular-nums">
                              Calidad: <strong className="text-[#34D399]">{song.quality}%</strong> • Comercial:{' '}
                              <strong className="text-[#F4F0EA]">{song.commercialAppeal}%</strong> • Originalidad:{' '}
                              <strong className="text-[#F59E0B]">{song.originality}%</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6 text-xs font-sans tabular-nums shrink-0 flex-wrap">
                          <div>
                            <span className="text-[#8E8E99] block text-2xs uppercase">Peak Global</span>
                            <span
                              className={`font-bold text-sm ${
                                song.peakPosition?.Global === 1
                                  ? 'text-[#F59E0B] font-extrabold'
                                  : song.peakPosition?.Global && song.peakPosition.Global <= 10
                                  ? 'text-[#FF4F00]'
                                  : 'text-[#F4F0EA]'
                              }`}
                            >
                              {song.peakPosition?.Global ? `#${song.peakPosition.Global}` : '—'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#8E8E99] block text-2xs uppercase">Streams / Mes</span>
                            <span className="font-bold text-sm text-[#38BDF8]">
                              {song.streamsLastMonth.toLocaleString('es-AR')}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#8E8E99] block text-2xs uppercase">Total</span>
                            <span className="font-bold text-sm text-[#F4F0EA]">
                              {(song.streamsTotal / 1000000).toFixed(2)}M
                            </span>
                          </div>

                          {onNavigate && (
                            <button
                              type="button"
                              onClick={() => {
                                playSound('click');
                                onNavigate('streaming');
                              }}
                              className="px-3 py-1.5 rounded-[4px] bg-[#111114] border border-[#242429] hover:border-[#FF4F00] text-[#F4F0EA] hover:text-[#FF4F00] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Radio className="w-3.5 h-3.5" />
                              <span>Promocionar / Playlists</span>
                            </button>
                          )}
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
