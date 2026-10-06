import {
  Song,
  Artist,
  MusicTrend,
  Genre,
  EditorialPlaylist,
  YouTubeComment,
  SnippetCampaignConfig,
  SnippetCampaignResult,
  WorldState,
  TikTokInfluencerTier
} from '../types';

export const EDITORIAL_PLAYLISTS: EditorialPlaylist[] = [
  {
    id: 'todays_top_hits',
    name: "Today's Top Hits",
    curator: 'Spotify Editorial',
    region: 'Global',
    followers: 32000000,
    streamMultiplier: 1.8,
    genreFilters: [],
    description: 'Los mayores éxitos del planeta en este momento. La lista editorial más escuchada del mundo.',
    coverGradient: 'from-blue-600 via-indigo-600 to-purple-800',
    trackIds: [],
    maxTracks: 50
  },
  {
    id: 'viva_latino',
    name: 'Viva Latino',
    curator: 'Spotify Editorial',
    region: 'LatinAmerica',
    followers: 14000000,
    streamMultiplier: 1.6,
    genreFilters: ['urban', 'reggaeton', 'trap_latino', 'pop', 'latin_pop', 'musica_mexicana'],
    description: 'El corazón de la música latina. Los temas que están encendiendo las pistas de baile de todo el mundo.',
    coverGradient: 'from-amber-500 via-rose-500 to-red-600',
    trackIds: [],
    maxTracks: 50
  },
  {
    id: 'exitos_argentina',
    name: 'Éxitos Argentina',
    curator: 'Spotify Editorial',
    region: 'Argentina',
    followers: 3800000,
    streamMultiplier: 1.4,
    genreFilters: ['trap_latino', 'urban', 'cumbia', 'rock', 'pop', 'rkt', 'cuarteto'],
    description: 'Lo que más suena en las calles de Buenos Aires, Córdoba, Rosario y todo el país.',
    coverGradient: 'from-sky-400 via-blue-600 to-slate-900',
    trackIds: [],
    maxTracks: 50
  },
  {
    id: 'rap_caviar',
    name: 'Rap Caviar',
    curator: 'Spotify Editorial',
    region: 'USA',
    followers: 12000000,
    streamMultiplier: 1.5,
    genreFilters: ['hip_hop', 'trap', 'rap', 'trap_latino'],
    description: 'Puro peso pesado del hip-hop y el trap contemporáneo sin censura.',
    coverGradient: 'from-neutral-900 via-zinc-800 to-black',
    trackIds: [],
    maxTracks: 50
  },
  {
    id: 'baila_reggaeton',
    name: 'Baila Reggaeton',
    curator: 'Spotify Editorial',
    region: 'LatinAmerica',
    followers: 10500000,
    streamMultiplier: 1.5,
    genreFilters: ['reggaeton', 'urban', 'dembow', 'latin_pop'],
    description: 'Perreo intenso, dembow y los himnos definitivos del género urbano.',
    coverGradient: 'from-purple-600 via-pink-600 to-rose-600',
    trackIds: [],
    maxTracks: 50
  },
  {
    id: 'mansion_trap',
    name: 'Mansión Trap',
    curator: 'Spotify Editorial',
    region: 'Argentina',
    followers: 4200000,
    streamMultiplier: 1.35,
    genreFilters: ['trap_latino', 'hip_hop', 'urban', 'rap'],
    description: 'El sonido que nació en Antezana 247 y conquistó los parlantes de habla hispana.',
    coverGradient: 'from-violet-900 via-purple-800 to-zinc-950',
    trackIds: [],
    maxTracks: 45
  },
  {
    id: 'indie_chill',
    name: 'Indie Chill',
    curator: 'Spotify Editorial',
    region: 'Global',
    followers: 2500000,
    streamMultiplier: 1.25,
    genreFilters: ['indie_rock', 'alternative', 'bedroom_pop', 'synthwave', 'experimental'],
    description: 'Vibras relajadas, guitarras atmosféricas y sonidos independientes para desconectar.',
    coverGradient: 'from-teal-600 via-emerald-700 to-slate-900',
    trackIds: [],
    maxTracks: 40
  },
  {
    id: 'descubrimiento_semanal',
    name: 'Descubrimiento Semanal',
    curator: 'Algorítmica Personalizada',
    region: 'Global',
    followers: 18000000,
    streamMultiplier: 1.2,
    genreFilters: [],
    description: 'Tu mezcla semanal y algorítmica de música nueva hecha a la medida de tus gustos.',
    coverGradient: 'from-emerald-500 via-teal-600 to-indigo-900',
    trackIds: [],
    maxTracks: 60
  }
];

export class StreamingEngine {
  static EDITORIAL_PLAYLISTS = EDITORIAL_PLAYLISTS;

  /**
   * Calculates realistic monthly streams for a single song based on:
   * 1. Core fanbase engagement and loyalty
   * 2. Scaled algorithmic discovery reach based on artist popularity
   * 3. Song musical quality, commercial appeal, originality and release hype
   * 4. Trend alignment and genre health
   * 5. Lifecycles and longevity curves (avoiding 0-to-millions absurd jumps)
   * 6. Editorial Playlist inclusions
   */
  static calculateSongMonthlyStreams(
    song: Song,
    artist: Artist,
    currentYear: number,
    currentMonth: number,
    activeTrends: MusicTrend[],
    genre: Genre | undefined,
    allArtists?: Record<string, Artist>,
    artistCatalog?: Song[],
    playlistsOrWorld?: Record<string, EditorialPlaylist> | WorldState
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

    // 3. Catalog Context & Song Tier Analysis
    const catalog = (artistCatalog || []).filter(s => {
      const sAge = (currentYear - s.releaseYear) * 12 + (currentMonth - s.releaseMonth);
      return sAge >= 0;
    });

    let topHitSong = song;
    if (catalog.length > 0) {
      topHitSong = catalog.reduce((best, s) => {
        const bestScore = (best.streamsTotal || 0) + (best.isClassic ? 500000 : 0) + ((best.peakPosition?.Global ?? 99) <= 10 ? 1000000 : 0);
        const sScore = (s.streamsTotal || 0) + (s.isClassic ? 500000 : 0) + ((s.peakPosition?.Global ?? 99) <= 10 ? 1000000 : 0);
        return sScore > bestScore ? s : best;
      }, catalog[0]);
    }

    const isSingleOrPromoted = Boolean(song.isSingle) || Boolean(song.musicVideo) || Boolean(song.isClassic) || ((song.peakPosition?.Global ?? 99) <= 40);
    const isTopHit = catalog.length > 0
      ? song.id === topHitSong.id
      : (isSingleOrPromoted && (song.isClassic || (song.streamsTotal && song.streamsTotal > 1000000)));
    const isDeepCut = !isTopHit && !isSingleOrPromoted;

    // 4. Core Fan Streams: Active fans replay new songs frequently and sustain catalog hits
    const activeFans = Math.max(10, Math.floor(artist.stats.fansCount * loyaltyFactor));
    let fanPlaysPerMonth = 0;
    if (ageMonths === 0) {
      fanPlaysPerMonth = isTopHit ? 5.5 : isSingleOrPromoted ? 4.5 : 2.2;
    } else if (ageMonths === 1) {
      fanPlaysPerMonth = isTopHit ? 3.2 : isSingleOrPromoted ? 2.4 : 1.1;
    } else if (ageMonths <= 3) {
      fanPlaysPerMonth = isTopHit ? 1.8 : isSingleOrPromoted ? 1.3 : 0.55;
    } else if (ageMonths <= 12) {
      fanPlaysPerMonth = isTopHit ? 0.9 : isSingleOrPromoted ? 0.55 : 0.20;
    } else {
      if (isTopHit) {
        fanPlaysPerMonth = song.isClassic ? 0.65 : 0.45;
      } else if (isSingleOrPromoted) {
        fanPlaysPerMonth = song.isClassic ? 0.40 : 0.25;
      } else {
        fanPlaysPerMonth = 0.08;
      }
    }
    const fanStreamBase = activeFans * fanPlaysPerMonth;

    // 5. Algorithmic / Discovery / Playlist reach based on realistic scale
    let maxAlgorithmicPool = 0;
    if (artist.stats.popularity <= 20) {
      maxAlgorithmicPool = Math.pow(popFactor / 0.20, 2.8) * 4500 + (artist.stats.popularity * 15);
    } else if (artist.stats.popularity <= 40) {
      const ratio = (artist.stats.popularity - 20) / 20;
      maxAlgorithmicPool = 4800 + Math.pow(ratio, 2.2) * 70000;
    } else if (artist.stats.popularity <= 65) {
      const ratio = (artist.stats.popularity - 40) / 25;
      maxAlgorithmicPool = 75000 + Math.pow(ratio, 2.0) * 1725000;
    } else if (artist.stats.popularity <= 85) {
      const ratio = (artist.stats.popularity - 65) / 20;
      maxAlgorithmicPool = 1800000 + Math.pow(ratio, 1.7) * 14200000;
    } else {
      const ratio = (artist.stats.popularity - 85) / 15;
      maxAlgorithmicPool = 16000000 + Math.pow(ratio, 1.4) * 39000000;
    }

    const singlePromotedMultiplier = isTopHit ? 1.0 : isSingleOrPromoted ? 0.85 : 0.38;
    const songAppealScore = (qualityFactor * 0.35 + commercialFactor * 0.45 + originalityFactor * 0.20) * (0.55 + hypeFactor * 0.45);
    const playlistMultiplier = playlistsOrWorld ? StreamingEngine.getSongPlaylistMultiplier(song.id, playlistsOrWorld) : 1.0;
    const algorithmicStreams = maxAlgorithmicPool * songAppealScore * trendBoost * genreBoost * singlePromotedMultiplier * playlistMultiplier;

    // 5.1 Impulso de alcance algorítmico y cross-fanbase derivado del artista colaborador
    let collabBoost = 0;
    if (song.featuredArtistIds && song.featuredArtistIds.length > 0) {
      for (const featId of song.featuredArtistIds) {
        const featArtist = allArtists ? allArtists[featId] : undefined;
        const featPop = featArtist ? featArtist.stats.popularity : 30;
        let featAlgoPool = 0;
        const featPopFactor = Math.max(0.01, featPop / 100);
        if (featPop <= 20) {
          featAlgoPool = Math.pow(featPopFactor / 0.20, 2.8) * 4500 + (featPop * 15);
        } else if (featPop <= 40) {
          const ratio = (featPop - 20) / 20;
          featAlgoPool = 4800 + Math.pow(ratio, 2.2) * 70000;
        } else if (featPop <= 65) {
          const ratio = (featPop - 40) / 25;
          featAlgoPool = 75000 + Math.pow(ratio, 2.0) * 1725000;
        } else if (featPop <= 85) {
          const ratio = (featPop - 65) / 20;
          featAlgoPool = 1800000 + Math.pow(ratio, 1.7) * 14200000;
        } else {
          const ratio = (featPop - 85) / 15;
          featAlgoPool = 16000000 + Math.pow(ratio, 1.4) * 39000000;
        }

        const featFans = featArtist ? featArtist.stats.fansCount : 5000;
        const featLoyalty = featArtist ? Math.max(0.2, featArtist.stats.fanbaseLoyalty / 100) : 0.6;
        const featFanMultiplier = ageMonths === 0 ? 2.0 : ageMonths === 1 ? 1.2 : ageMonths <= 3 ? 0.5 : 0.1;
        const hostWeight = Math.pow(Math.max(0.05, artist.stats.popularity / 100), 1.5);
        const relativeSynergy = 0.04 + hostWeight * 0.85;
        const featFanStreams = (featFans * featLoyalty * 0.02 * relativeSynergy) * featFanMultiplier;

        collabBoost += (featAlgoPool * songAppealScore * trendBoost * genreBoost * 0.35 * relativeSynergy) + featFanStreams;
      }
    }

    // Base total potential per month for active lifecycle
    const baseTotalStreams = fanStreamBase + algorithmicStreams + collabBoost;

    // 6. Music Video Boost (Initial streaming velocity & viral chance multiplier)
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
        if (ageMonths <= 2) musicVideoVelocityMultiplier = 1.15;
        viralChanceBonus = 0.005; // +0.5% viral chance
      }
    }

    // 7. Longevity curves & decay over time
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

    // 8. Catalog Halo Effect (Efecto Marea):
    // El artista transfiere descubrimiento continuo a sus canciones activas según su
    // popularidad y oyentes mensuales actuales (oyentes que exploran discografía, playlists de catálogo, autoplay)
    let catalogHaloStreams = 0;
    const effectiveListeners = Math.max(
      artist.stats.monthlyListeners || 0,
      Math.floor(artist.stats.popularity * 1800 + artist.stats.fansCount * 0.6)
    );

    if (effectiveListeners > 0) {
      // Proporción de oyentes que exploran el catálogo (~4.5% a 15% según popularidad y hype del artista)
      const haloExplorationRate = (0.045 + Math.pow(popFactor, 1.5) * 0.08) * (1.0 + (hypeFactor - 0.5) * 0.25);

      // Ponderación de atracción según jerarquía del tema:
      // Hit estrella absorbe la mayor atracción (~50%), singles destacados (~25%), deep cuts (~8%)
      let songHaloWeight = 1.0;
      if (isTopHit) {
        songHaloWeight = 1.0 + (song.isClassic ? 0.35 : 0);
      } else if (isSingleOrPromoted) {
        songHaloWeight = 0.45 + (song.isClassic ? 0.20 : 0);
      } else {
        // Deep cut
        songHaloWeight = 0.12 + (qualityFactor * 0.08);
      }

      const haloTrackAppeal = (qualityFactor * 0.40 + commercialFactor * 0.40 + originalityFactor * 0.20) * trendBoost * genreBoost;

      if (catalog.length > 0) {
        const totalCatalogWeight = catalog.reduce((sum, s) => {
          if (s.id === topHitSong.id) return sum + 1.0 + (s.isClassic ? 0.35 : 0);
          if (s.isSingle || s.musicVideo || s.isClassic) return sum + 0.45 + (s.isClassic ? 0.20 : 0);
          return sum + 0.15;
        }, 0);

        const poolStreams = Math.floor(effectiveListeners * haloExplorationRate);
        catalogHaloStreams = Math.floor(poolStreams * (songHaloWeight / Math.max(1, totalCatalogWeight)) * haloTrackAppeal);
      } else {
        catalogHaloStreams = Math.floor(effectiveListeners * haloExplorationRate * songHaloWeight * 0.15 * haloTrackAppeal);
      }
    }

    // 9. Combinación de ciclo activo + descubrimiento de catálogo Halo
    let calculatedStreams = Math.floor(baseTotalStreams * ageMultiplier * musicVideoVelocityMultiplier);
    if (ageMonths >= 1) {
      calculatedStreams = Math.max(calculatedStreams, Math.floor(fanStreamBase + catalogHaloStreams));
    }

    // 10. Decaimiento suave de picos masivos / virales previos hacia su nivel de clásico/catálogo
    // Si la canción generó un pico masivo o viene de rotación alta, retiene inercia mes a mes
    if (song.streamsLastMonth && song.streamsLastMonth > 5000 && ageMonths > 0) {
      let retentionRate = 0.74 + (qualityFactor * 0.12) + (song.isClassic ? 0.06 : 0);
      if (song.longevityCurve === 'explosive_drop') {
        retentionRate = Math.min(retentionRate, 0.65 + qualityFactor * 0.08);
      } else if (song.longevityCurve === 'instant_classic') {
        retentionRate = Math.max(retentionRate, 0.86 + qualityFactor * 0.08);
      } else if (song.longevityCurve === 'slow_burn' && ageMonths <= 6) {
        retentionRate = Math.max(retentionRate, 0.92);
      }
      retentionRate = Math.min(0.94, retentionRate);

      const momentumFloor = Math.floor(song.streamsLastMonth * retentionRate);
      if (calculatedStreams < momentumFloor) {
        calculatedStreams = momentumFloor;
      }
    }

    // 11. Piso de streams de catálogo que escala con el tamaño actual del artista
    // Evita que temas antiguos caigan a números insignificantes si el artista se volvió masivo
    let tierPopFloor = 10;
    if (artist.stats.popularity <= 20) {
      // Underground: 10 a 60
      tierPopFloor = 10 + Math.floor(artist.stats.popularity * 2.5);
    } else if (artist.stats.popularity <= 40) {
      // Emerging: 60 a 800
      const r = (artist.stats.popularity - 20) / 20;
      tierPopFloor = 60 + Math.floor(Math.pow(r, 1.8) * 740);
    } else if (artist.stats.popularity <= 65) {
      // Breakout: 800 a 12,000
      const r = (artist.stats.popularity - 40) / 25;
      tierPopFloor = 800 + Math.floor(Math.pow(r, 1.7) * 11200);
    } else if (artist.stats.popularity <= 85) {
      // Mainstream: 12,000 a 120,000
      const r = (artist.stats.popularity - 65) / 20;
      tierPopFloor = 12000 + Math.floor(Math.pow(r, 1.5) * 108000);
    } else {
      // Superstar: 120,000 a 450,000+
      const r = (artist.stats.popularity - 85) / 15;
      tierPopFloor = 120000 + Math.floor(Math.pow(r, 1.3) * 330000);
    }

    let roleFloorMultiplier = 1.0;
    if (isTopHit) {
      roleFloorMultiplier = 1.8 + (song.isClassic ? 0.6 : 0);
    } else if (isSingleOrPromoted) {
      roleFloorMultiplier = 0.55 + (song.isClassic ? 0.25 : 0);
    } else {
      // Deep cut
      roleFloorMultiplier = 0.12 + (qualityFactor * 0.06);
    }

    const listenerFloorGuarantee = Math.floor(
      (artist.stats.monthlyListeners || 0) * (isTopHit ? 0.012 : isSingleOrPromoted ? 0.0035 : 0.0008)
    );

    const catalogFloor = Math.max(
      15,
      Math.floor(tierPopFloor * roleFloorMultiplier * (0.6 + qualityFactor * 0.4)),
      listenerFloorGuarantee
    );

    // 12. Garantía de jerarquía de catálogo natural (Hit estrella > Singles destacados > Deep cuts)
    // En catálogo activo, un deep cut o tema secundario no puede superar al hit insignia del artista
    // a menos que esté atravesando una explosión viral activa
    if (ageMonths >= 1 && !wentViralNow && !(song.wentViral && ageMonths <= 2) && catalog.length > 1) {
      if (!isTopHit) {
        const leadStreamsLastMonth = topHitSong.streamsLastMonth || 0;
        const leadHistoricalStreams = topHitSong.streamsTotal || 0;
        const leadBenchmark = Math.max(leadStreamsLastMonth, catalogFloor * 2.2, Math.floor(leadHistoricalStreams * 0.03));

        if (isDeepCut) {
          // Un deep cut no puede superar ~35-50% del hit principal en catálogo pasivo
          const maxAllowedDeepCut = Math.max(catalogFloor, Math.floor(leadBenchmark * (0.35 + qualityFactor * 0.15)));
          if (calculatedStreams > maxAllowedDeepCut) {
            calculatedStreams = maxAllowedDeepCut;
          }
        } else if (isSingleOrPromoted) {
          // Un single destacado secundario no puede superar ~75-85% del hit principal
          const maxAllowedSingle = Math.max(catalogFloor, Math.floor(leadBenchmark * (0.75 + qualityFactor * 0.10)));
          if (calculatedStreams > maxAllowedSingle) {
            calculatedStreams = maxAllowedSingle;
          }
        }
      }
    }

    const finalStreams = Math.max(catalogFloor, calculatedStreams);

    return {
      streams: finalStreams,
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

    // Caso 0: Sin catálogo activo o con 0 reproducciones (pre-debut / catálogo vacío)
    if (!hasCatalog || totalMonthlySongStreams <= 0) {
      return 0;
    }

    const safeLoyalty = Math.max(10, Math.min(100, fanbaseLoyalty || 70)) / 100;
    const safeHype = Math.max(0, Math.min(100, hype || 50)) / 100;
    const safePop = Math.max(1, Math.min(100, artistPopularity || 10)) / 100;

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
    const fanFloor = Math.max(1, Math.min(totalMonthlySongStreams, Math.floor(fansCount * 0.45)));

    const finalListeners = Math.min(maxPossibleListeners, Math.max(fanFloor, combined));
    return Math.max(1, finalListeners);
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
    
    const streamsPerFan = 2.5 + Math.min(2.5, safeHype / 30);
    const fanStreamSurge = Math.floor(fansGained * streamsPerFan);
    const mainstreamSurge = Math.floor(safeHype * 80 + safePop * 40 + (Math.pow(safePop / 100, 2) * 5000));
    
    return Math.max(150, fanStreamSurge + mainstreamSurge);
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
    const coreFanSales = Math.floor((artist.stats?.fansCount || 1000) * loyaltyRatio * 0.15);

    // Mainstream popularity scaling
    const popRatio = Math.max(0.01, (artist.stats?.popularity || 10) / 100);
    let algorithmicPopularitySales = 0;
    if (popRatio <= 0.20) {
      algorithmicPopularitySales = Math.floor((artist.stats?.popularity || 10) * 6);
    } else if (popRatio <= 0.40) {
      algorithmicPopularitySales = Math.floor(120 + Math.pow((popRatio - 0.2) / 0.2, 1.8) * 1500);
    } else if (popRatio <= 0.65) {
      algorithmicPopularitySales = Math.floor(1600 + Math.pow((popRatio - 0.4) / 0.25, 1.6) * 14000);
    } else if (popRatio <= 0.85) {
      algorithmicPopularitySales = Math.floor(15600 + Math.pow((popRatio - 0.65) / 0.20, 1.4) * 60000);
    } else {
      algorithmicPopularitySales = Math.floor(75600 + Math.pow((popRatio - 0.85) / 0.15, 1.2) * 130000);
    }

    // Marketing impact
    const marketingMultiplier = 1.0 + Math.min(1.8, marketingBudget / 20000);

    // Hype impact
    const hypeFactor = 0.6 + ((artist.stats?.hype || 30) / 100) * 0.8;

    // Previous singles momentum carry-over
    const singlesMomentumSales = Math.floor(Math.min(30000, (includedSinglesTotalStreams || 0) * 0.0010));

    const calculatedFirstWeekSales = Math.floor(
      (coreFanSales + algorithmicPopularitySales + singlesMomentumSales) *
      formatMultiplier *
      marketingMultiplier *
      hypeFactor
    );

    // Baseline minimum sales
    const minSales = Math.max(25, Math.floor((artist.stats?.popularity || 10) * 8 + (artist.stats?.fansCount || 1000) * 0.03));
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

  /**
   * Calcula la Popularidad Objetivo (0 - 100) en base a los oyentes mensuales reales,
   * catálogo acumulado y canciones posicionadas en los charts.
   * Evita el estancamiento donde un artista con millones de oyentes mantiene popularidad baja.
   */
  static calculateTargetPopularity(
    monthlyListeners: number,
    totalStreams: number = 0,
    hitsCount: number = 0
  ): number {
    const listeners = Math.max(0, monthlyListeners);
    let target = 8;

    if (listeners >= 15000000) {
      // Megastar Global (>15M)
      target = 94 + Math.min(6, Math.floor((listeners - 15000000) / 5000000));
    } else if (listeners >= 8000000) {
      // Superstar Internacional (8M - 15M)
      target = 85 + Math.floor(((listeners - 8000000) / 7000000) * 9);
    } else if (listeners >= 3500000) {
      // Mainstream Consagrado (3.5M - 8M)
      target = 72 + Math.floor(((listeners - 3500000) / 4500000) * 13);
    } else if (listeners >= 1200000) {
      // Hitmaker Continental / Nacional (1.2M - 3.5M)
      target = 58 + Math.floor(((listeners - 1200000) / 2300000) * 14);
    } else if (listeners >= 400000) {
      // Breakout / Consolidado (400k - 1.2M)
      target = 42 + Math.floor(((listeners - 400000) / 800000) * 16);
    } else if (listeners >= 120000) {
      // Emergente Fuerte / Escena Nacional (120k - 400k)
      target = 28 + Math.floor(((listeners - 120000) / 280000) * 14);
    } else if (listeners >= 30000) {
      // Escena Local / Promesa (30k - 120k)
      target = 18 + Math.floor(((listeners - 30000) / 90000) * 10);
    } else if (listeners >= 8000) {
      // Underground Activo (8k - 30k)
      target = 12 + Math.floor(((listeners - 8000) / 22000) * 6);
    } else {
      // Garaje / Principiante (<8k)
      target = Math.max(5, Math.floor(5 + (listeners / 8000) * 7));
    }

    // Bono complementario por hits acumulados en el Top 10
    const hitsBonus = Math.min(6, hitsCount * 2);

    return Math.min(100, Math.max(5, target + hitsBonus));
  }

  /**
   * Calcula la conversión mensual orgánica de oyentes a fans leales (comunidad).
   * Un artista con millones de oyentes y buena música debe acumular una base de fans proporcional.
   */
  static calculateMonthlyFanConversion(
    monthlyListeners: number,
    currentFans: number,
    hype: number = 50,
    loyalty: number = 70,
    hasRecentRelease: boolean = false
  ): number {
    if (monthlyListeners <= 0) return 0;

    const safeHype = Math.max(0, Math.min(100, hype || 50)) / 100;
    const safeLoyalty = Math.max(10, Math.min(100, loyalty || 70)) / 100;

    // Tasa de conversión mensual: típicamente del 1.2% al 4.0% de los oyentes únicos
    let baseConversionRate = 0.015 + (safeLoyalty * 0.012) + (safeHype * 0.015);
    if (hasRecentRelease) {
      baseConversionRate *= 1.35; // +35% de conversión si hubo lanzamiento reciente
    }

    // Si la base de fans actual es muy pequeña en comparación con los oyentes (ej. 14k fans vs 6M oyentes),
    // se aplica un multiplicador de catch-up orgánico para equilibrar la comunidad rápidamente
    const fansToListenersRatio = currentFans / Math.max(1, monthlyListeners);
    let catchUpMultiplier = 1.0;
    if (fansToListenersRatio < 0.05) {
      catchUpMultiplier = 2.5; // Gran afluencia de nuevos fans descubriendo al artista
    } else if (fansToListenersRatio < 0.15) {
      catchUpMultiplier = 1.6;
    } else if (fansToListenersRatio > 0.40) {
      catchUpMultiplier = 0.7; // Desaceleración natural en bases de fans saturadas
    }

    const newFansMonthly = Math.floor(monthlyListeners * baseConversionRate * catchUpMultiplier);
    return Math.max(5, newFansMonthly);
  }

  /**
   * Obtiene el multiplicador acumulado de streams si la canción se encuentra
   * incluida en una o más listas editoriales activas.
   */
  static getSongPlaylistMultiplier(
    songId: string,
    worldOrPlaylists?: WorldState | Record<string, EditorialPlaylist>
  ): number {
    if (!worldOrPlaylists) return 1.0;
    const playlistsMap: Record<string, EditorialPlaylist> | undefined =
      'playlists' in worldOrPlaylists ? worldOrPlaylists.playlists : (worldOrPlaylists as Record<string, EditorialPlaylist>);
    if (!playlistsMap) return 1.0;

    let maxMultiplier = 1.0;
    let playlistsFound = 0;

    for (const pl of Object.values(playlistsMap)) {
      if (pl.trackIds && pl.trackIds.includes(songId)) {
        if (pl.streamMultiplier > maxMultiplier) {
          maxMultiplier = pl.streamMultiplier;
        }
        playlistsFound++;
      }
    }

    if (playlistsFound > 1) {
      // Sinergia por rotación simultánea en múltiples playlists editoriales
      const synergy = 1.0 + (playlistsFound - 1) * 0.08;
      return Math.min(2.5, Math.round(maxMultiplier * synergy * 100) / 100);
    }

    return maxMultiplier;
  }

  /**
   * Actualiza y rota las canciones de todas las playlists editoriales en base
   * a la novedad, calidad, tracción de streaming y afinidad estilística de cada tema.
   */
  static updatePlaylists(world: WorldState): Record<string, EditorialPlaylist> {
    if (!world.playlists) {
      world.playlists = {};
      for (const pl of EDITORIAL_PLAYLISTS) {
        world.playlists[pl.id] = { ...pl, trackIds: [...pl.trackIds] };
      }
    }

    const allSongs = Object.values(world.songs || {});
    if (allSongs.length === 0) return world.playlists;

    for (const pl of Object.values(world.playlists)) {
      // 1. Filtrar canciones elegibles por lanzamiento y género
      const candidateSongs = allSongs.filter(song => {
        const age = (world.currentYear - song.releaseYear) * 12 + (world.currentMonth - song.releaseMonth);
        if (age < 0) return false;

        if (pl.genreFilters && pl.genreFilters.length > 0) {
          const mainMatch = pl.genreFilters.includes(song.genreId);
          const subMatch = song.subGenreIds?.some(sg => pl.genreFilters.includes(sg));
          if (!mainMatch && !subMatch) return false;
        }

        return true;
      });

      // 2. Puntuar candidatos según perfil editorial
      const scored = candidateSongs.map(song => {
        const artist = world.artists[song.artistId];
        const age = (world.currentYear - song.releaseYear) * 12 + (world.currentMonth - song.releaseMonth);

        // Bonificación por novedad (lanzamientos recientes dominan las playlists)
        let recencyScore = 0;
        if (age <= 1) recencyScore = 42;
        else if (age <= 3) recencyScore = 28;
        else if (age <= 6) recencyScore = 18;
        else if (age <= 12) recencyScore = 8;
        else if (song.isClassic) recencyScore = 14;

        // Calidad y potencial comercial
        const musicalScore = song.quality * 0.35 + song.commercialAppeal * 0.45;

        // Popularidad y tracción del artista
        const artistPop = artist ? artist.stats.popularity : 20;
        const artistHype = artist ? artist.stats.hype : 20;
        const streamLog = Math.min(30, Math.log10((song.streamsLastMonth || 0) + 1) * 5);

        // Afinidades específicas por curaduría
        let synergy = 0;
        if (pl.id === 'descubrimiento_semanal') {
          // Destaca artistas emergentes y breakout con temas brillantes
          if (artistPop <= 58 && song.quality >= 65) synergy += 35;
        } else if (pl.id === 'todays_top_hits') {
          // Los hits masivos del planeta
          if (artistPop >= 70 || (song.streamsLastMonth || 0) > 400000) synergy += 30;
        } else if (pl.id === 'mansion_trap' || pl.id === 'exitos_argentina') {
          if (artist?.country === 'Argentina' || ['trap_latino', 'rock', 'cumbia', 'rkt'].includes(song.genreId)) {
            synergy += 25;
          }
        } else if (pl.id === 'viva_latino' || pl.id === 'baila_reggaeton') {
          if (['Argentina', 'Mexico', 'Spain', 'Colombia', 'Puerto Rico', 'Chile'].includes(artist?.country || '')) {
            synergy += 20;
          }
        }

        const score = musicalScore + recencyScore + (artistPop * 0.3) + (artistHype * 0.2) + streamLog + synergy;
        return { songId: song.id, score };
      });

      scored.sort((a, b) => b.score - a.score);
      pl.trackIds = scored.slice(0, pl.maxTracks).map(s => s.songId);
    }

    return world.playlists;
  }

  /**
   * Generador dinámico de comentarios de fans para YouTube / plataformas de video.
   * Produce reacciones creíbles con likes, avatares, lunfardo argentino/latino,
   * memes virales, citas líricas y menciones a directores o artistas invitados.
   */
  static generateVideoComments(song: Song, artist: Artist, world?: WorldState): YouTubeComment[] {
    const comments: YouTubeComment[] = [];

    const AVATAR_GRADIENTS = [
      'from-purple-500 to-indigo-600',
      'from-rose-500 to-amber-500',
      'from-emerald-400 to-teal-600',
      'from-sky-400 to-blue-600',
      'from-orange-500 to-red-600',
      'from-fuchsia-500 to-purple-700',
      'from-amber-400 to-orange-600',
      'from-cyan-400 to-indigo-700'
    ];

    // 1. Comentario fijado oficial del artista
    comments.push({
      id: `comment_pinned_${song.id}`,
      authorName: artist.name,
      authorHandle: `@${artist.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_oficial`,
      avatarGradient: artist.avatarColor || 'from-violet-600 to-purple-900',
      content: `¡Gracias de corazón a toda la gente que está bancando "${song.title}" desde el minuto cero! ¿Cuál es la barra que más les llegó? Los leo a todos acá abajo 👇🔥`,
      likes: Math.floor(Math.max(120, (song.streamsTotal || 5000) * 0.015 + 450)),
      timeAgo: 'hace 1 día',
      isPinned: true,
      isHeartedByArtist: true,
      sentiment: 'positive'
    });

    // 2. Comentarios con lunfardo y jerga urbana argentina / latina
    const slangTemplates = [
      `nooo hermano qué temazo lpm, pusiste la vara en otra galaxia con "${song.title}"`,
      `el beatswitch del medio me reinició la vida entera, qué producción descomunal`,
      `como te vas a tirar esas barras amigo estás completamente desquiciado`,
      `bancando desde que tenías dos maquetas subidas a Soundcloud, te mereces todo esto y más`,
      `este tema en vivo en el festival va a ser un pogo histórico, no va a quedar una valla sana`,
      `el flow que clavó en el segundo verso no tiene ningún tipo de sentido, una cátedra`,
      `literalmente revivió la música con este lanzamiento, qué orgullo de escena`,
      `el coro se me pegó al cerebro y no puedo parar de cantarlo en el laburo`
    ];

    const USER_PROFILES = [
      { name: 'Lautaro Gómez', handle: '@lautaro_baires' },
      { name: 'Valentina Rossi', handle: '@valen_mdp' },
      { name: 'Franco Fernández', handle: '@fran_flow77' },
      { name: 'Camila Benítez', handle: '@cami_urban' },
      { name: 'Matias Álvarez', handle: '@mati_cordoba' },
      { name: 'Sofía Navarro', handle: '@sofi_musica' },
      { name: 'Lucas Pereyra', handle: '@lucas_trap_arg' },
      { name: 'Agustina Ríos', handle: '@agus_vibes' },
      { name: 'Thiago Morales', handle: '@thiago_bars' },
      { name: 'Micaela Duarte', handle: '@mica_beats' }
    ];

    // Mezclar y agregar comentarios en lunfardo
    for (let i = 0; i < 4; i++) {
      const profile = USER_PROFILES[i % USER_PROFILES.length];
      const text = slangTemplates[i % slangTemplates.length];
      const grad = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
      const commentLikes = Math.floor(Math.max(25, (song.streamsTotal || 2000) * 0.003 * (4 - i) + 40));

      comments.push({
        id: `comment_slang_${song.id}_${i}`,
        authorName: profile.name,
        authorHandle: profile.handle,
        avatarGradient: grad,
        content: text,
        likes: commentLikes,
        timeAgo: `${i * 3 + 2} horas`,
        isHeartedByArtist: i === 0,
        sentiment: 'hype'
      });
    }

    // 3. Comentarios de humor y memes de YouTube
    const memeTemplates = [
      `0% autotune, 0% polémicas baratas, 100% talento y corazón puro.`,
      `Mi psicóloga: "La música no puede curarte". / Esta canción a las 3 de la mañana:`,
      `El algoritmo de YouTube por fin recomendó una obra maestra en lugar de videos raros.`,
      `Like si estás acá antes de los 10 millones de reproducciones 🔥`,
      `La batería y el bajo de "${song.title}" están pagando el alquiler de mis auriculares.`,
      `Nadie: / Absolutamente nadie: / ${artist.name} lanzando la mayor joya del año sin avisar:`
    ];

    for (let i = 0; i < 3; i++) {
      const profile = USER_PROFILES[(i + 4) % USER_PROFILES.length];
      const text = memeTemplates[i % memeTemplates.length];
      const grad = AVATAR_GRADIENTS[(i + 4) % AVATAR_GRADIENTS.length];
      const commentLikes = Math.floor(Math.max(40, (song.streamsTotal || 2500) * 0.004 * (3 - i) + 85));

      comments.push({
        id: `comment_meme_${song.id}_${i}`,
        authorName: profile.name,
        authorHandle: profile.handle,
        avatarGradient: grad,
        content: text,
        likes: commentLikes,
        timeAgo: `${i * 5 + 6} horas`,
        sentiment: 'meme'
      });
    }

    // 4. Mención a la dirección del videoclip si existe
    if (song.musicVideo) {
      comments.push({
        id: `comment_video_director_${song.id}`,
        authorName: 'Marcos Visuals',
        authorHandle: '@marcos_filmmaker',
        avatarGradient: 'from-zinc-700 to-neutral-900',
        content: `La dirección de arte de ${song.musicVideo.directorTier} en este video es una locura absoluta. El concepto "${song.musicVideo.concept}" parece una película cinematográfica de Hollywood, qué nivel visual.`,
        likes: Math.floor(Math.max(50, (song.streamsTotal || 3000) * 0.005 + 130)),
        timeAgo: 'hace 18 horas',
        isHeartedByArtist: true,
        sentiment: 'analytical'
      });
    }

    // 5. Mención a colaboraciones si cuenta con feats
    if (song.featuredArtistIds && song.featuredArtistIds.length > 0 && world?.artists) {
      for (const featId of song.featuredArtistIds) {
        const featArtist = world.artists[featId];
        if (featArtist) {
          comments.push({
            id: `comment_feat_${featId}_${song.id}`,
            authorName: 'Lucía Santoro',
            authorHandle: '@lu_musicbox',
            avatarGradient: 'from-rose-500 to-indigo-600',
            content: `La química vocal entre ${artist.name} y ${featArtist.name} es de otro planeta. La manera en que combinaron los estilos demuestra por qué son los mejores de la escena. ¡Necesitamos un EP juntos ya!`,
            likes: Math.floor(Math.max(60, (song.streamsTotal || 4000) * 0.006 + 210)),
            timeAgo: 'hace 1 día',
            sentiment: 'positive'
          });
        }
      }
    }

    // 6. Comentario de apreciación lírica
    comments.push({
      id: `comment_lyric_${song.id}`,
      authorName: 'Joaquín Estévez',
      authorHandle: '@joaco_critica',
      avatarGradient: 'from-teal-500 to-emerald-700',
      content: `La evolución sonora de ${artist.name} es admirable. En "${song.title}" no solo hay ritmo, hay narrativa y madurez musical. Definitivamente uno de los puntos más altos de su catálogo.`,
      likes: Math.floor(Math.max(30, (song.streamsTotal || 2000) * 0.002 + 75)),
      timeAgo: 'hace 2 días',
      sentiment: 'analytical'
    });

    return comments;
  }

  /**
   * Simula una campaña de snippets promocionales en TikTok / Reels para impulsar un tema.
   * Evalúa presupuesto, concepto del trend, tier de creadores, afinidad con el género
   * y calcula visualizaciones generadas, creaciones UGC de usuarios, conversión
   * a streams en plataformas digitales y nuevos oyentes mensuales.
   */
  static simulateSnippetCampaign(
    params: SnippetCampaignConfig & { song: Song; artist: Artist }
  ): SnippetCampaignResult {
    const { song, artist, budget, concept } = params;
    const safeBudget = Math.max(250, budget || 1000);

    // 1. Determinar el tier de creadores
    let tier: TikTokInfluencerTier = params.influencerTier || 'micro';
    if (!params.influencerTier) {
      if (safeBudget >= 14000) tier = 'mega';
      else if (safeBudget >= 3500) tier = 'macro';
      else tier = 'micro';
    }

    // Views base por dólar invertido según el tier de influencer
    let viewsPerDollar = 380;
    if (tier === 'macro') viewsPerDollar = 290;
    else if (tier === 'mega') viewsPerDollar = 220;

    // 2. Potencial del gancho auditivo (Hook Score)
    const hookQuality = (song.commercialAppeal * 0.45) + (song.quality * 0.30) + (song.originality * 0.25);

    // 3. Sinergia del concepto con el género musical
    let synergyBoost = 1.0;
    const genreStr = (song.genreId || '').toLowerCase();
    const conceptStr = (concept || '').toLowerCase();

    if (conceptStr.includes('baile') || conceptStr.includes('coreograf')) {
      if (['reggaeton', 'urban', 'pop', 'latin_pop', 'dembow', 'rkt'].includes(genreStr)) {
        synergyBoost = 1.35;
      }
    } else if (conceptStr.includes('meme') || conceptStr.includes('sped up') || conceptStr.includes('acelerado')) {
      if (['trap_latino', 'drill', 'synthwave', 'pop', 'hip_hop'].includes(genreStr)) {
        synergyBoost = 1.30;
      }
    } else if (conceptStr.includes('drop') || conceptStr.includes('gimnasio') || conceptStr.includes('motivaci')) {
      if (['trap_latino', 'electronic', 'rock', 'drill'].includes(genreStr)) {
        synergyBoost = 1.30;
      }
    } else if (conceptStr.includes('pov') || conceptStr.includes('melanc')) {
      if (['indie_rock', 'alternative', 'r&b', 'bedroom_pop'].includes(genreStr)) {
        synergyBoost = 1.35;
      }
    } else if (conceptStr.includes('lip-sync') || conceptStr.includes('glow-up')) {
      synergyBoost = 1.20;
    }

    // 4. Tracción y cálculo de reproducciones de video en TikTok
    const hypeBonus = 1.0 + ((artist.stats.hype || 30) / 160);
    const charismaBonus = 1.0 + ((artist.personality.charisma || 60) / 300);
    const overallMultiplier = (hookQuality / 52) * synergyBoost * hypeBonus * charismaBonus;

    const tiktokViews = Math.max(12000, Math.floor(safeBudget * viewsPerDollar * overallMultiplier));
    const reach = Math.floor(tiktokViews * 0.68);

    // 5. Creaciones UGC (User-Generated Content con el audio oficial)
    const ugcCreations = Math.max(15, Math.floor(tiktokViews / (220 + Math.random() * 110)));

    // 6. Nivel de viralidad
    let viralTier: 'global' | 'nacional' | 'local' | 'none' = 'none';
    if (tiktokViews >= 8000000) viralTier = 'global';
    else if (tiktokViews >= 2000000) viralTier = 'nacional';
    else if (tiktokViews >= 450000) viralTier = 'local';

    const isViralTrend = viralTier !== 'none';

    // 7. Conversión a streams en DSPs (Spotify, Apple Music, etc.)
    // Entre el 2.2% y 4.8% de los espectadores buscan la canción completa
    const conversionRate = 0.022 + (song.commercialAppeal / 100) * 0.025;
    const streamsBoostGenerated = Math.floor(tiktokViews * conversionRate);

    // Nuevos oyentes mensuales y fans ganados
    const monthlyListenersGained = Math.floor(streamsBoostGenerated / 3.1);
    const fansGained = Math.max(10, Math.floor(monthlyListenersGained * 0.045));
    const hypeGained = Math.min(38, Math.floor(6 + (tiktokViews / 550000) * 3));

    // 8. Titulares y reacción comunitaria
    let headline = '';
    let communityReaction = '';

    if (viralTier === 'global') {
      headline = `Fenómeno Global: El audio de "${song.title}" explota en TikTok con ${(tiktokViews / 1000000).toFixed(1)}M de reproducciones`;
      communityReaction = `Celebridades e influencers de todo el mundo están usando el audio. El trend se convirtió en un desafío viral internacional que catapultó a ${artist.name} a las listas globales.`;
    } else if (viralTier === 'nacional') {
      headline = `Trend Viral: "${song.title}" domina las redes y suma más de ${(tiktokViews / 1000000).toFixed(1)}M de vistas`;
      communityReaction = `Gran recepción entre creadores de contenido del país. Miles de personas crearon videos con el audio bajo el concepto "${concept}".`;
    } else if (viralTier === 'local') {
      headline = `Campaña efectiva: El snippet de "${song.title}" genera tracción orgánica con ${(tiktokViews / 1000).toFixed(0)}k vistas`;
      communityReaction = `La comunidad de seguidores y creadores emergentes compartió el sonido masivamente, generando un flujo constante de nuevos oyentes.`;
    } else {
      headline = `Campaña completada: "${song.title}" acumula ${(tiktokViews / 1000).toFixed(0)}k reproducciones en TikTok`;
      communityReaction = `Difusión adecuada para reforzar el lanzamiento entre los fanáticos del género sin llegar a detonar una ola viral masiva.`;
    }

    return {
      success: true,
      reach,
      tiktokViews,
      ugcCreations,
      streamsBoostGenerated,
      monthlyListenersGained,
      fansGained,
      hypeGained,
      isViralTrend,
      viralTier,
      headline,
      communityReaction,
      costSpent: safeBudget
    };
  }
}

