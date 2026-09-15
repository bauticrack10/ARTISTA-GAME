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
        return { bg: 'bg-surface', text: 'text-fg-muted', border: 'border-line', label: 'Underground' };
      case 'Emerging':
        return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Emergente' };
      case 'Breakout':
        return { bg: 'bg-cyan-500/15', text: 'text-info', border: 'border-info/30', label: 'En Ascenso' };
      case 'Established':
        return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Consagrado' };
      case 'Mainstream':
        return { bg: 'bg-purple-500/15', text: 'text-primary-soft', border: 'border-primary/30', label: 'Mainstream' };
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
        return { bg: 'bg-surface', text: 'text-fg-muted', border: 'border-line', label: stage };
    }
  };

  const stageBadge = getCareerStageBadge(player.careerStage);

  return (
    <div
      className={`bg-surface border border-line rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg space-y-6 text-fg ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Top Main Section: Portrait, Bio & Quick Metrics */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Avatar / Portrait + Info Hierarchy */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 w-full lg:w-auto">
          {/* Professional Vector Avatar Container */}
          <div className="relative shrink-0 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-card overflow-hidden border-2 border-line group-hover:border-primary/60 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-canvas flex items-center justify-center">
              <ArtistAvatar
                name={player?.name}
                avatarColor={player?.avatarColor}
                avatarIcon={player?.avatarIcon}
                size="custom"
                className="w-full h-full"
                rounded="rounded-xl"
              />
            </div>

            {/* Quick Edit Overlay Button */}
            <button
              onClick={handleOpenModal}
              className="absolute bottom-1 right-1 p-2 rounded-full bg-canvas/90 hover:bg-primary text-fg border border-line shadow-md transition-all cursor-pointer group-hover:scale-110"
              title="Personalizar Avatar Vectorial"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Artist Identity & Metadata Details */}
          <div className="space-y-2.5">
            {/* Header: Artist Stage Name + Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-1px] text-fg leading-tight">
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
                <span className="px-3 py-1 rounded-full text-xs font-normal bg-surface text-[#CBD5E1] border border-line flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-fg-muted" />
                  {currentLabel.name}
                </span>
              )}

              {/* Manager Badge */}
              {currentManager && (
                <span className="px-3 py-1 rounded-full text-xs font-normal bg-surface text-[#CBD5E1] border border-line flex items-center gap-1.5">
                  <User className="w-3 h-3 text-fg-muted" />
                  Mgr: {currentManager.name}
                </span>
              )}
            </div>

            {/* Subtitle: Real Name, City, Country, Age & Main Genre */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-fg-muted font-normal flex-wrap">
              {player?.realName ? (
                <>
                  <span className="text-fg font-medium">"{cleanQuotes(player.realName)}"</span>
                  <span className="text-fg-muted/60">•</span>
                </>
              ) : null}
              <span>
                {formatCityCountry(player?.city, player?.country)}
              </span>
              <span className="text-fg-muted/60">•</span>
              <span className="font-mono text-fg">
                {TimeSystem.calculateAge(player?.birthYear || 2008, world?.currentYear || 2026)} años
              </span>
              <span className="text-fg-muted/60">•</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary-soft border border-primary/40">
                {mainGenreName}
              </span>
            </div>

            {/* Compact Discography & Legacy Badges */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-fg-muted flex-wrap pt-0.5">
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-1.5 text-fg bg-surface hover:bg-surface-raised border border-line hover:border-primary/50 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-primary" />
                <span>Editar Identidad</span>
              </button>

              <span
                className="inline-flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-lg border border-line text-fg font-medium text-xs shadow-xs"
                title={`Comunidad de fans activos: ${(playerStats.fansCount || 0).toLocaleString('es-AR')} fans`}
              >
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>{formatFans(playerStats.fansCount)}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-lg border border-line text-fg font-medium text-xs">
                <Disc3 className="w-3.5 h-3.5 text-primary" />
                <span>{computedSongsCount} Singles</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-lg border border-line text-fg font-medium text-xs">
                <Layers className="w-3.5 h-3.5 text-info" />
                <span>{computedAlbumsCount} Álbumes</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-lg border border-line text-fg font-medium text-xs">
                <Award className="w-3.5 h-3.5 text-warning" />
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
            className={`bg-surface border rounded-xl p-3 text-left shadow-xs transition-all duration-300 ${
              isListenersSurging
                ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_18px_rgba(16,185,129,0.35)] scale-[1.02]'
                : 'border-emerald-500/30 hover:border-emerald-500/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Headphones className="w-3 h-3 text-emerald-400" />
                Oyentes Mensuales
              </span>
              {isListenersSurging && (
                <span className="text-2xs font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse">
                  ▲ En Auge
                </span>
              )}
            </div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono block mt-0.5 tracking-tight transition-transform">
              {formatCompactNumber(playerStats.monthlyListeners)}
              <span className="text-xs font-normal text-emerald-500/80 font-sans ml-1">/mes</span>
            </span>
            <span className={`text-2xs font-medium block ${listenerGrowth.isPositive ? 'text-emerald-500/80' : 'text-fg-muted'}`}>
              {listenerGrowth.label}
            </span>
          </div>

          {/* Tile 2: Streams Totales */}
          <div
            className={`bg-surface border rounded-xl p-3 text-left shadow-xs transition-all duration-300 ${
              isStreamsSurging
                ? 'border-primary bg-primary/20 shadow-[0_0_18px_rgba(139,92,246,0.35)] scale-[1.02]'
                : 'border-primary/30 hover:border-primary/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-primary-soft flex items-center gap-1">
                <Disc3 className="w-3 h-3 text-primary" />
                Streams Globales
              </span>
              {isStreamsSurging && (
                <span className="text-2xs font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-soft border border-primary/40 animate-pulse">
                  ▲ Viral
                </span>
              )}
            </div>
            <span className="text-xl sm:text-2xl font-bold text-primary-soft font-mono block mt-0.5 tracking-tight transition-transform">
              {formatCompactNumber(playerStats.totalStreams)}
              <span className="text-xs font-normal text-primary-soft/80 font-sans ml-1">tot.</span>
            </span>
            <span className="text-2xs text-primary-soft/80 font-medium block">
              Catálogo activo
            </span>
          </div>

          {/* Tile 3: Hype Escénico */}
          <div className="bg-surface border border-orange-500/30 rounded-xl p-3 text-left shadow-xs hover:border-orange-500/60 transition-colors">
            <span className="text-2xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              Hype Escénico
            </span>
            <span className="text-xl sm:text-2xl font-bold text-orange-400 font-mono block mt-0.5 tracking-tight">
              {playerStats.hype} / 100
            </span>
            <span className="text-2xs text-orange-500/80 font-medium block">
              {playerStats.hype >= 70 ? 'En Tendencia' : 'Fase Creativa'}
            </span>
          </div>

          {/* Tile 4: Popularidad & Fidelidad */}
          <div className="bg-surface border border-amber-500/30 rounded-xl p-3 text-left shadow-xs hover:border-amber-500/60 transition-colors">
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              Popularidad
            </span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono block mt-0.5 tracking-tight">
              {playerStats.popularity} / 100
            </span>
            <span className="text-2xs text-amber-500/80 font-medium block">
              Fidelidad: {playerStats.fanbaseLoyalty} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Block: Current Era Highlight Box */}
      {currentEra && (
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 bg-canvas p-4 rounded-xl border border-line">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-surface border border-line text-fg shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Era Actual:
                </span>
                <span className="text-xs font-bold text-fg">
                  {currentEra.name}
                </span>
              </div>
              <p className="text-xs text-fg-muted mt-0.5 leading-relaxed">
                {currentEra.highlightSummary}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('career')}
            className="text-xs text-fg hover:text-primary-soft flex items-center gap-1.5 font-semibold cursor-pointer whitespace-nowrap px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surface-raised border border-line hover:border-primary/40 transition-colors shadow-xs"
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
            className="bg-surface border border-line rounded-2xl max-w-lg w-full p-6 space-y-5 text-fg shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary-strong" />
                <h3 className="text-lg font-bold tracking-[-0.4px] text-fg">
                  Identidad Visual & Avatar del Artista
                </h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-surface-raised text-fg-muted hover:text-fg cursor-pointer transition-colors"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Preview */}
            <div className="flex items-center gap-4 bg-canvas p-4 rounded-xl border border-line">
              <ArtistAvatar
                name={player?.name}
                avatarColor={selectedColor}
                avatarIcon={avatarType === 'symbol' ? selectedIcon : undefined}
                size="lg"
                rounded="rounded-xl"
                className="shrink-0 shadow-md"
              />
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-fg">{player.name}</h4>
                <p className="text-xs text-fg-muted">
                  Vista previa de tu avatar visual en el panel y cartas del juego.
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-canvas rounded-lg border border-line">
              <button
                type="button"
                onClick={() => setAvatarType('symbol')}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  avatarType === 'symbol'
                    ? 'bg-primary-strong text-white shadow-xs'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Símbolo / Ícono</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarType('initials')}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  avatarType === 'initials'
                    ? 'bg-primary-strong text-white shadow-xs'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Iniciales Limpias</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted block">
                Presets de Estilo Rápido
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VECTOR_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 rounded-lg border border-line bg-canvas hover:border-primary-strong/50 hover:bg-surface-raised transition-all flex items-center gap-2 cursor-pointer text-left"
                  >
                    <ArtistAvatar
                      name={preset.name}
                      avatarColor={preset.color}
                      avatarIcon={preset.icon}
                      size="xs"
                      rounded="rounded-sm"
                    />
                    <span className="text-2xs font-bold text-fg truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vector Icons Selector */}
            {avatarType === 'symbol' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted block">
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
                        className={`p-2 rounded-control border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-primary-strong/25 border-primary-strong shadow-xs ring-1 ring-primary-strong'
                            : 'bg-canvas border-line hover:border-primary-strong/40'
                        }`}
                      >
                        <div className={`p-1.5 rounded-full bg-gradient-to-tr ${selectedColor} text-white shadow-xs`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-2xs font-semibold text-fg truncate w-full">
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
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted block">
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
                      className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary-strong/20 border-primary-strong shadow-xs ring-1 ring-primary-strong'
                          : 'bg-canvas border-line hover:border-primary-strong/40'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-sm bg-gradient-to-tr ${p.val} shrink-0 border border-white/30 flex items-center justify-center`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-2xs font-semibold text-fg truncate">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-canvas text-fg-muted border border-line hover:text-fg hover:bg-surface-raised cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-5 py-2 rounded-lg text-xs font-bold hover:opacity-90 cursor-pointer shadow-[0_0_15px_rgba(124,58,237,0.4)] active:scale-[0.98] transition-all"
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
