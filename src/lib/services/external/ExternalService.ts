import { FearAndGreedService } from './fear_and_greed/FearAndGreedService'
import { TransactionService } from './wallet_explorer/TransactionService'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class ExternalService {
  public indicator: {
    fearAndGreed: FearAndGreedService
  }
  public walletExplorer: {
    searchTransaction: TransactionService
  }

  public constructor(requestService: IRequestService) {
    this.indicator = {
      fearAndGreed: new FearAndGreedService(requestService),
    }
    this.walletExplorer = {
      searchTransaction: new TransactionService(requestService),
    }
  }
}
