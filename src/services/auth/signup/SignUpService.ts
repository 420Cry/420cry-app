import { SIGN_UP_API, SignUpFormSchema, validateFormData } from '@/lib'
import { RequestService } from '@/services'
import { IResponse } from '@/types'

export const SignUpService = {
  signUpAction: async (formData: FormData): Promise<IResponse> => {
    const formValues = {
      fullName: formData.get('fullName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      userName: formData.get('userName')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      repeatedPassword: formData.get('repeatedPassword')?.toString() || '',
    }

    const validation = validateFormData(SignUpFormSchema, formValues)
    if (!validation.success) {
      return {
        isSuccess: false,
        message: validation.message,
      }
    }

    const payload = {
      fullname: validation.data.fullName,
      email: validation.data.email,
      username: validation.data.userName,
      password: validation.data.password,
    }

    try {
      const response = await RequestService.nativeFetchPost(
        SIGN_UP_API,
        payload,
      )
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 409) {
          return {
            isSuccess: false,
            message: 'app.alertTitle.duplicatedUserNameOrEmail',
          }
        }
        return {
          isSuccess: false,
          message: data.message || 'Something went wrong',
        }
      }

      return {
        isSuccess: true,
        message: 'app.alertTitle.signUpSuccessful',
      }
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
