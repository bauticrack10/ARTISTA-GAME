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
  EventContext,
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
  NewsItem,
  CollabPact,
  IncomingCollabOffer,
  GlobalFestival,
  FestivalSlot,
  FestivalInvitation,
  StageProductionConfig,
  LiveShowDilemma,
  LiveShowResult,
  EditorialPlaylist,
  YouTubeComment,
  SnippetCampaignConfig,
  SnippetCampaignResult,
  TikTokInfluencerTier,
  ArtistPhoneMessage,
  ArtistPhoneChoice,
  YearEndWrappedData,
  SimulationStepMonths
} from '../types';
import { PhoneMessageEngine } from '../systems/PhoneMessageEngine';
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
import { CertificationEngine } from '../systems/CertificationEngine';
import { StreamingEngine, EDITORIAL_PLAYLISTS } from '../systems/StreamingEngine';
import { FestivalEngine, GLOBAL_FESTIVALS, STAGE_PRODUCTION_COSTS } from '../systems/FestivalEngine';
import { RelationshipEngine } from '../systems/RelationshipEngine';
import { SocialFeedEngine } from '../systems/SocialFeedEngine';
import { LegacyEngine } from '../systems/LegacyEngine';
import { TimeSystem } from '../systems/TimeSystem';
import { IndustryEngine } from '../systems/IndustryEngine';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';
import { DecisionEngine, DecisionActionType, DecisionExecutionResult, SemesterActivityData } from '../systems/DecisionEngine';

const createDefaultPeakPosition = (): Record<MusicRegion, number | null> => ({
  Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null,
  Spain: null, Mexico: null, UK: null, Brazil: null, Asia: null, Africa: null
});

const createDefaultWeeksOnChart = (): Record<MusicRegion, number> => ({
  Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0,
  Spain: 0, Mexico: 0, UK: 0, Brazil: 0, Asia: 0, Africa: 0
});

export class GameEngine {
  // Cap on world.news kept across cycles: the feed is history for the UI, not an infinite log, and an
  // unbounded array makes every future unshift() progressively more expensive (see advanceCycle()).
  public static readonly MAX_NEWS_ITEMS = 300;

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
        avatarColor: customPlayer.avatarColor || 'from-amber-600 to-orange-800',
        avatarIcon: customPlayer.avatarIcon,
        country: customPlayer.country || 'Argentina',
        city: customPlayer.city || 'Buenos Aires',
        birthYear: customPlayer.birthYear !== undefined ? customPlayer.birthYear : ((customPlayer.careerStartYear || 2026) - 18),
        careerStartYear: customPlayer.careerStartYear || 2026,
        mainGenreId: customPlayer.mainGenreId || 'trap_latino',
        subGenreIds: customPlayer.subGenreIds || [],
        personality: {
          creativity: 26,
          ambition: 24,
          discipline: 24,
          charisma: 24,
          skill: 26,
          commercialAppeal: 22,
          originality: 25,
          riskTolerance: 24,
          sociability: 22,
          independence: 24,
          ...(customPlayer.personality || {})
        },
        stats: {
          popularity: 20,
          reputation: 50,
          artisticCredibility: 60,
          energy: 100,
          monthlyListeners: 0,
          totalStreams: 0,
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
      // Default to creating an initial default player
      this.playerId = 'artist_player_1';
      const playerArtist: Artist = {
        id: this.playerId,
        name: 'Mi Artista',
        realName: 'Nombre Real',
        isPlayer: true,
        avatarColor: 'from-amber-600 to-orange-800',
        avatarIcon: 'mic',
        country: 'Argentina',
        city: 'Buenos Aires',
        birthYear: 2008,
        careerStartYear: 2026,
        mainGenreId: 'trap_latino',
        subGenreIds: ['sub_trap_underground'],
        personality: {
          creativity: 26,
          ambition: 24,
          discipline: 24,
          charisma: 24,
          skill: 26,
          commercialAppeal: 22,
          originality: 25,
          riskTolerance: 24,
          sociability: 22,
          independence: 24
        },
        stats: {
          popularity: 20,
          reputation: 50,
          artisticCredibility: 60,
          energy: 100,
          monthlyListeners: 0,
          totalStreams: 0,
          funds: 4500,
          fansCount: 12000,
          fanbaseLoyalty: 75,
          hype: 55
        },
        careerStage: 'Underground',
        labelId: null,
        managerId: null,
        activeContract: null,
        relationships: {},
        eras: [
          {
            id: `era_${this.playerId}_debut`,
            name: 'Los Primeros Pasos & Grabaciones Caseras',
            startYear: 2026,
            startMonth: 1,
            genreFocus: 'trap_latino',
            stage: 'Underground',
            highlightSummary: 'Inicios del camino artístico y primeras grabaciones en el estudio.'
          }
        ],
        awardsWon: [],
        legacyScore: 12,
        isRetired: false,
        historicalNotes: ['Comenzó su carrera artística en 2026.'],
        generationIndex: 1,
        influences: [],
        lifestyleUpgrades: [],
        financialLedger: []
      };
      this.world.artists[this.playerId] = playerArtist;
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
        Mexico: { region: 'Mexico', year: 2026, month: 1, entries: [] },
        UK: { region: 'UK', year: 2026, month: 1, entries: [] },
        Brazil: { region: 'Brazil', year: 2026, month: 1, entries: [] },
        Asia: { region: 'Asia', year: 2026, month: 1, entries: [] },
        Africa: { region: 'Africa', year: 2026, month: 1, entries: [] }
      },
      awardsHistory: [],
      news: [
        {
          id: 'news_init_1',
          headline: 'Arranca el calendario de lanzamientos con sellos independientes al frente',
          body: 'Los estudios de grabación en Buenos Aires, Ciudad de México y Madrid reportan agenda llena para el primer trimestre de 2026.',
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
          authorAvatarGradient: 'from-amber-600 to-orange-800',
          badge: 'Radar de Nuevos Talentos',
          year: 2026,
          month: 1,
          content: 'Los estudios caseros de Buenos Aires están sacando mejores mezclas que las multinacionales este verano. Hay cuatro o cinco nombres nuevos para seguir de cerca.',
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
      financialLedger: [],
      pendingCollabOffers: [],
      activeCollabPacts: [],
      playlists: EDITORIAL_PLAYLISTS.reduce((acc, p) => ({ ...acc, [p.id]: { ...p } }), {}),
      festivalInvitations: [],
      festivalHistory: [],
      phoneMessages: [],
      unreadPhoneCount: 0,
      activeYearEndWrapped: null,
      playerWrappedHistory: []
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

    // 3.1 Actualizar popularidad objetivo para evitar desconexión entre oyentes y popularidad
    const hitsCount = playerSongs.filter(s => (s.peakPosition?.Global ?? 99) <= 10).length;
    const targetPop = StreamingEngine.calculateTargetPopularity(
      player.stats.monthlyListeners,
      player.stats.totalStreams,
      hitsCount
    );
    if (player.stats.popularity < targetPop) {
      player.stats.popularity = targetPop;
    }

    // 4. Garantizar coherencia matemática en streams totales
    if (!hasCatalog) {
      player.stats.monthlyListeners = 0;
      player.stats.totalStreams = 0;
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
      originalityBonus: 0,
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
        if (item.effects.originalityBonus) buffs.originalityBonus += item.effects.originalityBonus;
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
    const multiplier = player.isProdigy ? (player.prodigyMultiplier || 3) : 1;
    const gainedStatsList: string[] = [];

    if (item.effects.skillBonus) {
      const added = item.effects.skillBonus * multiplier;
      player.personality.skill = Math.min(100, player.personality.skill + added);
      gainedStatsList.push(`+${added} Habilidad`);
    }
    if (item.effects.creativityBonus) {
      const added = item.effects.creativityBonus * multiplier;
      player.personality.creativity = Math.min(100, player.personality.creativity + added);
      gainedStatsList.push(`+${added} Creatividad`);
    }
    if (item.effects.charismaBonus) {
      const added = item.effects.charismaBonus * multiplier;
      player.personality.charisma = Math.min(100, player.personality.charisma + added);
      gainedStatsList.push(`+${added} Carisma`);
    }
    if (item.effects.disciplineBonus) {
      const added = item.effects.disciplineBonus * multiplier;
      player.personality.discipline = Math.min(100, player.personality.discipline + added);
      gainedStatsList.push(`+${added} Disciplina`);
    }
    if (item.effects.reputationBonus) {
      const added = item.effects.reputationBonus * multiplier;
      player.stats.reputation = Math.min(100, player.stats.reputation + added);
      gainedStatsList.push(`+${added} Reputación`);
    }
    if (item.effects.commercialAppealBonus) {
      const added = item.effects.commercialAppealBonus * multiplier;
      player.personality.commercialAppeal = Math.min(100, player.personality.commercialAppeal + added);
      gainedStatsList.push(`+${added} Atractivo Comercial`);
    }
    if (item.effects.originalityBonus) {
      const added = item.effects.originalityBonus * multiplier;
      player.personality.originality = Math.min(100, player.personality.originality + added);
      gainedStatsList.push(`+${added} Originalidad`);
    }
    if (item.effects.ambitionBonus) {
      const added = item.effects.ambitionBonus * multiplier;
      player.personality.ambition = Math.min(100, player.personality.ambition + added);
      gainedStatsList.push(`+${added} Ambición`);
    }
    if (item.effects.riskToleranceBonus) {
      const added = item.effects.riskToleranceBonus * multiplier;
      player.personality.riskTolerance = Math.min(100, player.personality.riskTolerance + added);
      gainedStatsList.push(`+${added} Tolerancia al Riesgo`);
    }
    if (item.effects.sociabilityBonus) {
      const added = item.effects.sociabilityBonus * multiplier;
      player.personality.sociability = Math.min(100, player.personality.sociability + added);
      gainedStatsList.push(`+${added} Sociabilidad`);
    }
    if (item.effects.independenceBonus) {
      const added = item.effects.independenceBonus * multiplier;
      player.personality.independence = Math.min(100, player.personality.independence + added);
      gainedStatsList.push(`+${added} Autonomía`);
    }

    const bonusSummary = gainedStatsList.length > 0 ? ` (${gainedStatsList.join(', ')})` : '';

    // Generate News
    this.world.news.unshift({
      id: `news_lifestyle_${Date.now()}`,
      headline: `Estilo de Vida: ${player.name} adquiere "${item.name}"`,
      body: `${player.name} invirtió ${formatMoney(item.price)} en ${item.name.toLowerCase()}, sumando mejoras permanentes${bonusSummary}.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'culture',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 3
    });

    this.notify();
    return {
      success: true,
      message: `¡Has adquirido "${item.name}" exitosamente!${bonusSummary}`
    };
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
    isDissTrack?: boolean;
    dissTargetArtistId?: string;
    dissAngle?: 'lyrical' | 'expose' | 'flex_numbers';
  }): Song {
    const player = this.getPlayer();
    if (!params.title || !params.title.trim()) {
      throw new Error('El título de la canción es obligatorio.');
    }

    const currentYearSingles = this.getPlayerSinglesReleasedThisYear();
    if (currentYearSingles >= GameEngine.MAX_SINGLES_PER_YEAR) {
      throw new Error(`Has alcanzado el límite anual de lanzamientos (${GameEngine.MAX_SINGLES_PER_YEAR} singles por año). El cupo se reiniciará en enero (Semestre 1).`);
    }

    // Anti-spam mensual: no saturar el mercado en el mismo mes; requiere avanzar tiempo para ver el impacto
    const singlesThisMonth = Object.values(this.world.songs).filter(
      s => s.artistId === player.id && s.isSingle && s.releaseYear === this.world.currentYear && s.releaseMonth === this.world.currentMonth
    ).length;
    if (singlesThisMonth >= 1) {
      throw new Error(`Ya lanzaste un sencillo este mes (${this.world.currentYear}, Mes ${this.world.currentMonth}). Avanza el tiempo (+1M o +3M) para observar su debut en los charts y preparar la siguiente campaña.`);
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

    // Validar autorización de artistas invitados
    if (params.featuredArtistIds && params.featuredArtistIds.length > 0) {
      for (const featId of params.featuredArtistIds) {
        if (!featId || featId === player.id) continue;
        const targetArtist = this.world.artists[featId];
        if (targetArtist) {
          const check = RelationshipEngine.isArtistEligibleForCollab(player, targetArtist, this.world.activeCollabPacts);
          if (!check.isEligible) {
            throw new Error(`No puedes incluir a ${targetArtist.name} en este lanzamiento: ${check.reason}`);
          }
        }
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
    const safeBudgetProd = Number.isFinite(params.budgetProduction) ? params.budgetProduction : 0;
    const safeBudgetMktg = Number.isFinite(params.budgetMarketing) ? params.budgetMarketing : 0;

    const perfEval = IndustryEngine.deriveTrackPerformanceAndLongevity({
      artist: player,
      productionBudget: safeBudgetProd,
      marketingBudget: safeBudgetMktg,
      producer: prod,
      subGenreId: params.subGenreIds && params.subGenreIds.length > 0 ? params.subGenreIds[0] : undefined,
      musicVideo: params.musicVideo,
      qualityBonus: lifestyleBuffs?.qualityBonus || 0
    });

    const chosenLongevity = params.longevityCurve || perfEval.longevityCurve;

    // Fórmula de Calidad y Éxito Transparente (Skills + Estudio + Estado/Forma + Sinergia Género & Hype)
    const rawSkills = (player.personality?.skill || 50) * 0.35 + (player.personality?.creativity || 50) * 0.35 + (player.personality?.charisma || 50) * 0.15 + (player.personality?.originality || 50) * 0.15;
    const skillsComponent = Number.isFinite(rawSkills) ? rawSkills : 50;
    const studioComponent = Number.isFinite(perfEval.productionQuality) ? perfEval.productionQuality : 40;
    const playerEnergy = player.stats?.energy || 100;
    const formFactor = playerEnergy >= 70 ? 4 : (playerEnergy < 30 ? -Math.floor((30 - playerEnergy) * 0.35) : 0);
    
    let genreSynergy = 0;
    const activeTrends = Object.values(this.world.trends || {}).filter(t => t && t.stage !== 'exhausted');
    for (const tr of activeTrends) {
      if (tr.genreId === params.genreId || (params.subGenreIds && params.subGenreIds.includes(tr.genreId))) {
        genreSynergy += Math.floor((tr.impactMultiplier || 1) * 3);
      }
    }
    const hypeFactor = Math.floor((player.stats?.hype || 0) * 0.10);

    const calcQuality = (skillsComponent * 0.40) + (studioComponent * 0.35) + (genreSynergy * 0.10) + (hypeFactor * 0.10) + formFactor;
    const baseQuality = Math.min(100, Math.max(12, Math.floor(Number.isFinite(calcQuality) ? calcQuality : 50)));

    const rawAppeal = (player.personality?.commercialAppeal || 50) * 0.45 + (Number.isFinite(perfEval.marketingInvestment) ? perfEval.marketingInvestment : 40) * 0.55;
    const commercialAppeal = Math.min(100, Math.max(10, Math.floor(Number.isFinite(rawAppeal) ? rawAppeal : 50)));

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
      peakPosition: createDefaultPeakPosition(),
      weeksOnChart: createDefaultWeeksOnChart(),
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
      } : undefined,
      isDissTrack: params.isDissTrack,
      dissTargetArtistId: params.dissTargetArtistId,
      dissAngle: params.dissAngle
    };

    this.world.songs[songId] = newSong;

    // Soporte de Diss Tracks en releaseSong: enfrentamiento lírico
    if (params.isDissTrack && params.dissTargetArtistId) {
      const target = this.world.artists[params.dissTargetArtistId];
      if (target) {
        // Comparar habilidad lírica y hype del jugador vs el defensor
        const playerLyrical = Number((player.personality.skill * 0.40 + player.personality.originality * 0.35 + player.stats.artisticCredibility * 0.25).toFixed(1));
        const targetLyrical = Number((target.personality.skill * 0.40 + target.personality.originality * 0.35 + target.stats.artisticCredibility * 0.25).toFixed(1));
        const playerPower = playerLyrical + (player.stats.hype * 0.1);
        const targetPower = targetLyrical + (target.stats.hype * 0.1);
        const diff = playerPower - targetPower;

        let outcomeType: 'lyrical_victory' | 'street_tie' | 'backfire' = 'street_tie';
        let headline = '';
        let body = '';
        let hypeGainPlayer = 28;
        let hypeGainTarget = 15;
        let affinityDelta = -40;
        let respectDelta = 5;

        if (diff >= 3) {
          outcomeType = 'lyrical_victory';
          hypeGainPlayer = 45;
          hypeGainTarget = 10;
          respectDelta = 15;
          affinityDelta = -50;
          headline = `¡Guerra Lírica Total! "${params.title}" de ${player.name} destroza a ${target.name} con barras demoledoras`;
          body = `El nuevo single de ${player.name} es una tiradera despiadada contra ${target.name}. La escena urbana declara ganador unánime a ${player.name} (${playerPower.toFixed(1)} vs ${targetPower.toFixed(1)}).`;
          player.stats.artisticCredibility = Math.min(100, player.stats.artisticCredibility + 6);
          target.stats.reputation = Math.max(0, target.stats.reputation - 8);
        } else if (diff > -3) {
          outcomeType = 'street_tie';
          hypeGainPlayer = 28;
          hypeGainTarget = 25;
          respectDelta = 10;
          affinityDelta = -35;
          headline = `¡Choque de Titanes! "${params.title}" de ${player.name} enciende un feroz enfrentamiento con ${target.name}`;
          body = `La tiradera de ${player.name} contra ${target.name} generó un debate volcánico en redes. Ambos artistas demuestran calibre de peso pesado en un cruce parejísimo (${playerPower.toFixed(1)} vs ${targetPower.toFixed(1)}).`;
          player.stats.artisticCredibility = Math.min(100, player.stats.artisticCredibility + 2);
        } else {
          outcomeType = 'backfire';
          hypeGainPlayer = 15;
          hypeGainTarget = 35;
          respectDelta = 0;
          affinityDelta = -30;
          headline = `¡Tiro por la culata! El diss track "${params.title}" de ${player.name} contra ${target.name} genera burlas y memes`;
          body = `La tiradera de ${player.name} no alcanzó el peso lírico de ${target.name} (${playerPower.toFixed(1)} vs ${targetPower.toFixed(1)}). En redes destacan la superioridad técnica del defensor.`;
          player.stats.reputation = Math.max(0, player.stats.reputation - 6);
          player.stats.artisticCredibility = Math.max(0, player.stats.artisticCredibility - 5);
          target.stats.reputation = Math.min(100, target.stats.reputation + 5);
        }

        player.stats.hype = Math.min(100, player.stats.hype + hypeGainPlayer);
        target.stats.hype = Math.min(100, target.stats.hype + hypeGainTarget);

        RelationshipEngine.modifyRelationship(
          player,
          target,
          affinityDelta,
          respectDelta,
          'rival',
          `Single Tiradera "${params.title}" [${outcomeType}] (Lírica: ${playerLyrical} vs ${targetLyrical}) en Año ${this.world.currentYear} - Mes ${this.world.currentMonth}.`
        );

        const relA = player.relationships[target.id];
        if (relA) {
          relA.activeRivalry = true;
          relA.lastDissYear = this.world.currentYear;
          relA.lastDissMonth = this.world.currentMonth;
          relA.dissCount = (relA.dissCount || 0) + 1;
        }
        const relB = target.relationships[player.id];
        if (relB) {
          relB.activeRivalry = true;
          relB.lastDissYear = this.world.currentYear;
          relB.lastDissMonth = this.world.currentMonth;
          relB.dissCount = (relB.dissCount || 0) + 1;
        }

        if (!this.world.activeBeefs) this.world.activeBeefs = {};
        const beefId = `beef_${target.id}`;
        const existingBeef = this.world.activeBeefs[beefId];
        this.world.activeBeefs[beefId] = {
          id: beefId,
          targetId: target.id,
          targetName: target.name,
          stage: existingBeef ? 'all_out_war' : 'diss_tracks',
          hypeMultiplier: outcomeType === 'lyrical_victory' ? 1.6 : 1.3,
          hypeGenerated: (existingBeef?.hypeGenerated || 0) + hypeGainPlayer,
          tensionLevel: Math.min(100, (existingBeef?.tensionLevel || 50) + 35),
          dissTracksExchanged: [...(existingBeef?.dissTracksExchanged || []), params.title],
          turnsActive: (existingBeef?.turnsActive || 0) + 1,
          lastActionDescription: headline,
          playerWon: outcomeType === 'lyrical_victory' ? true : outcomeType === 'backfire' ? false : undefined
        };

        this.world.news.unshift({
          id: `news_diss_track_${songId}`,
          headline,
          body,
          year: this.world.currentYear,
          month: this.world.currentMonth,
          category: 'rivalry',
          relatedArtistIds: [player.id, target.id],
          sentiment: outcomeType === 'backfire' ? 'negative' : 'shocking',
          importance: 5
        });

        if (!this.world.socialFeed) this.world.socialFeed = [];
        const dissPosts = SocialFeedEngine.generateDissLyricalPosts(
          this.world,
          player,
          target,
          outcomeType,
          playerLyrical,
          targetLyrical
        );
        this.world.socialFeed.unshift(...dissPosts);
      }
    }

    if (params.featuredArtistIds && params.featuredArtistIds.length > 0) {
      if (!this.world.activeCollabPacts) this.world.activeCollabPacts = [];
      for (const featId of params.featuredArtistIds) {
        const pact = this.world.activeCollabPacts.find(p => p.targetArtistId === featId && p.status === 'active');
        if (pact) {
          pact.status = 'fulfilled';
        }
        const rel = player.relationships[featId];
        if (rel) {
          rel.pastCollabsCount = (rel.pastCollabsCount || 0) + 1;
        }
      }
    }

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
        peakPosition: createDefaultPeakPosition(),
        weeksOnChart: createDefaultWeeksOnChart(),
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
      'from-amber-600 to-orange-800',
      'from-zinc-800 to-zinc-950',
      'from-emerald-600 to-teal-900',
      'from-cyan-700 to-slate-950',
      'from-rose-600 to-red-900',
      'from-stone-800 to-neutral-950'
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
      peakChartPosition: createDefaultPeakPosition(),
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

    // 5.5 Aumentar afinidad, respeto, pastCollabsCount (+1), hype y notas históricas en ambos artistas
    const proximity = RelationshipEngine.evaluateGeographicAndLanguageProximity(player, target);
    const affinityGain = proximity.isSameCountry ? 20 : proximity.sharesLanguageOrRegion ? 18 : 15;
    const respectGain = proximity.isSameCountry ? 18 : 15;

    const relA = RelationshipEngine.getOrCreateRelationship(player, target.id);
    const relB = RelationshipEngine.getOrCreateRelationship(target, player.id);
    relA.pastCollabsCount = (relA.pastCollabsCount || 0) + 1;
    relB.pastCollabsCount = (relB.pastCollabsCount || 0) + 1;

    const newRelType = (relA.relationType === 'friend' || relA.relationType === 'mentor') ? relA.relationType : 'collaborator';
    const geoTag = proximity.isSameCountry ? ` [Escena Local: ${player.country}]` : proximity.sharesLanguageOrRegion ? ' [Sinergia Regional]' : ' [Cruce Internacional]';
    const historyNote = `Colaboración exitosa en "${params.title}" (${creditDisplay}) en ${this.world.currentYear}. Química: ${chemistryBonus}/25.${geoTag}`;
    RelationshipEngine.modifyRelationship(player, target, affinityGain, respectGain, newRelType, historyNote);

    const hypeGain = Math.min(45, Math.floor(18 + target.stats.popularity * 0.20 + chemistryBonus * 0.6 + (proximity.isSameCountry ? 4 : 0)));
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
        peakPosition: createDefaultPeakPosition(),
        weeksOnChart: createDefaultWeeksOnChart(),
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
          peakPosition: createDefaultPeakPosition(),
          weeksOnChart: createDefaultWeeksOnChart(),
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
        peakChartPosition: createDefaultPeakPosition(),
        awards: [],
        coverGradient: 'from-amber-600 to-orange-800'
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
    if (!player) throw new Error('Artista no encontrado.');

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
    const reducedFatigue = Math.max(5, Math.floor((tour.energyFatigue || 20) * (1 - (lifestyleBuffs?.tourFatigueReduction || 0))));

    if (!Array.isArray(this.world.tours)) {
      this.world.tours = [];
    }
    this.world.tours.push(tour);

    const safeNetProfit = Number.isFinite(tour.netArtistProfit) ? tour.netArtistProfit : 0;
    const safeFatigue = Number.isFinite(reducedFatigue) ? reducedFatigue : 20;
    const safeHype = Number.isFinite(tour.hypeGenerated) ? tour.hypeGenerated : 5;
    const safeFans = Number.isFinite(tour.fanbaseGained) ? tour.fanbaseGained : 50;

    player.stats.funds = Math.max(0, (player.stats.funds || 0) + safeNetProfit);
    player.stats.energy = Math.max(5, Math.min(100, (player.stats.energy || 100) - safeFatigue));
    player.stats.hype = Math.min(100, Math.max(0, (player.stats.hype || 0) + safeHype));
    player.stats.fansCount = Math.max(0, (player.stats.fansCount || 0) + safeFans);

    this.recordFinancialTransaction({
      type: 'income',
      category: 'tour',
      amount: safeNetProfit,
      description: `Ganancia neta por gira "${tour.name}"`
    });

    this.world.news.unshift({
      id: `news_tour_${tour.id}`,
      headline: `Gira Consagratoria: ${tour.name} culmina con ${(tour.totalTicketsSold || 0).toLocaleString('es-AR')} tickets vendidos`,
      body: `${player.name} brilló en cada una de sus fechas, generando una ganancia neta de ${formatMoney(safeNetProfit)}.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'tour',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 4
    });

    this.syncPlayerAudienceMetrics(safeFans, false);
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
      const proximity = RelationshipEngine.evaluateGeographicAndLanguageProximity(player, target);

      if (result.willAccept) {
        const affinityDelta = proximity.isSameCountry ? 25 : proximity.sharesLanguageOrRegion ? 20 : 15;
        const respectDelta = proximity.isSameCountry ? 18 : 15;
        const hypeDelta = Math.min(30, 15 + Math.floor(result.chemistryScore * 0.5));

        RelationshipEngine.modifyRelationship(
          player,
          target,
          affinityDelta,
          respectDelta,
          'collaborator',
          `Aceptaron colaborar juntos en ${this.world.currentYear}. ${result.reason}`
        );
        player.stats.hype = Math.min(100, player.stats.hype + hypeDelta);
        this.syncAudienceMetrics(player);

        const headline = proximity.isSameCountry
          ? `Alianza local confirmada: ${player.name} y ${target.name} anuncian junte en ${player.country}`
          : `Alianza confirmada: ${player.name} y ${target.name} anuncian colaboración`;
        const body = proximity.isSameCountry
          ? `La escena de ${player.country} celebra la unión de dos talentos compatibles con una química calculada en ${result.chemistryScore}/25.`
          : `Los fanáticos celebran la unión de dos fuerzas musicales complementarias con química calculada en ${result.chemistryScore}/25.`;

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

        if (!this.world.activeCollabPacts) this.world.activeCollabPacts = [];
        this.world.activeCollabPacts.push({
          id: `pact_${player.id}_${target.id}_${Date.now()}`,
          targetArtistId: target.id,
          format: 'single_feat',
          creditFormat: 'player_feat_target',
          agreedBudget: 0,
          signedYear: this.world.currentYear,
          expiresYear: this.world.currentYear + 1,
          status: 'active'
        });

        this.notify();
        return {
          success: true,
          actionType: 'collab_request',
          targetArtistId: target.id,
          targetArtistName: target.name,
          outcomeDescription: `${target.name} aceptó la solicitud de colaboración. (${result.reason})`,
          hypeChange: hypeDelta,
          affinityDelta,
          respectDelta,
          newRelationType: 'collaborator',
          newsItem
        };
      } else {
        RelationshipEngine.modifyRelationship(player, target, -4, 0, undefined, `Propuesta de colaboración rechazada en ${this.world.currentYear}: ${result.reason}`);
        this.notify();
        return {
          success: false,
          actionType: 'collab_request',
          targetArtistId: target.id,
          targetArtistName: target.name,
          outcomeDescription: result.reason,
          affinityDelta: -4,
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

  public submitCollabProposal(params: {
    targetArtistId: string;
    projectType: CollabProjectType;
    budgetProduction?: number;
    creditOrder?: CreditOrderType;
  }): {
    success: boolean;
    reason: string;
    pact?: CollabPact;
    feasibility: CollabFeasibilityResult;
  } {
    const player = this.getPlayer();
    const target = this.world.artists[params.targetArtistId];
    if (!target) {
      return {
        success: false,
        reason: 'El artista objetivo no existe en la escena musical.',
        feasibility: {
          willAccept: false,
          reason: 'Artista no encontrado.',
          chemistryScore: 0,
          crossFanbasePotential: 0,
          acceptanceProbability: 0
        }
      };
    }

    const feas = RelationshipEngine.calculateCollabFeasibility(
      player,
      target,
      params.projectType,
      params.budgetProduction || 0,
      params.creditOrder || 'player_feat_target'
    );

    if (feas.willAccept) {
      RelationshipEngine.modifyRelationship(
        player,
        target,
        20,
        15,
        'collaborator',
        `Pactaron colaborar juntos en ${this.world.currentYear} (${params.projectType}).`
      );
      player.stats.hype = Math.min(100, player.stats.hype + 15);
      this.syncAudienceMetrics(player);

      if (!this.world.activeCollabPacts) this.world.activeCollabPacts = [];
      const pact: CollabPact = {
        id: `pact_${player.id}_${target.id}_${Date.now()}`,
        targetArtistId: target.id,
        format: params.projectType,
        creditFormat: params.creditOrder || 'player_feat_target',
        agreedBudget: params.budgetProduction || 0,
        signedYear: this.world.currentYear,
        expiresYear: this.world.currentYear + 1,
        status: 'active'
      };
      this.world.activeCollabPacts.push(pact);

      this.world.news.unshift({
        id: `news_pact_${Date.now()}`,
        headline: `Alianza musical: ${player.name} y ${target.name} acuerdan colaboración`,
        body: `Ambos artistas confirmaron que entrarán al estudio para trabajar en un proyecto conjunto (${params.projectType}).`,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: 'culture',
        relatedArtistIds: [player.id, target.id],
        sentiment: 'positive',
        importance: 3
      });

      this.notify();
      return { success: true, reason: feas.reason, pact, feasibility: feas };
    } else {
      RelationshipEngine.modifyRelationship(
        player,
        target,
        -4,
        0,
        undefined,
        `Propuesta de colaboración (${params.projectType}) declinada en ${this.world.currentYear}: "${feas.reason}"`
      );
      this.notify();
      return { success: false, reason: feas.reason, feasibility: feas };
    }
  }

  public generateRandomCollabOffer(): IncomingCollabOffer | null {
    const player = this.getPlayer();
    const isProducer = Math.random() < 0.40;

    if (isProducer) {
      const allProds = Object.values(this.world.producers || {});
      if (allProds.length === 0) return null;
      const prod = allProds[Math.floor(Math.random() * allProds.length)];
      const isDiscount = Math.random() < 0.6;
      const discountPct = isDiscount ? 50 : 100;
      const fee = isDiscount ? Math.floor(prod.costPerTrack * 0.5) : 0;

      const offerTitles = [
        'Beat Tape Session',
        'Noche de Búnker',
        'Instrumental Élite',
        'Fórmula Sonora',
        'Ritmo Pesado'
      ];
      const title = offerTitles[Math.floor(Math.random() * offerTitles.length)];

      return {
        id: `offer_prod_${prod.id}_${this.world.currentYear}_${this.world.currentMonth}_${Math.floor(Math.random() * 1000)}`,
        senderProducerId: prod.id,
        senderName: prod.name,
        senderRole: 'producer',
        projectType: 'single_feat',
        creditOrder: 'player_feat_target',
        proposedTitle: title,
        genreId: player.mainGenreId,
        budgetOffered: fee,
        royaltySplitPct: 50,
        pitchMessage: isDiscount
          ? `${prod.name} escuchó tu sonido y te ofrece producir tu próximo tema con 50% de descuento en honorarios ($${fee.toLocaleString()}) para crear un palo radial.`
          : `${prod.name} quedó fascinado con tus barras y te propone una sesión de producción 100% gratuita para tu próximo single.`,
        createdAtYear: this.world.currentYear,
        createdAtMonth: this.world.currentMonth,
        expiresYear: this.world.currentYear + (this.world.currentMonth >= 7 ? 1 : 0),
        expiresMonth: this.world.currentMonth <= 6 ? this.world.currentMonth + 6 : (this.world.currentMonth + 6) % 12,
        status: 'pending'
      };
    } else {
      // Cantante / Colega
      const candidateArtists = Object.values(this.world.artists || {}).filter(a => {
        if (a.id === player.id || a.isRetired) return false;
        const rel = player.relationships?.[a.id];
        if (rel?.relationType === 'feud' || rel?.activeRivalry) return false;
        const popDiff = a.stats.popularity - player.stats.popularity;
        return Math.abs(popDiff) <= 25 || (popDiff > 0 && player.stats.hype >= 60 && popDiff <= 40);
      });

      if (candidateArtists.length === 0) return null;
      const sender = candidateArtists[Math.floor(Math.random() * candidateArtists.length)];

      const songTitles = [
        'Conexión Urbana',
        'Fuego en la Cabina',
        'Barras & Melodías',
        'Alianza Callejera',
        'Sin Filtro',
        'Códigos de Oro',
        'Noche Inolvidable'
      ];
      const proposedTitle = songTitles[Math.floor(Math.random() * songTitles.length)];
      const budgetOffered = Math.floor(2000 + Math.random() * 5000 + sender.stats.popularity * 40);

      const pitches = [
        `"Che ${player.name}, tengo una maqueta que explota y tu flow le calza perfecto. ¿Nos juntamos a grabar este tema?"`,
        `"Hermano, vengo siguiendo lo que estás sacando. Te tengo un espacio reservado para sumarte a mi próximo track."`,
        `"La escena está pidiendo este junte. Te mando la maqueta de '${proposedTitle}', armamos las barras y salimos a romper."`
      ];
      const pitch = pitches[Math.floor(Math.random() * pitches.length)];

      return {
        id: `offer_art_${sender.id}_${this.world.currentYear}_${this.world.currentMonth}_${Math.floor(Math.random() * 1000)}`,
        senderArtistId: sender.id,
        senderName: sender.name,
        senderRole: 'singer',
        projectType: 'single_feat',
        creditOrder: 'player_and_target',
        proposedTitle,
        genreId: sender.mainGenreId || player.mainGenreId,
        budgetOffered,
        royaltySplitPct: 50,
        pitchMessage: pitch,
        createdAtYear: this.world.currentYear,
        createdAtMonth: this.world.currentMonth,
        expiresYear: this.world.currentYear + (this.world.currentMonth >= 7 ? 1 : 0),
        expiresMonth: this.world.currentMonth <= 6 ? this.world.currentMonth + 6 : (this.world.currentMonth + 6) % 12,
        status: 'pending'
      };
    }
  }

  public acceptCollabOffer(offerId: string): {
    success: boolean;
    message: string;
    offer?: IncomingCollabOffer;
  } {
    if (!this.world.pendingCollabOffers) this.world.pendingCollabOffers = [];
    const offer = this.world.pendingCollabOffers.find(o => o.id === offerId && o.status === 'pending');
    if (!offer) {
      return { success: false, message: 'La oferta de colaboración ya no está disponible o ha expirado.' };
    }

    const player = this.getPlayer();
    offer.status = 'accepted';
    this.world.pendingCollabOffers = this.world.pendingCollabOffers.filter(o => o.id !== offerId);

    if (offer.senderRole === 'producer') {
      if (!this.world.activeCollabPacts) this.world.activeCollabPacts = [];
      this.world.activeCollabPacts.push({
        id: `pact_${offer.id}`,
        targetProducerId: offer.senderProducerId,
        format: 'single_feat',
        creditFormat: 'player_feat_target',
        agreedBudget: offer.budgetOffered,
        producerDiscountPct: offer.budgetOffered === 0 ? 100 : 50,
        signedYear: this.world.currentYear,
        expiresYear: this.world.currentYear + 1,
        status: 'active'
      });

      player.stats.hype = Math.min(100, player.stats.hype + 12);
      this.world.news.unshift({
        id: `news_offer_acc_${Date.now()}`,
        headline: `Sesión de Estudio: ${player.name} entra a producir con ${offer.senderName}`,
        body: `El productor ${offer.senderName} confirmó un acuerdo exclusivo de producción para el próximo single de ${player.name}.`,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: 'industry',
        relatedArtistIds: [player.id],
        sentiment: 'positive',
        importance: 3
      });

      this.notify();
      return {
        success: true,
        message: `¡Pacto de producción aceptado con ${offer.senderName}! Tienes un beat reservado con descuento especial para tu próximo tema.`,
        offer
      };
    } else {
      const partner = offer.senderArtistId ? this.world.artists[offer.senderArtistId] : undefined;
      if (partner) {
        RelationshipEngine.modifyRelationship(
          player,
          partner,
          25,
          15,
          'collaborator',
          `Aceptaron la propuesta de colaboración para "${offer.proposedTitle}" en ${this.world.currentYear}.`
        );
      }

      if (!this.world.activeCollabPacts) this.world.activeCollabPacts = [];
      this.world.activeCollabPacts.push({
        id: `pact_${offer.id}`,
        targetArtistId: offer.senderArtistId,
        format: offer.projectType,
        creditFormat: offer.creditOrder,
        agreedBudget: offer.budgetOffered,
        signedYear: this.world.currentYear,
        expiresYear: this.world.currentYear + 1,
        status: 'active'
      });

      player.stats.hype = Math.min(100, player.stats.hype + 20);
      player.stats.fansCount += Math.floor(300 + (partner ? partner.stats.popularity * 30 : 200));
      this.syncAudienceMetrics(player);

      this.world.news.unshift({
        id: `news_offer_acc_${Date.now()}`,
        headline: `Junte Oficial: ${player.name} y ${offer.senderName} anuncian "${offer.proposedTitle}"`,
        body: `Ambos exponentes confirmaron la colaboración tras sellar un acuerdo creativo en el estudio.`,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: 'culture',
        relatedArtistIds: partner ? [player.id, partner.id] : [player.id],
        sentiment: 'positive',
        importance: 3
      });

      this.notify();
      return {
        success: true,
        message: `¡Colaboración confirmada con ${offer.senderName}! ${offer.senderName} ahora es tu Colaborador Acordado y el feat está desbloqueado.`,
        offer
      };
    }
  }

  public declineCollabOffer(offerId: string): {
    success: boolean;
    message: string;
  } {
    if (!this.world.pendingCollabOffers) this.world.pendingCollabOffers = [];
    const offer = this.world.pendingCollabOffers.find(o => o.id === offerId);
    if (!offer) {
      return { success: false, message: 'La oferta no fue encontrada.' };
    }

    offer.status = 'declined';
    this.world.pendingCollabOffers = this.world.pendingCollabOffers.filter(o => o.id !== offerId);
    this.notify();
    return {
      success: true,
      message: `Has declinado cortésmente la propuesta de ${offer.senderName}.`
    };
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

  public restAndRecharge(): DecisionExecutionResult {
    return this.executeDecisionAction('reflective_rest');
  }

  public takeVacation(cost: number = 400): DecisionExecutionResult {
    return this.executeDecisionAction('reflective_rest');
  }

  public executeDecisionAction(actionType: DecisionActionType): DecisionExecutionResult {
    const player = this.getPlayer();
    const result = DecisionEngine.executeDecision(actionType, player, this.world);
    if (result.success) {
      if (result.fundsSpent > 0) {
        this.recordFinancialTransaction({
          type: 'expense',
          category: actionType === 'reflective_rest' ? 'lifestyle' : 'production',
          amount: result.fundsSpent,
          description: `Decisión de desarrollo: ${result.title}`
        });
      }
      if (result.newsItem) {
        this.world.news.unshift(result.newsItem);
      }
      this.syncAudienceMetrics(player);
      this.notify();
    }
    return result;
  }

  public resolveCurrentEventChoice(choiceIndex: number): EventOutcome | null {
    if (!this.currentEvent) return null;
    const player = this.getPlayer();
    const context: EventContext = {
      player,
      world: this.world,
      currentYear: this.world.currentYear,
      currentMonth: this.world.currentMonth,
      eventYear: this.currentEvent.eventYear
    };
    const choices = this.currentEvent.choices(context);

    const chosen = choices[choiceIndex];
    if (!chosen) return null;

    // Financial & Energy Safety Guards
    if (chosen.costFunds && player.stats.funds < chosen.costFunds) {
      return null;
    }
    if (chosen.costEnergy && player.stats.energy < chosen.costEnergy) {
      return null;
    }

    const outcome = chosen.apply(context);

    // Apply outcome deltas with Prodigy Multiplier if active
    const prodigyMultiplier = player.isProdigy ? (player.prodigyMultiplier || 3) : 1;
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

    // 2. Primary Stats & Personality Deltas
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
          let targetVal: number;
          if (v < 0) {
            targetVal = Math.max(0, currentVal + v);
          } else if (v <= 25 && currentVal > 30) {
            // Delta value passed (e.g. +3)
            const effDelta = player.isProdigy ? v * (player.prodigyMultiplier || 3) : v;
            targetVal = Math.min(100, Math.max(0, currentVal + effDelta));
          } else {
            // Absolute target value passed
            const delta = v - currentVal;
            if (delta > 0 && player.isProdigy) {
              targetVal = Math.min(100, currentVal + delta * (player.prodigyMultiplier || 3));
            } else {
              targetVal = Math.min(100, Math.max(0, v));
            }
          }
          (player.personality as any)[k] = targetVal;
        }
      }
    }

    // 3. Contracts & Managers
    if (outcome.newContract) {
      this.signContract(outcome.newContract);
    }
    if (outcome.newManagerId) {
      this.hireManager(outcome.newManagerId);
    }

    // 4. Relationships & Ecosystem NPCs
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

    // 5. Timeline Entry
    if (outcome.timelineEntry) {
      if (!this.world.globalHistoryTimeline) this.world.globalHistoryTimeline = [];
      const timelineText = typeof outcome.timelineEntry === 'string' ? outcome.timelineEntry : outcome.timelineEntry.text;
      const timelineCat = typeof outcome.timelineEntry === 'object' && outcome.timelineEntry.category ? outcome.timelineEntry.category : (this.currentEvent.category || 'event');
      this.world.globalHistoryTimeline.unshift({
        year: this.world.currentYear,
        month: this.world.currentMonth,
        text: timelineText,
        category: timelineCat
      });
    }

    // 6. Tour Impact
    if (outcome.tourImpact) {
      if (outcome.tourImpact.cancelActiveTour || outcome.tourImpact.cancelCurrentTour) {
        this.world.tours = this.world.tours.filter(t => t.artistId !== player.id);
      }
      if (outcome.tourImpact.revenueMultiplier) {
        const playerTours = this.world.tours.filter(t => t.artistId === player.id);
        for (const t of playerTours) {
          t.grossRevenue = Math.floor(t.grossRevenue * outcome.tourImpact.revenueMultiplier);
          t.netArtistProfit = Math.floor(t.netArtistProfit * outcome.tourImpact.revenueMultiplier);
        }
      }
      if (outcome.tourImpact.hypeBonus) {
        player.stats.hype = Math.min(100, player.stats.hype + outcome.tourImpact.hypeBonus);
      }
      if (outcome.tourImpact.bonusEnergyCost) {
        player.stats.energy = Math.max(0, player.stats.energy - outcome.tourImpact.bonusEnergyCost);
      }
    }

    // 7. Chart Impact
    if (outcome.chartImpact) {
      const boostPct = outcome.chartImpact.streamingBoostPct || (outcome.chartImpact.boostRecentSong ? 0.3 : 0);
      const penaltyPct = outcome.chartImpact.penaltyPct || (outcome.chartImpact.penaltyAllSongsMultiplier !== undefined ? (1 - outcome.chartImpact.penaltyAllSongsMultiplier) : 0);

      const playerSongs = Object.values(this.world.songs).filter(s => s.artistId === player.id);
      if (boostPct > 0) {
        const targetSong = outcome.chartImpact.targetSongId
          ? this.world.songs[outcome.chartImpact.targetSongId]
          : playerSongs[playerSongs.length - 1];
        if (targetSong) {
          const streamBoost = Math.floor((targetSong.streamsLastMonth || 50000) * boostPct);
          targetSong.streamsTotal += streamBoost;
          targetSong.streamsLastMonth += streamBoost;
        }
        player.stats.hype = Math.min(100, player.stats.hype + Math.floor(boostPct * 50));
      }
      if (penaltyPct > 0) {
        for (const s of playerSongs) {
          s.streamsLastMonth = Math.floor(s.streamsLastMonth * (1 - penaltyPct));
        }
      }
    }

    // 8. Career Impact
    if (outcome.careerImpact) {
      if (outcome.careerImpact.breakContract || outcome.careerImpact.leaveLabel) {
        player.labelId = null;
        player.activeContract = null;
      }
      if (outcome.careerImpact.fireManager) {
        player.managerId = null;
      }
      if (outcome.careerImpact.stageOverride) {
        player.careerStage = outcome.careerImpact.stageOverride;
      }
    }

    // 9. Narrative Chains Management
    const chainNextId = outcome.chainNextEventId || outcome.triggerChainEventId;
    const chainDelay = outcome.chainDelayMonths || outcome.triggerDelayMonths;
    if (chainNextId && chainDelay) {
      if (!this.world.activeNarrativeChains) this.world.activeNarrativeChains = {};
      const chainKey = this.currentEvent.narrativeChainId || chainNextId;
      const existingStep = this.world.activeNarrativeChains[chainKey]?.currentStep || 1;
      const triggerDate = TimeSystem.advanceMonths(this.world.currentYear, this.world.currentMonth, chainDelay);
      this.world.activeNarrativeChains[chainKey] = {
        currentStep: existingStep + 1,
        nextTriggerYearMonth: {
          year: triggerDate.year,
          month: triggerDate.month
        },
        nextEventId: chainNextId,
        chainId: chainKey,
        payload: outcome.chainPayload
      };
    }

    // If this event was the final step of a narrative chain or had no further link, clear it
    if (this.world.activeNarrativeChains) {
      for (const [chainId, chainData] of Object.entries(this.world.activeNarrativeChains)) {
        if (
          chainData.nextEventId === this.currentEvent.id ||
          chainId === this.currentEvent.narrativeChainId ||
          chainId === this.currentEvent.id
        ) {
          if (this.currentEvent.isChainFinalStep || (!outcome.chainNextEventId && !outcome.triggerChainEventId)) {
            delete this.world.activeNarrativeChains[chainId];
          }
        }
      }
    }

    // 10. News Generation with Event's Importance Level
    if (outcome.newsGenerated) {
      const importance = this.currentEvent.importanceLevel !== undefined ? this.currentEvent.importanceLevel : 3;
      this.world.news.unshift({
        id: `news_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        headline: outcome.newsGenerated.headline,
        body: outcome.newsGenerated.body,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: outcome.newsGenerated.category,
        relatedArtistIds: [player.id],
        sentiment: outcome.newsGenerated.sentiment,
        importance
      });
    }

    // 11. Social Feed Reactions
    if (!this.world.socialFeed) this.world.socialFeed = [];
    if (outcome.socialPostsGenerated && outcome.socialPostsGenerated.length > 0) {
      this.world.socialFeed.unshift(...outcome.socialPostsGenerated);
    } else {
      const eventPosts = SocialFeedEngine.generateEventPosts(this.world, player, this.currentEvent, outcome);
      this.world.socialFeed.unshift(...eventPosts);
    }

    // Sincronizar reactivamente métricas de audiencia si el evento alteró fans, popularidad, hype o si fue un fenómeno viral
    const isViral = !outcome.chartImpact && Boolean(
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

  public advanceCycle(monthsCount: 1 | 3 | 6 | 12 = 1, isVacation: boolean = false) {
    const collectedEvents: EventDefinition[] = [];
    const cycleStartYear = this.world.currentYear;
    const cycleStartMonth = this.world.currentMonth;
    let organicEventsCount = 0;
    const maxOrganicEvents = monthsCount >= 12 ? 2 : 1;

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
          this.world.artists,
          playerSongs
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

      if (playerSongs.length === 0) {
        player.stats.totalStreams = 0;
        player.stats.monthlyListeners = 0;
      } else {
        player.stats.totalStreams += playerTotalMonthlyStreams;
        player.stats.monthlyListeners = StreamingEngine.calculateMonthlyListeners(
          playerTotalMonthlyStreams,
          player.stats.popularity,
          player.stats.fansCount,
          player.stats.fanbaseLoyalty,
          player.stats.hype,
          true
        );
      }

      // 3.1 Convergencia armónica de popularidad y conversión mensual de fans para el jugador
      const hitsCount = playerSongs.filter(s => (s.peakPosition?.Global ?? 99) <= 10).length;
      const targetPop = StreamingEngine.calculateTargetPopularity(
        player.stats.monthlyListeners,
        player.stats.totalStreams,
        hitsCount
      );
      if (player.stats.popularity < targetPop) {
        const step = Math.min(8, Math.max(2, Math.floor((targetPop - player.stats.popularity) * 0.50)));
        player.stats.popularity = Math.min(targetPop, player.stats.popularity + step);
      } else if (player.stats.popularity > targetPop && playerTotalMonthlyStreams < 200000) {
        player.stats.popularity = Math.max(targetPop, player.stats.popularity - 1);
      }

      // 3.2 Conversión orgánica de oyentes a fans leales
      const hasRecentRelease = playerSongs.some(s => s.releaseYear === this.world.currentYear && Math.abs(this.world.currentMonth - s.releaseMonth) <= 1);
      const newFans = StreamingEngine.calculateMonthlyFanConversion(
        player.stats.monthlyListeners,
        player.stats.fansCount,
        player.stats.hype,
        player.stats.fanbaseLoyalty,
        hasRecentRelease
      );
      player.stats.fansCount += newFans;

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

      // 5.1 Actualización Dinámica de Playlists Editoriales & Algorítmicas
      if (!this.world.playlists) {
        this.world.playlists = EDITORIAL_PLAYLISTS.reduce((acc, p) => ({ ...acc, [p.id]: { ...p } }), {});
      }
      StreamingEngine.updatePlaylists(this.world, this.world.songs, this.world.artists);

      // 5.2 Generación Estacional de Invitaciones a Festivales Globales
      if (!this.world.festivalInvitations) this.world.festivalInvitations = [];
      const seasonalOffers = FestivalEngine.generateSeasonalInvitations(
        player,
        this.world.currentYear,
        this.world.currentMonth,
        this.world
      );
      for (const offer of seasonalOffers) {
        const alreadyExists = this.world.festivalInvitations.some(
          existing => existing.id === offer.id || (existing.festivalId === offer.festivalId && existing.year === offer.year)
        );
        if (!alreadyExists) {
          this.world.festivalInvitations.push(offer);
          this.world.news.unshift({
            id: `news_fest_${offer.id}_${Date.now()}`,
            headline: `Invitación a festival mundial: ${offer.festivalName}`,
            body: `La organización de ${offer.festivalName} ha invitado formalmente a ${player.name} para presentarse como ${offer.slotTitle} con un caché garantizado de $${offer.payout.toLocaleString('es-AR')}.`,
            year: this.world.currentYear,
            month: this.world.currentMonth,
            category: 'tour',
            relatedArtistIds: [player.id],
            sentiment: 'positive',
            importance: 4
          });
        }
      }

      // 5.3 Certificaciones Oficiales de la Industria (Discos de Oro, Platino y Diamante)
      const certRes = CertificationEngine.evaluateCertifications(this.world);
      for (const item of certRes.newsItems) {
        this.world.news.unshift({
          id: `news_cert_${Date.now()}_${Math.random()}`,
          headline: item.headline,
          body: item.body,
          year: this.world.currentYear,
          month: this.world.currentMonth,
          category: 'award',
          relatedArtistIds: [item.relatedArtistId],
          sentiment: 'positive',
          importance: 5
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

        // Generar Spotify Wrapped Anual del jugador
        this.generateYearEndWrapped(droughtYear);
      }

      // 7. Update player career stage & legacy
      const yearsActive = TimeSystem.calculateCareerLengthYears(player.careerStartYear, this.world.currentYear);
      const no1sCount = playerSongs.filter(s => (s.peakPosition?.Global ?? 99) === 1 || (s.peakPosition?.Argentina ?? 99) === 1).length;
      player.careerStage = LegacyEngine.evaluateCareerStage(player, yearsActive, hitsCount);
      player.legacyScore = LegacyEngine.calculateLegacyScore(player, hitsCount, no1sCount, this.world.currentYear);
      LegacyEngine.checkAndCreateEra(player, this.world.currentYear, this.world.currentMonth);

      // 8. Ambient social feed generation
      if (!this.world.socialFeed) this.world.socialFeed = [];
      if (Math.random() < 0.65) {
        const ambientPosts = SocialFeedEngine.generateMonthlyAmbientPosts(this.world, player);
        this.world.socialFeed.unshift(...ambientPosts);
        if (this.world.socialFeed.length > 100) {
          this.world.socialFeed = this.world.socialFeed.slice(0, 100);
        }
      }

      // 9. NARRATIVE CHAINS EVALUATION & ORGANIC EVENT PROBABILITY
      const eventContext: EventContext = {
        player,
        world: this.world,
        currentYear: this.world.currentYear,
        currentMonth: this.world.currentMonth
      };

      // A) Check for active narrative chain due this month
      let chainTriggeredThisMonth = false;
      if (this.world.activeNarrativeChains) {
        for (const [chainId, chainData] of Object.entries(this.world.activeNarrativeChains)) {
          if (
            chainData.nextTriggerYearMonth &&
            chainData.nextTriggerYearMonth.year === this.world.currentYear &&
            chainData.nextTriggerYearMonth.month === this.world.currentMonth
          ) {
            const chainEvt = EventEngine.findNarrativeChainEvent(eventContext, chainId, chainData);
            if (chainEvt) {
              collectedEvents.unshift(chainEvt);
              this.world.recentEventIdsHistory.push({
                eventId: chainEvt.id,
                year: this.world.currentYear,
                month: this.world.currentMonth
              });
              chainTriggeredThisMonth = true;
              break; // Max 1 chain event triggered per month
            }
          }
        }
      }

      // B) Organic event probability (~15% per month, capped at 1 per 6M semester, 2 per 12M)
      if (!chainTriggeredThisMonth && organicEventsCount < maxOrganicEvents && Math.random() < 0.15) {
        const nextEvt = EventEngine.selectNextEvent(
          eventContext,
          this.world.recentEventIdsHistory
        );
        if (nextEvt) {
          collectedEvents.push(nextEvt);
          organicEventsCount++;
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

    // 9. Dynamic Organic Development System (Desarrollo Orgánico por Práctica y Experiencia)
    const player = this.getPlayer();
    const cycleStartAbsoluteMonth = cycleStartYear * 12 + cycleStartMonth;
    const cycleEndAbsoluteMonth = this.world.currentYear * 12 + this.world.currentMonth;

    const allPlayerSongs = Object.values(this.world.songs).filter(s => s.artistId === player.id);
    const semesterSongs = allPlayerSongs.filter(s => {
      const songAbsMonth = s.releaseYear * 12 + s.releaseMonth;
      return songAbsMonth >= cycleStartAbsoluteMonth && songAbsMonth < cycleEndAbsoluteMonth;
    });

    const allPlayerTours = this.world.tours.filter(t => t.artistId === player.id);
    const semesterTours = allPlayerTours.filter(t => {
      const tourAbsMonth = t.year * 12 + t.month;
      return tourAbsMonth >= cycleStartAbsoluteMonth && tourAbsMonth < cycleEndAbsoluteMonth;
    });

    const semesterCollabs = semesterSongs.filter(s => s.featuredArtistIds && s.featuredArtistIds.length > 0);

    const semesterSuccessfulReleases = semesterSongs.filter(s => {
      const hitGlobal = s.peakPosition?.Global ? s.peakPosition.Global <= 20 : false;
      const hitArg = s.peakPosition?.Argentina ? s.peakPosition.Argentina <= 20 : false;
      return hitGlobal || hitArg || s.wentViral || (s.streamsTotal || 0) >= 15000 || (s.receptionRating || 0) >= 3;
    });

    const activityData: SemesterActivityData = {
      songsRecorded: semesterSongs.length,
      toursConducted: semesterTours.length,
      successfulReleases: semesterSuccessfulReleases.length,
      collabsConducted: semesterCollabs.length
    };

    const organicProgress = DecisionEngine.evaluateOrganicProgression(player, activityData, this.world);
    if (organicProgress.newsGenerated) {
      this.world.news.unshift(organicProgress.newsGenerated);
    }
    if (organicProgress.summaryNotes.length > 0) {
      this.world.globalHistoryTimeline.unshift({
        year: this.world.currentYear,
        month: this.world.currentMonth,
        text: `Desarrollo artístico de ${player.name}: ${organicProgress.summaryNotes.join(', ')}.`,
        category: 'career'
      });
    }



    // Verificar y priorizar cadenas narrativas cuya resolución vence en la fecha alcanzada en el ciclo
    if (this.world.activeNarrativeChains) {
      const endContext: EventContext = {
        player: this.getPlayer(),
        world: this.world,
        currentYear: this.world.currentYear,
        currentMonth: this.world.currentMonth
      };
      for (const [chainId, chainData] of Object.entries(this.world.activeNarrativeChains)) {
        if (
          chainData.nextTriggerYearMonth &&
          (this.world.currentYear > chainData.nextTriggerYearMonth.year ||
           (this.world.currentYear === chainData.nextTriggerYearMonth.year && this.world.currentMonth >= chainData.nextTriggerYearMonth.month))
        ) {
          const chainEvt = EventEngine.findNarrativeChainEvent(endContext, chainId, chainData);
          if (chainEvt && !collectedEvents.some(e => e.id === chainEvt.id)) {
            collectedEvents.unshift(chainEvt);
            this.world.recentEventIdsHistory.push({
              eventId: chainEvt.id,
              year: this.world.currentYear,
              month: this.world.currentMonth
            });
            break;
          }
        }
      }
    }

    // 10. Limpieza de ofertas de colaboración expiradas
    if (!this.world.pendingCollabOffers) this.world.pendingCollabOffers = [];
    this.world.pendingCollabOffers = this.world.pendingCollabOffers.filter(offer => {
      const isExpired = offer.expiresYear < this.world.currentYear ||
        (offer.expiresYear === this.world.currentYear && offer.expiresMonth < this.world.currentMonth);
      return !isExpired && offer.status === 'pending';
    });

    // 11. Generación procedural de ofertas de colaboración entrantes (Cantantes y Productores)
    // ~35% de probabilidad por ciclo de recibir una oferta si hay menos de 2 pendientes
    if (this.world.pendingCollabOffers.length < 2 && Math.random() < 0.35 + (player.stats.hype > 60 ? 0.15 : 0)) {
      const offer = this.generateRandomCollabOffer();
      if (offer) {
        this.world.pendingCollabOffers.push(offer);
        this.world.news.unshift({
          id: `news_offer_${Date.now()}`,
          headline: `Propuesta de Colaboración: ${offer.senderName} busca grabar con ${player.name}`,
          body: offer.pitchMessage,
          year: this.world.currentYear,
          month: this.world.currentMonth,
          category: 'industry',
          relatedArtistIds: offer.senderArtistId ? [player.id, offer.senderArtistId] : [player.id],
          sentiment: 'positive',
          importance: 2
        });
      }
    }

    // Push collected events to the queue
    this.eventQueue.push(...collectedEvents);

    // If no active event dialog is currently showing, pop the first one
    if (!this.currentEvent && this.eventQueue.length > 0) {
      this.currentEvent = this.eventQueue.shift()!;
    }

    // world.news is unshift()-ed from ~25 call sites across GameEngine/IndustryEngine/RelationshipEngine
    // and was never capped: unshift on an array is O(n), so an uncapped feed makes every single future
    // news item cost more than the last one as a career goes on -- across a decade-spanning save this
    // degrades into an increasingly laggy game (confirmed: 5 years advanced in ~22s early, the next 5
    // years took 3x+ longer). Trimming once per cycle keeps it bounded to "recent history" without
    // losing anything the UI actually shows (the news feed only ever displays the latest handful).
    if (this.world.news.length > GameEngine.MAX_NEWS_ITEMS) {
      this.world.news.length = GameEngine.MAX_NEWS_ITEMS;
    }
    // socialFeed is capped at 100 only at one of its several unshift() sites; enforce it here too
    // so every append path stays bounded regardless of which one fired most recently.
    if (this.world.socialFeed.length > 100) {
      this.world.socialFeed.length = 100;
    }

    // Efectos de vacaciones si se activaron en el ciclo
    if (isVacation) {
      player.stats.energy = Math.min(100, player.stats.energy + 25);
      player.stats.hype = Math.max(10, player.stats.hype - 5);
      this.world.news.unshift({
        id: `news_vacation_${Date.now()}`,
        headline: `${player.name} se toma unas vacaciones para desconectar del ritmo frenético`,
        body: `El artista decidió poner una pausa temporal en su agenda para recuperar energía física y mental lejos de los reflectores.`,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: 'personal',
        relatedArtistIds: [player.id],
        sentiment: 'neutral',
        importance: 2
      });
    }

    // Generación e integración de mensajes interactivos del teléfono móvil (WhatsApp / DMs)
    if (!this.world.phoneMessages) this.world.phoneMessages = [];
    const incomingMessages = PhoneMessageEngine.generateSeasonalMessages(player, this.world, monthsCount);
    if (incomingMessages.length > 0) {
      this.world.phoneMessages.unshift(...incomingMessages);
      if (this.world.phoneMessages.length > 40) {
        this.world.phoneMessages.length = 40;
      }
    }
    this.updateUnreadPhoneCount();

    this.notify();
  }

  // ==========================================
  // PILAR SMARTPHONE & DMs INTERACTIVOS
  // ==========================================

  public replyToPhoneMessage(messageId: string, choiceIndex: number): void {
    if (!this.world.phoneMessages) return;
    const msg = this.world.phoneMessages.find(m => m.id === messageId);
    if (!msg) return;

    // Si ya fue respondido, ignorar
    if (msg.chosenReplyIndex !== undefined) return;

    const choice = msg.choices?.[choiceIndex];
    if (!choice) return;

    msg.isRead = true;
    msg.chosenReplyIndex = choiceIndex;

    const player = this.getPlayer();
    const effects = choice.effects;

    if (effects.fundsDelta) {
      player.stats.funds = Math.max(0, player.stats.funds + effects.fundsDelta);
      this.recordFinancialTransaction({
        type: effects.fundsDelta > 0 ? 'income' : 'expense',
        category: effects.fundsDelta > 0 ? 'sponsorship' : 'production',
        amount: Math.abs(effects.fundsDelta),
        description: `Smartphone: ${choice.label}`
      });
    }

    if (effects.hypeDelta) {
      player.stats.hype = Math.max(0, Math.min(100, player.stats.hype + effects.hypeDelta));
    }

    if (effects.fansDelta) {
      player.stats.fansCount = Math.max(0, player.stats.fansCount + effects.fansDelta);
    }

    if (effects.energyDelta) {
      player.stats.energy = Math.max(0, Math.min(100, player.stats.energy + effects.energyDelta));
    }

    if (effects.relationshipDelta) {
      const targetArtist = this.world.artists[effects.relationshipDelta.artistId];
      if (targetArtist) {
        RelationshipEngine.modifyRelationship(
          player,
          targetArtist,
          effects.relationshipDelta.delta,
          Math.floor(effects.relationshipDelta.delta * 0.5),
          undefined,
          `Interacción Smartphone: ${choice.label} (${effects.relationshipDelta.delta > 0 ? '+' : ''}${effects.relationshipDelta.delta} Afinidad)`
        );
      }
    }

    if (effects.newsHeadline) {
      if (!this.world.news) this.world.news = [];
      this.world.news.unshift({
        id: `news_phone_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        headline: effects.newsHeadline,
        body: `${player.name} tomó una decisión en su carrera: "${choice.replyText}"`,
        year: this.world.currentYear,
        month: this.world.currentMonth,
        category: msg.category === 'manager' ? 'industry' : msg.category === 'drama' ? 'rivalry' : 'culture',
        relatedArtistIds: effects.relationshipDelta ? [player.id, effects.relationshipDelta.artistId] : [player.id],
        sentiment: (effects.hypeDelta || 0) >= 0 ? 'positive' : 'negative',
        importance: 3
      });
    }

    this.updateUnreadPhoneCount();
    this.notify();
  }

  public markAllPhoneMessagesRead(): void {
    if (this.world.phoneMessages) {
      for (const msg of this.world.phoneMessages) {
        msg.isRead = true;
      }
    }
    this.world.unreadPhoneCount = 0;
    this.notify();
  }

  private updateUnreadPhoneCount(): void {
    if (!this.world.phoneMessages) {
      this.world.unreadPhoneCount = 0;
      return;
    }
    this.world.unreadPhoneCount = this.world.phoneMessages.filter(m => !m.isRead).length;
  }

  // ==========================================
  // PILAR SPOTIFY WRAPPED ANUAL
  // ==========================================

  public generateYearEndWrapped(year: number): YearEndWrappedData {
    const player = this.getPlayer();
    const playerSongs = Object.values(this.world.songs).filter(s => s.artistId === player.id);

    // Streams acumulados ese año y canción más escuchada
    let topSongTitle = playerSongs.length > 0 ? playerSongs[0].title : 'Sin lanzamientos';
    let topSongStreams = 0;
    let totalStreamsYear = 0;

    for (const song of playerSongs) {
      const streamsThisYear = song.monthlyStreamsHistory && song.monthlyStreamsHistory.length > 0
        ? song.monthlyStreamsHistory.slice(-12).reduce((a, b) => a + b, 0)
        : song.streamsTotal;

      totalStreamsYear += streamsThisYear;
      if (streamsThisYear > topSongStreams || (topSongStreams === 0 && song.streamsTotal > 0)) {
        topSongStreams = streamsThisYear > 0 ? streamsThisYear : song.streamsTotal;
        topSongTitle = song.title;
      }
    }

    if (totalStreamsYear === 0 && player.stats.totalStreams > 0) {
      totalStreamsYear = Math.floor(player.stats.totalStreams * 0.4);
    }

    // Mejor posición en charts globales
    let peakGlobal: number | undefined = undefined;
    for (const song of playerSongs) {
      const pos = song.peakPosition?.Global;
      if (pos && (peakGlobal === undefined || pos < peakGlobal)) {
        peakGlobal = pos;
      }
    }

    // Premios ganados ese año
    const awardsWonYear: string[] = [];
    const ceremony = this.world.awardsHistory?.find(c => c.year === year);
    if (ceremony) {
      for (const cat of ceremony.categories) {
        if (cat.winner && cat.winner.id === player.id) {
          awardsWonYear.push(cat.title);
        }
      }
    }

    // País principal y bandera
    const countryFlagMap: Record<string, string> = {
      'Argentina': '🇦🇷',
      'México': '🇲🇽',
      'Mexico': '🇲🇽',
      'España': '🇪🇸',
      'Spain': '🇪🇸',
      'USA': '🇺🇸',
      'Estados Unidos': '🇺🇸',
      'Colombia': '🇨🇴',
      'Chile': '🇨🇱',
      'Puerto Rico': '🇵🇷',
      'Brasil': '🇧🇷',
      'Brazil': '🇧🇷',
      'UK': '🇬🇧',
      'Reino Unido': '🇬🇧',
      'Uruguay': '🇺🇾',
      'Perú': '🇵🇪',
      'Peru': '🇵🇪',
      'Francia': '🇫🇷',
      'Alemania': '🇩🇪',
      'Italia': '🇮🇹',
      'Japón': '🇯🇵',
      'Corea del Sur': '🇰🇷'
    };

    const topCountry = player.country || 'Argentina';
    const topCountryFlag = countryFlagMap[topCountry] || '🌐';

    // Género dominante
    const genreCounts: Record<string, number> = {};
    for (const song of playerSongs) {
      genreCounts[song.genreId] = (genreCounts[song.genreId] || 0) + 1;
    }
    let dominantGenreId = player.mainGenreId || 'trap_latino';
    let maxCount = 0;
    for (const [gid, cnt] of Object.entries(genreCounts)) {
      if (cnt > maxCount) {
        maxCount = cnt;
        dominantGenreId = gid;
      }
    }
    const dominantGenreName = this.world.genres[dominantGenreId]?.name || dominantGenreId;

    // Fondos generados ese año
    let fundsEarnedYear = 0;
    if (this.world.financialLedger) {
      fundsEarnedYear = this.world.financialLedger
        .filter(t => t.type === 'income' && t.date?.startsWith(`${year}`))
        .reduce((acc, t) => acc + t.amount, 0);
    }
    if (fundsEarnedYear === 0) {
      fundsEarnedYear = Math.max(5000, Math.floor(totalStreamsYear * 0.0035 + player.stats.popularity * 1200));
    }

    // Fans ganados
    const fansGainedYear = Math.max(500, Math.floor(player.stats.fansCount * 0.25 + totalStreamsYear * 0.0008));

    // Veredicto de la industria
    let industryVerdict = 'Un año de constancia y exploración que sentó cimientos firmes para el futuro.';
    if (awardsWonYear.length > 0 || (peakGlobal && peakGlobal <= 3)) {
      industryVerdict = '¡Dominio histórico! Te consolidaste como una de las figuras más influyentes y galardonadas del planeta.';
    } else if (totalStreamsYear > 20000000 || (peakGlobal && peakGlobal <= 10)) {
      industryVerdict = 'Consagración definitiva en el mainstream. Tus canciones sonaron en cada rincón del mundo.';
    } else if (totalStreamsYear > 2000000 || player.stats.popularity >= 50) {
      industryVerdict = 'Crecimiento meteórico. Rompiste fronteras y multiplicaste tu impacto cultural.';
    } else if (playerSongs.length > 0) {
      industryVerdict = 'Sonido propio y autenticidad. La escena subterránea y los críticos respetan tu visión.';
    }

    const quoteShareable = awardsWonYear.length > 0
      ? `🏆 ${year}: El año dorado de ${player.name}. Gracias a los millones que hicieron esto posible.`
      : `🎵 ${year}: ${totalStreamsYear.toLocaleString('es-AR')} reproducciones. Esto recién comienza.`;

    const wrappedData: YearEndWrappedData = {
      year,
      artistName: player.name,
      totalStreamsYear,
      topSongTitle,
      topSongStreams,
      topCountry,
      topCountryFlag,
      peakGlobalChartPosition: peakGlobal,
      awardsWonYear,
      fansGainedYear,
      fundsEarnedYear,
      dominantGenre: dominantGenreName,
      industryVerdict,
      quoteShareable
    };

    this.world.activeYearEndWrapped = wrappedData;
    return wrappedData;
  }

  public dismissYearEndWrapped(): void {
    if (this.world.activeYearEndWrapped) {
      if (!this.world.playerWrappedHistory) {
        this.world.playerWrappedHistory = [];
      }
      const alreadySaved = this.world.playerWrappedHistory.some(
        w => w.year === this.world.activeYearEndWrapped!.year
      );
      if (!alreadySaved) {
        this.world.playerWrappedHistory.push({ ...this.world.activeYearEndWrapped });
      }
      this.world.activeYearEndWrapped = null;
    }
    this.notify();
  }

  // --- SAVE / LOAD ---
  public executeLiveShow(params: {
    festivalId: string;
    slot: FestivalSlot;
    setlistSongIds: string[];
    production: StageProductionConfig;
    dilemmaId?: string;
    dilemmaChoiceId?: string;
    invitationId?: string;
  }): LiveShowResult {
    const player = this.getPlayer();
    if (!player) throw new Error('Artista no encontrado.');

    if (player.stats.energy < 20) {
      throw new Error('Energía insuficiente para actuar en el festival (requiere al menos 20% de energía).');
    }

    const festival = GLOBAL_FESTIVALS.find(f => f.id === params.festivalId);
    if (!festival) {
      throw new Error(`El festival con ID "${params.festivalId}" no existe en el circuito mundial.`);
    }

    const productionCost = FestivalEngine.calculateProductionCost(params.production);
    if (productionCost > player.stats.funds) {
      throw new Error(`Fondos insuficientes para costear la producción escénica ($${productionCost.toLocaleString('es-AR')} requeridos, tienes $${player.stats.funds.toLocaleString('es-AR')}).`);
    }

    // Resolver el show a través de FestivalEngine
    const result = FestivalEngine.resolveLiveShow({
      artist: player,
      festival,
      slot: params.slot,
      setlistSongIds: params.setlistSongIds,
      production: params.production,
      dilemmaChoice: params.dilemmaChoiceId ? { dilemmaId: params.dilemmaId, choiceId: params.dilemmaChoiceId } : undefined,
      world: this.world
    });

    // Descontar costo de producción y acreditar ganancia bruta
    if (productionCost > 0) {
      player.stats.funds = Math.max(0, player.stats.funds - productionCost);
      this.recordFinancialTransaction({
        type: 'expense',
        category: 'tour',
        amount: productionCost,
        description: `Producción de escenario para ${festival.name} (${params.slot})`
      });
    }

    if (result.payoutGross > 0) {
      player.stats.funds += result.payoutGross;
      this.recordFinancialTransaction({
        type: 'income',
        category: 'tour',
        amount: result.payoutGross,
        description: `Caché por actuación en vivo en ${festival.name} (${params.slot})`
      });
    }

    // Consumo de energía
    const rawEnergyUsed = result.energyUsed ?? result.energySpent ?? 20;
    const safeEnergyUsed = Number.isFinite(rawEnergyUsed) ? rawEnergyUsed : 20;
    player.stats.energy = Math.max(5, Math.min(100, (player.stats.energy || 100) - safeEnergyUsed));

    // Fans, Hype y Popularidad
    const safeFansGained = Number.isFinite(result.fansGained) ? result.fansGained : 150;
    const safeHypeGained = Number.isFinite(result.hypeGained) ? result.hypeGained : 5;
    const safePopGained = Number.isFinite(result.popularityGained) ? result.popularityGained : 2;

    player.stats.fansCount = Math.max(0, (player.stats.fansCount || 0) + safeFansGained);
    player.stats.hype = Math.min(100, Math.max(0, (player.stats.hype || 0) + safeHypeGained));
    player.stats.popularity = Math.min(100, Math.max(0, (player.stats.popularity || 0) + safePopGained));

    // Registrar en histórico del artista y del mundo
    if (!Array.isArray(player.livePerformanceHistory)) player.livePerformanceHistory = [];
    player.livePerformanceHistory.unshift(result);

    if (!Array.isArray(this.world.festivalHistory)) this.world.festivalHistory = [];
    this.world.festivalHistory.unshift(result);

    // Actualizar estado de invitación
    if (Array.isArray(this.world.festivalInvitations)) {
      const inv = this.world.festivalInvitations.find(i => i.id === params.invitationId || (i.festivalId === params.festivalId && i.year === this.world.currentYear));
      if (inv) {
        inv.status = 'accepted';
      }
    }

    // Generar noticia periodística con la reseña principal
    const reviewsList = result.reviews || result.pressReviews || [];
    const mainReview = reviewsList[0];
    const headline = result.headline || result.newsHeadline || `${player.name} en ${festival.name}`;
    const quote = mainReview?.quote || mainReview?.snippet || 'Una presentación inolvidable.';
    const rating = mainReview?.rating || 5;
    const attendanceStr = (result.attendance || 0).toLocaleString('es-AR');
    const bodyText = mainReview
      ? `"${quote}" — ${mainReview.outlet} (${rating}/5 estrellas). ${attendanceStr} personas presenciaron el show.`
      : (result.subheadline || result.newsBody || 'Concierto masivo ante miles de fanáticos.');

    this.world.news.unshift({
      id: `news_liveshow_${Date.now()}`,
      headline,
      body: bodyText,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'tour',
      relatedArtistIds: [player.id],
      sentiment: (result.performanceScore || 70) >= 70 ? 'positive' : 'neutral',
      importance: 5
    });

    // Viral boost en streaming
    const isViralMoment = result.viralMomentOccurred ?? result.viralMoment?.occurred ?? false;
    const viralBoost = isViralMoment ? Math.floor((result.fansGained || 100) * 8) : Math.floor((result.fansGained || 100) * 2);
    this.syncAudienceMetrics(player, this.getPlayerSongs(), viralBoost);

    this.notify();
    return result;
  }

  public pitchSongToPlaylist(songId: string, playlistId: string): {
    success: boolean;
    message: string;
    added: boolean;
    position?: number;
  } {
    const player = this.getPlayer();
    const song = this.world.songs[songId];
    if (!song) throw new Error('Canción no encontrada.');
    if (!this.world.playlists || !this.world.playlists[playlistId]) {
      throw new Error('Playlist no encontrada.');
    }

    const playlist = this.world.playlists[playlistId];
    if (playlist.trackIds?.includes(songId)) {
      const pos = playlist.trackIds.indexOf(songId) + 1;
      return {
        success: true,
        message: `"${song.title}" ya forma parte de "${playlist.name}" en la posición #${pos}.`,
        added: true,
        position: pos
      };
    }

    // Evaluar compatibilidad con género y filtros
    if (playlist.genreFilters && playlist.genreFilters.length > 0) {
      const match = playlist.genreFilters.includes(song.genreId) || song.subGenreIds?.some(sg => playlist.genreFilters?.includes(sg));
      if (!match) {
        return {
          success: false,
          message: `Los curadores de "${playlist.name}" buscan temas de ${playlist.genreFilters.join(', ')}. El género de "${song.title}" no encaja con la curaduría actual.`,
          added: false
        };
      }
    }

    // Calidad y potencial
    const qualityThreshold = playlist.followers >= 20000000 ? 75 : playlist.followers >= 10000000 ? 65 : 50;
    if (song.quality < qualityThreshold) {
      return {
        success: false,
        message: `Los curadores editoriales escucharon "${song.title}" pero consideraron que requiere mayor pulido de producción para entrar a "${playlist.name}". (Calidad: ${song.quality}% / Mínima requerida: ${qualityThreshold}%).`,
        added: false
      };
    }

    // Agregar a la playlist
    if (!playlist.trackIds) playlist.trackIds = [];
    playlist.trackIds.unshift(song.id);
    if (playlist.trackIds.length > (playlist.maxTracks || 50)) {
      playlist.trackIds.pop();
    }

    const position = 1;
    player.stats.hype = Math.min(100, player.stats.hype + 8);
    const boost = Math.floor(playlist.followers * 0.015);
    song.streamsTotal += boost;
    song.streamsLastMonth += boost;

    this.world.news.unshift({
      id: `news_pl_pitch_${Date.now()}`,
      headline: `Ingreso Editorial: "${song.title}" debuta en "${playlist.name}"`,
      body: `El equipo editorial de ${playlist.curator} sumó a ${player.name} a su lista oficial de ${playlist.followers.toLocaleString('es-AR')} seguidores.`,
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'chart',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 4
    });

    this.syncAudienceMetrics(player);
    this.notify();

    return {
      success: true,
      message: `¡Gran noticia! Los curadores editoriales incluyeron "${song.title}" en "${playlist.name}".`,
      added: true,
      position
    };
  }

  public launchSnippetCampaign(params: {
    songId: string;
    concept: string;
    budget: number;
    influencerTier?: TikTokInfluencerTier;
  }): SnippetCampaignResult {
    const player = this.getPlayer();
    const song = this.world.songs[params.songId];
    if (!song) throw new Error('Canción no encontrada.');

    if (params.budget > player.stats.funds) {
      throw new Error(`Fondos insuficientes para la campaña en redes ($${params.budget.toLocaleString('es-AR')} requeridos, tienes $${player.stats.funds.toLocaleString('es-AR')}).`);
    }

    player.stats.funds = Math.max(0, player.stats.funds - params.budget);
    this.recordFinancialTransaction({
      type: 'expense',
      category: 'marketing',
      amount: params.budget,
      description: `Campaña viral de snippets en TikTok/Reels para "${song.title}" (${params.concept})`
    });

    const result = StreamingEngine.simulateSnippetCampaign({
      song,
      artist: player,
      concept: params.concept,
      budget: params.budget,
      influencerTier: params.influencerTier,
      world: this.world
    });

    // Aplicar efectos de la campaña de forma segura
    const streamsBoost = result.streamsBoostGenerated ?? result.streamingConversions ?? 0;
    song.streamsTotal = (song.streamsTotal || 0) + streamsBoost;
    song.streamsLastMonth = (song.streamsLastMonth || 0) + streamsBoost;
    if (result.isViralTrend || result.isViral) song.wentViral = true;

    const hypeGain = result.hypeGained ?? result.hypeGenerated ?? 0;
    player.stats.hype = Math.min(100, (player.stats.hype || 0) + hypeGain);

    const listenersGain = result.monthlyListenersGained ?? result.listenersGained ?? 0;
    player.stats.monthlyListeners = (player.stats.monthlyListeners || 0) + listenersGain;

    const fansGain = result.fansGained ?? Math.floor(listenersGain * 0.12);
    player.stats.fansCount = (player.stats.fansCount || 0) + fansGain;

    this.world.news.unshift({
      id: `news_snippet_${Date.now()}`,
      headline: result.headline || `Tendencia Viral: "${song.title}" estalla en TikTok`,
      body: result.communityReaction || result.summary || 'Campaña completada con éxito en redes.',
      year: this.world.currentYear,
      month: this.world.currentMonth,
      category: 'trend',
      relatedArtistIds: [player.id],
      sentiment: 'positive',
      importance: 3
    });

    this.syncAudienceMetrics(player);
    this.notify();
    return result;
  }

  public interactWithVideoComment(songId: string, commentId: string, action: 'pin' | 'like') {
    const player = this.getPlayer();
    const song = this.world.songs[songId];
    if (!song) throw new Error('Canción no encontrada.');

    player.stats.fanbaseLoyalty = Math.min(100, player.stats.fanbaseLoyalty + 1);
    player.stats.hype = Math.min(100, player.stats.hype + 1);
    this.notify();
    return {
      success: true,
      message: action === 'pin' ? 'Comentario fijado en la parte superior del videoclip.' : 'Le has dado corazón de artista al comentario.'
    };
  }

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
      if (!jsonString || typeof jsonString !== 'string') return false;
      const parsed: any = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;

      const rawWorld = parsed.world || (parsed.artists ? parsed : null);
      let rawPlayerId = parsed.playerId || (rawWorld && Object.values(rawWorld.artists || {}).find((a: any) => a.isPlayer)?.id);

      if (!rawWorld) {
        console.warn('Save state lacking world');
        return false;
      }

      this.world = rawWorld;

      // 1. World Schema Migration & Safe Defaults
      this.world.currentYear = Number(this.world.currentYear) || 2026;
      this.world.currentMonth = Math.min(12, Math.max(1, Number(this.world.currentMonth) || 1));
      this.world.artists = this.world.artists || {};
      this.world.songs = this.world.songs || {};
      this.world.albums = this.world.albums || {};
      this.world.charts = this.world.charts || {};
      this.world.trends = this.world.trends || {};
      this.world.genres = this.world.genres || INITIAL_GENRES;
      this.world.labels = this.world.labels || INITIAL_LABELS;
      this.world.producers = this.world.producers || INITIAL_PRODUCERS;
      this.world.managers = this.world.managers || INITIAL_MANAGERS;
      this.world.news = Array.isArray(this.world.news) ? this.world.news : [];
      this.world.awardsHistory = Array.isArray(this.world.awardsHistory) ? this.world.awardsHistory : [];
      this.world.tours = Array.isArray(this.world.tours) ? this.world.tours : [];
      this.world.socialFeed = Array.isArray(this.world.socialFeed) ? this.world.socialFeed : [];
      this.world.ecosystemContacts = Array.isArray(this.world.ecosystemContacts) && this.world.ecosystemContacts.length > 0
        ? this.world.ecosystemContacts
        : RelationshipEngine.getInitialEcosystemContacts();
      this.world.activeBeefs = this.world.activeBeefs || {};
      this.world.financialLedger = Array.isArray(this.world.financialLedger) ? this.world.financialLedger : [];
      this.world.pendingCollabOffers = Array.isArray(this.world.pendingCollabOffers) ? this.world.pendingCollabOffers : [];
      this.world.activeCollabPacts = Array.isArray(this.world.activeCollabPacts) ? this.world.activeCollabPacts : [];
      this.world.playlists = this.world.playlists || EDITORIAL_PLAYLISTS.reduce((acc, p) => ({ ...acc, [p.id]: { ...p } }), {});
      this.world.festivalInvitations = Array.isArray(this.world.festivalInvitations) ? this.world.festivalInvitations : [];
      this.world.festivalHistory = Array.isArray(this.world.festivalHistory) ? this.world.festivalHistory : [];
      this.world.recentEventIdsHistory = Array.isArray(this.world.recentEventIdsHistory) ? this.world.recentEventIdsHistory : [];
      this.world.activeNarrativeChains = this.world.activeNarrativeChains || {};
      this.world.officialCertifications = Array.isArray(this.world.officialCertifications) ? this.world.officialCertifications : [];

      // 2. Player Schema Migration & Safe Defaults
      let player = rawPlayerId ? this.world.artists[rawPlayerId] : undefined;
      if (!player) {
        player = Object.values(this.world.artists).find((a: any) => a.isPlayer) as Artist;
        if (player) {
          rawPlayerId = player.id;
        } else {
          return false;
        }
      }

      this.playerId = rawPlayerId;
      player.isPlayer = true;
      player.name = player.name || 'El Artista';
      player.mainGenreId = player.mainGenreId || 'trap_latino';
      player.subGenreIds = Array.isArray(player.subGenreIds) ? player.subGenreIds : [];
      player.country = player.country || 'Argentina';
      player.city = player.city || 'Buenos Aires';
      player.birthYear = Number(player.birthYear) || 2005;
      player.careerStartYear = Number(player.careerStartYear) || 2026;
      player.careerStage = player.careerStage || 'Underground';
      player.legacyScore = Number(player.legacyScore) || 0;
      player.isRetired = Boolean(player.isRetired);

      // Safe Stats Defaults
      player.stats = player.stats || {} as any;
      player.stats.funds = Number(player.stats.funds) >= 0 ? Number(player.stats.funds) : 1000;
      player.stats.energy = Math.min(100, Math.max(0, Number(player.stats.energy) || 100));
      player.stats.popularity = Math.min(100, Math.max(0, Number(player.stats.popularity) || 10));
      player.stats.reputation = Math.min(100, Math.max(0, Number(player.stats.reputation) || 10));
      player.stats.artisticCredibility = Math.min(100, Math.max(0, Number(player.stats.artisticCredibility) || 20));
      player.stats.monthlyListeners = Number(player.stats.monthlyListeners) || 0;
      player.stats.totalStreams = Number(player.stats.totalStreams) || 0;
      player.stats.fansCount = Number(player.stats.fansCount) || 50;
      player.stats.fanbaseLoyalty = Math.min(100, Math.max(0, Number(player.stats.fanbaseLoyalty) || 50));
      player.stats.hype = Math.min(100, Math.max(0, Number(player.stats.hype) || 20));

      // Safe Personality Defaults
      player.personality = player.personality || {} as any;
      player.personality.skill = Number(player.personality.skill) || 50;
      player.personality.creativity = Number(player.personality.creativity) || 50;
      player.personality.ambition = Number(player.personality.ambition) || 50;
      player.personality.discipline = Number(player.personality.discipline) || 50;
      player.personality.charisma = Number(player.personality.charisma) || 50;
      player.personality.commercialAppeal = Number(player.personality.commercialAppeal) || 50;
      player.personality.originality = Number(player.personality.originality) || 50;
      player.personality.riskTolerance = Number(player.personality.riskTolerance) || 50;
      player.personality.sociability = Number(player.personality.sociability) || 50;
      player.personality.independence = Number(player.personality.independence) || 50;

      // Safe Arrays
      player.eras = Array.isArray(player.eras) && player.eras.length > 0 ? player.eras : [{
        id: 'era_' + player.id + '_init',
        name: 'Comienzo de Carrera',
        startYear: player.careerStartYear,
        startMonth: 1,
        genreFocus: player.mainGenreId,
        stage: player.careerStage,
        highlightSummary: 'Primeros pasos en la escena musical.'
      }];
      player.relationships = player.relationships || {};
      player.awardsWon = Array.isArray(player.awardsWon) ? player.awardsWon : [];
      player.lifestyleUpgrades = Array.isArray(player.lifestyleUpgrades) ? player.lifestyleUpgrades : [];
      player.financialLedger = Array.isArray(player.financialLedger) ? player.financialLedger : [];
      player.officialCertifications = Array.isArray(player.officialCertifications) ? player.officialCertifications : [];
      player.phoneMessages = Array.isArray(player.phoneMessages) ? player.phoneMessages : [];
      player.unreadPhoneCount = Number(player.unreadPhoneCount) || 0;

      // 3. Songs & Albums safe hydration
      for (const song of Object.values(this.world.songs || {})) {
        if (!song || typeof song !== 'object') continue;
        song.peakPosition = song.peakPosition || createDefaultPeakPosition();
        song.weeksOnChart = song.weeksOnChart || createDefaultWeeksOnChart();
        song.monthlyStreamsHistory = Array.isArray(song.monthlyStreamsHistory) ? song.monthlyStreamsHistory : [];
        song.certifications = Array.isArray(song.certifications) ? song.certifications : [];
      }

      for (const album of Object.values(this.world.albums || {})) {
        if (!album || typeof album !== 'object') continue;
        album.songIds = Array.isArray(album.songIds) ? album.songIds : [];
        album.certifications = Array.isArray(album.certifications) ? album.certifications : [];
        album.peakChartPosition = album.peakChartPosition || createDefaultPeakPosition();
      }

      this.currentEvent = null;
      this.eventQueue = [];
      this.notify();
      return true;
    } catch (e) {
      console.error('Error importing save state:', e);
      return false;
    }
  }
}
