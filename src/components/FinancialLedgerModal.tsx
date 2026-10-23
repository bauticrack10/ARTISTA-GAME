import React, { useState } from 'react';
import { FinancialTransaction, TransactionCategory } from '../types';
import { formatMoney, formatReleaseDate } from '../utils/formatters';
import {
  Receipt,
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Music,
  Home,
  Sliders,
  Sparkles,
  Radio,
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface FinancialLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: FinancialTransaction[];
  currentFunds: number;
}

export const FinancialLedgerModal: React.FC<FinancialLedgerModalProps> = ({
  isOpen,
  onClose,
  transactions,
  currentFunds
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | TransactionCategory>('all');

  if (!isOpen) return null;

  const filteredTransactions = selectedFilter === 'all'
    ? transactions
    : transactions.filter(tx => tx.category === selectedFilter);

  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const getCategoryMeta = (cat: TransactionCategory) => {
    switch (cat) {
      case 'streaming':
        return { label: 'Streaming', color: 'bg-info/15 text-info border-info/30', icon: Radio };
      case 'merch':
        return { label: 'Merch', color: 'bg-purple-500/15 text-primary-soft border-purple-500/30', icon: Sparkles };
      case 'production':
        return { label: 'Producción', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Music };
      case 'marketing':
        return { label: 'Marketing', color: 'bg-pink-500/15 text-pink-300 border-pink-500/30', icon: TrendingUp };
      case 'store':
        return { label: 'Tienda', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: ShoppingBag };
      case 'living_cost':
        return { label: 'Costo de Vida', color: 'bg-slate-700/40 text-slate-300 border-slate-600/40', icon: Home };
      case 'maintenance':
        return { label: 'Mantenimiento', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30', icon: Sliders };
      case 'tour':
        return { label: 'Giras', color: 'bg-teal-500/15 text-teal-300 border-teal-500/30', icon: DollarSign };
      case 'contract':
        return { label: 'Contrato / Manager', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', icon: FileText };
      case 'event':
        return { label: 'Evento', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30', icon: AlertCircle };
      default:
        return { label: 'Varios', color: 'bg-white/10 text-fg border-white/20', icon: DollarSign };
    }
  };

  const CATEGORY_TABS: Array<{ id: 'all' | TransactionCategory; label: string }> = [
    { id: 'all', label: 'Todas las Transacciones' },
    { id: 'streaming', label: 'Streaming' },
    { id: 'merch', label: 'Merch' },
    { id: 'living_cost', label: 'Costo de Vida' },
    { id: 'maintenance', label: 'Mantenimiento' },
    { id: 'store', label: 'Compras en Tienda' },
    { id: 'production', label: 'Producción Musical' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'tour', label: 'Giras' },
    { id: 'event', label: 'Eventos' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div
        className="bg-[#111114] border border-[#242429] max-w-4xl w-full rounded-[6px] p-6 sm:p-8 space-y-6 shadow-2xl text-[#F4F4F6] relative overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#242429] pb-5 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#F4F4F6] shadow-xs">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] bg-[#18181C] text-[#8E8E99] border border-[#242429]">
                  Trazabilidad Financiera
                </span>
                <span className="text-xs text-[#8E8E99] font-sans tabular-nums">
                  {transactions.length} registros
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F4F6] mt-0.5">
                Libro Mayor & Historial de Transacciones
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-[4px] bg-[#18181C] hover:bg-[#242429] text-[#8E8E99] hover:text-[#F4F4F6] border border-[#242429] transition-colors cursor-pointer"
            title="Cerrar Historial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPI Financial Summary Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
          <div className="bg-[#111114] border border-[#242429] rounded-[4px] p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-sans font-bold text-[#52525B] uppercase tracking-wider block">
                Total Ingresos Acumulados
              </span>
              <span className="text-xl font-bold text-[#00E599] font-sans tabular-nums tracking-tight mt-0.5 block">
                +${totalIncome.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-[4px] bg-[#111114] text-[#00E599] border border-[#00E599]/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#111114] border border-[#242429] rounded-[4px] p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-sans font-bold text-[#52525B] uppercase tracking-wider block">
                Total Gastos Acumulados
              </span>
              <span className="text-xl font-bold text-[#EF4444] font-sans tabular-nums tracking-tight mt-0.5 block">
                -${totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-[4px] bg-[#1F1215] text-[#EF4444] border border-[#451A20]">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#111114] border border-[#242429] rounded-[4px] p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-sans font-bold text-[#52525B] uppercase tracking-wider block">
                Saldo Actual Disponible
              </span>
              <span className="text-xl font-bold text-fg font-sans tracking-tight mt-0.5 block whitespace-nowrap">
                {formatMoney(currentFunds)}
              </span>
            </div>
            <div className="p-2.5 rounded-[4px] bg-[#18181C] text-[#F4F4F6] border border-[#242429]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-fade-x pb-1 relative z-10 font-sans text-xs">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-[4px] font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                selectedFilter === tab.id
                  ? 'bg-[#FF4F00] border-[#FF4F00] text-white font-bold'
                  : 'bg-[#18181C] text-[#8E8E99] border-[#242429] hover:text-[#F4F4F6] hover:border-[#3F3F46]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="border border-[#242429] rounded-[4px] overflow-hidden bg-[#111114] relative z-10">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-[#18181C] border-b border-[#242429] text-xs font-sans font-bold text-[#8E8E99] uppercase tracking-wider">
            <div className="col-span-3 sm:col-span-2">Período</div>
            <div className="col-span-4 sm:col-span-5">Concepto / Detalle</div>
            <div className="hidden sm:block sm:col-span-2">Categoría</div>
            <div className="col-span-3 sm:col-span-2 text-right">Importe</div>
            <div className="col-span-2 sm:col-span-1 text-right">Saldo</div>
          </div>

          <div className="divide-y divide-[#1C1C21] max-h-80 overflow-y-auto">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-[#8E8E99] space-y-2">
                <Receipt className="w-8 h-8 text-[#52525B] mx-auto" />
                <p className="text-sm">No hay transacciones registradas en esta categoría.</p>
                <p className="text-xs text-[#52525B]">
                  Los lanzamientos, compras de equipamiento, costos de vida y giras generarán registros automáticos.
                </p>
              </div>
            ) : (
              filteredTransactions.map(tx => {
                const isIncome = tx.type === 'income';
                const meta = getCategoryMeta(tx.category);
                const CategoryIcon = meta.icon;

                return (
                  <div
                    key={tx.id}
                    className="grid grid-cols-12 gap-3 px-4 py-3 items-center text-xs hover:bg-[#151519] transition-colors"
                  >
                    {/* Fecha */}
                    <div className="col-span-3 sm:col-span-2 font-sans text-xs text-[#8E8E99] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
                      <span className="tabular-nums">{formatReleaseDate(tx.month, tx.year, 'short')}</span>
                    </div>

                    {/* Concepto */}
                    <div className="col-span-4 sm:col-span-5 font-medium text-[#F4F4F6] truncate">
                      {tx.description}
                    </div>

                    {/* Categoría Badge */}
                    <div className="hidden sm:flex sm:col-span-2 items-center">
                      <span className={`px-2 py-0.5 rounded-[4px] font-sans text-2xs font-bold border flex items-center gap-1 ${meta.color}`}>
                        <CategoryIcon className="w-2.5 h-2.5 shrink-0" />
                        <span>{meta.label}</span>
                      </span>
                    </div>

                    {/* Importe */}
                    <div className={`col-span-3 sm:col-span-2 text-right font-sans tabular-nums font-bold text-xs sm:text-sm ${
                      isIncome ? 'text-[#00E599]' : 'text-[#EF4444]'
                    }`}>
                      {isIncome ? `+$${tx.amount.toLocaleString()}` : `-$${tx.amount.toLocaleString()}`}
                    </div>

                    {/* Saldo Resultante */}
                    <div className="col-span-2 sm:col-span-1 text-right font-sans tabular-nums text-xs text-[#8E8E99]">
                      {tx.resultingBalance !== undefined ? `$${tx.resultingBalance.toLocaleString('es-AR')}` : '-'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info note */}
        <div className="text-center pt-2 relative z-10 border-t border-[#242429]">
          <span className="text-xs text-[#52525B] font-sans">
            Todas las operaciones se auditan automáticamente y se guardan con la partida.
          </span>
        </div>
      </div>
    </div>
  );
};
