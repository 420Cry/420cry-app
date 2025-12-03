import {
  API_URL,
  CookieService,
  createErrorResponse,
  RequestService,
} from '@/lib'
import SignUpError from '@/lib/constants/error/SignUpError'
import { IAuthResponse, IResponse, ISignUp } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const response = await RequestService.axiosPost<ISignUp, IAuthResponse>(
      `${API_URL}/api/v1/users/complete-profile`,
      body,
    )
    switch (response.status) {
      case 201:
        const { user, jwt } = response.data
        const responseBody = {
          response: {
            isSuccess: true,
            message: 'app.messages.success.general',
          } satisfies IResponse,
          user,
        }
        const nextResponse = NextResponse.json(responseBody)
        if (jwt) {
          CookieService.setJwtCookie(nextResponse, jwt, false)
        }

        return nextResponse

      case 404:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.messages.error.userNotFound',
        })

      case 400:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.messages.error.profileAlreadyCompleted',
        })

      default:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.messages.error.general',
        } satisfies IResponse)
    }
  } catch (error) {
    const err = error as { response: { status?: number } }
    const status = err.response?.status ?? 500

    return createErrorResponse(SignUpError[status], status)
  }
}
