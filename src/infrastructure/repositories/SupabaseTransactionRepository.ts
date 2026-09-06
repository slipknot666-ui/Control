import type { ITransactionRepository } from '../../domain/repositories/ITransactionRepository'
import type { Transaction, TransactionType } from '../../domain/entities/Transaction'
import { supabase } from '../supabase/client'

const TRANSACTION_TABLE = 'transactions'

interface TransactionRow {
  id: string
  amount: number
  type: TransactionType
  category: string
  description: string | null
  created_at: string
}

function toDomainTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    amount: Number(row.amount),
    type: row.type,
    category: row.category,
    description: row.description ?? '',
    date: row.created_at,
    createdAt: row.created_at,
  }
}

function toTransactionRow(transaction: Transaction): Omit<TransactionRow, 'id' | 'created_at'> {
  return {
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    description: transaction.description || null,
    created_at: transaction.date,
  }
}

export class SupabaseTransactionRepository implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from(TRANSACTION_TABLE)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error al obtener las transacciones: ${error.message}`)
      }

      return (data ?? []).map(toDomainTransaction)
    } catch (error) {
      if (error instanceof Error) throw error
      throw new Error('Error desconocido al obtener las transacciones')
    }
  }

  async save(transaction: Transaction): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from(TRANSACTION_TABLE)
        .insert(toTransactionRow(transaction))
        .select()
        .single()

      if (error) {
        throw new Error(`Error al guardar la transacción: ${error.message}`)
      }

      return toDomainTransaction(data as TransactionRow)
    } catch (error) {
      if (error instanceof Error) throw error
      throw new Error('Error desconocido al guardar la transacción')
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(TRANSACTION_TABLE).delete().eq('id', id)

      if (error) {
        throw new Error(`Error al eliminar la transacción: ${error.message}`)
      }
    } catch (error) {
      if (error instanceof Error) throw error
      throw new Error('Error desconocido al eliminar la transacción')
    }
  }
}
