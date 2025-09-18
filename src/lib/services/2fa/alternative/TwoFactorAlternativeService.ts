import { ALTERNATIVE_2FA_API, RequestService } from '@/lib'
import { IResponse, ITwoFactorAlternativeRequest } from '@/types'

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
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  }
}
