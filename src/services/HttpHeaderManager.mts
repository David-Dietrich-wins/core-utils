import { IncomingHttpHeaders } from 'node:http'
import { StringOrStringArrayObject } from '../models/types.mjs'
import { getBoolean, isObject, safestr, safestrLowercase } from './general.mjs'
import { arrayFirst } from './array-helper.mjs'
import { IntecoreException, JwtHelper } from '../index.mjs'

export const CONST_HttpHeaderShowDebug = 'ShowDebug'
export const CONST_HttpHeaderAuthorization = 'authorization'

/**
 * Base class for managing HTTP Headers. Including JWT support for extracting data.
 */
export class HttpHeaderManagerBase {
  constructor(public headers: StringOrStringArrayObject) {}

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

  get bearerToken() {
    return this.getHeaderStringSafe(CONST_HttpHeaderAuthorization).replace(
      'Bearer ',
      ''
    )
  }
  get jwtToken() {
    return JwtHelper.FromString(this.bearerToken)
  }

  get showDebug() {
    return this.getBoolean(CONST_HttpHeaderShowDebug)
  }
  get showDebugExists() {
    return this.has(CONST_HttpHeaderShowDebug)
  }

  get userId() {
    const jwt = this.jwtToken

    const userid = jwt.userId
    if (!userid) {
      throw new IntecoreException(
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
