import { graphql } from '@/gql'

export const UPDATE_PROFILE_MUTATION = graphql(`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      id
      name
      email
      avatarUrl
    }
  }
`)
