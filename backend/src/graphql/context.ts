import type { ExpressContextFunctionArgument } from '@as-integrations/express5'
import { verifyToken } from '../lib/jwt'

export type Context = {
  userId: string | null
}

export async function buildContext({ req }: ExpressContextFunctionArgument): Promise<Context> {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return { userId: null }

  return { userId: verifyToken(header.slice('Bearer '.length)) }
}
