import {
  SET_UP_2FA_API,
  VERIFY_2FA_SET_UP_OTP_API,
  SKIP_SETUP_FOR_NOW_API,
} from '@/lib'
import {
  IResponse,
  ITwoFactorSetUpRequest,
  ITwoFactorSetUpResponse,
  IUser,
} from '@/types'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class TwoFactorSetUpService {
  public constructor(private requestService: IRequestService) {}

  public async getQRCodeAndSecret(
    userUUID: ITwoFactorSetUpRequest,
  ): Promise<ITwoFactorSetUpResponse> {
    try {
      return await this.requestService.nativeFetchPost<
        ITwoFactorSetUpRequest,
        ITwoFactorSetUpResponse
      >(SET_UP_2FA_API, userUUID)
    } catch {
      return {
        secret: '',
        qrCode: '',
      }
    }
  }

  public async verifyToken(
    payload: ITwoFactorSetUpRequest,
  ): Promise<{ response: IResponse; user?: IUser }> {
    try {
      return await this.requestService.nativeFetchPost<
        ITwoFactorSetUpRequest,
        { response: IResponse; user?: IUser }
      >(VERIFY_2FA_SET_UP_OTP_API, payload)
    } catch {
      return {
        response: {
          isSuccess: false,
          message: 'app.messages.error.general',
        },
      }
    }
  }

  public async skipForNow(): Promise<IResponse> {
    try {
      return await this.requestService.nativeFetchPost<null, IResponse>(
        SKIP_SETUP_FOR_NOW_API,
        null,
      )
    } catch {
      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
}
