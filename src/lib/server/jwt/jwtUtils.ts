'use server'

import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

const JWT_SECRET: Secret = process.env.JWT_SECRET!

export interface CustomClaims extends JwtPayload {
  uuid: string
  email: string
  sub?: string
}

export async function parseAuthCookie(
  cookieHeader: string | null,
): Promise<string | null> {
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim())
  for (const cookie of cookies) {
    if (cookie.startsWith('jwt=')) {
      return cookie.substring('jwt='.length)
    }
  }
  return null
}

export async function verifyJwtToken(
  token: string,
): Promise<CustomClaims | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (typeof decoded === 'string') return null
    return decoded as CustomClaims
  } catch {
    return null
  }
}
