import { TwoFactorAlternativeService } from './alternative/twoFactorAlternativeService'
import { TwoFactorSetUpService } from './setup/twoFactorSetUpService'
import { TwoFactorVerifyService } from './verify/twoFactorVerifyService'

class TwoFactorService {
  public alternative: TwoFactorAlternativeService
  public setup: TwoFactorSetUpService
  public verify: TwoFactorVerifyService

  public constructor() {
    this.alternative = new TwoFactorAlternativeService()
    this.setup = new TwoFactorSetUpService()
    this.verify = new TwoFactorVerifyService()
  }
}

// export only the singleton
export const twoFactorService = new TwoFactorService()
