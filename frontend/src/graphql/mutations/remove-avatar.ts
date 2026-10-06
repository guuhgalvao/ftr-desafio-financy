import { graphql } from '@/gql'

export const REMOVE_AVATAR_MUTATION = graphql(`
  mutation RemoveAvatar {
    removeAvatar {
      id
      name
      email
      avatarUrl
    }
  }
`)
