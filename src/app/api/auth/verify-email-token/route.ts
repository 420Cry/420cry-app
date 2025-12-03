'use server-only'

import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IResponse, ISignUpVerificationToken } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost<
      ISignUpVerificationToken,
      IResponse
    >(`${API_URL}/api/v1/users/verify-email-token`, body)
    if (response.status === 200) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.messages.success.general',
      } satisfies IResponse)
    }
    return NextResponse.json({
      isSuccess: false,
      message: 'app.messages.error.general',
    } satisfies IResponse)
  } catch {
    return createErrorResponse('app.messages.error.general', 500)
  }
}
