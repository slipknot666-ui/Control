import { useMemo, useState } from 'react'
import type { Transaction } from '../../domain/entities/Transaction'
import { TransactionType } from '../../domain/entities/Transaction'
import { CATEGORIES } from './categories'

type Period = 'currentMonth' | 'previousMonth' | 'allTime'

interface AnalyticsViewProps {
  transactions: Transaction[]
}

interface Summary {
  income: number
  expense: number
  balance: number
}

interface CategoryStat {
  name: string
  total: number
  percentage: number
  colorClass: string
}

const PERIOD_OPTIONS: Array<{ value: Period; label: string }> = [
  { value: 'currentMonth', label: 'Este Mes' },
  { value: 'previousMonth', label: 'Mes Anterior' },
  { value: 'allTime', label: 'Todo el Tiempo' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Comida: 'bg-orange-500',
  Transporte: 'bg-sky-500',
  Ocio: 'bg-purple-500',
  Sueldo: 'bg-emerald-500',
  Otros: 'bg-neutral-400',
}

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  })
}

function isInPeriod(dateIso: string, period: Period): boolean {
  const date = new Date(dateIso)
  const today = new Date()

  switch (period) {
    case 'currentMonth':
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth()
      )
    case 'previousMonth':
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() - 1
      )
    case 'allTime':
      return true
  }
}

function filterTransactions(
  transactions: Transaction[],
  period: Period,
  category: string,
): Transaction[] {
  return transactions.filter(
    (transaction) =>
      isInPeriod(transaction.date, period) &&
      (category === 'Todas' || transaction.category === category),
  )
}

function buildSummary(transactions: Transaction[]): Summary {
  return transactions.reduce<Summary>(
    (acc, transaction) => {
      if (transaction.type === TransactionType.Income) {
        acc.income += transaction.amount
      } else {
        acc.expense += transaction.amount
      }
      return acc
    },
    { income: 0, expense: 0, balance: 0 },
  )
}

function buildCategoryStats(transactions: Transaction[]): CategoryStat[] {
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === TransactionType.Expense,
  )

  const totalExpense = expenseTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0,
  )

  if (totalExpense === 0) return []

  const totalsByCategory = CATEGORIES.map((category) => {
    const total = expenseTransactions
      .filter((transaction) => transaction.category === category)
      .reduce((acc, transaction) => acc + transaction.amount, 0)

    return {
      name: category,
      total,
      percentage: (total / totalExpense) * 100,
      colorClass: CATEGORY_COLORS[category] ?? 'bg-neutral-400',
    }
  })

  return totalsByCategory
    .filter((stat) => stat.total > 0)
    .sort((a, b) => b.total - a.total)
}

function SummaryCard({
  title,
  value,
  tone,
}: {
  title: string
  value: string
  tone: 'income' | 'expense' | 'balance'
}) {
  const toneClasses: Record<typeof tone, string> = {
    income: 'text-emerald-600',
    expense: 'text-rose-600',
    balance: 'text-violet-700',
  }

  return (
    <article className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {title}
      </p>
      <p className={`mt-1 text-2xl font-extrabold ${toneClasses[tone]}`}>{value}</p>
    </article>
  )
}

function PeriodTabs({
  selected,
  onChange,
}: {
  selected: Period
  onChange: (period: Period) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-200/70 p-1">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-2 py-2 text-sm font-semibold transition ${
            selected === option.value
              ? 'bg-white text-violet-700 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function CategoryBreakdown({ stats }: { stats: CategoryStat[] }) {
  if (stats.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        Sin gastos en el período seleccionado.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {stats.map((stat) => (
        <li key={stat.name}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-semibold text-neutral-900">{stat.name}</span>
            <span className="text-neutral-500">
              {formatEuro(stat.total)}{' '}
              <span className="text-neutral-400">· {stat.percentage.toFixed(1)}%</span>
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${stat.colorClass}`}
              style={{ width: `${Math.min(stat.percentage, 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

function AnalyticsTransactionList({
  transactions,
  onDelete,
}: {
  transactions: Transaction[]
  onDelete?: (id: string) => void
}) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        No hay movimientos para los filtros seleccionados.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === TransactionType.Income
        const sign = isIncome ? '+' : '−'

        return (
          <li
            key={transaction.id}
            className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:ring-violet-300"
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                CATEGORY_COLORS[transaction.category] ?? 'bg-neutral-400'
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {transaction.category}
              </p>
              <p className="truncate text-xs text-neutral-500">
                {transaction.description || 'Sin descripción'}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className={`text-sm font-bold ${
                  isIncome ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {sign}
                {formatEuro(transaction.amount)}
              </p>
              <p className="text-xs text-neutral-400">{formatDate(transaction.date)}</p>
            </div>

            {onDelete && (
              <button
                type="button"
                aria-label={`Eliminar ${transaction.category}`}
                onClick={() => onDelete(transaction.id)}
                className="shrink-0 rounded-lg p-2 text-lg leading-none text-neutral-300 transition hover:bg-neutral-100 hover:text-rose-600"
              >
                ×
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function AnalyticsView({ transactions }: AnalyticsViewProps) {
  const [period, setPeriod] = useState<Period>('currentMonth')
  const [category, setCategory] = useState<string>('Todas')

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, period, category),
    [transactions, period, category],
  )

  const periodTransactions = useMemo(
    () =>
      transactions.filter((transaction) => isInPeriod(transaction.date, period)),
    [transactions, period],
  )

  const summary = useMemo(
    () => buildSummary(periodTransactions),
    [periodTransactions],
  )

  const categoryStats = useMemo(
    () => buildCategoryStats(periodTransactions),
    [periodTransactions],
  )

  return (
    <div className="space-y-5">
      <PeriodTabs selected={period} onChange={setPeriod} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard title="Ingresos" value={`+${formatEuro(summary.income)}`} tone="income" />
        <SummaryCard title="Gastos" value={`−${formatEuro(summary.expense)}`} tone="expense" />
        <SummaryCard title="Balance" value={formatEuro(summary.balance)} tone="balance" />
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-500">
          Distribución de Gastos por Categoría
        </h2>
        <CategoryBreakdown stats={categoryStats} />
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
            Historial
          </h2>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filtrar por categoría"
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
          >
            <option value="Todas">Todas</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <AnalyticsTransactionList transactions={filteredTransactions} />
      </section>
    </div>
  )
}