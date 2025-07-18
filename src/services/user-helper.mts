import { z } from 'zod/v4'

export enum UserLoginRequestTypes {
  login = 'login',
  google = 'google',
}

export const zUserLoginRequest = z.object({
  appName: z.string().optional(),
  password: z.string().min(8),
  redirectUrl: z.string().optional(),
  remember: z.boolean().optional(),
  type: z.enum(UserLoginRequestTypes),
  username: z.email().max(250),
})

export type IUserLoginRequest = z.infer<typeof zUserLoginRequest>
