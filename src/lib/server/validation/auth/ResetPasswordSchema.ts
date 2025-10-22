import { z } from 'zod'
import { passwordSchema } from '../common/commonSchemas'

export const ResetPasswordSchema = z
  .object({
    resetPasswordToken: z.string(),
    newPassword: passwordSchema,
    repeatedPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.repeatedPassword, {
    message: 'app.rules.repeatedPassword',
    path: ['repeatedPassword'],
  })
