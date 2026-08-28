import { WorldState, Artist, Song, Album, CareerStage } from '../types';
import { generateRandomArtistName, generateSongTitle, generateAlbumTitle, generateUniqueSongTitle, generateUniqueAlbumTitle } from '../data/proceduralNames';
import { StreamingEngine } from './StreamingEngine';
import { LegacyEngine } from './LegacyEngine';
import { TimeSystem } from './TimeSystem';
import { IndustryEngine } from './IndustryEngine';

export class WorldSimulation {
  static simulateMonth(world: WorldState): {
    newSongsGenerated: Song[];
    newAlbumsGenerated: Album[];
    newArtistsSpawned: Artist[];
    retiredArtists: Artist[];
  } {
    const newSongsGenerated: Song[] = [];
    const newAlbumsGenerated: Album[] = [];
    const newArtistsSpawned: Artist[] = [];
    const retiredArtists: Artist[] = [];

    const activeTrends = Object.values(world.trends).filter(t => t.stage !== 'exhausted');

    // 1. Spawning new generational artists (approx 1 every 6-12 months if active artists < 60)
    const activeArtists = Object.values(world.artists).filter(a => !a.isRetired);
    if (activeArtists.length < 50 && (world.currentMonth === 1 || world.currentMonth === 7)) {
      const seedIdx = (world.currentYear * 12 + world.currentMonth + activeArtists.length) * 17;
      const { stageName, realName } = generateRandomArtistName(seedIdx);
      const genreKeys = Object.keys(world.genres);
      const mainGenreId = genreKeys[seedIdx % genreKeys.length];
      const newArtistId = `artist_gen_${world.currentYear}_${world.currentMonth}_${Math.floor(Math.random() * 10000)}`;

      // Pick an inspiration legend from existing artists
      const legends = Object.values(world.artists).filter(a => a.legacyScore > 75 || a.careerStage === 'Legend' || a.careerStage === 'Superstar');
      const inspiration = legends[seedIdx % Math.max(1, legends.length)]?.id;

      // 1 in 100,000 (0.001%) chance of spawning as a rare Prodigy
      const isProdigy = Math.random() < 0.00001;

      const newArtist: Artist = {
        id: newArtistId,
        name: stageName,
        realName,
        isPlayer: false,
        country: ['Argentina', 'México', 'España', 'Puerto Rico', 'USA', 'Colombia', 'Chile'][seedIdx % 7],
        city: 'Metrópolis Musical',
        birthYear: world.currentYear - 18 - (seedIdx % 6),
        careerStartYear: world.currentYear,
        mainGenreId,
        subGenreIds: [],
        personality: isProdigy
          ? {
              creativity: 95 + Math.floor(Math.random() * 6),
              ambition: 95 + Math.floor(Math.random() * 6),
              discipline: 95 + Math.floor(Math.random() * 6),
              charisma: 95 + Math.floor(Math.random() * 6),
              skill: 95 + Math.floor(Math.random() * 6),
              commercialAppeal: 95 + Math.floor(Math.random() * 6),
              originality: 95 + Math.floor(Math.random() * 6),
              riskTolerance: 90 + Math.floor(Math.random() * 11),
              sociability: 90 + Math.floor(Math.random() * 11),
              independence: 90 + Math.floor(Math.random() * 11)
            }
          : {
              creativity: 60 + Math.floor(Math.random() * 35),
              ambition: 60 + Math.floor(Math.random() * 35),
              discipline: 60 + Math.floor(Math.random() * 35),
              charisma: 60 + Math.floor(Math.random() * 35),
              skill: 60 + Math.floor(Math.random() * 35),
              commercialAppeal: 60 + Math.floor(Math.random() * 35),
              originality: 60 + Math.floor(Math.random() * 35),
              riskTolerance: 50 + Math.floor(Math.random() * 45),
              sociability: 50 + Math.floor(Math.random() * 45),
              independence: 50 + Math.floor(Math.random() * 45)
            },
        stats: {
          popularity: isProdigy ? 30 : 15 + Math.floor(Math.random() * 15),
          reputation: isProdigy ? 70 : 40 + Math.floor(Math.random() * 20),
          artisticCredibility: isProdigy ? 90 : 50 + Math.floor(Math.random() * 20),
          energy: 95,
          monthlyListeners: isProdigy ? 60000 : 15000 + Math.floor(Math.random() * 40000),
          totalStreams: isProdigy ? 150000 : 50000,
          funds: isProdigy ? 25000 : 5000 + Math.floor(Math.random() * 10000),
          fansCount: isProdigy ? 25000 : 8000 + Math.floor(Math.random() * 12000),
          fanbaseLoyalty: isProdigy ? 85 : 60 + Math.floor(Math.random() * 20),
          hype: isProdigy ? 80 : 45 + Math.floor(Math.random() * 30)
        },
        careerStage: 'Underground',
        labelId: null,
        managerId: null,
        relationships: {},
        eras: [
          {
            id: `era_${newArtistId}_debut`,
            name: isProdigy ? 'Aparición del Prodigio' : 'Debut en la Escena',
            startYear: world.currentYear,
            startMonth: world.currentMonth,
            genreFocus: mainGenreId,
            stage: 'Underground',
            highlightSummary: isProdigy
              ? `Aparición fulgurante como talento generacional en ${world.currentYear}.`
              : `Aparición en la escena en el año ${world.currentYear}.`
          }
        ],
        awardsWon: [],
        legacyScore: isProdigy ? 25 : 10,
        isRetired: false,
        historicalNotes: [
          isProdigy
            ? `Reconocido desde su debut como un prodigio generacional irrepetible (1 en 100.000).`
            : `Inició su carrera musical en ${world.currentYear}.`
        ],
        generationIndex: Math.floor((world.currentYear - 2026) / 10) + 1,
        influences: inspiration ? [inspiration] : [],
        isProdigy,
        prodigyMultiplier: isProdigy ? 3 : 1
      };

      world.artists[newArtistId] = newArtist;
      newArtistsSpawned.push(newArtist);
    }

    // 2. Simulate active NPC artists
    for (const artist of Object.values(world.artists)) {
      if (artist.isPlayer || artist.isRetired) continue;

      const age = TimeSystem.calculateAge(artist.birthYear, world.currentYear);
      const yearsActive = TimeSystem.calculateCareerLengthYears(artist.careerStartYear, world.currentYear);

      // Check retirement criteria (e.g. older than 60 or 35+ years in career with low energy)
      if (age > 65 || (yearsActive > 35 && artist.stats.popularity < 40 && Math.random() < 0.05)) {
        artist.isRetired = true;
        artist.retirementYear = world.currentYear;
        artist.careerStage = 'Retired';
        artist.historicalNotes.push(`Se retiró de los escenarios en ${world.currentYear} tras una distinguida carrera.`);
        retiredArtists.push(artist);
        continue;
      }

      // Dynamic career stage & era check
      const artistSongs = Object.values(world.songs).filter(s => s.artistId === artist.id);
      const hitsCount = artistSongs.filter(s => (s.peakPosition?.Global ?? 99) <= 10).length;
      artist.careerStage = LegacyEngine.evaluateCareerStage(artist, yearsActive, hitsCount);
      LegacyEngine.checkAndCreateEra(artist, world.currentYear, world.currentMonth);

      // Natural monthly hype decay
      artist.stats.hype = Math.max(10, Math.floor(artist.stats.hype * 0.94));

      // NPC Release Decision (e.g. 10-15% chance per month to drop single/album if not recently dropped)
      const monthsSinceLastRelease = artist.lastReleaseYear
        ? (world.currentYear - artist.lastReleaseYear) * 12 + (world.currentMonth - (artist.lastReleaseMonth || 1))
        : 99;

      if (monthsSinceLastRelease >= 4 && Math.random() < 0.18) {
        const isAlbum = monthsSinceLastRelease >= 14 && Math.random() < 0.35;
        const estProdBudget = Math.floor(artist.stats.funds * 0.05 + artist.stats.popularity * 100);
        const estMktBudget = Math.floor(artist.stats.funds * 0.08 + artist.stats.hype * 80);

        artist.lastReleaseYear = world.currentYear;
        artist.lastReleaseMonth = world.currentMonth;
        artist.stats.hype = Math.min(100, artist.stats.hype + 25);

        if (isAlbum) {
          const albumTitle = generateUniqueAlbumTitle({
            existingTitles: world.albums,
            artistName: artist.name,
            genreId: artist.mainGenreId,
            seedIndex: Object.keys(world.albums).length + 1
          });
          const albumId = `album_${artist.id}_${world.currentYear}_${world.currentMonth}_${Math.floor(Math.random() * 1000)}`;
          const songCount = 8 + Math.floor(Math.random() * 6);
          const albumSongIds: string[] = [];

          for (let i = 0; i < songCount; i++) {
            const sTitle = generateUniqueSongTitle({
              existingTitles: world.songs,
              artistName: artist.name,
              genreId: artist.mainGenreId,
              seedIndex: Object.keys(world.songs).length + i + 1
            });
            const songId = `song_${artist.id}_${world.currentYear}_${world.currentMonth}_${i}_${Math.floor(Math.random() * 1000)}`;

            const trackPerf = IndustryEngine.deriveTrackPerformanceAndLongevity({
              artist,
              productionBudget: Math.floor(estProdBudget / songCount),
              marketingBudget: Math.floor(estMktBudget / songCount),
              subGenreId: artist.subGenreIds?.[0]
            });

            const newSong: Song = {
              id: songId,
              title: sTitle,
              artistId: artist.id,
              featuredArtistIds: [],
              genreId: artist.mainGenreId,
              subGenreIds: artist.subGenreIds,
              releaseYear: world.currentYear,
              releaseMonth: world.currentMonth,
              quality: Math.min(100, Math.max(20, Math.floor(trackPerf.productionQuality * 0.5 + artist.personality.skill * 0.5 + Math.floor(Math.random() * 8 - 4)))),
              commercialAppeal: Math.min(100, Math.max(20, Math.floor(trackPerf.marketingInvestment * 0.5 + artist.personality.commercialAppeal * 0.5))),
              originality: Math.min(100, artist.personality.originality),
              hypeAtRelease: artist.stats.hype,
              streamsTotal: 0,
              streamsLastMonth: 0,
              monthlyStreamsHistory: [],
              peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
              weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
              longevityCurve: trackPerf.longevityCurve,
              isSingle: i === 0, // First track is lead single
              albumId,
              receptionRating: Math.floor(trackPerf.performanceScore / 20),
              isClassic: false,
              wentViral: false
            };

            world.songs[songId] = newSong;
            albumSongIds.push(songId);
            newSongsGenerated.push(newSong);
          }

          const gradients = [
            'from-purple-900 via-indigo-950 to-black',
            'from-amber-600 via-rose-900 to-zinc-950',
            'from-emerald-800 via-teal-950 to-black',
            'from-blue-900 via-sky-950 to-neutral-900',
            'from-red-900 via-neutral-900 to-black'
          ];

          const newAlbum: Album = {
            id: albumId,
            title: albumTitle,
            artistId: artist.id,
            type: 'album',
            songIds: albumSongIds,
            genreId: artist.mainGenreId,
            subGenreIds: artist.subGenreIds,
            releaseYear: world.currentYear,
            releaseMonth: world.currentMonth,
            totalStreams: 0,
            firstWeekSales: Math.floor(artist.stats.popularity * 1200 + Math.random() * 5000),
            criticalScore: Math.floor(artist.personality.skill * 0.5 + artist.personality.originality * 0.3 + (Math.random() * 20)),
            commercialScore: Math.floor(artist.personality.commercialAppeal * 0.6 + artist.stats.popularity * 0.4),
            peakChartPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
            awards: [],
            coverGradient: gradients[Object.keys(world.albums).length % gradients.length]
          };

          world.albums[albumId] = newAlbum;
          newAlbumsGenerated.push(newAlbum);
        } else {
          // Drop Single
          const sTitle = generateUniqueSongTitle({
            existingTitles: world.songs,
            artistName: artist.name,
            genreId: artist.mainGenreId,
            seedIndex: Object.keys(world.songs).length + 1
          });
          const songId = `song_${artist.id}_${world.currentYear}_${world.currentMonth}_${Math.floor(Math.random() * 1000)}`;

          const trackPerf = IndustryEngine.deriveTrackPerformanceAndLongevity({
            artist,
            productionBudget: estProdBudget,
            marketingBudget: estMktBudget,
            subGenreId: artist.subGenreIds?.[0]
          });

          const newSong: Song = {
            id: songId,
            title: sTitle,
            artistId: artist.id,
            featuredArtistIds: [],
            genreId: artist.mainGenreId,
            subGenreIds: artist.subGenreIds,
            releaseYear: world.currentYear,
            releaseMonth: world.currentMonth,
            quality: Math.min(100, Math.max(20, Math.floor(trackPerf.productionQuality * 0.5 + artist.personality.skill * 0.5))),
            commercialAppeal: Math.min(100, Math.max(20, Math.floor(trackPerf.marketingInvestment * 0.5 + artist.personality.commercialAppeal * 0.5))),
            originality: Math.min(100, artist.personality.originality),
            hypeAtRelease: artist.stats.hype,
            streamsTotal: 0,
            streamsLastMonth: 0,
            monthlyStreamsHistory: [],
            peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
            weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
            longevityCurve: trackPerf.longevityCurve,
            isSingle: true,
            receptionRating: Math.floor(trackPerf.performanceScore / 20),
            isClassic: false,
            wentViral: false
          };

          world.songs[songId] = newSong;
          newSongsGenerated.push(newSong);
        }
      }

      // Simulate streaming for all songs of this artist
      let artistTotalMonthlyStreams = 0;
      for (const song of artistSongs) {
        const streamResult = StreamingEngine.calculateSongMonthlyStreams(
          song,
          artist,
          world.currentYear,
          world.currentMonth,
          activeTrends,
          world.genres[song.genreId],
          world.artists
        );

        song.streamsLastMonth = streamResult.streams;
        song.streamsTotal += streamResult.streams;
        song.monthlyStreamsHistory.push(streamResult.streams);
        if (streamResult.wentViralNow) song.wentViral = true;
        if (streamResult.becomesClassicNow) song.isClassic = true;

        artistTotalMonthlyStreams += streamResult.streams;
      }

      artist.stats.totalStreams += artistTotalMonthlyStreams;
      artist.stats.monthlyListeners = StreamingEngine.calculateMonthlyListeners(
        artistTotalMonthlyStreams,
        artist.stats.popularity,
        artist.stats.fansCount,
        artist.stats.fanbaseLoyalty,
        artist.stats.hype,
        artistSongs.length > 0
      );

      // 4. Convergencia armónica de popularidad y conversión mensual de fans
      const targetPop = StreamingEngine.calculateTargetPopularity(
        artist.stats.monthlyListeners,
        artist.stats.totalStreams
      );
      if (artist.stats.popularity < targetPop) {
        const step = Math.min(4, Math.max(1, Math.floor((targetPop - artist.stats.popularity) * 0.35)));
        artist.stats.popularity = Math.min(targetPop, artist.stats.popularity + step);
      } else if (artist.stats.popularity > targetPop && artistTotalMonthlyStreams < 200000) {
        artist.stats.popularity = Math.max(targetPop, artist.stats.popularity - 1);
      }

      // Conversión orgánica mensual de oyentes a fans
      const newFans = StreamingEngine.calculateMonthlyFanConversion(
        artist.stats.monthlyListeners,
        artist.stats.fansCount,
        artist.stats.hype,
        artist.stats.fanbaseLoyalty,
        artistSongs.some(s => s.releaseYear === world.currentYear && s.releaseMonth === world.currentMonth)
      );
      artist.stats.fansCount += newFans;
    }

    return {
      newSongsGenerated,
      newAlbumsGenerated,
      newArtistsSpawned,
      retiredArtists
    };
  }
}
