import { RESET_REQUEST_API } from '@/lib/constants/routes'
import { RequestService } from '@/lib/requests/RequestService'
import { ResetRequestSchema } from '@/lib/server/validation/auth/ResetRequestSchema'
import { validateFormData } from '@/lib/server/validation/validateFormData'
import { IResetPasswordRequest, IResponse } from '@/types'

export const ResetRequestService = {
  resetRequestAction: async (formData: FormData): Promise<IResponse> => {
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
      const payload = {
        email: validation.data.email,
      }

      return await RequestService.nativeFetchPost<IResetPasswordRequest, IResponse>(
        RESET_REQUEST_API,
        payload,
      )
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
