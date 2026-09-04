import { Artist, CareerStage, MusicRegion } from '../types';
import { LATIN_AMERICA_ARTISTS } from './artists/latinAmerica';
import { NORTH_AMERICA_ARTISTS } from './artists/northAmerica';
import { EUROPE_ARTISTS } from './artists/europe';
import { ASIA_OCEANIA_ARTISTS } from './artists/asiaOceania';
import { AFRICA_MIDDLE_EAST_ARTISTS } from './artists/africaMiddleEast';
import { BRAZIL_ARTISTS } from './artists/brazil';

/**
 * Global aggregation of all modular artist catalogs in "El Artista".
 * Combines 100+ meticulously modeled real-world artists from all major continents and music scenes.
 */
export const INITIAL_ARTISTS: Record<string, Artist> = {
  ...LATIN_AMERICA_ARTISTS,
  ...NORTH_AMERICA_ARTISTS,
  ...EUROPE_ARTISTS,
  ...ASIA_OCEANIA_ARTISTS,
  ...AFRICA_MIDDLE_EAST_ARTISTS,
  ...BRAZIL_ARTISTS
};

/**
 * Filter artists by country name or ISO country code.
 */
export function getArtistsByCountry(country: string): Artist[] {
  if (!country) return [];
  const query = country.trim().toLowerCase();
  return Object.values(INITIAL_ARTISTS).filter((artist) => {
    const artistCountry = artist.country?.toLowerCase() || '';
    const artistCode = artist.countryCode?.toLowerCase() || '';
    return artistCountry.includes(query) || artistCode === query;
  });
}

/**
 * Mapping helper for countries to regions when influenceRegions is not explicitly set.
 */
const COUNTRY_TO_REGION_MAP: Record<string, MusicRegion[]> = {
  AR: ['Argentina', 'LatinAmerica'],
  UY: ['LatinAmerica'],
  CL: ['LatinAmerica'],
  CO: ['LatinAmerica'],
  MX: ['Mexico', 'LatinAmerica'],
  PR: ['USA', 'LatinAmerica'],
  DO: ['LatinAmerica'],
  US: ['USA'],
  CA: ['USA'],
  ES: ['Spain', 'Europe'],
  GB: ['UK', 'Europe'],
  FR: ['Europe'],
  DE: ['Europe'],
  IT: ['Europe'],
  NL: ['Europe'],
  BE: ['Europe'],
  SE: ['Europe'],
  NO: ['Europe'],
  IE: ['Europe'],
  PL: ['Europe'],
  RU: ['Europe'],
  KR: ['Asia'],
  JP: ['Asia'],
  AU: ['Asia'],
  NZ: ['Asia'],
  IN: ['Asia'],
  PH: ['Asia'],
  ID: ['Asia'],
  CN: ['Asia'],
  NG: ['Africa'],
  GH: ['Africa'],
  ZA: ['Africa'],
  MA: ['Africa'],
  EG: ['Africa'],
  TR: ['Europe', 'Asia'],
  BR: ['Brazil', 'LatinAmerica']
};

/**
 * Filter artists active or influential in a specific MusicRegion.
 */
export function getArtistsByRegion(region: MusicRegion): Artist[] {
  if (region === 'Global') {
    return Object.values(INITIAL_ARTISTS).filter((artist) => {
      if (artist.influenceRegions?.includes('Global')) return true;
      return (artist.popularityGlobal ?? 0) >= 80 || artist.careerStage === 'Superstar' || artist.careerStage === 'Legend';
    });
  }

  return Object.values(INITIAL_ARTISTS).filter((artist) => {
    if (artist.influenceRegions?.includes(region)) return true;
    if (artist.countryCode && COUNTRY_TO_REGION_MAP[artist.countryCode]?.includes(region)) return true;
    if (artist.primaryMarkets?.some((m) => m.toLowerCase().includes(region.toLowerCase()))) return true;
    return false;
  });
}

/**
 * Filter artists by primary genre or secondary subgenres.
 */
export function getArtistsByGenre(genreId: string): Artist[] {
  if (!genreId) return [];
  return Object.values(INITIAL_ARTISTS).filter((artist) => {
    if (artist.mainGenreId === genreId) return true;
    if (artist.subGenreIds && artist.subGenreIds.includes(genreId)) return true;
    return false;
  });
}

/**
 * Filter artists by their current career stage.
 */
export function getArtistsByStage(stage: CareerStage): Artist[] {
  return Object.values(INITIAL_ARTISTS).filter((artist) => artist.careerStage === stage);
}

/**
 * Get all unique countries represented across the artist catalog.
 */
export function getAllCountries(): string[] {
  const countries = new Set<string>();
  Object.values(INITIAL_ARTISTS).forEach((artist) => {
    if (artist.country) {
      // Split combined countries if any (e.g., "Argentina / Bélgica")
      artist.country.split('/').forEach((c) => {
        const trimmed = c.trim();
        if (trimmed) countries.add(trimmed);
      });
    }
  });
  return Array.from(countries).sort((a, b) => a.localeCompare(b));
}

/**
 * Get all supported music regions.
 */
export function getAllRegions(): MusicRegion[] {
  return [
    'Global',
    'Argentina',
    'USA',
    'LatinAmerica',
    'Europe',
    'Spain',
    'Mexico',
    'UK',
    'Brazil',
    'Asia',
    'Africa'
  ];
}
