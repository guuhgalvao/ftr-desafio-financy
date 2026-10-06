import { SquarePen, Trash } from 'lucide-react'
import type { ReactNode } from 'react'
import { CategoryIcon } from '@/components/category-icon'
import { IconButton } from '@/components/icon-button'
import { Tag } from '@/components/tag'
import { TypeBadge } from '@/components/type-badge'
import type { TransactionItem } from '@/graphql/queries/transactions'
import { formatDate, formatSignedAmount } from '@/lib/format'
import { cn } from '@/lib/utils'

const headClasses =
  'px-6 py-5 font-medium text-gray-500 text-xs uppercase tracking-[0.6px] whitespace-nowrap'

// Larguras do Figma; a descrição fica com o que sobra (414px no frame de 1280).
function TableFrame({ children }: { children: ReactNode }) {
  return (
    // A tabela rola dentro da section; a página nunca rola na horizontal.
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] table-fixed border-collapse">
        <colgroup>
          <col />
          <col className="w-28" />
          <col className="w-50" />
          <col className="w-34" />
          <col className="w-50" />
          <col className="w-[122px]" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={cn(headClasses, 'text-left')}>
              Descrição
            </th>
            <th scope="col" className={cn(headClasses, 'px-0 text-center')}>
              Data
            </th>
            <th scope="col" className={cn(headClasses, 'px-2 text-center')}>
              Categoria
            </th>
            <th scope="col" className={cn(headClasses, 'px-2 text-center')}>
              Tipo
            </th>
            <th scope="col" className={cn(headClasses, 'text-right')}>
              Valor
            </th>
            <th scope="col" className={cn(headClasses, 'pl-0 text-right')}>
              Ações
            </th>
          </tr>
        </thead>
        {children}
      </table>
    </div>
  )
}

const rowClasses = 'h-18 border-gray-200 border-t'

type TransactionsTableProps = {
  transactions: TransactionItem[]
  /** Buscando outra página ou outro filtro: as linhas anteriores ficam esmaecidas. */
  isStale: boolean
  onEdit: (transaction: TransactionItem) => void
  onDelete: (transaction: TransactionItem) => void
}

export function TransactionsTable({
  transactions,
  isStale,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  return (
    <TableFrame>
      <tbody aria-busy={isStale} className={cn('transition-opacity', isStale && 'opacity-50')}>
        {transactions.map((transaction) => (
          <tr key={transaction.id} className={rowClasses}>
            <td className="px-6">
              <div className="flex items-center gap-4">
                <CategoryIcon
                  icon={transaction.category?.icon}
                  color={transaction.category?.color}
                />
                <span className="min-w-0 truncate font-medium text-base text-gray-800">
                  {transaction.description}
                </span>
              </div>
            </td>
            <td className="text-center text-gray-600 text-sm">
              {formatDate(transaction.date, 'short')}
            </td>
            <td className="px-2 text-center">
              <Tag color={transaction.category?.color}>
                {transaction.category?.title ?? 'Sem categoria'}
              </Tag>
            </td>
            <td className="px-2 text-center">
              <TypeBadge type={transaction.type} />
            </td>
            <td className="whitespace-nowrap px-6 text-right font-semibold text-gray-800 text-sm">
              {formatSignedAmount(transaction.amount, transaction.type)}
            </td>
            <td className="pr-6">
              <div className="flex justify-end gap-2">
                <IconButton
                  icon={Trash}
                  variant="danger"
                  aria-label={`Excluir transação ${transaction.description}`}
                  onClick={() => onDelete(transaction)}
                />
                <IconButton
                  icon={SquarePen}
                  aria-label={`Editar transação ${transaction.description}`}
                  onClick={() => onEdit(transaction)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </TableFrame>
  )
}

const block = 'animate-pulse bg-gray-200'

export function TransactionsTableSkeleton() {
  return (
    <TableFrame>
      <tbody>
        {Array.from({ length: 10 }, (_, index) => index).map((item) => (
          <tr key={item} className={rowClasses}>
            <td className="px-6">
              <div className="flex items-center gap-4">
                <div className={cn(block, 'size-10 shrink-0 rounded-lg')} />
                <div className={cn(block, 'h-6 w-40 rounded')} />
              </div>
            </td>
            <td>
              <div className={cn(block, 'mx-auto h-5 w-16 rounded')} />
            </td>
            <td>
              <div className={cn(block, 'mx-auto h-7 w-24 rounded-full')} />
            </td>
            <td>
              <div className={cn(block, 'mx-auto h-5 w-16 rounded')} />
            </td>
            <td className="px-6">
              <div className={cn(block, 'ml-auto h-5 w-24 rounded')} />
            </td>
            <td className="pr-6">
              <div className="flex justify-end gap-2">
                <div className={cn(block, 'size-8 rounded-lg')} />
                <div className={cn(block, 'size-8 rounded-lg')} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </TableFrame>
  )
}
