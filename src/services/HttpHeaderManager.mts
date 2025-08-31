import {
  CONST_JwtErrorRetrieveUserId,
  FromBearerToken,
  JwtAccessToken,
} from './jwt.mjs'
import { arrayFirst, safeArray } from '../primitives/array-helper.mjs'
import { safestr, safestrLowercase } from '../primitives/string-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { IdType } from '../models/id-name.mjs'
import { IncomingHttpHeaders } from 'node:http'
import { StringOrStringArrayObject } from '../models/types.mjs'
import { getBoolean } from '../primitives/boolean-helper.mjs'
import { isObject } from '../primitives/object-helper.mjs'

const REGEX_Bearer = /^[Bb][Ee][Aa][Rr][Ee][Rr] /u

export const HttpHeaderNamesAllowedKeys = {
  ApplicationName: 'x-application-name',
  Authorization: 'authorization',
  ShowDebug: 'ShowDebug',
} as const
export type HttpHeaderNamesAllowed =
  (typeof HttpHeaderNamesAllowedKeys)[keyof typeof HttpHeaderNamesAllowedKeys]

export const CONST_AppNamePolitagree = 'politagree',
  CONST_AppNameTradePlotter = 'tradeplotter',
  HttpAllowedHeaders: Readonly<IdType<HttpHeaderNamesAllowed>>[] = [
    { id: HttpHeaderNamesAllowedKeys.ApplicationName, type: 'string' },
    { id: HttpHeaderNamesAllowedKeys.Authorization, type: 'string' },
    { id: HttpHeaderNamesAllowedKeys.ShowDebug, type: 'boolean' },
  ] as const

/**
 * Base class for managing HTTP Headers. Including JWT support for extracting data.
 */
export class HttpHeaderManagerBase {
  headers: StringOrStringArrayObject

  constructor(headers: StringOrStringArrayObject) {
    this.headers = headers
  }

  static BearerTokenParse(token?: string) {
    let bearerToken = safestr(token)
    if (bearerToken.match(REGEX_Bearer)) {
      bearerToken = bearerToken.slice(7)
    }

    return bearerToken
  }

  static BearerTokenParseStrict(token?: string | null) {
    const bearerToken = safestr(token)
    if (bearerToken.match(REGEX_Bearer)) {
      return HttpHeaderManagerBase.BearerTokenParse(bearerToken)
    }

    return ''
  }

  get applicationName() {
    return this.getHeaderStringSafe(HttpHeaderNamesAllowedKeys.ApplicationName)
  }

  getBoolean(name: string) {
    return getBoolean(this.getHeader(name))
  }
  getHeader(name: string) {
    return this.headers[name]
  }
  getHeaderString(name: string) {
    const item = safeArray(
      this.getHeader(name) || this.getHeader(safestrLowercase(name))
    )

    return arrayFirst(item)
  }
  getHeaderStringSafe(name: string) {
    return safestr(this.getHeaderString(name))
  }

  has(name: string) {
    return Object.keys(this.headers).includes(name)
  }

  bearerTokenCache = ''
  get bearerToken() {
    if (!this.bearerTokenCache) {
      this.bearerTokenCache = HttpHeaderManagerBase.BearerTokenParseStrict(
        this.getHeaderStringSafe(HttpHeaderNamesAllowedKeys.Authorization)
      )
    }

    return this.bearerTokenCache
  }

  get jwtToken() {
    if (this.bearerToken) {
      return FromBearerToken(JwtAccessToken, this.bearerToken)
    }
  }
  get jwtTokenMustExistAndBeValid() {
    return FromBearerToken(JwtAccessToken, this.bearerToken)
  }

  get referrer() {
    return this.getHeaderStringSafe('referer')
  }

  get showDebug() {
    return this.getBoolean(HttpHeaderNamesAllowedKeys.ShowDebug)
  }
  get showDebugExists() {
    return this.has(HttpHeaderNamesAllowedKeys.ShowDebug)
  }

  get userId() {
    const jwt = this.jwtTokenMustExistAndBeValid,
      userid = jwt.email
    if (!userid) {
      throw new AppException(CONST_JwtErrorRetrieveUserId, 'userIdFromJwt')
    }

    return userid
  }
}

export class HttpHeaderManager extends HttpHeaderManagerBase {
  constructor(req: IncomingHttpHeaders) {
    super(HttpHeaderManager.HeadersToStringOrStringObject(req))
  }

  static HeadersToStringOrStringObject(headers: IncomingHttpHeaders) {
    const arrNormalizedHeaders: StringOrStringArrayObject = {}

    if (isObject(headers)) {
      // eslint-disable-next-line guard-for-in
      for (const key in headers) {
        arrNormalizedHeaders[key] = headers[key] ?? ''
      }
    }

    return arrNormalizedHeaders
  }
}
