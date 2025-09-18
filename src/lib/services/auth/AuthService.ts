import { ResetRequestService } from './reset_password/resetRequestService'
import { VerifyResetPasswordService } from './reset_password/verifyResetPasswordService'
import { SignInService } from './signin/signInService'
import { SignOutRequestService } from './signout/signOutRequestService'
import { SignUpService } from './signup/signUpService'
import { VerifyAccountTokenService } from './signup/verifyAccountTokenService'
import { VerifyEmailTokenService } from './signup/verifyEmailTokenService'

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
