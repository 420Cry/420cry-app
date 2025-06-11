import 'server-only'
import { NextResponse, NextRequest } from 'next/server'
import { UN_AUTH_ROUTES } from '@/lib'

export async function middleware(req: NextRequest): Promise<NextResponse> {
  // TODO
  const { pathname } = req.nextUrl

  // Skip public routes (for un-authenticated users)
  if (UN_AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Default response if not matched above
  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
