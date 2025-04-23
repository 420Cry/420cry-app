import { z } from 'zod'
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
