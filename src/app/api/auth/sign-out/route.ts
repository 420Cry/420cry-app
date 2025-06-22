import { NextResponse } from 'next/server'
import { CookieService } from '@/lib'

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({
    isSuccess: true,
    message: 'app.alertTitle.logOutSuccessful',
  })

  CookieService.clearJwtCookie(response)
  CookieService.clearTwoFAVerifiedCookie(response)

  return response
}
