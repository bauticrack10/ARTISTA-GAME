import { GameEngine } from './src/core/GameEngine';
import {
  WorldState,
  Artist,
  Song,
  Album,
  CareerStage,
  MusicRegion,
  ChartEntry,
  CollabFeasibilityResult
} from './src/types';
import {
  INITIAL_ARTISTS,
  getArtistsByCountry,
  getArtistsByRegion,
  getArtistsByGenre,
  getArtistsByStage,
  getAllCountries,
  getAllRegions
} from './src/data/initialArtists';
import { INITIAL_GENRES, SUBGENRE_DETAILS } from './src/data/genres';
import { INITIAL_LABELS } from './src/data/labels';
import { INITIAL_PRODUCERS, INITIAL_MANAGERS } from './src/data/producersAndManagers';
import { GLOBAL_COUNTRY_DATABASE, generateUniqueProceduralArtistName, isArtistNameColliding, normalizeTitle } from './src/data/proceduralNames';
import { RelationshipEngine } from './src/systems/RelationshipEngine';
import { ChartEngine } from './src/systems/ChartEngine';
import { WorldSimulation } from './src/systems/WorldSimulation';
import { TimeSystem } from './src/systems/TimeSystem';
import { StreamingEngine } from './src/systems/StreamingEngine';

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

export function runGlobalDatabaseAndDiversityTests(): boolean {
  console.log('\n========================================================================================');
  console.log('🌍 SUITE DE PRUEBAS QA & AUDITORÍA: BASE DE DATOS GLOBAL, DIVERSIDAD & ESCENAS (35+ PAÍSES)');
  console.log('========================================================================================\n');

  const allInitialArtists = Object.values(INITIAL_ARTISTS);

  // ============================================================================
  // CASO 1: DIVERSIDAD GEOGRÁFICA (MÍNIMO 35 PAÍSES REPRESENTADOS)
  // ============================================================================
  console.log('🔹 CASO 1: Diversidad Geográfica (Mínimo 35 países representados)');
  {
    const uniqueCountries = getAllCountries();
    const count = uniqueCountries.length;

    console.log(`   📍 Total de países únicos detectados en catálogo: ${count}`);
    console.log(`   📍 Países: ${uniqueCountries.join(', ')}`);

    assert(count >= 35, `Existen al menos 35 países representados en INITIAL_ARTISTS (Encontrados: ${count})`);

    // Verificar presencia de países clave en cada continente
    const keyCountries = [
      'Argentina', 'México', 'España', 'USA', 'Puerto Rico', 'Colombia', 'Chile', 'Uruguay',
      'Brasil', 'UK', 'Francia', 'Alemania', 'Italia', 'Suecia', 'Noruega', 'Irlanda',
      'Países Bajos', 'Bélgica', 'Corea del Sur', 'Japón', 'Australia', 'Nueva Zelanda',
      'Nigeria', 'Sudáfrica', 'India', 'República Dominicana', 'Perú', 'Cuba', 'Venezuela',
      'Ecuador', 'Portugal', 'Ghana', 'Jamaica', 'Egipto', 'Marruecos', 'Filipinas', 'Indonesia',
      'Turquía', 'Polonia'
    ];

    let foundKeyCountriesCount = 0;
    keyCountries.forEach(country => {
      const artists = getArtistsByCountry(country);
      if (artists.length > 0) foundKeyCountriesCount++;
    });

    assert(
      foundKeyCountriesCount >= 35,
      `Al menos 35 países clave tienen artistas activos modelados (Encontrados: ${foundKeyCountriesCount}/${keyCountries.length})`
    );

    // Validar GLOBAL_COUNTRY_DATABASE
    assert(
      GLOBAL_COUNTRY_DATABASE.length >= 35,
      `GLOBAL_COUNTRY_DATABASE contiene al menos 35 países para simulación procedural (Total: ${GLOBAL_COUNTRY_DATABASE.length})`
    );

    // Verificar que cada país en GLOBAL_COUNTRY_DATABASE tenga ciudades, código y géneros típicos
    const validGlobalDB = GLOBAL_COUNTRY_DATABASE.every(c =>
      c.country &&
      c.countryCode &&
      c.cities.length > 0 &&
      c.language &&
      c.influenceRegions.length > 0 &&
      c.typicalGenres.length > 0
    );
    assert(validGlobalDB, 'El 100% de los países en GLOBAL_COUNTRY_DATABASE tienen ciudades, códigos ISO, idioma y géneros válidos');
  }

  // ============================================================================
  // CASO 2: DIVERSIDAD DE NIVELES DE FAMA Y TIERING
  // ============================================================================
  console.log('\n🔹 CASO 2: Diversidad de Niveles de Fama y Escalamiento de Carrera');
  {
    const stagesFound = new Set<CareerStage>();
    allInitialArtists.forEach(a => stagesFound.add(a.careerStage));

    console.log(`   🌟 Fases de carrera presentes en el catálogo: ${Array.from(stagesFound).join(', ')}`);

    assert(stagesFound.has('Superstar'), 'Catálogo contiene Superestrellas mundiales');
    assert(stagesFound.has('Legend'), 'Catálogo contiene Leyendas históricas');
    assert(stagesFound.has('Established') || stagesFound.has('Mainstream'), 'Catálogo contiene artistas Consagrados / Mainstream');

    // Validar correlación de oyentes mensuales y stats por nivel de fama
    const superstars = allInitialArtists.filter(a => a.careerStage === 'Superstar');
    const legends = allInitialArtists.filter(a => a.careerStage === 'Legend');

    const superstarsValid = superstars.every(a =>
      a.stats.popularity >= 75 &&
      a.stats.monthlyListeners >= 5000000 &&
      a.stats.totalStreams >= 1000000000
    );
    assert(superstarsValid, `El 100% de las Superestrellas (${superstars.length}) tienen stats coherentes (Pop >= 75, >5M oyentes, >1B streams)`);

    const legendsValid = legends.every(a =>
      a.legacyScore >= 80 &&
      a.stats.reputation >= 85 &&
      a.stats.artisticCredibility >= 85
    );
    assert(legendsValid, `El 100% de las Leyendas (${legends.length}) tienen LegacyScore >= 80 y Reputación/Credibilidad de élite`);
  }

  // ============================================================================
  // CASO 3: DIVERSIDAD DE GÉNEROS Y SUBGÉNEROS
  // ============================================================================
  console.log('\n🔹 CASO 3: Diversidad de Géneros Musicales (Amplitud más allá del Trap/Rap)');
  {
    const genresInCatalog = new Set<string>();
    allInitialArtists.forEach(a => {
      genresInCatalog.add(a.mainGenreId);
      a.subGenreIds?.forEach(sg => genresInCatalog.add(sg));
    });

    const expectedMainGenres = [
      'trap_latino',
      'reggaeton',
      'hip_hop_rap',
      'pop_moderno',
      'r_and_b_soul',
      'rock_alternativo',
      'musica_electronica',
      'drill',
      'afrobeat_dancehall',
      'corridos_urbanos',
      'kpop_jpop',
      'cumbia_tropical',
      'metal_punk',
      'country_folk',
      'jazz_bossa',
      'funk_brasilero'
    ];

    let coveredGenresCount = 0;
    expectedMainGenres.forEach(genreId => {
      const matchingArtists = getArtistsByGenre(genreId);
      if (matchingArtists.length > 0) {
        coveredGenresCount++;
      }
    });

    console.log(`   🎵 Géneros principales cubiertos con artistas activos: ${coveredGenresCount}/${expectedMainGenres.length}`);
    assert(
      coveredGenresCount >= 14,
      `Al menos 14 géneros musicales mayores están representados en el catálogo (Cubiertos: ${coveredGenresCount})`
    );

    // Verificar géneros no urbanos explícitos
    assert(getArtistsByGenre('kpop_jpop').length >= 3, 'K-Pop & J-Pop cuenta con al menos 3 artistas líderes (BTS, BLACKPINK, YOASOBI, etc.)');
    assert(getArtistsByGenre('afrobeat_dancehall').length >= 3, 'Afrobeats & Dancehall cuenta con al menos 3 artistas líderes (Burna Boy, Wizkid, Tyla, etc.)');
    assert(getArtistsByGenre('funk_brasilero').length >= 3, 'Funk Brasileño cuenta con al menos 3 artistas líderes (Anitta, Ludmilla, Kevinho, etc.)');
    assert(getArtistsByGenre('metal_punk').length >= 2, 'Metal & Punk cuenta con artistas icónicos (AC/DC, Sepultura, etc.)');
    assert(getArtistsByGenre('jazz_bossa').length >= 2, 'Jazz & Bossa Nova / MPB cuenta con leyendas (Caetano Veloso, Gilberto Gil, etc.)');
    assert(getArtistsByGenre('corridos_urbanos').length >= 1, 'Corridos Tumbados cuenta con exponentes de vanguardia');
    assert(getArtistsByGenre('musica_electronica').length >= 3, 'Electrónica cuenta con productores globales (Bizarrap, Vintage Culture, Flume, Peggy Gou, etc.)');
  }

  // ============================================================================
  // CASO 4: INTEGRIDAD DE DATOS, CERO DUPLICADOS Y CONSISTENCIA
  // ============================================================================
  console.log('\n🔹 CASO 4: Integridad de Datos, Cero Duplicados y Atributos Completos');
  {
    const idSet = new Set<string>();
    const nameSet = new Set<string>();
    let duplicateIds: string[] = [];
    let duplicateNames: string[] = [];
    let invalidStatsArtists: string[] = [];
    let missingAvatarArtists: string[] = [];
    let missingRealNames: string[] = [];

    allInitialArtists.forEach(artist => {
      // 1. Chequeo de IDs
      if (idSet.has(artist.id)) {
        duplicateIds.push(artist.id);
      } else {
        idSet.add(artist.id);
      }

      // 2. Chequeo de nombres artísticos
      const normName = normalizeTitle(artist.name);
      if (nameSet.has(normName)) {
        duplicateNames.push(artist.name);
      } else {
        nameSet.add(normName);
      }

      // 3. Chequeo de nombre real
      if (!artist.realName || artist.realName.trim().length === 0) {
        missingRealNames.push(artist.name);
      }

      // 4. Chequeo de avatarColor y avatarIcon
      if (!artist.avatarColor || !artist.avatarIcon) {
        missingAvatarArtists.push(artist.name);
      }

      // 5. Chequeo de stats numéricas
      const s = artist.stats;
      const p = artist.personality;
      const hasNaN =
        isNaN(s.popularity) || isNaN(s.reputation) || isNaN(s.artisticCredibility) ||
        isNaN(s.energy) || isNaN(s.monthlyListeners) || isNaN(s.totalStreams) ||
        isNaN(s.funds) || isNaN(s.fansCount) || isNaN(s.fanbaseLoyalty) || isNaN(s.hype) ||
        isNaN(p.creativity) || isNaN(p.ambition) || isNaN(p.discipline) || isNaN(p.charisma) ||
        isNaN(p.skill) || isNaN(p.commercialAppeal) || isNaN(p.originality) ||
        isNaN(p.riskTolerance) || isNaN(p.sociability) || isNaN(p.independence);

      if (hasNaN) {
        invalidStatsArtists.push(artist.name);
      }
    });

    assert(duplicateIds.length === 0, `Cero IDs duplicados en el 100% de artistas iniciales (Duplicados: ${duplicateIds.length})`);
    assert(duplicateNames.length === 0, `Cero nombres artísticos duplicados (Duplicados: ${duplicateNames.length})`);
    assert(missingRealNames.length === 0, `El 100% de los artistas tienen realName documentado (Faltantes: ${missingRealNames.length})`);
    assert(missingAvatarArtists.length === 0, `El 100% de los artistas tienen avatarColor y avatarIcon asignados (Faltantes: ${missingAvatarArtists.length})`);
    assert(invalidStatsArtists.length === 0, `El 100% de los artistas tienen estadísticas y personalidad válidas sin NaN (Inválidos: ${invalidStatsArtists.length})`);
  }

  // ============================================================================
  // CASO 5: ADAPTACIÓN DE LA ESCENA AL PAÍS DE INICIO DEL JUGADOR
  // ============================================================================
  console.log('\n🔹 CASO 5: Adaptación de la Escena al País de Inicio del Jugador');
  {
    const startCountries = [
      { country: 'Argentina', code: 'AR', region: 'Argentina' as MusicRegion, sampleArtist: 'Duki' },
      { country: 'México', code: 'MX', region: 'Mexico' as MusicRegion, sampleArtist: 'Peso Pluma' },
      { country: 'España', code: 'ES', region: 'Spain' as MusicRegion, sampleArtist: 'Rosalía' },
      { country: 'USA', code: 'US', region: 'USA' as MusicRegion, sampleArtist: 'Taylor Swift' },
      { country: 'Corea del Sur', code: 'KR', region: 'Asia' as MusicRegion, sampleArtist: 'BTS' },
      { country: 'Nigeria', code: 'NG', region: 'Africa' as MusicRegion, sampleArtist: 'Burna Boy' }
    ];

    startCountries.forEach(({ country, code, region, sampleArtist }) => {
      const engine = new GameEngine({
        country,
        countryCode: code,
        city: 'Capital'
      });

      const player = engine.getPlayer();
      assert(player.country === country, `Jugador creado en ${country} con countryCode ${code}`);

      // Obtener artistas de la escena local
      const localArtists = getArtistsByCountry(country);
      assert(localArtists.length > 0, `Escena de ${country} cuenta con ${localArtists.length} artista(s) nativos`);

      const hasSample = localArtists.some(a => a.name.includes(sampleArtist));
      assert(hasSample, `La escena de ${country} incluye a su exponente representativo (${sampleArtist})`);

      // Probar consulta regional
      const regionalArtists = getArtistsByRegion(region);
      assert(regionalArtists.length >= localArtists.length, `La región ${region} engloba a los artistas de ${country}`);
    });
  }

  // ============================================================================
  // CASO 6: DIFERENCIACIÓN DE CHARTS REGIONALES (11 REGIONES)
  // ============================================================================
  console.log('\n🔹 CASO 6: Diferenciación de Charts Regionales y Ventajas de Rotación Local');
  {
    const engine = new GameEngine();
    const world = engine.getWorld();

    // Crear catálogo de canciones de prueba para artistas nativos de diversos países
    const dukiSong: Song = {
      id: 'song_duki_goteo',
      title: 'Goteo Trap Hit',
      artistId: 'artist_duki',
      featuredArtistIds: [],
      genreId: 'trap_latino',
      subGenreIds: ['drill_latino'],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 92,
      commercialAppeal: 95,
      originality: 90,
      hypeAtRelease: 90,
      streamsTotal: 1000000,
      streamsLastMonth: 500000,
      monthlyStreamsHistory: [500000],
      peakPosition: { Global: 10, Argentina: 1, LatinAmerica: 3, USA: null, Europe: null, Spain: 5, Mexico: 8, UK: null, Brazil: null, Asia: null, Africa: null },
      weeksOnChart: { Global: 4, Argentina: 4, LatinAmerica: 4, USA: 0, Europe: 0, Spain: 4, Mexico: 4, UK: 0, Brazil: 0, Asia: 0, Africa: 0 },
      longevityCurve: 'instant_classic',
      isSingle: true,
      receptionRating: 95
    };

    const burnaSong: Song = {
      id: 'song_burna_city_boys',
      title: 'City Boys Afro Anthem',
      artistId: 'artist_burna_boy',
      featuredArtistIds: [],
      genreId: 'afrobeat_dancehall',
      subGenreIds: ['afrobeat_nigeriano'],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 94,
      commercialAppeal: 96,
      originality: 95,
      hypeAtRelease: 92,
      streamsTotal: 1200000,
      streamsLastMonth: 500000,
      monthlyStreamsHistory: [500000],
      peakPosition: { Global: 8, Argentina: null, LatinAmerica: null, USA: 20, Europe: 15, Spain: null, Mexico: null, UK: 3, Brazil: null, Asia: null, Africa: 1 },
      weeksOnChart: { Global: 4, Argentina: 0, LatinAmerica: 0, USA: 4, Europe: 4, Spain: 0, Mexico: 0, UK: 4, Brazil: 0, Asia: 0, Africa: 4 },
      longevityCurve: 'instant_classic',
      isSingle: true,
      receptionRating: 96
    };

    const rosaliaSong: Song = {
      id: 'song_rosalia_despecha',
      title: 'DESPECHÁ Summer Hit',
      artistId: 'artist_rosalia',
      featuredArtistIds: [],
      genreId: 'pop_moderno',
      subGenreIds: ['mambo_urbano'],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 96,
      commercialAppeal: 99,
      originality: 95,
      hypeAtRelease: 96,
      streamsTotal: 1500000,
      streamsLastMonth: 500000,
      monthlyStreamsHistory: [500000],
      peakPosition: { Global: 5, Argentina: 4, LatinAmerica: 2, USA: 15, Europe: 4, Spain: 1, Mexico: 3, UK: 25, Brazil: null, Asia: null, Africa: null },
      weeksOnChart: { Global: 4, Argentina: 4, LatinAmerica: 4, USA: 4, Europe: 4, Spain: 4, Mexico: 4, UK: 4, Brazil: 0, Asia: 0, Africa: 0 },
      longevityCurve: 'instant_classic',
      isSingle: true,
      receptionRating: 98
    };

    const btsSong: Song = {
      id: 'song_bts_dynamite',
      title: 'Dynamite K-Pop Smash',
      artistId: 'artist_bts',
      featuredArtistIds: [],
      genreId: 'kpop_jpop',
      subGenreIds: ['dance_pop'],
      releaseYear: 2026,
      releaseMonth: 1,
      quality: 95,
      commercialAppeal: 99,
      originality: 92,
      hypeAtRelease: 98,
      streamsTotal: 2000000,
      streamsLastMonth: 500000,
      monthlyStreamsHistory: [500000],
      peakPosition: { Global: 1, Argentina: null, LatinAmerica: null, USA: 1, Europe: 5, Spain: null, Mexico: null, UK: 2, Brazil: null, Asia: 1, Africa: null },
      weeksOnChart: { Global: 4, Argentina: 0, LatinAmerica: 0, USA: 4, Europe: 4, Spain: 0, Mexico: 0, UK: 4, Brazil: 0, Asia: 4, Africa: 0 },
      longevityCurve: 'instant_classic',
      isSingle: true,
      receptionRating: 99
    };

    const allSongs = {
      [dukiSong.id]: dukiSong,
      [burnaSong.id]: burnaSong,
      [rosaliaSong.id]: rosaliaSong,
      [btsSong.id]: btsSong
    };

    const { updatedCharts } = ChartEngine.calculateRegionalCharts(world, allSongs, INITIAL_ARTISTS);

    // 1. En Argentina, Duki (multiplicador 2.4x) debe superar a Burna Boy y BTS
    const argEntries = updatedCharts.Argentina.entries;
    const dukiRankArg = argEntries.find(e => e.songId === dukiSong.id)?.rank;
    assert(dukiRankArg === 1, `En Chart Argentina, Duki alcanza el puesto #1 gracias al boost territorial (Rank: #${dukiRankArg})`);

    // 2. En África, Burna Boy (multiplicador 2.4x) debe liderar
    const afrEntries = updatedCharts.Africa.entries;
    const burnaRankAfr = afrEntries.find(e => e.songId === burnaSong.id)?.rank;
    assert(burnaRankAfr === 1, `En Chart África, Burna Boy alcanza el puesto #1 por rotación continental (Rank: #${burnaRankAfr})`);

    // 3. En España, Rosalía (multiplicador 2.2x) debe liderar
    const espEntries = updatedCharts.Spain.entries;
    const rosaliaRankEsp = espEntries.find(e => e.songId === rosaliaSong.id)?.rank;
    assert(rosaliaRankEsp === 1, `En Chart España, Rosalía alcanza el puesto #1 por rotación local (Rank: #${rosaliaRankEsp})`);

    // 4. En Asia, BTS (multiplicador 2.3x) debe liderar
    const asiaEntries = updatedCharts.Asia.entries;
    const btsRankAsia = asiaEntries.find(e => e.songId === btsSong.id)?.rank;
    assert(btsRankAsia === 1, `En Chart Asia, BTS alcanza el puesto #1 por rotación regional (Rank: #${btsRankAsia})`);

    // 5. Verificar integridad de los 11 charts (sin huecos ni duplicados)
    const regions = getAllRegions();
    regions.forEach(r => {
      const chart = updatedCharts[r];
      assert(Boolean(chart), `Chart para la región "${r}" generado correctamente`);
      const seenRanks = new Set<number>();
      let hasDuplicateRanks = false;
      chart.entries.forEach(e => {
        if (seenRanks.has(e.rank)) hasDuplicateRanks = true;
        seenRanks.add(e.rank);
      });
      assert(!hasDuplicateRanks, `Chart "${r}" no contiene rangos duplicados`);
    });
  }

  // ============================================================================
  // CASO 7: REGLAS DE COLABORACIÓN GEOGRÁFICA Y BARRERAS DE SUPERESTRELLA
  // ============================================================================
  console.log('\n🔹 CASO 7: Reglas de Colaboración Geográfica y Barreras de Superestrella');
  {
    const playerUnderground: Artist = {
      id: 'artist_player_ug',
      name: 'Underground MC',
      realName: 'Juan Pérez',
      isPlayer: true,
      country: 'Argentina',
      city: 'Buenos Aires',
      countryCode: 'AR',
      language: 'es',
      influenceRegions: ['Argentina', 'LatinAmerica'],
      birthYear: 2008,
      careerStartYear: 2026,
      mainGenreId: 'trap_latino',
      subGenreIds: ['sub_trap_underground'],
      personality: { creativity: 80, ambition: 80, discipline: 80, charisma: 80, skill: 80, commercialAppeal: 70, originality: 80, riskTolerance: 80, sociability: 80, independence: 80 },
      stats: { popularity: 15, reputation: 25, artisticCredibility: 40, energy: 100, monthlyListeners: 500, totalStreams: 2000, funds: 0, fansCount: 200, fanbaseLoyalty: 60, hype: 30 },
      careerStage: 'Underground',
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [],
      awardsWon: [],
      legacyScore: 5,
      isRetired: false,
      historicalNotes: [],
      generationIndex: 1,
      influences: []
    };

    const taylorSwift = INITIAL_ARTISTS['artist_taylor_swift'];
    const duki = INITIAL_ARTISTS['artist_duki'];
    const rosalia = INITIAL_ARTISTS['artist_rosalia'];
    const bts = INITIAL_ARTISTS['artist_bts'];

    // 7.1 Evaluación de afinidad geográfica / idiomática
    const proxSameCountry = RelationshipEngine.evaluateGeographicAndLanguageProximity(playerUnderground, duki);
    assert(proxSameCountry.isSameCountry === true && proxSameCountry.geoScore === 15, 'Mismo país (Argentina) otorga +15 de afinidad territorial y +2 de química');

    const proxSameLang = RelationshipEngine.evaluateGeographicAndLanguageProximity(playerUnderground, rosalia);
    assert(proxSameLang.isSameCountry === false && proxSameLang.sharesLanguageOrRegion === true && proxSameLang.geoScore === 10, 'Mismo idioma / esfera cultural (Español) otorga +10 de afinidad regional');

    const proxForeign = RelationshipEngine.evaluateGeographicAndLanguageProximity(playerUnderground, bts);
    assert(proxForeign.isDistantForeign === true && proxForeign.geoScore === -10, 'País distante sin idioma común otorga penalización de -10');

    // 7.2 Intento de colaboración de artista Underground con Taylor Swift ($0 presupuesto) -> RECHAZO REALISTA
    const featTaylorNoBudget = RelationshipEngine.calculateCollabFeasibility(
      playerUnderground,
      taylorSwift,
      'single_feat',
      0,
      'player_feat_target'
    );
    assert(featTaylorNoBudget.willAccept === false, 'Taylor Swift rechaza al artista Underground con $0 de presupuesto');
    assert(featTaylorNoBudget.reason.includes('superestrella global'), 'El motivo de rechazo explicita la barrera de estatus de superestrella');

    // 7.3 Intento con presupuesto adecuado (>= $35,000) -> La barrera de estatus de superestrella se desbloquea
    const featTaylorHighBudget = RelationshipEngine.calculateCollabFeasibility(
      playerUnderground,
      taylorSwift,
      'single_feat',
      40000,
      'target_feat_player'
    );
    // Con $40k la barrera no retorna rechazo tajante inmediato
    assert(featTaylorHighBudget.acceptanceProbability > featTaylorNoBudget.acceptanceProbability, `Presupuesto de $40.000 incrementa la probabilidad de aceptación (${featTaylorHighBudget.acceptanceProbability}% vs ${featTaylorNoBudget.acceptanceProbability}%)`);

    // 7.4 Colaboración entre colegas del mismo país y género (Underground con presupuesto moderado a artista local afín)
    const localPartner: Artist = {
      id: 'artist_local_colleague',
      name: 'Trapper Amigo',
      realName: 'Carlos Trap',
      isPlayer: false,
      country: 'Argentina',
      city: 'Buenos Aires',
      countryCode: 'AR',
      language: 'es',
      birthYear: 2005,
      careerStartYear: 2025,
      mainGenreId: 'trap_latino',
      subGenreIds: [],
      personality: { creativity: 75, ambition: 75, discipline: 75, charisma: 75, skill: 75, commercialAppeal: 75, originality: 75, riskTolerance: 75, sociability: 85, independence: 80 },
      stats: { popularity: 25, reputation: 35, artisticCredibility: 45, energy: 100, monthlyListeners: 15000, totalStreams: 60000, funds: 8000, fansCount: 5000, fanbaseLoyalty: 70, hype: 40 },
      careerStage: 'Emerging',
      labelId: null,
      managerId: null,
      relationships: {},
      eras: [],
      awardsWon: [],
      legacyScore: 10,
      isRetired: false,
      historicalNotes: [],
      generationIndex: 1,
      influences: []
    };

    const featLocal = RelationshipEngine.calculateCollabFeasibility(
      playerUnderground,
      localPartner,
      'single_feat',
      2000,
      'player_and_target'
    );
    assert(featLocal.willAccept === true, 'Colega local de escena emergente acepta la colaboración gracias a la afinidad territorial');
    assert(featLocal.chemistryScore >= 12, `Química musical sólida (${featLocal.chemistryScore}/25)`);
  }

  // ============================================================================
  // CASO 8: LONGEVIDAD Y SPAWNING GLOBAL (20, 50 Y 100 AÑOS)
  // ============================================================================
  console.log('\n🔹 CASO 8: Longevidad y Spawning Procedural Global (Simulación 20, 50 y 100 Años)');
  {
    const engine = new GameEngine();
    const world = engine.getWorld();
    const initialArtistsCount = Object.keys(world.artists).length;

    console.log(`   ⏳ Iniciando simulación procedural acelerada (Estado inicial: ${initialArtistsCount} artistas)...`);

    // Simular 240 meses (20 años)
    const spawnedArtists20Years: Artist[] = [];
    for (let month = 1; month <= 240; month++) {
      const simResult = WorldSimulation.simulateMonth(world);
      spawnedArtists20Years.push(...simResult.newArtistsSpawned);
      TimeSystem.advanceWorldDate(world);
    }

    console.log(`   📅 Año alcanzado tras 20 años: ${world.currentYear} (Artistas generados: ${spawnedArtists20Years.length})`);
    assert(world.currentYear === 2046, `Año actual tras 20 años es 2046 (Actual: ${world.currentYear})`);
    assert(spawnedArtists20Years.length > 0, `Se spawnaron nuevos artistas generacionales (${spawnedArtists20Years.length})`);

    // Comprobar diversidad geográfica en los artistas spawnados
    const spawnedCountries = new Set<string>();
    spawnedArtists20Years.forEach(a => spawnedCountries.add(a.country));
    console.log(`   🌍 Países de origen en artistas spawnados (20 años): ${spawnedCountries.size} países`);
    assert(spawnedCountries.size >= 10, `Spawning procedural cubrió al menos 10 países distintos en 20 años (Cubiertos: ${spawnedCountries.size})`);

    // Verificar cero colisiones con artistas iniciales
    let nameCollisionsCount = 0;
    spawnedArtists20Years.forEach(spawned => {
      const isColliding = isArtistNameColliding(spawned.name, spawned.realName, INITIAL_ARTISTS);
      if (isColliding) nameCollisionsCount++;
    });
    assert(nameCollisionsCount === 0, `Cero colisiones de nombres de artistas procedurales con INITIAL_ARTISTS (Colisiones: ${nameCollisionsCount})`);

    // Verificar integridad de artistas spawnados
    const allSpawnedValid = spawnedArtists20Years.every(a =>
      a.id &&
      a.name &&
      a.realName &&
      a.country &&
      a.city &&
      a.avatarColor &&
      a.avatarIcon &&
      !isNaN(a.stats.popularity) &&
      !isNaN(a.stats.funds) &&
      !isNaN(a.personality.creativity)
    );
    assert(allSpawnedValid, 'El 100% de los artistas spawnados tienen ID, nombre real, país, ciudad, avatarColor, avatarIcon y estadísticas válidas');

    // Continuar hasta 600 meses (50 años)
    console.log('   ⏳ Avanzando hasta 50 años (Año 2076)...');
    for (let month = 241; month <= 600; month++) {
      WorldSimulation.simulateMonth(world);
      TimeSystem.advanceWorldDate(world);
    }
    assert(world.currentYear === 2076, `Año actual tras 50 años es 2076 (Actual: ${world.currentYear})`);

    // Continuar hasta 1200 meses (100 años)
    console.log('   ⏳ Avanzando hasta 100 años (Año 2126)...');
    for (let month = 601; month <= 1200; month++) {
      WorldSimulation.simulateMonth(world);
      TimeSystem.advanceWorldDate(world);
    }
    assert(world.currentYear === 2126, `Año actual tras 100 años es 2126 (Actual: ${world.currentYear})`);

    // Validar estado final del mundo tras 100 años de simulación continua
    assert(Object.keys(world.artists).length > 0, 'El ecosistema de artistas sigue activo tras 100 años');
    assert(world.charts !== undefined, 'Los charts regionales continúan operando');
    assert(world.news !== undefined && world.news.length > 0, 'El archivo histórico de noticias se mantiene intacto');
    assert(world.globalHistoryTimeline.length > 0, 'La línea de tiempo global registra la historia secular');
  }

  // ============================================================================
  // RESUMEN Y BALANCE FINAL
  // ============================================================================
  console.log('\n===============================================================');
  console.log('📊 RESUMEN FINAL DE LA SUITE DE DIVERSIDAD Y BASE DE DATOS GLOBAL');
  console.log('===============================================================');
  console.log(`Total de pruebas ejecutadas: ${stats.total}`);
  console.log(`  \x1b[32m✔ Pruebas superadas:\x1b[0m ${stats.passed}`);
  console.log(`  \x1b[31m✘ Pruebas fallidas:\x1b[0m  ${stats.failed}`);

  if (stats.failed > 0) {
    console.log('\nDetalle de errores detectados:');
    stats.errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. \x1b[31m${err}\x1b[0m`);
    });
    return false;
  } else {
    console.log('\n\x1b[32m🎉 ¡AUDITORÍA SUPERADA CON ÉXITO! Todos los casos de diversidad global, integridad de catálogo y longevidad están al 100%.\x1b[0m\n');
    return true;
  }
}

// Ejecución directa si se invoca con tsx
const success = runGlobalDatabaseAndDiversityTests();
process.exit(success ? 0 : 1);
