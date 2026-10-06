import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { badUserInput, notFound, parseInput } from '../graphql/errors'
import { prisma } from '../lib/prisma'
import * as storage from '../lib/storage'
import { getUser } from './user.service'

const MAX_SIZE = 2 * 1024 * 1024
const UPLOAD_URL_EXPIRES_IN = 300

const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

const INVALID_TYPE = 'Envie uma imagem PNG, JPG ou WEBP'
const INVALID_SIZE = 'A imagem deve ter no máximo 2 MB'
const NOT_FOUND = 'Imagem não encontrada'

const KEY_FILE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp)$/

const uploadSchema = z.object({
  contentType: z
    .string()
    .refine((type) => Object.hasOwn(EXTENSIONS, type), { error: INVALID_TYPE }),
  contentLength: z.number().int().min(1, { error: INVALID_SIZE }).max(MAX_SIZE, {
    error: INVALID_SIZE,
  }),
})

function keyPrefix(userId: string) {
  return `avatars/${userId}/`
}

export async function createUploadUrl(userId: string, contentType: string, contentLength: number) {
  const data = parseInput(uploadSchema, { contentType, contentLength })

  const key = `${keyPrefix(userId)}${randomUUID()}.${EXTENSIONS[data.contentType]}`
  const uploadUrl = await storage.createUploadUrl(
    key,
    data.contentType,
    data.contentLength,
    UPLOAD_URL_EXPIRES_IN,
  )
  return { uploadUrl, key, expiresIn: UPLOAD_URL_EXPIRES_IN }
}

export async function updateAvatar(userId: string, key: string) {
  // A key outside the user's own prefix answers exactly like a missing object.
  const prefix = keyPrefix(userId)
  if (!key.startsWith(prefix) || !KEY_FILE.test(key.slice(prefix.length))) throw notFound(NOT_FOUND)

  const object = await storage.getObjectInfo(key)
  if (!object) throw notFound(NOT_FOUND)

  // The signed URL already pins type and size; this covers an object that got there another way.
  const isValidType = Object.hasOwn(EXTENSIONS, object.contentType)
  if (!isValidType || object.contentLength > MAX_SIZE) {
    await deleteQuietly(key)
    throw badUserInput(isValidType ? INVALID_SIZE : INVALID_TYPE)
  }

  const current = await getUser(userId)
  const avatarUrl = storage.publicUrl(key)
  if (current.avatarUrl === avatarUrl) return current

  const user = await prisma.user.update({ where: { id: userId }, data: { avatarUrl } })
  await deletePrevious(current.avatarUrl)
  return user
}

export async function removeAvatar(userId: string) {
  const current = await getUser(userId)
  if (!current.avatarUrl) return current

  const user = await prisma.user.update({ where: { id: userId }, data: { avatarUrl: null } })
  await deletePrevious(current.avatarUrl)
  return user
}

async function deletePrevious(avatarUrl: string | null) {
  const key = avatarUrl ? storage.keyFromPublicUrl(avatarUrl) : null
  if (key) await deleteQuietly(key)
}

// The database is already right at this point: a failed delete only leaves an orphan object.
async function deleteQuietly(key: string) {
  try {
    await storage.deleteObject(key)
  } catch (error) {
    console.error(`Não foi possível apagar o objeto ${key} do bucket:`, error)
  }
}
