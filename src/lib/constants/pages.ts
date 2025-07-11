// auth
export const LOGOUT_ROUTE = '/api/auth/logout'
export const SIGN_IN_ROUTE = '/auth/login'
export const SIGN_UP_ROUTE = '/auth/signup'
export const RESET_PASSWORD_ROUTE = '/auth/reset-password'

// 2FA
export const TWO_FACTOR_SETUP_ROUTE = '/2fa/setup'
export const TWO_FACTOR_VERIFY_ROUTE = '/2fa/verify'
export const TWO_FACTOR_SIGNUP_VERIFY_ROUTE = '/auth/signup/verify'

// Home
export const DASHBOARD_ROUTE = '/dashboard'
export const HOME_ROUTE = '/'

// Routes for middleware
export const UN_AUTH_ROUTES = [
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  RESET_PASSWORD_ROUTE,
  LOGOUT_ROUTE,
  TWO_FACTOR_SIGNUP_VERIFY_ROUTE,
]

export const BLOCKED_ROUTES_FOR_AUTH_USERS = [
  SIGN_IN_ROUTE,
  RESET_PASSWORD_ROUTE,
  SIGN_UP_ROUTE,
]

export const AUTH_ROUTES = [
  HOME_ROUTE,
  DASHBOARD_ROUTE,
  TWO_FACTOR_SETUP_ROUTE,
  TWO_FACTOR_VERIFY_ROUTE,
]
