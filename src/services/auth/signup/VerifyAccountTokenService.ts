import { VERIFY_ACCOUNT_URL } from '@/lib'
import { RequestService, ErrorHandlerService } from '@/services'
import { IApiResponse } from '@/types'

export const VerifyAccountTokenService = {
  verifyToken: (token: string): Promise<IApiResponse> => {
    return ErrorHandlerService.safeRequest(
      () => RequestService.post(VERIFY_ACCOUNT_URL, { token }),
      {
        400: 'app.alertTitle.invalidOrExpiredToken',
        401: 'app.alertTitle.unauthorizedAccountVerification',
      },
      'app.alertTitle.validToken'
    )
  },
}
