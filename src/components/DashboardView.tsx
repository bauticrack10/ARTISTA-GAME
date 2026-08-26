import React, { useState, useRef } from 'react';
import { Artist, WorldState, Song, Album } from '../types';
import { Camera, Image as ImageIcon, Check, X } from 'lucide-react';
import { ArtistHeroCard } from './dashboard/ArtistHeroCard';
import { NewsSidebar } from './dashboard/NewsSidebar';
import { ArtistAttributesPanel } from './dashboard/ArtistAttributesPanel';
import { DecisionHub } from './dashboard/DecisionHub';
import { ActiveCatalogCard } from './dashboard/ActiveCatalogCard';
import { formatListeners } from '../utils/formatters';

// Re-export modular components for flexible consumption
export { ArtistHeroCard } from './dashboard/ArtistHeroCard';
export { NewsSidebar } from './dashboard/NewsSidebar';
export { ArtistAttributesPanel } from './dashboard/ArtistAttributesPanel';
export { DecisionHub } from './dashboard/DecisionHub';
export { ActiveCatalogCard } from './dashboard/ActiveCatalogCard';

export interface DashboardViewProps {
  player: Artist;
  world: WorldState;
  onNavigate: (tab: string) => void;
  onRest: () => void;
  onUpdateAvatar?: (avatarUrl?: string, avatarColor?: string) => void;
  onUpdateProfile?: (updates: Partial<Artist>) => void;
  onOpenMilestone?: (data?: any) => void;
}

const AVATAR_PRESETS = [
  { id: 'preset_1', label: 'Trapper Neon', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { id: 'preset_2', label: 'Urban Producer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: 'preset_3', label: 'Pop Star', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
  { id: 'preset_4', label: 'Indie Artist', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
  { id: 'preset_5', label: 'R&B Neo-Soul', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80' },
  { id: 'preset_6', label: 'Rock Icon', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  player,
  world,
  onNavigate,
  onRest,
  onUpdateAvatar,
  onUpdateProfile,
  onOpenMilestone
}) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(player.avatarUrl || '');
  const [selectedColor, setSelectedColor] = useState(player.avatarColor || 'from-[#7C3AED] via-[#8B5CF6] to-[#C026D3]');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const playerSongs = (Object.values(world.songs) as Song[]).filter(s => s.artistId === player.id);
  const playerAlbums = (Object.values(world.albums) as Album[]).filter(a => a.artistId === player.id);

  const topSongs = [...playerSongs]
    .sort((a, b) => b.streamsLastMonth - a.streamsLastMonth)
    .slice(0, 4);

  const isTourReady = player.stats.energy >= 85;

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

  const trendingGenre = world.genres && world.genres[player.mainGenreId]
    ? world.genres[player.mainGenreId].name
    : 'Trap & Urbano';

  return (
    <div
      className="space-y-6 pb-8 text-[#F8FAFC]"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* ========================================================================= */}
      {/* TOP LIVE CAREER PULSE & SCENE RADAR RIBBON (4 Colorful KPI Cards) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Card 1: Estatus de Carrera */}
        <button
          onClick={() => onNavigate('career')}
          className="bg-[#16181F] hover:bg-[#1C1F28] border border-[#F59E0B]/30 hover:border-[#F59E0B]/60 rounded-[12px] p-3 text-left transition-all hover:scale-[1.01] cursor-pointer shadow-md group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#F59E0B] block">
              Fase Actual
            </span>
            <span className="text-sm font-bold text-[#F8FAFC] block truncate mt-0.5">
              {player.careerStage}
            </span>
            <span className="text-[10px] text-[#94A3B8] truncate block">
              {player.eras && player.eras.length > 0 ? player.eras[player.eras.length - 1].name : 'Era Inicial'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F59E0B]/15 text-[#FBBF24] flex items-center justify-center shrink-0 border border-[#F59E0B]/30 group-hover:scale-110 transition-transform">
            🌟
          </div>
        </button>

        {/* Card 2: Radar de Streaming */}
        <button
          onClick={() => onNavigate('charts')}
          className="bg-[#16181F] hover:bg-[#1C1F28] border border-emerald-500/30 hover:border-emerald-500/60 rounded-[12px] p-3 text-left transition-all hover:scale-[1.01] cursor-pointer shadow-md group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 block">
              Oyentes Mensuales
            </span>
            <span className="text-sm font-bold text-emerald-400 block font-mono mt-0.5">
              {formatListeners(player.stats.monthlyListeners)}
            </span>
            <span className="text-[10px] text-emerald-500/80 truncate block">
              {playerSongs.length} temas lanzados
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-110 transition-transform">
            🎧
          </div>
        </button>

        {/* Card 3: Tendencia Sonora */}
        <button
          onClick={() => onNavigate('studio')}
          className="bg-[#16181F] hover:bg-[#1C1F28] border border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60 rounded-[12px] p-3 text-left transition-all hover:scale-[1.01] cursor-pointer shadow-md group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#C084FC] block">
              Tendencia Sonora
            </span>
            <span className="text-sm font-bold text-[#F8FAFC] block truncate mt-0.5">
              {trendingGenre}
            </span>
            <span className="text-[10px] text-[#C084FC]/80 truncate block">
              Hype: {player.stats.hype}% en alza
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 text-[#C084FC] flex items-center justify-center shrink-0 border border-[#8B5CF6]/30 group-hover:scale-110 transition-transform">
            🔥
          </div>
        </button>

        {/* Card 4: Galas & Premios */}
        <button
          onClick={() => onNavigate('awards')}
          className="bg-[#16181F] hover:bg-[#1C1F28] border border-[#06B6D4]/30 hover:border-[#06B6D4]/60 rounded-[12px] p-3 text-left transition-all hover:scale-[1.01] cursor-pointer shadow-md group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#06B6D4] block">
              Gala Anual
            </span>
            <span className="text-sm font-bold text-[#F8FAFC] block truncate mt-0.5">
              {player.awardsWon.length > 0 ? `${player.awardsWon.length} Galardones` : 'Próxima Temporada'}
            </span>
            <span className="text-[10px] text-[#06B6D4]/80 truncate block">
              Reputación: {player.stats.reputation}/100
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#06B6D4]/15 text-[#06B6D4] flex items-center justify-center shrink-0 border border-[#06B6D4]/30 group-hover:scale-110 transition-transform">
            🏆
          </div>
        </button>
      </div>

      {/* 2-Column Responsive Layout: Main Area (8 cols) vs News Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* MAIN COLUMN (8 cols): Hero Profile, Stats & Traits, Unified Actions, Top Songs */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Artist Hero Card */}
          <ArtistHeroCard
            player={player}
            world={world}
            playerSongsCount={playerSongs.length}
            playerAlbumsCount={playerAlbums.length}
            onNavigate={onNavigate}
            onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
          />

          {/* 2. Artist Attributes & Personality Panel */}
          <ArtistAttributesPanel
            player={player}
            isTourReady={isTourReady}
          />

          {/* 3. Unified Decision Hub */}
          <DecisionHub
            player={player}
            world={world}
            isTourReady={isTourReady}
            onNavigate={onNavigate}
            onRest={onRest}
          />

          {/* 4. Active Catalog Card */}
          <ActiveCatalogCard
            topSongs={topSongs}
            playerSongsCount={playerSongs.length}
            world={world}
            onNavigate={onNavigate}
            onRecordFirstSingle={() => onNavigate('studio')}
          />
        </div>

        {/* ========================================================================= */}
        {/* SIDEBAR COLUMN (4 cols): Real-Time Live News Feed & Scene Pulse */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* 5. Real-Time News Sidebar */}
          <NewsSidebar
            world={world}
            player={player}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AVATAR & PROFILE PICTURE MODAL */}
      {/* ========================================================================= */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div
            className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] max-w-md w-full p-6 space-y-5 text-[#F8FAFC] shadow-2xl transition-all"
            style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
          >
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="text-lg font-bold tracking-[-0.4px] text-[#F8FAFC]">Retrato / Foto del Artista</h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-[6px] hover:bg-[#1C1F28] text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer transition-colors"
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
                  className="w-16 h-16 rounded-[12px] object-cover border-2 border-[#2A2E3D] shadow-xs"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-[12px] bg-gradient-to-tr ${selectedColor} flex items-center justify-center text-white text-2xl font-bold border-2 border-[#2A2E3D] shadow-xs`}
                >
                  {player.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-[#F8FAFC]">{player.name}</h4>
                <p className="text-xs text-[#94A3B8]">Vista previa de la foto de perfil en el juego</p>
              </div>
            </div>

            {/* File Upload Button */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-[#94A3B8] block tracking-wide">
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
                className="w-full flex items-center justify-center gap-2 bg-[#0B0C10] border border-[#2A2E3D] hover:bg-[#1C1F28] text-[#F8FAFC] text-xs font-semibold py-2.5 px-4 rounded-[8px] cursor-pointer transition-all shadow-xs"
              >
                <ImageIcon className="w-4 h-4 text-[#8B5CF6]" />
                <span>Seleccionar Archivo de Foto</span>
              </button>
            </div>

            {/* Direct URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#94A3B8] block tracking-wide">
                O pegar enlace URL de imagen
              </label>
              <input
                type="text"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="https://ejemplo.com/mifoto.jpg"
                className="w-full bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>

            {/* Avatar Presets Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-[#94A3B8] block tracking-wide">
                O elegir un Avatar Estilizado
              </label>
              <div className="grid grid-cols-3 gap-2">
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
                      alt={preset.label}
                      className="w-full h-12 rounded-[6px] object-cover group-hover:opacity-90"
                    />
                    <span className="text-[9px] font-semibold text-[#F8FAFC] block mt-1 truncate">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2E3D]">
              {customAvatarUrl && (
                <button
                  onClick={() => setCustomAvatarUrl('')}
                  className="px-3 py-2 text-xs text-rose-400 hover:underline cursor-pointer font-medium"
                >
                  Quitar Foto
                </button>
              )}
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 rounded-[8px] text-xs font-semibold bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:bg-[#1C1F28] cursor-pointer transition-colors"
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
