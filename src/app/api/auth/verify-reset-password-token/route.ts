import { API_URL, handleApiError, RequestService } from '@/lib'
import { IResponse } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const response = await RequestService.axiosPost(
      `${API_URL}/users/verify-reset-password-token`,
      body,
    )

    if (response.status === 200) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.resetSuccess',
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
