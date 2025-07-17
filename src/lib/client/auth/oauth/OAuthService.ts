import { GOOGLE_AUTH_REQUEST_API } from '@/lib/constants/routes'

export const OAuthService = {
  handleGoogleService: (): void => {
    window.location.href = GOOGLE_AUTH_REQUEST_API
  },
}
