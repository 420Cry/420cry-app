import 'server-only'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { MiddlewareService } from '@/services/middleware/MiddlewareService'
import { PUBLIC_ROUTES } from './lib'

export async function middleware(req: NextRequest): Promise<NextResponse> {
  // TODO
  const { pathname } = req.nextUrl

  // Skip public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Check login status using MiddlewareService
  const isLoggedIn = await MiddlewareService.checkLoginStatus()

  if (isLoggedIn) {
    console.log('User is logged in, allowing navigation.')
    return NextResponse.next()
  } else {
    console.log('User is not logged in, redirecting to /login.')
    return MiddlewareService.redirectToLogin(req)
  }
}

export const config = {
  matcher: ['/'],
}
