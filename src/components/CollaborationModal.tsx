import React, { useState, useMemo, useEffect } from 'react';
import {
  Artist,
  WorldState,
  Producer,
  LongevityCurve,
  ReleaseConfirmationData
} from '../types';
import { SUBGENRE_DETAILS } from '../data/genres';
import { IndustryEngine } from '../systems/IndustryEngine';
import { RelationshipEngine } from '../systems/RelationshipEngine';
import { playSound } from '../utils/audioSystem';
import { formatMoney } from '../utils/formatters';
import {
  X,
  Sparkles,
  Users,
  Disc3,
  Layers,
  Music2,
  Sliders,
  DollarSign,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Radio,
  Clock,
  ShieldAlert,
  HelpCircle,
  Volume2
} from 'lucide-react';

export type CollabFormat = 'single_feat' | 'album_track' | 'ep_collab' | 'collab_album' | 'mixtape_collab';
export type CreditFormat = 'player_feat_target' | 'target_feat_player' | 'player_and_target' | 'player_x_target';

export interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Artist;
  world: WorldState;
  preselectedArtistId?: string;
  onCollabSuccess: (data: ReleaseConfirmationData) => void;
  onExecuteCollab?: (params: {
    collaboratorId: string;
    format: CollabFormat;
    title: string;
    creditFormat: CreditFormat;
    genreId: string;
    subGenreIds: string[];
    producerId?: string;
    budgetProduction: number;
    budgetMarketing: number;
    longevityCurve: LongevityCurve;
  }) => ReleaseConfirmationData;
}

interface FormatOption {
  id: CollabFormat;
  name: string;
  subtitle: string;
  tracksCount: number;
  energyCost: number;
  minBudgetSuggested: number;
  icon: React.ElementType;
  tag: string;
  gradient: string;
  badgeClass: string;
}

const COLLAB_FORMATS: FormatOption[] = [
  {
    id: 'single_feat',
    name: 'Single con Feat',
    subtitle: 'Sencillo estelar para romper playlists y radios globales',
    tracksCount: 1,
    energyCost: 15,
    minBudgetSuggested: 2000,
    icon: Disc3,
    tag: 'Single',
    gradient: 'from-[#8B5CF6]/30 to-[#EC4899]/30',
    badgeClass: 'bg-purple-950/60 border-purple-500/40 text-purple-300'
  },
  {
    id: 'album_track',
    name: 'Canción de Álbum',
    subtitle: 'Track conceptual clave para tu próximo proyecto o LP',
    tracksCount: 1,
    energyCost: 15,
    minBudgetSuggested: 2000,
    icon: Music2,
    tag: 'Album Cut',
    gradient: 'from-[#06B6D4]/30 to-[#8B5CF6]/30',
    badgeClass: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
  },
  {
    id: 'ep_collab',
    name: 'EP Colaborativo',
    subtitle: 'Mini-proyecto conceptual conjunto de 4 canciones',
    tracksCount: 4,
    energyCost: 25,
    minBudgetSuggested: 6000,
    icon: Layers,
    tag: 'EP (4 Tracks)',
    gradient: 'from-amber-500/30 to-rose-500/30',
    badgeClass: 'bg-amber-950/60 border-amber-500/40 text-amber-300'
  },
  {
    id: 'collab_album',
    name: 'Álbum Colaborativo',
    subtitle: 'Disco histórico conjunto ("Oasis" / "Watch the Throne")',
    tracksCount: 6,
    energyCost: 35,
    minBudgetSuggested: 14000,
    icon: Sparkles,
    tag: 'LP Conjunto (6 Tracks)',
    gradient: 'from-[#EC4899]/30 via-[#8B5CF6]/30 to-[#10B981]/30',
    badgeClass: 'bg-gradient-to-r from-violet-900/80 to-pink-900/80 border-pink-500/50 text-pink-200'
  },
  {
    id: 'mixtape_collab',
    name: 'Mixtape Conjunta',
    subtitle: 'Cinta callejera directa para alimentar la escena urbana',
    tracksCount: 6,
    energyCost: 25,
    minBudgetSuggested: 5000,
    icon: Radio,
    tag: 'Mixtape Callejera',
    gradient: 'from-emerald-500/30 to-teal-500/30',
    badgeClass: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
  }
];

interface LongevityOption {
  id: LongevityCurve;
  label: string;
  description: string;
  icon: React.ElementType;
  badge: string;
}

const LONGEVITY_OPTIONS: LongevityOption[] = [
  {
    id: 'explosive_drop',
    label: 'Drop Explosivo',
    description: 'Pico masivo instantáneo en la 1ª semana; decaimiento rápido.',
    icon: Flame,
    badge: 'Hype Inmediato'
  },
  {
    id: 'steady',
    label: 'Rendimiento Estable',
    description: 'Tracción continua, sólida rotación en radio y playlists de catálogo.',
    icon: TrendingUp,
    badge: 'Constante'
  },
  {
    id: 'slow_burn',
    label: 'Crecimiento Gradual',
    description: 'Boca a boca orgánico. Alcanza su punto máximo tras 4-5 meses.',
    icon: Clock,
    badge: 'Sleeper'
  },
  {
    id: 'sleeper_viral',
    label: 'Ola Viral / TikTok',
    description: 'Chance de convertirse en fenómeno viral repentino en redes.',
    icon: Zap,
    badge: 'Viral Wave'
  },
  {
    id: 'instant_classic',
    label: 'Clásico Instantáneo',
    description: 'Aclamación crítica legendaria y reproducciones infinitas a lo largo de los años.',
    icon: Sparkles,
    badge: 'Legado'
  }
];

const COLLAB_RANDOM_TITLES: Record<string, string[]> = {
  general: [
    'Oasis',
    'Fuego Cruzado',
    'Watch the Throne',
    'Los Dioses',
    'Modo Diablo',
    'Diamantes Callejeros',
    'Alianza Sagrada',
    'Código de Honor',
    'Frecuencias Gemelas',
    'Dos Mundos',
    'Noches en el Sur',
    'Alquimia Pura',
    'Sesión de Medianoche',
    'Pacto de Sangre',
    'Vibras Cósmicas',
    'Cicatrices de Oro',
    'El Imperio',
    'Luz & Sombra',
    'Cielos de Neón',
    'Monopolio Sonoro'
  ],
  single: [
    'Session #01',
    'Cruce Fatal',
    'Bajo las Luces',
    'Fórmula Maestra',
    'Doble Impacto',
    'Tiro Libre',
    'Furia Urbana',
    'Sinfonía Callejera',
    'Sin Frenos',
    'Zona Cero'
  ],
  album: [
    'Oasis: El Disco',
    'Trascendencia',
    'Dinastía',
    'Crónicas del Olimpo',
    'Fuerzas Opuestas',
    'Alianza Imparable',
    'La Cumbre',
    'Manifiesto Conjunto'
  ]
};

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  player,
  world,
  preselectedArtistId,
  onCollabSuccess,
  onExecuteCollab
}) => {
  // Candidate Artists (Exclude player and retired artists)
  const candidateArtists = useMemo(() => {
    return (Object.values(world.artists) as Artist[]).filter(
      a => a.id !== player.id && !a.isRetired
    );
  }, [world.artists, player.id]);

  // Selected Collaborator
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>(() => {
    if (preselectedArtistId && world.artists[preselectedArtistId]) {
      return preselectedArtistId;
    }
    return candidateArtists[0]?.id || '';
  });

  useEffect(() => {
    if (preselectedArtistId && world.artists[preselectedArtistId]) {
      setSelectedCollaboratorId(preselectedArtistId);
    }
  }, [preselectedArtistId, world.artists]);

  const targetArtist = world.artists[selectedCollaboratorId] || candidateArtists[0];

  // Collab Configuration State
  const [format, setFormat] = useState<CollabFormat>('single_feat');
  const [title, setTitle] = useState<string>('Fuego Cruzado');
  const [creditFormat, setCreditFormat] = useState<CreditFormat>('player_and_target');
  const [genreId, setGenreId] = useState<string>(() => player.mainGenreId || 'trap_latino');
  const [subGenreId, setSubGenreId] = useState<string>('');
  const [producerId, setProducerId] = useState<string>('');
  const [budgetProduction, setBudgetProduction] = useState<number>(3000);
  const [budgetMarketing, setBudgetMarketing] = useState<number>(2500);
  const [longevityCurve, setLongevityCurve] = useState<LongevityCurve>('steady');

  // Interactive Execution & Feedback State
  const [isNegotiating, setIsNegotiating] = useState<boolean>(false);
  const [rejectionFeedback, setRejectionFeedback] = useState<{
    reason: string;
    advice: string;
  } | null>(null);

  // Sync genre when collaborator changes if needed
  useEffect(() => {
    if (targetArtist && !genreId) {
      setGenreId(player.mainGenreId || targetArtist.mainGenreId);
    }
  }, [targetArtist, genreId, player.mainGenreId]);

  // Relationship and Metrics
  const relationship = useMemo(() => {
    if (!targetArtist) return null;
    return RelationshipEngine.getOrCreateRelationship(player, targetArtist.id);
  }, [player, targetArtist]);

  // Sound Synergy Estimation (0 - 100)
  const soundSynergy = useMemo(() => {
    if (!targetArtist) return 50;

    let score = 50;
    // 1. Genre harmony
    if (player.mainGenreId === targetArtist.mainGenreId) {
      score += 20;
    } else if (player.subGenreIds?.includes(targetArtist.mainGenreId) || targetArtist.subGenreIds?.includes(player.mainGenreId)) {
      score += 15;
    } else {
      score += 8; // Cross-over exploration
    }

    // 2. Personality Chemistry
    const creatChem = (player.personality.creativity + targetArtist.personality.creativity) / 200;
    const skillChem = (player.personality.skill + targetArtist.personality.skill) / 200;
    score += Math.floor(creatChem * 15 + skillChem * 10);

    // 3. Past Collab Experience
    if (relationship && relationship.pastCollabsCount > 0) {
      score += Math.min(12, relationship.pastCollabsCount * 4);
    }

    return Math.min(100, Math.max(20, score));
  }, [player, targetArtist, relationship]);

  // Real-time Dynamic Acceptance Probability (0 - 100%)
  const acceptanceProbability = useMemo(() => {
    if (!targetArtist || !relationship) return 50;

    if (relationship.relationType === 'feud') {
      return 0; // Feudo abierto impide aceptación
    }

    // Base score from Sociability, Affinity, Respect
    let prob = targetArtist.personality.sociability * 0.25 +
      (relationship.affinity + 100) * 0.28 +
      relationship.respect * 0.22;

    // Popularity Gap Penalty / Boost
    const popDiff = targetArtist.stats.popularity - player.stats.popularity;
    if (popDiff > 25) {
      prob -= (popDiff * 1.1);
    } else if (popDiff > 10) {
      prob -= (popDiff * 0.6);
    } else if (popDiff < -10) {
      prob += 15; // Target loves collaborating with more famous player
    }

    // Budget Factor
    const totalBudget = budgetProduction + budgetMarketing;
    if (totalBudget >= 15000) prob += 16;
    else if (totalBudget >= 8000) prob += 10;
    else if (totalBudget >= 3000) prob += 4;
    else if (totalBudget === 0) prob -= 12;

    // Format Multiplier
    if (format === 'single_feat') prob += 10;
    else if (format === 'album_track') prob += 8;
    else if (format === 'ep_collab') prob -= 4;
    else if (format === 'collab_album') prob -= 10;
    else if (format === 'mixtape_collab') prob += 2;

    // Credits arrangement impact
    if (creditFormat === 'target_feat_player') {
      prob += 12; // Target gets top billing
    } else if (creditFormat === 'player_and_target' || creditFormat === 'player_x_target') {
      prob += 5; // Equal billing
    } else if (creditFormat === 'player_feat_target' && popDiff > 15) {
      prob -= 8; // Superstar target might dislike just being feat
    }

    // Producer prestige bonus
    if (producerId && world.producers[producerId]) {
      prob += 6;
    }

    return Math.min(99, Math.max(2, Math.round(prob)));
  }, [
    targetArtist,
    relationship,
    player.stats.popularity,
    budgetProduction,
    budgetMarketing,
    format,
    creditFormat,
    producerId,
    world.producers
  ]);

  // Selected format metadata
  const selectedFormatConfig = useMemo(() => {
    return COLLAB_FORMATS.find(f => f.id === format) || COLLAB_FORMATS[0];
  }, [format]);

  // Producer info & Cost Calculation
  const selectedProducer = producerId ? world.producers[producerId] : undefined;
  const producerFee = selectedProducer
    ? selectedProducer.costPerTrack * (selectedFormatConfig.tracksCount === 1 ? 1 : Math.min(selectedFormatConfig.tracksCount, 6))
    : 0;

  const totalCost = budgetProduction + budgetMarketing + producerFee;
  const isFundsInsufficient = totalCost > player.stats.funds;
  const isEnergyInsufficient = player.stats.energy < selectedFormatConfig.energyCost;

  // Title Generator Helper
  const handleGenerateTitle = () => {
    playSound('click');
    let pool = COLLAB_RANDOM_TITLES.general;
    if (format === 'single_feat' || format === 'album_track') {
      pool = [...COLLAB_RANDOM_TITLES.general, ...COLLAB_RANDOM_TITLES.single];
    } else {
      pool = [...COLLAB_RANDOM_TITLES.general, ...COLLAB_RANDOM_TITLES.album];
    }
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setTitle(chosen);
  };

  // Credits Preview string
  const getCreditPreview = () => {
    if (!targetArtist) return '';
    switch (creditFormat) {
      case 'player_feat_target':
        return `${player.name} ft. ${targetArtist.name}`;
      case 'target_feat_player':
        return `${targetArtist.name} ft. ${player.name}`;
      case 'player_and_target':
        return `${player.name} & ${targetArtist.name}`;
      case 'player_x_target':
        return `${player.name} x ${targetArtist.name}`;
    }
  };

  // Available Subgenres for the chosen Genre
  const availableSubgenres = useMemo(() => {
    const genre = world.genres[genreId];
    if (!genre || !genre.subGenres) return [];
    return genre.subGenres.map(sgId => SUBGENRE_DETAILS[sgId]).filter(Boolean);
  }, [world.genres, genreId]);

  // Execute Proposal & Negotiation Flow
  const handleSendProposal = async () => {
    if (!title.trim() || !targetArtist) return;
    if (isFundsInsufficient || isEnergyInsufficient) return;

    setRejectionFeedback(null);
    setIsNegotiating(true);
    playSound('click');

    // Simulate authentic studio negotiation delay
    setTimeout(() => {
      setIsNegotiating(false);

      // Roll against Acceptance Probability
      const roll = Math.random() * 100;
      const isAccepted = roll <= acceptanceProbability;

      if (!isAccepted) {
        // Rejection Feedback Generation
        playSound('click');
        let reason = `${targetArtist.name} revisó la propuesta pero decidió no firmar en este momento.`;
        let advice = 'Mejora tu afinidad con elogios en redes o incrementa el presupuesto de marketing.';

        const popDiff = targetArtist.stats.popularity - player.stats.popularity;
        if (relationship && relationship.relationType === 'feud') {
          reason = `${targetArtist.name} mantiene un feudo abierto con vos y rechazó la propuesta tajantemente.`;
          advice = 'Debes calmar la tensión o resolver la tiradera antes de proponer música conjunta.';
        } else if (popDiff > 25) {
          reason = `${targetArtist.name} considera que la diferencia de repercusión (${targetArtist.stats.popularity} vs ${player.stats.popularity} pop) es demasiado amplia para un proyecto de este calibre.`;
          advice = 'Aumenta tu popularidad con giras y sencillos propios, u ofrécele encabezar el crédito principal.';
        } else if (budgetProduction + budgetMarketing < selectedFormatConfig.minBudgetSuggested) {
          reason = `El equipo de ${targetArtist.name} consideró que el presupuesto de producción/difusión ($${totalCost.toLocaleString()}) es insuficiente para la calidad que exige su catálogo.`;
          advice = 'Sube la inversión de producción y marketing para garantizar un lanzamiento de primer nivel.';
        } else if (relationship && relationship.affinity < 0) {
          reason = `La falta de cercanía y química personal (${relationship.affinity} de afinidad) hizo que ${targetArtist.name} declinara la oferta.`;
          advice = 'Envíale menciones elogiosas en redes sociales para elevar la afinidad mutua.';
        }

        // Add history note to relationship
        if (relationship) {
          relationship.history.push(`Propuesta de colaboración (${format}) declinada en ${world.currentYear}.`);
        }

        setRejectionFeedback({ reason, advice });
      } else {
        // Collaboration Accepted!
        playSound('release');

        const params = {
          collaboratorId: targetArtist.id,
          format,
          title: title.trim(),
          creditFormat,
          genreId,
          subGenreIds: subGenreId ? [subGenreId] : [],
          producerId: producerId || undefined,
          budgetProduction,
          budgetMarketing,
          longevityCurve
        };

        if (onExecuteCollab) {
          const confirmationData = onExecuteCollab(params);
          onClose();
          onCollabSuccess(confirmationData);
        } else {
          // Fallback construction of ReleaseConfirmationData
          const genreName = world.genres[genreId]?.name || genreId;
          const subName = subGenreId ? SUBGENRE_DETAILS[subGenreId]?.name : undefined;

          const releaseData: ReleaseConfirmationData = {
            type: format === 'single_feat' || format === 'album_track' ? 'single' : format === 'ep_collab' ? 'ep' : format === 'mixtape_collab' ? 'mixtape' : 'collab_album',
            title: title.trim(),
            songCount: selectedFormatConfig.tracksCount,
            trackTitles: selectedFormatConfig.tracksCount === 1
              ? [`${title.trim()} (${getCreditPreview()})`]
              : [`${title.trim()} - Track 1`, `${title.trim()} - Track 2`, `${title.trim()} - Track 3`, `${title.trim()} - Track 4`],
            genreId,
            genreName,
            subGenreId: subGenreId || undefined,
            subGenreName: subName,
            featuredArtistNames: [targetArtist.name],
            producerName: selectedProducer?.name,
            releaseYear: world.currentYear,
            releaseMonth: world.currentMonth,
            totalBudget: totalCost,
            budgetBreakdown: {
              production: budgetProduction,
              marketing: budgetMarketing,
              producerFee,
              videoCost: 0
            }
          };

          onClose();
          onCollabSuccess(releaseData);
        }
      }
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div
        className="bg-[#16181F] border border-[#2A2E3D] max-w-4xl w-full rounded-[18px] flex flex-col overflow-hidden text-[#F8FAFC] shadow-2xl relative my-auto max-h-[92vh]"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#8B5CF6]/25 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#2A2E3D] bg-[#16181F]/90 backdrop-blur-md flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[8px] bg-[#0B0C10] border border-[#8B5CF6]/40 text-[#C084FC] shadow-[0_0_12px_rgba(139,92,246,0.3)] shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C084FC] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2 py-0.5 rounded-[4px] inline-block">
                Estudio de Alianzas Musicales
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#F8FAFC]">
                Colaboración Musical & Grabación Conjunta
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 relative z-10 text-xs">
          {/* SECTION 1: COLLABORATOR SELECTION & PROFILE HERO CARD */}
          <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-2xl p-5 space-y-4 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2E3D] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#8B5CF6]" />
                  Perfil del Artista Colaborador
                </span>
              </div>

              {/* Collaborator Dropdown Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#94A3B8]">Seleccionar Colega:</span>
                <select
                  value={selectedCollaboratorId}
                  onChange={e => {
                    setSelectedCollaboratorId(e.target.value);
                    setRejectionFeedback(null);
                  }}
                  className="bg-[#16181F] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3 py-1.5 text-xs text-[#F8FAFC] font-semibold focus:outline-none cursor-pointer"
                >
                  {candidateArtists.map(artist => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name} ({world.genres[artist.mainGenreId]?.name || artist.mainGenreId} • {(artist.stats.monthlyListeners / 1000000).toFixed(1)}M)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {targetArtist && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Left Card: Artist ID & Main Stats (4 cols) */}
                <div className="md:col-span-4 bg-[#16181F] border border-[#2A2E3D] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-indigo-950 text-white font-extrabold text-xl flex items-center justify-center shrink-0 border border-white/20 shadow-md">
                    {targetArtist.name.charAt(0)}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-[#F8FAFC] truncate">
                        {targetArtist.name}
                      </h3>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[4px] bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C084FC]">
                        {targetArtist.careerStage}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8]">
                      {targetArtist.country} • {world.genres[targetArtist.mainGenreId]?.name || targetArtist.mainGenreId}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-mono pt-0.5">
                      <span>Pop: <strong className="text-emerald-400">{targetArtist.stats.popularity}</strong></span>
                      <span>Oyentes: <strong className="text-[#C084FC]">{(targetArtist.stats.monthlyListeners / 1000000).toFixed(1)}M</strong></span>
                    </div>
                  </div>
                </div>

                {/* Middle Card: Affinity, Respect & Sound Synergy Gauges (5 cols) */}
                <div className="md:col-span-5 bg-[#16181F] border border-[#2A2E3D] rounded-xl p-3.5 space-y-2.5">
                  {/* Gauge 1: Afinidad Mutua */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#94A3B8]">Afinidad Mutua</span>
                      <span className={`font-mono font-bold ${(relationship?.affinity ?? 0) >= 20 ? 'text-emerald-400' : (relationship?.affinity ?? 0) < 0 ? 'text-rose-400' : 'text-[#F8FAFC]'}`}>
                        {(relationship?.affinity ?? 0) > 0 ? `+${relationship?.affinity}` : relationship?.affinity ?? 0}
                      </span>
                    </div>
                    <div className="w-full bg-[#0B0C10] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${(relationship?.affinity ?? 0) >= 0 ? 'bg-gradient-to-r from-[#8B5CF6] to-[#10B981]' : 'bg-gradient-to-r from-amber-500 to-rose-600'}`}
                        style={{ width: `${Math.max(10, Math.min(100, ((relationship?.affinity ?? 0) + 100) / 2))}%` }}
                      />
                    </div>
                  </div>

                  {/* Gauge 2: Respeto Profesional */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#94A3B8]">Respeto Profesional</span>
                      <span className="font-mono font-bold text-cyan-400">{relationship?.respect ?? 50}%</span>
                    </div>
                    <div className="w-full bg-[#0B0C10] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#06B6D4]"
                        style={{ width: `${relationship?.respect ?? 50}%` }}
                      />
                    </div>
                  </div>

                  {/* Gauge 3: Sinergia Sonora Estimada */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#94A3B8] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#EC4899]" />
                        Sinergia Sonora Estimada
                      </span>
                      <span className="font-mono font-bold text-pink-400">{soundSynergy}%</span>
                    </div>
                    <div className="w-full bg-[#0B0C10] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]"
                        style={{ width: `${soundSynergy}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Card: Real-time Acceptance Probability Indicator (3 cols) */}
                <div className="md:col-span-3 bg-[#16181F] border border-[#2A2E3D] rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-1.5 shadow-sm">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
                    Probabilidad de Aceptación
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-2xl font-extrabold font-mono ${
                        acceptanceProbability >= 70
                          ? 'text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                          : acceptanceProbability >= 45
                          ? 'text-[#06B6D4]'
                          : acceptanceProbability >= 25
                          ? 'text-[#F59E0B]'
                          : 'text-[#F43F5E]'
                      }`}
                    >
                      {acceptanceProbability}%
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      acceptanceProbability >= 70
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : acceptanceProbability >= 45
                        ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                        : acceptanceProbability >= 25
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {acceptanceProbability >= 70
                      ? '✓ Muy Alta'
                      : acceptanceProbability >= 45
                      ? 'Favorable'
                      : acceptanceProbability >= 25
                      ? 'Incierta'
                      : '✗ Riesgosa'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: FORMAT SELECTOR (5 Options) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                1. Selector de Formato de Colaboración
              </label>
              <span className="text-[11px] text-[#94A3B8]">
                Formato activo: <strong className="text-[#C084FC]">{selectedFormatConfig.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {COLLAB_FORMATS.map(fOption => {
                const isSelected = format === fOption.id;
                const FormatIcon = fOption.icon;

                return (
                  <div
                    key={fOption.id}
                    onClick={() => {
                      playSound('click');
                      setFormat(fOption.id);
                    }}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? `bg-gradient-to-br from-[#16181F] to-[#8B5CF6]/20 border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-1 ring-[#8B5CF6]`
                        : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#8B5CF6]/40 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-1.5">
                        <div className={`p-1.5 rounded-[6px] ${isSelected ? 'bg-[#8B5CF6]/25 text-[#C084FC]' : 'bg-[#16181F] text-[#94A3B8]'}`}>
                          <FormatIcon className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${fOption.badgeClass}`}>
                          {fOption.tag}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#F8FAFC]">
                        {fOption.name}
                      </h4>
                      <p className="text-[10px] text-[#94A3B8] leading-snug">
                        {fOption.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#2A2E3D] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                      <span>{fOption.tracksCount} {fOption.tracksCount === 1 ? 'Pista' : 'Pistas'}</span>
                      <span className="text-rose-400">-{fOption.energyCost}% Ene</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: FULL CUSTOMIZATION (Title, Credits, Genres, Producer, Budgets, Longevity) */}
          <div className="bg-[#0B0C10] border border-[#2A2E3D] rounded-2xl p-5 space-y-5 shadow-inner">
            <div className="flex items-center gap-2 border-b border-[#2A2E3D] pb-3">
              <Sliders className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                2. Personalización Creativa & Producción Integral
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Title, Credits Format, Genres */}
              <div className="space-y-4">
                {/* Project Title */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase text-[#F8FAFC]">
                      Nombre del Proyecto *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateTitle}
                      className="text-[11px] text-[#C084FC] hover:text-[#E879F9] underline font-bold cursor-pointer transition-colors"
                    >
                      Generar Título Aleatorio
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ej: Oasis, Modo Diablo, Fuego Cruzado..."
                    className="w-full bg-[#16181F] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3.5 py-2 text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
                  />
                </div>

                {/* Credits Format Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#F8FAFC] mb-1.5">
                    Formato de Créditos en Portada & Plataformas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'player_feat_target', label: `${player.name} ft. ${targetArtist?.name || 'Artista'}` },
                      { id: 'target_feat_player', label: `${targetArtist?.name || 'Artista'} ft. ${player.name}` },
                      { id: 'player_and_target', label: `${player.name} & ${targetArtist?.name || 'Artista'}` },
                      { id: 'player_x_target', label: `${player.name} x ${targetArtist?.name || 'Artista'}` }
                    ].map(cOption => {
                      const isSelected = creditFormat === cOption.id;
                      return (
                        <div
                          key={cOption.id}
                          onClick={() => {
                            playSound('click');
                            setCreditFormat(cOption.id as CreditFormat);
                          }}
                          className={`p-2 rounded-lg border text-center transition-all cursor-pointer truncate ${
                            isSelected
                              ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F8FAFC] font-bold shadow-xs'
                              : 'bg-[#16181F] border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC]'
                          }`}
                        >
                          <span className="text-[11px] truncate block">{cOption.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Genre & Subgenre */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#F8FAFC] mb-1.5">
                      Género Principal
                    </label>
                    <select
                      value={genreId}
                      onChange={e => {
                        setGenreId(e.target.value);
                        setSubGenreId('');
                      }}
                      className="w-full bg-[#16181F] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                    >
                      {Object.values(world.genres).map(g => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#F8FAFC] mb-1.5">
                      Subgénero / Estilo
                    </label>
                    <select
                      value={subGenreId}
                      onChange={e => setSubGenreId(e.target.value)}
                      className="w-full bg-[#16181F] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                    >
                      <option value="">Fusión Estándar</option>
                      {availableSubgenres.map(sg => (
                        <option key={sg.id} value={sg.id}>
                          {sg.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Producer Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#F8FAFC] mb-1.5">
                    Productor Musical / Beatmaker
                  </label>
                  <select
                    value={producerId}
                    onChange={e => setProducerId(e.target.value)}
                    className="w-full bg-[#16181F] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                  >
                    <option value="">Home Studio / Producción Conjunta ($0)</option>
                    {(Object.values(world.producers) as Producer[]).map(p => {
                      const check = IndustryEngine.canWorkWithProducer(player, p);
                      return (
                        <option key={p.id} value={p.id} disabled={!check.canWork}>
                          {check.canWork ? '' : '🔒 '}{p.name} (+{p.qualityBoost}% Calidad) — ${p.costPerTrack.toLocaleString()}/track {!check.canWork ? `[Bloqueado: ${check.missingReasons[0] || ''}]` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Right Column: Budgets Sliders & Longevity Curve */}
              <div className="space-y-4">
                {/* Budgets Sliders */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#16181F] p-3.5 rounded-xl border border-[#2A2E3D] space-y-1">
                    <span className="block text-[11px] font-semibold text-[#F59E0B]">
                      Presupuesto de Producción
                    </span>
                    <div className="text-xs font-bold font-mono text-[#F59E0B]">
                      {budgetProduction === 0 ? '$0 (Básico)' : `$${budgetProduction.toLocaleString()}`}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      step="500"
                      value={budgetProduction}
                      onChange={e => setBudgetProduction(Number(e.target.value))}
                      className="w-full accent-[#F59E0B]"
                    />
                  </div>

                  <div className="bg-[#16181F] p-3.5 rounded-xl border border-[#2A2E3D] space-y-1">
                    <span className="block text-[11px] font-semibold text-emerald-400">
                      Presupuesto de Marketing
                    </span>
                    <div className="text-xs font-bold font-mono text-emerald-400">
                      {budgetMarketing === 0 ? '$0 (Orgánico)' : `$${budgetMarketing.toLocaleString()}`}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      step="500"
                      value={budgetMarketing}
                      onChange={e => setBudgetMarketing(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Longevity Curve Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#F8FAFC] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
                    Curva de Longevidad Estimada
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {LONGEVITY_OPTIONS.map(lOpt => {
                      const isSelected = longevityCurve === lOpt.id;
                      const LIcon = lOpt.icon;
                      return (
                        <div
                          key={lOpt.id}
                          onClick={() => {
                            playSound('click');
                            setLongevityCurve(lOpt.id);
                          }}
                          className={`p-2.5 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#8B5CF6]/25 to-[#06B6D4]/25 border-[#06B6D4] text-[#F8FAFC]'
                              : 'bg-[#16181F] border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <LIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
                            <div className="min-w-0">
                              <span className="font-bold text-[11px] block text-[#F8FAFC]">{lOpt.label}</span>
                              <span className="text-[10px] text-[#94A3B8] truncate block">{lOpt.description}</span>
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border shrink-0 ${
                            isSelected ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' : 'bg-[#0B0C10] border-[#2A2E3D] text-[#94A3B8]'
                          }`}>
                            {lOpt.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cost Breakdown & Feasibility Card */}
                <div className={`p-3.5 rounded-xl border space-y-1.5 text-[11px] font-mono ${
                  isFundsInsufficient || isEnergyInsufficient
                    ? 'bg-rose-950/20 border-rose-500/40 shadow-xs'
                    : 'bg-[#16181F] border-[#2A2E3D]'
                }`}>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Producción + Marketing:</span>
                    <span className="text-[#F8FAFC] font-semibold">${(budgetProduction + budgetMarketing).toLocaleString()}</span>
                  </div>
                  {selectedProducer && (
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Beatmaker ({selectedProducer.name}):</span>
                      <span className="text-[#F8FAFC] font-semibold">+${producerFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#94A3B8] pt-1 border-t border-[#2A2E3D]">
                    <span className="font-bold text-[#F8FAFC]">Costo Total Inversión:</span>
                    <span className={`font-bold ${isFundsInsufficient ? 'text-rose-400' : 'text-[#C084FC]'}`}>
                      ${totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Energía Requerida:</span>
                    <span className={`font-semibold ${isEnergyInsufficient ? 'text-rose-400' : 'text-[#F8FAFC]'}`}>
                      -{selectedFormatConfig.energyCost}% (Disponible: {player.stats.energy}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Fondos Disponibles:</span>
                    <span className={`font-bold ${isFundsInsufficient ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ${player.stats.funds.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: REJECTION FEEDBACK ALERT (If rejected) */}
          {rejectionFeedback && (
            <div className="bg-gradient-to-r from-rose-950/60 via-[#16181F] to-rose-950/40 border border-rose-500/40 rounded-xl p-4 space-y-2 text-xs shadow-md animate-fade-in">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Propuesta Rechazada por {targetArtist.name}</span>
              </div>
              <p className="text-rose-200/90 leading-relaxed">
                {rejectionFeedback.reason}
              </p>
              <div className="p-2.5 rounded-[6px] bg-[#0B0C10] border border-rose-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Consejo Estratégico:</strong> {rejectionFeedback.advice}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#2A2E3D] bg-[#16181F]/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="text-xs text-[#94A3B8] text-center sm:text-left">
            {isFundsInsufficient ? (
              <span className="text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Fondos insuficientes para este presupuesto.
              </span>
            ) : isEnergyInsufficient ? (
              <span className="text-rose-400 flex items-center gap-1 font-medium">
                <Zap className="w-3.5 h-3.5" /> Energía insuficiente (requiere {selectedFormatConfig.energyCost}%).
              </span>
            ) : (
              <span>
                Crédito oficial: <strong className="text-[#F8FAFC]">"{getCreditPreview()}"</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-[6px] text-xs font-semibold bg-[#0B0C10] hover:bg-white/[0.04] text-[#CBD5E1] border border-[#2A2E3D] transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSendProposal}
              disabled={isNegotiating || isFundsInsufficient || isEnergyInsufficient || !title.trim()}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-[6px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isNegotiating || isFundsInsufficient || isEnergyInsufficient || !title.trim()
                  ? 'bg-[#2A2E3D] text-[#64748B] cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-98 cursor-pointer'
              }`}
            >
              {isNegotiating ? (
                <>
                  <Volume2 className="w-4 h-4 text-white animate-spin" />
                  <span>Negociando y Masterizando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Enviar Propuesta & Grabar Colaboración</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
