import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import type { LoginInput } from '../dtos/input/login.input'
import type { RegisterInput } from '../dtos/input/register.input'
import type { UpdateProfileInput } from '../dtos/input/update-profile.input'
import { conflict, parseInput, unauthenticated } from '../graphql/errors'
import { signToken } from '../lib/jwt'
import { prisma } from '../lib/prisma'

const INVALID_CREDENTIALS = 'E-mail ou senha inválidos'

// Compared against when the e-mail is unknown, so both login failures take similar time.
const DUMMY_HASH = bcrypt.hashSync('financy-dummy-password', 10)

const nameSchema = z
  .string()
  .trim()
  .min(2, { error: 'O nome deve ter entre 2 e 100 caracteres' })
  .max(100, { error: 'O nome deve ter entre 2 e 100 caracteres' })

const registerSchema = z.object({
  name: nameSchema,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'E-mail inválido' })),
  password: z
    .string()
    .min(8, { error: 'A senha deve ter entre 8 e 72 caracteres' })
    .max(72, { error: 'A senha deve ter entre 8 e 72 caracteres' }),
})

const updateProfileSchema = z.object({ name: nameSchema })

export async function register(input: RegisterInput) {
  const data = parseInput(registerSchema, input)

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: await bcrypt.hash(data.password, 10),
      },
    })
    return { token: signToken(user.id), user }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Este e-mail já está cadastrado')
    }
    throw error
  }
}

export async function login(input: LoginInput) {
  const email = input.email.trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email } })

  const passwordMatches = await bcrypt.compare(input.password, user?.passwordHash ?? DUMMY_HASH)
  if (!user || !passwordMatches) throw unauthenticated(INVALID_CREDENTIALS)

  return { token: signToken(user.id), user }
}

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw unauthenticated()
  return user
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const data = parseInput(updateProfileSchema, input)
  return prisma.user.update({ where: { id: userId }, data: { name: data.name } })
}
