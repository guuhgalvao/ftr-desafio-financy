import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type TypeBadgeProps = {
  type: 'INCOME' | 'EXPENSE'
  className?: string
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const isIncome = type === 'INCOME'
  const Icon = isIncome ? CircleArrowUp : CircleArrowDown

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-medium text-sm',
        isIncome ? 'text-green-dark' : 'text-red-dark',
        className,
      )}
    >
      <Icon className={cn('size-4', isIncome ? 'text-green-base' : 'text-red-base')} aria-hidden />
      {isIncome ? 'Entrada' : 'Saída'}
    </span>
  )
}
