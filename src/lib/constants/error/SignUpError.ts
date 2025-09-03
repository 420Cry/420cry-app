const SignUpError: Record<number, string> = {
  400: 'app.alertTitle.profileAlreadyCompleted',
  404: 'app.alertTitle.userNotFound',
  409: 'app.alertTitle.emailOrUserNameAlreadyExist',
  500: 'app.alertTitle.somethingWentWrong',
}

export default SignUpError
