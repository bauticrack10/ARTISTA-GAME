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

    // Label & distributor royalty split
    let artistRoyaltyPct = 100;
    if (artist.activeContract) {
      artistRoyaltyPct = artist.activeContract.royaltyPercentage;
    } else if (label) {
      if (label.type === 'distributor') {
        // 85% for free distributors (15% commission) or 100% for annual fee distributors (0% commission)
        artistRoyaltyPct = label.commissionPct !== undefined ? (100 - label.commissionPct) : (label.annualFee && label.annualFee > 0 ? 100 : 85);
      } else if (label.type === 'local_indie') {
        artistRoyaltyPct = label.commissionPct !== undefined ? (100 - label.commissionPct) : 68;
      } else if (label.type === 'major') {
        artistRoyaltyPct = label.commissionPct !== undefined ? (100 - label.commissionPct) : 22;
      } else if (label.type === 'indie') {
        artistRoyaltyPct = label.commissionPct !== undefined ? (100 - label.commissionPct) : 65;
      } else if (label.type === 'boutique') {
        artistRoyaltyPct = label.commissionPct !== undefined ? (100 - label.commissionPct) : 75;
      } else if (label.type === 'artist_owned') {
        artistRoyaltyPct = 95;
      }
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

    // Baseline living & crew expenses scaled to career stage (underground costs are gentle and realistic, $35/mes)
    let baseLivingExpenses = 35;
    if (artist.careerStage === 'Underground' || artist.stats.popularity <= 10) {
      baseLivingExpenses = 35;
    } else if (artist.stats.popularity > 85) {
      baseLivingExpenses = 28000;
    } else if (artist.stats.popularity > 70) {
      baseLivingExpenses = 12000;
    } else if (artist.stats.popularity > 50) {
      baseLivingExpenses = 3800;
    } else if (artist.stats.popularity > 30) {
      baseLivingExpenses = 1200;
    } else if (artist.stats.popularity > 15) {
      baseLivingExpenses = 400;
    } else {
      baseLivingExpenses = 100;
    }

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

  static getOperatingCostsEstimate(
    artist: Artist,
    totalMonthlyStreams: number,
    label: RecordLabel | undefined,
    manager: Manager | undefined
  ) {
    const monthly = this.calculateMonthlyFinances(artist, totalMonthlyStreams, label, manager);
    const semestralMonths = 6;

    const livingCostSemestral = monthly.baseLivingExpenses * semestralMonths;
    const upkeepSemestral = monthly.lifestyleUpkeep * semestralMonths;
    const totalExpensesSemestral = monthly.expensesLivingAndCrew * semestralMonths;
    const estRevenueMonthly = monthly.artistStreamingNet + monthly.merchRevenue;
    const estRevenueSemestral = estRevenueMonthly * semestralMonths;
    const estNetMonthly = monthly.netMonthlyProfit;
    const estNetSemestral = monthly.netMonthlyProfit * semestralMonths;

    const isDeficit = estNetSemestral < 0;
    const bankruptcyRisk = isDeficit && Math.abs(estNetSemestral) > artist.stats.funds;
    const monthsOfRunway = isDeficit && monthly.expensesLivingAndCrew > 0
      ? Math.max(0, Math.floor(artist.stats.funds / Math.abs(estNetMonthly || 1)))
      : 99;

    return {
      monthly,
      livingCostMonthly: monthly.baseLivingExpenses,
      livingCostSemestral,
      upkeepMonthly: monthly.lifestyleUpkeep,
      upkeepSemestral,
      totalExpensesMonthly: monthly.expensesLivingAndCrew,
      totalExpensesSemestral,
      estRevenueMonthly,
      estRevenueSemestral,
      estNetMonthly,
      estNetSemestral,
      isDeficit,
      bankruptcyRisk,
      monthsOfRunway
    };
  }
}
