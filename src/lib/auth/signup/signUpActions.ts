'use server'
import { z } from 'zod'
import {
  API_URL,
  IResponse,
  ISignUpResponse,
  ISignUpToken,
} from '../../../types'
import { signUpRequest } from './signUpRequest'
import {
  getSignUpPayLoad,
  SignupFormSchema,
} from '../../validate/SignupFormSchema'
import { createSignUpResponse } from '../authResponseHelper'

export async function signUp(formData: FormData): Promise<ISignUpResponse> {
  const formValues = extractFormValues(formData)

  try {
    SignupFormSchema.parse(formValues)
    const signUpUrl = `${API_URL}/users/signup`
    const payload = getSignUpPayLoad(formData)
    return signUpRequest<ISignUpToken>(signUpUrl, payload)
  } catch (error: unknown) {
    return handleError(error)
  }
}

function extractFormValues(formData: FormData) {
  return {
    fullName: formData.get('fullName')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    userName: formData.get('userName')?.toString() || '',
    password: formData.get('password')?.toString() || '',
    repeatedPassword: formData.get('repeatedPassword')?.toString() || '',
  }
}

function handleError(error: unknown): IResponse {
  if (error instanceof z.ZodError) {
    const errorMessages = error.errors.map((e) => e.message)
    return createSignUpResponse(false, errorMessages[0].toString())
  }
  return createSignUpResponse(false, 'app.alertTitle.somethingWentWrong')
}
