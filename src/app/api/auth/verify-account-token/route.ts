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
    >(`${API_URL}/users/verify-account-token`, token)

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
