'use server-only'

import { API_URL, RequestService, ApiErrorHandler } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IResponse, ISignUp } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost<ISignUp, IResponse>(
      `${API_URL}/api/v1/users/signup`,
      body,
    )

    switch (response.status) {
      case 200:
      case 201:
        return NextResponse.json({
          isSuccess: true,
          message: 'app.messages.success.general',
        } satisfies IResponse)

      case 409:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.messages.error.emailOrUserNameAlreadyExist',
        } satisfies IResponse)

      default:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.messages.error.general',
        } satisfies IResponse)
    }
  } catch (error: unknown) {
    return ApiErrorHandler.handle(error, {
      operation: 'signup',
      resource: 'user',
    })
  }
}
