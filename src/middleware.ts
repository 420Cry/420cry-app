import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import {
  AUTH_ROUTES,
  SIGN_IN_ROUTE,
  HOME_ROUTE,
  LANDING_PAGE_ROUTE,
  BLOCKED_ROUTES_FOR_AUTH_USERS,
  TWO_FACTOR_SETUP_ROUTE,
  TWO_FACTOR_VERIFY_ROUTE,
  UN_AUTH_ROUTES,
  TWO_FACTOR_ALTERNATIVE,
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

  // --- Redirect to 2FA verify page if required ---
  if (
    isAuthenticated &&
    twoFAEnabled &&
    !twoFAVerified &&
    pathname !== TWO_FACTOR_VERIFY_ROUTE &&
    pathname !== TWO_FACTOR_ALTERNATIVE &&
    !UN_AUTH_ROUTES.includes(pathname)
  ) {
    return NextResponse.redirect(new URL(TWO_FACTOR_VERIFY_ROUTE, req.url))
  }

  // --- Logout user if 2FA cookie is missing ---
  if (
    isAuthenticated &&
    twoFAEnabled &&
    !twoFAVerified &&
    req.cookies.get('twoFAVerified')?.value === undefined
  ) {
    const response = NextResponse.redirect(new URL(LANDING_PAGE_ROUTE, req.url))
    response.cookies.delete('jwt')
    response.cookies.delete('twoFAVerified')
    response.cookies.delete('twoFASetUpSkippedForNow')
    return response
  }

  // --- User completed 2FA and is on verify page => redirect to home ---
  if (
    isAuthenticated &&
    twoFAEnabled &&
    twoFAVerified &&
    (pathname === TWO_FACTOR_VERIFY_ROUTE ||
      pathname === TWO_FACTOR_ALTERNATIVE)
  ) {
    return NextResponse.redirect(new URL(HOME_ROUTE, req.url))
  }

  // --- Extend blocked routes dynamically if 2FA is verified ---
  const extendedBlockedRoutesForAuthUsers = [...BLOCKED_ROUTES_FOR_AUTH_USERS]
  if (twoFAVerified) {
    extendedBlockedRoutesForAuthUsers.push(
      TWO_FACTOR_SETUP_ROUTE,
      TWO_FACTOR_VERIFY_ROUTE,
      TWO_FACTOR_ALTERNATIVE,
    )
  }

  // --- Prevent access to unauth routes once logged in ---
  if (extendedBlockedRoutesForAuthUsers.includes(pathname)) {
    if (isAuthenticated) {
      const redirectTo = twoFAEnabled ? HOME_ROUTE : TWO_FACTOR_SETUP_ROUTE
      return NextResponse.redirect(new URL(redirectTo, req.url))
    }
    return NextResponse.next()
  }

  // --- Redirect authenticated users from landing page to dashboard ---
  if (pathname === LANDING_PAGE_ROUTE && isAuthenticated) {
    return NextResponse.redirect(new URL(HOME_ROUTE, req.url))
  }

  // --- Protected route but not authenticated ---
  const isProtectedRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }

  // --- Must complete 2FA setup ---
  if (
    isAuthenticated &&
    !twoFAEnabled &&
    !twoFASetUpSkippedForNow &&
    pathname !== TWO_FACTOR_SETUP_ROUTE &&
    !extendedBlockedRoutesForAuthUsers.includes(pathname)
  ) {
    return NextResponse.redirect(new URL(TWO_FACTOR_SETUP_ROUTE, req.url))
  }

  // --- Block access to 2FA setup page if already enabled ---
  if (isAuthenticated && twoFAEnabled && pathname === TWO_FACTOR_SETUP_ROUTE) {
    return NextResponse.redirect(new URL(HOME_ROUTE, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|logo.png|api).*)'],
}
