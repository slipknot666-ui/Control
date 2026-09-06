import type { Transaction } from '../entities/Transaction'

export interface ITransactionRepository {
  getAll(): Promise<Transaction[]>
  save(transaction: Transaction): Promise<Transaction>
  deleteById(id: string): Promise<void>
}