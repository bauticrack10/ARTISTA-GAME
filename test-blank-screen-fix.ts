import { GameEngine } from './src/core/GameEngine';
import { StreamingEngine } from './src/systems/StreamingEngine';
import { TimeSystem } from './src/systems/TimeSystem';
import { formatMoney, formatFans, formatCompactNumber } from './src/utils/formatters';

console.log('================================================================');
console.log('🧪 TEST: VERIFICACIÓN DEL FIX DE PANTALLA EN BLANCO / CRASH');
console.log('================================================================');

// 1. Instanciación con objeto de artista vacío (peor caso)
console.log('\n--- TEST 1: Creación de Artista con datos vacíos / mínimos ---');
const engineMin = new GameEngine({});
const minPlayer = engineMin.getPlayer();
console.log('Player ID:', minPlayer.id);
console.log('Player Name:', minPlayer.name);
console.log('Player Eras count:', minPlayer.eras?.length);
console.log('Player Funds:', formatMoney(minPlayer.stats?.funds || 0));
console.log('Player Listeners:', minPlayer.stats?.monthlyListeners);
console.log('Player Total Streams:', minPlayer.stats?.totalStreams);

if (!minPlayer.name || !minPlayer.stats || !minPlayer.eras || minPlayer.eras.length === 0) {
  throw new Error('Fallo crítico: El jugador mínimo no tiene propiedades válidas.');
}
console.log('✅ [PASS] Jugador mínimo inicializado con defaults robustos.');

// 2. Instanciación con objeto de artista completo de CharacterCreatorView
console.log('\n--- TEST 2: Creación de Artista de CharacterCreatorView ---');
const customArtist = {
  id: 'artist_custom_debug',
  name: 'Neo Beat',
  realName: 'Santiago Rossi',
  isPlayer: true,
  country: 'Argentina',
  city: 'Buenos Aires',
  birthYear: 2006,
  careerStartYear: 2026,
  mainGenreId: 'trap_latino',
  subGenreIds: ['rkt', 'drill'],
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
    independence: 75
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
    hype: 55
  },
  careerStage: 'Underground' as const,
  eras: [
    {
      id: 'era_debut_custom',
      name: 'Los Primeros Pasos & Grabaciones Caseras',
      startYear: 2026,
      startMonth: 1,
      genreFocus: 'trap_latino',
      stage: 'Underground' as const,
      highlightSummary: 'Inicios del camino artístico y primeras grabaciones en el estudio.'
    }
  ],
  lifestyleUpgrades: [],
  financialLedger: []
};

const engineCustom = new GameEngine(customArtist);
const customCreatedPlayer = engineCustom.getPlayer();
const world = engineCustom.getWorld();

console.log('Player Name:', customCreatedPlayer.name);
console.log('Monthly Listeners:', customCreatedPlayer.stats.monthlyListeners);
console.log('Total Streams:', customCreatedPlayer.stats.totalStreams);
console.log('✅ [PASS] Creación de artista custom completada.');

// 3. Verificación de cálculo de métricas para todos los componentes
console.log('\n--- TEST 3: Verificación de Cálculos y Formateos para el Dashboard ---');
// Navbar tests
console.log('Navbar month:', TimeSystem.getMonthName(world.currentMonth));
console.log('Navbar funds:', formatMoney(customCreatedPlayer.stats.funds));
console.log('Navbar fans:', formatFans(customCreatedPlayer.stats.fansCount));

// HeroCard tests
console.log('HeroCard initial era:', customCreatedPlayer.eras[customCreatedPlayer.eras.length - 1]?.name);
console.log('HeroCard compact streams:', formatCompactNumber(customCreatedPlayer.stats.totalStreams));

// DecisionHub tests
const canTour = (customCreatedPlayer.stats.energy >= 85) && (customCreatedPlayer.stats.monthlyListeners >= 1000);
console.log('DecisionHub canTour check:', canTour);

// 4. Guardado y carga
console.log('\n--- TEST 4: Serialización y Restauración ---');
const savedState = engineCustom.exportSaveState();
const engineRestore = new GameEngine();
const loaded = engineRestore.importSaveState(savedState);
if (!loaded) throw new Error('Fallo al importar save state');
console.log('✅ [PASS] Save/Load exportado e importado con éxito.');

console.log('\n================================================================');
console.log('🎉 TODOS LOS TESTS DE INTEGRACIÓN Y PROTECCIÓN PASARON CON ÉXITO');
console.log('================================================================\n');
