import { Prisma } from '@prisma/client'
import { z } from 'zod'
import type { CategoryInput } from '../dtos/input/category.input'
import { conflict, notFound, parseInput } from '../graphql/errors'
import { prisma } from '../lib/prisma'
import { toTitleKey } from '../lib/title-key'

const NOT_FOUND = 'Categoria não encontrada'
const DUPLICATE_TITLE = 'Já existe uma categoria com esse nome'

// Lucide icon names and colour keys accepted by the API contract.
const ICONS = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'paw-print',
  'house',
  'gift',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text',
] as const

const COLORS = [
  'green',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'teal',
  'sky',
  'violet',
  'fuchsia',
  'rose',
  'amber',
  'lime',
  'emerald',
  'cyan',
  'indigo',
  'navy',
  'maroon',
  'brown',
  'olive',
] as const

const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: 'O título deve ter entre 1 e 50 caracteres' })
    .max(50, { error: 'O título deve ter entre 1 e 50 caracteres' })
    // NFC first, so an accent typed as a combining mark still counts as part of its letter.
    .normalize('NFC')
    .regex(/^[\p{L}\p{N} ]+$/u, { error: 'O título deve ter apenas letras, números e espaços' }),
  // An empty description is stored as null.
  description: z
    .string()
    .trim()
    .max(200, { error: 'A descrição deve ter no máximo 200 caracteres' })
    .nullish()
    .transform((value) => value || null),
  icon: z.enum(ICONS, { error: 'Ícone inválido' }),
  color: z.enum(COLORS, { error: 'Cor inválida' }),
})

export function isPrismaError(error: unknown, code: string) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
}

type CategoryStats = { transactionsCount: number; totalAmount: number }

export const EMPTY_STATS: CategoryStats = { transactionsCount: 0, totalAmount: 0 }

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

export async function createCategory(userId: string, input: CategoryInput) {
  const data = parseInput(categorySchema, input)

  try {
    const category = await prisma.category.create({
      data: { ...data, titleKey: toTitleKey(data.title), userId },
    })
    return { ...category, ...EMPTY_STATS }
  } catch (error) {
    if (isPrismaError(error, 'P2002')) throw conflict(DUPLICATE_TITLE)
    throw error
  }
}

export async function updateCategory(userId: string, id: string, input: CategoryInput) {
  // Ownership comes first: someone else's id answers NOT_FOUND whatever the payload.
  const existing = await prisma.category.findFirst({ where: { id, userId } })
  if (!existing) throw notFound(NOT_FOUND)

  const data = parseInput(categorySchema, input)

  try {
    const category = await prisma.category.update({
      where: { id, userId },
      data: { ...data, titleKey: toTitleKey(data.title) },
    })
    return { ...category, ...(await getCategoryStats(userId, id)) }
  } catch (error) {
    if (isPrismaError(error, 'P2002')) throw conflict(DUPLICATE_TITLE)
    // Deleted between the lookup and the update.
    if (isPrismaError(error, 'P2025')) throw notFound(NOT_FOUND)
    throw error
  }
}

// The database unlinks the transactions (onDelete: SetNull on Transaction.categoryId).
export async function deleteCategory(userId: string, id: string) {
  const existing = await prisma.category.findFirst({ where: { id, userId } })
  if (!existing) throw notFound(NOT_FOUND)

  try {
    await prisma.category.delete({ where: { id, userId } })
  } catch (error) {
    if (isPrismaError(error, 'P2025')) throw notFound(NOT_FOUND)
    throw error
  }
  return true
}
