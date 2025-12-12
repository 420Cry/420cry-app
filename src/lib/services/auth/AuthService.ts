import { ResetRequestService } from './reset_password/ResetRequestService'
import { VerifyResetPasswordService } from './reset_password/VerifyResetPasswordService'
import { SignInService } from './signin/SignInService'
import { SignOutRequestService } from './signout/SignOutRequestService'
import { SignUpService } from './signup/SignUpService'
import { VerifyAccountTokenService } from './signup/VerifyAccountTokenService'
import { VerifyEmailTokenService } from './signup/VerifyEmailTokenService'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class AuthService {
  public signIn: SignInService
  public signOut: SignOutRequestService
  public signUp: {
    action: SignUpService
    verifyAccount: VerifyAccountTokenService
    verifyEmail: VerifyEmailTokenService
  }
  public resetPassword: {
    request: ResetRequestService
    verify: VerifyResetPasswordService
  }

  public constructor(requestService: IRequestService) {
    this.signIn = new SignInService(requestService)
    this.signOut = new SignOutRequestService(requestService)
    this.signUp = {
      action: new SignUpService(requestService),
      verifyAccount: new VerifyAccountTokenService(requestService),
      verifyEmail: new VerifyEmailTokenService(requestService),
    }
    this.resetPassword = {
      request: new ResetRequestService(requestService),
      verify: new VerifyResetPasswordService(requestService),
    }
  }
}
