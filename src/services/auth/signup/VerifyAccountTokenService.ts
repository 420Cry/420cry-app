import { VERIFY_ACCOUNT_TOKEN_API } from '@/lib'
import { RequestService } from '@/services'
import { IResponse } from '@/types'

export const VerifyAccountTokenService = {
  verifyToken: async (token: string): Promise<IResponse> => {
    try {
      const response = await RequestService.nativeFetchPost(
        VERIFY_ACCOUNT_TOKEN_API,
        { token },
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
        message: 'app.alertTitle.validToken',
      }
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
