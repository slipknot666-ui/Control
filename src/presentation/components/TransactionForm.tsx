import { useState, type FormEvent } from 'react'
import type { AddTransactionParams } from '../../use-cases/AddTransaction'
import { TransactionType } from '../../domain/entities/Transaction'

interface TransactionFormProps {
  onSubmit: (params: AddTransactionParams) => void | Promise<void>
  isSubmitting?: boolean
}

export function TransactionForm({ onSubmit, isSubmitting = false }: TransactionFormProps) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<AddTransactionParams['type']>(TransactionType.Expense)
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedAmount = Number.parseFloat(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) return

    void onSubmit({
      amount: parsedAmount,
      type,
      category: category.trim() || 'Sin categoría',
      description: description.trim(),
    })

    setAmount('')
    setCategory('')
    setDescription('')
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-neutral-700">
          Tipo
          <select
            value={type}
            onChange={(event) => setType(event.target.value as AddTransactionParams['type'])}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          >
            <option value={TransactionType.Expense}>Gasto</option>
            <option value={TransactionType.Income}>Ingreso</option>
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-neutral-700">
          Monto
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-medium text-neutral-700">
        Categoría
        <input
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Ej: Comida, Transporte, Salario…"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-neutral-700">
        Descripción
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descripción opcional"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Guardando…' : 'Agregar transacción'}
      </button>
    </form>
  )
}