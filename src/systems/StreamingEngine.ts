import { Song, Artist, MusicTrend, Genre } from '../types';

export class StreamingEngine {
  /**
   * Calculates realistic monthly streams for a single song based on:
   * 1. Core fanbase engagement and loyalty
   * 2. Scaled algorithmic discovery reach based on artist popularity
   * 3. Song musical quality, commercial appeal, originality and release hype
   * 4. Trend alignment and genre health
   * 5. Lifecycles and longevity curves (avoiding 0-to-millions absurd jumps)
   */
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

    const qualityFactor = Math.max(0.1, song.quality / 100);
    const commercialFactor = Math.max(0.1, song.commercialAppeal / 100);
    const originalityFactor = Math.max(0.1, song.originality / 100);
    const hypeFactor = Math.max(0.1, (artist.stats.hype + 10) / 110);
    const popFactor = Math.max(0.01, artist.stats.popularity / 100);
    const loyaltyFactor = Math.max(0.2, artist.stats.fanbaseLoyalty / 100);

    // 1. Trend multiplier if matching genre
    let trendBoost = 1.0;
    for (const trend of activeTrends) {
      if (trend.stage !== 'exhausted' && (trend.genreId === song.genreId || song.subGenreIds?.includes(trend.genreId))) {
        trendBoost *= trend.impactMultiplier;
      }
    }

    // 2. Genre health multiplier
    const genreBoost = genre ? Math.max(0.5, genre.currentPopularity / 70) : 1.0;

    // 3. Core Fan Streams: Active fans replay new songs frequently
    // Engaged fan count:
    const activeFans = Math.max(10, Math.floor(artist.stats.fansCount * loyaltyFactor));
    let fanPlaysPerMonth = 0;
    if (ageMonths === 0) {
      fanPlaysPerMonth = 5.5; // ~5-6 plays in release month per fan
    } else if (ageMonths === 1) {
      fanPlaysPerMonth = 3.2;
    } else if (ageMonths <= 3) {
      fanPlaysPerMonth = 1.8;
    } else if (ageMonths <= 12) {
      fanPlaysPerMonth = 0.8;
    } else {
      fanPlaysPerMonth = song.isClassic ? 0.4 : 0.15;
    }
    const fanStreamBase = activeFans * fanPlaysPerMonth;

    // 4. Algorithmic / Discovery / Playlist reach based on realistic scale
    // Smooth non-linear curve: underground artists get hundreds/thousands, superstars get millions
    const maxAlgorithmicPool = Math.pow(popFactor, 2.5) * 45000000 + (artist.stats.popularity * 250);
    const songAppealScore = (qualityFactor * 0.35 + commercialFactor * 0.45 + originalityFactor * 0.20) * (0.6 + hypeFactor * 0.6);
    const algorithmicStreams = maxAlgorithmicPool * songAppealScore * trendBoost * genreBoost;

    // Base total potential per month
    const baseTotalStreams = fanStreamBase + algorithmicStreams;

    // 5. Longevity curves & decay over time
    let ageMultiplier = 1.0;
    let wentViralNow = false;
    let becomesClassicNow = false;

    if (song.longevityCurve === 'explosive_drop') {
      if (ageMonths === 0) ageMultiplier = 2.4;
      else if (ageMonths === 1) ageMultiplier = 0.9;
      else if (ageMonths <= 4) ageMultiplier = 0.35 * Math.pow(0.75, ageMonths - 2);
      else ageMultiplier = Math.max(0.02, Math.pow(0.60, ageMonths));
    } else if (song.longevityCurve === 'slow_burn') {
      if (ageMonths === 0) ageMultiplier = 0.35;
      else if (ageMonths <= 5) ageMultiplier = 0.35 + (ageMonths * 0.22); // peaks around month 4-5
      else if (ageMonths <= 12) ageMultiplier = 1.45 - ((ageMonths - 5) * 0.08);
      else ageMultiplier = Math.max(0.12, Math.pow(0.92, ageMonths - 12));
    } else if (song.longevityCurve === 'sleeper_viral') {
      if (song.wentViral) {
        // Post-viral decaying retention
        ageMultiplier = 2.2 * Math.max(0.18, Math.pow(0.88, (ageMonths % 12)));
      } else if (ageMonths >= 4 && ageMonths <= 96 && Math.random() < 0.012) {
        wentViralNow = true;
        ageMultiplier = 5.0;
      } else {
        ageMultiplier = Math.max(0.04, Math.pow(0.78, ageMonths));
      }
    } else if (song.longevityCurve === 'instant_classic') {
      if (ageMonths === 0) ageMultiplier = 1.9;
      else if (ageMonths <= 3) ageMultiplier = 1.3;
      else ageMultiplier = Math.max(0.35, Math.pow(0.97, ageMonths));

      if (ageMonths >= 24 && !song.isClassic) {
        becomesClassicNow = true;
      }
    } else {
      // Steady
      if (ageMonths === 0) ageMultiplier = 1.6;
      else if (ageMonths <= 2) ageMultiplier = 1.1;
      else if (ageMonths <= 6) ageMultiplier = 0.75;
      else ageMultiplier = Math.max(0.05, Math.pow(0.88, ageMonths));
    }

    const calculatedStreams = Math.floor(baseTotalStreams * ageMultiplier);
    // Minimum stream floor scaled realistically
    const minFloor = artist.stats.popularity > 20 ? 50 : Math.max(5, Math.floor(activeFans * 0.05));

    return {
      streams: Math.max(minFloor, calculatedStreams),
      wentViralNow,
      becomesClassicNow
    };
  }

  /**
   * Calculates realistic unique monthly listeners (28-day active audience).
   * In music streaming, monthly listeners represent unique accounts that streamed
   * at least one song in the last 28 days (typically 2.5 to 5.0 streams per unique listener).
   */
  static calculateMonthlyListeners(
    totalMonthlySongStreams: number,
    artistPopularity: number,
    fansCount: number,
    fanbaseLoyalty: number = 70
  ): number {
    if (totalMonthlySongStreams <= 0) {
      const coreResidual = Math.floor(fansCount * (fanbaseLoyalty / 100) * 0.15);
      return Math.max(10, coreResidual);
    }

    // Average streams per listener in a 30-day period (~2.8 to 4.2)
    const streamsPerListener = 3.2;
    const streamDerivedListeners = Math.floor(totalMonthlySongStreams / streamsPerListener);

    // Active core fans who regularly listen
    const coreActiveFans = Math.floor(fansCount * (fanbaseLoyalty / 100) * 0.60);

    // Organic baseline listeners from general catalog discovery and playlists
    const discoveryBaseline = Math.floor(Math.pow(artistPopularity / 100, 2.2) * 800000);

    // Combine while ensuring unique listeners cannot exceed total streams
    const combinedListeners = Math.floor(streamDerivedListeners * 0.75 + coreActiveFans * 0.25 + discoveryBaseline * 0.1);
    const realisticListeners = Math.min(totalMonthlySongStreams, combinedListeners);

    return Math.max(15, realisticListeners);
  }

  /**
   * Calculates comprehensive commercial impact, first week equivalent album sales,
   * Metacritic-style critical score, and press review verdict.
   */
  static calculateAlbumImpact(params: {
    albumType: 'single' | 'ep' | 'mixtape' | 'album' | 'deluxe' | 'collab_album';
    songs: Song[];
    artist: Artist;
    producerBoost: number;
    productionBudget: number;
    marketingBudget: number;
    includedSinglesTotalStreams: number;
  }): {
    firstWeekSales: number;
    criticalScore: number;
    criticalReviewText: string;
    commercialScore: number;
  } {
    const { albumType, songs, artist, producerBoost, productionBudget, marketingBudget, includedSinglesTotalStreams } = params;

    // 1. Quality & Critical Score computation
    const avgSongQuality = songs.length > 0
      ? songs.reduce((sum, s) => sum + s.quality, 0) / songs.length
      : artist.personality.skill;

    const baseCritical =
      avgSongQuality * 0.45 +
      artist.personality.originality * 0.25 +
      artist.stats.artisticCredibility * 0.20 +
      artist.personality.creativity * 0.10 +
      producerBoost * 0.5;

    // Budget per track modifier
    const budgetPerTrack = songs.length > 0 ? productionBudget / songs.length : 1000;
    let budgetMod = 0;
    if (budgetPerTrack >= 3000) budgetMod = 3;
    else if (budgetPerTrack >= 1500) budgetMod = 1;
    else if (budgetPerTrack < 400) budgetMod = -3;

    const criticalScore = Math.floor(Math.max(15, Math.min(99, baseCritical + budgetMod)));

    // Metacritic-style review text
    let criticalReviewText = '';
    if (criticalScore >= 88) {
      criticalReviewText = `${criticalScore}/100 • Aclamación Universal (Pitchfork / Rolling Stone): "Una obra maestra conceptual y visceral. Define una era y consolida a ${artist.name} en el olimpo musical contemporáneo."`;
    } else if (criticalScore >= 76) {
      criticalReviewText = `${criticalScore}/100 • Críticas Muy Favorables: "Producción impecable y visión estética clara. Destaca por su cohesión sonora y maestría lírica."`;
    } else if (criticalScore >= 62) {
      criticalReviewText = `${criticalScore}/100 • Recepción Positiva / Mixta: "Un proyecto entretenido con destellos brillantes y grandes estribillos, aunque recurre a fórmulas seguras."`;
    } else if (criticalScore >= 48) {
      criticalReviewText = `${criticalScore}/100 • Críticas Divididas: "Interesante en ambición pero irregular en ejecución. La producción en ocasiones opaca la identidad del artista."`;
    } else {
      criticalReviewText = `${criticalScore}/100 • Recepción Desfavorable: "Un tropiezo conceptual. Falta de foco melódico y excesiva complacencia comercial sin profundidad."`;
    }

    // 2. First Week Sales calculation
    // Scale factor by release format
    const formatMultiplier =
      albumType === 'album' ? 1.0 :
      albumType === 'deluxe' ? 1.25 :
      albumType === 'mixtape' ? 0.85 :
      albumType === 'collab_album' ? 1.15 : 0.60; // ep

    // Core fan sales
    const loyaltyRatio = Math.max(0.1, artist.stats.fanbaseLoyalty / 100);
    const coreFanSales = Math.floor(artist.stats.fansCount * loyaltyRatio * 0.18);

    // Mainstream popularity scaling
    const popRatio = Math.max(0.01, artist.stats.popularity / 100);
    const algorithmicPopularitySales = Math.pow(popRatio, 2.3) * 220000 + (artist.stats.popularity * 80);

    // Marketing impact
    const marketingMultiplier = 1.0 + Math.min(1.8, marketingBudget / 20000);

    // Hype impact
    const hypeFactor = 0.6 + (artist.stats.hype / 100) * 0.8;

    // Previous singles momentum carry-over
    const singlesMomentumSales = Math.floor(Math.min(45000, includedSinglesTotalStreams * 0.0015));

    const calculatedFirstWeekSales = Math.floor(
      (coreFanSales + algorithmicPopularitySales + singlesMomentumSales) *
      formatMultiplier *
      marketingMultiplier *
      hypeFactor
    );

    // Baseline minimum sales
    const minSales = Math.max(50, Math.floor(artist.stats.popularity * 15 + artist.stats.fansCount * 0.05));
    const firstWeekSales = Math.max(minSales, calculatedFirstWeekSales);

    // 3. Commercial score (0 - 100)
    const commercialScore = Math.floor(
      Math.min(100, (artist.personality.commercialAppeal * 0.4 + artist.stats.popularity * 0.4 + (marketingBudget / 30000) * 20))
    );

    return {
      firstWeekSales,
      criticalScore,
      criticalReviewText,
      commercialScore
    };
  }
}
