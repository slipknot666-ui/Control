import type { ITransactionRepository } from '../domain/repositories/ITransactionRepository'
import type { Transaction } from '../domain/entities/Transaction'

export class GetTransactions {
  private readonly repository: ITransactionRepository

  constructor(repository: ITransactionRepository) {
    this.repository = repository
  }

  async execute(): Promise<Transaction[]> {
    return this.repository.getAll()
  }
}