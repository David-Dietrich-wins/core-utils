import { IWebState } from './WebState.mjs'
import { ArrayOrSingle, SortOrder } from './types.mjs'
import { ITicker } from './ticker-info.mjs'
import { IId } from './IdManager.mjs'

export interface ICreatedBy {
  createdby: string
  created: Date
}
export interface IUpdatedBy {
  updatedby: string
  updated: Date
}

export interface ICreatedOnBy {
  createdby: string
  createdon: Date
}
export interface IUpdatedOnBy {
  updatedby?: string
  updatedon?: Date
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

export interface ISearchRequestView {
  term: string
  sortColumn: string
  sortDirection: SortOrder
  limit: number
  offset: number
  exactMatch: boolean
  pageIndex: number
  pageSize: number
  searchColumns?: ArrayOrSingle<string>
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
