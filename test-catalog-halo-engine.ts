import { StreamingEngine } from './src/systems/StreamingEngine';
import { GameEngine } from './src/core/GameEngine';
import { WorldSimulation } from './src/systems/WorldSimulation';
import { Song, Artist } from './src/types';

console.log('=== TEST SUITE: Catalog Halo Effect & Discovery Engine ===\n');

// 1. Setup mock artist at different career stages
const undergroundArtist: any = {
  id: 'artist_under',
  name: 'Underground MC',
  realName: 'MC Test',
  isPlayer: false,
  country: 'Argentina',
  city: 'Buenos Aires',
  birthYear: 2005,
  careerStartYear: 2026,
  mainGenreId: 'trap_latino',
  personality: {
    creativity: 80, ambition: 80, discipline: 80, charisma: 80,
    skill: 80, commercialAppeal: 75, originality: 80, riskTolerance: 70,
    sociability: 70, independence: 70
  },
  stats: {
    popularity: 15, reputation: 30, artisticCredibility: 60, energy: 100,
    monthlyListeners: 8000, totalStreams: 30000, funds: 2000,
    fansCount: 3000, fanbaseLoyalty: 70, hype: 40
  },
  careerStage: 'Underground',
  labelId: null, managerId: null, activeContract: null,
  relationships: {}, eras: [], awardsWon: [], legacyScore: 5, isRetired: false,
  historicalNotes: [], generationIndex: 1
};

const superstarArtist: any = {
  id: 'artist_star',
  name: 'Superstar Global',
  realName: 'Star Test',
  isPlayer: false,
  country: 'Argentina',
  city: 'Buenos Aires',
  birthYear: 1998,
  careerStartYear: 2020,
  mainGenreId: 'trap_latino',
  personality: {
    creativity: 90, ambition: 90, discipline: 90, charisma: 95,
    skill: 90, commercialAppeal: 92, originality: 85, riskTolerance: 80,
    sociability: 85, independence: 80
  },
  stats: {
    popularity: 90, reputation: 90, artisticCredibility: 85, energy: 100,
    monthlyListeners: 22000000, totalStreams: 800000000, funds: 15000000,
    fansCount: 8500000, fanbaseLoyalty: 88, hype: 85
  },
  careerStage: 'Superstar',
  labelId: null, managerId: null, activeContract: null,
  relationships: {}, eras: [], awardsWon: [], legacyScore: 85, isRetired: false,
  historicalNotes: [], generationIndex: 1
};

// 2. Setup songs: Flagship Hit, Featured Single, Deep Cut
const hitSong: any = {
  id: 'song_hit',
  title: 'Hit Mundial',
  artistId: superstarArtist.id,
  genreId: 'trap_latino',
  releaseYear: 2024,
  releaseMonth: 1,
  quality: 90,
  commercialAppeal: 92,
  originality: 85,
  hypeAtRelease: 90,
  streamsTotal: 150000000,
  streamsLastMonth: 2500000,
  monthlyStreamsHistory: [],
  peakPosition: { Global: 1, Argentina: 1, USA: 5, LatinAmerica: 1, Europe: 8, Spain: 1, Mexico: 1 },
  weeksOnChart: { Global: 30, Argentina: 40, USA: 15, LatinAmerica: 35, Europe: 10, Spain: 30, Mexico: 35 },
  longevityCurve: 'instant_classic',
  isSingle: true,
  isClassic: true,
  wentViral: true
};

const singleSong: any = {
  id: 'song_single',
  title: 'Segundo Single',
  artistId: superstarArtist.id,
  genreId: 'trap_latino',
  releaseYear: 2024,
  releaseMonth: 6,
  quality: 84,
  commercialAppeal: 82,
  originality: 80,
  hypeAtRelease: 80,
  streamsTotal: 40000000,
  streamsLastMonth: 800000,
  monthlyStreamsHistory: [],
  peakPosition: { Global: 18, Argentina: 4, USA: null, LatinAmerica: 12, Europe: null, Spain: 8, Mexico: 10 },
  weeksOnChart: { Global: 12, Argentina: 20, USA: 0, LatinAmerica: 16, Europe: 0, Spain: 15, Mexico: 18 },
  longevityCurve: 'steady',
  isSingle: true,
  isClassic: false,
  wentViral: false
};

const deepCutSong: any = {
  id: 'song_deepcut',
  title: 'Track 9 (Deep Cut)',
  artistId: superstarArtist.id,
  genreId: 'trap_latino',
  releaseYear: 2024,
  releaseMonth: 1,
  quality: 78,
  commercialAppeal: 65,
  originality: 80,
  hypeAtRelease: 70,
  streamsTotal: 8000000,
  streamsLastMonth: 120000,
  monthlyStreamsHistory: [],
  peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
  weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
  longevityCurve: 'steady',
  isSingle: false,
  isClassic: false,
  wentViral: false
};

const superstarCatalog = [hitSong, singleSong, deepCutSong];

console.log('--- TEST 1: Catalog Halo Effect & Scaled Floors for Superstar (22M listeners, pop 90) ---');
const hitStreamsRes = StreamingEngine.calculateSongMonthlyStreams(
  hitSong, superstarArtist, 2026, 8, [], undefined, undefined, superstarCatalog
);
const singleStreamsRes = StreamingEngine.calculateSongMonthlyStreams(
  singleSong, superstarArtist, 2026, 8, [], undefined, undefined, superstarCatalog
);
const deepCutStreamsRes = StreamingEngine.calculateSongMonthlyStreams(
  deepCutSong, superstarArtist, 2026, 8, [], undefined, undefined, superstarCatalog
);

console.log(`Hit Mundial streams: ${hitStreamsRes.streams.toLocaleString()}`);
console.log(`Segundo Single streams: ${singleStreamsRes.streams.toLocaleString()}`);
console.log(`Deep Cut streams: ${deepCutStreamsRes.streams.toLocaleString()}`);

// Validations:
if (hitStreamsRes.streams > singleStreamsRes.streams && singleStreamsRes.streams > deepCutStreamsRes.streams) {
  console.log('✅ PASS: Natural Catalog Hierarchy preserved (Hit > Single > Deep Cut).');
} else {
  console.error('❌ FAIL: Hierarchy violated!');
  process.exit(1);
}

if (deepCutStreamsRes.streams >= 15000) {
  console.log(`✅ PASS: Catalog floor scaled with superstar size (Deep cut gets ${deepCutStreamsRes.streams.toLocaleString()} streams, not insignificantly low).`);
} else {
  console.error('❌ FAIL: Superstar deep cut floor is too low!');
  process.exit(1);
}

console.log('\n--- TEST 2: Underground Artist Catalog (pop 15, 8k listeners) ---');
const underSongHit: Song = {
  ...hitSong,
  id: 'under_hit',
  artistId: undergroundArtist.id,
  streamsTotal: 15000,
  streamsLastMonth: 600,
  peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null }
};
const underDeepCut: Song = {
  ...deepCutSong,
  id: 'under_deep',
  artistId: undergroundArtist.id,
  streamsTotal: 3000,
  streamsLastMonth: 100
};
const underCatalog = [underSongHit, underDeepCut];

const underHitRes = StreamingEngine.calculateSongMonthlyStreams(
  underSongHit, undergroundArtist, 2026, 8, [], undefined, undefined, underCatalog
);
const underDeepRes = StreamingEngine.calculateSongMonthlyStreams(
  underDeepCut, undergroundArtist, 2026, 8, [], undefined, undefined, underCatalog
);

console.log(`Underground Hit streams: ${underHitRes.streams.toLocaleString()}`);
console.log(`Underground Deep Cut streams: ${underDeepRes.streams.toLocaleString()}`);

if (underHitRes.streams > underDeepRes.streams) {
  console.log('✅ PASS: Underground catalog maintains hierarchy.');
} else {
  console.error('❌ FAIL: Underground catalog hierarchy broken!');
  process.exit(1);
}

console.log('\n--- TEST 3: Smooth Decay of Massive Viral Spikes ---');
const emergingViralArtist: Artist = {
  ...undergroundArtist,
  id: 'artist_emerging_viral',
  stats: {
    ...undergroundArtist.stats,
    popularity: 35,
    fansCount: 30000,
    monthlyListeners: 180000
  }
};

const viralSong: Song = {
  ...hitSong,
  id: 'viral_test',
  artistId: emergingViralArtist.id,
  releaseYear: 2026,
  releaseMonth: 1,
  streamsTotal: 3000000,
  streamsLastMonth: 3000000, // Peak 3M streams last month
  longevityCurve: 'explosive_drop',
  wentViral: true
};

const viralMonth2 = StreamingEngine.calculateSongMonthlyStreams(
  viralSong, emergingViralArtist, 2026, 2, [], undefined, undefined, [viralSong]
);
console.log(`Month 1 Peak: 3,000,000 -> Month 2: ${viralMonth2.streams.toLocaleString()} (Retained: ${(viralMonth2.streams / 3000000 * 100).toFixed(1)}%)`);

if (viralMonth2.streams >= 1800000 && viralMonth2.streams <= 2850000) {
  console.log('✅ PASS: Smooth decay prevents abrupt collapse (retains ~65-90% after viral peak).');
} else {
  console.error('❌ FAIL: Viral decay collapsed too abruptly or stayed too high!', viralMonth2.streams);
  process.exit(1);
}

console.log('\n--- TEST 4: GameEngine Simulation & Cycle Integration ---');
const game = new GameEngine({
  name: 'Test Artist Player',
  stats: {
    popularity: 35,
    reputation: 50,
    artisticCredibility: 70,
    energy: 100,
    monthlyListeners: 150000,
    totalStreams: 500000,
    funds: 50000,
    fansCount: 40000,
    fanbaseLoyalty: 75,
    hype: 60
  }
});

const s1 = game.releaseSong({
  title: 'Debut Hit Single',
  genreId: 'trap_latino',
  subGenreIds: [],
  featuredArtistIds: [],
  budgetProduction: 5000,
  budgetMarketing: 10000,
  longevityCurve: 'instant_classic'
});

console.log(`Released: ${s1.title} (ID: ${s1.id})`);

// Advance cycle by 6 months
game.advanceCycle(6);
const playerAfterCycle = game.getPlayer();
const playerSongsAfter = game.getPlayerSongs();

console.log(`After 6 months:`);
console.log(`Monthly Listeners: ${playerAfterCycle.stats.monthlyListeners.toLocaleString()}`);
console.log(`Total Streams: ${playerAfterCycle.stats.totalStreams.toLocaleString()}`);
console.log(`Popularity: ${playerAfterCycle.stats.popularity}`);
console.log(`Song "${playerSongsAfter[0].title}" streamsLastMonth: ${playerSongsAfter[0].streamsLastMonth.toLocaleString()}`);

if (playerSongsAfter[0].streamsLastMonth > 0 && playerAfterCycle.stats.monthlyListeners > 0) {
  console.log('✅ PASS: GameEngine advanceCycle smoothly simulates catalog growth.');
} else {
  console.error('❌ FAIL: GameEngine cycle produced 0 streams or listeners!');
  process.exit(1);
}

console.log('\n🎉 ALL CATALOG HALO ENGINE TESTS PASSED SUCCESSFULLY! 🎉');
