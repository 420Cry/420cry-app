'use server-only'

import { API_URL, handleApiError, RequestService } from '@/lib'
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
        message: 'app.alertTitle.resetRequest',
      })
    }

    return NextResponse.json({
      isSuccess: false,
      message: 'app.alertTitle.somethingWentWrong',
    } satisfies IResponse)
  } catch (error) {
    return handleApiError(error)
  }
}
