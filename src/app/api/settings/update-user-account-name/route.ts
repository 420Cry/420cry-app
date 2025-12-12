'use server-only'

import {
  API_URL,
  RequestService,
  handleApiRoute,
  createStatusHandlers,
} from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { IResponse } from '@/types'

interface UpdateUsernameRequest {
  username: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApiRoute<UpdateUsernameRequest, IResponse>(request, {
    operation: 'update-username',
    resource: 'user',
    apiCall: (body) =>
      RequestService.axiosPut<UpdateUsernameRequest, IResponse>(
        `${API_URL}/api/v1/users/update-account-name`,
        body,
        { withAuth: true },
      ),
    defaultErrorMessage: 'settings.profile.errorUpdateUsername',
    statusHandlers: createStatusHandlers({
      success: 'settings.profile.usernameUpdated',
      conflict: 'app.messages.error.emailOrUserNameAlreadyExist',
      unauthorized: 'app.messages.error.invalidOTP',
    }),
  })
}
