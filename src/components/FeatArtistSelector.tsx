import React, { useState, useMemo, useRef, useEffect } from 'react';
import { activateOnKey } from '../utils/a11y';
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

  // 1. ACORDADO (LED Emerald #00E599)
  // Alianza preexistente, socio habitual de estudio o relación formal de colaborador
  if (
    rel?.relationType === 'collaborator' ||
    (pastCollabs > 0 && affinity >= 20) ||
    rel?.relationType === 'friend' && affinity >= 45
  ) {
    return {
      status: 'agreed',
      label: 'Acordado',
      badgeClass: 'bg-[#00E599]/10 text-[#00E599] border-[#00E599]/30 font-sans',
      dotClass: 'bg-[#00E599]',
      glowClass: '',
      icon: CheckCircle2,
      description: 'Alianza consolidada en estudio. Aceptación inmediata asegurada.',
      canDirectlySelect: true,
      actionHint: 'Listo para grabar track'
    };
  }

  // 2. REQUIERE VÍNCULO (Muted Steel / Hairline Slate)
  // Conflicto abierto, enemistad o brecha inalcanzable de popularidad sin relación previa
  if (isFeud || affinity < -10 || (popDiff > 25 && affinity < 15 && respect < 60)) {
    return {
      status: 'requires_bond',
      label: 'Requiere Vínculo',
      badgeClass: 'bg-[#18181C] text-[#8E8E99] border-[#242429] font-sans',
      dotClass: 'bg-[#52525B]',
      glowClass: '',
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

  // 3. DISPONIBLE (Signal Orange #FF4F00)
  // Neutral o positivo, receptivo a propuestas profesionales de estudio
  return {
    status: 'available',
    label: 'Disponible',
    badgeClass: 'bg-[#FF4F00]/10 text-[#FF4F00] border-[#FF4F00]/30 font-sans',
    dotClass: 'bg-[#FF4F00]',
    glowClass: '',
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
    <div className={`relative ${className}`} ref={containerRef}>
      {/* TRIGGER BUTTON (Studio Panel / 4px radius) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            playSound('click');
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full bg-[#09090B] border rounded-[4px] px-3.5 py-2.5 text-xs text-[#F4F4F6] flex items-center justify-between transition-all duration-150 cursor-pointer ${
          isOpen
            ? 'border-[#FF4F00] bg-[#111114]'
            : 'border-[#242429] hover:border-[#3F3F46] hover:bg-[#111114]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedArtist ? (
            <>
              {/* Selected Avatar & Name */}
              <div className="w-6 h-6 rounded-[2px] bg-[#18181C] border border-[#242429] flex items-center justify-center text-2xs font-sans font-bold text-[#F4F4F6] shrink-0">
                {selectedArtist.name.charAt(0)}
              </div>
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-[#F4F4F6] truncate">
                  ft. {selectedArtist.name}
                </span>
                <span className="text-2xs text-[#8E8E99] font-sans hidden sm:inline">
                  ({world.genres[selectedArtist.mainGenreId]?.name || selectedArtist.mainGenreId})
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-[#8E8E99]">
              <Users className="w-4 h-4 text-[#FF4F00]" />
              <span>Solista (Sin artista invitado)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {selectedStatus && (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-2xs font-sans font-bold uppercase tracking-wider border ${selectedStatus.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedStatus.dotClass} ${selectedStatus.status === 'agreed' ? 'animate-pulse' : ''}`} />
              {selectedStatus.label}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-[#8E8E99] transition-transform duration-150 ${isOpen ? 'rotate-180 text-[#FF4F00]' : ''}`} />
        </div>
      </button>

      {/* DROPDOWN POPOVER */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#111114] border border-[#242429] rounded-[6px] shadow-2xl p-3 space-y-3 max-h-[420px] flex flex-col overflow-hidden animate-fade-in">
          {/* Header & Search Bar */}
          <div className="space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E99]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar colega por nombre o género..."
                className="w-full bg-[#09090B] border border-[#242429] focus:border-[#FF4F00] rounded-[4px] pl-8 pr-3 py-1.5 text-xs text-[#F4F4F6] placeholder-[#52525B] focus:outline-none transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8E99] hover:text-[#F4F4F6]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scroll-fade-x pb-1 text-2xs font-sans font-bold">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-[4px] border transition-all cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-[#F4F4F6] text-[#09090B] border-[#F4F4F6]'
                    : 'bg-[#09090B] text-[#8E8E99] border-[#242429] hover:border-[#3F3F46]'
                }`}
              >
                Todos ({counts.all})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('agreed')}
                className={`px-2.5 py-1 rounded-[4px] border transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'agreed'
                    ? 'bg-[#00E599] text-[#09090B] border-[#00E599]'
                    : 'bg-[#00E599]/10 text-[#00E599] border-[#00E599]/30 hover:bg-[#00E599]/20'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
                Acordados ({counts.agreed})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('available')}
                className={`px-2.5 py-1 rounded-[4px] border transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'available'
                    ? 'bg-[#FF4F00] text-white border-[#FF4F00]'
                    : 'bg-[#FF4F00]/10 text-[#FF4F00] border-[#FF4F00]/30 hover:bg-[#FF4F00]/20'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00]" />
                Disponibles ({counts.available})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('requires_bond')}
                className={`px-2.5 py-1 rounded-[4px] border transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'requires_bond'
                    ? 'bg-[#242429] text-[#F4F4F6] border-[#3F3F46]'
                    : 'bg-[#18181C] text-[#8E8E99] border-[#242429] hover:border-[#3F3F46]'
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
              role="button"
              tabIndex={0}
              onKeyDown={activateOnKey}
              onClick={() => handleSelect('')}
              className={`p-2.5 rounded-[4px] border transition-all cursor-pointer flex items-center justify-between ${
                !selectedArtistId
                  ? 'bg-[#18181C] border-[#FF4F00] text-[#F4F4F6]'
                  : 'bg-[#09090B] border-[#242429] hover:border-[#3F3F46] text-[#8E8E99] hover:text-[#F4F4F6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[2px] bg-[#18181C] border border-[#242429] flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-[#FF4F00]" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#F4F4F6]">Lanzamiento Solista</div>
                  <div className="text-2xs text-[#8E8E99]">100% regalías y protagonismo exclusivo</div>
                </div>
              </div>
              {!selectedArtistId && (
                <span className="text-2xs font-sans font-bold text-[#FF4F00] uppercase tracking-wider">Activo</span>
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
                  role="button"
                  tabIndex={0}
                  onKeyDown={activateOnKey}
                  onClick={() => handleSelect(artist.id, statusInfo)}
                  className={`p-2.5 rounded-[4px] border transition-all duration-150 relative group ${
                    isCurrent
                      ? 'bg-[#18181C] border-[#FF4F00]'
                      : isLocked
                      ? 'bg-[#09090B]/70 border-[#242429] opacity-70 hover:opacity-95 hover:border-[#3F3F46] cursor-pointer'
                      : 'bg-[#09090B] border-[#242429] hover:border-[#3F3F46] hover:bg-[#18181C] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-[4px] flex items-center justify-center text-xs font-sans font-bold shrink-0 border ${
                          statusInfo.status === 'agreed'
                            ? 'bg-[#18181C] text-[#00E599] border-[#00E599]/40'
                            : statusInfo.status === 'available'
                            ? 'bg-[#18181C] text-[#FF4F00] border-[#FF4F00]/40'
                            : 'bg-[#18181C] text-[#52525B] border-[#242429]'
                        }`}
                      >
                        {artist.name.charAt(0)}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#F4F4F6] truncate">
                            {artist.name}
                          </span>
                          <span className="text-2xs uppercase font-sans font-bold text-[#8E8E99] px-1.5 py-0.2 rounded-[2px] bg-[#18181C] border border-[#242429]">
                            {world.genres[artist.mainGenreId]?.name || artist.mainGenreId}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-2xs text-[#8E8E99] font-sans tabular-nums">
                          <span>{formatCompactNumber(artist.stats.monthlyListeners)} oyentes</span>
                          <span>•</span>
                          <span className={affinity > 0 ? 'text-[#00E599] font-bold' : affinity < 0 ? 'text-[#EF4444] font-bold' : 'text-[#8E8E99]'}>
                            {affinity > 0 ? `+${affinity}` : affinity} afinidad
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Pill Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-2xs font-sans font-bold uppercase tracking-wider border ${statusInfo.badgeClass}`}
                      >
                        <StatusIcon className="w-2.5 h-2.5" />
                        {statusInfo.label}
                      </span>

                      {isLocked && onOpenAdvancedCollab && (
                        <span className="text-2xs font-sans text-[#FF4F00] group-hover:underline flex items-center gap-0.5">
                          Negociar <TrendingUp className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contextual description tooltip on hover */}
                  <div className="mt-1.5 pt-1.5 border-t border-[#242429] text-2xs text-[#8E8E99] flex items-center justify-between">
                    <span className="truncate">{statusInfo.description}</span>
                    <span className="text-2xs font-sans font-semibold text-[#52525B] shrink-0 ml-2">
                      {statusInfo.actionHint}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredArtists.length === 0 && (
              <div className="p-6 text-center text-xs text-[#8E8E99] space-y-1">
                <Users className="w-6 h-6 text-[#52525B] mx-auto" />
                <p>No se encontraron artistas con ese filtro.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
