import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import {
  AUTH_ROUTES,
  SIGN_IN_ROUTE,
  HOME_ROUTE,
  BLOCKED_ROUTES_FOR_AUTH_USERS,
} from './lib'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname
  const jwtToken = req.cookies.get('jwt')?.value

  let isAuthenticated = false

  if (jwtToken) {
    try {
      await jwtVerify(jwtToken, JWT_SECRET)
      isAuthenticated = true
    } catch (err) {
      // Cleanup: if token is invalid, delete it
      const response = NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
      response.cookies.delete('jwt')
      return response
    }
  }

  // 1. Auth user trying to access blocked route (e.g., /login, /signup)
  if (BLOCKED_ROUTES_FOR_AUTH_USERS.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(HOME_ROUTE, req.url))
    }
    return NextResponse.next()
  }

  // 2. Protected route and not authenticated
  const isProtectedRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }

  // 3. Allow all other cases
  return NextResponse.next()
}
