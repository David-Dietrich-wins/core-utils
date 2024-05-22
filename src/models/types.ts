import { MgmLoggerLevel } from '../services/MgmLogger'
import InstrumentationStatistics from './InstrumentationStatistics'

export type MgmApiResponse<T = unknown> = {
  code: number
  data?: T
  message: string
  success: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericCallback<T = unknown> = (...args: any[]) => T

export type ArrayOrSingle<T> = T | T[]

export type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property]
}

export type CreateImmutable<Type> = {
  +readonly [Property in keyof Type]: Type[Property]
}

export type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[]

export type ModifyType<T, R> = Omit<T, keyof R> & R
export type Opaque<K, T = string> = T & { __TYPE__: K }

export type StringOrStringArray = ArrayOrSingle<string>

// Function App and/or Express request header types.
export type StringOrStringArrayObject = { [name: string]: StringOrStringArray }

export type ApiProps = {
  baseUrl: string
  logLevel?: MgmLoggerLevel
  logFilename?: string
}

export type FunctionAppResponse<TBody = unknown> = {
  stats: InstrumentationStatistics
  httpStatus: number
  body: TBody
}
