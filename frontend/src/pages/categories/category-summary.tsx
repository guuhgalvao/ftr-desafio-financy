import { ArrowUpDown, type LucideIcon, Tag as TagIcon } from 'lucide-react'
import type { CategoryItem } from '@/graphql/queries/categories'
import {
  CATEGORY_ICONS,
  COLOR_CLASSES,
  getMostUsedCategory,
  isCategoryColor,
  isCategoryIconName,
} from '@/lib/categories'
import { cn } from '@/lib/utils'

const cardClasses = 'flex items-start gap-6 rounded-xl border border-gray-200 bg-white p-6'

type SummaryCardProps = {
  icon: LucideIcon
  iconClassName: string
  value: string | number
  label: string
}

function SummaryCard({ icon: Icon, iconClassName, value, label }: SummaryCardProps) {
  return (
    <div className={cardClasses}>
      <Icon className={cn('mt-1 size-6 shrink-0', iconClassName)} aria-hidden />
      <div className="flex min-w-0 flex-col gap-2">
        <strong className="truncate font-bold text-gray-800 text-value">{value}</strong>
        <span className="font-medium text-gray-500 text-xs uppercase tracking-[0.6px]">
          {label}
        </span>
      </div>
    </div>
  )
}

export function CategorySummary({ categories }: { categories: CategoryItem[] }) {
  // Totais calculados no client, a partir de `categories` (docs/api-contract.md).
  const totalTransactions = categories.reduce((sum, item) => sum + item.transactionsCount, 0)
  const mostUsed = getMostUsedCategory(categories)
  const icon = mostUsed?.icon
  const color = mostUsed?.color
  const hasStyle = isCategoryIconName(icon) && isCategoryColor(color)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <SummaryCard
        icon={TagIcon}
        iconClassName="text-gray-700"
        value={categories.length}
        label="Total de categorias"
      />
      <SummaryCard
        icon={ArrowUpDown}
        iconClassName="text-purple-base"
        value={totalTransactions}
        label="Total de transações"
      />
      <SummaryCard
        icon={hasStyle ? CATEGORY_ICONS[icon] : TagIcon}
        iconClassName={hasStyle ? COLOR_CLASSES[color].icon : 'text-gray-400'}
        value={mostUsed?.title ?? '—'}
        label="Categoria mais utilizada"
      />
    </div>
  )
}

export function CategorySummarySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className={cardClasses}>
          <div className="mt-1 size-6 shrink-0 animate-pulse rounded bg-gray-200" />
          <div className="flex flex-col gap-2">
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}
