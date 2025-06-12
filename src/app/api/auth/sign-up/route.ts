'use server-only'

import { API_URL, handleApiError } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { RequestService } from '@/services'
import { IResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const response = await RequestService.axiosPost(
      `${API_URL}/users/signup`,
      body,
    )
    if (response.status === 200 || response.status === 201) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.Successful',
      } satisfies IResponse)
    }
    return NextResponse.json({
      isSuccess: true,
      message: 'app.alertTitle.somethingWentWrong',
    } satisfies IResponse)
  } catch (error) {
    return handleApiError(error)
  }
}
