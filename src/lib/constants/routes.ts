export const API_URL = process.env.API_URL
  ? `http://${process.env.API_URL}`
  : ''

export const APP_URL = process.env.APP_URL
  ? `https://${process.env.APP_URL}`
  : ''

export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `https://${process.env.NEXT_PUBLIC_API_URL}`
  : ''

// auth
export const SIGN_UP_API = '/api/auth/sign-up'
export const SIGN_IN_API = '/api/auth/sign-in'
export const SIGN_OUT_API = '/api/auth/sign-out'
export const VERIFY_ACCOUNT_TOKEN_API = '/api/auth/verify-account-token'
export const VERIFY_EMAIL_TOKEN_API = '/api/auth/verify-email-token'
export const RESET_REQUEST_API = '/api/auth/reset-request'
export const VERIFY_RESET_PASSWORD_API = '/api/auth/verify-reset-password-token'

// 2fa
export const SET_UP_2FA_API = '/api/2fa/setup'
export const VERIFY_2FA_SET_UP_OTP_API = '/api/2fa/setup/verify-otp'
export const SKIP_SETUP_FOR_NOW_API = '/api/2fa/setup/skip-setup-for-now'
export const VERIFY_2FA_OTP_API = '/api/2fa/verify'

// wallet explorer
export const GET_TRANSACTION_API = '/api/wallet-explorer/transaction'
export const GET_XPUB_API = '/api/wallet-explorer/xpub'

// locale
export const LOCALE_COOKIE_API = '/api/locale/language'
