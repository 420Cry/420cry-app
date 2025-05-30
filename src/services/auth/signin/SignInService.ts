import { z } from 'zod'
import { IResponse } from '@/types'
import { SignInFormSchema } from '@/lib'

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
        isSuccess: true,
        message: 'app.alertTitle.signInSuccessful',
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => e.message)
        return {
          isSuccess: false,
          message: errorMessages[0].toString(),
        }
      }

      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
