import { MIDDLE_WARE_URL, SIGN_IN_ROUTE } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { RequestService } from '@/services'

export class MiddlewareService {
  public static async checkLoginStatus(): Promise<boolean> {
    try {
      const testUrl = `${MIDDLE_WARE_URL}/users/test`
      const response = await RequestService.get<{ loggedIn: boolean }>(testUrl)
      return response.data.loggedIn === true
    } catch {
      return false
    }
  }

  public static redirectToLogin(req: NextRequest): NextResponse {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url))
  }
}
