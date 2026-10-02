import { notFound } from '../graphql/errors'
import { prisma } from '../lib/prisma'

const NOT_FOUND = 'Categoria não encontrada'

type CategoryStats = { transactionsCount: number; totalAmount: number }

const EMPTY_STATS: CategoryStats = { transactionsCount: 0, totalAmount: 0 }

// Amounts are always positive, so the plain sum is already the absolute total.
// One query for every category of the user, whatever the number of categories.
export async function getStatsByCategory(userId: string) {
  const groups = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { userId, categoryId: { not: null } },
    _count: { _all: true },
    _sum: { amount: true },
  })

  const stats = new Map<string, CategoryStats>()
  for (const group of groups) {
    if (!group.categoryId) continue
    stats.set(group.categoryId, {
      transactionsCount: group._count._all,
      totalAmount: group._sum.amount ?? 0,
    })
  }
  return stats
}

async function getCategoryStats(userId: string, categoryId: string): Promise<CategoryStats> {
  const result = await prisma.transaction.aggregate({
    where: { userId, categoryId },
    _count: { _all: true },
    _sum: { amount: true },
  })
  return { transactionsCount: result._count._all, totalAmount: result._sum.amount ?? 0 }
}

export async function listCategories(userId: string) {
  const [categories, stats] = await Promise.all([
    prisma.category.findMany({ where: { userId } }),
    getStatsByCategory(userId),
  ])

  // SQLite orders by byte value, which puts accented and lowercase titles after "Z".
  return categories
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }))
    .map((category) => ({ ...category, ...(stats.get(category.id) ?? EMPTY_STATS) }))
}

export async function getCategory(userId: string, id: string) {
  const category = await prisma.category.findFirst({ where: { id, userId } })
  if (!category) throw notFound(NOT_FOUND)

  return { ...category, ...(await getCategoryStats(userId, id)) }
}
