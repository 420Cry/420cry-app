import { IResponse } from '@/src/types'
import { z } from 'zod'
import { SignInFormSchema } from '../../../lib/validation/SignInFormSchema'

export const SignInService = {
  signInAction(formData: FormData): IResponse {
    const formValues = {
      userName: formData.get('userName')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      rememberMe: formData.has('rememberMe'),
    }

    try {
      SignInFormSchema.parse(formValues)
      return {
        success: true,
        message: 'app.alertTitle.signInSuccessful',
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => e.message)
        return {
          success: false,
          message: errorMessages[0].toString(),
        }
      }

      return {
        success: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
