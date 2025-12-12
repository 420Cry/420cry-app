import { SIGN_OUT_API } from '@/lib/constants/routes'
import { IResponse } from '@/types'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class SignOutRequestService {
  public constructor(private requestService: IRequestService) {}

  public async signOut(): Promise<IResponse> {
    try {
      return await this.requestService.nativeFetchPost<null, IResponse>(
        SIGN_OUT_API,
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
