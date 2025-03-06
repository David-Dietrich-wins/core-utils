import { IncomingHttpHeaders } from 'node:http'
import { StringOrStringArrayObject } from '../models/types.mjs'
import { getBoolean, isObject, safestr, safestrLowercase } from './general.mjs'
import { arrayFirst } from './array-helper.mjs'
import { AppException, JwtHelper } from '../index.mjs'

const REGEX_Bearer = /^[Bb][Ee][Aa][Rr][Ee][Rr] /

export const CONST_HttpHeaderShowDebug = 'ShowDebug'
export const CONST_HttpHeaderAuthorization = 'authorization'

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

  static BearerTokenParseStrict(token?: string) {
    const bearerToken = safestr(token)
    if (bearerToken.match(REGEX_Bearer)) {
      return HttpHeaderManagerBase.BearerTokenParse(bearerToken)
    }

    return ''
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

  _bearerTokenCache = ''
  get bearerToken() {
    if (!this._bearerTokenCache) {
      this._bearerTokenCache = HttpHeaderManagerBase.BearerTokenParseStrict(
        this.getHeaderStringSafe(CONST_HttpHeaderAuthorization)
      )
    }

    return this._bearerTokenCache
  }

  get jwtToken() {
    if (this.bearerToken) {
      return JwtHelper.FromString(this.bearerToken)
    }
  }
  get jwtTokenMustExistAndBeValid() {
    return JwtHelper.FromString(this.bearerToken)
  }

  get showDebug() {
    return this.getBoolean(CONST_HttpHeaderShowDebug)
  }
  get showDebugExists() {
    return this.has(CONST_HttpHeaderShowDebug)
  }

  get userId() {
    const jwt = this.jwtTokenMustExistAndBeValid

    const userid = jwt.userId
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
      for (const key in headers) {
        arrNormalizedHeaders[key] = headers[key] ?? ''
      }
    }

    return arrNormalizedHeaders
  }
}
