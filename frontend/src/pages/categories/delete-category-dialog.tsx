import { useApolloClient, useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DELETE_CATEGORY_MUTATION } from '@/graphql/mutations/delete-category'
import { type CategoryItem, refetchCategories } from '@/graphql/queries/categories'
import { getErrorMessage, getGraphQLErrorCode } from '@/lib/errors'

type DeleteCategoryDialogProps = {
  open: boolean
  category: CategoryItem | null
  onOpenChange: (open: boolean) => void
}

// Item 35 de screens.md: quantas transações ficarão "Sem categoria".
function getAffectedText(count: number): string {
  if (count === 0) return ''
  if (count === 1) return ' A 1 transação desta categoria ficará sem categoria.'
  return ` As ${count} transações desta categoria ficarão sem categoria.`
}

export function DeleteCategoryDialog({ open, category, onOpenChange }: DeleteCategoryDialogProps) {
  const client = useApolloClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteCategory] = useMutation(DELETE_CATEGORY_MUTATION, {
    // As transações em cache ainda apontam para a categoria excluída.
    update(cache) {
      cache.evict({ id: 'ROOT_QUERY', fieldName: 'transactions' })
      cache.gc()
    },
  })

  async function handleDelete() {
    if (!category) return
    setIsDeleting(true)

    try {
      await deleteCategory({ variables: { id: category.id } })
      // O diálogo só fecha com a lista e os resumos já atualizados.
      await refetchCategories(client)
      toast.success('Categoria excluída com sucesso')
      onOpenChange(false)
    } catch (error) {
      const code = getGraphQLErrorCode(error)
      // Sessão expirada: o link de erro do Apollo já encerra a sessão e mostra o toast.
      if (code === 'UNAUTHENTICATED') return

      toast.error(getErrorMessage(error))

      // Já tinha sido excluída em outro lugar: a lista está desatualizada.
      if (code === 'NOT_FOUND') {
        void refetchCategories(client)
        onOpenChange(false)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isDeleting && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
          <AlertDialogDescription className="break-words">
            Tem certeza que deseja excluir a categoria "{category?.title}"? Esta ação não pode ser
            desfeita.
            {getAffectedText(category?.transactionsCount ?? 0)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size="sm" variant="outline" disabled={isDeleting}>
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              size="sm"
              variant="danger"
              disabled={isDeleting}
              onClick={(event) => {
                // O diálogo só fecha depois da resposta da API.
                event.preventDefault()
                void handleDelete()
              }}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
