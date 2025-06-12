'use server-only'

import { API_URL, handleApiError } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { RequestService } from '@/services'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost(
      `${API_URL}/users/verify-account-token`,
      body,
    )

    if (response.status === 200) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.Successful',
      })
    }
    return NextResponse.json(
      { message: 'app.alertTitle.somethingWentWrong' },
      { status: response.status },
    )
  } catch (error) {
    return handleApiError(error)
  }
}
