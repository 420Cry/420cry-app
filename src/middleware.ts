import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { AUTH_ROUTES, SIGN_IN_ROUTE, UN_AUTH_ROUTES } from './lib'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname

  if (UN_AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  const isProtectedRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )

  if (isProtectedRoute) {
    const jwtToken = req.cookies.get('jwt')?.value

    if (!jwtToken) {
      return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
    }

    try {
      await jwtVerify(jwtToken, JWT_SECRET)
      return NextResponse.next()
    } catch (err) {
      console.warn('JWT verification failed:', err)
      const response = NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}
