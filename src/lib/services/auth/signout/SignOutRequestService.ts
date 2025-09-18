import { SIGN_OUT_API } from '@/lib/constants/routes'
import { RequestService } from '@/lib/requests/requestService'
import { IResponse } from '@/types'

export class SignOutRequestService {
  public async signOut(): Promise<IResponse> {
    try {
      return await RequestService.nativeFetchPost<null, IResponse>(
        SIGN_OUT_API,
        null,
      )
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  }
}
