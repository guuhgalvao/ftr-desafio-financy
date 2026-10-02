import { GraphQLError } from 'graphql'
import type { z } from 'zod'

export function unauthenticated(message = 'Sessão inválida ou expirada. Faça login novamente.') {
  return new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED' } })
}

export function badUserInput(message: string, field?: string) {
  return new GraphQLError(message, {
    extensions: { code: 'BAD_USER_INPUT', ...(field ? { field } : {}) },
  })
}

export function notFound(message: string) {
  return new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } })
}

export function conflict(message: string) {
  return new GraphQLError(message, { extensions: { code: 'CONFLICT' } })
}

export function parseInput<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data)
  if (result.success) return result.data

  const [issue] = result.error.issues
  const field = issue.path[0]
  throw badUserInput(issue.message, typeof field === 'string' ? field : undefined)
}
