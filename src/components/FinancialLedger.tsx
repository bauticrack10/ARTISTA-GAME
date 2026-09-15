import React from 'react';
import { Artist, WorldState, TransactionCategory } from '../types';
import {
  useFinancialLedger,
  CATEGORY_LABELS,
  TransactionFilterType,
  TransactionSortOption
} from '../hooks/useFinancialLedger';
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Music,
  Disc3,
  Calendar,
  Layers,
  ShieldCheck,
  Building,
  HeartHandshake,
  FileSpreadsheet,
  Check,
  Wallet
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';

export interface FinancialLedgerProps {
  player: Artist;
  world?: WorldState;
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
  className?: string;
}

export const FinancialLedger: React.FC<FinancialLedgerProps> = ({
  player,
  world,
  isOpen = true,
  onClose,
  isModal = false,
  className = ''
}) => {
  const {
    selectedCategory,
    selectedType,
    searchQuery,
    sortOption,
    page,
    setSelectedCategory,
    setSelectedType,
    setSearchQuery,
    setSortOption,
    setPage,
    resetFilters,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    totalFilteredCount,
    metrics,
    categorySummaries
  } = useFinancialLedger(player, world, 8);

  const [copied, setCopied] = React.useState(false);

  if (isModal && !isOpen) {
    return null;
  }

  const handleCopySummary = () => {
    playSound('click');
    const text = `=== LIBRO CONTABLE: ${player.name} ===\nBalance Actual: ${formatMoney(metrics.currentBalance)}\nIngresos Totales: ${formatMoney(metrics.totalIncome)}\nGastos Totales: ${formatMoney(metrics.totalExpense)}\nFlujo Neto: ${formatMoney(metrics.netCashflow)}\nCosto Semestral Proyectado: ${formatMoney(metrics.semiAnnualOperatingCost)}\nCobertura / Runway: ${metrics.runwayMonths.toFixed(1)} meses (${metrics.solvencyLabel})\nTransacciones Totales: ${metrics.totalIncome + metrics.totalExpense > 0 ? filteredTransactions.length : 0}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCategoryIcon = (cat: TransactionCategory) => {
    switch (cat) {
      case 'streaming':
        return <Music className="w-4 h-4 text-cyan-400" />;
      case 'merch':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'production':
        return <Disc3 className="w-4 h-4 text-purple-400" />;
      case 'marketing':
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      case 'store':
        return <ShoppingBag className="w-4 h-4 text-indigo-400" />;
      case 'living_cost':
        return <Building className="w-4 h-4 text-emerald-400" />;
      case 'maintenance':
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 'tour':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'event':
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'contract':
        return <HeartHandshake className="w-4 h-4 text-blue-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryBadgeClass = (cat: TransactionCategory) => {
    switch (cat) {
      case 'streaming':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30';
      case 'merch':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/30';
      case 'production':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/30';
      case 'marketing':
        return 'bg-pink-950/60 text-pink-300 border-pink-500/30';
      case 'store':
        return 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30';
      case 'living_cost':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
      case 'maintenance':
        return 'bg-orange-950/60 text-orange-300 border-orange-500/30';
      case 'tour':
        return 'bg-teal-950/60 text-teal-300 border-teal-500/30';
      case 'event':
        return 'bg-yellow-950/60 text-yellow-300 border-yellow-500/30';
      case 'contract':
        return 'bg-blue-950/60 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const content = (
    <div className={`space-y-6 text-fg font-sans ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 border border-[#8B5CF6]/40 text-[#06B6D4] shadow-sm">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary-soft border border-primary/40">
                Auditoría Contable
              </span>
              <span className="text-xs text-fg-muted font-mono">
                {totalFilteredCount} {totalFilteredCount === 1 ? 'movimiento' : 'movimientos'}
              </span>
            </div>
            <h2
              className="text-2xl font-bold text-fg tracking-tight flex items-center gap-2 mt-0.5"
              style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
            >
              Libro Contable & Historial Financiero
            </h2>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-lg bg-canvas hover:bg-[#1C1F28] border border-line hover:border-primary/50 text-xs font-semibold text-fg-muted hover:text-fg flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            title="Copiar resumen al portapapeles"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Copiado</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                <span>Exportar Resumen</span>
              </>
            )}
          </button>

          {isModal && onClose && (
            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="p-2 rounded-lg bg-canvas hover:bg-rose-950/40 border border-line hover:border-rose-500/40 text-fg-muted hover:text-rose-300 transition-all cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-canvas border border-emerald-500/30 rounded-xl p-4 space-y-1 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
          <div className="flex items-center justify-between text-xs text-fg-muted">
            <span className="font-semibold uppercase tracking-wider text-2xs">Ingresos Totales</span>
            <span className="p-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
            +{formatMoney(metrics.totalIncome)}
          </div>
          <span className="text-xs text-emerald-500/80 font-mono block">
            Regalías, shows y acuerdos
          </span>
        </div>

        {/* Total Expense */}
        <div className="bg-canvas border border-rose-500/30 rounded-xl p-4 space-y-1 shadow-[0_0_15px_rgba(244,63,94,0.08)]">
          <div className="flex items-center justify-between text-xs text-fg-muted">
            <span className="font-semibold uppercase tracking-wider text-2xs">Gastos & Inversiones</span>
            <span className="p-1 rounded-md bg-rose-950/60 text-rose-400 border border-rose-500/30">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tracking-tight">
            -{formatMoney(metrics.totalExpense)}
          </div>
          <span className="text-xs text-rose-500/80 font-mono block">
            Estudios, equipo y vida
          </span>
        </div>

        {/* Net Balance Flow */}
        <div className="bg-canvas border border-line rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-fg-muted">
            <span className="font-semibold uppercase tracking-wider text-2xs">Flujo Neto Acumulado</span>
            <Wallet className="w-4 h-4 text-primary-soft" />
          </div>
          <div
            className={`text-2xl font-bold font-mono tracking-tight ${
              metrics.netCashflow >= 0 ? 'text-info' : 'text-rose-400'
            }`}
          >
            {metrics.netCashflow >= 0 ? `+${formatMoney(metrics.netCashflow)}` : `-${formatMoney(Math.abs(metrics.netCashflow))}`}
          </div>
          <div className="flex items-center justify-between text-xs text-fg-muted font-mono">
            <span>Saldo en caja:</span>
            <strong className="text-emerald-400 font-bold">{formatMoney(metrics.currentBalance)}</strong>
          </div>
        </div>

        {/* Semi-Annual Operating Cost & Runway */}
        <div className="bg-canvas border border-primary/30 rounded-xl p-4 space-y-1 shadow-[0_0_15px_rgba(139,92,246,0.08)]">
          <div className="flex items-center justify-between text-xs text-fg-muted">
            <span className="font-semibold uppercase tracking-wider text-2xs">Costos Semestrales</span>
            <span className="text-2xs font-mono text-primary-soft">
              {formatMoney(metrics.monthlyTotalBurnRate)}/mes
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-fg tracking-tight">
            {formatMoney(metrics.semiAnnualOperatingCost)}
          </div>
          <div className="pt-1 flex items-center justify-between">
            <span className={`text-2xs px-2 py-0.5 rounded-full border font-bold ${metrics.solvencyColor}`}>
              {metrics.runwayMonths >= 99 ? '∞ Meses' : `${metrics.runwayMonths.toFixed(1)} meses`}
            </span>
            <span className="text-2xs text-fg-muted font-semibold">
              {metrics.solvencyStatus === 'thriving' ? 'Alta Solvencia' : metrics.solvencyStatus === 'stable' ? 'Solvencia Estable' : 'Atención Requerida'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-canvas border border-line rounded-xl p-4 space-y-4">
        {/* Top Search & Primary Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-fg-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por concepto, categoría o importe..."
              className="w-full pl-10 pr-9 py-2 rounded-lg bg-surface border border-line focus:border-primary focus:outline-hidden text-xs text-fg placeholder-fg-subtle transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Toggle: All / Income / Expense */}
          <div className="flex items-center bg-surface p-1 rounded-lg border border-line shrink-0">
            {(['all', 'income', 'expense'] as TransactionFilterType[]).map((t) => {
              const isActive = selectedType === t;
              const labels: Record<TransactionFilterType, string> = {
                all: 'Todos',
                income: 'Ingresos (+)',
                expense: 'Gastos (-)'
              };
              return (
                <button
                  key={t}
                  onClick={() => {
                    playSound('click');
                    setSelectedType(t);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? t === 'income'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-xs'
                        : t === 'expense'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-xs'
                        : 'bg-primary/30 text-white border border-primary/50 shadow-xs'
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortOption}
              onChange={(e) => {
                playSound('click');
                setSortOption(e.target.value as TransactionSortOption);
              }}
              className="px-3 py-2 rounded-lg bg-surface border border-line text-xs text-fg focus:border-primary focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
              <option value="highest">Mayor importe</option>
              <option value="lowest">Menor importe</option>
            </select>

            {(selectedCategory !== 'all' || selectedType !== 'all' || searchQuery !== '') && (
              <button
                onClick={() => {
                  playSound('click');
                  resetFilters();
                }}
                className="p-2 rounded-lg bg-surface hover:bg-rose-950/40 border border-line hover:border-rose-500/40 text-fg-muted hover:text-rose-300 text-xs transition-all cursor-pointer flex items-center gap-1.5"
                title="Restablecer todos los filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-fade-x pb-1 text-xs">
          <button
            onClick={() => {
              playSound('click');
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold border-transparent shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                : 'bg-surface text-fg-muted border-line hover:text-fg hover:border-primary/40'
            }`}
          >
            Todas las Categorías
          </button>

          {categorySummaries.map((catSum) => {
            const isSelected = selectedCategory === catSum.category;
            return (
              <button
                key={catSum.category}
                onClick={() => {
                  playSound('click');
                  setSelectedCategory(catSum.category);
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-info/25 text-info border-info font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-surface text-fg-muted border-line hover:text-fg hover:border-primary/40'
                }`}
              >
                {getCategoryIcon(catSum.category)}
                <span>{catSum.label}</span>
                <span className="text-2xs opacity-75 font-mono">({catSum.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-canvas border border-line rounded-xl overflow-hidden shadow-md">
        {paginatedTransactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-fg-subtle mx-auto opacity-60" />
            <h3 className="text-base font-semibold text-fg-muted">
              No se encontraron movimientos registrados
            </h3>
            <p className="text-xs text-fg-subtle max-w-md mx-auto">
              Probá ajustando los filtros de búsqueda o categoría para visualizar otros períodos y conceptos contables.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 rounded-lg bg-surface hover:bg-line text-xs font-semibold text-info border border-line inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-surface/70 text-xs font-bold text-fg-muted uppercase tracking-wider">
              <div className="col-span-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Fecha / Período</span>
              </div>
              <div className="col-span-3">Categoría</div>
              <div className="col-span-4">Concepto / Detalle</div>
              <div className="col-span-3 text-right">Importe & Saldo</div>
            </div>

            {/* Rows */}
            {paginatedTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const badgeClass = getCategoryBadgeClass(tx.category);

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:px-5 sm:py-3.5 hover:bg-surface/50 transition-colors flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 items-start sm:items-center text-xs"
                >
                  {/* Date */}
                  <div className="sm:col-span-2 flex items-center gap-2 text-fg-muted font-mono">
                    <span className="px-2 py-0.5 rounded bg-surface border border-line text-xs">
                      {tx.dateStr || `M${tx.month}/${tx.year}`}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 shrink-0 ${badgeClass}`}>
                      {getCategoryIcon(tx.category)}
                      {CATEGORY_LABELS[tx.category] || tx.category}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-4 font-normal text-fg leading-snug">
                    {tx.description}
                  </div>

                  {/* Amount & Resulting Balance */}
                  <div className="sm:col-span-3 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-end text-right">
                    <div
                      className={`text-sm font-bold font-mono tracking-tight flex items-center gap-1 ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? (
                        <>
                          <ArrowUpRight className="w-3.5 h-3.5 inline" />
                          +{formatMoney(tx.amount)}
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-3.5 h-3.5 inline" />
                          -{formatMoney(tx.amount)}
                        </>
                      )}
                    </div>
                    {tx.resultingBalance !== undefined && (
                      <span className="text-2xs text-fg-subtle font-mono">
                        Saldo: {formatMoney(tx.resultingBalance)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 bg-surface/50 border-t border-line flex items-center justify-between text-xs text-fg-muted">
            <span className="font-mono text-xs">
              Página <strong className="text-fg">{page}</strong> de {totalPages} ({totalFilteredCount} registros)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  setPage(Math.max(1, page - 1));
                }}
                disabled={page <= 1}
                className="px-2.5 py-1.5 rounded-md bg-canvas border border-line hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed text-fg flex items-center gap-1 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p = i + 1;
                  if (totalPages > 5 && page > 3) {
                    p = Math.min(page - 2 + i, totalPages);
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        playSound('click');
                        setPage(p);
                      }}
                      className={`w-7 h-7 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                        page === p
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-canvas text-fg-muted border border-line hover:text-fg'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  playSound('click');
                  setPage(Math.min(totalPages, page + 1));
                }}
                disabled={page >= totalPages}
                className="px-2.5 py-1.5 rounded-md bg-canvas border border-line hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed text-fg flex items-center gap-1 cursor-pointer transition-all"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-5xl bg-surface border border-line rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto scrollbar-thin">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
