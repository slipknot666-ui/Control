import { SupabaseTransactionRepository } from './infrastructure/repositories/SupabaseTransactionRepository'
import { AddTransaction } from './use-cases/AddTransaction'
import { CalculateTotals } from './use-cases/CalculateTotals'
import { GetTransactions } from './use-cases/GetTransactions'

const repository = new SupabaseTransactionRepository()

export const getTransactions = new GetTransactions(repository)
export const addTransaction = new AddTransaction(repository)
export const calculateTotals = new CalculateTotals()