import { ICaptureResponse } from "./CaptureResponse"
import { GrayArrowExceptionHttp } from "./exception-types"
import { hasData, isObject, isArray } from "./skky"
import { JSONValue } from "./types"

export type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

export type FetchDataTypesAllowed = JSONValue | object

export type FetchSettings<Tdata extends FetchDataTypesAllowed | unknown = unknown> = {
  url: string,
  method: HttpMethod,
  data?: Tdata,
  fname?: string,
  bearerToken?: string
  statusCodesToBypassErrorHandler?: number[]
}

/**
 * An HTTP header to support JSON API calls. An optional Bearer token can be provided as well.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns A JSON ready header for HTTP calls.
 */
export function getHttpHeaderJson(bearerToken?: string) {
  const headers = new Headers({ "Content-Type": "application/json" })

  if (hasData(bearerToken)) {
    headers.append("Authorization", `Bearer ${bearerToken}`)
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
export async function fetchHttp<Tdata extends FetchDataTypesAllowed | unknown = unknown>(
  { url, method, data, fname, bearerToken }: FetchSettings<Tdata>
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
  }
  catch (err) {
    if (err instanceof GrayArrowExceptionHttp) {
      throw err
    }

    throw new GrayArrowExceptionHttp((err instanceof Error) ? (err as Error).message : fetchHttp.name, fname)
  }

  if (!response) {
    throw new GrayArrowExceptionHttp(`${fname}: NO response in HTTP ${method} to URL: ${url}.`, fname)
  }

  if (!response.ok) {
    let captureResponse: ICaptureResponse<unknown> | undefined
    if (401 === response.status) {
      try {
        captureResponse = await response.json()
      }
      catch (jsonerr) { /* empty */ }
    }

    throw new GrayArrowExceptionHttp(`${fname}: Error in HTTP ${method} to URL: ${url} with status code ${response.status}.`, fname, { response, captureResponse })
  }

  return response
}

export async function fetchData<Tdata extends FetchDataTypesAllowed>(
  settings: FetchSettings<Tdata>
) {
  const resp = await fetchHttp(settings)

  return await resp.text()
}

export async function fetchJson<Tdata extends FetchDataTypesAllowed | unknown, Tret>(
  settings: FetchSettings<Tdata>
): Promise<Tret> {
  const resp = await fetchHttp(settings)

  return await resp.json()
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @param fname The callers function name for outputting in potential error calls.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDelete(settings: FetchSettings) {
  settings.method = "DELETE"

  return fetchHttp(settings)
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @param fname The callers function name for outputting in potential error calls.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDeleteJson<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  settings: FetchSettings<Tdata>
) {
  settings.method = "DELETE"

  return fetchJson<Tdata, Tret>(settings)
}

/**
 * Fetches data from an API using an HTTP GET.
 * Returns the JSON data from the API call.
 * @param url The URL endpoint of the API call.
 * @param fname The callers function name for outputting in potential error calls.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns The returned JSON object.
 */
export async function fetchGet<Tret>(settings: FetchSettings<undefined>) {
  settings.method = "GET"

  return fetchJson<undefined, Tret>(settings)
}

/**
 * PATCHs data to an API using an HTTP POST.
 * @param url The URL endpoint of the API call.
 * @param data The object of the data to pass to the API.
 * @param fname The callers function name for outputting in potential error calls.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns The returned Response object in a Promise.
 */
export async function fetchPatch<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  settings: FetchSettings<Tdata>
) {
  settings.method = "PATCH"

  return fetchJson<Tdata, Tret>(settings)
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
export async function fetchPost<Tdata extends FetchDataTypesAllowed | undefined, Tret = undefined>(
  settings: FetchSettings<Tdata>
) {
  settings.method = "POST"

  return fetchJson<Tdata, Tret>(settings)
}

/**
 * PUTs data to an API using an HTTP POST.
 * @param url The URL endpoint of the API call.
 * @param data The object of the data to pass to the API.
 * @param fname The callers function name for outputting in potential error calls.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns The returned Response object in a Promise.
 */
export async function fetchPut<Tdata extends FetchDataTypesAllowed, Tret = undefined>(
  settings: FetchSettings<Tdata>
) {
  settings.method = "PUT"

  return fetchJson<Tdata, Tret>(settings)
}
