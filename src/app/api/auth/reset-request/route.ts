'use server-only'

import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { IResetPasswordRequest, IResponse } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const response = await RequestService.axiosPost<
      IResetPasswordRequest,
      IResponse
    >(`${API_URL}/users/reset-password`, body)

    if (response.status === 200) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.resetRequestSuccess',
      } satisfies IResponse)
    }

    return createErrorResponse(
      'app.alertTitle.somethingWentWrong',
      response.status,
    )
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } }
    const status = err?.response?.status ?? 500

    const message =
      status === 404
        ? 'app.alertTitle.userNotFound'
        : 'app.alertTitle.somethingWentWrong'

    return createErrorResponse(message, status)
  }
}
