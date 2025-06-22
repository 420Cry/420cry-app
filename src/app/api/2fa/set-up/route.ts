'use server-only'

import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import {
  IResponse,
  ITwoFactorSetUpRequest,
  ITwoFactorVerifyResponse,
} from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const rememberFlag = !!body.remember

    const response = await RequestService.axiosPost<
      ITwoFactorSetUpRequest,
      ITwoFactorVerifyResponse
    >(`${API_URL}/2fa/auth/verify-otp`, body)

    if (response.status === 200 && response.data) {
      const { jwt } = response.data

      const responseBody = {
        response: {
          isSuccess: true,
          message: 'app.alertTitle.2FAVerifySuccessful',
        } as IResponse,
      }

      const nextResponse = NextResponse.json(responseBody)

      if (jwt) {
        const commonJwtOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax' as const,
        }

        const jwtCookieOptions = rememberFlag
          ? { ...commonJwtOptions, maxAge: 60 * 60 * 24 * 30 } // 30 days
          : commonJwtOptions

        nextResponse.cookies.set('jwt', jwt, jwtCookieOptions)

        const commonTwoFAOptions = {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax' as const,
        }

        const twoFACookieOptions = rememberFlag
          ? { ...commonTwoFAOptions, maxAge: 60 * 60 * 24 * 30 }
          : commonTwoFAOptions

        nextResponse.cookies.set('twoFAVerified', 'true', twoFACookieOptions)
      }

      return nextResponse
    }

    if (response.status === 401) {
      return createErrorResponse('app.alertTitle.invalidOTP', 401)
    }

    return createErrorResponse('app.alertTitle.somethingWentWrong', response.status)
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } }
    const status = err?.response?.status ?? 500

    const message =
      status === 401
        ? 'app.alertTitle.invalidOTP'
        : 'app.alertTitle.somethingWentWrong'

    return createErrorResponse(message, status)
  }
}
