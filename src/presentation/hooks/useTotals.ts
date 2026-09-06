import { useMemo } from 'react'
import type { Transaction } from '../../domain/entities/Transaction'
import type { TotalsByPeriod } from '../../use-cases/CalculateTotals'
import { calculateTotals } from '../../compositionRoot'

export function useTotals(transactions: Transaction[]): TotalsByPeriod {
  return useMemo(() => calculateTotals.execute(transactions), [transactions])
}