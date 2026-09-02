import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Artist, WorldState } from '../types';
import { formatCompactNumber } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';
import {
  Users,
  CheckCircle2,
  Sparkles,
  Lock,
  ChevronDown,
  Search,
  X,
  Zap,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

export type FeatStatusType = 'agreed' | 'available' | 'requires_bond';

export interface FeatStatusInfo {
  status: FeatStatusType;
  label: string;
  badgeClass: string;
  dotClass: string;
  glowClass: string;
  icon: React.ElementType;
  description: string;
  canDirectlySelect: boolean;
  actionHint?: string;
}

export interface FeatArtistSelectorProps {
  selectedArtistId: string;
  onChange: (artistId: string) => void;
  sceneArtists: Artist[];
  player: Artist;
  world: WorldState;
  disabled?: boolean;
  className?: string;
  onOpenAdvancedCollab?: (artistId?: string) => void;
}

/**
 * Computes the feat eligibility status based on Studio After Dark design.md rules
 */
export function getArtistFeatStatus(
  artist: Artist,
  player: Artist
): FeatStatusInfo {
  const rel = player.relationships?.[artist.id];
  const affinity = rel?.affinity ?? 0;
  const respect = rel?.respect ?? 50;
  const pastCollabs = rel?.pastCollabsCount ?? 0;
  const isFeud = rel?.relationType === 'feud' || rel?.activeRivalry;
  const popDiff = artist.stats.popularity - player.stats.popularity;

  // 1. ACORDADO (Neon Green #10B981)
  // Alianza preexistente, socio habitual de estudio o relación formal de colaborador
  if (
    rel?.relationType === 'collaborator' ||
    (pastCollabs > 0 && affinity >= 20) ||
    rel?.relationType === 'friend' && affinity >= 45
  ) {
    return {
      status: 'agreed',
      label: 'Acordado',
      badgeClass: 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/40',
      dotClass: 'bg-[#10B981]',
      glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      icon: CheckCircle2,
      description: 'Alianza consolidada en estudio. Aceptación inmediata asegurada.',
      canDirectlySelect: true,
      actionHint: 'Listo para grabar track'
    };
  }

  // 2. REQUIERE VÍNCULO (Slate Tenue #64748B)
  // Conflicto abierto, enemistad o brecha inalcanzable de popularidad sin relación previa
  if (isFeud || affinity < -10 || (popDiff > 25 && affinity < 15 && respect < 60)) {
    return {
      status: 'requires_bond',
      label: 'Requiere Vínculo',
      badgeClass: 'bg-slate-800/60 text-[#94A3B8] border-[#334155]',
      dotClass: 'bg-[#64748B]',
      glowClass: 'border-[#2A2E3D]',
      icon: Lock,
      description: isFeud
        ? 'Feudo activo. Requiere reconciliación pública antes de colaborar.'
        : popDiff > 25
        ? 'Superestrella inalcanzable sin reputación o mención previa.'
        : 'Afinidad baja. Enviá shoutouts o mejorá tu estatus.',
      canDirectlySelect: false,
      actionHint: 'Construir afinidad primero'
    };
  }

  // 3. DISPONIBLE (Neon Violet #8B5CF6 / Magenta)
  // Neutral o positivo, receptivo a propuestas profesionales de estudio
  return {
    status: 'available',
    label: 'Disponible',
    badgeClass: 'bg-[#8B5CF6]/15 text-[#C084FC] border-[#8B5CF6]/40',
    dotClass: 'bg-[#8B5CF6]',
    glowClass: 'shadow-[0_0_12px_rgba(139,92,246,0.25)]',
    icon: Sparkles,
    description: 'Abierto a propuestas de estudio con presupuesto estándar.',
    canDirectlySelect: true,
    actionHint: 'Listo para negociar feat'
  };
}

export const FeatArtistSelector: React.FC<FeatArtistSelectorProps> = ({
  selectedArtistId,
  onChange,
  sceneArtists,
  player,
  world,
  disabled = false,
  className = '',
  onOpenAdvancedCollab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'agreed' | 'available' | 'requires_bond'>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedArtist = world.artists[selectedArtistId];
  const selectedStatus = selectedArtist ? getArtistFeatStatus(selectedArtist, player) : null;

  // Annotated artists list with calculated status
  const artistsWithStatus = useMemo(() => {
    return sceneArtists.map(artist => ({
      artist,
      statusInfo: getArtistFeatStatus(artist, player),
      affinity: player.relationships?.[artist.id]?.affinity ?? 0,
      respect: player.relationships?.[artist.id]?.respect ?? 50
    }));
  }, [sceneArtists, player]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: artistsWithStatus.length,
      agreed: artistsWithStatus.filter(a => a.statusInfo.status === 'agreed').length,
      available: artistsWithStatus.filter(a => a.statusInfo.status === 'available').length,
      requires_bond: artistsWithStatus.filter(a => a.statusInfo.status === 'requires_bond').length
    };
  }, [artistsWithStatus]);

  // Filtered and sorted artists (Agreed first, then Available, then Requires Bond)
  const filteredArtists = useMemo(() => {
    return artistsWithStatus
      .filter(item => {
        if (filterTab !== 'all' && item.statusInfo.status !== filterTab) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const genreName = (world.genres[item.artist.mainGenreId]?.name || '').toLowerCase();
          return item.artist.name.toLowerCase().includes(q) || genreName.includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        const orderWeight: Record<FeatStatusType, number> = {
          agreed: 1,
          available: 2,
          requires_bond: 3
        };
        if (orderWeight[a.statusInfo.status] !== orderWeight[b.statusInfo.status]) {
          return orderWeight[a.statusInfo.status] - orderWeight[b.statusInfo.status];
        }
        return b.artist.stats.monthlyListeners - a.artist.stats.monthlyListeners;
      });
  }, [artistsWithStatus, filterTab, searchQuery, world.genres]);

  const handleSelect = (artistId: string, statusInfo?: FeatStatusInfo) => {
    if (statusInfo && !statusInfo.canDirectlySelect) {
      playSound('click');
      // If locked, optionally trigger advanced collab modal or advice
      if (onOpenAdvancedCollab) {
        onOpenAdvancedCollab(artistId);
      }
      return;
    }
    playSound('click');
    onChange(artistId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}>
      {/* TRIGGER BUTTON (Studio After Dark / 6px radius) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            playSound('click');
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full bg-[#0B0C10] border rounded-[6px] px-3.5 py-2.5 text-xs text-[#F8FAFC] flex items-center justify-between transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.3)] bg-[#16181F]'
            : 'border-[#2A2E3D] hover:border-[#8B5CF6]/60 hover:bg-[#16181F]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedArtist ? (
            <>
              {/* Selected Avatar & Name */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-[10px] font-bold text-white shrink-0 border border-white/20">
                {selectedArtist.name.charAt(0)}
              </div>
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-[#F8FAFC] truncate">
                  ft. {selectedArtist.name}
                </span>
                <span className="text-[10px] text-[#94A3B8] hidden sm:inline">
                  ({world.genres[selectedArtist.mainGenreId]?.name || selectedArtist.mainGenreId})
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Users className="w-4 h-4 text-[#8B5CF6]" />
              <span>Solista (Sin artista invitado)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {selectedStatus && (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${selectedStatus.badgeClass} ${selectedStatus.glowClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedStatus.dotClass} ${selectedStatus.status === 'agreed' ? 'animate-pulse' : ''}`} />
              {selectedStatus.label}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#8B5CF6]' : ''}`} />
        </div>
      </button>

      {/* DROPDOWN POPOVER (Slate Glass / 12px radius / backdrop blur) */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#16181F] border border-[#2A2E3D] rounded-[12px] shadow-2xl p-3 space-y-3 max-h-[420px] flex flex-col overflow-hidden backdrop-blur-xl animate-fade-in">
          {/* Header & Search Bar */}
          <div className="space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar colega por nombre o género..."
                className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] rounded-[6px] pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#5F5F5D] focus:outline-none transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Pills (9999px) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-[#F8FAFC] text-[#1C1C1C] border-[#F8FAFC] shadow-xs'
                    : 'bg-[#0B0C10] text-[#94A3B8] border-[#2A2E3D] hover:border-slate-500'
                }`}
              >
                Todos ({counts.all})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('agreed')}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'agreed'
                    ? 'bg-[#10B981] text-[#0B0C10] border-[#10B981] font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30 hover:bg-[#10B981]/20'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Acordados ({counts.agreed})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('available')}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'available'
                    ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                    : 'bg-[#8B5CF6]/10 text-[#C084FC] border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                Disponibles ({counts.available})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('requires_bond')}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'requires_bond'
                    ? 'bg-slate-700 text-[#F8FAFC] border-slate-500'
                    : 'bg-slate-900/60 text-[#94A3B8] border-[#2A2E3D] hover:border-slate-600'
                }`}
              >
                <Lock className="w-2.5 h-2.5" />
                Vínculo ({counts.requires_bond})
              </button>
            </div>
          </div>

          {/* List of Artists */}
          <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
            {/* Solo option */}
            <div
              onClick={() => handleSelect('')}
              className={`p-2.5 rounded-[8px] border transition-all cursor-pointer flex items-center justify-between ${
                !selectedArtistId
                  ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#F8FAFC]'
                  : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-slate-600 text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#16181F] border border-[#2A2E3D] flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#F8FAFC]">Lanzamiento Solista</div>
                  <div className="text-[10px] text-[#94A3B8]">100% regalías y protagonismo exclusivo</div>
                </div>
              </div>
              {!selectedArtistId && (
                <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">Activo</span>
              )}
            </div>

            {/* Render Candidates */}
            {filteredArtists.map(({ artist, statusInfo, affinity, respect }) => {
              const isCurrent = selectedArtistId === artist.id;
              const StatusIcon = statusInfo.icon;
              const isLocked = !statusInfo.canDirectlySelect;

              return (
                <div
                  key={artist.id}
                  onClick={() => handleSelect(artist.id, statusInfo)}
                  className={`p-2.5 rounded-[8px] border transition-all duration-150 relative group ${
                    isCurrent
                      ? 'bg-[#16181F] border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                      : isLocked
                      ? 'bg-[#0B0C10]/70 border-[#2A2E3D] opacity-75 hover:opacity-95 hover:border-slate-600 cursor-pointer'
                      : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#8B5CF6]/50 hover:bg-[#16181F] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-[6px] flex items-center justify-center text-xs font-bold shrink-0 border ${
                          statusInfo.status === 'agreed'
                            ? 'bg-gradient-to-br from-[#10B981] to-emerald-950 text-white border-emerald-400/40'
                            : statusInfo.status === 'available'
                            ? 'bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white border-purple-400/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {artist.name.charAt(0)}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#F8FAFC] truncate">
                            {artist.name}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-[#94A3B8] px-1.5 py-0.2 rounded bg-[#16181F] border border-[#2A2E3D]">
                            {world.genres[artist.mainGenreId]?.name || artist.mainGenreId}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-[10px] text-[#94A3B8] font-mono">
                          <span>{formatCompactNumber(artist.stats.monthlyListeners)} oyentes</span>
                          <span>•</span>
                          <span className={affinity > 0 ? 'text-emerald-400 font-bold' : affinity < 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                            {affinity > 0 ? `+${affinity}` : affinity} afinidad
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Pill Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusInfo.badgeClass} ${statusInfo.glowClass}`}
                      >
                        <StatusIcon className="w-2.5 h-2.5" />
                        {statusInfo.label}
                      </span>

                      {isLocked && onOpenAdvancedCollab && (
                        <span className="text-[9px] text-[#8B5CF6] group-hover:underline flex items-center gap-0.5">
                          Negociar <TrendingUp className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contextual description tooltip on hover */}
                  <div className="mt-1.5 pt-1.5 border-t border-[#2A2E3D]/50 text-[10px] text-[#94A3B8] flex items-center justify-between">
                    <span className="truncate">{statusInfo.description}</span>
                    <span className="text-[9px] font-semibold text-slate-500 shrink-0 ml-2">
                      {statusInfo.actionHint}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredArtists.length === 0 && (
              <div className="p-6 text-center text-xs text-[#94A3B8] space-y-1">
                <Users className="w-6 h-6 text-[#64748B] mx-auto" />
                <p>No se encontraron artistas con ese filtro.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
