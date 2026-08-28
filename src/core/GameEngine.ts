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
  SocialPost,
  FinancialTransaction,
  TransactionCategory,
  ReleaseConfirmationData,
  LongevityCurve,
  ReleaseType,
  CollabProjectType,
  CreditOrderType,
  CollabFeasibilityResult,
  SocialActionResult,
  InteractionResult,
  NewsItem
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
import { IndustryEngine } from '../systems/IndustryEngine';
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
        birthYear: customPlayer.birthYear !== undefined ? customPlayer.birthYear : ((customPlayer.careerStartYear || 2026) - 18),
        careerStartYear: customPlayer.careerStartYear || 2026,
        mainGenreId: customPlayer.mainGenreId || 'trap_latino',
        subGenreIds: customPlayer.subGenreIds || [],
        personality: {
          creativity: 85,
          ambition: 85,
          discipline: 80,
          charisma: 85,
          skill: 85,
          commercialAppeal: 80,
          originality: 85,
          riskTolerance: 80,
          sociability: 80,
          independence: 75,
          ...(customPlayer.personality || {})
        },
        stats: {
          popularity: 20,
          reputation: 50,
          artisticCredibility: 60,
          energy: 100,
          monthlyListeners: 25000,
          totalStreams: 80000,
          funds: 4500,
          fansCount: 12000,
          fanbaseLoyalty: 75,
          hype: 55,
          ...(customPlayer.stats || {})
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
        financialLedger: customPlayer.financialLedger || [],
        isProdigy: customPlayer.isProdigy,
        prodigyMultiplier: customPlayer.prodigyMultiplier
      };
      this.world.artists[this.playerId] = playerArtist;
    } else {
      // Default to picking an initial player or creating one
      this.playerId = 'artist_player_1';
    }

    // Sincronizar y asegurar coherencia matemática de la audiencia inicial del jugador
    this.syncPlayerAudienceMetrics(0, false);
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
      activeNarrativeChains: {},
      financialLedger: []
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

  public getPlayerSongs(): Song[] {
    const player = this.getPlayer();
    return Object.values(this.world.songs).filter(s => s.artistId === player.id);
  }

  /**
   * Sincroniza atómicamente las métricas de audiencia (monthlyListeners y totalStreams)
   * del artista basándose en su catálogo activo, base de fans, hype, popularidad y cualquier
   * impulso de streams virales inyectado tras eventos, acciones sociales o giras.
   */
  public syncAudienceMetrics(
    player: Artist = this.getPlayer(),
    songs?: Song[],
    viralBoost: number = 0
  ): { monthlyListeners: number; totalStreams: number } {
    if (!player || !player.stats) {
      return { monthlyListeners: 0, totalStreams: 0 };
    }

    const playerSongs = songs || Object.values(this.world.songs).filter(s => s.artistId === player.id);
    const hasCatalog = playerSongs.length > 0;

    // 1. Inyección de streams virales en el catálogo o total si viralBoost > 0
    if (viralBoost > 0) {
      player.stats.totalStreams += viralBoost;

      if (hasCatalog) {
        // Ordenar canciones por relevancia / actividad reciente
        const sortedSongs = [...playerSongs].sort((a, b) => 
          (b.streamsLastMonth || 0) - (a.streamsLastMonth || 0) || 
          (b.streamsTotal || 0) - (a.streamsTotal || 0) ||
          (b.releaseYear * 12 + b.releaseMonth) - (a.releaseYear * 12 + a.releaseMonth)
        );
        const leadSong = sortedSongs[0];

        // La canción principal absorbe el 65% del impacto viral
        const leadStreams = Math.floor(viralBoost * 0.65);
        leadSong.streamsLastMonth = (leadSong.streamsLastMonth || 0) + leadStreams;
        leadSong.streamsTotal = (leadSong.streamsTotal || 0) + leadStreams;
        if (viralBoost >= 10000) leadSong.wentViral = true;
        if (leadSong.musicVideo) {
          leadSong.musicVideo.views += Math.floor(leadStreams * 0.45);
        }

        // El 35% restante se reparte en el catálogo
        const remainingStreams = viralBoost - leadStreams;
        const catalogPerTrack = sortedSongs.length > 1 ? Math.floor(remainingStreams / (sortedSongs.length - 1)) : 0;
        for (let i = 1; i < sortedSongs.length; i++) {
          sortedSongs[i].streamsLastMonth = (sortedSongs[i].streamsLastMonth || 0) + catalogPerTrack;
          sortedSongs[i].streamsTotal = (sortedSongs[i].streamsTotal || 0) + catalogPerTrack;
          if (sortedSongs[i].musicVideo) {
            sortedSongs[i].musicVideo.views += Math.floor(catalogPerTrack * 0.35);
          }
        }
      }
    }

    // 2. Calcular los streams mensuales del catálogo actual
    let currentMonthlyStreams = 0;
    if (hasCatalog) {
      currentMonthlyStreams = playerSongs.reduce((acc, s) => acc + (s.streamsLastMonth || 0), 0);
      
      // Si las canciones acaban de salir y aún tienen 0 en streamsLastMonth, estimar base del mes
      if (currentMonthlyStreams === 0) {
        const estMonthly = Math.floor(
          player.stats.fansCount * ((player.stats.fanbaseLoyalty || 70) / 100) * 2.8 +
          (player.stats.popularity * 150) * (1 + ((player.stats.hype || 50) / 100))
        );
        currentMonthlyStreams = Math.max(50, estMonthly);
      }
    }

    // 3. Recalcular oyentes mensuales de forma reactiva y atómica con StreamingEngine
    player.stats.monthlyListeners = StreamingEngine.calculateMonthlyListeners(
      currentMonthlyStreams,
      player.stats.popularity,
      player.stats.fansCount,
      player.stats.fanbaseLoyalty,
      player.stats.hype,
      hasCatalog
    );

    // 4. Garantizar coherencia matemática en streams totales
    if (!hasCatalog) {
      // En etapa underground o pre-lanzamiento, demos/bootlegs/rehearsals generan stream baseline
      const demoStreamsBaseline = Math.floor(
        player.stats.monthlyListeners * (1.8 + ((player.stats.hype || 50) / 100) * 0.8)
      );
      if (player.stats.totalStreams < demoStreamsBaseline) {
        player.stats.totalStreams = demoStreamsBaseline;
      }
    } else {
      const catalogTotalStreams = playerSongs.reduce((sum, s) => sum + (s.streamsTotal || 0), 0);
      if (player.stats.totalStreams < catalogTotalStreams) {
        player.stats.totalStreams = catalogTotalStreams;
      }
    }

    return {
      monthlyListeners: player.stats.monthlyListeners,
      totalStreams: player.stats.totalStreams
    };
  }

  /**
   * Método de compatibilidad para sincronización de audiencia del jugador.
   */
  public syncPlayerAudienceMetrics(fansDelta: number = 0, isViralSurge: boolean = false) {
    const player = this.getPlayer();
    let viralBoost = 0;
    if (fansDelta > 0 || isViralSurge) {
      viralBoost = StreamingEngine.calculateViralStreamSurge(
        Math.max(fansDelta, isViralSurge ? 5000 : 0),
        player.stats.hype,
        player.stats.popularity
      );
    }
    return this.syncAudienceMetrics(player, this.getPlayerSongs(), viralBoost);
  }

  public getPlayerAge(): number {
    const player = this.getPlayer();
    return TimeSystem.calculateAge(player.birthYear, this.world.currentYear);
  }

  public recordTransaction(
    type: 'income' | 'expense',
    category: TransactionCategory,
    amount: number,
    description: string
  ): FinancialTransaction {
    const player = this.getPlayer();
    const cleanAmount = Math.abs(Math.round(amount));

    if (!player.financialLedger) player.financialLedger = [];
    if (!this.world.financialLedger) this.world.financialLedger = [];

    const tx: FinancialTransaction = {
      id: `tx_${this.world.currentYear}_${this.world.currentMonth}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      type,
      category,
      amount: cleanAmount,
      description,
      resultingBalance: player.stats.funds,
      balanceAfter: player.stats.funds,
      dateStr: `Año ${this.world.currentYear} - Mes ${this.world.currentMonth}`,
      timestamp: Date.now()
    };

    player.financialLedger.unshift(tx);
    this.world.financialLedger.unshift(tx);

    if (player.financialLedger.length > 500) {
      player.financialLedger = player.financialLedger.slice(0, 500);
    }
    if (this.world.financialLedger.length > 500) {
      this.world.financialLedger = this.world.financialLedger.slice(0, 500);
    }

    return tx;
  }

  public recordFinancialTransaction(params: {
    type: 'income' | 'expense';
    category: TransactionCategory;
    amount: number;
    description: string;
  }): FinancialTransaction {
    return this.recordTransaction(params.type, params.category, params.amount, params.description);
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

    this.recordFinancialTransaction({
      type: 'expense',
      category: 'store',
      amount: item.price,
      description: `Compra en tienda: ${item.name}`
    });

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

  public getPlayerSinglesReleasedThisYear(targetYear?: number): number {
    const player = this.getPlayer();
    if (!player) return 0;
    const yearToCheck = targetYear !== undefined ? targetYear : this.world.currentYear;
    return Object.values(this.world.songs).filter(
      s => s.artistId === player.id && s.releaseYear === yearToCheck && Boolean(s.isSingle)
    ).length;
  }

  public getSinglesQuotaInfo(): { releasedCount: number; maxLimit: number; remainingQuota: number; isLimitReached: boolean } {
    const releasedCount = this.getPlayerSinglesReleasedThisYear();
    const maxLimit = GameEngine.MAX_SINGLES_PER_YEAR;
    return {
      releasedCount,
      maxLimit,
      remainingQuota: Math.max(0, maxLimit - releasedCount),
      isLimitReached: releasedCount >= maxLimit
    };
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
    longevityCurve?: Song['longevityCurve'];
    musicVideo?: {
      concept: string;
      budget: number;
      directorTier: string;
    };
  }): Song {
    const player = this.getPlayer();
    if (!params.title || !params.title.trim()) {
      throw new Error('El título de la canción es obligatorio.');
    }

    const currentYearSingles = this.getPlayerSinglesReleasedThisYear();
    if (currentYearSingles >= GameEngine.MAX_SINGLES_PER_YEAR) {
      throw new Error(`Has alcanzado el límite anual de lanzamientos (${GameEngine.MAX_SINGLES_PER_YEAR} singles por año). El cupo se reiniciará en enero (Semestre 1).`);
    }

    if (player.stats.energy < 15) {
      throw new Error('Energía insuficiente para grabar y publicar un single (requiere al menos 15% de energía).');
    }

    const prod = params.producerId ? this.world.producers[params.producerId] : undefined;
    if (prod) {
      const prodCheck = IndustryEngine.canWorkWithProducer(player, prod);
      if (!prodCheck.canWork) {
        throw new Error(`Requisitos no cumplidos para contratar a ${prod.name}: ${prodCheck.missingReasons.join(', ')}`);
      }
    }

    const producerFee = prod ? prod.costPerTrack : 0;
    const videoCost = params.musicVideo ? params.musicVideo.budget : 0;
    const totalCost = params.budgetProduction + params.budgetMarketing + producerFee + videoCost;

    if (totalCost > player.stats.funds) {
      throw new Error(`Fondos insuficientes para este lanzamiento. Costo: $${totalCost.toLocaleString()}, Disponibles: $${player.stats.funds.toLocaleString()}`);
    }

    const songId = `song_${player.id}_${this.world.currentYear}_${this.world.currentMonth}_${Math.floor(Math.random() * 1000)}`;

    // Subgenre bonuses
    const subDetail = params.subGenreIds && params.subGenreIds.length > 0 ? SUBGENRE_DETAILS[params.subGenreIds[0]] : undefined;
    const subOrigBonus = subDetail?.originalityBonus || 0;

    // Music Video Bonuses & Initial Views
    let mvHypeBonus = 0;
    let initialViews = 0;

    if (params.musicVideo) {
      if (params.musicVideo.directorTier === 'Director de Élite Mundial') {
        mvHypeBonus = 50;
        initialViews = Math.floor(450000 + player.stats.popularity * 25000 + Math.random() * 200000);
      } else if (params.musicVideo.directorTier === 'Estudio Indie') {
        mvHypeBonus = 25;
        initialViews = Math.floor(45000 + player.stats.popularity * 3000 + Math.random() * 25000);
      } else {
        // Director Emergente
        mvHypeBonus = 10;
        initialViews = Math.floor(6000 + player.stats.popularity * 400 + Math.random() * 4000);
      }
    }

    // Organic Performance and Longevity Curve Derivation via IndustryEngine:
    // performanceScore = (Calidad de Producción * 0.4) + (Inversión Marketing * 0.3) + (Creatividad/Skills * 0.2) + (Random Factor * 0.1)
    const lifestyleBuffs = this.getPlayerLifestyleBuffs();
    const perfEval = IndustryEngine.deriveTrackPerformanceAndLongevity({
      artist: player,
      productionBudget: params.budgetProduction,
      marketingBudget: params.budgetMarketing,
      producer: prod,
      subGenreId: params.subGenreIds && params.subGenreIds.length > 0 ? params.subGenreIds[0] : undefined,
      musicVideo: params.musicVideo,
      qualityBonus: lifestyleBuffs.qualityBonus
    });

    const chosenLongevity = params.longevityCurve || perfEval.longevityCurve;

    const baseQuality = Math.min(100, Math.max(10, Math.floor(
      player.personality.skill * 0.40 +
      player.personality.creativity * 0.30 +
      perfEval.productionQuality * 0.30
    )));

    const commercialAppeal = Math.min(100, Math.max(10, Math.floor(
      player.personality.commercialAppeal * 0.45 +
      perfEval.marketingInvestment * 0.55
    )));

    const originality = Math.min(100, player.personality.originality + subOrigBonus);

    // Deduct player funds and energy
    player.stats.funds = Math.max(0, player.stats.funds - totalCost);
    player.stats.energy = Math.max(0, player.stats.energy - 15);
    player.stats.hype = Math.min(100, player.stats.hype + (params.budgetMarketing > 0 ? Math.floor(params.budgetMarketing / 2000) * 10 : 0) + 15 + mvHypeBonus);
    player.lastReleaseYear = this.world.currentYear;
    player.lastReleaseMonth = this.world.currentMonth;

    if (params.budgetProduction > 0) {
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'production',
        amount: params.budgetProduction,
        description: `Producción de single "${params.title}"`
      });
    }
    if (params.budgetMarketing > 0) {
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'marketing',
        amount: params.budgetMarketing,
        description: `Marketing & difusión single "${params.title}"`
      });
    }
    if (params.producerId && params.producerId !== 'self' && producerFee > 0) {
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'production',
        amount: producerFee,
        description: `Honorarios de beatmaker para "${params.title}"`
      });
    }
    if (params.musicVideo && videoCost > 0) {
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'production',
        amount: videoCost,
        description: `Producción videoclip oficial "${params.title}"`
      });
    }

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
      longevityCurve: chosenLongevity,
      isSingle: true,
      receptionRating: Math.floor(perfEval.performanceScore / 20),
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
      relatedArtistIds: [player.id, ...(params.featuredArtistIds || [])],
      sentiment: 'positive',
      importance: params.musicVideo ? 4 : 3
    });

    // Generar reacciones en redes sociales
    if (!this.world.socialFeed) this.world.socialFeed = [];
    const socialPosts = SocialFeedEngine.generateReleasePosts(this.world, player, newSong);
    this.world.socialFeed.unshift(...socialPosts);

    this.syncPlayerAudienceMetrics(0, false);
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
    if (!params.title || !params.title.trim()) {
      throw new Error('El título del álbum es obligatorio.');
    }

    const rawNewTitles = (params.newTrackTitles || params.songTitles || []).filter(t => t.trim().length > 0);
    const includedIds = params.includedSingleIds || [];
    const totalTracksCount = rawNewTitles.length + includedIds.length;
    const minTracks = params.type === 'ep' ? 4 : (params.type === 'deluxe' ? 10 : 6);
    if (totalTracksCount < minTracks) {
      throw new Error(`Un proyecto en formato ${params.type.toUpperCase()} requiere al menos ${minTracks} canciones. Tienes ${totalTracksCount}.`);
    }

    if (player.stats.energy < 35) {
      throw new Error('Energía insuficiente para producir un álbum (requiere al menos 35% de energía).');
    }

    const albumId = `album_${player.id}_${this.world.currentYear}_${this.world.currentMonth}_${Math.floor(Math.random() * 1000)}`;

    const prod = params.producerId ? this.world.producers[params.producerId] : undefined;
    if (prod) {
      const prodCheck = IndustryEngine.canWorkWithProducer(player, prod);
      if (!prodCheck.canWork) {
        throw new Error(`Requisitos no cumplidos para contratar a ${prod.name}: ${prodCheck.missingReasons.join(', ')}`);
      }
    }
    const qualityBoost = prod ? prod.qualityBoost : 0;

    const prodFee = prod ? prod.costPerTrack * Math.min(rawNewTitles.length, 6) : 0;
    const totalCost = params.budgetProduction + params.budgetMarketing + prodFee;

    if (totalCost > player.stats.funds) {
      throw new Error(`Fondos insuficientes para este álbum. Costo: $${totalCost.toLocaleString()}, Disponibles: $${player.stats.funds.toLocaleString()}`);
    }

    player.stats.funds = Math.max(0, player.stats.funds - totalCost);
    player.stats.energy = Math.max(0, player.stats.energy - 35);
    player.stats.hype = Math.min(100, player.stats.hype + 35);
    player.lastReleaseYear = this.world.currentYear;
    player.lastReleaseMonth = this.world.currentMonth;

    if (params.budgetProduction > 0) {
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'production',
        amount: params.budgetProduction,
        description: `Producción de álbum/EP "${params.title}"`
      });
    }
    if (params.budgetMarketing > 0) {
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'marketing',
        amount: params.budgetMarketing,
        description: `Campaña de marketing para álbum "${params.title}"`
      });
    }
    if (prod && prod.costPerTrack > 0) {
      const prodCost = prod.costPerTrack * Math.min(rawNewTitles.length, 6);
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'production',
        amount: prodCost,
        description: `Producción ejecutiva de ${prod.name} para álbum "${params.title}"`
      });
    }

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

    // 2. Generate new tracks with organic longevity curves and quality derivation
    const subDetail = params.subGenreIds && params.subGenreIds.length > 0 ? SUBGENRE_DETAILS[params.subGenreIds[0]] : undefined;
    const lifestyleBuffs = this.getPlayerLifestyleBuffs();

    rawNewTitles.forEach((st, idx) => {
      const trackPerf = IndustryEngine.deriveTrackPerformanceAndLongevity({
        artist: player,
        productionBudget: Math.floor(params.budgetProduction / Math.max(1, rawNewTitles.length)),
        marketingBudget: Math.floor(params.budgetMarketing / Math.max(1, rawNewTitles.length)),
        producer: prod,
        subGenreId: params.subGenreIds && params.subGenreIds.length > 0 ? params.subGenreIds[0] : undefined,
        qualityBonus: lifestyleBuffs.qualityBonus
      });

      const sId = `song_alb_${player.id}_${this.world.currentYear}_${idx}_${Math.floor(Math.random() * 1000)}`;
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
        quality: Math.min(100, Math.max(20, Math.floor(trackPerf.productionQuality * 0.45 + player.personality.skill * 0.55 + Math.floor(Math.random() * 8 - 4)))),
        commercialAppeal: Math.min(100, Math.max(20, Math.floor(trackPerf.marketingInvestment * 0.50 + player.personality.commercialAppeal * 0.50 + (subDetail?.commercialBonus || 0)))),
        originality: Math.min(100, player.personality.originality + (subDetail?.originalityBonus || 0)),
        hypeAtRelease: player.stats.hype,
        streamsTotal: 0,
        streamsLastMonth: 0,
        monthlyStreamsHistory: [],
        peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
        weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
        longevityCurve: trackPerf.longevityCurve,
        isSingle: false,
        albumId,
        receptionRating: Math.floor(trackPerf.performanceScore / 20),
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

    this.syncPlayerAudienceMetrics(0, false);
    this.notify();
    return newAlbum;
  }

  public proposeAndExecuteCollab(params: {
    targetArtistId: string;
    type: 'single_feat' | 'album_track' | 'collab_ep' | 'collab_album' | 'collab_mixtape';
    title: string;
    creditOrder: 'player_feat_target' | 'target_feat_player' | 'player_and_target' | 'player_x_target';
    genreId: string;
    subGenreIds: string[];
    producerId?: string;
    budgetProduction: number;
    budgetMarketing: number;
    longevityCurve?: LongevityCurve;
    newTrackTitles?: string[];
  }): {
    success: boolean;
    reason?: string;
    song?: Song;
    album?: Album;
    confirmationData?: ReleaseConfirmationData;
  } {
    const player = this.getPlayer();
    const target = this.world.artists[params.targetArtistId];

    // 1. Validar que targetArtistId exista, no sea el propio jugador
    if (!target) {
      return { success: false, reason: 'El artista colaborador no existe en el mundo musical.' };
    }
    if (target.id === player.id) {
      return { success: false, reason: 'No puedes realizar una colaboración contigo mismo.' };
    }
    if (!params.title || !params.title.trim()) {
      return { success: false, reason: 'El título del proyecto es obligatorio.' };
    }

    const isAlbum = params.type === 'collab_ep' || params.type === 'collab_album' || params.type === 'collab_mixtape';

    // Validar cupo anual de singles si aplica
    if (params.type === 'single_feat') {
      const currentYearSingles = this.getPlayerSinglesReleasedThisYear();
      if (currentYearSingles >= GameEngine.MAX_SINGLES_PER_YEAR) {
        return {
          success: false,
          reason: `Has alcanzado el límite anual de lanzamientos (${GameEngine.MAX_SINGLES_PER_YEAR} singles por año). El cupo se reiniciará en enero.`
        };
      }
    }

    // 2. Validar energía (>=15% single, >=35% álbum)
    const requiredEnergy = isAlbum ? 35 : 15;
    if (player.stats.energy < requiredEnergy) {
      return {
        success: false,
        reason: `Energía insuficiente para este proyecto colaborativo (requiere al menos ${requiredEnergy}% de energía).`
      };
    }

    // Validar productor si fue seleccionado
    const prod = params.producerId && params.producerId !== 'self' ? this.world.producers[params.producerId] : undefined;
    if (prod) {
      const prodCheck = IndustryEngine.canWorkWithProducer(player, prod);
      if (!prodCheck.canWork) {
        return {
          success: false,
          reason: `Requisitos no cumplidos para contratar a ${prod.name}: ${prodCheck.missingReasons.join(', ')}`
        };
      }
    }

    // Validar títulos de canciones de álbum
    const rawTrackTitles = (params.newTrackTitles || []).filter(t => t.trim().length > 0);
    const minTracks = params.type === 'collab_ep' ? 4 : 6;
    if (isAlbum && rawTrackTitles.length < minTracks) {
      return {
        success: false,
        reason: `Un proyecto en formato ${params.type.toUpperCase()} requiere al menos ${minTracks} canciones. Tienes ${rawTrackTitles.length}.`
      };
    }

    // Validar fondos totales requeridos
    const trackCount = isAlbum ? Math.max(minTracks, rawTrackTitles.length) : 1;
    const producerFee = prod ? (isAlbum ? prod.costPerTrack * Math.min(trackCount, 6) : prod.costPerTrack) : 0;
    const totalCost = params.budgetProduction + params.budgetMarketing + producerFee;

    if (totalCost > player.stats.funds) {
      return {
        success: false,
        reason: `Fondos insuficientes para este lanzamiento. Costo total: $${totalCost.toLocaleString()}, Disponibles: $${player.stats.funds.toLocaleString()}`
      };
    }

    // 3. Ejecutar RelationshipEngine.calculateCollabFeasibility
    const feas = RelationshipEngine.calculateCollabFeasibility(
      player,
      target,
      params.type,
      params.budgetProduction,
      params.creditOrder
    );

    // 4. Si es rechazada: registrar en histórico, reducir levemente afinidad (-3 a -5), notificar y retornar sin descontar fondos ni crear entidades
    if (!feas.willAccept) {
      RelationshipEngine.modifyRelationship(
        player,
        target,
        -4,
        0,
        undefined,
        `Propuesta de colaboración (${params.type}) rechazada en ${this.world.currentYear}: "${feas.reason}"`
      );
      this.notify();
      return {
        success: false,
        reason: feas.reason
      };
    }

    // 5. Si es aceptada:
    // 5.1 Formatear créditos y display según creditOrder
    let creditDisplay = `${player.name} (ft. ${target.name})`;
    if (params.creditOrder === 'target_feat_player') {
      creditDisplay = `${target.name} (ft. ${player.name})`;
    } else if (params.creditOrder === 'player_and_target') {
      creditDisplay = `${player.name} & ${target.name}`;
    } else if (params.creditOrder === 'player_x_target') {
      creditDisplay = `${player.name} x ${target.name}`;
    }

    const chemistryBonus = feas.chemistryScore;
    const lifestyleBuffs = this.getPlayerLifestyleBuffs();
    const subDetail = params.subGenreIds && params.subGenreIds.length > 0 ? SUBGENRE_DETAILS[params.subGenreIds[0]] : undefined;
    const subOrigBonus = subDetail?.originalityBonus || 0;
    const subCommBonus = subDetail?.commercialBonus || 0;

    // 5.2 Derivar performance sonora e impacto
    const trackPerf = IndustryEngine.deriveTrackPerformanceAndLongevity({
      artist: player,
      productionBudget: params.budgetProduction,
      marketingBudget: params.budgetMarketing,
      producer: prod,
      subGenreId: params.subGenreIds?.[0],
      qualityBonus: lifestyleBuffs.qualityBonus + Math.floor(chemistryBonus * 0.3)
    });

    const baseQuality = Math.min(100, Math.max(20, Math.floor(
      player.personality.skill * 0.35 +
      target.personality.skill * 0.25 +
      trackPerf.productionQuality * 0.30 +
      chemistryBonus * 0.4
    )));

    const commercialAppeal = Math.min(100, Math.max(20, Math.floor(
      player.personality.commercialAppeal * 0.35 +
      target.personality.commercialAppeal * 0.25 +
      trackPerf.marketingInvestment * 0.30 +
      chemistryBonus * 0.3 +
      subCommBonus
    )));

    const originality = Math.min(100, Math.max(20, Math.floor(
      player.personality.originality * 0.50 +
      target.personality.originality * 0.30 +
      chemistryBonus * 0.4 +
      subOrigBonus
    )));

    // 5.3 Descontar fondos y energía de forma atómica
    player.stats.funds = Math.max(0, player.stats.funds - totalCost);
    player.stats.energy = Math.max(0, player.stats.energy - requiredEnergy);
    player.lastReleaseYear = this.world.currentYear;
    player.lastReleaseMonth = this.world.currentMonth;

    if (params.budgetProduction > 0) {
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'production',
        amount: params.budgetProduction,
        description: `Producción de colaboración "${params.title}" (${creditDisplay})`
      });
    }
    if (params.budgetMarketing > 0) {
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'marketing',
        amount: params.budgetMarketing,
        description: `Marketing & difusión de colaboración "${params.title}" (${creditDisplay})`
      });
    }
    if (prod && producerFee > 0) {
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'production',
        amount: producerFee,
        description: `Honorarios de ${prod.name} para "${params.title}"`
      });
    }

    // 5.4 Cross-pollination de fanbase y stats
    const fansGained = Math.max(200, Math.floor(feas.crossFanbasePotential * 0.65 + (target.stats.popularity * 35) * (chemistryBonus / 12)));
    player.stats.fansCount += fansGained;
    const popGained = Math.max(1, Math.floor((target.stats.popularity / 18) * (chemistryBonus / 12)));
    player.stats.popularity = Math.min(100, player.stats.popularity + popGained);

    target.stats.fansCount += Math.floor(fansGained * 0.5);
    target.stats.popularity = Math.min(100, target.stats.popularity + Math.floor(popGained * 0.5));

    // 5.5 Aumentar afinidad (+15), respeto (+15), pastCollabsCount (+1), hype y notas históricas en ambos artistas
    const relA = RelationshipEngine.getOrCreateRelationship(player, target.id);
    const relB = RelationshipEngine.getOrCreateRelationship(target, player.id);
    relA.pastCollabsCount = (relA.pastCollabsCount || 0) + 1;
    relB.pastCollabsCount = (relB.pastCollabsCount || 0) + 1;

    const newRelType = (relA.relationType === 'friend' || relA.relationType === 'mentor') ? relA.relationType : 'collaborator';
    const historyNote = `Colaboración exitosa en "${params.title}" (${creditDisplay}) en ${this.world.currentYear}. Química: ${chemistryBonus}/25.`;
    RelationshipEngine.modifyRelationship(player, target, 15, 15, newRelType, historyNote);

    const hypeGain = Math.min(45, Math.floor(18 + target.stats.popularity * 0.20 + chemistryBonus * 0.6));
    player.stats.hype = Math.min(100, player.stats.hype + hypeGain);

    const genreName = this.world.genres[params.genreId]?.name || params.genreId;

    // 5.6 Crear Entidades: Single o Álbum
    if (!isAlbum) {
      const songId = `song_collab_${player.id}_${target.id}_${this.world.currentYear}_${this.world.currentMonth}_${Math.floor(Math.random() * 1000)}`;
      const createdSong: Song = {
        id: songId,
        title: params.title.trim(),
        artistId: player.id,
        featuredArtistIds: [target.id],
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
        longevityCurve: params.longevityCurve || trackPerf.longevityCurve,
        isSingle: params.type === 'single_feat',
        receptionRating: Math.floor(trackPerf.performanceScore / 20),
        isClassic: false,
        wentViral: chemistryBonus >= 22
      };

      this.world.songs[songId] = createdSong;

      const confirmationData: ReleaseConfirmationData = {
        type: params.type,
        title: params.title.trim(),
        songCount: 1,
        trackTitles: [`${params.title.trim()} (${creditDisplay})`],
        genreId: params.genreId,
        genreName,
        subGenreId: params.subGenreIds?.[0],
        subGenreName: subDetail?.name,
        featuredArtistNames: [target.name],
        producerName: prod?.name,
        releaseYear: this.world.currentYear,
        releaseMonth: this.world.currentMonth,
        totalBudget: totalCost,
        budgetBreakdown: {
          production: params.budgetProduction,
          marketing: params.budgetMarketing,
          producerFee,
          videoCost: 0
        },
        quality: baseQuality,
        commercialAppeal,
        originality
      };

      // 5.7 Publicar noticias y social feed
      this.world.news.unshift({
        id: `news_collab_${songId}`,
        headline: `¡Colaboración Explosiva! "${params.title}" une a ${player.name} y ${target.name}`,
        body: `La escena celebra el junte más esperado: "${params.title}" (${creditDisplay}). Ambos artistas combinan estilos con una química calculada en ${chemistryBonus}/25.`,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: 'release',
        relatedArtistIds: [player.id, target.id],
        sentiment: 'positive',
        importance: 4
      });

      if (!this.world.socialFeed) this.world.socialFeed = [];
      const socialPosts = SocialFeedEngine.generateReleasePosts(this.world, player, createdSong);
      this.world.socialFeed.unshift(...socialPosts);

      this.syncPlayerAudienceMetrics(fansGained, createdSong.wentViral);
      this.notify();
      return { success: true, song: createdSong, confirmationData };
    } else {
      // Album / EP / Mixtape
      const albumId = `album_collab_${player.id}_${target.id}_${this.world.currentYear}_${this.world.currentMonth}_${Math.floor(Math.random() * 1000)}`;
      const trackTitles = rawTrackTitles.length > 0
        ? rawTrackTitles
        : (params.type === 'collab_ep' ? ['Cruce de Caminos', 'Frecuencias Altas', 'Código de Oro', 'La Última Sesión'] : ['Génesis Conjunta', 'Fuego Cruzado', 'Diamantes & Calles', 'Pacto Sagrado', 'Bajo las Luces', 'El Legado Infinito']);

      const songIds: string[] = [];
      const albumSongs: Song[] = [];

      trackTitles.forEach((tTitle, idx) => {
        const sId = `song_collab_alb_${player.id}_${target.id}_${this.world.currentYear}_${idx}_${Math.floor(Math.random() * 1000)}`;
        const sQuality = Math.min(100, Math.max(20, Math.floor(baseQuality + Math.floor(Math.random() * 6 - 3))));
        const sSong: Song = {
          id: sId,
          title: tTitle,
          artistId: player.id,
          featuredArtistIds: [target.id],
          producerId: params.producerId,
          genreId: params.genreId,
          subGenreIds: params.subGenreIds,
          releaseYear: this.world.currentYear,
          releaseMonth: this.world.currentMonth,
          quality: sQuality,
          commercialAppeal,
          originality,
          hypeAtRelease: player.stats.hype,
          streamsTotal: 0,
          streamsLastMonth: 0,
          monthlyStreamsHistory: [],
          peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
          weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
          longevityCurve: trackPerf.longevityCurve,
          isSingle: idx === 0,
          albumId,
          receptionRating: Math.floor(trackPerf.performanceScore / 20),
          isClassic: false,
          wentViral: false
        };
        this.world.songs[sId] = sSong;
        songIds.push(sId);
        albumSongs.push(sSong);
      });

      const relType: ReleaseType = params.type === 'collab_ep' ? 'ep' : params.type === 'collab_mixtape' ? 'mixtape' : 'collab_album';
      const impact = StreamingEngine.calculateAlbumImpact({
        albumType: relType,
        songs: albumSongs,
        artist: player,
        producerBoost: prod ? prod.qualityBoost : 0,
        productionBudget: params.budgetProduction,
        marketingBudget: params.budgetMarketing,
        includedSinglesTotalStreams: 0
      });

      const createdAlbum: Album = {
        id: albumId,
        title: params.title.trim(),
        artistId: player.id,
        collaboratorArtistId: target.id,
        type: relType,
        songIds,
        genreId: params.genreId,
        subGenreIds: params.subGenreIds,
        releaseYear: this.world.currentYear,
        releaseMonth: this.world.currentMonth,
        totalStreams: 0,
        firstWeekSales: impact.firstWeekSales,
        criticalScore: impact.criticalScore,
        criticalReviewText: `Proyecto conjunto de alto calibre sonoro: "${creditDisplay}". ${impact.criticalReviewText}`,
        commercialScore: impact.commercialScore,
        productionBudget: params.budgetProduction,
        marketingBudget: params.budgetMarketing,
        producerId: params.producerId,
        singlesIncludedCount: 0,
        peakChartPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
        awards: [],
        coverGradient: 'from-violet-600 via-fuchsia-600 to-indigo-950'
      };
      this.world.albums[albumId] = createdAlbum;

      const confirmationData: ReleaseConfirmationData = {
        type: relType,
        title: params.title.trim(),
        coverGradient: createdAlbum.coverGradient,
        songCount: songIds.length,
        trackTitles,
        genreId: params.genreId,
        genreName,
        subGenreId: params.subGenreIds?.[0],
        subGenreName: subDetail?.name,
        featuredArtistNames: [target.name],
        producerName: prod?.name,
        releaseYear: this.world.currentYear,
        releaseMonth: this.world.currentMonth,
        totalBudget: totalCost,
        budgetBreakdown: {
          production: params.budgetProduction,
          marketing: params.budgetMarketing,
          producerFee,
          videoCost: 0
        },
        criticalScore: impact.criticalScore,
        criticalReviewText: createdAlbum.criticalReviewText,
        firstWeekSales: impact.firstWeekSales
      };

      this.world.news.unshift({
        id: `news_collab_alb_${albumId}`,
        headline: `¡Hito Colaborativo! "${params.title}" de ${player.name} & ${target.name} debuta con fuerza`,
        body: `El proyecto en formato ${relType.toUpperCase()} de ${creditDisplay} presenta ${songIds.length} canciones inéditas y una calificación crítica de ${impact.criticalScore}/100.`,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: 'release',
        relatedArtistIds: [player.id, target.id],
        sentiment: 'positive',
        importance: 5
      });

      if (!this.world.socialFeed) this.world.socialFeed = [];
      const socialPosts = SocialFeedEngine.generateReleasePosts(this.world, player, createdAlbum);
      this.world.socialFeed.unshift(...socialPosts);

      IndustryEngine.onAlbumReleased(player, this.world);

      this.syncPlayerAudienceMetrics(fansGained, false);
      this.notify();
      return { success: true, album: createdAlbum, confirmationData };
    }
  }

  public releaseCollaboration(params: {
    collaboratorId: string;
    format: 'single_feat' | 'album_track' | 'ep_collab' | 'collab_album' | 'mixtape_collab';
    title: string;
    creditFormat: 'player_feat_target' | 'target_feat_player' | 'player_and_target' | 'player_x_target';
    genreId: string;
    subGenreIds: string[];
    producerId?: string;
    budgetProduction: number;
    budgetMarketing: number;
    longevityCurve: LongevityCurve;
    customTrackTitles?: string[];
  }): ReleaseConfirmationData {
    const res = this.proposeAndExecuteCollab({
      targetArtistId: params.collaboratorId,
      type: params.format === 'ep_collab' ? 'collab_ep' : params.format === 'mixtape_collab' ? 'collab_mixtape' : params.format,
      title: params.title,
      creditOrder: params.creditFormat,
      genreId: params.genreId,
      subGenreIds: params.subGenreIds,
      producerId: params.producerId,
      budgetProduction: params.budgetProduction,
      budgetMarketing: params.budgetMarketing,
      longevityCurve: params.longevityCurve,
      newTrackTitles: params.customTrackTitles
    });
    if (!res.success) {
      throw new Error(res.reason || 'Colaboración rechazada');
    }
    return res.confirmationData!;
  }

  public bookTour(tier: TourTier, name: string): Tour {
    const player = this.getPlayer();
    const tourValidation = TourEngine.canStartTour(player, this.world);
    if (!tourValidation.allowed) {
      throw new Error(tourValidation.reason || 'Necesitas catálogo y fans para vender entradas (mín. 2 temas o 1 EP, ≥1.000 oyentes y ≥85% energía).');
    }

    const tour = TourEngine.generateTourPlan(
      player,
      tier,
      name,
      this.world.currentYear,
      this.world.currentMonth,
      this.world
    );
    const lifestyleBuffs = this.getPlayerLifestyleBuffs();
    const reducedFatigue = Math.max(5, Math.floor(tour.energyFatigue * (1 - lifestyleBuffs.tourFatigueReduction)));

    this.world.tours.push(tour);
    player.stats.funds += tour.netArtistProfit;
    player.stats.energy = Math.max(5, player.stats.energy - reducedFatigue);
    player.stats.hype = Math.min(100, player.stats.hype + tour.hypeGenerated);
    player.stats.fansCount += tour.fanbaseGained;

    this.recordFinancialTransaction({
      type: 'income',
      category: 'tour',
      amount: tour.netArtistProfit,
      description: `Ganancia neta por gira "${tour.name}"`
    });

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

    this.syncPlayerAudienceMetrics(tour.fanbaseGained, false);
    this.notify();
    return tour;
  }

  public signContract(contract: LabelContract) {
    const player = this.getPlayer();
    const label = this.world.labels[contract.labelId];

    // 1. Deducir cuota anual si aplica
    if (contract.annualFee && contract.annualFee > 0) {
      player.stats.funds = Math.max(0, player.stats.funds - contract.annualFee);
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'contract',
        amount: contract.annualFee,
        description: `Cuota anual de distribución (${label ? label.name : 'Distribuidora'})`
      });
    }

    // 2. Acreditar anticipo / bono de firma si aplica
    if (contract.signingBonus > 0) {
      player.stats.funds += contract.signingBonus;
      this.recordFinancialTransaction({
        type: 'income',
        category: 'contract',
        amount: contract.signingBonus,
        description: `Anticipo / Bono de firma (${label ? label.name : 'Sello'})`
      });
    }

    if (player.labelId && player.labelId !== contract.labelId && this.world.labels[player.labelId]) {
      const prevLabel = this.world.labels[player.labelId];
      if (prevLabel.rosterArtistIds) {
        prevLabel.rosterArtistIds = prevLabel.rosterArtistIds.filter(id => id !== player.id);
      }
    }

    player.labelId = contract.labelId;
    player.activeContract = { ...contract };

    if (label) {
      if (!label.rosterArtistIds.includes(player.id)) {
        label.rosterArtistIds.push(player.id);
      }
    }

    this.notify();
  }

  public signDeal(labelId: string): { success: boolean; contract?: LabelContract; error?: string } {
    const player = this.getPlayer();
    const label = this.world.labels[labelId];
    if (!label) {
      return { success: false, error: 'Sello o distribuidora no encontrada.' };
    }
    const result = IndustryEngine.signDeal(player, label, this.world);
    if (result.success && result.contract) {
      this.notify();
    }
    return result;
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

  public canSendShoutout(targetArtistId: string): {
    canSend: boolean;
    cooldownRemainingMonths: number;
    nextAvailableDate: string;
    reason?: string;
  } {
    const player = this.getPlayer();
    const target = this.world.artists[targetArtistId];
    if (!target) {
      return { canSend: false, cooldownRemainingMonths: 0, nextAvailableDate: '', reason: 'Artista objetivo no encontrado.' };
    }
    return RelationshipEngine.canSendShoutout(player, target, this.world.currentYear, this.world.currentMonth);
  }

  public canSendDiss(targetArtistId: string): {
    canSend: boolean;
    cooldownRemainingMonths: number;
    nextAvailableDate: string;
    reason?: string;
  } {
    const player = this.getPlayer();
    const target = this.world.artists[targetArtistId];
    if (!target) {
      return { canSend: false, cooldownRemainingMonths: 0, nextAvailableDate: '', reason: 'Artista objetivo no encontrado.' };
    }
    return RelationshipEngine.canSendDiss(player, target, this.world.currentYear, this.world.currentMonth);
  }

  public interactWithArtist(
    targetArtistId: string,
    actionType: 'collab_request' | 'shoutout' | 'diss'
  ): SocialActionResult | InteractionResult {
    const player = this.getPlayer();
    const target = this.world.artists[targetArtistId];
    if (!target) {
      throw new Error('El artista objetivo no existe en la escena musical.');
    }
    if (target.id === player.id) {
      throw new Error('No puedes interactuar contigo mismo.');
    }

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
        this.syncAudienceMetrics(player);
        const headline = `Alianza confirmada: ${player.name} y ${target.name} anuncian colaboración`;
        const body = `Los fanáticos celebran la unión de dos fuerzas musicales complementarias.`;
        const newsItem: NewsItem = {
          id: `news_collab_${Date.now()}`,
          headline,
          body,
          year: this.world.currentYear,
          month: this.world.currentMonth,
          category: 'culture',
          relatedArtistIds: [player.id, target.id],
          sentiment: 'positive',
          importance: 3
        };
        this.world.news.unshift(newsItem);
        this.notify();
        return {
          success: true,
          actionType: 'collab_request',
          targetArtistId: target.id,
          targetArtistName: target.name,
          outcomeDescription: `${target.name} aceptó la solicitud de colaboración con entusiasmo.`,
          hypeChange: 18,
          affinityDelta: 20,
          respectDelta: 15,
          newRelationType: 'collaborator',
          newsItem
        };
      } else {
        RelationshipEngine.modifyRelationship(player, target, -5, 0, undefined, `Propuesta de colaboración rechazada en ${this.world.currentYear}.`);
        this.notify();
        return {
          success: false,
          actionType: 'collab_request',
          targetArtistId: target.id,
          targetArtistName: target.name,
          outcomeDescription: result.reason,
          affinityDelta: -5,
          error: result.reason
        };
      }
    } else if (actionType === 'shoutout') {
      const check = RelationshipEngine.canSendShoutout(player, target, this.world.currentYear, this.world.currentMonth);
      if (!check.canSend && !check.canPerform) {
        throw new Error(check.reason);
      }
      const result = RelationshipEngine.processShoutout(player, target, this.world.currentYear, this.world.currentMonth, this.world);
      this.syncAudienceMetrics(player);
      this.notify();
      return result;
    } else if (actionType === 'diss') {
      const check = RelationshipEngine.canSendDiss(player, target, this.world.currentYear, this.world.currentMonth);
      if (!check.canSend && !check.canPerform) {
        throw new Error(check.reason);
      }
      const result = RelationshipEngine.processDiss(player, target, this.world.currentYear, this.world.currentMonth, this.world);
      this.syncAudienceMetrics(player);
      this.notify();
      return result;
    }

    throw new Error(`Tipo de acción no reconocida: ${actionType}`);
  }

  public interactWithEcosystemNPC(
    npcId: string,
    action: 'collab_beat' | 'buy_exclusive' | 'hang_out' | 'call_out'
  ) {
    const player = this.getPlayer();
    if (action === 'buy_exclusive') {
      if (player.stats.funds < 500) {
        throw new Error('Fondos insuficientes ($500 necesarios).');
      }
      player.stats.funds -= 500;
      RelationshipEngine.modifyEcosystemNPC(this.world, npcId, {
        affinity: 15,
        loyalty: 10,
        historyNote: `Compraste una instrumental exclusiva ($500) en ${this.world.currentYear}.`
      });
      player.stats.hype = Math.min(100, player.stats.hype + 5);
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'production',
        amount: 500,
        description: 'Compra de beat exclusivo al productor del barrio'
      });
    } else if (action === 'collab_beat') {
      RelationshipEngine.modifyEcosystemNPC(this.world, npcId, {
        affinity: 10,
        loyalty: 5,
        historyNote: `Sesión de producción en home studio en ${this.world.currentYear}.`
      });
      player.stats.hype = Math.min(100, player.stats.hype + 4);
    } else if (action === 'hang_out') {
      RelationshipEngine.modifyEcosystemNPC(this.world, npcId, {
        affinity: 8,
        tension: -10,
        historyNote: `Reunión de negocios en reservado en ${this.world.currentYear}.`
      });
    } else if (action === 'call_out') {
      RelationshipEngine.modifyEcosystemNPC(this.world, npcId, {
        affinity: -20,
        tension: 25,
        historyNote: `Confrontación directa en ${this.world.currentYear}.`
      });
      player.stats.hype = Math.min(100, player.stats.hype + 10);
    }
    this.syncAudienceMetrics(player);
    this.notify();
  }

  public interactWithBeef(
    targetName: string,
    targetId: string,
    action: 'respond_social' | 'drop_diss' | 'ignore'
  ) {
    const player = this.getPlayer();
    const result = RelationshipEngine.processBeefInteraction(player, targetName, targetId, action, this.world);
    player.stats.hype = Math.max(0, Math.min(100, player.stats.hype + result.hypeChange));
    player.stats.energy = Math.max(0, Math.min(100, player.stats.energy + result.energyChange));
    if (player.stats.artisticCredibility !== undefined) {
      player.stats.artisticCredibility = Math.max(0, Math.min(100, player.stats.artisticCredibility + result.credibilityChange));
    }
    if (player.personality?.discipline !== undefined) {
      player.personality.discipline = Math.max(0, Math.min(100, player.personality.discipline + result.disciplineChange));
    }
    this.syncAudienceMetrics(player);
    this.notify();
    return result;
  }

  public restAndRecharge() {
    this.takeVacation();
  }

  public takeVacation(cost: number = 400) {
    const player = this.getPlayer();
    if (!player) return;

    // 1. Descontar costo módico de fondos si tiene saldo disponible
    const actualCost = Math.min(Math.max(0, player.stats.funds), cost);
    if (actualCost > 0) {
      player.stats.funds -= actualCost;
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'lifestyle',
        amount: actualCost,
        description: 'Retiro de bienestar y vacaciones'
      });
    }

    // 2. Recuperar energía vital (+50 hasta un tope de 100)
    player.stats.energy = Math.min(100, player.stats.energy + 50);

    // 3. Registrar noticia positiva de bienestar
    this.world.news.unshift({
      id: `news_vacation_${Date.now()}`,
      headline: `Bienestar & Salud: ${player.name} prioriza su descanso`,
      body: `${player.name} dedicó tiempo y recursos${actualCost > 0 ? ` (${formatMoney(actualCost)})` : ''} a un retiro de bienestar físico y mental, recargando vitalidad (+50%) para afrontar sus próximos proyectos artísticos con máxima energía.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'culture',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 3
    });

    // 4. Sincronizar y notificar listeners del estado del juego
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

    // Financial & Energy Safety Guards
    if (chosen.costFunds && player.stats.funds < chosen.costFunds) {
      return null;
    }
    if (chosen.costEnergy && player.stats.energy < chosen.costEnergy) {
      return null;
    }

    const outcome = chosen.apply({
      player,
      world: this.world,
      currentYear: this.world.currentYear,
      currentMonth: this.world.currentMonth
    });

    // Apply outcome deltas with Prodigy Multiplier if active
    const prodigyMultiplier = player.isProdigy ? 3 : 1;
    if (outcome.fundsChange) {
      player.stats.funds = Math.max(0, player.stats.funds + outcome.fundsChange);
      if (outcome.fundsChange > 0) {
        this.recordFinancialTransaction({
          type: 'income',
          category: 'event',
          amount: outcome.fundsChange,
          description: `Recompensa de evento: ${this.currentEvent.title}`
        });
      } else if (outcome.fundsChange < 0) {
        this.recordFinancialTransaction({
          type: 'expense',
          category: 'event',
          amount: Math.abs(outcome.fundsChange),
          description: `Gasto de evento: ${this.currentEvent.title}`
        });
      }
    }
    if (outcome.hypeChange) player.stats.hype = Math.max(0, Math.min(100, player.stats.hype + (outcome.hypeChange > 0 ? outcome.hypeChange * prodigyMultiplier : outcome.hypeChange)));
    if (outcome.popularityChange) player.stats.popularity = Math.max(0, Math.min(100, player.stats.popularity + (outcome.popularityChange > 0 ? outcome.popularityChange * prodigyMultiplier : outcome.popularityChange)));
    if (outcome.fansChange) player.stats.fansCount = Math.max(0, player.stats.fansCount + (outcome.fansChange > 0 ? outcome.fansChange * prodigyMultiplier : outcome.fansChange));
    if (outcome.reputationChange) player.stats.reputation = Math.max(0, Math.min(100, player.stats.reputation + (outcome.reputationChange > 0 ? outcome.reputationChange * prodigyMultiplier : outcome.reputationChange)));
    if (outcome.energyChange) player.stats.energy = Math.max(0, Math.min(100, player.stats.energy + outcome.energyChange));
    if (outcome.streamsChange) player.stats.totalStreams = Math.max(0, player.stats.totalStreams + (outcome.streamsChange > 0 ? outcome.streamsChange * prodigyMultiplier : outcome.streamsChange));

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

    // Sincronizar reactivamente métricas de audiencia si el evento alteró fans, popularidad, hype o si fue un fenómeno viral
    const isViral = Boolean(
      (this.currentEvent && this.currentEvent.id.includes('viral')) ||
      (outcome.narrativeText && outcome.narrativeText.toLowerCase().includes('viral')) ||
      (this.currentEvent && this.currentEvent.category === 'media' && (outcome.hypeChange || 0) >= 15) ||
      (outcome.fansChange && outcome.fansChange >= 5000)
    );

    const fansDelta = outcome.fansChange ? (outcome.fansChange > 0 ? outcome.fansChange * prodigyMultiplier : outcome.fansChange) : 0;
    let viralBoost = 0;
    if (outcome.streamsChange) {
      viralBoost += outcome.streamsChange > 0 ? outcome.streamsChange * prodigyMultiplier : outcome.streamsChange;
    }
    if (fansDelta > 0 || isViral) {
      viralBoost += StreamingEngine.calculateViralStreamSurge(
        Math.max(fansDelta, isViral ? 5000 : 0),
        player.stats.hype,
        player.stats.popularity
      );
    }

    this.syncAudienceMetrics(player, this.getPlayerSongs(), viralBoost);

    // Pop next event in queue if available
    if (this.eventQueue.length > 0) {
      this.currentEvent = this.eventQueue.shift()!;
    } else {
      this.currentEvent = null;
    }

    this.notify();
    return outcome;
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
      player.stats.energy = Math.min(100, player.stats.energy + 3 + lifestyleBuffs.passiveEnergyPerMonth);
      // Calibración suave del decaimiento de Hype (~8% semestral en vez de colapso rápido)
      const decayFactor = Math.min(0.995, 0.985 + lifestyleBuffs.hypeDecayReduction);
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
          this.world.genres[song.genreId],
          this.world.artists
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
        player.stats.fanbaseLoyalty,
        player.stats.hype
      );

      // Monthly economy settlement
      const label = player.labelId ? this.world.labels[player.labelId] : undefined;
      const manager = player.managerId ? this.world.managers[player.managerId] : undefined;
      const finance = EconomyEngine.calculateMonthlyFinances(player, playerTotalMonthlyStreams, label, manager);

      if (finance.artistStreamingNet > 0) {
        this.recordFinancialTransaction({
          type: 'income',
          category: 'streaming',
          amount: finance.artistStreamingNet,
          description: `Regalías de streaming (${this.world.currentYear}, Mes ${this.world.currentMonth})`
        });
      }
      if (finance.merchRevenue > 0) {
        this.recordFinancialTransaction({
          type: 'income',
          category: 'merch',
          amount: finance.merchRevenue,
          description: `Venta de merchandising (${this.world.currentYear}, Mes ${this.world.currentMonth})`
        });
      }
      if (finance.baseLivingExpenses > 0) {
        this.recordFinancialTransaction({
          type: 'expense',
          category: 'living_cost',
          amount: finance.baseLivingExpenses,
          description: `Alquiler / Costo de vida (${this.world.currentYear}, Mes ${this.world.currentMonth})`
        });
      }
      if (finance.lifestyleUpkeep > 0) {
        this.recordFinancialTransaction({
          type: 'expense',
          category: 'maintenance',
          amount: finance.lifestyleUpkeep,
          description: `Mantenimiento de equipamiento & estudio (${this.world.currentYear}, Mes ${this.world.currentMonth})`
        });
      }
      if (finance.managerCommission > 0) {
        this.recordFinancialTransaction({
          type: 'expense',
          category: 'contract',
          amount: finance.managerCommission,
          description: `Comisión de manager (${manager?.name || 'Manager'})`
        });
      }

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
        const droughtYear = this.world.currentYear;
        const playerReleasesInYear = Object.values(this.world.songs).filter(
          s => s.artistId === player.id && s.releaseYear === droughtYear
        ).length;

        if (playerReleasesInYear === 0) {
          const droughtEvent = getCreativeDroughtEvent({
            player,
            world: this.world,
            currentYear: droughtYear,
            currentMonth: this.world.currentMonth
          });
          collectedEvents.unshift(droughtEvent);
        }

        const awardRes = AwardEngine.conductAnnualAwards(this.world, droughtYear);
        this.world.awardsHistory.unshift(awardRes.ceremony);
        this.activeGalaCeremony = awardRes.ceremony;
        for (const aNews of awardRes.awardNews) {
          this.world.news.unshift({
            id: `news_award_${Date.now()}_${Math.random()}`,
            headline: aNews.headline,
            body: aNews.body,
            year: droughtYear,
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
        if (!this.world.financialLedger) this.world.financialLedger = [];
        const player = this.world.artists[parsed.playerId];
        if (player && !player.financialLedger) {
          player.financialLedger = [];
        }
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

