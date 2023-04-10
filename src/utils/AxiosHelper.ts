import { AxiosHeaders, AxiosRequestConfig } from 'axios'
import { hasData } from './skky'

export function getHttpHeaderBearerToken(bearerToken?: string) {
  const headers = new AxiosHeaders()

  if (bearerToken && hasData(bearerToken)) {
    headers.set('Authorization', `Bearer ${bearerToken}`)
  }

  return headers
}

export function getHttpHeaderJsonAxios(bearerToken?: string) {
  const headers = getHttpHeaderBearerToken(bearerToken)

  headers.setContentType('application/json')

  return headers
}

export function getRequestConfig(bearerToken?: string, isJson = true) {
  const headers = isJson
    ? getHttpHeaderJsonAxios(bearerToken)
    : getHttpHeaderBearerToken(bearerToken)

  const req: AxiosRequestConfig = {
    headers,
  }

  return req
}
