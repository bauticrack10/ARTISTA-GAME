import React, { useState, useEffect } from 'react';
import { Artist, WorldState, EcosystemNPC, BeefState, InteractionResult, ArtistRelationship } from '../types';
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
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audioSystem';
import { formatCompactNumber, cleanQuotes, sanitizeString } from '../utils/formatters';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalResult, setActiveModalResult] = useState<InteractionResult | null>(null);

  const otherArtists = (Object.values(world?.artists || {}) as Artist[]).filter(
    a => a.id !== player?.id && !a.isRetired
  );
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
            colors: ['#8B5CF6', '#EC4899', '#10B981', '#06B6D4', '#F59E0B']
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
        className: 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D]',
        dotClass: 'bg-[#94A3B8]'
      };
    }

    // Feudo Activo (Rojo / Carmesí pulsante)
    if (rel.relationType === 'feud' || rel.affinity <= -40) {
      return {
        key: 'feud',
        label: 'Feudo Activo',
        className: 'bg-rose-950/80 text-rose-200 border border-rose-500/60 animate-pulse font-bold shadow-[0_0_12px_rgba(244,63,94,0.35)]',
        dotClass: 'bg-[#F43F5E]'
      };
    }

    // Rivalidad (Naranja / Fuego)
    if (rel.relationType === 'rival' || rel.affinity < -15) {
      return {
        key: 'rival',
        label: 'Rivalidad',
        className: 'bg-orange-950/60 text-orange-300 border border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
        dotClass: 'bg-[#F97316]'
      };
    }

    // Colaboradores (Dorado / Ámbar)
    if (rel.relationType === 'collaborator' || (rel.pastCollabsCount && rel.pastCollabsCount > 0)) {
      return {
        key: 'collaborator',
        label: 'Colaboradores',
        className: 'bg-amber-950/60 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
        dotClass: 'bg-[#F59E0B]'
      };
    }

    // Amistad (Violeta / Fucsia)
    if (rel.relationType === 'friend' || rel.affinity >= 35) {
      return {
        key: 'friend',
        label: 'Amistad',
        className: 'bg-purple-950/60 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(139,92,246,0.25)]',
        dotClass: 'bg-[#8B5CF6]'
      };
    }

    // Respeto Mutuo (Cian / Esmeralda)
    if (rel.relationType === 'mentor' || rel.relationType === 'protege' || (rel.respect >= 65 && rel.affinity >= 10)) {
      return {
        key: 'respect',
        label: 'Respeto Mutuo',
        className: 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
        dotClass: 'bg-[#06B6D4]'
      };
    }

    // Neutral (Gris / Pizarra)
    return {
      key: 'neutral',
      label: 'Neutral',
      className: 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D]',
      dotClass: 'bg-[#94A3B8]'
    };
  };

  const getEcosystemBadge = (roleType?: EcosystemNPC['type'] | EcosystemNPC['roleType']) => {
    switch (roleType) {
      case 'beatmaker_barrio':
        return { label: 'Beatmaker de Confianza', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
      case 'manager_chanta':
        return { label: 'Manager / Intermediario', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'critico_hater':
        return { label: 'Crítica / Prensa Hostil', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'rival_escena':
        return { label: 'Rival Directo de Escena', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      default:
        return { label: 'Contacto Urbano', color: 'bg-white/[0.06] text-[#F8FAFC] border-[#2A2E3D]' };
    }
  };

  const getBeefStageBadge = (stage: BeefState['stage']) => {
    switch (stage) {
      case 'tension':
        return { label: 'Tensión Creciente', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'social_beef':
        return { label: 'Cruce en Redes', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
      case 'diss_tracks':
        return { label: 'Guerra de Tiraderas', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse font-bold' };
      case 'all_out_war':
        return { label: 'Conflicto Total', color: 'bg-red-500/30 text-red-200 border-red-500/50 font-bold' };
      case 'settled':
        return { label: 'Tregua / Resuelto', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      default:
        return { label: 'Activo', color: 'bg-white/[0.06] text-[#F8FAFC] border-[#2A2E3D]' };
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

  // Filter and search logic
  const filteredArtists = otherArtists.filter(a => {
    const rel = player.relationships[a.id];
    const badge = getRelationshipBadge(rel);

    if (filter === 'friends' && badge.key !== 'friend' && badge.key !== 'respect') return false;
    if (filter === 'collabs' && badge.key !== 'collaborator') return false;
    if (filter === 'rivals' && badge.key !== 'rival') return false;
    if (filter === 'feuds' && badge.key !== 'feud') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const genreName = (world.genres[a.mainGenreId]?.name || a.mainGenreId).toLowerCase();
      return a.name.toLowerCase().includes(q) || genreName.includes(q) || a.country.toLowerCase().includes(q);
    }

    return true;
  });

  return (
    <div
      className="space-y-8 pb-16 text-[#F8FAFC]"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Header & Controls Panel */}
      <div className="bg-[#16181F] p-6 rounded-[16px] border border-[#2A2E3D] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-lg relative overflow-hidden">
        {/* Subtle Accent Glow */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-[#8B5CF6]/10 via-[#EC4899]/05 to-transparent blur-2xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-[#0B0C10] border border-[#8B5CF6]/40 text-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.25)]">
              <Network className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Ecosistema, Vínculos & Rivalidades Urbanas
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
            Cultivá alianzas estratégicas, intercambiá elogios públicos, gestioná la tensión con críticos y defendé tu respeto lírico en tiraderas.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto relative z-10">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por artista o género..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] pl-9 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] text-xs p-0.5"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-[#16181F] p-1.5 rounded-[12px] border border-[#2A2E3D] text-xs overflow-x-auto scrollbar-none shadow-sm">
        <button
          onClick={() => { playSound('click'); setFilter('all'); }}
          className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
            filter === 'all'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B0C10]'
          }`}
        >
          Todos ({otherArtists.length + ecosystemContacts.length})
        </button>
        <button
          onClick={() => { playSound('click'); setFilter('friends'); }}
          className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'friends'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B0C10]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-purple-400" />
          <span>Amistad & Respeto</span>
        </button>
        <button
          onClick={() => { playSound('click'); setFilter('collabs'); }}
          className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'collabs'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B0C10]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Colaboradores</span>
        </button>
        <button
          onClick={() => { playSound('click'); setFilter('rivals'); }}
          className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'rivals'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B0C10]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Rivales</span>
        </button>
        <button
          onClick={() => { playSound('click'); setFilter('feuds'); }}
          className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'feuds'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B0C10]'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>Feudos Activos ({activeBeefs.length})</span>
        </button>
        <button
          onClick={() => { playSound('click'); setFilter('ecosystem'); }}
          className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'ecosystem'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B0C10]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Ecosistema Urbano ({ecosystemContacts.length})</span>
        </button>
      </div>

      {/* SECTION 1: Active Beefs & Feuds Banner */}
      {activeBeefs.length > 0 && filter !== 'ecosystem' && filter !== 'friends' && filter !== 'collabs' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-[6px] bg-rose-950/70 border border-rose-500/40 text-rose-400">
                <Swords className="w-4 h-4 animate-pulse" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
                Tiraderas & Feudos Activos en la Escena ({activeBeefs.length})
              </h2>
            </div>
            <span className="text-[11px] text-[#94A3B8]">
              Conflictos abiertos con repercusión mediática y en streaming
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBeefs.map((beef) => {
              const stageBadge = getBeefStageBadge(beef.stage);

              return (
                <div
                  key={beef.id}
                  className="bg-[#16181F] border border-rose-500/40 rounded-[14px] p-5 space-y-4 shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[8px] bg-rose-950/80 text-rose-200 flex items-center justify-center font-black text-xs border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)] shrink-0">
                        VS
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-[#F8FAFC] tracking-tight">
                          {beef.targetName}
                        </h3>
                        <span className="text-[11px] text-[#94A3B8] flex items-center gap-1 mt-0.5">
                          <TrendingUp className="w-3 h-3 text-orange-400" />
                          Hype generado: <strong className="text-orange-400 font-semibold">+{beef.hypeGenerated || 25}</strong>
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-[6px] border ${stageBadge.color}`}>
                      {stageBadge.label}
                    </span>
                  </div>

                  {/* Tension Meter */}
                  <div className="space-y-1.5 bg-[#0B0C10] p-3 rounded-[10px] border border-[#2A2E3D]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#94A3B8]">Nivel de Tensión Bélica</span>
                      <span className="font-mono font-bold text-rose-400">{beef.tensionLevel || 50}/100</span>
                    </div>
                    <div className="w-full bg-[#16181F] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, beef.tensionLevel || 50)}%` }}
                      />
                    </div>
                  </div>

                  {/* Diss Tracks Exchanged */}
                  {beef.dissTracksExchanged && beef.dissTracksExchanged.length > 0 && (
                    <div className="text-[11px] text-[#94A3B8] space-y-1 bg-[#0B0C10]/60 p-2.5 rounded-[8px] border border-[#2A2E3D]/60">
                      <span className="font-semibold text-[#F8FAFC] flex items-center gap-1">
                        <Radio className="w-3 h-3 text-rose-400" />
                        Historial de Tiraderas:
                      </span>
                      <ul className="list-disc list-inside text-[10px] italic space-y-0.5 text-[#94A3B8]">
                        {beef.dissTracksExchanged.map((track, i) => (
                          <li key={i} className="truncate">{track}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interactive Beef Action Buttons */}
                  {onInteractBeef && beef.stage !== 'settled' && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2A2E3D]">
                      <button
                        onClick={() => {
                          playSound('click');
                          onInteractBeef(beef.targetName, beef.targetId, 'respond_social');
                        }}
                        className="bg-[#0B0C10] hover:bg-white/[0.05] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 py-2 px-2 text-[11px] font-semibold rounded-[8px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Responder en Redes (+Hype, chicana pública)"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>Chicana</span>
                      </button>

                      <button
                        onClick={() => {
                          playSound('chart_no1');
                          onInteractBeef(beef.targetName, beef.targetId, 'drop_diss');
                        }}
                        className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-2 px-2 text-[11px] rounded-[8px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                        title="Lanzar Diss Track demoledor en plataformas"
                      >
                        <Swords className="w-3.5 h-3.5 text-white" />
                        <span>Diss Track</span>
                      </button>

                      <button
                        onClick={() => {
                          playSound('click');
                          onInteractBeef(beef.targetName, beef.targetId, 'ignore');
                        }}
                        className="bg-[#0B0C10] hover:bg-white/[0.05] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2A2E3D] py-2 px-2 text-[11px] font-semibold rounded-[8px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Ignorar provocaciones (+Disciplina, +Credibilidad)"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#94A3B8]" />
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
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-[6px] bg-purple-950/70 border border-[#8B5CF6]/40 text-[#8B5CF6]">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
                Personajes Recurrentes del Ecosistema Urbano ({ecosystemContacts.length})
              </h2>
            </div>
            <span className="text-[11px] text-[#94A3B8]">
              Productores de barrio, managers, críticos y contactos clave
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemContacts.map((npc) => {
              const role = npc.roleType || npc.type;
              const badge = getEcosystemBadge(role);

              return (
                <div
                  key={npc.id}
                  className="bg-[#16181F] border border-[#2A2E3D] rounded-[14px] p-4 space-y-3.5 flex flex-col justify-between shadow-md hover:border-[#8B5CF6]/50 transition-all group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-[8px] bg-gradient-to-tr ${npc.avatarGradient || 'from-stone-700 to-zinc-900'} text-[#F8FAFC] font-bold text-sm flex items-center justify-center shrink-0 shadow-sm border border-white/10`}>
                          {npc.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[#F8FAFC] truncate">
                            {npc.name}
                          </h3>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] border ${badge.color} inline-block mt-0.5`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-3">
                      {npc.description || npc.bio}
                    </p>
                  </div>

                  {/* Meters: Afinidad, Lealtad, Tensión */}
                  <div className="space-y-1.5 bg-[#0B0C10] p-2.5 rounded-[10px] border border-[#2A2E3D] text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Afinidad / Confianza</span>
                      <span className={`font-mono font-semibold ${npc.affinity > 0 ? 'text-emerald-400' : npc.affinity < 0 ? 'text-rose-400' : 'text-[#F8FAFC]'}`}>
                        {npc.affinity > 0 ? `+${npc.affinity}` : npc.affinity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Lealtad al Proyecto</span>
                      <span className="font-mono font-semibold text-[#F8FAFC]">{npc.loyalty}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Tensión Acumulada</span>
                      <span className={`font-mono font-semibold ${(npc.tension ?? npc.tensionLevel ?? 0) > 40 ? 'text-rose-400 font-bold' : 'text-[#F8FAFC]'}`}>
                        {(npc.tension ?? npc.tensionLevel ?? 0)}%
                      </span>
                    </div>
                  </div>

                  {/* NPC Interaction Actions */}
                  {onInteractEcosystemNPC && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#2A2E3D]/80">
                      {role === 'beatmaker_barrio' && (
                        <>
                          <button
                            onClick={() => { playSound('click'); onInteractEcosystemNPC(npc.id, 'collab_beat'); }}
                            className="bg-[#0B0C10] hover:bg-white/[0.05] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 py-1.5 px-2 text-[10px] font-semibold rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Producir beat con Nico 808"
                          >
                            <Volume2 className="w-3 h-3 text-[#8B5CF6]" />
                            <span>Sesión Beat</span>
                          </button>
                          <button
                            onClick={() => { playSound('money'); onInteractEcosystemNPC(npc.id, 'buy_exclusive'); }}
                            className="bg-[#0B0C10] hover:bg-white/[0.05] text-[#F8FAFC] border border-[#2A2E3D] hover:border-emerald-500/50 py-1.5 px-2 text-[10px] font-semibold rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Comprar instrumental exclusiva ($500)"
                          >
                            <DollarSign className="w-3 h-3 text-emerald-400" />
                            <span>Exclusiva</span>
                          </button>
                        </>
                      )}

                      {role === 'manager_chanta' && (
                        <>
                          <button
                            onClick={() => { playSound('click'); onInteractEcosystemNPC(npc.id, 'hang_out'); }}
                            className="bg-[#0B0C10] hover:bg-white/[0.05] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 py-1.5 px-2 text-[10px] font-semibold rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Reunión en reservado con Tony"
                          >
                            <Coffee className="w-3 h-3 text-[#8B5CF6]" />
                            <span>Reunión</span>
                          </button>
                          <button
                            onClick={() => { playSound('click'); onInteractEcosystemNPC(npc.id, 'call_out'); }}
                            className="bg-[#0B0C10] hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/30 py-1.5 px-2 text-[10px] font-semibold rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Auditar finanzas / Confrontar cuentas dudosas"
                          >
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>Auditar</span>
                          </button>
                        </>
                      )}

                      {role === 'critico_hater' && (
                        <>
                          <button
                            onClick={() => { playSound('chart_no1'); onInteractEcosystemNPC(npc.id, 'call_out'); }}
                            className="bg-[#0B0C10] hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/30 py-1.5 px-2 text-[10px] font-semibold rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer col-span-2 shadow-xs"
                            title="Desafiar en redes públicas (+Hype)"
                          >
                            <Zap className="w-3 h-3 text-orange-400" />
                            <span>Desafiar en Redes</span>
                          </button>
                        </>
                      )}

                      {role === 'rival_escena' && onInteractBeef && (
                        <>
                          <button
                            onClick={() => { playSound('click'); onInteractBeef(npc.name, npc.id, 'respond_social'); }}
                            className="bg-[#0B0C10] hover:bg-white/[0.05] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 py-1.5 px-2 text-[10px] font-semibold rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Responder chicanas en redes"
                          >
                            <MessageSquare className="w-3 h-3 text-[#8B5CF6]" />
                            <span>Chicana</span>
                          </button>
                          <button
                            onClick={() => { playSound('chart_no1'); onInteractBeef(npc.name, npc.id, 'drop_diss'); }}
                            className="bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold py-1.5 px-2 text-[10px] rounded-[6px] flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                            title="Tiradera Lírica"
                          >
                            <Swords className="w-3 h-3 text-white" />
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

      {/* SECTION 3: Main Artists Roster Grid with Stylized Badges & Cooldown Actions */}
      {filter !== 'ecosystem' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-[6px] bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6]">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
                Artistas & Colegas de la Industria ({filteredArtists.length})
              </h2>
            </div>
            <span className="text-[11px] text-[#94A3B8]">
              Evaluación en tiempo real de afinidad, respeto y disponibilidad de interacciones
            </span>
          </div>

          {filteredArtists.length === 0 ? (
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[14px] p-8 text-center space-y-2">
              <Info className="w-8 h-8 text-[#94A3B8] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[#F8FAFC]">No se encontraron artistas para este filtro</p>
              <p className="text-xs text-[#94A3B8]">Prueba cambiando la categoría o limpiando la búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
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

                // Cooldown evaluation for actions
                const shoutoutCheck = RelationshipEngine.canSendShoutout(player, artist, world.currentYear, world.currentMonth);
                const dissCheck = RelationshipEngine.canSendDiss(player, artist, world.currentYear, world.currentMonth);

                return (
                  <div
                    key={artist.id}
                    className="bg-[#16181F] border border-[#2A2E3D] rounded-[14px] p-5 space-y-4 flex flex-col justify-between shadow-md hover:border-[#8B5CF6]/50 transition-all group"
                  >
                    {/* Header Info & State Badge */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-[8px] bg-[#0B0C10] border border-[#2A2E3D] flex items-center justify-center text-[#F8FAFC] font-bold text-base shadow-xs shrink-0 group-hover:border-[#8B5CF6]/40 transition-colors">
                            {artist.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm sm:text-base text-[#F8FAFC] truncate">
                              {artist.name}
                            </h3>
                            <p className="text-[11px] text-[#94A3B8] truncate">
                              {artist.country} • {world.genres[artist.mainGenreId]?.name || artist.mainGenreId}
                            </p>
                          </div>
                        </div>

                        {/* 1. ESTADO DE RELACIÓN CLARO Y VISIBLE */}
                        <div className="shrink-0">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px] flex items-center gap-1.5 ${badgeConfig.className}`}
                            title={`Estado de relación: ${badgeConfig.label}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dotClass}`} />
                            {badgeConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Stat Metrics Bar */}
                      <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono bg-[#0B0C10]/70 px-3 py-1.5 rounded-[8px] border border-[#2A2E3D]/60">
                        <span>Pop: <strong className="text-[#F8FAFC] font-semibold">{artist.stats.popularity}</strong></span>
                        <span>Oyentes: <strong className="text-[#F8FAFC] font-semibold">{formatCompactNumber(artist.stats.monthlyListeners)}</strong></span>
                        <span>Etapa: <strong className="text-[#94A3B8]">{artist.careerStage}</strong></span>
                      </div>
                    </div>

                    {/* Relationship Meters: Afinidad & Respeto */}
                    <div className="space-y-2.5 bg-[#0B0C10] p-3 rounded-[10px] border border-[#2A2E3D] text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-[#94A3B8]">Afinidad Mutua</span>
                          <span className={`font-semibold font-mono ${rel.affinity > 0 ? 'text-[#EC4899]' : rel.affinity < 0 ? 'text-rose-400' : 'text-[#F8FAFC]'}`}>
                            {rel.affinity > 0 ? `+${rel.affinity}` : rel.affinity}
                          </span>
                        </div>
                        <div className="w-full bg-[#16181F] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${rel.affinity < 0 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]'}`}
                            style={{ width: `${Math.max(8, Math.min(100, (rel.affinity + 100) / 2))}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-[#94A3B8]">Respeto Profesional</span>
                          <span className="font-semibold text-cyan-300 font-mono">{rel.respect}%</span>
                        </div>
                        <div className="w-full bg-[#16181F] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] h-full rounded-full"
                            style={{ width: `${rel.respect}%` }}
                          />
                        </div>
                      </div>

                      {rel.history && rel.history.length > 0 && (
                        <div className="pt-2 border-t border-[#2A2E3D] text-[10px] text-[#94A3B8] italic line-clamp-1">
                          Último: "{cleanQuotes(rel.history[rel.history.length - 1])}"
                        </div>
                      )}
                    </div>

                    {/* 2. BOTONES DE ACCIÓN CON COOLDOWN Y TOOLTIPS */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#2A2E3D]/80">
                      {/* PROPOSE COLLAB */}
                      <button
                        onClick={() => handleExecuteInteraction(artist, 'collab_request')}
                        className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#EC4899]/20 hover:from-[#8B5CF6] hover:to-[#EC4899] text-[#F8FAFC] hover:text-white border border-[#8B5CF6]/50 hover:border-[#EC4899] py-2 px-2 text-[11px] font-bold rounded-[8px] flex flex-col items-center gap-1 transition-all cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.25)] hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] group/btn"
                        title="Proponer Colaboración Musical Personalizada (Single, EP o Álbum)"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C084FC] group-hover/btn:text-white transition-transform group-hover/btn:scale-110" />
                        <span>Proponer Colab</span>
                      </button>

                      {/* SHOUTOUT (ELOGIO) */}
                      {shoutoutCheck.canPerform || shoutoutCheck.canSend ? (
                        <button
                          onClick={() => handleExecuteInteraction(artist, 'shoutout')}
                          className="bg-[#0B0C10] hover:bg-[#EC4899]/10 text-[#F8FAFC] hover:text-white border border-[#2A2E3D] hover:border-[#EC4899]/60 py-2 px-2 text-[11px] font-medium rounded-[8px] flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs hover:shadow-[0_0_12px_rgba(236,72,153,0.25)] group/btn"
                          title={shoutoutCheck.probableConsequence || 'Elogio Público • Consecuencia: +Afinidad, +Respeto y +Hype en la escena musical'}
                        >
                          <Heart className="w-3.5 h-3.5 text-[#EC4899] group-hover/btn:scale-110 transition-transform" />
                          <span>Elogio</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-[#0B0C10]/80 text-[#94A3B8]/60 border border-[#2A2E3D]/60 py-2 px-2 text-[10px] font-medium rounded-[8px] flex flex-col items-center gap-1 opacity-60 cursor-not-allowed transition-all"
                          title={`Disponible en Año ${shoutoutCheck.availableYear} • Mes ${shoutoutCheck.availableMonth}`}
                        >
                          <Clock className="w-3.5 h-3.5 text-[#94A3B8]/70" />
                          <span>Cooldown ({shoutoutCheck.cooldownRemainingMonths}m)</span>
                        </button>
                      )}

                      {/* DISS TRACK (TIRADERA) */}
                      {dissCheck.canPerform || dissCheck.canSend ? (
                        <button
                          onClick={() => handleExecuteInteraction(artist, 'diss')}
                          className="bg-[#0B0C10] hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/60 py-2 px-2 text-[11px] font-medium rounded-[8px] flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs hover:shadow-[0_0_12px_rgba(244,63,94,0.3)] group/btn"
                          title={dissCheck.probableConsequence || 'Tiradera / Diss Track • Consecuencia: +Hype masivo, desata Feudo Activo con barras líricas'}
                        >
                          <Swords className="w-3.5 h-3.5 text-rose-400 group-hover/btn:scale-110 transition-transform" />
                          <span>Tiradera</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-[#0B0C10]/80 text-[#94A3B8]/60 border border-[#2A2E3D]/60 py-2 px-2 text-[10px] font-medium rounded-[8px] flex flex-col items-center gap-1 opacity-60 cursor-not-allowed transition-all"
                          title={`Disponible en Año ${dissCheck.availableYear} • Mes ${dissCheck.availableMonth}`}
                        >
                          <Lock className="w-3.5 h-3.5 text-[#94A3B8]/70" />
                          <span>Cooldown ({dissCheck.cooldownRemainingMonths}m)</span>
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

      {/* 3. MODAL / POP-UP DE RESULTADO NARRATIVO DE INTERACCIÓN */}
      {activeModalResult && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
          <div
            className="bg-[#16181F] border border-[#2A2E3D] max-w-2xl w-full rounded-[18px] flex flex-col overflow-hidden text-[#F8FAFC] shadow-2xl relative my-auto max-h-[92vh]"
            style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
          >
            {/* Ambient Top Glow */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 blur-3xl pointer-events-none ${
                activeModalResult.badge.variant === 'danger'
                  ? 'bg-rose-600/25'
                  : activeModalResult.badge.variant === 'warning'
                  ? 'bg-amber-600/20'
                  : activeModalResult.badge.variant === 'purple'
                  ? 'bg-purple-600/25'
                  : 'bg-emerald-600/25'
              }`}
            />

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#2A2E3D] bg-[#16181F]/90 backdrop-blur-md flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-[8px] bg-[#0B0C10] border shrink-0 ${
                    activeModalResult.badge.variant === 'danger'
                      ? 'border-rose-500/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : activeModalResult.badge.variant === 'warning'
                      ? 'border-amber-500/50 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : activeModalResult.badge.variant === 'purple'
                      ? 'border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                      : 'border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  }`}
                >
                  {activeModalResult.actionType === 'diss' ? (
                    <Swords className="w-5 h-5" />
                  ) : (
                    <Heart className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] inline-block">
                    {activeModalResult.actionType === 'diss' ? 'Tiradera / Guerra Lírica' : 'Mención / Elogio Público'} • Repercusión Escénica
                  </span>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#F8FAFC]">
                    Resultado de Interacción
                  </h2>
                </div>
              </div>

              <button
                onClick={() => { playSound('click'); setActiveModalResult(null); }}
                className="p-1.5 rounded-[6px] hover:bg-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 relative z-10">
              {/* Title & Result Badge Banner */}
              <div
                className={`rounded-[14px] p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md ${
                  activeModalResult.badge.variant === 'danger'
                    ? 'bg-gradient-to-r from-rose-950/60 via-[#16181F] to-[#0B0C10] border-rose-500/50'
                    : activeModalResult.badge.variant === 'warning'
                    ? 'bg-gradient-to-r from-amber-950/50 via-[#16181F] to-[#0B0C10] border-amber-500/50'
                    : activeModalResult.badge.variant === 'purple'
                    ? 'bg-gradient-to-r from-purple-950/60 via-[#16181F] to-[#0B0C10] border-purple-500/50'
                    : 'bg-gradient-to-r from-emerald-950/60 via-[#16181F] to-[#0B0C10] border-emerald-500/50'
                }`}
              >
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-[#F8FAFC]">
                    {activeModalResult.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Interacción con <strong className="text-[#F8FAFC] font-semibold">{activeModalResult.targetArtistName}</strong>
                  </p>
                </div>

                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[8px] border shadow-xs ${
                    activeModalResult.badge.variant === 'danger'
                      ? 'bg-rose-950/80 text-rose-200 border-rose-500/60'
                      : activeModalResult.badge.variant === 'warning'
                      ? 'bg-amber-950/80 text-amber-200 border-amber-500/60'
                      : activeModalResult.badge.variant === 'purple'
                      ? 'bg-purple-950/80 text-purple-200 border-purple-500/60'
                      : 'bg-emerald-950/80 text-emerald-200 border-emerald-500/60'
                  }`}
                >
                  {activeModalResult.badge.label}
                </span>
              </div>

              {/* Narrative Text */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Repercusión en la Escena Urbana
                </h4>
                <div className="bg-[#0B0C10] p-4 rounded-[12px] border border-[#2A2E3D] text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
                  {activeModalResult.narrativeText}
                </div>
              </div>

              {/* Highlighted Numeric Changes Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Impacto en Métricas & Relaciones
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activeModalResult.statDeltas.hype !== undefined && (
                    <div className="bg-[#0B0C10] p-3 rounded-[10px] border border-[#2A2E3D] text-center space-y-0.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Hype</span>
                      <span className="font-mono font-bold text-sm text-orange-400">
                        {activeModalResult.statDeltas.hype > 0 ? `+${activeModalResult.statDeltas.hype}` : activeModalResult.statDeltas.hype}
                      </span>
                    </div>
                  )}

                  {activeModalResult.statDeltas.affinity !== undefined && (
                    <div className="bg-[#0B0C10] p-3 rounded-[10px] border border-[#2A2E3D] text-center space-y-0.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Afinidad</span>
                      <span className={`font-mono font-bold text-sm ${activeModalResult.statDeltas.affinity > 0 ? 'text-[#EC4899]' : 'text-rose-400'}`}>
                        {activeModalResult.statDeltas.affinity > 0 ? `+${activeModalResult.statDeltas.affinity}` : activeModalResult.statDeltas.affinity}
                      </span>
                    </div>
                  )}

                  {activeModalResult.statDeltas.respect !== undefined && (
                    <div className="bg-[#0B0C10] p-3 rounded-[10px] border border-[#2A2E3D] text-center space-y-0.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Respeto</span>
                      <span className={`font-mono font-bold text-sm ${activeModalResult.statDeltas.respect > 0 ? 'text-cyan-300' : 'text-rose-400'}`}>
                        {activeModalResult.statDeltas.respect > 0 ? `+${activeModalResult.statDeltas.respect}` : activeModalResult.statDeltas.respect}
                      </span>
                    </div>
                  )}

                  {activeModalResult.statDeltas.credibility !== undefined && (
                    <div className="bg-[#0B0C10] p-3 rounded-[10px] border border-[#2A2E3D] text-center space-y-0.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Credibilidad</span>
                      <span className={`font-mono font-bold text-sm ${activeModalResult.statDeltas.credibility >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {activeModalResult.statDeltas.credibility >= 0 ? `+${activeModalResult.statDeltas.credibility}` : activeModalResult.statDeltas.credibility}
                      </span>
                    </div>
                  )}

                  {activeModalResult.statDeltas.discipline !== undefined && (
                    <div className="bg-[#0B0C10] p-3 rounded-[10px] border border-[#2A2E3D] text-center space-y-0.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Disciplina</span>
                      <span className={`font-mono font-bold text-sm ${activeModalResult.statDeltas.discipline >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {activeModalResult.statDeltas.discipline >= 0 ? `+${activeModalResult.statDeltas.discipline}` : activeModalResult.statDeltas.discipline}
                      </span>
                    </div>
                  )}

                  {activeModalResult.statDeltas.energy !== undefined && (
                    <div className="bg-[#0B0C10] p-3 rounded-[10px] border border-[#2A2E3D] text-center space-y-0.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Energía</span>
                      <span className="font-mono font-bold text-sm text-[#94A3B8]">
                        {activeModalResult.statDeltas.energy}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Newspaper Clipping Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                  <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
                  Titular de Prensa Generado
                </h4>
                <div className="bg-[#0B0C10] border border-emerald-500/30 rounded-[12px] p-4 space-y-2 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pb-1.5 border-b border-[#2A2E3D]">
                    <span className="font-bold uppercase tracking-wider text-emerald-400">
                      PRENSA URBANA • RADAR MUSICAL
                    </span>
                    <span>Año {world.currentYear} • Mes {world.currentMonth}</span>
                  </div>
                  <h5 className="text-sm sm:text-base font-bold text-[#F8FAFC] tracking-tight leading-snug">
                    "{cleanQuotes(activeModalResult.pressHeadline)}"
                  </h5>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {activeModalResult.pressBody}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="px-6 py-4 border-t border-[#2A2E3D] bg-[#16181F] flex items-center justify-end relative z-10">
              <button
                onClick={() => { playSound('click'); setActiveModalResult(null); }}
                className="w-full sm:w-auto bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-semibold py-2.5 px-6 rounded-[8px] text-xs sm:text-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2"
              >
                <span>Continuar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
