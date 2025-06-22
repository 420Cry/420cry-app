import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import {
  AUTH_ROUTES,
  SIGN_IN_ROUTE,
  HOME_ROUTE,
  BLOCKED_ROUTES_FOR_AUTH_USERS,
  TWO_FACTOR_SETUP_ROUTE,
  TWO_FACTOR_VERIFY_ROUTE,
  UN_AUTH_ROUTES,
} from './lib'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl
  const jwtToken = req.cookies.get('jwt')?.value
  const twoFASetUpSkippedForNow =
    req.cookies.get('twoFASetUpSkippedForNow')?.value === 'true'
  const twoFAVerified = req.cookies.get('twoFAVerified')?.value === 'true'

  let isAuthenticated = false
  let twoFAEnabled = false
  let tokenExpired = false

  if (jwtToken) {
    try {
      const { payload } = await jwtVerify(jwtToken, JWT_SECRET)

      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) {
        tokenExpired = true
      } else {
        isAuthenticated = true
        twoFAEnabled = Boolean(payload.twoFAEnabled)
      }
    } catch {
      tokenExpired = true
    }
  }

  // --- Force logout if token is expired ---
  if (tokenExpired) {
    const response = NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
    response.cookies.delete('jwt')
    response.cookies.delete('twoFAVerified')
    response.cookies.delete('twoFASetUpSkippedForNow')
    return response
  }

  // --- Prevent access to unauth routes during 2FA verification ---
  if (
    isAuthenticated &&
    twoFAEnabled &&
    !twoFAVerified &&
    UN_AUTH_ROUTES.includes(pathname) &&
    pathname !== TWO_FACTOR_VERIFY_ROUTE
  ) {
    return NextResponse.redirect(new URL(TWO_FACTOR_VERIFY_ROUTE, req.url))
  }

  // --- Block authenticated users from unauth pages like login ---
  if (BLOCKED_ROUTES_FOR_AUTH_USERS.includes(pathname)) {
    if (isAuthenticated) {
      const redirectTo = twoFAEnabled ? HOME_ROUTE : TWO_FACTOR_SETUP_ROUTE
      return NextResponse.redirect(new URL(redirectTo, req.url))
    }
    return NextResponse.next()
  }

  // --- If auth route but user not authenticated ---
  const isProtectedRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }

  // --- User must complete 2FA setup ---
  if (
    isAuthenticated &&
    !twoFAEnabled &&
    !twoFASetUpSkippedForNow &&
    pathname !== TWO_FACTOR_SETUP_ROUTE &&
    !BLOCKED_ROUTES_FOR_AUTH_USERS.includes(pathname)
  ) {
    return NextResponse.redirect(new URL(TWO_FACTOR_SETUP_ROUTE, req.url))
  }

  // --- Block access to 2FA setup if already enabled ---
  if (isAuthenticated && twoFAEnabled && pathname === TWO_FACTOR_SETUP_ROUTE) {
    return NextResponse.redirect(new URL(HOME_ROUTE, req.url))
  }

  // --- Force OTP verification if not yet verified ---
  if (isAuthenticated && twoFAEnabled && !twoFAVerified) {
    const twoFACookieExists =
      req.cookies.get('twoFAVerified')?.value !== undefined

    if (!twoFACookieExists) {
      // If cookie is missing, logout user
      const response = NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
      response.cookies.delete('jwt')
      response.cookies.delete('twoFAVerified')
      response.cookies.delete('twoFASetUpSkippedForNow')
      return response
    }

    // If user is not on the 2FA verify route, redirect them there
    if (pathname !== TWO_FACTOR_VERIFY_ROUTE) {
      return NextResponse.redirect(new URL(TWO_FACTOR_VERIFY_ROUTE, req.url))
    }

    // Allow access to /2fa/verify
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|logo.png|api).*)'],
}
