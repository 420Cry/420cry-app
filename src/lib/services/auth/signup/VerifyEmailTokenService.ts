import { VERIFY_EMAIL_TOKEN_API, RequestService } from '@/lib'
import { IResponse, ISignUpVerificationToken } from '@/types'

export class VerifyEmailTokenService {
  public async verifyToken(
    payload: ISignUpVerificationToken,
  ): Promise<IResponse> {
    try {
      return await RequestService.nativeFetchPost<
        ISignUpVerificationToken,
        IResponse
      >(VERIFY_EMAIL_TOKEN_API, payload)
    } catch {
      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
}
