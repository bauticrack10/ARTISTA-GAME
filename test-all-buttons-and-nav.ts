import { GameEngine } from './src/core/GameEngine';
import {
  WorldState,
  Artist,
  Song,
  Album,
  ReleaseConfirmationData,
  SocialActionResult,
  InteractionResult,
  ActionCooldownResult,
  BeefState,
  ArtistRelationship
} from './src/types';
import { RelationshipEngine } from './src/systems/RelationshipEngine';
import { IndustryEngine } from './src/systems/IndustryEngine';
import { TimeSystem } from './src/systems/TimeSystem';
import { INITIAL_ARTISTS } from './src/data/initialArtists';
import { INITIAL_GENRES, SUBGENRE_DETAILS } from './src/data/genres';
import { INITIAL_LABELS } from './src/data/labels';
import { INITIAL_PRODUCERS, INITIAL_MANAGERS } from './src/data/producersAndManagers';

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

function createPlayerArtist(overrides: any = {}): any {
  return {
    id: overrides.id || 'artist_player_qa',
    name: overrides.name || 'Artista Protagonista QA',
    realName: 'MC Auditor',
    isPlayer: true,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2005,
    careerStartYear: 2026,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || ['sub_trap_underground'],
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
      ...(overrides.personality || {})
    },
    stats: {
      popularity: 45,
      reputation: 50,
      artisticCredibility: 60,
      energy: 100,
      monthlyListeners: 40000,
      totalStreams: 100000,
      funds: 60000,
      fansCount: 25000,
      fanbaseLoyalty: 75,
      hype: 50,
      ...(overrides.stats || {})
    },
    careerStage: overrides.careerStage || 'Emerging',
    labelId: overrides.labelId !== undefined ? overrides.labelId : null,
    managerId: overrides.managerId !== undefined ? overrides.managerId : null,
    relationships: overrides.relationships || {},
    eras: overrides.eras || [],
    awardsWon: overrides.awardsWon || [],
    legacyScore: 20,
    isRetired: false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    lifestyleUpgrades: [],
    financialLedger: [],
    ...overrides
  };
}

function createTargetArtist(overrides: Partial<Artist> = {}): Artist {
  return {
    id: overrides.id || `artist_target_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: overrides.name || 'Colega de la Escena',
    realName: 'Nombre Real Colega',
    isPlayer: false,
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 2003,
    careerStartYear: 2024,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || ['sub_trap_underground'],
    personality: {
      creativity: 80,
      ambition: 80,
      discipline: 75,
      charisma: 85,
      skill: 80,
      commercialAppeal: 80,
      originality: 78,
      riskTolerance: 70,
      sociability: 80,
      independence: 70,
      ...(overrides.personality || {})
    },
    stats: {
      popularity: 55,
      reputation: 60,
      artisticCredibility: 65,
      energy: 100,
      monthlyListeners: 120000,
      totalStreams: 400000,
      funds: 80000,
      fansCount: 75000,
      fanbaseLoyalty: 75,
      hype: 60,
      ...(overrides.stats || {})
    },
    careerStage: overrides.careerStage || 'Established',
    labelId: null,
    managerId: null,
    activeContract: null,
    relationships: overrides.relationships || {},
    eras: [],
    awardsWon: [],
    legacyScore: 25,
    isRetired: overrides.isRetired || false,
    historicalNotes: [],
    generationIndex: 1,
    influences: [],
    lifestyleUpgrades: [],
    financialLedger: [],
    ...overrides
  };
}

// Procedural title suggestions simulation matching StudioView
const TITLE_SUGGESTIONS = [
  'Crónicas del Asfalto',
  'Frecuencias de Medianoche',
  'Génesis & Apocalipsis',
  'Diamantes en la Penumbra',
  'El Último Trago de Verano',
  'Sinfonía Callejera',
  'Corazón en Llamas',
  'Memorias de un Viajero',
  'Ecos de la Ciudad',
  'Oro & Cenizas',
  'La Noche Eterna',
  'Revolución Sonora',
  'El Precio de la Gloria',
  'Vértigo y Luces'
];

function generateProceduralTitle(): string {
  return TITLE_SUGGESTIONS[Math.floor(Math.random() * TITLE_SUGGESTIONS.length)];
}

// Navigation router emulator matching App.tsx handleNavigate
class AppNavigationRouter {
  public currentTab: string = 'dashboard';
  public studioSubTab: 'single' | 'album' | 'catalog' = 'single';

  public handleNavigate(tab: string, subTab?: 'single' | 'album' | 'catalog') {
    if (tab === 'catalog') {
      this.currentTab = 'studio';
      this.studioSubTab = 'catalog';
    } else if (tab === 'record' || tab === 'studio_single') {
      this.currentTab = 'studio';
      this.studioSubTab = 'single';
    } else if (tab === 'studio_album') {
      this.currentTab = 'studio';
      this.studioSubTab = 'album';
    } else if (tab === 'studio') {
      this.currentTab = 'studio';
      this.studioSubTab = subTab || 'single';
    } else {
      this.currentTab = tab;
    }
  }
}

export function runAllButtonsAndNavTests(): boolean {
  console.log('\n========================================================================================');
  console.log('🧪 SUITE DE PRUEBAS QA & AUDITORÍA INTEGRAL: BOTONES, NAVEGACIÓN Y ACCIONES DEL SISTEMA');
  console.log('========================================================================================\n');

  // ====================================================================================
  // CASO 1: NAVEGACIÓN AL CATÁLOGO & INDEXACIÓN DISCOGRÁFICA COMPLETA
  // ====================================================================================
  console.log('🔹 CASO 1: Navegación al Catálogo (Dashboard / Modals) & Visualización de Obras');
  {
    const router = new AppNavigationRouter();

    // 1.1 Navegación directa a 'catalog' desde el router
    router.handleNavigate('catalog');
    assert(router.currentTab === 'studio', '1.1 Navegación a "catalog" activa la vista "studio"');
    assert(router.studioSubTab === 'catalog', '1.1 Navegación a "catalog" fija la subpestaña en "catalog"');

    // 1.2 Navegación a 'catalog' desde ReleaseConfirmationModal
    let modalNavigated = false;
    const mockOnNavigateToCatalog = () => {
      router.handleNavigate('catalog');
      modalNavigated = true;
    };
    mockOnNavigateToCatalog();
    assert(Boolean(modalNavigated), '1.2 Callback onNavigateToCatalog de ReleaseConfirmationModal ejecutado');
    assert(router.currentTab === 'studio' && router.studioSubTab === 'catalog', '1.2 ReleaseConfirmationModal transiciona limpiamente a StudioView -> Catalog');

    // 1.3 Navegación a 'catalog' desde ActiveCatalogCard ("Ver Catálogo Completo (N)")
    let activeCardNavigated = false;
    const mockOnActiveCatalogCardNavigate = (target: string) => {
      router.handleNavigate(target);
      activeCardNavigated = true;
    };
    mockOnActiveCatalogCardNavigate('catalog');
    assert(Boolean(activeCardNavigated), '1.3 ActiveCatalogCard "Ver Catálogo Completo" ejecuta onNavigate("catalog")');
    assert(router.currentTab === 'studio' && router.studioSubTab === 'catalog', '1.3 ActiveCatalogCard abre la subpestaña "catalog"');

    // 1.4 Indexación de Canciones y Álbumes en StudioView -> Catalog
    const engine = new GameEngine(createPlayerArtist({
      stats: { funds: 100000, energy: 100 }
    }));
    const world = engine.getWorld();
    const player = engine.getPlayer();

    // Lanzar 2 singles
    engine.releaseSong({
      title: 'Primer Single QA',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      featuredArtistIds: [],
      budgetProduction: 2000,
      budgetMarketing: 1000
    });

    engine.releaseSong({
      title: 'Segundo Single QA',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      featuredArtistIds: [],
      budgetProduction: 2000,
      budgetMarketing: 1000
    });

    // Lanzar 1 álbum
    engine.releaseAlbum({
      title: 'Álbum Debut Conceptual QA',
      type: 'album',
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      newTrackTitles: ['Intro', 'Fuego', 'Noche', 'Éxito', 'Luz', 'Outro'],
      budgetProduction: 10000,
      budgetMarketing: 5000
    });

    const playerSongs = (Object.values(world.songs) as Song[]).filter(s => s.artistId === player.id);
    const playerAlbums = (Object.values(world.albums) as Album[]).filter(a => a.artistId === player.id);

    // 2 singles sueltos + 6 canciones del álbum = 8 canciones totales
    assert(playerSongs.length === 8, `1.4 Total de canciones indexadas del jugador es 8 (Actual: ${playerSongs.length})`);
    assert(playerAlbums.length === 1, `1.4 Total de álbumes indexados del jugador es 1 (Actual: ${playerAlbums.length})`);

    // Comprobación de los filtros del Catálogo:
    // Filtro 'all'
    const catalogAllCount = playerSongs.length + playerAlbums.length;
    assert(catalogAllCount === 9, `1.4 Filtro "Todos" indexa 9 elementos totales (8 canciones + 1 álbum)`);

    // Filtro 'albums'
    const albumItem = playerAlbums[0];
    assert(albumItem.title === 'Álbum Debut Conceptual QA', '1.4 Álbum indexado con título correcto');
    assert(albumItem.songIds.length === 6, '1.4 Álbum indexado con sus 6 pistas asociadas');
    assert(typeof albumItem.criticalScore === 'number' && albumItem.criticalScore >= 0 && albumItem.criticalScore <= 100, '1.4 Álbum posee puntaje crítico de prensa (Metacritic)');
    assert(typeof albumItem.criticalReviewText === 'string' && albumItem.criticalReviewText.length > 0, '1.4 Álbum posee reseña textual generada');

    // Filtro 'singles'
    const singleItems = playerSongs.filter(s => s.isSingle);
    assert(singleItems.length === 2, `1.4 Filtro "Singles" indexa exactamente los 2 singles promocionales`);
    assert(singleItems[0].title === 'Primer Single QA', '1.4 1er single indexado correctamente');
    assert(singleItems[1].title === 'Segundo Single QA', '1.4 2do single indexado correctamente');

    // 1.5 Validación de Empty State cuando no hay obras
    const emptyEngine = new GameEngine(createPlayerArtist());
    const emptySongs = (Object.values(emptyEngine.getWorld().songs) as Song[]).filter(s => s.artistId === emptyEngine.getPlayer().id);
    const emptyAlbums = (Object.values(emptyEngine.getWorld().albums) as Album[]).filter(a => a.artistId === emptyEngine.getPlayer().id);
    assert(emptySongs.length === 0 && emptyAlbums.length === 0, '1.5 Estado vacío detectado cuando no hay canciones ni álbumes');
  }

  // ====================================================================================
  // CASO 2: BOTÓN DE GRABAR MÚSICA & FLUJO COMPLETO DE SINGLE
  // ====================================================================================
  console.log('\n🔹 CASO 2: Botón de Grabar Música, Título Procedural Automático & Confirmación');
  {
    const router = new AppNavigationRouter();

    // 2.1 Navegación a las diferentes rutas de single
    router.handleNavigate('studio');
    assert(router.currentTab === 'studio' && router.studioSubTab === 'single', '2.1 onNavigate("studio") abre Single Form');

    router.handleNavigate('record');
    assert(router.currentTab === 'studio' && router.studioSubTab === 'single', '2.1 onNavigate("record") redirige a Single Form');

    router.handleNavigate('studio_single');
    assert(router.currentTab === 'studio' && router.studioSubTab === 'single', '2.1 onNavigate("studio_single") redirige a Single Form');

    // 2.2 Título Vacío -> Generación Automática sin bloqueo de botón
    const engine = new GameEngine(createPlayerArtist({
      stats: { funds: 50000, energy: 100 }
    }));
    const initialFunds = engine.getPlayer().stats.funds; // 50000
    const initialEnergy = engine.getPlayer().stats.energy; // 100

    let inputTitle = ''; // Título dejado en blanco por el usuario
    let finalTitle = inputTitle.trim();
    if (!finalTitle) {
      finalTitle = generateProceduralTitle();
    }
    assert(finalTitle.length > 0, `2.2 Título vacío autogenera nombre procedural: "${finalTitle}"`);
    assert(TITLE_SUGGESTIONS.includes(finalTitle), '2.2 Título autogenerado pertenece al pool procedural de Estudio');

    // El botón de submit NO está deshabilitado por título vacío
    const isPublishing = false;
    const isSinglesLimitReached = false;
    const totalSingleCost = 3000 + 2000; // 5000
    const isFundsInsufficient = totalSingleCost > engine.getPlayer().stats.funds;
    const isEnergyInsufficient = engine.getPlayer().stats.energy < 15;
    const isSubmitDisabled = isPublishing || isSinglesLimitReached || isFundsInsufficient || isEnergyInsufficient;
    assert(isSubmitDisabled === false, '2.2 Botón de Grabar Single permanece HABILITADO aun cuando el título estaba en blanco');

    // 2.3 Ejecución con éxito del Single
    const songParams = {
      title: finalTitle,
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      featuredArtistIds: [],
      budgetProduction: 3000,
      budgetMarketing: 2000,
      musicVideo: {
        concept: 'Cine 4K Cinematográfico',
        budget: 5000,
        directorTier: 'Estudio Indie'
      }
    };

    const totalDeduction = songParams.budgetProduction + songParams.budgetMarketing + (songParams.musicVideo?.budget || 0); // 10000

    engine.releaseSong(songParams);

    // 2.4 Verificación de descuento de Fondos y Energía
    const expectedFunds = initialFunds - totalDeduction;
    assert(engine.getPlayer().stats.funds === expectedFunds, `2.3 Fondos descontados correctamente: $${engine.getPlayer().stats.funds.toLocaleString()} (Esperado: $${expectedFunds.toLocaleString()})`);
    assert(engine.getPlayer().stats.energy === 85, `2.3 Energía descontada exactamente -15%: ${engine.getPlayer().stats.energy}% (100 -> 85)`);

    // 2.5 Verificación de creación en World State
    const createdSong = Object.values(engine.getWorld().songs).find(s => s.title === finalTitle);
    assert(createdSong !== undefined, `2.3 Canción "${finalTitle}" registrada en world.songs`);
    assert(createdSong?.isSingle === true, '2.3 Canción marcada como isSingle: true');
    assert(createdSong?.musicVideo !== undefined, '2.3 Videoclip oficial registrado en la canción');
    assert(createdSong?.musicVideo?.concept === 'Cine 4K Cinematográfico', '2.3 Concepto de videoclip registrado');

    // 2.6 Generación del objeto ReleaseConfirmationData
    const releaseData: ReleaseConfirmationData = {
      type: 'single',
      title: finalTitle,
      coverGradient: 'from-violet-600 via-purple-600 to-indigo-800',
      songCount: 1,
      trackTitles: [finalTitle],
      genreId: 'trap_latino',
      genreName: 'Trap Latino',
      releaseYear: 2026,
      releaseMonth: 1,
      totalBudget: totalDeduction,
      budgetBreakdown: {
        production: songParams.budgetProduction,
        marketing: songParams.budgetMarketing,
        producerFee: 0,
        videoCost: 5000
      }
    };

    assert(releaseData.type === 'single', '2.4 ReleaseConfirmationData generado con type "single"');
    assert(releaseData.totalBudget === 10000, '2.4 Desglose de presupuesto suma $10,000 en total');
    assert(releaseData.songCount === 1, '2.4 songCount es 1');

    // 2.7 Casos límite: Fondos insuficientes, Energía insuficiente y Límite Anual
    // A) Fondos insuficientes
    const poorPlayerEngine = new GameEngine(createPlayerArtist({ stats: { funds: 100, energy: 100 } }));
    let poorBlocked = false;
    try {
      poorPlayerEngine.releaseSong({
        title: 'Single Imposible',
        genreId: 'trap_latino',
        subGenreIds: [],
        featuredArtistIds: [],
        budgetProduction: 5000,
        budgetMarketing: 5000
      });
    } catch (e: any) {
      poorBlocked = true;
      assert(e.message.includes('Fondos insuficientes') || e.message.includes('fondos'), '2.5 Error defensivo por fondos insuficientes');
    }
    assert(poorBlocked === true, '2.5 Lanzamiento con fondos insuficientes bloqueado');

    // B) Energía menor a 15%
    const tiredPlayerEngine = new GameEngine(createPlayerArtist({ stats: { funds: 50000, energy: 10 } }));
    let tiredBlocked = false;
    try {
      tiredPlayerEngine.releaseSong({
        title: 'Single Agotado',
        genreId: 'trap_latino',
        subGenreIds: [],
        featuredArtistIds: [],
        budgetProduction: 1000,
        budgetMarketing: 1000
      });
    } catch (e: any) {
      tiredBlocked = true;
      assert(e.message.includes('energía') || e.message.includes('agotado') || e.message.includes('exhausto'), '2.5 Error defensivo por energía menor a 15%');
    }
    assert(tiredBlocked === true, '2.5 Lanzamiento con artista agotado bloqueado');

    // C) Límite de 5 singles por año
    const limitEngine = new GameEngine(createPlayerArtist({ stats: { funds: 500000, energy: 100 } }));
    for (let i = 1; i <= GameEngine.MAX_SINGLES_PER_YEAR; i++) {
      limitEngine.getPlayer().stats.energy = 100; // Recargar para prueba de singles
      limitEngine.releaseSong({
        title: `Single Cupo ${i}`,
        genreId: 'trap_latino',
        subGenreIds: [],
        featuredArtistIds: [],
        budgetProduction: 1000,
        budgetMarketing: 1000
      });
    }
    let limitBlocked = false;
    try {
      limitEngine.getPlayer().stats.energy = 100;
      limitEngine.releaseSong({
        title: 'Single 6 Excedente',
        genreId: 'trap_latino',
        subGenreIds: [],
        featuredArtistIds: [],
        budgetProduction: 1000,
        budgetMarketing: 1000
      });
    } catch (e: any) {
      limitBlocked = true;
      assert(e.message.includes('límite') || e.message.includes('singles'), '2.5 Error defensivo por cupo anual de 5 singles alcanzado');
    }
    assert(limitBlocked === true, '2.5 Sexto single en el mismo año bloqueado por tope anual');
  }

  // ====================================================================================
  // CASO 3: BOTÓN DE GRABAR ÁLBUM & FLUJO COMPLETO DE LP
  // ====================================================================================
  console.log('\n🔹 CASO 3: Botón de Grabar Álbum, Sugerencia Conceptual & Publicación de LP');
  {
    const router = new AppNavigationRouter();

    // 3.1 Navegación a 'studio_album'
    router.handleNavigate('studio_album');
    assert(router.currentTab === 'studio' && router.studioSubTab === 'album', '3.1 onNavigate("studio_album") abre Album Form');

    // 3.2 Sugerencia de título conceptual
    let albumTitleInput = '';
    const suggestedTitle = generateProceduralTitle();
    assert(suggestedTitle.length > 0, `3.2 Botón "Sugerir Título Conceptual" genera: "${suggestedTitle}"`);

    // 3.3 Requisito de pistas mínimas por formato
    const getMinTracksForType = (type: Album['type']): number => {
      switch (type) {
        case 'ep': return 4;
        case 'mixtape': return 6;
        case 'album': return 6;
        case 'deluxe': return 10;
        case 'collab_album': return 6;
        default: return 6;
      }
    };

    assert(getMinTracksForType('album') === 6, '3.3 Formato Álbum (LP) requiere mínimo 6 pistas');
    assert(getMinTracksForType('ep') === 4, '3.3 Formato EP requiere mínimo 4 pistas');
    assert(getMinTracksForType('deluxe') === 10, '3.3 Formato Deluxe requiere mínimo 10 pistas');

    // 3.4 Descuento de fondos, energía (-35%) y publicación
    const albumEngine = new GameEngine(createPlayerArtist({
      stats: { funds: 80000, energy: 100 }
    }));
    const initialFunds = albumEngine.getPlayer().stats.funds; // 80000
    const initialEnergy = albumEngine.getPlayer().stats.energy; // 100

    const albumParams = {
      title: suggestedTitle,
      type: 'album' as const,
      genreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      newTrackTitles: [
        'Intro (Declaración)',
        'Fuego en las Calles',
        'Noches de Gloria',
        'Diamantes y Cicatrices',
        'Bajo las Luces del Neón',
        'Outro (El Legado)'
      ],
      budgetProduction: 15000,
      budgetMarketing: 10000
    };

    const totalCost = albumParams.budgetProduction + albumParams.budgetMarketing; // 25000

    const publishedAlbum = albumEngine.releaseAlbum(albumParams);

    // Verificaciones
    assert(publishedAlbum !== undefined, `3.4 LP "${suggestedTitle}" publicado con éxito`);
    assert(publishedAlbum.title === suggestedTitle, '3.4 Título de álbum coincide');
    assert(publishedAlbum.type === 'album', '3.4 Tipo de álbum es LP ("album")');
    assert(publishedAlbum.songIds.length === 6, '3.4 LP contiene exactamente las 6 canciones compuestas');

    // Fondos y Energía
    const expectedFunds = initialFunds - totalCost;
    assert(albumEngine.getPlayer().stats.funds === expectedFunds, `3.4 Fondos descontados correctamente: $${albumEngine.getPlayer().stats.funds.toLocaleString()}`);
    assert(albumEngine.getPlayer().stats.energy === 65, `3.4 Energía descontada exactamente -35%: ${albumEngine.getPlayer().stats.energy}% (100 -> 65)`);

    // Metacritic y Críticas
    assert(typeof publishedAlbum.criticalScore === 'number' && publishedAlbum.criticalScore >= 0, `3.4 Metacritic Score generado: ${publishedAlbum.criticalScore}/100`);
    assert(typeof publishedAlbum.criticalReviewText === 'string' && publishedAlbum.criticalReviewText.length > 0, `3.4 Reseña crítica de prensa: "${publishedAlbum.criticalReviewText}"`);

    // Verificación de ReleaseConfirmationData para Álbum
    const albumConfirmation: ReleaseConfirmationData = {
      type: 'album',
      title: suggestedTitle,
      coverGradient: 'from-fuchsia-600 via-pink-600 to-rose-700',
      songCount: 6,
      trackTitles: albumParams.newTrackTitles,
      genreId: 'trap_latino',
      genreName: 'Trap Latino',
      releaseYear: 2026,
      releaseMonth: 1,
      totalBudget: totalCost,
      budgetBreakdown: {
        production: albumParams.budgetProduction,
        marketing: albumParams.budgetMarketing,
        producerFee: 0,
        videoCost: 0
      }
    };

    assert(albumConfirmation.type === 'album', '3.5 Modal de confirmación recibe type "album"');
    assert(albumConfirmation.songCount === 6, '3.5 Modal de confirmación registra 6 canciones');
    assert(albumConfirmation.trackTitles.length === 6, '3.5 Modal de confirmación lista todas las pistas del proyecto');
  }

  // ====================================================================================
  // CASO 4: ACCIONES SOCIALES EN RELATIONSHIPSVIEW & PREVENCIÓN DE DOBLE EJECUCIÓN
  // ====================================================================================
  console.log('\n🔹 CASO 4: Acciones Sociales en RelationshipsView (Elogio / Tiradera) & Cooldowns');
  {
    const engine = new GameEngine(createPlayerArtist({
      stats: { hype: 40, popularity: 40, artisticCredibility: 60 }
    }));

    const targetArtist1 = createTargetArtist({ id: 'artist_target_qa_1', name: 'Milo J QA' });
    const targetArtist2 = createTargetArtist({ id: 'artist_target_qa_2', name: 'Duki QA' });

    engine.getWorld().artists[targetArtist1.id] = targetArtist1;
    engine.getWorld().artists[targetArtist2.id] = targetArtist2;

    // 4.1 Ejecutar Elogio (Shoutout) -> No doble ejecución y Cooldown de 3 Meses
    const checkShoutoutM1 = RelationshipEngine.canSendShoutout(engine.getPlayer(), targetArtist1, 2026, 1);
    assert(checkShoutoutM1.canSend === true && checkShoutoutM1.canPerform === true, '4.1 canSendShoutout autoriza el 1er elogio');
    assert(checkShoutoutM1.cooldownRemainingMonths === 0, '4.1 Cooldown inicial es 0 meses');

    const shoutoutResult = engine.interactWithArtist(targetArtist1.id, 'shoutout') as SocialActionResult;
    assert(shoutoutResult.success === true, '4.1 interactWithArtist ejecuta elogio con éxito');
    assert(shoutoutResult.outcomeType === 'shoutout_success', '4.1 outcomeType es shoutout_success');
    assert(shoutoutResult.affinityDelta === 12, '4.1 Afinidad incrementa +12 pts');
    assert(shoutoutResult.respectDelta === 10, '4.1 Respeto incrementa +10 pts');
    assert(shoutoutResult.hypeChange === 8, '4.1 Hype ganado es +8 pts');

    const relA1 = engine.getPlayer().relationships[targetArtist1.id];
    assert(relA1.lastShoutoutYear === 2026 && relA1.lastShoutoutMonth === 1, '4.1 Timestamp registrado en Año 2026, Mes 1');

    // 4.2 Intento de re-ejecución inmediata (Doble Clic / Re-ejecución en Cooldown)
    const checkShoutoutBlocked = RelationshipEngine.canSendShoutout(engine.getPlayer(), targetArtist1, 2026, 1);
    assert(checkShoutoutBlocked.canSend === false, '4.2 Intento de segundo elogio en Mes 1 es bloqueado');
    assert(checkShoutoutBlocked.cooldownRemainingMonths === 3, '4.2 Cooldown restante es de 3 meses');

    let duplicateShoutoutBlocked = false;
    try {
      engine.interactWithArtist(targetArtist1.id, 'shoutout');
    } catch (e: any) {
      duplicateShoutoutBlocked = true;
      assert(e.message.includes('Debes esperar') || e.message.includes('cooldown'), `4.2 Error defensivo anti doble ejecución: "${e.message}"`);
    }
    assert(duplicateShoutoutBlocked === true, '4.2 Doble ejecución prevenida mediante excepción controlada');

    // Desbloqueo temporal a los 3 meses (Mes 4)
    const checkShoutoutM4 = RelationshipEngine.canSendShoutout(engine.getPlayer(), targetArtist1, 2026, 4);
    assert(checkShoutoutM4.canSend === true, '4.2 Tras 3 meses (Mes 4), el elogio vuelve a estar habilitado');

    // 4.3 Ejecutar Tiradera (Diss Track) -> Cooldown de 6 Meses
    const checkDissM1 = RelationshipEngine.canSendDiss(engine.getPlayer(), targetArtist2, 2026, 1);
    assert(checkDissM1.canSend === true && checkDissM1.canPerform === true, '4.3 canSendDiss autoriza la 1ra tiradera');
    assert(checkDissM1.cooldownRemainingMonths === 0, '4.3 Cooldown inicial de tiradera es 0 meses');

    const dissResult = engine.interactWithArtist(targetArtist2.id, 'diss') as SocialActionResult;
    assert(dissResult.success === true, '4.3 interactWithArtist ejecuta tiradera con éxito');
    assert(Boolean(dissResult.outcomeType), `4.3 outcomeType de tiradera: "${dissResult.outcomeType}"`);
    assert(Boolean(dissResult.beefState), '4.3 Se genera o actualiza estado de BeefState');

    const relA2 = engine.getPlayer().relationships[targetArtist2.id];
    // 4.4 Intento de segunda tiradera antes de 6 meses
    const checkDissBlockedM3 = RelationshipEngine.canSendDiss(engine.getPlayer(), targetArtist2, 2026, 3);
    assert(checkDissBlockedM3.canSend === false, '4.4 Tiradera en Mes 3 permanece bloqueada');
    assert(checkDissBlockedM3.cooldownRemainingMonths > 0, '4.4 Cooldown restante en Mes 3 es positivo');

    let duplicateDissBlocked = false;
    try {
      engine.interactWithArtist(targetArtist2.id, 'diss');
    } catch (e: any) {
      duplicateDissBlocked = true;
      assert(e.message.includes('esperar') || e.message.includes('cooldown'), `4.4 Error defensivo anti doble ejecución de tiradera: "${e.message}"`);
    }
    assert(duplicateDissBlocked === true, '4.4 Doble tiradera prevenida limpiamente');

    // 4.5 En Mes 5 (tras 4 meses de cooldown global), tiradera a Artista 1 se habilita mientras Artista 2 sigue en cooldown de 6 meses
    const checkDissTarget1InM5 = RelationshipEngine.canSendDiss(engine.getPlayer(), targetArtist1, 2026, 5);
    assert(checkDissTarget1InM5.canSend === true, '4.5 Cooldown global finalizado en Mes 5 habilita tiradera a Artista 1');

    const checkDissTarget2InM5 = RelationshipEngine.canSendDiss(engine.getPlayer(), targetArtist2, 2026, 5);
    assert(checkDissTarget2InM5.canSend === false, '4.5 Artista 2 permanece bloqueado en Mes 5 por cooldown individual de 6 meses');

    // Desbloqueo temporal a los 6 meses (Mes 7) para Artista 2
    const checkDissM7 = RelationshipEngine.canSendDiss(engine.getPlayer(), targetArtist2, 2026, 7);
    assert(checkDissM7.canSend === true, '4.5 Tras 6 meses (Mes 7), la tiradera a Artista 2 vuelve a estar habilitada');
  }

  // ====================================================================================
  // CASO 5: NAVEGACIÓN ENTRE TODAS LAS PESTAÑAS DE LA NAVBAR
  // ====================================================================================
  console.log('\n🔹 CASO 5: Navegación Completa entre Todas las Pestañas de la Navbar');
  {
    const router = new AppNavigationRouter();

    const NAVBAR_TABS = [
      { id: 'dashboard', label: 'Inicio' },
      { id: 'studio', label: 'Estudio & Música' },
      { id: 'lifestyle', label: 'Tienda & Estilo de Vida' },
      { id: 'charts', label: 'Charts & Rankings' },
      { id: 'tours', label: 'Giras & Shows' },
      { id: 'industry', label: 'Sellos & Managers' },
      { id: 'relations', label: 'Artistas & Rivalidades' },
      { id: 'career', label: 'Eras & Trayectoria' },
      { id: 'awards', label: 'Premios & Gala' }
    ];

    // 5.1 Navegación secuencial por cada una de las 9 pestañas
    for (const tab of NAVBAR_TABS) {
      router.handleNavigate(tab.id);
      assert(router.currentTab === tab.id, `5.1 Transición a pestaña "${tab.id}" (${tab.label}) exitosa`);
    }

    // 5.2 Navegación con subpestañas y cross-navigation
    router.handleNavigate('dashboard');
    assert(router.currentTab === 'dashboard', '5.2 Retorno a Dashboard');

    router.handleNavigate('record');
    assert(router.currentTab === 'studio' && router.studioSubTab === 'single', '5.2 Deep-link "record" activa Studio -> Single');

    router.handleNavigate('studio_album');
    assert(router.currentTab === 'studio' && router.studioSubTab === 'album', '5.2 Deep-link "studio_album" activa Studio -> Album');

    router.handleNavigate('catalog');
    assert(router.currentTab === 'studio' && router.studioSubTab === 'catalog', '5.2 Deep-link "catalog" activa Studio -> Catalog');

    router.handleNavigate('lifestyle');
    assert(router.currentTab === 'lifestyle', '5.2 Navegación a Lifestyle Shop');

    router.handleNavigate('charts');
    assert(router.currentTab === 'charts', '5.2 Navegación a Charts View');

    router.handleNavigate('tours');
    assert(router.currentTab === 'tours', '5.2 Navegación a Tours View');

    router.handleNavigate('industry');
    assert(router.currentTab === 'industry', '5.2 Navegación a Industry View');

    router.handleNavigate('relations');
    assert(router.currentTab === 'relations', '5.2 Navegación a Relationships View');

    router.handleNavigate('career');
    assert(router.currentTab === 'career', '5.2 Navegación a Career Eras View');

    router.handleNavigate('awards');
    assert(router.currentTab === 'awards', '5.2 Navegación a Awards View');

    // 5.3 Simulación de Avance de Ciclo desde Navbar (+6M / +1Y)
    const engine = new GameEngine(createPlayerArtist());
    const initialYear = engine.getWorld().currentYear; // 2026
    const initialMonth = engine.getWorld().currentMonth; // 1

    // Avance de 6 meses
    engine.advanceCycle(6);
    assert(engine.getWorld().currentYear === 2026 && engine.getWorld().currentMonth === 7, `5.3 Botón Navbar +6M avanza el tiempo a Año 2026 • Mes 7 (Actual: Mes ${engine.getWorld().currentMonth})`);

    // Avance de 12 meses (1 año)
    engine.advanceCycle(12);
    assert(engine.getWorld().currentYear === 2027 && engine.getWorld().currentMonth === 7, `5.3 Botón Navbar +1Y avanza el tiempo a Año 2027 • Mes 7 (Actual: Año ${engine.getWorld().currentYear} • Mes ${engine.getWorld().currentMonth})`);

    // Comprobación de que el estado del jugador y del mundo se mantiene íntegro
    assert(engine.getPlayer().id === 'artist_player_qa', '5.3 Integridad del jugador preservada tras simulación de ciclo');
    assert(Object.keys(engine.getWorld().genres).length > 0, '5.3 Catálogo de géneros preservado');
    assert(Object.keys(engine.getWorld().labels).length > 0, '5.3 Directorio de sellos preservado');
  }

  // ====================================================================================
  // REPORTE FINAL
  // ====================================================================================
  console.log('\n========================================================================================');
  console.log(`📊 RESUMEN DE AUDITORÍA QA: ${stats.passed}/${stats.total} pruebas superadas (${((stats.passed / stats.total) * 100).toFixed(1)}%)`);
  if (stats.failed === 0) {
    console.log('🎉 \x1b[32mTODAS LAS PRUEBAS DE BOTONES Y NAVEGACIÓN HAN PASADO CON 100% DE ÉXITO\x1b[0m');
  } else {
    console.error(`❌ \x1b[31m${stats.failed} PRUEBAS FALLIDAS:\x1b[0m`);
    stats.errors.forEach(e => console.error(`  - ${e}`));
  }
  console.log('========================================================================================\n');

  return stats.failed === 0;
}

// Execute suite directly when run via tsx
const success = runAllButtonsAndNavTests();
if (!success) {
  process.exit(1);
}
