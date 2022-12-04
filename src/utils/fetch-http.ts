import { ICaptureResponse } from './CaptureResponse.js'
import { GrayArrowExceptionHttp } from './exception-types.js'
import { hasData, isObject, isArray } from './skky.js'
import { JSONValue } from './types.js'

export type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

export type FetchDataTypesAllowed = JSONValue | object | undefined

/**
 * Parameters for making an HTTP call.
 */
export type HttpFetchRequestProps<Tdata extends FetchDataTypesAllowed = object> = {
  /**
   * bearerToken An optional security token to add as Authorization to the HTTP header.
   */
  bearerToken?: string
  /**
   * The object of the data to pass to the API.
   */
  data?: Tdata
  /**
   * The callers function name for outputting in potential error calls.
   */
  fname: string
  /**
   * An array of HTTP Return Codes that you can use to bypass the standard error handling.
   * Useful if you want to send back codes like Unauthorized, File too large, ...
   */
  statusCodesToBypassErrorHandler?: number[]
}

/**
 * An HTTP header to support JSON API calls. An optional Bearer token can be provided as well.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns A JSON ready header for HTTP calls.
 */
export function getHttpHeaderJson(bearerToken?: string) {
  const headers = new Headers({ 'Content-Type': 'application/json' })

  if (hasData(bearerToken)) {
    headers.append('Authorization', `Bearer ${bearerToken}`)
  }

  return headers
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
  url: string,
  method: HttpMethod,
  { data, fname, bearerToken }: HttpFetchRequestProps<Tdata>
) {
  if (!fname || !hasData(fname)) {
    fname = 'fetchHttp'
  }

  if (!hasData(url)) {
    throw new Error(`${fname} passed an empty URL.`)
  }

  let response: Response
  try {
    const req: RequestInit = {
      method,
      headers: getHttpHeaderJson(bearerToken),
    }

    if (data && hasData(data)) {
      req.body = isObject(data) || isArray(data) ? JSON.stringify(data) : String(data)
    }

    response = await fetch(url, req)
  } catch (err) {
    if (err instanceof GrayArrowExceptionHttp) {
      throw err
    }

    throw new GrayArrowExceptionHttp(err instanceof Error ? err.message : fetchHttp.name, fname)
  }

  if (!response) {
    throw new GrayArrowExceptionHttp(
      `${fname}: NO response in HTTP ${method} to URL: ${url}.`,
      fname
    )
  }

  if (!response.ok) {
    let captureResponse: ICaptureResponse<unknown> | undefined
    if (401 === response.status) {
      try {
        captureResponse = await response.json()
      } catch (jsonerr) {
        /* empty */
      }
    }

    throw new GrayArrowExceptionHttp(
      `${fname}: Error in HTTP ${method} to URL: ${url} with status code ${response.status}.`,
      fname,
      { response, captureResponse }
    )
  }

  return response
}

export async function fetchData<Tdata extends FetchDataTypesAllowed>(
  url: string,
  method: HttpMethod,
  settings?: HttpFetchRequestProps<Tdata>
) {
  const resp = await fetchHttp(url, method, settings || { fname: fetchJson.name })

  return await resp.text()
}

export async function fetchJson<Tdata extends FetchDataTypesAllowed = object, Tret = object>(
  url: string,
  method: HttpMethod,
  settings?: HttpFetchRequestProps<Tdata>
) {
  const resp = await fetchHttp(url, method, settings || { fname: fetchJson.name })

  return (await resp.json()) as Tret
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDelete(url: string, settings: HttpFetchRequestProps) {
  return fetchHttp(url, 'DELETE', settings)
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDeleteJson<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  url: string,
  settings: HttpFetchRequestProps<Tdata>
) {
  return fetchJson<Tdata, Tret>(url, 'DELETE', settings)
}

/**
 * Fetches data from an API using an HTTP GET.
 * Returns the JSON data from the API call.
 * @param url The URL endpoint of the API call.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned JSON object.
 */
export async function fetchGet<Tret extends FetchDataTypesAllowed>(
  url: string,
  settings?: HttpFetchRequestProps<Tret>
) {
  return fetchJson<FetchDataTypesAllowed, Tret>(url, 'GET', settings)
}

/**
 * PATCHs data to an API using an HTTP POST.
 * @param url The URL endpoint of the API call.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned Response object in a Promise.
 */
export async function fetchPatch<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  url: string,
  settings: HttpFetchRequestProps<Tdata>
) {
  return fetchJson<Tdata, Tret>(url, 'PATCH', settings)
}

/**
 * Fetches data from an API using an HTTP POST.
 * Returns the JSON data from the API call.
 * @param url The URL endpoint of the API call.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned JSON object.
 */
export async function fetchPost<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  url: string,
  settings?: HttpFetchRequestProps<Tdata>
) {
  return fetchJson<Tdata, Tret>(url, 'POST', settings)
}

/**
 * PUTs data to an API using an HTTP POST.
 * @param url The URL endpoint of the API call.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned Response object in a Promise.
 */
export async function fetchPut<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  url: string,
  settings: HttpFetchRequestProps<Tdata>
) {
  return fetchJson<Tdata, Tret>(url, 'PUT', settings)
}
