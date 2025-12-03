import { z } from 'zod'
import { usernameSchema, passwordSchema } from '../common/commonSchemas'

export const SignInFormSchema = z
  .object({
    userName: usernameSchema,
    password: passwordSchema,
    rememberMe: z.boolean().optional(),
  })
  .refine((data) => !!data.password, {
    message: 'app.rules.passwordRequired',
    path: ['password'],
  })
