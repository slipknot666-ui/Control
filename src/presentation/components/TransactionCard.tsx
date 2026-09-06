import type { Transaction } from '../../domain/entities/Transaction'
import { TransactionType } from '../../domain/entities/Transaction'

interface TransactionCardProps {
  transaction: Transaction
  onDelete?: (id: string) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function TransactionCard({ transaction, onDelete }: TransactionCardProps) {
  const isIncome = transaction.type === TransactionType.Income

  return (
    <article className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              isIncome
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {isIncome ? 'Ingreso' : 'Gasto'}
          </span>
          <span className="text-xs text-neutral-500">{formatDate(transaction.date)}</span>
        </div>
        <p className="truncate text-sm font-medium text-neutral-900">
          {transaction.description || transaction.category}
        </p>
        <p className="text-xs text-neutral-500">{transaction.category}</p>
      </div>

      <div className="flex items-center gap-3">
        <p className={`text-base font-semibold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isIncome ? '+' : '−'}
          {formatAmount(transaction.amount)}
        </p>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(transaction.id)}
            className="rounded-md px-2 py-1 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-rose-600"
          >
            Eliminar
          </button>
        )}
      </div>
    </article>
  )
}