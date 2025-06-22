'use server-only'

import { API_URL, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import {
  IResponse,
  ITwoFactorSetUpRequest,
  ITwoFactorVerifyResponse,
} from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost<
      ITwoFactorSetUpRequest,
      ITwoFactorVerifyResponse
    >(`${API_URL}/2fa/auth/verify-otp`, body)

    switch (response.status) {
      case 200:
        if (response.data) {
          const { jwt } = response.data

          const responseBody = {
            response: {
              isSuccess: true,
              message: 'app.alertTitle.2FAVerifySuccessful',
            } as IResponse,
          }

          const nextResponse = NextResponse.json(responseBody)

          if (jwt) {
            nextResponse.cookies.set('jwt', jwt, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 30, // 30 days
            })

            // Set twoFAVerified cookie for session
            nextResponse.cookies.set('twoFAVerified', 'true', {
              httpOnly: false, // can be accessed client-side if needed
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 30,
            })
          }
          return nextResponse
        }

        // Fallthrough
        return NextResponse.json(
          {
            response: {
              isSuccess: false,
              message: 'app.alertTitle.somethingWentWrong',
            } as IResponse,
          },
          { status: 500 },
        )

      case 401:
        return NextResponse.json(
          {
            response: {
              isSuccess: false,
              message: 'app.alertTitle.invalidOTP',
            } as IResponse,
          },
          { status: 401 },
        )

      default:
        return NextResponse.json(
          {
            response: {
              isSuccess: false,
              message: 'app.alertTitle.somethingWentWrong',
            } as IResponse,
          },
          { status: response.status },
        )
    }
  } catch (error: unknown) {
    type ErrorWithResponse = {
      response?: {
        status?: number
      }
    }

    const err = error as ErrorWithResponse

    const status =
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof err.response?.status === 'number'
        ? err.response.status
        : 500

    const message = (() => {
      switch (status) {
        case 401:
          return 'app.alertTitle.invalidOTP'
        default:
          return 'app.alertTitle.somethingWentWrong'
      }
    })()

    return NextResponse.json(
      {
        response: {
          isSuccess: false,
          message,
        } as IResponse,
      },
      { status },
    )
  }
}
