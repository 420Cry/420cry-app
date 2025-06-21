'use server-only'

import { API_URL, RequestService } from '@/lib'
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
        message: 'app.alertTitle.resetRequestSuccess',
      })
    }

    return NextResponse.json(
      {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      },
      { status: response.status },
    )
  } catch (error: unknown) {
    type ErrorWithResponse = {
      response?: {
        status?: number
      }
    }

    const err = error as ErrorWithResponse

    const status =
      typeof error === 'object' &&
      error !== null &&
      'response' in err &&
      typeof err.response?.status === 'number'
        ? err.response!.status
        : 500

    const message = (() => {
      switch (status) {
        case 404:
          return 'app.alertTitle.userNotFound'
        default:
          return 'app.alertTitle.somethingWentWrong'
      }
    })()

    return NextResponse.json(
      {
        isSuccess: false,
        message,
      } satisfies IResponse,
      { status },
    )
  }
}
