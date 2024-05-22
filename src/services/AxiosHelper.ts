import { AxiosHeaders, AxiosRequestConfig } from 'axios'
import { hasData } from './general.js'

export function getHttpHeaderBearerToken(bearerToken?: string) {
  const headers = new AxiosHeaders()

  if (bearerToken && hasData(bearerToken)) {
    headers.set('Authorization', `Bearer ${bearerToken}`)
  }

  return headers
}

export function getHttpHeaderJson(bearerToken?: string) {
  const headers = getHttpHeaderBearerToken(bearerToken)

  headers.setContentType('application/json')

  return headers
}

export function getHttpHeaderXml(contentLength = 0, bearerToken?: string) {
  const headers = getHttpHeaderBearerToken(bearerToken)

  headers.setContentType('text/xml')

  if (contentLength) {
    headers.setContentLength(contentLength)
  }

  return headers
}

export function getRequestConfig(bearerToken?: string, isJson = true) {
  const headers = isJson ? getHttpHeaderJson(bearerToken) : getHttpHeaderBearerToken(bearerToken)

  const req: AxiosRequestConfig = {
    headers,
  }

  return req
}
