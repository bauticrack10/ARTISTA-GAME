import { Artist, RecordLabel, LabelContract, WorldState } from '../types';

export class IndustryEngine {
  static evaluateLabelOffers(
    artist: Artist,
    world: WorldState
  ): Array<{ label: RecordLabel; contract: LabelContract }> {
    if (artist.labelId) return []; // Already signed

    const eligibleOffers: Array<{ label: RecordLabel; contract: LabelContract }> = [];

    for (const label of Object.values(world.labels)) {
      // Check if artist matches label prestige & genre
      const prestigeMatch = artist.stats.popularity >= (label.prestige - 30);
      const genreMatch = label.favoredGenreIds.includes(artist.mainGenreId) || label.favoredGenreIds.length === 0;

      if (prestigeMatch && genreMatch) {
        let advance = Math.floor((artist.stats.popularity * 2500) + (label.budget * 0.05));
        let royaltyPct = 20;
        let creativeControl = label.creativeFreedomAllowed;
        let requiredAlbums = 3;

        if (label.type === 'major') {
          royaltyPct = 22;
          advance = Math.max(100000, advance * 1.5);
          creativeControl = Math.min(50, label.creativeFreedomAllowed);
        } else if (label.type === 'indie') {
          royaltyPct = 60;
          advance = Math.floor(advance * 0.6);
          creativeControl = 80;
          requiredAlbums = 2;
        } else if (label.type === 'boutique') {
          royaltyPct = 75;
          advance = Math.floor(advance * 0.3);
          creativeControl = 95;
          requiredAlbums = 1;
        }

        const contract: LabelContract = {
          labelId: label.id,
          signingBonus: advance,
          royaltyPercentage: royaltyPct,
          albumsRequired: requiredAlbums,
          albumsDelivered: 0,
          creativeControl,
          marketingPower: label.marketingPower,
          durationYears: 3 + Math.floor(Math.random() * 2),
          signedYear: world.currentYear
        };

        eligibleOffers.push({ label, contract });
      }
    }

    return eligibleOffers;
  }

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
      ownerArtistId: artist.id
    };

    return newLabel;
  }
}
