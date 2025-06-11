import { API_URL, SignInFormSchema, validateFormData } from '@/lib'
import { RequestService } from '@/services'
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
      const res = await RequestService.axiosPost<ISignIn, { user: IUser }>(
        signInUrl,
        payload,
      )
      return {
        response: {
          isSuccess: true,
          message: 'app.alertTitle.signInSuccessful',
        },
        user: res.data.user,
        jwt: 'token',
      }
    } catch {
      return {
        response: {
          isSuccess: false,
          message: 'app.alertTitle.somethingWentWrong',
        },
      }
    }
  },
}
