import { graphql } from '@/gql'

export const ME_QUERY = graphql(`
  query Me {
    me {
      id
      name
      email
      createdAt
    }
  }
`)
