import { Artist, CareerStage, CareerEra, WorldState } from '../types';

export class LegacyEngine {
  static evaluateCareerStage(
    artist: Artist,
    yearsActive: number,
    totalHitsCount: number
  ): CareerStage {
    const pop = artist.stats.popularity;
    const cred = artist.stats.artisticCredibility;
    const streams = artist.stats.totalStreams;

    if (artist.isRetired) return 'Retired';

    if (yearsActive >= 25 && (pop >= 70 || cred >= 90 || artist.legacyScore >= 85)) {
      return 'Legend';
    }

    if (yearsActive >= 15 && pop >= 60) {
      return 'Veteran';
    }

    if (artist.careerStage === 'Declining' && pop >= 75) {
      return 'Comeback';
    }

    if (pop >= 90 || streams > 5000000000) {
      return 'Superstar';
    }

    if (pop >= 75 || streams > 1000000000) {
      return 'Mainstream';
    }

    if (pop >= 55 || streams > 150000000) {
      return 'Established';
    }

    if (pop >= 35 || totalHitsCount >= 1) {
      return 'Breakout';
    }

    if (pop >= 18 || streams > 500000) {
      return 'Emerging';
    }

    if (yearsActive >= 6 && pop < 25) {
      return 'Declining';
    }

    return 'Underground';
  }

  static calculateLegacyScore(artist: Artist, totalHits: number, numberOfNo1s: number): number {
    let score = 0;

    // Career longevity
    const yearsActive = Math.max(0, 2026 - artist.careerStartYear);
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
}
