import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { AUTH_ROUTES, SIGN_IN_ROUTE, UN_AUTH_ROUTES } from './lib'

const JWT_SECRET = process.env.JWT_SECRET || ''

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname
  // Allow unauthenticated routes immediately
  if (UN_AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if path is a protected route
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get('token')?.value
    console.log('Cookies:', req.cookies)
    console.log('Token cookie:', token)

    if (!token) {
      return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
    }

    try {
      jwt.verify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (err) {
      console.warn('JWT verification failed:', err)
      const response = NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
      response.cookies.delete('token')
      return response
    }
  }

  // For other routes, continue as usual
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/', // homepage
    '/auth/:path*', // auth routes
  ],
}
