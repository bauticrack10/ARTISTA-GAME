import React, { useState, useRef } from 'react';
import { Artist, WorldState, Song, Album, CareerStage } from '../types';
import { AVATAR_PRESETS } from '../data/avatarPresets';
import {
  Camera,
  Sparkles,
  ArrowUpRight,
  Disc3,
  Edit3,
  Image as ImageIcon,
  Check,
  X,
  Crown,
  Building2,
  Award,
  Layers,
  Flame,
  TrendingUp,
  User,
  Headphones
} from 'lucide-react';
import {
  formatMoney,
  formatFans,
  formatListeners,
  formatStreams,
  cleanQuotes
} from '../utils/formatters';

export interface ArtistHeroCardProps {
  player: Artist;
  world: WorldState;
  playerSongsCount?: number;
  playerAlbumsCount?: number;
  onNavigate: (tab: string) => void;
  onUpdateAvatar?: (avatarUrl?: string, avatarColor?: string) => void;
  onOpenAvatarModal?: () => void;
  className?: string;
}

const COLOR_OPTIONS = [
  { id: 'synth_purple', label: 'Violeta Synth', class: 'from-[#8B5CF6] via-[#9333EA] to-[#6366F1]' },
  { id: 'cyber_magenta', label: 'Neón Magenta', class: 'from-[#8B5CF6] via-[#C026D3] to-[#EC4899]' },
  { id: 'electric_cyan', label: 'Cian Eléctrico', class: 'from-[#06B6D4] via-[#0284C7] to-[#4F46E5]' },
  { id: 'emerald_studio', label: 'Esmeralda Studio', class: 'from-[#10B981] via-[#0D9488] to-[#06B6D4]' },
  { id: 'gold_master', label: 'Oro Master', class: 'from-[#F59E0B] via-[#D97706] to-[#B45309]' },
  { id: 'sunset_urban', label: 'Atardecer Urbano', class: 'from-[#F97316] via-[#E11D48] to-[#9333EA]' },
  { id: 'dark_obsidian', label: 'Obsidiana & Carbón', class: 'from-neutral-800 to-zinc-950' }
];

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
  const [customAvatarUrl, setCustomAvatarUrl] = useState(player.avatarUrl || '');
  const [selectedColor, setSelectedColor] = useState(player.avatarColor || 'from-[#8B5CF6] via-[#C026D3] to-[#EC4899]');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentEra = player.eras && player.eras.length > 0
    ? player.eras[player.eras.length - 1]
    : null;

  const computedSongsCount = playerSongsCount !== undefined
    ? playerSongsCount
    : (Object.values(world.songs || {}) as Song[]).filter((s) => s.artistId === player.id).length;

  const computedAlbumsCount = playerAlbumsCount !== undefined
    ? playerAlbumsCount
    : (Object.values(world.albums || {}) as Album[]).filter((a) => a.artistId === player.id).length;

  const mainGenreName =
    world.genres && world.genres[player.mainGenreId]?.name
      ? world.genres[player.mainGenreId].name
      : player.mainGenreId || 'Música Urbana';

  const currentLabel = player.labelId && world.labels ? world.labels[player.labelId] : null;
  const currentManager = player.managerId && world.managers ? world.managers[player.managerId] : null;

  const handleOpenModal = () => {
    if (onOpenAvatarModal) {
      onOpenAvatarModal();
    } else {
      setCustomAvatarUrl(player.avatarUrl || '');
      setSelectedColor(player.avatarColor || 'from-[#8B5CF6] via-[#C026D3] to-[#EC4899]');
      setIsAvatarModalOpen(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setCustomAvatarUrl(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (onUpdateAvatar) {
      onUpdateAvatar(customAvatarUrl || undefined, selectedColor);
    }
    setIsAvatarModalOpen(false);
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
          {/* Professional Portrait Container */}
          <div className="relative shrink-0 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-[14px] overflow-hidden border-2 border-[#2A2E3D] group-hover:border-[#8B5CF6]/60 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-[#0B0C10]">
              {player.avatarUrl ? (
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-tr ${
                    player.avatarColor || 'from-[#8B5CF6] via-[#C026D3] to-[#EC4899]'
                  } text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center`}
                >
                  {player.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Quick Edit Overlay Button */}
            <button
              onClick={handleOpenModal}
              className="absolute bottom-1 right-1 p-2 rounded-full bg-[#0B0C10]/90 hover:bg-[#8B5CF6] text-[#F8FAFC] border border-[#2A2E3D] shadow-md transition-all cursor-pointer group-hover:scale-110"
              title="Cambiar Retrato / Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Artist Identity & Metadata Details */}
          <div className="space-y-2.5">
            {/* Header: Artist Stage Name + Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-1px] text-[#F8FAFC] leading-tight">
                {player.name}
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

            {/* High-Contrast Subtitle: Real Name, City, Country & Main Genre */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#94A3B8] font-normal flex-wrap">
              {player.realName ? (
                <>
                  <span className="text-[#F8FAFC] font-medium">"{cleanQuotes(player.realName)}"</span>
                  <span className="text-[#94A3B8]/60">•</span>
                </>
              ) : null}
              <span>
                {player.city}, {player.country}
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
                className="flex items-center gap-1.5 text-[#F8FAFC] bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 px-3 py-1 rounded-[8px] text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Editar Retrato</span>
              </button>

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
                  Legado: <strong className="font-semibold text-[#FBBF24]">{player.legacyScore}/100</strong>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: 4 Colorful Quick Metric Tiles */}
        <div className="grid grid-cols-2 gap-2.5 w-full lg:w-auto shrink-0 min-w-[280px] xl:min-w-[340px]">
          {/* Tile 1: Oyentes Mensuales */}
          <div className="bg-[#16181F] border border-emerald-500/30 rounded-[12px] p-3 text-left shadow-xs hover:border-emerald-500/60 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Headphones className="w-3 h-3 text-emerald-400" />
              Oyentes Mensuales
            </span>
            <span className="text-lg sm:text-xl font-bold text-emerald-400 font-mono block mt-0.5">
              {formatListeners(player.stats.monthlyListeners)}
            </span>
            <span className="text-[10px] text-emerald-500/80 font-medium block">
              +12.4% este semestre
            </span>
          </div>

          {/* Tile 2: Streams Totales */}
          <div className="bg-[#16181F] border border-[#8B5CF6]/30 rounded-[12px] p-3 text-left shadow-xs hover:border-[#8B5CF6]/60 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C084FC] flex items-center gap-1">
              <Disc3 className="w-3 h-3 text-[#8B5CF6]" />
              Streams Globales
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#C084FC] font-mono block mt-0.5">
              {formatStreams(player.stats.totalStreams)}
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
            <span className="text-lg sm:text-xl font-bold text-orange-400 font-mono block mt-0.5">
              {player.stats.hype}/100
            </span>
            <span className="text-[10px] text-orange-500/80 font-medium block">
              {player.stats.hype >= 70 ? 'En Tendencia 🔥' : 'Fase Creativa'}
            </span>
          </div>

          {/* Tile 4: Fama / Popularidad */}
          <div className="bg-[#16181F] border border-amber-500/30 rounded-[12px] p-3 text-left shadow-xs hover:border-amber-500/60 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              Popularidad
            </span>
            <span className="text-lg sm:text-xl font-bold text-amber-400 font-mono block mt-0.5">
              {player.stats.popularity}/100
            </span>
            <span className="text-[10px] text-amber-500/80 font-medium block">
              Fidelidad: {player.stats.fanbaseLoyalty}%
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

      {/* Interactive Avatar & Profile Picture Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div
            className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] max-w-lg w-full p-6 space-y-5 text-[#F8FAFC] shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="text-lg font-bold tracking-[-0.4px] text-[#F8FAFC]">
                  Retrato / Foto del Artista
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
              {customAvatarUrl ? (
                <img
                  src={customAvatarUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-[12px] object-cover border-2 border-[#2A2E3D] shadow-sm shrink-0"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-[12px] bg-gradient-to-tr ${selectedColor} flex items-center justify-center text-white text-2xl font-bold border-2 border-[#2A2E3D] shadow-sm shrink-0`}
                >
                  {player.name ? player.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#F8FAFC]">{player.name}</h4>
                <p className="text-xs text-[#94A3B8]">
                  Vista previa de tu avatar visual en el panel y cartas del juego.
                </p>
              </div>
            </div>

            {/* File Upload Button */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block">
                Subir Imagen desde tu Computadora
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-[#0B0C10] border border-[#2A2E3D] hover:bg-[#1C1F2B] text-[#F8FAFC] text-xs font-semibold py-2.5 px-4 rounded-[8px] cursor-pointer transition-all shadow-xs"
              >
                <ImageIcon className="w-4 h-4 text-[#8B5CF6]" />
                <span>Seleccionar Archivo de Foto (JPG, PNG, WebP)</span>
              </button>
            </div>

            {/* Direct URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block">
                O pegar enlace URL de imagen
              </label>
              <input
                type="text"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="https://ejemplo.com/mifoto.jpg"
                className="w-full bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>

            {/* Avatar Presets Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block">
                O elegir un Avatar Estilizado del Catálogo
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setCustomAvatarUrl(preset.url)}
                    className={`p-1.5 rounded-[8px] border transition-all text-center group cursor-pointer ${
                      customAvatarUrl === preset.url
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 shadow-xs'
                        : 'border-[#2A2E3D] bg-[#0B0C10] hover:border-[#8B5CF6]/50'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-14 rounded-[6px] object-cover group-hover:opacity-90"
                    />
                    <span className="text-[9px] font-semibold text-[#F8FAFC] block mt-1 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block">
                Gradiente de Fondo (si no usas foto)
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedColor(c.class);
                      setCustomAvatarUrl('');
                    }}
                    title={c.label}
                    className={`w-7 h-7 rounded-full bg-gradient-to-tr ${c.class} border-2 transition-transform cursor-pointer ${
                      !customAvatarUrl && selectedColor === c.class
                        ? 'scale-110 border-[#8B5CF6] shadow-sm ring-1 ring-white'
                        : 'border-[#2A2E3D] hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2A2E3D]">
              {customAvatarUrl && (
                <button
                  onClick={() => setCustomAvatarUrl('')}
                  className="px-3 py-2 text-xs text-rose-400 hover:underline cursor-pointer mr-auto font-medium"
                >
                  Quitar Foto
                </button>
              )}
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 rounded-[8px] text-xs font-semibold bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:bg-[#1C1F2B] cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAvatar}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white px-5 py-2 rounded-[8px] text-xs font-bold hover:opacity-90 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.4)] active:scale-98 transition-all"
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
