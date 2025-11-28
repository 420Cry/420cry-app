'use server-only'

import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IResponse, IVerifyAccountToken } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = await request.json()
    const response = await RequestService.axiosPost<
      IVerifyAccountToken,
      IResponse
    >(`${API_URL}/api/v1/users/verify-account-token`, token)

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
