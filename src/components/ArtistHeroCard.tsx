import React, { useState, useEffect, useRef } from 'react';
import { Artist, WorldState, Song, Album, CareerStage } from '../types';
import { ArtistAvatar } from './ArtistAvatar';
import { TimeSystem } from '../systems/TimeSystem';
import { useSpotlight } from '../hooks/useSpotlight';
import {
  ArrowUpRight,
  Disc3,
  Building2,
  Award,
  Layers,
  User,
  Headphones,
  Palette
} from 'lucide-react';
import {
  formatCompactNumber,
  cleanQuotes,
  formatCityCountry
} from '../utils/formatters';

export interface ArtistHeroCardProps {
  player: Artist;
  world: WorldState;
  playerSongsCount?: number;
  playerAlbumsCount?: number;
  onNavigate: (tab: string) => void;
  onUpdateAvatar?: (avatarUrl?: string, avatarColor?: string, avatarIcon?: string) => void;
  onOpenAvatarModal?: () => void;
  className?: string;
}

export const ArtistHeroCard: React.FC<ArtistHeroCardProps> = ({
  player,
  world,
  playerSongsCount,
  playerAlbumsCount,
  onNavigate,
  onOpenAvatarModal,
  className = ''
}) => {
  const currentEra = player?.eras && player.eras.length > 0
    ? player.eras[player.eras.length - 1]
    : null;

  const playerId = player?.id || 'player';
  const playerStats = player?.stats || {
    popularity: 0,
    reputation: 0,
    artisticCredibility: 0,
    energy: 100,
    monthlyListeners: 0,
    totalStreams: 0,
    funds: 0,
    fansCount: 0,
    fanbaseLoyalty: 50,
    hype: 0
  };

  const computedSongsCount = playerSongsCount !== undefined
    ? playerSongsCount
    : (Object.values(world?.songs || {}) as Song[]).filter((s) => s.artistId === playerId || s.isPlayerSong).length;

  const computedAlbumsCount = playerAlbumsCount !== undefined
    ? playerAlbumsCount
    : (Object.values(world?.albums || {}) as Album[]).filter((a) => a.artistId === playerId).length;

  const mainGenreName =
    world?.genres && player?.mainGenreId && world.genres[player.mainGenreId]?.name
      ? world.genres[player.mainGenreId].name
      : player?.mainGenreId || 'Música Urbana';

  const currentLabel = player?.labelId && world?.labels ? world.labels[player.labelId] : null;
  const currentManager = player?.managerId && world?.managers ? world.managers[player.managerId] : null;

  const prevListenersRef = useRef<number>(playerStats.monthlyListeners || 0);
  const prevStreamsRef = useRef<number>(playerStats.totalStreams || 0);
  const [isListenersSurging, setIsListenersSurging] = useState<boolean>(false);
  const [isStreamsSurging, setIsStreamsSurging] = useState<boolean>(false);

  useEffect(() => {
    const currentListeners = player?.stats?.monthlyListeners || 0;
    if (currentListeners > prevListenersRef.current) {
      setIsListenersSurging(true);
      const timer = setTimeout(() => setIsListenersSurging(false), 2600);
      prevListenersRef.current = currentListeners;
      return () => clearTimeout(timer);
    }
    prevListenersRef.current = currentListeners;
  }, [player?.stats?.monthlyListeners]);

  useEffect(() => {
    const currentStreams = player?.stats?.totalStreams || 0;
    if (currentStreams > prevStreamsRef.current) {
      setIsStreamsSurging(true);
      const timer = setTimeout(() => setIsStreamsSurging(false), 2600);
      prevStreamsRef.current = currentStreams;
      return () => clearTimeout(timer);
    }
    prevStreamsRef.current = currentStreams;
  }, [player?.stats?.totalStreams]);

  const getCareerStageBadge = (stage: CareerStage) => {
    switch (stage) {
      case 'Underground':
        return { bg: 'bg-[#18181C]', text: 'text-[#8E8E99]', border: 'border-[#242429]', label: 'Underground' };
      case 'Emerging':
        return { bg: 'bg-[#34D399]/15', text: 'text-[#34D399]', border: 'border-[#34D399]/30', label: 'Emergente' };
      case 'Breakout':
        return { bg: 'bg-[#38BDF8]/15', text: 'text-[#38BDF8]', border: 'border-[#38BDF8]/30', label: 'En Ascenso' };
      case 'Established':
        return { bg: 'bg-[#38BDF8]/15', text: 'text-[#38BDF8]', border: 'border-[#38BDF8]/30', label: 'Consagrado' };
      case 'Mainstream':
        return { bg: 'bg-[#18181C]', text: 'text-[#F4F4F6]', border: 'border-[#242429]', label: 'Mainstream' };
      case 'Superstar':
        return { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/40', label: 'Superestrella' };
      case 'Legend':
        return { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/50', label: 'Leyenda' };
      case 'Comeback':
        return { bg: 'bg-[#FF4F00]/15', text: 'text-[#FF4F00]', border: 'border-[#FF4F00]/40', label: 'Regreso Triunfal' };
      case 'Veteran':
        return { bg: 'bg-[#18181C]', text: 'text-[#8E8E99]', border: 'border-[#242429]', label: 'Veterano' };
      case 'Declining':
        return { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]', border: 'border-[#EF4444]/40', label: 'En Declive' };
      case 'Retired':
        return { bg: 'bg-[#18181C]', text: 'text-[#52525B]', border: 'border-[#242429]', label: 'Retirado' };
      default:
        return { bg: 'bg-[#18181C]', text: 'text-[#8E8E99]', border: 'border-[#242429]', label: stage };
    }
  };

  const stageBadge = getCareerStageBadge(player.careerStage);
  const { onMouseMove: handleSpotlightMove, onMouseLeave: handleSpotlightLeave } = useSpotlight<HTMLDivElement>();

  return (
    <div
      onMouseMove={handleSpotlightMove}
      onMouseLeave={handleSpotlightLeave}
      className={`lg-hero-glass bg-[#111114]/80 backdrop-blur-xl border border-white/15 rounded-[6px] spotlight-border animate-stagger-in stagger-1 p-5 sm:p-6 relative space-y-4 text-[#F4F4F6] ${className}`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
        {/* Identidad del Artista */}
        <div className="flex items-center gap-4 sm:gap-5 w-full lg:w-auto">
          <div className="relative shrink-0 group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[6px] overflow-hidden border border-white/20 group-hover:border-white/40 transition-colors bg-[#09090B] flex items-center justify-center shadow-lg">
              <ArtistAvatar
                name={player?.name}
                avatarColor={player?.avatarColor}
                avatarIcon={player?.avatarIcon}
                size="custom"
                className="w-full h-full"
                rounded="rounded-[6px]"
              />
            </div>

            {onOpenAvatarModal && (
              <button
                type="button"
                onClick={onOpenAvatarModal}
                className="lg-pill absolute bottom-1 right-1 p-1.5 rounded-[4px] bg-[#111114]/90 border border-white/20 hover:border-[#FF4F00] text-[#F4F4F6] transition-all cursor-pointer"
                title="Cambiar Avatar"
              >
                <Palette className="w-3.5 h-3.5 text-[#FF4F00]" />
              </button>
            )}
          </div>

          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="kit-text-header font-display text-2xl sm:text-3xl tracking-tight leading-none">
                {player?.name || 'Artista'}
              </h1>

              <span
                className={`px-2.5 py-0.5 rounded-[4px] text-xs font-sans font-bold uppercase tracking-wider ${stageBadge.bg} ${stageBadge.text} border ${stageBadge.border}`}
              >
                {stageBadge.label}
              </span>

              <span className="px-2.5 py-0.5 rounded-[4px] text-xs font-sans font-bold text-[#FF4F00] bg-[#FF4F00]/15 border border-[#FF4F00]/35">
                {mainGenreName}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8E8E99] flex-wrap font-sans">
              {player?.realName && (
                <>
                  <span className="text-[#F4F4F6] font-medium">"{cleanQuotes(player.realName)}"</span>
                  <span className="text-white/20">•</span>
                </>
              )}
              <span>{formatCityCountry(player?.city, player?.country)}</span>
              <span className="text-white/20">•</span>
              <span className="font-sans tabular-nums text-[#F4F4F6]">
                {TimeSystem.calculateAge(player?.birthYear || 2008, world?.currentYear || 2026)} años
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8E8E99] flex-wrap">
              <span className="surface-2 bg-[#18181C] border border-[#242429] rounded-[4px] inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans tabular-nums">
                <Disc3 className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{computedSongsCount} Singles</span>
              </span>

              <span className="surface-2 bg-[#18181C] border border-[#242429] rounded-[4px] inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans tabular-nums">
                <Layers className="w-3.5 h-3.5 text-[#FF4F00]" />
                <span>{computedAlbumsCount} Álbumes</span>
              </span>

              <span className="surface-2 bg-[#18181C] border border-[#242429] rounded-[4px] inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans">
                <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>
                  Legado <strong className="text-[#F59E0B] font-sans tabular-nums">{player?.legacyScore ?? 0}/100</strong>
                </span>
              </span>

              {currentLabel && (
                <span className="surface-2 bg-[#18181C] border border-[#242429] rounded-[4px] inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans">
                  <Building2 className="w-3 h-3 text-[#8E8E99]" />
                  <span>{currentLabel.name}</span>
                </span>
              )}

              {currentManager && (
                <span className="surface-2 bg-[#18181C] border border-[#242429] rounded-[4px] inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans">
                  <User className="w-3 h-3 text-[#8E8E99]" />
                  <span>{currentManager.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2 Métricas Principales de Alcance (Streams = Sky #38BDF8) */}
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0 min-w-[260px]">
          <div
            className={`surface-2 bg-[#18181C]/90 border rounded-[4px] p-3.5 text-left transition-all ${
              isListenersSurging ? 'border-[#38BDF8]' : 'border-[#242429]'
            }`}
          >
            <span className="text-3xs font-sans font-bold uppercase tracking-wider text-[#8E8E99] flex items-center gap-1.5">
              <Headphones className="w-3 h-3 text-[#38BDF8]" />
              OYENTES / MES
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#38BDF8] font-sans tabular-nums block mt-1 tracking-tight">
              {formatCompactNumber(playerStats.monthlyListeners)}
            </span>
          </div>

          <div
            className={`surface-2 bg-[#18181C]/90 border rounded-[4px] p-3.5 text-left transition-all ${
              isStreamsSurging ? 'border-[#38BDF8]' : 'border-[#242429]'
            }`}
          >
            <span className="text-3xs font-sans font-bold uppercase tracking-wider text-[#8E8E99] flex items-center gap-1.5">
              <Disc3 className="w-3 h-3 text-[#38BDF8]" />
              STREAMS TOTALES
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#F4F4F6] font-sans tabular-nums block mt-1 tracking-tight">
              {formatCompactNumber(playerStats.totalStreams)}
            </span>
          </div>
        </div>
      </div>

      {/* Tira compacta de Era Actual */}
      {currentEra && (
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            <Disc3 className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
            <span className="text-[#8E8E99] truncate">
              Era actual: <strong className="text-[#F4F4F6]">{currentEra.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('career')}
            className="surface-2 bg-[#18181C] border border-[#242429] hover:border-[#FF4F00] rounded-[4px] px-2.5 py-1 text-xs text-[#8E8E99] hover:text-[#FF4F00] flex items-center gap-1 font-sans font-semibold cursor-pointer shrink-0 transition-colors"
          >
            <span>Ver Eras</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtistHeroCard;
