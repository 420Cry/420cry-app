'use server-only'

import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IResponse, ISignUp } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost<ISignUp, IResponse>(
      `${API_URL}/users/signup`,
      body,
    )

    switch (response.status) {
      case 200:
      case 201:
        const responseBody = {
          response: {
            isSuccess: true,
            message: 'app.alertTitle.Successful',
          } satisfies IResponse,
          user: null,
        }
        return NextResponse.json(responseBody)

      case 409:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.alertTitle.emailOrUserNameAlreadyExist',
        } satisfies IResponse)

      default:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.alertTitle.somethingWentWrong',
        } satisfies IResponse)
    }
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } }
    const status = err?.response?.status ?? 500

    const message =
      status === 409
        ? 'app.alertTitle.emailOrUserNameAlreadyExist'
        : 'app.alertTitle.somethingWentWrong'

    return createErrorResponse(message, status)
  }
}
