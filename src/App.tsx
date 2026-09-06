import { TransactionForm } from './presentation/components/TransactionForm'
import { TransactionList } from './presentation/components/TransactionList'
import { TotalsSummary } from './presentation/components/TotalsSummary'
import { useTotals } from './presentation/hooks/useTotals'
import { useTransactions } from './presentation/hooks/useTransactions'

function App() {
  const { transactions, isLoading, error, add } = useTransactions()
  const totals = useTotals(transactions)

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-neutral-900">Control de finanzas</h1>
        <p className="text-sm text-neutral-500">Día, semana y mes en un vistazo.</p>
      </header>

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">Error: {error}</div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TotalsSummary title="Hoy" totals={totals.day} />
        <TotalsSummary title="Esta semana" totals={totals.week} />
        <TotalsSummary title="Este mes" totals={totals.month} />
      </section>

      <TransactionForm onSubmit={add} isSubmitting={isLoading} />

      <TransactionList transactions={transactions} isLoading={isLoading} />
    </main>
  )
}

export default App