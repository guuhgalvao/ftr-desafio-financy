import { useQuery } from '@apollo/client/react'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { PageHeader } from '@/components/page-header'
import { TransactionFormDialog } from '@/components/transaction-form-dialog'
import type { TransactionFilterInput } from '@/gql/graphql'
import { CATEGORIES_QUERY } from '@/graphql/queries/categories'
import {
  TRANSACTIONS_PER_PAGE,
  TRANSACTIONS_QUERY,
  type TransactionItem,
} from '@/graphql/queries/transactions'
import { getErrorMessage } from '@/lib/errors'
import { getPeriodOptions } from '@/lib/format'
import { DeleteTransactionDialog } from './delete-transaction-dialog'
import { Pagination } from './pagination'
import {
  ALL,
  initialFilters,
  TransactionFilters,
  type TransactionFilterValues,
} from './transaction-filters'
import { TransactionsTable, TransactionsTableSkeleton } from './transactions-table'

const SEARCH_DEBOUNCE_MS = 300

// Filtros e página no mesmo estado: toda mudança de filtro volta para a página 1 de uma vez só.
type ListState = TransactionFilterValues & { search: string; page: number }

// A transação continua no estado depois de fechar, para o conteúdo não mudar durante a animação.
type DialogState = { open: boolean; transaction: TransactionItem | null }

const closed: DialogState = { open: false, transaction: null }

const messageClasses = 'flex flex-col items-center gap-4 p-6 text-center text-gray-500 text-sm'

export function TransactionsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [list, setList] = useState<ListState>({ ...initialFilters, search: '', page: 1 })
  const [form, setForm] = useState(closed)
  const [removal, setRemoval] = useState(closed)

  const periodOptions = useMemo(() => getPeriodOptions(), [])

  // Busca com debounce (item 27 de screens.md).
  useEffect(() => {
    const search = searchInput.trim()
    const timer = setTimeout(() => {
      setList((current) => (current.search === search ? current : { ...current, search, page: 1 }))
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchInput])

  const variables = useMemo(() => {
    const period = periodOptions.find((option) => option.value === list.period)?.period
    // Filtro vazio é omitido: a API não recebe string vazia nem o sentinela.
    const filter: TransactionFilterInput = {
      ...(list.search && { search: list.search }),
      ...(list.type !== ALL && { type: list.type as TransactionFilterInput['type'] }),
      ...(list.categoryId !== ALL && { categoryId: list.categoryId }),
      ...period,
    }
    return { filter, pagination: { page: list.page, perPage: TRANSACTIONS_PER_PAGE } }
  }, [list, periodOptions])

  // `network-only`: outra página ou outro filtro nunca mostram um resultado antigo do cache.
  const { data, previousData, error, loading, refetch } = useQuery(TRANSACTIONS_QUERY, {
    variables,
    fetchPolicy: 'network-only',
  })
  const { data: categoriesData } = useQuery(CATEGORIES_QUERY)

  const result = (data ?? previousData)?.transactions
  const totalPages = data ? Math.ceil(data.transactions.total / TRANSACTIONS_PER_PAGE) : 0

  // A página ficou além do fim (itens excluídos em outro lugar): volta para a última.
  useEffect(() => {
    if (totalPages > 0 && list.page > totalPages) {
      setList((current) => ({ ...current, page: totalPages }))
    }
  }, [totalPages, list.page])

  const hasFilters =
    list.search !== '' ||
    list.type !== initialFilters.type ||
    list.categoryId !== initialFilters.categoryId ||
    list.period !== initialFilters.period

  const openCreate = () => setForm({ open: true, transaction: null })

  // Excluir o último item de uma página volta para a anterior (item 29 de screens.md).
  function handleDeleted() {
    if (data?.transactions.items.length !== 1 || list.page <= 1) return false
    setList((current) => ({ ...current, page: current.page - 1 }))
    return true
  }

  return (
    <>
      <PageHeader
        title="Transações"
        subtitle="Gerencie todas as suas transações financeiras"
        action={
          <Button size="sm" icon={Plus} onClick={openCreate}>
            Nova transação
          </Button>
        }
      />

      <TransactionFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        values={list}
        onChange={(values) => setList((current) => ({ ...current, ...values, page: 1 }))}
        categories={categoriesData?.categories}
        periodOptions={periodOptions}
      />

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {error && !data ? (
          <div className={messageClasses}>
            <p>{getErrorMessage(error)}</p>
            {/* Uma nova falha já aparece pelo `error` da query. */}
            <Link onClick={() => void refetch().catch(() => {})}>Tentar novamente</Link>
          </div>
        ) : !result ? (
          <TransactionsTableSkeleton />
        ) : result.total === 0 ? (
          <p className={messageClasses}>
            {hasFilters
              ? 'Nenhuma transação encontrada para os filtros selecionados'
              : 'Nenhuma transação registrada'}
          </p>
        ) : (
          <>
            <TransactionsTable
              transactions={result.items}
              isStale={loading && !data}
              onEdit={(transaction) => setForm({ open: true, transaction })}
              onDelete={(transaction) => setRemoval({ open: true, transaction })}
            />
            <Pagination
              page={result.page}
              perPage={result.perPage}
              total={result.total}
              count={result.items.length}
              onPageChange={(page) => setList((current) => ({ ...current, page }))}
            />
          </>
        )}
      </section>

      <TransactionFormDialog
        open={form.open}
        transaction={form.transaction}
        onOpenChange={(open) => setForm((state) => ({ ...state, open }))}
      />
      <DeleteTransactionDialog
        open={removal.open}
        transaction={removal.transaction}
        onOpenChange={(open) => setRemoval((state) => ({ ...state, open }))}
        onDeleted={handleDeleted}
      />
    </>
  )
}
