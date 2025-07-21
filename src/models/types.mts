import { getAsNumber, isNumber } from '../services/number-helper.mjs'
import { isString, safestrLowercase } from '../services/string-helper.mjs'
import { IUserInfo } from './UserInfo.mjs'
import { IconConfiguration } from '../services/ContextManager.mjs'
import { IdName } from './id-name.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { LogManagerLevel } from '../services/LogManager.mjs'
import { isNullOrUndefined } from '../services/general.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject<T = any> = { [key: string]: T }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord<T = any> = Record<string, T>

export type ApiProps = {
  baseUrl: string
  logLevel?: LogManagerLevel
  logFilename?: string
}

export type ArrayOrSingle<T> = T | T[]
export type ArrayOrSingleBasicTypes = ArrayOrSingle<BasicTypes>

export type BasicTypes = string | number | bigint | boolean | null | undefined

export type CreateImmutable<Type> = {
  +readonly [Property in keyof Type]: Type[Property]
}

export type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}

export type DialogReturn<T = unknown> = {
  ok: boolean
  data: T
}

export type FromTo<T = number> = {
  from?: T
  to?: T
}

//Export type NotDate<T> = T extends Date ? never : T extends object ? T : never
// Export type TisIId<T extends object> = T extends IId ? T : never

export type FunctionAppResponse<TBody = unknown> = {
  stats: InstrumentationStatistics
  httpStatus: number
  body: TBody
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericCallback<T = unknown> = (...args: any[]) => T

export type HeaderNavLinks = IdName & {
  icon?: IconConfiguration
  showInAppBar: boolean
  title?: string
  disabled?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IConstructor<T> = new (...args: any[]) => T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CreateClass<T>(type: IConstructor<T>, ...args: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return new type(...args)
}

export type IDataWithStats<T = unknown> = {
  data: T
  stats: InstrumentationStatistics
}

export type JSONValue =
  | string
  | number
  | bigint
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

export type SortOrderString = 'a' | 'd' | 'asc' | 'desc'
export type SortOrderNumeric = 1 | -1
export type SortOrder = SortOrderString | SortOrderNumeric | boolean
export function SortOrderAsBoolean(order?: SortOrder | null) {
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
export function SortOrderAsNumeric(order?: SortOrder | null) {
  return SortOrderAsBoolean(order) ? 1 : -1
}
/**
 * Converts a SortOrder to a numeric value for sorting.
 * @param order The SortOrder to convert.
 * @returns 1 for ascending, -1 for descending, or 0 if no order is provided.
 */
export function SortOrderAsString(order?: SortOrder | null) {
  return SortOrderAsBoolean(order) ? 'asc' : 'desc'
}

export type StringFunction = () => string

export type StringOrStringArray = ArrayOrSingle<string>

// Function App and/or Express request header types.
export type StringOrStringArrayObject = AnyObject<StringOrStringArray>

export type UserLoginRefreshTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token?: string
}

export type BearerTokenResponse = {
  token: string
  tokenExpirationInstant: number
  refreshToken: string
}
export type UserInfoWithTokens = BearerTokenResponse & {
  user: IUserInfo
}

export type WithoutFunctions<T extends object> = Pick<T, NonFunctionKeyNames<T>>

// From react-hook-form
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
export type EmptyObject = {
  [K in string | number]: never
}
export type NonUndefined<T> = T extends undefined ? never : T
export type ExtractObjects<T> = T extends infer U
  ? U extends object
    ? U
    : never
  : never
/**
 * Checks whether the type is any
 * See {@link https://stackoverflow.com/a/49928360/3406963}
 * @typeParam T - type which may be any
 * ```
 * IsAny<any> = true
 * IsAny<string> = false
 * ```
 */
export type IsAny<T> = 0 extends 1 & T ? true : false
/**
 * Checks whether the type is never
 * @typeParam T - type which may be never
 * ```
 * IsAny<never> = true
 * IsAny<string> = false
 * ```
 */
export type IsNever<T> = [T] extends [never] ? true : false
/**
 * Checks whether T1 can be exactly (mutually) assigned to T2
 * @typeParam T1 - type to check
 * @typeParam T2 - type to check against
 * ```
 * IsEqual<string, string> = true
 * IsEqual<'foo', 'foo'> = true
 * IsEqual<string, number> = false
 * IsEqual<string, number> = false
 * IsEqual<string, 'foo'> = false
 * IsEqual<'foo', string> = false
 * IsEqual<'foo' | 'bar', 'foo'> = boolean // 'foo' is assignable, but 'bar' is not (true | false) -> boolean
 * ```
 */
export type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false
