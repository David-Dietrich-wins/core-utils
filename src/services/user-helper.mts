import { z } from 'zod'

const UserLoginRequestTypes = ['login', 'google'] as const

export const zUserLoginRequest = z.object({
  type: z.enum(UserLoginRequestTypes),
  email: z.string().max(250).email().optional(),
  password: z.string().min(8).optional(),
  remember: z.boolean().optional(),
  appName: z.string().optional(),
  redirectUrl: z.string().optional(),
})

export type IUserLoginRequest = z.infer<typeof zUserLoginRequest>
