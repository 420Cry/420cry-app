'use server-only'

import { API_URL, handleApiError, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IResponse, ITwoFactorSetUpRequest } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { uuid, otp } = await request.json()
    const response = await RequestService.axiosPost<
      ITwoFactorSetUpRequest,
      IResponse
    >(`${API_URL}/2fa/verify-otp`, { uuid, otp })

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
  } catch (error) {
    return handleApiError(error)
  }
}
