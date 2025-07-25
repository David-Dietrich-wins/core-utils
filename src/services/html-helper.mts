import type { ArrayOrSingle, JSONValue } from '../models/types.mjs'
import { ToSafeArray2d, isArray } from './array-helper.mjs'
import { HttpHeaderNamesAllowed } from './HttpHeaderManager.mjs'
import { hasData } from './general.mjs'
import { safestr } from './string-helper.mjs'

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

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class HtmlHelper {
  static ParamsEncoder(params?: object): string {
    return Object.entries(params || {}).reduce((acc, [key, value], index) => {
      const encodedKey = encodeURIComponent(key),
        encodedValue = encodeURIComponent(safestr(value)),
        // No & before the first parameter
        separator = index === 0 ? '' : '&'

      return `${acc}${separator}${encodedKey}=${encodedValue}`
    }, '')
  }

  /**
   * An HTTP header to support JSON API calls. An optional Bearer token can be provided as well.
   * @param bearerToken An optional security token to add as Authorization to the HTTP header.
   * @returns A JSON ready header for HTTP calls.
   */
  static getHttpHeaderJson(
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

    return HtmlHelper.GetHttpHeaders(headers)
  }

  static GetHttpHeaderApplicationName(appName: string) {
    return [HttpHeaderNamesAllowed.ApplicationName, appName] as const
  }

  static GetHttpHeaders(headers: ArrayOrSingle<Readonly<[string, string]>>) {
    const h = new Headers()

    ToSafeArray2d<Readonly<[string, string]>>(headers).forEach((header) => {
      if (isArray(header, 2)) {
        h.append(header[0], header[1])
      }
    })

    return h
  }
}
