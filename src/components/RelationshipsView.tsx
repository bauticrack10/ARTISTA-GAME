import React, { useState, useEffect, useMemo } from 'react';
import { Artist, WorldState, EcosystemNPC, BeefState, InteractionResult, ArtistRelationship, SocialActionResult, CareerStage } from '../types';
import { RelationshipEngine } from '../systems/RelationshipEngine';
import {
  Network,
  Heart,
  Flame,
  MessageSquare,
  Swords,
  Sparkles,
  UserCheck,
  ShieldCheck,
  User,
  Radio,
  Volume2,
  AlertTriangle,
  Zap,
  Coffee,
  DollarSign,
  Lock,
  Clock,
  Newspaper,
  TrendingUp,
  X,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Info,
  Globe,
  Disc3,
  RotateCcw,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audioSystem';
import { formatCompactNumber, cleanQuotes, sanitizeString } from '../utils/formatters';

export const COUNTRY_FLAG_MAP: Record<string, string> = {
  Argentina: '🇦🇷',
  México: '🇲🇽',
  Mexico: '🇲🇽',
  España: '🇪🇸',
  Spain: '🇪🇸',
  'Puerto Rico': '🇵🇷',
  Colombia: '🇨🇴',
  Chile: '🇨🇱',
  Uruguay: '🇺🇾',
  Brasil: '🇧🇷',
  Brazil: '🇧🇷',
  'Estados Unidos': '🇺🇸',
  USA: '🇺🇸',
  'EE. UU.': '🇺🇸',
  Canadá: '🇨🇦',
  Canada: '🇨🇦',
  'Reino Unido': '🇬🇧',
  UK: '🇬🇧',
  Francia: '🇫🇷',
  France: '🇫🇷',
  Alemania: '🇩🇪',
  Germany: '🇩🇪',
  Italia: '🇮🇹',
  Italy: '🇮🇹',
  Portugal: '🇵🇹',
  'Países Bajos': '🇳🇱',
  Netherlands: '🇳🇱',
  Bélgica: '🇧🇪',
  Belgium: '🇧🇪',
  Suecia: '🇸🇪',
  Sweden: '🇸🇪',
  Noruega: '🇳🇴',
  Norway: '🇳🇴',
  Irlanda: '🇮🇪',
  Ireland: '🇮🇪',
  Australia: '🇦🇺',
  'Nueva Zelanda': '🇳🇿',
  'New Zealand': '🇳🇿',
  Nigeria: '🇳🇬',
  Sudáfrica: '🇿🇦',
  'South Africa': '🇿🇦',
  Ghana: '🇬🇭',
  Marruecos: '🇲🇦',
  Morocco: '🇲🇦',
  Egipto: '🇪🇬',
  Egypt: '🇪🇬',
  India: '🇮🇳',
  'Corea del Sur': '🇰🇷',
  'South Korea': '🇰🇷',
  Corea: '🇰🇷',
  Japón: '🇯🇵',
  Japan: '🇯🇵',
  Filipinas: '🇵🇭',
  Philippines: '🇵🇭',
  Indonesia: '🇮🇩',
  Turquía: '🇹🇷',
  Turkey: '🇹🇷',
  Polonia: '🇵🇱',
  Poland: '🇵🇱',
  'República Dominicana': '🇩🇴',
  'Dominican Republic': '🇩🇴',
  Jamaica: '🇯🇲'
};

export function getCountryFlag(countryName?: string, countryCode?: string): string {
  if (countryName && COUNTRY_FLAG_MAP[countryName]) return COUNTRY_FLAG_MAP[countryName];
  if (countryCode) {
    const code = countryCode.toUpperCase();
    const codeMap: Record<string, string> = {
      AR: '🇦🇷', MX: '🇲🇽', ES: '🇪🇸', PR: '🇵🇷', CO: '🇨🇴', CL: '🇨🇱', UY: '🇺🇾', BR: '🇧🇷',
      US: '🇺🇸', CA: '🇨🇦', GB: '🇬🇧', UK: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', IT: '🇮🇹', PT: '🇵🇹',
      NL: '🇳🇱', BE: '🇧🇪', SE: '🇸🇪', NO: '🇳🇴', IE: '🇮🇪', AU: '🇦🇺', NZ: '🇳🇿', NG: '🇳🇬',
      ZA: '🇿🇦', GH: '🇬🇭', MA: '🇲🇦', EG: '🇪🇬', IN: '🇮🇳', KR: '🇰🇷', JP: '🇯🇵', PH: '🇵🇭',
      ID: '🇮🇩', TR: '🇹🇷', PL: '🇵🇱', DO: '🇩🇴', JM: '🇯🇲'
    };
    if (codeMap[code]) return codeMap[code];
  }
  if (countryName) {
    for (const [key, flag] of Object.entries(COUNTRY_FLAG_MAP)) {
      if (countryName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(countryName.toLowerCase())) {
        return flag;
      }
    }
  }
  return '🌍';
}

export const REGION_FILTER_OPTIONS = [
  { id: 'all', label: 'Todas las Regiones / Escenas' },
  { id: 'my_scene', label: 'Mi Escena Local / Nacional' },
  { id: 'Argentina', label: 'Argentina', flag: '🇦🇷' },
  { id: 'México', label: 'México', flag: '🇲🇽' },
  { id: 'Estados Unidos', label: 'USA / EE. UU.', flag: '🇺🇸' },
  { id: 'España', label: 'España', flag: '🇪🇸' },
  { id: 'Colombia', label: 'Colombia', flag: '🇨🇴' },
  { id: 'Puerto Rico', label: 'Puerto Rico', flag: '🇵🇷' },
  { id: 'Brasil', label: 'Brasil', flag: '🇧🇷' },
  { id: 'Reino Unido', label: 'Reino Unido', flag: '🇬🇧' },
  { id: 'Corea del Sur', label: 'Corea del Sur', flag: '🇰🇷' },
  { id: 'Japón', label: 'Japón', flag: '🇯🇵' },
  { id: 'Nigeria', label: 'Nigeria', flag: '🇳🇬' },
  { id: 'Chile', label: 'Chile', flag: '🇨🇱' },
  { id: 'Uruguay', label: 'Uruguay', flag: '🇺🇾' },
  { id: 'República Dominicana', label: 'República Dominicana', flag: '🇩🇴' },
  { id: 'Canadá', label: 'Canadá', flag: '🇨🇦' },
  { id: 'Francia', label: 'Francia', flag: '🇫🇷' },
  { id: 'Alemania', label: 'Alemania', flag: '🇩🇪' },
  { id: 'Italia', label: 'Italia', flag: '🇮🇹' },
  { id: 'Portugal', label: 'Portugal', flag: '🇵🇹' },
  { id: 'Países Bajos', label: 'Países Bajos', flag: '🇳🇱' },
  { id: 'Bélgica', label: 'Bélgica', flag: '🇧🇪' },
  { id: 'Suecia', label: 'Suecia', flag: '🇸🇪' },
  { id: 'Noruega', label: 'Noruega', flag: '🇳🇴' },
  { id: 'Irlanda', label: 'Irlanda', flag: '🇮🇪' },
  { id: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { id: 'Nueva Zelanda', label: 'Nueva Zelanda', flag: '🇳🇿' },
  { id: 'Sudáfrica', label: 'Sudáfrica', flag: '🇿🇦' },
  { id: 'Ghana', label: 'Ghana', flag: '🇬🇭' },
  { id: 'Marruecos', label: 'Marruecos', flag: '🇲🇦' },
  { id: 'Egipto', label: 'Egipto', flag: '🇪🇬' },
  { id: 'India', label: 'India', flag: '🇮🇳' },
  { id: 'Filipinas', label: 'Filipinas', flag: '🇵🇭' },
  { id: 'Indonesia', label: 'Indonesia', flag: '🇮🇩' },
  { id: 'Turquía', label: 'Turquía', flag: '🇹🇷' },
  { id: 'Polonia', label: 'Polonia', flag: '🇵🇱' },
  { id: 'Jamaica', label: 'Jamaica', flag: '🇯🇲' }
];

export const GENRE_FILTER_OPTIONS = [
  { id: 'all', label: 'Todos los Géneros' },
  { id: 'trap_latino', label: 'Trap Latino' },
  { id: 'reggaeton', label: 'Reggaetón' },
  { id: 'hip_hop_rap', label: 'Hip Hop / Rap' },
  { id: 'pop_moderno', label: 'Pop Moderno' },
  { id: 'rock_alternativo', label: 'Rock Alternativo' },
  { id: 'r_and_b_soul', label: 'R&B / Soul' },
  { id: 'musica_electronica', label: 'Electrónica' },
  { id: 'drill', label: 'Drill' },
  { id: 'afrobeat_dancehall', label: 'Afrobeats' },
  { id: 'corridos_urbanos', label: 'Corridos' },
  { id: 'kpop_jpop', label: 'K-Pop & J-Pop' },
  { id: 'cumbia_tropical', label: 'Cumbia Tropical' },
  { id: 'metal_punk', label: 'Metal & Punk' },
  { id: 'funk_brasilero', label: 'Funk Brasileño' },
  { id: 'country_folk', label: 'Country & Folk' },
  { id: 'jazz_bossa', label: 'Jazz & Bossa Nova' }
];

export const STAGE_FILTER_OPTIONS = [
  { id: 'all', label: 'Todos los Niveles' },
  { id: 'underground_emerging', label: 'Underground / Emergente' },
  { id: 'established_mainstream', label: 'Consagrado / Mainstream' },
  { id: 'superstar_legend', label: 'Superestrella / Leyenda' }
];

export const STATUS_FILTER_OPTIONS = [
  { id: 'active', label: 'Activos' },
  { id: 'collab_available', label: 'Disponibles para Colaborar' },
  { id: 'retired', label: 'Retirados / Históricos' },
  { id: 'all', label: 'Todos los Estados' }
];

interface RelationshipsViewProps {
  player: Artist;
  world: WorldState;
  onInteract: (targetArtistId: string, actionType: 'collab_request' | 'shoutout' | 'diss') => InteractionResult | SocialActionResult | any;
  onOpenCollabModal?: (artistId: string) => void;
  onInteractEcosystemNPC?: (npcId: string, action: 'collab_beat' | 'buy_exclusive' | 'hang_out' | 'call_out') => void;
  onInteractBeef?: (targetName: string, targetId: string, action: 'respond_social' | 'drop_diss' | 'ignore') => void;
}

export const RelationshipsView: React.FC<RelationshipsViewProps> = ({
  player,
  world,
  onInteract,
  onOpenCollabModal,
  onInteractEcosystemNPC,
  onInteractBeef
}) => {
  const [filter, setFilter] = useState<'all' | 'friends' | 'collabs' | 'rivals' | 'feuds' | 'ecosystem'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'collab_available' | 'retired' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalResult, setActiveModalResult] = useState<InteractionResult | null>(null);

  const allArtists = Object.values(world?.artists || {}) as Artist[];
  const otherArtists = allArtists.filter(a => a.id !== player?.id);
  const ecosystemContacts = Object.values(world?.ecosystemContacts || {}) as EcosystemNPC[];
  const activeBeefs = Object.values(world?.activeBeefs || {}) as BeefState[];

  // Trigger celebration confetti on triumphant interaction results
  useEffect(() => {
    if (activeModalResult) {
      if (
        activeModalResult.title.includes('Victoria') ||
        activeModalResult.title.includes('Viral') ||
        activeModalResult.title.includes('Acordada')
      ) {
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FF4F00', '#FF2A4B', '#10B981', '#D4AF37', '#F59E0B']
          });
        } catch (e) {
          // ignore if canvas unavailable
        }
      }
    }
  }, [activeModalResult]);

  // 1. Helper for Relationship State Badges according to design.md
  const getRelationshipBadge = (rel?: ArtistRelationship) => {
    if (!rel) {
      return {
        key: 'neutral',
        label: 'Neutral',
        className: 'bg-[#1C1C21] text-[#8E8E99] border border-[#26262B] font-sans',
        dotClass: 'bg-[#52525B]'
      };
    }

    // Feudo Activo (Clipping Red #EF4444)
    if (rel.relationType === 'feud' || rel.affinity <= -40) {
      return {
        key: 'feud',
        label: 'Feudo Activo',
        className: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/40 font-sans font-bold',
        dotClass: 'bg-[#EF4444]'
      };
    }

    // Rivalidad (VU-Meter Amber #F59E0B)
    if (rel.relationType === 'rival' || rel.affinity < -15) {
      return {
        key: 'rival',
        label: 'Rivalidad',
        className: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/40 font-sans font-bold',
        dotClass: 'bg-[#F59E0B]'
      };
    }

    // Colaboradores (Console Green #10B981)
    if (rel.relationType === 'collaborator' || (rel.pastCollabsCount && rel.pastCollabsCount > 0)) {
      return {
        key: 'collaborator',
        label: 'Colaboradores',
        className: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/40 font-sans font-bold',
        dotClass: 'bg-[#10B981]'
      };
    }

    // Amistad (REC Red #FF2A4B)
    if (rel.relationType === 'friend' || rel.affinity >= 35) {
      return {
        key: 'friend',
        label: 'Amistad',
        className: 'bg-[#FF2A4B]/10 text-[#FF2A4B] border border-[#FF2A4B]/40 font-sans font-bold',
        dotClass: 'bg-[#FF2A4B]'
      };
    }

    // Respeto Mutuo (Bone White #F4F0EA)
    if (rel.relationType === 'mentor' || rel.relationType === 'protege' || (rel.respect >= 65 && rel.affinity >= 10)) {
      return {
        key: 'respect',
        label: 'Respeto Mutuo',
        className: 'bg-[#1C1C21] text-[#F4F0EA] border border-[#26262B] font-sans font-bold',
        dotClass: 'bg-[#F4F0EA]'
      };
    }

    // Neutral
    return {
      key: 'neutral',
      label: 'Neutral',
      className: 'bg-[#1C1C21] text-[#8E8E99] border border-[#26262B] font-sans',
      dotClass: 'bg-[#52525B]'
    };
  };

  const getEcosystemBadge = (roleType?: EcosystemNPC['type'] | EcosystemNPC['roleType']) => {
    switch (roleType) {
      case 'beatmaker_barrio':
        return { label: 'Beatmaker de Confianza', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/40' };
      case 'manager_chanta':
        return { label: 'Manager / Intermediario', color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/40' };
      case 'critico_hater':
        return { label: 'Crítica / Prensa Hostil', color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/40' };
      case 'rival_escena':
        return { label: 'Rival Directo de Escena', color: 'bg-[#FF2A4B]/10 text-[#FF2A4B] border-[#FF2A4B]/40' };
      default:
        return { label: 'Contacto Urbano', color: 'bg-[#1C1C21] text-[#F4F0EA] border-[#26262B]' };
    }
  };

  const getBeefStageBadge = (stage: BeefState['stage']) => {
    switch (stage) {
      case 'tension':
        return { label: 'Tensión Creciente', color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/40' };
      case 'social_beef':
        return { label: 'Cruce en Redes', color: 'bg-[#FF2A4B]/10 text-[#FF2A4B] border-[#FF2A4B]/40' };
      case 'diss_tracks':
        return { label: 'Guerra de Tiraderas', color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/40 font-bold' };
      case 'all_out_war':
        return { label: 'Conflicto Total', color: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50 font-bold' };
      case 'settled':
        return { label: 'Tregua / Resuelto', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/40' };
      default:
        return { label: 'Activo', color: 'bg-[#1C1C21] text-[#F4F0EA] border-[#26262B]' };
    }
  };

  // Execution handler with Narrative Modal trigger
  const handleExecuteInteraction = (targetArtist: Artist, actionType: 'collab_request' | 'shoutout' | 'diss') => {
    if (actionType === 'collab_request') {
      if (onOpenCollabModal) {
        onOpenCollabModal(targetArtist.id);
      } else {
        const res = onInteract(targetArtist.id, 'collab_request');
        if (res && typeof res === 'object' && 'badge' in res) {
          setActiveModalResult(res as InteractionResult);
        }
      }
      return;
    }

    if (actionType === 'shoutout') {
      const check = RelationshipEngine.canSendShoutout(player, targetArtist, world.currentYear, world.currentMonth);
      if (!check.canPerform && !check.canSend) {
        alert(check.reason || 'Acción en cooldown');
        return;
      }
      playSound('release');
    } else if (actionType === 'diss') {
      const check = RelationshipEngine.canSendDiss(player, targetArtist, world.currentYear, world.currentMonth);
      if (!check.canPerform && !check.canSend) {
        alert(check.reason || 'Acción en cooldown');
        return;
      }
      playSound('chart_no1');
    }

    const res = onInteract(targetArtist.id, actionType);
    if (res && typeof res === 'object') {
      if ('badge' in res) {
        setActiveModalResult(res as InteractionResult);
      } else {
        setActiveModalResult(RelationshipEngine.toInteractionResult(res as any));
      }
    }
  };

  // Check if any advanced filter is currently active
  const hasActiveFilters =
    regionFilter !== 'all' ||
    genreFilter !== 'all' ||
    stageFilter !== 'all' ||
    statusFilter !== 'active' ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    playSound('click');
    setRegionFilter('all');
    setGenreFilter('all');
    setStageFilter('all');
    setStatusFilter('active');
    setSearchQuery('');
  };

  // Comprehensive multi-criteria filter logic
  const filteredArtists = useMemo(() => {
    return otherArtists.filter(a => {
      // 1. Status Filter
      if (statusFilter === 'active') {
        if (a.isRetired || a.careerStage === 'Retired') return false;
      } else if (statusFilter === 'retired') {
        if (!a.isRetired && a.careerStage !== 'Retired' && a.careerStage !== 'Legend') return false;
      } else if (statusFilter === 'collab_available') {
        if (a.isRetired || a.careerStage === 'Retired') return false;
        const rel = player.relationships[a.id];
        if (rel && (rel.relationType === 'feud' || rel.affinity <= -40)) return false;
      }

      // 2. Relation Category Filter (from main tabs)
      const rel = player.relationships[a.id];
      const badge = getRelationshipBadge(rel);
      if (filter === 'friends' && badge.key !== 'friend' && badge.key !== 'respect') return false;
      if (filter === 'collabs' && badge.key !== 'collaborator') return false;
      if (filter === 'rivals' && badge.key !== 'rival') return false;
      if (filter === 'feuds' && badge.key !== 'feud') return false;

      // 3. Region / Scene Filter
      if (regionFilter === 'my_scene') {
        const pCountry = (player.country || '').toLowerCase().trim();
        const aCountry = (a.country || '').toLowerCase().trim();
        const pCode = (player.countryCode || '').toLowerCase().trim();
        const aCode = (a.countryCode || '').toLowerCase().trim();
        const matchesCountry = pCountry && aCountry && (aCountry.includes(pCountry) || pCountry.includes(aCountry));
        const matchesCode = pCode && aCode && pCode === aCode;
        if (!matchesCountry && !matchesCode) return false;
      } else if (regionFilter !== 'all') {
        const qReg = regionFilter.toLowerCase().trim();
        const aCountry = (a.country || '').toLowerCase().trim();
        const aCode = (a.countryCode || '').toLowerCase().trim();
        let matches = aCountry.includes(qReg) || aCode === qReg;
        if (!matches) {
          if (qReg === 'estados unidos' || qReg === 'usa') {
            matches = aCountry.includes('estados unidos') || aCountry.includes('usa') || aCode === 'us';
          } else if (qReg === 'reino unido' || qReg === 'uk') {
            matches = aCountry.includes('reino unido') || aCountry.includes('uk') || aCode === 'gb';
          } else if (qReg === 'corea del sur' || qReg === 'corea') {
            matches = aCountry.includes('corea') || aCode === 'kr';
          }
        }
        if (!matches) return false;
      }

      // 4. Genre Filter
      if (genreFilter !== 'all') {
        const matchMain = a.mainGenreId === genreFilter;
        const matchSub = a.subGenreIds && a.subGenreIds.includes(genreFilter);
        if (!matchMain && !matchSub) return false;
      }

      // 5. Stage / Fame Filter
      if (stageFilter === 'underground_emerging') {
        const allowed: CareerStage[] = ['Underground', 'Emerging', 'Breakout'];
        if (!allowed.includes(a.careerStage)) return false;
      } else if (stageFilter === 'established_mainstream') {
        const allowed: CareerStage[] = ['Established', 'Mainstream', 'Veteran', 'Comeback'];
        if (!allowed.includes(a.careerStage)) return false;
      } else if (stageFilter === 'superstar_legend') {
        const allowed: CareerStage[] = ['Superstar', 'Legend'];
        if (!allowed.includes(a.careerStage)) return false;
      }

      // 6. Search Query (name, realName, country, city, genre)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const genreName = (world.genres[a.mainGenreId]?.name || a.mainGenreId).toLowerCase();
        const name = (a.name || '').toLowerCase();
        const realName = (a.realName || '').toLowerCase();
        const country = (a.country || '').toLowerCase();
        const city = (a.city || '').toLowerCase();

        const matches =
          name.includes(q) ||
          realName.includes(q) ||
          country.includes(q) ||
          city.includes(q) ||
          genreName.includes(q);

        if (!matches) return false;
      }

      return true;
    });
  }, [otherArtists, player, filter, regionFilter, genreFilter, stageFilter, statusFilter, searchQuery, world.genres]);

  return (
    <div className="space-y-6 pb-16 text-[#F4F0EA]">
      {/* Unified Compact Control Bar */}
      <div className="liquid-glass-card p-5 space-y-4">
        {/* Row 1: Title & View Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[4px] liquid-glass-pill text-[#FF4F00]">
              <Network className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#F4F0EA]">
              Ecosistema & Vínculos
            </h1>
            <span className="text-xs text-[#8E8E99] font-sans tabular-nums pl-1">
              ({filteredArtists.length} artistas)
            </span>
          </div>

          {/* View Pills */}
          <div className="flex items-center gap-1 liquid-glass-pill p-1 text-xs font-sans font-bold overflow-x-auto">
            <button
              onClick={() => { playSound('click'); setFilter('all'); }}
              className={`px-3 py-1 rounded-[4px] transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                filter === 'all'
                  ? 'bg-[#FF4F00] text-[#F4F0EA] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                  : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-white/5'
              }`}
            >
              Todos ({otherArtists.length})
            </button>
            <button
              onClick={() => { playSound('click'); setFilter('friends'); }}
              className={`px-3 py-1 rounded-[4px] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filter === 'friends'
                  ? 'bg-[#FF2A4B] text-[#F4F0EA]'
                  : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Amistad</span>
            </button>
            <button
              onClick={() => { playSound('click'); setFilter('collabs'); }}
              className={`px-3 py-1 rounded-[4px] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filter === 'collabs'
                  ? 'bg-[#FF2A4B] text-[#F4F0EA]'
                  : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Colabs</span>
            </button>
            <button
              onClick={() => { playSound('click'); setFilter('rivals'); }}
              className={`px-3 py-1 rounded-[4px] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filter === 'rivals'
                  ? 'bg-[#FF2A4B] text-[#F4F0EA]'
                  : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Rivales</span>
            </button>
            <button
              onClick={() => { playSound('click'); setFilter('feuds'); }}
              className={`px-3 py-1 rounded-[4px] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 tabular-nums ${
                filter === 'feuds'
                  ? 'bg-[#FF2A4B] text-[#F4F0EA]'
                  : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21]'
              }`}
            >
              <Swords className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Feudos ({activeBeefs.length})</span>
            </button>
            <button
              onClick={() => { playSound('click'); setFilter('ecosystem'); }}
              className={`px-3 py-1 rounded-[4px] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 tabular-nums ${
                filter === 'ecosystem'
                  ? 'bg-[#FF2A4B] text-[#F4F0EA]'
                  : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Contactos ({ecosystemContacts.length})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Inline Search & Compact Selectors (Región, Género, Estado) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#26262B] font-sans text-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#8E8E99] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Buscar artista, país o género..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#26262B] rounded-[4px] pl-8 pr-7 py-1.5 text-xs font-sans text-[#F4F0EA] placeholder-[#52525B] focus:outline-none focus:border-[#FF2A4B] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8E8E99] hover:text-[#F4F0EA] p-0.5 cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            )}
          </div>

          {/* Selector: Región */}
          <select
            aria-label="Región"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className={`bg-[#0B0B0C] border rounded-[4px] px-2.5 py-1.5 text-xs text-[#F4F0EA] focus:outline-none focus:border-[#FF2A4B] cursor-pointer transition-colors ${
              regionFilter !== 'all' ? 'border-[#10B981] text-[#10B981] font-bold' : 'border-[#26262B]'
            }`}
          >
            {REGION_FILTER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[#141417] text-[#F4F0EA]">
                {opt.id === 'my_scene'
                  ? `Mi Escena (${player.country || 'Local'})`
                  : opt.label}
              </option>
            ))}
          </select>

          {/* Selector: Género */}
          <select
            aria-label="Género"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className={`bg-[#0B0B0C] border rounded-[4px] px-2.5 py-1.5 text-xs text-[#F4F0EA] focus:outline-none focus:border-[#FF2A4B] cursor-pointer transition-colors ${
              genreFilter !== 'all' ? 'border-[#FF2A4B] text-[#FF2A4B] font-bold' : 'border-[#26262B]'
            }`}
          >
            {GENRE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[#141417] text-[#F4F0EA]">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Selector: Estado */}
          <select
            aria-label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className={`bg-[#0B0B0C] border rounded-[4px] px-2.5 py-1.5 text-xs text-[#F4F0EA] focus:outline-none focus:border-[#FF2A4B] cursor-pointer transition-colors ${
              statusFilter !== 'active' ? 'border-[#10B981] text-[#10B981] font-bold' : 'border-[#26262B]'
            }`}
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[#141417] text-[#F4F0EA]">
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-bold text-[#EF4444] hover:text-[#F4F0EA] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 px-2.5 py-1.5 rounded-[4px] transition-colors cursor-pointer"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: Active Beefs & Feuds Banner */}
      {activeBeefs.length > 0 && filter !== 'ecosystem' && filter !== 'friends' && filter !== 'collabs' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-[#EF4444]" strokeWidth={1.75} />
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#F4F0EA] tabular-nums">
              Tiraderas & Feudos Activos ({activeBeefs.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBeefs.map((beef) => {
              const stageBadge = getBeefStageBadge(beef.stage);

              return (
                <div
                  key={beef.id}
                  className="liquid-glass-subcard border-[#EF4444]/40 rounded-[12px] p-4 space-y-3.5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[4px] bg-[#1C1C21] text-[#EF4444] flex items-center justify-center font-sans font-bold text-xs border border-[#EF4444]/40 shrink-0">
                        VS
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-[#F4F0EA] tracking-tight">
                          {beef.targetName}
                        </h3>
                        <span className="text-xs text-[#8E8E99] flex items-center gap-1 mt-0.5 font-sans tabular-nums">
                          <TrendingUp className="w-3 h-3 text-[#FF2A4B]" strokeWidth={1.75} />
                          Hype: <strong className="text-[#FF2A4B] font-semibold">+{beef.hypeGenerated || 25}</strong>
                        </span>
                      </div>
                    </div>

                    <span className={`text-2xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-[4px] border ${stageBadge.color}`}>
                      {stageBadge.label}
                    </span>
                  </div>

                  {/* Tension Meter */}
                  <div className="space-y-1.5 bg-[#0B0B0C] p-2.5 rounded-[4px] border border-[#26262B]">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8E8E99]">Tensión</span>
                      <span className="font-sans tabular-nums font-bold text-[#EF4444]">{beef.tensionLevel || 50}/100</span>
                    </div>
                    <div className="w-full bg-[#1C1C21] h-1.5 rounded-[2px] overflow-hidden">
                      <div
                        className="h-full bg-[#EF4444] rounded-[2px] transition-all duration-500"
                        role="progressbar"
                        aria-label="Nivel de tensión"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(Number(Math.min(100, beef.tensionLevel || 50)))}
                        style={{ width: `${Math.min(100, beef.tensionLevel || 50)}%` }}
                      />
                    </div>
                  </div>

                  {/* Diss Tracks Exchanged */}
                  {beef.dissTracksExchanged && beef.dissTracksExchanged.length > 0 && (
                    <div className="text-xs text-[#8E8E99] space-y-1 bg-[#0B0B0C] p-2.5 rounded-[4px] border border-[#26262B]">
                      <span className="font-semibold text-[#F4F0EA] flex items-center gap-1">
                        <Radio className="w-3 h-3 text-[#EF4444]" strokeWidth={1.75} />
                        Historial de Tiraderas:
                      </span>
                      <ul className="list-disc list-inside text-2xs italic space-y-0.5 text-[#8E8E99]">
                        {beef.dissTracksExchanged.map((track, i) => (
                          <li key={i} className="truncate">{track}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interactive Beef Action Buttons */}
                  {onInteractBeef && beef.stage !== 'settled' && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#26262B]">
                      <button
                        onClick={() => {
                          playSound('click');
                          onInteractBeef(beef.targetName, beef.targetId, 'respond_social');
                        }}
                        className="bg-[#1C1C21] hover:bg-[#26262B] text-[#F4F0EA] border border-[#26262B] hover:border-[#3F3F46] py-2 px-2 text-xs font-semibold rounded-[4px] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:translate-y-[1px]"
                        title="Responder en Redes (+Hype, chicana pública)"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#FF2A4B]" strokeWidth={1.75} />
                        <span>Chicana</span>
                      </button>

                      <button
                        onClick={() => {
                          playSound('chart_no1');
                          onInteractBeef(beef.targetName, beef.targetId, 'drop_diss');
                        }}
                        className="bg-[#EF4444] hover:bg-[#DC2626] text-[#F4F0EA] font-bold py-2 px-2 text-xs rounded-[4px] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:translate-y-[1px]"
                        title="Lanzar Diss Track demoledor en plataformas"
                      >
                        <Swords className="w-3.5 h-3.5 text-[#F4F0EA]" strokeWidth={1.75} />
                        <span>Diss Track</span>
                      </button>

                      <button
                        onClick={() => {
                          playSound('click');
                          onInteractBeef(beef.targetName, beef.targetId, 'ignore');
                        }}
                        className="bg-[#1C1C21] hover:bg-[#26262B] text-[#8E8E99] hover:text-[#F4F0EA] border border-[#26262B] py-2 px-2 text-xs font-semibold rounded-[4px] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:translate-y-[1px]"
                        title="Ignorar provocaciones (+Disciplina, +Credibilidad)"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8E8E99]" strokeWidth={1.75} />
                        <span>Ignorar</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: Recurrent Ecosystem Characters */}
      {(filter === 'all' || filter === 'ecosystem') && ecosystemContacts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#FF2A4B]" strokeWidth={1.75} />
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#F4F0EA] tabular-nums">
              Contactos del Ecosistema ({ecosystemContacts.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemContacts.map((npc) => {
              const role = npc.roleType || npc.type;
              const badge = getEcosystemBadge(role);

              return (
                <div
                  key={npc.id}
                  className="liquid-glass-subcard rounded-[12px] p-4 space-y-3 flex flex-col justify-between hover:border-white/28 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-[4px] bg-[#1C1C21] text-[#F4F0EA] font-sans font-bold text-sm flex items-center justify-center shrink-0 border border-[#26262B]">
                        {npc.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-sm text-[#F4F0EA] truncate">
                          {npc.name}
                        </h3>
                        <span className={`text-2xs font-semibold px-1.5 py-0.5 rounded-[4px] border ${badge.color} inline-block mt-0.5`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8E8E99] leading-relaxed line-clamp-2">
                      {npc.description || npc.bio}
                    </p>
                  </div>

                  {/* Meters: Afinidad, Lealtad, Tensión */}
                  <div className="space-y-1 bg-[#0B0B0C] p-2.5 rounded-[4px] border border-[#26262B] text-xs font-sans tabular-nums">
                    <div className="flex justify-between">
                      <span className="text-[#8E8E99]">Afinidad</span>
                      <span className={`font-semibold ${npc.affinity > 0 ? 'text-[#10B981]' : npc.affinity < 0 ? 'text-[#EF4444]' : 'text-[#F4F0EA]'}`}>
                        {npc.affinity > 0 ? `+${npc.affinity}` : npc.affinity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E8E99]">Lealtad</span>
                      <span className="font-semibold text-[#F4F0EA]">{npc.loyalty}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E8E99]">Tensión</span>
                      <span className={`font-semibold ${(npc.tension ?? npc.tensionLevel ?? 0) > 40 ? 'text-[#EF4444] font-bold' : 'text-[#F4F0EA]'}`}>
                        {(npc.tension ?? npc.tensionLevel ?? 0)}%
                      </span>
                    </div>
                  </div>

                  {/* NPC Interaction Actions */}
                  {onInteractEcosystemNPC && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#26262B]">
                      {role === 'beatmaker_barrio' && (
                        <>
                          <button
                            onClick={() => { playSound('click'); onInteractEcosystemNPC(npc.id, 'collab_beat'); }}
                            className="bg-[#1C1C21] hover:bg-[#26262B] text-[#F4F0EA] border border-[#26262B] hover:border-[#3F3F46] py-1.5 px-2 text-2xs font-semibold rounded-[4px] flex items-center justify-center gap-1 transition-all cursor-pointer active:translate-y-[1px]"
                            title="Producir beat"
                          >
                            <Volume2 className="w-3 h-3 text-[#FF2A4B]" strokeWidth={1.75} />
                            <span>Sesión Beat</span>
                          </button>
                          <button
                            onClick={() => { playSound('money'); onInteractEcosystemNPC(npc.id, 'buy_exclusive'); }}
                            className="bg-[#1C1C21] hover:bg-[#26262B] text-[#10B981] border border-[#10B981]/30 hover:border-[#10B981]/60 py-1.5 px-2 text-2xs font-semibold rounded-[4px] flex items-center justify-center gap-1 transition-all cursor-pointer active:translate-y-[1px]"
                            title="Comprar instrumental exclusiva ($500)"
                          >
                            <DollarSign className="w-3 h-3 text-[#10B981]" strokeWidth={1.75} />
                            <span>Exclusiva</span>
                          </button>
                        </>
                      )}

                      {role === 'manager_chanta' && (
                        <>
                          <button
                            onClick={() => { playSound('click'); onInteractEcosystemNPC(npc.id, 'hang_out'); }}
                            className="bg-[#1C1C21] hover:bg-[#26262B] text-[#F4F0EA] border border-[#26262B] hover:border-[#3F3F46] py-1.5 px-2 text-2xs font-semibold rounded-[4px] flex items-center justify-center gap-1 transition-all cursor-pointer active:translate-y-[1px]"
                            title="Reunión"
                          >
                            <Coffee className="w-3 h-3 text-[#FF2A4B]" strokeWidth={1.75} />
                            <span>Reunión</span>
                          </button>
                          <button
                            onClick={() => { playSound('click'); onInteractEcosystemNPC(npc.id, 'call_out'); }}
                            className="bg-[#1C1C21] hover:bg-[#26262B] text-[#EF4444] border border-[#EF4444]/30 py-1.5 px-2 text-2xs font-semibold rounded-[4px] flex items-center justify-center gap-1 transition-all cursor-pointer active:translate-y-[1px]"
                            title="Auditar finanzas"
                          >
                            <AlertTriangle className="w-3 h-3 text-[#EF4444]" strokeWidth={1.75} />
                            <span>Auditar</span>
                          </button>
                        </>
                      )}

                      {role === 'critico_hater' && (
                        <button
                          onClick={() => { playSound('chart_no1'); onInteractEcosystemNPC(npc.id, 'call_out'); }}
                          className="bg-[#1C1C21] hover:bg-[#26262B] text-[#FF2A4B] border border-[#FF2A4B]/40 py-1.5 px-2 text-2xs font-semibold rounded-[4px] flex items-center justify-center gap-1 transition-all cursor-pointer col-span-2 active:translate-y-[1px]"
                          title="Desafiar en redes públicas (+Hype)"
                        >
                          <Zap className="w-3 h-3 text-[#FF2A4B]" strokeWidth={1.75} />
                          <span>Desafiar en Redes</span>
                        </button>
                      )}

                      {role === 'rival_escena' && onInteractBeef && (
                        <>
                          <button
                            onClick={() => { playSound('click'); onInteractBeef(npc.name, npc.id, 'respond_social'); }}
                            className="bg-[#1C1C21] hover:bg-[#26262B] text-[#F4F0EA] border border-[#26262B] hover:border-[#3F3F46] py-1.5 px-2 text-2xs font-semibold rounded-[4px] flex items-center justify-center gap-1 transition-all cursor-pointer active:translate-y-[1px]"
                            title="Responder chicanas en redes"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#FF2A4B]" strokeWidth={1.75} />
                            <span>Chicana</span>
                          </button>
                          <button
                            onClick={() => { playSound('chart_no1'); onInteractBeef(npc.name, npc.id, 'drop_diss'); }}
                            className="bg-[#EF4444] hover:bg-[#DC2626] text-[#F4F0EA] font-bold py-1.5 px-2 text-2xs rounded-[4px] flex items-center justify-center gap-1 cursor-pointer transition-all active:translate-y-[1px]"
                            title="Tiradera Lírica"
                          >
                            <Swords className="w-3 h-3 text-[#F4F0EA]" strokeWidth={1.75} />
                            <span>Tiradera</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: Main Artists Roster Grid */}
      {filter !== 'ecosystem' && (
        <div className="space-y-3">
          {filteredArtists.length === 0 ? (
            <div className="bg-[#141417] border border-[#26262B] rounded-[6px] p-8 text-center space-y-2">
              <Info className="w-7 h-7 text-[#52525B] mx-auto" strokeWidth={1.75} />
              <p className="text-sm font-semibold text-[#F4F0EA]">No se encontraron artistas para este filtro</p>
              <p className="text-xs text-[#8E8E99]">Probá cambiando la categoría o limpiando los filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArtists.map((artist) => {
                const rel = player.relationships[artist.id] || {
                  targetArtistId: artist.id,
                  relationType: 'neutral',
                  affinity: 0,
                  respect: 50,
                  pastCollabsCount: 0,
                  history: []
                };

                const badgeConfig = getRelationshipBadge(rel);
                const shoutoutCheck = RelationshipEngine.canSendShoutout(player, artist, world.currentYear, world.currentMonth);
                const dissCheck = RelationshipEngine.canSendDiss(player, artist, world.currentYear, world.currentMonth);

                return (
                  <div
                    key={artist.id}
                    className="liquid-glass-subcard rounded-[12px] p-4 space-y-3.5 flex flex-col justify-between hover:border-white/28 transition-all group"
                  >
                    {/* Header Info & State Badge */}
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] flex items-center justify-center text-[#F4F0EA] font-sans font-bold text-sm shrink-0">
                            {artist.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display font-bold text-sm sm:text-base text-[#F4F0EA] truncate">
                              {artist.name}
                            </h3>
                            <p className="text-xs text-[#8E8E99] truncate">
                              {getCountryFlag(artist.country, artist.countryCode)} {artist.country || 'Global'} • {world.genres[artist.mainGenreId]?.name || artist.mainGenreId}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={`text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] flex items-center gap-1.5 ${badgeConfig.className}`}
                            title={`Estado de relación: ${badgeConfig.label}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-[2px] ${badgeConfig.dotClass}`} />
                            {badgeConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Stat Metrics Bar */}
                      <div className="flex items-center justify-between text-xs text-[#8E8E99] font-sans tabular-nums bg-[#0B0B0C] px-3 py-1.5 rounded-[4px] border border-[#26262B]">
                        <span>Pop: <strong className="text-[#F4F0EA] font-semibold">{artist.stats.popularity}</strong></span>
                        <span>Oyentes: <strong className="text-[#F4F0EA] font-semibold">{formatCompactNumber(artist.stats.monthlyListeners)}</strong></span>
                        <span>Etapa: <strong className="text-[#8E8E99]">{artist.careerStage}</strong></span>
                      </div>
                    </div>

                    {/* Relationship Meters: Afinidad & Respeto */}
                    <div className="space-y-2 bg-[#0B0B0C] p-2.5 rounded-[4px] border border-[#26262B] text-xs font-sans tabular-nums">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#8E8E99]">Afinidad</span>
                          <span className={`font-semibold font-sans tabular-nums ${rel.affinity > 0 ? 'text-[#10B981]' : rel.affinity < 0 ? 'text-[#EF4444]' : 'text-[#F4F0EA]'}`}>
                            {rel.affinity > 0 ? `+${rel.affinity}` : rel.affinity}
                          </span>
                        </div>
                        <div className="w-full bg-[#1C1C21] h-1.5 rounded-[2px] overflow-hidden">
                          <div
                            className={`h-full rounded-[2px] ${rel.affinity < 0 ? 'bg-[#EF4444]' : 'bg-[#FF2A4B]'}`}
                            role="progressbar"
                            aria-label="Afinidad mutua"
                            aria-valuemin={-100}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(Number(rel.affinity))}
                            style={{ width: `${Math.max(8, Math.min(100, (rel.affinity + 100) / 2))}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#8E8E99]">Respeto</span>
                          <span className="font-semibold text-[#10B981] font-sans tabular-nums">{rel.respect}%</span>
                        </div>
                        <div className="w-full bg-[#1C1C21] h-1.5 rounded-[2px] overflow-hidden">
                          <div
                            className="bg-[#10B981] h-full rounded-[2px]"
                            role="progressbar"
                            aria-label="Respeto profesional"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(Number(rel.respect))}
                            style={{ width: `${rel.respect}%` }}
                          />
                        </div>
                      </div>

                      {rel.history && rel.history.length > 0 && (
                        <div className="pt-1.5 border-t border-[#26262B] text-2xs text-[#8E8E99] italic line-clamp-1">
                          Último: "{cleanQuotes(rel.history[rel.history.length - 1])}"
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#26262B]">
                      <button
                        onClick={() => handleExecuteInteraction(artist, 'collab_request')}
                        className="bg-[#FF2A4B] hover:bg-[#E01E3D] text-[#F4F0EA] py-2 px-2 text-xs font-bold rounded-[4px] flex flex-col items-center gap-1 transition-all cursor-pointer active:translate-y-[1px]"
                        title="Proponer Colaboración Musical (Single, EP o Álbum)"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#F4F0EA]" strokeWidth={1.75} />
                        <span>Colab</span>
                      </button>

                      {shoutoutCheck.canPerform || shoutoutCheck.canSend ? (
                        <button
                          onClick={() => handleExecuteInteraction(artist, 'shoutout')}
                          className="bg-[#1C1C21] hover:bg-[#26262B] text-[#10B981] border border-[#10B981]/30 hover:border-[#10B981]/60 py-2 px-2 text-xs font-medium rounded-[4px] flex flex-col items-center gap-1 transition-all cursor-pointer active:translate-y-[1px]"
                          title={shoutoutCheck.probableConsequence || 'Elogio Público (+Afinidad, +Respeto)'}
                        >
                          <Heart className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={1.75} />
                          <span>Elogio</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-[#0B0B0C] text-[#52525B] border border-[#26262B] py-2 px-2 text-2xs font-sans tabular-nums font-medium rounded-[4px] flex flex-col items-center gap-1 opacity-60 cursor-not-allowed"
                          title={`Disponible en Año ${shoutoutCheck.availableYear} • Mes ${shoutoutCheck.availableMonth}`}
                        >
                          <Clock className="w-3.5 h-3.5 text-[#52525B]" strokeWidth={1.75} />
                          <span>{shoutoutCheck.cooldownRemainingMonths}m</span>
                        </button>
                      )}

                      {dissCheck.canPerform || dissCheck.canSend ? (
                        <button
                          onClick={() => handleExecuteInteraction(artist, 'diss')}
                          className="bg-[#1C1C21] hover:bg-[#26262B] text-[#EF4444] border border-[#EF4444]/30 hover:border-[#EF4444]/60 py-2 px-2 text-xs font-medium rounded-[4px] flex flex-col items-center gap-1 transition-all cursor-pointer active:translate-y-[1px]"
                          title={dissCheck.probableConsequence || 'Tiradera / Diss Track'}
                        >
                          <Swords className="w-3.5 h-3.5 text-[#EF4444]" strokeWidth={1.75} />
                          <span>Tiradera</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-[#0B0B0C] text-[#52525B] border border-[#26262B] py-2 px-2 text-2xs font-sans tabular-nums font-medium rounded-[4px] flex flex-col items-center gap-1 opacity-60 cursor-not-allowed"
                          title={`Disponible en Año ${dissCheck.availableYear} • Mes ${dissCheck.availableMonth}`}
                        >
                          <Lock className="w-3.5 h-3.5 text-[#52525B]" strokeWidth={1.75} />
                          <span>{dissCheck.cooldownRemainingMonths}m</span>
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

      {/* MODAL DE RESULTADO NARRATIVO DE INTERACCIÓN */}
      {activeModalResult && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
          <div className="bg-[#141417] border border-[#26262B] max-w-2xl w-full rounded-[6px] flex flex-col overflow-hidden text-[#F4F0EA] shadow-2xl relative my-auto max-h-[92vh]">
            <div className="px-6 py-4 border-b border-[#26262B] bg-[#141417] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-[4px] bg-[#1C1C21] border shrink-0 ${
                    activeModalResult.actionType === 'diss'
                      ? 'border-[#EF4444]/50 text-[#EF4444]'
                      : 'border-[#10B981]/50 text-[#10B981]'
                  }`}
                >
                  {activeModalResult.actionType === 'diss' ? (
                    <Swords className="w-5 h-5" strokeWidth={1.75} />
                  ) : (
                    <Heart className="w-5 h-5" strokeWidth={1.75} />
                  )}
                </div>

                <div>
                  <span className="text-2xs uppercase font-bold tracking-wider text-[#8E8E99] inline-block font-sans">
                    {activeModalResult.actionType === 'diss' ? 'Tiradera / Guerra Lírica' : 'Mención / Elogio Público'}
                  </span>
                  <h2 className="font-display text-base sm:text-lg font-bold tracking-tight text-[#F4F0EA]">
                    Resultado de Interacción
                  </h2>
                </div>
              </div>

              <button
                onClick={() => { playSound('click'); setActiveModalResult(null); }}
                className="p-1.5 rounded-[4px] hover:bg-[#1C1C21] text-[#8E8E99] hover:text-[#F4F0EA] transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="rounded-[6px] p-4 border border-[#26262B] bg-[#1C1C21] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold tracking-tight text-[#F4F0EA]">
                    {activeModalResult.title}
                  </h3>
                  <p className="text-xs text-[#8E8E99]">
                    Interacción con <strong className="text-[#F4F0EA] font-semibold">{activeModalResult.targetArtistName}</strong>
                  </p>
                </div>

                <span
                  className={`text-xs font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-[4px] border ${
                    activeModalResult.badge.variant === 'danger'
                      ? 'bg-[#141417] text-[#EF4444] border-[#EF4444]/40'
                      : activeModalResult.badge.variant === 'warning'
                      ? 'bg-[#141417] text-[#F59E0B] border-[#F59E0B]/40'
                      : activeModalResult.badge.variant === 'purple'
                      ? 'bg-[#141417] text-[#FF2A4B] border-[#FF2A4B]/40'
                      : 'bg-[#141417] text-[#10B981] border-[#10B981]/40'
                  }`}
                >
                  {activeModalResult.badge.label}
                </span>
              </div>

              <div className="bg-[#0B0B0C] p-4 rounded-[4px] border border-[#26262B] text-xs sm:text-sm text-[#F4F0EA] leading-relaxed">
                {activeModalResult.narrativeText}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeModalResult.statDeltas.hype !== undefined && (
                  <div className="bg-[#0B0B0C] p-3 rounded-[4px] border border-[#26262B] text-center space-y-0.5">
                    <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-sans">Hype</span>
                    <span className="font-sans tabular-nums font-bold text-sm text-[#FF2A4B]">
                      {activeModalResult.statDeltas.hype > 0 ? `+${activeModalResult.statDeltas.hype}` : activeModalResult.statDeltas.hype}
                    </span>
                  </div>
                )}

                {activeModalResult.statDeltas.affinity !== undefined && (
                  <div className="bg-[#0B0B0C] p-3 rounded-[4px] border border-[#26262B] text-center space-y-0.5">
                    <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-sans">Afinidad</span>
                    <span className={`font-sans tabular-nums font-bold text-sm ${activeModalResult.statDeltas.affinity > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {activeModalResult.statDeltas.affinity > 0 ? `+${activeModalResult.statDeltas.affinity}` : activeModalResult.statDeltas.affinity}
                    </span>
                  </div>
                )}

                {activeModalResult.statDeltas.respect !== undefined && (
                  <div className="bg-[#0B0B0C] p-3 rounded-[4px] border border-[#26262B] text-center space-y-0.5">
                    <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-sans">Respeto</span>
                    <span className={`font-sans tabular-nums font-bold text-sm ${activeModalResult.statDeltas.respect > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {activeModalResult.statDeltas.respect > 0 ? `+${activeModalResult.statDeltas.respect}` : activeModalResult.statDeltas.respect}
                    </span>
                  </div>
                )}

                {activeModalResult.statDeltas.credibility !== undefined && (
                  <div className="bg-[#0B0B0C] p-3 rounded-[4px] border border-[#26262B] text-center space-y-0.5">
                    <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-sans">Credibilidad</span>
                    <span className={`font-sans tabular-nums font-bold text-sm ${activeModalResult.statDeltas.credibility >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {activeModalResult.statDeltas.credibility >= 0 ? `+${activeModalResult.statDeltas.credibility}` : activeModalResult.statDeltas.credibility}
                    </span>
                  </div>
                )}

                {activeModalResult.statDeltas.discipline !== undefined && (
                  <div className="bg-[#0B0B0C] p-3 rounded-[4px] border border-[#26262B] text-center space-y-0.5">
                    <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-sans">Disciplina</span>
                    <span className={`font-sans tabular-nums font-bold text-sm ${activeModalResult.statDeltas.discipline >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {activeModalResult.statDeltas.discipline >= 0 ? `+${activeModalResult.statDeltas.discipline}` : activeModalResult.statDeltas.discipline}
                    </span>
                  </div>
                )}

                {activeModalResult.statDeltas.energy !== undefined && (
                  <div className="bg-[#0B0B0C] p-3 rounded-[4px] border border-[#26262B] text-center space-y-0.5">
                    <span className="text-2xs text-[#8E8E99] uppercase tracking-wider block font-sans">Energía</span>
                    <span className="font-sans tabular-nums font-bold text-sm text-[#8E8E99]">
                      {activeModalResult.statDeltas.energy}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-[#0B0B0C] border border-[#26262B] rounded-[6px] p-4 space-y-1.5">
                <div className="flex items-center justify-between text-2xs text-[#8E8E99] pb-1.5 border-b border-[#26262B] font-sans tabular-nums">
                  <span className="font-bold uppercase tracking-wider text-[#10B981]">
                    PRENSA MUSICAL • Año {world.currentYear} Mes {world.currentMonth}
                  </span>
                </div>
                <h5 className="font-display text-sm sm:text-base font-bold text-[#F4F0EA] tracking-tight leading-snug">
                  "{cleanQuotes(activeModalResult.pressHeadline)}"
                </h5>
                <p className="text-xs text-[#8E8E99] leading-relaxed">
                  {activeModalResult.pressBody}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#26262B] bg-[#141417] flex items-center justify-end">
              <button
                onClick={() => { playSound('click'); setActiveModalResult(null); }}
                className="w-full sm:w-auto bg-[#F4F0EA] hover:bg-white text-[#0B0B0C] font-bold py-2 px-5 rounded-[4px] text-xs transition-all cursor-pointer active:translate-y-[1px]"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
