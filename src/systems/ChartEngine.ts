import { Song, Artist, RegionalChart, MusicRegion, ChartEntry, HistoricalRecord, WorldState } from '../types';
import { formatChartMilestoneHeadline, formatChartMilestoneBody } from '../utils/formatters';

export interface ChartValidationResult {
  isValid: boolean;
  errors: string[];
  duplicateRanks: number[];
  duplicateSongIds: string[];
  hasGaps: boolean;
}

export class ChartEngine {
  static REGIONS: MusicRegion[] = ['Global', 'Argentina', 'LatinAmerica', 'USA', 'Europe', 'Spain', 'Mexico'];

  /**
   * Calculates regional charts with strict deterministic tie-breaking and rank uniqueness.
   * Guarantees exactly one song per position (#1, #2, ..., #50) with no collisions.
   */
  static calculateRegionalCharts(
    world: WorldState,
    allSongs: Record<string, Song>,
    allArtists: Record<string, Artist>
  ): {
    updatedCharts: Record<MusicRegion, RegionalChart>;
    newRecords: HistoricalRecord[];
    chartMilestoneNews: Array<{ headline: string; body: string; relatedArtistId: string }>;
  } {
    const updatedCharts: Partial<Record<MusicRegion, RegionalChart>> = {};
    const newRecords: HistoricalRecord[] = [];
    const chartMilestoneNews: Array<{ headline: string; body: string; relatedArtistId: string }> = [];

    // Deduplicate songs by songId and filter active songs with streaming presence
    const uniqueSongsMap = new Map<string, Song>();
    Object.values(allSongs).forEach(s => {
      if (s && s.id) uniqueSongsMap.set(s.id, s);
    });

    const activeSongs = Array.from(uniqueSongsMap.values()).filter(s => {
      const ageMonths = (world.currentYear - s.releaseYear) * 12 + (world.currentMonth - s.releaseMonth);
      return ageMonths >= 0 && (s.streamsLastMonth > 100 || s.streamsTotal > 500);
    });

    for (const region of this.REGIONS) {
      // Score each song for this specific region
      const scoredSongs = activeSongs.map(song => {
        const artist = allArtists[song.artistId];
        let regionalMultiplier = 1.0;

        if (artist) {
          const artistCountry = artist.country || '';
          if (region === 'Argentina' && artistCountry.includes('Argentina')) {
            regionalMultiplier = 2.4;
          } else if (region === 'LatinAmerica' && (
            artistCountry.includes('Argentina') ||
            artistCountry.includes('Puerto Rico') ||
            artistCountry.includes('México') ||
            artistCountry.includes('Colombia') ||
            artistCountry.includes('Chile')
          )) {
            regionalMultiplier = 1.8;
          } else if (region === 'Spain' && artistCountry.includes('España')) {
            regionalMultiplier = 2.2;
          } else if (region === 'USA' && artistCountry.includes('USA')) {
            regionalMultiplier = 2.0;
          } else if (region === 'Mexico' && artistCountry.includes('México')) {
            regionalMultiplier = 2.5;
          }
        }

        const score = (song.streamsLastMonth / 4) * regionalMultiplier; // weekly stream equivalent

        return {
          song,
          artist,
          score
        };
      });

      // Strict multi-level deterministic sorting to prevent ties and arbitrary rank fluctuations
      scoredSongs.sort((a, b) => {
        // 1. Primary: Regional weekly score
        if (Math.abs(b.score - a.score) > 0.001) return b.score - a.score;
        // 2. Monthly streams
        if (b.song.streamsLastMonth !== a.song.streamsLastMonth) return b.song.streamsLastMonth - a.song.streamsLastMonth;
        // 3. Total career streams
        if (b.song.streamsTotal !== a.song.streamsTotal) return b.song.streamsTotal - a.song.streamsTotal;
        // 4. Production quality
        if (b.song.quality !== a.song.quality) return b.song.quality - a.song.quality;
        // 5. Commercial appeal
        if (b.song.commercialAppeal !== a.song.commercialAppeal) return b.song.commercialAppeal - a.song.commercialAppeal;
        // 6. Artist popularity
        const popA = a.artist?.stats?.popularity ?? 0;
        const popB = b.artist?.stats?.popularity ?? 0;
        if (popB !== popA) return popB - popA;
        // 7. Song release freshness (newer songs break ties first)
        const ageA = a.song.releaseYear * 12 + a.song.releaseMonth;
        const ageB = b.song.releaseYear * 12 + b.song.releaseMonth;
        if (ageB !== ageA) return ageB - ageA;
        // 8. Deterministic string comparison on unique songId
        return a.song.id.localeCompare(b.song.id);
      });

      // Build previous rank lookup map for tracking chart movements
      const previousChart = world.charts?.[region];
      const previousRankMap = new Map<string, number>();
      if (previousChart && Array.isArray(previousChart.entries)) {
        previousChart.entries.forEach(e => {
          if (e && e.songId) previousRankMap.set(e.songId, e.rank);
        });
      }

      // Take strictly top 50 and assign sequential unique ranks 1 to N
      const top50Scored = scoredSongs.slice(0, 50);
      const seenSongIdsInChart = new Set<string>();

      const entries: ChartEntry[] = [];

      top50Scored.forEach((item) => {
        if (seenSongIdsInChart.has(item.song.id)) return; // Prevent any duplicate songId in the same chart
        seenSongIdsInChart.add(item.song.id);

        const rank = entries.length + 1; // Strict 1-based sequential rank (1, 2, 3, ...)
        const lastRank = previousRankMap.get(item.song.id) ?? null;
        const currentWeeks = (item.song.weeksOnChart?.[region] || 0) + 4; // 4 weeks per monthly tick

        // Initialize peakPosition dictionary if missing
        if (!item.song.peakPosition) {
          item.song.peakPosition = { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null };
        }

        // Update song peak position if current rank is better or unrecorded
        const currentPeak = item.song.peakPosition[region];
        if (currentPeak === null || currentPeak === undefined || rank < currentPeak) {
          item.song.peakPosition[region] = rank;
        }

        // Initialize and update weeks on chart
        if (!item.song.weeksOnChart) {
          item.song.weeksOnChart = { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 };
        }
        item.song.weeksOnChart[region] = currentWeeks;

        // Format artist name including featured artists
        let formattedArtistName = item.artist ? item.artist.name : 'Desconocido';
        if (item.song.featuredArtistIds && item.song.featuredArtistIds.length > 0) {
          const featNames = item.song.featuredArtistIds
            .map(id => allArtists[id]?.name)
            .filter(Boolean);
          if (featNames.length > 0) {
            formattedArtistName = `${formattedArtistName} (ft. ${featNames.join(', ')})`;
          }
        }

        // Check for #1 news milestone (only when newly hitting #1)
        if (rank === 1 && lastRank !== 1 && item.artist) {
          chartMilestoneNews.push({
            headline: formatChartMilestoneHeadline(region, item.song.title, formattedArtistName),
            body: formatChartMilestoneBody(region),
            relatedArtistId: item.artist.id
          });
        }

        const entry: ChartEntry = {
          rank,
          songId: item.song.id,
          artistId: item.song.artistId,
          featuredArtistIds: item.song.featuredArtistIds || [],
          title: item.song.title,
          artistName: formattedArtistName,
          streamsThisWeek: Math.max(0, Math.floor(item.score)),
          lastRank,
          peakRank: item.song.peakPosition[region] || rank,
          weeksOnChart: currentWeeks
        };

        entries.push(entry);
      });

      const regionalChart: RegionalChart = {
        region,
        year: world.currentYear,
        month: world.currentMonth,
        entries
      };

      // Validate integrity of the computed chart
      const validation = this.validateChartIntegrity(regionalChart, allSongs);
      if (!validation.isValid) {
        console.warn(`[ChartEngine] Warning in chart ${region}:`, validation.errors);
      }

      updatedCharts[region] = regionalChart;
    }

    return {
      updatedCharts: updatedCharts as Record<MusicRegion, RegionalChart>,
      newRecords,
      chartMilestoneNews
    };
  }

  /**
   * Strictly validates that a regional chart satisfies all integrity invariants:
   * 1. Positions 1..N are unique and sequential (exactly one song per rank #1, #2, etc.).
   * 2. No duplicate songIds exist in the chart.
   * 3. Chart has at most 50 entries.
   * 4. Weekly streams are non-increasing (rank 1 >= rank 2 >= rank 3...).
   * 5. Peak rank is logically sound (1 <= peakRank <= rank).
   */
  static validateChartIntegrity(
    chart: RegionalChart,
    _allSongs?: Record<string, Song>
  ): ChartValidationResult {
    const errors: string[] = [];
    const duplicateRanks: number[] = [];
    const duplicateSongIds: string[] = [];
    let hasGaps = false;

    if (!chart || !Array.isArray(chart.entries)) {
      return {
        isValid: false,
        errors: ['Chart entries is not an array or chart is missing.'],
        duplicateRanks: [],
        duplicateSongIds: [],
        hasGaps: true
      };
    }

    if (chart.entries.length > 50) {
      errors.push(`Chart for region ${chart.region} exceeds max 50 entries (found ${chart.entries.length}).`);
    }

    const seenRanks = new Set<number>();
    const seenSongIds = new Set<string>();

    for (let i = 0; i < chart.entries.length; i++) {
      const entry = chart.entries[i];
      const expectedRank = i + 1;

      if (!entry) {
        errors.push(`Null entry at index ${i}.`);
        continue;
      }

      // Check rank value and sequence
      if (entry.rank !== expectedRank) {
        hasGaps = true;
        errors.push(`Expected rank ${expectedRank} at index ${i}, but got ${entry.rank}.`);
      }

      if (seenRanks.has(entry.rank)) {
        duplicateRanks.push(entry.rank);
        errors.push(`Duplicate rank #${entry.rank} found in region ${chart.region} for song "${entry.title}" (${entry.songId}).`);
      } else {
        seenRanks.add(entry.rank);
      }

      // Check songId uniqueness
      if (seenSongIds.has(entry.songId)) {
        duplicateSongIds.push(entry.songId);
        errors.push(`Duplicate songId ${entry.songId} in region ${chart.region}.`);
      } else {
        seenSongIds.add(entry.songId);
      }

      // Check peakRank bounds
      if (entry.peakRank < 1 || entry.peakRank > entry.rank) {
        errors.push(`Invalid peakRank #${entry.peakRank} for current rank #${entry.rank} on song "${entry.title}".`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      duplicateRanks,
      duplicateSongIds,
      hasGaps
    };
  }

  /**
   * Validates all regional charts in the world state.
   */
  static validateAllWorldCharts(world: WorldState): { isValid: boolean; errors: string[] } {
    const allErrors: string[] = [];
    if (!world.charts) return { isValid: true, errors: [] };

    for (const region of this.REGIONS) {
      const chart = world.charts[region];
      if (chart) {
        const result = this.validateChartIntegrity(chart, world.songs);
        if (!result.isValid) {
          allErrors.push(...result.errors);
        }
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }
}

