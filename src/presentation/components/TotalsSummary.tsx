import type { PeriodTotals } from '../../use-cases/CalculateTotals'

interface TotalsSummaryProps {
  title: string
  totals: PeriodTotals
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function TotalsSummary({ title, totals }: TotalsSummaryProps) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <SummaryItem label="Ingresos" value={formatAmount(totals.income)} className="text-emerald-600" />
        <SummaryItem label="Gastos" value={formatAmount(totals.expense)} className="text-rose-600" />
        <SummaryItem
          label="Balance"
          value={formatAmount(totals.balance)}
          className={totals.balance >= 0 ? 'text-neutral-900' : 'text-rose-600'}
        />
      </div>
    </section>
  )
}

interface SummaryItemProps {
  label: string
  value: string
  className: string
}

function SummaryItem({ label, value, className }: SummaryItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className={`text-base font-semibold ${className}`}>{value}</span>
    </div>
  )
}