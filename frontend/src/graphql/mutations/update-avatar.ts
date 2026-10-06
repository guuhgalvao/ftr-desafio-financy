import { graphql } from '@/gql'

export const UPDATE_AVATAR_MUTATION = graphql(`
  mutation UpdateAvatar($key: String!) {
    updateAvatar(key: $key) {
      id
      name
      email
      avatarUrl
    }
  }
`)
