import { IWebState } from './WebState.mjs'
import { ITicker } from './ticker-info.mjs'
import { IId } from './IdManager.mjs'

export interface ICreatedBy<T extends Date | string | number = Date> {
  createdby: string
  created: T
}
export interface IUpdated<T extends Date | string | number = Date> {
  updated: T
}
export interface IUpdatedBy<T extends Date | string | number = Date>
  extends IUpdated<T> {
  updatedby: string
}

export interface ICreatedOnBy<T extends Date | string | number = Date> {
  createdby: string
  createdon: T
}
export interface IUpdatedOn<T extends Date | string | number = Date> {
  updatedon?: T
}
export interface IUpdatedOnBy<T extends Date | string | number = Date>
  extends IUpdatedOn<T> {
  updatedby?: string
}

export interface IDate<T = string> {
  date: T
}

export interface IUserId<T = string> {
  userid?: T
}

export interface IName<T = string> {
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

export interface IJwt {
  jwt: string
}

export interface IPrice {
  price: number
}

export interface ISlug {
  slug: string
}

export interface IErrorMessage {
  errorMessage: string
}

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

export interface IBearerToken {
  bearerToken: string
}
