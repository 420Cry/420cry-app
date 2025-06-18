import { SET_UP_2FA_API, RequestService } from '@/lib'
import { ITwoFactorSetUpRequest, ITwoFactorSetUpResponse } from '@/types'

export const TwoFactorSetUpService = {
  getQRCodeAndSecret: async (
    userUUID: ITwoFactorSetUpRequest,
  ): Promise<ITwoFactorSetUpResponse> => {
    try {
      return await RequestService.nativeFetchPost<
        ITwoFactorSetUpRequest,
        ITwoFactorSetUpResponse
      >(SET_UP_2FA_API, userUUID)
    } catch {
      return {
        secret: '',
        qrCode: '',
      }
    }
  },
}
