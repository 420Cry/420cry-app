import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import {
  AUTH_ROUTES,
  SIGN_IN_ROUTE,
  HOME_ROUTE,
  BLOCKED_ROUTES_FOR_AUTH_USERS,
  TWO_FACTOR_SETUP_ROUTE,
} from './lib'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname
  const jwtToken = req.cookies.get('jwt')?.value

  let isAuthenticated = false
  let twoFAEnabled = false

  if (jwtToken) {
    try {
      const { payload } = await jwtVerify(jwtToken, JWT_SECRET)
      isAuthenticated = true
      twoFAEnabled = Boolean(payload.twoFAEnabled)
    } catch {
      // Cleanup: if token is invalid, delete it and redirect to sign in
      const response = NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
      response.cookies.delete('jwt')
      return response
    }
  }

  // Block authenticated users from accessing routes like /login, /signup
  if (BLOCKED_ROUTES_FOR_AUTH_USERS.includes(pathname)) {
    if (isAuthenticated) {
      // Redirect authenticated user to home or 2FA setup if needed
      if (!twoFAEnabled) {
        return NextResponse.redirect(new URL(TWO_FACTOR_SETUP_ROUTE, req.url))
      }
      return NextResponse.redirect(new URL(HOME_ROUTE, req.url))
    }
    return NextResponse.next()
  }

  // If the route requires auth and user is not authenticated -> redirect to sign-in
  const isProtectedRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }

  // If authenticated but 2FA is NOT enabled and the route is NOT 2FA setup, redirect to 2FA setup
  if (
    isAuthenticated &&
    !twoFAEnabled &&
    pathname !== TWO_FACTOR_SETUP_ROUTE &&
    !BLOCKED_ROUTES_FOR_AUTH_USERS.includes(pathname)
  ) {
    return NextResponse.redirect(new URL(TWO_FACTOR_SETUP_ROUTE, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|logo.png|api).*)'],
}