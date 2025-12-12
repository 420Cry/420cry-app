import { z } from 'zod'

/**
 * Common password validation schema used across multiple forms
 * Ensures consistent password requirements throughout the application
 * Matches backend validation rules exactly
 */
export const passwordSchema = z
  .string()
  .trim()
  .min(8, { message: 'app.rules.passwordLength' })
  .max(128, { message: 'app.rules.passwordTooLong' })
  .regex(/[A-Z]/, { message: 'app.rules.passwordUppercase' })
  .regex(/[a-z]/, { message: 'app.rules.passwordLowercase' })
  .regex(/[0-9]/, { message: 'app.rules.passwordNumberContain' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'app.rules.passwordSpecialContain',
  })

/**
 * Password confirmation schema that ensures passwords match
 */
export const passwordConfirmationSchema = <T extends z.ZodTypeAny>(
  passwordField: T,
) => {
  const schema = z.object({
    password: passwordField,
    repeatedPassword: z.string().trim(),
  })
  return schema.refine((data: any) => data.password === data.repeatedPassword, {
    message: 'app.rules.repeatedPassword',
    path: ['repeatedPassword'],
  })
}

/**
 * Common email validation schema
 * Matches backend validation rules exactly
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'app.rules.emailRequired' })
  .max(254, { message: 'app.rules.emailTooLong' })
  .email({ message: 'app.rules.email' })

/**
 * Common username validation schema
 * Matches backend validation rules exactly
 */
export const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: 'app.rules.userNameMinLength' })
  .max(50, { message: 'app.rules.userNameMaxLength' })
  .regex(/^[a-zA-Z0-9_]+$/, { message: 'app.rules.userNameFormat' })

/**
 * Common full name validation schema
 * Matches backend validation rules exactly
 */
export const fullNameSchema = z
  .string()
  .trim()
  .min(2, { message: 'app.rules.fullNameMinLength' })
  .max(100, { message: 'app.rules.fullNameMaxLength' })
  .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: 'app.rules.fullNameFormat' })

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
