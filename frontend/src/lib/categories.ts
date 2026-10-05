import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  type LucideIcon,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
} from 'lucide-react'

// Listas permitidas pelo contrato, na ordem dos seletores do modal de categoria.
export const CATEGORY_ICONS = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  'paw-print': PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  'baggage-claim': BaggageClaim,
  mailbox: Mailbox,
  'receipt-text': ReceiptText,
} satisfies Record<string, LucideIcon>

export type CategoryIconName = keyof typeof CATEGORY_ICONS

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS) as CategoryIconName[]

// A 1ª linha é a do Figma; as outras duas são cores extras, fora do design.
export const CATEGORY_COLORS = [
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

export type CategoryColor = (typeof CATEGORY_COLORS)[number]

/** `gray` não é selecionável: é o estilo de "Sem categoria". */
export type TagColor = CategoryColor | 'gray'

type ColorClasses = { tag: string; box: string; icon: string; swatch: string }

// Classes completas: o Tailwind não enxerga nomes montados em tempo de execução.
export const COLOR_CLASSES: Record<TagColor, ColorClasses> = {
  green: {
    tag: 'bg-green-light text-green-dark',
    box: 'bg-green-light',
    icon: 'text-green-base',
    swatch: 'bg-green-base',
  },
  blue: {
    tag: 'bg-blue-light text-blue-dark',
    box: 'bg-blue-light',
    icon: 'text-blue-base',
    swatch: 'bg-blue-base',
  },
  purple: {
    tag: 'bg-purple-light text-purple-dark',
    box: 'bg-purple-light',
    icon: 'text-purple-base',
    swatch: 'bg-purple-base',
  },
  pink: {
    tag: 'bg-pink-light text-pink-dark',
    box: 'bg-pink-light',
    icon: 'text-pink-base',
    swatch: 'bg-pink-base',
  },
  red: {
    tag: 'bg-red-light text-red-dark',
    box: 'bg-red-light',
    icon: 'text-red-base',
    swatch: 'bg-red-base',
  },
  orange: {
    tag: 'bg-orange-light text-orange-dark',
    box: 'bg-orange-light',
    icon: 'text-orange-base',
    swatch: 'bg-orange-base',
  },
  yellow: {
    tag: 'bg-yellow-light text-yellow-dark',
    box: 'bg-yellow-light',
    icon: 'text-yellow-base',
    swatch: 'bg-yellow-base',
  },
  teal: {
    tag: 'bg-teal-light text-teal-dark',
    box: 'bg-teal-light',
    icon: 'text-teal-base',
    swatch: 'bg-teal-base',
  },
  sky: {
    tag: 'bg-sky-light text-sky-dark',
    box: 'bg-sky-light',
    icon: 'text-sky-base',
    swatch: 'bg-sky-base',
  },
  violet: {
    tag: 'bg-violet-light text-violet-dark',
    box: 'bg-violet-light',
    icon: 'text-violet-base',
    swatch: 'bg-violet-base',
  },
  fuchsia: {
    tag: 'bg-fuchsia-light text-fuchsia-dark',
    box: 'bg-fuchsia-light',
    icon: 'text-fuchsia-base',
    swatch: 'bg-fuchsia-base',
  },
  rose: {
    tag: 'bg-rose-light text-rose-dark',
    box: 'bg-rose-light',
    icon: 'text-rose-base',
    swatch: 'bg-rose-base',
  },
  amber: {
    tag: 'bg-amber-light text-amber-dark',
    box: 'bg-amber-light',
    icon: 'text-amber-base',
    swatch: 'bg-amber-base',
  },
  lime: {
    tag: 'bg-lime-light text-lime-dark',
    box: 'bg-lime-light',
    icon: 'text-lime-base',
    swatch: 'bg-lime-base',
  },
  emerald: {
    tag: 'bg-emerald-light text-emerald-dark',
    box: 'bg-emerald-light',
    icon: 'text-emerald-base',
    swatch: 'bg-emerald-base',
  },
  cyan: {
    tag: 'bg-cyan-light text-cyan-dark',
    box: 'bg-cyan-light',
    icon: 'text-cyan-base',
    swatch: 'bg-cyan-base',
  },
  indigo: {
    tag: 'bg-indigo-light text-indigo-dark',
    box: 'bg-indigo-light',
    icon: 'text-indigo-base',
    swatch: 'bg-indigo-base',
  },
  navy: {
    tag: 'bg-navy-light text-navy-dark',
    box: 'bg-navy-light',
    icon: 'text-navy-base',
    swatch: 'bg-navy-base',
  },
  maroon: {
    tag: 'bg-maroon-light text-maroon-dark',
    box: 'bg-maroon-light',
    icon: 'text-maroon-base',
    swatch: 'bg-maroon-base',
  },
  brown: {
    tag: 'bg-brown-light text-brown-dark',
    box: 'bg-brown-light',
    icon: 'text-brown-base',
    swatch: 'bg-brown-base',
  },
  olive: {
    tag: 'bg-olive-light text-olive-dark',
    box: 'bg-olive-light',
    icon: 'text-olive-base',
    swatch: 'bg-olive-base',
  },
  gray: {
    tag: 'bg-gray-200 text-gray-700',
    box: 'bg-gray-200',
    icon: 'text-gray-500',
    swatch: 'bg-gray-500',
  },
}

// Nomes acessíveis das opções dos seletores do modal de categoria.
export const CATEGORY_ICON_LABELS: Record<CategoryIconName, string> = {
  'briefcase-business': 'Maleta',
  'car-front': 'Carro',
  'heart-pulse': 'Saúde',
  'piggy-bank': 'Cofrinho',
  'shopping-cart': 'Carrinho de compras',
  ticket: 'Ingresso',
  'tool-case': 'Caixa de ferramentas',
  utensils: 'Talheres',
  'paw-print': 'Pata',
  house: 'Casa',
  gift: 'Presente',
  dumbbell: 'Haltere',
  'book-open': 'Livro',
  'baggage-claim': 'Bagagem',
  mailbox: 'Caixa de correio',
  'receipt-text': 'Recibo',
}

export const CATEGORY_COLOR_LABELS: Record<CategoryColor, string> = {
  green: 'Verde',
  blue: 'Azul',
  purple: 'Roxo',
  pink: 'Rosa',
  red: 'Vermelho',
  orange: 'Laranja',
  yellow: 'Amarelo',
  teal: 'Verde-azulado',
  sky: 'Azul-céu',
  violet: 'Violeta',
  fuchsia: 'Fúcsia',
  rose: 'Rosa-avermelhado',
  amber: 'Âmbar',
  lime: 'Verde-limão',
  emerald: 'Esmeralda',
  cyan: 'Ciano',
  indigo: 'Índigo',
  navy: 'Azul-marinho',
  maroon: 'Vinho',
  brown: 'Marrom',
  olive: 'Verde-oliva',
}

/**
 * A categoria com mais transações (item 30 de screens.md). Espera a lista em ordem alfabética,
 * como a API devolve: no empate fica a primeira. Sem nenhuma transação, `null`.
 */
export function getMostUsedCategory<T extends { transactionsCount: number }>(
  categories: readonly T[],
): T | null {
  let mostUsed: T | null = null
  for (const category of categories) {
    if (category.transactionsCount > (mostUsed?.transactionsCount ?? 0)) mostUsed = category
  }
  return mostUsed
}

export function isCategoryColor(value: string | null | undefined): value is CategoryColor {
  return CATEGORY_COLORS.includes(value as CategoryColor)
}

export function isCategoryIconName(value: string | null | undefined): value is CategoryIconName {
  return typeof value === 'string' && Object.hasOwn(CATEGORY_ICONS, value)
}
