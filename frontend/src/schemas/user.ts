import { z } from 'zod'

// Mesmas regras e mensagens do contrato (docs/api-contract.md, seção Usuário).
const nameSchema = z
  .string()
  .trim()
  .min(2, { error: 'O nome deve ter entre 2 e 100 caracteres' })
  .max(100, { error: 'O nome deve ter entre 2 e 100 caracteres' })

const emailSchema = z
  .string()
  .trim()
  .pipe(z.email({ error: 'E-mail inválido' }))

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z
    .string()
    .min(8, { error: 'A senha deve ter entre 8 e 72 caracteres' })
    .max(72, { error: 'A senha deve ter entre 8 e 72 caracteres' }),
})

// O back-end não valida o tamanho da senha no login: qualquer falha vira "E-mail ou senha inválidos".
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: 'Informe a senha' }),
  remember: z.boolean(),
})

export const profileSchema = z.object({ name: nameSchema })

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
