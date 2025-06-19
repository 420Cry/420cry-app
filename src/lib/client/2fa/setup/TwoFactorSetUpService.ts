import { SET_UP_2FA_API, RequestService, VERIFY_2FA_OTP_API } from '@/lib'
import {
  IResponse,
  ITwoFactorSetUpRequest,
  ITwoFactorSetUpResponse,
} from '@/types'

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
  verifyToken: async (payload: ITwoFactorSetUpRequest): Promise<IResponse> => {
    try {
      return await RequestService.nativeFetchPost<
        ITwoFactorSetUpRequest,
        IResponse
      >(VERIFY_2FA_OTP_API, payload)
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
