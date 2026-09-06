import { MetricCard } from './presentation/components/MetricCard'
import { TransactionForm } from './presentation/components/TransactionForm'
import { TransactionList } from './presentation/components/TransactionList'
import { useTransactionsUI } from './presentation/hooks/useTransactionsUI'
import { TransactionType } from './domain/entities/Transaction'

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function App() {
  const { transactions, totals, add, remove } = useTransactionsUI()

  const totalBalance = transactions.reduce(
    (acc, transaction) =>
      transaction.type === TransactionType.Income
        ? acc + transaction.amount
        : acc - transaction.amount,
    0,
  )

  const todayLabel = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="flex min-h-screen items-start justify-center bg-neutral-100 p-4 sm:p-6">
      <main className="w-full max-w-2xl space-y-5">
        <header className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-xl">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-200">
            {todayLabel}
          </p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Control de finanzas</h1>
              <p className="mt-0.5 text-sm text-violet-200">{transactions.length} movimientos</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-violet-200">Balance total</p>
              <p
                className={`text-2xl font-extrabold ${
                  totalBalance >= 0 ? 'text-white' : 'text-rose-200'
                }`}
              >
                {formatEuro(totalBalance)}
              </p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard title="Hoy" totals={totals.day} period="day" />
          <MetricCard title="Semana" totals={totals.week} period="week" />
          <MetricCard title="Mes" totals={totals.month} period="month" />
        </section>

        <TransactionForm onSubmit={add} />

        <section className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-500">
            Historial
          </h2>
          <TransactionList transactions={transactions} onDelete={remove} />
        </section>

        <footer className="pb-6 text-center text-xs text-neutral-400">
          Modo demo: los datos viven en memoria local y se reinician al recargar.
        </footer>
      </main>
    </div>
  )
}

export default App