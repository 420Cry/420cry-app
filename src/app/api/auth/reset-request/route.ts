'use server-only'

import {
  API_URL,
  createErrorResponse,
  RequestService,
  ApiErrorHandler,
} from '@/lib'
import { IResetPasswordRequest, IResponse } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const response = await RequestService.axiosPost<
      IResetPasswordRequest,
      IResponse
    >(`${API_URL}/api/v1/users/reset-password`, body)

    if (response.status === 200) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.messages.success.resetRequestSuccess',
      } satisfies IResponse)
    }

    return createErrorResponse('app.messages.error.general', response.status)
  } catch (error: unknown) {
    return ApiErrorHandler.handle(error, {
      operation: 'reset-request',
      resource: 'user',
    })
  }
}
