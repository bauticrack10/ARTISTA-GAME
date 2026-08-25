import { Artist, RecordLabel, Manager } from '../types';

export class EconomyEngine {
  // Average streaming payout per 1,000 streams in USD (~$3.50 gross)
  static STREAM_PAYOUT_PER_THOUSAND = 3.5;

  static calculateMonthlyFinances(
    artist: Artist,
    totalMonthlyStreams: number,
    label: RecordLabel | undefined,
    manager: Manager | undefined
  ): {
    streamingRevenueGross: number;
    artistStreamingNet: number;
    merchRevenue: number;
    expensesLivingAndCrew: number;
    managerCommission: number;
    netMonthlyProfit: number;
  } {
    const grossStreaming = (totalMonthlyStreams / 1000) * this.STREAM_PAYOUT_PER_THOUSAND;

    // Label royalty split
    let artistRoyaltyPct = 100;
    if (label) {
      if (label.type === 'major') artistRoyaltyPct = 22;
      else if (label.type === 'indie') artistRoyaltyPct = 65;
      else if (label.type === 'boutique') artistRoyaltyPct = 75;
      else if (label.type === 'artist_owned') artistRoyaltyPct = 95;
    }

    const artistStreamingNet = grossStreaming * (artistRoyaltyPct / 100);

    // Merchandise revenue scales with fan loyalty and popularity
    const merchRevenue = (artist.stats.fansCount * 0.04) * (artist.stats.fanbaseLoyalty / 100) * (artist.stats.popularity / 100);

    // Monthly baseline expenses (lifestyle, studio upkeep, basic legal)
    let expensesLivingAndCrew = 1200;
    if (artist.stats.popularity > 80) expensesLivingAndCrew = 25000;
    else if (artist.stats.popularity > 50) expensesLivingAndCrew = 6000;
    else if (artist.stats.popularity > 25) expensesLivingAndCrew = 2500;

    // Manager commission
    let managerCommission = 0;
    if (manager) {
      const grossIncome = artistStreamingNet + merchRevenue;
      managerCommission = grossIncome * (manager.commissionFeePct / 100);
    }

    const netMonthlyProfit = Math.floor(artistStreamingNet + merchRevenue - expensesLivingAndCrew - managerCommission);

    return {
      streamingRevenueGross: Math.floor(grossStreaming),
      artistStreamingNet: Math.floor(artistStreamingNet),
      merchRevenue: Math.floor(merchRevenue),
      expensesLivingAndCrew: Math.floor(expensesLivingAndCrew),
      managerCommission: Math.floor(managerCommission),
      netMonthlyProfit
    };
  }
}
