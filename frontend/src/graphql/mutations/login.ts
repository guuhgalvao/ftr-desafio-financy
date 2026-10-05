import { graphql } from '@/gql'

export const LOGIN_MUTATION = graphql(`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`)
