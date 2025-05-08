import 'server-only'
import { NextResponse, NextRequest } from 'next/server'
import { MiddlewareService } from '@/services'
import { UN_AUTH_ROUTES } from '@/lib'

export async function middleware(req: NextRequest): Promise<NextResponse> {
  // TODO
  const { pathname } = req.nextUrl

  // Skip public routes (for un-authenticated users)
  if (UN_AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Check login status using MiddlewareService
  const isLoggedIn = await MiddlewareService.checkLoginStatus()

  if (isLoggedIn) {
    return NextResponse.next()
  } else {
    return MiddlewareService.redirectToLogin(req)
  }
}

export const config = {
  matcher: ['/'],
}
