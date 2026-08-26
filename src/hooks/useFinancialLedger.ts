import { useState, useMemo } from 'react';
import { Artist, WorldState, FinancialTransaction, TransactionCategory } from '../types';
import { LIFESTYLE_ITEMS } from '../data/lifestyleItems';

export type TransactionFilterType = 'all' | 'income' | 'expense';
export type TransactionSortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface CategorySummary {
  category: TransactionCategory;
  label: string;
  totalIncome: number;
  totalExpense: number;
  net: number;
  count: number;
}

export interface FinancialMetrics {
  totalIncome: number;
  totalExpense: number;
  netCashflow: number;
  currentBalance: number;
  monthlyLivingCost: number;
  monthlyLifestyleUpkeep: number;
  monthlyManagerCost: number;
  monthlyTotalBurnRate: number;
  semiAnnualOperatingCost: number; // 6 months projected operational cost
  runwayMonths: number;
  solvencyStatus: 'thriving' | 'stable' | 'warning' | 'critical';
  solvencyLabel: string;
  solvencyColor: string;
}

export interface UseFinancialLedgerResult {
  // Filter states
  selectedCategory: 'all' | TransactionCategory;
  selectedType: TransactionFilterType;
  searchQuery: string;
  sortOption: TransactionSortOption;
  page: number;
  pageSize: number;

  // Actions
  setSelectedCategory: (cat: 'all' | TransactionCategory) => void;
  setSelectedType: (type: TransactionFilterType) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (sort: TransactionSortOption) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;

  // Data & Results
  rawTransactions: FinancialTransaction[];
  filteredTransactions: FinancialTransaction[];
  paginatedTransactions: FinancialTransaction[];
  totalPages: number;
  totalFilteredCount: number;

  // Analytics & Projections
  metrics: FinancialMetrics;
  categorySummaries: CategorySummary[];
}

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  streaming: 'Streaming & Regalías',
  merch: 'Merchandising',
  production: 'Producción & Grabación',
  marketing: 'Marketing & Promoción',
  store: 'Tienda & Equipamiento',
  living_cost: 'Costo de Vida Base',
  maintenance: 'Mantenimiento de Equipos',
  tour: 'Giras & Recitales',
  event: 'Eventos & Oportunidades',
  contract: 'Contratos & Sellos',
  other: 'Otros Movimientos'
};

export function useFinancialLedger(
  player: Artist,
  world?: WorldState,
  initialPageSize: number = 10
): UseFinancialLedgerResult {
  const [selectedCategory, setSelectedCategory] = useState<'all' | TransactionCategory>('all');
  const [selectedType, setSelectedType] = useState<TransactionFilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<TransactionSortOption>('newest');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(initialPageSize);

  // 1. Raw Transactions (with fallback for initial starter funds if empty)
  const rawTransactions = useMemo(() => {
    const list = player.financialLedger && player.financialLedger.length > 0
      ? [...player.financialLedger]
      : [];

    if (list.length === 0) {
      list.push({
        id: 'tx_initial_capital',
        year: world?.currentYear || 2026,
        month: world?.currentMonth || 1,
        type: 'income',
        category: 'other',
        amount: player.stats?.funds || 4500,
        description: 'Capital Inicial de Carrera Artística',
        resultingBalance: player.stats?.funds || 4500,
        dateStr: `Enero ${world?.currentYear || 2026}`
      });
    }
    return list;
  }, [player.financialLedger, player.stats?.funds, world?.currentYear, world?.currentMonth]);

  // 2. Financial Metrics & 6-Month Projections
  const metrics = useMemo<FinancialMetrics>(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of rawTransactions) {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }
    }

    const netCashflow = totalIncome - totalExpense;
    const currentBalance = player.stats?.funds || 0;

    // Monthly baseline calculations (calibrated for gentle underground progression)
    let monthlyLivingCost = 35;
    const pop = player.stats?.popularity || 0;
    if (pop > 85) monthlyLivingCost = 28000;
    else if (pop > 70) monthlyLivingCost = 12000;
    else if (pop > 50) monthlyLivingCost = 3800;
    else if (pop > 30) monthlyLivingCost = 1200;
    else if (pop > 15) monthlyLivingCost = 400;
    else if (pop > 8) monthlyLivingCost = 120;

    let monthlyLifestyleUpkeep = 0;
    if (player.lifestyleUpgrades && player.lifestyleUpgrades.length > 0) {
      const itemMap = new Map(LIFESTYLE_ITEMS.map((item) => [item.id, item]));
      for (const upgradeId of player.lifestyleUpgrades) {
        const item = itemMap.get(upgradeId);
        if (item) {
          monthlyLifestyleUpkeep += item.monthlyUpkeep;
        }
      }
    }

    let monthlyManagerCost = 0;
    if (player.managerId && world?.managers && world.managers[player.managerId]) {
      const manager = world.managers[player.managerId];
      // Estimated commission
      const estimatedMonthlyGross = (player.stats?.monthlyListeners || 0) * 0.0035 + (player.stats?.fansCount || 0) * 0.02;
      monthlyManagerCost = Math.floor(estimatedMonthlyGross * (manager.commissionFeePct / 100));
    }

    const monthlyTotalBurnRate = monthlyLivingCost + monthlyLifestyleUpkeep + monthlyManagerCost;
    const semiAnnualOperatingCost = monthlyTotalBurnRate * 6;

    const runwayMonths = monthlyTotalBurnRate > 0
      ? currentBalance / monthlyTotalBurnRate
      : 99;

    let solvencyStatus: FinancialMetrics['solvencyStatus'] = 'thriving';
    let solvencyLabel = 'Solvencia Excelente (>12 meses)';
    let solvencyColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';

    if (runwayMonths >= 12) {
      solvencyStatus = 'thriving';
      solvencyLabel = 'Solvencia Óptima (>12 meses de cobertura)';
      solvencyColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    } else if (runwayMonths >= 6) {
      solvencyStatus = 'stable';
      solvencyLabel = 'Solvencia Estable (6-12 meses)';
      solvencyColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40';
    } else if (runwayMonths >= 3) {
      solvencyStatus = 'warning';
      solvencyLabel = 'Atención: Cobertura Ajustada (3-6 meses)';
      solvencyColor = 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    } else {
      solvencyStatus = 'critical';
      solvencyLabel = 'Crítico: Riesgo de Insolvencia (<3 meses)';
      solvencyColor = 'text-rose-400 border-rose-500/40 bg-rose-950/40';
    }

    return {
      totalIncome,
      totalExpense,
      netCashflow,
      currentBalance,
      monthlyLivingCost,
      monthlyLifestyleUpkeep,
      monthlyManagerCost,
      monthlyTotalBurnRate,
      semiAnnualOperatingCost,
      runwayMonths,
      solvencyStatus,
      solvencyLabel,
      solvencyColor
    };
  }, [
    rawTransactions,
    player.stats?.funds,
    player.stats?.popularity,
    player.stats?.monthlyListeners,
    player.stats?.fansCount,
    player.lifestyleUpgrades,
    player.managerId,
    world?.managers
  ]);

  // 3. Category Summaries
  const categorySummaries = useMemo<CategorySummary[]>(() => {
    const summaryMap = new Map<TransactionCategory, { income: number; expense: number; count: number }>();

    for (const cat of Object.keys(CATEGORY_LABELS) as TransactionCategory[]) {
      summaryMap.set(cat, { income: 0, expense: 0, count: 0 });
    }

    for (const tx of rawTransactions) {
      const entry = summaryMap.get(tx.category) || { income: 0, expense: 0, count: 0 };
      if (tx.type === 'income') {
        entry.income += tx.amount;
      } else {
        entry.expense += tx.amount;
      }
      entry.count += 1;
      summaryMap.set(tx.category, entry);
    }

    const results: CategorySummary[] = [];
    summaryMap.forEach((val, cat) => {
      if (val.count > 0) {
        results.push({
          category: cat,
          label: CATEGORY_LABELS[cat],
          totalIncome: val.income,
          totalExpense: val.expense,
          net: val.income - val.expense,
          count: val.count
        });
      }
    });

    return results.sort((a, b) => (b.totalIncome + b.totalExpense) - (a.totalIncome + a.totalExpense));
  }, [rawTransactions]);

  // 4. Filtering and Sorting
  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rawTransactions.filter((tx) => {
      // Filter by category
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
        return false;
      }

      // Filter by type
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }

      // Filter by search query
      if (query) {
        const catLabel = CATEGORY_LABELS[tx.category]?.toLowerCase() || '';
        const desc = tx.description.toLowerCase();
        const date = `${tx.month}/${tx.year} ${tx.dateStr || ''}`.toLowerCase();
        const amountStr = tx.amount.toString();

        if (
          !desc.includes(query) &&
          !catLabel.includes(query) &&
          !date.includes(query) &&
          !amountStr.includes(query)
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          if (a.year !== b.year) return b.year - a.year;
          if (a.month !== b.month) return b.month - a.month;
          return (b.timestamp || 0) - (a.timestamp || 0);
        case 'oldest':
          if (a.year !== b.year) return a.year - b.year;
          if (a.month !== b.month) return a.month - b.month;
          return (a.timestamp || 0) - (b.timestamp || 0);
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [rawTransactions, selectedCategory, selectedType, searchQuery, sortOption]);

  // 5. Pagination
  const totalFilteredCount = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));

  const paginatedTransactions = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize, totalPages]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSearchQuery('');
    setSortOption('newest');
    setPage(1);
  };

  return {
    selectedCategory,
    selectedType,
    searchQuery,
    sortOption,
    page,
    pageSize,
    setSelectedCategory: (cat) => {
      setSelectedCategory(cat);
      setPage(1);
    },
    setSelectedType: (type) => {
      setSelectedType(type);
      setPage(1);
    },
    setSearchQuery: (q) => {
      setSearchQuery(q);
      setPage(1);
    },
    setSortOption,
    setPage,
    resetFilters,
    rawTransactions,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    totalFilteredCount,
    metrics,
    categorySummaries
  };
}
