import { describe, expect, it } from '@jest/globals'
import {
  getHttpHeaderApplicationName,
  getHttpHeaderJson,
  getHttpHeaders,
  paramsEncoder,
  urlJoin,
} from './html-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import type { ArrayOrSingle } from '../models/types.mjs'

describe('paramsEncoder', () => {
  it('encodes parameters correctly', () => {
    expect.assertions(4)

    expect(paramsEncoder()).toBe('')

    expect(
      paramsEncoder({
        baz: 'qux',
        foo: 'bar',
      })
    ).toBe('baz=qux&foo=bar')
    expect(
      paramsEncoder({
        baz: 'qux',
        foo: 'bar',
        quux: 'corge',
      })
    ).toBe('baz=qux&foo=bar&quux=corge')

    expect(
      paramsEncoder({
        baz: 'qux',
        grault: 'garply',
        quux: 'corge',
        url: 'https://we.com/?a=bc&d=ef#bar',
      })
    ).toBe(
      'baz=qux&grault=garply&quux=corge&url=https%3A%2F%2Fwe.com%2F%3Fa%3Dbc%26d%3Def%23bar'
    )
  })

  it('getHttpHeaderJson', () => {
    expect.assertions(4)

    const headers = getHttpHeaderJson('my-token', [
      ['X-Custom-Header', 'CustomValue'],
    ])

    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer my-token')
    expect(headers.get('X-Custom-Header')).toBe('CustomValue')

    const headersWithoutToken = getHttpHeaderJson(undefined, [
      ['X-Custom-Header', 'CustomValue'],
    ])

    expect(headersWithoutToken.get('Authorization')).toBeNull()
  })

  it('getHttpHeaderApplicationName', () => {
    expect.assertions(2)

    const headers = getHttpHeaderApplicationName('MyApp')

    expect(headers[0]).toBe('x-application-name')
    expect(headers[1]).toBe('MyApp')
  })

  it('getHttpHeaders', () => {
    expect.assertions(3)

    const headers = getHttpHeaders([
      ['Content-Type', 'application/json'],
      ['Authorization', 'Bearer my-token'],
      ['x-test-header'],
    ] as ArrayOrSingle<Readonly<[string, string]>>)

    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer my-token')
    expect(headers.get('x-test-header')).toBeNull()
  })
})

describe('urlJoin', () => {
  const baseUrl = 'https://localhost:3000'

  it('slash relative path', () => {
    expect.assertions(3)

    const path = '/',
      url = urlJoin(baseUrl, path)

    expect(url).not.toBe(`${baseUrl}//`)
    expect(url).not.toBe(baseUrl)
    expect(url).toBe(`${baseUrl}/`)
  })

  it('extra slashes relative path', () => {
    expect.assertions(1)

    const path = '/',
      url = urlJoin(`${baseUrl}/`, path)

    expect(url).toBe(`${baseUrl}/`)
  })

  it('many slashes relative path', () => {
    expect.assertions(1)

    const path = '/',
      url = urlJoin(`${baseUrl}///`, path)

    expect(url).toBe(`${baseUrl}/`)
  })

  it('undefined relative path', () => {
    expect.assertions(1)

    const path = undefined,
      url = urlJoin(baseUrl, path)

    expect(url).toBe(`${baseUrl}/`)
  })

  it('no relative path', () => {
    expect.assertions(1)

    const path = undefined,
      url = urlJoin(baseUrl, path, false)

    expect(url).toBe(baseUrl)
  })

  it('no trailing slash', () => {
    expect.assertions(3)

    expect(urlJoin(baseUrl, '?x=1', true)).toBe(`${baseUrl}/?x=1`)
    expect(urlJoin(baseUrl, '?x=1&y=2', true)).toBe(`${baseUrl}/?x=1&y=2`)
    expect(urlJoin(baseUrl, '?x=1&y=2#link', true)).toBe(
      `${baseUrl}/?x=1&y=2#link`
    )
  })

  it('number', () => {
    expect.assertions(1)

    expect(urlJoin(baseUrl, 5, true)).toBe(`${baseUrl}/5/`)
  })

  it('exception', () => {
    expect.assertions(1)

    expect(() => urlJoin(baseUrl, [undefined], true)).toThrow(
      new AppException(
        'urlJoin() relativePath cannot contain null or undefined values.',
        'Invalid URL'
      )
    )
  })

  it('add trailing slash', () => {
    expect.assertions(1)

    const addTrailingSlash = true,
      relativePath = '/test',
      url = urlJoin(baseUrl, relativePath, addTrailingSlash)

    expect(url).toBe(`https://localhost:3000/test/`)
  })

  it('no trailing /', () => {
    expect.assertions(1)

    const addTrailingSlash = false,
      relativePath = '/test',
      url = urlJoin(baseUrl, relativePath, addTrailingSlash)

    expect(url).toBe('https://localhost:3000/test')
  })

  it('end in /', () => {
    expect.assertions(1)

    const addTrailingSlash = false,
      relativePath = '/test',
      url = urlJoin(baseUrl, relativePath, addTrailingSlash)

    expect(url).toBe('https://localhost:3000/test')
  })

  it('relative path and url end in /', () => {
    expect.assertions(1)

    const addTrailingSlash = false,
      relativePath = '/test/',
      url = urlJoin(baseUrl, relativePath, addTrailingSlash)

    expect(url).toBe('https://localhost:3000/test')
  })
})
