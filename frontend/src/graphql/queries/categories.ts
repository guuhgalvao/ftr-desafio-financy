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
