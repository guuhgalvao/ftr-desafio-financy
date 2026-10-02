import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import type { PeriodInput } from '../dtos/input/period.input'
import { parseInput } from '../graphql/errors'
import { dateSchema, toDbDate } from '../lib/date'
import { prisma } from '../lib/prisma'

const periodSchema = z
  .object({ from: dateSchema, to: dateSchema })
  // YYYY-MM-DD strings sort the same way as the dates they stand for.
  .refine(({ from, to }) => from <= to, {
    error: 'A data inicial não pode ser depois da data final',
    path: ['from'],
  })

// Income and expense totals in cents, summed by the database.
async function sumByType(where: Prisma.TransactionWhereInput) {
  const groups = await prisma.transaction.groupBy({
    by: ['type'],
    where,
    _sum: { amount: true },
  })

  const totals = { INCOME: 0, EXPENSE: 0 }
  for (const group of groups) totals[group.type] = group._sum.amount ?? 0
  return totals
}

// The balance covers every transaction of the user; income and expense only the period.
export async function getSummary(userId: string, input: PeriodInput) {
  const { from, to } = parseInput(periodSchema, input)

  const [all, period] = await Promise.all([
    sumByType({ userId }),
    // Dates are stored at midnight UTC, so `lte` on the last day makes the range inclusive.
    sumByType({ userId, date: { gte: toDbDate(from), lte: toDbDate(to) } }),
  ])

  return { balance: all.INCOME - all.EXPENSE, income: period.INCOME, expense: period.EXPENSE }
}
