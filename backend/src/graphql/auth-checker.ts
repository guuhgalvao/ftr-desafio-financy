import type { AuthChecker } from 'type-graphql'
import { prisma } from '../lib/prisma'
import type { Context } from './context'
import { unauthenticated } from './errors'

// Throws instead of returning false so the client gets the contract's UNAUTHENTICATED error.
export const authChecker: AuthChecker<Context> = async ({ context }) => {
  if (!context.userId) throw unauthenticated()

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { id: true },
  })
  if (!user) throw unauthenticated()

  return true
}
