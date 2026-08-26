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
    const tiers: TourTier[] = ['club'];

    if (pop >= 25) tiers.push('theater');
    if (pop >= 50) tiers.push('arena');
    if (pop >= 70) tiers.push('festival_circuit');
    if (pop >= 80) tiers.push('stadium');
    if (pop >= 85) tiers.push('world_tour');

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
    let ticketPrice = 25;
    let stopCount = 4;
    let targetCapacityBase = 1000;

    if (tier === 'club') {
      ticketPrice = 20;
      stopCount = 4;
      targetCapacityBase = 800;
    } else if (tier === 'theater') {
      ticketPrice = 45;
      stopCount = 6;
      targetCapacityBase = 3500;
    } else if (tier === 'arena') {
      ticketPrice = 85;
      stopCount = 8;
      targetCapacityBase = 15000;
    } else if (tier === 'festival_circuit') {
      ticketPrice = 110;
      stopCount = 5;
      targetCapacityBase = 30000;
    } else if (tier === 'stadium') {
      ticketPrice = 120;
      stopCount = 6;
      targetCapacityBase = 50000;
    } else if (tier === 'world_tour') {
      ticketPrice = 140;
      stopCount = 12;
      targetCapacityBase = 40000;
    }

    // Pick cities based on tier
    const allCitiesList = Object.values(CITIES_BY_REGION).flat();
    const shuffled = [...allCitiesList].sort(() => 0.5 - Math.random());
    const selectedCities = shuffled.slice(0, stopCount);

    let totalCapacity = 0;
    let totalTicketsSold = 0;
    let grossRevenue = 0;

    for (const city of selectedCities) {
      const cap = Math.min(city.venueCapacity, targetCapacityBase);
      // Sold percentage based on popularity and charisma
      const selloutRatio = Math.min(1.0, (artist.stats.popularity / 90) * (0.8 + Math.random() * 0.3));
      const ticketsSold = Math.floor(cap * selloutRatio);
      const rev = ticketsSold * ticketPrice;
      const successRating = Math.floor(selloutRatio * 100);

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

    // Artist net profit: gross minus production, venue rent, crew (approx 55% net)
    const netArtistProfit = Math.floor(grossRevenue * 0.55);
    const energyFatigue = Math.min(50, Math.floor(stopCount * 4.5));
    const hypeGenerated = Math.floor((totalTicketsSold / 5000) * 8);
    const fanbaseGained = Math.floor(totalTicketsSold * 0.35);

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
