import type { Transaction } from '../../domain/entities/Transaction'
import { TransactionCard } from './TransactionCard'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function TransactionList({ transactions, onDelete, isLoading = false }: TransactionListProps) {
  if (isLoading) {
    return <p className="py-8 text-center text-sm text-neutral-500">Cargando transacciones…</p>
  }

  if (transactions.length === 0) {
    return <p className="py-8 text-center text-sm text-neutral-500">No hay transacciones.</p>
  }

  return (
    <ul className="space-y-3">
      {transactions.map((transaction) => (
        <li key={transaction.id}>
          <TransactionCard transaction={transaction} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}