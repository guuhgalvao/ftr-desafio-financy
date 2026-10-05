import { graphql } from '@/gql'

export const CREATE_CATEGORY_MUTATION = graphql(`
  mutation CreateCategory($data: CategoryInput!) {
    createCategory(data: $data) {
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
