import type { Transaction } from '../domain/entities/Transaction'
import { TransactionType } from '../domain/entities/Transaction'

export interface PeriodTotals {
  income: number
  expense: number
  balance: number
}

export interface TotalsByPeriod {
  day: PeriodTotals
  week: PeriodTotals
  month: PeriodTotals
}

export class CalculateTotals {
  execute(transactions: Transaction[], referenceDate: Date = new Date()): TotalsByPeriod {
    return {
      day: this.sumByPeriod(transactions, referenceDate, 'day'),
      week: this.sumByPeriod(transactions, referenceDate, 'week'),
      month: this.sumByPeriod(transactions, referenceDate, 'month'),
    }
  }

  private sumByPeriod(
    transactions: Transaction[],
    referenceDate: Date,
    period: 'day' | 'week' | 'month',
  ): PeriodTotals {
    const filtered = transactions.filter((transaction) => this.isWithinPeriod(transaction.date, referenceDate, period))

    return this.sumTotals(filtered)
  }

  private isWithinPeriod(date: string, referenceDate: Date, period: 'day' | 'week' | 'month'): boolean {
    const transactionDate = new Date(date)
    const start = this.getPeriodStart(referenceDate, period)
    const end = new Date(start)
    end.setDate(end.getDate() + (period === 'week' ? 7 : 1))

    return transactionDate >= start && transactionDate < end
  }

  private getPeriodStart(date: Date, period: 'day' | 'week' | 'month'): Date {
    const start = new Date(date)

    switch (period) {
      case 'day':
        start.setHours(0, 0, 0, 0)
        break
      case 'week': {
        const day = start.getDay()
        const delta = day === 0 ? -6 : 1 - day
        start.setDate(start.getDate() + delta)
        start.setHours(0, 0, 0, 0)
        break
      }
      case 'month':
        start.setDate(1)
        start.setHours(0, 0, 0, 0)
        break
    }

    return start
  }

  private sumTotals(filtered: Transaction[]): PeriodTotals {
    const totals = filtered.reduce(
      (acc, transaction) => {
        if (transaction.type === TransactionType.Income) {
          acc.income += transaction.amount
        } else {
          acc.expense += transaction.amount
        }
        return acc
      },
      { income: 0, expense: 0 },
    )

    return {
      income: totals.income,
      expense: totals.expense,
      balance: totals.income - totals.expense,
    }
  }
}