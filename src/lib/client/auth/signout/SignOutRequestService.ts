import { SIGN_OUT_API } from '@/lib/constants/routes'
import { RequestService } from '@/lib/requests/RequestService'
import { IResponse } from '@/types'

export const SignOutRequestService = {
  signOut: async (): Promise<IResponse> => {
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
  },
}
