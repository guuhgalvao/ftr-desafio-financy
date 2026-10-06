import {
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '../env'

// Cloudflare R2 through its S3-compatible API. This is the only module that talks to the bucket.
const client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
  // The SDK default adds CRC32 checksum parameters to presigned URLs, which a browser PUT to R2
  // cannot satisfy.
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
})

const Bucket = env.CLOUDFLARE_BUCKET

// The S3 presigner leaves Content-Type out of the signature unless it is listed here. With both
// signed, the upload is refused when the type or the size differs from what was requested.
const SIGNED_UPLOAD_HEADERS = new Set(['content-type', 'content-length'])

export function createUploadUrl(
  key: string,
  contentType: string,
  contentLength: number,
  expiresIn: number,
) {
  const command = new PutObjectCommand({
    Bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength,
  })
  return getSignedUrl(client, command, { expiresIn, signableHeaders: SIGNED_UPLOAD_HEADERS })
}

/** Type and size of a stored object, or `null` when it does not exist. */
export async function getObjectInfo(key: string) {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket, Key: key }))
    return { contentType: head.ContentType ?? '', contentLength: head.ContentLength ?? 0 }
  } catch (error) {
    if (isNotFound(error)) return null
    throw error
  }
}

export async function deleteObject(key: string) {
  await client.send(new DeleteObjectCommand({ Bucket, Key: key }))
}

/** Every object under a prefix, with the time it was last written. */
export async function listObjects(prefix: string) {
  const objects: { key: string; lastModified: Date }[] = []
  let continuationToken: string | undefined

  do {
    const page = await client.send(
      new ListObjectsV2Command({ Bucket, Prefix: prefix, ContinuationToken: continuationToken }),
    )
    for (const object of page.Contents ?? []) {
      if (object.Key && object.LastModified) {
        objects.push({ key: object.Key, lastModified: object.LastModified })
      }
    }
    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined
  } while (continuationToken)

  return objects
}

export function publicUrl(key: string) {
  return `${env.CLOUDFLARE_PUBLIC_URL}/${key}`
}

/** Key of an object served from the public URL, or `null` for any other URL. */
export function keyFromPublicUrl(url: string) {
  const prefix = `${env.CLOUDFLARE_PUBLIC_URL}/`
  return url.startsWith(prefix) ? url.slice(prefix.length) : null
}

function isNotFound(error: unknown) {
  if (typeof error !== 'object' || error === null) return false
  const { name, $metadata } = error as { name?: string; $metadata?: { httpStatusCode?: number } }
  return name === 'NotFound' || $metadata?.httpStatusCode === 404
}
