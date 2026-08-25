import { Genre, MusicTrend, WorldState, GenreLifecycle } from '../types';

export class GenreTrendEngine {
  static updateGenresAndTrends(world: WorldState, isNewYear: boolean): {
    updatedGenres: Record<string, Genre>;
    updatedTrends: Record<string, MusicTrend>;
    newTrendSpawned?: MusicTrend;
    historicalNote?: string;
  } {
    const updatedGenres = { ...world.genres };
    const updatedTrends = { ...world.trends };
    let newTrendSpawned: MusicTrend | undefined;
    let historicalNote: string | undefined;

    // Monthly drift on genres
    for (const [id, genre] of Object.entries(updatedGenres)) {
      let popDelta = (genre.growthRate / 12) + (Math.random() * 0.4 - 0.2);
      let newPop = Math.max(10, Math.min(100, genre.currentPopularity + popDelta));
      let newLifecycle = genre.lifecycle;
      let newGrowthRate = genre.growthRate;

      // Check lifecycle transitions on yearly basis
      if (isNewYear) {
        if (newPop > 85 && genre.lifecycle === 'surging') {
          newLifecycle = 'mainstream';
          newGrowthRate = -0.5;
        } else if (newPop > 92 && genre.lifecycle === 'mainstream') {
          newLifecycle = 'oversaturated';
          newGrowthRate = -2.5;
        } else if (newPop < 60 && genre.lifecycle === 'oversaturated') {
          newLifecycle = 'niche';
          newGrowthRate = 0.2;
        } else if (newPop < 50 && genre.lifecycle === 'niche' && Math.random() < 0.15) {
          newLifecycle = 'reviving';
          newGrowthRate = 2.0;
          historicalNote = `Resurgimiento cultural: El género ${genre.name} vive un redescubrimiento impulsado por una nueva generación.`;
        }
      }

      updatedGenres[id] = {
        ...genre,
        currentPopularity: Math.round(newPop * 10) / 10,
        lifecycle: newLifecycle,
        growthRate: Math.round(newGrowthRate * 10) / 10
      };
    }

    // Trend management
    for (const [tId, trend] of Object.entries(updatedTrends)) {
      const elapsed = (world.currentYear - trend.startYear) * 12 + (world.currentMonth - trend.startMonth);
      if (elapsed > trend.durationMonths) {
        trend.stage = 'exhausted';
      } else if (elapsed > trend.durationMonths * 0.7) {
        trend.stage = 'cooling';
      } else if (elapsed > trend.durationMonths * 0.3) {
        trend.stage = 'peaking';
      } else {
        trend.stage = 'emerging';
      }
      updatedTrends[tId] = trend;
    }

    // Spawn new trend occasionally (e.g. 8% chance per month if active trends < 3)
    const activeTrendsCount = Object.values(updatedTrends).filter(t => t.stage !== 'exhausted').length;
    if (activeTrendsCount < 3 && Math.random() < 0.08) {
      const genreKeys = Object.keys(updatedGenres);
      const chosenGenreId = genreKeys[Math.floor(Math.random() * genreKeys.length)];
      const chosenGenre = updatedGenres[chosenGenreId];

      const trendNames = [
        `Nueva Ola de ${chosenGenre.name}`,
        `Movimiento Vanguardia ${chosenGenre.name}`,
        `Fusión Futurista de ${chosenGenre.name}`,
        `Estética Maximalista en ${chosenGenre.name}`,
        `Sonido Analógico & ${chosenGenre.name}`
      ];

      const trendId = `trend_${world.currentYear}_${world.currentMonth}_${Math.floor(Math.random() * 1000)}`;
      const trend: MusicTrend = {
        id: trendId,
        name: trendNames[Math.floor(Math.random() * trendNames.length)],
        description: `Un sonido fresco e innovador que acelera los streams de artistas de ${chosenGenre.name}.`,
        genreId: chosenGenreId,
        startYear: world.currentYear,
        startMonth: world.currentMonth,
        durationMonths: Math.floor(18 + Math.random() * 24),
        impactMultiplier: 1.35 + Math.random() * 0.25,
        stage: 'emerging',
        keyArtistIds: []
      };

      updatedTrends[trendId] = trend;
      newTrendSpawned = trend;
    }

    return {
      updatedGenres,
      updatedTrends,
      newTrendSpawned,
      historicalNote
    };
  }
}
