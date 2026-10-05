import type { ReactNode } from 'react'
import { COLOR_CLASSES, isCategoryColor } from '@/lib/categories'
import { cn } from '@/lib/utils'

type TagProps = {
  /** Cor da categoria. `gray`, `null` ou valor desconhecido usam o estilo neutro de "Sem categoria". */
  color?: string | null
  className?: string
  children: ReactNode
}

export function Tag({ color, className, children }: TagProps) {
  const classes = COLOR_CLASSES[isCategoryColor(color) ? color : 'gray']

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded-full px-3 py-1 font-medium text-sm',
        classes.tag,
        className,
      )}
    >
      <span className="truncate">{children}</span>
    </span>
  )
}
