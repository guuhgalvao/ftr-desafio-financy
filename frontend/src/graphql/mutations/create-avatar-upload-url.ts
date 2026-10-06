import { graphql } from '@/gql'

export const CREATE_AVATAR_UPLOAD_URL_MUTATION = graphql(`
  mutation CreateAvatarUploadUrl($contentType: String!, $contentLength: Int!) {
    createAvatarUploadUrl(contentType: $contentType, contentLength: $contentLength) {
      uploadUrl
      key
      expiresIn
    }
  }
`)
