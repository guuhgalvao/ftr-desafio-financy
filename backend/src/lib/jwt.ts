import jwt from 'jsonwebtoken'
import { env } from '../env'

export function signToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, { algorithm: 'HS256', subject: userId, expiresIn: '7d' })
}

export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] })
    if (typeof payload === 'string' || !payload.sub) return null
    return payload.sub
  } catch {
    return null
  }
}
