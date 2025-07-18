import { VERIFY_RESET_PASSWORD_API } from '@/lib/constants/routes'
import { RequestService } from '@/lib/requests/RequestService'
import { ResetPasswordSchema } from '@/lib/server/validation/auth/ResetPasswordSchema'
import { validateFormData } from '@/lib/server/validation/validateFormData'
import { IResponse, IVerifyResetPassword } from '@/types'

export const VerifyResetPasswordService = {
  verifyResetPasswordAction: async (
    formData: FormData,
    resetPasswordToken?: string,
  ): Promise<IResponse> => {
    try {
      const formValues = {
        newPassword: formData.get('newPassword')?.toString() || '',
        repeatedPassword: formData.get('repeatedPassword')?.toString() || '',
        resetPasswordToken: resetPasswordToken ?? '',
      }

      const validation = validateFormData(ResetPasswordSchema, formValues)

      if (!validation.success) {
        return {
          isSuccess: false,
          message: validation.message,
        }
      }

      const payload = {
        newPassword: validation.data.newPassword,
        resetPasswordToken: validation.data.resetPasswordToken,
      }

      return await RequestService.nativeFetchPost<
        IVerifyResetPassword,
        IResponse
      >(VERIFY_RESET_PASSWORD_API, payload)
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
