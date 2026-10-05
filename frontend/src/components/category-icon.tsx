import { Tag as TagIcon } from 'lucide-react'
import {
  CATEGORY_ICONS,
  COLOR_CLASSES,
  isCategoryColor,
  isCategoryIconName,
} from '@/lib/categories'
import { cn } from '@/lib/utils'

type CategoryIconProps = {
  /** Nome Lucide da categoria. `null` ou desconhecido: caixa neutra de "Sem categoria". */
  icon?: string | null
  color?: string | null
  className?: string
}

export function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  const known = isCategoryIconName(icon) && isCategoryColor(color)
  const Icon = known ? CATEGORY_ICONS[icon] : TagIcon
  const classes = COLOR_CLASSES[known ? color : 'gray']

  return (
    <span
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-lg',
        classes.box,
        className,
      )}
    >
      <Icon className={cn('size-4', classes.icon)} aria-hidden />
    </span>
  )
}
