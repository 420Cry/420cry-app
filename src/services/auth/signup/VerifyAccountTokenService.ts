import { VERIFY_ACCOUNT_TOKEN_API } from '@/lib'
import { RequestService } from '@/services'
import { IResponse } from '@/types'

export const VerifyAccountTokenService = {
  verifyToken: async (token: string): Promise<IResponse> => {
    try {
      return await RequestService.nativeFetchPost<IResponse>(
        VERIFY_ACCOUNT_TOKEN_API,
        { token },
      )
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
