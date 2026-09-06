import type { PeriodTotals } from '../../use-cases/CalculateTotals'

type PeriodKey = 'day' | 'week' | 'month'

interface MetricCardProps {
  title: string
  totals: PeriodTotals
  period: PeriodKey
}

interface Accent {
  badge: string
  bar: string
  label: string
}

const ACCENTS: Record<PeriodKey, Accent> = {
  day: {
    badge: 'bg-violet-100 text-violet-700',
    bar: 'bg-gradient-to-r from-violet-500 to-indigo-500',
    label: 'Día',
  },
  week: {
    badge: 'bg-emerald-100 text-emerald-700',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    label: 'Semana',
  },
  month: {
    badge: 'bg-amber-100 text-amber-700',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    label: 'Mes',
  },
}

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function signed(value: number, signFor: 'income' | 'expense'): string {
  if (signFor === 'income') return `+${formatEuro(value)}`
  return `−${formatEuro(value)}`
}

export function MetricCard({ title, totals, period }: MetricCardProps) {
  const accent = ACCENTS[period]
  const balancePositive = totals.balance >= 0

  return (
    <article className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`} />

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">{title}</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${accent.badge}`}>
          {accent.label}
        </span>
      </div>

      <dl className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <dt className="text-neutral-500">Ingresos</dt>
          <dd className="font-semibold text-emerald-600">{signed(totals.income, 'income')}</dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-neutral-500">Gastos</dt>
          <dd className="font-semibold text-rose-600">{signed(totals.expense, 'expense')}</dd>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-dashed border-neutral-200 pt-2">
          <dt className="text-sm font-medium text-neutral-700">Balance</dt>
          <dd
            className={`text-lg font-bold ${
              balancePositive ? 'text-neutral-900' : 'text-rose-600'
            }`}
          >
            {formatEuro(totals.balance)}
          </dd>
        </div>
      </dl>
    </article>
  )
}