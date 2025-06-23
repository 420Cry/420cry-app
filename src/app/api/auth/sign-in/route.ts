// sign-in handler

'use server-only'

import {
  API_URL,
  createErrorResponse,
  RequestService,
  CookieService,
} from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { ISignIn, IAuthResponse, IResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const rememberFlag = !!body.rememberMe

    const response = await RequestService.axiosPost<ISignIn, IAuthResponse>(
      `${API_URL}/users/signin`,
      body,
    )

    if (response.status === 200 && response.data) {
      const { user, jwt } = response.data

      // Add rememberMe flag to user before sending back
      const userWithRemember = {
        ...user,
        rememberMe: rememberFlag,
      }

      const responseBody = {
        response: {
          isSuccess: true,
          message: 'app.alertTitle.Successful',
        } as IResponse,
        user: userWithRemember,
      }

      const nextResponse = NextResponse.json(responseBody)

      if (jwt) {
        if (user.twoFAEnabled) {
          // 2FA enabled — set session jwt cookie (no maxAge)
          CookieService.setJwtCookie(nextResponse, jwt, false)

          // twoFAVerified cookie always 'false' (session, 5 mins)
          CookieService.setTwoFAVerifiedCookie(nextResponse, 'false', false, {
            maxAge: 60 * 5,
          })
        } else {
          // 2FA disabled — set persistent jwt cookie with rememberMe option
          CookieService.setJwtCookie(nextResponse, jwt, rememberFlag)
        }
      }

      return nextResponse
    }

    if (response.status === 401) {
      return createErrorResponse('app.alertTitle.invalidCredentials', 401)
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
        ? 'app.alertTitle.invalidCredentials'
        : 'app.alertTitle.somethingWentWrong'

    return createErrorResponse(message, status)
  }
}
