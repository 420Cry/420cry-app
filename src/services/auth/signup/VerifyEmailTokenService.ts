import { VERIFY_EMAIL_TOKEN_API } from '@/lib'
import { RequestService } from '@/services'
import { IResponse, ISignUpVerificationToken } from '@/types'

export const VerifyEmailTokenService = {
  verifyToken: async (
    payload: ISignUpVerificationToken,
  ): Promise<IResponse> => {
    try {
      const response = await RequestService.nativeFetchPost(
        VERIFY_EMAIL_TOKEN_API,
        { ...payload },
      )

      const data = await response.json()

      if (!response.ok) {
        return {
          isSuccess: false,
          message: data.message || 'app.alertTitle.somethingWentWrong',
        }
      }

      return {
        isSuccess: true,
        message: 'app.alertTitle.emailVerifiedSuccessfully',
      }
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
