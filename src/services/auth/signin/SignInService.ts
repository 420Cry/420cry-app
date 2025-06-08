import { IResponse, ISignIn, IUser } from '@/types'
import { API_URL, SignInFormSchema, validateFormData } from '@/lib'
import { ErrorHandlerService, RequestService } from '@/services'

export const SignInService = {
  async signInAction(
    formData: FormData,
  ): Promise<{ response: IResponse; user?: IUser }> {
    const formValues = {
      userName: formData.get('userName')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      rememberMe: formData.has('rememberMe'),
    }

    const validation = validateFormData(SignInFormSchema, formValues)
    if (!validation.success) {
      return {
        response: {
          isSuccess: false,
          message: validation.message,
        },
      }
    }

    const payload: ISignIn = {
      username: validation.data.userName,
      password: validation.data.password,
      remember: validation.data.rememberMe,
    }

    const signInUrl = `${API_URL}/users/signin`

    try {
      const res = await RequestService.post<ISignIn, { user: IUser }>(
        signInUrl,
        payload,
      )

      return {
        response: {
          isSuccess: true,
          message: 'app.alertTitle.signInSuccessful',
        },
        user: res.data.user,
      }
    } catch (e) {
      const message = ErrorHandlerService.extractMessage(e, {
        401: 'app.alertTitle.invalidCredentials',
      })

      return {
        response: {
          isSuccess: false,
          message,
        },
      }
    }
  },
}
