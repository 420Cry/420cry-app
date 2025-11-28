import { FearAndGreedService } from './fear_and_greed/FearAndGreedService'
import { TransactionService } from './wallet_explorer/TransactionService'

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
