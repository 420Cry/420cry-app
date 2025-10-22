'use server-only'

import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { IResponse, ITwoFactorAlternativeRequest } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost<
      ITwoFactorAlternativeRequest,
      IResponse
    >(`${API_URL}/api/v1/2fa/alternative/send-email-otp`, body)
    if (response.status === 200) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.Successful',
      } satisfies IResponse)
    }
    return NextResponse.json({
      isSuccess: false,
      message: 'app.alertTitle.somethingWentWrong',
    } satisfies IResponse)
  } catch {
    return createErrorResponse('app.alertTitle.somethingWentWrong', 500)
  }
}
