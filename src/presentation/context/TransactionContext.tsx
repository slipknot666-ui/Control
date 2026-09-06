import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Transaction } from '../../domain/entities/Transaction'
import type { AddTransactionParams } from '../../use-cases/AddTransaction'
import { addTransaction, getTransactions, repository } from '../../compositionRoot'

interface TransactionContextValue {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  addTransaction: (data: AddTransactionParams) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  refreshTransactions: () => Promise<void>
}

const TransactionContext = createContext<TransactionContextValue | undefined>(undefined)

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getTransactions.execute()
      setTransactions(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const addTransaction = useCallback(
    async (data: AddTransactionParams) => {
      setLoading(true)
      setError(null)
      try {
        await addTransaction.execute(data)
        await refreshTransactions()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    },
    [refreshTransactions],
  )

  const deleteTransaction = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        await repository.deleteById(id)
        await refreshTransactions()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    },
    [refreshTransactions],
  )

  useEffect(() => {
    void refreshTransactions()
  }, [refreshTransactions])

  const value = useMemo<TransactionContextValue>(
    () => ({
      transactions,
      loading,
      error,
      addTransaction,
      deleteTransaction,
      refreshTransactions,
    }),
    [transactions, loading, error, addTransaction, deleteTransaction, refreshTransactions],
  )

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

export function useTransactionContext(): TransactionContextValue {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error(
      'useTransactionContext debe usarse dentro de un <TransactionProvider>.',
    )
  }
  return context
}
