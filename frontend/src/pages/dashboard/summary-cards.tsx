import { CircleArrowDown, CircleArrowUp, type LucideIcon, Wallet } from 'lucide-react'
import type { SummaryQuery } from '@/gql/graphql'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

const gridClasses = 'grid grid-cols-1 gap-6 md:grid-cols-3'
const cardClasses = 'flex min-w-0 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6'

type SummaryCardProps = {
  icon: LucideIcon
  iconClassName: string
  label: string
  value: number
}

function SummaryCard({ icon: Icon, iconClassName, label, value }: SummaryCardProps) {
  return (
    <div className={cardClasses}>
      <div className="flex items-center gap-3">
        <Icon className={cn('size-5 shrink-0', iconClassName)} aria-hidden />
        <span className="font-medium text-gray-500 text-xs uppercase tracking-[0.6px]">
          {label}
        </span>
      </div>
      <strong className="truncate font-bold text-gray-800 text-value">
        {formatCurrency(value)}
      </strong>
    </div>
  )
}

export function SummaryCards({ summary }: { summary: SummaryQuery['summary'] }) {
  return (
    <div className={gridClasses}>
      <SummaryCard
        icon={Wallet}
        iconClassName="text-purple-base"
        label="Saldo total"
        value={summary.balance}
      />
      <SummaryCard
        icon={CircleArrowUp}
        iconClassName="text-brand-base"
        label="Receitas do mês"
        value={summary.income}
      />
      <SummaryCard
        icon={CircleArrowDown}
        iconClassName="text-red-base"
        label="Despesas do mês"
        value={summary.expense}
      />
    </div>
  )
}

export function SummaryCardsSkeleton() {
  return (
    <div className={gridClasses}>
      {[0, 1, 2].map((item) => (
        <div key={item} className={cardClasses}>
          <div className="flex items-center gap-3">
            <div className="size-5 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}
