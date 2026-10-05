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

export const CATEGORY_COLORS = [
  'green',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
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
  gray: {
    tag: 'bg-gray-200 text-gray-700',
    box: 'bg-gray-200',
    icon: 'text-gray-500',
    swatch: 'bg-gray-500',
  },
}

export function isCategoryColor(value: string | null | undefined): value is CategoryColor {
  return CATEGORY_COLORS.includes(value as CategoryColor)
}

export function isCategoryIconName(value: string | null | undefined): value is CategoryIconName {
  return typeof value === 'string' && Object.hasOwn(CATEGORY_ICONS, value)
}
