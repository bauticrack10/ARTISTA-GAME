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
  Radio,
  Ticket,
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
        return <Music className="w-4 h-4 text-[#38BDF8]" />;
      case 'merch':
        return <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />;
      case 'production':
        return <Disc3 className="w-4 h-4 text-[#FF4F00]" />;
      case 'marketing':
        return <Radio className="w-4 h-4 text-[#F59E0B]" />;
      case 'store':
        return <ShoppingBag className="w-4 h-4 text-[#38BDF8]" />;
      case 'living_cost':
        return <Building className="w-4 h-4 text-[#10B981]" />;
      case 'maintenance':
        return <Layers className="w-4 h-4 text-[#F59E0B]" />;
      case 'tour':
        return <TrendingUp className="w-4 h-4 text-[#10B981]" />;
      case 'event':
        return <Ticket className="w-4 h-4 text-[#F59E0B]" />;
      case 'contract':
        return <HeartHandshake className="w-4 h-4 text-[#38BDF8]" />;
      default:
        return <DollarSign className="w-4 h-4 text-[#94A3B8]" />;
    }
  };

  const getCategoryBadgeClass = (cat: TransactionCategory) => {
    switch (cat) {
      case 'streaming':
        return 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30';
      case 'merch':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30';
      case 'production':
        return 'bg-[#FF4F00]/10 text-[#FF4F00] border-[#FF4F00]/30';
      case 'marketing':
        return 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/35';
      case 'store':
        return 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/35';
      case 'living_cost':
        return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
      case 'maintenance':
        return 'bg-[#FF4F00]/10 text-[#FF4F00] border-[#FF4F00]/30';
      case 'tour':
        return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/35';
      case 'event':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30';
      case 'contract':
        return 'bg-[#94A3B8]/15 text-[#94A3B8] border-[#94A3B8]/30';
      default:
        return 'bg-[#18181C] text-[#94A3B8] border-[#242429]';
    }
  };

  const content = (
    <div className={`space-y-6 text-fg font-sans ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242429]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#F4F4F6] shadow-xs">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[#18181C] text-[#8E8E99] border border-[#242429]">
                Auditoría Contable
              </span>
              <span className="text-xs text-[#8E8E99] font-sans tabular-nums">
                {totalFilteredCount} {totalFilteredCount === 1 ? 'movimiento' : 'movimientos'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#F4F4F6] tracking-tight flex items-center gap-2 mt-0.5">
              Libro Contable & Historial Financiero
            </h2>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#242429] hover:border-[#3F3F46] text-xs font-sans font-semibold text-[#8E8E99] hover:text-[#F4F4F6] flex items-center gap-2 transition-all cursor-pointer"
            title="Copiar resumen al portapapeles"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#00E599]" />
                <span className="text-[#00E599]">Copiado</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-[#FF4F00]" />
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
              className="p-2 rounded-[4px] bg-[#18181C] hover:bg-[#1F1215] border border-[#242429] hover:border-[#451A20] text-[#8E8E99] hover:text-[#EF4444] transition-all cursor-pointer"
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
        <div className="bg-[#111114] border border-[#242429] rounded-[4px] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E99]">
            <span className="font-sans font-semibold uppercase tracking-wider text-2xs text-[#52525B]">Ingresos Totales</span>
            <span className="p-1 rounded-[4px] bg-[#111114] text-[#00E599] border border-[#00E599]/30">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold font-sans tabular-nums text-[#00E599] tracking-tight">
            +{formatMoney(metrics.totalIncome)}
          </div>
          <span className="text-xs text-[#8E8E99] font-sans block">
            Regalías, shows y acuerdos
          </span>
        </div>

        {/* Total Expense */}
        <div className="bg-[#111114] border border-[#242429] rounded-[4px] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E99]">
            <span className="font-sans font-semibold uppercase tracking-wider text-2xs text-[#52525B]">Gastos & Inversiones</span>
            <span className="p-1 rounded-[4px] bg-[#1F1215] text-[#EF4444] border border-[#451A20]">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold font-sans tabular-nums text-[#EF4444] tracking-tight">
            -{formatMoney(metrics.totalExpense)}
          </div>
          <span className="text-xs text-[#8E8E99] font-sans block">
            Estudios, equipo y vida
          </span>
        </div>

        {/* Net Balance Flow */}
        <div className="bg-[#111114] border border-[#242429] rounded-[4px] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E99]">
            <span className="font-sans font-semibold uppercase tracking-wider text-2xs text-[#52525B]">Flujo Neto Acumulado</span>
            <Wallet className="w-4 h-4 text-[#8E8E99]" />
          </div>
          <div
            className={`text-2xl font-bold font-sans tabular-nums tracking-tight ${
              metrics.netCashflow >= 0 ? 'text-[#00E599]' : 'text-[#EF4444]'
            }`}
          >
            {metrics.netCashflow >= 0 ? `+${formatMoney(metrics.netCashflow)}` : `-${formatMoney(Math.abs(metrics.netCashflow))}`}
          </div>
          <div className="flex items-center justify-between text-xs text-[#8E8E99] font-sans">
            <span>Saldo en caja:</span>
            <strong className="text-[#00E599] font-bold tabular-nums">{formatMoney(metrics.currentBalance)}</strong>
          </div>
        </div>

        {/* Semi-Annual Operating Cost & Runway */}
        <div className="bg-[#111114] border border-[#242429] rounded-[4px] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E99]">
            <span className="font-sans font-semibold uppercase tracking-wider text-2xs text-[#52525B]">Costos Semestrales</span>
            <span className="text-2xs font-sans tabular-nums text-[#8E8E99]">
              {formatMoney(metrics.monthlyTotalBurnRate)}/mes
            </span>
          </div>
          <div className="text-2xl font-bold font-sans tabular-nums text-[#F4F4F6] tracking-tight">
            {formatMoney(metrics.semiAnnualOperatingCost)}
          </div>
          <div className="pt-1 flex items-center justify-between">
            <span className={`text-2xs px-2 py-0.5 rounded-[4px] border font-sans font-bold ${metrics.solvencyColor}`}>
              {metrics.runwayMonths >= 99 ? '∞ Meses' : `${metrics.runwayMonths.toFixed(1)} meses`}
            </span>
            <span className="text-2xs text-[#8E8E99] font-sans font-semibold">
              {metrics.solvencyStatus === 'thriving' ? 'Alta Solvencia' : metrics.solvencyStatus === 'stable' ? 'Solvencia Estable' : 'Atención Requerida'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#111114] border border-[#242429] rounded-[4px] p-4 space-y-4">
        {/* Top Search & Primary Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por concepto, categoría o importe..."
              className="w-full pl-10 pr-9 py-2 rounded-[4px] bg-[#18181C] border border-[#242429] focus:border-[#FF4F00] focus:outline-hidden text-xs text-[#F4F4F6] placeholder-[#52525B] font-sans transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#F4F4F6]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Toggle: All / Income / Expense */}
          <div className="flex items-center bg-[#18181C] p-1 rounded-[4px] border border-[#242429] shrink-0 font-sans">
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
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? t === 'income'
                        ? 'bg-[#111114] text-[#00E599] border border-[#00E599]/40'
                        : t === 'expense'
                        ? 'bg-[#1F1215] text-[#EF4444] border border-[#451A20]'
                        : 'bg-[#F4F4F6] text-[#09090B]'
                      : 'text-[#8E8E99] hover:text-[#F4F4F6]'
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
              className="px-3 py-2 rounded-[4px] bg-[#18181C] border border-[#242429] text-xs text-[#F4F4F6] focus:border-[#FF4F00] focus:outline-hidden cursor-pointer font-sans"
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
                className="p-2 rounded-[4px] bg-[#18181C] hover:bg-[#1F1215] border border-[#242429] hover:border-[#451A20] text-[#8E8E99] hover:text-[#EF4444] text-xs transition-all cursor-pointer flex items-center gap-1.5 font-sans"
                title="Restablecer todos los filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-fade-x pb-1 text-xs font-sans">
          <button
            onClick={() => {
              playSound('click');
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-[4px] whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-[#FF4F00] text-white font-bold border-[#FF4F00]'
                : 'bg-[#18181C] text-[#8E8E99] border-[#242429] hover:text-[#F4F4F6] hover:border-[#3F3F46]'
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
                className={`px-3 py-1.5 rounded-[4px] whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#18181C] text-[#F4F4F6] border-[#FF4F00] font-bold'
                    : 'bg-[#18181C] text-[#8E8E99] border-[#242429] hover:text-[#F4F4F6] hover:border-[#3F3F46]'
                }`}
              >
                {getCategoryIcon(catSum.category)}
                <span>{catSum.label}</span>
                <span className="text-2xs opacity-75 font-sans tabular-nums">({catSum.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-[#111114] border border-[#242429] rounded-[4px] overflow-hidden">
        {paginatedTransactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-[#52525B] mx-auto opacity-60" />
            <h3 className="text-base font-semibold text-[#8E8E99]">
              No se encontraron movimientos registrados
            </h3>
            <p className="text-xs text-[#52525B] max-w-md mx-auto">
              Probá ajustando los filtros de búsqueda o categoría para visualizar otros períodos y conceptos contables.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 rounded-[4px] bg-[#18181C] hover:bg-[#242429] text-xs font-sans font-semibold text-[#F4F4F6] border border-[#242429] inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1C1C21]">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-[#18181C] border-b border-[#242429] text-xs font-sans font-bold text-[#8E8E99] uppercase tracking-wider">
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
                  className="p-4 sm:px-5 sm:py-3.5 hover:bg-[#151519] transition-colors flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 items-start sm:items-center text-xs"
                >
                  {/* Date */}
                  <div className="sm:col-span-2 flex items-center gap-2 text-[#8E8E99] font-sans">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#18181C] border border-[#242429] text-xs tabular-nums">
                      {tx.dateStr || `M${tx.month}/${tx.year}`}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-[4px] text-xs font-sans font-semibold border flex items-center gap-1.5 shrink-0 ${badgeClass}`}>
                      {getCategoryIcon(tx.category)}
                      {CATEGORY_LABELS[tx.category] || tx.category}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-4 font-normal text-[#F4F4F6] leading-snug">
                    {tx.description}
                  </div>

                  {/* Amount & Resulting Balance */}
                  <div className="sm:col-span-3 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-end text-right">
                    <div
                      className={`text-sm font-bold font-sans tabular-nums tracking-tight flex items-center gap-1 ${
                        isIncome ? 'text-[#00E599]' : 'text-[#EF4444]'
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
                      <span className="text-2xs text-[#8E8E99] font-sans tabular-nums">
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
          <div className="px-5 py-3.5 bg-[#18181C] border-t border-[#242429] flex items-center justify-between text-xs text-[#8E8E99]">
            <span className="font-sans text-xs">
              Página <strong className="text-[#F4F4F6] tabular-nums">{page}</strong> de <span className="tabular-nums">{totalPages}</span> (<span className="tabular-nums">{totalFilteredCount}</span> registros)
            </span>

            <div className="flex items-center gap-2 font-sans">
              <button
                onClick={() => {
                  playSound('click');
                  setPage(Math.max(1, page - 1));
                }}
                disabled={page <= 1}
                className="px-2.5 py-1.5 rounded-[4px] bg-[#111114] border border-[#242429] hover:border-[#3F3F46] disabled:opacity-40 disabled:cursor-not-allowed text-[#F4F4F6] flex items-center gap-1 cursor-pointer transition-all"
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
                      className={`w-7 h-7 rounded-[4px] text-xs font-sans font-bold tabular-nums transition-all cursor-pointer ${
                        page === p
                          ? 'bg-[#FF4F00] text-white'
                          : 'bg-[#111114] text-[#8E8E99] border border-[#242429] hover:text-[#F4F4F6]'
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
                className="px-2.5 py-1.5 rounded-[4px] bg-[#111114] border border-[#242429] hover:border-[#3F3F46] disabled:opacity-40 disabled:cursor-not-allowed text-[#F4F4F6] flex items-center gap-1 cursor-pointer transition-all"
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 overflow-y-auto animate-in fade-in duration-200">
        <div className="lg-modal relative w-full max-w-5xl bg-[#111114] border border-[#242429] rounded-[8px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto scrollbar-thin">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
