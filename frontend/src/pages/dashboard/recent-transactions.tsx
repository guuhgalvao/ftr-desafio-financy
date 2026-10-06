import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'
import { Link } from '@/components/link'
import { Tag } from '@/components/tag'
import type { TransactionItem } from '@/graphql/queries/transactions'
import { formatDate, formatSignedAmount } from '@/lib/format'
import { cn } from '@/lib/utils'

export const sectionClasses = 'overflow-hidden rounded-xl border border-gray-200 bg-white'
export const sectionHeaderClasses =
  'flex items-center justify-between gap-4 border-gray-200 border-b px-6 py-5'
export const sectionLabelClasses = 'font-medium text-gray-500 text-xs uppercase tracking-[0.6px]'

// Abaixo de 640px a Tag e o valor descem para uma segunda linha.
const rowClasses =
  'flex min-h-20 flex-wrap items-center gap-x-4 gap-y-2 border-gray-200 border-b px-6 py-4 sm:flex-nowrap sm:py-0'
const mainClasses = 'flex min-w-0 basis-full items-center gap-4 sm:flex-1 sm:basis-auto'
const tagClasses = 'flex min-w-0 flex-1 sm:w-40 sm:flex-none sm:justify-center'
const amountClasses = 'flex min-w-34 shrink-0 items-center justify-end gap-2'

type RecentTransactionsProps = {
  /** `undefined` enquanto carrega. */
  transactions: TransactionItem[] | undefined
  onCreate: () => void
}

export function RecentTransactions({ transactions, onCreate }: RecentTransactionsProps) {
  return (
    <section className={sectionClasses}>
      <header className={sectionHeaderClasses}>
        <h2 className={sectionLabelClasses}>Transações recentes</h2>
        <Link to="/transacoes" icon={ChevronRight} iconPosition="right">
          Ver todas
        </Link>
      </header>

      {!transactions ? (
        <RecentTransactionsSkeleton />
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <p className="text-gray-500 text-sm">Nenhuma transação registrada</p>
          <Link icon={Plus} onClick={onCreate}>
            Nova transação
          </Link>
        </div>
      ) : (
        <>
          <ul>
            {transactions.map((transaction) => {
              const isIncome = transaction.type === 'INCOME'
              const DirectionIcon = isIncome ? CircleArrowUp : CircleArrowDown

              return (
                <li key={transaction.id} className={rowClasses}>
                  <div className={mainClasses}>
                    <CategoryIcon
                      icon={transaction.category?.icon}
                      color={transaction.category?.color}
                    />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate font-medium text-base text-gray-800">
                        {transaction.description}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {formatDate(transaction.date, 'short')}
                      </span>
                    </div>
                  </div>
                  <div className={tagClasses}>
                    <Tag color={transaction.category?.color}>
                      {transaction.category?.title ?? 'Sem categoria'}
                    </Tag>
                  </div>
                  <div className={amountClasses}>
                    <span className="whitespace-nowrap font-semibold text-gray-800 text-sm">
                      {formatSignedAmount(transaction.amount, transaction.type)}
                    </span>
                    <DirectionIcon
                      className={cn(
                        'size-4 shrink-0',
                        isIncome ? 'text-brand-base' : 'text-red-base',
                      )}
                      aria-hidden
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <footer className="flex justify-center px-6 py-5">
            <Link icon={Plus} onClick={onCreate}>
              Nova transação
            </Link>
          </footer>
        </>
      )}
    </section>
  )
}

function RecentTransactionsSkeleton() {
  return (
    <ul>
      {[0, 1, 2, 3, 4].map((item) => (
        <li key={item} className={cn(rowClasses, 'last:border-b-0')}>
          <div className={mainClasses}>
            <div className="size-10 shrink-0 animate-pulse rounded-lg bg-gray-200" />
            <div className="flex flex-col gap-1.5">
              <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <div className={tagClasses}>
            <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
          </div>
          <div className={amountClasses}>
            <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
          </div>
        </li>
      ))}
    </ul>
  )
}
