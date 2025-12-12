import { GET_TRANSACTION_API, GET_XPUB_API } from '@/lib'
import { IResponse, ITransactionData, ITransactionXPUB } from '@/types'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class TransactionService {
  public constructor(private requestService: IRequestService) {}

  public async getTransaction(
    txid: string,
  ): Promise<IResponse & { data?: ITransactionData }> {
    try {
      const result = await this.requestService.nativeFetchGet<
        { txid: string },
        IResponse & { data?: ITransactionData }
      >(GET_TRANSACTION_API, { txid })

      return {
        isSuccess: result.isSuccess,
        message: result.message,
        data: result.data ? result.data : undefined,
      }
    } catch {
      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
  public async getTransactionByXPUB(
    xpub: string,
  ): Promise<IResponse & { data?: ITransactionXPUB }> {
    try {
      const result = await this.requestService.nativeFetchGet<
        { xpub: string },
        IResponse & { data?: ITransactionXPUB }
      >(GET_XPUB_API, { xpub })

      return {
        isSuccess: result.isSuccess,
        message: result.message,
        data: result.data ? result.data : undefined,
      }
    } catch {
      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
}
