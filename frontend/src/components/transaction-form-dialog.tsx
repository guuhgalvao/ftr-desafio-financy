import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleArrowDown, CircleArrowUp, type LucideIcon, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/button'
import { CategoryFormDialog } from '@/components/category-form-dialog'
import { DateField } from '@/components/date-field'
import { IconButton } from '@/components/icon-button'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CREATE_TRANSACTION_MUTATION } from '@/graphql/mutations/create-transaction'
import { UPDATE_TRANSACTION_MUTATION } from '@/graphql/mutations/update-transaction'
import { CATEGORIES_QUERY } from '@/graphql/queries/categories'
import {
  refetchAfterTransactionWrite,
  TRANSACTION_GONE_MESSAGE,
  type TransactionItem,
} from '@/graphql/queries/transactions'
import { getErrorMessage, getGraphQLErrorCode, getGraphQLErrorField } from '@/lib/errors'
import { formatCentsInput, parseCentsInput } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  MAX_AMOUNT_CENTS,
  type TransactionFormData,
  transactionSchema,
} from '@/schemas/transaction'

type TransactionFormDialogProps = {
  open: boolean
  /** Transação em edição; `null` cria uma nova. */
  transaction: TransactionItem | null
  onOpenChange: (open: boolean) => void
}

export function TransactionFormDialog({
  open,
  transaction,
  onOpenChange,
}: TransactionFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false)

  // Conta as aberturas. Reabrir antes de a animação de saída terminar reaproveitaria o formulário
  // anterior, com os valores de outra transação; a `key` garante um formulário novo.
  const [opening, setOpening] = useState(0)
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setOpening((count) => count + 1)
  }

  return (
    // Durante o envio o modal não fecha (x, Esc, overlay): um erro da API precisa dele aberto.
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col gap-0.5">
            <DialogTitle>{transaction ? 'Editar transação' : 'Nova transação'}</DialogTitle>
            <DialogDescription>Registre sua despesa ou receita</DialogDescription>
          </div>
          <DialogClose asChild>
            <IconButton icon={X} aria-label="Fechar" disabled={isSaving} />
          </DialogClose>
        </DialogHeader>
        {/* Montado só com o modal aberto: cada abertura começa com os valores iniciais. */}
        <TransactionForm
          key={opening}
          transaction={transaction}
          onSavingChange={setIsSaving}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

type TypeOption = {
  value: TransactionFormData['type']
  label: string
  icon: LucideIcon
  /** Classes completas: borda da opção e cor do ícone quando selecionada (item 15 de screens.md). */
  selectedClasses: string
  iconClasses: string
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    value: 'EXPENSE',
    label: 'Despesa',
    icon: CircleArrowDown,
    selectedClasses: 'has-[:checked]:border-red-base',
    iconClasses: 'group-has-[:checked]/option:text-red-base',
  },
  {
    value: 'INCOME',
    label: 'Receita',
    icon: CircleArrowUp,
    selectedClasses: 'has-[:checked]:border-green-base',
    iconClasses: 'group-has-[:checked]/option:text-green-base',
  },
]

type TransactionFormProps = {
  transaction: TransactionItem | null
  onSavingChange: (isSaving: boolean) => void
  onDone: () => void
}

function TransactionForm({ transaction, onSavingChange, onDone }: TransactionFormProps) {
  const client = useApolloClient()
  const { data: categoriesData } = useQuery(CATEGORIES_QUERY)
  const [createTransaction] = useMutation(CREATE_TRANSACTION_MUTATION)
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION_MUTATION)

  const categories = categoriesData?.categories
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    setError,
    setFocus,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type ?? 'EXPENSE',
      description: transaction?.description ?? '',
      // Nova transação: data vazia ("Selecione") e valor zerado.
      date: transaction?.date ?? '',
      amount: transaction?.amount ?? 0,
      // Transação sem categoria: o campo vem vazio e a escolha é obrigatória.
      categoryId: transaction?.category?.id ?? '',
    },
  })

  // Sem isto, o foco inicial do Dialog cairia no botão de fechar.
  useEffect(() => {
    setFocus('description')
  }, [setFocus])

  async function onSubmit(data: TransactionFormData) {
    onSavingChange(true)

    try {
      if (transaction) await updateTransaction({ variables: { id: transaction.id, data } })
      else await createTransaction({ variables: { data } })

      // O modal só fecha com as listas, o resumo e as categorias já atualizados.
      await refetchAfterTransactionWrite(client)
      toast.success(
        transaction ? 'Transação atualizada com sucesso' : 'Transação criada com sucesso',
      )
      onDone()
    } catch (error) {
      const code = getGraphQLErrorCode(error)
      // Sessão expirada: o link de erro do Apollo já encerra a sessão e mostra o toast.
      if (code === 'UNAUTHENTICATED') return

      const message = getErrorMessage(error)

      if (code === 'NOT_FOUND') {
        await refetchAfterTransactionWrite(client)
        const current = client.readQuery({ query: CATEGORIES_QUERY })?.categories
        // A categoria escolhida foi excluída em outro lugar: dá para escolher outra.
        if (current && !current.some((category) => category.id === data.categoryId)) {
          toast.error(message)
          setError('categoryId', { message })
          return
        }
        // A transação foi excluída em outro lugar: não há mais o que editar.
        toast.error(TRANSACTION_GONE_MESSAGE)
        onDone()
        return
      }

      toast.error(message)

      const field = getGraphQLErrorField(error)
      if (field && field in data) {
        setError(field as keyof TransactionFormData, { message }, { shouldFocus: true })
      }
    } finally {
      onSavingChange(false)
    }
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <fieldset className="grid min-w-0 grid-cols-2 rounded-xl border border-gray-200 p-2">
            <legend className="sr-only">Tipo</legend>
            {TYPE_OPTIONS.map((option) => (
              // O radio nativo fica invisível dentro do label; seleção e foco são estilizados com `:has`.
              <label
                key={option.value}
                className={cn(
                  'group/option relative flex h-[46px] cursor-pointer items-center justify-center gap-3 rounded-lg border border-transparent text-base text-gray-600 transition-colors',
                  'has-[:checked]:bg-gray-100 has-[:checked]:font-medium has-[:checked]:text-gray-800',
                  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-base has-[:focus-visible]:outline-offset-2',
                  option.selectedClasses,
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="sr-only"
                  {...register('type')}
                />
                <option.icon
                  className={cn('size-4 shrink-0 text-gray-400', option.iconClasses)}
                  aria-hidden
                />
                {option.label}
              </label>
            ))}
          </fieldset>

          <Input
            label="Descrição"
            placeholder="Ex. Almoço no restaurante"
            autoComplete="off"
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DateField
                  label="Data"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.date?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <Input
                  label="Valor"
                  prefix="R$"
                  placeholder="0,00"
                  inputMode="numeric"
                  autoComplete="off"
                  error={errors.amount?.message}
                  ref={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                  // O formulário guarda centavos inteiros; o texto é só a máscara.
                  value={formatCentsInput(field.value)}
                  onChange={(event) => {
                    const cents = parseCentsInput(event.target.value)
                    // Acima de R$ 10.000.000,00 a digitação é ignorada.
                    if (cents <= MAX_AMOUNT_CENTS) field.onChange(cents)
                  }}
                />
              )}
            />
          </div>

          <div className="flex items-start gap-2">
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  label="Categoria"
                  placeholder="Selecione"
                  options={(categories ?? []).map((category) => ({
                    value: category.id,
                    label: category.title,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!categories}
                  error={errors.categoryId?.message}
                  open={isCategorySelectOpen}
                  onOpenChange={setIsCategorySelectOpen}
                  emptyContent={
                    <div className="flex flex-col items-start gap-2">
                      <p className="text-gray-500 text-sm">Nenhuma categoria cadastrada</p>
                      <Link
                        onClick={() => {
                          setIsCategorySelectOpen(false)
                          setIsCategoryFormOpen(true)
                        }}
                      >
                        Criar categoria
                      </Link>
                    </div>
                  }
                />
              )}
            />
            {/* `mt-7` pula o label (20px + gap de 8px) e alinha o botão com a caixa do campo. */}
            <IconButton
              icon={Plus}
              aria-label="Nova categoria"
              className="mt-7 size-12"
              disabled={isSubmitting}
              onClick={() => setIsCategoryFormOpen(true)}
            />
          </div>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>

      {/* Fora do <form>: o submit do modal de categoria subiria pela árvore do React até ele. */}
      <CategoryFormDialog
        open={isCategoryFormOpen}
        category={null}
        onOpenChange={setIsCategoryFormOpen}
        // A lista já foi refeita: a categoria nova entra selecionada.
        onCreated={(category) => setValue('categoryId', category.id, { shouldValidate: true })}
      />
    </>
  )
}
