import { ISignUp, ISignIn, TranslateFunction } from '@/src/types'
import { emailRegex } from './index'
import { toast } from 'react-hot-toast'

// Generalized validation for required fields in any form
export const validateAllFieldsFilled = (
  data: ISignUp | ISignIn,
  fields: string[],
  t: TranslateFunction,
): boolean => {
  for (const field of fields) {
    const value = data[field]
    if (typeof value === 'string' && !value.trim()) {
      toast.error(t('app.alertTitle.allfieldsAreRequired'))
      return false
    }
  }
  return true
}

export const validateEmail = (data: ISignUp, t: TranslateFunction): boolean => {
  if (!emailRegex.test(data.email.trim())) {
    toast.error(t('app.alertTitle.invalidEmailAddress'))
    return false
  }
  return true
}

export const validatePasswordMatch = (
  data: ISignUp,
  t: TranslateFunction,
): boolean => {
  if (data.password !== data.repeatedPassword) {
    toast.error(t('app.alertTitle.passwordsDoNotMatch'))
    return false
  }
  return true
}
