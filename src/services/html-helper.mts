import {
  type ArrayOrSingle,
  HttpHeaderNamesAllowedKeys,
  type JSONValue,
} from '../models/types.mjs'
import {
  ToSafeArray2d,
  isArray,
  safeArray,
} from '../primitives/array-helper.mjs'
import { hasData, isNullOrUndefined } from '../primitives/object-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { isNumber } from '../primitives/number-helper.mjs'
import { safestr } from '../primitives/string-helper.mjs'

export type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

export type FetchDataTypesAllowed = JSONValue | object | undefined

export type HttpFetchRequestProps<
  Tdata extends FetchDataTypesAllowed = object
> = {
  url: string
  data?: Tdata
  fname?: string
  bearerToken?: string
  headers?: ArrayOrSingle<Readonly<[string, string]>>
  statusCodesToBypassErrorHandler?: number[]
}

export function ParamsEncoder(params?: object): string {
  return Object.entries(params || {}).reduce((acc, [key, value], index) => {
    const encodedKey = encodeURIComponent(key),
      encodedValue = encodeURIComponent(safestr(value)),
      // No & before the first parameter
      separator = index === 0 ? '' : '&'

    return `${acc}${separator}${encodedKey}=${encodedValue}`
  }, '')
}

export function GetHttpHeaders(
  headers: ArrayOrSingle<Readonly<[string, string]>>
) {
  const h = new Headers()

  ToSafeArray2d<Readonly<[string, string]>>(headers).forEach((header) => {
    if (isArray(header, 2)) {
      h.append(header[0], header[1])
    }
  })

  return h
}

/**
 * An HTTP header to support JSON API calls. An optional Bearer token can be provided as well.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns A JSON ready header for HTTP calls.
 */
export function getHttpHeaderJson(
  bearerToken?: string,
  addHeaders?: ArrayOrSingle<Readonly<[string, string]>>
) {
  const headers: Array<Readonly<[string, string]>> = [
    ['Content-Type', 'application/json'],
    ...ToSafeArray2d<Readonly<[string, string]>>(addHeaders),
  ]

  if (hasData(bearerToken)) {
    headers.push(['Authorization', `Bearer ${safestr(bearerToken)}`])
  }

  return GetHttpHeaders(headers)
}

export function GetHttpHeaderApplicationName(appName: string) {
  return [HttpHeaderNamesAllowedKeys.ApplicationName, appName] as const
}

/**
 * Joins two strings to make a full URL. This method guards against trailing and leading /'s and always well forms the URL.
 * If a trailing / is desired, urlJoin checks to ensure there is not already trailing / and variables have not already been added to the URL.
 * @param baseUrl The URL base path to start the joining by /.
 * @param relativePath The URL's relative path to be joined.
 * @param addTrailingSlash Set to true to append a trailing / if this is a pure URL without variables.
 * @returns A safely constructed URL joined with a /.
 */
export function urlJoin(
  baseUrl?: string | null,
  relativePath?: ArrayOrSingle<string | number | null | undefined> | null,
  addTrailingSlash = true
) {
  let pathname = safeArray(relativePath)
      .map((x) => {
        if (isNullOrUndefined(x)) {
          throw new AppException(
            'urlJoin() relativePath cannot contain null or undefined values.',
            'urlJoin',
            safeArray(relativePath)
          )
        }

        return isNumber(x) ? x.toString() : x
      })
      .join('/'),
    url = safestr(baseUrl)

  // Remove any trailing slashes before adding a trailing slash.
  while (url.endsWith('/')) {
    url = url.slice(0, -1)
  }

  // Strip front and end slashes, if any.
  while (pathname.startsWith('/')) {
    pathname = pathname.slice(1)
  }
  while (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }

  if (pathname.length) {
    url += `/${pathname}`
  }

  let trailingSlash = addTrailingSlash
  if (
    url.includes('?') ||
    url.includes('&') ||
    url.includes('#') ||
    url.includes('=')
  ) {
    trailingSlash = false
  }

  if (trailingSlash && !url.endsWith('/')) {
    url += '/'
  }

  return url
}
