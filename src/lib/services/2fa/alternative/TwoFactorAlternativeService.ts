import {
  ALTERNATIVE_2FA_API,
  ApiError,
  VERIFY_ALTERNATIVE_2FA_API,
} from '@/lib'
import {
  IResponse,
  ITwoFactorAlternativeRequest,
  ITwoFactorVerifyRequest,
} from '@/types'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class TwoFactorAlternativeService {
  public constructor(private requestService: IRequestService) {}

  public async sendAlternativeEmailOTP(email: string): Promise<IResponse> {
    try {
      return await this.requestService.nativeFetchPost<
        ITwoFactorAlternativeRequest,
        IResponse
      >(ALTERNATIVE_2FA_API, { email })
    } catch {
      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
  public async verifyAlternativeToken(
    payload: ITwoFactorVerifyRequest,
  ): Promise<IResponse> {
    try {
      const result = await this.requestService.nativeFetchPost<
        ITwoFactorVerifyRequest,
        { response: IResponse }
      >(VERIFY_ALTERNATIVE_2FA_API, payload)
      return result.response
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const status = error.status
        const message =
          status === 401
            ? 'app.messages.error.invalidOTP'
            : 'app.messages.error.general'

        return {
          isSuccess: false,
          message,
        }
      }

      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
}
