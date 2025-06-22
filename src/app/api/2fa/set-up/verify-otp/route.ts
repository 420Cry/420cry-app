'use server-only'

import { API_URL, handleApiError, RequestService } from '@/lib'
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
        nextResponse.cookies.set('jwt', jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        })
      }

      return nextResponse
    }

    // Fallback: failed auth
    return NextResponse.json(
      {
        response: {
          isSuccess: false,
          message: 'app.alertTitle.somethingWentWrong',
        } as IResponse,
      },
      { status: 401 },
    )
  } catch (error) {
    return handleApiError(error)
  }
}
