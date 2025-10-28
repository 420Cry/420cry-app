import {
  ALTERNATIVE_2FA_API,
  ApiError,
  RequestService,
  VERIFY_ALTERNATIVE_2FA_API,
} from '@/lib'
import {
  IResponse,
  ITwoFactorAlternativeRequest,
  ITwoFactorVerifyRequest,
} from '@/types'

export class TwoFactorAlternativeService {
  public async sendAlternativeEmailOTP(email: string): Promise<IResponse> {
    try {
      return await RequestService.nativeFetchPost<
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
      const result = await RequestService.nativeFetchPost<
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
