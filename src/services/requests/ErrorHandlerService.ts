import { AxiosError, AxiosResponse } from 'axios'
import { IResponse } from '@/types'

type FallbackMessages = Record<number, string>

export class ErrorHandlerService {
  public static async safeRequest<T>(
    request: () => Promise<AxiosResponse<T>>,
    fallbackMessages: FallbackMessages = {},
    successMessage = 'app.alertTitle.successful',
    defaultErrorMessage = 'app.alertTitle.somethingWentWrong',
  ): Promise<IResponse> {
    try {
      const response = await request()
      if (response.status === 200 || response.status === 201) {
        return {
          isSuccess: true,
          message: successMessage,
        }
      }
      if (fallbackMessages[response.status]) {
        return {
          isSuccess: false,
          message: fallbackMessages[response.status],
        }
      }
      return {
        isSuccess: false,
        message: defaultErrorMessage,
      }
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
  public static extractMessage(
    error: unknown,
    fallbackMessages: Record<number, string>,
    defaultMessage = 'app.alertTitle.somethingWentWrong',
  ): string {
    if (error instanceof AxiosError) {
      const status = error.response?.status
      if (status && fallbackMessages[status]) {
        return fallbackMessages[status]
      }
    }
    return defaultMessage
  }
}
