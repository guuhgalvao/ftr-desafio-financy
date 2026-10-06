import { graphql } from '@/gql'

export const DELETE_TRANSACTION_MUTATION = graphql(`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`)
