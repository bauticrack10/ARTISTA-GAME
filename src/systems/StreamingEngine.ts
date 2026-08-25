import { Song, Artist, MusicTrend, Genre } from '../types';

export class StreamingEngine {
  static calculateSongMonthlyStreams(
    song: Song,
    artist: Artist,
    currentYear: number,
    currentMonth: number,
    activeTrends: MusicTrend[],
    genre: Genre | undefined
  ): { streams: number; wentViralNow: boolean; becomesClassicNow: boolean } {
    const ageMonths = (currentYear - song.releaseYear) * 12 + (currentMonth - song.releaseMonth);
    if (ageMonths < 0) return { streams: 0, wentViralNow: false, becomesClassicNow: false };

    // Base potential from song & artist attributes
    const qualityFactor = song.quality / 100;
    const commercialFactor = song.commercialAppeal / 100;
    const artistPopFactor = (artist.stats.popularity + 15) / 115;
    const hypeFactor = (artist.stats.hype + 20) / 120;

    // Trend multiplier if matching
    let trendBoost = 1.0;
    for (const trend of activeTrends) {
      if (trend.stage !== 'exhausted' && (trend.genreId === song.genreId || song.subGenreIds.includes(trend.genreId))) {
        trendBoost *= trend.impactMultiplier;
      }
    }

    // Genre popularity multiplier
    const genreBoost = genre ? (genre.currentPopularity / 75) : 1.0;

    let baseMonthlyStreams = (qualityFactor * 0.35 + commercialFactor * 0.45 + artistPopFactor * 0.2)
      * 15000000
      * hypeFactor
      * trendBoost
      * genreBoost;

    // Apply longevity curves
    let ageMultiplier = 1.0;
    let wentViralNow = false;
    let becomesClassicNow = false;

    if (song.longevityCurve === 'explosive_drop') {
      if (ageMonths === 0) ageMultiplier = 2.5;
      else if (ageMonths === 1) ageMultiplier = 1.2;
      else ageMultiplier = Math.max(0.04, Math.pow(0.65, ageMonths));
    } else if (song.longevityCurve === 'slow_burn') {
      if (ageMonths <= 4) ageMultiplier = 0.4 + (ageMonths * 0.25);
      else if (ageMonths <= 12) ageMultiplier = 1.3 - ((ageMonths - 4) * 0.05);
      else ageMultiplier = Math.max(0.12, Math.pow(0.92, ageMonths - 12));
    } else if (song.longevityCurve === 'sleeper_viral') {
      if (song.wentViral) {
        ageMultiplier = 1.8 * Math.max(0.15, Math.pow(0.85, (ageMonths % 12)));
      } else if (ageMonths > 12 && ageMonths < 120 && Math.random() < 0.015) {
        wentViralNow = true;
        ageMultiplier = 3.5;
      } else {
        ageMultiplier = Math.max(0.05, Math.pow(0.80, ageMonths));
      }
    } else if (song.longevityCurve === 'instant_classic') {
      if (ageMonths === 0) ageMultiplier = 2.0;
      else ageMultiplier = Math.max(0.35, Math.pow(0.96, ageMonths));
      if (ageMonths > 24 && !song.isClassic) {
        becomesClassicNow = true;
      }
    } else {
      // Steady
      if (ageMonths === 0) ageMultiplier = 1.8;
      else if (ageMonths <= 3) ageMultiplier = 1.1;
      else ageMultiplier = Math.max(0.08, Math.pow(0.88, ageMonths));
    }

    const calculatedStreams = Math.floor(baseMonthlyStreams * ageMultiplier);
    return {
      streams: Math.max(120, calculatedStreams),
      wentViralNow,
      becomesClassicNow
    };
  }

  static calculateMonthlyListeners(totalMonthlySongStreams: number, artistPopularity: number, fansCount: number): number {
    // Unique listeners roughly scale with stream volume + baseline fanbase
    const streamDerivedListeners = Math.floor(totalMonthlySongStreams * 0.42);
    const coreListeners = Math.floor(fansCount * 0.65);
    const popularityFloor = Math.floor((artistPopularity / 100) * 500000);

    return Math.max(500, streamDerivedListeners + coreListeners + popularityFloor);
  }
}
