'use server'
import { IAuthResponse, ISignIn, ISignUp } from '../types'

export const signUpAction = async (data: ISignUp): Promise<IAuthResponse> => {
  // TODO: Implement user registration logic
  console.log(data)
  return {
    success: true,
    message: 'app.alertTitle.signUpSuccessful',
  }
}

export const signInAction = async (data: ISignIn): Promise<IAuthResponse> => {
  // TODO: Implement user sign-in logic
  console.log(data)
  return {
    success: true,
    message: 'app.alertTitle.signUpSuccessful',
  }
}
