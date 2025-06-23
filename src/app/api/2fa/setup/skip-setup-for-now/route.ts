import { NextResponse } from 'next/server'
import { CookieService } from '@/lib'

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({
    isSuccess: true,
    message: '2fa.setup.skipForNow',
  })

  CookieService.setTwoFASetUpSkippedCookie(response)

  return response
}
