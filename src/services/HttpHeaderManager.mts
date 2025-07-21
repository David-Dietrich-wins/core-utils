import { FromBearerToken, JwtAccessToken } from './jwt.mjs'
import { safestr, safestrLowercase } from './string-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { IdType } from '../models/id-name.mjs'
import { IncomingHttpHeaders } from 'node:http'
import { StringOrStringArrayObject } from '../models/types.mjs'
import { arrayFirst } from './array-helper.mjs'
import { getBoolean } from './general.mjs'
import { isObject } from './object-helper.mjs'

const REGEX_Bearer = /^[Bb][Ee][Aa][Rr][Ee][Rr] /u

export const CONST_AppNamePolitagree = 'politagree'
export const CONST_AppNameTradePlotter = 'tradeplotter'

export enum HttpHeaderNamesAllowed {
  Authorization = 'authorization',
  ShowDebug = 'ShowDebug',
  ApplicationName = 'x-application-name',
}

export const HttpAllowedHeaders: Readonly<IdType<HttpHeaderNamesAllowed>>[] = [
  { id: HttpHeaderNamesAllowed.ApplicationName, type: 'string' },
  { id: HttpHeaderNamesAllowed.Authorization, type: 'string' },
  { id: HttpHeaderNamesAllowed.ShowDebug, type: 'boolean' },
] as const

/**
 * Base class for managing HTTP Headers. Including JWT support for extracting data.
 */
export class HttpHeaderManagerBase {
  constructor(public headers: StringOrStringArrayObject) {}

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
    return this.getHeaderStringSafe(HttpHeaderNamesAllowed.ApplicationName)
  }

  getBoolean(name: string) {
    return getBoolean(this.getHeader(name))
  }
  getHeader(name: string) {
    return this.headers[name]
  }
  getHeaderString(name: string) {
    return arrayFirst(
      this.getHeader(name) ?? this.getHeader(safestrLowercase(name))
    )
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
        this.getHeaderStringSafe(HttpHeaderNamesAllowed.Authorization)
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
    return this.getBoolean(HttpHeaderNamesAllowed.ShowDebug)
  }
  get showDebugExists() {
    return this.has(HttpHeaderNamesAllowed.ShowDebug)
  }

  get userId() {
    const jwt = this.jwtTokenMustExistAndBeValid,
      userid = jwt.FusionAuthUserId
    if (!userid) {
      throw new AppException(
        'Error retrieving user information from JWT security token.',
        'userIdFromJwt'
      )
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
