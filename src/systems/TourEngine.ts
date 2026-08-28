import { Artist, Tour, TourTier, TourStop, WorldState } from '../types';
import { CITIES_BY_REGION } from '../data/proceduralNames';

export const MIN_TOUR_ENERGY = 85;
export const MIN_TOUR_LISTENERS = 1000;
export const MIN_TOUR_SONGS = 2;

export class TourEngine {
  static canStartTour(
    artist: Artist,
    songsOrWorld: number | WorldState = 0,
    albumsCount: number = 0
  ): { allowed: boolean; reason?: string } {
    let songs = 0;
    let albums = 0;

    if (typeof songsOrWorld === 'object' && songsOrWorld !== null && 'songs' in songsOrWorld) {
      const world = songsOrWorld as WorldState;
      songs = Object.values(world.songs || {}).filter(s => s.artistId === artist.id).length;
      albums = Object.values(world.albums || {}).filter(a => a.artistId === artist.id).length;
    } else if (typeof songsOrWorld === 'number') {
      songs = songsOrWorld;
      albums = albumsCount;
    }

    const hasCatalog = songs >= MIN_TOUR_SONGS || albums >= 1;
    const hasAudience = artist.stats.monthlyListeners >= MIN_TOUR_LISTENERS;
    const hasEnergy = artist.stats.energy >= MIN_TOUR_ENERGY;

    if (!hasCatalog || !hasAudience || !hasEnergy) {
      return {
        allowed: false,
        reason: 'Necesitas catálogo y fans para vender entradas (mín. 2 temas o 1 EP, ≥1.000 oyentes y ≥85% energía).'
      };
    }

    return { allowed: true };
  }

  static getAvailableTiersForArtist(artist: Artist): TourTier[] {
    const pop = artist.stats.popularity;
    const listeners = artist.stats.monthlyListeners;
    const tiers: TourTier[] = ['club'];

    if (pop >= 35 && listeners >= 20000) tiers.push('theater');
    if (pop >= 55 && listeners >= 120000) tiers.push('arena');
    if (pop >= 65 && listeners >= 250000) tiers.push('festival_circuit');
    if (pop >= 75 && listeners >= 600000) tiers.push('stadium');
    if (pop >= 85 && listeners >= 1500000) tiers.push('world_tour');

    return tiers;
  }

  static generateTourPlan(
    artist: Artist,
    tier: TourTier,
    tourName: string,
    currentYear: number,
    currentMonth: number,
    songsOrWorld: number | WorldState = 2,
    albumsCount: number = 0
  ): Tour {
    const validation = this.canStartTour(artist, songsOrWorld, albumsCount);
    if (!validation.allowed) {
      throw new Error(validation.reason || 'Necesitas catálogo y fans para vender entradas (mín. 2 temas o 1 EP, ≥1.000 oyentes y ≥85% energía).');
    }
    const stops: TourStop[] = [];
    let ticketPrice = 18;
    let stopCount = 4;
    let targetCapacityBase = 350;
    let profitMargin = 0.40;

    if (tier === 'club') {
      ticketPrice = 18;
      stopCount = 4;
      targetCapacityBase = 350;
      profitMargin = 0.40; // 40% neto (costos fijos de sala y traslado)
    } else if (tier === 'theater') {
      ticketPrice = 35;
      stopCount = 5;
      targetCapacityBase = 1400;
      profitMargin = 0.48;
    } else if (tier === 'arena') {
      ticketPrice = 70;
      stopCount = 6;
      targetCapacityBase = 7500;
      profitMargin = 0.52;
    } else if (tier === 'festival_circuit') {
      ticketPrice = 90;
      stopCount = 5;
      targetCapacityBase = 18000;
      profitMargin = 0.54;
    } else if (tier === 'stadium') {
      ticketPrice = 110;
      stopCount = 6;
      targetCapacityBase = 35000;
      profitMargin = 0.55;
    } else if (tier === 'world_tour') {
      ticketPrice = 130;
      stopCount = 10;
      targetCapacityBase = 30000;
      profitMargin = 0.58;
    }

    // Pick cities based on tier
    const allCitiesList = Object.values(CITIES_BY_REGION).flat();
    const shuffled = [...allCitiesList].sort(() => 0.5 - Math.random());
    const selectedCities = shuffled.slice(0, stopCount);

    let totalCapacity = 0;
    let totalTicketsSold = 0;
    let grossRevenue = 0;

    // Demanda real de audiencia: las ventas están ancladas a fans y oyentes mensuales reales
    const activeAudienceDemand = Math.floor(
      (artist.stats.fansCount || 500) * 0.20 + (artist.stats.monthlyListeners || 500) * 0.05
    );
    const maxTicketsPerStop = Math.max(25, Math.floor(activeAudienceDemand / Math.max(1, stopCount * 0.65)));

    for (const city of selectedCities) {
      const cap = Math.min(city.venueCapacity, targetCapacityBase);
      // Sold percentage based on popularity, charisma and local fan penetration
      const popRatio = Math.max(0.05, artist.stats.popularity / 100);
      const selloutRatio = Math.min(1.0, (popRatio * 1.1) * (0.8 + Math.random() * 0.3));
      const demandSold = Math.min(cap, maxTicketsPerStop);
      const ticketsSold = Math.max(10, Math.min(cap, Math.floor(demandSold * selloutRatio)));
      const rev = ticketsSold * ticketPrice;
      const successRating = Math.floor(Math.min(100, (ticketsSold / cap) * 100));

      stops.push({
        city: city.name,
        country: city.country,
        capacity: cap,
        ticketsSold,
        ticketPrice,
        revenue: rev,
        successRating
      });

      totalCapacity += cap;
      totalTicketsSold += ticketsSold;
      grossRevenue += rev;
    }

    // Artist net profit: gross minus production, venue rent, crew
    const netArtistProfit = Math.floor(grossRevenue * profitMargin);
    const energyFatigue = Math.min(50, Math.floor(stopCount * 4.5));
    const hypeGenerated = Math.floor(Math.min(30, (totalTicketsSold / 4000) * 8 + 4));
    const fanbaseGained = Math.floor(totalTicketsSold * 0.25);

    const tour: Tour = {
      id: `tour_${artist.id}_${currentYear}_${currentMonth}`,
      name: tourName,
      artistId: artist.id,
      tier,
      year: currentYear,
      month: currentMonth,
      durationMonths: Math.ceil(stopCount / 3),
      stops,
      totalCapacity,
      totalTicketsSold,
      grossRevenue,
      netArtistProfit,
      energyFatigue,
      hypeGenerated,
      fanbaseGained
    };

    return tour;
  }
}
