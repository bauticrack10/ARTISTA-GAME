export type CareerStage =
  | 'Underground'
  | 'Emerging'
  | 'Breakout'
  | 'Established'
  | 'Mainstream'
  | 'Superstar'
  | 'Declining'
  | 'Comeback'
  | 'Veteran'
  | 'Legend'
  | 'Retired';

export type MusicRegion = 'Global' | 'Argentina' | 'USA' | 'LatinAmerica' | 'Europe' | 'Spain' | 'Mexico';

export interface PersonalityTraits {
  creativity: number;      // 0 - 100 (Influences artistic depth, experimental success)
  ambition: number;        // 0 - 100 (Drives commercial pursuits, scale of tours)
  discipline: number;      // 0 - 100 (Reduces release delays, handles fatigue)
  charisma: number;        // 0 - 100 (Media impact, viral likelihood, fanbase loyalty)
  skill: number;           // 0 - 100 (Raw songwriting / vocal / production execution)
  commercialAppeal: number;// 0 - 100 (Hit potential, mainstream radio suitability)
  originality: number;     // 0 - 100 (Genre defining, critical acclaim)
  riskTolerance: number;   // 0 - 100 (Willingness to pivot genres or provoke controversies)
  sociability: number;     // 0 - 100 (Collaboration ease, industry connections)
  independence: number;    // 0 - 100 (Preference for indie vs major labels)
}

export interface ArtistStats {
  popularity: number;        // 0 - 100
  reputation: number;        // 0 - 100 (Critical respect and scene esteem)
  artisticCredibility: number;// 0 - 100
  energy: number;            // 0 - 100 (Exhaustion vs peak condition)
  monthlyListeners: number;
  totalStreams: number;
  funds: number;
  fansCount: number;
  fanbaseLoyalty: number;    // 0 - 100
  hype: number;              // 0 - 100 (Decays monthly unless stimulated)
}

export interface ArtistRelationship {
  targetArtistId: string;
  relationType: 'friend' | 'rival' | 'mentor' | 'protege' | 'feud' | 'collaborator' | 'neutral';
  affinity: number;          // -100 to +100
  respect: number;           // 0 to 100
  pastCollabsCount: number;
  history: string[];
}

export interface CareerEra {
  id: string;
  name: string;
  startYear: number;
  startMonth: number;
  endYear?: number;
  endMonth?: number;
  genreFocus: string;
  stage: CareerStage;
  highlightSummary: string;
}

export interface Artist {
  id: string; // Unique GUID/ID (NEVER rely only on name)
  name: string;
  realName?: string;
  isPlayer: boolean;
  avatarUrl?: string;
  avatarColor?: string;
  country: string;
  city: string;
  birthYear: number;
  careerStartYear: number;
  mainGenreId: string;
  subGenreIds: string[];
  personality: PersonalityTraits;
  stats: ArtistStats;
  careerStage: CareerStage;
  labelId: string | null;
  managerId: string | null;
  activeContract?: LabelContract | null;
  relationships: Record<string, ArtistRelationship>; // key: targetArtistId
  eras: CareerEra[];
  awardsWon: string[];
  legacyScore: number;
  isRetired: boolean;
  retirementYear?: number;
  lastReleaseYear?: number;
  lastReleaseMonth?: number;
  historicalNotes: string[];
  generationIndex: number;
  influences: string[]; // artist IDs of inspirations
  lifestyleUpgrades?: string[]; // purchased lifestyle item IDs
  isProdigy?: boolean; // 1 in 100,000 rare prodigy trait
  prodigyMultiplier?: number; // 3x multiplier on stat/exp gains
}

export type LifestyleCategory = 'studio' | 'real_estate' | 'vehicles' | 'coaching';

export interface LifestyleItem {
  id: string;
  name: string;
  category: LifestyleCategory;
  price: number;
  monthlyUpkeep: number;
  description: string;
  iconName: string;
  buffDescription: string;
  effects: {
    qualityBonus?: number;
    passiveEnergyPerMonth?: number;
    hypeDecayReduction?: number; // percentage reduction in hype decay (e.g. 0.05)
    tourFatigueReduction?: number; // percentage reduction in tour energy cost (e.g. 0.20)
    skillBonus?: number;
    creativityBonus?: number;
    charismaBonus?: number;
    disciplineBonus?: number;
    reputationBonus?: number;
    commercialAppealBonus?: number;
  };
}

export type ReleaseType = 'single' | 'ep' | 'mixtape' | 'album' | 'deluxe' | 'collab_album';
export type LongevityCurve = 'explosive_drop' | 'slow_burn' | 'sleeper_viral' | 'instant_classic' | 'steady';

export interface Song {
  id: string;
  title: string;
  artistId: string;
  featuredArtistIds: string[];
  producerId?: string;
  genreId: string;
  subGenreIds: string[];
  releaseYear: number;
  releaseMonth: number;
  quality: number;           // 0 - 100 (musical quality)
  commercialAppeal: number;  // 0 - 100
  originality: number;       // 0 - 100
  hypeAtRelease: number;
  streamsTotal: number;
  streamsLastMonth: number;
  monthlyStreamsHistory: number[];
  peakPosition: Record<MusicRegion, number | null>; // Chart peak position (1 - 50 or null)
  weeksOnChart: Record<MusicRegion, number>;
  longevityCurve: LongevityCurve;
  isSingle: boolean;
  albumId?: string;
  receptionRating: number;   // 1 to 5 stars or 0-100
  isClassic: boolean;
  wentViral: boolean;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  collaboratorArtistId?: string;
  type: ReleaseType;
  songIds: string[];
  genreId: string;
  subGenreIds: string[];
  releaseYear: number;
  releaseMonth: number;
  totalStreams: number;
  firstWeekSales: number;
  criticalScore: number;     // 0 - 100 (Metacritic style review)
  commercialScore: number;
  peakChartPosition: Record<MusicRegion, number | null>;
  awards: string[];
  coverGradient: string;
  criticalReviewText?: string;
  productionBudget?: number;
  marketingBudget?: number;
  producerId?: string;
  singlesIncludedCount?: number;
}

export type GenreLifecycle = 'underground' | 'surging' | 'mainstream' | 'oversaturated' | 'reviving' | 'niche' | 'classic';

export interface SubgenreDetail {
  id: string;
  name: string;
  parentGenreId: string;
  description: string;
  aestheticTone: string;
  requiredTrait?: {
    trait: keyof PersonalityTraits | keyof ArtistStats;
    min: number;
    label: string;
  };
  qualityBonus?: number;
  commercialBonus?: number;
  originalityBonus?: number;
}

export interface DerivedSonicStyle {
  id: string;
  name: string;
  parentGenreId: string;
  parentGenreName: string;
  description: string;
  aestheticTone: string;
  isUnlocked: boolean;
  lockReason?: string;
  qualityBonus: number;
  commercialBonus: number;
  originalityBonus: number;
}

export interface Genre {
  id: string;
  name: string;
  parentGenreId?: string;
  originCountry: string;
  basePopularity: number;     // 0 - 100
  currentPopularity: number;  // 0 - 100
  growthRate: number;         // -5 to +5
  lifecycle: GenreLifecycle;
  characteristics: string[];
  createdYear: number;
  aestheticTone: string;
  subGenres: string[];
}

export interface MusicTrend {
  id: string;
  name: string;
  description: string;
  genreId: string;
  startYear: number;
  startMonth: number;
  durationMonths: number;
  impactMultiplier: number;  // boosts streams for matching songs
  stage: 'emerging' | 'peaking' | 'cooling' | 'exhausted';
  keyArtistIds: string[];
}

export interface LabelContract {
  labelId: string;
  signingBonus: number;
  royaltyPercentage: number; // e.g., 20 = 20% to artist, 80% to label
  albumsRequired: number;
  albumsDelivered: number;
  creativeControl: number;   // 0 (none) to 100 (full)
  marketingPower: number;    // 0 - 100
  marketingBudgetPerRelease?: number; // Presupuesto de marketing garantizado por lanzamiento
  breakoutClause?: number;   // Cláusula de rescisión / compra de contrato
  durationYears: number;
  signedYear: number;
}

export interface RecordLabel {
  id: string;
  name: string;
  type: 'major' | 'indie' | 'boutique' | 'artist_owned';
  country: string;
  prestige: number;          // 0 - 100
  budget: number;            // available funding
  marketingPower: number;    // 0 - 100
  creativeFreedomAllowed: number; // 0 - 100
  rosterArtistIds: string[];
  favoredGenreIds: string[];
  ownerArtistId?: string;
  scoutingCriteria?: string; // Descripción del perfil de artista buscado
}

export type ManagerTier = 'underground' | 'regional' | 'national' | 'elite_global';

export interface ManagerRequirements {
  minMonthlyListeners: number;
  minReputation: number;
  minFunds?: number;
  hiringFee: number;
}

export interface Manager {
  id: string;
  name: string;
  tier: ManagerTier;
  reputation: number;        // 0 - 100
  negotiationSkill: number;  // 0 - 100 (Mejora ingresos de giras y adelantos)
  industryNetwork: number;   // 0 - 100 (Aumenta probabilidad de colaboraciones y eventos)
  commissionFeePct: number;  // 10 - 25% (Porcentaje sobre ingresos brutos de giras/música)
  monthlyMarketingBoost?: number; // 0 - 100 (Impulso constante al hype y alcance)
  specialties: string[];
  requirements: ManagerRequirements;
  bio?: string;
  avatarGradient?: string;
}

export interface Producer {
  id: string;
  name: string;
  tagline: string;
  signatureStyle: string;
  genreSpecialties: string[];
  reputation: number;
  costPerTrack: number;
  qualityBoost: number;
  country: string;
}

export type TourTier = 'club' | 'theater' | 'arena' | 'stadium' | 'festival_circuit' | 'world_tour';

export interface TourStop {
  city: string;
  country: string;
  capacity: number;
  ticketsSold: number;
  ticketPrice: number;
  revenue: number;
  successRating: number; // 0 - 100
}

export interface Tour {
  id: string;
  name: string;
  artistId: string;
  tier: TourTier;
  year: number;
  month: number;
  durationMonths: number;
  stops: TourStop[];
  totalCapacity: number;
  totalTicketsSold: number;
  grossRevenue: number;
  netArtistProfit: number;
  energyFatigue: number;
  hypeGenerated: number;
  fanbaseGained: number;
}

export interface ChartEntry {
  rank: number;
  songId: string;
  artistId: string;
  featuredArtistIds: string[];
  title: string;
  artistName: string;
  coverGradient?: string;
  streamsThisWeek: number;
  lastRank: number | null;   // null = new entry
  peakRank: number;
  weeksOnChart: number;
}

export interface RegionalChart {
  region: MusicRegion;
  year: number;
  month: number;
  entries: ChartEntry[];
}

export interface HistoricalRecord {
  id: string;
  title: string;
  holderArtistId: string;
  holderArtistName: string;
  songOrAlbumTitle?: string;
  recordValue: number | string;
  yearAchieved: number;
  description: string;
}

export interface AwardNominee {
  artistId: string;
  artistName: string;
  itemId?: string; // song or album id
  itemTitle?: string;
  producerId?: string;
  producerName?: string;
  score: number;
  highlightText?: string;
  isPlayer: boolean;
}

export interface AwardCategory {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
  nominees?: AwardNominee[];
  nomineeArtistIds: string[];
  nomineeItemIds?: string[]; // song or album ids
  winnerArtistId: string;
  winnerArtistName?: string;
  winnerItemId?: string;
  winnerItemTitle?: string;
  winnerProducerId?: string;
  winnerProducerName?: string;
  winnerReason?: string;
  playerWon?: boolean;
  playerNominated?: boolean;
}

export interface AwardCeremony {
  year: number;
  name: string;
  theme?: string;
  categories: AwardCategory[];
  playerNominationsCount?: number;
  playerWinsCount?: number;
}

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'tiktok';
  authorName: string;
  authorHandle: string;
  authorAvatarUrl?: string;
  authorAvatarGradient?: string;
  authorVerified?: boolean;
  authorType: 'fan' | 'hater' | 'critic' | 'artist' | 'media' | 'producer' | 'influencer';
  content: string;
  year: number;
  month: number;
  likes: number;
  retweetsOrShares: number;
  commentsCount: number;
  sentiment: 'positive' | 'negative' | 'polarizing' | 'meme' | 'hype';
  relatedSongId?: string;
  relatedAlbumId?: string;
  relatedArtistId?: string;
  badge?: string;
  createdAt?: string;
}

export type EcosystemNPCType = 'beatmaker_barrio' | 'manager_chanta' | 'critico_hater' | 'rival_escena';

export interface EcosystemNPC {
  id: string;
  name: string;
  nickname: string;
  type: EcosystemNPCType;
  roleTitle: string;
  avatarGradient: string;
  avatarUrl?: string;
  bio: string;
  affinity: number;       // -100 to +100
  respect: number;        // 0 to 100
  tensionLevel: number;   // 0 to 100 (for rival/hater/manager)
  loyalty: number;        // 0 to 100 (for beatmaker)
  isEncountered: boolean;
  history: string[];
}

export type BeefStage = 'tension' | 'social_beef' | 'diss_tracks' | 'all_out_war' | 'settled';

export interface BeefState {
  id: string;
  targetId: string;
  targetName: string;
  stage: BeefStage;
  hypeMultiplier: number;
  turnsActive: number;
  lastActionDescription: string;
  playerWon?: boolean;
}

export interface NewsItem {
  id: string;
  headline: string;
  body: string;
  year: number;
  month: number;
  category: 'release' | 'chart' | 'industry' | 'scandal' | 'award' | 'tour' | 'culture' | 'trend' | 'rivalry';
  relatedArtistIds: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'shocking';
  importance: number; // 1 (low) - 5 (breaking news)
}

export interface EventChoice {
  id: string;
  text: string;
  consequencesDescription: string;
  requiresStat?: { stat: keyof ArtistStats | keyof PersonalityTraits; min: number };
  costFunds?: number;
  costEnergy?: number;
  apply: (context: EventContext) => EventOutcome;
}

export interface EventOutcome {
  narrativeText: string;
  statChanges?: Partial<ArtistStats>;
  personalityChanges?: Partial<PersonalityTraits>;
  fundsChange?: number;
  hypeChange?: number;
  popularityChange?: number;
  fansChange?: number;
  reputationChange?: number;
  energyChange?: number;
  relationshipChanges?: Array<{
    targetArtistId: string;
    affinityDelta: number;
    relationType?: ArtistRelationship['relationType'];
    historyEntry: string;
  }>;
  ecosystemNPCChanges?: Array<{
    npcId: string;
    affinityDelta?: number;
    respectDelta?: number;
    loyaltyDelta?: number;
    tensionDelta?: number;
    historyEntry?: string;
  }>;
  newsGenerated?: {
    headline: string;
    body: string;
    sentiment: NewsItem['sentiment'];
    category: NewsItem['category'];
  };
  socialPostsGenerated?: SocialPost[];
  triggerChainEventId?: string; // starts or advances a narrative chain
  triggerDelayMonths?: number;
  newContract?: LabelContract;
  newManagerId?: string;
}

export interface EventDefinition {
  id: string;
  title: string;
  category: 'career' | 'music' | 'industry' | 'relationships' | 'media' | 'shows' | 'awards' | 'community' | 'personal';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  narrativeChainId?: string;
  minCareerStage?: CareerStage;
  maxCareerStage?: CareerStage;
  condition: (context: EventContext) => boolean;
  getDescription: (context: EventContext) => string;
  choices: (context: EventContext) => EventChoice[];
  cooldownMonths: number;
  weight: number; // selection likelihood
}

export interface EventContext {
  player: Artist;
  world: WorldState;
  currentYear: number;
  currentMonth: number;
  recentCollabArtist?: Artist;
  rivalArtist?: Artist;
  mentorArtist?: Artist;
  label?: RecordLabel;
  topTrend?: MusicTrend;
  lastRelease?: Song | Album;
  ecosystemContact?: EcosystemNPC;
  activeBeef?: BeefState;
}

export interface WorldState {
  currentYear: number;
  currentMonth: number;
  activeTrendIds: string[];
  genres: Record<string, Genre>;
  trends: Record<string, MusicTrend>;
  artists: Record<string, Artist>;
  songs: Record<string, Song>;
  albums: Record<string, Album>;
  labels: Record<string, RecordLabel>;
  producers: Record<string, Producer>;
  managers: Record<string, Manager>;
  tours: Tour[];
  charts: Record<MusicRegion, RegionalChart>;
  awardsHistory: AwardCeremony[];
  news: NewsItem[];
  socialFeed: SocialPost[];
  ecosystemContacts: Record<string, EcosystemNPC>;
  activeBeefs: Record<string, BeefState>;
  records: HistoricalRecord[];
  globalHistoryTimeline: Array<{
    year: number;
    month: number;
    text: string;
    category: string;
  }>;
  recentEventIdsHistory: Array<{ eventId: string; year: number; month: number }>;
  activeNarrativeChains: Record<string, { currentStep: number; nextTriggerYearMonth: { year: number; month: number } }>;
}

export interface GameSaveState {
  version: number;
  seed: number;
  savedAt: string;
  playerId: string;
  world: WorldState;
}


