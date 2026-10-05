import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// `text-value` é um tamanho do tema (index.css). Sem isto, o tailwind-merge o trataria como cor.
const twMerge = extendTailwindMerge({ extend: { theme: { text: ['value'] } } })

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
