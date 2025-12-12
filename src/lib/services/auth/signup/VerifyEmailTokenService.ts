import { VERIFY_EMAIL_TOKEN_API } from '@/lib'
import { IResponse, ISignUpVerificationToken } from '@/types'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class VerifyEmailTokenService {
  public constructor(private requestService: IRequestService) {}

  public async verifyToken(
    payload: ISignUpVerificationToken,
  ): Promise<IResponse> {
    try {
      return await this.requestService.nativeFetchPost<
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
