import React, { useState } from 'react';
import { Artist, WorldState, Song, Album } from '../types';
import { Palette, Crown, User, Check, X, Sparkles } from 'lucide-react';
import {
  AVATAR_PALETTES,
  AVATAR_SYMBOLS,
  VECTOR_PRESETS,
  AvatarPaletteOption,
  AvatarSymbolOption,
  VectorAvatarPreset
} from '../data/avatarPresets';
import { ArtistAvatar } from './ArtistAvatar';
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
  onUpdateAvatar?: (avatarUrl?: string, avatarColor?: string, avatarIcon?: string) => void;
  onUpdateProfile?: (updates: Partial<Artist>) => void;
  onOpenMilestone?: (data?: any) => void;
}

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
  const [selectedColor, setSelectedColor] = useState<string>(
    player?.avatarColor || 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]'
  );
  const [selectedIcon, setSelectedIcon] = useState<string>(player?.avatarIcon || 'mic');
  const [avatarType, setAvatarType] = useState<'symbol' | 'initials'>(
    player?.avatarIcon ? 'symbol' : 'symbol'
  );

  const playerId = player?.id || 'player';
  const playerSongs = (Object.values(world?.songs || {}) as Song[]).filter(s => s.artistId === playerId);
  const playerAlbums = (Object.values(world?.albums || {}) as Album[]).filter(a => a.artistId === playerId);

  const topSongs = [...playerSongs]
    .sort((a, b) => (b.streamsLastMonth || 0) - (a.streamsLastMonth || 0))
    .slice(0, 4);

  const hasCatalog = playerSongs.length >= 2 || playerAlbums.length >= 1;
  const hasAudience = (player?.stats?.monthlyListeners || 0) >= 1000;
  const hasEnergy = (player?.stats?.energy || 0) >= 85;
  const isTourReady = hasCatalog && hasAudience && hasEnergy;

  const handleOpenAvatarModal = () => {
    setSelectedColor(player?.avatarColor || 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]');
    setSelectedIcon(player?.avatarIcon || 'mic');
    setAvatarType(player?.avatarIcon ? 'symbol' : 'initials');
    setIsAvatarModalOpen(true);
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

  return (
    <div
      className="space-y-6 pb-8 text-[#F8FAFC]"
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
            onUpdateAvatar={onUpdateAvatar}
            onOpenAvatarModal={handleOpenAvatarModal}
          />

          {/* 2. Artist Attributes & Personality Panel */}
          <ArtistAttributesPanel
            player={player}
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
      {/* AVATAR & VECTOR IDENTITY MODAL */}
      {/* ========================================================================= */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="bg-[#16181F] border border-[#2A2E3D] rounded-[16px] max-w-lg w-full p-6 space-y-5 text-[#F8FAFC] shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
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
                className="p-1 rounded-[6px] hover:bg-[#1C1F2B] text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer transition-colors"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Live Preview */}
            <div className="flex items-center gap-4 bg-[#0B0C10] p-4 rounded-[12px] border border-[#2A2E3D]">
              <ArtistAvatar
                name={player?.name}
                avatarColor={selectedColor}
                avatarIcon={avatarType === 'symbol' ? selectedIcon : undefined}
                size="lg"
                rounded="rounded-[12px]"
                className="shrink-0 shadow-md"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#F8FAFC] truncate">{player?.name || 'Artista'}</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {avatarType === 'symbol' ? 'Avatar Vectorial con Símbolo Escénico' : 'Avatar con Iniciales Tipográficas'}
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

            {/* Vector Icons Selector (Symbol Mode) */}
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

            {/* Gradient Palette Selection */}
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
