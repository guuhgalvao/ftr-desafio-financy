import { graphql } from '@/gql'

export const UPDATE_TRANSACTION_MUTATION = graphql(`
  mutation UpdateTransaction($id: ID!, $data: TransactionInput!) {
    updateTransaction(id: $id, data: $data) {
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
  }
`)
