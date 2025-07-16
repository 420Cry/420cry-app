import { GET_FEAR_AND_GREED_API, RequestService } from '@/lib'
import { IFearAndGreedIndexData, IResponse } from '@/types'

export const FearAndGreedService = {
  async geFearAndGreedIndextLatest(): Promise<
    IResponse & { data?: IFearAndGreedIndexData }
  > {
    try {
      const result = await RequestService.nativeFetchGet<
        undefined,
        IResponse & { data?: IFearAndGreedIndexData }
      >(GET_FEAR_AND_GREED_API, undefined)

      return {
        isSuccess: result.isSuccess,
        message: result.message,
        data: result.data ? result.data : undefined,
      }
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
