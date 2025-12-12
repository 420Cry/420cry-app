import { TwoFactorAlternativeService } from './alternative/TwoFactorAlternativeService'
import { TwoFactorSetUpService } from './setup/TwoFactorSetUpService'
import { TwoFactorVerifyService } from './verify/TwoFactorVerifyService'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class TwoFactorService {
  public alternative: TwoFactorAlternativeService
  public setup: TwoFactorSetUpService
  public verify: TwoFactorVerifyService

  public constructor(requestService: IRequestService) {
    this.alternative = new TwoFactorAlternativeService(requestService)
    this.setup = new TwoFactorSetUpService(requestService)
    this.verify = new TwoFactorVerifyService(requestService)
  }
}
