import { ResetRequestService } from './reset_password/ResetRequestService'
import { VerifyResetPasswordService } from './reset_password/VerifyResetPasswordService'
import { SignInService } from './signin/SignInService'
import { SignOutRequestService } from './signout/SignOutRequestService'
import { SignUpService } from './signup/SignUpService'
import { VerifyAccountTokenService } from './signup/VerifyAccountTokenService'
import { VerifyEmailTokenService } from './signup/VerifyEmailTokenService'

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

  public constructor() {
    this.signIn = new SignInService()
    this.signOut = new SignOutRequestService()
    this.signUp = {
      action: new SignUpService(),
      verifyAccount: new VerifyAccountTokenService(),
      verifyEmail: new VerifyEmailTokenService(),
    }
    this.resetPassword = {
      request: new ResetRequestService(),
      verify: new VerifyResetPasswordService(),
    }
  }
}

// singleton instance
export const authService = new AuthService()
