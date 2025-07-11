import { VERIFY_ACCOUNT_TOKEN_API, RequestService } from '@/lib'
import { IResponse, IVerifyAccountToken } from '@/types'

export const VerifyAccountTokenService = {
  verifyToken: async (token: IVerifyAccountToken): Promise<IResponse> => {
    try {
      return await RequestService.nativeFetchPost<
        IVerifyAccountToken,
        IResponse
      >(VERIFY_ACCOUNT_TOKEN_API, token)
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
