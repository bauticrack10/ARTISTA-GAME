import {
  Artist,
  Song,
  Album,
  AwardCeremony,
  AwardCategory,
  AwardNominee,
  WorldState
} from '../types';
import { generateSongTitle, generateAlbumTitle, generateUniqueSongTitle, generateUniqueAlbumTitle, normalizeTitle } from '../data/proceduralNames';

/**
 * Constant: Exactly 4 nominees per category across all award categories
 */
export const NOMINEES_PER_CATEGORY = 4;

export interface ConductAnnualAwardsResult {
  ceremony: AwardCeremony;
  awardNews: Array<{ headline: string; body: string; relatedArtistId: string }>;
  playerWonAny: boolean;
}

export class AwardEngine {
  /**
   * Normalizes title string for strict duplicate collision detection across categories and gala.
   * Strips accents, punctuation, and whitespace, converting to lowercase alphanumeric.
   */
  public static normalizeTitle(title: string): string {
    return normalizeTitle(title);
  }

  /**
   * Ensures the world has a minimal published catalogue for realistic awards simulation
   * in case of sparse or newly started worlds, generating real published pieces for active NPCs.
   */
  private static ensureCatalogueFallback(world: WorldState, year: number): void {
    const activeNPCs = Object.values(world.artists).filter(a => !a.isPlayer && !a.isRetired);
    if (activeNPCs.length === 0) return;

    // Ensure songs catalogue has enough published items
    const existingSongsCount = Object.keys(world.songs).length;
    if (existingSongsCount < NOMINEES_PER_CATEGORY) {
      const needed = NOMINEES_PER_CATEGORY - existingSongsCount;
      for (let i = 0; i < needed; i++) {
        const artist = activeNPCs[i % activeNPCs.length];
        const songId = `song_award_fallback_${year}_${i}_${artist.id}_${Math.floor(Math.random() * 1000)}`;
        const title = generateUniqueSongTitle({
          existingTitles: world.songs,
          artistName: artist.name,
          genreId: artist.mainGenreId,
          seedIndex: existingSongsCount + i + 10
        });
        const song: Song = {
          id: songId,
          title,
          artistId: artist.id,
          featuredArtistIds: [],
          genreId: artist.mainGenreId,
          subGenreIds: artist.subGenreIds || [],
          releaseYear: year,
          releaseMonth: Math.floor(Math.random() * 11) + 1,
          quality: Math.min(100, Math.max(30, Math.floor((artist.personality?.skill ?? 75) * 0.7 + Math.random() * 25))),
          commercialAppeal: Math.min(100, Math.max(30, Math.floor((artist.personality?.commercialAppeal ?? 75) * 0.7 + Math.random() * 25))),
          originality: Math.min(100, Math.max(30, artist.personality?.originality ?? 75)),
          hypeAtRelease: artist.stats?.hype ?? 50,
          streamsTotal: Math.floor((artist.stats?.totalStreams ?? 50000) * 0.15 + 50000),
          streamsLastMonth: Math.floor((artist.stats?.monthlyListeners ?? 20000) * 0.3),
          monthlyStreamsHistory: [],
          peakPosition: {
            Global: 10 + i * 5,
            Argentina: 5 + i * 3,
            USA: null,
            LatinAmerica: 8 + i * 4,
            Europe: null,
            Spain: null,
            Mexico: null
          },
          weeksOnChart: { Global: 8, Argentina: 10, USA: 0, LatinAmerica: 9, Europe: 0, Spain: 0, Mexico: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: false
        };
        world.songs[songId] = song;
      }
    }

    // Ensure albums catalogue has enough published items
    const existingAlbumsCount = Object.keys(world.albums).length;
    if (existingAlbumsCount < NOMINEES_PER_CATEGORY) {
      const needed = NOMINEES_PER_CATEGORY - existingAlbumsCount;
      const gradients = [
        'from-purple-900 via-indigo-950 to-black',
        'from-amber-600 via-rose-900 to-zinc-950',
        'from-emerald-800 via-teal-950 to-black',
        'from-blue-900 via-sky-950 to-neutral-900'
      ];
      for (let i = 0; i < needed; i++) {
        const artist = activeNPCs[(i + 2) % activeNPCs.length];
        const albumId = `album_award_fallback_${year}_${i}_${artist.id}_${Math.floor(Math.random() * 1000)}`;
        const title = generateUniqueAlbumTitle({
          existingTitles: world.albums,
          artistName: artist.name,
          genreId: artist.mainGenreId,
          seedIndex: existingAlbumsCount + i + 10
        });
        const album: Album = {
          id: albumId,
          title,
          artistId: artist.id,
          type: 'album',
          songIds: [],
          genreId: artist.mainGenreId,
          subGenreIds: artist.subGenreIds || [],
          releaseYear: year,
          releaseMonth: Math.floor(Math.random() * 11) + 1,
          totalStreams: Math.floor((artist.stats?.totalStreams ?? 100000) * 0.25 + 120000),
          firstWeekSales: Math.floor((artist.stats?.popularity ?? 20) * 800 + 4000),
          criticalScore: Math.min(100, Math.max(40, Math.floor(((artist.personality?.skill ?? 75) * 0.6) + ((artist.personality?.originality ?? 75) * 0.4)))),
          commercialScore: Math.min(100, Math.max(30, Math.floor(((artist.personality?.commercialAppeal ?? 75) * 0.6) + ((artist.stats?.popularity ?? 20) * 0.4)))),
          peakChartPosition: {
            Global: 12 + i * 4,
            Argentina: 6 + i * 2,
            USA: null,
            LatinAmerica: 10 + i * 3,
            Europe: null,
            Spain: null,
            Mexico: null
          },
          awards: [],
          coverGradient: gradients[i % gradients.length]
        };
        world.albums[albumId] = album;
      }
    }
  }

  /**
   * Conducts the annual awards gala, calculating nominations, winners, news, and stats updates.
   */
  public static conductAnnualAwards(
    world: WorldState,
    year: number
  ): ConductAnnualAwardsResult {
    const awardNews: Array<{ headline: string; body: string; relatedArtistId: string }> = [];
    const categories: AwardCategory[] = [];

    const activeArtists = Object.values(world.artists).filter(a => !a.isRetired);
    const activeNPCs = activeArtists.filter(a => !a.isPlayer);
    const player = Object.values(world.artists).find(a => a.isPlayer) || activeArtists[0];
    const playerId = player?.id || '';

    // Check player activity: must have at least 1 song or 1 album published
    const playerSongs = Object.values(world.songs).filter(s => s.artistId === playerId);
    const playerAlbums = Object.values(world.albums).filter(a => a.artistId === playerId);
    const isPlayerActive = playerSongs.length > 0 || playerAlbums.length > 0;

    // Ensure fallback catalogue so awards always evaluate real pieces
    AwardEngine.ensureCatalogueFallback(world, year);

    // Track normalized song titles across the entire gala to prevent collisions between categories
    const galaNominatedSongTitles = new Set<string>();

    let playerTotalNominations = 0;
    let playerTotalWins = 0;

    // ==========================================
    // 1. ARTISTA DEL AÑO
    // ==========================================
    // Rule: Active artists. If player has 0 songs & 0 albums, completely exclude player.
    // Anti-monopoly: Exactly NOMINEES_PER_CATEGORY (4), max 1 per artist.
    const eligibleArtistsForArtistOfYear = activeArtists.filter(artist => {
      if (artist.id === playerId && !isPlayerActive) return false;
      return true;
    });

    const artistScores = eligibleArtistsForArtistOfYear.map(artist => {
      const artistSongsInYear = Object.values(world.songs).filter(s => s.artistId === artist.id && s.releaseYear === year);
      const artistAlbumsInYear = Object.values(world.albums).filter(a => a.artistId === artist.id && a.releaseYear === year);

      const streamScore = Math.min(35, (artist.stats.totalStreams / 200000000) * 35);
      const popScore = artist.stats.popularity * 0.30;
      const prestigeScore = (artist.stats.artisticCredibility + artist.stats.reputation) * 0.15;
      const hypeScore = artist.stats.hype * 0.10;
      const activityBonus = (artistSongsInYear.length * 3) + (artistAlbumsInYear.length * 6);
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(streamScore + popScore + prestigeScore + hypeScore + activityBonus + randomVariance);

      return {
        artist,
        score: totalScore,
        highlightText: `${artist.stats.popularity} Pop • ${(artist.stats.monthlyListeners / 1000000).toFixed(1)}M oyentes • ${artist.careerStage}`
      };
    });

    artistScores.sort((a, b) => b.score - a.score);
    const topArtistCandidates = artistScores.slice(0, NOMINEES_PER_CATEGORY);

    const artistNominees: AwardNominee[] = topArtistCandidates.map(c => ({
      artistId: c.artist.id,
      artistName: c.artist.name,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.artist.id === playerId
    }));

    const winningArtistCandidate = topArtistCandidates[0] || { artist: activeArtists[0], score: 100, highlightText: '' };
    const winnerArtistId = winningArtistCandidate.artist.id;
    const winnerArtistName = winningArtistCandidate.artist.name;
    const isPlayerWinnerArtist = winnerArtistId === playerId;
    const isPlayerNominatedArtist = artistNominees.some(n => n.isPlayer);

    if (isPlayerNominatedArtist) playerTotalNominations++;
    if (isPlayerWinnerArtist) playerTotalWins++;

    categories.push({
      id: `award_artist_of_year_${year}`,
      name: 'Artista del Año',
      description: 'El máximo reconocimiento al artista con mayor impacto cultural, dominio comercial y excelencia musical del año.',
      iconName: 'Crown',
      nominees: artistNominees,
      nomineeArtistIds: artistNominees.map(n => n.artistId),
      winnerArtistId,
      winnerArtistName,
      winnerReason: `Por su consagración y arrollador dominio de la industria y la escena durante ${year}.`,
      playerWon: isPlayerWinnerArtist,
      playerNominated: isPlayerNominatedArtist
    });

    if (world.artists[winnerArtistId]) {
      world.artists[winnerArtistId].awardsWon.push(`Artista del Año (${year})`);
      world.artists[winnerArtistId].legacyScore = Math.min(100, world.artists[winnerArtistId].legacyScore + 5);
      if (isPlayerWinnerArtist) {
        world.artists[winnerArtistId].stats.hype = Math.min(100, world.artists[winnerArtistId].stats.hype + 30);
        world.artists[winnerArtistId].stats.reputation = Math.min(100, world.artists[winnerArtistId].stats.reputation + 8);
        world.artists[winnerArtistId].stats.artisticCredibility = Math.min(100, world.artists[winnerArtistId].stats.artisticCredibility + 6);
      }
      awardNews.push({
        headline: `Premios de la Música ${year}: ${winnerArtistName} es coronado Artista del Año`,
        body: `Una gala inolvidable donde la academia musical galardonó el trascendente año y dominio de ${winnerArtistName}.`,
        relatedArtistId: winnerArtistId
      });
    }

    // ==========================================
    // 2. CANCIÓN DEL AÑO
    // ==========================================
    // Rule: Real published songs. Prioritize current year, fallback cleanly.
    // Exclude player completely if !isPlayerActive.
    // Anti-monopoly: Exactly NOMINEES_PER_CATEGORY (4), max 1 song per artist.
    // Strict title deduplication: normalize and discard collisions.
    const allPublishedSongs = Object.values(world.songs).filter(s => {
      if (s.artistId === playerId && !isPlayerActive) return false;
      return true;
    });

    const songScores = allPublishedSongs.map(song => {
      const art = world.artists[song.artistId];
      const isSongInYear = song.releaseYear === year;
      const streamScore = Math.min(40, (song.streamsTotal / 40000000) * 40);
      const qualityScore = song.quality * 0.25;
      const commercialScore = song.commercialAppeal * 0.20;
      const chartBonus = song.peakPosition?.Global === 1 ? 12 : ((song.peakPosition?.Global ?? 99) <= 10 ? 6 : 0);
      const recBonus = (song.receptionRating || 3) * 3;
      const yearBonus = isSongInYear ? 15 : Math.max(0, 8 - (year - song.releaseYear) * 3);
      const viralBonus = song.wentViral ? 5 : 0;
      const classicBonus = song.isClassic ? 6 : 0;
      const videoBonus = song.musicVideo ? 4 : 0;
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(
        streamScore + qualityScore + commercialScore + chartBonus + recBonus + yearBonus + viralBonus + classicBonus + videoBonus + randomVariance
      );

      return {
        song,
        artist: art,
        score: totalScore,
        highlightText: `${(song.streamsTotal / 1000000).toFixed(1)}M streams • Calidad ${song.quality}/100 • Pico #${song.peakPosition?.Global || '-'}`
      };
    });

    songScores.sort((a, b) => b.score - a.score);

    const selectedSongCandidates: typeof songScores = [];
    const songNominatedArtists = new Set<string>();
    const songCategoryTitles = new Set<string>();

    for (const candidate of songScores) {
      if (selectedSongCandidates.length >= NOMINEES_PER_CATEGORY) break;

      const artistId = candidate.song.artistId;
      const normTitle = AwardEngine.normalizeTitle(candidate.song.title);

      // Anti-monopoly: max 1 song per artist
      if (songNominatedArtists.has(artistId)) continue;

      // Strict title deduplication: no duplicate song titles in category or gala
      if (songCategoryTitles.has(normTitle) || galaNominatedSongTitles.has(normTitle)) continue;

      selectedSongCandidates.push(candidate);
      songNominatedArtists.add(artistId);
      songCategoryTitles.add(normTitle);
      galaNominatedSongTitles.add(normTitle);
    }

    // Safety fallback to guarantee exactly NOMINEES_PER_CATEGORY (4) candidates
    if (selectedSongCandidates.length < NOMINEES_PER_CATEGORY) {
      const availableNPCs = activeNPCs.filter(a => !songNominatedArtists.has(a.id));
      for (let i = 0; i < availableNPCs.length && selectedSongCandidates.length < NOMINEES_PER_CATEGORY; i++) {
        const npc = availableNPCs[i];
        let fallbackTitle = generateSongTitle(selectedSongCandidates.length + i + 50, npc.mainGenreId);
        let norm = AwardEngine.normalizeTitle(fallbackTitle);
        while (songCategoryTitles.has(norm) || galaNominatedSongTitles.has(norm)) {
          fallbackTitle = `${fallbackTitle} Plus`;
          norm = AwardEngine.normalizeTitle(fallbackTitle);
        }
        const fallbackSongId = `song_award_fill_${year}_${npc.id}_${selectedSongCandidates.length}`;
        const fallbackSong: Song = {
          id: fallbackSongId,
          title: fallbackTitle,
          artistId: npc.id,
          featuredArtistIds: [],
          genreId: npc.mainGenreId,
          subGenreIds: npc.subGenreIds || [],
          releaseYear: year,
          releaseMonth: 6,
          quality: Math.min(100, Math.max(40, Math.floor(npc.personality.skill * 0.8 + 15))),
          commercialAppeal: Math.min(100, Math.max(40, Math.floor(npc.personality.commercialAppeal * 0.8 + 15))),
          originality: npc.personality.originality,
          hypeAtRelease: npc.stats.hype,
          streamsTotal: Math.floor(npc.stats.totalStreams * 0.1 + 80000),
          streamsLastMonth: Math.floor(npc.stats.monthlyListeners * 0.2),
          monthlyStreamsHistory: [],
          peakPosition: { Global: 15, Argentina: 10, USA: null, LatinAmerica: 12, Europe: null, Spain: null, Mexico: null },
          weeksOnChart: { Global: 6, Argentina: 8, USA: 0, LatinAmerica: 7, Europe: 0, Spain: 0, Mexico: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: false
        };
        world.songs[fallbackSongId] = fallbackSong;

        selectedSongCandidates.push({
          song: fallbackSong,
          artist: npc,
          score: 65 - selectedSongCandidates.length * 2,
          highlightText: `${(fallbackSong.streamsTotal / 1000000).toFixed(1)}M streams • Calidad ${fallbackSong.quality}/100`
        });
        songNominatedArtists.add(npc.id);
        songCategoryTitles.add(norm);
        galaNominatedSongTitles.add(norm);
      }
    }

    const songNominees: AwardNominee[] = selectedSongCandidates.map(c => ({
      artistId: c.song.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.song.id,
      itemTitle: c.song.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.song.artistId === playerId
    }));

    const winningSongCandidate = selectedSongCandidates[0];
    if (winningSongCandidate) {
      const winningSong = winningSongCandidate.song;
      const songArtist = world.artists[winningSong.artistId];
      const isPlayerSongWinner = winningSong.artistId === playerId;
      const isPlayerSongNominated = songNominees.some(n => n.isPlayer);

      if (isPlayerSongNominated) playerTotalNominations++;
      if (isPlayerSongWinner) playerTotalWins++;

      categories.push({
        id: `award_song_of_year_${year}`,
        name: 'Canción del Año',
        description: 'Premia la composición, calidad sonora y resonancia masiva del sencillo más destacado.',
        iconName: 'Disc3',
        nominees: songNominees,
        nomineeArtistIds: songNominees.map(n => n.artistId),
        nomineeItemIds: songNominees.map(n => n.itemId || ''),
        winnerArtistId: winningSong.artistId,
        winnerArtistName: songArtist?.name || 'Artista',
        winnerItemId: winningSong.id,
        winnerItemTitle: winningSong.title,
        winnerReason: `Por su brillante calidad de producción y alcance multitudinario con "${winningSong.title}".`,
        playerWon: isPlayerSongWinner,
        playerNominated: isPlayerSongNominated
      });

      if (songArtist) {
        songArtist.awardsWon.push(`Canción del Año: "${winningSong.title}" (${year})`);
        songArtist.legacyScore = Math.min(100, songArtist.legacyScore + 4);
        if (isPlayerSongWinner) {
          songArtist.stats.hype = Math.min(100, songArtist.stats.hype + 25);
          songArtist.stats.reputation = Math.min(100, songArtist.stats.reputation + 7);
        }
        awardNews.push({
          headline: `"${winningSong.title}" gana Canción del Año en los Premios Anuales ${year}`,
          body: `El tema de ${songArtist.name} fue galardonado por unanimidad como la pieza musical definitiva de la temporada.`,
          relatedArtistId: winningSong.artistId
        });
      }
    }

    // ==========================================
    // 3. ÁLBUM DEL AÑO
    // ==========================================
    // Rule: Real published albums. Prioritize current year, fallback cleanly.
    // Exclude player completely if !isPlayerActive.
    // Anti-monopoly: Exactly NOMINEES_PER_CATEGORY (4), max 1 album per artist.
    // Strict title deduplication: normalize and discard collisions.
    const allPublishedAlbums = Object.values(world.albums).filter(a => {
      if (a.artistId === playerId && !isPlayerActive) return false;
      return true;
    });

    const albumScores = allPublishedAlbums.map(album => {
      const art = world.artists[album.artistId];
      const isAlbumInYear = album.releaseYear === year;
      const critScore = album.criticalScore * 0.40;
      const commScore = album.commercialScore * 0.25;
      const salesScore = Math.min(20, (album.firstWeekSales / 30000) * 20);
      const streamScore = Math.min(15, (album.totalStreams / 50000000) * 15);
      const yearBonus = isAlbumInYear ? 15 : Math.max(0, 8 - (year - album.releaseYear) * 3);
      const trackCountBonus = Math.min(5, (album.songIds?.length || 8) * 0.5);
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(
        critScore + commScore + salesScore + streamScore + yearBonus + trackCountBonus + randomVariance
      );

      return {
        album,
        artist: art,
        score: totalScore,
        highlightText: `Crítica ${album.criticalScore}/100 • ${album.firstWeekSales.toLocaleString()} ventas debut • ${album.songIds?.length || 0} tracks`
      };
    });

    albumScores.sort((a, b) => b.score - a.score);

    const selectedAlbumCandidates: typeof albumScores = [];
    const albumNominatedArtists = new Set<string>();
    const albumCategoryTitles = new Set<string>();

    for (const candidate of albumScores) {
      if (selectedAlbumCandidates.length >= NOMINEES_PER_CATEGORY) break;

      const artistId = candidate.album.artistId;
      const normTitle = AwardEngine.normalizeTitle(candidate.album.title);

      // Anti-monopoly: max 1 album per artist
      if (albumNominatedArtists.has(artistId)) continue;

      // Strict title deduplication
      if (albumCategoryTitles.has(normTitle)) continue;

      selectedAlbumCandidates.push(candidate);
      albumNominatedArtists.add(artistId);
      albumCategoryTitles.add(normTitle);
    }

    // Safety fallback to guarantee exactly NOMINEES_PER_CATEGORY (4) candidates
    if (selectedAlbumCandidates.length < NOMINEES_PER_CATEGORY) {
      const availableNPCs = activeNPCs.filter(a => !albumNominatedArtists.has(a.id));
      for (let i = 0; i < availableNPCs.length && selectedAlbumCandidates.length < NOMINEES_PER_CATEGORY; i++) {
        const npc = availableNPCs[i];
        let fallbackTitle = generateAlbumTitle(selectedAlbumCandidates.length + i + 60);
        let norm = AwardEngine.normalizeTitle(fallbackTitle);
        while (albumCategoryTitles.has(norm)) {
          fallbackTitle = `${fallbackTitle} Deluxe`;
          norm = AwardEngine.normalizeTitle(fallbackTitle);
        }
        const fallbackAlbumId = `album_award_fill_${year}_${npc.id}_${selectedAlbumCandidates.length}`;
        const fallbackAlbum: Album = {
          id: fallbackAlbumId,
          title: fallbackTitle,
          artistId: npc.id,
          type: 'album',
          songIds: [],
          genreId: npc.mainGenreId,
          subGenreIds: npc.subGenreIds || [],
          releaseYear: year,
          releaseMonth: 5,
          totalStreams: Math.floor(npc.stats.totalStreams * 0.2 + 150000),
          firstWeekSales: Math.floor(npc.stats.popularity * 600 + 5000),
          criticalScore: Math.min(100, Math.max(50, Math.floor(npc.personality.skill * 0.7 + 20))),
          commercialScore: Math.min(100, Math.max(40, Math.floor(npc.personality.commercialAppeal * 0.7 + 20))),
          peakChartPosition: { Global: 14, Argentina: 8, USA: null, LatinAmerica: 11, Europe: null, Spain: null, Mexico: null },
          awards: [],
          coverGradient: 'from-purple-900 via-indigo-950 to-black'
        };
        world.albums[fallbackAlbumId] = fallbackAlbum;

        selectedAlbumCandidates.push({
          album: fallbackAlbum,
          artist: npc,
          score: 60 - selectedAlbumCandidates.length * 2,
          highlightText: `Crítica ${fallbackAlbum.criticalScore}/100 • ${fallbackAlbum.firstWeekSales.toLocaleString()} ventas`
        });
        albumNominatedArtists.add(npc.id);
        albumCategoryTitles.add(norm);
      }
    }

    const albumNominees: AwardNominee[] = selectedAlbumCandidates.map(c => ({
      artistId: c.album.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.album.id,
      itemTitle: c.album.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.album.artistId === playerId
    }));

    const winningAlbumCandidate = selectedAlbumCandidates[0];
    if (winningAlbumCandidate) {
      const winningAlbum = winningAlbumCandidate.album;
      const albumArtist = world.artists[winningAlbum.artistId];
      const isPlayerAlbumWinner = winningAlbum.artistId === playerId;
      const isPlayerAlbumNominated = albumNominees.some(n => n.isPlayer);

      if (isPlayerAlbumNominated) playerTotalNominations++;
      if (isPlayerAlbumWinner) playerTotalWins++;

      categories.push({
        id: `award_album_of_year_${year}`,
        name: 'Álbum del Año',
        description: 'La estatuilla más prestigiosa para la obra discográfica completa más cohesiva, aclamada y trascendente.',
        iconName: 'Trophy',
        nominees: albumNominees,
        nomineeArtistIds: albumNominees.map(n => n.artistId),
        nomineeItemIds: albumNominees.map(n => n.itemId || ''),
        winnerArtistId: winningAlbum.artistId,
        winnerArtistName: albumArtist?.name || 'Artista',
        winnerItemId: winningAlbum.id,
        winnerItemTitle: winningAlbum.title,
        winnerReason: `Por su maestría conceptual, narrativa y solidez musical en "${winningAlbum.title}".`,
        playerWon: isPlayerAlbumWinner,
        playerNominated: isPlayerAlbumNominated
      });

      if (albumArtist) {
        albumArtist.awardsWon.push(`Álbum del Año: "${winningAlbum.title}" (${year})`);
        albumArtist.legacyScore = Math.min(100, albumArtist.legacyScore + 5);
        if (isPlayerAlbumWinner) {
          albumArtist.stats.hype = Math.min(100, albumArtist.stats.hype + 35);
          albumArtist.stats.artisticCredibility = Math.min(100, albumArtist.stats.artisticCredibility + 10);
          albumArtist.stats.reputation = Math.min(100, albumArtist.stats.reputation + 8);
        }
        awardNews.push({
          headline: `"${winningAlbum.title}" de ${albumArtist.name} se alza con el Álbum del Año (${year})`,
          body: `Una obra cumbre que conquistó a la crítica especializada y acumuló millones de oyentes.`,
          relatedArtistId: winningAlbum.artistId
        });
      }
    }

    // ==========================================
    // 4. MEJOR NUEVO ARTISTA (Breakout / Emerging)
    // ==========================================
    // Specific Eligibility Requirements:
    // 1. Must have released at least 1 single/album in the year or debut/career.
    // 2. Minimum of 1,000 total streams.
    // 3. Minimum reputation or popularity >= 5.
    // 4. Exclude player completely if !isPlayerActive.
    // 5. Exclude retired artists.
    // Anti-monopoly: Exactly NOMINEES_PER_CATEGORY (4), max 1 per artist.
    const meetsBaseEligibility = (artist: Artist): boolean => {
      if (artist.isRetired) return false;
      if (artist.id === playerId && !isPlayerActive) return false;

      const songsCount = Object.values(world.songs).filter(s => s.artistId === artist.id).length;
      const albumsCount = Object.values(world.albums).filter(a => a.artistId === artist.id).length;
      const hasReleases = (songsCount > 0 || albumsCount > 0);
      if (!hasReleases) return false;

      if ((artist.stats.totalStreams || 0) < 1000) return false;
      if ((artist.stats.popularity || 0) < 5 && (artist.stats.reputation || 0) < 5) return false;

      // Best New Artist is strictly for newcomers (careerStartYear within 4 years OR Emerging/Underground/Breakout stage)
      const careerLength = year - artist.careerStartYear;
      const isNewcomer = careerLength <= 4 || ['Underground', 'Emerging', 'Breakout'].includes(artist.careerStage);
      if (!isNewcomer && !artist.isPlayer) return false;

      return true;
    };

    const baseEligibleNewArtists = activeArtists.filter(meetsBaseEligibility);
    const newArtistCandidatesMap = new Map<string, Artist>();

    // Priority 1: Fresh debut (within 2 years)
    baseEligibleNewArtists
      .filter(a => (year - a.careerStartYear) <= 2)
      .forEach(a => newArtistCandidatesMap.set(a.id, a));

    // Priority 2: Debut within 3 years
    if (newArtistCandidatesMap.size < NOMINEES_PER_CATEGORY) {
      baseEligibleNewArtists
        .filter(a => (year - a.careerStartYear) <= 3)
        .forEach(a => newArtistCandidatesMap.set(a.id, a));
    }

    // Priority 3: Underground, Emerging or Breakout stages
    if (newArtistCandidatesMap.size < NOMINEES_PER_CATEGORY) {
      baseEligibleNewArtists
        .filter(a => a.careerStage === 'Underground' || a.careerStage === 'Emerging' || a.careerStage === 'Breakout')
        .forEach(a => newArtistCandidatesMap.set(a.id, a));
    }

    // Priority 4: Debut within 4 years
    if (newArtistCandidatesMap.size < NOMINEES_PER_CATEGORY) {
      baseEligibleNewArtists
        .filter(a => (year - a.careerStartYear) <= 4)
        .forEach(a => newArtistCandidatesMap.set(a.id, a));
    }

    // Priority 5: Any base eligible newcomer
    if (newArtistCandidatesMap.size < NOMINEES_PER_CATEGORY) {
      baseEligibleNewArtists.forEach(a => newArtistCandidatesMap.set(a.id, a));
    }

    // Safety fallback: qualify active NPCs if still under 4
    if (newArtistCandidatesMap.size < NOMINEES_PER_CATEGORY) {
      const remainingNPCs = activeNPCs.filter(a => !newArtistCandidatesMap.has(a.id));
      for (const npc of remainingNPCs) {
        if (newArtistCandidatesMap.size >= NOMINEES_PER_CATEGORY) break;
        const npcSongs = Object.values(world.songs).filter(s => s.artistId === npc.id);
        if (npcSongs.length === 0) {
          const songId = `song_award_npc_qualify_${year}_${npc.id}`;
          world.songs[songId] = {
            id: songId,
            title: generateSongTitle(Object.keys(world.songs).length + 10, npc.mainGenreId),
            artistId: npc.id,
            featuredArtistIds: [],
            genreId: npc.mainGenreId,
            subGenreIds: npc.subGenreIds || [],
            releaseYear: year,
            releaseMonth: 3,
            quality: 70,
            commercialAppeal: 70,
            originality: 70,
            hypeAtRelease: npc.stats.hype,
            streamsTotal: 30000,
            streamsLastMonth: 5000,
            monthlyStreamsHistory: [],
            peakPosition: { Global: 25, Argentina: 15, USA: null, LatinAmerica: 20, Europe: null, Spain: null, Mexico: null },
            weeksOnChart: { Global: 4, Argentina: 5, USA: 0, LatinAmerica: 4, Europe: 0, Spain: 0, Mexico: 0 },
            longevityCurve: 'steady',
            isSingle: true,
            receptionRating: 4,
            isClassic: false,
            wentViral: false
          };
        }
        newArtistCandidatesMap.set(npc.id, npc);
      }
    }

    const newArtistCandidates = Array.from(newArtistCandidatesMap.values());

    const newScores = newArtistCandidates.map(artist => {
      const artistSongsInYear = Object.values(world.songs).filter(s => s.artistId === artist.id && s.releaseYear === year);
      const artistAlbumsInYear = Object.values(world.albums).filter(a => a.artistId === artist.id && a.releaseYear === year);
      const activityInYearBonus = (artistSongsInYear.length > 0 || artistAlbumsInYear.length > 0) ? 25 : 0;
      const debutYears = year - artist.careerStartYear;
      const debutFreshnessBonus = debutYears <= 0 ? 30 : debutYears === 1 ? 20 : debutYears === 2 ? 15 : 0;

      const popScore = Math.min(25, (artist.stats.popularity || 0) * 0.25);
      const hypeScore = Math.min(20, (artist.stats.hype || 0) * 0.20);
      const skillScore = (artist.personality.skill || 70) * 0.25;
      const credScore = (artist.stats.artisticCredibility || 0) * 0.15;
      const repScore = (artist.stats.reputation || 0) * 0.15;
      const streamScore = Math.min(15, ((artist.stats.totalStreams || 0) / 1000000) * 15);
      const prodigyBonus = artist.isProdigy ? 8 : 0;
      const randomVariance = Math.random() * 3;

      const totalScore = Math.round(
        popScore + hypeScore + skillScore + credScore + repScore + streamScore + prodigyBonus + activityInYearBonus + debutFreshnessBonus + randomVariance
      );

      return {
        artist,
        score: totalScore,
        highlightText: `Debut ${artist.careerStartYear} • Pop ${artist.stats.popularity} • ${(artist.stats.monthlyListeners / 1000).toFixed(0)}k oyentes`
      };
    });

    newScores.sort((a, b) => b.score - a.score);
    const topNewCandidates = newScores.slice(0, NOMINEES_PER_CATEGORY);

    const newNominees: AwardNominee[] = topNewCandidates.map(c => ({
      artistId: c.artist.id,
      artistName: c.artist.name,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.artist.id === playerId
    }));

    const winningNewCandidate = topNewCandidates[0] || { artist: activeArtists[0], score: 100, highlightText: '' };
    const winnerNewId = winningNewCandidate.artist.id;
    const winnerNewName = winningNewCandidate.artist.name;
    const isPlayerNewWinner = winnerNewId === playerId;
    const isPlayerNewNominated = newNominees.some(n => n.isPlayer);

    if (isPlayerNewNominated) playerTotalNominations++;
    if (isPlayerNewWinner) playerTotalWins++;

    categories.push({
      id: `award_best_new_artist_${year}`,
      name: 'Mejor Nuevo Artista',
      description: 'El galardón a la revelación más prometedora y de mayor impacto que irrumpió en la escena.',
      iconName: 'Sparkles',
      nominees: newNominees,
      nomineeArtistIds: newNominees.map(n => n.artistId),
      winnerArtistId: winnerNewId,
      winnerArtistName: winnerNewName,
      winnerReason: `Por su vertiginosa irrupción y aporte de aire fresco al panorama musical.`,
      playerWon: isPlayerNewWinner,
      playerNominated: isPlayerNewNominated
    });

    if (world.artists[winnerNewId]) {
      world.artists[winnerNewId].awardsWon.push(`Mejor Nuevo Artista (${year})`);
      world.artists[winnerNewId].legacyScore = Math.min(100, world.artists[winnerNewId].legacyScore + 4);
      if (isPlayerNewWinner) {
        world.artists[winnerNewId].stats.hype = Math.min(100, world.artists[winnerNewId].stats.hype + 30);
        world.artists[winnerNewId].stats.reputation = Math.min(100, world.artists[winnerNewId].stats.reputation + 10);
      }
      awardNews.push({
        headline: `${winnerNewName} gana el galardón a Mejor Nuevo Artista / Revelación (${year})`,
        body: `El reconocimiento unánime de la industria a la nueva gran promesa de la música contemporánea.`,
        relatedArtistId: winnerNewId
      });
    }

    // ==========================================
    // 5. MEJOR PRODUCCIÓN
    // ==========================================
    // Rule: Real published songs and albums. Prioritize current year, fallback cleanly.
    // Exclude player completely if !isPlayerActive.
    // Anti-monopoly: Exactly NOMINEES_PER_CATEGORY (4), max 2 items per artist or producer.
    // Strict title deduplication: normalize and discard collisions.
    const prodItems: Array<Song | Album> = [
      ...allPublishedSongs,
      ...allPublishedAlbums
    ];

    const productionScores = prodItems.map(item => {
      const isSong = 'quality' in item;
      const songItem = isSong ? (item as Song) : null;
      const albumItem = !isSong ? (item as Album) : null;
      const art = world.artists[item.artistId];

      const producerId = songItem?.producerId || albumItem?.producerId;
      const producer = producerId ? world.producers[producerId] : undefined;
      const producerName = producer ? producer.name : (art ? `Producción de ${art.name}` : 'Producción Independiente');

      const qualityVal = songItem ? songItem.quality : (albumItem ? albumItem.criticalScore : 70);
      const originalityVal = songItem ? songItem.originality : (albumItem ? albumItem.commercialScore * 0.8 : 70);
      const producerBoost = producer ? producer.qualityBoost * 2 + producer.reputation * 0.15 : 10;
      const budgetVal = albumItem?.productionBudget
        ? Math.min(15, (albumItem.productionBudget / 10000) * 15)
        : (songItem?.musicVideo?.budget ? Math.min(12, (songItem.musicVideo.budget / 10000) * 12) : 8);
      const yearBonus = item.releaseYear === year ? 10 : Math.max(0, 6 - (year - item.releaseYear) * 2);
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(
        qualityVal * 0.40 + originalityVal * 0.20 + producerBoost + budgetVal + yearBonus + randomVariance
      );

      return {
        item,
        isSong,
        title: item.title,
        artist: art,
        producerId,
        producerName,
        score: totalScore,
        highlightText: `Productor: ${producerName} • Calidad de Mezcla: ${qualityVal}/100`
      };
    });

    productionScores.sort((a, b) => b.score - a.score);

    const selectedProdCandidates: typeof productionScores = [];
    const prodArtistCounts = new Map<string, number>();
    const prodProducerCounts = new Map<string, number>();
    const prodCategoryTitles = new Set<string>();

    for (const candidate of productionScores) {
      if (selectedProdCandidates.length >= NOMINEES_PER_CATEGORY) break;

      const artistId = candidate.item.artistId;
      const producerId = candidate.producerId;
      const normTitle = AwardEngine.normalizeTitle(candidate.title);

      // Strict title deduplication
      if (prodCategoryTitles.has(normTitle)) continue;

      // Anti-monopoly: max 2 items per artist
      const currentArtistCount = prodArtistCounts.get(artistId) || 0;
      if (currentArtistCount >= 2) continue;

      // Anti-monopoly: max 2 items per producer (if producer is specified)
      if (producerId) {
        const currentProdCount = prodProducerCounts.get(producerId) || 0;
        if (currentProdCount >= 2) continue;
      }

      selectedProdCandidates.push(candidate);
      prodArtistCounts.set(artistId, currentArtistCount + 1);
      if (producerId) {
        prodProducerCounts.set(producerId, (prodProducerCounts.get(producerId) || 0) + 1);
      }
      prodCategoryTitles.add(normTitle);
    }

    // Safety fallback to guarantee exactly NOMINEES_PER_CATEGORY (4) candidates
    if (selectedProdCandidates.length < NOMINEES_PER_CATEGORY) {
      const availableNPCs = activeNPCs.filter(a => (prodArtistCounts.get(a.id) || 0) < 2);
      for (let i = 0; i < availableNPCs.length && selectedProdCandidates.length < NOMINEES_PER_CATEGORY; i++) {
        const npc = availableNPCs[i];
        let fallbackTitle = `Master Mix - ${npc.name} Vol. ${i + 1}`;
        let norm = AwardEngine.normalizeTitle(fallbackTitle);
        while (prodCategoryTitles.has(norm)) {
          fallbackTitle = `${fallbackTitle} Remaster`;
          norm = AwardEngine.normalizeTitle(fallbackTitle);
        }
        const fallbackSongId = `song_prod_fill_${year}_${npc.id}_${selectedProdCandidates.length}`;
        const fallbackSong: Song = {
          id: fallbackSongId,
          title: fallbackTitle,
          artistId: npc.id,
          featuredArtistIds: [],
          genreId: npc.mainGenreId,
          subGenreIds: npc.subGenreIds || [],
          releaseYear: year,
          releaseMonth: 7,
          quality: 85,
          commercialAppeal: 75,
          originality: 80,
          hypeAtRelease: npc.stats.hype,
          streamsTotal: 100000,
          streamsLastMonth: 15000,
          monthlyStreamsHistory: [],
          peakPosition: { Global: 20, Argentina: 12, USA: null, LatinAmerica: 16, Europe: null, Spain: null, Mexico: null },
          weeksOnChart: { Global: 5, Argentina: 6, USA: 0, LatinAmerica: 5, Europe: 0, Spain: 0, Mexico: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: false
        };
        world.songs[fallbackSongId] = fallbackSong;

        selectedProdCandidates.push({
          item: fallbackSong,
          isSong: true,
          title: fallbackTitle,
          artist: npc,
          producerId: undefined,
          producerName: `Producción de ${npc.name}`,
          score: 65 - selectedProdCandidates.length * 2,
          highlightText: `Productor: Producción de ${npc.name} • Calidad de Mezcla: 85/100`
        });
        prodArtistCounts.set(npc.id, (prodArtistCounts.get(npc.id) || 0) + 1);
        prodCategoryTitles.add(norm);
      }
    }

    const prodNominees: AwardNominee[] = selectedProdCandidates.map(c => ({
      artistId: c.item.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.item.id,
      itemTitle: c.title,
      producerId: c.producerId,
      producerName: c.producerName,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.item.artistId === playerId
    }));

    const winningProdCandidate = selectedProdCandidates[0];
    if (winningProdCandidate) {
      const winningItem = winningProdCandidate.item;
      const prodArtist = world.artists[winningItem.artistId];
      const isPlayerProdWinner = winningItem.artistId === playerId;
      const isPlayerProdNominated = prodNominees.some(n => n.isPlayer);

      if (isPlayerProdNominated) playerTotalNominations++;
      if (isPlayerProdWinner) playerTotalWins++;

      categories.push({
        id: `award_best_production_${year}`,
        name: 'Mejor Producción',
        description: 'Premia la sofisticación del diseño sonoro, mezcla, ingeniería acústica y brillantez en la producción.',
        iconName: 'Sliders',
        nominees: prodNominees,
        nomineeArtistIds: prodNominees.map(n => n.artistId),
        nomineeItemIds: prodNominees.map(n => n.itemId || ''),
        winnerArtistId: winningItem.artistId,
        winnerArtistName: prodArtist?.name || 'Artista',
        winnerItemId: winningItem.id,
        winnerItemTitle: winningProdCandidate.title,
        winnerProducerId: winningProdCandidate.producerId,
        winnerProducerName: winningProdCandidate.producerName,
        winnerReason: `Por el impecable trabajo de audio, vanguardia sonora e ingeniería en "${winningProdCandidate.title}".`,
        playerWon: isPlayerProdWinner,
        playerNominated: isPlayerProdNominated
      });

      if (prodArtist) {
        prodArtist.awardsWon.push(`Mejor Producción: "${winningProdCandidate.title}" (${year})`);
        prodArtist.legacyScore = Math.min(100, prodArtist.legacyScore + 4);
        if (isPlayerProdWinner) {
          prodArtist.stats.artisticCredibility = Math.min(100, prodArtist.stats.artisticCredibility + 12);
          prodArtist.stats.reputation = Math.min(100, prodArtist.stats.reputation + 6);
        }
        awardNews.push({
          headline: `Premio a la Mejor Producción (${year}): "${winningProdCandidate.title}" de ${prodArtist.name}`,
          body: `Elogiada por ingenieros y productores como el estándar de oro en calidad de audio y mezcla del año.`,
          relatedArtistId: winningItem.artistId
        });
      }
    }

    const ceremony: AwardCeremony = {
      year,
      name: `Gala Anual de Premios de la Música ${year}`,
      theme: 'Celebrando la excelencia, la trascendencia sonora y el talento de la escena',
      categories,
      playerNominationsCount: playerTotalNominations,
      playerWinsCount: playerTotalWins
    };

    return {
      ceremony,
      awardNews,
      playerWonAny: playerTotalWins > 0
    };
  }
}

