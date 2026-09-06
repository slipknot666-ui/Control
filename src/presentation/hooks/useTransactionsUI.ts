import { useMemo } from 'react'
import type { Transaction } from '../../domain/entities/Transaction'
import type { AddTransactionParams } from '../../use-cases/AddTransaction'
import type { TotalsByPeriod } from '../../use-cases/CalculateTotals'
import { CalculateTotals } from '../../use-cases/CalculateTotals'
import { useTransactionContext } from '../context/TransactionContext'

const calculateTotals = new CalculateTotals()

interface UseTransactionsUIResult {
  transactions: Transaction[]
  totals: TotalsByPeriod
  loading: boolean
  error: string | null
  add: (input: AddTransactionParams) => Promise<void>
  remove: (id: string) => Promise<void>
}

export function useTransactionsUI(): UseTransactionsUIResult {
  const { transactions, loading, error, addTransaction, deleteTransaction } =
    useTransactionContext()

  const totals = useMemo(() => calculateTotals.execute(transactions), [transactions])

  return { transactions, totals, loading, error, add: addTransaction, remove: deleteTransaction }
}
