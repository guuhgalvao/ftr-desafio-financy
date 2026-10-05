import { useApolloClient, useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/button'
import { IconButton } from '@/components/icon-button'
import { Input } from '@/components/input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CREATE_CATEGORY_MUTATION } from '@/graphql/mutations/create-category'
import { UPDATE_CATEGORY_MUTATION } from '@/graphql/mutations/update-category'
import { CATEGORIES_QUERY, type CategoryItem } from '@/graphql/queries/categories'
import {
  CATEGORY_COLOR_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICON_LABELS,
  CATEGORY_ICON_NAMES,
  CATEGORY_ICONS,
  COLOR_CLASSES,
  isCategoryColor,
  isCategoryIconName,
} from '@/lib/categories'
import { getErrorMessage, getGraphQLErrorCode, getGraphQLErrorField } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { type CategoryFormData, categorySchema } from '@/schemas/category'

type CategoryFormDialogProps = {
  open: boolean
  /** Categoria em edição; `null` cria uma nova. */
  category: CategoryItem | null
  onOpenChange: (open: boolean) => void
}

export function CategoryFormDialog({ open, category, onOpenChange }: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col gap-0.5">
            <DialogTitle>{category ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
            <DialogDescription>Organize suas transações com categorias</DialogDescription>
          </div>
          <DialogClose asChild>
            <IconButton icon={X} aria-label="Fechar" />
          </DialogClose>
        </DialogHeader>
        {/* Montado só com o modal aberto: cada abertura começa com os valores iniciais. */}
        <CategoryForm category={category} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

const legendClasses = 'mb-2 font-medium text-gray-700 text-sm'

// O radio nativo fica invisível dentro do label; seleção e foco por teclado são estilizados com `:has`.
const optionClasses = cn(
  'relative flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors',
  'has-[:checked]:border-brand-base',
  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-base has-[:focus-visible]:outline-offset-2',
)

const refetchCategories = { refetchQueries: [CATEGORIES_QUERY], awaitRefetchQueries: true }

function CategoryForm({ category, onDone }: { category: CategoryItem | null; onDone: () => void }) {
  const client = useApolloClient()
  const [createCategory] = useMutation(CREATE_CATEGORY_MUTATION, refetchCategories)
  const [updateCategory] = useMutation(UPDATE_CATEGORY_MUTATION, refetchCategories)

  const icon = category?.icon
  const color = category?.color

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: category?.title ?? '',
      description: category?.description ?? '',
      icon: isCategoryIconName(icon) ? icon : CATEGORY_ICON_NAMES[0],
      color: isCategoryColor(color) ? color : CATEGORY_COLORS[0],
    },
  })

  // Sem isto, o foco inicial do Dialog cairia no botão de fechar.
  useEffect(() => {
    setFocus('title')
  }, [setFocus])

  async function onSubmit(data: CategoryFormData) {
    const input = { ...data, description: data.description || null }

    try {
      if (category) {
        await updateCategory({ variables: { id: category.id, data: input } })
        toast.success('Categoria atualizada com sucesso')
      } else {
        await createCategory({ variables: { data: input } })
        toast.success('Categoria criada com sucesso')
      }
      onDone()
    } catch (error) {
      const code = getGraphQLErrorCode(error)
      // Sessão expirada: o link de erro do Apollo já encerra a sessão e mostra o toast.
      if (code === 'UNAUTHENTICATED') return

      const message = getErrorMessage(error)
      toast.error(message)

      // A categoria foi excluída em outro lugar: não há mais o que editar.
      if (code === 'NOT_FOUND') {
        void client.refetchQueries({ include: [CATEGORIES_QUERY] })
        onDone()
        return
      }

      const field = code === 'CONFLICT' ? 'title' : getGraphQLErrorField(error)
      if (field && field in data) {
        setError(field as keyof CategoryFormData, { message }, { shouldFocus: true })
      }
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Input
          label="Título"
          placeholder="Ex. Alimentação"
          autoComplete="off"
          error={errors.title?.message}
          {...register('title')}
        />
        <Input
          label="Descrição"
          placeholder="Descrição da categoria"
          autoComplete="off"
          helper="Opcional"
          error={errors.description?.message}
          {...register('description')}
        />

        <fieldset className="min-w-0">
          <legend className={legendClasses}>Ícone</legend>
          <div className="grid grid-cols-8 gap-2">
            {CATEGORY_ICON_NAMES.map((name) => {
              const Icon = CATEGORY_ICONS[name]
              return (
                <label
                  key={name}
                  className={cn(
                    optionClasses,
                    'aspect-square text-gray-500 has-[:checked]:bg-gray-100 has-[:checked]:text-gray-600',
                  )}
                >
                  <input
                    type="radio"
                    value={name}
                    aria-label={CATEGORY_ICON_LABELS[name]}
                    className="sr-only"
                    {...register('icon')}
                  />
                  <Icon className="size-5" aria-hidden />
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className={legendClasses}>Cor</legend>
          <div className="flex gap-2">
            {CATEGORY_COLORS.map((name) => (
              <label key={name} className={cn(optionClasses, 'flex-1 p-1')}>
                <input
                  type="radio"
                  value={name}
                  aria-label={CATEGORY_COLOR_LABELS[name]}
                  className="sr-only"
                  {...register('color')}
                />
                <span className={cn('h-5 w-full rounded-sm', COLOR_CLASSES[name].swatch)} />
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}
