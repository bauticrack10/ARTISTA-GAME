import { Artist, RecordLabel, LabelContract, WorldState, Manager } from '../types';

export interface ScoutRadarStatus {
  monthlyListeners: number;
  thresholdListeners: number;
  progressPercentage: number;
  scoutInterestLevel: 'unnoticed' | 'emerging_scouting' | 'high_priority' | 'bidding_war_target';
  scoutingLabels: RecordLabel[];
  statusMessage: string;
}

export class IndustryEngine {
  public static readonly MIN_MONTHLY_LISTENERS_FOR_MAJOR_SCOUTS = 100000;
  public static readonly MIN_MONTHLY_LISTENERS_FOR_UNDERGROUND_BOUTIQUE = 20000;

  /**
   * Evalúa el estado del radar de cazatalentos (A&R) para el artista.
   * No ofrece contratos a demanda estáticos, sino que mide el interés y los sellos en seguimiento.
   */
  static evaluateScoutRadar(
    artist: Artist,
    world: WorldState
  ): ScoutRadarStatus {
    const listeners = artist.stats.monthlyListeners;
    const threshold = this.MIN_MONTHLY_LISTENERS_FOR_MAJOR_SCOUTS;
    const progressPercentage = Math.min(100, Math.floor((listeners / threshold) * 100));

    let scoutInterestLevel: ScoutRadarStatus['scoutInterestLevel'] = 'unnoticed';
    let statusMessage = 'Los cazatalentos de las Majors aún no tienen tus métricas en el radar comercial masivo.';

    if (listeners >= threshold) {
      scoutInterestLevel = 'bidding_war_target';
      statusMessage = '¡Objetivo de mercado! Múltiples directivos de A&R compiten activamente por presentar ofertas millonarias en eventos emergentes.';
    } else if (listeners >= 60000) {
      scoutInterestLevel = 'high_priority';
      statusMessage = 'Prioridad alta en mesas de A&R. Sellos independientes y majors siguen tus lanzamientos a la espera de consolidar 100.000 oyentes.';
    } else if (listeners >= this.MIN_MONTHLY_LISTENERS_FOR_UNDERGROUND_BOUTIQUE) {
      scoutInterestLevel = 'emerging_scouting';
      statusMessage = 'Colectivos independientes y sellos boutique underground están monitoreando tu crecimiento en la escena.';
    }

    // Filtrar sellos afines al género o escena
    const scoutingLabels = Object.values(world.labels).filter(l => {
      const genreMatch = l.favoredGenreIds.includes(artist.mainGenreId) || l.favoredGenreIds.length === 0;
      if (l.type === 'boutique') {
        return genreMatch && (listeners >= this.MIN_MONTHLY_LISTENERS_FOR_UNDERGROUND_BOUTIQUE || artist.stats.artisticCredibility >= 60);
      }
      return genreMatch && listeners >= 30000;
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
   * Genera una propuesta de contrato dinámico y personalizado según métricas reales del artista y filosofía del sello.
   */
  static generateDynamicLabelOffer(
    artist: Artist,
    label: RecordLabel,
    currentYear: number
  ): LabelContract {
    const listeners = Math.max(10000, artist.stats.monthlyListeners);
    const pop = artist.stats.popularity;

    let advance = 0;
    let royaltyPct = 20;
    let creativeControl = label.creativeFreedomAllowed;
    let requiredAlbums = 3;
    let marketingBudgetPerRelease = 10000;
    let breakoutClause = 50000;

    if (label.type === 'major') {
      // Majors: Grandes adelantos, altos presupuestos, menores regalías para el artista, menor control
      advance = Math.floor(100000 + (listeners * 0.45) + (pop * 2000) + (label.budget * 0.03));
      royaltyPct = 20 + Math.min(6, Math.floor(artist.personality.ambition / 25));
      creativeControl = Math.min(50, label.creativeFreedomAllowed);
      requiredAlbums = 3 + (listeners > 500000 ? 1 : 0);
      marketingBudgetPerRelease = Math.floor(35000 + (label.marketingPower * 600));
      breakoutClause = advance * 3;
    } else if (label.type === 'indie') {
      // Indie: Regalías justas (55-65%), libertad creativa alta, adelantos moderados
      advance = Math.floor(35000 + (listeners * 0.25) + (pop * 1200));
      royaltyPct = 58 + Math.min(10, Math.floor(artist.personality.independence / 15));
      creativeControl = Math.min(88, label.creativeFreedomAllowed + 5);
      requiredAlbums = 2;
      marketingBudgetPerRelease = Math.floor(15000 + (label.marketingPower * 350));
      breakoutClause = advance * 2;
    } else if (label.type === 'boutique') {
      // Boutique: Máxima libertad creativa (90-98%), 75-80% de regalías, adelantos boutique
      advance = Math.floor(10000 + (listeners * 0.1) + (artist.stats.artisticCredibility * 300));
      royaltyPct = 75 + Math.min(8, Math.floor(artist.stats.artisticCredibility / 20));
      creativeControl = 95;
      requiredAlbums = 1;
      marketingBudgetPerRelease = Math.floor(5000 + (label.marketingPower * 180));
      breakoutClause = advance * 1.5;
    }

    return {
      labelId: label.id,
      signingBonus: advance,
      royaltyPercentage: Math.min(95, royaltyPct),
      albumsRequired: requiredAlbums,
      albumsDelivered: 0,
      creativeControl,
      marketingPower: label.marketingPower,
      marketingBudgetPerRelease,
      breakoutClause,
      durationYears: requiredAlbums + 1,
      signedYear: currentYear
    };
  }

  /**
   * Genera un evento competitivo con ofertas contrastantes de diferentes sellos (Mercado de Fichajes / Guerra de Ofertas).
   */
  static generateCompetitiveBiddingWar(
    artist: Artist,
    world: WorldState
  ): Array<{ label: RecordLabel; contract: LabelContract }> {
    const candidateLabels = Object.values(world.labels).filter(l => l.id !== artist.labelId);
    
    // Filtrar candidatos afines
    const majors = candidateLabels.filter(l => l.type === 'major');
    const indies = candidateLabels.filter(l => l.type === 'indie');
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
      contract: this.generateDynamicLabelOffer(artist, label, world.currentYear)
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
      missing.push(`Requiere $${manager.requirements.hiringFee.toLocaleString()} de tarifa inicial de contratación (tenés $${artist.stats.funds.toLocaleString()})`);
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

    artist.activeContract.albumsDelivered += 1;
    const remaining = artist.activeContract.albumsRequired - artist.activeContract.albumsDelivered;

    if (remaining <= 0) {
      const label = world.labels[artist.activeContract.labelId];
      const labelName = label ? label.name : 'su discográfica';

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
}

