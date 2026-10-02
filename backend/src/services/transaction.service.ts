import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import type { PaginationInput } from '../dtos/input/pagination.input'
import type { TransactionFilterInput } from '../dtos/input/transaction-filter.input'
import { notFound, parseInput } from '../graphql/errors'
import { dateSchema, fromDbDate, toDbDate } from '../lib/date'
import { prisma } from '../lib/prisma'
import { toTitleKey } from '../lib/title-key'
import { EMPTY_STATS, getStatsByCategory } from './category.service'

const NOT_FOUND = 'Transação não encontrada'

const TYPES = ['INCOME', 'EXPENSE'] as const

const filterSchema = z
  .object({
    // An empty search is the same as no search.
    search: z
      .string()
      .trim()
      .max(100, { error: 'A busca deve ter no máximo 100 caracteres' })
      .nullish()
      .transform((value) => value || undefined),
    type: z.enum(TYPES, { error: 'Tipo inválido' }).nullish(),
    categoryId: z.string().nullish(),
    from: dateSchema.nullish(),
    to: dateSchema.nullish(),
  })
  // YYYY-MM-DD strings sort the same way as the dates they stand for.
  .refine(({ from, to }) => !from || !to || from <= to, {
    error: 'A data inicial não pode ser depois da data final',
    path: ['from'],
  })

const paginationSchema = z.object({
  page: z
    .int({ error: 'A página deve ser maior ou igual a 1' })
    .min(1, { error: 'A página deve ser maior ou igual a 1' }),
  perPage: z
    .int({ error: 'A quantidade por página deve estar entre 1 e 50' })
    .min(1, { error: 'A quantidade por página deve estar entre 1 e 50' })
    .max(50, { error: 'A quantidade por página deve estar entre 1 e 50' }),
})

const DEFAULT_PAGINATION = { page: 1, perPage: 10 }

const include = { category: true } satisfies Prisma.TransactionInclude

// Newest date first, then newest created. The id only breaks ties between rows created in the
// same instant, so pages stay stable.
const orderBy: Prisma.TransactionOrderByWithRelationInput[] = [
  { date: 'desc' },
  { createdAt: 'desc' },
  { id: 'desc' },
]

type TransactionRow = Prisma.TransactionGetPayload<{ include: typeof include }>
type CategoryStatsMap = Awaited<ReturnType<typeof getStatsByCategory>>

// Shapes a database row as the API type: date as YYYY-MM-DD and the category with its stats.
function toTransaction(
  { category, date, ...transaction }: TransactionRow,
  stats: CategoryStatsMap,
) {
  return {
    ...transaction,
    date: fromDbDate(date),
    category: category && { ...category, ...(stats.get(category.id) ?? EMPTY_STATS) },
  }
}

export async function listTransactions(
  userId: string,
  filterInput?: TransactionFilterInput | null,
  paginationInput?: PaginationInput | null,
) {
  const { search, type, categoryId, from, to } = parseInput(filterSchema, filterInput ?? {})
  const { page, perPage } = parseInput(paginationSchema, paginationInput ?? DEFAULT_PAGINATION)

  // Dates are stored at midnight UTC, so `lte` on the last day already makes the range inclusive.
  const where: Prisma.TransactionWhereInput = {
    userId,
    ...(type && { type }),
    ...(categoryId && { categoryId }),
    ...((from || to) && {
      date: { ...(from && { gte: toDbDate(from) }), ...(to && { lte: toDbDate(to) }) },
    }),
  }
  const skip = (page - 1) * perPage

  let rows: TransactionRow[]
  let total: number

  if (search) {
    // SQLite's LIKE only ignores case for ASCII and never ignores accents, so the description is
    // matched here instead, with the same normalisation used for category titles.
    const searchKey = toTitleKey(search)
    const candidates = await prisma.transaction.findMany({
      where,
      orderBy,
      select: { id: true, description: true },
    })
    const matched = candidates.filter(({ description }) =>
      toTitleKey(description).includes(searchKey),
    )
    const ids = matched.slice(skip, skip + perPage).map(({ id }) => id)

    total = matched.length
    rows = await prisma.transaction.findMany({
      where: { id: { in: ids }, userId },
      include,
      orderBy,
    })
  } else {
    ;[rows, total] = await prisma.$transaction([
      prisma.transaction.findMany({ where, include, orderBy, skip, take: perPage }),
      prisma.transaction.count({ where }),
    ])
  }

  const stats = await getStatsByCategory(userId)
  return { items: rows.map((row) => toTransaction(row, stats)), total, page, perPage }
}

export async function getTransaction(userId: string, id: string) {
  const [transaction, stats] = await Promise.all([
    prisma.transaction.findFirst({ where: { id, userId }, include }),
    getStatsByCategory(userId),
  ])
  if (!transaction) throw notFound(NOT_FOUND)

  return toTransaction(transaction, stats)
}
