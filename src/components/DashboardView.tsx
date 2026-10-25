import React, { useState } from 'react';
import { Artist, WorldState, Song, Album } from '../types';
import { Palette, Crown, User, Check, X } from 'lucide-react';
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
  onUpdateAvatar
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
    <div className="space-y-5 pb-8 text-fg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* COLUMNA PRINCIPAL (8 cols): Perfil, Acciones del Mes, Estadísticas y Catálogo */}
        <div className="lg:col-span-8 space-y-5">
          <ArtistHeroCard
            player={player}
            world={world}
            playerSongsCount={playerSongs.length}
            playerAlbumsCount={playerAlbums.length}
            onNavigate={onNavigate}
            onUpdateAvatar={onUpdateAvatar}
            onOpenAvatarModal={handleOpenAvatarModal}
          />

          <DecisionHub
            player={player}
            world={world}
            isTourReady={isTourReady}
            onNavigate={onNavigate}
            onRest={onRest}
            onExecuteDecision={onExecuteDecision}
          />

          <ArtistAttributesPanel player={player} />

          <ActiveCatalogCard
            topSongs={topSongs}
            playerSongsCount={playerSongs.length}
            world={world}
            onNavigate={onNavigate}
            onRecordFirstSingle={() => onNavigate('studio')}
          />
        </div>

        {/* COLUMNA LATERAL (4 cols): Noticias & Pulso en Redes */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <NewsSidebar
            world={world}
            player={player}
            onNavigate={onNavigate}
            className="h-full flex-1"
          />
        </div>
      </div>

      {/* MODAL DE AVATAR */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] max-w-md w-full p-5 space-y-4 text-[#F4F4F6] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#FF4F00]" />
                <h3 className="text-base font-bold text-[#F4F4F6]">
                  Personalizar Avatar
                </h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-[#F4F4F6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 bg-[#09090B] p-3.5 rounded-[4px] border border-[#242429]">
              <ArtistAvatar
                name={player?.name}
                avatarColor={selectedColor}
                avatarIcon={avatarType === 'symbol' ? selectedIcon : undefined}
                size="md"
                rounded="rounded-[4px]"
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-[#F4F4F6] truncate">{player?.name || 'Artista'}</h4>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setAvatarType('symbol')}
                    className={`px-2.5 py-1 rounded-[3px] text-2xs font-bold flex items-center gap-1 cursor-pointer ${
                      avatarType === 'symbol' ? 'bg-[#FF4F00] text-white' : 'bg-[#18181C] text-[#8E8E99]'
                    }`}
                  >
                    <Crown className="w-3 h-3" />
                    <span>Ícono</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarType('initials')}
                    className={`px-2.5 py-1 rounded-[3px] text-2xs font-bold flex items-center gap-1 cursor-pointer ${
                      avatarType === 'initials' ? 'bg-[#FF4F00] text-white' : 'bg-[#18181C] text-[#8E8E99]'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>Iniciales</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-2xs font-bold uppercase tracking-wider text-[#52525B] block">
                Estilos Rápidos
              </label>
              <div className="grid grid-cols-4 gap-2">
                {VECTOR_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 rounded-[4px] border border-[#242429] bg-[#18181C] hover:border-[#3F3F46] flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <ArtistAvatar
                      name={preset.name}
                      avatarColor={preset.color}
                      avatarIcon={preset.icon}
                      size="xs"
                      rounded="rounded-[4px]"
                    />
                    <span className="text-[10px] font-semibold text-[#F4F4F6] truncate w-full text-center">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {avatarType === 'symbol' && (
              <div className="space-y-1.5">
                <label className="text-2xs font-bold uppercase tracking-wider text-[#52525B] block">
                  Símbolo
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {AVATAR_SYMBOLS.map((sym: AvatarSymbolOption) => {
                    const isSelected = selectedIcon === sym.id;
                    const IconComp = sym.icon;
                    return (
                      <button
                        type="button"
                        key={sym.id}
                        onClick={() => setSelectedIcon(sym.id)}
                        className={`p-2 rounded-[4px] border flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF4F00]/20 border-[#FF4F00] text-white'
                            : 'bg-[#18181C] border-[#242429] text-[#8E8E99]'
                        }`}
                        title={sym.label}
                      >
                        <IconComp className="w-3.5 h-3.5 text-[#FF4F00]" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-2xs font-bold uppercase tracking-wider text-[#52525B] block">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_PALETTES.map((p: AvatarPaletteOption) => {
                  const isSelected = selectedColor === p.val;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setSelectedColor(p.val)}
                      className={`p-1.5 rounded-[4px] border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#18181C] border-[#FF4F00]'
                          : 'bg-[#18181C] border-[#242429]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-[3px] bg-gradient-to-tr ${p.val} shrink-0 flex items-center justify-center`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="text-[10px] font-semibold text-[#F4F4F6] truncate">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-3.5 py-1.5 rounded-[4px] text-xs font-semibold bg-[#18181C] text-[#8E8E99] border border-[#242429] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                className="flex items-center gap-1.5 bg-[#FF4F00] hover:bg-[#E04500] text-white px-4 py-1.5 rounded-[4px] text-xs font-bold cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
