import { RESET_REQUEST_API } from '@/lib/constants/routes'
import { RequestService, ApiError } from '@/lib/requests/RequestService'
import { ResetRequestSchema } from '@/lib/server/validation/auth/ResetRequestSchema'
import { validateFormData } from '@/lib/server/validation/validateFormData'
import { IResetPasswordRequest, IResponse } from '@/types'

export class ResetRequestService {
  public async resetRequestAction(formData: FormData): Promise<IResponse> {
    const formValues = {
      email: formData.get('email')?.toString() || '',
    }

    const validation = validateFormData(ResetRequestSchema, formValues)

    if (!validation.success) {
      return {
        isSuccess: false,
        message: validation.message,
      }
    }
    try {
      const payload: IResetPasswordRequest = {
        email: validation.data.email,
      }

      return await RequestService.nativeFetchPost<
        IResetPasswordRequest,
        IResponse
      >(RESET_REQUEST_API, payload)
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const status = error.status
        const message =
          status === 404
            ? 'app.messages.error.userNotFound'
            : 'app.messages.error.general'

        return {
          isSuccess: false,
          message,
        }
      }

      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
}
