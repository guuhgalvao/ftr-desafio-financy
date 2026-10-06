import { z } from 'zod'

const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),
  CLOUDFLARE_BUCKET: z.string().min(1),
  // Stored without the trailing slash: object URLs are built as `${CLOUDFLARE_PUBLIC_URL}/${key}`.
  CLOUDFLARE_PUBLIC_URL: z.url().transform((url) => url.replace(/\/+$/, '')),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const keys = [...new Set(parsed.error.issues.map((issue) => String(issue.path[0])))]
  console.error(`Variáveis de ambiente ausentes ou inválidas: ${keys.join(', ')}.`)
  console.error('Copie .env.example para .env e preencha os valores antes de subir a API.')
  process.exit(1)
}

export const env = parsed.data
