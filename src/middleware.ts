import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import {
  AUTH_ROUTES,
  SIGN_IN_ROUTE,
  HOME_ROUTE,
  BLOCKED_ROUTES_FOR_AUTH_USERS,
  TWO_FACTOR_SETUP_ROUTE,
  TWO_FACTOR_VERIFY_ROUTE,
} from './lib'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname
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

  // If token is expired → force logout
  if (tokenExpired) {
    const response = NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
    response.cookies.delete('jwt')
    return response
  }

  // Block authenticated users from accessing unauth routes
  if (BLOCKED_ROUTES_FOR_AUTH_USERS.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL(twoFAEnabled ? HOME_ROUTE : TWO_FACTOR_SETUP_ROUTE, req.url),
      )
    }
    return NextResponse.next()
  }

  // Route requires auth but user is not logged in
  const isProtectedRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }

  // If user is authenticated but hasn't finished 2FA setup
  if (
    isAuthenticated &&
    !twoFAEnabled &&
    !twoFASetUpSkippedForNow &&
    pathname !== TWO_FACTOR_SETUP_ROUTE &&
    !BLOCKED_ROUTES_FOR_AUTH_USERS.includes(pathname)
  ) {
    return NextResponse.redirect(new URL(TWO_FACTOR_SETUP_ROUTE, req.url))
  }

  // Block access to 2FA setup page if 2FA already enabled
  if (isAuthenticated && twoFAEnabled && pathname === TWO_FACTOR_SETUP_ROUTE) {
    return NextResponse.redirect(new URL(HOME_ROUTE, req.url))
  }

  // **Force OTP verification if 2FA enabled but not verified this session**
  if (
    isAuthenticated &&
    twoFAEnabled &&
    !twoFAVerified &&
    pathname !== TWO_FACTOR_VERIFY_ROUTE
  ) {
    return NextResponse.redirect(new URL(TWO_FACTOR_VERIFY_ROUTE, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|logo.png|api).*)'],
}
