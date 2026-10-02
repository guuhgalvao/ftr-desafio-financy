import { unauthenticated } from '../graphql/errors'
import { prisma } from '../lib/prisma'

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw unauthenticated()
  return user
}
