'use server-only'

import {
  API_URL,
  RequestService,
  handleApiRoute,
  createStatusHandlers,
} from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IResponse, ISignUp } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApiRoute<ISignUp, IResponse>(request, {
    operation: 'signup',
    resource: 'user',
    apiCall: (body) =>
      RequestService.axiosPost<ISignUp, IResponse>(
        `${API_URL}/api/v1/users/signup`,
        body,
      ),
    statusHandlers: createStatusHandlers({
      success: 'app.messages.success.general',
      conflict: 'app.messages.error.emailOrUserNameAlreadyExist',
    }),
  })
}
