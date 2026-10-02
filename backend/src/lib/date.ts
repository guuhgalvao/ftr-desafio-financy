import { z } from 'zod'

// Transaction dates are date-only (YYYY-MM-DD) in the API and midnight UTC in the database.
// This is the only place that converts between the two.

export function toDbDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`)
}

export function fromDbDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = toDbDate(value)
  // The engine rolls 2026-02-30 over to March 2nd; the round trip exposes dates that don't exist.
  return !Number.isNaN(date.getTime()) && fromDbDate(date) === value
}

export const dateSchema = z
  .string({ error: 'Data inválida. Use o formato AAAA-MM-DD' })
  .refine(isValidDate, { error: 'Data inválida. Use o formato AAAA-MM-DD' })
