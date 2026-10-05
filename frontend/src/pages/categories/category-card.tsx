import { SquarePen, Trash } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'
import { IconButton } from '@/components/icon-button'
import { Tag } from '@/components/tag'
import type { CategoryItem } from '@/graphql/queries/categories'
import { formatItemsCount } from '@/lib/format'

const cardClasses = 'flex min-w-0 flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6'

type CategoryCardProps = {
  category: CategoryItem
  onEdit: (category: CategoryItem) => void
  onDelete: (category: CategoryItem) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <article className={cardClasses}>
      <div className="flex items-start justify-between gap-4">
        <CategoryIcon icon={category.icon} color={category.color} />
        <div className="flex gap-2">
          <IconButton
            icon={Trash}
            variant="danger"
            aria-label={`Excluir categoria ${category.title}`}
            onClick={() => onDelete(category)}
          />
          <IconButton
            icon={SquarePen}
            aria-label={`Editar categoria ${category.title}`}
            onClick={() => onEdit(category)}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h2 className="break-words font-semibold text-base text-gray-800">{category.title}</h2>
        {/* Altura de 2 linhas mesmo sem descrição, para os rodapés ficarem alinhados. */}
        <p className="line-clamp-2 min-h-10 break-words text-gray-600 text-sm">
          {category.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0">
          <Tag color={category.color}>{category.title}</Tag>
        </div>
        <span className="shrink-0 text-gray-600 text-sm">
          {formatItemsCount(category.transactionsCount)}
        </span>
      </div>
    </article>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className={cardClasses}>
      <div className="flex items-start justify-between gap-4">
        <div className="size-10 animate-pulse rounded-lg bg-gray-200" />
        <div className="flex gap-2">
          <div className="size-8 animate-pulse rounded-lg bg-gray-200" />
          <div className="size-8 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
        <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}
