import { HttpException } from '../models/IntecoreException.mjs'
import { JSONValue } from '../models/types.mjs'
import { ICaptureResponse } from './CaptureResponse.mjs'
import { hasData, isArray, isObject } from './general.mjs'

export type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

export type FetchDataTypesAllowed = JSONValue | object | undefined

export type HttpFetchRequestProps<
  Tdata extends FetchDataTypesAllowed = object
> = {
  url: string
  data?: Tdata
  fname?: string
  bearerToken?: string
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
  method: HttpMethod,
  { url, data, fname, bearerToken }: HttpFetchRequestProps<Tdata>
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
      req.body =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isObject(data) || isArray(data as any)
          ? JSON.stringify(data)
          : String(data)
    }

    response = await fetch(url, req)
  } catch (err) {
    if (err instanceof HttpException) {
      throw err
    }

    throw new HttpException(
      err instanceof Error ? err.message : fetchHttp.name,
      fname
    )
  }

  if (!response) {
    throw new HttpException(
      `${fname}: NO response in HTTP ${method} to URL: ${url}.`,
      fname
    )
  }

  if (!response.ok) {
    let captureResponse: ICaptureResponse<unknown> | undefined
    if (401 === response.status) {
      try {
        captureResponse = (await response.json()) as ICaptureResponse<unknown>
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (ex) {
        /* empty */
      }
    }

    throw new HttpException(
      `${fname}: Error in HTTP ${method} to URL: ${url} with status code ${response.status}.`,
      fname,
      response.status,
      { response, captureResponse }
    )
  }

  return response
}

export async function fetchData<Tdata extends FetchDataTypesAllowed>(
  method: HttpMethod,
  settings: HttpFetchRequestProps<Tdata>
) {
  const resp = await fetchHttp(method, settings)

  return await resp.text()
}

export async function fetchJson<
  Tdata extends FetchDataTypesAllowed = object,
  Tret = object
>(method: HttpMethod, settings: HttpFetchRequestProps<Tdata>) {
  const resp = await fetchHttp(method, settings)

  return (await resp.json()) as Tret
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @param fname The callers function name for outputting in potential error calls.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDelete(settings: HttpFetchRequestProps) {
  return fetchHttp('DELETE', settings)
}

/**
 * DELETEs data to an API using an HTTP DELETE.
 * @param url The URL endpoint of the API call.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @param fname The callers function name for outputting in potential error calls.
 * @returns The returned Response object in a Promise.
 */
export async function fetchDeleteJson<
  Tdata extends FetchDataTypesAllowed,
  Tret = undefined
>(settings: HttpFetchRequestProps<Tdata>) {
  return fetchJson<Tdata, Tret>('DELETE', settings)
}

/**
 * Fetches data from an API using an HTTP GET.
 * Returns the JSON data from the API call.
 * @param url The URL endpoint of the API call.
 * @param fname The callers function name for outputting in potential error calls.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns The returned JSON object.
 */
export async function fetchGet<Tret extends FetchDataTypesAllowed>(
  settings: HttpFetchRequestProps<Tret>
) {
  return fetchJson<FetchDataTypesAllowed, Tret>('GET', settings)
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
  Tdata extends FetchDataTypesAllowed,
  Tret = undefined
>(settings: HttpFetchRequestProps<Tdata>) {
  return fetchJson<Tdata, Tret>('PATCH', settings)
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
  Tdata extends FetchDataTypesAllowed,
  Tret = undefined
>(settings: HttpFetchRequestProps<Tdata>) {
  return fetchJson<Tdata, Tret>('POST', settings)
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
  Tret = undefined
>(settings: HttpFetchRequestProps<Tdata>) {
  return fetchJson<Tdata, Tret>('PUT', settings)
}
