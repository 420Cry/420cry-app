import { VERIFY_ACCOUNT_TOKEN_API } from '@/lib'
import { IResponse, IVerifyAccountToken } from '@/types'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class VerifyAccountTokenService {
  public constructor(private requestService: IRequestService) {}

  public async verifyToken(token: IVerifyAccountToken): Promise<IResponse> {
    try {
      return await this.requestService.nativeFetchPost<
        IVerifyAccountToken,
        IResponse
      >(VERIFY_ACCOUNT_TOKEN_API, token)
    } catch {
      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
}
