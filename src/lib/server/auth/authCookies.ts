import { NextResponse } from 'next/server'

export function setJwtCookie(
  res: NextResponse,
  jwt: string,
  remember: boolean,
): void {
  res.cookies.set('jwt', jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    ...(remember ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  })
}
