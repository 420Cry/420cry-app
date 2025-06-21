'use server-only'

import { API_URL, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { ISignIn, IAuthResponse, IResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost<ISignIn, IAuthResponse>(
      `${API_URL}/users/signin`,
      body,
    )

    switch (response.status) {
      case 200:
        if (response.data) {
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
            const rememberFlag = !!body.remember
            const maxAge = !user.twoFAEnabled
              ? 60 * 60 // 1 hour
              : rememberFlag
                ? 60 * 60 * 24 * 30 // 30 days
                : undefined

            nextResponse.cookies.set('jwt', jwt, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              sameSite: 'lax',
              ...(maxAge !== undefined ? { maxAge } : {}),
            })
          }

          return nextResponse
        }

        // Fallthrough: status 200 but missing data
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
              message: 'app.alertTitle.invalidCredentials',
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
  } catch (error: any) {
    const status = error?.response?.status ?? 500

    const message = (() => {
      switch (status) {
        case 401:
          return 'app.alertTitle.invalidCredentials'
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
