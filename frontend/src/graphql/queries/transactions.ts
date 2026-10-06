import type { ApolloClient } from '@apollo/client'
import { toast } from 'sonner'
import { graphql } from '@/gql'
import type { TransactionsQuery } from '@/gql/graphql'

export type TransactionItem = TransactionsQuery['transactions']['items'][number]

export const TRANSACTIONS_PER_PAGE = 10

export const TRANSACTIONS_QUERY = graphql(`
  query Transactions($filter: TransactionFilterInput, $pagination: PaginationInput) {
    transactions(filter: $filter, pagination: $pagination) {
      items {
        id
        description
        amount
        type
        date
        category {
          id
          title
          icon
          color
        }
      }
      total
      page
      perPage
    }
  }
`)

/**
 * Refaz as queries ativas depois de criar, editar ou excluir uma transação: a lista, o resumo e
 * as categorias (contagens e totais). Fica fora do `refetchQueries` da mutation de propósito:
 * com `awaitRefetchQueries`, uma falha aqui rejeitaria a mutation que já foi gravada.
 */
export async function refetchAfterTransactionWrite(
  client: ApolloClient,
  /** `false` quando a lista já vai buscar outra página por conta própria. */
  includeTransactions = true,
) {
  try {
    // Só as queries montadas na tela: pedir uma inativa pelo documento gera aviso do Apollo.
    const affected = new Set<string | undefined>([
      ...(includeTransactions ? ['Transactions'] : []),
      'Summary',
      'Categories',
    ])
    await client.refetchQueries({
      include: 'active',
      onQueryUpdated: (query) => affected.has(query.queryName),
    })
  } catch {
    toast.error('Não foi possível atualizar os dados. Recarregue a página.')
  }
}
