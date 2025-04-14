'use server'
import { API_URL, IResponse } from '../../../types'
import { signUpRequest } from './signUpRequest'
import {
  createSignUpPayLoad,
  SignupFormSchema,
} from '../../../lib/validate/SignupFormSchema'
import { z } from 'zod'

export async function signUp(formData: FormData): Promise<IResponse> {
  const formValues = extractSignUpFormValues(formData)

  try {
    SignupFormSchema.parse(formValues)
    const signUpUrl = `${API_URL}/users/signup`
    const payload = createSignUpPayLoad(formData)
    return signUpRequest(signUpUrl, payload)
  } catch (error: unknown) {
    return handleSignUpError(error)
  }
}

function extractSignUpFormValues(formData: FormData) {
  return {
    fullName: formData.get('fullName')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    userName: formData.get('userName')?.toString() || '',
    password: formData.get('password')?.toString() || '',
    repeatedPassword: formData.get('repeatedPassword')?.toString() || '',
  }
}

function handleSignUpError(error: unknown): IResponse {
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
