import { unwrapResolverError } from '@apollo/server/errors'
import { GraphQLError, type GraphQLFormattedError } from 'graphql'

// graphql-js rejects an Int outside the 32-bit range before any resolver (and zod) runs.
const INT_OVERFLOW = 'Int cannot represent non 32-bit signed integer value'
const AMOUNT_OUT_OF_RANGE = 'O valor deve estar entre R$ 0,01 e R$ 10.000.000,00'
const NUMBER_OUT_OF_RANGE = 'Número fora do limite permitido'

// The field name is only in the message when the value came in a variable:
// `Variable "$data" got invalid value 3000000000 at "data.amount"; Int cannot represent...`
function formatIntOverflow(formatted: GraphQLFormattedError): GraphQLFormattedError {
  const field = formatted.message.match(/ at "(?:[^"]*\.)?([^".]+)"/)?.[1]

  return {
    ...formatted,
    message: field === 'amount' ? AMOUNT_OUT_OF_RANGE : NUMBER_OUT_OF_RANGE,
    extensions: { code: 'BAD_USER_INPUT', ...(field ? { field } : {}) },
  }
}

// Errors thrown on purpose (helpers in errors.ts) and GraphQL parse/validation errors are
// GraphQLErrors and pass through. Anything else is unexpected and gets masked.
export function formatError(
  formatted: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  if (formatted.message.includes(INT_OVERFLOW)) return formatIntOverflow(formatted)
  if (unwrapResolverError(error) instanceof GraphQLError) return formatted

  console.error(error)
  return {
    message: 'Erro interno. Tente novamente.',
    path: formatted.path,
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  }
}
