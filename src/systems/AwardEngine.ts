import {
  Artist,
  Song,
  Album,
  AwardCeremony,
  AwardCategory,
  AwardNominee,
  AwardWinRecord,
  CriticReviewSnippet,
  WorldState
} from '../types';
import {
  generateSongTitle,
  generateAlbumTitle,
  generateUniqueSongTitle,
  generateUniqueAlbumTitle,
  normalizeTitle
} from '../data/proceduralNames';

/**
 * Constant: Exactly 4 nominees per category across all award categories
 */
export const NOMINEES_PER_CATEGORY = 4;

export interface ConductAnnualAwardsResult {
  ceremony: AwardCeremony;
  awardNews: Array<{ headline: string; body: string; relatedArtistId: string }>;
  playerWonAny: boolean;
}

const CRITIC_MEDIA_OUTLETS = [
  'Rolling Stone',
  'Pitchfork',
  'Billboard',
  'Indie Hoy',
  'NME',
  'The Fader',
  'Stereogum',
  'Mondo Sonoro'
];

export class AwardEngine {
  /**
   * Normalizes title string for strict duplicate collision detection across categories and gala.
   * Strips accents, punctuation, and whitespace, converting to lowercase alphanumeric.
   */
  public static normalizeTitle(title: string): string {
    return normalizeTitle(title);
  }

  /**
   * Generates a procedural yet credible critic review snippet for a nominee.
   */
  private static generateCriticQuote(
    artistName: string,
    itemTitle?: string,
    score: number = 80,
    seed: number = 0
  ): CriticReviewSnippet {
    const media = CRITIC_MEDIA_OUTLETS[(seed + Math.floor(score)) % CRITIC_MEDIA_OUTLETS.length];
    const quotesHigh = [
      `"${itemTitle ? itemTitle : artistName}" representa una cima creativa indiscutible que redefine los límites estéticos del año.`,
      `Una obra maestra de vanguardia donde ${artistName} demuestra un dominio sonoro y una audacia compositiva sin igual.`,
      `El pulso definitivo de la temporada. Letra impecable, ejecución arrolladora y resonancia cultural unánime.`,
      `Fascinante de principio a fin; ${artistName} logra conectar la aclamación crítica con una respuesta masiva del público.`
    ];
    const quotesMid = [
      `Una propuesta sumamente sólida y fresca que consolida a ${artistName} entre lo más destacado de la escena actual.`,
      `Con "${itemTitle ? itemTitle : artistName}", la producción brilla por su solidez, ritmo hipnótico y carisma interpretativo.`,
      `Un trabajo con identidad marcada que merecidamente entra en la conversación de las grandes obras de este año.`,
      `Gran ejecución musical y una identidad sonora bien definida que sostiene altas cuotas de originalidad.`
    ];

    const quotes = score >= 85 ? quotesHigh : quotesMid;
    const text = quotes[(seed * 7) % quotes.length];

    return {
      media,
      text,
      sentiment: score >= 85 ? 'rave' : 'positive'
    };
  }

  /**
   * Assigns betting/academy expectation odds to nominees based on relative scores.
   */
  private static assignNomineeOdds(nominees: AwardNominee[]): void {
    if (nominees.length === 0) return;
    const sorted = [...nominees].sort((a, b) => b.score - a.score);
    const oddsTiers: Array<AwardNominee['odds']> = ['favorite', 'contender', 'dark_horse', 'underdog'];
    const pctMap = [45, 30, 15, 10];

    sorted.forEach((nom, idx) => {
      nom.odds = oddsTiers[Math.min(idx, oddsTiers.length - 1)];
      nom.expectationPct = pctMap[Math.min(idx, pctMap.length - 1)] || 10;
    });
  }

  /**
   * Evaluates score delta between the winner and runner-up to classify the win.
   */
  private static classifyWin(
    winnerScore: number,
    runnerUpScore: number,
    winnerHasHighCrit: boolean
  ): { winType: 'unanimous' | 'tight' | 'upset'; winTypeLabel: string } {
    const gap = winnerScore - runnerUpScore;
    if (winnerHasHighCrit && gap < 0) {
      return { winType: 'upset', winTypeLabel: '¡Batacazo de la Noche!' };
    }
    if (gap >= 12) {
      return { winType: 'unanimous', winTypeLabel: 'Victoria Esperada' };
    }
    if (gap <= 4) {
      return { winType: 'tight', winTypeLabel: 'Victoria Reñida' };
    }
    return { winType: 'unanimous', winTypeLabel: 'Victoria Consensuada' };
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
    if (existingSongsCount < NOMINEES_PER_CATEGORY * 2) {
      const needed = NOMINEES_PER_CATEGORY * 2 - existingSongsCount;
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
          featuredArtistIds: i % 3 === 0 ? [activeNPCs[(i + 1) % activeNPCs.length].id] : [],
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
            Mexico: null,
            UK: null,
            Brazil: null,
            Asia: null,
            Africa: null
          },
          weeksOnChart: { Global: 8, Argentina: 10, USA: 0, LatinAmerica: 9, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
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
            Mexico: null,
            UK: null,
            Brazil: null,
            Asia: null,
            Africa: null
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

    // Eligibility period text
    const eligibilityPeriod = `Temporada ${year} (1 de Enero - 31 de Diciembre)`;

    // ==========================================
    // 1. ÁLBUM DEL AÑO (Album of the Year)
    // ==========================================
    // General Field: Cohesive complete work, critical acclaim, sales, streams, concept.
    // Anti-monopoly: max 1 album per artist.
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
        highlightText: `Crítica ${album.criticalScore}/100 • ${album.firstWeekSales.toLocaleString()} ventas debut • ${album.songIds?.length || 0} tracks`,
        nominationReason: `Por la solidez narrativa, maestría sonora y aclamación unánime de su propuesta en "${album.title}".`
      };
    });

    albumScores.sort((a, b) => b.score - a.score);

    // Anti-monopoly: Select only the best candidate per artist
    const selectedAlbumCandidates: typeof albumScores = [];
    const albumNominatedArtists = new Set<string>();
    const albumCategoryTitles = new Set<string>();

    for (const candidate of albumScores) {
      if (selectedAlbumCandidates.length >= NOMINEES_PER_CATEGORY) break;
      const artistId = candidate.album.artistId;
      const normTitle = AwardEngine.normalizeTitle(candidate.album.title);

      if (albumNominatedArtists.has(artistId)) continue;
      if (albumCategoryTitles.has(normTitle)) continue;

      selectedAlbumCandidates.push(candidate);
      albumNominatedArtists.add(artistId);
      albumCategoryTitles.add(normTitle);
    }

    // Safety fallback to guarantee exactly 4
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
          peakChartPosition: { Global: 14, Argentina: 8, USA: null, LatinAmerica: 11, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
          awards: [],
          coverGradient: 'from-purple-900 via-indigo-950 to-black'
        };
        world.albums[fallbackAlbumId] = fallbackAlbum;

        selectedAlbumCandidates.push({
          album: fallbackAlbum,
          artist: npc,
          score: 60 - selectedAlbumCandidates.length * 2,
          highlightText: `Crítica ${fallbackAlbum.criticalScore}/100 • ${fallbackAlbum.firstWeekSales.toLocaleString()} ventas`,
          nominationReason: `Por su distinguida visión musical y calidad de producción en "${fallbackTitle}".`
        });
        albumNominatedArtists.add(npc.id);
        albumCategoryTitles.add(norm);
      }
    }

    const albumNominees: AwardNominee[] = selectedAlbumCandidates.map((c, idx) => ({
      artistId: c.album.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.album.id,
      itemTitle: c.album.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.album.artistId === playerId,
      coverGradient: c.album.coverGradient,
      nominationReason: c.nominationReason,
      criticQuote: AwardEngine.generateCriticQuote(c.artist?.name || 'Artista', c.album.title, c.score, idx + 1)
    }));

    AwardEngine.assignNomineeOdds(albumNominees);

    // Vote determination: weighted merit + simulated academy taste
    const sortedAlbumCandidates = [...selectedAlbumCandidates].sort((a, b) => {
      const tasteA = (a.album.criticalScore * 0.7) + (a.score * 0.3) + (Math.random() * 6);
      const tasteB = (b.album.criticalScore * 0.7) + (b.score * 0.3) + (Math.random() * 6);
      return tasteB - tasteA;
    });

    const winningAlbumCandidate = sortedAlbumCandidates[0] || selectedAlbumCandidates[0];
    const winningAlbum = winningAlbumCandidate.album;
    const albumArtist = world.artists[winningAlbum.artistId];
    const isPlayerAlbumWinner = winningAlbum.artistId === playerId;
    const isPlayerAlbumNominated = albumNominees.some(n => n.isPlayer);

    if (isPlayerAlbumNominated) playerTotalNominations++;
    if (isPlayerAlbumWinner) playerTotalWins++;

    const runnerUpAlbum = sortedAlbumCandidates[1];
    const winClsAlbum = AwardEngine.classifyWin(
      winningAlbumCandidate.score,
      runnerUpAlbum ? runnerUpAlbum.score : winningAlbumCandidate.score - 10,
      winningAlbum.criticalScore >= 90
    );

    const playerAlbumRank = albumScores.findIndex(c => c.album.artistId === playerId);
    const playerNomStatusAlbum = {
      isNominated: isPlayerAlbumNominated,
      rankAmongCandidates: playerAlbumRank >= 0 ? playerAlbumRank + 1 : undefined,
      reason: isPlayerAlbumNominated
        ? 'Nominado por la sobresaliente recepción comercial y crítica de tu álbum.'
        : playerAlbums.length === 0
        ? 'Sin álbumes elegibles publicados durante el ciclo.'
        : `Quedaste en la posición #${playerAlbumRank + 1} de preselección de la academia musical.`
    };

    categories.push({
      id: `award_album_of_year_${year}`,
      name: 'Álbum del Año',
      description: 'El galardón supremo a la obra discográfica completa más cohesiva, aclamada y trascendente de la temporada.',
      iconName: 'Trophy',
      field: 'general',
      eligibilityPeriod,
      nominees: albumNominees,
      nomineeArtistIds: albumNominees.map(n => n.artistId),
      nomineeItemIds: albumNominees.map(n => n.itemId || ''),
      winnerArtistId: winningAlbum.artistId,
      winnerArtistName: albumArtist?.name || 'Artista',
      winnerItemId: winningAlbum.id,
      winnerItemTitle: winningAlbum.title,
      winType: winClsAlbum.winType,
      winTypeLabel: winClsAlbum.winTypeLabel,
      winnerReason: `Por su maestría conceptual, narrativa y solidez musical irreprochable en "${winningAlbum.title}".`,
      deliberationNotes: 'La academia reconoció la profundidad lírica y la arquitectura sonora del proyecto por sobre los sencillos aislados.',
      playerWon: isPlayerAlbumWinner,
      playerNominated: isPlayerAlbumNominated,
      playerNominationStatus: playerNomStatusAlbum
    });

    if (albumArtist) {
      albumArtist.awardsWon.push(`Álbum del Año: "${winningAlbum.title}" (${year})`);
      if (!albumArtist.awardsRecord) albumArtist.awardsRecord = [];
      albumArtist.awardsRecord.push({
        id: `win_album_${year}_${winningAlbum.id}`,
        ceremonyName: `Premios de la Música ${year}`,
        categoryId: `award_album_of_year_${year}`,
        categoryName: 'Álbum del Año',
        year,
        itemId: winningAlbum.id,
        itemTitle: winningAlbum.title,
        itemType: 'album',
        winType: winClsAlbum.winType,
        reason: `Por su maestría conceptual en "${winningAlbum.title}".`
      });
      albumArtist.legacyScore = Math.min(100, albumArtist.legacyScore + 6);
      if (isPlayerAlbumWinner) {
        albumArtist.stats.hype = Math.min(100, albumArtist.stats.hype + 35);
        albumArtist.stats.artisticCredibility = Math.min(100, albumArtist.stats.artisticCredibility + 12);
        albumArtist.stats.reputation = Math.min(100, albumArtist.stats.reputation + 10);
      }
      awardNews.push({
        headline: `"${winningAlbum.title}" de ${albumArtist.name} se alza con el codiciado Álbum del Año (${year})`,
        body: `Una obra cumbre galardonada por unanimidad que marca un hito en la discografía contemporánea.`,
        relatedArtistId: winningAlbum.artistId
      });
    }

    // ==========================================
    // 2. GRABACIÓN DEL AÑO (Record of the Year)
    // ==========================================
    // General Field: Performance, production power, commercial domination, chart peak.
    // Anti-monopoly: max 1 track per artist.
    const allPublishedSongs = Object.values(world.songs).filter(s => {
      if (s.artistId === playerId && !isPlayerActive) return false;
      return true;
    });

    const recordScores = allPublishedSongs.map(song => {
      const art = world.artists[song.artistId];
      const isSongInYear = song.releaseYear === year;
      const streamScore = Math.min(45, (song.streamsTotal / 35000000) * 45);
      const chartScore = song.peakPosition?.Global === 1 ? 16 : ((song.peakPosition?.Global ?? 99) <= 10 ? 10 : 2);
      const commercialScore = song.commercialAppeal * 0.20;
      const qualityScore = song.quality * 0.15;
      const viralBonus = song.wentViral ? 6 : 0;
      const yearBonus = isSongInYear ? 15 : Math.max(0, 6 - (year - song.releaseYear) * 2);
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(
        streamScore + chartScore + commercialScore + qualityScore + viralBonus + yearBonus + randomVariance
      );

      return {
        song,
        artist: art,
        score: totalScore,
        highlightText: `${(song.streamsTotal / 1000000).toFixed(1)}M streams • Pico #${song.peakPosition?.Global || '-'} • Hype Comercial ${song.commercialAppeal}/100`,
        nominationReason: `Por su impacto arrollador en radios, charts globales y presencia cultural masiva.`
      };
    });

    recordScores.sort((a, b) => b.score - a.score);

    const selectedRecordCandidates: typeof recordScores = [];
    const recordNominatedArtists = new Set<string>();
    const recordCategoryTitles = new Set<string>();

    for (const candidate of recordScores) {
      if (selectedRecordCandidates.length >= NOMINEES_PER_CATEGORY) break;
      const artistId = candidate.song.artistId;
      const normTitle = AwardEngine.normalizeTitle(candidate.song.title);

      if (recordNominatedArtists.has(artistId)) continue;
      if (recordCategoryTitles.has(normTitle) || galaNominatedSongTitles.has(normTitle)) continue;

      selectedRecordCandidates.push(candidate);
      recordNominatedArtists.add(artistId);
      recordCategoryTitles.add(normTitle);
      galaNominatedSongTitles.add(normTitle);
    }

    // Safety fallback
    if (selectedRecordCandidates.length < NOMINEES_PER_CATEGORY) {
      const availableNPCs = activeNPCs.filter(a => !recordNominatedArtists.has(a.id));
      for (let i = 0; i < availableNPCs.length && selectedRecordCandidates.length < NOMINEES_PER_CATEGORY; i++) {
        const npc = availableNPCs[i];
        let fallbackTitle = `Master Hit - ${npc.name}`;
        let norm = AwardEngine.normalizeTitle(fallbackTitle);
        while (recordCategoryTitles.has(norm) || galaNominatedSongTitles.has(norm)) {
          fallbackTitle = `${fallbackTitle} Special`;
          norm = AwardEngine.normalizeTitle(fallbackTitle);
        }
        const fallbackSongId = `song_record_fallback_${year}_${npc.id}_${selectedRecordCandidates.length}`;
        const fallbackSong: Song = {
          id: fallbackSongId,
          title: fallbackTitle,
          artistId: npc.id,
          featuredArtistIds: [],
          genreId: npc.mainGenreId,
          subGenreIds: npc.subGenreIds || [],
          releaseYear: year,
          releaseMonth: 4,
          quality: 85,
          commercialAppeal: 85,
          originality: 75,
          hypeAtRelease: 80,
          streamsTotal: 15000000,
          streamsLastMonth: 2000000,
          monthlyStreamsHistory: [],
          peakPosition: { Global: 5, Argentina: 3, USA: null, LatinAmerica: 4, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
          weeksOnChart: { Global: 10, Argentina: 12, USA: 0, LatinAmerica: 10, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: true
        };
        world.songs[fallbackSongId] = fallbackSong;

        selectedRecordCandidates.push({
          song: fallbackSong,
          artist: npc,
          score: 72 - selectedRecordCandidates.length * 2,
          highlightText: `15.0M streams • Pico #5 • Hype Comercial 85/100`,
          nominationReason: `Por su impacto radial y dominio comercial sostenido.`
        });
        recordNominatedArtists.add(npc.id);
        recordCategoryTitles.add(norm);
        galaNominatedSongTitles.add(norm);
      }
    }

    const recordNominees: AwardNominee[] = selectedRecordCandidates.map((c, idx) => ({
      artistId: c.song.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.song.id,
      itemTitle: c.song.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.song.artistId === playerId,
      nominationReason: c.nominationReason,
      criticQuote: AwardEngine.generateCriticQuote(c.artist?.name || 'Artista', c.song.title, c.score, idx + 2)
    }));

    AwardEngine.assignNomineeOdds(recordNominees);

    const sortedRecordCandidates = [...selectedRecordCandidates].sort((a, b) => {
      const voteA = a.score * 0.75 + (a.song.quality * 0.25) + (Math.random() * 5);
      const voteB = b.score * 0.75 + (b.song.quality * 0.25) + (Math.random() * 5);
      return voteB - voteA;
    });

    const winningRecordCandidate = sortedRecordCandidates[0] || selectedRecordCandidates[0];
    const winningRecord = winningRecordCandidate.song;
    const recordArtist = world.artists[winningRecord.artistId];
    const isPlayerRecordWinner = winningRecord.artistId === playerId;
    const isPlayerRecordNominated = recordNominees.some(n => n.isPlayer);

    if (isPlayerRecordNominated) playerTotalNominations++;
    if (isPlayerRecordWinner) playerTotalWins++;

    const runnerUpRecord = sortedRecordCandidates[1];
    const winClsRecord = AwardEngine.classifyWin(
      winningRecordCandidate.score,
      runnerUpRecord ? runnerUpRecord.score : winningRecordCandidate.score - 10,
      winningRecord.commercialAppeal >= 90
    );

    const playerRecordRank = recordScores.findIndex(c => c.song.artistId === playerId);
    const playerNomStatusRecord = {
      isNominated: isPlayerRecordNominated,
      rankAmongCandidates: playerRecordRank >= 0 ? playerRecordRank + 1 : undefined,
      reason: isPlayerRecordNominated
        ? 'Nominado por el arrollador impacto comercial y la fuerza interpretativa de tu track.'
        : playerSongs.length === 0
        ? 'Sin canciones elegibles publicadas durante el período.'
        : `Posición #${playerRecordRank + 1} en las deliberaciones de la academia para Grabación del Año.`
    };

    categories.push({
      id: `award_record_of_year_${year}`,
      name: 'Grabación del Año',
      description: 'Premia la interpretación vocal/artística, potencia comercial, impacto en charts y producción global del sencillo.',
      iconName: 'Disc3',
      field: 'general',
      eligibilityPeriod,
      nominees: recordNominees,
      nomineeArtistIds: recordNominees.map(n => n.artistId),
      nomineeItemIds: recordNominees.map(n => n.itemId || ''),
      winnerArtistId: winningRecord.artistId,
      winnerArtistName: recordArtist?.name || 'Artista',
      winnerItemId: winningRecord.id,
      winnerItemTitle: winningRecord.title,
      winType: winClsRecord.winType,
      winTypeLabel: winClsRecord.winTypeLabel,
      winnerReason: `Por su arrolladora presencia e indiscutible impacto sonoro y masivo con "${winningRecord.title}".`,
      deliberationNotes: 'Reconocimiento a la ejecución técnica, carisma en la pista y dominio absoluto del streaming.',
      playerWon: isPlayerRecordWinner,
      playerNominated: isPlayerRecordNominated,
      playerNominationStatus: playerNomStatusRecord
    });

    if (recordArtist) {
      recordArtist.awardsWon.push(`Grabación del Año: "${winningRecord.title}" (${year})`);
      if (!recordArtist.awardsRecord) recordArtist.awardsRecord = [];
      recordArtist.awardsRecord.push({
        id: `win_rec_${year}_${winningRecord.id}`,
        ceremonyName: `Premios de la Música ${year}`,
        categoryId: `award_record_of_year_${year}`,
        categoryName: 'Grabación del Año',
        year,
        itemId: winningRecord.id,
        itemTitle: winningRecord.title,
        itemType: 'song',
        winType: winClsRecord.winType,
        reason: `Por su impacto sonoro y masivo con "${winningRecord.title}".`
      });
      recordArtist.legacyScore = Math.min(100, recordArtist.legacyScore + 5);
      if (isPlayerRecordWinner) {
        recordArtist.stats.hype = Math.min(100, recordArtist.stats.hype + 30);
        recordArtist.stats.reputation = Math.min(100, recordArtist.stats.reputation + 8);
      }
      awardNews.push({
        headline: `"${winningRecord.title}" gana Grabación del Año en los Premios ${year}`,
        body: `La pieza magistral de ${recordArtist.name} fue aclamada por su despliegue sónico y su indiscutible liderazgo en los charts.`,
        relatedArtistId: winningRecord.artistId
      });
    }

    // ==========================================
    // 3. CANCIÓN DEL AÑO (Song of the Year)
    // ==========================================
    // General Field: Songwriters' award! Composition, lyrics, melody, originality.
    // Anti-monopoly: max 1 song per artist.
    const songScores = allPublishedSongs.map(song => {
      const art = world.artists[song.artistId];
      const isSongInYear = song.releaseYear === year;
      const qualityScore = song.quality * 0.35;
      const origScore = song.originality * 0.30;
      const recScore = (song.receptionRating || 3) * 4;
      const commercialScore = song.commercialAppeal * 0.15;
      const yearBonus = isSongInYear ? 12 : Math.max(0, 6 - (year - song.releaseYear) * 2);
      const classicBonus = song.isClassic ? 6 : 0;
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(
        qualityScore + origScore + recScore + commercialScore + yearBonus + classicBonus + randomVariance
      );

      return {
        song,
        artist: art,
        score: totalScore,
        highlightText: `Calidad ${song.quality}/100 • Originalidad ${song.originality}/100 • Recepción ${song.receptionRating || 3}/5`,
        nominationReason: `Por su exquisita construcción melódica, lírica profunda y originalidad compositiva.`
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

      if (songNominatedArtists.has(artistId)) continue;
      if (songCategoryTitles.has(normTitle) || galaNominatedSongTitles.has(normTitle)) continue;

      selectedSongCandidates.push(candidate);
      songNominatedArtists.add(artistId);
      songCategoryTitles.add(normTitle);
      galaNominatedSongTitles.add(normTitle);
    }

    // Safety fallback
    if (selectedSongCandidates.length < NOMINEES_PER_CATEGORY) {
      const availableNPCs = activeNPCs.filter(a => !songNominatedArtists.has(a.id));
      for (let i = 0; i < availableNPCs.length && selectedSongCandidates.length < NOMINEES_PER_CATEGORY; i++) {
        const npc = availableNPCs[i];
        let fallbackTitle = generateSongTitle(selectedSongCandidates.length + i + 80, npc.mainGenreId);
        let norm = AwardEngine.normalizeTitle(fallbackTitle);
        while (songCategoryTitles.has(norm) || galaNominatedSongTitles.has(norm)) {
          fallbackTitle = `${fallbackTitle} Acústico`;
          norm = AwardEngine.normalizeTitle(fallbackTitle);
        }
        const fallbackSongId = `song_song_fallback_${year}_${npc.id}_${selectedSongCandidates.length}`;
        const fallbackSong: Song = {
          id: fallbackSongId,
          title: fallbackTitle,
          artistId: npc.id,
          featuredArtistIds: [],
          genreId: npc.mainGenreId,
          subGenreIds: npc.subGenreIds || [],
          releaseYear: year,
          releaseMonth: 6,
          quality: 90,
          commercialAppeal: 75,
          originality: 88,
          hypeAtRelease: npc.stats.hype,
          streamsTotal: 8000000,
          streamsLastMonth: 1200000,
          monthlyStreamsHistory: [],
          peakPosition: { Global: 8, Argentina: 6, USA: null, LatinAmerica: 7, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
          weeksOnChart: { Global: 6, Argentina: 8, USA: 0, LatinAmerica: 7, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 5,
          isClassic: false,
          wentViral: false
        };
        world.songs[fallbackSongId] = fallbackSong;

        selectedSongCandidates.push({
          song: fallbackSong,
          artist: npc,
          score: 70 - selectedSongCandidates.length * 2,
          highlightText: `Calidad 90/100 • Originalidad 88/100 • Recepción 5/5`,
          nominationReason: `Por su virtuosismo lírico y armonías de primer nivel.`
        });
        songNominatedArtists.add(npc.id);
        songCategoryTitles.add(norm);
        galaNominatedSongTitles.add(norm);
      }
    }

    const songNominees: AwardNominee[] = selectedSongCandidates.map((c, idx) => ({
      artistId: c.song.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.song.id,
      itemTitle: c.song.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.song.artistId === playerId,
      nominationReason: c.nominationReason,
      criticQuote: AwardEngine.generateCriticQuote(c.artist?.name || 'Artista', c.song.title, c.score, idx + 3)
    }));

    AwardEngine.assignNomineeOdds(songNominees);

    const sortedSongCandidates = [...selectedSongCandidates].sort((a, b) => {
      const voteA = (a.song.quality * 0.45) + (a.song.originality * 0.35) + (a.score * 0.20) + (Math.random() * 5);
      const voteB = (b.song.quality * 0.45) + (b.song.originality * 0.35) + (b.score * 0.20) + (Math.random() * 5);
      return voteB - voteA;
    });

    const winningSongCandidate = sortedSongCandidates[0] || selectedSongCandidates[0];
    const winningSong = winningSongCandidate.song;
    const songArtist = world.artists[winningSong.artistId];
    const isPlayerSongWinner = winningSong.artistId === playerId;
    const isPlayerSongNominated = songNominees.some(n => n.isPlayer);

    if (isPlayerSongNominated) playerTotalNominations++;
    if (isPlayerSongWinner) playerTotalWins++;

    const runnerUpSong = sortedSongCandidates[1];
    const winClsSong = AwardEngine.classifyWin(
      winningSongCandidate.score,
      runnerUpSong ? runnerUpSong.score : winningSongCandidate.score - 10,
      winningSong.quality >= 90 && winningSong.originality >= 85
    );

    const playerSongRank = songScores.findIndex(c => c.song.artistId === playerId);
    const playerNomStatusSong = {
      isNominated: isPlayerSongNominated,
      rankAmongCandidates: playerSongRank >= 0 ? playerSongRank + 1 : undefined,
      reason: isPlayerSongNominated
        ? 'Nominado por la calidad compositiva y valor autoral de tu obra.'
        : playerSongs.length === 0
        ? 'Sin canciones compuestas y publicadas en el ciclo.'
        : `Posición #${playerSongRank + 1} en la evaluación lírica y compositiva del jurado.`
    };

    categories.push({
      id: `award_song_of_year_${year}`,
      name: 'Canción del Año',
      description: 'El galardón de honor a la composición: premia la autoría, letra, melodía y brillantez compositiva.',
      iconName: 'Sparkles',
      field: 'general',
      eligibilityPeriod,
      nominees: songNominees,
      nomineeArtistIds: songNominees.map(n => n.artistId),
      nomineeItemIds: songNominees.map(n => n.itemId || ''),
      winnerArtistId: winningSong.artistId,
      winnerArtistName: songArtist?.name || 'Artista',
      winnerItemId: winningSong.id,
      winnerItemTitle: winningSong.title,
      winType: winClsSong.winType,
      winTypeLabel: winClsSong.winTypeLabel,
      winnerReason: `Por la excelencia de su composición lírica y riqueza armónica en "${winningSong.title}".`,
      deliberationNotes: 'La academia premió la sensibilidad poética y la estructura melódica sobre el mero rendimiento de mercado.',
      playerWon: isPlayerSongWinner,
      playerNominated: isPlayerSongNominated,
      playerNominationStatus: playerNomStatusSong
    });

    if (songArtist) {
      songArtist.awardsWon.push(`Canción del Año: "${winningSong.title}" (${year})`);
      if (!songArtist.awardsRecord) songArtist.awardsRecord = [];
      songArtist.awardsRecord.push({
        id: `win_sng_${year}_${winningSong.id}`,
        ceremonyName: `Premios de la Música ${year}`,
        categoryId: `award_song_of_year_${year}`,
        categoryName: 'Canción del Año',
        year,
        itemId: winningSong.id,
        itemTitle: winningSong.title,
        itemType: 'song',
        winType: winClsSong.winType,
        reason: `Por la excelencia de su composición lírica en "${winningSong.title}".`
      });
      songArtist.legacyScore = Math.min(100, songArtist.legacyScore + 5);
      if (isPlayerSongWinner) {
        songArtist.stats.artisticCredibility = Math.min(100, songArtist.stats.artisticCredibility + 15);
        songArtist.stats.reputation = Math.min(100, songArtist.stats.reputation + 8);
      }
      awardNews.push({
        headline: `"${winningSong.title}" es aclamada como la Canción del Año en los Premios ${year}`,
        body: `El jurado de compositores coronó a ${songArtist.name} por la sofisticación melódica y poética de su tema.`,
        relatedArtistId: winningSong.artistId
      });
    }

    // ==========================================
    // 4. MEJOR NUEVO ARTISTA (Best New Artist)
    // ==========================================
    // General Field: STRICT Breakout / Emerging newcomer filter!
    // Rules:
    // 1. MUST NOT be established, mainstream, superstar, veteran or legend.
    //    Explicit exclusion: ['Established', 'Mainstream', 'Superstar', 'Veteran', 'Legend', 'Retired'].
    // 2. Career start within <= 3 years: year - careerStartYear <= 3.
    // 3. Career stage must be strictly 'Underground', 'Emerging', or 'Breakout'.
    // 4. Has NEVER won Best New Artist before (!artist.hasWonBestNewArtist and check awardsWon).
    // 5. Total streams cap: exclude artists with massive lifetime streams (> 100M).
    // 6. Minimum merit: has releases, totalStreams >= 1,000, popularity or reputation >= 5.
    // 7. Player evaluated strictly by the same rules (no auto nomination).
    const meetsStrictNewArtistCriteria = (artist: Artist): boolean => {
      if (artist.isRetired) return false;
      if (artist.id === playerId && !isPlayerActive) return false;

      // Rule 4: Best New Artist can ONLY be won once in a lifetime
      if (artist.hasWonBestNewArtist) return false;
      const alreadyWonBNA = (artist.awardsWon || []).some(w =>
        w.toLowerCase().includes('mejor nuevo artista') ||
        w.toLowerCase().includes('revelación') ||
        w.toLowerCase().includes('best new artist')
      );
      if (alreadyWonBNA) return false;

      // Rule 1: Exclude established, mainstream, superstar, veteran, legend
      const disqualifiedStages = ['Established', 'Mainstream', 'Superstar', 'Veteran', 'Legend', 'Retired', 'Declining', 'Comeback'];
      if (disqualifiedStages.includes(artist.careerStage)) return false;

      // Rule 2: Career age <= 3 years
      const careerYears = year - artist.careerStartYear;
      if (careerYears > 3 || careerYears < 0) return false;

      // Rule 3: Only newcomer stages
      const allowedStages = ['Underground', 'Emerging', 'Breakout'];
      if (!allowedStages.includes(artist.careerStage)) return false;

      // Rule 5: Lifetime stream ceiling (established stars can't masquerade)
      if ((artist.stats.totalStreams || 0) > 100000000) return false;

      // Rule 6: Minimum qualification threshold
      const songsCount = Object.values(world.songs).filter(s => s.artistId === artist.id).length;
      const albumsCount = Object.values(world.albums).filter(a => a.artistId === artist.id).length;
      if (songsCount === 0 && albumsCount === 0) return false;
      if ((artist.stats.totalStreams || 0) < 1000) return false;
      if ((artist.stats.popularity || 0) < 5 && (artist.stats.reputation || 0) < 5) return false;

      return true;
    };

    const eligibleNewArtists = activeArtists.filter(meetsStrictNewArtistCriteria);

    const newArtistScores = eligibleNewArtists.map(artist => {
      const debutYears = year - artist.careerStartYear;
      const freshnessBonus = debutYears <= 0 ? 30 : debutYears === 1 ? 22 : 14;
      const popScore = Math.min(25, (artist.stats.popularity || 0) * 0.25);
      const hypeScore = Math.min(20, (artist.stats.hype || 0) * 0.20);
      const skillScore = (artist.personality.skill || 70) * 0.25;
      const credScore = (artist.stats.artisticCredibility || 0) * 0.15;
      const repScore = (artist.stats.reputation || 0) * 0.15;
      const streamScore = Math.min(15, ((artist.stats.totalStreams || 0) / 1000000) * 15);
      const randomVariance = Math.random() * 3;

      const totalScore = Math.round(
        freshnessBonus + popScore + hypeScore + skillScore + credScore + repScore + streamScore + randomVariance
      );

      return {
        artist,
        score: totalScore,
        highlightText: `Debut ${artist.careerStartYear} • Pop ${artist.stats.popularity} • ${(artist.stats.monthlyListeners / 1000).toFixed(0)}k oyentes`,
        nominationReason: `Por su vertiginosa irrupción, autenticidad y proyección prometedora en la escena.`
      };
    });

    newArtistScores.sort((a, b) => b.score - a.score);

    const selectedNewCandidates: typeof newArtistScores = [];
    for (const cand of newArtistScores) {
      if (selectedNewCandidates.length >= NOMINEES_PER_CATEGORY) break;
      selectedNewCandidates.push(cand);
    }

    // Safety fallback: if fewer than 4 genuine newcomers, dynamically generate genuine fresh indie NPCs
    // NEVER fall back to Duki, Nicki Nicole or established stars!
    if (selectedNewCandidates.length < NOMINEES_PER_CATEGORY) {
      const needed = NOMINEES_PER_CATEGORY - selectedNewCandidates.length;
      for (let i = 0; i < needed; i++) {
        const fallbackNewId = `artist_emerging_rookie_${year}_${i + 1}`;
        const rookieName = `Revelación Indie ${i + 1}`;
        const fallbackArtist: Artist = {
          id: fallbackNewId,
          name: rookieName,
          isPlayer: false,
          country: 'Argentina',
          city: 'Buenos Aires',
          birthYear: year - 19,
          careerStartYear: year,
          mainGenreId: 'trap_latino',
          subGenreIds: [],
          personality: { creativity: 82, ambition: 85, discipline: 80, charisma: 84, skill: 85, commercialAppeal: 82, originality: 86, riskTolerance: 80, sociability: 75, independence: 80 },
          stats: { popularity: 25 + i * 5, reputation: 20 + i * 5, artisticCredibility: 30 + i * 5, energy: 100, monthlyListeners: 18000 + i * 4000, totalStreams: 35000 + i * 15000, funds: 4000, fansCount: 9000, fanbaseLoyalty: 80, hype: 65 },
          careerStage: 'Emerging',
          labelId: null,
          managerId: null,
          relationships: {},
          eras: [],
          awardsWon: [],
          hasWonBestNewArtist: false,
          legacyScore: 10,
          isRetired: false,
          historicalNotes: [`Debutó en la escena en ${year}.`],
          generationIndex: 1,
          influences: []
        };
        world.artists[fallbackNewId] = fallbackArtist;

        // Give them a track
        const rSongId = `song_rookie_${year}_${i + 1}`;
        world.songs[rSongId] = {
          id: rSongId,
          title: `El Debut de ${rookieName}`,
          artistId: fallbackNewId,
          featuredArtistIds: [],
          genreId: 'trap_latino',
          subGenreIds: [],
          releaseYear: year,
          releaseMonth: 2,
          quality: 80,
          commercialAppeal: 78,
          originality: 82,
          hypeAtRelease: 60,
          streamsTotal: 35000 + i * 15000,
          streamsLastMonth: 12000,
          monthlyStreamsHistory: [],
          peakPosition: { Global: null, Argentina: 15, USA: null, LatinAmerica: 25, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
          weeksOnChart: { Global: 0, Argentina: 4, USA: 0, LatinAmerica: 2, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: false
        };

        selectedNewCandidates.push({
          artist: fallbackArtist,
          score: 65 - i * 4,
          highlightText: `Debut ${year} • Pop ${fallbackArtist.stats.popularity} • ${(fallbackArtist.stats.monthlyListeners / 1000).toFixed(0)}k oyentes`,
          nominationReason: `Por su vertiginosa irrupción y aporte de aire fresco al panorama musical.`
        });
      }
    }

    const newNominees: AwardNominee[] = selectedNewCandidates.map((c, idx) => ({
      artistId: c.artist.id,
      artistName: c.artist.name,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.artist.id === playerId,
      nominationReason: c.nominationReason,
      criticQuote: AwardEngine.generateCriticQuote(c.artist.name, undefined, c.score, idx + 4)
    }));

    AwardEngine.assignNomineeOdds(newNominees);

    const sortedNewCandidates = [...selectedNewCandidates].sort((a, b) => {
      const voteA = (a.artist.personality.skill * 0.4) + (a.artist.stats.hype * 0.3) + (a.score * 0.3) + (Math.random() * 4);
      const voteB = (b.artist.personality.skill * 0.4) + (b.artist.stats.hype * 0.3) + (b.score * 0.3) + (Math.random() * 4);
      return voteB - voteA;
    });

    const winningNewCandidate = sortedNewCandidates[0] || selectedNewCandidates[0];
    const winnerNewArtist = winningNewCandidate.artist;
    const isPlayerNewWinner = winnerNewArtist.id === playerId;
    const isPlayerNewNominated = newNominees.some(n => n.isPlayer);

    if (isPlayerNewNominated) playerTotalNominations++;
    if (isPlayerNewWinner) playerTotalWins++;

    const runnerUpNew = sortedNewCandidates[1];
    const winClsNew = AwardEngine.classifyWin(
      winningNewCandidate.score,
      runnerUpNew ? runnerUpNew.score : winningNewCandidate.score - 10,
      winnerNewArtist.personality.originality >= 85
    );

    const playerNewRank = newArtistScores.findIndex(c => c.artist.id === playerId);
    const playerNomStatusNew = {
      isNominated: isPlayerNewNominated,
      rankAmongCandidates: playerNewRank >= 0 ? playerNewRank + 1 : undefined,
      reason: isPlayerNewNominated
        ? 'Nominado como una de las revelaciones emergentes más prometedoras de la temporada.'
        : player.hasWonBestNewArtist
        ? 'Ya has ganado Mejor Artista Nuevo en una edición previa (máximo 1 vez en la carrera).'
        : (year - player.careerStartYear > 3)
        ? 'Fuera de la ventana de elegibilidad (máximo 3 años desde el debut).'
        : ['Mainstream', 'Superstar', 'Veteran', 'Legend'].includes(player.careerStage)
        ? 'Tu estatus de carrera ya está consolidado más allá de la etapa de revelación.'
        : `Posición #${playerNewRank >= 0 ? playerNewRank + 1 : '>10'} en las votaciones de la academia.`
    };

    categories.push({
      id: `award_best_new_artist_${year}`,
      name: 'Mejor Artista Nuevo',
      description: 'El galardón definitivo a la gran revelación emergente que transformó la escena con su debut.',
      iconName: 'Sparkles',
      field: 'general',
      eligibilityPeriod,
      nominees: newNominees,
      nomineeArtistIds: newNominees.map(n => n.artistId),
      winnerArtistId: winnerNewArtist.id,
      winnerArtistName: winnerNewArtist.name,
      winType: winClsNew.winType,
      winTypeLabel: winClsNew.winTypeLabel,
      winnerReason: `Por su deslumbrante impacto revelación y frescura sonora indiscutible en ${year}.`,
      deliberationNotes: 'El jurado evaluó la audacia del debut y la capacidad de conectar con una nueva generación de oyentes.',
      playerWon: isPlayerNewWinner,
      playerNominated: isPlayerNewNominated,
      playerNominationStatus: playerNomStatusNew
    });

    if (world.artists[winnerNewArtist.id]) {
      const wArtist = world.artists[winnerNewArtist.id];
      wArtist.awardsWon.push(`Mejor Artista Nuevo (${year})`);
      wArtist.hasWonBestNewArtist = true; // Recorded so they can NEVER be nominated again
      if (!wArtist.awardsRecord) wArtist.awardsRecord = [];
      wArtist.awardsRecord.push({
        id: `win_bna_${year}_${winnerNewArtist.id}`,
        ceremonyName: `Premios de la Música ${year}`,
        categoryId: `award_best_new_artist_${year}`,
        categoryName: 'Mejor Artista Nuevo',
        year,
        itemType: 'artist',
        winType: winClsNew.winType,
        reason: `Por su deslumbrante impacto revelación en ${year}.`
      });
      wArtist.legacyScore = Math.min(100, wArtist.legacyScore + 5);
      if (isPlayerNewWinner) {
        wArtist.stats.hype = Math.min(100, wArtist.stats.hype + 30);
        wArtist.stats.reputation = Math.min(100, wArtist.stats.reputation + 10);
      }
      awardNews.push({
        headline: `${winnerNewArtist.name} se consagra con el premio a Mejor Artista Nuevo (${year})`,
        body: `La academia musical distinguió a la joven promesa por su revolucionaria irrupción en la escena contemporánea.`,
        relatedArtistId: winnerNewArtist.id
      });
    }

    // ==========================================
    // 5. MEJOR COLABORACIÓN (Best Collaboration)
    // ==========================================
    // Specialty Field: Songs featuring 1+ other artists.
    // Anti-monopoly: max 1 song per lead artist.
    const collabSongs = allPublishedSongs.filter(s => (s.featuredArtistIds && s.featuredArtistIds.length > 0));

    const collabScores = collabSongs.map(song => {
      const art = world.artists[song.artistId];
      const featArtists = song.featuredArtistIds.map(fId => world.artists[fId]?.name).filter(Boolean);
      const featText = featArtists.join(', ');
      const isSongInYear = song.releaseYear === year;

      const streamScore = Math.min(40, (song.streamsTotal / 30000000) * 40);
      const chemScore = (song.quality * 0.3) + (song.commercialAppeal * 0.2);
      const chartScore = song.peakPosition?.Global ? Math.max(0, 15 - (song.peakPosition.Global * 0.5)) : 5;
      const yearBonus = isSongInYear ? 12 : 4;
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(streamScore + chemScore + chartScore + yearBonus + randomVariance);

      return {
        song,
        artist: art,
        featText,
        score: totalScore,
        highlightText: `Feat: ${featText} • ${(song.streamsTotal / 1000000).toFixed(1)}M streams`,
        nominationReason: `Por la química vocal explosiva y sinergia artística lograda con ${featText}.`
      };
    });

    collabScores.sort((a, b) => b.score - a.score);

    const selectedCollabCandidates: typeof collabScores = [];
    const collabNominatedArtists = new Set<string>();

    for (const cand of collabScores) {
      if (selectedCollabCandidates.length >= NOMINEES_PER_CATEGORY) break;
      if (collabNominatedArtists.has(cand.song.artistId)) continue;
      selectedCollabCandidates.push(cand);
      collabNominatedArtists.add(cand.song.artistId);
    }

    // Safety fallback if world lacks collabs
    if (selectedCollabCandidates.length < NOMINEES_PER_CATEGORY) {
      const availableNPCs = activeNPCs.filter(a => !collabNominatedArtists.has(a.id));
      for (let i = 0; i < availableNPCs.length && selectedCollabCandidates.length < NOMINEES_PER_CATEGORY; i++) {
        const mainArtist = availableNPCs[i];
        const featArtist = activeNPCs[(i + 1) % activeNPCs.length];
        const cSongId = `song_collab_fallback_${year}_${i}`;
        const cTitle = `Junte Histórico Vol. ${i + 1}`;
        const fallbackCollab: Song = {
          id: cSongId,
          title: cTitle,
          artistId: mainArtist.id,
          featuredArtistIds: [featArtist.id],
          genreId: mainArtist.mainGenreId,
          subGenreIds: mainArtist.subGenreIds || [],
          releaseYear: year,
          releaseMonth: 7,
          quality: 86,
          commercialAppeal: 88,
          originality: 80,
          hypeAtRelease: 80,
          streamsTotal: 12000000,
          streamsLastMonth: 1800000,
          monthlyStreamsHistory: [],
          peakPosition: { Global: 6, Argentina: 2, USA: null, LatinAmerica: 3, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
          weeksOnChart: { Global: 8, Argentina: 10, USA: 0, LatinAmerica: 8, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: true
        };
        world.songs[cSongId] = fallbackCollab;

        selectedCollabCandidates.push({
          song: fallbackCollab,
          artist: mainArtist,
          featText: featArtist.name,
          score: 68 - i * 2,
          highlightText: `Feat: ${featArtist.name} • 12.0M streams`,
          nominationReason: `Por la electrizante colaboración que encendió las pistas de baile.`
        });
        collabNominatedArtists.add(mainArtist.id);
      }
    }

    const collabNominees: AwardNominee[] = selectedCollabCandidates.map((c, idx) => ({
      artistId: c.song.artistId,
      artistName: `${c.artist?.name || 'Artista'} ft. ${c.featText}`,
      itemId: c.song.id,
      itemTitle: c.song.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.song.artistId === playerId || (c.song.featuredArtistIds?.includes(playerId) ?? false),
      nominationReason: c.nominationReason,
      criticQuote: AwardEngine.generateCriticQuote(c.artist?.name || 'Artista', c.song.title, c.score, idx + 5)
    }));

    AwardEngine.assignNomineeOdds(collabNominees);

    const winningCollabCandidate = selectedCollabCandidates[0];
    const winningCollab = winningCollabCandidate.song;
    const collabLeadArtist = world.artists[winningCollab.artistId];
    const isPlayerCollabWinner = winningCollab.artistId === playerId || winningCollab.featuredArtistIds.includes(playerId);
    const isPlayerCollabNominated = collabNominees.some(n => n.isPlayer);

    if (isPlayerCollabNominated) playerTotalNominations++;
    if (isPlayerCollabWinner) playerTotalWins++;

    categories.push({
      id: `award_best_collab_${year}`,
      name: 'Mejor Colaboración',
      description: 'Premia la mejor unión artística, química interpretativa y potencia conjunta de dos o más creadores.',
      iconName: 'Crown',
      field: 'specialty',
      eligibilityPeriod,
      nominees: collabNominees,
      nomineeArtistIds: collabNominees.map(n => n.artistId),
      nomineeItemIds: collabNominees.map(n => n.itemId || ''),
      winnerArtistId: winningCollab.artistId,
      winnerArtistName: `${collabLeadArtist?.name || 'Artista'} ft. ${winningCollabCandidate.featText}`,
      winnerItemId: winningCollab.id,
      winnerItemTitle: winningCollab.title,
      winType: 'unanimous',
      winTypeLabel: 'Victoria de Escena',
      winnerReason: `Por la incomparable química y resonancia masiva en "${winningCollab.title}".`,
      deliberationNotes: 'La unión de estilos creó un momento cultural ineludible en el calendario musical.',
      playerWon: isPlayerCollabWinner,
      playerNominated: isPlayerCollabNominated,
      playerNominationStatus: {
        isNominated: isPlayerCollabNominated,
        reason: isPlayerCollabNominated
          ? 'Nominado por una de las colaboraciones con mayor impacto y química del año.'
          : 'Sin lanzamientos colaborativos con métricas suficientes en el período.'
      }
    });

    if (collabLeadArtist) {
      collabLeadArtist.awardsWon.push(`Mejor Colaboración: "${winningCollab.title}" (${year})`);
      collabLeadArtist.legacyScore = Math.min(100, collabLeadArtist.legacyScore + 4);
    }

    // ==========================================
    // 6. MEJOR CANCIÓN URBANA / TRAP (Best Urban / Trap Song)
    // ==========================================
    // Genre Field: Urban, trap, reggaeton, drill, hip hop.
    // Anti-monopoly: max 1 per artist.
    const urbanGenres = ['trap_latino', 'reggaeton_latino', 'drill_latino', 'hip_hop_rap', 'rage_latino', 'rkt'];
    const urbanSongs = allPublishedSongs.filter(s => urbanGenres.includes(s.genreId));

    const urbanScores = urbanSongs.map(song => {
      const art = world.artists[song.artistId];
      const isSongInYear = song.releaseYear === year;
      const beatFlowScore = (song.quality * 0.35) + (song.originality * 0.25);
      const streetHypeScore = Math.min(25, (song.streamsTotal / 25000000) * 25);
      const chartScore = song.peakPosition?.Argentina ? Math.max(0, 10 - (song.peakPosition.Argentina * 0.4)) : 4;
      const yearBonus = isSongInYear ? 10 : 3;

      const totalScore = Math.round(beatFlowScore + streetHypeScore + chartScore + yearBonus + Math.random() * 3);

      return {
        song,
        artist: art,
        score: totalScore,
        highlightText: `Flow & Calidad ${song.quality}/100 • ${(song.streamsTotal / 1000000).toFixed(1)}M streams`,
        nominationReason: `Por dominar las calles y clubes con un beat demoledor y métrica impecable.`
      };
    });

    urbanScores.sort((a, b) => b.score - a.score);

    const selectedUrbanCandidates: typeof urbanScores = [];
    const urbanNominatedArtists = new Set<string>();

    for (const cand of urbanScores) {
      if (selectedUrbanCandidates.length >= NOMINEES_PER_CATEGORY) break;
      if (urbanNominatedArtists.has(cand.song.artistId)) continue;
      selectedUrbanCandidates.push(cand);
      urbanNominatedArtists.add(cand.song.artistId);
    }

    // Safety fallback
    if (selectedUrbanCandidates.length < NOMINEES_PER_CATEGORY) {
      const availableNPCs = activeNPCs.filter(a => !urbanNominatedArtists.has(a.id));
      for (let i = 0; i < availableNPCs.length && selectedUrbanCandidates.length < NOMINEES_PER_CATEGORY; i++) {
        const npc = availableNPCs[i];
        const uId = `song_urban_fallback_${year}_${i}`;
        const uTitle = `Himno de Barrio ${i + 1}`;
        const fUrban: Song = {
          id: uId,
          title: uTitle,
          artistId: npc.id,
          featuredArtistIds: [],
          genreId: 'trap_latino',
          subGenreIds: [],
          releaseYear: year,
          releaseMonth: 8,
          quality: 85,
          commercialAppeal: 84,
          originality: 82,
          hypeAtRelease: 75,
          streamsTotal: 10000000,
          streamsLastMonth: 1500000,
          monthlyStreamsHistory: [],
          peakPosition: { Global: 10, Argentina: 4, USA: null, LatinAmerica: 6, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
          weeksOnChart: { Global: 6, Argentina: 8, USA: 0, LatinAmerica: 6, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: false
        };
        world.songs[uId] = fUrban;

        selectedUrbanCandidates.push({
          song: fUrban,
          artist: npc,
          score: 66 - i * 2,
          highlightText: `Flow & Calidad 85/100 • 10.0M streams`,
          nominationReason: `Por su autenticidad y fuerza rítmica en la escena urbana.`
        });
        urbanNominatedArtists.add(npc.id);
      }
    }

    const urbanNominees: AwardNominee[] = selectedUrbanCandidates.map((c, idx) => ({
      artistId: c.song.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.song.id,
      itemTitle: c.song.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.song.artistId === playerId,
      nominationReason: c.nominationReason,
      criticQuote: AwardEngine.generateCriticQuote(c.artist?.name || 'Artista', c.song.title, c.score, idx + 6)
    }));

    AwardEngine.assignNomineeOdds(urbanNominees);

    const winningUrbanCandidate = selectedUrbanCandidates[0];
    const winningUrban = winningUrbanCandidate.song;
    const urbanArtist = world.artists[winningUrban.artistId];
    const isPlayerUrbanWinner = winningUrban.artistId === playerId;
    const isPlayerUrbanNominated = urbanNominees.some(n => n.isPlayer);

    if (isPlayerUrbanNominated) playerTotalNominations++;
    if (isPlayerUrbanWinner) playerTotalWins++;

    categories.push({
      id: `award_best_urban_${year}`,
      name: 'Mejor Canción Urbana / Trap',
      description: 'El estandarte del movimiento urbano: premia la potencia del beat, el flow y la autenticidad callejera.',
      iconName: 'Sliders',
      field: 'genre',
      eligibilityPeriod,
      nominees: urbanNominees,
      nomineeArtistIds: urbanNominees.map(n => n.artistId),
      nomineeItemIds: urbanNominees.map(n => n.itemId || ''),
      winnerArtistId: winningUrban.artistId,
      winnerArtistName: urbanArtist?.name || 'Artista',
      winnerItemId: winningUrban.id,
      winnerItemTitle: winningUrban.title,
      winType: 'unanimous',
      winTypeLabel: 'Victoria de Género',
      winnerReason: `Por consolidar el sonido definitivo del trap con métricas demoledoras en "${winningUrban.title}".`,
      deliberationNotes: 'El jurado destacó la crudeza lírica y la contundencia de los bajos en la mezcla.',
      playerWon: isPlayerUrbanWinner,
      playerNominated: isPlayerUrbanNominated,
      playerNominationStatus: {
        isNominated: isPlayerUrbanNominated,
        reason: isPlayerUrbanNominated
          ? 'Nominado por la solidez y viralidad de tu track en la escena urbana.'
          : 'Tus temas urbanos no alcanzaron el corte final del jurado de género.'
      }
    });

    if (urbanArtist) {
      urbanArtist.awardsWon.push(`Mejor Canción Urbana: "${winningUrban.title}" (${year})`);
      urbanArtist.legacyScore = Math.min(100, urbanArtist.legacyScore + 4);
    }

    // ==========================================
    // 7. MEJOR VIDEO MUSICAL / IMPACTO CULTURAL (Best Music Video / Cultural Impact)
    // ==========================================
    // Specialty Field: Music videos, views, budget, virality.
    // Anti-monopoly: max 1 per artist.
    const videoSongs = allPublishedSongs.filter(s => s.musicVideo || s.wentViral);

    const videoScores = videoSongs.map(song => {
      const art = world.artists[song.artistId];
      const views = song.musicVideo?.views || Math.floor(song.streamsTotal * 0.4);
      const budget = song.musicVideo?.budget || 5000;
      const viewsScore = Math.min(45, (views / 20000000) * 45);
      const visualBudgetScore = Math.min(25, (budget / 20000) * 25);
      const viralBonus = song.wentViral ? 15 : 0;
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(viewsScore + visualBudgetScore + viralBonus + randomVariance);

      return {
        song,
        artist: art,
        score: totalScore,
        highlightText: `${(views / 1000000).toFixed(1)}M vistas • Presupuesto visual \$${budget.toLocaleString()}`,
        nominationReason: `Por su cinematografía revolucionaria, concepto visual de alto nivel e impacto viral.`
      };
    });

    videoScores.sort((a, b) => b.score - a.score);

    const selectedVideoCandidates: typeof videoScores = [];
    const videoNominatedArtists = new Set<string>();

    for (const cand of videoScores) {
      if (selectedVideoCandidates.length >= NOMINEES_PER_CATEGORY) break;
      if (videoNominatedArtists.has(cand.song.artistId)) continue;
      selectedVideoCandidates.push(cand);
      videoNominatedArtists.add(cand.song.artistId);
    }

    // Safety fallback
    if (selectedVideoCandidates.length < NOMINEES_PER_CATEGORY) {
      const availableNPCs = activeNPCs.filter(a => !videoNominatedArtists.has(a.id));
      for (let i = 0; i < availableNPCs.length && selectedVideoCandidates.length < NOMINEES_PER_CATEGORY; i++) {
        const npc = availableNPCs[i];
        const vId = `song_video_fallback_${year}_${i}`;
        const vTitle = `Odisea Visual - ${npc.name}`;
        const fVideoSong: Song = {
          id: vId,
          title: vTitle,
          artistId: npc.id,
          featuredArtistIds: [],
          genreId: npc.mainGenreId,
          subGenreIds: npc.subGenreIds || [],
          releaseYear: year,
          releaseMonth: 9,
          quality: 88,
          commercialAppeal: 82,
          originality: 85,
          hypeAtRelease: 80,
          streamsTotal: 9000000,
          streamsLastMonth: 1200000,
          monthlyStreamsHistory: [],
          peakPosition: { Global: 12, Argentina: 5, USA: null, LatinAmerica: 8, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
          weeksOnChart: { Global: 5, Argentina: 7, USA: 0, LatinAmerica: 5, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
          longevityCurve: 'steady',
          isSingle: true,
          receptionRating: 4,
          isClassic: false,
          wentViral: true,
          musicVideo: {
            views: 8500000,
            budget: 15000,
            director: 'Vanguard Visuals'
          }
        };
        world.songs[vId] = fVideoSong;

        selectedVideoCandidates.push({
          song: fVideoSong,
          artist: npc,
          score: 65 - i * 2,
          highlightText: `8.5M vistas • Presupuesto visual \$15,000`,
          nominationReason: `Por su despliegue cinemático y audaz estética visual.`
        });
        videoNominatedArtists.add(npc.id);
      }
    }

    const videoNominees: AwardNominee[] = selectedVideoCandidates.map((c, idx) => ({
      artistId: c.song.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.song.id,
      itemTitle: c.song.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.song.artistId === playerId,
      nominationReason: c.nominationReason,
      criticQuote: AwardEngine.generateCriticQuote(c.artist?.name || 'Artista', c.song.title, c.score, idx + 7)
    }));

    AwardEngine.assignNomineeOdds(videoNominees);

    const winningVideoCandidate = selectedVideoCandidates[0];
    const winningVideo = winningVideoCandidate.song;
    const videoArtist = world.artists[winningVideo.artistId];
    const isPlayerVideoWinner = winningVideo.artistId === playerId;
    const isPlayerVideoNominated = videoNominees.some(n => n.isPlayer);

    if (isPlayerVideoNominated) playerTotalNominations++;
    if (isPlayerVideoWinner) playerTotalWins++;

    categories.push({
      id: `award_best_music_video_${year}`,
      name: 'Mejor Video Musical & Impacto Cultural',
      description: 'Premia la visión audiovisual, cinematografía, innovación estética y resonancia en la cultura popular.',
      iconName: 'Play',
      field: 'specialty',
      eligibilityPeriod,
      nominees: videoNominees,
      nomineeArtistIds: videoNominees.map(n => n.artistId),
      nomineeItemIds: videoNominees.map(n => n.itemId || ''),
      winnerArtistId: winningVideo.artistId,
      winnerArtistName: videoArtist?.name || 'Artista',
      winnerItemId: winningVideo.id,
      winnerItemTitle: winningVideo.title,
      winType: 'unanimous',
      winTypeLabel: 'Impacto Cultural',
      winnerReason: `Por su revolucionaria propuesta visual y fenómeno viral con "${winningVideo.title}".`,
      deliberationNotes: 'La estética del videoclip estableció tendencia visual en toda la industria audiovisual.',
      playerWon: isPlayerVideoWinner,
      playerNominated: isPlayerVideoNominated,
      playerNominationStatus: {
        isNominated: isPlayerVideoNominated,
        reason: isPlayerVideoNominated
          ? 'Nominado por la excelente producción y visualizaciones de tu videoclip.'
          : 'Requiere producir videoclips de alto impacto visual y vistas para calificar.'
      }
    });

    if (videoArtist) {
      videoArtist.awardsWon.push(`Mejor Video Musical: "${winningVideo.title}" (${year})`);
      videoArtist.legacyScore = Math.min(100, videoArtist.legacyScore + 4);
    }

    // ==========================================
    // 8. MEJOR PRODUCCIÓN / INGENIERÍA (Best Production / Engineering)
    // ==========================================
    // Craft Field: Producers, mix, mastering, sound design.
    // Anti-monopoly: max 2 items per artist or producer across this category.
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
        highlightText: `Productor: ${producerName} • Calidad de Mezcla: ${qualityVal}/100`,
        nominationReason: `Por el impecable diseño de audio, equilibrio de frecuencias y vanguardia sónica.`
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

      if (prodCategoryTitles.has(normTitle)) continue;

      // Anti-monopoly: max 2 items per artist or producer
      const currentArtistCount = prodArtistCounts.get(artistId) || 0;
      if (currentArtistCount >= 2) continue;

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

    // Safety fallback
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
          peakPosition: { Global: 20, Argentina: 12, USA: null, LatinAmerica: 16, Europe: null, Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null },
          weeksOnChart: { Global: 5, Argentina: 6, USA: 0, LatinAmerica: 5, Europe: 0, Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
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
          highlightText: `Productor: Producción de ${npc.name} • Calidad de Mezcla: 85/100`,
          nominationReason: `Por la solidez de la mezcla acústica y vanguardia sónica.`
        });
        prodArtistCounts.set(npc.id, (prodArtistCounts.get(npc.id) || 0) + 1);
        prodCategoryTitles.add(norm);
      }
    }

    const prodNominees: AwardNominee[] = selectedProdCandidates.map((c, idx) => ({
      artistId: c.item.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.item.id,
      itemTitle: c.title,
      producerId: c.producerId,
      producerName: c.producerName,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.item.artistId === playerId,
      nominationReason: c.nominationReason,
      criticQuote: AwardEngine.generateCriticQuote(c.artist?.name || 'Artista', c.title, c.score, idx + 8)
    }));

    AwardEngine.assignNomineeOdds(prodNominees);

    const winningProdCandidate = selectedProdCandidates[0];
    const winningItem = winningProdCandidate.item;
    const prodArtist = world.artists[winningItem.artistId];
    const isPlayerProdWinner = winningItem.artistId === playerId;
    const isPlayerProdNominated = prodNominees.some(n => n.isPlayer);

    if (isPlayerProdNominated) playerTotalNominations++;
    if (isPlayerProdWinner) playerTotalWins++;

    categories.push({
      id: `award_best_production_${year}`,
      name: 'Mejor Producción & Sonido',
      description: 'Premia la sofisticación del diseño sonoro, mezcla, ingeniería acústica y brillantez en la producción.',
      iconName: 'Sliders',
      field: 'craft',
      eligibilityPeriod,
      nominees: prodNominees,
      nomineeArtistIds: prodNominees.map(n => n.artistId),
      nomineeItemIds: prodNominees.map(n => n.itemId || ''),
      winnerArtistId: winningItem.artistId,
      winnerArtistName: prodArtist?.name || 'Artista',
      winnerItemId: winningItem.id,
      winnerItemTitle: winningProdCandidate.title,
      winnerProducerId: winningProdCandidate.producerId,
      winnerProducerName: winningProdCandidate.producerName,
      winType: 'unanimous',
      winTypeLabel: 'Excelencia Técnica',
      winnerReason: `Por el impecable trabajo de audio, vanguardia sonora e ingeniería en "${winningProdCandidate.title}".`,
      deliberationNotes: 'Elogiada por ingenieros y productores como el estándar de oro en calidad de audio del año.',
      playerWon: isPlayerProdWinner,
      playerNominated: isPlayerProdNominated,
      playerNominationStatus: {
        isNominated: isPlayerProdNominated,
        reason: isPlayerProdNominated
          ? 'Nominado por la sobresaliente calidad de ingeniería y producción sonora de tu obra.'
          : 'Tu obra no alcanzó los estándares técnicos de mezcla y producción exigidos por el jurado.'
      }
    });

    if (prodArtist) {
      prodArtist.awardsWon.push(`Mejor Producción: "${winningProdCandidate.title}" (${year})`);
      if (!prodArtist.awardsRecord) prodArtist.awardsRecord = [];
      prodArtist.awardsRecord.push({
        id: `win_prd_${year}_${winningItem.id}`,
        ceremonyName: `Premios de la Música ${year}`,
        categoryId: `award_best_production_${year}`,
        categoryName: 'Mejor Producción & Sonido',
        year,
        itemId: winningItem.id,
        itemTitle: winningProdCandidate.title,
        producerId: winningProdCandidate.producerId,
        producerName: winningProdCandidate.producerName,
        winType: 'unanimous',
        reason: `Por el impecable trabajo de audio en "${winningProdCandidate.title}".`
      });
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

    // Build Hall of Fame snapshot based on actual won awards
    const winsTally = new Map<string, { artistName: string; totalWins: number; totalNominations: number }>();
    for (const art of Object.values(world.artists)) {
      if (art.awardsWon && art.awardsWon.length > 0) {
        winsTally.set(art.id, {
          artistName: art.name,
          totalWins: art.awardsWon.length,
          totalNominations: art.awardsWon.length + (art.nominationHistory?.length || 0)
        });
      }
    }

    const hallOfFameSnapshot = Array.from(winsTally.entries())
      .map(([artistId, data]) => ({
        artistId,
        artistName: data.artistName,
        totalWins: data.totalWins,
        totalNominations: data.totalNominations
      }))
      .sort((a, b) => b.totalWins - a.totalWins)
      .slice(0, 10);

    const ceremony: AwardCeremony = {
      year,
      name: `Premios de la Academia Musical ${year}`,
      theme: 'Celebrando la excelencia, la trascendencia sonora y el talento de la escena',
      eligibilityPeriod,
      categories,
      playerNominationsCount: playerTotalNominations,
      playerWinsCount: playerTotalWins,
      hallOfFameSnapshot
    };

    return {
      ceremony,
      awardNews,
      playerWonAny: playerTotalWins > 0
    };
  }
}
