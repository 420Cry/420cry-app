import { IResponse } from '@/types'
import { RequestService, ErrorHandlerService } from '@/services'
import { API_URL, SignUpFormSchema, validateFormData } from '@/lib'

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

    const signUpUrl = `${API_URL}/users/signup`

    try {
      return await ErrorHandlerService.safeRequest(
        () => RequestService.post(signUpUrl, payload),
        {
          409: 'app.alertTitle.duplicatedUserNameOrEmail',
        },
        'app.alertTitle.signUpSuccessful',
      )
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
