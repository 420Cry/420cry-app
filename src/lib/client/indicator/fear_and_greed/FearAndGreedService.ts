import {
  GET_FEAR_AND_GREED_HISTORICAL_API,
  GET_FEAR_AND_GREED_LASTEST_API,
  RequestService,
} from '@/lib'
import {
  IFearAndGreedHistoricalData,
  IFearAndGreedIndexData,
  IResponse,
} from '@/types'

export const FearAndGreedService = {
  async geFearAndGreedIndextLatest(): Promise<
    IResponse & { data?: IFearAndGreedIndexData }
  > {
    try {
      const result = await RequestService.nativeFetchGet<
        undefined,
        IResponse & { data?: IFearAndGreedIndexData }
      >(GET_FEAR_AND_GREED_LASTEST_API, undefined)

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
  async geFearAndGreedIndextHistorical(): Promise<
    IResponse & { data?: IFearAndGreedHistoricalData }
  > {
    try {
      const result = await RequestService.nativeFetchGet<
        undefined,
        IResponse & { data?: IFearAndGreedHistoricalData }
      >(GET_FEAR_AND_GREED_HISTORICAL_API, undefined)

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
