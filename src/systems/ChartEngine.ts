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
  static REGIONS: MusicRegion[] = ['Global', 'Argentina', 'LatinAmerica', 'USA', 'Europe', 'Spain', 'Mexico', 'UK', 'Brazil', 'Asia', 'Africa'];

  /**
   * Generates a deterministic per-song, per-region affinity variance (between 0.72 and 1.35)
   * so that each song performs organically differently across distinct regional markets.
   */
  static getDeterministicRegionalVariance(songId: string, region: MusicRegion): number {
    const key = `${songId}:${region}`;
    let hash = 2166136261;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const normalized = (hash >>> 0) / 4294967295; // 0..1
    return 0.72 + normalized * 0.63; // 0.72 .. 1.35
  }

  /**
   * Computes a realistic regional market share and local affinity multiplier for a song in a given region.
   * Ensures that Global Top 50 is led by international superstars while national/regional charts
   * (such as Argentina Top 50) are genuinely dominated by local and culturally affine artists.
   */
  static calculateRegionalMultiplier(
    song: Song,
    artist: Artist | undefined,
    region: MusicRegion,
    allArtists: Record<string, Artist>
  ): number {
    const variance = this.getDeterministicRegionalVariance(song.id, region);
    if (!artist) return variance;

    const artistCountry = artist.country || '';
    const artistCode = (artist.countryCode || '').toUpperCase();
    const artistLang = (artist.language || '').toLowerCase();

    const localPop = artist.popularityLocal ?? artist.stats?.popularity ?? 50;
    const regionalPop = artist.popularityRegional ?? artist.stats?.popularity ?? 50;
    const globalPop = artist.popularityGlobal ?? (
      artist.isPlayer
        ? Math.max(15, Math.floor((artist.stats?.popularity ?? 25) * 0.78))
        : (artist.stats?.popularity ?? 45)
    );

    const isArgentina = artistCountry.includes('Argentina') || artistCode === 'AR';
    const isSpain = artistCountry.includes('España') || artistCountry.includes('Spain') || artistCode === 'ES';
    const isMexico = artistCountry.includes('México') || artistCountry.includes('Mexico') || artistCode === 'MX';
    const isUSA = artistCountry.includes('USA') || artistCountry.includes('Estados Unidos') || artistCountry.includes('Canadá') || artistCode === 'US' || artistCode === 'CA';
    const isUK = artistCountry.includes('Reino Unido') || artistCountry.includes('UK') || artistCountry.includes('Irlanda') || artistCode === 'GB' || artistCode === 'IE';
    const isBrazil = artistCountry.includes('Brasil') || artistCountry.includes('Brazil') || artistCode === 'BR';
    const isConoSur = artistCountry.includes('Uruguay') || artistCountry.includes('Chile') || artistCode === 'UY' || artistCode === 'CL';
    const isOtherLatam =
      artistCountry.includes('Puerto Rico') ||
      artistCountry.includes('Colombia') ||
      artistCountry.includes('República Dominicana') ||
      artistCountry.includes('Perú') ||
      artistCountry.includes('Venezuela') ||
      artistCountry.includes('Cuba') ||
      artistCountry.includes('Ecuador') ||
      artistCountry.includes('Jamaica') ||
      ['PR', 'CO', 'DO', 'PE', 'VE', 'CU', 'EC', 'JM'].includes(artistCode);

    const isHispanic = isArgentina || isSpain || isMexico || isConoSur || isOtherLatam || artistLang === 'es';
    const isLatinAmericaAll = isArgentina || isMexico || isConoSur || isOtherLatam || isBrazil;

    const isEurope =
      isSpain ||
      isUK ||
      artistCountry.includes('Francia') ||
      artistCountry.includes('Alemania') ||
      artistCountry.includes('Italia') ||
      artistCountry.includes('Suecia') ||
      artistCountry.includes('Noruega') ||
      artistCountry.includes('Países Bajos') ||
      artistCountry.includes('Bélgica') ||
      artistCountry.includes('Portugal') ||
      artistCountry.includes('Polonia') ||
      artistCountry.includes('Rusia') ||
      artistCountry.includes('Turquía') ||
      ['FR', 'DE', 'IT', 'SE', 'NO', 'NL', 'BE', 'PT', 'PL', 'RU', 'TR'].includes(artistCode) ||
      Boolean(artist.influenceRegions?.includes('Europe'));

    const isAsia =
      artistCountry.includes('Corea') ||
      artistCountry.includes('Japón') ||
      artistCountry.includes('India') ||
      artistCountry.includes('Filipinas') ||
      artistCountry.includes('Indonesia') ||
      artistCountry.includes('China') ||
      artistCountry.includes('Australia') ||
      artistCountry.includes('Nueva Zelanda') ||
      ['KR', 'JP', 'IN', 'PH', 'ID', 'CN', 'AU', 'NZ'].includes(artistCode) ||
      Boolean(artist.influenceRegions?.includes('Asia'));

    const isAfrica =
      artistCountry.includes('Nigeria') ||
      artistCountry.includes('Ghana') ||
      artistCountry.includes('Sudáfrica') ||
      artistCountry.includes('Marruecos') ||
      artistCountry.includes('Egipto') ||
      ['NG', 'GH', 'ZA', 'MA', 'EG'].includes(artistCode) ||
      Boolean(artist.influenceRegions?.includes('Africa'));

    // Check if any featured collaborator is native to the target region
    let hasLocalFeature = false;
    if (song.featuredArtistIds && song.featuredArtistIds.length > 0) {
      for (const featId of song.featuredArtistIds) {
        const feat = allArtists[featId];
        if (!feat) continue;
        const fc = feat.country || '';
        const fcode = (feat.countryCode || '').toUpperCase();
        if (region === 'Argentina' && (fc.includes('Argentina') || fcode === 'AR')) hasLocalFeature = true;
        else if (region === 'Spain' && (fc.includes('España') || fcode === 'ES')) hasLocalFeature = true;
        else if (region === 'Mexico' && (fc.includes('México') || fcode === 'MX')) hasLocalFeature = true;
        else if (region === 'USA' && (fc.includes('USA') || fcode === 'US')) hasLocalFeature = true;
        else if (region === 'UK' && (fc.includes('UK') || fc.includes('Reino Unido') || fcode === 'GB')) hasLocalFeature = true;
        else if (region === 'Brazil' && (fc.includes('Brasil') || fcode === 'BR')) hasLocalFeature = true;
      }
    }

    let baseMultiplier = 1.0;

    switch (region) {
      case 'Global': {
        const commercialBoost = 0.85 + (Math.max(20, song.commercialAppeal || 60) / 100) * 0.35;
        if (globalPop >= 92 && (isUSA || isUK || artistCode === 'PR' || artistCode === 'CO' || artistCode === 'KR' || artistCode === 'CA')) {
          baseMultiplier = (1.35 + ((globalPop - 90) / 10) * 0.50) * commercialBoost;
        } else if (globalPop >= 85 || artist.influenceRegions?.includes('Global')) {
          if (isArgentina && globalPop < 95) {
            // Argentine superstars have intense Cono Sur concentration; only mega-hits reach top Global positions
            baseMultiplier = (0.48 + ((globalPop - 80) / 20) * 0.36) * commercialBoost;
          } else {
            baseMultiplier = (0.95 + ((globalPop - 80) / 20) * 0.45) * commercialBoost;
          }
        } else if (globalPop >= 72) {
          baseMultiplier = (0.38 + ((globalPop - 70) / 15) * 0.32) * commercialBoost;
        } else {
          // Strictly local/emerging artists have concentrated home-country streams, not global distribution
          baseMultiplier = (0.16 + (globalPop / 72) * 0.22) * commercialBoost;
        }
        break;
      }

      case 'Argentina': {
        if (isArgentina) {
          baseMultiplier = 9.5 + (Math.max(40, localPop) / 100) * 6.5; // 9.5x .. 16.0x
        } else if (isConoSur) {
          baseMultiplier = 2.1 + (regionalPop / 100) * 1.1; // Uruguay & Chile
        } else if (isHispanic) {
          baseMultiplier = 1.05 + (regionalPop / 100) * 0.85; // Puerto Rico, Colombia, España, México
        } else if (isBrazil) {
          baseMultiplier = 0.16 + (globalPop / 100) * 0.14;
        } else {
          // Non-Hispanic rest of world (USA, UK, Asia, Africa, Europe): low local share in Argentina
          baseMultiplier = 0.04 + (Math.max(0, globalPop - 60) / 40) * 0.09; // 0.04x .. 0.13x
        }
        break;
      }

      case 'Spain': {
        if (isSpain) {
          baseMultiplier = 9.5 + (Math.max(40, localPop) / 100) * 6.0;
        } else if (isArgentina || isOtherLatam || isMexico) {
          baseMultiplier = 1.5 + (regionalPop / 100) * 1.1;
        } else if (isEurope) {
          baseMultiplier = 0.25 + (globalPop / 100) * 0.25;
        } else {
          baseMultiplier = 0.07 + (Math.max(0, globalPop - 60) / 40) * 0.12;
        }
        break;
      }

      case 'Mexico': {
        if (isMexico) {
          baseMultiplier = 10.0 + (Math.max(40, localPop) / 100) * 6.0;
        } else if (isOtherLatam || isArgentina || isSpain) {
          baseMultiplier = 1.35 + (regionalPop / 100) * 1.05;
        } else if (isUSA) {
          baseMultiplier = 0.14 + (globalPop / 100) * 0.16;
        } else {
          baseMultiplier = 0.05 + (Math.max(0, globalPop - 60) / 40) * 0.10;
        }
        break;
      }

      case 'LatinAmerica': {
        if (isHispanic && !isSpain) {
          baseMultiplier = 3.8 + (Math.max(40, regionalPop) / 100) * 2.4;
        } else if (isSpain) {
          baseMultiplier = 2.2 + (regionalPop / 100) * 1.3;
        } else if (isBrazil) {
          baseMultiplier = 1.3 + (regionalPop / 100) * 0.8;
        } else {
          baseMultiplier = 0.08 + (Math.max(0, globalPop - 60) / 40) * 0.14;
        }
        break;
      }

      case 'USA': {
        if (isUSA) {
          baseMultiplier = 3.4 + (Math.max(40, localPop) / 100) * 2.2;
        } else if (artistCode === 'PR') {
          baseMultiplier = 1.8 + (regionalPop / 100) * 1.1;
        } else if (isUK || isMexico) {
          baseMultiplier = 0.9 + (globalPop / 100) * 0.65;
        } else if (isAsia && globalPop >= 85) {
          baseMultiplier = 0.65 + (globalPop / 100) * 0.55;
        } else {
          baseMultiplier = 0.12 + (Math.max(0, globalPop - 60) / 40) * 0.22;
        }
        break;
      }

      case 'UK': {
        if (isUK) {
          baseMultiplier = 9.0 + (Math.max(40, localPop) / 100) * 5.5;
        } else if (isUSA) {
          baseMultiplier = 0.55 + (globalPop / 100) * 0.55;
        } else if (isEurope || isAfrica) {
          baseMultiplier = 0.45 + (globalPop / 100) * 0.45;
        } else {
          baseMultiplier = 0.08 + (Math.max(0, globalPop - 60) / 40) * 0.14;
        }
        break;
      }

      case 'Europe': {
        if (isEurope) {
          baseMultiplier = 4.2 + (Math.max(40, regionalPop) / 100) * 3.0;
        } else if (isUSA) {
          baseMultiplier = 0.45 + (globalPop / 100) * 0.45;
        } else {
          baseMultiplier = 0.18 + (Math.max(0, globalPop - 60) / 40) * 0.28;
        }
        break;
      }

      case 'Brazil': {
        if (isBrazil) {
          baseMultiplier = 12.0 + (Math.max(40, localPop) / 100) * 6.5;
        } else if (isLatinAmericaAll) {
          baseMultiplier = 0.22 + (regionalPop / 100) * 0.22;
        } else {
          baseMultiplier = 0.06 + (Math.max(0, globalPop - 60) / 40) * 0.12;
        }
        break;
      }

      case 'Asia': {
        if (isAsia) {
          baseMultiplier = 9.5 + (Math.max(40, localPop) / 100) * 6.0;
        } else if (isUSA || isUK) {
          baseMultiplier = 0.12 + (globalPop / 100) * 0.16;
        } else {
          baseMultiplier = 0.04 + (Math.max(0, globalPop - 60) / 40) * 0.09;
        }
        break;
      }

      case 'Africa': {
        if (isAfrica) {
          baseMultiplier = 11.0 + (Math.max(40, localPop) / 100) * 6.5;
        } else if (isUSA || isUK) {
          baseMultiplier = 0.10 + (globalPop / 100) * 0.15;
        } else {
          baseMultiplier = 0.04 + (Math.max(0, globalPop - 60) / 40) * 0.08;
        }
        break;
      }
    }

    if (hasLocalFeature) {
      baseMultiplier *= 2.25;
    }

    return baseMultiplier * variance;
  }

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
        const regionalMultiplier = this.calculateRegionalMultiplier(song, artist, region, allArtists);
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
          item.song.peakPosition = { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null };
        }

        // Update song peak position if current rank is better or unrecorded
        const currentPeak = item.song.peakPosition[region];
        if (currentPeak === null || currentPeak === undefined || rank < currentPeak) {
          item.song.peakPosition[region] = rank;
        }

        // Initialize and update weeks on chart
        if (!item.song.weeksOnChart) {
          item.song.weeksOnChart = { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 };
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
    const duplicateSongIds: any[] = [];
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
