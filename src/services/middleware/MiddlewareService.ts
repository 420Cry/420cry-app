import { NextRequest } from 'next/server'
import { API_URL, SIGN_IN_ROUTE } from '@/lib'
import { NextResponse } from 'next/server'
import { RequestService } from '@/services'
import axios, { AxiosError } from 'axios'

export class MiddlewareService {
  public static async checkLoginStatus(): Promise<boolean> {
    try {
      const testUrl = `${API_URL}/users/test`
      const response = await RequestService.get<{ loggedIn: boolean }>(testUrl)
      console.log('response', response.data.loggedIn)
      return response.data.loggedIn === true
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError

        console.error('Failed to check login status:', axiosError.message)

        if (axiosError.response) {
          console.error('Response status:', axiosError.response.status)
          console.error('Response data:', axiosError.response.data)
        }
      } else {
        console.error('An unexpected error occurred:', error)
      }
      return false
    }
  }

  public static redirectToLogin(req: NextRequest): NextResponse {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }
}
