import { z } from 'zod'
import { emailSchema } from '../common/commonSchemas'

export const ResetRequestSchema = z.object({
  email: emailSchema,
})
