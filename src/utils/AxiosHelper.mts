import { AxiosRequestConfig } from 'axios'
import { hasData } from './skky.js'

export function getHttpHeaderBearerToken(bearerToken?: string) {
  const headers: Record<string, string> = {}

  if (bearerToken && hasData(bearerToken)) {
    headers['Authorization'] = `Bearer ${bearerToken}`
  }

  return headers
}

/**
 * An HTTP header to support JSON API calls. An optional Bearer token can be provided as well.
 * @param bearerToken An optional security token to add as Authorization to the HTTP header.
 * @returns A JSON ready header for HTTP calls.
 */
export function getHttpHeaderJson(bearerToken?: string) {
  const headers = getHttpHeaderBearerToken(bearerToken)

  headers['Content-Type'] = 'application/json'

  return headers
}

export function getRequestConfig(bearerToken?: string, isJson = true) {
  const headers = isJson
    ? getHttpHeaderJson(bearerToken)
    : getHttpHeaderBearerToken(bearerToken)

  const req: AxiosRequestConfig = {
    headers,
  }

  return req
}
