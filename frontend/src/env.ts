import { z } from 'zod'

const envSchema = z.object({
  VITE_BACKEND_URL: z.url({ error: 'VITE_BACKEND_URL deve ser uma URL válida' }),
})

const parsed = envSchema.parse(import.meta.env)

export const env = {
  VITE_BACKEND_URL: parsed.VITE_BACKEND_URL.replace(/\/+$/, ''),
}
