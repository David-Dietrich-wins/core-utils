import {
  GetHttpHeaderApplicationName,
  GetHttpHeaders,
  ParamsEncoder,
  getHttpHeaderJson,
  urlJoin,
} from './html-helper.mjs'
import type { ArrayOrSingle } from '../models/types.mts'

it(ParamsEncoder.name, () => {
  expect(ParamsEncoder()).toBe('')

  expect(
    ParamsEncoder({
      baz: 'qux',
      foo: 'bar',
    })
  ).toBe('baz=qux&foo=bar')
  expect(
    ParamsEncoder({
      baz: 'qux',
      foo: 'bar',
      quux: 'corge',
    })
  ).toBe('baz=qux&foo=bar&quux=corge')

  expect(
    ParamsEncoder({
      baz: 'qux',
      grault: 'garply',
      quux: 'corge',
      url: 'https://we.com/?a=bc&d=ef#bar',
    })
  ).toBe(
    'baz=qux&grault=garply&quux=corge&url=https%3A%2F%2Fwe.com%2F%3Fa%3Dbc%26d%3Def%23bar'
  )
})

it(getHttpHeaderJson.name, () => {
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

it(GetHttpHeaderApplicationName.name, () => {
  const headers = GetHttpHeaderApplicationName('MyApp')
  expect(headers[0]).toBe('x-application-name')
  expect(headers[1]).toBe('MyApp')
})

it(GetHttpHeaders.name, () => {
  const headers = GetHttpHeaders([
    ['Content-Type', 'application/json'],
    ['Authorization', 'Bearer my-token'],
    ['x-test-header'],
  ] as ArrayOrSingle<Readonly<[string, string]>>)
  expect(headers.get('Content-Type')).toBe('application/json')
  expect(headers.get('Authorization')).toBe('Bearer my-token')
  expect(headers.get('x-test-header')).toBe(null)
})

describe(urlJoin.name, () => {
  const baseUrl = 'https://localhost:3000'

  it('Slash relative path', () => {
    const path = '/',
      url = urlJoin(baseUrl, path)

    expect(url).not.toBe(`${baseUrl}//`)
    expect(url).not.toBe(baseUrl)
    expect(url).toBe(`${baseUrl}/`)
  })

  it('Extra slashes relative path', () => {
    const path = '/',
      url = urlJoin(`${baseUrl}/`, path)

    expect(url).toBe(`${baseUrl}/`)
  })

  it('Many slashes relative path', () => {
    const path = '/',
      url = urlJoin(`${baseUrl}///`, path)

    expect(url).toBe(`${baseUrl}/`)
  })

  it('Undefined relative path', () => {
    const path = undefined,
      url = urlJoin(baseUrl, path)

    expect(url).toBe(`${baseUrl}/`)
  })

  it('No relative path', () => {
    const path = undefined,
      url = urlJoin(baseUrl, path, false)

    expect(url).toBe(baseUrl)
  })

  it('No trailing slash', () => {
    expect(urlJoin(baseUrl, '?x=1', true)).toBe(`${baseUrl}/?x=1`)
    expect(urlJoin(baseUrl, '?x=1&y=2', true)).toBe(`${baseUrl}/?x=1&y=2`)
    expect(urlJoin(baseUrl, '?x=1&y=2#link', true)).toBe(
      `${baseUrl}/?x=1&y=2#link`
    )
  })

  it('number', () => {
    expect(urlJoin(baseUrl, 5, true)).toBe(`${baseUrl}/5/`)
  })

  it('exception', () => {
    expect(() => urlJoin(baseUrl, [undefined], true)).toThrow()
  })

  it('add trailing slash', () => {
    const addTrailingSlash = true,
      relativePath = '/test',
      url = urlJoin(baseUrl, relativePath, addTrailingSlash)

    expect(url).toBe(`https://localhost:3000/test/`)
  })

  it('no trailing slash', () => {
    const addTrailingSlash = false,
      relativePath = '/test',
      url = urlJoin(baseUrl, relativePath, addTrailingSlash)

    expect(url).toBe('https://localhost:3000/test')
  })

  it('URL end in /', () => {
    const addTrailingSlash = false,
      relativePath = '/test',
      url = urlJoin(baseUrl, relativePath, addTrailingSlash)

    expect(url).toBe('https://localhost:3000/test')
  })

  it('relative path and url end in /', () => {
    const addTrailingSlash = false,
      relativePath = '/test/',
      url = urlJoin(baseUrl, relativePath, addTrailingSlash)

    expect(url).toBe('https://localhost:3000/test')
  })
})
