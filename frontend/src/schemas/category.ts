import { z } from 'zod'
import { CATEGORY_COLORS, CATEGORY_ICON_NAMES } from '@/lib/categories'

// Mesmas regras e mensagens do contrato (docs/api-contract.md, seção Categorias).
export const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: 'O título deve ter entre 1 e 50 caracteres' })
    .max(50, { error: 'O título deve ter entre 1 e 50 caracteres' })
    // NFC antes do regex: um acento digitado como marca combinante conta como parte da letra.
    .normalize('NFC')
    .regex(/^[\p{L}\p{N} ]+$/u, { error: 'O título deve ter apenas letras, números e espaços' }),
  // Opcional: vazia é enviada como `null`.
  description: z
    .string()
    .trim()
    .max(200, { error: 'A descrição deve ter no máximo 200 caracteres' }),
  icon: z.enum(CATEGORY_ICON_NAMES, { error: 'Ícone inválido' }),
  color: z.enum(CATEGORY_COLORS, { error: 'Cor inválida' }),
})

export type CategoryFormData = z.infer<typeof categorySchema>
