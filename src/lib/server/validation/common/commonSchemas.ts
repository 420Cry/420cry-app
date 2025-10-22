import { z } from 'zod'

/**
 * Common password validation schema used across multiple forms
 * Ensures consistent password requirements throughout the application
 */
export const passwordSchema = z
  .string()
  .trim()
  .min(8, { message: 'app.rules.passwordLength' })
  .regex(/[a-zA-Z]/, { message: 'app.rules.passwordLetterContain' })
  .regex(/[0-9]/, { message: 'app.rules.passwordNumberContain' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'app.rules.passwordSpecialContain',
  })

/**
 * Password confirmation schema that ensures passwords match
 */
export const passwordConfirmationSchema = <T extends z.ZodTypeAny>(
  passwordField: T,
): z.ZodEffects<
  z.ZodObject<
    { password: T; repeatedPassword: z.ZodString },
    'strip',
    z.ZodTypeAny,
    { password: z.infer<T>; repeatedPassword: string },
    { password: z.infer<T>; repeatedPassword: string }
  >,
  { password: z.infer<T>; repeatedPassword: string },
  { password: z.infer<T>; repeatedPassword: string }
> =>
  z
    .object({
      password: passwordField,
      repeatedPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.repeatedPassword, {
      message: 'app.rules.repeatedPassword',
      path: ['repeatedPassword'],
    })

/**
 * Common email validation schema
 */
export const emailSchema = z
  .string()
  .trim()
  .email({ message: 'app.rules.email' })

/**
 * Common username validation schema
 */
export const usernameSchema = z
  .string()
  .trim()
  .min(2, { message: 'app.rules.userName' })

/**
 * Common full name validation schema
 */
export const fullNameSchema = z
  .string()
  .trim()
  .min(2, { message: 'app.rules.fullName' })

/**
 * Common OTP validation schema
 */
export const otpSchema = z
  .string()
  .trim()
  .min(1, { message: 'app.rules.otpRequired' })
  .max(10, { message: 'app.rules.otpTooLong' })

/**
 * Common token validation schema
 */
export const tokenSchema = z
  .string()
  .trim()
  .min(1, { message: 'app.rules.tokenRequired' })
