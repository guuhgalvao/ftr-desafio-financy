import { Search } from 'lucide-react'
import { Input } from '@/components/input'
import { Select, type SelectOption } from '@/components/select'
import type { CategoryItem } from '@/graphql/queries/categories'
import { ALL_PERIODS, type PeriodOption } from '@/lib/format'

/** O Radix não aceita opção com valor vazio: `all` é o sentinela de "sem filtro". */
export const ALL = 'all'

export type TransactionFilterValues = {
  type: string
  categoryId: string
  period: string
}

export const initialFilters: TransactionFilterValues = {
  type: ALL,
  categoryId: ALL,
  period: ALL_PERIODS,
}

const TYPE_OPTIONS: SelectOption[] = [
  { value: ALL, label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]

type TransactionFiltersProps = {
  search: string
  onSearchChange: (search: string) => void
  values: TransactionFilterValues
  onChange: (values: Partial<TransactionFilterValues>) => void
  categories: CategoryItem[] | undefined
  periodOptions: PeriodOption[]
}

export function TransactionFilters({
  search,
  onSearchChange,
  values,
  onChange,
  categories,
  periodOptions,
}: TransactionFiltersProps) {
  const categoryOptions = [
    { value: ALL, label: 'Todas' },
    ...(categories ?? []).map((category) => ({ value: category.id, label: category.title })),
  ]

  return (
    <section className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white px-6 pt-5 pb-6 md:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Buscar"
        icon={Search}
        placeholder="Buscar por descrição"
        autoComplete="off"
        maxLength={100}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <Select
        label="Tipo"
        options={TYPE_OPTIONS}
        value={values.type}
        onValueChange={(type) => onChange({ type })}
      />
      <Select
        label="Categoria"
        options={categoryOptions}
        value={values.categoryId}
        onValueChange={(categoryId) => onChange({ categoryId })}
      />
      <Select
        label="Período"
        options={periodOptions}
        value={values.period}
        onValueChange={(period) => onChange({ period })}
      />
    </section>
  )
}
