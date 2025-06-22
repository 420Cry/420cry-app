export interface ITwoFactorVerifyRequest {
  userUUID: string
  otp: string
  rememberMe?: boolean
}
