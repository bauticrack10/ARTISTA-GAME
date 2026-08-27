import { IndustryEngine } from './src/systems/IndustryEngine';
import { EconomyEngine } from './src/systems/EconomyEngine';
import { GameEngine } from './src/core/GameEngine';
import { WorldState, Artist, RecordLabel, LabelContract } from './src/types';
import { INITIAL_ARTISTS } from './src/data/initialArtists';
import { INITIAL_GENRES } from './src/data/genres';
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

function createBaseWorld(): WorldState {
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
    news: [],
    socialFeed: [],
    ecosystemContacts: {},
    activeBeefs: {},
    records: [],
    globalHistoryTimeline: [],
    recentEventIdsHistory: [],
    activeNarrativeChains: {},
    financialLedger: []
  };
}

function createTestArtist(overrides: Partial<Artist> = {}): Artist {
  return {
    id: overrides.id || `artist_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: overrides.name || 'Artista Test QA',
    isPlayer: overrides.isPlayer !== undefined ? overrides.isPlayer : true,
    country: overrides.country || 'Argentina',
    city: overrides.city || 'Buenos Aires',
    birthYear: overrides.birthYear || 2006,
    careerStartYear: overrides.careerStartYear || 2026,
    mainGenreId: overrides.mainGenreId || 'trap_latino',
    subGenreIds: overrides.subGenreIds || [],
    personality: overrides.personality || {
      creativity: 80, ambition: 80, discipline: 80, charisma: 80, skill: 80,
      commercialAppeal: 80, originality: 80, riskTolerance: 80, sociability: 80, independence: 80
    },
    stats: overrides.stats || {
      popularity: 5, reputation: 10, artisticCredibility: 15, energy: 100,
      monthlyListeners: 0, totalStreams: 0, funds: 0, fansCount: 0,
      fanbaseLoyalty: 50, hype: 10
    },
    careerStage: overrides.careerStage || 'Underground',
    labelId: overrides.labelId !== undefined ? overrides.labelId : null,
    managerId: overrides.managerId !== undefined ? overrides.managerId : null,
    activeContract: overrides.activeContract || null,
    relationships: overrides.relationships || {},
    eras: overrides.eras || [],
    awardsWon: overrides.awardsWon || [],
    legacyScore: overrides.legacyScore || 5,
    isRetired: false,
    historicalNotes: overrides.historicalNotes || [],
    generationIndex: 1,
    influences: [],
    financialLedger: overrides.financialLedger || []
  };
}

function runAllIndustryTests() {
  console.log('\n======================================================================');
  console.log('🧪 SUITE DE PRUEBAS QA & AUDITORÍA: CONTRATOS, DISTRIBUCIÓN & ECONOMÍA');
  console.log('======================================================================\n');

  // -------------------------------------------------------------
  // CASO 1: Artista día 1 (0 oyentes, $0) -> SoundDrop Free ($0 cuota, 85% regalías artista, 15% comisión)
  // -------------------------------------------------------------
  console.log('🔹 CASO 1: Artista Día 1 (0 oyentes, $0 fondos) -> SoundDrop Free');
  {
    const world = createBaseWorld();
    const artist = createTestArtist({
      id: 'player_day_1',
      name: 'Novato Día Uno',
      stats: {
        popularity: 0, reputation: 5, artisticCredibility: 10, energy: 100,
        monthlyListeners: 0, totalStreams: 0, funds: 0, fansCount: 0,
        fanbaseLoyalty: 50, hype: 5
      },
      labelId: null,
      activeContract: null
    });
    world.artists[artist.id] = artist;

    const sounddrop = world.labels['distro_sounddrop_free'];
    const distrowave = world.labels['distro_distrowave_pro'];
    const callejon = world.labels['label_callejon_records'];
    const bohemian = world.labels['label_bohemian_groove_local'];
    const majors = [world.labels['label_sony_columbia'], world.labels['label_universal_interscope'], world.labels['label_warner_latam']];

    // 1. Verificación de metadata de SoundDrop Free
    assert(Boolean(sounddrop), 'SoundDrop Free existe en world.labels');
    assert(sounddrop.annualFee === 0, 'SoundDrop Free tiene cuota anual de $0');
    assert(sounddrop.commissionPct === 15, 'SoundDrop Free tiene 15% de comisión (85% para el artista)');
    assert(sounddrop.minMonthlyListeners === 0, 'SoundDrop Free requiere 0 oyentes mensuales');

    // 2. Validación de elegibilidad para SoundDrop Free
    const checkSoundDrop = IndustryEngine.canSignDeal(artist, sounddrop);
    assert(checkSoundDrop.canSign === true, 'Artista día 1 (0 oyentes, $0) PUEDE firmar con SoundDrop Free');
    assert(checkSoundDrop.missingReasons.length === 0, 'No debe haber impedimentos para SoundDrop Free');

    // 3. Verificación de bloqueos en otras opciones
    const checkDistroWave = IndustryEngine.canSignDeal(artist, distrowave);
    assert(checkDistroWave.canSign === false, 'Artista con $0 NO puede firmar con DistroWave Pro (requiere $20)');
    assert(checkDistroWave.missingReasons.some(r => r.includes('$20') || r.includes('cuota')), 'Debe especificar falta de fondos para cuota');

    const checkCallejon = IndustryEngine.canSignDeal(artist, callejon);
    assert(checkCallejon.canSign === false, 'Artista con 0 oyentes NO puede firmar con Callejón Records (requiere 5.000 oyentes)');

    const checkBohemian = IndustryEngine.canSignDeal(artist, bohemian);
    assert(checkBohemian.canSign === false, 'Artista con 0 oyentes NO puede firmar con Bohemian Groove (requiere 12.000 oyentes)');

    for (const major of majors) {
      const checkMajor = IndustryEngine.canSignDeal(artist, major);
      assert(checkMajor.canSign === false, `Artista con 0 oyentes NO puede firmar con Major ${major.name}`);
    }

    // 4. Firma de acuerdo con SoundDrop Free
    const initialFunds = artist.stats.funds;
    const signResult = IndustryEngine.signDeal(artist, sounddrop, world);

    assert(signResult.success === true, 'Firma exitosa con SoundDrop Free');
    assert(artist.labelId === 'distro_sounddrop_free', 'artist.labelId se actualiza a distro_sounddrop_free');
    assert(Boolean(artist.activeContract), 'artist.activeContract está definido');
    assert(artist.activeContract?.royaltyPercentage === 85, 'artist.activeContract tiene exactamente 85% de regalías');
    assert(artist.activeContract?.annualFee === 0, 'artist.activeContract tiene annualFee = 0');
    assert(artist.activeContract?.signingBonus === 0, 'artist.activeContract tiene signingBonus = 0');
    assert(artist.activeContract?.isDistributor === true, 'artist.activeContract.isDistributor es true');
    assert(artist.stats.funds === initialFunds, 'Fondos del artista se mantienen en $0 (sin cobros indebidos)');
    assert(sounddrop.rosterArtistIds.includes(artist.id), 'SoundDrop Free incluye al artista en su roster');
    assert(world.news.some(n => n.relatedArtistIds.includes(artist.id) && n.headline.includes('SoundDrop Free')), 'Se genera noticia de distribución');
  }

  // -------------------------------------------------------------
  // CASO 2: Artista con $20 y 0 oyentes -> DistroWave Pro ($20 cuota, 100% regalías)
  // -------------------------------------------------------------
  console.log('\n🔹 CASO 2: Artista con $20 y 0 oyentes -> DistroWave Pro ($20 cuota, 100% regalías)');
  {
    const world = createBaseWorld();
    const artist = createTestArtist({
      id: 'player_case_2',
      name: 'Artista Con Veinte Dolares',
      stats: {
        popularity: 2, reputation: 10, artisticCredibility: 15, energy: 100,
        monthlyListeners: 0, totalStreams: 0, funds: 20, fansCount: 0,
        fanbaseLoyalty: 50, hype: 10
      },
      labelId: null,
      activeContract: null
    });
    world.artists[artist.id] = artist;

    const distrowave = world.labels['distro_distrowave_pro'];

    // 1. Verificación de metadata de DistroWave Pro
    assert(Boolean(distrowave), 'DistroWave Pro existe en world.labels');
    assert(distrowave.annualFee === 20, 'DistroWave Pro tiene cuota anual de $20');
    assert(distrowave.commissionPct === 0, 'DistroWave Pro tiene 0% comisión (100% regalías para el artista)');
    assert(distrowave.minMonthlyListeners === 0, 'DistroWave Pro requiere 0 oyentes');

    // 2. Validación de elegibilidad
    const checkDistroWave = IndustryEngine.canSignDeal(artist, distrowave);
    assert(checkDistroWave.canSign === true, 'Artista con $20 y 0 oyentes PUEDE firmar con DistroWave Pro');

    // 3. Firma de acuerdo
    const signResult = IndustryEngine.signDeal(artist, distrowave, world);
    assert(signResult.success === true, 'Firma exitosa con DistroWave Pro');
    assert(artist.labelId === 'distro_distrowave_pro', 'artist.labelId se actualiza a distro_distrowave_pro');
    assert(artist.activeContract?.royaltyPercentage === 100, 'artist.activeContract tiene 100% de regalías discográficas');
    assert(artist.activeContract?.annualFee === 20, 'artist.activeContract tiene annualFee = 20');
    assert(artist.stats.funds === 0, 'Se dedujo la cuota de $20 (saldo final = $0)');
    assert(distrowave.rosterArtistIds.includes(artist.id), 'DistroWave Pro incluye al artista en su roster');

    // 4. Verificación del Ledger Financiero
    const feeTx = (artist.financialLedger || []).find(tx => tx.category === 'contract' && tx.amount === 20 && tx.type === 'expense');
    assert(Boolean(feeTx), 'El ledger del artista registra la deducción de $20 de cuota anual');
    assert(feeTx?.resultingBalance === 0, 'El balance resultante en el ledger es $0');
    assert(feeTx?.description.includes('DistroWave Pro'), 'La descripción del ledger menciona a DistroWave Pro');

    const worldTx = (world.financialLedger || []).find(tx => tx.category === 'contract' && tx.amount === 20 && tx.type === 'expense');
    assert(Boolean(worldTx), 'El ledger global del mundo registra la transacción de cuota anual');
  }

  // -------------------------------------------------------------
  // CASO 3: Artista con 5.000 oyentes -> Desbloquea Callejón Records y recibe anticipo de $2.000
  // -------------------------------------------------------------
  console.log('\n🔹 CASO 3: Artista con 5.000 oyentes -> Desbloquea Callejón Records y recibe anticipo de $2.000');
  {
    const world = createBaseWorld();
    const artist = createTestArtist({
      id: 'player_case_3',
      name: 'Pibe de Barrio 5k',
      stats: {
        popularity: 18, reputation: 25, artisticCredibility: 35, energy: 100,
        monthlyListeners: 5000, totalStreams: 15000, funds: 300, fansCount: 1200,
        fanbaseLoyalty: 65, hype: 30
      },
      labelId: null,
      activeContract: null
    });
    world.artists[artist.id] = artist;

    const callejon = world.labels['label_callejon_records'];

    // 1. Verificación de metadata
    assert(Boolean(callejon), 'Callejón Records existe en world.labels');
    assert(callejon.minMonthlyListeners === 5000, 'Callejón Records requiere 5.000 oyentes mensuales');
    assert(callejon.advancePayment === 2000, 'Callejón Records ofrece un anticipo de $2.000');
    assert(callejon.commissionPct === 30, 'Callejón Records tiene 30% de comisión (70% para el artista)');
    assert(callejon.creativeFreedomAllowed === 85, 'Callejón Records permite 85% de control creativo');

    // 2. Validación de elegibilidad
    const checkCallejon = IndustryEngine.canSignDeal(artist, callejon);
    assert(checkCallejon.canSign === true, 'Artista con 5.000 oyentes PUEDE firmar con Callejón Records');

    // 3. Comprobar que un artista con 4.999 oyentes NO puede firmar
    const artistUnder = createTestArtist({
      id: 'player_case_3_under',
      stats: { ...artist.stats, monthlyListeners: 4999 }
    });
    const checkUnder = IndustryEngine.canSignDeal(artistUnder, callejon);
    assert(checkUnder.canSign === false, 'Artista con 4.999 oyentes NO puede firmar con Callejón Records (umbral estricto)');
    assert(checkUnder.missingReasons.some(r => r.includes('5.000') || r.includes('5000')), 'Detalla requisito de 5.000 oyentes');

    // 4. Firma del contrato
    const initialFunds = artist.stats.funds; // 300
    const signResult = IndustryEngine.signDeal(artist, callejon, world);

    assert(signResult.success === true, 'Firma exitosa con Callejón Records');
    assert(artist.labelId === 'label_callejon_records', 'artist.labelId se actualiza a label_callejon_records');
    assert(artist.activeContract?.royaltyPercentage === 70, 'artist.activeContract tiene 70% de regalías (100 - 30%)');
    assert(artist.activeContract?.signingBonus === 2000, 'artist.activeContract tiene signingBonus = $2.000');
    assert(artist.activeContract?.creativeControl === 85, 'artist.activeContract tiene 85% de control creativo');
    assert(artist.activeContract?.albumsRequired === 1, 'artist.activeContract requiere 1 álbum');
    assert(artist.stats.funds === initialFunds + 2000, `Fondos del artista aumentaron a $2.300 ($300 inicial + $2.000 anticipo)`);
    assert(callejon.rosterArtistIds.includes(artist.id), 'Callejón Records incluye al artista en su roster');

    // 5. Verificación en el Ledger Financiero
    const advTx = (artist.financialLedger || []).find(tx => tx.category === 'contract' && tx.amount === 2000 && tx.type === 'income');
    assert(Boolean(advTx), 'El ledger registra el ingreso del anticipo de $2.000');
    assert(advTx?.resultingBalance === 2300, 'El balance resultante en el ledger es exactamente $2.300');
    assert(advTx?.description.includes('Callejón Records'), 'La descripción del ledger menciona a Callejón Records');
  }

  // -------------------------------------------------------------
  // CASO 4: Artista con 12.000 oyentes -> Desbloquea Bohemian Groove Local y recibe anticipo de $5.000
  // -------------------------------------------------------------
  console.log('\n🔹 CASO 4: Artista con 12.000 oyentes -> Desbloquea Bohemian Groove Local y recibe anticipo de $5.000');
  {
    const world = createBaseWorld();
    const artist = createTestArtist({
      id: 'player_case_4',
      name: 'Promesa 12k',
      stats: {
        popularity: 32, reputation: 40, artisticCredibility: 50, energy: 100,
        monthlyListeners: 12000, totalStreams: 45000, funds: 1500, fansCount: 3800,
        fanbaseLoyalty: 70, hype: 45
      },
      labelId: null,
      activeContract: null
    });
    world.artists[artist.id] = artist;

    const bohemian = world.labels['label_bohemian_groove_local'];

    // 1. Verificación de metadata
    assert(Boolean(bohemian), 'Bohemian Groove Local existe en world.labels');
    assert(bohemian.minMonthlyListeners === 12000, 'Bohemian Groove Local requiere 12.000 oyentes');
    assert(bohemian.advancePayment === 5000, 'Bohemian Groove Local ofrece anticipo de $5.000');
    assert(bohemian.commissionPct === 35, 'Bohemian Groove Local tiene 35% de comisión (65% regalías artista)');
    assert(bohemian.creativeFreedomAllowed === 80, 'Bohemian Groove Local otorga 80% de libertad creativa');

    // 2. Validación de elegibilidad
    const checkBohemian = IndustryEngine.canSignDeal(artist, bohemian);
    assert(checkBohemian.canSign === true, 'Artista con 12.000 oyentes PUEDE firmar con Bohemian Groove Local');

    // 3. Comprobar que un artista con 11.999 oyentes NO puede firmar
    const artistUnder = createTestArtist({
      id: 'player_case_4_under',
      stats: { ...artist.stats, monthlyListeners: 11999 }
    });
    const checkUnder = IndustryEngine.canSignDeal(artistUnder, bohemian);
    assert(checkUnder.canSign === false, 'Artista con 11.999 oyentes NO puede firmar con Bohemian Groove Local');

    // 4. Firma del contrato
    const initialFunds = artist.stats.funds; // 1500
    const signResult = IndustryEngine.signDeal(artist, bohemian, world);

    assert(signResult.success === true, 'Firma exitosa con Bohemian Groove Local');
    assert(artist.labelId === 'label_bohemian_groove_local', 'artist.labelId se actualiza a label_bohemian_groove_local');
    assert(artist.activeContract?.royaltyPercentage === 65, 'artist.activeContract tiene 65% de regalías');
    assert(artist.activeContract?.signingBonus === 5000, 'artist.activeContract tiene signingBonus = $5.000');
    assert(artist.activeContract?.creativeControl === 80, 'artist.activeContract tiene 80% de control creativo');
    assert(artist.stats.funds === initialFunds + 5000, `Fondos del artista aumentaron a $6.500 ($1.500 inicial + $5.000 anticipo)`);
    assert(bohemian.rosterArtistIds.includes(artist.id), 'Bohemian Groove Local incluye al artista en su roster');

    // 5. Verificación de Ledger
    const advTx = (artist.financialLedger || []).find(tx => tx.category === 'contract' && tx.amount === 5000 && tx.type === 'income');
    assert(Boolean(advTx), 'El ledger registra el ingreso de $5.000 de anticipo');
    assert(advTx?.resultingBalance === 6500, 'El balance resultante en el ledger es $6.500');
  }

  // -------------------------------------------------------------
  // CASO 5: Artista con 100.000 oyentes -> Desbloquea Majors y Radar de A&R en nivel bidding war
  // -------------------------------------------------------------
  console.log('\n🔹 CASO 5: Artista con 100.000 oyentes -> Desbloquea Majors y Radar A&R Bidding War');
  {
    const world = createBaseWorld();
    const artist = createTestArtist({
      id: 'player_case_5',
      name: 'Superestrella 100k',
      personality: {
        creativity: 85, ambition: 90, discipline: 85, charisma: 90, skill: 88,
        commercialAppeal: 88, originality: 85, riskTolerance: 80, sociability: 85, independence: 70
      },
      stats: {
        popularity: 75, reputation: 70, artisticCredibility: 75, energy: 100,
        monthlyListeners: 100000, totalStreams: 2500000, funds: 50000, fansCount: 80000,
        fanbaseLoyalty: 85, hype: 80
      },
      careerStage: 'Established',
      labelId: null,
      activeContract: null
    });
    world.artists[artist.id] = artist;

    // 1. Evaluación del Radar de A&R
    const radar = IndustryEngine.evaluateScoutRadar(artist, world);
    assert(radar.monthlyListeners === 100000, 'Radar registra exactamente 100.000 oyentes');
    assert(radar.thresholdListeners === 100000, 'Umbral del radar de Majors es 100.000 oyentes');
    assert(radar.progressPercentage === 100, 'Progreso del radar alcanza 100%');
    assert(radar.scoutInterestLevel === 'bidding_war_target', 'Nivel de interés de A&R es "bidding_war_target" (Guerra de Ofertas)');
    assert(radar.statusMessage.includes('Objetivo de mercado') || radar.statusMessage.includes('A&R'), 'Mensaje de status refleja guerra de ofertas de A&R');

    // 2. Verificación de desbloqueo de Majors
    const sony = world.labels['label_sony_columbia'];
    const warner = world.labels['label_warner_latam'];
    const universal = world.labels['label_universal_interscope'];

    assert(Boolean(sony), 'Sony Music / Columbia existe');
    assert(Boolean(warner), 'Warner Music Latina existe');
    assert(Boolean(universal), 'Universal / Interscope existe');

    const checkSony = IndustryEngine.canSignDeal(artist, sony);
    assert(checkSony.canSign === true, 'Artista con 100.000 oyentes PUEDE firmar con Sony Columbia (umbral 100k)');

    const checkWarner = IndustryEngine.canSignDeal(artist, warner);
    assert(checkWarner.canSign === true, 'Artista con 100.000 oyentes PUEDE firmar con Warner Latina (umbral 80k)');

    // Universal requiere 120k oyentes
    const checkUniversal100k = IndustryEngine.canSignDeal(artist, universal);
    assert(checkUniversal100k.canSign === false, 'Universal requiere 120k oyentes (bloqueada a 100k)');

    // Elevar a 120.000 oyentes y verificar Universal
    artist.stats.monthlyListeners = 120000;
    const checkUniversal120k = IndustryEngine.canSignDeal(artist, universal);
    assert(checkUniversal120k.canSign === true, 'Universal se desbloquea al alcanzar 120.000 oyentes');

    // 3. Verificación de oferta de contrato Major para Sony Columbia
    artist.stats.monthlyListeners = 100000;
    const sonyOffer = IndustryEngine.generateDynamicLabelOffer(artist, sony, world.currentYear);
    assert(sonyOffer.signingBonus >= 250000, `Anticipo de Sony es millonario: $${sonyOffer.signingBonus.toLocaleString()} (≥$250.000)`);
    assert(sonyOffer.royaltyPercentage === 22, `Regalías de Sony para el artista: ${sonyOffer.royaltyPercentage}% (78% para el sello)`);
    assert(sonyOffer.creativeControl <= 50, `Control creativo de Major es restringido: ${sonyOffer.creativeControl}% (≤50%)`);
    assert(sonyOffer.albumsRequired >= 3, `Álbumes requeridos en Major: ${sonyOffer.albumsRequired} (≥3)`);

    // 4. Verificación de generación de Bidding War / Ofertas competitivas
    const biddingOffers = IndustryEngine.generateCompetitiveBiddingWar(artist, world);
    assert(biddingOffers.length >= 2, `Bidding war genera múltiples ofertas contrastantes (${biddingOffers.length} ofertas)`);
    const hasMajorOffer = biddingOffers.some(o => o.label.type === 'major');
    assert(hasMajorOffer, 'La guerra de ofertas incluye al menos una propuesta de Major');

    // 5. Firma con Major (Sony Columbia)
    const initialFunds = artist.stats.funds; // 50000
    const signResult = IndustryEngine.signDeal(artist, sony, world);
    assert(signResult.success === true, 'Firma exitosa con Sony Columbia');
    assert(artist.labelId === 'label_sony_columbia', 'artist.labelId es label_sony_columbia');
    assert(artist.stats.funds === initialFunds + sonyOffer.signingBonus, `Fondos actualizados con mega anticipo: $${artist.stats.funds.toLocaleString()}`);
    assert(sony.rosterArtistIds.includes(artist.id), 'Sony incluye al artista en su roster');
  }

  // -------------------------------------------------------------
  // CASO 6: EconomyEngine calcula correctamente las regalías netas para SoundDrop (85%), DistroWave (100%), Callejón (70%) y Majors (20%)
  // -------------------------------------------------------------
  console.log('\n🔹 CASO 6: EconomyEngine cálculo exacto de regalías netas por contrato');
  {
    assert(EconomyEngine.STREAM_PAYOUT_PER_THOUSAND === 3.5, 'EconomyEngine base payout es $3.50 por 1.000 streams ($0.0035/stream)');

    const totalMonthlyStreams = 1000000; // 1 Millón de streams
    // Gross streaming = (1,000,000 / 1000) * 3.5 = $3,500.00
    const expectedGross = 3500;

    // Subcaso 6.1: SoundDrop Free (85% artista / 15% comisión)
    {
      const artist = createTestArtist({
        stats: { popularity: 10, reputation: 10, artisticCredibility: 10, energy: 100, monthlyListeners: 10000, totalStreams: 1000000, funds: 1000, fansCount: 100, fanbaseLoyalty: 50, hype: 20 },
        labelId: 'distro_sounddrop_free',
        activeContract: {
          labelId: 'distro_sounddrop_free',
          signingBonus: 0,
          royaltyPercentage: 85,
          albumsRequired: 0,
          albumsDelivered: 0,
          creativeControl: 100,
          marketingPower: 20,
          durationYears: 1,
          signedYear: 2026,
          isDistributor: true,
          annualFee: 0
        }
      });
      const finances = EconomyEngine.calculateMonthlyFinances(artist, totalMonthlyStreams, INITIAL_LABELS['distro_sounddrop_free'], undefined);
      assert(finances.streamingRevenueGross === expectedGross, `[SoundDrop] Ingreso bruto por streaming: $${finances.streamingRevenueGross} (esperado: $3.500)`);
      assert(finances.artistStreamingNet === Math.floor(expectedGross * 0.85), `[SoundDrop 85%] Regalías netas artista: $${finances.artistStreamingNet} (esperado: $2.975)`);
    }

    // Subcaso 6.2: DistroWave Pro (100% artista / 0% comisión)
    {
      const artist = createTestArtist({
        stats: { popularity: 10, reputation: 10, artisticCredibility: 10, energy: 100, monthlyListeners: 10000, totalStreams: 1000000, funds: 1000, fansCount: 100, fanbaseLoyalty: 50, hype: 20 },
        labelId: 'distro_distrowave_pro',
        activeContract: {
          labelId: 'distro_distrowave_pro',
          signingBonus: 0,
          royaltyPercentage: 100,
          albumsRequired: 0,
          albumsDelivered: 0,
          creativeControl: 100,
          marketingPower: 35,
          durationYears: 1,
          signedYear: 2026,
          isDistributor: true,
          annualFee: 20
        }
      });
      const finances = EconomyEngine.calculateMonthlyFinances(artist, totalMonthlyStreams, INITIAL_LABELS['distro_distrowave_pro'], undefined);
      assert(finances.streamingRevenueGross === expectedGross, `[DistroWave] Ingreso bruto por streaming: $${finances.streamingRevenueGross} (esperado: $3.500)`);
      assert(finances.artistStreamingNet === Math.floor(expectedGross * 1.00), `[DistroWave 100%] Regalías netas artista: $${finances.artistStreamingNet} (esperado: $3.500)`);
    }

    // Subcaso 6.3: Callejón Records (70% artista / 30% sello)
    {
      const artist = createTestArtist({
        stats: { popularity: 20, reputation: 25, artisticCredibility: 30, energy: 100, monthlyListeners: 20000, totalStreams: 1000000, funds: 2000, fansCount: 500, fanbaseLoyalty: 60, hype: 30 },
        labelId: 'label_callejon_records',
        activeContract: {
          labelId: 'label_callejon_records',
          signingBonus: 2000,
          royaltyPercentage: 70,
          albumsRequired: 1,
          albumsDelivered: 0,
          creativeControl: 85,
          marketingPower: 58,
          durationYears: 2,
          signedYear: 2026,
          isDistributor: false,
          annualFee: 0
        }
      });
      const finances = EconomyEngine.calculateMonthlyFinances(artist, totalMonthlyStreams, INITIAL_LABELS['label_callejon_records'], undefined);
      assert(finances.streamingRevenueGross === expectedGross, `[Callejón] Ingreso bruto por streaming: $${finances.streamingRevenueGross} (esperado: $3.500)`);
      assert(finances.artistStreamingNet === Math.floor(expectedGross * 0.70), `[Callejón 70%] Regalías netas artista: $${finances.artistStreamingNet} (esperado: $2.450)`);
    }

    // Subcaso 6.4: Major (Universal Interscope, 20% artista / 80% sello)
    {
      const artist = createTestArtist({
        stats: { popularity: 80, reputation: 75, artisticCredibility: 70, energy: 100, monthlyListeners: 200000, totalStreams: 1000000, funds: 100000, fansCount: 50000, fanbaseLoyalty: 80, hype: 80 },
        labelId: 'label_universal_interscope',
        activeContract: {
          labelId: 'label_universal_interscope',
          signingBonus: 300000,
          royaltyPercentage: 20,
          albumsRequired: 3,
          albumsDelivered: 0,
          creativeControl: 45,
          marketingPower: 98,
          durationYears: 4,
          signedYear: 2026,
          isDistributor: false,
          annualFee: 0
        }
      });
      const finances = EconomyEngine.calculateMonthlyFinances(artist, totalMonthlyStreams, INITIAL_LABELS['label_universal_interscope'], undefined);
      assert(finances.streamingRevenueGross === expectedGross, `[Major Universal] Ingreso bruto por streaming: $${finances.streamingRevenueGross} (esperado: $3.500)`);
      assert(finances.artistStreamingNet === Math.floor(expectedGross * 0.20), `[Major 20%] Regalías netas artista: $${finances.artistStreamingNet} (esperado: $700)`);
    }

    // Subcaso 6.5: Fallback con objeto RecordLabel cuando no hay activeContract
    {
      const artist = createTestArtist({ activeContract: null });

      const fSoundDrop = EconomyEngine.calculateMonthlyFinances(artist, 100000, INITIAL_LABELS['distro_sounddrop_free'], undefined);
      assert(fSoundDrop.artistStreamingNet === Math.floor(350 * 0.85), 'Fallback SoundDrop Free calcula 85% correctamente');

      const fDistroWave = EconomyEngine.calculateMonthlyFinances(artist, 100000, INITIAL_LABELS['distro_distrowave_pro'], undefined);
      assert(fDistroWave.artistStreamingNet === Math.floor(350 * 1.00), 'Fallback DistroWave Pro calcula 100% correctamente');

      const fCallejon = EconomyEngine.calculateMonthlyFinances(artist, 100000, INITIAL_LABELS['label_callejon_records'], undefined);
      assert(fCallejon.artistStreamingNet === Math.floor(350 * 0.70), 'Fallback Callejón Records calcula 70% correctamente');

      const fUniversal = EconomyEngine.calculateMonthlyFinances(artist, 100000, INITIAL_LABELS['label_universal_interscope'], undefined);
      assert(fUniversal.artistStreamingNet === Math.floor(350 * 0.20), 'Fallback Universal Interscope calcula 20% correctamente');
    }
  }

  // -------------------------------------------------------------
  // CASO 7: Cambiar de distribuidor o sello descuenta cuotas y actualiza el roster y ledger financiero
  // -------------------------------------------------------------
  console.log('\n🔹 CASO 7: Transición de acuerdos, actualización de roster y sincronización del ledger');
  {
    const world = createBaseWorld();
    const artist = createTestArtist({
      id: 'player_case_7_lifecycle',
      name: 'Artista Carrera Evolutiva',
      stats: {
        popularity: 5, reputation: 10, artisticCredibility: 15, energy: 100,
        monthlyListeners: 0, totalStreams: 0, funds: 100, fansCount: 50,
        fanbaseLoyalty: 50, hype: 10
      },
      labelId: null,
      activeContract: null,
      financialLedger: []
    });
    world.artists[artist.id] = artist;

    const sounddrop = world.labels['distro_sounddrop_free'];
    const distrowave = world.labels['distro_distrowave_pro'];
    const callejon = world.labels['label_callejon_records'];
    const bohemian = world.labels['label_bohemian_groove_local'];

    // --- Paso 1: Firma inicial con SoundDrop Free ($0 cuota) ---
    console.log('   Paso 1: Artista firma con SoundDrop Free ($0)');
    IndustryEngine.signDeal(artist, sounddrop, world);
    assert(artist.labelId === 'distro_sounddrop_free', 'Paso 1: labelId es distro_sounddrop_free');
    assert(sounddrop.rosterArtistIds.includes(artist.id), 'Paso 1: SoundDrop roster contiene al artista');
    assert(artist.stats.funds === 100, 'Paso 1: Fondos se mantienen en $100');

    // --- Paso 2: Cambio a DistroWave Pro ($20 cuota) ---
    console.log('   Paso 2: Artista cambia a DistroWave Pro ($20 cuota)');
    const signDistroWave = IndustryEngine.signDeal(artist, distrowave, world);
    assert(signDistroWave.success === true, 'Paso 2: Cambio a DistroWave Pro fue exitoso');
    assert(artist.labelId === 'distro_distrowave_pro', 'Paso 2: labelId se actualizó a distro_distrowave_pro');
    assert(!sounddrop.rosterArtistIds.includes(artist.id), 'Paso 2: SoundDrop roster YA NO contiene al artista (roster desvinculado)');
    assert(distrowave.rosterArtistIds.includes(artist.id), 'Paso 2: DistroWave roster contiene al artista');
    assert(artist.stats.funds === 80, 'Paso 2: Se dedujeron $20 de cuota (fondos: $100 -> $80)');
    assert(artist.activeContract?.royaltyPercentage === 100, 'Paso 2: Contrato activo actualizado a 100% regalías');

    // Verificar ledger tras cuota
    const feeTx = (artist.financialLedger || [])[0];
    assert(feeTx?.category === 'contract' && feeTx.type === 'expense' && feeTx.amount === 20, 'Paso 2: Ledger registra gasto de $20 por cuota de DistroWave');
    assert(feeTx?.resultingBalance === 80, 'Paso 2: Balance registrado en ledger es $80');

    // --- Paso 3: Crecimiento a 5.000 oyentes y firma con Callejón Records ($2.000 anticipo) ---
    console.log('   Paso 3: Artista crece a 5.000 oyentes y firma con Callejón Records ($2.000 anticipo)');
    artist.stats.monthlyListeners = 5000;
    const signCallejon = IndustryEngine.signDeal(artist, callejon, world);
    assert(signCallejon.success === true, 'Paso 3: Firma con Callejón Records fue exitosa');
    assert(artist.labelId === 'label_callejon_records', 'Paso 3: labelId se actualizó a label_callejon_records');
    assert(!distrowave.rosterArtistIds.includes(artist.id), 'Paso 3: DistroWave roster YA NO contiene al artista');
    assert(callejon.rosterArtistIds.includes(artist.id), 'Paso 3: Callejón Records roster contiene al artista');
    assert(artist.stats.funds === 80 + 2000, 'Paso 3: Fondos aumentaron a $2.080 ($80 + $2.000 anticipo)');
    assert(artist.activeContract?.royaltyPercentage === 70, 'Paso 3: Contrato activo tiene 70% de regalías');
    assert(artist.activeContract?.albumsRequired === 1, 'Paso 3: Requiere 1 álbum');

    // Verificar ledger tras anticipo
    const advCallejonTx = (artist.financialLedger || [])[0];
    assert(advCallejonTx?.category === 'contract' && advCallejonTx.type === 'income' && advCallejonTx.amount === 2000, 'Paso 3: Ledger registra ingreso de $2.000 por anticipo de Callejón');
    assert(advCallejonTx?.resultingBalance === 2080, 'Paso 3: Balance registrado en ledger es $2.080');

    // --- Paso 4: Cumplimiento de contrato y liberación a Agente Libre ---
    console.log('   Paso 4: Artista entrega álbum acordado y cumple contrato');
    const albumReleaseResult = IndustryEngine.onAlbumReleased(artist, world);
    assert(albumReleaseResult.contractCompleted === true, 'Paso 4: onAlbumReleased confirma cumplimiento del contrato');
    assert(artist.activeContract === null, 'Paso 4: activeContract es null (Agente Libre)');
    assert(artist.labelId === null, 'Paso 4: labelId es null');
    assert(!callejon.rosterArtistIds.includes(artist.id), 'Paso 4: Callejón Records roster YA NO contiene al artista (contrato finalizado)');

    // --- Paso 5: Crecimiento a 12.000 oyentes y firma con Bohemian Groove Local ($5.000 anticipo) ---
    console.log('   Paso 5: Artista crece a 12.000 oyentes y firma con Bohemian Groove Local ($5.000 anticipo)');
    artist.stats.monthlyListeners = 12000;
    const signBohemian = IndustryEngine.signDeal(artist, bohemian, world);
    assert(signBohemian.success === true, 'Paso 5: Firma con Bohemian Groove Local fue exitosa');
    assert(artist.labelId === 'label_bohemian_groove_local', 'Paso 5: labelId es label_bohemian_groove_local');
    assert(bohemian.rosterArtistIds.includes(artist.id), 'Paso 5: Bohemian Groove roster contiene al artista');
    assert(artist.stats.funds === 2080 + 5000, 'Paso 5: Fondos aumentaron a $7.080 ($2.080 + $5.000 anticipo)');
    assert(artist.activeContract?.royaltyPercentage === 65, 'Paso 5: Contrato activo tiene 65% de regalías');

    const advBohemianTx = (artist.financialLedger || [])[0];
    assert(advBohemianTx?.category === 'contract' && advBohemianTx.type === 'income' && advBohemianTx.amount === 5000, 'Paso 5: Ledger registra ingreso de $5.000 por anticipo de Bohemian Groove');
    assert(advBohemianTx?.resultingBalance === 7080, 'Paso 5: Balance registrado en ledger es $7.080');

    // --- Paso 6: Verificación de integridad histórica del Ledger ---
    console.log('   Paso 6: Auditoría de integridad cronológica del Ledger');
    const ledger = artist.financialLedger || [];
    assert(ledger.length >= 3, `El ledger contiene todas las transacciones históricas (${ledger.length} txs)`);
    assert(ledger[0].amount === 5000 && ledger[0].resultingBalance === 7080, 'Ledger Tx 1: Bohemian Anticipo +$5.000 -> Bal $7.080');
    assert(ledger[1].amount === 2000 && ledger[1].resultingBalance === 2080, 'Ledger Tx 2: Callejón Anticipo +$2.000 -> Bal $2.080');
    assert(ledger[2].amount === 20 && ledger[2].resultingBalance === 80, 'Ledger Tx 3: DistroWave Cuota -$20 -> Bal $80');
  }

  // -------------------------------------------------------------
  // CASO EXTRA: Integración GameEngine end-to-end con firma de contratos y simulación
  // -------------------------------------------------------------
  console.log('\n🔹 CASO EXTRA / INTEGRACIÓN: GameEngine ciclo completo');
  {
    const engine = new GameEngine({
      name: 'Artista GameEngine E2E',
      stats: {
        popularity: 5, reputation: 10, artisticCredibility: 15, energy: 100,
        monthlyListeners: 0, totalStreams: 0, funds: 50, fansCount: 0,
        fanbaseLoyalty: 50, hype: 10
      },
      labelId: null,
      activeContract: null
    });

    const player = engine.getPlayer();
    assert(player.stats.funds === 50, 'GameEngine: Fondos iniciales $50');

    // Firma con SoundDrop Free
    const deal1 = engine.signDeal('distro_sounddrop_free');
    assert(deal1.success === true, 'GameEngine.signDeal: Firma SoundDrop Free exitosa');
    assert(engine.getPlayer().labelId === 'distro_sounddrop_free', 'GameEngine: player.labelId actualizado');

    // Cambio a DistroWave Pro
    const deal2 = engine.signDeal('distro_distrowave_pro');
    assert(deal2.success === true, 'GameEngine.signDeal: Cambio a DistroWave Pro exitoso');
    assert(engine.getPlayer().stats.funds === 30, 'GameEngine: Fondos deducidos a $30 ($50 - $20)');
    assert(engine.getPlayer().labelId === 'distro_distrowave_pro', 'GameEngine: player.labelId actualizado');
    assert(engine.getWorld().labels['distro_distrowave_pro'].rosterArtistIds.includes(player.id), 'GameEngine: DistroWave roster contiene al jugador');
    assert(!engine.getWorld().labels['distro_sounddrop_free'].rosterArtistIds.includes(player.id), 'GameEngine: SoundDrop roster desvinculó al jugador');
  }

  console.log('\n======================================================================');
  console.log(`📊 RESUMEN DE AUDITORÍA QA DE CONTRATOS & INDUSTRIA:`);
  console.log(`   Total de comprobaciones ejecutadas: ${stats.total}`);
  console.log(`   \x1b[32mSuperadas con éxito: ${stats.passed}\x1b[0m`);
  console.log(`   \x1b[31mFallidas: ${stats.failed}\x1b[0m`);
  if (stats.failed === 0) {
    console.log(`\n🎉 \x1b[32m100% DE ÉXITO: Todos los casos de contratos, distribución y economía validados.\x1b[0m`);
  } else {
    console.log(`\n❌ \x1b[31mSe detectaron ${stats.failed} fallos en la suite de pruebas.\x1b[0m`);
  }
  console.log('======================================================================\n');

  return stats.failed === 0;
}

const success = runAllIndustryTests();
if (!success) {
  process.exit(1);
}
