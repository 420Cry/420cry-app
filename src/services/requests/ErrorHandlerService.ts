import { AxiosError } from 'axios'
import { IApiResponse } from '@/types'

type FallbackMessages = Record<number, string>

export class ErrorHandlerService {
  public static async safeRequest<T>(
    request: () => Promise<IApiResponse<T>>,
    fallbackMessages: FallbackMessages = {},
    successMessage = 'app.alertTitle.successful',
    defaultErrorMessage = 'app.alertTitle.somethingWentWrong',
  ): Promise<IApiResponse<T>> {
    try {
      const response = await request()

      // On success → overwrite message to custom successMessage
      if (response.isSuccess) {
        return {
          ...response,
          message: successMessage,
        }
      }

      return response
    } catch (e) {
      if (e instanceof AxiosError) {
        const status = e.response?.status

        if (status && fallbackMessages[status]) {
          return {
            isSuccess: false,
            message: fallbackMessages[status],
          }
        }
      }

      return {
        isSuccess: false,
        message: defaultErrorMessage,
      }
    }
  }
}
