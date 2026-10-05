import { graphql } from '@/gql'

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
