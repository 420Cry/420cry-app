import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: '2FA setup skipped for now' })

  // Set the skip cookie, expires in 1 hour
  response.cookies.set('twoFASetUpSkippedForNow', 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
