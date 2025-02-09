import { z } from 'zod'

export const SignupFormSchema = z
  .object({
    fullName: z.string().trim().min(2, { message: 'app.rules.fullName' }),

    userName: z.string().trim().min(2, { message: 'app.rules.userName' }),

    email: z.string().trim().email({ message: 'app.rules.email' }),

    password: z
      .string()
      .trim()
      .min(8, { message: 'app.rules.passwordLength' })
      .regex(/[a-zA-Z]/, { message: 'app.rules.passwordLetterContain' })
      .regex(/[0-9]/, { message: 'app.rules.passwordNumberContain' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'app.rules.passwordSpecialContain',
      }),

    repeatedPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: 'app.rules.repeatedPassword',
    path: ['repeatedPassword'],
  })

export const SignInFormSchema = z
  .object({
    userName: z.string().trim().min(2, { message: 'app.rules.userName' }),

    password: z
      .string()
      .trim()
      .min(8, { message: 'app.rules.passwordLength' })
      .regex(/[a-zA-Z]/, { message: 'app.rules.passwordLetterContain' })
      .regex(/[0-9]/, { message: 'app.rules.passwordNumberContain' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'app.rules.passwordSpecialContain',
      }),

    rememberMe: z.boolean().optional(),
  })
  .refine((data) => !!data.password, {
    message: 'app.rules.passwordRequired',
    path: ['password'],
  })
