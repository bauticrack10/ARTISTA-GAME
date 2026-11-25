import { Artist, CareerStage, CareerEra, WorldState, CareerGoal } from '../types';

export class LegacyEngine {
  static evaluateCareerStage(
    artist: Artist,
    yearsActive: number,
    totalHitsCount: number
  ): CareerStage {
    const pop = artist.stats.popularity;
    const cred = artist.stats.artisticCredibility;
    const streams = artist.stats.totalStreams;
    const hype = artist.stats.hype ?? 0;
    const listeners = artist.stats.monthlyListeners ?? 0;

    if (artist.isRetired) return 'Retired';

    if (yearsActive >= 25 && (pop >= 70 || cred >= 90 || artist.legacyScore >= 85)) {
      return 'Legend';
    }

    if (artist.careerStage === 'Declining' && (pop >= 55 || (pop >= 45 && hype >= 65))) {
      return 'Comeback';
    }

    if (pop >= 90 || streams > 5000000000) {
      return 'Superstar';
    }

    if (yearsActive >= 15 && pop >= 60) {
      return 'Veteran';
    }

    if (pop >= 75 || streams > 1000000000) {
      return 'Mainstream';
    }

    if (
      yearsActive >= 6 &&
      pop < 35 &&
      (artist.careerStage === 'Breakout' ||
        artist.careerStage === 'Established' ||
        artist.careerStage === 'Mainstream' ||
        artist.careerStage === 'Superstar' ||
        artist.careerStage === 'Declining' ||
        pop < 25)
    ) {
      return 'Declining';
    }

    if (pop >= 55 || streams > 150000000) {
      return 'Established';
    }

    if (pop >= 35 || totalHitsCount >= 1) {
      return 'Breakout';
    }

    const hasCatalogOrAudience = listeners >= 2000 || streams > 0 || Boolean(artist.lastReleaseYear);
    if (hasCatalogOrAudience && (pop >= 18 || streams > 500000 || listeners >= 2000)) {
      return 'Emerging';
    }

    return 'Underground';
  }

  static calculateLegacyScore(artist: Artist, totalHits: number, numberOfNo1s: number, currentYear: number = 2026): number {
    let score = 0;

    // Career longevity
    const yearsActive = Math.max(0, currentYear - artist.careerStartYear);
    score += Math.min(25, yearsActive * 1.0);

    // Streams & Popularity peak
    score += Math.min(25, (artist.stats.totalStreams / 1000000000) * 3);

    // Hits & #1s
    score += Math.min(20, (totalHits * 2) + (numberOfNo1s * 4));

    // Awards
    score += Math.min(15, artist.awardsWon.length * 2.5);

    // Artistic Credibility & Reputation
    score += Math.min(15, (artist.stats.artisticCredibility * 0.08) + (artist.stats.reputation * 0.07));

    return Math.floor(Math.min(100, score));
  }

  static checkAndCreateEra(artist: Artist, currentYear: number, currentMonth: number): CareerEra | null {
    const currentStage = artist.careerStage;
    const lastEra = artist.eras[artist.eras.length - 1];

    if (!lastEra || lastEra.stage !== currentStage) {
      const eraNamesByStage: Record<CareerStage, string[]> = {
        Underground: ['Los Primeros Pasos & Grabaciones Caseras', 'El Ascenso Silencioso', 'Bocetos y Plazas'],
        Emerging: ['La Primera Ola de Oyentes', 'El Despertar en Redes', 'La Chispa Inicial'],
        Breakout: ['La Ruptura Mainstream', 'El Primer Gran Himno', 'Consagración Debutante'],
        Established: ['Consolidación del Sonido Propio', 'Madurez y Estilo', 'El Territorio Ganado'],
        Mainstream: ['En la Cima de las Radios & Playlists', 'El Dominio Pop', 'Giras Masivas'],
        Superstar: ['El Trono Mundial & Los Estadios', 'Impacto Planetario', 'La Era de Oro'],
        Declining: ['La Búsqueda Interior & Pausa', 'El Desgaste del Éxito', 'Tiempos de Cambio'],
        Comeback: ['El Gran Resurgimiento', 'Segunda Época Dorada', 'La Vuelta del Ídolo'],
        Veteran: ['La Maestría de los Años', 'El Catálogo Inmortal', 'Voz Autorizada'],
        Legend: ['La Inmortalidad Cultural', 'El Mito Viviente', 'El Gran Legado'],
        Retired: ['El Descanso de la Leyenda', 'El Archivo Histórico', 'Memorias de una Vida']
      };

      const candidates = eraNamesByStage[currentStage] || ['Nueva Era Artística'];
      const eraName = candidates[Math.floor(Math.random() * candidates.length)];

      if (lastEra) {
        lastEra.endYear = currentYear;
        lastEra.endMonth = currentMonth;
      }

      const newEra: CareerEra = {
        id: `era_${artist.id}_${currentYear}_${currentMonth}`,
        name: eraName,
        startYear: currentYear,
        startMonth: currentMonth,
        genreFocus: artist.mainGenreId,
        stage: currentStage,
        highlightSummary: `Transición a la etapa ${currentStage} con impacto cultural en ${currentYear}.`
      };

      artist.eras.push(newEra);
      return newEra;
    }

    return null;
  }

  /**
   * Genera 12 objetivos progresivos de carrera escalonados por etapa con seguimiento real y recompensas.
   */
  static getCareerGoals(artist: Artist, world: WorldState): CareerGoal[] {
    const artistSongs = Object.values(world.songs || {}).filter(s => s && s.artistId === artist.id);
    const artistAlbums = Object.values(world.albums || {}).filter(a => a && a.artistId === artist.id);
    const artistTours = (world.tours || []).filter(t => t && t.artistId === artist.id);
    const liveShows = artist.livePerformanceHistory || [];
    const collabSongs = artistSongs.filter(s => s.featuredArtistIds && s.featuredArtistIds.length > 0);
    const top10Hits = artistSongs.filter(s =>
      Object.values(s.peakPosition || {}).some(pos => typeof pos === 'number' && pos <= 10)
    );
    const no1Hits = artistSongs.filter(s =>
      Object.values(s.peakPosition || {}).some(pos => pos === 1)
    );
    const certsCount = (artist.officialCertifications || []).length;
    const awardsCount = (artist.awardsWon || []).length;
    const completedSet = new Set(artist.completedGoalIds || []);
    const claimedSet = new Set(artist.claimedGoalIds || []);

    const defs: Array<Omit<CareerGoal, 'completed' | 'claimed'>> = [
      {
        id: 'goal_first_single',
        title: 'Primer Corte Publicado',
        description: 'Graba y publica tu primera canción oficial en plataformas digitales.',
        stage: 'Underground',
        progress: artistSongs.length,
        target: 1,
        unit: 'temas',
        rewardLabel: '+$1,500 • +8 Hype',
        rewardFunds: 1500,
        rewardHype: 8,
        ctaTab: 'studio'
      },
      {
        id: 'goal_first_studio_gear',
        title: 'Equipar el Home Studio',
        description: 'Adquiere al menos 1 artículo de equipamiento o estudio en la Tienda.',
        stage: 'Underground',
        progress: (artist.lifestyleUpgrades || []).length,
        target: 1,
        unit: 'artículos',
        rewardLabel: '+$1,000 • +3 Reputación',
        rewardFunds: 1000,
        rewardReputation: 3,
        ctaTab: 'lifestyle'
      },
      {
        id: 'goal_10k_streams',
        title: 'Romper los 10.000 Streams',
        description: 'Supera las 10.000 reproducciones acumuladas con tu catálogo.',
        stage: 'Underground',
        progress: artist.stats.totalStreams,
        target: 10000,
        unit: 'streams',
        rewardLabel: '+$2,500 • +10 Hype',
        rewardFunds: 2500,
        rewardHype: 10,
        ctaTab: 'streaming'
      },
      {
        id: 'goal_emerging_25k',
        title: 'Onda Expansiva: 25K Oyentes',
        description: 'Alcanza los 25.000 oyentes mensuales activos en streaming.',
        stage: 'Emerging',
        progress: artist.stats.monthlyListeners,
        target: 25000,
        unit: 'oyentes',
        rewardLabel: '+$5,000 • +10 Hype',
        rewardFunds: 5000,
        rewardHype: 10,
        ctaTab: 'streaming'
      },
      {
        id: 'goal_first_collab',
        title: 'Alianza de Escena',
        description: 'Publica tu primera colaboración oficial junto a otro artista.',
        stage: 'Emerging',
        progress: collabSongs.length,
        target: 1,
        unit: 'feats',
        rewardLabel: '+$4,000 • +5 Reputación',
        rewardFunds: 4000,
        rewardReputation: 5,
        ctaTab: 'relationships'
      },
      {
        id: 'goal_first_tour',
        title: 'Bautismo en Vivo',
        description: 'Completa tu primera gira de clubes o actuación en festival.',
        stage: 'Breakout',
        progress: artistTours.length + liveShows.length,
        target: 1,
        unit: 'shows/giras',
        rewardLabel: '+$8,000 • +12 Hype',
        rewardFunds: 8000,
        rewardHype: 12,
        ctaTab: 'tours'
      },
      {
        id: 'goal_first_album',
        title: 'Obra Conceptual (EP o LP)',
        description: 'Publica tu primer álbum, EP o mixtape de estudio.',
        stage: 'Breakout',
        progress: artistAlbums.length,
        target: 1,
        unit: 'proyectos',
        rewardLabel: '+$12,000 • +6 Reputación',
        rewardFunds: 12000,
        rewardReputation: 6,
        ctaTab: 'studio'
      },
      {
        id: 'goal_top10_chart',
        title: 'Irrumpir en el Top 10',
        description: 'Posiciona al menos una canción dentro del Top 10 de cualquier chart.',
        stage: 'Established',
        progress: top10Hits.length,
        target: 1,
        unit: 'hits Top 10',
        rewardLabel: '+$20,000 • +15 Hype • +3 Legado',
        rewardFunds: 20000,
        rewardHype: 15,
        rewardLegacy: 3,
        ctaTab: 'charts'
      },
      {
        id: 'goal_first_gold',
        title: 'Primera Placa Oficial',
        description: 'Consigue tu primer Disco de Oro, Platino o Diamante certificado.',
        stage: 'Established',
        progress: certsCount,
        target: 1,
        unit: 'placas',
        rewardLabel: '+$35,000 • +8 Reputación • +5 Legado',
        rewardFunds: 35000,
        rewardReputation: 8,
        rewardLegacy: 5,
        ctaTab: 'awards'
      },
      {
        id: 'goal_1m_listeners',
        title: 'Club del Millón de Oyentes',
        description: 'Supera 1.000.000 de oyentes mensuales simultáneos.',
        stage: 'Mainstream',
        progress: artist.stats.monthlyListeners,
        target: 1000000,
        unit: 'oyentes',
        rewardLabel: '+$75,000 • +15 Hype • +6 Legado',
        rewardFunds: 75000,
        rewardHype: 15,
        rewardLegacy: 6,
        ctaTab: 'streaming'
      },
      {
        id: 'goal_first_award',
        title: 'Consagración en la Academia',
        description: 'Gana tu primer galardón en los Premios de la Academia Musical.',
        stage: 'Mainstream',
        progress: awardsCount,
        target: 1,
        unit: 'premios',
        rewardLabel: '+$100,000 • +10 Reputación • +8 Legado',
        rewardFunds: 100000,
        rewardReputation: 10,
        rewardLegacy: 8,
        ctaTab: 'awards'
      },
      {
        id: 'goal_global_icon',
        title: 'Trono Global (#1 & 100M Streams)',
        description: 'Alcanza un #1 en charts y supera los 100.000.000 de streams totales.',
        stage: 'Superstar',
        progress: no1Hits.length > 0 ? artist.stats.totalStreams : Math.min(artist.stats.totalStreams, 99999999),
        target: 100000000,
        unit: 'streams',
        rewardLabel: '+$250,000 • +10 Legado',
        rewardFunds: 250000,
        rewardLegacy: 10,
        ctaTab: 'legacy'
      }
    ];

    return defs.map(g => {
      const isDone = g.progress >= g.target || completedSet.has(g.id);
      return {
        ...g,
        completed: isDone,
        claimed: claimedSet.has(g.id)
      };
    });
  }
}
