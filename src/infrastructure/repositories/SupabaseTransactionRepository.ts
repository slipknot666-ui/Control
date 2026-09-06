import type { ITransactionRepository } from '../../domain/repositories/ITransactionRepository'
import type { Transaction } from '../../domain/entities/Transaction'
import { supabase } from '../supabase/supabaseClient'

const TRANSACTION_TABLE = 'transactions'

export class SupabaseTransactionRepository implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from(TRANSACTION_TABLE)
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      throw new Error(`Error al obtener las transacciones: ${error.message}`)
    }

    return (data ?? []) as Transaction[]
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const { data, error } = await supabase
      .from(TRANSACTION_TABLE)
      .insert(transaction)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al guardar la transacción: ${error.message}`)
    }

    return data as Transaction
  }

  async deleteById(id: string): Promise<void> {
    const { error } = await supabase.from(TRANSACTION_TABLE).delete().eq('id', id)

    if (error) {
      throw new Error(`Error al eliminar la transacción: ${error.message}`)
    }
  }
}