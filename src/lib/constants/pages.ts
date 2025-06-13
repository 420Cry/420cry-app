export const LOGOUT_ROUTE = '/api/auth/logout'
export const SIGN_IN_ROUTE = '/auth/login'
export const SIGN_UP_ROUTE = '/auth/signup'
export const RESET_PASSWORD_ROUTE = '/auth/reset-password'
export const HOME_ROUTE = '/'

export const UN_AUTH_ROUTES = [
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  RESET_PASSWORD_ROUTE,
  LOGOUT_ROUTE,
  '/auth/signup/verify',
]

export const AUTH_ROUTES = ['/', '/dashboard', '/profile']
