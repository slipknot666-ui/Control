import type { Transaction } from '../domain/entities/Transaction'
import type { ITransactionRepository } from '../domain/repositories/ITransactionRepository'

export interface AddTransactionParams {
  amount: number
  type: Transaction['type']
  category: string
  description?: string
  date?: string
}

export class AddTransaction {
  private readonly repository: ITransactionRepository

  constructor(repository: ITransactionRepository) {
    this.repository = repository
  }

  async execute(params: AddTransactionParams): Promise<Transaction> {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      amount: params.amount,
      type: params.type,
      category: params.category,
      description: params.description ?? '',
      date: params.date ?? new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    return this.repository.save(transaction)
  }
}