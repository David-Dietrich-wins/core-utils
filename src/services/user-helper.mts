import * as z from 'zod/v4'

export const UserLoginRequestTypeKeys = {
    google: 'google',
    login: 'login',
  } as const,
  zUserLoginRequest = z.object({
    appName: z.string().optional(),
    password: z.string().min(8),
    redirectUrl: z.string().optional(),
    type: z.enum(UserLoginRequestTypeKeys),
    username: z.email().max(250),
  })

export type UserLoginRequestTypes = keyof typeof UserLoginRequestTypeKeys
export type IUserLoginRequest = z.infer<typeof zUserLoginRequest>
