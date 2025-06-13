'use server-only'

import { API_URL, handleApiError } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { RequestService } from '@/services'
import { ISignIn, IResponse, IAuthResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ISignIn

    const response = await RequestService.axiosPost<ISignIn, IAuthResponse>(
      `${API_URL}/users/signin`,
      body,
    )

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
          ...(body.remember
            ? { maxAge: 60 * 60 * 24 * 7 } // 7 days persistent cookie
            : {}), // session cookie (no maxAge)
        })
      }

      return nextResponse
    }

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
