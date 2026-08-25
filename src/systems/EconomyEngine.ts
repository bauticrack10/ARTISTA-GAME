import { Artist, RecordLabel, Manager } from '../types';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';

export class EconomyEngine {
  // Average streaming payout per 1,000 streams in USD (~$3.50 gross, or $0.0035 per stream)
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
    baseLivingExpenses: number;
    lifestyleUpkeep: number;
    expensesLivingAndCrew: number;
    managerCommission: number;
    netMonthlyProfit: number;
  } {
    const grossStreaming = (totalMonthlyStreams / 1000) * this.STREAM_PAYOUT_PER_THOUSAND;

    // Label royalty split
    let artistRoyaltyPct = 100;
    if (artist.activeContract) {
      artistRoyaltyPct = artist.activeContract.royaltyPercentage;
    } else if (label) {
      if (label.type === 'major') artistRoyaltyPct = 22;
      else if (label.type === 'indie') artistRoyaltyPct = 65;
      else if (label.type === 'boutique') artistRoyaltyPct = 75;
      else if (label.type === 'artist_owned') artistRoyaltyPct = 95;
    }

    const artistStreamingNet = grossStreaming * (artistRoyaltyPct / 100);

    // Merchandise revenue scales with engaged fanbase and popularity
    const prodigyMerchBoost = artist.isProdigy ? 1.35 : 1.0;
    const merchRevenue = Math.floor(
      (artist.stats.fansCount * 0.03) *
      (artist.stats.fanbaseLoyalty / 100) *
      (Math.max(5, artist.stats.popularity) / 100) *
      prodigyMerchBoost
    );

    // Baseline living & crew expenses scaled to career stage (underground costs are gentle)
    let baseLivingExpenses = 250;
    if (artist.stats.popularity > 85) baseLivingExpenses = 35000;
    else if (artist.stats.popularity > 70) baseLivingExpenses = 14000;
    else if (artist.stats.popularity > 50) baseLivingExpenses = 4500;
    else if (artist.stats.popularity > 30) baseLivingExpenses = 1500;
    else if (artist.stats.popularity > 15) baseLivingExpenses = 600;

    // Lifestyle items monthly maintenance/upkeep
    let lifestyleUpkeep = 0;
    if (artist.lifestyleUpgrades && artist.lifestyleUpgrades.length > 0) {
      const itemMap = new Map(LIFESTYLE_ITEMS.map(item => [item.id, item]));
      for (const upgradeId of artist.lifestyleUpgrades) {
        const item = itemMap.get(upgradeId);
        if (item) {
          lifestyleUpkeep += item.monthlyUpkeep;
        }
      }
    }

    const totalExpenses = baseLivingExpenses + lifestyleUpkeep;

    // Manager commission (if hired)
    let managerCommission = 0;
    if (manager) {
      const grossIncome = artistStreamingNet + merchRevenue;
      managerCommission = Math.floor(grossIncome * (manager.commissionFeePct / 100));
    }

    const netMonthlyProfit = Math.floor(artistStreamingNet + merchRevenue - totalExpenses - managerCommission);

    return {
      streamingRevenueGross: Math.floor(grossStreaming),
      artistStreamingNet: Math.floor(artistStreamingNet),
      merchRevenue,
      baseLivingExpenses,
      lifestyleUpkeep,
      expensesLivingAndCrew: totalExpenses,
      managerCommission,
      netMonthlyProfit
    };
  }
}
