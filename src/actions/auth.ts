'use server'
import { z } from 'zod'
import { SignInFormSchema, SignupFormSchema } from '../lib/rules'
import { IAuthResponse } from '../types'

export async function signIn(formData: FormData): Promise<IAuthResponse> {
  console.log(formData)
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
}

export async function signUp(formData: FormData): Promise<IAuthResponse> {
  console.log(formData)
  const formValues = {
    fullName: formData.get('fullName')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    userName: formData.get('userName')?.toString() || '',
    password: formData.get('password')?.toString() || '',
    repeatedPassword: formData.get('repeatedPassword')?.toString() || '',
  }

  try {
    SignupFormSchema.parse(formValues)
    return {
      success: true,
      message: 'app.alertTitle.signUpSuccessful',
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
}
