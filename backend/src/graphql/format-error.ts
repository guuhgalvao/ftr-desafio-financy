import { unwrapResolverError } from '@apollo/server/errors'
import { GraphQLError, type GraphQLFormattedError } from 'graphql'

// Errors thrown on purpose (helpers in errors.ts) and GraphQL parse/validation errors are
// GraphQLErrors and pass through. Anything else is unexpected and gets masked.
export function formatError(
  formatted: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  if (unwrapResolverError(error) instanceof GraphQLError) return formatted

  console.error(error)
  return {
    message: 'Erro interno. Tente novamente.',
    path: formatted.path,
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  }
}
