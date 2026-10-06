import { useQuery } from '@apollo/client/react'
import { Plus } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Button } from '@/components/button'
import { CategoryFormDialog } from '@/components/category-form-dialog'
import { Link } from '@/components/link'
import { PageHeader } from '@/components/page-header'
import { CATEGORIES_QUERY, type CategoryItem } from '@/graphql/queries/categories'
import { getErrorMessage } from '@/lib/errors'
import { CategoryCard, CategoryCardSkeleton } from './category-card'
import { CategorySummary, CategorySummarySkeleton } from './category-summary'
import { DeleteCategoryDialog } from './delete-category-dialog'

// A categoria continua no estado depois de fechar, para o conteúdo não mudar durante a animação.
type DialogState = { open: boolean; category: CategoryItem | null }

const closed: DialogState = { open: false, category: null }

const gridClasses = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'

function Message({ text, children }: { text: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
      <p className="text-gray-500 text-sm">{text}</p>
      {children}
    </div>
  )
}

export function CategoriesPage() {
  const { data, error, refetch } = useQuery(CATEGORIES_QUERY)
  const [form, setForm] = useState(closed)
  const [removal, setRemoval] = useState(closed)

  const categories = data?.categories
  const openCreate = () => setForm({ open: true, category: null })

  return (
    <>
      <PageHeader
        title="Categorias"
        subtitle="Organize suas transações por categorias"
        action={
          <Button size="sm" icon={Plus} onClick={openCreate}>
            Nova categoria
          </Button>
        }
      />

      {categories ? (
        <>
          <CategorySummary categories={categories} />
          {categories.length === 0 ? (
            <Message text="Nenhuma categoria cadastrada">
              <Button size="sm" icon={Plus} onClick={openCreate}>
                Nova categoria
              </Button>
            </Message>
          ) : (
            <div className={gridClasses}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={(item) => setForm({ open: true, category: item })}
                  onDelete={(item) => setRemoval({ open: true, category: item })}
                />
              ))}
            </div>
          )}
        </>
      ) : error ? (
        <Message text={getErrorMessage(error)}>
          {/* Uma nova falha já aparece pelo `error` da query. */}
          <Link onClick={() => void refetch().catch(() => {})}>Tentar novamente</Link>
        </Message>
      ) : (
        <>
          <CategorySummarySkeleton />
          <div className={gridClasses}>
            {Array.from({ length: 8 }, (_, index) => index).map((item) => (
              <CategoryCardSkeleton key={item} />
            ))}
          </div>
        </>
      )}

      <CategoryFormDialog
        open={form.open}
        category={form.category}
        onOpenChange={(open) => setForm((state) => ({ ...state, open }))}
      />
      <DeleteCategoryDialog
        open={removal.open}
        category={removal.category}
        onOpenChange={(open) => setRemoval((state) => ({ ...state, open }))}
      />
    </>
  )
}
