import { z } from 'zod'

export const ResetReqFormSchema = z.object({
  email: z.string().trim().email({ message: 'app.rules.email' }),
})
