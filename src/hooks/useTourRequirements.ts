import { useMemo } from 'react';
import { Artist, WorldState, Song, Album } from '../types';
import { MIN_TOUR_ENERGY, MIN_TOUR_LISTENERS, MIN_TOUR_SONGS } from '../systems/TourEngine';

export interface TourGateRequirement {
  id: 'catalog' | 'listeners' | 'energy';
  label: string;
  currentValue: string;
  requiredValue: string;
  met: boolean;
  helpText: string;
}

export interface TourRequirementsResult {
  canTour: boolean;
  hasCatalog: boolean;
  hasAudience: boolean;
  hasEnergy: boolean;
  songsCount: number;
  albumsCount: number;
  requirements: TourGateRequirement[];
  tooltipText: string;
  missingReasons: string[];
}

/**
 * Hook to evaluate the 3 strict Tour Gating rules:
 * 1. Catálogo: >= 2 singles o >= 1 EP/Álbum
 * 2. Oyentes: >= 1.000 oyentes mensuales
 * 3. Energía: >= 85% de vitalidad
 */
export function useTourRequirements(player: Artist, world?: WorldState): TourRequirementsResult {
  return useMemo(() => {
    const playerSongs = world?.songs
      ? (Object.values(world.songs) as Song[]).filter((s) => s.artistId === player.id)
      : [];
    const playerAlbums = world?.albums
      ? (Object.values(world.albums) as Album[]).filter((a) => a.artistId === player.id)
      : [];

    const songsCount = playerSongs.length;
    const albumsCount = playerAlbums.length;

    const hasCatalog = songsCount >= MIN_TOUR_SONGS || albumsCount >= 1;
    const hasAudience = (player.stats?.monthlyListeners || 0) >= MIN_TOUR_LISTENERS;
    const hasEnergy = (player.stats?.energy || 0) >= MIN_TOUR_ENERGY;

    const canTour = hasCatalog && hasAudience && hasEnergy;

    const requirements: TourGateRequirement[] = [
      {
        id: 'catalog',
        label: 'Catálogo Musical',
        currentValue: `${songsCount} singles, ${albumsCount} EPs`,
        requiredValue: '≥2 singles o 1 EP/Álbum',
        met: hasCatalog,
        helpText: 'Necesitas canciones grabadas para armar el repertorio del show.'
      },
      {
        id: 'listeners',
        label: 'Oyentes Mensuales',
        currentValue: (player.stats?.monthlyListeners || 0).toLocaleString(),
        requiredValue: `≥${MIN_TOUR_LISTENERS.toLocaleString()} oyentes`,
        met: hasAudience,
        helpText: 'Base mínima de oyentes en streaming para convocar espectadores.'
      },
      {
        id: 'energy',
        label: 'Energía Vital',
        currentValue: `${player.stats?.energy || 0}%`,
        requiredValue: `≥${MIN_TOUR_ENERGY}% vitalidad`,
        met: hasEnergy,
        helpText: 'Resistencia física y mental requerida para la exigencia de las giras.'
      }
    ];

    const missingReasons: string[] = [];
    if (!hasCatalog) {
      missingReasons.push(`Catálogo insuficiente (${songsCount}/${MIN_TOUR_SONGS} singles o 1 EP)`);
    }
    if (!hasAudience) {
      missingReasons.push(
        `Oyentes insuficientes (${(player.stats?.monthlyListeners || 0).toLocaleString()}/${MIN_TOUR_LISTENERS.toLocaleString()} oyentes)`
      );
    }
    if (!hasEnergy) {
      missingReasons.push(`Energía baja (${player.stats?.energy || 0}%/${MIN_TOUR_ENERGY}%)`);
    }

    const tooltipText = canTour
      ? '¡Requisitos cumplidos! El artista está listo para armar y salir de gira.'
      : `Compuertas de Gira pendientes:\n• ${missingReasons.join('\n• ')}`;

    return {
      canTour,
      hasCatalog,
      hasAudience,
      hasEnergy,
      songsCount,
      albumsCount,
      requirements,
      tooltipText,
      missingReasons
    };
  }, [player.id, player.stats?.monthlyListeners, player.stats?.energy, world?.songs, world?.albums]);
}
