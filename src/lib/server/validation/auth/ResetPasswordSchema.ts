import { z } from 'zod'

export const ResetPasswordSchema = z
  .object({
    resetPasswordToken: z.string(),
    newPassword: z
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
  .refine((data) => data.newPassword === data.repeatedPassword, {
    message: 'app.rules.repeatedPassword',
    path: ['repeatedPassword'],
  })
