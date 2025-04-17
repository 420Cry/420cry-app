import { NextRequest } from 'next/server'
import { API_URL, SIGN_IN_ROUTE } from '@/src/lib/constants/routes'
import { NextResponse } from 'next/server'

export class MiddlewareService {
  // TODO AccessControl
  public static async checkLoginStatus(): Promise<boolean> {
    try {
      const testUrl = `${API_URL}/users/test`
      const response = await fetch(testUrl)

      if (!response.ok) {
        console.error('Failed to check login status:', response.statusText)
        return false
      }

      const data = await response.json()
      if (data.loggedIn) {
        return true
      }
      return false
    } catch (error: unknown) {
      console.error('An unexpected error occurred:', error)
      return false
    }
  }

  public static redirectToLogin(req: NextRequest): NextResponse {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }
}
