'use server-only'

import {
  API_URL,
  CookieService,
  createErrorResponse,
  RequestService,
} from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { ITwoFactorSetUpRequest, ITwoFactorVerifyResponse } from '@/types'

function createSuccessResponse(jwt?: string, rememberMe = true) {
  const responseBody = {
    response: {
      isSuccess: true,
      message: 'app.alertTitle.2FAVerifySuccessful',
    },
  }

  const nextResponse = NextResponse.json(responseBody)

  if (jwt) {
    CookieService.setJwtCookie(nextResponse, jwt, rememberMe)
    CookieService.setTwoFAVerifiedCookie(
      nextResponse,
      rememberMe ? 'true' : 'false',
      rememberMe,
    )
  }

  return nextResponse
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const rememberFlag = !!body.rememberMe
    const response = await RequestService.axiosPost<
      ITwoFactorSetUpRequest,
      ITwoFactorVerifyResponse
    >(`${API_URL}/2fa/auth/verify-otp`, body)

    if (response.status === 200 && response.data) {
      return createSuccessResponse(response.data.jwt, rememberFlag)
    }

    if (response.status === 401) {
      return createErrorResponse('app.alertTitle.invalidOTP', 401)
    }

    return createErrorResponse(
      'app.alertTitle.somethingWentWrong',
      response.status,
    )
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
