export const LOGOUT_ROUTE = '/api/auth/logout'
export const SIGN_IN_ROUTE = '/auth/login'
export const SIGN_UP_ROUTE = '/auth/signup'
export const RESET_PASSWORD_ROUTE = '/auth/reset-password'
export const HOME_ROUTE = '/'
export const TWO_FACTOR_SETUP_ROUTE = '/2fa/setup'

export const UN_AUTH_ROUTES = [
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  RESET_PASSWORD_ROUTE,
  LOGOUT_ROUTE,
  '/auth/signup/verify',
]

export const BLOCKED_ROUTES_FOR_AUTH_USERS = [SIGN_IN_ROUTE]

export const AUTH_ROUTES = [
  '/',
  '/dashboard',
  '/profile',
  TWO_FACTOR_SETUP_ROUTE,
]
