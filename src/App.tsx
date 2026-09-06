import { useState } from 'react'
import { AnalyticsView } from './presentation/components/AnalyticsView'
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

type Tab = 'home' | 'analytics'

interface TabConfig {
  id: Tab
  label: string
}

const TABS: TabConfig[] = [
  { id: 'home', label: 'Inicio' },
  { id: 'analytics', label: 'Estadísticas' },
]

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-6 w-6 ${active ? 'text-violet-600' : 'text-neutral-400'}`}
      aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-6 w-6 ${active ? 'text-violet-600' : 'text-neutral-400'}`}
      aria-hidden="true"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function BottomNavigation({
  activeTab,
  onChange,
}: {
  activeTab: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-neutral-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-2xl items-stretch gap-2 px-4 py-2">
        {TABS.map((tab) => {
          const active = tab.id === activeTab
          const Icon = tab.id === 'home' ? HomeIcon : ChartIcon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 transition ${
                active ? 'bg-violet-50' : 'hover:bg-neutral-100'
              }`}
            >
              <Icon active={active} />
              <span
                className={`text-xs font-semibold ${
                  active ? 'text-violet-700' : 'text-neutral-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function App() {
  const { transactions, totals, add, remove } = useTransactionsUI()
  const [activeTab, setActiveTab] = useState<Tab>('home')

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
    <div className="flex min-h-screen items-start justify-center bg-neutral-100 p-4 pb-24 sm:p-6 sm:pb-24">
      <main className="w-full max-w-2xl space-y-5">
        <header className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-xl">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-200">
            {todayLabel}
          </p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Control de finanzas</h1>
              <p className="mt-0.5 text-sm text-violet-200">
                {transactions.length} movimientos
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-violet-200">
                Balance total
              </p>
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

        {activeTab === 'home' ? (
          <>
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
          </>
        ) : (
          <AnalyticsView transactions={transactions} />
        )}

        <footer className="pb-6 text-center text-xs text-neutral-400">
          Modo demo: los datos viven en memoria local y se reinician al recargar.
        </footer>
      </main>

      <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default App