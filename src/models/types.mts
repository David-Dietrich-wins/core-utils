import { LogManagerLevel } from '../services/LogManager.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

export type ApiProps = {
  baseUrl: string
  logLevel?: LogManagerLevel
  logFilename?: string
}

export type ArrayOrSingle<T> = T | T[]

export type CreateImmutable<Type> = {
  +readonly [Property in keyof Type]: Type[Property]
}

export type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}

export type FunctionAppResponse<TBody = unknown> = {
  stats: InstrumentationStatistics
  httpStatus: number
  body: TBody
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericCallback<T = unknown> = (...args: any[]) => T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IConstructor<T> = new (...args: any[]) => T

export type IDataWithStats<T = unknown> = {
  data: T
  stats: InstrumentationStatistics
}

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[]

export type ModifyType<T, R> = Omit<T, keyof R> & R

export type NonFunctionKeyNames<T extends object> = Exclude<
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  { [K in keyof T]: T[K] extends Function ? never : K }[keyof T],
  undefined
>

export type OmitUserId<T extends { userid?: unknown }> = Omit<T, 'userid'>

export type Opaque<K, T = string> = T & { __TYPE__: K }

export type SortOrderString = 'asc' | 'desc'
export type SortOrderNumeric = 1 | -1
export type SortOrder = SortOrderString | SortOrderNumeric

export type StringFunction = () => string

export type StringOrStringArray = ArrayOrSingle<string>

// Function App and/or Express request header types.
export type StringOrStringArrayObject = { [name: string]: StringOrStringArray }

export type WithoutFunctions<T extends object> = Pick<T, NonFunctionKeyNames<T>>
