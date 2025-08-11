import {
  GOOGLE_API_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URL,
} from '../constants/routes'

export const getOAuthApi = (): URL => {
  const GOOGLE_AUTH_API = new URL(GOOGLE_API_URL)
  GOOGLE_AUTH_API.searchParams.set('client_id', GOOGLE_CLIENT_ID)
  GOOGLE_AUTH_API.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URL)
  GOOGLE_AUTH_API.searchParams.set('response_type', 'code')
  GOOGLE_AUTH_API.searchParams.set(
    'scope',
    'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  )
  GOOGLE_AUTH_API.searchParams.set('prompt', 'consent')
  return GOOGLE_AUTH_API
}
