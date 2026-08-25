import React, { useState, useRef } from 'react';
import { Artist, WorldState, Song, Album } from '../types';
import { Camera, Image as ImageIcon, Check, X } from 'lucide-react';
import { ArtistHeroCard } from './dashboard/ArtistHeroCard';
import { NewsSidebar } from './dashboard/NewsSidebar';
import { ArtistAttributesPanel } from './dashboard/ArtistAttributesPanel';
import { DecisionHub } from './dashboard/DecisionHub';
import { ActiveCatalogCard } from './dashboard/ActiveCatalogCard';

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
  const [selectedColor, setSelectedColor] = useState(player.avatarColor || 'from-amber-500 to-rose-600');
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

  return (
    <div
      className="space-y-6 pb-8 text-[#1c1c1c]"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-[#f7f4ed] border border-[#eceae4] rounded-[16px] max-w-md w-full p-6 space-y-5 text-[#1c1c1c] shadow-2xl transition-all"
            style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
          >
            <div className="flex items-center justify-between border-b border-[#eceae4] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#1c1c1c]" />
                <h3 className="text-lg font-semibold tracking-[-0.4px]">Retrato / Foto del Artista</h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-[6px] hover:bg-[#eceae4] text-[#50504e] hover:text-[#1c1c1c] cursor-pointer transition-colors"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Preview */}
            <div className="flex items-center gap-4 bg-[#fcfbf8] p-4 rounded-[12px] border border-[#eceae4]">
              {customAvatarUrl ? (
                <img
                  src={customAvatarUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-[12px] object-cover border-2 border-[#eceae4] shadow-xs"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-[12px] bg-gradient-to-tr ${selectedColor} flex items-center justify-center text-[#fcfbf8] text-2xl font-bold border-2 border-[#eceae4] shadow-xs`}
                >
                  {player.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-[#1c1c1c]">{player.name}</h4>
                <p className="text-xs text-[#50504e]">Vista previa de la foto de perfil en el juego</p>
              </div>
            </div>

            {/* File Upload Button */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-[#50504e] block tracking-wide">
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
                className="w-full flex items-center justify-center gap-2 bg-[#fcfbf8] border border-[#eceae4] hover:bg-[#eceae4] text-[#1c1c1c] text-xs font-semibold py-2.5 px-4 rounded-[6px] cursor-pointer transition-all shadow-xs"
              >
                <ImageIcon className="w-4 h-4 text-[#1c1c1c]" />
                <span>Seleccionar Archivo de Foto</span>
              </button>
            </div>

            {/* Direct URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#50504e] block tracking-wide">
                O pegar enlace URL de imagen
              </label>
              <input
                type="text"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="https://ejemplo.com/mifoto.jpg"
                className="w-full bg-[#fcfbf8] border border-[#eceae4] rounded-[6px] px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#1c1c1c] text-[#1c1c1c]"
              />
            </div>

            {/* Avatar Presets Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-[#50504e] block tracking-wide">
                O elegir un Avatar Estilizado
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setCustomAvatarUrl(preset.url)}
                    className={`p-1.5 rounded-[8px] border transition-all text-center group cursor-pointer ${
                      customAvatarUrl === preset.url
                        ? 'border-[#1c1c1c] bg-[#eceae4] shadow-xs'
                        : 'border-[#eceae4] bg-[#fcfbf8] hover:border-[rgba(28,28,28,0.4)]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-12 rounded-[6px] object-cover group-hover:opacity-90"
                    />
                    <span className="text-[9px] font-semibold text-[#1c1c1c] block mt-1 truncate">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eceae4]">
              {customAvatarUrl && (
                <button
                  onClick={() => setCustomAvatarUrl('')}
                  className="px-3 py-2 text-xs text-rose-800 hover:underline cursor-pointer font-medium"
                >
                  Quitar Foto
                </button>
              )}
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 rounded-[6px] text-xs font-semibold bg-[#fcfbf8] text-[#1c1c1c] border border-[#eceae4] hover:bg-[#eceae4] cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAvatar}
                className="flex items-center gap-1.5 bg-[#1c1c1c] text-[#fcfbf8] px-5 py-2 rounded-[6px] text-xs font-semibold hover:opacity-90 cursor-pointer shadow-sm active:scale-98 transition-all"
                style={{
                  boxShadow:
                    'rgba(255, 255, 255, 0.2) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
                }}
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
