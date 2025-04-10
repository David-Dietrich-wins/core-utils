import {
  getAsNumber,
  isNullOrUndefined,
  isNumber,
  isString,
  safestrLowercase,
} from '../services/general.mjs'
import { LogManagerLevel } from '../services/LogManager.mjs'
import { IId } from './IdManager.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

export type ApiProps = {
  baseUrl: string
  logLevel?: LogManagerLevel
  logFilename?: string
}

export type CreateImmutable<Type> = {
  +readonly [Property in keyof Type]: Type[Property]
}

export type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}

export type ArrayOrSingle<T> = T | T[]

export type StringFunction = () => string

export type StringOrStringArray = ArrayOrSingle<string>

// Function App and/or Express request header types.
export type StringOrStringArrayObject = { [name: string]: StringOrStringArray }

export type ErrorText = {
  error: boolean
  text: StringOrStringArray
}
//export type NotDate<T> = T extends Date ? never : T extends object ? T : never
export type TisIId<T extends object> = T extends IId ? T : never

export type ConvertToType<
  T,
  R extends object,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TopLevelAdd extends Record<string, any> = object
> = {
  [Tprop in keyof T]: T[Tprop] extends Array<T[Tprop]>
    ? ConvertToType<T[Tprop], R, TopLevelAdd>[]
    : T[Tprop] extends IId
    ? ConvertToType<Omit<T[Tprop], 'id'>, R, TopLevelAdd> &
        Pick<T[Tprop], 'id'> &
        TopLevelAdd
    : T[Tprop] extends object
    ? T[Tprop] extends Date
      ? R
      : ConvertToType<T[Tprop], R, TopLevelAdd>
    : R
}

export type FormErrorStatus<
  T extends object,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TopLevelAdd extends Record<string, any> = { additionalErrors?: ErrorText }
> = T extends IId
  ? ConvertToType<Omit<T, 'id'>, ErrorText> & Pick<T, 'id'> & TopLevelAdd
  : ConvertToType<T, ErrorText, TopLevelAdd>

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

export type FromTo<T = number> = {
  from?: T
  to?: T
}

export type OmitUserId<T extends { userid?: unknown }> = Omit<T, 'userid'>

export type Opaque<K, T = string> = T & { __TYPE__: K }

export type SortOrderString = 'asc' | 'desc'
export type SortOrderNumeric = 1 | -1
export type SortOrder = SortOrderString | SortOrderNumeric | boolean
export function SortOrderAsBoolean(order?: SortOrder) {
  if (isNullOrUndefined(order)) {
    return true
  }

  if (isString(order)) {
    return !safestrLowercase(order, true).startsWith('d')
  }

  if (isNumber(order)) {
    return getAsNumber(order) >= 0
  }

  return Boolean(order)
}
/**
 * Converts a SortOrder to a numeric value for sorting.
 * @param order The SortOrder to convert.
 * @returns 1 for ascending, -1 for descending, or 0 if no order is provided.
 */
export function SortOrderAsNumeric(order?: SortOrder) {
  return SortOrderAsBoolean(order) ? 1 : -1
}
/**
 * Converts a SortOrder to a numeric value for sorting.
 * @param order The SortOrder to convert.
 * @returns 1 for ascending, -1 for descending, or 0 if no order is provided.
 */
export function SortOrderAsString(order?: SortOrder) {
  return SortOrderAsBoolean(order) ? 'asc' : 'desc'
}

export type WithoutFunctions<T extends object> = Pick<T, NonFunctionKeyNames<T>>
