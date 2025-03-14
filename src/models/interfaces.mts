import { Document, ObjectId } from 'bson'
import { IWebState } from './WebState.mjs'
import { SearchSortDirection } from './types.mjs'
import { ITicker } from './ticker-info.mjs'

export type StringOrObjectId = string | ObjectId

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

export interface ITableId<T = ObjectId> extends Document {
  _id?: T
}

export interface IUserIdOptional<T = StringOrObjectId> {
  userid?: T
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUserId<T = StringOrObjectId>
  extends Required<IUserIdOptional<T>> {}

export interface ITableUserId extends ITableId, IUserId {}

export interface IUserOptionalTable extends ITableId, IUserIdOptional {}

export interface IId<T = string> {
  id?: T
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IIdRequired<T = string> extends Required<IId<T>> {}

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

export interface IEventLogin extends ICreatedBy, IUserId {
  ip: string
  logoutTime?: Date
  sessionid: string
}

export interface ISearchRequestView {
  term: string
  sortColumn: string
  sortDirection: SearchSortDirection
  limit: number
  offset: number
  exactMatch: boolean
  pageIndex: number
  pageSize: number
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
