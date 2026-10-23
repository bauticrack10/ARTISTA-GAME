import { GameEngine } from './src/core/GameEngine';
import { TourEngine } from './src/systems/TourEngine';
import { FestivalEngine, GLOBAL_FESTIVALS } from './src/systems/FestivalEngine';
import { TourTier, FestivalSlot } from './src/types';

interface TestStats {
  passed: number;
  failed: number;
  total: number;
  errors: string[];
}

const stats: TestStats = {
  passed: 0,
  failed: 0,
  total: 0,
  errors: []
};

function assert(condition: boolean, message: string) {
  stats.total++;
  if (condition) {
    stats.passed++;
    console.log(`  \x1b[32m✔\x1b[0m ${message}`);
  } else {
    stats.failed++;
    const errMsg = `FAIL: ${message}`;
    stats.errors.push(errMsg);
    console.error(`  \x1b[31m✘\x1b[0m ${errMsg}`);
  }
}

async function runTestSuite() {
  console.log('\n========================================================================================');
  console.log('🧪 SUITE DE PRUEBAS QA & AUDITORÍA: GIRAS, RECINTOS & FESTIVALES GLOBALES');
  console.log('========================================================================================\n');

  const engine = new GameEngine();
  const player = engine.getPlayer();

  console.log('🔹 CASO 1: Requisitos y Compuertas de Giras (Tour Gating)');
  const initialGate = TourEngine.canStartTour(player, engine.getWorld());
  assert(!initialGate.allowed, 'Artista inicial sin catálogo ni oyentes no puede iniciar gira');
  assert(typeof initialGate.reason === 'string', 'canStartTour provee razón explicativa al usuario');

  // Registrar singles
  engine.releaseSong({
    title: 'Primer Single Gira',
    genreId: 'trap_latino',
    subGenreIds: ['sub_trap_underground'],
    featuredArtistIds: [],
    budgetProduction: 2000,
    budgetMarketing: 1000
  });

  engine.advanceMonth();

  engine.releaseSong({
    title: 'Segundo Single Gira',
    genreId: 'trap_latino',
    subGenreIds: ['sub_trap_underground'],
    featuredArtistIds: [],
    budgetProduction: 2000,
    budgetMarketing: 1000
  });

  // Cumplir requisitos de oyentes y energía
  player.stats.energy = 95;
  player.stats.monthlyListeners = 45000;
  player.stats.popularity = 45;
  player.stats.funds = 100000;

  const afterCatalogGate = TourEngine.canStartTour(player, engine.getWorld());
  assert(afterCatalogGate.allowed, 'Con 2 singles, >=1k oyentes y >=85% energía, la gira queda habilitada');

  console.log('\n🔹 CASO 2: Tiers de Gira y Planificación Automática');
  const availableTiers = TourEngine.getAvailableTiersForArtist(player);
  assert(availableTiers.includes('club'), 'Tier "club" siempre disponible');
  assert(availableTiers.includes('theater'), 'Tier "theater" disponible con popularidad >= 35 y oyentes >= 20.000');

  const tourPlan = TourEngine.generateTourPlan(
    player,
    'club',
    'Gira QA Debut 2026',
    engine.getWorld().currentYear,
    engine.getWorld().currentMonth,
    engine.getWorld()
  );

  assert(tourPlan.stops.length === 4, 'Tier "club" genera exactamente 4 paradas/fechas');
  assert(tourPlan.totalTicketsSold > 0, 'Total de tickets vendidos es positivo');
  assert(tourPlan.grossRevenue > 0, 'Recaudación bruta es positiva');
  assert(tourPlan.netArtistProfit > 0, 'Ganancia neta del artista es positiva');
  assert(Number.isFinite(tourPlan.netArtistProfit), 'Ganancia neta es un número finito');
  assert(!tourPlan.id.includes('undefined'), 'ID de gira es válido y único');

  console.log('\n🔹 CASO 3: Ejecución de Gira en GameEngine & Transacciones');
  const fundsBefore = player.stats.funds;
  const energyBefore = player.stats.energy;

  const bookedTour = engine.bookTour('club', 'Gira Consagratoria 2026');
  assert(engine.getWorld().tours.length >= 1, 'Gira registrada exitosamente en world.tours');
  assert(player.stats.funds > fundsBefore, 'Fondos del artista incrementan tras gira');
  assert(player.stats.energy < energyBefore, 'Energía del artista disminuye por fatiga de gira');
  assert(player.stats.hype >= 50, 'Hype del artista incrementa tras gira');
  assert(player.stats.fansCount > 0, 'Base de fans incrementa tras gira');

  const tourTx = player.financialLedger.find(t => t.category === 'tour');
  assert(!!tourTx, 'Transacción financiera de categoría "tour" registrada en ledger');
  assert((tourTx?.amount || 0) > 0, 'Monto de transacción de gira es positivo');

  console.log('\n🔹 CASO 4: Circuito de Festivales Mundiales & Slots Elegibles');
  const coachella = GLOBAL_FESTIVALS.find(f => f.id === 'coachella')!;
  assert(!!coachella, 'Festival Coachella indexado en cartelera mundial');

  const eligibleSlot = FestivalEngine.getEligibleSlot(player, coachella);
  assert(eligibleSlot !== null, 'Artista con 45 popularidad obtiene slot elegible');
  assert(typeof eligibleSlot === 'string', 'Slot elegible es una categoría válida');

  const seasonalInvs = FestivalEngine.generateSeasonalInvitations(
    player,
    engine.getWorld().currentYear,
    engine.getWorld().currentMonth,
    engine.getWorld()
  );
  assert(Array.isArray(seasonalInvs), 'generateSeasonalInvitations retorna un arreglo');

  console.log('\n🔹 CASO 5: Resolución de Actuación en Vivo (LiveShowModal) & Anti-NaN');
  const songs = engine.getPlayerSongs();
  assert(songs.length >= 2, 'Artista posee canciones en su repertorio para armar setlist');

  const liveResult = engine.executeLiveShow({
    festivalId: coachella.id,
    slot: eligibleSlot || 'opening_act',
    setlistSongIds: songs.map(s => s.id),
    production: {
      visuals: '3d_screens',
      pyro: 'sparks_fog',
      crew: 'live_band',
      guestArtistIds: []
    },
    dilemmaId: 'sound_failure',
    dilemmaChoiceId: 'acapella_crowd'
  });

  assert(Number.isFinite(liveResult.performanceScore), 'performanceScore es un número finito (Anti-NaN verificado)');
  assert(liveResult.performanceScore >= 25 && liveResult.performanceScore <= 100, 'performanceScore está entre 25 y 100');
  assert(Number.isFinite(liveResult.attendance), 'Asistencia real es un número finito');
  assert(Number.isFinite(liveResult.netProfit), 'Ganancia neta es un número finito');
  assert(Number.isFinite(liveResult.fansGained), 'Nuevos fans ganados es un número finito');
  assert(Number.isFinite(liveResult.hypeGained), 'Hype ganado es un número finito');
  assert(Array.isArray(liveResult.reviews), 'Reseñas de prensa internacional generadas en arreglo');
  assert(liveResult.reviews.length >= 2, 'Al menos 2 reseñas de medios especializados generadas');
  assert(liveResult.reviews.every(r => Number.isFinite(r.rating) && r.rating >= 1 && r.rating <= 5), 'Calificaciones de estrellas en reseñas son válidas (1 a 5)');

  assert(Array.isArray(player.livePerformanceHistory) && player.livePerformanceHistory.length >= 1, 'Show registrado en livePerformanceHistory del artista');
  assert(Array.isArray(engine.getWorld().festivalHistory) && engine.getWorld().festivalHistory!.length >= 1, 'Show registrado en festivalHistory del mundo');

  console.log('\n🔹 CASO 6: Avance de Tiempo & Robustez del Motor');
  engine.advanceMonth();
  assert(engine.getWorld().currentMonth >= 1, 'Mes avanza limpiamente sin errores tras registrar giras y festivales');
  assert(Number.isFinite(player.stats.popularity), 'Popularidad del jugador permanece como número finito');
  assert(Number.isFinite(player.stats.monthlyListeners), 'Oyentes mensuales del jugador permanecen como número finito');

  console.log('\n========================================================================================');
  console.log(`📊 RESUMEN DE AUDITORÍA QA: ${stats.passed}/${stats.total} pruebas superadas (${((stats.passed / stats.total) * 100).toFixed(1)}%)`);
  if (stats.failed === 0) {
    console.log('🎉 TODAS LAS PRUEBAS DE GIRAS Y FESTIVALES HAN PASADO CON 100% DE ÉXITO');
  } else {
    console.error(`❌ ${stats.failed} pruebas han fallado`);
    process.exit(1);
  }
  console.log('========================================================================================\n');
}

runTestSuite().catch(err => {
  console.error('CRITICAL ERROR EN PRUEBAS:', err);
  process.exit(1);
});
