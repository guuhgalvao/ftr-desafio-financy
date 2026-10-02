// Transaction dates are date-only (YYYY-MM-DD) in the API and midnight UTC in the database.
// This is the only place that converts between the two.

export function toDbDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`)
}

export function fromDbDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
