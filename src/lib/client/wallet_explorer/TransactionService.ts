import { GET_TRANSACTION_API, RequestService } from '@/lib'
import { IResponse, ITransactionData } from '@/types'

export const TransactionService = {
  async getTransaction(
    txid: string,
  ): Promise<IResponse & { data?: ITransactionData }> {
    try {
      const result = await RequestService.nativeFetchGet<
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
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
