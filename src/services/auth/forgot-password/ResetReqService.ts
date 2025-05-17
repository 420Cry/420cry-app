import { ResetReqFormSchema } from '@/lib'
import { IResponse } from '@/types'
import { z } from 'zod'

export const ResetReqService = {
  resetReqAction: (formData: FormData): IResponse => {
    const formValues = {
      email: formData.get('emailAddress')?.toString() || '',
    }

    try {
      ResetReqFormSchema.parse(formValues)
      return {
        isSuccess: true,
        message: 'app.alertTitle.resetRequest',
      }
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
