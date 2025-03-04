import { jest } from '@jest/globals'
import axios from 'axios'
import {
  getHttpHeaderBearerToken,
  getHttpHeaderJson,
  getHttpHeaderXml,
  getRequestConfig,
} from './AxiosHelper.mjs'

test('post localhost', async () => {
  const mockData = [1, 2, 3]

  const mockAxiosPost = jest.fn().mockReturnValue(mockData)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axios.post = mockAxiosPost as any

  const data = await axios.post('http://localhost', { args: [] })
  expect(data).toStrictEqual(mockData)
})

describe('getHttpHeaderXml', () => {
  test('good', () => {
    // XML
    let header = getHttpHeaderXml()

    expect(header.get('Content-Type')).toBe('text/xml')
    expect(header.get('Authorization')).toBeUndefined()

    // JSON
    header = getHttpHeaderJson()

    expect(header.get('Content-Type')).toBe('application/json')
    expect(header.get('Authorization')).toBeUndefined()

    // Bearer token
    header = getHttpHeaderBearerToken('any token')

    expect(header.get('Content-Type')).toBeUndefined()
    expect(header.get('Authorization')).toBe('Bearer any token')
  })

  test('good with content length', () => {
    // XML
    let header = getHttpHeaderXml(100)

    expect(header.get('Content-Type')).toBe('text/xml')
    expect(header.get('Authorization')).toBeUndefined()

    // JSON
    header = getHttpHeaderJson()

    expect(header.get('Content-Type')).toBe('application/json')
    expect(header.get('Authorization')).toBeUndefined()

    // Bearer token
    header = getHttpHeaderBearerToken('any token')

    expect(header.get('Content-Type')).toBeUndefined()
    expect(header.get('Authorization')).toBe('Bearer any token')
  })
})

describe('getRequestConfig', () => {
  test('json', () => {
    const req = getRequestConfig('any')
    expect(req.headers).toBeDefined()

    expect(req.headers!['Content-Type']).toBe('application/json')
    expect(req.headers!['Authorization']).toBe('Bearer any')
  })
  test('not json', () => {
    const req = getRequestConfig('any', false)
    expect(req.headers).toBeDefined()

    expect(req.headers!['Authorization']).toBe('Bearer any')
  })
})
