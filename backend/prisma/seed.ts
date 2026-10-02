import { PrismaClient, type TransactionType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { toDbDate } from '../src/lib/date'
import { toTitleKey } from '../src/lib/title-key'

const prisma = new PrismaClient()

const DEMO_USER = {
  name: 'Usuário Demo',
  email: 'demo@financy.dev',
  password: 'financy123',
}

const CATEGORIES = [
  { title: 'Salário', description: 'Renda mensal', icon: 'briefcase-business', color: 'green' },
  {
    title: 'Alimentação',
    description: 'Restaurantes e delivery',
    icon: 'utensils',
    color: 'orange',
  },
  {
    title: 'Transporte',
    description: 'Combustível e aplicativos',
    icon: 'car-front',
    color: 'blue',
  },
  { title: 'Mercado', description: 'Compras do mês', icon: 'shopping-cart', color: 'purple' },
  { title: 'Lazer', description: null, icon: 'ticket', color: 'pink' },
  { title: 'Saúde', description: 'Farmácia e consultas', icon: 'heart-pulse', color: 'red' },
  { title: 'Moradia', description: 'Aluguel e contas da casa', icon: 'house', color: 'yellow' },
] as const

type CategoryTitle = (typeof CATEGORIES)[number]['title']

type SeedTransaction = {
  description: string
  amount: number
  type: TransactionType
  monthsAgo: number
  day: number
  category: CategoryTitle | null
}

const TRANSACTIONS: SeedTransaction[] = [
  {
    description: 'Salário',
    amount: 650000,
    type: 'INCOME',
    monthsAgo: 0,
    day: 1,
    category: 'Salário',
  },
  {
    description: 'Aluguel',
    amount: 180000,
    type: 'EXPENSE',
    monthsAgo: 0,
    day: 5,
    category: 'Moradia',
  },
  {
    description: 'Compras no supermercado',
    amount: 42350,
    type: 'EXPENSE',
    monthsAgo: 0,
    day: 8,
    category: 'Mercado',
  },
  {
    description: 'Jantar no restaurante',
    amount: 8990,
    type: 'EXPENSE',
    monthsAgo: 0,
    day: 12,
    category: 'Alimentação',
  },
  {
    description: 'Combustível',
    amount: 22000,
    type: 'EXPENSE',
    monthsAgo: 0,
    day: 15,
    category: 'Transporte',
  },
  {
    description: 'Transferência recebida',
    amount: 15000,
    type: 'INCOME',
    monthsAgo: 0,
    day: 18,
    category: null,
  },
  {
    description: 'Salário',
    amount: 650000,
    type: 'INCOME',
    monthsAgo: 1,
    day: 1,
    category: 'Salário',
  },
  {
    description: 'Aluguel',
    amount: 180000,
    type: 'EXPENSE',
    monthsAgo: 1,
    day: 5,
    category: 'Moradia',
  },
  {
    description: 'Compras no supermercado',
    amount: 38720,
    type: 'EXPENSE',
    monthsAgo: 1,
    day: 10,
    category: 'Mercado',
  },
  {
    description: 'Cinema',
    amount: 6400,
    type: 'EXPENSE',
    monthsAgo: 1,
    day: 14,
    category: 'Lazer',
  },
  {
    description: 'Farmácia',
    amount: 12480,
    type: 'EXPENSE',
    monthsAgo: 1,
    day: 20,
    category: 'Saúde',
  },
  {
    description: 'Projeto freelance',
    amount: 120000,
    type: 'INCOME',
    monthsAgo: 1,
    day: 25,
    category: 'Salário',
  },
  {
    description: 'Salário',
    amount: 650000,
    type: 'INCOME',
    monthsAgo: 2,
    day: 1,
    category: 'Salário',
  },
  {
    description: 'Aluguel',
    amount: 180000,
    type: 'EXPENSE',
    monthsAgo: 2,
    day: 5,
    category: 'Moradia',
  },
  {
    description: 'Aplicativo de transporte',
    amount: 3590,
    type: 'EXPENSE',
    monthsAgo: 2,
    day: 17,
    category: 'Transporte',
  },
  {
    description: 'Almoço',
    amount: 4500,
    type: 'EXPENSE',
    monthsAgo: 2,
    day: 22,
    category: 'Alimentação',
  },
]

// Dates are relative to the day the seed runs, so the current month always has data.
// Current-month days are capped at today so nothing lands in the future.
function seedDate(today: Date, monthsAgo: number, day: number): string {
  const month = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1)
  const safeDay = monthsAgo === 0 ? Math.min(day, today.getDate()) : day
  const mm = String(month.getMonth() + 1).padStart(2, '0')
  const dd = String(safeDay).padStart(2, '0')
  return `${month.getFullYear()}-${mm}-${dd}`
}

async function main() {
  await prisma.user.deleteMany({ where: { email: DEMO_USER.email } })

  const user = await prisma.user.create({
    data: {
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      passwordHash: await bcrypt.hash(DEMO_USER.password, 10),
    },
  })

  const categoryIds = new Map<CategoryTitle, string>()
  for (const category of CATEGORIES) {
    const created = await prisma.category.create({
      data: { ...category, titleKey: toTitleKey(category.title), userId: user.id },
    })
    categoryIds.set(category.title, created.id)
  }

  const today = new Date()
  await prisma.transaction.createMany({
    data: TRANSACTIONS.map(({ monthsAgo, day, category, ...transaction }) => ({
      ...transaction,
      date: toDbDate(seedDate(today, monthsAgo, day)),
      categoryId: category ? (categoryIds.get(category) ?? null) : null,
      userId: user.id,
    })),
  })

  console.log(
    `Seed concluído: ${DEMO_USER.email}, ${CATEGORIES.length} categorias, ${TRANSACTIONS.length} transações.`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
