import { RequestService, ErrorHandlerService } from '@/services'
import { IResponse } from '@/types'
import { API_URL } from '@/lib'

export const VerifyEmailTokenService = {
  verifyToken: (token: string): Promise<IResponse> => {
    const verifyUrl = `${API_URL}/users/verify-email-token`
    return ErrorHandlerService.safeRequest(
      () => RequestService.post(verifyUrl, { token }),
      {
        400: 'app.alertTitle.invalidOrExpiredToken',
        404: 'app.alertTitle.emailTokenNotFound',
      },
      'app.alertTitle.emailVerifiedSuccessfully',
    )
  },
}
