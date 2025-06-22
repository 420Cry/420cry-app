'use server-only'

import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { ISignIn, IAuthResponse, IResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const rememberFlag = !!body.remember
    const response = await RequestService.axiosPost<ISignIn, IAuthResponse>(
      `${API_URL}/users/signin`,
      body,
    )

    if (response.status === 200 && response.data) {
      const { user, jwt } = response.data

      // Add rememberFlag to user object before sending it back
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
          // 2FA enabled — do NOT set persistent jwt cookie yet
          nextResponse.cookies.set('jwt', jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
          })

          nextResponse.cookies.set('twoFAVerified', 'false', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
          })
        } else {
          nextResponse.cookies.set('jwt', jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
          })
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
