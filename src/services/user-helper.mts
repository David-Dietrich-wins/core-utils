import * as z from 'zod'

export const UserLoginRequestTypes = {
  google: 'google',
  login: 'login',
} as const
export type UserLoginRequestTypes = keyof typeof UserLoginRequestTypes

export const zUserLoginRequest = z.object({
  appName: z.string().optional(),
  password: z.string().min(8),
  redirectUrl: z.string().optional(),
  type: z.enum([UserLoginRequestTypes.login, UserLoginRequestTypes.google]),
  username: z.email().max(250),
})

export type IUserLoginRequest = z.infer<typeof zUserLoginRequest>
