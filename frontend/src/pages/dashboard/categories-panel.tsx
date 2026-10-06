import { ChevronRight } from 'lucide-react'
import { Link } from '@/components/link'
import { Tag } from '@/components/tag'
import type { CategoryItem } from '@/graphql/queries/categories'
import { formatCurrency, formatItemsCount } from '@/lib/format'
import { sectionClasses, sectionHeaderClasses, sectionLabelClasses } from './recent-transactions'

const MAX_CATEGORIES = 10

/**
 * As categorias com mais transações (item 23 de screens.md). A lista chega em ordem alfabética e
 * a ordenação é estável: no empate vale o título.
 */
export function getTopCategories(categories: readonly CategoryItem[]): CategoryItem[] {
  return [...categories]
    .sort((a, b) => b.transactionsCount - a.transactionsCount)
    .slice(0, MAX_CATEGORIES)
}

type CategoriesPanelProps = {
  /** `undefined` enquanto carrega. */
  categories: CategoryItem[] | undefined
}

export function CategoriesPanel({ categories }: CategoriesPanelProps) {
  return (
    <section className={sectionClasses}>
      <header className={sectionHeaderClasses}>
        <h2 className={sectionLabelClasses}>Categorias</h2>
        <Link to="/categorias" icon={ChevronRight} iconPosition="right">
          Gerenciar
        </Link>
      </header>

      {!categories ? (
        <ul className="flex flex-col gap-5 p-6">
          {[0, 1, 2, 3, 4].map((item) => (
            <li key={item} className="flex items-center justify-between gap-4">
              <div className="h-7 w-28 animate-pulse rounded-full bg-gray-200" />
              <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            </li>
          ))}
        </ul>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <p className="text-gray-500 text-sm">Nenhuma categoria cadastrada</p>
          <Link to="/categorias">Criar categoria</Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-5 p-6">
          {getTopCategories(categories).map((category) => (
            <li key={category.id} className="flex items-center gap-4">
              <div className="flex min-w-0 flex-1">
                <Tag color={category.color}>{category.title}</Tag>
              </div>
              <span className="shrink-0 text-gray-600 text-sm">
                {formatItemsCount(category.transactionsCount)}
              </span>
              {/* Soma absoluta de todas as transações da categoria, sem sinal e sem período. */}
              <span className="min-w-22 shrink-0 text-right font-semibold text-gray-800 text-sm">
                {formatCurrency(category.totalAmount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
