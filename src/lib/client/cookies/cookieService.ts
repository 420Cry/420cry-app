import { NextResponse } from 'next/server'

const isProd = process.env.NODE_ENV === 'production'

type CookieOptions = Parameters<typeof NextResponse.prototype.cookies.set>[2]

export const CookieService = {
  setJwtCookie(
    response: NextResponse,
    jwt: string,
    rememberMe = false,
    optionsOverrides: Partial<CookieOptions> = {},
  ): void {
    const options: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      path: '/',
      sameSite: 'lax',
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}), // 30 days if rememberMe
      ...optionsOverrides,
    }
    response.cookies.set('jwt', jwt, options)
  },

  setTwoFAVerifiedCookie(
    response: NextResponse,
    value = 'true',
    rememberMe = false,
    optionsOverrides: Partial<CookieOptions> = {},
  ): void {
    const options: CookieOptions = {
      httpOnly: false,
      secure: isProd,
      path: '/',
      sameSite: 'lax',
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
      ...optionsOverrides,
    }
    response.cookies.set('twoFAVerified', value, options)
  },

  setTwoFASetUpSkippedCookie(response: NextResponse): void {
    response.cookies.set('twoFASetUpSkippedForNow', 'true', {
      httpOnly: true,
      secure: isProd,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
    })
  },

  clearJwtCookie(response: NextResponse): void {
    response.cookies.set('jwt', '', {
      httpOnly: true,
      secure: isProd,
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    })
  },

  clearTwoFAVerifiedCookie(response: NextResponse): void {
    response.cookies.set('twoFAVerified', '', {
      httpOnly: false,
      secure: isProd,
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    })
  },
}
