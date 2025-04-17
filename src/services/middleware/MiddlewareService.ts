import { NextRequest } from 'next/server'
import axios from 'axios'
import { API_URL, SIGN_IN_ROUTE } from '@/src/constants'
import { NextResponse } from 'next/server'

export class MiddlewareService {
  static async checkLoginStatus(): Promise<boolean> {
    try {
      const testUrl = `${API_URL}/users/test` // TODO
      const response = await axios.get(testUrl)
      if (response.status === 200 && response.data.loggedIn) {
        return true
      }
      return false
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error checking login status:',
          error.response?.data || error.message,
        )
      } else {
        console.error('An unexpected error occurred:', error)
      }
      return false
    }
  }

  static redirectToLogin(req: NextRequest): NextResponse {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }
}
