import { ICreatedBy } from './id-created-updated.mjs'
import { IId } from './IdManager.mjs'
import { ITicker } from './ticker-info.mjs'
import { IWebState } from './WebState.mjs'
import { z } from 'zod/v4'
import { zStringMinMax } from '../services/zod-helper.mjs'

export interface IDate<T = string> {
  date: T
}

export interface IUserId<T = string> {
  userid?: T
}

export const zName = z.object({
  name: z.string().min(1).max(1000),
})
export interface IName<T extends string = string> {
  name: T
}

export interface IType<T = string> {
  type: T
}

export interface IVal<T> {
  val: T
}

export interface IValue<T> {
  value: T
}

export interface INameType<TType = string> extends IName, IType<TType> {}
export interface INameTypeValue<TValue = string, TType = string>
  extends IName,
    IType<TType>,
    IValue<TValue> {}
export interface INameValue<Tvalue = string, Tname extends string = string>
  extends IName<Tname>,
    IValue<Tvalue> {}

export const zJwt = z.object({
  jwt: z.string().min(1).max(5000),
})
export type IJwt = z.infer<typeof zJwt>

export const zPrice = z.object({
  price: z.number().nonnegative().max(1000),
})
export type IPrice = z.infer<typeof zPrice>

export const zSlug = z.object({
  slug: zStringMinMax(1, 1000),
})
export type ISlug = z.infer<typeof zSlug>

export const zErrorMessage = z.object({
  errorMessage: zStringMinMax(1, 5000),
})
export type IErrorMessage = z.infer<typeof zErrorMessage>

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

export const zBearerToken = z.object({
  bearerToken: zStringMinMax(1, 5000),
})
export type IBearerToken = z.infer<typeof zBearerToken>
