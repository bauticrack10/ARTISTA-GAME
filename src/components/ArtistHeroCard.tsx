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
        return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Emergente' };
      case 'Breakout':
        return { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', label: 'En Ascenso' };
      case 'Established':
        return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Consagrado' };
      case 'Mainstream':
        return { bg: 'bg-[#18181C]', text: 'text-[#F4F4F6]', border: 'border-[#242429]', label: 'Mainstream' };
      case 'Superstar':
        return { bg: 'bg-[#18181C]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/40', label: 'Superestrella' };
      case 'Legend':
        return { bg: 'bg-[#18181C]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/50', label: 'Leyenda' };
      case 'Comeback':
        return { bg: 'bg-[#18181C]', text: 'text-[#FF4F00]', border: 'border-[#FF4F00]/40', label: 'Regreso Triunfal' };
      case 'Veteran':
        return { bg: 'bg-[#18181C]', text: 'text-[#8E8E99]', border: 'border-[#242429]', label: 'Veterano' };
      case 'Declining':
        return { bg: 'bg-[#18181C]', text: 'text-[#EF4444]', border: 'border-[#EF4444]/40', label: 'En Declive' };
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
      className={`liquid-glass-card spotlight-border animate-stagger-in stagger-1 p-5 sm:p-6 relative space-y-4 text-[#F4F4F6] ${className}`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
        {/* Identidad del Artista */}
        <div className="flex items-center gap-4 sm:gap-5 w-full lg:w-auto">
          <div className="relative shrink-0 group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[12px] overflow-hidden border border-white/20 group-hover:border-white/40 transition-colors bg-[#09090B]/60 flex items-center justify-center shadow-lg">
              <ArtistAvatar
                name={player?.name}
                avatarColor={player?.avatarColor}
                avatarIcon={player?.avatarIcon}
                size="custom"
                className="w-full h-full"
                rounded="rounded-[12px]"
              />
            </div>

            {onOpenAvatarModal && (
              <button
                onClick={onOpenAvatarModal}
                className="liquid-glass-pill absolute bottom-1 right-1 p-1.5 rounded-[6px] hover:bg-white/10 text-[#F4F4F6] transition-all cursor-pointer"
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
                className={`liquid-glass-pill px-2.5 py-0.5 rounded-[8px] text-xs font-sans font-bold uppercase tracking-wider ${stageBadge.bg} ${stageBadge.text} border ${stageBadge.border}`}
              >
                {stageBadge.label}
              </span>

              <span className="liquid-glass-pill px-2.5 py-0.5 rounded-[8px] text-xs font-sans font-bold text-[#FF4F00] border border-[#FF4F00]/30">
                {mainGenreName}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8E8E99] flex-wrap">
              {player?.realName && (
                <>
                  <span className="text-[#F4F4F6] font-medium">"{cleanQuotes(player.realName)}"</span>
                  <span className="text-white/20">•</span>
                </>
              )}
              <span>{formatCityCountry(player?.city, player?.country)}</span>
              <span className="text-white/20">•</span>
              <span className="font-mono tabular-nums text-[#F4F4F6]">
                {TimeSystem.calculateAge(player?.birthYear || 2008, world?.currentYear || 2026)} años
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8E8E99] flex-wrap">
              <span className="liquid-glass-pill inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans">
                <Disc3 className="w-3.5 h-3.5 text-[#8E8E99]" />
                <span>{computedSongsCount} Singles</span>
              </span>

              <span className="liquid-glass-pill inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans">
                <Layers className="w-3.5 h-3.5 text-[#8E8E99]" />
                <span>{computedAlbumsCount} Álbumes</span>
              </span>

              <span className="liquid-glass-pill inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans">
                <Award className="w-3.5 h-3.5 text-[#00E599]" />
                <span>Legado <strong className="text-[#F4F4F6] font-mono tabular-nums">{player?.legacyScore ?? 0}/100</strong></span>
              </span>

              {currentLabel && (
                <span className="liquid-glass-pill inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans">
                  <Building2 className="w-3 h-3 text-[#8E8E99]" />
                  <span>{currentLabel.name}</span>
                </span>
              )}

              {currentManager && (
                <span className="liquid-glass-pill inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8E8E99] font-sans">
                  <User className="w-3 h-3 text-[#8E8E99]" />
                  <span>{currentManager.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2 Métricas Principales de Alcance (sin repetir Hype ni Popularidad que están abajo) */}
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0 min-w-[260px]">
          <div
            className={`liquid-glass-subcard p-3.5 text-left transition-all ${
              isListenersSurging ? 'border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.35)]' : ''
            }`}
          >
            <span className="text-3xs font-sans font-bold uppercase tracking-wider text-[#8E8E99] flex items-center gap-1.5">
              <Headphones className="w-3 h-3 text-[#8E8E99]" />
              OYENTES / MES
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#F4F4F6] font-mono tabular-nums block mt-1 tracking-tight">
              {formatCompactNumber(playerStats.monthlyListeners)}
            </span>
          </div>

          <div
            className={`liquid-glass-subcard p-3.5 text-left transition-all ${
              isStreamsSurging ? 'border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.35)]' : ''
            }`}
          >
            <span className="text-3xs font-sans font-bold uppercase tracking-wider text-[#8E8E99] flex items-center gap-1.5">
              <Disc3 className="w-3 h-3 text-[#8E8E99]" />
              STREAMS TOTALES
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#F4F4F6] font-mono tabular-nums block mt-1 tracking-tight">
              {formatCompactNumber(playerStats.totalStreams)}
            </span>
          </div>
        </div>
      </div>

      {/* Tira compacta de Era Actual */}
      {currentEra && (
        <div className="pt-2 flex items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            <Disc3 className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
            <span className="text-[#8E8E99] truncate">
              Era actual: <strong className="text-[#F4F4F6]">{currentEra.name}</strong>
            </span>
          </div>
          <button
            onClick={() => onNavigate('career')}
            className="liquid-glass-pill px-2.5 py-1 text-xs text-[#8E8E99] hover:text-[#FF4F00] flex items-center gap-1 font-sans font-semibold cursor-pointer shrink-0 transition-colors"
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
