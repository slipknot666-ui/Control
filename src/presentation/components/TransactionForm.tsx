import { useState, type FormEvent } from 'react'
import type { AddTransactionParams } from '../../use-cases/AddTransaction'
import { TransactionType } from '../../domain/entities/Transaction'
import { CATEGORIES, type Category } from './categories'

interface TransactionFormProps {
  onSubmit: (params: AddTransactionParams) => void | Promise<void>
  isSubmitting?: boolean
}

export function TransactionForm({ onSubmit, isSubmitting = false }: TransactionFormProps) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<AddTransactionParams['type']>(TransactionType.Expense)
  const [category, setCategory] = useState<Category>(CATEGORIES[0])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedAmount = Number.parseFloat(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) return

    void onSubmit({
      amount: parsedAmount,
      type,
      category,
    })

    setAmount('')
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-4 rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5"
    >
      <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
        Registro rápido
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-700">
          Monto
          <input
            type="number"
            min="0"
            step="0.01"
            required
            autoFocus
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            className="mt-1 rounded-lg border border-neutral-300 px-3 py-2.5 text-base text-neutral-900 shadow-sm transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-700">
          Tipo
          <select
            value={type}
            onChange={(event) => setType(event.target.value as AddTransactionParams['type'])}
            className="mt-1 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 shadow-sm transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
          >
            <option value={TransactionType.Expense}>Gasto</option>
            <option value={TransactionType.Income}>Ingreso</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-medium text-neutral-700">
        Categoría
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
          className="mt-1 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 shadow-sm transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
        >
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-700 hover:to-indigo-700 hover:shadow-violet-600/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Guardando…' : '+ Agregar movimiento'}
      </button>
    </form>
  )
}