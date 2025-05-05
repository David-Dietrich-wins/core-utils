import { z } from 'zod'
import { ICreatedBy } from './id-created-updated.mjs'
import { IId } from './IdManager.mjs'
import { ITicker } from './ticker-info.mjs'
import { IWebState } from './WebState.mjs'

export interface IDate<T = string> {
  date: T
}

export interface IUserId<T = string> {
  userid?: T
}

export const NameSchema = z.object({
  name: z.string().min(1).max(1000),
})
export type IName = z.infer<typeof NameSchema>

export interface IType<T = string> {
  type: T
}

export interface IVal<T> {
  val: T
}

export interface IValue<T> {
  value: T
}

export const JwtSchema = z.object({
  jwt: z.string().min(1).max(5000),
})
export type IJwt = z.infer<typeof JwtSchema>

export const PriceSchema = z.object({
  price: z.number().nonnegative().max(1000),
})
export type IPrice = z.infer<typeof PriceSchema>

export const SlugSchema = z.object({
  slug: z.string().min(1).max(1000),
})
export type ISlug = z.infer<typeof SlugSchema>

export const ErrorMessageSchema = z.object({
  errorMessage: z.string().min(1).max(5000),
})
export type IErrorMessage = z.infer<typeof ErrorMessageSchema>

export interface IEventLogin<T = string>
  extends IId<string>,
    IUserId<T>,
    ICreatedBy {
  ip: string
  logoutTime?: Date
}

export interface IServerState<T = unknown> {
  currentTime: Date
  message: string
  obj?: T
  ready: boolean
  state: number
  startTime: Date
  statusCode: number
  uptime: string
}

export interface IWebStateResponse extends IWebState {
  pinKey: string
  pinKeyVault?: string
  rsaPublicKey?: string
  userId?: string
}

export interface IChartRunLogApiReturn extends ITicker {
  frequency: string
  period: string

  startDate: number
  endDate: number

  created: Date
}

export const BearerTokenSchema = z.object({
  bearerToken: z.string().min(1).max(5000),
})
export type IBearerToken = z.infer<typeof BearerTokenSchema>
