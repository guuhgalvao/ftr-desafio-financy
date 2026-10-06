// Fonte única de formatação da UI. A data da transação é uma string YYYY-MM-DD sem fuso:
// nada aqui usa `new Date('YYYY-MM-DD')`, que o JavaScript interpreta como UTC.

export type Period = { from: string; to: string }

export type PeriodOption = { value: string; label: string; period?: Period }

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100)
}

/** Valor com o sinal do tipo, como nas listas: `+ R$ 10,00` ou `- R$ 10,00`. */
export function formatSignedAmount(cents: number, type: 'INCOME' | 'EXPENSE'): string {
  return `${type === 'INCOME' ? '+' : '-'} ${formatCurrency(cents)}`
}

/** Centavos digitados no campo Valor: só os dígitos contam, no máximo `maxDigits`. */
export function parseCentsInput(text: string, maxDigits = 10): number {
  const digits = text.replace(/\D/g, '').slice(0, maxDigits)
  return digits ? Number(digits) : 0
}

/** Centavos como texto do campo Valor, sem o "R$": `123` vira `1,23`. Zero deixa o campo vazio. */
export function formatCentsInput(cents: number): string {
  if (!Number.isInteger(cents) || cents <= 0) return ''
  const digits = String(cents).padStart(3, '0')
  const reais = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${reais},${digits.slice(-2)}`
}

export function formatDate(isoDate: string, style: 'short' | 'long' = 'long'): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${style === 'short' ? year.slice(2) : year}`
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Data local (não UTC) de um `Date` como YYYY-MM-DD. */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO(now: Date = new Date()): string {
  return toISODate(now)
}

/** `Date` à meia-noite local, para o Calendar. */
export function parseISODate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Primeiro e último dia do mês. `month` vai de 1 a 12. */
export function monthPeriod(year: number, month: number): Period {
  return {
    from: `${year}-${pad(month)}-01`,
    to: toISODate(new Date(year, month, 0)),
  }
}

export function currentMonthPeriod(today: Date = new Date()): Period {
  return monthPeriod(today.getFullYear(), today.getMonth() + 1)
}

/** Últimos `days` dias contando hoje: `from` = hoje − (days − 1). */
export function lastDaysPeriod(days: number, today: Date = new Date()): Period {
  const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1))
  return { from: toISODate(from), to: toISODate(today) }
}

export function formatMonthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} / ${year}`
}

export const ALL_PERIODS = 'all'

/** Opções do filtro de período de Transações (item 24 de screens.md). */
export function getPeriodOptions(today: Date = new Date()): PeriodOption[] {
  const options: PeriodOption[] = [{ value: ALL_PERIODS, label: 'Todos os períodos' }]

  for (const days of [30, 60, 90]) {
    options.push({
      value: `last-${days}`,
      label: `Últimos ${days} dias`,
      period: lastDaysPeriod(days, today),
    })
  }

  for (let offset = 0; offset < 12; offset++) {
    const date = new Date(today.getFullYear(), today.getMonth() - offset, 1)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    options.push({
      value: `${year}-${pad(month)}`,
      label: formatMonthLabel(year, month),
      period: monthPeriod(year, month),
    })
  }

  return options
}

export function formatItemsCount(count: number): string {
  return `${count} ${count === 1 ? 'item' : 'itens'}`
}

/** Primeira letra do primeiro e do último nome; com um nome só, a primeira letra. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  const first = parts[0]
  const last = parts.length > 1 ? parts[parts.length - 1] : ''
  return `${[...first][0]}${last ? [...last][0] : ''}`.toUpperCase()
}
