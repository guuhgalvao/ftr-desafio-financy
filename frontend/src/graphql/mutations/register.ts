import { graphql } from '@/gql'

export const REGISTER_MUTATION = graphql(`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      token
      user {
        id
        name
        email
        avatarUrl
      }
    }
  }
`)
