import { SET_UP_2FA_API, RequestService } from '@/lib'
import { IResponse, ITwoFactorSetUpRequest } from '@/types'

export const TwoFactorSetUpService = {
  verifyToken: async (userUUID: ITwoFactorSetUpRequest): Promise<IResponse> => {
    try {
      return await RequestService.nativeFetchPost<
        ITwoFactorSetUpRequest,
        IResponse
      >(SET_UP_2FA_API, userUUID)
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
