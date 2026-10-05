import { CombinedGraphQLErrors } from '@apollo/client/errors'

/** `extensions.code` do primeiro erro GraphQL (códigos do contrato), se houver. */
export function getGraphQLErrorCode(error: unknown): string | undefined {
  if (!CombinedGraphQLErrors.is(error)) return undefined
  const code = error.errors[0]?.extensions?.code
  return typeof code === 'string' ? code : undefined
}

/** `extensions.field` do primeiro erro GraphQL: o campo que falhou na validação. */
export function getGraphQLErrorField(error: unknown): string | undefined {
  if (!CombinedGraphQLErrors.is(error)) return undefined
  const field = error.errors[0]?.extensions?.field
  return typeof field === 'string' ? field : undefined
}

/** Mensagem do contrato (pt-BR) do primeiro erro GraphQL; sem resposta da API, um texto de falha de conexão. */
export function getErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error) && error.errors[0]?.message) return error.errors[0].message
  return 'Não foi possível conectar ao servidor. Tente novamente.'
}

export function hasGraphQLErrorCode(error: unknown, code: string): boolean {
  return (
    CombinedGraphQLErrors.is(error) && error.errors.some((item) => item.extensions?.code === code)
  )
}
