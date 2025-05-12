import { RequestService, ErrorHandlerService } from '@/services'
import { IResponse, ISignUpVerificationToken } from '@/types'
import { API_URL } from '@/lib'

export const VerifyEmailTokenService = {
  verifyToken: (payload: ISignUpVerificationToken): Promise<IResponse> => {
    const verifyUrl = `${API_URL}/users/verify-email-token`
    return ErrorHandlerService.safeRequest(
      () => RequestService.post(verifyUrl, { ...payload }),
      {
        400: 'app.alertTitle.invalidOrExpiredToken',
        404: 'app.alertTitle.emailTokenNotFound',
      },
      'app.alertTitle.emailVerifiedSuccessfully',
    )
  },
}
