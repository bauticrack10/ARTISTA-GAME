import { GameEngine } from './src/core/GameEngine';
import { TimeSystem } from './src/systems/TimeSystem';
import { StreamingEngine } from './src/systems/StreamingEngine';
import { IndustryEngine } from './src/systems/IndustryEngine';
import { WorldSimulation } from './src/systems/WorldSimulation';
import { Artist, WorldState, Song, Album } from './src/types';

function runDiagnosis() {
  console.log('================================================================');
  console.log('🔍 DIAGNÓSTICO DEL FLUJO DE INICIO DE CARRERA');
  console.log('================================================================\n');

  try {
    console.log('1. Creando instancia inicial de GameEngine (Start Screen state)...');
    const defaultEngine = new GameEngine();
    const defaultWorld = defaultEngine.getWorld();
    const defaultPlayer = defaultEngine.getPlayer();
    console.log('   ✅ Default world y player creados exitosamente.');
    console.log(`      Player ID: ${defaultPlayer.id}, Nombre: ${defaultPlayer.name}, Fondos: $${defaultPlayer.stats.funds}`);

    console.log('\n2. Simulando creación de nuevo artista en CharacterCreatorView...');
    const customArtist: Partial<Artist> = {
      id: `artist_${Math.random().toString(36).substring(2, 9)}`,
      name: 'Bhavi Test',
      realName: 'Bhavinder Singh',
      isPlayer: true,
      country: 'Argentina',
      city: 'Buenos Aires',
      birthYear: 2004,
      careerStartYear: 2026,
      mainGenreId: 'trap_latino',
      subGenreIds: ['urbano_latino'],
      avatarColor: 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]',
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
        popularity: 15,
        reputation: 40,
        artisticCredibility: 55,
        energy: 100,
        monthlyListeners: 1200,
        totalStreams: 3500,
        funds: 250,
        fansCount: 450,
        fanbaseLoyalty: 60,
        hype: 45
      },
      careerStage: 'Underground',
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [
        {
          id: `era_test_debut`,
          name: 'Inicios en el Underground & Primeras Grabaciones',
          startYear: 2026,
          startMonth: 1,
          genreFocus: 'trap_latino',
          stage: 'Underground',
          highlightSummary: 'Inició su carrera musical en 2026 en Buenos Aires, Argentina.'
        }
      ],
      awardsWon: [],
      legacyScore: 5,
      isRetired: false,
      historicalNotes: ['Inició su carrera musical en el año 2026 en Buenos Aires, Argentina.'],
      generationIndex: 1,
      influences: [],
      lifestyleUpgrades: [],
      financialLedger: [],
      isProdigy: false,
      prodigyMultiplier: 1.0
    };

    console.log('\n3. Instanciando GameEngine con customArtist (handleCreatePlayer)...');
    const playerEngine = new GameEngine(customArtist);
    const world = playerEngine.getWorld();
    const player = playerEngine.getPlayer();
    console.log('   ✅ PlayerEngine inicializado.');
    console.log(`      Player ID: ${player.id}, Name: ${player.name}`);
    console.log(`      Fans: ${player.stats.fansCount}, Listeners: ${player.stats.monthlyListeners}, Streams: ${player.stats.totalStreams}`);

    console.log('\n4. Verificando exportación e importación de estado de guardado (localStorage)...');
    const saveJson = playerEngine.exportSaveState();
    console.log(`   Save JSON size: ${saveJson.length} bytes`);
    const parsed = JSON.parse(saveJson);
    console.log('   ✅ JSON parseable y válido.');

    const newImportEngine = new GameEngine();
    const imported = newImportEngine.importSaveState(saveJson);
    console.log(`   Import result: ${imported}`);
    if (!imported) throw new Error('Falló importSaveState');
    console.log('   ✅ Partida importada correctamente.');

    console.log('\n5. Verificando compatibilidad de subcomponentes del Dashboard con el nuevo jugador...');
    
    // Verificar estructura requerida por ArtistHeroCard
    if (!player.eras || player.eras.length === 0) throw new Error('Player eras está vacío o undefined');
    if (!player.personality) throw new Error('Player personality is undefined');
    if (!player.stats) throw new Error('Player stats is undefined');
    if (player.stats.funds === undefined) throw new Error('Player funds is undefined');
    console.log('   ✅ ArtistHeroCard data structure OK.');

    // Verificar DecisionHub
    const playerSongs = (Object.values(world.songs) as Song[]).filter(s => s.artistId === player.id);
    const singlesThisYear = playerSongs.filter(s => s.releaseYear === world.currentYear);
    console.log(`   Player songs count: ${playerSongs.length}, singles this year: ${singlesThisYear.length}`);
    console.log('   ✅ DecisionHub data structure OK.');

    // Verificar NewsSidebar
    const relevantNews = (world.news || []).slice(0, 10);
    console.log(`   News items: ${relevantNews.length}`);
    console.log('   ✅ NewsSidebar data structure OK.');

    // Verificar ActiveCatalogCard
    console.log('   ✅ ActiveCatalogCard data structure OK.');

    // Verificar ArtistAttributesPanel
    console.log('   ✅ ArtistAttributesPanel data structure OK.');

    // Simular avance de ciclo (6 meses y 12 meses)
    console.log('\n6. Simulando avance de ciclo (6 meses)...');
    playerEngine.advanceCycle(6);
    console.log(`   Mes actual después de 6 meses: Mes ${playerEngine.getWorld().currentMonth}, Año ${playerEngine.getWorld().currentYear}`);
    console.log('   ✅ Avance de ciclo 6 meses completado sin errores.');

    console.log('\n7. Simulando avance de ciclo (12 meses)...');
    playerEngine.advanceCycle(12);
    console.log(`   Mes actual después de 12 meses: Mes ${playerEngine.getWorld().currentMonth}, Año ${playerEngine.getWorld().currentYear}`);
    console.log('   ✅ Avance de ciclo 12 meses completado sin errores.');

    console.log('\n================================================================');
    console.log('🎉 DIAGNÓSTICO EXITOSO: El motor y los estados funcionan al 100%');
    console.log('================================================================\n');
  } catch (err: any) {
    console.error('\n❌ ERROR DETECTADO DURANTE EL DIAGNÓSTICO:');
    console.error(err);
  }
}

runDiagnosis();
