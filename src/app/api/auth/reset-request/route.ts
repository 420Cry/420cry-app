'use server-only'

import { API_URL, RequestService, handleApiRoute } from '@/lib'
import { IResetPasswordRequest, IResponse } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApiRoute<IResetPasswordRequest, IResponse>(request, {
    operation: 'reset-request',
    resource: 'user',
    apiCall: (body) =>
      RequestService.axiosPost<IResetPasswordRequest, IResponse>(
        `${API_URL}/api/v1/users/reset-password`,
        body,
      ),
    successMessage: 'app.messages.success.resetRequestSuccess',
  })
}
