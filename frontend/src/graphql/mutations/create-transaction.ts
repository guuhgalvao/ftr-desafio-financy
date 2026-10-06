import { graphql } from '@/gql'

export const CREATE_TRANSACTION_MUTATION = graphql(`
  mutation CreateTransaction($data: TransactionInput!) {
    createTransaction(data: $data) {
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
