import { useCallback, useMemo, useState } from 'react'
import type { Transaction } from '../../domain/entities/Transaction'
import { TransactionType } from '../../domain/entities/Transaction'
import type { AddTransactionParams } from '../../use-cases/AddTransaction'
import type { TotalsByPeriod } from '../../use-cases/CalculateTotals'
import { CalculateTotals } from '../../use-cases/CalculateTotals'

function createMockDate(offsetDays: number, hour: number, minute: number): string {
  const date = new Date()
  date.setDate(date.getDate() - offsetDays)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function startOfCurrentWeek(hour: number, minute: number): string {
  const date = new Date()
  const day = date.getDay()
  const delta = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + delta)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function startOfCurrentMonth(hour: number, minute: number): string {
  const date = new Date()
  date.setDate(1)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

const initialTransactions: Transaction[] = [
  {
    id: 'mock-1',
    amount: 12.5,
    type: TransactionType.Expense,
    category: 'Comida',
    description: 'Desayuno',
    date: createMockDate(0, 8, 30),
    createdAt: createMockDate(0, 8, 30),
  },
  {
    id: 'mock-2',
    amount: 950,
    type: TransactionType.Income,
    category: 'Sueldo',
    description: 'Nómina mensual',
    date: startOfCurrentMonth(9, 0),
    createdAt: startOfCurrentMonth(9, 0),
  },
  {
    id: 'mock-3',
    amount: 45,
    type: TransactionType.Expense,
    category: 'Ocio',
    description: 'Cena con amigos',
    date: startOfCurrentWeek(20, 0),
    createdAt: startOfCurrentWeek(20, 0),
  },
  {
    id: 'mock-4',
    amount: 3.2,
    type: TransactionType.Expense,
    category: 'Transporte',
    description: 'Metro',
    date: createMockDate(0, 7, 45),
    createdAt: createMockDate(0, 7, 45),
  },
  {
    id: 'mock-5',
    amount: 8.5,
    type: TransactionType.Expense,
    category: 'Comida',
    description: 'Almuerzo',
    date: createMockDate(1, 13, 0),
    createdAt: createMockDate(1, 13, 0),
  },
  {
    id: 'mock-6',
    amount: 25,
    type: TransactionType.Income,
    category: 'Otros',
    description: 'Venta de segunda mano',
    date: createMockDate(2, 18, 0),
    createdAt: createMockDate(2, 18, 0),
  },
  {
    id: 'mock-7',
    amount: 60,
    type: TransactionType.Income,
    category: 'Otros',
    description: 'Reembolso',
    date: createMockDate(0, 12, 0),
    createdAt: createMockDate(0, 12, 0),
  },
  {
    id: 'mock-8',
    amount: 22,
    type: TransactionType.Expense,
    category: 'Comida',
    description: 'Cena familiar',
    date: createMockDate(8, 20, 0),
    createdAt: createMockDate(8, 20, 0),
  },
]

const calculateTotals = new CalculateTotals()

interface UseTransactionsUIResult {
  transactions: Transaction[]
  totals: TotalsByPeriod
  add: (input: AddTransactionParams) => void
  remove: (id: string) => void
}

export function useTransactionsUI(): UseTransactionsUIResult {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  const add = useCallback((input: AddTransactionParams) => {
    const now = new Date().toISOString()
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      amount: input.amount,
      type: input.type,
      category: input.category,
      description: input.description ?? '',
      date: input.date ?? now,
      createdAt: now,
    }
    setTransactions((prev) => [transaction, ...prev])
  }, [])

  const remove = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }, [])

  const totals = useMemo(() => calculateTotals.execute(transactions), [transactions])

  return { transactions, totals, add, remove }
}