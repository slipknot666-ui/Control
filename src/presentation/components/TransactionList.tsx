import type { Transaction } from '../../domain/entities/Transaction'
import { TransactionType } from '../../domain/entities/Transaction'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete?: (id: string) => void
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

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  if (sorted.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">
        Aún no hay movimientos. Agrega el primero arriba.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {sorted.map((transaction) => {
        const isIncome = transaction.type === TransactionType.Income
        const sign = isIncome ? '+' : '−'

        return (
          <li
            key={transaction.id}
            className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:ring-violet-300"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${
                isIncome ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            >
              {sign}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">{transaction.category}</p>
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