'use server-only'

import {
  API_URL,
  createErrorResponse,
  RequestService,
  CookieService,
} from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IAuthResponse, IResponse, ITwoFactorSetUpRequest } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost<
      ITwoFactorSetUpRequest,
      IAuthResponse
    >(`${API_URL}/2fa/setup/verify-otp`, body)

    if (response.status === 200 && response.data) {
      const { user, jwt } = response.data

      const responseBody = {
        response: {
          isSuccess: true,
          message: 'app.alertTitle.Successful',
        } as IResponse,
        user,
      }

      const nextResponse = NextResponse.json(responseBody)

      if (jwt) {
        CookieService.setJwtCookie(nextResponse, jwt, true)
      }

      return nextResponse
    }

    return createErrorResponse('app.alertTitle.somethingWentWrong', 401)
  } catch {
    return createErrorResponse('app.alertTitle.somethingWentWrong', 500)
  }
}
