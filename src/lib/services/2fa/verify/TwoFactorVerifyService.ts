import { VERIFY_2FA_OTP_API, RequestService, ApiError } from '@/lib'
import { IResponse, ITwoFactorVerifyRequest } from '@/types'

export class TwoFactorVerifyService {
  public async verifyToken(
    payload: ITwoFactorVerifyRequest,
  ): Promise<IResponse> {
    try {
      const result = await RequestService.nativeFetchPost<
        ITwoFactorVerifyRequest,
        { response: IResponse }
      >(VERIFY_2FA_OTP_API, payload)
      return result.response
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const status = error.status
        const message =
          status === 401
            ? 'app.alertTitle.invalidOTP'
            : 'app.alertTitle.somethingWentWrong'

        return {
          isSuccess: false,
          message,
        }
      }

      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  }
}
