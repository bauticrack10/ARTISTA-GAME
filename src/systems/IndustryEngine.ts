import { Artist, RecordLabel, LabelContract, WorldState, Manager, Producer, LongevityCurve } from '../types';
import { SUBGENRE_DETAILS } from '../data/genres';
import { formatMoney } from '../utils/formatters';

export interface TrackPerformanceEvaluation {
  performanceScore: number; // 0 - 100
  longevityCurve: LongevityCurve;
  productionQuality: number; // 0 - 100
  marketingInvestment: number; // 0 - 100
  creativitySkills: number; // 0 - 100
  randomFactor: number; // 0 - 100
}

export interface ScoutRadarStatus {
  monthlyListeners: number;
  thresholdListeners: number;
  progressPercentage: number;
  scoutInterestLevel: 'unnoticed' | 'emerging_scouting' | 'high_priority' | 'bidding_war_target';
  scoutingLabels: RecordLabel[];
  statusMessage: string;
}

export interface DealValidationResult {
  canSign: boolean;
  missingReasons: string[];
}

export interface DealSignResult {
  success: boolean;
  contract?: LabelContract;
  error?: string;
  transactionDescription?: string;
}

export interface DistributionOrLabelOption {
  label: RecordLabel;
  category: RecordLabel['type'];
  canSign: boolean;
  missingReasons: string[];
  contractOffer: LabelContract;
  isCurrent: boolean;
}

export class IndustryEngine {
  public static readonly MIN_MONTHLY_LISTENERS_FOR_MAJOR_SCOUTS = 100000;
  public static readonly MIN_MONTHLY_LISTENERS_FOR_UNDERGROUND_BOUTIQUE = 8000;

  /**
   * Obtiene la escalera completa de distribución y sellos discográficos disponibles en el mundo,
   * clasificándolos por categoría (distribuidoras, sellos independientes locales, boutiques, indies consagrados, majors).
   */
  static getAvailableDistributionAndLabels(
    artist: Artist,
    world: WorldState
  ): DistributionOrLabelOption[] {
    const allLabels = Object.values(world.labels);

    const typeOrder: Record<RecordLabel['type'], number> = {
      distributor: 1,
      local_indie: 2,
      boutique: 3,
      indie: 4,
      major: 5,
      artist_owned: 6
    };

    const options: DistributionOrLabelOption[] = allLabels.map(label => {
      const validation = this.canSignDeal(artist, label);
      const contractOffer = this.generateDynamicLabelOffer(artist, label, world.currentYear, world);
      const isCurrent = artist.labelId === label.id;

      return {
        label,
        category: label.type,
        canSign: validation.canSign,
        missingReasons: validation.missingReasons,
        contractOffer,
        isCurrent
      };
    });

    options.sort((a, b) => {
      const orderA = typeOrder[a.label.type] || 99;
      const orderB = typeOrder[b.label.type] || 99;
      if (orderA !== orderB) return orderA - orderB;
      const minA = a.label.minMonthlyListeners || 0;
      const minB = b.label.minMonthlyListeners || 0;
      return minA - minB;
    });

    return options;
  }

  /**
   * Valida si el artista cumple con los requisitos previos de oyentes, fondos para cuota anual o exclusividad
   * para firmar con una distribuidora o sello discográfico.
   */
  static canSignDeal(
    artist: Artist,
    label: RecordLabel
  ): DealValidationResult {
    const missing: string[] = [];

    if (artist.labelId === label.id) {
      missing.push('Ya tienes un acuerdo activo con esta distribuidora o sello discográfico.');
    }

    // Si tiene contrato activo no distribuidor y aún le restan álbumes por entregar
    if (
      artist.activeContract &&
      !artist.activeContract.isDistributor &&
      artist.activeContract.albumsRequired > artist.activeContract.albumsDelivered &&
      label.type !== 'distributor'
    ) {
      missing.push(`Tienes un contrato discográfico exclusivo vigente (${artist.activeContract.albumsDelivered}/${artist.activeContract.albumsRequired} entregados).`);
    }

    // Validación de cuota anual
    if (label.annualFee && label.annualFee > 0 && artist.stats.funds < label.annualFee) {
      missing.push(`Requiere ${formatMoney(label.annualFee)} para la cuota anual (tienes ${formatMoney(artist.stats.funds)})`);
    }

    // Validación de oyentes mensuales mínimos
    if (label.minMonthlyListeners !== undefined && label.minMonthlyListeners > 0 && artist.stats.monthlyListeners < label.minMonthlyListeners) {
      missing.push(`Requiere al menos ${label.minMonthlyListeners.toLocaleString()} oyentes mensuales (tienes ${artist.stats.monthlyListeners.toLocaleString()})`);
    }

    // Sellos propios pertenecientes a otros artistas
    if (label.type === 'artist_owned' && label.ownerArtistId && label.ownerArtistId !== artist.id) {
      missing.push('Este sello discográfico es propiedad exclusiva de otro artista.');
    }

    return {
      canSign: missing.length === 0,
      missingReasons: missing
    };
  }

  /**
   * Firma un acuerdo de distribución o contrato discográfico, deduciendo cuotas anuales o acreditando anticipos
   * y sincronizando el estado del artista y transacciones del ledger financiero.
   */
  static signDeal(
    artist: Artist,
    label: RecordLabel,
    world: WorldState
  ): DealSignResult {
    const validation = this.canSignDeal(artist, label);
    if (!validation.canSign) {
      return {
        success: false,
        error: validation.missingReasons.join(' • ')
      };
    }

    const contract = this.generateDynamicLabelOffer(artist, label, world.currentYear, world);

    // 1. Deducir cuota anual de distribución si aplica
    if (contract.annualFee && contract.annualFee > 0) {
      artist.stats.funds = Math.max(0, artist.stats.funds - contract.annualFee);
      const tx = {
        id: `tx_fee_${world.currentYear}_${world.currentMonth}_${Date.now()}`,
        year: world.currentYear,
        month: world.currentMonth,
        type: 'expense' as const,
        category: 'contract' as const,
        amount: contract.annualFee,
        description: `Cuota anual de distribución (${label.name})`,
        resultingBalance: artist.stats.funds,
        balanceAfter: artist.stats.funds,
        dateStr: `Año ${world.currentYear} - Mes ${world.currentMonth}`,
        timestamp: Date.now()
      };
      if (!artist.financialLedger) artist.financialLedger = [];
      artist.financialLedger.unshift(tx);
      if (!world.financialLedger) world.financialLedger = [];
      world.financialLedger.unshift(tx);
    }

    // 2. Acreditar anticipo / bono de firma si aplica
    if (contract.signingBonus > 0) {
      artist.stats.funds += contract.signingBonus;
      const tx = {
        id: `tx_adv_${world.currentYear}_${world.currentMonth}_${Date.now()}`,
        year: world.currentYear,
        month: world.currentMonth,
        type: 'income' as const,
        category: 'contract' as const,
        amount: contract.signingBonus,
        description: `Anticipo / Bono de firma (${label.name})`,
        resultingBalance: artist.stats.funds,
        balanceAfter: artist.stats.funds,
        dateStr: `Año ${world.currentYear} - Mes ${world.currentMonth}`,
        timestamp: Date.now()
      };
      if (!artist.financialLedger) artist.financialLedger = [];
      artist.financialLedger.unshift(tx);
      if (!world.financialLedger) world.financialLedger = [];
      world.financialLedger.unshift(tx);
    }

    // 3. Actualizar contrato y roster
    if (artist.labelId && artist.labelId !== label.id && world.labels[artist.labelId]) {
      const prevLabel = world.labels[artist.labelId];
      if (prevLabel.rosterArtistIds) {
        prevLabel.rosterArtistIds = prevLabel.rosterArtistIds.filter(id => id !== artist.id);
      }
    }

    artist.labelId = label.id;
    artist.activeContract = { ...contract };

    if (!label.rosterArtistIds.includes(artist.id)) {
      label.rosterArtistIds.push(artist.id);
    }

    // 4. Generar noticia contextual
    let headline = '';
    let body = '';
    let importance = 3;

    if (label.type === 'distributor') {
      headline = `Distribución Digital: ${artist.name} se une a ${label.name}`;
      body = `${artist.name} activó la distribución global de su catálogo musical con ${label.name}, conservando el ${contract.royaltyPercentage}% de sus regalías de streaming y control total de másters.`;
      importance = 2;
    } else if (label.type === 'local_indie') {
      headline = `Alianza en la Escena: ${artist.name} firma con el sello local ${label.name}`;
      body = `El artista sumó fuerzas con ${label.name} tras acordar un anticipo de ${formatMoney(contract.signingBonus)} y ${contract.creativeControl}% de libertad creativa.`;
      importance = 3;
    } else if (label.type === 'indie' || label.type === 'boutique') {
      headline = `Fichaje Independiente: ${artist.name} sella acuerdo con ${label.name}`;
      body = `${label.name} anunció la incorporación de ${artist.name} a su prestigioso catálogo con un contrato de ${contract.albumsRequired} álbum(es), ${contract.royaltyPercentage}% de regalías discográficas y un anticipo de ${formatMoney(contract.signingBonus)}.`;
      importance = 4;
    } else if (label.type === 'major') {
      headline = `¡Bomba en la Industria! ${artist.name} firma un contrato estelar con ${label.name}`;
      body = `La multinacional ${label.name} cerró la contratación de ${artist.name} con un mega anticipo de ${formatMoney(contract.signingBonus)} y un plan de rotación y marketing mundial.`;
      importance = 5;
    } else {
      headline = `Independencia Total: ${artist.name} opera bajo su propio sello "${label.name}"`;
      body = `Con el 100% del control artístico y fonográfico, ${artist.name} encabeza sus proyectos de manera autogestionada.`;
      importance = 4;
    }

    world.news.unshift({
      id: `news_deal_${Date.now()}`,
      headline,
      body,
      year: world.currentYear,
      month: world.currentMonth,
      category: 'industry',
      relatedArtistIds: [artist.id],
      sentiment: 'positive',
      importance
    });

    return {
      success: true,
      contract
    };
  }

  /**
   * Evalúa el estado del radar de cazatalentos (A&R) para el artista.
   * Mide el interés de los sellos discográficos y distribuidoras según el crecimiento de oyentes y credibilidad.
   */
  static evaluateScoutRadar(
    artist: Artist,
    world: WorldState
  ): ScoutRadarStatus {
    const listeners = artist.stats.monthlyListeners;
    const threshold = this.MIN_MONTHLY_LISTENERS_FOR_MAJOR_SCOUTS;
    const progressPercentage = Math.min(100, Math.floor((listeners / threshold) * 100));

    let scoutInterestLevel: ScoutRadarStatus['scoutInterestLevel'] = 'unnoticed';
    let statusMessage = 'Los cazatalentos de las Majors aún no tienen tus métricas en el radar comercial masivo. Las distribuidoras digitales y sellos locales están listos para tus primeros lanzamientos.';

    if (listeners >= threshold) {
      scoutInterestLevel = 'bidding_war_target';
      statusMessage = '¡Objetivo de mercado! Múltiples directivos de A&R compiten activamente por presentar ofertas millonarias en eventos emergentes.';
    } else if (listeners >= 60000) {
      scoutInterestLevel = 'high_priority';
      statusMessage = 'Prioridad alta en mesas de A&R. Sellos independientes consagrados y majors siguen tus lanzamientos a la espera de consolidar 100.000 oyentes.';
    } else if (listeners >= 12000) {
      scoutInterestLevel = 'emerging_scouting';
      statusMessage = 'Sellos independientes locales y colectivos boutique están monitoreando tu crecimiento y tracción en la escena.';
    } else if (listeners >= 5000) {
      scoutInterestLevel = 'emerging_scouting';
      statusMessage = 'Sellos independientes de barrio y locales muestran interés en tus primeras métricas de streaming.';
    }

    // Filtrar sellos afines al género o escena
    const scoutingLabels = Object.values(world.labels).filter(l => {
      const genreMatch = l.favoredGenreIds.includes(artist.mainGenreId) || l.favoredGenreIds.length === 0;
      const minReq = l.minMonthlyListeners || 0;
      if (l.type === 'distributor') return true;
      if (l.type === 'local_indie') return genreMatch && (listeners >= minReq || listeners >= 3000);
      if (l.type === 'boutique') return genreMatch && (listeners >= minReq || artist.stats.artisticCredibility >= 60);
      return genreMatch && listeners >= (minReq > 0 ? minReq * 0.6 : 30000);
    });

    return {
      monthlyListeners: listeners,
      thresholdListeners: threshold,
      progressPercentage,
      scoutInterestLevel,
      scoutingLabels,
      statusMessage
    };
  }

  /**
   * Calcula la valoración integral del artista, proyección de ingresos anuales (Run-Rate de streaming y merch)
   * y valor capitalizado del catálogo fonográfico para fundamentar ofertas discográficas dinámicas.
   */
  static calculateArtistValuation(artist: Artist, world?: WorldState): {
    projectedAnnualStreams: number;
    projectedStreamingGross: number;
    projectedMerchGross: number;
    projectedGrossAnnual: number;
    catalogSongCount: number;
    catalogTotalStreams: number;
    catalogHitCount: number;
    catalogAnnualYield: number;
    catalogValuation: number;
  } {
    const listeners = Math.max(0, artist.stats?.monthlyListeners || 0);
    const pop = Math.max(0, artist.stats?.popularity || 0);
    const fansCount = artist.stats?.fansCount || 0;
    const loyalty = artist.stats?.fanbaseLoyalty || 50;
    const isProdigy = Boolean(artist.isProdigy);

    let catalogSongCount = 0;
    let catalogTotalStreams = 0;
    let catalogHitCount = 0;
    let actualMonthlyStreams = 0;

    if (world?.songs) {
      const artistSongs = Object.values(world.songs).filter(s => s.artistId === artist.id);
      catalogSongCount = artistSongs.length;
      for (const song of artistSongs) {
        catalogTotalStreams += song.streamsTotal || 0;
        actualMonthlyStreams += song.streamsLastMonth || 0;
        if ((song.streamsTotal || 0) >= 1000000) {
          catalogHitCount += 1;
        }
      }
    }

    // Estimación del run-rate de streams mensuales (un oyente genera ~7.5 reproducciones mensuales en promedio)
    const estimatedMonthlyStreams = Math.floor(listeners * 7.5);
    const monthlyStreamsRunRate = Math.max(actualMonthlyStreams, estimatedMonthlyStreams);
    const projectedAnnualStreams = monthlyStreamsRunRate * 12;

    // $3.50 por 1,000 streams ($0.0035/stream bruto)
    const projectedStreamingGross = Math.floor((projectedAnnualStreams / 1000) * 3.5);

    // Merch anual proyectado
    const merchMonthly = Math.floor(
      (fansCount * 0.03) *
      (loyalty / 100) *
      (Math.max(5, pop) / 100) *
      (isProdigy ? 1.35 : 1.0)
    );
    const projectedMerchGross = merchMonthly * 12;

    // Rendimiento residual de catálogo (5% anual de streams recurrentes del catálogo fonográfico)
    const catalogAnnualYield = Math.floor((catalogTotalStreams * 0.05) * 0.0035);
    // Múltiplo de valoración de catálogo en la industria discográfica (4x yield anual + $50k por cada tema disco de platino/hit de +1M)
    const catalogValuation = Math.floor((catalogAnnualYield * 4) + (catalogHitCount * 50000));

    const projectedGrossAnnual = projectedStreamingGross + projectedMerchGross + catalogAnnualYield;

    return {
      projectedAnnualStreams,
      projectedStreamingGross,
      projectedMerchGross,
      projectedGrossAnnual,
      catalogSongCount,
      catalogTotalStreams,
      catalogHitCount,
      catalogAnnualYield,
      catalogValuation
    };
  }

  /**
   * Genera una propuesta de contrato dinámico, competitivo y personalizado escalado a:
   * 1. Facturación anual proyectada del artista (streaming + merch + yield de catálogo).
   * 2. Tracción real de oyentes mensuales, popularidad, hype y credibilidad artística.
   * 3. Valor de su catálogo fonográfico previo.
   * 4. Multiplicadores por negociación de Manager y rasgo Prodigio.
   * 5. Filosofía, presupuesto y exigencia contractual del sello discográfico.
   */
  static generateDynamicLabelOffer(
    artist: Artist,
    label: RecordLabel,
    currentYear: number,
    world?: WorldState,
    isBiddingWar: boolean = false
  ): LabelContract {
    const listeners = Math.max(0, artist.stats?.monthlyListeners || 0);
    const pop = Math.max(0, artist.stats?.popularity || 0);
    const rep = Math.max(0, artist.stats?.reputation || 0);
    const credibility = Math.max(0, artist.stats?.artisticCredibility || 0);
    const hype = Math.max(0, artist.stats?.hype || 0);
    const valuation = this.calculateArtistValuation(artist, world);

    // Bono de negociación si el artista cuenta con un Manager contratado
    let managerNegotiationMultiplier = 1.0;
    if (artist.managerId && world?.managers && world.managers[artist.managerId]) {
      const mgr = world.managers[artist.managerId];
      managerNegotiationMultiplier = 1.0 + (mgr.negotiationSkill / 100) * 0.25; // hasta +25% adicional
    }

    // Bono por condición de Prodigio
    const prodigyMultiplier = artist.isProdigy ? 1.20 : 1.0;

    // Bono por Guerra de Ofertas (competitividad de mercado)
    const biddingWarMultiplier = isBiddingWar ? (1.25 + Math.random() * 0.15) : 1.0;

    if (label.type === 'distributor') {
      const commission = label.commissionPct !== undefined ? label.commissionPct : 0;
      const royaltyPercentage = Math.max(0, 100 - commission);
      return {
        labelId: label.id,
        signingBonus: 0,
        royaltyPercentage,
        albumsRequired: 0,
        albumsDelivered: 0,
        creativeControl: 100,
        marketingPower: label.marketingPower,
        marketingBudgetPerRelease: 0,
        breakoutClause: 0,
        durationYears: 1,
        signedYear: currentYear,
        isDistributor: true,
        annualFee: label.annualFee || 0
      };
    }

    if (label.type === 'artist_owned') {
      return {
        labelId: label.id,
        signingBonus: 0,
        royaltyPercentage: 95,
        albumsRequired: 1,
        albumsDelivered: 0,
        creativeControl: 100,
        marketingPower: label.marketingPower || Math.floor(pop * 0.85),
        marketingBudgetPerRelease: 25000,
        breakoutClause: 0,
        durationYears: 10,
        signedYear: currentYear,
        isDistributor: false,
        annualFee: 0
      };
    }

    let rawAdvance = 0;
    let royaltyPct = 20;
    let creativeControl = label.creativeFreedomAllowed;
    let requiredAlbums = 2;
    let marketingBudgetPerRelease = 15000;
    let breakoutClause = 50000;
    let durationYears = 2;

    if (label.type === 'local_indie') {
      // Sellos Locales de Barrio / Escena: Piso base de $15,000 - $25,000, escalable dinámicamente
      const baseFloor = Math.max(15000, label.advancePayment || 15000);
      const revenueShare = valuation.projectedGrossAnnual * 0.35;
      const audienceShare = (listeners * 0.22) + (pop * 400) + (credibility * 250);
      const catalogShare = Math.min(35000, valuation.catalogValuation * 0.15);

      rawAdvance = Math.floor((baseFloor + revenueShare + audienceShare + catalogShare) * managerNegotiationMultiplier * prodigyMultiplier * biddingWarMultiplier);
      const maxCap = Math.max(baseFloor * 2, (label.budget || 350000) * 0.40);
      rawAdvance = Math.min(maxCap, Math.max(baseFloor, rawAdvance));

      const commission = label.commissionPct !== undefined ? label.commissionPct : 30;
      royaltyPct = Math.max(65, 100 - commission);
      creativeControl = Math.max(80, label.creativeFreedomAllowed);
      requiredAlbums = 1;
      durationYears = 2;
      marketingBudgetPerRelease = Math.floor(8000 + (label.marketingPower * 150));
      breakoutClause = Math.floor(rawAdvance * 1.5);
    } else if (label.type === 'boutique') {
      // Boutiques de autor & colectivos subterráneos: Piso de $30,000 - $75,000, escalando a $100k-$300k+
      const baseFloor = Math.max(30000, label.advancePayment || 30000);
      const revenueShare = valuation.projectedGrossAnnual * 0.55;
      const audienceShare = (listeners * 0.28) + (credibility * 900) + (pop * 500);
      const catalogShare = valuation.catalogValuation * 0.25;

      rawAdvance = Math.floor((baseFloor + revenueShare + audienceShare + catalogShare) * managerNegotiationMultiplier * prodigyMultiplier * biddingWarMultiplier);
      const maxCap = Math.max(baseFloor * 2, (label.budget || 1000000) * 0.35);
      rawAdvance = Math.min(maxCap, Math.max(baseFloor, rawAdvance));

      const commission = label.commissionPct !== undefined ? label.commissionPct : 22;
      royaltyPct = Math.max(75, 100 - commission);
      creativeControl = Math.max(90, label.creativeFreedomAllowed);
      requiredAlbums = 1;
      durationYears = 2;
      marketingBudgetPerRelease = Math.floor(15000 + (label.marketingPower * 300));
      breakoutClause = Math.floor(rawAdvance * 1.6);
    } else if (label.type === 'indie') {
      // Indies Consagrados (Dale Play / Rimas): Piso de $80,000 - $250,000, escalando a $500k - $2.5M
      const baseFloor = Math.max(80000, label.advancePayment || 80000);
      const revenueShare = valuation.projectedGrossAnnual * 0.85; // Hasta 1 año de facturación bruta en adelanto
      const audienceShare = (listeners * 0.50) + (pop * 2200) + (hype * 1200) + (credibility * 600);
      const catalogShare = valuation.catalogValuation * 0.40;

      rawAdvance = Math.floor((baseFloor + revenueShare + audienceShare + catalogShare) * managerNegotiationMultiplier * prodigyMultiplier * biddingWarMultiplier);
      const maxCap = Math.max(baseFloor * 2, (label.budget || 5000000) * 0.35);
      rawAdvance = Math.min(maxCap, Math.max(baseFloor, rawAdvance));

      const commission = label.commissionPct !== undefined ? label.commissionPct : 32;
      royaltyPct = Math.max(60, 100 - commission);
      creativeControl = Math.max(75, label.creativeFreedomAllowed);
      requiredAlbums = 2;
      durationYears = 3;
      marketingBudgetPerRelease = Math.floor(35000 + (label.marketingPower * 600));
      breakoutClause = Math.floor(rawAdvance * 2.0);
    } else if (label.type === 'major') {
      // Majors Multinacionales (Sony, Universal, Warner): Piso de $250,000 - $750,000, escalando a $1.5M - $6M+
      const baseFloor = Math.max(250000, label.advancePayment || 250000);
      // Múltiplo de adquisición agresiva: 1.6x de facturación anual proyectada + prima de catálogo
      const revenueShare = valuation.projectedGrossAnnual * 1.60;
      const audienceShare = (listeners * 0.85) + (pop * 4500) + (hype * 2500) + (rep * 1500);
      const catalogShare = valuation.catalogValuation * 0.60;

      rawAdvance = Math.floor((baseFloor + revenueShare + audienceShare + catalogShare) * managerNegotiationMultiplier * prodigyMultiplier * biddingWarMultiplier);
      const maxCap = Math.max(baseFloor * 2, (label.budget || 30000000) * 0.30);
      rawAdvance = Math.min(maxCap, Math.max(baseFloor, rawAdvance));

      const commission = label.commissionPct !== undefined ? label.commissionPct : 78;
      royaltyPct = Math.max(18, 100 - commission);
      creativeControl = Math.min(55, label.creativeFreedomAllowed);
      requiredAlbums = listeners >= 1000000 ? 2 : 3;
      durationYears = requiredAlbums + 1;
      marketingBudgetPerRelease = Math.floor(80000 + (label.marketingPower * 1400));
      breakoutClause = Math.floor(rawAdvance * 2.8);
    }

    return {
      labelId: label.id,
      signingBonus: rawAdvance,
      royaltyPercentage: Math.min(98, Math.max(10, royaltyPct)),
      albumsRequired: requiredAlbums,
      albumsDelivered: 0,
      creativeControl,
      marketingPower: label.marketingPower,
      marketingBudgetPerRelease,
      breakoutClause,
      durationYears,
      signedYear: currentYear,
      isDistributor: false,
      annualFee: 0
    };
  }

  /**
   * Genera un evento competitivo con ofertas contrastantes de diferentes sellos (Mercado de Fichajes / Guerra de Ofertas).
   */
  static generateCompetitiveBiddingWar(
    artist: Artist,
    world: WorldState
  ): Array<{ label: RecordLabel; contract: LabelContract }> {
    const candidateLabels = Object.values(world.labels).filter(l => l.id !== artist.labelId && l.type !== 'distributor');

    // Filtrar candidatos afines
    const majors = candidateLabels.filter(l => l.type === 'major' && (artist.stats.monthlyListeners >= (l.minMonthlyListeners || 0) * 0.7));
    const indies = candidateLabels.filter(l => (l.type === 'indie' || l.type === 'local_indie'));
    const boutiques = candidateLabels.filter(l => l.type === 'boutique');

    const selected: RecordLabel[] = [];

    // Priorizar un major fuerte y un indie representativo para contraste
    if (majors.length > 0) selected.push(majors[Math.floor(Math.random() * majors.length)]);
    if (indies.length > 0) selected.push(indies[Math.floor(Math.random() * indies.length)]);
    if (boutiques.length > 0 && selected.length < 3) selected.push(boutiques[0]);

    if (selected.length === 0) {
      selected.push(...candidateLabels.slice(0, 2));
    }

    return selected.map(label => ({
      label,
      contract: this.generateDynamicLabelOffer(artist, label, world.currentYear, world, true)
    }));
  }

  /**
   * Alias de compatibilidad para evaluar ofertas de sellos.
   */
  static evaluateLabelOffers(
    artist: Artist,
    world: WorldState
  ): Array<{ label: RecordLabel; contract: LabelContract }> {
    return this.generateCompetitiveBiddingWar(artist, world);
  }

  /**
   * Valida si el artista cumple los requisitos previos para contratar a un Manager.
   */
  static canHireManager(
    artist: Artist,
    manager: Manager
  ): { canHire: boolean; missingReasons: string[] } {
    const missing: string[] = [];

    if (artist.stats.monthlyListeners < manager.requirements.minMonthlyListeners) {
      missing.push(`Requiere al menos ${manager.requirements.minMonthlyListeners.toLocaleString()} oyentes mensuales (tenés ${artist.stats.monthlyListeners.toLocaleString()})`);
    }

    if (artist.stats.reputation < manager.requirements.minReputation) {
      missing.push(`Requiere reputación de ${manager.requirements.minReputation}% (tenés ${artist.stats.reputation}%)`);
    }

    if (artist.stats.funds < manager.requirements.hiringFee) {
      missing.push(`Requiere ${formatMoney(manager.requirements.hiringFee)} de tarifa inicial de contratación (tenés ${formatMoney(artist.stats.funds)})`);
    }

    return {
      canHire: missing.length === 0,
      missingReasons: missing
    };
  }

  /**
   * Contrata a un Manager descontando la tarifa inicial y actualizando el perfil del artista.
   */
  static hireManager(
    artist: Artist,
    manager: Manager,
    world: WorldState
  ): boolean {
    const check = this.canHireManager(artist, manager);
    if (!check.canHire) return false;

    artist.stats.funds = Math.max(0, artist.stats.funds - manager.requirements.hiringFee);
    artist.managerId = manager.id;

    world.news.unshift({
      id: `news_mgr_hire_${Date.now()}`,
      headline: `Alianza estratégica: ${artist.name} se une al equipo de ${manager.name}`,
      body: `${manager.name} asumió la representación oficial de ${artist.name} para potenciar sus giras y acuerdos en la industria.`,
      year: world.currentYear,
      month: world.currentMonth,
      category: 'industry',
      relatedArtistIds: [artist.id],
      sentiment: 'positive',
      importance: 3
    });

    return true;
  }

  /**
   * Rescinde el contrato de management actual.
   */
  static fireManager(
    artist: Artist,
    world: WorldState
  ) {
    const prevManagerId = artist.managerId;
    if (!prevManagerId) return;

    const prevManager = world.managers[prevManagerId];
    artist.managerId = null;

    world.news.unshift({
      id: `news_mgr_fire_${Date.now()}`,
      headline: `${artist.name} finaliza su vínculo de representación con ${prevManager?.name || 'su manager'}`,
      body: `El artista operará de forma independiente en sus próximas decisiones comerciales.`,
      year: world.currentYear,
      month: world.currentMonth,
      category: 'industry',
      relatedArtistIds: [artist.id],
      sentiment: 'neutral',
      importance: 2
    });
  }

  /**
   * Notifica el lanzamiento de un álbum para avanzar el cumplimiento del contrato discográfico.
   */
  static onAlbumReleased(
    artist: Artist,
    world: WorldState
  ): { contractCompleted: boolean; labelName?: string; remainingAlbums?: number } {
    if (!artist.activeContract) return { contractCompleted: false };

    // Los acuerdos de distribución digital no tienen cuotas de álbumes obligatorios para finalizar
    if (artist.activeContract.isDistributor || artist.activeContract.albumsRequired <= 0) {
      return { contractCompleted: false };
    }

    artist.activeContract.albumsDelivered += 1;
    const remaining = artist.activeContract.albumsRequired - artist.activeContract.albumsDelivered;

    if (remaining <= 0) {
      const label = world.labels[artist.activeContract.labelId];
      const labelName = label ? label.name : 'su discográfica';
      if (label && label.rosterArtistIds) {
        label.rosterArtistIds = label.rosterArtistIds.filter(id => id !== artist.id);
      }

      artist.activeContract = null;
      artist.labelId = null;
      artist.stats.reputation = Math.min(100, artist.stats.reputation + 10);
      artist.stats.hype = Math.min(100, artist.stats.hype + 15);

      world.news.unshift({
        id: `news_contract_fulfilled_${Date.now()}`,
        headline: `¡Agente Libre! ${artist.name} cumple su contrato discográfico con ${labelName}`,
        body: `Tras entregar todos los álbumes acordados, ${artist.name} queda como agente libre para negociar un nuevo contrato millonario o seguir como artista 100% independiente.`,
        year: world.currentYear,
        month: world.currentMonth,
        category: 'industry',
        relatedArtistIds: [artist.id],
        sentiment: 'positive',
        importance: 4
      });

      return {
        contractCompleted: true,
        labelName
      };
    }

    return {
      contractCompleted: false,
      remainingAlbums: remaining
    };
  }

  /**
   * Crea un sello discográfico propio propiedad del artista.
   */
  static createArtistOwnedLabel(
    artist: Artist,
    labelName: string,
    world: WorldState
  ): RecordLabel {
    const newLabelId = `label_artist_${artist.id}_${world.currentYear}`;
    const newLabel: RecordLabel = {
      id: newLabelId,
      name: labelName,
      type: 'artist_owned',
      country: artist.country,
      prestige: Math.floor(artist.stats.popularity * 0.9),
      budget: Math.floor(artist.stats.funds * 0.4),
      marketingPower: Math.floor(artist.stats.popularity * 0.85),
      creativeFreedomAllowed: 100,
      rosterArtistIds: [artist.id],
      favoredGenreIds: [artist.mainGenreId, ...artist.subGenreIds],
      ownerArtistId: artist.id,
      scoutingCriteria: 'Sello autogestionado fundado para retener el 100% de la visión conceptual y másters.'
    };

    artist.stats.funds = Math.max(0, artist.stats.funds - 25000); // Inversión de constitución legal
    artist.labelId = newLabelId;
    artist.activeContract = {
      labelId: newLabelId,
      signingBonus: 0,
      royaltyPercentage: 95,
      albumsRequired: 1,
      albumsDelivered: 0,
      creativeControl: 100,
      marketingPower: newLabel.marketingPower,
      marketingBudgetPerRelease: 20000,
      durationYears: 10,
      signedYear: world.currentYear
    };

    world.labels[newLabelId] = newLabel;

    world.news.unshift({
      id: `news_artist_label_${Date.now()}`,
      headline: `¡Paso histórico! ${artist.name} funda su propia discográfica: "${labelName}"`,
      body: `Con total independencia creativa y empresarial, ${artist.name} liderará sus futuros lanzamientos bajo su propio sello discográfico.`,
      year: world.currentYear,
      month: world.currentMonth,
      category: 'industry',
      relatedArtistIds: [artist.id],
      sentiment: 'positive',
      importance: 5
    });

    return newLabel;
  }

  /**
   * Valida si el artista cumple los requisitos mínimos de reputación, popularidad y oyentes
   * para trabajar con un productor musical de élite o consolidado.
   */
  static canWorkWithProducer(
    artist: Artist,
    producer?: Producer
  ): { canWork: boolean; missingReasons: string[] } {
    if (!producer || !producer.requirements) {
      return { canWork: true, missingReasons: [] };
    }

    const missing: string[] = [];

    if (producer.requirements.minReputation !== undefined && artist.stats.reputation < producer.requirements.minReputation) {
      missing.push(`Requiere ${producer.requirements.minReputation}% de reputación (tienes ${artist.stats.reputation}%)`);
    }

    if (producer.requirements.minPopularity !== undefined && artist.stats.popularity < producer.requirements.minPopularity) {
      missing.push(`Requiere ${producer.requirements.minPopularity}% de popularidad (tienes ${artist.stats.popularity}%)`);
    }

    if (producer.requirements.minMonthlyListeners !== undefined && artist.stats.monthlyListeners < producer.requirements.minMonthlyListeners) {
      missing.push(`Requiere ${producer.requirements.minMonthlyListeners.toLocaleString()} oyentes mensuales (tienes ${artist.stats.monthlyListeners.toLocaleString()})`);
    }

    return {
      canWork: missing.length === 0,
      missingReasons: missing
    };
  }

  /**
   * Deriva orgánicamente el rendimiento y la curva de longevidad del tema en base a:
   * performanceScore = (Calidad de Producción * 0.4) + (Inversión Marketing * 0.3) + (Creatividad/Skills * 0.2) + (Random Factor * 0.1).
   * Asigna la longevityCurve adecuada ('instant_classic', 'slow_burn', 'steady', 'explosive_drop', 'sleeper_viral')
   * según la performance, el perfil del artista y la aleatoriedad, sin requerir selección manual.
   */
  static deriveTrackPerformanceAndLongevity(params: {
    artist: Artist;
    productionBudget: number;
    marketingBudget: number;
    producer?: Producer;
    subGenreId?: string;
    musicVideo?: { budget: number; directorTier: string };
    qualityBonus?: number;
  }): TrackPerformanceEvaluation {
    const { artist, productionBudget, marketingBudget, producer, subGenreId, musicVideo, qualityBonus = 0 } = params;

    // 1. Calidad de Producción (0 - 100)
    // Se compone de inversión en producción + bonificación de calidad del productor + lifestyle/estudio + subgénero
    const subDetail = subGenreId ? SUBGENRE_DETAILS[subGenreId] : undefined;
    const prodQualityBoost = producer ? producer.qualityBoost * 2.5 : 12;
    const mvQualityBoost = musicVideo
      ? (musicVideo.directorTier === 'Director de Élite Mundial' ? 12 : musicVideo.directorTier === 'Estudio Indie' ? 7 : 3)
      : 0;
    const budgetProdScore = Math.min(55, (productionBudget / 10000) * 45);
    const productionQuality = Math.min(100, Math.max(10, Math.floor(
      budgetProdScore +
      prodQualityBoost +
      mvQualityBoost +
      qualityBonus +
      (subDetail?.qualityBonus ? subDetail.qualityBonus * 2 : 0) +
      (artist.personality.discipline * 0.15)
    )));

    // 2. Inversión Marketing & Alcance Comercial (0 - 100)
    // Presupuesto de campaña + impacto de videoclip + poder comercial y de rotación
    const mvMarketingBoost = musicVideo
      ? (musicVideo.directorTier === 'Director de Élite Mundial' ? 30 : musicVideo.directorTier === 'Estudio Indie' ? 16 : 6)
      : 0;
    const budgetMktScore = Math.min(60, (marketingBudget / 12000) * 50);
    const marketingInvestment = Math.min(100, Math.max(5, Math.floor(
      budgetMktScore +
      mvMarketingBoost +
      (artist.personality.commercialAppeal * 0.25) +
      (subDetail?.commercialBonus ? subDetail.commercialBonus * 1.5 : 0)
    )));

    // 3. Creatividad & Skills (0 - 100)
    const creativitySkills = Math.min(100, Math.max(10, Math.floor(
      (artist.personality.creativity * 0.50) +
      (artist.personality.skill * 0.35) +
      (artist.personality.originality * 0.15)
    )));

    // 4. Random Factor (0 - 100)
    const randomFactor = Math.floor(Math.random() * 101);

    // Formula estricta requerida:
    // performanceScore = (Calidad de Producción * 0.4) + (Inversión Marketing * 0.3) + (Creatividad/Skills * 0.2) + (Random Factor * 0.1)
    const performanceScore = Math.min(100, Math.max(5, Math.floor(
      (productionQuality * 0.4) +
      (marketingInvestment * 0.3) +
      (creativitySkills * 0.2) +
      (randomFactor * 0.1)
    )));

    // 5. Asignación orgánica de LongevityCurve sin requerir selección manual
    let longevityCurve: LongevityCurve = 'steady';

    const p = artist.personality;
    const s = artist.stats;
    const roll = Math.random();

    // Instant Classic: Alto rendimiento general (80+), alta creatividad y maestría técnica con visión estética
    if (performanceScore >= 78 && p.creativity >= 70 && p.skill >= 70 && (s.artisticCredibility >= 50 || p.originality >= 68)) {
      if (roll < 0.65) {
        longevityCurve = 'instant_classic';
      } else {
        longevityCurve = 'steady';
      }
    }
    // Explosive Drop: Alto marketing y atractivo comercial comercial pero menor profundidad original
    else if ((marketingInvestment >= 65 || p.commercialAppeal >= 72) && p.originality < 65 && performanceScore >= 55) {
      if (roll < 0.60) {
        longevityCurve = 'explosive_drop';
      } else {
        longevityCurve = 'steady';
      }
    }
    // Slow Burn: Alta originalidad/creatividad con marketing medido, que florece gradualmente por boca a boca
    else if ((p.originality >= 70 || p.creativity >= 75) && marketingInvestment < 65 && performanceScore >= 45) {
      if (roll < 0.55) {
        longevityCurve = 'slow_burn';
      } else {
        longevityCurve = 'steady';
      }
    }
    // Sleeper Viral: Alto carisma, tolerancia al riesgo, impacto visual o factor sorpresa
    else if ((p.charisma >= 75 || p.riskTolerance >= 75 || Boolean(musicVideo)) && (roll < 0.35 || randomFactor >= 85)) {
      longevityCurve = 'sleeper_viral';
    }
    // Asignación probabilística balanceada según el score
    else {
      if (performanceScore >= 75 && roll < 0.25) {
        longevityCurve = 'instant_classic';
      } else if (roll < 0.20) {
        longevityCurve = 'slow_burn';
      } else if (roll < 0.35) {
        longevityCurve = 'explosive_drop';
      } else if (roll < 0.45) {
        longevityCurve = 'sleeper_viral';
      } else {
        longevityCurve = 'steady';
      }
    }

    return {
      performanceScore,
      longevityCurve,
      productionQuality,
      marketingInvestment,
      creativitySkills,
      randomFactor
    };
  }
}

