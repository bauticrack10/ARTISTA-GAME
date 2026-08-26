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
  MusicRegion,
  AwardCeremony,
  EcosystemNPC,
  BeefState,
  SocialPost
} from '../types';
import { INITIAL_ARTISTS } from '../data/initialArtists';
import { INITIAL_GENRES, SUBGENRE_DETAILS } from '../data/genres';
import { INITIAL_LABELS } from '../data/labels';
import { INITIAL_PRODUCERS, INITIAL_MANAGERS } from '../data/producersAndManagers';
import { CORE_EVENT_TEMPLATES, getCreativeDroughtEvent } from '../data/eventTemplates';
import { WorldSimulation } from '../systems/WorldSimulation';
import { ChartEngine } from '../systems/ChartEngine';
import { AwardEngine } from '../systems/AwardEngine';
import { formatMoney } from '../utils/formatters';
import { GenreTrendEngine } from '../systems/GenreTrendEngine';
import { EventEngine } from '../systems/EventEngine';
import { EconomyEngine } from '../systems/EconomyEngine';
import { TourEngine } from '../systems/TourEngine';
import { StreamingEngine } from '../systems/StreamingEngine';
import { RelationshipEngine } from '../systems/RelationshipEngine';
import { SocialFeedEngine } from '../systems/SocialFeedEngine';
import { LegacyEngine } from '../systems/LegacyEngine';
import { TimeSystem } from '../systems/TimeSystem';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';

export class GameEngine {
  private world: WorldState;
  private playerId: string;
  private eventQueue: EventDefinition[] = [];
  private currentEvent: EventDefinition | null = null;
  private activeGalaCeremony: AwardCeremony | null = null;
  private onStateChangeListeners: Array<(world: WorldState, player: Artist, currentEvent: EventDefinition | null, activeGala: AwardCeremony | null) => void> = [];

  constructor(customPlayer?: Partial<Artist>) {
    this.world = this.createDefaultWorld();
    if (customPlayer) {
      this.playerId = customPlayer.id || 'artist_player_1';
      const playerArtist: Artist = {
        id: this.playerId,
        name: customPlayer.name || 'Mi Artista',
        realName: customPlayer.realName || 'Nombre Real',
        isPlayer: true,
        avatarUrl: customPlayer.avatarUrl,
        avatarColor: customPlayer.avatarColor || 'from-[#7C3AED] via-[#8B5CF6] to-[#C026D3]',
        avatarIcon: customPlayer.avatarIcon,
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
        careerStage: customPlayer.careerStage || 'Underground',
        labelId: customPlayer.labelId !== undefined ? customPlayer.labelId : null,
        managerId: customPlayer.managerId !== undefined ? customPlayer.managerId : null,
        activeContract: customPlayer.activeContract || null,
        relationships: customPlayer.relationships || {},
        eras: customPlayer.eras && customPlayer.eras.length > 0 ? customPlayer.eras : [
          {
            id: `era_${this.playerId}_debut`,
            name: 'Los Primeros Pasos & Grabaciones Caseras',
            startYear: 2026,
            startMonth: 1,
            genreFocus: customPlayer.mainGenreId || 'trap_latino',
            stage: customPlayer.careerStage || 'Underground',
            highlightSummary: 'Inicios del camino artístico y primeras grabaciones en el estudio.'
          }
        ],
        awardsWon: customPlayer.awardsWon || [],
        legacyScore: customPlayer.legacyScore !== undefined ? customPlayer.legacyScore : 12,
        isRetired: customPlayer.isRetired || false,
        retirementYear: customPlayer.retirementYear,
        lastReleaseYear: customPlayer.lastReleaseYear,
        lastReleaseMonth: customPlayer.lastReleaseMonth,
        historicalNotes: customPlayer.historicalNotes && customPlayer.historicalNotes.length > 0 ? customPlayer.historicalNotes : ['Comenzó su carrera artística en 2026.'],
        generationIndex: customPlayer.generationIndex || 1,
        influences: customPlayer.influences || [],
        lifestyleUpgrades: customPlayer.lifestyleUpgrades || [],
        isProdigy: customPlayer.isProdigy,
        prodigyMultiplier: customPlayer.prodigyMultiplier
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
      socialFeed: [
        {
          id: 'post_init_1',
          platform: 'twitter',
          authorName: 'Trap & Flow Argentina',
          authorHandle: '@trapflow_arg',
          authorVerified: true,
          authorType: 'media',
          authorAvatarGradient: 'from-purple-700 to-indigo-900',
          badge: 'Radar de Nuevos Talentos',
          year: 2026,
          month: 1,
          content: 'Comienza una nueva era en la escena urbana. Productores independientes y nuevas voces prometen redefinir los charts.',
          likes: 540,
          retweetsOrShares: 85,
          commentsCount: 34,
          sentiment: 'positive'
        }
      ],
      ecosystemContacts: RelationshipEngine.getInitialEcosystemContacts(),
      activeBeefs: {},
      records: [],
      globalHistoryTimeline: [
        { year: 2026, month: 1, text: 'Inicio de la simulación musical.', category: 'world' }
      ],
      recentEventIdsHistory: [],
      activeNarrativeChains: {}
    };
  }

  public subscribe(listener: (world: WorldState, player: Artist, currentEvent: EventDefinition | null, activeGala: AwardCeremony | null) => void): () => void {
    this.onStateChangeListeners.push(listener);
    listener(this.world, this.getPlayer(), this.currentEvent, this.activeGalaCeremony);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const player = this.getPlayer();
    this.onStateChangeListeners.forEach(listener => listener(this.world, player, this.currentEvent, this.activeGalaCeremony));
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

  public getActiveGalaCeremony(): AwardCeremony | null {
    return this.activeGalaCeremony;
  }

  public openGalaCeremony(ceremony: AwardCeremony) {
    this.activeGalaCeremony = ceremony;
    this.notify();
  }

  public closeGalaCeremony() {
    this.activeGalaCeremony = null;
    this.notify();
  }

  public setPlayer(playerArtist: Artist) {
    this.playerId = playerArtist.id;
    this.world.artists[this.playerId] = playerArtist;
    this.notify();
  }

  public updatePlayerAvatar(avatarUrl?: string, avatarColor?: string, avatarIcon?: string) {
    const player = this.getPlayer();
    if (player) {
      if (avatarUrl !== undefined) player.avatarUrl = avatarUrl;
      if (avatarColor !== undefined) player.avatarColor = avatarColor;
      if (avatarIcon !== undefined) player.avatarIcon = avatarIcon;
      this.world.artists[this.playerId] = { ...player };
      this.notify();
    }
  }

  public updatePlayerProfile(updates: Partial<Artist>) {
    const player = this.getPlayer();
    if (player) {
      this.world.artists[this.playerId] = {
        ...player,
        ...updates
      };
      this.notify();
    }
  }

  // --- LIFESTYLE & UPGRADES SYSTEM ---

  public getPlayerLifestyleBuffs() {
    const player = this.getPlayer();
    const buffs = {
      qualityBonus: 0,
      passiveEnergyPerMonth: 0,
      hypeDecayReduction: 0,
      tourFatigueReduction: 0,
      skillBonus: 0,
      creativityBonus: 0,
      charismaBonus: 0,
      disciplineBonus: 0,
      reputationBonus: 0,
      commercialAppealBonus: 0,
      monthlyUpkeep: 0
    };

    if (!player.lifestyleUpgrades || player.lifestyleUpgrades.length === 0) {
      return buffs;
    }

    const itemMap = new Map(LIFESTYLE_ITEMS.map(i => [i.id, i]));
    for (const id of player.lifestyleUpgrades) {
      const item = itemMap.get(id);
      if (item) {
        buffs.monthlyUpkeep += item.monthlyUpkeep;
        if (item.effects.qualityBonus) buffs.qualityBonus += item.effects.qualityBonus;
        if (item.effects.passiveEnergyPerMonth) buffs.passiveEnergyPerMonth += item.effects.passiveEnergyPerMonth;
        if (item.effects.hypeDecayReduction) buffs.hypeDecayReduction += item.effects.hypeDecayReduction;
        if (item.effects.tourFatigueReduction) buffs.tourFatigueReduction += item.effects.tourFatigueReduction;
        if (item.effects.skillBonus) buffs.skillBonus += item.effects.skillBonus;
        if (item.effects.creativityBonus) buffs.creativityBonus += item.effects.creativityBonus;
        if (item.effects.charismaBonus) buffs.charismaBonus += item.effects.charismaBonus;
        if (item.effects.disciplineBonus) buffs.disciplineBonus += item.effects.disciplineBonus;
        if (item.effects.reputationBonus) buffs.reputationBonus += item.effects.reputationBonus;
        if (item.effects.commercialAppealBonus) buffs.commercialAppealBonus += item.effects.commercialAppealBonus;
      }
    }
    return buffs;
  }

  public buyLifestyleItem(itemId: string): { success: boolean; message: string } {
    const player = this.getPlayer();
    const item = LIFESTYLE_ITEMS.find(i => i.id === itemId);
    if (!item) {
      return { success: false, message: 'El artículo no existe en el catálogo.' };
    }

    if (!player.lifestyleUpgrades) {
      player.lifestyleUpgrades = [];
    }

    if (player.lifestyleUpgrades.includes(itemId)) {
      return { success: false, message: 'Ya posees este artículo.' };
    }

    if (player.stats.funds < item.price) {
      return {
        success: false,
        message: `Fondos insuficientes. Cuesta ${formatMoney(item.price)} y tienes ${formatMoney(player.stats.funds)}.`
      };
    }

    // Deduct funds and record ownership
    player.stats.funds -= item.price;
    player.lifestyleUpgrades.push(itemId);

    // Apply immediate permanent skill/trait bonuses (multiplied x3 if prodigy)
    const multiplier = player.isProdigy ? 3 : 1;
    if (item.effects.skillBonus) {
      player.personality.skill = Math.min(100, player.personality.skill + item.effects.skillBonus * multiplier);
    }
    if (item.effects.creativityBonus) {
      player.personality.creativity = Math.min(100, player.personality.creativity + item.effects.creativityBonus * multiplier);
    }
    if (item.effects.charismaBonus) {
      player.personality.charisma = Math.min(100, player.personality.charisma + item.effects.charismaBonus * multiplier);
    }
    if (item.effects.disciplineBonus) {
      player.personality.discipline = Math.min(100, player.personality.discipline + item.effects.disciplineBonus * multiplier);
    }
    if (item.effects.reputationBonus) {
      player.stats.reputation = Math.min(100, player.stats.reputation + item.effects.reputationBonus * multiplier);
    }
    if (item.effects.commercialAppealBonus) {
      player.personality.commercialAppeal = Math.min(100, player.personality.commercialAppeal + item.effects.commercialAppealBonus * multiplier);
    }

    // Generate News
    this.world.news.unshift({
      id: `news_lifestyle_${Date.now()}`,
      headline: `Estilo de Vida: ${player.name} adquiere "${item.name}"`,
      body: `${player.name} invirtió ${formatMoney(item.price)} en ${item.name.toLowerCase()}, potenciando su estatus y recursos artísticos.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'culture',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 3
    });

    this.notify();
    return { success: true, message: `¡Has adquirido "${item.name}" exitosamente!` };
  }

  public static readonly MAX_SINGLES_PER_YEAR = 5;

  public getPlayerSinglesReleasedThisYear(): number {
    const player = this.getPlayer();
    return Object.values(this.world.songs).filter(
      s => s.artistId === player.id && s.releaseYear === this.world.currentYear && s.isSingle
    ).length;
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
    musicVideo?: {
      concept: string;
      budget: number;
      directorTier: string;
    };
  }): Song {
    const player = this.getPlayer();
    const currentYearSingles = this.getPlayerSinglesReleasedThisYear();
    if (currentYearSingles >= GameEngine.MAX_SINGLES_PER_YEAR) {
      throw new Error(`Has alcanzado el límite anual de lanzamientos (${GameEngine.MAX_SINGLES_PER_YEAR} singles por año).`);
    }

    const songId = `song_${player.id}_${this.world.currentYear}_${this.world.currentMonth}_${Math.floor(Math.random() * 1000)}`;

    const prod = params.producerId ? this.world.producers[params.producerId] : undefined;
    const qualityBoost = prod ? prod.qualityBoost : 0;

    // Subgenre bonuses
    const subDetail = params.subGenreIds && params.subGenreIds.length > 0 ? SUBGENRE_DETAILS[params.subGenreIds[0]] : undefined;
    const subQualityBonus = subDetail?.qualityBonus || 0;
    const subCommBonus = subDetail?.commercialBonus || 0;
    const subOrigBonus = subDetail?.originalityBonus || 0;

    // Music Video Bonuses & Initial Views
    const videoCost = params.musicVideo ? params.musicVideo.budget : 0;
    let mvHypeBonus = 0;
    let mvQualityBonus = 0;
    let mvCommercialBonus = 0;
    let initialViews = 0;

    if (params.musicVideo) {
      if (params.musicVideo.directorTier === 'Director de Élite Mundial') {
        mvHypeBonus = 50;
        mvQualityBonus = 8;
        mvCommercialBonus = 12;
        initialViews = Math.floor(450000 + player.stats.popularity * 25000 + Math.random() * 200000);
      } else if (params.musicVideo.directorTier === 'Estudio Indie') {
        mvHypeBonus = 25;
        mvQualityBonus = 5;
        mvCommercialBonus = 6;
        initialViews = Math.floor(45000 + player.stats.popularity * 3000 + Math.random() * 25000);
      } else {
        // Director Emergente
        mvHypeBonus = 10;
        mvQualityBonus = 2;
        mvCommercialBonus = 3;
        initialViews = Math.floor(6000 + player.stats.popularity * 400 + Math.random() * 4000);
      }
    }

    // Quality calculation based on player stats + production investment + producer + subgenre + video
    const baseQuality = Math.min(100, Math.floor(
      player.personality.skill * 0.45 +
      player.personality.creativity * 0.35 +
      (params.budgetProduction / 5000) * 15 +
      qualityBoost +
      subQualityBonus +
      mvQualityBonus
    ));
    const commercialAppeal = Math.min(100, Math.floor(
      player.personality.commercialAppeal * 0.55 +
      (params.budgetMarketing / 5000) * 20 +
      subCommBonus +
      mvCommercialBonus
    ));
    const originality = Math.min(100, player.personality.originality + subOrigBonus);

    // Deduct player funds and energy
    const totalCost = params.budgetProduction + params.budgetMarketing + (prod ? prod.costPerTrack : 0) + videoCost;
    player.stats.funds = Math.max(0, player.stats.funds - totalCost);
    player.stats.energy = Math.max(10, player.stats.energy - 15);
    player.stats.hype = Math.min(100, player.stats.hype + Math.floor(params.budgetMarketing / 2000) * 10 + 15 + mvHypeBonus);
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
      wentViral: false,
      musicVideo: params.musicVideo ? {
        concept: params.musicVideo.concept,
        budget: params.musicVideo.budget,
        directorTier: params.musicVideo.directorTier,
        views: initialViews,
        releaseYear: this.world.currentYear,
        releaseMonth: this.world.currentMonth
      } : undefined
    };

    this.world.songs[songId] = newSong;

    this.world.news.unshift({
      id: `news_rel_${songId}`,
      headline: params.musicVideo
        ? `Lanzamiento: "${params.title}" de ${player.name} estrena videoclip oficial`
        : `Lanzamiento: "${params.title}" de ${player.name} ya está disponible`,
      body: params.musicVideo
        ? `El nuevo single de ${player.name} llega acompañado de un ambicioso videoclip con estética "${params.musicVideo.concept}" dirigido por ${params.musicVideo.directorTier}.`
        : `El nuevo single de ${player.name} (${subDetail?.name || params.genreId}) llega con producción de alto calibre y gran expectativa.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'release',
      relatedArtistIds: [player.id, ...params.featuredArtistIds],
      sentiment: 'positive',
      importance: params.musicVideo ? 4 : 3
    });

    // Generar reacciones en redes sociales
    if (!this.world.socialFeed) this.world.socialFeed = [];
    const socialPosts = SocialFeedEngine.generateReleasePosts(this.world, player, newSong);
    this.world.socialFeed.unshift(...socialPosts);

    this.notify();
    return newSong;
  }

  public releaseAlbum(params: {
    title: string;
    type: Album['type'];
    genreId: string;
    subGenreIds: string[];
    songTitles?: string[];
    newTrackTitles?: string[];
    includedSingleIds?: string[];
    budgetProduction: number;
    budgetMarketing: number;
    producerId?: string;
  }): Album {
    const player = this.getPlayer();
    const albumId = `album_${player.id}_${this.world.currentYear}_${this.world.currentMonth}_${Math.floor(Math.random() * 1000)}`;

    const prod = params.producerId ? this.world.producers[params.producerId] : undefined;
    const qualityBoost = prod ? prod.qualityBoost : 0;

    const rawNewTitles = params.newTrackTitles || params.songTitles || [];
    const includedIds = params.includedSingleIds || [];

    const totalCost = params.budgetProduction + params.budgetMarketing + (prod ? prod.costPerTrack * Math.min(rawNewTitles.length, 6) : 0);
    player.stats.funds = Math.max(0, player.stats.funds - totalCost);
    player.stats.energy = Math.max(10, player.stats.energy - 35);
    player.stats.hype = Math.min(100, player.stats.hype + 35);
    player.lastReleaseYear = this.world.currentYear;
    player.lastReleaseMonth = this.world.currentMonth;

    const songIds: string[] = [];
    const albumSongs: Song[] = [];
    let includedSinglesStreams = 0;

    // 1. Process previous singles included
    for (const singleId of includedIds) {
      const single = this.world.songs[singleId];
      if (single && single.artistId === player.id) {
        single.albumId = albumId;
        songIds.push(singleId);
        albumSongs.push(single);
        includedSinglesStreams += single.streamsTotal;
      }
    }

    // 2. Generate new tracks
    const subDetail = params.subGenreIds && params.subGenreIds.length > 0 ? SUBGENRE_DETAILS[params.subGenreIds[0]] : undefined;
    const lifestyleBuffs = this.getPlayerLifestyleBuffs();
    const avgQuality = Math.min(100, Math.floor(
      player.personality.skill * 0.45 +
      player.personality.creativity * 0.35 +
      qualityBoost +
      lifestyleBuffs.qualityBonus +
      (subDetail?.qualityBonus || 0) +
      (params.budgetProduction / 10000) * 15
    ));

    rawNewTitles.forEach((st, idx) => {
      const sId = `song_alb_${player.id}_${this.world.currentYear}_${idx}_${Math.floor(Math.random() * 1000)}`;
      const isLeadSingle = idx === 0 && includedIds.length === 0;
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
        quality: Math.min(100, Math.max(20, avgQuality + Math.floor(Math.random() * 10 - 5))),
        commercialAppeal: Math.min(100, Math.floor(player.personality.commercialAppeal * 0.65 + (params.budgetMarketing / 10000) * 15 + (subDetail?.commercialBonus || 0))),
        originality: Math.min(100, player.personality.originality + (subDetail?.originalityBonus || 0)),
        hypeAtRelease: player.stats.hype,
        streamsTotal: 0,
        streamsLastMonth: 0,
        monthlyStreamsHistory: [],
        peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
        weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
        longevityCurve: idx === 0 ? 'explosive_drop' : idx === 1 ? 'instant_classic' : 'steady',
        isSingle: isLeadSingle,
        albumId,
        receptionRating: Math.floor(avgQuality / 20),
        isClassic: false,
        wentViral: false
      };
      this.world.songs[sId] = song;
      songIds.push(sId);
      albumSongs.push(song);
    });

    // 3. Compute Album Impact via StreamingEngine
    const impact = StreamingEngine.calculateAlbumImpact({
      albumType: params.type,
      songs: albumSongs,
      artist: player,
      producerBoost: qualityBoost,
      productionBudget: params.budgetProduction,
      marketingBudget: params.budgetMarketing,
      includedSinglesTotalStreams: includedSinglesStreams
    });

    const gradients = [
      'from-amber-600 via-rose-950 to-black',
      'from-purple-900 via-zinc-950 to-blue-950',
      'from-emerald-700 via-teal-950 to-black',
      'from-cyan-700 via-indigo-950 to-zinc-950',
      'from-rose-700 via-amber-950 to-stone-950',
      'from-indigo-800 via-slate-900 to-black'
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
      totalStreams: includedSinglesStreams,
      firstWeekSales: impact.firstWeekSales,
      criticalScore: impact.criticalScore,
      criticalReviewText: impact.criticalReviewText,
      commercialScore: impact.commercialScore,
      productionBudget: params.budgetProduction,
      marketingBudget: params.budgetMarketing,
      producerId: params.producerId,
      singlesIncludedCount: includedIds.length,
      peakChartPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
      awards: [],
      coverGradient: gradients[Object.keys(this.world.albums).length % gradients.length]
    };

    this.world.albums[albumId] = newAlbum;

    this.world.news.unshift({
      id: `news_alb_${albumId}`,
      headline: `¡Álbum Estelar! "${params.title}" de ${player.name} debuta con ${impact.firstWeekSales.toLocaleString()} unidades`,
      body: `Con ${songIds.length} canciones (${includedIds.length} singles previos incluidos), el nuevo proyecto de ${player.name} cosecha ${impact.criticalScore}/100 en la crítica especializada: "${impact.criticalReviewText}".`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'release',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 4
    });

    // Generar reacciones en redes sociales
    if (!this.world.socialFeed) this.world.socialFeed = [];
    const socialPosts = SocialFeedEngine.generateReleasePosts(this.world, player, newAlbum);
    this.world.socialFeed.unshift(...socialPosts);

    // Actualizar cumplimiento de contrato discográfico
    IndustryEngine.onAlbumReleased(player, this.world);

    this.notify();
    return newAlbum;
  }

  public bookTour(tier: TourTier, name: string): Tour {
    const player = this.getPlayer();
    const tourValidation = TourEngine.canStartTour(player);
    if (!tourValidation.allowed) {
      throw new Error(tourValidation.reason || 'Energía insuficiente para salir de gira (mínimo 85%).');
    }

    const tour = TourEngine.generateTourPlan(player, tier, name, this.world.currentYear, this.world.currentMonth);
    const lifestyleBuffs = this.getPlayerLifestyleBuffs();
    const reducedFatigue = Math.max(5, Math.floor(tour.energyFatigue * (1 - lifestyleBuffs.tourFatigueReduction)));

    this.world.tours.push(tour);
    player.stats.funds += tour.netArtistProfit;
    player.stats.energy = Math.max(5, player.stats.energy - reducedFatigue);
    player.stats.hype = Math.min(100, player.stats.hype + tour.hypeGenerated);
    player.stats.fansCount += tour.fanbaseGained;

    this.world.news.unshift({
      id: `news_tour_${tour.id}`,
      headline: `Gira Consagratoria: ${tour.name} culmina con ${tour.totalTicketsSold.toLocaleString()} tickets vendidos`,
      body: `${player.name} brilló en cada una de sus fechas, generando una ganancia neta de ${formatMoney(tour.netArtistProfit)}.`,
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
    player.activeContract = { ...contract };
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
    const manager = this.world.managers[managerId];
    if (manager) {
      IndustryEngine.hireManager(player, manager, this.world);
    }
    this.notify();
  }

  public fireManager() {
    const player = this.getPlayer();
    IndustryEngine.fireManager(player, this.world);
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
    this.takeVacation();
  }

  public takeVacation() {
    const player = this.getPlayer();
    // Acción dedicada que consume exactamente 6 meses y recupera +50 de energía (hasta un tope de 100)
    player.stats.energy = Math.min(100, player.stats.energy + 50);

    this.world.news.unshift({
      id: `news_vacation_${Date.now()}`,
      headline: `Pausa Creativa: ${player.name} se toma 6 meses de vacaciones y retiro`,
      body: `El artista aprovecha este semestre sabático para desconectar de la industria musical, recuperar energías (+50%) y buscar nueva inspiración sonora.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'culture',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 3
    });

    this.advanceCycle(6, true);
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

    // Apply outcome deltas with Prodigy Multiplier if active
    const prodigyMultiplier = player.isProdigy ? 3 : 1;
    if (outcome.fundsChange) player.stats.funds = Math.max(0, player.stats.funds + outcome.fundsChange);
    if (outcome.hypeChange) player.stats.hype = Math.max(0, Math.min(100, player.stats.hype + (outcome.hypeChange > 0 ? outcome.hypeChange * prodigyMultiplier : outcome.hypeChange)));
    if (outcome.popularityChange) player.stats.popularity = Math.max(0, Math.min(100, player.stats.popularity + (outcome.popularityChange > 0 ? outcome.popularityChange * prodigyMultiplier : outcome.popularityChange)));
    if (outcome.fansChange) player.stats.fansCount = Math.max(0, player.stats.fansCount + (outcome.fansChange > 0 ? outcome.fansChange * prodigyMultiplier : outcome.fansChange));
    if (outcome.reputationChange) player.stats.reputation = Math.max(0, Math.min(100, player.stats.reputation + (outcome.reputationChange > 0 ? outcome.reputationChange * prodigyMultiplier : outcome.reputationChange)));
    if (outcome.energyChange) player.stats.energy = Math.max(0, Math.min(100, player.stats.energy + outcome.energyChange));

    if (outcome.statChanges) {
      for (const [k, v] of Object.entries(outcome.statChanges)) {
        if (typeof v === 'number' && (player.stats as any)[k] !== undefined) {
          const currentVal = (player.stats as any)[k] as number;
          const delta = v - currentVal;
          if (delta > 0 && player.isProdigy) {
            (player.stats as any)[k] = Math.min(100, currentVal + delta * 3);
          } else {
            (player.stats as any)[k] = v;
          }
        }
      }
    }
    if (outcome.personalityChanges) {
      for (const [k, v] of Object.entries(outcome.personalityChanges)) {
        if (typeof v === 'number' && (player.personality as any)[k] !== undefined) {
          const currentVal = (player.personality as any)[k] as number;
          const delta = v - currentVal;
          if (delta > 0 && player.isProdigy) {
            (player.personality as any)[k] = Math.min(100, currentVal + delta * 3);
          } else {
            (player.personality as any)[k] = v;
          }
        }
      }
    }
    if (outcome.newContract) {
      this.signContract(outcome.newContract);
    }
    if (outcome.newManagerId) {
      this.hireManager(outcome.newManagerId);
    }
    if (outcome.relationshipChanges) {
      for (const rc of outcome.relationshipChanges) {
        const target = this.world.artists[rc.targetArtistId];
        if (target) {
          RelationshipEngine.modifyRelationship(player, target, rc.affinityDelta, 0, rc.relationType, rc.historyEntry);
        }
      }
    }
    if (outcome.ecosystemNPCChanges) {
      for (const nc of outcome.ecosystemNPCChanges) {
        RelationshipEngine.modifyEcosystemNPC(this.world, nc.npcId, {
          affinity: nc.affinityDelta,
          respect: nc.respectDelta,
          tension: nc.tensionDelta,
          loyalty: nc.loyaltyDelta,
          historyNote: nc.historyEntry
        });
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

    // Generar reacciones en redes sociales para el evento
    if (!this.world.socialFeed) this.world.socialFeed = [];
    if (outcome.socialPostsGenerated && outcome.socialPostsGenerated.length > 0) {
      this.world.socialFeed.unshift(...outcome.socialPostsGenerated);
    } else {
      const eventPosts = SocialFeedEngine.generateEventPosts(this.world, player, this.currentEvent, outcome);
      this.world.socialFeed.unshift(...eventPosts);
    }

    // Pop next event in queue if available
    if (this.eventQueue.length > 0) {
      this.currentEvent = this.eventQueue.shift()!;
    } else {
      this.currentEvent = null;
    }

    this.notify();
    return outcome;
  }

  public interactWithBeef(targetName: string, targetId: string, action: 'respond_social' | 'drop_diss' | 'ignore') {
    const player = this.getPlayer();
    const result = RelationshipEngine.processBeefInteraction(player, targetName, targetId, action, this.world);

    if (result.hypeChange) player.stats.hype = Math.max(0, Math.min(100, player.stats.hype + result.hypeChange));
    if (result.disciplineChange) player.personality.discipline = Math.max(0, Math.min(100, player.personality.discipline + result.disciplineChange));
    if (result.credibilityChange) player.stats.artisticCredibility = Math.max(0, Math.min(100, player.stats.artisticCredibility + result.credibilityChange));
    if (result.energyChange) player.stats.energy = Math.max(5, Math.min(100, player.stats.energy + result.energyChange));

    this.world.news.unshift({
      id: `news_beef_${Date.now()}`,
      headline: action === 'drop_diss' ? `¡Tiradera Directa! ${player.name} contra ${targetName}` : action === 'respond_social' ? `Cruce en Redes: ${player.name} y ${targetName}` : `${player.name} ignora provocaciones de ${targetName}`,
      body: result.outcomeText,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'rivalry',
      relatedArtistIds: [player.id],
      sentiment: action === 'drop_diss' ? 'shocking' : 'positive',
      importance: 4
    });

    this.notify();
  }

  public interactWithEcosystemNPC(npcId: string, action: 'collab_beat' | 'buy_exclusive' | 'hang_out' | 'call_out') {
    const player = this.getPlayer();
    if (!this.world.ecosystemContacts) {
      this.world.ecosystemContacts = RelationshipEngine.getInitialEcosystemContacts();
    }
    const npc = this.world.ecosystemContacts[npcId];
    if (!npc) return;

    if (action === 'collab_beat') {
      RelationshipEngine.modifyEcosystemNPC(this.world, npcId, {
        affinity: 15,
        loyalty: 10,
        historyNote: `Sesión de producción compartida en ${this.world.currentYear}.`
      });
      player.stats.hype = Math.min(100, player.stats.hype + 10);
      player.stats.energy = Math.max(5, player.stats.energy - 8);
    } else if (action === 'buy_exclusive') {
      if (player.stats.funds >= 500) {
        player.stats.funds -= 500;
        RelationshipEngine.modifyEcosystemNPC(this.world, npcId, {
          affinity: 20,
          respect: 15,
          historyNote: `Compró derechos exclusivos de producción por $500 en ${this.world.currentYear}.`
        });
        player.stats.artisticCredibility = Math.min(100, player.stats.artisticCredibility + 3);
      }
    } else if (action === 'hang_out') {
      RelationshipEngine.modifyEcosystemNPC(this.world, npcId, {
        affinity: 10,
        historyNote: `Compartieron un momento distendido en ${this.world.currentYear}.`
      });
      player.stats.energy = Math.min(100, player.stats.energy + 5);
    } else if (action === 'call_out') {
      RelationshipEngine.modifyEcosystemNPC(this.world, npcId, {
        affinity: -25,
        tension: 30,
        historyNote: `Cruce y discusión pública en ${this.world.currentYear}.`
      });
      player.stats.hype = Math.min(100, player.stats.hype + 15);
    }

    this.notify();
  }

  public advanceMonth() {
    this.advanceCycle(6);
  }

  public advanceCycle(monthsCount: 6 | 12 = 6, isVacation: boolean = false) {
    const collectedEvents: EventDefinition[] = [];

    for (let step = 0; step < monthsCount; step++) {
      const isNewYear = this.world.currentMonth === 12;
      const player = this.getPlayer();
      const lifestyleBuffs = this.getPlayerLifestyleBuffs();

      // 1. Natural monthly energy recovery (plus lifestyle passive bonus) & hype decay
      if (!isVacation) {
        player.stats.energy = Math.min(100, player.stats.energy + 3 + lifestyleBuffs.passiveEnergyPerMonth);
      } else {
        player.stats.energy = Math.min(100, player.stats.energy + lifestyleBuffs.passiveEnergyPerMonth);
      }
      const decayFactor = Math.min(0.99, 0.95 + lifestyleBuffs.hypeDecayReduction);
      player.stats.hype = Math.max(10, Math.floor(player.stats.hype * decayFactor));

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
        if (song.musicVideo) {
          const videoViewGain = Math.floor(streamRes.streams * (0.35 + Math.random() * 0.25));
          song.musicVideo.views += videoViewGain;
        }
        playerTotalMonthlyStreams += streamRes.streams;
      }

      player.stats.totalStreams += playerTotalMonthlyStreams;
      player.stats.monthlyListeners = StreamingEngine.calculateMonthlyListeners(
        playerTotalMonthlyStreams,
        player.stats.popularity,
        player.stats.fansCount,
        player.stats.fanbaseLoyalty
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

      // 6. Annual awards and mandatory drought check on December end
      if (isNewYear) {
        // Mandatory Creative Drought check: Did the player release ANY song or album this year?
        const playerReleasesInYear = Object.values(this.world.songs).filter(
          s => s.artistId === player.id && s.releaseYear === this.world.currentYear
        ).length;

        if (playerReleasesInYear === 0) {
          const droughtEvent = getCreativeDroughtEvent({
            player,
            world: this.world,
            currentYear: this.world.currentYear,
            currentMonth: this.world.currentMonth
          });
          collectedEvents.unshift(droughtEvent);
        }

        const awardRes = AwardEngine.conductAnnualAwards(this.world, this.world.currentYear);
        this.world.awardsHistory.unshift(awardRes.ceremony);
        this.activeGalaCeremony = awardRes.ceremony;
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
      player.legacyScore = LegacyEngine.calculateLegacyScore(player, hitsCount, no1sCount, this.world.currentYear);
      LegacyEngine.checkAndCreateEra(player, this.world.currentYear, this.world.currentMonth);

      // 8. Ambient social feed generation & Event selection for player during this month
      if (!this.world.socialFeed) this.world.socialFeed = [];
      if (Math.random() < 0.65) {
        const ambientPosts = SocialFeedEngine.generateMonthlyAmbientPosts(this.world, player);
        this.world.socialFeed.unshift(...ambientPosts);
        if (this.world.socialFeed.length > 100) {
          this.world.socialFeed = this.world.socialFeed.slice(0, 100);
        }
      }

      if (Math.random() < 0.50 && collectedEvents.length < (monthsCount === 12 ? 3 : 2)) {
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
          collectedEvents.push(nextEvt);
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
    }

    // Obligatory queue requirement: Disparar obligatoriamente una cola de eventos para el jugador
    const minRequiredEvents = monthsCount === 12 ? 2 : 1;
    while (collectedEvents.length < minRequiredEvents) {
      const player = this.getPlayer();
      const fallbackEvt = EventEngine.selectNextEvent(
        {
          player,
          world: this.world,
          currentYear: this.world.currentYear,
          currentMonth: this.world.currentMonth
        },
        this.world.recentEventIdsHistory
      ) || EventEngine.synthesizeProceduralEvent({
        player,
        world: this.world,
        currentYear: this.world.currentYear,
        currentMonth: this.world.currentMonth
      });

      collectedEvents.push(fallbackEvt);
      this.world.recentEventIdsHistory.push({
        eventId: fallbackEvt.id,
        year: this.world.currentYear,
        month: this.world.currentMonth
      });
    }

    // Push events to the queue
    this.eventQueue.push(...collectedEvents);

    // If no active event dialog is currently showing, pop the first one
    if (!this.currentEvent && this.eventQueue.length > 0) {
      this.currentEvent = this.eventQueue.shift()!;
    }

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
        if (!this.world.socialFeed) this.world.socialFeed = [];
        if (!this.world.ecosystemContacts) this.world.ecosystemContacts = RelationshipEngine.getInitialEcosystemContacts();
        if (!this.world.activeBeefs) this.world.activeBeefs = {};
        this.playerId = parsed.playerId;
        this.currentEvent = null;
        this.eventQueue = [];
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

