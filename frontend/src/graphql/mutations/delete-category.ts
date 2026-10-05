import { graphql } from '@/gql'

export const DELETE_CATEGORY_MUTATION = graphql(`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`)
