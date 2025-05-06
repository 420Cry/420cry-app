import { IResponse } from '@/types'
import { AxiosError } from 'axios'
import { API_URL } from '@/lib'
import { RequestService } from '@/services'

export const VerifyEmailTokenService = {
  verifyToken: async (token: string): Promise<IResponse> => {
    const verifyUrl = `${API_URL}/users/verify-email-token`
    try {
      const response = await RequestService.post(
        verifyUrl,
        { token: token },
        { headers: { 'Content-Type': 'application/json' } },
      )

      if (response.status === 200) {
        return {
          isSuccess: true,
          message: 'app.alertTitle.emailVerifiedSuccessfully',
        }
      }

      return {
        isSuccess: false,
        message: 'app.alertTitle.emailVerificationFailed',
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 400) {
          return {
            isSuccess: false,
            message: 'app.alertTitle.invalidOrExpiredToken',
          }
        }
      }

      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
