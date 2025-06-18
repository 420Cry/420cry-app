'use server-only'

import { API_URL, handleApiError, RequestService } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { ITwoFactorSetUpRequest, IResponse, ITwoFactorSetUpResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userUUID = (await request.json()) as ITwoFactorSetUpRequest

    const response = await RequestService.axiosPost<ITwoFactorSetUpRequest, ITwoFactorSetUpResponse>(
      `${API_URL}/2fa/setup`,
      userUUID,
    )

    if (response.status === 200 && response.data) {
      const { secret, qrCode } = response.data


    }

    // Fallback: failed auth
    return NextResponse.json(
      {
        response: {
          isSuccess: false,
          message: 'app.alertTitle.somethingWentWrong',
        } as IResponse,
      },
      { status: 401 },
    )
  } catch (error) {
    return handleApiError(error)
  }
}
