export const TransactionType = {
  Income: 'income',
  Expense: 'expense',
} as const

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: string
  description: string
  date: string
  createdAt: string
}

export type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt'>