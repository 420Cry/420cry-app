'use server-only'

import { API_URL, handleApiError, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IResponse, ISignUp } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost<ISignUp, IResponse>(
      `${API_URL}/users/signup`,
      body,
    )
    switch (response.status) {
      case 200:
      case 201:
        return NextResponse.json({
          isSuccess: true,
          message: 'app.alertTitle.Successful',
        } satisfies IResponse)
      default:
        return NextResponse.json({
          isSuccess: false,
          message: 'app.alertTitle.somethingWentWrong',
        } satisfies IResponse)
    }
  } catch (error) {
    return handleApiError(error)
  }
}
