'use server-only'

import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost(
      `${API_URL}/api/v1/2fa/setup`,
      body,
    )

    if (response.status === 200 && response.data) {
      return NextResponse.json(response.data)
    }

    return createErrorResponse('app.messages.error.general', response.status)
  } catch {
    return createErrorResponse('app.messages.error.general', 500)
  }
}
