'use server-only'

import { API_URL, handleApiError, RequestService, setJwtCookie } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
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

      setJwtCookie(nextResponse, jwt, body.remember ?? false)

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
