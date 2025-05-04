export const API_URL = process.env.API_URL
  ? `https://${process.env.API_URL}`
  : null

export const MIDDLE_WARE_URL =  process.env.MIDDLE_WARE_URL
? `https://${process.env.MIDDLE_WARE_URL}`
: null

export const SIGN_IN_ROUTE = '/auth/login'
export const SIGN_UP_ROUTE = '/auth/signup'
export const RESET_PASSWORD_ROUTE = '/auth/reset-password'

export const PUBLIC_ROUTES = [
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  RESET_PASSWORD_ROUTE,
]
