import {
  WorldState,
  Artist,
  Song,
  Album,
  Tour,
  TourTier,
  LabelContract,
  EventDefinition,
  EventOutcome,
  GameSaveState,
  MusicRegion
} from '../types';
import { INITIAL_ARTISTS } from '../data/initialArtists';
import { INITIAL_GENRES } from '../data/genres';
import { INITIAL_LABELS } from '../data/labels';
import { INITIAL_PRODUCERS, INITIAL_MANAGERS } from '../data/producersAndManagers';
import { WorldSimulation } from '../systems/WorldSimulation';
import { ChartEngine } from '../systems/ChartEngine';
import { AwardEngine } from '../systems/AwardEngine';
import { GenreTrendEngine } from '../systems/GenreTrendEngine';
import { EventEngine } from '../systems/EventEngine';
import { EconomyEngine } from '../systems/EconomyEngine';
import { TourEngine } from '../systems/TourEngine';
import { StreamingEngine } from '../systems/StreamingEngine';
import { RelationshipEngine } from '../systems/RelationshipEngine';
import { LegacyEngine } from '../systems/LegacyEngine';
import { TimeSystem } from '../systems/TimeSystem';

export class GameEngine {
  private world: WorldState;
  private playerId: string;
  private currentEvent: EventDefinition | null = null;
  private onStateChangeListeners: Array<(world: WorldState, player: Artist, currentEvent: EventDefinition | null) => void> = [];

  constructor(customPlayer?: Partial<Artist>) {
    this.world = this.createDefaultWorld();
    if (customPlayer) {
      this.playerId = customPlayer.id || 'artist_player_1';
      const playerArtist: Artist = {
        id: this.playerId,
        name: customPlayer.name || 'Mi Artista',
        realName: customPlayer.realName || 'Nombre Real',
        isPlayer: true,
        avatarColor: customPlayer.avatarColor || 'from-amber-500 to-rose-600',
        country: customPlayer.country || 'Argentina',
        city: customPlayer.city || 'Buenos Aires',
        birthYear: customPlayer.birthYear || 2006,
        careerStartYear: customPlayer.careerStartYear || 2026,
        mainGenreId: customPlayer.mainGenreId || 'trap_latino',
        subGenreIds: customPlayer.subGenreIds || [],
        personality: customPlayer.personality || {
          creativity: 85,
          ambition: 85,
          discipline: 80,
          charisma: 85,
          skill: 85,
          commercialAppeal: 80,
          originality: 85,
          riskTolerance: 80,
          sociability: 80,
          independence: 75
        },
        stats: customPlayer.stats || {
          popularity: 20,
          reputation: 50,
          artisticCredibility: 60,
          energy: 100,
          monthlyListeners: 25000,
          totalStreams: 80000,
          funds: 4500,
          fansCount: 12000,
          fanbaseLoyalty: 75,
          hype: 55
        },
        careerStage: 'Underground',
        labelId: null,
        managerId: null,
        relationships: {},
        eras: [
          {
            id: `era_${this.playerId}_debut`,
            name: 'Los Primeros Pasos & Grabaciones Caseras',
            startYear: 2026,
            startMonth: 1,
            genreFocus: customPlayer.mainGenreId || 'trap_latino',
            stage: 'Underground',
            highlightSummary: 'Inicios del camino artístico y primeras grabaciones en el estudio.'
          }
        ],
        awardsWon: [],
        legacyScore: 12,
        isRetired: false,
        historicalNotes: ['Comenzó su carrera artística en 2026.'],
        generationIndex: 1,
        influences: []
      };
      this.world.artists[this.playerId] = playerArtist;
    } else {
      // Default to picking an initial player or creating one
      this.playerId = 'artist_player_1';
    }
  }

  private createDefaultWorld(): WorldState {
    return {
      currentYear: 2026,
      currentMonth: 1,
      activeTrendIds: [],
      genres: JSON.parse(JSON.stringify(INITIAL_GENRES)),
      trends: {},
      artists: JSON.parse(JSON.stringify(INITIAL_ARTISTS)),
      songs: {},
      albums: {},
      labels: JSON.parse(JSON.stringify(INITIAL_LABELS)),
      producers: JSON.parse(JSON.stringify(INITIAL_PRODUCERS)),
      managers: JSON.parse(JSON.stringify(INITIAL_MANAGERS)),
      tours: [],
      charts: {
        Global: { region: 'Global', year: 2026, month: 1, entries: [] },
        Argentina: { region: 'Argentina', year: 2026, month: 1, entries: [] },
        LatinAmerica: { region: 'LatinAmerica', year: 2026, month: 1, entries: [] },
        USA: { region: 'USA', year: 2026, month: 1, entries: [] },
        Europe: { region: 'Europe', year: 2026, month: 1, entries: [] },
        Spain: { region: 'Spain', year: 2026, month: 1, entries: [] },
        Mexico: { region: 'Mexico', year: 2026, month: 1, entries: [] }
      },
      awardsHistory: [],
      news: [
        {
          id: 'news_init_1',
          headline: 'Comienza una nueva era en la industria de la música',
          body: 'Productores independientes y nuevas voces prometen redefinir los charts y las tendencias sonoras.',
          year: 2026,
          month: 1,
          category: 'culture',
          relatedArtistIds: [],
          sentiment: 'positive',
          importance: 4
        }
      ],
      records: [],
      globalHistoryTimeline: [
        { year: 2026, month: 1, text: 'Inicio de la simulación musical.', category: 'world' }
      ],
      recentEventIdsHistory: [],
      activeNarrativeChains: {}
    };
  }

  public subscribe(listener: (world: WorldState, player: Artist, currentEvent: EventDefinition | null) => void): () => void {
    this.onStateChangeListeners.push(listener);
    listener(this.world, this.getPlayer(), this.currentEvent);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const player = this.getPlayer();
    this.onStateChangeListeners.forEach(listener => listener(this.world, player, this.currentEvent));
  }

  public getWorld(): WorldState {
    return this.world;
  }

  public getPlayer(): Artist {
    return this.world.artists[this.playerId] || Object.values(this.world.artists)[0];
  }

  public getCurrentEvent(): EventDefinition | null {
    return this.currentEvent;
  }

  public setPlayer(playerArtist: Artist) {
    this.playerId = playerArtist.id;
    this.world.artists[this.playerId] = playerArtist;
    this.notify();
  }

  // --- ACTIONS ---

  public releaseSong(params: {
    title: string;
    genreId: string;
    subGenreIds: string[];
    featuredArtistIds: string[];
    producerId?: string;
    budgetProduction: number;
    budgetMarketing: number;
    longevityCurve: Song['longevityCurve'];
  }): Song {
    const player = this.getPlayer();
    const songId = `song_${player.id}_${this.world.currentYear}_${this.world.currentMonth}_${Math.floor(Math.random() * 1000)}`;

    const prod = params.producerId ? this.world.producers[params.producerId] : undefined;
    const qualityBoost = prod ? prod.qualityBoost : 0;

    // Quality calculation based on player stats + production investment + producer
    const baseQuality = Math.min(100, Math.floor(player.personality.skill * 0.5 + player.personality.creativity * 0.3 + (params.budgetProduction / 5000) * 15 + qualityBoost));
    const commercialAppeal = Math.min(100, Math.floor(player.personality.commercialAppeal * 0.6 + (params.budgetMarketing / 5000) * 20));
    const originality = player.personality.originality;

    // Deduct player funds and energy
    const totalCost = params.budgetProduction + params.budgetMarketing + (prod ? prod.costPerTrack : 0);
    player.stats.funds = Math.max(0, player.stats.funds - totalCost);
    player.stats.energy = Math.max(10, player.stats.energy - 15);
    player.stats.hype = Math.min(100, player.stats.hype + Math.floor(params.budgetMarketing / 2000) * 10 + 15);
    player.lastReleaseYear = this.world.currentYear;
    player.lastReleaseMonth = this.world.currentMonth;

    const newSong: Song = {
      id: songId,
      title: params.title,
      artistId: player.id,
      featuredArtistIds: params.featuredArtistIds,
      producerId: params.producerId,
      genreId: params.genreId,
      subGenreIds: params.subGenreIds,
      releaseYear: this.world.currentYear,
      releaseMonth: this.world.currentMonth,
      quality: baseQuality,
      commercialAppeal,
      originality,
      hypeAtRelease: player.stats.hype,
      streamsTotal: 0,
      streamsLastMonth: 0,
      monthlyStreamsHistory: [],
      peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
      weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
      longevityCurve: params.longevityCurve,
      isSingle: true,
      receptionRating: Math.floor(baseQuality / 20),
      isClassic: false,
      wentViral: false
    };

    this.world.songs[songId] = newSong;

    this.world.news.unshift({
      id: `news_rel_${songId}`,
      headline: `Lanzamiento: "${params.title}" de ${player.name} ya está disponible`,
      body: `El nuevo single de ${player.name} llega con producción de alto calibre y gran expectativa.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'release',
      relatedArtistIds: [player.id, ...params.featuredArtistIds],
      sentiment: 'positive',
      importance: 3
    });

    this.notify();
    return newSong;
  }

  public releaseAlbum(params: {
    title: string;
    type: Album['type'];
    genreId: string;
    subGenreIds: string[];
    songTitles: string[];
    budgetProduction: number;
    budgetMarketing: number;
    producerId?: string;
  }): Album {
    const player = this.getPlayer();
    const albumId = `album_${player.id}_${this.world.currentYear}_${this.world.currentMonth}`;

    const prod = params.producerId ? this.world.producers[params.producerId] : undefined;
    const qualityBoost = prod ? prod.qualityBoost : 0;

    const totalCost = params.budgetProduction + params.budgetMarketing + (prod ? prod.costPerTrack * 2 : 0);
    player.stats.funds = Math.max(0, player.stats.funds - totalCost);
    player.stats.energy = Math.max(10, player.stats.energy - 35);
    player.stats.hype = Math.min(100, player.stats.hype + 35);
    player.lastReleaseYear = this.world.currentYear;
    player.lastReleaseMonth = this.world.currentMonth;

    const songIds: string[] = [];
    const avgQuality = Math.min(100, Math.floor(player.personality.skill * 0.5 + player.personality.creativity * 0.4 + qualityBoost + (params.budgetProduction / 10000) * 15));

    params.songTitles.forEach((st, idx) => {
      const sId = `song_alb_${player.id}_${this.world.currentYear}_${idx}`;
      const song: Song = {
        id: sId,
        title: st,
        artistId: player.id,
        featuredArtistIds: [],
        producerId: params.producerId,
        genreId: params.genreId,
        subGenreIds: params.subGenreIds,
        releaseYear: this.world.currentYear,
        releaseMonth: this.world.currentMonth,
        quality: avgQuality + Math.floor(Math.random() * 8 - 4),
        commercialAppeal: Math.floor(player.personality.commercialAppeal * 0.7 + (params.budgetMarketing / 10000) * 15),
        originality: player.personality.originality,
        hypeAtRelease: player.stats.hype,
        streamsTotal: 0,
        streamsLastMonth: 0,
        monthlyStreamsHistory: [],
        peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
        weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
        longevityCurve: idx === 0 ? 'explosive_drop' : idx === 1 ? 'instant_classic' : 'steady',
        isSingle: idx < 2,
        albumId,
        receptionRating: Math.floor(avgQuality / 20),
        isClassic: false,
        wentViral: false
      };
      this.world.songs[sId] = song;
      songIds.push(sId);
    });

    const gradients = [
      'from-amber-600 via-rose-950 to-black',
      'from-purple-900 via-zinc-950 to-blue-950',
      'from-emerald-700 via-teal-950 to-black',
      'from-cyan-700 via-indigo-950 to-zinc-950'
    ];

    const newAlbum: Album = {
      id: albumId,
      title: params.title,
      artistId: player.id,
      type: params.type,
      songIds,
      genreId: params.genreId,
      subGenreIds: params.subGenreIds,
      releaseYear: this.world.currentYear,
      releaseMonth: this.world.currentMonth,
      totalStreams: 0,
      firstWeekSales: Math.floor(player.stats.popularity * 1500 + params.budgetMarketing * 0.4),
      criticalScore: Math.floor(avgQuality * 0.75 + player.personality.originality * 0.25),
      commercialScore: Math.floor(player.personality.commercialAppeal * 0.6 + player.stats.popularity * 0.4),
      peakChartPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
      awards: [],
      coverGradient: gradients[Object.keys(this.world.albums).length % gradients.length]
    };

    this.world.albums[albumId] = newAlbum;

    this.world.news.unshift({
      id: `news_alb_${albumId}`,
      headline: `¡Álbum Estelar! "${params.title}" de ${player.name} ve la luz`,
      body: `Con ${songIds.length} canciones, ${player.name} presenta una propuesta conceptual que promete marcar un antes y un después.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'release',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 4
    });

    this.notify();
    return newAlbum;
  }

  public bookTour(tier: TourTier, name: string): Tour {
    const player = this.getPlayer();
    const tour = TourEngine.generateTourPlan(player, tier, name, this.world.currentYear, this.world.currentMonth);

    this.world.tours.push(tour);
    player.stats.funds += tour.netArtistProfit;
    player.stats.energy = Math.max(5, player.stats.energy - tour.energyFatigue);
    player.stats.hype = Math.min(100, player.stats.hype + tour.hypeGenerated);
    player.stats.fansCount += tour.fanbaseGained;

    this.world.news.unshift({
      id: `news_tour_${tour.id}`,
      headline: `Gira Consagratoria: ${tour.name} culmina con ${tour.totalTicketsSold.toLocaleString()} tickets vendidos`,
      body: `${player.name} brilló en cada una de sus fechas, generando una ganancia neta de $${tour.netArtistProfit.toLocaleString()}.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'tour',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 4
    });

    this.notify();
    return tour;
  }

  public signContract(contract: LabelContract) {
    const player = this.getPlayer();
    player.labelId = contract.labelId;
    player.stats.funds += contract.signingBonus;
    const label = this.world.labels[contract.labelId];
    if (label) {
      if (!label.rosterArtistIds.includes(player.id)) {
        label.rosterArtistIds.push(player.id);
      }
    }
    this.notify();
  }

  public hireManager(managerId: string) {
    const player = this.getPlayer();
    player.managerId = managerId;
    this.notify();
  }

  public interactWithArtist(targetArtistId: string, actionType: 'collab_request' | 'shoutout' | 'diss') {
    const player = this.getPlayer();
    const target = this.world.artists[targetArtistId];
    if (!target) return;

    if (actionType === 'collab_request') {
      const result = RelationshipEngine.calculateCollabFeasibility(player, target);
      if (result.willAccept) {
        RelationshipEngine.modifyRelationship(
          player,
          target,
          20,
          15,
          'collaborator',
          `Aceptaron colaborar juntos en ${this.world.currentYear}.`
        );
        player.stats.hype = Math.min(100, player.stats.hype + 18);
        this.world.news.unshift({
          id: `news_collab_${Date.now()}`,
          headline: `Alianza confirmada: ${player.name} y ${target.name} anuncian colaboración`,
          body: `Los fanáticos celebran la unión de dos fuerzas musicales complementarias.`,
          year: this.world.currentYear,
          month: this.world.currentMonth,
          category: 'culture',
          relatedArtistIds: [player.id, target.id],
          sentiment: 'positive',
          importance: 3
        });
      } else {
        RelationshipEngine.modifyRelationship(player, target, -5, 0, undefined, `Propuesta de colaboración rechazada en ${this.world.currentYear}.`);
      }
    } else if (actionType === 'shoutout') {
      RelationshipEngine.modifyRelationship(player, target, 15, 10, 'friend', `Mención pública elogiosa en ${this.world.currentYear}.`);
      player.stats.hype = Math.min(100, player.stats.hype + 5);
    } else if (actionType === 'diss') {
      RelationshipEngine.modifyRelationship(player, target, -40, 10, 'feud', `Tiradera y feudo desatado en ${this.world.currentYear}.`);
      player.stats.hype = Math.min(100, player.stats.hype + 25);
      this.world.news.unshift({
        id: `news_diss_${Date.now()}`,
        headline: `¡Fuego cruzado! ${player.name} apunta contra ${target.name}`,
        body: `Declaraciones incendiarias desatan la polémica en las redes.`,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: 'rivalry',
        relatedArtistIds: [player.id, target.id],
        sentiment: 'shocking',
        importance: 4
      });
    }

    this.notify();
  }

  public restAndRecharge() {
    const player = this.getPlayer();
    player.stats.energy = Math.min(100, player.stats.energy + 40);
    this.notify();
  }

  public resolveCurrentEventChoice(choiceIndex: number): EventOutcome | null {
    if (!this.currentEvent) return null;
    const player = this.getPlayer();
    const choices = this.currentEvent.choices({
      player,
      world: this.world,
      currentYear: this.world.currentYear,
      currentMonth: this.world.currentMonth
    });

    const chosen = choices[choiceIndex];
    if (!chosen) return null;

    const outcome = chosen.apply({
      player,
      world: this.world,
      currentYear: this.world.currentYear,
      currentMonth: this.world.currentMonth
    });

    // Apply outcome deltas
    if (outcome.fundsChange) player.stats.funds = Math.max(0, player.stats.funds + outcome.fundsChange);
    if (outcome.hypeChange) player.stats.hype = Math.max(0, Math.min(100, player.stats.hype + outcome.hypeChange));
    if (outcome.popularityChange) player.stats.popularity = Math.max(0, Math.min(100, player.stats.popularity + outcome.popularityChange));
    if (outcome.fansChange) player.stats.fansCount = Math.max(0, player.stats.fansCount + outcome.fansChange);
    if (outcome.reputationChange) player.stats.reputation = Math.max(0, Math.min(100, player.stats.reputation + outcome.reputationChange));
    if (outcome.energyChange) player.stats.energy = Math.max(0, Math.min(100, player.stats.energy + outcome.energyChange));

    if (outcome.statChanges) {
      Object.assign(player.stats, outcome.statChanges);
    }
    if (outcome.personalityChanges) {
      Object.assign(player.personality, outcome.personalityChanges);
    }
    if (outcome.newContract) {
      this.signContract(outcome.newContract);
    }
    if (outcome.relationshipChanges) {
      for (const rc of outcome.relationshipChanges) {
        const target = this.world.artists[rc.targetArtistId];
        if (target) {
          RelationshipEngine.modifyRelationship(player, target, rc.affinityDelta, 0, rc.relationType, rc.historyEntry);
        }
      }
    }
    if (outcome.newsGenerated) {
      this.world.news.unshift({
        id: `news_evt_${Date.now()}`,
        headline: outcome.newsGenerated.headline,
        body: outcome.newsGenerated.body,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: outcome.newsGenerated.category,
        relatedArtistIds: [player.id],
        sentiment: outcome.newsGenerated.sentiment,
        importance: 3
      });
    }

    this.currentEvent = null;
    this.notify();
    return outcome;
  }

  public advanceMonth() {
    const isNewYear = this.world.currentMonth === 12;
    const player = this.getPlayer();

    // 1. Natural monthly energy recovery & hype decay
    player.stats.energy = Math.min(100, player.stats.energy + 10);
    player.stats.hype = Math.max(10, Math.floor(player.stats.hype * 0.95));

    // 2. World Simulation (NPC releases, autonomous evolution)
    WorldSimulation.simulateMonth(this.world);

    // 3. Player streaming & finances
    const activeTrends = Object.values(this.world.trends).filter(t => t.stage !== 'exhausted');
    const playerSongs = Object.values(this.world.songs).filter(s => s.artistId === player.id);
    let playerTotalMonthlyStreams = 0;

    for (const song of playerSongs) {
      const streamRes = StreamingEngine.calculateSongMonthlyStreams(
        song,
        player,
        this.world.currentYear,
        this.world.currentMonth,
        activeTrends,
        this.world.genres[song.genreId]
      );
      song.streamsLastMonth = streamRes.streams;
      song.streamsTotal += streamRes.streams;
      song.monthlyStreamsHistory.push(streamRes.streams);
      if (streamRes.wentViralNow) song.wentViral = true;
      if (streamRes.becomesClassicNow) song.isClassic = true;
      playerTotalMonthlyStreams += streamRes.streams;
    }

    player.stats.totalStreams += playerTotalMonthlyStreams;
    player.stats.monthlyListeners = StreamingEngine.calculateMonthlyListeners(
      playerTotalMonthlyStreams,
      player.stats.popularity,
      player.stats.fansCount
    );

    // Monthly economy settlement
    const label = player.labelId ? this.world.labels[player.labelId] : undefined;
    const manager = player.managerId ? this.world.managers[player.managerId] : undefined;
    const finance = EconomyEngine.calculateMonthlyFinances(player, playerTotalMonthlyStreams, label, manager);
    player.stats.funds = Math.max(0, player.stats.funds + finance.netMonthlyProfit);

    // 4. Update genres and trends
    const genreTrendRes = GenreTrendEngine.updateGenresAndTrends(this.world, isNewYear);
    this.world.genres = genreTrendRes.updatedGenres;
    this.world.trends = genreTrendRes.updatedTrends;
    if (genreTrendRes.newTrendSpawned) {
      this.world.news.unshift({
        id: `news_trend_${genreTrendRes.newTrendSpawned.id}`,
        headline: `Tendencia en alza: ${genreTrendRes.newTrendSpawned.name}`,
        body: genreTrendRes.newTrendSpawned.description,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: 'trend',
        relatedArtistIds: [],
        sentiment: 'positive',
        importance: 3
      });
    }

    // 5. Update Regional Charts
    const chartRes = ChartEngine.calculateRegionalCharts(this.world, this.world.songs, this.world.artists);
    this.world.charts = chartRes.updatedCharts;
    for (const cNews of chartRes.chartMilestoneNews) {
      this.world.news.unshift({
        id: `news_chart_${Date.now()}_${Math.random()}`,
        headline: cNews.headline,
        body: cNews.body,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: 'chart',
        relatedArtistIds: [cNews.relatedArtistId],
        sentiment: 'positive',
        importance: 4
      });
    }

    // 6. Annual awards on December end
    if (isNewYear) {
      const awardRes = AwardEngine.conductAnnualAwards(this.world, this.world.currentYear);
      this.world.awardsHistory.unshift(awardRes.ceremony);
      for (const aNews of awardRes.awardNews) {
        this.world.news.unshift({
          id: `news_award_${Date.now()}_${Math.random()}`,
          headline: aNews.headline,
          body: aNews.body,
          year: this.world.currentYear,
          month: this.world.currentMonth,
          category: 'award',
          relatedArtistIds: [aNews.relatedArtistId],
          sentiment: 'positive',
          importance: 5
        });
      }
    }

    // 7. Update player career stage & legacy
    const yearsActive = TimeSystem.calculateCareerLengthYears(player.careerStartYear, this.world.currentYear);
    const hitsCount = playerSongs.filter(s => (s.peakPosition?.Global ?? 99) <= 10).length;
    const no1sCount = playerSongs.filter(s => (s.peakPosition?.Global ?? 99) === 1 || (s.peakPosition?.Argentina ?? 99) === 1).length;
    player.careerStage = LegacyEngine.evaluateCareerStage(player, yearsActive, hitsCount);
    player.legacyScore = LegacyEngine.calculateLegacyScore(player, hitsCount, no1sCount);
    LegacyEngine.checkAndCreateEra(player, this.world.currentYear, this.world.currentMonth);

    // 8. Event selection for player (approx 60% chance per month to have an active event if none pending)
    if (Math.random() < 0.65) {
      const nextEvt = EventEngine.selectNextEvent(
        {
          player,
          world: this.world,
          currentYear: this.world.currentYear,
          currentMonth: this.world.currentMonth
        },
        this.world.recentEventIdsHistory
      );
      if (nextEvt) {
        this.currentEvent = nextEvt;
        this.world.recentEventIdsHistory.push({
          eventId: nextEvt.id,
          year: this.world.currentYear,
          month: this.world.currentMonth
        });
      }
    }

    // Advance Time
    const nextTime = TimeSystem.advanceTime(this.world.currentYear, this.world.currentMonth);
    this.world.currentYear = nextTime.year;
    this.world.currentMonth = nextTime.month;

    this.notify();
  }

  // --- SAVE / LOAD ---
  public exportSaveState(): string {
    const save: GameSaveState = {
      version: 1,
      seed: 123456,
      savedAt: new Date().toISOString(),
      playerId: this.playerId,
      world: this.world
    };
    return JSON.stringify(save, null, 2);
  }

  public importSaveState(jsonString: string): boolean {
    try {
      const parsed: GameSaveState = JSON.parse(jsonString);
      if (parsed && parsed.world && parsed.playerId) {
        this.world = parsed.world;
        this.playerId = parsed.playerId;
        this.currentEvent = null;
        this.notify();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error importing save state:', e);
      return false;
    }
  }
}
