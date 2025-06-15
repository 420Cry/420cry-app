import { z } from 'zod'

export const validateFormData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
):
  | { success: true; data: z.infer<T> }
  | { success: false; message: string } => {
  const result = schema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: result.error.errors[0]?.message || 'Invalid input',
    }
  }

  return {
    success: true,
    data: result.data,
  }
}
