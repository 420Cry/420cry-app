import { GET_TRANSACTION_API, RequestService } from '@/lib'
import { IResponse, ITransaction } from '@/types'

export const TransactionService = {
  async getTransaction(txid: ITransaction): Promise<IResponse> {
    try {
      const result = await RequestService.nativeFetchGet<ITransaction, IResponse>(
        GET_TRANSACTION_API,
        txid
      )
      return result
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}

