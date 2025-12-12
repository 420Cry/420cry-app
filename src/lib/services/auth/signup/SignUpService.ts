import { SIGN_UP_API, SignUpFormSchema, validateFormData } from '@/lib'
import { IResponse, ISignUp } from '@/types'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class SignUpService {
  public constructor(private requestService: IRequestService) {}

  public async signUpAction(formData: FormData): Promise<IResponse> {
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

    try {
      const payload: ISignUp = {
        fullname: validation.data.fullName,
        email: validation.data.email,
        username: validation.data.userName,
        password: validation.data.password,
      }

      return await this.requestService.nativeFetchPost<ISignUp, IResponse>(
        SIGN_UP_API,
        payload,
      )
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        (error as { status?: number }).status === 409
      ) {
        return {
          isSuccess: false,
          message: 'app.messages.error.emailOrUserNameAlreadyExist',
        }
      }

      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
}
