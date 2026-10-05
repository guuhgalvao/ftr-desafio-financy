import { graphql } from '@/gql'

export const UPDATE_CATEGORY_MUTATION = graphql(`
  mutation UpdateCategory($id: ID!, $data: CategoryInput!) {
    updateCategory(id: $id, data: $data) {
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
