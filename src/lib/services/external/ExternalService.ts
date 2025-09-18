import { FearAndGreedService } from './fear_and_greed/fearAndGreedService'
import { TransactionService } from './wallet_explorer/transactionService'

export class ExternalService {
  public indicator: {
    fearAndGreed: FearAndGreedService
  }
  public walletExplorer: {
    searchTransaction: TransactionService
  }

  public constructor() {
    this.indicator = {
      fearAndGreed: new FearAndGreedService(),
    }
    this.walletExplorer = {
      searchTransaction: new TransactionService(),
    }
  }
}

// singleton instance
export const externalService = new ExternalService()
