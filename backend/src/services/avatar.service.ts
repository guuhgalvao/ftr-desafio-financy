import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { badUserInput, notFound, parseInput } from '../graphql/errors'
import { prisma } from '../lib/prisma'
import * as storage from '../lib/storage'
import { getUser } from './user.service'

const MAX_SIZE = 2 * 1024 * 1024
const UPLOAD_URL_EXPIRES_IN = 300

// A signed URL is good for `UPLOAD_URL_EXPIRES_IN`; one more minute covers the trip from the
// upload to `updateAvatar`. Past that, an object that is not the current photo is an orphan.
const ORPHAN_AGE_MS = (UPLOAD_URL_EXPIRES_IN + 60) * 1000

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
  await cleanUp(userId, key, current.avatarUrl)
  return user
}

export async function removeAvatar(userId: string) {
  const current = await getUser(userId)
  const user = current.avatarUrl
    ? await prisma.user.update({ where: { id: userId }, data: { avatarUrl: null } })
    : current

  // Runs even without a photo: uploads that were never confirmed are cleaned here too.
  await cleanUp(userId, null, current.avatarUrl)
  return user
}

/**
 * Leaves in the user's prefix only the object in use. Besides the photo that was just replaced,
 * this removes what earlier failures left behind: uploads never confirmed with `updateAvatar`,
 * deletes that failed, and photos saved under another public URL.
 *
 * An object newer than `ORPHAN_AGE_MS` may be an upload still on its way to `updateAvatar` (from
 * another tab, for instance), so it is kept until a later call.
 */
async function cleanUp(userId: string, keepKey: string | null, previousUrl: string | null) {
  const prefix = keyPrefix(userId)
  const fromUrl = previousUrl ? storage.keyFromPublicUrl(previousUrl) : null
  const previousKey = fromUrl?.startsWith(prefix) && fromUrl !== keepKey ? fromUrl : null

  let objects: Awaited<ReturnType<typeof storage.listObjects>>
  try {
    objects = await storage.listObjects(prefix)
  } catch (error) {
    console.error(`Não foi possível listar os objetos de ${prefix} no bucket:`, error)
    if (previousKey) await deleteQuietly(previousKey)
    return
  }

  const now = Date.now()
  const orphans = objects
    .filter(({ key }) => key !== keepKey)
    .filter(
      ({ key, lastModified }) =>
        key === previousKey || now - lastModified.getTime() > ORPHAN_AGE_MS,
    )
  await Promise.all(orphans.map(({ key }) => deleteQuietly(key)))
}

// The database is already right at this point: a failed delete only leaves an orphan object, which
// the next `cleanUp` removes.
async function deleteQuietly(key: string) {
  try {
    await storage.deleteObject(key)
  } catch (error) {
    console.error(`Não foi possível apagar o objeto ${key} do bucket:`, error)
  }
}
