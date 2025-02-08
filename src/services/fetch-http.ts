import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ICaptureResponse } from './CaptureResponse'
import { hasData, isObject } from './general'
import { getHttpHeaderJson } from './AxiosHelper'
import { GrayArrowExceptionHttp } from '../models/GrayArrowException'
import { JSONValue } from '../models/types'

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
   * An array of HTTP Return Codes that you can use to bypass the standard error handling.
   * Useful if you want to send back codes like Unauthorized, File too large, ...
   */
  statusCodesToBypassErrorHandler?: number[]
}

/**
 * Makes an HTTP call to an API using the given HTTP method.
 * @param url The URL endpoint of the API call.
 * @param method The HTTP method to be used.
 * @param sourceFunctionName The callers function name for outputting in potential error calls.
 * @param data Optional body to send with the request. Can be a JSON object or a string.
 * @returns The returned Response object in a Promise.
 */
export async function fetchHttp<Tdata extends FetchDataTypesAllowed = object, Tret = unknown>(
  url: string,
  sourceFunctionName: string,
  method: HttpMethod,
  { data, bearerToken }: HttpFetchRequestProps<Tdata>
) {
  if (!sourceFunctionName || !hasData(sourceFunctionName)) {
    sourceFunctionName = 'fetchHttp'
  }

  if (!hasData(url)) {
    throw new Error(`${sourceFunctionName} passed an empty URL.`)
  }

  let response: AxiosResponse<ICaptureResponse<Tret>>
  try {
    const req: AxiosRequestConfig<Tdata | string> = {
      url,
      method,
      headers: getHttpHeaderJson(bearerToken),
    }

    if (data && hasData(data)) {
      req.data = isObject(data) ? JSON.stringify(data) : String(data)
    }

    response = await axios.request(req)
  } catch (err) {
    if (err instanceof GrayArrowExceptionHttp) {
      throw err
    }

    throw new GrayArrowExceptionHttp(
      err instanceof Error ? err.message : fetchHttp.name,
      sourceFunctionName
    )
  }

  if (!response) {
    throw new GrayArrowExceptionHttp(
      `${sourceFunctionName}: NO response in HTTP ${method} to URL: ${url}.`,
      sourceFunctionName
    )
  }

  if (response.status < 200 || response.status >= 300) {
    let captureResponse: ICaptureResponse<unknown> | undefined
    if (401 === response.status) {
      try {
        captureResponse = response.data
      } catch (jsonerr) {
        /* empty */
      }
    }

    throw new GrayArrowExceptionHttp(
      `${sourceFunctionName}: Error in HTTP ${method} to URL: ${url} with status code ${response.status}.`,
      sourceFunctionName,
      { response, captureResponse }
    )
  }

  return response
}

export async function fetchData<Tdata extends FetchDataTypesAllowed>(
  url: string,
  sourceFunctionName: string,
  method: HttpMethod,
  settings?: HttpFetchRequestProps<Tdata>
) {
  const resp = await fetchHttp(url, sourceFunctionName, method, settings || {})

  return await resp.data
}

export async function fetchJson<Tdata extends FetchDataTypesAllowed = object, Tret = unknown>(
  url: string,
  sourceFunctionName: string,
  method: HttpMethod,
  settings?: HttpFetchRequestProps<Tdata>
) {
  const resp = await fetchHttp<Tdata, Tret>(url, sourceFunctionName, method, settings ?? {})

  return resp.data
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param sourceFunctionName The callers function name for outputting in potential error calls.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDelete<Tret = unknown>(
  url: string,
  sourceFunctionName: string,
  settings: HttpFetchRequestProps<undefined>
) {
  const resp = await fetchHttp<undefined, Tret>(url, sourceFunctionName, 'DELETE', settings)

  return resp.data
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param sourceFunctionName The callers function name for outputting in potential error calls.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDeleteJson<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  url: string,
  sourceFunctionName: string,
  settings: HttpFetchRequestProps<Tdata>
) {
  return fetchJson<Tdata, Tret>(url, sourceFunctionName, 'DELETE', settings)
}

/**
 * Fetches data from an API using an HTTP GET.
 * Returns the JSON data from the API call.
 * @param url The URL endpoint of the API call.
 * @param sourceFunctionName The callers function name for outputting in potential error calls.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned JSON object.
 */
export async function fetchGet<Tret extends FetchDataTypesAllowed>(
  url: string,
  sourceFunctionName: string,
  settings?: HttpFetchRequestProps<Tret>
) {
  return fetchJson<FetchDataTypesAllowed, Tret>(url, sourceFunctionName, 'GET', settings)
}

/**
 * PATCHs data to an API using an HTTP POST.
 * @param url The URL endpoint of the API call.
 * @param sourceFunctionName The callers function name for outputting in potential error calls.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned Response object in a Promise.
 */
export async function fetchPatch<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  url: string,
  sourceFunctionName: string,
  settings: HttpFetchRequestProps<Tdata>
) {
  return fetchJson<Tdata, Tret>(url, sourceFunctionName, 'PATCH', settings)
}

/**
 * Fetches data from an API using an HTTP POST.
 * Returns the JSON data from the API call.
 * @param url The URL endpoint of the API call.
 * @param sourceFunctionName The callers function name for outputting in potential error calls.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned JSON object.
 */
export async function fetchPost<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  url: string,
  sourceFunctionName: string,
  settings?: HttpFetchRequestProps<Tdata>
) {
  return fetchJson<Tdata, Tret>(url, sourceFunctionName, 'POST', settings)
}

/**
 * PUTs data to an API using an HTTP POST.
 * @param url The URL endpoint of the API call.
 * @param sourceFunctionName The callers function name for outputting in potential error calls.
 * @param settings The HTTP parameters for making the HTTP call.
 * @returns The returned Response object in a Promise.
 */
export async function fetchPut<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  url: string,
  sourceFunctionName: string,
  settings: HttpFetchRequestProps<Tdata>
) {
  return fetchJson<Tdata, Tret>(url, sourceFunctionName, 'PUT', settings)
}
