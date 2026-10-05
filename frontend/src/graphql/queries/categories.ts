import type { ApolloClient } from '@apollo/client'
import { toast } from 'sonner'
import { graphql } from '@/gql'
import type { CategoriesQuery } from '@/gql/graphql'

export type CategoryItem = CategoriesQuery['categories'][number]

export const CATEGORIES_QUERY = graphql(`
  query Categories {
    categories {
      id
      title
      description
      icon
      color
      transactionsCount
      totalAmount
    }
  }
`)

/**
 * Refaz a lista depois de uma escrita. Fica fora do `refetchQueries` da mutation de propósito:
 * com `awaitRefetchQueries`, uma falha aqui rejeitaria a mutation que já foi gravada.
 */
export async function refetchCategories(client: ApolloClient) {
  try {
    await client.refetchQueries({ include: [CATEGORIES_QUERY] })
  } catch {
    toast.error('Não foi possível atualizar a lista. Recarregue a página.')
  }
}
