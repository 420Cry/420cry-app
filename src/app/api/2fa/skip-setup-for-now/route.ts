import { IResponse } from '@/types'
import { NextResponse } from 'next/server'

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({
    isSuccess: true,
    message: '2fa.setup.skipForNow',
  } satisfies IResponse)

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
