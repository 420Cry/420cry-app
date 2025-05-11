import { API_URL, ResetReqFormSchema } from '@/lib'
import { ErrorHandlerService } from '@/services/requests/ErrorHandlerService'
import { RequestService } from '@/services/requests/RequestService'
import { IResponse, IResetReq } from '@/types'
import { z } from 'zod'

export const ResetReqService = {
  resetReqAction: async (formData: FormData): Promise<IResponse> => {
    const formValues: IResetReq = {
      emailAddress: formData.get('emailAddress')?.toString() || '',
    }

    try {
      ResetReqFormSchema.parse(formValues)

      // Placeholder URL
      const resetReqUrl = `${API_URL}/users/reset-password`
      return await ErrorHandlerService.safeRequest(
        () => RequestService.post(resetReqUrl, formValues),
        {
          // Default Err Message
        },
        'resetYourPassword.resetReq.message',
      )
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => e.message)
        return {
          isSuccess: false,
          message: errorMessages[0],
        }
      }
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
