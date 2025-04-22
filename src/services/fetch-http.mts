import { AppException, AppExceptionHttp } from '../models/AppException.mjs'
import { ArrayOrSingle, IDataWithStats, JSONValue } from '../models/types.mjs'
import { ApiResponse, IApiResponse } from '../models/ApiResponse.mjs'
import { hasData } from './general.mjs'
import { isObject } from './object-helper.mjs'
import { isArray } from './array-helper.mjs'
import { safeArray } from './array-helper.mjs'
import { InstrumentationStatistics } from '../models/InstrumentationStatistics.mjs'
import { HttpHeaderNamesAllowed } from './HttpHeaderManager.mjs'
import { ToSafeArray2d } from './array-helper.mjs'

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
    headers.push(['Authorization', `Bearer ${bearerToken}`])
  }

  return GetHttpHeaders(headers)
}

export function GetHttpHeaderApplicationName(appName: string) {
  return [HttpHeaderNamesAllowed.ApplicationName, appName] as const
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
 * Makes an HTTP call to an API using the given HTTP method.
 * @param url The URL endpoint of the API call.
 * @param method The HTTP method to be used.
 * @param data Optional body to send with the request. Can be a JSON object or a string.
 * @param fname The callers function name for outputting in potential error calls.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns The returned Response object in a Promise.
 */
export async function fetchHttp<Tdata extends FetchDataTypesAllowed = object>(
  method: HttpMethod,
  { url, data, fname, bearerToken, headers }: HttpFetchRequestProps<Tdata>
) {
  const stats = new InstrumentationStatistics()
  if (!fname || !hasData(fname)) {
    fname = 'fetchHttp'
  }

  if (!hasData(url)) {
    stats.addFailure()
    stats.finished()
    throw new AppException('Empty URL.', fname, stats)
  }

  let response: Response
  try {
    const req: RequestInit = {
      method,
      headers: getHttpHeaderJson(bearerToken, safeArray(headers)),
    }

    if (data && hasData(data)) {
      if ('GET' === method) {
        url += `?${new URLSearchParams(data as Record<string, string>)}`
      } else {
        req.body =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          isObject(data) || isArray(data as any)
            ? JSON.stringify(data)
            : String(data)
      }
    }

    response = await fetch(url, req)
  } catch (err) {
    stats.addFailure()
    stats.finished()
    if (err instanceof AppExceptionHttp) {
      err.obj = stats
      throw err
    }

    const ex = new AppExceptionHttp<InstrumentationStatistics>(
      err instanceof Error ? err.message : fetchHttp.name,
      fname
    )
    ex.obj = stats
    throw ex
  }

  if (!response) {
    stats.addFailure()
    stats.finished()
    const ex = new AppExceptionHttp<InstrumentationStatistics>(
      `${fname}: NO response in HTTP ${method} to URL: ${url}.`,
      fname
    )
    ex.obj = stats
    throw ex
  }

  if (!response.ok) {
    let captureResponse: IApiResponse<unknown> | undefined
    if (401 === response.status) {
      try {
        captureResponse = (await response.json()) as IApiResponse<unknown>
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (ex) {
        stats.addFailure()
        /* empty */
      }
    }

    stats.addFailure()
    stats.finished()
    throw new AppExceptionHttp(
      `${fname}: Error in HTTP ${method} to URL: ${url} with status code ${response.status}.`,
      fname,
      response.status,
      { response, captureResponse, stats }
    )
  }

  const irws: IDataWithStats<Response> = {
    data: response,
    stats,
  }

  return irws
}

export async function fetchData<Tdata extends FetchDataTypesAllowed>(
  method: HttpMethod,
  settings: HttpFetchRequestProps<Tdata>
) {
  const stats = new InstrumentationStatistics()

  const resp = await fetchHttp(method, settings)
  stats.addStats(resp.stats)

  const txt = await resp.data.text()

  stats.addSuccess()
  stats.finished()
  const iws: IDataWithStats<string> = {
    data: txt,
    stats,
  }

  return iws
}

export async function fetchJson<
  TData extends FetchDataTypesAllowed = object,
  Tret extends FetchDataTypesAllowed = TData
>(method: HttpMethod, settings: HttpFetchRequestProps<TData>) {
  const stats = new InstrumentationStatistics()

  const resp = await fetchHttp(method, settings)
  stats.addStats(resp.stats)

  const json = (await resp.data.json()) as IApiResponse<Tret>

  const ret = new ApiResponse<Tret>(
    json.data,
    json.result,
    json.message,
    json.responseCode,
    stats
  )

  stats.addSuccess()
  stats.finished()

  return ret
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @param fname The callers function name for outputting in potential error calls.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDelete(settings: HttpFetchRequestProps) {
  const stats = new InstrumentationStatistics()
  const f = await fetchHttp('DELETE', settings)

  stats.addStats(f.stats)
  const ret = new ApiResponse('', 'Delete', '', 0, stats)

  return ret
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @param fname The callers function name for outputting in potential error calls.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDeleteJson<
  TData extends FetchDataTypesAllowed,
  Tret extends FetchDataTypesAllowed = TData
>(settings: HttpFetchRequestProps<TData>) {
  return fetchJson<TData, Tret>('DELETE', settings)
}

/**
 * Fetches data from an API using an HTTP GET.
 * Returns the JSON data from the API call.
 * @param url The URL endpoint of the API call.
 * @param fname The callers function name for outputting in potential error calls.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns The returned JSON object.
 */
export async function fetchGet<
  Tret extends FetchDataTypesAllowed,
  TData extends FetchDataTypesAllowed = Tret
>(settings: HttpFetchRequestProps<TData>) {
  return fetchJson<TData, Tret>('GET', settings)
}

/**
 * PATCHs data to an API using an HTTP POST.
 * @param url The URL endpoint of the API call.
 * @param data The object of the data to pass to the API.
 * @param fname The callers function name for outputting in potential error calls.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns The returned Response object in a Promise.
 */
export async function fetchPatch<
  TData extends FetchDataTypesAllowed,
  Tret extends FetchDataTypesAllowed = undefined
>(settings: HttpFetchRequestProps<TData>) {
  return fetchJson<TData, Tret>('PATCH', settings)
}

/**
 * Fetches data from an API using an HTTP POST.
 * Returns the JSON data from the API call.
 * @param url The URL endpoint of the API call.
 * @param data The object of the data to pass to the API.
 * @param fname The callers function name for outputting in potential error calls.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns The returned JSON object.
 */
export async function fetchPost<
  Tret extends FetchDataTypesAllowed,
  TData extends FetchDataTypesAllowed = Tret
>(settings: HttpFetchRequestProps<TData>) {
  return fetchJson<TData, Tret>('POST', settings)
}

/**
 * PUTs data to an API using an HTTP POST.
 * @param url The URL endpoint of the API call.
 * @param data The object of the data to pass to the API.
 * @param fname The callers function name for outputting in potential error calls.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns The returned Response object in a Promise.
 */
export async function fetchPut<
  Tdata extends FetchDataTypesAllowed,
  Tret extends FetchDataTypesAllowed = Tdata
>(settings: HttpFetchRequestProps<Tdata>) {
  return fetchJson<Tdata, Tret>('PUT', settings)
}
