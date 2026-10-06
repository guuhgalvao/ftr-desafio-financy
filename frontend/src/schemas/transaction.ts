import { z } from 'zod'

export const TRANSACTION_TYPES = ['EXPENSE', 'INCOME'] as const

export const MAX_AMOUNT_CENTS = 1_000_000_000

const amountError = 'O valor deve estar entre R$ 0,01 e R$ 10.000.000,00'

// Mesmas regras e mensagens do contrato (docs/api-contract.md, seção Transações).
export const transactionSchema = z.object({
  type: z.enum(TRANSACTION_TYPES, { error: 'Tipo inválido' }),
  description: z
    .string()
    .trim()
    .min(1, { error: 'A descrição deve ter entre 1 e 100 caracteres' })
    .max(100, { error: 'A descrição deve ter entre 1 e 100 caracteres' }),
  // Só a data, YYYY-MM-DD. Vazia enquanto o usuário não escolhe um dia no calendário.
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Selecione uma data' }),
  // Centavos inteiros.
  amount: z
    .number({ error: amountError })
    .int({ error: amountError })
    .min(1, { error: amountError })
    .max(MAX_AMOUNT_CENTS, { error: amountError }),
  categoryId: z.string().min(1, { error: 'Selecione uma categoria' }),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
