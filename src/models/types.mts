import { IconConfiguration } from '../services/ContextManager.mjs'
import { isNullOrUndefined } from '../services/general.mjs'
import { LogManagerLevel } from '../services/LogManager.mjs'
import { getAsNumber, isNumber } from '../services/number-helper.mjs'
import { isString, safestrLowercase } from '../services/string-helper.mjs'
import { IdName, IIdNameValueType } from './id-name.mjs'
import { IId } from './IdManager.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { IUserInfo } from './UserInfo.mjs'

export const enum DigicrewTypes {
  FormStatusItem = 'FormStatusItem',
  FormStatusTopLevel = 'FormStatusTopLevel',
  FormStatusChildLevel = 'FormStatusChildLevel',
  FormStatusManager = 'FormStatusManager',
}

export type DigicrewType<T = string> = IIdNameValueType<T, DigicrewTypes>

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

export type ConvertToType<
  T,
  R extends object,
  TChildAdd extends AnyRecord = object
> = {
  [Tprop in keyof T]: T[Tprop] extends Array<T[Tprop]>
    ? ConvertToType<T[Tprop], R, TChildAdd>[]
    : T[Tprop] extends IId
    ? ConvertToType<Omit<T[Tprop], 'id'>, R, TChildAdd> &
        IId<T[Tprop]['id']> &
        TChildAdd
    : T[Tprop] extends object
    ? T[Tprop] extends Date
      ? R
      : ConvertToType<T[Tprop], R, TChildAdd>
    : R
}

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

//export type NotDate<T> = T extends Date ? never : T extends object ? T : never
// export type TisIId<T extends object> = T extends IId ? T : never

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

export type SortOrderString = 'asc' | 'desc'
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
  return SortOrderAsBoolean(isNullOrUndefined(order) ? true : order)
    ? 'asc'
    : 'desc'
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
export type UserLoginResponse = BearerTokenResponse & {
  user: IUserInfo
}

export type WithoutFunctions<T extends object> = Pick<T, NonFunctionKeyNames<T>>
