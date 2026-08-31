import React, { useState, useEffect, useRef } from 'react';
import { Artist, WorldState, Song, Album, CareerStage } from '../types';
import {
  AVATAR_PALETTES,
  AVATAR_SYMBOLS,
  VECTOR_PRESETS,
  AvatarPaletteOption,
  AvatarSymbolOption,
  VectorAvatarPreset
} from '../data/avatarPresets';
import { ArtistAvatar } from './ArtistAvatar';
import { TimeSystem } from '../systems/TimeSystem';
import {
  Camera,
  Sparkles,
  ArrowUpRight,
  Disc3,
  Edit3,
  Check,
  X,
  Crown,
  Building2,
  Award,
  Layers,
  Flame,
  TrendingUp,
  User,
  Headphones,
  Users,
  DollarSign,
  Zap,
  Wallet,
  Palette
} from 'lucide-react';
import {
  formatMoney,
  formatFans,
  formatListeners,
  formatStreams,
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
  onUpdateAvatar,
  onOpenAvatarModal,
  className = ''
}) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(
    player?.avatarColor || 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]'
  );
  const [selectedIcon, setSelectedIcon] = useState<string>(player?.avatarIcon || 'mic');
  const [avatarType, setAvatarType] = useState<'symbol' | 'initials'>(
    player?.avatarIcon ? 'symbol' : 'symbol'
  );

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

  // Reactive change detection for live visual feedback on viral surges
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

  // Dynamic growth percentage calculation for streams/listeners
  const listenerGrowth = React.useMemo(() => {
    const playerSongs = (Object.values(world?.songs || {}) as Song[]).filter(
      (s) => s.artistId === playerId
    );
    const totalStreams = player?.stats?.totalStreams || 0;
    if (playerSongs.length === 0 || totalStreams === 0) {
      return {
        formatted: '0.0%',
        label: '0.0% este semestre',
        isPositive: false,
        isZero: true
      };
    }

    let currentPeriodStreams = 0;
    let prevPeriodStreams = 0;
    for (const song of playerSongs) {
      const history = song.monthlyStreamsHistory || [];
      if (history.length >= 2) {
        currentPeriodStreams += history[history.length - 1] || 0;
        prevPeriodStreams += history[history.length - 2] || 0;
      } else if (history.length === 1) {
        currentPeriodStreams += history[0] || 0;
      }
    }

    if (prevPeriodStreams === 0) {
      if (currentPeriodStreams > 0) {
        return { formatted: '+100%', label: '+100% debut', isPositive: true, isZero: false };
      }
      return { formatted: '0.0%', label: '0.0% este semestre', isPositive: false, isZero: true };
    }

    const pct = ((currentPeriodStreams - prevPeriodStreams) / prevPeriodStreams) * 100;
    const sign = pct >= 0 ? '+' : '';
    return {
      formatted: `${sign}${pct.toFixed(1)}%`,
      label: `${sign}${pct.toFixed(1)}% este semestre`,
      isPositive: pct > 0,
      isZero: pct === 0
    };
  }, [world?.songs, playerId, player?.stats?.totalStreams]);

  const handleOpenModal = () => {
    if (onOpenAvatarModal) {
      onOpenAvatarModal();
    } else {
      setSelectedColor(player?.avatarColor || 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]');
      setSelectedIcon(player?.avatarIcon || 'mic');
      setAvatarType(player?.avatarIcon ? 'symbol' : 'initials');
      setIsAvatarModalOpen(true);
    }
  };

  const handleSaveAvatar = () => {
    if (onUpdateAvatar) {
      onUpdateAvatar(undefined, selectedColor, avatarType === 'symbol' ? selectedIcon : undefined);
    }
    setIsAvatarModalOpen(false);
  };

  const handleApplyPreset = (preset: VectorAvatarPreset) => {
    setSelectedColor(preset.color);
    setSelectedIcon(preset.icon);
    setAvatarType('symbol');
  };

  const getCareerStageBadge = (stage: CareerStage) => {
    switch (stage) {
      case 'Underground':
        return { bg: 'bg-[#16181F]', text: 'text-[#94A3B8]', border: 'border-[#2A2E3D]', label: 'Underground' };
      case 'Emerging':
        return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Emergente' };
      case 'Breakout':
        return { bg: 'bg-cyan-500/15', text: 'text-[#06B6D4]', border: 'border-[#06B6D4]/30', label: 'En Ascenso' };
      case 'Established':
        return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Consagrado' };
      case 'Mainstream':
        return { bg: 'bg-purple-500/15', text: 'text-[#C084FC]', border: 'border-[#8B5CF6]/30', label: 'Mainstream' };
      case 'Superstar':
        return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Superestrella' };
      case 'Legend':
        return { bg: 'bg-gradient-to-r from-amber-500/20 to-purple-500/20', text: 'text-amber-300', border: 'border-amber-400/40', label: 'Leyenda' };
      case 'Comeback':
        return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Regreso Triunfal' };
      case 'Veteran':
        return { bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30', label: 'Veterano' };
      case 'Declining':
        return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', label: 'En Declive' };
      case 'Retired':
        return { bg: 'bg-stone-500/15', text: 'text-stone-400', border: 'border-stone-500/30', label: 'Retirado' };
      default:
        return { bg: 'bg-[#16181F]', text: 'text-[#94A3B8]', border: 'border-[#2A2E3D]', label: stage };
    }
  };

  const stageBadge = getCareerStageBadge(player.careerStage);

  return (
    <div
      className={`bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-6 md:p-8 relative overflow-hidden shadow-lg space-y-6 text-[#F8FAFC] ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Top Main Section: Portrait, Bio & Quick Metrics */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Avatar / Portrait + Info Hierarchy */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 w-full lg:w-auto">
          {/* Professional Vector Avatar Container */}
          <div className="relative shrink-0 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-[14px] overflow-hidden border-2 border-[#2A2E3D] group-hover:border-[#8B5CF6]/60 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-[#0B0C10] flex items-center justify-center">
              <ArtistAvatar
                name={player?.name}
                avatarColor={player?.avatarColor}
                avatarIcon={player?.avatarIcon}
                size="custom"
                className="w-full h-full"
                rounded="rounded-[12px]"
              />
            </div>

            {/* Quick Edit Overlay Button */}
            <button
              onClick={handleOpenModal}
              className="absolute bottom-1 right-1 p-2 rounded-full bg-[#0B0C10]/90 hover:bg-[#8B5CF6] text-[#F8FAFC] border border-[#2A2E3D] shadow-md transition-all cursor-pointer group-hover:scale-110"
              title="Personalizar Avatar Vectorial"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Artist Identity & Metadata Details */}
          <div className="space-y-2.5">
            {/* Header: Artist Stage Name + Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-1px] text-[#F8FAFC] leading-tight">
                {player?.name || 'Artista'}
              </h1>

              {/* Career Stage Pill */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${stageBadge.bg} ${stageBadge.text} border ${stageBadge.border} shadow-xs`}
              >
                {stageBadge.label}
              </span>

              {/* Label Badge */}
              {currentLabel && (
                <span className="px-3 py-1 rounded-full text-xs font-normal bg-[#16181F] text-[#CBD5E1] border border-[#2A2E3D] flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-[#94A3B8]" />
                  {currentLabel.name}
                </span>
              )}

              {/* Manager Badge */}
              {currentManager && (
                <span className="px-3 py-1 rounded-full text-xs font-normal bg-[#16181F] text-[#CBD5E1] border border-[#2A2E3D] flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#94A3B8]" />
                  Mgr: {currentManager.name}
                </span>
              )}
            </div>

            {/* Subtitle: Real Name, City, Country, Age & Main Genre */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#94A3B8] font-normal flex-wrap">
              {player?.realName ? (
                <>
                  <span className="text-[#F8FAFC] font-medium">"{cleanQuotes(player.realName)}"</span>
                  <span className="text-[#94A3B8]/60">•</span>
                </>
              ) : null}
              <span>
                {formatCityCountry(player?.city, player?.country)}
              </span>
              <span className="text-[#94A3B8]/60">•</span>
              <span className="font-mono text-[#F8FAFC]">
                {TimeSystem.calculateAge(player?.birthYear || 2008, world?.currentYear || 2026)} años
              </span>
              <span className="text-[#94A3B8]/60">•</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/40">
                {mainGenreName}
              </span>
            </div>

            {/* Compact Discography & Legacy Badges */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#94A3B8] flex-wrap pt-0.5">
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-1.5 text-[#F8FAFC] bg-[#16181F] hover:bg-[#1C1F2B] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 px-3 py-1 rounded-[8px] text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Editar Identidad</span>
              </button>

              <span
                className="inline-flex items-center gap-1.5 bg-[#16181F] px-2.5 py-1 rounded-[8px] border border-[#2A2E3D] text-[#F8FAFC] font-medium text-xs shadow-xs"
                title={`Comunidad de fans activos: ${(playerStats.fansCount || 0).toLocaleString('es-AR')} fans`}
              >
                <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>{formatFans(playerStats.fansCount)}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#16181F] px-2.5 py-1 rounded-[8px] border border-[#2A2E3D] text-[#F8FAFC] font-medium text-xs">
                <Disc3 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>{computedSongsCount} Singles</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#16181F] px-2.5 py-1 rounded-[8px] border border-[#2A2E3D] text-[#F8FAFC] font-medium text-xs">
                <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>{computedAlbumsCount} Álbumes</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#16181F] px-2.5 py-1 rounded-[8px] border border-[#2A2E3D] text-[#F8FAFC] font-medium text-xs">
                <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>
                  Legado: <strong className="font-semibold text-[#FBBF24]">{player?.legacyScore ?? 0}/100</strong>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Metric Tiles */}
        <div className="grid grid-cols-2 gap-2.5 w-full lg:w-auto shrink-0 min-w-[280px] xl:min-w-[340px]">
          {/* Tile 1: Oyentes Mensuales */}
          <div
            className={`bg-[#16181F] border rounded-[12px] p-3 text-left shadow-xs transition-all duration-300 ${
              isListenersSurging
                ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_18px_rgba(16,185,129,0.35)] scale-[1.02]'
                : 'border-emerald-500/30 hover:border-emerald-500/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Headphones className="w-3 h-3 text-emerald-400" />
                Oyentes Mensuales
              </span>
              {isListenersSurging && (
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse">
                  ▲ En Auge
                </span>
              )}
            </div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono block mt-0.5 tracking-tight transition-transform">
              {formatCompactNumber(playerStats.monthlyListeners)}
              <span className="text-xs font-normal text-emerald-500/80 font-sans ml-1">/mes</span>
            </span>
            <span className={`text-[10px] font-medium block ${listenerGrowth.isPositive ? 'text-emerald-500/80' : 'text-[#94A3B8]'}`}>
              {listenerGrowth.label}
            </span>
          </div>

          {/* Tile 2: Streams Totales */}
          <div
            className={`bg-[#16181F] border rounded-[12px] p-3 text-left shadow-xs transition-all duration-300 ${
              isStreamsSurging
                ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 shadow-[0_0_18px_rgba(139,92,246,0.35)] scale-[1.02]'
                : 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C084FC] flex items-center gap-1">
                <Disc3 className="w-3 h-3 text-[#8B5CF6]" />
                Streams Globales
              </span>
              {isStreamsSurging && (
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/40 animate-pulse">
                  ▲ Viral
                </span>
              )}
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#C084FC] font-mono block mt-0.5 tracking-tight transition-transform">
              {formatCompactNumber(playerStats.totalStreams)}
              <span className="text-xs font-normal text-[#C084FC]/80 font-sans ml-1">tot.</span>
            </span>
            <span className="text-[10px] text-[#C084FC]/80 font-medium block">
              Catálogo activo
            </span>
          </div>

          {/* Tile 3: Hype Escénico */}
          <div className="bg-[#16181F] border border-orange-500/30 rounded-[12px] p-3 text-left shadow-xs hover:border-orange-500/60 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              Hype Escénico
            </span>
            <span className="text-xl sm:text-2xl font-bold text-orange-400 font-mono block mt-0.5 tracking-tight">
              {playerStats.hype} / 100
            </span>
            <span className="text-[10px] text-orange-500/80 font-medium block">
              {playerStats.hype >= 70 ? 'En Tendencia 🔥' : 'Fase Creativa'}
            </span>
          </div>

          {/* Tile 4: Popularidad & Fidelidad */}
          <div className="bg-[#16181F] border border-amber-500/30 rounded-[12px] p-3 text-left shadow-xs hover:border-amber-500/60 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              Popularidad
            </span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono block mt-0.5 tracking-tight">
              {playerStats.popularity} / 100
            </span>
            <span className="text-[10px] text-amber-500/80 font-medium block">
              Fidelidad: {playerStats.fanbaseLoyalty} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Block: Current Era Highlight Box */}
      {currentEra && (
        <div className="pt-4 border-t border-[#2A2E3D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 bg-[#0B0C10] p-4 rounded-[12px] border border-[#2A2E3D]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] text-[#F8FAFC] shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Era Actual:
                </span>
                <span className="text-xs font-bold text-[#F8FAFC]">
                  {currentEra.name}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                {currentEra.highlightSummary}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('career')}
            className="text-xs text-[#F8FAFC] hover:text-[#C084FC] flex items-center gap-1.5 font-semibold cursor-pointer whitespace-nowrap px-3.5 py-1.5 rounded-[8px] bg-[#16181F] hover:bg-[#1C1F2B] border border-[#2A2E3D] hover:border-[#8B5CF6]/40 transition-colors shadow-xs"
          >
            <span>Ver Trayectoria</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Fallback Interactive Avatar Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] max-w-lg w-full p-6 space-y-5 text-[#F8FAFC] shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="text-lg font-bold tracking-[-0.4px] text-[#F8FAFC]">
                  Identidad Visual & Avatar del Artista
                </h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 rounded-[6px] hover:bg-[#1C1F2B] text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer transition-colors"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Preview */}
            <div className="flex items-center gap-4 bg-[#0B0C10] p-4 rounded-[12px] border border-[#2A2E3D]">
              <ArtistAvatar
                name={player?.name}
                avatarColor={selectedColor}
                avatarIcon={avatarType === 'symbol' ? selectedIcon : undefined}
                size="lg"
                rounded="rounded-[12px]"
                className="shrink-0 shadow-md"
              />
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#F8FAFC]">{player.name}</h4>
                <p className="text-xs text-[#94A3B8]">
                  Vista previa de tu avatar visual en el panel y cartas del juego.
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-[#0B0C10] rounded-[8px] border border-[#2A2E3D]">
              <button
                type="button"
                onClick={() => setAvatarType('symbol')}
                className={`flex-1 py-1.5 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  avatarType === 'symbol'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Símbolo / Ícono</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarType('initials')}
                className={`flex-1 py-1.5 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  avatarType === 'initials'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Iniciales Limpias</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block">
                Presets de Estilo Rápido
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VECTOR_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 rounded-[8px] border border-[#2A2E3D] bg-[#0B0C10] hover:border-[#7C3AED]/50 hover:bg-[#1C1F2B] transition-all flex items-center gap-2 cursor-pointer text-left"
                  >
                    <ArtistAvatar
                      name={preset.name}
                      avatarColor={preset.color}
                      avatarIcon={preset.icon}
                      size="xs"
                      rounded="rounded-[4px]"
                    />
                    <span className="text-[10px] font-bold text-[#F8FAFC] truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vector Icons Selector */}
            {avatarType === 'symbol' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block">
                  Seleccionar Símbolo Escénico
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {AVATAR_SYMBOLS.map((sym: AvatarSymbolOption) => {
                    const isSelected = selectedIcon === sym.id;
                    const IconComp = sym.icon;
                    return (
                      <button
                        type="button"
                        key={sym.id}
                        onClick={() => setSelectedIcon(sym.id)}
                        className={`p-2 rounded-[10px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#7C3AED]/25 border-[#7C3AED] shadow-xs ring-1 ring-[#7C3AED]'
                            : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#7C3AED]/40'
                        }`}
                      >
                        <div className={`p-1.5 rounded-full bg-gradient-to-tr ${selectedColor} text-white shadow-xs`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-semibold text-[#F8FAFC] truncate w-full">
                          {sym.label.split('/')[0].trim()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Gradient Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block">
                Paleta Cromática
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AVATAR_PALETTES.map((p: AvatarPaletteOption) => {
                  const isSelected = selectedColor === p.val;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setSelectedColor(p.val)}
                      className={`p-2 rounded-[8px] border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#7C3AED]/20 border-[#7C3AED] shadow-xs ring-1 ring-[#7C3AED]'
                          : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#7C3AED]/40'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-[4px] bg-gradient-to-tr ${p.val} shrink-0 border border-white/30 flex items-center justify-center`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-[10px] font-semibold text-[#F8FAFC] truncate">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2A2E3D]">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 rounded-[8px] text-xs font-semibold bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:bg-[#1C1F2B] cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-5 py-2 rounded-[8px] text-xs font-bold hover:opacity-90 cursor-pointer shadow-[0_0_15px_rgba(124,58,237,0.4)] active:scale-[0.98] transition-all"
              >
                <Check className="w-4 h-4 text-white" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
