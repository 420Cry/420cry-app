import {
  API_URL,
  generateJwtToken,
  SignInFormSchema,
  validateFormData,
} from '@/lib'
import { ErrorHandlerService, RequestService } from '@/services'
import { IResponse, ISignIn, IUser } from '@/types'

export const SignInService = {
  async signInAction(
    formData: FormData,
  ): Promise<{ response: IResponse; user?: IUser; jwt?: string }> {
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

      let token: string | undefined = undefined
      if (res.data.user) {
        token = await generateJwtToken({
          uuid: res.data.user.uuid,
          email: res.data.user.email,
        })
      }

      return {
        response: {
          isSuccess: true,
          message: 'app.alertTitle.signInSuccessful',
        },
        user: res.data.user,
        jwt: token,
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
