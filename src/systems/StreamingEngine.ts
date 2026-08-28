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
    genre: Genre | undefined,
    allArtists?: Record<string, Artist>
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

    // 4.1 Impulso de alcance algorítmico y cross-fanbase derivado del artista colaborador
    let collabBoost = 0;
    if (song.featuredArtistIds && song.featuredArtistIds.length > 0) {
      for (const featId of song.featuredArtistIds) {
        const featArtist = allArtists ? allArtists[featId] : undefined;
        const featPop = featArtist ? featArtist.stats.popularity : 30;
        const featPopFactor = Math.max(0.01, featPop / 100);
        const featAlgoPool = Math.pow(featPopFactor, 2.3) * 28000000 + (featPop * 250);
        const featFans = featArtist ? featArtist.stats.fansCount : 5000;
        const featLoyalty = featArtist ? Math.max(0.2, featArtist.stats.fanbaseLoyalty / 100) : 0.6;
        const featFanMultiplier = ageMonths === 0 ? 3.0 : ageMonths === 1 ? 1.8 : ageMonths <= 3 ? 0.8 : 0.2;
        const featFanStreams = (featFans * featLoyalty * 0.15) * featFanMultiplier;

        collabBoost += (featAlgoPool * songAppealScore * trendBoost * genreBoost * 0.60) + featFanStreams;
      }
    }

    // Base total potential per month
    const baseTotalStreams = fanStreamBase + algorithmicStreams + collabBoost;

    // 5. Music Video Boost (Initial streaming velocity & viral chance multiplier)
    let musicVideoVelocityMultiplier = 1.0;
    let viralChanceBonus = 0;
    if (song.musicVideo) {
      if (song.musicVideo.directorTier === 'Director de Élite Mundial') {
        if (ageMonths <= 3) musicVideoVelocityMultiplier = 1.70;
        else if (ageMonths <= 6) musicVideoVelocityMultiplier = 1.30;
        viralChanceBonus = 0.035; // +3.5% viral chance
      } else if (song.musicVideo.directorTier === 'Estudio Indie') {
        if (ageMonths <= 3) musicVideoVelocityMultiplier = 1.35;
        else if (ageMonths <= 5) musicVideoVelocityMultiplier = 1.15;
        viralChanceBonus = 0.015; // +1.5% viral chance
      } else {
        // Director Emergente
        if (ageMonths <= 2) musicVideoVelocityMultiplier = 1.15;
        viralChanceBonus = 0.005; // +0.5% viral chance
      }
    }

    // 6. Longevity curves & decay over time
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
      } else if (ageMonths >= 4 && ageMonths <= 96 && Math.random() < (0.012 + viralChanceBonus)) {
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

    // Early viral check for songs with high-budget video or exceptional reach
    if (!song.wentViral && ageMonths <= 2 && viralChanceBonus > 0 && Math.random() < viralChanceBonus) {
      wentViralNow = true;
      ageMultiplier *= 2.5;
    }

    const calculatedStreams = Math.floor(baseTotalStreams * ageMultiplier * musicVideoVelocityMultiplier);
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
   * at least one song in the last 28 days (typically 2.5 to 4.0 streams per unique listener).
   * Ensures harmonious proportional scaling with totalMonthlySongStreams, artistPopularity,
   * fansCount, fanbaseLoyalty, hype, and catalog presence.
   */
  static calculateMonthlyListeners(
    totalMonthlySongStreams: number,
    artistPopularity: number = 20,
    fansCount: number = 1000,
    fanbaseLoyalty: number = 70,
    hype: number = 50,
    hasActiveCatalog?: boolean
  ): number {
    const hasCatalog = hasActiveCatalog !== undefined 
      ? hasActiveCatalog 
      : totalMonthlySongStreams > 0;

    const safeLoyalty = Math.max(10, Math.min(100, fanbaseLoyalty || 70)) / 100;
    const safeHype = Math.max(0, Math.min(100, hype || 50)) / 100;
    const safePop = Math.max(1, Math.min(100, artistPopularity || 10)) / 100;

    // Caso 1: Con catálogo activo reproduciéndose mensualmente (~2.5 a 4.0 streams/oyente)
    if (hasCatalog && totalMonthlySongStreams > 0) {
      // 1.1 Razón coherente de streams por oyente único en 28 días (~2.7 a 3.6 streams/oyente)
      const streamsPerListener = 2.7 + safeLoyalty * 0.9;
      const streamDerivedListeners = Math.floor(totalMonthlySongStreams / streamsPerListener);

      // 1.2 Retención de base de fans activa (~60% a 80% de fans activos en el mes)
      const fanRetentionRate = 0.60 + safeLoyalty * 0.20;
      const coreActiveFans = Math.floor(fansCount * fanRetentionRate);

      // 1.3 Alcance orgánico derivado de popularidad y hype
      const organicReach = Math.floor(
        (Math.pow(safePop, 2.2) * 600000 + (artistPopularity * 150)) * (1.0 + safeHype * 0.4)
      );

      // 1.4 Ponderación armónica (65% streams derivados, 25% retención fans, 10% descubrimiento orgánico)
      const combined = Math.floor(
        streamDerivedListeners * 0.65 +
        coreActiveFans * 0.25 +
        organicReach * 0.10
      );

      // Oyentes únicos no pueden superar el total de reproducciones ni estar por debajo de la base de fans activa
      const maxPossibleListeners = Math.max(1, totalMonthlySongStreams);
      const fanFloor = Math.max(15, Math.min(totalMonthlySongStreams, Math.floor(fansCount * 0.45)));

      const finalListeners = Math.min(maxPossibleListeners, Math.max(fanFloor, combined));
      return Math.max(15, finalListeners);
    }

    // Caso 2: Etapa underground / pre-lanzamiento sin catálogo formal o con 0 streams de singles
    // Los fans acumulados (batallas de freestyle, TikTok, plazas, eventos) generan oyentes mensuales
    // coherentes (~60% a 110% de fans según Hype) y escucha de maquetas/demos
    const hypeConversionMultiplier = 0.60 + safeHype * 0.50; // 0.60 (hype 0) a 1.10 (hype 100)
    const loyaltyModifier = 0.85 + safeLoyalty * 0.25; // 0.875 a 1.10
    const popBonus = safePop * 0.30; // 0.0 a 0.30

    const undergroundListeners = Math.floor(
      fansCount * hypeConversionMultiplier * loyaltyModifier * (1.0 + popBonus)
    );

    const minUndergroundFloor = fansCount > 0 ? Math.max(15, Math.floor(fansCount * 0.50)) : 15;
    return Math.max(minUndergroundFloor, undergroundListeners);
  }

  /**
   * Calculates immediate viral stream surge triggered by viral events, social media explosions, or breakthrough moments.
   * Proportional to new fans gained, current hype, and mainstream reach.
   */
  static calculateViralStreamSurge(
    fansGained: number,
    hype: number = 50,
    popularity: number = 20
  ): number {
    if (fansGained <= 0) return 0;
    const safeHype = Math.max(0, Math.min(100, hype || 50));
    const safePop = Math.max(0, Math.min(100, popularity || 10));
    
    const streamsPerFan = 3.5 + Math.min(3.5, safeHype / 25);
    const fanStreamSurge = Math.floor(fansGained * streamsPerFan);
    const mainstreamSurge = Math.floor(safeHype * 1200 + safePop * 250);
    
    return Math.max(1500, fanStreamSurge + mainstreamSurge);
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
      : (artist.personality?.skill || 70);

    const baseCritical =
      avgSongQuality * 0.45 +
      (artist.personality?.originality || 70) * 0.25 +
      (artist.stats?.artisticCredibility || 50) * 0.20 +
      (artist.personality?.creativity || 70) * 0.10 +
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
    const loyaltyRatio = Math.max(0.1, (artist.stats?.fanbaseLoyalty || 70) / 100);
    const coreFanSales = Math.floor((artist.stats?.fansCount || 1000) * loyaltyRatio * 0.18);

    // Mainstream popularity scaling
    const popRatio = Math.max(0.01, (artist.stats?.popularity || 10) / 100);
    const algorithmicPopularitySales = Math.pow(popRatio, 2.3) * 220000 + ((artist.stats?.popularity || 10) * 80);

    // Marketing impact
    const marketingMultiplier = 1.0 + Math.min(1.8, marketingBudget / 20000);

    // Hype impact
    const hypeFactor = 0.6 + ((artist.stats?.hype || 30) / 100) * 0.8;

    // Previous singles momentum carry-over
    const singlesMomentumSales = Math.floor(Math.min(45000, (includedSinglesTotalStreams || 0) * 0.0015));

    const calculatedFirstWeekSales = Math.floor(
      (coreFanSales + algorithmicPopularitySales + singlesMomentumSales) *
      formatMultiplier *
      marketingMultiplier *
      hypeFactor
    );

    // Baseline minimum sales
    const minSales = Math.max(50, Math.floor((artist.stats?.popularity || 10) * 15 + (artist.stats?.fansCount || 1000) * 0.05));
    const firstWeekSales = Math.max(minSales, calculatedFirstWeekSales);

    // 3. Commercial score (0 - 100)
    const commercialScore = Math.floor(
      Math.min(100, ((artist.personality?.commercialAppeal || 70) * 0.4 + (artist.stats?.popularity || 10) * 0.4 + (marketingBudget / 30000) * 20))
    );

    return {
      firstWeekSales,
      criticalScore,
      criticalReviewText,
      commercialScore
    };
  }
}
