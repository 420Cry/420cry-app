import { z } from 'zod'

export const ResetRequestSchema = z.object({
  email: z.string().trim().email({ message: 'app.rules.email' }),
})
