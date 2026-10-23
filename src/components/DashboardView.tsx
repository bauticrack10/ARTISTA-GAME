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
import { DecisionActionType, DecisionExecutionResult } from '../systems/DecisionEngine';
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
  onExecuteDecision?: (action: DecisionActionType) => DecisionExecutionResult | void;
  onUpdateAvatar?: (avatarUrl?: string, avatarColor?: string, avatarIcon?: string) => void;
  onUpdateProfile?: (updates: Partial<Artist>) => void;
  onOpenMilestone?: (data?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  player,
  world,
  onNavigate,
  onRest,
  onExecuteDecision,
  onUpdateAvatar,
  onUpdateProfile,
  onOpenMilestone
}) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(
    player?.avatarColor || 'from-[#FF4F00] via-[#D97706] to-[#18181C]'
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
    setSelectedColor(player?.avatarColor || 'from-[#FF4F00] via-[#D97706] to-[#18181C]');
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
    <div className="space-y-6 pb-8 text-fg">
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
            onExecuteDecision={onExecuteDecision}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] max-w-lg w-full p-6 space-y-5 text-[#F4F4F6] shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#242429] pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#FF4F00]" />
                <h3 className="text-lg font-bold tracking-tight text-[#F4F4F6]">
                  Identidad Visual & Avatar del Artista
                </h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-[#F4F4F6] cursor-pointer transition-colors"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Live Preview */}
            <div className="flex items-center gap-4 bg-[#09090B] p-4 rounded-[4px] border border-[#242429]">
              <ArtistAvatar
                name={player?.name}
                avatarColor={selectedColor}
                avatarIcon={avatarType === 'symbol' ? selectedIcon : undefined}
                size="lg"
                rounded="rounded-[4px]"
                className="shrink-0 shadow-md"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#F4F4F6] truncate">{player?.name || 'Artista'}</h4>
                <p className="text-xs text-[#8E8E99] mt-0.5">
                  {avatarType === 'symbol' ? 'Avatar Vectorial con Símbolo Escénico' : 'Avatar con Iniciales Tipográficas'}
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-[#09090B] rounded-[4px] border border-[#242429]">
              <button
                type="button"
                onClick={() => setAvatarType('symbol')}
                className={`flex-1 py-1.5 rounded-[4px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  avatarType === 'symbol'
                    ? 'bg-[#FF4F00] text-white font-bold shadow-none'
                    : 'text-[#8E8E99] hover:text-[#F4F4F6]'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Símbolo / Ícono</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarType('initials')}
                className={`flex-1 py-1.5 rounded-[4px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  avatarType === 'initials'
                    ? 'bg-[#FF4F00] text-white font-bold shadow-none'
                    : 'text-[#8E8E99] hover:text-[#F4F4F6]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Iniciales Limpias</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B] block font-sans">
                Presets de Estilo Rápido
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VECTOR_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 rounded-[4px] border border-[#242429] bg-[#18181C] hover:border-[#3F3F46] hover:bg-[#242429] transition-all flex items-center gap-2 cursor-pointer text-left"
                  >
                    <ArtistAvatar
                      name={preset.name}
                      avatarColor={preset.color}
                      avatarIcon={preset.icon}
                      size="xs"
                      rounded="rounded-[4px]"
                    />
                    <span className="text-2xs font-bold text-[#F4F4F6] truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vector Icons Selector (Symbol Mode) */}
            {avatarType === 'symbol' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B] block font-sans">
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
                        className={`p-2 rounded-[4px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#FF4F00]/20 border-[#FF4F00] text-white ring-1 ring-[#FF4F00]'
                            : 'bg-[#18181C] border-[#242429] hover:border-[#3F3F46] text-[#8E8E99]'
                        }`}
                      >
                        <div className={`p-1.5 rounded-[4px] bg-[#09090B] border border-[#242429] text-white`}>
                          <IconComp className="w-3.5 h-3.5 text-[#FF4F00]" />
                        </div>
                        <span className="text-[10px] font-semibold truncate w-full">
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
              <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B] block font-sans">
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
                      className={`p-2 rounded-[4px] border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#18181C] border-[#FF4F00] ring-1 ring-[#FF4F00]'
                          : 'bg-[#18181C] border-[#242429] hover:border-[#3F3F46]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-[4px] bg-gradient-to-tr ${p.val} shrink-0 border border-white/20 flex items-center justify-center`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-2xs font-semibold text-[#F4F4F6] truncate">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#242429]">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 rounded-[4px] text-xs font-semibold bg-[#18181C] text-[#8E8E99] border border-[#2E2E36] hover:text-[#F4F4F6] hover:bg-[#242429] cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                className="flex items-center gap-1.5 bg-[#FF4F00] hover:bg-[#E04500] text-white px-5 py-2 rounded-[4px] text-xs font-bold cursor-pointer active:translate-y-[1px] transition-all"
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
