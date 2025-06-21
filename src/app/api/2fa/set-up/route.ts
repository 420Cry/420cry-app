'use server-only'

import { API_URL, handleApiError, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { ITwoFactorSetUpRequest, ITwoFactorSetUpResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ITwoFactorSetUpRequest

    const response = await RequestService.axiosPost<
      ITwoFactorSetUpRequest,
      ITwoFactorSetUpResponse
    >(`${API_URL}/2fa/setup`, body)

    if (response.status === 200 && response.data) {
      const { secret, qrCode } = response.data

      return NextResponse.json({
        secret,
        qrCode,
      } satisfies ITwoFactorSetUpResponse)
    }

    return NextResponse.json(
      {
        secret: '',
        qrCode: '',
      } satisfies ITwoFactorSetUpResponse,
      { status: 401 },
    )
  } catch (error) {
    return handleApiError(error)
  }
}
