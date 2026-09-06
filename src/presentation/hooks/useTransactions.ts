import { useCallback, useEffect, useState } from 'react'
import type { Transaction } from '../../domain/entities/Transaction'
import type { AddTransactionParams } from '../../use-cases/AddTransaction'
import { addTransaction, getTransactions } from '../../compositionRoot'

interface UseTransactionsResult {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  add: (params: AddTransactionParams) => Promise<void>
}

export function useTransactions(): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const result = await getTransactions.execute()
        if (isMounted) setTransactions(result)
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  const add = useCallback(async (params: AddTransactionParams) => {
    setIsLoading(true)
    setError(null)
    try {
      await addTransaction.execute(params)
      const result = await getTransactions.execute()
      setTransactions(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { transactions, isLoading, error, add }
}