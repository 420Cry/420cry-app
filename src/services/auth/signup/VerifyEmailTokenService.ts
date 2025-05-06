import { VERIFY_EMAIL_URL } from '@/lib'
import { RequestService, ErrorHandlerService } from '@/services'
import { IApiResponse } from '@/types'

export const VerifyEmailTokenService = {
  verifyToken: (token: string): Promise<IApiResponse> => {
    return ErrorHandlerService.safeRequest(
      () => RequestService.post(VERIFY_EMAIL_URL, { token }),
      {
        400: 'app.alertTitle.invalidOrExpiredToken',
        404: 'app.alertTitle.emailTokenNotFound',
      },
      'app.alertTitle.emailVerifiedSuccessfully'
    )
  },
}
