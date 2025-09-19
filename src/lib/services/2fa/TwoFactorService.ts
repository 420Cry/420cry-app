import { TwoFactorAlternativeService } from './alternative/TwoFactorAlternativeService'
import { TwoFactorSetUpService } from './setup/TwoFactorSetUpService'
import { TwoFactorVerifyService } from './verify/TwoFactorVerifyService'

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
