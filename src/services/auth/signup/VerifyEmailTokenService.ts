import { VERIFY_EMAIL_TOKEN_API } from '@/lib'
import { RequestService } from '@/services'
import { IResponse, ISignUpVerificationToken } from '@/types'

export const VerifyEmailTokenService = {
  verifyToken: async (
    payload: ISignUpVerificationToken,
  ): Promise<IResponse> => {
    try {
      return await RequestService.nativeFetchPost<IResponse>(
        VERIFY_EMAIL_TOKEN_API,
        { ...payload },
      )
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
