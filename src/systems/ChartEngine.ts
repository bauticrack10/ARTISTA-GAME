import { Song, Artist, RegionalChart, MusicRegion, ChartEntry, HistoricalRecord, WorldState } from '../types';

export class ChartEngine {
  static REGIONS: MusicRegion[] = ['Global', 'Argentina', 'LatinAmerica', 'USA', 'Europe', 'Spain', 'Mexico'];

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

    const activeSongs = Object.values(allSongs).filter(s => {
      const ageMonths = (world.currentYear - s.releaseYear) * 12 + (world.currentMonth - s.releaseMonth);
      return ageMonths >= 0 && s.streamsLastMonth > 500;
    });

    for (const region of this.REGIONS) {
      // Score each song for this region
      const scoredSongs = activeSongs.map(song => {
        const artist = allArtists[song.artistId];
        let regionalMultiplier = 1.0;

        if (artist) {
          if (region === 'Argentina' && artist.country.includes('Argentina')) regionalMultiplier = 2.4;
          else if (region === 'LatinAmerica' && (artist.country.includes('Argentina') || artist.country.includes('Puerto Rico') || artist.country.includes('México') || artist.country.includes('Colombia') || artist.country.includes('Chile'))) regionalMultiplier = 1.8;
          else if (region === 'Spain' && artist.country.includes('España')) regionalMultiplier = 2.2;
          else if (region === 'USA' && artist.country.includes('USA')) regionalMultiplier = 2.0;
          else if (region === 'Mexico' && artist.country.includes('México')) regionalMultiplier = 2.5;
        }

        const score = (song.streamsLastMonth / 4) * regionalMultiplier; // weekly stream equivalent

        return {
          song,
          artist,
          score
        };
      });

      // Sort descending by score
      scoredSongs.sort((a, b) => b.score - a.score);

      // Take top 50
      const previousChart = world.charts?.[region];
      const previousRankMap = new Map<string, number>();
      if (previousChart) {
        previousChart.entries.forEach(e => previousRankMap.set(e.songId, e.rank));
      }

      const entries: ChartEntry[] = scoredSongs.slice(0, 50).map((item, idx) => {
        const rank = idx + 1;
        const lastRank = previousRankMap.get(item.song.id) ?? null;
        const weeks = (item.song.weeksOnChart?.[region] || 0) + 4; // 4 weeks per monthly tick

        // Update song peak
        const currentPeak = item.song.peakPosition?.[region];
        if (currentPeak === null || currentPeak === undefined || rank < currentPeak) {
          if (!item.song.peakPosition) {
            item.song.peakPosition = { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null };
          }
          item.song.peakPosition[region] = rank;
        }

        if (!item.song.weeksOnChart) {
          item.song.weeksOnChart = { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 };
        }
        item.song.weeksOnChart[region] = weeks;

        // Check for #1 news or milestone
        if (rank === 1 && lastRank !== 1 && item.artist) {
          chartMilestoneNews.push({
            headline: `¡#1 en ${region}! "${item.song.title}" de ${item.artist.name} conquista la cima`,
            body: `El single alcanzó el primer puesto de los charts oficiales en ${region} con cifras récord de streaming.`,
            relatedArtistId: item.artist.id
          });
        }

        return {
          rank,
          songId: item.song.id,
          artistId: item.song.artistId,
          featuredArtistIds: item.song.featuredArtistIds,
          title: item.song.title,
          artistName: item.artist ? item.artist.name : 'Desconocido',
          streamsThisWeek: Math.floor(item.score),
          lastRank,
          peakRank: item.song.peakPosition[region] || rank,
          weeksOnChart: weeks
        };
      });

      updatedCharts[region] = {
        region,
        year: world.currentYear,
        month: world.currentMonth,
        entries
      };
    }

    return {
      updatedCharts: updatedCharts as Record<MusicRegion, RegionalChart>,
      newRecords,
      chartMilestoneNews
    };
  }
}
