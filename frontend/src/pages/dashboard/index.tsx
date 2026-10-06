import { useQuery } from '@apollo/client/react'
import { useMemo, useState } from 'react'
import { CategoryFormDialog } from '@/components/category-form-dialog'
import { Link } from '@/components/link'
import { TransactionFormDialog } from '@/components/transaction-form-dialog'
import { CATEGORIES_QUERY } from '@/graphql/queries/categories'
import { SUMMARY_QUERY } from '@/graphql/queries/summary'
import { TRANSACTIONS_QUERY } from '@/graphql/queries/transactions'
import { getErrorMessage } from '@/lib/errors'
import { currentMonthPeriod } from '@/lib/format'
import { CategoriesPanel } from './categories-panel'
import { RecentTransactions } from './recent-transactions'
import { SummaryCards, SummaryCardsSkeleton } from './summary-cards'

const RECENT_VARIABLES = { pagination: { page: 1, perPage: 5 } }

export function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)

  // Receitas e despesas do mês atual, pela data local.
  const period = useMemo(() => currentMonthPeriod(), [])

  // `network-only`: ao voltar para o Dashboard, nunca aparece um resumo antigo do cache.
  const summary = useQuery(SUMMARY_QUERY, { variables: { period }, fetchPolicy: 'network-only' })
  const recent = useQuery(TRANSACTIONS_QUERY, {
    variables: RECENT_VARIABLES,
    fetchPolicy: 'network-only',
  })
  const categories = useQuery(CATEGORIES_QUERY)

  const queries = [summary, recent, categories]
  const failed = queries.find((query) => query.error && !query.data)

  if (failed) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
        <p className="text-gray-500 text-sm">{getErrorMessage(failed.error)}</p>
        {/* Uma nova falha já aparece pelo `error` das queries. */}
        <Link
          onClick={() => {
            for (const query of queries) void query.refetch().catch(() => {})
          }}
        >
          Tentar novamente
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="sr-only">Dashboard</h1>

      {summary.data ? <SummaryCards summary={summary.data.summary} /> : <SummaryCardsSkeleton />}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RecentTransactions
            transactions={recent.data?.transactions.items}
            onCreate={() => setIsFormOpen(true)}
          />
        </div>
        <div className="min-w-0">
          <CategoriesPanel
            categories={categories.data?.categories}
            onCreate={() => setIsCategoryFormOpen(true)}
          />
        </div>
      </div>

      <TransactionFormDialog open={isFormOpen} transaction={null} onOpenChange={setIsFormOpen} />
      <CategoryFormDialog
        open={isCategoryFormOpen}
        category={null}
        onOpenChange={setIsCategoryFormOpen}
      />
    </>
  )
}
