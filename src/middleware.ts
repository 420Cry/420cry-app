import { NextRequest, NextResponse } from 'next/server'

import {
  AUTH_ROUTES,
  DASHBOARD_ROUTE,
  parseAuthCookie,
  SIGN_IN_ROUTE,
  UN_AUTH_ROUTES,
  verifyJwtToken,
} from './lib'

export default async function middleware(
  req: NextRequest,
): Promise<NextResponse> {
  const path = req.nextUrl.pathname
  const cookieHeader = req.headers.get('cookie')

  const token = await parseAuthCookie(cookieHeader)

  let payload = null
  if (token) {
    payload = await verifyJwtToken(token)
  }

  const isProtectedRoute = AUTH_ROUTES.some((route) => path.startsWith(route))
  const isPublicRoute = UN_AUTH_ROUTES.includes(path)

  if (isProtectedRoute && !payload) {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.nextUrl))
  }

  if (isPublicRoute && payload) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, req.nextUrl))
  }

  return NextResponse.next()
}
