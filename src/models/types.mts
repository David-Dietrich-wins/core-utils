import { getAsNumber, isNumber } from '../services/primitives/number-helper.mjs'
import {
  isString,
  safestrLowercase,
} from '../services/primitives/string-helper.mjs'
import { IUserInfo } from './UserInfo.mjs'
import { IconConfiguration } from '../services/ContextManager.mjs'
import { IdName } from './id-name.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { LogManagerLevel } from '../services/LogManager.mjs'
import { getBoolean } from '../services/primitives/boolean-helper.mjs'
import { isNullOrUndefined } from '../services/primitives/object-helper.mjs'

export const CONST_NOT_IMPLEMENTED = 'Not implemented',
  REGEX_ElapsedTime = /^(?<temp1>\d+ seconds|1 second|\d+m?s)/u,
  REGEX_GamingVersion = /\d{1,2}\.\d{1,2}\.\d{1,2}(?:\.\d{6}-\d{6})?/u,
  REGEX_StringOfSecondsOrMilliseconds = '(\\d+ seconds|1 second|\\d+ms)',
  REGEX_UptimeMatcher = /^\d+m*s$/u

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject<T = any> = { [key: string]: T }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord<T = any> = Record<string, T>

type CookieSettings = {
  httpOnly?: boolean
  maxAge?: number
  name: string
  path?: string
  sameSite?: 'strict' | 'lax' | 'none'
  secure?: boolean
}

export type BasicResponse<T = unknown> = {
  data?: T
  message: string
  success: boolean
}

export type ApiPropsCookieAuthNames = {
  accessToken: CookieSettings
  refreshToken: CookieSettings
}

export type ApiPropsDigicrew = {
  apiKey?: string
  apiVersion: string
  appName: string
  baseUrl: string
  cookies: ApiPropsCookieAuthNames
  logLevel?: LogManagerLevel
  logFilename?: string
  loginUrl?: string
  logoutUrl?: string
  refreshTokenPath?: string
  rsaPublicKey?: string
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

export type DataOrError<T = unknown> =
  | {
      data: T | null | undefined
      error: undefined
    }
  | {
      data: undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any
    }

export type DialogReturn<T = unknown> = {
  data: T
  ok: boolean
}

export type FromTo<T = number> = {
  from?: T
  to?: T
}

//Export type NotDate<T> = T extends Date ? never : T extends object ? T : never
// Export type TisIId<T extends object> = T extends IId ? T : never

export type FunctionAppResponse<TBody = unknown> = {
  body: TBody
  httpStatus: number
  stats: InstrumentationStatistics
}

export type FunctionKeyNames<T extends object> = Exclude<
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  { [K in keyof T]: T[K] extends Function ? K : never }[keyof T],
  undefined
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypishFunction<T = unknown> = (...args: any[]) => T
export type Typish<T = unknown> = T | TypishFunction<T>
export type TypishReturnType<T> = T extends TypishFunction<infer R>
  ? R
  : T extends Typish<infer R>
  ? R
  : never
export type TypishReturnPromiseType<T> = T extends Awaited<infer R> ? R : never

export type Booleanish = Typish<boolean>
export type Numberish = Typish<number>
export type Stringish = Typish<string>

export type HeaderNavLinks = IdName & {
  disabled?: Typish<boolean>
  icon?: Typish<IconConfiguration>
  showIfLoggedIn?: Typish<boolean>
  showIfNotLoggedIn?: Typish<boolean>
  showInAppBar: Typish<boolean>
  title?: Typish<string>
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

export type IResultWithStats<T> = {
  result?: T
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

// From react-hook-form
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint

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

  return getBoolean(order)
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

export type StringOrStringArray = ArrayOrSingle<string>

// Function App and/or Express request header types.
export type StringOrStringArrayObject = AnyObject<StringOrStringArray>

export type UserAccessRefreshToken = {
  access_token: string
  expires_in: number
  refresh_token: string
}

export type UserInfoUser = {
  user: IUserInfo
}
export type UserInfoWithTokens = UserAccessRefreshToken & UserInfoUser

export type WithoutFunctions<T extends object> = Pick<T, NonFunctionKeyNames<T>>

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
