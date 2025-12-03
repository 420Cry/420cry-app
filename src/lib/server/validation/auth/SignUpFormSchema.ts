import { z } from 'zod'
import {
  fullNameSchema,
  usernameSchema,
  emailSchema,
  passwordSchema,
} from '../common/commonSchemas'

export const SignUpFormSchema = z
  .object({
    fullName: fullNameSchema,
    userName: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    repeatedPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: 'app.rules.repeatedPassword',
    path: ['repeatedPassword'],
  })
