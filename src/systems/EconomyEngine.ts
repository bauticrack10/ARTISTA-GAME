import { Artist, RecordLabel, Manager } from '../types';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';

export class EconomyEngine {
  // Baseline average streaming payout per 1,000 streams in USD (~$2.20 to $3.80 dynamic CPM)
  static STREAM_PAYOUT_PER_THOUSAND = 3.2;

  /**
   * Calculates dynamic CPM (streaming payout per 1,000 streams in USD).
   * Reflects real-world music market demographics:
   * - Underground (pop <= 20): $2.20 / 1k (predominantly local/ad-supported listeners)
   * - Emerging (pop 21 - 40): $2.50 / 1k
   * - Breakout (pop 41 - 65): $3.00 / 1k (regional playlisting & growing premium share)
   * - Mainstream (pop 66 - 85): $3.40 / 1k (international rotation, US/EU audience penetration)
   * - Superstar (pop > 85): $3.80 / 1k (global high-tier premium stream demographics)
   */
  static getStreamingCPM(artist: Artist): number {
    const pop = artist.stats?.popularity ?? 10;
    if (pop <= 20) {
      return 2.20;
    } else if (pop <= 40) {
      const ratio = (pop - 20) / 20;
      return 2.20 + ratio * 0.30; // 2.20 to 2.50
    } else if (pop <= 65) {
      const ratio = (pop - 40) / 25;
      return 2.50 + ratio * 0.50; // 2.50 to 3.00
    } else if (pop <= 85) {
      const ratio = (pop - 65) / 20;
      return 3.00 + ratio * 0.40; // 3.00 to 3.40
    } else {
      const ratio = Math.min(1.0, (pop - 85) / 15);
      return 3.40 + ratio * 0.40; // 3.40 to 3.80
    }
  }

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
    const cpm = this.getStreamingCPM(artist);
    const grossStreaming = (totalMonthlyStreams / 1000) * cpm;

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

    // Merchandise revenue scales with engaged fanbase, loyalty, and career standing
    const prodigyMerchBoost = artist.isProdigy ? 1.35 : 1.0;
    const fansCount = artist.stats?.fansCount ?? 0;
    const fanbaseLoyalty = (artist.stats?.fanbaseLoyalty ?? 50) / 100;
    const popularity = artist.stats?.popularity ?? 10;
    const popRatio = popularity / 100;

    // Engaged fans who actively buy physical goods / apparel:
    const activeSupporters = Math.floor(fansCount * fanbaseLoyalty);
    const buyerRate = 0.003 + popRatio * 0.015; // 0.3% to 1.8% of engaged supporters buy per month
    const avgMerchTicket = 12 + popRatio * 18; // $12 (stickers/patches) to $30 (hoodies/vinyls)
    const merchRevenue = Math.floor(activeSupporters * buyerRate * avgMerchTicket * prodigyMerchBoost);

    // Baseline living & crew expenses calibrated realistically by career tier:
    let baseLivingExpenses = 45;
    if (artist.careerStage === 'Underground' || popularity <= 20) {
      baseLivingExpenses = 45;
    } else if (artist.careerStage === 'Emerging' || popularity <= 40) {
      const ratio = (popularity - 20) / 20;
      baseLivingExpenses = Math.floor(100 + ratio * 250); // $100 - $350
    } else if (artist.careerStage === 'Breakout' || popularity <= 65) {
      const ratio = (popularity - 40) / 25;
      baseLivingExpenses = Math.floor(400 + ratio * 1400); // $400 - $1,800
    } else if (artist.careerStage === 'Mainstream' || popularity <= 85) {
      const ratio = (popularity - 65) / 20;
      baseLivingExpenses = Math.floor(2200 + ratio * 6300); // $2,200 - $8,500
    } else {
      const ratio = Math.min(1.0, (popularity - 85) / 15);
      baseLivingExpenses = Math.floor(9000 + ratio * 23000); // $9,000 - $32,000
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
