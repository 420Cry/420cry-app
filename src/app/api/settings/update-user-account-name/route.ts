'use server-only'

import { API_URL, RequestService, ApiErrorHandler } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IResponse } from '@/types'

interface UpdateUsernameRequest {
  username: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as UpdateUsernameRequest

    const response = await RequestService.axiosPut<
      UpdateUsernameRequest,
      IResponse
    >(`${API_URL}/api/v1/users/update-account-name`, body, {
      withAuth: true,
    })

    switch (response.status) {
      case 200:
      case 201:
        return NextResponse.json({
          isSuccess: true,
          message: 'settings.profile.usernameUpdated',
        } satisfies IResponse)

      case 409:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.messages.error.emailOrUserNameAlreadyExist',
        } satisfies IResponse)

      case 401:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.messages.error.invalidOTP',
        } satisfies IResponse)

      default:
        return NextResponse.json({
          isSuccess: false,
          message: 'settings.profile.errorUpdateUsername',
        } satisfies IResponse)
    }
  } catch (error: unknown) {
    return ApiErrorHandler.handle(error, {
      operation: 'update-username',
      resource: 'user',
    })
  }
}
