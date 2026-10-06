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
import { DELETE_TRANSACTION_MUTATION } from '@/graphql/mutations/delete-transaction'
import {
  refetchAfterTransactionWrite,
  TRANSACTION_GONE_MESSAGE,
  type TransactionItem,
} from '@/graphql/queries/transactions'
import { getErrorMessage, getGraphQLErrorCode } from '@/lib/errors'

type DeleteTransactionDialogProps = {
  open: boolean
  transaction: TransactionItem | null
  onOpenChange: (open: boolean) => void
  /** Chamado logo após a exclusão. Devolve `true` se a lista mudou de página e vai buscar sozinha. */
  onDeleted: () => boolean
}

export function DeleteTransactionDialog({
  open,
  transaction,
  onOpenChange,
  onDeleted,
}: DeleteTransactionDialogProps) {
  const client = useApolloClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION)

  async function handleDelete() {
    if (!transaction) return
    setIsDeleting(true)

    try {
      await deleteTransaction({ variables: { id: transaction.id } })
      const pageChanged = onDeleted()
      // O diálogo só fecha com a lista e as categorias já atualizadas.
      await refetchAfterTransactionWrite(client, !pageChanged)
      toast.success('Transação excluída com sucesso')
      onOpenChange(false)
    } catch (error) {
      const code = getGraphQLErrorCode(error)
      // Sessão expirada: o link de erro do Apollo já encerra a sessão e mostra o toast.
      if (code === 'UNAUTHENTICATED') return

      // Já tinha sido excluída em outro lugar: a lista está desatualizada.
      if (code === 'NOT_FOUND') {
        toast.error(TRANSACTION_GONE_MESSAGE)
        void refetchAfterTransactionWrite(client)
        onOpenChange(false)
        return
      }

      toast.error(getErrorMessage(error))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isDeleting && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação</AlertDialogTitle>
          <AlertDialogDescription className="break-words">
            Tem certeza que deseja excluir a transação "{transaction?.description}"? Esta ação não
            pode ser desfeita.
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
