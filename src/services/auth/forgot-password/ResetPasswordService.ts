import { ResetPasswordFormSchema } from '@/lib'
import { IResetForm, IResponse } from '@/types'
import { z } from 'zod'

export const ResetPasswordService = {
  resetPassword: (formData: FormData): IResponse => {
    const resetPasswordPayload: IResetForm = {
        password: formData.get('password')?.toString() || '',
        repeatedPassword: formData.get('repeatedPassword')?.toString() || '',
    }

    try {
      ResetPasswordFormSchema.parse(resetPasswordPayload)

      return {
        isSuccess: true,
        message: 'app.alertTitle.resetSuccess',
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map((e) => e.message)
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
