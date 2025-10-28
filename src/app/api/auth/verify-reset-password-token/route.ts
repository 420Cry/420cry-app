'use server-only'

import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { IResponse } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const response = await RequestService.axiosPost(
      `${API_URL}/api/v1/users/verify-reset-password-token`,
      body,
    )

    if (response.status === 200) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.messages.success.resetSuccess',
      })
    }

    return NextResponse.json({
      isSuccess: false,
      message: 'app.messages.error.general',
    } satisfies IResponse)
  } catch {
    return createErrorResponse('app.messages.error.general', 500)
  }
}
