import { z } from 'zod/v4'

export enum UserLoginRequestTypes {
  login = 'login',
  google = 'google',
}

export const zUserLoginRequest = z.object({
  type: z.nativeEnum(UserLoginRequestTypes),
  username: z.string().max(250).email(),
  password: z.string().min(8),
  remember: z.boolean().optional(),
  appName: z.string().optional(),
  redirectUrl: z.string().optional(),
})

export type IUserLoginRequest = z.infer<typeof zUserLoginRequest>
