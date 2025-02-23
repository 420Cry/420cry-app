import 'server-only'
import { NextResponse } from 'next/server'
import axios from 'axios'
import { NextRequest } from 'next/server'
import { API_URL } from './types'
import { PUBLIC_ROUTES, SIGN_IN_ROUTE } from './constants'

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }
  try {
    const testUrl = `${API_URL}/users/test` // TODO
    console.log(`Checking login status from ${testUrl}`)
    const response = await axios.get(testUrl)
    console.log('API response:', response)
    if (response.status === 200 && response.data.loggedIn) {
      console.log('User is logged in, allowing navigation.')
      return NextResponse.next()
    } else {
      console.log('User is not logged in, redirecting to /login.')
      return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error checking login status:',
        error.response?.data || error.message,
      )
    } else {
      console.error('An unexpected error occurred:', error)
    }
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }
}

export const config = {
  matcher: ['/'],
}
