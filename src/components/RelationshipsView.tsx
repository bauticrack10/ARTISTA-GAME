import React, { useState } from 'react';
import { Artist, WorldState, EcosystemNPC, BeefState } from '../types';
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
  DollarSign
} from 'lucide-react';

interface RelationshipsViewProps {
  player: Artist;
  world: WorldState;
  onInteract: (targetArtistId: string, actionType: 'collab_request' | 'shoutout' | 'diss') => void;
  onInteractEcosystemNPC?: (npcId: string, action: 'collab_beat' | 'buy_exclusive' | 'hang_out' | 'call_out') => void;
  onInteractBeef?: (targetName: string, targetId: string, action: 'respond_social' | 'drop_diss' | 'ignore') => void;
}

export const RelationshipsView: React.FC<RelationshipsViewProps> = ({
  player,
  world,
  onInteract,
  onInteractEcosystemNPC,
  onInteractBeef
}) => {
  const [filter, setFilter] = useState<'all' | 'ecosystem' | 'friends' | 'rivals' | 'feuds'>('all');

  const otherArtists = (Object.values(world.artists) as Artist[]).filter(a => a.id !== player.id && !a.isRetired);
  const ecosystemContacts = Object.values(world.ecosystemContacts || {});
  const activeBeefs = Object.values(world.activeBeefs || {});

  const filteredArtists = otherArtists.filter(a => {
    const rel = player.relationships[a.id];
    if (filter === 'friends') return rel?.relationType === 'friend' || rel?.relationType === 'mentor' || (rel?.affinity ?? 0) > 30;
    if (filter === 'rivals') return rel?.relationType === 'rival';
    if (filter === 'feuds') return rel?.relationType === 'feud' || (rel?.affinity ?? 0) < -20;
    return true;
  });

  const getEcosystemBadge = (roleType: EcosystemNPC['roleType']) => {
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

  return (
    <div className="space-y-8 pb-12 text-[#F8FAFC]" style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}>
      {/* Header */}
      <div className="bg-[#16181F] p-6 rounded-[16px] border border-[#2A2E3D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-2xl font-semibold text-[#F8FAFC] tracking-[-0.9px] flex items-center gap-2">
            <Network className="w-5 h-5 text-[#8B5CF6]" />
            Ecosistema, Vínculos & Rivalidades Urbanas
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Gestioná tu círculo cercano de confianza, lidiá con managers y críticos de la escena, y defendé tu respeto en tiraderas.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#0B0C10] p-1 rounded-[8px] border border-[#2A2E3D] text-xs flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Todos ({otherArtists.length + ecosystemContacts.length})
          </button>
          <button
            onClick={() => setFilter('ecosystem')}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
              filter === 'ecosystem'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Personajes Ecosistema ({ecosystemContacts.length})
          </button>
          <button
            onClick={() => setFilter('friends')}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
              filter === 'friends'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Aliados
          </button>
          <button
            onClick={() => setFilter('rivals')}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
              filter === 'rivals'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Rivales
          </button>
          <button
            onClick={() => setFilter('feuds')}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
              filter === 'feuds'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Tiraderas & Feudos
          </button>
        </div>
      </div>

      {/* SECTION 1: Active Beefs & Feuds Banner (if any active) */}
      {activeBeefs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-rose-400 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
              Tiraderas & Feudos Activos en la Escena ({activeBeefs.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBeefs.map((beef) => {
              const stageBadge = getBeefStageBadge(beef.stage);

              return (
                <div
                  key={beef.id}
                  className="bg-[#16181F] border border-rose-500/30 rounded-[12px] p-4 space-y-3 shadow-md relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-rose-950/80 text-rose-200 flex items-center justify-center font-bold text-xs border border-rose-500/40">
                        VS
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#F8FAFC]">
                          {beef.targetName}
                        </h3>
                        <span className="text-[11px] text-[#94A3B8]">
                          Hype generado: <strong className="text-orange-400">+{beef.hypeGenerated}</strong>
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${stageBadge.color}`}>
                      {stageBadge.label}
                    </span>
                  </div>

                  {/* Tension Meter */}
                  <div className="space-y-1 bg-[#0B0C10] p-2.5 rounded-[8px] border border-[#2A2E3D]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#94A3B8]">Nivel de Tensión Bélica</span>
                      <span className="font-mono font-bold text-rose-400">{beef.tensionLevel}/100</span>
                    </div>
                    <div className="w-full bg-[#16181F] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full"
                        style={{ width: `${Math.min(100, beef.tensionLevel)}%` }}
                      />
                    </div>
                  </div>

                  {/* Diss Tracks Exchanged */}
                  {beef.dissTracksExchanged && beef.dissTracksExchanged.length > 0 && (
                    <div className="text-[11px] text-[#94A3B8] space-y-0.5">
                      <span className="font-semibold text-[#F8FAFC]">Tiraderas lanzadas:</span>
                      <ul className="list-disc list-inside text-[10px] italic">
                        {beef.dissTracksExchanged.map((track, i) => (
                          <li key={i}>{track}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interactive Beef Buttons */}
                  {onInteractBeef && beef.stage !== 'settled' && (
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#2A2E3D]">
                      <button
                        onClick={() => onInteractBeef(beef.targetName, beef.targetId, 'respond_social')}
                        className="bg-[#0B0C10] hover:bg-white/[0.04] text-[#F8FAFC] border border-[#2A2E3D] py-1.5 px-2 text-[10px] font-semibold rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Responder en Redes (+Hype)"
                      >
                        <MessageSquare className="w-3 h-3 text-[#8B5CF6]" />
                        <span>Chicana</span>
                      </button>

                      <button
                        onClick={() => onInteractBeef(beef.targetName, beef.targetId, 'drop_diss')}
                        className="bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold py-1.5 px-2 text-[10px] rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                        title="Lanzar Diss Track directo"
                      >
                        <Swords className="w-3 h-3 text-rose-200" />
                        <span>Diss Track</span>
                      </button>

                      <button
                        onClick={() => onInteractBeef(beef.targetName, beef.targetId, 'ignore')}
                        className="bg-[#0B0C10] hover:bg-white/[0.04] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2A2E3D] py-1.5 px-2 text-[10px] font-semibold rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Ignorar (+Disciplina, calma)"
                      >
                        <ShieldCheck className="w-3 h-3 text-[#94A3B8]" />
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#8B5CF6]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
                Personajes Recurrentes del Ecosistema Urbano ({ecosystemContacts.length})
              </h2>
            </div>
            <span className="text-[11px] text-[#94A3B8]">
              Amistades, managers, productores y críticos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemContacts.map((npc) => {
              const badge = getEcosystemBadge(npc.roleType);

              return (
                <div
                  key={npc.id}
                  className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-4 space-y-3 flex flex-col justify-between shadow-md hover:border-[#8B5CF6]/50 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-[8px] bg-gradient-to-tr from-stone-700 to-zinc-900 text-[#F8FAFC] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {npc.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[#F8FAFC] truncate">
                            {npc.name}
                          </h3>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-3">
                      {npc.description}
                    </p>
                  </div>

                  {/* Meters: Afinidad, Respeto, Tensión, Lealtad */}
                  <div className="space-y-1.5 bg-[#0B0C10] p-2.5 rounded-[8px] border border-[#2A2E3D] text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Afinidad / Confianza</span>
                      <span className="font-mono font-semibold text-[#F8FAFC]">{npc.affinity > 0 ? `+${npc.affinity}` : npc.affinity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Lealtad al Proyecto</span>
                      <span className="font-mono font-semibold text-[#F8FAFC]">{npc.loyalty}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Tensión Acumulada</span>
                      <span className={`font-mono font-semibold ${npc.tension > 40 ? 'text-rose-400 font-bold' : 'text-[#F8FAFC]'}`}>{npc.tension}%</span>
                    </div>
                  </div>

                  {/* NPC Interaction Actions */}
                  {onInteractEcosystemNPC && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {npc.roleType === 'beatmaker_barrio' && (
                        <>
                          <button
                            onClick={() => onInteractEcosystemNPC(npc.id, 'collab_beat')}
                            className="bg-[#0B0C10] hover:bg-white/[0.04] text-[#F8FAFC] border border-[#2A2E3D] py-1.5 px-2 text-[10px] font-medium rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Producir beat con Nico 808"
                          >
                            <Volume2 className="w-3 h-3 text-[#8B5CF6]" />
                            <span>Sesión</span>
                          </button>
                          <button
                            onClick={() => onInteractEcosystemNPC(npc.id, 'buy_exclusive')}
                            className="bg-[#0B0C10] hover:bg-white/[0.04] text-[#F8FAFC] border border-[#2A2E3D] py-1.5 px-2 text-[10px] font-medium rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Comprar instrumental exclusiva ($500)"
                          >
                            <DollarSign className="w-3 h-3 text-emerald-400" />
                            <span>Exclusiva</span>
                          </button>
                        </>
                      )}

                      {npc.roleType === 'manager_chanta' && (
                        <>
                          <button
                            onClick={() => onInteractEcosystemNPC(npc.id, 'hang_out')}
                            className="bg-[#0B0C10] hover:bg-white/[0.04] text-[#F8FAFC] border border-[#2A2E3D] py-1.5 px-2 text-[10px] font-medium rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Reunión en reservado"
                          >
                            <Coffee className="w-3 h-3 text-[#8B5CF6]" />
                            <span>Reunión</span>
                          </button>
                          <button
                            onClick={() => onInteractEcosystemNPC(npc.id, 'call_out')}
                            className="bg-[#0B0C10] hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/30 py-1.5 px-2 text-[10px] font-medium rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Auditar finanzas / Confrontar"
                          >
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>Auditar</span>
                          </button>
                        </>
                      )}

                      {npc.roleType === 'critico_hater' && (
                        <>
                          <button
                            onClick={() => onInteractEcosystemNPC(npc.id, 'call_out')}
                            className="bg-[#0B0C10] hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/30 py-1.5 px-2 text-[10px] font-medium rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer col-span-2"
                            title="Desafiar en redes públicas (+Hype)"
                          >
                            <Zap className="w-3 h-3 text-orange-400" />
                            <span>Desafiar Crítica</span>
                          </button>
                        </>
                      )}

                      {npc.roleType === 'rival_escena' && onInteractBeef && (
                        <>
                          <button
                            onClick={() => onInteractBeef(npc.name, npc.id, 'respond_social')}
                            className="bg-[#0B0C10] hover:bg-white/[0.04] text-[#F8FAFC] border border-[#2A2E3D] py-1.5 px-2 text-[10px] font-medium rounded-[6px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Responder en Redes"
                          >
                            <MessageSquare className="w-3 h-3 text-[#8B5CF6]" />
                            <span>Chicana</span>
                          </button>
                          <button
                            onClick={() => onInteractBeef(npc.name, npc.id, 'drop_diss')}
                            className="bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold py-1.5 px-2 text-[10px] rounded-[6px] flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                            title="Tiradera Musical"
                          >
                            <Swords className="w-3 h-3 text-rose-200" />
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
      {(filter !== 'ecosystem') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
              Artistas & Colegas de la Industria ({filteredArtists.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtists.map(artist => {
              const rel = player.relationships[artist.id] || {
                targetArtistId: artist.id,
                relationType: 'neutral',
                affinity: 0,
                respect: 50,
                pastCollabsCount: 0,
                history: []
              };

              return (
                <div
                  key={artist.id}
                  className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-5 space-y-4 flex flex-col justify-between shadow-md hover:border-[#8B5CF6]/50 transition-all"
                >
                  {/* Header Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-[6px] bg-[#0B0C10] border border-[#2A2E3D] flex items-center justify-center text-[#F8FAFC] font-semibold text-base shadow-xs`}>
                          {artist.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-[#F8FAFC] flex items-center gap-1.5">
                            {artist.name}
                          </h3>
                          <p className="text-[11px] text-[#94A3B8]">
                            {artist.country} • {world.genres[artist.mainGenreId]?.name || artist.mainGenreId}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border border-[#2A2E3D] bg-[#0B0C10] text-[#F8FAFC]">
                        {rel.relationType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono pt-1">
                      <span>Pop: <strong className="text-[#F8FAFC] font-semibold">{artist.stats.popularity}</strong></span>
                      <span>Oyentes: <strong className="text-[#F8FAFC] font-semibold">{(artist.stats.monthlyListeners / 1000000).toFixed(1)}M</strong></span>
                      <span>Etapa: <strong className="text-[#94A3B8]">{artist.careerStage}</strong></span>
                    </div>
                  </div>

                  {/* Relationship Meters */}
                  <div className="space-y-2 bg-[#0B0C10] p-3 rounded-[8px] border border-[#2A2E3D] text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#94A3B8]">Afinidad Mutua</span>
                        <span className="font-semibold font-mono text-[#F8FAFC]">
                          {rel.affinity > 0 ? `+${rel.affinity}` : rel.affinity}
                        </span>
                      </div>
                      <div className="w-full bg-[#16181F] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]"
                          style={{ width: `${Math.max(10, Math.abs(rel.affinity))}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#94A3B8]">Respeto Profesional</span>
                        <span className="font-semibold text-[#F8FAFC] font-mono">{rel.respect}%</span>
                      </div>
                      <div className="w-full bg-[#16181F] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] h-full rounded-full" style={{ width: `${rel.respect}%` }} />
                      </div>
                    </div>

                    {rel.history.length > 0 && (
                      <div className="pt-2 border-t border-[#2A2E3D] text-[10px] text-[#94A3B8] italic">
                        Último hito: "{rel.history[rel.history.length - 1]}"
                      </div>
                    )}
                  </div>

                  {/* Interaction Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => onInteract(artist.id, 'collab_request')}
                      className="bg-[#0B0C10] hover:bg-white/[0.04] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 py-1.5 px-2 text-[11px] font-medium rounded-[6px] flex flex-col items-center gap-1 transition-all cursor-pointer"
                      title="Proponer Colaboración"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>Colab</span>
                    </button>

                    <button
                      onClick={() => onInteract(artist.id, 'shoutout')}
                      className="bg-[#0B0C10] hover:bg-white/[0.04] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#EC4899]/50 py-1.5 px-2 text-[11px] font-medium rounded-[6px] flex flex-col items-center gap-1 transition-all cursor-pointer"
                      title="Elogio Público / Mención"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#EC4899]" />
                      <span>Elogio</span>
                    </button>

                    <button
                      onClick={() => onInteract(artist.id, 'diss')}
                      className="bg-[#0B0C10] hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/30 py-1.5 px-2 text-[11px] font-medium rounded-[6px] flex flex-col items-center gap-1 transition-all cursor-pointer"
                      title="Tiradera / Diss Track"
                    >
                      <Swords className="w-3.5 h-3.5 text-rose-400" />
                      <span>Tiradera</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
